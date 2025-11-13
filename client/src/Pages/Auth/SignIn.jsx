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
  Zoom,
  useTheme,
  useMediaQuery,
  alpha,
  Avatar,
  Snackbar
} from '@mui/material';
import {
  ErrorOutline,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Fingerprint,
  LocationOn,
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

  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    accent: "#FF4500",
    background: theme.palette.mode === 'dark' ? "#121212" : "#f8f8f8",
    cardBg: theme.palette.mode === 'dark' ? "#1e1e1e" : "#ffffff",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

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
    if (!validateForm()) return;
    setLoginAttemptTime(new Date());
    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const roleResponse = await getUserRole(formState.username);
      if (roleResponse.error) throw new Error(roleResponse.error);

      const userRole = roleResponse.userRole;
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
          const fp = await FingerprintJS.load();
          const { visitorId } = await fp.get();
          deviceFingerprint = visitorId;
          setSecurityInfo(prev => ({...prev, fingerprint: true}));
          const location = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve(position.coords),
              (error) => reject(error),
              { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
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

      const res = await signInUserAndMember({
        username: formState.username.trim(),
        password: formState.password,
        deviceFingerprint,
        latitude,
        longitude
      });

      if(res && res.success){
        localStorage.setItem('user', JSON.stringify(res?.user));
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
      let errorMessage = error.message || 'An error occurred during sign-in';
      let errorType = 'server';

      if (attempts > 5){
        errorMessage = "Maximum attempts exceeded! Please try again later.";
        setNotification({
          open: true,
          message: 'Account temporarily locked. Please try again after 15 minutes.',
          severity: 'error'
        });
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
      const redirectPath = formState.role === 'user' || formState.role === 'viewer' 
        ? '/welcome' 
        : '/all-transaction';
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formState.role, navigate]);

  useEffect(() => {
    const user = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    if(user.token) getAuthenticated(user.token);
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setFormState(prev => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: true
      }));
    } else if(usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const getRemainingLockTime = () => {
    if (!loginAttemptTime || formState.attempts <= 5) return null;
    const lockTimeMs = 15 * 60 * 1000;
    const now = new Date();
    const elapsedMs = now - loginAttemptTime;
    const remainingMs = lockTimeMs - elapsedMs;
    if (remainingMs <= 0) return null;
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };
  const lockTimeRemaining = getRemainingLockTime();

  const clubFeatures = [
    { name: "Sports Activities", icon: <SportsCricket /> },
    { name: "Fine Dining", icon: <Restaurant /> },
    { name: "Premium Bar", icon: <SportsBar /> },
    { name: "Swimming Pool", icon: <Pool /> }
  ];

  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        const storedProfile = localStorage?.getItem('companyProfile');
        if (storedProfile) {
          try {
            const parsedProfile = JSON.parse(storedProfile);
            setCompanyProfile(parsedProfile);
          } catch (parseError) {
            localStorage.removeItem('companyProfile');
          }
        } else {
          const freshProfile = await getCompanyProfile();
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
      sx={{ minHeight: '90vh', display: 'flex', overflow: 'hidden', position: 'relative' }}
    >
      {!isMobile && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}
        >
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
                sx={{ width: 100, mb: 2, filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.15))' }}
              />
            </Box>
            <CustomTypography>Your exclusive membership experience</CustomTypography>
          </Box>
        </Box>
      )}

      <Box
        component={motion.div}
        initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ width: isMobile ? '100%' : '55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4, px: isMobile ? 2 : 8 }}
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
                sx={{ width: 100, mb: 2, filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))' }}
              />
            </Box>
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
            backdropFilter: 'blur(12px)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 15px 35px rgba(0,0,0,0.3)'
              : '0 15px 35px rgba(255,0,153,0.15)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 20px 40px rgba(0,0,0,0.4)'
                : '0 20px 40px rgba(255,0,153,0.2)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <Box sx={{ p: 3, pt: 4 }}>
            {formState.error && (
              <Zoom in={!!formState.error}>
                <Alert severity="error" icon={<ErrorOutline fontSize="inherit" />} sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                  {formState.error}
                </Alert>
              </Zoom>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', '& .MuiTextField-root': { mb: 3 } }}>
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
                  startAdornment: <InputAdornment position="start"><Email /></InputAdornment>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.25s ease-in-out',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(clubColors.primary, 0.3)}`,
                      borderColor: clubColors.primary
                    }
                  },
                  '& .MuiInputLabel-root': { color: alpha(theme.palette.text.primary, 0.7), transition: 'color 0.25s' },
                  '& .MuiInputLabel-root.Mui-focused': { color: clubColors.primary }
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
                  startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end" disabled={!!lockTimeRemaining || formState.isLoading}>
                        {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.25s ease-in-out',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(clubColors.primary, 0.3)}`,
                      borderColor: clubColors.primary
                    }
                  },
                  '& .MuiInputLabel-root': { color: alpha(theme.palette.text.primary, 0.7), transition: 'color 0.25s' },
                  '& .MuiInputLabel-root.Mui-focused': { color: clubColors.primary }
                }}
              />

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
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FFD700 30%, #FF0099 90%)',
                    boxShadow: '0 6px 20px rgba(255, 0, 153, 0.3)',
                  },
                  '&.Mui-disabled': {
                    background: theme.palette.mode === 'dark'
                      ? alpha(clubColors.primary, 0.3)
                      : alpha(clubColors.primary, 0.12),
                    color: alpha('#fff', 0.7)
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

              <FormControlLabel
                control={<Checkbox checked={formState.rememberMe} onChange={() => setFormState(prev => ({...prev, rememberMe: !prev.rememberMe}))} />}
                label="Remember me"
                sx={{ mt: 2 }}
              />
            </Box>

            {lockTimeRemaining && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" /> Account temporarily locked: {lockTimeRemaining}
              </Box>
            )}
          </Box>
        </Paper>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </Box>
      </Box>
    </Box>

    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleNotificationClose}
      message={notification.message}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
    </>
  );
};

export default SignIn;
