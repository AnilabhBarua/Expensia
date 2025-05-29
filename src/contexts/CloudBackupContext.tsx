import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './LocalStorageContext';
import { debounce } from 'lodash';

interface CloudBackupContextType {
  isAuthenticated: boolean;
  lastBackupDate: Date | null;
  backupInProgress: boolean;
  autoBackupEnabled: boolean;
  setAutoBackupEnabled: (enabled: boolean) => void;
  authenticate: () => Promise<void>;
  backup: () => Promise<void>;
  restore: () => Promise<void>;
}

const CloudBackupContext = createContext<CloudBackupContextType | undefined>(undefined);

const AUTO_BACKUP_INTERVAL = 1000 * 60 * 60; // 1 hour
const BACKUP_VERSIONS_TO_KEEP = 10;

export const CloudBackupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<Date | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(() => {
    return localStorage.getItem('autoBackupEnabled') === 'true';
  });
  
  const { expenses, categories, budgetSettings, importData } = useLocalStorage();

  // Load last backup date from localStorage
  useEffect(() => {
    const storedDate = localStorage.getItem('lastBackupDate');
    if (storedDate) {
      setLastBackupDate(new Date(storedDate));
    }
  }, []);

  // Save auto backup preference
  useEffect(() => {
    localStorage.setItem('autoBackupEnabled', autoBackupEnabled.toString());
  }, [autoBackupEnabled]);

  const authenticate = async () => {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const scope = 'https://www.googleapis.com/auth/drive.file';
      
      const authWindow = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${window.location.origin}/auth-callback`,
        'Auth',
        'width=500,height=600'
      );

      if (authWindow) {
        window.addEventListener('message', async (event) => {
          if (event.data.type === 'GOOGLE_AUTH') {
            setIsAuthenticated(true);
            localStorage.setItem('googleAccessToken', event.data.accessToken);
          }
        });
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  };

  const cleanupOldBackups = async (accessToken: string) => {
    try {
      const listResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=name contains \'expensia-backup-\'&orderBy=createdTime desc',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { files } = await listResponse.json();
      
      // Keep only the latest BACKUP_VERSIONS_TO_KEEP versions
      const filesToDelete = files.slice(BACKUP_VERSIONS_TO_KEEP);
      
      for (const file of filesToDelete) {
        await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  };

  const backup = async () => {
    try {
      setBackupInProgress(true);
      const accessToken = localStorage.getItem('googleAccessToken');
      
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const backupData = {
        expenses,
        categories,
        budgetSettings,
        timestamp: new Date().toISOString(),
      };

      const file = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
      const metadata = {
        name: `expensia-backup-${new Date().toISOString()}.json`,
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error('Backup failed');
      }

      const newBackupDate = new Date();
      setLastBackupDate(newBackupDate);
      localStorage.setItem('lastBackupDate', newBackupDate.toISOString());

      // Cleanup old backups
      await cleanupOldBackups(accessToken);
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    } finally {
      setBackupInProgress(false);
    }
  };

  // Debounced backup function for data changes
  const debouncedBackup = useCallback(
    debounce(async () => {
      if (autoBackupEnabled && isAuthenticated) {
        try {
          await backup();
        } catch (error) {
          console.error('Auto backup failed:', error);
        }
      }
    }, 5000),
    [autoBackupEnabled, isAuthenticated]
  );

  // Watch for data changes
  useEffect(() => {
    if (autoBackupEnabled && isAuthenticated) {
      debouncedBackup();
    }
  }, [expenses, categories, budgetSettings, autoBackupEnabled, isAuthenticated]);

  // Periodic backup
  useEffect(() => {
    if (!autoBackupEnabled || !isAuthenticated) return;

    const backupInterval = setInterval(async () => {
      try {
        await backup();
      } catch (error) {
        console.error('Periodic backup failed:', error);
      }
    }, AUTO_BACKUP_INTERVAL);

    return () => clearInterval(backupInterval);
  }, [autoBackupEnabled, isAuthenticated]);

  const restore = async () => {
    try {
      setBackupInProgress(true);
      const accessToken = localStorage.getItem('googleAccessToken');
      
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      // List files to find the latest backup
      const listResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=name contains \'expensia-backup-\'&orderBy=createdTime desc',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { files } = await listResponse.json();
      if (!files || files.length === 0) {
        throw new Error('No backup found');
      }

      // Get the latest backup file
      const latestBackup = files[0];
      const fileResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${latestBackup.id}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const backupData = await fileResponse.json();
      importData(backupData);
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    } finally {
      setBackupInProgress(false);
    }
  };

  return (
    <CloudBackupContext.Provider
      value={{
        isAuthenticated,
        lastBackupDate,
        backupInProgress,
        autoBackupEnabled,
        setAutoBackupEnabled,
        authenticate,
        backup,
        restore,
      }}
    >
      {children}
    </CloudBackupContext.Provider>
  );
};

export const useCloudBackup = () => {
  const context = useContext(CloudBackupContext);
  if (context === undefined) {
    throw new Error('useCloudBackup must be used within a CloudBackupProvider');
  }
  return context;
};