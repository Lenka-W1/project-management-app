import React from 'react';
import './App.css';
import AppRoutes from './pages/AppRoutes';
import TempHeader from './components/Header/TempHeader';
import Footer from './components/Footer/Footer';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import { Box, CssBaseline, Fab, ThemeProvider, useScrollTrigger, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSelector } from 'react-redux';
import { AppStateType } from './BLL/store';
import { darkTheme, lightTheme } from './config/AppMode';

interface Props {
  window?: () => Window;
  children?: React.ReactElement;
}

function ScrollTop(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      '#back-to-top-anchor'
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

function App(props: Props) {
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  return (
    <ThemeProvider theme={isDarkMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <AppRoutes />
        <Footer />
        <ScrollTop {...props}>
          <Fab
            color={isDarkMode === 'light' ? 'info' : 'default'}
            size="small"
            aria-label="scroll back to top"
          >
            <KeyboardArrowUpIcon style={{ color: isDarkMode === 'light' ? 'white' : 'black' }} />
          </Fab>
        </ScrollTop>
        <ToastContainer
          position="bottom-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
