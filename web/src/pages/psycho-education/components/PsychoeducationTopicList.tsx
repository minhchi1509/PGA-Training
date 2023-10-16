import { Empty, Skeleton } from 'antd';

import { TPsychoEduTopic } from 'src/interfaces/psychoeducation-interface';
import './PsychoeducationTopicList.scss';

interface IProps {
  loading: boolean;
  topics: TPsychoEduTopic[];
  selectedTopic?: TPsychoEduTopic;
  onClickTopic: (topic: TPsychoEduTopic) => void;
}

const PsychoeducationTopicList = ({ loading, topics, selectedTopic, onClickTopic }: IProps) => {
  return (
    <div className={`PsychoeducationTopicList custom-scrollbar`}>
      {loading ? (
        <Skeleton />
      ) : !topics?.length ? (
        <Empty description="No Topics" />
      ) : (
        topics.map((topic) => (
          <div
            key={topic.id}
            className={`PsychoeducationTopicList__item ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
            onClick={() => onClickTopic(topic)}
          >
            {topic.name}
          </div>
        ))
      )}
    </div>
  );
};

export default PsychoeducationTopicList;
