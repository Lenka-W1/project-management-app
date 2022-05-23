import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ColumnResponseType, columnsAPI, ColumnType, CreateColumnParamsType } from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { toast } from 'react-toastify';
import { fetchBoard } from './board-reducer';
import { AppStateType } from '../store';

type InitialStateType = {
  columns: Array<ColumnType>;
};

export const fetchAllColumns = createAsyncThunk<
  { columns: Array<ColumnResponseType> },
  string,
  { rejectValue: { error: string } }
>('columns/fetchAllColumns', async (boardId, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await columnsAPI.fetchAllColumns(boardId);
    dispatch(setAppStatus({ status: 'successed' }));
    return { columns: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
export const createColumn = createAsyncThunk<
  { column: ColumnResponseType },
  CreateColumnParamsType & { boardId: string },
  { rejectValue: { error: string } }
>(
  'columns/createColumn',
  async (param: CreateColumnParamsType & { boardId: string }, { dispatch, rejectWithValue }) => {
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      const res = await columnsAPI.createColumn(param.boardId, {
        title: param.title,
      });
      dispatch(setAppStatus({ status: 'successed' }));
      toast.success(`Column ${param.title.toUpperCase()} successfully created!`);
      return { column: res.data };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
      return rejectWithValue({ error: error.response.data.message });
    } finally {
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }
);

export const removeColumn = createAsyncThunk<
  { columnId: string },
  { boardId: string; columnId: string },
  { rejectValue: { error: string } }
>('columns/removeColumn', async (param, { dispatch, rejectWithValue, getState }) => {
  const column = (getState() as AppStateType).columns.columns.find((c) => c.id === param.columnId);
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    await columnsAPI.deleteColumn(param.boardId, param.columnId);
    dispatch(setAppStatus({ status: 'successed' }));
    if (column) {
      toast.success(`Column ${column.title.toUpperCase()} successfully deleted!`);
    }
    return { columnId: param.columnId };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});

export const updateColumn = createAsyncThunk<
  { column: ColumnResponseType },
  { boardId: string; columnId: string; title: string; order: number },
  { rejectValue: { error: string } }
>('columns/updateColumn', async (param, { dispatch, rejectWithValue, getState }) => {
  const updColumn = (getState() as AppStateType).columns.columns.find(
    (c) => c.id === param.columnId
  );
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await columnsAPI.updateColumn(
      param.boardId,
      param.columnId,
      param.title,
      param.order
    );
    dispatch(setAppStatus({ status: 'successed' }));
    if (updColumn) {
      toast.success(`Column ${param.title.toUpperCase()} successfully updated!`);
    }
    return { column: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});

export const slice = createSlice({
  name: 'columns',
  initialState: {
    columns: [],
  } as InitialStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createColumn.fulfilled, (state, action) => {
      const { id, title, order } = action.payload.column;
      state.columns.push({ id: id, title: title, order: order, tasks: [] });
    });
    builder.addCase(fetchBoard.fulfilled, (state, action) => {
      state.columns = action.payload.board.columns;
    });
    builder.addCase(removeColumn.fulfilled, (state, action) => {
      const index = state.columns.findIndex((b) => b.id === action.payload.columnId);
      if (index > -1) {
        state.columns.splice(index, 1);
      }
    });
    builder.addCase(updateColumn.fulfilled, (state, action) => {
      const column = state.columns.find((b) => b.id === action.payload.column.id);
      if (column) {
        column.title = action.payload.column.title;
        column.order = action.payload.column.order;
      }
    });
  },
});

export const columnReducer = slice.reducer;
