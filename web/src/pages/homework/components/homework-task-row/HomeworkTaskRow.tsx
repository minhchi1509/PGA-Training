import { HomeworkDeleteIcon, HomeworkEditIcon } from 'src/assets/icons';

import './HomeworkTaskRow.scss';
import { EHomeworkType } from 'src/interfaces/clients-interface';
import { BaseText } from 'src/components/typography';

interface IHomeworkTaskProps {
  type: EHomeworkType.ACTIVITIES | EHomeworkType.QUESTIONNAIRES | EHomeworkType.WRITTEN_TASKS;
  text: string;
  hasEditIcon?: boolean;
  hasDeleteIcon?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  handleClickTaskRow?: () => void;
}

const HomeworkTaskRow = ({
  type,
  text,
  hasEditIcon,
  hasDeleteIcon,
  onDelete,
  onEdit,
  handleClickTaskRow,
}: IHomeworkTaskProps) => {
  return (
    <div className={`HomeworkTaskRow ${type}`} onClick={handleClickTaskRow}>
      <BaseText type="body1">{text}</BaseText>
      <div className="HomeworkTaskRow__icons">
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

export default HomeworkTaskRow;
