import { Badge as AntBadge, BadgeProps } from 'antd';
import './Badge.scss';

interface IBadgeProps extends BadgeProps {
  color: 'green' | 'violet';
  text: string;
}

const Badge = ({ color, text, ...rest }: IBadgeProps) => {
  return <AntBadge className={`badge ${color}`} count={text} dot={false} {...rest} />;
};

export default Badge;
