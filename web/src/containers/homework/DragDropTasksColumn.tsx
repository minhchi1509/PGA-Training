import { Skeleton, Empty } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import InfiniteScroll from 'react-infinite-scroll-component';

import TaskItem from './TaskItem';
import { TTaskItemData } from 'src/interfaces/clients-interface';
import { StrictModeDroppable } from 'src/components/drag-and-drop';

interface IProps {
  columnId: string;
  type?: 'drag' | 'drop';
  selectedItemIds?: string[];
  items: TTaskItemData[];
  className?: string;
  itemClassName?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRemove?: (item: TTaskItemData) => void;
  onClick?: (item: TTaskItemData) => void;
}

const DragDropTasksColumn = ({
  columnId,
  type = 'drag',
  hasMore,
  className,
  itemClassName,
  items,
  selectedItemIds,
  onClick,
  onRemove,
  onLoadMore,
}: IProps) => {
  const isDraggableColumn = type === 'drag';

  const handleLoadMore = () => {
    onLoadMore?.();
  };

  return (
    <StrictModeDroppable droppableId={columnId}>
      {({ droppableProps, placeholder, innerRef }) => (
        <div className={className ?? ''} id={columnId} {...droppableProps} ref={innerRef}>
          {isDraggableColumn && (
            <InfiniteScroll
              scrollableTarget={columnId}
              dataLength={items.length}
              hasMore={hasMore || false}
              next={handleLoadMore}
              loader={<Skeleton.Input active style={{ height: 20, marginTop: 16 }} />}
            >
              {!items.length ? (
                <Empty />
              ) : (
                items.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={selectedItemIds?.includes(item.id)}
                  >
                    {(provided, snapshot) => (
                      <TaskItem
                        className={itemClassName ?? ''}
                        data={item}
                        draggable
                        disabledDrag={selectedItemIds?.includes(item.id)}
                        provided={provided}
                        snapshot={snapshot}
                        key={item.id}
                        noBorder
                        onClick={onClick}
                      />
                    )}
                  </Draggable>
                ))
              )}
            </InfiniteScroll>
          )}
          {!isDraggableColumn &&
            items.map((item) => (
              <TaskItem
                className={itemClassName ?? ''}
                key={item.id}
                data={item}
                noBorder
                canDelete={true}
                onRemove={onRemove}
                onClick={onClick}
              />
            ))}
          {placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default DragDropTasksColumn;
