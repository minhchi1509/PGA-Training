import { Dayjs } from 'dayjs';
import { UploadFile as TUploadFile } from 'antd/es/upload';

import {
  EFrequencyType,
  EHomeworkResultStatus,
  EHomeworkStatus,
  ETimePeriod,
  EDayOfWeek,
  ERepeatDurationType,
  EQuestionViewType,
  EQuestionType,
} from 'src/variables/enum-variables';
import { TCommonGetListParams, TCommonGetListResponse, TCommonUser } from './common-interface';
import { EProfileStatus } from 'src/variables/common';

export type TGetClientsParams = TCommonGetListParams & {
  status?: string; // available update enum.
};

export type TClient = TCommonUser & {
  clientId: string;
  statusConvert: EProfileStatus;
  dischargeAt: string | null;
};

export type TGetClientsResponse = TCommonGetListResponse<TClient[]>;

export type TInviteClientRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type TInviteClientResponse = {
  id: string;
  clientId: string;
};

export type TDischargeClientRequest = {
  id: string;
};

export enum EHomeworkType {
  ACTIVITIES = 'Activity',
  QUESTIONNAIRES = 'Questionnaire',
  WRITTEN_TASKS = 'WrittenTask',
  VIDEOS = 'Video',
}

export type TTaskItemData = {
  id: string;
  homeworkAssignId?: string;
  title: string;
  type?: EHomeworkType;
  startDate?: Date | Dayjs;
  endDate?: Date | Dayjs;
  repeat?: boolean;
  assigned?: boolean;
  videoUrl?: string;
  description?: string;
  showPreviewImg?: boolean;
  remindAtFormat?: {
    time: string;
    period: ETimePeriod;
  };
  status?: EHomeworkStatus;
  resultStatus?: EHomeworkResultStatus;
  timezone: string;
};

export type TScheduleHomework = {
  frequency: EFrequencyType;
  endDate?: string;
  startDate: string;
  endType: {
    afterTimes?: number;
    expiredDate?: string;
  };
  reminderAt: {
    time: string;
    period: string;
  };
  dayOfWeek?: EDayOfWeek[];
  status?: EHomeworkStatus;
  repeatEvery?: number;
  repeatDuration?: ERepeatDurationType;
  timezone: string;
};

export type TAssignHomeworkRequest = {
  clientId: string;
  listAssignHomework: TScheduleHomework[];
  timezone: string;
};

export type TAssignHomeworkResponse = {
  homeworkAssignIds: string[];
};

export type TGetTasksByTopicParams = TCommonGetListParams & {
  homeworkTopicId: string;
  type?: EHomeworkType;
  isOwnTask?: boolean;
};

export type THomework = {
  id: string;
  type: EHomeworkType;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  homeworkTopicId: string;
  enableRemind: boolean;
  description: string;
  profileId: string | null;
  remindAtHour: number;
  reminderAtFormat: {
    time: string;
    period: ETimePeriod;
  } | null;
  videoLink: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  timezone: string;
};

export type TGetTasksByTopicResponse = TCommonGetListResponse<THomework[]>;

export type TGetAssignedHomeworkParams = TCommonGetListParams & {
  clientId: string;
  status?: EHomeworkStatus;
};

export type TAssignedHomework = {
  id: string;
  startDate: string;
  endDate?: string;
  frequency: EFrequencyType;
  homeworkId: string;
  homeworkTitle: string;
  homeworkType: EHomeworkType;
  status: EHomeworkStatus;
  timezone: string;
};

export type TGetAssignedHomeworkResponse = TCommonGetListResponse<TAssignedHomework[]>;

export type TGetTotalAssignedHomeworkParams = {
  clientId: string;
};

export type TGetTotalAssignedHomeworkResponse = {
  total: number;
};

export type TRemoveAssignedHomeworkParams = {
  homeworkAssignId: string;
  clientId: string;
};

export type TRemoveAssignedHomeworkResponse = {
  homeworkAssignId: string;
};

export type TGetHomeworkHistoryListParams = TCommonGetListParams & {
  dateRange: string[];
  clientId: string;
  timezone: string;
};

export type THomeworkHistory = {
  id: string;
  status: string;
  homeworkType: EHomeworkType;
  homeworkTitle: string;
  homeworkAssignId: string;
  timezone: string;
};

export type THomeworkHistoryItemsByDate = {
  id: string;
  historyItems: THomeworkHistory[];
};

export type TGetHomeworkHistoryListResponse = TCommonGetListResponse<THomeworkHistoryItemsByDate[]>;

export type TGetAssignedHomeworkDetailsParams = {
  homeworkAssignId: string;
  clientId: string;
};

export type TGetAssignedHomeworkDetailsResponse = TScheduleHomework & {
  id: string;
  homework: THomework;
  timezone: string;
};

export type TUpdateHomeworkDetailsRequest = {
  id: string;
  assignHomeworkUpdate: {
    homeworkId: string;
    frequency: EFrequencyType;
    startDate: Dayjs | string;
    repeatEvery?: number;
    repeatDuration?: ERepeatDurationType;
    dayOfWeek?: EDayOfWeek[];
    endType?: {
      expiredDate?: string;
      afterTimes?: number;
    };
    reminderAt: {
      time: string;
      period: string;
    };
    timezone: string;
  };
  timezone: string;
  clientId: string;
};

export type TUpdateHomeworkDetailsResponse = {
  homeworkAssignId: string;
};

export type THomeworkFile = {
  type: string;
  url: string;
  fileType: string;
  id: string;
  originalName: string;
};

export type TActivityData = {
  id: string;
  rate?: number | null;
  comment?: string | null;
  totalFiles?: number | null;
  filesUrls?: THomeworkFile[] | null;
  resultText?: string | null;
  createdAt?: string | null;
  rejectText?: string | null;
  homeworkType?: EHomeworkType;
  title?: string;
  status?: EHomeworkResultStatus;
  specialResult?: TSpecialHomeworkResult;
};

export type TGetAssignedHomeworkHistoriesParams = TCommonGetListParams & {
  id: string;
  dateRange: string[];
  clientId: string;
};

export type TAnswerQuestion = {
  answerText: string;
  questionId: string;
  answerChoices: string[];
};

export type TClientResponse = {
  responseText: string;
  answerQuestion: TAnswerQuestion[];
} | null;

export type TAssignedHomeworkHistory = {
  id: string;
  createdAt: string;
  status: EHomeworkResultStatus;
  clientResponse: TClientResponse;
  rate: number | null;
  feedback: string | null;
  clientAnswerImages: THomeworkFile[] | null;
  rejectReason: string | null;
  result: TSpecialHomeworkResult | null;
};

export type TGetAssignedHomeworkHistoriesResponse = TCommonGetListResponse<TAssignedHomeworkHistory[]>;

export type TGetHomeworkResultParams = {
  id: string;
  homeworkHistoryId: string;
};

export type THomeworkQuestion = {
  id: string;
  homeworkId: string;
  type: EQuestionViewType;
  title: string | null;
  description: string | null;
  question: string | null;
  questionType: EQuestionType | null;
  rangeFrom: null; // update enum...
  rangeTo: null; // update enum...
  options: { [key: string]: string };
  photoTitle: string | null;
  photoUri: string | null;
  required: boolean;
  index: number;
};

export type THomeworkResultInfo = Omit<THomework, 'createdAt' | 'updatedAt'>;

export type TRangeHomeworkResult = {
  from: number;
  to: number | null;
};

export type THomeworkSeverity = {
  [key: string]: {
    [key: string]: TRangeHomeworkResult;
  };
};

export type THomeworkSummaryScore = { total: number } & {
  [key: string]: {
    score: number;
    category: string;
  };
};

export type TSummaryScoreColumnData = {
  name: string;
  category: string;
  score: number;
};

export type TSeverityColumnData = {
  name: string;
  depression: string;
  anxiety: string;
  stress: string;
};

export type TSpecialHomeworkResult = {
  severity: THomeworkSeverity;
  summary: THomeworkSummaryScore;
};

export type TGetHomeworkResultResponse = TAssignedHomeworkHistory & {
  homeworkQuestions: THomeworkQuestion[];
  homework: THomeworkResultInfo;
  result: TSpecialHomeworkResult;
};

export type TCreateHomeworkTopicParams = {
  name: string;
  homeworkType: EHomeworkType;
};

export type TCreateHomeworkParams = {
  id?: string;
  title: string;
  homeworkTopicId: string;
  profileId?: string;
  type: EHomeworkType | string;
  description: string;
  enableRemind: boolean;
  remindAtHour?: number;
  videoLink?: string;
  status: EHomeworkStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  timezone: string;
};

export type TClientUpdateInfoRequest = {
  clientId: string;
  title: string;
  firstName: string;
  lastName: string;
  dob?: Date | Dayjs;
  gender: string;
  phone: string;
  occupation?: string;
  address: string;
};

export type TClientInfomationResponse = TClientUpdateInfoRequest & {
  email: string;
  status: EProfileStatus;
  statusConvert: EProfileStatus;
  dischargeAt: string | null;
};

export type TClientUpdateInfoResponse = {
  success: boolean;
};

export type TTrackMood = {
  id: string;
  flag: number;
  point: number;
  comment: string;
  createdAt: string;
};

export type TDass = {
  data: {
    createdAt: string;
    summary: THomeworkSummaryScore;
  }[];
  severity: THomeworkSeverity;
};

export type TMedicalProfileRequest = {
  clientId?: string;
  drAddress?: string;
  diagnosis?: string;
  lastEngagement?: Date;
  history?: string;
  medication?: string;
  drName?: string;
  drProvideNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
};

export type TUpdateMedicalProfileResponse = {
  success: boolean;
};

export type TResendResponse = {
  success: boolean;
};

export type TRevokeResponse = {
  success: boolean;
};

export type TClientFile = {
  id: string;
  name: string;
  practitionerClientId?: string;
  size?: number;
  fileExtension?: string;
  url?: string;
  createdAt?: Date;
};

export type TGetClientFileParams = {
  clientId: string;
  filter: TCommonGetListParams;
};

export type TClientUploadFileRequest = {
  clientId: string;
  name: string;
  file: { file: TUploadFile };
};

export type TClientUploadFileResponse = {
  id: string;
  practitionerClientId: string;
  name: string;
  size?: number;
  fileExtension: string;
  url?: string;
};

export type TDeleteClientFileRequest = {
  clientId: string;
  fileId: string;
};
export type TDeleteClientFileResponse = {
  success: boolean;
};

export type TGetClientFilesResponse = TCommonGetListResponse<TClientFile[]>;
