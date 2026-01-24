

// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAYb-Ae_sgUuZuW_5an-4NGzIjNum34keE",
  authDomain: "vaccination-4339a.firebaseapp.com",
  projectId: "vaccination-4339a",
  storageBucket: "vaccination-4339a.firebasestorage.app",
  messagingSenderId: "493255184934",
  appId: "1:493255184934:web:1f9116f1097ed9067c4ce7"
});

const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // تأكد من وجود صورة بهذا الاسم في مجلد public
    data: {
        // نستخدم الـ childId المرسل من الباك إند لبناء الرابط
        url: payload.data && payload.data.childId ? `/childs/${payload.data.childId}` : '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// التعامل مع النقر على الإشعار لفتح صفحة الطفل
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});