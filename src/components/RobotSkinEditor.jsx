// ================================================================
// ROBOT SKIN EDITOR — CultivaTec App
// Garage-style fullscreen modal for robot skin customization
// ================================================================

import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Check, Star, BookOpen, Lock, Wrench, ChevronDown } from 'lucide-react';
import { RobotAvatar } from '../Onboarding';

// ============================================
// ROBOT STORY DIALOGUE
// ============================================

const ROBOT_STORY_LINES = [
  { emoji: '✨', getText: (name, user) => `*bzzz... bip bip...* ¿Dónde... dónde estoy? Ah... ¡Hola! Mi nombre es ${name}. ¡Acabo de despertar en el Laboratorio de CultivaTec!` },
  { emoji: '🤔', getText: (name, user) => `Mmm... parece que no sé mucho todavía. No entiendo qué es la electricidad, ni cómo funcionan los circuitos, ni nada de programación... ¡Necesito un maestro!` },
  { emoji: '🌟', getText: (name, user) => `¡Espera! ¿Tú eres ${user}? El profesor me dijo que vendrías. ¡Tú vas a ser mi maestro! Juntos vamos a aprender de todo.` },
  { emoji: '🎯', getText: (name, user) => `Tu misión es completar las lecciones de la Biblioteca. Cada módulo que completes me enseñará algo nuevo: electricidad, circuitos, sensores, programación...` },
  { emoji: '🛠️', getText: (name, user) => `¡Hay mucho por explorar! Puedes practicar código en el Taller, resolver retos de programación, simular robots, construir circuitos virtuales y hasta ganar trofeos. ¡Ah, y puedes cambiar mi apariencia cuando quieras tocándome en la pantalla!` },
  { emoji: '🚀', getText: (name, user) => `¡Estoy listo, ${user}! Con cada lección que completes, yo creceré y me haré más fuerte. ¿Empezamos esta aventura juntos? ¡Vamos a ser los mejores del laboratorio!` },
];

// ============================================
// ROBOT SKINS PREDEFINIDAS
// ============================================

export const ROBOT_SKINS = [
  {
    id: 'skin_default',
    name: 'Original',
    description: 'El robot original de CultivaTec ⚡',
    icon: '🤖',
    rarity: 'common',
    rarityLabel: 'Inicial',
    rarityColor: '#58CC02',
    config: { skinImage: '/skin.png' },
  },
  {
    id: 'skin_1',
    name: 'Explorador',
    description: 'Robot aventurero listo para descubrir 🧭',
    icon: '🧭',
    rarity: 'common',
    rarityLabel: 'Común',
    rarityColor: '#58CC02',
    config: { skinImage: '/skin1.png' },
  },
  {
    id: 'skin_2',
    name: 'Guerrero',
    description: 'Robot de combate con armadura épica ⚔️',
    icon: '⚔️',
    rarity: 'rare',
    rarityLabel: 'Raro',
    rarityColor: '#3B82F6',
    config: { skinImage: '/skin2.png' },
  },
  {
    id: 'skin_3',
    name: 'Científico',
    description: 'Genio del laboratorio con circuitos avanzados 🔬',
    icon: '🔬',
    rarity: 'rare',
    rarityLabel: 'Raro',
    rarityColor: '#3B82F6',
    config: { skinImage: '/skin3.png' },
  },
  {
    id: 'skin_4',
    name: 'Galaxia',
    description: 'Viajero intergaláctico con poderes cósmicos 🌌',
    icon: '🌌',
    rarity: 'epic',
    rarityLabel: 'Épico',
    rarityColor: '#FF4B4B',
    config: { skinImage: '/skin4.png' },
  },
  {
    id: 'skin_5',
    name: 'Ninja',
    description: 'Silencioso, rápido e invisible en las sombras 🥷',
    icon: '🥷',
    rarity: 'epic',
    rarityLabel: 'Épico',
    rarityColor: '#FF4B4B',
    config: { skinImage: '/skin5.png' },
  },
  {
    id: 'skin_6',
    name: 'Naturaleza',
    description: 'Robot ecológico conectado con la naturaleza 🌿',
    icon: '🌿',
    rarity: 'common',
    rarityLabel: 'Común',
    rarityColor: '#58CC02',
    config: { skinImage: '/skin6.png' },
  },
  {
    id: 'skin_7',
    name: 'Rey Dorado',
    description: 'El robot más majestuoso del reino ✨',
    icon: '👑',
    rarity: 'legendary',
    rarityLabel: 'Legendario',
    rarityColor: '#FFC800',
    config: { skinImage: '/skin7.png' },
  },
  {
    id: 'skin_8',
    name: 'Mecánico',
    description: 'Experto en reparar y construir cualquier cosa 🔧',
    icon: '🔧',
    rarity: 'common',
    rarityLabel: 'Común',
    rarityColor: '#58CC02',
    config: { skinImage: '/skin8.png' },
  },
  {
    id: 'skin_9',
    name: 'Astronauta',
    description: 'Explorador del espacio exterior 🚀',
    icon: '🚀',
    rarity: 'epic',
    rarityLabel: 'Épico',
    rarityColor: '#FF4B4B',
    config: { skinImage: '/skin9.png' },
  },
  {
    id: 'skin_10',
    name: 'Fantasma',
    description: 'Robot etéreo que flota entre dimensiones 👻',
    icon: '👻',
    rarity: 'rare',
    rarityLabel: 'Raro',
    rarityColor: '#3B82F6',
    config: { skinImage: '/skin10.png' },
  },
  {
    id: 'skin_11',
    name: 'Rockero',
    description: 'Robot musical que agita el laboratorio 🎸',
    icon: '🎸',
    rarity: 'epic',
    rarityLabel: 'Épico',
    rarityColor: '#FF4B4B',
    config: { skinImage: '/skin11.png' },
  },
  {
    id: 'skin_12',
    name: 'Pirata',
    description: 'Robot corsario surcando mares digitales 🏴‍☠️',
    icon: '🏴‍☠️',
    rarity: 'rare',
    rarityLabel: 'Raro',
    rarityColor: '#3B82F6',
    config: { skinImage: '/skin12.png' },
  },
  {
    id: 'skin_13',
    name: 'Samurai',
    description: 'Robot honorable con espíritu de guerrero 🏯',
    icon: '🏯',
    rarity: 'legendary',
    rarityLabel: 'Legendario',
    rarityColor: '#FFC800',
    config: { skinImage: '/skin13.png' },
  },
  {
    id: 'skin_14',
    name: 'Hada Digital',
    description: 'Robot mágico con poderes de programación ✨',
    icon: '🧚',
    rarity: 'legendary',
    rarityLabel: 'Legendario',
    rarityColor: '#FFC800',
    config: { skinImage: '/skin14.png' },
  },
  {
    id: 'skin_15',
    name: 'Polar',
    description: 'Robot helado del polo norte digital ❄️',
    icon: '❄️',
    rarity: 'rare',
    rarityLabel: 'Raro',
    rarityColor: '#3B82F6',
    config: { skinImage: '/skin15.png' },
  },
  {
    id: 'skin_16',
    name: 'Capitán',
    description: 'Líder nato que inspira a todos los robots 🎖️',
    icon: '🎖️',
    rarity: 'epic',
    rarityLabel: 'Épico',
    rarityColor: '#FF4B4B',
    config: { skinImage: '/skin16.png' },
  },
  {
    id: 'skin_17',
    name: 'Dulce',
    description: 'El robot más tierno y adorable del laboratorio 💖',
    icon: '💖',
    rarity: 'rare',
    rarityLabel: 'Raro',
    rarityColor: '#3B82F6',
    config: { skinImage: '/skin17.png' },
  },
  {
    id: 'skin_18',
    name: 'Volcánico',
    description: 'Robot de fuego con energía volcánica 🌋',
    icon: '🌋',
    rarity: 'legendary',
    rarityLabel: 'Legendario',
    rarityColor: '#FFC800',
    config: { skinImage: '/skin18.png' },
  },
  {
    id: 'skin_19',
    name: 'Sombra',
    description: 'Robot misterioso que se mueve entre las sombras 🌑',
    icon: '🌑',
    rarity: 'epic',
    rarityLabel: 'Épico',
    rarityColor: '#FF4B4B',
    config: { skinImage: '/skin19.png' },
  },
  {
    id: 'skin_20',
    name: 'Cazador de Bugs',
    description: 'Solo los elegidos por el admin obtienen esta skin 🐛',
    icon: '🐛',
    rarity: 'legendary',
    rarityLabel: 'Exclusivo',
    rarityColor: '#9333EA',
    config: { skinImage: '/skin20.png' },
  },
  {
    id: 'skin_21',
    name: 'Novato',
    description: 'Tu primer paso en el mundo de la robótica 🌟',
    icon: '🌟',
    rarity: 'rare',
    rarityLabel: 'Especial',
    rarityColor: '#06B6D4',
    config: { skinImage: '/skin21.png' },
  },
  {
    id: 'skin_22',
    name: 'Prototipo X',
    description: 'Creación secreta del laboratorio, solo para los elegidos 🔬',
    icon: '🧪',
    rarity: 'legendary',
    rarityLabel: 'Exclusivo',
    rarityColor: '#9333EA',
    config: { skinImage: '/skin22.png' },
  },
  {
    id: 'skin_23',
    name: 'Arcángel',
    description: 'Skin divina otorgada solo por el administrador supremo 👼',
    icon: '👼',
    rarity: 'legendary',
    rarityLabel: 'Admin',
    rarityColor: '#9333EA',
    config: { skinImage: '/skin23.png' },
  },
  {
    id: 'skin_24',
    name: 'Fénix Ancestral',
    description: 'Renace de las cenizas del conocimiento total. Solo los verdaderos maestros lo obtienen 🔥',
    icon: '🔥',
    rarity: 'legend',
    rarityLabel: '🏛️ Leyenda',
    rarityColor: '#FF6B00',
    config: { skinImage: '/skin24.png' },
  },
  {
    id: 'skin_25',
    name: 'Titán Cósmico',
    description: 'Forjado en las estrellas, domina todos los mundos conocidos 🌠',
    icon: '🌠',
    rarity: 'legend',
    rarityLabel: '🏛️ Leyenda',
    rarityColor: '#FF6B00',
    config: { skinImage: '/skin25.png' },
  },
  {
    id: 'skin_26',
    name: 'Oráculo',
    description: 'Vidente digital que ha completado cada desafío del universo CultivaTec 🔮',
    icon: '🔮',
    rarity: 'legend',
    rarityLabel: '🏛️ Leyenda',
    rarityColor: '#FF6B00',
    config: { skinImage: '/skin26.png' },
  },
  {
    id: 'skin_27',
    name: 'Dragón Milenario',
    description: 'Bestia mecánica legendaria que solo aparece ante los más persistentes 🐉',
    icon: '🐉',
    rarity: 'legend',
    rarityLabel: '🏛️ Leyenda',
    rarityColor: '#FF6B00',
    config: { skinImage: '/skin27.png' },
  },
  {
    id: 'skin_28',
    name: 'Espectro Supremo',
    description: 'Entidad etérea que trasciende la realidad, solo accesible para la élite absoluta 👁️',
    icon: '👁️',
    rarity: 'legend',
    rarityLabel: '🏛️ Leyenda',
    rarityColor: '#FF6B00',
    config: { skinImage: '/skin28.png' },
  },
  {
    id: 'skin_29',
    name: 'Nexus Primordial',
    description: 'El origen de todo. Última skin legendaria, reservada para quienes dominan CultivaTec ⚜️',
    icon: '⚜️',
    rarity: 'legend',
    rarityLabel: '🏛️ Leyenda',
    rarityColor: '#FF6B00',
    config: { skinImage: '/skin29.png' },
  },
  {
    id: 'skin_30',
    name: 'Deidad Digital',
    description: 'La creación más sagrada del admin. Solo los elegidos la portan 🌟',
    icon: '🛡️',
    rarity: 'legendary',
    rarityLabel: 'Admin',
    rarityColor: '#9333EA',
    config: { skinImage: '/skin30.png' },
  },
];

// ============================================
// SKIN UNLOCK REQUIREMENTS
// ============================================

export const SKIN_UNLOCK_REQUIREMENTS = {
  'skin_default': { type: 'free' },
  'skin_1':  { type: 'modules', count: 1, label: 'Completa 1 módulo' },
  'skin_2':  { type: 'world_unlock', worldIndex: 2, label: 'Desbloquea el Mundo 3' },
  'skin_3':  { type: 'modules', count: 3,  label: 'Completa 3 módulos' },
  'skin_4':  { type: 'world_unlock', worldIndex: 2, label: 'Desbloquea el Mundo 3' },
  'skin_5':  { type: 'modules', count: 10, label: 'Completa 10 módulos' },
  'skin_6':  { type: 'world',   worldIndex: 0, label: 'Completa el Mundo 1' },
  'skin_7':  { type: 'world_unlock', worldIndex: 3, label: 'Desbloquea el Mundo 4' },
  'skin_8':  { type: 'modules', count: 25, label: 'Completa 25 módulos' },
  'skin_9':  { type: 'world_unlock', worldIndex: 3, label: 'Desbloquea el Mundo 4' },
  'skin_10': { type: 'modules', count: 35, label: 'Completa 35 módulos' },
  'skin_11': { type: 'modules', count: 40, label: 'Completa 40 módulos' },
  'skin_12': { type: 'world',   worldIndex: 2, label: 'Completa el Mundo 3' },
  'skin_13': { type: 'modules', count: 50, label: 'Completa 50 módulos' },
  'skin_14': { type: 'modules', count: 55, label: 'Completa 55 módulos' },
  'skin_15': { type: 'world',   worldIndex: 3, label: 'Completa el Mundo 4' },
  'skin_16': { type: 'modules', count: 65, label: 'Completa 65 módulos' },
  'skin_17': { type: 'modules', count: 70, label: 'Completa 70 módulos' },
  'skin_18': { type: 'world',   worldIndex: 4, label: 'Completa el Mundo 5' },
  'skin_19': { type: 'modules', count: 45, label: 'Completa 45 módulos' },
  'skin_20': { type: 'admin_only', label: 'Regalo exclusivo del admin' },
  'skin_21': { type: 'world_enter', worldIndex: 0, label: 'Entra al Mundo 1' },
  'skin_22': { type: 'admin_only', label: 'Regalo exclusivo del admin' },
  'skin_23': { type: 'admin_only', label: 'Regalo exclusivo del admin' },
  'skin_24': { type: 'legend', requiredWorlds: [0,1,2,3,4,5], requiredModules: 80, label: '🏛️ Completa 80 módulos y todos los mundos' },
  'skin_25': { type: 'legend', requiredWorlds: [0,1,2,3,4,5], requiredModules: 85, label: '🏛️ Completa 85 módulos y todos los mundos' },
  'skin_26': { type: 'legend', requiredWorlds: [0,1,2,3,4,5], requiredModules: 88, label: '🏛️ Completa 88 módulos y todos los mundos' },
  'skin_27': { type: 'legend', requiredWorlds: [0,1,2,3,4,5], requiredModules: 90, label: '🏛️ Completa 90 módulos y todos los mundos' },
  'skin_28': { type: 'legend', requiredWorlds: [0,1,2,3,4,5], requiredModules: 93, label: '🏛️ Completa 93 módulos y todos los mundos' },
  'skin_29': { type: 'legend', requiredWorlds: [0,1,2,3,4,5], requiredModules: 96, label: '🏛️ Completa los 96 módulos de todos los mundos' },
  'skin_30': { type: 'admin_only', label: 'Regalo exclusivo del admin' },
};

/**
 * Compute the set of unlocked skin IDs based on progress and gifts.
 * @param {number} completedModulesCount
 * @param {number[]} completedWorldIndices - fully completed worlds
 * @param {string[]} giftedSkinIds
 * @param {boolean} isAdmin
 * @param {number[]} unlockedWorldIndices - worlds that are accessible/unlocked
 * @param {number[]} enteredWorldIndices - worlds the user has entered at least once
 */
export const getUnlockedSkinIds = (completedModulesCount = 0, completedWorldIndices = [], giftedSkinIds = [], isAdmin = false, unlockedWorldIndices = [], enteredWorldIndices = []) => {
  const unlocked = new Set();
  for (const skin of ROBOT_SKINS) {
    const req = SKIN_UNLOCK_REQUIREMENTS[skin.id];
    if (!req) continue;
    if (isAdmin) { unlocked.add(skin.id); continue; }
    if (giftedSkinIds.includes(skin.id)) { unlocked.add(skin.id); continue; }
    if (req.type === 'free') { unlocked.add(skin.id); continue; }
    if (req.type === 'modules' && completedModulesCount >= req.count) { unlocked.add(skin.id); continue; }
    if (req.type === 'world' && completedWorldIndices.includes(req.worldIndex)) { unlocked.add(skin.id); continue; }
    if (req.type === 'world_unlock' && unlockedWorldIndices.includes(req.worldIndex)) { unlocked.add(skin.id); continue; }
    if (req.type === 'world_enter' && enteredWorldIndices.includes(req.worldIndex)) { unlocked.add(skin.id); continue; }
    if (req.type === 'legend' && completedModulesCount >= req.requiredModules && req.requiredWorlds.every(w => completedWorldIndices.includes(w))) { unlocked.add(skin.id); continue; }
    // admin_only: only via gifted or isAdmin (already handled above)
  }
  return unlocked;
};

// ============================================
// ROBOT STORY TAB (garage-themed)
// ============================================

const RobotStoryTab = ({ robotConfig, robotName, userName, storyIndex, setStoryIndex, storyTyping, setStoryTyping, storyText, setStoryText }) => {
  const currentLine = ROBOT_STORY_LINES[storyIndex];
  const fullText = currentLine.getText(robotName, userName);
  const isLast = storyIndex === ROBOT_STORY_LINES.length - 1;

  useEffect(() => {
    if (!storyTyping) return;
    setStoryText('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStoryText(fullText.slice(0, i));
      if (i >= fullText.length) { clearInterval(interval); setStoryTyping(false); }
    }, 25);
    return () => clearInterval(interval);
  }, [storyIndex, storyTyping]);

  const handleTap = () => {
    if (storyTyping) { setStoryText(fullText); setStoryTyping(false); return; }
    if (!isLast) { setStoryIndex(prev => prev + 1); setStoryTyping(true); }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <div className="relative mb-4">
        <div className="w-28 h-28 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl border-2 border-cyan-500/30 flex items-center justify-center p-2 shadow-lg shadow-cyan-500/10">
          <RobotAvatar config={robotConfig} size={95} animate />
        </div>
        <div className="absolute -top-1 -right-2 text-lg animate-bounce">✨</div>
      </div>
      <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 mb-3">
        <span className="text-base">{currentLine.emoji}</span>
        <span className="text-xs font-black text-cyan-400">{robotName} dice...</span>
      </div>
      <div className="relative bg-[#1E293B] rounded-2xl p-4 border border-cyan-500/20 mb-3 text-left min-h-[100px] w-full cursor-pointer active:bg-[#263548] transition-colors" onClick={handleTap}>
        <p className="text-gray-200 leading-relaxed text-sm font-semibold">
          {storyText}
          {storyTyping && <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse align-middle"></span>}
        </p>
      </div>
      <div className="flex justify-center gap-1.5 mb-3">
        {ROBOT_STORY_LINES.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === storyIndex ? 'w-6 bg-cyan-400' : i < storyIndex ? 'w-3 bg-cyan-700' : 'w-3 bg-gray-600'}`}/>
        ))}
      </div>
      <div className="flex gap-2 w-full">
        {storyIndex > 0 && (
          <button onClick={() => { setStoryIndex(prev => prev - 1); setStoryTyping(true); }}
            className="flex-1 py-2.5 rounded-xl bg-[#1E293B] border border-gray-600 font-bold text-sm text-gray-400 active:scale-95 transition-all flex items-center justify-center gap-1">
            <ChevronLeft size={16}/> Anterior
          </button>
        )}
        <button onClick={handleTap}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1">
          {storyTyping ? 'Saltar ▸▸' : isLast ? '🎉 ¡Fin!' : <>Siguiente <ChevronRight size={16}/></>}
        </button>
      </div>
      <p className="text-[10px] text-gray-600 font-semibold mt-3 text-center">Toca la burbuja para avanzar</p>
    </div>
  );
};

// ============================================
// GARAGE-STYLE ROBOT SKIN EDITOR
// ============================================

const RobotSkinEditor = ({ isOpen, onClose, currentConfig, currentName, onSave, userName, unlockedSkinIds }) => {
  const [mode, setMode] = useState('skins');
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyTyping, setStoryTyping] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [robotConfig, setRobotConfig] = useState(currentConfig || { skinImage: '/skin.png' });
  const [robotName, setRobotName] = useState(currentName || '');
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [skinsPanelExpanded, setSkinsPanelExpanded] = useState(true);
  const [lockedPreview, setLockedPreview] = useState(null); // skin object for locked preview modal
  const skinsRef = useRef(null);

  const currentSkinData = ROBOT_SKINS.find(s => s.id === selectedSkin)
    || ROBOT_SKINS.find(s => JSON.stringify(s.config) === JSON.stringify(robotConfig))
    || ROBOT_SKINS[0];

  const totalSkins = ROBOT_SKINS.length;
  const unlockedCount = unlockedSkinIds ? unlockedSkinIds.size : totalSkins;

  useEffect(() => {
    if (isOpen) {
      setRobotConfig(currentConfig || { skinImage: '/skin.png' });
      setRobotName(currentName || '');
      setSelectedSkin(null);
      setShowSavedMessage(false);
      setMode('skins');
      setSkinsPanelExpanded(true);
    }
  }, [isOpen, currentConfig, currentName]);

  if (!isOpen) return null;

  const handleSelectSkin = (skin) => {
    if (unlockedSkinIds && !unlockedSkinIds.has(skin.id)) {
      setLockedPreview(skin);
      return;
    }
    setSelectedSkin(skin.id);
    setRobotConfig({ ...skin.config });
  };

  const handleSave = () => {
    onSave(robotConfig, robotName);
    setShowSavedMessage(true);
    setTimeout(() => { setShowSavedMessage(false); onClose(); }, 1200);
  };

  const randomize = () => {
    const available = unlockedSkinIds ? ROBOT_SKINS.filter(s => unlockedSkinIds.has(s.id)) : ROBOT_SKINS;
    if (available.length === 0) return;
    const randomSkin = available[Math.floor(Math.random() * available.length)];
    setSelectedSkin(randomSkin.id);
    setRobotConfig({ ...randomSkin.config });
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'shadow-[0_0_25px_rgba(255,200,0,0.4)]';
      case 'epic': return 'shadow-[0_0_20px_rgba(255,75,75,0.3)]';
      case 'rare': return 'shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      default: return 'shadow-[0_0_12px_rgba(88,204,2,0.15)]';
    }
  };

  const getRarityBorder = (rarity, isSelected) => {
    if (isSelected) return 'border-cyan-400 ring-2 ring-cyan-400/40';
    switch (rarity) {
      case 'legend': return 'border-[#FF6B00]/50 hover:border-[#FF6B00] shadow-md shadow-orange-500/20';
      case 'legendary': return 'border-[#FFC800]/40 hover:border-[#FFC800]';
      case 'epic': return 'border-[#FF4B4B]/30 hover:border-[#FF4B4B]';
      case 'rare': return 'border-[#3B82F6]/30 hover:border-[#3B82F6]';
      default: return 'border-gray-600/40 hover:border-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" onClick={onClose}>
      {/* Full-screen garage background */}
      <div className="absolute inset-0 bg-[#0B1120]">
        {/* Industrial grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Ambient glow spots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* Main layout */}
      <div className="relative z-10 h-full flex flex-col" onClick={e => e.stopPropagation()}>

        {/* ── TOP BAR ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-700/50 bg-[#0F172A]/80 backdrop-blur-md">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors active:scale-95">
            <ChevronLeft size={20} />
            <span className="text-sm font-bold">Volver</span>
          </button>
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-cyan-400" />
            <h1 className="text-base font-black text-white tracking-wide">GARAGE</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-800/60 rounded-lg px-2.5 py-1 border border-gray-700/50">
            <Star size={12} className="text-yellow-400" />
            <span className="text-xs font-black text-gray-300">{unlockedCount}/{totalSkins}</span>
          </div>
        </div>

        {/* ── SAVED OVERLAY ── */}
        {showSavedMessage && (
          <div className="absolute inset-0 z-50 bg-[#0B1120]/95 flex flex-col items-center justify-center animate-scale-in">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border-2 border-green-500/30">
              <Check size={48} className="text-green-400" />
            </div>
            <h3 className="text-xl font-black text-white">¡Guardado!</h3>
            <p className="text-sm text-gray-400 font-bold">Tu robot se ha actualizado</p>
          </div>
        )}

        {/* ── MODE TABS ── */}
        <div className="flex-shrink-0 flex border-b border-gray-700/50 bg-[#0F172A]/60">
          <button onClick={() => setMode('skins')}
            className={`flex-1 py-2.5 text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'skins' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-gray-500 hover:text-gray-400'
            }`}>
            <Star size={14} /> Skins
          </button>
          <button onClick={() => { setMode('story'); setStoryIndex(0); setStoryTyping(true); setStoryText(''); }}
            className={`flex-1 py-2.5 text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'story' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-gray-500 hover:text-gray-400'
            }`}>
            <BookOpen size={14} /> Historia
          </button>
        </div>

        {mode === 'story' ? (
          /* ── STORY MODE ── */
          <div className="flex-1 overflow-y-auto">
            <RobotStoryTab
              robotConfig={robotConfig}
              robotName={robotName || currentName || 'Sparky'}
              userName={userName || 'Explorador'}
              storyIndex={storyIndex} setStoryIndex={setStoryIndex}
              storyTyping={storyTyping} setStoryTyping={setStoryTyping}
              storyText={storyText} setStoryText={setStoryText}
            />
          </div>
        ) : (
          /* ── SKINS / GARAGE MODE ── */
          <>
            {/* Robot display area */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center py-5 px-4 relative"
              style={{ minHeight: skinsPanelExpanded ? '36vh' : '62vh', transition: 'min-height 0.3s ease' }}>
              {/* Platform glow */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 h-5 bg-cyan-500/15 rounded-full blur-xl" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-cyan-400/25 rounded-full blur-sm" />

              {/* Robot — LARGE */}
              <div className="relative mb-3">
                <div className={`absolute inset-0 rounded-[28px] ${getRarityGlow(currentSkinData.rarity)}`} style={{ transform: 'scale(1.06)' }} />
                <div className="relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[28px] border-2 border-gray-700/60 flex items-center justify-center shadow-2xl overflow-hidden"
                  style={{ width: 'min(62vw, 250px)', height: 'min(62vw, 250px)' }}>
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30 rounded-br-lg" />
                  {/* Scan line effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.15) 3px, rgba(0,255,255,0.15) 4px)' }} />
                  <RobotAvatar config={robotConfig} size={Math.min(window.innerWidth * 0.52, 210)} animate />
                </div>
                {/* Randomize */}
                <button onClick={randomize}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all active:scale-90 border border-amber-400/30"
                  title="Aleatorio">
                  <RotateCcw size={18} className="text-white" />
                </button>
              </div>

              {/* Skin info */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{currentSkinData.icon}</span>
                <span className="text-base font-black text-white">{currentSkinData.name}</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: currentSkinData.rarityColor }}>
                  {currentSkinData.rarityLabel}
                </span>
              </div>

              {/* Robot name */}
              <div className="w-full max-w-[250px]">
                <input type="text" value={robotName} onChange={e => setRobotName(e.target.value)}
                  placeholder="Nombre de tu robot..."
                  className="w-full py-2 px-4 rounded-xl bg-[#1E293B] border border-gray-600/50 text-white text-center font-bold placeholder-gray-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition text-sm"
                  maxLength={16} />
              </div>

              {/* Expand/collapse toggle */}
              <button onClick={() => setSkinsPanelExpanded(!skinsPanelExpanded)}
                className="mt-2.5 flex items-center gap-1 text-gray-500 hover:text-cyan-400 transition-colors text-xs font-bold active:scale-95">
                <ChevronDown size={14} className={`transition-transform duration-300 ${skinsPanelExpanded ? '' : 'rotate-180'}`} />
                {skinsPanelExpanded ? 'Ocultar skins' : 'Mostrar skins'}
              </button>
            </div>

            {/* Skins panel */}
            {skinsPanelExpanded && (
              <div className="flex-1 min-h-0 flex flex-col border-t border-gray-700/50 bg-[#0F172A]/80">
                <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Colección</span>
                  <span className="text-[10px] font-bold text-gray-500">{unlockedCount} desbloqueadas</span>
                </div>
                <div ref={skinsRef} className="flex-1 overflow-y-auto px-3 pb-3 min-h-0">
                  <div className="grid grid-cols-3 gap-2">
                    {ROBOT_SKINS.map(skin => {
                      const isSelected = selectedSkin === skin.id || (!selectedSkin && JSON.stringify(skin.config) === JSON.stringify(robotConfig));
                      const isLocked = unlockedSkinIds && !unlockedSkinIds.has(skin.id);
                      const requirement = SKIN_UNLOCK_REQUIREMENTS[skin.id];
                      return (
                        <button key={skin.id}
                          onClick={() => handleSelectSkin(skin)}
                          className={`relative rounded-xl border p-1.5 transition-all text-center ${
                            isLocked
                              ? 'border-gray-700/40 bg-gray-800/30 opacity-60 active:scale-95 cursor-pointer'
                              : `${getRarityBorder(skin.rarity, isSelected)} bg-[#1E293B]/80 active:scale-95`
                          }`}>
                          {/* Rarity dot */}
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: isLocked ? '#4B5563' : skin.rarityColor }} />
                          {/* Preview */}
                          <div className="flex justify-center mb-1 relative">
                            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${isLocked ? 'grayscale opacity-40' : ''}`}>
                              <RobotAvatar config={skin.config} size={48} />
                            </div>
                            {isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-7 h-7 bg-gray-900/90 rounded-full flex items-center justify-center border border-gray-600/50">
                                  <Lock size={13} className="text-gray-400" />
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Name */}
                          <div className={`text-[9px] font-black leading-tight truncate ${isLocked ? 'text-gray-600' : isSelected ? 'text-cyan-400' : 'text-gray-300'}`}>
                            {skin.name}
                          </div>
                          {/* Requirement or rarity */}
                          {isLocked && requirement ? (
                            <p className="text-[7px] text-amber-500/80 font-bold mt-0.5 leading-tight truncate">🔒 {requirement.label}</p>
                          ) : (
                            <p className="text-[7px] text-gray-500 font-semibold mt-0.5 leading-tight truncate">{skin.icon} {skin.rarityLabel}</p>
                          )}
                          {/* Selected */}
                          {isSelected && !isLocked && (
                            <div className="absolute -top-1 -left-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/50">
                              <Check size={10} className="text-[#0B1120]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="flex-shrink-0 p-3 border-t border-gray-700/50 bg-[#0F172A]/90 backdrop-blur-sm">
              <button onClick={handleSave}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-lg shadow-cyan-500/30 active:scale-[0.97] transition-all flex items-center justify-center gap-2 border-b-4 border-blue-700">
                <Sparkles size={18} />
                Guardar Cambios
              </button>
            </div>
          </>
        )}
      </div>

      {/* Locked Skin Preview Modal */}
      {lockedPreview && (() => {
        const req = SKIN_UNLOCK_REQUIREMENTS[lockedPreview.id];
        return (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={() => setLockedPreview(null)}>
            <div className="w-full max-w-xs rounded-3xl overflow-hidden animate-scale-in" style={{ background: 'linear-gradient(180deg, #1E293B, #0F172A)' }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="relative px-5 pt-5 pb-3 text-center" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172ACC)' }}>
                <button onClick={() => setLockedPreview(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition">
                  <X size={16} className="text-white/60" />
                </button>
                <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/25 rounded-full px-3 py-1 mb-3">
                  <Lock size={12} className="text-red-400" />
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">Skin Bloqueada</span>
                </div>
              </div>

              {/* Grayscale robot preview */}
              <div className="flex flex-col items-center px-5 pb-5">
                <div className="relative mb-4">
                  <div className="relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[24px] border-2 border-gray-700/60 flex items-center justify-center shadow-2xl overflow-hidden" style={{ width: 180, height: 180 }}>
                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-gray-600/40 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gray-600/40 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gray-600/40 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gray-600/40 rounded-br-lg" />
                    {/* Grayscale skin */}
                    <div style={{ filter: 'grayscale(100%) brightness(0.7) contrast(1.1)', opacity: 0.85 }}>
                      <RobotAvatar config={lockedPreview.config} size={150} />
                    </div>
                    {/* Lock overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-gray-900/80 rounded-full flex items-center justify-center border-2 border-gray-600/50 shadow-lg">
                        <Lock size={26} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skin info */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-lg">{lockedPreview.icon}</span>
                    <span className="text-lg font-black text-white">{lockedPreview.name}</span>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: lockedPreview.rarityColor }}>
                    {lockedPreview.rarityLabel}
                  </span>
                  <p className="text-xs text-gray-400 font-semibold mt-2">{lockedPreview.description}</p>
                </div>

                {/* Unlock requirement */}
                <div className="w-full p-3.5 rounded-2xl border border-amber-500/25 mb-4" style={{ background: 'linear-gradient(135deg, #78350F20, #92400E15)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">🔓</span>
                    <span className="text-xs font-black text-amber-400">¿Cómo desbloquear?</span>
                  </div>
                  <p className="text-sm font-bold text-amber-200/90 leading-relaxed">
                    {req?.label || 'Requisito desconocido'}
                  </p>
                  {req?.type === 'admin_only' && (
                    <p className="text-[10px] text-amber-500/60 font-semibold mt-1">Solo el administrador puede otorgar esta skin</p>
                  )}
                  {req?.type === 'modules' && (
                    <p className="text-[10px] text-amber-500/60 font-semibold mt-1">Sigue avanzando en la Biblioteca para desbloquearla</p>
                  )}
                  {(req?.type === 'world' || req?.type === 'world_unlock' || req?.type === 'world_enter') && (
                    <p className="text-[10px] text-amber-500/60 font-semibold mt-1">Explora los mundos para obtener esta skin</p>
                  )}
                  {req?.type === 'legend' && (
                    <p className="text-[10px] text-orange-400/70 font-semibold mt-1">🏛️ Skin de Leyenda: solo los que dominan TODOS los mundos la obtienen</p>
                  )}
                </div>

                {/* Close button */}
                <button onClick={() => setLockedPreview(null)}
                  className="w-full py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-black text-sm active:scale-95 transition-all">
                  Entendido
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default RobotSkinEditor;
