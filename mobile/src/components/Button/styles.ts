import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    backgroundColor: theme.colors.primaryColor,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  outlinedButtonContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    borderStyle: 'solid',
  },
  outlinedText: {
    color: theme.colors.darkOneColor,
  },
  prefixComponentContainer: {
    marginRight: 10,
  },
  suffixComponentContainer: {
    marginLeft: 'auto',
  },
  buttonText: {
    fontSize: 14,
    color: theme.colors.white,
    fontWeight: '500',
  },
});

export default styles;
