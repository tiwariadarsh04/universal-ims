import { 
    Box, 
    Typography, 
    Paper, 
    Avatar, 
    Chip, 
    Divider, 
    Button, 
    IconButton,
    Grid,
    Stack,
    Tooltip
  } from '@mui/material';
  import { 
    ArrowBack, 
    Print, 
    Download, 
    Share, 
    Receipt, 
    Person, 
    Email, 
    Phone, 
    CalendarToday,
    LocalAtm,
    Payment,
    ConfirmationNumber
  } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


  const mockTransaction = {
    _id: "TRX123456789",
    invoiceNumber: "INV-2023-0456",
    invoiceDate: "2023-11-15T10:30:00Z",
    status: "Completed",
    memberId: "MEM78901",
    memberName: "Rahul Sharma",
    memberPno: "MBR202300789",
    email: "rahul.sharma@example.com",
    phone: "+919876543210",
    paymentMethod: "Credit Card",
    paymentDate: "2023-11-15T11:45:00Z",
    transactionId: "PYMT987654321",
    notes: "Customer requested email receipt",
    items: [
      {
        itemCode: "PROD001",
        itemName: "Wireless Headphones",
        qty: 2,
        amount: 5998, // 2 x 2999
        gstPercentage: 18,
        unitPrice: 2999
      },
      {
        itemCode: "PROD045",
        itemName: "Bluetooth Speaker",
        qty: 1,
        amount: 2499,
        gstPercentage: 18,
        unitPrice: 2499
      },
      {
        itemCode: "PROD112",
        itemName: "USB-C Cable",
        qty: 3,
        amount: 897, // 3 x 299
        gstPercentage: 12,
        unitPrice: 299
      }
    ],
    // Calculated fields (you can compute these from items)
    subtotal: 9394, // 5998 + 2499 + 897
    totalGst: 1489.26, // (5998*0.18) + (2499*0.18) + (897*0.12)
    grandTotal: 10883.26 // 9394 + 1489.26
  };
  
  const TransactionDetails = () => {

    const [transaction, setTransaction] = useState(mockTransaction);

    const receivedTransactionDetails = useLocation();

    const navigate = useNavigate();

    // Calculate totals
    const subtotal = transaction.items.reduce((sum, item) => sum + item.amount, 0);
    const totalGst = transaction.items.reduce((sum, item) => sum + (item.amount * (item.gstPercentage || 0) / 100), 0);
    const grandTotal = subtotal + totalGst;


    useEffect(()=>{
      if(receivedTransactionDetails?.state){
        setTransaction(receivedTransactionDetails?.state)
      }
    })
  
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, mb:12 }}>
        {/* Header with action buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() =>navigate(-1)}
            sx={{ color: 'text.primary' }}
          >
            Back to Transactions
          </Button>
          
          <Stack direction="row" spacing={2}>
            <Tooltip title="Print Invoice">
              <IconButton sx={{ 
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'primary.main', color: 'white' }
              }}>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download PDF">
              <IconButton sx={{ 
                bgcolor: 'secondary.light',
                '&:hover': { bgcolor: 'secondary.main', color: 'white' }
              }}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton sx={{ 
                bgcolor: 'info.light',
                '&:hover': { bgcolor: 'info.main', color: 'white' }
              }}>
                <Share />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
  
        {/* Invoice Header Card */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
          borderLeft: '4px solid',
          borderColor: 'primary.main'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  width: 60,
                  height: 60
                }}>
                  <Receipt fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    Invoice {transaction.invoiceNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(transaction.invoiceDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                gap: 1
              }}>
                <Chip 
                  label={transaction.status || 'Completed'} 
                  color={transaction.status === 'Pending' ? 'warning' : 'success'}
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="h5" fontWeight={700}>
                  ₹{grandTotal.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Includes ₹{totalGst.toFixed(2)} GST
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
  
        {/* Customer and Payment Info */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Member Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'action.selected' }}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{transaction.memberName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    P.No: {transaction.memberPno}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email color="action" fontSize="small" />
                    <Typography variant="body2">
                      {transaction.email || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone color="action" fontSize="small" />
                    <Typography variant="body2">
                      {transaction.phone || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Payment Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Payment color="action" fontSize="small" />
                    <Typography variant="body2">
                      {transaction.paymentMethod || 'Cash'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ConfirmationNumber color="action" fontSize="small" />
                    <Typography variant="body2">
                      {transaction.transactionId || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday color="action" fontSize="small" />
                    <Typography variant="body2">
                      {new Date(transaction.paymentDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalAtm color="action" fontSize="small" />
                    <Typography variant="body2">
                      ₹{grandTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
  
        {/* Items Table */}
        <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" fontWeight={600}>
              Purchased Items
            </Typography>
          </Box>
          
          <Box sx={{ p: 0 }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'action.hover'
            }}>
              <Typography variant="subtitle2" fontWeight={600}>Item</Typography>
              <Typography variant="subtitle2" fontWeight={600} align="right">Qty</Typography>
              <Typography variant="subtitle2" fontWeight={600} align="right">Unit Price</Typography>
              <Typography variant="subtitle2" fontWeight={600} align="right">Amount</Typography>
              <Typography variant="subtitle2" fontWeight={600} align="right">GST %</Typography>
              <Typography variant="subtitle2" fontWeight={600} align="right">Total</Typography>
            </Box>
            
            {transaction.items.map((item, index) => {
              const gstAmount = item.amount * (item.gstPercentage || 0) / 100;
              const itemTotal = item.amount + gstAmount;
              
              return (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Typography>{item.itemName}</Typography>
                  <Typography align="right">{item.qty}</Typography>
                  <Typography align="right">₹{(item.amount/item.qty).toFixed(2)}</Typography>
                  <Typography align="right">₹{item.amount.toFixed(2)}</Typography>
                  <Typography align="right">{item.gstPercentage || 0}%</Typography>
                  <Typography align="right" fontWeight={600}>₹{itemTotal.toFixed(2)}</Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
  
        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                PAYMENT NOTES
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {transaction.notes || 'No additional notes provided'}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 2
              }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1" align="right">₹{subtotal.toFixed(2)}</Typography>
                
                <Typography variant="body1">GST:</Typography>
                <Typography variant="body1" align="right">₹{totalGst.toFixed(2)}</Typography>
                
                <Divider sx={{ gridColumn: '1 / -1', my: 1 }} />
                
                <Typography variant="h6" fontWeight={700}>Total Amount:</Typography>
                <Typography variant="h6" fontWeight={700} align="right">
                  ₹{grandTotal.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default TransactionDetails;