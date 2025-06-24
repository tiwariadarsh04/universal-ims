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
  CircularProgress
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LOGO from '../../assets/logo.png';
import { getOTPForResetPassword, verifyOTP } from "../../services/Auth";
import AuthWrapper from "./AuthWrapper";
import SignInFooter from "../LandingPage/SignIn-Footer";

const OTPVerification = () => {
  const [formState, setFormState] = useState({
    otp: '',
    error: '',
    isLoading: false,
    isVerified: false,
    countdown: 60
  });

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 6 digits
    if (name === 'otp' && (/^\d*$/.test(value) && value.length <= 6)) {
      setFormState(prev => ({ ...prev, [name]: value, error: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {

      const res = await verifyOTP(email,formState.otp)

      console.log(res);
      
      if (res.success) { 
        setFormState(prev => ({ ...prev, isVerified: true, isLoading: false }));

      setTimeout(() => {
        navigate('/auth/create-new-password', { 
          state: { email: email, temptoken : res?.tempToken } 
        });
      }, 1000);

      } else {
        throw new Error(res.error || 'Invalid OTP code');
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Verification failed. Please try again.'
      }));
    }
  };

  const handleResendOTP = async() => {
    
    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    const res = await getOTPForResetPassword(email);
    console.log(res)

    if(res.error) return setFormState(prev => ({
      ...prev,
      isLoading: false,
      error: res.error || 'Failed to send OTP. Please try again.'
    }));

    setFormState(prev => ({
      ...prev,
      isLoading: false,
      error:  res.message || 'OTP has been sent to your registered email'
    }));
  };

  return (
    <>
    <AuthWrapper
      logoAnimation={formState.isLoading}
      titletxt={"OTP Verification"}
    >
        <Typography variant="body2" sx={{ 
          mb: 3, 
          color: formState.error ? 'red' : 'text.secondary',
          textAlign: 'center'
        }}>
          {formState.error ? (
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3em' }}>
              <ErrorOutlineIcon /> {formState.error}
            </span>
          ) : formState.isVerified ? (
            <span style={{ color: 'green' }}>Verified successfully! Redirecting...</span>
          ) : (
            `Enter the 6-digit code sent to ${email}`
          )}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="OTP Code"
            name="otp"
            autoFocus
            value={formState.otp}
            onChange={handleChange}
            error={!!formState.error}
            inputProps={{
              maxLength: 6,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            sx={{ 
              mb: 2,
              '& input': {
                textAlign: 'center',
                letterSpacing: '0.5em',
                fontSize: '1.5rem',
                paddingLeft: '1.5rem'
              }
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              mb: 2,
              p: 1.5,
              borderRadius: '8px',
            }}
            disabled={formState.isLoading || formState.otp.length !== 6}
          >
            {formState.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Verify OTP'
            )}
          </Button>
          
          <Grid container justifyContent="space-between">
            <Grid item>
              <Link 
                to="/auth/sign-in" 
                sx={{ 
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Back to Sign In
              </Link>
            </Grid>
            
            <Grid item>
              <Button 
                  variant="text" 
                  size="small"
                  onClick={handleResendOTP}
                  sx={{
                    color: 'primary.main',
                    textTransform: 'none',
                    minWidth: 0
                  }}
                >
                  Resend OTP
                </Button>
            </Grid>
          </Grid>
        </Box>
      </AuthWrapper>
      <SignInFooter />
      </>
  );
};

export default OTPVerification;