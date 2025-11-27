import {AuthorizationStatus} from "../const.ts";

export type State = {
  city: string;
  isLoadingPlaces: boolean;
  places: CityPlaceInfo[];
  authorizationStatus: AuthorizationStatus
};

type setCityAction = { type: 'setCity'; payload: string };
type setIsLoadingPlacesAction = { type: 'setIsLoadingPlaces'; payload: boolean };
type setPlacesAction = { type: 'setPlaces'; payload: CityPlaceInfo[] };
type setAuthorizationStatusAction = { type: 'setAuthorizationStatus'; payload: AuthorizationStatus };

export type Action = setCityAction | setPlacesAction | setIsLoadingPlacesAction | setAuthorizationStatusAction;

export const initialState: State = {
  city: 'Paris',
  isLoadingPlaces: false,
  places: [],
  authorizationStatus: AuthorizationStatus.Unknown
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
    case 'setIsLoadingPlaces': {
      const newIsLoading = action.payload;
      return {...state, isLoadingPlaces: newIsLoading};
    }
    case 'setAuthorizationStatus': {
      const newIsLoading = action.payload;
      return {...state, authorizationStatus: newIsLoading};
    }
    default:
      return state;
  }
}
