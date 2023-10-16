import { FileIcon } from 'src/assets/icons';
import Image, { ImageMask, ImageWithMask } from 'src/components/image';
import { TMessageFile } from 'src/interfaces/chat-interface';
import './QuickMessageFiles.scss';
import { TFile } from 'src/interfaces/common-interface';
import { useMemo } from 'react';
import { EFileType } from 'src/variables/enum-variables';

interface IProps {
  files: TMessageFile[];
  className?: string;
  onPreviewFiles: (files: TFile[], fileIndex?: number) => void;
  onDownloadFile: (fileId: string, fileName?: string) => void;
}

const QuickMessageFiles = ({ files, className, onPreviewFiles, onDownloadFile }: IProps) => {
  const formattedFiles = useMemo(() => {
    const showFiles = files.filter((file) => file.mimetype.includes('video') || file.mimetype.includes('image'));
    return showFiles.map((item) => ({
      type: item.mimetype.includes('image') ? EFileType.IMAGE : EFileType.VIDEO,
      url: item.url,
    }));
  }, [files]);

  const handlePreview = (fileIndex: number) => {
    onPreviewFiles(formattedFiles as TFile[], fileIndex);
  };

  return (
    <div className={`QuickMessageFiles ${className ?? ''}`}>
      {files.map((file, index) => {
        const isImageType = file.mimetype?.includes('image');
        const isVideoType = file.mimetype?.includes('video');
        const otherType = !isImageType && !isVideoType;

        return (
          <div className="QuickMessageFiles__item" key={file.id}>
            {isImageType && (
              <Image
                className="QuickMessageFiles__item-file"
                key={file.url}
                src={file.url}
                width={100}
                height={100}
                preview={{
                  mask: (
                    <ImageMask
                      // downloading={downloading}
                      onDownload={() => {
                        onDownloadFile(file.id, file.originalname);
                      }}
                      onPreview={() => handlePreview(index)}
                    />
                  ),
                }}
              />
            )}
            {!isImageType && (
              <ImageWithMask
                videoUrl={isVideoType ? file.url : ''}
                customImage={
                  otherType && (
                    <div className="QuickMessageFiles__item-otherType">
                      <FileIcon />
                      {file.originalname?.split('.').pop()}
                    </div>
                  )
                }
                key={file.url}
                size={100}
                mask={
                  <ImageMask
                    // downloading={downloading}
                    preview={!!isVideoType}
                    onDownload={() => {
                      onDownloadFile(file.id, file.originalname);
                    }}
                    onPreview={() => handlePreview(index)}
                  />
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuickMessageFiles;
