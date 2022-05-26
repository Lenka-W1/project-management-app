import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { BoardResponseType, ColumnResponseType, TaskType, UserResponseType } from '../../API/API';
import { AppDispatchType } from '../../BLL/store';
import { removeBoard } from '../../BLL/reducers/board-reducer';
import { removeColumn } from '../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';
import { deleteUser } from '../../BLL/reducers/user-reducer';
import { removeTask } from '../../BLL/reducers/tasks-reducers';
import { useTranslation } from 'react-i18next';

type AlertDialogForDeletePackPropsType = {
  deleteValueName: string;
  deleteValueId: string;
  columnId?: string;
  open: boolean;
  setOpenConfirmModal: (
    deleteValue: BoardResponseType | ColumnResponseType | UserResponseType | TaskType | null
  ) => void;
  alertTitle: string;
  type: 'board' | 'column' | 'task' | 'user';
};

function ConfirmationModal(props: AlertDialogForDeletePackPropsType) {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatchType>();
  const handleClose = () => {
    props.setOpenConfirmModal(null);
  };

  const removeHandler = () => {
    if (props.type === 'board') {
      dispatch(removeBoard(props.deleteValueId));
      props.setOpenConfirmModal(null);
    } else if (props.type === 'column') {
      if (id) dispatch(removeColumn({ columnId: props.deleteValueId, boardId: id }));
      props.setOpenConfirmModal(null);
    } else if (props.type === 'task') {
      if (id && props.columnId) {
        dispatch(
          removeTask({
            boardId: id,
            columnId: props.columnId,
            taskId: props.deleteValueId,
          })
        );
      }
      props.setOpenConfirmModal(null);
    } else if (props.type === 'user') {
      dispatch(deleteUser(props.deleteValueId));
      props.setOpenConfirmModal(null);
    }
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.alertTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.type === 'board' && (
              <span>
                {t('confirm_modal.remove')} <strong>{props.deleteValueName} </strong>
                {t('confirm_modal.remove_board')}?
              </span>
            )}
            {props.type === 'column' && (
              <span>
                {t('confirm_modal.remove')} <strong>{props.deleteValueName} </strong>
                {props.type}?
              </span>
            )}
            {props.type === 'user' && (
              <span>
                {t('confirm_modal.remove')} <strong>{props.deleteValueName} </strong>
                {t('confirm_modal.remove_user')}?
              </span>
            )}
            {props.type === 'task' && (
              <span>
                {t('confirm_modal.remove')} <strong>{props.deleteValueName} </strong>
                {props.type}?
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ margin: '0 10px 10px 0' }}>
          <Button onClick={handleClose} variant={'outlined'}>
            {t('confirm_modal.cancel')}
          </Button>
          <Button color={'error'} variant={'contained'} onClick={removeHandler}>
            {t('confirm_modal.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmationModal;
