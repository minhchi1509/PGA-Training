import { Image } from 'antd';

import './HomeworkVideoRow.scss';
import { HomeworkDeleteIcon, HomeworkEditIcon } from 'src/assets/icons';
import { getThumbnailYoutube } from 'src/utils/common-utils';
import { BaseText } from 'src/components/typography';

interface IHomeworkVideoRowProps {
  title: string;
  description: string;
  video?: string | null;
  hasEditIcon?: boolean;
  hasDeleteIcon?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  handleClickVideoRow?: () => void;
}

const HomeworkVideoRow = ({
  title,
  description,
  video,
  hasEditIcon,
  hasDeleteIcon,
  onDelete,
  onEdit,
  handleClickVideoRow,
}: IHomeworkVideoRowProps) => {
  return (
    <div className="HomeworkVideoRow" onClick={handleClickVideoRow}>
      <Image
        src={getThumbnailYoutube(video || '')}
        preview={false}
        className="HomeworkVideoRow__thumbnail"
        height={110}
        width="100%"
      />
      <div className="HomeworkVideoRow__content">
        <BaseText type="body1" className="HomeworkVideoRow__content-title">
          {title}
        </BaseText>
        <BaseText type="caption" className="HomeworkVideoRow__content-description">
          {description}
        </BaseText>
      </div>
      <div className="HomeworkVideoRow__icons">
        {hasEditIcon && (
          <HomeworkEditIcon
            onClick={(e) => {
              onEdit && onEdit();
              e.stopPropagation();
            }}
          />
        )}
        {hasDeleteIcon && (
          <HomeworkDeleteIcon
            onClick={(e) => {
              onDelete && onDelete();
              e.stopPropagation();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HomeworkVideoRow;
