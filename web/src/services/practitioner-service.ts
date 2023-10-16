import { AxiosResponse } from 'axios';
import { TCommonGetDashboardParams, TGetDashboardResponse } from 'src/interfaces/common-interface';
import { ApiClient } from './api-client';

export const getPractitionerDashboard = async (requestParams: TCommonGetDashboardParams) => {
  const response: AxiosResponse<TGetDashboardResponse> = await ApiClient.get('/api/v1/practitioners/dashboard', {
    params: {
      timezone: requestParams.timezome,
    },
  });
  return response.data;
};
