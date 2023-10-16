/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { BaseText } from 'src/components/typography';
import { useAppDispatch } from 'src/stores';
import { ETimePeriodTracker, EUserType } from 'src/variables/enum-variables';
import BarChart from '../../chart/bar-chart/BarChart';
import PolaChart from '../../chart/pola-chart/PolaChart';
import './PractitionerEngagementChart.scss';
import { ChevronDownIcon } from 'src/assets/icons';
import { TFilter, getFilterTitle } from 'src/pages/clients/client-details-components/insight/util';
import TimePeriod from 'src/pages/clients/client-details-components/insight/EmotionTracker/TimePeriod';
import { getPractitionerEngagements } from 'src/stores/practitioners/practitioners-actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { showErrorToast } from 'src/components/toast/Toast';
import dayjs from 'dayjs';
import ResponseError from 'src/interfaces/error-response-interface';
import { TPractitionerEngagementChartData } from 'src/interfaces/practitioners-interface';
import { getTaskCompletionTask } from 'src/stores/practitioners';

interface PractitionerEngagementChart {
  role?: string;
}

const PractitionerEngagementChart = ({ role }: PractitionerEngagementChart) => {
  const dispatch = useAppDispatch();
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<TFilter>({
    type: ETimePeriodTracker.SEVEN_DAY,
  });
  const [dataPolarChart, setDataPolarChart] = useState<TPractitionerEngagementChartData[]>([]);
  const [dataBarChart, setDataBarChart] = useState<TPractitionerEngagementChartData[]>([]);

  const getChartData = async () => {
    try {
      let result;
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
      if (role === EUserType.OWNER) {
        result = unwrapResult(await dispatch(getPractitionerEngagements({ startAt: fromAt, endAt: toAt })));
        if (result) {
          const convertData = result
            .map((item) => {
              return {
                name: `${item.firstName} ${item.lastName}`,
                value: item.totalOnline,
              };
            })
            .sort((a, b) => b.value - a.value);
          setDataPolarChart([...convertData]);
        }
      } else {
        result = unwrapResult(await dispatch(getTaskCompletionTask({ startAt: fromAt, endAt: toAt })));
        if (result) {
          const convertData = result.map((item) => {
            let percentageComplete = 0;
            if (item.totalAssign !== 0) {
              percentageComplete = (item.totalComplete / item.totalAssign) * 100;
            }
            return {
              name: `${item.firstName} ${item.lastName}`,
              value: percentageComplete,
            };
          });
          setDataBarChart([...convertData]);
        }
      }
    } catch (e) {
      const { message } = e as ResponseError;
      showErrorToast(message);
    }
  };

  useEffect(() => {
    if (role) {
      getChartData();
    }
  }, [filter, role]);

  const toggleShowFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const onFilter = (value: TFilter) => {
    setFilter(value);
    setIsShowFilter(false);
  };

  return (
    <div className="PractitionerEngagementChart">
      <BaseText type="title">{`${role === EUserType.OWNER ? 'Practitioner engagement' : 'Completion rate'}`}</BaseText>
      <BaseText type="small" className="subTitle">
        {`${
          role === EUserType.OWNER
            ? 'Total time of practitioners spend in the app '
            : 'Client’s homework completion rate over time'
        }`}
      </BaseText>
      <div className="PractitionerEngagementChart__filter">
        <div className="PractitionerEngagementChart__filter-element" style={{ width: 221 }}>
          <BaseText type="caption">Period:</BaseText>
          <div className="PractitionerEngagementChart__filter-element-date" onClick={toggleShowFilter}>
            <BaseText type="caption">{getFilterTitle(filter.type)}</BaseText>
            <ChevronDownIcon />
          </div>
          {isShowFilter ? (
            <TimePeriod isOpen={true} onClose={toggleShowFilter} value={filter} onSubmit={onFilter} />
          ) : null}
        </div>
      </div>
      {role === EUserType.OWNER ? (
        <div className="PractitionerEngagementChart__pola">
          <div className="PractitionerEngagementChart__pola-chart">
            <PolaChart dataValues={dataPolarChart} />
          </div>
        </div>
      ) : (
        <div className="PractitionerEngagementChart__report">
          <BaseText type="caption" className="PractitionerEngagementChart__report-title">
            %
          </BaseText>
          <div className="PractitionerEngagementChart__report-chart">
            <BarChart labels={dataBarChart.map((item) => item.name)} revenue={dataBarChart.map((item) => item.value)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PractitionerEngagementChart;
