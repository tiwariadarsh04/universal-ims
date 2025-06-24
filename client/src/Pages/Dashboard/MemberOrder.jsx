import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert,
  Chip,
  useTheme,
  CircularProgress
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  LocationOn,
  AttachMoney,
  ShoppingBasket
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const MemberOrder = ({ 
  MemberID, 
  MemberName, 
  order, 
  orderDate, 
  status,
  _id,
  handleAcceptOrder,
  handleRejectOrder,
  ordertype,
  deliveryLocation
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  // Memoized values
  const totalAmountWithoutGST = useMemo(() => 
    order.reduce((total, item) => (total + item.issueRate * item.qty), 0),
    [order]
  );

  const totalGSTAmount = useMemo(() => 
    order.reduce((total, item) => (total + item.gstPercentage * item.issueRate * item.qty / 100), 0),
    [order]
  );

  const statusColor = useMemo(() => ({
    pending: "warning",
    accepted: "success",
    rejected: "error"
  }[status?.toLowerCase()] || "default"), [status]);

  const isParcelOrder = useMemo(() => ordertype === 'parcel', [ordertype]);

  // Memoized handlers
  const handleDialogOpen = useCallback((type) => {
    setActionType(type);
    setOpenDialog(true);
    setError(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
    setActionType(null);
    setError(null);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (actionType === "accept") {
        res = await handleAcceptOrder(_id);
      } else {
        res = await handleRejectOrder(_id);
      }
      
      if (res?.error) {
        setError(res.error);
        return;
      }
      
      setAlertMessage(res?.message || "Action completed successfully");
      setShowAlert(true);
      handleDialogClose();
    } catch (err) {
      console.error('Action error:', err);
      setError(err?.message || "An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  }, [actionType, _id, handleAcceptOrder, handleRejectOrder, handleDialogClose]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const [day, month, year] = dateString.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  }, []);

  return (
    <Card sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
      }
    }}>
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ 
            borderRadius: 0,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {showAlert && (
        <Alert 
          severity="success" 
          onClose={() => setShowAlert(false)}
          sx={{ 
            borderRadius: 0,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Avatar sx={{ 
              bgcolor: 'action.selected',
              color: 'text.primary',
              width: 36,
              height: 36
            }}>
              <PersonIcon fontSize="small" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2" fontWeight="bold" noWrap>
              {MemberName || "Unknown Member"} 
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {MemberID || "N/A"}
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={status?.toUpperCase() || "UNKNOWN"}
              color={statusColor}
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: 'medium',
                fontSize: '0.7rem'
              }}
            />
          </Grid>

          <Grid item>
            {
              ordertype=== 'parcel' ? (
                <Chip 
                  label={ordertype?.toUpperCase() || "UNKNOWN"}
                  color={'error'}
                  size="small"
                  variant="contained"
                  sx={{ 
                    fontWeight: 'medium',
                    fontSize: '0.7rem'
                  }}
            />
              ) : null
            }
          </Grid>
        </Grid>
      </Box>

      {/* Content */}
      <CardContent sx={{ 
        flexGrow: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Order Info */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon color="action" sx={{ fontSize: 18, mr: 1 }} />
            <Typography variant="caption">
              #{_id?.slice(-6).toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon color="action" sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="caption">
              {formatDate(orderDate)}
            </Typography>
          </Box>
        </Box>

        {
          ordertype === 'parcel' && <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn color="action" sx={{ fontSize: 18, mr: 1 }} />
              <Typography variant="caption">
                {deliveryLocation}
              </Typography>
            </Box>
          </Box>
        }

        {/* Order Items */}
        <Box sx={{ mb: 2 }}>
          {order.slice(0, expanded ? order.length : 1).map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom: index < order.length - 1 ? '1px dashed' : 'none',
                borderColor: 'divider',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Box>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  component="div"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <ShoppingBasket fontSize="small" color="action" />
                  {item.itemName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5
                  }}
                >
                  <span>{item.qty} × ₹{item.issueRate}</span>
                  {item.gstPercentage > 0 && (
                    <Chip 
                      label={`GST ${item.gstPercentage}%`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: 20,
                        fontSize: '0.65rem',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  )}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="bold"
                sx={{ 
                  color: 'primary.main',
                  minWidth: '80px',
                  textAlign: 'right'
                }}
              >
                ₹{(item.issueRate * item.qty + (item.gstPercentage * item.issueRate * item.qty / 100)).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Show More */}
        {order.length > 1 && (
          <Button
            size="small"
            endIcon={<ExpandMoreIcon sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s'
            }} />}
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              alignSelf: 'flex-start',
              fontSize: '0.75rem',
              px: 0,
              color: 'text.secondary',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: 'transparent',
                color: 'primary.main'
              }
            }}
            aria-expanded={expanded}
            aria-label={expanded ? 'Show less items' : 'Show more items'}
          >
            {expanded ? 'Show less' : `+${order.length - 1} more`}
          </Button>
        )}

        {/* Total */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography 
              variant="subtitle2"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Total 
            </Typography>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              sx={{ 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              ₹{(totalAmountWithoutGST + totalGSTAmount).toFixed(2)}
            {/* {order.some(item => item.gstPercentage > 0) && (
                <Chip 
                  label="Incl. GST"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    height: 20,
                    fontSize: '0.65rem',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              )} */}
            </Typography>

          </Box>
        </Box>
      </CardContent>

      {/* Actions */}
      {status?.toLowerCase() === "pending" && (
        <Box sx={{ 
          p: 2,
          display: 'flex',
          gap: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <LoadingButton
            fullWidth
            variant="outlined"
            color="success"
            size="small"
            startIcon={<CheckCircleIcon fontSize="small" />}
            onClick={() => handleDialogOpen("accept")}
            loading={loading && actionType === "accept"}
            loadingPosition="start"
            sx={{ 
              borderRadius: 1,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            Accept
          </LoadingButton>
          <LoadingButton
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CancelIcon fontSize="small" />}
            onClick={() => handleDialogOpen("reject")}
            loading={loading && actionType === "reject"}
            loadingPosition="start"
            sx={{ 
              borderRadius: 1,
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            Reject
          </LoadingButton>
        </Box>
      )}

      {/* Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={!loading ? handleDialogClose : undefined}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%',
            maxWidth: '400px',
            position: 'relative'
          }
        }}
      >
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}

        <DialogTitle sx={{ 
          fontWeight: 'bold',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {actionType === "accept" ? (
            <CheckCircleIcon color="success" />
          ) : (
            <CancelIcon color="error" />
          )}
          {actionType === "accept" ? 'Accept Order' : 'Reject Order'}
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 ,mt: 2}}>
            Are you sure you want to {actionType} this order?
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'background.default',
            borderRadius: 1,
            p: 2,
            mb: 2
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Member
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  {MemberName}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Order Details
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon fontSize="small" />
                  #{_id?.slice(-6).toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" />
                  {formatDate(orderDate)}
                </Typography>
              </Grid>

              {isParcelOrder && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Delivery Location
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" />
                    {deliveryLocation}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Total Amount (Incl. GST)
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney fontSize="small" />
                  ₹{ (totalAmountWithoutGST + totalGSTAmount).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          gap: 1
        }}>
          <Button 
            onClick={handleDialogClose}
            size="small"
            disabled={loading}
            sx={{ 
              borderRadius: 1,
              px: 2
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={actionType === "accept" ? "success" : "error"}
            variant="contained"
            size="small"
            disabled={loading}
            sx={{ 
              borderRadius: 1,
              px: 2
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              actionType === "accept" ? "Accept" : "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default React.memo(MemberOrder);