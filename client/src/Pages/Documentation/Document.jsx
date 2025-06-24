import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Chip,
  Avatar,
  useTheme,
  Divider,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  alpha,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  Search,
  VideoLibrary,
  Code,
  Article,
  Category,
  CheckCircle,
  KeyboardArrowRight,
  Dashboard,
  Event,
  Group,
  Inventory,
  MonetizationOn,
  Settings,
  History,
  TouchApp,
  NoteAdd,
  Edit,
  Delete,
  FilterList,
  Person,
  NavigateNext,
  MenuBook,
  Receipt,
  Analytics,
  AdminPanelSettings,
  CalendarMonth,
  Email,
  Refresh
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Custom styled components using motion
const AnimatedCard = motion(Card);
const AnimatedBox = motion(Box);

const DocumentationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openSection, setOpenSection] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const categories = [
    { id: 'all', name: 'All Features', icon: <Category /> },
    { id: 'dashboard', name: 'Dashboard', icon: <Dashboard /> },
    { id: 'member', name: 'Member Management', icon: <Group /> },
    { id: 'event', name: 'Event Management', icon: <Event /> },
    { id: 'inventory', name: 'Inventory', icon: <Inventory /> },
    { id: 'payments', name: 'Payments & Transactions', icon: <MonetizationOn /> },
    { id: 'accounting', name: 'Accounting', icon: <Receipt /> },
    { id: 'activity', name: 'Activity Logs', icon: <History /> },
    { id: 'admin', name: 'User Administration', icon: <AdminPanelSettings /> },
    { id: 'analytics', name: 'Analytics', icon: <Analytics /> },
  ];

  const documentationData = [
    // Dashboard Documentation
    {
      id: 'dashboard-overview',
      question: 'Dashboard Overview',
      answer: 'The dashboard provides a centralized view of key club metrics and recent activities. It displays real-time order updates, sales statistics, and membership information in one convenient location.',
      category: 'dashboard',
      tags: ['overview', 'basics']
    },
    {
      id: 'dashboard-orders',
      question: 'How to manage orders from the dashboard?',
      answer: `
        The dashboard shows all pending orders in real-time with automatic updates.
        
        1. **Viewing Orders**: All pending orders appear in the main dashboard under the "Recent Orders" section
        2. **Accepting/Rejecting**: Use the action buttons on each order card to accept or reject
        3. **Filtering**: Use the search and filter options to find specific orders
        4. **Detailed View**: Click on an order to see complete details including items ordered and customer information
        
        The dashboard uses real-time connection to provide instant updates without requiring manual refresh.
      `,
      category: 'dashboard',
      tags: ['orders', 'management']
    },
    {
      id: 'dashboard-stats',
      question: 'Understanding Dashboard Statistics',
      answer: `
        The dashboard displays several key statistics:
        
        1. **Sales Overview**: Total sales with daily, weekly, and monthly comparisons
        2. **Order Status**: Current pending, completed and rejected orders
        3. **Popular Items**: Most frequently ordered items in a visual chart
        4. **Member Activity**: Recent member transactions and activity
        
        Statistics are updated in real-time and provide insights into the club's operations.
      `,
      category: 'dashboard',
      tags: ['statistics', 'analytics']
    },
    
    // Member Management
    {
      id: 'member-overview',
      question: 'Member Management Overview',
      answer: 'The Member Management module allows you to add, edit, and manage all club members. Track member information, family details, and transaction history.',
      category: 'member',
      tags: ['overview', 'basics']
    },
    {
      id: 'member-create',
      question: 'How to create a new member?',
      answer: `
        To create a new member:
        
        1. Navigate to the Member Management page
        2. Click the "New Member" button in the top right
        3. Complete the multi-step form with member details:
           - Basic Information (name, contact, email)
           - Membership Type (permanent or visitor)
           - Additional Details (optional)
        4. Submit the form to generate a unique Member ID
        
        The system will automatically validate all information and create a new member profile.
      `,
      category: 'member',
      tags: ['create', 'new member']
    },
    {
      id: 'member-edit',
      question: 'How to edit member information?',
      answer: `
        To edit a member's profile:
        
        1. Find the member using the search or filter functions
        2. Click on the member card or select "Edit" from the options menu
        3. Update the necessary information in the form
        4. Save changes
        
        You can modify most member information including contact details and membership status.
      `,
      category: 'member',
      tags: ['edit', 'update']
    },
    {
      id: 'member-family',
      question: 'How to manage family members?',
      answer: `
        To add or manage family members:
        
        1. Navigate to the member's profile
        2. Scroll to the "Family Members" section
        3. Click "Add Family Member"
        4. Enter the family member's details (name and relationship)
        5. Save to add to the member's profile
        
        Family members can be edited or removed at any time from the member profile.
      `,
      category: 'member',
      tags: ['family', 'dependents']
    },
    {
      id: 'member-export',
      question: 'How to export member data?',
      answer: `
        To export member data:
        
        1. Go to the Member Management page
        2. Apply any necessary filters to select specific members
        3. Click the "Export" button in the action bar
        4. The system will generate an Excel file with member information
        
        The exported file includes all member data visible in the current view.
      `,
      category: 'member',
      tags: ['export', 'data']
    },
    
    // Event Management
    {
      id: 'event-overview',
      question: 'Event Management Overview',
      answer: 'The Event Management module helps you create, schedule, and manage club events. Track attendance, set up registration links, and promote events to members.',
      category: 'event',
      tags: ['overview', 'basics']
    },
    {
      id: 'event-create',
      question: 'How to create a new event?',
      answer: `
        To create a new event:
        
        1. Navigate to the Event Management page
        2. Click the "Create Event" button
        3. Complete the multi-step form:
           - Event Details (name, description)
           - Date & Time
           - Location & Links (venue, registration link)
           - Event Poster (upload an image)
        4. Submit the form to publish the event
        
        The event will appear in the club's event calendar and can be promoted to members.
      `,
      category: 'event',
      tags: ['create', 'new event']
    },
    {
      id: 'event-edit',
      question: 'How to edit or cancel an event?',
      answer: `
        To edit an existing event:
        
        1. Find the event in the Event Management list
        2. Click the "Edit" button (pencil icon)
        3. Update the necessary information
        4. Save changes
        
        To cancel an event:
        
        1. Find the event in the list
        2. Click the "Delete" button (trash icon)
        3. Confirm cancellation in the dialog
        
        Canceled events will be removed from the calendar.
      `,
      category: 'event',
      tags: ['edit', 'cancel']
    },
    {
      id: 'event-agenda',
      question: 'How to manage the club agenda?',
      answer: `
        The Agenda feature lets you manage venue bookings and schedule meetings:
        
        1. Navigate to the Agenda Management page
        2. View current bookings in the calendar view
        3. Click "New Booking" to add a new item
        4. Specify date, time, venue, and details
        5. Save to add to the club agenda
        
        The agenda helps prevent scheduling conflicts and provides a clear view of upcoming activities.
      `,
      category: 'event',
      tags: ['agenda', 'booking']
    },
    
    // Inventory Management
    {
      id: 'inventory-overview',
      question: 'Inventory Management Overview',
      answer: 'The Inventory Management system helps track stock levels, item costs, and usage statistics. Manage bar, kitchen, and general inventory items.',
      category: 'inventory',
      tags: ['overview', 'basics']
    },
    {
      id: 'inventory-add',
      question: 'How to add new inventory items?',
      answer: `
        To add a single inventory item:
        
        1. Navigate to Inventory Management
        2. Click "Add Item" button
        3. Fill in the item details:
           - Item Code (unique identifier)
           - Item Name
           - Category (Kitchen, Bar, etc.)
           - Cost Price and Selling Price
           - GST Percentage
           - Initial Quantity
        4. Save the new item
        
        For bulk uploads:
        
        1. Click "Bulk Upload" instead
        2. Download the template
        3. Fill in multiple items
        4. Upload the completed Excel file
      `,
      category: 'inventory',
      tags: ['add item', 'create']
    },
    {
      id: 'inventory-menu',
      question: 'How to manage the menu system?',
      answer: `
        The menu system connects to your inventory:
        
        1. Go to the Menu Management section
        2. Browse items by category (Bar, Kitchen, etc.)
        3. Add items to the menu with appropriate pricing
        4. Set item availability status
        
        The menu syncs with inventory, so when items are out of stock, they'll be marked accordingly.
      `,
      category: 'inventory',
      tags: ['menu', 'ordering']
    },
    {
      id: 'inventory-stock',
      question: 'How to update stock levels?',
      answer: `
        To update inventory stock levels:
        
        1. Go to the Inventory Management page
        2. Find the item using search or filters
        3. Click the "Edit" button
        4. Update the quantity
        5. Save changes
        
        The system automatically tracks stock levels as orders are processed.
      `,
      category: 'inventory',
      tags: ['stock', 'update']
    },
    
    // Payments & Transactions
    {
      id: 'payment-overview',
      question: 'Payments & Transactions Overview',
      answer: 'The Payments module handles all financial transactions, including member billing, payments processing, and transaction history.',
      category: 'payments',
      tags: ['overview', 'basics']
    },
    {
      id: 'payment-create',
      question: 'How to create a new transaction?',
      answer: `
        To create a new transaction:
        
        1. Go to the Payments & Transactions page
        2. Click "New Transaction" button
        3. Select a member from the dropdown
        4. Add items to the transaction
        5. Apply any discounts if applicable
        6. Choose payment method
        7. Complete the transaction
        
        The system will generate an invoice and update inventory automatically.
      `,
      category: 'payments',
      tags: ['create', 'invoice']
    },
    {
      id: 'payment-history',
      question: 'How to view transaction history?',
      answer: `
        To view transaction history:
        
        1. Navigate to the Payments & Transactions page
        2. Use filters to narrow down by:
           - Date range
           - Member
           - Transaction type
        3. Click on any transaction to view details
        4. Download invoices or receipt copies if needed
        
        Transaction history shows complete details including items purchased, payment method, and GST breakdown.
      `,
      category: 'payments',
      tags: ['history', 'reports']
    },
    {
      id: 'payment-edit',
      question: 'How to edit or delete transactions?',
      answer: `
        To edit a transaction:
        
        1. Find the transaction in the list
        2. Click the "Edit" button
        3. Make necessary changes
        4. Save updates
        
        To delete a transaction:
        
        1. Find the transaction
        2. Click "Delete"
        3. Confirm in the dialog
        
        Note: Deleted transactions are logged in the Activity Log for auditing purposes.
      `,
      category: 'payments',
      tags: ['edit', 'delete']
    },
    
    // Activity Logs
    {
      id: 'activity-overview',
      question: 'Activity Log Overview',
      answer: 'The Activity Log tracks all system actions for auditing and monitoring purposes. View user activities, changes to data, and system events.',
      category: 'activity',
      tags: ['overview', 'basics']
    },
    {
      id: 'activity-tracking',
      question: 'How to track changes in the Activity Log?',
      answer: `
        The Activity Log shows all system changes:
        
        1. Navigate to the Activity Log page
        2. View activities in either Timeline or List view
        3. Filter by:
           - Action type (create, update, delete)
           - Date range
           - User
        4. Click on any activity to see detailed changes
        
        The Activity Log maintains a complete audit trail of all system activities.
      `,
      category: 'activity',
      tags: ['audit', 'tracking']
    },
    
    // User Administration
    {
      id: 'admin-overview',
      question: 'User Administration Overview',
      answer: 'The User Administration module manages system users, their roles, and permissions. Create and manage staff accounts with appropriate access levels.',
      category: 'admin',
      tags: ['overview', 'basics']
    },
    {
      id: 'admin-create',
      question: 'How to create a new system user?',
      answer: `
        To create a new system user:
        
        1. Navigate to the User Administration page
        2. Click "New User" button
        3. Enter user details:
           - Username
           - Name
           - Email
           - Password
           - Role (Superadmin, Admin, Editor, Cashier)
        4. Set permissions based on role
        5. Save to create the user
        
        Different roles have different permission levels in the system.
      `,
      category: 'admin',
      tags: ['create', 'user']
    },
    {
      id: 'admin-roles',
      question: 'Understanding user roles and permissions',
      answer: `
        The system has several predefined roles:
        
        1. **Superadmin**: Complete access to all features
        2. **Admin**: Access to most features except critical settings
        3. **Editor**: Can edit content but cannot delete or access sensitive areas
        4. **Cashier**: Limited to transaction processing
        
        Each role has specific permissions that determine what actions they can perform.
      `,
      category: 'admin',
      tags: ['roles', 'permissions']
    },
    
    // Analytics
    {
      id: 'analytics-overview',
      question: 'Analytics Overview',
      answer: 'The Analytics module provides data visualization and reporting tools to help understand club performance, member behavior, and financial metrics.',
      category: 'analytics',
      tags: ['overview', 'basics']
    },
    {
      id: 'analytics-reports',
      question: 'How to generate and use reports?',
      answer: `
        To generate analytics reports:
        
        1. Navigate to the Analytics Dashboard
        2. Select the report type:
           - Member Consumption
           - Item Analytics
           - Trend Analysis
           - Inventory Insights
        3. Apply filters for date range and other parameters
        4. View visual charts and data tables
        5. Export reports to Excel if needed
        
        Reports provide actionable insights for business decisions.
      `,
      category: 'analytics',
      tags: ['reports', 'data']
    }
  ];

  const filteredDocs = documentationData.filter(doc => {
    const matchesSearch = doc.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 8 }}>
      {/* Hero Section */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          textAlign: 'center',
          mb: 6,
          background: theme.palette.mode === 'dark' ? 
            `linear-gradient(145deg, ${alpha(theme.palette.primary.dark, 0.6)}, ${alpha(theme.palette.background.paper, 0.9)})` : 
            `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.background.paper, 0.9)})`,
          p: 6,
          borderRadius: 4,
          boxShadow: theme.shadows[4]
        }}
      >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              background: theme.palette.mode === 'dark' ?
                'linear-gradient(45deg, #6a5acd, #9370db)' :
                'linear-gradient(45deg, #6a5acd, #9370db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Documentation Center
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Complete guide to using your club management system
          </Typography>
        
        {/* Search Bar */}
        <Paper 
          component={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            p: 1, 
            pl: 3,
            borderRadius: 50,
            display: 'flex',
            alignItems: 'center',
            boxShadow: 3
          }}
        >
          <Search sx={{ color: 'text.secondary', mr: 1 }} />
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search documentation..."
            InputProps={{ disableUnderline: true }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 1 }}
          />
          <Chip 
            label="Ctrl + K" 
            size="small" 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
            }} 
          />
        </Paper>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Categories Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper 
            component={motion.div}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              position: 'sticky', 
              top: 20,
              background: theme.palette.mode === 'dark' ? 
                alpha(theme.palette.background.paper, 0.8) : 
                alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Features & Categories</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  icon={cat.icon}
                  label={cat.name}
                  onClick={() => setActiveCategory(cat.id)}
                  variant={activeCategory === cat.id ? 'filled' : 'outlined'}
                  color={activeCategory === cat.id ? 'primary' : 'default'}
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 1.5,
                    fontWeight: activeCategory === cat.id ? 600 : 400,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Can't find what you're looking for?<br />
              <Button 
                variant="text" 
                size="small" 
                href="mailto:support@konectile.com"
                sx={{ mt: 1, textTransform: 'none' }}
                startIcon={<Email />}
              >
                Contact our support team
              </Button>
            </Typography>
          </Paper>
        </Grid>

        {/* Documentation Content */}
        <Grid item xs={12} md={9}>
          {filteredDocs.length > 0 ? (
            <AnimatedBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              {filteredDocs.map((item) => (
                <AnimatedCard
                  key={item.id}
                  variants={itemVariants}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[2],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                      transform: 'translateY(-3px)'
                    },
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}
                >
                  <Accordion
                    expanded={expanded === item.id}
                    onChange={handleChange(item.id)}
                    elevation={0}
                    disableGutters
                    sx={{
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        bgcolor: expanded === item.id ? 
                          alpha(theme.palette.primary.main, 0.05) : 
                          'transparent',
                        transition: 'background 0.2s',
                        borderRadius: 3,
                        px: 3,
                        py: 1.5
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main
                        }}>
                          {item.category === 'dashboard' && <Dashboard />}
                          {item.category === 'member' && <Group />}
                          {item.category === 'event' && <Event />}
                          {item.category === 'inventory' && <Inventory />}
                          {item.category === 'payments' && <MonetizationOn />}
                          {item.category === 'activity' && <History />}
                          {item.category === 'admin' && <AdminPanelSettings />}
                          {item.category === 'analytics' && <Analytics />}
                        </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.question}
                      </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 1, px: 4, pb: 3 }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            whiteSpace: 'pre-line',  
                            mb: 3,
                            lineHeight: 1.7
                          }}
                        >
                          {item.answer}
                        </Typography>
                        
                        {item.category === 'dashboard' && item.id === 'dashboard-overview' && (
                          <Box sx={{ mt: 3, mb: 4, p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="success.main" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TouchApp /> Quick Tip
                            </Typography>
                            <Typography variant="body2">
                              You can customize your dashboard view by clicking the settings icon in the top-right corner. This allows you to rearrange widgets and show/hide different statistics.
                            </Typography>
                          </Box>
                        )}
                        
                        {item.videoLink && (
                          <Box 
                            sx={{ 
                              mt: 3,
                              p: 2,
                              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2
                            }}
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <VideoLibrary />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">Video Tutorial</Typography>
                              <Typography 
                                component="a" 
                                href={item.videoLink} 
                                target="_blank" 
                                rel="noopener"
                                sx={{ 
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
                                Watch now
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {item.tags.map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            variant="outlined" 
                            onClick={() => setSearchTerm(tag)}
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </AnimatedCard>
              ))}
            </AnimatedBox>
          ) : (
            <AnimatedCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                No results found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Try different search terms or browse the categories
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                startIcon={<Refresh />}
              >
                Reset Filters
              </Button>
            </AnimatedCard>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DocumentationPage;