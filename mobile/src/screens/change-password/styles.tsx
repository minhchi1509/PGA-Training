import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: theme.colors.backgroundColor,
    padding: 16,
    gap: 24,
  },
  containerHeader: {
    alignItems: 'center',
  },
  containerForm: {
    gap: 16,
  },
  headerForm: {
    flexDirection: 'row',
    gap: 4,
  },
});

export default styles;
