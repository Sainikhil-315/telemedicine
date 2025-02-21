import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Verify token with backend
        const userData = await authAPI.checkAuthStatus(token);
        
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } else {
          // Clear invalid token
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    setError(null);
    try {
      const userData = await authAPI.login(email, password);
      
      if (userData && userData.token) {
        localStorage.setItem('authToken', userData.token);
        setCurrentUser(userData.user || userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleRegister = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);
      
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        setCurrentUser(response.user || response);
        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const value = {
    user: currentUser,
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