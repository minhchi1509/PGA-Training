import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';
import dayjs from 'dayjs';

import styles from './styles';
import AppText from '../AppText';
import theme from '@src/themes';

interface IDateTimePickerProps extends Omit<DatePickerProps, 'date'> {
  pickerMode: 'time' | 'date' | 'datetime';
  value: Date;
  format: string;
  onDateChange: (date: Date) => void;
  customContainerStyle?: StyleProp<ViewStyle>;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  showRequiredMark?: boolean;
  errorText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const DateTimePicker: FC<IDateTimePickerProps> = ({
  leftLabel,
  rightLabel,
  prefixIcon,
  suffixIcon,
  value,
  onDateChange,
  pickerMode,
  customContainerStyle,
  showRequiredMark,
  errorText,
  disabled,
  format,
  ...otherProps
}) => {
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

  const handleConfirmDate = (date: Date) => {
    onDateChange(date);
    setOpenDatePicker(false);
  };

  const handleOpenDatePicker = () => {
    setOpenDatePicker(true);
  };

  const handleCancelDatePicker = () => {
    setOpenDatePicker(false);
  };

  return (
    <View style={[styles.container, customContainerStyle]}>
      <View style={styles.labelContainer}>
        <AppText type='caption'>
          {leftLabel} {showRequiredMark && <Text style={{ color: theme.colors.red }}> *</Text>}
        </AppText>
        <AppText type='caption' color={theme.colors.darkGrey}>
          {rightLabel}
        </AppText>
      </View>
      <TouchableOpacity
        style={[styles.datePickerInput, styles.getInputBackgroundColor(disabled)]}
        activeOpacity={0.7}
        onPress={handleOpenDatePicker}
        disabled={disabled}
      >
        {prefixIcon && prefixIcon}
        <AppText type='body2'>{dayjs(value).format(format)}</AppText>
        <DatePicker
          date={value}
          open={openDatePicker}
          modal
          mode={pickerMode}
          onCancel={handleCancelDatePicker}
          onConfirm={handleConfirmDate}
          {...otherProps}
        />
        {suffixIcon && <View style={{ marginLeft: 'auto' }}>{suffixIcon}</View>}
      </TouchableOpacity>
      {errorText && (
        <AppText type='caption' color={theme.colors.red}>
          {errorText}
        </AppText>
      )}
    </View>
  );
};

export default DateTimePicker;
