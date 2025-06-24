import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const CustomLink = ({to,icon,name,title}) => {
  return (
    <Tooltip placement="right" title={title}>
      <ListItem>
        <Link to={to} style={{
            textDecoration:'none',
            color:'inherit',
            width:'100%',
            borderRadius:'1em',
            
          }}>
            <ListItemButton
              sx={[{minHeight: 48,px: 0.5,},open ? {justifyContent: 'initial',}: {justifyContent: 'center',},]}
            >
              <ListItemIcon
                sx={[{minWidth: 0,justifyContent: 'center',},open? {mr: 3,}: {mr: 'auto',},]}>
                  {icon}
              </ListItemIcon>
                  <ListItemText primary={name}
                    sx={[ open ? { opacity: 1,}: {opacity: 0,},]}
                  />
            </ListItemButton>
        </Link>
      </ListItem>
    </Tooltip>
  )
}

export default CustomLink