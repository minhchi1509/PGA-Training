import { Modal, Space } from 'antd';

import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import { EUserType } from 'src/variables/enum-variables';
import './SignUpAsModal.scss';

interface ISignUpAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUserType: (userType: EUserType) => void;
}

const SignUpAsModal = (props: ISignUpAsModalProps): JSX.Element => {
  const { isOpen, onClose, onSelectUserType } = props;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      centered
      closable={false}
      footer={null}
      width={340}
      className="SignUpAsModal"
    >
      <Space direction="vertical" className="sign-up-as-modal" size="middle">
        <BaseText type="display1">Sign up as...</BaseText>
        <Button
          type="default"
          onClick={() => onSelectUserType(EUserType.SOLO_PRACTITIONER)}
          size="large"
          className="sign-up-as-modal__button"
        >
          <BaseText textAlign="center">Solo Practitioner</BaseText>
        </Button>
        <Button
          type="primary"
          onClick={() => onSelectUserType(EUserType.CLINIC_OWNER)}
          size="large"
          className="sign-up-as-modal__button"
        >
          <BaseText>Clinic Owner</BaseText>
        </Button>
      </Space>
    </Modal>
  );
};

export default SignUpAsModal;
