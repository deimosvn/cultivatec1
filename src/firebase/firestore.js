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
  runTransaction,
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
 * Retorna { streak, isNewDay } para que la app sepa si mostrar notificación.
 */
export const checkAndUpdateStreak = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return { streak: 0, isNewDay: false };

  const data = snap.data();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  // Si ya se registró hoy, no hacer nada
  if (data.lastLoginDate === todayStr) {
    return { streak: data.currentStreak || 0, isNewDay: false };
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

  return { streak: newStreak, isNewDay: true };
};

/**
 * Sistema de niveles mejorado — 25 niveles con escala exponencial.
 * Cada nivel requiere progresivamente más XP, haciéndolo más difícil subir.
 * Contempla: módulos, quizzes, retos, problemas diarios, circuitos y programación.
 */
const LEVEL_THRESHOLDS = [
  { level: 1,  xp: 0,     title: 'Cadete Espacial',          emoji: '🚀' },
  { level: 2,  xp: 30,    title: 'Aprendiz Novato',          emoji: '🌱' },
  { level: 3,  xp: 80,    title: 'Explorador Curioso',       emoji: '🔍' },
  { level: 4,  xp: 160,   title: 'Técnico Básico',           emoji: '🔧' },
  { level: 5,  xp: 280,   title: 'Constructor Inicial',      emoji: '🏗️' },
  { level: 6,  xp: 450,   title: 'Ingeniero Junior',         emoji: '⚙️' },
  { level: 7,  xp: 680,   title: 'Programador Espacial',     emoji: '💻' },
  { level: 8,  xp: 980,   title: 'Inventor Avanzado',        emoji: '💡' },
  { level: 9,  xp: 1350,  title: 'Científico Digital',       emoji: '🔬' },
  { level: 10, xp: 1800,  title: 'Maestro Robótico',         emoji: '🤖' },
  { level: 11, xp: 2400,  title: 'Estratega Técnico',        emoji: '🎯' },
  { level: 12, xp: 3150,  title: 'Comandante de Circuitos',  emoji: '⚡' },
  { level: 13, xp: 4100,  title: 'Arquitecto de Sistemas',   emoji: '🧩' },
  { level: 14, xp: 5300,  title: 'Capitán Estelar',          emoji: '🛡️' },
  { level: 15, xp: 6800,  title: 'Élite Robótica',           emoji: '🏅' },
  { level: 16, xp: 8700,  title: 'Visionario Tecnológico',   emoji: '👁️' },
  { level: 17, xp: 11000, title: 'Almirante Espacial',       emoji: '⭐' },
  { level: 18, xp: 14000, title: 'Genio Cuántico',           emoji: '🧠' },
  { level: 19, xp: 17500, title: 'Leyenda Robótica',         emoji: '🏆' },
  { level: 20, xp: 22000, title: 'Maestro Galáctico',        emoji: '🌌' },
  { level: 21, xp: 28000, title: 'Oráculo Cibernético',      emoji: '🔮' },
  { level: 22, xp: 35000, title: 'Titán Tecnológico',        emoji: '⛰️' },
  { level: 23, xp: 44000, title: 'Emperador Estelar',        emoji: '👑' },
  { level: 24, xp: 55000, title: 'Trascendente Cósmico',     emoji: '✨' },
  { level: 25, xp: 70000, title: 'Omnisciente Galáctico',    emoji: '🌟' },
];

export const calculateLevel = (totalPoints) => {
  let current = LEVEL_THRESHOLDS[0];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      break;
    }
  }
  const nextIdx = LEVEL_THRESHOLDS.findIndex(t => t.level === current.level + 1);
  const next = nextIdx >= 0 ? LEVEL_THRESHOLDS[nextIdx] : null;
  const prevXp = current.xp;
  const nextXp = next ? next.xp : current.xp;
  const xpInLevel = totalPoints - prevXp;
  const xpNeeded = next ? next.xp - prevXp : 0;
  const progress = next ? Math.min(xpInLevel / xpNeeded, 1) : 1; // 0-1

  return {
    level: current.level,
    title: current.title,
    emoji: current.emoji,
    maxLevel: LEVEL_THRESHOLDS.length,
    currentXp: totalPoints,
    levelXp: prevXp,        // XP al inicio de este nivel
    nextLevelXp: nextXp,    // XP necesario para siguiente nivel
    xpInLevel,              // XP acumulado en este nivel
    xpNeeded,               // XP total necesario para subir
    progress,               // 0-1 fracción de progreso
    isMaxLevel: !next,
  };
};

export { LEVEL_THRESHOLDS };

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
 * Usa una transacción para leer el totalPoints real de Firestore,
 * sumar los nuevos puntos, y recalcular el nivel atomicamente.
 * Esto evita bugs de estado stale sobreescribiendo el valor real.
 */
export const syncUserStats = async (uid, statsUpdate) => {
  const userRef = doc(db, 'users', uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(userRef);
    const currentData = snap.exists() ? snap.data() : {};

    const updateData = { lastActive: serverTimestamp() };

    // Sumar puntos al valor REAL de Firestore (no al estado local)
    if (statsUpdate.addPoints) {
      const currentPoints = currentData.totalPoints || 0;
      const newTotal = currentPoints + statsUpdate.addPoints;
      updateData.totalPoints = newTotal;

      // Siempre recalcular nivel basado en el total real
      const lv = calculateLevel(newTotal);
      updateData.level = lv.level;
      updateData.levelTitle = lv.title;
    }

    if (statsUpdate.addModulesCompleted) {
      updateData.modulesCompleted = (currentData.modulesCompleted || 0) + statsUpdate.addModulesCompleted;
    }
    if (statsUpdate.addQuizzesCompleted) {
      updateData.quizzesCompleted = (currentData.quizzesCompleted || 0) + statsUpdate.addQuizzesCompleted;
    }
    if (statsUpdate.addChallengesCompleted) {
      updateData.challengesCompleted = (currentData.challengesCompleted || 0) + statsUpdate.addChallengesCompleted;
    }
    if (statsUpdate.addPerfectQuizzes) {
      updateData.perfectQuizzes = (currentData.perfectQuizzes || 0) + statsUpdate.addPerfectQuizzes;
    }

    // Manejar valores directos
    if (statsUpdate.maxStreak !== undefined) {
      updateData.maxStreak = statsUpdate.maxStreak;
    }
    if (statsUpdate.achievementId) {
      updateData.achievementsUnlocked = arrayUnion(statsUpdate.achievementId);
    }

    transaction.update(userRef, updateData);
  });
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

  // Incrementar contador de amigos del usuario actual (toUid)
  const userRef2 = doc(db, 'users', toUid);
  batch.update(userRef2, { friendsCount: increment(1) });

  await batch.commit();

  // Incrementar contador del otro usuario por separado (puede fallar por reglas)
  try {
    const userRef1 = doc(db, 'users', fromUid);
    await updateDoc(userRef1, { friendsCount: increment(1) });
  } catch (e) {
    console.warn('No se pudo actualizar friendsCount del otro usuario:', e.message);
  }
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
    const realCount = snap.size;

    // Sincronizar friendsCount en el perfil del usuario con el conteo real
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && (userSnap.data().friendsCount ?? 0) !== realCount) {
        await updateDoc(userRef, { friendsCount: realCount });
      }
    } catch (e) {
      console.warn('No se pudo sincronizar friendsCount:', e.message);
    }

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

  // Solo decrementar el propio contador en el batch
  batch.update(doc(db, 'users', uid), { friendsCount: increment(-1) });

  await batch.commit();

  // Decrementar el contador del otro usuario por separado
  try {
    await updateDoc(doc(db, 'users', friendUid), { friendsCount: increment(-1) });
  } catch (e) {
    console.warn('No se pudo actualizar friendsCount del otro usuario:', e.message);
  }
};

/**
 * Sincronizar friendsCount con el conteo real de la subcolección friends/{uid}/list.
 * Llamar al iniciar sesión para corregir desincronizaciones.
 */
export const syncFriendsCount = async (uid) => {
  try {
    const friendsSnap = await getDocs(collection(db, 'friends', uid, 'list'));
    const realCount = friendsSnap.size;
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && (userSnap.data().friendsCount ?? 0) !== realCount) {
      await updateDoc(userRef, { friendsCount: realCount });
    }
  } catch (e) {
    console.warn('Error sincronizando friendsCount:', e.message);
  }
};

// ================================================================
// SISTEMA DE ADMINISTRACIÓN
// ================================================================

/**
 * Emails con permisos de administrador.
 */
export const ADMIN_EMAILS = [
  'diego.martinez111213@gmail.com',
  'ing.abrahamdonate@gmail.com',
];

/**
 * Verificar si un email es admin.
 */
export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};

/**
 * Eliminar cuenta de usuario (admin only).
 * Borra: perfil, scores, username, amigos, solicitudes.
 * No elimina la cuenta de Firebase Auth (requiere Cloud Functions).
 */
export const adminDeleteUser = async (targetUid) => {
  try {
    // Obtener perfil del usuario a eliminar
    const userRef = doc(db, 'users', targetUid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error('Usuario no encontrado');

    const userData = userSnap.data();
    const batch = writeBatch(db);

    // Eliminar perfil
    batch.delete(userRef);

    // Eliminar scores
    const scoresRef = doc(db, 'userScores', targetUid);
    batch.delete(scoresRef);

    // Eliminar username reservado
    if (userData.usernameLower) {
      const usernameRef = doc(db, 'usernames', userData.usernameLower);
      batch.delete(usernameRef);
    }

    await batch.commit();

    // Eliminar amigos (subcollección - requiere lectura individual)
    try {
      const friendsSnap = await getDocs(collection(db, 'friends', targetUid, 'list'));
      for (const friendDoc of friendsSnap.docs) {
        const friendUid = friendDoc.id;
        // Eliminar al usuario de la lista del amigo
        await deleteDoc(doc(db, 'friends', friendUid, 'list', targetUid));
        // Decrementar counter del amigo
        try {
          await updateDoc(doc(db, 'users', friendUid), { friendsCount: increment(-1) });
        } catch {}
        // Eliminar al amigo de la lista del usuario
        await deleteDoc(doc(db, 'friends', targetUid, 'list', friendUid));
      }
    } catch (e) {
      console.warn('Error limpiando amigos:', e.message);
    }

    // Eliminar solicitudes de amistad
    try {
      const sentReqs = await getDocs(query(collection(db, 'friendRequests'), where('fromUid', '==', targetUid)));
      for (const d of sentReqs.docs) await deleteDoc(d.ref);
      const recvReqs = await getDocs(query(collection(db, 'friendRequests'), where('toUid', '==', targetUid)));
      for (const d of recvReqs.docs) await deleteDoc(d.ref);
    } catch (e) {
      console.warn('Error limpiando solicitudes:', e.message);
    }

    return true;
  } catch (e) {
    console.error('Error eliminando usuario:', e);
    throw e;
  }
};

/**
 * Regalar insignia a un usuario (admin only).
 * Las insignias se guardan en el array 'adminBadges' del perfil.
 */
export const adminGiftBadge = async (targetUid, badge) => {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    adminBadges: arrayUnion({
      id: badge.id,
      name: badge.name,
      emoji: badge.emoji,
      color: badge.color,
      giftedAt: new Date().toISOString(),
    }),
  });
};

/**
 * Quitar insignia a un usuario (admin only).
 */
export const adminRemoveBadge = async (targetUid, badge) => {
  const userRef = doc(db, 'users', targetUid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;
  const currentBadges = snap.data().adminBadges || [];
  const filtered = currentBadges.filter(b => b.id !== badge.id);
  await updateDoc(userRef, { adminBadges: filtered });
};

/**
 * Regalar skin al usuario (admin only).
 * Las skins regaladas se guardan en 'giftedSkins' array.
 */
export const adminGiftSkin = async (targetUid, skin) => {
  const userRef = doc(db, 'users', targetUid);
  await updateDoc(userRef, {
    giftedSkins: arrayUnion({
      id: skin.id,
      name: skin.name,
      giftedAt: new Date().toISOString(),
    }),
    // Aplicar la skin directamente al robot
    robotConfig: skin.config,
  });
};

// ================================================================
// CLASES / CLASSROOM — Tracking de estudiantes por código
// ================================================================

/**
 * Unirse a una clase con un código.
 * Crea/actualiza el documento de la clase y agrega el uid al array members.
 */
export const joinClassroom = async (classCode, uid) => {
  const classRef = doc(db, 'classrooms', classCode);
  const snap = await getDoc(classRef);
  if (snap.exists()) {
    const data = snap.data();
    if (data.members && data.members.includes(uid)) return; // ya está
    await updateDoc(classRef, { members: arrayUnion(uid) });
  } else {
    await setDoc(classRef, { members: [uid], createdAt: serverTimestamp() });
  }
};

/**
 * Salir de una clase.
 */
export const leaveClassroom = async (classCode, uid) => {
  const classRef = doc(db, 'classrooms', classCode);
  await updateDoc(classRef, { members: arrayRemove(uid) });
};

/**
 * Obtener la cantidad de estudiantes en una clase.
 */
export const getClassroomMemberCount = async (classCode) => {
  const classRef = doc(db, 'classrooms', classCode);
  const snap = await getDoc(classRef);
  if (snap.exists()) {
    const data = snap.data();
    return (data.members || []).length;
  }
  return 0;
};

/**
 * Listener en tiempo real para el conteo de miembros de una clase.
 */
export const onClassroomMembers = (classCode, callback) => {
  const classRef = doc(db, 'classrooms', classCode);
  return onSnapshot(classRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback((data.members || []).length);
    } else {
      callback(0);
    }
  });
};
