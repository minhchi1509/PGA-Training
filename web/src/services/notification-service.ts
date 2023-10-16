import { AxiosResponse } from 'axios';

import {
  TAddDeviceTokenResponse,
  TGetNotificationsParams,
  TGetNotificationsResponse,
  TMarkSeenNotificationRequest,
  TSettingNotificationRequest,
  TTotalUnreadNotificationsResponse,
} from 'src/interfaces/notification-interface';
import { ApiClient } from './api-client';
import { TNotificationConfig } from 'src/stores/user/user-constants';

export const getNotifications = async (params: TGetNotificationsParams) => {
  const response: AxiosResponse<TGetNotificationsResponse> = await ApiClient.get(`/api/v1/notifications`, { params });
  return response.data;
};

export const markSeenNotification = async (payload: TMarkSeenNotificationRequest) => {
  const response: AxiosResponse<TGetNotificationsResponse> = await ApiClient.patch(
    `/api/v1/notifications/${payload.notificationId}/mark-seen`,
  );
  return response.data;
};

export const getTotalUnreadNotifications = async () => {
  const response: AxiosResponse<TTotalUnreadNotificationsResponse> = await ApiClient.get(
    '/api/v1/notifications/total-unread',
  );
  return response.data;
};

export const addDeviceToken = async (token: string) => {
  const response: AxiosResponse<TAddDeviceTokenResponse> = await ApiClient.post('/api/v1/device-tokens', {
    token,
    type: 'WEB',
  });
  return response.data;
};

export const settingNotification = async (payload: TSettingNotificationRequest) => {
  const response: AxiosResponse<TNotificationConfig> = await ApiClient.put(
    '/api/v1/profiles/notification-setting',
    payload,
  );
  return response.data;
};
