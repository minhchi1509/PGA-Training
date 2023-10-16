import { createSlice } from '@reduxjs/toolkit';
import { EHomeworkType, TGetTasksByTopicResponse } from 'src/interfaces/clients-interface';

import { TGetHomeworkTopicsResponse } from 'src/interfaces/homework-topics';
import { DEFAULT_GET_LIST_RESPONSE } from 'src/variables/common';
import * as asyncActions from './actions';
import { ETaskType } from 'src/variables/enum-variables';

const VariableTopicByType: { [key: string]: string } = {
  [EHomeworkType.ACTIVITIES]: 'activityTopics',
  [EHomeworkType.QUESTIONNAIRES]: 'questionnairesTopics',
  [EHomeworkType.WRITTEN_TASKS]: 'writtenTasksTopics',
  [EHomeworkType.VIDEOS]: 'videosTopics',
};

type THomeworkTopicsState = {
  topics: TGetHomeworkTopicsResponse;
  activityTopics: TGetHomeworkTopicsResponse;
  questionnairesTopics: TGetHomeworkTopicsResponse;
  writtenTasksTopics: TGetHomeworkTopicsResponse;
  videosTopics: TGetHomeworkTopicsResponse;
  homework: {
    [key: string]: TGetTasksByTopicResponse;
  };
};

const initialState: THomeworkTopicsState = {
  topics: DEFAULT_GET_LIST_RESPONSE,
  activityTopics: DEFAULT_GET_LIST_RESPONSE,
  questionnairesTopics: DEFAULT_GET_LIST_RESPONSE,
  writtenTasksTopics: DEFAULT_GET_LIST_RESPONSE,
  videosTopics: DEFAULT_GET_LIST_RESPONSE,
  homework: {},
};

export const homeworkTopicsSlice = createSlice({
  name: 'homeworkTopics',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(asyncActions.getHomeworkTopicsAction.fulfilled, (state, action) => {
      state.topics = action.payload;
    });
    builder.addCase(asyncActions.loadMoreHomeworkTopicsAction.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;
      const newTopics = {
        ...state.topics,
        ...pagination,
        data: [...state.topics.data, ...data],
      };

      state.topics = newTopics;
    });

    builder.addCase(asyncActions.getHomeworkTopicsByTypeAction.fulfilled, (state, action) => {
      const { type, ...response } = action.payload;
      state[VariableTopicByType[type ?? EHomeworkType.ACTIVITIES]] = response;
    });
    builder.addCase(asyncActions.loadMoreHomeworkTopicsByTypeAction.fulfilled, (state, action) => {
      const { type, data, ...pagination } = action.payload;
      const selectedHomeworkTopic = VariableTopicByType[type ?? EHomeworkType.ACTIVITIES];
      const newSelectedTopics = {
        ...state[selectedHomeworkTopic],
        ...pagination,
        data: [...state[selectedHomeworkTopic].data, ...data],
      };

      state[selectedHomeworkTopic] = newSelectedTopics;
    });

    builder.addCase(asyncActions.getTasksByTopicAction.fulfilled, (state, action) => {
      const homeworkTopicId = action.meta.arg.homeworkTopicId;
      const ownerTaskParams = action.meta.arg.isOwnTask;
      const isOwnTask = ownerTaskParams !== undefined;
      const homeworkKey = isOwnTask
        ? `${homeworkTopicId}-${ownerTaskParams ? ETaskType.OWNER : ETaskType.GENERAL_TASK}`
        : homeworkTopicId;

      state.homework = {
        ...state.homework,
        [homeworkKey]: action.payload,
      };
    });

    builder.addCase(asyncActions.loadMoreTasksByTopicAction.fulfilled, (state, action) => {
      const homeworkTopicId = action.meta.arg.homeworkTopicId;
      const ownerTaskParams = action.meta.arg.isOwnTask;
      const isOwnTask = ownerTaskParams !== undefined;
      const { data, ...pagination } = action.payload;
      const homeworkKey = isOwnTask
        ? `${homeworkTopicId}-${ownerTaskParams ? ETaskType.OWNER : ETaskType.GENERAL_TASK}`
        : homeworkTopicId;

      state.homework = {
        ...state.homework,
        [homeworkKey]: {
          ...pagination,
          data: [...state.homework[homeworkKey].data, ...data],
        },
      };
    });
  },
});

export default homeworkTopicsSlice;
