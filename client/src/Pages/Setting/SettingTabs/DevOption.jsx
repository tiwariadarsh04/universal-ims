import React, { useEffect, useState, useRef, useContext } from 'react';
import i18n from '../../../i18n';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  MenuItem,
  alpha,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Zoom,
  Grow,
  Fade,
  Avatar,
  useTheme as useMuiTheme,
  useMediaQuery
} from '@mui/material';
import {
  Palette,
  PhoneAndroid,
  DesktopWindows,
  List as ListIcon,
  Person,
  AdminPanelSettings,
  Save,
  Code,
  Construction,
  DragHandle,
  Terminal,
  BugReport,
  SettingsApplications,
  HelpCenter,
  AttachFile,
  Send,
  ContactSupport,
  Description,
  Email,
  Forum,
  SupportAgent,
  BookOnline,
  OnlinePrediction,
  OfflinePin,
  Dangerous,
  BookOutlined,
  LunchDiningTwoTone,
  DinnerDining,
  BreakfastDining,
  LunchDining,
  Check,
  ChevronRight,
  Notifications,
  Lock,
  Widgets,
  Speed,
  ColorLens,
  Brush,
  ViewQuilt,
  Tune,
  Done,
  Language,
  Translate,
  Public
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getDevOptions, updateDevOptions } from '../../../services/DevOption';
import { useDialog } from '../../../context/DialogProvider';
import { useNavigate } from 'react-router-dom';
import useTranslation from '../../../hooks/useTranslation';
import { LanguageContext } from '../../../context/LanguageProvider';
import { ThemeContext, useTheme as useCustomTheme } from '../../../context/ThemeProvider';

// Styled Components
const SettingCard = ({ children, icon, title, subtitle, delay = 0, darkMode }) => {
  const muiTheme = useMuiTheme();
  
  // Get primary color safely
  const getPrimaryColor = () => {
    try {
      return muiTheme?.palette?.primary?.main || '#2196F3';
    } catch (error) {
      return '#2196F3'; // Fallback color
    }
  };
  
  // Get secondary color safely
  const getSecondaryColor = () => {
    try {
      return muiTheme?.palette?.secondary?.main || '#FF4081';
    } catch (error) {
      return '#FF4081'; // Fallback color
    }
  };
  
  const primaryColor = getPrimaryColor();
  const secondaryColor = getSecondaryColor();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: darkMode 
            ? `linear-gradient(135deg, ${alpha('#1e1e1e', 0.8)}, ${alpha('#121212', 0.9)})`
            : `linear-gradient(135deg, ${alpha('#fff', 0.8)}, ${alpha('#f5f5f5', 0.9)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${darkMode ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`,
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          height: '100%',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            opacity: 0.8,
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(primaryColor, 0.15),
                color: primaryColor,
                width: 40,
                height: 40,
                mr: 2,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: darkMode ? '#fff' : '#333',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: darkMode ? alpha('#fff', 0.6) : alpha('#000', 0.6),
                    mt: 0.5,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          <Divider sx={{ mb: 3, opacity: darkMode ? 0.1 : 0.2 }} />
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

// Custom Toggle Button
const StyledToggleButton = ({ icon, label, selected, ...props }) => {
  const muiTheme = useMuiTheme();
  
  // Safe primary color getter
  const primaryColor = (() => {
    try {
      return muiTheme?.palette?.primary?.main || '#2196F3';
    } catch (error) {
      return '#2196F3'; // Fallback color
    }
  })();
  
  return (
    <ToggleButton
      {...props}
      value={label.toLowerCase()}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 10px',
        lineHeight: 1.3,
        textTransform: 'none',
        fontWeight: selected ? 600 : 400,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&.Mui-selected': {
          background: alpha(primaryColor, 0.15),
          color: primaryColor,
          boxShadow: `0 4px 20px ${alpha(primaryColor, 0.25)}`,
          transform: 'translateY(-2px)',
        },
        '&:hover': {
          background: alpha(primaryColor, 0.1),
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ fontSize: '24px', mb: 1 }}>{icon}</Box>
      <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>{label}</Typography>
    </ToggleButton>
  );
};

const DevOption = ({ darkMode: propsDarkMode, userID }) => {

  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useContext(LanguageContext);
  const { currentTheme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  
  const darkMode = isDarkMode;
  
  const getPrimaryColor = () => {
    try {
      return muiTheme?.palette?.primary?.main || '#2196F3';
    } catch (error) {
      return '#2196F3'; // Fallback color
    }
  };
  
  const primaryColor = getPrimaryColor();
  
  // Safe theme value getters
  const getSecondaryColor = () => {
    try {
      return muiTheme?.palette?.secondary?.main || '#FF4081';
    } catch (error) {
      return '#FF4081'; // Fallback color
    }
  };
  
  const getSuccessColor = () => {
    try {
      return muiTheme?.palette?.success?.main || '#4CAF50';
    } catch (error) {
      return '#4CAF50'; // Fallback color
    }
  };
  
  const getInfoColor = () => {
    try {
      return muiTheme?.palette?.info?.main || '#2196F3';
    } catch (error) {
      return '#2196F3'; // Fallback color
    }
  };
  
  const getErrorColor = () => {
    try {
      return muiTheme?.palette?.error?.main || '#F44336';
    } catch (error) {
      return '#F44336'; // Fallback color
    }
  };
  
  const secondaryColor = getSecondaryColor();
  const successColor = getSuccessColor();
  const infoColor = getInfoColor();
  const errorColor = getErrorColor();
  
  const [devDetails, setDevDetails] = useState({
    theme: currentTheme || '',
    menuStyle: '',
    viewMode: '',
    maintenanceMode: false,
    draggableMenu: false,
    apiLogging: false,
    reduxDebugger: false,
    performanceLevel: 0,
    language: currentLanguage,
  });
  const [file, setFile] = useState();
  const { showConfirm } = useDialog();
  const [activeSection, setActiveSection] = useState('theme');
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  
  // Helpdesk State
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackText, setFeedbackText] = useState('');
  
  // Available languages for the application
  const languages = [
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
  
  // Theme preview generator
  const getThemePreview = (themeName, isDarkMode) => {
    try {
      const themes = {
        Light: '#ffffff',
        Dark: '#121212',
        System: isDarkMode ? '#1e1e1e' : '#f5f5f5',
        Neomorphism: isDarkMode ? 'linear-gradient(145deg, #232323, #1a1a1a)' : 'linear-gradient(145deg, #ffffff, #e0e0e0)',
        Glassmorphism: isDarkMode ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        Noa: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)', 
      };
      return themes[themeName] || themes.Light;
    } catch (error) {
      console.error('Error generating theme preview:', error);
      return '#ffffff'; // Fallback to white
    }
  };

  const handleLanguageChange = async (languageCode) => {
    console.log(`DevOption: Changing language to: ${languageCode}`);
    
    try {
      // Only proceed if the language is actually changing
      if (languageCode === currentLanguage) {
        console.log('Language is already set to:', languageCode);
        return;
      }
      
      // Update local state first
      setDevDetails(prev => ({
        ...prev,
        language: languageCode
      }));
      
      // Then update context and i18n
      if (changeLanguage) {
        await changeLanguage(languageCode);
        console.log(`DevOption: Language change completed for ${languageCode}`);
      }
      
      // Show success message
      setShowSaveAnimation(true);
      setTimeout(() => setShowSaveAnimation(false), 2000);
    } catch (error) {
      console.error('Error in handleLanguageChange:', error);
    }
  };

  const handleSaveDevOptions = async () => {
    // Apply language change first to ensure it takes effect
    console.log(`DevOption: Saving settings with language: ${devDetails.language}`);
    
    // First handle language change to ensure it takes effect
    try {
      if (changeLanguage && devDetails.language !== currentLanguage) {
        console.log(`DevOption: Applying language change to ${devDetails.language}`);
        changeLanguage(devDetails.language);
      }
      
      // Apply theme change
      if (toggleTheme && devDetails.theme !== currentTheme) {
        console.log(`DevOption: Applying theme change to ${devDetails.theme}`);
        toggleTheme(devDetails.theme);
      }
    } catch (error) {
      console.error('Error changing settings during save:', error);
    }
    
    // Get user ID from props or localStorage
    const userId = userID || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null);
    
    if (!userId) {
      console.error('No user ID available for saving settings');
      return;
    }
    
    // Ensure mealOrderTypes is a valid array with at least one value
    let mealOrderTypes = [];
    if (devDetails.orderSettings?.mealOrderTypes) {
      if (Array.isArray(devDetails.orderSettings.mealOrderTypes)) {
        mealOrderTypes = devDetails.orderSettings.mealOrderTypes;
      } else if (typeof devDetails.orderSettings.mealOrderTypes === 'string') {
        mealOrderTypes = devDetails.orderSettings.mealOrderTypes.split(',').filter(Boolean);
      }
    }

    // Validate meal types against allowed values
    const validMealTypes = ['breakfast', 'lunch', 'dinner'];
    const validatedMealTypes = mealOrderTypes.filter(type => validMealTypes.includes(type));
    
    // If no valid meal types, default to lunch
    const finalMealTypes = validatedMealTypes.length > 0 ? validatedMealTypes : ['lunch'];

    // Convert the array to a comma-separated string for the database
    const mealOrderTypesString = finalMealTypes.join(',');

    const updateData = {
      theme: {
        selectedTheme: devDetails.theme,
        customColors: devDetails.customColors || {}
      },
      layout: {
        menuStyle: devDetails.menuStyle || 'desktop',
        compactMode: devDetails.compactMode || false,
        draggableMenu: devDetails.draggableMenu || false
      },
      developerTools: {
        maintenanceMode: devDetails.maintenanceMode || false,
        apiLogging: devDetails.apiLogging || false,
        reduxDebugger: devDetails.reduxDebugger || false,
        performanceLevel: devDetails.performanceLevel || 0
      },
      languageSettings: {
        applicationLanguage: devDetails.language || 'en',
        autoDetectLanguage: devDetails.autoDetectLanguage || false,
        translateMenuItems: devDetails.translateMenuItems || false
      },
      notifications: devDetails.notifications || {
        email: true,
        push: true,
        sms: false,
        soundEnabled: true
      },
      orderSettings: {
        acceptingMode: devDetails.orderSettings?.acceptingMode || 'online',
        mealOrderTypes: mealOrderTypesString // Send as string instead of array
      },
      viewMode: devDetails.viewMode || 'member'
    };
    
    console.log('Sending update data:', updateData);
    const res = await updateDevOptions(userId, updateData);

    if (res && res.success) {
      setShowSaveAnimation(true);
      setTimeout(() => setShowSaveAnimation(false), 2000);
      // Store the updated options in localStorage
      localStorage.setItem('devOptions', JSON.stringify(res.options));
      return;
    }

    console.log("something went wrong", res);
  };

  const getDevDetails = async () => {
    try {
      // Get user ID from props or localStorage
      const userId = userID || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))._id : null);
      
      if (!userId) {
        console.error('No user ID available');
        // Set defaults if no user ID
        setDevDetails({
          theme: currentTheme || 'Light',
          menuStyle: 'desktop',
          viewMode: 'member',
          maintenanceMode: false,
          draggableMenu: false,
          apiLogging: false,
          reduxDebugger: false,
          performanceLevel: 0,
          language: currentLanguage || 'en',
          customColors: {},
          compactMode: false,
          notifications: {
            email: true,
            push: true,
            sms: false,
            soundEnabled: true
          },
          orderSettings: {
            acceptingMode: 'online',
            mealOrderTypes: []
          },
          autoDetectLanguage: false,
          translateMenuItems: false
        });
        return;
      }

      const res = await getDevOptions(userId);
      console.log('API Response:', res);

      if (res && res.success) {
        const options = res.options;
        // Convert mealOrderTypes from string to array if needed
        const mealOrderTypes = typeof options.orderSettings?.mealOrderTypes === 'string'
          ? options.orderSettings.mealOrderTypes.split(',').filter(Boolean)
          : options.orderSettings?.mealOrderTypes || [];

        // Map the API response to match our state structure
        setDevDetails({
          theme: options.theme?.selectedTheme || currentTheme || 'Light',
          menuStyle: options.layout?.menuStyle || 'desktop',
          viewMode: options.viewMode || 'member',
          maintenanceMode: options.developerTools?.maintenanceMode || false,
          draggableMenu: options.layout?.draggableMenu || false,
          apiLogging: options.developerTools?.apiLogging || false,
          reduxDebugger: options.developerTools?.reduxDebugger || false,
          performanceLevel: options.developerTools?.performanceLevel || 0,
          language: options.languageSettings?.applicationLanguage || currentLanguage || 'en',
          customColors: options.theme?.customColors || {},
          compactMode: options.layout?.compactMode || false,
          notifications: options.notifications || {
            email: true,
            push: true,
            sms: false,
            soundEnabled: true
          },
          orderSettings: {
            acceptingMode: options.orderSettings?.acceptingMode || 'online',
            mealOrderTypes: mealOrderTypes
          },
          autoDetectLanguage: options.languageSettings?.autoDetectLanguage || false,
          translateMenuItems: options.languageSettings?.translateMenuItems || false
        });

        // Store the full options in localStorage for persistence
        localStorage.setItem('devOptions', JSON.stringify(options));
      }
    } catch (error) {
      console.error('Error fetching dev options:', error);
      // Try to get saved options from localStorage as fallback
      const savedOptions = localStorage.getItem('devOptions');
      if (savedOptions) {
        try {
          const options = JSON.parse(savedOptions);
          // Convert mealOrderTypes from string to array if needed
          const mealOrderTypes = typeof options.orderSettings?.mealOrderTypes === 'string'
            ? options.orderSettings.mealOrderTypes.split(',').filter(Boolean)
            : options.orderSettings?.mealOrderTypes || [];

          setDevDetails({
            theme: options.theme?.selectedTheme || currentTheme || 'Light',
            menuStyle: options.layout?.menuStyle || 'desktop',
            viewMode: options.viewMode || 'member',
            maintenanceMode: options.developerTools?.maintenanceMode || false,
            draggableMenu: options.layout?.draggableMenu || false,
            apiLogging: options.developerTools?.apiLogging || false,
            reduxDebugger: options.developerTools?.reduxDebugger || false,
            performanceLevel: options.developerTools?.performanceLevel || 0,
            language: options.languageSettings?.applicationLanguage || currentLanguage || 'en',
            customColors: options.theme?.customColors || {},
            compactMode: options.layout?.compactMode || false,
            notifications: options.notifications || {
              email: true,
              push: true,
              sms: false,
              soundEnabled: true
            },
            orderSettings: {
              acceptingMode: options.orderSettings?.acceptingMode || 'online',
              mealOrderTypes: mealOrderTypes
            },
            autoDetectLanguage: options.languageSettings?.autoDetectLanguage || false,
            translateMenuItems: options.languageSettings?.translateMenuItems || false
          });
        } catch (parseError) {
          console.error('Error parsing saved options:', parseError);
          setDefaultDevDetails();
        }
      } else {
        setDefaultDevDetails();
      }
    }
  };

  useEffect(() => {
    getDevDetails();
  }, []);

  useEffect(() => {
    // Update local state when theme context changes
    if (currentTheme && devDetails.theme !== currentTheme) {
      try {
        setDevDetails(prev => ({
          ...prev,
          theme: currentTheme
        }));
      } catch (error) {
        console.error('Error updating theme state:', error);
      }
    }
  }, [currentTheme]);

  useEffect(() => {
    if (currentLanguage && devDetails.language !== currentLanguage) {
      try {
        setDevDetails(prev => ({
          ...prev,
          language: currentLanguage
        }));
      } catch (error) {
        console.error('Error updating language state:', error);
      }
    }
  }, [currentLanguage]);

  // Sections for the navigation menu
  const sections = [
    { id: 'theme', label: 'Theme & Appearance', icon: <ColorLens /> },
    { id: 'order', label: 'Order Preferences', icon: <BookOnline /> },
    { id: 'developer', label: 'Developer Tools', icon: <Code /> },
    { id: 'helpdesk', label: 'Helpdesk & Feedback', icon: <HelpCenter /> },
    { id: 'language', label: 'Language & Region', icon: <Language /> },
  ];

  // Theme updater function with improved error handling
  const handleThemeChange = (newTheme) => {
    if (!newTheme) {
      console.error('Attempted to set undefined theme');
      return;
    }
    
    try {
      // Update local state
      setDevDetails(prev => ({
        ...prev, 
        theme: newTheme
      }));
      
      // Apply theme to the context if available
      if (typeof toggleTheme === 'function') {
        toggleTheme(newTheme);
      } else {
        console.warn('toggleTheme function not available, theme only updated locally');
        // Fallback: Store in localStorage directly
        localStorage.setItem("theme", newTheme);
      }
    } catch (error) {
      console.error('Error changing theme:', error);
      // Show feedback to user
      if (typeof showConfirm === 'function') {
        showConfirm({
          title: 'Theme Change Error',
          description: `Could not change to theme "${newTheme}". Using default theme instead.`,
          confirmText: 'OK',
          showCancel: false
        });
      }
      // Fallback to Light theme
      try {
        localStorage.setItem("theme", "Light");
      } catch (e) {
        console.error('Could not save fallback theme to localStorage', e);
      }
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      overflow: 'hidden',
      pb: 4
    }}>
      {/* Header Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          textAlign: 'center',
          mb: 5,
          mt: 2
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 1.5,
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
          }}
        >
          Developer Options
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
            mb: 3
          }}
        >
          Customize your experience with powerful developer options and personalization settings
        </Typography>
        
        {/* Navigation Menu */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4
          }}
        >
          <Paper
            elevation={darkMode ? 0 : 2}
            sx={{
              display: 'inline-flex',
              borderRadius: 8,
              p: 1,
              background: darkMode 
                ? alpha('#333', 0.3)
                : alpha('#fff', 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05)}`,
            }}
          >
            {sections.map((section) => (
              <Button
                key={section.id}
                startIcon={isMobile ? null : section.icon}
                onClick={() => setActiveSection(section.id)}
                sx={{
                  mx: 0.5,
                  px: isMobile ? 1 : 2,
                  py: 1,
                  borderRadius: 3,
                  color: activeSection === section.id
                    ? '#fff'
                    : darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                  background: activeSection === section.id
                    ? `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                    : 'transparent',
                  '&:hover': {
                    background: activeSection === section.id
                      ? `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                      : alpha(primaryColor, 0.1)
                  },
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  fontWeight: activeSection === section.id ? 600 : 400,
                  minWidth: isMobile ? 'auto' : undefined,
                }}
              >
                {isMobile ? (
                  <Tooltip title={section.label} arrow placement="bottom">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {section.icon}
                    </Box>
                  </Tooltip>
                ) : (
                  section.label
                )}
              </Button>
            ))}
          </Paper>
        </Box>
      </Box>
      
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: -1,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            sx={{
              position: 'absolute',
              width: 200 + Math.random() * 300,
              height: 200 + Math.random() * 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(primaryColor, 0.1)}, transparent 70%)`,
              filter: 'blur(40px)',
              opacity: 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </Box>
      
      {/* Success Notification */}
      <AnimatePresence>
        {showSaveAnimation && (
          <Zoom in={showSaveAnimation}>
            <Box
              sx={{
                position: 'fixed',
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
              }}
            >
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  background: muiTheme?.palette?.success?.main,
                  color: '#fff',
                }}
              >
                <Done sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight={500}>
                  Settings saved successfully!
                </Typography>
              </Paper>
            </Box>
          </Zoom>
        )}
      </AnimatePresence>

      <Grid container spacing={3}>
      {/* Theme & Appearance Section */}
        {activeSection === 'theme' && (
          <Grid item xs={12}>
            <SettingCard
              icon={<Palette />}
              title="Theme & Appearance"
              subtitle="Customize the visual style of your application"
              darkMode={darkMode}
            >
              <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Brush sx={{ mr: 1, fontSize: 20, color: primaryColor }} />
                    Theme Selection
            </Typography>
            
                  <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                      {['Light', 'Dark', 'System', 'Neomorphism', 'Glassmorphism', 'Noa'].map((themeOption, index) => (
                        <Grid item xs={4} key={themeOption}>
                          <motion.div
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Box
                              onClick={() => handleThemeChange(themeOption)}
                              sx={{ 
                                cursor: 'pointer',
                                position: 'relative',
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: devDetails.theme === themeOption 
                                  ? `0 8px 25px ${alpha(primaryColor, 0.5)}`
                                  : darkMode 
                                    ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                                    : '0 4px 15px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                border: `2px solid ${devDetails.theme === themeOption 
                                  ? primaryColor 
                                  : 'transparent'}`,
                                height: 70,
                              }}
                            >
                              <Box sx={{ 
                                background: getThemePreview(themeOption, darkMode),
                                height: '100%',
                                width: '100%',
                                p: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: ['Dark', 'Noa'].includes(themeOption) ? '#fff' : '#333',
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {themeOption}
                      </Typography>
                              </Box>
                              
                              {devDetails.theme === themeOption && (
                                <Box
                                  component={motion.div}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: primaryColor,
                                    borderRadius: '50%',
                                    width: 20,
                                    height: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Check sx={{ fontSize: 14, color: '#fff' }} />
                                </Box>
                              )}
                            </Box>
                          </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
                
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ViewQuilt sx={{ mr: 1, fontSize: 20, color: primaryColor }} />
                    Layout Options
                  </Typography>
            
            <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7) }}>
                      Menu Style
                    </Typography>
                    
              <ToggleButtonGroup
                value={devDetails.menuStyle}
                exclusive
                      onChange={(e, newStyle) => setDevDetails({...devDetails, menuStyle: newStyle})}
                      sx={{ display: 'flex', width: '100%', gap: 2 }}
                    >
                      <StyledToggleButton 
                        icon={<PhoneAndroid />} 
                        label="Mobile" 
                        selected={devDetails.menuStyle === 'mobile'}
                      />
                      <StyledToggleButton 
                        icon={<DesktopWindows />} 
                        label="Desktop" 
                        selected={devDetails.menuStyle === 'desktop'}
                      />
                      <StyledToggleButton 
                        icon={<ListIcon />} 
                        label="List" 
                        selected={devDetails.menuStyle === 'list'}
                      />
              </ToggleButtonGroup>
            </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Tune sx={{ mr: 1, fontSize: 20, color: primaryColor }} />
                    Interface Settings
                  </Typography>
            
            <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7) }}>
                      View Mode
                    </Typography>
                    
              <ToggleButtonGroup
                value={devDetails.viewMode}
                exclusive
                      onChange={(e, newMode) => setDevDetails({...devDetails, viewMode: newMode})}
                      sx={{ display: 'flex', width: '100%', gap: 2 }}
                    >
                      <StyledToggleButton 
                        icon={<Person />} 
                        label="Member" 
                        selected={devDetails.viewMode === 'member'}
                      />
                      <StyledToggleButton 
                        icon={<AdminPanelSettings />} 
                        label="Admin" 
                        selected={devDetails.viewMode === 'admin'}
                      />
              </ToggleButtonGroup>
            </Box>
                  
            <Box
              sx={{
                mt: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
            <Button 
              variant="contained" 
              startIcon={<Save />}
              onClick={handleSaveDevOptions}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 4px 15px ${alpha(primaryColor, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 6px 20px ${alpha(primaryColor, 0.5)}`,
                        },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Save Appearance Settings
            </Button>
                  </Box>
      </Grid>
              </Grid>
            </SettingCard>
          </Grid>
        )}

        {/* Order Preferences Section */}
        {activeSection === 'order' && (
          <Grid item xs={12}>
            <SettingCard
              icon={<BookOnline />}
              title="Order Preferences"
              subtitle="Configure your order settings and behaviors"
              darkMode={darkMode}
              delay={1}
            >
              <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <OnlinePrediction sx={{ mr: 1, fontSize: 20, color: primaryColor }} />
                    Order Accepting Mode
            </Typography>
                  
                  <Box 
                    sx={{ 
                      mb: 4,
                      position: 'relative',
                      p: 2,
                      borderRadius: 3,
                      bgcolor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                        fontWeight: 500,
                      }}
                    >
                      Choose how customers can place orders
                    </Typography>
                    
                    <ToggleButtonGroup
                      value={devDetails.orderSettings?.acceptingMode || 'online'}
                      exclusive
                      onChange={(e, newMode) => setDevDetails({
                        ...devDetails,
                        orderSettings: {
                          ...devDetails.orderSettings,
                          acceptingMode: newMode
                        }
                      })}
                      sx={{ display: 'flex', width: '100%', mb: 2 }}
                    >
                      <Box 
                        component={motion.div} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        sx={{ 
                          flex: 1,
                          mr: 2,
                        }}
                      >
                        <Box
                          onClick={() => setDevDetails({
                            ...devDetails,
                            orderSettings: {
                              ...devDetails.orderSettings,
                              acceptingMode: 'online'
                            }
                          })}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            border: `2px solid ${devDetails.orderSettings?.acceptingMode === 'online' 
                              ? secondaryColor 
                              : darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.1)}`,
                            bgcolor: devDetails.orderSettings?.acceptingMode === 'online'
                              ? alpha(secondaryColor, 0.1)
                              : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(secondaryColor, 0.2),
                                color: secondaryColor,
                                width: 36,
                                height: 36,
                                mr: 1.5,
                              }}
                            >
                              <OnlinePrediction />
                            </Avatar>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                color: devDetails.orderSettings?.acceptingMode === 'online'
                                  ? secondaryColor
                                  : darkMode ? '#fff' : '#333'
                              }}
                            >
                              Online Mode
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7) }}>
                            Accept orders from customers in real-time
                          </Typography>
                          
                          {devDetails.orderSettings?.acceptingMode === 'online' && (
                            <Chip
                              label="Active"
                              size="small"
                              color="success"
                              icon={<Check />}
                              sx={{ 
                                mt: 2,
                                fontWeight: 500,
                              }}
                            />
                          )}
                    </Box>
                      </Box>
                      
                      <Box 
                        component={motion.div} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        sx={{ 
                          flex: 1 
                        }}
                      >
                        <Box
                          onClick={() => setDevDetails({
                            ...devDetails,
                            orderSettings: {
                              ...devDetails.orderSettings,
                              acceptingMode: 'offline'
                            }
                          })}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            border: `2px solid ${devDetails.orderSettings?.acceptingMode === 'offline' 
                              ? errorColor 
                              : darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.1)}`,
                            bgcolor: devDetails.orderSettings?.acceptingMode === 'offline'
                              ? alpha(errorColor, 0.1)
                              : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(errorColor, 0.2),
                                color: errorColor,
                                width: 36,
                                height: 36,
                                mr: 1.5,
                              }}
                            >
                              <OfflinePin />
                            </Avatar>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                color: devDetails.orderSettings?.acceptingMode === 'offline'
                                  ? errorColor
                                  : darkMode ? '#fff' : '#333'
                              }}
                            >
                              Offline Mode
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7) }}>
                            Temporarily disable new order acceptance
                          </Typography>
                          
                          {devDetails.orderSettings?.acceptingMode === 'offline' && (
                            <Chip
                              label="Active"
                              size="small"
                              color="error"
                              icon={<Check />}
                              sx={{ 
                                mt: 2,
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </ToggleButtonGroup>
                  </Box>
              </Grid>
              
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <LunchDining sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    Meal Order Types
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                      }}
                    >
                      Select which meal types to offer on your menu
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {[
                        { value: 'breakfast', label: 'Breakfast', icon: <BreakfastDining />, color: '#FF9800' },
                        { value: 'lunch', label: 'Lunch', icon: <LunchDining />, color: '#2196F3' },
                        { value: 'dinner', label: 'Dinner', icon: <DinnerDining />, color: '#9C27B0' }
                      ].map((option, index) => (
                        <Grid item xs={12} key={option.value}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 3,
                                bgcolor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                                border: `1px solid ${devDetails.orderSettings?.mealOrderTypes?.[0] === option.value
                                  ? option.color
                                  : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: darkMode ? alpha('#fff', 0.07) : alpha('#000', 0.03),
                                  transform: 'translateY(-2px)',
                                  boxShadow: `0 4px 15px ${alpha(option.color, 0.2)}`
                                }
                              }}
                              onClick={() => {
                                setDevDetails({
                                  ...devDetails,
                                  orderSettings: {
                                    ...devDetails.orderSettings,
                                    mealOrderTypes: [option.value]
                                  }
                                });
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                  sx={{ 
                                    bgcolor: alpha(option.color, 0.2),
                                    color: option.color,
                                    width: 40,
                                    height: 40,
                                    mr: 2,
                                  }}
                                >
                                  {option.icon}
                                </Avatar>
                                <Box>
                                  <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: darkMode ? '#fff' : '#333'
                                    }}
                                  >
                                    {option.label}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: darkMode ? alpha('#fff', 0.6) : alpha('#000', 0.6)
                                    }}
                                  >
                                    {option.value === 'breakfast' ? '6 AM - 11 AM' : 
                                     option.value === 'lunch' ? '12 PM - 4 PM' : '6 PM - 10 PM'}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Switch
                                checked={devDetails.orderSettings?.mealOrderTypes?.[0] === option.value}
                                onChange={() => {
                                  setDevDetails({
                                    ...devDetails,
                                    orderSettings: {
                                      ...devDetails.orderSettings,
                                      mealOrderTypes: [option.value]
                                    }
                                  });
                                }}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: option.color,
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: alpha(option.color, 0.5),
                                  },
                                }}
                              />
                            </Box>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<BookOutlined />}
                      onClick={handleSaveDevOptions}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${secondaryColor}, ${secondaryColor})`,
                        boxShadow: `0 4px 15px ${alpha(secondaryColor, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 6px 20px ${alpha(secondaryColor, 0.5)}`,
                        },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Save Order Preferences
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>
        )}

        {/* Developer Tools Section */}
        {activeSection === 'developer' && (
          <Grid item xs={12}>
            <SettingCard
              icon={<Code />}
              title="Developer Tools"
              subtitle="Advanced tools for developers"
              darkMode={darkMode}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Construction sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    Maintenance Mode
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch 
                          checked={devDetails.maintenanceMode}
                          onChange={() => setDevDetails({...devDetails, maintenanceMode: !devDetails.maintenanceMode})}
                          color="primary"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: secondaryColor,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: alpha(secondaryColor, 0.5),
                            },
                          }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Construction sx={{ mr: 1, fontSize: 20, color: secondaryColor }} /> 
                          <Typography sx={{ color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9) }}>
                            Enable Maintenance Mode
                          </Typography>
                    </Box>
                  }
                />
                  </Box>
              </Grid>
              
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <DragHandle sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    Draggable Menu
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch 
                          checked={devDetails.draggableMenu}
                          onChange={() => setDevDetails({...devDetails, draggableMenu: !devDetails.draggableMenu})}
                          color="primary"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: secondaryColor,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: alpha(secondaryColor, 0.5),
                            },
                          }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DragHandle sx={{ mr: 1, fontSize: 20, color: secondaryColor }} /> 
                          <Typography sx={{ color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9) }}>
                            Enable Draggable Menu
                          </Typography>
                    </Box>
                  }
                />
                  </Box>
              </Grid>
            </Grid>
            </SettingCard>
      </Grid>
        )}

      {/* Helpdesk & Feedback Section */}
        {activeSection === 'helpdesk' && (
      <Grid item xs={12}>
            <SettingCard
              icon={<HelpCenter />}
              title="Helpdesk & Feedback"
              subtitle="Get support and share your feedback"
              darkMode={darkMode}
              delay={3}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 3, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Forum sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    Submit Feedback
          </Typography>
          
          <form 
            action="https://formsubmit.co/2eaaad994fe4740ebf4f7b6d8bd2d47a" 
            method="POST"
            encType="multipart/form-data"
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                      border: `1px solid ${darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05)}`,
                    }}
          >
            <input type="hidden" name="_subject" value="New Feedback Submission" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value={`https://club-ims.vercel.app/feedback-form-success`}/>
            
                  <TextField
                    select
                    label="Feedback Type"
                    name="feedbackType"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    fullWidth
                    variant="outlined"
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                  >
                    <MenuItem value="bug">Bug Report</MenuItem>
                    <MenuItem value="feature">Feature Request</MenuItem>
                    <MenuItem value="ui">UI/UX Feedback</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                  
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                      rows={6}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="Please describe in detail..."
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                      }}
                    >
                    <Button 
                      variant="outlined" 
                      component="label"
                        startIcon={<AttachFile />}
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        {file ? file?.name.length > 20 ? file?.name.substring(0, 20) + '...' : file?.name : 'Attach Screenshot'}
                      <input 
                        type="file" 
                        name="attachment"
                        hidden 
                        accept="image/*" 
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      type="submit"
                        endIcon={<Send />}
                        disabled={!feedbackText.trim()}
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          background: `linear-gradient(90deg, ${secondaryColor}, ${secondaryColor})`,
                          boxShadow: `0 4px 15px ${alpha(secondaryColor, 0.3)}`,
                          '&:hover': {
                            boxShadow: `0 6px 20px ${alpha(secondaryColor, 0.5)}`,
                          },
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Submit Feedback
                    </Button>
                  </Box>
                  </form>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 3, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ContactSupport sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    Support Options
                  </Typography>
                  
                  <Box
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    {[
                      {
                        title: 'Documentation',
                        description: 'Read our detailed guides and documentation',
                        icon: <Description sx={{ color: '#9C27B0' }} />,
                        action: () => navigate('/documentation'),
                        color: '#9C27B0'
                      },
                      {
                        title: 'Email Support',
                        description: 'support@konectile.com',
                        icon: <Email sx={{ color: '#2196F3' }} />,
                        action: () => window.open('mailto:support@konectile.com'),
                        color: '#2196F3'
                      },
                      {
                        title: 'Call Support',
                        description: 'Get help from our support team',
                        icon: <SupportAgent sx={{ color: '#4CAF50' }} />,
                        action: () => window.open('tel:+4733378901', '_blank'),
                        color: '#4CAF50'
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Box
                          sx={{
                            p: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderBottom: index < 2 ? `1px solid ${darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05)}` : 'none',
                            '&:hover': {
                              bgcolor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                            }
                          }}
                          onClick={item.action}
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha(item.color, 0.15),
                              color: item.color,
                              width: 48,
                              height: 48,
                              mr: 2,
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                color: darkMode ? '#fff' : '#333'
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7)
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                          
                          <ChevronRight sx={{ 
                            color: darkMode ? alpha('#fff', 0.5) : alpha('#000', 0.3),
                            transition: 'all 0.2s ease',
                          }} />
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                  
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      borderRadius: 4,
                      bgcolor: alpha(secondaryColor, 0.1),
                      border: `1px solid ${alpha(secondaryColor, 0.2)}`,
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#fff' : '#333',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Notifications sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                      Quick Tips
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                        mb: 1,
                      }}
                    >
                      • For urgent issues, please contact us directly by phone
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                        mb: 1,
                      }}
                    >
                      • Screenshots help us diagnose problems faster
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                      }}
                    >
                      • Most questions are answered in our documentation
                    </Typography>
                </Box>
              </Grid>
              </Grid>
            </SettingCard>
          </Grid>
        )}

        {/* Language & Region Section */}
        {activeSection === 'language' && (
          <Grid item xs={12}>
            <SettingCard
              icon={<Language />}
              title={t('settings.language.title')}
              subtitle={t('settings.language.subtitle')}
              darkMode={darkMode}
              delay={2}
            >
              <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Translate sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    {t('settings.language.applicationLanguage')}
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                      }}
                    >
                      {t('settings.language.selectPreferred')}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {languages.map((language, index) => (
                        <Grid item xs={6} sm={4} key={language.code}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                          >
                            <Box
                              onClick={() => handleLanguageChange(language.code)}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                border: `2px solid ${devDetails.language === language.code 
                                  ? secondaryColor 
                                  : darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.1)}`,
                                bgcolor: devDetails.language === language.code
                                  ? alpha(secondaryColor, 0.1)
                                  : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                minHeight: 100,
                                '&:hover': {
                                  borderColor: alpha(secondaryColor, 0.5),
                                  boxShadow: `0 4px 20px ${alpha(secondaryColor, 0.15)}`,
                                  transform: 'translateY(-4px)',
                                }
                              }}
                            >
                              <Typography 
                                variant="h4" 
                                sx={{ 
                                  mb: 1,
                                  fontWeight: 400,
                                }}
                              >
                                {language.flag}
                              </Typography>
                              
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: devDetails.language === language.code
                                    ? secondaryColor
                                    : darkMode ? '#fff' : '#333',
                                  textAlign: 'center',
                                }}
                              >
                                {language.name}
                              </Typography>
                              
                              {devDetails.language === language.code && (
                                <Chip
                                  label={t('common.active')}
                                  size="small"
                                  color="primary"
                                  icon={<Check />}
                                  sx={{ 
                                    mt: 1,
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                    </Box>
                          </motion.div>
                  </Grid>
                      ))}
            </Grid>
                  </Box>
    </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      color: darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.9),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Public sx={{ mr: 1, fontSize: 20, color: secondaryColor }} />
                    {t('settings.language.settings')}
                  </Typography>
                  
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                      border: `1px solid ${darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05)}`,
                      mb: 4,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 3,
                        color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.7),
                      }}
                    >
                      {t('settings.language.description')}
                    </Typography>
                    
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: darkMode ? alpha('#fff', 0.07) : alpha('#000', 0.03),
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Notifications 
                          sx={{ 
                            mr: 1.5, 
                            color: secondaryColor,
                            fontSize: 20,
                          }} 
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: darkMode ? '#fff' : '#333',
                          }}
                        >
                          {t('settings.language.autoDetect')}
                        </Typography>
                      </Box>
                      
                      <Switch
                        checked={devDetails.autoDetectLanguage}
                        onChange={(e) => setDevDetails({
                          ...devDetails,
                          autoDetectLanguage: e.target.checked
                        })}
                        color="primary"
                      />
                    </Box>
                  </Box>
                  
                  <Box
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveDevOptions}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${secondaryColor}, ${secondaryColor})`,
                        boxShadow: `0 4px 15px ${alpha(secondaryColor, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 6px 20px ${alpha(secondaryColor, 0.5)}`,
                        },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Save Language Settings
                    </Button>
                  </Box>
    </Grid>
              </Grid>
            </SettingCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DevOption;