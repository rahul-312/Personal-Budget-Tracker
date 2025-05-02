import React, { useState, useEffect } from 'react';
import { fetchMonthlyExpenses } from '../../api'; // Make sure this function is correctly implemented
import './MonthlyExpenses.css';

const MonthlyExpense = () => {
  const [summary, setSummary] = useState({});
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMonthlyExpenses = async () => {
      try {
        const data = await fetchMonthlyExpenses(); // Expected response shape: { period, start_date, end_date, summary }
        setSummary(data.summary);
        setPeriod(data.period);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to fetch monthly expenses.');
      } finally {
        setLoading(false);
      }
    };

    getMonthlyExpenses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="monthly-expense-container">
      <h2>Monthly Expense Summary</h2>
      <p>
        <strong>Period:</strong> {period} <br />
        <strong>From:</strong> {startDate} <br />
        <strong>To:</strong> {endDate}
      </p>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([category, amount]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyExpense;
