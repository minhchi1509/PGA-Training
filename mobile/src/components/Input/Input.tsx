import React, { FC, useState } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import styles from './styles';
import AppText from '../AppText';
import theme from '@src/themes';
import { EInputType } from '@src/variables/enum';
import { EyeCloseIcon, EyeOpenIcon } from '@src/assets/icons';
import MaskInput from 'react-native-mask-input';
import { INPUT_PHONE_NUMBER_MASK } from '@src/variables/constants';

interface IInputProps extends TextInputProps {
  customContainerStyles?: StyleProp<ViewStyle>;
  customInputStyles?: StyleProp<TextStyle>;
  type?: EInputType;
  leftLabel?: string;
  rightLabel?: React.ReactNode;
  showRequiredMark?: boolean;
  disabled?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  errorText?: string | boolean;
}

const Input: FC<IInputProps> = ({
  customContainerStyles,
  customInputStyles,
  rightLabel,
  type = EInputType.TEXT,
  leftLabel,
  showRequiredMark,
  disabled,
  prefixIcon,
  suffixIcon,
  errorText,
  numberOfLines,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View style={[styles.container, customContainerStyles]}>
      <View style={styles.labelContainer}>
        {leftLabel && (
          <AppText type='caption'>
            {leftLabel}
            {showRequiredMark && (
              <AppText type='caption' color={theme.colors.red}>
                {' '}
                *
              </AppText>
            )}
          </AppText>
        )}
        {rightLabel && rightLabel}
      </View>
      <View style={[styles.inputContainer, styles.getBackgroundInputColor(disabled)]}>
        {prefixIcon && prefixIcon}
        {type === EInputType.PHONE_NUMBER ? (
          <MaskInput
            style={[styles.input, customInputStyles]}
            placeholderTextColor={theme.colors.darkGrey}
            keyboardType='number-pad'
            mask={INPUT_PHONE_NUMBER_MASK}
            editable={!disabled}
            {...otherProps}
          />
        ) : (
          <TextInput
            style={[
              styles.input,
              {
                ...(type === EInputType.TEXTAREA
                  ? (styles.getTextAreaStyles(numberOfLines) as object)
                  : {}),
              },
              customInputStyles,
            ]}
            placeholderTextColor={theme.colors.darkGrey}
            secureTextEntry={type === EInputType.PASSWORD && !showPassword}
            editable={!disabled}
            multiline={type === EInputType.TEXTAREA}
            numberOfLines={numberOfLines}
            {...otherProps}
          />
        )}
        {suffixIcon && suffixIcon}
        {type === EInputType.PASSWORD && (
          <TouchableOpacity activeOpacity={0.6} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
          </TouchableOpacity>
        )}
      </View>
      {errorText && (
        <AppText type='caption' color={theme.colors.red}>
          {errorText}
        </AppText>
      )}
    </View>
  );
};

export default Input;
