import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { PATH } from '../../pages/AppRoutes';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { setAppMode } from '../../BLL/reducers/app-reducer';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useState } from 'react';
import { signOut } from '../../BLL/reducers/auth-reducer';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

type HeaderPropsType = {
  handleOpenModal: (isOpen: boolean) => void;
};
function Header(props: HeaderPropsType) {
  const { t, i18n } = useTranslation();
  const [checked, setSwitch] = useState<boolean>(i18n.language !== 'ru');
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const dispatch = useDispatch<AppDispatchType>();

  const switchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    checked ? i18n.changeLanguage('ru') : i18n.changeLanguage('en');
    setSwitch(event.target.checked);
  };
  const toggleAppMode = () => {
    dispatch(setAppMode({ mode: isDarkMode === 'dark' ? 'light' : 'dark' }));
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const logout = () => {
    dispatch(signOut());
  };

  return (
    <>
      <StyledHeader position="sticky">
        <Container style={{ maxWidth: '1920px' }}>
          <StyledToolbar
            style={
              isLoggedIn
                ? {
                    justifyContent: 'space-between',
                  }
                : { justifyContent: 'flex-end' }
            }
          >
            {isLoggedIn && (
              <Navigation>
                <NavLink to={PATH.EDIT_PROFILE}>
                  <Button variant={'text'} style={{ color: 'white' }}>
                    {t('header.edit_profile')}
                  </Button>
                </NavLink>
                <Button
                  variant={'text'}
                  style={{ color: 'white' }}
                  onClick={() => props.handleOpenModal(true)}
                >
                  {t('header.create_new_board')}
                </Button>
              </Navigation>
            )}
            <Box sx={{ flexGrow: 1, display: { sm: 'flex', md: 'none', lg: 'none', xl: 'none' } }}>
              <IconButton onClick={handleOpenNavMenu} style={{ color: 'white' }}>
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { sm: 'flex', md: 'none', lg: 'none', xl: 'none' },
                }}
              >
                <StyledMenuItem onClick={handleCloseNavMenu} divider>
                  <NavLink to={PATH.EDIT_PROFILE}>
                    <Button
                      variant={'text'}
                      style={isDarkMode === 'dark' ? { color: 'white' } : { color: 'black' }}
                    >
                      {t('header.edit_profile')}
                    </Button>
                  </NavLink>
                </StyledMenuItem>
                <MenuItem divider>
                  <Button
                    variant={'text'}
                    style={isDarkMode === 'dark' ? { color: 'white' } : { color: 'black' }}
                    onClick={() => props.handleOpenModal(true)}
                  >
                    {t('header.create_new_board')}
                  </Button>
                </MenuItem>
                <MenuItem style={{ marginLeft: '6px' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{t('header.rus')}</Typography>
                    <Switch {...label} color="default" checked={checked} onChange={switchHandler} />
                    <Typography>{t('header.eng')}</Typography>
                  </Stack>
                </MenuItem>
              </Menu>
            </Box>
            <SwitchPanel sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip
                title={
                  isDarkMode == 'light'
                    ? t('header.switch.dark_theme')
                    : t('header.switch.light_theme')
                }
                placement="bottom"
              >
                <ModeButton
                  variant="outlined"
                  color={'primary'}
                  style={{ border: isDarkMode === 'light' ? '1px solid #ffffff' : '' }}
                  onClick={toggleAppMode}
                >
                  {isDarkMode === 'light' ? (
                    <NightlightOutlinedIcon fontSize={'small'} style={{ color: 'grey' }} />
                  ) : (
                    <LightModeOutlinedIcon fontSize={'small'} style={{ color: '#f57c00' }} />
                  )}
                </ModeButton>
              </Tooltip>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{t('header.rus')}</Typography>
                <Switch {...label} color="default" checked={checked} onChange={switchHandler} />
                <Typography>{t('header.eng')}</Typography>
              </Stack>
              <SignOutButton variant={'outlined'} size={'small'} onClick={logout}>
                {t('header.sign_out')}
              </SignOutButton>
            </SwitchPanel>
          </StyledToolbar>
        </Container>
      </StyledHeader>
      <Toolbar id="back-to-top-anchor" style={{ position: 'absolute', top: 0 }} />
    </>
  );
}

export default Header;

const StyledHeader = styled(AppBar)`
  a {
    text-decoration: none;
  }
  @media (max-width: 790px) {
    padding: 10px 0;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  a {
    text-decoration: none;
  }
`;

const StyledToolbar = styled(Toolbar)`
  width: 100%;
  display: flex;
  flex-direction: row;
  @media (max-width: 555px) {
    padding: 0;
  }
`;

const Navigation = styled(Box)({
  '@media (max-width: 899px)': {
    display: 'none',
  },
});

const SwitchPanel = styled(Box)({
  '@media (max-width: 555px)': {
    width: '100%',
    justifyContent: 'flex-end',
  },
  '@media (max-width: 899px)': {
    div: {
      display: 'none',
    },
  },
});

const SignOutButton = styled(Button)({
  color: '#ffffff',
  marginLeft: '20px',
  border: '1px solid #ffffff',
  '&:hover': {
    backgroundColor: '#2591cf79',
    borderColor: '#3f51b5',
  },
  '@media (max-width: 899px)': {
    marginLeft: '10px',
  },
});

const ModeButton = styled(Button)({
  borderColor: '#ffffff',
  marginRight: '20px',
  minWidth: '20px',
  height: '30px',
  padding: '0 5px',
  alignSelf: 'center',
  '&:hover': {
    backgroundColor: '#2591cf79',
    borderColor: '#3f51b5',
  },
  '@media (max-width: 899px)': {
    marginRight: '0',
  },
});
