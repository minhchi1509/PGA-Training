import { Modal, ModalProps, Row, Space } from 'antd';
import './ConfirmModal.scss';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import React from 'react';

interface IConfirmModalProps extends ModalProps {
  onCancelButton: () => void;
  onsubmit?: () => void;
  children?: React.ReactNode;
  titleModal?: string;
  icon?: React.ReactNode;
  txtBtnCancel?: string;
  txtBtnConfirm?: string;
  className?: string;
  loading?: boolean;
  danger?: boolean;
  cancelLoading?: boolean;
}

const ConfirmModal = (props: IConfirmModalProps): JSX.Element => {
  const {
    onsubmit,
    children,
    titleModal,
    icon,
    txtBtnCancel = 'Cancel',
    txtBtnConfirm = 'OK',
    onCancelButton,
    className,
    loading,
    cancelLoading,
    danger,
    closable = false,
    ...rest
  } = props;

  return (
    <Modal
      centered
      closable={closable}
      footer={null}
      width={370}
      {...rest}
      className={`ConfirmModal ${className ?? ''}`}
    >
      <Space direction="vertical" className="discharge-modal">
        {icon && <div className="icon">{icon}</div>}
        {titleModal ? (
          <BaseText type="title" textAlign="center">
            {titleModal}
          </BaseText>
        ) : null}

        <div>{children}</div>
        <Row style={{ marginTop: '16px' }}>
          <Button
            type="default"
            onClick={() => {
              onCancelButton();
            }}
            size="large"
            className="button btn-margin"
            disabled={loading}
            loading={cancelLoading}
          >
            <BaseText>{txtBtnCancel}</BaseText>
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (onsubmit) {
                onsubmit();
              }
            }}
            size="large"
            className={`button ${className === 'CancelSubcription' ? 'cancellation' : className}`}
            loading={loading}
            disabled={cancelLoading}
            danger={danger}
          >
            <BaseText>{txtBtnConfirm}</BaseText>
          </Button>
        </Row>
      </Space>
    </Modal>
  );
};

export default ConfirmModal;
