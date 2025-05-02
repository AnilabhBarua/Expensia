import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import ProfileSetup from './pages/ProfileSetup';
import DevelopmentTag from './components/DevelopmentTag';
import { useUser } from './contexts/UserContext';
import { Menu } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile.isProfileComplete) {
      navigate('/setup');
    }
  }, [userProfile.isProfileComplete, navigate]);

  return userProfile.isProfileComplete ? children : null;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <DevelopmentTag />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row min-h-screen bg-[#1a1a1a]">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden fixed top-4 left-4 z-50 bg-[#212121] p-2 rounded-lg text-white"
                >
                  <Menu size={24} />
                </button>

                {/* Sidebar with mobile support */}
                <div
                  className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  } md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 ease-in-out`}
                >
                  <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </div>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto"
                  >
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/expenses" element={<Expenses />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </motion.div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;