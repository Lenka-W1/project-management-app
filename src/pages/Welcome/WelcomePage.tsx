import { Button, Stack } from '@mui/material';
import styled from 'styled-components';

function WelcomePage() {
  return (
    <RootWelcomeContainer>
      <WelcomePageWrapper>
        <ButtonBlock spacing={2} direction={'row'}>
          <Button variant={'contained'} style={{ color: 'white' }}>
            Sign In
          </Button>
          <Button variant={'contained'} style={{ color: 'white' }}>
            Sign Up
          </Button>
          <Button variant={'contained'} style={{ color: 'white', display: 'none' }}>
            Go to Main Page
          </Button>
        </ButtonBlock>
      </WelcomePageWrapper>
    </RootWelcomeContainer>
  );
}

export default WelcomePage;

const RootWelcomeContainer = styled.div`
  height: calc(100vh - 70px);
`;

const WelcomePageWrapper = styled.div`
  margin: 0 auto;
  max-width: 1920px;
  padding: 20px 20px 0;
`;

const ButtonBlock = styled(Stack)`
  display: flex;
  justify-content: flex-end;
`;
