import React from 'react';
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
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import {
  Lock,
  DataUsage,
  People,
  MonetizationOn,
  Security,
  CheckCircle,
  Restaurant,
  LocalBar,
  Event,
  FitnessCenter,
  Pool,
  ExpandMore,
  Fingerprint
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const theme = useTheme();
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Data practices with service-specific icons
  const dataPractices = [
    {
      title: "Dining Preferences",
      icon: <Restaurant />,
      description: "Meal choices, dietary restrictions, and consumption patterns",
      service: "Kitchen Services",
      dataPoints: ["Meal type", "Time slots", "Special requests"]
    },
    {
      title: "Beverage Consumption",
      icon: <LocalBar />,
      description: "Bar selections and spending habits",
      service: "Bar Services",
      dataPoints: ["Alcohol preferences", "Spending limits", "Guest orders"]
    },
    {
      title: "Facility Access",
      icon: <Fingerprint />,
      description: "Entry/exit times and facility usage",
      service: "All Areas",
      dataPoints: ["Sign-in times", "Areas visited", "Duration"]
    },
    {
      title: "Event Participation",
      icon: <Event />,
      description: "RSVPs and attendance records",
      service: "Club Events",
      dataPoints: ["Events attended", "Guest count", "Preferences"]
    }
  ];

  const securityFeatures = [
    {
      title: "Salary Deduction Security",
      icon: <MonetizationOn />,
      items: [
        "Encrypted payment processing",
        "Monthly billing statements",
        "Dispute resolution protocol"
      ]
    },
    {
      title: "Data Protection",
      icon: <Security />,
      items: [
        "End-to-end encryption",
        "Regular security audits",
        "Limited staff access"
      ]
    }
  ];

  return (
    <Box sx={{
      background: theme.palette.mode === 'dark' 
        ? 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' 
        : 'radial-gradient(circle at center, #f9f9f9 0%, #e6e6e6 100%)',
      minHeight: '100vh',
      py: 8,
      position: 'relative',
      overflow: 'hidden'
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
            {/* Header with animated badge */}
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
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                  }}>
                    !
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
                  <Lock fontSize="large" />
                </Avatar>
              </Badge>
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                mb: 1,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                Privacy Shield
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                How we protect your club experience
              </Typography>
            </Box>

            {/* Interactive Data Practices Section */}
            <Box sx={{ p: { xs: 3, md: 6 } }}>
              <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: clubColors.primary
                }}>
                  <DataUsage fontSize="large" />
                  Service-Specific Data Collection
                </Typography>

                <Grid container spacing={4} sx={{ mb: 6 }}>
                  {dataPractices.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <motion.div whileHover={{ y: -5 }}>
                        <Paper sx={{ 
                          p: 3,
                          height: '100%',
                          borderLeft: `3px solid ${clubColors.primary}`,
                          borderRadius: '0 8px 8px 0',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: `0 8px 24px ${alpha(clubColors.primary, 0.1)}`
                          }
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2, 
                            mb: 2 
                          }}>
                            <Avatar sx={{ 
                              bgcolor: alpha(clubColors.primary, 0.1),
                              color: clubColors.primary
                            }}>
                              {item.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {item.title}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: theme.palette.text.secondary,
                                fontStyle: 'italic'
                              }}>
                                {item.service}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {item.description}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1,
                            mt: 2
                          }}>
                            {item.dataPoints.map((point, i) => (
                              <Chip
                                key={i}
                                label={point}
                                size="small"
                                sx={{
                                  background: alpha(clubColors.primary, 0.1),
                                  color: theme.palette.text.primary,
                                  borderRadius: '6px'
                                }}
                              />
                            ))}
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* Security Accordions */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: clubColors.primary
                }}>
                  <Security fontSize="large" />
                  Your Data Protection
                </Typography>

                {securityFeatures.map((feature, index) => (
                  <Accordion 
                    key={index} 
                    sx={{ 
                      mb: 2,
                      borderRadius: '8px !important',
                      borderLeft: `3px solid ${clubColors.primary}`,
                      overflow: 'hidden'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: clubColors.primary }} />}
                      sx={{
                        background: alpha(clubColors.primary, 0.03),
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                          gap: 2
                        }
                      }}
                    >
                      <Box sx={{ color: clubColors.primary }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ background: alpha(clubColors.primary, 0.02) }}>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {feature.items.map((item, i) => (
                          <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </motion.div>

              {/* Salary Deduction Transparency */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <Paper sx={{ 
                  p: 3,
                  mt: 6,
                  mb: 4,
                  background: alpha(clubColors.secondary, 0.05),
                  borderLeft: `3px solid ${clubColors.secondary}`,
                  borderRadius: '0 8px 8px 0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MonetizationOn sx={{ 
                      fontSize: 48,
                      color: clubColors.secondary 
                    }} />
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: clubColors.secondary,
                        mb: 1
                      }}>
                        Salary Deduction Transparency
                      </Typography>
                      <Typography variant="body2">
                        All club expenses are itemized and deducted directly from your monthly salary. 
                        You will receive detailed statements showing:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        <li>Date and time of each transaction</li>
                        <li>Service category (Dining, Bar, Events)</li>
                        <li>Amount deducted with running total</li>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>

              <Divider sx={{ 
                my: 6, 
                borderColor: alpha(theme.palette.divider, 0.1),
                borderWidth: '1px'
              }} />

              {/* CTA with animation */}
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircle />}
                    sx={{
                      background: clubColors.gradient,
                      px: 8,
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      '&:hover': {
                        opacity: 0.9,
                        boxShadow: `0 4px 20px ${alpha(clubColors.primary, 0.3)}`
                      }
                    }}
                  >
                    Acknowledge Privacy Policy
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;