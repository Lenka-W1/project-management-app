import { Alert, Button, Divider, Link, Paper, styled, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppStatusType, setAppStatus } from '../../BLL/reducers/app-reducer';
import { signIn } from '../../BLL/reducers/auth-reducer';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import Preloader from '../../components/Preloader/Preloader';
import { PATH } from '../AppRoutes';

type FormikErrorType = {
  login?: string;
  password?: string;
};

function SignInPage() {
  const { t } = useTranslation();
  const appStatus = useSelector<AppStateType, AppStatusType>((state) => state.app.status);
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const err = useSelector<AppStateType, string | null>((state) => state.app.error);

  const dispatch = useDispatch<AppDispatchType>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.login) {
        errors.login = t('sign_in_page.form.required');
      }
      if (!values.password) {
        errors.password = t('sign_in_page.form.required');
      }
      return errors;
    },
    onSubmit: (values) => {
      dispatch(signIn({ login: values.login, password: values.password }));
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate(PATH.MAIN);
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }, [isLoggedIn, navigate]);

  return (
    <LoginContainer elevation={8}>
      <h1>{t('sign_in_page.sign_in_page_title')}</h1>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledInput
          variant={'outlined'}
          label={t('sign_in_page.form.login_field')}
          name="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
        />
        <StyledInput
          variant={'outlined'}
          label={t('sign_in_page.form.password_field')}
          type={'password'}
          name="password"
          autoComplete={'off'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={!!formik.errors.password}
          helperText={formik.errors.password}
        />
        {err && <ErrorAlert severity="error">{t('sign_in_page.form.error_message')}</ErrorAlert>}
        <SignInButton
          type="submit"
          disabled={appStatus === 'loading'}
          variant={'contained'}
          color={'primary'}
        >
          {t('sign_in_page.form.button_login')}
        </SignInButton>
        <Divider style={{ color: 'gray', width: '90%' }} light={false}>
          {t('sign_in_page.form.or')}
        </Divider>
        <Typography variant="caption" component="h3">
          <Link color={'green'} underline="hover" onClick={() => navigate(PATH.SIGN_UP)}>
            {t('sign_in_page.form.green_text')}
          </Link>
          {t('sign_in_page.form.continuation')}
        </Typography>
      </StyledForm>
      {appStatus === 'loading' && <Preloader />}
    </LoginContainer>
  );
}

export default SignInPage;

const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  h3 {
    margin: 5px 0 5px 0;
    font-size: 16px;
    color: gray;
    a {
      cursor: pointer;
      margin-right: 5px;
      font-weight: 600;
    }
  }

  @media (max-width: 509px) {
    h3 {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  @media (max-width: 320px) {
    h3 {
      font-size: 15px;
    }
  }
`;

const LoginContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin: 10% auto 20px auto;

  h1 {
    margin: 10px 0 10px 0;
  }

  @media (min-width: 300px) and (max-width: 680px) {
    width: 90%;
  }

  @media (min-width: 681px) and (max-width: 880px) {
    width: 70%;
  }

  @media (min-width: 881px) and (max-width: 1024px) {
    width: 60%;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 50%;
  }

  @media (min-width: 1441px) and (max-width: 1700px) {
    width: 40%;
  }

  @media (min-width: 1701px) and (max-width: 1920px) {
    width: 30%;
  }
`;

const StyledInput = styled(TextField)`
  width: 90%;
  margin: 10px 0 10px 0;
`;

const ErrorAlert = styled(Alert)`
  width: 90%;
`;

const SignInButton = styled(Button)`
  color: white;
  width: 90%;
  margin: 25px 0 10px 0;
`;
