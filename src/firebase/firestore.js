// ================================================================
// FIRESTORE SERVICE — CultivaTec App
// Operaciones de base de datos: perfiles, rankings, amigos, progreso
// ================================================================

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

// ================================================================
// PERFILES DE USUARIO
// ================================================================

/**
 * Crear perfil de usuario en Firestore + reservar username.
 */
export const createUserProfile = async (uid, { username, fullName, email, robotConfig, robotName }) => {
  const batch = writeBatch(db);

  // Reservar username (para unicidad)
  const usernameRef = doc(db, 'usernames', username.toLowerCase());
  batch.set(usernameRef, { uid, createdAt: serverTimestamp() });

  // Crear perfil principal
  const userRef = doc(db, 'users', uid);
  batch.set(userRef, {
    username: username,
    usernameLower: username.toLowerCase(),
    fullName: fullName || username,
    email: email,
    robotConfig: robotConfig || null,
    robotName: robotName || 'Mi Robot',
    level: 1,
    levelTitle: 'Principiante',
    totalPoints: 0,
    modulesCompleted: 0,
    quizzesCompleted: 0,
    challengesCompleted: 0,
    perfectQuizzes: 0,
    maxStreak: 0,
    currentStreak: 0,
    lastLoginDate: null,
    achievementsUnlocked: [],
    friendsCount: 0,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  });

  // Crear documento de progreso/scores
  const scoresRef = doc(db, 'userScores', uid);
  batch.set(scoresRef, {});

  await batch.commit();
};

/**
 * Verificar si un username está disponible.
 */
export const checkUsernameAvailable = async (username) => {
  const usernameRef = doc(db, 'usernames', username.toLowerCase());
  const snap = await getDoc(usernameRef);
  return !snap.exists();
};

/**
 * Obtener el email de un usuario a partir de su username.
 * Se usa para permitir login con nombre de usuario.
 */
export const getEmailByUsername = async (username) => {
  const usernameRef = doc(db, 'usernames', username.toLowerCase());
  const snap = await getDoc(usernameRef);
  if (!snap.exists()) return null;
  const { uid } = snap.data();
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  return userSnap.data().email || null;
};

/**
 * Obtener perfil de usuario.
 */
export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? { uid, ...snap.data() } : null;
};

/**
 * Escuchar cambios en perfil de usuario en tiempo real.
 */
export const onUserProfileChange = (uid, callback) => {
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      callback({ uid, ...snap.data() });
    }
  });
};

/**
 * Actualizar perfil de usuario (parcial).
 */
export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    lastActive: serverTimestamp(),
  });
};

/**
 * Verificar y actualizar la racha diaria.
 * Se llama al cargar la app cuando el usuario está autenticado.
 * Retorna la racha actual.
 */
export const checkAndUpdateStreak = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return 0;

  const data = snap.data();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  // Si ya se registró hoy, no hacer nada
  if (data.lastLoginDate === todayStr) {
    return data.currentStreak || 0;
  }

  // Calcular si es día consecutivo
  let newStreak = 1;
  if (data.lastLoginDate) {
    const lastDate = new Date(data.lastLoginDate + 'T00:00:00');
    const today = new Date(todayStr + 'T00:00:00');
    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      // Día consecutivo
      newStreak = (data.currentStreak || 0) + 1;
    }
    // Si diffDays > 1, se reinicia a 1
  }

  const newMax = Math.max(newStreak, data.maxStreak || 0);

  await updateDoc(userRef, {
    currentStreak: newStreak,
    lastLoginDate: todayStr,
    maxStreak: newMax,
    lastActive: serverTimestamp(),
  });

  return newStreak;
};

/**
 * Calcular nivel basado en puntos
 */
export const calculateLevel = (totalPoints) => {
  if (totalPoints >= 500) return { level: 10, title: 'Leyenda Robótica', emoji: '🌟' };
  if (totalPoints >= 400) return { level: 9, title: 'Gran Maestro', emoji: '🏅' };
  if (totalPoints >= 320) return { level: 8, title: 'Experto Robótico', emoji: '🎖️' };
  if (totalPoints >= 250) return { level: 7, title: 'Científico Digital', emoji: '🔬' };
  if (totalPoints >= 200) return { level: 6, title: 'Maestro Robótico', emoji: '🏆' };
  if (totalPoints >= 150) return { level: 5, title: 'Inventor Junior', emoji: '🛠️' };
  if (totalPoints >= 100) return { level: 4, title: 'Ingeniero Junior', emoji: '🔧' };
  if (totalPoints >= 50) return { level: 3, title: 'Aprendiz Avanzado', emoji: '⭐' };
  if (totalPoints >= 20) return { level: 2, title: 'Explorador Curioso', emoji: '🌱' };
  return { level: 1, title: 'Principiante', emoji: '🐣' };
};

// ================================================================
// PROGRESO Y SCORES
// ================================================================

/**
 * Guardar score de un módulo/quiz.
 */
export const saveModuleScore = async (uid, moduleId, scoreData) => {
  const scoresRef = doc(db, 'userScores', uid);
  await updateDoc(scoresRef, {
    [moduleId]: scoreData,
  });
};

/**
 * Escuchar cambios en los scores del usuario.
 */
export const onUserScoresChange = (uid, callback) => {
  const scoresRef = doc(db, 'userScores', uid);
  return onSnapshot(scoresRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback({});
    }
  });
};

/**
 * Sincronizar stats del usuario (después de quiz, reto, etc.)
 */
export const syncUserStats = async (uid, statsUpdate) => {
  const userRef = doc(db, 'users', uid);

  const updateData = { lastActive: serverTimestamp() };

  // Si se proporciona newTotalPoints, usar como valor absoluto (evita doble conteo)
  if (statsUpdate.newTotalPoints !== undefined) {
    updateData.totalPoints = statsUpdate.newTotalPoints;
    const lv = calculateLevel(statsUpdate.newTotalPoints);
    updateData.level = lv.level;
    updateData.levelTitle = lv.title;
  } else if (statsUpdate.addPoints) {
    // Solo usar increment si NO hay valor absoluto
    updateData.totalPoints = increment(statsUpdate.addPoints);
  }
  if (statsUpdate.addModulesCompleted) {
    updateData.modulesCompleted = increment(statsUpdate.addModulesCompleted);
  }
  if (statsUpdate.addQuizzesCompleted) {
    updateData.quizzesCompleted = increment(statsUpdate.addQuizzesCompleted);
  }
  if (statsUpdate.addChallengesCompleted) {
    updateData.challengesCompleted = increment(statsUpdate.addChallengesCompleted);
  }
  if (statsUpdate.addPerfectQuizzes) {
    updateData.perfectQuizzes = increment(statsUpdate.addPerfectQuizzes);
  }

  // Manejar valores directos
  if (statsUpdate.maxStreak !== undefined) {
    updateData.maxStreak = statsUpdate.maxStreak;
  }
  if (statsUpdate.achievementId) {
    updateData.achievementsUnlocked = arrayUnion(statsUpdate.achievementId);
  }

  await updateDoc(userRef, updateData);
};

// ================================================================
// RANKING GLOBAL
// ================================================================

/**
 * Obtener ranking global (top N jugadores).
 */
export const getGlobalRanking = async (limitCount = 50) => {
  const q = query(
    collection(db, 'users'),
    orderBy('totalPoints', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc, index) => ({
    uid: doc.id,
    rank: index + 1,
    ...doc.data(),
  }));
};

/**
 * Escuchar ranking en tiempo real.
 */
export const onRankingChange = (limitCount, callback) => {
  const q = query(
    collection(db, 'users'),
    orderBy('totalPoints', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snap) => {
    const ranking = snap.docs.map((doc, index) => ({
      uid: doc.id,
      rank: index + 1,
      ...doc.data(),
    }));
    callback(ranking);
  });
};

// ================================================================
// SISTEMA DE AMIGOS
// ================================================================

/**
 * Buscar usuario por username.
 */
export const searchUserByUsername = async (username) => {
  const q = query(
    collection(db, 'users'),
    where('usernameLower', '==', username.toLowerCase())
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc_ = snap.docs[0];
  return { uid: doc_.id, ...doc_.data() };
};

/**
 * Enviar solicitud de amistad.
 */
export const sendFriendRequest = async (fromUid, fromUsername, toUid, toUsername) => {
  // Verificar que no existe ya una solicitud
  const existingQ = query(
    collection(db, 'friendRequests'),
    where('fromUid', '==', fromUid),
    where('toUid', '==', toUid)
  );
  const existingSnap = await getDocs(existingQ);
  if (!existingSnap.empty) {
    throw new Error('Ya enviaste una solicitud a este usuario.');
  }

  // Verificar que no sean ya amigos
  const friendRef = doc(db, 'friends', fromUid, 'list', toUid);
  const friendSnap = await getDoc(friendRef);
  if (friendSnap.exists()) {
    throw new Error('Ya son amigos.');
  }

  // Crear solicitud
  const requestRef = doc(collection(db, 'friendRequests'));
  await setDoc(requestRef, {
    fromUid,
    fromUsername,
    toUid,
    toUsername,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

/**
 * Obtener solicitudes de amistad pendientes (recibidas).
 */
export const getPendingFriendRequests = async (uid) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUid', '==', uid),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Escuchar solicitudes pendientes en tiempo real.
 */
export const onPendingRequestsChange = (uid, callback) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUid', '==', uid),
    where('status', '==', 'pending')
  );
  return onSnapshot(q, (snap) => {
    const requests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(requests);
  });
};

/**
 * Aceptar solicitud de amistad.
 */
export const acceptFriendRequest = async (requestId, fromUid, toUid, fromUsername, toUsername) => {
  const batch = writeBatch(db);

  // Actualizar estado de la solicitud
  const requestRef = doc(db, 'friendRequests', requestId);
  batch.update(requestRef, { status: 'accepted' });

  // Agregar a la lista de amigos de ambos
  const friendRef1 = doc(db, 'friends', fromUid, 'list', toUid);
  batch.set(friendRef1, {
    username: toUsername,
    since: serverTimestamp(),
  });

  const friendRef2 = doc(db, 'friends', toUid, 'list', fromUid);
  batch.set(friendRef2, {
    username: fromUsername,
    since: serverTimestamp(),
  });

  // Incrementar contador de amigos
  const userRef1 = doc(db, 'users', fromUid);
  batch.update(userRef1, { friendsCount: increment(1) });

  const userRef2 = doc(db, 'users', toUid);
  batch.update(userRef2, { friendsCount: increment(1) });

  await batch.commit();
};

/**
 * Rechazar solicitud de amistad.
 */
export const rejectFriendRequest = async (requestId) => {
  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, { status: 'rejected' });
};

/**
 * Obtener lista de amigos con sus perfiles.
 */
export const getFriendsList = async (uid) => {
  const friendsSnap = await getDocs(collection(db, 'friends', uid, 'list'));
  if (friendsSnap.empty) return [];

  const friends = [];
  for (const friendDoc of friendsSnap.docs) {
    const friendUid = friendDoc.id;
    const friendData = friendDoc.data();
    // Obtener perfil actualizado
    const profile = await getUserProfile(friendUid);
    if (profile) {
      friends.push({
        uid: friendUid,
        username: profile.username,
        level: profile.level,
        levelTitle: profile.levelTitle,
        totalPoints: profile.totalPoints,
        modulesCompleted: profile.modulesCompleted,
        challengesCompleted: profile.challengesCompleted,
        robotConfig: profile.robotConfig,
        robotName: profile.robotName,
        lastActive: profile.lastActive,
        since: friendData.since,
      });
    }
  }

  // Ordenar por puntos
  friends.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  return friends;
};

/**
 * Escuchar lista de amigos en tiempo real.
 */
export const onFriendsChange = (uid, callback) => {
  return onSnapshot(collection(db, 'friends', uid, 'list'), async (snap) => {
    if (snap.empty) {
      callback([]);
      return;
    }
    const friends = [];
    for (const friendDoc of snap.docs) {
      const friendUid = friendDoc.id;
      const profile = await getUserProfile(friendUid);
      if (profile) {
        friends.push({
          uid: friendUid,
          username: profile.username,
          level: profile.level,
          levelTitle: profile.levelTitle,
          totalPoints: profile.totalPoints,
          modulesCompleted: profile.modulesCompleted,
          challengesCompleted: profile.challengesCompleted,
          robotConfig: profile.robotConfig,
          robotName: profile.robotName,
          lastActive: profile.lastActive,
        });
      }
    }
    friends.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    callback(friends);
  });
};

/**
 * Eliminar amigo.
 */
export const removeFriend = async (uid, friendUid) => {
  const batch = writeBatch(db);

  batch.delete(doc(db, 'friends', uid, 'list', friendUid));
  batch.delete(doc(db, 'friends', friendUid, 'list', uid));

  batch.update(doc(db, 'users', uid), { friendsCount: increment(-1) });
  batch.update(doc(db, 'users', friendUid), { friendsCount: increment(-1) });

  await batch.commit();
};
