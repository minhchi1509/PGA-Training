// @ts-nocheck
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyAheHqjGJJJ17mWXVW67kM5ryJex9b8Czs',
  authDomain: 'antsa-dev.firebaseapp.com',
  projectId: 'antsa-dev',
  storageBucket: 'antsa-dev.appspot.com',
  messagingSenderId: '128928035250',
  appId: '1:128928035250:web:a5cca36d53774b013034ab',
  measurementId: 'G-R7DQVJVWJC',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const channel = new BroadcastChannel('notifications');

let profileId = '';

channel.addEventListener('message', (ev) => {
  const currentProfileId = ev.data.profileId;
  profileId = currentProfileId;
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  let path = '';
  const data = event?.notification?.data;
  const notificationType = data?.type ?? '';
  const isCurrentProfile = profileId === data?.receiverProfileId;

  if (!isCurrentProfile) return;

  switch (notificationType) {
    case 'NEW_MESSAGE':
      {
        const sender = data?.senderProfile ?? data?.senderClient;
        const senderType = data?.senderClient ? 'CLIENT' : sender?.role;
        path = `/messages?partnerId=${sender?.id}&type=${senderType}`;
      }
      break;
    case 'PRACTITIONER_ACCEPT_INVITE':
      path = `/practitioner/${data?.id}`;
      break;
    case 'CLIENT_ACCEPT_INVITE':
    case 'HOMEWORK_COMPLETED':
      path = `/clients/${data?.clientId}`;
      break;
    case 'CLIENT_REALLOCATE':
      path = '/clients';
      break;
    default:
      path = '/';
      break;
  }

  event.waitUntil(clients.openWindow(path));
});

messaging.onBackgroundMessage(function (payload) {
  console.log('background message', payload);
  const data = JSON.parse(payload?.data?.message);
  const notificationTitle = data?.title;
  const notificationOptions = {
    body: data?.body,
    data,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
