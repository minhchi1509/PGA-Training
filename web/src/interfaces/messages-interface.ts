import { EChatMemberType } from 'src/variables/enum-variables';
import { TChatMember } from './chat-interface';

export type TConversation = {
  receiveId: string;
  roomId?: string;
  name: string;
  avatar?: string;
  text?: string;
  time?: string;
  read?: boolean;
  type?: EChatMemberType;
  partner?: TChatMember;
};
