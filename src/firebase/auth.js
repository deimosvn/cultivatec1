// ================================================================
// AUTH SERVICE — CultivaTec App
// Manejo de autenticación con Firebase Auth
// ================================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile, checkUsernameAvailable, getEmailByUsername } from './firestore';

/**
 * Registrar nuevo usuario con email y contraseña.
 * También crea su perfil en Firestore con username único.
 */
export const registerUser = async (email, password, username, fullName = '', robotConfig = null, robotName = '') => {
  // Verificar que el username esté disponible
  const available = await checkUsernameAvailable(username);
  if (!available) {
    throw new Error('El nombre de usuario ya está en uso. Elige otro.');
  }

  // Crear cuenta en Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Actualizar displayName en Auth
  await updateProfile(user, { displayName: username });

  // Crear perfil en Firestore
  await createUserProfile(user.uid, {
    username,
    fullName,
    email,
    robotConfig,
    robotName,
  });

  return user;
};

/**
 * Iniciar sesión con email/username y contraseña.
 * Si el identificador no es un email, se busca el email asociado al username.
 */
export const loginUser = async (identifier, password) => {
  let email = identifier;

  // Si no parece un email, buscar el email por username
  if (!identifier.includes('@')) {
    const foundEmail = await getEmailByUsername(identifier);
    if (!foundEmail) {
      throw { code: 'auth/user-not-found', message: 'No se encontró un usuario con ese nombre.' };
    }
    email = foundEmail;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Cerrar sesión.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Escuchar cambios en el estado de autenticación.
 * Retorna una función para desuscribirse.
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener usuario actual.
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
