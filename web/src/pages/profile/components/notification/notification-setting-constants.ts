import { EProfileNotificationSetting } from 'src/variables/enum-variables';

export const OWNER_PROFILE_NOTIFICATION_SETTING_LABEL = {
  [EProfileNotificationSetting.NEW_MESSAGE]: 'New message',
  [EProfileNotificationSetting.PRACTITIONER_ACCEPTS_INVITATION]: 'Practitioner accepts invitation',
};

export const SOLO_PROFILE_NOTIFICATION_SETTING_LABEL = {
  [EProfileNotificationSetting.CLIENT_ACCEPTS_INVITATION]: 'Client accepts invitation',
  [EProfileNotificationSetting.CLIENT_COMPLETES_TASK]: 'Client completes task',
  [EProfileNotificationSetting.NEW_MESSAGE]: 'New message',
};

export const PRACTITIONER_PROFILE_NOTIFICATION_SETTING_LABEL = {
  [EProfileNotificationSetting.CLIENT_ACCEPTS_INVITATION]: 'Client accepts invitation',
  [EProfileNotificationSetting.CLIENT_COMPLETES_TASK]: 'Client completes task',
  [EProfileNotificationSetting.CLIENT_RELOCATED]: 'Client relocated',
  [EProfileNotificationSetting.NEW_MESSAGE]: 'New message',
};
