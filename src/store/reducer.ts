import getPlaces, {cities} from '../api/temp-get-places.tsx';

export type State = {
  city: string;
  places: CityPlaceInfo[];
};

export type Action = { type: 'setCity'; payload: string };

export const initialState: State = {
  city: (cities && cities.length > 0 ? cities[0].name : 'Paris'),
  places: (cities && cities.length > 0 ? getPlaces(cities[0].name) : [])
};

export function offers(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'setCity': {
      const newCity = action.payload;
      return {
        ...state,
        city: newCity,
        places: getPlaces(newCity)
      };
    }
    default:
      return state;
  }
}
