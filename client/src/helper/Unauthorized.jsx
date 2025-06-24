// UnauthorizedPage.js
import React, { useContext } from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserProfileContext } from '../context/userProvider';

const UnauthorizedPage = () => {
  const {userProfile} = useContext(UserProfileContext);

  console.log(userProfile)
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleGoHome = () => {
    if(userProfile) return navigate('/welcome');
    return navigate('/')

  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        {/* Lock Icon */}
        <Box
          sx={{
            fontSize: '6rem',
            color: 'error.main',
            mb: 2,
          }}
        >
          🔒
        </Box>

        {/* Title */}
        <Typography variant="h4" component="h1" gutterBottom>
          Unauthorized Access
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" gutterBottom>
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </Typography>

        {/* Buttons */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            Go Back
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoHome}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;