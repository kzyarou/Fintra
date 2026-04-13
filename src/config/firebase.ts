import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABl3kFTp2PLl-GRt3uezBm8WbIOBVur60',
  authDomain: 'kash-a97db.firebaseapp.com',
  projectId: 'kash-a97db',
  storageBucket: 'kash-a97db.firebasestorage.app',
  messagingSenderId: '112059205387',
  appId: '1:112059205387:web:e56addf131f1406c29840e',
  measurementId: 'G-V0FCJW7YQN'
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);

export { app, analytics, auth };