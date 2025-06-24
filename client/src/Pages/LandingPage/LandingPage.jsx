import React, { Suspense, lazy, useContext, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Fade
} from '@mui/material';
import {
  DateRange,
  Movie,
  Menu as MenuIcon,
  ArrowRightAlt,
  ChevronRight
} from '@mui/icons-material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import { UserProfileContext } from '../../context/userProvider';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '../../components/Loader/LoadingScreen';

// Lazy load heavy components
const GallerySection = lazy(() => import('./Gallary'));
const Carousel = lazy(() => import('./Carousel'));
const ExecutiveCommitteeSection = lazy(() => import('./Committee'));
const Events = lazy(() => import('./Events'));

import CalendarAgenda from './Calender';
import SignInFooter from './SignIn-Footer';

// Custom components
const FloatingDotsBackground = ({ children }) => (
  <Box sx={{
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(255, 107, 107, 0.1) 0px, transparent 1px),
        radial-gradient(circle at 80% 70%, rgba(78, 205, 196, 0.1) 0px, transparent 1px),
        radial-gradient(circle at 40% 80%, rgba(255, 179, 71, 0.1) 0px, transparent 1px),
        radial-gradient(circle at 60% 20%, rgba(212, 165, 165, 0.1) 0px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
      zIndex: 0,
      opacity: 0.6
    }
  }}>
    <Box position="relative" zIndex={1}>
      {children}
    </Box>
  </Box>
);

const LoadingFallback = ({ height = '400px', text = 'Loading...' }) => (
  <LoadingScreen 
    loadingText={text}
    variant="skeleton"
    skeletonCount={1}
    skeletonHeight={height}
    fullScreen={false}
    showPoweredBy={false}
  />
);

const SectionHeader = ({ title, subtitle, color }) => (
  <Box sx={{ textAlign: 'center', mb: 6 }}>
    <Typography 
      variant="overline" 
      sx={{ 
        color: color || 'primary.main',
        fontWeight: 'bold',
        letterSpacing: '3px',
        display: 'block',
        mb: 1
      }}
    >
      {subtitle}
    </Typography>
    <Typography 
      variant="h3" 
      sx={{ 
        fontWeight: 'bold',
        position: 'relative',
        display: 'inline-block',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '3px',
          background: color || 'primary.main',
          borderRadius: '3px'
        }
      }}
    >
      {title}
    </Typography>
  </Box>
);

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userProfile } = useContext(UserProfileContext);
  const [showCalenderAgenda, setShowCalenderAgenda] = useState(false);
  const [compnayProfile, setCompanyProfile] = useState(
    localStorage?.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : null
  );
  const navigate = useNavigate();

  const actionButtons = useMemo(() => [
    {
      icon: ReceiptIcon,
      title: 'My Bill',
      subtitle: 'View your invoices and payment history',
      onClick: () => {
        const userId = userProfile?._id;
        if (!userId) return window.location.reload();
        navigate(`/user-transactions/${userId}`);
      },
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
      hoverEffect: 'pulse',
      iconColor: '#FF6B6B',
      particleColor: '#FF8E53'
    },
    {
      icon: RestaurantMenuIcon,
      title: 'Order',
      subtitle: 'Explore our delicious menu options',
      onClick: () => navigate('/menu-details'),
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
      hoverEffect: 'float',
      iconColor: '#4ECDC4',
      particleColor: '#45B7D1'
    },
    {
      icon: DateRange,
      title: 'Calendar',
      subtitle: 'Check upcoming club events',
      onClick: () => setShowCalenderAgenda(true),
      gradient: 'linear-gradient(135deg, #FFB347 0%, #FFCC33 100%)',
      hoverEffect: 'spin',
      iconColor: '#FFB347',
      particleColor: '#FFCC33'
    },
    {
      icon: Movie,
      title: 'Movies',
      subtitle: 'Discover upcoming screenings',
      onClick: () => navigate('/movies'),
      gradient: 'linear-gradient(135deg, #D4A5A5 0%, #FFB6C1 100%)',
      hoverEffect: 'ripple',
      iconColor: '#D4A5A5',
      particleColor: '#FFB6C1'
    }
], [userProfile, navigate]);

  if (showCalenderAgenda) {
    return (
      <Suspense fallback={<LoadingFallback text="Loading Calendar..." />}>
        <CalendarAgenda onclose={() => setShowCalenderAgenda(false)} />
      </Suspense>
    );
  }

  return (
    <FloatingDotsBackground>
      <AnimatePresence>
        <Box sx={{ overflowX: 'hidden' }}>
          {/* Hero Carousel Section */}
          {/* <Suspense fallback={<LoadingFallback height="100vh" />}>
            <Box sx={{ 
              height: isMobile ? '70vh' : '100vh', 
              width: '100%', 
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Carousel />
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: 4
              }}>
                <motion.div
                  animate={{ y: [10, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <ArrowRightAlt sx={{ 
                    color: 'white', 
                    fontSize: '3rem',
                    transform: 'rotate(90deg)',
                    cursor: 'pointer'
                  }} />
                </motion.div>
              </Box>
            </Box>
          </Suspense> */}

          {/* Welcome Section */}

        <Container maxWidth="lg" component="section" id="welcome" sx={{ 
          mt: isMobile ? 4 : 8,
          mb: isMobile ? 8 : 12,
          position: 'relative',
          zIndex: 1
        }}>
          <Fade in timeout={1000}>
            <Paper elevation={0} sx={{ 
              textAlign: 'center', 
              py: isMobile ? 4 : 6,
              px: isMobile ? 2 : 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              // boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
              position: 'relative',
              transformStyle: 'preserve-3d',
              
            }}>
              {/* Animated floating particles background */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 0,
                '& > div': {
                  position: 'absolute',
                  borderRadius: '50%',
                  // background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                  opacity: 0.2,
                  animation: 'float 15s infinite linear',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0) rotate(0deg)' },
                    '100%': { transform: 'translateY(-1000px) rotate(720deg)' }
                  }
                }
              }}>
                {[...Array(15)].map((_, i) => (
                  <Box key={i} sx={{
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100 + 100}%`,
                    animationDelay: `${Math.random() * 15}s`,
                    animationDuration: `${Math.random() * 20 + 10}s`
                  }} />
                ))}
              </Box>
              
              {/* Holographic title effect */}
              <Typography 
                variant={isMobile ? 'h4' : 'h2'} 
                component="h2"
                sx={{ 
                  mb: 3, 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF0099 20%, #FFD700 80%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                  position: 'relative',
                  display: 'inline-block',
                  textShadow: '0 0 10px rgba(255, 0, 153, 0.3), 0 0 20px rgba(255, 215, 0, 0.2)'
                }}
              >
                Welcome to {compnayProfile?.name || 'Our Club'}
              </Typography>
              
              {/* Animated divider */}
              <Divider sx={{ 
                width: '120px', 
                height: '4px', 
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                mx: 'auto',
                mb: 4,
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '20px',
                  height: '100%',
                  background: 'rgba(255,255,255,0.8)',
                  animation: 'shine 3s infinite',
                  '@keyframes shine': {
                    '0%': { transform: 'translateX(-30px)' },
                    '100%': { transform: 'translateX(150px)' }
                  }
                }
              }} />
              
              {/* Description with animated underline */}
              <Typography 
                variant={isMobile ? 'body1' : 'h6'} 
                component="p"
                sx={{ 
                  mb: 4, 
                  maxWidth: '800px', 
                  mx: 'auto',
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  position: 'relative',
                  display: 'inline-block',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover::before': {
                    background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
                    height: '2px'
                  }
                }}
              >
                {compnayProfile?.about}
              </Typography>
              
              {/* Futuristic action buttons grid */}
              <Grid container spacing={3} justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
                {actionButtons.map((button, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{
                      perspective: '1000px',
                      '&:hover > div': {
                        transform: 'rotateY(15deg) translateY(-10px)',
                        boxShadow: `0 15px 30px ${button.shadowColor || 'rgba(0,0,0,0.2)'}`
                      }
                    }}>
                      <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: button.gradient,
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: `radial-gradient(circle, ${button.particleColor} 0%, transparent 70%)`,
                          opacity: 0,
                          transition: 'opacity 0.4s ease'
                        },
                        '&:hover::before': {
                          opacity: 0.2
                        }
                      }} onClick={button.onClick}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          <Box sx={{
                            width: 60,
                            height: 60,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            '& svg': {
                              fontSize: 32,
                              color: 'white'
                            },
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              inset: -5,
                              borderRadius: '50%',
                              border: `2px solid ${button.iconColor}`,
                              animation: button.hoverEffect === 'pulse' ? 'pulse 2s infinite' : 
                                        button.hoverEffect === 'float' ? 'floatIcon 3s infinite ease-in-out' :
                                        button.hoverEffect === 'spin' ? 'spin 6s infinite linear' : 
                                        'ripple 4s infinite linear',
                              opacity: 0.6
                            },
                            '@keyframes pulse': {
                              '0%': { transform: 'scale(1)', opacity: 0.6 },
                              '50%': { transform: 'scale(1.1)', opacity: 0.3 },
                              '100%': { transform: 'scale(1)', opacity: 0.6 }
                            },
                            '@keyframes floatIcon': {
                              '0%, 100%': { transform: 'translateY(0)' },
                              '50%': { transform: 'translateY(-10px)' }
                            },
                            '@keyframes spin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' }
                            },
                            '@keyframes ripple': {
                              '0%': { transform: 'scale(1)', opacity: 0.6 },
                              '100%': { transform: 'scale(1.5)', opacity: 0 }
                            }
                          }}>
                            <button.icon fontSize="large" />
                          </Box>
                          <Typography variant="h6" component="h3" sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}>
                            {button.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            opacity: 0.9,
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          }}>
                            {button.subtitle}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fade>
        </Container>

          {/* Sections with animated entrance */}
          {['Events', 'Gallery', 'Committee'].map((section, index) => (
            <Box 
              key={section} 
              component="section" 
              sx={{ 
                py: isMobile ? 6 : 10,
                background: index % 2 === 0 ? 'rgba(245, 245, 245, 0.5)' : 'transparent'
              }}
            >
              <Container maxWidth="lg">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Suspense fallback={<LoadingFallback text={`Loading ${section}...`} />}>
                    {section === 'Events' && (
                      <>
                        <SectionHeader 
                          title="Upcoming Events" 
                          subtitle="Don't Miss Out" 
                          color="#FF6B6B"
                        />
                        <Events />
                      </>
                    )}
                    {section === 'Gallery' && (
                      <>
                        <SectionHeader 
                          title="Our Gallery" 
                          subtitle="Moments to Remember" 
                          color="#4ECDC4"
                        />
                        <GallerySection />
                      </>
                    )}
                    {section === 'Committee' && (
                      <>
                        <SectionHeader 
                          title="Executive Committee" 
                          subtitle="Meet the Team" 
                          color="#FFB347"
                        />
                        <ExecutiveCommitteeSection />
                      </>
                    )}
                  </Suspense>
                </motion.div>
              </Container>
            </Box>
          ))}
        </Box>
      </AnimatePresence>
      <SignInFooter/>
    </FloatingDotsBackground>
  );
};

export default LandingPage;