import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, IconButton, InputAdornment, OutlinedInput, Paper, Tooltip } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Task from './Task';
import { ColumnResponseType, TaskResponseType, TaskType } from '../../../API/API';
import { useDispatch } from 'react-redux';
import { AppDispatchType } from '../../../BLL/store';
import { updateColumn } from '../../../BLL/reducers/column-reducer';
import { useParams } from 'react-router-dom';
import {
  fetchAllTasks,
  TasksInitialStateType,
  updateTask,
} from '../../../BLL/reducers/tasks-reducers';
import FormModal from '../../../components/ModalWindows/FormModal';
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Identifier, XYCoord } from 'dnd-core';
import { ItemTypes } from './ItemTypes';

type ColumnPropsType = {
  index: number;
  columnId: string;
  title: string;
  order: number;
  allTasks: TasksInitialStateType;
  setAllTasksLocal: Dispatch<SetStateAction<TasksInitialStateType>>;
  reorderColumnOnHover: (dragIndex: number, hoverIndex: number) => void;
  moveColumnOnDrop: (dragIndex: number, hoverIndex: number, columnId: string) => void;
  setOpenConfirmModal: (column: ColumnResponseType) => void;
};
interface DragItem {
  index: number;
  columnId: string;
  type: string;
}

function Column(props: ColumnPropsType) {
  const { id } = useParams();
  const {
    columnId,
    title,
    order,
    setOpenConfirmModal,
    index,
    moveColumnOnDrop,
    reorderColumnOnHover,
    allTasks,
    setAllTasksLocal,
  } = props;
  const dispatch = useDispatch<AppDispatchType>();
  const [editMode, setEditMode] = useState(false);
  const [columnName, setColumnName] = useState(title);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [tasks, setTasks] = useState([] as TaskType[]);
  const ref = useRef<HTMLDivElement>(null);
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
  }, [allTasks, columnId]);
  useEffect(() => {
    if (id) dispatch(fetchAllTasks({ boardId: id, columnId: columnId }));
  }, [dispatch, columnId, id, order]);

  const addTask = () => {
    setOpenFormModal(true);
  };
  console.log(tasks);
  const reorderTaskOnHover = (dragIndex: number, hoverIndex: number) => {
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
    if (task && (hoverIndex === 0 ? 1 : hoverIndex + 1) === task.order) return;
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
  const reorderTasksBetweenColumn = (
    dragIndex: number,
    hoverIndex: number,
    sourceColumnId: string,
    hoverColumnId: string,
    taskId: string
  ) => {
    const task = allTasks[sourceColumnId].find((t) => t.id === taskId);
    // if (task) {
    //   // debugger;
    //   setAllTasksLocal((prevState) =>
    //     update(prevState, {
    //       hoverIndex: {
    //         $splice: [[hoverIndex, 0, task]],
    //       },
    //       // sourceColumnId: {
    //       //   $apply: function (tasks = prevState[sourceColumnId]) {
    //       //     update(tasks, {
    //       //       $splice: [[hoverIndex, 1]],
    //       //     });
    //       //     return tasks;
    //       //   },
    //       // },
    //     })
    //   );
    // }
    // work bugs
    if (task) {
      setAllTasksLocal((prevState) => {
        return {
          ...prevState,
          [sourceColumnId]: [...allTasks[sourceColumnId].filter((t) => t.id !== taskId)],
          [hoverColumnId]: [
            ...allTasks[hoverColumnId].slice(0, hoverIndex + 1),
            task,
            ...allTasks[hoverColumnId].slice(hoverIndex + 1),
          ],
        };
      });
    }
    //work
    // if (task)
    //   setAllTasksLocal({
    //     ...allTasks,
    //     [sourceColumnId]: allTasks[sourceColumnId].filter((t) => t.id !== taskId),
    //     [hoverColumnId]: [
    //       ...allTasks[hoverColumnId].slice(0, hoverIndex + 1),
    //       task,
    //       ...allTasks[hoverColumnId].slice(hoverIndex + 1),
    //     ],
    //   });
    // console.log('qqqq');
  };
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.COLUMN,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).x - hoverBoundingRect.left;
      if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      reorderColumnOnHover(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop(item: DragItem) {
      const dragIndex = item.index;
      moveColumnOnDrop(dragIndex, index, columnId);
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: () => {
      return { columnId, index, order };
    },
    collect: (monitor: DragSourceMonitor<{ columnId: string; index: number; order: number }>) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
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
          reorderTaskOnHover={reorderTaskOnHover}
          moveTaskOnDrop={moveTaskOnDrop}
          reorderTasksBetweenColumn={reorderTasksBetweenColumn}
          index={index}
          boardId={id}
        />
      );
    });
  return (
    <RootColumnContainer
      elevation={6}
      ref={ref}
      style={isDragging ? { opacity: 0 } : { opacity: 1 }}
      draggable={!editMode}
      data-handler-id={handlerId}
    >
      <ColumnHeader>
        {!editMode ? (
          <Tooltip title={'Click to change column name'} placement={'top-start'}>
            <h2 onClick={toggleEditMode}>
              {title} - order - {order}
            </h2>
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
  );
}

export default Column;
const RootColumnContainer = styled(Paper)`
  padding: 10px;
  height: fit-content;
  min-width: 300px;
  max-width: 300px;
  margin-right: 17px;
  cursor: move;
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
