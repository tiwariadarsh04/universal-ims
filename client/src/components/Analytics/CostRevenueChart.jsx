import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart } from '@mui/x-charts';

const CostRevenueChart = ({ data }) => {
  console.log('CostRevenueChart received data:', data);

  const analysisData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('CostRevenueChart: No valid data provided');
      return [];
    }

    return data.map(item => ({
      name: item.name,
      cost: item.cost || 0,
      revenue: item.revenue || 0,
      profit: (item.revenue || 0) - (item.cost || 0),
      profitMargin: item.revenue ? (((item.revenue - item.cost) / item.revenue) * 100) : 0
    }));
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No cost/revenue data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <BarChart
        series={[
          {
            data: analysisData.map(d => d.cost),
            label: 'Cost',
            color: '#d32f2f'
          },
          {
            data: analysisData.map(d => d.revenue),
            label: 'Revenue',
            color: '#2e7d32'
          },
          {
            data: analysisData.map(d => d.profit),
            label: 'Profit',
            color: '#1976d2'
          }
        ]}
        xAxis={[{
          data: analysisData.map(d => d.name),
          scaleType: 'band',
        }]}
        height={300}
        margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top Performing Items
        </Typography>
        {analysisData
          .sort((a, b) => b.profitMargin - a.profitMargin)
          .slice(0, 5)
          .map((item) => (
            <Paper key={item.name} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Profit Margin: {item.profitMargin.toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="success.main">
                    Revenue: ₹{item.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    Cost: ₹{item.cost.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    Profit: ₹{item.profit.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default CostRevenueChart;