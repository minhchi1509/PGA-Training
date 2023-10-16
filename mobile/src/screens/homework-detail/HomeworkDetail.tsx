import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import styles from './styles';
import {
  TGetHomeworkAssignDetailResponse,
  TSubmitHomeworkAssignRequest,
} from '@src/interfaces/homework-interfaces';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { showErrorToast, showSuccessToast } from '@src/utils/toast-utils';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { homeworkThunkActions } from '@src/stores/homework';
import { EHomeworkThunkActions } from '@src/stores/homework/constants';
import Loading from '@src/components/Loading';
import { EHomeworkType } from '@src/variables/enum';
import AppText from '@src/components/AppText';
import { getThumbnailYoutube } from '@src/utils/common-utils';
import {
  HomeworkTypeActivityImage,
  HomeworkTypeQuestionnaireImage,
  HomeworkTypeTaskImage,
} from '@src/assets/images';
import Button from '@src/components/Button';
import PromptModal from './components/PromptModal';
import GlobalNavigation from '@src/utils/navigation-utils';
import { ERootScreenList } from '@src/navigators/navigator-constants';

dayjs.extend(timezone);

interface IHomeworkDetailParams {
  id: string;
  type: string;
  title: string;
  description: string;
}

const actionTitle = {
  [EHomeworkType.ACTIVITY]: 'Do homework task?',
  [EHomeworkType.WRITTEN_TASK]: 'Do homework task?',
  [EHomeworkType.QUESTIONNAIRE]: 'Do this questionnaire?',
  [EHomeworkType.VIDEO]: 'Watch this video?',
};

const HomeworkDetail = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { id, type, title, description } = params as IHomeworkDetailParams;
  const [homeworkDetail, setHomeworkDetail] = useState<TGetHomeworkAssignDetailResponse>();
  const thumbnailYoutube = getThumbnailYoutube(homeworkDetail?.homework.videoLink);
  const isGettingHomeworkDetail = useAppSelector(
    (state) => state.loading[EHomeworkThunkActions.GET_HOMEWORK_ASSIGN_DETAIL],
  );
  const isSubmittingRejectForm = useAppSelector(
    (state) => state.loading[EHomeworkThunkActions.SUBMIT_HOMEWORK],
  );
  const [openRejectFormModal, setOpenRejectFormModal] = useState<boolean>(false);

  const handleToggleRejectFormModal = () => {
    setOpenRejectFormModal(!openRejectFormModal);
  };

  const handleSubmitRejectForm = async (value: string) => {
    try {
      const body: TSubmitHomeworkAssignRequest = {
        isRejected: true,
        rejectReason: value,
        timezone: dayjs.tz.guess(),
      };
      await dispatch(homeworkThunkActions.submitHomework({ id, body })).unwrap();
      showSuccessToast('Reject homework successfully!');
      GlobalNavigation.goBack();
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    } finally {
      setOpenRejectFormModal(false);
    }
  };

  const handleApproveDoHomeWork = () => {
    switch (type) {
      case EHomeworkType.ACTIVITY:
      case EHomeworkType.WRITTEN_TASK:
        GlobalNavigation.navigate(ERootScreenList.DO_ACTIVITY_AND_WRITTEN_TASK, homeworkDetail);
        break;
      case EHomeworkType.VIDEO:
        GlobalNavigation.navigate(ERootScreenList.WATCH_VIDEO, homeworkDetail);
        break;
      case EHomeworkType.QUESTIONNAIRE:
        GlobalNavigation.navigate(ERootScreenList.DO_QUESTIONNAIRE, homeworkDetail);
        break;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [navigation, title]);

  useEffect(() => {
    const getHomeworkAssignDetail = async (id: string) => {
      try {
        const data = await dispatch(homeworkThunkActions.getHomeworkAssignDetail(id)).unwrap();
        setHomeworkDetail(data);
      } catch (error) {
        const errorMessage = (error as ErrorResponse).message;
        showErrorToast(errorMessage);
      }
    };
    getHomeworkAssignDetail(id);
  }, [dispatch, id]);

  return isGettingHomeworkDetail ? (
    <Loading />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {type === EHomeworkType.VIDEO && thumbnailYoutube ? (
            <Image source={{ uri: thumbnailYoutube }} style={styles.thumbnailImage} />
          ) : (
            <Image
              source={
                type === EHomeworkType.ACTIVITY
                  ? HomeworkTypeActivityImage
                  : type === EHomeworkType.QUESTIONNAIRE
                  ? HomeworkTypeQuestionnaireImage
                  : HomeworkTypeTaskImage
              }
              style={styles.thumbnailImage}
            />
          )}
          <AppText type='title'>{title}</AppText>
        </View>
        <AppText type='body2'>{description}</AppText>
      </View>
      <View style={styles.actionContainer}>
        <AppText type='title'>{actionTitle[type as keyof typeof actionTitle]}</AppText>
        <View style={styles.buttonContainer}>
          <Button
            text='Reject'
            outlined
            customStyles={styles.button}
            onPress={handleToggleRejectFormModal}
          />
          <Button text='Yes' customStyles={styles.button} onPress={handleApproveDoHomeWork} />
        </View>
      </View>
      <PromptModal
        open={openRejectFormModal}
        onCancel={handleToggleRejectFormModal}
        isSubmitting={isSubmittingRejectForm}
        title={title}
        onSubmit={handleSubmitRejectForm}
      />
    </ScrollView>
  );
};

export default HomeworkDetail;
