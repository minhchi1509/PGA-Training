import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getUserProfile } from './user-actions';
import { TUser, TUserProfile } from './user-constants';
import { getItem } from 'src/utils/storage-utils';
import { EUserProfile } from 'src/variables/storage';

const initialState: TUser = {
  id: '',
  profiles: [],
  status: '',
  profile: undefined,
  quote: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<TUserProfile>) => {
      state.profile = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      const currentProfileId = getItem(EUserProfile.PROFILE_ID);
      if (!currentProfileId) {
        state.profile = action.payload.profiles[0];
      } else {
        state.profile =
          action.payload.profiles.find((profile: TUserProfile) => profile.id === currentProfileId) ||
          action.payload.profiles[0];
      }

      state.profiles = action.payload.profiles;
      state.id = action.payload.id;
      state.status = action.payload.status;
      state.quote = action.payload.quote;
    });
  },
});

export default userSlice;
