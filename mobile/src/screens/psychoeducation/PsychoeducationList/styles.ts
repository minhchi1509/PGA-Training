import { StyleSheet } from 'react-native';
import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.normalGrey,
    paddingRight: 16,
    borderRadius: 6,
    marginBottom: 8,
    gap: 16,
    overflow: 'hidden',
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingBottom: 16,
  },
  rectangle: {
    height: '100%',
    width: 4,
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
});

export default styles;
