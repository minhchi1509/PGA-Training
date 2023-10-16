import { AxiosResponse } from 'axios';

import { ApiClient } from './api-client';
import { TTotalMember } from 'src/interfaces/owner-interface';
import { TCommonGetDashboardParams, TGetDashboardResponse } from 'src/interfaces/common-interface';

export const getTotalMember = async () => {
  const response: AxiosResponse<TTotalMember> = await ApiClient.get(`/api/v1/owner/total-member`);
  return response.data;
};

export const getOwnerDashboard = async (requestParams: TCommonGetDashboardParams) => {
  const response: AxiosResponse<TGetDashboardResponse> = await ApiClient.get('/api/v1/clinics/dashboard', {
    params: {
      timezone: requestParams.timezome,
    },
  });
  return response.data;
};
