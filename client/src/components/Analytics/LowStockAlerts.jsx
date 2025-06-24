import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Chip,
  LinearProgress
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const LowStockAlerts = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Low Stock Alerts
        <Chip 
          icon={<Warning />} 
          label={`${data.length} items need attention`} 
          color="warning" 
          sx={{ ml: 2 }} 
        />
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Current Stock</TableCell>
            <TableCell>Minimum Required</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => {
            const progress = (item.capacity / item.minStock) * 100;
            return (
              <TableRow key={index} hover>
                <TableCell>{item.ItemName}</TableCell>
                <TableCell>{item.capacity}</TableCell>
                <TableCell>{item.minStock}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(progress, 100)} 
                        color={progress < 30 ? 'error' : 'warning'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LowStockAlerts;