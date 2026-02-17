// ================================================================
// ROBOT SKIN EDITOR — CultivaTec App
// Modal para editar el skin del robot desde la pantalla principal
// Incluye skins predefinidas únicas y editor de partes personalizadas
// ================================================================

import React, { useState, useEffect } from 'react';
import { X, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Check, Palette, Star, BookOpen } from 'lucide-react';
import { RobotAvatar } from '../Onboarding';

// ============================================
// ROBOT STORY DIALOGUE (same as onboarding)
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
];

// ============================================
// ROBOT STORY TAB COMPONENT
// ============================================

const RobotStoryTab = ({ robotConfig, robotName, userName, storyIndex, setStoryIndex, storyTyping, setStoryTyping, storyText, setStoryText }) => {
  const currentLine = ROBOT_STORY_LINES[storyIndex];
  const fullText = currentLine.getText(robotName, userName);
  const isLast = storyIndex === ROBOT_STORY_LINES.length - 1;

  // Typewriter effect
  useEffect(() => {
    if (!storyTyping) return;
    setStoryText('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStoryText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setStoryTyping(false);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [storyIndex, storyTyping]);

  const handleTap = () => {
    if (storyTyping) {
      setStoryText(fullText);
      setStoryTyping(false);
      return;
    }
    if (!isLast) {
      setStoryIndex(prev => prev + 1);
      setStoryTyping(true);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Robot */}
      <div className="relative mb-3">
        <div className="w-28 h-28 bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] rounded-3xl border-2 border-[#93C5FD] flex items-center justify-center p-2 shadow-inner">
          <RobotAvatar config={robotConfig} size={95} animate />
        </div>
        <div className="absolute -top-1 -right-2 text-lg animate-bounce">✨</div>
        <div className="absolute -bottom-1 -left-2 text-sm animate-pulse">💫</div>
      </div>

      {/* Name badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full px-3 py-1 mb-3">
        <span className="text-base">{currentLine.emoji}</span>
        <span className="text-xs font-black text-[#2563EB]">{robotName} dice...</span>
      </div>

      {/* Speech bubble */}
      <div className="relative bg-[#F0F7FF] rounded-2xl p-4 border-2 border-[#DBEAFE] mb-3 text-left min-h-[100px] w-full cursor-pointer active:bg-[#E8F1FD] transition-colors"
        onClick={handleTap}>
        {/* Triangle */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F0F7FF] border-l-2 border-t-2 border-[#DBEAFE] transform rotate-45"></div>
        
        <p className="text-[#3C3C3C] leading-relaxed text-sm font-semibold">
          {storyText}
          {storyTyping && <span className="inline-block w-0.5 h-4 bg-[#2563EB] ml-0.5 animate-pulse align-middle"></span>}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-3">
        {ROBOT_STORY_LINES.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
            i === storyIndex ? 'w-6 bg-[#2563EB]' : i < storyIndex ? 'w-3 bg-[#93C5FD]' : 'w-3 bg-[#E5E5E5]'
          }`}/>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-2 w-full">
        {storyIndex > 0 && (
          <button onClick={() => { setStoryIndex(prev => prev - 1); setStoryTyping(true); }}
            className="flex-1 py-2.5 rounded-xl bg-[#F7F7F7] border-2 border-[#E5E5E5] font-bold text-sm text-[#777] active:scale-95 transition-all flex items-center justify-center gap-1">
            <ChevronLeft size={16}/> Anterior
          </button>
        )}
        <button onClick={handleTap}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1">
          {storyTyping ? 'Saltar ▸▸' : isLast ? '🎉 ¡Fin!' : <>Siguiente <ChevronRight size={16}/></>}
        </button>
      </div>

      <p className="text-[10px] text-[#AFAFAF] font-semibold mt-3 text-center">Toca la burbuja para avanzar</p>
    </div>
  );
};

// ============================================
// ROBOT SKIN EDITOR MODAL COMPONENT
// ============================================

const RobotSkinEditor = ({ isOpen, onClose, currentConfig, currentName, onSave, userName }) => {
  const [mode, setMode] = useState('skins'); // 'skins' | 'story'
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyTyping, setStoryTyping] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [robotConfig, setRobotConfig] = useState(currentConfig || {
    skinImage: '/skin.png'
  });
  const [robotName, setRobotName] = useState(currentName || '');
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRobotConfig(currentConfig || {
        skinImage: '/skin.png'
      });
      setRobotName(currentName || '');
      setSelectedSkin(null);
      setShowSavedMessage(false);
    }
  }, [isOpen, currentConfig, currentName]);

  if (!isOpen) return null;

  const handleSelectSkin = (skin) => {
    setSelectedSkin(skin.id);
    setRobotConfig({ ...skin.config });
  };

  const handleSave = () => {
    onSave(robotConfig, robotName);
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
      onClose();
    }, 1200);
  };

  const randomize = () => {
    const randomSkin = ROBOT_SKINS[Math.floor(Math.random() * ROBOT_SKINS.length)];
    setSelectedSkin(randomSkin.id);
    setRobotConfig({ ...randomSkin.config });
  };

  const getRarityBorder = (rarity) => {
    switch(rarity) {
      case 'legendary': return 'border-[#FFC800] bg-gradient-to-br from-[#FFC800]/10 to-[#FF9600]/10';
      case 'epic': return 'border-[#FF4B4B] bg-gradient-to-br from-[#FF4B4B]/10 to-[#FF6B6B]/5';
      case 'rare': return 'border-[#3B82F6] bg-gradient-to-br from-[#3B82F6]/10 to-[#60A5FA]/5';
      default: return 'border-[#58CC02] bg-gradient-to-br from-[#58CC02]/10 to-[#7CDB30]/5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-4 flex justify-between items-center border-b-4 border-[#1D4ED8] flex-shrink-0">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Palette size={20} />
            Personalizar Robot
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition p-1.5 rounded-lg hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* Saved Message Overlay */}
        {showSavedMessage && (
          <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center rounded-3xl animate-scale-in">
            <div className="w-24 h-24 bg-[#58CC02]/10 rounded-full flex items-center justify-center mb-4">
              <Check size={48} className="text-[#58CC02]" />
            </div>
            <h3 className="text-xl font-black text-[#3C3C3C]">¡Guardado!</h3>
            <p className="text-sm text-[#777] font-bold">Tu robot se ha actualizado</p>
          </div>
        )}

        {/* Robot Preview */}
        <div className="flex flex-col items-center py-4 bg-gradient-to-b from-[#F0F7FF] to-white flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-xl opacity-20"
              style={{ background: `radial-gradient(circle, #3B82F688, transparent 70%)` }}/>
            <div className="relative w-32 h-32 bg-white rounded-3xl border-2 border-[#E5E5E5] flex items-center justify-center p-2 shadow-lg">
              <RobotAvatar config={robotConfig} size={110} animate />
            </div>
            <button onClick={randomize}
              className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg hover:from-yellow-300 hover:to-orange-300 transition-all active:scale-90"
              title="Aleatorio">
              <RotateCcw size={14} className="text-yellow-900"/>
            </button>
          </div>
          {/* Robot Name */}
          <div className="flex items-center gap-2 mt-3 px-6 w-full max-w-xs">
            <input type="text" value={robotName} onChange={e => setRobotName(e.target.value)}
              placeholder="Nombre de tu robot..."
              className="flex-1 py-2 px-3 rounded-xl bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#3C3C3C] text-center font-bold placeholder-[#CDCDCD] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition text-sm"
              maxLength={16}/>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b-2 border-[#E5E5E5] flex-shrink-0">
          <button onClick={() => setMode('skins')}
            className={`flex-1 py-2.5 text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'skins' ? 'text-[#2563EB] border-b-3 border-[#2563EB] bg-[#2563EB]/5' : 'text-[#AFAFAF]'
            }`}>
            <Star size={14} /> Skins
          </button>
          <button onClick={() => { setMode('story'); setStoryIndex(0); setStoryTyping(true); setStoryText(''); }}
            className={`flex-1 py-2.5 text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === 'story' ? 'text-[#2563EB] border-b-3 border-[#2563EB] bg-[#2563EB]/5' : 'text-[#AFAFAF]'
            }`}>
            <BookOpen size={14} /> Historia
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {mode === 'story' ? (
            /* ROBOT STORY */
            <RobotStoryTab
              robotConfig={robotConfig}
              robotName={robotName || currentName || 'Sparky'}
              userName={userName || 'Explorador'}
              storyIndex={storyIndex}
              setStoryIndex={setStoryIndex}
              storyTyping={storyTyping}
              setStoryTyping={setStoryTyping}
              storyText={storyText}
              setStoryText={setStoryText}
            />
          ) : (
            /* SKINS GRID */
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {ROBOT_SKINS.map(skin => {
                const isSelected = selectedSkin === skin.id;
                return (
                  <button key={skin.id}
                    onClick={() => handleSelectSkin(skin)}
                    className={`relative rounded-2xl border-2 p-3 transition-all active:scale-95 text-left ${
                      isSelected 
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30 bg-[#2563EB]/5 scale-[1.02]' 
                        : getRarityBorder(skin.rarity)
                    }`}>
                    {/* Rarity badge */}
                    <div className="absolute top-1.5 right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: skin.rarityColor }}>
                      {skin.rarityLabel}
                    </div>
                    {/* Robot Preview */}
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-[#E5E5E5]/50">
                        <RobotAvatar config={skin.config} size={55} />
                      </div>
                    </div>
                    {/* Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm">{skin.icon}</span>
                        <span className="text-xs font-black text-[#3C3C3C]">{skin.name}</span>
                      </div>
                      <p className="text-[9px] text-[#AFAFAF] font-semibold mt-0.5 leading-tight">{skin.description}</p>
                    </div>
                    {/* Selected check */}
                    {isSelected && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Save Button */}
        <div className="p-4 border-t-2 border-[#E5E5E5] bg-white flex-shrink-0">
          <button onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-black text-sm shadow-lg shadow-[#2563EB]/30 active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-[#1D4ED8]">
            <Sparkles size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default RobotSkinEditor;
