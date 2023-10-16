import { AxiosResponse } from 'axios';

import { ApiClient } from './api-client';
import {
  TGetDetailsPsychoeducationResponse,
  TGetPsychoeducationListByTopicParams,
  TGetPsychoeducationListByTopicResponse,
  TGetPsychoeducationTopicsResponse,
} from 'src/interfaces/psychoeducation-interface';

export const getPsychoeducationTopics = async () => {
  const response: AxiosResponse<TGetPsychoeducationTopicsResponse> = await ApiClient.get(
    'api/v1/psychoeducation-topic',
  );
  return response.data;
};

export const getPsychoeducationListByTopic = async (params: TGetPsychoeducationListByTopicParams) => {
  const response: AxiosResponse<TGetPsychoeducationListByTopicResponse> = await ApiClient.get(
    'api/v1/psychoeducation',
    { params },
  );
  return response.data;
};

export const getDetailsPsychoeducation = async (id: string) => {
  const response: AxiosResponse<TGetDetailsPsychoeducationResponse> = await ApiClient.get(
    `api/v1/psychoeducation/${id}`,
  );
  return response.data;
};
