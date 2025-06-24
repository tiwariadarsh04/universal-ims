import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  styled,
  keyframes,
  Avatar,
  alpha,
} from "@mui/material";
import { createNewMember, getNextMemberID } from "../../services/Member";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { 
  Person, 
  Email, 
  Phone, 
  Lock, 
  HowToReg,
  Visibility,
  VisibilityOff,
  Badge,
  ContactPhone,
  CalendarToday,
  Group,
  CheckCircle,
  AccountBalance,
  ArrowBack,
} from "@mui/icons-material";
import { useTheme } from "../../context/ThemeProvider";
import { getComponentBackground } from "../../utils/themeUtils";
import { useNavigate } from "react-router-dom";

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const steps = ['Basic Information', 'Contact Details', 'Account Settings'];

const CreateMemberProfile = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    MemberID: "",
    Name: "",
    Pno: "",
    Contact: "",
    Email: "",
    Password: "",
    MembershipStatus: "active",
    Role: "user",
    MemberType: "permanent",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "MemberID" && { Password: value }),
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleMemberTypeChange = (e) => {
    const memberType = e.target.value;
    setFormData(prev => {
      if (prev.MemberID) {
        const idNumber = prev.MemberID.split('-')[1];
        const newPrefix = memberType === 'permanent' ? 'P' : 'V';
        return {
          ...prev,
          MemberType: memberType,
          MemberID: `${newPrefix}-${idNumber}`,
          Password: `${newPrefix}-${idNumber}`
        };
      }
      return {
        ...prev,
        MemberType: memberType
      };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    switch (step) {
      case 0:
        // Basic Information validation
        if (!formData.MemberID) newErrors.MemberID = "Member ID is required";
        
        if (!formData.Name) {
          newErrors.Name = "Name is required";
        } else if (formData.Name.length < 3) {
          newErrors.Name = "Name must be at least 3 characters";
        } else if (formData.Name.length > 20) {
          newErrors.Name = "Name must be less than 20 characters";
        }
        break;
        
      case 1:
        // Contact Details validation
        if (!formData.Pno) {
          newErrors.Pno = "Personal number is required";
        } else if (formData.Pno.length < 6) {
          newErrors.Pno = "Personal number must be at least 6 characters";
        }
        
        if (!formData.Contact) {
          newErrors.Contact = "Contact number is required";
        } else if (!/^\d+$/.test(formData.Contact)) {
          newErrors.Contact = "Contact must contain only digits";
        } else if (formData.Contact.length !== 10) {
          newErrors.Contact = "Contact must be exactly 10 digits";
        }
        
        if (!formData.Email) {
          newErrors.Email = "Email is required";
        } else if (!emailRegex.test(formData.Email)) {
          newErrors.Email = "Please enter a valid email address";
        }
        break;
        
      case 2:
        // Account Settings validation
        if (!formData.Password) {
          newErrors.Password = "Password is required";
        } else if (formData.Password.length < 6) {
          newErrors.Password = "Password must be at least 6 characters";
        }
        
        if (!formData.MembershipStatus) {
          newErrors.MembershipStatus = "Membership status is required";
        }
        
        if (!formData.Role) {
          newErrors.Role = "Role is required";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current step first
    if (!validateStep(activeStep)) {
      return;
    }
    
    // Only proceed with submission if on final step
    if (activeStep !== steps.length -1) {
      handleNext();
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await createNewMember(formData);
      if (response && response.member) {
        setSnackbar({
          open: true,
          message: "Member profile created successfully!",
          severity: "success"
        });
        setFormData({
          MemberID: "",
          Name: "",
          Pno: "",
          Contact: "",
          Email: "",
          Password: "",
          MembershipStatus: "active",
          Role: "user",
          MemberType: "permanent",
        });
        setActiveStep(0);
        // Get a new member ID after successful submission
        getNextMemberIDData();
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Failed to create member profile",
          severity: "error"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "An error occurred while creating the member profile",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextMemberIDData = async () => {
    setIsLoading(true);
    try {
      const response = await getNextMemberID();
      if(response.success){
        const idNumber = response.memberId.split('-')[1];
        const prefix = formData.MemberType === 'permanent' ? 'P' : 'V';
        setFormData(prev => ({
          ...prev,
          MemberID: `${prefix}-${idNumber}`,
          Password: `${prefix}-${idNumber}`
        }));
      } else {
        setSnackbar({
          open: true,
          message: "Failed to generate member ID",
          severity: "error"
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error generating member ID",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNextMemberIDData();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Member Type</InputLabel>
                <Select
                  name="MemberType"
                  value={formData.MemberType}
                  onChange={handleMemberTypeChange}
                  label="Member Type"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="permanent">Permanent Member</MenuItem>
                  <MenuItem value="visitor">Visitor</MenuItem>
                </Select>
                <FormHelperText>
                  Select whether the member is permanent or a visitor
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Member ID"
                name="MemberID"
                value={formData.MemberID}
                onChange={handleChange}
                error={!!errors.MemberID}
                helperText={errors.MemberID}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Full Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                error={!!errors.Name}
                helperText={errors.Name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Personal Number"
                name="Pno"
                value={formData.Pno}
                onChange={handleChange}
                error={!!errors.Pno}
                helperText={errors.Pno}
                inputProps={{ minLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Contact"
                name="Contact"
                value={formData.Contact}
                onChange={handleChange}
                error={!!errors.Contact}
                helperText={errors.Contact || "Must be 10 digits"}
                inputProps={{ 
                  maxLength: 10,
                  inputMode: 'numeric',
                  pattern: '[0-9]*' 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContactPhone sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                error={!!errors.Email}
                helperText={errors.Email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Password"
                name="Password"
                type={showPassword ? "text" : "password"}
                value={formData.Password}
                onChange={handleChange}
                error={!!errors.Password}
                helperText={errors.Password || "Minimum 6 characters"}
                inputProps={{ minLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.MembershipStatus}>
                <InputLabel>Membership Status</InputLabel>
                <Select
                  name="MembershipStatus"
                  value={formData.MembershipStatus}
                  onChange={handleChange}
                  label="Membership Status"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                {errors.MembershipStatus && (
                  <FormHelperText>{errors.MembershipStatus}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.Role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="Role"
                  value={formData.Role}
                  onChange={handleChange}
                  label="Role"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
                {errors.Role && <FormHelperText>{errors.Role}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3} 
        onClick={() => navigate(-1)}
        alignItems="center" sx={{ mb: 4, cursor:'pointer' }}
        >
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: 24, 
                height: 24,
                olor: 'primary.main',
              }}>
                <ArrowBack sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Back to Member Management
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 2,
        }}>
          Create New Member
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Fill in the details to create a new member profile
        </Typography>
      </Box>

      <StyledPaper sx={{ 
        ...getComponentBackground(isDarkMode),
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 4,
            gap: 2,
          }}>
            <StyledButton
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || isLoading}
              startIcon={<CalendarToday />}
              sx={{ borderRadius: '6px' }}
            >
              Back
            </StyledButton>
            
            {activeStep === steps.length - 1 ? (
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={24} /> : <CheckCircle />}
                sx={{ borderRadius: '6px' }}
              >
                {isLoading ? "Creating..." : "Create Profile"}
              </StyledButton>
            ) : (
              <StyledButton
                variant="contained"
                onClick={handleNext}
                startIcon={<Group />}
                sx={{ borderRadius: '6px' }}
              >
                Next
              </StyledButton>
            )}
          </Box>
        </form>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '6px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateMemberProfile;