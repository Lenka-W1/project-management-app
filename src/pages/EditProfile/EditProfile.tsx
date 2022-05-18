import { Box, Button, Paper, styled, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../BLL/reducers/auth-reducer';
import { updateUser } from '../../BLL/reducers/user-reducer';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { FormikErrorType } from '../SignUp/SignUpPage';

function EditProfile() {
  const dispatch = useDispatch<AppDispatchType>();
  const name = useSelector<AppStateType, string>((state) => state.auth.name);
  const login = useSelector<AppStateType, string>((state) => state.auth.login);

  const formik = useFormik({
    initialValues: {
      name: name,
      login: login,
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
        updateUser({
          name: values.name,
          login: values.login,
          password: values.password,
        })
      );
      formik.resetForm();
    },
  });

  return (
    <EditContainer elevation={8}>
      <h1>Edit Profile</h1>
      <EditForm>
        <EditField
          variant={'outlined'}
          label={'Name'}
          required
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
        />
        <EditField
          variant={'outlined'}
          label={'Login'}
          required
          name="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
        />
        <EditField
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
      </EditForm>
      <Box>
        <SaveButton variant={'contained'} color={'success'} onClick={() => formik.handleSubmit}>
          Save changes
        </SaveButton>
        <DeleteButton variant={'contained'} color={'error'}>
          Delete user
        </DeleteButton>
      </Box>
    </EditContainer>
  );
}

export default EditProfile;

const EditContainer = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '30%',
  margin: '10% auto 20px auto',
  '@media (min-width: 300px) and (max-width: 768px)': {
    width: '90%',
  },
  '@media (min-width: 769px) and (max-width: 1440px)': {
    width: '50%',
  },
});

const EditForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  alignItems: 'center',
  width: '100%',
});

const EditField = styled(TextField)({
  width: '90%',
  margin: '10px 0 10px',
});

const SaveButton = styled(Button)({
  margin: '15px 15px 25px',
});

const DeleteButton = styled(Button)({
  margin: '15px 15px 25px',
});
