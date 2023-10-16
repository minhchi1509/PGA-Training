/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import ResponseError from 'src/interfaces/error-response-interface';

// import { logout as logoutService } from 'src/services/auth-service';
import { RoutePaths } from 'src/routes/routes-constants';
import { EAuthToken, EUserProfile } from 'src/variables/storage';

// const DEFAULT_MAX_IDLE_TIME = 1800000;

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
const requestHandler = (config: AxiosRequestConfig) => {
  const atk = localStorage.getItem(EAuthToken.ACCESS_TOKEN);
  const profileid = localStorage.getItem(EUserProfile.PROFILE_ID);

  const configHeaders = {
    Authorization: atk ? `Bearer ${atk}` : '',
    ...config.headers,
  };

  config.headers = configHeaders;
  if (profileid) {
    config.headers = { ...configHeaders, profileid };
  }

  config.params = {
    ...config.params,
    version: Date.now(),
  };

  return config;
};

const responseErrorHandler = async (err: AxiosError) => {
  if (err?.response?.status === 401) {
    localStorage.clear();
    window.location.pathname = RoutePaths.SIGN_IN;
    return;
  }

  if (err?.response?.status === 403) {
    window.location.pathname = RoutePaths.HOME;
    return;
  }

  const data: any = err?.response?.data;
  const message = data?.message;

  if (message && typeof message === 'object' && message.length) {
    throw new ResponseError(message[0], data);
  }
  if (message) throw new ResponseError(message, data);
  return Promise.reject(err);
};

// let timer: NodeJS.Timeout;

// const logout = async () => {
//   await logoutService();
//   localStorage.clear();
//   window.location.pathname = RoutePaths.SIGN_IN;
// };

const responseSuccessHandler = async (response: AxiosResponse) => {
  // const isAuthenticated = response.config.headers?.['Authorization'];

  // timer && clearTimeout(timer);
  // if (isAuthenticated) {
  //   timer = setTimeout(logout, DEFAULT_MAX_IDLE_TIME);
  // }
  return response;
};

axiosInstance.interceptors.request.use(requestHandler, (err) => Promise.reject(err));
axiosInstance.interceptors.response.use(responseSuccessHandler, responseErrorHandler);

export { axiosInstance as ApiClient };
