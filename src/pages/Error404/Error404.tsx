import React from 'react';
import styled from 'styled-components';

class Error404 extends React.Component {
  render() {
    return (
      <RootContainer>
        <NotFoundContainer>
          <div>
            <h1>404</h1>
          </div>
          <h2>Oops! This Page Could Not Be Found</h2>
          <p>
            Sorry but the page you are looking for does not exist, have been removed. Name changed
            or is temporarily unavailable
          </p>
        </NotFoundContainer>
      </RootContainer>
    );
  }
}

export default Error404;

const RootContainer = styled.div`
  background-image: url('https://i.pinimg.com/originals/21/5c/7f/215c7fdca6033092baa04b35c17466bd.gif');
  background-repeat: no-repeat;
  background-size: 100%;
  height: 93vh;
`;
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  max-width: 767px;
  width: 100%;
  line-height: 1.4;
  padding: 0 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  div {
    box-sizing: border-box;
    position: relative;
    height: 150px;
    line-height: 150px;
    margin-bottom: 25px;

    h1 {
      line-height: 150px;
      box-sizing: border-box;
      font-size: 186px;
      font-weight: 900;
      margin: 0;
      text-transform: uppercase;
      background: url('https://colorlib.com/etc/404/colorlib-error-404-1/img/text.png');
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: cover;
      background-position: center;
    }
  }

  h2 {
    line-height: 1.4;
    box-sizing: border-box;
    font-family: titillium web, sans-serif;
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    color: white;
  }

  p {
    line-height: 1.4;
    box-sizing: border-box;
    font-family: montserrat, sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0;
    text-transform: uppercase;
    color: white;
  }
`;
