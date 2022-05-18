import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userAPI, UserParamsType, UserResponseType } from '../../API/API';

type InitialStateType = {
  userId: string;
  name: string;
  login: string;
  password: string;
};

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (param: { name: string; login: string; password: string }) => {
    try {
      const res = await userAPI.updateUser(param.name, param.login, param.password);
      return { ...res.data };
    } catch (error) {
      // dispatch(setAppError({ error: error.response.data.message }));
    }
  }
);

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId: string) => {
  try {
    await userAPI.deleteUser(userId);
    return { userId };
  } catch (error) {
    // dispatch(setAppError({ error: error.response.data.message }));
  } finally {
    // dispatch(setAppStatus({ status: 'idle' }));
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
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      if (action.payload) {
        // state.userId = action.payload.id;
        // state.login = action.payload.login;
        // state.name = action.payload.name;
      }
    });
  },
});

export const userReducer = slice.reducer;
