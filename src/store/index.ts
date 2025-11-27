import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {offers} from './reducer';
import {createAPI} from '../api';

export const api = createAPI();


const rootReducer = combineReducers({
  offers
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

