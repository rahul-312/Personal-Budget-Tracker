import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchTransactions,
  fetchTransactionDetail,
  deleteTransaction,
} from '../../api';
import "./TransactionHistory.css"

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getTransactionHistory = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionHistory();
  }, []);

  const handleView = async (id) => {
    try {
      const detail = await fetchTransactionDetail(id);
      Swal.fire({
        title: 'Transaction Details',
        html: `
          <p><strong>Type:</strong> ${detail.transaction_type}</p>
          <p><strong>Amount:</strong> ${detail.amount}</p>
          <p><strong>Category:</strong> ${detail.category}</p>
          <p><strong>Date:</strong> ${detail.date}</p>
        `,
        confirmButtonText: 'Close',
        customClass: {
          popup: 'swal2-popup-wide'
        }
      });
    } catch (err) {
      console.error("Failed to fetch transaction detail", err);
      Swal.fire('Error', 'Failed to load details', 'error');
    }
  };
  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to recover this transaction!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteTransaction(id);
        Swal.fire('Deleted!', 'Transaction has been deleted.', 'success');
        getTransactionHistory(); // Refresh list
      } catch (err) {
        console.error("Failed to delete transaction", err);
        Swal.fire('Error', 'Failed to delete transaction', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/transactions/edit/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Transaction History</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
              <td>
                <button onClick={() => handleView(transaction.id)}>View</button>{' '}
                <button onClick={() => handleEdit(transaction.id)}>Edit</button>{' '}
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
