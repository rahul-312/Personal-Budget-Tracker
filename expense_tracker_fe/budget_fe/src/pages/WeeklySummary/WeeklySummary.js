import React, { useEffect, useState } from 'react';
import { fetchWeeklyExpenseSummary } from "../../api"; // adjust path as needed

const WeeklySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklySummary();
  }, []);

  const loadWeeklySummary = async () => {
    try {
      const data = await fetchWeeklyExpenseSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to load weekly expense summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading weekly summary...</div>;

  return (
    <div className="container">
      <h2>Weekly Expense Summary</h2>

      {summary && summary.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Total Spent (₹)</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, index) => (
              <tr key={index}>
                <td>{`Week ${item.week}`}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses recorded for this week.</p>
      )}
    </div>
  );
};

export default WeeklySummary;
