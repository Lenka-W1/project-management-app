import { Alert, Button, Divider, Link, Paper, styled, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
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
        errors.login = 'Required';
      }
      if (!values.password) {
        errors.password = 'Required';
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
      <h1>Sign In</h1>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledInput
          variant={'outlined'}
          label={'Login'}
          name="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
        />
        <StyledInput
          variant={'outlined'}
          label={'Password'}
          type={'password'}
          name="password"
          autoComplete={'off'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={!!formik.errors.password}
          helperText={formik.errors.password}
        />
        {err && <ErrorAlert severity="error">{err}</ErrorAlert>}
        <SignInButton
          type="submit"
          disabled={appStatus === 'loading'}
          variant={'contained'}
          color={'primary'}
        >
          Login
        </SignInButton>
        <Divider style={{ color: 'gray', width: '90%' }} light={false}>
          or
        </Divider>
        <Typography variant="caption" component="h3">
          <Link color={'green'} underline="hover" href={PATH.SIGN_UP}>
            Sign Up
          </Link>
          if you don&apos;t have an account yet.
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
      margin-right: 5px;
      font-weight: 600;
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

  @media (min-width: 300px) and (max-width: 768px) {
    width: 90%;
  }
  @media (min-width: 769px) and (max-width: 1440px) {
    width: 50%;
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
  width: 90%;
  margin: 25px 0 10px 0;
`;
