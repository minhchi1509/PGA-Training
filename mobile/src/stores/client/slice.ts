import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as clientThunkActions from './thunk-actions';
import { TClientProfile, TNotificationConfig } from '@src/interfaces/client-interfaces';
import { TTrackMood } from '@src/interfaces/trackmood-interfaces';

type TClientState = {
  accessToken?: string;
  profile?: TClientProfile;
  moodeRecent?: TTrackMood[];
};

const initialState: TClientState = {
  profile: undefined,
  accessToken: '',
  moodeRecent: [],
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clientThunkActions.getClientProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(clientThunkActions.getClientMoodRecent.fulfilled, (state, action) => {
      state.moodeRecent = action.payload;
    });
  },
});

export default clientSlice;
