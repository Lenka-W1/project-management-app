import { createTheme, PaletteOptions } from '@mui/material';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#42a5f5',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#81c784',
    },
  },
});
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#388e3c',
    },
  } as PaletteOptions,
});
