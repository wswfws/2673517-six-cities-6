import {createAsyncThunk} from '@reduxjs/toolkit';
import offersFetcher from '../api/offers-fetcher.ts';
import {AxiosInstance} from 'axios';
import {AppDispatch, RootState} from './index.ts';
import {setAuthorizationStatus, setIsLoadingPlaces, setPlaces, setUserData} from './action.ts';
import loginFetch, {AuthData} from '../api/login-fetch.ts';
import {saveToken} from '../services/token.ts';
import {APIRoute, AuthorizationStatus} from '../const.ts';

import {fetchOffer} from '../api/offer-fetcher.ts';
import {fetchNearbyOffers} from '../api/offers-nearby-fetcher.ts';
import {fetchComments, postComment} from '../api/comments-api.ts';
import {setOfferDetail, setNeighbors, setComments, setIsLoadingOffer, setOfferNotFound, setIsPostingComment} from './action.ts';
import {AuthInfo} from './AuthInfo.ts';

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

export const fetchOfferAction = createAsyncThunk<void, string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>(
  'data/fetchOffer',
  async (offerId, {dispatch, extra: api, rejectWithValue}) => {
    try {
      dispatch(setIsLoadingOffer(true));
      dispatch(setOfferNotFound(false));

      const offer = await fetchOffer(api, offerId);
      dispatch(setOfferDetail(offer));

      // fetch neighbors and comments in parallel
      const [neighbors, comments] = await Promise.all([
        fetchNearbyOffers(api, offerId),
        fetchComments(api, offerId),
      ]);

      dispatch(setNeighbors(neighbors));
      dispatch(setComments(comments));
    } catch (e) {
      const error = e as { response?: { status?: number } };
      if (error.response?.status === 404) {
        dispatch(setOfferNotFound(true));
      } else {
        return rejectWithValue('Failed to load offer');
      }
    } finally {
      dispatch(setIsLoadingOffer(false));
    }
  }
);

export const postCommentAction = createAsyncThunk<void, {offerId: string; rating: number; comment: string},
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>(
  'data/postComment',
  async ({offerId, rating, comment}, {dispatch, extra: api, rejectWithValue}) => {
    try {
      dispatch(setIsPostingComment(true));
      await postComment(api, offerId, {rating, comment});
      const updatedComments = await fetchComments(api, offerId);
      dispatch(setComments(updatedComments));
    } catch (e) {
      return rejectWithValue('Failed to post comment');
    } finally {
      dispatch(setIsPostingComment(false));
    }
  }
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    try {
      const {data} = await api.get<AuthInfo>(APIRoute.Login);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUserData(data));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginAction = createAsyncThunk<
  void,
  AuthData,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>(
  'user/login',
  async ({email, password}, {dispatch, extra: api, rejectWithValue}) => {
    try {
      const data = await loginFetch(api, {email, password});
      saveToken(data.token);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);
