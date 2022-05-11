import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { appReducer } from './reducers/app-reducer';
import { authReducer } from './reducers/auth-reducer';

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
});

export type AppDispatchType = typeof store.dispatch;
export type AppStateType = ReturnType<typeof rootReducer>;
export type storeType = typeof store;
