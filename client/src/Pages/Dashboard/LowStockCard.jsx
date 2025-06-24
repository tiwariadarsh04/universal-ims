import React from 'react'
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

const LowStockCard = ({handleClose}) => {
  return (
    <div style={{
      position:'fixed',
      zIndex:'9999',
      right:'0',
      bottom:'0',
      
    }}>
        {/* Alerts and Notifications */}
        <Paper
          sx={{
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            margin:8,
            width:'300px',
            cursor:'pointer',
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "translate(-1px,-1px)" },
          }}
        >
          <div style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
          }}>
            <div style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            gap:'0.4em'
          }}>
            <NotificationImportantIcon sx={{color:'red',fontSize:'1.5em'}}/>
            <Typography variant="body1" color='red'>
              Alerts
            </Typography>
            </div>
            <CancelIcon 
              onClick={handleClose}
            sx={{
              opacity:'0.8',
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.07)" , opacity:'1'},
            }}/>
          </div>

          <List>
            <ListItem sx={{display:'flex',gap:'1em'}}>
              <TrendingDownIcon sx={{color:'orange'}}/>
              <ListItemText
                primary="Low Stock: Vodka"
                secondary="Stock: 5 (Reorder at 10)"
                sx={{ color: "orange" }}
              />
            </ListItem>
            <ListItem sx={{display:'flex',gap:'1em'}}>
              <RemoveShoppingCartIcon sx={{color:'red'}} />
              <ListItemText
                primary="Out of Stock: Gin"
                secondary="Urgent action required"
                sx={{ color: "red" }}
              />
            </ListItem>
          </List>
        </Paper>
    </div>
  )
}

export default LowStockCard