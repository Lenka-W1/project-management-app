import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
type InitialStateType = {
  status: AppStatusType;
  error: string | null;
};

export const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle',
    error: '',
  } as InitialStateType,
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: AppStatusType }>) {
      return { ...state, status: action.payload.status };
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      return { ...state, error: action.payload.error };
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppError, setAppStatus } = slice.actions;
