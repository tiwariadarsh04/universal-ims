import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Avatar,
  IconButton,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Save,
  Business,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Upload as UploadIcon,
  Cancel as CancelIcon,
  Public,
  Language
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { getCompanyProfile, updateCompanyProfile } from '../../services/CompnayProfile';

// Design Constants
const AVATAR_SIZE = 140;
const CARD_BORDER_RADIUS = '16px';
const SOCIAL_COLORS = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E1306C',
  linkedin: '#0077B5'
};

const DEFAULT_PROFILE = {
  name: 'Konectile',
  contact: '+91 123 456 7890',
  email: 'support@konectile.com',
  about: 'Konectile transforms workflows through intelligent automation, helping businesses scale efficiently since 2025.',
  address: 'Balutar, Teesta-6 Singtam, Sikkim 737134',
  logoUrl: 'https://www.konectile.com/logo.png',
  socialLinks: {
    facebook: 'http://facebook.com/konectile',
    twitter: 'http://twitter.com/konectile',
    instagram: 'http://instagram.com/konectile',
    linkedin: 'https://www.linkedin.com/company/107111567/'
  }
};

const SOCIAL_MEDIA_CONFIG = [
  { platform: 'facebook', icon: <Facebook />, label: 'Facebook' },
  { platform: 'twitter', icon: <Twitter />, label: 'Twitter' },
  { platform: 'instagram', icon: <Instagram />, label: 'Instagram' },
  { platform: 'linkedin', icon: <LinkedIn />, label: 'LinkedIn' }
];

const CompanyProfile = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gradient effect for buttons and accents
  const gradientBg = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getCompanyProfile();
        if (data) {
          setFormData(data[0]);
          setLogoPreview(data.logoUrl || '');
        }
      } catch (error) {
        enqueueSnackbar('Failed to load company profile', { 
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if(file?.size/(1024*1024) > 5) return alert("File size limit < 1MB")
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setLogoFile(null);
    setFormData(prev => ({ ...prev, logoUrl: '' }));
  };

  const resetForm = () => {
    setEditMode(false);
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const profileData = {
        ...formData,
        logoUrl: logoPreview
      };

      const response = await updateCompanyProfile(profileData);

      enqueueSnackbar('Profile saved successfully', { 
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
      setEditMode(false);
    } catch (error) {
      enqueueSnackbar(error.message || 'Error saving profile', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLogoSection = () => (
    <Box sx={{ 
      position: 'relative',
      mb: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Avatar
        src={ formData?.logoUrl || logoPreview }
        sx={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.main,
          fontSize: 60,
          border: `3px solid ${theme.palette.primary.main}`,
          mb: 2,
          boxShadow: theme.shadows[4]
        }}
      >
        {formData.name ? formData.name.charAt(0) : <Business fontSize="large" />}
      </Avatar>
      {editMode && (
        <Stack direction="row" spacing={1}>
          <Button
            component="label"
            variant="contained"
            color="primary"
            size="small"
            startIcon={<UploadIcon />}
            sx={{ borderRadius: '20px' }}
          >
            Upload Logo
            <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
          </Button>
          {logoPreview && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CancelIcon />}
              onClick={handleRemoveLogo}
              sx={{ borderRadius: '20px' }}
            >
              Remove
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );

  const renderCompanyName = () => (
    editMode ? (
      <TextField
        fullWidth
        label="Company Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 3 }}
        InputProps={{
          sx: { borderRadius: '12px' }
        }}
      />
    ) : (
      <Typography variant="h4" component="h1" sx={{ 
        fontWeight: 700,
        textAlign: 'center',
        mb: 2,
        background: gradientBg.background,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {formData.name || 'Company Name'}
      </Typography>
    )
  );

  const renderContactInfo = () => (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PhoneIcon sx={{ 
          mr: 2,
          color: theme.palette.primary.main,
          fontSize: '1.5rem'
        }} />
        <Typography variant="body1">
          {formData.contact || 'Not provided'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <EmailIcon sx={{ 
          mr: 2,
          color: theme.palette.primary.main,
          fontSize: '1.5rem'
        }} />
        <Typography variant="body1">
          {formData.email || 'Not provided'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <LocationIcon sx={{ 
          mr: 2,
          color: theme.palette.primary.main,
          fontSize: '1.5rem',
          mt: 0.5
        }} />
        <Typography variant="body1">
          {formData.address || 'Not provided'}
        </Typography>
      </Box>
    </Stack>
  );

  const renderEditableContactInfo = () => (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Contact Number"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        InputProps={{
          startAdornment: <PhoneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
          sx: { borderRadius: '12px' }
        }}
      />
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        value={formData.email}
        onChange={handleChange}
        InputProps={{
          startAdornment: <EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
          sx: { borderRadius: '12px' }
        }}
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        multiline
        rows={3}
        InputProps={{
          startAdornment: <LocationIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
          sx: { borderRadius: '12px' }
        }}
      />
    </Stack>
  );


const renderSocialLinks = () => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
    {SOCIAL_MEDIA_CONFIG.map(({ platform, icon, label }) => {
      const url = formData.socialLinks?.[platform];
      return url ? (
        <Chip
          key={platform}
          icon={icon}
          label={label}
          onClick={() => window.open(url, '_blank')}
          sx={{
            cursor: 'pointer',
            backgroundColor: SOCIAL_COLORS[platform],
            color: 'white',
            '&:hover': {
              backgroundColor: SOCIAL_COLORS[platform],
              opacity: 0.9
            }
          }}
        />
      ) : null;
    })}
  </Box>
);

  const renderEditableSocialLinks = () => (
    <Stack spacing={2} sx={{ mb: 2 }}>
      {SOCIAL_MEDIA_CONFIG.map(({ platform, icon, label }) => (
        <TextField
          key={platform}
          fullWidth
          label={`${label} URL`}
          name={platform}
          value={formData.socialLinks[platform]}
          onChange={handleSocialLinkChange}
          InputProps={{
            startAdornment: <Box sx={{ mr: 1 }}>{icon}</Box>,
            sx: { borderRadius: '12px' }
          }}
        />
      ))}
    </Stack>
  );

  const renderAboutSection = () => (
    editMode ? (
      <TextField
        fullWidth
        label="About the Company"
        name="about"
        value={formData.about}
        onChange={handleChange}
        multiline
        minRows={6}
        maxRows={10}
        InputProps={{
          sx: { borderRadius: '12px' }
        }}
      />
    ) : (
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8,
        color: theme.palette.text.secondary
      }}>
        {formData.about || 'No description provided'}
      </Typography>
    )
  );

  const renderActionButtons = () => (
    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 4 }}>
      {editMode ? (
        <>
          <Button
            variant="outlined"
            onClick={resetForm}
            disabled={isSubmitting}
            sx={{ 
              borderRadius: '20px',
              px: 3,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ 
              borderRadius: '20px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              ...gradientBg,
              '&:hover': gradientBg
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setEditMode(true)}
          sx={{ 
            borderRadius: '20px',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            ...gradientBg,
            '&:hover': gradientBg
          }}
        >
          Edit Profile
        </Button>
      )}
    </Stack>
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 , mb: 8 }}>
      {renderActionButtons()}

      <Grid container spacing={4}>
        {/* Left Column - Company Info */}
        <Grid item xs={12} md={5}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: CARD_BORDER_RADIUS,
              boxShadow: theme.shadows[3],
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              p: 3
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {renderLogoSection()}
              {renderCompanyName()}
              
              <Divider sx={{ 
                my: 3,
                borderColor: theme.palette.divider,
                borderWidth: '1px'
              }} />

              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main
              }}>
                <Public sx={{ mr: 1 }} /> Contact Information
              </Typography>
              
              {editMode ? renderEditableContactInfo() : renderContactInfo()}

              <Divider sx={{ 
                my: 3,
                borderColor: theme.palette.divider,
                borderWidth: '1px'
              }} />

              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main
              }}>
                <Language sx={{ mr: 1 }} /> Social Media
              </Typography>
              
              {editMode ? renderEditableSocialLinks() : renderSocialLinks()}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - About Section */}
        <Grid item xs={12} md={7}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              borderRadius: CARD_BORDER_RADIUS,
              boxShadow: theme.shadows[3],
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
              p: 3
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main
              }}>
                <Description sx={{ mr: 1 }} /> About Us
              </Typography>
              
              {renderAboutSection()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyProfile;