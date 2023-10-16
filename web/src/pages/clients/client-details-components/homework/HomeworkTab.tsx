import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { NoteRemoveIcon } from 'src/assets/icons';
import { ConfirmModal } from 'src/components/popup';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import HomeworkDetailSection from 'src/containers/homework/HomeworkDetailSection';
import {
  TActivityData,
  TGetAssignedHomeworkParams,
  TGetHomeworkHistoryListParams,
  TRemoveAssignedHomeworkParams,
  TRemoveAssignedHomeworkResponse,
  TTaskItemData,
} from 'src/interfaces/clients-interface';
import { TRangeDate } from 'src/interfaces/common-interface';
import {
  ALL_ASSIGNED_TAB_KEYS,
  EClientDetailTabKey,
  EHomeworkTabView,
} from 'src/pages/clients/client-details-page-constants';
import { TRootState, useAppDispatch } from 'src/stores';
import {
  EClientsAction,
  getAssignedHomeworkListAction,
  getHomeworkHistoryListAction,
  getTotalAssignedHomeworkAction,
  loadMoreAssignedHomeworkListAction,
  loadMoreHomeworkHistoryListAction,
  removeAssignedHomeworkAction,
} from 'src/stores/clients';
import { DEFAULT_GET_LIST_PARAMS, DEFAULT_PAGE, RANGE_DATE_CURRENT_WEEK } from 'src/variables/common';
import { EHomeworkStatus } from 'src/variables/enum-variables';
import AllAssignedTasks from './AllAssignedTasks';
import AssignHomework from './AssignHomework';
import HomeworkHistory from './HomeworkHistory';
import './HomeworkTab.scss';
import { IClientGeneralInformation } from '../../client-details-page-interface';
import { getCurrentTimezone } from 'src/utils/common-utils';

interface IProps {
  currentTabKey: EClientDetailTabKey;
  clientGeneralInformation: IClientGeneralInformation;
  onClickHistoryItem: (item: TTaskItemData) => void;
  onViewHomeworkHistoryDetails: (data: TActivityData) => void;
  isBlockNavigateRef: React.MutableRefObject<boolean>;
}

const DEFAULT_PARAMS: TGetAssignedHomeworkParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  clientId: '',
  status: ALL_ASSIGNED_TAB_KEYS.ONGOING,
};

const DEFAULT_GET_HOMEWORK_HISTORY_LIST_PARAMS: TGetHomeworkHistoryListParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  clientId: '',
  dateRange: [
    dayjs(RANGE_DATE_CURRENT_WEEK.fromDate).format('YYYY-MM-DD'),
    dayjs(RANGE_DATE_CURRENT_WEEK.toDate).format('YYYY-MM-DD'),
  ],
  timezone: getCurrentTimezone(),
};

const HomeworkTab = ({
  currentTabKey,
  clientGeneralInformation,
  onClickHistoryItem,
  onViewHomeworkHistoryDetails,
  isBlockNavigateRef,
}: IProps) => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const clientId = params.clientId as string;

  const { removing, assignedHomework, homeworkHistoryList, loadingHomeworkHistory } = useSelector(
    (state: TRootState) => ({
      removing: state.loading[EClientsAction.REMOVE_ASSIGNED_HOMEWORK],
      assignedHomework: state.clients.assignedHomework,
      homeworkHistoryList: state.clients.homeworkHistoryList,
      loadingHomeworkHistory: state.loading[EClientsAction.GET_HOMEWORK_HISTORY_LIST],
    }),
  );

  const [assignedHomeworkParams, setAssignedHomeworkParams] = useState<TGetAssignedHomeworkParams>(DEFAULT_PARAMS);
  const [homeworkHistoryParams, setHomeworkHistoryParams] = useState<TGetHomeworkHistoryListParams>(
    DEFAULT_GET_HOMEWORK_HISTORY_LIST_PARAMS,
  );
  const [searchKey, setSearchKey] = useState<string>('');
  const [removeTaskModalState, setRemoveTaskModalState] = useState({
    visible: false,
    id: '',
  });
  const [currentView, setCurrentView] = useState<EHomeworkTabView>(EHomeworkTabView.DEFAULT);
  const [rangeDate, setRangeDate] = useState<TRangeDate>(RANGE_DATE_CURRENT_WEEK);
  const [taskItemDetail, setTaskItemDetail] = useState<TTaskItemData>();
  const isAssignView = currentView === EHomeworkTabView.ASSIGN;
  const isDefaultView = currentView === EHomeworkTabView.DEFAULT;
  const isHomeworkDetailView = currentView === EHomeworkTabView.HOMEWORK_DETAIL;

  const handleChangeView = (type: EHomeworkTabView) => {
    setCurrentView(type);
  };

  const handleCloseRemoveTaskModal = () => {
    setRemoveTaskModalState({ visible: false, id: '' });
  };

  const handleOpenRemoveTaskModal = (id: string) => {
    setRemoveTaskModalState({ visible: true, id });
  };

  const handleClickTaskItem = (data: TTaskItemData) => {
    handleChangeView(EHomeworkTabView.HOMEWORK_DETAIL);
    setTaskItemDetail(data);
  };

  const handleOutHomeworkDetailView = () => {
    handleChangeView(EHomeworkTabView.DEFAULT);
    setTaskItemDetail(undefined);
  };

  const handleHideAssignHomework = () => {
    handleChangeView(EHomeworkTabView.DEFAULT);
  };

  const handleChangeTab = (key: string) => {
    setSearchKey('');
    setAssignedHomeworkParams({
      ...DEFAULT_GET_LIST_PARAMS,
      clientId: assignedHomeworkParams.clientId,
      status: key as EHomeworkStatus,
    });
  };

  const getAssignedHomework = (params: TGetAssignedHomeworkParams) => {
    dispatch(getAssignedHomeworkListAction(params));
  };

  useEffect(() => {
    getAssignedHomework({ ...assignedHomeworkParams, clientId, status: assignedHomeworkParams.status });
  }, [clientGeneralInformation.status]);

  const getHomeworkHistoryList = (params: TGetHomeworkHistoryListParams) => {
    const isLoadMore = params.page > 1;

    !isLoadMore ? dispatch(getHomeworkHistoryListAction(params)) : dispatch(loadMoreHomeworkHistoryListAction(params));
  };

  const handleLoadMore = () => {
    const { currentPage } = assignedHomework;
    const newParams = {
      ...assignedHomeworkParams,
      keyword: searchKey,
      page: currentPage + 1,
    };
    dispatch(loadMoreAssignedHomeworkListAction(newParams));
  };

  const handleLoadMoreHomeworkHistory = () => {
    const newParams = {
      ...homeworkHistoryParams,
      page: homeworkHistoryParams.page + 1,
    };

    setHomeworkHistoryParams(newParams);
  };

  const debounceSearch = useCallback(
    debounce((searchKey: string, clientId?: string, status?: string) => {
      const newParams = {
        ...DEFAULT_GET_LIST_PARAMS,
        keyword: searchKey,
        clientId: clientId ?? '',
        status: status as EHomeworkStatus,
      };

      getAssignedHomework(newParams);
    }, 500),
    [],
  );

  const handleSearch = (keyword: string) => {
    setSearchKey(keyword);
    debounceSearch(keyword, params?.clientId, assignedHomeworkParams.status);
  };

  const refreshAssignedHomework = (getTotal?: boolean) => {
    if (getTotal) {
      dispatch(getTotalAssignedHomeworkAction({ clientId: params?.clientId ?? '' }));
    }
    getAssignedHomework({ ...assignedHomeworkParams, keyword: searchKey });
  };

  const handleRemoveTask = async () => {
    const removeParams: TRemoveAssignedHomeworkParams = {
      homeworkAssignId: removeTaskModalState.id,
      clientId: params?.clientId ?? '',
    };

    const { payload: response } = await dispatch(removeAssignedHomeworkAction(removeParams));

    handleCloseRemoveTaskModal();
    if ((response as TRemoveAssignedHomeworkResponse)?.homeworkAssignId) {
      refreshAssignedHomework();
      showSuccessToast('This homework task is removed successfully');
    } else {
      showErrorToast('Oops, something went wrong. Please try again later');
    }
  };

  const handleChangeRangeDate = (rangeDate: TRangeDate) => {
    const newParams = {
      ...homeworkHistoryParams,
      page: DEFAULT_PAGE,
      dateRange: [dayjs(rangeDate.fromDate).format('YYYY-MM-DD'), dayjs(rangeDate.toDate).format('YYYY-MM-DD')],
    };

    setRangeDate(rangeDate);
    setHomeworkHistoryParams(newParams);
  };

  useEffect(() => {
    if (params?.clientId) {
      setAssignedHomeworkParams({ ...DEFAULT_PARAMS, clientId: params?.clientId ?? '' });
      setHomeworkHistoryParams({ ...DEFAULT_GET_HOMEWORK_HISTORY_LIST_PARAMS, clientId: params?.clientId ?? '' });
    }
  }, [params?.clientId]);

  useEffect(() => {
    assignedHomeworkParams.clientId && getAssignedHomework(assignedHomeworkParams);
  }, [assignedHomeworkParams]);

  useEffect(() => {
    homeworkHistoryParams.clientId && getHomeworkHistoryList(homeworkHistoryParams);
  }, [homeworkHistoryParams]);

  useEffect(() => {
    if (currentTabKey !== EClientDetailTabKey.HOMEWORK) {
      handleChangeView(EHomeworkTabView.DEFAULT);
      setRangeDate(RANGE_DATE_CURRENT_WEEK);
    }

    if (currentTabKey === EClientDetailTabKey.HOMEWORK) {
      dispatch(getTotalAssignedHomeworkAction({ clientId: params?.clientId ?? '' }));
    }
  }, [currentTabKey]);

  return (
    <div className="HomeworkTab">
      {isDefaultView && (
        <>
          <AllAssignedTasks
            className="HomeworkTab__tasks"
            activeTabKey={assignedHomeworkParams.status as string}
            searchKey={searchKey}
            onSearch={handleSearch}
            onChangeTab={handleChangeTab}
            onLoadMore={handleLoadMore}
            onClick={handleClickTaskItem}
            onClickAssignHomework={() => setCurrentView(EHomeworkTabView.ASSIGN)}
            onClickRemoveTask={handleOpenRemoveTaskModal}
            clientGeneralInformation={clientGeneralInformation}
          />
          <HomeworkHistory
            className="HomeworkTab__history"
            rangeDate={rangeDate}
            loading={loadingHomeworkHistory}
            homeworkHistoryList={homeworkHistoryList}
            onChangeRangeDate={handleChangeRangeDate}
            onClickItem={onClickHistoryItem}
            onLoadMore={handleLoadMoreHomeworkHistory}
          />
        </>
      )}

      {isAssignView && (
        <AssignHomework
          onCancel={handleHideAssignHomework}
          onAssignSuccess={() => refreshAssignedHomework(true)}
          isBlockNavigateRef={isBlockNavigateRef}
        />
      )}

      {isHomeworkDetailView && taskItemDetail && (
        <HomeworkDetailSection
          selectedTask={taskItemDetail}
          onBack={handleOutHomeworkDetailView}
          onViewDetailsHomeworkHistory={onViewHomeworkHistoryDetails}
          onRefreshAssignedHomeworkList={refreshAssignedHomework}
        />
      )}

      <ConfirmModal
        open={removeTaskModalState.visible}
        titleModal="Remove this task?"
        icon={<NoteRemoveIcon />}
        txtBtnConfirm="Yes"
        danger
        onCancelButton={handleCloseRemoveTaskModal}
        onsubmit={handleRemoveTask}
        loading={removing}
      >
        <BaseText type="body1" textAlign="center" className="HomeworkTab__removeDescription">
          Do you want to remove this task from this client&apos;s homework from now on?
        </BaseText>
      </ConfirmModal>
    </div>
  );
};

export default HomeworkTab;
