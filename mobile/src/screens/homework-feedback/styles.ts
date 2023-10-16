import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  btnContainer: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
  },
});

export default styles;
