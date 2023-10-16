import ReactPlayer from 'react-player';

import { TimeIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { EHomeworkType, THomework } from 'src/interfaces/clients-interface';
import './HomeworkInfo.scss';
import { HomeworkTypeActivity, HomeworkTypeQuestionnaire, HomeworkTypeTask } from 'src/assets/images';

interface IProps {
  homework?: THomework;
}

const HomeworkInfo = ({ homework }: IProps) => {
  const isVideo = homework?.type === EHomeworkType.VIDEOS;
  const isActivity = homework?.type === EHomeworkType.ACTIVITIES;
  const isQuestionnaire = homework?.type === EHomeworkType.QUESTIONNAIRES;
  const isTask = homework?.type === EHomeworkType.WRITTEN_TASKS;

  if (!isVideo)
    return (
      <div className="HomeworkInfo__others">
        <div className="HomeworkInfo__others-title">
          {isActivity && <img src={HomeworkTypeActivity} />}
          {isQuestionnaire && <img src={HomeworkTypeQuestionnaire} />}
          {isTask && <img src={HomeworkTypeTask} />}
          <BaseText type="subHeading">{homework?.title}</BaseText>
        </div>
        <BaseText type="body1" className="HomeworkInfo__others-description" textAlign="left">
          {homework?.description}
        </BaseText>
      </div>
    );

  return (
    <div className="HomeworkInfo__video">
      <ReactPlayer
        width={640}
        height={448}
        style={{ borderRadius: 8, overflow: 'hidden' }}
        controls
        url={homework?.videoLink ?? ''}
      />
      <div className="HomeworkInfo__video-info">
        <BaseText type="subHeading">{homework?.title}</BaseText>
        <BaseText type="body1" className="HomeworkInfo__video-info-description">
          {homework?.description}
        </BaseText>
        <div className="HomeworkInfo__video-info-time">
          <TimeIcon />
          <BaseText type="caption">Reminder at</BaseText>
          <BaseText type="caption" className="HomeworkInfo__video-info-hour">
            {homework?.reminderAtFormat?.time ?? '12:00'} {homework?.reminderAtFormat?.period ?? 'AM'}
          </BaseText>
        </div>
      </div>
    </div>
  );
};

export default HomeworkInfo;
