import { Form, FormInstance, Modal, Row, Space } from 'antd';

import Input from '../input';
import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import { BaseText } from 'src/components/typography';
import { EUserType } from 'src/variables/enum-variables';
import { UserAdd } from 'src/assets/icons';
import { EMAIL_REGEX } from 'src/variables/constants';
import { TInviteFormValues } from './invite-types';
import { PhoneNumber } from '../phone-number';
import { validatePhoneNumber } from 'src/utils/validate-utils';
import './invite.scss';

interface IInviteModalProps {
  isOpen: boolean;
  type: EUserType;
  inviting: boolean;
  form: FormInstance<TInviteFormValues>;
  onClose: () => void;
  onSubmit: (values: TInviteFormValues) => void;
}

const InviteModal = (props: IInviteModalProps) => {
  const { isOpen, inviting, type, form, onClose, onSubmit } = props;

  const isClinicType = type === EUserType.CLINIC_OWNER;
  const title = isClinicType ? 'Practitioner Information' : 'Create new clients';
  const btnText = isClinicType ? 'Invite practitioner' : 'Send Invitation';

  const onFinish = (values: TInviteFormValues) => {
    onSubmit({ ...values, email: values.email.toLowerCase() });
  };

  const handleCloseModal = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      className="InviteModal"
      onCancel={handleCloseModal}
      centered
      closable={false}
      footer={null}
      width={570}
    >
      <Space direction="vertical" className="invite-modal">
        <BaseText type="title">{title}</BaseText>
        <Form
          form={form}
          name="Invite Form"
          autoComplete="off"
          layout="vertical"
          style={{ marginTop: '16px' }}
          onFinish={onFinish}
        >
          <Row>
            <FormItem
              label="First name"
              name="firstName"
              showRequiredMark={false}
              rules={[
                { required: true, message: 'Please enter the first name' },
                { max: 50, message: 'Valid first name shouldn’t exceed 50 characters' },
              ]}
              className="left-input"
            >
              <Input />
            </FormItem>
            <FormItem
              label="Last name"
              name="lastName"
              showRequiredMark={false}
              rules={[
                { required: true, message: 'Please enter the last name' },
                { max: 50, message: 'Valid last name shouldn’t exceed 50 characters' },
              ]}
              className="right-input"
            >
              <Input />
            </FormItem>
          </Row>
          <Row>
            <FormItem
              label="Email"
              name="email"
              showRequiredMark={false}
              rules={[
                { required: true, message: 'Please enter the email' },
                { pattern: EMAIL_REGEX, message: 'Invalid input. Please enter a valid email address' },
                { max: 100, message: 'Valid email shouldn’t exceed 100 characters' },
              ]}
              className="left-input"
            >
              <Input />
            </FormItem>
            <FormItem
              label="Phone number"
              name="phone"
              showRequiredMark={false}
              rules={[{ required: true, message: 'Please enter the phone number' }, { validator: validatePhoneNumber }]}
              className="right-input"
            >
              <PhoneNumber />
            </FormItem>
          </Row>
          <Button
            type="primary"
            size="large"
            className="invite-modal__button"
            htmlType="submit"
            loading={inviting}
            icon={<UserAdd style={{ marginRight: 6 }} />}
          >
            <BaseText inline>{btnText}</BaseText>
          </Button>
        </Form>
      </Space>
    </Modal>
  );
};

export default InviteModal;
