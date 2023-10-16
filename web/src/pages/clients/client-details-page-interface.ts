import { Dayjs } from 'dayjs';
import { EProfileStatus } from 'src/variables/common';

export interface IClientGeneralInformation {
  clientId: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  address: string;
  dob?: Date | Dayjs;
  email: string;
  occupation?: string;
  status?: EProfileStatus;
  statusConvert?: EProfileStatus;
  dischargeAt: string | null;
}
