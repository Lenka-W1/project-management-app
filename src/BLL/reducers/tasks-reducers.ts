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
import { AxiosResponse } from 'axios';

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
    toast.error(error.response.data.message);
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
    toast.error(error.response.data.message);
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
        toast.success(`Task ${task.title.toUpperCase()} successfully deleted!`);
      }
      return { columnId: columnId, boardId: boardId, taskId: taskId };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
      toast.error(error.response.data.message);
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
    if (task && task.title !== param.params.title) {
      toast.success(`Task ${task.title.toUpperCase()} successfully updated!`);
    }
    return { task: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    toast.error(error.response.data.message);
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
export const moveTaskBetweenColumns = createAsyncThunk(
  'tasks/moveTaskBetweenColumns',
  async (
    param: { boardId: string; fromColumnId: string; toColumnId: string; taskId: string },
    { dispatch, rejectWithValue, getState }
  ) => {
    const { boardId, fromColumnId, toColumnId, taskId } = param;
    const task = (getState() as AppStateType).columns.columns
      .find((c) => c.id === param.fromColumnId)
      ?.tasks.find((t) => t.id === param.taskId);
    const fromColumnTitle = (getState() as AppStateType).columns.columns.find(
      (c) => c.id === param.fromColumnId
    )?.title;
    const toColumnTitle = (getState() as AppStateType).columns.columns.find(
      (c) => c.id === param.toColumnId
    )?.title;
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    debugger;
    try {
      if (task) {
        // await tasksAPI.deleteTask(boardId, fromColumnId, taskId).then(async () => {
        //   await tasksAPI.createTask(boardId, toColumnId, {
        //     title: task.title,
        //     description: task.description,
        //     userId: task.userId,
        //   });
        // });
        const res: AxiosResponse<TaskResponseType> = await tasksAPI.updateTask(
          boardId,
          fromColumnId,
          taskId,
          {
            columnId: toColumnId,
            boardId: boardId,
            title: task.title,
            order: 1,
            description: task.description,
            userId: task.userId,
          }
        );
        console.log(res.data.columnId);
        dispatch(setAppStatus({ status: 'successed' }));
        toast.success(
          `Task ${task.title.toUpperCase()} successfully moved from ${fromColumnTitle} to ${toColumnTitle}!`
        );
        return { fromColumnId: fromColumnId, toColumnId: res.data.columnId, taskId: taskId };
      }
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
      toast.error(error.response.data.message);
      return rejectWithValue({ error: error.response.data.message });
    } finally {
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }
);

export const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      state[action.payload.columnId] = action.payload.tasks;
      state[action.payload.columnId].sort((a, b) => a.order - b.order);
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state[action.payload.task.columnId].push(action.payload.task);
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
      state[action.payload.task.columnId].sort((a, b) => a.order - b.order);
    });
    builder.addCase(moveTaskBetweenColumns.fulfilled, (state, action) => {
      if (action.payload) {
        const task = state[action.payload.fromColumnId].find(
          (t) => t.id === action.payload!.taskId
        );
        if (task) {
          const tasks = state[action.payload.fromColumnId];
          const index = tasks.findIndex((t) => t.id === action.payload!.taskId);
          if (index > -1) {
            tasks.splice(index, 1);
          }
          state[action.payload.toColumnId].push(task);
        }
      }
    });
  },
});

export const tasksReducer = slice.reducer;
