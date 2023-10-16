import { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ChevronLeftIcon } from 'src/assets/icons';
import DatePicker from 'src/components/date-picker';
import { TabsHeader } from 'src/components/tabs';
import { BaseText } from 'src/components/typography';
import {
  TActivityData,
  TGetAssignedHomeworkDetailsParams,
  TGetAssignedHomeworkHistoriesParams,
  TTaskItemData,
} from 'src/interfaces/clients-interface';
import { TRootState, useAppDispatch } from 'src/stores';
import {
  EClientsAction,
  getAssignedHomeworkDetailsAction,
  getAssignedHomeworkHistoriesAction,
} from 'src/stores/clients';
import { DATE_FORMAT, DEFAULT_GET_LIST_PARAMS, DEFAULT_PAGE, RANGE_DATE_CURRENT_WEEK } from 'src/variables/common';
import { EHomeworkDetailTabKeys, HOMEWORK_DETAIL_TABS } from '../../pages/clients/client-details-page-constants';
import HomeworkDetailsHistoryTab from './HomeworkDetailsHistoryTab';
import HomeworkDetailsTab from './HomeworkDetailsTab';
import './HomeworkDetailSection.scss';

interface IProps {
  selectedTask: TTaskItemData;
  onBack: () => void;
  onViewDetailsHomeworkHistory: (data: TActivityData) => void;
  onRefreshAssignedHomeworkList: (isGetTotal?: boolean) => void;
}

const { fromDate: defaultFromDate, toDate: defaultToDate } = RANGE_DATE_CURRENT_WEEK;
const formattedDefaultFromDate = dayjs(defaultFromDate).format(DATE_FORMAT.PARAM_TYPE);
const formattedDefaultToDate = dayjs(defaultToDate).format(DATE_FORMAT.PARAM_TYPE);

const DEFAULT_PARAMS: TGetAssignedHomeworkHistoriesParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  id: '',
  clientId: '',
  dateRange: [formattedDefaultFromDate, formattedDefaultToDate],
};

const HomeworkDetailSection = ({
  selectedTask,
  onBack,
  onViewDetailsHomeworkHistory,
  onRefreshAssignedHomeworkList,
}: IProps) => {
  const params = useParams();
  const dispatch = useAppDispatch();

  DEFAULT_PARAMS.dateRange[0] = dayjs(selectedTask.startDate).isAfter(dayjs())
    ? dayjs().format(DATE_FORMAT.PARAM_TYPE)
    : dayjs(selectedTask.startDate).format(DATE_FORMAT.PARAM_TYPE);

  const [currentTabKey, setCurrentTabKey] = useState<EHomeworkDetailTabKeys>(EHomeworkDetailTabKeys.DETAILS);
  const [homeworkHistoryDetailListParams, setHomeworkHistoryDetailListParams] =
    useState<TGetAssignedHomeworkHistoriesParams>(DEFAULT_PARAMS);

  const { homeworkDetails, homeworkHistoryDetailList, loadingHistoryList } = useSelector((state: TRootState) => ({
    homeworkDetails: state.clients.homeworkDetail,
    homeworkHistoryDetailList: state.clients.homeworkHistoryDetailList,
    loadingHistoryList: state.loading[EClientsAction.GET_ASSIGNED_HOMEWORK_HISTORIES],
  }));
  const isHistoryTab = currentTabKey === EHomeworkDetailTabKeys.HISTORY;

  const handleChangeTab = (key: string) => {
    setCurrentTabKey(key as EHomeworkDetailTabKeys);
  };

  const getHomeworkDetails = (params: TGetAssignedHomeworkDetailsParams) => {
    dispatch(getAssignedHomeworkDetailsAction(params));
  };

  const getHomeworkHistoryDetails = (params: TGetAssignedHomeworkHistoriesParams) => {
    dispatch(getAssignedHomeworkHistoriesAction(params));
  };

  const handleChangePage = (page: number) => {
    setHomeworkHistoryDetailListParams({
      ...homeworkHistoryDetailListParams,
      page,
    });
  };

  const disableDate = (date: Dayjs | null, isStartDate?: boolean): boolean => {
    if (isStartDate) {
      return date ? date > dayjs(homeworkHistoryDetailListParams.dateRange[1]).endOf('day') : false;
    }

    return date ? date < dayjs(homeworkHistoryDetailListParams.dateRange[0]).startOf('day') : false;
  };

  const handleChangeDate = (value: Dayjs, isFrom?: boolean) => {
    const formattedDate = dayjs(value).format(DATE_FORMAT.PARAM_TYPE);
    const newDateRange = isFrom
      ? [formattedDate, homeworkHistoryDetailListParams.dateRange[1]]
      : [homeworkHistoryDetailListParams.dateRange[0], formattedDate];

    const newParams: TGetAssignedHomeworkHistoriesParams = {
      ...homeworkHistoryDetailListParams,
      dateRange: newDateRange,
      page: DEFAULT_PAGE,
    };

    setHomeworkHistoryDetailListParams(newParams);
  };

  const handleUpdateHomeworkSuccess = () => {
    onRefreshAssignedHomeworkList();
    getHomeworkDetails({
      clientId: params?.clientId ?? '',
      homeworkAssignId: selectedTask.id,
    });
  };

  const renderTab = () => {
    switch (currentTabKey) {
      case EHomeworkDetailTabKeys.DETAILS:
        return (
          <HomeworkDetailsTab
            homeworkDetails={homeworkDetails}
            clientId={params?.clientId}
            onUpdateSuccess={handleUpdateHomeworkSuccess}
          />
        );
      case EHomeworkDetailTabKeys.HISTORY:
        return (
          <HomeworkDetailsHistoryTab
            selectedTask={selectedTask}
            loading={loadingHistoryList}
            params={homeworkHistoryDetailListParams}
            homeworkHistoryDetails={homeworkHistoryDetailList}
            onChangePage={handleChangePage}
            onViewDetailsHomeworkHistory={onViewDetailsHomeworkHistory}
          />
        );
    }
  };

  useEffect(() => {
    homeworkHistoryDetailListParams.id && getHomeworkHistoryDetails(homeworkHistoryDetailListParams);
  }, [homeworkHistoryDetailListParams]);

  useEffect(() => {
    if (selectedTask?.id) {
      getHomeworkDetails({
        clientId: params?.clientId ?? '',
        homeworkAssignId: selectedTask.id,
      });
      setHomeworkHistoryDetailListParams({
        ...DEFAULT_PARAMS,
        id: selectedTask.id,
        clientId: params?.clientId ?? '',
      });
    }
  }, [selectedTask]);

  return (
    <div className="HomeworkDetailSection">
      <div className="HomeworkDetailSection__header">
        <div className="HomeworkDetailSection__header-left">
          <ChevronLeftIcon onClick={onBack} />
          <BaseText type="title">{selectedTask.title}</BaseText>
        </div>
        {isHistoryTab && (
          <div className="HomeworkDetailSection__header-rangeDate">
            <BaseText type="caption">From</BaseText>
            <DatePicker
              allowClear={false}
              value={dayjs(homeworkHistoryDetailListParams.dateRange[0])}
              disabledDate={(date) => disableDate(date, true)}
              onChange={(value) => handleChangeDate(value as Dayjs, true)}
            />
            <BaseText type="caption">To</BaseText>
            <DatePicker
              allowClear={false}
              value={dayjs(homeworkHistoryDetailListParams.dateRange[1])}
              disabledDate={(date) => disableDate(date, false)}
              onChange={(value) => handleChangeDate(value as Dayjs, false)}
            />
          </div>
        )}
      </div>

      <TabsHeader
        secondaryHeader
        items={HOMEWORK_DETAIL_TABS}
        activeKey={currentTabKey}
        onChangeTab={handleChangeTab}
      />

      {renderTab()}
    </div>
  );
};

export default HomeworkDetailSection;
