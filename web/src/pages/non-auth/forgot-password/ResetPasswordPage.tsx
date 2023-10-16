import { Form, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { ErrorScreen } from 'src/containers/status-screen';
import { TResetPasswordRequest } from 'src/interfaces/auth-interface';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { checkStatusResetPasswordToken, resetPassword } from 'src/services/auth-service';
import { validatePassword } from 'src/utils/validate-utils';

import './ResetPasswordPage.scss';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [params] = useSearchParams();
  const token = params.get('token');

  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
  const [isCheckingValidToken, setIsCheckingValidToken] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleBackToLogin = () => {
    navigate(RoutePaths.SIGN_IN);
  };

  const onFinish = async (values: TResetPasswordRequest) => {
    try {
      setIsResetPassword(true);
      await resetPassword({ newPassword: values.newPassword, resetToken: token ?? '' });
      showSuccessToast(`Congratulations! You've successfully reset your password.`);
      setTimeout(() => {
        handleBackToLogin();
      }, 500);
    } catch (error) {
      const message = (error as ResponseError).message;
      setErrorMsg(message);
    } finally {
      setIsResetPassword(false);
    }
  };

  const checkValidToken = async (token: string) => {
    try {
      setIsCheckingValidToken(true);
      const response = await checkStatusResetPasswordToken(token);
      setEmail(response.email);
      setIsCheckingValidToken(false);
    } finally {
      setIsCheckingValidToken(false);
    }
  };

  useEffect(() => {
    if (token) checkValidToken(token);
  }, [token]);

  return (
    <div className="ResetPasswordPage">
      {isCheckingValidToken ? (
        <Spin />
      ) : !email ? (
        <ErrorScreen
          title="This link has expired"
          subTitle="Please request password reset again"
          action={
            <Button type="primary" onClick={handleBackToLogin}>
              Back to Log in
            </Button>
          }
        />
      ) : (
        <Form
          form={form}
          name="ResetPasswordForm"
          className="ResetPasswordPage__container"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <BaseText type="display1" className="ResetPasswordPage__container-heading">
            Reset password
          </BaseText>
          <BaseText type="body1" className="ResetPasswordPage__container-more-info-text">
            Strong passwords include numbers, letters and punctuation marks.
          </BaseText>
          <BaseText type="body1" className="ResetPasswordPage__container-more-info-text">
            Email: {email}
          </BaseText>
          <FormItem
            label="New password"
            name="newPassword"
            rules={[{ validator: validatePassword }]}
            showRequiredMark={false}
          >
            <Input type="password" />
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
                    return Promise.reject(new Error('Please enter the password again'));
                  }
                  return Promise.reject(new Error('Password does not match'));
                },
              }),
            ]}
          >
            <Input type="password" />
          </FormItem>
          {errorMsg && (
            <BaseText type="caption" color="error" textAlign="center" className="ResetPasswordPage__errorMsg">
              {errorMsg}
            </BaseText>
          )}
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isResetPassword}
              style={{ marginTop: '8px' }}
            >
              Reset password
            </Button>
          </FormItem>
          <BaseText className="ResetPasswordPage__container-endText">
            <Typography.Link style={{ fontSize: 12 }} onClick={handleBackToLogin}>
              Back to Log in
            </Typography.Link>
          </BaseText>
        </Form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
