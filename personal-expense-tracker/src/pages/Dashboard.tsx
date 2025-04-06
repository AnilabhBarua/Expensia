import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Plus, Receipt, FileText, Plane } from 'lucide-react';

const data = [
  { name: 'Jan', amount: 400 },
  { name: 'Feb', amount: 300 },
  { name: 'Mar', amount: 600 },
  { name: 'Apr', amount: 200 },
  { name: 'May', amount: 500 },
  { name: 'Jun', amount: 450 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Expense</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Pending Tasks', value: '5', icon: FileText, color: 'bg-purple-500' },
          { title: 'Monthly Budget', value: '$2,500', icon: Receipt, color: 'bg-blue-500' },
          { title: 'Total Expenses', value: '$1,240', icon: Receipt, color: 'bg-emerald-500' },
          { title: 'Remaining', value: '$1,260', icon: Plane, color: 'bg-pink-500' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#212121] p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">{item.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{item.value}</h3>
              </div>
              <div className={`${item.color} p-3 rounded-lg`}>
                <item.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#212121] p-6 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-6">Monthly Expenses</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;