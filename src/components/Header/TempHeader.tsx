import React from 'react';
import { AppBar, Box, Button, styled, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { PATH } from '../../pages/AppRoutes';

function TempHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledHeader position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            project-management-app
          </Typography>
          <NavLink to={PATH.MAIN}>
            <Button variant={'text'} style={{ color: 'white' }}>
              Main
            </Button>
          </NavLink>
          <NavLink to={PATH.WELCOME}>
            <Button variant={'text'} style={{ color: 'white' }}>
              Welcome
            </Button>
          </NavLink>
          <NavLink to={PATH.SIGN_UP}>
            <Button variant={'text'} style={{ color: 'white' }}>
              SIGN_UP
            </Button>
          </NavLink>
          <NavLink to={PATH.SIGN_IN}>
            <Button variant={'text'} style={{ color: 'white' }}>
              SIGN_IN
            </Button>
          </NavLink>
          <NavLink to={PATH.BOARD}>
            <Button variant={'text'} style={{ color: 'white' }}>
              BOARD
            </Button>
          </NavLink>
          <NavLink to={PATH.ERROR}>
            <Button variant={'text'} style={{ color: 'white' }}>
              ERROR
            </Button>
          </NavLink>
        </Toolbar>
      </StyledHeader>
    </Box>
  );
}

export default TempHeader;

const StyledHeader = styled(AppBar)`
  a {
    text-decoration: none;
  }
`;
