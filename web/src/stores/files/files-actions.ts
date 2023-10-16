/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EFilesActions } from './files-contants';
import {
  TDeleteFileManagementRequest,
  TDownloadFileManagementRequest,
  TFile,
  TGetListFileParams,
  TGetListFilesResponse,
  TNewFolderRequest,
  TUploadFileManagementRequest,
} from 'src/interfaces/files-interface';
import { AxiosResponse } from 'axios';
import { ApiClient } from 'src/services/api-client';

export const getListFiles = createAsyncThunk(
  EFilesActions.GET_LIST_FILE,
  async (params: TGetListFileParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TGetListFilesResponse> = await ApiClient.get(`/api/v1/files`, {
        params: { ...params, ...params.filter },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getListFileByFolder = createAsyncThunk(
  EFilesActions.GET_LIST_FILE,
  async (params: TGetListFileParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TGetListFilesResponse> = await ApiClient.get(`/api/v1/files/${params.folderId}`, {
        params: { ...params, ...params.filter },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const createFolder = createAsyncThunk(
  EFilesActions.CREATE_FOLDER,
  async (params: TNewFolderRequest, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TFile> = await ApiClient.post(`/api/v1/files/folders`, params);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const uploadFileManagement = createAsyncThunk(
  EFilesActions.UPLOAD_FILE_MANAGEMENT,
  async (payload: TUploadFileManagementRequest) => {
    try {
      const form = new FormData();
      if (payload.file) {
        form.append('file', payload.file.file as unknown as Blob);
      }
      if (payload.folderId) {
        form.append('folderId', payload.folderId);
      }

      form.append('mode', payload.mode);
      form.append('name', payload.name);

      const response: AxiosResponse<TFile> = await ApiClient.post(`/api/v1/files`, form);
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const downloadFileManagementAction = createAsyncThunk(
  EFilesActions.DOWNLOAD_FILE_MANAGEMENT,
  async (request: TDownloadFileManagementRequest) => {
    const { fileId } = request;
    try {
      const response = await ApiClient.post(`/api/v1/files/${fileId}/download`, {}, { responseType: 'blob' });
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const deleteFileManagement = createAsyncThunk(
  EFilesActions.DELETE_FILE_MANAGEMENT,
  async (params: TDeleteFileManagementRequest) => {
    try {
      const response: AxiosResponse<TFile> = await ApiClient.delete(`/api/v1/files/${params.id}`);
      return response.data;
    } catch (error: any) {
      return error.data;
    }
  },
);
