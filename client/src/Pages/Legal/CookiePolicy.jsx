import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  Button,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Switch,
  FormControlLabel,
  Badge,
  IconButton
} from '@mui/material';
import {
  Cookie,
  Security,
  Settings,
  CheckCircle,
  Info,
  ArrowForward,
  ExpandMore,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CookiePolicy = () => {
  const theme = useTheme();
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  // State for cookie preferences
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: false,
    personalization: false,
    marketing: false
  });
  const [showBanner, setShowBanner] = useState(true);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cookieTypes = [
    {
      name: "Essential Cookies",
      icon: <Security />,
      description: "Required for core functionality like authentication and security",
      mandatory: true
    },
    {
      name: "Analytics Cookies",
      icon: <Settings />,
      description: "Help us understand how members use our club services",
      mandatory: false
    },
    {
      name: "Personalization Cookies",
      icon: <Cookie />,
      description: "Remember your preferences for dining, events, etc.",
      mandatory: false
    },
    {
      name: "Marketing Cookies",
      icon: <Info />,
      description: "Used for promotional communications (opt-in only)",
      mandatory: false
    }
  ];

  const handleToggle = (cookieType) => (event) => {
    if (cookieType === 'essential') return; // Can't disable essentials
    setCookieSettings({
      ...cookieSettings,
      [cookieType]: event.target.checked
    });
  };

  return (
    <Box sx={{
      background: theme.palette.mode === 'dark' 
        ? 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' 
        : 'radial-gradient(circle at center, #f9f9f9 0%, #e6e6e6 100%)',
      minHeight: '100vh',
      py: 8,
      position: 'relative'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(clubColors.primary, 0.05)} 0%, transparent 70%)`,
        filter: 'blur(30px)',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(clubColors.secondary, 0.05)} 0%, transparent 70%)`,
        filter: 'blur(30px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={4} sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: theme.palette.background.paper,
            border: '1px solid rgba(255, 0, 153, 0.1)',
            boxShadow: '0 8px 32px rgba(255, 0, 153, 0.05)'
          }}>
            {/* Header with cookie icon */}
            <Box sx={{
              background: clubColors.gradient,
              color: '#fff',
              py: 6,
              px: 4,
              textAlign: 'center',
              position: 'relative'
            }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                  <Box sx={{
                    background: '#fff',
                    color: clubColors.primary,
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: '0 0 8px rgba(0,0,0,0.2)'
                  }}>
                    {Object.values(cookieSettings).filter(Boolean).length}
                  </Box>
                }
              >
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  <Cookie fontSize="large" />
                </Avatar>
              </Badge>
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                mb: 1,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                Cookie Policy
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                How we use cookies to enhance your club experience
              </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: { xs: 3, md: 6 } }}>
              {/* Introduction */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Our club uses cookies to personalize your experience with dining bookings, 
                  event preferences, and facility access. This policy explains how we use 
                  these technologies and how you can control them.
                </Typography>
              </motion.div>

              {/* Cookie Types Grid */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: clubColors.primary
                }}>
                  <Settings fontSize="large" />
                  Types of Cookies We Use
                </Typography>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                  {cookieTypes.map((cookie, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <motion.div whileHover={{ y: -5 }}>
                        <Paper sx={{ 
                          p: 3,
                          height: '100%',
                          borderLeft: `3px solid ${cookie.mandatory ? clubColors.primary : clubColors.secondary}`,
                          borderRadius: '0 8px 8px 0',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {cookie.mandatory && (
                            <Chip
                              label="Always Active"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                background: alpha(clubColors.primary, 0.1),
                                color: clubColors.primary,
                                fontWeight: 600
                              }}
                            />
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(cookie.mandatory ? clubColors.primary : clubColors.secondary, 0.1),
                              color: cookie.mandatory ? clubColors.primary : clubColors.secondary
                            }}>
                              {cookie.icon}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {cookie.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 3 }}>
                            {cookie.description}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={cookieSettings[cookie.name.toLowerCase().split(' ')[0]]}
                                onChange={handleToggle(cookie.name.toLowerCase().split(' ')[0])}
                                color="primary"
                                disabled={cookie.mandatory}
                              />
                            }
                            label={cookie.mandatory ? "Required" : cookieSettings[cookie.name.toLowerCase().split(' ')[0]] ? "Enabled" : "Disabled"}
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                color: cookie.mandatory 
                                  ? clubColors.primary 
                                  : cookieSettings[cookie.name.toLowerCase().split(' ')[0]] 
                                    ? theme.palette.success.main 
                                    : theme.palette.text.secondary,
                                fontWeight: 500
                              }
                            }}
                          />
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* Detailed Accordions */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <Accordion sx={{ 
                  mb: 2,
                  borderRadius: '8px !important',
                  borderLeft: `3px solid ${clubColors.primary}`
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: clubColors.primary }} />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  >
                    <Info sx={{ color: clubColors.primary }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Why We Use Cookies
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      Cookies help us remember your preferences for:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                      <li>Meal booking defaults (vegetarian/vegan preferences)</li>
                      <li>Favorite drink orders at the bar</li>
                      <li>Event attendance history for personalized recommendations</li>
                      <li>Facility access patterns for maintenance planning</li>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ 
                  mb: 2,
                  borderRadius: '8px !important',
                  borderLeft: `3px solid ${clubColors.primary}`
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: clubColors.primary }} />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2
                      }
                    }}
                  >
                    <Security sx={{ color: clubColors.primary }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Cookie Security
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      All cookies are:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                      <li>Encrypted to protect your data</li>
                      <li>Set with strict expiration policies</li>
                      <li>Limited to club domain only</li>
                      <li>Never used for third-party tracking</li>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </motion.div>

              <Divider sx={{ 
                my: 6, 
                borderColor: alpha(theme.palette.divider, 0.1),
                borderWidth: '1px'
              }} />

              {/* CTA */}
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  gap: 3
                }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircle />}
                    sx={{
                      background: clubColors.gradient,
                      px: 6,
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      '&:hover': {
                        opacity: 0.9,
                        boxShadow: `0 4px 20px ${alpha(clubColors.primary, 0.3)}`
                      }
                    }}
                  >
                    Save Preferences
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      borderColor: clubColors.primary,
                      color: clubColors.primary,
                      px: 6,
                      borderRadius: '8px',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: clubColors.primary,
                        background: alpha(clubColors.primary, 0.05)
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>

        {/* Cookie Consent Banner */}
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Paper sx={{
              position: 'fixed',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '90%',
              width: '600px',
              p: 3,
              borderRadius: '12px',
              background: theme.palette.background.paper,
              border: `1px solid ${alpha(clubColors.primary, 0.2)}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: alpha(clubColors.primary, 0.1),
                    color: clubColors.primary,
                    width: 40,
                    height: 40
                  }}>
                    <Cookie fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      We Value Your Privacy
                    </Typography>
                    <Typography variant="body2">
                      We use cookies to enhance your club experience. By continuing, you agree to our updated Cookie Policy.
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setShowBanner(false)}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                gap: 2,
                mt: 2
              }}>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500
                  }}
                >
                  Customize
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    background: clubColors.gradient,
                    borderRadius: '6px',
                    fontWeight: 600,
                    px: 3
                  }}
                  onClick={() => setShowBanner(false)}
                >
                  Accept All
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default CookiePolicy;