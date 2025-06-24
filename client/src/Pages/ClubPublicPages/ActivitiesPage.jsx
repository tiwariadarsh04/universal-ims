import React, { useState } from 'react';
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
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Paper,
  Badge
} from '@mui/material';
import {
  SportsTennis,
  Pool,
  FitnessCenter,
  Restaurant,
  LocalBar,
  Spa,
  GolfCourse,
  MusicNote,
  Event,
  Bookmark,
  Favorite,
  Share,
  FilterList,
  Search,
  AccessTime
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SignInFooter from '../LandingPage/SignIn-Footer';

const ActivitiesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [likedActivities, setLikedActivities] = useState([]);

  // Sample activity data (replace with real API data)
  const activities = [
    {
      id: 1,
      title: "Olympic Swimming Pool",
      category: "sports",
      icon: <Pool sx={{ fontSize: 40 }} />,
      image: "/assets/activities/pool.jpg",
      description: "A 50-meter Olympic-standard pool with professional coaching.",
      availability: "6:00 AM - 10:00 PM",
      isTrending: true
    },
    {
      id: 2,
      title: "Tennis Courts",
      category: "sports",
      icon: <SportsTennis sx={{ fontSize: 40 }} />,
      image: "/assets/activities/tennis.jpg",
      description: "Four floodlit synthetic courts with professional trainers.",
      availability: "7:00 AM - 9:00 PM",
      isTrending: false
    },
    {
      id: 3,
      title: "Luxury Spa & Wellness",
      category: "wellness",
      icon: <Spa sx={{ fontSize: 40 }} />,
      image: "/assets/activities/spa.jpg",
      description: "Rejuvenate with massages, sauna, and hydrotherapy.",
      availability: "9:00 AM - 8:00 PM",
      isTrending: true
    },
    {
      id: 4,
      title: "Fine Dining Restaurant",
      category: "dining",
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      image: "/assets/activities/restaurant.jpg",
      description: "Multi-cuisine gourmet experience with live music.",
      availability: "12:00 PM - 11:00 PM",
      isTrending: false
    },
    {
      id: 5,
      title: "Premium Gymnasium",
      category: "fitness",
      icon: <FitnessCenter sx={{ fontSize: 40 }} />,
      image: "/assets/activities/gym.jpg",
      description: "State-of-the-art equipment with personal trainers.",
      availability: "5:00 AM - 11:00 PM",
      isTrending: true
    },
    {
      id: 6,
      title: "Lounge Bar",
      category: "entertainment",
      icon: <LocalBar sx={{ fontSize: 40 }} />,
      image: "/assets/activities/bar.jpg",
      description: "Signature cocktails in a sophisticated setting.",
      availability: "5:00 PM - 1:00 AM",
      isTrending: false
    }
  ];

  const categories = [
    { label: "All Activities", icon: <Event /> },
    { label: "Sports", icon: <SportsTennis /> },
    { label: "Wellness", icon: <Spa /> },
    { label: "Dining", icon: <Restaurant /> },
    { label: "Fitness", icon: <FitnessCenter /> },
    { label: "Entertainment", icon: <MusicNote /> }
  ];

  const toggleLike = (activityId) => {
    if (likedActivities.includes(activityId)) {
      setLikedActivities(likedActivities.filter(id => id !== activityId));
    } else {
      setLikedActivities([...likedActivities, activityId]);
    }
  };

  const filteredActivities = activeTab === 0 
    ? activities 
    : activities.filter(activity => activity.category === categories[activeTab].label.toLowerCase());

  return (
    <>
    <Box sx={{ 
      background: theme.palette.background.default,
      minHeight: '100vh',
      pt: isMobile ? 4 : 8,
      pb: 8
    }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px'
            }}
          >
            Club Activities
          </Typography>
          <Typography 
            variant="h6" 
            component="p"
            sx={{ 
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 300,
              lineHeight: 1.6
            }}
          >
            Discover world-class amenities designed for relaxation, fitness, and entertainment.
          </Typography>
        </Box>

        {/* Filter Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 6,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 3 : 0
        }}>
          <Tabs 
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
              }
            }}
          >
            {categories.map((category, index) => (
              <Tab 
                key={index}
                label={category.label}
                icon={category.icon}
                iconPosition="start"
                sx={{ 
                  fontWeight: 600,
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  minHeight: 'auto',
                  py: 1,
                  px: 2
                }}
              />
            ))}
          </Tabs>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              sx={{
                borderRadius: '50px',
                borderWidth: '2px',
                px: 3
              }}
            >
              Filters
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Search />}
              sx={{
                borderRadius: '50px',
                borderWidth: '2px',
                px: 3
              }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {/* Activities Grid */}
        <Grid container spacing={4}>
          {filteredActivities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': {
                    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                    '& .activity-image': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}>
                  {/* Activity Image */}
                  <Box sx={{ 
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Box 
                      className="activity-image"
                      component="img"
                      src={activity.image}
                      alt={activity.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)'
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1
                    }}>
                      <IconButton 
                        onClick={() => toggleLike(activity.id)}
                        sx={{ 
                          color: likedActivities.includes(activity.id) ? '#FF0099' : 'rgba(255,255,255,0.8)',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.5)'
                          }
                        }}
                      >
                        <Favorite />
                      </IconButton>
                    </Box>
                    {activity.isTrending && (
                      <Chip 
                        label="Trending"
                        sx={{ 
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          backgroundColor: '#FF0099',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Box>

                  {/* Activity Details */}
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        mr: 2,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        width: 50,
                        height: 50
                      }}>
                        {activity.icon}
                      </Avatar>
                      <Typography variant="h5" component="h3" sx={{ 
                        fontWeight: 'bold',
                        flexGrow: 1
                      }}>
                        {activity.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ 
                      mb: 3,
                      color: 'text.secondary',
                      minHeight: '60px'
                    }}>
                      {activity.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <AccessTime color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">{activity.availability}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: '50px',
                          py: 1,
                          background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
                          fontWeight: 'bold'
                        }}
                      >
                        Book Slot
                      </Button>
                      <IconButton sx={{ 
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Share />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* No Activities Message */}
        {filteredActivities.length === 0 && (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            mt: 4
          }}>
            <Event sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              No activities found in this category
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Check back later or explore other categories
            </Typography>
            <Button 
              variant="outlined"
              onClick={() => setActiveTab(0)}
              sx={{
                borderRadius: '50px',
                px: 4,
                borderWidth: '2px'
              }}
            >
              View All Activities
            </Button>
          </Paper>
        )}

        {/* Membership CTA */}
        <Box sx={{ 
          mt: 12,
          p: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(255,0,153,0.1) 0%, rgba(255,215,0,0.1) 100%)',
          textAlign: 'center'
        }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 3,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Unlock Premium Access
          </Typography>
          <Typography variant="h6" component="p" sx={{ 
            mb: 4,
            maxWidth: '700px',
            mx: 'auto',
            fontWeight: 300,
            lineHeight: 1.7
          }}>
            Become a member to enjoy exclusive benefits, priority bookings, and special discounts.
          </Typography>
          <Button 
            variant="contained"
            startIcon={<Bookmark />}
            sx={{
              borderRadius: '50px',
              px: 6,
              py: 1.5,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)',
              boxShadow: '0 10px 30px rgba(255, 0, 153, 0.3)'
            }}
          >
            Join Now
          </Button>
        </Box>
      </Container>

    </Box>
    <SignInFooter/>
    </>
  );
};

export default ActivitiesPage;