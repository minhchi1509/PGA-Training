import { EChatActions } from './constants';
import * as asyncActions from './actions';
import slice from './slice';

export { EChatActions };
export const {
  reducer,
  actions: {
    changeCurrentRoomAction,
    resetMembers,
    leaveRoomAction,
    updateRoomMessage,
    updateConversations,
    setAddChatRoomStatus,
    deleteChatRoom,
  },
} = slice;
export const {
  getChatMembersAction,
  startRoomAction,
  getRoomMessagesAction,
  getRoomsAction,
  loadMoreChatMembers,
  loadMoreRooms,
  loadMoreMessages,
  markSeenMessageAction,
  downloadFile,
  deleteChat,
} = asyncActions;
