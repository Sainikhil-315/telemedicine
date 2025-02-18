import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, checkAuthStatus } from '../api/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } 
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const handleLogin = async (email, password) => {
    setError(null);
    try {
      const userData = await login(email, password);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  // Register function
  const handleRegister = async (userData) => {
    setError(null);
    try {
      const newUser = await register(userData);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}