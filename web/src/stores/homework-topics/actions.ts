import { showSuccessToast, showErrorToast } from 'src/components/toast/Toast';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TAssignHomeworkRequest,
  TCreateHomeworkParams,
  TCreateHomeworkTopicParams,
  TGetTasksByTopicParams,
  THomework,
} from 'src/interfaces/clients-interface';

import { TGetHomeworkTopicsParams, THomeworkTopic } from 'src/interfaces/homework-topics';
import { assignHomework, getHomeworkTopics, getTasksByTopic } from 'src/services/homework-topics';
import { EHomeworkTopicsAction } from './constants';
import { AxiosResponse } from 'axios';
import { ApiClient } from 'src/services/api-client';
import ResponseError from 'src/interfaces/error-response-interface';

export const getHomeworkTopicsAction = createAsyncThunk(
  EHomeworkTopicsAction.GET_HOMEWORK_TOPICS,
  async (params: TGetHomeworkTopicsParams, { rejectWithValue }) => {
    try {
      const response = await getHomeworkTopics(params);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const loadMoreHomeworkTopicsAction = createAsyncThunk(
  EHomeworkTopicsAction.LOAD_MORE_HOMEWORK_TOPICS,
  async (params: TGetHomeworkTopicsParams, { rejectWithValue }) => {
    try {
      const response = await getHomeworkTopics(params);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getHomeworkTopicsByTypeAction = createAsyncThunk(
  EHomeworkTopicsAction.GET_HOMEWORK_TOPICS_BY_TYPE,
  async (params: TGetHomeworkTopicsParams, { rejectWithValue }) => {
    try {
      const response = await getHomeworkTopics(params);
      return { ...response, type: params.homeworkType };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const loadMoreHomeworkTopicsByTypeAction = createAsyncThunk(
  EHomeworkTopicsAction.LOAD_MORE_HOMEWORK_TOPICS_BY_TYPE,
  async (params: TGetHomeworkTopicsParams, { rejectWithValue }) => {
    try {
      const response = await getHomeworkTopics(params);
      return { ...response, type: params.homeworkType };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const assignHomeworkAction = createAsyncThunk(
  EHomeworkTopicsAction.ASSIGN_HOMEWORK,
  async (bodyRequest: TAssignHomeworkRequest, { rejectWithValue }) => {
    try {
      const response = await assignHomework(bodyRequest);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getTasksByTopicAction = createAsyncThunk(
  EHomeworkTopicsAction.GET_TASKS_BY_TOPIC,
  async (params: TGetTasksByTopicParams, { rejectWithValue }) => {
    try {
      const response = await getTasksByTopic(params);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const loadMoreTasksByTopicAction = createAsyncThunk(
  EHomeworkTopicsAction.LOAD_MORE_TASKS_BY_TOPIC,
  async (params: TGetTasksByTopicParams, { rejectWithValue }) => {
    try {
      const response = await getTasksByTopic(params);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const createHomeworkTopicsAction = createAsyncThunk(
  EHomeworkTopicsAction.CREATE_HOMEWORK_TOPIC,
  async (params: TCreateHomeworkTopicParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<THomeworkTopic> = await ApiClient.post(`/api/v1/homework-topics`, params);
      showSuccessToast('Your topic has been created');
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      return rejectWithValue(error.data);
    }
  },
);

export const createHomeworkAction = createAsyncThunk(
  EHomeworkTopicsAction.CREATE_HOMEWORK,
  async (params: TCreateHomeworkParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<THomework> = await ApiClient.post(`/api/v1/homeworks`, params);
      showSuccessToast('Add new homework successfully!');
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      return rejectWithValue(error.data);
    }
  },
);

export const updateHomeworkByIdAction = createAsyncThunk(
  EHomeworkTopicsAction.UPDATE_HOMEWORK_BY_ID,
  async (params: TCreateHomeworkParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<THomework> = await ApiClient.put(`/api/v1/homeworks/${params.id}`, params);
      showSuccessToast('Edit homework successfully!');
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      return rejectWithValue(error.data);
    }
  },
);
