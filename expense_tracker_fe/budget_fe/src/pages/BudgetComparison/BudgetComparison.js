import React, { useEffect, useState } from 'react';
import { fetchMonthlyBudget, fetchMonthlyStats } from "../../api"; // Adjust import if needed

const BudgetComparison = () => {
  const [budget, setBudget] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparisonData();
  }, []);

  const loadComparisonData = async () => {
    try {
      const budgetData = await fetchMonthlyBudget();
      const statsData = await fetchMonthlyStats();
      setBudget(budgetData[0] || null);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading comparison data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = () => {
    if (!budget || !stats) return '';
    const balance = budget.amount - stats.expense;
    if (balance > 0) return `Under budget by ₹${balance}`;
    if (balance < 0) return `Over budget by ₹${-balance}`;
    return 'Exactly on budget';
  };

  if (loading) return <div>Loading comparison...</div>;

  return (
    <div className="container">
      <h2>Budget Comparison</h2>

      {budget ? (
        <div>
          <p><strong>Month:</strong> {budget.month}</p>
          <p><strong>Budgeted Amount:</strong> ₹{budget.amount}</p>
        </div>
      ) : (
        <p>No monthly budget found.</p>
      )}

      {stats ? (
        <div>
          <p><strong>Total Income:</strong> ₹{stats.income}</p>
          <p><strong>Total Expenses:</strong> ₹{stats.expense}</p>
          <p><strong>Savings:</strong> ₹{stats.savings}</p>
        </div>
      ) : (
        <p>No stats found for this month.</p>
      )}

      {budget && stats && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          <p>Status: {getStatus()}</p>
        </div>
      )}
    </div>
  );
};

export default BudgetComparison;
