import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import theme from '@src/themes';

const dropDownStyles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputSelect: {
    height: 48,
    backgroundColor: theme.colors.lightThreeColor,
    borderRadius: 10,
    padding: 10,
  },
  optionsBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
  },
  itemContainer: {
    paddingTop: 16,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    gap: 16,
  },
  selectedText: {
    fontSize: 14,
    color: theme.colors.darkOneColor,
  },
});

const styles = {
  ...dropDownStyles,
  getInputBackgroundInputColor: (disabled?: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: disabled ? theme.colors.disabledColor : theme.colors.lightThreeColor,
  }),
};

export default styles;
