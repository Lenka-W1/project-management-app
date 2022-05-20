import React, { useState } from 'react';
import styled from 'styled-components';
import {
  alpha,
  Badge,
  BadgeProps,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Paper,
} from '@mui/material';
import {
  BoardResponseType,
  ColumnResponseType,
  TaskType,
  UserResponseType,
} from '../../../API/API';
import { Edit } from '@mui/icons-material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import { AppStateType } from '../../../BLL/store';
import ConfirmationModal from '../../../components/ModalWindows/ConfirmationModal';
import TaskViewModal from '../../../components/ModalWindows/TaskViewModal/TaskViewModal';
type TaskPropsType = TaskType & { columnId: string; columnName: string };

function Task(props: TaskPropsType) {
  const { id, title, description, done, order, userId, files, columnId, columnName } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openConfirmModal, setOpenConfirmModal] = React.useState<
    ColumnResponseType | BoardResponseType | UserResponseType | TaskType | null
  >(null);
  const [openTaskViewModal, setOpenTaskViewModal] = useState<TaskType | null>(null);
  const isDarkMode = useSelector<AppStateType, 'dark' | 'light'>(
    (state) => state.app.settings.mode
  );
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
      done: done,
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

  return (
    <RootContainer
      elevation={8}
      variant={'outlined'}
      style={
        done
          ? { border: '1px solid green' }
          : isDarkMode
          ? { border: '1px solid #3f51b5' }
          : { border: '1px solid #42a5f5' }
      }
    >
      <StyledBadge
        invisible={!done}
        badgeContent={<CheckCircleIcon color={'success'} fontSize={'small'} />}
      >
        <h4 onClick={toggleTaskViewModal}>{title}</h4>
      </StyledBadge>
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
          Edit
        </MenuItem>
        <MenuItem onClick={deleteTask} disableRipple>
          <DeleteIcon color={'error'} />
          Delete
        </MenuItem>
      </StyledMenu>
      {openConfirmModal && (
        <ConfirmationModal
          open={!!openConfirmModal}
          type={'task'}
          deleteValueId={openConfirmModal.id}
          columnId={columnId}
          deleteValueName={(openConfirmModal as TaskType).title}
          alertTitle={'Delete Task?'}
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
  margin: 0 15px 15px 15px;
  cursor: pointer;

  h4 {
    font-weight: 400;
    width: 170px;
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
const StyledBadge = styled(Badge)<BadgeProps>(({}) => ({
  '& .MuiBadge-badge': {
    left: 220,
    top: -12,
  },
}));
