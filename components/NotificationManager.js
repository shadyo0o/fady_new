'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFCM } from '@/hooks/useFCM';

export default function NotificationManager() {
  const { user } = useAuth();
  const { permission, requestPermission } = useFCM();

  useEffect(() => {
    // Only request if user is logged in and permission is default
    if (user && permission === 'default') {
        requestPermission();
    }
  }, [user, permission]);

  return null; // Invisible component
}
