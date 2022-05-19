import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BoardResponseType, boardsAPI, BoardType, CreateBoardParamsType } from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { toast } from 'react-toastify';
import { AppStateType } from '../store';

type InitialStateType = {
  currentBoard: BoardType;
  boards: Array<BoardResponseType>;
};

export const fetchAllBoards = createAsyncThunk<
  { boards: Array<BoardResponseType> },
  undefined,
  { rejectValue: { error: string } }
>('boards/fetchAllBoards', async (param, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await boardsAPI.fetchAllBoards();
    dispatch(setAppStatus({ status: 'successed' }));
    return { boards: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
export const fetchBoard = createAsyncThunk<
  { board: BoardType },
  string,
  { rejectValue: { error: string } }
>('boards/fetchBoard', async (boardId, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await boardsAPI.fetchBoard(boardId);
    dispatch(setAppStatus({ status: 'successed' }));
    return { board: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
export const createBoard = createAsyncThunk<
  { board: BoardResponseType },
  CreateBoardParamsType,
  { rejectValue: { error: string } }
>('boards/createBoard', async (param: CreateBoardParamsType, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await boardsAPI.createBoard(param);
    dispatch(setAppStatus({ status: 'successed' }));
    toast.success(`Board ${param.title.toUpperCase()} successfully created!`);
    return { board: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});

export const removeBoard = createAsyncThunk<
  { boardId: string },
  string,
  { rejectValue: { error: string } }
>('boards/removeBoard', async (boardId, { dispatch, rejectWithValue, getState }) => {
  const removedBoard = (getState() as AppStateType).boards.boards.find((b) => b.id === boardId);
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    await boardsAPI.deleteBoard(boardId);
    dispatch(setAppStatus({ status: 'successed' }));
    if (removedBoard) {
      toast.success(`Board ${removedBoard.title.toUpperCase()} successfully deleted!`);
    }
    return { boardId };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});

export const updateBoard = createAsyncThunk<
  { board: BoardResponseType },
  { id: string; title: string; description: string },
  { rejectValue: { error: string } }
>(
  'boards/updateBoard',
  async (
    param: { id: string; title: string; description: string },
    { dispatch, rejectWithValue, getState }
  ) => {
    const updBoard = (getState() as AppStateType).boards.boards.find((b) => b.id === param.id);
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      const res = await boardsAPI.updateBoard(param.id, param.title, param.description);
      dispatch(setAppStatus({ status: 'successed' }));
      if (updBoard) {
        toast.success(`Board ${param.title.toUpperCase()} successfully updated!`);
      }
      return { board: { ...res.data } };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
      return rejectWithValue({ error: error.response.data.message });
    } finally {
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }
);

export const slice = createSlice({
  name: 'boards',
  initialState: {
    currentBoard: {} as BoardType,
    boards: [],
  } as InitialStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllBoards.fulfilled, (state, action) => {
      state.boards = action.payload.boards;
    });
    builder.addCase(fetchBoard.fulfilled, (state, action) => {
      state.currentBoard = action.payload.board;
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.boards.unshift(action.payload.board);
    });
    builder.addCase(removeBoard.fulfilled, (state, action) => {
      const index = state.boards.findIndex((b) => b.id === action.payload.boardId);
      if (index > -1) {
        state.boards.splice(index, 1);
      }
    });
    builder.addCase(updateBoard.fulfilled, (state, action) => {
      const board = state.boards.find((b) => b.id === action.payload.board.id);
      if (board) {
        board.title = action.payload.board.title;
        board.description = action.payload.board.description;
      }
    });
  },
});

export const boardReducer = slice.reducer;
