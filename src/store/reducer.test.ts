import { describe, expect, it } from 'vitest';
import { AuthorizationStatus } from '../const.ts';
import { offersActions, offersReducer, initialOffersState, type OffersState, userActions, userReducer, initialUserState, type UserState } from './reducer.ts';
import type { CityPlaceInfo, PlaceFullInfo } from '../components/shared/city-place/city-place.ts';
import type { Review } from '../components/widgets/reviews/review-types';
import type { AuthInfo } from './auth-info.ts';

const createCityPlace = (overrides: Partial<CityPlaceInfo> = {}): CityPlaceInfo => ({
  id: 'place-1',
  title: 'Test place',
  type: 'apartment',
  price: 120,
  city: {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'img.jpg',
  ...overrides,
});

const createFullPlace = (overrides: Partial<PlaceFullInfo> = {}): PlaceFullInfo => {
  const base = createCityPlace(overrides);

  return {
    ...base,
    description: 'A nice place',
    bedrooms: 2,
    goods: ['WiFi'],
    host: {
      name: 'Host',
      avatarUrl: 'avatar.jpg',
      isPro: false,
    },
    images: ['img.jpg'],
    maxAdults: 4,
    ...overrides,
  };
};

const createReview = (overrides: Partial<Review> = {}): Review => ({
  id: 'review-1',
  date: '2020-01-01',
  user: {
    name: 'User',
    avatarUrl: 'avatar.jpg',
    isPro: false,
  },
  comment: 'Nice stay',
  rating: 4,
  ...overrides,
});

const createOffersState = (overrides: Partial<OffersState> = {}): OffersState => ({
  ...initialOffersState,
  places: [],
  neighbors: [],
  comments: [],
  offerDetail: null,
  ...overrides,
});

const createUserState = (overrides: Partial<UserState> = {}): UserState => ({
  ...initialUserState,
  ...overrides,
});

describe('offersReducer', () => {
  it('sets city', () => {
    const state = createOffersState();
    const nextState = offersReducer(state, offersActions.setCity('Amsterdam'));

    expect(nextState.city).toBe('Amsterdam');
  });

  it('sets places loading flag', () => {
    const state = createOffersState();
    const nextState = offersReducer(state, offersActions.setIsLoadingPlaces(true));

    expect(nextState.isLoadingPlaces).toBe(true);
  });

  it('sets places collection', () => {
    const placeA = createCityPlace({ id: 'a' });
    const placeB = createCityPlace({ id: 'b' });
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setPlaces([placeA, placeB]));

    expect(nextState.places).toEqual([placeA, placeB]);
  });

  it('sets offer detail', () => {
    const detail = createFullPlace({ id: 'offer-1' });
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setOfferDetail(detail));

    expect(nextState.offerDetail).toEqual(detail);
  });

  it('clears offer detail', () => {
    const detail = createFullPlace({ id: 'offer-1' });
    const state = createOffersState({ offerDetail: detail });

    const nextState = offersReducer(state, offersActions.setOfferDetail(null));

    expect(nextState.offerDetail).toBeNull();
  });

  it('sets neighbors', () => {
    const neighbor = createCityPlace({ id: 'neighbor' });
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setNeighbors([neighbor]));

    expect(nextState.neighbors).toEqual([neighbor]);
  });

  it('sets comments', () => {
    const review = createReview({ id: 'r1' });
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setComments([review]));

    expect(nextState.comments).toEqual([review]);
  });

  it('sets offer loading flag', () => {
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setIsLoadingOffer(true));

    expect(nextState.isLoadingOffer).toBe(true);
  });

  it('sets offer not found flag', () => {
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setOfferNotFound(true));

    expect(nextState.offerNotFound).toBe(true);
  });

  it('sets comment posting flag', () => {
    const state = createOffersState();

    const nextState = offersReducer(state, offersActions.setIsPostingComment(true));

    expect(nextState.isPostingComment).toBe(true);
  });

  it('updates place across lists and detail when ids match', () => {
    const placeA = createCityPlace({ id: 'a', isFavorite: false });
    const placeB = createCityPlace({ id: 'b', isFavorite: false });
    const detail = createFullPlace({ id: 'b', isFavorite: false });
    const state = createOffersState({
      places: [placeA, placeB],
      neighbors: [placeB],
      offerDetail: detail,
    });

    const updated = { ...placeB, isFavorite: true };
    const nextState = offersReducer(state, offersActions.updatePlace(updated));

    expect(nextState.places.find((p) => p.id === 'b')?.isFavorite).toBe(true);
    expect(nextState.neighbors[0].isFavorite).toBe(true);
    expect(nextState.offerDetail?.isFavorite).toBe(true);
    expect(nextState.places.find((p) => p.id === 'a')).toEqual(placeA);
  });

  it('keeps state when updated place is missing', () => {
    const place = createCityPlace({ id: 'a', isFavorite: false });
    const state = createOffersState({ places: [place] });

    const updated = createCityPlace({ id: 'missing', isFavorite: true });
    const nextState = offersReducer(state, offersActions.updatePlace(updated));

    expect(nextState.places).toEqual([place]);
    expect(nextState.neighbors).toEqual([]);
    expect(nextState.offerDetail).toBeNull();
  });
});

describe('userReducer', () => {
  it('sets authorization status', () => {
    const state = createUserState();

    const nextState = userReducer(state, userActions.setAuthorizationStatus(AuthorizationStatus.Auth));

    expect(nextState.authorizationStatus).toBe(AuthorizationStatus.Auth);
  });

  it('sets user data', () => {
    const user: AuthInfo = {
      email: 'user@mail.com',
      token: 'token',
      name: 'User',
      avatarUrl: 'avatar.jpg',
      isPro: true,
    };
    const state = createUserState();

    const nextState = userReducer(state, userActions.setUserData(user));

    expect(nextState.userData).toEqual(user);
  });

  it('clears user data', () => {
    const user: AuthInfo = {
      email: 'user@mail.com',
      token: 'token',
      name: 'User',
      avatarUrl: 'avatar.jpg',
      isPro: true,
    };
    const state = createUserState({ userData: user });

    const nextState = userReducer(state, userActions.setUserData(null));

    expect(nextState.userData).toBeNull();
  });
});
