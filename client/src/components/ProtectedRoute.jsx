import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated or token is missing, redirect to sign-in
    if (!isLoading && (!isAuthenticated || !token)) {
      // Clear any existing history
      window.history.pushState(null, '', '/auth/sign-in');
      window.history.replaceState(null, '', '/auth/sign-in');
      
      // Force redirect to sign-in
      window.location.href = '/auth/sign-in';
    }
  }, [isLoading, isAuthenticated, token]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !token) {
    // Clear any existing history
    window.history.pushState(null, '', '/auth/sign-in');
    window.history.replaceState(null, '', '/auth/sign-in');
    
    // Force redirect to sign-in
    window.location.href = '/auth/sign-in';
    return null;
  }

  // Check if user has required role
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => user?.roles?.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 