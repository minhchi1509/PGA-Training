import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 16,
    gap: 16,
  },
  header: {
    backgroundColor: theme.colors.bgBase,
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumbnailImage: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  actionContainer: {
    padding: 16,
    gap: 16,
    backgroundColor: theme.colors.normalGrey,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
  },
});

export default styles;
