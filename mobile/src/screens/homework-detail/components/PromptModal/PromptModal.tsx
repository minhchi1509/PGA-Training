import { Modal, View } from 'react-native';
import React, { FC } from 'react';
import { useFormik } from 'formik';

import styles from './styles';
import AppText from '@src/components/AppText';
import Input from '@src/components/Input';
import { EInputType } from '@src/variables/enum';
import Button from '@src/components/Button';

interface IPromptModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  isSubmitting: boolean;
}

const PromptModal: FC<IPromptModalProps> = ({ title, open, onCancel, onSubmit, isSubmitting }) => {
  const { handleSubmit, values, handleChange } = useFormik({
    initialValues: {
      comment: '',
    },
    onSubmit: (values) => onSubmit(values.comment),
  });

  return (
    <Modal visible={open} animationType='fade' transparent>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <AppText type='title' customStyles={{ textAlign: 'center' }}>
            {title}
          </AppText>
          <View style={{ gap: 8 }}>
            <AppText type='body2'>
              Do you want to let us know why you didn’t do it? (Optional)
            </AppText>
            <Input
              type={EInputType.TEXTAREA}
              numberOfLines={6}
              placeholder='Comment'
              value={values.comment}
              onChangeText={handleChange('comment')}
            />
          </View>
          <View style={styles.actionButtonContainer}>
            <Button text='Cancel' outlined onPress={onCancel} customStyles={styles.button} />
            <Button
              text='Submit'
              onPress={() => handleSubmit()}
              customStyles={styles.button}
              loading={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PromptModal;
