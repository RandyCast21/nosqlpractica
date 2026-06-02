/**
 * Inicialización del cliente de Firebase (Web SDK).
 *
 * Las claves se leen desde variables de entorno con prefijo
 * NEXT_PUBLIC_ (ver .env.local). Estas claves del SDK Web NO son
 * secretas: son identificadores públicos del proyecto. La seguridad
 * real de Firestore se controla con las Reglas de Seguridad, no
 * ocultando estas claves.
 *
 * Usamos getApps() para no re-inicializar la app en los hot-reloads
 * de Next.js (modo desarrollo) ni en el renderizado del lado servidor.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/** Instancia de Firestore lista para usar en toda la app. */
export const db = getFirestore(app);

export default app;
