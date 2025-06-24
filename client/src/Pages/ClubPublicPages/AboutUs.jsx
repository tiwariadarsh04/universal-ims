import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  History,
  Groups,
  EmojiEvents,
  Star,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  NaturePeople,
  SportsTennis,
  Restaurant,
  Pool,
  FitnessCenter,
  LocalBar,
  Cake,
  Celebration,
  Movie,
  MusicNote,
  Spa,
  GolfCourse,
  LibraryBooks
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SignInFooter from '../LandingPage/SignIn-Footer';

// Mock data - replace with actual data from your API
const teamMembers = {
  management: [
    { name: 'Rajesh Kumar', role: 'Club President', avatar: 'https://i.pravatar.cc/300?img=3' },
    { name: 'Priya Singh', role: 'General Manager', avatar: 'https://i.pravatar.cc/300?img=2' },
    { name: 'Amit Patel', role: 'Finance Director', avatar: 'https://i.pravatar.cc/?img=4' }
  ],
  sports: [
    { name: 'Vikram Joshi', role: 'Tennis Coach', avatar: 'https://i.pravatar.cc/?img=6' },
    { name: 'Neha Sharma', role: 'Swimming Instructor', avatar: 'https://i.pravatar.cc/?img=7' },
    { name: 'Arjun Mehta', role: 'Gym Trainer', avatar: 'https://i.pravatar.cc/?img=8' }
  ],
  culinary: [
    { name: 'Chef Sanjay', role: 'Executive Chef', avatar: 'https://i.pravatar.cc/?img=9' },
    { name: 'Chef Meena', role: 'Pastry Chef', avatar: 'https://i.pravatar.cc/?img=10' },
    { name: 'Chef Rohit', role: 'Mixologist', avatar: 'https://i.pravatar.cc/?img=11' }
  ]
};

const testimonials = [
  {
    quote: "Club Club is my second home. The facilities and staff make every visit exceptional.",
    author: "Ananya Gupta",
    role: "Member since 2010"
  },
  {
    quote: "The tennis coaching transformed my game. Now I compete at state level tournaments!",
    author: "Rahul Verma",
    role: "Junior Tennis Champion"
  },
  {
    quote: "Our daughter's wedding at the club was magical. The team executed everything perfectly.",
    author: "The Kapoor Family",
    role: "Event Hosts"
  }
];

const AboutUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  const [companyLogo, setCompanyLogo] = React.useState('');
  
  
    React.useEffect(() => {
      const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
      if (localLogo) {
        setCompanyLogo(localLogo);
      } 
    },[])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const stats = [
    { value: '70+', label: 'Years of Excellence', icon: <History fontSize="large" /> },
    { value: '350+', label: 'Members', icon: <Groups fontSize="large" /> },
    { value: '100+', label: 'Events Yearly', icon: <Celebration fontSize="large" /> },
    { value: '15+', label: 'Facilities', icon: <Star fontSize="large" /> }
  ];

  const facilities = [
    { name: 'Swimming Pool', icon: <Pool sx={{ fontSize: 40 }} /> },
    { name: 'Tennis Courts', icon: <SportsTennis sx={{ fontSize: 40 }} /> },
    { name: 'Fine Dining', icon: <Restaurant sx={{ fontSize: 40 }} /> },
    { name: 'Premium Gym', icon: <FitnessCenter sx={{ fontSize: 40 }} /> },
    { name: 'Lounge Bar', icon: <LocalBar sx={{ fontSize: 40 }} /> },
    { name: 'Banquet Hall', icon: <Cake sx={{ fontSize: 40 }} /> },
    { name: 'Movie Theater', icon: <Movie sx={{ fontSize: 40 }} /> },
    { name: 'Event Lawn', icon: <NaturePeople sx={{ fontSize: 40 }} /> }
  ];

  const coreValues = [
    { 
      title: 'Community', 
      description: 'Fostering connections and lifelong friendships among members',
      icon: <Groups color="primary" sx={{ fontSize: 40 }} />
    },
    { 
      title: 'Heritage', 
      description: 'Preserving our rich history while innovating for the future',
      icon: <History color="primary" sx={{ fontSize: 40 }} />
    },
    { 
      title: 'Excellence', 
      description: 'Delivering world-class amenities and service standards',
      icon: <Star color="primary" sx={{ fontSize: 40 }} />
    },
    { 
      title: 'Sportsmanship', 
      description: 'Promoting healthy competition and physical wellbeing',
      icon: <EmojiEvents color="primary" sx={{ fontSize: 40 }} />
    }
  ];

  // Auto-rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box 
      component="main"
      sx={{ 
        minHeight: '100vh',
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflowX: 'hidden'
      }}
    >
      {/* Premium Hero Section */}
      <Box sx={{ 
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      }}>
        {/* Animated background elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 50%, rgba(255,0,150,0.1) 0%, transparent 40%)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 70% 70%, rgba(255,215,0,0.1) 0%, transparent 40%)',
          zIndex: 1
        }} />
        
        {/* Hero content */}
        <Container maxWidth="lg" sx={{ 
          position: 'relative', 
          zIndex: 2, 
          textAlign: 'center',
          px: 4,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant={isMobile ? 'h2' : 'h1'}
              component="h1"
              sx={{ 
                fontWeight: 700,
                color: 'white',
                mb: 3,
                letterSpacing: '1px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                background: 'linear-gradient(45deg, #FFD700 30%, #FF0099 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {companyLogo?.name} Legacy
            </Typography>
            <Typography 
              variant={isMobile ? 'h6' : 'h5'}
              component="p"
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                textShadow: '0 1px 5px rgba(0,0,0,0.5)',
                fontWeight: 300,
                lineHeight: 1.6
              }}
            >
              Since 1950, we've been crafting unforgettable experiences in the heart of Jharkhand. 
              A sanctuary where heritage meets modernity, and every member becomes family.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/membership')}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                  boxShadow: '0 4px 20px rgba(255, 0, 153, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(255, 0, 153, 0.4)'
                  }
                }}
              >
                Join Our Community
              </Button>
            </Box>
          </motion.div>
        </Container>
        
        {/* Scrolling indicator */}
        <Box sx={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          textAlign: 'center'
        }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>
              Scroll Down
            </Typography>
            <Box sx={{ 
              width: '20px',
              height: '30px',
              border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: '10px',
              mx: 'auto',
              position: 'relative'
            }}>
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '8px',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '2px'
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 3, md: 6 } }}>
        {/* Heritage Section */}
        <Box id="heritage" sx={{ mb: 12 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 8,
            position: 'relative'
          }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              Our Heritage
            </Typography>
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              From humble beginnings to becoming Jharkhand's premier social destination, our story is woven into the fabric of Club
            </Typography>
          </Box>
          
          <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                  position: 'relative',
                  height: '500px',
                  '&:hover img': {
                    transform: 'scale(1.03)'
                  }
                }}>
                  <Box 
                    component="img"
                    src="https://s7ap1.scene7.com/is/image/incredibleindia/biodiversity-park-ranchi-jharkhand-1-attr-nearby?qlt=82&ts=1727010909308"
                    alt="Club Club in the 1950s"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                  }}>
                    <Typography variant="caption" color="white">
                      The original clubhouse in 1952
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  A Legacy Crafted Over Generations
                </Typography>
                <Typography paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }}>
                  Founded in 1950 by visionary industrialists, Club Club began as a modest gathering place 
                  for local professionals. The original clubhouse, with its single tennis court and dining room, 
                  quickly became the social heart of the community.
                </Typography>
                <Typography paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }}>
                  Through decades of careful stewardship, we've preserved the charm of our heritage while evolving 
                  into a 25-acre oasis. Our iconic colonial architecture now harmonizes with state-of-the-art 
                  facilities, creating a unique blend of tradition and modernity.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/gallery/history')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
                    }}
                  >
                    Historical Gallery
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Stats Section */}
          <Box sx={{ 
            mb: 8,
            background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.9) 100%)',
            borderRadius: 3,
            py: 6,
            px: 2,
            color: 'white',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'url(/assets/patterns/dots-pattern.png)',
              opacity: 0.1,
              zIndex: 0
            }
          }}>
            <Grid container spacing={3} justifyContent="center" position="relative" zIndex={1}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <Box sx={{ 
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h2" component="div" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" component="div" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Core Values Section */}
        <Box sx={{ mb: 12 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 8,
            position: 'relative'
          }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              Our Philosophy
            </Typography>
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              The principles that guide every decision and interaction at Club Club
            </Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {coreValues.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.6)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ 
                      textAlign: 'center',
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <Box sx={{ 
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}>
                        {value.icon}
                      </Box>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 300 }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Facilities Section */}
          <Box sx={{ 
            background: theme.palette.mode === 'dark' ? 'rgba(20,20,30,0.7)' : 'rgba(245,245,255,0.7)',
            borderRadius: 3,
            p: 6,
            mb: 6,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 6,
              textAlign: 'center'
            }}>
              World-Class Facilities
            </Typography>
            <Grid container spacing={3}>
              {facilities.map((facility, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      background: theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.5)' : 'rgba(255,255,255,0.7)',
                      borderRadius: 2,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' ? 'rgba(255,0,153,0.1)' : 'rgba(255,215,0,0.1)'
                      }
                    }}>
                      <Box sx={{ 
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: 'white'
                      }}>
                        {facility.icon}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                        {facility.name}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 12 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 8,
            position: 'relative'
          }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              Meet The Family
            </Typography>
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              Our dedicated team works tirelessly to create exceptional experiences for every member
            </Typography>
          </Box>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 6,
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
              }
            }}
          >
            <Tab label="Management" sx={{ fontWeight: 600, fontSize: '1rem' }} />
            <Tab label="Sports Coaches" sx={{ fontWeight: 600, fontSize: '1rem' }} />
            <Tab label="Culinary Team" sx={{ fontWeight: 600, fontSize: '1rem' }} />
            <Tab label="Events Staff" sx={{ fontWeight: 600, fontSize: '1rem' }} />
          </Tabs>
          
          <Grid container spacing={4}>
            {teamMembers[tabValue === 0 ? 'management' : tabValue === 1 ? 'sports' : 'culinary'].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      height: '250px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box 
                        component="img"
                        src={member.avatar}
                        alt={member.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.8s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                      }} />
                    </Box>
                    <CardContent sx={{ 
                      position: 'relative',
                      zIndex: 1,
                      mt: -6,
                      textAlign: 'center'
                    }}>
                      <Avatar 
                        src={member.avatar}
                        sx={{ 
                          width: 100,
                          height: 100,
                          border: '4px solid white',
                          mx: 'auto',
                          mb: 2
                        }}
                      />
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {member.role}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton sx={{ 
                          background: 'rgba(255,0,153,0.1)',
                          '&:hover': {
                            background: 'rgba(255,0,153,0.2)'
                          }
                        }}>
                          <Email color="primary" />
                        </IconButton>
                        <IconButton sx={{ 
                          background: 'rgba(255,215,0,0.1)',
                          '&:hover': {
                            background: 'rgba(255,215,0,0.2)'
                          }
                        }}>
                          <Phone color="primary" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mb: 12 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 8,
            position: 'relative'
          }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              Member Stories
            </Typography>
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              Hear from our members about their Club Club experiences
            </Typography>
          </Box>
          
          <Box sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            position: 'relative',
            minHeight: '300px'
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  background: theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.7)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  p: 6,
                  textAlign: 'center'
                }}>
                  <Box sx={{ 
                    fontSize: '3rem',
                    lineHeight: 1,
                    mb: 3,
                    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }}>
                    "
                  </Box>
                  <Typography variant="h5" component="blockquote" sx={{ 
                    fontStyle: 'italic',
                    fontWeight: 300,
                    lineHeight: 1.7,
                    mb: 4
                  }}>
                    {testimonials[activeTestimonial].quote}
                  </Typography>
                  <Divider sx={{ my: 3, mx: 'auto', width: '100px' }} />
                  <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
                    {testimonials[activeTestimonial].author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonials[activeTestimonial].role}
                  </Typography>
                </Card>
              </motion.div>
            </AnimatePresence>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4
            }}>
              {testimonials.map((_, index) => (
                <Box 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: index === activeTestimonial ? 
                      'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)' : 
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Location Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 8,
            position: 'relative'
          }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                mb: 3, 
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              Our Sanctuary
            </Typography>
            <Typography 
              variant="h6" 
              component="p"
              sx={{ 
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              A 25-acre oasis where nature and luxury coexist in perfect harmony
            </Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  position: 'relative',
                  height: '400px'
                }}>
                  <Box 
                    component="img"
                    src="https://www.indiatravel.app/wp-content/uploads/2024/03/places-to-visit-in-jharkhand.jpg"
                    alt="Aerial view of Club Club"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                  }}>
                    <Typography variant="caption" color="white">
                      Aerial view of our 25-acre property
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  A Natural Masterpiece
                </Typography>
                <Typography paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }}>
                  Nestled in the lush landscapes of Jharkhand, our property is a carefully maintained ecosystem 
                  featuring indigenous flora and fauna. The club's design harmonizes with the natural topography, 
                  offering breathtaking views of the surrounding hills and valleys.
                </Typography>
                <Typography paragraph sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }}>
                  Our walking trails wind through groves of sal trees, the organic garden supplies fresh produce 
                  to our kitchens, and natural rock formations have been incorporated into our landscape design 
                  to create a truly unique environment.
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {['Lush Gardens', 'Natural Springs', 'Walking Trails', 'Wildlife Spotting', 
                    'Rock Formations', 'Sunset Points'].map((feature, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Chip 
                        icon={<NaturePeople />}
                        label={feature}
                        variant="outlined"
                        sx={{ 
                          borderRadius: '50px',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          fontWeight: 500
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/virtual-tour')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
                    }}
                  >
                    Virtual Tour
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      borderRadius: '50px',
                      borderWidth: '2px'
                    }}
                  >
                    Plan Your Visit
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Contact Card */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(22,33,62,0.9) 100%)',
            color: 'white',
            p: 6
          }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationOn sx={{ fontSize: 40, mr: 2, color: '#FFD700' }} />
                  <Box>
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>
                      Address
                    </Typography>
                    <Typography>
                      {companyLogo?.address}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Phone sx={{ fontSize: 40, mr: 2, color: '#FFD700' }} />
                  <Box>
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>
                      Contact
                    </Typography>
                    <Typography>
                      {companyLogo?.contact}<br />
                      {companyLogo?.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AccessTime sx={{ fontSize: 40, mr: 2, color: '#FFD700' }} />
                  <Box>
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold' }}>
                      Hours
                    </Typography>
                    <Typography>
                      Daily: 6:00 AM - 11:00 PM<br />
                      Office: 9:00 AM - 7:00 PM
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>

        {/* Final CTA */}
        <Box sx={{ 
          textAlign: 'center',
          mt: 12,
          mb: 6,
          p: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,0,153,0.1) 0%, rgba(255,215,0,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Typography variant="h3" component="h2" sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Become Part of Our Legacy
          </Typography>
          <Typography variant="h6" component="p" sx={{ 
            mb: 4,
            maxWidth: '700px',
            mx: 'auto',
            fontWeight: 300,
            lineHeight: 1.7
          }}>
            Join {companyLogo?.name} today and experience a world where tradition meets modern luxury, 
            and every day brings new opportunities for connection and enjoyment.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/membership')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '50px',
              background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
              boxShadow: '0 10px 30px rgba(255, 0, 153, 0.3)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 35px rgba(255, 0, 153, 0.4)'
              }
            }}
          >
            Explore Membership Options
          </Button>
        </Box>
      </Container>

      <SignInFooter/>
    </Box>
  );
};

export default AboutUsPage;