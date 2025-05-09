import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userEmail: null,
  token: null,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole]               = useState(null);
  const [userEmail, setUserEmail]             = useState(null);
  const [token, setToken]                     = useState(null);

  useEffect(() => {
    const jwt   = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (jwt && role) {
      setToken(jwt);
      setUserRole(role);
      setUserEmail(email || null);
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    }
  }, []);

  const login = async ({ role, username, email, password }) => {
    try {
      const payload =
        role === 'admin'
          ? { role, username, password }
          : { role, email, password };

      const { data } = await api.post('/auth/login', payload);
      const { token: jwt, user } = data;

      setToken(jwt);
      setUserRole(user.role);
      setUserEmail(user.email || null);
      setIsAuthenticated(true);

      localStorage.setItem('token', jwt);
      localStorage.setItem('role', user.role);
      localStorage.setItem('email', user.email || '');

      api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      return true;
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userEmail, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
