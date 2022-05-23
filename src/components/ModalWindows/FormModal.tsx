import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
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
          errors.title = 'Required';
        }
        if (!values.description) {
          errors.description = 'Required';
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
          errors.title = 'Required';
        }
        if (!values.description) {
          errors.description = 'Required';
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
          {type === 'board' && 'Create a new Board'}
          {type === 'column' && 'Create a new Column'}
          {type === 'task' && 'Create a new Task'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === 'board' &&
              'To create a new board, please enter your title and description here.'}
            {type === 'column' && 'To create a new column, please enter your title and order here.'}
            {type === 'task' &&
              'To create a new task, please enter your title, description, order and status (is done?) here.'}
          </DialogContentText>
          <StyledForm onSubmit={formik.handleSubmit}>
            {type === 'board' ? (
              <>
                <TextField
                  margin="dense"
                  id="title"
                  label="Title"
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
                  label="Description"
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
                  label="Title"
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
                  label="Description"
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
              Create
            </Button>
            <Button onClick={handleClose} color={'error'} variant={'outlined'}>
              Cancel
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
