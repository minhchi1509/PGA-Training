import dayjs from 'dayjs';

import { TSelectOption } from 'src/interfaces/common-interface';
import { TCommonGetListParams, TCommonGetListResponse, TPagination } from 'src/interfaces/common-interface';
import {
  EFrequencyType,
  ETimePeriod,
  ERepeatDurationType,
  EDayOfWeek,
  EClientFileSortBy,
  ESortType,
} from './enum-variables';

export const DEFAULT_PAGINATION: TPagination = {
  currentPage: 1,
  totalPage: 1,
  totalRecord: 1,
};

export const DEFAULT_GET_LIST_RESPONSE: TCommonGetListResponse = {
  ...DEFAULT_PAGINATION,
  data: [],
};

export enum EProfileStatus {
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  DISCHARGED = 'DISCHARGED',
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_GET_LIST_PARAMS: TCommonGetListParams = {
  page: DEFAULT_PAGE,
  size: DEFAULT_PAGE_SIZE,
  keyword: '',
};

export const DEFAULT_GET_LIST_FILE_MANAGEMENT_PARAMS: TCommonGetListParams = {
  page: DEFAULT_PAGE,
  size: DEFAULT_PAGE_SIZE,
  keyword: '',
  sortBy: EClientFileSortBy.NAME,
  sortType: ESortType.ASC,
};

export const TITLE_OPTIONS: TSelectOption[] = [
  { label: 'Mr', value: 'Mr' },
  { label: 'Mrs', value: 'Mrs' },
  { label: 'Miss', value: 'Miss' },
  { label: 'Dr', value: 'Dr' },
  { label: 'Prof', value: 'Prof' },
  { label: 'A. Prof', value: 'A. Prof' },
];

export const GENDER_OPTIONS: TSelectOption[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer Not To Say', value: 'not' },
];

export const FREQUENCY_OPTIONS: TSelectOption[] = [
  { label: 'Assign once', value: EFrequencyType.ASSIGN_ONE },
  { label: 'Custom', value: EFrequencyType.CUSTOM },
];

export const TIME_OPTIONS: TSelectOption[] = [
  { label: 'AM', value: ETimePeriod.AM },
  { label: 'PM', value: ETimePeriod.PM },
];

export const RANGE_DATE_CURRENT_WEEK = {
  fromDate: dayjs().subtract(7, 'day'),
  toDate: dayjs(),
};
export const REPEAT_NUMBERS: TSelectOption[] = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

export const REPEAT_TYPES: TSelectOption[] = [
  { value: ERepeatDurationType.DAY, label: 'Days' },
  { value: ERepeatDurationType.WEEK, label: 'Weeks' },
];

export const DAY_OPTIONS: TSelectOption[] = [
  { value: EDayOfWeek.MON, label: 'Mon' },
  { value: EDayOfWeek.TUE, label: 'Tue' },
  { value: EDayOfWeek.WED, label: 'Wed' },
  { value: EDayOfWeek.THU, label: 'Thu' },
  { value: EDayOfWeek.FRI, label: 'Fri' },
  { value: EDayOfWeek.SAT, label: 'Sat' },
  { value: EDayOfWeek.SUN, label: 'Sun' },
];

export const DATE_FORMAT = {
  PARAM_TYPE: 'YYYY-MM-DD',
  HUMAN_READABLE_DATE: 'MMM DD YYYY',
  HUMAN_READABLE_TIME: 'h:mm A',
};

export const ACCEPTED_IMAGE_TYPE = 'image/png, image/jpeg, image/jpg';
export const ACCEPTED_OTHER_TYPE = '.xlsx, .xls, .mov, .csv, .mp4';
export const ACCEPTED_CONTACT_HELP_FILE_TYPE =
  'image/png, image/jpeg, image/jpg, .docx, .pdf, .xlsx, .xls, .mov, .csv, .mp4';
