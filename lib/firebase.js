// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Note: These should be environment variables in a real app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

let messaging = null;

if (typeof window !== 'undefined') {
    try {
        const app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);
    } catch (error) {
        console.error("Firebase init failed (expected if config missing)", error);
    }
}

export { messaging, getToken };
