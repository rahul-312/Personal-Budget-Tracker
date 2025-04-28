import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../api'; // Only fetch
import Sidebar from '../../components/Sidebar';
import "./History.css";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 5; // 👈 Number of transactions per page

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        setError('Error fetching transactions');
      }
    };
    loadTransactions();
  }, []);

  // Calculate the indexes
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(transactions.length / transactionsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Transaction History</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr key={transaction.id}>
                  <td>{indexOfFirstTransaction + index + 1}</td> {/* 👈 Correct numbering across pages */}
                  <td>{transaction.transaction_type}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No transactions available.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {Math.ceil(transactions.length / transactionsPerPage)}</span>
          <button onClick={nextPage} disabled={currentPage === Math.ceil(transactions.length / transactionsPerPage)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
