import React, { useEffect, useState } from 'react';
import { fetchYearlyStats } from "../../api"; // adjust path as needed

const YearlyStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYearlyStats();
  }, []);

  const loadYearlyStats = async () => {
    try {
      const data = await fetchYearlyStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load yearly stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading yearly stats...</div>;

  return (
    <div className="container">
      <h2>Yearly Stats</h2>

      {stats ? (
        <div className="stats-summary">
          <div className="stat-item">
            <h3>Total Income</h3>
            <p>₹{stats.total_income}</p>
          </div>
          <div className="stat-item">
            <h3>Total Expenses</h3>
            <p>₹{stats.total_expenses}</p>
          </div>
          <div className="stat-item">
            <h3>Total Savings</h3>
            <p>₹{stats.total_savings}</p>
          </div>
        </div>
      ) : (
        <p>No data available for yearly stats.</p>
      )}
    </div>
  );
};

export default YearlyStats;
