import { AlertProps as AlertAntdProps } from 'antd';

import './Alert.scss';
import { BaseText } from '../typography';
import { InforWarningIcon } from 'src/assets/icons';

const Icon = {
  warning: <InforWarningIcon className="Alert__icon" width={20} />,
};

interface IAlertProps extends AlertAntdProps {
  type: 'success' | 'info' | 'warning' | 'error';
}

const Alert = (props: IAlertProps) => {
  const { message, type } = props;
  return (
    <div className={`Alert Alert__${type}`}>
      {Icon[type]}
      <BaseText type="caption" className="Alert__title">
        {message}
      </BaseText>
    </div>
  );
};

export default Alert;
