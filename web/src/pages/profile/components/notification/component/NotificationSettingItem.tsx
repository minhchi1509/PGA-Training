import { FC } from 'react';

import './NotificationSettingItem.scss';
import { BaseText } from 'src/components/typography';
import Switch from 'src/components/switch';

interface INotificationSettingItemProps {
  label: string;
  notificationSettingType: string;
  isChecked?: boolean;
  isLoading?: boolean;
  onUpdateNotificationSettingStatus: (isTurnOn: boolean, notificationSettingType: string) => Promise<void>;
}

const NotificationSettingItem: FC<INotificationSettingItemProps> = ({
  label,
  isChecked,
  isLoading,
  notificationSettingType,
  onUpdateNotificationSettingStatus,
}) => {
  return (
    <div className="NotificationSettingItem">
      <BaseText type="body2">{label}</BaseText>
      <Switch
        checked={isChecked}
        loading={isLoading}
        onToggleSwitch={(isOn) => onUpdateNotificationSettingStatus(isOn, notificationSettingType)}
      />
    </div>
  );
};

export default NotificationSettingItem;
