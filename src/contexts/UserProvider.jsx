import React, { createContext, useContext, useEffect, useState } from "react";
import { usePersistentState } from './usePersistentState';
import axios from 'axios';
import { endpoints } from "../utils/api";

export const UserContext = createContext();
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

export const UserProvider = ({ children }) => {
    
  // Use the custom hook for each state that needs persistence
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = usePersistentState("userEmail", null, FIVE_DAYS_MS);
  const [hasBudget, setHasBudget] = useState(false);
  const [plaidConnect, setPlaidConnect] = useState(false);
  const [budget, setBudget] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [totalBudget, setTotalBudget] = usePersistentState("totalBudget", 0, FIVE_DAYS_MS);
  const [totalSpent, setTotalSpent] = usePersistentState("totalSpent", 0, FIVE_DAYS_MS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(endpoints.auth.check, {
          withCredentials: true
        });
        if (response.data.userId) {
          setUserId(response.data.userId);
          setHasBudget(response.data.hasBudget);
          setPlaidConnect(response.data.plaidConnect);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(endpoints.auth.login, {
        email,
        password
      }, {
        withCredentials: true
      });
      setUserId(response.data.userId);
      setHasBudget(response.data.hasBudget);
      setPlaidConnect(response.data.plaidConnect);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(endpoints.auth.logout, {}, {
        withCredentials: true
      });
      setUserId(null);
      setHasBudget(false);
      setPlaidConnect(false);
      setBudget(null);
      setTransactions(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchBudget = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(endpoints.budget.get, {
        withCredentials: true
      });
      setBudget(response.data);
    } catch (error) {
      console.error("Failed to fetch budget:", error);
    }
  };

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(endpoints.transactions.get, {
        withCredentials: true
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const updateBudgetStatus = async (status) => {
    try {
      await axios.put(endpoints.auth.updateBudgetStatus, {
        hasBudget: status
      }, {
        withCredentials: true
      });
      setHasBudget(status);
    } catch (error) {
      console.error("Failed to update budget status:", error);
    }
  };

  const updatePlaidStatus = async (status) => {
    try {
      await axios.put(endpoints.auth.updatePlaidStatus, {
        plaidConnect: status
      }, {
        withCredentials: true
      });
      setPlaidConnect(status);
    } catch (error) {
      console.error("Failed to update Plaid status:", error);
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      setLoading(true);
      
      // Confirm the user wants to delete their account
      const confirmed = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
      );
      
      if (!confirmed) {
        setLoading(false);
        return { success: false, message: "Account deletion cancelled" };
      }
      
      // Make API call to delete the account
      await axios.delete(`https://localhost:5252/api/auth/delete-user`, {
        withCredentials: true
      });
      
      // Clear all local storage data
      sessionStorage.clear();
      localStorage.clear();
      
      // Reset all states
      setUserId(null);
      setUserEmail(null);
      setHasBudget(false);
      setPlaidConnect(false);
      setBudget(null);
      setTransactions(null);
      setTotalBudget(0);
      setTotalSpent(0);
      
      setLoading(false);
      return { success: true, message: "Account deleted successfully" };
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
      return { 
        success: false, 
        message: "Failed to delete account", 
        error: error.response?.data?.message || error.message 
      };
    }
  };

  return (
    <UserContext.Provider value={{ 
      userId, userEmail, hasBudget, plaidConnect, budget, transactions,
      totalBudget, totalSpent, loading,
      setUserId, setUserEmail, setHasBudget, setPlaidConnect, setBudget, setTransactions, setLoading,
      login, logout, fetchBudget, fetchTransactions, deleteAccount, updateBudgetStatus, updatePlaidStatus
    }}>
      {children}
    </UserContext.Provider>
  );
};