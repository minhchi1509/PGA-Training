import { Ref } from 'react';
import { InputRef } from 'antd';
import MaskedInput from 'antd-mask-input';
import { MaskedInputProps, MaskType } from 'antd-mask-input/build/main/lib/MaskedInput';

import './PhoneNumber.scss';

interface IProps extends Omit<MaskedInputProps, 'mask'> {
  inputRef?: Ref<InputRef>;
  mask?: MaskType;
}

function PhoneNumber({ className, inputRef, mask = '+61 000 000 000', ...rest }: IProps) {
  return <MaskedInput className={`PhoneNumber ${className ?? ''}`} mask={mask} {...rest} ref={inputRef} />;
}

export default PhoneNumber;
