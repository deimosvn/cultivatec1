// ================================================================
// FIREBASE CONFIG — CultivaTec App
// ================================================================
// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto nuevo (o usa uno existente)
// 3. En "Configuración del proyecto" > "SDK de Firebase", copia tu config
// 4. Pega los valores abajo reemplazando los placeholders
// 5. En la consola Firebase:
//    - Authentication > Sign-in method > Habilita "Correo electrónico/contraseña"
//    - Firestore Database > Crear base de datos > Iniciar en modo de prueba
// ================================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHGdw3Q1lwd4j7Flp706_-sRQACqzSaJc",
  authDomain: "cultivatec-app-pekes.firebaseapp.com",
  projectId: "cultivatec-app-pekes",
  storageBucket: "cultivatec-app-pekes.firebasestorage.app",
  messagingSenderId: "66040983809",
  appId: "1:66040983809:web:907f7b20fbee4c0125eb00",
  measurementId: "G-684D8CVVQZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
