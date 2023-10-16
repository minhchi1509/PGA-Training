import { Avatar as AntAvatar, AvatarProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

type IProps = AvatarProps;

const Avatar = ({ src, className, icon = <UserOutlined />, ...rest }: IProps) => {
  const avtClassName = `Avatar ${className ?? ''}`;

  if (!src) return <AntAvatar className={avtClassName} icon={icon} {...rest} />;

  return <AntAvatar className={avtClassName} icon={icon} src={src} {...rest} />;
};

export default Avatar;
