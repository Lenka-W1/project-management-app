import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { userAPI, UserResponseType } from '../../API/API';
import { setAppError, setAppStatus } from './app-reducer';
import { signIn, signUp } from './auth-reducer';

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
export const fetchUser = createAsyncThunk<
  { user: UserResponseType },
  string,
  { rejectValue: { error: string } }
>('users/fetchUser', async (id, { dispatch, rejectWithValue }) => {
  dispatch(setAppError({ error: null }));
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    const res = await userAPI.fetchUser(id);
    dispatch(setAppStatus({ status: 'successed' }));
    return { user: res.data };
  } catch (error) {
    dispatch(setAppError({ error: error.response.data.message }));
    return rejectWithValue({ error: error.response.data.message });
  } finally {
    dispatch(setAppStatus({ status: 'idle' }));
  }
});
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
    builder.addCase(signIn.fulfilled, (state, action) => {
      if (action.payload.login) {
        state.userId = action.payload.userId;
        state.login = action.payload.login;
      }
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.name = action.payload.user.name;
      state.login = action.payload.user.login;
    });
  },
});

export const userReducer = slice.reducer;
