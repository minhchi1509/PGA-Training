import { AxiosResponse } from 'axios';

import {
  TChangePasswordRequest,
  TCheckStatusResetPasswordTokenResponse,
  TCheckVerifyProfileResponse,
  TForgotPasswordResponse,
  TPractitionerSignUpRequest,
  TPractitionerSignUpResponse,
  TResetPasswordRequest,
  TSendOTPLoginRequest,
  TSendOTPLoginResponse,
  TSignInRequest,
  TSignInResponse,
  TSignUpRequest,
  TSignUpResponse,
  TVerifyProfileResponse,
} from 'src/interfaces/auth-interface';
import { ApiClient } from './api-client';

export const signIn = async (payload: TSignInRequest) => {
  const response: AxiosResponse<TSignInResponse> = await ApiClient.post(`/api/v1/auth/login`, payload);
  return response.data;
};

export const signUp = async (payload: TSignUpRequest) => {
  const response: AxiosResponse<TSignUpResponse> = await ApiClient.post('/api/v1/auth/register', payload);

  return response.data;
};

export const practitionerSignUp = async (payload: TPractitionerSignUpRequest) => {
  const response: AxiosResponse<TPractitionerSignUpResponse> = await ApiClient.post(
    '/api/v1/auth/practitioner/register',
    payload,
  );

  return response.data;
};

export const verifyAccount = async (id: string) => {
  const response: AxiosResponse<string> = await ApiClient.put('/api/v1/auth/verify', { token: id });

  return response.data;
};

export const resendEmailVerify = async (id: string) => {
  const response: AxiosResponse<string> = await ApiClient.post('/api/v1/auth/verify/resend', { id });

  return response.data;
};

export const verifyProfile = async (profileId: string) => {
  const response: AxiosResponse<TVerifyProfileResponse> = await ApiClient.post(
    `/api/v1/auth/verify-profile/${profileId}`,
  );

  return response.data;
};

export const checkVerifyProfileStatus = async (profileId: string) => {
  const response: AxiosResponse<TCheckVerifyProfileResponse> = await ApiClient.get(
    `/api/v1/auth/verify-profile/${profileId}`,
  );

  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response: AxiosResponse<TForgotPasswordResponse> = await ApiClient.post('/api/v1/auth/forgot-password', {
    email,
  });

  return response.data;
};

export const resetPassword = async (payload: TResetPasswordRequest) => {
  const response = await ApiClient.post('/api/v1/auth/reset-password', payload);

  return response.data;
};

export const checkStatusResetPasswordToken = async (token: string) => {
  const response: AxiosResponse<TCheckStatusResetPasswordTokenResponse> = await ApiClient.get('/api/v1/reset-tokens', {
    params: { token },
  });

  return response.data;
};

export const changePassword = async (payload: TChangePasswordRequest) => {
  const response: AxiosResponse = await ApiClient.post(`/api/v1/auth/change-password`, payload);

  return response.data;
};

export const sendOTPLogin = async (payload: TSendOTPLoginRequest) => {
  const response: AxiosResponse<TSendOTPLoginResponse> = await ApiClient.post('/api/v1/auth/send-verify-code', payload);
  return response.data;
};

export const logout = async () => {
  const response = await ApiClient.post('/api/v1/auth/logout');
  return response.data;
};
