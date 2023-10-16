import { Divider } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { debounce } from 'lodash';
import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useLocation, useSearchParams } from 'react-router-dom';
import { DeleteIcon, Edit2Icon } from 'src/assets/icons';
import Button from 'src/components/button';
import { CommonContent, Container } from 'src/components/containers';
import { ConfirmModal } from 'src/components/popup';
import { BaseText } from 'src/components/typography';
import { Chat, Conversations } from 'src/containers/message';
import { PreviewFilesModal } from 'src/containers/modal';
import {
  TDownloadFileMessageRequest,
  TGetChatMembersParams,
  TGetRoomMessagesParams,
  TSendMessageValues,
  TStartRoomResponse,
} from 'src/interfaces/chat-interface';
import { TFile } from 'src/interfaces/common-interface';
import { TConversation } from 'src/interfaces/messages-interface';
import { TSocket } from 'src/layouts/AuthLayout';
import { TRootState, useAppDispatch } from 'src/stores';
import {
  EChatActions,
  changeCurrentRoomAction,
  deleteChat,
  deleteChatRoom,
  getChatMembersAction,
  getRoomMessagesAction,
  getRoomsAction,
  leaveRoomAction,
  loadMoreChatMembers,
  loadMoreMessages,
  loadMoreRooms,
  markSeenMessageAction,
  setAddChatRoomStatus,
  startRoomAction,
  updateConversations,
  updateRoomMessage,
} from 'src/stores/chat';
import { downloadFile, sendMessageAction } from 'src/stores/chat/actions';
import { saveFileAs } from 'src/utils/common-utils';
import { getItem } from 'src/utils/storage-utils';
import { DEFAULT_GET_LIST_PARAMS } from 'src/variables/common';
import { EChatMemberType } from 'src/variables/enum-variables';
import { EUserProfile } from 'src/variables/storage';
import './MessagesPage.scss';

const DEFAULT_MESSAGES_PARAMS = {
  page: 1,
  size: 25,
  roomId: '',
};

const DEFAULT_MEMBERS_PARAMS = {
  page: 1,
  size: 10,
};

type TPreviewFilesModalState = {
  open: boolean;
  fileIndex: number;
  files: TFile[];
};

interface IProps {
  socket?: TSocket;
}

const MessagesPages = ({ socket }: IProps) => {
  const location = useLocation();
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const sliderRef: Ref<CarouselRef> = useRef(null);
  const partnerId = params.get('partnerId');
  const partnerType = params.get('type') as EChatMemberType;

  const [viewNewChat, setViewNewChat] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const [chatMembersKeyword, setChatMembersKeyword] = useState<{ fromSearch: string; fromAdd: string }>({
    fromAdd: '',
    fromSearch: '',
  });
  const [previewFilesModalState, setPreviewFilesModalState] = useState<TPreviewFilesModalState>({
    open: false,
    files: [],
    fileIndex: 0,
  });
  const [deleteChatModalState, setDeleteChatModalState] = useState({
    isOpen: false,
    loading: false,
  });

  const { chatMembers, rooms, currentRoomId, conversations, fromAddNewChatMembers, isAddChatRoom, searching } =
    useSelector((state: TRootState) => ({
      chatMembers: state.chat.members,
      rooms: state.chat.rooms,
      currentRoomId: state.chat.currentRoomId,
      conversations: state.chat.conversations,
      fromAddNewChatMembers: state.chat.addNewMembers,
      isAddChatRoom: state.chat.isAddChatRoom,
      searching: state.loading[EChatActions.GET_CHAT_MEMBERS],
    }));
  const currentRoom = rooms[currentRoomId];
  const currentProfileId = getItem(EUserProfile.PROFILE_ID);

  const handleClosePreviewFilesModal = () => {
    setPreviewFilesModalState({ open: false, fileIndex: 0, files: [] });
  };

  const handlePreviewFilesModal = (files: TFile[], fileIndex = 0) => {
    setPreviewFilesModalState({
      open: true,
      fileIndex,
      files,
    });
    sliderRef.current?.goTo(fileIndex);
  };

  const handleLeaveRoom = () => {
    const lastMessage = currentRoom?.messages?.data?.[0];

    dispatch(leaveRoomAction());
    lastMessage?.id && dispatch(markSeenMessageAction({ messageId: lastMessage?.id }));
    socket?.leaveRoomChat(currentRoomId);
  };

  const handleClickAddChat = () => {
    if (viewNewChat) return;
    dispatch(setAddChatRoomStatus({ isAddChat: true }));
    currentRoomId && handleLeaveRoom();
    setViewNewChat(true);
    getChatMembers({ ...DEFAULT_GET_LIST_PARAMS, isAddNew: true });
  };

  const debounceSearch = useCallback(
    debounce((searchKey: string) => {
      setChatMembersKeyword({ ...chatMembersKeyword, fromSearch: searchKey });
      getChatMembers({ ...DEFAULT_MEMBERS_PARAMS, keyword: searchKey });
    }, 500),
    [],
  );

  const handleSearch = (key: string) => {
    setSearchKey(key);
    debounceSearch(key);
  };

  const handleCloseDeleteChatModal = () => {
    setDeleteChatModalState({
      isOpen: false,
      loading: false,
    });
  };

  const handleOpenDeleteChatModal = () => {
    setDeleteChatModalState({
      ...deleteChatModalState,
      isOpen: true,
    });
  };

  const handleDeleteChat = async () => {
    setDeleteChatModalState({
      ...deleteChatModalState,
      loading: true,
    });

    await dispatch(
      deleteChat({
        roomId: currentRoomId,
      }),
    );
    dispatch(deleteChatRoom({ roomId: currentRoomId }));
    currentRoomId && handleLeaveRoom();
    handleCloseDeleteChatModal();
    getRooms();
  };

  const handleChat = async (values: TSendMessageValues) => {
    const formData = new FormData();
    formData.append('content', values.text);
    values.files.forEach((file) => formData.append('files', file.originFileObj as Blob));

    await dispatch(sendMessageAction({ roomId: currentRoomId, payload: formData }));
    dispatch(getRoomsAction(DEFAULT_GET_LIST_PARAMS));
    isAddChatRoom && dispatch(setAddChatRoomStatus({ isAddChat: false }));
    viewNewChat && setViewNewChat(false);
  };

  const handleSearchOnAddNew = (keyword: string) => {
    setChatMembersKeyword({ ...chatMembersKeyword, fromAdd: keyword });
    getChatMembers({ ...DEFAULT_MEMBERS_PARAMS, keyword, isAddNew: true });
  };

  const startRoom = async (data: TConversation, closeAddView?: boolean) => {
    const isSelected = data.receiveId === currentRoom?.partnerProfile?.id;
    if (isSelected) return;
    currentRoomId && socket?.leaveRoomChat(currentRoomId);
    const profileId = currentProfileId ?? '';

    if (!data.roomId) {
      const { payload } = await dispatch(
        startRoomAction({ receiveId: data.receiveId, type: data.type ?? EChatMemberType.OWNER }),
      );

      if ((payload as TStartRoomResponse).id) {
        const startRoomResponse = { ...payload } as TStartRoomResponse;
        const partnerUser = startRoomResponse.userRooms?.find((user) => user.profile?.id !== profileId);
        const partnerProfile = partnerUser?.client ?? partnerUser?.profile;
        dispatch(
          changeCurrentRoomAction({
            roomId: payload.id,
            partnerId: data.receiveId,
            profile: partnerProfile ?? data.partner,
          }),
        );

        const response = payload as TStartRoomResponse;
        const params: TGetRoomMessagesParams = {
          ...DEFAULT_MESSAGES_PARAMS,
          roomId: response.id,
        };
        socket?.joinRoomChat(response.id, (message) =>
          dispatch(updateRoomMessage({ message, currentProfileId: profileId })),
        );
        setSearchKey('');
        if (closeAddView) {
          setViewNewChat(false);
          dispatch(setAddChatRoomStatus({ isAddChat: false }));
        }
        const { payload: roomMessages } = await dispatch(getRoomMessagesAction(params));
        if (roomMessages.currentPage && roomMessages.data.length) {
          dispatch(markSeenMessageAction({ messageId: roomMessages.data[0].id }));
          dispatch(
            updateConversations({
              lastMessage: roomMessages.data[0],
              roomId: response.id,
              currentProfileId: profileId,
            }),
          );
        }
      }
      return;
    }

    const params: TGetRoomMessagesParams = {
      ...DEFAULT_MESSAGES_PARAMS,
      roomId: data.roomId,
    };

    setViewNewChat(false);
    dispatch(setAddChatRoomStatus({ isAddChat: false }));
    socket?.joinRoomChat(data.roomId, (message) =>
      dispatch(updateRoomMessage({ message, currentProfileId: currentProfileId ?? '' })),
    );
    dispatch(changeCurrentRoomAction({ roomId: data.roomId, partnerId: data.receiveId, profile: data.partner }));
    const { payload: roomMessages } = await dispatch(getRoomMessagesAction(params));

    if (roomMessages.currentPage && roomMessages.data.length) {
      dispatch(markSeenMessageAction({ messageId: roomMessages.data[0].id }));
      dispatch(
        updateConversations({
          lastMessage: roomMessages.data[0],
          roomId: data.roomId,
          currentProfileId: profileId ?? '',
        }),
      );
    }
  };

  const handleRemoveMemberOnAddAction = () => {
    handleLeaveRoom();
  };

  const getChatMembers = useCallback((params: TGetChatMembersParams) => {
    dispatch(getChatMembersAction(params));
  }, []);

  const getRooms = useCallback(() => {
    dispatch(getRoomsAction(DEFAULT_GET_LIST_PARAMS));
  }, []);

  const handleLoadMoreConversations = () => {
    dispatch(loadMoreRooms({ page: conversations.currentPage + 1, size: 10 }));
  };

  const handleLoadMoreChatMembers = () => {
    dispatch(
      loadMoreChatMembers({
        ...DEFAULT_MEMBERS_PARAMS,
        page: chatMembers?.currentPage + 1,
        keyword: chatMembersKeyword.fromSearch,
      }),
    );
  };

  const handleLoadMoreMessages = () => {
    dispatch(
      loadMoreMessages({
        ...DEFAULT_MESSAGES_PARAMS,
        roomId: currentRoomId,
        page: (currentRoom?.messages?.currentPage ?? 0) + 1,
      }),
    );
  };

  const handleLoadMoreAddNewChatMembers = () => {
    dispatch(
      loadMoreChatMembers({
        ...DEFAULT_MEMBERS_PARAMS,
        page: fromAddNewChatMembers?.currentPage + 1,
        keyword: chatMembersKeyword.fromAdd,
        isAddNew: true,
      }),
    );
  };

  const handleDownloadFileMessage = async (params: TDownloadFileMessageRequest, fileName?: string) => {
    const res = await dispatch(downloadFile(params));
    const url = window.URL.createObjectURL(new Blob([res.payload as Blob]));

    saveFileAs(url, fileName);
  };

  useEffect(() => {
    const isNotLoadMore = conversations.currentPage < 2;
    const existedCurrentRoomId = !!currentRoomId;
    if (
      !partnerId &&
      ((isNotLoadMore && !existedCurrentRoomId && conversations.data.length) || (isAddChatRoom && !viewNewChat))
    ) {
      dispatch(setAddChatRoomStatus({ isAddChat: false }));
      const firstConversation = conversations.data[0];
      const partnerProfileRoom = firstConversation.userRooms.find(
        (user) => (user.profile?.id ?? user.client?.id) !== currentProfileId,
      );
      const partnerProfile = partnerProfileRoom?.profile ?? partnerProfileRoom?.client;
      partnerProfile?.id &&
        startRoom({
          roomId: firstConversation.id,
          receiveId: partnerProfile?.id,
          partner: partnerProfile,
          name: `${partnerProfile?.firstName} ${partnerProfile?.lastName}`,
        });
    }
  }, [conversations.data]);

  useEffect(() => {
    if (partnerId && partnerType) startRoom({ receiveId: partnerId, name: '', type: partnerType });
  }, [partnerId, partnerType]);

  useEffect(() => {
    getRooms();
    getChatMembers(DEFAULT_GET_LIST_PARAMS);
    const conversationDetail = location.state as TConversation;
    conversationDetail && startRoom(conversationDetail);
    window.addEventListener('beforeunload', handleLeaveRoom);

    return () => {
      window.removeEventListener('beforeunload', handleLeaveRoom);
    };
  }, []);

  return (
    <Container className="MessagesPage">
      <CommonContent
        title="Messages"
        className="MessagesPage__content"
        action={
          <Button
            className={`MessagesPage__addIcon ${viewNewChat ? 'active' : ''}`}
            noBorder
            icon={<Edit2Icon />}
            onClick={handleClickAddChat}
          />
        }
      >
        <div className="MessagesPage__wrapper">
          <Conversations
            className="MessagesPage__element MessagesPage__conversations"
            searchKey={searchKey}
            searching={searching}
            conversations={conversations}
            searchedResult={chatMembers}
            onSearch={handleSearch}
            onClickConversation={(data) => startRoom(data, true)}
            onLoadMoreChatMembers={handleLoadMoreChatMembers}
            onLoadMoreConversation={handleLoadMoreConversations}
          />
          <Divider orientation="center" type="vertical" className="MessagesPage__element MessagesPage__divider" />
          <Chat
            className="MessagesPage__element MessagesPage__chat"
            isAddChat={viewNewChat}
            searchedMembers={fromAddNewChatMembers}
            room={currentRoom}
            onChat={handleChat}
            onSelectMember={startRoom}
            onDelete={handleOpenDeleteChatModal}
            onSearch={handleSearchOnAddNew}
            onPreviewFiles={handlePreviewFilesModal}
            onLoadMoreMessages={handleLoadMoreMessages}
            onLoadMoreMembers={handleLoadMoreAddNewChatMembers}
            onRemoveSelectedMember={handleRemoveMemberOnAddAction}
            onDownloadFile={handleDownloadFileMessage}
          />
        </div>
      </CommonContent>

      <PreviewFilesModal {...previewFilesModalState} slideRef={sliderRef} onClose={handleClosePreviewFilesModal} />

      <ConfirmModal
        open={deleteChatModalState.isOpen}
        loading={deleteChatModalState.loading}
        titleModal="Remove this conversation?"
        txtBtnConfirm="Yes"
        txtBtnCancel="Cancel"
        danger={true}
        icon={<DeleteIcon />}
        onCancelButton={handleCloseDeleteChatModal}
        onCancel={handleCloseDeleteChatModal}
        onsubmit={handleDeleteChat}
      >
        <BaseText type="body1" textAlign="center" className="MessagesPage__ConfirmModal-content">
          Do you want to permanently remove this conversation?
        </BaseText>
      </ConfirmModal>
    </Container>
  );
};

export default React.memo(MessagesPages);
