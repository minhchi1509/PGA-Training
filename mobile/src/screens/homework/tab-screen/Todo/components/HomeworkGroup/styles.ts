import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  border: {
    width: 4,
    backgroundColor: theme.colors.lightGrey,
    height: 20,
    borderRadius: 10,
  },
  activeBorder: {
    backgroundColor: theme.colors.success,
  },
  homeworkAssignItemContainer: {
    gap: 6,
    marginTop: 8,
  },
});

export default styles;
