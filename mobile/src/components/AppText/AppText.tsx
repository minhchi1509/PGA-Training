import React, { FC } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import styles from './styles';
import theme from '@src/themes';

interface IAppTextProps extends TextProps {
  customStyles?: StyleProp<TextStyle>;
  type?:
    | 'headline'
    | 'display1'
    | 'title'
    | 'button'
    | 'subheading'
    | 'body2'
    | 'body1'
    | 'caption'
    | 'small';
  color?: string;
  size?: number;
}

const AppText: FC<IAppTextProps> = ({
  customStyles,
  type,
  color = theme.colors.darkOneColor,
  size = 14,
  children,
  ...otherProps
}) => {
  const textStylesByType = type && styles[type] ? styles[type] : {};
  return (
    <Text style={[{ color, fontSize: size }, textStylesByType, customStyles]} {...otherProps}>
      {children}
    </Text>
  );
};

export default AppText;
