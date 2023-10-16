import { UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { ICardInfo } from 'src/pages/profile/profile-page-constants';

export type TGetListCardResponse = {
  cards: ICardInfo[];
};

export type TCreateNewCardParams = {
  cardToken: string;
  isDefault: boolean;
};

export type TSetCardAsDefaultParams = {
  cardId: string;
};

export type TUpdateCardParams = {
  name?: string;

  cardId: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
};

export type TPlan = {
  id: string;
  price: number;
  amount: number;
};

export type TPaymentPackage = {
  id: string;
  name: string;
  type: string;
  trialDay: number;
  description: string;
  plans: TPlan[];
};

export type TCurrentPayment = {
  id: string;
  startAt: string;
  status: string;
  cancelAt: string;
  nextPaymentAt: string;
  plan: {
    id: string;
    price: number;
    amount: number;
    oldPrice: number;
  };
};

export type TCreateSubscriptionRequest = {
  planId: string;
};

export type TCancelSubscriptionRequest = {
  reasons: {
    key: string;
    value: string;
  }[];
};

export type TNewSubscriptionPlan = {
  price: number;
  amount: number;
  label: string;
  value: string;
};

export type TUpdateSubscriptionRequest = {
  planId: string;
  clientAssigns?: {
    oldPractitionerId: string;
    newPractitionerId?: string;
    inactive: boolean;
  }[];
};

export type TTrialTimeResponse = {
  trialStart: string;
  trialEnd: string;
  status: string;
};

export type TGetProfileDetailResponse = {
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  avatar: string;
  provideNumber: string;
  practitionerType: {
    id: string;
    name: string;
  };
  practitionerTypeOther: string;
};

export type TUpdateProfileDetailRequest = {
  title?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob?: Date;
  phone: string;
  address: string;
  avatar?: UploadFile;
  provideNumber?: string;
  practitionerType?: string;
  practitionerTypeOther?: string;
};

export type TGetClinicDetailRequest = {
  clinicId: string;
};

export type TGetClinicDetailResponse = {
  id: string;
  name: string;
  abn: string;
  phone: string;
  email: string;
  address: string;
  status: string;
};

export type TUpdateClinicDetailRequest = {
  clinicId: string;
  clinicPracticeName: string;
  abn: string;
  clinicPhone: string;
  clinicEmail: string;
  clinicAddress: string;
};

export type TUpdateClinicDetailResponse = {
  id: string;
  name: string;
  abn: string;
  phone: string;
  email: string;
  address: string;
  status: string;
};

export type TContactHelpFormValues = {
  name: string;
  contactDescription: string;
  files: UploadChangeParam;
};
