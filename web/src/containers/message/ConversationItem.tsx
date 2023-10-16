import { useSelector } from 'react-redux';

import Avatar from 'src/components/avatar';
import { BaseText } from 'src/components/typography';
import { TConversation } from 'src/interfaces/messages-interface';
import { TRootState } from 'src/stores';
import { formatConversationTime, truncateString } from 'src/utils/common-utils';
import './ConversationItem.scss';

interface IProps {
  isSearched?: boolean;
  data: TConversation;
  onClick?: (data: TConversation) => void;
}

const ConversationItem = ({ isSearched, data, onClick }: IProps) => {
  const { rooms, currentRoomId } = useSelector((state: TRootState) => ({
    rooms: state.chat.rooms,
    currentRoomId: state.chat.currentRoomId,
  }));
  const currentRoom = rooms[currentRoomId];
  const isSelected = currentRoom?.partnerProfile?.id === data.receiveId;

  const handleClick = () => {
    onClick?.(data);
  };

  return (
    <div
      className={`ConversationItem ${!data.read ? 'unRead' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="ConversationItem__info">
        <Avatar src={data.avatar} />
        <div className="ConversationItem__info-details">
          <BaseText type="body1">{data.name}</BaseText>
          {!isSearched && data.text && (
            <div className="ConversationItem__info-text">
              <BaseText inline className="ConversationItem__info-chat">
                {truncateString(data.text, 30)}
              </BaseText>
              <span>•</span>
              <span>{!!data.time && formatConversationTime(data.time)}</span>
            </div>
          )}
        </div>
      </div>
      {!data.read && !isSearched && <div className="ConversationItem__unRead" />}
    </div>
  );
};

export default ConversationItem;
