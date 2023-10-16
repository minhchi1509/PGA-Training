import { FC } from 'react';
import { UploadFile } from 'antd';

import './ContactHelpPreviewFiles.scss';
import PreviewChatFiles from 'src/containers/message/PreviewChatFiles';
import ExcelLogo from 'src/assets/images/excel-logo.png';
import CsvLogo from 'src/assets/images/csv-logo.png';
import MSWordLogo from 'src/assets/images/msword-logo.png';
import PdfLogo from 'src/assets/images/pdf-logo.png';
import MovLogo from 'src/assets/images/mov-png.png';
import Mp4Logo from 'src/assets/images/mp4-logo.png';
import { BaseText } from 'src/components/typography';
import { formatFileSize, truncateString } from 'src/utils/common-utils';
import { XIcon } from 'src/assets/icons';
import { EAcceptedContactHelpFileType } from 'src/variables/enum-variables';

interface IContactHelpPreviewFilesProps {
  files: UploadFile[];
  onRemoveFile: (uid: string) => void;
}

const ContactHelpPreviewFiles: FC<IContactHelpPreviewFilesProps> = ({ files, onRemoveFile }) => {
  const imageFiles = files.filter((file) => file.type?.includes('image'));
  const otherFiles = files.filter((file) => !file.type?.includes('image'));

  const fileLogo = (fileType: string) => {
    switch (fileType) {
      case EAcceptedContactHelpFileType.CSV:
        return CsvLogo;
      case EAcceptedContactHelpFileType.EXCEL:
        return ExcelLogo;
      case EAcceptedContactHelpFileType.MSWORD:
        return MSWordLogo;
      case EAcceptedContactHelpFileType.PDF:
        return PdfLogo;
      case EAcceptedContactHelpFileType.VIDEO:
        return Mp4Logo;
      case EAcceptedContactHelpFileType.MOV:
        return MovLogo;
      default:
        return '';
    }
  };

  return (
    <div className="ContactHelpPreviewFiles">
      <div className="ContactHelpPreviewFiles__ImageVideoFileList">
        <PreviewChatFiles files={imageFiles} onRemoveFile={onRemoveFile} />
      </div>
      {otherFiles.length > 0 && (
        <div className="ContactHelpPreviewFiles__OtherFileList">
          {otherFiles?.map((file, index) => (
            <div key={index} className="FileItemContainer">
              <div className="FileItemContainer__image">
                <img src={fileLogo(file.type || '')} alt="File image background" />
              </div>
              <div className="FileItemContainer__content">
                <BaseText type="caption">{truncateString(file.name, 30)}</BaseText>
                <BaseText className="FileItemContainer__content--file-size" type="x-small">
                  {formatFileSize(file.size as number)}
                </BaseText>
              </div>
              <div className="FileItemContainer__remove" onClick={() => onRemoveFile(file.uid)}>
                <XIcon width={20} height={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactHelpPreviewFiles;
