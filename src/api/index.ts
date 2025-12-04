import axios, {AxiosError, AxiosResponse} from 'axios';
import {StatusCodes} from 'http-status-codes';
import {toast} from 'react-toastify';
import {getToken} from '../services/token.ts';

type DetailMessageType = {
  errorType: string;
  message: string;
  details: {
    property: string;
    value: string;
    messages: string[];
  }[];
}

const StatusCodeMapping = new Set<StatusCodes>([
  StatusCodes.BAD_REQUEST,
  StatusCodes.UNAUTHORIZED,
  StatusCodes.NOT_FOUND
]);

const shouldDisplayError = (response: AxiosResponse) => StatusCodeMapping.has(response.status);
const BACKEND_URL = 'https://14.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;

export const createAPI = () => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers['X-Token'] = token;
      }
      return config;
    },
  );
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = (error.response.data);
        detailMessage.details.forEach(({messages, property}) =>
          toast.error(`${property}: ${messages.join(', ')}`)
        );
        toast.warn(detailMessage.message);
      }

      throw error;
    }
  );
  return api;
};
