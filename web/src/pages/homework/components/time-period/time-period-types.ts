import { EDayOfWeek, EFrequencyType, ERepeatDurationType } from 'src/variables/enum-variables';
import { Dayjs } from 'dayjs';

export type TTimePeriodFormValues = {
  frequency: EFrequencyType;
  repeatEvery?: number;
  repeatDuration?: ERepeatDurationType;
  dayOfWeek?: EDayOfWeek[];
  startDate: Date | Dayjs;
  endDate?: Date | Dayjs;
  endAfter?: number;
  reminderTime: Dayjs | string;
  reminderTimePeriod: string;
  timezone: string;
};
