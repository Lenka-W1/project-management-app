import { Box, Button, Paper, styled, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        errors.name = `${t('edit_profile_page.form.required')}`;
      }
      if (!values.login) {
        errors.login = `${t('edit_profile_page.form.required')}`;
      }
      if (!values.password) {
        errors.password = `${t('edit_profile_page.form.required')}`;
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
      <h1>{t('edit_profile_page.profile_edit_page_title')}</h1>
      <EditForm onSubmit={formik.handleSubmit}>
        <EditField
          variant={'outlined'}
          label={t('edit_profile_page.form.name_field')}
          required
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
        />
        <EditField
          variant={'outlined'}
          label={t('edit_profile_page.form.login_field')}
          required
          name="login"
          value={formik.values.login}
          onChange={formik.handleChange}
          error={!!formik.errors.login}
          helperText={formik.errors.login}
        />
        <EditField
          variant={'outlined'}
          label={t('edit_profile_page.form.password_field')}
          required
          autoComplete={'off'}
          type={'password'}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={!!formik.errors.password}
          helperText={formik.errors.password}
        />
        <ButtonsBlock>
          <SaveButton variant={'contained'} color={'success'} type={'submit'}>
            {t('edit_profile_page.form.save_changes')}
          </SaveButton>
          <DeleteButton variant={'contained'} color={'error'} onClick={removeUser}>
            {t('edit_profile_page.form.delete_user')}
          </DeleteButton>
        </ButtonsBlock>
      </EditForm>
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'user'}
          deleteValueId={openConfirmModal.id}
          deleteValueName={(openConfirmModal as UserResponseType).name}
          alertTitle={t('edit_profile_page.modal_window.delete_user')}
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

  '@media (min-width: 300px) and (max-width: 680px)': {
    width: '90%',
  },

  '@media (min-width: 681px) and (max-width: 880px)': {
    width: '70%',
  },

  '@media (min-width: 881px) and (max-width: 1024px)': {
    width: '60%',
  },

  '@media (min-width: 1025px) and (max-width: 1440px)': {
    width: '50%',
  },

  '@media (min-width: 1441px) and (max-width: 1700px)': {
    width: '40%',
  },

  '@media (min-width: 1701px) and (max-width: 1920px)': {
    width: '30%',
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

const ButtonsBlock = styled(Box)({
  '@media (max-width: 720px)': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const SaveButton = styled(Button)({
  color: 'white',
  margin: '15px 15px 25px',
});

const DeleteButton = styled(Button)({
  margin: '15px 15px 25px',
});
