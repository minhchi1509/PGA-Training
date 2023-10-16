import React from 'react';
import { Modal, ModalProps, Space } from 'antd';

import './AlertModal.scss';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';

interface IAlertModalProps extends ModalProps {
  onOk?: () => void;
  txtBtnOk?: string;
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  icon?: React.ReactNode;
}

const AlertModal = (props: IAlertModalProps): JSX.Element => {
  const { onOk, txtBtnOk, title, content, closable, icon, ...rest } = props;

  return (
    <Modal centered closable={closable} footer={null} width={370} {...rest} className="AlertModal">
      <Space direction="vertical" className="discharge-modal">
        {icon && (
          <div className="AlertModal__icon--container">
            <div className="AlertModal__icon">{icon}</div>
          </div>
        )}

        {typeof title === 'string' ? (
          <BaseText type="heading" textAlign="center">
            {title}
          </BaseText>
        ) : (
          title
        )}

        {typeof content === 'string' ? (
          <BaseText type="body1" textAlign="center" className="AlertModal__content">
            {content}
          </BaseText>
        ) : (
          content
        )}

        <div className="AlertModal__footer">
          <Button type="primary" onClick={onOk} size="large">
            <BaseText>{txtBtnOk}</BaseText>
          </Button>
        </div>
      </Space>
    </Modal>
  );
};

export default AlertModal;
