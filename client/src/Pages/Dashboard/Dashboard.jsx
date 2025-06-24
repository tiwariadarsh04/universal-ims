import * as React from "react";
import PropTypes from 'prop-types';
import SalesPurchaseProfitCards from "./SalePurchaseProfitCard";
import MemberOrder from "./MemberOrder";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { 
  Container, 
  TextField, 
  Grid, 
  Paper, 
  Alert, 
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deleteOrder, getMemberOrders, updateOrderStatus } from "../../services/order";
import dayjs from "dayjs";
import { Search, FilterList, Refresh, Info, Wifi, WifiOff, ViewModule, ViewList, CheckCircle, Cancel } from "@mui/icons-material";
import { PieChart } from '@mui/x-charts/PieChart';
import notificationSound from '../../assets/alert.mp3';
import ErrorBoundary from '../../components/Error/ErrorBoundary';
import { ThemeContext } from '../../context/ThemeProvider';

// Constants
const STORAGE_KEYS = {
  VIEW_STYLE: 'dashboard_order_view_style',
  ITEMS_PER_PAGE: 'dashboard_items_per_page',
  STATUS_FILTER: 'dashboard_order_status_filter'
};

const DEFAULT_ITEMS_PER_PAGE = 9;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;
const SSE_ENDPOINT = `${import.meta.env.VITE_NOAIMS_END_POINT_API_DEV}/order/updates`;

// Custom hook for debounced search
const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for order management
const useOrderManagement = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [alert, setAlert] = React.useState({ open: false, severity: 'info', message: '' });

  const getPendingOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMemberOrders();
      if (res?.success) {
        setOrders(res.orders || []);
      } else {
        setError(res?.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOrderUpdate = React.useCallback(async (orderId, status) => {
    try {
      const performedBy = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
      const res = status === 'accepted' 
        ? await updateOrderStatus(performedBy,orderId, 'accepted')
        : await deleteOrder(orderId);

      console.log(res);
      
      if (res?.success) {
        await getPendingOrders();
        return res.message;
      }
      throw new Error(res?.message || 'Operation failed');
    } catch (err) {
      console.error('Order update error:', err);
      setError(err?.message || 'An unknown error occurred');
      return null;
    }
  }, [getPendingOrders]);

  return { orders, setOrders, loading, error, alert, setAlert, getPendingOrders, handleOrderUpdate };
};

// Custom hook for SSE connection with improved error handling
const useOrderUpdates = (onUpdate) => {
  const [connectionStatus, setConnectionStatus] = React.useState({
    isConnected: false,
    error: null,
    reconnectAttempts: 0
  });

  React.useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;
    let reconnectAttempts = 0;

    const connect = () => {
      if (eventSource) {
        eventSource.close();
      }

      try {
        eventSource = new EventSource(SSE_ENDPOINT);
        
        eventSource.onopen = () => {
          console.log('SSE Connection established');
          setConnectionStatus({
            isConnected: true,
            error: null,
            reconnectAttempts: 0
          });
          reconnectAttempts = 0;
        };
        
        const handleEvent = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data?.success) {
              onUpdate(data.orders || []);
            }
          } catch (err) {
            console.error(`Error parsing ${event?.type || 'unknown'} event:`, err);
            setConnectionStatus(prev => ({
              ...prev,
              error: `Error parsing ${event?.type || 'unknown'} data`
            }));
          }
        };

        eventSource.addEventListener('INIT', handleEvent);
        eventSource.addEventListener('UPDATE', handleEvent);
        
        eventSource.onerror = (error) => {
          console.error('SSE Error:', error);
          setConnectionStatus(prev => ({
            isConnected: false,
            error: 'Connection lost',
            reconnectAttempts: reconnectAttempts + 1
          }));
          
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
            
            if (reconnectTimeout) {
              clearTimeout(reconnectTimeout);
            }
            
            reconnectTimeout = setTimeout(() => {
              connect();
            }, RECONNECT_DELAY);
          } else {
            console.error('Max reconnection attempts reached. Stopping SSE connection.');
            setConnectionStatus(prev => ({
              ...prev,
              error: 'Max reconnection attempts reached'
            }));
            if (eventSource) {
              eventSource.close();
            }
          }
        };
      } catch (err) {
        console.error('Error creating SSE connection:', err);
        setConnectionStatus(prev => ({
          isConnected: false,
          error: 'Failed to establish connection',
          reconnectAttempts: reconnectAttempts + 1
        }));
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          reconnectTimeout = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        }
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [onUpdate]);

  return connectionStatus;
};

// Custom hook for audio notifications
const useNotificationSound = () => {
  const [audio] = React.useState(() => {
    if (typeof Audio !== 'undefined') {
      return new Audio(notificationSound);
    }
    return null;
  });

  const playNotification = React.useCallback(() => {
    if (audio) {
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [audio]);

  return playNotification;
};

const Dashboard = () => {
  useDocumentTitle("Dashboard || Noamundi Club");
  
  // Access ThemeContext
  const { isDarkMode } = React.useContext(ThemeContext);
  
  // State initialization with localStorage
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState(() =>{
    const saved = localStorage.getItem(STORAGE_KEYS.STATUS_FILTER);
    return saved ? saved : 'pending';
  });
  const [viewStyle, setViewStyle] = React.useState(() => {
    return localStorage.getItem(STORAGE_KEYS.VIEW_STYLE) || 'card';
  });
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS_PER_PAGE);
    return saved ? parseInt(saved) : DEFAULT_ITEMS_PER_PAGE;
  });

  // Debounced search query
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  
  const playNotification = useNotificationSound();
  const { 
    orders, 
    setOrders,
    loading, 
    error, 
    alert, 
    setAlert, 
    getPendingOrders, 
    handleOrderUpdate 
  } = useOrderManagement();

  // Get SSE connection status
  const connectionStatus = useOrderUpdates(setOrders);

  // Initial data fetch
  React.useEffect(() => {
    getPendingOrders();
  }, [getPendingOrders]);

  // Calculate statistics with memoization
  const { totalOrders, pendingOrders, acceptedOrders, statusDistribution } = React.useMemo(() => 
    orders.reduce((stats, order) => {
      stats.totalOrders++;
      if (order.status === "pending") stats.pendingOrders++;
      if (order.status === "accepted") stats.acceptedOrders++;
      stats.statusDistribution[order.status] = (stats.statusDistribution[order.status] || 0) + 1;
      return stats;
    }, { 
      totalOrders: 0, 
      pendingOrders: 0, 
      acceptedOrders: 0,
      statusDistribution: {} 
    }), [orders]);

  // Prepare pie chart data with memoization
  const pieChartData = React.useMemo(() => 
    Object.entries(statusDistribution).map(([status, count]) => ({
      id: status,
      value: count,
      label: status.charAt(0).toUpperCase() + status.slice(1)
    })), [statusDistribution]);

  // Filter orders with memoization and debounced search
  const filteredOrders = React.useMemo(() => 
    orders.filter(order => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      const matchesSearch = 
        order.MemberName?.toLowerCase().includes(searchLower) ||
        order.MemberID?.MemberID?.toLowerCase().includes(searchLower) ||
        order._id?.toLowerCase().includes(searchLower);
      
      const matchesDate = !selectedDate || dayjs(order.orderDate, "DD/MM/YYYY").isSame(selectedDate, "day");
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesDate && matchesStatus;
    }), [orders, debouncedSearchQuery, selectedDate, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers with useCallback
  const handleSearchChange = React.useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleDateChange = React.useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleClearFilters = React.useCallback(() => {
    setSearchQuery("");
    setSelectedDate(null);
  }, []);

  const handleStatusFilterChange = React.useCallback((status) => {
    setStatusFilter(status);
    localStorage.setItem(STORAGE_KEYS.STATUS_FILTER, status);
  }, []);

  const handleViewStyleChange = React.useCallback((event, newViewStyle) => {
    if (newViewStyle !== null) {
      setViewStyle(newViewStyle);
      localStorage.setItem(STORAGE_KEYS.VIEW_STYLE, newViewStyle);
    }
  }, []);

  const handlePageChange = React.useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleItemsPerPageChange = React.useCallback((event) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setPage(1);
    localStorage.setItem(STORAGE_KEYS.ITEMS_PER_PAGE, newItemsPerPage);
  }, []);

  // Check if we should show the connection indicator
  const showConnectionIndicator = connectionStatus.isConnected || 
    (connectionStatus.error && connectionStatus.reconnectAttempts < 5);

  const renderOrders = () => {
    if (viewStyle === 'card') {
      return (
        <Grid container spacing={3}>
          {paginatedOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <MemberOrder
                MemberID={order.MemberID?.MemberID || "N/A"}
                MemberName={order.MemberName}
                order={order.order}
                orderDate={order.orderDate}
                status={order.status}
                _id={order._id}
                deliveryLocation={`Address: ${order.deliveryLocation} / RoomNo.${order.roomNo}`}
                ordertype={order.orderType}
                handleAcceptOrder={() => {
                  // return console.log(order); 
                  return handleOrderUpdate(order._id, 'accepted');
                }}
                handleRejectOrder={() => handleOrderUpdate(order._id, 'rejected')}
              />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return (
        <List>
          {paginatedOrders.map((order) => {
            const isPending = order.status === 'pending';
            const isAccepted = order.status === 'accepted';
            const isRejected = order.status === 'rejected';

            return (
              <ListItem
                key={order._id}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(30, 30, 40, 0.7)' : 'background.paper',
                  mb: 2,
                  borderRadius: 1,
                  boxShadow: 1,
                  borderLeft: '4px solid',
                  borderColor: isPending ? 'warning.main' : isAccepted ? 'success.main' : 'error.main',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(40, 40, 50, 0.8)' : 'action.hover',
                    transform: 'translateX(4px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'medium' }}>
                        {order.MemberName}
                      </Typography>
                      <Chip
                        label={order.status}
                        color={isPending ? 'warning' : isAccepted ? 'success' : 'error'}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}
                      />
                      <Typography variant="caption" color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                        Order ID: {order._id}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                            <strong>Member ID:</strong> {order.MemberID?.MemberID || "N/A"}
                          </Typography>
                          <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                            <strong>Order Date:</strong> {order.orderDate}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                            <strong>Delivery:</strong> {order.deliveryLocation} / RoomNo.{order.roomNo}
                          </Typography>
                          <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'}>
                            <strong>Order Type:</strong> {order.orderType}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1}>
                    <Tooltip 
                      title={
                        isAccepted 
                          ? "Order already accepted" 
                          : isRejected 
                          ? "Cannot accept a rejected order"
                          : "Accept this order"
                      }
                    >
                      <span>
                        <IconButton
                          edge="end"
                          color="success"
                          onClick={() => handleOrderUpdate(order._id, 'accepted')}
                          disabled={!isPending}
                          sx={{
                            '&.Mui-disabled': {
                              color: 'text.disabled'
                            }
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip 
                      title={
                        isRejected 
                          ? "Order already rejected" 
                          : isAccepted 
                          ? "Cannot reject an accepted order"
                          : "Reject this order"
                      }
                    >
                      <span>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleOrderUpdate(order._id, 'rejected')}
                          disabled={!isPending}
                          sx={{
                            '&.Mui-disabled': {
                              color: 'text.disabled'
                            }
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      );
    }
  };

  return (
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ py: 4, mb: 12 }}>
          {/* Connection Status Indicator */}
          {showConnectionIndicator && (
            <Box sx={{ 
              position: 'fixed',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: isDarkMode ? 'rgba(30, 30, 40, 0.9)' : 'background.paper',
              p: 1,
              borderRadius: 1,
              boxShadow: 1,
              zIndex: 1000
            }}>
              {connectionStatus.isConnected ? (
                <>
                  <Wifi color="success" />
                  <Typography variant="caption" color="success.main">
                    Connected
                  </Typography>
                </>
              ) : (
                <>
                  <WifiOff color="error" />
                  <Typography variant="caption" color="error.main">
                    {connectionStatus.error || 'Disconnected'}
                  </Typography>
                </>
              )}
            </Box>
          )}

          {/* Connection Status Snackbar */}
          <Snackbar
            open={!connectionStatus.isConnected && connectionStatus.error !== null && connectionStatus.reconnectAttempts < 5}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MuiAlert 
              severity="error" 
              variant="filled"
              sx={{ width: '100%' }}
            >
              {connectionStatus.error}
              {connectionStatus.reconnectAttempts > 0 && (
                <Typography variant="caption" display="block">
                  Reconnecting... ({connectionStatus.reconnectAttempts}/5)
                </Typography>
              )}
            </MuiAlert>
          </Snackbar>

          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="body1">
              Manage orders in a snap.
            </Typography>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={getPendingOrders} 
                color="primary"
                aria-label="Refresh orders"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Stats Cards */}
          <SalesPurchaseProfitCards
            totalOrder={totalOrders}
            totalPendingOrder={pendingOrders}
            totalAcceptedOrder={acceptedOrders}
          />

          {/* Filters Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mt: 4,
              borderRadius: 3,
              background: isDarkMode 
                ? 'rgba(30, 30, 40, 0.7)'
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? 'white' : 'inherit'
            }}
            role="search"
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: isDarkMode ? 'rgba(255,255,255,0.7)' : "action.active" }} />,
                  }}
                  variant="outlined"
                  aria-label="Search orders"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : undefined,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'primary.light' : undefined,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? 'white' : undefined,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={10} md={4}>
                <DatePicker
                  label="Filter by date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                          },
                          '&:hover fieldset': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : undefined,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: isDarkMode ? 'primary.light' : undefined,
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? 'white' : undefined,
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                        },
                        '& .MuiSvgIcon-root': {
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                        },
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Clear filters">
                  <IconButton 
                    onClick={handleClearFilters}
                    color="secondary"
                    aria-label="Clear filters"
                  >
                    <FilterList />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label="All Orders"
                      onClick={() => handleStatusFilterChange('all')}
                      color={statusFilter === 'all' ? 'primary' : 'default'}
                      variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label="Pending Orders"
                      onClick={() => handleStatusFilterChange('pending')}
                      color={statusFilter === 'pending' ? 'primary' : 'default'}
                      variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label="Accepted Orders"
                      onClick={() => handleStatusFilterChange('accepted')}
                      color={statusFilter === 'accepted' ? 'primary' : 'default'}
                      variant={statusFilter === 'accepted' ? 'filled' : 'outlined'}
                    />
                  </Stack>
                  <ToggleButtonGroup
                    value={viewStyle}
                    exclusive
                    onChange={handleViewStyleChange}
                    aria-label="view style"
                    size="small"
                  >
                    <Tooltip title="Card View">
                      <ToggleButton value="card" aria-label="card view">
                        <ViewModule />
                      </ToggleButton>
                    </Tooltip>
                    <Tooltip title="List View">
                      <ToggleButton value="list" aria-label="list view">
                        <ViewList />
                      </ToggleButton>
                    </Tooltip>
                  </ToggleButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Visualization */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper 
                id="orderStatusDistribution" 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '400px',
                  bgcolor: isDarkMode ? 'rgba(30, 30, 40, 0.8)' : undefined,
                  color: isDarkMode ? 'white' : 'inherit',
                  border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                }}
                role="region"
                aria-label="Order status distribution"
              >
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Info sx={{ mr: 1, color: isDarkMode ? 'primary.light' : 'primary.main' }} /> Order Status Distribution
                </Typography>
                {pieChartData.length > 0 ? (
                  <Box sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ 
                      height: '250px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <PieChart
                        series={[{
                          data: pieChartData,
                          innerRadius: 40,
                          outerRadius: 80,
                          paddingAngle: 2,
                          cornerRadius: 3,
                          cx: '50%',
                          cy: '50%',
                        }]}
                        width={350}
                        height={250}
                        margin={{ top: 20, bottom: 80, left: 20, right: 20 }}
                        slotProps={{
                          legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            padding: { top: 30 }, 
                            itemMarkWidth: 10,    
                            itemMarkHeight: 10,
                            labelStyle: {
                              fontSize: '0.75rem',
                              fill: isDarkMode ? 'white' : undefined
                            }
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
                      No order data available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper 
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  minHeight: 300,
                  bgcolor: isDarkMode ? 'rgba(30, 30, 40, 0.8)' : undefined,
                  color: isDarkMode ? 'white' : 'inherit',
                  border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                }}
                role="region"
                aria-label="Recent orders"
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Orders ({filteredOrders.length})
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined }}>Items per page</InputLabel>
                      <Select
                        value={itemsPerPage}
                        label="Items per page"
                        onChange={handleItemsPerPageChange}
                        sx={{
                          color: isDarkMode ? 'white' : undefined,
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : undefined,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: isDarkMode ? 'primary.light' : undefined,
                          },
                          '.MuiSvgIcon-root': {
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                          },
                        }}
                      >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : undefined }} />
                
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {!loading && filteredOrders.length === 0 && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    No orders found matching your criteria
                  </Alert>
                )}

                {alert.open && (
                  <Alert 
                    severity={alert.severity} 
                    onClose={() => setAlert(prev => ({...prev, open: false}))}
                    sx={{ mb: 2 }}
                  >
                    {alert.message}
                  </Alert>
                )}

                {renderOrders()}

                {filteredOrders.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: isDarkMode ? 'rgba(255,255,255,0.7)' : undefined,
                        },
                        '& .Mui-selected': {
                          color: isDarkMode ? 'white' : undefined,
                          bgcolor: isDarkMode ? 'rgba(66, 165, 245, 0.2)' : undefined,
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </LocalizationProvider>
    </ErrorBoundary>
  );
};

export default Dashboard;