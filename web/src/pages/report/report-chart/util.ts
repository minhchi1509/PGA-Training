import dayjs from 'dayjs';
import { TLoginRateData } from 'src/interfaces/practitioners-interface';
import { TFilter } from 'src/pages/clients/client-details-components/insight/util';
import { ETimePeriodTracker } from 'src/variables/enum-variables';

export const convertChartData = (filter: TFilter, dataChart: TLoginRateData) => {
  let labels = [];
  const values: number[] = [];
  let diff = 7,
    timeRange = 1,
    maxDate = dayjs();

  if (filter.type === ETimePeriodTracker.MONTH) {
    diff = 30;
    timeRange = 7;
  } else if (filter.type === ETimePeriodTracker.CUSTOM) {
    maxDate = dayjs(filter.endDate);
    diff = dayjs(filter.endDate).diff(dayjs(filter.startDate), 'day') + 1;
    if (diff > 7) {
      timeRange = 7;
    } else {
      timeRange = 1;
    }
  }

  for (let i = 0; i < diff; i += timeRange) {
    labels.push(maxDate.subtract(i, 'd').format('MMM DD'));
  }
  labels = labels.reverse();
  labels.forEach((label) => {
    const data = Object.keys(dataChart).find((date) => dayjs(date).format('MMM DD') === label);
    if (data) {
      values.push(dataChart[`${data}`].totalLogin);
    } else {
      values.push(0);
    }
  });
  const lengthData = Object.keys(dataChart).length;
  const lastDate = Object.keys(dataChart)[lengthData - 1];
  const currentClientsActive = dataChart[dayjs(lastDate).format('YYYY-MM-DD')]?.totalActive;

  return {
    labels,
    values,
    currentClientsActive,
  };
};
