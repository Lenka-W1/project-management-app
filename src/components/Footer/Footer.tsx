import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Container, IconButton } from '@mui/material';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { AppStateType } from '../../BLL/store';

function Footer() {
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const openLink = (gitName: string) => {
    window.open(`https://github.com/${gitName}`);
  };
  return (
    <Container
      style={{
        position: 'absolute',
        bottom: '0',
        maxWidth: '100vw',
        backgroundColor: isDarkMode === 'light' ? '#42a5f5' : '#272727',
      }}
    >
      <RootFooterContainer>
        <img
          src="https://rs.school/images/rs_school_js.svg"
          alt="rs-logo"
          onClick={() => window.open('https://rs.school/')}
        />
        <h2>©All rights reserved, 2022</h2>
        <GitHubLinks>
          <IconButton onClick={() => openLink('aleksandrdemidovich')}>
            <GitHubIcon style={{ color: 'white' }} /> <h3>aleksandrdemidovich</h3>
          </IconButton>
          <IconButton onClick={() => openLink('Lenka-W1')}>
            <GitHubIcon style={{ color: 'white' }} /> <h3>Lenka-W1</h3>
          </IconButton>
        </GitHubLinks>
      </RootFooterContainer>
    </Container>
  );
}

export default Footer;

const RootFooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 1920px;
  padding: 0 26px;
  img {
    width: 70px;
    height: 70px;
    cursor: pointer;
  }
  h2 {
    font-size: 18px;
    font-weight: 400;
  }
`;

const GitHubLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h3 {
    font-size: 18px;
    color: white;
    margin-left: 5px;
  }
`;
