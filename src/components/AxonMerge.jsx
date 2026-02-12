import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { ArrowLeft, RotateCcw, Trophy, Volume2, VolumeX, Zap, Sparkles } from 'lucide-react';

// ================================================================
// AXON MERGE — "El Desafío del Robot"  v2.0
// Suika-style merge game · Matter.js physics · Neon Cyber aesthetic
// ================================================================

// ---- Merge Tree (10 levels) — BIGGER radii for better gameplay ----
const COMPONENTS = [
  { level: 0, name: 'Resistor',           emoji: '🟫', radius: 20, color: '#D97706', glow: '#FDE68A', accent: '#92400E', desc: '¡Limito el paso de corriente!' },
  { level: 1, name: 'LED',                emoji: '💡', radius: 24, color: '#EF4444', glow: '#FCA5A5', accent: '#991B1B', desc: '¡Convierto energía en luz!' },
  { level: 2, name: 'Capacitor',          emoji: '🔵', radius: 28, color: '#3B82F6', glow: '#93C5FD', accent: '#1E40AF', desc: '¡Almaceno energía como una mini batería!' },
  { level: 3, name: 'Transistor',         emoji: '🔺', radius: 33, color: '#8B5CF6', glow: '#C4B5FD', accent: '#5B21B6', desc: '¡Soy el interruptor electrónico!' },
  { level: 4, name: 'ESP32-S3',           emoji: '🧠', radius: 38, color: '#10B981', glow: '#6EE7B7', accent: '#065F46', desc: '¡Soy el cerebro con WiFi y Bluetooth!' },
  { level: 5, name: 'Sensor Ultrasónico', emoji: '👁️', radius: 43, color: '#06B6D4', glow: '#67E8F9', accent: '#155E75', desc: '¡Mido distancia como un murciélago!' },
  { level: 6, name: 'Motor DC',           emoji: '⚙️', radius: 48, color: '#6366F1', glow: '#A5B4FC', accent: '#3730A3', desc: '¡Convierto electricidad en movimiento!' },
  { level: 7, name: 'Batería LiPo',       emoji: '🔋', radius: 54, color: '#F59E0B', glow: '#FDE68A', accent: '#92400E', desc: '¡Soy la fuente de energía recargable!' },
  { level: 8, name: 'Chasis',             emoji: '📦', radius: 60, color: '#64748B', glow: '#CBD5E1', accent: '#1E293B', desc: '¡Soy el esqueleto del robot!' },
  { level: 9, name: 'CultivaTec Rover',   emoji: '🤖', radius: 66, color: '#2563EB', glow: '#60A5FA', accent: '#1E3A8A', desc: '¡Robot completo! ¡Eres un genio!' },
];

const MAX_SPAWN_LEVEL = 3;
const MERGE_POINTS = [10, 25, 50, 100, 200, 400, 800, 1500, 3000, 10000];

// ---- Hex to RGB helper ----
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

// ---- Enhanced component drawing with 3D depth + neon glow ----
const drawComponent = (ctx, x, y, r, comp, time) => {
  ctx.save();
  const { color, glow, accent } = comp;
  const pulse = Math.sin(time / 400 + comp.level) * 0.08 + 1;

  // Neon outer glow (animated pulse)
  const glowRgb = hexToRgb(glow);
  for (let i = 3; i >= 1; i--) {
    const gr = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * (1.2 + i * 0.25) * pulse);
    gr.addColorStop(0, `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${0.12 / i})`);
    gr.addColorStop(1, `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},0)`);
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(x, y, r * (1.2 + i * 0.25) * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shadow (3D depth)
  const shGrad = ctx.createRadialGradient(x + r * 0.1, y + r * 0.15, r * 0.3, x + r * 0.1, y + r * 0.15, r * 1.1);
  shGrad.addColorStop(0, 'rgba(0,0,0,0.15)');
  shGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shGrad;
  ctx.beginPath();
  ctx.arc(x + r * 0.1, y + r * 0.15, r * 1.1, 0, Math.PI * 2);
  ctx.fill();

  // Main body — rich gradient sphere
  const bodyGrad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y + r * 0.1, r);
  bodyGrad.addColorStop(0, glow + 'EE');
  bodyGrad.addColorStop(0.35, color + 'FF');
  bodyGrad.addColorStop(0.7, accent + 'EE');
  bodyGrad.addColorStop(1, accent + 'CC');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Glass rim (outer ring)
  ctx.strokeStyle = glow + '88';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, r - 1, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring accent
  ctx.strokeStyle = color + '44';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  // Top highlight (specular shine — crescent)
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.15, y - r * 0.35, r * 0.55, r * 0.3, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Small specular dot
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.arc(x - r * 0.25, y - r * 0.45, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Bottom reflection
  const btmGrad = ctx.createLinearGradient(x, y + r * 0.3, x, y + r);
  btmGrad.addColorStop(0, 'rgba(255,255,255,0)');
  btmGrad.addColorStop(1, 'rgba(255,255,255,0.1)');
  ctx.fillStyle = btmGrad;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.95, 0.1, Math.PI - 0.1);
  ctx.fill();

  // Emoji — larger, centered
  const emojiSize = Math.max(r * 0.85, 14);
  ctx.font = `${emojiSize}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(comp.emoji, x, y + 1);

  // Level badge (neon style)
  if (comp.level > 0) {
    const bx = x + r * 0.58;
    const by = y - r * 0.58;
    const bSize = Math.max(9, r * 0.18);
    // Badge glow
    ctx.shadowColor = glow;
    ctx.shadowBlur = 8;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(bx, by, bSize + 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = `bold ${Math.max(8, bSize * 0.9)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(comp.level + 1, bx, by + 0.5);
  }

  ctx.restore();
};

// ---- Draw circuit trace pattern in background ----
const drawCircuitTraces = (ctx, w, h, time) => {
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 12]);
  const offset = (time / 50) % 20;
  ctx.lineDashOffset = -offset;

  // Horizontal traces
  for (let i = 0; i < 5; i++) {
    const y = h * 0.15 + (h * 0.7 * i) / 4;
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(w * 0.3, y);
    ctx.lineTo(w * 0.35, y - 15);
    ctx.lineTo(w * 0.65, y - 15);
    ctx.lineTo(w * 0.7, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();
  }

  // Vertical traces
  for (let i = 0; i < 3; i++) {
    const x = w * 0.25 + (w * 0.5 * i) / 2;
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.lineTo(x, h * 0.4);
    ctx.lineTo(x + 10, h * 0.45);
    ctx.lineTo(x + 10, h - 10);
    ctx.stroke();
  }

  // Junction dots
  ctx.setLineDash([]);
  ctx.fillStyle = '#3B82F6';
  for (let i = 0; i < 8; i++) {
    const px = 30 + Math.sin(i * 1.7) * (w * 0.35) + w * 0.5;
    const py = 30 + Math.cos(i * 2.3) * (h * 0.3) + h * 0.4;
    ctx.globalAlpha = 0.05 + Math.sin(time / 600 + i) * 0.02;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
};

// ---- Draw LED wall strips ----
const drawWallStrips = (ctx, w, h, time) => {
  ctx.save();
  const wallW = 5;

  // Left wall
  let lwGrad = ctx.createLinearGradient(0, 0, wallW, 0);
  lwGrad.addColorStop(0, 'rgba(99,102,241,0.4)');
  lwGrad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = lwGrad;
  ctx.fillRect(0, 0, wallW, h);

  // Right wall
  let rwGrad = ctx.createLinearGradient(w, 0, w - wallW, 0);
  rwGrad.addColorStop(0, 'rgba(99,102,241,0.4)');
  rwGrad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.fillStyle = rwGrad;
  ctx.fillRect(w - wallW, 0, wallW, h);

  // Animated LED dots on walls
  ctx.globalAlpha = 0.6;
  const dotCount = 12;
  for (let i = 0; i < dotCount; i++) {
    const py = (h * (i + 0.5)) / dotCount;
    const brightness = Math.sin(time / 300 + i * 0.8) * 0.5 + 0.5;
    const hue = (i * 30 + time / 20) % 360;
    ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${brightness * 0.7})`;
    ctx.beginPath();
    ctx.arc(2, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - 2, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floor — circuit board strip
  const floorGrad = ctx.createLinearGradient(0, h - 6, 0, h);
  floorGrad.addColorStop(0, 'rgba(99,102,241,0)');
  floorGrad.addColorStop(1, 'rgba(99,102,241,0.35)');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, h - 6, w, 6);

  ctx.globalAlpha = 1;
  ctx.restore();
};

// ---- Toast component (enhanced) ----
function Toast({ text, emoji, color, level, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  const rgb = hexToRgb(color);

  return (
    <div className="pointer-events-none" style={{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      bottom: 90, zIndex: 50,
      background: `linear-gradient(135deg, rgba(${rgb.r},${rgb.g},${rgb.b},0.15), rgba(${rgb.r},${rgb.g},${rgb.b},0.3))`,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: `2px solid rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`,
      borderRadius: 20, padding: '12px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `0 0 20px rgba(${rgb.r},${rgb.g},${rgb.b},0.3), 0 8px 32px rgba(0,0,0,0.1)`,
      animation: 'toastSlideUp 0.5s cubic-bezier(0.34,1.56,0.64,1), toastOut 0.4s ease-in 2s forwards',
      maxWidth: '92%',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `linear-gradient(135deg, ${color}44, ${color}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
        boxShadow: `0 0 12px ${color}33`,
      }}>{emoji}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: color, letterSpacing: 0.5 }}>
          NIVEL {level + 1} — {text.split(':')[0]}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginTop: 2 }}>
          {text.split(':')[1]?.trim()}
        </div>
      </div>
    </div>
  );
}

// ---- Combo indicator ----
function ComboIndicator({ combo }) {
  if (combo < 2) return null;
  return (
    <div className="pointer-events-none" style={{
      position: 'absolute', right: 12, top: 12, zIndex: 45,
      animation: 'comboPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{
        background: combo >= 5 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' :
                    combo >= 3 ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' :
                                 'linear-gradient(135deg, #3B82F6, #06B6D4)',
        borderRadius: 16, padding: '6px 14px',
        boxShadow: `0 0 20px ${combo >= 5 ? '#F59E0B55' : combo >= 3 ? '#8B5CF655' : '#3B82F655'}`,
        border: '2px solid rgba(255,255,255,0.3)',
      }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
          {combo}x COMBO{combo >= 5 ? ' 🔥' : combo >= 3 ? ' ⚡' : ' ✨'}
        </span>
      </div>
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
  const bodiesMapRef = useRef(new Map());
  const mergeCooldownRef = useRef(new Set());
  const previewXRef = useRef(0);
  const canDropRef = useRef(true);
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const frameRef = useRef(null);
  const particlesRef = useRef([]);
  const shockwavesRef = useRef([]);
  const comboRef = useRef(0);
  const comboTimerRef = useRef(null);
  const mergeCountRef = useRef(0);
  const maxLevelReachedRef = useRef(0);
  const screenShakeRef = useRef({ x: 0, y: 0, intensity: 0 });

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [nextLevel, setNextLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [mergeCount, setMergeCount] = useState(0);
  const [maxLevelReached, setMaxLevelReached] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [roverAchieved, setRoverAchieved] = useState(false);
  const [gameReady, setGameReady] = useState(false); // triggers initGame after canvas mounts

  // Use ref for soundOn so audio callbacks stay stable (no dependency chain)
  const soundOnRef = useRef(true);
  useEffect(() => { soundOnRef.current = soundOn; }, [soundOn]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('axon_merge_highscore');
      if (saved) { highScoreRef.current = Number(saved); setHighScore(Number(saved)); }
    } catch {}
  }, []);

  // ---- Audio (stable — no state in deps, uses refs) ----
  const audioCtxRef = useRef(null);
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((freq, duration = 0.12, type = 'sine', vol = 0.15) => {
    if (!soundOnRef.current) return;
    try {
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [getAudioCtx]);

  const playMergeSound = useCallback((level, comboN) => {
    const baseFreq = 280 + level * 70;
    const comboBonus = comboN > 1 ? comboN * 30 : 0;
    playSound(baseFreq + comboBonus, 0.18, 'sine', 0.14);
    setTimeout(() => playSound((baseFreq + comboBonus) * 1.5, 0.22, 'triangle', 0.1), 60);
    if (comboN >= 3) setTimeout(() => playSound((baseFreq + comboBonus) * 2, 0.15, 'sine', 0.08), 120);
  }, [playSound]);

  const playDropSound = useCallback(() => { playSound(260, 0.06, 'sine', 0.06); }, [playSound]);
  const playGameOverSound = useCallback(() => {
    playSound(220, 0.3, 'sawtooth', 0.1);
    setTimeout(() => playSound(160, 0.4, 'sawtooth', 0.08), 180);
    setTimeout(() => playSound(110, 0.5, 'sawtooth', 0.06), 360);
  }, [playSound]);

  // ---- Collision / bounce sounds ----
  const lastBounceTimeRef = useRef(0);
  const playBounceSound = useCallback((speed, levelA, levelB) => {
    const now = Date.now();
    if (now - lastBounceTimeRef.current < 60) return; // throttle to avoid audio spam
    lastBounceTimeRef.current = now;
    const intensity = Math.min(speed / 8, 1);
    if (intensity < 0.15) return; // ignore very soft taps
    const avgLevel = ((levelA ?? 0) + (levelB ?? 0)) / 2;
    const freq = 120 + avgLevel * 20 + intensity * 80;
    const vol = 0.03 + intensity * 0.06;
    playSound(freq, 0.04 + intensity * 0.04, 'triangle', vol);
  }, [playSound]);

  const playWallBounceSound = useCallback((speed) => {
    const now = Date.now();
    if (now - lastBounceTimeRef.current < 50) return;
    lastBounceTimeRef.current = now;
    const intensity = Math.min(speed / 6, 1);
    if (intensity < 0.1) return;
    playSound(90 + intensity * 60, 0.03 + intensity * 0.03, 'sine', 0.02 + intensity * 0.04);
  }, [playSound]);

  // ---- Particles (stars + sparks) ----
  const spawnParticles = useCallback((x, y, color, count = 12, isStar = false) => {
    const newP = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = 2 + Math.random() * 4;
      newP.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        color,
        size: isStar ? 2 + Math.random() * 3 : 3 + Math.random() * 5,
        type: isStar ? 'star' : (Math.random() > 0.5 ? 'circle' : 'ring'),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    particlesRef.current.push(...newP);
  }, []);

  // ---- Shockwave on merge ----
  const spawnShockwave = useCallback((x, y, color) => {
    shockwavesRef.current.push({ x, y, color, radius: 0, maxRadius: 80, life: 1 });
  }, []);

  // ---- Toast ----
  const addToast = useCallback((comp) => {
    const id = Date.now() + Math.random();
    const t = { id, text: `${comp.name}: ${comp.desc}`, emoji: comp.emoji, color: comp.color, level: comp.level };
    setToasts([t]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ---- Combo system ----
  const triggerCombo = useCallback(() => {
    comboRef.current += 1;
    setCombo(comboRef.current);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => { comboRef.current = 0; setCombo(0); }, 1500);
  }, []);

  // ---- Screen shake ----
  const triggerShake = useCallback((intensity = 4) => {
    screenShakeRef.current.intensity = intensity;
  }, []);

  // ---- Game dimensions ----
  const getGameDims = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: 380, h: 600 };
    const w = Math.min(el.clientWidth, 440);
    const h = Math.min(window.innerHeight - 180, 660);
    return { w, h: Math.max(h, 480) };
  }, []);

  // ---- Create physics body ----
  const createComponentBody = useCallback((x, y, level) => {
    const comp = COMPONENTS[level];
    const body = Matter.Bodies.circle(x, y, comp.radius, {
      restitution: 0.25,
      friction: 0.6,
      frictionAir: 0.008,
      density: 0.0015 + level * 0.0008,
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

    if (engineRef.current) { Matter.Events.off(engineRef.current); Matter.Engine.clear(engineRef.current); }
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    canvas.width = w;
    canvas.height = h;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.3 } });
    engineRef.current = engine;

    // Walls (slightly inset so visual wall strips align)
    const wallOpts = { isStatic: true, friction: 0.4, restitution: 0.15, label: 'wall' };
    const thickness = 24;
    const floor = Matter.Bodies.rectangle(w / 2, h + thickness / 2, w + 40, thickness, wallOpts);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2 + 3, h / 2, thickness, h * 2, wallOpts);
    const rightWall = Matter.Bodies.rectangle(w + thickness / 2 - 3, h / 2, thickness, h * 2, wallOpts);
    Matter.Composite.add(engine.world, [floor, leftWall, rightWall]);

    const DANGER_Y = 80;

    bodiesMapRef.current.clear();
    mergeCooldownRef.current.clear();
    canDropRef.current = true;
    gameOverRef.current = false;
    scoreRef.current = 0;
    comboRef.current = 0;
    mergeCountRef.current = 0;
    maxLevelReachedRef.current = 0;
    particlesRef.current = [];
    shockwavesRef.current = [];
    previewXRef.current = w / 2;
    screenShakeRef.current = { x: 0, y: 0, intensity: 0 };

    setScore(0);
    setCombo(0);
    setMergeCount(0);
    setMaxLevelReached(0);
    setGameOver(false);
    setRoverAchieved(false);
    setToasts([]);

    const pickNextLevel = () => {
      const lv = Math.floor(Math.random() * (MAX_SPAWN_LEVEL + 1));
      nextLevelRef.current = lv;
      setNextLevel(lv);
    };
    pickNextLevel();

    // ---- COLLISION / MERGE + BOUNCE SOUNDS ----
    Matter.Events.on(engine, 'collisionStart', (event) => {
      if (gameOverRef.current) return;
      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;
        const levelA = bodiesMapRef.current.get(bodyA.id);
        const levelB = bodiesMapRef.current.get(bodyB.id);

        // Bounce sound: component hitting a wall
        if ((levelA !== undefined && levelB === undefined) || (levelB !== undefined && levelA === undefined)) {
          const compBody = levelA !== undefined ? bodyA : bodyB;
          const relSpeed = Math.sqrt(
            Math.pow(bodyA.velocity.x - bodyB.velocity.x, 2) +
            Math.pow(bodyA.velocity.y - bodyB.velocity.y, 2)
          );
          playWallBounceSound(relSpeed);
        }

        // Bounce sound: two different components colliding (not merging)
        if (levelA !== undefined && levelB !== undefined && levelA !== levelB) {
          const relSpeed = Math.sqrt(
            Math.pow(bodyA.velocity.x - bodyB.velocity.x, 2) +
            Math.pow(bodyA.velocity.y - bodyB.velocity.y, 2)
          );
          playBounceSound(relSpeed, levelA, levelB);
        }

        if (levelA === undefined || levelB === undefined) continue;
        if (levelA !== levelB) continue;
        if (levelA >= COMPONENTS.length - 1) continue;

        const key = [bodyA.id, bodyB.id].sort().join('_');
        if (mergeCooldownRef.current.has(key)) continue;
        mergeCooldownRef.current.add(key);

        Matter.Composite.remove(engine.world, bodyA);
        Matter.Composite.remove(engine.world, bodyB);
        bodiesMapRef.current.delete(bodyA.id);
        bodiesMapRef.current.delete(bodyB.id);

        const newLevel = levelA + 1;
        const mx = (bodyA.position.x + bodyB.position.x) / 2;
        const my = (bodyA.position.y + bodyB.position.y) / 2;
        const newBody = createComponentBody(mx, my, newLevel);
        Matter.Composite.add(engine.world, newBody);

        // Combo
        triggerCombo();
        const currentCombo = comboRef.current;

        // Score with combo multiplier
        const basePts = MERGE_POINTS[newLevel] || 50;
        const comboMult = currentCombo > 1 ? 1 + (currentCombo - 1) * 0.5 : 1;
        const pts = Math.round(basePts * comboMult);
        scoreRef.current += pts;
        setScore(scoreRef.current);

        // Merge count
        mergeCountRef.current += 1;
        setMergeCount(mergeCountRef.current);

        // Max level
        if (newLevel > maxLevelReachedRef.current) {
          maxLevelReachedRef.current = newLevel;
          setMaxLevelReached(newLevel);
        }

        if (scoreRef.current > highScoreRef.current) {
          highScoreRef.current = scoreRef.current;
          setHighScore(scoreRef.current);
          try { localStorage.setItem('axon_merge_highscore', String(scoreRef.current)); } catch {}
        }

        // Effects
        const comp = COMPONENTS[newLevel];
        spawnParticles(mx, my, comp.glow, 14 + newLevel * 3, false);
        spawnParticles(mx, my, '#fff', 6, true);
        spawnShockwave(mx, my, comp.glow);
        triggerShake(3 + newLevel * 0.5);
        addToast(comp);
        playMergeSound(newLevel, currentCombo);

        if (newLevel === COMPONENTS.length - 1) setRoverAchieved(true);

        setTimeout(() => mergeCooldownRef.current.delete(key), 200);
      }
    });

    // Runner
    const runner = Matter.Runner.create({ delta: 1000 / 60 });
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // ---- RENDER LOOP ----
    const ctx = canvas.getContext('2d');
    let dangerFrameCount = 0;

    const render = () => {
      if (!ctx || !engine) return;
      const time = Date.now();

      // Screen shake decay
      const shake = screenShakeRef.current;
      if (shake.intensity > 0.1) {
        shake.x = (Math.random() - 0.5) * shake.intensity;
        shake.y = (Math.random() - 0.5) * shake.intensity;
        shake.intensity *= 0.9;
      } else {
        shake.x = 0; shake.y = 0; shake.intensity = 0;
      }

      ctx.save();
      ctx.translate(shake.x, shake.y);
      ctx.clearRect(-5, -5, w + 10, h + 10);

      // Background — deep space-tech gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.3, '#1E1B4B');
      bgGrad.addColorStop(0.6, '#0F172A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle animated grid overlay
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      const gridOffset = (time / 80) % gridSize;
      for (let gx = -gridSize + gridOffset; gx < w + gridSize; gx += gridSize) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = -gridSize + gridOffset; gy < h + gridSize; gy += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Circuit traces
      drawCircuitTraces(ctx, w, h, time);

      // Floating particles (ambient)
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 10; i++) {
        const fx = (w * 0.5) + Math.sin(time / 3000 + i * 1.1) * w * 0.4;
        const fy = (h * 0.5) + Math.cos(time / 2500 + i * 0.9) * h * 0.4;
        const fr = 2 + Math.sin(time / 1000 + i) * 1;
        ctx.fillStyle = `hsl(${(i * 36 + time / 30) % 360}, 80%, 70%)`;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Danger zone
      const dangerPulse = Math.sin(time / 200) * 0.3 + 0.7;
      const dangerAlpha = dangerFrameCount > 0 ? (0.15 + dangerPulse * 0.15) : 0.06;
      ctx.fillStyle = `rgba(239,68,68,${dangerAlpha})`;
      ctx.fillRect(0, 0, w, DANGER_Y);

      // Danger line
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -(time / 50) % 16;
      const dangerLineAlpha = dangerFrameCount > 60 ? dangerPulse : 0.4;
      ctx.strokeStyle = `rgba(239,68,68,${dangerLineAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, DANGER_Y);
      ctx.lineTo(w, DANGER_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // "DANGER" text if close to game over
      if (dangerFrameCount > 60) {
        ctx.globalAlpha = dangerPulse;
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ PELIGRO ⚠', w / 2, DANGER_Y - 8);
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // Walls + LED strips
      drawWallStrips(ctx, w, h, time);

      // Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 3;
        sw.life -= 0.04;
        if (sw.life <= 0) { shockwavesRef.current.splice(i, 1); continue; }
        const rgb = hexToRgb(sw.color);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${sw.life * 0.5})`;
        ctx.lineWidth = 3 * sw.life;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw physics bodies
      const allBodies = Matter.Composite.allBodies(engine.world);
      let anyAboveDanger = false;

      for (const body of allBodies) {
        const level = bodiesMapRef.current.get(body.id);
        if (level === undefined) continue;
        const comp = COMPONENTS[level];
        drawComponent(ctx, body.position.x, body.position.y, comp.radius, comp, time);

        if (!body.isStatic && body.position.y - comp.radius < DANGER_Y && body.speed < 0.5) {
          anyAboveDanger = true;
        }
      }

      // Danger counter
      if (anyAboveDanger && !gameOverRef.current) {
        dangerFrameCount++;
        if (dangerFrameCount > 120) {
          gameOverRef.current = true;
          setGameOver(true);
          playGameOverSound();
          if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
        }
      } else {
        dangerFrameCount = Math.max(0, dangerFrameCount - 2);
      }

      // Preview piece
      if (!gameOverRef.current && canDropRef.current) {
        const previewComp = COMPONENTS[nextLevelRef.current];
        const pr = previewComp.radius;
        const px = previewXRef.current;
        const py = 44;

        ctx.save();
        ctx.globalAlpha = 0.5;
        drawComponent(ctx, px, py, pr, previewComp, time);
        ctx.globalAlpha = 1;

        // Drop guide line — glowing
        const lineGrad = ctx.createLinearGradient(px, py + pr, px, h);
        lineGrad.addColorStop(0, previewComp.glow + '44');
        lineGrad.addColorStop(0.5, previewComp.glow + '15');
        lineGrad.addColorStop(1, previewComp.glow + '00');
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 10]);
        ctx.lineDashOffset = -(time / 40) % 16;
        ctx.beginPath();
        ctx.moveTo(px, py + pr + 4);
        ctx.lineTo(px, h);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Draw particles
      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.vx *= 0.98;
        p.life -= 0.022;
        p.rotation += p.rotSpeed;
        if (p.life <= 0) { parts.splice(i, 1); continue; }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        if (p.type === 'star') {
          // Draw star shape
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          const spikes = 4;
          const outerR = p.size * p.life;
          const innerR = outerR * 0.4;
          for (let s = 0; s < spikes * 2; s++) {
            const r = s % 2 === 0 ? outerR : innerR;
            const a = (s * Math.PI) / spikes - Math.PI / 2;
            if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'ring') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5 * p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      ctx.restore(); // end shake transform

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      Matter.Events.off(engine);
      Matter.Engine.clear(engine);
    };
  }, [getGameDims, createComponentBody, spawnParticles, spawnShockwave, addToast, playMergeSound, playGameOverSound, playBounceSound, playWallBounceSound, triggerCombo, triggerShake]);

  // ---- DROP ----
  const dropComponent = useCallback((clientX) => {
    if (gameOverRef.current || !canDropRef.current || !engineRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = Math.max(40, Math.min(canvas.width - 40, (clientX - rect.left) * scaleX));
    const level = nextLevelRef.current;
    const comp = COMPONENTS[level];

    const body = createComponentBody(x, comp.radius + 12, level);
    Matter.Composite.add(engineRef.current.world, body);
    playDropSound();

    canDropRef.current = false;
    setTimeout(() => { canDropRef.current = true; }, 400);

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
    const scaleX = canvas.width / rect.width;
    previewXRef.current = Math.max(40, Math.min(canvas.width - 40, (clientX - rect.left) * scaleX));
  }, []);

  const handlePointerUp = useCallback((e) => {
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    dropComponent(clientX);
  }, [dropComponent]);

  // ---- Game start: when gameReady becomes true AND canvas exists ----
  useEffect(() => {
    if (!gameReady) return;
    // Small delay to ensure canvas is mounted in DOM
    const timer = setTimeout(() => {
      const cleanup = initGame();
      return () => { if (cleanup) cleanup(); };
    }, 50);
    return () => clearTimeout(timer);
  }, [gameReady, initGame]);

  const restart = useCallback(() => {
    setShowGuide(false);
    // If already ready, re-init directly after a tick (canvas exists)
    if (gameReady) {
      setTimeout(() => initGame(), 30);
    } else {
      setGameReady(true); // triggers the useEffect above
    }
  }, [initGame, gameReady]);

  // ============ GUIDE SCREEN ============
  if (showGuide) {
    return (
      <div className="min-h-full animate-fade-in flex flex-col" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 40%, #0F172A 100%)' }}>
        {/* Animated header */}
        <div className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 30%, #EC4899 60%, #F59E0B 100%)',
          paddingBottom: 1,
        }}>
          {/* Floating orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute rounded-full animate-pulse" style={{
                width: 20 + i * 12, height: 20 + i * 12,
                background: `radial-gradient(circle, rgba(255,255,255,${0.15 - i * 0.01}), transparent 70%)`,
                left: `${5 + i * 12}%`, top: `${10 + Math.sin(i * 0.8) * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.5}s`,
              }} />
            ))}
          </div>

          <div className="px-6 pt-6 pb-10 relative z-10">
            <button onClick={onBack} className="text-white/70 hover:text-white mb-5 flex items-center text-sm font-black active:scale-95 transition">
              <ArrowLeft size={18} className="mr-1" /> Volver
            </button>
            <div className="text-center">
              <div className="inline-block relative">
                <div className="text-7xl mb-2" style={{ filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))' }}>🧩</div>
                <div className="absolute -right-3 -top-2 text-2xl animate-spin" style={{ animationDuration: '3s' }}>⚡</div>
                <div className="absolute -left-3 top-0 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
              </div>
              <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-tight mt-2">AXON MERGE</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-px w-10 bg-white/30" />
                <p className="text-white/80 text-sm font-bold tracking-widest uppercase">El Desafío del Robot</p>
                <div className="h-px w-10 bg-white/30" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow px-5 py-5 space-y-4 pb-28 overflow-y-auto">
          {/* How to play — neon card */}
          <div className="rounded-2xl p-5 border border-indigo-500/30" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px rgba(99,102,241,0.1)',
          }}>
            <h3 className="text-base font-black text-indigo-300 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" /> ¿Cómo se juega?
            </h3>
            <div className="space-y-3 text-sm font-semibold text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-lg flex-shrink-0">👆</div>
                <p><b className="text-white">Toca</b> la pantalla para soltar un componente electrónico.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">🔄</div>
                <p>Cuando <b className="text-white">dos iguales</b> se tocan, ¡se fusionan en uno mejor!</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-lg flex-shrink-0">⚡</div>
                <p>¡Fusiones seguidas activan <b className="text-yellow-300">COMBOS</b> para más puntos!</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-lg flex-shrink-0">🏆</div>
                <p>Meta: ¡Crea el <b className="text-blue-300">CultivaTec Rover</b> 🤖!</p>
              </div>
            </div>
          </div>

          {/* Merge tree — visual chain */}
          <div className="rounded-2xl p-5 border border-purple-500/30" style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.06))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px rgba(139,92,246,0.08)',
          }}>
            <h3 className="text-base font-black text-purple-300 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-pink-400" /> Cadena de Fusión
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {COMPONENTS.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative" style={{
                    background: `linear-gradient(135deg, ${c.color}33, ${c.color}11)`,
                    border: `1.5px solid ${c.color}55`,
                    boxShadow: `0 0 10px ${c.color}22`,
                  }}>
                    {c.emoji}
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ background: c.color }}>{i + 1}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 text-center leading-tight">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button onClick={restart}
            className="w-full py-4 rounded-2xl text-lg font-black text-white active:scale-[0.97] transition-transform relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
              boxShadow: '0 6px 0 #4338CA, 0 0 30px rgba(99,102,241,0.3)',
            }}>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
            🚀 ¡JUGAR!
          </button>
        </div>
      </div>
    );
  }

  const nextComp = COMPONENTS[nextLevel];

  // ============ GAME SCREEN ============
  return (
    <div className="min-h-full animate-fade-in flex flex-col" style={{ background: 'linear-gradient(180deg, #0F172A, #1E1B4B, #0F172A)' }}>
      {/* Top bar — sleek dark glass */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{
        background: 'linear-gradient(135deg, rgba(30,27,75,0.95), rgba(15,23,42,0.95))',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        backdropFilter: 'blur(12px)',
      }}>
        <button onClick={onBack} className="text-indigo-300 hover:text-white active:scale-95 transition p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="text-center">
            <p className="text-[9px] font-black text-indigo-400/70 uppercase tracking-wider">Puntos</p>
            <p className="text-lg font-black text-white tabular-nums" style={{ textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>{score.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-indigo-500/20" />
          {/* High score */}
          <div className="text-center">
            <p className="text-[9px] font-black text-amber-400/70 uppercase tracking-wider flex items-center gap-0.5"><Trophy size={9} /> Récord</p>
            <p className="text-sm font-black text-amber-300 tabular-nums">{highScore.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-indigo-500/20" />
          {/* Merge counter */}
          <div className="text-center">
            <p className="text-[9px] font-black text-emerald-400/70 uppercase tracking-wider">Fusiones</p>
            <p className="text-sm font-black text-emerald-300 tabular-nums">{mergeCount}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setSoundOn(s => !s)} className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-300 active:scale-90 transition"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button onClick={restart} className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-300 active:scale-90 transition"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Next piece + level indicator */}
      <div className="flex items-center justify-between px-4 py-2" style={{
        background: 'linear-gradient(135deg, rgba(30,27,75,0.7), rgba(15,23,42,0.7))',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
      }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-500 uppercase">Siguiente</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{
            background: `linear-gradient(135deg, ${nextComp.color}22, ${nextComp.color}11)`,
            border: `1.5px solid ${nextComp.color}44`,
            boxShadow: `0 0 8px ${nextComp.color}15`,
          }}>
            <span className="text-base">{nextComp.emoji}</span>
            <span className="text-[11px] font-black" style={{ color: nextComp.glow }}>{nextComp.name}</span>
          </div>
        </div>
        {maxLevelReached > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <span>Máx:</span>
            <span>{COMPONENTS[maxLevelReached].emoji}</span>
            <span style={{ color: COMPONENTS[maxLevelReached].glow }}>{COMPONENTS[maxLevelReached].name}</span>
          </div>
        )}
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="flex-grow flex justify-center px-1 pb-1 relative">
        <canvas
          ref={canvasRef}
          className="rounded-xl touch-none"
          style={{
            maxWidth: '100%',
            boxShadow: '0 0 40px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />

        {/* Combo indicator */}
        <ComboIndicator combo={combo} />

        {/* Toasts */}
        {toasts.map(t => (
          <Toast key={t.id} text={t.text} emoji={t.emoji} color={t.color} level={t.level} onDone={() => removeToast(t.id)} />
        ))}

        {/* Game Over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-40 animate-fade-in">
            <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }} />
            <div className="relative z-10 mx-4 p-6 rounded-3xl text-center max-w-sm w-full" style={{
              background: 'linear-gradient(135deg, rgba(30,27,75,0.95), rgba(15,23,42,0.95))',
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <div className="text-6xl mb-3" style={{ filter: roverAchieved ? 'drop-shadow(0 0 20px rgba(37,99,235,0.5))' : 'none' }}>
                {roverAchieved ? '🤖' : '💥'}
              </div>
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                {roverAchieved ? '¡INCREÍBLE!' : '¡FIN DEL JUEGO!'}
              </h2>
              <p className="text-sm text-slate-400 font-semibold mb-5">
                {roverAchieved ? '¡Creaste el CultivaTec Rover!' : 'Los componentes llegaron al tope'}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl p-3" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p className="text-xl font-black text-indigo-300">{score.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Puntos</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="text-xl font-black text-amber-300">{highScore.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 flex items-center gap-0.5 justify-center"><Trophy size={8} /> Récord</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-xl font-black text-emerald-300">{mergeCount}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Fusiones</p>
                </div>
              </div>

              {/* Best component */}
              {maxLevelReached > 0 && (
                <div className="rounded-xl p-3 mb-5 flex items-center justify-center gap-2" style={{
                  background: `linear-gradient(135deg, ${COMPONENTS[maxLevelReached].color}15, ${COMPONENTS[maxLevelReached].color}08)`,
                  border: `1px solid ${COMPONENTS[maxLevelReached].color}33`,
                }}>
                  <span className="text-2xl">{COMPONENTS[maxLevelReached].emoji}</span>
                  <div className="text-left">
                    <p className="text-xs font-black" style={{ color: COMPONENTS[maxLevelReached].glow }}>Mejor componente</p>
                    <p className="text-[10px] font-bold text-slate-400">{COMPONENTS[maxLevelReached].name}</p>
                  </div>
                </div>
              )}

              <button onClick={restart}
                className="w-full py-3.5 rounded-xl text-base font-black text-white active:scale-[0.97] transition-transform mb-2"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 0 #4338CA, 0 0 20px rgba(99,102,241,0.2)',
                }}>
                🔄 Jugar de Nuevo
              </button>
              <button onClick={onBack}
                className="w-full py-3 rounded-xl text-sm font-black text-slate-400 active:scale-[0.97] transition-transform"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
                ← Volver al Taller
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(30px) scale(0.7); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          to { opacity: 0; transform: translateX(-50%) translateY(-15px) scale(0.85); }
        }
        @keyframes comboPop {
          from { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.15); }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
