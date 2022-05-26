import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
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
    </TaskDescriptionContainer>
  );
}

export default TaskDescription;

const TaskDescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  h3 {
    width: 400px;
    font-size: 21px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 10px;
    span {
      margin: 0 10px 0 10px;
      color: gray;
    }
  }
`;
