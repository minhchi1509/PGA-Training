import { ChangeEvent } from 'react';
import { Dayjs } from 'dayjs';
import { TabPaneProps, UploadFile } from 'antd';
import { FilterValue } from 'antd/es/table/interface';

import { EProfileStatus } from 'src/variables/common';
import { EFileType, ESortType } from 'src/variables/enum-variables';
import { TRoom } from './chat-interface';

// event interface
export type TChangeInputEvent = ChangeEvent<HTMLInputElement>;
export type TChangeTextAreaEvent = ChangeEvent<HTMLTextAreaElement>;
export type TMouseEventSVGHandler = React.MouseEvent<SVGSVGElement, MouseEvent>;
export type TMouseEventDivHandler = React.MouseEvent<HTMLDivElement, MouseEvent>;

// get common list api interface
export type TCommonGetListParams = {
  page: number;
  size: number;
  keyword?: string;
  sortBy?: string;
  sortType?: ESortType;
};

export type TPagination = {
  currentPage: number;
  totalPage: number;
  totalRecord: number;
  pageSize?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TCommonGetListResponse<T = any> = TPagination & {
  data: T;
};

// select
export type TSelectOption = {
  label: string;
  value: string | number;
};

export type TCommonUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: EProfileStatus;
  avatar?: string;
};

// tabs
export type TTabItem = Omit<TabPaneProps, 'tab'> & {
  key: string;
  label: React.ReactNode;
};

export type TCollapseItem = {
  key: string;
  header: React.ReactNode;
  content?: React.ReactNode;
};

export type TRangeDate = {
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
};

export type TFilterValues = {
  [key: string]: FilterValue | null;
};

export type TFile = {
  type: EFileType;
  url: string;
};

export type TDownloadHomeworkHistoryFileRequest = {
  homeworkAssignId: string;
  homeworkResultId: string;
  attachmentId: string;
  fileName?: string;
};

export type TDownloadClientFileRequest = {
  clientId?: string;
  fileId: string;
  fileName?: string;
  fileExtension?: string;
};

export type TStatisticDashboard = {
  numberActiveClient: number;
  numberActivePractitioner?: number;
  numberAssignedTask: number;
};

export type TGetDashboardResponse = {
  firstName: string;
  lastName: string;
  statistic: TStatisticDashboard;
  newMessages?: TRoom[];
};

export type TCommonGetDashboardParams = {
  timezome: string;
};
