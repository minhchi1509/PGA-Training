import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';

import styles from './styles';
import { TGetHomeworkAssignDetailResponse } from '@src/interfaces/homework-interfaces';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import getYouTubeID from 'get-youtube-id';
import Button from '@src/components/Button';
import GlobalNavigation from '@src/utils/navigation-utils';
import { ERootScreenList } from '@src/navigators/navigator-constants';

const WatchVideo = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { id, homework } = params as TGetHomeworkAssignDetailResponse;
  const youtubeId = getYouTubeID(homework.videoLink || '');

  useEffect(() => {
    navigation.setOptions({
      title: homework.title,
    });
  }, [id]);

  return (
    <View style={styles.container}>
      <AppText type='body2' color={theme.colors.darkGrey}>
        {homework.description}
      </AppText>
      {youtubeId && <YoutubePlayer height={256} videoId={youtubeId} />}
      <View style={styles.buttonContainer}>
        <Button
          text='Cancel'
          outlined
          customStyles={styles.btn}
          onPress={() => GlobalNavigation.goBack()}
        />
        <Button
          text='Next'
          customStyles={styles.btn}
          onPress={() => GlobalNavigation.navigate(ERootScreenList.HOMEWORK_FEEDBACK, params)}
        />
      </View>
    </View>
  );
};

export default WatchVideo;
