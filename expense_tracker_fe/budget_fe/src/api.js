import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/';

// API endpoints
export const API = {
  // Authentication
  REGISTER: `${BASE_URL}users/register/`,
  LOGIN: `${BASE_URL}users/login/`,
  LOGOUT: `${BASE_URL}users/logout/`,
  USER_DATA: `${BASE_URL}users/data/`,

  // Transactions
  TRANSACTIONS: `${BASE_URL}budget/transactions/`,
  TRANSACTION_DETAIL: (id) => `${BASE_URL}budget/transactions/${id}/`,

  // User Profile
  USER_PROFILE: `${BASE_URL}budget/profile/`,

  // Monthly Budgets
  MONTHLY_BUDGET: `${BASE_URL}budget/monthly-budgets/`,
  MONTHLY_BUDGET_DETAIL: (id) => `${BASE_URL}budget/monthly-budgets/${id}/`,

  // Financial Statistics
  STATS: `${BASE_URL}budget/stats/`,

  // Expense Summary
  EXPENSE_SUMMARY: `${BASE_URL}budget/expenses/summary/`,

  // Monthly Budget Comparison
  MONTHLY_BUDGET_COMPARISON: `${BASE_URL}budget/monthly-budget-comparison/`,
};

// Axios instance configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication headers
export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token found. Please log in again.');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// Authentication

export const register = async (userData) => {
  try {
    const response = await api.post(API.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post(API.LOGIN, credentials);
    if (response.data && response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
    } else {
      throw new Error('Tokens not found in the response');
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token found. Please log in again.');
    }
    const response = await api.post(
      API.LOGOUT,
      { refresh: refreshToken },
      { headers: getAuthHeaders() }
    );
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error.response || error.message);
    throw error;
  }
};

// Transactions

export const fetchTransactions = async () => {
  try {
    const response = await api.get(API.TRANSACTIONS, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.response || error.message);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post(API.TRANSACTIONS, transactionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error.response || error.message);
    throw error;
  }
};

export const fetchTransactionDetail = async (id) => {
  try {
    const response = await api.get(API.TRANSACTION_DETAIL(id), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction detail:', error.response || error.message);
    throw error;
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(API.TRANSACTION_DETAIL(id), transactionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error.response || error.message);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(API.TRANSACTION_DETAIL(id), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error.response || error.message);
    throw error;
  }
};

// User Profile

export const fetchUserProfile = async () => {
  try {
    const response = await api.get(API.USER_PROFILE, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response || error.message);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    for (const key in profileData) {
      if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    }
    const response = await api.post(API.USER_PROFILE, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response || error.message);
    throw error;
  }
};

// Monthly Budgets

export const fetchMonthlyBudget = async () => {
  try {
    const response = await api.get(API.MONTHLY_BUDGET, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly budgets:', error.response || error.message);
    throw error;
  }
};

export const createMonthlyBudget = async (budgetData) => {
  try {
    const response = await api.post(API.MONTHLY_BUDGET, budgetData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating monthly budget:', error.response || error.message);
    throw error;
  }
};

export const updateMonthlyBudget = async (id, budgetData) => {
  try {
    const response = await api.put(API.MONTHLY_BUDGET_DETAIL(id), budgetData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating monthly budget:', error.response || error.message);
    throw error;
  }
};

export const deleteMonthlyBudget = async (id) => {
  try {
    const response = await api.delete(API.MONTHLY_BUDGET_DETAIL(id), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting monthly budget:', error.response || error.message);
    throw error;
  }
};

// Financial Statistics

export const fetchFinancialStats = async (period = 'monthly') => {
  try {
    // Adjust the parameter name from `type` to `period`
    const response = await api.get(API.STATS, {
      headers: getAuthHeaders(),
      params: { period },  // Update the key to 'period'
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${period} financial stats:`, error.response || error.message);
    throw error;
  }
};

// Expense Summary

export const fetchExpenseSummary = async (period = 'monthly', params = {}) => {
  try {
    const response = await api.get(API.EXPENSE_SUMMARY, {
      headers: getAuthHeaders(),
      params: { period, ...params },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${period} expense summary:`, error.response || error.message);
    throw error;
  }
};

// Specific function for Monthly Expense Summary
export const fetchMonthlyExpenses = async () => {
  return fetchExpenseSummary('monthly');
};

// Monthly Budget Comparison

export const fetchMonthlyBudgetComparison = async () => {
  try {
    const response = await api.get(API.MONTHLY_BUDGET_COMPARISON, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly budget comparison:', error.response || error.message);
    throw error;
  }
};
