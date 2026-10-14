import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Obtener configuración desde variables de entorno VITE_ o localStorage
let savedConfig: Record<string, string> = {};
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('custom_firebase_config');
    if (raw) savedConfig = JSON.parse(raw);
  } catch (e) {
    console.warn('Error al leer custom_firebase_config de localStorage:', e);
  }
}

export const firebaseConfig = {
  apiKey: savedConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment12345678",
  authDomain: savedConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "red-de-oficios.firebaseapp.com",
  projectId: savedConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || "red-de-oficios",
  storageBucket: savedConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "red-de-oficios.appspot.com",
  messagingSenderId: savedConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: savedConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Inicializar la app de Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar Firestore Database
export const db = getFirestore(app);

if (typeof window !== 'undefined') {
  console.log(`[Firebase Firestore] Conectado exitosamente. Proyecto ID: "${firebaseConfig.projectId}"`);
}

export default app;
