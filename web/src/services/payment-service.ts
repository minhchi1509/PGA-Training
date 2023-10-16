import { AxiosResponse } from 'axios';

import { ApiClient } from './api-client';
import {
  TCurrentPayment,
  TPaymentPackage,
  TCancelSubscriptionRequest,
  TCreateSubscriptionRequest,
  TUpdateSubscriptionRequest,
  TTrialTimeResponse,
} from 'src/interfaces/profile-interface';

export const getListPaymentPackage = async () => {
  const response: AxiosResponse<TPaymentPackage[]> = await ApiClient.get(`/api/v1/payments/packages`);
  return response.data;
};

export const createSubscription = async (payload: TCreateSubscriptionRequest) => {
  const response: AxiosResponse<{ id: string }> = await ApiClient.post(`/api/v1/payments/subscriptions`, payload);
  return response.data;
};

export const getCurrentSubscription = async () => {
  const response: AxiosResponse<TCurrentPayment> = await ApiClient.get(`/api/v1/clinics/current-subscription`);
  return response.data;
};

export const cancelSubscription = async (payload: TCancelSubscriptionRequest) => {
  const response: AxiosResponse<{ id: string }> = await ApiClient.post(`/api/v1/payments/cancel-subscription`, payload);
  return response.data;
};

export const updateSubscription = async (payload: TUpdateSubscriptionRequest) => {
  const response: AxiosResponse<{ id: string }> = await ApiClient.put(`/api/v1/payments/change-subscription`, payload);
  return response.data;
};

export const getTrialTime = async () => {
  const response: AxiosResponse<TTrialTimeResponse> = await ApiClient.get(`/api/v1/clinics/trial-time`);
  return response.data;
};
