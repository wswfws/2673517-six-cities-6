import {AxiosInstance} from 'axios';
import {CityPlaceInfo} from '../components/shared/city-place/city-place.ts';

/**
 * Change favorite status of an offer on the server.
 * Uses the backend route /favorite/{id}/{status} where status is 0 or 1.
 * Returns the updated offer object.
 */
export default async function changeFavoriteStatus(api: AxiosInstance, offerId: string, status: 0 | 1) {
  const response = await api.post(`/favorite/${offerId}/${status}`);
  return response.data as CityPlaceInfo;
}

