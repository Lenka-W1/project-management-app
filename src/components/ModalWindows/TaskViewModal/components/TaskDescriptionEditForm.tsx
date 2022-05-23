import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { styled, TextField } from '@mui/material';

type TaskDescriptionPropsType = {
  formikValues: {
    title: string;
    description: string;
    order: number;
  };
  formikErrors: {
    title?: string;
    description?: string;
    order?: string;
  };
  formikHandleChange: {
    (e: React.ChangeEvent<never>): void;
    <T_1 = string | React.ChangeEvent<never>>(field: T_1): T_1 extends React.ChangeEvent<never>
      ? void
      : (e: string | React.ChangeEvent<never>) => void;
  };
};
function TaskDescriptionEditForm({
  formikValues,
  formikErrors,
  formikHandleChange,
}: TaskDescriptionPropsType) {
  return (
    <TaskDescriptionContainer>
      <h3>
        <AssignmentOutlinedIcon color={'primary'} />
        <TextField
          id="title"
          fullWidth
          variant="standard"
          value={formikValues.title}
          onChange={formikHandleChange}
          error={!!formikErrors.title}
          helperText={formikErrors.title}
        />
      </h3>
      <h3>
        <MenuOutlinedIcon color={'secondary'} />
        <TextField
          id="description"
          fullWidth
          variant="standard"
          value={formikValues.description}
          onChange={formikHandleChange}
          error={!!formikErrors.description}
          helperText={formikErrors.description}
        />
      </h3>
      <h3>
        <DynamicFeedIcon color={'warning'} />
        <TextField
          type={'number'}
          id="order"
          fullWidth
          variant="standard"
          value={formikValues.order}
          onChange={formikHandleChange}
          error={!!formikErrors.order}
          helperText={formikErrors.order}
        />
      </h3>
    </TaskDescriptionContainer>
  );
}

export default TaskDescriptionEditForm;

const TaskDescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h3 {
    width: 400px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    span {
      margin: 0 10px 0 10px;
      color: gray;
    }
  }
`;
