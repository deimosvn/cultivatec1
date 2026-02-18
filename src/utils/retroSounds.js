// ================================================================
// RETRO SOUND SYSTEM — CultivaTec App
// Generates 8-bit / chiptune-style sounds using Web Audio API
// No external audio files needed!
// ================================================================

let audioCtx = null;
let soundEnabled = true;
let masterVolume = 0.25; // Keep it subtle

const getCtx = () => {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not available');
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// ============================================
// PUBLIC API: Enable/Disable/Volume
// ============================================

export const setSoundEnabled = (enabled) => { soundEnabled = enabled; };
export const isSoundEnabled = () => soundEnabled;
export const setMasterVolume = (vol) => { masterVolume = Math.max(0, Math.min(1, vol)); };
export const getMasterVolume = () => masterVolume;

// Load from localStorage
try {
  const saved = localStorage.getItem('cultivatec_soundEnabled');
  if (saved !== null) soundEnabled = saved === 'true';
  const savedVol = localStorage.getItem('cultivatec_soundVolume');
  if (savedVol !== null) masterVolume = parseFloat(savedVol) || 0.25;
} catch (e) {}

export const saveSoundPrefs = () => {
  try {
    localStorage.setItem('cultivatec_soundEnabled', String(soundEnabled));
    localStorage.setItem('cultivatec_soundVolume', String(masterVolume));
  } catch (e) {}
};

// ============================================
// BASE OSCILLATOR HELPERS
// ============================================

const playTone = (freq, duration, type = 'square', volume = 1, delay = 0) => {
  if (!soundEnabled) return;
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
};

const playNoise = (duration, volume = 0.3, delay = 0) => {
  if (!soundEnabled) return;
  const ctx = getCtx();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * masterVolume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  noise.connect(gain);
  gain.connect(ctx.destination);
  noise.start(ctx.currentTime + delay);
};

// ============================================
// SOUND EFFECTS LIBRARY
// ============================================

/** Soft click for buttons, tabs, navigation */
export const playClick = () => {
  playTone(800, 0.06, 'square', 0.3);
};

/** Tab switch — quick ascending blip */
export const playTab = () => {
  playTone(600, 0.04, 'square', 0.25);
  playTone(900, 0.06, 'square', 0.25, 0.04);
};

/** Navigate forward — whoosh up */
export const playNavigate = () => {
  playTone(400, 0.05, 'square', 0.2);
  playTone(600, 0.05, 'square', 0.2, 0.04);
  playTone(800, 0.08, 'square', 0.2, 0.08);
};

/** Navigate back — whoosh down */
export const playBack = () => {
  playTone(800, 0.05, 'square', 0.2);
  playTone(600, 0.05, 'square', 0.2, 0.04);
  playTone(400, 0.08, 'square', 0.15, 0.08);
};

/** Correct answer — happy ascending chime */
export const playCorrect = () => {
  playTone(523, 0.1, 'square', 0.35);
  playTone(659, 0.1, 'square', 0.35, 0.1);
  playTone(784, 0.15, 'square', 0.3, 0.2);
};

/** Wrong answer — descending buzz */
export const playWrong = () => {
  playTone(300, 0.12, 'sawtooth', 0.25);
  playTone(200, 0.2, 'sawtooth', 0.25, 0.12);
};

/** XP coin collect — retro coin */
export const playXP = () => {
  playTone(988, 0.06, 'square', 0.3);
  playTone(1319, 0.12, 'square', 0.25, 0.06);
};

/** Level up / module complete — triumphant arpeggio */
export const playLevelUp = () => {
  playTone(523, 0.1, 'square', 0.3);     // C5
  playTone(659, 0.1, 'square', 0.3, 0.1); // E5
  playTone(784, 0.1, 'square', 0.3, 0.2); // G5
  playTone(1047, 0.25, 'square', 0.35, 0.3); // C6
};

/** Victory fanfare — big celebration */
export const playVictory = () => {
  playTone(523, 0.12, 'square', 0.3);      // C5
  playTone(523, 0.06, 'square', 0.25, 0.12);
  playTone(523, 0.06, 'square', 0.25, 0.2);
  playTone(523, 0.12, 'square', 0.3, 0.28);
  playTone(415, 0.12, 'square', 0.3, 0.42); // Ab4
  playTone(466, 0.12, 'square', 0.3, 0.56); // Bb4
  playTone(523, 0.08, 'square', 0.3, 0.7);  // C5
  playTone(466, 0.06, 'triangle', 0.2, 0.78);
  playTone(523, 0.3, 'square', 0.35, 0.84); // C5 hold
};

/** Achievement unlock — magical ascending glitter */
export const playAchievement = () => {
  playTone(784, 0.08, 'square', 0.3);     // G5
  playTone(988, 0.08, 'square', 0.3, 0.08); // B5
  playTone(1175, 0.08, 'square', 0.3, 0.16); // D6
  playTone(1568, 0.2, 'triangle', 0.35, 0.24); // G6
  playTone(1568, 0.3, 'sine', 0.15, 0.35); // shimmer
};

/** Skin unlock — sparkling reveal */
export const playSkinUnlock = () => {
  playTone(440, 0.08, 'triangle', 0.25);
  playTone(554, 0.08, 'triangle', 0.25, 0.08);
  playTone(659, 0.08, 'triangle', 0.25, 0.16);
  playTone(880, 0.08, 'triangle', 0.3, 0.24);
  playTone(1109, 0.08, 'triangle', 0.3, 0.32);
  playTone(1319, 0.25, 'triangle', 0.35, 0.4);
};

/** Error / locked — low rejection buzz */
export const playError = () => {
  playTone(150, 0.15, 'sawtooth', 0.2);
  playNoise(0.08, 0.15, 0.05);
};

/** Start lesson / challenge — exciting intro */
export const playStart = () => {
  playTone(330, 0.08, 'square', 0.25);
  playTone(440, 0.08, 'square', 0.25, 0.08);
  playTone(554, 0.08, 'square', 0.25, 0.16);
  playTone(660, 0.12, 'square', 0.3, 0.24);
};

/** Toggle on — blip up */
export const playToggleOn = () => {
  playTone(600, 0.05, 'square', 0.2);
  playTone(900, 0.08, 'square', 0.25, 0.05);
};

/** Toggle off — blip down */
export const playToggleOff = () => {
  playTone(900, 0.05, 'square', 0.2);
  playTone(600, 0.08, 'square', 0.2, 0.05);
};

/** Save confirm — satisfying double-bling */
export const playSave = () => {
  playTone(880, 0.08, 'square', 0.3);
  playTone(1175, 0.15, 'square', 0.3, 0.1);
};

/** Select/equip item — snap click */
export const playSelect = () => {
  playTone(700, 0.04, 'square', 0.25);
  playTone(1050, 0.06, 'square', 0.3, 0.04);
};

/** Login / welcome — warm greeting */
export const playLogin = () => {
  playTone(440, 0.1, 'triangle', 0.25);
  playTone(554, 0.1, 'triangle', 0.25, 0.1);
  playTone(659, 0.1, 'triangle', 0.25, 0.2);
  playTone(880, 0.2, 'triangle', 0.3, 0.3);
};

/** Logout — descending farewell */
export const playLogout = () => {
  playTone(659, 0.1, 'triangle', 0.2);
  playTone(554, 0.1, 'triangle', 0.2, 0.1);
  playTone(440, 0.15, 'triangle', 0.2, 0.2);
};

/** Friend request sent / accepted — happy ping */
export const playFriendAccept = () => {
  playTone(659, 0.08, 'triangle', 0.25);
  playTone(880, 0.08, 'triangle', 0.25, 0.08);
  playTone(1047, 0.15, 'triangle', 0.3, 0.16);
};

/** Notification / gift received — attention bell */
export const playNotification = () => {
  playTone(1047, 0.08, 'sine', 0.3);
  playTone(1319, 0.15, 'sine', 0.3, 0.1);
  playTone(1047, 0.1, 'sine', 0.2, 0.25);
};

/** Streak fire — quick escalating pattern */
export const playStreak = () => {
  playTone(330, 0.05, 'square', 0.2);
  playTone(440, 0.05, 'square', 0.22, 0.04);
  playTone(554, 0.05, 'square', 0.24, 0.08);
  playTone(660, 0.05, 'square', 0.26, 0.12);
  playTone(880, 0.1, 'square', 0.3, 0.16);
};

/** Code block snap — digital attach */
export const playBlockSnap = () => {
  playTone(500, 0.03, 'square', 0.2);
  playTone(750, 0.05, 'square', 0.25, 0.03);
};

/** Code block unsnap — digital detach */
export const playBlockUnsnap = () => {
  playTone(750, 0.03, 'square', 0.2);
  playTone(500, 0.05, 'square', 0.2, 0.03);
};

/** World enter — epic portal sound */
export const playWorldEnter = () => {
  playTone(220, 0.15, 'triangle', 0.2);
  playTone(330, 0.12, 'triangle', 0.22, 0.12);
  playTone(440, 0.12, 'triangle', 0.24, 0.22);
  playTone(660, 0.15, 'triangle', 0.28, 0.32);
  playTone(880, 0.2, 'triangle', 0.3, 0.45);
};

/** Page flip / story advance — soft tick */
export const playPageFlip = () => {
  playTone(1200, 0.03, 'square', 0.15);
  playNoise(0.03, 0.08, 0.02);
};

/** Timer warning — urgent beep */
export const playTimerWarning = () => {
  playTone(880, 0.06, 'square', 0.3);
  playTone(880, 0.06, 'square', 0.3, 0.12);
};

/** Shuffle / randomize — dice roll */
export const playShuffle = () => {
  for (let i = 0; i < 6; i++) {
    playTone(400 + Math.random() * 600, 0.03, 'square', 0.15, i * 0.04);
  }
  playTone(1000, 0.1, 'square', 0.25, 0.28);
};

/** Expand / collapse panel */
export const playExpand = () => {
  playTone(400, 0.04, 'triangle', 0.15);
  playTone(600, 0.06, 'triangle', 0.2, 0.04);
};

export const playCollapse = () => {
  playTone(600, 0.04, 'triangle', 0.15);
  playTone(400, 0.06, 'triangle', 0.2, 0.04);
};

/** Favorite toggle — heart beat */
export const playFavorite = () => {
  playTone(800, 0.06, 'triangle', 0.25);
  playTone(1000, 0.1, 'triangle', 0.3, 0.08);
};

/** Delete / remove — serious action */
export const playDelete = () => {
  playTone(400, 0.08, 'sawtooth', 0.2);
  playTone(300, 0.08, 'sawtooth', 0.2, 0.08);
  playTone(200, 0.12, 'sawtooth', 0.2, 0.16);
};
