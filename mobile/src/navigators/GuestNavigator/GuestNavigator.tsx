import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { EGuestScreenList } from '../navigator-constants';
import LoginScreen from '@src/screens/auth/login';
import VerifyOTP from '@src/screens/auth/verifyOTP';
import LoginSucess from '@src/screens/auth/login-success';

const Stack = createStackNavigator();

const GuestNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={EGuestScreenList.LOGIN}
    >
      <Stack.Screen name={EGuestScreenList.LOGIN} component={LoginScreen} />
      <Stack.Screen name={EGuestScreenList.VERIFY_OTP} component={VerifyOTP} />
      <Stack.Screen name={EGuestScreenList.LOGIN_SUCCESS} component={LoginSucess} />
    </Stack.Navigator>
  );
};

export default GuestNavigator;
