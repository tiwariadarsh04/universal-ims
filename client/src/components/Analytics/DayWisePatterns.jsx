import React, { useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BarChart } from '@mui/x-charts';

const DayWisePatterns = ({ data }) => {
  console.log('DayWisePatterns received data:', data);

  const dayData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('DayWisePatterns: No valid data provided');
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => ({
        day,
        transactions: 0,
        amount: 0,
        items: 0,
        averageTransactionValue: 0
      }));
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = days.map((day, index) => {
      const dayTransactions = data.filter(txn => {
        if (!txn.date) {
          console.warn('Transaction missing date:', txn);
          return false;
        }
        const txnDay = new Date(txn.date).getDay();
        return txnDay === index;
      });

      return {
        day,
        transactions: dayTransactions.length,
        amount: dayTransactions.reduce((sum, txn) => sum + (txn.totalAmount || 0), 0),
        items: dayTransactions.reduce((sum, txn) => sum + (txn.items?.length || 0), 0),
        averageTransactionValue: dayTransactions.length > 0 
          ? dayTransactions.reduce((sum, txn) => sum + (txn.totalAmount || 0), 0) / dayTransactions.length 
          : 0
      };
    });

    console.log('Processed day data:', dayStats);
    return dayStats;
  }, [data]);

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
            data: dayData.map(d => d.transactions),
            label: 'Transactions',
            color: '#1976d2'
          },
          {
            data: dayData.map(d => d.items),
            label: 'Items Sold',
            color: '#2e7d32'
          }
        ]}
        xAxis={[{
          data: dayData.map(d => d.day),
          scaleType: 'band',
        }]}
        height={300}
        margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        {dayData
          .sort((a, b) => b.transactions - a.transactions)
          .slice(0, 3)
          .map((day, index) => (
            <Paper key={day.day} sx={{ p: 2, flex: 1, minWidth: '200px' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Busiest Day {index + 1}
              </Typography>
              <Typography variant="h6">
                {day.day}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {day.transactions} transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {day.items} items sold
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. ₹{day.averageTransactionValue.toFixed(2)} per transaction
              </Typography>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default DayWisePatterns; 