import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Container,
  Grid,
  Button,
  Paper,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Chip,
  Avatar,
  Box,
  Tooltip,
  Collapse,
  TableFooter,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
  useMediaQuery,
  CircularProgress,
  Backdrop,
  InputAdornment,
} from "@mui/material";
import {
  Paid,
  PendingActions,
  Search,
  MoreVert,
  FileDownload,
  Add,
  Refresh,
  Receipt,
  Person,
  CalendarMonth,
  Inventory,
  AttachMoney,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
  Clear,
  Tag,
  TagFaces,
  Percent,
  AccountBalance,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { getMemberTransactions } from "../../services/Member";
import { getUserRole } from "../../services/Auth";
import { deleteTransaction } from "../../services/Transaction";
import { styled } from "@mui/material/styles";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";

// Enhanced styled components
const GradientCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
  color: theme.palette.common.white,
  borderRadius: 16,
  boxShadow: theme.shadows[8],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[12],
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(2),
    fontSize: '0.875rem',
  },
  '& .MuiTableHead-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      '& .MuiTableCell-root': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        padding: theme.spacing(2),
      },
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'all 0.3s ease',
      '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme.palette.action.hover, 0.05),
      },
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        transform: 'translateX(4px)',
        '& .MuiTableCell-root': {
          color: theme.palette.primary.main,
        },
      },
    },
  },
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    boxShadow: theme.shadows[4],
  },
  '&.Mui-focused': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    boxShadow: theme.shadows[8],
  },
  '& .MuiInputBase-root': {
    '&::before, &::after': {
      display: 'none',
    },
  },
}));

const FilterChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== '$isActive'
})(({ theme, $isActive }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 16,
  backgroundColor: $isActive 
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.grey[200], 0.8),
  color: $isActive ? theme.palette.primary.main : theme.palette.text.primary,
  border: $isActive ? `1px solid ${theme.palette.primary.main}` : 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: $isActive 
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.grey[300], 0.8),
    transform: 'translateY(-2px)',
  },
}));

const DetailTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(1.5),
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
  },
  '& .MuiTableHead-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      '& .MuiTableCell-root': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        padding: theme.spacing(1.5),
      },
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'all 0.3s ease',
      '&:nth-of-type(odd)': {
        backgroundColor: alpha(theme.palette.action.hover, 0.05),
      },
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        transform: 'translateX(4px)',
        '& .MuiTableCell-root': {
          color: theme.palette.primary.main,
        },
      },
    },
  },
  '& .MuiTableFooter-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      '& .MuiTableCell-root': {
        fontWeight: 600,
        color: theme.palette.primary.main,
        borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      },
      '&:last-child': {
        '& .MuiTableCell-root': {
          fontSize: '1rem',
          fontWeight: 700,
          color: theme.palette.primary.main,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 30%, ${alpha(theme.palette.secondary.main, 0.1)} 90%)`,
        },
      },
    },
  },
}));

const PaymentTransactions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State management
  const [searchQuery, setSearchQuery] = useState(sessionStorage?.getItem('searchTerm') || "");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    member: true,
    invoice: true,
    item: true,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Initialize date filters
  useEffect(() => {
    const today = dayjs();
    const localDate = dayjs(sessionStorage?.getItem('invoiceDate'));
    const localFormDate = localDate.subtract(1, 'day');
    const fromDate = today.subtract(6, 'day'); 
    const toDate = today;
    
    setFilterDateFrom(sessionStorage?.getItem('invoiceDate') ? localFormDate : fromDate);
    setFilterDateTo(sessionStorage?.getItem('invoiceDate') ? localDate : toDate);
  }, []);

  // Optimized data fetching
  const getAllMemberTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMemberTransactions();
      if (res.error) throw new Error(res.error);
      if (res?.transactions) setTransactionData(res.transactions);
      console.log(res.transactions)
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized search and filter logic
  const filteredData = useMemo(() => {
    return transactionData
      .flatMap((monthData) =>
        monthData.TransactionList.map((transaction) => ({
          ...transaction,
          memberName: monthData.memberName,
          memberPno: monthData.memberPno,
          memberID: monthData.memberID
        }))
      )
      .filter((transaction) => {
        // Apply search filter if there's a search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matches = [];
          
          if (searchFilters.member) {
            matches.push(
              transaction.memberName.toLowerCase().includes(query),
              transaction.memberPno.toLowerCase().includes(query),
              transaction.memberID.toLowerCase().includes(query)
            );
          }
          
          if (searchFilters.invoice) {
            matches.push(transaction.invoiceNumber.trim().includes(query));
          }
          
          if (searchFilters.item) {
            matches.push(transaction.items.some(item => 
              item.itemName.toLowerCase().includes(query)
            ));
          }
          
          if (!matches.some(match => match)) return false;
        }

        // Only apply date filters if both dates are selected
        if (filterDateFrom && filterDateTo) {
          const transactionDate = dayjs(transaction.invoiceDate);
          if (transactionDate.isBefore(filterDateFrom, 'day') || 
              transactionDate.isAfter(filterDateTo, 'day')) {
            return false;
          }
        }
        
        return true;
      })
      // Sort by date in descending order (newer first)
      .sort((a, b) => {
        const dateA = new Date(a.invoiceDate);
        const dateB = new Date(b.invoiceDate);
        return dateB - dateA;
      });
  }, [transactionData, searchQuery, filterDateFrom, filterDateTo, searchFilters]);

  // Optimized totals calculation
  const { totalAmount, totalGst } = useMemo(() => {
    return filteredData.reduce((acc, transaction) => {
      const transactionTotals = transaction.items.reduce(
        (sum, item) => {
          const gstPercentage = item.gstPercentage || 0;
          const gstAmount = item.amount * (gstPercentage / 100);
          return {
            totalAmount: sum.totalAmount + item.amount,
            totalGst: sum.totalGst + gstAmount
          };
        },
        { totalAmount: 0, totalGst: 0 }
      );
      return {
        totalAmount: acc.totalAmount + transactionTotals.totalAmount,
        totalGst: acc.totalGst + transactionTotals.totalGst
      };
    }, { totalAmount: 0, totalGst: 0 });
  }, [filteredData]);

  // Optimized handlers
  const handleSearch = useCallback((e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
    
    // Clear date filters when search is performed
    if (searchValue.trim() !== '') {
      setFilterDateFrom(null);
      setFilterDateTo(null);
    }
  }, []);

  const handleMenuOpen = useCallback((event, transaction) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const toggleRowExpand = useCallback((transactionId, event) => {
    if (event) {
      event.stopPropagation();
    }
    setExpandedRows(prev => ({
      ...prev,
      [transactionId]: !prev[transactionId]
    }));
  }, []);

  const handleDeleteClick = useCallback(() => {
    if (!selectedTransaction) return;
    setIsConfirmOpen(true);
    handleMenuClose();
  }, [selectedTransaction]);

  const handleCloseConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setSelectedTransaction(null);
    if (isDeleting) {
      setIsDeleting(false);
    }
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedTransaction) return;

    setIsDeleting(true);
    try {
      const localUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (!localUser) {
        console.error("User not found");
        return;
      }

      const roleRes = await getUserRole(localUser.username);
      if (!roleRes?.success) {
        console.error("Authorization failed:", roleRes.message);
        return;
      }

      const res = await deleteTransaction(
        localUser,
        selectedTransaction.memberPno,
        selectedTransaction._id,
        selectedTransaction.invoiceNumber,
        roleRes.userRole
      );

      if (res?.success) {
        await getAllMemberTransactions();
      } else {
        console.error("Deletion failed:", res?.message);
      }
    } catch (error) {
      console.error("Delete transaction error:", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedTransaction(null);
    }
  }, [selectedTransaction, getAllMemberTransactions]);

  // Optimized export function
  const exportToExcelv2 = useCallback(() => {
    const flattenedData = filteredData.flatMap((transaction) =>
      transaction.items.map((item) => ({
        "Invoice No": transaction.invoiceNumber,
        Date: new Date(transaction.invoiceDate).toLocaleDateString(),
        "Member ID": transaction.memberID || "N/A",
        "Member P.No": transaction.memberPno,
        "Member Name": transaction.memberName,
        "Item Name": item.itemName,
        "Item group": item?.itemGroup || "N/A",
        "Category": item?.itemGroup === 3 ? "Alcoholic" : item?.itemGroup === 5 ? "Kitchen" : item?.itemGroup === 6 ? "Snacks" : "Others",
        Quantity: item.qty,
        "Sale Price": (item.amount / item.qty).toFixed(2),
        "Purchase Rate": item?.purchaseRate || "N/A",
        "Sale Amount": item.amount.toFixed(2),
        "Purchase Amount": (item.purchaseRate * item.qty).toFixed(2),
        "GST Percentage": item.gstPercentage || 0,
        "GST Amount": item.amount * ((item.gstPercentage || 0) / 100).toFixed(2),
        "Total Sale Amount": item.amount + item.amount * ((item.gstPercentage || 0) / 100),
        "Alcohol": item.itemGroup === 3 ? item.amount.toFixed(2) : 0,
        "Alcohol with GST": item.itemGroup === 3 ? item.amount * ((item.gstPercentage || 0) / 100).toFixed(2) : 0,
        "Alcohol Total": item.itemGroup === 3 ? item.amount + item.amount * ((item.gstPercentage || 0) / 100) : 0,
        "Kitchen": item.itemGroup === 3 ? 0 : item.amount.toFixed(2),
        "Kitchen with GST": item.itemGroup === 3 ? 0 : item.amount * ((item.gstPercentage || 0) / 100).toFixed(2),
        "Kitchen Total": item.itemGroup === 3 ? 0 : item.amount + item.amount * ((item.gstPercentage || 0) / 100),
      }))
    );

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, `Transactions_${new Date().toISOString().slice(0,10)}.xlsx`);
  }, [filteredData]);

  useEffect(() => {
    getAllMemberTransactions();
  }, [getAllMemberTransactions]);


  const exportToExcel = useCallback(() => {
  if (!filteredData || filteredData.length === 0) {
    alert('No data to export');
    return;
  }

  // 1. Create detailed transaction data (your existing flattened data)
  const transactionDetails = filteredData.flatMap((transaction) =>
    transaction.items.map((item) => ({
      "Invoice No": transaction.invoiceNumber,
      Date: new Date(transaction.invoiceDate).toLocaleDateString(),
      "Member ID": transaction.memberID || "N/A",
      "Member P.No": transaction.memberPno,
      "Member Name": transaction.memberName,
      "Item Name": item.itemName,
      "Item Group": item?.itemGroup || "N/A",
      "Category": getCategoryName(item?.itemGroup),
      Quantity: item.qty,
      "Unit Price": (item.amount / item.qty).toFixed(2),
      "Purchase Rate": item?.purchaseRate || "N/A",
      "Sale Amount": item.amount.toFixed(2),
      "Purchase Amount": (item.purchaseRate * item.qty).toFixed(2),
      "GST Percentage": item.gstPercentage || 0,
      "GST Amount": (item.amount * (item.gstPercentage || 0) / 100).toFixed(2),
      "Total Amount": (item.amount * (1 + (item.gstPercentage || 0)/100)).toFixed(2),
    }))
  );

  // 2. Create member-wise summary
  const memberSummary = {};
  filteredData.forEach(transaction => {
    const memberKey = transaction.memberID || 'GUEST';
    if (!memberSummary[memberKey]) {
      memberSummary[memberKey] = {
        "Member ID": transaction.memberID || "N/A",
        "Member P.No": transaction.memberPno,
        "Member Name": transaction.memberName,
        "Total Invoices": 0,
        "Total Quantity": 0,
        "Total Sale Amount": 0,
        "Total GST": 0,
        "Grand Total": 0,
        "Alcohol Amount": 0,
        "Kitchen Amount": 0,
        "Other Amount": 0,
        "First Purchase": new Date(transaction.invoiceDate).toLocaleDateString(),
        "Last Purchase": new Date(transaction.invoiceDate).toLocaleDateString()
      };
    }

    const member = memberSummary[memberKey];
    member["Total Invoices"] += 1;
    transaction.items.forEach(item => {
      const itemAmount = item.amount;
      const gstAmount = itemAmount * (item.gstPercentage || 0) / 100;
      const totalAmount = itemAmount + gstAmount;
      
      member["Total Quantity"] += item.qty;
      member["Total Sale Amount"] += itemAmount;
      member["Total GST"] += gstAmount;
      member["Grand Total"] += totalAmount;

      // Categorize amounts
      if (item.itemGroup === 3) {
        member["Alcohol Amount"] += itemAmount;
      } else if (item.itemGroup === 5) {
        member["Kitchen Amount"] += itemAmount;
      } else {
        member["Other Amount"] += itemAmount;
      }
    });

    // Update first/last purchase dates
    const currentDate = new Date(transaction.invoiceDate);
    const firstDate = new Date(member["First Purchase"]);
    const lastDate = new Date(member["Last Purchase"]);
    
    if (currentDate < firstDate) member["First Purchase"] = currentDate.toLocaleDateString();
    if (currentDate > lastDate) member["Last Purchase"] = currentDate.toLocaleDateString();
  });

  // 3. Create item-wise analytics
  const itemAnalytics = {};
  filteredData.forEach(transaction => {
    transaction.items.forEach(item => {
      const itemKey = item.itemName;
      if (!itemAnalytics[itemKey]) {
        itemAnalytics[itemKey] = {
          "Item Name": item.itemName,
          "Category": getCategoryName(item.itemGroup),
          "Total Quantity": 0,
          "Total Sales": 0,
          "Average Price": 0,
          "Total GST": 0,
          "Unique Members": new Set(),
          "Total Purchases": 0
        };
      }

      const analytics = itemAnalytics[itemKey];
      analytics["Total Quantity"] += item.qty;
      analytics["Total Sales"] += item.amount;
      analytics["Total GST"] += item.amount * (item.gstPercentage || 0) / 100;
      analytics["Unique Members"].add(transaction.memberID || 'GUEST');
      analytics["Total Purchases"] += 1;
    });
  });

  // Calculate averages and finalize item analytics
  const finalItemAnalytics = Object.values(itemAnalytics).map(item => ({
    ...item,
    "Average Price": (item["Total Sales"] / item["Total Quantity"]).toFixed(2),
    "Unique Members": item["Unique Members"].size,
  }));

  // 4. Create workbook with multiple sheets
  const workbook = XLSX.utils.book_new();
  
  // Add sheets
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(transactionDetails),
    "Transaction Details"
  );
  
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(Object.values(memberSummary)),
    "Member Summary"
  );
  
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(finalItemAnalytics),
    "Item Analytics"
  );

  // 5. Export the file
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Transaction_Report_${dateStr}.xlsx`);
}, [filteredData]);

// Helper function
function getCategoryName(itemGroup) {
  switch(itemGroup) {
    case 3: return "Alcoholic";
    case 5: return "Kitchen"; 
    case 6: return "Snacks";
    default: return "Others";
  }
}


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4, mb: 12 }}>
        
        {/* Header with Actions */}
        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/invoice-billing")}
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
                onClick={exportToExcel}
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
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={getAllMemberTransactions}
                  sx={{
                    '&:hover': {
                      transform: 'rotate(180deg)',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Fade>

        {/* Stats Cards */}
        <Slide direction="up" in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2" color="inherit" sx={{ opacity: 0.9 }}>
                        TOTAL AMOUNT
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                        Total transaction value
                      </Typography>
                    </Box>
                    <Avatar sx={{ 
                      bgcolor: 'white', 
                      color: theme.palette.primary.main,
                      width: 48,
                      height: 48
                    }}>
                      <AttachMoney fontSize="medium" />
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
                        GST AMOUNT
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                        ₹{totalGst.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                        Calculated from actual GST rates
                      </Typography>
                    </Box>
                    <Avatar sx={{ 
                      bgcolor: 'white', 
                      color: theme.palette.warning.main,
                      width: 48,
                      height: 48
                    }}>
                      <PendingActions fontSize="medium" />
                    </Avatar>
                  </Box>
                </Box>
              </GradientCard>
            </Grid>
          </Grid>
        </Slide>

        {/* Enhanced Search and Filters */}
        <Fade in timeout={1200}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <SearchContainer>
                  <TextField
                    fullWidth
                    placeholder="Search by member name, ID or item..."
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
                    variant="standard"
                    sx={{
                      '& .MuiInputBase-root': {
                        p: 1,
                        '&::before, &::after': {
                          display: 'none',
                        },
                      },
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
                            <CalendarMonth color="action" />
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
                            <CalendarMonth color="action" />
                          </InputAdornment>
                        ),
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <FilterChip
                label="Member"
                $isActive={searchFilters.member}
                onClick={() => setSearchFilters(prev => ({ ...prev, member: !prev.member }))}
                icon={<Person fontSize="small" />}
              />
              <FilterChip
                label="Invoice"
                $isActive={searchFilters.invoice}
                onClick={() => setSearchFilters(prev => ({ ...prev, invoice: !prev.invoice }))}
                icon={<Receipt fontSize="small" />}
              />
              <FilterChip
                label="Item"
                $isActive={searchFilters.item}
                onClick={() => setSearchFilters(prev => ({ ...prev, item: !prev.item }))}
                icon={<Inventory fontSize="small" />}
              />
            </Box>
          </Paper>
        </Fade>

        {/* Transactions Table */}
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
                    <TableCell sx={{ width: '5%' }}>#</TableCell>
                    <TableCell sx={{ width: '15%' }}>Invoice</TableCell>
                    <TableCell sx={{ width: '15%' }}>Date</TableCell>
                    <TableCell sx={{ width: '20%' }}>Member</TableCell>
                    <TableCell sx={{ width: '20%' }}>Items</TableCell>
                    <TableCell sx={{ width: '10%' }} align="right">Amount</TableCell>
                    <TableCell sx={{ width: '5%' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="textSecondary">
                            No transactions found
                          </Typography>
                          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                            Try adjusting your search criteria or filters
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transaction, index) => {
                        const totalAmount = transaction.items.reduce((sum, item) => sum + item.amount, 0);
                        const totalGst = transaction.items.reduce((sum, item) => {
                          const gstPercentage = item.gstPercentage || 0;
                          return sum + (item.amount * (gstPercentage / 100));
                        }, 0);
                        const totalWithGst = totalAmount + totalGst;
                        const isExpanded = expandedRows[transaction._id];
                        
                        return (
                          <React.Fragment key={transaction._id}>
                            <TableRow 
                              hover 
                              onClick={(e) => toggleRowExpand(transaction._id, e)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                              <TableCell>
                                <Typography fontWeight="medium" onClick={() => navigate(`/transaction-details/${transaction.invoiceNumber.split('#')[1]}` ,{ state: transaction })}>
                                  {transaction.invoiceNumber}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {new Date(transaction.invoiceDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar sx={{ 
                                    width: 32, 
                                    height: 32,
                                    bgcolor: 'action.selected',
                                    color: 'text.primary'
                                  }}>
                                    <Person fontSize="small" />
                                  </Avatar>
                                  <Box>
                                    <Typography>{transaction.memberName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      P.No: {transaction.memberPno}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {transaction.items.slice(0, 2).map((item, i) => (
                                    <Chip
                                      key={i}
                                      label={`${item.itemName} (${item.qty})`}
                                      size="small"
                                      sx={{ 
                                        borderRadius: 1,
                                        '&:hover': {
                                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                        }
                                      }}
                                    />
                                  ))}
                                  {transaction.items.length > 2 && (
                                    <Tooltip title="Click to view all items">
                                      <Chip
                                        label={`+${transaction.items.length - 2} more`}
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleRowExpand(transaction._id);
                                        }}
                                        clickable
                                        icon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        sx={{ 
                                          borderRadius: 1,
                                          '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                          }
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography fontWeight="bold">
                                  ₹{totalAmount.toFixed(2)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton 
                                  size="small"
                                  onClick={(e) => handleMenuOpen(e, transaction)}
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
                            
                            {/* Expanded row with details */}
                            <TableRow>
                              <TableCell colSpan={7} sx={{ p: 0, borderBottom: isExpanded ? null : 0 }}>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                  <Box sx={{ 
                                    p: 3, 
                                    bgcolor: 'background.default',
                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                                  }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'space-between',
                                      mb: 2,
                                    }}>
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          fontWeight: 600,
                                          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent',
                                        }}
                                      >
                                        Invoice Details
                                      </Typography>
                                      <Chip
                                        label={`Total Items: ${transaction.items.length}`}
                                        size="small"
                                        sx={{
                                          borderRadius: 1,
                                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                          color: theme.palette.primary.main,
                                          fontWeight: 500,
                                        }}
                                      />
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <DetailTable size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Item</TableCell>
                                          <TableCell align="right">Qty</TableCell>
                                          <TableCell align="right">Unit Price</TableCell>
                                          <TableCell align="right">Amount</TableCell>
                                          <TableCell align="right">GST (%)</TableCell>
                                          <TableCell align="right">GST Amount</TableCell>
                                          <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {transaction.items.map((item, idx) => {
                                          const unitPrice = item.amount / item.qty;
                                          const gstPercentage = item.gstPercentage || 0;
                                          const gstAmount = item.amount * (gstPercentage / 100);
                                          const itemTotal = item.amount + gstAmount;
                                          
                                          return (
                                            <TableRow key={idx}>
                                              <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                  <Avatar 
                                                    sx={{ 
                                                      width: 24, 
                                                      height: 24,
                                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                      color: theme.palette.primary.main,
                                                      fontSize: '0.75rem',
                                                    }}
                                                  >
                                                    {idx + 1}
                                                  </Avatar>
                                                  <Typography>{item.itemName}</Typography>
                                                </Box>
                                              </TableCell>
                                              <TableCell align="right">{item.qty}</TableCell>
                                              <TableCell align="right">₹{unitPrice.toFixed(2)}</TableCell>
                                              <TableCell align="right">₹{item.amount.toFixed(2)}</TableCell>
                                              <TableCell align="right">{gstPercentage}%</TableCell>
                                              <TableCell align="right">₹{gstAmount.toFixed(2)}</TableCell>
                                              <TableCell align="right">₹{itemTotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                      <TableFooter>
                                        <TableRow>
                                          <TableCell colSpan={3} align="right">Subtotal:</TableCell>
                                          <TableCell align="right">₹{totalAmount.toFixed(2)}</TableCell>
                                          <TableCell align="right"></TableCell>
                                          <TableCell align="right">₹{totalGst.toFixed(2)}</TableCell>
                                          <TableCell align="right">₹{totalWithGst.toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell colSpan={6} align="right">Total:</TableCell>
                                          <TableCell align="right">
                                            <Typography 
                                              variant="subtitle1" 
                                              sx={{
                                                fontWeight: 700,
                                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                              }}
                                            >
                                              ₹{totalWithGst.toFixed(2)}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      </TableFooter>
                                    </DetailTable>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })
                  )}
                </TableBody>
              </StyledTable>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              navigate(`/transaction-details/${selectedTransaction.invoiceNumber.split('#')[1]}`, { state: selectedTransaction })
            }}
          >
            Check Details
          </MenuItem>
          <MenuItem 
            onClick={() => {
              navigate('/invoice-billing', { state: {
                ...selectedTransaction,
                isEdit: true
              }});
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
        
        {/* Render the ConfirmDialog component */}
        {selectedTransaction && (
          <ConfirmDialog
            open={isConfirmOpen}
            onClose={handleCloseConfirm}
            onConfirm={handleConfirmDelete}
            title="Delete Transaction"
            message={`Are you sure you want to delete transaction ${selectedTransaction.invoiceNumber}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isDeleting}
            summaryData={{
              "Invoice": selectedTransaction?.invoiceNumber,
              "Date": new Date(selectedTransaction?.invoiceDate).toLocaleDateString(),
              "Member": selectedTransaction?.memberName,
              "Amount": `₹${selectedTransaction?.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`
            }}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default PaymentTransactions;