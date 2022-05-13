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

type FormModalPropsType = {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};
type FormikErrorType = {
  title?: string;
  description?: string;
};
function FormModal(props: FormModalPropsType) {
  const { open, setOpen } = props;
  const dispatch = useDispatch<AppDispatchType>();
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.title) {
        errors.title = 'Required';
      }
      if (!values.description) {
        errors.description = 'Required';
      }
      return errors;
    },
    onSubmit: (values) => {
      dispatch(createBoard(values));
      setOpen(false);
    },
  });
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new board, please enter your title and description here.
          </DialogContentText>
          <StyledForm onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
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
              autoFocus
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
