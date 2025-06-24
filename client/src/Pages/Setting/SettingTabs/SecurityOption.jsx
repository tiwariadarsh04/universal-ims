import React, { useContext, useEffect, useState } from 'react'
import { 
Avatar,
Box, 
Button, 
Card, 
CardActionArea, 
CardContent, 
Grid, 
IconButton, 
LinearProgress, 
List, 
ListItem, 
ListItemAvatar, 
ListItemIcon, 
ListItemSecondaryAction, 
ListItemText, 
Typography,
Switch,
FormControlLabel,
Divider,
Alert,
useTheme,
alpha
} from '@mui/material'
import {
Insights,
Login,
Receipt,
Devices,
DesktopWindows,
MoreVert,
PhoneIphone,
SettingsSuggest,
Security,
Fingerprint,
Lock,
Shield,
CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeProvider';
import BiometricRegistrationModal from '../../../components/Security/BiometricRegistrationModal';
import { getLatestActivityLog } from '../../../services/Activity';
import { formatDistanceToNow } from 'date-fns';
import { getLoginHistoryByUserId } from '../../../services/loginHistory';

const SecurityOption = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useContext(ThemeContext);
    const [showModal, setShowModal] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loginActivity, setLoginActivity] = useState([]);
    const [lastLogin, setLastLogin] = useState(null);

    const [flag, setFlag] = useState(false);

    const handleDownloadCodeInZip = () => {
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_APP_CODEBASE_DOWNLOAD}`;
      link.download = 'code-archive.zip'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link.onerror = () => {
        console.error('Download failed');
      };
    };

    const handleTwoFactorToggle = () => {
      if (!twoFactorEnabled) {
        setShowModal(true);
      } else {
        // Handle disabling 2FA
        setTwoFactorEnabled(false);
      }
    };

    const handleRegistrationSuccess = () => {
      setTwoFactorEnabled(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    };

    const getSingleLatestActivity = async () =>{
        const res = await getLatestActivityLog()
        setActivityLogs(res?.data || []);
      }

    const getLoginHistory = async () =>{
      const res = await getLoginHistoryByUserId();
      setLoginActivity(res?.data || []);

      if (res?.data?.length > 0) { 
        const lastLoginActivity = res.data[0];
        setLastLogin(lastLoginActivity?.createdAt);
      }
      else {
        setLastLogin(null);
      }
    }

    useEffect(()=>{
      getSingleLatestActivity();
      getLoginHistory();
    },[flag])

    useEffect(() => {
      setFlag(!flag);

      console.log(loginActivity)
    }, []);

  return (
      <Box>
        <Grid container spacing={3}>
          {/* Security Overview Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: 'warning.main',
              background: isDarkMode ? 
                'linear-gradient(to right, #1a1a2e, #16213e)' : 
                'linear-gradient(to right, #f8f9fa, #ffffff)',
              color: isDarkMode ? 'white' : 'inherit'
            }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider',
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>Last Login</Typography>
                      <Typography variant="body1">
                        {formatDistanceToNow(new Date(lastLogin), { addSuffix: true })}
                      </Typography>
                      <Typography variant="caption" color={isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary'}>
                        {`${loginActivity[0]?.location?.city}, ${loginActivity[0]?.location?.country}` || 'Location not available'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                    }}>
                      <Typography variant="subtitle2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
                        Active Sessions
                      </Typography>
                      <Typography variant="body1">{loginActivity?.length} devices</Typography>
                      <Button size="small" sx={{ 
                        mt: 1,
                        color: isDarkMode ? 'primary.light' : undefined
                      }}>View all</Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider',
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>Security Level</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ height: 8, borderRadius: 4, my: 1 }} 
                        color="warning" 
                      />
                      <Typography variant="caption">Medium - Enable 2FA for better protection</Typography>
                    </Box>
                    
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                    }}>
                      <Typography variant="subtitle2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
                        Data Security
                      </Typography>
                      <Typography variant="body1">1 new alert</Typography>
                      <Button size="small" 
                      onClick={() => navigate('/backup-management')}
                      sx={{ 
                        mt: 1,
                        color: isDarkMode ? 'primary.light' : undefined
                      }}>Review</Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
      
          {/* Activity Log Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: 'success.main',
              bgcolor: isDarkMode ? 'rgba(30,30,30,0.8)' : 'white',
              color: isDarkMode ? 'white' : 'inherit'
            }}>
              <Box 
                onClick={() => navigate('/transactions/log-activity')}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Insights sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">Activity Log</Typography>
                  </Box>
                  <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                    Comprehensive view of all account activities including logins, transactions, and changes
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'action.hover',
                    mb: 2
                  }}>
                    <Typography variant="subtitle2">Recent Activity</Typography>
                    <List dense>
                      {activityLogs?.length > 0 ? (
                        activityLogs.map((log, index) => (
                          <ListItem sx={{ px: 0 }} key={index}>
                        <ListItemIcon>
                          <Receipt fontSize="small" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${log.performedBy?.name} performed ${log?.action} action`} 
                          secondary={`${log?.invoiceNumber} • ${formatDistanceToNow(new Date(log?.createdAt), { addSuffix: true })}`}
                          primaryTypographyProps={{
                            color: isDarkMode ? 'white' : undefined
                          }}
                          secondaryTypographyProps={{
                            color: isDarkMode ? 'rgba(255,255,255,0.6)' : undefined
                          }}
                        />
                      </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="No recent activity found" 
                            primaryTypographyProps={{
                              color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'
                            }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{
                      color: isDarkMode ? 'primary.light' : undefined,
                      borderColor: isDarkMode ? 'primary.light' : undefined,
                      '&:hover': {
                        borderColor: isDarkMode ? 'primary.main' : undefined,
                        backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.08)' : undefined
                      }
                    }}
                  >
                    View Full Activity Log
                  </Button>
                </CardContent>
              </Box>
            </Card>
          </Grid>
      
          {/* Device Management Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: 'info.main',
              bgcolor: isDarkMode ? 'rgba(30,30,30,0.8)' : 'white',
              color: isDarkMode ? 'white' : 'inherit'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Devices sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">Device Management</Typography>
                </Box>
                
                <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'} sx={{ mb: 2 }}>
                  Devices that have accessed your account
                </Typography>
                
                <List>
                  {
                    loginActivity?.length > 0 ? (
                      loginActivity.slice(0,2).map((device, index) => (
                        <ListItem key={index} sx={{ 
                          p: 2, 
                          mt:2,
                          borderRadius: 2, 
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                          border: '1px solid',
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                        }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.light' }}>
                        <PhoneIphone />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${device?.deviceInfo?.os} • ${device?.deviceInfo?.browser}`}
                      secondary={
                        <>
                          <span>IP: {device?.ipAddress} • {device?.location?.city || "Not found"}</span><br />
                          <span>Last active: {formatDistanceToNow(new Date(device?.updatedAt), { addSuffix: true })}</span>
                        </>
                      }
                      primaryTypographyProps={{
                        color: isDarkMode ? 'white' : undefined
                      }}
                      secondaryTypographyProps={{
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : undefined
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined }}>
                        <MoreVert />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                      ))
                    ) : (
                      <ListItem sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                      }}>
                        <ListItemText 
                          primary="No devices found" 
                          primaryTypographyProps={{
                            color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'
                          }}
                        />
                      </ListItem>
                    )
                  }
                  
                </List>
                
                <Button 
                  fullWidth 
                  sx={{ 
                    mt: 2,
                    color: isDarkMode ? 'white' : undefined,
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : undefined
                    }
                  }}
                >
                  Manage All Devices
                </Button>
              </CardContent>
            </Card>
          </Grid>
      
          {/* Security Settings Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              height: '100%',
              borderLeft: '4px solid',
              borderColor: 'error.main',
              bgcolor: isDarkMode ? 'rgba(30,30,30,0.8)' : 'white',
              color: isDarkMode ? 'white' : 'inherit'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsSuggest sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold">Security Settings</Typography>
                </Box>
                
                {showSuccess && (
                  <Alert 
                    severity="success" 
                    sx={{ mb: 3 }}
                    icon={<CheckCircle />}
                  >
                    Two-Factor Authentication has been successfully enabled!
                  </Alert>
                )}
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Two-Factor Authentication</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                  }}>
                    <Typography>
                      Status: <Box component="span" color={twoFactorEnabled ? "success.main" : "error.main"}>
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Box>
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => setShowModal(true)}
                      disabled={twoFactorEnabled}
                    >
                      {twoFactorEnabled ? "Enabled" : "Enable"}
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Login Alerts</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                  }}>
                    <Typography>Email notifications for new logins</Typography>
                    <Switch checked={true} onChange={() => alert('Permission denied')}/>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Password</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                  }}>
                    <Typography>Last changed: 3 months ago</Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => navigate('/auth/forget-password')}
                      sx={{
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : undefined,
                        color: isDarkMode ? 'white' : undefined,
                        '&:hover': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : undefined
                        }
                      }}
                    >
                      Change
                    </Button>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Backup Codes</Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider'
                  }}>
                    <Typography>Generate backup codes for emergency access</Typography>
                    <Button 
                      onClick={handleDownloadCodeInZip} 
                      variant="outlined" 
                      size="small"
                      sx={{
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : undefined,
                        color: isDarkMode ? 'white' : undefined,
                        '&:hover': {
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : undefined,
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : undefined
                        }
                      }}
                    >
                      Generate
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <BiometricRegistrationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      </Box>
    );
};

export default SecurityOption;