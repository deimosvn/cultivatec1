import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Zap, ArrowLeft, Play, RotateCcw,
  Trophy, Star, HelpCircle, ChevronRight,
  Check, X, Sparkles, Target, Lock, Info, BookOpen, Eye, Trash2
} from 'lucide-react';

// ============================================
// SVG ILLUSTRATIONS FOR COMPONENTS
// ============================================

const BatterySVG = ({ size = 64, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      {glow && <filter id="batteryGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
    </defs>
    <rect x="8" y="16" width="40" height="32" rx="4" fill="#FF6B35" stroke="#CC4A1A" strokeWidth="2" filter={glow ? "url(#batteryGlow)" : undefined}/>
    <rect x="48" y="24" width="8" height="16" rx="2" fill="#CC4A1A"/>
    <text x="18" y="30" fill="white" fontSize="10" fontWeight="bold">9V</text>
    <text x="12" y="42" fill="white" fontSize="8" fontWeight="bold">+ −</text>
    <line x1="14" y1="26" x2="20" y2="26" stroke="white" strokeWidth="2"/>
    <line x1="17" y1="23" x2="17" y2="29" stroke="white" strokeWidth="2"/>
    <line x1="32" y1="26" x2="38" y2="26" stroke="white" strokeWidth="2"/>
  </svg>
);

const LedSVG = ({ size = 64, color = '#FF4B4B', glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      {glow && (
        <filter id={`ledGlow-${color.replace('#','')}`}>
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      )}
      <radialGradient id={`ledGrad-${color.replace('#','')}`}>
        <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
        <stop offset="50%" stopColor={color} stopOpacity="0.9"/>
        <stop offset="100%" stopColor={color}/>
      </radialGradient>
    </defs>
    {/* LED dome */}
    <ellipse cx="32" cy="24" rx="16" ry="18" fill={`url(#ledGrad-${color.replace('#','')})`}
      stroke={color} strokeWidth="2" filter={glow ? `url(#ledGlow-${color.replace('#','')})` : undefined}
      opacity={glow ? 1 : 0.8}/>
    {/* LED base */}
    <rect x="22" y="40" width="20" height="6" rx="1" fill="#888" stroke="#666" strokeWidth="1"/>
    {/* Legs */}
    <line x1="26" y1="46" x2="26" y2="58" stroke="#AAA" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="38" y1="46" x2="38" y2="58" stroke="#AAA" strokeWidth="2.5" strokeLinecap="round"/>
    <text x="23" y="57" fill="#666" fontSize="7" fontWeight="bold">+</text>
    <text x="36" y="57" fill="#666" fontSize="7" fontWeight="bold">−</text>
    {/* Glow rays */}
    {glow && <>
      <line x1="32" y1="2" x2="32" y2="6" stroke={color} strokeWidth="2" opacity="0.6"/>
      <line x1="16" y1="10" x2="13" y2="7" stroke={color} strokeWidth="2" opacity="0.6"/>
      <line x1="48" y1="10" x2="51" y2="7" stroke={color} strokeWidth="2" opacity="0.6"/>
      <line x1="10" y1="24" x2="6" y2="24" stroke={color} strokeWidth="2" opacity="0.6"/>
      <line x1="54" y1="24" x2="58" y2="24" stroke={color} strokeWidth="2" opacity="0.6"/>
    </>}
  </svg>
);

const ResistorSVG = ({ size = 64 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 80 32">
    {/* Wires */}
    <line x1="0" y1="16" x2="16" y2="16" stroke="#AAA" strokeWidth="3" strokeLinecap="round"/>
    <line x1="64" y1="16" x2="80" y2="16" stroke="#AAA" strokeWidth="3" strokeLinecap="round"/>
    {/* Body - zig zag style */}
    <polygon points="16,6 64,6 64,26 16,26" fill="#E8D5B7" stroke="#A0522D" strokeWidth="2"/>
    {/* Color bands */}
    <rect x="22" y="6" width="5" height="20" fill="#FF0000" rx="1"/>
    <rect x="30" y="6" width="5" height="20" fill="#FF0000" rx="1"/>
    <rect x="38" y="6" width="5" height="20" fill="#8B4513" rx="1"/>
    <rect x="52" y="6" width="5" height="20" fill="#FFD700" rx="1"/>
    {/* Text */}
    <text x="25" y="30" fill="#A0522D" fontSize="5" fontWeight="bold">220Ω</text>
  </svg>
);

const SwitchSVG = ({ size = 64, isOn = true }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 70 40">
    {/* Base */}
    <rect x="8" y="12" width="54" height="16" rx="8" fill={isOn ? '#DEF7EC' : '#FDE8E8'} stroke={isOn ? '#22C55E' : '#EF4444'} strokeWidth="2"/>
    {/* Contact points */}
    <circle cx="18" cy="20" r="5" fill="#888" stroke="#666" strokeWidth="1.5"/>
    <circle cx="52" cy="20" r="5" fill="#888" stroke="#666" strokeWidth="1.5"/>
    {/* Toggle lever */}
    <line x1="18" y1="20" x2={isOn ? "52" : "35"} y2={isOn ? "20" : "8"} stroke={isOn ? '#22C55E' : '#EF4444'} strokeWidth="3" strokeLinecap="round"/>
    {/* Wires */}
    <line x1="0" y1="20" x2="13" y2="20" stroke="#AAA" strokeWidth="3" strokeLinecap="round"/>
    <line x1="57" y1="20" x2="70" y2="20" stroke="#AAA" strokeWidth="3" strokeLinecap="round"/>
    {/* Label */}
    <text x={isOn ? "27" : "25"} y="38" fill={isOn ? '#22C55E' : '#EF4444'} fontSize="8" fontWeight="bold">{isOn ? "ON" : "OFF"}</text>
  </svg>
);

const MotorSVG = ({ size = 64, spinning = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <linearGradient id="motorGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
    </defs>
    {/* Motor body */}
    <circle cx="32" cy="32" r="22" fill="url(#motorGrad)" stroke="#5B21B6" strokeWidth="2"/>
    {/* Axle */}
    <circle cx="32" cy="32" r="6" fill="#DDD" stroke="#999" strokeWidth="2"/>
    {/* Shaft */}
    <rect x="30" y="2" width="4" height="12" rx="2" fill="#999"/>
    {/* Rotation marks */}
    <g style={{ transformOrigin: '32px 32px' }} className={spinning ? 'animate-spin' : ''}>
      <line x1="32" y1="14" x2="32" y2="20" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="44" y1="20" x2="40" y2="24" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="50" y1="32" x2="44" y2="32" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="44" y1="44" x2="40" y2="40" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="32" y1="50" x2="32" y2="44" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="20" y1="44" x2="24" y2="40" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="14" y1="32" x2="20" y2="32" stroke="white" strokeWidth="2" opacity="0.5"/>
      <line x1="20" y1="20" x2="24" y2="24" stroke="white" strokeWidth="2" opacity="0.5"/>
    </g>
    {/* Terminals */}
    <rect x="12" y="52" width="8" height="4" rx="1" fill="#EF4444"/>
    <rect x="44" y="52" width="8" height="4" rx="1" fill="#333"/>
    <text x="13" y="63" fill="#EF4444" fontSize="7" fontWeight="bold">+</text>
    <text x="46" y="63" fill="#333" fontSize="7" fontWeight="bold">−</text>
  </svg>
);

const BuzzerSVG = ({ size = 64, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {/* Body */}
    <circle cx="32" cy="30" r="20" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5"/>
    <circle cx="32" cy="30" r="12" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
    <circle cx="32" cy="30" r="5" fill="#F59E0B"/>
    {/* Sound hole pattern */}
    <circle cx="32" cy="26" r="1.5" fill="#D97706"/>
    <circle cx="28" cy="30" r="1.5" fill="#D97706"/>
    <circle cx="36" cy="30" r="1.5" fill="#D97706"/>
    <circle cx="32" cy="34" r="1.5" fill="#D97706"/>
    {/* Legs */}
    <line x1="24" y1="50" x2="24" y2="60" stroke="#AAA" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="40" y1="50" x2="40" y2="60" stroke="#AAA" strokeWidth="2.5" strokeLinecap="round"/>
    <text x="21" y="59" fill="#666" fontSize="7" fontWeight="bold">+</text>
    <text x="38" y="59" fill="#666" fontSize="7" fontWeight="bold">−</text>
    {/* Sound waves when active */}
    {active && <>
      <path d="M55 22 Q60 30 55 38" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="0.5s" repeatCount="indefinite"/>
      </path>
      <path d="M59 18 Q66 30 59 42" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0;0.4" dur="0.5s" repeatCount="indefinite" begin="0.15s"/>
      </path>
    </>}
  </svg>
);

const SensorSVG = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {/* Body */}
    <rect x="12" y="10" width="40" height="34" rx="6" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2"/>
    {/* Eye/sensor */}
    <circle cx="32" cy="24" r="10" fill="white" stroke="#EC4899" strokeWidth="2"/>
    <circle cx="32" cy="24" r="5" fill="#EC4899"/>
    <circle cx="34" cy="22" r="2" fill="white" opacity="0.6"/>
    {/* Detection waves */}
    <path d="M10 20 Q4 27 10 34" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2"/>
    <path d="M54 20 Q60 27 54 34" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 2"/>
    {/* Pins */}
    <line x1="20" y1="44" x2="20" y2="58" stroke="#AAA" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="44" x2="32" y2="58" stroke="#AAA" strokeWidth="2" strokeLinecap="round"/>
    <line x1="44" y1="44" x2="44" y2="58" stroke="#AAA" strokeWidth="2" strokeLinecap="round"/>
    <text x="17" y="57" fill="#EC4899" fontSize="6" fontWeight="bold">V</text>
    <text x="29" y="57" fill="#888" fontSize="6" fontWeight="bold">G</text>
    <text x="41" y="57" fill="#3B82F6" fontSize="6" fontWeight="bold">S</text>
  </svg>
);

const ArduinoSVG = ({ size = 80, glow = false }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 72">
    <defs>
      {glow && <filter id="arduinoGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
    </defs>
    {/* PCB */}
    <rect x="4" y="4" width="92" height="64" rx="6" fill="#0EA5E9" stroke="#0284C7" strokeWidth="2"
      filter={glow ? "url(#arduinoGlow)" : undefined}/>
    {/* USB connector */}
    <rect x="0" y="20" width="12" height="24" rx="2" fill="#CCC" stroke="#999" strokeWidth="1"/>
    {/* Chip */}
    <rect x="35" y="18" width="30" height="28" rx="2" fill="#222" stroke="#111" strokeWidth="1"/>
    <circle cx="42" cy="32" r="2" fill="#555"/>
    {/* Pin headers */}
    {[14, 22, 30, 38, 46].map((y, i) => (
      <React.Fragment key={`left-${i}`}>
        <rect x="12" y={y} width="6" height="4" rx="1" fill="#FFD700"/>
      </React.Fragment>
    ))}
    {[14, 22, 30, 38, 46].map((y, i) => (
      <React.Fragment key={`right-${i}`}>
        <rect x="82" y={y} width="6" height="4" rx="1" fill="#FFD700"/>
      </React.Fragment>
    ))}
    {/* Labels */}
    <text x="14" y="12" fill="white" fontSize="5" fontWeight="bold">V+</text>
    <text x="14" y="56" fill="white" fontSize="5" fontWeight="bold">GND</text>
    <text x="72" y="12" fill="white" fontSize="5" fontWeight="bold">D2</text>
    <text x="72" y="28" fill="white" fontSize="5" fontWeight="bold">D3</text>
    <text x="72" y="44" fill="white" fontSize="5" fontWeight="bold">D4</text>
    {/* LED on board */}
    <circle cx="70" cy="50" r="3" fill="#58CC02">
      {glow && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>}
    </circle>
    <text x="35" y="66" fill="white" fontSize="7" fontWeight="bold">ARDUINO</text>
  </svg>
);

// ============================================
// COMPONENT LIBRARY
// ============================================

const COMPONENTS = {
  battery: {
    id: 'battery',
    name: 'Batería 9V',
    emoji: '🔋',
    color: '#FF6B35',
    width: 90,
    height: 60,
    renderSVG: (props) => <BatterySVG {...props} />,
    pins: [
      { id: 'pos', x: 0, y: 30, type: 'power+', label: '+' },
      { id: 'neg', x: 90, y: 30, type: 'power-', label: '−' }
    ],
    shortDesc: 'Da energía al circuito',
    description: '¡La batería es como el corazón del circuito! Empuja a los electrones (pequeñas partículas de energía) para que se muevan por los cables, como el agua que fluye por una tubería.',
    funFact: '🧪 ¿Sabías que? La primera batería la inventó Alessandro Volta en 1800 usando discos de zinc y cobre con tela mojada en medio.',
    learningTip: '⚡ El signo + es el polo positivo (donde sale la energía) y el − es el negativo (donde regresa).',
    category: 'energía',
    voltage: 9
  },
  led_red: {
    id: 'led_red',
    name: 'LED Rojo',
    emoji: '🔴',
    color: '#FF4B4B',
    width: 60,
    height: 65,
    renderSVG: (props) => <LedSVG color="#FF4B4B" {...props} />,
    pins: [
      { id: 'anode', x: 0, y: 32, type: 'input+', label: '+' },
      { id: 'cathode', x: 60, y: 32, type: 'output-', label: '−' }
    ],
    shortDesc: 'Luz roja que brilla',
    description: 'LED significa "Diodo Emisor de Luz". Es como una bombillita muy pequeña que brilla cuando pasa electricidad por ella. ¡Los LEDs rojos se usan en semáforos y luces de freno!',
    funFact: '💡 ¿Sabías que? Los LEDs gastan 10 veces menos energía que un foco normal. ¡Por eso tus juguetes duran más con pilas!',
    learningTip: '🔌 La patita larga (+) siempre va al lado positivo de la batería. Si lo conectas al revés, ¡no se enciende!',
    category: 'salida',
    minVoltage: 1.8,
    maxVoltage: 3.3
  },
  led_green: {
    id: 'led_green',
    name: 'LED Verde',
    emoji: '🟢',
    color: '#58CC02',
    width: 60,
    height: 65,
    renderSVG: (props) => <LedSVG color="#58CC02" {...props} />,
    pins: [
      { id: 'anode', x: 0, y: 32, type: 'input+', label: '+' },
      { id: 'cathode', x: 60, y: 32, type: 'output-', label: '−' }
    ],
    shortDesc: 'Luz verde indicadora',
    description: 'El LED verde se usa para indicar que algo está funcionando bien, como la lucecita verde del cargador de tu tablet o el semáforo cuando puedes cruzar.',
    funFact: '🌱 ¿Sabías que? Los LEDs verdes se inventaron en 1962. ¡Son más viejos que tus papás probablemente!',
    learningTip: '✅ En robótica, el LED verde se usa mucho para mostrar que un sensor detectó algo correctamente.',
    category: 'salida',
    minVoltage: 1.8,
    maxVoltage: 3.5
  },
  led_blue: {
    id: 'led_blue',
    name: 'LED Azul',
    emoji: '🔵',
    color: '#1CB0F6',
    width: 60,
    height: 65,
    renderSVG: (props) => <LedSVG color="#1CB0F6" {...props} />,
    pins: [
      { id: 'anode', x: 0, y: 32, type: 'input+', label: '+' },
      { id: 'cathode', x: 60, y: 32, type: 'output-', label: '−' }
    ],
    shortDesc: 'Luz azul brillante',
    description: 'El LED azul fue el más difícil de inventar. ¡Tardaron 30 años! Es tan especial que al científico que lo logró le dieron el Premio Nobel.',
    funFact: '🏆 ¿Sabías que? Shuji Nakamura ganó el Premio Nobel de Física en 2014 por inventar el LED azul.',
    learningTip: '🎨 Mezclando LEDs rojo, verde y azul (RGB) puedes crear ¡cualquier color! Así funcionan las pantallas de TV.',
    category: 'salida',
    minVoltage: 2.5,
    maxVoltage: 3.7
  },
  resistor: {
    id: 'resistor',
    name: 'Resistencia 220Ω',
    emoji: '🟫',
    color: '#A0522D',
    width: 80,
    height: 40,
    renderSVG: (props) => <ResistorSVG {...props} />,
    pins: [
      { id: 'in', x: 0, y: 20, type: 'any', label: '' },
      { id: 'out', x: 80, y: 20, type: 'any', label: '' }
    ],
    shortDesc: 'Controla la corriente',
    description: 'La resistencia es como un guardia de tránsito para los electrones. No los deja pasar todos de golpe, así protege a los LEDs y otros componentes de recibir demasiada energía.',
    funFact: '🌈 ¿Sabías que? Las bandas de colores en la resistencia son un código secreto que dice cuánta resistencia tiene. ¡Los ingenieros memorizan los colores!',
    learningTip: '🛡️ SIEMPRE pon una resistencia antes de un LED. Sin ella, el LED recibe mucha corriente y ¡se puede quemar!',
    category: 'protección',
    resistance: 220
  },
  switch_comp: {
    id: 'switch_comp',
    name: 'Interruptor',
    emoji: '🔘',
    color: '#6B7280',
    width: 70,
    height: 45,
    renderSVG: (props) => <SwitchSVG {...props} />,
    pins: [
      { id: 'in', x: 0, y: 22, type: 'any', label: '' },
      { id: 'out', x: 70, y: 22, type: 'any', label: '' }
    ],
    shortDesc: 'Abre y cierra el circuito',
    description: 'El interruptor es como una puerta para la electricidad. Cuando está cerrado (ON), los electrones pueden pasar. Cuando está abierto (OFF), el camino se corta y todo se apaga.',
    funFact: '🏠 ¿Sabías que? El interruptor de la luz de tu cuarto funciona exactamente igual. Cuando lo presionas, abres o cierras el camino de la electricidad.',
    learningTip: '🎮 En robótica, los botones son un tipo de interruptor. Cuando presionas un botón del control, ¡cierras un circuito!',
    category: 'control',
    isSwitch: true
  },
  motor: {
    id: 'motor',
    name: 'Motor DC',
    emoji: '⚙️',
    color: '#8B5CF6',
    width: 70,
    height: 70,
    renderSVG: (props) => <MotorSVG {...props} />,
    pins: [
      { id: 'pos', x: 0, y: 35, type: 'input+', label: '+' },
      { id: 'neg', x: 70, y: 35, type: 'output-', label: '−' }
    ],
    shortDesc: 'Gira con electricidad',
    description: 'El motor convierte energía eléctrica en movimiento giratorio. ¡Es el músculo de los robots! Cuando la electricidad pasa, un imán interior hace que el eje gire rapidísimo.',
    funFact: '🤖 ¿Sabías que? Un robot típico tiene entre 2 y 20 motores. ¡Un robot humanoide puede tener más de 40!',
    learningTip: '🔄 Si cambias la dirección de la corriente (intercambias + y −), ¡el motor gira para el otro lado!',
    category: 'salida',
    minVoltage: 3,
    maxVoltage: 12
  },
  buzzer: {
    id: 'buzzer',
    name: 'Buzzer',
    emoji: '🔔',
    color: '#F59E0B',
    width: 60,
    height: 65,
    renderSVG: (props) => <BuzzerSVG {...props} />,
    pins: [
      { id: 'pos', x: 0, y: 32, type: 'input+', label: '+' },
      { id: 'neg', x: 60, y: 32, type: 'output-', label: '−' }
    ],
    shortDesc: 'Hace sonido BIP',
    description: 'El buzzer (o zumbador) hace un sonido "biiip" cuando pasa electricidad. Una plaquita de metal dentro vibra tan rápido que produce sonido. ¡Los robots lo usan para hablar!',
    funFact: '🎵 ¿Sabías que? Con un Arduino puedes programar un buzzer para tocar melodías. ¡Hasta el tema de Star Wars!',
    learningTip: '📢 Los buzzers se usan en alarmas, microondas, y ¡hasta en los juguetes que hacen ruidos!',
    category: 'salida',
    minVoltage: 3,
    maxVoltage: 12
  },
  sensor_light: {
    id: 'sensor_light',
    name: 'Sensor de Luz',
    emoji: '👁️',
    color: '#EC4899',
    width: 60,
    height: 65,
    renderSVG: (props) => <SensorSVG {...props} />,
    pins: [
      { id: 'vcc', x: 0, y: 18, type: 'input+', label: 'V' },
      { id: 'gnd', x: 0, y: 47, type: 'input-', label: 'G' },
      { id: 'out', x: 60, y: 32, type: 'output', label: 'S' }
    ],
    shortDesc: 'Detecta la luz',
    description: 'Este sensor es como un ojo electrónico. Puede medir cuánta luz hay. Con poca luz da una señal, con mucha luz da otra. ¡Los robots lo usan para no chocarse en la oscuridad!',
    funFact: '🌙 ¿Sabías que? Las luces automáticas de las calles usan un sensor de luz. Cuando oscurece, ¡se encienden solas!',
    learningTip: '🤖 Los robots seguidores de línea usan estos sensores para "ver" la línea negra en el piso.',
    category: 'entrada',
    isSensor: true
  },
  arduino: {
    id: 'arduino',
    name: 'Arduino Nano',
    emoji: '🧠',
    color: '#0EA5E9',
    width: 110,
    height: 78,
    renderSVG: (props) => <ArduinoSVG {...props} />,
    pins: [
      { id: 'vin', x: 0, y: 25, type: 'input+', label: 'V+' },
      { id: 'gnd', x: 0, y: 55, type: 'input-', label: 'GND' },
      { id: 'd2', x: 110, y: 18, type: 'digital', label: 'D2' },
      { id: 'd3', x: 110, y: 40, type: 'digital', label: 'D3' },
      { id: 'd4', x: 110, y: 60, type: 'digital', label: 'D4' }
    ],
    shortDesc: 'El cerebro del robot',
    description: 'El Arduino es como un mini-cerebro electrónico. Puedes programarlo para que tome decisiones: "Si el sensor detecta luz, enciende el LED". ¡Es el corazón de casi todos los proyectos de robótica!',
    funFact: '🇮🇹 ¿Sabías que? Arduino fue inventado en Italia en 2005 por estudiantes que querían crear algo fácil y barato para aprender electrónica.',
    learningTip: '💻 Los pines D2, D3, D4 son "digitales": pueden encender (1) o apagar (0) cosas. ¡Como un interruptor programable!',
    category: 'procesamiento',
    isArduino: true
  }
};

// Category config
const CATEGORIES = {
  energía: { label: 'Energía', color: '#FF6B35', icon: '🔋', desc: 'Componentes que dan energía al circuito' },
  salida: { label: 'Salida', color: '#8B5CF6', icon: '💡', desc: 'Componentes que hacen algo (luz, sonido, movimiento)' },
  protección: { label: 'Protección', color: '#A0522D', icon: '🛡️', desc: 'Componentes que protegen el circuito' },
  control: { label: 'Control', color: '#6B7280', icon: '🔘', desc: 'Componentes que controlan el flujo' },
  entrada: { label: 'Entrada', color: '#EC4899', icon: '👁️', desc: 'Sensores que detectan el ambiente' },
  procesamiento: { label: 'Procesamiento', color: '#0EA5E9', icon: '🧠', desc: 'Cerebros que toman decisiones' }
};

// ============================================
// CIRCUIT CHALLENGES
// ============================================

const CHALLENGES = [
  {
    id: 1, title: 'Mi Primer Circuito', difficulty: 'fácil', stars: 1,
    description: 'Conecta una batería a un LED para encenderlo. ¡Tu primer circuito!',
    hint: 'El + de la batería va al + del LED (patita larga), y el − va al −',
    explanation: 'Un circuito es un camino cerrado por donde viajan los electrones. La batería los empuja y el LED los convierte en luz.',
    requiredComponents: ['battery', 'led_red'],
    goal: 'Enciende el LED rojo',
    xp: 50, unlocked: true,
    validation: (circuit) => circuit.components.some(c => c.type === 'led_red' && c.isActive)
  },
  {
    id: 2, title: 'Protege tu LED', difficulty: 'fácil', stars: 1,
    description: 'Los LEDs necesitan una resistencia para no quemarse. ¡Agrega una!',
    hint: 'La resistencia va entre la batería y el LED, como un guardia',
    explanation: 'Sin resistencia, demasiada corriente pasa por el LED y lo quema. La resistencia limita el paso de electrones, como una puerta que solo deja pasar algunos.',
    requiredComponents: ['battery', 'resistor', 'led_green'],
    goal: 'Enciende el LED con resistencia',
    xp: 75, unlocked: true,
    validation: (circuit) => {
      const hasRes = circuit.components.some(c => c.type === 'resistor');
      const ledActive = circuit.components.some(c => c.type === 'led_green' && c.isActive);
      return hasRes && ledActive;
    }
  },
  {
    id: 3, title: 'Control con Interruptor', difficulty: 'medio', stars: 2,
    description: 'Agrega un interruptor para controlar cuándo se enciende el LED.',
    hint: 'El interruptor va en serie (en la misma línea) con el circuito',
    explanation: 'Los interruptores cortan el camino de los electrones. Cuando está ON, el camino está completo y el LED brilla. Cuando está OFF, el camino se interrumpe.',
    requiredComponents: ['battery', 'switch_comp', 'resistor', 'led_blue'],
    goal: 'Controla el LED con el interruptor',
    xp: 100, unlocked: false,
    validation: (circuit) => {
      const hasSw = circuit.components.some(c => c.type === 'switch_comp');
      const hasLed = circuit.components.some(c => c.type === 'led_blue');
      return hasSw && hasLed;
    }
  },
  {
    id: 4, title: 'Semáforo Simple', difficulty: 'medio', stars: 2,
    description: 'Crea un semáforo conectando 3 LEDs de diferentes colores en paralelo.',
    hint: 'Cada LED necesita su propia resistencia. Todos comparten la misma batería.',
    explanation: 'En un circuito paralelo, cada LED tiene su propio camino. Si uno se apaga, los otros siguen funcionando. ¡Así funcionan las luces de tu casa!',
    requiredComponents: ['battery', 'resistor', 'resistor', 'resistor', 'led_red', 'led_green', 'led_blue'],
    goal: 'Enciende los 3 LEDs',
    xp: 150, unlocked: false,
    validation: (circuit) => circuit.components.filter(c => c.type.startsWith('led_') && c.isActive).length >= 3
  },
  {
    id: 5, title: 'Motor en Acción', difficulty: 'difícil', stars: 3,
    description: 'Conecta un motor DC y hazlo girar. ¡Los robots usan motores!',
    hint: 'El motor necesita la batería directamente, sin resistencia',
    explanation: 'Los motores DC convierten electricidad en movimiento usando imanes. Cuando la corriente pasa, crea un campo magnético que hace girar el eje.',
    requiredComponents: ['battery', 'switch_comp', 'motor'],
    goal: 'Haz girar el motor',
    xp: 200, unlocked: false,
    validation: (circuit) => circuit.components.some(c => c.type === 'motor' && c.isActive)
  },
  {
    id: 6, title: 'Alarma Sonora', difficulty: 'difícil', stars: 3,
    description: 'Crea una alarma que suene cuando presiones el interruptor.',
    hint: 'El buzzer se conecta igual que un LED: tiene + y −',
    explanation: 'El buzzer tiene una plaquita que vibra con electricidad. Esas vibraciones mueven el aire y crean ondas de sonido que llegan a tus oídos.',
    requiredComponents: ['battery', 'switch_comp', 'buzzer'],
    goal: 'Activa el buzzer',
    xp: 200, unlocked: false,
    validation: (circuit) => circuit.components.some(c => c.type === 'buzzer' && c.isActive)
  },
  {
    id: 7, title: 'Arduino LED', difficulty: 'experto', stars: 4,
    description: 'Conecta un Arduino y controla un LED desde el pin digital D2.',
    hint: 'La batería alimenta el Arduino (V+ y GND), luego del pin D2 sale al LED',
    explanation: 'El Arduino recibe energía y la distribuye de forma inteligente. Puedes programar qué pin se enciende y cuándo. ¡Es programar el mundo físico!',
    requiredComponents: ['battery', 'arduino', 'resistor', 'led_green'],
    goal: 'Controla LED con Arduino',
    xp: 300, unlocked: false,
    validation: (circuit) => {
      const hasArduino = circuit.components.some(c => c.type === 'arduino' && c.isActive);
      const hasLed = circuit.components.some(c => c.type.startsWith('led_'));
      return hasArduino && hasLed;
    }
  },
  {
    id: 8, title: 'Modo Libre', difficulty: 'libre', stars: 0,
    description: '¡Usa todos los componentes y crea el circuito que quieras! Experimenta sin límites.',
    hint: '¡No hay reglas! Prueba diferentes combinaciones.',
    explanation: 'La mejor forma de aprender es experimentando. Prueba, falla, y vuelve a intentar. ¡Así aprenden los verdaderos ingenieros!',
    requiredComponents: [], goal: 'Experimenta', xp: 0, unlocked: true, isFreeMode: true,
    validation: () => true
  }
];

// ============================================
// COMPONENT: Info Modal for component details
// ============================================

const ComponentInfoModal = ({ component, onClose }) => {
  if (!component) return null;
  const comp = COMPONENTS[component];
  if (!comp) return null;
  const cat = CATEGORIES[comp.category];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 rounded-t-3xl text-center" style={{ background: `linear-gradient(135deg, ${comp.color}22, ${comp.color}44)` }}>
          <div className="w-28 h-28 mx-auto mb-3 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2">
            {comp.renderSVG({ size: 80, glow: true })}
          </div>
          <h2 className="text-2xl font-black" style={{ color: comp.color }}>{comp.emoji} {comp.name}</h2>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: cat?.color }}>
            {cat?.icon} {cat?.label}
          </span>
        </div>

        <div className="p-6 space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" /> ¿Qué hace?
            </h3>
            <p className="text-gray-600 leading-relaxed">{comp.description}</p>
          </div>

          {/* Fun Fact */}
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
            <p className="text-yellow-800 font-semibold">{comp.funFact}</p>
          </div>

          {/* Learning Tip */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-blue-800 font-semibold">{comp.learningTip}</p>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-700 mb-2">📊 Datos Técnicos</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {comp.voltage && <div className="bg-white rounded-lg p-2"><span className="text-gray-500">Voltaje:</span> <strong>{comp.voltage}V</strong></div>}
              {comp.resistance && <div className="bg-white rounded-lg p-2"><span className="text-gray-500">Resistencia:</span> <strong>{comp.resistance}Ω</strong></div>}
              {comp.minVoltage && <div className="bg-white rounded-lg p-2"><span className="text-gray-500">Voltaje mín:</span> <strong>{comp.minVoltage}V</strong></div>}
              {comp.maxVoltage && <div className="bg-white rounded-lg p-2"><span className="text-gray-500">Voltaje máx:</span> <strong>{comp.maxVoltage}V</strong></div>}
              <div className="bg-white rounded-lg p-2"><span className="text-gray-500">Pines:</span> <strong>{comp.pins.length}</strong></div>
              <div className="bg-white rounded-lg p-2"><span className="text-gray-500">Tipo:</span> <strong>{cat?.label}</strong></div>
            </div>
          </div>

          {/* Pin Diagram */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-700 mb-2">📌 Pines de conexión</h4>
            <div className="flex flex-wrap gap-2">
              {comp.pins.map(pin => (
                <div key={pin.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border">
                  <div className={`w-4 h-4 rounded-full ${
                    pin.type.includes('+') ? 'bg-red-400' : 
                    pin.type.includes('-') ? 'bg-gray-800' : 
                    pin.type === 'digital' ? 'bg-blue-400' :
                    pin.type === 'output' ? 'bg-green-400' : 'bg-gray-400'
                  }`}/>
                  <span className="text-sm font-semibold">{pin.label || pin.id}</span>
                  <span className="text-xs text-gray-400">{pin.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: Placed Component on Canvas
// ============================================

const PlacedComponent = ({ component, onDrag, onPinClick, selectedPin, isActive, isError, onDelete, onShowInfo }) => {
  const compDef = COMPONENTS[component.type];
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('.pin-hitbox') || e.target.closest('.comp-btn')) return;
    e.stopPropagation();
    setIsDragging(true);
    const startX = e.clientX - component.x;
    const startY = e.clientY - component.y;
    const handleMove = (e) => onDrag(component.id, e.clientX - startX, e.clientY - startY);
    const handleUp = () => { setIsDragging(false); window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.pin-hitbox') || e.target.closest('.comp-btn')) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const startX = touch.clientX - component.x;
    const startY = touch.clientY - component.y;
    let moved = false;
    const handleTouchMove = (ev) => {
      ev.preventDefault();
      moved = true;
      setIsDragging(true);
      const t = ev.touches[0];
      onDrag(component.id, t.clientX - startX, t.clientY - startY);
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
      if (!moved) setShowActions(prev => !prev);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      className={`absolute select-none transition-shadow duration-150 group ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ left: component.x, top: component.y, width: compDef.width, height: compDef.height }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Action buttons (hover on desktop, tap-toggle on mobile) */}
      <div className={`absolute -top-9 left-1/2 -translate-x-1/2 flex gap-1.5 transition-opacity z-30 ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button className="comp-btn w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 active:scale-90"
          onClick={(e) => { e.stopPropagation(); onShowInfo(component.type); }}
          title="Ver info">
          <Info size={15} />
        </button>
        <button className="comp-btn w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 active:scale-90"
          onClick={(e) => { e.stopPropagation(); onDelete(component.id); setShowActions(false); }}
          title="Eliminar">
          <Trash2 size={15} />
        </button>
      </div>

      {/* Component Body with SVG */}
      <div className={`w-full h-full flex items-center justify-center cursor-move relative rounded-xl
        ${isActive ? 'ring-4 ring-green-400 shadow-lg shadow-green-400/40' : ''}
        ${isError ? 'ring-4 ring-red-400 animate-pulse' : ''}
        ${isDragging ? 'scale-110 shadow-2xl' : 'hover:shadow-lg'}
        transition-all duration-150`}
        style={{ background: `${compDef.color}11` }}
      >
        {compDef.renderSVG({ 
          size: Math.min(compDef.width, compDef.height) * 0.85, 
          glow: isActive,
          spinning: isActive && compDef.id === 'motor',
          active: isActive,
          isOn: component.switchState !== false
        })}

        {/* Active glow overlay for LEDs */}
        {isActive && compDef.id.startsWith('led_') && (
          <div className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${compDef.color}66, transparent 70%)` }}>
            <div className="w-full h-full animate-ping opacity-20 rounded-xl"
              style={{ backgroundColor: compDef.color }}/>
          </div>
        )}
      </div>

      {/* Pins - larger hit areas on mobile */}
      {compDef.pins.map(pin => {
        const pinId = `${component.id}-${pin.id}`;
        const isSelected = selectedPin === pinId;
        const isConnected = component.connections?.includes(pin.id);
        return (
          <div key={pin.id}
            className="pin-hitbox absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
            style={{ left: pin.x, top: pin.y }}
            onClick={(e) => { e.stopPropagation(); onPinClick(pinId, component, pin); }}
            onTouchEnd={(e) => { e.stopPropagation(); onPinClick(pinId, component, pin); }}>
            <div className={`w-full h-full rounded-full border-[2.5px] flex items-center justify-center text-[8px] font-black
              transition-all duration-200 shadow-sm
              ${isSelected ? 'bg-yellow-300 border-yellow-500 scale-[1.3] shadow-yellow-300/50 shadow-md' : ''}
              ${isConnected && !isSelected ? 'bg-green-300 border-green-500' : ''}
              ${!isSelected && !isConnected ? 'bg-white border-gray-400 group-hover/pin:bg-blue-200 group-hover/pin:border-blue-500 group-hover/pin:scale-110' : ''}
            `}>
              {pin.label}
            </div>
          </div>
        );
      })}

      {/* Component name label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
          style={{ background: `${compDef.color}22`, color: compDef.color }}>
          {compDef.name}
        </span>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: Wire Connection
// ============================================

const Wire = ({ from, to, isActive, onDelete }) => {
  const dx = Math.abs(to.x - from.x);
  const cpOffset = Math.max(dx * 0.4, 40);
  const path = `M ${from.x} ${from.y} C ${from.x + cpOffset} ${from.y}, ${to.x - cpOffset} ${to.y}, ${to.x} ${to.y}`;

  // Midpoint for delete button
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g className="group/wire">
      <path d={path} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={7} strokeLinecap="round"/>
      <path d={path} fill="none" stroke={isActive ? '#22C55E' : '#9CA3AF'} strokeWidth={4.5} strokeLinecap="round"/>
      {/* Invisible thick hitbox for easier tapping */}
      {onDelete && (
        <path d={path} fill="none" stroke="transparent" strokeWidth={22} strokeLinecap="round"
          style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          onTouchEnd={(e) => { e.stopPropagation(); onDelete(); }}/>
      )}
      {/* Delete button at midpoint — visible on hover/tap */}
      {onDelete && (
        <g onClick={(e) => { e.stopPropagation(); onDelete(); }}
           onTouchEnd={(e) => { e.stopPropagation(); onDelete(); }}
           style={{ cursor: 'pointer', pointerEvents: 'all' }}
           className="opacity-0 group-hover/wire:opacity-100 transition-opacity">
          <circle cx={midX} cy={midY} r="10" fill="#EF4444" stroke="white" strokeWidth="2"/>
          <text x={midX} y={midY + 1} textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize="12" fontWeight="bold">✕</text>
        </g>
      )}
      {isActive && (
        <>
          <path d={path} fill="none" stroke="#4ADE80" strokeWidth={2.5} strokeLinecap="round"
            strokeDasharray="10 5" className="animate-wire-flow"/>
          {/* Electron particles */}
          <circle r="4" fill="#FDE047" opacity="0.9">
            <animateMotion dur="1.5s" repeatCount="indefinite" path={path}/>
          </circle>
          <circle r="3" fill="#FDE047" opacity="0.6">
            <animateMotion dur="1.5s" repeatCount="indefinite" path={path} begin="0.5s"/>
          </circle>
        </>
      )}
    </g>
  );
};

// ============================================
// COMPONENT: Enhanced Palette with categories
// ============================================

const ComponentPalette = ({ onDragStart, availableComponents, showAll, onShowInfo }) => {
  const [expandedCat, setExpandedCat] = useState(null);

  const componentsToShow = showAll
    ? Object.values(COMPONENTS)
    : [...new Set(availableComponents)].map(id => COMPONENTS[id]).filter(Boolean);

  // Group by category
  const grouped = {};
  componentsToShow.forEach(comp => {
    if (!grouped[comp.category]) grouped[comp.category] = [];
    if (!grouped[comp.category].find(c => c.id === comp.id)) {
      grouped[comp.category].push(comp);
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
      <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
        <h3 className="font-black text-sm flex items-center gap-2">
          <Zap size={18} /> COMPONENTES
        </h3>
        <p className="text-[10px] opacity-90 mt-0.5">Arrastra al tablero o toca ℹ️ para aprender</p>
      </div>
      <div className="p-2 space-y-1 max-h-[calc(100vh-260px)] overflow-y-auto">
        {Object.entries(grouped).map(([catKey, comps]) => {
          const cat = CATEGORIES[catKey];
          return (
            <div key={catKey}>
              <button
                onClick={() => setExpandedCat(expandedCat === catKey ? null : catKey)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-base">{cat?.icon}</span>
                <span className="text-xs font-bold flex-1" style={{ color: cat?.color }}>{cat?.label}</span>
                <ChevronRight size={14} className={`text-gray-400 transition-transform ${expandedCat === catKey ? 'rotate-90' : ''}`}/>
              </button>

              {(expandedCat === catKey || !showAll) && (
                <div className="grid grid-cols-1 gap-1.5 pb-2 pl-2 pr-1">
                  {comps.map(comp => (
                    <div key={comp.id}
                      className="flex items-center gap-2 p-2 rounded-xl cursor-grab active:cursor-grabbing border-2 hover:shadow-md transition-all"
                      style={{ borderColor: comp.color + '44', background: comp.color + '08' }}
                      draggable
                      onDragStart={(e) => onDragStart(e, comp.id)}
                    >
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                        {comp.renderSVG({ size: 40 })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold truncate" style={{ color: comp.color }}>{comp.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate">{comp.shortDesc}</p>
                      </div>
                      <button
                        className="comp-btn w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 hover:bg-blue-50 transition-colors"
                        style={{ borderColor: comp.color + '66' }}
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onShowInfo(comp.id); }}
                        title="Ver información"
                      >
                        <Info size={13} style={{ color: comp.color }}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: Challenge Info Panel
// ============================================

const ChallengeInfo = ({ challenge }) => {
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const diffColors = {
    'fácil': 'bg-green-100 text-green-700',
    'medio': 'bg-yellow-100 text-yellow-700',
    'difícil': 'bg-orange-100 text-orange-700',
    'experto': 'bg-purple-100 text-purple-700',
    'libre': 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm">{challenge.title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${diffColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-600">{challenge.description}</p>

        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <Target size={16}/> Objetivo:
          </div>
          <p className="text-blue-600 text-sm mt-1">{challenge.goal}</p>
        </div>

        {!challenge.isFreeMode && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-yellow-600 font-bold text-sm">+{challenge.xp} XP</span>
              <div className="flex">
                {[...Array(challenge.stars)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400"/>
                ))}
              </div>
            </div>

            <button onClick={() => setShowHint(!showHint)}
              className="w-full py-2 rounded-xl bg-purple-50 text-purple-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors border border-purple-200">
              <HelpCircle size={16}/> {showHint ? 'Ocultar Pista' : '¿Necesitas una Pista?'}
            </button>
            {showHint && (
              <div className="p-3 bg-purple-50 rounded-xl text-purple-700 text-sm border border-purple-200">
                💡 {challenge.hint}
              </div>
            )}

            <button onClick={() => setShowExplanation(!showExplanation)}
              className="w-full py-2 rounded-xl bg-green-50 text-green-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors border border-green-200">
              <BookOpen size={16}/> {showExplanation ? 'Ocultar Explicación' : '¿Cómo funciona?'}
            </button>
            {showExplanation && (
              <div className="p-3 bg-green-50 rounded-xl text-green-700 text-sm border border-green-200">
                🔬 {challenge.explanation}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: Success Modal
// ============================================

const SuccessModal = ({ challenge, onNext, onRetry }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-bounceIn shadow-2xl">
      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
        <Trophy className="w-12 h-12 text-yellow-700"/>
      </div>
      <h2 className="text-3xl font-black text-gray-800 mb-2">¡Excelente!</h2>
      <p className="text-gray-500 mb-3">Completaste "{challenge.title}"</p>
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(challenge.stars)].map((_, i) => (
          <Star key={i} size={32} className="text-yellow-400 fill-yellow-400" style={{ animation: `pulse 0.6s ease ${i * 0.15}s` }}/>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 bg-yellow-100 px-5 py-2 rounded-full mb-6">
        <Sparkles className="text-yellow-500"/> <span className="font-black text-yellow-700">+{challenge.xp} XP</span>
      </div>
      <div className="bg-blue-50 rounded-xl p-3 mb-6 text-left">
        <p className="text-blue-700 text-sm font-semibold">🔬 {challenge.explanation}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onRetry} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Repetir</button>
        <button onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white font-bold hover:from-green-500 hover:to-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg">
          Siguiente <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// COMPONENT: Challenge Selector
// ============================================

const ChallengeSelector = ({ challenges, completedChallenges, onSelect, onBack }) => {
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const diffGradients = {
    'fácil': 'from-green-400 to-emerald-500',
    'medio': 'from-yellow-400 to-amber-500',
    'difícil': 'from-orange-400 to-red-500',
    'experto': 'from-purple-400 to-indigo-500',
    'libre': 'from-blue-400 to-cyan-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack}
              className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft/>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-black">⚡ Constructor de Circuitos</h1>
              <p className="text-white/80 text-sm">Aprende electrónica construyendo circuitos reales</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm">Tu Progreso</span>
              <span className="font-black">{completedChallenges.length}/{challenges.filter(c => !c.isFreeMode).length}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-700"
                style={{ width: `${(completedChallenges.length / Math.max(challenges.filter(c=>!c.isFreeMode).length,1)) * 100}%` }}/>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Encyclopedia button */}
        <button onClick={() => setShowEncyclopedia(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <BookOpen size={24}/> 📖 Enciclopedia de Componentes
          <span className="text-xs bg-white/30 px-2 py-1 rounded-full">Aprende sobre cada pieza</span>
        </button>

        {/* Challenges */}
        <div className="grid md:grid-cols-2 gap-4">
          {challenges.map((ch, idx) => {
            const done = completedChallenges.includes(ch.id);
            const unlocked = ch.unlocked || ch.isFreeMode || (idx > 0 && completedChallenges.includes(challenges[idx-1]?.id));
            return (
              <div key={ch.id}
                onClick={() => unlocked && onSelect(ch)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300
                  ${unlocked ? 'hover:scale-[1.03] hover:shadow-xl' : 'opacity-50 cursor-not-allowed grayscale'}
                  ${done ? 'ring-4 ring-green-400 ring-offset-2' : ''}`}>
                <div className={`bg-gradient-to-br ${diffGradients[ch.difficulty]} p-5 text-white min-h-[140px] flex flex-col justify-between`}>
                  {!unlocked && (
                    <div className="absolute inset-0 bg-gray-500/60 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-10 h-10 mx-auto mb-1 opacity-80"/>
                        <span className="text-sm font-bold opacity-80">Completa el anterior</span>
                      </div>
                    </div>
                  )}
                  {done && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                      <Check className="w-5 h-5 text-green-500"/>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-black opacity-60">#{idx+1}</span>
                      {!ch.isFreeMode && <div className="flex">{[...Array(ch.stars)].map((_,i) => <Star key={i} size={14} className="text-yellow-200 fill-yellow-200"/>)}</div>}
                    </div>
                    <h3 className="text-lg font-black">{ch.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{ch.description.substring(0,80)}{ch.description.length > 80 ? '...' : ''}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {!ch.isFreeMode && <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">+{ch.xp} XP</span>}
                    {ch.isFreeMode && <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">🎨 Sin límites</span>}
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold capitalize">{ch.difficulty}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Encyclopedia Modal */}
      {showEncyclopedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEncyclopedia(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 bg-gradient-to-r from-amber-400 to-orange-400 text-white">
              <h2 className="text-xl font-black flex items-center gap-2">📖 Enciclopedia de Componentes</h2>
              <p className="text-sm text-white/80">Toca cualquier componente para aprender sobre él</p>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
              {Object.entries(CATEGORIES).map(([catKey, cat]) => (
                <div key={catKey} className="mb-4">
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2" style={{ color: cat.color }}>
                    {cat.icon} {cat.label} <span className="text-xs text-gray-400 font-normal">— {cat.desc}</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(COMPONENTS).filter(c => c.category === catKey).map(comp => (
                      <div key={comp.id}
                        onClick={() => setSelectedInfo(comp.id)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 hover:shadow-lg cursor-pointer transition-all hover:scale-[1.03]"
                        style={{ borderColor: comp.color + '44' }}>
                        <div className="w-16 h-16 flex items-center justify-center">
                          {comp.renderSVG({ size: 52 })}
                        </div>
                        <span className="text-xs font-bold text-center" style={{ color: comp.color }}>{comp.name}</span>
                        <span className="text-[10px] text-gray-500 text-center">{comp.shortDesc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <button onClick={() => setShowEncyclopedia(false)}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Info modal */}
      {selectedInfo && <ComponentInfoModal component={selectedInfo} onClose={() => setSelectedInfo(null)}/>}
    </div>
  );
};

// ============================================
// MAIN COMPONENT: Circuit Builder
// ============================================

const CircuitBuilder = ({ onBack, initialChallengeId }) => {
  const [view, setView] = useState(() => initialChallengeId ? 'builder' : 'challenges');
  const [currentChallenge, setCurrentChallenge] = useState(() => {
    if (initialChallengeId) {
      return CHALLENGES.find(c => c.id === initialChallengeId) || null;
    }
    return null;
  });
  const [completedChallenges, setCompletedChallenges] = useState([1, 2]);
  const [placedComponents, setPlacedComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedPinData, setSelectedPinData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [circuitState, setCircuitState] = useState({ components: [], activeWires: [] });
  const [infoComponent, setInfoComponent] = useState(null);

  const canvasRef = useRef(null);
  const componentIdRef = useRef(0);
  const [selectedComponentType, setSelectedComponentType] = useState(null); // for tap-to-place on mobile

  const resetCircuit = useCallback(() => {
    setPlacedComponents([]); setWires([]); setSelectedPin(null);
    setSelectedPinData(null); setIsSimulating(false); setShowSuccess(false);
    setCircuitState({ components: [], activeWires: [] }); setSelectedComponentType(null);
  }, []);

  const handleDragStart = (e, type) => e.dataTransfer.setData('componentType', type);

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    if (!type || !COMPONENTS[type]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const comp = COMPONENTS[type];
    const x = Math.max(20, Math.min(e.clientX - rect.left - comp.width / 2, rect.width - comp.width - 20));
    const y = Math.max(20, Math.min(e.clientY - rect.top - comp.height / 2, rect.height - comp.height - 20));
    setPlacedComponents(prev => [...prev, {
      id: `comp-${componentIdRef.current++}`, type, x, y, connections: [], switchState: true
    }]);
  };

  // Tap on canvas to place selected component (mobile)
  const handleCanvasTap = (e) => {
    if (!selectedComponentType || !COMPONENTS[selectedComponentType]) return;
    // Don't place if tapping on an existing component
    if (e.target.closest('.pin-hitbox') || e.target.closest('.comp-btn') || e.target !== e.currentTarget) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const comp = COMPONENTS[selectedComponentType];
    let clientX, clientY;
    if (e.type === 'touchend' && e.changedTouches?.length) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = Math.max(10, Math.min(clientX - rect.left - comp.width / 2, rect.width - comp.width - 10));
    const y = Math.max(10, Math.min(clientY - rect.top - comp.height / 2, rect.height - comp.height - 10));
    setPlacedComponents(prev => [...prev, {
      id: `comp-${componentIdRef.current++}`, type: selectedComponentType, x, y, connections: [], switchState: true
    }]);
    setSelectedComponentType(null);
  };

  const handleComponentDrag = (id, x, y) => {
    setPlacedComponents(prev => prev.map(c => c.id === id ? { ...c, x, y } : c));
  };

  const handleDelete = (id) => {
    // Clear pin selection if it references the deleted component
    if (selectedPinData?.component?.id === id) {
      setSelectedPin(null);
      setSelectedPinData(null);
    }
    // Find wires connected to this component to clean up peer connections
    const wiresToRemove = wires.filter(w => w.from.componentId === id || w.to.componentId === id);
    // Clean up connections array on peer components
    setPlacedComponents(prev => {
      const filtered = prev.filter(c => c.id !== id);
      return filtered.map(c => {
        const pinsToRemove = new Set();
        wiresToRemove.forEach(w => {
          if (w.from.componentId === c.id) pinsToRemove.add(w.from.pinId);
          if (w.to.componentId === c.id) pinsToRemove.add(w.to.pinId);
        });
        if (pinsToRemove.size > 0) {
          return { ...c, connections: (c.connections || []).filter(pid => !pinsToRemove.has(pid)) };
        }
        return c;
      });
    });
    setWires(prev => prev.filter(w => w.from.componentId !== id && w.to.componentId !== id));
  };

  const handleDeleteWire = (wireId) => {
    const wire = wires.find(w => w.id === wireId);
    if (!wire) return;
    // Remove wire
    setWires(prev => prev.filter(w => w.id !== wireId));
    // Clean up connections on both connected components
    setPlacedComponents(prev => prev.map(c => {
      if (c.id === wire.from.componentId) {
        return { ...c, connections: (c.connections || []).filter(pid => pid !== wire.from.pinId) };
      }
      if (c.id === wire.to.componentId) {
        return { ...c, connections: (c.connections || []).filter(pid => pid !== wire.to.pinId) };
      }
      return c;
    }));
  };

  const handlePinClick = (pinId, component, pin) => {
    if (!selectedPin) {
      setSelectedPin(pinId);
      setSelectedPinData({ component, pin });
    } else if (selectedPin === pinId) {
      // Click same pin: deselect
      setSelectedPin(null); setSelectedPinData(null);
    } else {
      // Don't connect pins from same component
      if (selectedPinData.component.id === component.id) {
        setSelectedPin(pinId); setSelectedPinData({ component, pin }); return;
      }
      // Prevent duplicate wires between same two pins
      const alreadyConnected = wires.some(w =>
        (w.from.componentId === selectedPinData.component.id && w.from.pinId === selectedPinData.pin.id &&
         w.to.componentId === component.id && w.to.pinId === pin.id) ||
        (w.to.componentId === selectedPinData.component.id && w.to.pinId === selectedPinData.pin.id &&
         w.from.componentId === component.id && w.from.pinId === pin.id)
      );
      if (alreadyConnected) {
        // Just move selection to new pin
        setSelectedPin(pinId); setSelectedPinData({ component, pin }); return;
      }
      const newWire = {
        id: `wire-${Date.now()}`,
        from: { componentId: selectedPinData.component.id, pinId: selectedPinData.pin.id,
          x: selectedPinData.component.x + selectedPinData.pin.x, y: selectedPinData.component.y + selectedPinData.pin.y },
        to: { componentId: component.id, pinId: pin.id,
          x: component.x + pin.x, y: component.y + pin.y }
      };
      setWires(prev => [...prev, newWire]);
      setPlacedComponents(prev => prev.map(c => {
        if (c.id === selectedPinData.component.id) return { ...c, connections: [...(c.connections||[]), selectedPinData.pin.id] };
        if (c.id === component.id) return { ...c, connections: [...(c.connections||[]), pin.id] };
        return c;
      }));
      setSelectedPin(null); setSelectedPinData(null);
    }
  };

  const simulateCircuit = () => {
    setIsSimulating(true);
    const battery = placedComponents.find(c => c.type === 'battery');
    if (!battery) { setCircuitState({ components: placedComponents, activeWires: [] }); return; }

    const activeWireIds = new Set();
    const connectedComponents = new Set([battery.id]);
    let changed = true;
    while (changed) {
      changed = false;
      wires.forEach(wire => {
        const fC = connectedComponents.has(wire.from.componentId);
        const tC = connectedComponents.has(wire.to.componentId);
        if (fC && !tC) { connectedComponents.add(wire.to.componentId); activeWireIds.add(wire.id); changed = true; }
        else if (tC && !fC) { connectedComponents.add(wire.from.componentId); activeWireIds.add(wire.id); changed = true; }
        else if (fC && tC) { activeWireIds.add(wire.id); }
      });
    }

    const updated = placedComponents.map(comp => ({
      ...comp,
      isActive: connectedComponents.has(comp.id) && !['battery','resistor','switch_comp'].includes(comp.type),
      isError: false
    }));
    setCircuitState({ components: updated, activeWires: Array.from(activeWireIds) });

    if (currentChallenge && !currentChallenge.isFreeMode) {
      setTimeout(() => {
        if (currentChallenge.validation({ components: updated, wires })) {
          setShowSuccess(true);
          if (!completedChallenges.includes(currentChallenge.id))
            setCompletedChallenges(prev => [...prev, currentChallenge.id]);
        }
      }, 600);
    }
  };

  // Update wire positions on component move
  useEffect(() => {
    setWires(prev => prev.map(wire => {
      const fc = placedComponents.find(c => c.id === wire.from.componentId);
      const tc = placedComponents.find(c => c.id === wire.to.componentId);
      if (!fc || !tc) return wire;
      const fp = COMPONENTS[fc.type].pins.find(p => p.id === wire.from.pinId);
      const tp = COMPONENTS[tc.type].pins.find(p => p.id === wire.to.pinId);
      if (!fp || !tp) return wire;
      return {
        ...wire,
        from: { ...wire.from, x: fc.x + fp.x, y: fc.y + fp.y },
        to: { ...wire.to, x: tc.x + tp.x, y: tc.y + tp.y }
      };
    }));
  }, [placedComponents]);

  // Challenge selector view
  if (view === 'challenges') {
    return (
      <ChallengeSelector
        challenges={CHALLENGES} completedChallenges={completedChallenges}
        onSelect={(ch) => { setCurrentChallenge(ch); resetCircuit(); setView('builder'); }}
        onBack={onBack}
      />
    );
  }

  // ---- Builder View ----
  return (
    <div className="bg-gradient-to-br from-slate-100 to-blue-100 flex flex-col" style={{ height: 'calc(100vh - var(--sat, 0px) - var(--sab, 0px))' }}>
      {/* Header */}
      <div className="bg-white shadow-md px-3 md:px-4 py-2 md:py-2.5 flex items-center justify-between border-b-2 border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button onClick={() => setView('challenges')}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
            <ArrowLeft size={18} className="text-gray-600"/>
          </button>
          <div className="min-w-0">
            <h2 className="font-black text-gray-800 text-xs md:text-sm truncate">{currentChallenge?.title}</h2>
            <p className="text-[10px] md:text-[11px] text-gray-500 flex items-center gap-1 truncate"><Target size={11}/> {currentChallenge?.goal}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold">
            <Zap size={14}/> {placedComponents.length} componentes · {wires.length} cables
          </div>
          {selectedPin && (
            <button onClick={() => { setSelectedPin(null); setSelectedPinData(null); }}
              className="px-2 md:px-3 py-2 rounded-xl bg-yellow-50 text-yellow-700 font-bold text-xs flex items-center gap-1 hover:bg-yellow-100 transition-colors border border-yellow-300 animate-pulse">
              ✕ Deseleccionar pin
            </button>
          )}
          <button onClick={resetCircuit}
            className="px-2 md:px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs md:text-sm flex items-center gap-1 hover:bg-red-100 transition-colors border border-red-200">
            <RotateCcw size={14}/>
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
          <button onClick={simulateCircuit}
            className="px-3 md:px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 hover:from-green-600 hover:to-emerald-600 transition-colors shadow-lg shadow-green-500/30">
            <Play size={14} fill="white"/>
            <span className="hidden sm:inline">Probar</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden p-2 md:p-3 gap-2 md:gap-3">
        {/* Left sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto hidden md:block">
          <ComponentPalette
            onDragStart={handleDragStart}
            availableComponents={currentChallenge?.isFreeMode ? Object.keys(COMPONENTS) : [...new Set(currentChallenge?.requiredComponents || [])]}
            showAll={currentChallenge?.isFreeMode}
            onShowInfo={setInfoComponent}
          />
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Mobile component bar - tap to select, then tap canvas to place */}
          <div className="md:hidden">
            {selectedComponentType && (
              <div className="bg-blue-50 border border-blue-300 rounded-xl px-3 py-2 mb-2 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700">📍 Toca el lienzo para colocar:</span>
                  <span className="text-xs font-black text-blue-900">{COMPONENTS[selectedComponentType]?.name}</span>
                </div>
                <button onClick={() => setSelectedComponentType(null)} className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center active:scale-90">
                  <X size={14} className="text-blue-700"/>
                </button>
              </div>
            )}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(currentChallenge?.isFreeMode ? Object.keys(COMPONENTS) : [...new Set(currentChallenge?.requiredComponents || [])])
                .map(id => COMPONENTS[id]).filter(Boolean).map(comp => (
                <button key={comp.id}
                  className={`flex-shrink-0 w-[68px] h-[68px] rounded-xl border-2 flex flex-col items-center justify-center p-1 transition-all active:scale-90
                    ${selectedComponentType === comp.id ? 'ring-3 ring-blue-500 scale-105 shadow-lg shadow-blue-500/30 border-blue-500' : ''}`}
                  style={{ borderColor: selectedComponentType === comp.id ? undefined : comp.color + '66', background: comp.color + '11' }}
                  onClick={() => setSelectedComponentType(prev => prev === comp.id ? null : comp.id)}>
                  {comp.renderSVG({ size: 34 })}
                  <span className="text-[8px] font-bold mt-0.5 leading-tight" style={{ color: comp.color }}>{comp.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div ref={canvasRef}
            className={`flex-1 bg-white rounded-2xl shadow-lg border-2 relative overflow-hidden min-h-[250px]
              ${selectedComponentType ? 'border-blue-400 border-dashed' : 'border-gray-200'}`}
            style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1.2px, transparent 1.2px)', backgroundSize: '24px 24px', touchAction: 'none' }}
            onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
            onClick={handleCanvasTap}
            onTouchEnd={handleCanvasTap}>

            {/* SVG wires */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5, pointerEvents: 'none' }}>
              <defs>
                <style>{`
                  @keyframes wireFlow { to { stroke-dashoffset: -15; } }
                  .animate-wire-flow { animation: wireFlow 0.6s linear infinite; }
                `}</style>
              </defs>
              {wires.map(w => (
                <Wire key={w.id} from={w.from} to={w.to}
                  isActive={circuitState.activeWires.includes(w.id)}
                  onDelete={() => handleDeleteWire(w.id)}/>
              ))}
            </svg>

            {/* Components */}
            {placedComponents.map(comp => {
              const st = circuitState.components.find(c => c.id === comp.id);
              return (
                <PlacedComponent key={comp.id} component={comp}
                  onDrag={handleComponentDrag} onPinClick={handlePinClick}
                  selectedPin={selectedPin} isActive={st?.isActive} isError={st?.isError}
                  onDelete={handleDelete} onShowInfo={setInfoComponent}/>
              );
            })}

            {/* Empty state */}
            {placedComponents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center px-6">
                  <div className="text-5xl md:text-6xl mb-3">⚡</div>
                  <p className="text-base md:text-lg font-bold">
                    {selectedComponentType ? '¡Toca aquí para colocar!' : 'Selecciona un componente'}
                  </p>
                  <p className="text-xs md:text-sm mt-1 hidden md:block">Arrastra componentes aquí · Haz clic en los pines (●) para conectar cables</p>
                  <p className="text-xs mt-1 md:hidden">Toca un componente arriba, luego toca aquí para colocarlo</p>
                  <p className="text-[10px] md:text-xs mt-1 text-gray-300">💡 Toca un cable para desconectarlo</p>
                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-[10px] md:text-xs">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">● Positivo (+)</span>
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">● Negativo (−)</span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">● Digital</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tip bar */}
          <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2 border border-amber-200 text-amber-800 text-xs">
            <span className="text-base flex-shrink-0">💡</span>
            <div>
              <strong>Tip:</strong>
              <span className="hidden md:inline"> Arrastra componentes desde el panel izquierdo. Haz clic en un pin (●), luego en otro pin para conectarlos con un cable. 
              Toca el botón <span className="inline-flex items-center"><Info size={12} className="mx-0.5"/></span> de cada componente para ver su descripción.</span>
              <span className="md:hidden"> Toca un componente para seleccionarlo, luego toca el lienzo para colocarlo. Toca los pines (●) para conectar cables. Arrastra un componente para moverlo.</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto hidden lg:block">
          {currentChallenge && <ChallengeInfo challenge={currentChallenge}/>}
        </div>
      </div>

      {/* Success */}
      {showSuccess && currentChallenge && (
        <SuccessModal challenge={currentChallenge}
          onRetry={() => { setShowSuccess(false); resetCircuit(); }}
          onNext={() => {
            setShowSuccess(false);
            const idx = CHALLENGES.findIndex(c => c.id === currentChallenge.id) + 1;
            if (idx < CHALLENGES.length - 1) { setCurrentChallenge(CHALLENGES[idx]); resetCircuit(); }
            else setView('challenges');
          }}/>
      )}

      {/* Component Info Modal */}
      {infoComponent && <ComponentInfoModal component={infoComponent} onClose={() => setInfoComponent(null)}/>}

      {/* Global styles */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0 }
          50% { transform: scale(1.05) }
          70% { transform: scale(0.95) }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out }
        .animate-bounceIn { animation: bounceIn 0.5s ease-out }
      `}</style>
    </div>
  );
};

export default CircuitBuilder;
