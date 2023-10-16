import React, { useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import AppText from '@src/components/AppText';
import { RootState, useAppDispatch, useAppSelector } from '@src/stores';
import theme from '@src/themes';
import Input from '@src/components/Input';
import { EInputType } from '@src/variables/enum';
import Button from '@src/components/Button';
import { IChangePasswordForm } from '@src/interfaces/auth-interfaces';
import { useFormik } from 'formik';
import { changePasswordValidationSchema } from '@src/utils/form-validation';
import { showErrorToast, showSuccessToast } from '@src/utils/toast-utils';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { changePassword } from '@src/services/auth-service';
import GlobalNavigation from '@src/utils/navigation-utils';
import { EGuestScreenList, ERootScreenList } from '@src/navigators/navigator-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ChangePassword() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state: RootState) => state.client.profile);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async (form: IChangePasswordForm) => {
    setLoading(true);
    try {
      await changePassword({
        email: profile?.email,
        password: form.oldPassword,
        newPassword: form.newPassword,
      });
      showSuccessToast('Change password successfully!');
      await AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
      GlobalNavigation.reset(ERootScreenList.GUEST_NAVIGATOR);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
    setLoading(false);
  };
  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik<IChangePasswordForm>({
      initialValues: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      onSubmit: handleChangePassword,
      validationSchema: changePasswordValidationSchema,
    });
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <AppText type='display1'>Change password</AppText>
        <AppText type='body2' customStyles={{ textAlign: 'center' }}>
          Strong passwords include numbers, letters and punctuation marks.
        </AppText>
      </View>

      <View style={styles.containerForm}>
        <View style={styles.headerForm}>
          <AppText type='body2' color={theme.colors.darkOneColor}>
            Email:
          </AppText>
          <AppText type='body2' color={theme.colors.primaryColor}>
            {profile?.email}
          </AppText>
        </View>

        <Input
          leftLabel='Old password'
          type={EInputType.PASSWORD}
          value={values.oldPassword}
          onChangeText={handleChange('oldPassword')}
          errorText={touched.oldPassword && errors.oldPassword}
        />

        <Input
          leftLabel='New password'
          type={EInputType.PASSWORD}
          value={values.newPassword}
          onChangeText={handleChange('newPassword')}
          errorText={touched.newPassword && errors.newPassword}
        />

        <Input
          leftLabel='Confirm new password'
          type={EInputType.PASSWORD}
          value={values.confirmNewPassword}
          onChangeText={handleChange('confirmNewPassword')}
          errorText={touched.confirmNewPassword && errors.confirmNewPassword}
        />
      </View>
      <Button loading={loading} text='Reset password' onPress={() => handleSubmit()} />
    </View>
  );
}

export default ChangePassword;
