import { ArrowBack } from '@mui/icons-material';
import { Alert, Button, IconButton, Paper, styled, TextField, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppStatusType, setAppStatus } from '../../BLL/reducers/app-reducer';
import { signUp } from '../../BLL/reducers/auth-reducer';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import Preloader from '../../components/Preloader/Preloader';
import { PATH } from '../AppRoutes';

export type FormikErrorType = {
  name?: string;
  login?: string;
  password?: string;
};

function SignUpPage() {
  const { t } = useTranslation();
  const appStatus = useSelector<AppStateType, AppStatusType>((state) => state.app.status);
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  const err = useSelector<AppStateType, string | null>((state) => state.app.error);

  const dispatch = useDispatch<AppDispatchType>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      login: '',
      password: '',
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.name) {
        errors.name = t('sign_up_page.form.required');
      }
      if (!values.login) {
        errors.login = t('sign_up_page.form.required');
      }
      if (!values.password) {
        errors.password = t('sign_up_page.form.required');
      }
      return errors;
    },
    onSubmit: async (values) => {
      dispatch(
        signUp({
          name: values.name,
          login: values.login,
          password: values.password,
        })
      );
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate(PATH.MAIN);
    }
  }, [isLoggedIn, navigate]);
  useEffect(() => {
    if (appStatus === 'successed') {
      navigate(PATH.SIGN_IN);
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }, [appStatus, dispatch, navigate]);

  return (
    <SignUPContainer elevation={8}>
      <SignUPHeader>
        <Tooltip title={t('sign_up_page.form.back_button')}>
          <IconButton onClick={() => navigate(PATH.SIGN_IN)} size={'small'}>
            <ArrowBack fontSize={'small'} />
          </IconButton>
        </Tooltip>
        <h1>{t('sign_up_page.sign_up_page_title')}</h1>
      </SignUPHeader>
      <StyledForm onSubmit={formik.handleSubmit}>
        <SignUPInput
          variant={'outlined'}
          label={t('sign_up_page.form.name_field')}
          required
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
        />
        <SignUPInput
          variant={'outlined'}
          label={t('sign_up_page.form.login_field')}
          required
          name="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
        />
        <SignUPInput
          variant={'outlined'}
          label={t('sign_up_page.form.password_field')}
          required
          autoComplete={'off'}
          type={'password'}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={!!formik.errors.password}
          helperText={formik.errors.password}
        />
        {err && <ErrorAlert severity="error">{t('sign_up_page.form.error_message')}</ErrorAlert>}
        <SignUPButton
          type="submit"
          disabled={appStatus === 'loading'}
          variant={'contained'}
          color={'success'}
        >
          {t('sign_up_page.form.button_login')}
        </SignUPButton>
      </StyledForm>
      {appStatus === 'loading' && <Preloader />}
    </SignUPContainer>
  );
}

export default SignUpPage;

const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
`;
const SignUPContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin: 10% auto 20px auto;

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
const SignUPHeader = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  h1 {
    margin: 10px auto;
  }
  button {
    margin-left: 10px;
  }
`;
const SignUPInput = styled(TextField)`
  width: 90%;
  margin: 10px 0 10px 0;
`;
const SignUPButton = styled(Button)`
  width: 90%;
  margin: 25px 0 25px 0;
`;
const ErrorAlert = styled(Alert)`
  width: 90%;
`;
