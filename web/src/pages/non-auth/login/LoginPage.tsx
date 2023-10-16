import { Form, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { TRootState, useAppDispatch } from 'src/stores';

import LoginPageBackGround from 'src/assets/images/login-background.png';
import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { ImgContainer } from 'src/containers/auth';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { sendOtpLoginAction } from 'src/stores/auth/auth-actions';
import { EAuthActions } from 'src/stores/auth/auth-constants';
import { EReft, EUserType } from 'src/variables/enum-variables';
import { emailRules } from 'src/variables/rules-form';
import SignUpAsModal from './components/SignUpAsModal';
import './LoginPage.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const [isOpenSignUpAsModal, setIsOpenSignUpAsModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { sendingOTP } = useSelector((state: TRootState) => ({
    sendingOTP: state.loading[EAuthActions.SEND_OTP_LOGIN],
  }));

  const onFinish = async (values: { email: string; password: string }) => {
    dispatch(
      sendOtpLoginAction({
        email: values.email.toLowerCase(),
        password: values.password,
        onSuccess: () => {
          navigate(RoutePaths.OTP_VERIFICATION, {
            state: { email: values.email.toLowerCase(), password: values.password },
          });
        },
        onError: (error) => {
          const { errorType, id } = (error as ResponseError).data;
          if (errorType === 'notVerifyAccount') {
            navigate(`${RoutePaths.CONFIRM_EMAIL}?id=${id}&ref=${EReft.SIGN_IN}`, {
              state: {
                email: values.email,
              },
            });
            return;
          }
          setErrorMsg((error as ResponseError).message);
        },
      }),
    );
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

  const onForgotPassword = () => {
    navigate(RoutePaths.FORGOT_PASSWORD);
  };

  useEffect(() => {
    if (location.state?.email) {
      form.setFieldValue('email', location.state.email);
    }
  }, []);

  return (
    <ImgContainer
      bgColor="linear-gradient(to bottom right, #69BAE9, #74CCF2, #8FE0F8)"
      bgImgSrc={LoginPageBackGround}
      className="LoginPage"
    >
      <Form form={form} name="LoginForm" onFinish={onFinish} autoComplete="off" layout="vertical">
        <BaseText type="display1" className="LoginPage__container-heading">
          Log in
        </BaseText>
        <FormItem label="Email" name="email" showRequiredMark={false} rules={emailRules}>
          <Input />
        </FormItem>
        <FormItem
          leftLabel="Password"
          showRequiredMark={false}
          rightLabel={
            <Typography.Link
              style={{ fontSize: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                onForgotPassword();
              }}
            >
              Forgot password ?
            </Typography.Link>
          }
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input type="password" />
        </FormItem>
        <FormItem>
          {errorMsg && (
            <BaseText type="caption" color="error" textAlign="center" className="LoginPage__errorMsg">
              {errorMsg}
            </BaseText>
          )}
          <Button type="primary" htmlType="submit" size="large" block loading={sendingOTP}>
            Log in
          </Button>
        </FormItem>
        <BaseText className="LoginPage__container-endText">
          Don&apos;t have an account yet?&nbsp;
          <Typography.Link style={{ fontSize: 12 }} onClick={onClickSignUp}>
            Sign up
          </Typography.Link>
        </BaseText>
      </Form>

      <SignUpAsModal isOpen={isOpenSignUpAsModal} onClose={onCloseSignUpAsModal} onSelectUserType={onSelectUserType} />
    </ImgContainer>
  );
};

export default LoginPage;
