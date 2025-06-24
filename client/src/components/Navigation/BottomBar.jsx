import * as React from 'react';
import PropTypes from 'prop-types';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate, useLocation } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import { UserProfileContext } from '../../context/userProvider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import { Dashboard, Home, ManageAccounts } from '@mui/icons-material';

const navigationStyles = {
  container: {
    position: 'fixed',
    zIndex: 999999999,
    bottom: 0,
    width: '100%',
    height: '4em',
    background: 'white'
  },
  navigation: {
    width: '100%',
    boxShadow: '-2px -2px 5px rgba(0,0,0,0.3)',
    height: '4em',
  }
};

const getActiveTab = (path, userProfile) => {
  switch (path) {
    case '/':
      return 'dashboard';
    case '/invoice-billing':
      return 'InvoiceBilling';
    case '/Inventory':
      return 'inventory';
    case '/all-transaction':
      return 'transactions';
    case '/application-management':
      return 'application-management';
    case '/welcome':
      return 'home';
    case `/user-transactions/${userProfile?._id}`:
      return 'invoice';
    case '/menu-details':
      return 'Menu';
    case '/my-profile':
      return 'profile';
    default:
      return '';
  }
};

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isLoading } = React.useContext(UserProfileContext);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(getActiveTab(location.pathname, userProfile));
  }, [location.pathname, userProfile]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) {
    return null;
  }

  if (['user', 'viewer'].includes(userProfile?.Role)) {
    return <MobileBottomNavigation />;
  }

  return (
    <Box id="mobile_navigation" sx={navigationStyles.container}>
      <BottomNavigation
        sx={navigationStyles.navigation}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Dashboard"
          value="dashboard"
          icon={<Dashboard />}
          onClick={() => navigate('/')}
        />
        <BottomNavigationAction
          label="InvoiceBilling"
          value="InvoiceBilling"
          icon={<ReceiptIcon />}
          onClick={() => navigate('/invoice-billing')}
        />
        <BottomNavigationAction
          label="Transactions"
          value="transactions"
          icon={<PaymentIcon />}
          onClick={() => navigate('/all-transaction')}
        />
        <BottomNavigationAction
          label="Inventory"
          value="inventory"
          icon={<InventoryIcon />}
          onClick={() => navigate('/Inventory')}
        />
        <BottomNavigationAction
          label="Management"
          value="application-management"
          icon={<ManageAccounts />}
          onClick={() => navigate('/application-management')}
        />
      </BottomNavigation>
    </Box>
  );
}

const MobileBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, isLoading } = React.useContext(UserProfileContext);
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(getActiveTab(location.pathname, userProfile));
  }, [location.pathname, userProfile]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNavigation = async () => {
    try {
      const userId = userProfile?._id;
      if (!userId) {
        window.location.reload();
        return;
      }
      navigate(`/user-transactions/${userId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box id="mobile_navigation" sx={navigationStyles.container}>
      <BottomNavigation
        sx={navigationStyles.navigation}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<Home />}
          onClick={() => navigate('/welcome')}
        />
        <BottomNavigationAction
          label="Invoice"
          value="invoice"
          icon={<ReceiptIcon />}
          onClick={handleNavigation}
        />
        <BottomNavigationAction
          label="Menu"
          value="Menu"
          icon={<ShoppingCartIcon />}
          onClick={() => navigate('/menu-details')}
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<AccountCircleIcon />}
          onClick={() => navigate('/my-profile')}
        />
      </BottomNavigation>
    </Box>
  );
};

BottomBar.propTypes = {
  userProfile: PropTypes.shape({
    Role: PropTypes.string,
    _id: PropTypes.string
  })
};

MobileBottomNavigation.propTypes = {
  userProfile: PropTypes.shape({
    _id: PropTypes.string
  })
};