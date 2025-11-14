import type {Action} from './reducer.ts';

export const setCity = (city: string): Action => ({
  type: 'setCity',
  payload: city
});
