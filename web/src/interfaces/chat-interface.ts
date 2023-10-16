import { UploadFile } from 'antd';

import { EProfileStatus } from 'src/variables/common';
import { EChatMemberType } from 'src/variables/enum-variables';
import { TCommonGetListParams, TCommonGetListResponse } from './common-interface';

export type TRoomData = {
  partnerProfile?: TChatMember;
  messages: TGetRoomMessagesResponse;
};

export type TGetChatMembersParams = TCommonGetListParams & {
  isAddNew?: boolean;
  addNewKeyword?: string;
};

export type TChatMember = {
  id: string;
  firstName: string;
  lastName: string;
  status: EProfileStatus;
  type: EChatMemberType;
  avatar?: string;
};

export type TGetChatMembersResponse = TCommonGetListResponse<TChatMember[]>;

export type TStartRoomRequest = {
  receiveId: string;
  type: EChatMemberType;
};

export type TRoomUserProfile = {
  id: string;
  lastSeenMessage: TRoomMessage | null;
  profile?: TChatMember;
  client?: TChatMember;
  status: EProfileStatus;
};

export type TStartRoomResponse = {
  id: string;
  lastMessage: TRoomMessage | null;
  newRoomCreated: boolean;
  userRooms: TRoomUserProfile[];
};

export type TGetRoomMessagesParams = TCommonGetListParams & {
  roomId: string;
  time?: string;
};

export type TMessageFile = {
  id: string;
  mimetype: string;
  originalname: string;
  url: string;
};

export type TRoomMessage = {
  id: string;
  roomId: string;
  content: string;
  createdAt: string;
  files: TMessageFile[];
  senderProfile?: TChatMember;
  senderClient?: TChatMember;
  isShowTime?: boolean;
};

export type TGetRoomMessagesResponse = TCommonGetListResponse<TRoomMessage[]>;

export type TSendMessageValues = {
  files: UploadFile[];
  text: string;
};

export type TSendMessageRequest = {
  roomId: string;
  payload: FormData;
};

export type TSendMessageResponse = TRoomMessage;

export type TGetRoomsParams = TCommonGetListParams;

export type TRoomUser = {
  id: string;
  status: EProfileStatus;
  lastSeenMessage: TRoomMessage;
  client?: TChatMember;
  profile?: TChatMember;
  lastMessage: TRoomMessage;
};

export type TRoom = {
  id: string;
  lastMessage?: TRoomMessage;
  userRooms: TRoomUser[];
};

export type TGetRoomsResponse = TCommonGetListResponse<TRoom[]>;

export type TMarkSeenMessageRequest = {
  messageId: string;
};

export type TMarkSeenMessageResponse = TRoomMessage;

export type TDownloadFileMessageRequest = {
  roomId: string;
  messageId: string;
  fileId: string;
};

export type TDownloadFileMessageResponse = {
  statusCode: number;
  message: string;
  error: string;
  errorType: string;
  id: string;
  timestamp: string;
  path: string;
};

export type TDeleteChatRoomRequest = {
  roomId: string;
};

export type TDeleteChatRoomResponse = {
  id: string;
};
