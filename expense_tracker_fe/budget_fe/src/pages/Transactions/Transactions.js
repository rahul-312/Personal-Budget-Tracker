import React, { useState } from 'react';
import { createTransaction } from '../../api'; // Only create
import Sidebar from '../../components/Sidebar';
import "./Transactions.css";

const Transactions = () => {
  const [formData, setFormData] = useState({
    transaction_type: '',
    amount: '',
    category: '',
    date: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(formData);
      setFormData({
        transaction_type: '',
        amount: '',
        category: '',
        date: ''
      });
      setError(null);
      alert('Transaction added successfully');
    } catch (error) {
      setError('Error creating transaction');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Add Transaction</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          {/* Form fields... (same as you have) */}
          <div>
            <label>Transaction Type</label>
            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Necessities">Necessities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Add Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
