import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { ArrowLeft, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';

// ================================================================
// AXON MERGE — "El Desafío del Robot"
// Suika-style merge game with electronics components + Matter.js
// ================================================================

// ---- Merge Tree (10 levels) ----
const COMPONENTS = [
  { level: 0, name: 'Resistor',           emoji: '🟫', radius: 14, color: '#A16207', glow: '#FDE68A', desc: '¡Limito el paso de corriente!' },
  { level: 1, name: 'LED',                emoji: '💡', radius: 17, color: '#EF4444', glow: '#FCA5A5', desc: '¡Convierto energía en luz!' },
  { level: 2, name: 'Capacitor',          emoji: '🔵', radius: 20, color: '#3B82F6', glow: '#93C5FD', desc: '¡Almaceno energía como una mini batería!' },
  { level: 3, name: 'Transistor',         emoji: '🔺', radius: 24, color: '#8B5CF6', glow: '#C4B5FD', desc: '¡Soy el interruptor electrónico!' },
  { level: 4, name: 'ESP32-S3',           emoji: '🧠', radius: 28, color: '#059669', glow: '#6EE7B7', desc: '¡Soy el cerebro con WiFi y Bluetooth!' },
  { level: 5, name: 'Sensor Ultrasónico', emoji: '👁️', radius: 32, color: '#0891B2', glow: '#67E8F9', desc: '¡Mido distancia como un murciélago!' },
  { level: 6, name: 'Motor DC',           emoji: '⚙️', radius: 36, color: '#6B7280', glow: '#D1D5DB', desc: '¡Convierto electricidad en movimiento!' },
  { level: 7, name: 'Batería LiPo',       emoji: '🔋', radius: 40, color: '#F59E0B', glow: '#FDE68A', desc: '¡Soy la fuente de energía recargable!' },
  { level: 8, name: 'Chasis',             emoji: '📦', radius: 45, color: '#374151', glow: '#9CA3AF', desc: '¡Soy el esqueleto del robot!' },
  { level: 9, name: 'CultivaTec Rover',   emoji: '🤖', radius: 50, color: '#2563EB', glow: '#60A5FA', desc: '¡Robot completo! ¡Eres un genio!' },
];

// Max level a freshly spawned piece can be (0..3 for variety)
const MAX_SPAWN_LEVEL = 3;

// Points per merge
const MERGE_POINTS = [10, 25, 50, 100, 200, 400, 800, 1500, 3000, 10000];

// ---- Drawing helpers ----
const drawGlassCircle = (ctx, x, y, r, baseColor, glowColor, emoji, level) => {
  ctx.save();

  // Outer glow
  const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 1.4);
  grad.addColorStop(0, glowColor + '60');
  grad.addColorStop(1, glowColor + '00');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Main body — glass effect
  const bodyGrad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
  bodyGrad.addColorStop(0, glowColor + 'CC');
  bodyGrad.addColorStop(0.5, baseColor + 'DD');
  bodyGrad.addColorStop(1, baseColor + 'AA');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Highlight arc (top-left shine)
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = r * 0.15;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.7, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  // Border
  ctx.strokeStyle = baseColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  // Emoji
  const emojiSize = Math.max(r * 0.9, 12);
  ctx.font = `${emojiSize}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x, y);

  // Level badge
  if (level > 0) {
    const bx = x + r * 0.6;
    const by = y - r * 0.6;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(level + 1, bx, by + 1);
  }

  ctx.restore();
};

// ---- Toast component ----
function Toast({ text, emoji, color, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="animate-bounce-in pointer-events-none" style={{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      bottom: 80, zIndex: 50,
      background: `linear-gradient(135deg, ${color}22, ${color}44)`,
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      border: `2px solid ${color}88`,
      borderRadius: 16, padding: '10px 18px',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: `0 8px 32px ${color}33`,
      animation: 'toastIn 0.4s ease-out, toastOut 0.4s ease-in 1.8s forwards',
    }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: color }}>{text}</span>
    </div>
  );
}

// ---- Main game component ----
export default function AxonMerge({ onBack }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const nextLevelRef = useRef(0);
  const bodiesMapRef = useRef(new Map()); // body.id → level
  const mergeCooldownRef = useRef(new Set());
  const previewXRef = useRef(0);
  const canDropRef = useRef(true);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const frameRef = useRef(null);
  const toastsRef = useRef([]);
  const particlesRef = useRef([]);
  const dangerTimerRef = useRef(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [nextLevel, setNextLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [roverAchieved, setRoverAchieved] = useState(false);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('axon_merge_highscore');
      if (saved) { highScoreRef.current = Number(saved); setHighScore(Number(saved)); }
    } catch {}
  }, []);

  // ---- Audio (simple beeps via Web Audio) ----
  const audioCtxRef = useRef(null);
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((freq, duration = 0.12, type = 'sine', vol = 0.15) => {
    if (!soundOn) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [soundOn, getAudioCtx]);

  const playMergeSound = useCallback((level) => {
    const baseFreq = 300 + level * 80;
    playSound(baseFreq, 0.15, 'sine', 0.12);
    setTimeout(() => playSound(baseFreq * 1.5, 0.2, 'triangle', 0.1), 80);
  }, [playSound]);

  const playDropSound = useCallback(() => {
    playSound(220, 0.08, 'sine', 0.08);
  }, [playSound]);

  const playGameOverSound = useCallback(() => {
    playSound(200, 0.3, 'sawtooth', 0.1);
    setTimeout(() => playSound(150, 0.4, 'sawtooth', 0.08), 200);
  }, [playSound]);

  // ---- Spawn particle burst ----
  const spawnParticles = useCallback((x, y, color, count = 8) => {
    const newP = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 3;
      newP.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newP];
  }, []);

  // ---- Show toast ----
  const addToast = useCallback((comp) => {
    const id = Date.now() + Math.random();
    const t = { id, text: `${comp.name}: ${comp.desc}`, emoji: comp.emoji, color: comp.color };
    toastsRef.current = [t];
    setToasts([t]);
  }, []);

  const removeToast = useCallback((id) => {
    toastsRef.current = toastsRef.current.filter(t => t.id !== id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ---- GAME DIMENSIONS ----
  const getGameDims = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: 360, h: 560 };
    const w = Math.min(el.clientWidth, 420);
    const h = Math.min(window.innerHeight - 200, 620);
    return { w, h: Math.max(h, 440) };
  }, []);

  // ---- CREATE A COMPONENT BODY ----
  const createComponentBody = useCallback((x, y, level, isStatic = false) => {
    const comp = COMPONENTS[level];
    const body = Matter.Bodies.circle(x, y, comp.radius, {
      restitution: 0.3,
      friction: 0.5,
      density: 0.002 + level * 0.001,
      isStatic,
      label: `comp_${level}`,
      collisionFilter: { group: 0, category: 0x0001, mask: 0x0001 },
    });
    bodiesMapRef.current.set(body.id, level);
    return body;
  }, []);

  // ---- INIT GAME ----
  const initGame = useCallback(() => {
    const { w, h } = getGameDims();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cleanup old engine
    if (engineRef.current) {
      Matter.Events.off(engineRef.current);
      Matter.Engine.clear(engineRef.current);
    }
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    canvas.width = w;
    canvas.height = h;

    // Engine
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.2 } });
    engineRef.current = engine;

    // Walls
    const wallOpts = { isStatic: true, friction: 0.3, restitution: 0.2, label: 'wall' };
    const thickness = 20;
    const floor = Matter.Bodies.rectangle(w / 2, h + thickness / 2, w + 40, thickness, wallOpts);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 2, wallOpts);
    const rightWall = Matter.Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 2, wallOpts);
    Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);

    // Danger line (game over if bodies stay above this for too long)
    const DANGER_Y = 70;

    // Reset state
    bodiesMapRef.current.clear();
    mergeCooldownRef.current.clear();
    canDropRef.current = true;
    gameOverRef.current = false;
    scoreRef.current = 0;
    particlesRef.current = [];
    toastsRef.current = [];
    previewXRef.current = w / 2;

    setScore(0);
    setGameOver(false);
    setRoverAchieved(false);
    setToasts([]);

    const pickNextLevel = () => {
      const lv = Math.floor(Math.random() * (MAX_SPAWN_LEVEL + 1));
      nextLevelRef.current = lv;
      setNextLevel(lv);
    };
    pickNextLevel();

    // ---- Collision handler (MERGE) ----
    Matter.Events.on(engine, 'collisionStart', (event) => {
      if (gameOverRef.current) return;
      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;
        const levelA = bodiesMapRef.current.get(bodyA.id);
        const levelB = bodiesMapRef.current.get(bodyB.id);

        if (levelA === undefined || levelB === undefined) continue;
        if (levelA !== levelB) continue;
        if (levelA >= COMPONENTS.length - 1) continue; // max level

        const key = [bodyA.id, bodyB.id].sort().join('_');
        if (mergeCooldownRef.current.has(key)) continue;
        mergeCooldownRef.current.add(key);

        // Remove both
        Matter.Composite.remove(engine.world, bodyA);
        Matter.Composite.remove(engine.world, bodyB);
        bodiesMapRef.current.delete(bodyA.id);
        bodiesMapRef.current.delete(bodyB.id);

        // Create merged
        const newLevel = levelA + 1;
        const mx = (bodyA.position.x + bodyB.position.x) / 2;
        const my = (bodyA.position.y + bodyB.position.y) / 2;
        const newBody = createComponentBody(mx, my, newLevel);
        Matter.Composite.add(engine.world, newBody);

        // Score
        const pts = MERGE_POINTS[newLevel] || 50;
        scoreRef.current += pts;
        setScore(scoreRef.current);

        // Save high score
        if (scoreRef.current > highScoreRef.current) {
          highScoreRef.current = scoreRef.current;
          setHighScore(scoreRef.current);
          try { localStorage.setItem('axon_merge_highscore', String(scoreRef.current)); } catch {}
        }

        // Effects
        const comp = COMPONENTS[newLevel];
        spawnParticles(mx, my, comp.glow, 10 + newLevel * 2);
        addToast(comp);
        playMergeSound(newLevel);

        // Rover achieved!
        if (newLevel === COMPONENTS.length - 1) {
          setRoverAchieved(true);
        }

        setTimeout(() => mergeCooldownRef.current.delete(key), 200);
      }
    });

    // ---- Runner ----
    const runner = Matter.Runner.create({ delta: 1000 / 60 });
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // ---- Render loop ----
    const ctx = canvas.getContext('2d');
    let dangerFrameCount = 0;

    const render = () => {
      if (!ctx || !engine) return;
      ctx.clearRect(0, 0, w, h);

      // Background gradient (Frutiger Aero)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#E0F2FE');
      bgGrad.addColorStop(0.4, '#F0F9FF');
      bgGrad.addColorStop(1, '#FFF7ED');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle bubble pattern
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 6; i++) {
        const bx = (w * (i + 0.5)) / 6;
        const by = h * 0.3 + Math.sin(Date.now() / 2000 + i) * 30;
        const br = 30 + i * 10;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Danger zone
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = gameOverRef.current ? '#EF444488' : '#EF444444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, DANGER_Y);
      ctx.lineTo(w, DANGER_Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#EF444418';
      ctx.fillRect(0, 0, w, DANGER_Y);
      ctx.restore();

      // Walls
      ctx.fillStyle = '#CBD5E133';
      ctx.fillRect(0, h - 2, w, 4); // floor hint

      // Side walls glass
      const lwGrad = ctx.createLinearGradient(0, 0, 6, 0);
      lwGrad.addColorStop(0, '#3B82F644');
      lwGrad.addColorStop(1, '#3B82F600');
      ctx.fillStyle = lwGrad;
      ctx.fillRect(0, 0, 6, h);

      const rwGrad = ctx.createLinearGradient(w, 0, w - 6, 0);
      rwGrad.addColorStop(0, '#3B82F644');
      rwGrad.addColorStop(1, '#3B82F600');
      ctx.fillStyle = rwGrad;
      ctx.fillRect(w - 6, 0, 6, h);

      // Draw bodies
      const allBodies = Matter.Composite.allBodies(engine.world);
      let anyAboveDanger = false;

      for (const body of allBodies) {
        const level = bodiesMapRef.current.get(body.id);
        if (level === undefined) continue;
        const comp = COMPONENTS[level];
        drawGlassCircle(ctx, body.position.x, body.position.y, comp.radius, comp.color, comp.glow, comp.emoji, level);

        // Check danger
        if (!body.isStatic && body.position.y - comp.radius < DANGER_Y && body.speed < 0.5) {
          anyAboveDanger = true;
        }
      }

      // Danger timer
      if (anyAboveDanger && !gameOverRef.current) {
        dangerFrameCount++;
        if (dangerFrameCount > 120) { // ~2 seconds at 60fps
          gameOverRef.current = true;
          setGameOver(true);
          playGameOverSound();
          if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
        }
      } else {
        dangerFrameCount = Math.max(0, dangerFrameCount - 2);
      }

      // Draw preview (next piece position indicator)
      if (!gameOverRef.current && canDropRef.current) {
        const previewComp = COMPONENTS[nextLevelRef.current];
        ctx.save();
        ctx.globalAlpha = 0.4;
        drawGlassCircle(ctx, previewXRef.current, 36, previewComp.radius, previewComp.color, previewComp.glow, previewComp.emoji, nextLevelRef.current);
        ctx.globalAlpha = 0.2;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = previewComp.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(previewXRef.current, 36 + previewComp.radius);
        ctx.lineTo(previewXRef.current, h);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Draw particles
      const now = particlesRef.current;
      for (let i = now.length - 1; i >= 0; i--) {
        const p = now[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.025;
        if (p.life <= 0) { now.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      Matter.Events.off(engine);
      Matter.Engine.clear(engine);
    };
  }, [getGameDims, createComponentBody, spawnParticles, addToast, playMergeSound, playGameOverSound]);

  // ---- DROP ----
  const dropComponent = useCallback((clientX) => {
    if (gameOverRef.current || !canDropRef.current || !engineRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(30, Math.min(canvas.width - 30, clientX - rect.left));
    const level = nextLevelRef.current;
    const comp = COMPONENTS[level];

    const body = createComponentBody(x, comp.radius + 10, level);
    Matter.Composite.add(engineRef.current.world, body);
    playDropSound();

    // Cooldown
    canDropRef.current = false;
    setTimeout(() => { canDropRef.current = true; }, 450);

    // Pick next
    const lv = Math.floor(Math.random() * (MAX_SPAWN_LEVEL + 1));
    nextLevelRef.current = lv;
    setNextLevel(lv);
  }, [createComponentBody, playDropSound]);

  // ---- Pointer events ----
  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    previewXRef.current = Math.max(30, Math.min(canvas.width - 30, clientX - rect.left));
  }, []);

  const handlePointerUp = useCallback((e) => {
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    dropComponent(clientX);
  }, [dropComponent]);

  // ---- Init on mount ----
  useEffect(() => {
    const cleanup = initGame();
    return () => { if (cleanup) cleanup(); };
  }, [initGame]);

  // ---- Restart ----
  const restart = useCallback(() => {
    setShowGuide(false);
    initGame();
  }, [initGame]);

  // ---- Guide screen ----
  if (showGuide) {
    return (
      <div className="min-h-full bg-gradient-to-b from-sky-100 via-blue-50 to-orange-50 animate-fade-in flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 50%, #7C3AED 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white" style={{
                width: 60 + i * 30, height: 60 + i * 30,
                left: `${10 + i * 15}%`, top: `${20 + Math.sin(i) * 30}%`,
                opacity: 0.15 + i * 0.03,
              }} />
            ))}
          </div>
          <div className="px-6 pt-6 pb-8 relative z-10">
            <button onClick={onBack} className="text-white/80 hover:text-white mb-4 flex items-center text-sm font-black active:scale-95 transition">
              <ArrowLeft size={18} className="mr-1" /> Volver
            </button>
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">🧩</div>
              <h1 className="text-2xl font-black text-white drop-shadow-lg">Axon Merge</h1>
              <p className="text-white/90 text-sm font-bold mt-1">El Desafío del Robot</p>
            </div>
          </div>
        </div>

        <div className="flex-grow px-5 py-6 space-y-4 pb-24 overflow-y-auto">
          {/* How to play */}
          <div className="rounded-2xl p-5 border-2 border-sky-200" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(224,242,254,0.6))',
            backdropFilter: 'blur(12px)',
          }}>
            <h3 className="text-base font-black text-sky-700 mb-3 flex items-center gap-2">📋 ¿Cómo se juega?</h3>
            <div className="space-y-2.5 text-sm font-semibold text-gray-600">
              <p>👆 <b className="text-gray-800">Toca</b> la pantalla para soltar un componente electrónico.</p>
              <p>🔄 Cuando <b className="text-gray-800">dos iguales</b> se tocan, ¡se fusionan en uno mejor!</p>
              <p>⚠️ Si los componentes <b className="text-gray-800">llegan arriba</b>, pierdes.</p>
              <p>🏆 Meta: ¡Crea el <b className="text-sky-600">CultivaTec Rover</b> 🤖!</p>
            </div>
          </div>

          {/* Merge tree */}
          <div className="rounded-2xl p-5 border-2 border-purple-200" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(243,232,255,0.6))',
            backdropFilter: 'blur(12px)',
          }}>
            <h3 className="text-base font-black text-purple-700 mb-3 flex items-center gap-2">🔗 Cadena de Fusión</h3>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {COMPONENTS.map((c, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center" style={{ minWidth: 50 }}>
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="text-[10px] font-bold text-gray-500 mt-0.5 text-center leading-tight">{c.name}</span>
                  </div>
                  {i < COMPONENTS.length - 1 && <span className="text-gray-300 font-black text-xs">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button onClick={restart}
            className="w-full py-4 rounded-2xl text-lg font-black text-white shadow-lg active:scale-[0.97] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
              boxShadow: '0 6px 0 #1D4ED8, 0 8px 24px rgba(37,99,235,0.3)',
            }}>
            🚀 ¡Jugar!
          </button>
        </div>
      </div>
    );
  }

  const nextComp = COMPONENTS[nextLevel];

  // ---- Game screen ----
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-100 via-blue-50 to-orange-50 animate-fade-in flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-sky-100" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(224,242,254,0.7))',
        backdropFilter: 'blur(12px)',
      }}>
        <button onClick={onBack} className="text-sky-600 hover:text-sky-800 active:scale-95 transition">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-[10px] font-black text-sky-400 uppercase">Puntos</p>
            <p className="text-lg font-black text-sky-700">{score.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-sky-200" />
          <div className="text-center">
            <p className="text-[10px] font-black text-amber-400 uppercase flex items-center gap-0.5"><Trophy size={10} /> Récord</p>
            <p className="text-sm font-black text-amber-600">{highScore.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSoundOn(s => !s)} className="w-9 h-9 rounded-xl bg-white/80 border border-sky-200 flex items-center justify-center text-sky-500 active:scale-90 transition">
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button onClick={restart} className="w-9 h-9 rounded-xl bg-white/80 border border-sky-200 flex items-center justify-center text-sky-500 active:scale-90 transition">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Next piece indicator */}
      <div className="flex items-center justify-center gap-2 py-2" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,249,255,0.5))',
      }}>
        <span className="text-xs font-black text-gray-400">SIGUIENTE:</span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200" style={{
          background: `linear-gradient(135deg, ${nextComp.glow}33, ${nextComp.color}11)`,
        }}>
          <span className="text-lg">{nextComp.emoji}</span>
          <span className="text-xs font-black" style={{ color: nextComp.color }}>{nextComp.name}</span>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="flex-grow flex justify-center px-2 pb-2 relative">
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-xl border-2 border-white/60 touch-none"
          style={{
            maxWidth: '100%',
            background: 'linear-gradient(180deg, #E0F2FE, #FFF7ED)',
            boxShadow: '0 8px 32px rgba(14,165,233,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />

        {/* Toasts */}
        {toasts.map(t => (
          <Toast key={t.id} text={t.text} emoji={t.emoji} color={t.color} onDone={() => removeToast(t.id)} />
        ))}

        {/* Game Over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-40 animate-fade-in">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl" />
            <div className="relative z-10 mx-6 p-6 rounded-3xl border-2 border-white/40 text-center max-w-xs w-full" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(224,242,254,0.85))',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
            }}>
              <div className="text-5xl mb-3">{roverAchieved ? '🤖' : '💥'}</div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">
                {roverAchieved ? '¡Increíble!' : '¡Fin del Juego!'}
              </h2>
              <p className="text-sm text-gray-500 font-semibold mb-4">
                {roverAchieved ? '¡Creaste el CultivaTec Rover!' : 'Los componentes llegaron al tope'}
              </p>

              <div className="flex justify-center gap-4 mb-5">
                <div className="text-center">
                  <p className="text-2xl font-black text-sky-600">{score.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Puntos</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-black text-amber-500">{highScore.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-0.5 justify-center"><Trophy size={10} /> Récord</p>
                </div>
              </div>

              <button onClick={restart}
                className="w-full py-3.5 rounded-xl text-base font-black text-white active:scale-[0.97] transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                  boxShadow: '0 4px 0 #1D4ED8',
                }}>
                🔄 Jugar de Nuevo
              </button>
              <button onClick={onBack}
                className="w-full py-3 rounded-xl text-sm font-black text-gray-500 mt-2 active:scale-[0.97] transition-transform bg-gray-100">
                ← Volver al Taller
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast animation keyframes */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          to { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
