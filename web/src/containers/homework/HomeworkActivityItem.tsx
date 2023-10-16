import { ClockCircleOutlined } from '@ant-design/icons';

import { BaseText } from 'src/components/typography';
import { EHomeworkType, TActivityData } from 'src/interfaces/clients-interface';
import './HomeworkActivityItem.scss';
import ActivityCard from './ActivityCard';
import dayjs from 'dayjs';
import { DATE_FORMAT } from 'src/variables/common';
import Button from 'src/components/button';
import StatusBox from 'src/components/status-box';
import { EHomeworkResultStatus } from 'src/variables/enum-variables';
import SummaryTable from './SummaryTable';

interface IProps {
  data: TActivityData;
  isCard?: boolean;
  children?: React.ReactNode;
  onClickViewDetails?: (data: TActivityData) => void;
}

const HomeworkActivityItem = ({ data, isCard = true, children, onClickViewDetails }: IProps) => {
  const isRejected = data.status === EHomeworkResultStatus.REJECTED;
  const isSkipped = data.status === EHomeworkResultStatus.SKIPPED;
  const isCompleted = data.status === EHomeworkResultStatus.COMPLETED;
  const showStatus = isRejected || isSkipped;
  const showContent = data.comment || data.rejectText || data.resultText || data.rate || data.specialResult?.summary;
  const showViewDetailButton =
    ((showContent && onClickViewDetails) || (data.homeworkType === EHomeworkType.QUESTIONNAIRES && isCard)) &&
    !isSkipped;

  return (
    <div className={`HomeworkActivityItem ${isCard ? 'card' : 'bordered'}`}>
      <div className="HomeworkActivityItem__header">
        <div className="HomeworkActivityItem__header-left">
          <ClockCircleOutlined className={`HomeworkActivityItem__header-left-icon ${isRejected ? 'rejected' : ''}`} />
          <BaseText type="subHeading">
            {dayjs(data.createdAt).format(DATE_FORMAT.HUMAN_READABLE_DATE)}&nbsp;&nbsp;
            {dayjs(data.createdAt).format(DATE_FORMAT.HUMAN_READABLE_TIME)}
          </BaseText>
          {isCompleted && <StatusBox status={data.status ?? ''} />}
        </div>
        {!showStatus ? (
          showViewDetailButton && (
            <Button
              type="link"
              size="small"
              className="HomeworkActivityItem__header-action"
              onClick={() => onClickViewDetails?.(data)}
            >
              View details
            </Button>
          )
        ) : (
          <StatusBox status={data.status ?? ''} />
        )}
      </div>
      {children
        ? children
        : showContent && (
            <div className="HomeworkActivityItem__content">
              {data.resultText && <ActivityCard data={data} isCard={isCard} />}
              {data.specialResult && (
                <ActivityCard data={{ title: 'Result', id: 'fake Id' }}>
                  <SummaryTable data={data.specialResult.summary} />
                </ActivityCard>
              )}
              {(data.comment || data.rejectText || data.rate) && (
                <ActivityCard type="comment" isCard={isCard} data={data} />
              )}
            </div>
          )}
    </div>
  );
};

export default HomeworkActivityItem;
