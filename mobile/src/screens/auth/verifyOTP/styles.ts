import theme from '@src/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 104,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  codeFieldContainer: {
    paddingVertical: 48,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  textInputHidden: {
    position: 'absolute',
    opacity: 0,
  },
  boxInputActive: {
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
    borderColor: theme.colors.primaryColor,
    borderWidth: 2,
    borderRadius: 8,
  },
  textBoxInputActive: {
    textAlign: 'center',
    fontSize: 32,
    color: theme.colors.primaryColor,
  },
  boxInputInActive: {
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
    borderColor: theme.colors.darkGrey,
    borderWidth: 2,
    borderRadius: 8,
  },
  textBoxInputInActive: {
    textAlign: 'center',
    fontSize: 32,
    color: theme.colors.darkGrey,
  },
  resendButton: {
    width: 228,
    marginVertical: 16,
  },
  backToLoginButton: {
    backgroundColor: 'transparent',
    height: 'auto',
  },
  backToLoginButtonText: {
    fontSize: 12,
    color: theme.colors.primaryColor,
    fontWeight: '400',
  },
});
