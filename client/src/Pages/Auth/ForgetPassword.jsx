import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getOTPForResetPassword } from "../../services/Auth";
import AuthWrapper from "./AuthWrapper";
import SignInFooter from "../LandingPage/SignIn-Footer";

const ForgetPassword = () => {
  const [formState, setFormState] = useState({
    username: '',
    error: '',
    success: '',
    isLoading: false,
    isSubmitted: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ 
      ...prev, 
      [name]: value, 
      error: '',
      success: '' 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.username.trim()) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Please enter your email/username' 
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const res = await getOTPForResetPassword(formState.username);

      if(res.error) return setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: res.error || 'Failed to send OTP. Please try again.'
      }));


      setFormState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitted: true,
        success: 'OTP has been sent to your registered email'
      }));

      // Navigate to OTP verification after 2 seconds
      setTimeout(() => {
        navigate('/auth/verify-otp', { 
          state: { email: formState.username } 
        });
      }, 1000);

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to send OTP. Please try again.'
      }));
    }
  };

  return (
    <>
    <AuthWrapper
      logoAnimation={formState.isLoading}
      titletxt={"Password Recovery"}
    >
        
        {formState.success ? (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
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
                <ErrorOutlineIcon fontSize="small" /> 
                {formState.error}
              </Box>
            ) : (
              "Enter your registered email to receive OTP"
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
            label="Email / Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formState.username}
            onChange={handleChange}
            error={!!formState.error}
            disabled={formState.isSubmitted}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'text.secondary'
              }
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={formState.isLoading || formState.isSubmitted}
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
            ) : formState.isSubmitted ? (
              'OTP Sent Successfully'
            ) : (
              'Send OTP'
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

export default ForgetPassword;