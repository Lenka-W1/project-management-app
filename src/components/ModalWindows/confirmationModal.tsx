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
import { BoardResponseType } from '../../API/API';
import { AppDispatchType } from '../../BLL/store';
import { removeBoard } from '../../BLL/reducers/board-reducer';

type AlertDialogForDeletePackPropsType = {
  deleteValueName: string;
  deleteValueId: string;
  open: boolean;
  setOpenConfirmModal: (deleteValue: BoardResponseType | null) => void;
  alertTitle: string;
  type: 'board' | 'column' | 'task';
};

function ConfirmationModal(props: AlertDialogForDeletePackPropsType) {
  const dispatch = useDispatch<AppDispatchType>();
  const handleClose = () => {
    props.setOpenConfirmModal(null);
  };

  const removeHandler = () => {
    if (props.type === 'board') {
      dispatch(removeBoard(props.deleteValueId));
      props.setOpenConfirmModal(null);
    } else if (props.type === 'column') {
      //dispatch delete column
      props.setOpenConfirmModal(null);
    } else {
      //dispatch delete task
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
            {props.type === 'board' ? (
              <span>
                Do you really want to remove <strong>{props.deleteValueName} </strong>
                {props.type}?
              </span>
            ) : (
              <span>
                Do you really want to remove - <strong>Column - {props.deleteValueName}</strong>?
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
