import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  TextField,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Star,
  Diamond,
  SportsTennis,
  Pool,
  Restaurant,
  Spa,
  Event,
  Group,
  Payment,
  ExpandMore,
  CheckCircle,
  Close,
  ArrowForward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SignInFooter from '../LandingPage/SignIn-Footer';

const MembershipPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [companyLogo, setCompanyLogo] = React.useState('');
  
  
    React.useEffect(() => {
      const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
      if (localLogo) {
        setCompanyLogo(localLogo);
      } 
    },[])

  // Membership tiers data
  const membershipPlans = [
    {
      id: 1,
      name: "Diamond",
      price: "₹1,250",
      duration: "/month",
      bestValue: true,
      features: [
        "All Club benefits",
        "Unlimited tennis court access",
        "10% dining discount",
        "Priority event booking",
        "Family/friends Access"
      ],
      icon: <Diamond color="primary" sx={{ fontSize: 40 }} />
    },
  ];

  const benefits = [
    {
      icon: <SportsTennis sx={{ fontSize: 40 }} />,
      title: "Sports Facilities",
      description: "Unlimited access to tennis courts, swimming pool, and gym"
    },
    {
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      title: "Dining Privileges",
      description: "Exclusive discounts at all club restaurants and bars"
    },
    {
      icon: <Event sx={{ fontSize: 40 }} />,
      title: "Event Priority",
      description: "Early booking for concerts, galas, and special events"
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: "Guest Passes",
      description: "Bring friends and family with monthly guest allowances"
    },
    {
      icon: <Payment sx={{ fontSize: 40 }} />,
      title: "Flexible Payment",
      description: "Monthly or annual payment options available"
    }
  ];

  const steps = ['Select Plan', 'Personal Details', 'Confirmation'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <>
    <Box sx={{ 
      background: theme.palette.background.default,
      minHeight: '100vh',
      pt: isMobile ? 4 : 8,
      pb: 8
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          position: 'relative'
        }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px'
            }}
          >
            Become a Member
          </Typography>
          <Typography 
            variant="h6" 
            component="p"
            sx={{ 
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 300,
              lineHeight: 1.6
            }}
          >
            Join {companyLogo?.name} to unlock exclusive amenities, premium services, and a vibrant social community.
          </Typography>
        </Box>

        {/* Membership Process Stepper */}
        {activeStep > 0 && (
          <Box sx={{ mb: 6 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Step 1: Plan Selection */}
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" component="h2" sx={{ 
                mb: 6, 
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Choose Your Membership Tier
              </Typography>
              
              <Grid container spacing={4} sx={{display:'flex', justifyContent:'center'}}>
                {membershipPlans.map((plan) => (
                  <Grid item xs={12} md={4} key={plan.id}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        border: selectedPlan === plan.id ? '2px solid #FF0099' : '2px solid transparent',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}>
                        {plan.bestValue && (
                          <Chip 
                            label="BEST VALUE"
                            sx={{ 
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              backgroundColor: '#FF0099',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                        
                        <CardContent sx={{ 
                          p: 4,
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <Box sx={{ 
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            color: 'white'
                          }}>
                            {plan.icon}
                          </Box>
                          
                          <Typography variant="h4" component="h3" sx={{ 
                            fontWeight: 'bold',
                            mb: 1
                          }}>
                            {plan.name}
                          </Typography>
                          
                          <Typography variant="h3" component="div" sx={{ 
                            fontWeight: 'bold',
                            mb: 1,
                            color: 'primary.main'
                          }}>
                            {plan.price}
                            <Typography component="span" variant="h6" color="text.secondary">
                              {plan.duration}
                            </Typography>
                          </Typography>
                          
                          <Divider sx={{ my: 3, width: '100%' }} />
                          
                          <Box sx={{ 
                            textAlign: 'left',
                            width: '100%',
                            mb: 4
                          }}>
                            {plan.features.map((feature, index) => (
                              <Box key={index} sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                mb: 2
                              }}>
                                <CheckCircle color="primary" sx={{ mr: 2 }} />
                                <Typography>{feature}</Typography>
                              </Box>
                            ))}
                          </Box>
                          
                          <Button 
                            variant={selectedPlan === plan.id ? "contained" : "outlined"}
                            fullWidth
                            onClick={() => setSelectedPlan(plan.id)}
                            sx={{
                              borderRadius: '50px',
                              py: 1.5,
                              fontWeight: 'bold',
                              borderWidth: selectedPlan === plan.id ? 0 : '2px',
                              background: selectedPlan === plan.id ? 
                                'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)' : 'transparent'
                            }}
                          >
                            {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mt: 6
              }}>
                <Button 
                  variant="contained"
                  disabled={!selectedPlan}
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: '50px',
                    px: 6,
                    py: 1.5,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
                  }}
                >
                  Continue
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: Personal Details */}
        {activeStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" sx={{ 
              mb: 6, 
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Your Information
            </Typography>
            
            <Paper sx={{ 
              p: 6,
              borderRadius: 3,
              maxWidth: '800px',
              mx: 'auto'
            }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Personal Number"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact No."
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="I agree to the terms and conditions"
                    sx={{ mb: 3 }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 4
              }}>
                <Button 
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderWidth: '2px'
                  }}
                >
                  Back
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: '50px',
                    px: 6,
                    py: 1.5,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
                  }}
                >
                  Continue to Payment
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}


        {/* Step 4: Confirmation */}
        {activeStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ 
              textAlign: 'center',
              p: 6,
              borderRadius: 3,
              maxWidth: '800px',
              mx: 'auto',
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
            }}>
              <CheckCircle sx={{ 
                fontSize: 80, 
                color: '#4CAF50',
                mb: 3
              }} />
              
              <Typography variant="h3" component="h2" sx={{ 
                mb: 2,
                fontWeight: 'bold'
              }}>
                Welcome to {companyLogo?.name}
              </Typography>
              
              <Typography variant="h6" component="p" sx={{ 
                mb: 4,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto'
              }}>
                Your {membershipPlans.find(p => p.id === selectedPlan)?.name} membership has been confirmed. 
                A welcome email with all details has been sent to your inbox.
              </Typography>
              
              <Button 
                variant="contained"
                onClick={() => setActiveStep(0)}
                sx={{
                  borderRadius: '50px',
                  px: 6,
                  py: 1.5,
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
                }}
              >
                Back to Home
              </Button>
            </Box>
          </motion.div>
        )}

        {/* Membership Benefits (shown when not in form flow) */}
        {activeStep === 0 && (
          <Box sx={{ mt: 12 }}>
            <Typography variant="h4" component="h2" sx={{ 
              mb: 6, 
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Membership Benefits
            </Typography>
            
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      p: 4,
                      textAlign: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                      <Box sx={{ 
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: 'white'
                      }}>
                        {benefit.icon}
                      </Box>
                      
                      <Typography variant="h5" component="h3" sx={{ 
                        fontWeight: 'bold',
                        mb: 2
                      }}>
                        {benefit.title}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* FAQ Section */}
        <Box sx={{ mt: 12 }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">What's included in each membership tier?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Our Silver tier offers basic facility access, Gold adds premium amenities and discounts, 
                  while Platinum includes VIP services and personal concierge. See the plans above for details.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">Can I upgrade my membership later?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Yes! You can upgrade anytime by paying the difference between your current plan 
                  and the new one. Prorated adjustments will be made for annual memberships.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">Is there a family discount?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We offer 15% off additional memberships for immediate family members living at 
                  the same address. Contact our membership team for details.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">What's the cancellation policy?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Monthly memberships can be cancelled with 30 days notice. Annual memberships 
                  receive a prorated refund if cancelled within the first 3 months.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Container>
    </Box>
    <SignInFooter/>
    </>
  );
};

export default MembershipPage;