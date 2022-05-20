import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  CreateTaskParamsType,
  TaskResponseType,
  tasksAPI,
  UpdateTaskParamsType,
} from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { toast } from 'react-toastify';
import { AppStateType } from '../store';

export type TasksInitialStateType = {
  [key: string]: Array<TaskResponseType>;
};
const initialState: TasksInitialStateType = {};

export const fetchAllTasks = createAsyncThunk<
  { tasks: Array<TaskResponseType>; boardId: string; columnId: string },
  { boardId: string; columnId: string },
  { rejectValue: { error: string } }
>('tasks/fetchAllTasks', async ({ boardId, columnId }, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await tasksAPI.fetchAllTasks(boardId, columnId);
    dispatch(setAppStatus({ status: 'successed' }));
    return { tasks: res.data, boardId: boardId, columnId: columnId };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
export const createTask = createAsyncThunk<
  { task: TaskResponseType },
  { boardId: string; columnId: string; param: CreateTaskParamsType },
  { rejectValue: { error: string } }
>('tasks/createTask', async ({ boardId, columnId, param }, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await tasksAPI.createTask(boardId, columnId, param);
    dispatch(setAppStatus({ status: 'successed' }));
    toast.success(`Task ${param.title.toUpperCase()} successfully created!`);
    return { task: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
export const removeTask = createAsyncThunk<
  { boardId: string; columnId: string; taskId: string },
  { boardId: string; columnId: string; taskId: string },
  { rejectValue: { error: string } }
>(
  'tasks/removeTask',
  async ({ boardId, columnId, taskId }, { dispatch, rejectWithValue, getState }) => {
    const task = (getState() as AppStateType).columns.columns
      .find((c) => c.id === columnId)
      ?.tasks.find((t) => t.id === taskId);
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      await tasksAPI.deleteTask(boardId, columnId, taskId);
      dispatch(setAppStatus({ status: 'successed' }));
      if (task) {
        toast.success(`Column ${task.title.toUpperCase()} successfully deleted!`);
      }
      return { columnId: columnId, boardId: boardId, taskId: taskId };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
      return rejectWithValue({ error: error.response.data.message });
    } finally {
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }
);

export const updateTask = createAsyncThunk<
  { task: TaskResponseType },
  { boardId: string; columnId: string; taskId: string; params: UpdateTaskParamsType },
  { rejectValue: { error: string } }
>('tasks/updateTask', async (param, { dispatch, rejectWithValue, getState }) => {
  const task = (getState() as AppStateType).columns.columns
    .find((c) => c.id === param.columnId)
    ?.tasks.find((t) => t.id === param.taskId);
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await tasksAPI.updateTask(
      param.boardId,
      param.columnId,
      param.taskId,
      param.params
    );
    dispatch(setAppStatus({ status: 'successed' }));
    if (task) {
      toast.success(`Column ${task.title.toUpperCase()} successfully updated!`);
    }
    return { task: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});

export const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      state[action.payload.columnId] = action.payload.tasks;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state[action.payload.task.columnId].unshift(action.payload.task);
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.columnId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.task.columnId];
      const index = tasks.findIndex((t) => t.id === action.payload.task.id);
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.task };
      }
    });
  },
});

export const tasksReducer = slice.reducer;