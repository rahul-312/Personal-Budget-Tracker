import { useState } from "react";
import axios from "axios";
import { API } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const loginData = {
      email: formData.email,
      password: formData.password,
    };
  
    try {
      const response = await axios.post(API.LOGIN, loginData, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the response to check token presence
      console.log("Login Response:", response.data);
  
      // Check if tokens are present
      if (response.data && response.data.access && response.data.refresh) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
  
        console.log("Tokens saved to LocalStorage");
        navigate("/dashboard");
      } else {
        setError("Login failed. Tokens not found.");
      }
    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="login-page">
      <div className="login-illustration">
        <div className="illustration-content">
          <img
            src="/images/login-illustration.jpg"
            alt="Login Illustration"
            className="login-image"
          />
        </div>
      </div>

      <div className="login-container">
        <h1>Hello!<br />{getGreeting()}</h1>
        <h2>Login to your account</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        <p className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <p className="signup-link">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
