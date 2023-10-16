import React, { FC } from 'react';
import { View } from 'react-native';
import styles from './styles';
import theme from '@src/themes';
import { ErrorToastIcon, SuccessToastIcon } from '@src/assets/icons';
import AppText from '../AppText';

interface IToastProps {
  message: string;
}

export const SuccessToast: FC<IToastProps> = ({ message }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgSuccess }]}>
      <SuccessToastIcon />
      <AppText type='caption'>{message}</AppText>
    </View>
  );
};

export const ErrorToast: FC<IToastProps> = ({ message }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgError }]}>
      <ErrorToastIcon />
      <AppText type='caption'>{message}</AppText>
    </View>
  );
};
