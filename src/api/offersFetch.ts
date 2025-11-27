import {AxiosInstance} from "axios";

export default async function offersFetcher(api: AxiosInstance) {
  try {
    const response = await api.get('/offers');
    return response.data as CityPlaceInfo[];
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};
