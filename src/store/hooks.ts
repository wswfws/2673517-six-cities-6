import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from './index';
import {City} from '../components/shared/maps';
import {useMemo} from 'react';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCities = () => {
  const places = useAppSelector((state) => state.offers.places);
  const citiesNames = new Set<string>();
  const cities = new Set<City>();

  places.forEach((place) => {
    if (!citiesNames.has(place.city.name)) {
      citiesNames.add(place.city.name);
      cities.add(place.city);
    }
  });

  return [...cities];
};

export const usePlacesByCity = (cityName: string) => {
  const places = useAppSelector((state) => state.offers.places);

  return useMemo(() =>
    places.filter((place) => place.city.name === cityName),
  [places, cityName]
  );
};

export const useAuthorizationStatus = () =>
  useAppSelector((state) => state.user.authorizationStatus);
