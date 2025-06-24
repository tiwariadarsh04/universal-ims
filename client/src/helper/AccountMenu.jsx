import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { signOutUser } from '../services/Auth';
import { useNavigate } from 'react-router-dom';
import { UserProfileContext } from '../context/userProvider';

const LiveClock = () => {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date) => {
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    const day = date.toLocaleDateString('en-US', {
      weekday: 'short',
    });

    const month = date.toLocaleDateString('en-US', {
      month: 'short',
    });

    const dateNumber = date.getDate();

    return `${day} ${month} ${dateNumber} ${time}`;
  };

  return (
    <Typography id="AppBar">
      {formatDateTime(currentDateTime)}
    </Typography>
  );
};

const AccountMenu = React.memo(() => {

  const { userProfile } = React.useContext(UserProfileContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user,setUser] = React.useState();
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = React.useCallback(async () => {
    try {

      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : null;

      if(!user) return alert("Something went wrong!");

      const res = await signOutUser(user.token);
      localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('cart');
      sessionStorage.removeItem('invoiceDate');
      navigate('/auth/sign-in', { replace: true });

      if (res.message === 'Logout successful') {
        navigate('/auth/sign-in', { replace: true });
      } else {
        console.error('Logout failed:', res.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
    }
  }, []);

  React.useEffect(() => {
      let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      setUser(user);
    }, []);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', gap: '1em' }}>
        <LiveClock />
        <Tooltip title="Profile">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <img
                style={{
                  width: '35px',
                }}
                src="https://avatars.githubusercontent.com/u/56580229?v=4"
                alt="avatar"
              />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            gap: '0.5em',
          }}
          onClick={handleClose}
        >
          <img
            style={{
              width: '28px',
              borderRadius: '50%',
            }}
            src="https://avatars.githubusercontent.com/u/56580229?v=4"
            alt="avatar"
          />
          <Typography variant="body2">{userProfile?.Name || user?.username || "Unknow User" }</Typography>
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigate('/my-profile')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">My Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate('/setting')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
});

export default AccountMenu;