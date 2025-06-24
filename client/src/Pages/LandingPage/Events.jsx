import { 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Grid, 
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getEventList } from '../../services/Event';
import {
  Event,
  CalendarToday,
  LocationOn,
  Link as LinkIcon,
  AccessTime,
  Error as ErrorIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format, isAfter, isBefore } from 'date-fns';

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showEventList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEventList();

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ my: 6 }} >
        <Alert 
          severity="error" 
          icon={<ErrorIcon />}
          sx={{ 
            mb: 4,
            borderRadius: 2,
            background: alpha(theme.palette.error.main, 0.1),
            '& .MuiAlert-icon': {
              color: theme.palette.error.main
            }
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ my: 6 }} id="events">
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main', 
          mb: 4,
          textAlign: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {eventList.length > 0 ? "Our Recent Events" : "No Events Available"}
      </Typography>

      <Grid container spacing={4}>
        {eventList.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  boxShadow: 3, 
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.EventPoster}
                    alt={event.EventName}
                    sx={{
                      objectFit: 'cover',
                      filter: 'brightness(0.9)'
                    }}
                  />
                  {event.status && (
                    <Chip
                      label="Registration Closed"
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: alpha(theme.palette.error.main, 0.8)
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Event 
                    sx={{ 
                      fontSize: 40, 
                      mb: 2, 
                      color: 'primary.main',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} 
                  />
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      minHeight: '2.5em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {event.EventName}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2,
                      color: 'text.secondary',
                      minHeight: '3em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {event.EventDescription}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {event.EventDate ? format(event.EventDate, 'MMMM d, yyyy') : 'Date not specified'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {event.EventTime}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {event.EventVenues}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={event.status}
                    href={event.LinkToRegister}
                    startIcon={<LinkIcon />}
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[500]
                      }
                    }}
                    fullWidth
                  >
                    {event.status ? 'Registration Closed' : 'Register Now'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Events;