import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Chip,
  FormControlLabel,
  Switch,
  Tooltip,
  Badge,
  Divider,
  alpha,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Fab
} from '@mui/material';
import { 
  CalendarToday, 
  CalendarMonth,
  Schedule, 
  Person, 
  EventAvailable,
  EventBusy,
  Email,
  Notes,
  Cake,
  Groups,
  School,
  SportsSoccer,
  MusicNote,
  FilterAlt,
  ChevronLeft,
  ArrowBackIos,
  ArrowForwardIos,
  Star,
  LocationOn,
  Close as CloseIcon,
  ViewDay,
  ViewModule,
  KeyboardArrowUp
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getAgendaList } from '../../services/Agenda';
import { motion, AnimatePresence } from 'framer-motion';
import SignInFooter from './SignIn-Footer';

// Animations

const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5 }
};


const HeaderText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  letterSpacing: '0.5px'
}));

const StyledDayCard = styled(Paper)(({ theme, booked, isToday, isSelected }) => ({
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  height: { xs: 90, sm: 110, md: 130 }[theme.breakpoints.up],
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: booked 
    ? alpha(theme.palette.primary.light, 0.1) 
    : theme.palette.background.paper,
  border: isToday 
    ? `2px solid ${alpha(theme.palette.primary.main, 0.7)}` 
    : isSelected 
      ? `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`
      : '1px solid transparent',
  borderRadius: 12,
  boxShadow: isSelected ? theme.shadows[3] : theme.shadows[1],
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
    backgroundColor: booked 
      ? alpha(theme.palette.primary.light, 0.15) 
      : alpha(theme.palette.primary.light, 0.05)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    height: 80
  }
}));

const EventIcon = ({ eventType, size = 'small' }) => {
  const iconMap = {
    'Birthday Party': <Cake color="secondary" fontSize={size} />,
    'Team Meeting': <Groups color="info" fontSize={size} />,
    'Workshop': <School color="action" fontSize={size} />,
    'Sports Event': <SportsSoccer color="success" fontSize={size} />,
    'Music Session': <MusicNote color="warning" fontSize={size} />,
    'default': <EventAvailable color="primary" fontSize={size} />
  };
  
  return iconMap[eventType] || iconMap['default'];
};

const CalendarAgenda = ({onclose}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [view, setView] = useState('month');
  const [loading, setLoading] = useState(true);
  const [calendarView, setCalendarView] = useState('grid');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Date navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newDate;
    });
  };

  const handleDayClick = (day, hasBooking) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    if (hasBooking) {
      setView('day');
    }
  };

  const handleBackToMonth = () => {
    setView('month');
  };

  const toggleAvailableOnly = () => {
    setShowAvailableOnly(!showAvailableOnly);
  };

  const handleCalendarViewChange = (_, newView) => {
    if (newView !== null) {
      setCalendarView(newView);
    }
  };

  // Calendar rendering functions
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();
    
    const days = [];
    
    // Empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Grid item xs={calendarView === 'grid' ? 1.7 : 12} key={`empty-${i}`} 
          sx={{ display: calendarView === 'grid' ? 'block' : 'none' }} 
        />
      );
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayBookings = bookings.filter(b => 
        new Date(b.date).getDate() === day && 
        new Date(b.date).getMonth() === month && 
        new Date(b.date).getFullYear() === year
      );
      const hasBooking = dayBookings.length > 0;
      const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
      const isSelected = selectedDate && date.getDate() === selectedDate.getDate() && 
                        selectedDate.getMonth() === date.getMonth() && 
                        selectedDate.getFullYear() === date.getFullYear();
      
      if (showAvailableOnly && hasBooking) {
        days.push(<Grid item xs={calendarView === 'grid' ? 1.7 : 12} key={`day-${day}`} />);
        continue;
      }
      
      // Grid view
      if (calendarView === 'grid') {
        days.push(
          <Grid item xs={1.7} key={`day-${day}`}>
            <motion.div 
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: day * 0.01 }}
            >
              <StyledDayCard 
                elevation={isSelected ? 4 : 2}
                booked={hasBooking}
                isToday={isToday}
                isSelected={isSelected}
                onClick={() => handleDayClick(day, hasBooking)}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography 
                    variant={isMobile ? "caption" : "subtitle2"} 
                    color={isToday ? "primary.main" : "text.primary"}
                    fontWeight={isToday || isSelected ? "bold" : "normal"}
                    sx={{
                      background: isToday ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'none',
                      WebkitBackgroundClip: isToday ? 'text' : 'none',
                      WebkitTextFillColor: isToday ? 'transparent' : 'inherit',
                    }}
                  >
                    {day}
                  </Typography>
                  {hasBooking ? (
                    <Badge 
                      badgeContent={dayBookings.length > 1 ? dayBookings.length : 0} 
                      color="primary"
                      overlap="circular"
                      sx={{
                        '& .MuiBadge-badge': {
                          boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                        }
                      }}
                    >
                      <EventIcon eventType={dayBookings[0].eventType} />
                    </Badge>
                  ) : (
                    <EventBusy color="disabled" fontSize="small" /> 
                  )}
                </Box>
                
                {hasBooking && (
                  <Box mt={1} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Typography 
                      variant={isMobile ? "caption" : "body2"} 
                      noWrap
                      fontWeight="medium"
                      color="text.secondary"
                    >
                      {isMobile ? dayBookings[0].event.substring(0, 6) + '...' : 
                        dayBookings[0].event.length > 15 ? dayBookings[0].event.substring(0, 15) + '...' : dayBookings[0].event}
                    </Typography>
                    {
                      isMobile ? null : <Box display="flex" alignItems="center" mt={0.5}>
                      <Schedule fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {dayBookings[0].timing.split(' - ')[0]}
                      </Typography>
                    </Box>
                    }
                  </Box>
                )}
              </StyledDayCard>
            </motion.div>
          </Grid>
        );
      } else {
        // List view
        if (hasBooking) {
          days.push(
            <Grid item xs={12} key={`day-${day}`}>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: day * 0.03 }}
              >
                <Paper 
                  elevation={isSelected ? 3 : 1}
                  sx={{ 
                    p: 2, 
                    mb: 1,
                    borderRadius: 3,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    backgroundColor: isSelected ? alpha(theme.palette.primary.light, 0.1) : alpha(theme.palette.background.paper, 0.7),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      transform: 'translateX(5px)'
                    },
                    ...(isToday && {
                      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
                    })
                  }}
                  onClick={() => handleDayClick(day, hasBooking)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} md={2}>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent={isMobile ? "flex-start" : "center"} 
                        sx={{ position: 'relative' }}
                      >
                        {isToday && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: -8, 
                              right: isMobile ? 'auto' : -8, 
                              left: isMobile ? -8 : 'auto',
                              backgroundColor: theme.palette.primary.main,
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              py: 0.2,
                              px: 0.8,
                              borderRadius: '10px',
                              zIndex: 1,
                              boxShadow: theme.shadows[2]
                            }}
                          >
                            TODAY
                          </Box>
                        )}
                        <Typography 
                          variant="h5" 
                          fontWeight="bold"
                          sx={{
                            background: isToday ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'inherit',
                            WebkitBackgroundClip: isToday ? 'text' : 'none',
                            WebkitTextFillColor: isToday ? 'transparent' : 'inherit',
                            mr: 1
                          }}
                        >
                          {day}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={10} sm={7} md={8}>
                      <Box>
                        <Box display="flex" alignItems="center">
                          <EventIcon eventType={dayBookings[0].eventType} size="small" />
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>
                            {dayBookings[0].event}
                          </Typography>
                          {dayBookings[0].important && (
                            <Chip 
                              label="Important" 
                              size="small"
                              color="warning"
                              icon={<Star fontSize="small" />}
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </Box>
                        
                        <Box display="flex" alignItems="center" mt={0.5} flexWrap="wrap">
                          <Box display="flex" alignItems="center" mr={2}>
                            <Schedule color="action" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {dayBookings[0].timing}
                            </Typography>
                          </Box>
                          
                          {dayBookings[0].location && (
                            <Box display="flex" alignItems="center">
                              <LocationOn color="action" fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {dayBookings[0].location}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={2} sm={2} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {dayBookings.length > 1 ? (
                        <Chip 
                          label={`+${dayBookings.length - 1} more`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ height: 24 }}
                        />
                      ) : null}
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          );
        } else if (!showAvailableOnly) {
          days.push(
            <Grid item xs={12} key={`day-${day}`}>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: day * 0.01 }}
              >
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 1,
                    borderRadius: 3,
                    borderLeft: `4px solid ${alpha(theme.palette.text.disabled, 0.3)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    cursor: 'pointer',
                    opacity: 0.7,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.5)
                    },
                    ...(isToday && {
                      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`
                    })
                  }}
                  onClick={() => handleDayClick(day, hasBooking)}
                >
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="h5" 
                      fontWeight={isToday ? "bold" : "medium"}
                      sx={{
                        background: isToday ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'inherit',
                        WebkitBackgroundClip: isToday ? 'text' : 'none',
                        WebkitTextFillColor: isToday ? 'transparent' : 'inherit',
                        mr: 1
                      }}
                    >
                      {day}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <EventBusy color="disabled" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        No events scheduled
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          );
        }
      }
    }
    
    return days;
  };

  const renderDayView = () => {
    if (!selectedDate) return null;
    
    const dayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.date);
      return (
        bookingDate.getDate() === selectedDate.getDate() && 
        bookingDate.getMonth() === selectedDate.getMonth() && 
        bookingDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    return (
      <motion.div {...slideUp}>
        <Box>
          <Box display="flex" alignItems="center" mb={4} mt={2}>
            <IconButton 
              onClick={handleBackToMonth} 
              sx={{ 
                mr: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <ChevronLeft color="primary" />
            </IconButton>
            <HeaderText variant="h5">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </HeaderText>
          </Box>
          
          <AnimatePresence mode="wait">
            {dayBookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Paper elevation={0} sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                }}>
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.7)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
                      borderRadius: '50%',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    <EventBusy color="disabled" sx={{ fontSize: 48 }} />
                  </Box>
                  <HeaderText variant="h5" gutterBottom>
                    No Events Scheduled
                  </HeaderText>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    This day is wide open for new possibilities. Why not schedule something exciting?
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<EventAvailable />}
                    onClick={() => navigate('/create-event')}
                    sx={{ 
                      borderRadius: 6,
                      px: 3,
                      py: 1.2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }
                    }}
                  >
                    Create New Event
                  </Button>
                </Paper>
              </motion.div>
            ) : (
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                    fontWeight: 500
                  }}
                >
                  <EventAvailable sx={{ mr: 1, opacity: 0.7 }} fontSize="small" />
                  {dayBookings.length} {dayBookings.length === 1 ? 'Event' : 'Events'} Scheduled
                </Typography>
                
                <Box sx={{ position: 'relative', mb: 3, pb: 4 }}>
                  {/* Timeline line */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: 20, 
                      top: 0, 
                      bottom: 0, 
                      width: 3, 
                      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.2)})`,
                      borderRadius: 5,
                      zIndex: 0
                    }} 
                  />
                  
                  {/* Events */}
                  <Grid container spacing={2}>
                    {dayBookings.map((booking, index) => (
                      <Grid item xs={12} key={booking._id || index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20, x: 20 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, x: 5 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Paper 
                            elevation={3} 
                            sx={{ 
                              p: 3, 
                              borderRadius: 3,
                              ml: 5,
                              position: 'relative',
                              overflow: 'hidden',
                              backdropFilter: 'blur(10px)',
                              background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.8)})`,
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 5,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                              }
                            }}
                          >
                            {/* Timeline dot */}
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                left: -41, 
                                top: 20, 
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%',
                                backgroundColor: theme.palette.primary.main,
                                border: `3px solid ${theme.palette.background.paper}`,
                                boxShadow: theme.shadows[3],
                                zIndex: 1
                              }} 
                            />
                            
                            <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box display="flex" alignItems="center" mb={1.5}>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: theme.palette.primary.main,
                                      mr: 1.5
                                    }}
                                  >
                                    <EventIcon eventType={booking.eventType} size="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.1 }}>
                                      {booking.event}
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={0.5}>
                                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Schedule fontSize="small" sx={{ mr: 0.5, opacity: 0.6, fontSize: '0.9rem' }} />
                                        {booking.timing}
                                      </Typography>
                                      {booking.important && (
                                        <Chip 
                                          label="Important" 
                                          size="small" 
                                          color="warning" 
                                          icon={<Star fontSize="small" />}
                                          sx={{ ml: 1, height: 20 }}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                              
                              <Box>
                                <Button 
                                  variant="contained" 
                                  size="small" 
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setOpenDialog(true);
                                  }}
                                  sx={{ 
                                    borderRadius: 8,
                                    px: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    '&:hover': {
                                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                                    },
                                    textTransform: 'none',
                                    fontWeight: 'medium'
                                  }}
                                >
                                  Details
                                </Button>
                              </Box>
                            </Box>
                            
                            <Grid container spacing={2} mt={1}>
                              <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center">
                                  <Person color="action" sx={{ mr: 1, opacity: 0.6 }} />
                                  <Typography variant="body2">{booking.bookedBy}</Typography>
                                </Box>
                              </Grid>
                              
                              {booking.location && (
                                <Grid item xs={12} sm={6}>
                                  <Box display="flex" alignItems="center">
                                    <LocationOn color="action" sx={{ mr: 1, opacity: 0.6 }} />
                                    <Typography variant="body2">{booking.location}</Typography>
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    );
  };

  // Data fetching
  const getAgendaDetails = async () => {
    try {
      setLoading(true);
      const res = await getAgendaList();
      
      // Validate response
      if (!res || !res.data) {
        throw new Error('Invalid response format from server');
      }

      // Convert date strings to Date objects and validate each booking
      const formattedBookings = res.data.map(booking => {
        if (!booking.date || !booking.event || !booking.bookedBy) {
          console.warn('Invalid booking data:', booking);
          return null;
        }

        try {
          return {
            ...booking,
            date: new Date(booking.date),
            // Ensure all required fields are present
            event: booking.event || 'Untitled Event',
            bookedBy: booking.bookedBy || 'Unknown',
            timing: booking.timing || 'Time not specified',
            eventType: booking.eventType || 'General',
            important: Boolean(booking.important),
            contact: booking.contact || 'Not provided',
            location: booking.location || 'Not specified',
            notes: booking.notes || ''
          };
        } catch (error) {
          console.error('Error processing booking:', error);
          return null;
        }
      }).filter(booking => booking !== null); // Remove invalid bookings

      // Sort bookings by date and time
      formattedBookings.sort((a, b) => {
        // First sort by date
        const dateComparison = a.date - b.date;
        if (dateComparison !== 0) return dateComparison;
        
        // If same date, sort by time
        const aTime = a.timing.split(' - ')[0];
        const bTime = b.timing.split(' - ')[0];
        return aTime.localeCompare(bTime);
      });

      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error fetching agenda:", error);
      // Show error message to user
      setBookings([]); // Clear bookings on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgendaDetails();
  }, []);

  // Render all events in timeline view
  const renderTimelineView = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (bookings.length === 0) {
      return (
        <Paper elevation={0} sx={{ 
          p: 4, 
          textAlign: 'center', 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
        }}>
          <EventBusy color="disabled" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events scheduled
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your calendar is empty. Start by creating a new event!
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<EventAvailable />}
            onClick={() => navigate('/create-event')}
            sx={{ 
              borderRadius: 8,
              px: 3,
              py: 1.2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Create New Event
          </Button>
        </Paper>
      );
    }

    // Group bookings by month and year
    const groupedBookings = {};
    bookings.forEach(booking => {
      const date = booking.date;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!groupedBookings[key]) {
        groupedBookings[key] = {
          monthYear: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bookings: []
        };
      }
      
      groupedBookings[key].bookings.push(booking);
    });

    return (
      <Box sx={{ position: 'relative', mb: 3, pb: 4 }}>
        {/* Timeline vertical line */}
        <Box 
          sx={{ 
            position: 'absolute', 
            left: { xs: 20, md: 40 }, 
            top: 0, 
            bottom: 0, 
            width: 3, 
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.1)})`,
            borderRadius: 5,
            zIndex: 0
          }} 
        />
        
        {/* Timeline content */}
        <Box sx={{ ml: { xs: 5, md: 8 }, mt: 4 }}>
          {Object.keys(groupedBookings).map((key, groupIndex) => (
            <Box key={key} sx={{ mb: 6 }}>
              <Box sx={{ position: 'relative', mb: 3 }}>
                {/* Month marker */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: { xs: -40, md: -65 }, 
                    top: 0, 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: theme.shadows[3],
                    zIndex: 2
                  }} 
                >
                  <CalendarMonth sx={{ color: 'white', fontSize: 16 }} />
                </Box>
                
                {/* Month/Year heading */}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    ml: { xs: 0, md: 2 }
                  }}
                >
                  {groupedBookings[key].monthYear}
                </Typography>
              </Box>
              
              {/* Events for this month */}
              <Box>
                {groupedBookings[key].bookings.map((booking, index) => (
                  <motion.div
                    key={booking._id || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                  >
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: { xs: 2, md: 3 },
                        mb: 2,
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.8)})`,
                        backdropFilter: 'blur(10px)',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: 5,
                          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }
                      }}
                    >
                      {/* Day marker */}
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          left: { xs: -25, md: -45 }, 
                          top: 20, 
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.primary.main, 0.7),
                          border: `3px solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                          zIndex: 1
                        }} 
                      />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3} md={2}>
                          <Box sx={{ 
                            p: 1.5, 
                            borderRadius: 2, 
                            backgroundColor: alpha(theme.palette.primary.light, 0.1),
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%'
                          }}>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 'bold', 
                                color: theme.palette.primary.main 
                              }}
                            >
                              {booking.date.getDate()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={9} md={10}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                              <Box display="flex" alignItems="center" mb={1}>
                                <Avatar 
                                  sx={{ 
                                    mr: 1.5, 
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main
                                  }}
                                >
                                  <EventIcon eventType={booking.eventType} />
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                                    {booking.event}
                                  </Typography>
                                  <Box display="flex" alignItems="center" mt={0.5} flexWrap="wrap">
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                      <Schedule sx={{ mr: 0.5, fontSize: '0.9rem', opacity: 0.7 }} />
                                      {booking.timing}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Person sx={{ mr: 0.5, fontSize: '0.9rem', opacity: 0.7 }} />
                                      {booking.bookedBy}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              
                              <Box>
                                {booking.important && (
                                  <Chip 
                                    label="Important" 
                                    size="small" 
                                    color="warning" 
                                    icon={<Star fontSize="small" />}
                                    sx={{ mb: 1, height: 24 }}
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt="auto">
                              {booking.location && (
                                <Box display="flex" alignItems="center">
                                  <LocationOn color="action" sx={{ mr: 0.5, opacity: 0.6 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {booking.location}
                                  </Typography>
                                </Box>
                              )}
                              
                              <Button 
                                variant="contained" 
                                size="small" 
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setOpenDialog(true);
                                }}
                                sx={{ 
                                  borderRadius: 8,
                                  px: 2,
                                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
                                  '&:hover': {
                                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                                  },
                                  textTransform: 'none',
                                  fontWeight: 'medium'
                                }}
                              >
                                Details
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
    <Box sx={{ 
      p: isMobile ? 2 : 4,
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
      minHeight: 'auto',
      mb: 12,
      position: 'relative'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ 
          p: isMobile ? 2 : 4, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
          backdropFilter: 'blur(8px)',
          boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.1)}`
        }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={onclose}
                sx={{ 
                  mr: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                <CloseIcon color="primary" />
              </IconButton>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Calendar
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {/* View type toggle */}
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, newView) => newView && setView(newView)}
                aria-label="calendar view"
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.7),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: 3,
                    px: 2
                  }
                }}
              >
                <ToggleButton value="month" aria-label="month view">
                  <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>Month</Typography>
                </ToggleButton>
                <ToggleButton value="timeline" aria-label="timeline view">
                  <ViewDay fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>Timeline</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              
              {view === 'month' && (
                <>
                  {/* Display type toggle */}
                  <ToggleButtonGroup
                    value={calendarView}
                    exclusive
                    onChange={handleCalendarViewChange}
                    aria-label="calendar display"
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 3,
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        borderRadius: 3,
                        px: 2
                      }
                    }}
                  >
                    <ToggleButton value="grid" aria-label="grid view">
                      <ViewModule fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                      <ViewDay fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                  
                  {/* Month navigation */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Previous month">
                      <IconButton 
                        onClick={handlePrevMonth}
                        sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2)
                          }
                        }}
                      >
                        <ArrowBackIos fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h6" mx={2} fontWeight="medium">
                      {new Intl.DateTimeFormat('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      }).format(currentDate)}
                    </Typography>
                    <Tooltip title="Next month">
                      <IconButton 
                        onClick={handleNextMonth}
                        sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2)
                          }
                        }}
                      >
                        <ArrowForwardIos fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
              
              {/* Filter by availability */}
              <Tooltip title={showAvailableOnly ? "Show all dates" : "Show only available dates"}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={toggleAvailableOnly} 
                    sx={{ 
                      backgroundColor: showAvailableOnly 
                        ? alpha(theme.palette.primary.main, 0.1) 
                        : 'transparent'
                    }}
                  >
                    <FilterAlt color={showAvailableOnly ? "primary" : "action"} />
                  </IconButton>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ display: { xs: 'none', md: 'block' } }}
                  >
                    {showAvailableOnly ? "Available only" : "Filter"}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Filter chips for event types */}
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Birthday Party', 'Team Meeting', 'Workshop', 'Sports Event', 'Music Session', 'Movie Night'].map((type) => (
              <Chip 
                key={type}
                label={type}
                icon={<EventIcon eventType={type} size="small" />}
                variant="outlined"
                onClick={() => console.log(`Filter by ${type}`)}
                sx={{ 
                  borderRadius: 8,
                  px: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                  }
                }}
              />
            ))}
          </Box>
          
          {/* Calendar Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : view === 'month' ? (
            <>
              <Grid container spacing={1} mb={2}>
                {/* Day headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <Grid item xs={1.7} key={index}>
                    <Paper elevation={0} sx={{ 
                      p: 1, 
                      textAlign: 'center', 
                      backgroundColor: 'transparent',
                      borderRadius: 2
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {day}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Grid container spacing={1}>
                {renderMonthView()}
              </Grid>
            </>
          ) : view === 'timeline' ? (
            renderTimelineView()
          ) : (
            renderDayView()
          )}
        </Paper>
      </motion.div>
      
      {/* Booking Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              py: 2,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              }
            }}>
              <Box display="flex" alignItems="center">
                <CalendarToday sx={{ mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Event Details
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 3 }}>
              <Box mb={3}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    mr: 2, 
                    bgcolor: 'primary.main',
                    fontSize: '1.75rem',
                    fontWeight: 'bold'
                  }}>
                    {selectedBooking.bookedBy.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedBooking.bookedBy}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedBooking.event}
                    </Typography>
                    {selectedBooking.important && (
                      <Chip 
                        label="Important" 
                        size="small" 
                        color="warning" 
                        icon={<Star fontSize="small" />}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Box>
                
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }}>
                      <Box display="flex" alignItems="center">
                        <CalendarToday color="primary" sx={{ mr: 1.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                          <Typography fontWeight="medium">
                            {new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }}>
                      <Box display="flex" alignItems="center">
                        <Schedule color="primary" sx={{ mr: 1.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                          <Typography fontWeight="medium">{selectedBooking.timing}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }}>
                      <Box display="flex" alignItems="center">
                        <Email color="primary" sx={{ mr: 1.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                          <Typography fontWeight="medium">{selectedBooking.contact}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }}>
                      <Box display="flex" alignItems="center">
                        <EventIcon eventType={selectedBooking.eventType} size="medium" sx={{ mr: 1.5 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Event Type</Typography>
                          <Typography fontWeight="medium">{selectedBooking.eventType}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {selectedBooking.location && (
                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.primary.light, 0.1)
                      }}>
                        <Box display="flex" alignItems="center">
                          <LocationOn color="primary" sx={{ mr: 1.5 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                            <Typography fontWeight="medium">{selectedBooking.location}</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }}>
                      <Box display="flex" alignItems="flex-start">
                        <Notes color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                        <Box width="100%">
                          <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                          <Typography fontWeight="medium" sx={{ whiteSpace: 'pre-line' }}>
                            {selectedBooking.notes || 'No additional notes'}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setOpenDialog(false)} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  mr: 1
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Scroll to top button */}
      {scrolled && (
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Box>

    <SignInFooter/>
    </>
  );
};

export default CalendarAgenda;