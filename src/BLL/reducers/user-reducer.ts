import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { userAPI } from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { signUp } from './auth-reducer';
import { fetchBoard } from './board-reducer';

type InitialStateType = {
  userId: string;
  name: string;
  login: string;
  password: string;
};

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (param: { id: string; name: string; login: string; password: string }, { dispatch }) => {
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      const res = await userAPI.updateUser(param.id, param.name, param.login, param.password);
      dispatch(setAppStatus({ status: 'successed' }));
      toast.success(`User ${param.name} successfully updated`);
      return { ...res.data };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
    } finally {
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { dispatch }) => {
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      await userAPI.deleteUser(userId);
      dispatch(setAppStatus({ status: 'successed' }));
      toast.success(`User successfully deleted`);
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
    }
  }
);

export const slice = createSlice({
  name: 'users',
  initialState: {
    userId: '',
    name: '',
    login: '',
    password: '',
  } as InitialStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.userId = action.payload.id;
        state.name = action.payload.name;
        state.login = action.payload.login;
      }
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.userId = '';
      state.login = '';
      state.name = '';
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      if (action.payload) {
        state.userId = action.payload.id;
        state.login = action.payload.login;
        state.name = action.payload.name;
      }
    });
    // builder.addCase(fetchBoard.fulfilled, (state, action) => {
    //   const userId = action.payload.board.columns[0].tasks[0].userId;
    //   if (userId) state.userId = userId;
    // });
  },
});

export const userReducer = slice.reducer;
