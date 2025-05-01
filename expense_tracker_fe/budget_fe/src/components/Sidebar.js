import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { logout } from "../api";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/transaction-history">Transaction History</Link></li>
          <li><Link to="/monthly-budget">Monthly Budget</Link></li>
          <li><Link to="/monthly-budget-comparison">Budget Comparison</Link></li>
          <li><Link to="/expense-summary/monthly">Monthly Expenses</Link></li>
          <li><Link to="/expense-summary/yearly">Yearly Expenses</Link></li>
          <li><Link to="/stats/monthly">Monthly Stats</Link></li>
          <li><Link to="/stats/yearly">Yearly Stats</Link></li>
          <li><Link to="/profile">User Profile</Link></li>
        </ul>
      </div>
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
