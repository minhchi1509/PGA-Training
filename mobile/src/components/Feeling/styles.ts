import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  feelingContainer: {
    height: 88,
    backgroundColor: theme.colors.normalGrey,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    height: 40,
    width: 40,
  },
  active: {
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: theme.colors.primaryColor,
    borderRadius: 24,
  },
});

export default styles;
