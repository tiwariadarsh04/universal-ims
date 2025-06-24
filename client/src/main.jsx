import * as React from 'react';
import { Suspense } from 'react';
import './index.css';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProfileProvider } from './context/userProvider';
import { DialogProvider } from './context/DialogProvider';
import { LanguageProvider } from './context/LanguageProvider';
// Import our i18n configuration
import './i18n';
import LoadingScreen from './components/Loader/LoadingScreen';
import ThemeProvider from './context/ThemeProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProfileProvider>
      <DialogProvider>
        <LanguageProvider>
          <ThemeProvider>
            <Suspense fallback={
              <LoadingScreen 
                fullScreen 
                loadingText="Loading application..." 
                variant="logo"
                size={80}
              />
            }>
              <App />
            </Suspense>
          </ThemeProvider>
        </LanguageProvider>
      </DialogProvider>
    </UserProfileProvider>
  </BrowserRouter>
);
