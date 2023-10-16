import { FC } from 'react';
import { useSelector } from 'react-redux';

import './NotificationItem.scss';
import { EllipseIcon } from 'src/assets/icons';
import Avatar from 'src/components/avatar';
import { BaseText } from 'src/components/typography';
import { TNotification } from 'src/interfaces/notification-interface';
import { TRootState } from 'src/stores';
import { getTimeToDay } from 'src/utils/common-utils';
import { ENotificationTriggerType, EUserType } from 'src/variables/enum-variables';

interface INotificationItemProps {
  notificationItemDetail: TNotification;
  onClickToNotificationItem: (notificationItem: TNotification) => Promise<void>;
}

const NotificationItem: FC<INotificationItemProps> = ({ notificationItemDetail, onClickToNotificationItem }) => {
  const { senderProfile, senderClient, createdAt, isRead, triggerType, content } = notificationItemDetail;
  const sender = senderProfile ?? senderClient;
  const profile = useSelector((state: TRootState) => state.user.profile);

  const getNotificationText = () => {
    const senderName = `${sender?.firstName} ${sender?.lastName}`;

    switch (triggerType) {
      case ENotificationTriggerType.NEW_MESSAGE:
        return (
          <div>
            <BaseText type="button" inline textAlign="left">
              {senderName}&nbsp;
            </BaseText>
            <BaseText type="body2" inline textAlign="left">
              sent you a message
            </BaseText>
          </div>
        );
      case ENotificationTriggerType.CLIENT_ACCEPT_INVITE:
      case ENotificationTriggerType.PRACTITIONER_ACCEPT_INVITE:
        return (
          <div>
            <BaseText type="button" inline textAlign="left">
              {senderName}&nbsp;
            </BaseText>
            <BaseText type="body2" inline textAlign="left">
              accepted your invitation&nbsp;
            </BaseText>
          </div>
        );
      case ENotificationTriggerType.HOMEWORK_COMPLETED:
        return (
          <div>
            <BaseText type="button" inline textAlign="left">
              {senderName}&nbsp;
            </BaseText>
            <BaseText type="body2" inline textAlign="left">
              has completed one of the assigned homework
            </BaseText>
          </div>
        );
      case ENotificationTriggerType.CLIENT_REALLOCATE:
        return (
          <div>
            <BaseText type="body2" textAlign="left" inline>
              {Number(content)} client{Number(content) > 1 ? 's ' : ' '}
              {Number(content) > 1 ? 'have' : 'has'} been allocated to you by clinic {profile?.clinic?.name}
            </BaseText>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div className="NotificationItem" onClick={() => onClickToNotificationItem(notificationItemDetail)}>
      <div className="NotificationItem__avatar">
        <Avatar src={sender?.avatar} />
      </div>
      <div className="NotificationItem__content">
        {getNotificationText()}
        <BaseText type="x-small" inline textAlign="left" className="NotificationItem__content-time">
          {getTimeToDay(createdAt)}
        </BaseText>
      </div>
      <div className="NotificationItem__dot">{!isRead && <EllipseIcon width={10} height={10} />}</div>
    </div>
  );
};

export default NotificationItem;
