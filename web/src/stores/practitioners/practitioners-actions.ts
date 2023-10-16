import { createAsyncThunk } from '@reduxjs/toolkit';

import { EPractitionersAction } from './practitioners-constants';
import {
  TDeactivePractitionerParams,
  TDetailStatisticResponse,
  TGetPractitionersParams,
  TGetPractitionersResponse,
  TInvitePractitionerRequest,
  TInvitePractitionerResponse,
  TLoginRateData,
  TPractitionerEngagementResponse,
  TPractitionerLite,
  TPractitionerProfileActionBaseParams,
  TPractitionersProfileRequest,
  TSummaryAssignTask,
  TTaskCompletionRateData,
} from 'src/interfaces/practitioners-interface';
import { ApiClient } from 'src/services/api-client';
import { AxiosResponse } from 'axios';

export const getPractitioners = createAsyncThunk(
  EPractitionersAction.GET_PRACTITIONERS,
  async (params: TGetPractitionersParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TGetPractitionersResponse> = await ApiClient.get('/api/v1/owner/practitioners', {
        params,
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const invitePractitioner = createAsyncThunk(
  EPractitionersAction.INVITE_PRACTITIONER,
  async (bodyRequest: TInvitePractitionerRequest) => {
    try {
      const response: AxiosResponse<TInvitePractitionerResponse> = await ApiClient.post(
        '/api/v1/owner/invite-practitioner',
        bodyRequest,
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error.data;
    }
  },
);

export const updateProPractitioners = createAsyncThunk(
  EPractitionersAction.UPDATE_PRACTITIONER_PROFILE,
  async (params: TPractitionersProfileRequest, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TPractitionersProfileRequest> = await ApiClient.put(
        `/api/v1/owner/practitioners/profile-update`,
        params,
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getDetailStatisticPractitioner = createAsyncThunk(
  EPractitionersAction.GET_DETAIL_STATISTIC,
  async (params: { id: string }, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<TDetailStatisticResponse> = await ApiClient.get(
        `/api/v1/owner/practitioners/${params.id}/detailed-statistics`,
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const resendInvitationPractitioner = createAsyncThunk(
  EPractitionersAction.RESEND_INVITATION_PRACTITIONER,
  async (params: TPractitionerProfileActionBaseParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ success: boolean }> = await ApiClient.post(
        `/api/v1/owner/practitioners/${params.practitionerId}/resend-invitation`,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const revokeInvitationPractitioner = createAsyncThunk(
  EPractitionersAction.REVOKE_INVITATION_PRACTITIONER,
  async (params: TPractitionerProfileActionBaseParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ success: boolean }> = await ApiClient.post(
        `/api/v1/owner/practitioners/${params.practitionerId}/revoke-invitation`,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const reactivePractitioner = createAsyncThunk(
  EPractitionersAction.REACTIVE_PRACTITIONER,
  async (params: TPractitionerProfileActionBaseParams, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ success: boolean }> = await ApiClient.put(
        `/api/v1/owner/practitioners/${params.practitionerId}/reactive`,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const deactivePractitioner = createAsyncThunk(
  EPractitionersAction.DEACTIVE_PRACTITIONER,
  async (params: TDeactivePractitionerParams, { rejectWithValue }) => {
    try {
      const { practitionerId, deactiveClient, reallocateProfileId } = params;
      const response: AxiosResponse<{ success: boolean }> = await ApiClient.put(
        `/api/v1/owner/practitioners/${practitionerId}/deactive`,
        {
          deactiveClient,
          reallocateProfileId,
        },
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getListLitePractitioner = createAsyncThunk(
  EPractitionersAction.DEACTIVE_PRACTITIONER,
  async (args, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ data: TPractitionerLite[] }> = await ApiClient.get(
        `/api/v1/owner/practitioners/lite-list`,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getOwnerSummaryAssignTask = createAsyncThunk(
  EPractitionersAction.OWNER_SUMMARY_ASSIGN_TASK,
  async (args, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ data: TSummaryAssignTask }> = await ApiClient.get(
        `/api/v1/owner/summary-assign-task`,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getPractitionerSummaryAssignTask = createAsyncThunk(
  EPractitionersAction.PRACTITIONER_SUMMARY_ASSIGN_TASK,
  async (args, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ data: TSummaryAssignTask }> = await ApiClient.get(
        `/api/v1/practitioners/summary-assign-task`,
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getPractitionerClientLoginRate = createAsyncThunk(
  EPractitionersAction.PRACTITIONER_CLIENT_LOGIN_RATE,
  async (params: { startAt: string; endAt: string; clientId: string | number }, { rejectWithValue }) => {
    try {
      const { startAt, endAt, clientId } = params;
      const response: AxiosResponse<TLoginRateData> = await ApiClient.get(
        `/api/v1/practitioners/${clientId}/login-rate`,
        { params: { startAt, endAt } },
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getOwnerClientLoginRate = createAsyncThunk(
  EPractitionersAction.OWNER_CLIENT_LOGIN_RATE,
  async (params: { startAt: string; endAt: string; practitionerId: string | number }, { rejectWithValue }) => {
    try {
      const { startAt, endAt, practitionerId } = params;
      const response: AxiosResponse<TLoginRateData> = await ApiClient.get(
        `/api/v1/owner/practitioners/${practitionerId}/client-login-rate`,
        { params: { startAt, endAt } },
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getPractitionerEngagements = createAsyncThunk(
  EPractitionersAction.PRACTITIONER_ENGAGEMENT,
  async (params: { startAt: string; endAt: string }, { rejectWithValue }) => {
    try {
      const { startAt, endAt } = params;
      const response: AxiosResponse<TPractitionerEngagementResponse[]> = await ApiClient.get(
        `/api/v1/owner/practitioner-engagement`,
        { params: { startAt, endAt } },
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getTaskCompletionTask = createAsyncThunk(
  EPractitionersAction.PRACTITIONER_ENGAGEMENT,
  async (params: { startAt: string; endAt: string }, { rejectWithValue }) => {
    try {
      const { startAt, endAt } = params;
      const response: AxiosResponse<TTaskCompletionRateData[]> = await ApiClient.get(
        `/api/v1/practitioners/task-completion-rate`,
        { params: { startAt, endAt } },
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);
