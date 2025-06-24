import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import i18n from '../i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });
  
  // Use ref to track if language change is in progress
  const isChangingLanguage = useRef(false);
  
  // Change language handler with improved error handling
  const changeLanguage = useCallback(async (language) => {
    if (!language || isChangingLanguage.current) return;
    
    try {
      isChangingLanguage.current = true;
      console.log(`LanguageProvider: Changing language to ${language}`);
      
      // Store in localStorage first
      localStorage.setItem('language', language);
      localStorage.setItem('i18n_timestamp', Date.now());
      
      // Change language in i18n
      await i18n.changeLanguage(language);
      console.log(`LanguageProvider: i18n.changeLanguage completed for ${language}`);
      
      // Update state after i18n change is complete
      setCurrentLanguage(language);
      
      // Force update document attributes
      const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.body.className = document.body.className
        .split(' ')
        .filter(cls => !cls.startsWith('lang-'))
        .join(' ');
      document.body.classList.add(`lang-${language}`);
      
      // Force a re-render of the entire app
      window.dispatchEvent(new Event('languageChange'));
    } catch (error) {
      console.error('Error in changeLanguage function:', error);
    } finally {
      isChangingLanguage.current = false;
    }
  }, []);
  
  // Get available languages
  const getLanguages = useCallback(() => {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    ];
  }, []);
  
  // Check if the current language is RTL (Right-to-Left)
  const isRTL = useCallback(() => {
    return ['ar', 'he', 'fa', 'ur'].includes(currentLanguage);
  }, [currentLanguage]);
  
  // Get direction based on language
  const getDirection = useCallback(() => {
    return isRTL() ? 'rtl' : 'ltr';
  }, [isRTL]);
  
  // Initialize language on component mount
  useEffect(() => {
    const initializeLanguage = async () => {
      if (isChangingLanguage.current) return;
      
      try {
        isChangingLanguage.current = true;
        console.log(`LanguageProvider: Initializing language to ${currentLanguage}`);
        
        // Apply the language change
        await i18n.changeLanguage(currentLanguage);
        console.log(`LanguageProvider: Initial language change completed for ${currentLanguage}`);
        
        // Update document direction for RTL support
        document.documentElement.dir = getDirection();
        document.documentElement.setAttribute('lang', currentLanguage);
        
        // Add language code as a class to the body
        document.body.className = document.body.className
          .split(' ')
          .filter(cls => !cls.startsWith('lang-'))
          .join(' ');
        document.body.classList.add(`lang-${currentLanguage}`);
      } catch (error) {
        console.error('Error changing language in LanguageProvider:', error);
      } finally {
        isChangingLanguage.current = false;
      }
    };
    
    initializeLanguage();
  }, []); // Only run on mount
  
  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'language' && e.newValue !== currentLanguage && !isChangingLanguage.current) {
        changeLanguage(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentLanguage, changeLanguage]);
  
  const contextValue = {
    currentLanguage,
    changeLanguage,
    getLanguages,
    isRTL,
    getDirection
  };
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 