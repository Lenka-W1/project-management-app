import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { Checkbox, FormControlLabel, FormGroup, styled, TextField } from '@mui/material';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

type TaskDescriptionPropsType = {
  formikValues: {
    title: string;
    description: string;
    order: number;
    done: boolean;
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
      <h3>
        {formikValues.done ? (
          <TaskAltOutlinedIcon color={'success'} />
        ) : (
          <RemoveCircleOutlineOutlinedIcon color={'error'} />
        )}
        <FormGroup aria-label="position" row>
          <FormControlLabel
            style={{ marginLeft: '0px' }}
            control={
              <Checkbox
                id="done"
                value={formikValues.done}
                onChange={formikHandleChange}
                color={'success'}
              />
            }
            label="Task is done?"
            labelPlacement="start"
          />
        </FormGroup>
      </h3>
    </TaskDescriptionContainer>
  );
}

export default TaskDescriptionEditForm;

const TaskDescriptionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  h3 {
    width: 360px;
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      margin: 0 10px 0 10px;
      color: gray;
    }
  }
`;
