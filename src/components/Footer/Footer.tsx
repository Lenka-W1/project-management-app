import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';
import styled from 'styled-components';

function Footer() {
  const openLink = (gitName: string) => {
    window.open(`https://github.com/${gitName}`);
  };
  return (
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
  );
}

export default Footer;

const RootFooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  background-color: #1976d2;
  width: 100%;
  padding: 0 20px 0 20px;
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
  h3 {
    font-size: 18px;
    color: white;
    margin-left: 5px;
  }
`;
