import { notification } from 'antd';
import { ReactNode } from 'react';
import { IconError, IconSuccess, IconWarning } from 'src/assets/icons';
type NotificationType = 'success' | 'warning' | 'error';
import './Toast.scss';

export function showToast(type: NotificationType, message: ReactNode, callback?: () => void) {
  let icon = <IconSuccess />;
  if (type === 'error') {
    icon = <IconError />;
  }
  if (type === 'warning') {
    icon = <IconWarning />;
  }

  notification.open({
    message: null,
    description: message,
    duration: 3,
    className: `ant-notification-notice ${type}`,
    onClick: () => {
      if (callback) {
        callback();
      }
    },
    icon,
    closeIcon: <></>,
    style: { maxWidth: 560 },
  });
}

export function showSuccessToast(message: ReactNode, callback?: () => void) {
  showToast('success', message, callback);
}

export function showErrorToast(message: string, callback?: () => void) {
  showToast('error', message, callback);
}

export function showWarningToast(message: string, callback?: () => void) {
  showToast('warning', message, callback);
}
