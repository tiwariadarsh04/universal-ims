import React, { useEffect, useState } from 'react';
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
  Paper
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AccessTime,
  Favorite,
  Share,
  Bookmark,
  FilterList,
  Search,
  Event,
  MusicNote,
  SportsSoccer,
  Restaurant,
  Spa,
  School
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SignInFooter from '../LandingPage/SignIn-Footer';
import { getEventList } from '../../services/Event';
import { isAfter } from 'date-fns';

const EventsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [likedEvents, setLikedEvents] = useState([]);
  const [companyLogo, setCompanyLogo] = React.useState('');
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
    React.useEffect(() => {
      const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
      if (localLogo) {
        setCompanyLogo(localLogo);
      } 
    },[])

    const showEventList = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await getEventList();

          console.log(res)
    
          if (!res || !Array.isArray(res)) {
            throw new Error('Invalid response format from server');
          }
    
          // Validate and format each event
          const formattedEvents = res.map(event => {
            const eventDate = event.EventDate ? new Date(event.EventDate) : null;
            const currentDate = new Date();
            
            // Check if event date is in the future
            const isFutureEvent = eventDate ? isAfter(eventDate, currentDate) : false;
            
            return {
              ...event,
              EventName: event.EventName || 'Untitled Event',
              EventDescription: event.EventDescription || 'No description available',
              EventDate: eventDate,
              EventTime: event.EventTime || 'Time not specified',
              EventVenues: event.EventVenues || 'Venue not specified',
              EventPoster: event.EventPoster ? `${import.meta.env.VITE_APP_POSTER_URL}/${event.EventPoster}` : 'https://placehold.co/400x200',
              LinkToRegister: event.LinkToRegister || '#',
              status: !isFutureEvent // Registration is closed if event is in the past
            };
          });
    
          setEventList(formattedEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
          setError(error.message || 'Failed to load events');
          setEventList([]);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      showEventList();
    }, []);

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
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          position: 'relative'
        }}>
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
            Upcoming Events
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
            Discover unforgettable experiences at {companyLogo?.name}. From cultural evenings to sports tournaments, we curate events that bring our community together.
          </Typography>
        </Box>

        {/* Events Grid */}
        <Grid container spacing={4}>
          {eventList.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
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
                    '& .event-poster': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}>
                  {/* Event Poster */}
                  <Box sx={{ 
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Box 
                      className="event-poster"
                      component="img"
                      src={event.EventPoster}
                      alt={event.EventName}
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
                        onClick={() => toggleLike(event._id)}
                        sx={{ 
                          color: likedEvents.includes(event._id) ? '#FF0099' : 'rgba(255,255,255,0.8)',
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.5)'
                          }
                        }}
                      >
                        <Favorite />
                      </IconButton>
                    </Box>
                    <Chip 
                      label='0$'
                      sx={{ 
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark' ? '#FFD700' : '#FF0099'
                      }}
                    />
                  </Box>

                  {/* Event Details */}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h3" sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      minHeight: '64px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {event.EventName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        {new Date(event.EventDate).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">{event.EventTime}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">{event.EventVenues}</Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ 
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: 'text.secondary'
                    }}>
                      {event.EventDescription}
                    </Typography>
                    
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
                        Login to Register
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

        {/* No Events Message */}
        {eventList.length === 0 && (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
          }}>
            <Event sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              No events found in this category
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Check back later or browse other event categories
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
              View All Events
            </Button>
          </Paper>
        )}

        {/* Calendar CTA */}
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
            Never Miss an Event
          </Typography>
          <Typography variant="h6" component="p" sx={{ 
            mb: 4,
            maxWidth: '700px',
            mx: 'auto',
            fontWeight: 300,
            lineHeight: 1.7
          }}>
            Download our event calendar or subscribe to get notifications about upcoming events
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Button 
              variant="contained"
              startIcon={<Bookmark />}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF0099 0%, #FFD700 100%)'
              }}
            >
              Download Calendar
            </Button>
            <Button 
              variant="outlined"
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                borderWidth: '2px'
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
    <SignInFooter/>
    </>
  );
};

export default EventsPage;