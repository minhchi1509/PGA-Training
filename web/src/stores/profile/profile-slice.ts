import { ICardInfo } from './../../pages/profile/profile-page-constants';
import { createSlice } from '@reduxjs/toolkit';

import * as asyncActions from './profile-actions';
import { TCurrentPayment } from 'src/interfaces/profile-interface';
import { TPractitionersProfileRequest } from 'src/interfaces/practitioners-interface';

type TProfile = {
  cards: ICardInfo[];
  currentSubscription?: TCurrentPayment;
  practitioner?: TPractitionersProfileRequest;
};

const initialState: TProfile = {
  cards: [],
  currentSubscription: undefined,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncActions.getListCard.fulfilled, (state, action) => {
      state.cards = action.payload.cards;
    });
    builder.addCase(asyncActions.getPractitionerProfileById.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });
    builder.addCase(asyncActions.getCurrentSubscriptionAction.fulfilled, (state, action) => {
      state.currentSubscription = action.payload;
    });
  },
});

export default profileSlice;
