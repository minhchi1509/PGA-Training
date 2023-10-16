import { useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import ForgotPasswordBackground from 'src/assets/images/forgot-password-background.png';
import VerificationEmailBackground from 'src/assets/images/verification-email-background.png';
import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { BaseText } from 'src/components/typography';
import { ImgContainer } from 'src/containers/auth';
import { TForgotPasswordRequest } from 'src/interfaces/auth-interface';
import SignUpAsModal from 'src/pages/non-auth/login/components/SignUpAsModal';
import { RoutePaths } from 'src/routes/routes-constants';
import { forgotPassword } from 'src/services/auth-service';
import { EUserType } from 'src/variables/enum-variables';
import { emailRules } from 'src/variables/rules-form';

import './ForgotPasswordPage.scss';

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const DEFAULT_REMAINING_TIME = 300;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [isOpenSignUpAsModal, setIsOpenSignUpAsModal] = useState<boolean>(false);
  const [isSentEmail, setIsSentEmail] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(DEFAULT_REMAINING_TIME);

  const [form] = Form.useForm();

  const onFinish = async (values: TForgotPasswordRequest) => {
    try {
      setIsForgotPassword(true);
      await forgotPassword(values.email.toLowerCase());
      setIsForgotPassword(false);
      if (isSentEmail) {
        showSuccessToast('Resend reset password link successfully!');
        setRemainingTime(DEFAULT_REMAINING_TIME);
      } else {
        showSuccessToast('Please check your email to reset password!');
      }
      setIsSentEmail(true);
    } catch (error) {
      setIsForgotPassword(false);
      showErrorToast('This email does not exist');
    }
  };

  const onClickSignUp = () => {
    setIsOpenSignUpAsModal(true);
  };

  const onCloseSignUpAsModal = () => {
    setIsOpenSignUpAsModal(false);
  };

  const onSelectUserType = (userType: EUserType) => {
    navigate(RoutePaths.SIGN_UP(userType));
  };

  useEffect(() => {
    const timer =
      remainingTime > 0 &&
      isSentEmail &&
      setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);

    return () => {
      clearInterval(timer as NodeJS.Timer);
    };
  }, [remainingTime, isSentEmail]);

  return (
    <ImgContainer
      bgImgSrc={isSentEmail ? VerificationEmailBackground : ForgotPasswordBackground}
      bgColor={
        isSentEmail
          ? 'linear-gradient(to bottom, #5D9EC8, #5D9EC8, #5D9EC8)'
          : 'linear-gradient(to top, rgb(121, 66, 177) 0%, rgb(181, 91, 202) 80%, rgb(194, 93, 212) 100%)'
      }
      className="ForgotPasswordPage"
    >
      <Form form={form} name="ForgotPasswordForm" onFinish={onFinish} autoComplete="off" layout="vertical">
        <BaseText type="display1" className="ForgotPasswordPage__heading">
          Forgot password
        </BaseText>

        <BaseText type="body1" className="ForgotPasswordPage__more-info-text">
          {!isSentEmail
            ? ` Type the address linked to your account and we'll send you password reset instructions. They might
              end up in your spam folder, so please check there as well.`
            : `An email has been sent to the ${form.getFieldValue('email')}`}
        </BaseText>

        {isSentEmail && (
          <BaseText type="body1" className="ForgotPasswordPage__more-info-text">
            {`The reset password link will expire after ${formatTime(remainingTime)}`}
          </BaseText>
        )}

        <FormItem
          label="Email"
          name="email"
          className={`ForgotPasswordPage__email ${isSentEmail ? 'sent' : ''}`}
          showRequiredMark={false}
          rules={emailRules}
        >
          <Input />
        </FormItem>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          block
          loading={isForgotPassword}
          style={{ marginTop: '24px' }}
        >
          {!isSentEmail ? 'Reset password' : 'Resend'}
        </Button>

        <BaseText className="ForgotPasswordPage__endText">
          {!isSentEmail ? (
            <>
              Don&apos;t have an account yet?{' '}
              <Typography.Link style={{ fontSize: 12 }} onClick={onClickSignUp}>
                Sign up
              </Typography.Link>
            </>
          ) : (
            <Typography.Link style={{ fontSize: 12 }} onClick={() => navigate('/sign-in')}>
              Back to Log in
            </Typography.Link>
          )}
        </BaseText>
      </Form>

      <SignUpAsModal isOpen={isOpenSignUpAsModal} onClose={onCloseSignUpAsModal} onSelectUserType={onSelectUserType} />
    </ImgContainer>
  );
};

export default ForgotPasswordPage;
