import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  CheckCircle, 
  Celebration, 
  ArrowForward,
  ThumbUp
} from '@mui/icons-material';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // or your navigation method

const FeedbackSuccessPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container maxWidth="md">
      {/* Confetti celebration */}
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={isMobile ? 200 : 500}
        gravity={0.2}
        style={{ position: 'fixed' }}
      />

      <Box 
        sx={{ 
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8
        }}
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <CheckCircle 
            sx={{ 
              fontSize: 120, 
              color: theme.palette.success.main,
              mb: 4
            }} 
          />
        </motion.div>

        {/* Main content */}
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: theme.palette.mode === 'dark' ? 
              'linear-gradient(145deg, #1e1e1e, #121212)' : 
              'linear-gradient(145deg, #f5f5f5, #ffffff)',
            maxWidth: '600px',
            width: '100%'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              background: theme.palette.mode === 'dark' ?
                'linear-gradient(45deg, #6a5acd, #9370db)' :
                'linear-gradient(45deg, #6a5acd, #9370db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Thank You!
          </Typography>

          <Celebration sx={{ fontSize: 60, color: '#ffd700', mb: 2 }} />

          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Your feedback has been successfully submitted
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            We truly appreciate you taking the time to share your requests , query andfeedback with us. 
            Our team will review your request and get back to you if needed.
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              component={Link}
              to="/" 
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: 4
              }}
            >
              Return to Home
            </Button>
          </motion.div>

          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ThumbUp sx={{ mr: 1, color: theme.palette.success.main }} />
            <Typography variant="body2" color="text.secondary">
              Your opinion helps us improve!
            </Typography>
          </Box>
        </Paper>

        {/* Additional decorative elements */}
        {!isMobile && (
          <>
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                fontSize: '2rem'
              }}
            >
              🎉
            </motion.div>
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
              style={{
                position: 'absolute',
                top: '30%',
                right: '15%',
                fontSize: '2.5rem'
              }}
            >
              ✨
            </motion.div>
          </>
        )}
      </Box>
    </Container>
  );
};

export default FeedbackSuccessPage;