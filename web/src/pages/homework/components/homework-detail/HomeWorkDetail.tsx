import { Button, Modal, ModalProps, Space } from 'antd';
import { useRef } from 'react';
import ReactPlayer from 'react-player';

import { TimeIcon } from 'src/assets/icons';
import { BaseText } from 'src/components/typography';
import { ETimePeriod } from 'src/variables/enum-variables';
import './HomeWorkDetail.scss';
import { EHomeworkType } from 'src/interfaces/clients-interface';
import { HomeworkTypeActivity, HomeworkTypeQuestionnaire, HomeworkTypeTask } from 'src/assets/images';

interface IHomeWorkDetailProps extends ModalProps {
  name: string;
  title: string;
  description: string;
  reminderAt?: { time: string; period: ETimePeriod };
  videoUrl?: string;
  type: EHomeworkType;
  onClose: () => void;
}

const HomeWorkDetail = (props: IHomeWorkDetailProps) => {
  const videoRef = useRef<ReactPlayer>(null);
  const { name, title, description, className, reminderAt, videoUrl, type, onClose, ...rest } = props;
  const isActivity = type === EHomeworkType.ACTIVITIES;
  const isQuestionnaire = type === EHomeworkType.QUESTIONNAIRES;
  const isTask = type === EHomeworkType.WRITTEN_TASKS;

  return (
    <Modal
      centered
      closable={false}
      footer={null}
      width={videoUrl ? 1024 : 370}
      className={`HomeWorkDetail ${videoUrl ? 'video' : ''} ${className ?? ''}`}
      afterClose={() => {
        videoRef?.current?.seekTo(0);
      }}
      {...rest}
    >
      <Space direction="vertical" className="HomeWorkDetail__wrapper">
        <BaseText type="title" className="title">
          {name}
        </BaseText>
        <div className="HomeWorkDetail__body">
          {videoUrl && (
            <>
              <ReactPlayer
                url={videoUrl}
                width={640}
                height={448}
                style={{ borderRadius: 8, overflow: 'hidden' }}
                controls
                ref={videoRef}
              />
              <div className="HomeWorkDetail__body-videoContent">
                <BaseText type="subHeading">{title}</BaseText>
                <BaseText type="body1" className="HomeWorkDetail__body-description">
                  {description}
                </BaseText>
                <div className="HomeWorkDetail__body-time">
                  <TimeIcon />
                  <BaseText type="caption">Reminder at</BaseText>
                  <BaseText type="caption" className="HomeWorkDetail__body-hour">
                    {reminderAt?.time ?? '12:00'} {reminderAt?.period ?? 'AM'}
                  </BaseText>
                </div>
              </div>
            </>
          )}
          {!videoUrl && (
            <>
              <div className="HomeWorkDetail__body-title">
                <div>
                  {isActivity && <img src={HomeworkTypeActivity} />}
                  {isQuestionnaire && <img src={HomeworkTypeQuestionnaire} />}
                  {isTask && <img src={HomeworkTypeTask} />}
                </div>
                <BaseText type="subHeading" textAlign="left">
                  {title}
                </BaseText>
              </div>
              <BaseText type="body1" className="HomeWorkDetail__body-description" textAlign="left">
                {description}
              </BaseText>
              <div className="HomeWorkDetail__body-time">
                <TimeIcon />
                <BaseText type="caption">Reminder at</BaseText>
                <BaseText type="caption" className="HomeWorkDetail__body-hour">
                  {reminderAt?.time ?? '12:00'} {reminderAt?.period ?? 'AM'}
                </BaseText>
              </div>
            </>
          )}
        </div>
        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <Button type="primary" onClick={onClose} size="large" className={`button`}>
            <BaseText>Close</BaseText>
          </Button>
        </div>
      </Space>
    </Modal>
  );
};

export default HomeWorkDetail;
