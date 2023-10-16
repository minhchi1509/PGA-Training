import { createAsyncThunk } from '@reduxjs/toolkit';
import { EHomeworkThunkActions } from './constants';
import {
  TGetHomeworkAssignBody,
  TSubmitHomeworkAssignRequest,
} from '@src/interfaces/homework-interfaces';
import { homeworkService } from '@src/services';

export const getHomeworkAssign = createAsyncThunk(
  EHomeworkThunkActions.GET_HOMEWORK_ASSIGN,
  async (body: TGetHomeworkAssignBody, { rejectWithValue }) => {
    try {
      const data = await homeworkService.getHomeworkAssign(body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getHomeworkAssignDetail = createAsyncThunk(
  EHomeworkThunkActions.GET_HOMEWORK_ASSIGN_DETAIL,
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await homeworkService.getHomeworkAssignDetail(id);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const submitHomework = createAsyncThunk(
  EHomeworkThunkActions.SUBMIT_HOMEWORK,
  async ({ id, body }: { id: string; body: TSubmitHomeworkAssignRequest }, { rejectWithValue }) => {
    try {
      const data = await homeworkService.submitHomework(id, body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
