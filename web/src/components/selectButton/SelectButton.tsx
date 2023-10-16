import { Select as AntSelect, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import './SelectButton.scss';

interface ISelectProps extends SelectProps {
  placeHolder?: undefined | string;
  defaultValue?: string | null | undefined;
  onSelect?: (value: string | null | undefined) => void;
  data: DefaultOptionType[] | undefined;
}

const SelectButton = ({ defaultValue, data, onSelect, className, ...rest }: ISelectProps) => {
  return (
    <AntSelect
      className={`SelectButton ${className ?? ''}`}
      defaultValue={defaultValue}
      onChange={(value) => {
        if (onSelect) {
          onSelect(value);
        }
      }}
      options={data}
      {...rest}
      size="large"
    />
  );
};

export default SelectButton;
