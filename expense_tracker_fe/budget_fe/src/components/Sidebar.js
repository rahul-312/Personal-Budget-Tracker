import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { logout } from "../api"; // Import the logout function from api.js

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from api.js
      navigate("/login"); // After logout, navigate to login page
    } catch (error) {
      console.error("Logout failed:", error.message); // Handle any errors
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/history">History</Link> {/* 👈 Added History Link */}
          </li>
        </ul>
      </div>
      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
