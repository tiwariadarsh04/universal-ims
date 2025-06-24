import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  useTheme,
  Fade,
  Slide,
  Zoom,
  styled 
} from '@mui/material';
import { LockReset, CheckCircle } from '@mui/icons-material';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import LOGO from '../../assets/logo.png';
import CustomTypography from '../../helper/CustomTypography';
import SignInFooter from '../LandingPage/SignIn-Footer';

const CelebrationBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    padding: 2,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    borderRadius: theme.shape.borderRadius * 3
  }
}));

export default function PasswordChangeCelebration() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showSuccessTip, setShowSuccessTip] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    const tipTimer = setTimeout(() => setShowSuccessTip(false), 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(confettiTimer);
      clearTimeout(tipTimer);
    };
  }, []);

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: 8,
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Background pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #e0e0e0 1px, transparent 0)',
        backgroundSize: '20px 20px',
        opacity: 0.1,
        zIndex: -1
      }} />

      {/* Confetti */}
      <div aria-hidden="true">
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={showConfetti ? 200 : 0}
          gravity={0.3}
          wind={0.01}
          opacity={0.8}
          colors={[
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main
          ]}
        />
      </div>
      
      <Fade in timeout={1000}>
        <CelebrationBox>
          {/* Logo with zoom animation */}
          <Zoom in timeout={800} style={{ transitionDelay: '300ms' }}>
            <img
              src={LOGO}
              width={80}
              style={{ 
                margin: '0.5em', 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' 
              }}
              alt="Noamundi Club Logo"
            />
          </Zoom>
          
          {/* Title with checkmark icon */}
          <Slide direction="down" in timeout={800} style={{ transitionDelay: '500ms' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 2,
              mb: 1
            }}>
              <CheckCircle color="success" sx={{ fontSize: '2rem' }} />
              <CustomTypography fontSize="2rem">
                Password Updated!
              </CustomTypography>
            </Box>
          </Slide>
          
          {/* Success message */}
          <Slide direction="up" in timeout={800} style={{ transitionDelay: '700ms' }}>
            <Typography variant="body1" sx={{ 
              mt: 2, 
              mb: 3, 
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}>
              Your account security has been upgraded successfully.
            </Typography>
          </Slide>

          {/* Temporary success tip */}
          {showSuccessTip && (
            <Fade in timeout={2000}>
              <Typography color="success.main" sx={{ mb: 2 }}>
                You can now login with your new password!
              </Typography>
            </Fade>
          )}
          
          {/* Login button */}
          <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2 
          }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<LockReset />}
              onClick={() => navigate('/auth/sign-in', { replace: true })}
              sx={{
                borderRadius: 20,
                px: 4,
                fontWeight: 'bold',
                boxShadow: theme.shadows[4],
                background: `linear-gradient(45deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6],
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Login Securely
            </Button>
          </Box>
        </CelebrationBox>
      </Fade>
      
      {/* Timestamp */}
      <Box sx={{ 
        mt: 4, 
        textAlign: 'center',
        opacity: 0.7,
        fontSize: '0.8rem'
      }}>
        <Typography variant="caption">
          {format(new Date(), "MMMM do yyyy, h:mm:ss a")}
        </Typography>
      </Box>

      <SignInFooter/>
    </Container>
  );
}