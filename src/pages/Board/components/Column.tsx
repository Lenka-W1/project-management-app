import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, IconButton, InputAdornment, OutlinedInput, Paper, Tooltip } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Task from './Task';
import { ColumnResponseType, TaskType } from '../../../API/API';
import { useDispatch } from 'react-redux';
import { AppDispatchType } from '../../../BLL/store';
import { updateColumn } from '../../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';

type ColumnPropsType = {
  columnId: string;
  title: string;
  order: number;
  tasks: Array<TaskType>;
  setOpenConfirmModal: (column: ColumnResponseType) => void;
};

function Column(props: ColumnPropsType) {
  const { id } = useParams();
  const { columnId, title, order, tasks, setOpenConfirmModal } = props;
  const dispatch = useDispatch<AppDispatchType>();
  const [editMode, setEditMode] = useState(false);
  const [columnName, setColumnName] = useState(title);
  const deleteColumn = () => {
    setOpenConfirmModal({ id: columnId, title: title, order: order });
  };
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  const changeColumnTitle = () => {
    if (id) {
      dispatch(updateColumn({ columnId: columnId, boardId: id, title: columnName, order: order }));
    }
    setEditMode(!editMode);
  };
  const columnNameHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setColumnName(e.currentTarget.value);
  };
  const taskElements = tasks.map((t) => {
    return (
      <Task
        key={t.id}
        id={t.id}
        title={t.title}
        description={t.description}
        order={t.order}
        done={t.done}
        files={t.files}
        userId={t.userId}
      />
    );
  });
  return (
    <RootColumnContainer elevation={6}>
      <ColumnHeader>
        {!editMode ? (
          <Tooltip title={'Click to change column name'} placement={'top-start'}>
            <h2 onClick={toggleEditMode}>{title}</h2>
          </Tooltip>
        ) : (
          <OutlinedInput
            id="outlined-adornment-password"
            size={'small'}
            onChange={(e) => columnNameHandler(e)}
            value={columnName}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={changeColumnTitle} color={'success'} edge="end">
                  <DoneIcon />
                </IconButton>
                <IconButton onClick={toggleEditMode} color={'error'} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        )}

        <Tooltip title="Delete column" placement={'top-start'}>
          <IconButton color={'error'} size={'small'} disabled={editMode} onClick={deleteColumn}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      </ColumnHeader>
      <TaskContainer>
        {taskElements}
        <Button variant={'contained'} color={'success'}>
          Add task
        </Button>
      </TaskContainer>
    </RootColumnContainer>
  );
}

export default Column;
const RootColumnContainer = styled(Paper)`
  padding: 10px;
  min-width: 300px;
  max-width: 300px;
  margin-right: 17px;

  h2 {
    padding-left: 10px;
    font-weight: 400;
  }

  .MuiButton-contained {
    visibility: visible;
  }

  div {
    button {
      visibility: hidden;
    }
  }

  :hover {
    button {
      visibility: visible;
    }
  }
  button {
    float: bottom;
  }
`;
const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;

  button {
    margin-right: 10px;
    color: white;
  }

  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    background: gray;
    border-radius: 20px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #3f51b5;
    border-radius: 20px;
  }
`;
const ColumnHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  h2 {
    height: 40px;
    margin-bottom: 5px;
  }
  .MuiOutlinedInput-root {
    height: 40px;
    margin-bottom: 5px;
  }
`;
