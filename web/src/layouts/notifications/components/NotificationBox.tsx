import { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { List } from 'antd';

import './NotificationBox.scss';
import { BaseText } from 'src/components/typography';
import { TNotification } from 'src/interfaces/notification-interface';
import NotificationItem from './NotificationItem';
import { getNotifications } from 'src/services/notification-service';
import { LoaderIcon } from 'src/assets/icons';
import { DEFAULT_GET_LIST_PARAMS } from 'src/variables/common';
import { TCommonGetListParams } from 'src/interfaces/common-interface';

interface INotificationBoxProps {
  id: string;
  onClickToNotificationItem: (notificationItem: TNotification) => Promise<void>;
}

const NotificationBox: FC<INotificationBoxProps> = ({ id, onClickToNotificationItem }) => {
  const [isFetchingNotifications, setIsFetchingNotifications] = useState<boolean>(false);
  const [currentNotificationList, setCurrentNotificationList] = useState<TNotification[]>([]);
  const [hasMoreNotifications, setHasMoreNotifications] = useState<boolean>(true);
  const [filterParams, setFilterParams] = useState<TCommonGetListParams>(DEFAULT_GET_LIST_PARAMS);

  const todayNotifications = currentNotificationList.filter((notification) =>
    dayjs().isSame(notification.createdAt, 'day'),
  );

  const earlierNotifications = currentNotificationList.filter(
    (notification) => !dayjs().isSame(notification.createdAt, 'day'),
  );

  const loadMoreNotifications = async (filterParams: TCommonGetListParams) => {
    setIsFetchingNotifications(true);
    const notificationsResponse = await getNotifications(filterParams);
    setCurrentNotificationList([...currentNotificationList, ...notificationsResponse.data]);
    setIsFetchingNotifications(false);
    if (notificationsResponse.data.length === 0 || notificationsResponse.data.length < DEFAULT_GET_LIST_PARAMS.size) {
      setHasMoreNotifications(false);
      return;
    }
    const newFilter = { ...filterParams, page: filterParams.page + 1 };
    setFilterParams({ ...filterParams, ...newFilter });
  };

  const handleScroll = () => {
    const scrollableElement = document.getElementById(id);
    if (scrollableElement) {
      const scrollTop = scrollableElement.scrollTop;
      const clientHeight = scrollableElement.clientHeight;
      const scrollHeight = scrollableElement.scrollHeight;
      if (Math.ceil(scrollTop + clientHeight) === scrollHeight) {
        if (hasMoreNotifications && !isFetchingNotifications) {
          loadMoreNotifications(filterParams);
        }
      }
    }
  };

  useEffect(() => {
    loadMoreNotifications(filterParams);
  }, []);

  return (
    <div className="NotificationBox" id={id} onScroll={handleScroll}>
      <div>
        {todayNotifications.length > 0 && (
          <>
            <BaseText type="subHeading" textAlign="left" className="NotificationBox__today">
              Today
            </BaseText>
            <List
              dataSource={todayNotifications}
              renderItem={(item) => (
                <NotificationItem
                  notificationItemDetail={item}
                  key={item.id}
                  onClickToNotificationItem={onClickToNotificationItem}
                />
              )}
            />
          </>
        )}
        {earlierNotifications.length > 0 && (
          <>
            <BaseText
              type="subHeading"
              textAlign="left"
              className={`NotificationBox__earlier ${
                todayNotifications.length > 0 ? 'NotificationBox__earlier--margin-top' : ''
              }`}
            >
              Earlier
            </BaseText>
            <List
              dataSource={earlierNotifications}
              renderItem={(item) => (
                <NotificationItem
                  notificationItemDetail={item}
                  key={item.id}
                  onClickToNotificationItem={onClickToNotificationItem}
                />
              )}
            />
          </>
        )}
      </div>
      {todayNotifications.length === 0 && earlierNotifications.length === 0 && !isFetchingNotifications && (
        <BaseText textAlign="center" type="body2">
          There are no notifications
        </BaseText>
      )}
      {isFetchingNotifications && (
        <div className="NotificationBox__loading">
          <LoaderIcon className="spin-around" width={24} height={24} />
        </div>
      )}
    </div>
  );
};

export default NotificationBox;
