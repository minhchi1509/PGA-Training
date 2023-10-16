import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import theme from '@src/themes';

const inputStyles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 13,
  },
});

const styles = {
  ...inputStyles,
  getBackgroundInputColor: (disabled?: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: disabled ? theme.colors.disabledColor : theme.colors.lightThreeColor,
  }),
  getTextAreaStyles: (numberOfLines?: number): StyleProp<TextStyle> => ({
    textAlignVertical: 'top',
    height: 16 * (numberOfLines ?? 1),
  }),
};

export default styles;
