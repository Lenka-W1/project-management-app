import React from 'react';
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
import { useDispatch } from 'react-redux';
import { AppDispatchType } from '../../BLL/store';
import { createBoard, removeBoard } from '../../BLL/reducers/board-reducer';
import { createColumn } from '../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';

type FormModalPropsType = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  type: 'board' | 'column';
};
type FormikErrorType = {
  title?: string;
  description?: string;
  order?: string;
};
function FormModal(props: FormModalPropsType) {
  const { open, setOpen, type } = props;
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatchType>();
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      order: 0,
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
      return errors;
    },
    onSubmit: (values) => {
      if (type === 'board') {
        dispatch(createBoard({ title: values.title, description: values.description }));
      } else {
        if (id) dispatch(createColumn({ boardId: id, title: values.title, order: values.order }));
      }
      setOpen(false);
    },
  });
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{type === 'board' ? 'Create a new Board' : 'Create a new Column'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {type === 'board'
              ? 'To create a new board, please enter your title and description here.'
              : 'To create a new column, please enter your title and order here.'}
          </DialogContentText>
          <StyledForm onSubmit={formik.handleSubmit}>
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
            {type === 'board' && (
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
            )}
            {type === 'column' && (
              <TextField
                type={'number'}
                margin="dense"
                id="order"
                label="Order"
                fullWidth
                variant="standard"
                value={formik.values.order}
                onChange={formik.handleChange}
                error={!!formik.errors.order}
                helperText={formik.errors.order}
              />
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
