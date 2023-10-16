import { useState } from 'react';
import { useSelector } from 'react-redux';

import './Notification.scss';
import { TRootState, useAppDispatch } from 'src/stores';
import { EUserType } from 'src/variables/enum-variables';
import {
  OWNER_PROFILE_NOTIFICATION_SETTING_LABEL,
  PRACTITIONER_PROFILE_NOTIFICATION_SETTING_LABEL,
  SOLO_PROFILE_NOTIFICATION_SETTING_LABEL,
} from './notification-setting-constants';
import { getUserProfile } from 'src/stores/user';
import NotificationSettingItem from './component/NotificationSettingItem';
import { settingNotification } from 'src/services/notification-service';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import ResponseError from 'src/interfaces/error-response-interface';

const Notification = () => {
  const dispatch = useAppDispatch();
  const [configNotification, setConfigNotification] = useState<string>();
  const profile = useSelector((state: TRootState) => state.user.profile);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profileNotificationSetting: any = PRACTITIONER_PROFILE_NOTIFICATION_SETTING_LABEL;
  if (profile?.role === EUserType.OWNER) {
    profileNotificationSetting = OWNER_PROFILE_NOTIFICATION_SETTING_LABEL;
  } else if (profile?.role === EUserType.SOLO_PRACTITIONER) {
    profileNotificationSetting = SOLO_PROFILE_NOTIFICATION_SETTING_LABEL;
  }

  const notificationSettingItems = Object.keys(profileNotificationSetting).map((item) => ({
    label: profileNotificationSetting[item] as string,
    notificationSettingType: item,
    isChecked: profile?.notificationConfig[item],
  }));

  const handleUpdateNotificationSettingStatus = async (isTurnOn: boolean, notificationSettingType: string) => {
    const payload = { ...(profile?.notificationConfig || {}) };
    payload[notificationSettingType] = isTurnOn;
    try {
      setConfigNotification(notificationSettingType);
      await settingNotification(payload);
      dispatch(getUserProfile());
      showSuccessToast(`You've successfully updated your notification setting.`);
    } catch (error) {
      const message = (error as ResponseError).message;
      showErrorToast(message);
    } finally {
      setConfigNotification('');
    }
  };

  return (
    <div className="Notification">
      {notificationSettingItems.map((item, index) => (
        <NotificationSettingItem
          key={index}
          {...item}
          isLoading={configNotification === item.notificationSettingType}
          onUpdateNotificationSettingStatus={handleUpdateNotificationSettingStatus}
        />
      ))}
    </div>
  );
};

export default Notification;
