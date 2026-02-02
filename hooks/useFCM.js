'use client';

import { useEffect, useState } from 'react';
import { messaging, getToken } from '../lib/firebase';
import api from '@/lib/api/client';

export function useFCM() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!messaging) return;

    try {
      const permissionStatus = await Notification.requestPermission();
      setPermission(permissionStatus);

      if (permissionStatus === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });
        
        if (token) {
           console.log('FCM Token:', token);
           // Send to backend
           await api.patch('/users/fcm-token', { token });
        }
      }
    } catch (error) {
      console.error('An error occurred while retrieving token.', error);
    }
  };

  return { permission, requestPermission };
}
