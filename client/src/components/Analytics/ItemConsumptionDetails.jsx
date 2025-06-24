import React, { useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  useTheme,
  TablePagination,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Receipt, Person, ShoppingCart, AttachMoney } from '@mui/icons-material';
import dayjs from 'dayjs';

const ItemConsumptionDetails = ({ data = [], selectedItem = null }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const itemDetails = useMemo(() => {
    if (!selectedItem || !data.length) return null;

    const item = data.find(i => i.itemName === selectedItem);
    if (!item) return null;

    // Ensure transactions array exists and has valid data
    const transactions = Array.isArray(item.transactions) ? item.transactions : [];

    return {
      ...item,
      averagePrice: item.totalRevenue / item.totalQuantity,
      transactions: transactions.map(txn => ({
        ...txn,
        date: txn.date || new Date().toISOString(),
        memberName: txn.memberName || 'Unknown Member',
        quantity: txn.quantity || 0,
        amount: txn.amount || 0,
        invoiceNumber: txn.invoiceNumber || 'N/A'
      })),
      monthlyTrend: item.monthlyTrend || []
    };
  }, [data, selectedItem]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!itemDetails) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography color="text.secondary" align="center">
          Select an item to view details
        </Typography>
      </Paper>
    );
  }

  // Sort transactions by date in descending order
  const sortedTransactions = [...itemDetails.transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Get paginated transactions
  const paginatedTransactions = sortedTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {itemDetails.itemName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<ShoppingCart />}
            label={`Total Quantity: ${itemDetails.totalQuantity}`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            icon={<AttachMoney />}
            label={`Total Revenue: ₹${itemDetails.totalRevenue.toLocaleString()}`}
            color="secondary"
            variant="outlined"
          />
          <Chip 
            icon={<AttachMoney />}
            label={`Average Price: ₹${itemDetails.averagePrice.toFixed(2)}`}
            color="info"
            variant="outlined"
          />
          <Chip 
            icon={<Receipt />}
            label={`Category: ${itemDetails.category || 'Uncategorized'}`}
            color="success"
            variant="outlined"
          />
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt fontSize="small" />
        Recent Transactions
      </Typography>

      {itemDetails.transactions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No transaction history available for this item
        </Alert>
      ) : (
        <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Member</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Amount</TableCell>
              <TableCell>Invoice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {paginatedTransactions.map((txn, index) => (
                  <TableRow 
                    key={index}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.04)
                      }
                    }}
                  >
                    <TableCell>
                      <Tooltip title={dayjs(txn.date).format('MMMM D, YYYY h:mm A')}>
                        <span>{dayjs(txn.date).format('MMM D, YYYY')}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" color="action" />
                        {txn.memberName}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        size="small"
                        label={txn.quantity}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary.main" fontWeight="medium">
                        ₹{txn.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Invoice">
                        <IconButton size="small" color="primary">
                          <Receipt fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          <TablePagination
            component="div"
            count={itemDetails.transactions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Paper>
  );
};

export default React.memo(ItemConsumptionDetails); 