import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import './ChatItem.scss';
import Avatar from 'src/components/avatar';
import { BaseText } from 'src/components/typography';
import { getTimeToDay, truncateString } from 'src/utils/common-utils';
import { TRoom } from 'src/interfaces/chat-interface';
import { getItem } from 'src/utils/storage-utils';
import { EUserProfile } from 'src/variables/storage';
import { RoutePaths } from 'src/routes/routes-constants';

interface IChatItemProps {
  chatItemDetail: TRoom;
}

const ChatItem: FC<IChatItemProps> = ({ chatItemDetail }) => {
  const navigate = useNavigate();
  const profileId = getItem(EUserProfile.PROFILE_ID) as string;
  const { lastMessage, userRooms } = chatItemDetail;

  const usersProfileInRoom = userRooms.map((user) => user.profile ?? user.client);
  const partnerProfile = usersProfileInRoom.find((user) => user?.id !== profileId);
  const lastMessageSenderProfile = lastMessage?.senderClient ?? lastMessage?.senderProfile;
  const isMyLastMessage = lastMessageSenderProfile?.id === profileId;
  const lastMessageFiles = lastMessage?.files || [];

  const handleClickOnChatItem = () => {
    navigate(RoutePaths.MESSAGES, {
      state: {
        roomId: chatItemDetail.id,
        receiveId: partnerProfile?.id,
        partner: partnerProfile,
        name: `${partnerProfile?.firstName} ${partnerProfile?.lastName}`,
      },
    });
  };

  return (
    <div className="ChatItem" onClick={handleClickOnChatItem}>
      <Avatar src={partnerProfile?.avatar} />
      <div className="ChatItem__content">
        <BaseText type="body1">
          {truncateString(`${partnerProfile?.firstName} ${partnerProfile?.lastName}`, 20)}
        </BaseText>
        <div className="ChatItem__content--message">
          <BaseText inline>
            {isMyLastMessage ? 'You: ' : ''}
            {lastMessageFiles.length ?? 0 > 0
              ? `${isMyLastMessage ? 's' : 'S'}ent ${lastMessageFiles.length} ${
                  lastMessageFiles.length > 1 ? 'files' : 'file'
                }`
              : truncateString(lastMessage?.content || '', 20)}
          </BaseText>
          <span> • </span>
          <span>{getTimeToDay(lastMessage?.createdAt || '')}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
