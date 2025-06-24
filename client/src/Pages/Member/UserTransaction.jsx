import React, { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Chip,
  Grid,
  Button,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
  useMediaQuery,
  Collapse,
  CircularProgress,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx"; 

import {
  Receipt as ReceiptIcon,
  ShoppingBasket as LocalGroceryStoreIcon,
  Tag as TagIcon,
  CalendarToday as CalendarTodayIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  ArrowUpward as SortAscIcon,
  ArrowDownward as SortDescIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CurrencyRupee,
} from "@mui/icons-material";

import LoadingScreen from "../../components/Loader/LoadingScreen";
import SignInFooter from "../LandingPage/SignIn-Footer";

// Modern styled components
const GradientCard = styled(Card)(({ theme }) => ({
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



const MonthCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflowX: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  }
}));

// Enhanced styled components
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
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const FilterChip = styled(Chip)(({ theme, $isActive }) => ({
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

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(2),
  },
  '& .MuiTableHead-root': {
    '& .MuiTableRow-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      '& .MuiTableCell-root': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        fontSize: '0.875rem',
        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
      },
    },
  },
}));

const UserTransactions = () => {
  const [transaction, setTransaction] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    invoice: true,
    date: true,
    item: true,
    amount: true,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { userId } = useParams();

  console.log(userId)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num);
  };

  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const memberTransactionList = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const memberService = await import("../../services/Member");
      const res = await memberService.getIndividualMemberTransaction(userId);
      if (res?.error) throw new Error(res.error);

      if (res && res.transactions) {
        setTransaction(res.transactions);
        // Initialize expanded state for all months
        const months = groupTransactionsByMonth(res.transactions);
        const initialExpanded = {};
        Object.keys(months).forEach(month => {
          initialExpanded[month] = true;
        });
        setExpandedMonths(initialExpanded);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    memberTransactionList(userId);
  }, [userId]);

  const groupTransactionsByMonth = (transactions) => {
    const grouped = {};
    transactions.forEach((t) => {
      const month = new Date(t.FromDate).toLocaleString("default", { 
        month: "long",
        year: "numeric"
      });
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(t);
    });
    return grouped;
  };

  // Enhanced search function
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = transaction.filter(t => {
      const matches = [];
      
      if (searchFilters.invoice) {
        const invoiceMatch = t.TransactionList?.some(item =>
          item.invoiceNumber?.toLowerCase().includes(query.toLowerCase())
        );
        matches.push(invoiceMatch);
      }
      
      if (searchFilters.date) {
        const dateMatch = t.TransactionList?.some(item =>
          formatDate(item.invoiceDate).toLowerCase().includes(query.toLowerCase())
        );
        matches.push(dateMatch);
      }
      
      if (searchFilters.item) {
        const itemMatch = t.TransactionList?.some(item =>
          item.items?.some(i =>
            i.itemName?.toLowerCase().includes(query.toLowerCase())
          )
        );
        matches.push(itemMatch);
      }
      
      if (searchFilters.amount) {
        const amountMatch = t.TransactionList?.some(item =>
          item.items?.some(i =>
            formatCurrency(i.amount).toLowerCase().includes(query.toLowerCase())
          )
        );
        matches.push(amountMatch);
      }
      
      return matches.some(match => match);
    });

    setSearchResults(results);
    setIsSearching(false);
  }, [transaction, searchFilters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const filteredTransactions = useMemo(() => {
    if (!transaction || transaction.length === 0) return [];
    
    let filtered = transaction.filter((t) => {
      // Search in invoice numbers
      const invoiceMatch = t.TransactionList?.some(item =>
        item.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Search in item names
      const itemMatch = t.TransactionList?.some(item =>
        item.items?.some(i =>
          i.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      return invoiceMatch || itemMatch;
    });
  
    return filtered;
  }, [searchQuery, transaction]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByMonth(filteredTransactions);
  }, [filteredTransactions]);

  // Get current month transactions count
  // Add this calculation to your useMemo section
const currentMonthTotalAmount = useMemo(() => {
  const currentMonth = getCurrentMonthName();
  const currentMonthTransactions = groupedTransactions[currentMonth] || [];
  
  return currentMonthTransactions.reduce(
    (sum, t) => sum + (t.TransactionList?.reduce(
      (itemSum, item) => itemSum + (item.items?.reduce(
        (amtSum, i) => amtSum + (Number(i.amount) || 0), 0) || 0), 0) || 0), 0);
}, [groupedTransactions]);


  // Calculate total amount safely
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, t) => sum + (t.TransactionList?.reduce(
        (itemSum, item) => itemSum + (item.items?.reduce(
          (amtSum, i) => amtSum + (Number(i.amount) || 0), 0) || 0), 0) || 0), 0);
  }, [filteredTransactions]);



  const transformTransactionData = (transactions) => {
    return transactions.flatMap((t) =>
      t.TransactionList?.flatMap((item) =>
        item.items?.map((i) => ({
          'Invoice Number': item.invoiceNumber || '',
          'Invoice Date': formatDate(item.invoiceDate) || '',
          'Item Name': i.itemName || '',
          Quantity: i.qty || 0,
          Amount: formatCurrency(i.amount),
          'GST Percentage': `${i.gstPercentage}%` || '0%',
        })) || []
      ) || []
    );
  };

  const exportToExcel = (month, transactions) => {
    const worksheetData = transformTransactionData(transactions);
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, month.substring(0, 31));
    XLSX.writeFile(workbook, `${month.replace(' ', '_')}_Transactions.xlsx`);
  };

  const toggleMonthExpansion = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingScreen />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <GradientCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Transaction Report
            </Typography>
          </CardContent>
        </GradientCard>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={memberTransactionList}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Card>
      </Container>
    );
  }

  if (!transaction || transaction.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <GradientCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Transaction Report
            </Typography>
          </CardContent>
        </GradientCard>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No transactions found for this member
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={memberTransactionList}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Refresh
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <GradientCard sx={{ mb: 4 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: 'white', 
                      mr: 2,
                      boxShadow: theme.shadows[4],
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: theme.shadows[8],
                      }
                    }}
                  >
                    <ReceiptIcon color="primary" />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      component="div"
                      sx={{
                        fontWeight: 600,
                        textShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.2)}`
                      }}
                    >
                      Transaction Report
                    </Typography>
                    <Typography 
                      variant="subtitle1"
                      sx={{
                        color: alpha(theme.palette.common.white, 0.9)
                      }}
                    >
                      {transaction[0]?.memberName}
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title="Refresh data">
                  <IconButton 
                    onClick={memberTransactionList} 
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        transform: 'rotate(180deg)',
                        backgroundColor: alpha(theme.palette.common.white, 0.1)
                      }
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </GradientCard>
        </Fade>

        {/* Summary Cards */}
        <Slide direction="up" in timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={3}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    CURRENT MONTH TOTAL AMOUNT
                  </Typography>
                  <Typography 
                    variant="h4" 
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {formatCurrency(currentMonthTotalAmount)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {getCurrentMonthName()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={3}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    TOTAL AMOUNT
                  </Typography>
                  <Typography 
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {formatCurrency(totalAmount)}
                  </Typography>

                  <Typography variant="caption" color="textSecondary">
                    Total Amount for all time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Slide>

        {/* Enhanced Search Section */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <SearchContainer>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                endAdornment={
                  isSearching && (
                    <CircularProgress size={20} color="primary" sx={{ mr: 2 }} />
                  )
                }
              />
            </SearchContainer>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <FilterChip
                label="Invoice"
                $isActive={searchFilters.invoice}
                onClick={() => setSearchFilters(prev => ({ ...prev, invoice: !prev.invoice }))}
                icon={<TagIcon fontSize="small" />}
              />
              <FilterChip
                label="Date"
                $isActive={searchFilters.date}
                onClick={() => setSearchFilters(prev => ({ ...prev, date: !prev.date }))}
                icon={<CalendarTodayIcon fontSize="small" />}
              />
              <FilterChip
                label="Item"
                $isActive={searchFilters.item}
                onClick={() => setSearchFilters(prev => ({ ...prev, item: !prev.item }))}
                icon={<LocalGroceryStoreIcon fontSize="small" />}
              />
              <FilterChip
                label="Amount"
                $isActive={searchFilters.amount}
                onClick={() => setSearchFilters(prev => ({ ...prev, amount: !prev.amount }))}
                icon={<CurrencyRupee fontSize="small" />}
              />
            </Box>

            {searchQuery && (
              <Fade in timeout={500}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    {searchResults.length} results found
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
        </Fade>

        {/* Month-wise Transactions */}
        {Object.keys(groupedTransactions).map((month) => (
          <Fade in timeout={1400} key={month}>
            <MonthCard elevation={2} sx={{ mb: 4 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="span">
                        {month}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => exportToExcel(month, groupedTransactions[month])}
                        disabled={!groupedTransactions[month] || groupedTransactions[month].length === 0}
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
                      <IconButton
                        onClick={() => toggleMonthExpansion(month)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        {expandedMonths[month] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                }
                sx={{
                  backgroundColor: alpha(theme.palette.grey[100], 0.5),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Collapse in={expandedMonths[month]}>
                <CardContent sx={{ p: 0 }}>
                  {(searchQuery 
                    ? groupedTransactions[month].filter(t => 
                        searchResults.some(result => result === t)
                      )
                    : groupedTransactions[month]
                  ).map((transaction, index) => {
                    const totalAmount = transaction.TransactionList?.reduce(
                      (sum, transactionItem) =>
                        sum + (transactionItem.items?.reduce(
                          (itemSum, item) => itemSum + (Number(item.amount) || 0), 0) || 0), 0);
                    const totalQuantity = transaction.TransactionList?.reduce(
                      (sum, transactionItem) =>
                        sum + (transactionItem.items?.reduce(
                          (itemSum, item) => itemSum + (Number(item.qty) || 0), 0) || 0), 0);

                    return (
                      <Box key={index} sx={{ mb: 3, p: 3 }}>
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={`From ${formatDate(transaction.FromDate)} to ${formatDate(transaction.ToDate)}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          />
                        </Box>
                        <TableContainer 
                          component={Paper} 
                          elevation={0}
                          sx={{
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            overflow: 'auto'
                          }}
                        >
                          <StyledTable size="medium">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <TagIcon sx={{ mr: 1, fontSize: 18 }} />
                                    Invoice
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                                    Date
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <LocalGroceryStoreIcon sx={{ mr: 1, fontSize: 18 }} />
                                    Item
                                  </Box>
                                </TableCell>
                                <TableCell align="right">Qty</TableCell>
                                <TableCell align="right">Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {transaction.TransactionList?.map((transactionItem, idx) =>
                                transactionItem.items?.map((item, itemIdx) => (
                                  <TableRow key={`${idx}-${itemIdx}`}>
                                    <TableCell>{transactionItem.invoiceNumber}</TableCell>
                                    <TableCell>{formatDate(transactionItem.invoiceDate)}</TableCell>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell align="right">{item.qty}</TableCell>
                                    <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                  </TableRow>
                                ))
                              )}
                              <TableRow sx={{ 
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                '& td': {
                                  color: theme.palette.primary.main,
                                  fontWeight: 600,
                                }
                              }}>
                                <TableCell colSpan={3}>
                                  <strong>Total</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>{totalQuantity}</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>{formatCurrency(totalAmount)}</strong>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </StyledTable>
                        </TableContainer>
                      </Box>
                    );
                  })}
                </CardContent>
              </Collapse>
            </MonthCard>
          </Fade>
        ))}

        {/* No Results State */}
        {searchQuery && searchResults.length === 0 && (
          <Fade in timeout={500}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                py: 8,
                textAlign: 'center'
              }}
            >
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No transactions found
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>

      <SignInFooter/>
    </Suspense>
  );
};

export default UserTransactions;