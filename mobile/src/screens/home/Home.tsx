import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

import EmotionBox from '@src/screens/home/components/EmotionBox';
import WelcomeText from '@src/screens/home/components/WelcomeText';
import AppText from '@src/components/AppText';
import NotifiBlock from '@src/screens/home/components/NotifiBlock';
import Button from '@src/components/Button';
import GlobalNavigation from '@src/utils/navigation-utils';
import { styles } from '@src/screens/home/styles';
import { useAppDispatch, useAppSelector } from '@src/stores';
import { EClientThunkActions } from '@src/stores/client/constants';
import { clientThunkActions } from '@src/stores/client';
import ErrorResponse from '@src/interfaces/error-response-interfaces';
import { showErrorToast } from '@src/utils/toast-utils';
import Loading from '@src/components/Loading';
import { ERootScreenList } from '@src/navigators/navigator-constants';

const Home = () => {
  const profile = useAppSelector((state) => state.client?.profile);
  const isGettingClientProfile = useAppSelector(
    (state) => state.loading[EClientThunkActions.GET_PROFILE],
  );
  const dispatch = useAppDispatch();

  const fetchClientProfile = async () => {
    try {
      await dispatch(clientThunkActions.getClientProfile()).unwrap();
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message;
      showErrorToast(errorMessage);
    }
  };

  useEffect(() => {
    fetchClientProfile();
  }, []);

  return isGettingClientProfile ? (
    <Loading />
  ) : (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.mediumGap}>
          <WelcomeText name={profile?.client?.firstName} />
          <View style={styles.smallGap}>
            <EmotionBox />
            <Button
              style={styles.primaryButtom}
              onPress={() => GlobalNavigation.navigate(ERootScreenList.TRACKMOOD)}
              text='Track your mood'
              customTextStyles={styles.primaryButtonText}
            ></Button>
          </View>
        </View>

        <View style={styles.preface}>
          <View style={styles.perfaceContainer}>
            <AppText customStyles={styles.perfaceTextBefore}>“</AppText>
            <AppText customStyles={styles.prefaceText}>{profile?.quote?.message}</AppText>
            <AppText customStyles={styles.perfaceTextAfter}>”</AppText>
          </View>

          <AppText customStyles={styles.perfaceAuth}>{`-${profile?.quote?.author}-`}</AppText>
        </View>

        <View style={styles.notifiContainer}>
          <NotifiBlock
            buttonContent='Reply'
            count={profile?.totalUnreadMessage}
            title='New messages'
          />
          <NotifiBlock
            buttonContent='Do homework'
            count={profile?.homework}
            title='New Homework Tasks'
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
