/* eslint-disable react/prop-types */
import { Typography } from 'antd';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';

import Button from 'src/components/button';
import { BaseText } from 'src/components/typography';
import { RoutePaths } from 'src/routes/routes-constants';
import { TRootState, useAppDispatch } from 'src/stores';
import { sendOtpLoginAction, signInAction } from 'src/stores/auth/auth-actions';
import { EAuthActions } from 'src/stores/auth/auth-constants';
import { showErrorToast, showSuccessToast } from 'src/components/toast/Toast';
import { changeCurrentProfileId, getItem, setItem } from 'src/utils/storage-utils';
import { getUserProfile } from 'src/stores/user';
import { EAuthToken, EUserProfile } from 'src/variables/storage';
import { EUserType, EUserTypeDisplay } from 'src/variables/enum-variables';
import { TUserProfile } from 'src/stores/user/user-constants';
import './VerifyOTPPage.scss';
import LoginSuccess from './LoginSuccess';

type TVerifyOTPState = {
  email: string;
  password: string;
};

const DEFAULT_OTP_LENGTH = 6;

const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const { email, password } = location.state as TVerifyOTPState;
  const { sendingOTP } = useSelector((state: TRootState) => ({
    sendingOTP: state.loading[EAuthActions.SEND_OTP_LOGIN],
  }));
  const [otp, setOtp] = useState<string>('');

  const handleRedirect = async () => {
    const result = unwrapResult(await dispatch(getUserProfile()));
    const currentProfileId = getItem(EUserProfile.PROFILE_ID);
    let profile = null;

    if (!currentProfileId) {
      profile = result.profiles[0];
    } else {
      profile = result.profiles.find((profile: TUserProfile) => profile.id === currentProfileId) || result.profiles[0];
    }

    changeCurrentProfileId(profile.id);
    const isOwner = profile.role === EUserType.OWNER;
    const isSoloPractitioner = profile.role === EUserType.SOLO_PRACTITIONER;

    if (!profile.isCompleted) {
      const role =
        profile.role === EUserType.OWNER
          ? EUserTypeDisplay.CLINIC_OWNER
          : profile.role === EUserType.PRACTITIONER
          ? EUserTypeDisplay.PRACTITIONER
          : EUserTypeDisplay.SOLO_PRACTITIONER;
      navigate(RoutePaths.CREATE_CLINIC_PROFILE(role));
      return;
    }
    if (!profile.clinic.paymentStatus && (isSoloPractitioner || isOwner)) {
      navigate(RoutePaths.PRICING_PACKAGE);
      return;
    }
    navigate(RoutePaths.HOME);
  };

  const handleLogin = async (latestOtp: string) => {
    dispatch(
      signInAction({
        email,
        password,
        otp: latestOtp,
        onSuccess: (loginResponse) => {
          setIsCompleted(true);
          setTimeout(() => {
            setItem(EAuthToken.ACCESS_TOKEN, loginResponse.accessToken);
            handleRedirect();
          }, 3000);
        },
        onError: (error) => showErrorToast(error.message),
      }),
    );
  };

  const handleResendOTP = () => {
    dispatch(
      sendOtpLoginAction({
        email,
        password,
        onSuccess: () => {
          setOtp('');
          showSuccessToast('Resend OTP verification successfully!');
        },
        onError: (error) => {
          showErrorToast(error.message);
        },
      }),
    );
  };

  const handleChangeOTPValue = (otp: string) => {
    setOtp(otp);

    const isValidOtp = otp.length === DEFAULT_OTP_LENGTH;
    isValidOtp && handleLogin(otp);
  };

  if (isCompleted) {
    return <LoginSuccess />;
  }

  return (
    <div className="VerifyOTPPage">
      <BaseText type="display1">OTP Verification</BaseText>
      <BaseText type="body1" className="VerifyOTPPage__note">
        Enter OTP we just sent to {email}
      </BaseText>

      <OtpInput
        value={otp}
        inputType="tel"
        shouldAutoFocus
        numInputs={DEFAULT_OTP_LENGTH}
        containerStyle={{ gap: 8, margin: '40px 0' }}
        renderSeparator={() => <span style={{ color: '#C9C9C9' }}>-</span>}
        onChange={handleChangeOTPValue}
        renderInput={({ className, ...props }) => (
          <input className={`VerifyOTPPage__input ${className ?? ''} ${props.value ? 'hasValue' : ''}`} {...props} />
        )}
      />

      <BaseText type="body1" className="VerifyOTPPage__note">
        The code will expire after 2 minutes
      </BaseText>

      <Button
        type="primary"
        className="VerifyOTPPage__submitBtn"
        size="large"
        loading={sendingOTP}
        onClick={handleResendOTP}
      >
        Resend
      </Button>
      <BaseText>
        <Typography.Link style={{ fontSize: 12 }} href={RoutePaths.SIGN_IN}>
          Back to Log in
        </Typography.Link>
      </BaseText>
    </div>
  );
};

export default VerifyOTPPage;
