import theme from '@src/themes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 40,
  },
  headingTitle: {
    marginBottom: 16,
  },
  practitionerListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  divider: {
    borderBottomColor: theme.colors.lightGrey,
    borderBottomWidth: 1,
    marginVertical: 24,
  },
  formContainer: {
    gap: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default styles;
