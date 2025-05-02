import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchMonthlyBudget, createMonthlyBudget } from '../../api';
import './MonthlyBudget.css';

const MonthlyBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getMonthlyBudgetList = async () => {
    try {
      const data = await fetchMonthlyBudget();
      setBudgets(data);
    } catch (err) {
      console.error("Failed to fetch monthly budgets", err);
      setError('Failed to fetch monthly budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMonthlyBudgetList();
  }, []);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!month || !budgetAmount) {
      Swal.fire('Error', 'Please fill in both fields', 'error');
      return;
    }

    try {
      const newBudget = await createMonthlyBudget({
        month,
        budget_amount: budgetAmount,
      });
      setBudgets([...budgets, newBudget]);
      setMonth('');
      setBudgetAmount('');
      setShowForm(false);
      Swal.fire('Success', 'Monthly budget created successfully!', 'success');
    } catch (err) {
      console.error("Failed to create monthly budget", err);
      Swal.fire('Error', 'Failed to create monthly budget', 'error');
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(budgets.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="monthly-budget-container">
      <h2>Monthly Budgets</h2>

      {/* Add Budget or Show List button */}
      {!showForm ? (
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(true)}
        >
          Add Budget
        </button>
      ) : (
        <button
          className="toggle-form-btn"
          onClick={() => setShowForm(false)}
        >
          Show List
        </button>
      )}

      {/* Form */}
      {showForm ? (
        <form onSubmit={handleCreateBudget} className="create-budget-form">
          <div className="form-group">
            <label htmlFor="month">Month:</label>
            <input
              type="date"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="budgetAmount">Budget Amount:</label>
            <input
              type="number"
              id="budgetAmount"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-budget-btn">
            Create Budget
          </button>
        </form>
      ) : (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              {budgets.length === 0 ? (
                <p>No budgets found. Click 'Add Budget' to create one.</p>
              ) : (
                <>
                  <table className="budget-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Budget Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBudgets.map((budget) => (
                        <tr key={budget.id}>
                          <td>{budget.month}</td>
                          <td>{budget.budget_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active-page' : ''}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MonthlyBudget;
