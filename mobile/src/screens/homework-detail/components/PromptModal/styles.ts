import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.modalBackdropColor,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    borderRadius: 8,
    gap: 16,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
  },
});

export default styles;
