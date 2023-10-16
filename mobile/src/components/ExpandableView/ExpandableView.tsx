import { StyleProp, TextStyle, TouchableOpacity, View, ViewProps } from 'react-native';
import React, { FC, useState } from 'react';

import styles from './styles';
import AppText from '../AppText';
import { DownArrowExpandViewIcon, UpArrowExpandViewIcon } from '@src/assets/icons';

interface IExpandableViewProps {
  title: string;
  children?: React.ReactNode;
  customTitleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewProps>;
}

const ExpandableView: FC<IExpandableViewProps> = ({
  title,
  customTitleStyle,
  containerStyle,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
        <View style={[styles.titleContainer, { marginBottom: isExpanded ? 24 : 0 }]}>
          <AppText type='title' customStyles={customTitleStyle}>
            {title}
          </AppText>
          {isExpanded ? <UpArrowExpandViewIcon /> : <DownArrowExpandViewIcon />}
        </View>
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

export default ExpandableView;
