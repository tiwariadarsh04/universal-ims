// src/components/Dialogs/AlertDialog.js
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
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const AlertDialog = ({ open, onClose, title, message, severity = 'info' }) => {
  const theme = useTheme();
  
  const getSeverityStyles = () => {
    switch(severity) {
      case 'error':
        return {
          icon: <ErrorIcon color="error" sx={{ fontSize: 32, mr: 2 }} />,
          bgColor: 'rgba(244, 67, 54, 0.1)',
          borderColor: theme.palette.error.main,
          titleColor: theme.palette.error.main
        };
      case 'warning':
        return {
          icon: <WarningIcon color="warning" sx={{ fontSize: 32, mr: 2 }} />,
          bgColor: 'rgba(255, 152, 0, 0.1)',
          borderColor: theme.palette.warning.main,
          titleColor: theme.palette.warning.main
        };
      case 'success':
        return {
          icon: <CheckCircleIcon color="success" sx={{ fontSize: 32, mr: 2 }} />,
          bgColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: theme.palette.success.main,
          titleColor: theme.palette.success.main
        };
      default: // info
        return {
          icon: <InfoIcon color="info" sx={{ fontSize: 32, mr: 2 }} />,
          bgColor: 'rgba(25, 118, 210, 0.1)',
          borderColor: theme.palette.info.main,
          titleColor: theme.palette.info.main
        };
    }
  };

  const severityStyles = getSeverityStyles();

  return (
    <Dialog
      open={open}
      onClose={severity === 'error' ? undefined : onClose}
      disableEscapeKeyDown={severity === 'error'}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
          minWidth: '400px',
          borderTop: `4px solid ${severityStyles.borderColor}`,
          position: 'relative',
          zIndex: 1300
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 1299
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        color: severityStyles.titleColor,
        backgroundColor: severityStyles.bgColor,
        py: 2,
        px: 3,
        mb:2,
      }}>
        {severityStyles.icon}
        <Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {severity === 'error' ? 'Please fix the following issue' : 
             severity === 'success' ? 'Operation successful' : 
             'Information'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          p: 2,
          backgroundColor: severityStyles.bgColor,
          borderRadius: 2,
          mb: 2,
        }}>
          {severity === 'error' ? (
            <InfoIcon color="error" sx={{ mr: 2 }} />
          ) : severity === 'success' ? (
            <CheckCircleIcon color="success" sx={{ mr: 2 }} />
          ) : (
            <InfoIcon color="info" sx={{ mr: 2 }} />
          )}
          <DialogContentText sx={{ color: 'text.primary' }}>
            {message}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          color={severity}
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
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;