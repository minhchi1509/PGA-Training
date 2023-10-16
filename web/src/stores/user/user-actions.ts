import { createAsyncThunk } from '@reduxjs/toolkit';

import { ApiClient } from 'src/services/api-client';
import { EUserActions } from './user-constants';
import { getCurrentTimezone } from 'src/utils/common-utils';

export const getUserProfile = createAsyncThunk(EUserActions.GET_USER_PROFILE, async () => {
  const response = await ApiClient.get(`/api/v1/account/me?timezone=${getCurrentTimezone()}`);

  return response.data;
});

export const startApp = createAsyncThunk(EUserActions.START_APP, async () => {
  const response = await ApiClient.put(`/api/v1/account/start-app`);
  return response.data;
});
