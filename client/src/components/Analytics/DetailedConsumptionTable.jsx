import React, { useState, useMemo, useCallback } from 'react';
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
  Avatar,
  Box,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Collapse,
  useTheme,
  alpha,
  Pagination,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Person, 
  Receipt, 
  KeyboardArrowDown, 
  KeyboardArrowUp,
  FilterList,
  Group,
  ViewList,
  ViewModule,
  ViewComfy
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Memoized row component
const TransactionRow = React.memo(({ txn, index, viewMode = 'list' }) => {
  if (viewMode === 'card') {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                <Person fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{txn.memberName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {txn.memberPno}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">Invoice</Typography>
              <Chip 
                icon={<Receipt fontSize="small" />} 
                label={txn.invoiceNumber} 
                size="small" 
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography variant="body2">
                {new Date(txn.date).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">Amount</Typography>
              <Typography variant="body2" fontWeight="bold">
                ₹{(txn.totalAmount + txn.totalGst).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {txn.items.map((item, i) => (
                <Chip 
                  key={i}
                  label={`${item.itemName} (${item.quantity})`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <Person fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2">{txn.memberName}</Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {txn.memberPno}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip 
          icon={<Receipt fontSize="small" />} 
          label={txn.invoiceNumber} 
          size="small" 
        />
      </TableCell>
      <TableCell>
        {new Date(txn.date).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {txn.items.map((item, i) => (
            <Chip 
              key={i}
              label={`${item.itemName} (${item.quantity})`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </TableCell>
      <TableCell align="right">₹{txn.totalAmount.toFixed(2)}</TableCell>
      <TableCell align="right">₹{txn.totalGst.toFixed(2)}</TableCell>
      <TableCell align="right">
        <Typography fontWeight="bold">
          ₹{(txn.totalAmount + txn.totalGst).toFixed(2)}
        </Typography>
      </TableCell>
    </TableRow>
  );
});

// Memoized group header component
const GroupHeader = React.memo(({ group, groupBy, expandedGroups, toggleGroup, theme }) => {
  const title = useMemo(() => {
    switch (groupBy) {
      case 'month':
        return dayjs(group.groupKey).format('MMMM YYYY');
      case 'member':
        const member = group.transactions[0];
        return `${member.memberName} (${member.memberPno})`;
      case 'item':
        return group.groupKey;
      default:
        return group.groupKey;
    }
  }, [group, groupBy]);

  return (
    <TableRow 
      hover 
      onClick={() => toggleGroup(group.groupKey)}
      sx={{ 
        cursor: 'pointer',
        bgcolor: alpha(theme.palette.primary.main, 0.05)
      }}
    >
      <TableCell colSpan={7}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {expandedGroups[group.groupKey] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
            <Chip 
              size="small" 
              label={`${group.transactions.length} transactions`}
              sx={{ ml: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Total: ₹{group.totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              GST: ₹{group.totalGst.toFixed(2)}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              Net: ₹{(group.totalAmount + group.totalGst).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
});

const DetailedConsumptionTable = ({ data = [], selectedMember = null }) => {
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState('none');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('list');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoized data processing
  const processedData = useMemo(() => {
    let groupedData = [...data];

    // Filter by selected member if provided
    if (selectedMember) {
      groupedData = groupedData.filter(txn => txn.memberId === selectedMember);
    }

    // Sort data
    groupedData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const modifier = sortOrder === 'desc' ? -1 : 1;

      if (sortBy === 'date') {
        return modifier * (new Date(aValue) - new Date(bValue));
      }
      if (sortBy === 'totalAmount') {
        return modifier * (aValue - bValue);
      }
      return modifier * String(aValue).localeCompare(String(bValue));
    });

    // Group data
    if (groupBy === 'none') return groupedData;

    const groups = {};
    groupedData.forEach(txn => {
      let groupKey;
      switch (groupBy) {
        case 'month':
          groupKey = dayjs(txn.date).format('YYYY-MM');
          break;
        case 'member':
          groupKey = txn.memberId;
          break;
        case 'item':
          txn.items.forEach(item => {
            if (!groups[item.itemName]) {
              groups[item.itemName] = [];
            }
            groups[item.itemName].push(txn);
          });
          return;
        default:
          groupKey = txn[groupBy];
      }
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(txn);
    });

    return Object.entries(groups).map(([key, transactions]) => ({
      groupKey: key,
      transactions,
      totalAmount: transactions.reduce((sum, txn) => sum + txn.totalAmount, 0),
      totalGst: transactions.reduce((sum, txn) => sum + txn.totalGst, 0),
      itemCount: transactions.reduce((sum, txn) => sum + txn.items.length, 0)
    }));
  }, [data, groupBy, sortBy, sortOrder, selectedMember]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage);

  const toggleGroup = useCallback((groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  }, []);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  }, []);

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Alert severity="info">No consumption data available</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Group By</InputLabel>
              <Select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                label="Group By"
                startAdornment={
                  <Box sx={{ mr: 1 }}>
                    <Group fontSize="small" />
                  </Box>
                }
              >
                <MenuItem value="none">No Grouping</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="item">Item</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                label="Sort By"
                startAdornment={
                  <Box sx={{ mr: 1 }}>
                    <FilterList fontSize="small" />
                  </Box>
                }
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="totalAmount">Amount</MenuItem>
                <MenuItem value="memberName">Member</MenuItem>
                <MenuItem value="invoiceNumber">Invoice</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                label="Rows per page"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={-1}>All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="List View">
                <IconButton 
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>
              <Tooltip title="Card View">
                <IconButton 
                  onClick={() => setViewMode('card')}
                  color={viewMode === 'card' ? 'primary' : 'default'}
                >
                  <ViewModule />
                </IconButton>
              </Tooltip>
              <Tooltip title="Compact View">
                <IconButton 
                  onClick={() => setViewMode('compact')}
                  color={viewMode === 'compact' ? 'primary' : 'default'}
                >
                  <ViewComfy />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {viewMode === 'list' ? (
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">GST</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item, index) => {
                if (groupBy !== 'none') {
                  return (
                    <React.Fragment key={item.groupKey}>
                      <GroupHeader 
                        group={item}
                        groupBy={groupBy}
                        expandedGroups={expandedGroups}
                        toggleGroup={toggleGroup}
                        theme={theme}
                      />
                      {expandedGroups[item.groupKey] && (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Box sx={{ p: 1 }}>
                              {item.transactions.map((txn, txnIndex) => (
                                <TransactionRow 
                                  key={txn.transactionId || txnIndex}
                                  txn={txn}
                                  index={txnIndex}
                                  viewMode={viewMode}
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                }

                return (
                  <TransactionRow 
                    key={item.transactionId || index}
                    txn={item}
                    index={index}
                    viewMode={viewMode}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
          {paginatedData.map((item, index) => {
            if (groupBy !== 'none') {
              return (
                <Box key={item.groupKey}>
                  <GroupHeader 
                    group={item}
                    groupBy={groupBy}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    theme={theme}
                  />
                  {expandedGroups[item.groupKey] && (
                    <Box sx={{ p: 1 }}>
                      {item.transactions.map((txn, txnIndex) => (
                        <TransactionRow 
                          key={txn.transactionId || txnIndex}
                          txn={txn}
                          index={txnIndex}
                          viewMode={viewMode}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              );
            }

            return (
              <TransactionRow 
                key={item.transactionId || index}
                txn={item}
                index={index}
                viewMode={viewMode}
              />
            );
          })}
        </Box>
      )}

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        pt: 2,
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary">
          Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, processedData.length)} of {processedData.length} entries
        </Typography>
        <Pagination 
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Paper>
  );
};

export default React.memo(DetailedConsumptionTable);