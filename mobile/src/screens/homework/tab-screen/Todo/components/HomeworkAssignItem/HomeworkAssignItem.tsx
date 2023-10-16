import { TouchableOpacity } from 'react-native';
import React, { FC } from 'react';

import styles from './styles';
import { EHomeworkType } from '@src/variables/enum';
import theme from '@src/themes';
import AppText from '@src/components/AppText';

interface IHomeworkAssignItemProps {
  name: string;
  type: EHomeworkType;
  onPress: () => void;
}

const borderColors = {
  [EHomeworkType.ACTIVITY]: theme.colors.warning,
  [EHomeworkType.QUESTIONNAIRE]: theme.colors.purple,
  [EHomeworkType.VIDEO]: theme.colors.error,
  [EHomeworkType.WRITTEN_TASK]: theme.colors.success,
};

const HomeworkAssignItem: FC<IHomeworkAssignItemProps> = ({ name, type, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: borderColors[type] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppText type='body1'>{name}</AppText>
    </TouchableOpacity>
  );
};

export default HomeworkAssignItem;
