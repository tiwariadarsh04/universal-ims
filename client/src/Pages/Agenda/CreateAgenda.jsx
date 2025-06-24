import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Chip, 
  IconButton, 
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormHelperText,
} from '@mui/material';
import { 
  Event, 
  Schedule, 
  Person, 
  Email, 
  Notes, 
  Cake, 
  Groups, 
  School, 
  SportsSoccer, 
  MusicNote, 
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const eventTypes = [
  { value: 'Birthday Party', label: 'Birthday Party', icon: <Cake color="secondary" /> },
  { value: 'Team Meeting', label: 'Team Meeting', icon: <Groups color="info" /> },
  { value: 'Workshop', label: 'Workshop', icon: <School color="action" /> },
  { value: 'Sports Event', label: 'Sports Event', icon: <SportsSoccer color="success" /> },
  { value: 'Music Session', label: 'Music Session', icon: <MusicNote color="warning" /> },
  { value: 'Other', label: 'Other', icon: <Event color="primary" /> }
];

const CreateAgenda = ({ onClose, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    event: '',
    eventType: '',
    bookedBy: '',
    contact: '',
    date: dayjs(),
    startTime: dayjs().add(1, 'hour'),
    endTime: dayjs().add(2, 'hour'),
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  const steps = ['Event Details', 'Date & Time', 'Review'];

  useEffect(() => {
    if (activeStep === 1 && formData.date) {
      // Mock data for demonstration
      const mockSlots = [
        '09:00 - 10:00',
        '10:30 - 11:30',
        '12:00 - 13:00',
        '14:00 - 15:00',
        '15:30 - 16:30',
        '17:00 - 18:00'
      ];
      setAvailableSlots(mockSlots);
    }
  }, [activeStep, formData.date]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    setFormData(prev => ({ ...prev, date: newValue }));
  };

  const handleTimeChange = (time, field) => {
    setFormData(prev => ({ ...prev, [field]: time }));
    
    // Auto-set end time when start time changes (1 hour duration)
    if (field === 'startTime') {
      setFormData(prev => ({ ...prev, endTime: time.add(1, 'hour') }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.event) newErrors.event = 'Event name is required';
      if (!formData.eventType) newErrors.eventType = 'Event type is required';
      if (!formData.bookedBy) newErrors.bookedBy = 'Your name is required';
      if (!formData.contact) newErrors.contact = 'Contact email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact)) {
        newErrors.contact = 'Invalid email address';
      }
    }
    
    if (step === 1) {
      if (!formData.date) newErrors.date = 'Date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
      if (!formData.endTime) newErrors.endTime = 'End time is required';
      else if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepNext = () => {
    if (validateStep(activeStep)) {
      handleNext();
    }
  };

  const handleSubmit = () => {

    const bookingData = {
      event: formData.event,
      eventType: formData.eventType,
      bookedBy: formData.bookedBy,
      contact: formData.contact,
      date: formData.date.toISOString(), // Convert to ISO string
      startTime: formData.startTime.toISOString(), // Convert to ISO string
      endTime: formData.endTime.toISOString(), // Convert to ISO string
      timing: `${formData.startTime.format('HH:mm')} - ${formData.endTime.format('HH:mm')}`,
      notes: formData.notes
    };

    onSubmit(bookingData);
  };


  

  const getEventIcon = (eventType) => {
    const event = eventTypes.find(e => e.value === eventType);
    return event ? event.icon : <Event color="primary" />;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          New Booking
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Divider sx={{ mb: 3 }} />
      
      {activeStep === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Event Name"
              name="event"
              value={formData.event}
              onChange={handleChange}
              error={!!errors.event}
              helperText={errors.event}
              InputProps={{
                startAdornment: (
                  <Event color="action" sx={{ mr: 1 }} />
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.eventType}>
              <InputLabel>Event Type</InputLabel>
              <Select
                label="Event Type"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                startAdornment={
                  <Event color="action" sx={{ mr: 1 }} />
                }
                renderValue={(selected) => (
                  <Box display="flex" alignItems="center">
                    {getEventIcon(selected)}
                    <Typography sx={{ ml: 1 }}>{selected}</Typography>
                  </Box>
                )}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center">
                      {type.icon}
                      <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.eventType && <FormHelperText>{errors.eventType}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Your Name"
              name="bookedBy"
              value={formData.bookedBy}
              onChange={handleChange}
              error={!!errors.bookedBy}
              helperText={errors.bookedBy}
              InputProps={{
                startAdornment: (
                  <Person color="action" sx={{ mr: 1 }} />
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Email"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              error={!!errors.contact}
              helperText={errors.contact}
              InputProps={{
                startAdornment: (
                  <Email color="action" sx={{ mr: 1 }} />
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <Notes color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />
                )
              }}
            />
          </Grid>
        </Grid>
      )}
      
      {activeStep === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Event Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    error={!!errors.date}
                    helperText={errors.date}
                  />
                )}
                minDate={dayjs()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(newValue) => handleTimeChange(newValue, 'startTime')}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    error={!!errors.startTime}
                    helperText={errors.startTime}
                  />
                )}
                minTime={dayjs().set('hour', 8).set('minute', 0)} // 8 AM
                maxTime={dayjs().set('hour', 21).set('minute', 0)} // 9 PM
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="End Time"
                value={formData.endTime}
                onChange={(newValue) => handleTimeChange(newValue, 'endTime')}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    error={!!errors.endTime}
                    helperText={errors.endTime}
                  />
                )}
                minTime={formData.startTime?.add(30, 'minute')}
                maxTime={dayjs().set('hour', 22).set('minute', 0)} // 10 PM
              />
            </LocalizationProvider>
          </Grid>
          
          {availableSlots.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Available Time Slots:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {availableSlots.map((slot, index) => (
                  <Chip
                    key={index}
                    label={slot}
                    onClick={() => {
                      const [start, end] = slot.split(' - ');
                      const [startHour, startMinute] = start.split(':').map(Number);
                      const [endHour, endMinute] = end.split(':').map(Number);
                      
                      const newDate = formData.date
                        .set('hour', startHour)
                        .set('minute', startMinute)
                        .set('second', 0);
                      const endTime = formData.date
                        .set('hour', endHour)
                        .set('minute', endMinute)
                        .set('second', 0);
                      
                      setFormData(prev => ({
                        ...prev,
                        startTime: newDate,
                        endTime
                      }));
                    }}
                    color={
                      slot === `${formData.startTime.format('HH:mm')} - ${formData.endTime.format('HH:mm')}` 
                        ? 'primary' 
                        : 'default'
                    }
                    variant={
                      slot === `${formData.startTime.format('HH:mm')} - ${formData.endTime.format('HH:mm')}` 
                        ? 'filled' 
                        : 'outlined'
                    }
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
      
      {activeStep === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Review Your Booking
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <Box display="flex" alignItems="center">
                {getEventIcon(formData.eventType)}
                <Box ml={1}>
                  {formData.event || 'Untitled Event'}
                  <Typography variant="body2" color="text.secondary">
                    {formData.eventType}
                  </Typography>
                </Box>
              </Box>
            </Typography>
            
            <Box display="flex" alignItems="center" mb={1}>
              <Person color="action" sx={{ mr: 1 }} />
              <Typography>{formData.bookedBy}</Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={1}>
              <Email color="action" sx={{ mr: 1 }} />
              <Typography>{formData.contact}</Typography>
            </Box>
            
            {formData.notes && (
              <Box display="flex" alignItems="flex-start" mb={1}>
                <Notes color="action" sx={{ mr: 1, mt: 0.5 }} />
                <Typography>{formData.notes}</Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <Event color="action" sx={{ mr: 1 }} />
              <Typography>
                {formData.date && formData.date.format('MMMM D, YYYY')}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={1}>
              <Schedule color="action" sx={{ mr: 1 }} />
              <Typography>
                {formData.startTime && formData.startTime.format('h:mm a')} - {' '}
                {formData.endTime && formData.endTime.format('h:mm a')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
      
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? onClose : handleBack}
          startIcon={<ArrowBack />}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleStepNext}
          endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
        >
          {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateAgenda;