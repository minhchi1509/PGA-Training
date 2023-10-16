import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import ApiClient from '@src/configs/api-config';
import {
  IContactHelpBody,
  TNotificationConfig,
  TNotificationConfigResponse,
} from '@src/interfaces/client-interfaces';

import {
  TClientMoodForm,
  TClientProfile,
  TUpdateInformationResponse,
  TUpdateMedicalProfileBody,
  TUpdateMedicalProfileResponse,
} from '@src/interfaces/client-interfaces';

dayjs.extend(timezone);

export const getClientProfile = async () => {
  const response = await ApiClient.get<TClientProfile>(
    `/api/v1/client/me?timezone=${dayjs.tz.guess()}`,
  );
  return response.data;
};

export const getListPsychoeducationTopics = async () => {
  const response = await ApiClient.get('/api/v1/psychoeducation-topic');
  return response.data;
};

export const getListPsychoeducation = async (id: string, page?: number, size = 10) => {
  const response = await ApiClient.get(
    `/api/v1/psychoeducation?psychoeducationTopicId=${id}&page=${page}&size=${size}`,
  );
  return response.data;
};

export const getPsychoeducationDetail = async (id: string) => {
  const response = await ApiClient.get(`/api/v1/psychoeducation/${id}`);
  return response.data;
};

export const sendContactHelp = async (body: IContactHelpBody) => {
  const res = await ApiClient.post<IContactHelpBody>('/api/v1/client/contact-help', body);
  return res.data;
};
export const getClientMoodRecent = async () => {
  const response = await ApiClient.get(`/api/v1/client-mood/recent`);
  return response.data;
};

export const postClientMood = async (data: TClientMoodForm) => {
  const response = await ApiClient.post(`/api/v1/client-mood`, data);
  return response.data;
};

export const getClientMood = async (data: { fromAt: string; toAt: string }) => {
  const response = await ApiClient.get(
    `/api/v1/client-mood/tracker?fromAt=${data.fromAt}&toAt=${data.toAt}`,
  );
  return response.data;
};

export const updateInformation = async (body: FormData) => {
  const response = await ApiClient.put<TUpdateInformationResponse>(
    '/api/v1/client/update-info',
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const updateMedicalProfile = async (
  practitionerClientId: string,
  body: TUpdateMedicalProfileBody,
) => {
  const response = await ApiClient.put<TUpdateMedicalProfileResponse>(
    `/api/v1/client/update-medical-info/${practitionerClientId}`,
    body,
  );
  return response.data;
};

export const updateNotificationSetting = async (body: TNotificationConfig) => {
  const res = await ApiClient.put<TNotificationConfigResponse>(
    'api/v1/client/notification-setting',
    body,
  );

  return res.data;
};
