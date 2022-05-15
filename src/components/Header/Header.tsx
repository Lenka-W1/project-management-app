import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  styled,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { PATH } from '../../pages/AppRoutes';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function Header() {
  return (
    <>
      <CssBaseline />
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
              <NavLink to={PATH.MAIN}>
                <Button variant={'text'} style={{ color: 'white' }}>
                  Create new board
                </Button>
              </NavLink>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>RU</Typography>
                <Switch {...label} defaultChecked color="default" />
                <Typography>EN</Typography>
              </Stack>
              <SignOutButton variant={'outlined'} size={'small'}>
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
    border: '1px solid #ffffff',
    backgroundColor: '#2591cf79',
  },
});
