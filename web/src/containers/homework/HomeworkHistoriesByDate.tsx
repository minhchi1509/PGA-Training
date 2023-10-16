import { ClockCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import { BaseText } from 'src/components/typography';
import { THomeworkHistory, TTaskItemData } from 'src/interfaces/clients-interface';
import { EHomeworkResultStatus } from 'src/variables/enum-variables';
import './HomeworkHistoriesByDate.scss';
import TaskItem from './TaskItem';

interface IProps {
  date: string;
  historyItems: THomeworkHistory[];
  onClickItem: (item: TTaskItemData) => void;
}

const HomeworkHistoriesByDate = ({ date, historyItems, onClickItem }: IProps) => {
  const formattedItems = historyItems.map((item) => ({
    id: item.id,
    homeworkAssignId: item.homeworkAssignId,
    title: item.homeworkTitle,
    type: item.homeworkType,
    resultStatus: item.status as EHomeworkResultStatus,
    assigned: true,
    timezone: item.timezone,
  }));

  return (
    <div className="HomeworkHistoriesByDate" id={date}>
      <Space size={6} className="HomeworkHistoriesByDate__header">
        <ClockCircleOutlined className="HomeworkHistoriesByDate__iconClock" />
        <BaseText type="button">{date}</BaseText>
      </Space>
      <div className="HomeworkHistoriesByDate__list">
        {formattedItems.map((item) => (
          <TaskItem data={item} key={item.id} onClick={onClickItem} />
        ))}
      </div>
    </div>
  );
};

export default HomeworkHistoriesByDate;
