import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { FirebaseStorage, getStorage } from 'firebase/storage';

import { addDeviceToken } from 'src/services/notification-service';
import { EAuthToken } from 'src/variables/storage';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging();

class FirebaseApp {
  auth: Auth;
  storage: FirebaseStorage;

  constructor() {
    this.auth = getAuth(app);
    this.storage = getStorage(app);
  }
}

const firebaseApp = new FirebaseApp();

export function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      getToken(messaging, {
        vapidKey: process.env.REACT_APP_KEY_PAIR,
      }).then(async (currentToken) => {
        await addDeviceToken(currentToken);
        localStorage.setItem(EAuthToken.DEVICE_TOKEN, currentToken);
      });
    } else {
      console.log('Do not have permission!');
    }
  });
}

export const onMessageListener = (cb?: () => void) =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      cb?.();
      resolve(payload);
    });
  });

export default firebaseApp;
