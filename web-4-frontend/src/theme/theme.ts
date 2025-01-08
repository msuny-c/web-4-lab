import { createTheme, PaletteMode, ThemeOptions } from '@mui/material';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#2563eb',
            light: '#3b82f6',
            dark: '#1d4ed8',
          },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          text: {
            primary: '#1e293b',
            secondary: '#64748b',
          },
        }
      : {
          primary: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
          },
          background: {
            default: '#0f172a',
            paper: '#1e293b',
          },
          text: {
            primary: '#f1f5f9',
            secondary: '#94a3b8',
          },
        }),
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});

export const createAppTheme = (mode: PaletteMode) => {
  const themeOptions: ThemeOptions = {
    ...getDesignTokens(mode),
    breakpoints: {
      values: {
        xs: 0,
        sm: 723,
        md: 1266,
        lg: 1920,
        xl: 2560,
      },
    },
  };
  return createTheme(themeOptions);
}; 