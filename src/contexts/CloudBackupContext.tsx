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
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

export const CloudBackupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<Date | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(() => {
    return localStorage.getItem('autoBackupEnabled') === 'true';
  });
  
  const { expenses, categories, budgetSettings, importData } = useLocalStorage();

  useEffect(() => {
    const storedDate = localStorage.getItem('lastBackupDate');
    if (storedDate) {
      setLastBackupDate(new Date(storedDate));
    }

    const token = localStorage.getItem('googleAccessToken');
    if (token) {
      fetch('https://www.googleapis.com/drive/v3/files?fields=files(id,name)', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('googleAccessToken');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('googleAccessToken');
        setIsAuthenticated(false);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('autoBackupEnabled', autoBackupEnabled.toString());
  }, [autoBackupEnabled]);

  const authenticate = async () => {
    try {
      const redirectUri = `${window.location.origin}/auth-callback`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent(SCOPE)}`;
      
      const authWindow = window.open(
        authUrl,
        'Google Auth',
        'width=600,height=600,menubar=no,toolbar=no,location=no,status=no'
      );

      if (!authWindow) {
        throw new Error('Popup blocked. Please allow popups and try again.');
      }

      return new Promise<void>((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'GOOGLE_AUTH') {
            window.removeEventListener('message', handleMessage);
            const { accessToken } = event.data;
            
            if (accessToken) {
              localStorage.setItem('googleAccessToken', accessToken);
              setIsAuthenticated(true);
              resolve();
            } else {
              reject(new Error('Authentication failed'));
            }
          }
        };

        window.addEventListener('message', handleMessage);

        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  };

  const cleanupOldBackups = async (accessToken: string) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=name contains \'expensia-backup-\'&orderBy=createdTime desc',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list backups');
      }

      const { files } = await response.json();
      
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

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const metadata = {
        name: `expensia-backup-${timestamp}.json`,
        mimeType: 'application/json',
      };

      // Create multipart request
      const boundary = 'boundary' + Math.random().toString().slice(2);
      const delimiter = '--' + boundary + '\r\n';
      const closeDelimiter = '--' + boundary + '--';

      // Create the multipart request body
      let requestBody = delimiter;
      requestBody += 'Content-Type: application/json\r\n\r\n';
      requestBody += JSON.stringify(metadata) + '\r\n';
      requestBody += delimiter;
      requestBody += 'Content-Type: application/json\r\n\r\n';
      requestBody += JSON.stringify(backupData) + '\r\n';
      requestBody += closeDelimiter;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        throw new Error('Backup failed');
      }

      const newBackupDate = new Date();
      setLastBackupDate(newBackupDate);
      localStorage.setItem('lastBackupDate', newBackupDate.toISOString());

      await cleanupOldBackups(accessToken);
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    } finally {
      setBackupInProgress(false);
    }
  };

  const restore = async () => {
    try {
      setBackupInProgress(true);
      const accessToken = localStorage.getItem('googleAccessToken');
      
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const listResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=name contains \'expensia-backup-\'&orderBy=createdTime desc&pageSize=1',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!listResponse.ok) {
        throw new Error('Failed to list backups');
      }

      const { files } = await listResponse.json();
      if (!files || files.length === 0) {
        throw new Error('No backup found');
      }

      const latestBackup = files[0];
      const fileResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${latestBackup.id}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!fileResponse.ok) {
        throw new Error('Failed to fetch backup data');
      }

      const backupData = await fileResponse.json();
      
      // Validate backup data structure
      if (!backupData.expenses || !backupData.categories || !backupData.budgetSettings) {
        throw new Error('Invalid backup data format');
      }

      importData(backupData);
    } catch (error) {
      console.error('Restore failed:', error);
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