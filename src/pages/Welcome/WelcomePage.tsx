import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { AppStateType } from '../../BLL/store';
import { useTranslation } from 'react-i18next';
import { PATH } from '../AppRoutes';

function WelcomePage() {
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const link = useNavigate();
  const { t } = useTranslation();

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
          <Title>{t('welcome_page.title')}</Title>
          <Stack spacing={2} direction={'row'}>
            <Button
              variant={'outlined'}
              style={{ fontWeight: '600' }}
              onClick={() => link(PATH.SIGN_IN)}
            >
              {t('welcome_page.sign_in')}
            </Button>
            <Button
              variant={'contained'}
              style={{ color: 'white' }}
              onClick={() => link(PATH.SIGN_UP)}
            >
              {t('welcome_page.sign_up')}
            </Button>
            {isLoggedIn && (
              <Button
                variant={'contained'}
                style={{ color: 'white' }}
                onClick={() => link(PATH.MAIN)}
              >
                {t('welcome_page.go_to_main')}
              </Button>
            )}
          </Stack>
        </TitleBlock>
        <Section>
          <Description>
            <strong style={{ color: isDarkMode === 'light' ? '' : '#3f51b5' }}>
              {t('welcome_page.description_1.strong')}
            </strong>
            {t('welcome_page.description_1.continuation')}
          </Description>
          <WelcomeImage />
        </Section>
        <Section>
          <BoardImage />
          <DescriptionBoard>
            <strong style={{ color: isDarkMode === 'light' ? '' : '#3f51b5' }}>
              {t('welcome_page.description_2.strong')}
            </strong>
            {t('welcome_page.description_2.continuation')}
          </DescriptionBoard>
        </Section>
        <TeamBlock
          style={{ borderTop: isDarkMode === 'light' ? '1px solid #1976d2' : '1px solid #ffffff' }}
        >
          <TitleTeamBlock>{t('welcome_page.team.development_team')}</TitleTeamBlock>
          <TeamMembers
            style={{
              boxShadow:
                isDarkMode === 'light'
                  ? '0px 5px 10px 2px rgba(25, 118, 210, 0.2)'
                  : '0px 5px 10px 2px white',
            }}
          >
            <div className="developer-info">
              <img src="photo_2022-02-19_13-11-57.jpg" className="photo two" alt="Elena" />
              <h2>{t('welcome_page.team.name_1')}</h2>
              <h3>{t('welcome_page.team.developer_1')}</h3>
            </div>
            <div className="developer-info">
              <img src="photo_2022-01-06_17-44-22.jpg" className="photo one" alt="Alexander" />
              <h2>{t('welcome_page.team.name_2')}</h2>
              <h3>{t('welcome_page.team.developer_2')}</h3>
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
  background: rgb(129, 200, 240);
  background: linear-gradient(180deg, rgba(129, 200, 240, 1) 0%, rgba(234, 239, 245, 1) 69%);
`;

const WelcomePageWrapper = styled.div`
  margin: 0 auto;
  max-width: 1920px;
  padding: 20px 70px 100px;

  @media (max-width: 688px) {
    padding: 20px 70px 200px;
  }

  @media (max-width: 555px) {
    padding: 20px 50px 200px;
  }

  @media (max-width: 488px) {
    padding: 20px 40px 200px;
  }

  @media (max-width: 488px) {
    padding: 20px 20px 200px;
  }

  @media (max-width: 407px) {
    padding: 20px 2px 200px;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 790px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  text-transform: uppercase;

  @media (max-width: 1048px) {
    font-size: 22px;
  }

  @media (max-width: 819px) {
    font-size: 20px;
  }

  @media (max-width: 790px) {
    margin-bottom: 20px;
  }

  @media (max-width: 729px) {
    font-size: 18px;
  }

  @media (max-width: 555px) {
    text-align: center;
  }
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

  @media (max-width: 1439px) {
    text-align: center;
  }

  @media (max-width: 1048px) {
    font-size: 38px;
  }

  @media (max-width: 819px) {
    font-size: 36px;
  }

  @media (max-width: 729px) {
    font-size: 34px;
  }

  @media (max-width: 604px) {
    font-size: 30px;
  }

  @media (max-width: 407px) {
    font-size: 24px;
  }
`;

const DescriptionBoard = styled.p`
  font-size: 40px;
  width: 700px;
  align-self: center;
  font-family: Open Sans;
  font-weight: 500;
  display: flex;
  flex-direction: column;

  @media (max-width: 1439px) {
    text-align: center;
    order: -1;
  }

  @media (max-width: 1048px) {
    font-size: 38px;
  }

  @media (max-width: 819px) {
    font-size: 36px;
  }

  @media (max-width: 729px) {
    font-size: 34px;
  }

  @media (max-width: 604px) {
    font-size: 30px;
  }

  @media (max-width: 407px) {
    font-size: 24px;
  }
`;

const WelcomeImage = styled.div`
  background-image: url(urban-teamwork.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 600px;
  height: 500px;

  @media (max-width: 604px) {
    font-size: 30px;
    height: 400px;
  }

  @media (max-width: 555px) {
    font-size: 30px;
    height: 300px;
  }
`;

const BoardImage = styled.div`
  background-image: url(urban-women-create-a-website-using-a-laptop-and-a-desktop-computer.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 600px;
  height: 500px;

  @media (max-width: 604px) {
    font-size: 30px;
    height: 400px;
  }

  @media (max-width: 555px) {
    font-size: 30px;
    height: 300px;
  }
`;

const TeamBlock = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid #1976d2;
  padding: 80px 0;
  margin-top: 100px;
`;

const TitleTeamBlock = styled.h2`
  font-size: 28px;
  text-transform: uppercase;
  margin-bottom: 20px;

  @media (max-width: 729px) {
    font-size: 26px;
  }

  @media (max-width: 688px) {
    font-size: 24px;
  }

  @media (max-width: 646px) {
    font-size: 22px;
  }

  @media (max-width: 604px) {
    font-size: 20px;
  }

  @media (max-width: 566px) {
    text-align: center;
  }
`;

const TeamMembers = styled.div`
  max-width: 700px;
  min-height: 400px;
  border-radius: 10px;
  justify-content: space-around;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;

  @media (max-width: 407px) {
    box-shadow: none !important;
  }
`;
