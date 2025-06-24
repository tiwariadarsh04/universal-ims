import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Divider, 
  IconButton, 
  Paper,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  LinkedIn, 
  LocationOn, 
  Phone, 
  Email,
  Security,
  Gavel,
  Info,
  Event,
  ArrowForward,
  SportsCricket
} from '@mui/icons-material';
import { color, motion } from 'framer-motion';
import { getCompanyProfile } from '../../services/CompnayProfile';
import LOGO from '../../assets/logo.png';

const SignInFooter = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [companyProfile , setCompanyProfile] = React.useState(null);
  
  // Club theme colors - Matching the magenta to gold gradient
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    accent: "#FF4500",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

    const getCompanyProfileDetails = async () => {
      const res = await getCompanyProfile();
      setCompanyProfile(res[0]);
      localStorage.setItem('companyProfile', JSON.stringify(res[0]));
      // console.log(res);
  }

 useEffect(() => {
  const fetchCompanyProfile = async () => {
    try {
      // Check localStorage first
      const storedProfile = localStorage?.getItem('companyProfile');
      
      if (storedProfile) {
        const parsedProfile = JSON?.parse(storedProfile);
        setCompanyProfile(parsedProfile);
        // console.log("Data fetched from localStorage");
        return; 
      }

      // If no cached data, fetch from API
      // console.log("Data fetched from API");
      await getCompanyProfileDetails();

    } catch (error) {
      console.error("Error fetching company profile:", error);
    }
  };

  fetchCompanyProfile();
}, []); 

  return (
    <Box 
      component="footer" 
      sx={{ 
        background: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : 'rgba(248, 248, 248, 0.95)',
        pt: 4, 
        pb: 2,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(clubColors.primary, 0.05)}, ${alpha(clubColors.secondary, 0.05)})`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(clubColors.secondary, 0.05)}, ${alpha(clubColors.primary, 0.05)})`,
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Club Logo and Brief */}
          <Grid item xs={12} md={4} component={motion.div} initial="hidden" animate="visible" variants={fadeInUp}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Box 
                component="img" 
                src={companyProfile?.logoUrl || LOGO} 
                alt={`${companyProfile?.name || 'logo'}`} 
                sx={{ 
                  height: 60, 
                  mb: 2,
                  filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))'
                }}
              />
              <Typography variant="body2" sx={{ mb: 2, maxWidth: 300, textAlign: { xs: 'center', md: 'left' } }}>
                {companyProfile?.about || ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  aria-label="Facebook" 
                  size="small"
                  sx={{ 
                    background: alpha(clubColors.primary, 0.1),
                    '&:hover': { 
                      background: alpha(clubColors.primary, 0.2),
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Facebook fontSize="small" sx={{ color: clubColors.primary }} />
                </IconButton>
                <IconButton 
                  aria-label="Instagram" 
                  size="small"
                  sx={{ 
                    background: alpha(clubColors.primary, 0.1),
                    '&:hover': { 
                      background: alpha(clubColors.primary, 0.2),
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Instagram fontSize="small" sx={{ color: clubColors.primary }} />
                </IconButton>
                <IconButton 
                  aria-label="Twitter" 
                  size="small"
                  sx={{ 
                    background: alpha(clubColors.primary, 0.1),
                    '&:hover': { 
                      background: alpha(clubColors.primary, 0.2),
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Twitter fontSize="small" sx={{ color: clubColors.primary }} />
                </IconButton>
                <IconButton 
                  aria-label="LinkedIn" 
                  size="small"
                  sx={{ 
                    background: alpha(clubColors.primary, 0.1),
                    '&:hover': { 
                      background: alpha(clubColors.primary, 0.2),
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <LinkedIn fontSize="small" sx={{ color: clubColors.primary }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2} component={motion.div} initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                background: clubColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link className='quick_link' to="/about-us" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Info fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> About Us
              </Link>
              <Link className='quick_link' to="/events" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Event fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> Events
              </Link>
              <Link className='quick_link' to="/activities" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SportsCricket fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> Activities
              </Link>
              <Link className='quick_link' to="/membership" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowForward fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> Membership
              </Link>
            </Box>
          </Grid>
          
          {/* Legal Links */}
          <Grid item xs={6} sm={4} md={2} component={motion.div} initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                background: clubColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link className='quick_link' to="/terms-of-service" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Gavel fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }}/> Terms of Service
              </Link>
              <Link className='quick_link' to="/privacy-policy" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Security fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> Privacy Policy
              </Link>
              <Link className='quick_link' to="/club-rules" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Gavel fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> Club Rules
              </Link>
              <Link className='quick_link' to="/cookie-policy" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Info fontSize="small" sx={{ fontSize: 14, color: clubColors.primary }} /> Cookie Policy
              </Link>
            </Box>
          </Grid>
          
          {/* Contact Information */}
          <Grid item xs={12} sm={4} md={4} component={motion.div} initial="hidden" animate="visible" variants={fadeInUp} custom={3}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600,
                background: clubColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <LocationOn sx={{ color: clubColors.primary }} />
                <Typography variant="body2">
                 {companyProfile?.address || 'Company address'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Phone sx={{ color: clubColors.primary }} />
                <Typography variant="body2">
                  {companyProfile?.contact || 'Contact number'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Email sx={{ color: clubColors.primary }} />
                <Typography variant="body2">
                  {companyProfile?.email || 'Company email'}
                </Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<Email />}
                href={`mailto:${companyProfile?.email || ''}`}
                sx={{ 
                  mt: 1, 
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  borderRadius: 2,
                  borderColor: clubColors.primary,
                  color: clubColors.primary,
                  '&:hover': {
                    borderColor: clubColors.primary,
                    backgroundColor: alpha(clubColors.primary, 0.05)
                    }
                  }}
                >
                Email Support
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.1) }} />
        
        {/* Copyright Section */}
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block" align="center" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
              © {currentYear} {companyProfile?.name}. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
              <Typography variant="caption" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                <Link to="#">FAQ</Link>
              </Typography>
              <Typography variant="caption" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                <Link to="#">Support</Link>
              </Typography>
              <Typography variant="caption" sx={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                <Link to="/accessibility">Accessibility</Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SignInFooter;
