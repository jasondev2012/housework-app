import { initializeApp } from 'firebase/app'

//const firebaseConfig = {
//  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//  appId: import.meta.env.VITE_FIREBASE_APP_ID,
//}

const firebaseConfig = {
  apiKey: "AIzaSyDVKSDD2MOSrJ5iT0LRm1j4rLlYDsCyI5M",
  authDomain: "housework-app-5481a.firebaseapp.com",
  projectId: "housework-app-5481a",
  storageBucket: "housework-app-5481a.firebasestorage.app",
  messagingSenderId: "255676088068",
  appId: "1:255676088068:web:9f1edd564359d3baf55a51",
};

export const app = initializeApp(firebaseConfig)
