import {createAsyncThunk} from '@reduxjs/toolkit';
import offersFetcher from '../api/offers-fetcher.ts';
import {AxiosInstance} from 'axios';
import {AppDispatch, RootState} from './index.ts';
import {setAuthorizationStatus, setIsLoadingPlaces, setPlaces} from './action.ts';
import loginFetch, {AuthData} from "../api/login-fetch.ts";
import {saveToken} from "../services/token.ts";
import {AuthorizationStatus} from "../const.ts";

export const fetchOffersAction = createAsyncThunk<void, void,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>(
  'data/fetchOffers',
  async (_, {dispatch, extra: api}) => {
    try {
      dispatch(setIsLoadingPlaces(true));
      const data = await offersFetcher(api);
      dispatch(setPlaces(data));
    } finally {
      dispatch(setIsLoadingPlaces(false));
    }
  }
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({email, password}, {dispatch, extra: api}) => {
    const data = await loginFetch(api, {email, password});
    saveToken(data.token);
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
  },
);
