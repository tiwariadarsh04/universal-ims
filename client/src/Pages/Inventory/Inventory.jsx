import React, { useEffect, useState, useCallback, useMemo,Suspense } from "react";
import {
  Container,
  Grid,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  Avatar,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Skeleton,
  Tooltip,
  styled,
  keyframes,
  alpha
} from "@mui/material";
import {
  Search,
  Inventory2,
  Equalizer,
  FileDownload,
  Add,
  FilterList,
  Category,
  CheckCircle,
  Warning,
  Edit,
  Delete,
  ArrowBack,
  Refresh
} from "@mui/icons-material";
import { PieChart } from '@mui/x-charts/PieChart';
import { deleteInventoryItem, fetchInventoryItems, updateInventoryItem } from "../../services/Inventory";
import * as XLSX from "xlsx";
import ErrorBoundary from "../../helper/ErrorBoundary";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../services/Auth";
import { useSnackbar } from "notistack";
import { AlertDialog, ConfirmDialog } from "../../components/Dialog";
import ThreeDotOption from "../../components/utils/ThreeDotOption";

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 8,
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8) 
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  padding: theme.spacing(2),
  borderRadius: 10,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8) 
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
}));

const InventoryPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterParty, setFilterParty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    inStock: 0,
    outOfStock: 0,
    categoryDistribution: []
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      if (filterParty !== "All" && item.ItemGroup !== Number(filterParty)) return false;
      if (filterStatus !== "All" && (item.UnitQty > 0 ? "In stock" : "Out of stock") !== filterStatus) return false;
      if (searchQuery && !item.ItemName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [inventoryData, filterParty, filterStatus, searchQuery]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Fetch inventory items with loading state
  const getInventoryItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchInventoryItems();
      if (res.error) throw new Error(res.error);
      if (res && res.data) {
        setInventoryData(res.data);
        calculateStats(res.data);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getInventoryItems();
    setIsRefreshing(false);
  };

  // Calculate statistics
  const calculateStats = useCallback((data) => {
    const inStockCount = data.filter(item => item.UnitQty > 0).length;
    const categoryDist = data.reduce((acc, item) => {
      const group = getCategoryName(item.ItemGroup);
      const existing = acc.find(cat => cat.label === group);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ label: group, value: 1 });
      }
      return acc;
    }, []);

    setStats({
      totalItems: data.length,
      inStock: inStockCount,
      outOfStock: data.length - inStockCount,
      categoryDistribution: categoryDist
    });
  }, []);

  // Map category codes to names
  const getCategoryName = useCallback((code) => {
    switch(code) {
      case 5: return "Kitchen";
      case 3: return "Bar";
      case 6: return "Snacks";
      case 54: return "Misc";
      default: return "Other";
    }
  }, []);

  useEffect(() => {
    getInventoryItems();
  }, [getInventoryItems]);

  // Handle filter changes
  const handleFilterPartyChange = (event) => {
    setFilterParty(event.target.value);
    setPage(0);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  // Export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "Inventory_Data.xlsx");
  };

  // Handle delete inventory item
  const handleDeleteInventoryItem = async (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    
    setIsDeleting(true);
    try {
    const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (!localUser) throw new Error('User not found');

      const checkRole = await getUserRole(localUser.username);
      if (!checkRole.success || !checkRole.userRole) throw new Error(checkRole.message);

      const res = await deleteInventoryItem(selectedItem.ItemCode, checkRole.userRole);
      if (!res.success) throw new Error(res.message);

      enqueueSnackbar('Item deleted successfully!', { variant: 'success' });
        getInventoryItems();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  // Enhanced Table Row Component
  const EnhancedTableRow = ({ item }) => {
    const navigate = useNavigate();
    const handleEdit = () => {
      setCurrentEditItem(item);
      setEditModalOpen(true);
    };

    const handleDelete = () => {
      handleDeleteInventoryItem(item);
    };

    const handleItemClick = () => {
      navigate(`/inventory/item/${item.ItemCode}`, { state: { item } });
    };

    return (
      <StyledTableRow hover>
        <StyledTableCell>
          <Chip 
            label={item.ItemCode} 
            size="small" 
            variant="outlined" 
            color={item.UnitQty > 0 ? "success" : "error"}
            sx={{ borderRadius: 4 }}
          />
        </StyledTableCell>
        <StyledTableCell>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={handleItemClick}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 32, height: 32 }}>
              <Inventory2 fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body1">{item.ItemName}</Typography>
              <Typography variant="caption" color="textSecondary">
                {getCategoryName(item.ItemGroup)} - ({item.ItemGroup})
              </Typography>
            </Box>
          </Box>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography fontWeight="medium">
            ₹{item.Rate.toFixed(2)} 
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography fontWeight="medium">₹{item.IssueRate.toFixed(2)}</Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Chip
            label={`${item.gstPercentage}%`}
            size="small"
            color={item.gstPercentage > 12 ? "error" : "success"}
            sx={{ borderRadius: 4 }}
          />
        </StyledTableCell>
        <StyledTableCell align="right">
          <ThreeDotOption handleEdit={handleEdit} handleDelete={handleDelete} />
        </StyledTableCell>
      </StyledTableRow>
    );
  };

  // Loading Skeletons
  const LoadingSkeleton = () => (
    <StyledTableRow>
      {[...Array(6)].map((_, index) => (
        <StyledTableCell key={index}>
          <Skeleton animation="wave" height={40} />
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );

  return (
    <Container maxWidth="lg" sx={{ mb: 12, mt: 0 }}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, visibility: 'hidden'  }}>
            <Inventory2 color="primary"/>
            Inventory Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {stats.totalItems} items • {stats.inStock} in stock • {stats.outOfStock} out of stock
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('create-single')}
            sx={{ mr: 2, borderRadius: 6 }}
          >
            Add Item
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={exportToExcel}
            sx={{ mr: 2, borderRadius: 6 }}
          >
            Export
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={isRefreshing}>
              <Refresh className={isRefreshing ? 'spin' : ''} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Items
                </Typography>
                <Inventory2 color="primary" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {isLoading ? <Skeleton width={60} /> : stats.totalItems}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  In Stock
                </Typography>
                <CheckCircle color="success" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {isLoading ? <Skeleton width={60} /> : stats.inStock}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Out of Stock
                </Typography>
                <Warning color="error" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {isLoading ? <Skeleton width={60} /> : stats.outOfStock}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Categories
                </Typography>
                <Category color="warning" />
              </Box>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {isLoading ? <Skeleton width={60} /> : Object.keys(stats.categoryDistribution).length}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filters and Chart */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList /> Filters
            </Typography>
            <TextField
              fullWidth
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "action.active" }} />,
              }}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select value={filterParty} onChange={handleFilterPartyChange} label="Category">
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="3">Bar - Alcohol</MenuItem>
                <MenuItem value="5">Kitchen</MenuItem>
                <MenuItem value="6">Snacks</MenuItem>
                <MenuItem value="54">Others</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} onChange={handleFilterStatusChange} label="Status">
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="In stock">In stock</MenuItem>
                <MenuItem value="Out of stock">Out of stock</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Equalizer /> Category Distribution
            </Typography>
            <Box 
              sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
              {isLoading ? (
                <Skeleton variant="circular" width={200} height={200} />
              ) : (
                  <PieChart
                  series={[{
                    data: stats.categoryDistribution,
                    innerRadius: 40,
                    outerRadius: 80,
                    paddingAngle: 2,
                    cornerRadius: 3,
                    cx: '50%',
                    cy: '50%',
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  }]}
                width={400}
                height={200}
              />
              )}
            </Box>
          </StyledPaper>
        </Grid>

        {/* Inventory Table */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                        <StyledTableCell> </StyledTableCell>
                        <StyledTableCell>Item Details</StyledTableCell>
                        <StyledTableCell align="left">Cost Price</StyledTableCell>
                        <StyledTableCell align="left">Sell Price</StyledTableCell>
                        <StyledTableCell align="left">GST</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      {isLoading ? (
                        [...Array(5)].map((_, index) => <LoadingSkeleton key={index} />)
                      ) : (
                        paginatedData.map((item,index) => (
                        <EnhancedTableRow key={index} item={item} />
                        ))
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                  count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </Suspense>
          </ErrorBoundary>
          </StyledPaper>
      </Grid>
      </Grid>

      {/* Edit Modal */}
      <EditInventoryModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        item={currentEditItem}
        refreshData={getInventoryItems}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Inventory Item"
        message={`Are you sure you want to delete "${selectedItem?.ItemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        summaryData={selectedItem ? {
          'Item Code': selectedItem.ItemCode,
          'Category': getCategoryName(selectedItem.ItemGroup),
          'Current Stock': selectedItem.UnitQty,
          'Price': `₹${selectedItem.Rate.toFixed(2)}`
        } : null}
      />
    </Container>
  );
};

// Edit Modal Component
const EditInventoryModal = ({ open, handleClose, item, refreshData }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ open: false, title: '', message: '', severity: 'info' });
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    if (item) {
      setFormData({
        ItemName: item.ItemName,
        ItemGroup: item.ItemGroup,
        UnitQty: item.UnitQty,
        Rate: item.Rate,
        IssueRate: item.IssueRate,
        gstPercentage: item.gstPercentage
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ItemGroup' || name === 'gstPercentage' 
        ? Number(value) 
        : name === 'UnitQty' || name === 'Rate' || name === 'IssueRate'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateInventoryItem(item.ItemCode, formData);

      if (response.error) {
        throw new Error(response.error);
      }
      
      setAlertDialog({
        open: true,
        title: 'Success',
        message: 'Item updated successfully!',
        severity: 'success'
      });
      
      refreshData();
      handleClose();
    } catch (error) {
      setAlertDialog({
        open: true,
        title: 'Error',
        message: error.message,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
            background: theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mt: 2,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          py: 3,
          px: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
          <Box sx={{ 
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Edit sx={{ fontSize: 28, color: theme.palette.primary.main }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              mb: 0.5
            }}>
              Edit Inventory Item
      </Typography>
            <Typography variant="caption" color="text.secondary">
              {item?.ItemCode}
        </Typography>
      </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ mb: 2, mt: 4 }}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="ItemName"
                  value={formData.ItemName || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: { 
                      borderRadius: 6,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 0.8)
                          : alpha(theme.palette.background.paper, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 1)
                          : alpha(theme.palette.background.paper, 1),
                        boxShadow: theme.shadows[4]
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="UnitQty"
                  type="number"
                  value={formData.UnitQty || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0 }}
                  InputProps={{
                    sx: { 
                      borderRadius: 6,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 0.8)
                          : alpha(theme.palette.background.paper, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 1)
                          : alpha(theme.palette.background.paper, 1),
                        boxShadow: theme.shadows[4]
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="ItemGroup"
                    value={formData.ItemGroup || ''}
                    onChange={handleChange}
                    label="Category"
                    required
                    variant="outlined"
                    sx={{ 
                      borderRadius: 6,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 0.8)
                          : alpha(theme.palette.background.paper, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 1)
                          : alpha(theme.palette.background.paper, 1),
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <MenuItem value={5}>Kitchen</MenuItem>
                    <MenuItem value={3}>Bar</MenuItem>
                    <MenuItem value={6}>Snacks</MenuItem>
                    <MenuItem value={54}>Misc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Cost Price"
                  name="Rate"
                  type="number"
                  value={formData.Rate || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                    sx: { 
                      borderRadius: 6,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 0.8)
                          : alpha(theme.palette.background.paper, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 1)
                          : alpha(theme.palette.background.paper, 1),
                        boxShadow: theme.shadows[4]
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Selling Price"
                  name="IssueRate"
                  type="number"
                  value={formData.IssueRate || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                    sx: { 
                      borderRadius: 6,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 0.8)
                          : alpha(theme.palette.background.paper, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 1)
                          : alpha(theme.palette.background.paper, 1),
                        boxShadow: theme.shadows[4]
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="GST %"
                  name="gstPercentage"
                  type="number"
                  value={formData.gstPercentage || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                    sx: { 
                      borderRadius: 6,
                      background: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 0.8)
                          : alpha(theme.palette.background.paper, 0.9),
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      },
                      '&.Mui-focused': {
                        background: theme.palette.mode === 'dark' 
                          ? alpha(theme.palette.background.default, 1)
                          : alpha(theme.palette.background.paper, 1),
                        boxShadow: theme.shadows[4]
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          justifyContent: 'space-between',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            color="secondary"
            sx={{ 
              borderRadius: 6,
              px: 4,
              textTransform: 'none',
              borderColor: theme.palette.divider,
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.default, 0.6)
                : alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.secondary.main,
                background: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.default, 0.8)
                  : alpha(theme.palette.background.paper, 0.9),
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2]
              }
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{ 
              borderRadius: 6,
              px: 4,
              textTransform: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
              }
            }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog(prev => ({ ...prev, open: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        severity={alertDialog.severity}
      />
    </>
  );
};

export default InventoryPage;