import { useEffect, useState } from 'react';
import { Badge, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';

import './Notifications.scss';
import { BellIcon } from 'src/assets/icons';
import NotificationBox from './components/NotificationBox';
import { TNotification } from 'src/interfaces/notification-interface';
import { EChatMemberType, ENotificationTriggerType } from 'src/variables/enum-variables';
import { RoutePaths } from 'src/routes/routes-constants';
import { getTotalUnreadNotifications, markSeenNotification } from 'src/services/notification-service';
import { onMessageListener } from 'src/configs/firebase-config';
import { useAppDispatch } from 'src/stores';
import { getClientGeneralInfo } from 'src/stores/clients';

const Notifications = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openNotificationPopover, setOpenNotificationPopover] = useState<boolean>(false);
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState<number>(0);

  const handleOpenChange = (newOpen: boolean) => {
    setOpenNotificationPopover(newOpen);
  };

  const fetchTotalUnreadNotifications = async () => {
    const totalUnreadNotificationsData = await getTotalUnreadNotifications();
    setTotalUnreadNotifications(totalUnreadNotificationsData.total);
  };

  const handleClickOnNotificationItem = async (notificationItem: TNotification) => {
    const { senderProfile, senderClient, triggerType } = notificationItem;
    const sender = senderProfile ?? senderClient;

    setOpenNotificationPopover(false);
    await markSeenNotification({ notificationId: notificationItem.id });
    fetchTotalUnreadNotifications();
    switch (triggerType) {
      case ENotificationTriggerType.PRACTITIONER_ACCEPT_INVITE:
        return navigate(RoutePaths.PRACTITIONER_DETAILS(sender?.id || ''), { state: { practitioner: sender } });
      case ENotificationTriggerType.CLIENT_ACCEPT_INVITE:
      case ENotificationTriggerType.HOMEWORK_COMPLETED: {
        const result = await dispatch(getClientGeneralInfo(sender?.id ?? ''));
        if (!result.payload.clientId) return;

        return navigate(RoutePaths.CLIENT_DETAILS(sender?.id), { state: { reload: true } });
      }
      case ENotificationTriggerType.CLIENT_REALLOCATE:
        return navigate(RoutePaths.CLIENTS);
      case ENotificationTriggerType.NEW_MESSAGE: {
        const partnerType = senderClient ? EChatMemberType.CLIENT : sender?.role;
        return navigate(`${RoutePaths.MESSAGES}?partnerId=${sender?.id}&type=${partnerType}`);
      }
      default:
        break;
    }
  };

  const handleVisibilityChange = () => {
    if (document['hidden']) {
      return;
    } else {
      fetchTotalUnreadNotifications();
    }
  };

  useEffect(() => {
    fetchTotalUnreadNotifications();
    onMessageListener(fetchTotalUnreadNotifications);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <Popover
      open={openNotificationPopover}
      onOpenChange={handleOpenChange}
      trigger={['click']}
      placement="bottomRight"
      arrow={false}
      content={<NotificationBox id="NotificationPopover" onClickToNotificationItem={handleClickOnNotificationItem} />}
      overlayClassName="Notifications__Popover"
      className="Notifications"
      destroyTooltipOnHide={true}
    >
      <Badge count={totalUnreadNotifications} dot={!totalUnreadNotifications}>
        <BellIcon />
      </Badge>
    </Popover>
  );
};

export default Notifications;
