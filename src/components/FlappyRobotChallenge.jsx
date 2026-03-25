import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Check, ChevronRight, Zap, Cpu, Sparkles, Lock, Unlock, Volume2, VolumeX, HelpCircle, Lightbulb } from 'lucide-react';
import { RobotAvatar } from '../Onboarding';

// ================================================================
// FLAPPY ROBOT CHALLENGE
// Phase 1: Assemble game code by arranging blocks
// Phase 2: Play the Flappy Bird-style robot game
// ================================================================

// Polyfill for CanvasRenderingContext2D.roundRect (older browsers)
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? (radii[0] || 0) : 0);
    if (r === 0) { this.rect(x, y, w, h); return; }
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

// ---- Sound helper ----
const useAudio = () => {
  const ctxRef = useRef(null);
  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };
  const playTone = (freq, dur, type = 'square', vol = 0.15) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  };
  return {
    snap:    () => playTone(880, 0.08, 'square', 0.12),
    correct: () => { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.15), 200); },
    wrong:   () => playTone(200, 0.3, 'sawtooth', 0.1),
    flap:    () => playTone(440, 0.08, 'triangle', 0.1),
    score:   () => { playTone(660, 0.1); setTimeout(() => playTone(880, 0.15), 80); },
    hit:     () => playTone(120, 0.4, 'sawtooth', 0.2),
    unlock:  () => { playTone(523, 0.12); setTimeout(() => playTone(659, 0.12), 120); setTimeout(() => playTone(784, 0.12), 240); setTimeout(() => playTone(1047, 0.2), 360); },
    drop:    () => playTone(300, 0.15, 'triangle', 0.08),
  };
};

// ================================================================
// BLOCK PROGRAMMING DATA
// 6 steps, each representing a game system to assemble
// ================================================================
const CODE_STEPS = [
  {
    id: 'variables',
    title: '📦 Variables del Robot',
    description: 'Define las variables que controlan al robot volador',
    hint: 'El robot necesita posición, velocidad y si está activo',
    correctOrder: ['robot_y', 'robot_velocity', 'gravity', 'game_active'],
    blocks: [
      { id: 'robot_y', label: 'robotY = pantalla / 2', icon: '📍', color: 'from-blue-500 to-cyan-600' },
      { id: 'robot_velocity', label: 'velocidad = 0', icon: '💨', color: 'from-purple-500 to-violet-600' },
      { id: 'gravity', label: 'gravedad = 0.4', icon: '🌍', color: 'from-green-500 to-emerald-600' },
      { id: 'game_active', label: 'juegoActivo = verdadero', icon: '🎮', color: 'from-amber-500 to-orange-600' },
    ],
    codePreview: `let robotY = canvas.height / 2;\nlet velocidad = 0;\nlet gravedad = 0.4;\nlet juegoActivo = true;`,
  },
  {
    id: 'flap',
    title: '🚀 Sistema de Vuelo',
    description: 'Programa el impulso cuando el robot "aletea"',
    hint: 'Al tocar la pantalla: sonido, velocidad negativa (sube), rotación',
    correctOrder: ['on_tap', 'play_sound', 'set_velocity', 'rotate_up'],
    blocks: [
      { id: 'on_tap', label: 'al tocar pantalla →', icon: '👆', color: 'from-cyan-500 to-blue-600' },
      { id: 'play_sound', label: '  reproducir sonido("bip")', icon: '🔊', color: 'from-pink-500 to-rose-600' },
      { id: 'set_velocity', label: '  velocidad = -7', icon: '⬆️', color: 'from-violet-500 to-purple-600' },
      { id: 'rotate_up', label: '  rotación = -20°', icon: '↩️', color: 'from-teal-500 to-cyan-600' },
    ],
    codePreview: `canvas.addEventListener('click', () => {\n  playSound('bip');\n  velocidad = -7;\n  rotacion = -20;\n});`,
  },
  {
    id: 'gravity_loop',
    title: '🌍 Loop de Gravedad',
    description: 'Cada frame, la gravedad tira al robot hacia abajo',
    hint: 'Suma gravedad a la velocidad, luego mueve al robot',
    correctOrder: ['each_frame', 'add_gravity', 'update_position', 'update_rotation'],
    blocks: [
      { id: 'each_frame', label: 'cada frame →', icon: '🔄', color: 'from-blue-500 to-indigo-600' },
      { id: 'add_gravity', label: '  velocidad += gravedad', icon: '⬇️', color: 'from-red-500 to-orange-600' },
      { id: 'update_position', label: '  robotY += velocidad', icon: '📐', color: 'from-green-500 to-teal-600' },
      { id: 'update_rotation', label: '  rotación += 2° (máx 70°)', icon: '🔃', color: 'from-amber-500 to-yellow-600' },
    ],
    codePreview: `function gameLoop() {\n  velocidad += gravedad;\n  robotY += velocidad;\n  rotacion = Math.min(rotacion + 2, 70);\n}`,
  },
  {
    id: 'pipes',
    title: '🏗️ Generador de Obstáculos',
    description: 'Crea los tubos (circuitos) que debe esquivar el robot',
    hint: 'Cada 2 segundos: posición aleatoria, espacio para pasar, mover izquierda',
    correctOrder: ['timer_2s', 'random_gap', 'create_pipe', 'move_left'],
    blocks: [
      { id: 'timer_2s', label: 'cada 2 segundos →', icon: '⏰', color: 'from-indigo-500 to-blue-600' },
      { id: 'random_gap', label: '  hueco = aleatorio(100, 350)', icon: '🎲', color: 'from-fuchsia-500 to-pink-600' },
      { id: 'create_pipe', label: '  crearTubo(x=400, hueco)', icon: '🏗️', color: 'from-emerald-500 to-green-600' },
      { id: 'move_left', label: '  tubo.x -= 3 cada frame', icon: '⬅️', color: 'from-orange-500 to-red-600' },
    ],
    codePreview: `setInterval(() => {\n  let hueco = random(100, 350);\n  tubos.push({x: 400, gap: hueco});\n}, 2000);\n// En gameLoop: tubo.x -= 3;`,
  },
  {
    id: 'collision',
    title: '💥 Detector de Colisiones',
    description: 'Detecta si el robot choca contra tubos o bordes',
    hint: 'Revisa si toca arriba/abajo y si toca los tubos',
    correctOrder: ['check_bounds', 'check_top_pipe', 'check_bottom_pipe', 'game_over'],
    blocks: [
      { id: 'check_bounds', label: 'si robotY < 0 o robotY > fondo →', icon: '🚧', color: 'from-red-500 to-rose-600' },
      { id: 'check_top_pipe', label: 'si robot toca tubo superior →', icon: '⬆️', color: 'from-orange-500 to-amber-600' },
      { id: 'check_bottom_pipe', label: 'si robot toca tubo inferior →', icon: '⬇️', color: 'from-yellow-500 to-orange-600' },
      { id: 'game_over', label: '  juegoActivo = falso ¡BOOM!', icon: '💀', color: 'from-gray-600 to-gray-800' },
    ],
    codePreview: `if (robotY < 0 || robotY > canvas.height) gameOver();\ntubos.forEach(t => {\n  if (colisiona(robot, t.top)) gameOver();\n  if (colisiona(robot, t.bottom)) gameOver();\n});`,
  },
  {
    id: 'score',
    title: '⭐ Sistema de Puntuación',
    description: 'Suma puntos cada vez que el robot pasa un obstáculo',
    hint: 'Cuando el tubo pasa al robot: +1 punto, sonido, efecto',
    correctOrder: ['check_pass', 'add_point', 'play_score_sound', 'show_effect'],
    blocks: [
      { id: 'check_pass', label: 'si tubo.x < robotX →', icon: '✅', color: 'from-green-500 to-emerald-600' },
      { id: 'add_point', label: '  puntos += 1', icon: '🔢', color: 'from-blue-500 to-cyan-600' },
      { id: 'play_score_sound', label: '  reproducir sonido("punto")', icon: '🎵', color: 'from-pink-500 to-fuchsia-600' },
      { id: 'show_effect', label: '  mostrar "+1" flotante', icon: '✨', color: 'from-amber-500 to-yellow-600' },
    ],
    codePreview: `tubos.forEach(t => {\n  if (!t.scored && t.x + 50 < robotX) {\n    puntos++;\n    t.scored = true;\n    playSound('punto');\n  }\n});`,
  },
];

// ================================================================
// BLOCK PROGRAMMING COMPONENT
// ================================================================
function BlockProgramming({ onComplete, sound, robotConfig }) {
  // Restore saved progress from localStorage
  const savedProgress = (() => {
    try {
      const saved = localStorage.getItem('flappy_block_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  })();

  const initialStepIdx = (() => {
    const allStepIds = CODE_STEPS.map(s => s.id);
    const firstIncomplete = allStepIds.findIndex(id => !savedProgress.includes(id));
    return firstIncomplete === -1 ? allStepIds.length - 1 : firstIncomplete;
  })();

  const [currentStepIdx, setCurrentStepIdx] = useState(initialStepIdx);
  const [placedBlocks, setPlacedBlocks] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [completedSteps, setCompletedSteps] = useState(savedProgress);
  const [showCode, setShowCode] = useState(false);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [allDone, setAllDone] = useState(savedProgress.length >= CODE_STEPS.length);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dropTargetIdx, setDropTargetIdx] = useState(null);
  const [failCount, setFailCount] = useState(0);
  const [blockStatus, setBlockStatus] = useState([]);
  const slotsRef = useRef(null);

  const step = CODE_STEPS[currentStepIdx];

  // Persist completed steps to localStorage
  useEffect(() => {
    try { localStorage.setItem('flappy_block_progress', JSON.stringify(completedSteps)); } catch {}
  }, [completedSteps]);

  // Get the expected block for a given slot index
  const getExpectedBlock = (slotIdx) => {
    const expectedId = step.correctOrder[slotIdx];
    return step.blocks.find(b => b.id === expectedId);
  };

  // Shuffle blocks when step changes
  useEffect(() => {
    const shuffled = [...step.blocks].sort(() => Math.random() - 0.5);
    setAvailableBlocks(shuffled);
    setPlacedBlocks([]);
    setShowCode(false);
    setFailCount(0);
    setBlockStatus([]);
  }, [currentStepIdx]);

  // Auto-place the next correct block (hint)
  const useHint = () => {
    const nextSlotIdx = placedBlocks.length;
    if (nextSlotIdx >= step.correctOrder.length) return;
    const expectedId = step.correctOrder[nextSlotIdx];
    const block = availableBlocks.find(b => b.id === expectedId) || step.blocks.find(b => b.id === expectedId);
    if (!block) return;
    sound.snap();
    setPlacedBlocks(prev => [...prev, block]);
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
    setBlockStatus([]);
  };

  const handleBlockTap = (block) => {
    if (placedBlocks.find(b => b.id === block.id)) return;
    sound.snap();
    setPlacedBlocks(prev => [...prev, block]);
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id));
    setBlockStatus([]);
  };

  const handleRemoveBlock = (block) => {
    sound.drop();
    setPlacedBlocks(prev => prev.filter(b => b.id !== block.id));
    setAvailableBlocks(prev => [...prev, block]);
    setBlockStatus([]);
  };

  const checkOrder = () => {
    const placedIds = placedBlocks.map(b => b.id);
    const isCorrect = JSON.stringify(placedIds) === JSON.stringify(step.correctOrder);

    if (isCorrect) {
      sound.correct();
      setCelebrate(true);
      setShowCode(true);
      setCompletedSteps(prev => [...prev, step.id]);
      setBlockStatus(placedIds.map(() => 'correct'));
      setTimeout(() => setCelebrate(false), 1500);
    } else {
      sound.wrong();
      setShake(true);
      setFailCount(prev => prev + 1);
      const status = placedIds.map((id, idx) => id === step.correctOrder[idx] ? 'correct' : 'wrong');
      setBlockStatus(status);
      setTimeout(() => setShake(false), 500);
    }
  };

  const goNext = () => {
    if (currentStepIdx < CODE_STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      sound.unlock();
      setAllDone(true);
    }
  };

  // All done - show launch screen
  if (allDone) {
    return (
      <div className="min-h-full galaxy-bg flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
        {/* Particles */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-ping" style={{
            width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`,
            background: ['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'][i % 5],
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 1}s`, animationDelay: `${Math.random() * 2}s`,
            opacity: 0.6,
          }} />
        ))}

        <div className="text-center relative z-10">
          {robotConfig ? (
            <div className="mb-4 flex justify-center">
              <div className="animate-bounce"><RobotAvatar config={robotConfig} size={100} /></div>
            </div>
          ) : (
            <div className="text-8xl mb-6 animate-bounce">🤖</div>
          )}
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3">
            ¡CÓDIGO COMPLETO!
          </h1>
          <p className="text-blue-300/80 text-sm mb-2 font-bold">
            Has ensamblado los 6 sistemas del juego
          </p>
          <div className="flex justify-center gap-2 mb-8">
            {CODE_STEPS.map((s, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-green-500/30 border border-green-400/50 flex items-center justify-center">
                <Check size={16} className="text-green-400" />
              </div>
            ))}
          </div>

          <button onClick={onComplete}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black text-lg shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform flex items-center gap-3 mx-auto">
            <Play size={24} /> ¡JUGAR AHORA!
          </button>
          <p className="text-blue-400/50 text-xs mt-4">Tu robot está listo para volar</p>
        </div>
      </div>
    );
  }

  const progress = ((completedSteps.length) / CODE_STEPS.length) * 100;
  const isStepComplete = completedSteps.includes(step.id);
  const canCheck = placedBlocks.length === step.blocks.length;

  return (
    <div className="min-h-full galaxy-bg flex flex-col animate-fade-in relative overflow-hidden">
      {/* Background stars */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="galaxy-star" style={{
          width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
          top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
          '--twinkle-duration': `${Math.random() * 3 + 2}s`,
        }} />
      ))}

      {/* Header */}
      <div className="px-4 pt-4 pb-3 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-blue-400/60">ENSAMBLAJE DE CÓDIGO</span>
          <span className="text-xs font-black text-cyan-400">{completedSteps.length}/{CODE_STEPS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-[#1a1a3e] border border-blue-500/20 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          {CODE_STEPS.map((s, i) => (
            <div key={i} onClick={() => completedSteps.includes(s.id) || i === currentStepIdx ? setCurrentStepIdx(i) : null}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all cursor-pointer
                ${completedSteps.includes(s.id) ? 'bg-green-500/30 border border-green-400/50 text-green-400' :
                  i === currentStepIdx ? 'bg-cyan-500/30 border border-cyan-400/50 text-cyan-400 scale-110' :
                  'bg-[#1a1a3e] border border-blue-500/20 text-blue-500/40'}`}>
              {completedSteps.includes(s.id) ? <Check size={14} /> : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Step title + guide */}
      <div className="px-4 pb-3 relative z-10">
        <h2 className="text-lg font-black text-white">{step.title}</h2>
        <p className="text-xs text-blue-300/70 mt-1">{step.description}</p>
        {/* Inline guide */}
        <div className="mt-2 bg-indigo-500/10 border border-indigo-400/20 rounded-lg p-2 flex items-start gap-2">
          <Lightbulb size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-indigo-300/80">Ordena los bloques de arriba a abajo. Cada slot muestra una pista con el ícono esperado. {failCount > 0 ? 'Los bloques verdes están bien, los rojos están en posición incorrecta.' : 'Toca un bloque para colocarlo en el siguiente espacio.'}</p>
        </div>
      </div>

      {/* Assembly area */}
      <div className="flex-grow px-4 pb-4 relative z-10 flex flex-col gap-3 overflow-auto">

        {/* Drop slots */}
        <div className="space-y-2" ref={slotsRef}>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Ensamblaje — toca bloques en orden</span>
          </div>
          {step.correctOrder.map((_, slotIdx) => {
            const block = placedBlocks[slotIdx];
            const expectedBlock = getExpectedBlock(slotIdx);
            const status = blockStatus[slotIdx];
            return (
              <div key={slotIdx}
                onClick={() => block && !isStepComplete && handleRemoveBlock(block)}
                className={`min-h-[52px] rounded-xl border-2 border-dashed flex items-center gap-3 px-3 py-2 transition-all
                  ${status === 'correct' ? 'border-green-400/60 bg-green-500/10' :
                    status === 'wrong' ? 'border-red-400/60 bg-red-500/10' :
                    block ? 'border-cyan-400/40 bg-cyan-500/10' :
                    dropTargetIdx === slotIdx ? 'border-cyan-400/60 bg-cyan-500/20 scale-[1.02]' :
                    'border-blue-500/20 bg-[#0f0f2e]/60'}
                  ${shake && !isStepComplete ? 'animate-shake' : ''}`}>
                {/* Slot number badge */}
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0
                  ${status === 'correct' ? 'bg-green-500/30 text-green-400' :
                    status === 'wrong' ? 'bg-red-500/30 text-red-400' :
                    block ? 'bg-cyan-500/30 text-cyan-400' :
                    'bg-blue-500/10 text-blue-500/40'}`}>
                  {status === 'correct' ? '✓' : status === 'wrong' ? '✗' : slotIdx + 1}
                </span>
                {block ? (
                  <>
                    <span className="text-xl">{block.icon}</span>
                    <span className="text-xs font-bold text-white flex-grow font-mono">{block.label}</span>
                    {!status && !isStepComplete && <span className="text-blue-400/40 text-[10px]">quitar</span>}
                  </>
                ) : (
                  <span className="text-xs text-blue-500/30 font-mono flex items-center gap-2">
                    <span className="text-lg opacity-30">{expectedBlock?.icon}</span>
                    {failCount >= 1
                      ? <span>Busca el bloque {expectedBlock?.icon} <span className="text-amber-400/50">({expectedBlock?.label?.split(' ')[0]}...)</span></span>
                      : <span>Bloque {slotIdx + 1} — toca abajo ↓</span>}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Available blocks */}
        {!isStepComplete && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Bloques disponibles</span>
            </div>
            <div className="space-y-2">
              {availableBlocks.map(block => {
                const nextCorrectId = step.correctOrder[placedBlocks.length];
                const isNextCorrect = failCount >= 1 && block.id === nextCorrectId;
                return (
                  <div key={block.id}
                    onClick={() => handleBlockTap(block)}
                    className={`rounded-xl bg-gradient-to-r ${block.color} p-3 flex items-center gap-3 active:scale-95 transition-transform cursor-pointer shadow-lg
                      ${isNextCorrect ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0f0f2e] scale-[1.02]' : ''}`}>
                    <span className="text-xl">{block.icon}</span>
                    <span className="text-xs font-bold text-white font-mono flex-grow">{block.label}</span>
                    {isNextCorrect && <span className="text-[10px] bg-amber-400/30 text-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">← siguiente</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hint */}
        {!isStepComplete && (
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 mt-1">
            <p className="text-[11px] text-amber-300/80">💡 <strong>Pista:</strong> {step.hint}</p>
          </div>
        )}

        {/* Help button after 2 failures */}
        {!isStepComplete && failCount >= 2 && availableBlocks.length > 0 && (
          <button onClick={useHint}
            className="w-full py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <HelpCircle size={14} /> Colocar siguiente bloque automáticamente
          </button>
        )}

        {/* Code preview (after completion) */}
        {isStepComplete && (
          <div className="bg-[#0d1117] border border-green-500/30 rounded-xl p-3 mt-1 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-[10px] text-green-400/60 ml-2 font-mono">{step.id}.js</span>
            </div>
            <pre className="text-[11px] text-green-400 font-mono whitespace-pre-wrap leading-relaxed">{step.codePreview}</pre>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div className="px-4 pb-6 pt-2 relative z-10">
        {!isStepComplete ? (
          <button onClick={checkOrder} disabled={!canCheck}
            className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all
              ${canCheck ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white active:scale-95 shadow-lg shadow-cyan-500/20' :
              'bg-[#1a1a3e] text-blue-500/30 border border-blue-500/10'}`}>
            <Check size={18} /> {canCheck ? '¡VERIFICAR CÓDIGO!' : `Coloca ${step.blocks.length - placedBlocks.length} bloques más`}
          </button>
        ) : (
          <button onClick={goNext}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-green-500/20 transition-transform">
            {currentStepIdx < CODE_STEPS.length - 1 ? (
              <><ChevronRight size={18} /> SIGUIENTE SISTEMA</>
            ) : (
              <><Sparkles size={18} /> ¡COMPILAR JUEGO!</>
            )}
          </button>
        )}
      </div>

      {/* Celebrate overlay */}
      {celebrate && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-2">✅</div>
            <p className="text-xl font-black text-green-400">¡CORRECTO!</p>
          </div>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${Math.random() * 8 + 4}px`, height: `${Math.random() * 8 + 4}px`,
              background: ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'][i % 5],
              top: `${30 + Math.random() * 40}%`, left: `${10 + Math.random() * 80}%`,
              animation: `confetti-fall ${Math.random() * 1 + 0.5}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.3}s`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ================================================================
// FLAPPY ROBOT GAME (Canvas-based)
// ================================================================
function FlappyRobotGame({ onBack, sound, robotConfig }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const gameRef = useRef(null);
  const avatarImgRef = useRef(null);
  const avatarLoadedRef = useRef(false);
  const avatarRenderRef = useRef(null);

  const [phase, setPhase] = useState('ready'); // ready | playing | dead
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try { return parseInt(localStorage.getItem('flappy_robot_best') || '0', 10); } catch { return 0; }
  });
  const [muted, setMuted] = useState(false);

  // Convert rendered RobotAvatar (in hidden container) to a canvas-drawable Image
  useEffect(() => {
    if (!robotConfig || !avatarRenderRef.current) return;
    const timer = setTimeout(() => {
      try {
        const container = avatarRenderRef.current;
        if (!container) return;

        // Check for img element (PNG skin)
        const imgEl = container.querySelector('img');
        if (imgEl && imgEl.src) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => { avatarImgRef.current = img; avatarLoadedRef.current = true; };
          img.onerror = () => { avatarLoadedRef.current = false; };
          img.src = imgEl.src;
          return;
        }

        // Check for SVG element (legacy custom robot)
        const svgEl = container.querySelector('svg');
        if (svgEl) {
          const svgData = new XMLSerializer().serializeToString(svgEl);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.onload = () => {
            avatarImgRef.current = img;
            avatarLoadedRef.current = true;
            URL.revokeObjectURL(url);
          };
          img.onerror = () => { URL.revokeObjectURL(url); };
          img.src = url;
        }
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [robotConfig]);

  // Robot sprite frames draw helper
  const drawRobot = useCallback((ctx, x, y, rotation, frame) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    const s = 22;
    const bobble = Math.sin(frame * 0.15) * 2;

    // If avatar image is loaded, draw it
    if (avatarLoadedRef.current && avatarImgRef.current) {
      const imgSize = s * 2.2;
      ctx.drawImage(avatarImgRef.current, -imgSize / 2, -imgSize / 2 + bobble, imgSize, imgSize);

      // Thruster glow below avatar
      const thrust = Math.random() * 4 + 4;
      ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(-8, imgSize / 2 + bobble - 4);
      ctx.lineTo(8, imgSize / 2 + bobble - 4);
      ctx.lineTo(0, imgSize / 2 + thrust + bobble);
      ctx.fill();

      ctx.restore();
      return;
    }

    // Fallback: default robot sprite
    // Body
    ctx.fillStyle = '#3B82F6';
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-s, -s + bobble, s * 2, s * 2, 6);
    ctx.fill();
    ctx.stroke();

    // Screen/face
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(-s + 4, -s + 4 + bobble, s * 2 - 8, s - 2, 3);
    ctx.fill();

    // Eyes
    const eyeGlow = Math.sin(frame * 0.1) > 0;
    ctx.fillStyle = eyeGlow ? '#22D3EE' : '#06B6D4';
    ctx.shadowColor = '#22D3EE';
    ctx.shadowBlur = 6;
    ctx.fillRect(-s + 8, -s + 8 + bobble, 7, 5);
    ctx.fillRect(s - 15, -s + 8 + bobble, 7, 5);
    ctx.shadowBlur = 0;

    // Antenna
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -s + bobble);
    ctx.lineTo(0, -s - 8 + bobble);
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, -s - 10 + bobble, 3, 0, Math.PI * 2);
    ctx.fill();

    // Propeller / wings
    const wingAngle = frame * 0.5;
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s - 2, -4 + bobble);
    ctx.lineTo(-s - 12, -8 + Math.sin(wingAngle) * 6 + bobble);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s + 2, -4 + bobble);
    ctx.lineTo(s + 12, -8 + Math.sin(wingAngle + Math.PI) * 6 + bobble);
    ctx.stroke();

    // Thruster glow
    const thrust = Math.random() * 4 + 4;
    ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.moveTo(-8, s + bobble);
    ctx.lineTo(8, s + bobble);
    ctx.lineTo(0, s + thrust + bobble);
    ctx.fill();

    ctx.restore();
  }, []);

  // Draw pipe (circuit board style)
  const drawPipe = useCallback((ctx, x, gapY, gapSize, w, h, frame) => {
    const pipeW = 52;
    const topH = gapY - gapSize / 2;
    const botY = gapY + gapSize / 2;

    // Top pipe
    const grad1 = ctx.createLinearGradient(x, 0, x + pipeW, 0);
    grad1.addColorStop(0, '#065F46');
    grad1.addColorStop(0.5, '#059669');
    grad1.addColorStop(1, '#065F46');
    ctx.fillStyle = grad1;
    ctx.fillRect(x, 0, pipeW, topH);

    // Top pipe cap
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 4, topH - 20, pipeW + 8, 20);
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, topH - 20, pipeW + 8, 20);

    // Circuit traces on top pipe
    ctx.strokeStyle = '#34D39944';
    ctx.lineWidth = 1;
    for (let i = 0; i < topH; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + 10, i);
      ctx.lineTo(x + pipeW - 10, i);
      ctx.stroke();
    }
    // LED dots
    ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + Math.sin(frame * 0.1) * 0.3})`;
    for (let i = 10; i < topH - 10; i += 30) {
      ctx.beginPath();
      ctx.arc(x + pipeW / 2, i, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bottom pipe
    ctx.fillStyle = grad1;
    ctx.fillRect(x, botY, pipeW, h - botY);

    // Bottom pipe cap
    ctx.fillStyle = '#10B981';
    ctx.fillRect(x - 4, botY, pipeW + 8, 20);
    ctx.strokeStyle = '#34D399';
    ctx.strokeRect(x - 4, botY, pipeW + 8, 20);

    // Circuit traces on bottom pipe
    ctx.strokeStyle = '#34D39944';
    for (let i = botY + 25; i < h; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + 10, i);
      ctx.lineTo(x + pipeW - 10, i);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(52, 211, 153, ${0.4 + Math.sin(frame * 0.1 + 1) * 0.3})`;
    for (let i = botY + 30; i < h - 10; i += 30) {
      ctx.beginPath();
      ctx.arc(x + pipeW / 2, i, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Init game
  const initGame = useCallback((w, h) => {
    return {
      robotX: w * 0.22,
      robotY: h / 2,
      velocity: 0,
      gravity: 0.28,
      flapPower: -6,
      rotation: 0,
      pipes: [],
      pipeTimer: 0,
      pipeInterval: 130,
      pipeSpeed: 2.2,
      gapSize: 160,
      score: 0,
      frame: 0,
      dead: false,
      flashTimer: 0,
      particles: [],
      scorePopups: [],
      groundY: h - 40,
      gracePipes: 2,
    };
  }, []);

  // Flap
  const flap = useCallback(() => {
    const g = gameRef.current;
    if (!g || g.dead) return;
    g.velocity = g.flapPower;
    g.rotation = -25;
    if (!muted) sound.flap();
  }, [muted, sound]);

  // Start game
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    // Ensure canvas has valid dimensions
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    const w = canvas.width;
    const h = canvas.height;
    if (w < 10 || h < 10) return; // Safety: don't init with tiny canvas
    gameRef.current = initGame(w, h);
    setScore(0);
    setPhase('playing');
  }, [initGame]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');

    const loop = () => {
      try {
      const w = canvas.width;
      const h = canvas.height;
      if (w < 10 || h < 10) { frameRef.current = requestAnimationFrame(loop); return; }
      const g = gameRef.current;

      // Background - dark sky with gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0c0a1a');
      bgGrad.addColorStop(0.5, '#1a1040');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = '#ffffff22';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97.3 + (g ? g.frame * 0.1 : 0)) % w;
        const sy = (i * 53.7) % (h - 60);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Ground
      const groundY = g ? g.groundY : h - 40;
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, groundY, w, h - groundY);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Ground circuit pattern
      ctx.strokeStyle = '#33415522';
      for (let i = 0; i < w; i += 30) {
        const offset = g ? (g.frame * g.pipeSpeed) % 30 : 0;
        ctx.beginPath();
        ctx.moveTo(i - offset, groundY + 10);
        ctx.lineTo(i + 15 - offset, groundY + 10);
        ctx.lineTo(i + 15 - offset, groundY + 25);
        ctx.stroke();
      }

      if (!g) {
        // Pre-game: draw idle robot
        drawRobot(ctx, w * 0.22, h / 2, 0, Date.now() * 0.01);

        // Title text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Toca para volar', w / 2, h / 2 - 60);
        ctx.font = '12px system-ui';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('Esquiva los circuitos', w / 2, h / 2 - 40);
      } else {

      if (!g.dead) {
        // Update physics
        g.velocity += g.gravity;
        g.robotY += g.velocity;
        g.rotation = Math.min(g.rotation + 1.5, 70);
        g.frame++;

        // Difficulty scaling - gentler curve
        if (g.score > 0 && g.score % 7 === 0) {
          g.gapSize = Math.max(115, 160 - g.score * 1.2);
          g.pipeSpeed = Math.min(3.8, 2.2 + g.score * 0.04);
          g.pipeInterval = Math.max(90, 130 - g.score * 1.5);
        }

        // Pipe generation
        g.pipeTimer++;
        if (g.pipeTimer >= g.pipeInterval) {
          g.pipeTimer = 0;
          const minGapY = 80;
          const maxGapY = groundY - 80;
          const gapY = minGapY + Math.random() * (maxGapY - minGapY);
          const isGrace = g.gracePipes > 0;
          if (isGrace) g.gracePipes--;
          g.pipes.push({ x: w + 10, gapY, scored: false, grace: isGrace });
        }

        // Update pipes
        g.pipes.forEach(p => { p.x -= g.pipeSpeed; });
        g.pipes = g.pipes.filter(p => p.x > -60);

        // Scoring
        g.pipes.forEach(p => {
          if (!p.scored && p.x + 52 < g.robotX) {
            p.scored = true;
            g.score++;
            setScore(g.score);
            if (!muted) sound.score();
            g.scorePopups.push({ x: g.robotX, y: g.robotY - 30, text: '+1', life: 40 });
            // Particle burst
            for (let i = 0; i < 6; i++) {
              g.particles.push({
                x: g.robotX, y: g.robotY,
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                life: 25, color: ['#22D3EE', '#A78BFA', '#FBBF24'][i % 3],
              });
            }
          }
        });

        // Collision detection
        const rSize = 14;
        const pipeW = 52;
        // Ground / ceiling
        if (g.robotY + rSize > groundY || g.robotY - rSize < 0) {
          g.dead = true;
        }
        // Pipes (skip grace period pipes)
        g.pipes.forEach(p => {
          const effectiveGap = p.grace ? g.gapSize + 40 : g.gapSize;
          const topH = p.gapY - effectiveGap / 2;
          const botY = p.gapY + effectiveGap / 2;
          if (g.robotX + rSize > p.x && g.robotX - rSize < p.x + pipeW) {
            if (g.robotY - rSize < topH || g.robotY + rSize > botY) {
              g.dead = true;
            }
          }
        });

        if (g.dead) {
          if (!muted) sound.hit();
          g.flashTimer = 10;
          setPhase('dead');
          // Update best
          if (g.score > bestScore) {
            setBestScore(g.score);
            try { localStorage.setItem('flappy_robot_best', String(g.score)); } catch {}
          }
          // Death particles
          for (let i = 0; i < 15; i++) {
            g.particles.push({
              x: g.robotX, y: g.robotY,
              vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
              life: 40, color: ['#EF4444', '#F59E0B', '#ffffff'][i % 3],
            });
          }
        }
      }

      // Update particles
      g.particles = g.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        return p.life > 0;
      });

      // Update score popups
      g.scorePopups = g.scorePopups.filter(p => {
        p.y -= 1;
        p.life--;
        return p.life > 0;
      });

      // Flash on death
      if (g.flashTimer > 0) {
        g.flashTimer--;
        if (g.flashTimer % 2 === 0) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.fillRect(0, 0, w, h);
        }
      }

      // Draw pipes
      g.pipes.forEach(p => {
        drawPipe(ctx, p.x, p.gapY, g.gapSize, w, h, g.frame);
      });

      // Draw particles
      g.particles.forEach(p => {
        ctx.globalAlpha = p.life / 40;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw score popups
      g.scorePopups.forEach(p => {
        ctx.globalAlpha = p.life / 40;
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x + 30, p.y);
      });
      ctx.globalAlpha = 1;

      // Draw robot
      drawRobot(ctx, g.robotX, g.robotY, g.rotation, g.frame);

      // Score display
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px system-ui';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00000088';
      ctx.shadowBlur = 4;
      ctx.fillText(String(g.score), w / 2, 50);
      ctx.shadowBlur = 0;

      // Dead overlay
      if (g.dead && g.flashTimer <= 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('¡GAME OVER!', w / 2, h / 2 - 50);

        ctx.font = '16px system-ui';
        ctx.fillStyle = '#FBBF24';
        ctx.fillText(`Puntos: ${g.score}`, w / 2, h / 2 - 15);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '13px system-ui';
        ctx.fillText(`Mejor: ${Math.max(g.score, bestScore)}`, w / 2, h / 2 + 10);

        ctx.fillStyle = '#22D3EE';
        ctx.font = 'bold 14px system-ui';
        ctx.fillText('Toca para reintentar', w / 2, h / 2 + 45);
      }

      } // end else (game active)

      } catch (e) {
        // Prevent game loop from crashing permanently
        console.error('Game loop error:', e);
      }
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [drawRobot, drawPipe, bestScore, muted, sound]);

  // Handle tap
  const handleTap = useCallback(() => {
    if (phase === 'ready') {
      startGame();
      setTimeout(() => flap(), 50);
    } else if (phase === 'playing') {
      flap();
    } else if (phase === 'dead') {
      startGame();
      setTimeout(() => flap(), 50);
    }
  }, [phase, startGame, flap]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleTap]);

  return (
    <div className="h-screen galaxy-bg flex flex-col animate-fade-in relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 relative z-10 flex-shrink-0">
        <button onClick={onBack} className="text-white/60 hover:text-white text-sm font-black flex items-center active:scale-95 transition">
          <ArrowLeft size={18} className="mr-1" /> Volver
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 px-2.5 py-1 rounded-full">
            <Trophy size={13} className="text-amber-400" />
            <span className="text-xs font-black text-amber-300">{bestScore}</span>
          </div>
          <button onClick={() => setMuted(m => !m)}
            className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center active:scale-90 transition">
            {muted ? <VolumeX size={14} className="text-blue-400/50" /> : <Volume2 size={14} className="text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Game canvas */}
      <div ref={containerRef} className="flex-grow relative min-h-0" onClick={handleTap} onTouchStart={(e) => { e.preventDefault(); handleTap(); }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Ready overlay - big tap to start */}
        {phase === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="mb-4 animate-bounce">
              {robotConfig ? <RobotAvatar config={robotConfig} size={80} /> : <span className="text-6xl">🤖</span>}
            </div>
            <div className="bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
              <p className="text-white font-black text-lg mb-1">¡Toca para volar!</p>
              <p className="text-cyan-300/70 text-xs">Esquiva los circuitos y suma puntos</p>
            </div>
            <div className="mt-4 w-14 h-14 rounded-full bg-cyan-500/30 border-2 border-cyan-400/60 flex items-center justify-center animate-pulse">
              <Play size={24} className="text-cyan-400 ml-1" />
            </div>
          </div>
        )}

        {/* Hidden avatar renderer for canvas capture */}
        {robotConfig && (
          <div ref={avatarRenderRef} style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none', width: 120, height: 120 }}>
            <RobotAvatar config={robotConfig} size={120} />
          </div>
        )}
      </div>

      {/* Bottom score */}
      <div className="px-4 py-2 flex justify-center relative z-10 flex-shrink-0">
        <div className="bg-[#1a1a3e]/80 border border-blue-500/20 rounded-full px-4 py-1.5 flex items-center gap-2">
          <Zap size={13} className="text-cyan-400" />
          <span className="text-xs font-black text-white">Puntos: {score}</span>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// MAIN WRAPPER COMPONENT
// ================================================================
export default function FlappyRobotChallenge({ onBack, onGameActive }) {
  const [gamePhase, setGamePhase] = useState('blocks'); // blocks | game
  const sound = useAudio();

  // Notify parent that game is active on mount
  useEffect(() => {
    onGameActive?.(true);
    return () => onGameActive?.(false);
  }, []);

  // Load robot config once for both phases
  const [robotConfig, setRobotConfig] = useState(null);
  useEffect(() => {
    try {
      const profileStr = localStorage.getItem('cultivatec_profile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setRobotConfig(profile?.robotConfig || null);
      }
    } catch {}
  }, []);

  if (gamePhase === 'blocks') {
    return (
      <div className="h-screen flex flex-col">
        {/* Back button overlay */}
        <div className="absolute top-4 left-4 z-50">
          <button onClick={onBack} className="text-white/60 hover:text-white text-sm font-black flex items-center active:scale-95 transition bg-[#0f0f2e]/80 rounded-lg px-2 py-1.5 backdrop-blur-sm border border-blue-500/20">
            <ArrowLeft size={16} className="mr-1" /> Volver
          </button>
        </div>
        <BlockProgramming onComplete={() => setGamePhase('game')} sound={sound} robotConfig={robotConfig} />
      </div>
    );
  }

  return <FlappyRobotGame onBack={() => setGamePhase('blocks')} sound={sound} robotConfig={robotConfig} />;
}
