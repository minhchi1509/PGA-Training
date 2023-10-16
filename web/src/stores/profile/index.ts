import * as profileActions from './profile-actions';
import * as profileConstants from './profile-constants';
import profileSlice from './profile-slice';

export const {
  updateClinicOwnerProfile,
  updatePractitionerProfile,
  getPractitionerTypes,
  startTrial,
  createNewCard,
  getListCard,
  setCardAsDefault,
  deleteCard,
  updateCard,
  getPractitionerProfileById,
  getCurrentSubscriptionAction,
  getProfileDetail,
  updateProfileDetail,
  getClinicDetail,
  updateClinicDetail,
} = profileActions;
export const { EProfileActions } = profileConstants;
export const { reducer: profileReducer } = profileSlice;
