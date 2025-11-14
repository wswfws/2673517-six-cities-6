import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {offers} from './reducer';

const rootReducer = combineReducers({
  offers
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

