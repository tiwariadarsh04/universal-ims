import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DevOption from './SettingTabs/DevOption';
import { DialogProvider } from '../../context/DialogProvider';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({});

  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    setUserProfile(user);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mb: 18 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, visibility:'hidden' }}>
        <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">
          Settings Dashboard
        </Typography>
      </Box>
      <DialogProvider>
        <DevOption
          darkMode={false}
          userID={userProfile?.id}
        />
      </DialogProvider>

      {/* Logout Card - Fixed at bottom */}
      <Box sx={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000 }}>
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardActionArea onClick={() => {
            localStorage.removeItem('user');
            navigate('/auth/sign-in',{replace:true})
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Logout sx={{ color: 'error.main', mr: 1 }} />
              <Typography color="error.main" fontWeight="bold">
                Logout
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Container>
  );
};

export default SettingsPage;