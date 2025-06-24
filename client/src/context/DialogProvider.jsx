// src/context/DialogContext.js
import React, { createContext, useState, useContext } from 'react';
import { AlertDialog, ConfirmDialog } from '../components/Dialog/index';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    title: '',
    message: '',
    severity: 'info'
  });

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    isLoading: false,
    summaryData: null
  });

  const showAlert = (title, message, severity = 'info') => {
    setAlertState({
      open: true,
      title,
      message,
      severity
    });
  };

  const showConfirm = ({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    isLoading = false,
    summaryData = null
  }) => {
    setConfirmState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      isLoading,
      summaryData
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, open: false }));
  };

  const hideConfirm = () => {
    setConfirmState(prev => ({ ...prev, open: false }));
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AlertDialog
        open={alertState.open}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        severity={alertState.severity}
      />
      <ConfirmDialog
        open={confirmState.open}
        onClose={hideConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        isLoading={confirmState.isLoading}
        summaryData={confirmState.summaryData}
      />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};