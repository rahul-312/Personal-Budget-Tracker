import React, { useEffect, useState } from 'react';
import { fetchMonthlyExpenseSummary } from "../../api";

const MonthlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthlySummary();
  }, []);

  const loadMonthlySummary = async () => {
    try {
      const data = await fetchMonthlyExpenseSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to load monthly expense summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading monthly summary...</div>;

  return (
    <div className="container">
      <h2>Monthly Expense Summary</h2>

      {summary && summary.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Spent (₹)</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses recorded for this month.</p>
      )}
    </div>
  );
};

export default MonthlySummary;
