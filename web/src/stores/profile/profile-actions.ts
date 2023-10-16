import dayjs from 'dayjs';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import ResponseError from 'src/interfaces/error-response-interface';
import {
  TCreateNewCardParams,
  TCurrentPayment,
  TGetClinicDetailRequest,
  TGetClinicDetailResponse,
  TGetListCardResponse,
  TGetProfileDetailResponse,
  TSetCardAsDefaultParams,
  TUpdateCardParams,
  TUpdateClinicDetailRequest,
  TUpdateClinicDetailResponse,
  TUpdateProfileDetailRequest,
} from 'src/interfaces/profile-interface';

import {
  ICreateClinicOwnerProfileValues,
  ICreatePractitionerProfileValues,
} from 'src/pages/auth/create-new-profile/create-new-profile-types';
import { ApiClient } from 'src/services/api-client';
import { EProfileActions } from './profile-constants';
import { TPractitionersProfileRequest } from 'src/interfaces/practitioners-interface';
import { getCurrentSubscription } from 'src/services/payment-service';

export const updateClinicOwnerProfile = createAsyncThunk(
  EProfileActions.UPDATE_CLINICS_PROFILES,
  async (payload: ICreateClinicOwnerProfileValues) => {
    const form = new FormData();
    form.append('dob', payload.dob ? dayjs(payload.dob).utc(true).toISOString() : '');

    if (payload.avatar) {
      form.append('avatar', payload.avatar as unknown as Blob);
    }
    if (payload.title) {
      form.append('title', payload.title);
    }

    form.append('firstName', payload.firstName);
    form.append('lastName', payload.lastName);
    form.append('gender', payload.gender);
    form.append('phone', payload.phone);
    form.append('address', payload.address);
    form.append('clinicPracticeName', payload.clinicPracticeName);
    form.append('abn', payload.abn);
    form.append('clinicPhone', payload.clinicPhone);
    form.append('clinicEmail', payload.clinicEmail);
    form.append('clinicAddress', payload.clinicAddress);
    try {
      const response = await ApiClient.put('/api/v1/clinics/profiles', form);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const updatePractitionerProfile = createAsyncThunk(
  EProfileActions.UPDATE_PRACTITIONERS_PROFILES,
  async (payload: ICreatePractitionerProfileValues) => {
    const form = new FormData();
    form.append('dob', payload.dob ? dayjs(payload.dob).utc(true).toISOString() : '');
    if (payload.avatar) {
      form.append('avatar', payload.avatar as unknown as Blob);
    }
    if (payload.title) {
      form.append('title', payload.title);
    }
    if (payload.clinicPracticeName) {
      form.append('clinicPracticeName', payload.clinicPracticeName);
    }
    if (payload.practitionerType) {
      form.append('practitionerType', payload.practitionerType);
    }
    if (payload.practitionerTypeOther) {
      form.append('practitionerTypeOther', payload.practitionerTypeOther);
    }
    if (payload.provideNumber) {
      form.append('provideNumber', payload.provideNumber);
    }
    if (payload.abn) {
      form.append('abn', payload.abn);
    }

    form.append('firstName', payload.firstName);
    form.append('role', payload.role);
    form.append('lastName', payload.lastName);
    form.append('gender', payload.gender);
    form.append('phone', payload.phone);
    form.append('address', payload.address);
    try {
      const response = await ApiClient.put('/api/v1/practitioners/profiles', form);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const getPractitionerTypes = createAsyncThunk(EProfileActions.GET_PRACTITIONER_TYPES, async () => {
  try {
    const response = await ApiClient.get('/api/v1/practitioner-types');

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const startTrial = createAsyncThunk(EProfileActions.START_TRIAL, async (payload: { planId: string }) => {
  try {
    const response = await ApiClient.post('/api/v1/payments/start-trial', {
      planId: payload.planId,
    });
    showSuccessToast('You have successfully stated trial');
    return response.data;
  } catch (error) {
    const message = (error as ResponseError).message;
    showErrorToast(message);
    throw error;
  }
});

export const getListCard = createAsyncThunk(EProfileActions.GET_CARD_LIST, async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<TGetListCardResponse> = await ApiClient.get('/api/v1/payments/cards');

    return response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }

    return rejectWithValue(error.response);
  }
});

export const createNewCard = createAsyncThunk(
  EProfileActions.CREATE_CARD,
  async (payload: TCreateNewCardParams, { rejectWithValue }) => {
    try {
      await ApiClient.post('/api/v1/payments/cards', payload);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  },
);

export const setCardAsDefault = createAsyncThunk(
  EProfileActions.SET_CARD_DEFAULT,
  async (payload: TSetCardAsDefaultParams, { rejectWithValue }) => {
    try {
      await ApiClient.put(`/api/v1/payments/cards${payload.cardId}/default`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  },
);

export const deleteCard = createAsyncThunk(
  EProfileActions.DELETE_CARD,
  async (payload: TSetCardAsDefaultParams, { rejectWithValue }) => {
    try {
      await ApiClient.delete(`/api/v1/payments/cards${payload.cardId}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  },
);

export const updateCard = createAsyncThunk(
  EProfileActions.UPDATE_CARD,
  async (payload: TUpdateCardParams, { rejectWithValue }) => {
    const { cardId, ...data } = payload;
    try {
      await ApiClient.put(`/api/v1/payments/cards${cardId}`, data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  },
);

export const getPractitionerProfileById = createAsyncThunk(
  EProfileActions.GET_PRACTITIONER_PROFILE_ID,
  async (params: string) => {
    try {
      const response: AxiosResponse<TPractitionersProfileRequest> = await ApiClient.get(
        `/api/v1/owner/practitioner/${params}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export const getCurrentSubscriptionAction = createAsyncThunk(
  EProfileActions.GET_CURRENT_SUBSCRIPTION,
  async (_, { rejectWithValue }) => {
    try {
      const data: TCurrentPayment = await getCurrentSubscription();

      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response);
    }
  },
);

export const getProfileDetail = createAsyncThunk(EProfileActions.GET_DETAIL_PROFILE, async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<TGetProfileDetailResponse> = await ApiClient.get(`/api/v1/profiles`);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(error.response);
  }
});

export const updateProfileDetail = createAsyncThunk(
  EProfileActions.UPDATE_DETAIL_PROFILE,
  async (payload: TUpdateProfileDetailRequest, { rejectWithValue }) => {
    const form = new FormData();
    if (payload.title) {
      form.append('title', payload.title);
    }
    form.append('firstName', payload.firstName);
    form.append('lastName', payload.lastName);
    form.append('gender', payload.gender);
    form.append('dob', payload.dob ? dayjs(payload.dob).utc(true).toISOString() : '');
    form.append('phone', payload.phone);
    form.append('address', payload.address);
    if (payload.avatar) {
      form.append('avatar', payload.avatar as unknown as Blob);
    }
    if (payload.provideNumber) {
      form.append('provideNumber', payload.provideNumber);
    }

    if (payload.practitionerType) {
      form.append('practitionerType', payload.practitionerType);
    }

    if (payload.practitionerTypeOther) {
      form.append('practitionerTypeOther', payload.practitionerTypeOther);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: AxiosResponse<any> = await ApiClient.put('/api/v1/profiles', form);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  },
);

export const getClinicDetail = createAsyncThunk(
  EProfileActions.GET_CLINIC_DETAIL,
  async (payload: TGetClinicDetailRequest, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: AxiosResponse<TGetClinicDetailResponse> = await ApiClient.get(
        `/api/v1/clinics/profiles/${payload.clinicId}`,
      );

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  },
);

export const updateClinicDetail = createAsyncThunk(
  EProfileActions.UPDATE_CLINIC_DETAIL,
  async (params: TUpdateClinicDetailRequest, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: AxiosResponse<TUpdateClinicDetailResponse> = await ApiClient.put(
        `/api/v1/clinics/profiles/${params.clinicId}`,
        params,
      );

      showSuccessToast('Clinic information has been updated');

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
      return rejectWithValue(error.response);
    }
  },
);

export const sendContactHelp = createAsyncThunk(
  EProfileActions.SEND_CONTACT_HELP,
  async (payload: FormData, { rejectWithValue }) => {
    try {
      await ApiClient.post('/api/v1/profiles/contact-help', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccessToast('Send help contact successfully!');
    } catch (error) {
      showErrorToast('Failed to send help contact. Please try again!');
      rejectWithValue(error);
    }
  },
);
