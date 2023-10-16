import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { Spin } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { AttachmentIcon, GalleryAddIcon, SendIcon } from 'src/assets/icons';
import Button from 'src/components/button';
import { TextArea } from 'src/components/input';
import { showErrorToast } from 'src/components/toast/Toast';
import Upload from 'src/components/upload';
import { TSendMessageValues } from 'src/interfaces/chat-interface';
import { TRootState } from 'src/stores';
import { EChatActions } from 'src/stores/chat';
import { getBase64, validateFileType } from 'src/utils/common-utils';
import { ACCEPTED_IMAGE_TYPE, ACCEPTED_OTHER_TYPE } from 'src/variables/common';
import { EAcceptedMessageFileType } from 'src/variables/enum-variables';
import PreviewChatFiles from './PreviewChatFiles';
import './ChatAction.scss';

const MAX_IMAGE_FILE_SIZE = 1024 * 1024 * 5;
const MAX_OTHER_FILE_SIZE = 1024 * 1024 * 20;

interface IProps {
  readOnly?: boolean;
  onSend: (values: TSendMessageValues) => void;
}

const ChatAction = ({ readOnly, onSend }: IProps) => {
  const [chatState, setChatState] = useState<TSendMessageValues>({
    files: [],
    text: '',
  });

  const imageFiles = chatState.files.filter((file) => file.type?.includes('image'));
  const otherFiles = chatState.files.filter((file) => !file.type?.includes('image'));
  const { sending } = useSelector((state: TRootState) => ({
    sending: state.loading[EChatActions.SEND_MESSAGE],
  }));

  const validateFile = (file: UploadFile, isImageFile?: boolean) => {
    const validFileType = validateFileType(file.type || '', EAcceptedMessageFileType);
    if (!validFileType) {
      showErrorToast('This format is not supported');
      return true;
    }

    if (isImageFile && (file.size ?? 0) > MAX_IMAGE_FILE_SIZE) {
      showErrorToast('Cannot upload file > 5MB');
      return true;
    }

    if (!isImageFile && (file.size ?? 0) > MAX_OTHER_FILE_SIZE) {
      showErrorToast('Cannot upload file > 20MB');
      return true;
    }

    return false;
  };

  const handleChangeFile: UploadProps['onChange'] = async ({ file, fileList }) => {
    const isImageFile = file.type?.includes('image');
    const hasError = validateFile(file, isImageFile);

    if (hasError) return;
    if (isImageFile) {
      const newFile = fileList.map(async (file) => ({
        ...file,
        preview: await getBase64(file.originFileObj as RcFile),
      }));

      Promise.all(newFile).then((results) => setChatState({ ...chatState, files: [...results, ...otherFiles] }));
    } else {
      setChatState({ ...chatState, files: [...imageFiles, ...fileList] });
    }
  };

  const handleRemoveFile = (uid: string) => {
    setChatState((prev) => {
      const selectedFileIndex = prev.files.findIndex((file) => file.uid === uid);
      const newSelectedFiles = [...prev.files];
      newSelectedFiles.splice(selectedFileIndex, 1);

      return {
        ...prev,
        files: newSelectedFiles,
      };
    });
  };

  const handleChangeText: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setChatState({ ...chatState, text: e.target.value });
  };

  const sendMessage = () => {
    const hasNotValue = !chatState.files.length && !chatState.text.trim();
    if (hasNotValue || sending) return;

    setChatState({ files: [], text: '' });
    onSend(chatState);
  };

  if (readOnly)
    return (
      <Button type="primary" block className="ChatAction__readOnly">
        You can&apos;t reply to this conversation.
      </Button>
    );

  return (
    <div className="ChatAction">
      <Upload accept={ACCEPTED_IMAGE_TYPE} multiple fileList={imageFiles} onChange={handleChangeFile}>
        <GalleryAddIcon className="ChatAction__icon" />
      </Upload>
      <Upload accept={ACCEPTED_OTHER_TYPE} multiple fileList={otherFiles} onChange={handleChangeFile}>
        <AttachmentIcon className="ChatAction__icon" />
      </Upload>
      <div className="ChatAction__input">
        {!!chatState.files.length && <PreviewChatFiles files={chatState.files} onRemoveFile={handleRemoveFile} />}
        <TextArea
          rows={4}
          autoSize
          placeholder="Aa"
          value={chatState.text}
          className="ChatAction__textarea"
          onChange={handleChangeText}
        />
      </div>
      {!sending ? (
        <SendIcon className="ChatAction__icon" onClick={sendMessage} />
      ) : (
        <Spin spinning className="ChatAction__icon" />
      )}
    </div>
  );
};

export default ChatAction;
