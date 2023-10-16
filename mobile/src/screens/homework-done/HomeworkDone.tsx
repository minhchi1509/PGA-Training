import { View } from 'react-native';
import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THomeworkDetail } from '@src/interfaces/homework-interfaces';
import { EHomeworkType } from '@src/variables/enum';
import styles from './styles';
import { HomeworkDoneIcon } from '@src/assets/icons';
import AppText from '@src/components/AppText';
import theme from '@src/themes';
import Button from '@src/components/Button';
import GlobalNavigation from '@src/utils/navigation-utils';
import { EBottomTabScreenList, ERootScreenList } from '@src/navigators/navigator-constants';

const HomeworkDone = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { title, type } = params as THomeworkDetail;

  let subTitle;
  switch (type) {
    case EHomeworkType.QUESTIONNAIRE:
      subTitle =
        'Thank you for completing the questionnaire. Your practitioner will get and review the results.';
      break;
    default:
      subTitle =
        'Thank you for completing this homework task. Your practitioner will get and review the results.';
      break;
  }

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [params]);

  return (
    <View style={styles.container}>
      <HomeworkDoneIcon style={styles.center} />
      <AppText type='headline' customStyles={styles.center}>
        All done!
      </AppText>
      <AppText type='body2' color={theme.colors.darkGrey} customStyles={{ textAlign: 'center' }}>
        {subTitle}
      </AppText>
      <Button
        text='Go to homework tasks'
        onPress={() =>
          GlobalNavigation.navigate(ERootScreenList.BOTTOM_TAB_NAVIGATOR, {
            screen: EBottomTabScreenList.HOMEWORK,
          })
        }
      />
    </View>
  );
};

export default HomeworkDone;
