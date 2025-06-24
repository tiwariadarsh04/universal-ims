import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Divider, 
  TextField, 
  MenuItem, 
  Tooltip, 
  IconButton,
  alpha,
  useTheme,
  Card,
  CardContent,
  Tabs,
  Tab,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  List,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Collapse,
  useMediaQuery,
  Drawer,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop
} from '@mui/material';
import { 
  DragIndicator, 
  Add, 
  BarChart, 
  TableChart, 
  PieChart, 
  ShowChart, 
  Delete, 
  Save, 
  FileDownload, 
  Visibility,
  FormatListBulleted, 
  Edit, 
  PlaylistAdd, 
  MoreVert, 
  SwapVert,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatSize,
  DragHandle,
  Tune,
  Settings,
  ArrowDropDown,
  ArrowDropUp,
  Check,
  SettingsBackupRestore,
  CloudDownload,
  Close,
  Menu as MenuIcon,
  FilterAlt,
  LibraryAdd,
  Dashboard,
  FileUpload,
  DataArray,
  InsertDriveFile,
  Visibility as VisibilityIcon,
  VisibilityOff,
  ArrowBack,
  ArrowBackIos
} from '@mui/icons-material';
import { ThemeContext } from '../../context/ThemeProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Simple ID generator to replace uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Sample data structure
const SAMPLE_DATA = {
  members: [
    { id: 1, name: 'John Smith', email: 'john@example.com', joinDate: '2023-01-15', status: 'active', memberType: 'permanent', transactions: 24, totalSpent: 45600 },
    { id: 2, name: 'Emma Johnson', email: 'emma@example.com', joinDate: '2023-02-20', status: 'active', memberType: 'permanent', transactions: 18, totalSpent: 32400 },
    { id: 3, name: 'Michael Davis', email: 'michael@example.com', joinDate: '2023-03-10', status: 'inactive', memberType: 'temporary', transactions: 5, totalSpent: 8500 },
    // ...more data would be here
  ],
  transactions: [
    { id: 101, memberId: 1, date: '2023-05-15', amount: 1500, type: 'food', status: 'completed' },
    { id: 102, memberId: 1, date: '2023-05-20', amount: 2500, type: 'drinks', status: 'completed' },
    { id: 103, memberId: 2, date: '2023-05-22', amount: 1800, type: 'food', status: 'completed' },
    // ...more data would be here
  ],
  events: [
    { id: 201, name: 'Summer Party', date: '2023-06-15', participants: 45, revenue: 67500 },
    { id: 202, name: 'Golf Tournament', date: '2023-07-10', participants: 32, revenue: 96000 },
    // ...more data would be here
  ],
  inventory: [
    { id: 301, name: 'Beer', category: 'Drinks', stock: 150, price: 200 },
    { id: 302, name: 'Wine', category: 'Drinks', stock: 75, price: 450 },
    { id: 303, name: 'Chicken Wings', category: 'Food', stock: 100, price: 350 },
    // ...more data would be here
  ]
};

// Available data fields by category
const DATA_FIELDS = {
  members: [
    { id: 'name', label: 'Member Name', type: 'string' },
    { id: 'email', label: 'Email', type: 'string' },
    { id: 'joinDate', label: 'Join Date', type: 'date' },
    { id: 'status', label: 'Status', type: 'string' },
    { id: 'memberType', label: 'Member Type', type: 'string' },
    { id: 'transactions', label: 'Transaction Count', type: 'number' },
    { id: 'totalSpent', label: 'Total Spent', type: 'currency' },
  ],
  transactions: [
    { id: 'memberId', label: 'Member ID', type: 'number' },
    { id: 'date', label: 'Transaction Date', type: 'date' },
    { id: 'amount', label: 'Amount', type: 'currency' },
    { id: 'type', label: 'Transaction Type', type: 'string' },
    { id: 'status', label: 'Status', type: 'string' },
  ],
  events: [
    { id: 'name', label: 'Event Name', type: 'string' },
    { id: 'date', label: 'Event Date', type: 'date' },
    { id: 'participants', label: 'Participants', type: 'number' },
    { id: 'revenue', label: 'Revenue', type: 'currency' },
  ],
  inventory: [
    { id: 'name', label: 'Item Name', type: 'string' },
    { id: 'category', label: 'Category', type: 'string' },
    { id: 'stock', label: 'Stock', type: 'number' },
    { id: 'price', label: 'Price', type: 'currency' },
  ],
};

// Chart component types
const COMPONENT_TYPES = [
  { id: 'table', label: 'Table', icon: <TableChart /> },
  { id: 'bar', label: 'Bar Chart', icon: <BarChart /> },
  { id: 'pie', label: 'Pie Chart', icon: <PieChart /> },
  { id: 'line', label: 'Line Chart', icon: <ShowChart /> },
  { id: 'summary', label: 'Summary Card', icon: <FormatListBulleted /> },
];


const ReportComponent = styled(Paper)(({ theme, isSelected }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.main}` : theme.shadows[2],
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.main}` : theme.shadows[4],
  },
}));

const ToolboxItem = styled(Paper)(({ theme, isDragging }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: 8,
  boxShadow: theme.shadows[1],
  background: isDragging 
    ? alpha(theme.palette.primary.main, 0.1)
    : theme.palette.background.paper,
  cursor: 'grab',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
  transition: 'all 0.2s ease',
}));

// Enhanced visualization components
const DataVisualizer = ({ component, visualizationMode }) => {
  const theme = useTheme();
  
  if (!visualizationMode || !component.sourceData) {
    return null;
  }
  
  const data = component.sourceData;
  const showAllData = component.settings?.showAllData || false;
  const displayData = showAllData ? data : data.slice(0, 5);
  
  // Table visualization
  if (component.type === 'table') {
    const fields = component.fields.filter(f => f.visible !== false);
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: component.settings?.height - 40 || 260,
            boxShadow: 'none',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.7),
            flex: 1
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell key={field.id}>
                    <Typography variant="body2" fontWeight="bold">
                      {field.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {displayData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {fields.map((field) => (
                    <TableCell key={field.id}>
                      {String(row[field.id] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {!showAllData && data.length > 5 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 1,
            px: 1
          }}>
            <Typography variant="caption" color="text.secondary">
              Showing 5 of {data.length} rows
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  
  // Bar chart visualization
  if (component.type === 'bar') {
    const categoryField = component.fields.find(f => f.role === 'category');
    const valueField = component.fields.find(f => f.role === 'value');
    
    if (!categoryField || !valueField || data.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: component.settings?.height || 300,
          background: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Configure chart data fields
          </Typography>
        </Box>
      );
    }
    
    // Get data for chart (limited by displayCount or show all)
    const displayCount = component.settings?.displayCount || 5;
    const chartData = showAllData ? data : data.slice(0, displayCount);
    const maxValue = Math.max(...chartData.map(item => Number(item[valueField.id]) || 0));
    
    return (
      <Box sx={{ 
        height: component.settings?.height || 300,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        background: alpha(theme.palette.background.paper, 0.7),
        borderRadius: 1,
      }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          {chartData.map((item, index) => {
            const value = Number(item[valueField.id]) || 0;
            const heightPercent = (value / maxValue) * 100;
            
            return (
              <Box 
                key={index} 
                sx={{ 
                  flex: 1,
                  height: `${heightPercent}%`,
                  minHeight: 10,
                  background: `linear-gradient(to top, ${component.settings.colors[index % component.settings.colors.length]}, ${alpha(component.settings.colors[index % component.settings.colors.length], 0.7)})`,
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  '&:hover': {
                    opacity: 0.9,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease',
                  },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  pt: 0.5,
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    fontSize: '0.7rem'
                  }}
                >
                  {value}
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          {chartData.map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                flex: 1, 
                textAlign: 'center', 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.75rem'
              }}
            >
              <Typography variant="caption">
                {String(item[categoryField.id]).substring(0, 10)}
                {String(item[categoryField.id]).length > 10 ? '...' : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  
  // Pie chart visualization
  if (component.type === 'pie') {
    const categoryField = component.fields.find(f => f.role === 'category');
    const valueField = component.fields.find(f => f.role === 'value');
    
    if (!categoryField || !valueField || data.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: component.settings?.height || 300,
          background: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Configure chart data fields
          </Typography>
        </Box>
      );
    }
    
    // Get data for chart (showing all if showAllData is true, otherwise limited)
    const displayCount = component.settings?.displayCount || 8;
    const chartData = showAllData ? data : data.slice(0, displayCount);
    
    // Calculate totals and group small values
    const total = chartData.reduce((sum, item) => sum + (Number(item[valueField.id]) || 0), 0);
    
    // Sort by value (descending)
    chartData.sort((a, b) => (Number(b[valueField.id]) || 0) - (Number(a[valueField.id]) || 0));
    
    // Process data to handle small slices
    let processedData = [];
    let otherValue = 0;
    const MIN_PERCENTAGE_THRESHOLD = 3; // Items below this percentage go to "Other"
    
    // Process the chart data
    chartData.forEach(item => {
      const value = Number(item[valueField.id]) || 0;
      const percentage = (value / total) * 100;
      
      if (percentage >= MIN_PERCENTAGE_THRESHOLD) {
        processedData.push({
          ...item,
          percentage,
          value
        });
      } else {
        otherValue += value;
      }
    });
    
    // Add "Other" category if needed
    if (otherValue > 0) {
      processedData.push({
        [categoryField.id]: 'Other',
        [valueField.id]: otherValue,
        percentage: (otherValue / total) * 100,
        value: otherValue
      });
    }
    
    // Calculate the starting angle for each slice
    let startAngle = 0;
    processedData = processedData.map(item => {
      const angle = (item.percentage / 100) * 360; // Convert percentage to angle
      const slice = {
        ...item,
        startAngle,
        angle
      };
      startAngle += angle;
      return slice;
    });
    
    return (
      <Box sx={{ 
        height: component.settings?.height || 300,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        background: alpha(theme.palette.background.paper, 0.7),
        borderRadius: 1,
      }}>
        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* SVG for pie chart */}
          <svg
            viewBox="0 0 100 100"
            style={{ 
              width: '100%', 
              height: '100%',
              maxWidth: '250px',
              maxHeight: '250px'
            }}
          >
            <g transform="translate(50,50)">
              {processedData.map((slice, index) => {
                // Calculate the paths for each slice
                const radius = 40;
                const startAngleRad = (slice.startAngle - 90) * Math.PI / 180;
                const endAngleRad = (slice.startAngle + slice.angle - 90) * Math.PI / 180;
                
                const x1 = radius * Math.cos(startAngleRad);
                const y1 = radius * Math.sin(startAngleRad);
                const x2 = radius * Math.cos(endAngleRad);
                const y2 = radius * Math.sin(endAngleRad);
                
                // Flag for angles larger than 180 degrees
                const largeArcFlag = slice.angle > 180 ? 1 : 0;
                
                // Generate the path for the slice
                const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={component.settings.colors[index % component.settings.colors.length]}
                    stroke="white"
                    strokeWidth="1"
                    data-value={slice.value}
                    data-label={slice[categoryField.id]}
                  />
                );
              })}
            </g>
          </svg>
          
          {/* Legend */}
          {component.settings?.showLegend !== false && (
            <Box 
              sx={{ 
                position: 'absolute', 
                right: 0,
                top: 0,
                maxWidth: '40%',
                p: 1,
                borderRadius: 1,
                background: alpha(theme.palette.background.paper, 0.7),
                fontSize: '0.75rem'
              }}
            >
              {processedData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '2px',
                      mr: 1,
                      background: component.settings.colors[index % component.settings.colors.length]
                    }}
                  />
                  <Typography variant="caption" noWrap>
                    {String(item[categoryField.id]).substring(0, 12)}
                    {String(item[categoryField.id]).length > 12 ? '...' : ''}: {item.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
  
  // Line chart visualization
  if (component.type === 'line') {
    const categoryField = component.fields.find(f => f.role === 'category');
    const valueField = component.fields.find(f => f.role === 'value');
    
    if (!categoryField || !valueField || data.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: component.settings?.height || 300,
          background: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Configure chart data fields
          </Typography>
        </Box>
      );
    }
    
    // Get data for chart (showing all if showAllData is true, otherwise limited)
    const displayCount = component.settings?.displayCount || 8;
    const chartData = showAllData ? data : data.slice(0, displayCount);
    
    // Calculate min and max values for the chart
    const values = chartData.map(item => Number(item[valueField.id]) || 0);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    // Calculate points for the line
    const points = chartData.map((item, index) => {
      const value = Number(item[valueField.id]) || 0;
      const x = (index / (chartData.length - 1)) * 100;
      const y = range === 0 ? 50 : 100 - ((value - minValue) / range) * 100;
      
      return { x, y, value };
    });
    
    // Create path for the line
    const linePath = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'}${point.x}% ${point.y}%`
    ).join(' ');
    
    return (
      <Box sx={{ 
        height: component.settings?.height || 300,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        background: alpha(theme.palette.background.paper, 0.7),
        borderRadius: 1,
      }}>
        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}>
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <Box
              key={percent}
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${percent}%`,
                borderTop: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
                zIndex: 1,
              }}
            />
          ))}
          
          {/* Line */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              zIndex: 2,
            }}
          >
            <path
              d={linePath}
              fill="none"
              stroke={component.settings.colors[0]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Points */}
          {points.map((point, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'white',
                border: `2px solid ${component.settings.colors[0]}`,
                zIndex: 3,
              }}
            />
          ))}
        </Box>
        
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
          {chartData.map((item, index) => (
            <Typography key={index} variant="caption" sx={{ flex: 1, textAlign: 'center' }}>
              {String(item[categoryField.id]).substring(0, 10)}
              {String(item[categoryField.id]).length > 10 ? '...' : ''}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  }
  
  // Summary card visualization
  if (component.type === 'summary') {
    const countField = component.fields.find(f => f.role === 'count');
    const aggregateField = component.fields.find(f => f.role === 'sum');
    
    if (!aggregateField || data.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: component.settings?.height || 300,
          background: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Configure summary data fields
          </Typography>
        </Box>
      );
    }
    
    // Calculate aggregate value
    let aggregateValue = 0;
    if (aggregateField.aggregation === 'sum') {
      aggregateValue = data.reduce((sum, item) => sum + (Number(item[aggregateField.id]) || 0), 0);
    } else if (aggregateField.aggregation === 'avg') {
      const sum = data.reduce((sum, item) => sum + (Number(item[aggregateField.id]) || 0), 0);
      aggregateValue = data.length > 0 ? sum / data.length : 0;
    } else if (aggregateField.aggregation === 'max') {
      aggregateValue = Math.max(...data.map(item => Number(item[aggregateField.id]) || 0));
    } else if (aggregateField.aggregation === 'min') {
      aggregateValue = Math.min(...data.map(item => Number(item[aggregateField.id]) || 0));
    }
    
    return (
      <Box sx={{ 
        height: component.settings?.height || 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: alpha(theme.palette.background.paper, 0.7),
        borderRadius: 1,
        p: 3,
      }}>
        <Grid container spacing={2}>
          {countField && (
            <Grid item xs={6}>
              <Card 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(145deg, #FF0099 30%, #FFD700 90%)',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {data.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Total Count
                </Typography>
              </Card>
            </Grid>
          )}
          
          {aggregateField && (
            <Grid item xs={countField ? 6 : 12}>
              <Card 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'linear-gradient(145deg, #FFD700 30%, #FF0099 90%)',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {aggregateField.type === 'currency' 
                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(aggregateValue)
                    : new Intl.NumberFormat('en-US').format(aggregateValue)
                  }
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {`${aggregateField.aggregation || 'Sum'} of ${aggregateField.label}`}
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }
  
  return null;
};

// Sortable Item component (replaces Draggable)
const SortableItem = ({ id, item, index, onSelect, isSelected, onDelete }) => {
  const theme = useTheme();
  
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };
  
  // Function to handle opening field selector
  const handleAddFieldClick = () => {
    // This will call the parent's handleOpenFieldSelector function through the onSelect prop
    onSelect(id, null, true); // Pass true as third parameter to indicate field selector action
  };

  return (
    <ReportComponent
      ref={setNodeRef}
      style={style}
      isSelected={isSelected}
      onClick={() => onSelect(id)}
      sx={{ 
        mb: 2,
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
        outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
        outlineOffset: 2,
      }}
    >
      {/* Component header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
            <DragIndicator />
          </Box>
          
          {item.settings?.showTitle !== false && (
            <TextField
              value={item.title}
              onChange={(e) => {
                // This will be handled by the parent
                const updatedItem = {...item, title: e.target.value};
                onSelect(id, updatedItem);
              }}
              variant="standard"
              sx={{ fontWeight: 600 }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          <Chip 
            label={COMPONENT_TYPES.find(t => t.id === item.type)?.label} 
            size="small" 
            icon={COMPONENT_TYPES.find(t => t.id === item.type)?.icon}
            sx={{ ml: 1 }}
          />
          
          <Chip 
            label={item.dataSource} 
            size="small" 
            color="secondary"
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
        
        <Box>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Component content preview */}
      <Box sx={{ 
        height: item.settings?.height || 300, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        overflow: 'hidden',
      }}>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            <DataVisualizer component={item} visualizationMode={true} />
          </motion.div>
        </AnimatePresence>
        
        {!item.sourceData && (
          <>
            {item.type === 'table' && (
              <TableChart sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3) }} />
            )}
            {item.type === 'bar' && (
              <BarChart sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3) }} />
            )}
            {item.type === 'pie' && (
              <PieChart sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3) }} />
            )}
            {item.type === 'line' && (
              <ShowChart sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3) }} />
            )}
            {item.type === 'summary' && (
              <FormatListBulleted sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3) }} />
            )}
          </>
        )}
      </Box>
      
      {/* Component fields */}
      <Collapse in={isSelected}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Fields</Typography>
          <Paper sx={{ p: 1, bgcolor: alpha(theme.palette.background.default, 0.7) }}>
            {item.fields.length > 0 ? (
              <List dense disablePadding>
                {item.fields.map((field, fieldIndex) => (
                  <ListItem
                    key={field.id}
                    disablePadding
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.type === 'table' && (
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={field.visible !== false}
                                onChange={(e) => {
                                  const newFields = [...item.fields];
                                  newFields[fieldIndex] = {
                                    ...newFields[fieldIndex],
                                    visible: e.target.checked
                                  };
                                  const updatedItem = {...item, fields: newFields};
                                  onSelect(id, updatedItem);
                                }}
                              />
                            }
                            label=""
                          />
                        )}
                        
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Don't allow deleting if it's the last field or a critical field
                            if (item.fields.length <= 1) {
                              return;
                            }
                            const newFields = item.fields.filter((f, idx) => idx !== fieldIndex);
                            const updatedItem = {...item, fields: newFields};
                            onSelect(id, updatedItem);
                          }}
                          sx={{ opacity: item.fields.length <= 1 ? 0.3 : 1 }}
                          disabled={item.fields.length <= 1}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemButton dense>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {field.label}
                            {field.role && (
                              <Chip 
                                size="small" 
                                label={field.role} 
                                sx={{ ml: 1, fontSize: '0.6rem', height: 20 }}
                                color={
                                  field.role === 'category' ? 'primary' : 
                                  field.role === 'value' ? 'secondary' :
                                  field.role === 'count' ? 'success' :
                                  field.role === 'sum' ? 'info' : 'default'
                                }
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          field.role === 'sum' && field.aggregation ? 
                          `${field.aggregation} of ${field.type}` : 
                          field.type
                        }
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 1 }}>
                No fields selected
              </Typography>
            )}
            
            <Button
              startIcon={<Add />}
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleAddFieldClick}
            >
              Add Field
            </Button>
          </Paper>
        </Box>
        
        {/* Component settings */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Settings</Typography>
          <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.7) }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.settings?.showTitle !== false}
                      onChange={(e) => {
                        const updatedItem = {
                          ...item, 
                          settings: {
                            ...item.settings,
                            showTitle: e.target.checked
                          }
                        };
                        onSelect(id, updatedItem);
                      }}
                    />
                  }
                  label="Show Title"
                />
              </Grid>
              
              {['bar', 'line', 'pie'].includes(item.type) && (
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={item.settings?.showLegend !== false}
                        onChange={(e) => {
                          const updatedItem = {
                            ...item,
                            settings: {
                              ...item.settings,
                              showLegend: e.target.checked
                            }
                          };
                          onSelect(id, updatedItem);
                        }}
                      />
                    }
                    label="Show Legend"
                  />
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.settings?.showAllData || false}
                      onChange={(e) => {
                        const updatedItem = {
                          ...item, 
                          settings: {
                            ...item.settings,
                            showAllData: e.target.checked
                          }
                        };
                        onSelect(id, updatedItem);
                      }}
                    />
                  }
                  label="Show All Data"
                />
              </Grid>
              
              {!item.settings?.showAllData && (
                <Grid item xs={12}>
                  <TextField
                    label="Records to Display"
                    type="number"
                    value={item.settings?.displayCount || 5}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val > 0) {
                        const updatedItem = {
                          ...item,
                          settings: {
                            ...item.settings,
                            displayCount: val
                          }
                        };
                        onSelect(id, updatedItem);
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  label="Height (px)"
                  type="number"
                  value={item.settings?.height || 300}
                  onChange={(e) => {
                    const updatedItem = {
                      ...item,
                      settings: {
                        ...item.settings,
                        height: parseInt(e.target.value, 10)
                      }
                    };
                    onSelect(id, updatedItem);
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Collapse>
    </ReportComponent>
  );
};


// Main component
const DragDropReport = () => {
  const theme = useTheme();
  const { isDarkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportName, setReportName] = useState('Custom Report');
  const [activeId, setActiveId] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState(false);
  // Section visibility states
  const [componentsVisible, setComponentsVisible] = useState(true);
  const [dataSourcesVisible, setDataSourcesVisible] = useState(true);
  // All sections toggle state
  const [sectionsVisible, setSectionsVisible] = useState(true);
  // File-related states
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  // Theme customization states
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [customTheme, setCustomTheme] = useState({
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    gradientStart: '#FF0099',
    gradientEnd: '#FFD700',
    isDark: isDarkMode
  });
  
  // Configure dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle data from excel upload
  const handleDataUpload = (data, fileName = null) => {
    // Store uploaded data with filename if available
    const dataWithMetadata = fileName ? { ...data, fileName } : data;
    setUploadedData(dataWithMetadata);
    
    // Show notification
    setNotification({
      open: true,
      message: 'Excel data loaded successfully',
      severity: 'success'
    });
  };

  // Handle file change when uploading
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    
    if (uploadedFile) {
      setIsDataLoading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Create sample preview data (first 5 rows)
          setPreviewData({
            data: jsonData.slice(0, 5),
            totalRows: jsonData.length,
            sheetName: firstSheetName,
            fileName: uploadedFile.name,
            sheets: workbook.SheetNames,
            allData: {} // Store all sheet data
          });
          
          // Process all sheets
          const allSheetData = {};
          workbook.SheetNames.forEach(sheet => {
            const ws = workbook.Sheets[sheet];
            allSheetData[sheet] = XLSX.utils.sheet_to_json(ws);
          });
          
          // Update preview with all data
          setPreviewData(prev => ({
            ...prev,
            allData: allSheetData
          }));
          
          // Pass data to parent
          handleDataUpload(allSheetData, uploadedFile.name);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          // Show error notification
          setNotification({
            open: true,
            message: 'Error parsing Excel file. Please check the format.',
            severity: 'error'
          });
        } finally {
          setIsDataLoading(false);
        }
      };
      
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  // Handle drag over event for file dropzone
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event for file dropzone
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Trigger the same processing logic
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  // Handle preview dialog
  const handleViewPreview = () => {
    setPreviewOpen(true);
  };

  // Handle preview dialog close
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDraggingOver(false);
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };
  
  // Handle drag over - for styling and visual feedback
  const handleDndDragOver = (event) => {
    setIsDraggingOver(true);
  };
  
  // Handle dragging from toolbox
  const handleToolboxDrag = (type, category) => {
    // Use uploaded data if available, otherwise use sample data
    const sourceData = category && uploadedData && uploadedData[category] 
      ? { category, data: uploadedData[category] }
      : { category, data: SAMPLE_DATA[category] };
    
    // Create new component
    const newComponent = {
      id: generateId(),
      type: type,
      dataSource: sourceData.category,
      fields: [],
      title: `New ${COMPONENT_TYPES.find(c => c.id === type)?.label}`,
      settings: {
        showTitle: true,
        showLegend: true,
        height: 300,
        width: '100%',
        colors: theme.palette.mode === 'dark' 
          ? ['#FF0099', '#FFD700', '#00C853', '#2196F3', '#FF5722']
          : ['#FF0099', '#FFD700', '#00C853', '#2196F3', '#FF5722'],
      },
      sourceData: sourceData.data,
    };
    
    // Get appropriate fields based on the first row of data
    if (sourceData.data && sourceData.data.length > 0) {
      const firstRow = sourceData.data[0];
      const availableFields = Object.keys(firstRow).map(key => ({
        id: key,
        label: key,
        // Try to determine field type
        type: typeof firstRow[key] === 'number' ? 'number' : 
              !isNaN(Date.parse(firstRow[key])) ? 'date' : 'string'
      }));
      
      // Add fields based on component type
      if (type === 'table') {
        // For table, add first 3 fields by default
        newComponent.fields = availableFields.slice(0, 3).map(field => ({
          id: field.id,
          label: field.label,
          type: field.type,
          visible: true,
          width: 150,
        }));
      } else if (['bar', 'line', 'pie'].includes(type)) {
        // For charts, add first numeric field as value and first string field as category
        const numericField = availableFields.find(f => f.type === 'number');
        const categoryField = availableFields.find(f => f.type === 'string');
        
        if (numericField && categoryField) {
          newComponent.fields = [
            { 
              id: categoryField.id, 
              label: categoryField.label, 
              type: categoryField.type, 
              role: 'category' 
            },
            { 
              id: numericField.id, 
              label: numericField.label, 
              type: numericField.type, 
              role: 'value' 
            }
          ];
        }
      } else if (type === 'summary') {
        // For summary, add count and one aggregate field
        const numericField = availableFields.find(f => f.type === 'number');
        
        if (numericField) {
          newComponent.fields = [
            { id: 'count', label: 'Count', type: 'number', role: 'count' },
            { 
              id: numericField.id, 
              label: numericField.label, 
              type: numericField.type, 
              role: 'sum',
              aggregation: 'sum'
            }
          ];
        }
      }
    } else {
      // Fallback to default field definitions
      if (type === 'table') {
        // For table, add first 3 fields by default
        newComponent.fields = DATA_FIELDS[category].slice(0, 3).map(field => ({
          id: field.id,
          label: field.label,
          type: field.type,
          visible: true,
          width: 150,
        }));
      } else if (['bar', 'line', 'pie'].includes(type)) {
        // For charts, add first numeric field as value and first string field as category
        const numericField = DATA_FIELDS[category].find(f => f.type === 'number' || f.type === 'currency');
        const categoryField = DATA_FIELDS[category].find(f => f.type === 'string');
        
        if (numericField && categoryField) {
          newComponent.fields = [
            { 
              id: categoryField.id, 
              label: categoryField.label, 
              type: categoryField.type, 
              role: 'category' 
            },
            { 
              id: numericField.id, 
              label: numericField.label, 
              type: numericField.type, 
              role: 'value' 
            }
          ];
        }
      } else if (type === 'summary') {
        // For summary, add count and one aggregate field
        const numericField = DATA_FIELDS[category].find(f => f.type === 'number' || f.type === 'currency');
        
        if (numericField) {
          newComponent.fields = [
            { id: 'count', label: 'Count', type: 'number', role: 'count' },
            { 
              id: numericField.id, 
              label: numericField.label, 
              type: numericField.type, 
              role: 'sum',
              aggregation: 'sum'
            }
          ];
        }
      }
    }
    
    // Add new component
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponent(newComponent.id);
    
    // Show notification
    setNotification({
      open: true,
      message: `Added new ${COMPONENT_TYPES.find(c => c.id === type)?.label}!`,
      severity: 'success'
    });
  };

  // Update component
  const updateComponent = (id, updates) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  };

  // Delete a component
  const deleteComponent = (id) => {
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    
    setNotification({
      open: true,
      message: 'Component deleted successfully',
      severity: 'success'
    });
  };

  // Handle component selection with optional updates
  const handleSelectComponent = (id, updates = null, openFieldSelector = false) => {
    setSelectedComponent(id);
    
    if (updates) {
      updateComponent(id, updates);
    }
    
    if (openFieldSelector) {
      handleOpenFieldSelector(id);
    }
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    setIsGeneratingReport(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Process each component
        components.forEach(component => {
          // Use component's source data if available, otherwise fall back to sample data
          const dataSource = component.sourceData || SAMPLE_DATA[component.dataSource];
          
          // Create worksheet based on component type
          if (component.type === 'table') {
            // For tables, extract only the fields selected
            const filteredData = dataSource.map(item => {
              const row = {};
              component.fields.forEach(field => {
                if (field.visible) {
                  row[field.label] = item[field.id];
                }
              });
              return row;
            });
            
            const ws = XLSX.utils.json_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(wb, ws, component.title.slice(0, 31));
          } else {
            // For charts, create a simple data extraction
            const filteredData = dataSource.map(item => {
              const row = {};
              component.fields.forEach(field => {
                row[field.label] = item[field.id];
              });
              return row;
            });
            
            const ws = XLSX.utils.json_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(wb, ws, component.title.slice(0, 31));
          }
        });
        
        // Export to Excel file
        XLSX.writeFile(wb, `${reportName.replace(/\s+/g, '_')}.xlsx`);
        
        setNotification({
          open: true,
          message: 'Report exported successfully!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Export error:', error);
        setNotification({
          open: true,
          message: 'Failed to export report. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsGeneratingReport(false);
      }
    }, 1500);
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Function to toggle mobile drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle visualization mode
  const toggleVisualizationMode = () => {
    setVisualizationMode(prev => !prev);
  };
  
  // Open theme customization dialog
  const handleOpenThemeDialog = () => {
    setThemeDialogOpen(true);
  };
  
  // Close theme customization dialog
  const handleCloseThemeDialog = () => {
    setThemeDialogOpen(false);
  };
  
  // Apply theme changes
  const handleThemeChange = (newTheme) => {
    setCustomTheme(newTheme);
    setThemeDialogOpen(false);
  };

  const navigate = useNavigate();

  // Dynamic gradient based on custom theme
  const customGradient = `linear-gradient(45deg, ${customTheme.gradientStart}, ${customTheme.gradientEnd})`;

  // Field selector state
  const [fieldSelectorOpen, setFieldSelectorOpen] = useState(false);
  const [availableFields, setAvailableFields] = useState([]);
  const [componentToAddField, setComponentToAddField] = useState(null);
  
  // Open field selector
  const handleOpenFieldSelector = (componentId) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;
    
    // Get source data to extract fields
    const sourceData = component.sourceData || 
      (component.dataSource && uploadedData?.[component.dataSource]) || 
      SAMPLE_DATA[component.dataSource];
    
    if (sourceData && sourceData.length > 0) {
      const firstRow = sourceData[0];
      // Extract available fields that aren't already in the component
      const existingFieldIds = component.fields.map(f => f.id);
      const fields = Object.keys(firstRow)
        .filter(key => !existingFieldIds.includes(key))
        .map(key => ({
          id: key,
          label: key,
          type: typeof firstRow[key] === 'number' ? 'number' : 
                !isNaN(Date.parse(firstRow[key])) ? 'date' : 'string'
        }));
      
      setAvailableFields(fields);
      setComponentToAddField(componentId);
      setFieldSelectorOpen(true);
    } else {
      setNotification({
        open: true,
        message: 'No data available to extract fields',
        severity: 'error'
      });
    }
  };
  
  // Add selected field to component
  const handleAddField = (field, role = null) => {
    if (!componentToAddField) return;
    
    const component = components.find(c => c.id === componentToAddField);
    if (!component) return;
    
    // Create field based on component type
    let newField = { ...field, visible: true };
    
    if (role) {
      // If role is explicitly specified, use it
      newField.role = role;
      if (role === 'sum') {
        newField.aggregation = 'sum';
      }
    } else if (['bar', 'line', 'pie'].includes(component.type)) {
      if (field.type === 'number' || field.type === 'currency') {
        newField.role = 'value';
      } else {
        newField.role = 'category';
      }
    } else if (component.type === 'summary') {
      if (field.type === 'number' || field.type === 'currency') {
        newField.role = 'sum';
        newField.aggregation = 'sum';
      }
    }
    
    // Add field to component
    const updatedFields = [...component.fields, newField];
    updateComponent(componentToAddField, { fields: updatedFields });
    
    // Close field selector
    setFieldSelectorOpen(false);
    setAvailableFields([]);
    setComponentToAddField(null);
    
    setNotification({
      open: true,
      message: `Field "${field.label}" added successfully`,
      severity: 'success'
    });
  };

  // Data editor states
  const [dataEditorOpen, setDataEditorOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [editableData, setEditableData] = useState([]);
  const [originalData, setOriginalData] = useState({});
  
  // Open data editor
  const handleOpenDataEditor = () => {
    if (!uploadedData) {
      setNotification({
        open: true,
        message: 'No data available to edit',
        severity: 'error'
      });
      return;
    }
    
    // Get first sheet or selected sheet
    const sheetName = selectedSheet || Object.keys(uploadedData)[0];
    if (!sheetName) return;
    
    setSelectedSheet(sheetName);
    setEditableData(uploadedData[sheetName] || []);
    setOriginalData(uploadedData);
    setDataEditorOpen(true);
  };
  
  // Handle sheet change in data editor
  const handleSheetChange = (event) => {
    const sheetName = event.target.value;
    setSelectedSheet(sheetName);
    setEditableData(uploadedData[sheetName] || []);
  };
  
  // Update data field value
  const handleDataFieldChange = (rowIndex, fieldName, value) => {
    const updatedData = [...editableData];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [fieldName]: value
    };
    setEditableData(updatedData);
  };
  
  // Save edited data
  const handleSaveEditedData = () => {
    // Create new data object with edited data
    const updatedData = {
      ...originalData,
      [selectedSheet]: editableData,
      fileName: originalData.fileName
    };
    
    setUploadedData(updatedData);
    
    // Update components that use this data source
    components.forEach(component => {
      if (component.dataSource === selectedSheet) {
        updateComponent(component.id, { sourceData: editableData });
      }
    });
    
    setDataEditorOpen(false);
    
    setNotification({
      open: true,
      message: 'Data updated successfully',
      severity: 'success'
    });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: isDarkMode ? 'rgb(17, 24, 39)' : 'rgb(249, 250, 251)',
        transition: 'all 0.3s ease'
      }}
    >

          <Button
           sx={{position:'absolute',top:20,left:20, fontSize:'1rem',textTransform:'none'}} 
           startIcon={<ArrowBackIos/>} 
           onClick={() => navigate(-1)}>
            Go Back
          </Button>
      {/* App Bar */}
      <Box 
        sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          boxShadow: 3,
          background: isDarkMode ? 'rgb(26, 32, 44)' : 'white',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth={false}>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={toggleDrawer}
                color="primary"
                sx={{ 
                  display: 'flex',
                  background: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                {drawerOpen ? <MenuIcon sx={{ transform: 'rotate(180deg)' }} /> : <MenuIcon />}
              </IconButton>
              
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                Data Pipeline
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Report Name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  width: { xs: '150px', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              
              <Button
                variant={visualizationMode ? "contained" : "outlined"}
                onClick={toggleVisualizationMode}
                size="small"
                sx={{ 
                  borderRadius: '8px',
                  px: 2,
                  background: visualizationMode ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'transparent',
                  '&:hover': {
                    background: visualizationMode ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'transparent',
                    opacity: 0.9
                  }
                }}
              >
                {visualizationMode ? <VisibilityOff /> : <Visibility />}
              </Button>
              
              <Button
                variant="contained"
                // startIcon={<FileDownload />}
                onClick={handleExportExcel}
                disabled={isGeneratingReport || components.length === 0}
                sx={{
                  borderRadius: '8px',
                  px: 0,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    opacity: 0.9,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isGeneratingReport ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Generating...
                  </>
                ) : <FileDownload />}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 4, 
          px: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        {/* File Upload Component */}
        <Paper
          elevation={0}
          sx={{
            p: 0,
            borderRadius: '16px',
            background: isDarkMode ? 'rgb(30, 41, 59)' : 'white',
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
            boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <InsertDriveFile sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>
                Data Source
              </Typography>
            </Box>
            
            <Chip 
              label={uploadedData ? "Data Loaded" : "No Data"}
              color={uploadedData ? "success" : "default"}
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: '12px',
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05),
                    },
                    background: uploadedData ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                    borderColor: uploadedData ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.primary.main, 0.3),
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                  
                  <Box
                    sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    <FileUpload
                      sx={{
                        fontSize: 36,
                        color: uploadedData ? theme.palette.success.main : theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h6" gutterBottom fontWeight={500}>
                    {uploadedData ? 'File selected' : 'Drop Excel file here'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {uploadedData ? 'Drop another file to replace' : 'or click to browse your files'}
                  </Typography>
                  
                  {uploadedData && (
                    <Chip
                      icon={<InsertDriveFile />}
                      label={uploadedData.fileName || "Excel file"}
                      variant="outlined"
                      color="success"
                    />
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    background: alpha(theme.palette.background.paper, 0.5),
                    height: '100%',
                    minHeight: '220px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={500}>
                    Data Preview
                  </Typography>
                  
                  {!uploadedData && !isDataLoading && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '80%',
                      opacity: 0.7
                    }}>
                      <DataArray sx={{ fontSize: 40, color: alpha(theme.palette.text.secondary, 0.5), mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Upload an Excel file to preview data
                      </Typography>
                    </Box>
                  )}
                  
                  {isDataLoading && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '80%' 
                    }}>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Processing file...
                      </Typography>
                    </Box>
                  )}
                  
                  {uploadedData && !isDataLoading && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {Object.keys(uploadedData).length} sheet(s) • {
                            Object.keys(uploadedData).reduce((total, key) => key !== 'fileName' ? total + uploadedData[key].length : total, 0)
                          } total rows
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            size="small" 
                            startIcon={<Edit />} 
                            onClick={handleOpenDataEditor}
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                          >
                            Edit Data
                          </Button>
                          
                          <Button 
                            size="small" 
                            startIcon={<Visibility />} 
                            onClick={handleViewPreview}
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                          >
                            Preview
                          </Button>
                        </Box>
                      </Box>
                      
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: '8px',
                          background: alpha(theme.palette.background.paper, 0.7),
                          maxHeight: '150px',
                          overflow: 'auto'
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Available Data Sources:
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Object.keys(uploadedData).map(sheetName => (
                            <Chip
                              key={sheetName}
                              label={`${sheetName} (${uploadedData[sheetName].length} rows)`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: '6px' }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 250px)' }}>
          {/* Toolbox */}
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={drawerOpen}
            onClose={toggleDrawer}
            sx={{
              width: 280,
              flexShrink: 0,
              zIndex: 1100,
              transition: 'width 0.3s ease',
              '& .MuiDrawer-paper': {
                width: 280,
                boxSizing: 'border-box',
                border: 'none',
                background: isDarkMode 
                  ? 'rgb(30, 41, 59)'
                  : 'white',
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
                height: '100%',
                position: 'relative',
                borderRadius: { xs: 0, md: '0 16px 16px 0' },
                overflow: 'hidden',
              },
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                background: isDarkMode ? 'rgb(23, 33, 47)' : alpha(theme.palette.background.paper, 0.7),
              }}
              TabIndicatorProps={{
                sx: {
                  background: customGradient,
                  height: '3px',
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab 
                label="Components" 
                icon={<Dashboard />} 
                iconPosition="start" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              />
              <Tab 
                label="Data" 
                icon={<FilterAlt />} 
                iconPosition="start" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              />
            </Tabs>
            
            {activeTab === 0 && (
              <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600} 
                  >
                    Components
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setComponentsVisible(!componentsVisible)}
                    sx={{ 
                      transform: componentsVisible ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
                
                <Collapse in={componentsVisible && sectionsVisible} timeout="auto">
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                  >
                    Drag components to build your report
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: 1,
                    mb: 3
                  }}>
                    {COMPONENT_TYPES.map((type) => (
                      <Paper
                        key={type.id}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                          cursor: 'grab',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.05),
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          },
                        }}
                        onClick={() => handleToolboxDrag(type.id, uploadedData ? Object.keys(uploadedData)[0] : 'members')}
                      >
                        <Box
                          sx={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {type.icon}
                        </Box>
                        <Typography variant="caption" align="center">
                          {type.label}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Collapse>
                
                <Divider sx={{ my: 2 }} />
                
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    mb: 2
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Report Actions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<PlaylistAdd />}
                      onClick={() => {
                        setComponents([]);
                        setSelectedComponent(null);
                        setNotification({
                          open: true,
                          message: 'Report cleared',
                          severity: 'info'
                        });
                      }}
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none'
                      }}
                      size="small"
                    >
                      Clear Report
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<FileDownload />}
                      onClick={handleExportExcel}
                      disabled={isGeneratingReport || components.length === 0}
                      sx={{
                        borderRadius: '8px',
                        background: customGradient,
                        '&:hover': {
                          background: customGradient,
                          opacity: 0.9,
                        },
                        textTransform: 'none'
                      }}
                      size="small"
                    >
                      Export to Excel
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600} 
                  >
                    Data Sources
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setDataSourcesVisible(!dataSourcesVisible)}
                    sx={{ 
                      transform: dataSourcesVisible ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
                
                <Collapse in={dataSourcesVisible && sectionsVisible} timeout="auto">
                  {uploadedData ? (
                    // Show uploaded data sources
                    Object.keys(uploadedData).map((sheetName) => (
                      <Paper
                        key={sheetName}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: '10px',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            mb: 1, 
                            textTransform: 'capitalize',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <DataArray fontSize="small" />
                          {sheetName} ({uploadedData[sheetName].length} rows)
                        </Typography>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          gap: 1,
                          mt: 2
                        }}>
                          {COMPONENT_TYPES.map((type) => (
                            <Button
                              key={`${type.id}-${sheetName}`}
                              size="small"
                              variant="outlined"
                              startIcon={type.icon}
                              onClick={() => handleToolboxDrag(type.id, sheetName)}
                              sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                borderRadius: '8px'
                              }}
                            >
                              {type.label}
                            </Button>
                          ))}
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    // Show sample data categories
                    Object.keys(DATA_FIELDS).map((category) => (
                      <Paper
                        key={category}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: '10px',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            mb: 1, 
                            textTransform: 'capitalize',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <DataArray fontSize="small" />
                          {category} (Sample Data)
                        </Typography>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          gap: 1,
                          mt: 2
                        }}>
                          {COMPONENT_TYPES.map((type) => (
                            <Button
                              key={`${type.id}-${category}`}
                              size="small"
                              variant="outlined"
                              startIcon={type.icon}
                              onClick={() => handleToolboxDrag(type.id, category)}
                              sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                borderRadius: '8px'
                              }}
                            >
                              {type.label}
                            </Button>
                          ))}
                        </Box>
                      </Paper>
                    ))
                  )}
                </Collapse>
              </Box>
            )}
          </Drawer>
          
          {/* Main content */}
          <Box sx={{ 
            flexGrow: 1, 
            ml: !isMobile && drawerOpen ? '280px' : 0,
            transition: 'all 0.3s ease',
            width: !isMobile && !drawerOpen ? '100%' : 'auto',
            p: 2
          }}>
            <Paper 
              elevation={0}
              sx={{
                borderRadius: '16px',
                background: isDarkMode ? 'rgb(30, 41, 59)' : 'white',
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                minHeight: 'calc(100vh - 300px)',
                boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{
                p: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography variant="h6" fontWeight={600}>
                  Report Canvas
                </Typography>
                
                <Chip 
                  label={`${components.length} component${components.length !== 1 ? 's' : ''}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: '6px' }}
                />
              </Box>
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDndDragOver}
              >
                <Box
                  sx={{
                    p: 3, 
                    minHeight: 'calc(100vh - 370px)',
                    background: isDarkMode ? 'rgb(23, 33, 47, 0.3)' : alpha(theme.palette.background.default, 0.5),
                    borderRadius: isDraggingOver ? '0' : '0 0 16px 16px',
                    transition: 'all 0.3s ease',
                    border: isDraggingOver 
                      ? `2px dashed ${theme.palette.primary.main}` 
                      : '2px dashed transparent',
                  }}
                >
                  {components.length === 0 ? (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '400px',
                        opacity: 0.7
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          borderRadius: '16px',
                          background: isDarkMode 
                            ? alpha('rgb(30, 41, 59)', 0.5) 
                            : alpha(theme.palette.background.paper, 0.7),
                          backdropFilter: 'blur(10px)',
                          textAlign: 'center',
                          maxWidth: '500px',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            mx: 'auto'
                          }}
                        >
                          <LibraryAdd sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                        </Box>
                        
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Start Building Your Report
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Drag and drop components from the sidebar to create your custom report
                        </Typography>
                        
                        <Button
                          variant="outlined"
                          startIcon={<Dashboard />}
                          sx={{ 
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3
                          }}
                          onClick={() => handleToolboxDrag('table', uploadedData ? Object.keys(uploadedData)[0] : 'members')}
                        >
                          Add First Component
                        </Button>
                      </Paper>
                    </Box>
                  ) : (
                    <SortableContext 
                      items={components.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <Grid container spacing={3}>
                        {components.map((item) => (
                          <Grid item xs={12} key={item.id}>
                            <SortableItem
                              id={item.id}
                              item={item}
                              isSelected={selectedComponent === item.id}
                              onSelect={handleSelectComponent}
                              onDelete={deleteComponent}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </SortableContext>
                  )}
                </Box>
              </DndContext>
            </Paper>
          </Box>
        </Box>
        
        {/* Theme Customization Dialog */}
        <Dialog
          open={themeDialogOpen}
          onClose={handleCloseThemeDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: isDarkMode 
                ? 'rgb(23, 33, 47)' 
                : theme.palette.background.paper,
            }
          }}
        >
          <DialogTitle>
            Customize Report Theme
            <IconButton
              aria-label="close"
              onClick={handleCloseThemeDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Primary Color
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['#3f51b5', '#f50057', '#00C853', '#2196F3', '#FF5722', '#673AB7', '#009688'].map(color => (
                    <Box
                      key={color}
                      onClick={() => setCustomTheme(prev => ({ ...prev, primary: color }))}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        background: color,
                        cursor: 'pointer',
                        border: customTheme.primary === color ? '2px solid white' : 'none',
                        boxShadow: customTheme.primary === color ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Secondary Color
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['#f50057', '#3f51b5', '#00C853', '#2196F3', '#FF5722', '#673AB7', '#009688'].map(color => (
                    <Box
                      key={color}
                      onClick={() => setCustomTheme(prev => ({ ...prev, secondary: color }))}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        background: color,
                        cursor: 'pointer',
                        border: customTheme.secondary === color ? '2px solid white' : 'none',
                        boxShadow: customTheme.secondary === color ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Gradient Colors
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Start Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {['#3f51b5', '#f50057', '#00C853', '#2196F3', '#FF5722', '#673AB7', '#009688'].map(color => (
                        <Box
                          key={color}
                          onClick={() => setCustomTheme(prev => ({ ...prev, gradientStart: color }))}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: color,
                            cursor: 'pointer',
                            border: customTheme.gradientStart === color ? '2px solid white' : 'none',
                            boxShadow: customTheme.gradientStart === color ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      End Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {['#f50057', '#3f51b5', '#00C853', '#2196F3', '#FF5722', '#673AB7', '#009688'].map(color => (
                        <Box
                          key={color}
                          onClick={() => setCustomTheme(prev => ({ ...prev, gradientEnd: color }))}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: color,
                            cursor: 'pointer',
                            border: customTheme.gradientEnd === color ? '2px solid white' : 'none',
                            boxShadow: customTheme.gradientEnd === color ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
                
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    borderRadius: '8px', 
                    background: `linear-gradient(45deg, ${customTheme.gradientStart}, ${customTheme.gradientEnd})`,
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  Preview Gradient
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={customTheme.isDark}
                      onChange={(e) => setCustomTheme(prev => ({ ...prev, isDark: e.target.checked }))}
                    />
                  }
                  label="Dark Mode"
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseThemeDialog}>Cancel</Button>
            <Button 
              onClick={() => handleThemeChange(customTheme)}
              variant="contained"
              sx={{ 
                background: customGradient,
                '&:hover': {
                  background: customGradient,
                  opacity: 0.9
                }
              }}
            >
              Apply Theme
            </Button>
          </DialogActions>
        </Dialog>
      
        {/* Data Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={handleClosePreview}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: isDarkMode 
                ? 'rgb(23, 33, 47)' 
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <DialogTitle>
            Data Preview: {file?.name || "Uploaded Data"}
            <IconButton
              aria-label="close"
              onClick={handleClosePreview}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            {previewData && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Showing first 5 rows of {previewData.totalRows} from sheet "{previewData.sheetName}"
                </Typography>
                
                <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 2 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        {previewData.data.length > 0 &&
                          Object.keys(previewData.data[0]).map((header) => (
                            <TableCell key={header}>
                              <Typography variant="subtitle2">{header}</Typography>
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewData.data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{String(cell)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DataArray fontSize="small" color="primary" />
                  <Typography variant="body2">
                    Available sheets: {previewData.sheets.join(', ')}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleClosePreview}>Close</Button>
          </DialogActions>
        </Dialog>
      
        {/* Field Selector Dialog */}
        <Dialog
          open={fieldSelectorOpen}
          onClose={() => setFieldSelectorOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: isDarkMode 
                ? 'rgb(23, 33, 47)' 
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <DialogTitle>
            Add Field
            <IconButton
              aria-label="close"
              onClick={() => setFieldSelectorOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers>
            {availableFields.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 3,
                textAlign: 'center'
              }}>
                <Typography variant="body1" color="text.secondary">
                  No additional fields available to add.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  All fields from the data source have already been added.
                </Typography>
              </Box>
            ) : (
              <List sx={{ pt: 1 }}>
                {availableFields.map((field) => {
                  const component = components.find(c => c.id === componentToAddField);
                  const isChartType = component && ['bar', 'line', 'pie'].includes(component.type);
                  const isSummaryType = component && component.type === 'summary';
                  
                  return (
                    <ListItem 
                      key={field.id} 
                      sx={{ 
                        borderRadius: '8px',
                        mb: 0.5,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 2,
                        px: 1,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        width: '100%', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {field.type === 'number' || field.type === 'currency' ? (
                            <ShowChart color="primary" />
                          ) : field.type === 'date' ? (
                            <InsertDriveFile color="secondary" />
                          ) : (
                            <FormatAlignLeft color="info" />
                          )}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="body1">{field.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Type: {field.type}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {!isChartType && !isSummaryType && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            onClick={() => handleAddField(field)}
                            sx={{ borderRadius: '8px' }}
                          >
                            Add
                          </Button>
                        )}
                      </Box>
                      
                      {isChartType && (
                        <Box sx={{ mt: 2, display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<FormatAlignLeft />}
                            onClick={() => handleAddField(field, 'category')}
                            sx={{ borderRadius: '8px', flex: 1, mr: 1 }}
                            disabled={field.type === 'number' || field.type === 'currency'}
                          >
                            Add as Category
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            startIcon={<ShowChart />}
                            onClick={() => handleAddField(field, 'value')}
                            sx={{ borderRadius: '8px', flex: 1 }}
                            disabled={!(field.type === 'number' || field.type === 'currency')}
                          >
                            Add as Value
                          </Button>
                        </Box>
                      )}
                      
                      {isSummaryType && field.type === 'number' && (
                        <Box sx={{ mt: 2, display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="info"
                            startIcon={<ShowChart />}
                            onClick={() => {
                              const newField = {...field, aggregation: 'sum'};
                              handleAddField(newField, 'sum');
                            }}
                            sx={{ borderRadius: '8px', flex: 1, mr: 1 }}
                          >
                            Add as Sum
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            color="warning"
                            startIcon={<ShowChart />}
                            onClick={() => {
                              const newField = {...field, aggregation: 'avg'};
                              handleAddField(newField, 'sum');
                            }}
                            sx={{ borderRadius: '8px', flex: 1 }}
                          >
                            Add as Average
                          </Button>
                        </Box>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setFieldSelectorOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        
        {/* Data Editor Dialog */}
        <Dialog
          open={dataEditorOpen}
          onClose={() => setDataEditorOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: isDarkMode 
                ? 'rgb(23, 33, 47)' 
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              height: '80vh'
            },
          }}
        >
          <DialogTitle>
            Edit Data
            <IconButton
              aria-label="close"
              onClick={() => setDataEditorOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 0 }}>
            {uploadedData ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      select
                      label="Sheet"
                      value={selectedSheet}
                      onChange={handleSheetChange}
                      size="small"
                      sx={{ minWidth: 200 }}
                    >
                      {Object.keys(uploadedData).filter(key => key !== 'fileName').map((sheet) => (
                        <MenuItem key={sheet} value={sheet}>
                          {sheet}
                        </MenuItem>
                      ))}
                    </TextField>
                    
                    <Typography variant="body2" color="text.secondary">
                      {editableData.length} rows in this sheet
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Edit your data directly in the table below. Changes will be applied to visualizations when you save.
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {editableData.length > 0 && (
                    <TableContainer sx={{ maxHeight: 'calc(100% - 10px)', borderRadius: 0 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: 70 }}>Row</TableCell>
                            {Object.keys(editableData[0] || {}).map((key) => (
                              <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                                {key}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {editableData.slice(0, 100).map((row, rowIndex) => (
                            <TableRow key={rowIndex} hover>
                              <TableCell>{rowIndex + 1}</TableCell>
                              {Object.entries(row).map(([key, value], cellIndex) => (
                                <TableCell key={`${rowIndex}-${key}`}>
                                  <TextField
                                    value={value}
                                    onChange={(e) => handleDataFieldChange(rowIndex, key, e.target.value)}
                                    variant="standard"
                                    size="small"
                                    fullWidth
                                    sx={{ 
                                      '& .MuiInputBase-input': { 
                                        py: 0.5,
                                        fontSize: '0.875rem' 
                                      } 
                                    }}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  
                  {editableData.length > 100 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Showing first 100 rows. {editableData.length - 100} more rows are available.
                      </Typography>
                    </Box>
                  )}
                  
                  {editableData.length === 0 && (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No data available in this sheet.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No data available to edit.
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setDataEditorOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveEditedData}
              variant="contained"
              disabled={!editableData.length}
              sx={{ 
                background: customGradient,
                '&:hover': {
                  background: customGradient,
                  opacity: 0.9
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Export FAB for quick access */}
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 1000
          }}
        >
          <Fab
            color="primary"
            aria-label="export"
            onClick={handleExportExcel}
            disabled={isGeneratingReport || components.length === 0}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                opacity: 0.9,
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isGeneratingReport ? <CircularProgress size={24} color="inherit" /> : <FileDownload />}
          </Fab>
        </Box>
        
        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ 
              width: '100%', 
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
        
        {/* Loading backdrop */}
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: theme.zIndex.drawer + 1,
            backdropFilter: 'blur(4px)'
          }}
          open={isGeneratingReport || isDataLoading}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '16px',
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              maxWidth: '300px',
              textAlign: 'center'
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{
                color: theme.palette.primary.main
              }}
            />
            <Typography variant="h6" color="text.primary">
              {isGeneratingReport ? 'Generating report...' : 'Processing data...'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isGeneratingReport ? 'Please wait while we prepare your Excel file' : 'Analyzing your data file...'}
            </Typography>
          </Paper>
        </Backdrop>
      </Container>
    </Box>
  );
};

export default DragDropReport;
