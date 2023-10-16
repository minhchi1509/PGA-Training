import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.normalGrey,
    paddingRight: 10,
    paddingLeft: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderStyle: 'solid',
  },
});

export default styles;
