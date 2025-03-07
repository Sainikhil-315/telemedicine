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
  const [ darkMode, setDarkMode ] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const response = await authAPI.checkAuthStatus(token);
        console.log(response)
        if (response?.success && response?.user) {
          setCurrentUser(response.user);
          setIsAuthenticated(true);
        } else {
          // localStorage.removeItem('token');
          // setCurrentUser(null);
          // setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // localStorage.removeItem('token');
        // setCurrentUser(null);
        // setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);

      if (response?.token) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response;
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
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleRegister = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);

      if (response?.token) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
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
  return (
    <AuthContext.Provider value={{
      user: currentUser,
      isAuthenticated,
      loading,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      darkMode,
      setDarkMode,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}