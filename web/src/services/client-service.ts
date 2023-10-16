import { AxiosResponse } from 'axios';

import { ApiClient } from './api-client';
import { TDass, TTrackMood } from 'src/interfaces/clients-interface';

export const getTrackMoodByDay = async (clientId: string, fromAt: string, toAt: string) => {
  const response: AxiosResponse<TTrackMood[]> = await ApiClient.get(
    `/api/v1/practitioners/client-management/${clientId}/mood-tracker?fromAt=${fromAt}&toAt=${toAt}`,
  );
  return response.data;
};

export const getTrackDass = async (clientId: string, type: string) => {
  const response: AxiosResponse<TDass> = await ApiClient.get(
    `/api/v1/practitioners/client-management/${clientId}/dass-tracker?type=${type}`,
  );
  return response.data;
};
