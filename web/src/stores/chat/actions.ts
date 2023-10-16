/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  deleteChatRoom,
  downloadFileMessage,
  getChatMemberService,
  getRoomMessages,
  getRooms,
  markSeenMessage,
  sendMessage,
  startRoomService,
} from 'src/services/chat-service';
import {
  TDeleteChatRoomRequest,
  TDownloadFileMessageRequest,
  TGetChatMembersParams,
  TGetRoomMessagesParams,
  TGetRoomsParams,
  TMarkSeenMessageRequest,
  TSendMessageRequest,
  TStartRoomRequest,
} from 'src/interfaces/chat-interface';
import { EChatActions } from './constants';

export const getChatMembersAction = createAsyncThunk(
  EChatActions.GET_CHAT_MEMBERS,
  async (params: TGetChatMembersParams) => {
    try {
      const response = await getChatMemberService(params);
      return response;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const startRoomAction = createAsyncThunk(EChatActions.START_ROOM, async (bodyRequest: TStartRoomRequest) => {
  try {
    const response = await startRoomService(bodyRequest);
    return response;
  } catch (error: any) {
    return error.data;
  }
});

export const getRoomMessagesAction = createAsyncThunk(
  EChatActions.GET_ROOM_MESSAGES,
  async (params: TGetRoomMessagesParams) => {
    try {
      const response = await getRoomMessages(params);
      return response;
    } catch (error: any) {
      return error.data;
    }
  },
);

export const sendMessageAction = createAsyncThunk(
  EChatActions.SEND_MESSAGE,
  async (bodyRequest: TSendMessageRequest, { rejectWithValue }) => {
    try {
      const response = await sendMessage(bodyRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const getRoomsAction = createAsyncThunk(
  EChatActions.GET_ROOMS,
  async (params: TGetRoomsParams, { rejectWithValue }) => {
    try {
      const response = await getRooms(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const loadMoreChatMembers = createAsyncThunk(
  EChatActions.LOAD_MORE_CHAT_MEMBERS,
  async (params: TGetChatMembersParams, { rejectWithValue }) => {
    try {
      const response = await getChatMemberService(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const loadMoreRooms = createAsyncThunk(
  EChatActions.LOAD_MORE_ROOMS,
  async (params: TGetRoomsParams, { rejectWithValue }) => {
    try {
      const response = await getRooms(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const loadMoreMessages = createAsyncThunk(
  EChatActions.LOAD_MORE_ROOM_MESSAGES,
  async (params: TGetRoomMessagesParams, { rejectWithValue }) => {
    try {
      const response = await getRoomMessages(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const markSeenMessageAction = createAsyncThunk(
  EChatActions.MARK_READ_MESSAGE,
  async (bodyRequest: TMarkSeenMessageRequest, { rejectWithValue }) => {
    try {
      const response = await markSeenMessage(bodyRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const downloadFile = createAsyncThunk(
  EChatActions.DOWNLOAD_FILE,
  async (bodyRequest: TDownloadFileMessageRequest, { rejectWithValue }) => {
    try {
      const response = await downloadFileMessage(bodyRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);

export const deleteChat = createAsyncThunk(
  EChatActions.DELETE_CHAT_ROOM,
  async (bodyRequest: TDeleteChatRoomRequest, { rejectWithValue }) => {
    try {
      const response = await deleteChatRoom(bodyRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  },
);
