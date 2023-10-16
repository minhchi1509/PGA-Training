import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Empty, Spin } from 'antd';
import ReactPlayer from 'react-player';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CommonContent, Container } from 'src/components/containers';
import {
  TGetPsychoeducationListByTopicParams,
  TGetPsychoeducationTopicsResponse,
  TPsychoEduTopic,
} from 'src/interfaces/psychoeducation-interface';
import { TRootState, useAppDispatch } from 'src/stores';
import {
  EPsychoeducationActions,
  getDetailsPsychoeducationAction,
  getPsychoeducationListByTopicAction,
  getPsychoeducationTopicsAction,
  resetPsychoeducationDetails,
} from 'src/stores/psychoeducation';
import { DEFAULT_GET_LIST_PARAMS } from 'src/variables/common';
import PsychoeducationItem from './components/PsychoeducationItem';
import PsychoeducationTopicList from './components/PsychoeducationTopicList';
import { loadMorePsychoeducationListByTopicAction } from 'src/stores/psychoeducation/actions';
import { ChevronLeftIcon, LoaderIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { EUserType } from 'src/variables/enum-variables';
import { RoutePaths } from 'src/routes/routes-constants';
import './PsychoeducationPage.scss';

const DEFAULT_GET_PSYCHOEDUCATION_LIST_PARAMS = {
  ...DEFAULT_GET_LIST_PARAMS,
  size: 15,
  psychoeducationTopicId: '',
};

const OWNER_LIST = [EUserType.CLINIC_OWNER, EUserType.OWNER];

const PsychoeducationPage = () => {
  const dispatch = useAppDispatch();

  const { psychoeducationTopics, loadingTopics, psychoeducationList, psychoeducationDetails, profile } = useSelector(
    (state: TRootState) => ({
      psychoeducationTopics: state.psychoeducation.topics.data,
      loadingTopics: state.loading[EPsychoeducationActions.GET_PSYCHOEDUCATION_TOPICS],
      psychoeducationList: state.psychoeducation.psychoeducationList,
      psychoeducationDetails: state.psychoeducation.psychoeducationDetails,
      profile: state.user.profile,
    }),
  );
  const [selectedTopic, setSelectedTopic] = useState<TPsychoEduTopic>();
  const [loadingPsychoeducationList, setLoadingPsychoeducationList] = useState(true);
  const isExistedPsychoeducationDetails = !!psychoeducationDetails;

  const handleClickLesson = (id: string) => {
    dispatch(getDetailsPsychoeducationAction(id));
  };

  const handleResetPsychoeducationDetails = () => {
    dispatch(resetPsychoeducationDetails());
  };

  const handleChangeTopic = async (topic: TPsychoEduTopic) => {
    if (topic.id === selectedTopic?.id) return;
    handleResetPsychoeducationDetails();
    setLoadingPsychoeducationList(true);
    const newParams: TGetPsychoeducationListByTopicParams = {
      ...DEFAULT_GET_PSYCHOEDUCATION_LIST_PARAMS,
      psychoeducationTopicId: topic.id,
    };

    setSelectedTopic(topic);
    await dispatch(getPsychoeducationListByTopicAction(newParams));
    setLoadingPsychoeducationList(false);
  };

  const handleLoadMorePsychoeducationList = () => {
    const nextPage = psychoeducationList.currentPage + 1;
    const newParams: TGetPsychoeducationListByTopicParams = {
      ...DEFAULT_GET_PSYCHOEDUCATION_LIST_PARAMS,
      page: nextPage,
      psychoeducationTopicId: selectedTopic?.id ?? '',
    };
    dispatch(loadMorePsychoeducationListByTopicAction(newParams));
  };

  const getPsychoeducationTopics = useCallback(async () => {
    const { payload: response } = await dispatch(getPsychoeducationTopicsAction());

    const firstTopic = (response as TGetPsychoeducationTopicsResponse).data[0];
    firstTopic && handleChangeTopic(firstTopic);
  }, [dispatch]);

  useEffect(() => {
    getPsychoeducationTopics();

    return () => {
      handleResetPsychoeducationDetails();
    };
  }, []);

  if (OWNER_LIST.includes(profile?.role as EUserType)) return <Navigate to={RoutePaths.HOME} />;

  return (
    <Container className="PsychoeducationPage">
      <CommonContent title="Psychoeducation">
        <div className="PsychoeducationPage__topics">
          <PsychoeducationTopicList
            loading={loadingTopics}
            selectedTopic={selectedTopic}
            topics={psychoeducationTopics}
            onClickTopic={handleChangeTopic}
          />
        </div>
        <div className="PsychoeducationPage__lessons">
          <Spin spinning={loadingPsychoeducationList}>
            <div className="PsychoeducationPage__lessons-header">
              {isExistedPsychoeducationDetails && (
                <ChevronLeftIcon
                  className="PsychoeducationPage__lessons-header-icon"
                  onClick={handleResetPsychoeducationDetails}
                />
              )}
              <BaseText type="title">
                {isExistedPsychoeducationDetails ? psychoeducationDetails.title : selectedTopic?.name}
              </BaseText>
            </div>
            {isExistedPsychoeducationDetails && (
              <div className="PsychoeducationPage__lessons-details custom-scrollbar">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: psychoeducationDetails.content }} />
                {psychoeducationDetails?.videoLink && (
                  <div className="PsychoeducationPage__lessons-details-video">
                    <ReactPlayer
                      controls
                      width={655}
                      height={460}
                      url={psychoeducationDetails?.videoLink}
                      style={{ borderRadius: 8, overflow: 'hidden', marginTop: 20 }}
                    />
                  </div>
                )}
              </div>
            )}
            {!isExistedPsychoeducationDetails &&
              (!psychoeducationList.data.length ? (
                <Empty description="No psychoeducation found" className="PsychoeducationPage__lessons-empty" />
              ) : (
                <div
                  className="PsychoeducationPage__lessons-list custom-scrollbar"
                  id="PsychoeducationPage__listScroll"
                >
                  <InfiniteScroll
                    loader={
                      <div className="PsychoeducationPage__lessons-loader">
                        <LoaderIcon className="spin-around" width={24} height={24} />
                      </div>
                    }
                    dataLength={psychoeducationList.data.length}
                    hasMore={psychoeducationList.currentPage < psychoeducationList.totalPage}
                    next={handleLoadMorePsychoeducationList}
                    scrollableTarget="PsychoeducationPage__listScroll"
                    style={{ overflow: 'hidden' }}
                  >
                    {psychoeducationList.data.map((item) => (
                      <PsychoeducationItem key={item.id} data={item} onClick={() => handleClickLesson(item.id)} />
                    ))}
                  </InfiniteScroll>
                </div>
              ))}
          </Spin>
        </div>
      </CommonContent>
    </Container>
  );
};

export default PsychoeducationPage;
