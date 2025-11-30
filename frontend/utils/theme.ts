'use client';
import { createTheme, alpha } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F172A', // Slate 900 - Deep, professional dark blue/black
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3B82F6', // Blue 500 - Vibrant accent
    },
    background: {
      default: '#F8FAFC', // Slate 50 - Very light cool grey
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Slate 800
      secondary: '#64748B', // Slate 500
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    button: {
      textTransform: 'none', // No all-caps buttons
      fontWeight: 600,
      borderRadius: '8px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0F172A',
          '&:hover': {
            backgroundColor: '#1E293B',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: '#3B82F6',
          },
        },
        notchedOutline: {
          borderColor: '#E2E8F0', // Slate 200
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '16px',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Soft, expensive shadow
        },
      },
    },
  },
});

export default theme;