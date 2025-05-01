import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Transactions from "./pages/Transactions/Transactions";
import History from './pages/History/History';
import Budget from "./pages/Budget/Budget";
import BudgetComparison from "./pages/BudgetComparison/BudgetComparison";
import MonthlySummary from "./pages/MonthlySummary/MonthlySummary";
import WeeklySummary from "./pages/WeeklySummary/WeeklySummary";
import YearlyStats from "./pages/YearlyStats/YearlyStats";
import YearlySummary from "./pages/YearlySummary/YearlySummary";

import "font-awesome/css/font-awesome.min.css";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  const showSidebarRoutes = [
    "/dashboard",
    "/profile",
    "/transactions",
    "/history",
    "/budget",
    "/budget-comparison",
    "/monthly-summary",
    "/weekly-summary",
    "/yearly-stats",
    "/yearly-summary",
  ];

  const showSidebar = showSidebarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {showSidebar && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/history" element={<History />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget-comparison" element={<BudgetComparison />} />
            <Route path="/monthly-summary" element={<MonthlySummary />} />
            <Route path="/weekly-summary" element={<WeeklySummary />} />
            <Route path="/yearly-stats" element={<YearlyStats />} />
            <Route path="/yearly-summary" element={<YearlySummary />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
