import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Divider,
  Chip,
  Avatar,
  Container,
  Tooltip,
  Button,
  CircularProgress,
  InputLabel,
  Pagination
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Download, 
  Refresh, 
  Person, 
  Restaurant, 
  Inventory, 
  Timeline,
  BarChart as BarChartIcon,
  AutoAwesome,
  CalendarMonth
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getMemberTransactions } from '../../services/Member';
import { fetchInventoryItems } from '../../services/Inventory';
import ItemPopularityChart from '../../components/Analytics/ItemPopularityChart'
import MemberConsumptionChart from '../../components/Analytics/MemberConsumptionChart'
import TimeSeriesChart from '../../components/Analytics/TimeSeriesChart'
import DetailedConsumptionTable from '../../components/Analytics/DetailedConsumptionTable'
import { 
  getAllTransactions,
  getMemberConsumptionStats,
  getItemPopularityStats,
  getTimeSeriesData,
  getLowStockAlerts,
  getDetailedMemberConsumption,
  getCostRevenueAnalysis,
  getInventoryUtilization,
} from '../../Data/dataProcessors';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CategoryDistribution from '../../components/Analytics/CategoryDistribution';
import ItemConsumptionDetails from '../../components/Analytics/ItemConsumptionDetails';
import PeakHoursAnalysis from '../../components/Analytics/PeakHoursAnalysis';
import DayWisePatterns from '../../components/Analytics/DayWisePatterns';
import BusinessInsights from '../../components/Analytics/BusinessInsights';
import CustomerBehavior from '../../components/Analytics/CustomerBehavior';
import InventoryAnalysis from '../../components/Analytics/InventoryAnalysis';
import InventoryPredictions from '../../components/Analytics/InventoryPredictions';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

// Memoized filter components
const FilterSection = React.memo(({ 
  searchTerm, 
  setSearchTerm, 
  dateRange, 
  setDateRange, 
  onClearFilters 
}) => (
  <Paper sx={{ 
    p: 3, 
    mb: 4,
    borderRadius: 3,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          placeholder="Search members or items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <DatePicker
          label="Start Date"
          value={dateRange.start}
          onChange={(newValue) => setDateRange({...dateRange, start: newValue})}
          slotProps={{
            textField: {
              fullWidth: true
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <DatePicker
          label="End Date"
          value={dateRange.end}
          onChange={(newValue) => setDateRange({...dateRange, end: newValue})}
          slotProps={{
            textField: {
              fullWidth: true
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={1}>
        <Tooltip title="Clear Filters">
          <IconButton 
            onClick={onClearFilters}
            sx={{ height: '100%' }}
          >
            <FilterList />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  </Paper>
));

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('all');
  const [data, setData] = useState({
    members: [],
    inventory: [],
    transactions: [],
    memberStats: [],
    itemStats: [],
    timeSeries: [],
    detailedConsumption: [],
    inventoryUtilization: [],
    costRevenue: [],
    lowStockItems: []
  });
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Cache for processed data
  const dataCache = useRef(new Map());

  // Add these state variables at the top of the component
  const [timeRange, setTimeRange] = useState('month');
  const [memberSortBy, setMemberSortBy] = useState('consumption');
  const [trendView, setTrendView] = useState('daily');
  const [trendMetric, setTrendMetric] = useState('amount');
  const [memberRange, setMemberRange] = useState('top5');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data from APIs
  const fetchData = useCallback(async () => {
    try {
      const [transactionsRes, inventoryRes] = await Promise.all([
        getMemberTransactions(),
        fetchInventoryItems()
      ]);

      if (transactionsRes.error) throw new Error(transactionsRes.error);
      if (inventoryRes.error) throw new Error(inventoryRes.error);

      const transactions = transactionsRes.transactions || [];
      const inventory = inventoryRes.data || [];

      // Process data in chunks to avoid blocking the main thread
      const processData = () => {
        const chunkSize = 100;
        const chunks = [];
        for (let i = 0; i < transactions.length; i += chunkSize) {
          chunks.push(transactions.slice(i, i + chunkSize));
        }

        const processChunk = (chunk) => {
          return {
            transactions: getAllTransactions(chunk),
            memberStats: getMemberConsumptionStats(chunk),
            itemStats: getItemPopularityStats(chunk),
            timeSeries: getTimeSeriesData(chunk),
            detailedConsumption: getDetailedMemberConsumption(chunk)
            .flatMap(member => 
              member.transactions.map(txn => ({
                ...txn,
                memberName: member.memberName,
                memberPno: member.memberPno,
                memberId: member.memberId
              }))
            )
          };
        };

        const processed = chunks.reduce((acc, chunk) => {
          const processed = processChunk(chunk);
          return {
            transactions: [...acc.transactions, ...processed.transactions],
            memberStats: [...acc.memberStats, ...processed.memberStats],
            itemStats: [...acc.itemStats, ...processed.itemStats],
            timeSeries: [...acc.timeSeries, ...processed.timeSeries],
            detailedConsumption: [...acc.detailedConsumption, ...processed.detailedConsumption]
          };
        }, {
          transactions: [],
          memberStats: [],
          itemStats: [],
          timeSeries: [],
          detailedConsumption: []
        });

        // Process inventory utilization and cost revenue data
        const inventoryUtilization = getInventoryUtilization(inventory, transactions);
        const costRevenue = getCostRevenueAnalysis(transactions);

        return {
          ...processed,
          inventoryUtilization,
          costRevenue
        };
      };

      const processedData = processData();

      setData({
        members: transactions,
        inventory,
        ...processedData,
        lowStockItems: getLowStockAlerts(inventory)
      });

      // Also update inventoryData state
      setInventoryData(inventory);

      // Clear cache when new data is fetched
      dataCache.current.clear();
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to fetch analytics data', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    const cacheKey = JSON.stringify({
      dateRange,
      selectedMember,
      selectedItem,
      searchTerm,
      viewMode
    });

    if (dataCache.current.has(cacheKey)) {
      return dataCache.current.get(cacheKey);
    }

    let filtered = { ...data };

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      filtered.transactions = filtered.transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return (!startDate || txnDate >= startDate) && (!endDate || txnDate <= endDate);
      });

      filtered.detailedConsumption = filtered.detailedConsumption.filter(txn => {
        const txnDate = new Date(txn.date);
        return (!startDate || txnDate >= startDate) && (!endDate || txnDate <= endDate);
      });
    }

    // Apply member filter
    if (selectedMember) {
      filtered.transactions = filtered.transactions.filter(txn => txn.memberID === selectedMember);
      filtered.detailedConsumption = filtered.detailedConsumption.filter(txn => txn.memberId === selectedMember);
    }

    // Apply item filter
    if (selectedItem) {
      filtered.transactions = filtered.transactions.filter(txn => 
        txn.items.some(item => item.itemName === selectedItem)
      );
      filtered.detailedConsumption = filtered.detailedConsumption.filter(txn =>
        txn.items.some(item => item.itemName === selectedItem)
      );
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered.transactions = filtered.transactions.filter(txn =>
        txn.memberName.toLowerCase().includes(searchLower) ||
        txn.items.some(item => item.itemName.toLowerCase().includes(searchLower))
      );
      filtered.detailedConsumption = filtered.detailedConsumption.filter(txn =>
        txn.memberName.toLowerCase().includes(searchLower) ||
        txn.items.some(item => item.itemName.toLowerCase().includes(searchLower))
      );
    }

    // Always include the latest inventory data
    filtered.inventory = inventoryData;

    // Cache the filtered data
    dataCache.current.set(cacheKey, filtered);
    return filtered;
  }, [data, dateRange, selectedMember, selectedItem, searchTerm, viewMode, inventoryData]);

  const handleMemberSelect = useCallback((memberId) => {
    setSelectedMember(memberId);
    setActiveTab(0);
  }, []);

  const handleItemSelect = useCallback((itemName) => {
    setSelectedItem(itemName);
    setActiveTab(1);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    setActiveTab(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateRange({ start: null, end: null });
    setSelectedMember('');
    setSelectedItem(null);
    setSelectedCategory(null);
    setSearchTerm('');
  }, []);

  const handleMemberRangeChange = useCallback((range) => {
    setMemberRange(range);
    setPage(1);
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when changing page size
  };

  // Calculate business insights
  const insights = useMemo(() => {
    if (!filteredData.transactions.length) return null;

    const totalRevenue = filteredData.transactions.reduce((sum, txn) => sum + txn.totalAmount, 0);
    const uniqueCustomers = new Set(filteredData.transactions.map(txn => txn.memberID)).size;
    const avgTransactionValue = totalRevenue / filteredData.transactions.length;
    const avgCustomerValue = totalRevenue / uniqueCustomers;

    // Calculate peak hour
    const hourlyTransactions = filteredData.transactions.reduce((acc, txn) => {
      const hour = new Date(txn.date).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    const peakHour = Object.entries(hourlyTransactions)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Calculate category performance
    const categoryRevenue = filteredData.transactions.reduce((acc, txn) => {
      txn.items.forEach(item => {
        const category = item.itemGroup === 3 ? 'Alcoholic' :
                        item.itemGroup === 5 ? 'Kitchen' :
                        item.itemGroup === 6 ? 'Snacks' : 'Others';
        acc[category] = (acc[category] || 0) + item.amount;
      });
      return acc;
    }, {});

    const topCategories = Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({
        category,
        revenue,
        percentage: (revenue / totalRevenue) * 100,
        growth: 0, // You can calculate this if you have historical data
        transactionCount: filteredData.transactions.filter(txn => 
          txn.items.some(item => {
            const itemCategory = item.itemGroup === 3 ? 'Alcoholic' :
                               item.itemGroup === 5 ? 'Kitchen' :
                               item.itemGroup === 6 ? 'Snacks' : 'Others';
            return itemCategory === category;
          })
        ).length,
        uniqueItems: new Set(filteredData.transactions
          .flatMap(txn => txn.items)
          .filter(item => {
            const itemCategory = item.itemGroup === 3 ? 'Alcoholic' :
                               item.itemGroup === 5 ? 'Kitchen' :
                               item.itemGroup === 6 ? 'Snacks' : 'Others';
            return itemCategory === category;
          })
          .map(item => item.itemName)
        ).size
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    // Calculate revenue growth (if you have historical data)
    const revenueGrowth = 0; // You can calculate this if you have historical data

    return {
      totalRevenue,
      avgTransactionValue,
      uniqueCustomers,
      avgCustomerValue,
      peakHour,
      lowStockItems: filteredData.lowStockItems?.length || 0,
      revenueGrowth,
      topCategories
    };
  }, [filteredData]);

  // Calculate customer insights
  const customerInsights = useMemo(() => {
    if (!filteredData.transactions.length) return null;

    // Group transactions by member
    const memberTransactions = filteredData.transactions.reduce((acc, txn) => {
      if (!acc[txn.memberID]) {
        acc[txn.memberID] = {
          memberId: txn.memberID,
          memberName: txn.memberName,
          transactions: [],
          totalSpent: 0,
          visitCount: 0
        };
      }
      acc[txn.memberID].transactions.push(txn);
      acc[txn.memberID].totalSpent += txn.totalAmount;
      acc[txn.memberID].visitCount += 1;
      return acc;
    }, {});

    // Convert to array and sort by total spent
    const members = Object.values(memberTransactions)
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Calculate average spend
    const avgSpend = members.reduce((sum, m) => sum + m.totalSpent, 0) / members.length;

    // Segment customers
    const segments = {
      highValue: members.filter(m => m.totalSpent > avgSpend * 1.5),
      regular: members.filter(m => m.totalSpent <= avgSpend * 1.5 && m.totalSpent > avgSpend * 0.5),
      occasional: members.filter(m => m.totalSpent <= avgSpend * 0.5)
    };

    // Calculate visit patterns
    const visitPatterns = filteredData.transactions.reduce((acc, txn) => {
      const day = new Date(txn.date).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const hourlyPatterns = filteredData.transactions.reduce((acc, txn) => {
      const hour = new Date(txn.date).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    return {
      segments,
      visitPatterns: Object.entries(visitPatterns).map(([day, count]) => ({ day, count })),
      hourlyPatterns: Object.entries(hourlyPatterns).map(([hour, count]) => ({ hour, count }))
    };
  }, [filteredData]);

  const exportToExcel = useCallback(() => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // 1. Business Insights Sheet
      const businessInsightsData = [
        ['Business Insights'],
        ['Metric', 'Value'],
        ['Total Revenue', `₹${insights?.totalRevenue.toLocaleString()}`],
        ['Average Transaction Value', `₹${insights?.avgTransactionValue.toLocaleString()}`],
        ['Unique Customers', insights?.uniqueCustomers],
        ['Average Customer Value', `₹${insights?.avgCustomerValue.toLocaleString()}`],
        ['Peak Hour', `${insights?.peakHour}:00`],
        ['Low Stock Items', insights?.lowStockItems],
        ['Revenue Growth', `${insights?.revenueGrowth.toFixed(1)}%`],
        [],
        ['Top Performing Categories'],
        ['Category', 'Revenue', 'Percentage', 'Growth', 'Transactions', 'Unique Items'],
        ...(insights?.topCategories || []).map(cat => [
          cat.category,
          `₹${cat.revenue.toLocaleString()}`,
          `${cat.percentage.toFixed(1)}%`,
          `${cat.growth.toFixed(1)}%`,
          cat.transactionCount,
          cat.uniqueItems
        ])
      ];
      
      // 2. Member Consumption Sheet
      const memberConsumptionData = [
        ['Member Consumption Overview'],
        ['Member Name', 'Total Consumption', 'Transaction Count', 'Average Value', 'Last Visit'],
        ...filteredData.memberStats.map(member => [
          member.memberName,
          `₹${member.totalConsumption.toLocaleString()}`,
          member.transactionCount,
          `₹${(member.totalConsumption / member.transactionCount).toFixed(2)}`,
          dayjs(member.lastTransactionDate).format('YYYY-MM-DD')
        ])
      ];

      // 3. Customer Segments Sheet
      const customerSegmentsData = [
        ['Customer Segments Analysis'],
        ['Segment', 'Customers', 'Average Spend', 'Average Visits'],
        ['High Value', 
          customerInsights?.segments.highValue.length,
          `₹${Math.round(customerInsights?.segments.highValue.reduce((sum, c) => sum + c.totalSpent, 0) / 
            customerInsights?.segments.highValue.length || 0).toLocaleString()}`,
          Math.round(customerInsights?.segments.highValue.reduce((sum, c) => sum + c.visitCount, 0) / 
            customerInsights?.segments.highValue.length || 0)
        ],
        ['Regular',
          customerInsights?.segments.regular.length,
          `₹${Math.round(customerInsights?.segments.regular.reduce((sum, c) => sum + c.totalSpent, 0) / 
            customerInsights?.segments.regular.length || 0).toLocaleString()}`,
          Math.round(customerInsights?.segments.regular.reduce((sum, c) => sum + c.visitCount, 0) / 
            customerInsights?.segments.regular.length || 0)
        ],
        ['Occasional',
          customerInsights?.segments.occasional.length,
          `₹${Math.round(customerInsights?.segments.occasional.reduce((sum, c) => sum + c.totalSpent, 0) / 
            customerInsights?.segments.occasional.length || 0).toLocaleString()}`,
          Math.round(customerInsights?.segments.occasional.reduce((sum, c) => sum + c.visitCount, 0) / 
            customerInsights?.segments.occasional.length || 0)
        ]
      ];

      // 4. Item Analytics Sheet
      const itemAnalyticsData = [
        ['Item Analytics'],
        ['Item Name', 'Category', 'Total Quantity', 'Total Revenue', 'Average Price', 'Transaction Count'],
        ...filteredData.itemStats.map(item => [
          item.itemName,
          item.category || 'Uncategorized',
          item.totalQuantity,
          `₹${item.totalRevenue.toLocaleString()}`,
          `₹${(item.totalRevenue / item.totalQuantity).toFixed(2)}`,
          item.transactionCount
        ])
      ];

      // 5. Visit Patterns Sheet
      const visitPatternsData = [
        ['Visit Patterns Analysis'],
        ['Day', 'Transaction Count'],
        ...(customerInsights?.visitPatterns || []).map(pattern => [
          pattern.day,
          pattern.count
        ]),
        [],
        ['Hour', 'Transaction Count'],
        ...(customerInsights?.hourlyPatterns || []).map(pattern => [
          pattern.hour,
          pattern.count
        ])
      ];

      // 6. Inventory Analysis Sheet
      const inventoryData = [
        ['Inventory Analysis'],
        ['Item Name', 'Current Stock', 'Minimum Stock', 'Maximum Stock', 'Status'],
        ...(filteredData.inventory || []).map(item => [
          item.itemName,
          item.currentStock,
          item.minStock,
          item.maxStock,
          item.currentStock <= item.minStock ? 'Low Stock' : 'Adequate'
        ])
      ];

      // Add all sheets to workbook
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(businessInsightsData), 'Business Insights');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(memberConsumptionData), 'Member Consumption');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(customerSegmentsData), 'Customer Segments');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itemAnalyticsData), 'Item Analytics');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(visitPatternsData), 'Visit Patterns');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(inventoryData), 'Inventory Analysis');

      // Generate Excel file
      const fileName = `Analytics_Report_${dayjs().format('YYYY-MM-DD_HH-mm')}.xlsx`;
      XLSX.writeFile(wb, fileName);

      enqueueSnackbar('Excel report generated successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error generating Excel report:', error);
      enqueueSnackbar('Failed to generate Excel report', { variant: 'error' });
    }
  }, [filteredData, insights, customerInsights, enqueueSnackbar]);

  // Add inventory data fetching
  const fetchInventoryData = useCallback(async () => {
    try {
      setIsLoadingInventory(true);
      // console.log('Fetching inventory data...');
      const response = await fetchInventoryItems();
      // console.log('Inventory API Response:', response);
      
      if (response.error) {
        console.error('Inventory API Error:', response.error);
        throw new Error(response.error);
      }

      if (!response.success || !response.data || !Array.isArray(response.data)) {
        // console.error('Invalid inventory data format:', response);
        throw new Error('Invalid inventory data format received from server');
      }

      // console.log('Setting inventory data:', {
      //   itemCount: response.data.length,
      //   sampleItem: response.data[0]
      // });
      
      setInventoryData(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      enqueueSnackbar(`Failed to fetch inventory data: ${error.message}`, { 
        variant: 'error',
        autoHideDuration: 5000
      });
      setInventoryData([]); // Reset inventory data on error
    } finally {
      setIsLoadingInventory(false);
    }
  }, [enqueueSnackbar]);

  // Fetch inventory data when the predictions tab is active
  useEffect(() => {
    if (activeTab === 4) {
      // console.log('Predictions tab activated, fetching inventory...');
      fetchInventoryData();
    }
  }, [activeTab, fetchInventoryData]);



  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth='lg' sx={{mb:8}}>
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h4" fontWeight="bold" visibility="hidden">
              Consumption Analytics
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                size='small'
                color="primary" 
                startIcon={<AutoAwesome/>}
                onClick={() => navigate('/report/drag-drop-pipeline')}
              >
                Advance&nbsp;Pipeline
              </Button>
              <Tooltip title="Download Excel Report">
                <IconButton 
                  color="primary"
                  onClick={exportToExcel}
                >
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? <CircularProgress size={24} /> : <Refresh />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <FilterSection 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onClearFilters={handleClearFilters}
          />
          
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Member Consumption" icon={<Person />} iconPosition="start" />
              <Tab label="Item Analytics" icon={<Restaurant />} iconPosition="start" />
              <Tab label="Trend Analysis" icon={<Timeline />} iconPosition="start" />
              <Tab label="Inventory Insights" icon={<Inventory />} iconPosition="start" />
              <Tab label="Inventory Predictions" icon={<AutoAwesome />} iconPosition="start" />
            </Tabs>
          </Box>
          
          {/* Tab Content */}
          <Box sx={{ pt: 2 }}>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <BusinessInsights data={filteredData} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Member Consumption Overview
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Time Range</InputLabel>
                          <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            label="Time Range"
                          >
                            <MenuItem value="week">Last Week</MenuItem>
                            <MenuItem value="month">Last Month</MenuItem>
                            <MenuItem value="quarter">Last Quarter</MenuItem>
                            <MenuItem value="year">Last Year</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Sort By</InputLabel>
                          <Select
                            value={memberSortBy}
                            onChange={(e) => setMemberSortBy(e.target.value)}
                            label="Sort By"
                          >
                            <MenuItem value="consumption">Total Consumption</MenuItem>
                            <MenuItem value="transactions">Transaction Count</MenuItem>
                            <MenuItem value="average">Average Value</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <MemberConsumptionChart 
                      data={filteredData.memberStats} 
                      onMemberSelect={handleMemberSelect}
                      timeRange={timeRange}
                      sortBy={memberSortBy}
                      memberRange={memberRange}
                      onMemberRangeChange={handleMemberRangeChange}
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Top Consumers
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={memberRange}
                          onChange={(e) => {
                            handleMemberRangeChange(e.target.value);
                            setPage(1);
                          }}
                          size="small"
                        >
                          <MenuItem value="top5">Top 5</MenuItem>
                          <MenuItem value="bottom5">Least 5</MenuItem>
                          <MenuItem value="all">All</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {[...filteredData.memberStats]
                        .sort((a, b) => {
                          if (memberRange === 'bottom5') {
                            return a.totalConsumption - b.totalConsumption;
                          }
                          return b.totalConsumption - a.totalConsumption;
                        })
                        .slice(
                          memberRange === 'all' ? (page - 1) * rowsPerPage : 0,
                          memberRange === 'all' ? page * rowsPerPage : 5
                        )
                        .map((member, index) => (
                          <Box 
                            key={member.memberId} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              mb: 2,
                              p: 2,
                              borderRadius: 2,
                              bgcolor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.selected'
                              }
                            }}
                            onClick={() => handleMemberSelect(member.memberId)}
                          >
                            <Avatar sx={{ 
                              bgcolor: member.status === 'active' ? 'primary.main' : 'error.main',
                              color: 'white',
                              mr: 2
                            }}>
                              {member.memberName.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography fontWeight={600}>{member.memberName}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {member.transactionCount} transactions
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography fontWeight={700}>
                                ₹{member.totalConsumption.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Avg: ₹{(member.totalConsumption / member.transactionCount).toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                    {memberRange === 'all' && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mb: 1
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Total: {filteredData.memberStats.length} consumers
                          </Typography>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={rowsPerPage}
                              onChange={handleRowsPerPageChange}
                              size="small"
                            >
                              <MenuItem value={5}>5 per page</MenuItem>
                              <MenuItem value={10}>10 per page</MenuItem>
                              <MenuItem value={20}>20 per page</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Pagination
                            count={Math.ceil(filteredData.memberStats.length / rowsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="small"
                            showFirstButton
                            showLastButton
                            siblingCount={1}
                            boundaryCount={1}
                          />
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <CustomerBehavior data={filteredData} />
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Daily Consumption Trend
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>View</InputLabel>
                          <Select
                            value={trendView}
                            onChange={(e) => setTrendView(e.target.value)}
                            label="View"
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Metric</InputLabel>
                          <Select
                            value={trendMetric}
                            onChange={(e) => setTrendMetric(e.target.value)}
                            label="Metric"
                          >
                            <MenuItem value="amount">Total Amount</MenuItem>
                            <MenuItem value="transactions">Transaction Count</MenuItem>
                            <MenuItem value="items">Item Count</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <TimeSeriesChart 
                      data={filteredData.timeSeries} 
                      view={trendView}
                      metric={trendMetric}
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <DetailedConsumptionTable 
                    data={filteredData.detailedConsumption}
                    selectedMember={selectedMember}
                  />
                </Grid>
              </Grid>
            )}
            
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Item Analytics
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                          Top 10 Most Popular Items
                        </Typography>
                        <ItemPopularityChart 
                          data={filteredData.itemStats} 
                          onItemSelect={setSelectedItem}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                          Category Distribution
                        </Typography>
                        <CategoryDistribution 
                          data={filteredData.itemStats}
                          onCategorySelect={setSelectedCategory}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <ItemConsumptionDetails 
                        data={filteredData.itemStats}
                        selectedItem={selectedItem}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Trends Analysis
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Peak Hours Analysis
                        </Typography>
                        <PeakHoursAnalysis data={filteredData.detailedConsumption} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Day-wise Patterns
                        </Typography>
                        <DayWisePatterns data={filteredData.detailedConsumption} />
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            
            {activeTab === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Inventory Insights
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <InventoryAnalysis 
                        data={{
                          inventory: filteredData.inventory || [],
                          transactions: filteredData.transactions || []
                        }} 
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {activeTab === 4 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Inventory Predictions
                  </Typography>
                  {isLoadingInventory ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : !inventoryData.length ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="error" gutterBottom>
                        No inventory data available
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please ensure your inventory data is properly configured in the system.
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={fetchInventoryData}
                        startIcon={<Refresh />}
                        sx={{ mr: 2 }}
                      >
                        Retry Loading Inventory
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => navigate('/inventory')}
                        startIcon={<Inventory />}
                      >
                        Go to Inventory
                      </Button>
                    </Box>
                  ) : !filteredData.transactions?.length ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="error" gutterBottom>
                        No transaction data available
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Please ensure you have transaction data in the selected date range.
                      </Typography>
                    </Box>
                  ) : (
                    <InventoryPredictions 
                      data={{
                        inventory: inventoryData,
                        transactions: filteredData.transactions
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default React.memo(AnalyticsDashboard);