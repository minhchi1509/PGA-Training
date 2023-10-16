import { TouchableOpacity, View } from 'react-native';
import React, { FC, useState } from 'react';

import styles from './styles';
import { THomeworkAssign } from '@src/interfaces/homework-interfaces';
import AppText from '@src/components/AppText';
import { DownArrowExpandViewIcon, UpArrowExpandViewIcon } from '@src/assets/icons';
import HomeworkAssignItem from '../HomeworkAssignItem';
import { EHomeworkType } from '@src/variables/enum';
import GlobalNavigation from '@src/utils/navigation-utils';
import { ERootScreenList } from '@src/navigators/navigator-constants';

interface IHomeworkGroupProps {
  practitionerName: string;
  isActive: boolean;
  onPress: () => void;
  homeworkItemList: THomeworkAssign[];
}

const HomeworkGroup: FC<IHomeworkGroupProps> = ({
  practitionerName,
  isActive,
  onPress,
  homeworkItemList,
}) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);

  const handlePressOnHomeworkAssignItem = (item: THomeworkAssign) => {
    GlobalNavigation.navigate(ERootScreenList.HOMEWORK_DETAIL, {
      id: item.id,
      type: item.homeworkType,
      title: item.homeworkTitle,
      description: item.homeworkDescription,
    });
  };

  const handlePressOnHomeworkGroup = () => {
    onPress();
    setIsExpand(!isExpand);
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePressOnHomeworkGroup}>
      <View style={styles.container}>
        <View style={[styles.border, isActive ? styles.activeBorder : {}]} />
        <AppText type='subheading'>{practitionerName}</AppText>
        <View style={{ marginLeft: 'auto' }}>
          {isExpand ? <UpArrowExpandViewIcon /> : <DownArrowExpandViewIcon />}
        </View>
      </View>
      {isExpand && (
        <View style={styles.homeworkAssignItemContainer}>
          {homeworkItemList.map((item) => (
            <HomeworkAssignItem
              key={item.id}
              name={item.homeworkTitle}
              type={item.homeworkType as EHomeworkType}
              onPress={() => handlePressOnHomeworkAssignItem(item)}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default HomeworkGroup;
