import { Tag as AntTag, TagProps } from 'antd';

import './Tag.scss';

const Tag = ({ className, color = 'default', ...rest }: TagProps) => {
  const TagClassName = `Tag ${color ?? ''} ${className ?? ''}`;

  return (
    <AntTag className={TagClassName} color={color} {...rest}>
      {rest.children}
    </AntTag>
  );
};

export default Tag;
