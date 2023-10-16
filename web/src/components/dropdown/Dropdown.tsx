import { Dropdown as AntDropdown, DropDownProps } from 'antd';
import { ChevronDownIcon } from 'src/assets/icons';
import Button from '../button';
import './Dropdown.scss';

interface IProps extends DropDownProps {
  title?: string;
}

const renderDefaultButton = (open?: boolean, title?: string) => {
  return (
    <Button style={{ width: '100%', justifyContent: 'space-between' }}>
      {title ?? 'Dropdown'} <ChevronDownIcon style={{ rotate: open ? '180deg' : '' }} />
    </Button>
  );
};

const Dropdown = ({ className, title, children, ...rest }: IProps) => {
  return (
    <AntDropdown className={`Dropdown ${className ?? ''}`} {...rest}>
      {children ?? renderDefaultButton(rest.visible, title)}
    </AntDropdown>
  );
};

export default Dropdown;
