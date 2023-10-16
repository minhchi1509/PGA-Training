/* eslint-disable indent */
import React, { useState } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarIndicator,
  TabView,
} from 'react-native-tab-view';

import styles from './styles';
import MyInformation from './components/MyInformation';
import MedicalProfile from './components/MedicalProfile';
import theme from '@src/themes';
import { useAppSelector } from '@src/stores';

type TRenderTabBarProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
};

const renderScene = SceneMap({
  myInformation: MyInformation,
  medicalProfile: MedicalProfile,
});

const MyProfile = () => {
  const profile = useAppSelector((state) => state.client.profile);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const hideMedicalProfileTab = (profile?.client?.practitionerClients.length as number) > 0;
  const tabList = hideMedicalProfileTab
    ? [
        { key: 'myInformation', title: 'My Information' },
        { key: 'medicalProfile', title: 'Medical Profile' },
      ]
    : [{ key: 'myInformation', title: 'My Information' }];

  const [routes] = useState(tabList);

  const renderTabBar = (props: TRenderTabBarProps) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBarContainer}
      tabStyle={styles.tabBarItem}
      inactiveColor={theme.colors.darkGrey}
      activeColor={theme.colors.darkOneColor}
      renderIndicator={(indicatorProps) => {
        const width = 110;
        return (
          <TabBarIndicator
            {...indicatorProps}
            width={width}
            style={[indicatorProps.style, { left: index === 0 ? 0 : 140 }]}
          />
        );
      }}
      renderTabBarItem={({ route, activeColor, inactiveColor }) => (
        <TouchableOpacity
          onPress={() => props.jumpTo(route.key)}
          activeOpacity={0.7}
          style={styles.tabBarItem}
        >
          <Text
            style={[
              styles.tabBarlabel,
              {
                color:
                  (route.key === 'myInformation' && index === 1) ||
                  (route.key === 'medicalProfile' && index === 0)
                    ? inactiveColor
                    : activeColor,
              },
            ]}
          >
            {route.title}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default MyProfile;
