import { ArrowBack } from '@mui/icons-material';
import { Alert, Button, IconButton, Paper, styled, TextField, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
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
        errors.name = 'Required';
      }
      if (!values.login) {
        errors.login = 'Required';
      }
      if (!values.password) {
        errors.password = 'Required';
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
    if (appStatus === 'succeeded') {
      navigate(PATH.SIGN_IN);
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }, [appStatus, dispatch, navigate]);

  return (
    <SignUPContainer elevation={8}>
      <SignUPHeader>
        <Tooltip title={'Back to login'}>
          <IconButton onClick={() => navigate(PATH.SIGN_IN)} size={'small'}>
            <ArrowBack fontSize={'small'} />
          </IconButton>
        </Tooltip>
        <h1>Create a new account</h1>
      </SignUPHeader>
      <StyledForm onSubmit={formik.handleSubmit}>
        <SignUPInput
          variant={'outlined'}
          label={'Name'}
          required
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
        />
        <SignUPInput
          variant={'outlined'}
          label={'Login'}
          required
          name="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
        />
        <SignUPInput
          variant={'outlined'}
          label={'Password'}
          required
          autoComplete={'off'}
          type={'password'}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={!!formik.errors.password}
          helperText={formik.errors.password}
        />
        {err && <ErrorAlert severity="error">{err}</ErrorAlert>}
        <SignUPButton
          type="submit"
          disabled={appStatus === 'loading'}
          variant={'contained'}
          color={'success'}
        >
          Sign UP
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
  @media (min-width: 300px) and (max-width: 768px) {
    width: 90%;
  }
  @media (min-width: 769px) and (max-width: 1440px) {
    width: 50%;
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
