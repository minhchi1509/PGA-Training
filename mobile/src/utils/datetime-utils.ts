import { MONTH_NAMES } from '@src/variables/constants';

export const convertDate = (date: string) => {
  const dateObject = new Date(date);
  const month = MONTH_NAMES[dateObject.getMonth()];
  const day = dateObject.getDate();

  const formattedDate = month + ' ' + (day < 10 ? '0' + day : day);
  return formattedDate;
};
