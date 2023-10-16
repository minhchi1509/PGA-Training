import { Collapse as AntCollapse, CollapseProps } from 'antd';
import { ChevronDownIcon } from 'src/assets/icons';

import { TCollapseItem } from 'src/interfaces/common-interface';
import './Collapse.scss';

const { Panel } = AntCollapse;

interface IProps extends CollapseProps {
  items?: TCollapseItem[];
}

const Collapse = ({ items, className, ...rest }: IProps) => {
  return (
    <AntCollapse
      bordered={false}
      expandIconPosition="end"
      className={`Collapse ${className ?? ''}`}
      expandIcon={({ isActive }) => <ChevronDownIcon style={{ transform: isActive ? 'rotate(180deg)' : '' }} />}
      {...rest}
    >
      {items?.length &&
        items.map((item) => {
          const hasContent = !!item.content;
          if (!hasContent) return <div className="Collapse__header">{item.header}</div>;

          return (
            <Panel header={item.header} key={item.key}>
              {item?.content}
            </Panel>
          );
        })}
    </AntCollapse>
  );
};

export default Collapse;
