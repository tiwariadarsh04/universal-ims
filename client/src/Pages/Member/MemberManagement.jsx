import React, { useEffect, useState, lazy, Suspense } from 'react';
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
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Pagination,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Add,
  ImportExport,
  ViewModule,
  ViewList,
  MoreVert,
  Person,
  Group,
  CheckCircle,
  Cancel,
  Email,
  Phone,
  CalendarToday,
  Star,
  FamilyRestroom,
  WorkspacePremium,
  PersonAdd,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllClubMember } from '../../services/Member';
import ErrorBoundary from '../../helper/ErrorBoundary';
import LoadingScreen from '../../components/Loader/LoadingScreen';
import { wrap } from 'framer-motion';

const MemberCard = lazy(() => import('./MemberCard'));

const MemberManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [members, setMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [isListView, setIsListView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  

  // Fetch all club members
  const getClubMembers = async () => {
    setLoading(true);
    try {
      const res = await getAllClubMember();
      if (res.error) throw new Error(res.error);
      setMembers(res);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClubMembers();
  }, []);

  // Filter, search, and sort logic
  const filteredMembers = members
    .filter((member) => {
      if (filterStatus === 'all') return true;
      return member.MembershipStatus === filterStatus;
    })
    .filter((member) => {
      return member.Name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      return sortOrder === 'a-z' 
        ? a.Name.localeCompare(b.Name)
        : b.Name.localeCompare(a.Name);
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate member statistics
  const memberStats = {
    total: members.length,
    active: members.filter(m => m.MembershipStatus === 'active').length,
    premium: members.filter(m => m.Role === 'premium').length,
    withFamily: members.filter(m => m.FamilyMember && m.FamilyMember.length > 0).length
  };

  const handleMemberUpdate = async (updatedMember) => {
    try {
      setMembers(members.map(m => 
        m._id === updatedMember._id ? updatedMember : m
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const exportMember = () =>{
    console.log("exported")
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 12 }}>
      {/* Header */}
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.light', 
                  color: 'primary.dark',
                  width: 48,
                  height: 48
                }}>
                  <Group />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Members</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {memberStats.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            borderLeft: '4px solid',
            borderColor: 'success.main',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'success.light', 
                  color: 'success.dark',
                  width: 48,
                  height: 48
                }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6">Active Members</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {memberStats.active}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderLeft: '4px solid',
            borderColor: 'info.main',
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'info.light', 
                  color: 'info.dark',
                  width: 48,
                  height: 48
                }}>
                  <FamilyRestroom />
                </Avatar>
                <Box>
                  <Typography variant="h6">With Family</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {memberStats.withFamily}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="a-z">A-Z</MenuItem>
                <MenuItem value="z-a">Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={getClubMembers}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title={isListView ? "Card view" : "List view"}>
              <IconButton onClick={() => setIsListView(!isListView)}>
                {isListView ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/create-member')}
          sx={{
            boxShadow: `0 3px 5px 2px rgba(0, 0, 0, 0.1)`,
          }}
        >
          New Member
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={exportMember}
          startIcon={<ImportExport />}
        >
          Export
        </Button>
      </Box>

      {/* Members List/Cards */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen variant="skeleton" skeletonCount={5} />}>
          {loading ? (
            <LoadingScreen 
              loadingText="Loading members..."
              variant="circular"
              size={40}
              fullScreen={false}
              showPoweredBy={false}
            />
          ) : isListView ? (
            // List View
            <Card elevation={0} sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <List>
                {currentItems.map((member, index) => (
                  <React.Fragment key={member._id || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {member.Name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight="bold">{member.Name}</Typography>
                            {member.Role === 'premium' && (
                              <Chip
                                label="Premium"
                                size="small"
                                color="warning"
                                icon={<Star fontSize="small" />}
                              />
                            )}
                            <Chip
                              label={member.MembershipStatus}
                              size="small"
                              color={member.MembershipStatus === 'active' ? 'success' : 'error'}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{member.Email}</Typography>
                              </Box>
                              {member.Phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Phone fontSize="small" color="action" />
                                  <Typography variant="body2">{member.Phone}</Typography>
                                </Box>
                              )}
                              {member.JoinDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarToday fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {new Date(member.JoinDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            {member.FamilyMember && member.FamilyMember.length > 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                <FamilyRestroom fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {member.FamilyMember.length} family members
                                </Typography>
                              </Box>
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end">
                          <MoreVert />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < currentItems.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          ) : (
            // Card View
            <Grid container spacing={1} sx={{display:'flex',justifyContent:'center', alignItems:'center'}}>
              {currentItems.length > 0 ? (
                currentItems.map((member) => (
                  <Grid key={member._id} sx={{
                    display:'flex',justifyContent:'center', alignItems:'center', gap:2,
                    flexWrap:wrap
                  }}>
                    <MemberCard 
                      user={member} 
                      onEdit={handleMemberUpdate} 
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ 
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}>
                    <Person sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No members found matching your criteria
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setSearchQuery('');
                        setFilterStatus('all');
                        setActiveTab(0);
                      }}
                    >
                      Clear filters
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Suspense>
      </ErrorBoundary>

      {/* Pagination */}
      {filteredMembers.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredMembers.length / itemsPerPage)}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default MemberManagement;