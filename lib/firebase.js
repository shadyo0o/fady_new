// // lib/firebase.js
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// // Note: These should be environment variables in a real app
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// let messaging = null;

// if (typeof window !== 'undefined') {
//     try {
//         const app = initializeApp(firebaseConfig);
//         messaging = getMessaging(app);
//     } catch (error) {
//         console.error("Firebase init failed (expected if config missing)", error);
//     }
// }

// export { messaging, getToken };


import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// 1. تهيئة التطبيق
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. دالة جلب Messaging بأمان (للتصدير)
export const getMessagingInstance = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
  }
  return null;
};

// 3. دالة جلب التوكن (أضفتها هنا لتسهيل العمل في باقي الصفحات)
export const fetchToken = async () => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    // ملاحظة: يجب وضع الـ VAPID KEY الخاص بك هنا
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
    });

    return currentToken;
  } catch (err) {
    console.error("خطأ في جلب توكن الإشعارات:", err);
    return null;
  }
};

export { app };