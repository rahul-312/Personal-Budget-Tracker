import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuthStatus = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    setIsAuthenticated(!!refreshToken);
  };

  // Redirect to login if accessing a protected route without authentication
  const handleDashboardAccess = () => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      navigate("/dashboard"); // Otherwise, navigate to the dashboard
    }
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
              <li><button onClick={handleDashboardAccess}>Dashboard</button></li>
            </>
          )}
        </ul>
      </div>

      <div className="nav-right">
        {isAuthenticated && (
          <ul>
            <li>
              <Link to="/profile">
                <i className="fa fa-user" style={{ marginRight: "8px" }}></i> My Profile
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
