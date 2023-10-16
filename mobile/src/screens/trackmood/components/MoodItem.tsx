import React from 'react';
import dayjs from 'dayjs';

import AppText from '@src/components/AppText';
import { TTrackMood } from '@src/interfaces/trackmood-interfaces';
import { Image, View } from 'react-native';
import { moodItemStyles } from '@src/screens/trackmood/components/styles';
import {
  AngryEmotionImage,
  GreatEmotionImage,
  HappyEmotionImage,
  SadEmotionImage,
  UnHappyEmtionImage,
} from '@src/assets/images';

interface IProps {
  data: TTrackMood;
}

const MoodItem = ({ data }: IProps) => {
  let icon;

  if (data.point <= 2) {
    icon = AngryEmotionImage;
  } else if (data.point > 2 && data.point <= 4) {
    icon = SadEmotionImage;
  } else if (data.point > 4 && data.point <= 6) {
    icon = UnHappyEmtionImage;
  } else if (data.point > 6 && data.point <= 8) {
    icon = HappyEmotionImage;
  } else {
    icon = GreatEmotionImage;
  }

  const convertDay = (date: string) => {
    return dayjs(date).format('ddd');
  };
  return (
    <View style={moodItemStyles.container}>
      <Image source={icon} style={moodItemStyles.image} />
      <AppText customStyles={moodItemStyles.text}>{convertDay(data.createdAt)}</AppText>
    </View>
  );
};

export default MoodItem;
