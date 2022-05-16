import React from 'react';
import { Button, Card, styled, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { BoardResponseType } from '../../../API/API';
import { useDispatch } from 'react-redux';
import { AppDispatchType } from '../../../BLL/store';
import { updateBoard } from '../../../BLL/reducers/board-reducer';

type FormikErrorType = {
  title?: string;
  description?: string;
};
function BoardUpdForm(props: BoardResponseType & { toggleEditMode: () => void }) {
  const { id, title, description, toggleEditMode } = props;
  const dispatch = useDispatch<AppDispatchType>();
  const formik = useFormik({
    initialValues: {
      title: title,
      description: description,
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
      dispatch(updateBoard({ id: id, title: values.title, description: values.description }));
      toggleEditMode();
    },
  });
  const closeEditMode = () => {
    toggleEditMode();
  };
  return (
    <StyledBoardForm>
      <StyledForm onSubmit={formik.handleSubmit}>
        <TextField
          hiddenLabel
          id="title"
          fullWidth
          variant="standard"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={!!formik.errors.title}
          helperText={formik.errors.title}
        />
        <TextField
          hiddenLabel
          id="description"
          fullWidth
          variant="standard"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={!!formik.errors.description}
          helperText={formik.errors.description}
        />
        <FormButtonsContainer>
          <Button onClick={closeEditMode} size={'small'} color={'error'} variant={'contained'}>
            Cancel
          </Button>
          <Button type="submit" size={'small'} color={'success'} variant={'contained'}>
            Update
          </Button>
        </FormButtonsContainer>
      </StyledForm>
    </StyledBoardForm>
  );
}

export default BoardUpdForm;

const StyledBoardForm = styled(Card)`
  width: 300px;
  margin: 17px;
  position: relative;
  padding: 5px 10px;
  background-image: url(https://ichef.bbci.co.uk/images/ic/1200x675/p01lymgh.jpg);
  background-position: center;
  background-size: cover;
`;
const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
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
  button {
    margin-left: 10px;
  }
  input,
  input:after {
    color: white;
    border-bottom: 2px solid white;
  }
`;
const FormButtonsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`;
