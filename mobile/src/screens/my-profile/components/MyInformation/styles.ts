import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 40,
  },
  headingTitle: {
    marginBottom: 8,
  },
  avatarImage: {
    height: 70,
    width: 70,
    borderRadius: 70,
    alignSelf: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    alignSelf: 'center',
    height: 48,
    width: 156,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.primaryTwoColor,
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primaryTwoColor,
  },
  formContainer: {
    gap: 16,
  },
  nameFormItemContainer: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default styles;
