import { Select as AntSelect, SelectProps } from 'antd';

import { ChevronDownIcon } from 'src/assets/icons';
import './Select.scss';

type IProps = SelectProps;

const Select = ({ className, ...rest }: IProps) => {
  return <AntSelect className={`Select ${className ?? ''}`} suffixIcon={<ChevronDownIcon />} {...rest} />;
};

export default Select;
