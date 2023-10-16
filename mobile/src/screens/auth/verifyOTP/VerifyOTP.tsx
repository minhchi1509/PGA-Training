import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { CodeField, useBlurOnFulfill } from 'react-native-confirmation-code-field';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './styles';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import Button from '@src/components/Button';
import GlobalNavigation from '@src/utils/navigation-utils';
import { EGuestScreenList, ERootScreenList } from '@src/navigators/navigator-constants';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { authThunkActions } from '@src/stores/auth';
import { showErrorToast, showSuccessToast } from '@src/utils/toast-utils';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { EAuthThunkActions } from '@src/stores/auth/constants';
import LoginSucess from '../login-success';
import { ILoginResponse } from '@src/interfaces/auth-interfaces';
import { EStorage } from '@src/variables/enum';

const NUMBER_OF_CELL = 6;

type TVerifyOtpPageParams = {
  email: string;
  password: string;
};

function VerifyOTP() {
  const { params } = useRoute();
  const dispatch = useAppDispatch();
  const { email, password } = params as TVerifyOtpPageParams;
  const [otp, setOtp] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const ref = useBlurOnFulfill({ value: otp, cellCount: NUMBER_OF_CELL });
  const isResendingOTP = useAppSelector((state) => state.loading[EAuthThunkActions.SEND_OTP_LOGIN]);

  const handleLoginSuccess = async (data: ILoginResponse) => {
    await AsyncStorage.setItem(EStorage.ACCESS_TOKEN, data.accessToken);
    await AsyncStorage.setItem(EStorage.CLIENT_ID, data.id);
    GlobalNavigation.reset(ERootScreenList.BOTTOM_TAB_NAVIGATOR);
  };

  const handleLogin = async (otp: string) => {
    try {
      const data = await dispatch(authThunkActions.login({ email, password, otp })).unwrap();
      setIsCompleted(true);
      setTimeout(() => {
        handleLoginSuccess(data);
      }, 3000);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  const handleChangeOtpCode = (otpCode: string) => {
    setOtp(otpCode);
    const isFilledCode = otpCode.length === NUMBER_OF_CELL;
    isFilledCode && handleLogin(otpCode);
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(authThunkActions.sendOTPLogin({ email, password }));
      setOtp('');
      showSuccessToast('Resend OTP verification successfully!');
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  if (isCompleted) {
    return <LoginSucess />;
  }

  return (
    <View style={styles.container}>
      <AppText type='display1'>OTP Verification</AppText>
      <AppText type='body1' color={theme.colors.darkGrey}>
        Enter OTP we just sent to {email}
      </AppText>
      <CodeField
        ref={ref}
        rootStyle={styles.codeFieldContainer}
        cellCount={NUMBER_OF_CELL}
        value={otp}
        onChangeText={handleChangeOtpCode}
        keyboardType='numeric'
        renderCell={({ index, symbol }) => (
          <View key={index} style={symbol ? styles.boxInputActive : styles.boxInputInActive}>
            <Text style={symbol ? styles.textBoxInputActive : styles.textBoxInputInActive}>
              {symbol ? symbol : ''}
            </Text>
          </View>
        )}
      />
      <AppText type='body1' color={theme.colors.darkGrey}>
        The code will expire after 2 minutes
      </AppText>

      <Button
        customStyles={styles.resendButton}
        text='Resend'
        onPress={handleResendOtp}
        loading={isResendingOTP}
      />
      <Button
        customStyles={styles.backToLoginButton}
        customTextStyles={styles.backToLoginButtonText}
        text='Back to Log in'
        onPress={() => GlobalNavigation.navigate(EGuestScreenList.LOGIN)}
      />
    </View>
  );
}

export default VerifyOTP;
