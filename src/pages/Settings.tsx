import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, DollarSign, PieChart, Shield } from 'lucide-react';

const Settings = () => {
  const [monthlyBudget, setMonthlyBudget] = useState('2500');
  const [notifications, setNotifications] = useState(true);

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
              <DollarSign size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Budget Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Monthly Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
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
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-emerald-500' : 'bg-[#2a2a2a]'
                }`}
              >
                <motion.div
                  animate={{ x: notifications ? 24 : 2 }}
                  className="w-5 h-5 bg-white rounded-full"
                />
              </button>
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Alert Threshold (%)</label>
              <input
                type="number"
                defaultValue="80"
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
            <div className="flex items-center justify-between text-gray-400 py-2 border-b border-[#2a2a2a]">
              <span>Food & Dining</span>
              <span>30%</span>
            </div>
            <div className="flex items-center justify-between text-gray-400 py-2 border-b border-[#2a2a2a]">
              <span>Transportation</span>
              <span>20%</span>
            </div>
            <div className="flex items-center justify-between text-gray-400 py-2 border-b border-[#2a2a2a]">
              <span>Entertainment</span>
              <span>15%</span>
            </div>
            <button className="text-emerald-500 hover:text-emerald-400 transition-colors">
              + Add Category
            </button>
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
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors">
              Change Password
            </button>
            <button className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors">
              Two-Factor Authentication
            </button>
            <button className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors">
              Export Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;