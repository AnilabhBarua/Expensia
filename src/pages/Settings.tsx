import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, IndianRupee, PieChart, Shield, Download, Upload } from 'lucide-react';
import { useLocalStorage } from '../contexts/LocalStorageContext';

const Settings = () => {
  const {
    budgetSettings,
    updateBudgetSettings,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    expenses,
    importData
  } = useLocalStorage();

  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#212121] p-6 rounded-xl"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-500 p-3 rounded-lg">
              <Shield size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleExportData}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2"
            >
              <Download size={18} />
              <span>Export Backup</span>
            </button>
            <button 
              onClick={handleImportClick}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2"
            >
              <Upload size={18} />
              <span>Import Backup</span>
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