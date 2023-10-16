import React from 'react';
import { View } from 'react-native';

import AppText from '@src/components/AppText';
import { wellcomeText } from '@src/screens/home/components/styles';

interface IProps {
  name?: string;
}

const WelcomeText = (props: IProps) => {
  const { name } = props;

  return (
    <View>
      <AppText customStyles={wellcomeText.welcomeText}>
        Hello, <AppText customStyles={wellcomeText.blueText}>{name}</AppText>
      </AppText>
      <AppText customStyles={wellcomeText.welcomeTitle}>How are you feeling today?</AppText>
    </View>
  );
};

export default WelcomeText;
