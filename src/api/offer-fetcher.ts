import {AxiosInstance} from 'axios';
import {PlaceFullInfo} from '../components/shared/city-place/city-place.ts';

export async function fetchOffer(api: AxiosInstance, id: string) {
  const response = await api.get(`/offers/${id}`);
  return response.data as PlaceFullInfo;
}

