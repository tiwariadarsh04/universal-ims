import React from 'react';
import { 
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  CircularProgress,
  useTheme,
  Button
} from '@mui/material';
import {
  Construction,
  Refresh
} from '@mui/icons-material';
import LOGO from '../../assets/logo.png'

const MaintenancePage = ({handleCheck}) => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 3,
            mx: 'auto',
            bgcolor: theme.palette.warning.light,
            color: theme.palette.warning.contrastText
          }}
        >
          <Construction sx={{ fontSize: 40 }} />
        </Avatar>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Maintenance in Progress
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center',alignItems:'center', mb: 3, gap: 1 }}>
          {/* <Inventory color="primary" sx={{ fontSize: 40, mr: 2 }} /> */}
          <img src={LOGO} alt="logo" width={40}/>
          <Typography variant="h5" color="text.secondary">
            Noamundi Club
          </Typography>
        </Box>

        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          We're currently performing scheduled maintenance to improve your experience. 
          We will be back online shortly.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2">
            Estimated completion: 24 hours
          </Typography>
        </Box>

        <Box sx={{ 
          backgroundColor: theme.palette.grey[100],
          p: 2,
          borderRadius: 1,
          mb: 4
        }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleCheck}
          sx={{ mt: 2 }}
        >
          Check Again
        </Button>
      </Paper>
    </Container>
  );
};

export default MaintenancePage;