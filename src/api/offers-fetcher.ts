import {AxiosInstance} from 'axios';
import {APIRoute} from '../const.ts';

export default async function offersFetcher(api: AxiosInstance) {
  const response = await api.get(APIRoute.Offers);
  return response.data as CityPlaceInfo[];
}
