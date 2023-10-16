import { Space } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from 'src/components/button';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { AssignHomeworkTopic, HomeworkTasksColumn } from 'src/containers/homework';
import DragDropTasksColumn from 'src/containers/homework/DragDropTasksColumn';
import {
  EHomeworkType,
  TAssignHomeworkRequest,
  TAssignHomeworkResponse,
  TGetTasksByTopicParams,
  THomework,
  TTaskItemData,
} from 'src/interfaces/clients-interface';
import { TGetHomeworkTopicsParams, TGetHomeworkTopicsResponse, THomeworkTopic } from 'src/interfaces/homework-topics';
import HomeWorkDetail from 'src/pages/homework/components/homework-detail/HomeWorkDetail';
import TimePeriod from 'src/pages/homework/components/time-period/TimePeriod';
import { TTimePeriodFormValues } from 'src/pages/homework/components/time-period/time-period-types';
import { TRootState, useAppDispatch } from 'src/stores';
import { EHomeworkTopicsAction, assignHomeworkAction, getTasksByTopicAction } from 'src/stores/homework-topics';
import { getHomeworkTopicsByTypeAction, loadMoreTasksByTopicAction } from 'src/stores/homework-topics/actions';
import { getCurrentTimezone } from 'src/utils/common-utils';
import { SEPARATE_TYPE_HOMEWORK } from 'src/variables/client';
import { DEFAULT_GET_LIST_PARAMS } from 'src/variables/common';
import { ESortType, ETaskType } from 'src/variables/enum-variables';
import { EDragDropColumnId } from '../../client-details-page-constants';
import './AssignHomework.scss';

const DEFAULT_TOPIC_PAGE_SIZE = 1000;
const DEFAULT_HOMEWORK_PAGE_SIZE = 14;

const DEFAULT_HOMEWORK_TOPIC_PARAMS: TGetHomeworkTopicsParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  sortBy: 'name',
  sortType: ESortType.ASC,
  size: DEFAULT_TOPIC_PAGE_SIZE,
  homeworkType: EHomeworkType.ACTIVITIES,
};

const DEFAULT_HOMEWORK_BY_TOPIC_PARAMS: TGetTasksByTopicParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  sortBy: 'title',
  size: DEFAULT_HOMEWORK_PAGE_SIZE,
  sortType: ESortType.ASC,
  homeworkTopicId: '',
};

type TSelectedHomeworkList = {
  formValues: TTimePeriodFormValues;
  data: TTaskItemData;
  homework?: THomework;
};

interface IProps {
  onCancel: () => void;
  onAssignSuccess: () => void;
  isBlockNavigateRef: React.MutableRefObject<boolean>;
}

const AssignHomework = ({ onCancel, onAssignSuccess, isBlockNavigateRef }: IProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const { activityTopics, homework, loadingState } = useSelector((state: TRootState) => ({
    activityTopics: state.homeworkTopics.activityTopics,
    homework: state.homeworkTopics.homework,
    loadingState: state.loading,
  }));

  const [selectedTopic, setSelectedTopic] = useState<THomeworkTopic>(activityTopics.data?.[0]);
  const [searchKeywordHomework, setSearchKeywordHomework] = useState<string>('');
  const [setupScheduleModalState, setSetupScheduleModalState] = useState<{
    open: boolean;
    selectedTask?: THomework;
    formValues?: TTimePeriodFormValues;
  }>({
    open: false,
    selectedTask: undefined,
  });
  const [selectedHomeworkList, setSelectedHomeworkList] = useState<{ [homeworkId: string]: TSelectedHomeworkList }>({});
  const [homeworkDetailModalState, setHomeworkDetailModalState] = useState<{ open: boolean; homework?: TTaskItemData }>(
    {
      open: false,
      homework: undefined,
    },
  );

  const isSeparateHomeworkList = SEPARATE_TYPE_HOMEWORK.includes(selectedTopic?.homeworkType);
  const allHomework = homework[selectedTopic?.id];
  const ownerHomework = homework[`${selectedTopic?.id}-${ETaskType.OWNER}`];
  const generalHomework = homework[`${selectedTopic?.id}-${ETaskType.GENERAL_TASK}`];
  const combinedHomeworkData = isSeparateHomeworkList
    ? [...(ownerHomework?.data ?? []), ...(generalHomework?.data ?? [])]
    : [];
  const currentHomeworkData = isSeparateHomeworkList ? combinedHomeworkData : allHomework?.data;

  const handleClickTopic = (item: THomeworkTopic) => {
    setSelectedTopic(item);
    setSearchKeywordHomework('');
  };

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    const destinationColumnId = destination?.droppableId;
    const droppedToAssignedColumn = destinationColumnId === EDragDropColumnId.ASSIGNED;

    if (!droppedToAssignedColumn) return;

    const selectedTask = currentHomeworkData?.find((item) => item.id === draggableId);

    setSetupScheduleModalState({
      open: true,
      selectedTask: selectedTask,
    });
  };

  const handleCloseTimePeriodModal = () => {
    setSetupScheduleModalState({ open: false, selectedTask: undefined });
  };

  const getTopicsFirstTime = async () => {
    const response = await dispatch(getHomeworkTopicsByTypeAction(DEFAULT_HOMEWORK_TOPIC_PARAMS));
    setSelectedTopic((response.payload as TGetHomeworkTopicsResponse).data?.[0]);
    dispatch(
      getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: EHomeworkType.QUESTIONNAIRES }),
    );
    dispatch(
      getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: EHomeworkType.WRITTEN_TASKS }),
    );
    dispatch(getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: EHomeworkType.VIDEOS }));
  };

  const handleSubmitTimePeriod = (values: TTimePeriodFormValues) => {
    const homeworkDetail = setupScheduleModalState.selectedTask;
    const formattedData: TSelectedHomeworkList = {
      formValues: values,
      homework: homeworkDetail,
      data: {
        id: homeworkDetail?.id ?? '',
        title: homeworkDetail?.title ?? '',
        assigned: true,
        repeat: !!values.repeatEvery,
        startDate: values.startDate,
        endDate: values.endDate,
        type: homeworkDetail?.type,
        videoUrl: homeworkDetail?.videoLink ?? '',
        description: homeworkDetail?.description,
        showPreviewImg: true,
        timezone: homeworkDetail?.timezone ?? '',
      },
    };
    setSelectedHomeworkList({
      ...selectedHomeworkList,
      [setupScheduleModalState.selectedTask?.id ?? '']: formattedData,
    });
  };

  const handleRemoveAssignedHomework = (item: TTaskItemData) => {
    const newSelectedHomeworkList = { ...selectedHomeworkList };

    delete newSelectedHomeworkList[item.id];
    setSelectedHomeworkList(newSelectedHomeworkList);
  };

  const loadMoreTasksByTopic = (nextPage: number, taskType?: EDragDropColumnId) => {
    const newParams = {
      ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
      page: nextPage,
      keyword: searchKeywordHomework || '',
      homeworkTopicId: selectedTopic?.id,
      ...(taskType && { isOwnTask: taskType === EDragDropColumnId.OWN }),
    };

    dispatch(loadMoreTasksByTopicAction(newParams));
  };

  const debounceSearch = useCallback(
    debounce((searchKey: string, topicId?: string) => {
      const newParams = {
        page: 1,
        size: DEFAULT_HOMEWORK_PAGE_SIZE,
        keyword: searchKey,
        homeworkTopicId: topicId ?? '',
      };

      dispatch(getTasksByTopicAction(newParams));
    }, 500),
    [],
  );

  const handleSearchHomework = (keyword: string) => {
    setSearchKeywordHomework(keyword);
    debounceSearch(keyword, selectedTopic?.id);
  };

  const handleClickHomework = (item: TTaskItemData) => {
    setHomeworkDetailModalState({ open: true, homework: item });
  };

  const handleCloseHomeworkDetailModal = () => {
    setHomeworkDetailModalState({ ...homeworkDetailModalState, open: false });
  };

  const handleAssign = async () => {
    const assignHomework = Object.entries(selectedHomeworkList).map(([key, values]) => {
      const data = {
        homeworkId: key,
        frequency: values.formValues.frequency,
        repeatEvery: values.formValues.repeatEvery,
        repeatDuration: values.formValues.repeatDuration,
        dayOfWeek: values.formValues.dayOfWeek,
        startDate: values.formValues.startDate.toISOString(),
        endType: {
          expiredDate: values.formValues.endDate?.toISOString(),
          afterTimes: Number(values.formValues.endAfter),
        },
        reminderAt: {
          time: dayjs(values.formValues.reminderTime).format('hh:mm'),
          period: dayjs(values.formValues.reminderTime).format('A'),
        },
        timezone: values.formValues.timezone,
      };

      if (data.endType.expiredDate) {
        return { ...data, endType: { expiredDate: data.endType.expiredDate } };
      } else {
        return { ...data, endType: { afterTimes: data.endType.afterTimes } };
      }
    });

    const bodyRequest: TAssignHomeworkRequest = {
      clientId: params?.clientId ?? '',
      listAssignHomework: assignHomework,
      timezone: getCurrentTimezone(),
    };

    const { payload: response } = await dispatch(assignHomeworkAction(bodyRequest));

    if ((response as TAssignHomeworkResponse)?.homeworkAssignIds?.length) {
      showSuccessToast('These homework tasks have been assigned to the client successfully!');
      onCancel();
      onAssignSuccess();
      isBlockNavigateRef.current = false;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showErrorToast((response as any).message);
  };

  useEffect(() => {
    if (isBlockNavigateRef) {
      isBlockNavigateRef.current = !!Object.keys(selectedHomeworkList).length;
    }
  }, [selectedHomeworkList]);

  useEffect(() => {
    if (selectedTopic?.id) {
      if (isSeparateHomeworkList) {
        dispatch(
          getTasksByTopicAction({
            ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
            isOwnTask: false,
            homeworkTopicId: selectedTopic.id,
          }),
        );

        dispatch(
          getTasksByTopicAction({
            ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
            isOwnTask: true,
            homeworkTopicId: selectedTopic.id,
          }),
        );

        return;
      }

      dispatch(
        getTasksByTopicAction({
          ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
          homeworkTopicId: selectedTopic.id,
        }),
      );
    }
  }, [selectedTopic]);

  useEffect(() => {
    getTopicsFirstTime();
  }, []);

  return (
    <div className="AssignHomework">
      <DragDropContext onDragEnd={handleDragEnd}>
        <AssignHomeworkTopic
          className="AssignHomework__topic"
          selectedTopic={selectedTopic}
          onClickTopic={handleClickTopic}
        />
        <HomeworkTasksColumn
          className="AssignHomework__tasks"
          selectedTopic={selectedTopic}
          searchValue={searchKeywordHomework}
          selectedHomeworkIds={Object.keys(selectedHomeworkList) ?? []}
          onLoadMore={loadMoreTasksByTopic}
          onSearchHomework={handleSearchHomework}
          onClickHomework={handleClickHomework}
        />
        <div className="AssignHomework__assigned">
          <Space size={10}>
            <BaseText type="title">All assigned homework tasks</BaseText>
            <BaseText inline className="AssignHomework__assigned-total">
              {Object.keys(selectedHomeworkList).length ?? 0}
            </BaseText>
          </Space>
          <DragDropTasksColumn
            items={Object.keys(selectedHomeworkList).map((key) => selectedHomeworkList[key].data) ?? []}
            type="drop"
            columnId={EDragDropColumnId.ASSIGNED}
            className="AssignHomework__assigned-list"
            onRemove={handleRemoveAssignedHomework}
            onClick={(item) => {
              setSetupScheduleModalState({
                open: true,
                selectedTask: selectedHomeworkList[item.id].homework,
                formValues: selectedHomeworkList[item.id].formValues,
              });
            }}
          />
          <div className="AssignHomework__assigned-actions">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" loading={loadingState[EHomeworkTopicsAction.ASSIGN_HOMEWORK]} onClick={handleAssign}>
              Assign
            </Button>
          </div>
        </div>
      </DragDropContext>

      <TimePeriod {...setupScheduleModalState} onClose={handleCloseTimePeriodModal} onSubmit={handleSubmitTimePeriod} />

      <HomeWorkDetail
        open={homeworkDetailModalState.open}
        name={selectedTopic?.name}
        title={homeworkDetailModalState.homework?.title ?? ''}
        description={homeworkDetailModalState.homework?.description ?? ''}
        videoUrl={homeworkDetailModalState.homework?.videoUrl ?? ''}
        reminderAt={homeworkDetailModalState.homework?.remindAtFormat}
        type={homeworkDetailModalState.homework?.type ?? EHomeworkType.ACTIVITIES}
        onClose={handleCloseHomeworkDetailModal}
      />
    </div>
  );
};

export default AssignHomework;
