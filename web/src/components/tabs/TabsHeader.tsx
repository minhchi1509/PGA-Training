import TabPane from 'antd/es/tabs/TabPane';

import { TTabItem } from 'src/interfaces/common-interface';
import Tabs from './Tabs';

interface IProps {
  className?: string;
  items: TTabItem[];
  activeKey: string;
  secondaryHeader?: boolean;
  onChangeTab: (key: string) => void;
}

const TabsHeader = ({ className, items, activeKey, secondaryHeader, onChangeTab }: IProps) => {
  return (
    <Tabs
      activeKey={activeKey}
      animated={true}
      className={`TabsHeader ${secondaryHeader ? 'secondary' : ''} ${className ?? ''}`}
      onChange={onChangeTab}
    >
      {items.map((tab) => (
        <TabPane tab={tab.label} key={tab.key} />
      ))}
    </Tabs>
  );
};

export default TabsHeader;
