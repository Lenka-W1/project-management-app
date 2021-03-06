import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../BLL/store';
import { createBoard } from '../../BLL/reducers/board-reducer';
import { createColumn } from '../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';
import { createTask } from '../../BLL/reducers/tasks-reducers';
import { useTranslation } from 'react-i18next';

type FormModalPropsType = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  type: 'board' | 'column' | 'task';
  columnId?: string;
};
type FormikErrorType = {
  title?: string;
  description?: string;
  order?: string;
  done?: boolean;
};
function FormModal(props: FormModalPropsType) {
  const { t } = useTranslation();
  const { open, setOpen, type, columnId } = props;
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatchType>();
  const userId = useSelector<AppStateType, string>((state) => state.user.userId);
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      order: 1,
      done: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (type === 'board') {
        if (!values.title) {
          errors.title = t('form_modal.required');
        }
        if (!values.description) {
          errors.description = t('form_modal.required');
        }
      }
      if (type === 'column') {
        if (!values.order) {
          errors.order = 'Required';
        }
        if (values.order <= 0) {
          errors.order = 'Value of order should be more 0';
        }
      }
      if (type === 'task') {
        if (!values.title) {
          errors.title = t('form_modal.required');
        }
        if (!values.description) {
          errors.description = t('form_modal.required');
        }
      }
      return errors;
    },
    onSubmit: (values) => {
      if (type === 'board') {
        dispatch(createBoard({ title: values.title, description: values.description }));
      } else if (type === 'column') {
        if (id) dispatch(createColumn({ boardId: id, title: values.title }));
      } else {
        if (id && columnId)
          dispatch(
            createTask({
              boardId: id,
              columnId: columnId,
              param: {
                title: values.title,
                userId: userId,
                description: values.description,
              },
            })
          );
      }
      setOpen(false);
    },
  });

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {type === 'board' && t('form_modal.board.create_board')}
          {type === 'column' && t('form_modal.column.create_column')}
          {type === 'task' && t('form_modal.task.create_task')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === 'board' && t('form_modal.board.note')}
            {type === 'column' && t('form_modal.column.note')}
            {type === 'task' && t('form_modal.task.note')}
          </DialogContentText>
          <StyledForm onSubmit={formik.handleSubmit}>
            {type === 'board' ? (
              <>
                <TextField
                  margin="dense"
                  id="title"
                  label={t('form_modal.title')}
                  fullWidth
                  variant="standard"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={!!formik.errors.title}
                  helperText={formik.errors.title}
                />
                <TextField
                  margin="dense"
                  id="description"
                  label={t('form_modal.description')}
                  fullWidth
                  variant="standard"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={!!formik.errors.description}
                  helperText={formik.errors.description}
                />
              </>
            ) : (
              <>
                <TextField
                  margin="dense"
                  id="title"
                  label={t('form_modal.title')}
                  fullWidth
                  variant="standard"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={!!formik.errors.title}
                  helperText={formik.errors.title}
                />
              </>
            )}
            {type === 'task' && (
              <>
                <TextField
                  margin="dense"
                  id="description"
                  label={t('form_modal.description')}
                  fullWidth
                  variant="standard"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={!!formik.errors.description}
                  helperText={formik.errors.description}
                />
              </>
            )}
            <Button type="submit" color={'success'} variant={'contained'}>
              {t('form_modal.button_create')}
            </Button>
            <Button onClick={handleClose} color={'error'} variant={'outlined'}>
              {t('form_modal.button_cancel')}
            </Button>
          </StyledForm>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FormModal;

const StyledForm = styled('form')`
  button {
    float: right;
    margin: 10px 5px 0 0;
  }
`;
