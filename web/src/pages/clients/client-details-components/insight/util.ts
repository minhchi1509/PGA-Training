import dayjs, { Dayjs } from 'dayjs';
import { THomeworkSummaryScore, TTrackMood } from 'src/interfaces/clients-interface';
import { ETimePeriodTracker } from 'src/variables/enum-variables';

export const getDassScore = (value: string | number) => {
  if (value) {
    switch (value) {
      case 'Normal':
        return 1;
      case 'Mild':
        return 3;
      case 'Moderate':
        return 5;
      case 'Severe':
        return 7;
      case 'Extremely Severe':
        return 9;
      default:
        return 0;
    }
  }

  return '';
};

export const EmotionChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  lineTension: 0.4,
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        title: () => {
          return false;
        },
        /* eslint-disable @typescript-eslint/no-explicit-any */
        label: (context: any) => {
          return context.label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: '#E1E6EF',
        borderColor: '#E1E6EF',
      },
      ticks: {
        color: '#292D32',
        font: {
          size: 10,
          family: 'Poppins-500',
          weight: '500',
        },
        // minRotation: 35,
      },
    },
    y: {
      grid: {
        color: '#E1E6EF',
        borderColor: '#E1E6EF',
      },
      ticks: {
        color: '#292D32',
        font: {
          size: 10,
          family: 'Poppins-500',
          weight: '500',
        },
        display: false,
        stepSize: 1,
      },
      min: 0,
      max: 5,
    },
  },
};

export const DassChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: '#E1E6EF',
        borderColor: '#E1E6EF',
      },
      ticks: {
        color: '#292D32',
        font: {
          size: 10,
          family: 'Poppins-500',
          weight: '500',
        },
        // minRotation: 35,
      },
    },
    y: {
      grid: {
        color: '#E1E6EF',
        borderColor: '#E1E6EF',
      },
      ticks: {
        color: '#292D32',
        font: {
          size: 10,
          family: 'Poppins-500',
          weight: '500',
        },
        display: false,
        stepSize: 2,
      },
    },
  },
};

export type TFilter = {
  type: string;
  startDate?: Dayjs | null | undefined;
  endDate?: Dayjs | null | undefined;
};

export const validateFilterDate = (startDate: Dayjs | null | undefined, endDate: Dayjs | null | undefined) => {
  if (!startDate) {
    return 'Please enter the from date';
  } else {
    if (dayjs(startDate).diff(dayjs(), 'day') >= 1) {
      return 'Start date must be less than today';
    }
  }

  if (!endDate) {
    return 'Please enter the to date';
  } else {
    if (dayjs(endDate).diff(dayjs(), 'day') >= 1) {
      return 'End date must be less than today';
    }
  }

  if (dayjs(startDate).diff(dayjs(endDate), 'day') >= 1) {
    return 'End date must be greater than Start date';
  }

  const diff = dayjs(endDate).diff(dayjs(startDate), 'day');
  if (diff > 90) {
    return 'Period should not exceed 3 months';
  }

  return true;
};

export const getFilterTitle = (type: string) => {
  if (type === ETimePeriodTracker.SEVEN_DAY) {
    return 'Last 7 days';
  } else if (type === ETimePeriodTracker.MONTH) {
    return 'Last 30 days';
  } else {
    return 'Custom';
  }
};

export const convertChartData = (filter: TFilter, recentScores: TTrackMood[]) => {
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
    const data = recentScores.find((score) => dayjs(score.createdAt).format('MMM DD') === label);
    values.push(data?.flag || 0);
  });

  return {
    labels,
    values,
  };
};

export const convertDassChartData = (
  data?: {
    createdAt: string;
    summary: THomeworkSummaryScore;
  }[],
) => {
  if (data && data.length) {
    const labels = data.map((item) => dayjs(item.createdAt).format('MMM DD'));
    const depression = data.map((item) => getDassScore(item.summary['Depression'].category));
    const anxiety = data.map((item) => getDassScore(item.summary['Anxiety'].category));
    const stress = data.map((item) => getDassScore(item.summary['Stress'].category));

    labels.unshift('');
    depression.unshift(0);
    anxiety.unshift(0);
    stress.unshift(0);

    const fake = [0];
    for (let i = 0; i < stress.length - 2; i++) {
      fake.push(1);
    }
    fake.push(10);

    return {
      labels,
      values: [
        {
          type: 'depression',
          values: depression,
          color: '#F49CB7',
        },
        {
          type: 'anxiety',
          values: anxiety,
          color: '#A6A7DC',
        },
        {
          type: 'stress',
          values: stress,
          color: '#35D6AF',
        },
        { type: 'fake', values: fake, color: 'transparent' },
      ],
    };
  }

  return {
    labels: [],
    values: [
      {
        type: 'depression',
        values: [],
        color: '#F49CB7',
      },
      {
        type: 'anxiety',
        values: [],
        color: '#A6A7DC',
      },
      {
        type: 'stress',
        values: [],
        color: '#35D6AF',
      },
      { type: 'fake', values: [], color: 'transparent' },
    ],
  };
};
