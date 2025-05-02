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
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory";
import MonthlyBudget from "./pages/MonthlyBudget/MonthlyBudget";
import BudgetComparison from "./pages/BudgetComparison/BudgetComparison";
import MonthlyExpenses from "./pages/MonthlyExpenses/MonthlyExpenses";
import YearlyExpenses from "./pages/YearlyExpenses/YearlyExpenses";
import MonthlyStats from "./pages/MonthlyStats/MonthlyStats";
import YearlyStats from "./pages/YearlyStats/YearlyStats";
import EditTransaction from './pages/EditTransaction/EditTransaction';

// Styles
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
    "/transaction-history",
    "/monthly-budget",
    "/monthly-budget-comparison",
    "/expense-summary",
    "/stats/monthly",
    "/stats/yearly",
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
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/monthly-budget" element={<MonthlyBudget />} />
            <Route path="/monthly-budget-comparison" element={<BudgetComparison />} />
            <Route path="/expense-summary/monthly" element={<MonthlyExpenses />} />  {/* Monthly Expenses Route */}
            <Route path="/expense-summary/yearly" element={<YearlyExpenses />} />    {/* Yearly Expenses Route */}
            <Route path="/stats/monthly" element={<MonthlyStats />} />
            <Route path="/stats/yearly" element={<YearlyStats />} />
            <Route path="/transactions/edit/:id" element={<EditTransaction />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
