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
// استورد فقط المتغير المهيأ من ملفك
import { messaging } from '../lib/firebase'; 
// استورد الدوال التشغيلية من المكتبة الأم لفايربيز
import { getToken, onMessage } from 'firebase/messaging'; 
import api from '@/lib/api/client';

export function useFCM() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      // مستمع للإشعارات والتطبيق مفتوح (Foreground)
      // نتحقق من وجود messaging أولاً
      if (messaging) {
        try {
          const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Message received in foreground:', payload);
          });
          return () => unsubscribe();
        } catch (e) {
          console.log("FCM onMessage Error:", e);
        }
      }
    }
  }, []);

  const requestPermission = async () => {
    // التحقق من المتصفح والـ Messaging
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    
    // الانتظار للتأكد من تهيئة messaging (لأنها تأخذ وقتاً في البداية)
    if (!messaging) {
       console.log("Waiting for messaging to initialize...");
       return;
    }

    try {
      const permissionStatus = await Notification.requestPermission();
      setPermission(permissionStatus);

      if (permissionStatus === 'granted') {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });
        
        if (token) {
           console.log('FCM Token generated');
           await api.patch('/users/fcm-token', { token });
        }
      }
    } catch (error) {
      console.error('Error in FCM setup:', error);
    }
  };

  return { permission, requestPermission };
}