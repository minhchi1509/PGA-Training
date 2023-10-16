/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { EPsychoeducationActions } from './constants';
import {
  getDetailsPsychoeducation,
  getPsychoeducationListByTopic,
  getPsychoeducationTopics,
} from 'src/services/psychoeducation-service';
import { TGetPsychoeducationListByTopicAction } from './types';

export const getPsychoeducationTopicsAction = createAsyncThunk(
  EPsychoeducationActions.GET_PSYCHOEDUCATION_TOPICS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPsychoeducationTopics();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getPsychoeducationListByTopicAction = createAsyncThunk(
  EPsychoeducationActions.GET_PSYCHOEDUCATION_BY_TOPIC,
  async (payload: TGetPsychoeducationListByTopicAction, { rejectWithValue }) => {
    const { onSuccess, onError, ...params } = payload;

    try {
      const response = await getPsychoeducationListByTopic(params);
      onSuccess?.(response);
      return response;
    } catch (error: any) {
      onError?.(error);
      return rejectWithValue(error.data);
    }
  },
);

export const loadMorePsychoeducationListByTopicAction = createAsyncThunk(
  EPsychoeducationActions.LOAD_MORE_PSYCHOEDUCATION_BY_TOPIC,
  async (payload: TGetPsychoeducationListByTopicAction, { rejectWithValue }) => {
    const { onSuccess, onError, ...params } = payload;

    try {
      const response = await getPsychoeducationListByTopic(params);
      onSuccess?.(response);
      return response;
    } catch (error: any) {
      onError?.(error);
      return rejectWithValue(error.data);
    }
  },
);

export const getDetailsPsychoeducationAction = createAsyncThunk(
  EPsychoeducationActions.GET_DETAILS_PSYCHOEDUCATION,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getDetailsPsychoeducation(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);
