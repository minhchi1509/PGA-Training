import { Modal, ModalProps } from 'antd';
import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';

interface IExpireTrialModalProps extends ModalProps {
  handleSubmit: () => void;
  count: number;
}

const ExpireTrialModal = ({ handleSubmit, count, ...rest }: IExpireTrialModalProps) => {
  return (
    <Modal
      width={370}
      footer={null}
      title={
        <BaseText type="title" textAlign="center">
          Free Trial will expire
        </BaseText>
      }
      bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      centered
      {...rest}
    >
      <BaseText type="caption" textAlign="center">
        Your FREE plan will expire in {count} days. Please select your subscription to continue using ANTSA by clicking
        on the button below
      </BaseText>
      <Button type="primary" onClick={handleSubmit}>
        Select plan
      </Button>
    </Modal>
  );
};

export default ExpireTrialModal;
