import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Add Sidebar import
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import "font-awesome/css/font-awesome.min.css";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

// Create a separate MainLayout component
function MainLayout() {
  const location = useLocation();

  // Define paths where Sidebar should be shown
  const showSidebar = ["/dashboard", "/profile"].includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {showSidebar && <Sidebar />} {/* Sidebar conditionally rendered */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
