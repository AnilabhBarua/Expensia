import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CreditCard, Settings, HelpCircle, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { userProfile } = useUser();

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-[#212121] text-white p-6 space-y-8 h-screen"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          {userProfile.photoUrl ? (
            <img
              src={userProfile.photoUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
              <span className="text-gray-400 text-xl">
                {userProfile.name ? userProfile.name[0].toUpperCase() : '?'}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-semibold">{userProfile.name || 'Guest User'}</h2>
            <p className="text-sm text-gray-400">Personal Account</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          onClick={onClose}
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
          onClick={onClose}
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
          onClick={onClose}
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