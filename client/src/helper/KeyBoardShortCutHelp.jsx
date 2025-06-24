import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useTheme,
  Chip,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Keyboard as KeyboardIcon,
  Dashboard as DashboardIcon,
  Receipt as InvoiceIcon,
  Groups as PartyIcon,
  Payments as PaymentIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Person as MemberIcon,
  CalendarToday as AgendaIcon,
  Event as EventIcon,
  People as UserIcon,
  PostAdd as BulkIcon,
  ListAlt as ItemIcon,
  History as LogsIcon,
  Description as DocsIcon,
  KeyboardReturn
} from '@mui/icons-material';

// Constants
const SHORTCUT_TRIGGER = { key: '/', ctrlKey: true };
const MODAL_WIDTH = 440;
const MODAL_MAX_HEIGHT = '70vh';

// Memoized icon map to prevent recreation on every render
const iconMap = {
  'Dashboard': <DashboardIcon fontSize="small" />,
  'Insta Invoice': <InvoiceIcon fontSize="small" />,
  'Party Management': <PartyIcon fontSize="small" />,
  'Payment Transaction': <PaymentIcon fontSize="small" />,
  'Inventory Management': <InventoryIcon fontSize="small" />,
  'Settings': <SettingsIcon fontSize="small" />,
  'Return': <KeyboardReturn fontSize="small" />,
  'Member Management': <MemberIcon fontSize="small" />,
  'Agenda Management': <AgendaIcon fontSize="small" />,
  'Event Management': <EventIcon fontSize="small" />,
  'User Management': <UserIcon fontSize="small" />,
  'Bulk Member Creation': <BulkIcon fontSize="small" />,
  'Bulk Item Creation': <ItemIcon fontSize="small" />,
  'Check Logs': <LogsIcon fontSize="small" />,
  'Documentation': <DocsIcon fontSize="small" />
};

const ShortcutRow = ({ keys, action }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderRadius: 1,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
        }
      }}
      role="row"
      tabIndex={0}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {iconMap[action]}
        <Typography variant="body2" component="span">
          {action}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {keys.map((key, i) => (
          <Box 
            key={i}
            component="kbd"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              color: theme.palette.text.primary,
              px: 1.2,
              py: 0.3,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.5,
              minWidth: 20,
              textAlign: 'center',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            {key.replace('Ctrl', '⌘').replace('Alt', '⌥').replace('Shift', '⇧')}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

ShortcutRow.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  action: PropTypes.string.isRequired
};

const KeyboardShortcutsHelp = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Memoize shortcut groups to prevent recreation on every render
  const shortcutGroups = useMemo(() => [
    {
      title: "Basic Navigation",
      shortcuts: [
        { keys: ["⌥", "1"], action: "Dashboard" },
        { keys: ["⌥", "2"], action: "Insta Invoice" },
        { keys: ["⌥", "3"], action: "Party Management" },
        { keys: ["⌥", "4"], action: "Payment Transaction" },
        { keys: ["⌥", "5"], action: "Inventory Management" },
        { keys: ["⌥", "6"], action: "Settings" },
        { keys: ["⌥", "0"], action: "Return" },
      ]
    },
    {
      title: "Advanced Commands",
      shortcuts: [
        { keys: ["⌘", "⇧", "M"], action: "Member Management" },
        { keys: ["⌘", "⇧", "A"], action: "Agenda Management" },
        { keys: ["⌘", "⇧", "E"], action: "Event Management" },
        { keys: ["⌘", "⇧", "U"], action: "User Management" },
        { keys: ["⌘", "⇧", "B"], action: "Bulk Member Creation" },
        { keys: ["⌘", "⇧", "I"], action: "Bulk Item Creation" },
        { keys: ["⌘", "⇧", "L"], action: "Check Logs" },
        { keys: ["⌘", "⇧", "D"], action: "Documentation" },
      ]
    }
  ], []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === SHORTCUT_TRIGGER.key && e.ctrlKey === SHORTCUT_TRIGGER.ctrlKey) {
        setOpen(prev => !prev);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  const modalContent = (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
        bgcolor: 'rgba(0,0,0,0.5)'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <Paper 
        sx={{
          width: isMobile ? '90%' : MODAL_WIDTH,
          maxHeight: MODAL_MAX_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(45,45,45,0.95)' : 'rgba(250,250,250,0.95)',
          borderRadius: 2.5,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[24]
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <KeyboardIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600} id="keyboard-shortcuts-title">
              Keyboard Shortcuts
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => setOpen(false)}
            aria-label="Close keyboard shortcuts"
            sx={{
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {shortcutGroups.map((group, i) => (
            <Box key={i}>
              <Typography 
                variant="overline" 
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  color: theme.palette.text.secondary,
                  letterSpacing: 1,
                  fontSize: '0.7rem'
                }}
              >
                {group.title.toUpperCase()}
              </Typography>
              {group.shortcuts.map((shortcut, j) => (
                <ShortcutRow 
                  key={j} 
                  keys={shortcut.keys} 
                  action={shortcut.action} 
                />
              ))}
            </Box>
          ))}
        </Box>

        <Box 
          sx={{
            p: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}
        >
          <Chip 
            icon={<KeyboardIcon fontSize="small" />}
            label={`Press ${isMobile ? 'Ctrl' : '⌘'} + / to close`}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 1,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
            }}
          />
        </Box>
      </Paper>
    </Box>
  );

  return createPortal(modalContent, document.body);
};

export default KeyboardShortcutsHelp;