import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const.ts';
import type { Review } from '../components/widgets/reviews/review-types.ts';
import { CityPlaceInfo, PlaceFullInfo } from '../components/shared/city-place';
import { AuthInfo } from './AuthInfo.ts';

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
  userData: AuthInfo | null;
};

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
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState: initialOffersState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setIsLoadingPlaces(state, action: PayloadAction<boolean>) {
      state.isLoadingPlaces = action.payload;
    },
    setPlaces(state, action: PayloadAction<CityPlaceInfo[]>) {
      state.places = action.payload;
    },
    setOfferDetail(state, action: PayloadAction<PlaceFullInfo | null>) {
      state.offerDetail = action.payload;
    },
    setNeighbors(state, action: PayloadAction<CityPlaceInfo[]>) {
      state.neighbors = action.payload;
    },
    setComments(state, action: PayloadAction<Review[]>) {
      state.comments = action.payload;
    },
    setIsLoadingOffer(state, action: PayloadAction<boolean>) {
      state.isLoadingOffer = action.payload;
    },
    setOfferNotFound(state, action: PayloadAction<boolean>) {
      state.offerNotFound = action.payload;
    },
    setIsPostingComment(state, action: PayloadAction<boolean>) {
      state.isPostingComment = action.payload;
    },
    updatePlace(state, action: PayloadAction<CityPlaceInfo>) {
      const updated = action.payload;
      state.places = state.places.map((p) => p.id === updated.id ? updated : p);
      state.neighbors = state.neighbors.map((n) => n.id === updated.id ? updated : n);
      if (state.offerDetail && state.offerDetail.id === updated.id) {
        state.offerDetail = {...state.offerDetail, isFavorite: updated.isFavorite} as PlaceFullInfo;
      }
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setAuthorizationStatus(state, action: PayloadAction<AuthorizationStatus>) {
      state.authorizationStatus = action.payload;
    },
    setUserData(state, action: PayloadAction<AuthInfo | null>) {
      state.userData = action.payload;
    },
  },
});


export const offersActions = offersSlice.actions;
export const userActions = userSlice.actions;

export const offersReducer = offersSlice.reducer;
export const userReducer = userSlice.reducer;
