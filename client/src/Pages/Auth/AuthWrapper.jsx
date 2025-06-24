import React from 'react'
import { Container, Paper } from '@mui/material'
import LOGO from '../../assets/logo.png';
import CustomTypography from '../../helper/CustomTypography';

const AuthWrapper = ({children,logoAnimation,titletxt}) => {

  const [companyLogo, setCompanyLogo] = React.useState('');


  React.useEffect(() => {
    const localLogo = localStorage.getItem('companyProfile') ? JSON.parse(localStorage.getItem('companyProfile')) : '';
    if (localLogo) {
      setCompanyLogo(localLogo);
    } 
  },[])
  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        py: 4
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          width: '100%',
          overflow: 'hidden',
          border: '0.1px solid rgba(0, 0, 0, 0.15)',
          '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              // background: 'linear-gradient(90deg, #6a5acd, #9370db)'
              background: 'linear-gradient(45deg, #FF0099 30%, #FFD700 90%)'
            }
        }}
      >
        <img
          src={companyLogo?.logoUrl}
          width={60}
          style={{ margin: '0.5em' }}
          className={logoAnimation ? "animate-logo" : ""}
          alt=" Club Logo"
        />
        
        <CustomTypography fontSize="2em">
          {titletxt}
        </CustomTypography>

        {children}
        </Paper>
     </Container>
  )
}

export default AuthWrapper