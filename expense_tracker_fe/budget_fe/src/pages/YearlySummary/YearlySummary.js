import React, { useEffect, useState } from 'react';
import { fetchYearlyExpenseSummary } from "../../api"; // adjust path as needed

const YearlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYearlyExpenseSummary();
  }, []);

  const loadYearlyExpenseSummary = async () => {
    try {
      const data = await fetchYearlyExpenseSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to load yearly expense summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading yearly expense summary...</div>;

  return (
    <div className="container">
      <h2>Yearly Expense Summary</h2>

      {summary ? (
        <div className="expense-summary">
          <div className="expense-item">
            <h3>Total Yearly Expenses</h3>
            <p>₹{summary.total_expenses}</p>
          </div>
          <div className="expense-item">
            <h3>Total Savings</h3>
            <p>₹{summary.total_savings}</p>
          </div>
          <div className="expense-item">
            <h3>Total Income</h3>
            <p>₹{summary.total_income}</p>
          </div>
        </div>
      ) : (
        <p>No data available for yearly expense summary.</p>
      )}
    </div>
  );
};

export default YearlySummary;
