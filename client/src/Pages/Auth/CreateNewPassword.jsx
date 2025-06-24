import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  IconButton
} from '@mui/material';
import {
  ErrorOutline,
  Visibility,
  VisibilityOff,
  CheckCircleOutline
} from '@mui/icons-material';
import { chnagePassword } from "../../services/Auth";
import AuthWrapper from "./AuthWrapper";
import SignInFooter from "../LandingPage/SignIn-Footer";

const CreateNewPassword = () => {
  const [formState, setFormState] = useState({
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: '',
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
    passwordStrength: 0
  });

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ 
      ...prev, 
      [name]: value, 
      error: '',
      success: '' 
    }));

    // Calculate password strength if changing newPassword
    if (name === 'newPassword') {
      setFormState(prev => ({
        ...prev,
        passwordStrength: calculatePasswordStrength(value)
      }));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formState.newPassword || !formState.confirmPassword) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Please fill in all fields' 
      }));
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Passwords do not match' 
      }));
      return;
    }

    if (formState.passwordStrength < 3) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Password is too weak. Use at least 8 characters with numbers and special characters.' 
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {      
      const res = await chnagePassword(formState.newPassword, email, location.state?.temptoken);

      
      setFormState({...formState, isLoading:false})
      console.log(res);

      if(res.error) return setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: res.error
      }));
      

      setFormState(prev => ({
        ...prev,
        isLoading: false,
        success: res.message + "Redirecting.."
      }));

      // Navigate to login after 1 seconds
      setTimeout(() => {
        navigate('/auth/password-updated');
      }, 1000);

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to change password. Please try again.'
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setFormState(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const toggleConfirmPasswordVisibility = () => {
    setFormState(prev => ({
      ...prev,
      showConfirmPassword: !prev.showConfirmPassword
    }));
  };

  const getPasswordStrengthColor = () => {
    switch(formState.passwordStrength) {
      case 0: return 'error.main';
      case 1: return 'error.main';
      case 2: return 'warning.main';
      case 3: return 'info.main';
      case 4: return 'success.main';
      case 5: return 'success.main';
      default: return 'text.secondary';
    }
  };

  return (
    <>
    <AuthWrapper
    logoAnimation={formState.isLoading}
    titletxt={"Create New Password"}
    >
        
        {formState.success ? (
          <Alert 
            severity="success" 
            icon={<CheckCircleOutline fontSize="inherit" />}
            sx={{ width: '100%', mb: 2 }}
          >
            {formState.success}
          </Alert>
        ) : (
          <Typography variant="body2" sx={{ 
            mb: 3, 
            color: formState.error ? 'error.main' : 'text.secondary',
            textAlign: 'center'
          }}>
            {formState.error ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 0.5
              }}>
                <ErrorOutline fontSize="small" /> 
                {formState.error}
              </Box>
            ) : (
              email ? `Setting new password for ${email}` : "Create a strong new password"
            )}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            width: '100%',
            '& .MuiTextField-root': {
              mb: 2
            }
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            name="newPassword"
            type={formState.showPassword ? "text" : "password"}
            value={formState.newPassword}
            onChange={handleChange}
            error={!!formState.error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            helperText={
              <Box sx={{ 
                width: '100%',
                height: '4px',
                bgcolor: 'divider',
                mt: 1,
                position: 'relative'
              }}>
                <Box sx={{
                  width: `${formState.passwordStrength * 20}%`,
                  height: '100%',
                  bgcolor: getPasswordStrengthColor(),
                  transition: 'all 0.3s ease'
                }} />
              </Box>
            }
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={formState.showConfirmPassword ? "text" : "password"}
            value={formState.confirmPassword}
            onChange={handleChange}
            error={!!formState.error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {formState.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={formState.isLoading || !!formState.success}
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            {formState.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : formState.success ? (
              'Success!'
            ) : (
              'Update Password'
            )}
          </Button>
          
          <Grid container justifyContent="center">
            <Grid item>
              <Link 
                to="/auth/sign-in" 
                sx={{ 
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main'
                  }
                }}
              >
                Remember your password? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </AuthWrapper>
      <SignInFooter />
      </>
  );
};

export default CreateNewPassword;