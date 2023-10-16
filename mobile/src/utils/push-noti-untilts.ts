import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
};

const getFcmToken = async () => {
  const token = AsyncStorage.getItem('fcmToken');

  if (!token) {
    const res = await messaging().getToken();

    try {
      AsyncStorage.setItem('fcmToken', res);
    } catch {
      console.log('can not get fcm token');
    }
  }
};

export const NotificationListener = async () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    console.log('noti on forground', remoteMessage);
  });
};
