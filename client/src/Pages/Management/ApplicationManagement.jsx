import React, { useState, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Avatar,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LockReset,
  Settings as SettingsIcon,
  AccountCircle,
  Groups,
  Event,
  Store,
  Backup,
  Logout,
  Security,
  DataUsage,
  Inventory,
  Inventory2,
  ViewAgenda,
  OpenInNew,
  FiberManualRecord,
  ImportantDevices,
  Report,
  AutoAwesome,
  NewReleases,
  Business
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SecurityOption from '../Setting/SettingTabs/SecurityOption';
import { ThemeContext } from '../../context/ThemeProvider';

const ApplicationManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(parseInt(localStorage?.getItem('activeTab')) || 0);
  const [userProfile, setUserProfile] = useState({});
  const { isDarkMode } = useContext(ThemeContext);

  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'));
    setUserProfile(user);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    localStorage.setItem('activeTab',newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 18 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, visibility:'hidden' }}>
        <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">
          Settings Dashboard
        </Typography>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3,overflowX:'scroll' }}>
        <Tab label="Profile" icon={<AccountCircle />} />
        <Tab label="Management" icon={<Groups />} />
        <Tab label="Inventory" icon={<Inventory />} />
        <Tab label="Security" icon={<Security />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    fontSize: 32,
                    mr: 3
                  }}>
                    {userProfile?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{userProfile?.username}</Typography>
                    <Chip 
                      label={userProfile?.roles} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="UserID" 
                      value={`${userProfile?.id}`} 
                      InputProps={{ readOnly: true }} 
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Account status" 
                      value="Active" 
                      InputProps={{ readOnly: true }} 
                      variant="filled"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<LockReset />}
                  onClick={() => navigate('/auth/forget-password',{state:{...userProfile}})}
                >
                  Reset Password
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* system health dashboard */}
          <Grid item xs={12} md={6}>
          <Card 
            elevation={6} 
            sx={{ 
              borderRadius: 4, 
              height: '100%',
              background: isDarkMode ? 
                'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 
                'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: isDarkMode ? 
                  '0 10px 20px rgba(0,0,0,0.3)' : 
                  '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
        <CardContent sx={{ position: 'relative' }}>
          {/* Animated background element */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: isDarkMode ? 
              'radial-gradient(circle, rgba(100,149,237,0.2) 0%, rgba(0,0,0,0) 70%)' :
              'radial-gradient(circle, rgba(100,149,237,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: isDarkMode ? '#e0e0e0' : '#2c3e50',
                fontWeight: 600
              }}
            >
              <DataUsage sx={{ 
                mr: 1.5, 
                color: isDarkMode ? '#90caf9' : '#4a6baf',
                fontSize: 28 
              }} /> 
              System Health Dashboard
            </Typography>
            
            <Divider sx={{ 
              mb: 3, 
              background: isDarkMode ?
                'linear-gradient(to right, transparent, #555555, transparent)' :
                'linear-gradient(to right, transparent, #a1a1a1, transparent)',
              height: 1
            }} />
            
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDarkMode ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              p: 2,
              mb: 2,
              animation: 'heartbeat 1.5s ease-in-out',
              '@keyframes heartbeat': {
                '0%': { transform: 'scale(1)' },
                '25%': { transform: 'scale(1.02)' },
                '50%': { transform: 'scale(1)' },
                '75%': { transform: 'scale(1.02)' },
                '100%': { transform: 'scale(1)' }
              }
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: isDarkMode ? '#e0e0e0' : '#3a5169' }}>
                  NOA Backend Service
                </Typography>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#aaaaaa' : '#7f8c8d', mt: 0.5 }}>
                  Real-time status monitoring
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                href={import.meta.env.VITE_APP_POSTER_URL}
                target="_blank"
                rel="noopener"
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
                startIcon={<OpenInNew sx={{ fontSize: 18 }} />}
              >
                Live Check
              </Button>
            </Box>
            
            {/* Enhanced Status indicator with blinking animation */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDarkMode ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              p: 2,
              mb: 2,
              animation: 'heartbeat 1.5s ease-in-out infinite',
              '@keyframes heartbeat': {
                '0%': { transform: 'scale(1)' },
                '25%': { transform: 'scale(1.02)' },
                '50%': { transform: 'scale(1)' },
                '75%': { transform: 'scale(1.02)' },
                '100%': { transform: 'scale(1)' }
              }
            }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#4ade80' : '#27ae60' }}>
                All systems operational
              </Typography>
            </Box>
          </Box>
        </CardContent>
          </Card>
        </Grid>
        </Grid>
        )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'success.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/member-managemnet')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Groups sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Member Management</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Manage your club members, view member details, and track membership status.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'warning.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/agenda-management')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ViewAgenda sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Agenda Management</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Manage your club agenda and booking.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'warning.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/event-management')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Event sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Event Management</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Create, manage, and track all club events and activities.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'error.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/application-user')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountCircle sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">User Management</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Manage application users, roles, and permissions.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Store sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">Party/Vendor Invoice</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => navigate('/party-management')}
                  sx={{ mb: 2 }}
                >
                 Manage Party Invoice
                </Button>
              </CardContent>
            </Card>
          </Grid>

           {/* company Profile Card */}

        <Grid item xs={12} md={6} lg={4}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">Company Profile</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Button 
                  variant="contained" 
                  color="info" 
                  onClick={() => navigate('/company-profile')}
                  sx={{ mb: 2 }}
                >
                 Manage profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'success.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/member-managemnet/create')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Groups sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Member Creation</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Create Member Profile in Bulk by uploading excel sheet
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'warning.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/Inventory/create')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Inventory2 sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Item Creation</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Create Inventory Items by uploading Excel sheet
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'error.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/report/advance-analytics')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AutoAwesome sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                     Advance Analytics
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Learn about your transaction with advance analytics
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'info.main'
              }}
            >
              <CardActionArea onClick={() => navigate('/whats-new')}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NewReleases sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                     Whats New
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Check out the latest updates and features
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && 
      <SecurityOption/>}

      {/* Logout Card - Fixed at bottom */}
      <Box sx={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1000 }}>
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <Box 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/auth/sign-in',{replace:true})
            }}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Logout sx={{ color: 'error.main', mr: 1 }} />
              <Typography color="error.main" fontWeight="bold">
                Logout
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default ApplicationManagement
