import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIsAuth } from '../services/Auth';
import { useDialog } from './DialogProvider';

export const AuthContext = createContext();

const TOKEN_EXPIRY_CHECK_INTERVAL = 60000; // Check every minute
const TOKEN_EXPIRY_TIME = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    lastActivity: null
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useDialog();

  // Function to check if token is expired
  const isTokenExpired = useCallback((timestamp) => {
    if (!timestamp) return true;
    const now = new Date().getTime();
    return now - timestamp > TOKEN_EXPIRY_TIME;
  }, []);

  // Function to update last activity timestamp
  const updateLastActivity = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      lastActivity: new Date().getTime()
    }));
  }, []);

  // Function to validate token
  const validateToken = useCallback(async (token) => {
    try {
      const response = await getIsAuth(token);
      if (response.error || !response.user) {
        throw new Error(response.error || 'Invalid token');
      }
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // Function to clear auth state and storage
  const clearAuthState = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    sessionStorage.clear(); // Clear any session data
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      lastActivity: null
    });
  }, []);

  // Function to handle logout
  const handleLogout = useCallback(() => {
    clearAuthState();
    
    // Clear browser history and redirect to sign-in
    window.history.pushState(null, '', '/auth/sign-in');
    window.history.replaceState(null, '', '/auth/sign-in');
    
    // Force reload to clear any cached state
    window.location.href = '/auth/sign-in';
  }, [clearAuthState]);

  // Function to handle login
  const handleLogin = useCallback(async (userData) => {
    try {
      const isValid = await validateToken(userData.token);
      if (!isValid) {
        throw new Error('Invalid token');
      }

      const timestamp = new Date().getTime();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('lastActivity', timestamp.toString());

      setAuthState({
        isAuthenticated: true,
        user: userData,
        token: userData.token,
        isLoading: false,
        lastActivity: timestamp
      });

      // Redirect to the page user was trying to access, or dashboard
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (error) {
      handleLogout();
      showAlert('Authentication Error', error.message, 'error');
    }
  }, [validateToken, handleLogout, showAlert, navigate, location]);

  // Effect to check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const userData = localStorage.getItem('user');

      if (!userData || !lastActivity) {
        handleLogout();
        return;
      }

      if (isTokenExpired(parseInt(lastActivity))) {
        showAlert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          'warning'
        );
        handleLogout();
        return;
      }

      // Validate token with server
      const isValid = await validateToken(JSON.parse(userData).token);
      if (!isValid) {
        handleLogout();
        return;
      }

      // Update last activity
      updateLastActivity();
    };

    const interval = setInterval(checkTokenExpiration, TOKEN_EXPIRY_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [isTokenExpired, validateToken, handleLogout, updateLastActivity, showAlert]);

  // Effect to initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const userData = localStorage.getItem('user');
      const lastActivity = localStorage.getItem('lastActivity');

      if (!userData || !lastActivity) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        const isValid = await validateToken(parsedUser.token);

        if (!isValid || isTokenExpired(parseInt(lastActivity))) {
          handleLogout();
          return;
        }

        setAuthState({
          isAuthenticated: true,
          user: parsedUser,
          token: parsedUser.token,
          isLoading: false,
          lastActivity: parseInt(lastActivity)
        });
      } catch (error) {
        handleLogout();
      }
    };

    initializeAuth();
  }, [validateToken, isTokenExpired, handleLogout]);

  // Effect to handle route changes and prevent unauthorized access
  useEffect(() => {
    const handleRouteChange = async () => {
      // Skip check for auth routes
      if (location.pathname.startsWith('/auth/')) {
        return;
      }

      // If not authenticated, redirect to sign-in
      if (!authState.isAuthenticated || !authState.token) {
        handleLogout();
        return;
      }

      // Validate token on route change
      const isValid = await validateToken(authState.token);
      if (!isValid) {
        handleLogout();
        return;
      }
    };

    handleRouteChange();
  }, [location.pathname, authState.isAuthenticated, authState.token, validateToken, handleLogout]);

  // Add activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateLastActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [updateLastActivity]);

  // Prevent browser back button after logout
  useEffect(() => {
    const handlePopState = (event) => {
      if (!authState.isAuthenticated && !location.pathname.startsWith('/auth/')) {
        window.history.pushState(null, '', '/auth/sign-in');
        window.history.replaceState(null, '', '/auth/sign-in');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [authState.isAuthenticated, location.pathname]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login: handleLogin,
      logout: handleLogout,
      updateLastActivity
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;