import {AxiosInstance} from 'axios';

export default async function offersFetcher(api: AxiosInstance) {
  const response = await api.get('/offers');
  return response.data as CityPlaceInfo[];
}
