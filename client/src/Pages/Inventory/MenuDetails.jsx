import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  Divider,
  Box,
  IconButton,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  styled,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Slide,
  useMediaQuery,
  Paper,
  InputAdornment,
  Backdrop,
} from "@mui/material";
import {
  LocalBar as BarIcon,
  Restaurant as KitchenIcon,
  LocalCafe as BeverageIcon,
  MoreHoriz as OthersIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Category as CategoryIcon,
  AttachMoney as RateIcon,
  ClearAll,
  RoomService as RoomServiceIcon,
  AddShoppingCart,
  Backspace as BackspaceIcon,
  CurrencyRupee,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { createOrder, pendingOrderCountOfMember } from "../../services/order";
import { fetchInventoryItems } from "../../services/Inventory";
import { UserProfileContext } from "../../context/userProvider";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import SignInFooter from '../LandingPage/SignIn-Footer';

// Modern styled components
const MenuCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
  '&:hover': {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
    '& .MuiCardContent-root': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    }
  }
}));

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontWeight: selected ? 600 : 400,
  backgroundColor: selected ? theme.palette.primary.main : alpha(theme.palette.grey[200], 0.8),
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.grey[300],
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2]
  }
}));

const CartContainer = styled(Paper)(({ theme }) => ({
  top: theme.spacing(2),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
    transform: 'translateY(-2px)'
  }
}));

const CartItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
    transform: 'translateX(4px)'
  },
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const MenuDetails = () => {
  // State management
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState({});
  const [dialogMessage, setDialogMessage] = useState(null);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [orderType, setOrderType] = useState('inRestaurant');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { userProfile } = useContext(UserProfileContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Constants
  const categoryMap = {
    "3": "Bar",
    "4": "Beverages",
    "5": "Kitchen",
    "54": "Kitchen",
  };

  const categoryIcons = {
    Bar: <BarIcon />,
    Beverages: <BeverageIcon />,
    Kitchen: <KitchenIcon />,
    Others: <OthersIcon />,
  };

  const deliveryLocations = [
    'IBA',
    'CBA',
    'LBA',
    'MBA',
    'Hawa Mahal',
    'GM Bunglow',
  ];

  const itemsPerPage = 6;

  // Memoized calculations
  const filteredData = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = item.ItemName.toLowerCase().includes(searchQuery.toLowerCase());
      const category = categoryMap[item.ItemGroup] || "Others";
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [inventoryItems, searchQuery, selectedCategory]);

  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const category = categoryMap[item.ItemGroup] || "Others";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [filteredData]);

  const totalAmount = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.issueRate * item.qty), 0);
    return orderType === 'parcel' ? subtotal + 0 : subtotal;
  }, [cart, orderType, deliveryCharge]);

  // Effects
  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (userProfile?._id) {
        try {
          const response = await pendingOrderCountOfMember(userProfile?._id);
          if (response?.success) {
            setPendingOrdersCount(response.count);
          }
        } catch (error) {
          console.error('Error fetching pending orders count:', error);
        }
      }
    };
    fetchPendingOrders();
    return () => {
      
    };
  }, [userProfile?._id, openConfirm]);

  useEffect(() => {
    
    if (orderType === 'parcel') {
      setDeliveryCharge(15);
    } else {
      setDeliveryCharge(0);
    }
  }, [orderType]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const getInventoryData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchInventoryItems();
        if (res?.success) {
          setInventoryItems(res.data);
        } else {
          throw new Error(res?.message || "Failed to fetch inventory");
        }
      } catch (error) {
        setDialogMessage(error.message);
        setIsOrderSuccess(false);
        setOpenConfirm(true);
      } finally {
        setIsLoading(false);
      }
    };
    getInventoryData();
  }, []);

  // Handlers
  const handleAddToCart = (item) => {

    console.log(item);
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.itemCode === item.ItemCode);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.itemCode === item.ItemCode
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [
        ...prevCart,
        {
          itemName: item.ItemName,
          itemGroup: item.ItemGroup,
          itemCode: item.ItemCode,
          qty: 1,
          issueRate: item.IssueRate,
          gstPercentage: item.gstPercentage,
          purchaseRate: item.Rate
        },
      ];
    });
  };

  const handleIncrement = (itemCode) => {
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.itemCode === itemCode
          ? { ...cartItem, qty: cartItem.qty + 1 }
          : cartItem
      )
    );
  };

  const handleDecrement = (itemCode) => {
    setCart(prevCart =>
      prevCart
        .map(cartItem =>
          cartItem.itemCode === itemCode
            ? { ...cartItem, qty: Math.max(0, cartItem.qty - 1) }
            : cartItem
        )
        .filter(cartItem => cartItem.qty > 0)
    );
  };

  const handlePageChange = (category, newPage) => {
    setPage(prev => ({ ...prev, [category]: newPage }));
  };

  const handleCloseDialog = () => {
    setOpenConfirm(false);
    setDialogMessage(null);
  };

  const createNewOrder = async () => {
    if (!userProfile?._id || cart.length === 0) {
      setDialogMessage(userProfile?._id ? 'Your cart is empty!' : 'Member information missing');
      setIsOrderSuccess(false);
      setOpenConfirm(true);
      return;
    }

    setDialogMessage(null);

    if (orderType === 'parcel' && (!deliveryLocation || !roomNo)) {
      setDialogMessage('Please select delivery location and enter room number');
      setIsOrderSuccess(false);
      setOpenConfirm(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        MemberID: userProfile._id,
        MemberName: userProfile.Name,
        orderDate: new Date().toLocaleDateString(),
        orderType: orderType,
        deliveryCharge: orderType === 'parcel' ? deliveryCharge : 0,
        ...(orderType === 'parcel' && {
          deliveryLocation,
          roomNo
        }),
        order: cart.map(item => ({
          itemName: item.itemName,
          itemGroup: item.itemGroup,
          itemCode: item.itemCode,
          qty: item.qty,
          issueRate: item.issueRate,
          purchaseRate: item.purchaseRate,
          gstPercentage: item.gstPercentage
        }))
      };

      const res = await createOrder(orderPayload);
      
      if (res?.success) {
        setCart([]);
        localStorage.removeItem('cart');
        setDialogMessage('Order placed successfully!');
        setIsOrderSuccess(true);
      } else {
        throw new Error(res?.message || 'Order failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      setDialogMessage(error.message || 'Order creation failed');
      setIsOrderSuccess(false);
    } finally {
      setIsSubmitting(false);
      setOpenConfirm(true);
    }
  };

  console.log(cart);

  // Render functions
  const renderPendingOrdersAlert = () => (
    <Fade in timeout={800}>
      <Box 
        sx={{
          mt: 10,
          mb: 3,
          p: 3,
          borderRadius: 2,
          backgroundColor: pendingOrdersCount >= 2 
            ? alpha(theme.palette.error.main, 0.1)
            : alpha(theme.palette.info.main, 0.1),
          borderLeft: `4px solid ${
            pendingOrdersCount >= 2 ? theme.palette.error.main : theme.palette.info.main
          }`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: theme.shadows[2],
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <Box sx={{ 
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: pendingOrdersCount >= 2 ? theme.palette.error.main : theme.palette.info.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: theme.shadows[2]
        }}>
          {pendingOrdersCount >= 2 ? '!' : pendingOrdersCount}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 'medium',
            color: pendingOrdersCount >= 2 ? theme.palette.error.main : theme.palette.info.main
          }}>
            {pendingOrdersCount >= 2 ? 'Order Limit Reached' : 'Pending Orders'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            You have {pendingOrdersCount} pending {pendingOrdersCount === 1 ? 'order' : 'orders'}.
            {pendingOrdersCount >= 2 && (
              <span style={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                {' '}Please wait until your current orders are accepted.
              </span>
            )}
          </Typography>
          <Box sx={{ 
            mt: 1,
            width: '100%',
            height: 6,
            bgcolor: alpha(theme.palette.grey[300], 0.5),
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <Box sx={{
              width: `${Math.min(100, (pendingOrdersCount / 2) * 100)}%`,
              height: '100%',
              bgcolor: pendingOrdersCount >= 2 ? theme.palette.error.main : theme.palette.info.main,
              transition: 'width 0.3s ease',
              boxShadow: theme.shadows[1]
            }} />
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  const renderCartSummary = () => (
    <Slide direction="left" in timeout={1000}>
      <CartContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Your Order
          </Typography>
          {cart.length > 0 && (
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<BackspaceIcon />}
              onClick={() => setCart([])}
              size="small"
              sx={{
                borderRadius: '12px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2]
                }
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {cart.length > 0 ? (
          <>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
              {cart.map((item) => (
                <CartItem key={item.itemCode}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      width: 40, 
                      height: 40, 
                      mr: 2, 
                      bgcolor: 'primary.main',
                      boxShadow: theme.shadows[2]
                    }}>
                      {item.itemName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.itemName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{item.issueRate.toFixed(2)} × {item.qty}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDecrement(item.itemCode)}
                      color="error"
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: alpha(theme.palette.error.main, 0.1)
                        }
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body1" sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                      {item.qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleIncrement(item.itemCode)}
                      color="primary"
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CartItem>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Order Type Selection */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Order Type*
              </Typography>
              <ButtonGroup fullWidth>
                <Button 
                  variant={orderType === 'inRestaurant' ? 'contained' : 'outlined'}
                  onClick={() => {
                    let updatedCart = cart.filter((item) => item.itemCode !== 199);
                    setCart(updatedCart);
                    setOrderType('inRestaurant')
                  }}
                  sx={{
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                >
                  In Restaurant
                </Button>
                <Button 
                  variant={orderType === 'parcel' ? 'contained' : 'outlined'}
                  onClick={() => {
                    const parcelDetails = inventoryItems.filter((item) => item.ItemCode == 199);
                    const parcelItem = {
                      itemName: parcelDetails[0].ItemName,
                      itemCode: parcelDetails[0].ItemCode,
                      qty: 1,
                      issueRate: parcelDetails[0].IssueRate,
                      gstPercentage: parcelDetails[0].gstPercentage,
                      purchaseRate: parcelDetails[0].Rate
                    }
                    let isParcelAdded = cart.filter((item) => item.itemCode === 199);                    
                    if(!isParcelAdded.length){
                      setCart([...cart, parcelItem]);
                    }
                    setOrderType('parcel')
                  }}
                  sx={{
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                >
                  Parcel (+₹{deliveryCharge.toFixed(2)})
                </Button>
              </ButtonGroup>
            </Box>

            {/* Delivery Information */}
            {orderType === 'parcel' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Delivery Information*
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Delivery Location*"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  sx={{ mb: 2 }}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select a location</option>
                  {deliveryLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Flat/Room No.*"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                />
              </Box>
            )}

            {/* Order Summary */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">
                  ₹{(totalAmount - (orderType === 'parcel' ? deliveryCharge : 0)).toFixed(2)}
                </Typography>
              </Box>
              {orderType === 'parcel' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Delivery Charge:</Typography>
                  <Typography variant="body2">₹{deliveryCharge.toFixed(2)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  ₹{totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => setOpenConfirm(true)}
              disabled={isSubmitting || pendingOrdersCount >= 2}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <RoomServiceIcon />}
              sx={{ 
                mt: 3, 
                py: 1.5,
                borderRadius: '12px',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                },
                '&:disabled': {
                  background: theme.palette.grey[300],
                  color: theme.palette.grey[500]
                }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 4,
            textAlign: 'center'
          }}>
            <AddShoppingCart fontSize="large" color="disabled" sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Your cart is empty. Add some items to get started!
            </Typography>
          </Box>
        )}
      </CartContainer>
    </Slide>
  );

  const renderMenuItems = () => (
    <Box sx={{ mb: 4 }}>
      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              '&:hover': {
                boxShadow: theme.shadows[2]
              }
            }
          }}
        />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {["All", "Bar", "Beverages", "Kitchen", "Others"].map((category) => (
            <CategoryChip
              key={category}
              label={category}
              avatar={<Avatar>{categoryIcons[category]}</Avatar>}
              onClick={() => setSelectedCategory(category)}
              selected={selectedCategory === category}
            />
          ))}
        </Box>
      </Box>

      {/* Menu Sections */}
      {Object.keys(groupedData).length > 0 ? (
        Object.entries(groupedData).map(([category, items], index) => {
          const currentPage = page[category] || 1;
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

          return (
            <Box key={category} sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main',
                  boxShadow: theme.shadows[2]
                }}>
                  {categoryIcons[category]}
                </Avatar>
                <Typography variant="h4" sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {category}
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {paginatedItems.map((item) => {
                  const cartItem = cart.find((cartItem) => cartItem.itemCode === item.ItemCode);
                  const quantity = cartItem ? cartItem.qty : 0;

                  return (
                    <Grid item key={item.ItemCode} xs={12} sm={6} md={4} lg={3}>
                      <MenuCard>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700,
                            mb: 1,
                            position: 'relative',
                            '&:after': {
                              content: '""',
                              position: 'absolute',
                              bottom: -8,
                              left: 0,
                              width: 40,
                              height: 3,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              borderRadius: '2px'
                            }
                          }}>
                            {item.ItemName}
                          </Typography>
    
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 2 }}>
                            Item Code - {item.ItemSubGroup}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CurrencyRupee sx={{ color: 'text.secondary' }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {item.IssueRate.toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                        
                        <Box sx={{ p: 2 }}>
                          {quantity === 0 ? (
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              onClick={() => handleAddToCart(item)}
                              startIcon={<AddShoppingCart />}
                              sx={{
                                borderRadius: '12px',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: theme.shadows[4]
                                }
                              }}
                            >
                              Add to Cart
                            </Button>
                          ) : (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between'
                            }}>
                              <IconButton
                                color="primary"
                                onClick={() => handleDecrement(item.ItemCode)}
                                size="large"
                                sx={{
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor: alpha(theme.palette.error.main, 0.1)
                                  }
                                }}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {quantity}
                              </Typography>
                              <IconButton
                                color="primary"
                                onClick={() => handleIncrement(item.ItemCode)}
                                size="large"
                                sx={{
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </MenuCard>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Pagination */}
              {items.length > itemsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={Math.ceil(items.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(e, newPage) => handlePageChange(category, newPage)}
                    color="primary"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '8px',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[2]
                        }
                      }
                    }}
                  />
                </Box>
              )}

              {index < Object.keys(groupedData).length - 1 && (
                <Divider sx={{ my: 4 }} />
              )}
            </Box>
          );
        })
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 8,
          textAlign: 'center'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
            <path d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.2843 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No items found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderLoadingState = () => (
    <LoadingScreen 
      loadingText="Loading Menu Items..."
      variant="circular"
      size={60}
      fullScreen={false}
      showPoweredBy={false}
      customStyle={{
        minHeight: '60vh',
        gap: 3
      }}
    />
  );

  return (
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
          {/* Pending Orders Alert */}
          {pendingOrdersCount > 0 && renderPendingOrdersAlert()}

          {/* Cart Summary */}
          {renderCartSummary()}

          {/* Menu Items */}
          {renderMenuItems()}

          {/* Confirmation Dialog */}
          <Dialog 
            open={openConfirm} 
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
                backdropFilter: 'blur(10px)'
              }
            }}
          >
            <DialogTitle>
              {dialogMessage ? (isOrderSuccess ? "Order Success" : "Order Error") : "Confirm Order"}
            </DialogTitle>
            <DialogContent>
              {dialogMessage ? (
                <Typography color={isOrderSuccess ? "success.main" : "error"}>
                  {dialogMessage}
                </Typography>
              ) : (
                <>
                  <Typography>Are you sure you want to place this order?</Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                      <strong>Order Type:</strong> {orderType === 'inRestaurant' ? 'In Restaurant' : 'Parcel'}
                    </Typography>
                    {orderType === 'parcel' && (
                      <>
                        <Typography variant="subtitle2">
                          <strong>Delivery Location:</strong> {deliveryLocation}
                        </Typography>
                        <Typography variant="subtitle2">
                          <strong>Room No:</strong> {roomNo}
                        </Typography>
                      </>
                    )}
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {dialogMessage ? (
                <Button 
                  onClick={handleCloseDialog} 
                  color={isOrderSuccess ? "success" : "error"}
                  variant="contained"
                  sx={{
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleCloseDialog}
                    sx={{
                      borderRadius: '12px',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[2]
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createNewOrder} 
                    color="primary" 
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: '12px',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      },
                      '&:disabled': {
                        background: theme.palette.grey[300],
                        color: theme.palette.grey[500]
                      }
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Confirm Order"}
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
    <SignInFooter/>
    </>
  );
};

export default MenuDetails;