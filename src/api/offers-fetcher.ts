import {AxiosInstance} from 'axios';
import {APIRoute} from '../const.ts';
import {CityPlaceInfo} from '../components/shared/city-place';

export default async function offersFetcher(api: AxiosInstance) {
  const response = await api.get(APIRoute.Offers);
  return response.data as CityPlaceInfo[];
}
