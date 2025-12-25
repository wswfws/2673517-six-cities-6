import { describe, expect, it } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { createAPI } from './index.ts';
import { fetchComments, postComment } from './comments-api.ts';
import changeFavoriteStatus from './favorite-api.ts';
import loginFetch, { type AuthData } from './login-fetch.ts';
import { fetchOffer } from './offer-fetcher.ts';
import fetcheOffers from './fetche-offers.ts';
import { fetchNearbyOffers } from './offers-nearby-fetcher.ts';
import { APIRoute } from '../const.ts';
import type { CityPlaceInfo, PlaceFullInfo } from '../components/shared/city-place/city-place.ts';
import type { Review } from '../components/widgets/reviews/review-types';
import type { UserData } from './login-fetch.ts';

describe('API functions', () => {
  const api = createAPI();
  const mockAdapter = new MockAdapter(api);

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('offersFetcher', () => {
    it('fetches offers from API', async () => {
      const mockOffers: CityPlaceInfo[] = [
        {
          id: '1',
          title: 'Place 1',
          type: 'apartment',
          price: 100,
          city: {
            name: 'Paris',
            location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
          },
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
          isFavorite: false,
          isPremium: false,
          rating: 4,
          previewImage: 'img.jpg',
        },
      ];

      mockAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      const result = await fetcheOffers(api);

      expect(result).toEqual(mockOffers);
    });
  });

  describe('fetchOffer', () => {
    it('fetches single offer by id', async () => {
      const mockOffer: PlaceFullInfo = {
        id: '1',
        title: 'Place 1',
        type: 'apartment',
        price: 100,
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        isFavorite: false,
        isPremium: false,
        rating: 4,
        previewImage: 'img.jpg',
        description: 'Nice place',
        bedrooms: 2,
        goods: ['WiFi'],
        host: {
          name: 'Host',
          avatarUrl: 'avatar.jpg',
          isPro: false,
        },
        images: ['img1.jpg'],
        maxAdults: 4,
      };

      mockAdapter.onGet('/offers/1').reply(200, mockOffer);

      const result = await fetchOffer(api, '1');

      expect(result).toEqual(mockOffer);
    });
  });

  describe('fetchNearbyOffers', () => {
    it('fetches nearby offers for given offer id', async () => {
      const mockNearby: CityPlaceInfo[] = [
        {
          id: '2',
          title: 'Nearby Place',
          type: 'room',
          price: 50,
          city: {
            name: 'Paris',
            location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
          },
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
          isFavorite: false,
          isPremium: false,
          rating: 3.5,
          previewImage: 'img.jpg',
        },
      ];

      mockAdapter.onGet('/offers/1/nearby').reply(200, mockNearby);

      const result = await fetchNearbyOffers(api, '1');

      expect(result).toEqual(mockNearby);
    });
  });

  describe('fetchComments', () => {
    it('fetches comments for offer', async () => {
      const mockComments: Review[] = [
        {
          id: 'r1',
          date: '2020-01-01',
          user: {
            name: 'User',
            avatarUrl: 'avatar.jpg',
            isPro: false,
          },
          comment: 'Great!',
          rating: 5,
        },
      ];

      mockAdapter.onGet('/comments/1').reply(200, mockComments);

      const result = await fetchComments(api, '1');

      expect(result).toEqual(mockComments);
    });
  });

  describe('postComment', () => {
    it('posts comment and returns created review', async () => {
      const payload = { comment: 'Nice place', rating: 4 };
      const mockReview: Review = {
        id: 'r2',
        date: '2020-01-02',
        user: {
          name: 'User',
          avatarUrl: 'avatar.jpg',
          isPro: false,
        },
        comment: payload.comment,
        rating: payload.rating,
      };

      mockAdapter.onPost('/comments/1', payload).reply(200, mockReview);

      const result = await postComment(api, '1', payload);

      expect(result).toEqual(mockReview);
    });
  });

  describe('changeFavoriteStatus', () => {
    it('changes favorite status to 1', async () => {
      const mockUpdatedOffer: CityPlaceInfo = {
        id: '1',
        title: 'Place 1',
        type: 'apartment',
        price: 100,
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        isFavorite: true,
        isPremium: false,
        rating: 4,
        previewImage: 'img.jpg',
      };

      mockAdapter.onPost('/favorite/1/1').reply(200, mockUpdatedOffer);

      const result = await changeFavoriteStatus(api, '1', 1);

      expect(result).toEqual(mockUpdatedOffer);
      expect(result.isFavorite).toBe(true);
    });

    it('changes favorite status to 0', async () => {
      const mockUpdatedOffer: CityPlaceInfo = {
        id: '1',
        title: 'Place 1',
        type: 'apartment',
        price: 100,
        city: {
          name: 'Paris',
          location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        isFavorite: false,
        isPremium: false,
        rating: 4,
        previewImage: 'img.jpg',
      };

      mockAdapter.onPost('/favorite/1/0').reply(200, mockUpdatedOffer);

      const result = await changeFavoriteStatus(api, '1', 0);

      expect(result).toEqual(mockUpdatedOffer);
      expect(result.isFavorite).toBe(false);
    });
  });

  describe('loginFetch', () => {
    it('sends login request and returns user data', async () => {
      const authData: AuthData = {
        email: 'user@mail.com',
        password: 'password123',
      };

      const mockUserData: UserData = {
        email: 'user@mail.com',
        name: 'User',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        token: 'secret-token',
      };

      mockAdapter.onPost(APIRoute.Login, authData).reply(200, mockUserData);

      const result = await loginFetch(api, authData);

      expect(result).toEqual(mockUserData);
    });
  });
});
