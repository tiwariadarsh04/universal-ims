import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { markWhatsNewAsShown } from '../utils/whatsNewManager';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Button,
  IconButton,
  keyframes
} from '@mui/material';
import {
  SportsCricket,
  Restaurant,
  SportsBar,
  Pool,
  Dashboard,
  Group,
  Event,
  Inventory,
  MonetizationOn,
  Receipt,
  History,
  AdminPanelSettings,
  Analytics,
  ArrowBack,
  Code,
  DragIndicator,
  AutoGraph,
  Star
} from '@mui/icons-material';

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

const WhatsNew = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Mark What's New as shown when component mounts
    markWhatsNewAsShown();

    // Redirect to dashboard after 10 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const updates = [
    {
      version: '1.0.0',
      date: 'May 2025',
      type: 'feature',
      title: 'Developer Options',
      description: 'Advanced developer tools with keyboard shortcuts, error boundaries, and comprehensive debugging capabilities for enhanced development experience.',
      icon: <Code sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.1',
      date: 'May 2025',
      type: 'feature',
      title: 'Drag and Drop Pipeline',
      description: 'Intuitive drag and drop interface for creating data pipelines, enabling easy data flow visualization and management.',
      icon: <DragIndicator sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.2',
      date: 'May 2025',
      type: 'feature',
      title: 'Analytics Center',
      description: 'Comprehensive analytics dashboard with real-time data visualization, custom reports, and advanced metrics tracking.',
      icon: <AutoGraph sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.3',
      date: 'April 2025',
      type: 'feature',
      title: 'Sports & Recreation',
      description: 'Comprehensive sports facilities including swimming pool, sports complex, and fitness center with online booking and capacity tracking.',
      icon: <SportsCricket sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.4',
      date: 'April 2025',
      type: 'feature',
      title: 'Entertainment Hub',
      description: 'Movie theater with ticket booking, event management system, and social spaces for members to connect and enjoy.',
      icon: <Event sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.5',
      date: 'April 2025',
      type: 'feature',
      title: 'Dining Experience',
      description: 'Fine dining restaurant with menu management, table reservations, and special event dining options.',
      icon: <Restaurant sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.6',
      date: 'April 2025',
      type: 'feature',
      title: 'Member Management',
      description: 'Complete member profile management, access control, billing integration, and communication system.',
      icon: <Group sx={{ fontSize: 28 }} />
    },
    {
      version: '1.0.7',
      date: 'April 2025',
      type: 'feature',
      title: 'Administrative Tools',
      description: 'Advanced inventory management, payment processing, accounting tools, and comprehensive analytics dashboard.',
      icon: <Dashboard sx={{ fontSize: 28 }} />
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, lg: 4 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.05),
          filter: 'blur(80px)',
          animation: `${pulse} 4s ease-in-out infinite`
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '5%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.main, 0.05),
          filter: 'blur(70px)',
          animation: `${pulse} 4s ease-in-out infinite 2s`
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: { xs: 4, md: 6 },
              position: 'relative'
            }}
          >
            <IconButton
              onClick={() => navigate('/', { replace: true })}
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                color: theme.palette.primary.main,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateX(-4px)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>

            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              What's New
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                maxWidth: '600px',
                mx: 'auto',
                opacity: 0.9
              }}
            >
              Discover our latest features and improvements
            </Typography>
            <Fade in timeout={1000}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  mt: 2,
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  borderRadius: '12px',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  backdropFilter: 'blur(8px)',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                Redirecting to dashboard in 10 seconds...
              </Typography>
            </Fade>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              position: 'relative'
            }}
          >
            {updates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)',
                    background: alpha(theme.palette.background.paper, 0.8),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                      transform: 'translateY(-4px)',
                      '& .update-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        bgcolor: alpha(theme.palette.primary.main, 0.15)
                      }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box
                      className="update-icon"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                        color: theme.palette.primary.main,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      {update.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 1.5 
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          component="h3"
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            textShadow: `0 1px 2px ${alpha(theme.palette.primary.main, 0.1)}`
                          }}
                        >
                          {update.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            bgcolor: alpha(theme.palette.grey[500], 0.1),
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {update.date}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          lineHeight: 1.6,
                          opacity: 0.9
                        }}
                      >
                        {update.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          v{update.version}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '12px',
                            bgcolor: alpha(theme.palette.grey[500], 0.1),
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {update.type}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>

          <Zoom in timeout={1000} style={{ transitionDelay: '500ms' }}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                mt: 6,
                opacity: 0.8
              }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                A product by{' '}
                <Box
                  component="a"
                  href="https://konectile.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: theme.palette.primary.dark,
                      transform: 'translateY(-1px)',
                      textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  Konectile ✨
                </Box>
              </Typography>
            </Box>
          </Zoom>
        </motion.div>
      </Container>

      <style>
        {`
          @keyframes sparkle {
            0%, 100% { opacity: 0.2; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.5; transform: translateX(-50%) scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

export default WhatsNew; 