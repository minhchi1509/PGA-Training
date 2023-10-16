import React, { FC } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import styles from './styles';
import theme from '@src/themes';

interface IButtonProps extends TouchableOpacityProps {
  text: string;
  buttonColor?: string;
  customStyles?: StyleProp<ViewStyle>;
  customTextStyles?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  prefixIcon?: React.ReactElement;
  suffixIcon?: React.ReactElement;
}

const Button: FC<IButtonProps> = ({
  customStyles,
  customTextStyles,
  buttonColor,
  text,
  loading,
  disabled,
  prefixIcon,
  suffixIcon,
  outlined,
  onPress,
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      {...otherProps}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        buttonColor ? { backgroundColor: buttonColor } : {},
        outlined ? styles.outlinedButtonContainer : {},
        { opacity: loading || disabled ? 0.5 : 1 },
        customStyles,
      ]}
    >
      {(loading || prefixIcon) && (
        <View style={styles.prefixComponentContainer}>
          {loading && <ActivityIndicator size='small' color={theme.colors.white} />}
          {prefixIcon && prefixIcon}
        </View>
      )}
      <Text style={[styles.buttonText, customTextStyles, outlined ? styles.outlinedText : {}]}>
        {text}
      </Text>
      {suffixIcon && <View style={styles.suffixComponentContainer}>{suffixIcon}</View>}
    </TouchableOpacity>
  );
};

export default Button;
