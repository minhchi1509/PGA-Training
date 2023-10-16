import { Divider } from 'antd';
import { useSelector } from 'react-redux';

import Collapse from 'src/components/collapse';
import { BaseText } from 'src/components/typography';
import { EHomeworkType } from 'src/interfaces/clients-interface';
import { TCollapseItem } from 'src/interfaces/common-interface';
import { THomeworkTopic } from 'src/interfaces/homework-topics';
import { TRootState } from 'src/stores';
import { HOMEWORK_TOPICS_TYPES, HOMEWORK_TYPE_LABEL } from 'src/variables/client';
import './AssignHomeworkTopic.scss';
import { PlusOutlined } from '@ant-design/icons';

interface IProps {
  className?: string;
  selectedTopic: THomeworkTopic;
  onClickTopic: (item: THomeworkTopic) => void;
  onClickNewTopic?: (homeworkType: EHomeworkType) => void;
  haveNewTopicButton?: boolean;
}

const renderTopicHeader = (key: EHomeworkType, active?: boolean) => {
  return (
    <div className={`AssignHomeworkTopic__header ${active ? 'active' : ''}`}>
      <Divider type="vertical" className={`AssignHomeworkTopic__header-divider ${key}`} />
      <BaseText type="button">{HOMEWORK_TYPE_LABEL[key]}</BaseText>
    </div>
  );
};

const renderTopicContent = (
  homeworkType: EHomeworkType,
  items: THomeworkTopic[],
  selectedTopic: THomeworkTopic,
  haveNewTopicButton: boolean,
  onClick: (item: THomeworkTopic) => void,
  onClickNewTopic?: (homeworkType: EHomeworkType) => void,
) => {
  return (
    <div id="scrollableDiv" className="AssignHomeworkTopic__scrollableDiv">
      {haveNewTopicButton && (
        <div
          className={`AssignHomeworkTopic__content add-topic`}
          onClick={() => (onClickNewTopic ? onClickNewTopic(homeworkType) : null)}
        >
          <PlusOutlined width={12} height={12} /> Add topic
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          className={`AssignHomeworkTopic__content ${selectedTopic?.id === item.id ? 'active' : ''}`}
          onClick={() => onClick(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

const AssignHomeworkTopic = ({
  className,
  selectedTopic,
  onClickTopic,
  onClickNewTopic,
  haveNewTopicButton = false,
}: IProps) => {
  const { activityTopics, questionnairesTopics, writtenTasksTopics, videosTopics } = useSelector(
    (state: TRootState) => ({
      activityTopics: state.homeworkTopics.activityTopics,
      questionnairesTopics: state.homeworkTopics.questionnairesTopics,
      writtenTasksTopics: state.homeworkTopics.writtenTasksTopics,
      videosTopics: state.homeworkTopics.videosTopics,
    }),
  );

  const showTopics = {
    [EHomeworkType.ACTIVITIES]: activityTopics,
    [EHomeworkType.QUESTIONNAIRES]: questionnairesTopics,
    [EHomeworkType.WRITTEN_TASKS]: writtenTasksTopics,
    [EHomeworkType.VIDEOS]: videosTopics,
  };

  const collapseItems: TCollapseItem[] = HOMEWORK_TOPICS_TYPES.map((homeworkType) => ({
    key: homeworkType,
    header: renderTopicHeader(homeworkType, selectedTopic?.homeworkType === homeworkType),
    content: renderTopicContent(
      homeworkType,
      showTopics[homeworkType].data,
      selectedTopic,
      haveNewTopicButton,
      onClickTopic,
      onClickNewTopic,
    ),
  }));

  const handleChangeCollapse = (key: string[] | string) => {
    const activeKey = key[0];

    if (selectedTopic?.homeworkType === activeKey) return;

    const defaultSelectedTopic = showTopics[activeKey]?.data[0];
    defaultSelectedTopic && onClickTopic(defaultSelectedTopic);
  };

  return (
    <div className={`AssignHomeworkTopic ${className ?? ''}`}>
      <Collapse items={collapseItems} defaultActiveKey={EHomeworkType.ACTIVITIES} onChange={handleChangeCollapse} />
    </div>
  );
};

export default AssignHomeworkTopic;
