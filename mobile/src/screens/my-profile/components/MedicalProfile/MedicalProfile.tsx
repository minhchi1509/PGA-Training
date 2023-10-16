import { ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import styles from './styles';
import AppText from '@src/components/AppText';
import PractitionerItem from '../PractitionerItem';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { TPractitionerClient, TUpdateMedicalProfileBody } from '@src/interfaces/client-interfaces';
import ExpandableView from '@src/components/ExpandableView';
import Input from '@src/components/Input';
import { LocationIcon } from '@src/assets/icons';
import Button from '@src/components/Button';
import { EClientStatus, EInputType } from '@src/variables/enum';
import { updateMedicalProfileValidationSchema } from '@src/utils/form-validation';
import { EClientThunkActions } from '@src/stores/client/constants';
import { clientThunkActions } from '@src/stores/client';
import GlobalNavigation from '@src/utils/navigation-utils';
import { showErrorToast, showSuccessToast } from '@src/utils/toast-utils';
import ErrorResponse from '@src/interfaces/error-response-interfaces';

const MedicalProfile = () => {
  const profile = useAppSelector((state) => state.client.profile);
  const dispatch = useAppDispatch();
  const [selectedPractitioner, setSelectedPractitioner] = useState<TPractitionerClient>();
  const isUpdatingMedicalProfile = useAppSelector(
    (state) => state.loading[EClientThunkActions.UPDATE_MEDICAL_PROFILE],
  );

  const handleUpdateMedicalProfile = async (values: TUpdateMedicalProfileBody) => {
    try {
      const response = await dispatch(
        clientThunkActions.updateMedicalProfile({
          body: values,
          practitionerClientId: selectedPractitioner?.profileId || '',
        }),
      ).unwrap();
      await dispatch(clientThunkActions.getClientProfile()).unwrap();
      if (response?.status === EClientStatus.INACTIVE) {
        showErrorToast(
          `You have been discharged by practitioner ${selectedPractitioner?.profile?.firstName} ${selectedPractitioner?.profile?.lastName}`,
        );
        GlobalNavigation.goBack();
        return;
      } else {
        showSuccessToast('Your medical profile have been updated successfully');
      }
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  const { values, touched, errors, handleChange, handleSubmit, setValues } =
    useFormik<TUpdateMedicalProfileBody>({
      initialValues: {
        drName: '',
        drProvideNumber: '',
        drAddress: '',
        diagnosis: '',
        history: '',
        medication: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',
      },
      onSubmit: handleUpdateMedicalProfile,
      validationSchema: updateMedicalProfileValidationSchema,
    });

  useEffect(() => {
    setValues({
      drName: selectedPractitioner?.drName || '',
      drProvideNumber: selectedPractitioner?.drProvideNumber || '',
      drAddress: selectedPractitioner?.drAddress || '',
      diagnosis: selectedPractitioner?.diagnosis || '',
      history: selectedPractitioner?.history || '',
      medication: selectedPractitioner?.medication || '',
      emergencyContactName: selectedPractitioner?.emergencyContactName || '',
      emergencyContactRelationship: selectedPractitioner?.emergencyContactRelationship || '',
      emergencyContactPhone: selectedPractitioner?.emergencyContactPhone || '',
    });
  }, [selectedPractitioner]);

  useEffect(() => {
    if (profile?.client.practitionerClients.length) {
      setSelectedPractitioner(profile?.client.practitionerClients[0]);
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <AppText type='subheading' customStyles={styles.headingTitle}>
        Choose practitioner:
      </AppText>
      <View style={styles.practitionerListContainer}>
        {profile?.client?.practitionerClients.map((practitioner) => {
          const practitionerProfile = practitioner.profile;
          return (
            <PractitionerItem
              name={`${practitionerProfile.firstName} ${practitionerProfile.lastName}`}
              avatar={practitionerProfile?.avatar}
              isSelected={selectedPractitioner?.profileId === practitionerProfile.id}
              key={practitionerProfile.id}
              onPress={() => setSelectedPractitioner(practitioner)}
            />
          );
        })}
      </View>
      <View style={styles.divider} />
      <ExpandableView title='Care infomation'>
        <View style={styles.formContainer}>
          <Input
            leftLabel='Dr'
            value={values.drName}
            onChangeText={handleChange('drName')}
            errorText={touched.drName && errors.drName}
          />
          <Input
            leftLabel={`Dr's Provider Number`}
            keyboardType='number-pad'
            value={values.drProvideNumber}
            onChangeText={handleChange('drProvideNumber')}
            errorText={touched.drProvideNumber && errors.drProvideNumber}
          />
          <Input
            leftLabel={`Dr's Address`}
            suffixIcon={<LocationIcon />}
            value={values.drAddress}
            onChangeText={handleChange('drAddress')}
            errorText={touched.drAddress && errors.drAddress}
          />
          <Input
            leftLabel='Current Diagnoses'
            value={values.diagnosis}
            onChangeText={handleChange('diagnosis')}
            errorText={touched.diagnosis && errors.diagnosis}
          />
          <Input
            leftLabel='Previous Diagnoses'
            value={values.history}
            onChangeText={handleChange('history')}
            errorText={touched.history && errors.history}
          />
          <Input
            leftLabel='Medications'
            value={values.medication}
            onChangeText={handleChange('medication')}
            errorText={touched.medication && errors.medication}
          />
        </View>
      </ExpandableView>
      <View style={styles.divider} />
      <ExpandableView title='Emergency contact'>
        <View style={styles.formContainer}>
          <Input
            leftLabel='Full name'
            value={values.emergencyContactName}
            onChangeText={handleChange('emergencyContactName')}
            errorText={touched.emergencyContactName && errors.emergencyContactName}
          />
          <Input
            leftLabel='Relationship'
            value={values.emergencyContactRelationship}
            onChangeText={handleChange('emergencyContactRelationship')}
            errorText={touched.emergencyContactRelationship && errors.emergencyContactRelationship}
          />
          <Input
            leftLabel='Phone number'
            type={EInputType.PHONE_NUMBER}
            placeholder='+61 xxx xxx xxx'
            value={values.emergencyContactPhone}
            onChangeText={handleChange('emergencyContactPhone')}
            errorText={touched.emergencyContactPhone && errors.emergencyContactPhone}
          />
        </View>
      </ExpandableView>
      <Button
        text='Save changes'
        customStyles={styles.submitButton}
        onPress={() => handleSubmit()}
        loading={isUpdatingMedicalProfile}
      />
    </ScrollView>
  );
};

export default MedicalProfile;
