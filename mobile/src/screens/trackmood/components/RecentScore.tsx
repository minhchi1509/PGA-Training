import React, { useEffect } from 'react';
import { View } from 'react-native';

import MoodItem from '@src/screens/trackmood/components/MoodItem';
import AppText from '@src/components/AppText';
import { recentScoreStyles } from '@src/screens/trackmood/components/styles';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { getClientMoodRecent } from '@src/stores/client/thunk-actions';

const RecentScore = () => {
  const dispatch = useAppDispatch();
  const { moodeRecent } = useAppSelector((state) => state.client);

  useEffect(() => {
    if (moodeRecent?.length) {
      dispatch(getClientMoodRecent());
    }
  }, []);

  return (
    <View style={recentScoreStyles.container}>
      <AppText customStyles={recentScoreStyles.blockTitle}>Recent score</AppText>
      <View style={recentScoreStyles.emotionContainer}>
        {moodeRecent?.map((item) => (
          <MoodItem data={item} key={item.id} />
        ))}
      </View>
    </View>
  );
};

export default RecentScore;
