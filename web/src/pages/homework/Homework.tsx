import { Empty, Spin } from 'antd';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NewHomeworkIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { CommonContent, Container } from 'src/components/containers';
import { SearchInput } from 'src/components/input';
import { TabsHeader } from 'src/components/tabs';
import { BaseText } from 'src/components/typography';
import { AssignHomeworkTopic } from 'src/containers/homework';
import {
  EHomeworkType,
  TCreateHomeworkParams,
  TGetTasksByTopicParams,
  THomework,
} from 'src/interfaces/clients-interface';
import { TGetHomeworkTopicsParams, TGetHomeworkTopicsResponse, THomeworkTopic } from 'src/interfaces/homework-topics';
import { TRootState, useAppDispatch } from 'src/stores';
import { EHomeworkTopicsAction, getTasksByTopicAction } from 'src/stores/homework-topics';
import {
  createHomeworkAction,
  createHomeworkTopicsAction,
  getHomeworkTopicsByTypeAction,
  loadMoreTasksByTopicAction,
  updateHomeworkByIdAction,
} from 'src/stores/homework-topics/actions';
import { DEFAULT_GET_LIST_PARAMS } from 'src/variables/common';
import { EHomeworkStatus, ESortType, ETaskType } from 'src/variables/enum-variables';
import './Homework.scss';
import HomeWorkDetail from './components/homework-detail/HomeWorkDetail';
import HomeworkList from './components/homework-list/HomeworkList';
import NewAndEditHomeworkModal from './components/new-edit-homework-modal/NewAndEditHomeworkModal';
import { TNewHomeworkFormValues } from './components/new-edit-homework-modal/new-edit-homework-types';
import NewTopicModal from './components/new-topic-modal/NewTopicModal';
import { TNewTopicValues } from './components/new-topic-modal/new-topic-types';

const DEFAULT_TOPIC_PAGE_SIZE = 1000;
const DEFAULT_HOMEWORK_PAGE_SIZE = 14;

const DEFAULT_HOMEWORK_TOPIC_PARAMS: TGetHomeworkTopicsParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  sortBy: 'name',
  sortType: ESortType.ASC,
  size: DEFAULT_TOPIC_PAGE_SIZE,
  homeworkType: EHomeworkType.ACTIVITIES,
};

const HOMEWORK_TABS = [
  {
    key: ETaskType.GENERAL_TASK,
    label: 'General tasks',
  },
  {
    key: ETaskType.OWNER,
    label: 'My own tasks',
  },
];

const DEFAULT_HOMEWORK_BY_TOPIC_PARAMS: TGetTasksByTopicParams = {
  ...DEFAULT_GET_LIST_PARAMS,
  sortBy: 'title',
  size: DEFAULT_HOMEWORK_PAGE_SIZE,
  sortType: ESortType.ASC,
  homeworkTopicId: '',
};

const Homework = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>(ETaskType.GENERAL_TASK);
  const [searchKey, setSearchKey] = useState<string>('');

  const { activityTopics, homework, searching } = useSelector((state: TRootState) => ({
    activityTopics: state.homeworkTopics.activityTopics,
    homework: state.homeworkTopics.homework,
    searching: state.loading[EHomeworkTopicsAction.GET_TASKS_BY_TOPIC],
  }));

  const [selectedTopic, setSelectedTopic] = useState<THomeworkTopic>(activityTopics.data?.[0]);
  const currentHomework = homework[`${selectedTopic?.id}-${activeTab}`];
  const [homeworkDetailModalState, setHomeworkDetailModalState] = useState<{ open: boolean; homework?: THomework }>({
    open: false,
    homework: undefined,
  });
  const [loadingFirstTime, setLoadingFirstTime] = useState<boolean>(true);

  const [addNewTopicModalInfo, setAddNewTopicModalInfo] = useState<{
    isOpen: boolean;
    type:
      | EHomeworkType.ACTIVITIES
      | EHomeworkType.VIDEOS
      | EHomeworkType.WRITTEN_TASKS
      | EHomeworkType.QUESTIONNAIRES
      | null;
  }>({
    isOpen: false,
    type: null,
  });

  const [newAndEditHomeworkModalInfo, setNewAndEditHomeworkModalInfo] = useState<{
    isOpen: boolean;
    homework: THomework | null;
  }>({
    isOpen: false,
    homework: null,
  });

  const getTopicsFirstTime = async () => {
    const { payload } = await dispatch(getHomeworkTopicsByTypeAction(DEFAULT_HOMEWORK_TOPIC_PARAMS));

    const firstTopic = (payload as TGetHomeworkTopicsResponse).data?.[0];
    firstTopic ? setSelectedTopic((payload as TGetHomeworkTopicsResponse).data?.[0]) : setLoadingFirstTime(false);

    dispatch(
      getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: EHomeworkType.QUESTIONNAIRES }),
    );
    dispatch(
      getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: EHomeworkType.WRITTEN_TASKS }),
    );
    dispatch(getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: EHomeworkType.VIDEOS }));
  };

  const handleClickTopic = (item: THomeworkTopic) => {
    setSelectedTopic(item);
    if (![EHomeworkType.ACTIVITIES, EHomeworkType.WRITTEN_TASKS].includes(item.homeworkType)) {
      setActiveTab(ETaskType.GENERAL_TASK);
    }
  };

  const onClickNewTopic = (homeworkType: EHomeworkType) => {
    setAddNewTopicModalInfo({
      isOpen: true,
      type: homeworkType,
    });
  };

  const onSaveNewTopic = async (values: TNewTopicValues) => {
    if (addNewTopicModalInfo.type) {
      const { topicName } = values;
      await dispatch(
        createHomeworkTopicsAction({
          name: topicName,
          homeworkType: addNewTopicModalInfo.type,
        }),
      );
      dispatch(
        getHomeworkTopicsByTypeAction({ ...DEFAULT_HOMEWORK_TOPIC_PARAMS, homeworkType: addNewTopicModalInfo.type }),
      );
    }
  };

  const onAddNewHomework = async (values: TNewHomeworkFormValues) => {
    const { description, homeworkTitle, homeworkType, reminderTime, reminderTimePeriod, topic, timezone } = values;

    if (reminderTimePeriod && homeworkType && reminderTime) {
      const baseParams: TCreateHomeworkParams = {
        type: homeworkType,
        homeworkTopicId: topic,
        title: homeworkTitle,
        description: description,
        enableRemind: true,
        remindAtHour: Number(reminderTime),
        status: EHomeworkStatus.ACTIVE,
        timezone,
      };
      if (newAndEditHomeworkModalInfo.homework) {
        await dispatch(
          updateHomeworkByIdAction({
            ...baseParams,
            id: newAndEditHomeworkModalInfo.homework.id,
          }),
        );
      } else {
        await dispatch(createHomeworkAction(baseParams));
      }
      if (selectedTopic?.id) {
        dispatch(
          getTasksByTopicAction({
            ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
            homeworkTopicId: selectedTopic.id,
            type: selectedTopic.homeworkType,
            isOwnTask: activeTab === ETaskType.OWNER,
          }),
        );
      }
    }
  };

  const onCloseNewTopicModal = () => {
    setAddNewTopicModalInfo({
      isOpen: false,
      type: null,
    });
  };

  const getFirstPageListHomework = useCallback(
    async (keyword: string) => {
      if (selectedTopic?.id) {
        await dispatch(
          getTasksByTopicAction({
            ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
            keyword: keyword,
            homeworkTopicId: selectedTopic.id,
            type: selectedTopic.homeworkType,
            isOwnTask: activeTab === ETaskType.OWNER,
          }),
        );
        loadingFirstTime && setLoadingFirstTime(false); // loading done after calling homework list by topic
      }
    },
    [activeTab, selectedTopic],
  );

  const debounceSearch = useCallback(
    debounce((keyword: string) => {
      getFirstPageListHomework(keyword);
    }, 1000),
    [getFirstPageListHomework],
  );

  const onSearch = (keyword: string) => {
    setSearchKey(keyword);
    debounceSearch(keyword);
  };

  const loadMoreTasksByTopic = () => {
    if (currentHomework) {
      const { currentPage } = currentHomework;
      const newParams = {
        ...DEFAULT_HOMEWORK_BY_TOPIC_PARAMS,
        page: currentPage + 1,
        keyword: searchKey,
        homeworkTopicId: selectedTopic?.id,
        type: selectedTopic.homeworkType,
        isOwnTask: activeTab === ETaskType.OWNER,
      };

      dispatch(loadMoreTasksByTopicAction(newParams));
    }
  };

  const handleClickTaskRow = (item: THomework) => {
    setHomeworkDetailModalState({ open: true, homework: item });
  };

  const handleCloseHomeworkDetailModal = () => {
    setHomeworkDetailModalState({ ...homeworkDetailModalState, open: false });
  };

  useEffect(() => {
    getFirstPageListHomework(searchKey);
  }, [selectedTopic, activeTab]);

  useEffect(() => {
    getTopicsFirstTime();
  }, []);

  return (
    <>
      <Container className="HomeworkPage">
        <CommonContent
          title="Homework"
          action={
            <Button
              icon={<NewHomeworkIcon />}
              className="HomeworkPage__new-homework-btn"
              size="small"
              noBorder
              onClick={() => {
                setNewAndEditHomeworkModalInfo({
                  isOpen: true,
                  homework: null,
                });
              }}
            >
              New homework
            </Button>
          }
        >
          <div className="HomeworkPage__left-side-bar">
            <AssignHomeworkTopic
              className="HomeworkPage__topic"
              selectedTopic={selectedTopic}
              onClickTopic={handleClickTopic}
              onClickNewTopic={onClickNewTopic}
              haveNewTopicButton
            />
          </div>
          {loadingFirstTime ? (
            <Spin className="HomeworkPage__loading" />
          ) : selectedTopic ? (
            <div className="HomeworkPage__right-side-bar">
              <BaseText type="title" className="HomeworkPage__title">
                {selectedTopic?.name}
              </BaseText>
              {(selectedTopic?.homeworkType === EHomeworkType.ACTIVITIES ||
                selectedTopic?.homeworkType === EHomeworkType.WRITTEN_TASKS) && (
                <TabsHeader
                  items={HOMEWORK_TABS}
                  activeKey={activeTab}
                  onChangeTab={(key) => {
                    setActiveTab(key);
                  }}
                  className="HomeworkPage__tabs-header"
                />
              )}

              <SearchInput
                className="HomeworkPage__search-bar"
                placeHolder="Search"
                value={searchKey}
                onChange={onSearch}
              />
              <Spin spinning={searching} wrapperClassName="HomeworkPage__list">
                <HomeworkList
                  listHomework={currentHomework?.data || []}
                  hasMore={currentHomework?.currentPage < currentHomework?.totalPage}
                  hasRowEdit={activeTab === ETaskType.OWNER}
                  onLoadMore={loadMoreTasksByTopic}
                  onClickEdit={(item) => {
                    setNewAndEditHomeworkModalInfo({
                      isOpen: true,
                      homework: item,
                    });
                  }}
                  handleClickTaskRow={(item) => {
                    handleClickTaskRow(item);
                  }}
                />
              </Spin>
            </div>
          ) : (
            <Empty className="HomeworkPage__emptyHomework" />
          )}
        </CommonContent>
      </Container>
      <NewTopicModal
        open={addNewTopicModalInfo.isOpen}
        onCancel={onCloseNewTopicModal}
        onClose={onCloseNewTopicModal}
        onSave={onSaveNewTopic}
      />
      <NewAndEditHomeworkModal
        onSubmit={onAddNewHomework}
        onClose={() =>
          setNewAndEditHomeworkModalInfo({
            isOpen: false,
            homework: null,
          })
        }
        open={newAndEditHomeworkModalInfo.isOpen}
        isEdit={!!newAndEditHomeworkModalInfo.homework}
        defaultValue={
          newAndEditHomeworkModalInfo.homework
            ? {
                description: newAndEditHomeworkModalInfo.homework?.description,
                homeworkTitle: newAndEditHomeworkModalInfo.homework?.title,
                homeworkType: newAndEditHomeworkModalInfo.homework?.type,
                topic: newAndEditHomeworkModalInfo.homework?.homeworkTopicId,
                reminderTime: newAndEditHomeworkModalInfo.homework?.remindAtHour,
                timezone: newAndEditHomeworkModalInfo.homework?.timezone,
              }
            : undefined
        }
      />
      <HomeWorkDetail
        open={homeworkDetailModalState.open}
        name={selectedTopic?.name}
        title={homeworkDetailModalState.homework?.title ?? ''}
        description={homeworkDetailModalState.homework?.description ?? ''}
        videoUrl={homeworkDetailModalState.homework?.videoLink ?? ''}
        reminderAt={
          homeworkDetailModalState.homework?.reminderAtFormat
            ? homeworkDetailModalState.homework?.reminderAtFormat
            : undefined
        }
        type={homeworkDetailModalState.homework?.type ?? EHomeworkType.ACTIVITIES}
        onCancel={handleCloseHomeworkDetailModal}
        onClose={handleCloseHomeworkDetailModal}
      />
    </>
  );
};

export default Homework;
