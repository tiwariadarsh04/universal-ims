import PropTypes from 'prop-types';
import { Box, Typography, keyframes, useTheme, alpha, CircularProgress, LinearProgress, Skeleton } from '@mui/material';
import LOGO from '../../assets/logo.png';

// Animation constants
const ANIMATION_DURATION = {
  PULSE: 2,
  ROTATE: 4,
  FADE: 3,
  SLIDE_UP: 1,
};

// Keyframes for the animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const slideUp = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Loading component
const LoadingScreen = ({ 
  loadingText = "Loading...",
  size = 60,
  showText = true,
  fullScreen = false,
  variant = "linear", // 'circular', 'linear', 'skeleton', 'logo'
  progress = null,
  skeletonCount = 3,
  skeletonHeight = "20px",
  showPoweredBy = true,
  customStyle = {}
}) => {
  const theme = useTheme();

  const renderLoadingContent = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <LinearProgress 
              variant={progress !== null ? "determinate" : "indeterminate"}
              value={progress}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                }
              }}
            />
            {showText && (
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  color: theme.palette.text.primary,
                  animation: `${fade} ${ANIMATION_DURATION.FADE}s infinite ease-in-out`,
                }}
              >
                {loadingText}
              </Typography>
            )}
          </Box>
        );

      case 'skeleton':
        return (
          <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
            {Array(skeletonCount).fill(0).map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton 
                  variant="rectangular" 
                  height={skeletonHeight} 
                  animation="wave"
                  sx={{
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }}
                />
              </Box>
            ))}
          </Box>
        );

      case 'logo':
        return (
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              animation: `${fade} ${ANIMATION_DURATION.FADE}s infinite ease-in-out`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: size * 1.2,
                height: size * 1.2,
                borderRadius: '50%',
                background: alpha(theme.palette.primary.main, 0.1),
                filter: 'blur(20px)',
                animation: `${pulse} ${ANIMATION_DURATION.PULSE}s ease-in-out infinite`
              }
            }}
          >
            <Box
              component="img"
              src={LOGO}
              alt="Loading indicator"
              sx={{
                width: size,
                height: size,
                position: 'relative',
                zIndex: 2,
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1))',
                animation: `${pulse} ${ANIMATION_DURATION.PULSE}s ease-in-out infinite`
              }}
            />
            {showText && (
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  color: theme.palette.text.primary,
                  animation: `${fade} ${ANIMATION_DURATION.FADE}s infinite ease-in-out`,
                  textAlign: 'center',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '1rem',
                  },
                }}
              >
                {loadingText}
              </Typography>
            )}
          </Box>
        );

      case 'circular':
      default:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={size} 
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                animationDuration: '1.5s'
              }}
            />
            {showText && (
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  color: theme.palette.text.primary,
                  animation: `${fade} ${ANIMATION_DURATION.FADE}s infinite ease-in-out`,
                  textAlign: 'center',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '1rem',
                  },
                }}
              >
                {loadingText}
              </Typography>
            )}
          </Box>
        );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={fullScreen ? '100vh' : 'auto'}
      width="100%"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      sx={{
        background: fullScreen 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
          : 'transparent',
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: fullScreen ? 9999 : 'auto',
        overflow: 'hidden',
        '&::before': fullScreen ? {
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
        } : {},
        '&::after': fullScreen ? {
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
        } : {},
        ...customStyle
      }}
    >
      {renderLoadingContent()}
      
      {/* {showPoweredBy && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '2rem',
            animation: `${slideUp} ${ANIMATION_DURATION.SLIDE_UP}s ease-out forwards`,
            opacity: 0,
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
      )} */}
    </Box>
  );
};

LoadingScreen.propTypes = {
  /** The text to display while loading */
  loadingText: PropTypes.string,
  /** The size of the loading indicator in pixels */
  size: PropTypes.number,
  /** Whether to show the loading text */
  showText: PropTypes.bool,
  /** Whether to take up the full viewport height */
  fullScreen: PropTypes.bool,
  /** The type of loading indicator to show */
  variant: PropTypes.oneOf(['circular', 'linear', 'skeleton', 'logo']),
  /** Progress value for linear progress (0-100) */
  progress: PropTypes.number,
  /** Number of skeleton items to show */
  skeletonCount: PropTypes.number,
  /** Height of skeleton items */
  skeletonHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Whether to show the "Powered by" text */
  showPoweredBy: PropTypes.bool,
  /** Custom styles to apply to the container */
  customStyle: PropTypes.object
};

export default LoadingScreen;