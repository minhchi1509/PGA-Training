import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import RootNavigator from './navigators/RootNavigator';
import { store } from './stores';

import { PermissionsAndroid } from 'react-native';
import { NotificationListener } from './utils/push-noti-untilts';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

function App(): JSX.Element {
  useEffect(() => {
    NotificationListener();
  }, []);
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

export default App;
