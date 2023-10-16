import { Upload as AntUpload, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

import Button from 'src/components/button';
import './Upload.scss';
import React from 'react';

interface IProps extends UploadProps {
  textButton?: string;
  icon?: React.ReactNode;
}

const dummyRequest = ({ onSuccess }: RcCustomRequestOptions) => {
  onSuccess?.('ok');
};

const Upload = ({ className, textButton = 'Upload', icon, children, ...rest }: IProps) => {
  return (
    <AntUpload
      className={`Upload ${className ?? ''}`}
      accept=".jpg, .jpeg, .png, .gif"
      showUploadList={false}
      customRequest={dummyRequest}
      beforeUpload={() => false}
      {...rest}
    >
      {children ?? (
        <Button type="dashed" icon={icon ? icon : <PlusOutlined />}>
          {textButton}
        </Button>
      )}
    </AntUpload>
  );
};

export default Upload;
