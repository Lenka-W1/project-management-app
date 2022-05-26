import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { AppStateType } from '../../BLL/store';
import { PATH } from '../AppRoutes';

function WelcomePage() {
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const link = useNavigate();
  return (
    <RootWelcomeContainer
      style={{
        background:
          isDarkMode === 'light'
            ? 'linear-gradient(180deg, rgba(129, 200, 240, 1) 0%, rgba(234, 239, 245, 1) 69%)'
            : '#2F2F2F',
      }}
    >
      <WelcomePageWrapper>
        <TitleBlock>
          <Title>Project managment app</Title>
          <Stack spacing={2} direction={'row'}>
            <Button
              variant={'outlined'}
              style={{ fontWeight: '600' }}
              onClick={() => link(PATH.SIGN_IN)}
            >
              Sign In
            </Button>
            <Button
              variant={'contained'}
              style={{ color: 'white' }}
              onClick={() => link(PATH.SIGN_UP)}
            >
              Sign Up
            </Button>
            {isLoggedIn && (
              <Button
                variant={'contained'}
                style={{ color: 'white' }}
                onClick={() => link(PATH.MAIN)}
              >
                Go to Main Page
              </Button>
            )}
          </Stack>
        </TitleBlock>
        <Section>
          <Description>
            <strong style={{ color: isDarkMode === 'light' ? '' : '#3f51b5' }}>
              A project management system
            </strong>{' '}
            is an application that helps an individual in a team or group of developers achieve
            their goals.
          </Description>
          <WelcomeImage />
        </Section>
        <Section>
          <BoardImage />
          <DescriptionBoard>
            <strong style={{ color: isDarkMode === 'light' ? '' : '#3f51b5' }}>Board</strong> use
            columns and cards to create tasks, track and organize them. And also assign tasks to
            team members. Manage projects.
          </DescriptionBoard>
        </Section>
        <TeamBlock
          style={{ borderTop: isDarkMode === 'light' ? '1px solid #42a5f5' : '1px solid #ffffff' }}
        >
          <TitleTeamBlock>Application development team</TitleTeamBlock>
          <TeamMembers
            style={{
              boxShadow:
                isDarkMode === 'light'
                  ? '0px 5px 10px 2px rgba(25, 118, 210, 0.2)'
                  : '0px 5px 10px 2px rgba(255, 255, 255, 0.425)',
            }}
          >
            <div className="developer-info">
              <img src="photo_2022-02-19_13-11-57.jpg" className="photo two" alt="Elena" />
              <h2>Elena Khovavko</h2>
              <h3>Frontend developer, Team lead</h3>
              <p></p>
            </div>
            <div className="developer-info">
              <img src="photo_2022-01-06_17-44-22.jpg" className="photo one" alt="Alexander" />
              <h2>Alexander Demidovich</h2>
              <h3>Frontend developer</h3>
              <p></p>
            </div>
          </TeamMembers>
        </TeamBlock>
      </WelcomePageWrapper>
    </RootWelcomeContainer>
  );
}

export default WelcomePage;

const RootWelcomeContainer = styled.div`
  min-height: calc(100vh - 134px);
`;

const WelcomePageWrapper = styled.div`
  margin: 0 auto;
  max-width: 1920px;
  padding: 20px 70px 100px;
`;

const TitleBlock = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 24px;
  text-transform: uppercase;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding-top: 100px;
`;

const Description = styled.p`
  font-size: 40px;
  width: 700px;
  align-self: center;
  font-family: Open Sans;
  font-weight: 500;
  display: flex;
  flex-direction: column;
`;

const DescriptionBoard = styled.p`
  font-size: 40px;
  width: 700px;
  align-self: center;
  font-family: Open Sans;
  font-weight: 500;
  display: flex;
  flex-direction: column;
`;

const WelcomeImage = styled.div`
  background-image: url(urban-teamwork.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 600px;
  height: 500px;
`;

const BoardImage = styled.div`
  background-image: url(urban-women-create-a-website-using-a-laptop-and-a-desktop-computer.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 600px;
  height: 500px;
`;

const TeamBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 80px 0;
  margin-top: 100px;
`;

const TitleTeamBlock = styled.h2`
  font-size: 28px;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const TeamMembers = styled.div`
  width: 700px;
  min-height: 400px;
  border-radius: 10px;
  justify-content: space-around;
  display: flex;
  flex-wrap: wrap;
`;
