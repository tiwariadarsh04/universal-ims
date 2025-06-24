import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { alpha } from '@mui/material/styles';

const CategoryDistribution = ({ data = [], onCategorySelect }) => {
  const theme = useTheme();

  const processedData = useMemo(() => {
    if (!data.length) return [];

    const categoryMap = {};
    data.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          value: 0,
          revenue: 0,
          items: 0
        };
      }
      categoryMap[category].value += item.totalQuantity;
      categoryMap[category].revenue += item.totalRevenue;
      categoryMap[category].items += 1;
    });

    return Object.values(categoryMap).sort((a, b) => b.value - a.value);
  }, [data]);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

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
        <PieChart>
          <Pie
            data={processedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            onClick={(data) => onCategorySelect(data.name)}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                cursor="pointer"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const item = props.payload;
              return [
                `Quantity: ${value}`,
                `Revenue: ₹${item.revenue.toLocaleString()}`,
                `Items: ${item.items}`
              ];
            }}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default React.memo(CategoryDistribution); 