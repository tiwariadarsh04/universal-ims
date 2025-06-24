import React, { useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Chip
} from '@mui/material';
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
import { Person, ShoppingCart, Timer, TrendingUp } from '@mui/icons-material';
import dayjs from 'dayjs';

const CustomerBehavior = ({ data }) => {
  const theme = useTheme();

  const customerInsights = useMemo(() => {
    if (!data) return null;

    // Calculate customer segments
    const customerSpending = {};
    const customerVisits = {};
    const customerLastVisit = {};
    const customerCategories = {};

    data.transactions.forEach(txn => {
      const memberId = txn.memberId;
      
      // Track spending
      if (!customerSpending[memberId]) {
        customerSpending[memberId] = 0;
        customerVisits[memberId] = 0;
        customerCategories[memberId] = new Set();
      }
      
      customerSpending[memberId] += txn.totalAmount;
      customerVisits[memberId]++;
      
      // Track last visit
      const visitDate = new Date(txn.date);
      if (!customerLastVisit[memberId] || visitDate > customerLastVisit[memberId]) {
        customerLastVisit[memberId] = visitDate;
      }

      // Track categories
      txn.items.forEach(item => {
        customerCategories[memberId].add(item.category);
      });
    });

    // Calculate segments
    const segments = {
      highValue: [],
      regular: [],
      occasional: []
    };

    Object.entries(customerSpending).forEach(([memberId, spending]) => {
      const visits = customerVisits[memberId];
      const avgSpend = spending / visits;
      const lastVisit = customerLastVisit[memberId];
      const daysSinceLastVisit = Math.floor((new Date() - lastVisit) / (1000 * 60 * 60 * 24));
      const categories = customerCategories[memberId].size;

      const customer = {
        memberId,
        totalSpent: spending,
        visitCount: visits,
        avgSpend,
        lastVisit: daysSinceLastVisit,
        categoryCount: categories
      };

      if (spending > 10000 && visits > 5) {
        segments.highValue.push(customer);
      } else if (spending > 5000 && visits > 3) {
        segments.regular.push(customer);
      } else {
        segments.occasional.push(customer);
      }
    });

    // Calculate visit patterns
    const visitPatterns = new Array(7).fill(0);
    const hourlyPatterns = new Array(24).fill(0);

    data.transactions.forEach(txn => {
      const date = new Date(txn.date);
      visitPatterns[date.getDay()]++;
      hourlyPatterns[date.getHours()]++;
    });

    return {
      segments,
      visitPatterns: visitPatterns.map((count, day) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
        count
      })),
      hourlyPatterns: hourlyPatterns.map((count, hour) => ({
        hour: `${hour}:00`,
        count
      }))
    };
  }, [data]);

  if (!customerInsights) return null;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Customer Segments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer Segments
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Segment</TableCell>
                    <TableCell align="right">Customers</TableCell>
                    <TableCell align="right">Avg. Spend</TableCell>
                    <TableCell align="right">Avg. Visits</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Chip 
                        icon={<TrendingUp />} 
                        label="High Value" 
                        color="success" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{customerInsights.segments.highValue.length}</TableCell>
                    <TableCell align="right">
                      ₹{Math.round(customerInsights.segments.highValue.reduce((sum, c) => sum + c.totalSpent, 0) / 
                        customerInsights.segments.highValue.length || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {Math.round(customerInsights.segments.highValue.reduce((sum, c) => sum + c.visitCount, 0) / 
                        customerInsights.segments.highValue.length || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip 
                        icon={<Person />} 
                        label="Regular" 
                        color="primary" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{customerInsights.segments.regular.length}</TableCell>
                    <TableCell align="right">
                      ₹{Math.round(customerInsights.segments.regular.reduce((sum, c) => sum + c.totalSpent, 0) / 
                        customerInsights.segments.regular.length || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {Math.round(customerInsights.segments.regular.reduce((sum, c) => sum + c.visitCount, 0) / 
                        customerInsights.segments.regular.length || 0)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip 
                        icon={<ShoppingCart />} 
                        label="Occasional" 
                        color="default" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{customerInsights.segments.occasional.length}</TableCell>
                    <TableCell align="right">
                      ₹{Math.round(customerInsights.segments.occasional.reduce((sum, c) => sum + c.totalSpent, 0) / 
                        customerInsights.segments.occasional.length || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {Math.round(customerInsights.segments.occasional.reduce((sum, c) => sum + c.visitCount, 0) / 
                        customerInsights.segments.occasional.length || 0)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Visit Patterns */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Visit Patterns
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={customerInsights.visitPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Hourly Patterns */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Hourly Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={customerInsights.hourlyPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerBehavior; 