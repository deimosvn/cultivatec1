import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Star, Zap, RotateCcw, Check } from 'lucide-react';

// PNG-based robot skins for onboarding
const ROBOT_SKINS_ONBOARDING = [
  { id: 'skin_default', name: 'Original', icon: '🤖', rarity: 'common', rarityColor: '#58CC02', config: { skinImage: '/skin.png' } },
  { id: 'skin_1', name: 'Explorador', icon: '🧭', rarity: 'common', rarityColor: '#58CC02', config: { skinImage: '/skin1.png' } },
  { id: 'skin_2', name: 'Guerrero', icon: '⚔️', rarity: 'rare', rarityColor: '#3B82F6', config: { skinImage: '/skin2.png' } },
  { id: 'skin_3', name: 'Científico', icon: '🔬', rarity: 'rare', rarityColor: '#3B82F6', config: { skinImage: '/skin3.png' } },
  { id: 'skin_4', name: 'Galaxia', icon: '🌌', rarity: 'epic', rarityColor: '#FF4B4B', config: { skinImage: '/skin4.png' } },
  { id: 'skin_5', name: 'Ninja', icon: '🥷', rarity: 'epic', rarityColor: '#FF4B4B', config: { skinImage: '/skin5.png' } },
  { id: 'skin_6', name: 'Naturaleza', icon: '🌿', rarity: 'common', rarityColor: '#58CC02', config: { skinImage: '/skin6.png' } },
  { id: 'skin_7', name: 'Rey Dorado', icon: '👑', rarity: 'legendary', rarityColor: '#FFC800', config: { skinImage: '/skin7.png' } },
  { id: 'skin_8', name: 'Mecánico', icon: '🔧', rarity: 'common', rarityColor: '#58CC02', config: { skinImage: '/skin8.png' } },
  { id: 'skin_9', name: 'Astronauta', icon: '🚀', rarity: 'epic', rarityColor: '#FF4B4B', config: { skinImage: '/skin9.png' } },
  { id: 'skin_10', name: 'Fantasma', icon: '👻', rarity: 'rare', rarityColor: '#3B82F6', config: { skinImage: '/skin10.png' } },
  { id: 'skin_11', name: 'Rockero', icon: '🎸', rarity: 'epic', rarityColor: '#FF4B4B', config: { skinImage: '/skin11.png' } },
  { id: 'skin_12', name: 'Pirata', icon: '🏴‍☠️', rarity: 'rare', rarityColor: '#3B82F6', config: { skinImage: '/skin12.png' } },
  { id: 'skin_13', name: 'Samurai', icon: '🏯', rarity: 'legendary', rarityColor: '#FFC800', config: { skinImage: '/skin13.png' } },
  { id: 'skin_14', name: 'Hada Digital', icon: '🧚', rarity: 'legendary', rarityColor: '#FFC800', config: { skinImage: '/skin14.png' } },
  { id: 'skin_15', name: 'Polar', icon: '❄️', rarity: 'rare', rarityColor: '#3B82F6', config: { skinImage: '/skin15.png' } },
  { id: 'skin_16', name: 'Capitán', icon: '🎖️', rarity: 'epic', rarityColor: '#FF4B4B', config: { skinImage: '/skin16.png' } },
  { id: 'skin_17', name: 'Dulce', icon: '💖', rarity: 'rare', rarityColor: '#3B82F6', config: { skinImage: '/skin17.png' } },
  { id: 'skin_18', name: 'Volcánico', icon: '🌋', rarity: 'legendary', rarityColor: '#FFC800', config: { skinImage: '/skin18.png' } },
];

// ============================================
// ROBOT CHARACTER PARTS - EXPANDED
// ============================================

const HEADS = [
  { id: 'round', label: 'Redonda', path: (c) => `<circle cx="50" cy="38" r="28" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="36" y="10" width="28" height="8" rx="4" fill="${c}99"/>` },
  { id: 'square', label: 'Cuadrada', path: (c) => `<rect x="22" y="14" width="56" height="50" rx="8" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="38" y="6" width="24" height="10" rx="4" fill="${c}99"/>` },
  { id: 'triangle', label: 'Triangular', path: (c) => `<polygon points="50,8 82,58 18,58" fill="${c}" stroke="${c}99" stroke-width="2" stroke-linejoin="round"/>` },
  { id: 'helmet', label: 'Casco', path: (c) => `<path d="M22 55 Q22 10 50 10 Q78 10 78 55 Z" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="18" y="50" width="64" height="8" rx="3" fill="${c}99"/>` },
  { id: 'cat', label: 'Gatito', path: (c) => `<circle cx="50" cy="42" r="24" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="30,22 26,4 42,18" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="70,22 74,4 58,18" fill="${c}" stroke="${c}99" stroke-width="2"/>` },
  { id: 'alien', label: 'Alien', path: (c) => `<ellipse cx="50" cy="40" rx="30" ry="24" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="32" cy="16" r="8" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="68" cy="16" r="8" fill="${c}" stroke="${c}99" stroke-width="2"/><line x1="32" y1="24" x2="38" y2="32" stroke="${c}99" stroke-width="2"/><line x1="68" y1="24" x2="62" y2="32" stroke="${c}99" stroke-width="2"/>` },
  { id: 'star', label: 'Estrella', path: (c) => `<polygon points="50,6 57,28 80,28 62,42 68,64 50,50 32,64 38,42 20,28 43,28" fill="${c}" stroke="${c}99" stroke-width="2" stroke-linejoin="round"/>` },
  { id: 'octagon', label: 'Octágono', path: (c) => `<polygon points="35,12 65,12 80,28 80,50 65,62 35,62 20,50 20,28" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="40,18 60,18 70,28 70,44 60,52 40,52 30,44 30,28" fill="${c}CC" opacity="0.3"/>` },
  { id: 'bunny', label: 'Conejito', path: (c) => `<circle cx="50" cy="44" r="22" fill="${c}" stroke="${c}99" stroke-width="2"/><ellipse cx="36" cy="16" rx="6" ry="18" fill="${c}" stroke="${c}99" stroke-width="2" transform="rotate(-10 36 16)"/><ellipse cx="64" cy="16" rx="6" ry="18" fill="${c}" stroke="${c}99" stroke-width="2" transform="rotate(10 64 16)"/><ellipse cx="36" cy="14" rx="3" ry="14" fill="${c}CC"/><ellipse cx="64" cy="14" rx="3" ry="14" fill="${c}CC"/>` },
  { id: 'bear', label: 'Osito', path: (c) => `<circle cx="50" cy="42" r="24" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="30" cy="22" r="10" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="70" cy="22" r="10" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="30" cy="22" r="6" fill="${c}CC"/><circle cx="70" cy="22" r="6" fill="${c}CC"/>` },
  { id: 'shield', label: 'Escudo', path: (c) => `<path d="M50,8 L78,22 L78,42 Q78,62 50,68 Q22,62 22,42 L22,22 Z" fill="${c}" stroke="${c}99" stroke-width="2"/>` },
  { id: 'diamond', label: 'Diamante', path: (c) => `<polygon points="50,6 82,38 50,66 18,38" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="50,14 72,38 50,58 28,38" fill="${c}CC" opacity="0.25"/>` },
];

const EYES = [
  { id: 'round', label: 'Redondos', path: () => `<circle cx="38" cy="38" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="62" cy="38" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="37" r="3.5" fill="#333"/><circle cx="64" cy="37" r="3.5" fill="#333"/><circle cx="41.5" cy="35.5" r="1.5" fill="white"/>` },
  { id: 'happy', label: 'Felices', path: () => `<path d="M32 36 Q38 28 44 36" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M56 36 Q62 28 68 36" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'screen', label: 'Pantalla', path: () => `<rect x="30" y="30" width="14" height="10" rx="2" fill="#00FF88" stroke="#333" stroke-width="1.5"/><rect x="56" y="30" width="14" height="10" rx="2" fill="#00FF88" stroke="#333" stroke-width="1.5"/><rect x="33" y="33" width="3" height="4" fill="#005533"/><rect x="39" y="33" width="3" height="4" fill="#005533"/><rect x="59" y="33" width="3" height="4" fill="#005533"/><rect x="65" y="33" width="3" height="4" fill="#005533"/>` },
  { id: 'big', label: 'Grandes', path: () => `<circle cx="38" cy="36" r="10" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="62" cy="36" r="10" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="35" r="5" fill="#333"/><circle cx="64" cy="35" r="5" fill="#333"/><circle cx="42" cy="33" r="2" fill="white"/>` },
  { id: 'angry', label: 'Valientes', path: () => `<line x1="30" y1="30" x2="44" y2="34" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="70" y1="30" x2="56" y2="34" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><circle cx="38" cy="38" r="5" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="62" cy="38" r="5" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="39" cy="38" r="2.5" fill="#333"/><circle cx="63" cy="38" r="2.5" fill="#333"/>` },
  { id: 'heart', label: 'Corazón', path: () => `<path d="M34 35 C34 30 28 28 28 33 C28 38 34 42 34 42 C34 42 40 38 40 33 C40 28 34 30 34 35Z" fill="#FF4B6E" stroke="#333" stroke-width="1"/><path d="M66 35 C66 30 60 28 60 33 C60 38 66 42 66 42 C66 42 72 38 72 33 C72 28 66 30 66 35Z" fill="#FF4B6E" stroke="#333" stroke-width="1"/>` },
  { id: 'star_eyes', label: 'Estrellas', path: () => `<polygon points="38,32 40,36 44,36 41,39 42,43 38,40 34,43 35,39 32,36 36,36" fill="#FFD700" stroke="#E5A800" stroke-width="1"/><polygon points="62,32 64,36 68,36 65,39 66,43 62,40 58,43 59,39 56,36 60,36" fill="#FFD700" stroke="#E5A800" stroke-width="1"/>` },
  { id: 'x_eyes', label: 'Mareados', path: () => `<line x1="33" y1="33" x2="43" y2="43" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="43" y1="33" x2="33" y2="43" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="57" y1="33" x2="67" y2="43" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="67" y1="33" x2="57" y2="43" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'glasses', label: 'Lentes', path: () => `<circle cx="38" cy="38" r="9" fill="white" stroke="#555" stroke-width="2.5"/><circle cx="62" cy="38" r="9" fill="white" stroke="#555" stroke-width="2.5"/><line x1="47" y1="38" x2="53" y2="38" stroke="#555" stroke-width="2.5"/><line x1="29" y1="36" x2="22" y2="33" stroke="#555" stroke-width="2"/><line x1="71" y1="36" x2="78" y2="33" stroke="#555" stroke-width="2"/><circle cx="40" cy="37" r="3.5" fill="#333"/><circle cx="64" cy="37" r="3.5" fill="#333"/>` },
  { id: 'wink', label: 'Guiño', path: () => `<circle cx="38" cy="38" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="37" r="3.5" fill="#333"/><circle cx="41.5" cy="35.5" r="1.5" fill="white"/><path d="M56 38 Q62 32 68 38" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'sleepy', label: 'Dormilón', path: () => `<path d="M32 38 L44 38" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M30 35 Q38 31 46 35" fill="none" stroke="#333" stroke-width="1.5"/><path d="M56 38 L68 38" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M54 35 Q62 31 70 35" fill="none" stroke="#333" stroke-width="1.5"/>` },
  { id: 'cyclops', label: 'Cíclope', path: () => `<circle cx="50" cy="36" r="12" fill="white" stroke="#333" stroke-width="2"/><circle cx="52" cy="35" r="6" fill="#333"/><circle cx="54" cy="33" r="2.5" fill="white"/>` },
];

const MOUTHS = [
  { id: 'smile', label: 'Sonrisa', path: () => `<path d="M38 50 Q50 60 62 50" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'open', label: 'Abierta', path: () => `<ellipse cx="50" cy="52" rx="8" ry="6" fill="#333"/><ellipse cx="50" cy="50" rx="6" ry="3" fill="#FF6B6B"/>` },
  { id: 'line', label: 'Seria', path: () => `<line x1="40" y1="52" x2="60" y2="52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'zigzag', label: 'Robot', path: () => `<polyline points="36,52 42,48 48,52 54,48 60,52 66,48" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'tongue', label: 'Lengua', path: () => `<path d="M38 50 Q50 60 62 50" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="52" cy="55" rx="4" ry="5" fill="#FF6B6B"/>` },
  { id: 'teeth', label: 'Dientes', path: () => `<rect x="38" y="48" width="24" height="10" rx="3" fill="white" stroke="#333" stroke-width="1.5"/><line x1="44" y1="48" x2="44" y2="58" stroke="#333" stroke-width="1"/><line x1="50" y1="48" x2="50" y2="58" stroke="#333" stroke-width="1"/><line x1="56" y1="48" x2="56" y2="58" stroke="#333" stroke-width="1"/>` },
  { id: 'fangs', label: 'Colmillos', path: () => `<path d="M38 50 Q50 58 62 50" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/><polygon points="42,50 44,57 46,50" fill="white" stroke="#333" stroke-width="1"/><polygon points="54,50 56,57 58,50" fill="white" stroke="#333" stroke-width="1"/>` },
  { id: 'cat_mouth', label: 'Gatuno', path: () => `<path d="M40 50 L46 54 L50 48 L54 54 L60 50" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'whistle', label: 'Silbido', path: () => `<circle cx="50" cy="52" r="5" fill="#333"/><circle cx="50" cy="51" r="3" fill="#555"/>` },
  { id: 'grr', label: 'Gruñón', path: () => `<rect x="36" y="48" width="28" height="12" rx="2" fill="#333"/><rect x="40" y="50" width="4" height="8" rx="1" fill="white"/><rect x="48" y="50" width="4" height="8" rx="1" fill="white"/><rect x="56" y="50" width="4" height="8" rx="1" fill="white"/>` },
  { id: 'kiss', label: 'Besito', path: () => `<path d="M44 50 Q50 44 56 50" fill="#FF6B9D" stroke="#E55A8A" stroke-width="1"/><ellipse cx="50" cy="53" rx="6" ry="4" fill="#FF6B9D" stroke="#E55A8A" stroke-width="1"/>` },
  { id: 'braces', label: 'Brackets', path: () => `<path d="M38 50 Q50 60 62 50" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="42" y1="52" x2="42" y2="55" stroke="#88AAFF" stroke-width="1.5"/><line x1="47" y1="53" x2="47" y2="56" stroke="#88AAFF" stroke-width="1.5"/><line x1="53" y1="53" x2="53" y2="56" stroke="#88AAFF" stroke-width="1.5"/><line x1="58" y1="52" x2="58" y2="55" stroke="#88AAFF" stroke-width="1.5"/>` },
];

const BODIES = [
  { id: 'box', label: 'Caja', path: (c) => `<rect x="25" y="0" width="50" height="50" rx="8" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="35" y="8" width="30" height="6" rx="3" fill="${c}CC"/><circle cx="40" cy="22" r="3" fill="${c}CC"/><circle cx="50" cy="22" r="3" fill="${c}CC"/><circle cx="60" cy="22" r="3" fill="${c}CC"/>` },
  { id: 'rounded', label: 'Redondo', path: (c) => `<ellipse cx="50" cy="28" rx="28" ry="26" fill="${c}" stroke="${c}99" stroke-width="2"/><ellipse cx="50" cy="18" rx="12" ry="4" fill="${c}CC"/>` },
  { id: 'slim', label: 'Delgado', path: (c) => `<rect x="35" y="0" width="30" height="55" rx="10" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="50" cy="15" r="5" fill="${c}CC"/><line x1="50" y1="25" x2="50" y2="40" stroke="${c}CC" stroke-width="2"/>` },
  { id: 'tank', label: 'Tanque', path: (c) => `<rect x="20" y="5" width="60" height="40" rx="6" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="15" y="40" width="70" height="12" rx="4" fill="${c}BB"/><circle cx="28" cy="46" r="5" fill="${c}99"/><circle cx="50" cy="46" r="5" fill="${c}99"/><circle cx="72" cy="46" r="5" fill="${c}99"/>` },
  { id: 'armor', label: 'Armadura', path: (c) => `<path d="M25,0 L75,0 L80,15 L80,40 L50,52 L20,40 L20,15 Z" fill="${c}" stroke="${c}99" stroke-width="2"/><path d="M40,6 L60,6 L58,18 L42,18 Z" fill="${c}CC"/><circle cx="50" cy="30" r="6" fill="${c}CC"/>` },
  { id: 'hexagon', label: 'Hexagonal', path: (c) => `<polygon points="50,0 80,12 80,40 50,52 20,40 20,12" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="50,8 68,16 68,36 50,44 32,36 32,16" fill="${c}CC" opacity="0.3"/>` },
  { id: 'barrel', label: 'Barril', path: (c) => `<ellipse cx="50" cy="5" rx="25" ry="8" fill="${c}CC" stroke="${c}99" stroke-width="1.5"/><rect x="25" y="5" width="50" height="42" fill="${c}" stroke="${c}99" stroke-width="2"/><ellipse cx="50" cy="47" rx="25" ry="8" fill="${c}" stroke="${c}99" stroke-width="2"/><line x1="30" y1="5" x2="30" y2="47" stroke="${c}99" stroke-width="1.5"/><line x1="50" y1="5" x2="50" y2="47" stroke="${c}99" stroke-width="1"/><line x1="70" y1="5" x2="70" y2="47" stroke="${c}99" stroke-width="1.5"/>` },
  { id: 'mech', label: 'Mech', path: (c) => `<rect x="22" y="0" width="56" height="50" rx="4" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="28" y="4" width="18" height="12" rx="2" fill="${c}CC"/><rect x="54" y="4" width="18" height="12" rx="2" fill="${c}CC"/><circle cx="37" cy="28" r="5" fill="${c}CC" stroke="${c}99" stroke-width="1"/><circle cx="63" cy="28" r="5" fill="${c}CC" stroke="${c}99" stroke-width="1"/><rect x="30" y="38" width="40" height="4" rx="2" fill="${c}99"/><rect x="38" y="44" width="24" height="4" rx="2" fill="${c}99"/>` },
];

const ACCESSORIES = [
  { id: 'none', label: 'Ninguno', path: () => `` },
  { id: 'antenna', label: 'Antena', path: (c) => `<line x1="50" y1="0" x2="50" y2="-20" stroke="${c}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="-24" r="5" fill="#FF4B4B"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/></circle>` },
  { id: 'propeller', label: 'Hélice', path: (c) => `<line x1="50" y1="0" x2="50" y2="-12" stroke="${c}" stroke-width="3"/><ellipse cx="50" cy="-16" rx="18" ry="4" fill="${c}88"><animateTransform attributeName="transform" type="rotate" from="0 50 -16" to="360 50 -16" dur="0.5s" repeatCount="indefinite"/></ellipse>` },
  { id: 'crown', label: 'Corona', path: () => `<polygon points="34,-2 38,-16 44,-6 50,-18 56,-6 62,-16 66,-2" fill="#FFC800" stroke="#E5A800" stroke-width="1.5"/><circle cx="44" cy="-10" r="2" fill="#FF4B4B"/><circle cx="50" cy="-14" r="2" fill="#1CB0F6"/><circle cx="56" cy="-10" r="2" fill="#58CC02"/>` },
  { id: 'bow', label: 'Moño', path: () => `<ellipse cx="38" cy="-4" rx="10" ry="7" fill="#FF6B9D"/><ellipse cx="62" cy="-4" rx="10" ry="7" fill="#FF6B9D"/><circle cx="50" cy="-2" r="4" fill="#FF4B6E"/>` },
  { id: 'headphones', label: 'Audífonos', path: () => `<path d="M22 35 Q22 8 50 8 Q78 8 78 35" fill="none" stroke="#555" stroke-width="4"/><rect x="16" y="28" width="12" height="16" rx="4" fill="#555"/><rect x="72" y="28" width="12" height="16" rx="4" fill="#555"/>` },
  { id: 'horns', label: 'Cuernos', path: () => `<path d="M30,4 Q24,-14 20,-8 Q23,-1 30,4" fill="#FF4444" stroke="#CC0000" stroke-width="1.5"/><path d="M70,4 Q76,-14 80,-8 Q77,-1 70,4" fill="#FF4444" stroke="#CC0000" stroke-width="1.5"/>` },
  { id: 'halo', label: 'Aureola', path: () => `<ellipse cx="50" cy="-10" rx="22" ry="6" fill="none" stroke="#FFD700" stroke-width="3"/><ellipse cx="50" cy="-10" rx="22" ry="6" fill="#FFD700" opacity="0.2"/>` },
  { id: 'cap', label: 'Gorra', path: () => `<path d="M26,14 Q26,-2 50,-2 Q74,-2 74,14" fill="#FF4444" stroke="#CC0000" stroke-width="1.5"/><rect x="22" y="12" width="56" height="6" rx="3" fill="#CC0000" stroke="#AA0000" stroke-width="1"/><ellipse cx="78" cy="8" rx="8" ry="4" fill="#CC0000"/>` },
  { id: 'flower', label: 'Flor', path: () => `<line x1="50" y1="4" x2="50" y2="-10" stroke="#22C55E" stroke-width="2"/><circle cx="50" cy="-14" r="3.5" fill="#FFD700"/><circle cx="46" cy="-18" rx="3.5" fill="#FF6B9D"/><circle cx="54" cy="-18" r="3.5" fill="#FF6B9D"/><circle cx="46" cy="-10" r="3.5" fill="#FF6B9D"/><circle cx="54" cy="-10" r="3.5" fill="#FF6B9D"/><circle cx="44" cy="-14" r="3.5" fill="#FF6B9D"/><circle cx="56" cy="-14" r="3.5" fill="#FF6B9D"/>` },
  { id: 'goggles', label: 'Goggles', path: () => `<path d="M26,28 Q26,18 50,18 Q74,18 74,28" fill="none" stroke="#555" stroke-width="3"/><circle cx="38" cy="28" r="8" fill="none" stroke="#555" stroke-width="3"/><circle cx="38" cy="28" r="6" fill="#88DDFF" opacity="0.5"/><circle cx="62" cy="28" r="8" fill="none" stroke="#555" stroke-width="3"/><circle cx="62" cy="28" r="6" fill="#88DDFF" opacity="0.5"/>` },
];

const ARMS = [
  { id: 'normal', label: 'Normal', path: (c) => `<rect x="4" y="72" width="14" height="30" rx="7" fill="${c}" stroke="${c}99" stroke-width="1.5" transform="rotate(-10 11 72)"/><rect x="82" y="72" width="14" height="30" rx="7" fill="${c}" stroke="${c}99" stroke-width="1.5" transform="rotate(10 89 72)"/>` },
  { id: 'claws', label: 'Garras', path: (c) => `<g transform="rotate(-10 11 72)"><rect x="4" y="72" width="14" height="24" rx="5" fill="${c}" stroke="${c}99" stroke-width="1.5"/><path d="M6,95 L5,103 L9,99 L11,105 L13,99 L17,103 L16,95" fill="${c}" stroke="${c}99" stroke-width="1"/></g><g transform="rotate(10 89 72)"><rect x="82" y="72" width="14" height="24" rx="5" fill="${c}" stroke="${c}99" stroke-width="1.5"/><path d="M84,95 L83,103 L87,99 L89,105 L91,99 L95,103 L94,95" fill="${c}" stroke="${c}99" stroke-width="1"/></g>` },
  { id: 'pincers', label: 'Pinzas', path: (c) => `<rect x="6" y="72" width="10" height="22" rx="5" fill="${c}" stroke="${c}99" stroke-width="1.5" transform="rotate(-10 11 72)"/><path d="M4,94 Q2,88 6,94 Q10,100 4,94" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(-10 11 72)"/><path d="M14,94 Q18,88 14,94 Q10,100 14,94" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(-10 11 72)"/><path d="M3,92 L7,100 M17,92 L13,100" stroke="${c}" stroke-width="2" transform="rotate(-10 11 72)"/><rect x="84" y="72" width="10" height="22" rx="5" fill="${c}" stroke="${c}99" stroke-width="1.5" transform="rotate(10 89 72)"/><path d="M81,92 L85,100 M95,92 L91,100" stroke="${c}" stroke-width="2" transform="rotate(10 89 72)"/>` },
  { id: 'muscles', label: 'Musculoso', path: (c) => `<path d="M4,72 Q-2,82 4,92 Q10,102 16,98 L18,72 Z" fill="${c}" stroke="${c}99" stroke-width="1.5" transform="rotate(-8 10 72)"/><path d="M82,72 L84,98 Q90,102 96,92 Q102,82 96,72 Z" fill="${c}" stroke="${c}99" stroke-width="1.5" transform="rotate(8 90 72)"/>` },
  { id: 'tentacles', label: 'Tentáculos', path: (c) => `<path d="M14,72 Q-2,85 8,95 Q18,105 6,115" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="6" cy="115" r="3" fill="${c}"/><path d="M86,72 Q102,85 92,95 Q82,105 94,115" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="94" cy="115" r="3" fill="${c}"/>` },
  { id: 'wings', label: 'Alas', path: (c) => `<path d="M18,74 Q-8,65 -5,85 Q0,102 18,95" fill="${c}88" stroke="${c}99" stroke-width="1.5"/><path d="M10,78 Q0,74 2,86 Q5,96 16,92" fill="${c}55" stroke="none"/><path d="M82,74 Q108,65 105,85 Q100,102 82,95" fill="${c}88" stroke="${c}99" stroke-width="1.5"/><path d="M90,78 Q100,74 98,86 Q95,96 84,92" fill="${c}55" stroke="none"/>` },
];

const LEGS = [
  { id: 'normal', label: 'Normal', path: (c) => `<rect x="32" y="115" width="14" height="15" rx="5" fill="${c}DD" stroke="${c}99" stroke-width="1.5"/><rect x="54" y="115" width="14" height="15" rx="5" fill="${c}DD" stroke="${c}99" stroke-width="1.5"/>` },
  { id: 'wheels', label: 'Ruedas', path: (c) => `<circle cx="36" cy="124" r="8" fill="#555" stroke="#333" stroke-width="2"/><circle cx="36" cy="124" r="3" fill="#888"/><circle cx="64" cy="124" r="8" fill="#555" stroke="#333" stroke-width="2"/><circle cx="64" cy="124" r="3" fill="#888"/>` },
  { id: 'treads', label: 'Orugas', path: (c) => `<rect x="24" y="116" width="20" height="14" rx="7" fill="#555" stroke="#333" stroke-width="1.5"/><rect x="56" y="116" width="20" height="14" rx="7" fill="#555" stroke="#333" stroke-width="1.5"/><line x1="28" y1="118" x2="28" y2="128" stroke="#777" stroke-width="1"/><line x1="34" y1="118" x2="34" y2="128" stroke="#777" stroke-width="1"/><line x1="40" y1="118" x2="40" y2="128" stroke="#777" stroke-width="1"/><line x1="60" y1="118" x2="60" y2="128" stroke="#777" stroke-width="1"/><line x1="66" y1="118" x2="66" y2="128" stroke="#777" stroke-width="1"/><line x1="72" y1="118" x2="72" y2="128" stroke="#777" stroke-width="1"/>` },
  { id: 'springs', label: 'Resortes', path: (c) => `<path d="M36,115 L32,118 L40,121 L32,124 L40,127 L36,130" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><rect x="32" y="128" width="8" height="4" rx="2" fill="${c}DD"/><path d="M64,115 L60,118 L68,121 L60,124 L68,127 L64,130" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><rect x="60" y="128" width="8" height="4" rx="2" fill="${c}DD"/>` },
  { id: 'hover', label: 'Flotador', path: (c) => `<ellipse cx="50" cy="126" rx="24" ry="4" fill="${c}44"/><ellipse cx="50" cy="122" rx="20" ry="3" fill="${c}88" stroke="${c}99" stroke-width="1"/><path d="M36,124 L38,130 L40,124" fill="#FF8800" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.5s" repeatCount="indefinite"/></path><path d="M48,124 L50,132 L52,124" fill="#FF6600" opacity="0.8"><animate attributeName="opacity" values="0.8;0.4;0.8" dur="0.4s" repeatCount="indefinite"/></path><path d="M60,124 L62,130 L64,124" fill="#FF8800" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.6s" repeatCount="indefinite"/></path>` },
  { id: 'spider', label: 'Araña', path: (c) => `<line x1="34" y1="115" x2="20" y2="128" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><line x1="40" y1="118" x2="28" y2="130" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><line x1="46" y1="118" x2="38" y2="130" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><line x1="66" y1="115" x2="80" y2="128" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><line x1="60" y1="118" x2="72" y2="130" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/><line x1="54" y1="118" x2="62" y2="130" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>` },
];

const PATTERNS = [
  { id: 'none', label: 'Ninguno', path: () => `` },
  { id: 'star_emblem', label: 'Estrella', path: () => `<polygon points="50,12 53,20 62,20 55,25 58,33 50,28 42,33 45,25 38,20 47,20" fill="#FFD700" stroke="#E5A800" stroke-width="1" opacity="0.9"/>` },
  { id: 'lightning', label: 'Rayo', path: () => `<polygon points="52,10 46,22 52,22 44,36 56,20 50,20 56,10" fill="#FFD700" stroke="#E5A800" stroke-width="0.5"/>` },
  { id: 'heart_emblem', label: 'Corazón', path: () => `<path d="M50,18 C50,14 44,10 40,14 C36,18 40,24 50,30 C60,24 64,18 60,14 C56,10 50,14 50,18Z" fill="#FF4B6E" stroke="#CC3355" stroke-width="1" opacity="0.85"/>` },
  { id: 'gear', label: 'Engranaje', path: () => `<circle cx="50" cy="22" r="8" fill="none" stroke="#FFD700" stroke-width="2.5"/><circle cx="50" cy="22" r="4" fill="#FFD700" opacity="0.5"/><rect x="48" y="12" width="4" height="4" rx="1" fill="#FFD700"/><rect x="48" y="28" width="4" height="4" rx="1" fill="#FFD700"/><rect x="40" y="20" width="4" height="4" rx="1" fill="#FFD700"/><rect x="56" y="20" width="4" height="4" rx="1" fill="#FFD700"/>` },
  { id: 'stripes', label: 'Rayas', path: (c) => `<line x1="30" y1="12" x2="30" y2="42" stroke="${c}44" stroke-width="3"/><line x1="40" y1="8" x2="40" y2="46" stroke="${c}44" stroke-width="3"/><line x1="60" y1="8" x2="60" y2="46" stroke="${c}44" stroke-width="3"/><line x1="70" y1="12" x2="70" y2="42" stroke="${c}44" stroke-width="3"/>` },
  { id: 'dots', label: 'Puntos', path: () => `<circle cx="38" cy="16" r="3" fill="white" opacity="0.4"/><circle cx="50" cy="14" r="2.5" fill="white" opacity="0.3"/><circle cx="62" cy="16" r="3" fill="white" opacity="0.4"/><circle cx="44" cy="28" r="2" fill="white" opacity="0.3"/><circle cx="56" cy="28" r="2" fill="white" opacity="0.3"/><circle cx="50" cy="38" r="2.5" fill="white" opacity="0.35"/>` },
  { id: 'circuit', label: 'Circuito', path: () => `<line x1="35" y1="15" x2="50" y2="15" stroke="#00FF88" stroke-width="1.5"/><line x1="50" y1="15" x2="50" y2="25" stroke="#00FF88" stroke-width="1.5"/><line x1="50" y1="25" x2="65" y2="25" stroke="#00FF88" stroke-width="1.5"/><line x1="65" y1="25" x2="65" y2="35" stroke="#00FF88" stroke-width="1.5"/><circle cx="35" cy="15" r="2" fill="#00FF88"/><circle cx="50" cy="25" r="2" fill="#00FF88"/><circle cx="65" cy="35" r="2" fill="#00FF88"/>` },
];

const COLORS = [
  { id: 'blue', hex: '#3B82F6', label: 'Azul' },
  { id: 'cyan', hex: '#06B6D4', label: 'Cian' },
  { id: 'indigo', hex: '#6366F1', label: 'Índigo' },
  { id: 'green', hex: '#22C55E', label: 'Verde' },
  { id: 'red', hex: '#EF4444', label: 'Rojo' },
  { id: 'orange', hex: '#F97316', label: 'Naranja' },
  { id: 'pink', hex: '#EC4899', label: 'Rosa' },
  { id: 'purple', hex: '#3B82F6', label: 'Morado' },
  { id: 'yellow', hex: '#EAB308', label: 'Amarillo' },
  { id: 'teal', hex: '#14B8A6', label: 'Turquesa' },
  { id: 'gray', hex: '#6B7280', label: 'Gris' },
  { id: 'gold', hex: '#D4A017', label: 'Dorado' },
  { id: 'lime', hex: '#84CC16', label: 'Lima' },
  { id: 'sky', hex: '#38BDF8', label: 'Cielo' },
  { id: 'crimson', hex: '#DC2626', label: 'Carmesí' },
  { id: 'mint', hex: '#34D399', label: 'Menta' },
];

// ============================================
// RENDER ROBOT SVG
// ============================================

export const RobotAvatar = ({ config, size = 120, animate = false }) => {
  if (!config) return null;

  // PNG skin mode: render image instead of SVG
  if (config.skinImage) {
    return (
      <img
        src={config.skinImage}
        alt="Robot Skin"
        width={size}
        height={size}
        className={animate ? 'animate-float' : ''}
        style={{ objectFit: 'contain', imageRendering: 'auto' }}
        draggable={false}
      />
    );
  }

  const head = HEADS.find(h => h.id === config.head) || HEADS[0];
  const eyes = EYES.find(e => e.id === config.eyes) || EYES[0];
  const mouth = MOUTHS.find(m => m.id === config.mouth) || MOUTHS[0];
  const body = BODIES.find(b => b.id === config.body) || BODIES[0];
  const acc = ACCESSORIES.find(a => a.id === config.accessory) || ACCESSORIES[0];
  const arm = ARMS.find(a => a.id === (config.arms || 'normal')) || ARMS[0];
  const leg = LEGS.find(l => l.id === (config.legs || 'normal')) || LEGS[0];
  const pat = PATTERNS.find(p => p.id === (config.pattern || 'none')) || PATTERNS[0];
  const color = COLORS.find(c => c.id === config.color)?.hex || '#3B82F6';

  return (
    <svg width={size} height={size} viewBox="0 0 100 130" className={animate ? 'animate-float' : ''}>
      {/* Arms */}
      <g dangerouslySetInnerHTML={{ __html: arm.path(color) }}/>
      {/* Body */}
      <g transform="translate(0, 65)">
        <g dangerouslySetInnerHTML={{ __html: body.path(color) }}/>
        <g dangerouslySetInnerHTML={{ __html: pat.path(color) }}/>
      </g>
      {/* Legs */}
      <g dangerouslySetInnerHTML={{ __html: leg.path(color) }}/>
      {/* Head */}
      <g transform="translate(0, 2)">
        <g dangerouslySetInnerHTML={{ __html: head.path(color) }}/>
        <g dangerouslySetInnerHTML={{ __html: eyes.path(color) }}/>
        <g dangerouslySetInnerHTML={{ __html: mouth.path(color) }}/>
      </g>
      {/* Accessory */}
      <g transform="translate(0, 8)">
        <g dangerouslySetInnerHTML={{ __html: acc.path(color) }}/>
      </g>
    </svg>
  );
};

// Mini version for nav/header
export const RobotMini = ({ config, size = 36 }) => {
  if (!config) return <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg">🤖</div>;

  // PNG skin mode
  if (config.skinImage) {
    return (
      <div className="rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-2 border-blue-200"
        style={{ width: size, height: size }}>
        <img src={config.skinImage} alt="Robot" width={size * 0.85} height={size * 0.85}
          style={{ objectFit: 'contain' }} draggable={false} />
      </div>
    );
  }

  return (
    <div className="rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-2 border-blue-200"
      style={{ width: size, height: size }}>
      <RobotAvatar config={config} size={size * 0.85} />
    </div>
  );
};

// ============================================
// STORY DATA
// ============================================

const STORY_CHAPTERS = [
  {
    id: 'awakening',
    title: 'El Despertar',
    description: 'Tu robot acaba de despertar en el Laboratorio de CultivaTec. No sabe nada del mundo... ¡pero contigo va a aprender todo!',
    unlockAt: 0, // modules completed
    emoji: '🌟'
  },
  {
    id: 'first_spark',
    title: 'La Primera Chispa',
    description: '¡Tu robot descubrió la electricidad! Aprendió que los electrones son pequeñas partículas que le dan energía. Ahora puede encender su luz interior.',
    unlockAt: 1,
    emoji: '⚡'
  },
  {
    id: 'circuit_path',
    title: 'El Camino de los Circuitos',
    description: 'Tu robot aprendió a construir circuitos. Ahora puede conectar cables y hacer que la energía fluya. ¡Está creciendo!',
    unlockAt: 3,
    emoji: '🔌'
  },
  {
    id: 'code_language',
    title: 'El Lenguaje Secreto',
    description: 'Tu robot descubrió Python, el lenguaje de los robots. Ahora puede entender instrucciones y seguir órdenes programadas.',
    unlockAt: 5,
    emoji: '💻'
  },
  {
    id: 'sensor_eyes',
    title: 'Los Ojos del Robot',
    description: 'Tu robot aprendió sobre sensores. Ahora puede "ver" la luz, "sentir" la distancia y percibir el mundo a su alrededor.',
    unlockAt: 7,
    emoji: '👁️'
  },
  {
    id: 'movement',
    title: 'Los Primeros Pasos',
    description: 'Tu robot aprendió a moverse con motores. Ya puede caminar, girar y explorar. ¡Es casi independiente!',
    unlockAt: 9,
    emoji: '🦿'
  },
  {
    id: 'intelligence',
    title: 'El Cerebro Despierta',
    description: 'Tu robot ahora tiene inteligencia artificial básica. Puede tomar decisiones simples por sí mismo. ¡Estás creando vida!',
    unlockAt: 11,
    emoji: '🧠'
  },
  {
    id: 'graduation',
    title: 'El Ingeniero Graduado',
    description: '¡Tu robot completó todo su entrenamiento! Ahora es un robot completo que sabe de electricidad, circuitos, programación y sensores. ¡Lo lograste!',
    unlockAt: 13,
    emoji: '🎓'
  }
];

// ============================================
// Robot Welcome Story — Interactive dialogue
// ============================================

const ROBOT_DIALOGUE = [
  {
    id: 'wake',
    emoji: '✨',
    getText: (name, user) => `*bzzz... bip bip...* ¿Dónde... dónde estoy? Ah... ¡Hola! Mi nombre es ${name}. ¡Acabo de despertar en el Laboratorio de CultivaTec!`,
  },
  {
    id: 'confused',
    emoji: '🤔',
    getText: (name, user) => `Mmm... parece que no sé mucho todavía. No entiendo qué es la electricidad, ni cómo funcionan los circuitos, ni nada de programación... ¡Necesito un maestro!`,
  },
  {
    id: 'you',
    emoji: '🌟',
    getText: (name, user) => `¡Espera! ¿Tú eres ${user}? El profesor me dijo que vendrías. ¡Tú vas a ser mi maestro! Juntos vamos a aprender de todo.`,
  },
  {
    id: 'mission',
    emoji: '🎯',
    getText: (name, user) => `Tu misión es completar las lecciones de la Biblioteca. Cada módulo que completes me enseñará algo nuevo: electricidad, circuitos, sensores, programación...`,
  },
  {
    id: 'features',
    emoji: '🛠️',
    getText: (name, user) => `¡Hay mucho por explorar! Puedes practicar código en el Taller, resolver retos de programación, simular robots, construir circuitos virtuales y hasta ganar trofeos. ¡Ah, y puedes cambiar mi apariencia cuando quieras tocándome en la pantalla!`,
  },
  {
    id: 'ready',
    emoji: '🚀',
    getText: (name, user) => `¡Estoy listo, ${user}! Con cada lección que completes, yo creceré y me haré más fuerte. ¿Empezamos esta aventura juntos? ¡Vamos a ser los mejores del laboratorio!`,
  },
];

const RobotWelcomeStory = ({ robotConfig, robotName, userName, onComplete }) => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  
  const currentDialogue = ROBOT_DIALOGUE[dialogueIndex];
  const fullText = currentDialogue.getText(robotName, userName);
  const isLast = dialogueIndex === ROBOT_DIALOGUE.length - 1;

  // Typewriter effect
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [dialogueIndex, fullText]);

  const handleNext = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }
    if (isLast) {
      onComplete();
    } else {
      setDialogueIndex(prev => prev + 1);
    }
  };

  return (
    <div className="text-center max-w-md animate-scale-in w-full">
      {/* Robot with speech bubble effect */}
      <div className="relative mb-2">
        <div className="w-36 h-36 mx-auto bg-white/10 backdrop-blur rounded-3xl border-2 border-cyan-400/50 flex items-center justify-center p-2">
          <RobotAvatar config={robotConfig} size={120} animate />
        </div>
        {/* Animated particles around robot */}
        <div className="absolute -top-2 -right-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>✨</div>
        <div className="absolute -top-1 -left-3 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>⚡</div>
        <div className="absolute bottom-2 -right-3 text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>💫</div>
      </div>

      {/* Robot name badge */}
      <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full px-4 py-1 mb-4">
        <span className="text-lg">{currentDialogue.emoji}</span>
        <span className="text-sm font-black text-cyan-300">{robotName} dice...</span>
      </div>

      {/* Speech bubble */}
      <div className="relative bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 mb-4 text-left min-h-[120px]">
        {/* Speech triangle */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 border-l border-t border-white/20 transform rotate-45"></div>
        
        <p className="text-blue-100 leading-relaxed text-sm font-semibold">
          {displayedText}
          {isTyping && <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse align-middle"></span>}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {ROBOT_DIALOGUE.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
            i === dialogueIndex ? 'w-6 bg-cyan-400' : i < dialogueIndex ? 'w-3 bg-blue-500' : 'w-3 bg-white/20'
          }`}/>
        ))}
      </div>

      {/* Action button */}
      <button onClick={handleNext}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
        {isTyping ? (
          <>Saltar ▸▸</>
        ) : isLast ? (
          <><Sparkles size={22}/> ¡Comenzar la Aventura!</>
        ) : (
          <>Siguiente <ChevronRight size={22}/></>
        )}
      </button>
    </div>
  );
};

// ============================================
// Onboarding Component
// ============================================

const OnboardingScreen = ({ onComplete, firebaseProfile }) => {
  const [step, setStep] = useState(0); // 0=welcome, 1=robot builder, 2=story intro
  const userName = firebaseProfile?.username || 'Explorador';
  const fullName = firebaseProfile?.fullName || userName;
  const [robotConfig, setRobotConfig] = useState({
    skinImage: '/skin.png'
  });
  const [robotName, setRobotName] = useState('');
  const [selectedSkin, setSelectedSkin] = useState(null);

  const handleComplete = () => {
    onComplete({
      userName,
      fullName,
      userAge: '10',
      robotConfig,
      robotName: robotName.trim() || 'Sparky'
    });
  };

  const randomize = () => {
    const randomSkin = ROBOT_SKINS_ONBOARDING[Math.floor(Math.random() * ROBOT_SKINS_ONBOARDING.length)];
    setSelectedSkin(randomSkin.id);
    setRobotConfig({ ...randomSkin.config });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E40AF] via-[#3B82F6] to-[#1E3A8A] text-white flex flex-col">
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*3}s`, opacity: 0.3 + Math.random()*0.7 }}/>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center max-w-md animate-scale-in">
            <div className="w-28 h-28 mx-auto mb-6 bg-white/10 backdrop-blur rounded-3xl p-3 border border-white/20">
              <img src="/logo-v2.png" alt="CultivaTec" className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; }}/>
            </div>
            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              ¡Bienvenido a CultivaTec!
            </h1>
            <p className="text-blue-200 text-lg mb-4 leading-relaxed">
              Una aventura donde aprenderás <span className="font-black text-cyan-300">robótica, electrónica y programación</span> mientras construyes tu propio compañero robot.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: '⚡', label: 'Electricidad', desc: 'Aprende cómo funciona' },
                { icon: '🔌', label: 'Circuitos', desc: 'Construye circuitos' },
                { icon: '🤖', label: 'Robots', desc: 'Crea tu robot' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-blue-300">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-blue-300/80 text-sm mb-6">
              En CultivaTec, todos pueden aprender robótica sin importar la edad ni la experiencia. 
              Cada lección es una aventura y tú eres el héroe.
            </p>
            <button onClick={() => setStep(1)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95 flex items-center justify-center gap-2">
              ¡Crear mi Robot! <ChevronRight size={24}/>
            </button>
          </div>
        )}
        {/* Step 1: Robot Builder - Skins Only */}
        {step === 1 && (
          <div className="max-w-lg w-full animate-scale-in">
            {/* Header */}
            <div className="text-center mb-3">
              <h2 className="text-2xl font-black mb-1">🤖 Elige tu Robot Compañero</h2>
              <p className="text-blue-300 text-sm">Selecciona una skin para tu robot — ¡hay {ROBOT_SKINS_ONBOARDING.length} para elegir!</p>
            </div>

            {/* Robot Preview with Pedestal */}
            <div className="flex flex-col items-center mb-3">
              <div className="relative">
                {/* Glow effect behind robot */}
                <div className="absolute inset-0 rounded-3xl blur-xl opacity-30"
                  style={{ background: `radial-gradient(circle, #3B82F688, transparent 70%)` }}/>
                <div className="relative w-44 h-44 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur rounded-3xl border-2 border-white/20 flex items-center justify-center p-2 shadow-2xl">
                  <RobotAvatar config={robotConfig} size={140} animate />
                </div>
                {/* Randomize button */}
                <button onClick={randomize}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 hover:from-yellow-300 hover:to-orange-300 transition-all active:scale-90"
                  title="Aleatorio">
                  <RotateCcw size={17} className="text-yellow-900"/>
                </button>
              </div>
              {/* Pedestal */}
              <div className="w-32 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full mt-1"/>
            </div>

            {/* Robot Name */}
            <div className="flex items-center gap-2 mb-3">
              <input type="text" value={robotName} onChange={e => setRobotName(e.target.value)}
                placeholder="Nombre de tu robot..."
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 border-2 border-white/20 text-white text-center font-bold placeholder-white/30 outline-none focus:border-cyan-400 transition-colors text-sm"
                maxLength={16}/>
              <button onClick={randomize}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all whitespace-nowrap flex items-center gap-1">
                🎲 Random
              </button>
            </div>

            {/* Skins Grid */}
            <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10 mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <div className="grid grid-cols-3 gap-2">
                {ROBOT_SKINS_ONBOARDING.map(skin => {
                  const isSkinSelected = selectedSkin === skin.id;
                  return (
                    <button key={skin.id}
                      onClick={() => {
                        setSelectedSkin(skin.id);
                        setRobotConfig({ ...skin.config });
                      }}
                      className={`relative flex flex-col items-center py-2 px-1 rounded-xl transition-all
                        ${isSkinSelected 
                          ? 'bg-blue-500/30 ring-2 ring-cyan-400 scale-[1.03]' 
                          : 'bg-white/5 hover:bg-white/10 active:scale-95'}`}>
                      <div className="absolute top-0.5 right-0.5 text-[7px] font-black px-1 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: skin.rarityColor }}>
                        {skin.rarity === 'legendary' ? '★★★' : skin.rarity === 'epic' ? '★★' : skin.rarity === 'rare' ? '★' : ''}
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center">
                        <RobotAvatar config={skin.config} size={45} />
                      </div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <span className="text-xs">{skin.icon}</span>
                        <span className="text-[9px] font-bold leading-tight">{skin.name}</span>
                      </div>
                      {isSkinSelected && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                <ChevronLeft size={18}/> Atrás
              </button>
              <button onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Sparkles size={16}/> ¡Listo!
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Story intro — Robot speaks! */}
        {step === 2 && (
          <RobotWelcomeStory 
            robotConfig={robotConfig} 
            robotName={robotName || 'Sparky'} 
            userName={userName} 
            onComplete={handleComplete}
          />
        )}

        {/* Step indicators */}
        <div className="flex gap-2 mt-8">
          {[0,1,2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-cyan-400' : i < step ? 'w-4 bg-blue-500' : 'w-4 bg-white/20'}`}/>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Story Progress Component (for Library header)
// ============================================

export const StoryProgress = ({ modulesCompleted = 0, robotConfig, robotName, userName }) => {
  const currentChapter = [...STORY_CHAPTERS].reverse().find(ch => modulesCompleted >= ch.unlockAt) || STORY_CHAPTERS[0];
  const nextChapter = STORY_CHAPTERS.find(ch => modulesCompleted < ch.unlockAt);
  const [showStory, setShowStory] = useState(false);

  return (
    <>
      <div onClick={() => setShowStory(true)}
        className="bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] rounded-2xl p-3 mx-4 mt-3 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border border-blue-400/30">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
          <RobotAvatar config={robotConfig} size={40}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{currentChapter.emoji}</span>
            <span className="text-xs font-black text-white truncate">{currentChapter.title}</span>
          </div>
          {nextChapter && (
            <div className="mt-1">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(((modulesCompleted-currentChapter.unlockAt)/(nextChapter.unlockAt-currentChapter.unlockAt))*100, 100)}%` }}/>
              </div>
              <p className="text-[10px] text-blue-300 mt-0.5">Siguiente: {nextChapter.emoji} {nextChapter.title}</p>
            </div>
          )}
          {!nextChapter && <p className="text-[10px] text-yellow-300 font-bold">🎓 ¡Historia completada!</p>}
        </div>
        <ChevronRight size={16} className="text-blue-300 flex-shrink-0"/>
      </div>

      {/* Story Modal */}
      {showStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowStory(false)}>
          <div className="bg-gradient-to-b from-[#0F172A] to-[#1E3A5F] rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-white/20 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="p-5 text-center border-b border-white/10">
              <div className="w-20 h-20 mx-auto mb-2 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <RobotAvatar config={robotConfig} size={65} animate/>
              </div>
              <h2 className="text-xl font-black text-white">La Historia de {robotName || 'Sparky'}</h2>
              <p className="text-blue-300 text-xs">Maestro: {userName || 'Explorador'}</p>
            </div>
            <div className="p-4 space-y-3">
              {STORY_CHAPTERS.map((ch, i) => {
                const unlocked = modulesCompleted >= ch.unlockAt;
                const isCurrent = ch === currentChapter;
                return (
                  <div key={ch.id} className={`rounded-xl p-3 transition-all ${unlocked ? 'bg-white/10' : 'bg-white/5 opacity-50'}
                    ${isCurrent ? 'ring-2 ring-cyan-400 bg-cyan-500/10' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{ch.emoji}</span>
                      <span className={`text-sm font-black ${unlocked ? 'text-white' : 'text-white/50'}`}>Cap. {i+1}: {ch.title}</span>
                      {isCurrent && <span className="text-[10px] bg-cyan-500 text-white px-2 py-0.5 rounded-full font-bold ml-auto">ACTUAL</span>}
                    </div>
                    {unlocked ? (
                      <p className="text-blue-200 text-xs leading-relaxed">{ch.description}</p>
                    ) : (
                      <p className="text-white/30 text-xs">🔒 Completa {ch.unlockAt} módulos para desbloquear</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/10">
              <button onClick={() => setShowStory(false)}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { OnboardingScreen, STORY_CHAPTERS, HEADS, EYES, MOUTHS, BODIES, ACCESSORIES, ARMS, LEGS, PATTERNS, COLORS };
export default OnboardingScreen;
