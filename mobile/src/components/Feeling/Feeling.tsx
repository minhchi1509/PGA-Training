import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import styles from './styles';
import { FEELING_LIST } from '@src/variables/constants';
import AppText from '../AppText';
import theme from '@src/themes';

interface IFeelingProps {
  value: number | undefined;
  onPressFeelingItem: (value: number) => void;
  customContainerStyles?: StyleProp<ViewStyle>;
  errorMessage?: string | boolean;
}

const Feeling: FC<IFeelingProps> = ({
  customContainerStyles,
  value,
  errorMessage,
  onPressFeelingItem,
}) => {
  return (
    <View style={[styles.container, customContainerStyles]}>
      <View style={styles.feelingContainer}>
        {FEELING_LIST.map((feeling, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPressFeelingItem(feeling.value)}
            activeOpacity={0.7}
          >
            <Image
              source={feeling.image}
              style={[styles.icon, value === feeling.value && styles.active]}
            />
          </TouchableOpacity>
        ))}
      </View>
      {errorMessage && <AppText color={theme.colors.red}>{errorMessage}</AppText>}
    </View>
  );
};

export default Feeling;
