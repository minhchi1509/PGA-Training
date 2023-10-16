import React from 'react';
import { View } from 'react-native';

import {
  AngryEmotion,
  GreatEmotion,
  HappyEmotion,
  SadEmotion,
  UnHappyEmtion,
} from '@src/assets/icons';
import { emotionBoxStyles } from '@src/screens/home/components/styles';

const EmotionBox = () => {
  return (
    <View style={emotionBoxStyles.container}>
      <AngryEmotion />
      <SadEmotion />
      <UnHappyEmtion />
      <HappyEmotion />
      <GreatEmotion />
    </View>
  );
};

export default EmotionBox;
