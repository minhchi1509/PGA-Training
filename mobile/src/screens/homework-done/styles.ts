import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingTop: 42,
  },
  center: {
    alignSelf: 'center',
  },
});

export default styles;
