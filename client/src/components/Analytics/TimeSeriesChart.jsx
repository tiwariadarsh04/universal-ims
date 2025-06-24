import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

// Add required plugins to dayjs
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const TimeSeriesChart = ({ data = [], view = 'daily', metric = 'amount' }) => {
  const theme = useTheme();

  const processedData = useMemo(() => {
    if (!data.length) return [];

    const groupedData = {};

    data.forEach(item => {
      const date = dayjs(item.date);
      let formattedDate;
      
      if (view === 'weekly') {
        // Get the start of the week (Monday)
        const weekStart = date.startOf('week');
        formattedDate = weekStart.format('YYYY-MM-DD');
      } else if (view === 'daily') {
        formattedDate = date.format('YYYY-MM-DD');
      } else {
        formattedDate = date.format('YYYY-MM');
      }

      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = {
          date: formattedDate,
          amount: 0,
          transactions: 0,
          items: 0,
          gst: 0,
          weekNumber: view === 'weekly' ? date.isoWeek() : null
        };
      }

      groupedData[formattedDate].amount += item.totalAmount;
      groupedData[formattedDate].transactions += item.transactionCount;
      groupedData[formattedDate].items += item.itemCount;
      groupedData[formattedDate].gst += item.gstAmount;
    });

    return Object.values(groupedData).sort((a, b) => 
      dayjs(a.date).diff(dayjs(b.date))
    );
  }, [data, view]);

  const getMetricValue = (item) => {
    switch (metric) {
      case 'amount':
        return item.amount;
      case 'transactions':
        return item.transactions;
      case 'items':
        return item.items;
      default:
        return item.amount;
    }
  };

  const formatXAxis = (tickItem) => {
    const date = dayjs(tickItem);
    switch (view) {
      case 'daily':
        return date.format('MMM D');
      case 'weekly':
        return `Week ${date.isoWeek()}`;
      case 'monthly':
        return date.format('MMM YYYY');
      default:
        return date.format('MMM D');
    }
  };

  const formatTooltip = (value) => {
    switch (metric) {
      case 'amount':
        return `₹${value.toLocaleString()}`;
      case 'transactions':
        return `${value} transactions`;
      case 'items':
        return `${value} items`;
      default:
        return `₹${value.toLocaleString()}`;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'amount':
        return 'Total Amount';
      case 'transactions':
        return 'Transaction Count';
      case 'items':
        return 'Item Count';
      default:
        return 'Total Amount';
    }
  };

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
    <Box sx={{ height: 400, width: '100%' }}>
      <ResponsiveContainer>
        <LineChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.divider}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.secondary }}
            tickFormatter={formatTooltip}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(label) => {
              const date = dayjs(label);
              switch (view) {
                case 'daily':
                  return date.format('MMMM D, YYYY');
                case 'weekly':
                  return `Week ${date.isoWeek()}, ${date.format('YYYY')}`;
                case 'monthly':
                  return date.format('MMMM YYYY');
                default:
                  return date.format('MMMM D, YYYY');
              }
            }}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={metric}
            name={getMetricLabel()}
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={{ fill: theme.palette.primary.main }}
            activeDot={{ r: 8 }}
          />
          {metric === 'amount' && (
            <Line
              type="monotone"
              dataKey="gst"
              name="GST"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.secondary.main }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default React.memo(TimeSeriesChart);