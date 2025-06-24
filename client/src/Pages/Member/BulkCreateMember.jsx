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
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CancelIcon from '@mui/icons-material/Cancel';
import GppBadIcon from '@mui/icons-material/GppBad';
import { createBulkMember } from '../../services/Member';

// Constants
const REQUIRED_COLUMNS = ['MemberID', 'Name', 'Password'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;
const VALID_STATUSES = ['active', 'inactive'];
const VALID_ROLES = ['user', 'viewer'];
const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 500, 1000];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['.xlsx', '.xls'];
const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const BulkCreateMember = () => {
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
      if (!row[0]?.trim()) {
        errors.push({
          row: rowIndex + 1,
          column: 1,
          message: 'MemberID is required and must be a non-empty string'
        });
      }

      if (!row[1]?.trim()) {
        errors.push({
          row: rowIndex + 1,
          column: 2,
          message: 'Name is required and must be a non-empty string'
        });
      }

      if (!row[5]?.trim()) {
        errors.push({
          row: rowIndex + 1,
          column: 6,
          message: 'Password is required and must be a non-empty string'
        });
      }

      // Optional fields validation
      if (row[4] && !EMAIL_PATTERN.test(row[4])) {
        errors.push({
          row: rowIndex + 1,
          column: 5,
          message: 'Invalid email format'
        });
      }

      if (row[3] && !PHONE_PATTERN.test(String(row[3]))) {
        errors.push({
          row: rowIndex + 1,
          column: 4,
          message: 'Phone number must be 10 digits'
        });
      }

      if (row[6] && !VALID_STATUSES.includes(row[6].toLowerCase())) {
        errors.push({
          row: rowIndex + 1,
          column: 7,
          message: 'MembershipStatus must be either "active" or "inactive"'
        });
      }

      if (row[7] && !VALID_ROLES.includes(row[7].toLowerCase())) {
        errors.push({
          row: rowIndex + 1,
          column: 8,
          message: 'Role must be either "user" or "viewer"'
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

  // Event handlers
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

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
    link.href = '/sampleFormate/memberProfile_formate.xlsx';
    link.download = 'member_formate.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleCreate = useCallback(async () => {
    if (validationErrors.length > 0) {
      setErrorDialog({
        open: true,
        message: 'Please fix all validation errors before creating members.'
      });
      return;
    }

    setIsLoading(true);
    try {
      const members = data.map((row) => ({
        MemberID: row[0],
        Name: row[1],
        Pno: row[2] || row[0],
        Contact: row[3] || null,
        Email: row[4] || `${row[0]}@noaclub.com`,
        Password: row[5],
        MembershipStatus: (row[6] || 'active').toLowerCase(),
        Role: (row[7] || 'user').toLowerCase(),
        Transaction: [],
        FamilyMember: [],
      }));

      const res = await createBulkMember(members);
      
      if (res?.members) {
        setSnackbar({
          open: true,
          message: `Successfully created ${res.members.length} members!`,
          severity: 'success'
        });
        handleCancel();
      } else {
        throw new Error(res?.message || 'Failed to create members');
      }
    } catch (error) {
      setErrorDialog({
        open: true,
        message: `Error creating members: ${error.message}`
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
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          Please upload an Excel file to create members in bulk. <br /> Ensure the file follows the required format.
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          Check your data before saving!
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
              Download sample excel
            </Link>
          </Typography>
        </Box>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div
          style={{
            position: 'fixed',
            zIndex: '9999',
            right: '0',
            bottom: '0',
          }}
        >
          <Paper
            sx={{
              padding: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              margin: 8,
              width: '300px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translate(-1px,-1px)' },
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.4em',
                }}
              >
                <NotificationImportantIcon sx={{ color: 'red', fontSize: '1.5em' }} />
                <Typography variant="body1" color="red">
                  Validation errors
                </Typography>
              </div>
              <CancelIcon
                onClick={ignoreValidationError}
                sx={{
                  opacity: '0.8',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.07)', opacity: '1' },
                }}
              />
            </div>

            <List
              sx={{
                borderRadius: 2,
                overflowY: 'scroll',
                maxHeight: '200px',
                marginTop: '1em',
              }}
            >
              {validationErrors.map((error, index) => (
                <ListItem key={index} sx={{ display: 'flex', gap: '1em' }}>
                  <GppBadIcon sx={{ color: 'red' }} />
                  <ListItemText
                    primary={`Row ${error.row}, Column ${error.column}`}
                    secondary={error.message}
                    sx={{ color: 'red' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      )}

      {/* Table Display */}
      {file && data.length > 0 && (
        <Box sx={{ width: '100%', mt: 4 }}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1em',
                flexWrap: 'wrap',
                marginLeft: '1em',
              }}
            >
              <Chip label={`Column x Row: ${stats.numColumns}x${stats.numRows}`} color="primary" variant="outlined" />
              <Chip label={`Unique Rows: ${stats.uniqueRows}`} color="success" variant="outlined" />
              <Chip label={`Unique Columns: ${stats.uniqueColumns}`} color="success" variant="outlined" />
              <Chip label={`Duplicate Rows: ${stats.duplicateRows}`} color="error" variant="outlined" />
              <Chip label={`Duplicate Columns: ${stats.duplicateColumns}`} color="error" variant="outlined" />
            </Grid>
          </Grid>

          {/* Table Display */}
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
                        <IconButton
                          sx={{ ml: 1, color: '#fff' }}
                          onClick={() => handleRemoveColumn(index)}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
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
                      backgroundColor: duplicateRows.includes(rowIndex + page * rowsPerPage) ? theme.palette.warning.dark : 'inherit',
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
                        <IconButton
                          sx={{ color: '#fff' }}
                          onClick={() => handleRemoveRow(rowIndex + page * rowsPerPage)}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Create and Cancel Buttons */}
          <Box sx={{ mb: 6, mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={validationErrors.length > 0 || isLoading}
              color='primary'
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {isLoading ? "Creation in Progress.." : "Create"}
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

export default React.memo(BulkCreateMember);