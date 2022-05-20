import * as React from 'react';
import { useState } from 'react';
import { TaskType } from '../../../API/API';
import { Button, Dialog, DialogContent, Divider, styled } from '@mui/material';
import TaskDescriptionEditForm from './components/TaskDescriptionEditForm';
import { useFormik } from 'formik';
import TaskDescription from './components/TaskDescription';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../../BLL/store';
import { updateTask } from '../../../BLL/reducers/tasks-reducers';

type FormikErrorType = {
  title?: string;
  description?: string;
  order?: string;
};
type TaskViewModalPropsType = {
  columnId: string;
  columnName: string;
  task: TaskType;
  open: boolean;
  setOpenTaskViewModal: (isOpen: TaskType | null) => void;
  deleteTask: () => void;
};

export default function TaskViewModal(props: TaskViewModalPropsType) {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatchType>();
  const userId = useSelector<AppStateType, string>((state) => state.user.userId);
  const { task, open, setOpenTaskViewModal, deleteTask, columnId, columnName } = props;
  const [editMode, setEditMode] = useState(false);
  const handleClose = () => {
    setOpenTaskViewModal(null);
  };
  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const formik = useFormik({
    initialValues: {
      title: task.title,
      description: task.description,
      order: task.order,
      done: task.done,
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.title) {
        errors.title = 'Required';
      }
      if (!values.description) {
        errors.description = 'Required';
      }
      if (!values.order) {
        errors.order = 'Required';
      }
      if (values.order <= 0) {
        errors.order = 'Value of order should be more 0';
      }
      return errors;
    },
    onSubmit: (values) => {
      if (id)
        dispatch(
          updateTask({
            boardId: id,
            columnId: columnId,
            taskId: task.id,
            params: {
              boardId: id,
              columnId: columnId,
              userId: userId,
              description: values.description,
              title: values.title,
              order: values.order,
              done: values.done,
            },
          })
        );
      handleClose();
    },
  });

  return (
    <div>
      <StyledDialog open={open} onClose={handleClose}>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            {!editMode ? (
              <TaskDescription task={task} columnName={columnName} />
            ) : (
              <TaskDescriptionEditForm
                formikValues={formik.values}
                formikErrors={formik.errors}
                formikHandleChange={formik.handleChange}
              />
            )}
            <Divider orientation="horizontal" />
            <TaskButtonContainer>
              <Button
                variant={'text'}
                color={!editMode ? 'primary' : 'error'}
                onClick={handleEditMode}
              >
                {!editMode ? 'Edit task' : 'Cancel'}
              </Button>
              {!editMode && (
                <Button variant={'text'} color={'error'} onClick={deleteTask}>
                  Delete task
                </Button>
              )}
              {editMode && (
                <Button variant={'text'} color={'success'} type={'submit'}>
                  Save changes
                </Button>
              )}
            </TaskButtonContainer>
          </form>
        </DialogContent>
      </StyledDialog>
    </div>
  );
}

const StyledDialog = styled(Dialog)`
  .MuiDialogContent-root {
    min-width: 600px;
    min-height: 200px;
    form {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      svg {
        margin-right: 10px;
      }
      hr {
        margin: 0 20px 0 20px;
        height: 145px;
        border-width: 1px;
      }
    }
  }
`;
const TaskButtonContainer = styled('div')`
  display: flex;
  flex-direction: column;

  button {
    margin-bottom: 5px;
  }
`;
