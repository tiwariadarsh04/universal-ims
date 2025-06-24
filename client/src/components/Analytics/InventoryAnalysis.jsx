import React, { useMemo } from 'react';
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
  useTheme,
  Chip,
  LinearProgress,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Inventory,
  TrendingUp,
  TrendingDown,
  Warning,
  Timer,
  AttachMoney,
  LocalBar,
  Restaurant,
  Fastfood,
  MonetizationOn,
  AccountBalance
} from '@mui/icons-material';
import { BarChart, PieChart } from '@mui/x-charts';
import dayjs from 'dayjs';

const InventoryAnalysis = ({ data }) => {
  const theme = useTheme();

  const inventoryInsights = useMemo(() => {
    if (!data || !data.inventory || !Array.isArray(data.inventory) || !data.transactions || !Array.isArray(data.transactions)) {
      return null;
    }

    // Calculate inventory metrics
    const inventoryStats = data.inventory.map(item => {
      if (!item || !item.ItemName) return null;

      const itemTransactions = data.transactions.filter(txn =>
        txn && txn.items && Array.isArray(txn.items) && txn.items.some(i => i && i.ItemName === item.ItemName)
      );

      const totalSold = itemTransactions.reduce((sum, txn) => {
        const itemInTxn = txn.items.find(i => i && i.ItemName === item.ItemName);
        return sum + (itemInTxn ? (parseFloat(itemInTxn.quantity) || 0) : 0);
      }, 0);

      const totalRevenue = itemTransactions.reduce((sum, txn) => {
        const itemInTxn = txn.items.find(i => i && i.ItemName === item.ItemName);
        return sum + (itemInTxn ? (parseFloat(itemInTxn.amount) || 0) : 0);
      }, 0);

      const costPrice = parseFloat(item.Rate) || 0;
      const sellingPrice = parseFloat(item.IssueRate) || 0;
      const currentStock = parseFloat(item.UnitQty) || 0;
      const minStock = parseFloat(item.minStock) || 0;

      const totalCost = totalSold * costPrice;
      const profit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      const turnoverRate = currentStock > 0 ? totalSold / currentStock : 0;
      const daysToStockout = totalSold > 0 ? currentStock / (totalSold / 30) : 0;

      const stockValue = currentStock * costPrice;
      const potentialRevenue = currentStock * sellingPrice;
      const potentialProfit = potentialRevenue - stockValue;

      let category = 'Others';
      const groupNum = item.ItemGroup ? parseInt(item.ItemGroup) : null;

      if (groupNum !== null) {
        switch(groupNum) {
          case 1:
            category = 'Food';
            break;
          case 2:
            category = 'Beverages';
            break;
          case 3:
            category = 'Alcoholic';
            break;
          case 4:
            category = 'Tobacco';
            break;
          case 5:
            category = 'Kitchen';
            break;
          case 6:
            category = 'Snacks';
            break;
          case 54:
            category = 'Gifts';
            break;
          default:
            category = 'Others';
        }
      }

      return {
        ...item,
        totalSold,
        totalRevenue,
        totalCost,
        profit,
        profitMargin,
        turnoverRate,
        daysToStockout,
        stockValue,
        potentialRevenue,
        potentialProfit,
        status: currentStock <= minStock ? 'Low Stock' :
                daysToStockout < 7 ? 'Critical' : 'Healthy',
        category
      };
    }).filter(Boolean);

    if (inventoryStats.length === 0) return null;

    // Calculate category performance
    const categoryStats = {};
    inventoryStats.forEach(item => {
      if (!item || !item.category) return;

      if (!categoryStats[item.category]) {
        categoryStats[item.category] = {
          totalRevenue: 0,
          totalCost: 0,
          totalItems: 0,
          lowStockItems: 0,
          stockValue: 0,
          potentialProfit: 0
        };
      }
      categoryStats[item.category].totalRevenue += item.totalRevenue;
      categoryStats[item.category].totalCost += item.totalCost;
      categoryStats[item.category].totalItems++;
      categoryStats[item.category].stockValue += item.stockValue;
      categoryStats[item.category].potentialProfit += item.potentialProfit;
      if (item.status === 'Low Stock') {
        categoryStats[item.category].lowStockItems++;
      }
    });

    return {
      inventoryStats,
      categoryStats,
      lowStockItems: inventoryStats.filter(item => item.status === 'Low Stock'),
      criticalItems: inventoryStats.filter(item => item.status === 'Critical'),
      topPerforming: [...inventoryStats]
        .sort((a, b) => (b.profit || 0) - (a.profit || 0))
        .slice(0, 5),
      worstPerforming: [...inventoryStats]
        .sort((a, b) => (a.profit || 0) - (b.profit || 0))
        .slice(0, 5),
      totalStockValue: inventoryStats.reduce((sum, item) => sum + item.stockValue, 0),
      totalPotentialProfit: inventoryStats.reduce((sum, item) => sum + item.potentialProfit, 0)
    };
  }, [data]);

  if (!inventoryInsights) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No inventory data available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your data source or try refreshing
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Inventory Overview */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Inventory color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Inventory Status</Typography>
            </Box>
            <Typography variant="h4" color="primary" gutterBottom>
              {inventoryInsights.lowStockItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Low Stock Items
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(inventoryInsights.lowStockItems.length / data.inventory.length) * 100}
              color="warning"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Warning color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Critical Items</Typography>
            </Box>
            <Typography variant="h4" color="error" gutterBottom>
              {inventoryInsights.criticalItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Need Immediate Attention
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(inventoryInsights.criticalItems.length / data.inventory.length) * 100}
              color="error"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Stock Value</Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              ₹{inventoryInsights.totalStockValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Inventory Value
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, px: 2 }}>
              <TrendingUp color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">Potential Profit</Typography>
            </Box>
            <Typography variant="h4" color="info.main" gutterBottom>
              ₹{inventoryInsights.totalPotentialProfit.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on Current Stock
            </Typography>
          </Paper>
        </Grid>

        {/* Category Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Performance
            </Typography>
            {Object.keys(inventoryInsights.categoryStats).length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Stock Value</TableCell>
                      <TableCell align="right">Low Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(inventoryInsights.categoryStats).map(([category, stats]) => (
                      <TableRow key={category}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {category === 'Alcoholic' ? (
                              <LocalBar color="primary" sx={{ mr: 1 }} />
                            ) : category === 'Kitchen' ? (
                              <Restaurant color="secondary" sx={{ mr: 1 }} />
                            ) : category === 'Snacks' ? (
                              <Fastfood color="success" sx={{ mr: 1 }} />
                            ) : (
                              <Inventory color="info" sx={{ mr: 1 }} />
                            )}
                            {category}
                          </Box>
                        </TableCell>
                        <TableCell align="right">₹{stats.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          ₹{(stats.totalRevenue - stats.totalCost).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">₹{stats.stockValue.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={stats.lowStockItems}
                            color={stats.lowStockItems > 0 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No category data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Top Performing Items */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Items
            </Typography>
            {inventoryInsights.topPerforming.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Sold</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryInsights.topPerforming.map(item => (
                      <TableRow key={item.ItemName}>
                        <TableCell>{item.ItemName}</TableCell>
                        <TableCell align="right">{item.totalSold}</TableCell>
                        <TableCell align="right">₹{item.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${item.profitMargin.toFixed(1)}%`}
                            color={
                              item.profitMargin > 30 ? 'success' :
                              item.profitMargin > 15 ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={`${item.daysToStockout.toFixed(1)} days until stockout`}>
                            <Chip
                              label={item.UnitQty}
                              color={
                                item.status === 'Critical' ? 'error' :
                                item.status === 'Low Stock' ? 'warning' : 'success'
                              }
                              size="small"
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No performance data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Inventory Turnover */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Inventory Turnover Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              {inventoryInsights.inventoryStats.length > 0 ? (
                <BarChart
                  series={[
                    {
                      data: inventoryInsights.inventoryStats.map(item => item.turnoverRate),
                      label: 'Turnover Rate',
                      color: theme.palette.primary.main
                    }
                  ]}
                  xAxis={[{
                    data: inventoryInsights.inventoryStats.map(item => item.ItemName),
                    scaleType: 'band',
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
                    No turnover data available
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

export default InventoryAnalysis; 