import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  useTheme,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TablePagination,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CancelIcon from '@mui/icons-material/Cancel';
import GppBadIcon from '@mui/icons-material/GppBad';
import { bulkCreateItem } from '../../services/Inventory';

// Constants
const REQUIRED_COLUMNS = ['ItemCode', 'ItemName', 'ItemUnit', 'UnitQty', 'Rate'];
const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 500, 1000];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['.xlsx', '.xls'];
const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const BulkCreateInventoryItem = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  
  // State management
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [duplicateColumns, setDuplicateColumns] = useState([]);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Memoized statistics
  const stats = useMemo(() => ({
    numColumns: headers.length,
    numRows: data.length,
    uniqueRows: data.length - duplicateRows.length,
    uniqueColumns: headers.length - duplicateColumns.length,
    duplicateRows: duplicateRows.length,
    duplicateColumns: duplicateColumns.length,
  }), [headers, data, duplicateRows, duplicateColumns]);

  // Memoized paginated data
  const paginatedData = useMemo(() => 
    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  // Memoized validation functions
  const validateData = useCallback((rows) => {
    const errors = [];
    rows.forEach((row, rowIndex) => {
      // Required fields validation
      REQUIRED_COLUMNS.forEach((column, colIndex) => {
        if (!row[colIndex]?.toString().trim()) {
          errors.push({
            row: rowIndex + 1,
            column: colIndex + 1,
            message: `${column} is required and must be a non-empty value`
          });
        }
      });

      // Numeric fields validation
      if (row[4] && isNaN(Number(row[4]))) {
        errors.push({
          row: rowIndex + 1,
          column: 5,
          message: 'UnitQty must be a number'
        });
      }

      if (row[5] && isNaN(Number(row[5]))) {
        errors.push({
          row: rowIndex + 1,
          column: 6,
          message: 'Rate must be a number'
        });
      }

      // Additional validations
      if (row[4] && Number(row[4]) < 0) {
        errors.push({
          row: rowIndex + 1,
          column: 5,
          message: 'UnitQty cannot be negative'
        });
      }

      if (row[5] && Number(row[5]) < 0) {
        errors.push({
          row: rowIndex + 1,
          column: 6,
          message: 'Rate cannot be negative'
        });
      }
    });
    return errors;
  }, []);

  // Memoized utility functions
  const findDuplicateColumns = useCallback((headers) => {
    const seen = new Map();
    const duplicates = [];
    headers.forEach((header, index) => {
      if (seen.has(header)) {
        duplicates.push(index);
      } else {
        seen.set(header, true);
      }
    });
    return duplicates;
  }, []);

  const findDuplicateRows = useCallback((rows) => {
    const seen = new Map();
    const duplicates = [];
    rows.forEach((row, index) => {
      const rowString = JSON.stringify(row);
      if (seen.has(rowString)) {
        duplicates.push(index);
      } else {
        seen.set(rowString, true);
      }
    });
    return duplicates;
  }, []);

  // Event handlers
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // File validation
  const validateFile = useCallback((file) => {
    const errors = [];

    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
      errors.push('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push('File size exceeds 5MB limit');
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      errors.push('Invalid file format. Please upload a valid Excel file');
    }

    return errors;
  }, []);

  // Enhanced file drop handler
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = validateFile(rejectedFiles[0]);
      setErrorDialog({
        open: true,
        message: errors.join('\n')
      });
      return;
    }

    if (acceptedFiles.length === 0) return;

    const uploadedFile = acceptedFiles[0];
    const validationErrors = validateFile(uploadedFile);

    if (validationErrors.length > 0) {
      setErrorDialog({
        open: true,
        message: validationErrors.join('\n')
      });
      return;
    }

    setFile(uploadedFile);
    parseExcelFile(uploadedFile);
  }, [validateFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xlsx', '.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    validator: (file) => {
      const errors = validateFile(file);
      return errors.length > 0 ? errors[0] : null;
    }
  });

  // Enhanced Excel parsing with better error handling
  const parseExcelFile = useCallback((file) => {
    const startTime = performance.now();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { 
          type: 'binary',
          cellDates: true,
          cellNF: true,
          cellText: true
        });
        
        if (workbook.SheetNames.length === 0) {
          throw new Error('The Excel file is empty');
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Check if sheet has data
        if (!sheet['!ref']) {
          throw new Error('The Excel sheet is empty');
        }

        const jsonData = XLSX.utils.sheet_to_json(sheet, { 
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });

        if (jsonData.length < 2) {
          throw new Error('The Excel file must contain at least one row of data');
        }

        const headers = jsonData[0];
        let rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));

        if (rows.length === 0) {
          throw new Error('No valid data found in the Excel file');
        }

        // Validate headers
        const missingHeaders = REQUIRED_COLUMNS.filter(header => 
          !headers.some(h => h.toLowerCase() === header.toLowerCase())
        );

        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        const errors = validateData(rows);
        const duplicateCols = findDuplicateColumns(headers);
        const duplicateRows = findDuplicateRows(rows);

        setHeaders(headers);
        setData(rows);
        setDuplicateColumns(duplicateCols);
        setDuplicateRows(duplicateRows);
        setValidationErrors(errors);

        const endTime = performance.now();
        const parseTime = ((endTime - startTime) / 1000).toFixed(2);

        if (errors.length > 0) {
          setSnackbar({
            open: true,
            message: `Found ${errors.length} validation errors. Please review them before proceeding.`,
            severity: 'warning'
          });
        } else {
          setSnackbar({
            open: true,
            message: `Successfully parsed ${rows.length} rows of data.`,
            severity: 'success'
          });
        }

      } catch (error) {
        setErrorDialog({
          open: true,
          message: `Error parsing Excel file: ${error.message}`
        });
        handleCancel();
      }
    };

    reader.onerror = (error) => {
      setErrorDialog({
        open: true,
        message: `Error reading the file: ${error.target.error.message}`
      });
      handleCancel();
    };

    reader.onabort = () => {
      setErrorDialog({
        open: true,
        message: 'File reading was aborted'
      });
      handleCancel();
    };

    reader.readAsBinaryString(file);
  }, [validateData, findDuplicateColumns, findDuplicateRows]);

  const handleRemoveColumn = useCallback((index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    const newData = data.map((row) => row.filter((_, i) => i !== index));
    const newDuplicateCols = findDuplicateColumns(newHeaders);

    setHeaders(newHeaders);
    setData(newData);
    setDuplicateColumns(newDuplicateCols);
  }, [headers, data, findDuplicateColumns]);

  const handleRemoveRow = useCallback((index) => {
    const newData = data.filter((_, i) => i !== index);
    const newDuplicateRows = findDuplicateRows(newData);

    setData(newData);
    setDuplicateRows(newDuplicateRows);
  }, [data, findDuplicateRows]);

  const handleCancel = useCallback(() => {
    setFile(null);
    setData([]);
    setHeaders([]);
    setDuplicateColumns([]);
    setDuplicateRows([]);
    setValidationErrors([]);
    setPage(0);
  }, []);

  const handleSampleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/sampleFormate/Inventory_formate.xlsx';
    link.download = 'inventory_formate.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleCreate = useCallback(async () => {
    if (validationErrors.length > 0) {
      setErrorDialog({
        open: true,
        message: 'Please fix all validation errors before creating inventory items.'
      });
      return;
    }

    setIsLoading(true);
    try {
      const items = data.map((row) => ({
        ItemCode: row[0],
        ItemName: row[1],
        ItemUnit: row[2],
        UnitQty: Number(row[3]),
        Rate: Number(row[4]),
        // Add other fields as needed
      }));

      const res = await bulkCreateItem(items);
      
      if (res?.success) {
        setSnackbar({
          open: true,
          message: `Successfully created ${items.length} inventory items!`,
          severity: 'success'
        });
        handleCancel();
      } else {
        throw new Error(res?.message || 'Failed to create inventory items');
      }
    } catch (error) {
      setErrorDialog({
        open: true,
        message: `Error creating inventory items: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [data, validationErrors, handleCancel]);

  const handleCloseErrorDialog = useCallback(() => {
    setErrorDialog({ open: false, message: '' });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const ignoreValidationError = useCallback(() => {
    setValidationErrors([]);
    setSnackbar({
      open: true,
      message: 'Validation errors ignored. Proceed with caution.',
      severity: 'warning'
    });
  }, []);

  // Memoized components
  const ErrorDialog = useMemo(() => (
    <Dialog
      open={errorDialog.open}
      onClose={handleCloseErrorDialog}
      aria-labelledby="error-dialog-title"
    >
      <DialogTitle id="error-dialog-title" color="error">
        Error
      </DialogTitle>
      <DialogContent>
        <Typography>{errorDialog.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseErrorDialog} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  ), [errorDialog, handleCloseErrorDialog]);

  const NotificationSnackbar = useMemo(() => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  ), [snackbar, handleCloseSnackbar]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
        textAlign: 'center',
        padding: '2rem',
        borderRadius: '12px',
      }}
    >
      {ErrorDialog}
      {NotificationSnackbar}

      {/* Instructions */}
      {!file ? (
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
          Upload Excel File to Create Inventory Items in Bulk
        </Typography>
      ) : (
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
          Review Your Data Before Saving
        </Typography>
      )}

      {/* Drag-and-Drop Area */}
      {!file && (
        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[400]}`,
            borderRadius: '12px',
            p: 6,
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ 
            fontSize: 64, 
            color: isDragActive ? theme.palette.primary.main : theme.palette.grey[400],
            mb: 2,
            transition: 'color 0.3s ease'
          }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {isDragActive ? 'Drop the file here' : 'Drag & Drop Excel File Here'}
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            or click to upload
          </Typography>
          <Typography variant="caption" sx={{ 
            display: 'block', 
            mt: 2, 
            color: theme.palette.text.secondary 
          }}>
            Supported formats: .xlsx, .xls (Max size: 5MB)
          </Typography>
        </Box>
      )}

      {/* Sample Download Link */}
      {!file && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Need a reference?{' '}
            <Link
              component="button"
              onClick={handleSampleDownload}
              sx={{
                textDecoration: 'underline',
                color: theme.palette.primary.main,
                '&:hover': {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Download Sample Excel
            </Link>
          </Typography>
        </Box>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Paper
          sx={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            padding: 3,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            width: '300px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'translateY(-2px)' },
            zIndex: 9999,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationImportantIcon sx={{ color: 'error.main', fontSize: '1.5em' }} />
              <Typography variant="h6" color="error">
                Validation Errors
              </Typography>
            </Box>
            <IconButton
              onClick={ignoreValidationError}
              sx={{
                color: 'error.main',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <CancelIcon />
            </IconButton>
          </Box>

          <List sx={{ maxHeight: '200px', overflowY: 'auto' }}>
            {validationErrors.map((error, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  gap: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.05)',
                    borderRadius: '8px',
                  }
                }}
              >
                <GppBadIcon sx={{ color: 'error.main' }} />
                <ListItemText
                  primary={`Row ${error.row}, Column ${error.column}`}
                  secondary={error.message}
                  sx={{ color: 'error.main' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Table Display */}
      {file && data.length > 0 && (
        <Box sx={{ width: '100%', mt: 4 }}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Chip 
                  label={`Columns: ${stats.numColumns}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Rows: ${stats.numRows}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Unique Rows: ${stats.uniqueRows}`} 
                  color="success" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Unique Columns: ${stats.uniqueColumns}`} 
                  color="success" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Duplicate Rows: ${stats.duplicateRows}`} 
                  color="error" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Duplicate Columns: ${stats.duplicateColumns}`} 
                  color="error" 
                  variant="outlined" 
                />
              </Box>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Table>
              <TableHead
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>#</TableCell>
                  {headers.map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: duplicateColumns.includes(index) ? theme.palette.warning.dark : 'inherit',
                      }}
                    >
                      {header}
                      {duplicateColumns.includes(index) && (
                        <Tooltip title="Remove duplicate column">
                          <IconButton
                            sx={{ ml: 1, color: '#fff' }}
                            onClick={() => handleRemoveColumn(index)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      backgroundColor: duplicateRows.includes(rowIndex + page * rowsPerPage) 
                        ? theme.palette.warning.light 
                        : 'inherit',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{rowIndex + 1 + page * rowsPerPage}</TableCell>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                    {duplicateRows.includes(rowIndex + page * rowsPerPage) && (
                      <TableCell>
                        <Tooltip title="Remove duplicate row">
                          <IconButton
                            sx={{ color: theme.palette.error.main }}
                            onClick={() => handleRemoveRow(rowIndex + page * rowsPerPage)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />

          <Box sx={{ mb: 6, mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={validationErrors.length > 0 || isLoading}
              color="primary"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Creation in Progress...
                </Box>
              ) : (
                'Create Items'
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                '&:hover': {
                  borderColor: theme.palette.error.dark,
                  backgroundColor: theme.palette.error.light,
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default React.memo(BulkCreateInventoryItem);