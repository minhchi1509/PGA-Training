import { TimePicker as AntTimePicker, TimePickerProps } from 'antd';

import './TimePicker.scss';

const TimePicker = ({ className, ...rest }: TimePickerProps) => {
  const TimePickerClassName = `TimePicker ${className ?? ''} `;

  return <AntTimePicker className={TimePickerClassName} format="DD/MM/YYYY" {...rest} />;
};

export default TimePicker;
