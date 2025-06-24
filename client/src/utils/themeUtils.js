/**
 * Theme Utility Functions
 * 
 * This file contains helper functions for working with themes
 * throughout the application.
 */

// Safely get the current theme from DOM
const safeGetCurrentTheme = () => {
  try {
    return document.documentElement.getAttribute('data-theme') || 'Light';
  } catch (error) {
    console.warn('Error getting current theme', error);
    return 'Light';
  }
};

// Get CSS variable from the current theme
export const getThemeVar = (varName) => {
  try {
    return `var(--${varName})`;
  } catch (error) {
    console.warn(`Error getting theme variable: ${varName}`, error);
    // Return fallback values
    switch(varName) {
      case 'primary-color': return '#2196F3';
      case 'primary-light': return '#64B5F6';
      case 'primary-dark': return '#1976D2';
      case 'secondary-color': return '#FF4081';
      case 'secondary-light': return '#FF80AB';
      case 'secondary-dark': return '#C51162';
      case 'background-color': return '#FFFFFF';
      case 'paper-color': return '#F5F5F5';
      case 'text-primary': return '#333333';
      case 'text-secondary': return '#757575';
      case 'divider-color': return 'rgba(0, 0, 0, 0.12)';
      case 'shadow': return '0 8px 16px 0 rgba(0, 0, 0, 0.1)';
      case 'border-radius': return '8px';
      default: return '#000000';
    }
  }
};

// Apply theme-specific styles conditionally
export const getThemeStyles = (themeName, styles) => {
  try {
    const currentTheme = safeGetCurrentTheme();
    return currentTheme === themeName ? styles : {};
  } catch (error) {
    console.warn(`Error in getThemeStyles for: ${themeName}`, error);
    return {};
  }
};

// Create gradient text based on theme primary and secondary colors
export const getGradientText = () => {
  try {
    return {
      background: `linear-gradient(90deg, var(--primary-color), var(--secondary-color))`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };
  } catch (error) {
    console.warn('Error getting gradient text', error);
    return {
      color: 'var(--primary-color)'
    };
  }
};

// Get styled background for cards and components based on current theme
export const getComponentBackground = (isDarkMode, alpha = 0.8) => {
  try {
    const currentTheme = safeGetCurrentTheme();
    
    if (currentTheme === 'Glassmorphism') {
      return {
        background: isDarkMode 
          ? `rgba(30, 30, 30, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
        borderRadius: 'var(--border-radius)',
      };
    }
    
    if (currentTheme === 'Neomorphism') {
      return {
        background: isDarkMode
          ? 'linear-gradient(145deg, #232323, #1a1a1a)'
          : 'linear-gradient(145deg, #ffffff, #e0e0e0)',
        boxShadow: 'var(--shadow)',
        borderRadius: 'var(--border-radius)',
      };
    }
    
    if (currentTheme === 'Noa') {
      return {
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.9))'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.9))',
        boxShadow: 'var(--shadow)',
        borderRadius: 'var(--border-radius)',
        border: `1px solid ${isDarkMode ? 'rgba(255, 0, 153, 0.1)' : 'rgba(255, 0, 153, 0.05)'}`,
      };
    }
    
    // Default Light/Dark theme
    return {
      background: 'var(--paper-color)',
      boxShadow: 'var(--shadow)',
      borderRadius: 'var(--border-radius)',
    };
  } catch (error) {
    console.warn('Error getting component background', error);
    return {
      background: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRadius: '8px',
    };
  }
};

// Helper for consistent shadow styles
export const getShadow = (elevation = 1) => {
  try {
    const currentTheme = safeGetCurrentTheme();
    
    if (currentTheme === 'Neomorphism') {
      return { boxShadow: 'var(--shadow)' };
    }
    
    if (currentTheme === 'Glassmorphism') {
      return { 
        boxShadow: elevation === 0 ? 'none' : 'var(--shadow)',
        backdropFilter: elevation === 0 ? 'none' : 'blur(10px)',
      };
    }
    
    switch (elevation) {
      case 0:
        return { boxShadow: 'none' };
      case 1:
        return { boxShadow: 'var(--shadow)' };
      case 2:
        return { 
          boxShadow: currentTheme === 'Noa'
            ? '0 12px 24px 0 rgba(255, 0, 153, 0.3)'
            : '0 12px 24px 0 rgba(0, 0, 0, 0.15)' 
        };
      case 3:
        return { 
          boxShadow: currentTheme === 'Noa'
            ? '0 16px 32px 0 rgba(255, 0, 153, 0.4)'
            : '0 16px 32px 0 rgba(0, 0, 0, 0.2)' 
        };
      default:
        return { boxShadow: 'var(--shadow)' };
    }
  } catch (error) {
    console.warn('Error getting shadow style', error);
    return { boxShadow: elevation > 0 ? '0 8px 16px rgba(0, 0, 0, 0.1)' : 'none' };
  }
};

// Apply theme-specific border radius
export const getBorderRadius = (size = 'medium') => {
  try {
    switch (size) {
      case 'small':
        return { borderRadius: 'calc(var(--border-radius) * 0.5)' };
      case 'medium':
        return { borderRadius: 'var(--border-radius)' };
      case 'large':
        return { borderRadius: 'calc(var(--border-radius) * 1.5)' };
      case 'xl':
        return { borderRadius: 'calc(var(--border-radius) * 2)' };
      case 'pill':
        return { borderRadius: '50px' };
      case 'circle':
        return { borderRadius: '50%' };
      default:
        return { borderRadius: 'var(--border-radius)' };
    }
  } catch (error) {
    console.warn('Error getting border radius', error);
    const fallbackSizes = { small: '4px', medium: '8px', large: '12px', xl: '16px', pill: '50px', circle: '50%' };
    return { borderRadius: fallbackSizes[size] || '8px' };
  }
};

// Get appropriate text color based on background
export const getTextColorForBackground = (isDarkMode) => {
  try {
    return { color: 'var(--text-primary)' };
  } catch (error) {
    console.warn('Error getting text color', error);
    return { color: isDarkMode ? '#ffffff' : '#333333' };
  }
};

// Get consistent button styles based on theme
export const getButtonStyles = (variant = 'contained', color = 'primary') => {
  try {
    const currentTheme = safeGetCurrentTheme();
    const baseStyles = {
      borderRadius: 'var(--border-radius)',
      fontFamily: 'inherit',
      textTransform: 'none',
    };
    
    // Glassmorphism buttons
    if (currentTheme === 'Glassmorphism') {
      if (variant === 'contained') {
        return {
          ...baseStyles,
          backdropFilter: 'blur(10px)',
          background: color === 'primary' 
            ? 'var(--primary-color)' 
            : 'var(--secondary-color)',
          boxShadow: 'var(--shadow)',
          color: '#ffffff',
        };
      }
      
      return {
        ...baseStyles,
        backdropFilter: 'blur(5px)',
        background: 'transparent',
        borderColor: color === 'primary' 
          ? 'var(--primary-color)' 
          : 'var(--secondary-color)',
        color: color === 'primary' 
          ? 'var(--primary-color)' 
          : 'var(--secondary-color)',
      };
    }
    
    // Neomorphism buttons
    if (currentTheme === 'Neomorphism') {
      return {
        ...baseStyles,
        boxShadow: 'var(--shadow)',
        background: variant === 'contained'
          ? (color === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)') 
          : 'var(--background-color)',
        color: variant === 'contained' 
          ? '#ffffff' 
          : (color === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'),
      };
    }
    
    // Noa theme buttons with gradient
    if (currentTheme === 'Noa') {
      if (variant === 'contained') {
        return {
          ...baseStyles,
          background: color === 'primary' 
            ? 'var(--primary-color)'
            : 'var(--secondary-color)',
          '&:hover': {
            backgroundImage: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
            transition: 'all 0.3s ease',
          },
          boxShadow: 'var(--shadow)',
        };
      }
      
      return {
        ...baseStyles,
        border: '1px solid',
        borderColor: color === 'primary' 
          ? 'var(--primary-color)' 
          : 'var(--secondary-color)',
        color: color === 'primary' 
          ? 'var(--primary-color)' 
          : 'var(--secondary-color)',
        '&:hover': {
          backgroundImage: `linear-gradient(45deg, ${color === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'}, transparent)`,
          backgroundSize: '200% 100%',
          transition: 'all 0.3s ease',
          opacity: 0.8,
        },
      };
    }
    
    // Default light/dark buttons
    return baseStyles;
  } catch (error) {
    console.warn('Error getting button styles', error);
    return {
      borderRadius: '8px',
      textTransform: 'none',
    };
  }
}; 