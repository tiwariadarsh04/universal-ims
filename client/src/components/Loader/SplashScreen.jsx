import React, { useEffect, useState } from 'react';
import { Box, Typography, keyframes, useTheme, alpha } from '@mui/material';
import LOGO from '../../assets/logo.png';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SplashScreen = ({ onFinish }) => {
  const [showPoweredBy, setShowPoweredBy] = useState(false);
  const [companyLogo, setCompanyLogo] = useState('');
  const theme = useTheme();

  useEffect(() => {
    // Show "Powered by" text after a short delay
    const timer = setTimeout(() => {
      setShowPoweredBy(true);
    }, 1000);

    // Trigger onFinish after animation completes
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);


    useEffect(() => {
      try {
        const localLogo = localStorage?.getItem('companyProfile') 
          ? JSON.parse(localStorage.getItem('companyProfile')) 
          : null;
        if (localLogo?.logoUrl) {
          setCompanyLogo(localLogo);
        } 
      } catch (error) {
        console.error('Error parsing company profile:', error);
      }
    }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        zIndex: 9999,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.1),
          filter: 'blur(60px)',
          animation: `${pulse} 3s ease-in-out infinite`
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.main, 0.1),
          filter: 'blur(50px)',
          animation: `${pulse} 3s ease-in-out infinite 1.5s`
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          animation: `${fadeIn} 1s ease-out forwards`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.1),
            filter: 'blur(20px)',
            animation: `${pulse} 2s ease-in-out infinite`
          }
        }}
      >
        <Box
          component="img"
          src={companyLogo?.logoUrl || LOGO}
          alt="Logo"
          sx={{
            width: 120,
            height: 120,
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))',
            animation: `${pulse} 2s ease-in-out infinite`
          }}
        />
      </Box>
      
      {showPoweredBy && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '2rem',
            animation: `${slideUp} 0.5s ease-out forwards`,
            zIndex: 1
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  color: theme.palette.primary.dark,
                  transform: 'translateY(-1px)'
                }
              }
            }}
          >
            Powered by{' '}
            <a
              href="https://konectile.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Konectile ✨
            </a>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SplashScreen; 