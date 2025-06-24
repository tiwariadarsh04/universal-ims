import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Fingerprint,
  Face,
  Security,
  CheckCircle,
  Error,
  Videocam,
  VideocamOff
} from '@mui/icons-material';
import axios from 'axios';

const steps = ['Select Method', 'Register Device', 'Complete Setup'];

const BiometricRegistrationModal = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setActiveStep(1);
    if (method === 'face') {
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      if (selectedMethod === 'fingerprint') {
        // Use WebAuthn for fingerprint registration
        const publicKeyOptions = {
          challenge: new Uint8Array(32), // This should come from your server
          rp: {
            name: "NOA Club",
            id: window.location.hostname
          },
          user: {
            id: new Uint8Array(16), // This should be the user's ID
            name: "User",
            displayName: "User"
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 } // RS256
          ],
          timeout: 60000,
          attestation: "direct",
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false
          }
        };

        const credential = await navigator.credentials.create({
          publicKey: publicKeyOptions
        });

        // Send the credential to your server
        const response = await axios.post('https://noaims.onrender.com/api/v1/biometric/register', {
          biometricType: 'fingerprint',
          credential: credential
        });

        if (response.data.success) {
          setSuccess(true);
          setActiveStep(2);
          onSuccess();
        }
      } else if (selectedMethod === 'face') {
        // Capture face image from video stream
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0);
          
          // Convert canvas to blob
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
          
          // Create form data
          const formData = new FormData();
          formData.append('biometricType', 'face');
          formData.append('faceImage', blob, 'face.jpg');

          // Send to server
          const response = await axios.post('/biometric/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.success) {
            setSuccess(true);
            setActiveStep(2);
            onSuccess();
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register biometric');
    } finally {
      setLoading(false);
      if (selectedMethod === 'face') {
        stopCamera();
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      stopCamera();
      onClose();
      setActiveStep(0);
      setSelectedMethod(null);
      setError(null);
      setSuccess(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choose your preferred biometric authentication method:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleMethodSelect('fingerprint')}
                startIcon={<Fingerprint />}
                sx={{
                  py: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Fingerprint
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => handleMethodSelect('face')}
                startIcon={<Face />}
                sx={{
                  py: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                Face Recognition
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedMethod === 'fingerprint' 
                ? 'Place your finger on the fingerprint scanner'
                : 'Position your face in the camera frame'}
            </Typography>
            
            {selectedMethod === 'face' && (
              <Box sx={{ 
                position: 'relative',
                width: '100%',
                maxWidth: 400,
                margin: '20px auto',
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: theme.palette.primary.main
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: cameraActive ? 'block' : 'none'
                  }}
                />
                {!cameraActive && (
                  <Box sx={{ 
                    p: 4,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <VideocamOff color="action" sx={{ fontSize: 40 }} />
                    <Typography>Camera not active</Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {selectedMethod === 'fingerprint' && (
              <Box sx={{ my: 4 }}>
                <Fingerprint sx={{ fontSize: 80, color: theme.palette.primary.main }} />
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Button
              variant="contained"
              size="large"
              onClick={handleRegister}
              disabled={loading || (selectedMethod === 'face' && !cameraActive)}
              startIcon={loading ? <CircularProgress size={20} /> : <Security />}
              sx={{ mt: 2 }}
            >
              {loading ? 'Registering...' : 'Register Device'}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Biometric Registration Complete!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your {selectedMethod} has been successfully registered for biometric authentication.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.primary.main, 0.1)
          : alpha(theme.palette.primary.main, 0.05)
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" />
          <Typography variant="h6" component="div">
            Two-Factor Authentication Setup
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep === 2 ? (
          <Button
            variant="contained"
            onClick={handleClose}
            startIcon={<CheckCircle />}
          >
            Done
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BiometricRegistrationModal; 