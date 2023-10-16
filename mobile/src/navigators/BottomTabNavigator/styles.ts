import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  left: {
    paddingLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    paddingRight: 16,
  },
  logo: {
    marginRight: 6,
  },
  header: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.lightGrey,
  },
  tabBar: {
    height: 72,
    backgroundColor: theme.colors.primaryColor,
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 16,
    bottom: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  tabBarLabel: {
    fontSize: 9,
    height: 16,
  },
});

export default styles;
