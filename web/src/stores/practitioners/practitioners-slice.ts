import { createSlice } from '@reduxjs/toolkit';

import { TGetPractitionersResponse } from 'src/interfaces/practitioners-interface';
import { DEFAULT_GET_LIST_RESPONSE } from 'src/variables/common';
import * as asyncActions from './practitioners-actions';

type TPractitionersState = {
  practitionerList: TGetPractitionersResponse;
};

const initialState: TPractitionersState = {
  practitionerList: DEFAULT_GET_LIST_RESPONSE,
};

export const practitionersSlice = createSlice({
  name: 'practitioners',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(asyncActions.getPractitioners.fulfilled, (state, action) => {
      state.practitionerList = action.payload as TGetPractitionersResponse;
    });
  },
});

export default practitionersSlice;
