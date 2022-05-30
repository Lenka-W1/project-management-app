import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
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
import {
  fetchAllTasks,
  moveTaskBetweenColumns,
  TasksInitialStateType,
  updateTask,
} from '../../../BLL/reducers/tasks-reducers';
import FormModal from '../../../components/ModalWindows/FormModal';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { Identifier, XYCoord } from 'dnd-core';
import { ItemTypes } from './ItemTypes';
import { useTranslation } from 'react-i18next';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

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
  id: string;
  type: string;
  columnId: string;
}
function Column(props: ColumnPropsType) {
  const { t } = useTranslation();
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
  const [hidePreviewTaskOnHover, setHidePreviewTaskOnHover] = useState(true);
  const tasks = allTasks[columnId];
  const ref = useRef<HTMLDivElement>(null);
  const refColumn = useRef<HTMLDivElement>(null);
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
    if (id) dispatch(fetchAllTasks({ boardId: id, columnId: columnId }));
  }, [dispatch, columnId, id, order]);
  const addTask = () => {
    setOpenFormModal(true);
  };
  const reorderTaskOnHover = (dragIndex: number, hoverIndex: number) => {
    setAllTasksLocal((prev: TasksInitialStateType) => {
      const arr = [...prev[columnId]];
      arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, prev[columnId][dragIndex]);

      return { ...prev, [columnId]: arr };
    });
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
  const moveTasksBetweenColumn = useCallback(
    (fromColumnId: string, toColumnId: string, taskId: string) => {
      if (id) {
        dispatch(moveTaskBetweenColumns({ boardId: id, fromColumnId, toColumnId, taskId }));
      }
    },
    []
  );
  const [{ handlerIdColumn }, dropColumn] = useDrop<
    DragItem,
    void,
    { handlerIdColumn: Identifier | null }
  >({
    accept: ItemTypes.COLUMN,
    collect(monitor) {
      return {
        handlerIdColumn: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!refColumn.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = refColumn.current?.getBoundingClientRect();
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
  const [{ handlerId, canDropTask, isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; canDropTask: boolean; isOver: boolean }
  >({
    accept: ItemTypes.TASK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDropTask: monitor.canDrop(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceColumnId = monitor.getItem().columnId;
      if (sourceColumnId === columnId) {
        reorderTaskOnHover(dragIndex, hoverIndex);
      }
      item.index = hoverIndex;
    },
    drop(item: DragItem, monitor) {
      const sourceColumnId = monitor.getItem().columnId;
      const dragTaskId = monitor.getItem().id;
      const dragIndex = item.index;
      moveTaskOnDrop(dragIndex, index, dragTaskId);
      if (sourceColumnId !== columnId) {
        moveTasksBetweenColumn(sourceColumnId, columnId, dragTaskId);
      }
    },
  });
  drag(dropColumn(refColumn));
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
          moveTasksBetweenColumn={moveTasksBetweenColumn}
          setHidePreviewTaskOnHover={setHidePreviewTaskOnHover}
          index={index}
          boardId={id}
        />
      );
    });
  return (
    <div
      ref={refColumn}
      style={isDragging ? { opacity: 0 } : { opacity: 1 }}
      data-handler-id={handlerIdColumn}
    >
      <RootColumnContainer
        elevation={6}
        ref={drop}
        style={canDropTask && isOver ? { border: '1px solid green' } : {}}
        draggable={!editMode}
        data-handler-id={handlerId}
      >
        <ColumnHeader>
          {!editMode ? (
            <Tooltip title={t('board_page.tooltip.change_column')} placement={'top-start'}>
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

          <Tooltip title={t('board_page.tooltip.delete_column')} placement={'top-start'}>
            <IconButton color={'error'} size={'small'} disabled={editMode} onClick={deleteColumn}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </ColumnHeader>
        <TaskContainer>
          {canDropTask && isOver && hidePreviewTaskOnHover && <PreviewTaskTemplate />}
          {taskElements}
          <ColumnFooter>
            <Button variant={'contained'} color={'success'} fullWidth onClick={addTask}>
              {t('board_page.add_task')}
            </Button>
            <Tooltip
              title={t('board_page.task.sequence_number') + ' ' + order}
              placement={'top-start'}
            >
              <DynamicFeedIcon color={'warning'} />
            </Tooltip>
          </ColumnFooter>
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
    </div>
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
    font-size: 20px;
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

  @media (max-width: 719px) {
    min-width: 290px;
    max-width: 290px;
  }

  @media (max-width: 687px) {
    min-width: 280px;
    max-width: 280px;
  }

  @media (max-width: 665px) {
    min-width: 270px;
    max-width: 270px;
  }

  @media (max-width: 643px) {
    min-width: 260px;
    max-width: 260px;
  }

  @media (max-width: 321px) {
    min-width: 258px;
    max-width: 258px;
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

  @media (max-width: 688px) {
    height: 32vh;
  }

  @media (max-width: 555px) {
    height: 25vh;
  }
`;
const ColumnHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  h2 {
    min-height: 40px;
  }
  .MuiOutlinedInput-root {
    height: 40px;
    margin-bottom: 5px;
  }
`;
const ColumnFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  button {
    margin-right: 15px;
    color: white;
  }
`;
const PreviewTaskTemplate = styled.div`
  min-height: 25px;
  margin: 10px;
  border-radius: 5px;
  background-color: gray;
`;
