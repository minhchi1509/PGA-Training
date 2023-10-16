export enum EProfileTabKey {
  GENERAL_INFOMATION = 'GENERAL_INFOMATION',
  CLINIC_INFORMATION = 'CLINIC_INFORMATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  NOTIFICATION = 'NOTIFICATION',
  PRIVACY = 'PRIVACY',
  TERM = 'TERM',
  CONTACT_HELP = 'CONTACT_HELP',
}

export const OWNER_PROFILE_TAB_LABEL = {
  [EProfileTabKey.GENERAL_INFOMATION]: 'General information',
  [EProfileTabKey.CLINIC_INFORMATION]: 'Clinic information',
  [EProfileTabKey.SUBSCRIPTION]: 'My subscription',
  [EProfileTabKey.PAYMENT_METHOD]: 'My payment method',
  [EProfileTabKey.NOTIFICATION]: 'Notification',
  [EProfileTabKey.PRIVACY]: 'Privacy',
  [EProfileTabKey.TERM]: 'Terms and Conditions',
  [EProfileTabKey.CONTACT_HELP]: 'Contact/Help',
};

export const SOLO_PROFILE_TAB_LABEL = {
  [EProfileTabKey.GENERAL_INFOMATION]: 'General information',
  [EProfileTabKey.SUBSCRIPTION]: 'My subscription',
  [EProfileTabKey.PAYMENT_METHOD]: 'My payment method',
  [EProfileTabKey.NOTIFICATION]: 'Notification',
  [EProfileTabKey.PRIVACY]: 'Privacy',
  [EProfileTabKey.TERM]: 'Terms and Conditions',
  [EProfileTabKey.CONTACT_HELP]: 'Contact/Help',
};

export const PRACTITIONER_LABEL = {
  [EProfileTabKey.GENERAL_INFOMATION]: 'General information',
  [EProfileTabKey.NOTIFICATION]: 'Notification',
  [EProfileTabKey.PRIVACY]: 'Privacy',
  [EProfileTabKey.TERM]: 'Terms and Conditions',
  [EProfileTabKey.CONTACT_HELP]: 'Contact/Help',
};

export enum ECardType {
  MASTER = 'MasterCard',
  VISA = 'Visa',
}

export interface ICardInfo {
  id: string;
  name: string;
  object: string;
  brand: string;
  country: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  isDefault: boolean;
}

export enum EConfirmModalType {
  SET_DEFAULT = 'SET_DEFAULT',
  REMOVE = 'REMOVE',
  ADD_NEW = 'ADD_NEW',
}

export enum ECardType {
  CARD_NUMBER = 'CARD_NUMBER',
  CARD_EXPIRY = 'CARD_EXPIRY',
  CARD_CVC = 'CARD_CVC',
}
