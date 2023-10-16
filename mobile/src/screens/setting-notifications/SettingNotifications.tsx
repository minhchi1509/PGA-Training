import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import Button from '@src/components/Button';
import theme from '@src/themes';
import { Switch } from 'react-native-switch';
import { TClientProfile, TNotificationConfig } from '@src/interfaces/client-interfaces';
import { useAppDispatch, useAppSelector } from '@src/stores';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { showErrorToast } from '@src/utils/toast-utils';
import { updateNotificationSetting } from '@src/services/client-service';
import { clientThunkActions } from '@src/stores/client';

function SettingNotifications() {
  const profile = useAppSelector<TClientProfile | undefined>((state) => state.client.profile);

  const [listField, setListField] = useState<TNotificationConfig>(
    profile?.client.notificationConfig
      ? {
          newMessage: profile?.client.notificationConfig.newMessage,
          pratitionerAcceptInvitation:
            profile?.client.notificationConfig.pratitionerAcceptInvitation,
          clientAcceptInvitation: profile?.client.notificationConfig.clientAcceptInvitation,
          clientCompleteTask: profile?.client.notificationConfig.clientCompleteTask,
          clientRelocated: profile?.client.notificationConfig.clientRelocated,
          homeworkReminder: profile?.client.notificationConfig.homeworkReminder,
          relocatedToNewPractitioner: profile?.client.notificationConfig.relocatedToNewPractitioner,
        }
      : {
          newMessage: true,
          pratitionerAcceptInvitation: true,
          clientAcceptInvitation: true,
          clientCompleteTask: true,
          clientRelocated: true,
          homeworkReminder: true,
          relocatedToNewPractitioner: true,
        },
  );
  const toggleSwitch = (field: keyof TNotificationConfig) => {
    setListField((previousState) => ({
      ...previousState,
      [field]: !previousState[field],
    }));
  };
  const dispatch = useAppDispatch();

  const updateSetting = async () => {
    try {
      await updateNotificationSetting(listField);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  useEffect(() => {
    updateSetting();
    return () => {
      dispatch(clientThunkActions.getClientProfile());
    };
  }, [listField]);
  return (
    <View style={styles.container}>
      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='New message'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.newMessage}
            onValueChange={() => toggleSwitch('newMessage')}
          />
        }
      />

      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='Pratitioner accept invitation'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.pratitionerAcceptInvitation}
            onValueChange={() => toggleSwitch('pratitionerAcceptInvitation')}
          />
        }
      />

      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='Client accept invitation'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.clientAcceptInvitation}
            onValueChange={() => toggleSwitch('clientAcceptInvitation')}
          />
        }
      />

      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='Client complete task'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.clientCompleteTask}
            onValueChange={() => toggleSwitch('clientCompleteTask')}
          />
        }
      />

      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='Client relocated'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.clientRelocated}
            onValueChange={() => toggleSwitch('clientRelocated')}
          />
        }
      />

      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='Homework Reminder'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.homeworkReminder}
            onValueChange={() => toggleSwitch('homeworkReminder')}
          />
        }
      />

      <Button
        buttonColor={theme.colors.normalGrey}
        customTextStyles={styles.textButton}
        text='Relocated to new practitioner'
        suffixIcon={
          <Switch
            renderActiveText={false}
            renderInActiveText={false}
            backgroundActive={theme.colors.lightGreen}
            backgroundInactive={theme.colors.darkGrey}
            value={listField.relocatedToNewPractitioner}
            onValueChange={() => toggleSwitch('relocatedToNewPractitioner')}
          />
        }
      />
    </View>
  );
}

export default SettingNotifications;
