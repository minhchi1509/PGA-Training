/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AxiosResponse } from 'axios';
import {
  TClientInfomationResponse,
  TClientUpdateInfoRequest,
  TClientUpdateInfoResponse,
  TClientUploadFileRequest,
  TClientUploadFileResponse,
  TDeleteClientFileRequest,
  TDeleteClientFileResponse,
  TDischargeClientRequest,
  TGetAssignedHomeworkDetailsParams,
  TGetAssignedHomeworkDetailsResponse,
  TGetAssignedHomeworkHistoriesParams,
  TGetAssignedHomeworkHistoriesResponse,
  TGetAssignedHomeworkParams,
  TGetClientFileParams,
  TGetClientFilesResponse,
  TGetClientsParams,
  TGetClientsResponse,
  TGetHomeworkHistoryListParams,
  TGetHomeworkHistoryListResponse,
  TGetHomeworkResultParams,
  TGetHomeworkResultResponse,
  TGetTotalAssignedHomeworkParams,
  TGetTotalAssignedHomeworkResponse,
  TInviteClientRequest,
  TInviteClientResponse,
  TMedicalProfileRequest,
  TRemoveAssignedHomeworkParams,
  TRemoveAssignedHomeworkResponse,
  TResendResponse,
  TRevokeResponse,
  TUpdateHomeworkDetailsRequest,
  TUpdateHomeworkDetailsResponse,
  TUpdateMedicalProfileResponse,
} from 'src/interfaces/clients-interface';
import { ApiClient } from 'src/services/api-client';
import { EClientsAction } from './clients-constants';
import { TDownloadClientFileRequest, TDownloadHomeworkHistoryFileRequest } from 'src/interfaces/common-interface';
import ResponseError from 'src/interfaces/error-response-interface';

export const getClients = createAsyncThunk(
  EClientsAction.GET_CLIENTS,
  async (params: TGetClientsParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TGetClientsResponse> = await ApiClient.get('/api/v1/practitioners/clients', {
        params,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const inviteClient = createAsyncThunk(
  EClientsAction.INVITE_CLIENT,
  async (bodyRequest: TInviteClientRequest) => {
    try {
      const response: AxiosResponse<TInviteClientResponse> = await ApiClient.post(
        '/api/v1/practitioners/invite-client',
        bodyRequest,
      );

      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const dischargeClient = createAsyncThunk(
  EClientsAction.DISCHARGE_CLIENT,
  async ({ id }: TDischargeClientRequest) => {
    try {
      await ApiClient.put(`/api/v1/practitioners/discharge/${id}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const getAssignedHomeworkListAction = createAsyncThunk(
  EClientsAction.GET_CLIENT_HOMEWORK,
  async (params: TGetAssignedHomeworkParams) => {
    try {
      const response = await ApiClient.get(`/api/v1/practitioners/homework-assign`, { params });
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const loadMoreAssignedHomeworkListAction = createAsyncThunk(
  EClientsAction.LOAD_MORE_CLIENT_HOMEWORK,
  async (params: TGetAssignedHomeworkParams) => {
    try {
      const response = await ApiClient.get(`/api/v1/practitioners/homework-assign`, { params });
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getTotalAssignedHomeworkAction = createAsyncThunk(
  EClientsAction.GET_TOTAL_ASSIGNED_HOMEWORK,
  async (params: TGetTotalAssignedHomeworkParams) => {
    try {
      const response: AxiosResponse<TGetTotalAssignedHomeworkResponse> = await ApiClient.get(
        'api/v1/practitioners/homework-assign/total',
        { params },
      );
      return response.data;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  },
);

export const removeAssignedHomeworkAction = createAsyncThunk(
  EClientsAction.REMOVE_ASSIGNED_HOMEWORK,
  async (params: TRemoveAssignedHomeworkParams) => {
    try {
      const response: AxiosResponse<TRemoveAssignedHomeworkResponse> = await ApiClient.delete(
        `api/v1/practitioners/homework-assign/${params.homeworkAssignId}`,
        { params },
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getHomeworkHistoryListAction = createAsyncThunk(
  EClientsAction.GET_HOMEWORK_HISTORY_LIST,
  async (bodyRequest: TGetHomeworkHistoryListParams) => {
    try {
      const response: AxiosResponse<TGetHomeworkHistoryListResponse> = await ApiClient.post(
        '/api/v1/practitioners/homework-history',
        bodyRequest,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const loadMoreHomeworkHistoryListAction = createAsyncThunk(
  EClientsAction.LOAD_MORE_HOMEWORK_HISTORY_LIST,
  async (bodyRequest: TGetHomeworkHistoryListParams): Promise<TGetHomeworkHistoryListResponse> => {
    try {
      const response: AxiosResponse<TGetHomeworkHistoryListResponse> = await ApiClient.post(
        '/api/v1/practitioners/homework-history',
        bodyRequest,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getAssignedHomeworkDetailsAction = createAsyncThunk(
  EClientsAction.GET_ASSIGNED_HOMEWORK_DETAILS,
  async (params: TGetAssignedHomeworkDetailsParams): Promise<TGetAssignedHomeworkDetailsResponse> => {
    try {
      const response: AxiosResponse<TGetAssignedHomeworkDetailsResponse> = await ApiClient.get(
        `/api/v1/practitioners/homework-assign/${params.homeworkAssignId}`,
        {
          params,
        },
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const updateHomeworkDetailsAction = createAsyncThunk(
  EClientsAction.UPDATE_HOMEWORK_DETAILS,
  async (bodyRequest: TUpdateHomeworkDetailsRequest) => {
    try {
      const response: AxiosResponse<TUpdateHomeworkDetailsResponse> = await ApiClient.put(
        `/api/v1/practitioners/homework-assign/${bodyRequest.id}`,
        bodyRequest,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getAssignedHomeworkHistoriesAction = createAsyncThunk(
  EClientsAction.GET_ASSIGNED_HOMEWORK_HISTORIES,
  async (params: TGetAssignedHomeworkHistoriesParams): Promise<TGetAssignedHomeworkHistoriesResponse> => {
    try {
      const response: AxiosResponse<TGetAssignedHomeworkHistoriesResponse> = await ApiClient.post(
        `/api/v1/practitioners/homework-history/${params.id}`,
        params,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getHomeworkResultAction = createAsyncThunk(
  EClientsAction.GET_HOMEWORK_RESULT,
  async (params: TGetHomeworkResultParams): Promise<TGetHomeworkResultResponse> => {
    try {
      const response: AxiosResponse<TGetHomeworkResultResponse> = await ApiClient.get(
        `/api/v1/practitioners/homework-history/${params.id}/result/${params.homeworkHistoryId}`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const downloadHomeworkFileAction = createAsyncThunk(
  EClientsAction.DOWNLOAD_HOMEWORK_FILE,
  async (request: TDownloadHomeworkHistoryFileRequest) => {
    const { homeworkAssignId, attachmentId, homeworkResultId } = request;
    try {
      const response = await ApiClient.post(
        `api/v1/practitioners/homework-history/${homeworkAssignId}/result/${homeworkResultId}/download/${attachmentId}`,
        {},
        { responseType: 'blob' },
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getClientGeneralInfo = createAsyncThunk(
  EClientsAction.GET_CLIENT_GENERAL_INFO,
  async (clientId: string) => {
    try {
      const response: AxiosResponse<TClientInfomationResponse> = await ApiClient.get(
        `api/v1/practitioners/client-management/${clientId}/general-info`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getClientMedicalInfo = createAsyncThunk(
  EClientsAction.GET_CLIENT_MEDICAL_INFORMATION,
  async (clientId: string): Promise<TMedicalProfileRequest> => {
    try {
      const response: AxiosResponse<TMedicalProfileRequest> = await ApiClient.get(
        `/api/v1/practitioners/client-management/${clientId}/medical-info`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const updateClientGeneralInfo = createAsyncThunk(
  EClientsAction.UPDATE_CLIENT_GENERAL_INFO,
  async (payload: TClientUpdateInfoRequest, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TClientUpdateInfoResponse> = await ApiClient.put(
        `api/v1/practitioners/client-management/${payload.clientId}/general-info`,
        payload,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error as ResponseError);
    }
  },
);

export const updateClientMedicalInfo = createAsyncThunk(
  EClientsAction.UPDATE_CLIENT_MEDICAL_INFORMATION,
  async (params: TMedicalProfileRequest) => {
    try {
      const response: AxiosResponse<TUpdateMedicalProfileResponse> = await ApiClient.put(
        `/api/v1/practitioners/client-management/${params.clientId}/medical-info`,
        params,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const resendClientInvitation = createAsyncThunk(
  EClientsAction.RESEND_INVITATION_CLIENT,
  async (clientId: string): Promise<TResendResponse> => {
    try {
      const response: AxiosResponse<TResendResponse> = await ApiClient.post(
        `/api/v1/practitioners/client-management/${clientId}/resend-invitation`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const revokeClientInvitation = createAsyncThunk(
  EClientsAction.RESEND_INVITATION_CLIENT,
  async (clientId: string): Promise<TRevokeResponse> => {
    try {
      const response: AxiosResponse<TRevokeResponse> = await ApiClient.post(
        `/api/v1/practitioners/client-management/${clientId}/revoke-invitation`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const reactivateClient = createAsyncThunk(
  EClientsAction.REACTIVATE_CLIENT,
  async (clientId: string): Promise<TResendResponse> => {
    try {
      const response: AxiosResponse<TResendResponse> = await ApiClient.put(
        `/api/v1/practitioners/client-management/${clientId}/reactive`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const clientUploadFile = createAsyncThunk(
  EClientsAction.CLIENT_UPLOAD_FILE,
  async (payload: TClientUploadFileRequest) => {
    try {
      const form = new FormData();
      if (payload.file) {
        form.append('file', payload.file.file as unknown as Blob);
      }
      form.append('name', payload.name);

      const response: AxiosResponse<TClientUploadFileResponse> = await ApiClient.post(
        `/api/v1/practitioners/client-management/${payload.clientId}/files`,
        form,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const getClientFiles = createAsyncThunk(
  EClientsAction.GET_CLIENT_FILES,
  async (params: TGetClientFileParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TGetClientFilesResponse> = await ApiClient.get(
        `/api/v1/practitioners/client-management/${params.clientId}/files`,
        {
          params: params.filter,
        },
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const deleteClientFile = createAsyncThunk(
  EClientsAction.DELETE_CLIENT_FILE,
  async (params: TDeleteClientFileRequest) => {
    try {
      const response: AxiosResponse<TDeleteClientFileResponse> = await ApiClient.delete(
        `/api/v1/practitioners/client-management/${params.clientId}/files/${params.fileId}`,
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const downloadClientFileAction = createAsyncThunk(
  EClientsAction.DOWNLOAD_CLIENT_FILE,
  async (request: TDownloadClientFileRequest) => {
    const { clientId, fileId } = request;
    try {
      const response = await ApiClient.post(
        `/api/v1/practitioners/client-management/${clientId}/download/${fileId}`,
        {},
        { responseType: 'blob' },
      );
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);
