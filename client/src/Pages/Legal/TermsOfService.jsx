import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import {
  Gavel,
  CheckCircle,
  Security,
  MonetizationOn,
  People,
  Event,
  ExpandMore
} from '@mui/icons-material';

const TermsOfService = () => {
  const theme = useTheme();
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  const sections = [
    {
      title: "Membership Terms",
      icon: <People />,
      content: [
        "Monthly fee of ₹1,300 automatically deducted from salary",
        "Membership non-transferable",
        "Senior management may override access privileges"
      ]
    },
    {
      title: "Facility Usage",
      icon: <Event />,
      content: [
        "All consumption billed monthly",
        "Damage to property will incur charges",
        "Priority access for executive members"
      ]
    },
    {
      title: "Payment Policies",
      icon: <MonetizationOn />,
      content: [
        "All F&B charges deducted from salary",
        "Guest fees: ₹500 per additional guest",
        "No refunds for unused services"
      ]
    },
    {
      title: "Conduct Agreement",
      icon: <Security />,
      content: [
        "Dress code enforced in all areas",
        "Management reserves right to revoke membership",
        "Disputes governed by company policies"
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
              <Gavel fontSize="large" />
            </Avatar>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 1,
              letterSpacing: '0.5px'
            }}>
              Terms of Service
            </Typography>
            <Typography variant="subtitle1">
              Last Updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Welcome to our exclusive club facilities. These terms govern your membership and facility usage.
            </Typography>

            {sections.map((section, index) => (
              <Accordion key={index} sx={{ 
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
                  <Box sx={{ color: clubColors.primary }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {section.content.map((item, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <Divider sx={{ my: 6, borderColor: alpha(theme.palette.divider, 0.1) }} />

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
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                Accept Terms
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;