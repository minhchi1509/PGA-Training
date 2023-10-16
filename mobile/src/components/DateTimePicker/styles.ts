import theme from '@src/themes';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

const datePickerstyles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerInput: {
    height: 48,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
  },
});

const styles = {
  ...datePickerstyles,
  getInputBackgroundColor: (disabled?: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: disabled ? theme.colors.disabledColor : theme.colors.lightThreeColor,
  }),
};
export default styles;
