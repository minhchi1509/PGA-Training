import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.white },
  header: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.lightGrey,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default styles;
