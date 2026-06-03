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
  apiKey: "AIzaSyBpbR43YrPtuzpaw3USnqj9DLDphQlkWbc",
  authDomain: "nosqlpractica.firebaseapp.com",
  projectId: "nosqlpractica",
  storageBucket: "nosqlpractica.firebasestorage.app",
  messagingSenderId: "699959236015",
  appId: "1:699959236015:web:649a4d2220ebdd0f1b8b5a",
  measurementId: "G-RXQCTME6M6"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/** Instancia de Firestore lista para usar en toda la app. */
export const db = getFirestore(app);

export default app;
