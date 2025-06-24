import { 
  TextField, 
  FilledInput,
  FormControl,
  InputLabel
} from '@mui/material'
import React from 'react'

const ModernInputField = ({
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  icon,
  ...rest
}) => {
  return (
    <FormControl variant="filled" fullWidth sx={{ 
      '& .MuiFilledInput-root': {
        borderRadius: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        },
        '&.Mui-focused': {
          backgroundColor: 'action.selected',
          borderColor: 'primary.main',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
        }
      },
      '& .MuiFilledInput-input': {
        py: '14px',
        px: '12px'
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(12px, 16px) scale(1)',
        '&.Mui-focused, &.MuiFormLabel-filled': {
          transform: 'translate(12px, 8px) scale(0.75)'
        }
      }
    }}>
      <InputLabel>{label}</InputLabel>
      <FilledInput
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={{
          pt:1
        }}
        // startAdornment={icon && (
        //   <InputAdornment position="start" sx={{ ml: 1 }}>
        //     {icon}
        //   </InputAdornment>
        // )}
        disableUnderline
        {...rest}
      />
    </FormControl>
  )
}

const ModernDateField = ({ label, name, value, onChange }) => {
  return (
    <TextField
      label={label}
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      variant='standard'
      InputLabelProps={{ shrink: true }}
      fullWidth
      sx={{
        '& .MuiFilledInput-root': {
          borderRadius: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          },
          '&.Mui-focused': {
            backgroundColor: 'action.selected',
            borderColor: 'primary.main',
            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
          }
        },
        '& .MuiFilledInput-input': {
          py: '14px',
          px: '12px'
        }
      }}
    />
  )
}


const PartyInputField = ({
  label, 
  inputStyle,
  name, 
  placeholder, 
  value, 
  onChange, 
  icon,
  ...rest
}) => {
  return (
    <FormControl variant="filled" fullWidth sx={{ 
      '& .MuiFilledInput-root': {
        borderRadius: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        },
        '&.Mui-focused': {
          backgroundColor: 'action.selected',
          borderColor: 'primary.main',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
        }
      },
      '& .MuiFilledInput-input': {
        py: '14px',
        px: '12px'
      },
      '& .MuiInputLabel-root': {
        transform: 'translate(12px, 16px) scale(1)',
        '&.Mui-focused, &.MuiFormLabel-filled': {
          transform: 'translate(12px, 8px) scale(0.75)'
        }
      }
    }}>
      <InputLabel>{label}</InputLabel>
      <FilledInput
        name={name}
        value={value}
        onChange={onChange}
        variant="standard"
        placeholder={placeholder}
        sx={inputStyle}
        disableUnderline
        {...rest}
      />
    </FormControl>
  )
}

export { ModernInputField, ModernDateField,PartyInputField }