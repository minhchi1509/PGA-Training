import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  tabBarContainer: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
  },
  indicator: {
    backgroundColor: theme.colors.success,
    height: 3,
    borderRadius: 10,
  },
  tabBarItem: {
    paddingBottom: 6,
    width: 'auto',
    marginRight: 30,
  },
  tabBarlabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default styles;
