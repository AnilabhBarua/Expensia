import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Plus, Receipt, FileText, Plane, IndianRupee } from 'lucide-react';
import { useLocalStorage } from '../contexts/LocalStorageContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { expenses, budgetSettings } = useLocalStorage();
  const navigate = useNavigate();

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budgetSettings.monthlyBudget - totalExpenses;

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = format(new Date(expense.date), 'MMM');
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData).map(([name, amount]) => ({
    name,
    amount,
  }));

  const handleNewExpense = () => {
    navigate('/expenses', { state: { openAddModal: true } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewExpense}
          className="w-full sm:w-auto bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>New Expense</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: 'Pending Expenses', value: expenses.filter(e => e.status === 'pending').length.toString(), icon: FileText, color: 'bg-purple-500' },
          { title: 'Monthly Budget', value: `₹${budgetSettings.monthlyBudget.toFixed(2)}`, icon: IndianRupee, color: 'bg-blue-500' },
          { title: 'Total Expenses', value: `₹${totalExpenses.toFixed(2)}`, icon: Receipt, color: 'bg-emerald-500' },
          { title: 'Remaining', value: `₹${remaining.toFixed(2)}`, icon: Plane, color: 'bg-pink-500' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#212121] p-4 sm:p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base text-gray-400">{item.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{item.value}</h3>
              </div>
              <div className={`${item.color} p-2 sm:p-3 rounded-lg`}>
                <item.icon size={20} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#212121] p-4 sm:p-6 rounded-xl">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Monthly Expenses</h2>
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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