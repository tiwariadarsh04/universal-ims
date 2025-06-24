import React from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const SalesPurchaseProfitCards = ({ totalOrder, totalPendingOrder, totalAcceptedOrder }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {/* Total Orders */}
      <Grid item xs={6} md={4}>
        <Card 
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          height: '100%',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
          }
        }}>
          <CardContent>
            <Box display="flex" 
            alignItems="center" 
            justifyContent="space-between">
              <Box >
                <Typography variant="subtitle2" color="text.secondary">
                  TOTAL ORDERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {totalOrder}
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'primary.light',
                color: 'primary.main',
                p: 1.5,
                borderRadius: '50%'
              }}>
                <MonetizationOnIcon fontSize="medium" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Pending Orders */}
      <Grid item xs={6} md={4}>
        <Card sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          height: '100%',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
          }
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  PENDING ORDERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {totalPendingOrder}
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'warning.light',
                color: 'warning.main',
                p: 1.5,
                borderRadius: '50%'
              }}>
                <PendingActionsIcon fontSize="medium" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Accepted Orders */}
      <Grid item xs={12} md={4}>
        <Card sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          height: '100%',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
          }
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  ACCEPTED ORDERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {totalAcceptedOrder}
                </Typography>
              </Box>
              <Box sx={{
                bgcolor: 'success.light',
                color: 'success.main',
                p: 1.5,
                borderRadius: '50%'
              }}>
                <TaskAltIcon fontSize="medium" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SalesPurchaseProfitCards;