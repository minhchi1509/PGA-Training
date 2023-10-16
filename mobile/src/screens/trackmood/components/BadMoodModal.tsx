import React from 'react';
import { Modal, View } from 'react-native';

import AppText from '@src/components/AppText';
import Button from '@src/components/Button';
import { badMoodModalStyles } from '@src/screens/trackmood/components/styles';

interface IProps {
  modalVisible: boolean;
  onCloseModalVisible: () => void;
}

const BadMoodModal = (props: IProps) => {
  const { modalVisible, onCloseModalVisible } = props;

  return (
    <Modal visible={modalVisible} animationType='fade' transparent>
      <View style={badMoodModalStyles.modalContainer}>
        <View style={badMoodModalStyles.container}>
          <AppText customStyles={badMoodModalStyles.text}>
            We noticed you have score “1” for today. Is there a loved one you can contact? Otherwise
            if you don’t feel safe call Lifeline on{' '}
            <AppText customStyles={badMoodModalStyles.blueText}>13 11 14</AppText> or ring{' '}
            <AppText customStyles={badMoodModalStyles.blueText}>000</AppText> for immediate
            assistance
          </AppText>
          <Button text='Close' onPress={onCloseModalVisible} />
        </View>
      </View>
    </Modal>
  );
};

export default BadMoodModal;
