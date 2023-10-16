import { EHomeworkStatus } from 'src/variables/enum-variables';

export enum EClientDetailTabKey {
  GENERAL_INFO = 'generalInfo',
  CARE_INFO = 'careInfo',
  HOMEWORK = 'homework',
  INSIGHTS = 'insights',
  FILES = 'files',
}

export const CLIENT_DETAIL_TAB_LABEL = {
  [EClientDetailTabKey.GENERAL_INFO]: 'General information',
  [EClientDetailTabKey.CARE_INFO]: 'Medical Profile',
  [EClientDetailTabKey.HOMEWORK]: 'Homework',
  [EClientDetailTabKey.INSIGHTS]: 'Insights',
  [EClientDetailTabKey.FILES]: 'Files',
};

export const ALL_ASSIGNED_TAB_KEYS = {
  ONGOING: EHomeworkStatus.ACTIVE,
  EXPIRED: EHomeworkStatus.EXPIRED,
  REMOVED_TASKS: EHomeworkStatus.ARCHIVED,
};

export enum EHomeworkDetailTabKeys {
  DETAILS = 'DETAILS',
  HISTORY = 'HISTORY',
}

export enum EDragDropColumnId {
  OWN = 'OWN',
  GENERAL = 'GENERAL',
  ASSIGNED = 'ASSIGNED',
  ALL = 'ALL',
}

export const ALL_ASSIGNED_TASKS_TABS = [
  {
    key: ALL_ASSIGNED_TAB_KEYS.ONGOING,
    label: 'Ongoing',
  },
  {
    key: ALL_ASSIGNED_TAB_KEYS.EXPIRED,
    label: 'Expired',
  },
  {
    key: ALL_ASSIGNED_TAB_KEYS.REMOVED_TASKS,
    label: 'Removed tasks',
  },
];

export enum EHomeworkTabView {
  DEFAULT = 'DEFAULT',
  ASSIGN = 'ASSIGN',
  HOMEWORK_DETAIL = 'HOMEWORK_DETAIL',
}

export const HOMEWORK_DETAIL_TABS = [
  {
    key: EHomeworkDetailTabKeys.DETAILS,
    label: 'Homework Details',
  },
  {
    key: EHomeworkDetailTabKeys.HISTORY,
    label: 'Homework History',
  },
];
