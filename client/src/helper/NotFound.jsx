import React from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import NotFoundIllustration from './assets/not-found-illustration.svg'; // Replace with your illustration
 
const NotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();
 
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        textAlign: 'center',
      }}
    >
      {/* Illustration */}
      <Box
        component="img"
        src={'https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg'}
        alt="Not Found"
        sx={{
          width: '100%',
          maxWidth: '200px',
          height: '200px',
          mb: 4,
        }}
      />
 
      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        404 - Page Not Found
      </Typography>
 
      {/* Subtitle */}
      <Typography
        variant="h6"
        component="p"
        sx={{
          color: theme.palette.text.secondary,
          mb: 4,
        }}
      >
        Oops! The page you're looking for doesn't exist or has been moved.
      </Typography>
 
      {/* Back to Home Button */}
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Go Back Home
      </Button>
    </Container>
  );
};
 
export default NotFound;