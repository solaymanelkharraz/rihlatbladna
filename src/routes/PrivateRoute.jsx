import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles, requireVerification = false }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'agency') {
      return <Navigate to="/agency/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/traveler/profile" replace />;
    }
  }

  if (requireVerification && user.role === 'agency' && !user.isVerified) {
    return <Navigate to="/agency/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
