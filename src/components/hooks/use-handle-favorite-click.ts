import {CityPlaceInfo} from "../shared/city-place";
import {useAppDispatch, useAuthorizationStatus} from "../../store/hooks.ts";
import {useNavigate} from "react-router-dom";
import React from "react";
import {AuthorizationStatus} from "../../const.ts";
import {ROUTE_CONFIG} from "../app/use-app-routes.ts";
import {postFavoriteAction} from "../../store/api-actions.ts";

const useHandleFavoriteClick = (cityPlaceInfo: CityPlaceInfo) => {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAuthorizationStatus();
  const navigate = useNavigate();

  return (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(ROUTE_CONFIG.LOGIN);
      return;
    }
    const status = cityPlaceInfo.isFavorite ? 0 : 1;
    dispatch(postFavoriteAction({offerId: cityPlaceInfo.id, status}));

  };
}

export default useHandleFavoriteClick;
