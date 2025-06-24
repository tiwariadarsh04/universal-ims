import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  TablePagination,
  TableFooter,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Info,
  Refresh,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const InventoryPredictions = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stockLevelPage, setStockLevelPage] = useState(0);
  const [stockLevelRowsPerPage, setStockLevelRowsPerPage] = useState(5);

  const predictions = useMemo(() => {
    console.log('Inventory Predictions Data:', {
      hasTransactions: Boolean(data?.transactions?.length),
      hasInventory: Boolean(data?.inventory?.length),
      transactionCount: data?.transactions?.length || 0,
      inventoryCount: data?.inventory?.length || 0,
      sampleTransaction: data?.transactions?.[0],
      sampleInventory: data?.inventory?.[0]
    });

    if (!data?.transactions?.length) {
      console.error('No transaction data available');
      return null;
    }

    if (!data?.inventory?.length) {
      console.error('No inventory data available');
      return null;
    }

    // Validate transaction data structure
    const validTransactions = data.transactions.filter(txn => {
      const isValid = txn.items && Array.isArray(txn.items) && txn.items.length > 0;
      if (!isValid) {
        console.warn('Invalid transaction structure:', txn);
      }
      return isValid;
    });

    if (validTransactions.length === 0) {
      console.error('No valid transactions found');
      return null;
    }

    // Calculate daily consumption for each item
    const dailyConsumption = validTransactions.reduce((acc, txn) => {
      const date = new Date(txn.date).toISOString().split('T')[0];
      txn.items.forEach(item => {
        if (!acc[item.ItemName]) {
          acc[item.ItemName] = {};
        }
        acc[item.ItemName][date] = (acc[item.ItemName][date] || 0) + (parseFloat(item.quantity) || 0);
      });
      return acc;
    }, {});

    console.log('Daily Consumption Data:', {
      itemCount: Object.keys(dailyConsumption).length,
      sampleItem: Object.entries(dailyConsumption)[0],
      totalItems: Object.keys(dailyConsumption).length
    });

    // Calculate predictions for each item
    const predictions = data.inventory.map(item => {
      const consumption = dailyConsumption[item.ItemName] || {};
      const consumptionValues = Object.values(consumption);
      
      // Calculate average daily consumption
      const avgDailyConsumption = consumptionValues.length > 0
        ? consumptionValues.reduce((sum, val) => sum + val, 0) / consumptionValues.length
        : 0;

      // Calculate standard deviation
      const stdDev = consumptionValues.length > 0
        ? Math.sqrt(
            consumptionValues.reduce((sum, val) => sum + Math.pow(val - avgDailyConsumption, 2), 0) /
            consumptionValues.length
          )
        : 0;

      // Predict next 7 days consumption
      const next7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          predicted: avgDailyConsumption,
          upperBound: avgDailyConsumption + (2 * stdDev),
          lowerBound: Math.max(0, avgDailyConsumption - (2 * stdDev))
        };
      });

      // Calculate days until stockout
      const daysUntilStockout = avgDailyConsumption > 0 ? (item.UnitQty || 0) / avgDailyConsumption : 0;

      // Calculate recommended reorder quantity based on daily consumption and safety stock
      const safetyStock = avgDailyConsumption * 7; // 7 days of safety stock
      const reorderQuantity = Math.ceil(avgDailyConsumption * 14 + safetyStock); // 2 weeks of stock + safety stock

      // Calculate cost and profit metrics
      const sellingPrice = parseFloat(item.IssueRate) || 0;  // IssueRate is selling price
      const costPrice = parseFloat(item.Rate) || 0;          // Rate is cost price
      const currentStock = parseFloat(item.UnitQty) || 0;
      
      const profitMargin = sellingPrice > 0 ? ((sellingPrice - costPrice) / sellingPrice) * 100 : 0;
      const dailyProfit = avgDailyConsumption * (sellingPrice - costPrice);
      const monthlyProfit = dailyProfit * 30;
      const stockValue = currentStock * costPrice;
      const potentialRevenue = currentStock * sellingPrice;
      const potentialProfit = potentialRevenue - stockValue;

      return {
        ...item,
        avgDailyConsumption,
        stdDev,
        next7Days,
        daysUntilStockout: isFinite(daysUntilStockout) ? daysUntilStockout : 0,
        reorderQuantity,
        riskLevel: daysUntilStockout < 7 ? 'high' : daysUntilStockout < 14 ? 'medium' : 'low',
        trend: stdDev > avgDailyConsumption * 0.5 ? 'volatile' : 'stable',
        costPrice,
        sellingPrice,
        profitMargin,
        dailyProfit,
        monthlyProfit,
        stockValue,
        potentialRevenue,
        potentialProfit,
        currentStock
      };
    }).filter(Boolean);

    console.log('Generated Predictions:', {
      predictionCount: predictions.length,
      samplePrediction: predictions[0],
      totalItems: predictions.length
    });

    return predictions;
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStockLevelPageChange = (event, newPage) => {
    setStockLevelPage(newPage);
  };

  const handleStockLevelRowsPerPageChange = (event) => {
    setStockLevelRowsPerPage(parseInt(event.target.value, 10));
    setStockLevelPage(0);
  };

  if (!predictions) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Unable to generate predictions
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Please check the browser console for detailed error information.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600} visibility="hidden">
              Inventory Predictions
            </Typography>
            <Tooltip title="Refresh predictions">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Current Stock</TableCell>
                  <TableCell align="right">Daily Usage</TableCell>
                  <TableCell align="right">Days Until Stockout</TableCell>
                  <TableCell align="right">Recommended Order</TableCell>
                  <TableCell align="right">Cost Price</TableCell>
                  <TableCell align="right">Selling Price</TableCell>
                  <TableCell align="right">Profit Margin</TableCell>
                  <TableCell align="right">Daily Profit</TableCell>
                  <TableCell align="center">Risk Level</TableCell>
                  <TableCell align="center">Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                  <TableRow key={item.ItemCode}>
                    <TableCell>{item.ItemName}</TableCell>
                    <TableCell align="right">{item.UnitQty || 0}</TableCell>
                    <TableCell align="right">
                      {item.avgDailyConsumption.toFixed(1)}
                      <Typography variant="caption" display="block" color="text.secondary">
                        ±{item.stdDev.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {item.daysUntilStockout.toFixed(1)} days
                    </TableCell>
                    <TableCell align="right">{item.reorderQuantity}</TableCell>
                    <TableCell align="right">₹{item.costPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{item.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${item.profitMargin.toFixed(1)}%`}
                        color={
                          item.profitMargin > 30
                            ? 'success'
                            : item.profitMargin > 15
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">₹{item.dailyProfit.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.riskLevel}
                        color={
                          item.riskLevel === 'high'
                            ? 'error'
                            : item.riskLevel === 'medium'
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={item.trend === 'volatile' ? 'High variability in usage' : 'Stable usage pattern'}>
                        {item.trend === 'volatile' ? (
                          <TrendingUp color="warning" />
                        ) : (
                          <TrendingDown color="success" />
                        )}
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    colSpan={11}
                    count={predictions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Profit Analysis
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={predictions.map(item => ({
                  name: item.itemName,
                  dailyProfit: item.dailyProfit,
                  monthlyProfit: item.monthlyProfit,
                  stockValue: item.stockValue,
                  potentialProfit: item.potentialProfit
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="dailyProfit"
                  stroke="#8884d8"
                  name="Daily Profit"
                />
                <Line
                  type="monotone"
                  dataKey="monthlyProfit"
                  stroke="#82ca9d"
                  name="Monthly Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Stock Value Analysis
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={predictions.map(item => ({
                  name: item.itemName,
                  stockValue: item.stockValue,
                  potentialRevenue: item.potentialRevenue,
                  potentialProfit: item.potentialProfit
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stockValue"
                  stroke="#8884d8"
                  name="Current Stock Value"
                />
                <Line
                  type="monotone"
                  dataKey="potentialRevenue"
                  stroke="#82ca9d"
                  name="Potential Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="potentialProfit"
                  stroke="#ffc658"
                  name="Potential Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Stock Level Predictions
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {stockLevelPage * stockLevelRowsPerPage + 1} to {Math.min((stockLevelPage + 1) * stockLevelRowsPerPage, predictions.length)} of {predictions.length} items
              </Typography>
              <TablePagination
                component="div"
                count={predictions.length}
                page={stockLevelPage}
                onPageChange={handleStockLevelPageChange}
                rowsPerPage={stockLevelRowsPerPage}
                onRowsPerPageChange={handleStockLevelRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Box>
          {predictions
            .slice(stockLevelPage * stockLevelRowsPerPage, (stockLevelPage + 1) * stockLevelRowsPerPage)
            .map((item) => (
            <Box key={item.ItemCode} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">{item.ItemName}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Stock Value: ₹{item.stockValue.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Potential Profit: ₹{item.potentialProfit.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.daysUntilStockout.toFixed(1)} days until stockout
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (item.currentStock / (item.avgDailyConsumption * 30)) * 100)}
                color={
                  item.daysUntilStockout < 7
                    ? 'error'
                    : item.daysUntilStockout < 14
                    ? 'warning'
                    : 'success'
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InventoryPredictions; 