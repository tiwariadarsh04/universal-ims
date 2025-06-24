import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Button,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Inventory2,
  TrendingUp,
  TrendingDown,
  Category,
  LocalOffer,
  Receipt,
  Delete,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { deleteInventoryItem } from '../../services/Inventory';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8) 
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
}));

const DetailCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  padding: theme.spacing(2),
  borderRadius: 10,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8) 
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
}));

const ItemDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const item = location.state?.item;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getCategoryName = (code) => {
    switch(code) {
      case 5: return "Kitchen";
      case 3: return "Bar";
      case 6: return "Snacks";
      case 54: return "Misc";
      default: return "Other";
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteInventoryItem(item.ItemCode);
      
      if (response.error) {
        throw new Error(response.error);
      }

      enqueueSnackbar('Item deleted successfully', { variant: 'success' });
      navigate('/inventory');
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to delete item', { variant: 'error' });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h6" color="error">
            No item data available
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/inventory')}
            sx={{ mt: 2 }}
          >
            Back to Inventory
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/inventory')}
            sx={{ 
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.paper, 0.9),
              '&:hover': {
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.9)
                  : alpha(theme.palette.background.paper, 1),
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 300
          }}>
            back to inventory
          </Typography>
        </Box>
      </Box>

      <StyledPaper>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.light,
                  width: 56,
                  height: 56
                }}>
                  <Inventory2 sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {item.ItemName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`Code: ${item.ItemCode}`}
                      size="small"
                      color="primary"
                      sx={{ borderRadius: 4 }}
                    />
                    <Chip 
                      label={`Alias: ${item.ItemAliasCode}`}
                      size="small"
                      color="secondary"
                      sx={{ borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              </Box>
              {/* <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteClick}
                sx={{ 
                  borderRadius: 6,
                  px: 4,
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.darker} 100%)`,
                  }
                }}
              >
                Delete Item
              </Button> */}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category /> Basic Information
                </Typography>
                <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{getCategoryName(item.ItemGroup)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Category Code</Typography>
                    <Typography variant="body1">{item.ItemGroup}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Sub Group</Typography>
                    <Typography variant="body1">{item.ItemSubGroup}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">HSN ID</Typography>
                    <Typography variant="body1">{item.hsnid}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Pricing Information */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOffer /> Pricing Information
                </Typography>
                <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Cost Price</Typography>
                    <Typography variant="body1">₹{item.Rate?.toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Selling Price</Typography>
                    <Typography variant="body1">₹{item.IssueRate?.toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Party Sale Rate</Typography>
                    <Typography variant="body1">₹{item.PartySaleRate?.toFixed(2)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">GST Information</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body1">{item.gstPercentage}%</Typography>
                      <Chip 
                        size="small"
                        label={item.isgstapplicable ? "GST Applicable" : "GST Not Applicable"}
                        color={item.isgstapplicable ? "success" : "default"}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Stock Information */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt /> Stock Information
                </Typography>
                <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Current Stock</Typography>
                    <Typography variant="body1">{item.UnitQty} units</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Issue Unit</Typography>
                    <Typography variant="body1">{item.IssueUnit}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Issue Unit Quantity</Typography>
                    <Typography variant="body1">{item.IssueUnitqty}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Capacity</Typography>
                    <Typography variant="body1">{item.capacity || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={item.UnitQty > 0 ? "In Stock" : "Out of Stock"}
                      color={item.UnitQty > 0 ? "success" : "error"}
                      icon={item.UnitQty > 0 ? <TrendingUp /> : <TrendingDown />}
                    />
                  </Box>
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} md={6}>
            <DetailCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt /> Additional Information
                </Typography>
                <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Sale Tax Code</Typography>
                    <Typography variant="body1">{item.Saletaxcode}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tally Purchase Account</Typography>
                    <Typography variant="body1">{item.tally_acc_purchaseid}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Tally Sale Account</Typography>
                    <Typography variant="body1">{item.tally_acc_saleid}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Created At</Typography>
                    <Typography variant="body1">{new Date(item.createdAt).toLocaleString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body1">{new Date(item.updatedAt).toLocaleString()}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </DetailCard>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Item
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{item.ItemName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetails; 