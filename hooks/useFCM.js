// 'use client';

// import { useEffect, useState } from 'react';
// import { messaging, getToken } from '../lib/firebase';
// import api from '@/lib/api/client';

// export function useFCM() {
//   const [permission, setPermission] = useState('default');

//   useEffect(() => {
//     if (typeof window !== 'undefined' && 'Notification' in window) {
//       setPermission(Notification.permission);
//     }
//   }, []);

//   const requestPermission = async () => {
//     if (!messaging) return;

//     try {
//       const permissionStatus = await Notification.requestPermission();
//       setPermission(permissionStatus);

//       if (permissionStatus === 'granted') {
//         const token = await getToken(messaging, {
//           vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
//         });
        
//         if (token) {
//            console.log('FCM Token:', token);
//            // Send to backend
//            await api.patch('/users/fcm-token', { token });
//         }
//       }
//     } catch (error) {
//       console.error('An error occurred while retrieving token.', error);
//     }
//   };

//   return { permission, requestPermission };
// }



'use client';

import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../lib/firebase';
import api from '@/lib/api/client';

export function useFCM() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      // مستمع للإشعارات والتطبيق مفتوح (Foreground)
      if (messaging) {
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Message received in foreground:', payload);
          // يمكنك هنا استخدام مكتبة مثل react-hot-toast لإظهار تنبيه داخلي
        });
        return () => unsubscribe();
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!messaging || typeof window === 'undefined') return;

    try {
      const permissionStatus = await Notification.requestPermission();
      setPermission(permissionStatus);

      if (permissionStatus === 'granted') {
        // تسجيل الـ Service Worker يدوياً لضمان استخراج التوكن في الـ PWA
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
        
        if (token) {
           console.log('FCM Token generated successfully');
           // إرسال التوكن للباك إند (تأكد من أن المسار مطابق للـ API عندك)
           await api.patch('/users/fcm-token', { token });
        }
      }
    } catch (error) {
      console.error('Error in FCM setup:', error);
    }
  };

  return { permission, requestPermission };
}