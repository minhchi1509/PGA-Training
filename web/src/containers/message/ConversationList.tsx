import { Empty, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import { LoaderIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { TConversation } from 'src/interfaces/messages-interface';
import ConversationItem from './ConversationItem';
import './ConversationList.scss';

interface IProps {
  id: string;
  className?: string;
  width?: number;
  height?: number;
  hasMore: boolean;
  isSearchAction?: boolean;
  searching?: boolean;
  data?: TConversation[];
  label?: string;
  dataLength: number;
  emptyMessage?: string;
  customScroll?: boolean;
  loadingMore?: boolean;
  onLoadMore: () => void;
  onClickItem?: (data: TConversation) => void;
}

const ConversationList = ({
  id,
  data,
  className,
  width,
  height,
  hasMore,
  label,
  emptyMessage,
  searching,
  dataLength,
  isSearchAction,
  customScroll,
  loadingMore,
  onLoadMore,
  onClickItem,
}: IProps) => {
  const handleLoadMore = () => {
    if (customScroll) return;

    onLoadMore();
  };

  const handleScroll = () => {
    const scrollableElement = document.getElementById(id);
    if (customScroll && scrollableElement) {
      const isScrollToBottom =
        scrollableElement?.scrollHeight - scrollableElement?.scrollTop === scrollableElement?.clientHeight;
      const isLoadMore = !loadingMore && isScrollToBottom && hasMore;

      isLoadMore && onLoadMore();
    }
  };

  return (
    <div
      className={`ConversationList ${className ?? ''}`}
      id={id}
      style={{ width, maxHeight: height }}
      key={id}
      onScroll={handleScroll}
    >
      <InfiniteScroll
        scrollableTarget={id}
        hasMore={hasMore}
        dataLength={dataLength}
        style={{ overflow: 'hidden' }}
        loader={
          !searching ? (
            <div className={`ConversationList__loading ${customScroll ? 'custom' : ''}`}>
              <LoaderIcon className="spin-around" width={24} height={24} />
            </div>
          ) : null
        }
        next={handleLoadMore}
      >
        <>
          {label && (
            <BaseText type="subHeading" className="ConversationList-searchText">
              {label}
            </BaseText>
          )}
          {searching && <Spin spinning className="ConversationList__searching" />}
          {!searching &&
            (!data?.length ? (
              <Empty description={emptyMessage} className="ConversationList-empty" />
            ) : (
              data.map((item) => (
                <ConversationItem isSearched={isSearchAction} key={item.receiveId} data={item} onClick={onClickItem} />
              ))
            ))}
        </>
      </InfiniteScroll>
    </div>
  );
};

export default ConversationList;
