import { AttachmentIcon, EmotionIcon } from 'src/assets/icons';
import Image, { ImageMask, ImageWithMask } from 'src/components/image';
import { BaseText } from 'src/components/typography';
import { EHomeworkType, TActivityData } from 'src/interfaces/clients-interface';
import { TFile } from 'src/interfaces/common-interface';
import { EFileType } from 'src/variables/enum-variables';
import './ActivityCard.scss';

interface IProps {
  type?: 'result' | 'comment';
  data: TActivityData;
  className?: string;
  isCard?: boolean;
  children?: React.ReactNode;
  downloading?: boolean;
  onDownload?: (fileId: string, fileName?: string) => void;
  onPreviewFiles?: (files: TFile[], index?: number) => void;
}

type ICommonActivityContentProps = IProps;

const DEFAULT_TITLE = {
  result: 'Result',
  comment: `Client's comment`,
};

const DEFAULT_BORDERED_TITLE = {
  result: 'Homework Result',
  comment: `Client's comment`,
};

const HAS_VIDEO_HOMEWORK_TYPES = [EHomeworkType.ACTIVITIES, EHomeworkType.WRITTEN_TASKS];

const CommonActivityContent = ({
  type,
  data,
  isCard,
  downloading,
  onPreviewFiles,
  onDownload,
}: ICommonActivityContentProps) => {
  const showFileAttachments =
    data.homeworkType && HAS_VIDEO_HOMEWORK_TYPES.includes(data.homeworkType) && data.filesUrls?.length;

  return (
    <div className="ActivityCard__commonContent">
      {type === 'result' && (
        <>
          {data.resultText && (
            <BaseText
              className="ActivityCard__commonContent-borderedText"
              type="body1"
              dangerouslyText={data.resultText}
            />
          )}

          {showFileAttachments && (
            <div className="ActivityCard__commonContent-files">
              <AttachmentIcon className="ActivityCard__commonContent-files-icon" />
              <BaseText type="caption">
                {data.filesUrls?.length} file attachment{Number(data.filesUrls?.length) > 1 ? 's' : ''}
              </BaseText>
            </div>
          )}

          {!isCard && data.filesUrls?.length && (
            <div className="ActivityCard__commonContent-files">
              {data.filesUrls?.map((file, index) => (
                <>
                  {file.type === EFileType.IMAGE && (
                    <Image
                      className="ActivityCard__commonContent-file"
                      key={file.url}
                      src={file.url}
                      width={70}
                      height={70}
                      preview={{
                        mask: (
                          <ImageMask
                            downloading={downloading}
                            onDownload={() => onDownload?.(file.id, file.originalName)}
                            onPreview={() => onPreviewFiles?.(data.filesUrls as TFile[], index)}
                          />
                        ),
                      }}
                    />
                  )}

                  {file.type === EFileType.VIDEO && (
                    <ImageWithMask
                      videoUrl={file.url}
                      key={file.url}
                      size={70}
                      mask={
                        <ImageMask
                          downloading={downloading}
                          onDownload={() => onDownload?.(file.id, file.originalName)}
                          onPreview={() => onPreviewFiles?.(data.filesUrls as TFile[], index)}
                        />
                      }
                    />
                  )}
                </>
              ))}
            </div>
          )}
        </>
      )}
      {type === 'comment' && (
        <div className="ActivityCard__commonContent-comment">
          {data.rate && <EmotionIcon rate={data.rate} />}
          {(data.comment || data.rejectText) && (
            <BaseText
              className="ActivityCard__commonContent-borderedText comment"
              type="body1"
              dangerouslyText={data.comment ?? data.rejectText ?? ''}
            />
          )}
        </div>
      )}
    </div>
  );
};

const ActivityCard = ({
  type = 'result',
  className,
  isCard = true,
  data,
  children,
  downloading,
  onPreviewFiles,
  onDownload,
}: IProps) => {
  const text = (type === 'result' ? data.resultText : data.comment || data.rejectText || data.rate) || data.title;
  const title = data.title ? data.title : isCard ? DEFAULT_TITLE[type] : DEFAULT_BORDERED_TITLE[type];

  return (
    <div className={`ActivityCard ${type} ${className ?? ''} ${isCard ? 'card' : ''}`}>
      {text && (
        <div className="ActivityCard__header">
          <div className="ActivityCard__header-divider" />
          <BaseText type="button">{title}</BaseText>
        </div>
      )}

      {children ? (
        children
      ) : (
        <CommonActivityContent
          type={type}
          data={data}
          isCard={isCard}
          downloading={downloading}
          onPreviewFiles={onPreviewFiles}
          onDownload={onDownload}
        />
      )}
    </div>
  );
};

export default ActivityCard;
