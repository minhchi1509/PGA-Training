import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
  BellIcon,
  HomeIcon,
  HomeworkIcon,
  LogoIcon,
  LogoTextIcon,
  MessagesIcon,
  PsychoEducationIcon,
  SettingIcon,
} from '@src/assets/icons';
import theme from '@src/themes';
import styles from './styles';
import Homework from '@src/screens/homework';
import PsychoeducationTopics from '@src/screens/psychoeducation/PsychoeducationTopics';
import Messages from '@src/screens/messages';
import Setting from '@src/screens/setting';
import GlobalNavigation from '@src/utils/navigation-utils';
import { EBottomTabScreenList, ERootScreenList } from '@src/navigators/navigator-constants';
import Home from '@src/screens/home';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const tabBarList = [
    {
      name: EBottomTabScreenList.HOME,
      component: Home,
      tabBarLabel: 'Home',
      tabBarIcon: ({ focused }: { color: string; focused: boolean }) => (
        <HomeIcon opacity={focused ? 1 : 0.6} />
      ),
    },
    {
      name: EBottomTabScreenList.HOMEWORK,
      component: Homework,
      tabBarLabel: 'Homework',
      tabBarIcon: ({ focused }: { color: string; focused: boolean }) => (
        <HomeworkIcon opacity={focused ? 1 : 0.6} />
      ),
    },
    {
      name: EBottomTabScreenList.PSYCHOEDUCATION,
      component: PsychoeducationTopics,
      tabBarLabel: 'Psychoeducation',
      tabBarIcon: ({ focused }: { color: string; focused: boolean }) => (
        <PsychoEducationIcon opacity={focused ? 1 : 0.6} />
      ),
    },
    {
      name: EBottomTabScreenList.MESSAGES,
      component: Messages,
      tabBarLabel: 'Messages',
      tabBarIcon: ({ focused }: { color: string; focused: boolean }) => (
        <MessagesIcon opacity={focused ? 1 : 0.6} />
      ),
    },
    {
      name: EBottomTabScreenList.SETTING,
      component: Setting,
      tabBarLabel: 'Setting',
      tabBarIcon: ({ focused }: { color: string; focused: boolean }) => (
        <SettingIcon opacity={focused ? 1 : 0.6} />
      ),
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName={EBottomTabScreenList.HOME}
      screenOptions={{
        headerTitle: '',
        headerStyle: styles.header,
        tabBarActiveTintColor: theme.colors.lightOneColor,
        tabBarInactiveTintColor: theme.colors.lightTwoColor,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
        headerLeft: () => (
          <View style={styles.left}>
            <LogoIcon width={32} style={styles.logo} />
            <LogoTextIcon />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={styles.right}
            onPress={() => GlobalNavigation.navigate(ERootScreenList.NOTIFICATION)}
          >
            <BellIcon fill={theme.colors.white} />
          </TouchableOpacity>
        ),
      }}
    >
      {tabBarList.map(({ name, component, tabBarLabel, tabBarIcon }, index) => {
        return (
          <Tab.Screen
            key={`${index}`}
            name={name}
            component={component}
            options={() => ({
              tabBarButton: ({ children, style }) => (
                <View style={style}>
                  <TouchableOpacity onPress={() => GlobalNavigation.navigate(name)}>
                    {children}
                  </TouchableOpacity>
                </View>
              ),
              tabBarLabel: tabBarLabel,
              tabBarIcon: tabBarIcon,
            })}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
