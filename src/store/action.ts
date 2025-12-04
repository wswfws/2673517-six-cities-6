import {offersActions, userActions} from './reducer.ts';

export const {
  setCity,
  setPlaces,
  setIsLoadingPlaces,
  setOfferDetail,
  setNeighbors,
  setComments,
  setIsLoadingOffer,
  setOfferNotFound,
  setIsPostingComment,
} = offersActions;

export const { setAuthorizationStatus, setUserData } = userActions;
