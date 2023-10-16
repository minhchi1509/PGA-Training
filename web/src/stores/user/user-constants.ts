import { EPaymentStatus, EUserType } from 'src/variables/enum-variables';

export enum EUserActions {
  GET_USER_PROFILE = 'GET_USER_PROFILE',
  SET_USER_PROFILE = 'SET_USER_PROFILE',
  START_APP = 'START_APP',
}

export type TClinic = {
  id: string;
  name: string;
  type: string; // update enum
  paymentStatus: EPaymentStatus;
};

export type TUserProfile = {
  id: string;
  role: EUserType;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
  phone: string;
  address: string;
  provideNumber: string;
  avatar: string;
  isCompleted: boolean;
  clinic: TClinic;
  notificationConfig: TNotificationConfig;
};

export type TNotificationConfig = {
  newMessage?: boolean;
  pratitionerAcceptInvitation?: boolean;
  clientAcceptInvitation?: boolean;
  clientCompleteTask?: boolean;
  clientRelocated?: boolean;
  homeworkReminder?: boolean;
  relocatedToNewPractitioner?: boolean;
};

export type TQuote = {
  message: string;
  author: string;
};

export type TUser = {
  id: string;
  status: string;
  profiles: TUserProfile[];
  profile?: TUserProfile;
  quote?: TQuote;
};
