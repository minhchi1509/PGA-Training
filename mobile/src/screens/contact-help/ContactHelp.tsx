import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import styles from './styles';
import AppText from '@src/components/AppText';
import Button from '@src/components/Button';
import { ExcelIcon, ExportIcon } from '@src/assets/icons';
import theme from '@src/themes';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { CancelImage } from '@src/assets/images';
import { sendContactHelp } from '@src/services/client-service';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { showErrorToast, showSuccessToast } from '@src/utils/toast-utils';
import Input from '@src/components/Input';
import { useFormik } from 'formik';
import { contactHelpValidationSchema } from '@src/utils/validation-utils';
import { IcontactHelpTextParams } from '@src/interfaces/client-interfaces';

function ContactHelp() {
  const [docs, setDocs] = useState<Array<DocumentPickerResponse>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<IcontactHelpTextParams>({
    initialValues: {
      name: '',
      comment: '',
    },
    onSubmit: (values: IcontactHelpTextParams) => {
      setLoading(true);

      try {
        sendContactHelp({ name: values.name, content: values.comment, attachments: docs });
        showSuccessToast('Send help successfully');
        setDocs([]);
      } catch (error) {
        const errorMessage = (error as ErrorResponse).message;
        showErrorToast(errorMessage);
      }
      setLoading(false);

      formik.resetForm();
    },
    validationSchema: contactHelpValidationSchema,
  });

  const handlePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        allowMultiSelection: true,
      });

      setDocs(res);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  const handleDeletePicker = (uri: string) => {
    setDocs((pre) => {
      return pre.filter((item: DocumentPickerResponse) => item.uri !== uri);
    });
  };

  return (
    <View style={styles.container}>
      <Input
        leftLabel='Name'
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        errorText={formik.touched.name ? formik.errors.name : undefined}
      />

      <Input
        leftLabel='Comment'
        numberOfLines={6}
        placeholder='Comment'
        value={formik.values.comment}
        onChangeText={formik.handleChange('comment')}
        errorText={formik.touched.comment ? formik.errors.comment : undefined}
        customInputStyles={{ textAlignVertical: 'top' }}
      />

      <View style={styles.uploadContainer}>
        {docs.length > 0 && (
          <View style={styles.showPickerContainer}>
            <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                contentContainerStyle={{
                  columnGap: 4,
                }}
                scrollEnabled
              >
                {docs
                  .filter((item: DocumentPickerResponse) => item.type?.includes('image'))
                  .map((item: DocumentPickerResponse, id) => (
                    <View key={id}>
                      <Image style={styles.imagePicker} source={{ uri: item.uri }} />
                      <Pressable
                        style={styles.closeButton}
                        onPress={() => handleDeletePicker(item.uri)}
                      >
                        <Image source={CancelImage} />
                      </Pressable>
                    </View>
                  ))}
              </ScrollView>
            </View>
            <View style={styles.docsContainer}>
              <ScrollView contentContainerStyle={{ rowGap: 4 }} scrollEnabled={true}>
                {docs
                  .filter((item: DocumentPickerResponse) => !item.type?.includes('image'))
                  .map((item: DocumentPickerResponse, id) => (
                    <Pressable key={id} style={styles.docBox}>
                      <ExcelIcon />
                      <View>
                        <AppText>{item.name?.slice(0, 40)} ...</AppText>
                        <AppText>{item.size && (item.size / 1024 / 1024).toFixed(2)} MB</AppText>
                      </View>
                    </Pressable>
                  ))}
              </ScrollView>
            </View>
          </View>
        )}
        <Button
          buttonColor={theme.colors.white}
          prefixIcon={<ExportIcon />}
          text='Upload file'
          customStyles={styles.uploadButton}
          customTextStyles={{ color: theme.colors.primaryColor }}
          onPress={handlePicker}
        />
        <AppText color={theme.colors.darkGrey}>
          Support files format: PDF, PNG, JPG, JPEG,...
        </AppText>
      </View>

      <Button loading={loading} text='Submit' onPress={() => formik.handleSubmit()} />
    </View>
  );
}

export default ContactHelp;
