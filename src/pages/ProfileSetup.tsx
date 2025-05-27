import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { Camera, IndianRupee, Bell, ArrowLeft, Upload } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUser();
  const { updateBudgetSettings, importData } = useLocalStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    monthlyBudget: '2500',
    alertThreshold: '80',
    notificationsEnabled: true,
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
        // Pre-fill form with imported budget settings if available
        if (data.budgetSettings) {
          setFormData(prev => ({
            ...prev,
            monthlyBudget: data.budgetSettings.monthlyBudget.toString(),
            alertThreshold: data.budgetSettings.alertThreshold.toString(),
            notificationsEnabled: data.budgetSettings.notificationsEnabled,
          }));
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name: formData.name,
      photoUrl: formData.photoUrl,
      isProfileComplete: true,
    });

    updateBudgetSettings({
      monthlyBudget: parseFloat(formData.monthlyBudget),
      alertThreshold: parseInt(formData.alertThreshold),
      notificationsEnabled: formData.notificationsEnabled,
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 text-white flex items-center space-x-2 hover:text-emerald-500 transition-colors"
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#212121] p-8 rounded-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Setup Your Profile</h1>
          <button
            onClick={handleImportClick}
            className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#2a2a2a] overflow-hidden">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="photo"
                className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors"
              >
                <Camera size={16} className="text-white" />
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Monthly Budget</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                className="w-full bg-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Alert Threshold (%)</label>
            <input
              type="number"
              value={formData.alertThreshold}
              onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Enable Notifications</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
              className={`w-12 h-6 rounded-full transition-colors ${
                formData.notificationsEnabled ? 'bg-emerald-500' : 'bg-[#2a2a2a]'
              }`}
            >
              <motion.div
                animate={{ x: formData.notificationsEnabled ? 24 : 2 }}
                className="w-5 h-5 bg-white rounded-full"
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Complete Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;