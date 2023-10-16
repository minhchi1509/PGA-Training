import { EChatMemberType } from 'src/variables/enum-variables';
import { TCommonGetListParams, TCommonGetListResponse, TCommonUser } from './common-interface';

export type TGetPractitionersParams = TCommonGetListParams & {
  status?: string; // available update enum.
  isWorking?: boolean;
};

export type TPractitioner = TCommonUser & {
  totalActiveClient?: number;
};

export type TGetPractitionersResponse = TCommonGetListResponse<TPractitioner[]>;

export type TInvitePractitionerRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type TInvitePractitionerResponse = {
  id: string;
  practitionerId: string;
};

export type TDetailStatisticResponse = {
  activeClient: number;
  activeHomeWork: number;
  pendingClient: number;
  dischargedClient: number;
  message: number;
};

export type TPractitionerLite = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role?: EChatMemberType;
};

export type TPractitionersProfileRequest = {
  id?: string;
  status?: string;
  practitionerId?: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob?: Date;
  phone: string;
  address: string;
  avatar?: string;
  role?: string;
  practitionerType: string;
  practitionerTypeOther?: string;
  provideNumber: string;
  abn?: string;
  clinicPracticeName?: string;
  email?: string;
  practitionerTypeId?: string;
};

export type TPractitionerProfileActionBaseParams = {
  practitionerId: string;
};

export type TDeactivePractitionerParams = TPractitionerProfileActionBaseParams & {
  reallocateProfileId: string;
  deactiveClient: boolean;
};

export type TDeactivePractitioner = {
  practitionerId: string;
  reallocateProfileId?: string;
  deactiveClient: boolean;
};

export type TSummaryAssignTask = {
  totalAssignTasks: number;
  totalCompletedTasks: number;
};

export type TPractitionerEngagementParams = {
  startAt: string;
  endAt: string;
};

export type TPractitionerEngagementResponse = {
  accountId: string;
  firstName: string;
  lastName: string;
  totalOnline: 0;
};

export type TPractitionerEngagementChartData = {
  name: string;
  value: number;
};

export type TTaskCompletionRateData = {
  firstName: string;
  lastName: string;
  totalAssign: number;
  totalComplete: number;
};

export type TLoginRateData = {
  [date: string]: { totalLogin: number; totalActive?: number };
};
