import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authAPI, SignUpParamsType } from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { deleteUser } from './user-reducer';
import { toast } from 'react-toastify';

type InitialStateType = {
  isLoggedIn: boolean;
  userId: string;
  name: string;
  login: string;
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (param: SignUpParamsType, { dispatch }) => {
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      const res = await authAPI.signUp(param);
      dispatch(setAppStatus({ status: 'successed' }));
      toast.success('User account successfully created!');
      return { ...res.data };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
    }
  }
);
export const signIn = createAsyncThunk(
  'auth/login',
  async (param: { login: string; password: string }, { dispatch }) => {
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      const res = await authAPI.signIn(param);
      localStorage.setItem('token', res.data.token);
      dispatch(setAppStatus({ status: 'successed' }));
      toast.success('Welcome!');
      return { isLoggedIn: true, login: param.login };
    } catch (error) {
      dispatch(setAppError({ error: error.response.data.message }));
      return { isLoggedIn: false, email: '' };
    } finally {
      dispatch(setAppStatus({ status: 'idle' }));
    }
  }
);

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userId: '',
    name: '',
    login: '',
  } as InitialStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      if (action.payload.login) state.login = action.payload.login;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      if (action.payload) {
        state.userId = action.payload.id;
        state.login = action.payload.login;
        state.name = action.payload.name;
      }
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoggedIn = false;
      state.login = '';
      state.name = '';
      state.userId = '';
    });
  },
});

export const authReducer = slice.reducer;
