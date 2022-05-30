import React, { useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './pages/AppRoutes';
import Footer from './components/Footer/Footer';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import { Box, CssBaseline, Fab, ThemeProvider, useScrollTrigger, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from './BLL/store';
import { darkTheme, lightTheme } from './config/AppMode';
import FormModal from './components/ModalWindows/FormModal';
import { decodeToken, getToken } from './utils/utils';
import { setAuthInfo } from './BLL/reducers/auth-reducer';
import { fetchUser } from './BLL/reducers/user-reducer';
import { AppStatusType } from './BLL/reducers/app-reducer';
import Preloader from './components/Preloader/Preloader';

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
  const [openFormModal, setOpenFormModal] = useState(false);
  const dispatch = useDispatch<AppDispatchType>();
  const appStatus = useSelector<AppStateType, AppStatusType>((state) => state.app.status);
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const user = useSelector<
    AppStateType,
    { userId: string; name: string; login: string; password: string }
  >((state) => state.user);
  const handleOpenModal = (isOpen: boolean) => {
    setOpenFormModal(isOpen);
  };
  useEffect(() => {
    const token = getToken('token', document.cookie);
    if (token) {
      const { userId, login } = decodeToken(token);
      dispatch(setAuthInfo({ userId, login }));
      dispatch(fetchUser(userId));
    }
  }, [dispatch, user.name]);
  return (
    <ThemeProvider theme={isDarkMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {appStatus === 'loading' && <Preloader />}
      <div className="App">
        <Header handleOpenModal={handleOpenModal} />
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
        {openFormModal && (
          <FormModal open={openFormModal} setOpen={handleOpenModal} type={'board'} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
