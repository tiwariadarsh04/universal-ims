import React, { useEffect, useState, useMemo } from 'react';
import CreateAgenda from './CreateAgenda';
import { Button, Container, Dialog } from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import { createAgenda, deleteAgenda, getAgendaList } from '../../services/Agenda';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Paper,
  Divider,
  Tooltip,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  useScrollTrigger,
  Zoom,
  AppBar,
  Toolbar,
  Fab
} from '@mui/material';
import {
  Search,
  FilterList,
  Delete,
  Edit,
  Email,
  CalendarToday,
  Schedule,
  Event,
  Person,
  Notes,
  Refresh,
  KeyboardArrowUp,
  Today,
  Upcoming,
  DoneAll,
  Star,
  LocationOn
} from '@mui/icons-material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10]
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    borderRadius: '12px 12px 0 0',
    background: theme.palette.primary.main
  }
}));

const EventTypeChip = styled(Chip)(({ theme, type = 'Other' }) => {
  const colorMap = {
    'Birthday Party': 'secondary',
    'Corporate Event': 'primary',
    'Wedding': 'error',
    'Conference': 'info',
    'Other': 'default'
  };
  
  const color = colorMap[type] || 'default';
  const paletteColor = theme.palette[color] || theme.palette.default;
  
  return {
    backgroundColor: alpha(paletteColor?.main || theme.palette.grey[300], 0.1),
    color: paletteColor?.main || theme.palette.text.primary,
    fontWeight: 'bold',
    borderRadius: '8px',
    border: `1px solid ${alpha(paletteColor?.main || theme.palette.grey[300], 0.3)}`
  };
});

const HighlightCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  backdropFilter: 'blur(5px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: theme.zIndex.speedDial,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    background: theme.palette.primary.dark,
    transform: 'scale(1.1)'
  }
}));

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const AgendaManagement = () => {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchAgendaList = async () => {
    try {
      setLoading(true);
      const res = await getAgendaList();
      setBookings(res.data || []);
    } catch (error) {
      console.error('Error fetching agenda list:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const createNewAgenda = async (AgendaInfo) => {
    try {
      setCreateLoading(true);
      const res = await createAgenda(AgendaInfo);
      if (res.success) {
        await fetchAgendaList();
        alert("Event created successfully");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error('Error creating agenda:', error);
      alert("Failed to create event");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setDeleteLoading(id);
        const res = await deleteAgenda(id);
        if (res.success) {
          await fetchAgendaList();
        } else {
          alert(res.message);
        }
      } catch (error) {
        console.error('Error deleting agenda:', error);
        alert("Failed to delete event");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleEdit = async(id) =>{
    console.log("edit func")
  }

  useEffect(() => {
    fetchAgendaList();
  }, []);

  const handleRefresh = () => {
    fetchAgendaList();
  };

  const handleSubmit = (bookingData) => {
    createNewAgenda(bookingData);
    setOpen(false);
  };

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter(booking => {
      // Search filter
      const matchesSearch = 
        booking.event?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contact?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Event type filter
      const matchesFilter = filter === 'all' || booking.eventType === filter;
      
      // Tab filter
      const eventDate = new Date(booking.date);
      let matchesTab = true;
      
      switch (tabValue) {
        case 1: // Today
          matchesTab = eventDate.toDateString() === now.toDateString();
          break;
        case 2: // Upcoming
          matchesTab = eventDate > now;
          break;
        case 3: // Important
          matchesTab = booking.important === true;
          break;
        default: // All
          matchesTab = true;
      }
      
      return matchesSearch && matchesFilter && matchesTab;
    });
  }, [bookings, searchTerm, filter, tabValue]);

  const eventTypes = useMemo(() => [...new Set(bookings.map(booking => booking.eventType))], [bookings]);

  // Stats calculations
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: bookings.length,
      upcoming: bookings.filter(event => new Date(event.date) > now).length,
      completed: bookings.filter(event => new Date(event.date) < now).length,
      important: bookings.filter(event => event.important).length
    };
  }, [bookings]);

  return (
    <>
      <Container maxWidth='lg' sx={{ mt: 4, mb:12 }}>
        <Box id="back-to-top-anchor" />
        <Grid container spacing={3} 
          onClick={() => navigate('/application-management')}
          alignItems="center" sx={{ mb: 4, cursor:'pointer' }}
          >
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  width: 24, 
                  height: 24,
                  color: theme.palette.primary.main
                }}>
                  <ArrowBack sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Back to Application Management
                  </Typography>
                </Box>
              </Box>
            </Grid>
        </Grid>

        
        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <HighlightCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                    <Event />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">Total Events</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.total}</Typography>
                  </Box>
                </Box>
              </HighlightCard>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <HighlightCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                    <Upcoming />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">Upcoming</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.upcoming}</Typography>
                  </Box>
                </Box>
              </HighlightCard>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <HighlightCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }}>
                    <DoneAll />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">Completed</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.completed}</Typography>
                  </Box>
                </Box>
              </HighlightCard>
            </motion.div>
          </Grid>
          <Grid item xs={6} md={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <HighlightCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }}>
                    <Star />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" color="text.secondary">Important</Typography>
                    <Typography variant="h4" fontWeight="bold">{stats.important}</Typography>
                  </Box>
                </Box>
              </HighlightCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '16px',
          background: alpha(theme.palette.background.default, 0.7),
          backdropFilter: 'blur(8px)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center',gap:2, mb: 3 }}>
            <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            disabled={createLoading}
            sx={{ 
              borderRadius: '5px',
              boxShadow: 'none',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            {createLoading ? 'Creating...' : 'New Event'}
          </Button>
            <Tooltip title="Refresh">
              <IconButton 
                onClick={handleRefresh} 
                color="primary"
                disabled={loading}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : <Refresh />}
              </IconButton>
            </Tooltip>
          </Box>
          
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="All Events" icon={<Event />} iconPosition="start" />
            <Tab label="Today" icon={<Today />} iconPosition="start" />
            <Tab label="Upcoming" icon={<Upcoming />} iconPosition="start" />
            <Tab label="Important" icon={<Star />} iconPosition="start" />
          </Tabs>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
              sx={{ flexGrow: 1, maxWidth: 500 }}
            />
            
            <TextField
              select
              variant="outlined"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All Event Types</MenuItem>
              {eventTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Paper>
        
        {/* Events Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={0} sx={{ 
              p: 8, 
              textAlign: 'center',
              borderRadius: '16px',
              background: alpha(theme.palette.background.paper, 0.7)
            }}>
              <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
                <img 
                  src="https://img.icons8.com/ios/100/000000/empty-box.png" 
                  alt="No events" 
                  style={{ opacity: 0.7, marginBottom: '16px' }}
                />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No events found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search or create a new event
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setOpen(true)}
                  sx={{ borderRadius: '12px' }}
                >
                  Create Event
                </Button>
              </Box>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {filteredBookings.map((booking) => (
              <Grid item xs={12} sm={6} md={4} key={booking._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyledCard>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5" component="div" fontWeight="bold">
                          {booking.event}
                        </Typography>
                        <EventTypeChip type={booking.eventType} label={booking.eventType} size="small" />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Person color="action" sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body1">
                          {booking.bookedBy}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Email color="action" sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body1">
                          {booking.contact}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <CalendarToday color="action" sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body1">
                          {formatDate(booking.date)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Schedule color="action" sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body1">
                          {booking.timing}
                        </Typography>
                      </Box>
                      
                      {booking.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <LocationOn color="action" sx={{ color: theme.palette.text.secondary }} />
                          <Typography variant="body1">
                            {booking.location}
                          </Typography>
                        </Box>
                      )}
                      
                      {booking.notes && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Notes color="action" sx={{ color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                              {booking.notes}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Box>
                        {booking.important && (
                          <Tooltip title="Important Event">
                            <Star color="warning" />
                          </Tooltip>
                        )}
                      </Box>
                      <Box>
                        {/* <Tooltip title="Edit">
                          <IconButton 
                          aria-label="edit" 
                          onClick={() => handleEdit(booking._id)}
                          disabled={deleteLoading === booking._id}
                          sx={{ mr: 1 }}>
                            <Edit color="primary" />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Delete">
                          <IconButton 
                            aria-label="delete" 
                            onClick={() => handleDelete(booking._id)}
                            disabled={deleteLoading === booking._id}
                          >
                            {deleteLoading === booking._id ? (
                              <CircularProgress size={24} />
                            ) : (
                              <Delete color="error" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </StyledCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px'
            }
          }}
        >
          <CreateAgenda 
            onClose={() => setOpen(false)} 
            onSubmit={handleSubmit} 
            loading={createLoading}
          />
        </Dialog>
        
        <ScrollTop>
          <Fab color="primary" size="medium" aria-label="scroll back to top">
            <KeyboardArrowUp />
          </Fab>
        </ScrollTop>
        
        <Zoom in={!open}>
          <FloatingActionButton 
            color="primary" 
            aria-label="add"
            onClick={() => setOpen(true)}
          >
            <Add />
          </FloatingActionButton>
        </Zoom>
      </Container>
    </>
  )
}

export default AgendaManagement;