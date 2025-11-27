export type State = {
  city: string;
  places: CityPlaceInfo[];
};

type setCityAction = { type: 'setCity'; payload: string };
type setPlacesAction = { type: 'setPlaces'; payload: CityPlaceInfo[] };

export type Action = setCityAction | setPlacesAction;

export const initialState: State = {
  city: 'Paris',
  places: [],
};

export function offers(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'setCity': {
      const newCity = action.payload;
      return {...state, city: newCity};
    }
    case 'setPlaces': {
      const newPlaces = action.payload;
      return {...state, places: newPlaces};
    }
    default:
      return state;
  }
}
