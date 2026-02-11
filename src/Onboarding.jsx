import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Star, Zap, RotateCcw } from 'lucide-react';

// ============================================
// ROBOT CHARACTER PARTS
// ============================================

const HEADS = [
  { id: 'round', label: 'Redonda', path: (c) => `<circle cx="50" cy="38" r="28" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="36" y="10" width="28" height="8" rx="4" fill="${c}99"/>` },
  { id: 'square', label: 'Cuadrada', path: (c) => `<rect x="22" y="14" width="56" height="50" rx="8" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="38" y="6" width="24" height="10" rx="4" fill="${c}99"/>` },
  { id: 'triangle', label: 'Triangular', path: (c) => `<polygon points="50,8 82,58 18,58" fill="${c}" stroke="${c}99" stroke-width="2" stroke-linejoin="round"/>` },
  { id: 'helmet', label: 'Casco', path: (c) => `<path d="M22 55 Q22 10 50 10 Q78 10 78 55 Z" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="18" y="50" width="64" height="8" rx="3" fill="${c}99"/>` },
  { id: 'cat', label: 'Gatito', path: (c) => `<circle cx="50" cy="42" r="24" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="30,22 26,4 42,18" fill="${c}" stroke="${c}99" stroke-width="2"/><polygon points="70,22 74,4 58,18" fill="${c}" stroke="${c}99" stroke-width="2"/>` },
  { id: 'alien', label: 'Alien', path: (c) => `<ellipse cx="50" cy="40" rx="30" ry="24" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="32" cy="16" r="8" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="68" cy="16" r="8" fill="${c}" stroke="${c}99" stroke-width="2"/><line x1="32" y1="24" x2="38" y2="32" stroke="${c}99" stroke-width="2"/><line x1="68" y1="24" x2="62" y2="32" stroke="${c}99" stroke-width="2"/>` },
];

const EYES = [
  { id: 'round', label: 'Redondos', path: () => `<circle cx="38" cy="38" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="62" cy="38" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="37" r="3.5" fill="#333"/><circle cx="64" cy="37" r="3.5" fill="#333"/><circle cx="41.5" cy="35.5" r="1.5" fill="white"/>` },
  { id: 'happy', label: 'Felices', path: () => `<path d="M32 36 Q38 28 44 36" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M56 36 Q62 28 68 36" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'screen', label: 'Pantalla', path: () => `<rect x="30" y="30" width="14" height="10" rx="2" fill="#00FF88" stroke="#333" stroke-width="1.5"/><rect x="56" y="30" width="14" height="10" rx="2" fill="#00FF88" stroke="#333" stroke-width="1.5"/><rect x="33" y="33" width="3" height="4" fill="#005533"/><rect x="39" y="33" width="3" height="4" fill="#005533"/><rect x="59" y="33" width="3" height="4" fill="#005533"/><rect x="65" y="33" width="3" height="4" fill="#005533"/>` },
  { id: 'big', label: 'Grandes', path: () => `<circle cx="38" cy="36" r="10" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="62" cy="36" r="10" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="40" cy="35" r="5" fill="#333"/><circle cx="64" cy="35" r="5" fill="#333"/><circle cx="42" cy="33" r="2" fill="white"/>` },
  { id: 'angry', label: 'Valientes', path: () => `<line x1="30" y1="30" x2="44" y2="34" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="70" y1="30" x2="56" y2="34" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><circle cx="38" cy="38" r="5" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="62" cy="38" r="5" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="39" cy="38" r="2.5" fill="#333"/><circle cx="63" cy="38" r="2.5" fill="#333"/>` },
  { id: 'heart', label: 'Corazón', path: () => `<path d="M34 35 C34 30 28 28 28 33 C28 38 34 42 34 42 C34 42 40 38 40 33 C40 28 34 30 34 35Z" fill="#FF4B6E" stroke="#333" stroke-width="1"/><path d="M66 35 C66 30 60 28 60 33 C60 38 66 42 66 42 C66 42 72 38 72 33 C72 28 66 30 66 35Z" fill="#FF4B6E" stroke="#333" stroke-width="1"/>` },
];

const MOUTHS = [
  { id: 'smile', label: 'Sonrisa', path: () => `<path d="M38 50 Q50 60 62 50" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'open', label: 'Abierta', path: () => `<ellipse cx="50" cy="52" rx="8" ry="6" fill="#333"/><ellipse cx="50" cy="50" rx="6" ry="3" fill="#FF6B6B"/>` },
  { id: 'line', label: 'Seria', path: () => `<line x1="40" y1="52" x2="60" y2="52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'zigzag', label: 'Robot', path: () => `<polyline points="36,52 42,48 48,52 54,48 60,52 66,48" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'tongue', label: 'Lengua', path: () => `<path d="M38 50 Q50 60 62 50" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="52" cy="55" rx="4" ry="5" fill="#FF6B6B"/>` },
  { id: 'teeth', label: 'Dientes', path: () => `<rect x="38" y="48" width="24" height="10" rx="3" fill="white" stroke="#333" stroke-width="1.5"/><line x1="44" y1="48" x2="44" y2="58" stroke="#333" stroke-width="1"/><line x1="50" y1="48" x2="50" y2="58" stroke="#333" stroke-width="1"/><line x1="56" y1="48" x2="56" y2="58" stroke="#333" stroke-width="1"/>` },
];

const BODIES = [
  { id: 'box', label: 'Caja', path: (c) => `<rect x="25" y="0" width="50" height="50" rx="8" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="35" y="8" width="30" height="6" rx="3" fill="${c}CC"/><circle cx="40" cy="22" r="3" fill="${c}CC"/><circle cx="50" cy="22" r="3" fill="${c}CC"/><circle cx="60" cy="22" r="3" fill="${c}CC"/>` },
  { id: 'rounded', label: 'Redondo', path: (c) => `<ellipse cx="50" cy="28" rx="28" ry="26" fill="${c}" stroke="${c}99" stroke-width="2"/><ellipse cx="50" cy="18" rx="12" ry="4" fill="${c}CC"/>` },
  { id: 'slim', label: 'Delgado', path: (c) => `<rect x="35" y="0" width="30" height="55" rx="10" fill="${c}" stroke="${c}99" stroke-width="2"/><circle cx="50" cy="15" r="5" fill="${c}CC"/><line x1="50" y1="25" x2="50" y2="40" stroke="${c}CC" stroke-width="2"/>` },
  { id: 'tank', label: 'Tanque', path: (c) => `<rect x="20" y="5" width="60" height="40" rx="6" fill="${c}" stroke="${c}99" stroke-width="2"/><rect x="15" y="40" width="70" height="12" rx="4" fill="${c}BB"/><circle cx="28" cy="46" r="5" fill="${c}99"/><circle cx="50" cy="46" r="5" fill="${c}99"/><circle cx="72" cy="46" r="5" fill="${c}99"/>` },
];

const ACCESSORIES = [
  { id: 'none', label: 'Ninguno', path: () => `` },
  { id: 'antenna', label: 'Antena', path: (c) => `<line x1="50" y1="0" x2="50" y2="-20" stroke="${c}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="-24" r="5" fill="#FF4B4B"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/></circle>` },
  { id: 'propeller', label: 'Hélice', path: (c) => `<line x1="50" y1="0" x2="50" y2="-12" stroke="${c}" stroke-width="3"/><ellipse cx="50" cy="-16" rx="18" ry="4" fill="${c}88"><animateTransform attributeName="transform" type="rotate" from="0 50 -16" to="360 50 -16" dur="0.5s" repeatCount="indefinite"/></ellipse>` },
  { id: 'crown', label: 'Corona', path: () => `<polygon points="34,-2 38,-16 44,-6 50,-18 56,-6 62,-16 66,-2" fill="#FFC800" stroke="#E5A800" stroke-width="1.5"/><circle cx="44" cy="-10" r="2" fill="#FF4B4B"/><circle cx="50" cy="-14" r="2" fill="#1CB0F6"/><circle cx="56" cy="-10" r="2" fill="#58CC02"/>` },
  { id: 'bow', label: 'Moño', path: () => `<ellipse cx="38" cy="-4" rx="10" ry="7" fill="#FF6B9D"/><ellipse cx="62" cy="-4" rx="10" ry="7" fill="#FF6B9D"/><circle cx="50" cy="-2" r="4" fill="#FF4B6E"/>` },
  { id: 'headphones', label: 'Audífonos', path: (c) => `<path d="M22 35 Q22 8 50 8 Q78 8 78 35" fill="none" stroke="#555" stroke-width="4"/><rect x="16" y="28" width="12" height="16" rx="4" fill="#555"/><rect x="72" y="28" width="12" height="16" rx="4" fill="#555"/>` },
];

const COLORS = [
  { id: 'blue', hex: '#3B82F6', label: 'Azul' },
  { id: 'cyan', hex: '#06B6D4', label: 'Cian' },
  { id: 'indigo', hex: '#6366F1', label: 'Índigo' },
  { id: 'green', hex: '#22C55E', label: 'Verde' },
  { id: 'red', hex: '#EF4444', label: 'Rojo' },
  { id: 'orange', hex: '#F97316', label: 'Naranja' },
  { id: 'pink', hex: '#EC4899', label: 'Rosa' },
  { id: 'purple', hex: '#A855F7', label: 'Morado' },
  { id: 'yellow', hex: '#EAB308', label: 'Amarillo' },
  { id: 'teal', hex: '#14B8A6', label: 'Turquesa' },
];

// ============================================
// RENDER ROBOT SVG
// ============================================

export const RobotAvatar = ({ config, size = 120, animate = false }) => {
  if (!config) return null;
  const head = HEADS.find(h => h.id === config.head) || HEADS[0];
  const eyes = EYES.find(e => e.id === config.eyes) || EYES[0];
  const mouth = MOUTHS.find(m => m.id === config.mouth) || MOUTHS[0];
  const body = BODIES.find(b => b.id === config.body) || BODIES[0];
  const acc = ACCESSORIES.find(a => a.id === config.accessory) || ACCESSORIES[0];
  const color = COLORS.find(c => c.id === config.color)?.hex || '#3B82F6';

  return (
    <svg width={size} height={size} viewBox="0 0 100 130" className={animate ? 'animate-float' : ''}>
      {/* Arms */}
      <rect x="4" y="72" width="14" height="30" rx="7" fill={color} stroke={color + '99'} strokeWidth="1.5" transform="rotate(-10 11 72)"/>
      <rect x="82" y="72" width="14" height="30" rx="7" fill={color} stroke={color + '99'} strokeWidth="1.5" transform="rotate(10 89 72)"/>
      {/* Body */}
      <g transform="translate(0, 65)">{/* SVG body */}
        <g dangerouslySetInnerHTML={{ __html: body.path(color) }}/>
      </g>
      {/* Legs */}
      <rect x="32" y="115" width="14" height="15" rx="5" fill={color + 'DD'} stroke={color + '99'} strokeWidth="1.5"/>
      <rect x="54" y="115" width="14" height="15" rx="5" fill={color + 'DD'} stroke={color + '99'} strokeWidth="1.5"/>
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
// Onboarding Component
// ============================================

const OnboardingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0=welcome, 1=name, 2=fullName, 3=age, 4=robot builder, 5=story intro
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [robotConfig, setRobotConfig] = useState({
    head: 'round', eyes: 'round', mouth: 'smile', body: 'box',
    accessory: 'antenna', color: 'blue'
  });
  const [robotName, setRobotName] = useState('');
  const [builderTab, setBuilderTab] = useState('head');

  const ages = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15+'];

  const handleComplete = () => {
    onComplete({
      userName: name.trim() || 'Explorador',
      fullName: fullName.trim() || name.trim() || 'Explorador',
      userAge: age || '10',
      robotConfig,
      robotName: robotName.trim() || 'Sparky'
    });
  };

  const randomize = () => {
    setRobotConfig({
      head: HEADS[Math.floor(Math.random() * HEADS.length)].id,
      eyes: EYES[Math.floor(Math.random() * EYES.length)].id,
      mouth: MOUTHS[Math.floor(Math.random() * MOUTHS.length)].id,
      body: BODIES[Math.floor(Math.random() * BODIES.length)].id,
      accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id,
      color: COLORS[Math.floor(Math.random() * COLORS.length)].id,
    });
  };

  const builderTabs = [
    { id: 'head', label: '🗣️ Cabeza', items: HEADS, key: 'head' },
    { id: 'eyes', label: '👀 Ojos', items: EYES, key: 'eyes' },
    { id: 'mouth', label: '👄 Boca', items: MOUTHS, key: 'mouth' },
    { id: 'body', label: '🦾 Cuerpo', items: BODIES, key: 'body' },
    { id: 'accessory', label: '🎩 Accesorio', items: ACCESSORIES, key: 'accessory' },
    { id: 'color', label: '🎨 Color', items: COLORS, key: 'color' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E3A5F] to-[#0F172A] text-white flex flex-col">
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
              ¡Comenzar Aventura! <ChevronRight size={24}/>
            </button>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="text-center max-w-md w-full animate-scale-in">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-3xl font-black mb-2">¿Cómo te llamas?</h2>
            <p className="text-blue-300 mb-6">Así te llamaremos durante tu aventura</p>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Escribe tu nombre..."
              className="w-full py-4 px-6 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-center text-xl font-bold placeholder-white/30 outline-none focus:border-cyan-400 transition-colors mb-6"
              maxLength={20} autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setStep(0)}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                <ChevronLeft size={18}/> Atrás
              </button>
              <button onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1">
                Siguiente <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Full Name for Certificate */}
        {step === 2 && (
          <div className="text-center max-w-md w-full animate-scale-in">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-black mb-2">Tu nombre completo</h2>
            <p className="text-blue-300 mb-2 text-sm">Este nombre aparecerá en tu <b className="text-cyan-300">certificado oficial</b> de CultivaTec</p>
            <p className="text-blue-400/60 mb-6 text-xs">Escribe tu nombre completo como quieres que aparezca</p>
            <input
              type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Ej: Juan Pablo García López"
              className="w-full py-4 px-6 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-center text-lg font-bold placeholder-white/30 outline-none focus:border-cyan-400 transition-colors mb-6"
              maxLength={60} autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                <ChevronLeft size={18}/> Atrás
              </button>
              <button onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1">
                Siguiente <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Age */}
        {step === 3 && (
          <div className="text-center max-w-md w-full animate-scale-in">
            <div className="text-6xl mb-4">🎂</div>
            <h2 className="text-3xl font-black mb-2">¿Cuántos años tienes{name ? `, ${name}` : ''}?</h2>
            <p className="text-blue-300 mb-6">Para personalizar tu experiencia de aprendizaje</p>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {ages.map(a => (
                <button key={a} onClick={() => setAge(a)}
                  className={`py-3 rounded-xl font-black text-lg transition-all active:scale-90
                    ${age === a ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 scale-105' : 'bg-white/10 border border-white/20 hover:bg-white/20'}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                <ChevronLeft size={18}/> Atrás
              </button>
              <button onClick={() => setStep(4)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1">
                Siguiente <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Robot Builder */}
        {step === 4 && (
          <div className="max-w-lg w-full animate-scale-in">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black mb-1">🤖 Crea tu Robot Compañero</h2>
              <p className="text-blue-300 text-sm">Este robot te acompañará en toda tu aventura de aprendizaje</p>
            </div>

            {/* Robot Preview */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-40 h-40 bg-white/10 backdrop-blur rounded-3xl border-2 border-white/20 flex items-center justify-center p-2">
                  <RobotAvatar config={robotConfig} size={130} animate />
                </div>
                <button onClick={randomize}
                  className="absolute -top-2 -right-2 w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-colors active:scale-90"
                  title="Aleatorio">
                  <RotateCcw size={16} className="text-yellow-800"/>
                </button>
              </div>
            </div>

            {/* Robot Name */}
            <input type="text" value={robotName} onChange={e => setRobotName(e.target.value)}
              placeholder="Nombre de tu robot..."
              className="w-full py-3 px-4 rounded-xl bg-white/10 border-2 border-white/20 text-white text-center font-bold placeholder-white/30 outline-none focus:border-cyan-400 transition-colors mb-3 text-sm"
              maxLength={16}/>

            {/* Builder Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {builderTabs.map(tab => (
                <button key={tab.id} onClick={() => setBuilderTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all
                    ${builderTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300 hover:bg-white/20'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Part Options */}
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 mb-4 max-h-48 overflow-y-auto">
              {builderTab === 'color' ? (
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map(c => (
                    <button key={c.id} onClick={() => setRobotConfig(prev => ({ ...prev, color: c.id }))}
                      className={`flex flex-col items-center py-2 rounded-xl transition-all
                        ${robotConfig.color === c.id ? 'bg-white/20 scale-105 ring-2 ring-cyan-400' : 'hover:bg-white/10'}`}>
                      <div className="w-8 h-8 rounded-full border-2 border-white/30 mb-1" style={{ backgroundColor: c.hex }}/>
                      <span className="text-[10px] font-bold">{c.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {builderTabs.find(t => t.id === builderTab)?.items.map(item => (
                    <button key={item.id}
                      onClick={() => setRobotConfig(prev => ({ ...prev, [builderTab]: item.id }))}
                      className={`flex flex-col items-center py-3 px-2 rounded-xl transition-all
                        ${robotConfig[builderTab] === item.id ? 'bg-blue-500/30 ring-2 ring-cyan-400 scale-105' : 'bg-white/5 hover:bg-white/10'}`}>
                      <svg width="40" height="40" viewBox="0 0 100 70">
                        <g dangerouslySetInnerHTML={{ __html: item.path(COLORS.find(c=>c.id===robotConfig.color)?.hex || '#3B82F6') }}/>
                      </svg>
                      <span className="text-[10px] font-bold mt-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                <ChevronLeft size={18}/> Atrás
              </button>
              <button onClick={() => setStep(5)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1">
                ¡Listo! <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Story intro */}
        {step === 5 && (
          <div className="text-center max-w-md animate-scale-in">
            <div className="w-32 h-32 mx-auto mb-4 bg-white/10 backdrop-blur rounded-3xl border-2 border-cyan-400/50 flex items-center justify-center p-2">
              <RobotAvatar config={robotConfig} size={110} animate />
            </div>
            <div className="text-3xl mb-2">🌟</div>
            <h2 className="text-2xl font-black mb-2">
              ¡{robotName || 'Sparky'} ha despertado!
            </h2>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20 mb-6 text-left">
              <p className="text-blue-200 leading-relaxed mb-3">
                En el Laboratorio de <span className="font-bold text-cyan-300">CultivaTec</span>, el profesor ha creado un robot especial: 
                <span className="font-bold text-white"> {robotName || 'Sparky'}</span>.
              </p>
              <p className="text-blue-200 leading-relaxed mb-3">
                Pero {robotName || 'Sparky'} acaba de nacer y no sabe nada del mundo. No sabe qué es la electricidad, 
                cómo funcionan los circuitos, ni cómo programar.
              </p>
              <p className="text-blue-200 leading-relaxed">
                <span className="font-bold text-white">{name || 'Explorador'}</span>, tú serás su maestro. 
                Cada lección que completes le enseñará algo nuevo a {robotName || 'Sparky'} y lo hará crecer. 
                ¡Tu misión es convertirlo en un robot completo! 🚀
              </p>
            </div>
            <button onClick={handleComplete}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Sparkles size={22}/> ¡Comenzar la Aventura!
            </button>
          </div>
        )}

        {/* Step indicators */}
        <div className="flex gap-2 mt-8">
          {[0,1,2,3,4].map(i => (
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

export { OnboardingScreen, STORY_CHAPTERS };
export default OnboardingScreen;
