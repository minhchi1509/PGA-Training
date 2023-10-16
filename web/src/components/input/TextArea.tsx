import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import './TextArea.scss';

const TextArea = ({ className, ...rest }: TextAreaProps) => {
  return <Input.TextArea className={`TextArea wrapper ${className ?? ''}`} {...rest} />;
};

export default TextArea;
