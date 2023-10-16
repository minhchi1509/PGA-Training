import { Image, ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { uniqueId } from 'lodash';
import { useFormik } from 'formik';

import styles from './styles';
import AppText from '@src/components/AppText';
import { useAppDispatch, useAppSelector } from '@src/stores';
import Button from '@src/components/Button';
import { CalendarIcon, LocationIcon, PlusIcon } from '@src/assets/icons';
import Input from '@src/components/Input';
import DateTimePicker from '@src/components/DateTimePicker';
import Dropdown from '@src/components/Dropdown';
import { GENDER_OPTIONS, LIMIT_AVATAR_SIZE_MY_PROFILE } from '@src/variables/constants';
import { showErrorToast, showSuccessToast } from '@src/utils/toast-utils';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { updateMyInformationValidationSchema } from '@src/utils/form-validation';
import { clientThunkActions } from '@src/stores/client';
import { EClientThunkActions } from '@src/stores/client/constants';
import { EInputType } from '@src/variables/enum';
import { TUpdateInformationProfileBody } from '@src/interfaces/client-interfaces';
import { createFormData } from '@src/utils/common-utils';

const MyInformation = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.client.profile);
  const clientProfile = profile?.client;
  const [previewAvatar, setPreviewAvatar] = useState<Asset>();
  const isUpdatingInformation = useAppSelector(
    (state) => state.loading[EClientThunkActions.UPDATE_INFORMATION],
  );

  const handleSelectPhoto = async () => {
    try {
      const options: ImageLibraryOptions = {
        quality: 1,
        mediaType: 'photo',
        selectionLimit: 1,
      };
      const { assets } = await launchImageLibrary(options);
      const file = {
        ...(assets as Asset[])['0'],
        id: uniqueId(),
      };
      if (!file.type || !file.fileSize) return;
      if (file.fileSize > LIMIT_AVATAR_SIZE_MY_PROFILE) {
        showErrorToast('This file should not exceed 1MB');
        return;
      }
      setPreviewAvatar(file);
    } catch (error) {}
  };

  const handleUpdateInformation = async (values: TUpdateInformationProfileBody) => {
    try {
      const formData = createFormData<TUpdateInformationProfileBody>({
        ...values,
        ...(previewAvatar?.uri && {
          avatar: {
            uri: previewAvatar.uri,
            name: previewAvatar.fileName || '',
            type: previewAvatar.type || '',
          },
        }),
      });
      await dispatch(clientThunkActions.updateInformation(formData)).unwrap();
      showSuccessToast('You have successfully updated your information');
      await dispatch(clientThunkActions.getClientProfile()).unwrap();
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  const { values, touched, errors, handleChange, setFieldValue, handleSubmit } =
    useFormik<TUpdateInformationProfileBody>({
      initialValues: {
        title: clientProfile?.title || '',
        firstName: clientProfile?.firstName || '',
        lastName: clientProfile?.lastName || '',
        email: profile?.email || '',
        dob: clientProfile?.dob || '',
        gender: clientProfile?.gender || '',
        phone: clientProfile?.phone || '',
        occupation: clientProfile?.occupation || '',
        address: clientProfile?.address || '',
      },
      onSubmit: handleUpdateInformation,
      validationSchema: updateMyInformationValidationSchema,
    });

  return (
    <ScrollView style={styles.container}>
      <AppText type='subheading' customStyles={styles.headingTitle}>
        Profile picture
      </AppText>
      {(previewAvatar?.uri || profile?.client?.avatar) && (
        <Image
          source={{ uri: previewAvatar?.uri || profile?.client?.avatar }}
          style={styles.avatarImage}
        />
      )}
      <Button
        prefixIcon={<PlusIcon />}
        text='Upload logo'
        customStyles={styles.uploadButton}
        customTextStyles={styles.uploadBtnText}
        onPress={handleSelectPhoto}
      />
      <AppText type='subheading' customStyles={styles.headingTitle}>
        Personal information
      </AppText>
      <View style={styles.formContainer}>
        <Input
          leftLabel='Title'
          value={values.title}
          onChangeText={handleChange('title')}
          errorText={touched.title && errors.title}
        />
        <View style={styles.nameFormItemContainer}>
          <Input
            leftLabel='First name'
            customContainerStyles={{ flex: 1 }}
            value={values.firstName}
            onChangeText={handleChange('firstName')}
            errorText={touched.firstName && errors.firstName}
          />
          <Input
            leftLabel='Last name'
            customContainerStyles={{ flex: 1 }}
            value={values.lastName}
            onChangeText={handleChange('lastName')}
            errorText={touched.lastName && errors.lastName}
          />
        </View>
        <Input
          leftLabel='Email'
          value={values.email}
          onChangeText={handleChange('email')}
          errorText={touched.email && errors.email}
        />
        <DateTimePicker
          pickerMode='date'
          value={new Date(values.dob || new Date().toISOString())}
          leftLabel='D.O.B'
          rightLabel='DD / MM / YYYY'
          format='DD/MM/YYYY'
          suffixIcon={<CalendarIcon />}
          onDateChange={(date) => setFieldValue('dob', date.toISOString())}
          maximumDate={new Date()}
        />
        <Dropdown
          leftLabel='Sex'
          options={GENDER_OPTIONS}
          value={values.gender}
          onSelectItem={(item) => setFieldValue('gender', item.value)}
          errorText={touched.gender && errors.gender}
        />
        <Input
          leftLabel='Phone number'
          type={EInputType.PHONE_NUMBER}
          value={values.phone}
          placeholder='+61 xxx xxx xxx'
          onChangeText={handleChange('phone')}
          errorText={touched.phone && errors.phone}
        />
        <Input
          leftLabel='Occupation'
          value={values.occupation}
          onChangeText={handleChange('occupation')}
          errorText={touched.occupation && errors.occupation}
        />
        <Input
          leftLabel='Address'
          suffixIcon={<LocationIcon />}
          value={values.address}
          onChangeText={handleChange('address')}
          errorText={touched.address && errors.address}
        />
        <Button
          text='Save changes'
          onPress={() => handleSubmit()}
          loading={isUpdatingInformation}
        />
      </View>
    </ScrollView>
  );
};

export default MyInformation;
