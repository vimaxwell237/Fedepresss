// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
// Don’t provide default login/logout in createContext — we’ll always wrap in the provider.

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole]               = useState(null);
  const [userEmail, setUserEmail]             = useState(null);
  const [token, setToken]                     = useState(null);

  // On mount, load any existing auth state
  useEffect(() => {
    const jwt       = localStorage.getItem('token');
    const role      = localStorage.getItem('role');
    const email     = localStorage.getItem('email');
    if (jwt && role) {
      setToken(jwt);
      setUserRole(role);
      setUserEmail(email || null);
      setIsAuthenticated(true);
      // Optionally set axios default header:
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    }
  }, []);

  // Log in (admin or user)
  const login = async ({ role, username, email, password }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        role === 'admin'
          ? { role, username, password }
          : { role, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token: jwt, user } = data;
      // Save to state
      setToken(jwt);
      setUserRole(user.role);
      setUserEmail(user.email || null);
      setIsAuthenticated(true);

      // Persist
      localStorage.setItem('token', jwt);
      localStorage.setItem('role', user.role);
      localStorage.setItem('email', user.email || '');

      // Set default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      return true;
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      return false;
    }
  };

  // Log out
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userEmail, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
