import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { BoardResponseType, ColumnResponseType } from '../../API/API';
import { AppDispatchType } from '../../BLL/store';
import { removeBoard } from '../../BLL/reducers/board-reducer';
import { removeColumn } from '../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';

type AlertDialogForDeletePackPropsType = {
  deleteValueName: string;
  deleteValueId: string;
  open: boolean;
  setOpenConfirmModal: (deleteValue: BoardResponseType | ColumnResponseType | null) => void;
  alertTitle: string;
  type: 'board' | 'column' | 'task' | 'user';
};

function ConfirmationModal(props: AlertDialogForDeletePackPropsType) {
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
      //dispatch delete task
      props.setOpenConfirmModal(null);
    } else {
      // dispatch delete user
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
                Do you really want to remove <strong>{props.deleteValueName} </strong>
                {props.type}?
              </span>
            )}
            {props.type === 'column' && (
              <span>
                Do you really want to remove <strong>{props.deleteValueName} </strong>
                {props.type}?
              </span>
            )}
            {props.type === 'user' && (
              <span>
                Do you really want delete <strong>{props.deleteValueName} </strong>
                {props.type}?
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ margin: '0 10px 10px 0' }}>
          <Button onClick={handleClose} variant={'outlined'}>
            Cancel
          </Button>
          <Button color={'error'} variant={'contained'} onClick={removeHandler}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmationModal;
