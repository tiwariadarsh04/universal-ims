import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  Button,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Slider,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  IconButton,
  Badge
} from '@mui/material';
import {
  Accessibility,
  Visibility,
  Hearing,
  Contrast,
  TextFields,
  ZoomIn,
  ZoomOut,
  Keyboard,
  Mouse,
  Colorize,
  CheckCircle,
  Close,
  ArrowForward,
  Settings
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AccessibilityPage = () => {
  const theme = useTheme();
  const clubColors = {
    primary: "#FF0099",
    secondary: "#FFD700",
    gradient: "linear-gradient(45deg, #FF0099 30%, #FFD700 90%)"
  };

  // State for accessibility settings
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 16, // base 16px
    lineHeight: 1.5,
    letterSpacing: 0,
    colorBlindMode: 'none',
    reduceMotion: false,
    keyboardNavigation: true,
    screenReader: false,
    darkMode: false
  });

  const [activePanel, setActivePanel] = useState('vision');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSettingChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  const handleSliderChange = (setting) => (event, newValue) => {
    setSettings({
      ...settings,
      [setting]: newValue
    });
  };

  const accessibilityFeatures = [
    {
      id: 'vision',
      icon: <Visibility />,
      title: "Visual Adjustments",
      features: [
        {
          name: "High Contrast Mode",
          control: (
            <Switch
              checked={settings.highContrast}
              onChange={handleSettingChange('highContrast')}
              color="primary"
            />
          ),
          description: "Enhances text and UI contrast for better readability"
        },
        {
          name: "Font Size",
          control: (
            <Slider
              value={settings.fontSize}
              onChange={handleSliderChange('fontSize')}
              min={12}
              max={24}
              step={1}
              valueLabelDisplay="auto"
              sx={{ width: 200 }}
            />
          ),
          description: "Adjust text size (current: " + settings.fontSize + "px)"
        },
        {
          name: "Color Blind Mode",
          control: (
            <FormControl fullWidth>
              <Select
                value={settings.colorBlindMode}
                onChange={handleSettingChange('colorBlindMode')}
                sx={{ width: 200 }}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="protanopia">Protanopia (Red-Blind)</MenuItem>
                <MenuItem value="deuteranopia">Deuteranopia (Green-Blind)</MenuItem>
                <MenuItem value="tritanopia">Tritanopia (Blue-Blind)</MenuItem>
              </Select>
            </FormControl>
          ),
          description: "Adjust colors for different types of color blindness"
        }
      ]
    },
    {
      id: 'reading',
      icon: <TextFields />,
      title: "Reading Assistance",
      features: [
        {
          name: "Line Height",
          control: (
            <Slider
              value={settings.lineHeight}
              onChange={handleSliderChange('lineHeight')}
              min={1}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ width: 200 }}
            />
          ),
          description: "Adjust spacing between lines (current: " + settings.lineHeight + ")"
        },
        {
          name: "Letter Spacing",
          control: (
            <Slider
              value={settings.letterSpacing}
              onChange={handleSliderChange('letterSpacing')}
              min={0}
              max={0.1}
              step={0.01}
              valueLabelDisplay="auto"
              sx={{ width: 200 }}
            />
          ),
          description: "Adjust spacing between letters (current: " + settings.letterSpacing + "em)"
        },
        {
          name: "Dyslexic Font",
          control: (
            <Switch
              checked={settings.dyslexicFont}
              onChange={handleSettingChange('dyslexicFont')}
              color="primary"
            />
          ),
          description: "Use OpenDyslexic font for better readability"
        }
      ]
    },
    {
      id: 'interaction',
      icon: <Mouse />,
      title: "Interaction",
      features: [
        {
          name: "Keyboard Navigation",
          control: (
            <Switch
              checked={settings.keyboardNavigation}
              onChange={handleSettingChange('keyboardNavigation')}
              color="primary"
            />
          ),
          description: "Enable full keyboard navigation support"
        },
        {
          name: "Reduce Motion",
          control: (
            <Switch
              checked={settings.reduceMotion}
              onChange={handleSettingChange('reduceMotion')}
              color="primary"
            />
          ),
          description: "Disable animations and transitions"
        },
        {
          name: "Click Assist",
          control: (
            <Switch
              checked={settings.clickAssist}
              onChange={handleSettingChange('clickAssist')}
              color="primary"
            />
          ),
          description: "Add visual feedback for clicks"
        }
      ]
    },
    {
      id: 'display',
      icon: <Contrast />,
      title: "Display",
      features: [
        {
          name: "Dark Mode",
          control: (
            <Switch
              checked={settings.darkMode}
              onChange={handleSettingChange('darkMode')}
              color="primary"
            />
          ),
          description: "Switch between light and dark themes"
        },
        {
          name: "Highlight Links",
          control: (
            <Switch
              checked={settings.highlightLinks}
              onChange={handleSettingChange('highlightLinks')}
              color="primary"
            />
          ),
          description: "Add underline to all links"
        },
        {
          name: "Button Contrast",
          control: (
            <Slider
              value={settings.buttonContrast}
              onChange={handleSliderChange('buttonContrast')}
              min={3}
              max={7}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ width: 200 }}
            />
          ),
          description: "Adjust button contrast ratio (current: " + settings.buttonContrast + ":1)"
        }
      ]
    }
  ];

  return (
    <Box sx={{
      background: theme.palette.mode === 'dark' 
        ? 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' 
        : 'radial-gradient(circle at center, #f9f9f9 0%, #e6e6e6 100%)',
      minHeight: '100vh',
      py: 8,
      position: 'relative'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(clubColors.primary, 0.05)} 0%, transparent 70%)`,
        filter: 'blur(30px)',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '5%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(clubColors.secondary, 0.05)} 0%, transparent 70%)`,
        filter: 'blur(30px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={4} sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: theme.palette.background.paper,
            border: '1px solid rgba(255, 0, 153, 0.1)',
            boxShadow: '0 8px 32px rgba(255, 0, 153, 0.05)'
          }}>
            {/* Header */}
            <Box sx={{
              background: clubColors.gradient,
              color: '#fff',
              py: 6,
              px: 4,
              textAlign: 'center',
              position: 'relative'
            }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                  <Box sx={{
                    background: '#fff',
                    color: clubColors.primary,
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: '0 0 8px rgba(0,0,0,0.2)'
                  }}>
                    <Accessibility fontSize="small" />
                  </Box>
                }
              >
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  <Accessibility fontSize="large" />
                </Avatar>
              </Badge>
              <Typography variant="h3" sx={{ 
                fontWeight: 700,
                mb: 1,
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                Accessibility Center
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Customize your club experience to fit your needs
              </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: { xs: 3, md: 6 } }}>
              {/* Navigation Tabs */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                <Grid container spacing={2} sx={{ mb: 6 }}>
                  {accessibilityFeatures.map((section) => (
                    <Grid item xs={6} sm={3} key={section.id}>
                      <Button
                        fullWidth
                        variant={activePanel === section.id ? "contained" : "outlined"}
                        startIcon={section.icon}
                        onClick={() => setActivePanel(section.id)}
                        sx={{
                          py: 2,
                          borderRadius: '8px',
                          borderColor: activePanel === section.id ? 'transparent' : clubColors.primary,
                          background: activePanel === section.id ? clubColors.gradient : 'transparent',
                          color: activePanel === section.id ? '#fff' : clubColors.primary,
                          fontWeight: 600,
                          '&:hover': {
                            background: activePanel === section.id ? clubColors.gradient : alpha(clubColors.primary, 0.1)
                          }
                        }}
                      >
                        {section.title}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>

              {/* Active Panel Content */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                {accessibilityFeatures.map((section) => (
                  activePanel === section.id && (
                    <Box key={section.id}>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 600,
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: clubColors.primary
                      }}>
                        {section.icon}
                        {section.title}
                      </Typography>

                      <Grid container spacing={4}>
                        {section.features.map((feature, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Paper sx={{ 
                              p: 3,
                              height: '100%',
                              borderLeft: `3px solid ${clubColors.primary}`,
                              borderRadius: '0 8px 8px 0'
                            }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1.5
                              }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {feature.name}
                                </Typography>
                                {feature.control}
                              </Box>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {feature.description}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )
                ))}
              </motion.div>

              {/* Quick Presets */}
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  mt: 8,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: clubColors.primary
                }}>
                  <Settings fontSize="large" />
                  Quick Presets
                </Typography>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => {
                        setSettings({
                          ...settings,
                          highContrast: true,
                          fontSize: 18,
                          highlightLinks: true
                        });
                        setActivePanel('vision');
                      }}
                      sx={{
                        py: 2,
                        borderRadius: '8px',
                        borderColor: clubColors.primary,
                        color: clubColors.primary,
                        fontWeight: 600,
                        '&:hover': {
                          background: alpha(clubColors.primary, 0.1)
                        }
                      }}
                    >
                      Vision Assistance
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Keyboard />}
                      onClick={() => {
                        setSettings({
                          ...settings,
                          keyboardNavigation: true,
                          reduceMotion: true,
                          clickAssist: true
                        });
                        setActivePanel('interaction');
                      }}
                      sx={{
                        py: 2,
                        borderRadius: '8px',
                        borderColor: clubColors.primary,
                        color: clubColors.primary,
                        fontWeight: 600,
                        '&:hover': {
                          background: alpha(clubColors.primary, 0.1)
                        }
                      }}
                    >
                      Motor Assistance
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TextFields />}
                      onClick={() => {
                        setSettings({
                          ...settings,
                          dyslexicFont: true,
                          lineHeight: 1.8,
                          letterSpacing: 0.05
                        });
                        setActivePanel('reading');
                      }}
                      sx={{
                        py: 2,
                        borderRadius: '8px',
                        borderColor: clubColors.primary,
                        color: clubColors.primary,
                        fontWeight: 600,
                        '&:hover': {
                          background: alpha(clubColors.primary, 0.1)
                        }
                      }}
                    >
                      Reading Assistance
                    </Button>
                  </Grid>
                </Grid>
              </motion.div>

              <Divider sx={{ 
                my: 6, 
                borderColor: alpha(theme.palette.divider, 0.1),
                borderWidth: '1px'
              }} />

              {/* CTA */}
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  gap: 3
                }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircle />}
                    sx={{
                      background: clubColors.gradient,
                      px: 6,
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      '&:hover': {
                        opacity: 0.9,
                        boxShadow: `0 4px 20px ${alpha(clubColors.primary, 0.3)}`
                      }
                    }}
                  >
                    Apply Settings
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      borderColor: clubColors.primary,
                      color: clubColors.primary,
                      px: 6,
                      borderRadius: '8px',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: clubColors.primary,
                        background: alpha(clubColors.primary, 0.05)
                      }
                    }}
                  >
                    Accessibility Guide
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Accessibility Quick Access Button */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <IconButton
          sx={{
            background: clubColors.gradient,
            color: '#fff',
            width: 64,
            height: 64,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '&:hover': {
              background: clubColors.gradient,
              opacity: 0.9
            }
          }}
        >
          <Accessibility fontSize="large" />
        </IconButton>
      </motion.div>
    </Box>
  );
};

export default AccessibilityPage;