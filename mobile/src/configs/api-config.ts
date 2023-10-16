import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';

import { EStorage } from '@src/variables/enum';
import GlobalNavigation from '@src/utils/navigation-utils';
import { ERootScreenList } from '@src/navigators/navigator-constants';
import ErrorResponse, { TErrorResponseData } from '@src/interfaces/error-response-interfaces';

const ApiClient = axios.create({ baseURL: Config.API_URL });

ApiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem(EStorage.ACCESS_TOKEN);
    config.headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : '';
    return config;
  },
  (error) => Promise.reject(error),
);

ApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<TErrorResponseData>) => {
    if (error.response?.status === 401) {
      await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
      GlobalNavigation.reset(ERootScreenList.GUEST_NAVIGATOR);
      throw new ErrorResponse('Login session expired');
    }
    if (error.response) {
      const errorResponseData = error.response.data;
      const errorMessage = errorResponseData.message;
      throw new ErrorResponse(errorMessage, errorResponseData);
    }
    return Promise.reject(error);
  },
);

export default ApiClient;
