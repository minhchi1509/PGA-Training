import { createAsyncThunk } from '@reduxjs/toolkit';

import ResponseError from 'src/interfaces/error-response-interface';
import { sendOTPLogin, signIn } from 'src/services/auth-service';
import { EAuthActions } from './auth-constants';
import { TSendOtpLoginAction, TSignInAction } from './auth-types';

export const signInAction = createAsyncThunk(
  EAuthActions.SIGN_IN,
  async (payload: TSignInAction, { rejectWithValue }) => {
    const { onSuccess, onError, ...bodyRequest } = payload;
    try {
      const response = await signIn(bodyRequest);
      onSuccess?.(response);
      return response;
    } catch (error) {
      onError?.(error as ResponseError);
      return rejectWithValue(error);
    }
  },
);

export const sendOtpLoginAction = createAsyncThunk(
  EAuthActions.SEND_OTP_LOGIN,
  async (payload: TSendOtpLoginAction, { rejectWithValue }) => {
    const { onSuccess, onError, ...bodyRequest } = payload;
    try {
      const response = await sendOTPLogin(bodyRequest);
      onSuccess?.();
      return response;
    } catch (error) {
      onError?.(error as ResponseError);
      return rejectWithValue(error);
    }
  },
);
