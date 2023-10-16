import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';

import styles from './styles';
import Todo from './tab-screen/Todo';
import MyJournals from './tab-screen/MyJournals';
import theme from '@src/themes';

type TRenderTabBarProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
};

const renderScene = SceneMap({
  todo: Todo,
  myJournals: MyJournals,
});

const Homework = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: 'todo', title: 'To Do ' },
    { key: 'myJournals', title: 'My Journals ' },
  ]);

  const renderTabBar = (props: TRenderTabBarProps) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBarContainer}
      tabStyle={styles.tabBarItem}
      labelStyle={styles.tabBarlabel}
      inactiveColor={theme.colors.darkGrey}
      activeColor={theme.colors.darkOneColor}
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

export default Homework;
