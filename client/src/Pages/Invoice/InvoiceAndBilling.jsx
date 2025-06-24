import html2pdf from 'html2pdf.js';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Autocomplete,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  FormHelperText,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  AddCircle as AddCircleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  ShoppingBasket as BasketIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AccountCircle as MemberIcon,
  LocalAtm as PaymentIcon,
  DateRange,
  ArrowBack,
} from '@mui/icons-material';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { createMemberTransactionByInvoice, getAllClubMember } from '../../services/Member';
import { fetchInventoryItems } from '../../services/Inventory';
import { amountInWords } from '../../utils/helper';
import { useLocation } from 'react-router-dom';
import { updateMemberTransactionByInvoice } from '../../services/Transaction';
import { getUserRole } from '../../services/Auth';

const InvoiceAndBilling = () => {
  useDocumentTitle('Invoice & Billing');
  const theme = useTheme();
  const location = useLocation();
  const [receivedData] = useState(location.state || {});

  // State initialization
  const [invoice, setInvoice] = useState({
    customerName: '',
    date: receivedData?.isEdit ? receivedData?.invoiceDate : sessionStorage?.getItem('invoiceDate') || new Date().toISOString().split('T')[0],
    items: [{itemCode: 0, description: '',itemGroup:0, quantity: 1, price: 0, gstPercentage: 5, purchaseRate: 0 }],
    memberPno: '',
    memberId: '',
    mobileNo: '',
  });
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const [errors, setErrors] = useState({
    customerName: false,
    date: false,
    items: [],
  });
  const [members, setMembers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    isError: false,
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [companyProfile, setCompanyProfile] = useState('');
  
  useEffect(() => {
    const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
    if (localLogo) {
      setCompanyProfile(localLogo);
    } 
  },[])

  // Memoized calculations
  const subtotal = useMemo(() => {
    return invoice.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  }, [invoice.items]);

  const gstTotal = useMemo(() => {
    return invoice.items.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      return total + (itemTotal * (item.gstPercentage || 0)) / 100;
    }, 0);
  }, [invoice.items]);

  const finalTotal = useMemo(() => {
    return subtotal + gstTotal;
  }, [subtotal, gstTotal]);

  // Memoized event handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  }, [errors]);

  const handleItemChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setInvoice(prev => {
      const newItems = [...prev.items];
      newItems[index][name] = name === 'quantity' || name === 'price' || name === 'gstPercentage' 
        ? parseFloat(value) 
        : value;
      return { ...prev, items: newItems };
    });
    
    setErrors(prev => {
      const newErrors = [...prev.items];
      newErrors[index] = { ...newErrors[index], [name]: false };
      return { ...prev, items: newErrors };
    });
  }, []);

  const handleItemDescriptionChange = useCallback((index, newValue) => {
    const selectedItem = inventoryItems.find((item) => item.ItemName === newValue);
    
    setInvoice(prev => {
      const newItems = [...prev.items];
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          itemCode: selectedItem.ItemCode,
          description: selectedItem.ItemName,
          itemGroup: selectedItem.ItemGroup,
          price: selectedItem.IssueRate,
          gstPercentage: selectedItem.gstPercentage,
          purchaseRate: selectedItem.Rate,
        };
      } else {
        newItems[index] = {
          ...newItems[index],
          description: newValue,
        };
      }
      return { ...prev, items: newItems };
    });
    
    setErrors(prev => {
      const newErrors = [...prev.items];
      newErrors[index] = { ...newErrors[index], description: false };
      return { ...prev, items: newErrors };
    });
  }, [inventoryItems]);

  const addItem = useCallback(() => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        price: 0,
        gstPercentage: 5,
        _id: `temp-${Math.random().toString(36).substr(2, 9)}`
      }]
    }));
    
    setErrors(prev => ({
      ...prev,
      items: [...prev.items, {
        description: false,
        quantity: false,
        price: false,
        gstPercentage: false,
      }]
    }));
  }, []);

  const deleteItem = useCallback((index) => {
    setInvoice(prev => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
    
    setErrors(prev => {
      const newErrors = [...prev.items];
      newErrors.splice(index, 1);
      return { ...prev, items: newErrors };
    });
  }, []);

  // Helper functions
  const generateInvoiceNumber = () => {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 1000);
    return `#INV-${timestamp.toString().slice(-6)}-${randomNumber}`;
  };

  const validateFields = () => {
    const newErrors = {
      customerName: !invoice.customerName,
      date: !invoice.date,
      items: invoice.items.map(item => ({
        description: !item.description,
        quantity: !item.quantity || item.quantity <= 0,
        price: !item.price || item.price < 0,
      })),
    };
    setErrors(newErrors);
    return !newErrors.customerName && !newErrors.date && 
           !newErrors.items.some(item => item.description || item.quantity || item.price);
  };

  const showDialog = (title, message, isError = false) => {
    setDialogContent({ title, message, isError });
    setDialogOpen(true);
  };

  const showConfirmation = () => {
    if (!validateFields()) {
      showDialog('Validation Error', 'Please fill all required fields with valid values', true);
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Data fetching functions
  const getClubMemberDetails = async (query = '', limit = 5) => {
    setLoadingMembers(true);
    try {
      const res = await getAllClubMember(query, limit);

      if (res.error) {
        showDialog('Error', res.error || 'Failed to fetch members', true);
        return;
      }

      if (!Array.isArray(res)) {
        showDialog('Error', 'Invalid response format from server', true);
        return;
      }

      setMembers(res);
    } catch (error) {
      console.error('Error fetching members:', error);
      showDialog('Error', 'Failed to fetch members. Please try again.', true);
    } finally {
      setLoadingMembers(false);
    }
  };

  const getInventoryItems = async (query = '', limit = 5) => {
    setLoadingInventory(true);
    try {
      const res = await fetchInventoryItems(query, limit);
      
      if (res.error || !res.success) {
        showDialog('Error', res.error || 'Failed to fetch inventory items', true);
        return;
      }

      if (!Array.isArray(res.data)) {
        showDialog('Error', 'Invalid inventory data format', true);
        return;
      }

      setInventoryItems(res.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      showDialog('Error', 'Failed to fetch inventory items. Please try again.', true);
    } finally {
      setLoadingInventory(false);
    }
  };


  useEffect(() => {
    const initializeForm = async () => {
      try {
        await getClubMemberDetails();
        await getInventoryItems();

  
        if (receivedData && Object.keys(receivedData).length > 0) {
          
          // Transform the received data to match your form structure
          const transformedItems = receivedData.items.map(item => ({
            description: item.itemName,
            quantity: item.qty,
            price: item.amount / item.qty,
            gstPercentage: item.gstPercentage,
            _id: item._id // Preserve the original ID
          }));
  
          setInvoice({
            customerName: receivedData.memberName || '',
            date: receivedData.invoiceDate ? receivedData.invoiceDate.split('T')[0] : 
            new Date().toISOString().split('T')[0] ,
            items: transformedItems.length > 0 ? 
                  transformedItems : 
                  [{itemCode: 0, description: '',itemGroup:0, quantity: 1, price: 0, gstPercentage: 5, purchaseRate: 0 }],
            memberId: receivedData.memberID || '',
            memberPno: receivedData.memberPno || '',
            mobileNo: '' // Add mobile number if available in your data
          });
  
          setInvoiceNumber(receivedData.invoiceNumber || generateInvoiceNumber());
        } else {
          setInvoiceNumber(generateInvoiceNumber());
        }
  
        setIsInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
  
    initializeForm();
  }, []);

  // PDF generation
  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-preview');
    const buttonsContainer = document.getElementById('buttons-container');

    if (!element) {
      showDialog('Error', 'Invoice preview not found. Please try again.', true);
      return;
    }

    setIsGeneratingPDF(true);
    if (buttonsContainer) {
      buttonsContainer.style.display = 'none';
    }

    try {
      await html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `invoice_${invoiceNumber}_${invoice.customerName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      showDialog('Error', 'Failed to generate PDF. Please try again.', true);
    } finally {
      setIsGeneratingPDF(false);
      if (buttonsContainer) {
        buttonsContainer.style.display = 'flex';
      }
    }
  };

  const saveTransactionDetails = async () => {
    setIsLoading(true);
    try {
      const transactionData = {
        performedBy: localStorage?.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
        pno : invoice.memberPno,
        memberID: invoice.memberId,
        invoiceNumber: invoiceNumber,
        invoiceDate: invoice.date,
        items: invoice.items.map((item) => ({
          itemCode: item.itemCode,
          itemName: item.description,
          itemGroup: item.itemGroup,
          qty: item.quantity,
          amount: item.price * item.quantity,
          gstPercentage: item.gstPercentage,
          purchaseRate: item.purchaseRate,
          _id: item._id || undefined
        })),
      };
  
      let res;
      if (receivedData.isEdit) {
        const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if (!localUser) {
          showDialog('Error', 'User session expired. Please login again.', true);
          return;
        }
      
        const checkRole = await getUserRole(localUser.username);
        if (checkRole && checkRole.userRole) {

           console.log(transactionData); 
          res = await updateMemberTransactionByInvoice(transactionData, checkRole.userRole);
        } else {
          showDialog('Error', 'Unauthorized access. Please contact administrator.', true);
          return;
        }
      } else {
        res = await createMemberTransactionByInvoice(transactionData);
      }

      if (!res.success || res.error) {
        showDialog('Error', res.message || res.error || 'Failed to save transaction', true);
        return;
      }

      showDialog('Success', res.message || 'Transaction saved successfully');
      setShowPreview(true);
      
      if (receivedData.isEdit) {
        setInvoice(prev => ({
          ...prev,
          items: transactionData.items.map(item => ({
            itemCode: item.itemCode,  
            description: item.itemName,
            itemGroup: item.itemGroup,
            quantity: item.qty,
            price: item.amount / item.qty,
            gstPercentage: item.gstPercentage,
            purchaseRate: item.purchaseRate,
            _id: item._id
          }))
        }));
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      showDialog('Error', 'Failed to save transaction. Please try again.', true);
    } finally {
      setIsLoading(false);
      setConfirmOpen(false);
    }
  };

  const resetTransactionFields = () => {
    setInvoice({
      customerName: '',
      date: sessionStorage?.getItem('invoiceDate') || new Date().toISOString().split('T')[0],
      items: [{itemCode: '', description: '',itemGroup:0, quantity: 1, price: 0, gstPercentage: 5, purchaseRate: 0 }],
      memberId: '',
      mobileNo: '',
    });
    setErrors({
      customerName: false,
      date: false,
      items: [{
        description: false,
        quantity: false,
        price: false,
        gstPercentage: false,
      }],
    });
    setShowPreview(false);
    setInvoiceNumber(generateInvoiceNumber());
  };

  useEffect(()=>{
    sessionStorage.setItem('invoiceDate', invoice.date);
  },[invoice])

  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }


  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 4, mb: 4 }}>
      {/* Success/Error Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
            minWidth: '400px',
            borderTop: dialogContent.isError 
              ? `4px solid ${theme.palette.error.main}`
              : `4px solid ${theme.palette.success.main}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: dialogContent.isError ? 'error.main' : 'success.main',
          backgroundColor: dialogContent.isError 
            ? 'rgba(244, 67, 54, 0.1)' 
            : 'rgba(76, 175, 80, 0.1)',
          py: 2,
          px: 3,
        }}>
          {dialogContent.isError ? (
            <WarningIcon color="error" sx={{ mr: 2, fontSize: 32 }} />
          ) : (
            <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 32 }} />
          )}
          <Box>
            <Typography variant="h6" component="div">
              {dialogContent.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dialogContent.isError ? 'Please fix the following issue' : 'Operation successful'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 2,
            backgroundColor: dialogContent.isError 
              ? 'rgba(244, 67, 54, 0.05)' 
              : 'rgba(76, 175, 80, 0.05)',
            borderRadius: 2,
            mb: 2,
          }}>
            {dialogContent.isError ? (
              <InfoIcon color="error" sx={{ mr: 2 }} />
            ) : (
              <CheckCircleIcon color="success" sx={{ mr: 2 }} />
            )}
            <DialogContentText sx={{ color: 'text.primary' }}>
              {dialogContent.message}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button 
            onClick={handleDialogClose} 
            variant="contained"
            color={dialogContent.isError ? 'error' : 'success'}
            sx={{ 
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={handleConfirmClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
            minWidth: '450px',
            borderTop: `4px solid ${theme.palette.warning.main}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          py: 2,
          px: 3,
        }}>
          <WarningIcon color="warning" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h6" component="div" color="warning.main">
              Confirm Invoice Generation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please review before proceeding
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <DialogContentText sx={{ mb: 2, mt: 2 }}>
            Are you sure you want to generate this invoice?
          </DialogContentText>
          <Box sx={{ 
            mt: 2, 
            p: 3, 
            backgroundColor: 'background.paper', 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <Typography variant="subtitle2" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center',
              color: 'primary.main',
            }}>
              <ReceiptIcon sx={{ mr: 1 }} /> Invoice Summary
            </Typography>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PersonIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2"><strong>Customer:</strong> {invoice.customerName || 'Not specified'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PaymentIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2"><strong>Total Items:</strong> {invoice.items.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <MoneyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2"><strong>Total Amount:</strong> ₹{finalTotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: 1,
              textAlign: 'center',
            }}>
              <Typography variant="caption" color="text.secondary">
                This invoice will be recorded in the system and only admin can update it later.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            onClick={handleConfirmClose} 
            variant="outlined"
            color="secondary"
            sx={{ 
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveTransactionDetails} 
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{ 
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            {isLoading ? 'Processing...' : 'Confirm & Generate'}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={4}>
        {/* Invoice Form */}
        {!showPreview && (
          <Grid item xs={12} md={12} sx={{ width: '100%', mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center',
                color: 'primary.main',
              }}>
                <ReceiptIcon sx={{ mr: 1 }} /> 
                {receivedData.isEdit ? 'Edit Invoice' : 'Invoice Details'}
                {receivedData.isEdit && (
                  <Chip 
                    label="Edit Mode" 
                    color="warning" 
                    size="small" 
                    sx={{ ml: 2 }} 
                  />
                )}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={members}
                    getOptionLabel={(option) => `${option.Name} (${option.Pno})`}
                    value={members.find((member) => member.MemberID === invoice.memberId) || null}
                    onChange={(event, newValue) => {
                      setInvoice({
                        ...invoice,
                        customerName: newValue ? newValue.Name : '',
                        memberId: newValue ? newValue.MemberID : '',
                        mobileNo: newValue ? newValue.Contact : '',
                      });
                      if (errors.customerName) {
                        setErrors({ ...errors, customerName: false });
                      }
                    }}
                    inputValue={searchQuery}
                    onInputChange={(event, newInputValue) => {
                      setSearchQuery(newInputValue);
                      getClubMemberDetails(newInputValue);
                    }}
                    renderInput={(params) => (
                      <Box>
                        <TextField
                          {...params}
                          fullWidth
                          label="Customer Name"
                          margin="normal"
                          required
                          error={errors.customerName}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                            endAdornment: (
                              <>
                                {loadingMembers ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                        {errors.customerName && (
                          <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Customer name is required
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    value={invoice.date}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    error={errors.date}
                    InputProps={{
                      startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  {errors.date && (
                    <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                      <InfoIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Date is required
                    </FormHelperText>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Member ID"
                    name="memberId"
                    value={invoice.memberId}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      startAdornment: <MemberIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNo"
                    value={invoice.mobileNo}
                    onChange={handleInputChange}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ 
                mt: 4, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
              }}>
                <BasketIcon sx={{ mr: 1 }} /> Items
              </Typography>
              
              {invoice.items.map((item, index) => (
                <Paper key={index} elevation={0} sx={{ 
                  p: 2, 
                  mb: 3, 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        freeSolo
                        options={inventoryItems.map((item) => item.ItemName)}
                        value={item.description}
                        onChange={(event, newValue) => {
                          handleItemDescriptionChange(index, newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          getInventoryItems(newInputValue);
                        }}
                        renderInput={(params) => (
                          <Box>
                            <TextField
                              {...params}
                              fullWidth
                              label="Description"
                              margin="normal"
                              required
                              error={errors.items[index]?.description}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: <DescriptionIcon color="action" sx={{ mr: 1 }} />,
                                endAdornment: (
                                  <>
                                    {loadingInventory ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                            {errors.items[index]?.description && (
                              <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Description is required
                              </FormHelperText>
                            )}
                          </Box>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        margin="normal"
                        required
                        error={errors.items[index]?.quantity}
                        inputProps={{ min: 1 }}
                        InputProps={{
                          startAdornment: <span style={{ marginRight: 8 }}>#</span>,
                        }}
                      />
                      {errors.items[index]?.quantity && (
                        <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                          <InfoIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Must be at least 1
                        </FormHelperText>
                      )}
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        name="price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        margin="normal"
                        required
                        error={errors.items[index]?.price}
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                          startAdornment: <MoneyIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />,
                        }}
                      />
                      {errors.items[index]?.price && (
                        <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                          <InfoIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> Must be positive
                        </FormHelperText>
                      )}
                    </Grid>
                    
                    <Grid item xs={5} md={2}>
                      <TextField
                        fullWidth
                        label="GST %"
                        type="number"
                        name="gstPercentage"
                        value={item.gstPercentage}
                        onChange={(e) => handleItemChange(index, e)}
                        margin="normal"
                        required
                        error={errors.items[index]?.gstPercentage}
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        InputProps={{
                          startAdornment: <PercentIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />,
                        }}
                      />
                      {errors.items[index]?.gstPercentage && (
                        <FormHelperText error sx={{ display: 'flex', alignItems: 'center' }}>
                          <InfoIcon sx={{ mr: 0.5, fontSize: '1rem' }} /> 0-28% only
                        </FormHelperText>
                      )}
                    </Grid>
                    
                    <Grid item xs={1} md={1}>
                      <IconButton 
                        color="error" 
                        onClick={() => deleteItem(index)}
                        sx={{ 
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.2)',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                mt: 3,
              }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={addItem}
                  startIcon={<AddCircleIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    textTransform: 'none',
                  }}
                >
                  Add Item
                </Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={`Items: ${invoice.items.length}`} 
                    variant="outlined" 
                    sx={{ mr: 2 }} 
                  />
                  <Chip 
                    label={`Subtotal: ₹${subtotal.toFixed(2)}`} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={showConfirmation}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <ReceiptIcon />}
                    sx={{ 
                      borderRadius: 2,
                      px: 4,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      }
                    }}
                  >
                    {isLoading ? 'Processing...' : 
                    receivedData.isEdit ? 'Update Invoice' : 'Generate Invoice'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Modern Invoice Preview */}
        {showPreview && (
          <Grid item xs={12} md={12} sx={{ width: '100%', mb: 4 }}>
            <Paper id="invoice-preview" elevation={3} sx={{ 
              p: 0,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}>
              {/* Header */}
              <Box sx={{ 
                p: 4,
                backgroundColor: 'primary.main',
                color: 'common.white',
              }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar 
                      src={companyProfile?.logoUrl} 
                      alt="Company Logo" 
                      sx={{ 
                        width: 80, 
                        height: 80,
                        backgroundColor: 'common.white',
                        p: 1,
                      }} 
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {companyProfile?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {companyProfile?.address}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        INVOICE
                      </Typography>
                      <Typography variant="body2">{invoiceNumber}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Details */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'primary.main',
                      }}>
                        <PersonIcon sx={{ mr: 1 }} /> Billed To
                      </Typography>
                      <Box sx={{ pl: 3 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                          {invoice.customerName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <MemberIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">Member ID: {invoice.memberId}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">Phone: {invoice.mobileNo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DateRange color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">Invoice Date: {invoice.date}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      backgroundColor: 'background.paper',
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'secondary.main',
                      }}>
                        <BusinessIcon sx={{ mr: 1 }} /> Club Details
                      </Typography>
                      <Box sx={{ pl: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <LocationIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">{companyProfile?.address}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <EmailIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">{companyProfile?.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">{companyProfile?.contact}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                
                {/* Items Table */}
                <TableContainer component={Paper} elevation={0} sx={{ 
                  mb: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: 'primary.main',
                        '& th': {
                          color: 'common.white',
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                        }
                      }}>
                        <TableCell>#</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">GST %</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.items.map((item, index) => (
                        <TableRow 
                          key={index}
                          sx={{ 
                            '&:nth-of-type(even)': {
                              backgroundColor: 'action.hover',
                            }
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {item.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">{item.gstPercentage}%</TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 'medium' }}>
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Totals */}
                <Grid container justifyContent="flex-end" sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', border: 'none' }}>
                            Subtotal
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', border: 'none' }}>
                            ₹{subtotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', border: 'none' }}>
                            GST Total
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', border: 'none' }}>
                            ₹{gstTotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="right" sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.1rem',
                            border: 'none',
                            pt: 2,
                          }}>
                            Final Total
                          </TableCell>
                          <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.1rem',
                            border: 'none',
                            pt: 2,
                          }}>
                            <Typography variant="h6" color="primary">
                              ₹{finalTotal.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
                
                {/* Amount in Words */}
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  mb: 4,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.info.main}`,
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'info.main',
                  }}>
                    <MoneyIcon sx={{ mr: 1 }} /> Amount in Words
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {amountInWords(finalTotal)}
                  </Typography>
                </Paper>
                
                {/* Footer */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 2,
                      textAlign: 'center',
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Customer Signature
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="caption" color="text.secondary">
                        We appreciate your business
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      p: 2,
                      textAlign: 'center',
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Authorized Signature
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="caption" color="text.secondary">
                        Noamundi Club Management
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Action Buttons */}
              <Box id="buttons-container" sx={{ 
                p: 3, 
                backgroundColor: 'background.paper',
                borderTop: `1px solid ${theme.palette.divider}`,
              }}>
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={isGeneratingPDF ? <CircularProgress size={20} /> : <ReceiptIcon />}
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      sx={{ 
                        px: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: 'none',
                        }
                      }}
                    >
                      {isGeneratingPDF ? 'Generating PDF...' : 'Download Invoice'}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<AddCircleIcon />}
                      onClick={resetTransactionFields}
                      sx={{ 
                        px: 4,
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                      disabled={receivedData.isEdit}
                      
                    >
                      Create New Invoice
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default InvoiceAndBilling;