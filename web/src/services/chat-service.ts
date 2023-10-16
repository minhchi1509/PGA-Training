import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { ApiClient } from './api-client';
import {
  TDeleteChatRoomRequest,
  TDeleteChatRoomResponse,
  TDownloadFileMessageRequest,
  TDownloadFileMessageResponse,
  TGetChatMembersParams,
  TGetChatMembersResponse,
  TGetRoomMessagesParams,
  TGetRoomMessagesResponse,
  TGetRoomsParams,
  TGetRoomsResponse,
  TMarkSeenMessageRequest,
  TMarkSeenMessageResponse,
  TSendMessageRequest,
  TSendMessageResponse,
  TStartRoomRequest,
  TStartRoomResponse,
} from 'src/interfaces/chat-interface';

export const getChatMemberService = async (params: TGetChatMembersParams) => {
  const response: AxiosResponse<TGetChatMembersResponse> = await ApiClient.get(`/api/v1/chat/members`, { params });
  return response.data;
};

export const startRoomService = async (payload: TStartRoomRequest) => {
  const response: AxiosResponse<TStartRoomResponse> = await ApiClient.post(`/api/v1/chat/rooms`, payload);
  return response.data;
};

export const getRoomMessages = async (params: TGetRoomMessagesParams) => {
  const response: AxiosResponse<TGetRoomMessagesResponse> = await ApiClient.get(
    `/api/v1/chat/rooms/${params.roomId}/messages`,
    { params },
  );
  return response.data;
};

export const sendMessage = async (payload: TSendMessageRequest) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response: AxiosResponse<TSendMessageResponse> = await ApiClient.post(
    `/api/v1/chat/rooms/${payload.roomId}/messages`,
    payload.payload,
    config,
  );
  return response.data;
};

export const getRooms = async (params: TGetRoomsParams) => {
  const response: AxiosResponse<TGetRoomsResponse> = await ApiClient.get(`/api/v1/chat/rooms`, { params });
  return response.data;
};

export const markSeenMessage = async (payload: TMarkSeenMessageRequest) => {
  const response: AxiosResponse<TMarkSeenMessageResponse> = await ApiClient.patch(
    `/api/v1/chat/mark-seen-messages`,
    payload,
  );
  return response.data;
};

export const downloadFileMessage = async (payload: TDownloadFileMessageRequest) => {
  const response: AxiosResponse<TDownloadFileMessageResponse> = await ApiClient.post(
    `/api/v1/chat/rooms/${payload.roomId}/messages/${payload.messageId}/files/${payload.fileId}/download`,
    {},
    { responseType: 'blob' },
  );
  return response.data;
};

export const deleteChatRoom = async (payload: TDeleteChatRoomRequest) => {
  const response: AxiosResponse<TDeleteChatRoomResponse> = await ApiClient.delete(
    `/api/v1/chat/rooms/${payload.roomId}`,
  );
  return response.data;
};
