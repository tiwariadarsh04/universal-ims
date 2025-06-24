import React, { useReducer, useMemo, useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  Chip,
  Badge,
  TextField
} from '@mui/material';
import { Add, Remove, Print, Payment, Receipt, CalendarToday, LocalOffer, Person, BadgeOutlined, ReceiptOutlined, LocationOn, EventNote, People, Event, Edit, Restaurant, ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/system';
import LOGO from '../../assets/logo.png';
import { createPartyInvoice, updatePartyInvoice, getNextInvoiceNumber, resetInvoiceCounter } from '../../services/PartyInvoice';
import { ModernDateField, ModernInputField, PartyInputField } from './PartyInputField';
import { motion } from 'framer-motion';
import { useDialog } from '../../context/DialogProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

const GradientHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.95)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.95)} 100%)`,
  color: '#fff',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  marginBottom: '32px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)'
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    pointerEvents: 'none'
  }
}));

const InvoiceBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: alpha(theme?.palette?.common?.white || '#ffffff', 0.95),
  color: theme?.palette?.primary?.main || '#1976d2',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
  }
}));

const HoverPaper = styled(Paper)(({ theme }) => ({
  transition: 'all 0.3s ease',
  background: alpha(theme?.palette?.background?.paper || '#ffffff', 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
  }
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme?.palette?.primary?.main || '#1976d2'} 30%, ${theme?.palette?.secondary?.main || '#dc004e'} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700
}));


const AnimatedButton = motion.create(Button);

const StyledDateField = styled(ModernDateField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    background: alpha(theme?.palette?.background?.paper || '#ffffff', 0.8),
    backdropFilter: 'blur(8px)',
    '&:hover': {
      background: alpha(theme?.palette?.background?.paper || '#ffffff', 0.9),
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    '&.Mui-focused': {
      background: alpha(theme?.palette?.background?.paper || '#ffffff', 1),
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    }
  },
  '& .MuiInputAdornment-root': {
    '& .MuiIconButton-root': {
      color: theme?.palette?.primary?.main || '#1976d2',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)
      }
    }
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme?.spacing?.(3) || '24px',
  padding: theme?.spacing?.(2) || '16px',
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.05)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.05)} 100%)`,
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`,
  '& .MuiTypography-root': {
    background: `linear-gradient(45deg, ${theme?.palette?.primary?.main || '#1976d2'} 30%, ${theme?.palette?.secondary?.main || '#dc004e'} 90%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 600
  },
  '& .MuiSvgIcon-root': {
    color: theme?.palette?.primary?.main || '#1976d2',
    marginRight: theme?.spacing?.(1.5) || '12px'
  }
}));

const TableWrapper = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  background: alpha(theme?.palette?.background?.paper || '#ffffff', 0.8),
  backdropFilter: 'blur(8px)',
  border: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    transform: 'translateY(-4px)'
  },
  '& .MuiTable-root': {
    '& .MuiTableHead-root': {
      '& .MuiTableRow-root': {
        background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.1)} 100%)`,
        '& .MuiTableCell-root': {
          color: theme?.palette?.primary?.main || '#1976d2',
          fontWeight: 600,
          borderBottom: `2px solid ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)}`
        }
      }
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        transition: 'all 0.3s ease',
        '&:hover': {
          background: alpha(theme?.palette?.primary?.main || '#1976d2', 0.05)
        }
      }
    }
  }
}));


const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  marginRight: theme?.spacing?.(2) || '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)
  }
}));


// Initial state
const initialState = {
  invoiceNumber: '',
  gstin: '20AAEAN1606J1Z2',
  memberDetails: {
    name: '',
    id: '',
    address: '',
    gstNo: '',
    natureOfFunction: ''
  },
  invoiceDetails: {
    bookingDate: new Date().toISOString().split('T')[0],
    invoiceDate: new Date().toISOString().split('T')[0],
    functionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mobileNo: '',
    pax: 0
  },
  venueRows: [{
    id: 1,
    name: '',
    session: '',
    rental: 0,
    acCharge: 0,
    maintenance: 0,
    security: 0,
    cgst: 0,
    sgst: 0,
  }],
  menuRows: [{
    id: 1,
    description: '',
    qty: 0,
    rate: 0,
    sgstPercent: 0,
    cgstPercent: 0,
  }]
};

// Reducer function
function invoiceReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { 
        ...initialState, 
        ...action.payload,
        venueRows: action.payload.venueRows || initialState.venueRows,
        menuRows: action.payload.menuRows || initialState.menuRows,
        invoiceNumber: action.payload.invoiceNumber || initialState.invoiceNumber,
        gstin: action.payload.gstin || initialState.gstin
      };
    case 'UPDATE_MEMBER':
      return {
        ...state,
        memberDetails: {
          ...state.memberDetails,
          [action.field]: action.value
        }
      };
    case 'UPDATE_GSTIN':
      return {
        ...state,
        gstin: action.value
      }; 

    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoiceDetails: {
          ...state.invoiceDetails,
          [action.field]: action.value
        }
      };
    case 'SET_INVOICE_NUMBER':
      return {
        ...state,
        invoiceNumber: action.value
      };
    case 'ADD_VENUE_ROW':
      const newVenueId = state.venueRows.length > 0 ? Math.max(...state.venueRows.map(row => row.id)) + 1 : 1;
      return {
        ...state,
        venueRows: [
          ...state.venueRows,
          {
            id: newVenueId,
            name: '',
            session: '',
            rental: 0,
            acCharge: 0,
            maintenance: 0,
            security: 0,
            cgst: 0,
            sgst: 0,
          }
        ]
      };
    case 'REMOVE_VENUE_ROW':
      return {
        ...state,
        venueRows: state.venueRows.length > 1 
          ? state.venueRows.filter(row => row.id !== action.id)
          : state.venueRows
      };
    case 'UPDATE_VENUE_ROW':
      return {
        ...state,
        venueRows: state.venueRows.map(row =>
          row.id === action.id 
            ? { ...row, [action.field]: action.value || 0 }
            : row
        )
      };
    case 'ADD_MENU_ROW':
      const newMenuId = state.menuRows.length > 0 ? Math.max(...state.menuRows.map(row => row.id)) + 1 : 1;
      return {
        ...state,
        menuRows: [
          ...state.menuRows,
          {
            id: newMenuId,
            description: '',
            qty: 0,
            rate: 0,
            sgstPercent: 0,
            cgstPercent: 0,
          }
        ]
      };
    case 'REMOVE_MENU_ROW':
      return {
        ...state,
        menuRows: state.menuRows.length > 1 
          ? state.menuRows.filter(row => row.id !== action.id)
          : state.menuRows
      };
    case 'UPDATE_MENU_ROW':
      return {
        ...state,
        menuRows: state.menuRows.map(row =>
          row.id === action.id 
            ? { ...row, [action.field]: action.value || 0 }
            : row
        )
      };
    case 'RESET_INVOICE':
      return {
        ...initialState,
        invoiceNumber: action.preserveInvoiceNumber ? state.invoiceNumber : '',
      };
    default:
      return state;
  }
}

const PartyInvoice = () => {
  const { showAlert, showConfirm } = useDialog();
  const [state, dispatch] = useReducer(invoiceReducer, initialState);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const invoiceRef = useRef(null);
  const [loading , setLoading] = useState(false);

  const [companyProfile, setCompanyProfile] = useState('');
    
    useEffect(() => {
      const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
      if (localLogo) {
        setCompanyProfile(localLogo);
      } 
    },[]);

  const resetCounter = async () => {
    const response = await resetInvoiceCounter();
    if(response.success){
      showAlert("Success", "Invoice counter reset successfully", "success");
    }else{
      showAlert("Error", "Failed to reset invoice counter", "error");
    }
  };
  
  // Get data from route
  const location = useLocation();
  const { state: routeState } = location;
  const { isEdit = false, ...invoiceData } = routeState || {};

  // Fetch next invoice number when component mounts
  useEffect(() => {
    const fetchNextInvoiceNumber = async () => {
      if (!isEdit) {
        try {
          const response = await getNextInvoiceNumber();
          console.log('Next Invoice Number Response:', response);
          if (response.success) {
            // Extract only the nextInvoiceNumber from the response
            const invoiceNumber = response.data?.nextInvoiceNumber || '';
            dispatch({ type: 'SET_INVOICE_NUMBER', value: invoiceNumber });
          } else {
            showAlert("Error", "Failed to fetch next invoice number", "error");
          }
        } catch (error) {
          console.error('Error fetching invoice number:', error);
          showAlert("Error", "Failed to fetch next invoice number", "error");
        }
      }
    };

    fetchNextInvoiceNumber();
  }, [isEdit]);

  // Save to localStorage on change (only for new invoices)
  useEffect(() => {
    if (!isEdit) {
      localStorage.setItem('partyInvoiceData', JSON.stringify(state));
    }
  }, [isEdit]);

  // Load data from route or localStorage on mount
  useEffect(() => {
    const loadData = () => {
      if (invoiceData && Object.keys(invoiceData).length > 0) {
        const loadedVenueRows = invoiceData.venueRows?.map((row, index) => ({
          ...row,
          id: row.id || index + 1
        })) || initialState.venueRows;
        
        const loadedMenuRows = invoiceData.menuRows?.map((row, index) => ({
          ...row,
          id: row.id || index + 1
        })) || initialState.menuRows;

        const payload = {
          ...invoiceData,
          venueRows: loadedVenueRows,
          menuRows: loadedMenuRows
        };

        if (JSON.stringify(payload) !== JSON.stringify(state)) {
          dispatch({ type: 'LOAD_STATE', payload });
        }
      } else if (!invoiceData) {
        const savedData = localStorage.getItem('partyInvoiceData');
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            if (JSON.stringify(parsedData) !== JSON.stringify(state)) {
              dispatch({ type: 'LOAD_STATE', payload: parsedData });
            }
          } catch (e) {
            console.error("Failed to parse saved data", e);
          }
        }
      }
    };

    loadData();
  }, []);


  // Calculate venue row total
  const calculateVenueTotal = (row) => {
    const rental = Number(row.rental) || 0;
    const acCharge = Number(row.acCharge) || 0;
    const maintenance = Number(row.maintenance) || 0;
    const security = Number(row.security) || 0;
    const cgst = Number(row.cgst) || 0;
    const sgst = Number(row.sgst) || 0;
  
    const subtotal = rental + acCharge + maintenance + security;
    const cgstAmount = subtotal * (cgst / 100);
    const sgstAmount = subtotal * (sgst / 100);
    
    const total = subtotal + cgstAmount + sgstAmount;
    
    return isNaN(total) ? 0 : total;
  };

  // Calculate menu row total
  const calculateMenuRowTotal = (row) => {
    const subtotal = row.qty * row.rate;
    const sgstAmount = subtotal * (row.sgstPercent / 100);
    const cgstAmount = subtotal * (row.cgstPercent / 100);
    return subtotal + sgstAmount + cgstAmount;
  };

  // Memoized calculations
  const venueTotalAmount = useMemo(() => {
    return state.venueRows.reduce((sum, row) => sum + calculateVenueTotal(row), 0);
  }, [state.venueRows]);

  const menuTotalAmount = useMemo(() => {
    return state.menuRows.reduce((sum, row) => sum + calculateMenuRowTotal(row), 0);
  }, [state.menuRows]);

  const totalInvoiceAmount = useMemo(() => {
    return venueTotalAmount + menuTotalAmount;
  }, [venueTotalAmount, menuTotalAmount]);

  const partyArrear = useMemo(() => {
    return totalInvoiceAmount;
  }, [totalInvoiceAmount]);


  // Enhanced submit with animation
  const handleSubmitPartyInvoice = async () => {
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await updatePartyInvoice(state._id, state);
      } else {
        res = await createPartyInvoice(state);
      }

      if (res.success) {
        showAlert(
          state.invoiceNumber,
          isEdit ? "Party Invoice updated successfully!" : "Party Invoice created successfully!",
          "success"
        );

        setLoading(false);

        if(!isEdit){
          handleReset();
        }
        
      } else {
        showAlert(
          "Error",
          res.error || res.message,
          "error"
        );
        setLoading(false);
      }
    } catch (error) {
      showAlert(
        "Error",
        "An error occurred while saving the invoice",
        "error"
      );
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    resetCounter();
    dispatch({ 
      type: 'RESET_INVOICE',
      preserveInvoiceNumber: isEdit
    });
  };

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const handleChipClick = () => {
    setIsEditing(true);
  };



  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BackButton
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                className="no-print"
              >
                Back to Party Page
              </BackButton>
              <GradientTypography variant="h4" component="h1" visibility="hidden">
                {isEdit ? "Edit Party Invoice" : "Create Party Invoice"}
              </GradientTypography>
            </Box>
            <Box>
              <AnimatedButton
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                sx={{ mr: 2 }}
                className="no-print"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Form
              </AnimatedButton>
            </Box>
          </Box>

          <HoverPaper id='printable-container' ref={invoiceRef} sx={{ p: 3, position: 'relative' }}>
            <GradientHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <InvoiceBadge 
                  label={`#${state.invoiceNumber}`}
                  icon={<LocalOffer fontSize="small" />}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Avatar 
                    src={companyProfile?.logoUrl} 
                    alt="logo" 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      p: 1,
                      border: '4px solid white',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }}
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                  {isEdit ? "Edit Party Invoice" : "Create Party Invoice"}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                  {companyProfile?.address}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: 2, 
                  mt: 2,
                  flexWrap: 'wrap' 
                }}>

                  {isEditing ? (
                      <TextField
                        value={state.gstin}
                        onChange={(e) => dispatch({ type: 'UPDATE_GSTIN', field: 'gstin', value: e.target.value })}
                        autoFocus // Focus the input when it appears
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0)',
                          padding: '4px 8px',
                          border: 'none',
                          outline: 'none',
                          color: 'inherit', 
                          '& input': {
                            padding: 0.5, 
                          }
                        }}
                      />
                    ) : (
                      <Chip
                        label={`GSTIN: ${state.gstin}`}
                        onClick={handleChipClick}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(4px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            backgroundColor: 'rgba(255,255,255,0.3)'
                          }
                        }}
                      />
                    )}


                  <Chip 
                    icon={isEdit ? <Edit fontSize="small" /> : <Add fontSize="small" />}
                    label={isEdit ? "Edit mode" : "Create mode"}
                    size="small" 
                    color="secondary"
                    sx={{ 
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  />
                </Box>
              </motion.div>
            </GradientHeader>

            {/* Member and Invoice Details - Card Layout */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Member Details Section */}
              <Grid item xs={12} md={6}>
                <HoverPaper sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 3,
                    pb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Person color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="600">
                      Member Information
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <ModernInputField
                        label="Full Name*"
                        placeholder="Enter member name"
                        name="name"
                        value={state.memberDetails.name}
                        onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', field: 'name', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <ModernInputField
                        name="id"
                        label="Member ID*"
                        placeholder="Enter ID"
                        value={state.memberDetails.id}
                        onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', field: 'id', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <ModernInputField
                        label="GSTIN"
                        name="gstNo"
                        placeholder="Enter GST number"
                        value={state.memberDetails.gstNo}
                        onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', field: 'gstNo', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <ModernInputField
                        label="Address*"
                        name="address"
                        placeholder="Enter full address"
                        value={state.memberDetails.address}
                        onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', field: 'address', value: e.target.value })}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <ModernInputField
                        label="Nature of Function"
                        name="natureOfFunction"
                        placeholder="Describe function purpose"
                        value={state.memberDetails.natureOfFunction}
                        onChange={(e) => dispatch({ type: 'UPDATE_MEMBER', field: 'natureOfFunction', value: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </HoverPaper>
              </Grid>

              {/* Event Details Section */}
              <Grid item xs={12} md={6}>
                <HoverPaper sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 3,
                    pb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Event color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="600">
                      Event Details
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <StyledDateField
                        label="Booking Date"
                        name="bookingDate"
                        value={state.invoiceDetails.bookingDate}
                        onChange={(e) => dispatch({ type: 'UPDATE_INVOICE', field: 'bookingDate', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <StyledDateField
                        label="Invoice Date"
                        name="invoiceDate"
                        value={state.invoiceDetails.invoiceDate}
                        onChange={(e) => dispatch({ type: 'UPDATE_INVOICE', field: 'invoiceDate', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <StyledDateField
                        label="Function Date"
                        name="functionDate"
                        value={state.invoiceDetails.functionDate}
                        onChange={(e) => dispatch({ type: 'UPDATE_INVOICE', field: 'functionDate', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <ModernInputField
                        label="Mobile Number"
                        name="mobileNo"
                        placeholder="Enter phone number"
                        value={state.invoiceDetails.mobileNo}
                        onChange={(e) => dispatch({ type: 'UPDATE_INVOICE', field: 'mobileNo', value: e.target.value })}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <ModernInputField
                        label="Number of Pax"
                        name="pax"
                        type="number"
                        placeholder="Enter attendee count"
                        value={state.invoiceDetails.pax}
                        onChange={(e) => dispatch({ type: 'UPDATE_INVOICE', field: 'pax', value: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </HoverPaper>
              </Grid>
            </Grid>

            {/* Venue Details - Enhanced Table */}
            <SectionHeader>
              <CalendarToday />
              <Typography variant="h6">
                Venue Booking Details
              </Typography>
            </SectionHeader>
            <TableWrapper>
              <Table size="small" className="print-table">
                <TableHead>
                  <TableRow sx={{ 
                    background: 'linear-gradient(to right, #d9b121, #f5d742)',
                    '& th': { color: 'white', fontWeight: 'bold' }
                  }}>
                    <TableCell>#</TableCell>
                    <TableCell>Venue Name *</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Rental</TableCell>
                    <TableCell>AC Charge</TableCell>
                    <TableCell>Maintenance</TableCell>
                    <TableCell>Security</TableCell>
                    <TableCell>CGST%</TableCell>
                    <TableCell>SGST%</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell id='hide-on-print' className="no-print">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.venueRows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <PartyInputField
                        placeholder="Venue name *"
                        multiline
                        inputStyle={{width:180}}
                        value={row.name || ''}
                        onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'name', value: e.target.value })}
                        size="small"
                        fullWidth
                        className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          value={row.session || ''}
                          multiline
                          inputStyle={{width:130}}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'session', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          type="number"
                          value={row.rental}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'rental', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          type="number"
                          value={row.acCharge}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'acCharge', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          type="number"
                          value={row.maintenance}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'maintenance', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          type="number"
                          value={row.security}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'security', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          type="number"
                          value={row.cgst}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'cgst', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>
                        <PartyInputField
                          type="number"
                          value={row.sgst}
                          onChange={(e) => dispatch({ type: 'UPDATE_VENUE_ROW', id: row.id, field: 'sgst', value: e.target.value })}
                          size="small"
                          className="print-field"
                        />
                      </TableCell>
                      <TableCell>{calculateVenueTotal(row).toFixed(2)}</TableCell>
                      <TableCell id='hide-on-print' className="no-print">
                        <IconButton onClick={() => dispatch({ type: 'REMOVE_VENUE_ROW', id: row.id })} size="small">
                          <Remove fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`
              }}>
                <Button
                  id='hide-on-print'
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => dispatch({ type: 'ADD_VENUE_ROW' })}
                  size="small"
                  className="no-print"
                >
                  Add Venue
                </Button>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.1)} 100%)`,
                  padding: '8px 16px',
                  borderRadius: '12px'
                }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Venue Amount:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{venueTotalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </TableWrapper>

            {/* Menu Details */}
            <SectionHeader>
              <Restaurant />
              <Typography variant="h6">
                Menu Details
              </Typography>
            </SectionHeader>
            <TableWrapper>
              <Table size="small" className="print-table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                    <TableCell>No.</TableCell>
                    <TableCell>Description *</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>CGST%</TableCell>
                    <TableCell>SGST%</TableCell>
                    <TableCell>CGST Amt</TableCell>
                    <TableCell>SGST Amt</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell id='hide-on-print' className="no-print">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.menuRows.map((row, index) => {
                    const subtotal = row.qty * row.rate;
                    const sgstAmount = subtotal * (row.sgstPercent / 100);
                    const cgstAmount = subtotal * (row.cgstPercent / 100);
                    const total = subtotal + sgstAmount + cgstAmount;

                    return (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <PartyInputField
                            multiline
                            placeholder="Description *"
                            inputStyle={{width:180}}
                            value={row.description}
                            onChange={(e) => dispatch({ type: 'UPDATE_MENU_ROW', id: row.id, field: 'description', value: e.target.value })}
                            size="small"
                            fullWidth
                            className="print-field"
                          />
                        </TableCell>
                        <TableCell>
                          <PartyInputField
                            type="number"
                            value={row.qty}
                            onChange={(e) => dispatch({ type: 'UPDATE_MENU_ROW', id: row.id, field: 'qty', value: e.target.value })}
                            size="small"
                            className="print-field"
                          />
                        </TableCell>
                        <TableCell>
                          <PartyInputField
                            type="number"
                            value={row.rate}
                            onChange={(e) => dispatch({ type: 'UPDATE_MENU_ROW', id: row.id, field: 'rate', value: e.target.value })}
                            size="small"
                            className="print-field"
                          />
                        </TableCell>
                        <TableCell>{subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <PartyInputField
                            type="number"
                            value={row.cgstPercent}
                            onChange={(e) => dispatch({ type: 'UPDATE_MENU_ROW', id: row.id, field: 'cgstPercent', value: e.target.value })}
                            size="small"
                            className="print-field"
                          />
                        </TableCell>
                        <TableCell>
                          <PartyInputField
                            type="number"
                            value={row.sgstPercent}
                            onChange={(e) => dispatch({ type: 'UPDATE_MENU_ROW', id: row.id, field: 'sgstPercent', value: e.target.value })}
                            size="small"
                            className="print-field"
                          />
                        </TableCell>
                        <TableCell>{cgstAmount.toFixed(2)}</TableCell>
                        <TableCell>{sgstAmount.toFixed(2)}</TableCell>
                        <TableCell>{total.toFixed(2)}</TableCell>
                        <TableCell id='hide-on-print' className="no-print">
                          <IconButton onClick={() => dispatch({ type: 'REMOVE_MENU_ROW', id: row.id })} size="small">
                            <Remove fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${alpha(theme?.palette?.divider || '#e0e0e0', 0.1)}`
              }}>
                <Button
                  id='hide-on-print'
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => dispatch({ type: 'ADD_MENU_ROW' })}
                  size="small"
                  className="no-print"
                >
                  Add Menu Item
                </Button>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: `linear-gradient(135deg, ${alpha(theme?.palette?.primary?.main || '#1976d2', 0.1)} 0%, ${alpha(theme?.palette?.secondary?.main || '#dc004e', 0.1)} 100%)`,
                  padding: '8px 16px',
                  borderRadius: '12px'
                }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Menu Amount:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{menuTotalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </TableWrapper>

            {/* Enhanced Footer */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={12} md={5}>
                {/* <HoverPaper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Amount in Words:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {numberToWords(totalInvoiceAmount)}
                  </Typography>
                  <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #ddd' }}>
                    <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                      Member Signature
                    </Typography>
                    <Box sx={{ height: '60px', borderBottom: '1px solid #000' }}></Box>
                  </Box>
                </HoverPaper> */}
              </Grid>
              
              <Grid item sx={{visibility:'hidden'}} xs={12} md={2}>
                <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center'
                  }}>
                    <Box sx={{ 
                      width: '80%', 
                      height: '80%', 
                      borderLeft: '1px dashed #ddd',
                      borderRight: '1px dashed #ddd',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Typography variant="caption" sx={{ transform: 'rotate(-90deg)' }}>
                        OFFICIAL USE ONLY
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <HoverPaper sx={{ p: 2}}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Payment Summary
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mb: 1,
                    '&:not(:last-child)': { borderBottom: '1px solid rgba(0,0,0,0.1)' }
                  }}>
                    <Typography>Total Invoice Amount:</Typography>
                    <Typography fontWeight="bold">₹{totalInvoiceAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Total Received:</Typography>
                    <Typography fontWeight="bold">₹00.00</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Party Arrear:</Typography>
                    <Typography fontWeight="bold" color={partyArrear > 0 ? 'error' : 'success.main'}>
                      ₹{partyArrear.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="subtitle2">NET AMOUNT PAYABLE:</Typography>
                    <Typography variant="h6" color="primary">
                      ₹{partyArrear.toFixed(2)}
                    </Typography>
                  </Box>
                  {/* <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #ddd' }}>
                    <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                      Manager Signature
                    </Typography>
                    <Box sx={{ height: '60px', borderBottom: '1px solid #000' }}></Box>
                  </Box> */}
                </HoverPaper>
              </Grid>
            </Grid>
          </HoverPaper>

          <Box sx={{ mt: 3, textAlign: 'center' }} className="no-print">
            <AnimatedButton
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmitPartyInvoice}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              startIcon={<Receipt />}
              disabled={loading}
            >
              {isEdit ? (loading ? "updating.." : "Update Invoice") : (loading ? "Saving.." : "Save Invoice")}
            </AnimatedButton>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};

export default PartyInvoice;