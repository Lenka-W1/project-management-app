import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
type InitialStateType = {
  status: AppStatusType;
  error: string | null;
  settings: {
    mode: 'light' | 'dark';
    language: 'ru' | 'eng';
  };
};

export const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle',
    error: '',
    settings: {
      mode: 'light',
      language: 'ru',
    },
  } as InitialStateType,
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: AppStatusType }>) {
      return { ...state, status: action.payload.status };
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      return { ...state, error: action.payload.error };
    },
    setAppMode(state, action: PayloadAction<{ mode: 'light' | 'dark' }>) {
      return { ...state, settings: { ...state.settings, mode: action.payload.mode } };
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppError, setAppStatus, setAppMode } = slice.actions;
