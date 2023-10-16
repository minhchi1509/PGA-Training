import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import ApiClient from '@src/configs/api-config';
import {
  TGetHomeworkAssignBody,
  TGetHomeworkAssignDetailResponse,
  TGetHomeworkAssignResponse,
  TSubmitHomeworkAssignRequest,
  TUploadHomeworkFilesResponse,
} from '@src/interfaces/homework-interfaces';

dayjs.extend(timezone);

export const getHomeworkAssign = async (body: TGetHomeworkAssignBody) => {
  const response = await ApiClient.post<TGetHomeworkAssignResponse>(
    '/api/v1/clients/homework-assign',
    body,
  );
  return response.data;
};

export const getHomeworkAssignDetail = async (id: string) => {
  const response = await ApiClient.get<TGetHomeworkAssignDetailResponse>(
    `/api/v1/clients/homework-assign/${id}?timezone=${dayjs.tz.guess()}`,
  );
  return response.data;
};

export const submitHomework = async (id: string, body: TSubmitHomeworkAssignRequest) => {
  const response = await ApiClient.post(
    `/api/v1/clients/homework-assign/${id}/submit-response`,
    body,
  );
  return response.data;
};

export const uploadHomeworkFiles = async (body: FormData) => {
  const response = await ApiClient.post<TUploadHomeworkFilesResponse>(
    '/api/v1/clients/homework-assign/upload',
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
