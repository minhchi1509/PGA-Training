import { Form, Modal, ModalProps } from 'antd';
import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { PASSWORD_REGEX } from 'src/variables/constants';
import './ChangePasswordModal.scss';
import { useForm } from 'antd/es/form/Form';
import { TChangePasswordModalForm } from './change-password-modal-types';
import { changePassword } from 'src/services/auth-service';
import { useState } from 'react';
import ResponseError from 'src/interfaces/error-response-interface';
import { showSuccessToast } from 'src/components/toast/Toast';

interface IChangePasswordModalProps extends ModalProps {
  email: string;
  onCancel: () => void;
}

const ChangePasswordModal = ({ email, className, onCancel, ...rest }: IChangePasswordModalProps) => {
  const [form] = useForm<TChangePasswordModalForm>();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onCloseModal = () => {
    onCancel();
    form.resetFields();
  };

  const handleChangePassword = async (values: TChangePasswordModalForm) => {
    setLoading(true);
    try {
      const res = await changePassword({
        email,
        password: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (res) {
        showSuccessToast(`Congratulations! You've successfully changed your password.`);
        setErrorMsg('');
        onCloseModal();
      }
    } catch (err) {
      const message = (err as ResponseError).message;
      setErrorMsg(message);
    }
    setLoading(false);
  };

  return (
    <Modal
      centered
      closable={false}
      footer={null}
      width={370}
      onCancel={onCloseModal}
      {...rest}
      className={`ChangePasswordModal ${className ?? ''}`}
    >
      <BaseText type="title" textAlign="center" className="ChangePasswordModal__title">
        Change password
      </BaseText>

      <div>
        <BaseText type="small">
          Strong passwords include numbers, lowercase and upper case letters and punctuation marks.
        </BaseText>
        <BaseText type="small" className="ChangePasswordModal__email">
          Email: {email}
        </BaseText>
      </div>
      <Form layout="vertical" form={form} onFinish={handleChangePassword}>
        <FormItem
          label="Current password"
          name="currentPassword"
          rules={[
            { required: true, message: 'Please enter the current password' },
            {
              pattern: PASSWORD_REGEX,
              message:
                'Password must have at least 8 characters that include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character, maximum characters is 16.',
            },
          ]}
          showRequiredMark={false}
        >
          <Input placeholder="Current password" type="password" />
        </FormItem>
        <FormItem
          label="New password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter the new password' },
            {
              pattern: PASSWORD_REGEX,
              message:
                'Password must have at least 8 characters that include at least 1 lowercase character, 1 uppercase character, 1 number and 1 special character, maximum characters is 16.',
            },
          ]}
          showRequiredMark={false}
        >
          <Input placeholder="New password" type="password" />
        </FormItem>
        <FormItem
          label="Confirm new password"
          name="confirmNewPassword"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('newPassword') === value && value) {
                  return Promise.resolve();
                }
                if (!value) {
                  return Promise.reject(new Error('Please enter the new password again'));
                }
                return Promise.reject(new Error('New password does not match'));
              },
            }),
          ]}
          showRequiredMark={false}
        >
          <Input placeholder="Confirm new password" type="password" />
        </FormItem>

        <div className="ChangePasswordModal__buttons">
          {errorMsg && (
            <BaseText type="caption" color="error" textAlign="center" className="RegisterPage__errorMsg">
              {errorMsg}
            </BaseText>
          )}
          <Button type="primary" size="large" htmlType="submit" loading={loading} disabled={loading}>
            <BaseText>Change password</BaseText>
          </Button>
          <Button type="default" onClick={onCloseModal} size="large">
            <BaseText>Cancel</BaseText>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
