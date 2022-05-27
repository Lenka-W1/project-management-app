import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { styled } from '@mui/material';
import { TaskType } from '../../../../API/API';
import { useTranslation } from 'react-i18next';

type TaskDescriptionPropsType = {
  task: TaskType;
  columnName: string;
};
function TaskDescription({ task, columnName }: TaskDescriptionPropsType) {
  const { t } = useTranslation();
  return (
    <TaskDescriptionContainer>
      <h3>
        <AssignmentOutlinedIcon color={'primary'} /> {task.title}{' '}
        <span>{t('board_page.task.in_column')}</span>
        {columnName}
      </h3>
      <h3>
        <MenuOutlinedIcon color={'secondary'} />
        {task.description} <span>({t('board_page.task.description')})</span>
      </h3>
      <h3>
        <DynamicFeedIcon color={'warning'} />
        {task.order} <span>({t('board_page.task.sequence_number')})</span>
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
