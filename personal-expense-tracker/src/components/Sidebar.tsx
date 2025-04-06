import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CreditCard, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-[#212121] text-white p-6 space-y-8"
    >
      <div className="flex items-center space-x-3 mb-8">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-semibold">Anilabh Barua</h2>
          <p className="text-sm text-gray-400">Personal Account</p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#2a2a2a] text-emerald-400' : 'hover:bg-[#2a2a2a]'
            }`
          }
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#2a2a2a] text-emerald-400' : 'hover:bg-[#2a2a2a]'
            }`
          }
        >
          <CreditCard size={20} />
          <span>Expenses</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#2a2a2a] text-emerald-400' : 'hover:bg-[#2a2a2a]'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="absolute bottom-8 left-6 right-6">
        <button className="flex items-center space-x-3 p-3 w-full text-gray-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
          <HelpCircle size={20} />
          <span>Support</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;