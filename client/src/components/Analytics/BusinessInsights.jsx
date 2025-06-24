import React, { useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip,
  useTheme,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  People, 
  Inventory, 
  Timer,
  Info,
  LocalBar,
  Restaurant,
  Fastfood,
  Category,
  Receipt
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';

const BusinessInsights = ({ data }) => {
  const theme = useTheme();

  const insights = useMemo(() => {
    if (!data || !data.transactions || !Array.isArray(data.transactions) || data.transactions.length === 0) {
      return null;
    }

    // Calculate key metrics
    const totalRevenue = data.transactions.reduce((sum, txn) => 
      sum + (parseFloat(txn.totalAmount) || 0), 0);
    
    const totalTransactions = data.transactions.length;
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Calculate daily revenue for trend
    const dailyRevenue = {};
    data.transactions.forEach(txn => {
      if (!txn || !txn.date) return;
      const date = dayjs(txn.date).format('YYYY-MM-DD');
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (parseFloat(txn.totalAmount) || 0);
    });

    // Calculate peak hours
    const hourlyTransactions = new Array(24).fill(0);
    data.transactions.forEach(txn => {
      if (!txn || !txn.date) return;
      const hour = dayjs(txn.date).hour();
      hourlyTransactions[hour]++;
    });
    const peakHour = hourlyTransactions.indexOf(Math.max(...hourlyTransactions));

    // Calculate unique customers
    const uniqueCustomers = new Set(data.transactions
      .filter(txn => txn && txn.memberID)
      .map(txn => txn.memberID)
    ).size;

    // Calculate customer spending
    const customerSpending = {};
    data.transactions.forEach(txn => {
      if (!txn || !txn.memberID || !txn.totalAmount) return;
      if (!customerSpending[txn.memberID]) {
        customerSpending[txn.memberID] = 0;
      }
      customerSpending[txn.memberID] += parseFloat(txn.totalAmount) || 0;
    });

    const avgCustomerValue = uniqueCustomers > 0 
      ? Object.values(customerSpending).reduce((a, b) => a + b, 0) / uniqueCustomers 
      : 0;

    // Calculate inventory metrics
    const totalInventoryItems = data.inventory && Array.isArray(data.inventory) 
      ? data.inventory.length 
      : 0;

    const lowStockItems = data.inventory && Array.isArray(data.inventory)
      ? data.inventory.filter(item => 
          item && item.UnitQty !== undefined && 
          item.minStock !== undefined && 
          parseFloat(item.UnitQty) <= parseFloat(item.minStock)
        ).length 
      : 0;

    // Calculate growth metrics
    const lastMonthRevenue = data.transactions
      .filter(txn => dayjs(txn.date).isAfter(dayjs().subtract(1, 'month')))
      .reduce((sum, txn) => sum + (parseFloat(txn.totalAmount) || 0), 0);

    const previousMonthRevenue = data.transactions
      .filter(txn => 
        dayjs(txn.date).isAfter(dayjs().subtract(2, 'month')) && 
        dayjs(txn.date).isBefore(dayjs().subtract(1, 'month'))
      )
      .reduce((sum, txn) => sum + (parseFloat(txn.totalAmount) || 0), 0);

    const revenueGrowth = previousMonthRevenue > 0 
      ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    // Calculate category performance with additional metrics
    const categoryRevenue = {};
    const categoryTransactions = {};
    const categoryItems = {};
    const categoryGrowth = {};
    
    // Get last month's data for growth calculation
    const lastMonthData = {};
    const currentMonthData = {};
    
    data.transactions.forEach(txn => {
      const items = Array.isArray(txn.items) ? txn.items : [txn];
      const isLastMonth = dayjs(txn.date).isAfter(dayjs().subtract(1, 'month'));
      
      items.forEach(item => {
        let category;
        if (item.itemGroup === 3) {
          category = 'Alcoholic';
        } else if (item.itemGroup === 5) {
          category = 'Kitchen';
        } else if (item.itemGroup === 6) {
          category = 'Snacks';
        } else {
          category = 'Others';
        }

        const amount = item.amount || 0;
        
        // Initialize category data if not exists
        if (!categoryRevenue[category]) {
          categoryRevenue[category] = 0;
          categoryTransactions[category] = 0;
          categoryItems[category] = new Set();
          lastMonthData[category] = 0;
          currentMonthData[category] = 0;
        }

        // Update metrics
        categoryRevenue[category] += amount;
        categoryTransactions[category]++;
        categoryItems[category].add(item.itemName);
        
        // Track monthly data for growth calculation
        if (isLastMonth) {
          currentMonthData[category] += amount;
        } else if (dayjs(txn.date).isAfter(dayjs().subtract(2, 'month')) && 
                  dayjs(txn.date).isBefore(dayjs().subtract(1, 'month'))) {
          lastMonthData[category] += amount;
        }
      });
    });

    // Calculate growth rates
    Object.keys(categoryRevenue).forEach(category => {
      const growth = lastMonthData[category] > 0 
        ? ((currentMonthData[category] - lastMonthData[category]) / lastMonthData[category]) * 100 
        : 0;
      categoryGrowth[category] = growth;
    });

    // Calculate top performing categories with additional metrics
    const topCategories = Object.entries(categoryRevenue)
      .filter(([_, revenue]) => revenue > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, revenue]) => ({
        category,
        revenue,
        percentage: (revenue / totalRevenue) * 100,
        transactionCount: categoryTransactions[category],
        uniqueItems: categoryItems[category].size,
        growth: categoryGrowth[category],
        monthlyData: {
          current: currentMonthData[category],
          previous: lastMonthData[category]
        }
      }));

    // console.log('Top Categories:', topCategories);
    // console.log('Total Revenue:', totalRevenue);

    return {
      totalRevenue,
      avgTransactionValue,
      uniqueCustomers,
      avgCustomerValue,
      peakHour,
      lowStockItems,
      totalInventoryItems,
      revenueGrowth,
      topCategories,
      dailyRevenue: Object.entries(dailyRevenue)
        .map(([date, amount]) => ({
          date,
          amount
        }))
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
    };
  }, [data]);

  if (!insights) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No data available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your data source or try refreshing
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Add debug logging for rendering
  // console.log('Rendering insights:', insights);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Revenue</Typography>
            </Box>
            <Typography variant="h4" color="primary" gutterBottom>
              ₹{insights.totalRevenue.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color={insights.revenueGrowth >= 0 ? 'success.main' : 'error.main'}>
                {insights.revenueGrowth >= 0 ? '+' : ''}{insights.revenueGrowth.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs last month
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <People color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">Customers</Typography>
            </Box>
            <Typography variant="h4" color="secondary" gutterBottom>
              {insights.uniqueCustomers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg. Value: ₹{insights.avgCustomerValue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Timer color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Peak Hours</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {insights.peakHour}:00
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Most Active Time
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Inventory color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Inventory</Typography>
            </Box>
            <Typography variant="h4" color="warning.main" gutterBottom>
              {insights.totalInventoryItems}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {insights.lowStockItems} Low Stock Items
            </Typography>
          </Paper>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Categories
            </Typography>
            <Box sx={{ mt: 2 }}>
              {insights.topCategories && insights.topCategories.length > 0 ? (
                insights.topCategories.map((category, index) => (
                  <Box key={category.category} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {category.category === 'Alcoholic' ? (
                        <LocalBar color="primary" sx={{ mr: 1 }} />
                      ) : category.category === 'Kitchen' ? (
                        <Restaurant color="secondary" sx={{ mr: 1 }} />
                      ) : category.category === 'Snacks' ? (
                        <Fastfood color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Category color="info" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {category.category}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="primary">
                          {category.percentage.toFixed(1)}%
                        </Typography>
                        {category.growth !== 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category.growth > 0 ? (
                              <TrendingUp color="success" fontSize="small" />
                            ) : (
                              <TrendingDown color="error" fontSize="small" />
                            )}
                            <Typography 
                              variant="caption" 
                              color={category.growth > 0 ? 'success.main' : 'error.main'}
                              sx={{ ml: 0.5 }}
                            >
                              {Math.abs(category.growth).toFixed(1)}%
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={category.percentage}
                      color={index === 0 ? 'success' : index === 1 ? 'primary' : 'secondary'}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Tooltip title="Total Revenue">
                        <Chip
                          size="small"
                          icon={<AttachMoney />}
                          label={`₹${category.revenue.toLocaleString()}`}
                          variant="outlined"
                        />
                      </Tooltip>
                      <Tooltip title="Number of Transactions">
                        <Chip
                          size="small"
                          icon={<Receipt />}
                          label={`${category.transactionCount} transactions`}
                          variant="outlined"
                        />
                      </Tooltip>
                      <Tooltip title="Unique Items">
                        <Chip
                          size="small"
                          icon={<Inventory />}
                          label={`${category.uniqueItems} items`}
                          variant="outlined"
                        />
                      </Tooltip>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 100 
                }}>
                  <Typography color="text.secondary">
                    No category data available. Please check if transactions have category information.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Revenue Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              {insights.dailyRevenue.length > 0 ? (
                <LineChart
                  series={[
                    {
                      data: insights.dailyRevenue.map(d => d.amount),
                      area: true,
                      color: theme.palette.primary.main
                    }
                  ]}
                  xAxis={[{
                    data: insights.dailyRevenue.map(d => new Date(d.date)),
                    scaleType: 'time',
                    valueFormatter: (date) => dayjs(date).format('MMM D')
                  }]}
                  height={300}
                />
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">
                    No revenue data available for the selected period
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessInsights; 