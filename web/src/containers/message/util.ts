import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { TRoomMessage } from 'src/interfaces/chat-interface';

export const convertMessageByTimeLine = (messagesRaw: TRoomMessage[]) => {
  const messages = cloneDeep(messagesRaw);
  const listMessageDay: {
    day: string;
    id: string;
    value: string;
  }[] = [];

  messages.forEach((message) => {
    const createdAt = message.createdAt;
    const messageDate = dayjs(createdAt).format('YYYY-MM-DD');
    const existedMessageDay = listMessageDay.find((messageDay) => messageDay.day === messageDate);
    if (existedMessageDay) {
      if (new Date(createdAt).getTime() <= new Date(existedMessageDay.value).getTime()) {
        listMessageDay.forEach((messageDay) => {
          if (messageDay.id === existedMessageDay.id) {
            messageDay.id = message.id;
            messageDay.value = createdAt;
          }
        });
      }
    } else {
      listMessageDay.push({
        day: messageDate,
        id: message.id,
        value: createdAt,
      });
    }
  });

  listMessageDay.forEach((messageDay) => {
    messages.forEach((message) => {
      if (message.id === messageDay.id) {
        message.isShowTime = true;
      }
    });
  });

  return messages;
};
