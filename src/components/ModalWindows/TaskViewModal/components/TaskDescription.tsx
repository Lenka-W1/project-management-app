import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { styled } from '@mui/material';
import { TaskType } from '../../../../API/API';

type TaskDescriptionPropsType = {
  task: TaskType;
  columnName: string;
};
function TaskDescription({ task, columnName }: TaskDescriptionPropsType) {
  return (
    <TaskDescriptionContainer>
      <h3>
        <AssignmentOutlinedIcon color={'primary'} /> {task.title} <span>in column</span>
        {columnName}
      </h3>
      <h3>
        <MenuOutlinedIcon color={'secondary'} />
        {task.description} <span>(description)</span>
      </h3>
      <h3>
        <DynamicFeedIcon color={'warning'} />
        {task.order} <span>(sequence number)</span>
      </h3>
      <h3>
        {task.done ? (
          <>
            <TaskAltOutlinedIcon color={'success'} />
            Done <span>(task status)</span>
          </>
        ) : (
          <>
            <RemoveCircleOutlineOutlinedIcon color={'error'} />
            Not Done <span>(task status)</span>
          </>
        )}
      </h3>
    </TaskDescriptionContainer>
  );
}

export default TaskDescription;

const TaskDescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  h3 {
    width: 360px;
    font-size: 21px;
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      margin: 0 10px 0 10px;
      color: gray;
    }
  }
`;
