import { TUpdateMedicalProfileBody } from '@src/interfaces/client-interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EClientThunkActions } from './constants';
import { clientService } from '@src/services';
import { TClientMoodForm } from '@src/interfaces/client-interfaces';

export const getClientProfile = createAsyncThunk(
  EClientThunkActions.GET_PROFILE,
  async (_, { rejectWithValue }) => {
    try {
      const data = await clientService.getClientProfile();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getClientMoodRecent = createAsyncThunk(
  EClientThunkActions.GET_MOOD_RECENT,
  async (_, { rejectWithValue }) => {
    try {
      const data = await clientService.getClientMoodRecent();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const postClientMoode = createAsyncThunk(
  EClientThunkActions.POST_CLIENT_MOOD,
  async (body: TClientMoodForm, { rejectWithValue }) => {
    try {
      const data = await clientService.postClientMood(body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getClientMood = createAsyncThunk(
  EClientThunkActions.GET_CLIENT_MOOD,
  async (body: { fromAt: string; toAt: string }, { rejectWithValue }) => {
    try {
      const data = await clientService.getClientMood(body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateInformation = createAsyncThunk(
  EClientThunkActions.UPDATE_INFORMATION,
  async (body: FormData, { rejectWithValue }) => {
    try {
      const data = await clientService.updateInformation(body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateMedicalProfile = createAsyncThunk(
  EClientThunkActions.UPDATE_MEDICAL_PROFILE,
  async (
    request: { practitionerClientId: string; body: TUpdateMedicalProfileBody },
    { rejectWithValue },
  ) => {
    try {
      const data = await clientService.updateMedicalProfile(
        request.practitionerClientId,
        request.body,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
