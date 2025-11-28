import {AxiosInstance} from 'axios';
import {APIRoute} from '../const.ts';

export type UserData = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
  token: string;
}

export type AuthData = {
  email: string;
  password: string;
};

export default async function loginFetch(api: AxiosInstance, data: AuthData) {
  const response = await api.post<UserData>(APIRoute.Login, data);
  return response.data ;
}
