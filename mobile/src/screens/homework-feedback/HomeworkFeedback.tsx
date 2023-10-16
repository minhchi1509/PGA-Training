import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import styles from './styles';
import AppText from '@src/components/AppText';
import Feeling from '@src/components/Feeling';
import { useFormik } from 'formik';
import {
  THomeworkFeedbackForm,
  TSubmitHomeworkAssignRequest,
} from '@src/interfaces/homework-interfaces';
import Input from '@src/components/Input';
import { EHomeworkType, EInputType } from '@src/variables/enum';
import Button from '@src/components/Button';
import GlobalNavigation from '@src/utils/navigation-utils';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { EHomeworkThunkActions } from '@src/stores/homework/constants';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { showErrorToast } from '@src/utils/toast-utils';
import { homeworkThunkActions } from '@src/stores/homework';
import { ERootScreenList } from '@src/navigators/navigator-constants';

dayjs.extend(timezone);

const HomeworkFeedback = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { homework, id } = params as any;
  const isSubmittingHomework = useAppSelector(
    (state) => state.loading[EHomeworkThunkActions.SUBMIT_HOMEWORK],
  );

  const handleSubmitHomework = async (values: THomeworkFeedbackForm) => {
    try {
      const body: TSubmitHomeworkAssignRequest = {
        rate: values.rate,
        feedback: values.comment,
        isRejected: false,
        timezone: dayjs.tz.guess(),
      };

      switch (homework.type) {
        case EHomeworkType.VIDEO:
          break;
        case EHomeworkType.QUESTIONNAIRE:
          break;
        default:
          break;
      }

      await dispatch(homeworkThunkActions.submitHomework({ id, body })).unwrap();
      GlobalNavigation.reset(ERootScreenList.HOMEWORK_DONE, homework);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  const { handleSubmit, values, handleChange, setFieldValue } = useFormik<THomeworkFeedbackForm>({
    initialValues: {
      rate: undefined,
      comment: '',
    },
    onSubmit: handleSubmitHomework,
  });

  useEffect(() => {
    navigation.setOptions({ title: homework.title });
  }, [id]);

  return (
    <View style={styles.container}>
      <AppText type='button' customStyles={{ marginBottom: 8 }}>
        How did doing this task make you feel? (Optional)
      </AppText>
      <Feeling
        value={values.rate}
        onPressFeelingItem={(value) => setFieldValue('rate', value)}
        customContainerStyles={{ marginBottom: 16 }}
      />
      <Input
        type={EInputType.TEXTAREA}
        numberOfLines={5}
        placeholder='Comment'
        value={values.comment}
        onChangeText={handleChange('comment')}
      />
      <View style={styles.btnContainer}>
        <Button
          text='Cancel'
          outlined
          customStyles={styles.button}
          onPress={() => GlobalNavigation.goBack()}
        />
        <Button
          text='Submit'
          customStyles={styles.button}
          onPress={() => handleSubmit()}
          loading={isSubmittingHomework}
        />
      </View>
    </View>
  );
};

export default HomeworkFeedback;
