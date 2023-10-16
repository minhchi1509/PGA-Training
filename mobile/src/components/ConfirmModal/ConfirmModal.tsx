import React, { FC } from 'react';
import { Modal, View } from 'react-native';

import styles from './styles';
import AppText from '../AppText';
import Button from '../Button';
import theme from '@src/themes';

interface IConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  loading?: boolean;
}

const ConfirmModal: FC<IConfirmModalProps> = ({
  isOpen,
  onCancel,
  onOk,
  icon,
  title,
  description,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Yes',
  confirmButtonColor = theme.colors.error,
  loading,
}) => {
  return (
    <Modal visible={isOpen} animationType='fade' transparent>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {icon && icon}
          <View>
            <AppText type='headline' customStyles={styles.modalText}>
              {title}
            </AppText>
            <AppText type='body2' color={theme.colors.darkGrey} customStyles={styles.modalText}>
              {description}
            </AppText>
          </View>
          <View style={styles.actionContainer}>
            <Button
              text={cancelButtonText}
              outlined
              onPress={onCancel}
              customStyles={styles.actionButton}
            />
            <Button
              text={confirmButtonText}
              buttonColor={confirmButtonColor}
              loading={loading}
              customStyles={styles.actionButton}
              onPress={onOk}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
