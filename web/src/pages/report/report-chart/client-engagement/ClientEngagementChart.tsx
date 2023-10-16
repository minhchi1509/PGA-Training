import { BaseText } from 'src/components/typography';
import './ClientEngagementChart.scss';
import Select from 'src/components/select';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { TRootState, useAppDispatch } from 'src/stores';
import { useSelector } from 'react-redux';
import { ETimePeriodTracker, EUserType } from 'src/variables/enum-variables';
import { TFilter, getFilterTitle } from 'src/pages/clients/client-details-components/insight/util';
import TimePeriod from 'src/pages/clients/client-details-components/insight/EmotionTracker/TimePeriod';
import { ChevronDownIcon } from 'src/assets/icons';
import { TCommonGetListParams, TSelectOption } from 'src/interfaces/common-interface';
import { getPractitionerClientLoginRate, getPractitioners } from 'src/stores/practitioners';
import { unwrapResult } from '@reduxjs/toolkit';
import { TGetPractitionersParams, TLoginRateData } from 'src/interfaces/practitioners-interface';
import { EProfileStatus } from 'src/variables/common';
import { getClients } from 'src/stores/clients';
import { TGetClientsParams } from 'src/interfaces/clients-interface';
import { showErrorToast } from 'src/components/toast/Toast';
import dayjs from 'dayjs';
import ResponseError from 'src/interfaces/error-response-interface';
import { getOwnerClientLoginRate } from 'src/stores/practitioners/practitioners-actions';
import { convertChartData } from '../util';

const ClientEngagementChart = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector((state: TRootState) => state.user.profile);
  const role = profile?.role;
  const [practitionersParams] = useState<TCommonGetListParams>({
    page: 1,
    size: 100,
    keyword: '',
  });
  const [clientsParams] = useState<TCommonGetListParams>({
    page: 1,
    size: 1000,
    keyword: '',
  });
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<TFilter>({
    type: ETimePeriodTracker.SEVEN_DAY,
  });
  const [dataChart, setDataChart] = useState<TLoginRateData>({});
  const [valuesSelect, setValuesSelect] = useState<TSelectOption[]>([]);
  const [valueSelected, setValueSelected] = useState<string | number>('');
  const [numberOfClients, setNumberOfClients] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  const toggleShowFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const getPractitionerList = async (params: TCommonGetListParams) => {
    const newParams: TGetPractitionersParams = { ...params, status: EProfileStatus.ACTIVE };

    const result = unwrapResult(await dispatch(getPractitioners(newParams)));
    const practitionersResult = result.data;
    const practitioners = practitionersResult.map((item) => {
      return { value: item.id, label: `${item.firstName} ${item.lastName}` };
    });
    setValuesSelect(practitioners);
    if (practitioners) {
      setValueSelected(practitioners[0]?.value || '');
    }
  };

  const getClientList = async (params: TCommonGetListParams) => {
    const newParams: TGetClientsParams = { ...params, status: EProfileStatus.ACTIVE };

    const result = unwrapResult(await dispatch(getClients(newParams)));
    const clientsResult = result.data;
    const clients = clientsResult.map((item) => {
      return { value: item.clientId, label: `${item.firstName} ${item.lastName}` };
    });
    setValuesSelect(clients);
    if (clients) {
      setValueSelected(clients[0]?.value || '');
    }
  };

  useEffect(() => {
    if (role) {
      if (role === EUserType.OWNER) {
        getPractitionerList(practitionersParams);
      } else {
        getClientList(clientsParams);
      }
    }
  }, [role]);

  const onFilter = (value: TFilter) => {
    setFilter(value);
    setIsShowFilter(false);
  };

  const onChangeSelect = (value: string) => {
    setValueSelected(value);
  };

  useEffect(() => {
    if (valueSelected && role) {
      getChartData();
    }
  }, [filter, valueSelected, role]);

  useEffect(() => {
    convertData();
  }, [dataChart]);

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
        result = unwrapResult(
          await dispatch(getOwnerClientLoginRate({ startAt: fromAt, endAt: toAt, practitionerId: valueSelected })),
        );
      } else {
        result = unwrapResult(
          await dispatch(getPractitionerClientLoginRate({ startAt: fromAt, endAt: toAt, clientId: valueSelected })),
        );
      }
      setDataChart({ ...result });
    } catch (e) {
      const { message } = e as ResponseError;
      showErrorToast(message);
    }
  };

  const convertData = () => {
    const { labels, values, currentClientsActive } = convertChartData(filter, dataChart);
    setNumberOfClients(currentClientsActive ? currentClientsActive : 0);
    setLabels([...labels]);
    setValues([...values]);
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        fill: false,
        borderColor: '#35D6AF',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="ClientEngagementChart">
      <BaseText type="title">{`${role === EUserType.OWNER ? 'Clients login rate' : 'Clients engagement'}`}</BaseText>
      <BaseText type="small" className="subTitle">
        {`${
          role === EUserType.OWNER
            ? 'Percentage of client logged in to the app over time'
            : 'How many times the clients log into the app '
        }`}
      </BaseText>

      <div className="ClientEngagementChart__filter">
        <div className="ClientEngagementChart__filter-element">
          <BaseText type="caption">{`${role === EUserType.OWNER ? 'Practitioner: ' : 'Clients: '}`}</BaseText>
          <Select
            placeholder="Select"
            style={{ width: 150 }}
            options={valuesSelect}
            value={valueSelected}
            onChange={onChangeSelect}
          />
        </div>
        <div className="ClientEngagementChart__filter-element" style={{ width: 201 }}>
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

      {role === EUserType.OWNER && (
        <BaseText type="caption" className="number-clients">{`Number of clients: ${numberOfClients}`}</BaseText>
      )}
      <div className="ClientEngagementChart__report">
        <BaseText type="caption" className="ClientEngagementChart__report-title">
          Login times
        </BaseText>
        <div className="ClientEngagementChart__report-chart">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default ClientEngagementChart;
