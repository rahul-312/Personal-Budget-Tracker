import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/';

export const API = {
  REGISTER: `${BASE_URL}users/register/`,
  LOGIN: `${BASE_URL}users/login/`,
  LOGOUT: `${BASE_URL}users/logout/`,
  USER_DATA: `${BASE_URL}users/data/`,
  TRANSACTIONS: `${BASE_URL}budget/transactions/`,
  TRANSACTION_DETAIL: (id) => `${BASE_URL}budget/transactions/${id}/`,
  USER_PROFILE: `${BASE_URL}budget/profile/`,
  MONTHLY_BUDGET: `${BASE_URL}budget/monthly-budgets/`,
  MONTHLY_BUDGET_DETAIL: (id) => `${BASE_URL}budget/monthly-budgets/${id}/`,
  MONTHLY_STATS: `${BASE_URL}budget/stats/monthly/`,
  YEARLY_STATS: `${BASE_URL}budget/stats/yearly/`,
  MONTHLY_EXPENSE_SUMMARY: `${BASE_URL}budget/expenses/summary/monthly/`,
  WEEKLY_EXPENSE_SUMMARY: `${BASE_URL}budget/expenses/summary/weekly/`,
  YEARLY_EXPENSE_SUMMARY: `${BASE_URL}budget/expenses/summary/yearly/`,
};

export const apiConfig = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: apiConfig.headers,
});

export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    throw new Error("No access token found in localStorage. Please log in again.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await api.post(API.LOGIN, credentials);
    console.log('Login response:', response.data);
    
    if (!response.data || !response.data.tokens) {
      throw new Error('Tokens not found in the response');
    }
    
    localStorage.setItem('access_token', response.data.tokens.access);
    localStorage.setItem('refresh_token', response.data.tokens.refresh);
    return response;
  } catch (error) {
    console.error('Login failed:', error.response || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(API.REGISTER, userData);
    console.log('Registration response:', response.data);
    return response;
  } catch (error) {
    console.error('Registration failed:', error.response || error.message);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const authHeaders = getAuthHeaders();
    
    if (!refreshToken) {
      throw new Error("No refresh token found in localStorage. Please log in again.");
    }

    const response = await api.post(API.LOGOUT, { refresh: refreshToken }, { headers: authHeaders });

    localStorage.removeItem('access_token');  
    localStorage.removeItem('refresh_token');  
    
    console.log('Logout successful');
    return response;
  } catch (error) {
    console.error('Logout failed:', error.response || error.message);
    throw error;
  }
};


// Fetch all transactions for the user
export const fetchTransactions = async () => {
  try {
    const response = await api.get(API.TRANSACTIONS, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.response || error.message);
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post(API.TRANSACTIONS, transactionData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error.response || error.message);
    throw error;
  }
};

// Fetch transaction details by ID
export const fetchTransactionDetail = async (id) => {
  try {
    const response = await api.get(API.TRANSACTION_DETAIL(id), { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction detail:', error.response || error.message);
    throw error;
  }
};

// Update a transaction by ID
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(API.TRANSACTION_DETAIL(id), transactionData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error.response || error.message);
    throw error;
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(API.TRANSACTION_DETAIL(id), { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error.response || error.message);
    throw error;
  }
};

// User Profile API functions

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await api.get(API.USER_PROFILE, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response || error.message);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    for (const key in profileData) {
      if (profileData[key]) formData.append(key, profileData[key]);
    }

    const response = await api.post(API.USER_PROFILE, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",  // Set the header to handle file uploads
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response || error.message);
    throw error;
  }
};
// Monthly Budget API functions

// Fetch monthly budget
export const fetchMonthlyBudget = async () => {
  try {
    const response = await api.get(API.MONTHLY_BUDGET, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly budget:', error.response || error.message);
    throw error;
  }
};

// Create a new monthly budget
export const createMonthlyBudget = async (budgetData) => {
  try {
    const response = await api.post(API.MONTHLY_BUDGET, budgetData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating monthly budget:', error.response || error.message);
    throw error;
  }
};

// Monthly Stats API function

// Fetch monthly stats (income, expense, savings)
export const fetchMonthlyStats = async () => {
  try {
    const response = await api.get(API.MONTHLY_STATS, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly stats:', error.response || error.message);
    throw error;
  }
};

// Monthly Expense Summary API function

// Fetch monthly expense summary
export const fetchMonthlyExpenseSummary = async () => {
  try {
    const response = await api.get(API.MONTHLY_EXPENSE_SUMMARY, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly expense summary:', error.response || error.message);
    throw error;
  }
};

// Yearly Stats API function

// Fetch yearly stats (income, expense, savings)
export const fetchYearlyStats = async () => {
  try {
    const response = await api.get(API.YEARLY_STATS, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly stats:', error.response || error.message);
    throw error;
  }
};

// Yearly Expense Summary API function

// Fetch yearly expense summary
export const fetchYearlyExpenseSummary = async () => {
  try {
    const response = await api.get(API.YEARLY_EXPENSE_SUMMARY, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly expense summary:', error.response || error.message);
    throw error;
  }
};


export const fetchWeeklyExpenseSummary = async (startDate, endDate) => {
  try {
    const response = await api.get(API.WEEKLY_EXPENSE_SUMMARY, {
      headers: getAuthHeaders(),
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly expense summary:', error.response || error.message);
    throw error;
  }
};