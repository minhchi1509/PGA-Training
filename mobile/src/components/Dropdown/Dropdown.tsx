import { StyleProp, Text, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';

import { TSelectItem } from '@src/interfaces/common-interfaces';
import styles from './styles';
import AppText from '../AppText';
import theme from '@src/themes';
import { TickIcon } from '@src/assets/icons';

interface IDropdownProps {
  options: TSelectItem[];
  value: string;
  onSelectItem: (item: TSelectItem) => void;
  customContainerStyles?: StyleProp<ViewStyle>;
  customInputSelectStyles?: StyleProp<ViewStyle>;
  customOptionsBoxStyles?: StyleProp<ViewStyle>;
  leftLabel?: string;
  rightLabel?: string;
  placeHolder?: string;
  maxHeightOptionsBox?: number;
  showRequiredMark?: boolean;
  disabled?: boolean;
  prefixIcon?: React.ReactNode;
  errorText?: string | boolean;
}

const Dropdown: FC<IDropdownProps> = ({
  options,
  value,
  onSelectItem,
  customContainerStyles,
  customInputSelectStyles,
  customOptionsBoxStyles,
  leftLabel,
  rightLabel,
  showRequiredMark,
  placeHolder = '',
  maxHeightOptionsBox = 200,
  disabled,
  prefixIcon,
  errorText,
}) => {
  const handleSelectItem = (item: TSelectItem) => {
    onSelectItem(item);
  };

  const renderItem = (item: TSelectItem, selected?: boolean) => (
    <View style={styles.itemContainer}>
      <AppText type='body1' customStyles={{ flex: 1 }}>
        {item.label}
      </AppText>
      {selected && <TickIcon />}
    </View>
  );

  return (
    <View style={[styles.container, customContainerStyles]}>
      <View style={styles.labelContainer}>
        <AppText type='caption'>
          {leftLabel} {showRequiredMark && <Text style={{ color: theme.colors.red }}> *</Text>}
        </AppText>
        <AppText type='caption' color={theme.colors.darkGrey}>
          {rightLabel}
        </AppText>
      </View>
      <RNEDropdown
        style={[
          styles.inputSelect,
          styles.getInputBackgroundInputColor(disabled),
          customInputSelectStyles,
        ]}
        containerStyle={[styles.optionsBox, customOptionsBoxStyles]}
        selectedTextStyle={styles.selectedText}
        labelField='label'
        valueField='value'
        data={options}
        renderItem={renderItem}
        value={value}
        onChange={handleSelectItem}
        disable={disabled}
        renderLeftIcon={() => prefixIcon as React.ReactElement}
        placeholder={placeHolder}
        maxHeight={maxHeightOptionsBox}
      />
      {errorText && (
        <AppText type='caption' color={theme.colors.red}>
          {errorText}
        </AppText>
      )}
    </View>
  );
};

export default Dropdown;
