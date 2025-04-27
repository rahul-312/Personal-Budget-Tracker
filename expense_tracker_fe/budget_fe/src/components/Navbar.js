import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Include useNavigate for programmatic navigation
import "../styles/Navbar.css"; // Ensure this file exists for custom styling

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuthStatus = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    setIsAuthenticated(!!refreshToken);
  };

  // Handle logout by clearing tokens and navigating to Home
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false); // Update the state to reflect the logout
    navigate("/"); // Redirect to the home page
  };

  useEffect(() => {
    // Check auth status whenever the location changes
    checkAuthStatus();
  }, [location]);

  return (
    <nav className="nav">
      <div className="nav-left">
        <ul>
          <li><Link to="/">Home</Link></li>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li> {/* Logout button */}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
