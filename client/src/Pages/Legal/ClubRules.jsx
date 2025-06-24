import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  useTheme,
  IconButton,
  alpha
} from '@mui/material';
import {
  LocalBar,
  Pool,
  FitnessCenter,
  SportsTennis,
  Restaurant,
  Movie,
  People,
  Event,
  Security,
  MonetizationOn,
  CheckCircle
} from '@mui/icons-material';

const ClubRules = () => {
  const theme = useTheme();
  
  // Matching your footer's color scheme
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  const facilities = [
    {
      title: "The Whiskey Library",
      icon: <LocalBar />,
      rules: [
        "21+ only (ID verification mandatory)",
        "Smart casual after 7PM",
        "No outside alcohol permitted"
      ]
    },
    {
      title: "Azure Pool Terrace",
      icon: <Pool />,
      rules: [
        "No children after 8PM",
        "Proper swimwear required",
        "No glass containers"
      ]
    },
    {
      title: "Iron Peak Gym",
      icon: <FitnessCenter />,
      rules: [
        "Wipe equipment after use",
        "45-min limit on cardio machines",
        "Carry a towel at all times"
      ]
    },
    {
      title: "Executive Dining",
      icon: <Restaurant />,
      rules: [
        "No outside food",
        "Mobile phones on silent",
        "₹200 fine for >20% wastage"
      ]
    },
    {
      title: "Onyx Screening Room",
      icon: <Movie />,
      rules: [
        "No entry after movie starts",
        "Children under 5 not allowed",
        "No recording films"
      ]
    },
    {
      title: "Sapphire Court",
      icon: <SportsTennis />,
      rules: [
        "Non-marking shoes mandatory",
        "Max 1-hour slots during peak",
        "Priority for members"
      ]
    }
  ];

  return (
    <Box sx={{
      background: theme.palette.mode === 'dark' 
        ? 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' 
        : 'radial-gradient(circle at center, #f9f9f9 0%, #e6e6e6 100%)',
      minHeight: '100vh',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: theme.palette.background.paper,
          border: '1px solid rgba(255, 0, 153, 0.1)',
          boxShadow: '0 8px 32px rgba(255, 0, 153, 0.05)'
        }}>
          {/* Header */}
          <Box sx={{
            background: clubColors.gradient,
            color: '#fff',
            py: 6,
            px: 4,
            textAlign: 'center'
          }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              width: 80,
              height: 80,
              margin: '0 auto 16px'
            }}>
              <Security fontSize="large" />
            </Avatar>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 1,
              letterSpacing: '0.5px'
            }}>
              Club Rules & Etiquette
            </Typography>
            <Typography variant="subtitle1">
              For Officers & Their Families • Monthly Fee: ₹1,300/-
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: clubColors.primary
            }}>
              <People fontSize="large" />
              General Policies
            </Typography>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mb: 6
            }}>
              <Paper sx={{ 
                p: 3,
                borderLeft: `4px solid ${clubColors.primary}`,
                borderRadius: '0 8px 8px 0'
              }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Membership
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>₹1,300/month deducted from salary</li>
                  <li>Max 2 guests per member</li>
                  <li>Senior management priority access</li>
                </Box>
              </Paper>
              
              <Paper sx={{ 
                p: 3,
                borderLeft: `4px solid ${clubColors.secondary}`,
                borderRadius: '0 8px 8px 0'
              }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Conduct
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Smart casual minimum standard</li>
                  <li>Discretion expected at all times</li>
                  <li>Management may deny entry</li>
                </Box>
              </Paper>
            </Box>

            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: clubColors.primary
            }}>
              <Event fontSize="large" />
              Facility-Specific Rules
            </Typography>

            <Grid container spacing={4}>
              {facilities.map((facility, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ 
                    p: 3,
                    height: '100%',
                    borderTop: `3px solid ${clubColors.primary}`,
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 8px 16px ${alpha(clubColors.primary, 0.1)}`
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: alpha(clubColors.primary, 0.1),
                        color: clubColors.primary
                      }}>
                        {facility.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {facility.title}
                      </Typography>
                    </Box>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {facility.rules.map((rule, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{rule}</li>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 6, borderColor: alpha(theme.palette.divider, 0.1) }} />

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: clubColors.gradient,
                  px: 8,
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                Acknowledge Rules
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ClubRules;