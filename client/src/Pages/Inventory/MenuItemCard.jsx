import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  CardContent,
  CircularProgress,
  styled,
  Card
} from '@mui/material';
import { AddShoppingCart, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

// Modern styled components
const MenuCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  '&:hover': {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6]
  }
}));


const MenuItemCard = ({ item, cartItems, handleAddToCart, handleIncrement, handleDecrement }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loadingImage, setLoadingImage] = useState(true);
  const quantity = cartItems.find(cartItem => cartItem.ItemCode === item.ItemCode)?.quantity || 0;

  useEffect(() => {
    const fetchFoodImage = async () => {
      try {
        setLoadingImage(true);
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(item.ItemName)}&client_id=GJkoF74OyeZqXkMYgXhNEgfpk_whlcp5FsMASNvNtdA&per_page=1`
        );
        const data = await response.json();
        if (data.results?.length > 0) {
          setImageUrl(data.results[0].urls.small);
        } else {
          // Fallback to category-based image if specific item not found
          const categoryResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(item.ItemSubGroup)}-food&client_id=GJkoF74OyeZqXkMYgXhNEgfpk_whlcp5FsMASNvNtdA&per_page=1`
          );
          const categoryData = await categoryResponse.json();
          setImageUrl(categoryData.results[0]?.urls.small || '/food-placeholder.jpg');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl('/food-placeholder.jpg');
      } finally {
        setLoadingImage(false);
      }
    };

    fetchFoodImage();
  }, [item.ItemName, item.ItemSubGroup]);

  return (
    <MenuCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        height: 120,
        bgcolor: 'grey.100',
        backgroundImage: `url(${imageUrl || '/food-placeholder.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {loadingImage && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.7)'
          }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          {item.ItemName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ 
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: 12,
          display: 'inline-block',
          mb: 1
        }}>
          {item.ItemSubGroup}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ₹{item.IssueRate.toFixed(2)}
          </Typography>
          
          {quantity === 0 ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleAddToCart(item)}
              startIcon={<AddShoppingCart />}
              sx={{ borderRadius: 2 }}
            >
              Add
            </Button>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'primary.light',
              borderRadius: 2,
              p: 0.5
            }}>
              <IconButton
                color="primary"
                onClick={() => handleDecrement(item.ItemCode)}
                size="small"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography variant="body1" sx={{ 
                fontWeight: 600,
                px: 1
              }}>
                {quantity}
              </Typography>
              <IconButton
                color="primary"
                onClick={() => handleIncrement(item.ItemCode)}
                size="small"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </MenuCard>
  );
};

export default MenuItemCard;