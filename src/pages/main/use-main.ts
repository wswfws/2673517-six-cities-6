import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector, useCities} from '../../store/hooks.ts';
import {setCity} from '../../store/action.ts';
import type {Point} from '../../components/shared/map-types.ts';

export default function useMain(cityParam?: string) {

  const cities = useCities();

  const dispatch = useAppDispatch();
  const currentCity = useAppSelector((state) => state.offers.city);
  const places = useAppSelector((state) => state.offers.places);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!cityParam) {
      return;
    }
    dispatch(setCity(cityParam));
  }, [cityParam, dispatch]);

  useEffect(() => {
    if (places && places.length > 0) {
      setSelectedPlaceId(places[0].id);
    } else {
      setSelectedPlaceId(undefined);
    }
  }, [places]);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);
  const selectedPlacePoint: Point | undefined = selectedPlace && {
    id: selectedPlace.id,
    latitude: selectedPlace.location.latitude,
    longitude: selectedPlace.location.longitude,
  };

  const cityInfo = cities.find((c) => c.name === currentCity);

  return {
    currentCity,
    places,
    selectedPlaceId,
    setSelectedPlaceId,
    selectedPlacePoint,
    cityInfo,
  };
}

