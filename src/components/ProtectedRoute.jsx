import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Usage:
 *   <ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>
 *   <ProtectedRoute requiredRole="user" ><Dashboard/></ProtectedRoute>
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Not logged in at all
    return (
      <Navigate
        to={requiredRole === 'admin' ? '/login' : '/user-login'}
        replace
      />
    );
  }

  if (requiredRole && userRole !== requiredRole) {
    // Wrong role
    return (
      <Navigate
        to={requiredRole === 'admin' ? '/login' : '/user-login'}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
