import {
  TActivityData,
  TGetAssignedHomeworkHistoriesParams,
  TGetAssignedHomeworkHistoriesResponse,
  TTaskItemData,
} from 'src/interfaces/clients-interface';
import HomeworkActivityItem from './HomeworkActivityItem';
import './HomeworkDetailsHistoryTab.scss';
import Pagination from 'src/components/pagination';
import { Empty, Skeleton } from 'antd';

interface IProps {
  loading: boolean;
  params: TGetAssignedHomeworkHistoriesParams;
  selectedTask: TTaskItemData;
  homeworkHistoryDetails: TGetAssignedHomeworkHistoriesResponse;
  onChangePage: (page: number) => void;
  onViewDetailsHomeworkHistory: (data: TActivityData) => void;
}

const HomeworkDetailsHistoryTab = ({
  loading,
  params,
  homeworkHistoryDetails,
  selectedTask,
  onChangePage,
  onViewDetailsHomeworkHistory,
}: IProps) => {
  const formattedData: TActivityData[] = homeworkHistoryDetails.data.map((item) => ({
    id: item.id,
    rate: item.rate,
    comment: item.feedback,
    resultText: item.clientResponse?.responseText,
    totalFiles: item.clientAnswerImages?.length,
    createdAt: item.createdAt,
    rejectText: item.rejectReason,
    homeworkType: selectedTask.type,
    filesUrls: item.clientAnswerImages,
    status: item.status,
    specialResult: item.result ?? undefined,
  }));

  return (
    <div className="HomeworkDetailsHistoryTab">
      <div className="HomeworkDetailsHistoryTab__list">
        {loading ? (
          <Skeleton />
        ) : !formattedData?.length ? (
          <Empty description="No homework history" />
        ) : (
          formattedData?.map((item) => (
            <HomeworkActivityItem data={item} key={item.createdAt} onClickViewDetails={onViewDetailsHomeworkHistory} />
          ))
        )}
      </div>

      {homeworkHistoryDetails.totalPage > 1 && (
        <Pagination {...homeworkHistoryDetails} currentPage={params.page} onChangePage={onChangePage} />
      )}
    </div>
  );
};

export default HomeworkDetailsHistoryTab;
