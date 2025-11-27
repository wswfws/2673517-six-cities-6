import axios, {AxiosInstance} from 'axios';
import {BACKEND_URL, REQUEST_TIMEOUT} from '../const.ts';
// import {StatusCodes} from 'http-status-codes';

// type DetailMessageType = {
//   type: string;
//   message: string;
// }
//
// const ErrorStatusCode = new Set([StatusCodes.BAD_REQUEST, StatusCodes.UNAUTHORIZED, StatusCodes.NOT_FOUND]);
//
// const shouldDisplayError = (response: AxiosResponse) => ErrorStatusCode.has(response.status);

export const createAPI = (): AxiosInstance => axios.create({
  baseURL: BACKEND_URL,
  timeout: REQUEST_TIMEOUT,
});
