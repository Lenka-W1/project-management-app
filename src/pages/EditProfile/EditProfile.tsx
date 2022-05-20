import { Box, Button, Paper, styled, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BoardResponseType, ColumnResponseType, UserResponseType } from '../../API/API';
import { AppStatusType, setAppStatus } from '../../BLL/reducers/app-reducer';
import { updateUser } from '../../BLL/reducers/user-reducer';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import ConfirmationModal from '../../components/ModalWindows/ConfirmationModal';
import { PATH } from '../AppRoutes';
import { FormikErrorType } from '../SignUp/SignUpPage';

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatchType>();
  const appStatus = useSelector<AppStateType, AppStatusType>((state) => state.app.status);
  const user = useSelector<
    AppStateType,
    { userId: string; name: string; login: string; password: string }
  >((state) => state.user);

  const [openConfirmModal, setOpenConfirmModal] = React.useState<
    ColumnResponseType | BoardResponseType | UserResponseType | null
  >(null);

  const formik = useFormik({
    initialValues: {
      name: user.name,
      login: user.login,
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
          id: user.userId,
          name: values.name,
          login: values.login,
          password: values.password,
        })
      );
    },
  });

  useEffect(() => {
    if (appStatus === 'successed') {
      navigate(PATH.WELCOME);
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }, [appStatus, dispatch, navigate]);

  const removeUser = () => {
    setOpenConfirmModal({ id: user.userId, name: user.name, login: user.login });
  };

  return (
    <EditContainer elevation={8}>
      <h1>Edit Profile</h1>
      <EditForm onSubmit={formik.handleSubmit}>
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
        <Box>
          <SaveButton variant={'contained'} color={'success'} type={'submit'}>
            Save changes
          </SaveButton>
          <DeleteButton variant={'contained'} color={'error'} onClick={removeUser}>
            Delete user
          </DeleteButton>
        </Box>
      </EditForm>
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'user'}
          deleteValueId={openConfirmModal.id}
          deleteValueName={(openConfirmModal as UserResponseType).name}
          alertTitle={'Delete User?'}
          setOpenConfirmModal={setOpenConfirmModal}
        />
      )}
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
