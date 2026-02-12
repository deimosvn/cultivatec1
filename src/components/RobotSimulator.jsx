import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Play, RotateCcw, Trash2, Zap, Cpu, ChevronRight, Pause, ChevronUp, ChevronDown, X, Users, Gamepad2, Trophy, Upload, Wifi, Check, Monitor, Volume2, VolumeX, BookOpen, Wrench, AlertTriangle, Lightbulb, Package, CheckCircle } from 'lucide-react';
import RobotBuildGamesHub from './RobotBuildGames';
import AxonMerge from './AxonMerge';
import SumoBotPush from './SumoBotPush';
import { RobotMini } from '../Onboarding';

/* ================================================================
   IMÁGENES SVG INLINE DE PIEZAS REALES
   ================================================================ */
const PartSVG = ({ partId, size = 60 }) => {
  const s = size;
  const svgs = {
    chassis_sumo: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="8" y="20" width="64" height="44" rx="6" fill="#374151" stroke="#111" strokeWidth="2"/>
        <rect x="14" y="26" width="52" height="32" rx="3" fill="#4B5563" stroke="#6B7280" strokeWidth="1"/>
        <rect x="20" y="60" width="16" height="6" rx="2" fill="#9CA3AF"/>
        <rect x="44" y="60" width="16" height="6" rx="2" fill="#9CA3AF"/>
        <circle cx="28" cy="38" r="3" fill="#F59E0B"/>
        <circle cx="52" cy="38" r="3" fill="#F59E0B"/>
        <rect x="30" y="18" width="20" height="6" rx="2" fill="#EF4444"/>
        <text x="40" y="52" textAnchor="middle" fontSize="7" fill="#D1D5DB" fontWeight="bold">SUMO</text>
      </svg>
    ),
    chassis_line: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="12" y="22" width="56" height="36" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
        <rect x="18" y="28" width="44" height="24" rx="4" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1"/>
        <circle cx="28" cy="40" r="3" fill="#3B82F6"/>
        <circle cx="52" cy="40" r="3" fill="#3B82F6"/>
        <rect x="22" y="56" width="12" height="5" rx="2" fill="#60A5FA"/>
        <rect x="46" y="56" width="12" height="5" rx="2" fill="#60A5FA"/>
        <text x="40" y="70" textAnchor="middle" fontSize="6" fill="#3B82F6" fontWeight="bold">SPEED</text>
      </svg>
    ),
    chassis_dog: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <ellipse cx="40" cy="35" rx="22" ry="14" fill="#FCD34D" stroke="#D97706" strokeWidth="2"/>
        <circle cx="32" cy="28" r="3" fill="#1F2937"/><circle cx="48" cy="28" r="3" fill="#1F2937"/>
        <ellipse cx="40" cy="24" rx="6" ry="3" fill="#F59E0B"/>
        <rect x="18" y="42" width="5" height="20" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
        <rect x="30" y="42" width="5" height="20" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
        <rect x="45" y="42" width="5" height="20" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
        <rect x="57" y="42" width="5" height="20" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
        <path d="M60 30 Q68 20 64 30" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
        <circle cx="33" cy="28" r="1" fill="white"/><circle cx="49" cy="28" r="1" fill="white"/>
        <text x="40" y="75" textAnchor="middle" fontSize="6" fill="#92400E" fontWeight="bold">DOG</text>
      </svg>
    ),
    motor_dc: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="18" y="24" width="44" height="32" rx="4" fill="#D4D4D8" stroke="#71717A" strokeWidth="2"/>
        <circle cx="40" cy="40" r="12" fill="#A1A1AA" stroke="#52525B" strokeWidth="2"/>
        <circle cx="40" cy="40" r="4" fill="#52525B"/>
        <rect x="60" y="34" width="12" height="12" rx="2" fill="#71717A" stroke="#52525B" strokeWidth="1"/>
        <rect x="10" y="30" width="10" height="4" rx="1" fill="#EF4444"/>
        <rect x="10" y="46" width="10" height="4" rx="1" fill="#1F2937"/>
        <line x1="40" y1="40" x2="52" y2="40" stroke="#52525B" strokeWidth="1.5"/>
        <text x="40" y="68" textAnchor="middle" fontSize="7" fill="#52525B" fontWeight="bold">DC Motor</text>
      </svg>
    ),
    servo: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="16" y="26" width="48" height="30" rx="3" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="2"/>
        <rect x="38" y="18" width="14" height="10" rx="6" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.5"/>
        <circle cx="45" cy="23" r="3" fill="white" stroke="#1E3A8A" strokeWidth="1"/>
        <rect x="20" y="56" width="40" height="4" rx="1" fill="#93C5FD"/>
        <rect x="18" y="32" width="3" height="4" fill="#F97316"/>
        <rect x="18" y="38" width="3" height="4" fill="#EF4444"/>
        <rect x="18" y="44" width="3" height="4" fill="#713F12"/>
        <text x="40" y="70" textAnchor="middle" fontSize="7" fill="#1E3A8A" fontWeight="bold">Servo</text>
      </svg>
    ),
    wheel: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="26" fill="#1F2937" stroke="#111827" strokeWidth="3"/>
        <circle cx="40" cy="40" r="20" fill="#374151" stroke="#4B5563" strokeWidth="1"/>
        <circle cx="40" cy="40" r="8" fill="#6B7280" stroke="#9CA3AF" strokeWidth="1"/>
        <circle cx="40" cy="40" r="3" fill="#D1D5DB"/>
        <line x1="40" y1="22" x2="40" y2="14" stroke="#4B5563" strokeWidth="2"/>
        <line x1="40" y1="58" x2="40" y2="66" stroke="#4B5563" strokeWidth="2"/>
        <line x1="22" y1="40" x2="14" y2="40" stroke="#4B5563" strokeWidth="2"/>
        <line x1="58" y1="40" x2="66" y2="40" stroke="#4B5563" strokeWidth="2"/>
        <text x="40" y="76" textAnchor="middle" fontSize="6" fill="#6B7280" fontWeight="bold">Rueda</text>
      </svg>
    ),
    sensor_ultra: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="12" y="26" width="56" height="28" rx="4" fill="#0E7490" stroke="#155E75" strokeWidth="2"/>
        <circle cx="28" cy="40" r="9" fill="#A5F3FC" stroke="#06B6D4" strokeWidth="2"/>
        <circle cx="52" cy="40" r="9" fill="#A5F3FC" stroke="#06B6D4" strokeWidth="2"/>
        <circle cx="28" cy="40" r="4" fill="#0891B2"/>
        <circle cx="52" cy="40" r="4" fill="#0891B2"/>
        <rect x="20" y="54" width="6" height="10" rx="1" fill="#67E8F9"/>
        <rect x="30" y="54" width="6" height="10" rx="1" fill="#67E8F9"/>
        <rect x="44" y="54" width="6" height="10" rx="1" fill="#67E8F9"/>
        <rect x="54" y="54" width="6" height="10" rx="1" fill="#67E8F9"/>
        <text x="40" y="22" textAnchor="middle" fontSize="6" fill="#06B6D4" fontWeight="bold">HC-SR04</text>
      </svg>
    ),
    sensor_ir: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="18" y="24" width="44" height="22" rx="3" fill="#1C1917" stroke="#44403C" strokeWidth="1.5"/>
        <circle cx="30" cy="35" r="6" fill="#0F172A" stroke="#334155" strokeWidth="1"/>
        <rect cx="30" x="28" y="33" width="4" height="4" rx="1" fill="#EF4444"/>
        <circle cx="50" cy="35" r="6" fill="#0F172A" stroke="#334155" strokeWidth="1"/>
        <rect x="48" y="33" width="4" height="4" rx="1" fill="#1E293B"/>
        <rect x="24" y="46" width="4" height="12" rx="1" fill="#78716C"/>
        <rect x="36" y="46" width="4" height="12" rx="1" fill="#78716C"/>
        <rect x="52" y="46" width="4" height="12" rx="1" fill="#78716C"/>
        <circle cx="30" cy="35" r="2" fill="#FCA5A5" opacity="0.7"/>
        <text x="40" y="70" textAnchor="middle" fontSize="6" fill="#EF4444" fontWeight="bold">IR Sensor</text>
      </svg>
    ),
    arduino: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="10" y="18" width="60" height="44" rx="3" fill="#0D9488" stroke="#0F766E" strokeWidth="2"/>
        <rect x="14" y="22" width="52" height="36" rx="2" fill="#115E59"/>
        <rect x="30" y="12" width="20" height="10" rx="2" fill="#A1A1AA" stroke="#71717A" strokeWidth="1"/>
        <rect x="34" y="14" width="12" height="6" fill="#374151"/>
        <rect x="16" y="28" width="14" height="10" rx="1" fill="#1F2937" stroke="#374151" strokeWidth="0.5"/>
        <text x="23" y="36" textAnchor="middle" fontSize="4" fill="#5EEAD4">ATmega</text>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i=>(
          <rect key={`d${i}`} x={16+i*3.5} y="60" width="2" height="6" rx="0.5" fill="#FCD34D"/>
        ))}
        {[0,1,2,3,4,5].map(i=>(
          <rect key={`a${i}`} x={18+i*6} y="16" width="2" height="5" rx="0.5" fill="#FCD34D"/>
        ))}
        <circle cx="60" cy="30" r="2" fill="#22C55E"/>
        <text x="40" y="76" textAnchor="middle" fontSize="6" fill="#14B8A6" fontWeight="bold">Arduino UNO</text>
      </svg>
    ),
    battery: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="16" y="22" width="48" height="36" rx="4" fill="#166534" stroke="#14532D" strokeWidth="2"/>
        <rect x="58" y="32" width="8" height="16" rx="2" fill="#22C55E"/>
        <text x="40" y="38" textAnchor="middle" fontSize="9" fill="#86EFAC" fontWeight="bold">9V</text>
        <text x="40" y="48" textAnchor="middle" fontSize="6" fill="#4ADE80">+ −</text>
        <rect x="22" y="58" width="8" height="8" rx="1" fill="#EF4444"/>
        <rect x="50" y="58" width="8" height="8" rx="1" fill="#1F2937"/>
        <text x="40" y="76" textAnchor="middle" fontSize="6" fill="#22C55E" fontWeight="bold">Batería</text>
      </svg>
    ),
    sensor_sound: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="18" y="22" width="44" height="26" rx="3" fill="#312E81" stroke="#4338CA" strokeWidth="1.5"/>
        <circle cx="40" cy="35" r="8" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5"/>
        <circle cx="40" cy="35" r="3" fill="#818CF8"/>
        <rect x="28" y="48" width="4" height="10" rx="1" fill="#A5B4FC"/>
        <rect x="38" y="48" width="4" height="10" rx="1" fill="#A5B4FC"/>
        <rect x="48" y="48" width="4" height="10" rx="1" fill="#A5B4FC"/>
        <path d="M50 28 Q55 22 58 28" fill="none" stroke="#818CF8" strokeWidth="1.5"/>
        <path d="M52 28 Q58 18 62 28" fill="none" stroke="#818CF8" strokeWidth="1" opacity="0.5"/>
        <text x="40" y="70" textAnchor="middle" fontSize="6" fill="#818CF8" fontWeight="bold">Micrófono</text>
      </svg>
    ),
    buzzer: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <circle cx="40" cy="38" r="18" fill="#1F2937" stroke="#374151" strokeWidth="2"/>
        <circle cx="40" cy="38" r="12" fill="#111827" stroke="#4B5563" strokeWidth="1"/>
        <circle cx="40" cy="38" r="4" fill="#6B7280"/>
        <rect x="34" y="56" width="4" height="10" rx="1" fill="#EF4444"/>
        <rect x="42" y="56" width="4" height="10" rx="1" fill="#1F2937"/>
        <path d="M54 26 L60 20" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M58 32 L66 30" stroke="#F59E0B" strokeWidth="1.5"/>
        <path d="M56 38 L64 38" stroke="#F59E0B" strokeWidth="1.5"/>
        <text x="40" y="76" textAnchor="middle" fontSize="6" fill="#F59E0B" fontWeight="bold">Buzzer</text>
      </svg>
    ),
    blade: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <path d="M10 50 L15 24 L65 24 L70 50 Z" fill="#71717A" stroke="#52525B" strokeWidth="2"/>
        <path d="M15 24 L65 24" stroke="#A1A1AA" strokeWidth="1"/>
        <rect x="20" y="50" width="40" height="6" rx="2" fill="#52525B"/>
        <rect x="26" y="30" width="28" height="3" rx="1" fill="#A1A1AA"/>
        <text x="40" y="70" textAnchor="middle" fontSize="6" fill="#71717A" fontWeight="bold">Rampa</text>
      </svg>
    ),
    led_rgb: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <ellipse cx="40" cy="32" rx="14" ry="16" fill="#FCA5A5" opacity="0.4"/>
        <ellipse cx="34" cy="34" rx="10" ry="12" fill="#FCA5A5" opacity="0.3"/>
        <ellipse cx="46" cy="34" rx="10" ry="12" fill="#93C5FD" opacity="0.3"/>
        <ellipse cx="40" cy="30" rx="8" ry="10" fill="white" opacity="0.6"/>
        <rect x="36" y="44" width="8" height="8" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1"/>
        <rect x="34" y="52" width="3" height="10" rx="0.5" fill="#EF4444"/>
        <rect x="38.5" y="52" width="3" height="12" rx="0.5" fill="#22C55E"/>
        <rect x="43" y="52" width="3" height="10" rx="0.5" fill="#3B82F6"/>
        <text x="40" y="76" textAnchor="middle" fontSize="6" fill="#6366F1" fontWeight="bold">LED RGB</text>
      </svg>
    ),
    driver_l298n: (
      <svg width={s} height={s} viewBox="0 0 80 80">
        <rect x="10" y="18" width="60" height="44" rx="3" fill="#DC2626" stroke="#991B1B" strokeWidth="2"/>
        <rect x="24" y="22" width="14" height="18" rx="1" fill="#1F2937" stroke="#374151" strokeWidth="1"/>
        <rect x="42" y="22" width="14" height="18" rx="1" fill="#1F2937" stroke="#374151" strokeWidth="1"/>
        <rect x="14" y="46" width="52" height="6" rx="1" fill="#7F1D1D"/>
        {[0,1,2,3,4,5].map(i=>(
          <rect key={i} x={16+i*8.5} y="54" width="3" height="8" rx="0.5" fill="#3B82F6"/>
        ))}
        <text x="40" y="76" textAnchor="middle" fontSize="6" fill="#DC2626" fontWeight="bold">L298N</text>
      </svg>
    ),
  };
  return svgs[partId] || (
    <svg width={s} height={s} viewBox="0 0 80 80">
      <rect x="15" y="15" width="50" height="50" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
      <text x="40" y="44" textAnchor="middle" fontSize="10" fill="#6B7280">?</text>
    </svg>
  );
};

/* ================================================================
   DATOS: ROBOTS, PIEZAS, BLOQUES
   ================================================================ */
const ROBOT_TEMPLATES = [
  {
    id: 'sumo', name: 'Robot Sumo', icon: '🤼',
    color: 'from-red-500 to-orange-600',
    desc: 'Robot de combate que empuja al oponente fuera del ring.',
    parts: ['chassis_sumo','motor_dc','motor_dc','wheel','wheel','sensor_ultra','arduino','battery','driver_l298n','blade'],
    program: ['repeat_forever','detect_enemy','if_enemy_near','move_forward_fast','else','turn_right','end_if','if_edge','turn_180','end_if'],
    arena: 'sumo',
  },
  {
    id: 'line', name: 'Sigue Líneas', icon: '〰️',
    color: 'from-blue-500 to-cyan-600',
    desc: 'Robot veloz que detecta y sigue una línea negra.',
    parts: ['chassis_line','motor_dc','motor_dc','wheel','wheel','sensor_ir','sensor_ir','arduino','battery','driver_l298n'],
    program: ['repeat_forever','read_sensors','if_line_left','turn_left','end_if','if_line_right','turn_right','end_if','if_line_center','move_forward','end_if'],
    arena: 'line',
  },
  {
    id: 'dog', name: 'Perro Robot', icon: '🐕',
    color: 'from-amber-500 to-yellow-600',
    desc: 'Robot cuadrúpedo que camina, se sienta y ladra.',
    parts: ['chassis_dog','servo','servo','servo','servo','sensor_ultra','sensor_sound','arduino','battery','buzzer','led_rgb'],
    program: ['repeat_forever','walk_forward','wait_1s','check_distance','if_obstacle','sit','bark','wait_1s','turn_left','end_if'],
    arena: 'field',
  },
  {
    id: 'free', name: 'Libre', icon: '🔧',
    color: 'from-violet-500 to-purple-600',
    desc: 'Diseña tu propio robot desde cero.',
    parts: [],
    program: [],
    arena: 'field',
  },
];

/* ================================================================
   INSTRUCCIONES DE ARMADO DETALLADAS (PARA VIDA REAL)
   ================================================================ */
const ASSEMBLY_INSTRUCTIONS = {
  sumo: {
    title: '🤼 Robot Sumo de Combate',
    difficulty: 'Intermedio',
    time: '2-3 horas',
    age: '10+ años',
    intro: '¡Vamos a construir un robot súper fuerte que puede empujar a otros robots fuera del ring! Este robot usa sensores para detectar enemigos y tiene una rampa frontal para levantarlos.',
    materials: [
      { name: 'Arduino UNO', emoji: '🔌', desc: 'El cerebro del robot', quantity: 1, buyTip: 'Busca en Amazon o tiendas de electrónica local' },
      { name: 'Driver L298N', emoji: '⚡', desc: 'Controla los motores', quantity: 1, buyTip: 'Viene en módulo rojo con disipador' },
      { name: 'Motor DC con rueda', emoji: '🔄', desc: 'Hace que el robot se mueva', quantity: 2, buyTip: 'Los amarillos con caja reductora son perfectos' },
      { name: 'Sensor Ultrasónico HC-SR04', emoji: '👁️', desc: 'Detecta enemigos a distancia', quantity: 1, buyTip: 'Tiene 4 pines: VCC, Trig, Echo, GND' },
      { name: 'Batería 9V o Pack 6xAA', emoji: '🔋', desc: 'Energía para todo el robot', quantity: 1, buyTip: 'Las recargables son mejores para el ambiente' },
      { name: 'Chasis de acrílico o madera', emoji: '📦', desc: 'El cuerpo del robot', quantity: 1, buyTip: 'Puedes hacerlo con una caja de CD vieja' },
      { name: 'Cables jumper', emoji: '🔗', desc: 'Conectan todo', quantity: 20, buyTip: 'Macho-macho y macho-hembra' },
      { name: 'Rampa de metal o plástico', emoji: '⛏️', desc: 'Para levantar enemigos', quantity: 1, buyTip: 'Una regla de metal doblada funciona' },
      { name: 'Tornillos y tuercas', emoji: '🔩', desc: 'Para fijar piezas', quantity: 15, buyTip: 'M3 son los más comunes' },
    ],
    tools: ['Destornillador', 'Pinzas', 'Cinta aislante', 'Pegamento caliente'],
    steps: [
      {
        title: '📦 Paso 1: Prepara el Chasis',
        emoji: '📦',
        description: 'Primero necesitamos hacer la base donde irán todas las piezas.',
        details: [
          '1. Toma tu chasis de acrílico o madera (una caja rectangular de unos 15x10 cm es perfecta)',
          '2. Marca con un lápiz dónde irán los motores (en las esquinas traseras)',
          '3. Haz 4 agujeros pequeños para fijar cada motor',
          '¡Tip! Si usas una caja de CD, ya tiene buen tamaño'
        ],
        safety: 'Pide ayuda a un adulto si necesitas hacer agujeros',
        image: '📐'
      },
      {
        title: '🔄 Paso 2: Instala los Motores',
        emoji: '🔄',
        description: 'Los motores son los músculos del robot, ¡le dan movimiento!',
        details: [
          '1. Coloca los dos motores DC en las esquinas traseras del chasis',
          '2. Los ejes de los motores deben apuntar hacia afuera',
          '3. Fija cada motor con 2 tornillos o usa abrazaderas',
          '4. Conecta las ruedas a los ejes de los motores',
          '¡Importante! Los cables de cada motor deben quedar accesibles'
        ],
        safety: 'No aprietes demasiado los tornillos para no romper el motor',
        image: '⚙️'
      },
      {
        title: '👁️ Paso 3: Coloca el Sensor Ultrasónico',
        emoji: '👁️',
        description: 'Este sensor es como los ojos del robot, detecta cosas a distancia.',
        details: [
          '1. El sensor tiene dos círculos (parecen ojos) - ese lado va hacia adelante',
          '2. Fíjalo en la parte delantera del chasis, a unos 3-4 cm del suelo',
          '3. Usa pegamento caliente o haz un soporte con cartón',
          '4. Debe poder "ver" hacia el frente sin obstáculos'
        ],
        safety: 'El pegamento caliente quema, pide ayuda a un adulto',
        image: '👀'
      },
      {
        title: '🔌 Paso 4: Monta el Arduino',
        emoji: '🔌',
        description: 'El Arduino es el cerebro del robot, aquí va el programa.',
        details: [
          '1. Coloca el Arduino en el centro del chasis',
          '2. Puedes pegarlo con cinta doble cara o atornillarlo',
          '3. El puerto USB debe quedar accesible para programar',
          '4. Deja espacio alrededor para los cables'
        ],
        safety: 'No toques los componentes del Arduino con los dedos mojados',
        image: '🧠'
      },
      {
        title: '⚡ Paso 5: Conecta el Driver L298N',
        emoji: '⚡',
        description: 'El driver amplifica la señal del Arduino para mover los motores.',
        details: [
          '1. Coloca el driver L298N cerca de los motores',
          '2. Conecta los cables de los motores a las salidas OUT1-OUT2 y OUT3-OUT4',
          '3. Conecta IN1, IN2, IN3, IN4 a los pines digitales del Arduino (ej: 5, 6, 9, 10)',
          '4. Conecta GND del driver al GND del Arduino',
          '5. El pin 12V del driver va a la batería positivo (+)'
        ],
        safety: 'Verifica la polaridad antes de conectar la batería',
        image: '🔗'
      },
      {
        title: '🔋 Paso 6: Instala la Batería',
        emoji: '🔋',
        description: 'La batería es la energía que hace funcionar todo.',
        details: [
          '1. El positivo (+) de la batería va al pin 12V del driver',
          '2. El negativo (-) va al GND (tierra) común',
          '3. Puedes agregar un interruptor para encender/apagar fácilmente',
          '4. Fija la batería con velcro o una banda elástica'
        ],
        safety: 'Nunca conectes la batería al revés, puede dañar los componentes',
        image: '⚡'
      },
      {
        title: '⛏️ Paso 7: Agrega la Rampa Frontal',
        emoji: '⛏️',
        description: 'La rampa es el arma del robot, levanta a los enemigos.',
        details: [
          '1. Corta una pieza de metal o plástico resistente de unos 12 cm',
          '2. Dóblala un poco para formar un ángulo de unos 30 grados',
          '3. Fíjala en la parte delantera, debajo del sensor',
          '4. Debe tocar el suelo ligeramente para poder levantar otros robots'
        ],
        safety: 'Cuidado con los bordes del metal, pueden cortar',
        image: '🛡️'
      },
      {
        title: '🔗 Paso 8: Conecta el Sensor al Arduino',
        emoji: '🔗',
        description: 'Ahora conectamos los ojos al cerebro.',
        details: [
          '1. VCC del sensor → 5V del Arduino',
          '2. GND del sensor → GND del Arduino',
          '3. TRIG del sensor → Pin digital 7 del Arduino',
          '4. ECHO del sensor → Pin digital 8 del Arduino',
          '¡Listo! El sensor ya puede enviar información al Arduino'
        ],
        safety: 'Asegúrate de que no haya cables sueltos que puedan hacer cortocircuito',
        image: '🔌'
      },
      {
        title: '✅ Paso 9: Prueba Final',
        emoji: '✅',
        description: '¡Es hora de probar tu robot sumo!',
        details: [
          '1. Revisa todas las conexiones una última vez',
          '2. Carga el programa de sumo en el Arduino',
          '3. Enciende el robot con el interruptor',
          '4. Pon tu mano frente al sensor - el robot debería reaccionar',
          '¡Felicidades! Tu robot sumo está listo para competir'
        ],
        safety: 'Prueba primero en un espacio amplio lejos de objetos frágiles',
        image: '🎉'
      }
    ],
    tips: [
      '💡 El peso es importante: un robot más pesado es más difícil de empujar',
      '💡 Las ruedas de goma tienen mejor agarre que las de plástico',
      '💡 Baja el centro de gravedad poniendo la batería abajo',
      '💡 El sensor debe estar a la altura del chasis enemigo'
    ],
    code: `// Código básico para Robot Sumo
#define TRIG 7
#define ECHO 8
#define MOTOR_IZQ_A 5
#define MOTOR_IZQ_B 6
#define MOTOR_DER_A 9
#define MOTOR_DER_B 10

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(MOTOR_IZQ_A, OUTPUT);
  pinMode(MOTOR_IZQ_B, OUTPUT);
  pinMode(MOTOR_DER_A, OUTPUT);
  pinMode(MOTOR_DER_B, OUTPUT);
}

void loop() {
  int distancia = medirDistancia();
  if (distancia < 30) {
    // ¡Enemigo detectado! Atacar
    avanzar(255);
  } else {
    // Buscar enemigo girando
    girarDerecha(150);
  }
  delay(50);
}

int medirDistancia() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH) / 58;
}`
  },
  line: {
    title: '〰️ Robot Sigue Líneas Veloz',
    difficulty: 'Principiante',
    time: '1-2 horas',
    age: '8+ años',
    intro: '¡Este robot es súper inteligente! Puede seguir una línea negra en el piso sin perderse. Usa sensores infrarrojos que detectan colores claros y oscuros.',
    materials: [
      { name: 'Arduino UNO', emoji: '🔌', desc: 'El cerebro del robot', quantity: 1, buyTip: 'También sirve un Arduino Nano' },
      { name: 'Driver L298N', emoji: '⚡', desc: 'Controla los motores', quantity: 1, buyTip: 'O un driver L293D más pequeño' },
      { name: 'Motor DC con rueda', emoji: '🔄', desc: 'Para moverse', quantity: 2, buyTip: 'Los amarillos de caja reductora' },
      { name: 'Sensor Infrarrojo TCRT5000', emoji: '🔴', desc: 'Detecta la línea negra', quantity: 2, buyTip: 'O módulos FC-51 que ya vienen armados' },
      { name: 'Batería 9V o Pack 4xAA', emoji: '🔋', desc: 'Energía', quantity: 1, buyTip: 'Las AA duran más' },
      { name: 'Chasis de robot 2WD', emoji: '📦', desc: 'Body del robot', quantity: 1, buyTip: 'Venden kits con chasis y motores' },
      { name: 'Rueda loca', emoji: '🔵', desc: 'Tercer punto de apoyo', quantity: 1, buyTip: 'Una canica en un soporte también sirve' },
      { name: 'Cables jumper', emoji: '🔗', desc: 'Para conectar', quantity: 15, buyTip: 'Macho-hembra mayormente' },
    ],
    tools: ['Destornillador pequeño', 'Cinta aislante'],
    steps: [
      {
        title: '📦 Paso 1: Arma el Chasis',
        emoji: '📦',
        description: 'Prepara la base del robot con los motores y ruedas.',
        details: [
          '1. Si compraste un kit, sigue las instrucciones para armar el chasis',
          '2. Si lo haces casero, usa una base de unos 12x8 cm',
          '3. Instala los dos motores en los lados',
          '4. Pon la rueda loca en la parte delantera'
        ],
        safety: 'Fija bien los motores para que no se muevan',
        image: '🚗'
      },
      {
        title: '🔴 Paso 2: Instala los Sensores IR',
        emoji: '🔴',
        description: 'Los sensores van debajo del robot, mirando al piso.',
        details: [
          '1. Coloca los dos sensores en la parte delantera, separados unos 3 cm',
          '2. Deben estar a solo 0.5-1 cm del suelo',
          '3. Apuntan hacia abajo para "ver" la línea',
          '4. Uno va a la izquierda de centro, otro a la derecha',
          'La distancia entre ellos debe ser menor que el ancho de la línea'
        ],
        safety: 'Los sensores son delicados, no los presiones mucho',
        image: '👁️'
      },
      {
        title: '🔌 Paso 3: Monta el Arduino y Driver',
        emoji: '🔌',
        description: 'Coloca los componentes electrónicos en el chasis.',
        details: [
          '1. El Arduino va en el centro o parte trasera',
          '2. El driver L298N cerca de los motores',
          '3. Usa cinta doble cara o tornillos para fijarlos',
          '4. Deja el puerto USB accesible'
        ],
        safety: 'Evita que los componentes toquen partes metálicas',
        image: '🧠'
      },
      {
        title: '🔗 Paso 4: Conecta Todo',
        emoji: '🔗',
        description: 'Hora de cablear todas las conexiones.',
        details: [
          '1. Motores → OUT del driver (izq: OUT1-2, der: OUT3-4)',
          '2. Driver IN1-IN4 → Pines Arduino 5, 6, 9, 10',
          '3. Sensor izquierdo OUT → Arduino A0',
          '4. Sensor derecho OUT → Arduino A1',
          '5. VCC de sensores → 5V, GND → GND',
          '6. Batería + → Driver 12V, Batería - → GND común'
        ],
        safety: 'Revisa dos veces antes de encender',
        image: '⚡'
      },
      {
        title: '✅ Paso 5: Prepara la Pista y Prueba',
        emoji: '✅',
        description: '¡Crea una pista y prueba tu robot!',
        details: [
          '1. Dibuja una línea negra en papel blanco (cinta eléctrica funciona)',
          '2. La línea debe ser de unos 2-3 cm de ancho',
          '3. Carga el programa en el Arduino',
          '4. Pon el robot sobre la línea y enciéndelo',
          '5. Ajusta la sensibilidad con el potenciómetro del sensor si es necesario'
        ],
        safety: 'Prueba con curvas suaves primero',
        image: '🏁'
      }
    ],
    tips: [
      '💡 La línea debe ser negra sobre fondo blanco para mejor detección',
      '💡 Ajusta la altura de los sensores si no detecta bien',
      '💡 Empieza con velocidad lenta para que no se salga de la línea',
      '💡 Las curvas cerradas son más difíciles'
    ],
    code: `// Código básico para Robot Sigue Líneas
#define SENSOR_IZQ A0
#define SENSOR_DER A1
#define MOTOR_IZQ_A 5
#define MOTOR_IZQ_B 6
#define MOTOR_DER_A 9
#define MOTOR_DER_B 10

int velocidad = 150;

void setup() {
  pinMode(MOTOR_IZQ_A, OUTPUT);
  pinMode(MOTOR_IZQ_B, OUTPUT);
  pinMode(MOTOR_DER_A, OUTPUT);
  pinMode(MOTOR_DER_B, OUTPUT);
}

void loop() {
  int izq = analogRead(SENSOR_IZQ);
  int der = analogRead(SENSOR_DER);
  
  // Umbral de detección (ajustar según sensor)
  bool lineaIzq = izq > 500;
  bool lineaDer = der > 500;
  
  if (lineaIzq && lineaDer) {
    avanzar(velocidad);  // Línea en centro
  } else if (lineaIzq) {
    girarIzquierda(velocidad);  // Línea a la izq
  } else if (lineaDer) {
    girarDerecha(velocidad);  // Línea a la der
  } else {
    detener();  // Perdió la línea
  }
  delay(10);
}`
  },
  dog: {
    title: '🐕 Perro Robot Cuadrúpedo',
    difficulty: 'Avanzado',
    time: '4-6 horas',
    age: '12+ años',
    intro: '¡Este es el proyecto más divertido! Vamos a construir un perrito robot que camina con 4 patas, puede sentarse, ladrar y hasta detectar obstáculos. Usa servomotores para mover las patas.',
    materials: [
      { name: 'Arduino UNO o Nano', emoji: '🔌', desc: 'El cerebro del perrito', quantity: 1, buyTip: 'Nano si quieres algo más compacto' },
      { name: 'Servo Motor SG90', emoji: '🦿', desc: 'Para mover las patas', quantity: 4, buyTip: 'Los pequeños azules son perfectos' },
      { name: 'Sensor Ultrasónico HC-SR04', emoji: '👁️', desc: 'Para ver obstáculos', quantity: 1, buyTip: 'Será la nariz del perrito' },
      { name: 'Módulo de sonido/micrófono', emoji: '👂', desc: 'Para escuchar comandos', quantity: 1, buyTip: 'Módulo KY-037 o similar' },
      { name: 'Buzzer activo', emoji: '🔊', desc: 'Para ladrar', quantity: 1, buyTip: 'Los pequeños de 5V' },
      { name: 'LED RGB', emoji: '💡', desc: 'Los ojos del perrito', quantity: 1, buyTip: 'O 2 LEDs normales' },
      { name: 'Batería LiPo 7.4V o Pack 6xAA', emoji: '🔋', desc: 'Energía', quantity: 1, buyTip: '4 servos necesitan buena energía' },
      { name: 'Cuerpo impreso 3D o cartón', emoji: '📦', desc: 'El cuerpo del perrito', quantity: 1, buyTip: 'Hay muchos diseños gratis en Thingiverse' },
      { name: 'Cables y conectores', emoji: '🔗', desc: 'Para todo', quantity: 20, buyTip: 'Los servos traen sus propios cables' },
    ],
    tools: ['Destornillador', 'Pistola de silicona', 'Tijeras', 'Regla'],
    steps: [
      {
        title: '📐 Paso 1: Diseña o Consigue el Cuerpo',
        emoji: '📐',
        description: 'Necesitas un cuerpo con espacio para 4 servos.',
        details: [
          '1. Si tienes impresora 3D, busca "quadruped robot" en Thingiverse',
          '2. Si no, puedes hacer uno con cartón grueso o madera',
          '3. El cuerpo debe tener 4 espacios para los servos (las caderas)',
          '4. Cada pata necesita 1 servo para moverse arriba/abajo',
          'Tamaño recomendado: cuerpo de 10x6 cm, patas de 5 cm'
        ],
        safety: 'Si usas tijeras o cutter, ten cuidado',
        image: '🏗️'
      },
      {
        title: '🦿 Paso 2: Prepara las Patas',
        emoji: '🦿',
        description: 'Cada pata tiene un servo y una extensión.',
        details: [
          '1. Toma el brazo (horn) que viene con cada servo',
          '2. Pega o atornilla una extensión de cartón/madera de 5 cm',
          '3. Haz 4 patas iguales',
          '4. Puedes agregar una punta de goma para mejor agarre',
          'Las patas delanteras y traseras son iguales'
        ],
        safety: 'El pegamento caliente puede quemar',
        image: '🦵'
      },
      {
        title: '⚙️ Paso 3: Instala los Servos',
        emoji: '⚙️',
        description: 'Coloca los 4 servos en el cuerpo.',
        details: [
          '1. Los servos van en las 4 esquinas del cuerpo',
          '2. El eje de cada servo debe apuntar hacia afuera y abajo',
          '3. Fíjalos con tornillos o pegamento caliente',
          '4. Asegúrate de que todos giren libremente',
          '5. Conecta los brazos con las patas a cada servo'
        ],
        safety: 'No fuerces los servos, son delicados',
        image: '🔧'
      },
      {
        title: '👃 Paso 4: Agrega la Cabeza',
        emoji: '👃',
        description: 'La cabeza tiene el sensor, buzzer y LEDs.',
        details: [
          '1. Haz una caja pequeña para la cabeza (4x3x3 cm)',
          '2. El sensor ultrasónico va al frente (es la nariz)',
          '3. Pon el LED RGB arriba (serán los ojos)',
          '4. El buzzer va adentro (para ladrar)',
          '5. Pega la cabeza al frente del cuerpo'
        ],
        safety: 'Deja espacio para los cables que salen de la cabeza',
        image: '🐶'
      },
      {
        title: '🔌 Paso 5: Monta la Electrónica',
        emoji: '🔌',
        description: 'Coloca el Arduino y la batería en el cuerpo.',
        details: [
          '1. El Arduino va en la parte superior del cuerpo',
          '2. La batería va debajo o atrás para equilibrar peso',
          '3. Organiza los cables para que no estorben las patas',
          '4. Usa velcro para poder quitar la batería fácilmente'
        ],
        safety: 'Verifica que nada se atore con las patas al moverse',
        image: '🧠'
      },
      {
        title: '🔗 Paso 6: Conecta los Servos',
        emoji: '🔗',
        description: 'Cada servo tiene 3 cables: señal, VCC, GND.',
        details: [
          '1. Servo pata delantera izquierda → Pin 3',
          '2. Servo pata delantera derecha → Pin 5',
          '3. Servo pata trasera izquierda → Pin 6',
          '4. Servo pata trasera derecha → Pin 9',
          '5. IMPORTANTE: Los servos necesitan buena corriente',
          'Conecta VCC de servos a la batería, no al Arduino 5V'
        ],
        safety: '4 servos juntos pueden consumir mucha corriente',
        image: '⚡'
      },
      {
        title: '🎛️ Paso 7: Conecta Sensores y Salidas',
        emoji: '🎛️',
        description: 'Conecta el sensor, micrófono, buzzer y LEDs.',
        details: [
          '1. Sensor ultrasónico: TRIG→Pin 7, ECHO→Pin 8',
          '2. Micrófono OUT → Pin A0',
          '3. Buzzer → Pin 11',
          '4. LED RGB: R→Pin 10, G→Pin 12, B→Pin 13',
          '5. Todos los GND juntos, VCC a 5V del Arduino'
        ],
        safety: 'El LED RGB puede necesitar resistencias de 220Ω',
        image: '📡'
      },
      {
        title: '✅ Paso 8: Calibra y Programa',
        emoji: '✅',
        description: '¡Hora de dar vida a tu perrito!',
        details: [
          '1. Carga un programa de prueba que ponga todos los servos a 90°',
          '2. Con los servos a 90°, ajusta las patas para que estén rectas',
          '3. Carga el programa completo de caminar',
          '4. Prueba cada movimiento: caminar, sentarse, ladrar',
          '¡Felicidades! Tu perrito robot está vivo 🎉'
        ],
        safety: 'Si un servo hace ruido raro, apágalo y revisa',
        image: '🐕'
      }
    ],
    tips: [
      '💡 Calibra los servos a 90° antes de pegar las patas',
      '💡 Usa una fuente de alimentación externa para los servos',
      '💡 El equilibrio es importante: distribuye el peso uniformemente',
      '💡 Empieza con movimientos pequeños y lentos',
      '💡 Los servos se calientan si se bloquean, ¡ten cuidado!'
    ],
    code: `// Código básico para Perro Robot
#include <Servo.h>

Servo pataFI, pataFD, pataTI, pataTD;
#define BUZZER 11
#define TRIG 7
#define ECHO 8

void setup() {
  pataFI.attach(3);
  pataFD.attach(5);
  pataTI.attach(6);
  pataTD.attach(9);
  
  pinMode(BUZZER, OUTPUT);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  
  // Posición inicial: parado
  posicionParado();
}

void posicionParado() {
  pataFI.write(90);
  pataFD.write(90);
  pataTI.write(90);
  pataTD.write(90);
}

void caminar() {
  // Paso 1: Levanta patas izquierdas
  pataFI.write(60);
  pataTI.write(60);
  delay(200);
  
  // Paso 2: Baja y levanta derechas
  pataFI.write(90);
  pataTI.write(90);
  pataFD.write(60);
  pataTD.write(60);
  delay(200);
  
  // Paso 3: Baja derechas
  pataFD.write(90);
  pataTD.write(90);
  delay(200);
}

void ladrar() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER, HIGH);
    delay(100);
    digitalWrite(BUZZER, LOW);
    delay(100);
  }
}

void loop() {
  int dist = medirDistancia();
  if (dist < 20) {
    ladrar();
    sentarse();
  } else {
    caminar();
  }
}`
  },
  free: {
    title: '🔧 Diseño Libre',
    difficulty: 'Variable',
    time: 'Lo que necesites',
    age: 'Todas las edades',
    intro: '¡Aquí puedes crear el robot que imagines! Usa las piezas disponibles para diseñar tu propia creación. No hay reglas, solo tu creatividad.',
    materials: [
      { name: 'Depende de tu diseño', emoji: '❓', desc: 'Elige las piezas que necesites', quantity: 0, buyTip: 'Empieza simple y ve agregando' },
    ],
    tools: ['Lo que tengas disponible'],
    steps: [
      {
        title: '💭 Paso 1: Imagina tu Robot',
        emoji: '💭',
        description: '¿Qué quieres que haga tu robot?',
        details: [
          '1. Piensa en la función principal: ¿se mueve? ¿detecta cosas? ¿hace sonidos?',
          '2. Dibuja un boceto simple en papel',
          '3. Haz una lista de las piezas que necesitas',
          '4. ¡Sé creativo! No hay respuestas incorrectas'
        ],
        safety: 'Empieza con algo simple y ve mejorando',
        image: '✨'
      },
      {
        title: '🔧 Paso 2: Construye y Experimenta',
        emoji: '🔧',
        description: '¡Manos a la obra!',
        details: [
          '1. Arma tu robot paso a paso',
          '2. Prueba cada parte antes de agregar más',
          '3. No tengas miedo de equivocarte',
          '4. Los mejores inventores aprenden de sus errores'
        ],
        safety: 'Recuerda pedir ayuda si usas herramientas peligrosas',
        image: '🛠️'
      }
    ],
    tips: [
      '💡 Empieza simple: un motor y un sensor son suficientes para empezar',
      '💡 Usa materiales reciclados para el cuerpo',
      '💡 Busca inspiración en Internet pero hazlo tuyo',
      '💡 ¡Diviértete experimentando!'
    ],
    code: `// Tu código aquí
// Ejemplo básico:
void setup() {
  // Configura tus pines
}

void loop() {
  // Tu lógica aquí
}`
  }
};

// Frases del robot para TTS
const ROBOT_INSTRUCTION_PHRASES = [
  '¡Escucha con atención!',
  '¡Te explico este paso!',
  '¡Esto es importante!',
  '¡Vamos con el siguiente!',
  '¡Presta mucha atención!',
];

const ALL_PARTS = [
  { id: 'chassis_sumo', name: 'Chasis Sumo', cat: 'Chasis', svg: 'chassis_sumo' },
  { id: 'chassis_line', name: 'Chasis Veloz', cat: 'Chasis', svg: 'chassis_line' },
  { id: 'chassis_dog', name: 'Cuerpo Perro', cat: 'Chasis', svg: 'chassis_dog' },
  { id: 'motor_dc', name: 'Motor DC', cat: 'Motores', svg: 'motor_dc' },
  { id: 'servo', name: 'Servo Motor', cat: 'Motores', svg: 'servo' },
  { id: 'wheel', name: 'Rueda Goma', cat: 'Ruedas', svg: 'wheel' },
  { id: 'sensor_ultra', name: 'Ultrasónico', cat: 'Sensores', svg: 'sensor_ultra' },
  { id: 'sensor_ir', name: 'Infrarrojo', cat: 'Sensores', svg: 'sensor_ir' },
  { id: 'sensor_sound', name: 'Micrófono', cat: 'Sensores', svg: 'sensor_sound' },
  { id: 'arduino', name: 'Arduino UNO', cat: 'Control', svg: 'arduino' },
  { id: 'battery', name: 'Batería 9V', cat: 'Energía', svg: 'battery' },
  { id: 'driver_l298n', name: 'Driver L298N', cat: 'Control', svg: 'driver_l298n' },
  { id: 'buzzer', name: 'Buzzer', cat: 'Otros', svg: 'buzzer' },
  { id: 'led_rgb', name: 'LED RGB', cat: 'Otros', svg: 'led_rgb' },
  { id: 'blade', name: 'Rampa Frontal', cat: 'Otros', svg: 'blade' },
];

const PROGRAM_BLOCKS = [
  { id: 'move_forward', label: '⬆️ Avanzar', cat: 'Movimiento', color: 'bg-blue-500', code: 'avanzar(150);', hint: 'El robot va hacia adelante' },
  { id: 'move_forward_fast', label: '⏩ Avanzar Rápido', cat: 'Movimiento', color: 'bg-blue-600', code: 'avanzar(255);', hint: '¡A toda velocidad!' },
  { id: 'move_backward', label: '⬇️ Retroceder', cat: 'Movimiento', color: 'bg-blue-400', code: 'retroceder(150);', hint: 'Va para atrás' },
  { id: 'turn_left', label: '⬅️ Girar Izquierda', cat: 'Movimiento', color: 'bg-indigo-500', code: 'girarIzq();', hint: 'Gira hacia la izquierda' },
  { id: 'turn_right', label: '➡️ Girar Derecha', cat: 'Movimiento', color: 'bg-indigo-500', code: 'girarDer();', hint: 'Gira hacia la derecha' },
  { id: 'turn_180', label: '🔄 Giro 180°', cat: 'Movimiento', color: 'bg-indigo-600', code: 'giro180();', hint: 'Da media vuelta' },
  { id: 'stop', label: '⏹️ Detener', cat: 'Movimiento', color: 'bg-gray-500', code: 'detener();', hint: 'El robot se para' },
  { id: 'walk_forward', label: '🐾 Caminar', cat: 'Movimiento', color: 'bg-amber-500', code: 'caminar(4);', hint: 'Mueve las 4 patas' },
  { id: 'sit', label: '🐕 Sentarse', cat: 'Movimiento', color: 'bg-amber-400', code: 'sentarse();', hint: 'El perro se sienta' },
  { id: 'detect_enemy', label: '📡 Buscar Enemigo', cat: 'Sensores', color: 'bg-cyan-500', code: 'dist = ultrasonico.medir();', hint: 'Revisa si hay alguien cerca' },
  { id: 'read_sensors', label: '🔴 Leer Sensores', cat: 'Sensores', color: 'bg-cyan-500', code: 'sL=leerIR(A0); sR=leerIR(A1);', hint: 'Lee los ojos infrarrojos' },
  { id: 'check_distance', label: '📏 Medir Distancia', cat: 'Sensores', color: 'bg-cyan-400', code: 'dist = ultrasonico.medir();', hint: '¿Qué tan lejos está algo?' },
  { id: 'if_enemy_near', label: '🚨 Si Enemigo Cerca', cat: 'Pregunta', color: 'bg-amber-500', code: 'if (dist < 25) {', hint: '¿Hay alguien a menos de 25cm?' },
  { id: 'if_obstacle', label: '🚧 Si Hay Obstáculo', cat: 'Pregunta', color: 'bg-amber-500', code: 'if (dist < 20) {', hint: '¿Hay algo bloqueando?' },
  { id: 'if_line_left', label: '↩️ Si Línea a Izq.', cat: 'Pregunta', color: 'bg-amber-500', code: 'if (sL > umbral) {', hint: '¿La línea está a la izquierda?' },
  { id: 'if_line_right', label: '↪️ Si Línea a Der.', cat: 'Pregunta', color: 'bg-amber-500', code: 'if (sR > umbral) {', hint: '¿La línea está a la derecha?' },
  { id: 'if_line_center', label: '⬆️ Si Línea al Centro', cat: 'Pregunta', color: 'bg-amber-400', code: 'if (sL<umbral && sR<umbral) {', hint: '¿La línea está al medio?' },
  { id: 'if_edge', label: '⚠️ Si Borde del Ring', cat: 'Pregunta', color: 'bg-orange-500', code: 'if (sensorBorde == LOW) {', hint: '¡Cuidado con la orilla!' },
  { id: 'else', label: '↔️ Si No...', cat: 'Pregunta', color: 'bg-yellow-500', code: '} else {', hint: 'Qué hacer si la respuesta es NO' },
  { id: 'end_if', label: '🔚 Fin Pregunta', cat: 'Pregunta', color: 'bg-yellow-400', code: '}', hint: 'Cierra la pregunta' },
  { id: 'wait_1s', label: '⏱️ Esperar 1 seg', cat: 'Control', color: 'bg-purple-500', code: 'delay(1000);', hint: 'Pausa de 1 segundo' },
  { id: 'wait_half', label: '⏱️ Esperar 0.5 seg', cat: 'Control', color: 'bg-purple-400', code: 'delay(500);', hint: 'Pausa cortita' },
  { id: 'repeat_forever', label: '♾️ Repetir Siempre', cat: 'Control', color: 'bg-purple-600', code: 'while(true) {', hint: 'Hace lo mismo una y otra vez' },
  { id: 'repeat_3', label: '🔁 Repetir 3 veces', cat: 'Control', color: 'bg-purple-500', code: 'for(int i=0;i<3;i++){', hint: 'Repite 3 veces' },
  { id: 'bark', label: '🔊 Ladrar', cat: 'Acción', color: 'bg-rose-500', code: 'tone(BUZZER,1000,200);', hint: '¡El robot hace sonido!' },
  { id: 'led_on', label: '💡 Prender Luz', cat: 'Acción', color: 'bg-rose-400', code: 'digitalWrite(LED,HIGH);', hint: '¡Se enciende la lucecita!' },
  { id: 'led_off', label: '🔌 Apagar Luz', cat: 'Acción', color: 'bg-rose-300', code: 'digitalWrite(LED,LOW);', hint: 'Se apaga la lucecita' },
];

// Kid-friendly tips for each build phase
const BUILD_TIPS = {
  sumo: [
    '🤖 Un robot sumo necesita ser pesado y fuerte',
    '👁️ El sensor ultrasónico son los "ojos" del robot',
    '⚙️ Los motores son los "músculos" que lo mueven',
    '🧠 El Arduino es el "cerebro" - procesa la información',
    '🔋 Sin batería no hay energía - como comer le da energía a tu cuerpo',
  ],
  line: [
    '〰️ Los sensores infrarrojos detectan colores claros y oscuros',
    '🔴 Funcionan como tus ojos mirando al piso',
    '⚙️ Los motores giran las ruedas para seguir la línea',
    '🧠 El Arduino decide: ¿giro izquierda o derecha?',
    '💡 La velocidad del robot depende de cuánta energía le des',
  ],
  dog: [
    '🐕 Cada pata tiene un servo motor que la mueve',
    '🦿 Los servos giran a posiciones exactas (como un reloj)',
    '👂 El micrófono escucha sonidos a su alrededor',
    '🔊 El buzzer es como una bocina pequeña para ladrar',
    '👁️ El sensor ultrasónico le ayuda a no chocar con cosas',
  ],
  free: [
    '✨ ¡Usa tu imaginación para crear algo único!',
    '🔧 Puedes combinar cualquier pieza que quieras',
    '💡 Empieza con pocas piezas e ir agregando',
    '🧪 ¡Experimenta! No hay respuestas equivocadas',
  ],
};

// Kid-friendly programming tips
const PROGRAM_TIPS = [
  '💡 Las instrucciones se ejecutan de arriba hacia abajo, como leer',
  '🔄 "Repetir" hace que el robot haga lo mismo muchas veces',
  '❓ Las "Preguntas" hacen que el robot tome decisiones',
  '📡 Los "Sensores" son como los sentidos del robot',
  '⚡ Puedes subir y bajar bloques para cambiar el orden',
];

/* ================================================================
   COMPONENT: Drag-and-drop workspace part
   ================================================================ */
const DraggablePart = ({ part, index, onRemove }) => {
  return (
    <div
      className="relative group flex flex-col items-center animate-scale-in"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ from: 'workspace', index }));
      }}
    >
      <div className="w-[68px] h-[68px] bg-white rounded-xl border-2 border-dashed border-[#E5E5E5] flex items-center justify-center hover:border-[#CE82FF] transition cursor-grab active:cursor-grabbing">
        <PartSVG partId={part.svg} size={56} />
      </div>
      <span className="text-[9px] font-bold text-gray-600 mt-0.5 text-center leading-tight max-w-[68px] truncate">{part.name}</span>
      <button
        onClick={() => onRemove(index)}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600 z-10"
      >×</button>
    </div>
  );
};

/* ================================================================
   COMPONENT: Catalog part (draggable from palette)
   ================================================================ */
const CatalogPart = ({ part, onAdd }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ from: 'catalog', partId: part.id }));
    }}
    onClick={() => onAdd(part)}
    className="flex flex-col items-center p-2 bg-white rounded-xl border border-gray-200 cursor-grab active:cursor-grabbing hover:border-violet-400 hover:shadow-md transition active:scale-95 group"
  >
    <PartSVG partId={part.svg} size={50} />
    <span className="text-[9px] font-bold text-gray-700 mt-1 text-center leading-tight">{part.name}</span>
  </div>
);

/* ================================================================
   CHASSIS ASSEMBLY VIEW - Visual robot assembly on a workbench
   ================================================================ */
const CHASSIS_SLOTS = {
  sumo: [
    { id: 'chassis', label: 'Chasis', x: 50, y: 42, w: 44, h: 28, accepts: ['Chasis'], icon: '🏗️' },
    { id: 'brain', label: 'Arduino', x: 50, y: 34, w: 18, h: 12, accepts: ['Control'], icon: '🧠' },
    { id: 'motor_l', label: 'Motor Izq', x: 22, y: 50, w: 14, h: 14, accepts: ['Motores'], icon: '⚙️' },
    { id: 'motor_r', label: 'Motor Der', x: 78, y: 50, w: 14, h: 14, accepts: ['Motores'], icon: '⚙️' },
    { id: 'wheel_l', label: 'Rueda Izq', x: 14, y: 50, w: 12, h: 16, accepts: ['Ruedas'], icon: '⭕' },
    { id: 'wheel_r', label: 'Rueda Der', x: 86, y: 50, w: 12, h: 16, accepts: ['Ruedas'], icon: '⭕' },
    { id: 'sensor_f', label: 'Sensor', x: 50, y: 22, w: 16, h: 10, accepts: ['Sensores'], icon: '📡' },
    { id: 'power', label: 'Batería', x: 50, y: 58, w: 14, h: 10, accepts: ['Energía'], icon: '🔋' },
    { id: 'driver', label: 'Driver', x: 35, y: 50, w: 12, h: 10, accepts: ['Control'], icon: '🔌' },
    { id: 'extra', label: 'Extra', x: 50, y: 68, w: 14, h: 10, accepts: ['Otros'], icon: '➕' },
  ],
  line: [
    { id: 'chassis', label: 'Chasis', x: 50, y: 42, w: 40, h: 24, accepts: ['Chasis'], icon: '🏗️' },
    { id: 'brain', label: 'Arduino', x: 50, y: 34, w: 18, h: 12, accepts: ['Control'], icon: '🧠' },
    { id: 'motor_l', label: 'Motor Izq', x: 24, y: 48, w: 14, h: 14, accepts: ['Motores'], icon: '⚙️' },
    { id: 'motor_r', label: 'Motor Der', x: 76, y: 48, w: 14, h: 14, accepts: ['Motores'], icon: '⚙️' },
    { id: 'wheel_l', label: 'Rueda Izq', x: 16, y: 48, w: 12, h: 16, accepts: ['Ruedas'], icon: '⭕' },
    { id: 'wheel_r', label: 'Rueda Der', x: 84, y: 48, w: 12, h: 16, accepts: ['Ruedas'], icon: '⭕' },
    { id: 'sensor_l', label: 'IR Izq', x: 38, y: 22, w: 12, h: 10, accepts: ['Sensores'], icon: '🔴' },
    { id: 'sensor_r', label: 'IR Der', x: 62, y: 22, w: 12, h: 10, accepts: ['Sensores'], icon: '🔴' },
    { id: 'power', label: 'Batería', x: 50, y: 58, w: 14, h: 10, accepts: ['Energía'], icon: '🔋' },
    { id: 'driver', label: 'Driver', x: 50, y: 50, w: 12, h: 10, accepts: ['Control'], icon: '🔌' },
  ],
  dog: [
    { id: 'chassis', label: 'Cuerpo', x: 50, y: 38, w: 36, h: 22, accepts: ['Chasis'], icon: '🏗️' },
    { id: 'brain', label: 'Arduino', x: 50, y: 32, w: 16, h: 10, accepts: ['Control'], icon: '🧠' },
    { id: 'leg_fl', label: 'Pata FI', x: 26, y: 56, w: 12, h: 14, accepts: ['Motores'], icon: '🦿' },
    { id: 'leg_fr', label: 'Pata FD', x: 74, y: 56, w: 12, h: 14, accepts: ['Motores'], icon: '🦿' },
    { id: 'leg_bl', label: 'Pata TI', x: 30, y: 42, w: 12, h: 14, accepts: ['Motores'], icon: '🦿' },
    { id: 'leg_br', label: 'Pata TD', x: 70, y: 42, w: 12, h: 14, accepts: ['Motores'], icon: '🦿' },
    { id: 'sensor_f', label: 'Sensor', x: 50, y: 20, w: 14, h: 10, accepts: ['Sensores'], icon: '📡' },
    { id: 'power', label: 'Batería', x: 50, y: 52, w: 14, h: 10, accepts: ['Energía'], icon: '🔋' },
    { id: 'speaker', label: 'Buzzer', x: 38, y: 22, w: 10, h: 8, accepts: ['Otros'], icon: '🔊' },
    { id: 'led', label: 'LED', x: 62, y: 22, w: 10, h: 8, accepts: ['Otros'], icon: '💡' },
  ],
  free: [
    { id: 'chassis', label: 'Chasis', x: 50, y: 42, w: 44, h: 28, accepts: ['Chasis'], icon: '🏗️' },
    { id: 'brain', label: 'Arduino', x: 50, y: 32, w: 18, h: 12, accepts: ['Control'], icon: '🧠' },
    { id: 'motor_l', label: 'Motor Izq', x: 22, y: 50, w: 14, h: 14, accepts: ['Motores'], icon: '⚙️' },
    { id: 'motor_r', label: 'Motor Der', x: 78, y: 50, w: 14, h: 14, accepts: ['Motores'], icon: '⚙️' },
    { id: 'wheel_l', label: 'Rueda Izq', x: 14, y: 50, w: 12, h: 16, accepts: ['Ruedas'], icon: '⭕' },
    { id: 'wheel_r', label: 'Rueda Der', x: 86, y: 50, w: 12, h: 16, accepts: ['Ruedas'], icon: '⭕' },
    { id: 'sensor_f', label: 'Sensor', x: 50, y: 20, w: 16, h: 10, accepts: ['Sensores'], icon: '📡' },
    { id: 'power', label: 'Batería', x: 50, y: 60, w: 14, h: 10, accepts: ['Energía'], icon: '🔋' },
    { id: 'driver', label: 'Driver', x: 36, y: 50, w: 12, h: 10, accepts: ['Control'], icon: '🔌' },
    { id: 'extra1', label: 'Extra 1', x: 34, y: 68, w: 12, h: 10, accepts: ['Otros'], icon: '➕' },
    { id: 'extra2', label: 'Extra 2', x: 66, y: 68, w: 12, h: 10, accepts: ['Otros'], icon: '➕' },
  ],
};

const ChassisAssemblyView = ({ template, workspace, slotAssignments, onSlotDrop, onSlotRemove }) => {
  const robotId = template?.id || 'free';
  const slots = CHASSIS_SLOTS[robotId] || CHASSIS_SLOTS.free;
  const typeColors = {
    sumo: { bg: 'from-gray-800 to-gray-900', accent: '#EF4444', grid: 'rgba(239,68,68,0.06)' },
    line: { bg: 'from-slate-700 to-slate-900', accent: '#3B82F6', grid: 'rgba(59,130,246,0.06)' },
    dog:  { bg: 'from-amber-900 to-stone-900', accent: '#F59E0B', grid: 'rgba(245,158,11,0.06)' },
    free: { bg: 'from-violet-900 to-indigo-950', accent: '#8B5CF6', grid: 'rgba(139,92,246,0.06)' },
  };
  const colors = typeColors[robotId] || typeColors.free;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border-2 border-gray-700/30`}
      style={{ aspectRatio: '4/3.5', background: `linear-gradient(145deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)` }}>
      {/* Workbench surface */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${colors.grid} 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      }}/>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 40% at 50% 45%, ${colors.accent}15 0%, transparent 70%)`,
      }}/>

      {/* Workbench label */}
      <div className="absolute top-2 left-3 z-20">
        <div className="backdrop-blur-md bg-black/40 rounded-lg px-2.5 py-1 border border-white/10">
          <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Mesa de Trabajo</div>
          <div className="text-[10px] font-bold text-white">{template?.name || 'Robot'}</div>
        </div>
      </div>
      <div className="absolute top-2 right-3 z-20">
        <div className="backdrop-blur-md bg-black/40 rounded-lg px-2.5 py-1 border border-white/10">
          <div className="text-[8px] font-bold" style={{color: colors.accent}}>{Object.keys(slotAssignments).length}/{slots.length} slots</div>
        </div>
      </div>

      {/* Connection lines between slots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        {slots.filter(s => s.id !== 'chassis').map(slot => {
          const chassis = slots.find(s => s.id === 'chassis');
          if (!chassis) return null;
          const filled = !!slotAssignments[slot.id];
          return (
            <line key={slot.id}
              x1={chassis.x} y1={chassis.y} x2={slot.x} y2={slot.y}
              stroke={filled ? colors.accent : '#334155'}
              strokeWidth="0.4"
              strokeDasharray={filled ? '0' : '1.5 1'}
              opacity={filled ? 0.6 : 0.3}
            />
          );
        })}
      </svg>

      {/* Slots */}
      {slots.map(slot => {
        const assigned = slotAssignments[slot.id];
        const part = assigned ? workspace.find(p => p.uid === assigned) : null;
        const isEmpty = !part;
        return (
          <div key={slot.id}
            className="absolute z-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer"
            style={{
              left: `${slot.x - slot.w/2}%`, top: `${slot.y - slot.h/2}%`,
              width: `${slot.w}%`, height: `${slot.h}%`,
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                onSlotDrop(slot, data);
              } catch(err) {}
            }}
            onClick={() => { if (!isEmpty) onSlotRemove(slot.id); }}
          >
            {isEmpty ? (
              <div className="w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all hover:scale-105 group"
                style={{ borderColor: `${colors.accent}40`, background: `${colors.accent}08` }}>
                <span className="text-sm opacity-60 group-hover:opacity-100 transition">{slot.icon}</span>
                <span className="text-[7px] font-bold text-gray-500 mt-0.5 group-hover:text-gray-300 transition">{slot.label}</span>
              </div>
            ) : (
              <div className="w-full h-full rounded-xl flex flex-col items-center justify-center animate-scale-in relative group"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}20, ${colors.accent}08)`,
                  border: `2px solid ${colors.accent}60`,
                  boxShadow: `0 0 12px ${colors.accent}20, inset 0 1px 4px rgba(255,255,255,0.05)`,
                }}>
                <PartSVG partId={part.svg} size={Math.min(slot.w * 2.5, 52)} />
                <span className="text-[7px] font-bold text-gray-300 mt-0 leading-tight">{part.name}</span>
                {/* Remove hint */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md" style={{fontSize:'7px'}}>✕</div>
                {/* Glow pulse */}
                <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
                  boxShadow: `0 0 8px ${colors.accent}30`,
                  animation: 'pulse-soft 2s ease-in-out infinite',
                }}/>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
        <div className="backdrop-blur-md bg-black/30 rounded-full px-3 py-1 border border-white/10">
          <span className="text-[8px] text-gray-400 font-bold">Arrastra piezas a los slots · Toca para remover</span>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   FIRMWARE UPLOAD SIMULATOR
   ================================================================ */
const FirmwareUpload = ({ isUploading, uploadProgress, uploadStep, uploadLog }) => {
  if (!isUploading && uploadProgress === 0) return null;
  return (
    <div className="bg-gray-900 rounded-2xl border-2 border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-[#58CC02] px-4 py-2.5 flex items-center justify-between border-b-2 border-[#46A302]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${uploadProgress < 100 ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}/>
          <span className="text-xs font-bold text-white flex items-center gap-1">
            <Monitor size={12}/> Arduino IDE
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-300">
          {uploadProgress < 100 ? 'Compilando...' : '✅ Listo'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-gray-400">{uploadStep}</span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">{uploadProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${uploadProgress}%`,
              background: uploadProgress < 100
                ? 'linear-gradient(90deg, #0D9488, #10B981, #34D399)'
                : 'linear-gradient(90deg, #22C55E, #4ADE80)',
              boxShadow: `0 0 8px rgba(16,185,129,0.4)`,
            }}/>
        </div>
      </div>

      {/* Terminal output */}
      <div className="px-4 py-2 max-h-[120px] overflow-y-auto">
        {uploadLog.map((line, i) => (
          <div key={i} className={`text-[10px] font-mono py-0.5 animate-slide-up
            ${line.type === 'info' ? 'text-gray-400' : ''}
            ${line.type === 'ok' ? 'text-green-400' : ''}
            ${line.type === 'warn' ? 'text-yellow-400' : ''}
            ${line.type === 'error' ? 'text-red-400' : ''}
            ${line.type === 'progress' ? 'text-cyan-400' : ''}
          `}>{line.text}</div>
        ))}
      </div>

      {/* USB connection visual */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2.5 py-1.5 border border-gray-700">
            <Wifi size={10} className="text-green-400 animate-pulse"/>
            <span className="text-[9px] font-bold text-gray-300">USB COM3</span>
          </div>
          <div className="flex gap-0.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{
                animation: `pulse 0.6s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.4 + (i * 0.2),
              }}/>
            ))}
          </div>
          <span className="text-[9px] text-gray-500 font-semibold">Transfiriendo datos...</span>
        </div>
      )}
      
      {/* Success banner */}
      {uploadProgress >= 100 && (
        <div className="mx-4 mb-3 bg-green-900/40 border border-green-600/30 rounded-xl px-3 py-2 flex items-center gap-2">
          <Check size={14} className="text-green-400"/>
          <div>
            <div className="text-[10px] font-bold text-green-300">¡Programa cargado exitosamente!</div>
            <div className="text-[9px] text-green-500">Robot listo para operar</div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   VIRTUAL D-PAD / JOYSTICK COMPONENT
   ================================================================ */
const VirtualDPad = ({ player, color, onMove, onStop, compact = false }) => {
  const holdRef = useRef(null);
  const sz = compact ? 'w-9 h-9 text-sm' : 'w-11 h-11 text-base';
  const pad = compact ? 'p-1' : 'p-1.5';
  const bg = player === 1 
    ? 'from-blue-500 to-indigo-600' 
    : 'from-red-500 to-orange-600';
  const btnBase = `${sz} rounded-xl flex items-center justify-center font-bold text-white transition active:scale-90 select-none`;
  const btnColor = player === 1
    ? 'bg-blue-500/80 hover:bg-blue-400 active:bg-blue-300 border border-blue-400/50'
    : 'bg-red-500/80 hover:bg-red-400 active:bg-red-300 border border-red-400/50';

  const startHold = (dir) => {
    onMove(dir);
    holdRef.current = setInterval(() => onMove(dir), 100);
  };
  const stopHold = () => {
    clearInterval(holdRef.current);
    onStop();
  };

  return (
    <div className={`flex flex-col items-center ${pad}`}>
      <div className={`text-[9px] font-bold mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${bg} text-white shadow-md`}>
        {player === 1 ? '🔵 J1' : '🔴 J2'} {compact ? '' : `· ${player === 1 ? 'WASD' : '↑↓←→'}`}
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div/>
        <button className={btnBase + ' ' + btnColor}
          onPointerDown={() => startHold('up')} onPointerUp={stopHold} onPointerLeave={stopHold}>▲</button>
        <div/>
        <button className={btnBase + ' ' + btnColor}
          onPointerDown={() => startHold('left')} onPointerUp={stopHold} onPointerLeave={stopHold}>◄</button>
        <button className={`${sz} rounded-xl flex items-center justify-center font-bold text-xs transition active:scale-90 bg-gray-600/60 text-gray-300 border border-gray-500/30 select-none`}
          onPointerDown={onStop}>⏹</button>
        <button className={btnBase + ' ' + btnColor}
          onPointerDown={() => startHold('right')} onPointerUp={stopHold} onPointerLeave={stopHold}>►</button>
        <div/>
        <button className={btnBase + ' ' + btnColor}
          onPointerDown={() => startHold('down')} onPointerUp={stopHold} onPointerLeave={stopHold}>▼</button>
        <div/>
      </div>
    </div>
  );
};

/* ================================================================
   BATTLE ARENA - 2 PLAYER MINI GAME (3D)
   ================================================================ */
const BattleArena = ({ robotType, arenaType, isActive, p1Pos, p2Pos, p1Trail, p2Trail, scores, countdown, winner, collisionFlash }) => {
  return (
    <div className="relative w-full mx-auto rounded-2xl overflow-hidden border-2 border-gray-700/30"
      style={{
        maxWidth: 400, aspectRatio: '4/3',
        perspective: '800px',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}>
      {/* Ambient light */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(168,85,247,0.1) 0%, transparent 70%)',
      }}/>

      {/* 3D Stage */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <div className="relative w-[88%] h-[82%]" style={{
          transform: 'rotateX(50deg) rotateZ(-5deg)', transformStyle: 'preserve-3d',
        }}>
          {/* Arena floor */}
          {arenaType === 'sumo' ? (
            <div className="absolute inset-0 rounded-full" style={{
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
              border: '3px solid #334155',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.05), 0 0 60px rgba(168,85,247,0.15)',
              transform: 'translateZ(-2px)',
            }}>
              <div className="absolute inset-[12%] rounded-full" style={{ border: '2px solid rgba(168,85,247,0.3)', boxShadow: '0 0 20px rgba(168,85,247,0.1)' }}/>
              <div className="absolute top-1/2 left-[20%] right-[20%] h-[1px]" style={{background:'linear-gradient(90deg,transparent,rgba(168,85,247,0.3),transparent)'}}/>
              <div className="absolute left-1/2 top-[20%] bottom-[20%] w-[1px]" style={{background:'linear-gradient(180deg,transparent,rgba(168,85,247,0.3),transparent)'}}/>
              <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.4)' }}/>
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{background:'linear-gradient(90deg,transparent,#3B82F6,transparent)', boxShadow:'0 0 8px rgba(59,130,246,0.5)'}}/>
              <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{background:'linear-gradient(90deg,transparent,#EF4444,transparent)', boxShadow:'0 0 8px rgba(239,68,68,0.5)'}}/>
            </div>
          ) : (
            <div className="absolute inset-0 rounded-2xl" style={{
              background: 'linear-gradient(135deg, #166534 0%, #15803d 30%, #166534 50%, #14532d 100%)',
              border: '2px solid #065f46',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.1)',
              transform: 'translateZ(-2px)',
            }}>
              <div className="absolute inset-0 rounded-2xl opacity-20" style={{ backgroundImage:'radial-gradient(circle, #4ade80 0.5px, transparent 0.5px)', backgroundSize:'8px 8px' }}/>
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <rect x="5" y="5" width="90" height="90" rx="2" fill="none" stroke="white" strokeWidth="0.8"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.5" strokeDasharray="2"/>
                <circle cx="50" cy="50" r="12" fill="none" stroke="white" strokeWidth="0.5"/>
              </svg>
            </div>
          )}

          {/* P1 Trail (blue) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{transform:'translateZ(1px)'}}>
            {p1Trail.length > 1 && <path d={`M${p1Trail.map(p=>`${p.x} ${p.y}`).join(' L')}`} fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="1" strokeLinecap="round"/>}
          </svg>
          {/* P2 Trail (red) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{transform:'translateZ(1px)'}}>
            {p2Trail.length > 1 && <path d={`M${p2Trail.map(p=>`${p.x} ${p.y}`).join(' L')}`} fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1" strokeLinecap="round"/>}
          </svg>
        </div>
      </div>

      {/* Robot P1 (Blue) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute transition-all duration-150 ease-out" style={{
          left: `${10 + p1Pos.x * 0.80}%`, top: `${8 + p1Pos.y * 0.76}%`,
          transform: `translate(-50%,-50%) rotate(${p1Pos.rotation}deg)`,
        }}>
          <div className="relative">
            <Robot3DSVG type={robotType?.id || 'sumo'} isFailed={false} isMoving={isActive} rotation={p1Pos.rotation} />
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-blue-300/50" style={{boxShadow:'0 0 8px rgba(59,130,246,0.5)'}}>P1</div>
          </div>
        </div>
      </div>

      {/* Robot P2 (Red) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute transition-all duration-150 ease-out" style={{
          left: `${10 + p2Pos.x * 0.80}%`, top: `${8 + p2Pos.y * 0.76}%`,
          transform: `translate(-50%,-50%) rotate(${p2Pos.rotation}deg)`,
        }}>
          <div className="relative">
            <Robot3DSVG type={robotType?.id || 'sumo'} isFailed={false} isMoving={isActive} rotation={p2Pos.rotation} />
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-red-300/50" style={{boxShadow:'0 0 8px rgba(239,68,68,0.5)'}}>P2</div>
          </div>
        </div>
      </div>
      
      {/* Collision flash */}
      {collisionFlash && (
        <div className="absolute inset-0 z-20 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(250,204,21,0.3) 0%, transparent 60%)',
          animation: 'pulse 0.3s ease-out',
        }}/>
      )}

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex justify-between items-start px-2 pt-2">
          <div className="backdrop-blur-md bg-blue-900/60 rounded-lg px-2 py-1 border border-blue-400/30">
            <div className="text-[7px] text-blue-300 font-bold uppercase">Jugador 1</div>
            <div className="text-lg font-black text-white leading-none">{scores[0]}</div>
          </div>
          <div className="backdrop-blur-md bg-black/50 rounded-lg px-3 py-1 border border-white/10">
            <div className="text-[8px] text-gray-400 font-bold tracking-wider">⚔️ BATALLA</div>
            {isActive && <div className="text-[7px] text-purple-300 font-bold text-center">EN JUEGO</div>}
          </div>
          <div className="backdrop-blur-md bg-red-900/60 rounded-lg px-2 py-1 border border-red-400/30">
            <div className="text-[7px] text-red-300 font-bold uppercase text-right">Jugador 2</div>
            <div className="text-lg font-black text-white leading-none text-right">{scores[1]}</div>
          </div>
        </div>
      </div>

      {/* Countdown */}
      {countdown > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="text-6xl font-black text-white animate-scale-in" style={{
            textShadow: '0 0 40px rgba(168,85,247,0.8), 0 4px 20px rgba(0,0,0,0.5)',
          }}>{countdown}</div>
        </div>
      )}

      {/* Winner overlay */}
      {winner && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)',
        }}>
          <div className="text-center animate-scale-in">
            <div className="text-5xl mb-2">🏆</div>
            <div className="px-6 py-3 rounded-2xl font-bold shadow-2xl" style={{
              background: winner === 1 
                ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' 
                : 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              color: 'white', border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            }}>
              <div className="text-lg font-black">¡Jugador {winner} Gana!</div>
              <div className="text-xs opacity-80 mt-0.5">
                {winner === 1 ? '🔵' : '🔴'} Victoria por empuje
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   3D ROBOT SVG - Renders an isometric 3D robot in the arena
   ================================================================ */
const Robot3DSVG = ({ type, isFailed, isMoving, rotation }) => {
  const colors = {
    sumo: { body: '#374151', accent: '#EF4444', wheel: '#1F2937', detail: '#F59E0B' },
    line: { body: '#DBEAFE', accent: '#3B82F6', wheel: '#1E3A8A', detail: '#06B6D4' },
    dog:  { body: '#FCD34D', accent: '#D97706', wheel: '#92400E', detail: '#1F2937' },
    free: { body: '#8B5CF6', accent: '#6D28D9', wheel: '#4C1D95', detail: '#A78BFA' },
  };
  const c = colors[type] || colors.free;

  if (type === 'dog') {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ filter: isFailed ? 'saturate(0.3) brightness(0.7)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
        {/* shadow */}
        <ellipse cx="28" cy="50" rx="18" ry="4" fill="rgba(0,0,0,0.2)"/>
        {/* legs back */}
        <rect x="12" y="30" width="5" height="16" rx="2" fill={c.accent} stroke={c.detail} strokeWidth="0.5"/>
        <rect x="39" y="30" width="5" height="16" rx="2" fill={c.accent} stroke={c.detail} strokeWidth="0.5"/>
        {/* body */}
        <ellipse cx="28" cy="26" rx="16" ry="10" fill={c.body} stroke={c.accent} strokeWidth="1.5"/>
        <ellipse cx="28" cy="24" rx="14" ry="8" fill="url(#dogShine3d)"/>
        {/* legs front */}
        <rect x="16" y="32" width="5" height="14" rx="2" fill={c.body} stroke={c.accent} strokeWidth="0.5"/>
        <rect x="35" y="32" width="5" height="14" rx="2" fill={c.body} stroke={c.accent} strokeWidth="0.5"/>
        {/* head */}
        <ellipse cx="28" cy="14" rx="8" ry="7" fill={c.body} stroke={c.accent} strokeWidth="1"/>
        <circle cx="24" cy="12" r="2.5" fill={c.detail}/><circle cx="32" cy="12" r="2.5" fill={c.detail}/>
        <circle cx="25" cy="11.5" r="1" fill="white"/><circle cx="33" cy="11.5" r="1" fill="white"/>
        <ellipse cx="28" cy="16" rx="3" ry="1.5" fill={c.detail}/>
        {/* ears */}
        <path d="M20 10 Q16 4 20 8" fill={c.accent} stroke={c.accent} strokeWidth="1"/>
        <path d="M36 10 Q40 4 36 8" fill={c.accent} stroke={c.accent} strokeWidth="1"/>
        {/* tail */}
        <path d="M44 22 Q50 16 48 22" fill="none" stroke={c.accent} strokeWidth="2" strokeLinecap="round"/>
        {/* LED eyes glow */}
        {isMoving && <>
          <circle cx="24" cy="12" r="3.5" fill="#22C55E" opacity="0.3"/>
          <circle cx="32" cy="12" r="3.5" fill="#22C55E" opacity="0.3"/>
        </>}
        <defs>
          <radialGradient id="dogShine3d" cx="40%" cy="30%"><stop offset="0%" stopColor="white" stopOpacity="0.3"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        </defs>
      </svg>
    );
  }

  // Generic wheeled robot (sumo / line / free)
  const isLine = type === 'line';
  const isSumo = type === 'sumo';
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ filter: isFailed ? 'saturate(0.3) brightness(0.7)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
      {/* Ground shadow */}
      <ellipse cx="28" cy="50" rx="20" ry="5" fill="rgba(0,0,0,0.2)"/>
      {/* Wheels back */}
      <rect x="4" y="28" width="8" height="18" rx="4" fill={c.wheel} stroke="#000" strokeWidth="0.8"/>
      <rect x="44" y="28" width="8" height="18" rx="4" fill={c.wheel} stroke="#000" strokeWidth="0.8"/>
      {/* Wheel treads */}
      {[0,1,2,3].map(i => <line key={`wl${i}`} x1="5" y1={31+i*4} x2="11" y2={31+i*4} stroke="#555" strokeWidth="0.5" opacity="0.6"/>)}
      {[0,1,2,3].map(i => <line key={`wr${i}`} x1="45" y1={31+i*4} x2="51" y2={31+i*4} stroke="#555" strokeWidth="0.5" opacity="0.6"/>)}
      {/* Chassis - 3D effect with layered rects */}
      <rect x="10" y="16" width="36" height="28" rx="4" fill={c.body} stroke={c.accent} strokeWidth="1.5"/>
      {/* Top surface highlight */}
      <rect x="11" y="17" width="34" height="12" rx="3" fill="url(#bodyShine3d)" opacity="0.6"/>
      {/* Circuit board lines */}
      <line x1="16" y1="24" x2="22" y2="24" stroke={c.accent} strokeWidth="0.5" opacity="0.5"/>
      <line x1="22" y1="24" x2="22" y2="30" stroke={c.accent} strokeWidth="0.5" opacity="0.5"/>
      <line x1="34" y1="24" x2="40" y2="24" stroke={c.accent} strokeWidth="0.5" opacity="0.5"/>
      <line x1="34" y1="24" x2="34" y2="32" stroke={c.accent} strokeWidth="0.5" opacity="0.5"/>
      {/* Arduino chip */}
      <rect x="22" y="26" width="12" height="8" rx="1" fill="#115E59" stroke="#0D9488" strokeWidth="0.8"/>
      <text x="28" y="32" textAnchor="middle" fontSize="3.5" fill="#5EEAD4" fontWeight="bold">CPU</text>
      {/* Sensor up front */}
      {isSumo && <rect x="14" y="14" width="28" height="4" rx="2" fill={c.accent} stroke="#000" strokeWidth="0.5"/>}
      {isLine && <>
        <circle cx="20" cy="44" r="3" fill="#EF4444" stroke="#991B1B" strokeWidth="0.5"/>
        <circle cx="36" cy="44" r="3" fill="#EF4444" stroke="#991B1B" strokeWidth="0.5"/>
        <circle cx="20" cy="44" r="1.5" fill="#FCA5A5" opacity="0.8"/>
        <circle cx="36" cy="44" r="1.5" fill="#FCA5A5" opacity="0.8"/>
      </>}
      {/* Ultrasonic sensor (eyes) */}
      <circle cx="22" cy="20" r="3" fill="#A5F3FC" stroke="#0891B2" strokeWidth="1"/>
      <circle cx="34" cy="20" r="3" fill="#A5F3FC" stroke="#0891B2" strokeWidth="1"/>
      <circle cx="22" cy="20" r="1.2" fill="#06B6D4"/>
      <circle cx="34" cy="20" r="1.2" fill="#06B6D4"/>
      {/* Sensor glow when moving */}
      {isMoving && !isFailed && <>
        <circle cx="22" cy="20" r="5" fill="#06B6D4" opacity="0.15"/>
        <circle cx="34" cy="20" r="5" fill="#06B6D4" opacity="0.15"/>
      </>}
      {/* Battery indicator */}
      <rect x="38" y="34" width="6" height="4" rx="1" fill="#166534" stroke="#14532D" strokeWidth="0.5"/>
      <rect x="39" y="35" width={isMoving ? 4 : 2} height="2" rx="0.5" fill="#22C55E"/>
      {/* Status LED */}
      <circle cx="16" cy="36" r="1.5" fill={isFailed ? '#EF4444' : isMoving ? '#22C55E' : '#6B7280'}/>
      {isFailed && <circle cx="16" cy="36" r="3" fill="#EF4444" opacity="0.3"/>}
      {isMoving && !isFailed && <circle cx="16" cy="36" r="3" fill="#22C55E" opacity="0.2"/>}
      <defs>
        <linearGradient id="bodyShine3d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

/* ================================================================
   SIMULATION ARENA COMPONENT — 3D PERSPECTIVE
   ================================================================ */
const SimulationArena = ({ robotType, isRunning, simStep, totalSteps, simAction, simFailed, workspace, manualPos, isManual }) => {
  const [robotPos, setRobotPos] = useState({ x: 50, y: 50, rotation: 0 });
  const [trail, setTrail] = useState([]);
  const [particles, setParticles] = useState([]);
  const [sensorBeam, setSensorBeam] = useState(false);
  const particleId = useRef(0);

  // Use manual position if in manual mode
  const displayPos = isManual ? (manualPos || { x: 50, y: 50, rotation: 0 }) : robotPos;

  useEffect(() => {
    if (!isRunning) {
      setRobotPos({ x: 50, y: 50, rotation: 0 });
      setTrail([]);
      setParticles([]);
      return;
    }
  }, [isRunning]);

  // Manual mode trail tracking
  const prevManualPos = useRef(manualPos);
  useEffect(() => {
    if (!isManual || !manualPos) return;
    const prev = prevManualPos.current;
    if (!prev || prev.x !== manualPos.x || prev.y !== manualPos.y) {
      setTrail(t => [...t.slice(-40), { x: manualPos.x, y: manualPos.y, time: Date.now() }]);
    }
    prevManualPos.current = manualPos;
  }, [isManual, manualPos]);

  // Spawn particles on movement
  useEffect(() => {
    const active = isRunning || isManual;
    if (!active || simFailed) return;
    const id = setInterval(() => {
      setParticles(prev => {
        const alive = prev.filter(p => Date.now() - p.born < 1200).slice(-15);
        return [...alive, {
          id: particleId.current++,
          x: displayPos.x + (Math.random()-0.5)*6,
          y: displayPos.y + (Math.random()-0.5)*6,
          born: Date.now(),
          size: Math.random()*1.5+0.5,
          dx: (Math.random()-0.5)*2,
          dy: (Math.random()-0.5)*2,
        }];
      });
    }, 200);
    return () => clearInterval(id);
  }, [isRunning, isManual, simFailed, displayPos.x, displayPos.y]);

  useEffect(() => {
    if (!simAction || !isRunning) return;

    // Show sensor beam on sensor reads
    if (simAction === '' && isRunning) {
      setSensorBeam(true);
      setTimeout(() => setSensorBeam(false), 800);
    }

    setRobotPos(prev => {
      let { x, y, rotation } = prev;
      const speed = 4;
      const act = simAction;

      if (act.includes('Avanza') || act.includes('avanza') || act.includes('Camina') || act.includes('camina')) {
        x += Math.cos(rotation * Math.PI / 180) * speed;
        y += Math.sin(rotation * Math.PI / 180) * speed;
      } else if (act.includes('Retrocede') || act.includes('retrocede')) {
        x -= Math.cos(rotation * Math.PI / 180) * speed;
        y -= Math.sin(rotation * Math.PI / 180) * speed;
      } else if (act.includes('izquierda') || act.includes('Izq')) {
        rotation -= 30;
      } else if (act.includes('derecha') || act.includes('Der')) {
        rotation += 30;
      } else if (act.includes('180')) {
        rotation += 180;
      }
      
      x = Math.max(8, Math.min(92, x));
      y = Math.max(8, Math.min(92, y));
      
      setTrail(t => [...t.slice(-40), { x, y, time: Date.now() }]);
      return { x, y, rotation };
    });
  }, [simAction, isRunning]);

  const arenaType = robotType?.arena || 'field';
  const isMoving = (isRunning || isManual) && !simFailed;

  return (
    <div className="relative w-full mx-auto rounded-2xl overflow-hidden border-2 border-gray-700/30"
      style={{ 
        maxWidth: 380,
        aspectRatio: '4/3',
        perspective: '800px',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}>
      {/* Ambient lighting overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)',
      }}/>

      {/* 3D Stage container - isometric tilt */}
      <div className="absolute inset-0 flex items-center justify-center" style={{
        transformStyle: 'preserve-3d',
      }}>
        <div className="relative w-[88%] h-[82%]" style={{
          transform: 'rotateX(50deg) rotateZ(-5deg)',
          transformStyle: 'preserve-3d',
        }}>
          {/* Arena floor with 3D depth */}
          {arenaType === 'sumo' && (
            <>
              {/* Raised platform */}
              <div className="absolute inset-0 rounded-full" style={{
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
                border: '3px solid #334155',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 2px 8px rgba(255,255,255,0.05), 0 0 60px rgba(99,102,241,0.1)',
                transform: 'translateZ(-2px)',
              }}>
                {/* Inner ring */}
                <div className="absolute inset-[12%] rounded-full" style={{
                  border: '2px solid rgba(239,68,68,0.4)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.15), inset 0 0 20px rgba(239,68,68,0.05)',
                }}/>
                {/* Center cross */}
                <div className="absolute top-1/2 left-[20%] right-[20%] h-[1px]" style={{background:'linear-gradient(90deg,transparent,rgba(239,68,68,0.3),transparent)'}}/>
                <div className="absolute left-1/2 top-[20%] bottom-[20%] w-[1px]" style={{background:'linear-gradient(180deg,transparent,rgba(239,68,68,0.3),transparent)'}}/>
                {/* Edge glow */}
                <div className="absolute inset-0 rounded-full" style={{
                  border: '2px solid rgba(255,255,255,0.15)',
                  boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.4)',
                }}/>
                {/* Start marks */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{background:'linear-gradient(90deg,transparent,#EF4444,transparent)', boxShadow:'0 0 8px rgba(239,68,68,0.5)'}}/>
                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{background:'linear-gradient(90deg,transparent,#3B82F6,transparent)', boxShadow:'0 0 8px rgba(59,130,246,0.5)'}}/>
              </div>
            </>
          )}
          {arenaType === 'line' && (
            <div className="absolute inset-0 rounded-2xl" style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 30%, #e2e8f0 60%, #cbd5e1 100%)',
              border: '2px solid #94a3b8',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.3)',
              transform: 'translateZ(-2px)',
            }}>
              {/* Grid pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                {[10,20,30,40,50,60,70,80,90].map(v => (
                  <React.Fragment key={v}>
                    <line x1={v} y1="0" x2={v} y2="100" stroke="#64748b" strokeWidth="0.3"/>
                    <line x1="0" y1={v} x2="100" y2={v} stroke="#64748b" strokeWidth="0.3"/>
                  </React.Fragment>
                ))}
              </svg>
              {/* Track line with glow */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <path d="M15 85 Q15 15 50 15 Q85 15 85 50 Q85 85 50 85 Q30 85 25 65 Q20 50 35 45 Q50 40 55 55 Q60 70 50 75 Q35 80 30 65" 
                  fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="6" strokeLinecap="round"/>
                <path d="M15 85 Q15 15 50 15 Q85 15 85 50 Q85 85 50 85 Q30 85 25 65 Q20 50 35 45 Q50 40 55 55 Q60 70 50 75 Q35 80 30 65" 
                  fill="none" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
              {/* Start/finish marker */}
              <div className="absolute bottom-[12%] left-[10%] px-1.5 py-0.5 bg-green-600 rounded text-[5px] font-bold text-white shadow" style={{transform:'rotateX(-50deg) rotateZ(5deg)'}}>START</div>
            </div>
          )}
          {arenaType === 'field' && (
            <div className="absolute inset-0 rounded-2xl" style={{
              background: 'linear-gradient(135deg, #166534 0%, #15803d 30%, #166534 50%, #14532d 100%)',
              border: '2px solid #065f46',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.1)',
              transform: 'translateZ(-2px)',
            }}>
              {/* Grass texture */}
              <div className="absolute inset-0 rounded-2xl opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, #4ade80 0.5px, transparent 0.5px)',
                backgroundSize: '8px 8px',
              }}/>
              {/* Field lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <rect x="5" y="5" width="90" height="90" rx="2" fill="none" stroke="white" strokeWidth="0.8"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="0.5"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="0.5"/>
                <circle cx="50" cy="50" r="1.5" fill="white" opacity="0.5"/>
              </svg>
              {/* Corner flags */}
              {[[8,8],[92,8],[8,92],[92,92]].map(([cx,cy],i) => (
                <div key={i} className="absolute w-1.5 h-3" style={{left:`${cx}%`,top:`${cy}%`,transform:'translate(-50%,-100%)'}}>
                  <div className="w-full h-1 bg-yellow-400 rounded-sm" style={{boxShadow:'0 0 4px rgba(250,204,21,0.5)'}}/>
                  <div className="w-[1px] h-2 bg-white mx-auto"/>
                </div>
              ))}
            </div>
          )}

          {/* Trail with glow effect */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{ transform: 'translateZ(1px)' }}>
            <defs>
              <filter id="trailGlow"><feGaussianBlur stdDeviation="0.8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {trail.length > 1 && (
              <path 
                d={`M${trail[0].x} ${trail[0].y} ${trail.slice(1).map(p => `L${p.x} ${p.y}`).join(' ')}`}
                fill="none" 
                stroke="url(#trailGrad)"
                strokeWidth="1.2"
                strokeLinecap="round"
                filter="url(#trailGlow)"
                opacity="0.7"
              />
            )}
            {trail.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={0.4 + (i/trail.length)*0.8}
                fill={`rgba(129,140,248,${0.1 + (i/trail.length)*0.5})`}/>
            ))}
            <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8"/>
            </linearGradient>
          </svg>

          {/* Energy particles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{ transform: 'translateZ(3px)' }}>
            {particles.map(p => {
              const age = (Date.now() - p.born) / 1200;
              const opacity = Math.max(0, 1 - age);
              return (
                <circle key={p.id}
                  cx={p.x + p.dx * age * 10}
                  cy={p.y + p.dy * age * 10 - age * 5}
                  r={p.size * (1 - age * 0.5)}
                  fill={simFailed ? '#EF4444' : '#818CF8'}
                  opacity={opacity * 0.6}
                />
              );
            })}
          </svg>

          {/* Sensor beam effect */}
          {sensorBeam && isMoving && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{ transform: 'translateZ(2px)' }}>
              <defs>
                <radialGradient id="sensorGlow" cx="50%" cy="50%"><stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4"/><stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/></radialGradient>
              </defs>
              <circle cx={displayPos.x} cy={displayPos.y} r="12" fill="url(#sensorGlow)">
                <animate attributeName="r" values="5;15;5" dur="0.8s" repeatCount="1"/>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="1"/>
              </circle>
            </svg>
          )}
        </div>
      </div>

      {/* Robot layer - on top of the 3D stage, positioned in 2D to avoid transform issues */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Coordinate mapped to the 3D stage area */}
        <div
          className={`absolute transition-all ${isMoving ? 'duration-700' : 'duration-300'} ease-out`}
          style={{
            // Map robot position to the visible tilted area
            left: `${10 + displayPos.x * 0.80}%`,
            top: `${8 + displayPos.y * 0.76}%`,
            transform: `translate(-50%, -50%) rotate(${displayPos.rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <Robot3DSVG type={robotType?.id || 'free'} isFailed={simFailed} isMoving={isMoving} rotation={robotPos.rotation} />
          
          {/* Direction arrow */}
          {isMoving && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2" style={{filter:'drop-shadow(0 0 4px rgba(99,102,241,0.6))'}}>
              <svg width="12" height="10" viewBox="0 0 12 10">
                <polygon points="6,0 12,10 0,10" fill="#818CF8" opacity="0.9"/>
              </svg>
            </div>
          )}

          {/* Failure sparks */}
          {simFailed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="70" height="70" viewBox="0 0 70 70" className="absolute">
                <text x="35" y="25" textAnchor="middle" fontSize="18" opacity="0.9">⚡</text>
                <text x="50" y="45" textAnchor="middle" fontSize="12" opacity="0.7">💥</text>
                <text x="18" y="40" textAnchor="middle" fontSize="10" opacity="0.6">💨</text>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* HUD overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        {/* Top bar */}
        <div className="flex justify-between items-start px-3 pt-2">
          <div className="backdrop-blur-md bg-black/40 rounded-lg px-2.5 py-1.5 border border-white/10">
            <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Arena</div>
            <div className="text-[10px] text-white font-bold">{
              arenaType === 'sumo' ? '🥊 Ring Sumo' : arenaType === 'line' ? '〰️ Pista' : '🌿 Campo'
            }</div>
          </div>
          {(isRunning || isManual) && (
            <div className="backdrop-blur-md bg-black/40 rounded-lg px-2.5 py-1.5 border border-white/10">
              <div className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Estado</div>
              <div className={`text-[10px] font-bold flex items-center gap-1 ${simFailed ? 'text-red-400' : 'text-green-400'}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${simFailed ? 'bg-red-400' : 'bg-green-400'}`} style={{
                  animation: simFailed ? 'none' : 'pulse 1.5s infinite',
                }}/>
                {simFailed ? 'ERROR' : isManual ? '🎮 Manual' : 'Activo'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Speedometer / Step counter */}
      {isRunning && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none px-3 pb-2">
          <div className="backdrop-blur-md bg-black/50 rounded-xl px-3 py-2 border border-white/10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-gray-400 font-bold">PROGRESO</span>
              <span className="text-[10px] text-white font-mono font-bold">{simStep}/{totalSteps}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${(simStep/Math.max(totalSteps,1))*100}%`,
                background: simFailed 
                  ? 'linear-gradient(90deg, #EF4444, #F87171)' 
                  : 'linear-gradient(90deg, #6366F1, #818CF8, #A78BFA)',
                boxShadow: simFailed ? '0 0 8px rgba(239,68,68,0.5)' : '0 0 8px rgba(99,102,241,0.5)',
              }}/>
            </div>
          </div>
        </div>
      )}

      {/* Failure overlay */}
      {simFailed && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(0,0,0,0.3) 100%)',
        }}>
          <div className="px-5 py-3 rounded-xl font-bold text-sm shadow-2xl animate-scale-in text-center" style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(220,38,38,0.4)',
          }}>
            <span className="text-lg block mb-0.5">⚠️</span>
            ¡Fallo en simulación!
          </div>
        </div>
      )}

      {/* Idle state - no simulation yet */}
      {!isRunning && !isManual && trail.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2" style={{animation: 'float 3s ease-in-out infinite'}}>{robotType?.icon || '🤖'}</div>
            <div className="backdrop-blur-md bg-black/30 rounded-xl px-4 py-2 border border-white/10">
              <p className="text-xs font-bold text-white/70">Listo para simular</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function RobotSimulator({ onBack }) {
  const [phase, setPhase] = useState('select'); // select | instructions | build | program | simulate | battle
  const [template, setTemplate] = useState(null);
  const [workspace, setWorkspace] = useState([]); // placed parts
  const [program, setProgram] = useState([]); // program blocks sequence
  const [partCat, setPartCat] = useState('Chasis');
  const [blockCat, setBlockCat] = useState('Movimiento');
  
  // Simulation state
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLog, setSimLog] = useState([]);
  const [simAction, setSimAction] = useState('');
  const [simFailed, setSimFailed] = useState(false);
  const simRef = useRef(null);
  const logEndRef = useRef(null);

  // Manual control state
  const [manualMode, setManualMode] = useState(false);
  const [manualPos, setManualPos] = useState({ x: 50, y: 50, rotation: 0 });

  // Battle state
  const [battleActive, setBattleActive] = useState(false);
  const [p1Pos, setP1Pos] = useState({ x: 30, y: 50, rotation: 0 });
  const [p2Pos, setP2Pos] = useState({ x: 70, y: 50, rotation: 180 });
  const [p1Trail, setP1Trail] = useState([]);
  const [p2Trail, setP2Trail] = useState([]);
  const [scores, setScores] = useState([0, 0]);
  const [countdown, setCountdown] = useState(0);
  const [winner, setWinner] = useState(null);
  const [collisionFlash, setCollisionFlash] = useState(false);
  const [battleTimer, setBattleTimer] = useState(30);
  const battleTimerRef = useRef(null);
  const keysPressed = useRef(new Set());

  // Chassis assembly slots
  const [slotAssignments, setSlotAssignments] = useState({});

  // Firmware upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');
  const [uploadLog, setUploadLog] = useState([]);
  const uploadRef = useRef(null);

  // Instructions and TTS state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMaterials, setShowMaterials] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const speechRef = useRef(null);

  // Get robot config from localStorage for avatar
  const robotConfig = (() => {
    try {
      const profile = localStorage.getItem('cultivatec_profile');
      if (profile) return JSON.parse(profile).robotConfig;
    } catch {}
    return null;
  })();

  // TTS Functions
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);

  const speakStep = useCallback((step) => {
    const phrase = ROBOT_INSTRUCTION_PHRASES[Math.floor(Math.random() * ROBOT_INSTRUCTION_PHRASES.length)];
    const fullText = `${phrase} ${step.title}. ${step.description}. ${step.details.join('. ')}`;
    speakText(fullText);
  }, [speakText]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simLog]);

  // ---- Keyboard handler for both manual and battle ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current.add(e.key.toLowerCase());
      
      // Manual mode: WASD or Arrows
      if (manualMode && !battleActive) {
        const speed = 2.5;
        setManualPos(prev => {
          let { x, y, rotation } = prev;
          const key = e.key.toLowerCase();
          if (key === 'w' || key === 'arrowup') { y = Math.max(5, y - speed); rotation = -90; }
          if (key === 's' || key === 'arrowdown') { y = Math.min(95, y + speed); rotation = 90; }
          if (key === 'a' || key === 'arrowleft') { x = Math.max(5, x - speed); rotation = 180; }
          if (key === 'd' || key === 'arrowright') { x = Math.min(95, x + speed); rotation = 0; }
          return { x, y, rotation };
        });
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [manualMode, battleActive]);

  // ---- Battle keyboard game loop ----
  useEffect(() => {
    if (!battleActive || winner || countdown > 0) return;
    
    const speed = 2;
    const gameLoop = setInterval(() => {
      const keys = keysPressed.current;
      
      // P1: WASD
      setP1Pos(prev => {
        let { x, y, rotation } = prev;
        if (keys.has('w')) { y = Math.max(5, y - speed); rotation = -90; }
        if (keys.has('s')) { y = Math.min(95, y + speed); rotation = 90; }
        if (keys.has('a')) { x = Math.max(5, x - speed); rotation = 180; }
        if (keys.has('d')) { x = Math.min(95, x + speed); rotation = 0; }
        // Diagonals
        if (keys.has('w') && keys.has('d')) rotation = -45;
        if (keys.has('w') && keys.has('a')) rotation = -135;
        if (keys.has('s') && keys.has('d')) rotation = 45;
        if (keys.has('s') && keys.has('a')) rotation = 135;
        return { x, y, rotation };
      });
      
      // P2: Arrow keys
      setP2Pos(prev => {
        let { x, y, rotation } = prev;
        if (keys.has('arrowup')) { y = Math.max(5, y - speed); rotation = -90; }
        if (keys.has('arrowdown')) { y = Math.min(95, y + speed); rotation = 90; }
        if (keys.has('arrowleft')) { x = Math.max(5, x - speed); rotation = 180; }
        if (keys.has('arrowright')) { x = Math.min(95, x + speed); rotation = 0; }
        if (keys.has('arrowup') && keys.has('arrowright')) rotation = -45;
        if (keys.has('arrowup') && keys.has('arrowleft')) rotation = -135;
        if (keys.has('arrowdown') && keys.has('arrowright')) rotation = 45;
        if (keys.has('arrowdown') && keys.has('arrowleft')) rotation = 135;
        return { x, y, rotation };
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [battleActive, winner, countdown]);

  // ---- Battle trail tracking ----
  useEffect(() => {
    if (!battleActive) return;
    const id = setInterval(() => {
      setP1Trail(t => [...t.slice(-30), { x: p1Pos.x, y: p1Pos.y }]);
      setP2Trail(t => [...t.slice(-30), { x: p2Pos.x, y: p2Pos.y }]);
    }, 200);
    return () => clearInterval(id);
  }, [battleActive, p1Pos, p2Pos]);

  // ---- Battle collision detection & scoring ----
  useEffect(() => {
    if (!battleActive || winner || countdown > 0) return;

    const dx = p1Pos.x - p2Pos.x;
    const dy = p1Pos.y - p2Pos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    // Collision: push apart
    if (dist < 8) {
      setCollisionFlash(true);
      setTimeout(() => setCollisionFlash(false), 200);
      
      const pushForce = 4;
      const angle = Math.atan2(dy, dx);
      setP1Pos(prev => ({
        ...prev,
        x: Math.max(5, Math.min(95, prev.x + Math.cos(angle) * pushForce)),
        y: Math.max(5, Math.min(95, prev.y + Math.sin(angle) * pushForce)),
      }));
      setP2Pos(prev => ({
        ...prev,
        x: Math.max(5, Math.min(95, prev.x - Math.cos(angle) * pushForce)),
        y: Math.max(5, Math.min(95, prev.y - Math.sin(angle) * pushForce)),
      }));
    }

    // Out of bounds check (for sumo ring)
    const arenaType = template?.arena || 'field';
    if (arenaType === 'sumo') {
      const p1Dist = Math.sqrt((p1Pos.x-50)**2 + (p1Pos.y-50)**2);
      const p2Dist = Math.sqrt((p2Pos.x-50)**2 + (p2Pos.y-50)**2);
      if (p1Dist > 42) {
        setScores(s => [s[0], s[1]+1]);
        setWinner(2);
      }
      if (p2Dist > 42) {
        setScores(s => [s[0]+1, s[1]]);
        setWinner(1);
      }
    } else {
      // Field mode: push opponent to edge
      if (p1Pos.x <= 5 || p1Pos.x >= 95 || p1Pos.y <= 5 || p1Pos.y >= 95) {
        if (dist < 15) { // Was pushed
          setScores(s => [s[0], s[1]+1]);
          setWinner(2);
        }
      }
      if (p2Pos.x <= 5 || p2Pos.x >= 95 || p2Pos.y <= 5 || p2Pos.y >= 95) {
        if (dist < 15) {
          setScores(s => [s[0]+1, s[1]]);
          setWinner(1);
        }
      }
    }
  }, [battleActive, p1Pos, p2Pos, winner, countdown, template]);

  // ---- Battle timer ----
  useEffect(() => {
    if (!battleActive || winner || countdown > 0) return;
    battleTimerRef.current = setInterval(() => {
      setBattleTimer(prev => {
        if (prev <= 1) {
          clearInterval(battleTimerRef.current);
          // Time's up - closest to center wins
          const d1 = Math.sqrt((p1Pos.x-50)**2 + (p1Pos.y-50)**2);
          const d2 = Math.sqrt((p2Pos.x-50)**2 + (p2Pos.y-50)**2);
          if (d1 < d2) { setScores(s => [s[0]+1, s[1]]); setWinner(1); }
          else if (d2 < d1) { setScores(s => [s[0], s[1]+1]); setWinner(2); }
          else { setWinner(0); } // tie
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(battleTimerRef.current);
  }, [battleActive, winner, countdown, p1Pos, p2Pos]);

  // -- Handlers --
  const pickTemplate = (t) => {
    setTemplate(t);
    resetUpload();
    if (t.id !== 'free') {
      const newWorkspace = t.parts.map((pid, i) => {
        const def = ALL_PARTS.find(p => p.id === pid);
        return { ...def, uid: `${pid}_${i}` };
      });
      setWorkspace(newWorkspace);
      setProgram(t.program.map((bid, i) => {
        const def = PROGRAM_BLOCKS.find(b => b.id === bid);
        return { ...def, uid: `${bid}_${i}` };
      }));
      // Auto-assign parts to chassis slots
      const slots = CHASSIS_SLOTS[t.id] || CHASSIS_SLOTS.free;
      const newAssignments = {};
      const usedUids = new Set();
      slots.forEach(slot => {
        const match = newWorkspace.find(p => slot.accepts.includes(p.cat) && !usedUids.has(p.uid));
        if (match) {
          newAssignments[slot.id] = match.uid;
          usedUids.add(match.uid);
        }
      });
      setSlotAssignments(newAssignments);
    } else {
      setWorkspace([]);
      setProgram([]);
      setSlotAssignments({});
    }
    // Reset instruction state and go to instructions phase
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowMaterials(true);
    setShowCode(false);
    stopSpeaking();
    setPhase('instructions');
  };

  const addPartToWorkspace = (part) => {
    setWorkspace(prev => [...prev, { ...part, uid: `${part.id}_${Date.now()}` }]);
  };

  const removePartFromWorkspace = (index) => {
    setWorkspace(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.from === 'catalog') {
        const part = ALL_PARTS.find(p => p.id === data.partId);
        if (part) addPartToWorkspace(part);
      }
    } catch(err) {}
  };

  const addBlockToProgram = (block) => {
    setProgram(prev => [...prev, { ...block, uid: `${block.id}_${Date.now()}` }]);
  };

  const removeBlockFromProgram = (index) => {
    setProgram(prev => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index, dir) => {
    setProgram(prev => {
      const arr = [...prev];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  // -- Chassis slot handlers --
  const handleSlotDrop = (slot, data) => {
    let part = null;
    if (data.from === 'catalog') {
      part = ALL_PARTS.find(p => p.id === data.partId);
      if (part && slot.accepts.includes(part.cat)) {
        const newPart = { ...part, uid: `${part.id}_${Date.now()}` };
        setWorkspace(prev => [...prev, newPart]);
        setSlotAssignments(prev => ({ ...prev, [slot.id]: newPart.uid }));
      }
    } else if (data.from === 'workspace') {
      const wp = workspace[data.index];
      if (wp && slot.accepts.includes(wp.cat)) {
        setSlotAssignments(prev => ({ ...prev, [slot.id]: wp.uid }));
      }
    }
  };

  const handleSlotRemove = (slotId) => {
    const uid = slotAssignments[slotId];
    if (uid) {
      setWorkspace(prev => prev.filter(p => p.uid !== uid));
      setSlotAssignments(prev => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    }
  };

  // -- Firmware upload simulation --
  const startUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadLog([]);
    setUploadStep('Inicializando...');

    const steps = [
      { pct: 5, step: 'Conectando con Arduino...', log: { text: '> Detectando placa en COM3...', type: 'info' }, delay: 600 },
      { pct: 10, step: 'Placa detectada', log: { text: '✓ Arduino UNO detectado en COM3 (ATmega328P)', type: 'ok' }, delay: 800 },
      { pct: 15, step: 'Compilando sketch...', log: { text: '> Compilando sketch para Arduino UNO...', type: 'info' }, delay: 500 },
      { pct: 25, step: 'Compilando...', log: { text: '  Incluyendo biblioteca: Servo.h', type: 'info' }, delay: 400 },
      { pct: 35, step: 'Compilando...', log: { text: '  Incluyendo biblioteca: NewPing.h', type: 'info' }, delay: 300 },
      { pct: 45, step: 'Compilando dependencias...', log: { text: `  Compilando ${program.length} bloques de programa...`, type: 'progress' }, delay: 600 },
      { pct: 55, step: 'Verificando código...', log: { text: '✓ Compilación exitosa (0 errores, 0 warnings)', type: 'ok' }, delay: 700 },
      { pct: 60, step: 'Preparando firmware...', log: { text: `> Tamaño del sketch: ${1024 + program.length * 128} bytes (${Math.min(98, 3 + program.length * 4)}% del máximo)`, type: 'progress' }, delay: 500 },
      { pct: 65, step: 'Iniciando upload...', log: { text: '> Reseteando placa via DTR...', type: 'info' }, delay: 600 },
      { pct: 70, step: 'Subiendo firmware...', log: { text: '> Cargando bootloader... OK', type: 'ok' }, delay: 500 },
      { pct: 78, step: 'Transfiriendo datos...', log: { text: '██████████░░░░░ 70% - Escribiendo flash...', type: 'progress' }, delay: 700 },
      { pct: 88, step: 'Transfiriendo datos...', log: { text: '████████████████░ 94% - Verificando...', type: 'progress' }, delay: 600 },
      { pct: 95, step: 'Verificando firmware...', log: { text: '✓ Verificación de firmware: OK', type: 'ok' }, delay: 500 },
      { pct: 100, step: '¡Upload completo!', log: { text: '✓ ¡Programa cargado exitosamente! Robot listo.', type: 'ok' }, delay: 400 },
    ];

    let i = 0;
    const runStep = () => {
      if (i >= steps.length) {
        setIsUploading(false);
        return;
      }
      const s = steps[i];
      setUploadProgress(s.pct);
      setUploadStep(s.step);
      setUploadLog(prev => [...prev, s.log]);
      i++;
      uploadRef.current = setTimeout(runStep, s.delay);
    };
    uploadRef.current = setTimeout(runStep, 500);
  };

  const resetUpload = () => {
    clearTimeout(uploadRef.current);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadLog([]);
    setUploadStep('');
  };

  // Manual control handlers
  const handleManualMove = (dir) => {
    const speed = 2.5;
    setManualPos(prev => {
      let { x, y, rotation } = prev;
      if (dir === 'up') { y = Math.max(5, y - speed); rotation = -90; }
      if (dir === 'down') { y = Math.min(95, y + speed); rotation = 90; }
      if (dir === 'left') { x = Math.max(5, x - speed); rotation = 180; }
      if (dir === 'right') { x = Math.min(95, x + speed); rotation = 0; }
      return { x, y, rotation };
    });
  };

  const handleManualStop = () => {};

  const startManualMode = () => {
    setManualMode(true);
    setManualPos({ x: 50, y: 50, rotation: 0 });
    setSimRunning(false);
    resetSim();
  };

  const stopManualMode = () => {
    setManualMode(false);
  };

  // Battle handlers
  const handleP1Move = (dir) => {
    const speed = 3;
    setP1Pos(prev => {
      let { x, y, rotation } = prev;
      if (dir === 'up') { y = Math.max(5, y - speed); rotation = -90; }
      if (dir === 'down') { y = Math.min(95, y + speed); rotation = 90; }
      if (dir === 'left') { x = Math.max(5, x - speed); rotation = 180; }
      if (dir === 'right') { x = Math.min(95, x + speed); rotation = 0; }
      return { x, y, rotation };
    });
  };

  const handleP2Move = (dir) => {
    const speed = 3;
    setP2Pos(prev => {
      let { x, y, rotation } = prev;
      if (dir === 'up') { y = Math.max(5, y - speed); rotation = -90; }
      if (dir === 'down') { y = Math.min(95, y + speed); rotation = 90; }
      if (dir === 'left') { x = Math.max(5, x - speed); rotation = 180; }
      if (dir === 'right') { x = Math.min(95, x + speed); rotation = 0; }
      return { x, y, rotation };
    });
  };

  const startBattle = () => {
    setPhase('battle');
    setWinner(null);
    setP1Trail([]);
    setP2Trail([]);
    setCollisionFlash(false);
    setP1Pos({ x: 25, y: 50, rotation: 0 });
    setP2Pos({ x: 75, y: 50, rotation: 180 });
    setBattleTimer(30);
    setBattleActive(false);
    
    // Countdown
    setCountdown(3);
    let c = 3;
    const cdInt = setInterval(() => {
      c--;
      setCountdown(c);
      if (c === 0) {
        clearInterval(cdInt);
        setBattleActive(true);
      }
    }, 1000);
  };

  const resetBattle = () => {
    clearInterval(battleTimerRef.current);
    setBattleActive(false);
    setWinner(null);
    setP1Pos({ x: 25, y: 50, rotation: 0 });
    setP2Pos({ x: 75, y: 50, rotation: 180 });
    setP1Trail([]);
    setP2Trail([]);
    setCountdown(0);
    setBattleTimer(30);
  };

  const rematch = () => {
    resetBattle();
    setTimeout(() => startBattle(), 100);
  };

  // -- Simulation --
  const hasController = workspace.some(p => p.id === 'arduino');
  const hasBattery = workspace.some(p => p.id === 'battery');
  const hasMotor = workspace.some(p => p.cat === 'Motores');
  const canSimulate = hasController && hasBattery && hasMotor && program.length > 0;

  const runSimulation = useCallback(() => {
    if (!canSimulate) return;
    
    // Check for failures
    let willFail = false;
    let failStep = -1;
    let failReason = '';
    
    if (!hasBattery) { willFail = true; failStep = 0; failReason = 'Sin batería el robot no enciende.'; }
    if (!hasController) { willFail = true; failStep = 0; failReason = 'Sin Arduino no puede procesar instrucciones.'; }
    
    // Check if sumo has blade
    if (template?.id === 'sumo' && !workspace.some(p => p.id === 'blade')) {
      // Not a failure, just weaker
    }
    
    setSimRunning(true);
    setSimStep(0);
    setSimFailed(false);
    setSimLog([{ text: '🚀 Cargando programa al Arduino...', type: 'system' }]);
    
    setTimeout(() => {
      setSimLog(prev => [...prev, { text: '✅ Programa cargado exitosamente', type: 'system' },
        { text: `🔋 Batería conectada: ${hasBattery ? '9V OK' : '❌ NO'}`, type: hasBattery ? 'ok' : 'error' },
        { text: `🧠 Controlador: ${hasController ? 'Arduino UNO listo' : '❌ NO'}`, type: hasController ? 'ok' : 'error' },
        { text: `⚙️ Motores: ${workspace.filter(p => p.cat === 'Motores').length} detectados`, type: 'ok' },
        { text: '▶️ Iniciando ejecución...', type: 'system' },
        { text: '─'.repeat(30), type: 'divider' },
      ]);
    }, 600);

    let step = 0;
    simRef.current = setInterval(() => {
      if (willFail && step === failStep) {
        setSimLog(prev => [...prev, { text: `❌ ERROR: ${failReason}`, type: 'error' }]);
        setSimFailed(true);
        setSimRunning(false);
        clearInterval(simRef.current);
        return;
      }
      
      if (step >= program.length) {
        setSimLog(prev => [...prev, 
          { text: '─'.repeat(30), type: 'divider' },
          { text: '🏁 ¡Programa ejecutado completamente!', type: 'success' }
        ]);
        setSimRunning(false);
        clearInterval(simRef.current);
        return;
      }

      const block = program[step];
      const msg = getSimMessage(block, template, workspace);
      setSimAction(msg.action);
      setSimLog(prev => [...prev, { text: `[${step+1}] ${msg.log}`, type: msg.type }]);
      setSimStep(step + 1);
      step++;
    }, 1400);
  }, [canSimulate, program, template, workspace, hasBattery, hasController]);

  const stopSim = () => {
    clearInterval(simRef.current);
    setSimRunning(false);
    setSimAction('');
    setSimLog(prev => [...prev, { text: '⏹️ Simulación detenida por usuario', type: 'system' }]);
  };

  const resetSim = () => {
    clearInterval(simRef.current);
    setSimRunning(false);
    setSimStep(0);
    setSimLog([]);
    setSimAction('');
    setSimFailed(false);
  };

  // -- Axon Merge mini-game --
  if (phase === 'axon_merge') {
    return <AxonMerge onBack={() => setPhase('select')} />;
  }

  // -- SumoBot Push mini-game --
  if (phase === 'sumo_push') {
    return <SumoBotPush onBack={() => setPhase('select')} />;
  }

  // -- Select screen (kid-friendly) --
  if (phase === 'select') {
    return (
      <div className="min-h-full bg-gradient-to-b from-purple-50 to-white animate-fade-in">
        <div className="bg-gradient-to-r from-[#CE82FF] to-[#A855F7] px-6 pt-6 pb-12 border-b-4 border-[#9333EA]">
          <button onClick={onBack} className="text-white/80 hover:text-white mb-4 flex items-center text-sm font-black active:scale-95 transition">
            <ArrowLeft size={18} className="mr-1" /> Volver
          </button>
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <span className="text-6xl block animate-bounce">🤖</span>
                <span className="absolute -right-2 -top-1 text-2xl animate-pulse">✨</span>
              </div>
            </div>
            <h1 className="text-2xl font-black text-white drop-shadow-lg">¡Construye tu Robot!</h1>
            <p className="text-white/90 text-sm font-bold mt-2 max-w-[280px] mx-auto">
              Elige un robot para aprender a armarlo de verdad 🔧
            </p>
          </div>
        </div>
        
        {/* Robot avatar helper */}
        <div className="flex justify-center -mt-6 mb-4">
          <div className="bg-white rounded-full p-1 shadow-lg border-2 border-purple-200">
            <RobotMini config={robotConfig} size={48} />
          </div>
        </div>
        
        <div className="px-4 pb-24 space-y-4">
          <p className="text-center text-sm text-purple-600 font-bold mb-2">
            👇 Toca un robot para ver las instrucciones
          </p>
          
          {/* Axon Merge mini-game card */}
          <div onClick={() => setPhase('axon_merge')}
            className="bg-white rounded-3xl border-3 border-[#E5E5E5] overflow-hidden cursor-pointer hover:border-[#0EA5E9] hover:shadow-xl transition-all duration-300 active:scale-[0.97] shadow-md">
            <div className="h-3 bg-gradient-to-r from-sky-400 to-blue-600"/>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-4xl flex-shrink-0 border-b-4 border-black/10 shadow-lg">
                  🧩
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-black text-[#3C3C3C]">Axon Merge</h3>
                  <p className="text-sm text-[#666] mt-1">¡Fusiona componentes electrónicos y construye un robot!</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs font-black text-sky-600 bg-sky-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span>🎮</span> Minijuego
                </span>
                <span className="text-xs font-black text-purple-600 bg-purple-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span>🧠</span> Física real
                </span>
                <span className="text-xs font-black text-green-600 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span>🔗</span> 10 niveles
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[#777]">
                  🤖 Resistor → CultivaTec Rover
                </span>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xs font-black shadow-md">
                  ¡Jugar! 🚀
                </div>
              </div>
            </div>
          </div>

          {/* SumoBot Push mini-game card */}
          <div onClick={() => setPhase('sumo_push')}
            className="bg-white rounded-3xl border-3 border-[#E5E5E5] overflow-hidden cursor-pointer hover:border-[#EF4444] hover:shadow-xl transition-all duration-300 active:scale-[0.97] shadow-md">
            <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"/>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center text-4xl flex-shrink-0 border-b-4 border-black/10 shadow-lg">
                  🤼
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-black text-[#3C3C3C]">SumoBot Push</h3>
                  <p className="text-sm text-[#666] mt-1">¡Pelea de robots sumo para 2 jugadores en el mismo celular!</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span>🎮</span> Minijuego
                </span>
                <span className="text-xs font-black text-red-600 bg-red-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span>👥</span> 2 Jugadores
                </span>
                <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <span>🏆</span> Mejor de 3
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[#777]">
                  🔵 Azul vs Rojo 🔴
                </span>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white text-xs font-black shadow-md">
                  ¡Pelear! ⚔️
                </div>
              </div>
            </div>
          </div>

          {ROBOT_TEMPLATES.map(t => {
            const instructions = ASSEMBLY_INSTRUCTIONS[t.id];
            return (
              <div key={t.id} onClick={() => pickTemplate(t)}
                className="bg-white rounded-3xl border-3 border-[#E5E5E5] overflow-hidden cursor-pointer hover:border-[#CE82FF] hover:shadow-xl transition-all duration-300 active:scale-[0.97] shadow-md">
                <div className={`h-3 bg-gradient-to-r ${t.color}`}/>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-4xl flex-shrink-0 border-b-4 border-black/10 shadow-lg`}>
                      {t.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-black text-[#3C3C3C]">{t.name}</h3>
                      <p className="text-sm text-[#666] mt-1">{t.desc}</p>
                    </div>
                  </div>
                  
                  {instructions && t.id !== 'free' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs font-black text-purple-600 bg-purple-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span>🎓</span> {instructions.difficulty}
                      </span>
                      <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span>⏱️</span> {instructions.time}
                      </span>
                      <span className="text-xs font-black text-green-600 bg-green-100 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span>👦</span> {instructions.age}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    {t.parts.length > 0 ? (
                      <span className="text-xs font-bold text-[#777]">
                        📦 {t.parts.length} piezas · 📝 {instructions?.steps?.length || 0} pasos
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#777]">
                        ✨ ¡Crea lo que imagines!
                      </span>
                    )}
                    <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${t.color} text-white text-xs font-black shadow-md`}>
                      ¡Empezar! →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -- Instructions screen (kid-friendly with TTS) --
  if (phase === 'instructions' && template) {
    const instructions = ASSEMBLY_INSTRUCTIONS[template.id];
    const steps = instructions?.steps || [];
    const currentStepData = steps[currentStep];
    const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

    return (
      <div className="min-h-full bg-gradient-to-b from-purple-50 to-white animate-fade-in flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#CE82FF] to-[#A855F7] px-5 pt-4 pb-5 border-b-4 border-[#9333EA]">
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => { stopSpeaking(); setPhase('select'); }} 
              className="text-white/80 hover:text-white flex items-center text-sm font-black active:scale-95 transition">
              <ArrowLeft size={18} className="mr-1" /> Cambiar Robot
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="text-lg">{template.icon}</span>
                <span className="text-xs font-black text-white">{template.name}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-black text-white text-center mb-2">{instructions?.title}</h2>
          
          {/* Progress bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-xs font-bold text-center mt-1">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        {/* Robot Avatar with speech */}
        <div className="flex justify-center py-4 bg-gradient-to-b from-purple-100 to-transparent">
          <div className="relative">
            <div className={`rounded-full p-1 shadow-lg border-3 transition-all duration-300 ${
              isSpeaking ? 'border-green-400 bg-green-50 animate-pulse' : 'border-purple-200 bg-white'
            }`}>
              <RobotMini config={robotConfig} size={64} />
            </div>
            {isSpeaking && (
              <div className="absolute -right-2 -top-2">
                <span className="text-2xl animate-bounce">🔊</span>
              </div>
            )}
          </div>
          <div className="ml-3 flex flex-col justify-center">
            <p className="text-sm font-black text-purple-700">
              {isSpeaking ? '¡Escucha con atención!' : '¡Toca el botón para que te lea!'}
            </p>
            <button 
              onClick={() => currentStepData && (isSpeaking ? stopSpeaking() : speakStep(currentStepData))}
              className={`mt-1 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 active:scale-95 transition shadow-md ${
                isSpeaking 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              }`}
            >
              {isSpeaking ? <><VolumeX size={16}/> Detener</> : <><Volume2 size={16}/> Leer Paso</>}
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 px-4 mb-3">
          <button 
            onClick={() => { setShowMaterials(true); setShowCode(false); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition ${
              showMaterials && !showCode ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            📦 Materiales
          </button>
          <button 
            onClick={() => { setShowMaterials(false); setShowCode(false); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition ${
              !showMaterials && !showCode ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            🔧 Pasos
          </button>
          <button 
            onClick={() => { setShowMaterials(false); setShowCode(true); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition ${
              showCode ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
            }`}
          >
            💻 Código
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto px-4 pb-32">
          
          {/* Materials tab */}
          {showMaterials && !showCode && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-2xl p-4 border-2 border-purple-100 shadow-md">
                <h3 className="text-lg font-black text-purple-700 mb-3 flex items-center gap-2">
                  <Package size={20}/> Lo que Necesitas
                </h3>
                <p className="text-sm text-gray-600 mb-4">{instructions?.intro}</p>
                
                <div className="space-y-3">
                  {instructions?.materials?.map((mat, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                      <span className="text-2xl">{mat.emoji}</span>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-gray-800">{mat.name}</span>
                          {mat.quantity > 0 && (
                            <span className="text-xs font-bold text-purple-600 bg-purple-200 px-2 py-0.5 rounded-full">
                              x{mat.quantity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{mat.desc}</p>
                        {mat.buyTip && (
                          <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                            <Lightbulb size={12}/> {mat.buyTip}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="bg-white rounded-2xl p-4 border-2 border-orange-100 shadow-md">
                <h3 className="text-base font-black text-orange-700 mb-2 flex items-center gap-2">
                  <Wrench size={18}/> Herramientas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {instructions?.tools?.map((tool, i) => (
                    <span key={i} className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full">
                      🔧 {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-2xl p-4 border-2 border-yellow-100 shadow-md">
                <h3 className="text-base font-black text-yellow-700 mb-2 flex items-center gap-2">
                  <Lightbulb size={18}/> Consejos Útiles
                </h3>
                <div className="space-y-2">
                  {instructions?.tips?.map((tip, i) => (
                    <p key={i} className="text-xs text-gray-600">{tip}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Steps tab */}
          {!showMaterials && !showCode && (
            <div className="space-y-4 animate-fade-in">
              {/* Current step card */}
              {currentStepData && (
                <div className="bg-white rounded-2xl p-4 border-3 border-purple-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl shadow-md">
                      {currentStepData.emoji}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-black text-gray-800">{currentStepData.title}</h3>
                      <button 
                        onClick={() => isSpeaking ? stopSpeaking() : speakStep(currentStepData)}
                        className="text-xs text-purple-600 font-bold flex items-center gap-1 mt-0.5"
                      >
                        {isSpeaking ? <VolumeX size={12}/> : <Volume2 size={12}/>}
                        {isSpeaking ? 'Detener' : 'Escuchar este paso'}
                      </button>
                    </div>
                    {completedSteps.includes(currentStep) && (
                      <CheckCircle size={24} className="text-green-500"/>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 font-medium">{currentStepData.description}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <h4 className="text-xs font-black text-gray-500 mb-2">📋 INSTRUCCIONES:</h4>
                    <div className="space-y-2">
                      {currentStepData.details?.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  {currentStepData.safety && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 flex items-start gap-2">
                      <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5"/>
                      <div>
                        <span className="text-xs font-black text-yellow-700">⚠️ SEGURIDAD:</span>
                        <p className="text-xs text-yellow-700 mt-0.5">{currentStepData.safety}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => { stopSpeaking(); setCurrentStep(s => Math.max(0, s - 1)); }}
                  disabled={currentStep === 0}
                  className={`flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-1 transition ${
                    currentStep === 0 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-gray-200 text-gray-700 active:scale-95'
                  }`}
                >
                  <ChevronUp size={16}/> Anterior
                </button>
                <button
                  onClick={() => { 
                    if (!completedSteps.includes(currentStep)) {
                      setCompletedSteps(prev => [...prev, currentStep]);
                    }
                    stopSpeaking(); 
                    setCurrentStep(s => Math.min(steps.length - 1, s + 1)); 
                  }}
                  disabled={currentStep >= steps.length - 1}
                  className={`flex-1 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-1 transition ${
                    currentStep >= steps.length - 1
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white active:scale-95 shadow-md'
                  }`}
                >
                  Siguiente <ChevronDown size={16}/>
                </button>
              </div>

              {/* All steps overview */}
              <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
                <h4 className="text-sm font-black text-gray-700 mb-3">📝 Todos los Pasos</h4>
                <div className="space-y-2">
                  {steps.map((step, i) => (
                    <button
                      key={i}
                      onClick={() => { stopSpeaking(); setCurrentStep(i); }}
                      className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
                        currentStep === i 
                          ? 'bg-purple-100 border-2 border-purple-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                        completedSteps.includes(i) 
                          ? 'bg-green-500 text-white' 
                          : currentStep === i 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {completedSteps.includes(i) ? <Check size={16}/> : step.emoji}
                      </div>
                      <span className={`text-sm font-bold ${currentStep === i ? 'text-purple-700' : 'text-gray-700'}`}>
                        {step.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Code tab */}
          {showCode && (
            <div className="animate-fade-in">
              <div className="bg-gray-900 rounded-2xl p-4 shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div className="w-3 h-3 rounded-full bg-green-500"/>
                  <span className="ml-auto text-xs text-gray-400 font-mono">Arduino IDE</span>
                </div>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                  {instructions?.code}
                </pre>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Copia este código y pégalo en Arduino IDE
              </p>
            </div>
          )}
        </div>

        {/* Bottom action button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent pt-6">
          <button
            onClick={() => { stopSpeaking(); setPhase('build'); }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Wrench size={20}/> Ir al Simulador Virtual →
          </button>
        </div>
      </div>
    );
  }

  // -- Main UI (build / program / simulate) --
  const partCategories = [...new Set(ALL_PARTS.map(p => p.cat))];
  const blockCategories = [...new Set(PROGRAM_BLOCKS.map(b => b.cat))];

  return (
    <div className="min-h-full bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-[#CE82FF] px-5 pt-4 pb-5 border-b-4 border-[#A855F7]">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => { resetSim(); setPhase('select'); }} className="text-white/70 hover:text-white flex items-center text-sm font-black active:scale-95 transition">
            <ArrowLeft size={18} className="mr-1" /> Robots
          </button>
          <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
            <span className="mr-1.5">{template?.icon}</span>
            <span className="text-xs font-black text-white">{template?.name}</span>
          </div>
        </div>
        {/* Phase tabs */}
        <div className="flex gap-1 mt-2">
          {[
            { id: 'instructions', label: '📖 Guía' },
            { id: 'build', label: '🔧 Armar' },
            { id: 'program', label: '💻 Prog.' },
            { id: 'simulate', label: '▶️ Simular' },
            { id: 'battle', label: '⚔️ Batalla' },
          ].map(tab => (
            <button key={tab.id}
              onClick={() => { setPhase(tab.id); if (tab.id !== 'simulate') { resetSim(); stopManualMode(); } if (tab.id !== 'battle') { resetBattle(); } if (tab.id === 'instructions') stopSpeaking(); }}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition active:scale-95
                ${phase === tab.id ? 'bg-white text-[#CE82FF] shadow-md' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto px-4 pt-4 pb-28">

        {/* ======= BUILD PHASE ======= */}
        {phase === 'build' && (
          <div className="space-y-4">
            {/* Kid-friendly welcome tip */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border-2 border-purple-100">
              <div className="flex items-start gap-3">
                <div className="text-3xl animate-bounce">🔧</div>
                <div>
                  <h3 className="text-base font-black text-purple-700">¡Hora de Armar tu Robot!</h3>
                  <p className="text-sm text-purple-600 mt-1">
                    {template?.id === 'sumo' && 'Coloca las piezas en tu robot de combate. ¡Necesita ser fuerte y rápido!'}
                    {template?.id === 'line' && 'Arma tu robot seguidor de líneas. ¡Debe tener buenos sensores para no perderse!'}
                    {template?.id === 'dog' && 'Construye tu perrito robot. ¡Necesita 4 patas, ojos y una voz para ladrar!'}
                    {template?.id === 'free' && '¡Crea lo que imagines! Elige las piezas que quieras.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual chassis assembly */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-black text-[#3C3C3C] flex items-center">
                  🤖 Tu Robot
                  <span className="ml-2 text-xs font-black text-[#CE82FF] bg-[#F3E8FF] px-2.5 py-1 rounded-full">{workspace.length} piezas</span>
                </h3>
                {workspace.length > 0 && (
                  <button onClick={() => { setWorkspace([]); setSlotAssignments({}); }} className="text-xs font-black text-[#FF4B4B] bg-[#FFE1E1] px-3 py-1.5 rounded-full hover:bg-[#FFD0D0] transition flex items-center">
                    <Trash2 size={12} className="mr-1"/> Quitar Todo
                  </button>
                )}
              </div>
              
              {/* Big chassis view */}
              <ChassisAssemblyView
                template={template}
                workspace={workspace}
                slotAssignments={slotAssignments}
                onSlotDrop={handleSlotDrop}
                onSlotRemove={handleSlotRemove}
              />

              {/* Component checklist - more descriptive */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-black text-gray-500">📋 ¿Tu robot tiene todo lo necesario?</p>
                {[
                  { ok: hasController, label: '🧠 Cerebro (Arduino)', desc: 'Piensa y toma decisiones' },
                  { ok: hasBattery, label: '🔋 Energía (Batería)', desc: 'Le da poder para moverse' },
                  { ok: hasMotor, label: '⚙️ Músculos (Motor)', desc: 'Lo hace caminar o rodar' },
                ].map((c, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm transition ${c.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <span className="text-lg">{c.ok ? '✅' : '❌'}</span>
                    <div>
                      <span className={`font-black ${c.ok ? 'text-green-700' : 'text-red-600'}`}>{c.label}</span>
                      <p className={`text-xs ${c.ok ? 'text-green-600' : 'text-red-500'}`}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kid-friendly build tips */}
            {template && BUILD_TIPS[template.id] && (
              <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-4">
                <h4 className="text-sm font-black text-yellow-700 mb-2 flex items-center gap-1">💡 ¿Sabías que...?</h4>
                <p className="text-sm text-yellow-700">
                  {BUILD_TIPS[template.id][Math.floor(Math.random() * BUILD_TIPS[template.id].length)]}
                </p>
              </div>
            )}

            {/* Mini-Games Hub - personalized per robot */}
            {template && template.id !== 'free' && (
              <RobotBuildGamesHub robotType={template.id} onBack={() => {}} />
            )}

            {/* Parts catalog with drag */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
              <h3 className="text-base font-black text-[#3C3C3C] mb-1">📦 Piezas Disponibles</h3>
              <p className="text-sm text-gray-500 font-medium mb-3">👆 Toca una pieza para agregarla a tu robot</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                {partCategories.map(cat => {
                  const catEmoji = { 'Chasis': '📦', 'Motores': '⚙️', 'Ruedas': '🔵', 'Sensores': '👁️', 'Control': '🧠', 'Energía': '🔋', 'Otros': '🔧' };
                  return (
                    <button key={cat} onClick={() => setPartCat(cat)}
                      className={`whitespace-nowrap px-3 py-2 rounded-full text-xs font-black transition active:scale-95 flex items-center gap-1
                        ${partCat === cat ? 'bg-[#CE82FF] text-white shadow-md border-b-2 border-[#A855F7]' : 'bg-[#F7F7F7] text-[#777] hover:bg-[#E5E5E5]'}`}>
                      {catEmoji[cat] || '📦'} {cat}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_PARTS.filter(p => p.cat === partCat).map(part => (
                  <div key={part.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({ from: 'catalog', partId: part.id }));
                    }}
                    onClick={() => {
                      // Auto-assign to first empty matching slot
                      const robotId = template?.id || 'free';
                      const slots = CHASSIS_SLOTS[robotId] || CHASSIS_SLOTS.free;
                      const emptySlot = slots.find(s => s.accepts.includes(part.cat) && !slotAssignments[s.id]);
                      if (emptySlot) {
                        const newPart = { ...part, uid: `${part.id}_${Date.now()}` };
                        setWorkspace(prev => [...prev, newPart]);
                        setSlotAssignments(prev => ({ ...prev, [emptySlot.id]: newPart.uid }));
                      } else {
                        addPartToWorkspace(part);
                      }
                    }}
                    className="flex flex-col items-center p-3 bg-white rounded-2xl border-2 border-gray-200 cursor-grab active:cursor-grabbing hover:border-violet-400 hover:shadow-lg transition active:scale-95 group"
                  >
                    <PartSVG partId={part.svg} size={60} />
                    <span className="text-xs font-black text-gray-700 mt-2 text-center leading-tight">{part.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold mt-0.5">{part.cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======= PROGRAM PHASE ======= */}
        {phase === 'program' && (
          <div className="space-y-4">
            {/* Kid-friendly intro */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-100">
              <div className="flex items-start gap-3">
                <div className="text-3xl animate-bounce">💻</div>
                <div>
                  <h3 className="text-base font-black text-blue-700">¡Programa tu Robot!</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Agrega instrucciones para decirle a tu robot qué hacer.
                    Es como darle una receta: primero haz esto, luego aquello...
                  </p>
                </div>
              </div>
            </div>

            {/* Current program */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-black text-[#3C3C3C] flex items-center">
                  📝 Instrucciones del Robot
                  <span className="ml-2 text-xs font-black text-[#CE82FF] bg-[#F3E8FF] px-2.5 py-1 rounded-full">{program.length} pasos</span>
                </h3>
                {program.length > 0 && (
                  <button onClick={() => setProgram([])} className="text-xs font-black text-[#FF4B4B] bg-[#FFE1E1] px-3 py-1.5 rounded-full hover:bg-[#FFD0D0] transition flex items-center">
                    <Trash2 size={12} className="mr-1"/> Borrar Todo
                  </button>
                )}
              </div>
              {program.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <span className="text-5xl block mb-3">📝</span>
                  <p className="text-sm font-bold text-gray-500">¡Tu robot no tiene instrucciones!</p>
                  <p className="text-xs text-gray-400 mt-1">Agrega bloques de abajo para enseñarle qué hacer 👇</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {program.map((block, idx) => (
                    <div key={block.uid}
                      className={`flex items-center gap-2 pl-3 pr-2 py-2.5 rounded-xl border-2 text-white ${block.color} border-white/20 group transition shadow-sm`}>
                      <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">{idx+1}</span>
                      <div className="flex-grow">
                        <span className="text-sm font-bold block">{block.label}</span>
                        {block.hint && <span className="text-[10px] text-white/70 block">{block.hint}</span>}
                      </div>
                      <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition">
                        <button onClick={() => moveBlock(idx, -1)} className="w-7 h-7 bg-white/20 rounded-lg hover:bg-white/40 flex items-center justify-center" title="Mover arriba">
                          <ChevronUp size={14}/>
                        </button>
                        <button onClick={() => moveBlock(idx, 1)} className="w-7 h-7 bg-white/20 rounded-lg hover:bg-white/40 flex items-center justify-center" title="Mover abajo">
                          <ChevronDown size={14}/>
                        </button>
                        <button onClick={() => removeBlockFromProgram(idx)} className="w-7 h-7 bg-red-400/60 rounded-lg hover:bg-red-400 flex items-center justify-center" title="Quitar">
                          <X size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Programming tip */}
            <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-4">
              <h4 className="text-sm font-black text-yellow-700 mb-1 flex items-center gap-1">💡 Consejo</h4>
              <p className="text-sm text-yellow-700">
                {PROGRAM_TIPS[program.length % PROGRAM_TIPS.length]}
              </p>
            </div>

            {/* Code preview */}
            {program.length > 0 && (
              <div className="bg-gray-900 p-4 rounded-2xl border-2 border-gray-700">
                <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center">
                  <Zap size={14} className="mr-1.5 text-green-400"/> Así se ve en código real
                </h3>
                <p className="text-xs text-gray-500 mb-3">Esto es lo que un programador escribe en su computadora:</p>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto leading-relaxed">
{`void setup() {
  Serial.begin(9600);
  // Configurar pines...
}

void loop() {
${program.map(b => `  ${b.code}`).join('\n')}
}`}
                </pre>
              </div>
            )}

            {/* Upload program to robot */}
            {program.length > 0 && (
              <div className="space-y-3">
                {/* Upload button */}
                {!isUploading && uploadProgress === 0 && (
                  <button onClick={startUpload}
                    className="w-full py-4 btn-3d btn-3d-green rounded-xl text-sm flex items-center justify-center gap-2 font-black">
                    <Upload size={18}/> 📡 Enviar Programa al Robot
                  </button>
                )}
                {/* Upload progress */}
                <FirmwareUpload
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  uploadStep={uploadStep}
                  uploadLog={uploadLog}
                />
                {/* Reset upload */}
                {uploadProgress >= 100 && (
                  <button onClick={resetUpload}
                    className="w-full py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition active:scale-[0.97] flex items-center justify-center gap-1.5">
                    <RotateCcw size={14}/> Cargar de Nuevo
                  </button>
                )}
              </div>
            )}

            {/* Block palette */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
              <h3 className="text-base font-black text-[#3C3C3C] mb-1">🧩 Bloques de Instrucciones</h3>
              <p className="text-sm text-gray-500 font-medium mb-3">👆 Toca un bloque para agregarlo al programa</p>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                {blockCategories.map(cat => {
                  const catEmoji = { 'Movimiento': '🏃', 'Sensores': '👁️', 'Pregunta': '❓', 'Control': '🎮', 'Acción': '⚡' };
                  return (
                    <button key={cat} onClick={() => setBlockCat(cat)}
                      className={`whitespace-nowrap px-3 py-2 rounded-full text-xs font-black transition active:scale-95 flex items-center gap-1
                        ${blockCat === cat ? 'bg-[#CE82FF] text-white shadow-md border-b-2 border-[#A855F7]' : 'bg-[#F7F7F7] text-[#777] hover:bg-[#E5E5E5]'}`}>
                      {catEmoji[cat] || '📦'} {cat}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2">
                {PROGRAM_BLOCKS.filter(b => b.cat === blockCat).map(block => (
                  <button key={block.id} onClick={() => addBlockToProgram(block)}
                    className={`${block.color} w-full text-white px-4 py-3 rounded-xl text-left transition active:scale-[0.97] hover:shadow-lg hover:brightness-110 flex items-center gap-3`}>
                    <span className="text-lg">{block.label.split(' ')[0]}</span>
                    <div>
                      <span className="text-sm font-bold block">{block.label.split(' ').slice(1).join(' ')}</span>
                      {block.hint && <span className="text-[10px] text-white/70 block">{block.hint}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======= SIMULATE PHASE ======= */}
        {phase === 'simulate' && (
          <div className="space-y-4">
            {/* Kid-friendly intro */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-100">
              <div className="flex items-start gap-3">
                <div className="text-3xl animate-bounce">▶️</div>
                <div>
                  <h3 className="text-base font-black text-green-700">¡Mira tu Robot en Acción!</h3>
                  <p className="text-sm text-green-600 mt-1">
                    {manualMode 
                      ? '🎮 ¡Tú controlas el robot! Usa los botones o el teclado para moverlo.' 
                      : '🤖 El robot sigue las instrucciones que le programaste. ¡Observa qué pasa!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mode toggle - bigger and clearer */}
            <div className="flex gap-3">
              <button onClick={() => { stopManualMode(); }} 
                className={`flex-1 py-3.5 rounded-2xl text-sm font-black transition active:scale-95 flex flex-col items-center justify-center gap-1
                  ${!manualMode ? 'bg-indigo-600 text-white shadow-lg border-b-4 border-indigo-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                <Cpu size={20}/>
                <span>Automático</span>
                <span className={`text-[10px] font-medium ${!manualMode ? 'text-indigo-200' : 'text-gray-400'}`}>El robot piensa solo</span>
              </button>
              <button onClick={startManualMode}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-black transition active:scale-95 flex flex-col items-center justify-center gap-1
                  ${manualMode ? 'bg-emerald-600 text-white shadow-lg border-b-4 border-emerald-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                <Gamepad2 size={20}/>
                <span>Tú lo Controlas</span>
                <span className={`text-[10px] font-medium ${manualMode ? 'text-emerald-200' : 'text-gray-400'}`}>Como un videojuego</span>
              </button>
            </div>

            {/* Arena */}
            <SimulationArena
              robotType={template}
              isRunning={simRunning}
              simStep={simStep}
              totalSteps={program.length}
              simAction={simAction}
              simFailed={simFailed}
              workspace={workspace}
              manualPos={manualPos}
              isManual={manualMode}
            />

            {/* Manual D-Pad */}
            {manualMode && (
              <div className="flex justify-center">
                <div className="bg-gray-900 rounded-2xl p-4 border-2 border-gray-700">
                  <VirtualDPad player={1} onMove={handleManualMove} onStop={handleManualStop} />
                  <p className="text-xs text-gray-400 text-center mt-3 font-bold">
                    🎮 Toca las flechas o usa WASD en tu teclado
                  </p>
                </div>
              </div>
            )}

            {/* Checklist (before start) - only in auto mode - more kid-friendly */}
            {!manualMode && !simRunning && simLog.length === 0 && (
              <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
                <h3 className="text-base font-black text-[#3C3C3C] mb-1">🚀 ¿Listo para Despegar?</h3>
                <p className="text-sm text-gray-500 mb-3">Revisemos que tu robot tenga todo lo necesario:</p>
                <div className="space-y-2.5">
                  {[
                    { ok: hasController, label: '🧠 Cerebro (Arduino)', desc: 'Para pensar y decidir', emoji: '🧠' },
                    { ok: hasBattery, label: '🔋 Energía (Batería)', desc: 'Para tener poder', emoji: '🔋' },
                    { ok: hasMotor, label: '⚙️ Músculos (Motor)', desc: 'Para moverse', emoji: '⚙️' },
                    { ok: program.length > 0, label: `📝 Instrucciones (${program.length} pasos)`, desc: 'Lo que el robot hará', emoji: '📝' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition ${item.ok ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                      <span className="text-xl">{item.ok ? '✅' : '❌'}</span>
                      <div>
                        <span className={item.ok ? 'text-green-700' : 'text-red-600'}>{item.label}</span>
                        <p className={`text-xs font-medium ${item.ok ? 'text-green-600' : 'text-red-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {!canSimulate && (
                  <div className="mt-4 bg-orange-50 border-2 border-orange-200 rounded-xl p-3 text-center">
                    <span className="text-2xl">🤔</span>
                    <p className="text-sm text-orange-700 font-bold mt-1">
                      Tu robot necesita más cosas para funcionar
                    </p>
                    <p className="text-xs text-orange-600 mt-0.5">
                      Regresa a "Armar" o "Programar" para completarlo
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Simulation Log - kid-friendly */}
            {!manualMode && simLog.length > 0 && (
              <div className="bg-gray-900 rounded-2xl border-2 border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center">
                    <Zap size={14} className="mr-1.5 text-green-400"/> 📺 Lo que hace tu Robot
                  </h3>
                  <button onClick={resetSim} className="text-xs font-bold text-gray-400 bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition flex items-center">
                    <RotateCcw size={12} className="mr-1"/> Reiniciar
                  </button>
                </div>
                <div className="max-h-[240px] overflow-y-auto p-3 space-y-1">
                  {simLog.map((log, i) => (
                    <div key={i} className={`text-sm font-mono py-1 px-2 rounded-lg animate-slide-up
                      ${log.type === 'system' ? 'text-gray-400 bg-gray-800/50' : ''}
                      ${log.type === 'ok' ? 'text-green-400 bg-green-900/20' : ''}
                      ${log.type === 'error' ? 'text-red-400 font-bold bg-red-900/20' : ''}
                      ${log.type === 'success' ? 'text-green-400 font-bold bg-green-900/30' : ''}
                      ${log.type === 'move' ? 'text-blue-300 bg-blue-900/20' : ''}
                      ${log.type === 'sensor' ? 'text-cyan-300 bg-cyan-900/20' : ''}
                      ${log.type === 'condition' ? 'text-amber-300 bg-amber-900/20' : ''}
                      ${log.type === 'control' ? 'text-purple-300 bg-purple-900/20' : ''}
                      ${log.type === 'action' ? 'text-rose-300 bg-rose-900/20' : ''}
                      ${log.type === 'divider' ? 'text-gray-600' : ''}
                    `}>
                      {log.text}
                    </div>
                  ))}
                  <div ref={logEndRef}/>
                </div>
              </div>
            )}

            {/* Parts summary - more visual */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
              <h3 className="text-sm font-black text-gray-700 mb-2">🔧 Piezas de tu Robot:</h3>
              <div className="flex flex-wrap gap-2">
                {workspace.map((p) => (
                  <div key={p.uid} className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5">
                    <PartSVG partId={p.svg} size={24}/>
                    <span className="text-xs font-bold text-purple-700">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======= BATTLE PHASE ======= */}
        {phase === 'battle' && (
          <div className="space-y-4">
            {/* Battle info card - kid-friendly */}
            {!battleActive && !winner && countdown === 0 && (
              <div className="bg-gradient-to-b from-purple-50 to-white border-2 border-purple-200 p-5 rounded-2xl text-center">
                <div className="text-6xl mb-3 animate-bounce">⚔️</div>
                <h3 className="text-xl font-black text-[#3C3C3C]">¡Modo Batalla!</h3>
                <p className="text-sm text-gray-600 mt-2 mb-5">Juega con un amigo: ¡cada uno controla un robot y tiene que empujar al otro fuera!</p>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-blue-50 border-3 border-blue-400 p-4 rounded-2xl shadow-md">
                    <div className="text-3xl mb-2">🔵</div>
                    <div className="text-sm font-black text-blue-600">Jugador 1</div>
                    <div className="bg-blue-100 rounded-lg p-2 mt-2">
                      <p className="text-xs font-bold text-blue-700">🎮 Controles:</p>
                      <p className="text-xs text-blue-600 mt-1">Teclas <span className="font-mono bg-blue-200 px-1 rounded">W</span> <span className="font-mono bg-blue-200 px-1 rounded">A</span> <span className="font-mono bg-blue-200 px-1 rounded">S</span> <span className="font-mono bg-blue-200 px-1 rounded">D</span></p>
                      <p className="text-xs text-blue-600">o D-Pad izquierdo</p>
                    </div>
                  </div>
                  <div className="bg-red-50 border-3 border-red-400 p-4 rounded-2xl shadow-md">
                    <div className="text-3xl mb-2">🔴</div>
                    <div className="text-sm font-black text-red-600">Jugador 2</div>
                    <div className="bg-red-100 rounded-lg p-2 mt-2">
                      <p className="text-xs font-bold text-red-700">🎮 Controles:</p>
                      <p className="text-xs text-red-600 mt-1">Teclas <span className="font-mono bg-red-200 px-1 rounded">↑</span> <span className="font-mono bg-red-200 px-1 rounded">←</span> <span className="font-mono bg-red-200 px-1 rounded">↓</span> <span className="font-mono bg-red-200 px-1 rounded">→</span></p>
                      <p className="text-xs text-red-600">o D-Pad derecho</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 mb-4">
                  <p className="text-sm text-yellow-700 font-bold flex items-center justify-center gap-1">
                    🏟️ {template?.arena === 'sumo' ? '¡Saca al rival del ring para ganar!' : '¡Empuja al rival fuera del campo!'}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">⏱️ Tienes 30 segundos por ronda</p>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-purple-100 px-4 py-2 rounded-full">
                    <Trophy size={16} className="inline mr-1.5 -mt-0.5 text-purple-600"/>
                    <span className="text-base font-black text-purple-700">Marcador: {scores[0]} - {scores[1]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Battle Arena */}
            {(battleActive || winner || countdown > 0) && (
              <>
                <BattleArena
                  robotType={template}
                  arenaType={template?.arena || 'field'}
                  isActive={battleActive}
                  p1Pos={p1Pos}
                  p2Pos={p2Pos}
                  p1Trail={p1Trail}
                  p2Trail={p2Trail}
                  scores={scores}
                  countdown={countdown}
                  winner={winner}
                  collisionFlash={collisionFlash}
                />

                {/* Timer */}
                {battleActive && !winner && (
                  <div className="text-center">
                    <span className={`inline-block text-lg font-black px-4 py-1 rounded-full ${battleTimer <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                      ⏱️ {battleTimer}s
                    </span>
                  </div>
                )}

                {/* D-Pads for touch control */}
                <div className="flex justify-between items-start gap-2 px-1">
                  <VirtualDPad player={1} compact onMove={handleP1Move} onStop={() => {}} />
                  <div className="flex flex-col items-center pt-4">
                    <span className="text-2xl font-black text-gray-800">{scores[0]} - {scores[1]}</span>
                    <span className="text-[9px] text-gray-400 font-bold mt-0.5">VS</span>
                  </div>
                  <VirtualDPad player={2} compact onMove={handleP2Move} onStop={() => {}} />
                </div>
              </>
            )}

            {/* Winner actions */}
            {winner && (
              <div className="flex gap-2">
                <button onClick={rematch}
                  className="flex-1 py-3 btn-3d btn-3d-purple rounded-xl text-sm flex items-center justify-center">
                  <RotateCcw size={16} className="mr-1.5"/> Revancha
                </button>
                <button onClick={() => { resetBattle(); setScores([0,0]); }}
                  className="flex-1 py-3 btn-3d btn-3d-gray rounded-xl text-sm flex items-center justify-center">
                  <RotateCcw size={16} className="mr-1.5"/> Reiniciar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action button - bigger and clearer for kids */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-20 pb-2">
        <div className="max-w-xl mx-auto">
          {phase === 'instructions' && (
            <button onClick={() => setPhase('build')}
              className="w-full py-4 btn-3d btn-3d-purple rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl">
              🔧 Ir a Armar el Robot <ChevronRight size={20}/>
            </button>
          )}
          {phase === 'build' && (
            <button onClick={() => setPhase('program')}
              className="w-full py-4 btn-3d btn-3d-purple rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl">
              💻 Siguiente: ¡Programar! <ChevronRight size={20}/>
            </button>
          )}
          {phase === 'program' && (
            <button onClick={() => setPhase('simulate')}
              className="w-full py-4 btn-3d btn-3d-green rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl">
              ▶️ Siguiente: ¡Ver en Acción! <ChevronRight size={20}/>
            </button>
          )}
          {phase === 'simulate' && !manualMode && !simRunning && (
            <button onClick={runSimulation} disabled={!canSimulate}
              className={`w-full py-4 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl
                ${canSimulate ? 'btn-3d btn-3d-green' : 'bg-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed'}`}>
              <Play size={20}/> {canSimulate ? '🚀 ¡Arrancar Robot!' : '⚠️ Falta completar el robot'}
            </button>
          )}
          {phase === 'simulate' && !manualMode && simRunning && (
            <button onClick={stopSim}
              className="w-full py-4 btn-3d btn-3d-red rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl">
              <Pause size={20}/> ⏹️ Detener Robot
            </button>
          )}
          {phase === 'simulate' && manualMode && (
            <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl py-3 px-4 text-center shadow-lg">
              <span className="text-sm font-black text-emerald-700">🎮 ¡Estás controlando el robot! Usa las flechas del D-Pad</span>
            </div>
          )}
          {phase === 'battle' && !battleActive && !winner && countdown === 0 && (
            <button onClick={startBattle}
              className="w-full py-4 btn-3d btn-3d-purple rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl">
              <Users size={20}/> ⚔️ ¡Iniciar Batalla!
            </button>
          )}
          {phase === 'battle' && battleActive && (
            <button onClick={resetBattle}
              className="w-full py-4 btn-3d btn-3d-red rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-xl">
              <Pause size={20}/> ⏹️ Detener Batalla
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   HELPER: Generate simulation log messages
   ================================================================ */
function getSimMessage(block, template, workspace) {
  const name = template?.name || 'Robot';
  const hasSensor = workspace.some(p => p.cat === 'Sensores');
  const randDist = Math.floor(Math.random() * 50 + 5);
  const randIR = Math.floor(Math.random() * 1024);

  const map = {
    'move_forward':      { log: `⚙️ ${name} avanza a velocidad media`, action: 'Avanza medio', type: 'move' },
    'move_forward_fast': { log: `⚡ ¡${name} avanza a MÁXIMA velocidad!`, action: 'Avanza rápido', type: 'move' },
    'move_backward':     { log: `⚙️ ${name} retrocede`, action: 'Retrocede', type: 'move' },
    'turn_left':         { log: `↩️ ${name} gira a la izquierda`, action: 'Gira izquierda', type: 'move' },
    'turn_right':        { log: `↪️ ${name} gira a la derecha`, action: 'Gira derecha', type: 'move' },
    'turn_180':          { log: `🔄 ¡${name} gira 180°!`, action: 'Giro 180', type: 'move' },
    'stop':              { log: `⏹️ ${name} se detiene`, action: 'Detiene', type: 'move' },
    'walk_forward':      { log: `🐾 ${name} camina (pata 1→2→3→4)`, action: 'Camina', type: 'move' },
    'sit':               { log: `🐕 ${name} se sienta (servos a 90°)`, action: 'Sienta', type: 'move' },
    'detect_enemy':      { log: `📡 Sensor ultrasónico: ${hasSensor ? `distancia = ${randDist}cm` : '⚠️ SIN SENSOR'}`, action: '', type: 'sensor' },
    'read_sensors':      { log: `🔴 Sensores IR: izq=${randIR} der=${1024-randIR}`, action: '', type: 'sensor' },
    'check_distance':    { log: `📏 Distancia medida: ${randDist}cm`, action: '', type: 'sensor' },
    'if_enemy_near':     { log: `🚨 ¿Enemigo cerca (< 25cm)? → ${randDist < 25 ? 'SÍ' : 'NO'}`, action: '', type: 'condition' },
    'if_obstacle':       { log: `🚧 ¿Obstáculo (< 20cm)? → ${randDist < 20 ? 'SÍ' : 'NO'}`, action: '', type: 'condition' },
    'if_line_left':      { log: `↩️ ¿Línea izquierda? → ${randIR > 500 ? 'SÍ' : 'NO'}`, action: randIR > 500 ? 'Gira izquierda' : '', type: 'condition' },
    'if_line_right':     { log: `↪️ ¿Línea derecha? → ${randIR < 500 ? 'SÍ' : 'NO'}`, action: randIR < 500 ? 'Gira derecha' : '', type: 'condition' },
    'if_line_center':    { log: `⬆️ ¿Línea al centro? → ${Math.random()>0.4 ? 'SÍ' : 'NO'}`, action: 'Avanza', type: 'condition' },
    'if_edge':           { log: `⚠️ ¿Borde del ring? → ${Math.random()>0.7 ? '¡SÍ!' : 'NO'}`, action: '', type: 'condition' },
    'else':              { log: `↔️ Ejecutando bloque else...`, action: '', type: 'control' },
    'end_if':            { log: `🔚 Fin del bloque condicional`, action: '', type: 'control' },
    'wait_1s':           { log: `⏱️ Esperando 1 segundo...`, action: '', type: 'control' },
    'wait_half':         { log: `⏱️ Esperando 0.5 segundos...`, action: '', type: 'control' },
    'repeat_forever':    { log: `♾️ Inicio de bucle infinito`, action: '', type: 'control' },
    'repeat_3':          { log: `🔁 Inicio de bucle (3 repeticiones)`, action: '', type: 'control' },
    'bark':              { log: `🔊 ¡${name} ladra! BEEP-BEEP!`, action: 'Ladra', type: 'action' },
    'led_on':            { log: `💡 LED encendido`, action: '', type: 'action' },
    'led_off':           { log: `🔌 LED apagado`, action: '', type: 'action' },
  };

  return map[block.id] || { log: `▶️ Ejecutando: ${block.label}`, action: '', type: 'system' };
}
