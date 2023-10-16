import { List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EHomeworkType, THomework } from 'src/interfaces/clients-interface';
import HomeworkTaskRow from '../homework-task-row/HomeworkTaskRow';
import './HomeworkList.scss';
import HomeworkVideoRow from '../homework-video-row/HomeworkVideoRow';

interface IHomeworkListProps {
  listHomework: THomework[];
  hasMore: boolean;
  hasRowEdit: boolean;
  onLoadMore: () => void;
  onClickEdit?: (item: THomework) => void;
  handleClickTaskRow: (item: THomework) => void;
}

const HomeworkList = ({
  listHomework,
  hasMore,
  hasRowEdit,
  onLoadMore,
  onClickEdit,
  handleClickTaskRow,
}: IHomeworkListProps) => {
  return (
    <div className="HomeworkList has-border" id="scrollable-div">
      <InfiniteScroll
        dataLength={listHomework.length}
        hasMore={hasMore}
        next={onLoadMore}
        scrollableTarget="scrollable-div"
        loader={<Skeleton.Input active style={{ height: 20, marginTop: 16, width: '100%' }} />}
      >
        <List
          dataSource={listHomework}
          renderItem={(item) => {
            if (item.type === EHomeworkType.VIDEOS) {
              return (
                <HomeworkVideoRow
                  description={item.description}
                  title={item.title}
                  video={item.videoLink}
                  handleClickVideoRow={() => {
                    handleClickTaskRow(item);
                  }}
                />
              );
            } else {
              return (
                <HomeworkTaskRow
                  text={item.title}
                  type={item.type}
                  hasEditIcon={
                    hasRowEdit && (item.type === EHomeworkType.ACTIVITIES || item.type === EHomeworkType.WRITTEN_TASKS)
                  }
                  onEdit={() => (onClickEdit ? onClickEdit(item) : undefined)}
                  handleClickTaskRow={() => {
                    handleClickTaskRow(item);
                  }}
                />
              );
            }
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default HomeworkList;
