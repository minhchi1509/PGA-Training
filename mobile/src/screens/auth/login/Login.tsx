import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useFormik } from 'formik';

import styles from './styles';
import Input from '@src/components/Input/Input';
import AppText from '@src/components/AppText';
import { EInputType } from '@src/variables/enum';
import { loginFormValidationSchema } from '@src/utils/form-validation';
import GlobalNavigation from '@src/utils/navigation-utils';
import { EGuestScreenList } from '@src/navigators/navigator-constants';
import Button from '@src/components/Button';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { authThunkActions } from '@src/stores/auth';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { EAuthThunkActions } from '@src/stores/auth/constants';
import { ISendOTPBody } from '@src/interfaces/auth-interfaces';

const LoginScreen = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const dispatch = useAppDispatch();

  const isSendingOTP = useAppSelector((state) => state.loading[EAuthThunkActions.SEND_OTP_LOGIN]);

  const handleLogin = async (values: ISendOTPBody) => {
    try {
      const body = {
        email: values.email.toLowerCase(),
        password: values.password,
      };
      await dispatch(authThunkActions.sendOTPLogin(body)).unwrap();
      setErrorMessage('');
      resetForm();
      GlobalNavigation.navigate(EGuestScreenList.VERIFY_OTP, body);
    } catch (error) {
      setErrorMessage((error as ErrorResponse).message);
    }
  };

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik<ISendOTPBody>({
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: handleLogin,
      validationSchema: loginFormValidationSchema,
    });

  return (
    <View style={styles.container}>
      <AppText type='display1' customStyles={{ textAlign: 'center' }}>
        Log in
      </AppText>
      <Input
        customContainerStyles={styles.formItem}
        leftLabel='Email'
        value={values.email}
        onChangeText={handleChange('email')}
        errorText={touched.email && errors.email}
      />
      <Input
        customContainerStyles={styles.formItem}
        type={EInputType.PASSWORD}
        leftLabel='Password'
        rightLabel={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => GlobalNavigation.navigate(EGuestScreenList.FORGOT_PASSWORD)}
          >
            <AppText type='caption' color='#19BCFE'>
              Forgot password ?
            </AppText>
          </TouchableOpacity>
        }
        value={values.password}
        onChangeText={handleChange('password')}
        errorText={touched.password && errors.password}
      />
      {errorMessage && <AppText customStyles={styles.errorMessage}>{errorMessage}</AppText>}
      <Button
        customStyles={styles.formItem}
        text='Login'
        onPress={() => handleSubmit()}
        loading={isSendingOTP}
      />
    </View>
  );
};

export default LoginScreen;
