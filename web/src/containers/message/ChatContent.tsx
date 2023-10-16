import './ChatContent.scss';
import { BaseText } from 'src/components/typography';
import SingleMessage from './SingleMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoaderIcon } from 'src/assets/icons';
import { TFile } from 'src/interfaces/common-interface';
import { convertMessageByTimeLine } from './util';
import { TDownloadFileMessageRequest, TRoomData } from 'src/interfaces/chat-interface';

interface IProps {
  room: TRoomData;
  onLoadMore: () => void;
  onPreviewFiles: (files: TFile[], fileIndex?: number) => void;
  onDownloadFile: (params: TDownloadFileMessageRequest, fileName?: string) => void;
}

const ChatContent = ({ room, onLoadMore, onPreviewFiles, onDownloadFile }: IProps) => {
  if (!room)
    return (
      <div className="ChatContent empty">
        <BaseText type="body1" textAlign="center">
          Select a conversation
        </BaseText>
      </div>
    );

  if (!room?.messages?.data?.length)
    return (
      <div className="ChatContent empty">
        <BaseText type="body1" textAlign="center">
          Start a new conversation
        </BaseText>
      </div>
    );

  const messages = convertMessageByTimeLine(room.messages.data);

  return (
    <div className="ChatContent">
      <div className="ChatContent__list" id="ChatContent History Scroll">
        <InfiniteScroll
          dataLength={messages.length}
          hasMore={room.messages?.currentPage < room.messages?.totalPage}
          style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden' }}
          loader={
            <div className="ChatContent__loadMore">
              <LoaderIcon className="spin-around" />
            </div>
          }
          inverse
          next={onLoadMore}
          scrollableTarget="ChatContent History Scroll"
        >
          {messages.map((item, index) => {
            const nextMessage = messages[index + 1];

            return (
              <SingleMessage
                data={item}
                nextMessage={nextMessage}
                key={item.id}
                onPreviewFiles={onPreviewFiles}
                onDownloadFile={onDownloadFile}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatContent;
