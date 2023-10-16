import { UploadFile } from 'antd/es/upload';
import { CloseOutlined } from '@ant-design/icons';

import { FileIcon } from 'src/assets/icons';
import Image from 'src/components/image';
import './PreviewChatFiles.scss';

interface IProps {
  files: UploadFile[];
  onRemoveFile: (uid: string) => void;
}

const PreviewChatFiles = ({ files, onRemoveFile }: IProps) => {
  return (
    <div className="PreviewChatFiles">
      {files.map((item) => {
        const isImageType = item.type?.includes('image');

        return (
          <div className="PreviewChatFiles__item" key={item.uid}>
            {isImageType && <Image src={item.preview} width={70} height={70} preview={false} draggable={false} />}
            {!isImageType && (
              <div className="PreviewChatFiles__item-otherType">
                <FileIcon />
                {item.name?.split('.').pop()}
              </div>
            )}
            <CloseOutlined className="PreviewChatFiles__item-close" onClick={() => onRemoveFile(item.uid)} />
          </div>
        );
      })}
    </div>
  );
};

export default PreviewChatFiles;
