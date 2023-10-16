import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import chartTrendline from 'chartjs-plugin-trendline';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, chartTrendline);

import './EmotionTracker.scss';
import TimePeriod from './TimePeriod';
import { BaseText } from 'src/components/typography';
import { ChevronDownIcon } from 'src/assets/icons';
import { ETimePeriodTracker } from 'src/variables/enum-variables';
import { TTrackMood } from 'src/interfaces/clients-interface';
import { getTrackMoodByDay } from 'src/services/client-service';
import ResponseError from 'src/interfaces/error-response-interface';
import { showErrorToast } from 'src/components/toast/Toast';
import { TFilter, EmotionChartOptions, convertChartData, getFilterTitle } from '../util';
import ChartLabel from './ChartLabel';

const EmotionTracker = () => {
  const params = useParams();
  const clientId = params?.clientId || '';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [recentScores, setRecentScores] = useState<TTrackMood[]>([]);
  const [filter, setFilter] = useState<TFilter>({
    type: ETimePeriodTracker.SEVEN_DAY,
  });

  useEffect(() => {
    getChartData();
  }, [filter]);

  const getChartData = async () => {
    try {
      setIsLoading(true);

      let fromAt = dayjs().format('YYYY-MM-DD'),
        toAt = dayjs().format('YYYY-MM-DD');
      if (filter.type === ETimePeriodTracker.SEVEN_DAY) {
        fromAt = dayjs().subtract(6, 'd').format('YYYY-MM-DD');
      } else if (filter.type === ETimePeriodTracker.MONTH) {
        fromAt = dayjs().subtract(29, 'd').format('YYYY-MM-DD');
      } else {
        fromAt = dayjs(filter.startDate).format('YYYY-MM-DD');
        toAt = dayjs(filter.endDate).format('YYYY-MM-DD');
      }

      const res = await getTrackMoodByDay(clientId, fromAt, toAt);
      setRecentScores(res);
    } catch (e) {
      const { message } = e as ResponseError;
      showErrorToast(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowFilter = () => {
    setIsShowFilter(!isShowFilter);
  };
  const convertData = () => {
    const { labels, values } = convertChartData(filter, recentScores);
    return {
      labels,
      datasets: [
        {
          data: values,
          borderColor: '#FFAC30',
          backgroundColor: '#FFAC30',
          borderWidth: 1.5,
          pointRadius: 0.5,
        },
      ],
    };
  };

  const onFilter = (value: TFilter) => {
    setFilter(value);
    setIsShowFilter(false);
  };

  return (
    <div className="EmotionTracker">
      <div className="EmotionTracker__header">
        <BaseText type="title">Emotion tracker</BaseText>
        <div className="EmotionTracker__filter" onClick={toggleShowFilter}>
          <BaseText type="caption">{getFilterTitle(filter.type)}</BaseText>
          <ChevronDownIcon />
        </div>
      </div>
      <div className="EmotionTracker__item">
        {isLoading ? (
          <div className="EmotionTracker__loading">
            <Spin tip="Loading" size="small">
              <div className="content" />
            </Spin>
          </div>
        ) : (
          <>
            <BaseText type="caption" className="EmotionTracker__title">
              Mood
            </BaseText>
            <div className="EmotionTracker__container">
              <ChartLabel />
              <div className="EmotionTracker__line">
                <Line
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  options={EmotionChartOptions as any}
                  data={convertData()}
                  className="EmotionTracker__chart--svg"
                />
              </div>
            </div>
            {isShowFilter ? (
              <TimePeriod isOpen={true} onClose={toggleShowFilter} value={filter} onSubmit={onFilter} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default EmotionTracker;
