import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Divider,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
  useMediaQuery,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import EmailIcon from '@mui/icons-material/Email';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { UserProfileContext } from '../../context/userProvider';
import { useNavigate } from 'react-router-dom';
import SignInFooter from '../LandingPage/SignIn-Footer';

const MemberProfile = () => {
  const { userProfile } = useContext(UserProfileContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Actions
  const handleResetPassword = () => {
    navigate('/auth/forget-password',{state:{...userProfile.Email}});
  };

  const handleRequestChanges = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('user');
    navigate('/auth/sign-in',{replace:true})
  };

  return (
    <>
    <Box sx={{ 
      padding: { xs: '16px', md: '32px' }, 
      maxWidth: '900px', 
      margin: 'auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      mb: 10,
      mt: 2,
      background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
    }}>
      <Fade in timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            padding: { xs: '20px', md: '32px' }, 
            borderRadius: '16px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <Zoom in timeout={1000}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '24px',
              flexDirection: { xs: 'column', md: 'row' },
              textAlign: { xs: 'center', md: 'left' },
              gap: '16px'
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 100, md: 120 }, 
                  height: { xs: 100, md: 120 }, 
                  bgcolor: 'primary.main',
                  fontSize: '2.5em',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                {userProfile?.Name.charAt(0)}
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {userProfile?.Name}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: { xs: 'center', md: 'flex-start' }
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'inline-block'
                    }} 
                  />
                  Member ID: {userProfile?.MemberID}
                </Typography>
              </Box>
            </Box>
          </Zoom>

          <Divider sx={{ 
            marginBottom: '32px',
            borderColor: alpha(theme.palette.divider, 0.1)
          }} />

          <Slide direction="up" in timeout={1200}>
            <Box sx={{ marginBottom: '32px' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'primary.main',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '2px'
                  }
                }}
              >
                <PersonIcon fontSize="small" /> Personal Details
              </Typography>
              <List sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: '16px'
              }}>
                <ListItem 
                  sx={{ 
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                    }}>
                      <PersonPinIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Personal Number" 
                    secondary={userProfile?.Pno}
                    primaryTypographyProps={{ 
                      fontWeight: 'medium',
                      color: 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                <ListItem 
                  sx={{ 
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                    }}>
                      <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Email" 
                    secondary={userProfile?.Email}
                    primaryTypographyProps={{ 
                      fontWeight: 'medium',
                      color: 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                <ListItem 
                  sx={{ 
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                    }}>
                      <ContactMailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Contact" 
                    secondary={userProfile?.Contact}
                    primaryTypographyProps={{ 
                      fontWeight: 'medium',
                      color: 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
                <ListItem 
                  sx={{ 
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateX(4px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                    }}>
                      <CalendarTodayIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Member Since"
                    secondary={new Date(userProfile?.MemberSince).toLocaleDateString()}
                    primaryTypographyProps={{ 
                      fontWeight: 'medium',
                      color: 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      color: 'text.secondary'
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Slide>

          <Divider sx={{ 
            marginBottom: '32px',
            borderColor: alpha(theme.palette.divider, 0.1)
          }} />

          <Slide direction="up" in timeout={1400}>
            <Box sx={{ marginBottom: '32px' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'primary.main',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '2px'
                  }
                }}
              >
                <GroupIcon fontSize="small" /> Family Members
              </Typography>
              <List sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: '16px'
              }}>
                {userProfile?.FamilyMember?.length > 0 ? (
                  userProfile.FamilyMember.map((member, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateX(4px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          {member.Name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={member.Name} 
                        secondary={member.Relation}
                        primaryTypographyProps={{ 
                          fontWeight: 'medium',
                          color: 'text.primary'
                        }}
                        secondaryTypographyProps={{
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary', 
                      textAlign: 'center',
                      py: 4,
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      borderRadius: '12px',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      gridColumn: '1 / -1'
                    }}
                  >
                    No Family Members
                  </Typography>
                )}
              </List>
            </Box>
          </Slide>

          <Divider sx={{ 
            marginBottom: '32px',
            borderColor: alpha(theme.palette.divider, 0.1)
          }} />

          <Slide direction="up" in timeout={1600}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '16px', 
              marginTop: '24px',
              justifyContent: 'center'
            }}>
              <Button
                variant="contained"
                startIcon={<LockResetIcon />}
                onClick={handleResetPassword}
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '1' },
                  py: 1.5,
                  borderRadius: '12px',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Reset Password
              </Button>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleRequestChanges}
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '1' },
                  py: 1.5,
                  borderRadius: '12px',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.dark',
                    color: 'primary.dark',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Log out
              </Button>
            </Box>
          </Slide>
        </Paper>
      </Fade>

    </Box>
    <SignInFooter/>
    </>
  );
};

export default MemberProfile;