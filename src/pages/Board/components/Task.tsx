import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styled from 'styled-components';
import { alpha, IconButton, Menu, MenuItem, MenuProps, Paper } from '@mui/material';
import {
  BoardResponseType,
  ColumnResponseType,
  TaskType,
  UserResponseType,
} from '../../../API/API';
import { Edit } from '@mui/icons-material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '../../../components/ModalWindows/ConfirmationModal';
import TaskViewModal from '../../../components/ModalWindows/TaskViewModal/TaskViewModal';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Identifier, XYCoord } from 'dnd-core';
import { useSelector } from 'react-redux';
import { AppStateType } from '../../../BLL/store';
import { useTranslation } from 'react-i18next';

type TaskPropsType = TaskType & {
  columnId: string;
  columnName: string;
  reorderTaskOnHover: (dragIndex: number, hoverIndex: number) => void;
  moveTaskOnDrop: (dragIndex: number, hoverIndex: number, taskId: string) => void;
  moveTasksBetweenColumn: (fromColumnId: string, toColumnId: string, taskId: string) => void;
  setHidePreviewTaskOnHover: Dispatch<SetStateAction<boolean>>;
  boardId: string | undefined;
  index: number;
};
interface DragItem {
  index: number;
  id: string;
  type: string;
  columnId: string;
}

function Task(props: TaskPropsType) {
  const {
    id,
    title,
    description,
    order,
    userId,
    files,
    columnId,
    columnName,
    index,
    reorderTaskOnHover,
    moveTaskOnDrop,
    setHidePreviewTaskOnHover,
  } = props;
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openConfirmModal, setOpenConfirmModal] = React.useState<
    ColumnResponseType | BoardResponseType | UserResponseType | TaskType | null
  >(null);
  const [openTaskViewModal, setOpenTaskViewModal] = useState<TaskType | null>(null);
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseTaskDropMenu = () => {
    setAnchorEl(null);
  };
  const deleteTask = () => {
    setOpenConfirmModal({
      id: id,
      title: title,
      order: order,
      description: description,
      userId: userId,
      files: files,
    });
    handleCloseTaskDropMenu();
  };
  const toggleTaskViewModal = () => {
    if (openTaskViewModal) {
      setOpenTaskViewModal(null);
      handleCloseTaskDropMenu();
    } else {
      setOpenTaskViewModal({ ...props });
      handleCloseTaskDropMenu();
    }
  };
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.TASK,
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
      const sourceColumnId = monitor.getItem().columnId;
      if (sourceColumnId === columnId && dragIndex === hoverIndex) {
        return;
      }
      if (sourceColumnId === columnId) {
        setHidePreviewTaskOnHover(false);
      }
      if (sourceColumnId !== columnId) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      if (sourceColumnId === columnId) {
        reorderTaskOnHover(dragIndex, hoverIndex);
      }
      item.index = hoverIndex;
    },
    drop(item: DragItem) {
      const dragIndex = item.index;
      moveTaskOnDrop(dragIndex, index, id);
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: () => {
      return { id, index, order, columnId };
    },
    collect: (
      monitor: DragSourceMonitor<{ id: string; index: number; order: number; columnId: string }>
    ) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <RootContainer
      elevation={isDarkMode === 'dark' ? 0 : 24}
      variant={'elevation'}
      ref={ref}
      style={isDragging ? { opacity: 0 } : { opacity: 1 }}
      data-handler-id={handlerId}
    >
      <h4 onClick={toggleTaskViewModal}>
        {title} - order {order}
      </h4>
      <IconButton
        onClick={handleClick}
        color={'primary'}
        style={Boolean(anchorEl) ? { visibility: 'visible' } : {}}
      >
        <ExpandCircleDownIcon style={{ color: 'gray' }} />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseTaskDropMenu}
      >
        <MenuItem onClick={toggleTaskViewModal} disableRipple>
          <Edit color={'primary'} />
          {t('board_page.task.edit')}
        </MenuItem>
        <MenuItem onClick={deleteTask} disableRipple>
          <DeleteIcon color={'error'} />
          {t('board_page.task.delete')}
        </MenuItem>
      </StyledMenu>
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'task'}
          deleteValueId={openConfirmModal.id}
          columnId={columnId}
          deleteValueName={(openConfirmModal as TaskType).title}
          alertTitle={t('board_page.task.delete_task')}
          setOpenConfirmModal={setOpenConfirmModal}
        />
      )}
      {openTaskViewModal && (
        <TaskViewModal
          task={props}
          columnId={columnId}
          columnName={columnName}
          open={!!openTaskViewModal}
          setOpenTaskViewModal={toggleTaskViewModal}
          deleteTask={deleteTask}
        />
      )}
    </RootContainer>
  );
}

export default Task;

const RootContainer = styled(Paper)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 10px;
  cursor: move;

  h4 {
    font-weight: 400;
    cursor: pointer;
  }

  .MuiIconButton-colorPrimary {
    margin: 0;
    padding: 0;
    visibility: hidden;
  }

  :hover {
    h4 {
      color: gray;
    }

    .MuiIconButton-root {
      visibility: visible;
    }
  }
`;

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(() => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 180,
    color: 'gray',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: '10px',
      },
      '&:active': {
        backgroundColor: alpha('#42a5f5', 0.5),
      },
    },
  },
}));
