import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import all translation files
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationIT from './locales/it/translation.json';
import translationZH from './locales/zh/translation.json';
import translationJA from './locales/ja/translation.json';
import translationAR from './locales/ar/translation.json';
import translationHI from './locales/hi/translation.json';

// Resources object with translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  it: {
    translation: translationIT
  },
  zh: {
    translation: translationZH
  },
  ja: {
    translation: translationJA
  },
  ar: {
    translation: translationAR
  },
  hi: {
    translation: translationHI
  }
};

// Get initial language from localStorage or navigate
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  return savedLanguage || navigator.language?.split('-')[0] || 'en';
};

i18n
  // Load translations using http (useful for loading translations from server)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language', // Use the same key we set in the DevOption component
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded', // Bind to language change and resource loading events
      bindI18nStore: 'added removed', // Bind to store events
      transEmptyNodeValue: '', // What to return for empty nodes
    },
    
    // Ensure that translations are immediately loaded
    partialBundledLanguages: true,
    
    // Force reload when language changes
    load: 'currentOnly',
  });

// Add a change event listener for debugging
i18n.on('languageChanged', (lng) => {
  console.log(`i18n language changed to: ${lng}`);
  
  // Manually trigger a re-render by setting a timestamp in localStorage
  localStorage.setItem('i18n_timestamp', Date.now());
  
  // Force reload for RTL languages if needed
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(lng);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n; 