import React, { useState, useEffect, useRef } from "react";
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Box,
  Grid,
  Container,
  Button,
  Modal,
  Stack,
  Avatar,
  Divider,
  Badge,
  Tabs,
  Tab,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
  alpha,
  Fab,
  Zoom,
  CircularProgress,
  LinearProgress,
  AvatarGroup,
  Slide,
  Fade,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Pagination,
  useMediaQuery
} from "@mui/material";
import {
  PersonAdd,
  Person,
  AdminPanelSettings,
  EditNote,
  PointOfSale,
  Search,
  FilterList,
  Refresh,
  MoreVert,
  Lock,
  LocationOn,
  Fingerprint,
  Email,
  KeyboardArrowUp,
  CheckCircle,
  Block,
  Delete,
  Group,
  VerifiedUser,
  Close,
  ArrowBack
} from "@mui/icons-material";
import { createApplicationUser, deleteApplicationUser, getApplicationUsers } from "../../services/Auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Styled components using motion
const AnimatedCard = motion(Card);
const AnimatedItem = motion.div;

// Role colors and icons
const roleConfig = {
  superadmin: { color: "error", icon: <AdminPanelSettings /> },
  admin: { color: "warning", icon: <AdminPanelSettings /> },
  editor: { color: "info", icon: <EditNote /> },
  cashier: { color: "success", icon: <PointOfSale /> }
};

// Permission colors
const permissionColors = {
  read: "primary",
  write: "success",
  update: "warning",
  delete: "error",
};

const countRoles = (users) => {
  return users.reduce((acc, user) => {
    const role = user.roles;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
};

const ApplicationUserManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    roles: "cashier",
    allowed_device_fingerprint: "",
    allowed_latitude: "",
    allowed_longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const handleDeleteUser = async (targatedUserId) => {
    const userInfo = localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const res = await deleteApplicationUser(userInfo,targatedUserId);
    
    alert(res.message || "User deleted successfully");

    fetchUsers()
  };

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

  const roleCounts = countRoles(users);

  // Stats cards data
  const stats = [
    { role: "superadmin", count: roleCounts.superadmin || 0, ...roleConfig.superadmin, description: "Full system control" },
    { role: "admin", count: roleCounts.admin || 0, ...roleConfig.admin, description: "Administrative access" },
    { role: "editor", count: roleCounts.editor || 0, ...roleConfig.editor, description: "Content management" },
    { role: "cashier", count: roleCounts.cashier || 0, ...roleConfig.cashier, description: "Transaction processing" },
  ];


  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
    const res = await getApplicationUsers();
    if (res.success && res.user) {
      setUsers(res.user); 
    } else {
      console.log(res.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                        user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchText.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.roles === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Modal handlers
  const handleCreateUser = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      roles: "cashier",
      allowed_device_fingerprint: "",
      allowed_latitude: "",
      allowed_longitude: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await createApplicationUser(formData);
      if (!response || response.error) {
        return alert(response.message || "Failed to create user");
      }
      alert(response.message);
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message || "Server error");
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 12 }}>
      <Box sx={{ p: { xs: 0, sm: 2 } }}>
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

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUser}
                startIcon={<PersonAdd />}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: '6px',
                  boxShadow: theme.shadows[4],
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                }}
              >
                New User
              </Button>
            </Box>
          </Grid>
        </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={stat.role}>
              <Fade in={!loading} timeout={500 + (index * 200)}>
                <AnimatedCard
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  sx={{ 
                    position: 'relative',
                    height: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6],
                      transition: 'all 0.3s ease'
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '4px',
                      width: '100%',
                      backgroundColor: theme.palette[stat.color].main
                    }
                  }}
                >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                        bgcolor: alpha(theme.palette[stat.color].main, 0.1), 
                        color: theme.palette[stat.color].main,
                        width: 50,
                        height: 50
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                          {loading ? <CircularProgress size={24} /> : stat.count}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {stat.role}s
                    </Typography>
                  </Box>
                </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {stat.description}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stat.count > 0 ? (stat.count / users.length) * 100 : 0}
                      color={stat.color}
                      sx={{ height: 4, borderRadius: '4px', mt: 2 }}
                    />
              </CardContent>
                </AnimatedCard>
              </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Action Bar */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: '8px',
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        bgcolor: 'background.paper'
      }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
            <TextField
              fullWidth
                placeholder="Search by username, name or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
              }}
              variant="outlined"
                size="small"
            />
          </Grid>
            <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList color="action" />
                    </InputAdornment>
                  ),
              }}
                size="small"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </TextField>
          </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Tooltip title="Refresh User List">
            <Button
                  variant="outlined"
              color="primary"
                  onClick={fetchUsers}
                  startIcon={<Refresh />}
                  size="small"
                  sx={{ borderRadius: '6px' }}
            >
                  Refresh
            </Button>
              </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* User Table */}
        {loading ? (
          <Card sx={{ position: 'relative', minHeight: 400, borderRadius: '8px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, flexDirection: 'column', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Loading users data...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main
            }}>
              <Person fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom>No users found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchText 
                ? `No users matching "${searchText}"` 
                : roleFilter !== 'all' 
                  ? `No users with ${roleFilter} role found`
                  : 'There are no users in the system'}
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={() => {
                setSearchText('');
                setRoleFilter('all');
              }}
              sx={{ borderRadius: '6px' }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          <>
            {/* Column Headers - Sticky Top */}
            <Paper 
              elevation={1}
          sx={{
                mb: 2, 
                borderRadius: '8px',
                p: 2,
                display: { xs: 'none', md: 'block' }, // Hide on mobile
                position: 'sticky',
                top: 0,
                zIndex: 5,
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(8px)'
              }}
            >
              <Grid container alignItems="center" sx={{ px: 2, py: 1 }}>
                <Grid item xs={4} md={3.5}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.secondary">User</Typography>
                </Grid>
                <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.secondary">Role</Typography>
                </Grid>
                <Grid item xs={4} md={4.5}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.secondary">Permissions</Typography>
                </Grid>
                <Grid item xs={2} md={2} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="600" color="text.secondary">Actions</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            {/* User Cards */}
            <Stack spacing={3}>
              {/* Paginate the filtered users here */}
              {filteredUsers
                .slice((page - 1) * 10, page * 10)
                .map((user, index) => (
                <AnimatedCard
                  key={user._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  elevation={0}
                  sx={{
                    borderRadius: '8px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      borderColor: 'transparent',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    {/* Desktop View */}
                    <Box sx={{ 
                      p: 3, 
                      display: { xs: 'none', md: 'block' },
                      bgcolor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.primary.main, 0.03)
                    }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item md={3.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 50, 
                              height: 50,
                              bgcolor: alpha(theme.palette.primary.main, 0.8),
                              color: theme.palette.primary.contrastText,
                              fontWeight: 'bold',
                              boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`
                            }}>
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box sx={{ overflow: 'hidden' }}>
                              <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                                {user.username || 'Unnamed User'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ 
                                display: 'block', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                maxWidth: '200px'
                              }}>
                                {user.email || 'No email'}
                              </Typography>
                              {user.name && (
                                <Typography variant="caption" color="text.primary">
                                  {user.name}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item md={2} sx={{ textAlign: 'center' }}>
                          <Chip
                            icon={roleConfig[user.roles]?.icon}
                            label={user.roles}
                            color={roleConfig[user.roles]?.color}
                            variant="filled"
                            sx={{ 
                              fontWeight: "500", 
                              textTransform: 'capitalize',
                              minWidth: '120px',
                              height: 36,
                              borderRadius: '4px',
                              '& .MuiChip-label': {
                                px: 1.5,
                                fontSize: '0.85rem'
                              },
                              '& .MuiChip-icon': {
                                ml: 1,
                                fontSize: '1.2rem'
                              }
                            }}
                          />
                        </Grid>
                        
                        <Grid item md={4.5}>
                          <Box sx={{ 
                            display: "flex", 
                            gap: 1.2, 
                            flexWrap: "wrap",
                            maxWidth: '100%'
                          }}>
                            {user.permissions?.map((permission) => (
                              <Chip
                                key={permission}
                                label={permission}
                                color={permissionColors[permission]}
                                variant="outlined"
                                size="small"
                                sx={{
                                  textTransform: 'capitalize',
                                  borderWidth: 1.5,
                                  height: 32,
                                  borderRadius: '4px',
                                  '& .MuiChip-label': {
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: '0.8rem',
                                    fontWeight: 500
                                  }
                                }}
                              />
                            ))}
                            {(!user.permissions || user.permissions.length === 0) && (
                              <Typography variant="body2" color="text.secondary">
                                No specific permissions
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        
                        <Grid item md={2} sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2,
                            justifyContent: 'center'
                          }}>
                            <Tooltip title="Edit User">
                              <IconButton 
                                size="medium" 
                                color="primary"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  p: 1.5,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                  }
                                }}
                              >
                                <EditNote sx={{ fontSize: '1.2rem' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton 
                                size="medium" 
                                color="error"
                                onClick={() => handleDeleteUser(user._id)}
                                sx={{ 
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  p: 1.5,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.error.main, 0.2),
                                  }
                                }}
                              >
                                <Delete sx={{ fontSize: '1.2rem' }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    {/* Mobile View */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                      <Box sx={{ 
                        p: 2, 
            display: 'flex', 
                        justifyContent: 'space-between',
            alignItems: 'center',
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 50, 
                            height: 50,
                            bgcolor: alpha(theme.palette.primary.main, 0.8),
                            color: theme.palette.primary.contrastText,
                          }}>
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="600">
                              {user.username || 'Unnamed User'}
          </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.name || 'No name provided'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Chip
                          icon={roleConfig[user.roles]?.icon}
                          label={user.roles}
                          color={roleConfig[user.roles]?.color}
                          variant="filled"
                          size="small"
                          sx={{ textTransform: 'capitalize', borderRadius: '4px' }}
                        />
                      </Box>
                      
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Permissions:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                          {user.permissions?.map((permission) => (
                            <Chip
                              key={permission}
                              label={permission}
                              color={permissionColors[permission]}
                              variant="outlined"
                              size="small"
                              sx={{ textTransform: 'capitalize', borderRadius: '4px' }}
                            />
                          ))}
                          {(!user.permissions || user.permissions.length === 0) && (
                            <Typography variant="body2" color="text.secondary">
                              No specific permissions
                            </Typography>
                          )}
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                          pt: 2,
                          borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary">
                              <EditNote fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </AnimatedCard>
              ))}
            </Stack>
            
            {/* Pagination */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center', 
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`
            }}>
              <Typography variant="body2" color="text.secondary">
                Showing {Math.min(10, filteredUsers.slice((page - 1) * 10, page * 10).length)} of {filteredUsers.length} users
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Pagination
                  count={Math.ceil(filteredUsers.length / 10)}
                  page={page}
                  onChange={(e, newPage) => setPage(newPage)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  size={isMobile ? "small" : "medium"}
                  sx={{ '& .MuiPaginationItem-root': { borderRadius: '4px' } }}
                />
              </Stack>
            </Box>
          </>
        )}

        {/* User stats summary */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 2,
          gap: 2 
        }}>
          <Typography variant="body2" color="text.secondary">
            Total Users: {users.length}
          </Typography>
          <Chip 
            label={`Showing ${filteredUsers.length} users`} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ borderRadius: '4px' }}
          />
          {roleFilter !== 'all' && (
            <Chip 
              label={`Filter: ${roleFilter}`}
              size="small"
              color={roleConfig[roleFilter]?.color || 'default'}
              onDelete={() => setRoleFilter('all')}
              sx={{ borderRadius: '4px' }}
            />
          )}
        </Box>

        {/* Create New User Modal */}
        <Dialog 
          open={openModal} 
          onClose={handleCloseModal}
          maxWidth="md"
          PaperProps={{
            elevation: 24,
            sx: {
              borderRadius: '8px',
              overflow: 'hidden',
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonAdd />
              </Avatar>
              <Typography variant="h5">Create New User</Typography>
            </Box>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                    margin="normal"
                value={formData.username.toLowerCase()}
                onChange={handleInputChange}
                InputProps={{
                      startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
                }}
              />

              <TextField
                label="Name"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleInputChange}
                InputProps={{
                      startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
                }}
              />
                
              <TextField
                label="Email"
                name="email"
                    type="email"
                variant="outlined"
                fullWidth
                    margin="normal"
                value={formData.email}
                onChange={handleInputChange}
                InputProps={{
                      startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                }}
              />
            
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                    margin="normal"
                value={formData.password}
                onChange={handleInputChange}
                InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                }}
                    helperText="Create a strong password with at least 8 characters"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Role"
                name="roles"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.roles}
                onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">
                        {roleConfig[formData.roles]?.icon || <VerifiedUser color="action" />}
                      </InputAdornment>,
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: { maxHeight: 300 }
                        }
                      }
                    }}
              >
              <MenuItem value="superadmin">Superadmin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </TextField>
                
              <TextField
                label="Phone Number"
                name="phoneNumber"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />

            {formData.roles === "superadmin" && (
                  <Fade in={formData.roles === "superadmin"}>
                    <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: '6px' }}>
                      <Typography variant="subtitle2" color="warning.main" gutterBottom>
                        Security Restrictions
                      </Typography>
                      
                  <TextField
                    label="Allowed Device Fingerprint"
                    name="allowed_device_fingerprint"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.allowed_device_fingerprint}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: <InputAdornment position="start"><Fingerprint color="action" /></InputAdornment>,
                    }}
                    size="small"
                    helperText="Specific device identifier for restricted access"
                  />
                
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <TextField
                    label="Latitude"
                    name="allowed_latitude"
                    variant="outlined"
                    fullWidth
                    value={formData.allowed_latitude}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: <InputAdornment position="start"><LocationOn color="action" /></InputAdornment>,
                    }}
                    size="small"
                  />
                  <TextField
                    label="Longitude"
                    name="allowed_longitude"
                    variant="outlined"
                    fullWidth
                    value={formData.allowed_longitude}
                    onChange={handleInputChange}
                    InputProps={{
                    startAdornment: <InputAdornment position="start"><LocationOn color="action" /></InputAdornment>,
                    }}
                    size="small"
                  />
                </Box>
                </Box>
              </Fade>
            )}
            
                {/* Role description card */}
                <Card 
                  variant="outlined" 
                  sx={{ 
                    mt: 3,
                    bgcolor: alpha(theme.palette[roleConfig[formData.roles]?.color || 'primary'].main, 0.05),
                    border: `1px solid ${alpha(theme.palette[roleConfig[formData.roles]?.color || 'primary'].main, 0.2)}`,
                    borderRadius: '6px'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: alpha(theme.palette[roleConfig[formData.roles]?.color || 'primary'].main, 0.2),
                        color: theme.palette[roleConfig[formData.roles]?.color || 'primary'].main
                      }}>
                        {roleConfig[formData.roles]?.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {formData.roles} Role
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.roles === 'superadmin' && 'Complete system access with all permissions'}
                          {formData.roles === 'admin' && 'Administrative access with most permissions'}
                          {formData.roles === 'editor' && 'Can edit and manage content but has limited administrative access'}
                          {formData.roles === 'cashier' && 'Limited access for transaction processing only'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseModal}
              startIcon={<Close />}
              sx={{ borderRadius: '6px' }}
            >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
              startIcon={<CheckCircle />}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: '6px'
                }}
              >
                Create User
              </Button>
          </DialogActions>
        </Dialog>
      </Box>
      
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

export default ApplicationUserManager;