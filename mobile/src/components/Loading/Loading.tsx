import { ActivityIndicator, View } from 'react-native';
import React from 'react';

import styles from './styles';
import theme from '@src/themes';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={theme.colors.primaryColor} />
    </View>
  );
};

export default Loading;
