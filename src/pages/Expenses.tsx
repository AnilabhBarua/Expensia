import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useLocalStorage } from '../contexts/LocalStorageContext';

const ExpensesPage = () => {
  const { expenses, categories, addExpense, updateExpense, deleteExpense } = useLocalStorage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState<null | typeof expenses[0]>(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      status: 'pending' as const,
    };

    if (editingExpense) {
      updateExpense({ ...expenseData, id: editingExpense.id });
    } else {
      addExpense(expenseData);
    }

    setShowAddModal(false);
    setEditingExpense(null);
    setFormData({
      title: '',
      amount: '',
      category: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const handleEdit = (expense: typeof expenses[0]) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    });
    setShowAddModal(true);
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Expenses</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingExpense(null);
            setFormData({
              title: '',
              amount: '',
              category: '',
              date: format(new Date(), 'yyyy-MM-dd'),
            });
            setShowAddModal(true);
          }}
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
            {filteredExpenses.map((expense) => (
              <motion.tr
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-[#2a2a2a] text-white"
              >
                <td className="px-6 py-4">{expense.title}</td>
                <td className="px-6 py-4">{expense.category}</td>
                <td className="px-6 py-4">₹{expense.amount.toFixed(2)}</td>
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
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-1 hover:text-emerald-500 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
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
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingExpense(null);
                    }}
                    className="flex-1 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    {editingExpense ? 'Update' : 'Add'} Expense
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