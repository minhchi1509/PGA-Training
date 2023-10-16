export enum EPractitionerDetailTabKey {
  GENERAL_INFO = 'generalInfo',
  DETAILED_STATISTICS = 'detailedStatistics',
}

export const PRACTITIONER_DETAIL_TAB_LABEL = {
  [EPractitionerDetailTabKey.GENERAL_INFO]: 'General Information',
  [EPractitionerDetailTabKey.DETAILED_STATISTICS]: 'Detailed Statistics',
};

export enum EConfirmModalType {
  REVOKE = 'REVOKE',
  RESEND = 'RESEND',
  DEACTIVATE = 'DEACTIVATE',
  REACTIVATE = 'REACTIVATE',
  ASSIGN_CLIENTS = 'ASSIGN_CLIENTS',
}

export enum EStatisticType {
  MESSAGES = 'MESSAGES',
  HOMEWORK_TASKS = 'HOMEWORK_TASKS',
  ACTIVE_CLIENTS = 'ACTIVE_CLIENTS',
  PENDING_CLIENTS = 'PENDING_CLIENTS',
  DEACTIVE_CLIENTS = 'DEACTIVE_CLIENTS',
}
