import { Empty, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import { TaskItem } from 'src/containers/homework';
import { TTaskItemData } from 'src/interfaces/clients-interface';
import './AssignedTaskList.scss';
import { EProfileStatus } from 'src/variables/common';

interface IProps {
  items: TTaskItemData[];
  hasMore: boolean;
  clientStatus?: EProfileStatus;
  onRemove: (item: TTaskItemData) => void;
  onLoadMore: () => void;
  onClick: (item: TTaskItemData) => void;
}

const AssignedTaskList = ({ items, hasMore, clientStatus, onClick, onRemove, onLoadMore }: IProps) => {
  return (
    <div className="AssignedTaskList" id="assigned-infinity-scroll">
      {!items.length ? (
        <Empty description="No assigned homework tasks" />
      ) : (
        <InfiniteScroll
          scrollableTarget="assigned-infinity-scroll"
          dataLength={items.length}
          hasMore={hasMore || false}
          next={onLoadMore}
          loader={<Skeleton.Input active style={{ height: 20, marginTop: 16 }} />}
        >
          {items.map((item) => (
            <TaskItem
              data={item}
              key={item.id}
              className="AssignedTaskList__item"
              onRemove={clientStatus !== EProfileStatus.INACTIVE ? onRemove : undefined}
              onClick={onClick}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default AssignedTaskList;
