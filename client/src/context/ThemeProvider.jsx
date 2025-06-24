import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, alpha } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

// Create theme context
export const ThemeContext = createContext();

// Define theme variants
const themeVariants = {
  Light: {
    mode: 'light',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF80AB',
      dark: '#C51162',
      contrastText: '#fff',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    customShadows: {
      card: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
    },
  },
  Dark: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      light: '#BBDEFB',
      dark: '#42A5F5',
      contrastText: '#000',
    },
    secondary: {
      main: '#FF80AB',
      light: '#FFB2CC',
      dark: '#F50057',
      contrastText: '#000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    customShadows: {
      card: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
    },
  },
  Neomorphism: {
    mode: 'light',
    primary: {
      main: '#5D8CAE',
      light: '#7FA6BF',
      dark: '#45697C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E07A5F',
      light: '#E9A598',
      dark: '#B25746',
      contrastText: '#fff',
    },
    background: {
      default: '#E0E0E0',
      paper: '#DDDDDD',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    customShadows: {
      card: '9px 9px 16px #BEBEBE, -9px -9px 16px #FFFFFF',
    },
  },
  Glassmorphism: {
    mode: 'light',
    primary: {
      main: '#3A86FF',
      light: '#5D9CFF',
      dark: '#2D68CC',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF006E',
      light: '#FF4D9B',
      dark: '#CC0058',
      contrastText: '#fff',
    },
    background: {
      default: 'rgba(255, 255, 255, 0.25)',
      paper: 'rgba(255, 255, 255, 0.5)',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: 'rgba(255, 255, 255, 0.2)',
    customShadows: {
      card: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    },
  },
  Noa: {
    mode: 'dark',
    primary: {
      main: '#FF0099',
      light: '#FF33AD',
      dark: '#CC007A',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFD700',
      light: '#FFDF33',
      dark: '#CCB000',
      contrastText: '#000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    customShadows: {
      card: '0 8px 32px 0 rgba(255, 0, 153, 0.3)',
    },
  },
};

// List of valid theme names
const validThemes = Object.keys(themeVariants);

// Get preferred color scheme for System theme
const getSystemTheme = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'Dark' 
    : 'Light';
};

const ThemeProvider = ({ children }) => {
  // Get saved theme from localStorage or default to Light
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Validate the saved theme exists, otherwise use Light
    return savedTheme && validThemes.includes(savedTheme) ? savedTheme : "Light";
  });
  
  // Handle system theme changes
  useEffect(() => {
    if (currentTheme === 'System') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        document.documentElement.setAttribute('data-theme', 
          mediaQuery.matches ? 'Dark' : 'Light'
        );
      };
      
      // Set initial value
      handleChange();
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);
  
  // Get actual theme for the System option with validation
  const getValidTheme = (themeName) => {
    // First check if System
    if (themeName === 'System') {
      return getSystemTheme();
    }
    
    // Then validate if it exists in our variants
    if (validThemes.includes(themeName)) {
      return themeName;
    }
    
    // Fallback to Light if the theme doesn't exist
    console.warn(`Theme "${themeName}" not found, falling back to Light theme`);
    return 'Light';
  };
  
  const actualTheme = getValidTheme(currentTheme);
  
  // Create the theme object
  const theme = useMemo(() => {
    // Safe access to theme options with fallback
    const themeOptions = themeVariants[actualTheme] || themeVariants.Light;
    
    return createTheme({
      palette: {
        mode: themeOptions.mode,
        primary: themeOptions.primary,
        secondary: themeOptions.secondary,
        background: themeOptions.background,
        text: themeOptions.text,
        divider: themeOptions.divider,
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 6,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            ':root': {
              '--primary-color': themeOptions.primary.main,
              '--primary-light': themeOptions.primary.light,
              '--primary-dark': themeOptions.primary.dark,
              '--secondary-color': themeOptions.secondary.main,
              '--secondary-light': themeOptions.secondary.light,
              '--secondary-dark': themeOptions.secondary.dark,
              '--background-color': themeOptions.background.default,
              '--paper-color': themeOptions.background.paper,
              '--text-primary': themeOptions.text.primary,
              '--text-secondary': themeOptions.text.secondary,
              '--divider-color': themeOptions.divider,
              '--shadow': themeOptions.customShadows.card,
              '--border-radius': '6px',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              boxShadow: themeOptions.customShadows.card,
              fontFamily: 'inherit',
              ...(actualTheme === 'Noa' && {
                '&:hover': {
                  backgroundImage: `linear-gradient(45deg, ${themeOptions.primary.main}, ${themeOptions.secondary.main})`,
                  transition: 'all 0.3s ease',
                },
              }),
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              ...(actualTheme === 'Glassmorphism' && {
                backdropFilter: 'blur(10px)',
                backgroundColor: themeOptions.background.paper,
                border: `1px solid ${themeOptions.divider}`,
              }),
              ...(actualTheme === 'Neomorphism' && {
                boxShadow: themeOptions.customShadows.card,
              }),
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              ...(actualTheme === 'Glassmorphism' && {
                backdropFilter: 'blur(10px)',
                backgroundColor: themeOptions.background.paper,
                border: `1px solid ${themeOptions.divider}`,
              }),
              ...(actualTheme === 'Neomorphism' && {
                boxShadow: themeOptions.customShadows.card,
              }),
              boxShadow: themeOptions.customShadows.card,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: themeOptions.customShadows.card,
              ...(actualTheme === 'Glassmorphism' && {
                backdropFilter: 'blur(10px)',
                backgroundColor: alpha(themeOptions.background.paper, 0.8),
                borderBottom: `1px solid ${themeOptions.divider}`,
              }),
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 6,
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 6,
              ...(actualTheme === 'Glassmorphism' && {
                backdropFilter: 'blur(10px)',
                backgroundColor: alpha(themeOptions.background.paper, 0.9),
              }),
            },
          },
        },
      },
    });
  }, [actualTheme]);
  
  // Handle theme change with validation
  const toggleTheme = (newTheme) => {
    // Validate the theme exists
    const validatedTheme = validThemes.includes(newTheme) ? newTheme : 'Light';
    
    if (validatedTheme !== newTheme) {
      console.warn(`Theme "${newTheme}" not found, using Light theme instead`);
    }
    
    setCurrentTheme(validatedTheme);
    localStorage.setItem("theme", validatedTheme);
  };
  
  // Check if current mode is dark
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      toggleTheme, 
      isDarkMode,
      themeVariants: validThemes
    }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;