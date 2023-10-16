import { ActivityIndicator, View } from 'react-native';

import styles from './styles';
import theme from '@src/themes';

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={theme.colors.darkGrey} />
    </View>
  );
};

export default Loading;
