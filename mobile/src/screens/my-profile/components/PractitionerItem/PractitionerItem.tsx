import { Image, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import styles from './styles';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import { CheckFilledIcon } from '@src/assets/icons';

interface IPPractitionerItemProps {
  name: string;
  avatar: string;
  isSelected: boolean;
  onPress: () => void;
}

const PractitionerItem: FC<IPPractitionerItemProps> = ({ name, avatar, isSelected, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        {isSelected && <CheckFilledIcon style={styles.checkFilledIcon} />}
      </TouchableOpacity>
      <AppText type='body2' color={isSelected ? theme.colors.darkOneColor : theme.colors.darkGrey}>
        {name}
      </AppText>
    </View>
  );
};

export default PractitionerItem;
