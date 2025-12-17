import {beforeEach, describe, expect, it} from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import {AnyAction, configureStore, MiddlewareArray, ThunkMiddleware} from '@reduxjs/toolkit';
import {createAPI} from '../api';
import {
  checkAuthAction,
  fetchOfferAction,
  fetchOffersAction,
  loginAction,
  postCommentAction,
  postFavoriteAction,
} from './api-actions.ts';
import {offersReducer, OffersState, userReducer, UserState} from './reducer.ts';
import type {CityPlaceInfo, PlaceFullInfo} from '../components/shared/city-place';
import type {Review} from '../components/widgets/reviews/review-types';
import type {UserData} from '../api/login-fetch.ts';
import {APIRoute, AuthorizationStatus} from '../const.ts';
import {ToolkitStore} from '@reduxjs/toolkit/dist/configureStore';
import {AxiosInstance} from 'axios';

describe('API Actions', () => {
  let api: ReturnType<typeof createAPI>;
  let mockAdapter: MockAdapter;
  let store: ToolkitStore<{
    offers: OffersState;
    user: UserState;
  }, AnyAction, MiddlewareArray<[ThunkMiddleware<{
    offers: OffersState;
    user: UserState;
  }, AnyAction, AxiosInstance>]>>;

  beforeEach(() => {
    api = createAPI();
    mockAdapter = new MockAdapter(api);
    store = configureStore({
      reducer: {
        offers: offersReducer,
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: api,
          },
        }),
    });
  });

  describe('fetchOffersAction', () => {
    it('fetches offers and updates state', async () => {
      const mockOffers: CityPlaceInfo[] = [
        {
          id: '1',
          title: 'Place 1',
          type: 'apartment',
          price: 100,
          city: {
            name: 'Paris',
            location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
          },
          location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
          isFavorite: false,
          isPremium: false,
          rating: 4,
          previewImage: 'img.jpg',
        },
      ];

      mockAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await store.dispatch(fetchOffersAction());

      const state = store.getState();
      expect(state.offers.places).toEqual(mockOffers);
      expect(state.offers.isLoadingPlaces).toBe(false);
    });

    it('sets loading flag during fetch', async () => {
      mockAdapter.onGet(APIRoute.Offers).reply(() =>
        new Promise((resolve) => {
          const state = store.getState();
          expect(state.offers.isLoadingPlaces).toBe(true);
          resolve([200, []]);
        })
      );

      await store.dispatch(fetchOffersAction());
    });
  });

  describe('fetchOfferAction', () => {
    it('fetches offer with neighbors and comments', async () => {
      const mockOffer: PlaceFullInfo = {
        id: '1',
        title: 'Place 1',
        type: 'apartment',
        price: 100,
        city: {
          name: 'Paris',
          location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
        },
        location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
        isFavorite: false,
        isPremium: false,
        rating: 4,
        previewImage: 'img.jpg',
        description: 'Nice',
        bedrooms: 2,
        goods: ['WiFi'],
        host: {name: 'Host', avatarUrl: 'avatar.jpg', isPro: false},
        images: ['img.jpg'],
        maxAdults: 4,
      };

      const mockNearby: CityPlaceInfo[] = [
        {
          id: '2',
          title: 'Nearby',
          type: 'room',
          price: 50,
          city: {
            name: 'Paris',
            location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
          },
          location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
          isFavorite: false,
          isPremium: false,
          rating: 3.5,
          previewImage: 'img.jpg',
        },
      ];

      const mockComments: Review[] = [
        {
          id: 'r1',
          date: '2020-01-01',
          user: {name: 'User', avatarUrl: 'avatar.jpg', isPro: false},
          comment: 'Good',
          rating: 4,
        },
      ];

      mockAdapter.onGet('/offers/1').reply(200, mockOffer);
      mockAdapter.onGet('/offers/1/nearby').reply(200, mockNearby);
      mockAdapter.onGet('/comments/1').reply(200, mockComments);

      await store.dispatch(fetchOfferAction('1'));

      const state = store.getState();
      expect(state.offers.offerDetail).toEqual(mockOffer);
      expect(state.offers.neighbors).toEqual(mockNearby);
      expect(state.offers.comments).toEqual(mockComments);
      expect(state.offers.isLoadingOffer).toBe(false);
      expect(state.offers.offerNotFound).toBe(false);
    });

    it('sets offerNotFound flag on 404', async () => {
      mockAdapter.onGet('/offers/999').reply(404, {
        errorType: 'COMMON_ERROR',
        message: 'Not found',
        details: [],
      });

      await store.dispatch(fetchOfferAction('999'));

      const state = store.getState();
      expect(state.offers.offerNotFound).toBe(true);
      expect(state.offers.isLoadingOffer).toBe(false);
    });
  });

  describe('postCommentAction', () => {
    it('posts comment and updates comments list', async () => {
      const payload = {offerId: '1', rating: 5, comment: 'Great!'};
      const newReview: Review = {
        id: 'r2',
        date: '2020-01-02',
        user: {name: 'User', avatarUrl: 'avatar.jpg', isPro: false},
        comment: payload.comment,
        rating: payload.rating,
      };

      const updatedComments: Review[] = [
        {
          id: 'r1',
          date: '2020-01-01',
          user: {name: 'Old User', avatarUrl: 'avatar.jpg', isPro: false},
          comment: 'Old',
          rating: 3,
        },
        newReview,
      ];

      mockAdapter.onPost('/comments/1').reply(200, newReview);
      mockAdapter.onGet('/comments/1').reply(200, updatedComments);

      await store.dispatch(postCommentAction(payload));

      const state = store.getState();
      expect(state.offers.comments).toEqual(updatedComments);
      expect(state.offers.isPostingComment).toBe(false);
    });

    it('handles comment posting error', async () => {
      const payload = {offerId: '1', rating: 5, comment: 'Great!'};

      mockAdapter.onPost('/comments/1').reply(400);

      const result = await store.dispatch(postCommentAction(payload));

      expect(result.type).toBe('data/postComment/rejected');
      const state = store.getState();
      expect(state.offers.isPostingComment).toBe(false);
    });
  });

  describe('postFavoriteAction', () => {
    it('updates favorite status', async () => {
      const mockUpdatedOffer: CityPlaceInfo = {
        id: '1',
        title: 'Place 1',
        type: 'apartment',
        price: 100,
        city: {
          name: 'Paris',
          location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
        },
        location: {latitude: 48.8566, longitude: 2.3522, zoom: 10},
        isFavorite: true,
        isPremium: false,
        rating: 4,
        previewImage: 'img.jpg',
      };

      store.dispatch({
        type: 'offers/setPlaces',
        payload: [{...mockUpdatedOffer, isFavorite: false}],
      });

      mockAdapter.onPost('/favorite/1/1').reply(200, mockUpdatedOffer);

      await store.dispatch(postFavoriteAction({offerId: '1', status: 1}));

      const state = store.getState();
      expect(state.offers.places[0].isFavorite).toBe(true);
    });

    it('handles favorite update error', async () => {
      mockAdapter.onPost('/favorite/1/1').reply(401);

      const result = await store.dispatch(
        postFavoriteAction({offerId: '1', status: 1})
      );

      expect(result.type).toBe('data/postFavorite/rejected');
    });
  });

  describe('checkAuthAction', () => {
    it('checks auth and sets user data on success', async () => {
      const mockAuthInfo = {
        email: 'user@mail.com',
        name: 'User',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        token: 'token',
      };

      mockAdapter.onGet(APIRoute.Login).reply(200, mockAuthInfo);

      await store.dispatch(checkAuthAction());

      const state = store.getState();
      expect(state.user.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(state.user.userData).toEqual(mockAuthInfo);
    });

    it('sets NoAuth status on auth check failure', async () => {
      mockAdapter.onGet(APIRoute.Login).reply(401);

      await store.dispatch(checkAuthAction());

      const state = store.getState();
      expect(state.user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    });
  });

  describe('loginAction', () => {
    it('logs in successfully', async () => {
      const authData = {email: 'user@mail.com', password: 'password123'};
      const mockUserData: UserData = {
        email: authData.email,
        name: 'User',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        token: 'secret-token',
      };

      mockAdapter.onPost(APIRoute.Login, authData).reply(200, mockUserData);

      const result = await store.dispatch(loginAction(authData));

      expect(result.type).toBe('user/login/fulfilled');
      const state = store.getState();
      expect(state.user.authorizationStatus).toBe(AuthorizationStatus.Auth);
    });

    it('handles login error', async () => {
      const authData = {email: 'user@mail.com', password: 'wrong'};

      mockAdapter
        .onPost(APIRoute.Login, authData)
        .reply(400, {message: 'Invalid credentials'});

      const result = await store.dispatch(loginAction(authData));

      expect(result.type).toBe('user/login/rejected');
    });
  });
});
