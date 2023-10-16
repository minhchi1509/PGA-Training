import { Dayjs } from 'dayjs';
import { EHomeworkType } from 'src/interfaces/clients-interface';
import { ETimePeriod } from 'src/variables/enum-variables';

export type TNewHomeworkFormValues = {
  homeworkType: EHomeworkType | null;
  topic: string;
  homeworkTitle: string;
  description: string;
  reminderTime: Dayjs | Date | number | string | null;
  reminderTimePeriod: ETimePeriod | string | null;
  timezone: string;
};

export type TEditHomeworkDefaultValue = {
  homeworkType: EHomeworkType | null;
  topic: string;
  homeworkTitle: string;
  description: string;
  reminderTime: Dayjs | Date | number | string | null;
  timezone: string;
};
