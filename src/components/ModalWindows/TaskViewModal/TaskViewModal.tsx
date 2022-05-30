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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    },
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.title) {
        errors.title = t('board_page.task.required');
      }
      if (!values.description) {
        errors.description = t('board_page.task.required');
      }
      if (!values.order) {
        errors.order = t('board_page.task.required');
      }
      if (values.order <= 0) {
        errors.order = t('board_page.task.order_of_value');
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
            },
          })
        );
      handleClose();
    },
  });

  return (
    <div>
      <StyledDialog open={open} onClose={handleClose} maxWidth={'md'}>
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
                {!editMode ? t('board_page.task.button_edit') : t('board_page.task.button_cancel')}
              </Button>
              {!editMode && (
                <Button variant={'text'} color={'error'} onClick={deleteTask}>
                  {t('board_page.task.button_delete')}
                </Button>
              )}
              {editMode && (
                <Button variant={'text'} color={'success'} type={'submit'}>
                  {t('board_page.task.button_save')}
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
    display: flex;
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

        @media (max-width: 698px) {
          margin: 40px 0 20px;
          height: 0;
        }
      }

      @media (max-width: 698px) {
        flex-direction: column;
      }

      @media (max-width: 511px) {
        max-width: 380px;
      }
    }

    @media (max-width: 698px) {
      justify-content: center;
      min-width: 400px;
    }

    @media (max-width: 493px) {
      padding: 20px 15px;
    }

    @media (max-width: 463px) {
      min-width: 380px;
    }

    @media (max-width: 443px) {
      min-width: 350px;
    }

    @media (max-width: 413px) {
      min-width: 300px;
    }

    @media (max-width: 363px) {
      min-width: 200px;
    }
  }
`;
const TaskButtonContainer = styled('div')`
  display: flex;
  flex-direction: column;
  button {
    margin-bottom: 5px;
  }

  @media (max-width: 698px) {
    justify-content: center;
    max-width: 150px;
    align-self: center;
  }
`;
