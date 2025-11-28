import {AuthorizationStatus} from '../const.ts';

export type OffersState = {
  city: string;
  isLoadingPlaces: boolean;
  places: CityPlaceInfo[];
};

export type UserState = {
  authorizationStatus: AuthorizationStatus;
};

export type State = {
  offers: OffersState;
  user: UserState;
};

type SetCityAction = { type: 'setCity'; payload: string };
type SetIsLoadingPlacesAction = { type: 'setIsLoadingPlaces'; payload: boolean };
type SetPlacesAction = { type: 'setPlaces'; payload: CityPlaceInfo[] };

type SetAuthorizationStatusAction = { type: 'setAuthorizationStatus'; payload: AuthorizationStatus };

export type Action = SetCityAction | SetPlacesAction | SetIsLoadingPlacesAction | SetAuthorizationStatusAction;

export const initialOffersState: OffersState = {
  city: 'Paris',
  isLoadingPlaces: false,
  places: [],
};

export const initialUserState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown
};

export function offers(state: OffersState = initialOffersState, action: Action): OffersState {
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
    default:
      return state;
  }
}

export function user(state: UserState = initialUserState, action: Action): UserState {
  switch (action.type) {
    case 'setAuthorizationStatus': {
      const newAuthorizationStatus = action.payload;
      return {...state, authorizationStatus: newAuthorizationStatus};
    }
    default:
      return state;
  }
}
