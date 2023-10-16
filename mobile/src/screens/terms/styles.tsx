import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: theme.colors.backgroundColor,
    padding: 16,
    gap: 16,
  },
  containerText: {
    gap: 8,
  },
});

export default styles;
