import Avatar from 'src/components/avatar';
import { BaseText } from 'src/components/typography';
import { TDownloadFileMessageRequest, TRoomMessage } from 'src/interfaces/chat-interface';
import { getItem } from 'src/utils/storage-utils';
import { EUserProfile } from 'src/variables/storage';
import './SingleMessage.scss';
import QuickMessageFiles from './QuickMessageFiles';
import { TFile } from 'src/interfaces/common-interface';
import { formatMessageTimeLine } from 'src/utils/common-utils';

interface IProps {
  data: TRoomMessage;
  nextMessage?: TRoomMessage;
  onPreviewFiles: (files: TFile[], fileIndex?: number) => void;
  onDownloadFile: (params: TDownloadFileMessageRequest, fileName?: string) => void;
}

const SingleMessage = ({ data, nextMessage, onPreviewFiles, onDownloadFile }: IProps) => {
  const currentProfileId = getItem(EUserProfile.PROFILE_ID);
  const senderId = (data?.senderProfile ?? data?.senderClient)?.id;
  const isMyMessage = senderId === currentProfileId;
  const nextMessageProfile = nextMessage?.senderClient ?? nextMessage?.senderProfile;
  const isShowAvatar = !isMyMessage && (!nextMessage || nextMessageProfile?.id === currentProfileId);

  const handleDownloadFile = (fileId: string, fileName?: string) => {
    onDownloadFile(
      {
        messageId: data.id,
        roomId: data.roomId,
        fileId,
      },
      fileName,
    );
  };

  return (
    <>
      <div className={`SingleMessage ${isMyMessage ? 'own' : 'partner'} `}>
        {isMyMessage && (
          <>
            {!!data.files.length && (
              <QuickMessageFiles
                files={data.files}
                className={`SingleMessage__quickFiles ${isMyMessage ? 'own' : 'partner'}`}
                onPreviewFiles={onPreviewFiles}
                onDownloadFile={handleDownloadFile}
              />
            )}
            {data.content && (
              <BaseText className="SingleMessage__text own" type="body1" dangerouslyText={data.content} key={data.id} />
            )}
          </>
        )}
        {!isMyMessage && (
          <div className={`SingleMessage__partner ${isShowAvatar ? 'showAvt' : 'hideAvt'}`} key={data.id}>
            {isShowAvatar && <Avatar className="SingleMessage__partner-avatar" src={data.senderClient?.avatar} />}

            <div className="SingleMessage__partner-details">
              {!!data.files.length && (
                <QuickMessageFiles
                  files={data.files}
                  className={`SingleMessage__quickFiles ${isMyMessage ? 'own' : 'partner'}`}
                  onPreviewFiles={onPreviewFiles}
                  onDownloadFile={handleDownloadFile}
                />
              )}
              {data.content && (
                <BaseText className={`SingleMessage__text other `} type="body1" dangerouslyText={data.content} />
              )}
            </div>
          </div>
        )}
      </div>
      {data.isShowTime && <p className="SingleMessage__timeline">{formatMessageTimeLine(data.createdAt)}</p>}
    </>
  );
};

export default SingleMessage;
