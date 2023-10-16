import { Input as AntInput, InputProps as AntInputProps, InputRef } from 'antd';

import './Input.scss';

type InputProps = AntInputProps & {
  ref?: React.Ref<InputRef>;
};

const Input = ({ className, type, ref, ...rest }: InputProps) => {
  const inputClassName = `Input wrapper ${className ?? ''} `;

  if (type === 'password') return <AntInput.Password className={inputClassName} {...rest} />;

  return <AntInput className={inputClassName} type={type || 'text'} ref={ref} {...rest} />;
};

export default Input;
