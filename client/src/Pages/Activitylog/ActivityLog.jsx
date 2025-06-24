import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Paper,
  Collapse,
  Badge,
  Tooltip,
  Container,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
  Grow,
  Zoom,
  Slide,
  Switch,
  Stack,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AvatarGroup,
  LinearProgress,
  useMediaQuery,
  Skeleton,
  Pagination,
  PaginationItem,
  Fab
} from '@mui/material';
import {
  FilterList,
  Delete,
  ExpandMore,
  ExpandLess,
  Search,
  Refresh,
  Event,
  Person,
  Receipt,
  Add,
  Edit,
  Delete as DeleteIcon,
  Timeline,
  BarChart,
  ViewDay,
  ViewWeek,
  Insights,
  History,
  AccessTime,
  Notifications,
  DataUsage,
  CalendarViewMonth,
  MoreHoriz,
  PlaylistAddCheck,
  NotificationsActive,
  TrendingUp,
  Info,
  Warning,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowUp,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { activityLogDetails, clearAllActivity } from '../../services/Activity';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Helper functions
const getActionColor = (action) => {
  switch (action) {
    case 'create':
      return 'success';
    case 'update':
      return 'primary';
    case 'delete':
      return 'error';
    default:
      return 'info';
  }
};

const getActionIcon = (action) => {
  switch (action) {
    case 'create':
      return <Add fontSize="small" />;
    case 'update':
      return <Edit fontSize="small" />;
    case 'delete':
      return <DeleteIcon fontSize="small" />;
    default:
      return <Info fontSize="small" />;
  }
};

// Custom styled components
const TimelineDot = styled(Box)(({ theme, color = 'primary' }) => ({
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: theme.palette[color].main,
  boxShadow: `0 0 0 4px ${alpha(theme.palette[color].main, 0.2)}`,
  marginRight: 16,
  flexShrink: 0,
  position: 'relative',
  zIndex: 1
}));

const TimelineLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 8,
  top: 0,
  bottom: 0,
  width: 2,
  backgroundColor: alpha(theme.palette.divider, 0.3),
  zIndex: 0
}));

const TimelineDay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: '6px',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const AnimatedCard = styled(motion.div)({
  width: '100%',
  position: 'relative'
});

const StatsCard = styled(Paper)(({ theme, color = 'primary' }) => ({
  padding: theme.spacing(3),
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: theme.palette[color].main
  }
}));

const ActivityLogPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'
  const [timeGroup, setTimeGroup] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  
  // Add pagination state variables
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  
  // Add state for scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const open = Boolean(anchorEl);
  const listRef = useRef(null);
  const pageTopRef = useRef(null);

  const refreshData = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const getActivityLogData = async() => {
      try {
        const res = await activityLogDetails();
        if(res.success){
          setActivities(res.data || []);
        } else {
          console.log(res);
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    getActivityLogData();
  }, [refreshKey]);
  
  // Add scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (selectedFilter) => {
    if (selectedFilter) {
    setFilter(selectedFilter);
    }
    setAnchorEl(null);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleClearLogs = async() => {
    setConfirmDialogOpen(false);
    setLoading(true);
    
    try {
    const userInfo = JSON.parse(localStorage.getItem('user'));    
    const res = await clearAllActivity(userInfo);
    alert(res.message || "Logs cleared successfully");
      if (res.success) {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error clearing logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    
    // Scroll back to top when changing pages
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modify the filteredActivities logic to include pagination
  const filteredActivities = activities.filter(activity => {
    // Filter by action type
    if (filter !== 'all' && activity.action !== filter) return false;
    
    // Filter by search query
    if (searchQuery && 
        !(activity.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.performedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  // Get paginated activities
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Group activities by date for timeline view - modify to use paginatedActivities
  const groupedActivities = () => {
    if (!timeGroup) return { 'All Activities': paginatedActivities };
    
    return paginatedActivities.reduce((groups, activity) => {
      const date = new Date(activity.createdAt);
      let groupName;
      
      if (isToday(date)) {
        groupName = 'Today';
      } else if (isYesterday(date)) {
        groupName = 'Yesterday';
      } else if (isThisWeek(date)) {
        groupName = 'This Week';
      } else if (isThisMonth(date)) {
        groupName = 'This Month';
      } else {
        groupName = 'Earlier';
      }
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push(activity);
      return groups;
    }, {});
  };

  // Calculate statistics
  const todayActivities = activities.filter(activity => isToday(new Date(activity.createdAt))).length;
  const userSet = new Set(activities.map(activity => activity.performedBy?._id).filter(Boolean));
  const activeUsers = userSet.size;

  // Calculate action type distribution for stats
  const createCount = activities.filter(a => a.action === 'create').length;
  const updateCount = activities.filter(a => a.action === 'update').length;
  const deleteCount = activities.filter(a => a.action === 'delete').length;
  
  const actionDistribution = [
    { type: 'Created', count: createCount, color: theme.palette.success.main },
    { type: 'Updated', count: updateCount, color: theme.palette.primary.main },
    { type: 'Deleted', count: deleteCount, color: theme.palette.error.main }
  ];

  // Animation variants for list items
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 12 }}>
      <Box sx={{ p: { xs: 0, sm: 2 } }}>
        {/* Header */}
        {/* Header */}
        <Grid container spacing={3} 
        alignItems="center" sx={{ mb: 4, cursor:'pointer' }}
        >
          <Grid item xs={12} md={6} onClick={() => navigate('/application-management')}>
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
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                width: 56, 
                height: 56,
                color: theme.palette.primary.main
              }}>
                <History sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  Activity Log
                </Typography>
                <Typography variant="body2" color="text.secondary">
            Track all transaction modifications in real-time
          </Typography>
              </Box>
            </Box>
        </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                borderRadius: '6px', 
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-end' }
              }}
            >
          <TextField
            size="small"
            placeholder="Search activities..."
            InputProps={{
                  startAdornment: <Search fontSize="small" sx={{ mr: 1, color: alpha(theme.palette.text.primary, 0.5) }} />
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              />
              
              <ButtonGroup variant="outlined" size="small">
                <Button
                  variant={filter === 'all' ? "contained" : "outlined"}
                  onClick={() => setFilter('all')}
                  sx={{ borderRadius: '6px' }}
                >
                  All
                </Button>
          <Button
                  variant={filter === 'create' ? "contained" : "outlined"}
                  color="success"
                  onClick={() => setFilter('create')}
                  sx={{ borderRadius: '6px' }}
                >
                  Created
          </Button>
                <Button
                  variant={filter === 'update' ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setFilter('update')}
                  sx={{ borderRadius: '6px' }}
                >
                  Updated
                </Button>
          <Button
                  variant={filter === 'delete' ? "contained" : "outlined"}
            color="error"
                  onClick={() => setFilter('delete')}
                  sx={{ borderRadius: '6px' }}
          >
                  Deleted
          </Button>
              </ButtonGroup>
            </Paper>
          </Grid>
        </Grid>

        {/* View Controls */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={viewMode === 'timeline' ? "contained" : "outlined"}
                onClick={() => setViewMode('timeline')}
                startIcon={<Timeline />}
                sx={{ borderRadius: '6px' }}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'list' ? "contained" : "outlined"}
                onClick={() => setViewMode('list')}
                startIcon={<ViewDay />}
                sx={{ borderRadius: '6px' }}
              >
                List
              </Button>
            </ButtonGroup>
            
            {viewMode === 'timeline' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">Group by time</Typography>
                <Switch
                  checked={timeGroup}
                  onChange={(e) => setTimeGroup(e.target.checked)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh activities">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<Refresh />}
                onClick={refreshData}
                sx={{ borderRadius: '6px' }}
              >
                Refresh
              </Button>
            </Tooltip>
            
            <Tooltip title="Clear all activity logs">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => setConfirmDialogOpen(true)}
                sx={{ borderRadius: '6px' }}
              >
                Clear Logs
              </Button>
            </Tooltip>
          </Box>
        </Box>

      {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
            <Fade in={!loading} timeout={500}>
              <StatsCard color="primary">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Total Activities
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                    <DataUsage />
                  </Avatar>
                </Box>
                
                <Typography variant="h3" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {loading ? <Skeleton width={60} /> : activities.length}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    {actionDistribution.map((item) => (
                      <Box 
                        key={item.type} 
                        sx={{ 
                          flex: item.count, 
                          height: 8, 
                          bgcolor: item.color,
                          borderRadius: 1
                        }}
                      />
                    ))}
                  </Stack>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {actionDistribution.map((item) => (
                      <Chip 
                        key={item.type}
                        label={`${item.type}: ${item.count}`}
                        size="small"
                        sx={{ 
                          bgcolor: alpha(item.color, 0.1),
                          color: item.color,
                          borderColor: item.color,
                          border: '1px solid'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </StatsCard>
            </Fade>
        </Grid>
          
        <Grid item xs={12} md={4}>
            <Fade in={!loading} timeout={700}>
              <StatsCard color="success">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Today's Activities
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>
                    <CalendarViewMonth />
                  </Avatar>
                </Box>
                
                <Typography variant="h3" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {loading ? <Skeleton width={60} /> : todayActivities}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={todayActivities > 0 ? (todayActivities / activities.length) * 100 : 0} 
            color="success"
                    sx={{ height: 8, borderRadius: '4px', mb: 1 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary">
                    {todayActivities > 0 
                      ? `${Math.round((todayActivities / activities.length) * 100)}% of total activity`
                      : 'No activities today'}
                  </Typography>
                </Box>
              </StatsCard>
            </Fade>
        </Grid>
          
        <Grid item xs={12} md={4}>
            <Fade in={!loading} timeout={900}>
              <StatsCard color="info">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Active Users
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                    <Person />
                  </Avatar>
                </Box>
                
                <Typography variant="h3" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
                  {loading ? <Skeleton width={60} /> : activeUsers}
                </Typography>
                
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14 } }}>
                    {Array.from(userSet).map((userId, index) => (
                      <Avatar key={userId || index} sx={{ bgcolor: theme.palette.primary.main }}>
                        {userId ? userId.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  
                  <Chip 
                    icon={<TrendingUp fontSize="small" />}
                    label="Active" 
                    color="info"
                    size="small"
                    variant="outlined"
          />
                </Box>
              </StatsCard>
            </Fade>
          </Grid>
        </Grid>

        {/* Activity Timeline/List */}
        {loading ? (
          <Card sx={{ position: 'relative', minHeight: 400 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, flexDirection: 'column', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Loading activity logs...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : filteredActivities.length === 0 ? (
          <Card sx={{ borderRadius: '8px', overflow: 'hidden' }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: alpha(theme.palette.info.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Notifications sx={{ fontSize: 40, color: theme.palette.info.main }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                No activity logs found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {filter !== 'all' 
                  ? `No "${filter}" actions in the activity log.` 
                  : searchQuery 
                    ? `No results matching "${searchQuery}"`
                    : 'There are no activity logs to display.'}
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                startIcon={<Refresh />}
                sx={{ borderRadius: '6px' }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'timeline' ? (
          <Card 
            ref={listRef}
            sx={{ 
              position: 'relative', 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: { xs: 1, sm: 3 } }}>
              {Object.entries(groupedActivities()).map(([groupName, groupActivities], groupIndex) => (
                <Box key={groupName} sx={{ mb: 4 }}>
                  {timeGroup && (
                    <TimelineDay>
                      <AccessTime fontSize="small" color="primary" />
                      <Typography variant="subtitle1" color="text.primary" fontWeight={500}>
                        {groupName}
                      </Typography>
                      <Chip 
                        label={`${groupActivities.length} ${groupActivities.length === 1 ? 'activity' : 'activities'}`} 
                        size="small"
                        variant="outlined"
                      />
                    </TimelineDay>
                  )}
                  
                  <Box sx={{ position: 'relative' }}>
                    {/* Timeline vertical line */}
                    <TimelineLine />
                    
                    {/* Timeline items */}
                    {groupActivities.map((activity, index) => (
                      <AnimatedCard
                        key={activity._id || index}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05 
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            mb: 3,
                            position: 'relative'
                          }}
                        >
                          <TimelineDot color={getActionColor(activity.action)} />
                          
                          <Card sx={{ 
                            flex: 1, 
                            borderRadius: '8px', 
                            boxShadow: theme.shadows[1],
                            overflow: 'hidden',
                            border: `1px solid ${alpha(theme.palette[getActionColor(activity.action)].main, 0.2)}`
                          }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 32, 
                                      height: 32,
                                      bgcolor: alpha(theme.palette[getActionColor(activity.action)].main, 0.1),
                                      color: theme.palette[getActionColor(activity.action)].main 
                                    }}
                                  >
                                    {activity?.performedBy?.avatar || activity?.performedBy?.name?.charAt(0) || 'U'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {activity?.performedBy?.name || 'Unknown User'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {activity.performedBy?._id || 'User ID not available'}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                  <Chip
                                    size="small"
                                    icon={getActionIcon(activity.action)}
                                    label={activity.action}
                                    color={getActionColor(activity.action)}
                                    sx={{ 
                                      borderRadius: '4px', 
                                      textTransform: 'capitalize',
                                      mb: 0.5
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDistanceToNow(new Date(activity?.createdAt), { addSuffix: true })}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: alpha(theme.palette.background.default, 0.5), mt: 1, borderRadius: '6px' }}>
                                <Typography variant="body2">
                                  {activity.action === 'create' && 'Created a new transaction'}
                                  {activity.action === 'update' && 'Updated a transaction'}
                                  {activity.action === 'delete' && 'Deleted a transaction'}
                                  {' with invoice '}
                                  <Typography component="span" fontWeight={500} color={getActionColor(activity.action)}>
                                    {activity.invoiceNumber}
                                  </Typography>
                                </Typography>
                              </Paper>
                              
                              {activity.changes && (
                                <Box sx={{ mt: 1.5 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Changes:
                                    </Typography>
                                    <IconButton 
                                      onClick={() => toggleExpand(activity._id)}
                                      size="small"
                                    >
                                      {expandedItems.includes(activity._id) ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                    </IconButton>
                                  </Box>
                                  
                                  <Collapse in={expandedItems.includes(activity._id)} timeout="auto">
                                    <Box sx={{ 
                                      p: 1.5, 
                                      borderRadius: '6px',
                                      bgcolor: alpha(theme.palette.background.default, 0.7),
                                      border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`
                                    }}>
                                      <ChangesDiff changes={activity.changes} action={activity.action} />
                                    </Box>
                                  </Collapse>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Box>
                      </AnimatedCard>
                    ))}
                  </Box>
                </Box>
              ))}
              
              {/* Add Pagination */}
              {totalPages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  pt: 2,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                }}>
                  <Pagination
                    page={page}
                    count={totalPages}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    size={isMobile ? "small" : "medium"}
                    sx={{ '& .MuiPaginationItem-root': { borderRadius: '4px' } }}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{ previous: ChevronLeft, next: ChevronRight }}
                        {...item}
                      />
                    )}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ borderRadius: '8px' }}>
        <CardContent>
            <List sx={{ width: '100%' }}>
                {paginatedActivities.map((activity, index) => (
                  <AnimatedCard
                    key={activity._id || index}
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05 
                    }}
                  >
                <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 1
                    }}>
                        <Tooltip title={activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}>
                        <Chip
                            size="small"
                            icon={getActionIcon(activity.action)}
                            label={activity.action}
                            color={getActionColor(activity.action)}
                            variant="outlined"
                            sx={{
                            ml: 1,
                            borderRadius: '4px',
                            borderWidth: 2,
                            borderColor: `${getActionColor(activity.action)}.main`
                            }}
                        />
                        </Tooltip>
                        <Chip
                        size="small"
                            icon={<AccessTime fontSize="small" />}
                            label={formatDistanceToNow(new Date(activity?.createdAt), { addSuffix: true })}
                        variant="outlined"
                        color="default"
                        sx={{
                            backgroundColor: 'background.paper',
                            borderColor: 'divider',
                            borderRadius: '4px'
                        }}
                        />
                    </Box>
                    }
                >
                    <ListItemAvatar>
                    <Avatar 
                        sx={{ 
                        bgcolor: `${getActionColor(activity.action)}.light`,
                        color: `${getActionColor(activity.action)}.dark`
                        }}
                    >
                          {activity?.performedBy?.avatar || activity?.performedBy?.name?.charAt(0) || 'U'}
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary={
                        <Typography variant="body1" component="div">
                        <Box component="span" fontWeight="bold">
                              {activity?.performedBy?.name || 'Unknown User'}
                        </Box>
                        {' '}
                        {activity.action === 'create' && 'created a new transaction'}
                        {activity.action === 'update' && 'updated a transaction'}
                        {activity.action === 'delete' && 'deleted a transaction'}
                        {' '}
                        <Box component="span" color="primary.main" fontWeight="500">
                            {activity.invoiceNumber}
                        </Box>
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" color="text.secondary">
                            {activity.performedBy?._id || 'User ID not available'}
                        </Typography>
                    }
                    sx={{ pr: 2 }}
                    />
                    {activity.changes && (
                    <IconButton 
                          onClick={() => toggleExpand(activity._id)}
                        sx={{ alignSelf: 'center' }}
                    >
                          {expandedItems.includes(activity._id) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    )}
                </ListItem>
                {activity.changes && (
                      <Collapse in={expandedItems.includes(activity._id)} timeout="auto" unmountOnExit>
                    <Box sx={{ 
                        pl: 9, 
                        pr: 4, 
                        pb: 2,
                          backgroundColor: alpha(theme.palette.action.hover, 0.5),
                        borderRadius: '6px',
                        mx: 2,
                        mt: -1,
                        mb: 1
                    }}>
                        <Typography variant="subtitle2" gutterBottom>
                        Changes:
                        </Typography>
                        <ChangesDiff changes={activity.changes} action={activity.action} />
                    </Box>
                    </Collapse>
                )}
                    <Divider variant="inset" component="li" sx={{ my: 0.5 }} />
                  </AnimatedCard>
            ))}
            </List>
              
              {/* Add Pagination */}
              {totalPages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  pt: 3,
                  mt: 2,
                  borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Page {page} of {totalPages}
                    </Typography>
                    <Pagination
                      page={page}
                      count={totalPages}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                      size={isMobile ? "small" : "medium"}
                      sx={{ '& .MuiPaginationItem-root': { borderRadius: '4px' } }}
                      renderItem={(item) => (
                        <PaginationItem
                          components={{ previous: ChevronLeft, next: ChevronRight }}
                          {...item}
                        />
                      )}
                    />
                  </Box>
                </Box>
              )}
        </CardContent>
        </Card>
        )}
        
        {/* Stats indicator for pagination */}
        {filteredActivities.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            mt: 2,
            gap: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min(paginatedActivities.length, itemsPerPage)} of {filteredActivities.length} activities
            </Typography>
            <Chip 
              label={`Page ${page}/${totalPages}`} 
              size="small" 
              variant="outlined"
              color="primary"
              sx={{ borderRadius: '4px' }}
            />
          </Box>
        )}
    </Box>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Clear Activity Logs
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to clear all activity logs? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit" sx={{ borderRadius: '6px' }}>
            Cancel
          </Button>
          <Button onClick={handleClearLogs} color="error" variant="contained" autoFocus sx={{ borderRadius: '6px' }}>
            Clear All Logs
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Scroll to top button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: theme.shadows[4],
            borderRadius: '8px'
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Container>
  );
};

const ChangesDiff = ({ changes, action }) => {
  const theme = useTheme();
  
  if (!changes) return null;
  
  if (action === 'update' && changes.old && changes.new) {
  return (
        <Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '6px', 
          bgcolor: alpha(theme.palette.error.main, 0.05),
          border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
          mb: 1
        }}>
          <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DeleteIcon fontSize="small" />
            <strong>Previous:</strong> Amount: ${changes.old.amount}, 
            Items: {changes.old.items?.join(', ') || 'None'}
          </Typography>
        </Box>
        
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '6px', 
          bgcolor: alpha(theme.palette.success.main, 0.05),
          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
        }}>
          <Typography variant="body2" color="success" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Add fontSize="small" />
            <strong>Updated to:</strong> Amount: ${changes.new.amount}, 
            Items: {changes.new.items?.join(', ') || 'None'}
          </Typography>
        </Box>
      </Box>
    );
  } else if (action === 'delete' && changes.deletedTransaction) {
    return (
      <Box sx={{ 
        p: 1.5, 
        borderRadius: '6px', 
        bgcolor: alpha(theme.palette.error.main, 0.05),
        border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
      }}>
        <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DeleteIcon fontSize="small" />
          <strong>Deleted transaction:</strong> Amount: ${changes.deletedTransaction.amount}, 
          Items: {changes.deletedTransaction.items?.join(', ') || 'None'}
        </Typography>
      </Box>
    );
  }
  
  return null;
};

export default ActivityLogPage;