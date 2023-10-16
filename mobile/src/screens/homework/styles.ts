import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
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
    height: 48,
    width: 'auto',
  },
  tabBarlabel: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default styles;
