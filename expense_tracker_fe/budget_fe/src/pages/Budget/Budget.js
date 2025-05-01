import React, { useEffect, useState } from 'react';
import {
  fetchMonthlyBudget,
  createMonthlyBudget,
  fetchMonthlyStats,
} from "../../api"; // Adjust path as needed

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [formData, setFormData] = useState({ month: '', amount: '' });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBudgetAndStats();
  }, []);

  const loadBudgetAndStats = async () => {
    try {
      const budgetData = await fetchMonthlyBudget();
      const statsData = await fetchMonthlyStats();
      setBudget(budgetData[0] || null); // assuming the API returns a list
      setStats(statsData);
    } catch (err) {
      console.error('Error loading budget or stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMonthlyBudget(formData);
      setMessage('Budget created successfully!');
      loadBudgetAndStats();
    } catch (err) {
      console.error('Error submitting budget:', err);
      setMessage('Failed to create budget');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>Monthly Budget</h2>

      {budget ? (
        <div>
          <p><strong>Month:</strong> {budget.month}</p>
          <p><strong>Amount:</strong> ₹{budget.amount}</p>
        </div>
      ) : (
        <p>No monthly budget found. Add one below:</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          name="month"
          placeholder="YYYY-MM"
          value={formData.month}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Budget</button>
      </form>

      {message && <p>{message}</p>}

      {stats && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Monthly Stats</h3>
          <p><strong>Income:</strong> ₹{stats.income}</p>
          <p><strong>Expense:</strong> ₹{stats.expense}</p>
          <p><strong>Savings:</strong> ₹{stats.savings}</p>
        </div>
      )}
    </div>
  );
};

export default Budget;
