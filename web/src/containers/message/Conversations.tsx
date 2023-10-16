import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { SearchInput } from 'src/components/input';
import { TGetChatMembersResponse, TGetRoomsResponse } from 'src/interfaces/chat-interface';
import { TConversation } from 'src/interfaces/messages-interface';
import { TRootState } from 'src/stores';
import { getItem } from 'src/utils/storage-utils';
import { EUserProfile } from 'src/variables/storage';
import ConversationList from './ConversationList';
import './Conversations.scss';

dayjs.extend(relativeTime);

interface IProps {
  className?: string;
  searchKey?: string;
  searching?: boolean;
  conversations: TGetRoomsResponse;
  searchedResult: TGetChatMembersResponse;
  onSearch: (key: string) => void;
  onClickConversation: (data: TConversation) => void;
  onLoadMoreChatMembers: () => void;
  onLoadMoreConversation: () => void;
}

const Conversations = ({
  className,
  searchKey,
  searching,
  conversations,
  searchedResult,
  onSearch,
  onClickConversation,
  onLoadMoreChatMembers,
  onLoadMoreConversation,
}: IProps) => {
  const [isFocusedSearch, setIsFocusedSearch] = useState<boolean>(false);
  const currentProfileId = getItem(EUserProfile.PROFILE_ID);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasSearchKey = !!searchKey?.trim();
  const showUserSearch = hasSearchKey;
  const showRecentSearch = !hasSearchKey && isFocusedSearch;
  const showSearchResults = showRecentSearch || showUserSearch;
  const showCurrentConversations = !isFocusedSearch && !hasSearchKey;
  const showedData = showSearchResults ? searchedResult : conversations;
  const dataLength = showedData?.data?.length ?? 0;
  const hasMore = showedData?.currentPage < showedData?.totalPage;

  const { currentRoomId } = useSelector((state: TRootState) => ({
    currentRoomId: state.chat.currentRoomId,
  }));

  const formattedConversations: TConversation[] = useMemo(() => {
    const newData = conversations.data?.map((item) => {
      const partnerProfileIndex = item.userRooms.findIndex(
        (user) => (user.profile?.id ?? user.client?.id) !== currentProfileId,
      );
      const currentProfileIndex = 1 - partnerProfileIndex;
      const myProfile = item.userRooms?.[currentProfileIndex];
      const currentPartnerProfile =
        item.userRooms?.[partnerProfileIndex]?.profile ?? item.userRooms?.[partnerProfileIndex]?.client;
      const senderProfile = item.lastMessage?.senderProfile ?? item.lastMessage?.senderClient;
      const isMyMessage = senderProfile?.id === currentProfileId;
      const alreadyInRoom = currentRoomId === item.id;
      const isReadMessage = alreadyInRoom || isMyMessage || myProfile?.lastSeenMessage?.id === item.lastMessage?.id;
      const fullNamePartner = `${currentPartnerProfile?.firstName} ${currentPartnerProfile?.lastName}`;
      const files = item.lastMessage?.files;

      return {
        roomId: item.id,
        receiveId: currentPartnerProfile?.id ?? '',
        name: fullNamePartner,
        text: item.lastMessage?.content
          ? `${isMyMessage ? 'You: ' : ''}${item.lastMessage?.content}`
          : files
          ? `${isMyMessage ? 'You: ' : fullNamePartner} sent ${files?.length < 2 ? 'a file' : 'files'}`
          : '',
        time: item.lastMessage?.createdAt,
        partner: currentPartnerProfile,
        avatar: currentPartnerProfile?.avatar,
        read: isReadMessage,
      };
    });

    return newData ?? [];
  }, [conversations]);

  const formattedChatMembers: TConversation[] = useMemo(() => {
    return searchedResult?.data?.map((item) => ({
      receiveId: item.id,
      avatar: item.avatar,
      name: `${item.firstName} ${item.lastName}`,
      type: item.type,
      read: true,
      partner: { ...item },
    }));
  }, [searchedResult]);

  const handleSelectConversation = (data: TConversation) => {
    setIsFocusedSearch(false);
    onClickConversation(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsFocusedSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`Conversations ${className ?? ''}`} ref={searchRef}>
      <SearchInput
        allowClear
        value={searchKey}
        placeHolder="Search by name"
        onFocus={() => setIsFocusedSearch(true)}
        onChange={onSearch}
      />
      {showCurrentConversations && (
        <ConversationList
          height={678}
          id="ConversationsListScroll"
          className="Conversations__list"
          hasMore={hasMore}
          dataLength={dataLength}
          data={formattedConversations}
          onLoadMore={onLoadMoreConversation}
          onClickItem={onClickConversation}
        />
      )}

      {showSearchResults && (
        <ConversationList
          height={678}
          id="ConversationsListScroll__chatMember"
          className="Conversations__list"
          label="Search Results"
          hasMore={hasMore}
          searching={searching}
          dataLength={dataLength}
          data={formattedChatMembers}
          onLoadMore={onLoadMoreChatMembers}
          onClickItem={handleSelectConversation}
        />
      )}
    </div>
  );
};

export default Conversations;
