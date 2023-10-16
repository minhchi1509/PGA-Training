import { ETimePeriod } from 'src/variables/enum-variables';

export const convertRemindTime = (time: string, session: string) => {
  const timeConvert = parseInt(time.split(':').join(''));

  return timeConvert;
};

export const revertRemindTime = (time: number) => {
  let timePeriod = ETimePeriod.AM;
  const timeSplit = time.toString().split('').reverse();
  const timeSplitLength = timeSplit.length;

  if (time < 100) {
    for (let i = 0; i < 4 - timeSplitLength; i++) {
      timeSplit.push('0');
    }
  }
  const minute = `${timeSplit[1]}${timeSplit[0]}`;
  const hour = `${timeSplit[3]}${!timeSplit[2] ? '' : timeSplit[2]}`;
  if (time - 1159 > 0) {
    timePeriod = ETimePeriod.PM;
  }

  return {
    timeRevert: typeof time === 'number' ? `${hour}:${minute}` : '08:00',
    timePeriod,
  };
};
