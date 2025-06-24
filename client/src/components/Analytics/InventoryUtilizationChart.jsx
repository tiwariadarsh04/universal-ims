import React, { useMemo } from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts';

const InventoryUtilizationChart = ({ data }) => {
  // console.log('InventoryUtilizationChart received data:', data);

  const utilizationData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('InventoryUtilizationChart: No valid data provided');
      return [];
    }

    return data.map(item => ({
      name: item.name,
      currentStock: item.currentStock || 0,
      maxStock: item.maxStock || 0,
      utilizationRate: item.maxStock ? ((item.currentStock / item.maxStock) * 100) : 0,
      category: item.category || 'Uncategorized'
    }));
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No inventory data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <BarChart
        series={[
          {
            data: utilizationData.map(d => d.currentStock),
            label: 'Current Stock',
            color: '#1976d2'
          },
          {
            data: utilizationData.map(d => d.maxStock),
            label: 'Max Stock',
            color: '#2e7d32'
          }
        ]}
        xAxis={[{
          data: utilizationData.map(d => d.name),
          scaleType: 'band',
        }]}
        height={300}
        margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stock Utilization
        </Typography>
        {utilizationData
          .sort((a, b) => b.utilizationRate - a.utilizationRate)
          .slice(0, 5)
          .map((item) => (
            <Box key={item.name} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.currentStock} / {item.maxStock}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={item.utilizationRate}
                color={item.utilizationRate > 80 ? 'error' : item.utilizationRate > 50 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default InventoryUtilizationChart;