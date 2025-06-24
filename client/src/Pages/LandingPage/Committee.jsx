import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Avatar
} from '@mui/material';
import { Email, Phone} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Dummy data for executive committee
const executiveCommittee = [
  {
    photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fnypost.com%2F2025%2F05%2F29%2Fopinion%2Fzohran-mamdanis-radical-socialist-vision-would-bankrupt-nyc%2F&psig=AOvVaw1PMc--PqisJ0B1HEJx-8oA&ust=1750755299570000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjUofCVh44DFQAAAAAdAAAAABAL',
    name: 'Mr. Syed Zohran',
    role: 'President',
    email: '',
    phone: '+91 1234567890',
  },
  {
    photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fresearch.unityhealth.to%2Fprofiles%2Fmuhammad-mamdani%2F&psig=AOvVaw3_NcCP_bIiGsQuRCpI_Na8&ust=1750755373993000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjB6pOWh44DFQAAAAAdAAAAABAL',
    name: 'Mamdani Ali',
    role: 'Mr.Vice President',
    email: '',
    phone: '+91 1234567890',
  },
  {
    photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.forbes.com%2Fprofile%2Fray-irani%2F&psig=AOvVaw2No5no0iDjFngbsDtJhAHp&ust=1750755477591000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOC8rciWh44DFQAAAAAdAAAAABAE',
    name: 'Mr. Rayl Irani',
    role: 'Counselor',
    email: '',
    phone: '+91 1234567890',
  },
 
  
  
];

const ExecutiveCommitteeSection = () => {
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
          {executiveCommittee.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    {/* Photo */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '150px',
                        height: '150px',
                        margin: '0 auto 20px',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -4,
                          left: -4,
                          right: -4,
                          bottom: -4,
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          borderRadius: '50%',
                          zIndex: 0,
                        }
                      }}
                    >
                      <Avatar
                        src={member.photo}
                        alt={member.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          border: '4px solid white',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      />
                    </Box>

                    {/* Name and Role */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: 'text.primary',
                        fontSize: { xs: '1.1rem', sm: '1.2rem' }
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main',
                        mb: 3,
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      {member.role}
                    </Typography>

                    {/* Contact Information */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 1,
                        flexWrap: 'wrap'
                      }}
                    >
                      <Tooltip title="Email">
                        <IconButton
                          color="primary"
                          aria-label="email"
                          href={`mailto:${member.email}`}
                          sx={{
                            background: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.2),
                            }
                          }}
                        >
                          <Email />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Phone">
                        <IconButton
                          color="primary"
                          aria-label="phone"
                          href={`tel:${member.phone}`}
                          sx={{
                            background: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.2),
                            }
                          }}
                        >
                          <Phone />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
  );
};

export default ExecutiveCommitteeSection;