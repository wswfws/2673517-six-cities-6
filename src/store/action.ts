import type {Action} from './reducer.ts';

export const setCity = (city: string): Action => ({
  type: 'setCity',
  payload: city
});

export const setPlaces = (places: CityPlaceInfo[]): Action => ({
  type: 'setPlaces',
  payload: places
});
