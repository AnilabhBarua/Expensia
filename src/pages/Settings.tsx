import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, IndianRupee, PieChart, Shield, Download, Upload, User, Camera, Cloud } from 'lucide-react';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { useCloudBackup } from '../contexts/CloudBackupContext';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';

const Settings = () => {
  const {
    expenses,
    categories,
    budgetSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    importData
  } = useLocalStorage();

  const {
    isAuthenticated,
    lastBackupDate,
    backupInProgress,
    autoBackupEnabled,
    setAutoBackupEnabled,
    authenticate,
    backup,
    restore
  } = useCloudBackup();

  const { userProfile, updateProfile } = useUser();
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile.name,
    photoUrl: userProfile.photoUrl,
  });

  const handleBudgetChange = (value: string) => {
    updateBudgetSettings({
      ...budgetSettings,
      monthlyBudget: parseFloat(value) || 0,
    });
  };

  const handleNotificationsChange = () => {
    updateBudgetSettings({
      ...budgetSettings,
      notificationsEnabled: !budgetSettings.notificationsEnabled,
    });
  };

  const handleAlertThresholdChange = (value: string) => {
    updateBudgetSettings({
      ...budgetSettings,
      alertThreshold: parseInt(value) || 0,
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory({
        name: newCategory.trim(),
        budgetPercentage: 0,
      });
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleUpdateCategoryPercentage = (id: string, percentage: number) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      updateCategory({
        ...category,
        budgetPercentage: percentage,
      });
    }
  };

  const handleExportData = () => {
    const data = {
      expenses,
      categories,
      budgetSettings,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expensia-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        importData(data);
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    updateProfile({
      name: profileData.name,
      photoUrl: profileData.photoUrl,
    });
    setEditingProfile(false);
  };

  const handleCloudBackup = async () => {
    try {
      if (!isAuthenticated) {
        await authenticate();
      }
      await backup();
    } catch (error) {
      console.error('Cloud backup failed:', error);
      alert('Failed to backup to Google Drive. Please try again.');
    }
  };

  const handleCloudRestore = async () => {
    try {
      if (!isAuthenticated) {
        await authenticate();
      }
      await restore();
      alert('Data restored successfully from Google Drive!');
    } catch (error) {
      console.error('Cloud restore failed:', error);
      alert('Failed to restore from Google Drive. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#212121] p-6 rounded-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <User size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#2a2a2a] overflow-hidden">
                  {(editingProfile ? profileData.photoUrl : userProfile.photoUrl) ? (
                    <img
                      src={editingProfile ? profileData.photoUrl : userProfile.photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                {editingProfile && (
                  <>
                    <button
                      onClick={() => profilePhotoRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors"
                    >
                      <Camera size={16} className="text-white" />
                    </button>
                    <input
                      type="file"
                      ref={profilePhotoRef}
                      onChange={handleProfilePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              {editingProfile ? (
                <>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Your name"
                  />
                  <div className="flex space-x-3 w-full">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">{userProfile.name}</h3>
                    <p className="text-gray-400">Personal Account</p>
                  </div>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Budget Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#212121] p-6 rounded-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-emerald-500 p-3 rounded-lg">
              <IndianRupee size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Budget Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Monthly Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={budgetSettings.monthlyBudget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white pl-8 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Budget Period</label>
              <select className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#212121] p-6 rounded-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Bell size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Enable Notifications</span>
              <button
                onClick={handleNotificationsChange}
                className={`w-12 h-6 rounded-full transition-colors ${
                  budgetSettings.notificationsEnabled ? 'bg-emerald-500' : 'bg-[#2a2a2a]'
                }`}
              >
                <motion.div
                  animate={{ x: budgetSettings.notificationsEnabled ? 24 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Alert Threshold (%)</label>
              <input
                type="number"
                value={budgetSettings.alertThreshold}
                onChange={(e) => handleAlertThresholdChange(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#212121] p-6 rounded-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500 p-3 rounded-lg">
              <PieChart size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Categories</h2>
          </div>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between text-gray-400 py-2 border-b border-[#2a2a2a]">
                <span>{category.name}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={category.budgetPercentage}
                    onChange={(e) => handleUpdateCategoryPercentage(category.id, parseFloat(e.target.value))}
                    className="w-16 bg-[#2a2a2a] text-white px-2 py-1 rounded"
                  />
                  <span>%</span>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-500 hover:text-red-400 ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {showAddCategory ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 bg-[#2a2a2a] text-white px-3 py-1 rounded"
                />
                <button
                  onClick={handleAddCategory}
                  className="text-emerald-500 hover:text-emerald-400"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="text-gray-500 hover:text-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCategory(true)}
                className="text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                + Add Category
              </button>
            )}
          </div>
        </motion.div>

        {/* Data Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#212121] p-6 rounded-xl col-span-2"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-500 p-3 rounded-lg">
              <Shield size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Automatic Cloud Backup</span>
              <button
                onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoBackupEnabled ? 'bg-emerald-500' : 'bg-[#2a2a2a]'
                }`}
              >
                <motion.div
                  animate={{ x: autoBackupEnabled ? 24 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <button 
                onClick={handleCloudBackup}
                disabled={backupInProgress}
                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Cloud size={18} />
                <span>{backupInProgress ? 'Backing up...' : 'Backup to Google Drive'}</span>
              </button>
              {lastBackupDate && (
                <p className="text-sm text-gray-400 text-center">
                  Last backup: {format(lastBackupDate, 'MMM dd, yyyy HH:mm')}
                </p>
              )}
            </div>

            <button 
              onClick={handleCloudRestore}
              disabled={backupInProgress}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Cloud size={18} />
              <span>{backupInProgress ? 'Restoring...' : 'Restore from Google Drive'}</span>
            </button>

            <div className="border-t border-[#2a2a2a] my-4"></div>

            <button 
              onClick={handleExportData}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2"
            >
              <Download size={18} />
              <span>Export Local Backup</span>
            </button>
            
            <button 
              onClick={handleImportClick}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2"
            >
              <Upload size={18} />
              <span>Import Local Backup</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;