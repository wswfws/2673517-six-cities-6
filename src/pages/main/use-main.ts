import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks.ts';
import {setCity} from '../../store/action.ts';
import {cities as TEST_CITIES} from '../../api/temp-get-places.tsx';
import type {Point} from '../../components/shared/map-types.ts';

export default function useMain(cityParam?: string) {
  const dispatch = useAppDispatch();
  const currentCity = useAppSelector((state) => state.offers.city);
  const places = useAppSelector((state) => state.offers.places);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);

  // При смене маршрута — обновляем текущее значение города в сторе
  useEffect(() => {
    if (!cityParam) {
      return;
    }
    dispatch(setCity(cityParam));
  }, [cityParam, dispatch]);

  // При изменении списка мест автоматически выбираем первый элемент
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

  const cityInfo = TEST_CITIES.find((c) => c.name === currentCity);

  return {
    currentCity,
    places,
    selectedPlaceId,
    setSelectedPlaceId,
    selectedPlacePoint,
    cityInfo,
  };
}

