import { Typography } from "@mui/material"

const CustomTypography = ({children,...rest}) => {
  return (
    <Typography
        variant="h5"
        style={{
            textAlign: 'center',
            fontWeight: '900', 
            fontSize: '1.5rem', 
            background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', 
            fontFamily: '"Poppins", sans-serif', 
            letterSpacing: '0.4px',
            ...rest
        }}
        >
            {children}
        </Typography>
  )
}

export default CustomTypography