import { Checkbox, Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import SignupPageBackground from 'src/assets/images/signup-background.png';
import Button from 'src/components/button';
import { FormItem } from 'src/components/forms';
import Input from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { ImgContainer } from 'src/containers/auth';
import ResponseError from 'src/interfaces/error-response-interface';
import { RoutePaths } from 'src/routes/routes-constants';
import { practitionerSignUp, signUp } from 'src/services/auth-service';
import { changeCurrentProfileId, setItem } from 'src/utils/storage-utils';
import { validatePassword } from 'src/utils/validate-utils';
import { EMAIL_REGEX } from 'src/variables/constants';
import { EUserType } from 'src/variables/enum-variables';
import { EAuthToken } from 'src/variables/storage';

import './RegisterPage.scss';

type TRegisterFormValues = {
  practiceName?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const isClinicOwner = params?.userType === EUserType.CLINIC_OWNER;
  const hasExistedEmail = location.state?.email;

  const [form] = Form.useForm();
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onFinish = async (values: TRegisterFormValues) => {
    try {
      setSigningUp(true);
      if (hasExistedEmail) {
        const bodyRequest = {
          password: values.password,
          profileId: location.state.profileId,
        };

        const { accessToken } = await practitionerSignUp(bodyRequest);
        setItem(EAuthToken.ACCESS_TOKEN, accessToken);
        changeCurrentProfileId(location.state.profileId);

        navigate(0);
      } else {
        const bodyRequest = {
          email: values.email.toLowerCase(),
          ...(values?.practiceName && { practiceName: values.practiceName }),
          password: values.password,
          type: params?.userType as EUserType,
        };

        const { id } = await signUp(bodyRequest);
        navigate(`${RoutePaths.CONFIRM_EMAIL}?id=${id}`, {
          state: { email: values.email.toLowerCase() },
        });
      }
    } catch (error) {
      const message = (error as ResponseError).message;
      setErrorMsg(message);
    } finally {
      setSigningUp(false);
    }
  };

  const onClickLogin = () => {
    navigate(RoutePaths.SIGN_IN);
  };

  const goTerm = () => {
    window.open(RoutePaths.TERM, '_blank');
  };

  const goPrivacy = () => {
    window.open(RoutePaths.PRIVACY, '_blank');
  };

  useEffect(() => {
    if (hasExistedEmail) {
      form.setFieldValue('email', location.state.email.toLowerCase());
    }
  }, []);

  return (
    <ImgContainer
      bgColor="linear-gradient(to bottom, #347AA1, #407FA3, #5C90AE)"
      bgImgSrc={SignupPageBackground}
      className="RegisterPage"
    >
      <Form
        form={form}
        name="RegisterForm"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="RegisterPage"
      >
        <BaseText type="display1" className="RegisterPage__container-heading">
          Create account
        </BaseText>
        {isClinicOwner && (
          <FormItem
            label="Practice name"
            name="practiceName"
            rules={[
              { required: true, message: 'Please enter the practice name' },
              { max: 100, message: 'Practice name shouldn’t exceed 100 characters' },
            ]}
          >
            <Input />
          </FormItem>
        )}
        <FormItem
          label="Email"
          name="email"
          normalize={(value) => value.trim()}
          rules={[
            { required: true, message: 'Please enter the email address' },
            { pattern: EMAIL_REGEX, message: 'Invalid input. Please enter a valid email address' },
          ]}
        >
          <Input disabled={hasExistedEmail} />
        </FormItem>
        <FormItem label="Password" name="password" rules={[{ validator: validatePassword }]}>
          <Input type="password" />
        </FormItem>
        <FormItem
          label="Confirm password"
          name="confirmPassword"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('password') === value && value) {
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
        <FormItem
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(new Error('Please accept the terms & conditions'));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Checkbox>
            I agree to&nbsp;
            <Typography.Link onClick={goTerm} style={{ fontSize: 12 }}>
              ANTSA’s Terms and Conditions,
            </Typography.Link>{' '}
            <Typography.Link onClick={goPrivacy} style={{ fontSize: 12 }}>
              Privacy Policy
            </Typography.Link>
            &nbsp;.
          </Checkbox>
        </FormItem>
        <FormItem>
          {errorMsg && (
            <BaseText type="caption" color="error" textAlign="center" className="RegisterPage__errorMsg">
              {errorMsg}
            </BaseText>
          )}
          <Button type="primary" htmlType="submit" size="large" block loading={signingUp}>
            Sign up
          </Button>
        </FormItem>
        <BaseText className="RegisterPage__container-endText">
          Already have an account?{' '}
          <Typography.Link style={{ fontSize: 12 }} onClick={onClickLogin}>
            Log in
          </Typography.Link>
        </BaseText>
      </Form>
    </ImgContainer>
  );
};

export default RegisterPage;
