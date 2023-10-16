import { Modal, Skeleton, Spin } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import {
  EHomeworkType,
  TActivityData,
  TGetHomeworkResultParams,
  THomework,
  TTaskItemData,
} from 'src/interfaces/clients-interface';
import { TFile } from 'src/interfaces/common-interface';
import { TRootState, useAppDispatch } from 'src/stores';
import { EClientsAction, getHomeworkResultAction } from 'src/stores/clients';
import ActivityCard from './ActivityCard';
import HomeworkActivityItem from './HomeworkActivityItem';
import HomeworkInfo from './HomeworkInfo';
import QuestionResults from './QuestionResults';
import './HomeworkHistoryDetailsModal.scss';
import { downloadHomeworkFile } from 'src/utils/common-utils';
import { EHomeworkResultStatus } from 'src/variables/enum-variables';

interface IProps {
  open: boolean;
  data?: TActivityData;
  historyData?: TTaskItemData;
  onPreviewFiles?: (files: TFile[]) => void;
  onClose: () => void;
}

const HomeworkHistoryDetailsModal = ({ open, data, historyData, onClose, onPreviewFiles }: IProps) => {
  const dispatch = useAppDispatch();
  const isFromAssigned = !!historyData;

  const { homeworkDetails, homeworkResult, loading, downloading } = useSelector((state: TRootState) => ({
    homeworkDetails: state.clients.homeworkDetail,
    homeworkResult: state.clients.homeworkResult,
    loading: state.loading[EClientsAction.GET_HOMEWORK_RESULT],
    downloading: state.loading[EClientsAction.DOWNLOAD_HOMEWORK_FILE],
  }));

  const homework = isFromAssigned ? homeworkResult?.homework : homeworkDetails?.homework;
  const formattedActivityData: TActivityData | undefined = homeworkResult && {
    id: homeworkResult.id,
    resultText: homeworkResult.clientResponse?.responseText,
    comment: homeworkResult.feedback,
    createdAt: homeworkResult.createdAt,
    filesUrls: homeworkResult.clientAnswerImages,
    homeworkType: homeworkResult.homework?.type,
    rate: homeworkResult.rate,
    rejectText: homeworkResult.rejectReason,
    status: homeworkResult.status,
  };
  const activityData = data ?? formattedActivityData;
  const isSkipped = activityData?.status === EHomeworkResultStatus.SKIPPED;

  const getHomeworkResult = (params: TGetHomeworkResultParams) => {
    dispatch(getHomeworkResultAction(params));
  };

  const handleDownloadFile = (attachmentId: string, fileName?: string) => {
    const homeworkAssignId = isFromAssigned ? historyData.homeworkAssignId : homeworkDetails?.id;

    downloadHomeworkFile(
      {
        attachmentId,
        homeworkAssignId: homeworkAssignId ?? '',
        homeworkResultId: activityData?.id ?? '',
        fileName,
      },
      dispatch,
    );
  };

  useEffect(() => {
    let params;
    if (historyData) {
      params = {
        id: historyData.homeworkAssignId ?? '',
        homeworkHistoryId: historyData?.id ?? '',
      };
    }

    if (data) {
      params = {
        id: homeworkDetails?.id ?? '',
        homeworkHistoryId: data?.id ?? '',
      };
    }

    params && getHomeworkResult(params);
  }, [historyData, data]);

  return (
    <Modal
      className="HomeworkHistoryDetailsModal"
      open={open}
      width={1020}
      closable={false}
      footer={null}
      onCancel={onClose}
    >
      {loading ? (
        <>
          <Skeleton />
          <center>
            <Spin />
          </center>
        </>
      ) : (
        <>
          <BaseText type="title" textAlign="center" className="HomeworkHistoryDetailsModal__title">
            {homework?.title}
          </BaseText>
          {isFromAssigned && <HomeworkInfo homework={homework as THomework} />}

          {activityData && (
            <HomeworkActivityItem data={activityData} isCard={false}>
              {homework?.type === EHomeworkType.QUESTIONNAIRES && !isSkipped && (
                <QuestionResults homework={homeworkResult} />
              )}
              {homework?.type !== EHomeworkType.QUESTIONNAIRES && activityData.resultText && !isSkipped && (
                <ActivityCard
                  data={activityData}
                  type="result"
                  className="HomeworkHistoryDetailsModal__result"
                  isCard={false}
                  downloading={downloading}
                  onPreviewFiles={onPreviewFiles}
                  onDownload={handleDownloadFile}
                />
              )}
              {(activityData.comment || activityData.rejectText || activityData.rate) && (
                <ActivityCard
                  type="comment"
                  isCard={false}
                  className="HomeworkHistoryDetailsModal__comment"
                  data={{
                    comment: activityData.comment,
                    rate: activityData.rate,
                    rejectText: activityData.rejectText,
                    title: 'Client’s comment',
                    id: 'fake Id',
                  }}
                />
              )}
            </HomeworkActivityItem>
          )}
        </>
      )}
      <Button type="primary" className="HomeworkHistoryDetailsModal__action" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
};

export default HomeworkHistoryDetailsModal;
