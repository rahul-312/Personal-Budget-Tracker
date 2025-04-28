import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Dashboard.css"; // Make sure to import the styles
import { fetchTransactions } from "../../api"; // <-- Import the API function (adjust path)

const Dashboard = () => {
  const navigate = useNavigate(); // React Router navigation

  const handleGoToTransactions = async () => {
    try {
      const transactions = await fetchTransactions();
      console.log('Fetched Transactions:', transactions);
      
      // You can also save transactions in localStorage if needed
      // localStorage.setItem('transactions', JSON.stringify(transactions));

      navigate('/transactions'); // Redirect after fetching
    } catch (error) {
      console.error('Failed to fetch transactions:', error.message);
      alert('Failed to fetch transactions. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <p>This is your dashboard. Here you can manage your settings, view data, and much more.</p>

      <button className="dashboard-button" onClick={handleGoToTransactions}>
        Go to Transactions
      </button>
    </div>
  );
};

export default Dashboard;
