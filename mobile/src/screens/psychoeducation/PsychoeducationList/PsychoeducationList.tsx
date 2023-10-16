import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import styles from './styles';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import GlobalNavigation from '@src/utils/navigation-utils';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import Loading from '../components/Loading';
import { clientService } from '@src/services';
import { showErrorToast } from '@src/utils/toast-utils';
import { EPsychoEducationList } from '@src/navigators/navigator-constants';
import { ChevronRightIcon } from '@src/assets/icons';

interface IListPsychoeducationResponse {
  data: {
    id: string;
    title: string;
    videoLink: string;
    type: string;
    psychoeducationTopicId: string;
  }[];
  currentPage: number;
  totalPage: number;
  totalRecord: number;
}

interface IParamPsychoeducationList {
  id: string;
  nameTopic: string;
}

const PsychoeducationList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false);
  const [listPsychoeducation, setListPsychoeducation] = useState<IListPsychoeducationResponse>({
    data: [],
    currentPage: 0,
    totalPage: 0,
    totalRecord: 0,
  });
  const { params } = useRoute();
  const { id, nameTopic } = params as IParamPsychoeducationList;
  const navigation = useNavigation();

  const handleGetListPsychoEducation = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getListPsychoeducation(id);
      setListPsychoeducation(response);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: nameTopic,
    });
    handleGetListPsychoEducation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hanleGetPsychoeducationDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await clientService.getPsychoeducationDetail(id);
      GlobalNavigation.navigate(EPsychoEducationList.PSYCHOEDUCATION_DETAIL, {
        data: response,
        nameTopic: nameTopic,
      });
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setIsLoadMore(true);
      const page = listPsychoeducation.currentPage + 1;
      const response = await clientService.getListPsychoeducation(id, page);
      setListPsychoeducation({
        ...listPsychoeducation,
        data: [...listPsychoeducation.data, response.data],
        currentPage: response.currentPage,
        totalPage: response.totalPage,
        totalRecord: response.totalRecord,
      });
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    } finally {
      setIsLoadMore(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          style={styles.container}
          data={listPsychoeducation?.data}
          numColumns={1}
          horizontal={false}
          renderItem={({ item }) => {
            const colorType = item.type === 'ARTICLE' ? theme.colors.success : theme.colors.error;
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => hanleGetPsychoeducationDetail(item.id)}
              >
                <View style={[styles.rectangle, { backgroundColor: colorType }]}></View>
                <AppText type='body1' customStyles={styles.title}>
                  {item.title}
                </AppText>
                <ChevronRightIcon />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleGetListPsychoEducation} />
          }
          ListFooterComponent={() =>
            isLoadMore ? (
              <View style={styles.loading}>
                <ActivityIndicator size='small' color={theme.colors.primaryColor} />
              </View>
            ) : null
          }
          initialNumToRender={10}
          onEndReached={handleLoadMore}
        />
      )}
    </>
  );
};

export default PsychoeducationList;
