import React, { useMemo } from 'react';
import { Box, Typography, useTheme, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
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
import dayjs from 'dayjs';

const MemberConsumptionChart = ({ 
  data = [], 
  onMemberSelect,
  timeRange = 'month',
  sortBy = 'consumption',
  memberRange = 'top10',
  onMemberRangeChange
}) => {
  const theme = useTheme();

  const processedData = useMemo(() => {
    if (!data.length) return [];

    // Filter data based on time range
    const now = dayjs();
    const filteredData = data.filter(member => {
      const lastTransaction = dayjs(member.lastTransactionDate);
      switch (timeRange) {
        case 'week':
          return lastTransaction.isAfter(now.subtract(1, 'week'));
        case 'month':
          return lastTransaction.isAfter(now.subtract(1, 'month'));
        case 'quarter':
          return lastTransaction.isAfter(now.subtract(3, 'months'));
        case 'year':
          return lastTransaction.isAfter(now.subtract(1, 'year'));
        default:
          return true;
      }
    });

    // Sort data based on selected metric
    const sortedData = [...filteredData].sort((a, b) => {
      switch (sortBy) {
        case 'consumption':
          return b.totalConsumption - a.totalConsumption;
        case 'transactions':
          return b.transactionCount - a.transactionCount;
        case 'average':
          return (b.totalConsumption / b.transactionCount) - (a.totalConsumption / a.transactionCount);
        default:
          return b.totalConsumption - a.totalConsumption;
      }
    });

    // Apply member range filter
    let rangeData = sortedData;
    switch (memberRange) {
      case 'top10':
        rangeData = sortedData.slice(0, 10);
        break;
      case 'bottom10':
        rangeData = sortedData.slice(-10).reverse();
        break;
      case 'all':
        rangeData = sortedData;
        break;
      default:
        rangeData = sortedData.slice(0, 10);
    }

    return rangeData.map(member => ({
      ...member,
      averageValue: member.totalConsumption / member.transactionCount
    }));
  }, [data, timeRange, sortBy, memberRange]);

  const formatYAxis = (value) => {
    switch (sortBy) {
      case 'consumption':
      case 'average':
        return `₹${(value / 1000).toFixed(0)}k`;
      case 'transactions':
        return value;
      default:
        return `₹${(value / 1000).toFixed(0)}k`;
    }
  };

  const formatTooltip = (value) => {
    switch (sortBy) {
      case 'consumption':
      case 'average':
        return `₹${value.toLocaleString()}`;
      case 'transactions':
        return `${value} transactions`;
      default:
        return `₹${value.toLocaleString()}`;
    }
  };

  const getMetricLabel = () => {
    switch (sortBy) {
      case 'consumption':
        return 'Total Consumption';
      case 'transactions':
        return 'Transaction Count';
      case 'average':
        return 'Average Transaction Value';
      default:
        return 'Total Consumption';
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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Member Range</InputLabel>
          <Select
            value={memberRange}
            onChange={(e) => onMemberRangeChange(e.target.value)}
            label="Member Range"
          >
            <MenuItem value="top10">Top 10 Members</MenuItem>
            <MenuItem value="bottom10">Bottom 10 Members</MenuItem>
            <MenuItem value="all">All Members</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ResponsiveContainer>
        <BarChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          onClick={(data) => {
            if (data && data.activePayload) {
              const member = data.activePayload[0].payload;
              onMemberSelect(member.memberId);
            }
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme.palette.divider}
          />
          <XAxis
            dataKey="memberName"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ 
              fill: theme.palette.text.secondary,
              fontSize: 12 
            }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Bar
            dataKey={sortBy === 'average' ? 'averageValue' : sortBy === 'transactions' ? 'transactionCount' : 'totalConsumption'}
            name={getMetricLabel()}
            fill={theme.palette.primary.main}
            radius={[4, 4, 0, 0]}
            cursor="pointer"
          />
          {sortBy === 'consumption' && (
            <Bar
              dataKey="transactionCount"
              name="Transaction Count"
              fill={theme.palette.secondary.main}
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default React.memo(MemberConsumptionChart);