import { EClientStatus } from '@src/variables/enum';
import { TMoodToday } from './trackmood-interfaces';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { TFileUploadRequest } from './file-interfaces';

export type TProfile = {
  id: string;
  firstName: string;
  lastName: string;
  clinic: {
    id: string;
    name: string;
  };
  avatar: string;
};

export type TQuote = {
  id: string;
  message: string;
  author: string;
  metadata: {
    color: string;
    background: string;
  };
};

export type TPractitionerClient = {
  id: string;
  medication: string;
  history: string;
  profileId: string;
  profile: TProfile;
  diagnosis?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  lastEngagement: string;
  drName: string;
  drProvideNumber: string;
  drAddress: string;
  status: EClientStatus;
  statusConvert: EClientStatus;
};

export type TNotificationConfig = {
  newMessage: boolean;
  pratitionerAcceptInvitation: boolean;
  clientAcceptInvitation: boolean;
  clientCompleteTask: boolean;
  clientRelocated: boolean;
  homeworkReminder: boolean;
  relocatedToNewPractitioner: boolean;
};

export type TClientDetails = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  practitionerClients: TPractitionerClient[];
  avatar?: string;
  notificationConfig: TNotificationConfig;
};

export type TClientProfile = {
  id: string;
  email: string;
  avatar: string;
  status: EClientStatus;
  client: TClientDetails;
  moodToday: TMoodToday;
  homework: number;
  quote?: TQuote;
  totalUnreadMessage: number;
  allowDeleteAccount: boolean;
};

export interface IContactHelpBody {
  name: string;
  content: string;
  attachments: Array<DocumentPickerResponse>;
}

export interface IcontactHelpTextParams {
  name: string;
  comment: string;
}

export type TClientMoodForm = {
  flag: number;
  point: number;
  comment: string;
};

export type TUpdateInformationProfileBody = {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  occupation: string;
  address: string;
  avatar?: TFileUploadRequest;
};

export type TUpdateInformationResponse = TClientDetails;

export type TUpdateMedicalProfileBody = {
  drName: string;
  drProvideNumber: string;
  drAddress: string;
  diagnosis: string;
  history: string;
  medication: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
};

export type TUpdateMedicalProfileResponse = TPractitionerClient;
export type TNotificationConfigResponse = TClientDetails;
