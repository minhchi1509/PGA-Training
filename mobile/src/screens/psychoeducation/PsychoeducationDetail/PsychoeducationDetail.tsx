import { useEffect } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';

import styles, { tagsStyles } from './styles';
import AppText from '@src/components/AppText';

interface IParamPsychoeducationDetail {
  data: {
    id: string;
    title: string;
    content: string;
    videoLink: string;
    type: string;
    psychoeducationTopicId: string;
  };
  nameTopic: string;
}

const PsychoeducationDetail = () => {
  const { params } = useRoute();
  const { data, nameTopic } = params as IParamPsychoeducationDetail;
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: nameTopic,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container}>
      <AppText type='headline'>{data.title}</AppText>
      {data.type === 'VIDEO' ? (
        <>
          <AppText type='body2'>{data.content}</AppText>
          <RenderHtml source={{ uri: data.videoLink }} contentWidth={width} />
        </>
      ) : (
        <RenderHtml source={{ html: data.content }} contentWidth={width} tagsStyles={tagsStyles} />
      )}
    </ScrollView>
  );
};

export default PsychoeducationDetail;
