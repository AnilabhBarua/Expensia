import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'expense_tracker'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Routes
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)',
      [title, amount, category, date]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;
  try {
    await pool.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ? WHERE id = ?',
      [title, amount, category, date, id]
    );
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});