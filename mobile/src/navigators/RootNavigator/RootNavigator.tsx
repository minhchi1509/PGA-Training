import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import styles from './styles';
import TrackMode from '@src/screens/trackmood';
import BottomTabNavigator from '../BottomTabNavigator';
import Notification from '@src/screens/notification';
import { EPsychoEducationList, ERootScreenList } from '../navigator-constants';
import GlobalNavigation, { navigationRef } from '@src/utils/navigation-utils';
import toastConfig from '@src/configs/toast-config';
import GuestNavigator from '../GuestNavigator';
import PsychoeducationList from '@src/screens/psychoeducation/PsychoeducationList';
import PsychoeducationDetail from '@src/screens/psychoeducation/PsychoeducationDetail';
import ContactHelp from '@src/screens/contact-help';
import Notifications from '@src/screens/setting-notifications';
import ChangePassword from '@src/screens/change-password';
import Privacy from '@src/screens/privacy';
import Terms from '@src/screens/terms';
import HomeworkDetail from '@src/screens/homework-detail';
import DoActivityAndWrittenTask from '@src/screens/do-activity-and-written-task';
import DoQuestionnaire from '@src/screens/do-questionnaire';
import WatchVideo from '@src/screens/watch-video';
import HomeworkDone from '@src/screens/homework-done';
import HomeworkFeedback from '@src/screens/homework-feedback';
import { ChevronLeftIcon } from '@src/assets/icons';
import branch from 'react-native-branch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EStorage } from '@src/variables/enum';
import MyProfile from '@src/screens/my-profile';

const Stack = createStackNavigator();

const RootNavigator = () => {
  branch.subscribe({
    onOpenComplete: ({ error, params, uri }) => {
      if (error) {
        console.error(
          'subscribe onOpenComplete, Error from opening uri: ' + uri + ' error: ' + error,
        );
        return;
      } else if (params) {
        if (!params['+clicked_branch_link']) {
          if (params['+non_branch_link']) {
            console.log('non_branch_link: ' + uri);
            // Route based on non-Branch links
            return;
          }
        } else {
          if (params.key == 'notificationPage') {
            GlobalNavigation.navigate(ERootScreenList.NOTIFICATION);
          }
          return;
        }
      }
    },
  });
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerTitleAlign: 'center',
            headerTitleStyle: styles.title,
            headerStyle: styles.header,
            headerLeft: () => (
              <ChevronLeftIcon
                style={{ marginLeft: 10 }}
                onPress={() => GlobalNavigation.goBack()}
              />
            ),
          }}
        >
          <Stack.Screen
            name={ERootScreenList.BOTTOM_TAB_NAVIGATOR}
            component={BottomTabNavigator}
          />
          <Stack.Screen
            name={ERootScreenList.MY_PROFILE}
            component={MyProfile}
            options={{
              headerShown: true,
              headerTitle: 'My profile',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.SETTING_NOTIFICATION}
            component={Notifications}
            options={{
              headerShown: true,
              headerTitle: 'Notification',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.CHANGE_PASSWORD}
            component={ChangePassword}
            options={{
              headerShown: true,
              headerTitle: '',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.PRIVACY}
            component={Privacy}
            options={{
              headerShown: true,
              headerTitle: 'Privacy',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.TERMS}
            component={Terms}
            options={{
              headerShown: true,
              headerTitle: 'Terms and Conditions',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.CONTACT_HELP}
            component={ContactHelp}
            options={{
              headerShown: true,
              headerTitle: 'Contact/Help',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.NOTIFICATION}
            component={Notification}
            options={{
              headerShown: true,
              headerTitle: 'Notifications',
            }}
          />
          <Stack.Screen
            name={EPsychoEducationList.PSYCHOEDUCATION_LIST}
            component={PsychoeducationList}
          />
          <Stack.Screen
            name={EPsychoEducationList.PSYCHOEDUCATION_DETAIL}
            component={PsychoeducationDetail}
          />
          <Stack.Screen
            name={ERootScreenList.TRACKMOOD}
            component={TrackMode}
            options={{
              headerShown: true,
              headerTitle: 'Track your mood',
            }}
          />
          <Stack.Screen
            name={ERootScreenList.HOMEWORK_DETAIL}
            component={HomeworkDetail}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={ERootScreenList.DO_ACTIVITY_AND_WRITTEN_TASK}
            component={DoActivityAndWrittenTask}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={ERootScreenList.DO_QUESTIONNAIRE}
            component={DoQuestionnaire}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={ERootScreenList.WATCH_VIDEO}
            component={WatchVideo}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={ERootScreenList.HOMEWORK_FEEDBACK}
            component={HomeworkFeedback}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name={ERootScreenList.HOMEWORK_DONE}
            component={HomeworkDone}
            options={{
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} position='top' />
    </SafeAreaProvider>
  );
};

export default RootNavigator;
