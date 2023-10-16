import { ClockCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Image, Space } from 'antd';
import dayjs from 'dayjs';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import { DragIcon, RepeatIcon } from 'src/assets/icons';
import StatusBox from 'src/components/status-box';
import { BaseText } from 'src/components/typography';
import { EHomeworkType, TTaskItemData } from 'src/interfaces/clients-interface';
import { TMouseEventDivHandler } from 'src/interfaces/common-interface';
import { getThumbnailYoutube } from 'src/utils/common-utils';
import { EHomeworkStatus } from 'src/variables/enum-variables';
import './TaskItem.scss';

interface IProps {
  className?: string;
  data: TTaskItemData;
  draggable?: boolean;
  noBorder?: boolean;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  disabledDrag?: boolean;
  canDelete?: boolean;
  onClick?: (item: TTaskItemData) => void;
  onRemove?: (item: TTaskItemData) => void;
}

const TaskItem = ({
  className,
  data,
  draggable,
  noBorder,
  provided,
  disabledDrag,
  canDelete,
  onRemove,
  onClick,
}: IProps) => {
  const {
    type,
    title,
    startDate,
    endDate,
    repeat,
    assigned,
    videoUrl,
    description,
    showPreviewImg,
    status,
    resultStatus,
  } = data;

  const canBeDeleted = (status === EHomeworkStatus.ACTIVE && onRemove) || canDelete;

  const handleClickRemove: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    onRemove?.(data);
  };

  const handleClickItem = (e: TMouseEventDivHandler) => {
    e.stopPropagation();
    onClick?.(data);
  };

  return (
    <div
      className={`TaskItem ${type ?? ''} ${disabledDrag ? 'disabledDrag' : ''} ${assigned ? 'assigned' : ''} ${
        noBorder ? 'noBorder' : ''
      } ${className ?? ''}`}
      ref={provided?.innerRef}
      onClick={(e) => handleClickItem(e)}
      {...provided?.draggableProps}
      {...(draggable && provided?.dragHandleProps)}
      style={{ ...provided?.draggableProps.style, cursor: onClick ? 'pointer' : 'auto' }}
    >
      <div className="TaskItem__left">
        {draggable && (
          <div className="TaskItem__left-dragIcon">
            <DragIcon style={{ cursor: !disabledDrag ? 'grab' : 'not-allowed' }} />
          </div>
        )}
        <Space size={10}>
          {type === EHomeworkType.VIDEOS && showPreviewImg && (
            <Image
              src={getThumbnailYoutube(videoUrl ?? '')}
              width={100}
              height={70}
              style={{ borderRadius: 8 }}
              preview={false}
            />
          )}
          <Space direction="vertical" size={!assigned && type === EHomeworkType.VIDEOS && showPreviewImg ? 4 : 6}>
            <BaseText type="body1" className="TaskItem__title">
              {title}
            </BaseText>
            {assigned && (
              <div className="TaskItem__left-details">
                {!resultStatus && (
                  <>
                    <ClockCircleOutlined className="TaskItem__left-details-icon" />
                    {startDate && dayjs(startDate).utc(true).format('MMM DD')}
                    {endDate && ` - ${dayjs(endDate).utc(true).format('MMM DD')}`}
                    {repeat && <RepeatIcon className="TaskItem__left-details-repeat" />}
                  </>
                )}
                {!!resultStatus && <StatusBox status={resultStatus} />}
              </div>
            )}

            {!assigned && type === EHomeworkType.VIDEOS && showPreviewImg && (
              <BaseText className="TaskItem__left-description" type="caption">
                {description ?? ''}
              </BaseText>
            )}
          </Space>
        </Space>
      </div>
      {canBeDeleted && <MinusCircleOutlined style={{ fontSize: 24, color: '#BFC8D7' }} onClick={handleClickRemove} />}
    </div>
  );
};

export default TaskItem;
