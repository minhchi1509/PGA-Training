import { createAsyncThunk } from '@reduxjs/toolkit';

import { EAuthThunkActions } from './constants';
import { authService } from '@src/services';
import { ILoginBody, ISendOTPBody } from '@src/interfaces/auth-interfaces';

export const sendOTPLogin = createAsyncThunk(
  EAuthThunkActions.SEND_OTP_LOGIN,
  async (body: ISendOTPBody, { rejectWithValue }) => {
    try {
      const data = await authService.sendOTPLogin(body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk(
  EAuthThunkActions.LOGIN,
  async (body: ILoginBody, { rejectWithValue }) => {
    try {
      const data = await authService.login(body);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
