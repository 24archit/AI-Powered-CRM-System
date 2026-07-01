import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1c39bb',       // Brand Blue
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981',       // Emerald
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#edf2f9',    // Light bg
      paper: '#ffffff',      // White card bg
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(0,0,0,0.06)',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400, lineHeight: 1.6 },
    body2: { fontWeight: 400, lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    caption: { fontWeight: 500, letterSpacing: '0.04em' },
    overline: { fontWeight: 700, letterSpacing: '0.1em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#edf2f9',
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-1px)' },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: '#1c39bb',
            boxShadow: '0 4px 12px rgba(28, 57, 187, 0.2)',
            '&:hover': {
              background: '#1e40af',
              boxShadow: '0 6px 16px rgba(28, 57, 187, 0.3)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: 'rgba(28, 57, 187, 0.3)',
            '&:hover': {
              borderColor: '#1c39bb',
              backgroundColor: 'rgba(28, 57, 187, 0.04)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#ffffff',
            '& fieldset': { borderColor: '#cbd5e1' },
            '&:hover fieldset': { borderColor: '#1c39bb' },
            '&.Mui-focused fieldset': { borderColor: '#1c39bb' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.72rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgba(0,0,0,0.04)',
        },
        head: {
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          backgroundColor: 'rgba(0,0,0,0.02)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
