import React, { Suspense, useEffect, useState, useMemo, useContext } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { Box, Typography, alpha } from '@mui/material';
import MaintenancePage from './Pages/MaintancePage';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import KeyboardShortcutsHelp from './helper/KeyBoardShortCutHelp';
import LoadingScreen from './components/Loader/LoadingScreen';
import SplashScreen from './components/Loader/SplashScreen';
import ErrorBoundary from './components/Error/ErrorBoundary';
import { LanguageContext } from './context/LanguageProvider';

// Lazy load components with preloading
const MainRoutes = React.lazy(() => import('./routes'));
const BottomNavigationBar = React.lazy(() => import('./components/Navigation/BottomBar'));
const SideBar = React.lazy(() => import('./components/Navigation/SideMenu'));
const Footer = React.lazy(() => import('./components/Footer/Footer'));

import { Analytics } from '@vercel/analytics/react';
// Constants
const AUTH_ROUTES = new Set([
  '/auth/sign-in',
  '/auth/forget-password',
  '/auth/create-new-password',
  '/auth/verify-otp',
  '/auth/password-updated',
  '/party-invoice/pdf-view',
  '/report/drag-drop-pipeline',
  '/terms-of-service',
  '/privacy-policy',
  '/cookie-policy',
  '/club-rules',
  '/accessibility',
  '/about-us',
  '/events',
  '/activities',
  '/membership'
]);

// Custom hook for user authentication check
const useUserAuth = () => {
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      localStorage.clear();
    }
  }, []);
};

// Preload components
const preloadComponents = () => {
  const components = [
    () => import('./routes'),
    () => import('./components/Navigation/BottomBar'),
    () => import('./components/Navigation/SideMenu'),
    () => import('./components/Footer/Footer')
  ];

  components.forEach(component => {
    component();
  });
};

function App() {
  const location = useLocation();
  const [isServiceSuspended, setIsServiceSuspended] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
  // Check user authentication
  useUserAuth();

  // Preload components after splash screen
  useEffect(() => {
    if (!showSplash) {
      preloadComponents();
    }
  }, [showSplash]);

  // Memoize the auth route check
  const isAuthRoute = useMemo(() => 
    AUTH_ROUTES.has(location.pathname),
    [location.pathname]
  );

  // Memoize the main content padding
  const mainContentPadding = useMemo(() => 
    location.pathname === '/welcome' ? '0' : '3',
    [location.pathname]
  );

  // Get the current language from context
  const { currentLanguage } = useContext(LanguageContext);

  if (isServiceSuspended) {
    return (
      <ErrorBoundary>
        <MaintenancePage 
          handleCheck={() => setIsServiceSuspended(false)}
        />
      </ErrorBoundary>
    );
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ErrorBoundary>
      <Suspense 
        fallback={
          <LoadingScreen 
            fullScreen 
            loadingText="Loading application..." 
            size={80}
          />
        }
      >
        <Box sx={{ 
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column'
        }}>
          {!isAuthRoute && <SideBar />}
          
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: mainContentPadding,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ marginTop: '4em', flexGrow: 1 }}>
              <KeyboardShortcutsHelp />
              <MainRoutes />
            </Box>
          </Box>
          <Analytics />
          {!isAuthRoute && <BottomNavigationBar />}
          {!isAuthRoute && <Footer />}

        </Box>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
