import { createSlice } from '@reduxjs/toolkit';

import {
  TClientInfomationResponse,
  TGetAssignedHomeworkDetailsResponse,
  TGetAssignedHomeworkHistoriesResponse,
  TGetAssignedHomeworkResponse,
  TGetClientsResponse,
  TGetHomeworkHistoryListResponse,
  TGetHomeworkResultResponse,
  THomeworkHistoryItemsByDate,
} from 'src/interfaces/clients-interface';
import { DEFAULT_GET_LIST_RESPONSE, DEFAULT_PAGINATION } from 'src/variables/common';
import * as asyncActions from './clients-actions';

type TClientState = {
  clientList: TGetClientsResponse;
  assignedHomework: TGetAssignedHomeworkResponse;
  totalHomework: number;
  homeworkHistoryList: TGetHomeworkHistoryListResponse;
  homeworkDetail?: TGetAssignedHomeworkDetailsResponse;
  homeworkHistoryDetailList: TGetAssignedHomeworkHistoriesResponse;
  homeworkResult?: TGetHomeworkResultResponse;
  clientInfo?: TClientInfomationResponse;
};

const initialState: TClientState = {
  clientList: DEFAULT_GET_LIST_RESPONSE,
  assignedHomework: DEFAULT_GET_LIST_RESPONSE,
  totalHomework: 0,
  homeworkHistoryDetailList: DEFAULT_GET_LIST_RESPONSE,
  homeworkHistoryList: {
    ...DEFAULT_PAGINATION,
    data: [
      {
        id: '',
        historyItems: [],
      },
    ],
  },
};

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(asyncActions.getClients.fulfilled, (state, action) => {
      state.clientList = action.payload as TGetClientsResponse;
    });
    builder.addCase(asyncActions.getClientGeneralInfo.fulfilled, (state, action) => {
      state.clientInfo = action.payload;
    });

    builder.addCase(asyncActions.getAssignedHomeworkListAction.fulfilled, (state, action) => {
      state.assignedHomework = action.payload;
    });
    builder.addCase(asyncActions.loadMoreAssignedHomeworkListAction.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;
      const newAssignedHomework = { ...pagination, data: [...state.assignedHomework.data, ...data] };

      state.assignedHomework = newAssignedHomework;
    });
    builder.addCase(asyncActions.getTotalAssignedHomeworkAction.fulfilled, (state, action) => {
      state.totalHomework = action.payload.total;
    });
    builder.addCase(asyncActions.getHomeworkHistoryListAction.fulfilled, (state, { payload }) => {
      state.homeworkHistoryList = payload;
    });
    builder.addCase(asyncActions.loadMoreHomeworkHistoryListAction.fulfilled, (state, { payload }) => {
      const { data: incomingData, ...pagination } = payload;
      const currentList = state.homeworkHistoryList.data;
      const lastCurrentItem = currentList[currentList.length - 1];
      const [firstComingItem, ...othersComingItems] = incomingData;

      if (lastCurrentItem.id === firstComingItem.id) {
        const combinedData: THomeworkHistoryItemsByDate = {
          id: lastCurrentItem.id,
          historyItems: [...lastCurrentItem.historyItems, ...firstComingItem.historyItems],
        };
        const otherCurrentItems = currentList.slice(0, -1);

        state.homeworkHistoryList = {
          ...pagination,
          data: [...otherCurrentItems, combinedData, ...othersComingItems],
        };
        return;
      }

      state.homeworkHistoryList = {
        ...pagination,
        data: [...currentList, ...incomingData],
      };
    });

    builder.addCase(asyncActions.getAssignedHomeworkDetailsAction.fulfilled, (state, action) => {
      state.homeworkDetail = action.payload;
    });

    builder.addCase(asyncActions.getAssignedHomeworkHistoriesAction.fulfilled, (state, action) => {
      state.homeworkHistoryDetailList = action.payload;
    });

    builder.addCase(asyncActions.getHomeworkResultAction.fulfilled, (state, action) => {
      state.homeworkResult = action.payload;
    });
  },
});

export default clientsSlice;
