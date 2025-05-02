import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart as ChartBar, Shield, Wallet, PieChart, Settings, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/2TT.png" alt="Expensia" className="h-20 w-13 mr-0" />
          <span className="text-2xl font-bold text-white">Expensia</span>
        </div>
        <Link
          to="/dashboard"
          className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all"
        >
          Get Started
        </Link>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Make Every Rupee <span className="text-emerald-500">Make Sense</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-8"
          >
            Take control of your finances with our powerful expense tracking solution
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition-all text-lg"
            >
              <span>Start Tracking</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: ChartBar,
              title: "Expense Analytics",
              description: "Visualize your spending patterns with interactive charts and graphs"
            },
            {
              icon: Wallet,
              title: "Budget Management",
              description: "Set and track budgets to keep your spending in check"
            },
            {
              icon: PieChart,
              title: "Category Tracking",
              description: "Organize expenses by categories for better financial planning"
            },
            {
              icon: Shield,
              title: "Secure Data",
              description: "Your financial data is protected with industry-standard security"
            },
            {
              icon: Settings,
              title: "Customizable",
              description: "Personalize the app to match your financial goals"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-[#212121] p-6 rounded-xl hover:bg-[#2a2a2a] transition-all"
            >
              <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#212121] p-8 rounded-xl inline-block"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Ready to take control?</h2>
            <p className="text-gray-400 mb-6">Join thousands of users who trust Expensia for their expense tracking</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;