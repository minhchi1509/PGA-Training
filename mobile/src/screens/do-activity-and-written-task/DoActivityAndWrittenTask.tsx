/* eslint-disable prefer-const */
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import styles from './styles';
import {
  TDoActivityAndWrittenTaskForm,
  TFileDetailResponse,
  TGetHomeworkAssignDetailResponse,
  TSubmitHomeworkAssignRequest,
} from '@src/interfaces/homework-interfaces';
import AppText from '@src/components/AppText';
import Input from '@src/components/Input';
import { EInputType } from '@src/variables/enum';
import Button from '@src/components/Button';
import { CloseIcon, ExportIcon } from '@src/assets/icons';
import theme from '@src/themes';
import Feeling from '@src/components/Feeling';
import { doActivityAndWrittenTaskValidationSchema } from '@src/utils/validation-utils';
import GlobalNavigation from '@src/utils/navigation-utils';
import {
  LIMIT_IMAGE_SIZE_HOME_WORK,
  LIMIT_NUMBER_OF_FILES_HOMEWORK,
  LIMIT_VIDEO_SIZE_HOME_WORK,
} from '@src/variables/constants';
import { showErrorToast } from '@src/utils/toast-utils';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { uniqueId } from 'lodash';
import { createFormData, isImageFileType, isVideoFileType } from '@src/utils/common-utils';
import { homeworkService } from '@src/services';
import { useAppDispatch } from '@src/stores';
import { homeworkThunkActions } from '@src/stores/homework';
import { ERootScreenList } from '@src/navigators/navigator-constants';

dayjs.extend(timezone);

const DoActivityAndWrittenTask = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { params } = useRoute();
  const { id, homework } = params as TGetHomeworkAssignDetailResponse;
  const [fileList, setFileList] = useState<Asset[]>([]);
  const [isSubmittingHomework, setIsSubmittingHomework] = useState<boolean>(false);

  const handleSubmitHomework = async (values: TDoActivityAndWrittenTaskForm) => {
    try {
      setIsSubmittingHomework(true);
      let url: TFileDetailResponse[] = [];
      const fileForm = {
        files: fileList.map((file) => ({
          uri: file.uri,
          name: file.fileName,
          type: file.type,
        })),
      };
      if (fileList.length) {
        url = (await homeworkService.uploadHomeworkFiles(createFormData(fileForm))).url;
      }
      const submitHomeworkBody: TSubmitHomeworkAssignRequest = {
        rate: values.rate,
        feedback: values.comment,
        isRejected: false,
        clientResponse: {
          responseText: values.response,
          answerQuestion: [],
        },
        images: url,
        timezone: dayjs.tz.guess(),
      };
      await dispatch(
        homeworkThunkActions.submitHomework({ id, body: submitHomeworkBody }),
      ).unwrap();
      GlobalNavigation.reset(ERootScreenList.HOMEWORK_DONE, homework);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    } finally {
      setIsSubmittingHomework(false);
    }
  };

  const { handleSubmit, values, handleChange, errors, touched, setFieldValue } =
    useFormik<TDoActivityAndWrittenTaskForm>({
      initialValues: {
        rate: undefined,
        comment: '',
        response: '',
      },
      onSubmit: handleSubmitHomework,
      validationSchema: doActivityAndWrittenTaskValidationSchema,
    });

  const handleSelectFile = async () => {
    if (fileList.length > LIMIT_NUMBER_OF_FILES_HOMEWORK - 1) {
      showErrorToast('You have reached the maximum number of files');
      return;
    }
    try {
      const options: ImageLibraryOptions = {
        quality: 1,
        mediaType: 'mixed',
        selectionLimit: 1,
      };
      const { assets } = await launchImageLibrary(options);
      const file = {
        ...(assets as Asset[])['0'],
        id: uniqueId(),
      };
      if (!file.type || !file.fileSize) return;
      if (isImageFileType(file.type) && file.fileSize > LIMIT_IMAGE_SIZE_HOME_WORK) {
        showErrorToast('This file should not exceed 5MB');
        return;
      }
      if (isVideoFileType(file.type) && file.fileSize > LIMIT_VIDEO_SIZE_HOME_WORK) {
        showErrorToast('This file should not exceed 20MB');
        return;
      }
      setFileList([...fileList, file]);
    } catch (error) {}
  };

  const handleRemoveFile = (id: string) => {
    setFileList(fileList.filter((file) => file.id !== id));
  };

  useEffect(() => {
    navigation.setOptions({
      title: homework.title,
    });
  }, [homework]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <AppText type='button' customStyles={{ marginBottom: 8 }}>
        Your response
      </AppText>
      <Input
        type={EInputType.TEXTAREA}
        numberOfLines={5}
        placeholder='Homework result'
        value={values.response}
        onChangeText={handleChange('response')}
        errorText={touched.response && errors.response}
      />
      <View style={styles.uploadContainer}>
        {fileList.length > 0 && (
          <View style={styles.previewFileConatiner}>
            {fileList.map((file, index) => (
              <View key={index}>
                {isImageFileType(file.type || '') ? (
                  <Image key={index} source={{ uri: file.uri }} style={styles.filePreview} />
                ) : (
                  <Video
                    key={index}
                    source={{ uri: file.uri }}
                    style={styles.filePreview}
                    paused={true}
                  />
                )}
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.closeButton}
                  onPress={() => handleRemoveFile(file.id || '')}
                >
                  <CloseIcon color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <Button
          prefixIcon={<ExportIcon />}
          text='Upload file'
          customStyles={styles.uploadButton}
          customTextStyles={styles.uploadBtnText}
          onPress={handleSelectFile}
        />
        <AppText
          type='caption'
          color={theme.colors.darkGrey}
          customStyles={{ textAlign: 'center' }}
        >
          Support files format: PNG, JPG, JPEG, MP4 and MOV
        </AppText>
      </View>
      <AppText type='button'>How did doing this task make you feel? (Optional)</AppText>
      <Feeling
        customContainerStyles={{ marginTop: 8 }}
        value={values.rate}
        onPressFeelingItem={(value) => setFieldValue('rate', value)}
      />
      <Input
        customContainerStyles={{ marginTop: 16 }}
        type={EInputType.TEXTAREA}
        numberOfLines={5}
        placeholder='Comment'
        value={values.comment}
        onChangeText={handleChange('comment')}
      />
      <View style={styles.actionBtnContainer}>
        <Button
          text='Cancel'
          outlined
          customStyles={styles.actionBtn}
          onPress={() => GlobalNavigation.goBack()}
        />
        <Button
          text='Submit'
          customStyles={styles.actionBtn}
          onPress={() => handleSubmit()}
          loading={isSubmittingHomework}
        />
      </View>
    </ScrollView>
  );
};

export default DoActivityAndWrittenTask;
