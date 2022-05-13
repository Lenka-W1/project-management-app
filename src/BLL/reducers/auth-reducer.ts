import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { toast } from 'react-toastify';

type InitialStateType = {
  isLoggedIn: boolean;
  login: string;
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (param: { name: string; login: string; password: string }, { dispatch }) => {
    dispatch(setAppError({ error: null }));
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      await authAPI.signUp(param);
      dispatch(setAppStatus({ status: 'succeeded' }));
      toast.success('User account successfully created!');
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
      dispatch(setAppStatus({ status: 'succeeded' }));
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
    login: '',
  } as InitialStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      if (action.payload.login) state.login = action.payload.login;
    });
  },
});

export const authReducer = slice.reducer;
// export const { setIsLoggedIn } = slice.actions;
