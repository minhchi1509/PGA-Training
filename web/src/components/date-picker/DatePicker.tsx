import { DatePicker as AntDatePicker, DatePickerProps } from 'antd';

import './DatePicker.scss';

const DatePicker = ({ className, ...rest }: DatePickerProps) => {
  const datePickerClassName = `DatePicker ${className ?? ''} `;

  return <AntDatePicker className={datePickerClassName} format="DD/MM/YYYY" {...rest} />;
};

export default DatePicker;
