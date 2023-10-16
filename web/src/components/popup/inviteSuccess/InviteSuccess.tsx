import { Modal, Row, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { IconSuccess } from 'src/assets/icons';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';
import { EUserType } from 'src/variables/enum-variables';
import './InviteSuccess.scss';

interface IInviteSuccessModalProps {
  userId: string;
  isOpen: boolean;
  type: EUserType;
  onClose: () => void;
}

const InviteSuccessModal = (props: IInviteSuccessModalProps): JSX.Element => {
  const navigate = useNavigate();
  const { isOpen, type, onClose, userId } = props;

  const handleViewPractitionerProfile = () => {
    onClose();
    if (type === EUserType.SOLO_PRACTITIONER) {
      navigate(RoutePaths.CLIENT_DETAILS(userId));
    } else {
      navigate(RoutePaths.PRACTITIONER_DETAILS(userId));
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      centered
      closable={false}
      footer={null}
      width={370}
      className="InviteSuccess"
    >
      <Space direction="vertical" className="invite-success-modal">
        <div className="icon">
          <IconSuccess />
        </div>
        <BaseText type="headline" className="title">
          The invitation has been sent successfully
        </BaseText>
        <Row style={{ marginTop: '16px' }}>
          <Button
            type="default"
            onClick={() => {
              onClose();
            }}
            size="large"
            className="button-close"
          >
            <BaseText>Close</BaseText>
          </Button>
          <Button type="primary" onClick={handleViewPractitionerProfile} size="large" className="button-profile">
            <BaseText>View this {type === EUserType.SOLO_PRACTITIONER ? 'client' : 'practitioner'} profile</BaseText>
          </Button>
        </Row>
      </Space>
    </Modal>
  );
};

export default InviteSuccessModal;
