import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
  Divider,
  Snackbar,
  Card,
  Avatar,
  alpha
} from '@mui/material';
import {
  ErrorOutline,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  TouchApp,
  Fingerprint,
  LocationOn,
  Security,
  ArrowForward,
  AccessTime,
  NotificationsActive,
  SportsCricket,
  SportsBar,
  Restaurant,
  Pool
} from '@mui/icons-material';
import { getIsAuth, getUserRole, signInUserAndMember } from "../../services/Auth";
import { motion } from 'framer-motion';
import CustomTypography from "../../helper/CustomTypography";
import SignInFooter from "../LandingPage/SignIn-Footer";
import { getCompanyProfile } from "../../services/CompnayProfile";
import LOGO from '../../assets/logo.png';

// Animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const floatAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [0, -10, 0],
    transition: { 
      duration: 3,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

const fadeInStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const SignIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [companyProfile, setCompanyProfile] = useState(null);
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    error: '',
    errorType: '',
    isLoading: false,
    isLoggedIn: false,
    role: '',
    showPassword: false,
    attempts: 0,
    rememberMe: false
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [securityInfo, setSecurityInfo] = useState({
    fingerprint: false,
    location: false
  });
  const [loginAttemptTime, setLoginAttemptTime] = useState(null);
  const usernameRef = useRef(null);

  const navigate = useNavigate();

  // Club theme colors - Matching the AuthWrapper with magenta to gold gradient
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    accent: "#FF4500",
    background: theme.palette.mode === 'dark' ? "#121212" : "#f8f8f8",
    cardBg: theme.palette.mode === 'dark' ? "#1e1e1e" : "#ffffff",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({...notification, open: false});
  };

  const getAuthenticated = async(token) => {
    const res = await getIsAuth(token);
    if(res && res.user){
      navigate('/',{replace:true});
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ 
      ...prev, 
      [name]: value, 
      error: name === 'username' || name === 'password' ? '' : prev.error,
      errorType: name === 'username' || name === 'password' ? '' : prev.errorType 
    }));
  };

  const togglePasswordVisibility = () => {
    setFormState(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const validateForm = () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formState.username) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Username or email is required',
        errorType: 'username'
      }));
      return false;
    }
    
    if (!formState.password) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Password is required',
        errorType: 'password'
      }));
      return false;
    }
    
    if (formState.password.length < 6) {
      setFormState(prev => ({
        ...prev,
        error: 'Password must be at least 6 characters',
        errorType: 'password'
      }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set login attempt time
    setLoginAttemptTime(new Date());

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));
  
    try {
      const roleResponse = await getUserRole(formState.username);

      if (roleResponse.error) {
        throw new Error(roleResponse.error);
      }
  
      const userRole = roleResponse.userRole;
  
      // Step 2: Collect device fingerprint and geolocation only for super admins
      let deviceFingerprint = null;
      let latitude = null;
      let longitude = null;
  
      if (userRole === 'superadmin') {
        try {
          setNotification({
            open: true,
            message: 'Collecting security information for admin login...',
            severity: 'info'
          });
          
          // Get device fingerprint
          const fp = await FingerprintJS.load();
          const { visitorId } = await fp.get();
          deviceFingerprint = visitorId;
          setSecurityInfo(prev => ({...prev, fingerprint: true}));
    
          // Get geolocation
          const location = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve(position.coords),
              (error) => reject(error),
              {
                timeout: 10000,
                maximumAge: 60000,
                enableHighAccuracy: true
              }
            );
          });
          latitude = location.latitude;
          longitude = location.longitude;
          setSecurityInfo(prev => ({...prev, location: true}));
        } catch (geoError) {
          console.error('Geo location error:', geoError);
          setNotification({
            open: true,
            message: 'Could not verify location. Please enable location services.',
            severity: 'warning'
          });
          
        }
      }
  
      // Step 3: Proceed with sign-in
      const res = await signInUserAndMember({
        username: formState.username.trim(),
        password: formState.password,
        deviceFingerprint,
        latitude,
        longitude
      });

      // Successful login
      if(res && res.success){
        // Save user data
        localStorage.setItem('user', JSON.stringify(res?.user));
        
        // If remember me is checked, save username
        if (formState.rememberMe) {
          localStorage.setItem('rememberedUsername', formState.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        setFormState(prev => ({ 
          ...prev, 
          isLoading: false, 
          isLoggedIn: true, 
          role: res?.user?.roles 
        }));
        
        setNotification({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        });

        return;
      } else {
        setFormState(prev => ({ 
          ...prev, 
          error: res?.error || res?.message || 'Invalid username or password',
          errorType: 'auth',
          isLoading: false, 
          attempts: prev.attempts + 1
        }));
      }      
      
    } catch (error) {
      const attempts = formState.attempts + 1;
      let errorMessage = 'An error occurred during sign-in';
      let errorType = 'server';
      
      if (error.code) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            errorType = 'location';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            errorType = 'location';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            errorType = 'location';
            break;
          case error.UNKNOWN_ERROR:
            errorMessage = 'An unknown error occurred while fetching location.';
            errorType = 'server';
            break;
          default:
            errorMessage = error.message || error;
            errorType = 'server';
        }
      } else {
        errorMessage = error.message || error;
        errorType = 'server';
      }

      // Show more specific error after multiple attempts
      if (attempts >= 3) {
        errorMessage = `${errorMessage} - ${5 - attempts} attempts remaining`;

        if(attempts > 5){
          errorMessage = "Maximum attempts exceeded! Please try again later.";
          setNotification({
            open: true,
            message: 'Account temporarily locked. Please try again after 15 minutes.',
            severity: 'error'
          });
        }
      }

      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        errorType,
        attempts
      }));
    }
  };

  useEffect(() => {
    if (formState.role) {
      const redirectPath = 
        formState.role === 'user' || formState.role === 'viewer' 
          ? '/welcome' 
          : '/all-transaction';
      
      // Add a slight delay for better UX
      const timer = setTimeout(() => {
      navigate(redirectPath, { replace: true });
      window.location.reload();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [formState.role, navigate]);

  useEffect(() => {
    const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    if(user.token){
      getAuthenticated(user.token);
    }
    
    // Check for remembered username
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setFormState(prev => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true
      }));
    }
    
    // Focus the username field on load if it's empty
    if (!rememberedUsername && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // Calculate remaining time for locked account
  const getRemainingLockTime = () => {
    if (!loginAttemptTime || formState.attempts <= 5) return null;
    
    const lockTimeMs = 15 * 60 * 1000; // 15 minutes in milliseconds
    const now = new Date();
    const elapsedMs = now - loginAttemptTime;
    const remainingMs = lockTimeMs - elapsedMs;
    
    if (remainingMs <= 0) return null;
    
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };
  
  const lockTimeRemaining = getRemainingLockTime();

  // Club features to showcase
  const clubFeatures = [
    { name: "Sports Activities", icon: <SportsCricket /> },
    { name: "Fine Dining", icon: <Restaurant /> },
    { name: "Premium Bar", icon: <SportsBar /> },
    { name: "Swimming Pool", icon: <Pool /> }
  ];

  useEffect(() => {
  const loadCompanyProfile = async () => {
    try {
      // 1. Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage is not available');
        return;
      }

      // 2. Safely get and parse the profile
      const storedProfile = localStorage?.getItem('companyProfile');
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);
          setCompanyProfile(parsedProfile);
          console.log('Loaded profile from localStorage:', parsedProfile);
        } catch (parseError) {
          console.error('Failed to parse stored profile:', parseError);
          // Clear corrupted data
          localStorage.removeItem('companyProfile');
        }
      } else {
        console.log('No company profile found in localStorage');
      }

      // 3. Optional: Fetch fresh data if no cached version exists
      if (!storedProfile) {
        const freshProfile = await getCompanyProfile(); // Your API call
        if (freshProfile) {
          setCompanyProfile(freshProfile[0]);
          localStorage.setItem('companyProfile', JSON.stringify(freshProfile[0]));
        }
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
    }
  };

  loadCompanyProfile();
}, []);

  return (
    <>
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      sx={{
        minHeight: '90vh',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left Section - Brand/Image */}
      {!isMobile && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            p: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '15%',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'rgba(255, 215, 0, 0.15)',
              filter: 'blur(60px)',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '10%',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'rgba(255, 15, 159, 0.2)',
              filter: 'blur(50px)',
            }}
          />

          <Box sx={{ zIndex: 2, textAlign: 'center', maxWidth: '90%' }}>
            <Box
              component={motion.div}
              variants={floatAnimation}
              initial="initial"
              animate="animate"
            >
              <Box
                component="img"
                src={companyProfile?.logoUrl || LOGO}
                alt="Club logo"
                sx={{
                  width: 100,
                  mb: 2,
                  filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.15))',
                }}
              />
            </Box>
            

            <CustomTypography>
            Your exclusive membership experience
            </CustomTypography>
            <Box
              sx={{
                mb: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                position: 'relative'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.7),
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  textTransform: 'capitalize',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                Powered by
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: clubColors.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 600,
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '1px',
                      bottom: -2,
                      left: 0,
                      background: clubColors.gradient,
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.3s ease'
                    },
                    '&:hover:after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'left'
                    }
                  }}
                >
                  <a 
                    href="https://konectile.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Konectile
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: clubColors.gradient,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'scale(0.95)',
                            boxShadow: `0 0 0 0 ${alpha(clubColors.primary, 0.7)}`
                          },
                          '70%': {
                            transform: 'scale(1)',
                            boxShadow: `0 0 0 4px ${alpha(clubColors.primary, 0)}`
                          },
                          '100%': {
                            transform: 'scale(0.95)',
                            boxShadow: `0 0 0 0 ${alpha(clubColors.primary, 0)}`
                          }
                        }
                      }}
                    />
                  </a>
                </Box>
              </Typography>
            </Box>
            
            {/* Club features section */}
            <Box 
              component={motion.div}
              variants={fadeInStagger}
              initial="hidden"
              animate="visible"
              sx={{ 
                mt: 4, 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,
                maxWidth: '400px',
                mx: 'auto'
              }}
            >
              {clubFeatures.map((feature, index) => (
                <Paper
                  key={index}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <Avatar
                    sx={{ 
                      background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)', 
                      mb: 1.5,
                      width: 50,
                      height: 50,
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <CustomTypography fontWeight={500} fontSize={16}>
                      {feature.name}
                  </CustomTypography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Right Section - Login Form */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: isMobile ? '100%' : '55%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
          px: isMobile ? 2 : 8,
        }}
      >
        {isMobile && (
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              component={motion.div}
              variants={floatAnimation}
              initial="initial"
              animate="animate"
            >
              <Box
                component="img"
                src={companyProfile?.logoUrl || LOGO}
                alt="Club logo"
                sx={{ 
                  width: 100, 
                  mb: 2,
                  filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))'
                }}
              />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: clubColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              {companyProfile?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>
        )}

        <Paper
          component={motion.div}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          elevation={isMobile ? 2 : 4}
          sx={{
            width: '100%',
            maxWidth: '460px',
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: clubColors.cardBg,
            backgroundImage: theme.palette.mode === 'dark' 
              ? 'linear-gradient(rgba(255, 0, 153, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 153, 0.05) 1px, transparent 1px)' 
              : 'linear-gradient(rgba(255, 0, 153, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 153, 0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
              : '0 10px 30px rgba(255, 0, 153, 0.1)',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: clubColors.gradient
            }
          }}
        >
          {/* Card header with accent color */}
          <Box 
            sx={{ 
              py: 2.5, 
              px: 3, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: theme.palette.mode === 'dark' 
                ? alpha(clubColors.primary, 0.08)
                : alpha(clubColors.primary, 0.03),
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600,
                background: clubColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to {companyProfile?.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                mt: 0.5
              }}
            >
              Sign in to access exclusive member features
            </Typography>
          </Box>

          <Box sx={{ p: 3, pt: 4 }}>
            {formState.error && (
              <Zoom in={!!formState.error}>
          <Alert 
            severity="error" 
            icon={<ErrorOutline fontSize="inherit" />}
                  sx={{ 
                    width: '100%', 
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                  action={
                    formState.errorType === 'location' ? (
                      <Button 
                        color="error" 
                        size="small"
                        onClick={() => {
                          // Re-request permissions
                          navigator.geolocation.getCurrentPosition(() => {}, () => {});
                        }}
                      >
                        Enable
                      </Button>
                    ) : null
                  }
          >
            {formState.error}
                  {formState.attempts > 3 && (
                    <Typography variant="caption" component="div" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                      Too many failed attempts may lock your account
                    </Typography>
                  )}
          </Alert>
              </Zoom>
            )}

            {formState.isLoggedIn && (
              <Zoom in={formState.isLoggedIn}>
          <Alert 
            severity="success" 
                  sx={{ width: '100%', mb: 3, borderRadius: 2 }}
          >
            Logged in successfully! Redirecting...
          </Alert>
              </Zoom>
            )}

            {lockTimeRemaining && (
              <Alert
                severity="warning"
                icon={<NotificationsActive />}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                <Typography variant="subtitle2">
                  Account temporarily locked
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Please try again in {lockTimeRemaining}
          </Typography>
              </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            width: '100%',
            '& .MuiTextField-root': {
                  mb: 3
            }
          }}
        >
          <TextField
                inputRef={usernameRef}
            margin="normal"
            required
            fullWidth
            label="Email / Username"
            name="username"
            autoComplete="username"
                autoFocus={!formState.username}
            value={formState.username}
            onChange={handleChange}
                error={formState.errorType === 'username'}
                helperText={formState.errorType === 'username' ? formState.error : ''}
                disabled={!!lockTimeRemaining || formState.isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                      <Email />
                </InputAdornment>
              )
            }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(clubColors.primary, 0.2)}`
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha(theme.palette.text.primary, 0.7)
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: clubColors.primary
                  }
                }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={formState.showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formState.password}
            onChange={handleChange}
                error={formState.errorType === 'password'}
                helperText={formState.errorType === 'password' ? formState.error : ''}
                disabled={!!lockTimeRemaining || formState.isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                      <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                        disabled={!!lockTimeRemaining || formState.isLoading}
                  >
                    {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(clubColors.primary, 0.2)}`
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha(theme.palette.text.primary, 0.7)
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: clubColors.primary
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={formState.rememberMe} 
                      onChange={(e) => setFormState(prev => ({...prev, rememberMe: e.target.checked}))}
                      name="rememberMe"
                      sx={{ 
                        color: alpha(clubColors.primary, 0.7),
                        '&.Mui-checked': {
                          color: clubColors.primary,
                        }
                      }}
                      disabled={!!lockTimeRemaining || formState.isLoading}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                
                <Link 
                  to="/auth/forget-password" 
                  style={{ 
                    color: clubColors.primary,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
                disabled={!!lockTimeRemaining || formState.isLoading || formState.isLoggedIn}
                endIcon={!formState.isLoading && <ArrowForward />}
            sx={{
              py: 1.5,
                  borderRadius: 2,
              fontSize: '1rem',
              textTransform: 'none',
                  fontWeight: 600,
              boxShadow: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  // background: clubColors.gradient,
                  // '&:hover': {
                  //   boxShadow: `0 4px 12px ${alpha(clubColors.primary, 0.3)}`,
                  //   background: 'linear-gradient(45deg, #FF0099 20%, #FFD700 100%)'
                  // },
                  '&.Mui-disabled': {
                    background: theme.palette.mode === 'dark' 
                      ? alpha(clubColors.primary, 0.3)
                      : alpha(clubColors.primary, 0.12)
              }
            }}
          >
            {formState.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : formState.isLoggedIn ? (
              'Success!'
            ) : (
              'Sign In'
            )}
          </Button>
          
              {/* Security info for admin login */}
              {formState.isLoading && securityInfo.fingerprint && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Fingerprint color="success" /> Device verification completed
                  </Typography>
                  {securityInfo.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <LocationOn color="success" /> Location verification completed
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
                sx={{ 
            width: '100%', 
            boxShadow: 3, 
            borderRadius: 2,
            '&.MuiAlert-standardSuccess': {
              backgroundColor: alpha(clubColors.accent, 0.9),
              color: '#fff'
            },
            '&.MuiAlert-standardInfo': {
              backgroundColor: alpha(clubColors.primary, 0.9),
              color: '#fff'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
        </Box>
      <SignInFooter />
      </>
  );
};

export default SignIn;

