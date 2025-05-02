import React, { useState, useEffect } from 'react';
import { fetchExpenseSummary } from '../../api'; // Ensure this fetches yearly expense summary

const YearlyExpense = () => {
  const [summary, setSummary] = useState({});
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getYearlyExpenses = async () => {
      try {
        const data = await fetchExpenseSummary('yearly'); // Pass 'yearly' to fetch yearly data
        setSummary(data.summary);
        setPeriod(data.period);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
      } catch (err) {
        console.error('Error fetching yearly expenses:', err);
        setError('Failed to fetch yearly expenses.');
      } finally {
        setLoading(false);
      }
    };

    getYearlyExpenses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Yearly Expense Summary</h2>
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

export default YearlyExpense;
