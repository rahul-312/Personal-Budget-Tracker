import React, { useState, useEffect } from 'react';
import { fetchFinancialStats } from '../../api';  // Import the API function
import './YearlyStats.css'; // Import the CSS file for styling
const YearlyStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getYearlyStats = async () => {
      try {
        const data = await fetchFinancialStats('yearly'); // Fetch data for yearly period
        setStats(data); // Set the stats data in the state
      } catch (err) {
        setError('Failed to fetch yearly stats.');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    getYearlyStats();
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
    <div  className="yearly-stats-container">
      <h2>Yearly Financial Stats</h2>
      <p>Period: {stats.period}</p>
      <p>From: {stats.start_date}</p>
      <p>To: {stats.end_date}</p>
      <p>Total Income: ₹{stats.total_income}</p>
      <p>Total Expense: ₹{stats.total_expense}</p>
      <p>Savings: ₹{stats.savings}</p>
    </div>
  );
};

export default YearlyStats;
