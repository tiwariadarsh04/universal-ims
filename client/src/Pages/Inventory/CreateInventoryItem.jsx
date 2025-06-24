import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  FormControlLabel,
  Switch,
  Divider,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  styled,
  keyframes,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { 
  AddCircle, 
  Inventory2, 
  Category, 
  Numbers, 
  Sell, 
  Scale, 
  LocalOffer, 
  Receipt, 
  AccountTree, 
  Payment, 
  Code, 
  Description,
  CheckCircle,
  Close,
  Error,
  ArrowBack,
  ArrowForward,
  Info,
  AttachMoney,
  Storage,
  Tag,
  AccountBalance,
} from '@mui/icons-material';
import { createInventoryItem, fetchNextItemCode } from '../../services/Inventory';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 8,
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.8) 
    : alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    background: theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.default, 0.6)
      : alpha(theme.palette.background.paper, 0.8),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 6,
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));


const RequiredLabel = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: theme.spacing(0.5),
}));

const InfoTooltip = styled(Tooltip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const ValidationMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.75rem',
  marginTop: theme.spacing(0.5),
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  '& .MuiStepLabel-labelContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  }
}));

const SectionDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
}));

const steps = [
  { 
    label: 'Basic Information',
    description: 'Enter the basic details of the inventory item',
    icon: <Inventory2 />
  },
  { 
    label: 'Pricing Details',
    description: 'Set the pricing and quantity information',
    icon: <Sell />
  },
  { 
    label: 'Tax & Accounting',
    description: 'Configure tax and accounting details',
    icon: <Receipt />
  }
];

const getNextItemCode = async () => {
    let newItemCode = await fetchNextItemCode();
    let nextItemCode = newItemCode.data;
  return nextItemCode
};

const InventoryCreationForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      ItemGroup: '',
      ItemName: '',
      ItemSubGroup: '',
      Rate: '',
      IssueRate: '',
      UnitQty: '',
      IssueUnitqty: '',
      hsnid: '',
      Saletaxcode: '',
      gstPercentage: 0
    }
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGstApplicable, setIsGstApplicable] = useState(false);
  const [nextItemCode, setNextItemCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Watch form values for validation
  const formData = watch();

  // Item group options
  const itemGroups = [
    { value: 3, label: 'Bar - Alcohol' },
    { value: 5, label: 'Kitchen' },
    { value: 6, label: 'Snacks' },
    { value: 54, label: 'Others' }
  ];

  useEffect(() => {
    const fetchNextValues = async () => {
      try {
        const code = await getNextItemCode();
        setNextItemCode(code);
        setValue('ItemCode', code);
        setValue('ItemAliasCode', code.toString());
        setValue('tally_acc_saleid', '11577');
        setValue('tally_acc_purchaseid', '11577');
        setLoading(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error fetching next values',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchNextValues();
  }, [setValue]);

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 0:
        if (!formData.ItemName?.trim()) {
          errors.ItemName = 'Item Name is required';
        } else if (formData.ItemName.trim().length < 3) {
          errors.ItemName = 'Item Name must be at least 3 characters';
        }
        if (!formData.ItemGroup) {
          errors.ItemGroup = 'Item Group is required';
        }
        if (!formData.ItemSubGroup?.trim()) {
          errors.ItemSubGroup = 'Item Sub Group is required';
        }
        break;
      case 1:
        if (!formData.Rate || isNaN(formData.Rate) || formData.Rate <= 0) {
          errors.Rate = 'Valid Rate is required';
        }
        if (!formData.IssueRate || isNaN(formData.IssueRate) || formData.IssueRate <= 0) {
          errors.IssueRate = 'Valid Issue Rate is required';
        }
        if (!formData.UnitQty || isNaN(formData.UnitQty) || formData.UnitQty <= 0) {
          errors.UnitQty = 'Valid Unit Quantity is required';
        }
        if (!formData.IssueUnitqty || isNaN(formData.IssueUnitqty) || formData.IssueUnitqty <= 0) {
          errors.IssueUnitqty = 'Valid Issue Unit Quantity is required';
        }
        break;
      case 2:
        if (!formData.hsnid?.trim()) {
          errors.hsnid = 'HSN ID is required';
        }
        if (!formData.Saletaxcode?.trim()) {
          errors.Saletaxcode = 'Sale Tax Code is required';
        }
        if (isGstApplicable && (!formData.gstPercentage || isNaN(formData.gstPercentage) || formData.gstPercentage <= 0)) {
          errors.gstPercentage = 'Valid GST Percentage is required';
        }
        break;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly',
        severity: 'error'
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (!validateStep(activeStep)) {
        setSnackbar({
          open: true,
          message: 'Please fix the validation errors before submitting',
          severity: 'error'
        });
        return;
      }

      const res = await createInventoryItem(data);
      if (!res.success || res.error) {
        throw new Error(res?.message || res?.error || 'Failed to create inventory item');
      }

      setIsSuccess(true);
      setDialogTitle('Success');
      setDialogMessage(res.message || 'Inventory item created successfully!');
      setOpenDialog(true);

      try {
        const newCode = await getNextItemCode();
        reset({
          ...getDefaultValues(newCode),
          ItemName: '',
          Rate: '',
          IssueRate: '',
          ItemGroup: data.ItemGroup,
          ItemSubGroup: data.ItemSubGroup
        });
        setNextItemCode(newCode);
        setActiveStep(0);
      } catch (codeError) {
        setSnackbar({
          open: true,
          message: 'Error getting next item code',
          severity: 'error'
        });
      }
    } catch (error) {
      setIsSuccess(false);
      setDialogTitle('Error');
      setDialogMessage(error.message || 'Error creating inventory item');
      setOpenDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultValues = (nextCode) => ({
    ItemCode: nextCode,
    ItemAliasCode: nextCode.toString(),
    tally_acc_saleid: '11577',
    tally_acc_purchaseid: '11577',
    isgstapplicable: false,
    gstPercentage: 0,
    UnitQty: '',
    IssueUnitqty: '',
    capacity: '',
    Saletaxcode: '',
    hsnid: '',
    PartySaleRate: ''
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGstToggle = (e) => {
    setIsGstApplicable(e.target.checked);
    if (!e.target.checked) {
      setValue('gstPercentage', 0);
    }
  };

  const renderStepContent = (step) => {
    const currentStep = steps[step];
    return (
      <Box>
        <SectionTitle variant="h6">
          {currentStep.icon}
          {currentStep.label}
          <InfoTooltip title={currentStep.description}>
            <Info fontSize="small" />
          </InfoTooltip>
        </SectionTitle>
        <SectionDescription>
          {currentStep.description}
        </SectionDescription>
        <Divider sx={{ mb: 3 }} />
        
        {step === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Item Code"
                variant="outlined"
                value={nextItemCode || ''}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('ItemCode')}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <StyledTextField
                fullWidth
                label={
                  <>
                    Item Name
                    <RequiredLabel>*</RequiredLabel>
                  </>
                }
                variant="outlined"
                {...register('ItemName', { 
                  required: 'Item Name is required',
                  minLength: {
                    value: 3,
                    message: 'Item Name must be at least 3 characters'
                  }
                })}
                error={!!errors.ItemName || !!formErrors.ItemName}
                helperText={errors.ItemName?.message || formErrors.ItemName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.ItemGroup || !!formErrors.ItemGroup}>
                <InputLabel id="item-group-label">
                  <>
                    Item Group
                    <RequiredLabel>*</RequiredLabel>
                  </>
                </InputLabel>
                <Select
                  labelId="item-group-label"
                  label="Item Group"
                  {...register('ItemGroup', { 
                    required: 'Item Group is required',
                    validate: value => value !== '' || 'Please select an item group'
                  })}
                  defaultValue=""
                  sx={{
                    borderRadius: 6,
                    background: theme => theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.default, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                    '&:hover': {
                      background: theme => theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.default, 0.8)
                        : alpha(theme.palette.background.paper, 0.9),
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select an item group</em>
                  </MenuItem>
                  {itemGroups.map((group) => (
                    <MenuItem key={group.value} value={group.value}>
                      {group.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.ItemGroup && (
                  <ValidationMessage>{formErrors.ItemGroup}</ValidationMessage>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label={
                  <>
                    Item Sub Group
                    <RequiredLabel>*</RequiredLabel>
                  </>
                }
                variant="outlined"
                {...register('ItemSubGroup', { required: 'Item Sub Group is required' })}
                error={!!errors.ItemSubGroup || !!formErrors.ItemSubGroup}
                helperText={errors.ItemSubGroup?.message || formErrors.ItemSubGroup}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountTree color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Item Alias Code"
                variant="outlined"
                value={nextItemCode || ''}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Code color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('ItemAliasCode')}
              />
            </Grid>
          </Grid>
        )}
        
        {step === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Cost Price"
                variant="outlined"
                type="number"
                {...register('Rate', { 
                  required: 'Cost Price is required',
                  min: { value: 0, message: 'Cost Price must be positive' }
                })}
                error={!!errors.Rate}
                helperText={errors.Rate?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Selling Price"
                variant="outlined"
                type="number"
                {...register('IssueRate', { 
                  required: 'Selling Price is required',
                  min: { value: 0, message: 'Selling Price must be positive' }
                })}
                error={!!errors.IssueRate}
                helperText={errors.IssueRate?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOffer color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Party Sale Rate"
                variant="outlined"
                type="number"
                {...register('PartySaleRate')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Payment color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Unit Quantity"
                variant="outlined"
                type="number"
                {...register('UnitQty', { 
                  required: 'Unit Quantity is required',
                  min: { value: 0, message: 'Quantity must be positive' }
                })}
                error={!!errors.UnitQty}
                helperText={errors.UnitQty?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Storage color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Issue Unit Quantity"
                variant="outlined"
                type="number"
                {...register('IssueUnitqty', { 
                  required: 'Issue Unit Quantity is required',
                  min: { value: 0, message: 'Quantity must be positive' }
                })}
                error={!!errors.IssueUnitqty}
                helperText={errors.IssueUnitqty?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Storage color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Capacity"
                variant="outlined"
                type="number"
                {...register('capacity')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Scale color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        )}
        
        {step === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="HSN ID"
                variant="outlined"
                {...register('hsnid', { required: 'HSN ID is required' })}
                error={!!errors.hsnid}
                helperText={errors.hsnid?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Sale Tax Code"
                variant="outlined"
                {...register('Saletaxcode', { required: 'Sale Tax Code is required' })}
                error={!!errors.Saletaxcode}
                helperText={errors.Saletaxcode?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Receipt color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={isGstApplicable} 
                    onChange={handleGstToggle}
                    color="primary"
                  />
                }
                label="GST Applicable"
                sx={{ color: theme => theme.palette.text.primary }}
              />
              
              {isGstApplicable && (
                <StyledTextField
                  fullWidth
                  label="GST Percentage"
                  variant="outlined"
                  type="number"
                  sx={{ mt: 1 }}
                  {...register('gstPercentage')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalance color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2">%</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Tally Sale Account ID"
                variant="outlined"
                value="11577"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Payment color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('tally_acc_saleid')}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Tally Purchase Account ID"
                variant="outlined"
                value="11577"
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Payment color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register('tally_acc_purchaseid')}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading form data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 3, mb: 12 }}>
      <Typography variant="body1" gutterBottom 
      onClick={() => navigate(-1)}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        color: 'primary.main',
        cursor: 'pointer'
      }}>
      <ArrowBack color="primary" sx={{ fontSize: '1.2rem', mr: 0.5 }} />
        back to inventory
      </Typography>
      
      <StyledPaper>
        <Typography variant="h5" sx={{ mb: 3, color: theme => theme.palette.text.primary }}>
          Create New Inventory Item
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label} sx={{ 
              '& .MuiStepLabel-root .Mui-completed': {
                color: theme => theme.palette.primary.main,
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: theme => theme.palette.primary.main,
              }
            }}>
              <StyledStepLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {step.icon}
                  {step.label}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {step.description}
                </Typography>
              </StyledStepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              disabled={activeStep === 0 || isSubmitting}
              startIcon={<ArrowBack />}
              sx={{
                color: theme => theme.palette.mode === 'dark' 
                  ? theme.palette.text.primary 
                  : undefined
              }}
            >
              Back
            </StyledButton>
            
            {activeStep === steps.length - 1 ? (
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={24} /> : <CheckCircle />}
              >
                {isSubmitting ? 'Creating...' : 'Create Inventory Item'}
              </StyledButton>
            ) : (
              <StyledButton
                variant="contained"
                onClick={handleNext}
                disabled={isSubmitting}
                startIcon={<ArrowForward />}
              >
                Next
              </StyledButton>
            )}
          </Box>
        </form>
      </StyledPaper>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: theme => theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: theme => theme.palette.text.primary
        }}>
          {isSuccess ? (
            <CheckCircle color="success" sx={{ mr: 1 }} />
          ) : (
            <Error color="error" sx={{ mr: 1 }} />
          )}
          {dialogTitle}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: theme => theme.palette.text.secondary }}>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="primary"
            variant="contained"
            autoFocus
            sx={{ borderRadius: 6 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 4 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryCreationForm;