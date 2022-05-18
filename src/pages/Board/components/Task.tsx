import React from 'react';
import styled from 'styled-components';
import { Paper } from '@mui/material';
import { TaskType } from '../../../API/API';

type TaskPropsType = TaskType;
function Task(props: TaskPropsType) {
  const { id, title, description, done, order, userId, files } = props;
  return (
    <RootContainer elevation={8} variant={'outlined'}>
      <h4>{title}</h4>
    </RootContainer>
  );
}

export default Task;

const RootContainer = styled(Paper)`
  padding: 10px;
  margin: 0 10px 10px 0;
  h2 {
    font-weight: 400;
  }
`;
