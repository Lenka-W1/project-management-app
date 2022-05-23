import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, IconButton, InputAdornment, OutlinedInput, Paper, Tooltip } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Task from './Task';
import { ColumnResponseType, TaskType } from '../../../API/API';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatchType, AppStateType } from '../../../BLL/store';
import { updateColumn } from '../../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';
import {
  fetchAllTasks,
  TasksInitialStateType,
  updateTask,
} from '../../../BLL/reducers/tasks-reducers';
import FormModal from '../../../components/ModalWindows/FormModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

type ColumnPropsType = {
  columnId: string;
  title: string;
  order: number;
  setOpenConfirmModal: (column: ColumnResponseType) => void;
};

function Column(props: ColumnPropsType) {
  const { id } = useParams();
  const { columnId, title, order, setOpenConfirmModal } = props;
  const allTasks = useSelector<AppStateType, TasksInitialStateType>((state) => state.tasks);
  const dispatch = useDispatch<AppDispatchType>();
  const [editMode, setEditMode] = useState(false);
  const [columnName, setColumnName] = useState(title);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [tasks, setTasks] = useState([] as TaskType[]);
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

  useEffect(() => {
    setTasks(allTasks[columnId]);
  }, [allTasks]);
  useEffect(() => {
    if (id) dispatch(fetchAllTasks({ boardId: id, columnId: columnId }));
  }, [dispatch, columnId, id, order]);

  const addTask = () => {
    setOpenFormModal(true);
  };
  const moveTaskOnHover = (dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks: TaskType[]) =>
      update(prevTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTasks[dragIndex]],
        ],
      })
    );
  };
  const moveTaskOnDrop = (dragIndex: number, hoverIndex: number, taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (id && task)
      dispatch(
        updateTask({
          boardId: id,
          columnId: columnId,
          taskId: task.id,
          params: {
            columnId: columnId,
            boardId: id,
            title: task.title,
            order: hoverIndex === 0 ? 1 : hoverIndex + 1,
            userId: task.userId,
            description: task.description,
          },
        })
      );
  };
  const taskElements =
    tasks &&
    tasks.map((t, index) => {
      return (
        <Task
          key={t.id}
          id={t.id}
          title={t.title}
          description={t.description}
          order={t.order}
          files={t.files}
          userId={t.userId}
          columnId={columnId}
          columnName={title}
          moveTaskOnHover={moveTaskOnHover}
          moveTaskOnDrop={moveTaskOnDrop}
          index={index}
          boardId={id}
        />
      );
    });
  return (
    <DndProvider backend={HTML5Backend}>
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
          <Button variant={'contained'} color={'success'} onClick={addTask}>
            Add task
          </Button>
        </TaskContainer>
        {openFormModal && (
          <FormModal
            open={openFormModal}
            setOpen={setOpenFormModal}
            type={'task'}
            columnId={columnId}
          />
        )}
      </RootColumnContainer>
    </DndProvider>
  );
}

export default Column;
const RootColumnContainer = styled(Paper)`
  padding: 10px;
  height: fit-content;
  min-width: 300px;
  max-width: 300px;
  margin-right: 17px;
  h2 {
    padding-left: 10px;
    font-weight: 400;
  }

  .MuiIconButton-sizeSmall {
    visibility: visible;
  }

  div {
    .MuiIconButton-sizeSmall {
      visibility: hidden;
    }
  }

  :hover {
    .MuiIconButton-sizeSmall {
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
  padding-top: 10px;

  button {
    margin: 0 15px 15px;
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
