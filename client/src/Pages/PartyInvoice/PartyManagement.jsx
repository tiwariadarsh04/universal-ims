import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Grid,
  Button,
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Collapse,
  TablePagination,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
  useMediaQuery,
  CircularProgress,
  Backdrop,
  InputAdornment,
  TableFooter,
} from '@mui/material';
import {
  Search,
  FileDownload,
  Add,
  FilterList,
  MoreVert,
  Print,
  Edit,
  Delete,
  Person,
  CalendarToday,
  Receipt,
  MeetingRoom,
  Restaurant,
  Phone,
  LocationOn,
  ArrowDropDown,
  ArrowRight,
  Paid,
  Details,
  Summarize,
  PictureAsPdf,
  Clear,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { deletePartyInvoice, getPrtyInvoices } from '../../services/PartyInvoice';
import { useDialog } from '../../context/DialogProvider';
import styled from '@emotion/styled';
import ConfirmDialog from '../../components/Dialog/ConfirmDialog';

// Styled Components
const GradientCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.9)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.9)} 100%)`,
  color: theme?.palette?.common?.white || '#ffffff',
  borderRadius: 16,
  boxShadow: theme?.shadows?.[8] || '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme?.shadows?.[12] || '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
  }
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  backgroundColor: alpha(theme?.palette?.common?.white || '#ffffff', 0.15),
  backdropFilter: 'blur(10px)',
  border: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme?.palette?.common?.white || '#ffffff', 0.25),
    boxShadow: theme?.shadows?.[4] || '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  '&.Mui-focused': {
    backgroundColor: alpha(theme?.palette?.common?.white || '#ffffff', 0.25),
    boxShadow: theme?.shadows?.[8] || '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  },
  '& .MuiInputBase-root': {
    '&::before, &::after': {
      display: 'none',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`,
    padding: theme?.spacing?.(2) || '16px',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
  },
  '& .MuiTableHead-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme?.palette?.primary?.main || '#1976d2', 0.05),
      '& .MuiTableCell-root': {
        color: theme?.palette?.primary?.main || '#1976d2',
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: `2px solid ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)}`,
        padding: theme?.spacing?.(2) || '16px',
        whiteSpace: 'nowrap',
      },
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'all 0.3s ease',
      '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)', 0.05),
      },
      '&:hover': {
        backgroundColor: alpha(theme?.palette?.primary?.main || '#1976d2', 0.05),
        transform: 'translateX(4px)',
        '& .MuiTableCell-root': {
          color: theme?.palette?.primary?.main || '#1976d2',
        },
      },
    },
  },
  '& .MuiTableFooter-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme?.palette?.primary?.main || '#1976d2', 0.05),
      '& .MuiTableCell-root': {
        fontWeight: 600,
        color: theme?.palette?.primary?.main || '#1976d2',
        borderTop: `2px solid ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)}`,
        padding: theme?.spacing?.(2) || '16px',
      },
    },
  },
}));

const PartyManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showAlert, showConfirm } = useDialog();
  const navigate = useNavigate();
  
  // State management
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to format dates
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('DD MMM YYYY');
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await getPrtyInvoices();
        setTimeout(() => {
          setInvoices(res.data);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [updateData]);

  // Process invoice data and calculate totals
  const processedInvoices = useMemo(() => {
    return invoices.map(invoice => {
      const venueTotal = invoice.venueRows.reduce((sum, row) => {
        const subtotal = (row.rental || 0) + (row.acCharge || 0) + 
                         (row.maintenance || 0) + (row.security || 0);
        const cgstAmount = subtotal * ((row.cgst || 0) / 100);
        const sgstAmount = subtotal * ((row.sgst || 0) / 100);
        return sum + subtotal + cgstAmount + sgstAmount;
      }, 0);

      const menuTotal = invoice.menuRows.reduce((sum, row) => {
        const subtotal = (row.qty || 0) * (row.rate || 0);
        const cgstAmount = subtotal * ((row.cgstPercent || 0) / 100);
        const sgstAmount = subtotal * ((row.sgstPercent || 0) / 100);
        return sum + subtotal + cgstAmount + sgstAmount;
      }, 0);

      return {
        ...invoice,
        venueTotal,
        menuTotal,
        grandTotal: venueTotal + menuTotal,
        formattedBookingDate: formatDate(invoice?.invoiceDetails?.bookingDate),
        formattedInvoiceDate: formatDate(invoice?.invoiceDetails?.invoiceDate),
        formattedFunctionDate: formatDate(invoice?.invoiceDetails?.functionDate),
        formattedCreatedAt: formatDate(invoice?.createdAt)
      };
    });
  }, [invoices, formatDate]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return processedInvoices
      .filter(invoice => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matches = [
            invoice.memberDetails?.name,
            invoice.memberDetails?.id,
            invoice.invoiceNumber,
            invoice.memberDetails?.natureOfFunction
          ].some(field => field?.toLowerCase().includes(query));
          
          if (!matches) return false;
        }

        if (filterDateFrom && filterDateTo) {
          const functionDate = dayjs(invoice.invoiceDetails.functionDate);
          if (functionDate.isBefore(filterDateFrom, 'day') || 
              functionDate.isAfter(filterDateTo, 'day')) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.invoiceDetails.functionDate);
        const dateB = new Date(b.invoiceDetails.functionDate);
        return dateB - dateA;
      });
  }, [processedInvoices, searchQuery, filterDateFrom, filterDateTo]);

  // Optimized handlers
  const handleSearch = useCallback((e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
    if (searchValue.trim() !== '') {
      setFilterDateFrom(null);
      setFilterDateTo(null);
    }
  }, []);

  const handleMenuOpen = useCallback((event, invoice) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  }, []);

  const handleEdit = useCallback(() => {
    if (selectedInvoice) {
      navigate('/party-invoice-billing', { state: { ...selectedInvoice, isEdit: true } });
      handleMenuClose();
    }
  }, [selectedInvoice, navigate, handleMenuClose]);

  const handleDelete = useCallback(async () => {
    handleMenuClose();
    if (!selectedInvoice) return;
    setIsConfirmOpen(true);
  }, [selectedInvoice, handleMenuClose]);

  const handleCloseConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setSelectedInvoice(null);
    if (isDeleting) {
      setIsDeleting(false);
    }
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedInvoice) return;
    setIsDeleting(true);
    try {
      const res = await deletePartyInvoice(selectedInvoice?.id);
      if (res?.success) {
        setUpdateData(prev => !prev);
        showAlert(
          selectedInvoice?.invoiceNumber,
          'Deleted Successfully!',
          'success'
        );
      } else {
        showAlert(
          selectedInvoice?.invoiceNumber,
          res?.message || 'Deletion failed',
          'error'
        );
      }
    } catch (error) {
      showAlert(
        "Error",
        "An error occurred while deleting the invoice",
          "error"
        );
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedInvoice(null);
      }
  }, [selectedInvoice, showAlert]);

  const handleCheckDetails = useCallback(() => {
    navigate(`/party-invoice/${selectedInvoice?._id}`, { state: selectedInvoice });
    handleMenuClose();
  }, [selectedInvoice, navigate, handleMenuClose]);

  const handleGenerate = useCallback(() => {
    navigate('/party-invoice/pdf-view', { state: selectedInvoice });
    handleMenuClose();
  }, [selectedInvoice, navigate, handleMenuClose]);

  const handleExport = useCallback(() => {
    const dataToExport = filteredInvoices.map(invoice => ({
      'Invoice No': invoice.invoiceNumber,
      'Date': invoice.formattedInvoiceDate,
      'Member Name': invoice.memberDetails.name,
      'Member ID': invoice.memberDetails.id,
      'Function Type': invoice.memberDetails.natureOfFunction,
      'Function Date': invoice.formattedFunctionDate,
      'Venue Total': invoice.venueTotal,
      'Menu Total': invoice.menuTotal,
      'Grand Total': invoice.grandTotal
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, `Invoices_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  }, [filteredInvoices]);

  const toggleInvoiceExpand = useCallback((invoiceId) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  }, [expandedInvoice]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4, mb: 12 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                visibility: 'hidden'
              }}
            >
              Party Invoice Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/party-invoice-billing')}
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                New Invoice
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={handleExport}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                Filters
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Filters Section */}
        <Collapse in={showFilters}>
          <Fade in timeout={1000}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SearchContainer>
                    <TextField
                      fullWidth
                      placeholder="Search by name, ID, invoice or function..."
                      value={searchQuery}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "action.active" }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchQuery("")}
                              sx={{ color: "action.active" }}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </SearchContainer>
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="From Date"
                    value={filterDateFrom}
                    onChange={setFilterDateFrom}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday color="action" />
                            </InputAdornment>
                          ),
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="To Date"
                    value={filterDateTo}
                    onChange={setFilterDateTo}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday color="action" />
                            </InputAdornment>
                          ),
                        },
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Collapse>

        {/* Summary Cards */}
        <Slide direction="up" in timeout={1200}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2" color="inherit" sx={{ opacity: 0.9 }}>
                        TOTAL INVOICES
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                        {filteredInvoices.length}
                      </Typography>
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                        Total number of invoices
                      </Typography>
                    </Box>
                    <Avatar sx={{ 
                      bgcolor: 'white', 
                      color: theme.palette.primary.main,
                      width: 48,
                      height: 48
                    }}>
                      <Receipt fontSize="medium" />
                    </Avatar>
                  </Box>
                </Box>
              </GradientCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2" color="inherit" sx={{ opacity: 0.9 }}>
                        TOTAL REVENUE
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                        ₹{filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                        Combined revenue from all invoices
                      </Typography>
                    </Box>
                    <Avatar sx={{ 
                      bgcolor: 'white', 
                      color: theme.palette.warning.main,
                      width: 48,
                      height: 48
                    }}>
                      <Paid fontSize="medium" />
                    </Avatar>
                  </Box>
                </Box>
              </GradientCard>
            </Grid>
          </Grid>
        </Slide>

        {/* Invoices Table */}
        <Fade in timeout={1400}>
          <Paper elevation={0} sx={{ 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}>
            <TableContainer sx={{ 
              maxHeight: 'calc(100vh - 100px)',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: alpha(theme.palette.grey[200], 0.5),
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.primary.main, 0.3),
                borderRadius: '4px',
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.5),
                },
              },
            }}>
              <StyledTable stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell width="60px"></TableCell>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Party/Member</TableCell>
                    <TableCell>Function</TableCell>
                    <TableCell align="right">Venue</TableCell>
                    <TableCell align="right">Menu</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell width="50px"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="textSecondary">
                            No invoices found
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            Try adjusting your search criteria or filters
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((invoice) => (
                        <React.Fragment key={invoice._id}>
                          <TableRow 
                            hover 
                            onClick={() => toggleInvoiceExpand(invoice._id)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell>
                              <IconButton size="small">
                                {expandedInvoice === invoice._id ? (
                                  <ArrowDropDown />
                                ) : (
                                  <ArrowRight />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight="medium">
                                {invoice.invoiceNumber}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {invoice.formattedInvoiceDate}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ 
                                  width: 32, 
                                  height: 32,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main
                                }}>
                                  {invoice.memberDetails.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography>{invoice.memberDetails.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {invoice.memberDetails.id}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography>{invoice.memberDetails.natureOfFunction}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {invoice.formattedFunctionDate}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              ₹{invoice.venueTotal.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell align="right">
                              ₹{invoice.menuTotal.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`₹${invoice.grandTotal.toLocaleString('en-IN')}`}
                                color="primary"
                                sx={{ 
                                  fontWeight: 'bold',
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, invoice)}
                                size="small"
                                sx={{
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded Details */}
                          <TableRow>
                            <TableCell colSpan={8} sx={{ p: 0, borderBottom: 0 }}>
                              <Collapse 
                                in={expandedInvoice === invoice._id} 
                                timeout="auto" 
                                unmountOnExit
                              >
                                <Box sx={{ 
                                  p: 3,
                                  backgroundColor: 'background.default',
                                  borderTop: '1px solid',
                                  borderColor: 'divider',
                                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                                }}>
                                  {/* Invoice Details */}
                                  <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={6}>
                                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                                        <Typography 
                                          variant="subtitle1" 
                                          gutterBottom 
                                          sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            gap: 1,
                                            color: 'primary.main',
                                            fontWeight: 600
                                          }}
                                        >
                                          Member Details
                                        </Typography>
                                        <DetailItem 
                                          label="Name" 
                                          value={invoice.memberDetails.name} 
                                        />
                                        <DetailItem 
                                          label="Member ID" 
                                          value={invoice.memberDetails.id} 
                                        />
                                        <DetailItem 
                                          label="GSTIN" 
                                          value={invoice.memberDetails.gstNo} 
                                        />
                                        <DetailItem 
                                          label="Address" 
                                          value={invoice.memberDetails.address} 
                                        />
                                        <DetailItem 
                                          label="Nature of Function" 
                                          value={invoice.memberDetails.natureOfFunction} 
                                        />
                                      </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Paper sx={{ p: 2, borderRadius: 2 }}>
                                        <Typography 
                                          variant="subtitle1" 
                                          gutterBottom 
                                          sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            gap: 1,
                                            color: 'secondary.main',
                                            fontWeight: 600
                                          }}
                                        >
                                          Event Details
                                        </Typography>
                                        <DetailItem 
                                          label="Booking Date" 
                                          value={invoice.formattedBookingDate} 
                                        />
                                        <DetailItem 
                                          label="Invoice Date" 
                                          value={invoice.formattedInvoiceDate} 
                                        />
                                        <DetailItem 
                                          label="Function Date" 
                                          value={invoice.formattedFunctionDate} 
                                        />
                                        <DetailItem 
                                          label="Mobile" 
                                          value={invoice.invoiceDetails.mobileNo} 
                                        />
                                        <DetailItem 
                                          label="Number of Pax" 
                                          value={invoice.invoiceDetails.pax} 
                                        />
                                      </Paper>
                                    </Grid>
                                  </Grid>

                                  {/* Venue Charges */}
                                  <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                                    <Typography 
                                      variant="subtitle1" 
                                      gutterBottom 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'info.main',
                                        fontWeight: 600
                                      }}
                                    >
                                      Venue Charges
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Venue</TableCell>
                                          <TableCell>Session</TableCell>
                                          <TableCell align="right">Rental</TableCell>
                                          <TableCell align="right">AC Charge</TableCell>
                                          <TableCell align="right">Maintenance</TableCell>
                                          <TableCell align="right">Security</TableCell>
                                          <TableCell align="right">CGST</TableCell>
                                          <TableCell align="right">SGST</TableCell>
                                          <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {invoice.venueRows.map((row) => {
                                          const subtotal = row.rental + row.acCharge + row.maintenance + row.security;
                                          const cgstAmount = subtotal * (row.cgst / 100);
                                          const sgstAmount = subtotal * (row.sgst / 100);
                                          const rowTotal = subtotal + cgstAmount + sgstAmount;
                                          
                                          return (
                                            <TableRow key={row._id}>
                                              <TableCell>{row.name}</TableCell>
                                              <TableCell>{row.session}</TableCell>
                                              <TableCell align="right">₹{row.rental.toFixed(2)}</TableCell>
                                              <TableCell align="right">₹{row.acCharge.toFixed(2)}</TableCell>
                                              <TableCell align="right">₹{row.maintenance.toFixed(2)}</TableCell>
                                              <TableCell align="right">₹{row.security.toFixed(2)}</TableCell>
                                              <TableCell align="right">{row.cgst}%</TableCell>
                                              <TableCell align="right">{row.sgst}%</TableCell>
                                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                ₹{rowTotal.toFixed(2)}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                      <TableFooter>
                                        <TableRow>
                                          <TableCell colSpan={8} align="right">
                                            <Typography variant="subtitle1">
                                              Venue Subtotal:
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="right">
                                            <Typography variant="subtitle1" fontWeight="bold">
                                              ₹{invoice.venueTotal.toFixed(2)}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      </TableFooter>
                                    </Table>
                                  </Paper>

                                  {/* Menu Charges */}
                                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography 
                                      variant="subtitle1" 
                                      gutterBottom 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'success.main',
                                        fontWeight: 600
                                      }}
                                    >
                                      Menu Charges
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Description</TableCell>
                                          <TableCell align="right">Qty</TableCell>
                                          <TableCell align="right">Rate</TableCell>
                                          <TableCell align="right">Amount</TableCell>
                                          <TableCell align="right">CGST</TableCell>
                                          <TableCell align="right">SGST</TableCell>
                                          <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {invoice.menuRows.map((row) => {
                                          const amount = row.qty * row.rate;
                                          const cgstAmount = amount * (row.cgstPercent / 100);
                                          const sgstAmount = amount * (row.sgstPercent / 100);
                                          const rowTotal = amount + cgstAmount + sgstAmount;
                                          
                                          return (
                                            <TableRow key={row._id}>
                                              <TableCell>{row.description}</TableCell>
                                              <TableCell align="right">{row.qty}</TableCell>
                                              <TableCell align="right">₹{row.rate.toFixed(2)}</TableCell>
                                              <TableCell align="right">₹{amount.toFixed(2)}</TableCell>
                                              <TableCell align="right">{row.cgstPercent}%</TableCell>
                                              <TableCell align="right">{row.sgstPercent}%</TableCell>
                                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                ₹{rowTotal.toFixed(2)}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                      <TableFooter>
                                        <TableRow>
                                          <TableCell colSpan={6} align="right">
                                            <Typography variant="subtitle1">
                                              Menu Subtotal:
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="right">
                                            <Typography variant="subtitle1" fontWeight="bold">
                                              ₹{invoice.menuTotal.toFixed(2)}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      </TableFooter>
                                    </Table>
                                  </Paper>

                                  {/* Grand Total */}
                                  <Box sx={{ 
                                    mt: 3,
                                    p: 2,
                                    borderRadius: 2,
                                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 30%, ${alpha(theme.palette.secondary.main, 0.1)} 90%)`,
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                  }}>
                                    <Box sx={{ textAlign: 'right' }}>
                                      <Typography variant="subtitle1" color="primary.main">
                                        Invoice Total
                                      </Typography>
                                      <Typography 
                                        variant="h4" 
                                        fontWeight="bold" 
                                        sx={{
                                          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent',
                                        }}
                                      >
                                        ₹{invoice.grandTotal.toLocaleString('en-IN')}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                  )}
                </TableBody>
              </StyledTable>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredInvoices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '& .MuiTablePagination-select': {
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                },
                '& .MuiTablePagination-actions': {
                  '& .MuiIconButton-root': {
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  },
                },
              }}
            />
          </Paper>
        </Fade>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleGenerate} sx={{ color: 'error.main' }}>
            <PictureAsPdf fontSize="small" sx={{ mr: 1 }} />
            Generate Invoice
          </MenuItem>
          <MenuItem onClick={handleCheckDetails}>
            <Summarize fontSize="small" sx={{ mr: 1 }} />
            Check Details
          </MenuItem>
          <MenuItem onClick={handleEdit} sx={{ color: 'primary.main' }}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit Invoice
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete Invoice
          </MenuItem>
        </Menu>

        {/* Confirmation Dialog */}
        {selectedInvoice && (
          <ConfirmDialog
            open={isConfirmOpen}
            onClose={handleCloseConfirm}
            onConfirm={handleConfirmDelete}
            title="Delete Invoice"
            message={`Are you sure you want to delete invoice ${selectedInvoice?.invoiceNumber}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isDeleting}
            summaryData={{
              'Invoice No': selectedInvoice?.invoiceNumber,
              'Member Name': selectedInvoice?.memberDetails?.name,
              'Function Date': selectedInvoice?.formattedFunctionDate,
              'Grand Total': `₹${selectedInvoice?.grandTotal?.toLocaleString('en-IN')}`
            }}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value, icon }) => (
  <Box sx={{ display: 'flex', mb: 1.5 }}>
    <Typography variant="body2" sx={{ minWidth: 120, color: 'text.secondary' }}>
      {label}:
    </Typography>
    <Typography variant="body1" fontWeight="500">
      {value || 'N/A'}
    </Typography>
  </Box>
);

export default PartyManagement;