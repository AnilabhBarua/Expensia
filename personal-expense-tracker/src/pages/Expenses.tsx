import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockExpenses: Expense[] = [
  {
    id: 1,
    title: 'Office Supplies',
    amount: 150.00,
    category: 'Business',
    date: '2024-02-15',
    status: 'approved'
  },
  {
    id: 2,
    title: 'Client Dinner',
    amount: 320.00,
    category: 'Entertainment',
    date: '2024-02-14',
    status: 'pending'
  },
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Expenses</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </motion.button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#212121] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="bg-[#212121] p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="bg-[#212121] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="px-6 py-4 text-gray-400 font-medium">Title</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Category</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Amount</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <motion.tr
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-[#2a2a2a] text-white"
              >
                <td className="px-6 py-4">{expense.title}</td>
                <td className="px-6 py-4">{expense.category}</td>
                <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
                <td className="px-6 py-4">{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    expense.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                    expense.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:text-emerald-500 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#212121] p-6 rounded-xl w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Add New Expense</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpensesPage;