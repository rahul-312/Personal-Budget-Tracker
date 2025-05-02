import React, { useState, useEffect } from 'react';
import { fetchFinancialStats } from '../../api';  // Import the API function
import './MonthlyStats.css';

const MonthlyStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMonthlyStats = async () => {
      try {
        const data = await fetchFinancialStats('monthly'); // Fetch data for monthly period
        setStats(data); // Set the stats data in the state
      } catch (err) {
        setError('Failed to fetch monthly stats.');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    getMonthlyStats();
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>{error}</div>;
  }

  // Render the stats data
  return (
    <div className="monthly-stats-container">
      <h2>Monthly Financial Stats</h2>
      <p>Period: {stats.period}</p>
      <p>From: {stats.start_date}</p>
      <p>To: {stats.end_date}</p>
      <p>Total Income: ₹{stats.total_income}</p>
      <p>Total Expense: ₹{stats.total_expense}</p>
      <p>Savings: ₹{stats.savings}</p>
    </div>
  );
};

export default MonthlyStats;
