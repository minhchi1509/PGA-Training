import { StyleSheet } from 'react-native';

import theme from '@src/themes';

export const styles = StyleSheet.create({
  container: {
    marginTop: 160,
    flex: 1,
    rowGap: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loading: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.normalGrey,
  },
  annouceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
