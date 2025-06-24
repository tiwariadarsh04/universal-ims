import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  styled, 
  keyframes, 
  Container
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  DesktopWindows as DesktopIcon,
  Receipt as InvoiceIcon 
} from '@mui/icons-material';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AnimatedInvoice = styled(InvoiceIcon)(({ theme }) => ({
  fontSize: '5rem',
  color: theme.palette.primary.main,
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  marginBottom: theme.spacing(2),
  filter: `drop-shadow(0 5px 3px ${theme.palette.primary.light})`
}));

const AnimatedDesktop = styled(DesktopIcon)(({ theme }) => ({
  fontSize: '4rem',
  color: theme.palette.secondary.main,
  marginRight: theme.spacing(2),
  animation: `${pulseAnimation} 2s ease-in-out infinite`
}));

const DesktopMessage = () => {
  const navigate = useNavigate();

  return (
    <Container id="mobile-invoice-container" maxWidth='lg'>
    <Box sx={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      p: 4,
      background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(245,245,255,1) 100%)'
    }}>
      <AnimatedInvoice />
      
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        p: 3,
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: 3
      }}>
        <AnimatedDesktop />
        <Typography variant="h4" component="div" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2, #4dabf5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Desktop Experience Required
        </Typography>
      </Box>
      
      <Typography variant="h6" sx={{ 
        mb: 4,
        maxWidth: '600px',
        lineHeight: 1.6,
        color: 'text.secondary'
      }}>
        For the best PDF generation experience, please switch to a desktop device.
        Our invoice generator uses advanced layout features that work best on larger screens.
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 50,
          fontSize: '1.1rem',
          boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 14px rgba(25, 118, 210, 0.4)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        Return to Safety
      </Button>
      
      <Typography variant="caption" sx={{ 
        mt: 4,
        display: 'block',
        color: 'text.disabled',
        fontStyle: 'italic'
      }}>
        Tip: Try rotating your tablet to landscape mode if you're on a larger mobile device
      </Typography>
    </Box>
    </Container>
  );
};

export default DesktopMessage;