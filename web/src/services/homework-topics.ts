import { AxiosResponse } from 'axios';

import { ApiClient } from './api-client';
import { TGetHomeworkTopicsParams, TGetHomeworkTopicsResponse } from 'src/interfaces/homework-topics';
import {
  TAssignHomeworkRequest,
  TAssignHomeworkResponse,
  TGetTasksByTopicParams,
  TGetTasksByTopicResponse,
} from 'src/interfaces/clients-interface';

export const getHomeworkTopics = async (params: TGetHomeworkTopicsParams) => {
  const response: AxiosResponse<TGetHomeworkTopicsResponse> = await ApiClient.get(`/api/v1/homework-topics`, {
    params,
  });
  return response.data;
};

export const assignHomework = async (bodyRequest: TAssignHomeworkRequest) => {
  const response: AxiosResponse<TAssignHomeworkResponse> = await ApiClient.post(
    '/api/v1/practitioners/homework-assign',
    bodyRequest,
  );

  return response.data;
};

export const getTasksByTopic = async (params: TGetTasksByTopicParams) => {
  const response: AxiosResponse<TGetTasksByTopicResponse> = await ApiClient.get('/api/v1/homeworks', { params });

  return response.data;
};
