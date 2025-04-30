import React, { createContext, useContext, useEffect, useState } from 'react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Category {
  id: string;
  name: string;
  budgetPercentage: number;
}

interface BudgetSettings {
  monthlyBudget: number;
  alertThreshold: number;
  notificationsEnabled: boolean;
}

interface LocalStorageContextType {
  expenses: Expense[];
  categories: Category[];
  budgetSettings: BudgetSettings;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateBudgetSettings: (settings: BudgetSettings) => void;
}

const defaultBudgetSettings: BudgetSettings = {
  monthlyBudget: 2500,
  alertThreshold: 80,
  notificationsEnabled: true,
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', budgetPercentage: 30 },
  { id: '2', name: 'Transportation', budgetPercentage: 20 },
  { id: '3', name: 'Entertainment', budgetPercentage: 15 },
  { id: '4', name: 'Shopping', budgetPercentage: 15 },
  { id: '5', name: 'Bills & Utilities', budgetPercentage: 20 },
];

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem('expenses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('categories');
      return stored ? JSON.parse(stored) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>(() => {
    try {
      const stored = localStorage.getItem('budgetSettings');
      return stored ? JSON.parse(stored) : defaultBudgetSettings;
    } catch {
      return defaultBudgetSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Failed to save expenses to localStorage:', error);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories to localStorage:', error);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('budgetSettings', JSON.stringify(budgetSettings));
    } catch (error) {
      console.error('Failed to save budget settings to localStorage:', error);
    }
  }, [budgetSettings]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: crypto.randomUUID(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (category: Category) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateBudgetSettings = (settings: BudgetSettings) => {
    setBudgetSettings(settings);
  };

  return (
    <LocalStorageContext.Provider
      value={{
        expenses,
        categories,
        budgetSettings,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBudgetSettings,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context;
};