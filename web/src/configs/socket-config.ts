import { Socket, io } from 'socket.io-client';
import { TRoomMessage } from 'src/interfaces/chat-interface';

import { EAuthToken, EUserProfile } from 'src/variables/storage';

const url = process.env.REACT_APP_API_URL ?? '';

class SocketConfig {
  private static socket: Socket;

  static getSocket() {
    if (SocketConfig.socket) {
      return SocketConfig.socket;
    }

    const accessToken = localStorage.getItem(EAuthToken.ACCESS_TOKEN);
    SocketConfig.socket = io(url, { query: { accessToken } });
    return SocketConfig.socket;
  }
}

export const getSocket = () => {
  const currentProfileId = localStorage.getItem(EUserProfile.PROFILE_ID);

  const leaveRoomChat = async (roomId: string) => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.emit('leaveRoom', `ROOM-${roomId}`);
      socket.off('messageOnRoom');
    }
  };

  const joinRoomChat = (roomId: string, cb: (message: TRoomMessage) => void) => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.emit('joinRoom', `ROOM-${roomId}`);
      socket.on('messageOnRoom', (message: TRoomMessage) => {
        cb(message);
      });
    }
  };

  const leaveRoomNotification = () => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.emit('leaveRoom', `PROFILE-${currentProfileId}`);
      socket.off('notification');
    }
  };

  const joinRoomNotification = (handleReceiveNotification?: (message: TRoomMessage) => void) => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.emit('joinRoom', `PROFILE-${currentProfileId}`);
      socket.on('notification', (message) => {
        handleReceiveNotification?.(message);
      });
    }
  };

  const listenMessageOnProfile = (cb: () => void) => {
    const socket = SocketConfig.getSocket();
    socket.off('messageOnProfile');
    socket.on('messageOnProfile', () => {
      cb();
    });
  };

  const offMessageOnProfile = () => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.off('messageOnProfile');
    }
  };

  const listenCreateRoom = (cb: () => void) => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.off('room');
      socket.on('room', () => {
        cb();
      });
    }
  };

  const offCreateRoom = () => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.off('room');
    }
  };

  const connect = () => {
    if (currentProfileId) {
      const socket = SocketConfig.getSocket();
      socket.emit('joinRoom', `PROFILE-${currentProfileId}`);
    }
  };

  return {
    connect,
    leaveRoomChat,
    joinRoomChat,
    listenMessageOnProfile,
    offMessageOnProfile,
    listenCreateRoom,
    offCreateRoom,
    leaveRoomNotification,
    joinRoomNotification,
  };
};
