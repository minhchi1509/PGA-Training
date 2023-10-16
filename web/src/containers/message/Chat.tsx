import { DeleteOutlined } from '@ant-design/icons';

import { MoreHorizontalIcon } from 'src/assets/icons';
import Avatar from 'src/components/avatar';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown';
import { BaseText } from 'src/components/typography';
import {
  TDownloadFileMessageRequest,
  TGetChatMembersResponse,
  TRoomData,
  TSendMessageValues,
} from 'src/interfaces/chat-interface';
import { TConversation } from 'src/interfaces/messages-interface';
import ChatAction from './ChatAction';
import ChatContent from './ChatContent';
import CreateChatHeader from './CreateChatHeader';
import './Chat.scss';
import { EProfileStatus } from 'src/variables/common';
import { TFile } from 'src/interfaces/common-interface';
interface IProps {
  className?: string;
  isAddChat?: boolean;
  room: TRoomData;
  searchedMembers?: TGetChatMembersResponse;
  onDelete: () => void;
  onChat: (values: TSendMessageValues) => void;
  onSearch: (keyword: string) => void;
  onRemoveSelectedMember: () => void;
  onLoadMoreMessages: () => void;
  onSelectMember: (data: TConversation) => void;
  onLoadMoreMembers: () => void;
  onPreviewFiles: (files: TFile[], fileIndex?: number) => void;
  onDownloadFile: (params: TDownloadFileMessageRequest, fileName?: string) => void;
}

const Chat = ({
  className,
  isAddChat,
  room,
  searchedMembers,
  onDelete,
  onChat,
  onSearch,
  onPreviewFiles,
  onSelectMember,
  onLoadMoreMembers,
  onLoadMoreMessages,
  onRemoveSelectedMember,
  onDownloadFile,
}: IProps) => {
  const readOnly = room?.partnerProfile?.status === EProfileStatus.INACTIVE;

  return (
    <div className={`Chat ${className ?? ''}`}>
      <div className="Chat__wrapper">
        <div className={`Chat__header ${!room && isAddChat ? 'noRoom' : ''}`}>
          {isAddChat && (
            <CreateChatHeader
              searchedResult={searchedMembers}
              onSearch={onSearch}
              onClickMember={onSelectMember}
              onLoadMore={onLoadMoreMembers}
              onRemoveMember={onRemoveSelectedMember}
            />
          )}
          {!isAddChat && (
            <>
              {room && (
                <>
                  <div className="Chat__header-profile">
                    <Avatar src={room?.partnerProfile?.avatar} size={40} />
                    <BaseText type="title">
                      {room?.partnerProfile?.firstName} {room?.partnerProfile?.lastName}
                    </BaseText>
                  </div>
                  <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    menu={{
                      items: [
                        {
                          key: 'delete',
                          label: (
                            <Button
                              icon={<DeleteOutlined />}
                              size="small"
                              type="link"
                              className="Chat__header-delete"
                              onClick={onDelete}
                            >
                              Delete
                            </Button>
                          ),
                        },
                      ],
                      className: 'Chat__header-list',
                    }}
                  >
                    <Button icon={<MoreHorizontalIcon />} type="text" noBorder className="Chat__header-action" />
                  </Dropdown>
                </>
              )}
            </>
          )}
        </div>

        <div className={`Chat__content ${!room && !isAddChat ? 'noRoom' : ''}`}>
          <ChatContent
            room={room}
            onLoadMore={onLoadMoreMessages}
            onPreviewFiles={onPreviewFiles}
            onDownloadFile={onDownloadFile}
          />
        </div>
      </div>

      {room && (
        <div className={`Chat__action ${readOnly ? 'readOnly' : ''}`}>
          <ChatAction onSend={onChat} readOnly={readOnly} />
        </div>
      )}
    </div>
  );
};

export default Chat;
