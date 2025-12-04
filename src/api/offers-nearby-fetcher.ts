import {AxiosInstance} from 'axios';
import {CityPlaceInfo} from '../components/shared/city-place';

export async function fetchNearbyOffers(api: AxiosInstance, id: string) {
  const response = await api.get(`/offers/${id}/nearby`);
  return response.data as CityPlaceInfo[];
}

