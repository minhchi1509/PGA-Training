import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.white,
    gap: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  btn: {
    flex: 1,
  },
});

export default styles;
