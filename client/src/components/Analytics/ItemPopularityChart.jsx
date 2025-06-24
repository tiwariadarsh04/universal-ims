import React, { useMemo, useState } from 'react';
import { Box, Typography, useTheme, Paper, Chip, Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { alpha } from '@mui/material/styles';
import { Restaurant, TrendingUp, AttachMoney } from '@mui/icons-material';

const ItemPopularityChart = ({ data = [], onItemSelect }) => {
  const theme = useTheme();
  const [itemRange, setItemRange] = useState('top10');

  const processedData = useMemo(() => {
    if (!data.length) return [];

    // Group items by name and aggregate their data
    const groupedItems = {};
    data.forEach(item => {
      const itemName = item.itemName.trim(); // Trim whitespace
      if (!groupedItems[itemName]) {
        groupedItems[itemName] = {
          itemName,
          totalQuantity: 0,
          totalRevenue: 0,
          transactions: [],
          category: item.category
        };
      }
      groupedItems[itemName].totalQuantity += item.totalQuantity;
      groupedItems[itemName].totalRevenue += item.totalRevenue;
      
      // Ensure we're properly handling transactions
      if (item.transactions && Array.isArray(item.transactions)) {
        groupedItems[itemName].transactions = [
          ...groupedItems[itemName].transactions,
          ...item.transactions.map(txn => ({
            ...txn,
            date: txn.date || new Date().toISOString(), // Ensure date exists
            memberName: txn.memberName || 'Unknown Member',
            quantity: txn.quantity || 0,
            amount: txn.amount || 0,
            invoiceNumber: txn.invoiceNumber || 'N/A'
          }))
        ];
      }
    });

    // Convert grouped items to array and sort by quantity
    const sortedData = Object.values(groupedItems).sort((a, b) => b.totalQuantity - a.totalQuantity);

    // Apply range filter
    let rangeData;
    switch (itemRange) {
      case 'top10':
        rangeData = sortedData.slice(0, 10);
        break;
      case 'bottom10':
        rangeData = sortedData.slice(-10).reverse();
        break;
      default:
        rangeData = sortedData.slice(0, 10);
    }

    return rangeData.map(item => ({
      ...item,
      revenue: item.totalRevenue,
      quantity: item.totalQuantity,
      averagePrice: item.totalRevenue / item.totalQuantity
    }));
  }, [data, itemRange]);

  const totalRevenue = useMemo(() => 
    processedData.reduce((sum, item) => sum + item.revenue, 0),
    [processedData]
  );

  const totalQuantity = useMemo(() => 
    processedData.reduce((sum, item) => sum + item.quantity, 0),
    [processedData]
  );

  if (!processedData.length) {
    return (
      <Box sx={{ 
        height: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <AttachMoney fontSize="small" />
              ₹{totalRevenue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Quantity Sold
            </Typography>
            <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Restaurant fontSize="small" />
              {totalQuantity.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Average Price
            </Typography>
            <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" />
              ₹{(totalRevenue / totalQuantity).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Item Range</InputLabel>
          <Select
            value={itemRange}
            onChange={(e) => setItemRange(e.target.value)}
            label="Item Range"
          >
            <MenuItem value="top10">Top 10 Items</MenuItem>
            <MenuItem value="bottom10">Least 10 Items</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
            onClick={(data) => {
              if (data && data.activePayload) {
                const item = data.activePayload[0].payload;
                onItemSelect(item.itemName);
              }
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="itemName"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: 12 
              }}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke={theme.palette.primary.main}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={theme.palette.secondary.main}
              tickFormatter={(value) => value}
            />
            <Tooltip
              formatter={(value, name, props) => {
                const item = props.payload;
                if (name === 'Revenue') {
                  return [
                    `₹${value.toLocaleString()}`,
                    'Revenue',
                    `Avg: ₹${item.averagePrice.toFixed(2)}`
                  ];
                }
                return [value, 'Quantity Sold'];
              }}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Revenue"
              fill={theme.palette.primary.main}
              radius={[4, 4, 0, 0]}
              cursor="pointer"
            />
            <Bar
              yAxisId="right"
              dataKey="quantity"
              name="Quantity Sold"
              fill={theme.palette.secondary.main}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {processedData.map((item, index) => (
          <Chip
            key={item.itemName}
            label={`${index + 1}. ${item.itemName} (${item.quantity} sold)`}
            color={index < 3 ? 'primary' : 'default'}
            variant={index < 3 ? 'filled' : 'outlined'}
            onClick={() => onItemSelect(item.itemName)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(ItemPopularityChart);