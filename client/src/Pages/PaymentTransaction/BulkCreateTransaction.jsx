import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  useTheme,
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const BulkCreateTransaction = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [transactions, setTransactions] = useState([{ memberId: '', amount: '', description: '' }]);

  const handleAddRow = () => {
    setTransactions([...transactions, { memberId: '', amount: '', description: '' }]);
  };

  const handleRemoveRow = (index) => {
    if (transactions.length > 1) {
      const newTransactions = transactions.filter((_, i) => i !== index);
      setTransactions(newTransactions);
    }
  };

  const handleChange = (index, field, value) => {
    const newTransactions = [...transactions];
    newTransactions[index][field] = value;
    setTransactions(newTransactions);
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement bulk transaction creation logic
      enqueueSnackbar('Bulk transactions created successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement file upload and parsing logic
      enqueueSnackbar('File uploaded successfully!', { variant: 'success' });
    }
  };

  const handleDownloadTemplate = () => {
    // TODO: Implement template download logic
    enqueueSnackbar('Template downloaded successfully!', { variant: 'success' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Bulk Create Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create multiple payment transactions at once. You can either fill the form below or upload a CSV file.
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
            >
              Upload CSV
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={transaction.memberId}
                      onChange={(e) => handleChange(index, 'memberId', e.target.value)}
                      placeholder="Enter Member ID"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={transaction.amount}
                      onChange={(e) => handleChange(index, 'amount', e.target.value)}
                      placeholder="Enter Amount"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      value={transaction.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      placeholder="Enter Description"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Remove Row">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveRow(index)}
                        disabled={transactions.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
          >
            Add Row
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={transactions.some(t => !t.memberId || !t.amount)}
          >
            Create Transactions
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default BulkCreateTransaction; 