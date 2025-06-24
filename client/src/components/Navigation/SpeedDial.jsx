import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: <ReceiptIcon />, name: 'Instant Bill' },
  { icon: <InsightsIcon />, name: 'Insight' },
];

export default function ControlledOpenSpeedDial() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{position:'fixed',zIndex:'99999',right:'0',bottom:'3.5em' }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'absolute', bottom: 26, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => navigate('/invoice-billing')}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
