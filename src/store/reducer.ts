import {AuthorizationStatus} from '../const.ts';
import type {Review} from '../components/widgets/reviews/review-types.ts';
import {CityPlaceInfo, PlaceFullInfo} from '../components/shared/city-place';

export type OffersState = {
  city: string;
  isLoadingPlaces: boolean;
  places: CityPlaceInfo[];
  offerDetail: PlaceFullInfo | null;
  neighbors: CityPlaceInfo[];
  comments: Review[];
  isLoadingOffer: boolean;
  offerNotFound: boolean;
  isPostingComment: boolean;
};

export type UserState = {
  authorizationStatus: AuthorizationStatus;
};

type SetCityAction = { type: 'setCity'; payload: string };
type SetIsLoadingPlacesAction = { type: 'setIsLoadingPlaces'; payload: boolean };
type SetPlacesAction = { type: 'setPlaces'; payload: CityPlaceInfo[] };

type SetOfferDetailAction = { type: 'setOfferDetail'; payload: PlaceFullInfo | null };
type SetNeighborsAction = { type: 'setNeighbors'; payload: CityPlaceInfo[] };
type SetCommentsAction = { type: 'setComments'; payload: Review[] };
type SetIsLoadingOfferAction = { type: 'setIsLoadingOffer'; payload: boolean };
type SetOfferNotFoundAction = { type: 'setOfferNotFound'; payload: boolean };
type SetIsPostingCommentAction = { type: 'setIsPostingComment'; payload: boolean };

type SetAuthorizationStatusAction = { type: 'setAuthorizationStatus'; payload: AuthorizationStatus };

export type Action = SetCityAction | SetPlacesAction | SetIsLoadingPlacesAction | SetAuthorizationStatusAction
  | SetOfferDetailAction | SetNeighborsAction | SetCommentsAction | SetIsLoadingOfferAction | SetOfferNotFoundAction | SetIsPostingCommentAction;

export const initialOffersState: OffersState = {
  city: 'Paris',
  isLoadingPlaces: false,
  places: [],
  offerDetail: null,
  neighbors: [],
  comments: [],
  isLoadingOffer: false,
  offerNotFound: false,
  isPostingComment: false,
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
    case 'setOfferDetail': {
      return {...state, offerDetail: action.payload};
    }
    case 'setNeighbors': {
      return {...state, neighbors: action.payload};
    }
    case 'setComments': {
      return {...state, comments: action.payload};
    }
    case 'setIsLoadingOffer': {
      return {...state, isLoadingOffer: action.payload};
    }
    case 'setOfferNotFound': {
      return {...state, offerNotFound: action.payload};
    }
    case 'setIsPostingComment': {
      return {...state, isPostingComment: action.payload};
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
