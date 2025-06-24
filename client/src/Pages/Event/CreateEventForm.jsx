import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip,
  Fade,
  Zoom,
  useTheme,
  alpha
} from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  Event as EventIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Schedule as TimeIcon,
  LocationOn as VenueIcon,
  Link as LinkIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  NavigateBefore,
  NavigateNext,
  ArrowBack as ArrowBackIcon,
  PlaylistAddCheck as EventListIcon
} from '@mui/icons-material';
import { createNewEvent, updateEvent } from '../../services/Event';

const CreateEventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [formData, setFormData] = useState({
    EventName: '',
    EventDescription: '',
    EventDate: null,
    EventTime: null,
    EventVenues: '',
    LinkToRegister: '',
    EventPoster: null,
    ExistingPosterURL: '',
    PreviewURL: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);

  const steps = [
    {
      label: 'Event Details',
      icon: <EventIcon />,
      description: 'Provide basic information about your event'
    },
    {
      label: 'Date & Time',
      icon: <CalendarIcon />,
      description: 'When will your event take place?'
    },
    {
      label: 'Location & Links',
      icon: <VenueIcon />,
      description: 'Where is your event and how can people register?'
    },
    {
      label: 'Event Poster',
      icon: <PhotoCameraIcon />,
      description: 'Add a visual representation for your event'
    }
  ];

  // Initialize form based on navigation state
  useEffect(() => {
    if (location.state?.isEdit && location.state.event) {
      setIsEditMode(true);
      setEventId(location.state.event._id);

      const parseDate = (dateString) => {
        if (!dateString) return null;
        try {
          if (typeof dateString === 'string' && dateString.includes('T')) {
            return dayjs(dateString);
          }
          return dayjs(new Date(dateString));
        } catch (e) {
          console.error('Error parsing date:', dateString, e);
          return null;
        }
      };

      setFormData({
        EventName: location.state.event.EventName || '',
        EventDescription: location.state.event.EventDescription || '',
        EventDate: parseDate(location.state.event.EventDate),
        EventTime: parseDate(location.state.event.EventTime),
        EventVenues: location.state.event.EventVenues || '',
        LinkToRegister: location.state.event.LinkToRegister || '',
        EventPoster: null,
        ExistingPosterURL: location.state.event.EventPoster
          ? `${import.meta.env.VITE_APP_POSTER_URL}/${location.state.event.EventPoster}`
          : '',
        PreviewURL: null
      });
    } else {
      setIsEditMode(false);
      setEventId(null);
      setFormData({
        EventName: '',
        EventDescription: '',
        EventDate: null,
        EventTime: null,
        EventVenues: '',
        LinkToRegister: '',
        EventPoster: null,
        ExistingPosterURL: '',
        PreviewURL: null
      });
    }
  }, [location.state]);

  // Check if all steps are completed for direct submission
  useEffect(() => {
    const checkAllStepsValid = () => {
      for (let i = 0; i < steps.length; i++) {
        if (validateStep(i)) {
          return false;
        }
      }
      return true;
    };
    
    setAllStepsCompleted(checkAllStepsValid());
  }, [formData]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (formData.EventPoster) {
        URL.revokeObjectURL(formData.EventPoster);
      }
      if (formData.PreviewURL) {
        URL.revokeObjectURL(formData.PreviewURL);
      }
    };
  }, [formData.EventPoster, formData.PreviewURL]);

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({...prev, EventDate: newValue}));
  };

  const handleTimeChange = (newValue) => {
    setFormData((prev) => ({...prev, EventTime: newValue}));
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB.');
      return;
    }

    // Clean up previous preview URL
    if (formData.PreviewURL) {
      URL.revokeObjectURL(formData.PreviewURL);
    }

    setFormData((prev) => ({
      ...prev,
      EventPoster: file,
      ExistingPosterURL: '', // Clear existing poster URL if new one is chosen
      PreviewURL: URL.createObjectURL(file)
    }));
  }, [formData.PreviewURL]);

  const validateStep = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        if (!formData.EventName.trim()) {
          return 'Event Name is required.';
        }
        if (!formData.EventDescription.trim()) {
          return 'Event Description is required.';
        }
        break;
      case 1:
        if (!formData.EventDate) {
          return 'Event Date is required.';
        }
        if (!formData.EventTime) {
          return 'Event Time is required.';
        }
        if (formData.EventDate && formData.EventDate.isBefore(dayjs(), 'day') && !isEditMode) {
          return 'Event Date cannot be in the past.';
        }
        break;
      case 2:
        // Optional fields, no validation needed by default
        break;
      case 3:
        // Optional poster field, no validation needed by default
        break;
      default:
        break;
    }
    return null; // Valid step
  };

  const handleNext = () => {
    const stepError = validateStep(activeStep);
    if (stepError) {
      setError(stepError);
    } else {
      setError(null); // Clear error if valid
      const newCompleted = { ...completed };
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      
      // If we're at the last step, just mark it as completed
      if (activeStep === steps.length - 1) {
        setActiveStep(steps.length);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null); // Clear errors when going back
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null); // Clear previous errors

    // Validate all steps again
    for (let i = 0; i <= steps.length; i++) {
      const stepError = validateStep(i);
      if (stepError) {
        setError(`Please fix the error in Step ${i + 1}: ${stepError}`);
        setActiveStep(i); // Go to the step with the error
        return;
      }
    }

    // Proceed if all steps are valid
    setIsLoading(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('EventName', formData.EventName.trim());
      formPayload.append('EventDescription', formData.EventDescription.trim());
      
      // Only add venue and registration link if they have values
      if (formData.EventVenues.trim()) {
        formPayload.append('EventVenues', formData.EventVenues.trim());
      }
      
      if (formData.LinkToRegister.trim()) {
        formPayload.append('LinkToRegister', formData.LinkToRegister.trim());
      }
      
      // Date and time are required and already validated
      formPayload.append('EventDate', formData.EventDate.format('YYYY-MM-DD'));
      formPayload.append('EventTime', formData.EventTime.format('HH:mm'));
      
      // Add poster if provided
      if (formData.EventPoster) {
        formPayload.append('EventPoster', formData.EventPoster);
      }

      // Call the appropriate API function
      const response = isEditMode
        ? await updateEvent(eventId, formPayload)
        : await createNewEvent(formPayload);

      // Improved error handling
      if (!response) {
        throw new Error('No response received from the server');
      }
      
      if (response.error || response.errors || !response.success) {
        const apiError = response.message || response.error || 
          (response.errors ? Object.values(response.errors).join(', ') : 'An unknown API error occurred.');
        throw new Error(apiError);
      }

      // Success case
      setSuccessMessage(isEditMode ? 'Event updated successfully!' : 'Event created successfully!');
      setSuccessDialogOpen(true);

    } catch (err) {
      console.error('Submission Error:', err);
      
      // More descriptive error message
      let errorMessage = 'An unexpected error occurred during submission.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(`Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    setIsLoading(false); // Stop loading after dialog is closed
    navigate('/event-management'); // Or wherever you want to redirect
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  // Render the active step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    name="EventName"
                    value={formData.EventName}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <EventIcon sx={{ color: 'inherit', mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Description"
                    name="EventDescription"
                    value={formData.EventDescription}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ color: 'inherit', mr: 1 }} />,
                    }}
                    helperText="Provide a detailed description of your event"
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Event Date"
                      value={formData.EventDate}
                      onChange={handleDateChange}
                      minDate={!isEditMode ? dayjs() : undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          variant: "outlined",
                          InputProps: {
                            startAdornment: <CalendarIcon sx={{ color: 'inherit', mr: 1 }} />,
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Event Time"
                      value={formData.EventTime}
                      onChange={handleTimeChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          variant: "outlined",
                          InputProps: {
                            startAdornment: <TimeIcon sx={{ color: 'inherit', mr: 1 }} />,
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.background.default, 0.6), mt: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        Date & Time Preview
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        {formData.EventDate ? (
                          <Chip 
                            icon={<CalendarIcon />} 
                            label={formData.EventDate.format('MMM D, YYYY')} 
                            color="default" 
                            variant="outlined"
                          />
                        ) : (
                          <Chip icon={<CalendarIcon />} label="No date selected" variant="outlined" disabled />
                        )}
                        
                        {formData.EventTime ? (
                          <Chip 
                            icon={<TimeIcon />} 
                            label={formData.EventTime.format('h:mm A')} 
                            color="default" 
                            variant="outlined"
                          />
                        ) : (
                          <Chip icon={<TimeIcon />} label="No time selected" variant="outlined" disabled />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Venue"
                    name="EventVenues"
                    value={formData.EventVenues}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <VenueIcon sx={{ color: 'inherit', mr: 1 }} />,
                    }}
                    helperText="Where will this event take place?"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Registration Link"
                    name="LinkToRegister"
                    value={formData.LinkToRegister}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ color: 'inherit', mr: 1 }} />,
                    }}
                    helperText="Add a link for participants to register (optional)"
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 3:
        return (
          <Fade in={activeStep === 3} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', borderStyle: 'dashed' }}>
                    <input
                      accept="image/*"
                      id="event-poster-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {!formData.EventPoster && !formData.ExistingPosterURL ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700] }}>
                          <PhotoCameraIcon sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
                        </Avatar>
                        <Typography variant="body1" gutterBottom>
                          {isEditMode ? 'Change the event poster' : 'Add an event poster (optional)'}
                        </Typography>
                        <label htmlFor="event-poster-upload">
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<PhotoCameraIcon />}
                          >
                            {isEditMode ? 'Change Poster' : 'Upload Poster'}
                          </Button>
                        </label>
                      </Box>
                    ) : (
                      <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                        <img
                          src={formData.EventPoster ? URL.createObjectURL(formData.EventPoster) : formData.ExistingPosterURL}
                          alt="Event Poster"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px',
                            borderRadius: '8px',
                            boxShadow: theme.shadows[1]
                          }}
                        />
                        <Box sx={{ mt: 2 }}>
                          <label htmlFor="event-poster-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<PhotoCameraIcon />}
                              sx={{ mr: 2 }}
                            >
                              Change Poster
                            </Button>
                          </label>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setFormData(prev => ({ ...prev, EventPoster: null, ExistingPosterURL: '', PreviewURL: null }))}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Card>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Maximum file size: 5MB. Recommended dimensions: 1200 x 630 pixels.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          minHeight: '75vh',
        }}
      >
        {/* Header */}
        <Box 
          sx={{
            bgcolor: theme.palette.primary.main,
            p: 3,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit"
              onClick={() => navigate('/event-management')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </Typography>
          </Box>
          <IconButton 
            color="inherit"
            onClick={() => navigate('/event-management')}
            title="View All Events"
          >
            <EventListIcon />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Zoom in={!!error}>
            <Alert 
              severity="error" 
              sx={{ m: 2 }} 
              onClose={() => setError(null)}
              variant="filled"
            >
              {error}
            </Alert>
          </Zoom>
        )}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '65vh' }}>
          {/* Left side - Stepper */}
          <Box sx={{ 
            width: { xs: '100%', md: '280px' }, 
            bgcolor: alpha(theme.palette.background.default, 0.5), 
            borderRight: { xs: 'none', md: '1px solid' },
            borderColor: 'divider',
            borderBottom: { xs: '1px solid', md: 'none' },
            p: 3
          }}>
            <Stepper 
              activeStep={activeStep} 
              orientation="vertical"
              nonLinear
            >
              {steps.map((step, index) => (
                <Step key={step.label} completed={completed[index]}>
                  <StepLabel 
                    onClick={() => {
                      // Allow jumping between steps if current step is valid
                      if (!validateStep(activeStep)) {
                        setActiveStep(index);
                      } else if (completed[activeStep]) {
                        setActiveStep(index);
                      }
                    }}
                    sx={{ cursor: 'pointer' }}
                    StepIconComponent={() => (
                      <Avatar 
                        sx={{ 
                          width: 35, 
                          height: 35, 
                          bgcolor: activeStep === index 
                            ? theme.palette.primary.main 
                            : completed[index] 
                              ? theme.palette.success.main 
                              : theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
                          transform: activeStep === index ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {completed[index] ? <CheckCircleIcon /> : step.icon}
                      </Avatar>
                    )}
                  >
                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        fontWeight: activeStep === index ? 'bold' : 'regular',
                        color: activeStep === index ? theme.palette.text.primary : theme.palette.text.secondary,
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length && (
              <Fade in={activeStep === steps.length}>
                <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    All steps completed
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Your event is ready to be {isEditMode ? 'updated' : 'created'}!
                  </Typography>
                  <Button
                    onClick={handleReset}
                    variant="outlined"
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Start Over
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>

          {/* Right side - Form content */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              flexGrow: 1, 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Step content */}
            <Box>
              {activeStep === steps.length ? (
                <Fade in={activeStep === steps.length} timeout={500}>
                  <Box>
                    <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
                      Event Summary
                    </Typography>
                    
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>{formData.EventName}</Typography>
                            <Divider sx={{ mb: 2 }} />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Date & Time:</Typography>
                            <Typography variant="body2">
                              {formData.EventDate?.format('MMMM D, YYYY')} at {formData.EventTime?.format('h:mm A')}
                            </Typography>
                          </Grid>
                          
                          {formData.EventVenues && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">Location:</Typography>
                              <Typography variant="body2">{formData.EventVenues}</Typography>
                            </Grid>
                          )}
                          
                          {formData.LinkToRegister && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary">Registration Link:</Typography>
                              <Typography variant="body2" component="a" href={formData.LinkToRegister} target="_blank" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                                {formData.LinkToRegister}
                              </Typography>
                            </Grid>
                          )}
                          
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                            <Typography variant="body2">{formData.EventDescription}</Typography>
                          </Grid>
                          
                          {(formData.EventPoster || formData.ExistingPosterURL) && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Event Poster:</Typography>
                              <img
                                src={formData.EventPoster ? URL.createObjectURL(formData.EventPoster) : formData.ExistingPosterURL}
                                alt="Event Poster"
                                style={{ 
                                  maxWidth: '100%', 
                                  maxHeight: '200px',
                                  borderRadius: '4px'
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>

                    <Alert severity="info" sx={{ mb: 3 }}>
                      Please review your event details above before submitting.
                    </Alert>
                  </Box>
                </Fade>
              ) : (
                renderStepContent(activeStep)
              )}
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3, mt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                startIcon={<NavigateBefore />}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isEditMode ? <SaveIcon /> : <EventIcon />}
                  disabled={isLoading || !allStepsCompleted}
                  onClick={handleSubmit}
                  sx={{ 
                    py: 1.2, 
                    px: 4,
                    borderRadius: theme.shape.borderRadius
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Event' : 'Create Event'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant={validateStep(activeStep) ? "outlined" : "contained"}
                  color="primary"
                  endIcon={<NavigateNext />}
                  disabled={!!validateStep(activeStep)}
                  sx={{ 
                    py: 1.2, 
                    borderRadius: theme.shape.borderRadius
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Review' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            minWidth: '400px',
            padding: '20px',
            borderRadius: theme.shape.borderRadius
          }
        }}
        TransitionComponent={Zoom}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: theme.palette.success.main, width: 60, height: 60 }}>
            <CheckCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Box>
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          {isEditMode ? 'Event Updated' : 'Event Created'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center' }}>
            {successMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleSuccessDialogClose} 
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4 }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateEventForm;