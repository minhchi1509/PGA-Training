import { RefreshControl, ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import styles from './styles';
import Loading from '@src/components/Loading';
import { THomeworkAssignData } from '@src/interfaces/homework-interfaces';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { EHomeworkThunkActions } from '@src/stores/homework/constants';
import { homeworkThunkActions } from '@src/stores/homework';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { showErrorToast } from '@src/utils/toast-utils';
import HomeworkGroup from './components/HomeworkGroup';

dayjs.extend(timezone);

const Todo = () => {
  const dispatch = useAppDispatch();
  const [homeworkGroupList, setHomeworkGroupList] = useState<THomeworkAssignData[]>();
  const [selectedHomeworkAssignId, setSelectedHomeworkAssignId] = useState<string>('');
  const isGettingHomeworkAssign = useAppSelector(
    (state) => state.loading[EHomeworkThunkActions.GET_HOMEWORK_ASSIGN],
  );

  const getHomeworkAssign = async () => {
    try {
      const response = await dispatch(
        homeworkThunkActions.getHomeworkAssign({
          dateRange: [new Date().toISOString(), new Date().toISOString()],
          timezone: dayjs.tz.guess(),
        }),
      ).unwrap();
      setHomeworkGroupList(response.data);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  useEffect(() => {
    getHomeworkAssign();
  }, []);

  useEffect(() => {
    if (homeworkGroupList?.length) {
      setSelectedHomeworkAssignId(homeworkGroupList[0].id);
    }
  }, [homeworkGroupList]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={false} onRefresh={getHomeworkAssign} />}
    >
      {isGettingHomeworkAssign ? (
        <Loading />
      ) : homeworkGroupList?.length || 0 > 0 ? (
        <View style={styles.homeworkAssignContainer}>
          {homeworkGroupList?.map((homeworkGroup) => (
            <HomeworkGroup
              key={homeworkGroup.id}
              practitionerName={`${homeworkGroup.firstName} ${homeworkGroup.lastName}`}
              homeworkItemList={homeworkGroup.homeworkAssign}
              isActive={homeworkGroup.id === selectedHomeworkAssignId}
              onPress={() => setSelectedHomeworkAssignId(homeworkGroup.id)}
            />
          ))}
        </View>
      ) : (
        <AppText
          type='caption'
          color={theme.colors.darkGrey}
          customStyles={{ textAlign: 'center' }}
        >
          No homeworks have been assigned
        </AppText>
      )}
    </ScrollView>
  );
};

export default Todo;
