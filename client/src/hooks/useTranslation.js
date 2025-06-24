import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageProvider';
import i18n from '../i18n';

/**
 * Custom hook to handle translations and language switching
 * Extends the basic react-i18next hook with additional functionality
 * and integrates with our LanguageContext
 */
export const useTranslation = () => {
  // Get the basic translation functionality from react-i18next
  const { t, i18n: i18nInstance } = useI18nTranslation();
  
  // Get language context for centralized language management
  const languageContext = useContext(LanguageContext);
  
  // Add a force update mechanism to ensure re-renders on language changes
  const [, setForceUpdate] = useState(Date.now());
  
  // Listen for language changes and force updates
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      console.log(`useTranslation: Language changed to ${lng}`);
      setForceUpdate(Date.now());
    };
    
    i18nInstance.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, [i18nInstance]);
  
  // Also re-render when context updates
  useEffect(() => {
    if (languageContext?.lastUpdate) {
      setForceUpdate(languageContext.lastUpdate);
    }
  }, [languageContext?.lastUpdate]);
  
  /**
   * Change the application language
   * This uses the LanguageContext.changeLanguage if available,
   * otherwise falls back to direct i18n method
   * @param {string} language - Language code (e.g., 'en', 'es', 'fr')
   */
  const changeLanguage = useCallback((language) => {
    if (!language) return;
    
    // Use the context method if available
    if (languageContext?.changeLanguage) {
      languageContext.changeLanguage(language);
    } else {
      // Fallback to direct i18n method
      i18nInstance.changeLanguage(language);
      localStorage.setItem('language', language);
    }
    
    // Force update state to trigger re-renders
    setForceUpdate(Date.now());
  }, [i18nInstance, languageContext]);
  
  /**
   * Get the current language code
   * @returns {string} Current language code
   */
  const getCurrentLanguage = useCallback(() => {
    // Prefer language from context, fall back to i18n
    return languageContext?.currentLanguage || i18nInstance.language || 'en';
  }, [i18nInstance, languageContext]);
  
  /**
   * Check if the current language is RTL (Right-to-Left)
   * @returns {boolean} True if the current language is RTL
   */
  const isRTL = useCallback(() => {
    // Use context method if available
    if (languageContext?.isRTL) {
      return languageContext.isRTL();
    }
    
    // Fallback implementation
    const currentLang = getCurrentLanguage();
    return ['ar', 'he', 'fa', 'ur'].includes(currentLang);
  }, [getCurrentLanguage, languageContext]);
  
  /**
   * Get the direction (rtl or ltr) for the current language
   * @returns {string} 'rtl' or 'ltr'
   */
  const getDirection = useCallback(() => {
    // Use context method if available
    if (languageContext?.getDirection) {
      return languageContext.getDirection();
    }
    
    // Fallback implementation
    return isRTL() ? 'rtl' : 'ltr';
  }, [isRTL, languageContext]);
  
  /**
   * Get all available languages
   * @returns {Array} Array of available language objects with code, name and flag
   */
  const getLanguages = useCallback(() => {
    // Use context method if available
    if (languageContext?.getLanguages) {
      return languageContext.getLanguages();
    }
    
    // Fallback implementation
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
  }, [languageContext]);

  return {
    t,                  // Translate function
    i18n: i18nInstance, // i18n instance for advanced operations
    changeLanguage,     // Function to change the language
    getCurrentLanguage, // Get the current language code
    isRTL,              // Check if current language is RTL
    getDirection,       // Get text direction (rtl/ltr)
    getLanguages,       // Get all available languages
  };
};

export default useTranslation; 