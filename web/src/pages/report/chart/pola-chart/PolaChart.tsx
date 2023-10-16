/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArcElement, Chart as ChartJS, Legend, RadialLinearScale, Tooltip } from 'chart.js';
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import { EllipseIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { randomColor } from 'src/utils/common-utils';
import './PolaChart.scss';

export type IValueType = {
  name: string;
  value: number;
};

interface IPolaChartProps {
  dataValues: IValueType[];
}

const PolaChart = ({ dataValues }: IPolaChartProps) => {
  const idxItem: number[] = [];
  const percentageTimes = dataValues?.map((item) => item.value);
  const totalTimesItem = percentageTimes.reduce((partialSum, a) => partialSum + a, 0);
  const percent = percentageTimes.map((item) => Math.round((item / totalTimesItem) * 100 * 100) / 100);

  const totalPercentTimes = percent.reduce((partialSum, a, crrIdx) => {
    if (a === 0) idxItem.push(crrIdx);
    return partialSum + a;
  }, 0); // total percent 100%

  if (totalPercentTimes === 0 && idxItem.length !== 0) {
    const lastPercentage = 100 / idxItem.length;
    idxItem.map((idx) => {
      percent[idx] = lastPercentage;
    });
  }

  const anglePercentage = percent.map((item) => item * 3.6); // total angle = 360 => 1% = 3.6

  const backgroundColor = percent.map((_item, idx) => {
    if (idxItem.includes(idx)) {
      return '#8a8a8a';
    }
    return randomColor();
  });

  const labelsActivities = dataValues
    .filter((item) => {
      if (item.value !== 0) return item.name;
      return;
    })
    .map((it) => it.name);

  const data = {
    labels: labelsActivities,
    datasets: [
      {
        // label: '# of practitioner',
        data: percent.filter((item) => item !== 0),
        backgroundColor: backgroundColor.filter((item) => item !== '#8a8a8a'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        display: false,
      },
    },
    elements: {
      arc: {
        angle: anglePercentage.filter((item) => item !== 0),
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function () {
            return null;
          },
          label: function (context: any) {
            let label = context.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.r !== null) {
              label += `${context.parsed.r}%`;
            }
            return label;
          },
        },
        yAlign: 'bottom',
      },
    },
  };

  const noteInformation = (): React.ReactNode => {
    return (
      <div className="PolaChart__information-note">
        {dataValues?.map((item, index) => {
          return (
            <div key={index} className="PolaChart__information-note-item">
              <EllipseIcon className="icon" fill={backgroundColor[index]} />
              <BaseText type="caption">{`${item.name}`}</BaseText>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="PolaChart">
      <div className="PolaChart__chart">
        <PolarArea data={data} options={options as any} />
      </div>
      <div className="PolaChart__information">
        <div className="PolaChart__information-head">
          <BaseText>Total engagement for clinic</BaseText>
          <div className="PolaChart__information-head-total">
            <BaseText type="heading" className="total-number">
              {totalTimesItem}
            </BaseText>
            <BaseText type="small">login times</BaseText>
          </div>
        </div>
        {noteInformation()}
      </div>
    </div>
  );
};

export default PolaChart;
