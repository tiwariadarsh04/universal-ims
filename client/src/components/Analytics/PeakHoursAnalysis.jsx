import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart } from '@mui/x-charts';

const PeakHoursAnalysis = ({ data }) => {
  console.log('PeakHoursAnalysis received data:', data);

  const hourlyData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('PeakHoursAnalysis: No valid data provided');
      return Array(24).fill(0).map((_, i) => ({
        hour: i,
        transactions: 0,
        amount: 0,
        items: 0
      }));
    }

    const hours = Array(24).fill(0).map((_, i) => i);
    const hourlyStats = hours.map(hour => {
      const hourTransactions = data.filter(txn => {
        if (!txn.date) {
          console.warn('Transaction missing date:', txn);
          return false;
        }
        const txnHour = new Date(txn.date).getHours();
        return txnHour === hour;
      });

      return {
        hour,
        transactions: hourTransactions.length,
        amount: hourTransactions.reduce((sum, txn) => sum + (txn.totalAmount || 0), 0),
        items: hourTransactions.reduce((sum, txn) => sum + (txn.items?.length || 0), 0)
      };
    });

    console.log('Processed hourly data:', hourlyStats);
    return hourlyStats;
  }, [data]);

  const formatHour = (hour) => {
    return `${hour}:00`;
  };

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No transaction data available for the selected period
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <BarChart
        series={[
          {
            data: hourlyData.map(d => d.transactions),
            label: 'Transactions',
            color: '#1976d2'
          },
          {
            data: hourlyData.map(d => d.items),
            label: 'Items Sold',
            color: '#2e7d32'
          }
        ]}
        xAxis={[{
          data: hourlyData.map(d => formatHour(d.hour)),
          scaleType: 'band',
        }]}
        height={300}
        margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        {hourlyData
          .sort((a, b) => b.transactions - a.transactions)
          .slice(0, 3)
          .map((hour, index) => (
            <Paper key={hour.hour} sx={{ p: 2, flex: 1, minWidth: '200px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Peak Hour {index + 1}
              </Typography>
              <Typography variant="h6">
                {formatHour(hour.hour)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hour.transactions} transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hour.items} items sold
              </Typography>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default PeakHoursAnalysis; 