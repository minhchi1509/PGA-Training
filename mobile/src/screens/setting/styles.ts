import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { padding: 16 },
  boxContainer: {
    padding: 16,
    backgroundColor: theme.colors.white,
    height: 1000,
    rowGap: 8,
  },
  box: {
    flexDirection: 'row',
    columnGap: 16,
    backgroundColor: theme.colors.normalGrey,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: 'flex-start',
  },
  icon: {
    width: 24,
    height: 24,
    marginVertical: 4,
  },
  deActive: {
    borderWidth: 1,
    marginTop: 16,
    borderColor: theme.colors.error,
    alignItems: 'center',
  },
  logout: {
    borderWidth: 1,
    marginTop: 16,
    borderColor: theme.colors.lightGrey,
    alignItems: 'center',
  },
});

export default styles;
