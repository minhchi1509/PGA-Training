import { Tabs as AntTabs, TabsProps } from 'antd';

import './Tabs.scss';

interface IProps extends TabsProps {
  hideHeader?: boolean;
}

const Tabs = ({ className, ...rest }: IProps) => {
  return <AntTabs className={`Tabs ${className ?? ''}`} {...rest} />;
};

export default Tabs;
