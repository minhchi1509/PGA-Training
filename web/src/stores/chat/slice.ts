import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import {
  TChatMember,
  TGetChatMembersResponse,
  TGetRoomsResponse,
  TRoomData,
  TRoomMessage,
} from 'src/interfaces/chat-interface';
import { DEFAULT_GET_LIST_RESPONSE } from 'src/variables/common';
import * as asyncActions from './actions';

type TChatState = {
  members: TGetChatMembersResponse;
  addNewMembers: TGetChatMembersResponse;
  conversations: TGetRoomsResponse;
  currentRoomId: string;
  rooms: {
    [key: string]: TRoomData;
  };
  isAddChatRoom: boolean;
};

const initialState: TChatState = {
  members: DEFAULT_GET_LIST_RESPONSE,
  addNewMembers: DEFAULT_GET_LIST_RESPONSE,
  conversations: DEFAULT_GET_LIST_RESPONSE,
  currentRoomId: '',
  isAddChatRoom: false,
  rooms: {},
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetMembers: (state) => ({ ...state, members: DEFAULT_GET_LIST_RESPONSE }),
    changeCurrentRoomAction: (
      state,
      {
        payload: { roomId, partnerId, profile },
      }: PayloadAction<{ roomId: string; partnerId: string; profile?: TChatMember }>,
    ) => {
      return {
        ...state,
        currentRoomId: roomId,
        rooms: {
          ...state.rooms,
          [roomId]: {
            ...state.rooms[roomId],
            partnerProfile:
              state.rooms[roomId]?.partnerProfile ??
              profile ??
              state.members.data.find((member) => member.id === partnerId),
          },
        },
      };
    },
    leaveRoomAction: (state) => ({
      ...state,
      currentRoomId: '',
    }),
    updateRoomMessage: (
      state,
      { payload: { message, currentProfileId } }: PayloadAction<{ message: TRoomMessage; currentProfileId: string }>,
    ) => {
      const senderProfile = message.senderProfile ?? message.senderClient;
      const isMyMessage = senderProfile?.id === currentProfileId;
      if (isMyMessage) return;

      const currentRoomId = state.currentRoomId;
      const currentRoom = state.rooms[currentRoomId];
      const newMessagesData = [...currentRoom.messages.data];
      newMessagesData.unshift(message);
      const newCurrentRoomData: TRoomData = {
        ...currentRoom,
        messages: {
          ...currentRoom.messages,
          data: newMessagesData,
        },
      };
      const newState = {
        ...state,
        rooms: {
          ...state.rooms,
          [currentRoomId]: newCurrentRoomData,
        },
      };

      return newState;
    },
    updateConversations: (
      state,
      {
        payload: { lastMessage, roomId, currentProfileId },
      }: PayloadAction<{ lastMessage: TRoomMessage; roomId: string; currentProfileId: string }>,
    ) => {
      const newConversationsData = [...state.conversations.data];
      const selectedConversationIndex = newConversationsData.findIndex((data) => data.id === roomId);
      const newUserRooms = newConversationsData[selectedConversationIndex]?.userRooms;
      const currentProfileIndex = newUserRooms?.findIndex(
        (user) => (user?.profile ?? user?.client)?.id === currentProfileId,
      );

      if (!currentProfileIndex) return;

      newUserRooms[currentProfileIndex] = {
        ...newUserRooms?.[currentProfileIndex],
        lastSeenMessage: lastMessage,
      };
      newConversationsData[selectedConversationIndex] = {
        ...newConversationsData[selectedConversationIndex],
        userRooms: newUserRooms,
      };
    },
    setAddChatRoomStatus: (state, { payload: { isAddChat } }: PayloadAction<{ isAddChat: boolean }>) => {
      state.isAddChatRoom = isAddChat;
    },
    deleteChatRoom: (state, { payload: { roomId } }: PayloadAction<{ roomId: string }>) => {
      const newState: TChatState = {
        ...state,
        rooms: {
          ...state.rooms,
          [roomId]: {
            messages: { ...DEFAULT_GET_LIST_RESPONSE, data: [] },
          },
        },
      };

      return newState;
    },
  },
  extraReducers(builder) {
    builder.addCase(asyncActions.getChatMembersAction.fulfilled, (state, action) => {
      if (action.meta.arg.isAddNew) {
        state.addNewMembers = action.payload;
        return;
      }
      state.members = action.payload;
    });
    builder.addCase(asyncActions.getRoomMessagesAction.fulfilled, (state, action) => {
      const roomId = action.meta.arg.roomId;
      const roomData = state.rooms[roomId];

      state.rooms = {
        ...state.rooms,
        [roomId]: {
          ...roomData,
          messages: action.payload,
        },
      };
    });
    builder.addCase(asyncActions.sendMessageAction.fulfilled, (state, action) => {
      const currentRoomId = state.currentRoomId;
      const currentRoom = state.rooms[currentRoomId];
      const currentRoomMessages = currentRoom?.messages;
      const newRoomMessages = [...(currentRoomMessages?.data ?? [])];
      newRoomMessages.unshift(action.payload);

      state.rooms = {
        ...state.rooms,
        [currentRoomId]: {
          ...currentRoom,
          messages: {
            ...currentRoomMessages,
            data: newRoomMessages,
          },
        },
      };
    });
    builder.addCase(asyncActions.getRoomsAction.fulfilled, (state, action) => {
      state.conversations = action.payload;
    });

    builder.addCase(asyncActions.loadMoreChatMembers.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;

      if (action.meta.arg.isAddNew) {
        state.addNewMembers = {
          ...pagination,
          data: [...state.addNewMembers.data, ...data],
        };
        return;
      }
      state.members = {
        ...pagination,
        data: [...state.members.data, ...data],
      };
    });

    builder.addCase(asyncActions.loadMoreRooms.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;
      state.conversations = {
        ...pagination,
        data: [...state.conversations.data, ...data],
      };
    });

    builder.addCase(asyncActions.loadMoreMessages.fulfilled, (state, action) => {
      const { data, ...pagination } = action.payload;
      const currentRoomId = state.currentRoomId;
      const currentRoom = state.rooms[currentRoomId];
      const currentRoomMessages = currentRoom?.messages.data;
      state.rooms = {
        ...state.rooms,
        [currentRoomId]: {
          ...currentRoom,
          messages: {
            ...pagination,
            data: [...currentRoomMessages, ...data],
          },
        },
      };
    });
  },
});

export default chatSlice;
