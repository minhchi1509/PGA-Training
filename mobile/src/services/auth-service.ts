import ApiClient from '@src/configs/api-config';
import {
  IChangePasswordBody,
  ILoginBody,
  ILoginResponse,
  ISendOTPBody,
} from '@src/interfaces/auth-interfaces';

export const login = async (body: ILoginBody) => {
  const response = await ApiClient.post<ILoginResponse>('/api/v1/auth/client-login', body);
  return response.data;
};

export const sendOTPLogin = async (body: ISendOTPBody) => {
  const response = await ApiClient.post('/api/v1/auth/send-verify-code', body);
  return response.data;
};

export const changePassword = async (body: IChangePasswordBody) => {
  const response = await ApiClient.post('/api/v1/auth/change-password', body);
  return response.data;
};
