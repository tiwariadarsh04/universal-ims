import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import RestoreIcon from '@mui/icons-material/Restore';
import { UserProfileContext } from '../../context/userProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../context/ThemeProvider';
import LOGO from '../../assets/logo.png';

// Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

// Custom Components
import usePageTitle from '../../hooks/PageTitle';
import CustomLink from '../../helper/CustomLink';
import CustomTypography from '../../helper/CustomTypography';
import AccountMenu from '../../helper/AccountMenu';
import { Analytics, Dashboard, ManageAccounts, StoreMallDirectoryRounded } from '@mui/icons-material';

const DRAWER_WIDTH = 250;

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backdropFilter: theme.palette.mode === 'dark' || theme.name === 'Glassmorphism' ? 'blur(10px)' : 'none',
  backgroundColor: theme.palette.mode === 'dark' || theme.name === 'Glassmorphism' 
    ? alpha(theme.palette.background.paper, 0.8) 
    : theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px 0 rgba(0,0,0,0.4)' : theme.shadows[3],
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const DraggableItem = styled('div')(({ theme, isDragging, isActive }) => ({
  backgroundColor: isDragging 
    ? theme.palette.action.hover 
    : isActive 
      ? alpha(theme.palette.primary.main, 0.1)
      : 'transparent',
  borderRadius: 6,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiListItem-root': {
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    '& .MuiListItemIcon-root': {
      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    },
  },
}));

const DroppableList = styled(List)(({ theme }) => ({
  minHeight: '200px',
  transition: 'background-color 0.2s ease',
  padding: 0,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    border: '2px dashed transparent',
    borderRadius: 6,
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  minWidth: 'auto',
  borderRadius: 6,
  '& .MuiButton-startIcon': {
    margin: 0,
  },
}));

const MENU_ITEMS = [
  {
    id: 'dashboard',
    path: '/',
    icon: <Dashboard />,
    name: "Dashboard",
    ariaLabel: "Navigate to Dashboard"
  },
  {
    id: 'invoice-billing',
    path: '/invoice-billing',
    icon: <ReceiptIcon />,
    name: "Invoice Billing",
    ariaLabel: "Navigate to Invoice Billing"
  },
  {
    id: 'transactions',
    path: '/all-transaction',
    icon: <PaymentIcon />,
    name: "Transactions",
    ariaLabel: "Navigate to Transactions"
  },
  {
    id: 'party-management',
    path: '/party-management',
    icon: <StoreMallDirectoryRounded />,
    name: "Party Management",
    ariaLabel: "Navigate to Party Management"
  },
  {
    id: 'inventory',
    path: '/Inventory',
    icon: <InventoryIcon />,
    name: "Inventory",
    ariaLabel: "Navigate to Inventory"
  },
  {
    id: 'analytics',
    path: '/report/advance-analytics',
    icon: <Analytics />,
    name: "Analytics",
    ariaLabel: "Navigate to Analytics"
  },
  {
    id: 'Management',
    path: '/application-management',
    icon: <ManageAccounts />,
    name: "Management",
    ariaLabel: "Navigate to Management"
  },
  // {
  //   id: 'settings',
  //   path: '/setting',
  //   icon: <SettingsIcon />,
  //   name: "Setting",
  //   ariaLabel: "Navigate to Settings"
  // }
];

const TopBar = ({ pageTitle, showMenuButton = true, onMenuClick }) => {
  const { currentTheme } = useCustomTheme();
  const [companyLogo, setCompanyLogo] = React.useState('');


  React.useEffect(() => {
    const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
    if (localLogo) {
      setCompanyLogo(localLogo);
    } 
  },[])

  
  return (
    <AppBar
      position="fixed"
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {showMenuButton && (
            <IconButton
              color="inherit"
              aria-label="toggle menu"
              onClick={onMenuClick}
              edge="start"
              sx={{ marginRight: 5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <img 
            src={companyLogo.logoUrl || LOGO} 
            width={40} 
            style={{ marginRight: '0.8em' }} 
            alt="Company Logo" 
            className={currentTheme === "Noa" ? "animate-logo" : ""}
          />
          <CustomTypography>
            {pageTitle}
          </CustomTypography>
        </div>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  showMenuButton: PropTypes.bool,
  onMenuClick: PropTypes.func
};

const MobileTopNavigation = ({ pageTitle }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar 
        pageTitle={pageTitle} 
        showMenuButton={false} 
      />
    </Box>
  );
};

MobileTopNavigation.propTypes = {
  pageTitle: PropTypes.string.isRequired
};

export default function SideMenu() {
  const pageTitle = usePageTitle();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const { userProfile } = React.useContext(UserProfileContext);
  const theme = useTheme();
  const { isDarkMode, currentTheme } = useCustomTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [menuItems, setMenuItems] = React.useState(MENU_ITEMS);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    // Load saved menu order from localStorage
    const savedOrder = localStorage.getItem('menuOrder');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        // Reorder menu items based on saved order
        const orderedItems = parsedOrder.map(id => 
          MENU_ITEMS.find(item => item.id === id)
        ).filter(Boolean);
        setMenuItems(orderedItems);
      } catch (error) {
        console.error('Error loading menu order:', error);
      }
    }
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const resetMenuOrder = () => {
    setMenuItems(MENU_ITEMS);
    localStorage.removeItem('menuOrder');
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMenuItems(items);
    
    // Save new order to localStorage
    const order = items.map(item => item.id);
    localStorage.setItem('menuOrder', JSON.stringify(order));
  };

  const isActiveLink = (path) => {
    // Handle root path specially
    if (path === '/' && location.pathname === '/') return true;
    // For other paths, check if current path starts with the menu path
    return location.pathname.startsWith(path) && path !== '/';
  };

  // Show mobile view for non-desktop screens or for user/viewer roles
  if (!isDesktop || ['user', 'viewer'].includes(userProfile?.Role)) {
    return <MobileTopNavigation pageTitle={pageTitle} />;
  }

  // Show desktop view for desktop screens and non-user/viewer roles
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar 
        pageTitle={pageTitle} 
        showMenuButton={true} 
        onMenuClick={handleDrawerToggle}
      />
      <StyledDrawer variant="permanent" open={open}>
        <DrawerContent>
          <DrawerHeader>
            <IconButton 
              onClick={handleDrawerToggle}
              aria-label={open ? "close menu" : "open menu"}
              sx={{ 
                color: 'inherit',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable droppableId="menu-items" direction="vertical">
              {(provided, snapshot) => (
                <DroppableList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    backgroundColor: isDragging ? alpha(theme.palette.action.hover, 0.5) : 'transparent',
                    '&::after': {
                      borderColor: snapshot.isDraggingOver ? theme.palette.primary.main : 'transparent',
                    },
                  }}
                >
                  {menuItems.map((item, index) => {
                    const isActive = isActiveLink(item.path);
                    return (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <DraggableItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            isActive={isActive}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging
                                ? `${provided.draggableProps.style.transform} scale(1.02)`
                                : provided.draggableProps.style.transform,
                            }}
                          >
                            <CustomLink
                              title={item.name}
                              to={item.path}
                              icon={item.icon}
                              name={item.name}
                              ariaLabel={item.ariaLabel}
                              isActive={isActive}
                            />
                          </DraggableItem>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </DroppableList>
              )}
            </Droppable>
          </DragDropContext>
          <Box sx={{ mt: 'auto' }}>
            <Divider />
            {open && (
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                <Tooltip title="Reset menu order">
                  <ResetButton
                    variant="outlined"
                    size="small"
                    startIcon={<RestoreIcon />}
                    onClick={resetMenuOrder}
                    aria-label="Reset menu order"
                  />
                </Tooltip>
              </Box>
            )}
          </Box>
        </DrawerContent>
      </StyledDrawer>
    </Box>
  );
}