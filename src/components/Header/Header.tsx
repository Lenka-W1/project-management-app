import {
  AppBar,
  Box,
  Button,
  Container,
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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { setAppMode } from '../../BLL/reducers/app-reducer';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

type HeaderPropsType = {
  handleOpenModal: (isOpen: boolean) => void;
};
function Header(props: HeaderPropsType) {
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const dispatch = useDispatch<AppDispatchType>();

  const toggleAppMode = () => {
    dispatch(setAppMode({ mode: isDarkMode === 'dark' ? 'light' : 'dark' }));
  };

  return (
    <>
      <StyledHeader position="sticky">
        <Container style={{ maxWidth: '1920px' }}>
          <Toolbar
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <NavLink to={PATH.EDIT_PROFILE}>
                <Button variant={'text'} style={{ color: 'white' }}>
                  Edit profile
                </Button>
              </NavLink>
              <Button
                variant={'text'}
                style={{ color: 'white' }}
                onClick={() => props.handleOpenModal(true)}
              >
                Create new board
              </Button>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Tooltip
                title={isDarkMode == 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
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
                <Typography>RU</Typography>
                <Switch {...label} defaultChecked color="default" />
                <Typography>EN</Typography>
              </Stack>
              <SignOutButton
                variant={'outlined'}
                size={'small'}
                style={{ border: isDarkMode === 'light' ? '1px solid #ffffff' : '' }}
              >
                Sign Out
              </SignOutButton>
            </Box>
          </Toolbar>
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
`;

const SignOutButton = styled(Button)({
  color: '#ffffff',
  marginLeft: '20px',
  '&:hover': {
    backgroundColor: '#2591cf79',
    borderColor: '#3f51b5',
  },
});

const ModeButton = styled(Button)({
  marginRight: '20px',
  minWidth: '20px',
  height: '30px',
  padding: '0 5px',
  alignSelf: 'center',
  // border: '1px solid #ffffff',
  '&:hover': {
    borderColor: '#ffffff',
  },
});
