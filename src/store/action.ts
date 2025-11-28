import type {Action} from './reducer.ts';
import {AuthorizationStatus} from '../const.ts';

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
