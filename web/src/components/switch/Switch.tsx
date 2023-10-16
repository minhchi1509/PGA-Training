import { FC } from 'react';
import { Switch as AntSwitch, SwitchProps } from 'antd';

import './Switch.scss';

interface ISwitchProps extends SwitchProps {
  className?: string;
  onToggleSwitch: (isOn: boolean) => void;
}

const Switch: FC<ISwitchProps> = ({ className, onToggleSwitch, ...rest }) => {
  return <AntSwitch className={`Switch ${className && ''}`} onChange={onToggleSwitch} {...rest} />;
};

export default Switch;
