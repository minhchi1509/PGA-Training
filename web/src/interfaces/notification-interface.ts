import { TCommonGetListParams, TCommonGetListResponse, TFile } from './common-interface';
import { TPractitionerLite } from './practitioners-interface';

export type TGetNotificationsParams = TCommonGetListParams;
export type TGetNotificationsResponse = TCommonGetListResponse<TNotification[]>;

export type TNotification = {
  id: string;
  message?: {
    id: string;
    roomId: string;
    files: TFile[];
    content: string;
    createdAt: string;
  };
  senderClient?: TPractitionerLite;
  senderProfile?: TPractitionerLite;
  triggerId: string;
  triggerType: string;
  title?: string;
  content?: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
  name?: string;
};

export type TMarkSeenNotificationRequest = {
  notificationId: string;
};

export type TTotalUnreadNotificationsResponse = {
  total: number;
};

export type TAddDeviceTokenResponse = {
  id: string;
};

export type TSettingNotificationRequest = {
  newMessage?: boolean;
  pratitionerAcceptInvitation?: boolean;
  clientAcceptInvitation?: boolean;
  clientCompleteTask?: boolean;
  clientRelocated?: boolean;
  homeworkReminder?: boolean;
  relocatedToNewPractitioner?: boolean;
};
