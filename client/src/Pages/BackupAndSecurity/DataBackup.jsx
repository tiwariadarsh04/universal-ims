import React, { useState, useEffect } from 'react';
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
  TextField,
  Button,
  Grid,
  Paper,
  Collapse,
  Tooltip,
  Container,
  useTheme,
  alpha,
  CircularProgress,
  LinearProgress,
  Pagination,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Badge,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Backup,
  Delete,
  ExpandMore,
  ExpandLess,
  Search,
  Refresh,
  CloudDownload,
  Add,
  Warning,
  CheckCircle,
  Error,
  Storage,
  DataUsage,
  CalendarToday,
  FilterList,
  KeyboardArrowUp,
  CloudUpload,
  Schedule,
  MoreVert,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { backupFileList, createNewDBBackup } from '../../services/DataSecurity';

// Styled components
const StatsCard = styled(Paper)(({ theme, color = 'primary' }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  position: 'relative',
  overflow: 'hidden',
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

const BackupStatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: '6px',
  fontWeight: 600,
  backgroundColor: status === 'success' 
    ? alpha(theme.palette.success.main, 0.1) 
    : alpha(theme.palette.warning.main, 0.1),
  color: status === 'success' 
    ? theme.palette.success.main 
    : theme.palette.warning.main
}));

const BackupManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedBackup, setExpandedBackup] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const fetchBackups = async () => {
      setLoading(true);
      try {
        const res = await backupFileList();

        console.log(res)
        setBackups(res?.backups);
      } catch (error) {
        console.error('Error fetching backups:', error);
      } finally {
        setLoading(false);
      }
    };
  

  useEffect(() => {
    fetchBackups();
    
    // Scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered backups
  const filteredBackups = backups.filter(backup => {
    // Status filter
    if (filter !== 'all' && backup.status !== filter) return false;
    
    // Date filter
    const backupDate = parseISO(backup.created);
    const now = new Date();
    
    if (dateFilter === 'today' && !(backupDate.getDate() === now.getDate() && 
        backupDate.getMonth() === now.getMonth() && 
        backupDate.getFullYear() === now.getFullYear())) {
      return false;
    }
    if (dateFilter === 'week' && !(backupDate > new Date(now.setDate(now.getDate() - 7)))) {
      return false;
    }
    if (dateFilter === 'month' && !(backupDate > new Date(now.setDate(now.getDate() - 30)))) {
      return false;
    }
    
    // Search query
    if (searchQuery && !backup.filename.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBackups.length / itemsPerPage);
  const paginatedBackups = filteredBackups.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Stats
  const totalBackups = backups.length;
  const successBackups = backups.filter(b => b.status === 'success').length;
  const totalSizeMB = backups.reduce((sum, b) => sum + parseFloat(b.sizeMB), 0);

  // Handlers
  const handleCreateBackup = async () => {
    const res = await createNewDBBackup();
    fetchBackups();
  };

  const handleDeleteBackup = (backup) => {
    setBackupToDelete(backup);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    // Implement delete functionality
    console.log('Deleting backup:', backupToDelete);
    setConfirmDialogOpen(false);
  };

  const toggleExpand = (id) => {
    setExpandedBackup(expandedBackup === id ? null : id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 12 }}>
      <Box sx={{ p: { xs: 0, sm: 2 } }}>
        {/* Header */}
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{cursor:'pointer'}} onClick={() => navigate(-1)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                width: 34, 
                height: 34,
                color: theme.palette.primary.main
              }}>
                <ArrowBack sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="caption" color="text.primary">
                  Back to Application Management
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleCreateBackup}
                sx={{ borderRadius: '8px' }}
              >
                Create Backup
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{ borderRadius: '8px' }}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={4}>
            <StatsCard color="primary">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Backups
                </Typography>
                <Avatar sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  color: theme.palette.primary.main 
                }}>
                  <DataUsage />
                </Avatar>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                {backups?.length}
              </Typography>
              
              <LinearProgress 
                variant="determinate" 
                value={(successBackups / totalBackups) * 100} 
                color="primary"
                sx={{ height: 6, borderRadius: '3px', mb: 1 }}
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${successBackups} successful`} 
                  size="small" 
                  color="success"
                  variant="outlined"
                />
              </Box>
            </StatsCard>
          </Grid>
          
          <Grid item xs={6} md={4}>
            <StatsCard color="info">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Storage Usage
                </Typography>
                <Avatar sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.1), 
                  color: theme.palette.info.main 
                }}>
                  <Storage />
                </Avatar>
              </Box>
              
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                {totalSizeMB.toFixed(2)} MB
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((totalSizeMB / 100) * 100, 100)} // Assuming 100MB max for demo
                  color="info"
                  sx={{ height: 6, borderRadius: '3px', flex: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.min((totalSizeMB / 100) * 100, 100).toFixed(0)}%
                </Typography>
              </Box>
            </StatsCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatsCard color="secondary">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Auto Backup
                </Typography>
                <Avatar sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                  color: theme.palette.secondary.main 
                }}>
                  <Schedule />
                </Avatar>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {autoBackupEnabled ? 'Active' : 'Inactive'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next backup: {autoBackupEnabled ? 'Tonight at 2 AM' : 'Disabled'}
                  </Typography>
                </Box>
                
                <Switch
                  checked={autoBackupEnabled}
                  onChange={() => setAutoBackupEnabled(!autoBackupEnabled)}
                  color="secondary"
                />
              </Box>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                size="small" 
                sx={{ mt: 2, borderRadius: '6px' }}
              >
                Configure Schedule
              </Button>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search backups..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ borderRadius: '8px' }}
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Status"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="success">Successful</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Date Range"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                sx={{ borderRadius: '8px' }}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Backup List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredBackups.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: alpha(theme.palette.info.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}>
              <Backup sx={{ fontSize: 40, color: theme.palette.info.main }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              No backups found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filter !== 'all' 
                ? `No backups match your current filters.` 
                : searchQuery 
                  ? `No results matching "${searchQuery}"`
                  : 'No backups have been created yet.'}
            </Typography>
            <Button 
              variant="contained"
              onClick={handleCreateBackup}
              startIcon={<Add />}
              sx={{ borderRadius: '8px' }}
            >
              Create First Backup
            </Button>
          </Paper>
        ) : (
          <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <List>
              {paginatedBackups.map((backup) => (
                <motion.div
                  key={backup.filename}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem
                    sx={{
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.03)
                      }
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Download">
                          <IconButton 
                            edge="end" 
                            onClick={() => window.open(backup.downloadUrl, '_blank')}
                            sx={{ borderRadius: '6px' }}
                          >
                            <CloudDownload />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton 
                            edge="end" 
                            onClick={() => handleDeleteBackup(backup)}
                            sx={{ borderRadius: '6px' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        
                        <IconButton 
                          edge="end" 
                          onClick={() => toggleExpand(backup.filename)}
                          sx={{ borderRadius: '6px' }}
                        >
                          {expandedBackup === backup.filename ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main
                      }}>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {backup.filename}
                          </Typography>
                          <BackupStatusChip 
                            label="Successful" 
                            status="success"
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {backup.sizeMB} MB
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDistanceToNow(parseISO(backup.created), { addSuffix: true })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(parseISO(backup.created), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  <Collapse in={expandedBackup === backup.filename} timeout="auto" unmountOnExit>
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: alpha(theme.palette.background.default, 0.5),
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Backup Details
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                                Filename:
                              </Typography>
                              <Typography variant="body2">
                                {backup.filename}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                                Size:
                              </Typography>
                              <Typography variant="body2">
                                {backup.sizeMB} MB ({backup.size} bytes)
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                                Created:
                              </Typography>
                              <Typography variant="body2">
                                {format(parseISO(backup.created), 'MMMM d, yyyy h:mm:ss a')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                                Modified:
                              </Typography>
                              <Typography variant="body2">
                                {format(parseISO(backup.modified), 'MMMM d, yyyy h:mm:ss a')}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            File Information
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                                Path:
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {backup.absolutePath}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                                Download:
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {backup.downloadUrl}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<CloudDownload />}
                              onClick={() => window.open(backup.downloadUrl, '_blank')}
                              sx={{ borderRadius: '6px' }}
                            >
                              Download
                            </Button>
                            
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<CloudUpload />}
                              sx={{ borderRadius: '6px' }}
                            >
                              Restore
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </motion.div>
              ))}
            </List>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                p: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  sx={{ '& .MuiPaginationItem-root': { borderRadius: '6px' } }}
                />
              </Box>
            )}
          </Card>
        )}
        
        {/* Stats indicator */}
        {filteredBackups.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
            Showing {paginatedBackups.length} of {filteredBackups.length} backups
          </Typography>
        )}
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Delete Backup
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete backup <strong>{backupToDelete?.filename}</strong>? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            sx={{ borderRadius: '6px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: '6px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Scroll to top button */}
      <Fab
        color="primary"
        size="medium"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: showScrollTop ? 'flex' : 'none',
          borderRadius: '8px'
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Container>
  );
};

export default BackupManagementPage;