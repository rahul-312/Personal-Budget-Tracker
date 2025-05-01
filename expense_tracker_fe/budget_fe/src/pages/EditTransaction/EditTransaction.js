// src/pages/EditTransaction/EditTransaction.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTransactionDetail, updateTransaction } from '../../api';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transaction = await fetchTransactionDetail(id);
        setFormData(transaction);
      } catch (err) {
        alert("Failed to fetch transaction details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction(id, formData);
      alert('Transaction updated');
      navigate('/transactions');
    } catch (err) {
      alert('Failed to update transaction');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date: </label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Description: </label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Amount: </label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div>
          <label>Category: </label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditTransaction;
