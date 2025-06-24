import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

export const PdfHeader = ({ onBack, onDownload, title = 'Invoice Number', size, handleCompact, handleA4 }) => {
  const theme = useTheme();

  return (
    <Container maxWidth='lg'>
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'common.white',
        borderRadius: theme.shape.borderRadius
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          {onBack && (
            <IconButton onClick={onBack} sx={{ color: 'common.white', mr: 2 }}>
              <BackIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={2}>
          <ButtonGroup variant="outlined" sx={{ backgroundColor: 'background.paper' }}>
            <Button
              variant={size === 'compact' ? 'contained' : 'outlined'}
              onClick={handleCompact}
              size="small"
                sx={{
                  color: size === 'compact' ? 'common.white' : 'primary.main',
                  backgroundColor: size === 'compact' ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: size === 'compact' ? 'primary.dark' : 'action.hover'
                  }
                }}
            >
              Compact
            </Button>
            <Button
              variant={size === 'a4' ? 'contained' : 'outlined'}
              onClick={handleA4}
              size="small"
                sx={{
                  color: size === 'a4' ? 'common.white' : 'primary.main',
                  backgroundColor: size === 'a4' ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: size === 'a4' ? 'primary.dark' : 'action.hover'
                  }
                }}
            >
              A4 
            </Button>
          </ButtonGroup>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => onDownload(size)}
            sx={{
                backgroundColor: 'secondary.main',
                color: 'common.white',
              '&:hover': {
                  backgroundColor: 'secondary.dark'
              }
            }}
          >
            Download
          </Button>
        </Stack>
      </Stack>
    </Paper>
    </Container>
  );
};