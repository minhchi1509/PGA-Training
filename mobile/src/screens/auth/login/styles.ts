import { StyleSheet } from 'react-native';

import theme from '@src/themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 104,
  },
  formItem: {
    marginTop: 24,
  },
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    height: 'auto',
  },
  forgotPasswordButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.primaryColor,
  },
  errorMessage: {
    color: theme.colors.red,
    fontSize: 15,
    paddingTop: 5,
    textAlign: 'center',
  },
});

export default styles;
