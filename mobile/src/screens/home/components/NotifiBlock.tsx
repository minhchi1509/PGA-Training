import React from 'react';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';

import AppText from '@src/components/AppText';
import { notifiBlockStyles } from './styles';

interface IProps {
  title: string;
  count?: string | number;
  buttonContent: string;
  onPress?: (event: GestureResponderEvent) => void;
}

const NotifiBlock = (props: IProps) => {
  const { title, count, buttonContent, onPress } = props;

  return (
    <View style={notifiBlockStyles.container}>
      <View style={notifiBlockStyles.topContainer}>
        <AppText customStyles={notifiBlockStyles.blockNumber}>{count}</AppText>
        <AppText customStyles={notifiBlockStyles.blockTitle}>{title}</AppText>
      </View>
      <TouchableOpacity onPress={onPress} style={notifiBlockStyles.button}>
        <AppText customStyles={notifiBlockStyles.blockTitle}>{buttonContent}</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default NotifiBlock;
