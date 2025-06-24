// src/components/Dialogs/ConfirmDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const ConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  summaryData = null
}) => {
  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
          minWidth: '450px',
          borderTop: `4px solid ${theme.palette.warning.main}`,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        py: 2,
        px: 3,
      }}>
        <WarningIcon color="warning" sx={{ mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" component="div" color="warning.main">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please review before proceeding
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText sx={{ mb: 2 }}>
          {message}
        </DialogContentText>
        
        {summaryData && (
          <Box sx={{ 
            mt: 2, 
            p: 3, 
            backgroundColor: 'background.paper', 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <Typography variant="subtitle2" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center',
              color: 'primary.main',
            }}>
              <ReceiptIcon sx={{ mr: 1 }} /> Summary
            </Typography>
            
            {Object.entries(summaryData).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: '120px' }}>
                  {key}:
                </Typography>
                <Typography variant="body2">
                  {value}
                </Typography>
              </Box>
            ))}
            
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: 1,
              textAlign: 'center',
            }}>
              <Typography variant="caption" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="secondary"
          sx={{ 
            borderRadius: 2,
            px: 4,
            textTransform: 'none',
          }}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          sx={{ 
            borderRadius: 2,
            px: 4,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;