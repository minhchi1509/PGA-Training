import { createSlice } from '@reduxjs/toolkit';

import {
  TGetDetailsPsychoeducationResponse,
  TGetPsychoeducationListByTopicResponse,
  TGetPsychoeducationTopicsResponse,
} from 'src/interfaces/psychoeducation-interface';
import * as asyncActions from './actions';
import { DEFAULT_GET_LIST_RESPONSE } from 'src/variables/common';

type TPsychoeducationState = {
  topics: TGetPsychoeducationTopicsResponse;
  psychoeducationList: TGetPsychoeducationListByTopicResponse;
  psychoeducationDetails?: TGetDetailsPsychoeducationResponse;
};

const initialState: TPsychoeducationState = {
  topics: {
    data: [],
  },
  psychoeducationList: DEFAULT_GET_LIST_RESPONSE,
};

export default createSlice({
  name: 'psychoeducation',
  initialState,
  reducers: {
    resetPsychoeducationDetails: (state) => {
      state.psychoeducationDetails = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncActions.getPsychoeducationTopicsAction.fulfilled, (state, action) => {
      state.topics = action.payload;
    });
    builder.addCase(asyncActions.getPsychoeducationListByTopicAction.fulfilled, (state, action) => {
      state.psychoeducationList = action.payload;
    });
    builder.addCase(asyncActions.loadMorePsychoeducationListByTopicAction.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;

      state.psychoeducationList = {
        ...pagination,
        data: [...state.psychoeducationList.data, ...data],
      };
    });
    builder.addCase(asyncActions.getDetailsPsychoeducationAction.fulfilled, (state, action) => {
      state.psychoeducationDetails = action.payload;
    });
  },
});
