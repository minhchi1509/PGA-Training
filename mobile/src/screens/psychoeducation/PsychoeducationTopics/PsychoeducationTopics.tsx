import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import GlobalNavigation from '@src/utils/navigation-utils';
import { showErrorToast } from '@src/utils/toast-utils';
import { EPsychoEducationList } from '@src/navigators/navigator-constants';
import { clientService } from '@src/services';
import Loading from '../components/Loading';
import AppText from '@src/components/AppText';

interface ITopic {
  id: string;
  name: string;
}

const PsychoeducationTopics = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listTopic, setListTopic] = useState<ITopic[]>([]);
  const navigation = useNavigation();

  const getListPsychoEducationTopic = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getListPsychoeducationTopics();
      setListTopic(response.data);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: false,
    });
    getListPsychoEducationTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickTopic = (psychoeducationTopicId: string, name: string) => {
    GlobalNavigation.navigate(EPsychoEducationList.PSYCHOEDUCATION_LIST, {
      id: psychoeducationTopicId,
      nameTopic: name,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          style={styles.container}
          data={listTopic}
          numColumns={3}
          columnWrapperStyle={{
            flexWrap: 'wrap',
            flex: 1,
            justifyContent: 'space-between',
          }}
          horizontal={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.topic}
              onPress={() => handleClickTopic(item.id, item.name)}
            >
              <AppText type='body2'>{item.name}</AppText>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={getListPsychoEducationTopic} />
          }
        />
      )}
    </>
  );
};

export default PsychoeducationTopics;
