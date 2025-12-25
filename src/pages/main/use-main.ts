import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector, useCities, usePlacesByCity} from '../../store/hooks.ts';
import {setCity} from '../../store/action.ts';
import type {Point} from '../../components/shared/maps';

export default function useMain(cityParam?: string) {
  const dispatch = useAppDispatch();
  const cities = useCities();
  const currentCity = useAppSelector((state) => state.offers.city);
  const isLoadingPlaces = useAppSelector((state) => state.offers.isLoadingPlaces);

  useEffect(() => {
    if (cityParam) {
      dispatch(setCity(cityParam));
    }
  }, [cityParam, dispatch]);

  const fallbackCity = cityParam ?? currentCity ?? 'Paris';
  const places = usePlacesByCity(fallbackCity);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!places || places.length === 0) {
      setSelectedPlaceId(undefined);
      return;
    }

    setSelectedPlaceId((prev) => {
      if (prev && places.some((place) => place.id === prev)) {
        return prev;
      }
      return places[0].id;
    });
  }, [places]);

  const selectedPlace = useMemo(() => places.find((p) => p.id === selectedPlaceId), [places, selectedPlaceId]);

  const selectedPlacePoint: Point | undefined = useMemo(() => {
    if (!selectedPlace) {
      return undefined;
    }
    return {
      id: selectedPlace.id,
      latitude: selectedPlace.location.latitude,
      longitude: selectedPlace.location.longitude,
    };
  }, [selectedPlace]);

  const cityInfo = useMemo(() => cities.find((c) => c.name === currentCity), [cities, currentCity]);

  const mapPoints = useMemo(() => places.map((place) => ({
    id: place.id,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
  })), [places]);

  return {
    isLoadingPlaces,
    currentCity,
    places,
    selectedPlaceId,
    setSelectedPlaceId,
    selectedPlacePoint,
    cityInfo,
    mapPoints,
  };
}

