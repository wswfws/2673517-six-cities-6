import type {Action} from './reducer.ts';
import {AuthorizationStatus} from '../const.ts';
import type {Review} from '../components/widgets/reviews/review-types.ts';
import {CityPlaceInfo, PlaceFullInfo} from '../components/shared/city-place';

export const setCity = (city: string): Action => ({
  type: 'setCity',
  payload: city
});

export const setPlaces = (places: CityPlaceInfo[]): Action => ({
  type: 'setPlaces',
  payload: places
});

export const setIsLoadingPlaces = (isLoadingPlaces: boolean): Action => ({
  type: 'setIsLoadingPlaces',
  payload: isLoadingPlaces
});

export const setAuthorizationStatus = (authorizationStatus: AuthorizationStatus): Action => ({
  type: 'setAuthorizationStatus',
  payload: authorizationStatus
});

export const setOfferDetail = (offer: PlaceFullInfo | null): Action => ({
  type: 'setOfferDetail',
  payload: offer
});

export const setNeighbors = (neighbors: CityPlaceInfo[]): Action => ({
  type: 'setNeighbors',
  payload: neighbors
});

export const setComments = (comments: Review[]): Action => ({
  type: 'setComments',
  payload: comments
});

export const setIsLoadingOffer = (isLoading: boolean): Action => ({
  type: 'setIsLoadingOffer',
  payload: isLoading
});

export const setOfferNotFound = (notFound: boolean): Action => ({
  type: 'setOfferNotFound',
  payload: notFound
});

export const setIsPostingComment = (isPosting: boolean): Action => ({
  type: 'setIsPostingComment',
  payload: isPosting
});
