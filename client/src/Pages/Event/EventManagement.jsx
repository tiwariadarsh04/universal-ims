import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Avatar,
  Typography,
  Divider,
  Chip,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  useTheme,
  IconButton,
  Tooltip,
  CardActions,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Slide,
  Fade,
  alpha,
  Stack,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  DateRange,
  Event,
  Search,
  Add,
  FilterList,
  Refresh,
  Notifications,
  LocationOn,
  People,
  MoreVert,
  Today,
  CalendarMonth,
  CheckCircle,
  Link as LinkIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  EventNote,
  ArrowUpward,
  ArrowDownward,
  Share as ShareIcon,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, getEventList } from '../../services/Event';

const EventManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // newest first
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAllEventList = async () => {
    setLoading(true);
    try {
      const res = await getEventList();

      if (res.error) {
        console.error("Error fetching events:", res.error);
        return;
      }
      setEvents(res);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEventList();
  }, [flag]);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleFilterStatusChange = (e) => setFilterStatus(e.target.value);
  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // Delete confirmation handlers
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    setDeleteLoading(true);
    try {
      const res = await deleteEvent(eventToDelete._id);
      if (res.success) {
        // Remove event from state
        setEvents(events.filter(e => e._id !== eventToDelete._id));
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      setFlag(!flag); // Trigger refetch
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.EventName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.EventDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesTab = 
      activeTab === 0 || 
      (activeTab === 1 && event.status === 'active') || 
      (activeTab === 2 && event.status !== 'active');
    
    return matchesSearch && matchesStatus && matchesTab;
  }).sort((a, b) => {
    // Sort by date
    const dateA = new Date(a.EventDate);
    const dateB = new Date(b.EventDate);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats calculations
  const activeEventsCount = events.filter(e => e.status === 'active').length;
  const upcomingEventsCount = events.filter(e => new Date(e.EventDate) > new Date()).length;
  const newThisMonthCount = events.filter(e => {
    const eventDate = new Date(e.createdAt);
    const now = new Date();
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 12, px: { xs: 2, sm: 3 } }}>
      {/* Page Header */}
      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', mb: 2 }}>
      <Grid container spacing={3} 
          onClick={() => navigate('/application-management')}
          alignItems="center" sx={{  cursor:'pointer' }}
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
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('create')}
          startIcon={<Add />}
          size={isMobile ? "medium" : "large"}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            px: 3,
            py: 1,
            boxShadow: theme.shadows[3],
            borderRadius: '6px'
          }}
        >
          Create
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} lg={3}>
          <Fade in={!loading} timeout={800}>
          <Card sx={{ 
              p: 2,
              height: '100%',
              borderRadius: '10px',
              boxShadow: theme.shadows[1],
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
                transform: 'translateY(-4px)'
              }
          }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Active Events
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {loading ? <Skeleton width={60} /> : activeEventsCount}
                    </Typography>
                  </Box>
                <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.2), 
                    color: theme.palette.success.main,
                    width: 56,
                    height: 56
                }}>
                    <Today fontSize="large" />
                </Avatar>
                </Box>
                
                {!loading && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
                    <Typography variant="body2" color={activeEventsCount > 0 ? "success.main" : "text.secondary"}>
                      {activeEventsCount > 0 
                        ? `${((activeEventsCount/events.length)*100).toFixed(0)}% of your events are active`
                        : 'No active events'}
                    </Typography>
              </Box>
                )}
            </CardContent>
          </Card>
          </Fade>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Fade in={!loading} timeout={900}>
          <Card sx={{ 
              p: 2,
              height: '100%',
              borderRadius: '10px',
              boxShadow: theme.shadows[1],
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
                transform: 'translateY(-4px)'
              }
          }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Events
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {loading ? <Skeleton width={60} /> : events.length}
                    </Typography>
                  </Box>
                <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.2), 
                    color: theme.palette.info.main,
                    width: 56,
                    height: 56
                }}>
                    <Event fontSize="large" />
                </Avatar>
                </Box>
                
                {!loading && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
                    <Typography variant="body2" color="text.secondary">
                      {events.length > 0 
                        ? `From ${formatDate(new Date(Math.min(...events.map(e => new Date(e.createdAt))))).split(',')[0]}`
                        : 'No events yet'}
                    </Typography>
              </Box>
                )}
            </CardContent>
          </Card>
          </Fade>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Fade in={!loading} timeout={1000}>
          <Card sx={{ 
              p: 2,
              height: '100%',
              borderRadius: '10px',
              boxShadow: theme.shadows[1],
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
                transform: 'translateY(-4px)'
              }
          }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Upcoming Events
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {loading ? <Skeleton width={60} /> : upcomingEventsCount}
                    </Typography>
                  </Box>
                <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.2), 
                    color: theme.palette.warning.main,
                    width: 56,
                    height: 56
                }}>
                    <CalendarMonth fontSize="large" />
                </Avatar>
                </Box>
                
                {!loading && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
                    <Typography variant="body2" color={upcomingEventsCount > 0 ? "warning.main" : "text.secondary"}>
                      {upcomingEventsCount > 0 
                        ? `${upcomingEventsCount} event${upcomingEventsCount !== 1 ? 's' : ''} in the future`
                        : 'No upcoming events'}
                    </Typography>
              </Box>
                )}
            </CardContent>
          </Card>
          </Fade>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Fade in={!loading} timeout={1100}>
          <Card sx={{ 
              p: 2,
              height: '100%',
              borderRadius: '10px',
              boxShadow: theme.shadows[1],
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[3],
                transform: 'translateY(-4px)'
              }
          }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      New This Month
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {loading ? <Skeleton width={60} /> : newThisMonthCount}
                    </Typography>
                  </Box>
                <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.2), 
                    color: theme.palette.primary.main,
                    width: 56,
                    height: 56
                }}>
                    <Notifications fontSize="large" />
                </Avatar>
                </Box>
                
                {!loading && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
                    <Typography variant="body2" color={newThisMonthCount > 0 ? "primary.main" : "text.secondary"}>
                      {newThisMonthCount > 0 
                        ? `${newThisMonthCount} new addition${newThisMonthCount !== 1 ? 's' : ''} this month`
                        : 'No new events this month'}
                    </Typography>
              </Box>
                )}
            </CardContent>
          </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Tabs and Filters */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: '8px',
        overflow: 'visible',
        boxShadow: theme.shadows[2]
      }}>
        <Box sx={{ 
          borderBottom: 1, 
        borderColor: 'divider',
          bgcolor: alpha(theme.palette.background.paper, 0.6)
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ 
              px: 2, 
              '& .MuiTab-root': {
                py: 2,
                minHeight: '64px',
                fontWeight: 500
              } 
            }}
          >
            <Tab icon={<CalendarMonth />} label="All Events" iconPosition="start" />
            <Tab icon={<Today />} label="Active" iconPosition="start" />
            <Tab icon={<CheckCircle />} label="Inactive" iconPosition="start" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
            <TextField
              fullWidth
                placeholder="Search events by name or description..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
                size="medium"
            />
          </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="medium">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                label="Filter by Status"
                startAdornment={
                  <FilterList sx={{ color: "action.active", mr: 1 }} />
                }
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={sortOrder === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                onClick={handleSortOrderChange}
                sx={{ textTransform: 'none', borderRadius: '6px' }}
              >
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </Button>
              
              <Tooltip title="Refresh Events">
                <IconButton 
                  onClick={() => { 
                    setFlag(!flag);
                    fetchAllEventList();
                  }}
                  color="primary"
                  sx={{ ml: 1 }}
                >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Events List */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: theme.shadows[2]
              }}>
                <Skeleton variant="rectangular" height={140} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="70%" height={30} />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="text" width="80%" />
                  <Divider sx={{ my: 2 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="50%" />
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Skeleton variant="rounded" width={60} height={36} />
                  <Skeleton variant="rounded" width={60} height={36} sx={{ ml: 1 }} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents.map((event, index) => (
            <Grid item xs={12} md={6} lg={4} key={event._id}>
              <Fade in={true} timeout={300 + (index * 100)}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[5],
                    transform: 'translateY(-4px)'
                  }
                }}>
                  {/* Status indicator */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '4px',
                      bgcolor: event.status === 'active' ? theme.palette.success.main : theme.palette.grey[500]
                    }} 
                  />
                  
                  {event.EventPoster ? (
                  <CardMedia
                    component="img"
                      height={160}
                      image={`${import.meta.env.VITE_APP_POSTER_URL}/${event.EventPoster}`}
                    alt={event.EventName}
                      sx={{ objectFit: 'cover' }}
                  />
                  ) : (
                    <Box sx={{ 
                      height: 120, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    }}>
                      <EventIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.6) }} />
                    </Box>
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                    <Chip
                      label={event.status === 'active' ? 'Active' : 'Inactive'}
                      color={event.status === 'active' ? 'success' : 'default'}
                      size="small"
                        icon={event.status === 'active' ? <Today fontSize="small" /> : <CheckCircle fontSize="small" />}
                        sx={{ borderRadius: '4px' }}
                      />
                      
                      <Stack direction="row" spacing={0.5}>
                      
                        <Tooltip title="Delete Event">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(event)}
                          >
                            <DeleteIcon fontSize="small" />
                    </IconButton>
                        </Tooltip>
                      </Stack>
                  </Box>
                  
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                    {event.EventName}
                  </Typography>
                  
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                    {event.EventDescription}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <CalendarMonth sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { sm: 1 } }}>
                        <span style={{ fontWeight: 500 }}>{formatDate(event.EventDate)}</span>
                        {event.EventTime && (
                          <span style={{ color: theme.palette.text.secondary }}>
                            at {formatTime(event.EventTime)}
                          </span>
                        )}
                    </Typography>
                  </Box>
                  
                    {event.EventVenues && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <LocationOn sx={{ color: theme.palette.error.main, fontSize: 20 }} />
                    <Typography variant="body2">
                      {event.EventVenues}
                    </Typography>
                  </Box>
                    )}
                  
                  {event.LinkToRegister && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LinkIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={event.LinkToRegister} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: theme.palette.info.main,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Registration Link
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      startIcon={<ShareIcon />}
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: event.EventName,
                            text: event.EventDescription,
                            url: event.LinkToRegister || window.location.href
                          });
                        }
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Share
                    </Button>
                </CardActions>
              </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredEvents.length === 0 && (
        <Fade in={true} timeout={500}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6,
          textAlign: 'center',
              borderRadius: '8px',
              border: '1px dashed',
              borderColor: alpha(theme.palette.divider, 0.6),
              bgcolor: alpha(theme.palette.background.paper, 0.6)
            }}
          >
            <Event sx={{ fontSize: 80, color: alpha(theme.palette.action.disabled, 0.5), mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '500px', mx: 'auto' }}>
              {searchQuery 
                ? `We couldn't find any events matching "${searchQuery}"`
                : 'There are no events matching your current filters'}
          </Typography>
          <Button 
              variant="contained" 
            color="primary" 
              sx={{ mt: 2, mr: 2, borderRadius: '6px' }}
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setActiveTab(0);
            }}
          >
            Clear filters
          </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('create')}
              startIcon={<Add />}
              sx={{ mt: 2, borderRadius: '6px' }}
            >
              Create New Event
            </Button>
        </Paper>
        </Fade>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the event "{eventToDelete?.EventName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleDeleteCancel} 
            color="inherit"
            disabled={deleteLoading}
            sx={{ borderRadius: '6px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            autoFocus
            sx={{ borderRadius: '6px' }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventManagement;