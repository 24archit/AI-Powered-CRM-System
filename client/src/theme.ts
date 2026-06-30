import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',       // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
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
      default: '#0f1117',    // Deep dark
      paper: '#1a1d27',      // Slightly lighter card bg
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255,255,255,0.06)',
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
          background: '#0f1117',
          scrollbarWidth: 'thin',
          scrollbarColor: '#334155 transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#334155', borderRadius: 3 },
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
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: 'rgba(99, 102, 241, 0.5)',
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1a1d27',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
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
            backgroundColor: 'rgba(255,255,255,0.04)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
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
          borderBottomColor: 'rgba(255,255,255,0.05)',
        },
        head: {
          fontWeight: 700,
          color: '#94a3b8',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          backgroundColor: 'rgba(255,255,255,0.02)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e2130',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
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
