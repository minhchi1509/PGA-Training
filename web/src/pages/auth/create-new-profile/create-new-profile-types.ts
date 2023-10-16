import { UploadFile as TUploadFile } from 'antd/es/upload';

export interface ICreateClinicOwnerProfileValues {
  avatar: TUploadFile;
  title?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob?: Date;
  phone: string;
  address: string;
  clinicPracticeName: string;
  abn: string;
  clinicPhone: string;
  clinicEmail: string;
  clinicAddress: string;
}

export interface ICreatePractitionerProfileValues {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  address: string;
  role: string;
  title?: string;
  dob?: Date;
  abn?: string;
  practitionerType?: string;
  practitionerTypeOther?: string;
  clinicPracticeName?: string;
  provideNumber?: string;
  avatar?: TUploadFile;
}
