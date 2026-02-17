import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';

// ================================================================
// SUMOBOT PUSH — 2-Player Local Multiplayer on One Device
// Tap battle · Canvas2D rendering · Best of 3
// ================================================================

const ROUND_COUNT_DOWN = 3; // seconds

export default function SumoBotPush({ onBack }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const gameStateRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastTapSoundRef = useRef({ p1: 0, p2: 0 });

  const [phase, setPhase] = useState('intro'); // intro | countdown | playing | round_end | match_end
  const [roundWins, setRoundWins] = useState([0, 0]);
  const [currentRound, setCurrentRound] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [roundWinner, setRoundWinner] = useState(null);
  const [matchWinner, setMatchWinner] = useState(null);

  // ---- Audio helper ----
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((freq, dur = 0.1, type = 'sine', vol = 0.1) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }, [getAudioCtx]);

  const playTapSound = useCallback((player) => {
    const now = Date.now();
    const key = player === 1 ? 'p1' : 'p2';
    if (now - lastTapSoundRef.current[key] < 40) return;
    lastTapSoundRef.current[key] = now;
    const freq = player === 1 ? 440 + Math.random() * 60 : 330 + Math.random() * 60;
    playSound(freq, 0.05, 'triangle', 0.07);
  }, [playSound]);

  const playHitSound = useCallback(() => {
    playSound(180, 0.08, 'sawtooth', 0.08);
    setTimeout(() => playSound(120, 0.06, 'square', 0.05), 30);
  }, [playSound]);

  const playWinSound = useCallback(() => {
    playSound(523, 0.15, 'sine', 0.12);
    setTimeout(() => playSound(659, 0.15, 'sine', 0.12), 120);
    setTimeout(() => playSound(784, 0.25, 'sine', 0.14), 240);
  }, [playSound]);

  const playCountdownBeep = useCallback((final) => {
    playSound(final ? 880 : 440, final ? 0.25 : 0.12, 'sine', 0.1);
  }, [playSound]);

  // ---- Game dims ----
  const getGameDims = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: 380, h: 700 };
    return { w: el.clientWidth, h: el.clientHeight };
  }, []);

  // ---- Draw robot from above (top-down rover) ----
  const drawRobot = (ctx, x, y, radius, color, accentColor, glowColor, facing, tapIntensity, time) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(facing);

    const r = radius;
    const pulse = 1 + tapIntensity * 0.08 * Math.sin(time / 50);

    // Glow
    const glow = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.6 * pulse);
    glow.addColorStop(0, glowColor + '55');
    glow.addColorStop(1, glowColor + '00');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(2, 3, r * 0.95, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (rounded rectangle shape — robot chassis from above)
    const bw = r * 1.6;
    const bh = r * 1.3;
    const br = r * 0.3;

    // Main body
    const bodyGrad = ctx.createLinearGradient(-bw/2, -bh/2, bw/2, bh/2);
    bodyGrad.addColorStop(0, accentColor);
    bodyGrad.addColorStop(0.4, color);
    bodyGrad.addColorStop(1, accentColor);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-bw/2, -bh/2, bw, bh, br);
    ctx.fill();

    // Body border
    ctx.strokeStyle = glowColor + 'AA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-bw/2, -bh/2, bw, bh, br);
    ctx.stroke();

    // Wheels (4 corners)
    const wheelW = r * 0.35;
    const wheelH = r * 0.55;
    const wheelOffX = bw / 2 - wheelW * 0.3;
    const wheelOffY = bh / 2 - wheelH * 0.3;
    ctx.fillStyle = '#1E293B';
    for (const [sx, sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]) {
      ctx.beginPath();
      ctx.roundRect(sx * wheelOffX - wheelW/2, sy * wheelOffY - wheelH/2, wheelW, wheelH, 3);
      ctx.fill();
      // Wheel tread marks
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      for (let t = -wheelH/2 + 3; t < wheelH/2; t += 4) {
        ctx.beginPath();
        ctx.moveTo(sx * wheelOffX - wheelW/3, sy * wheelOffY + t);
        ctx.lineTo(sx * wheelOffX + wheelW/3, sy * wheelOffY + t);
        ctx.stroke();
      }
    }

    // Central plate
    const plateGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
    plateGrad.addColorStop(0, glowColor + '44');
    plateGrad.addColorStop(1, color);
    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.roundRect(-r * 0.5, -r * 0.4, r, r * 0.8, r * 0.15);
    ctx.fill();

    // CPU chip detail
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(-r * 0.22, -r * 0.22, r * 0.44, r * 0.44, 4);
    ctx.fill();
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.roundRect(-r * 0.15, -r * 0.15, r * 0.3, r * 0.3, 3);
    ctx.fill();

    // CPU pins
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      const pinOff = i * r * 0.09;
      // Top/bottom pins
      ctx.beginPath(); ctx.moveTo(pinOff, -r * 0.22); ctx.lineTo(pinOff, -r * 0.35); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pinOff, r * 0.22); ctx.lineTo(pinOff, r * 0.35); ctx.stroke();
      // Left/right pins
      ctx.beginPath(); ctx.moveTo(-r * 0.22, pinOff); ctx.lineTo(-r * 0.35, pinOff); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * 0.22, pinOff); ctx.lineTo(r * 0.35, pinOff); ctx.stroke();
    }

    // Eyes (front indicator LEDs)
    const eyeY = -bh / 2 + r * 0.2;
    for (const ex of [-r * 0.3, r * 0.3]) {
      ctx.fillStyle = glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(ex, eyeY, r * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Front bumper blade
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.roundRect(-bw/2 + 4, -bh/2 - 4, bw - 8, 6, 3);
    ctx.fill();
    ctx.fillStyle = glowColor + '88';
    ctx.beginPath();
    ctx.roundRect(-bw/2 + 8, -bh/2 - 3, bw - 16, 3, 2);
    ctx.fill();

    // Tap intensity: engine exhaust glow on back
    if (tapIntensity > 0) {
      const exhaustAlpha = Math.min(tapIntensity * 0.4, 0.8);
      const exGlow = ctx.createRadialGradient(0, bh/2 + 5, 2, 0, bh/2 + 5, r * 0.6 * tapIntensity);
      exGlow.addColorStop(0, `rgba(255,165,0,${exhaustAlpha})`);
      exGlow.addColorStop(0.5, `rgba(255,80,0,${exhaustAlpha * 0.5})`);
      exGlow.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = exGlow;
      ctx.beginPath();
      ctx.arc(0, bh/2 + 5, r * 0.6 * tapIntensity, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // ---- Sparks at collision point ----
  const drawSparks = (ctx, x, y, intensity, time) => {
    if (intensity < 0.1) return;
    ctx.save();
    const count = Math.floor(3 + intensity * 8);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + time / 200;
      const dist = 5 + Math.random() * 15 * intensity;
      const sx = x + Math.cos(angle) * dist;
      const sy = y + Math.sin(angle) * dist;
      const size = 1 + Math.random() * 3 * intensity;

      const hue = 40 + Math.random() * 30; // yellow-orange
      ctx.fillStyle = `hsla(${hue}, 100%, ${60 + Math.random() * 30}%, ${0.5 + intensity * 0.4})`;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central energy ball
    const coreGlow = ctx.createRadialGradient(x, y, 0, x, y, 12 + intensity * 10);
    coreGlow.addColorStop(0, `rgba(255,255,255,${0.3 + intensity * 0.3})`);
    coreGlow.addColorStop(0.3, `rgba(255,200,50,${0.2 + intensity * 0.2})`);
    coreGlow.addColorStop(1, 'rgba(255,100,0,0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(x, y, 12 + intensity * 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // ---- Draw ring (Dohyo) ----
  const drawRing = (ctx, cx, cy, ringR, time) => {
    ctx.save();

    // Outer energy border
    const pulse = Math.sin(time / 300) * 0.05 + 1;
    const outerGlow = ctx.createRadialGradient(cx, cy, ringR * 0.85, cx, cy, ringR * 1.15 * pulse);
    outerGlow.addColorStop(0, 'rgba(99,102,241,0)');
    outerGlow.addColorStop(0.5, 'rgba(99,102,241,0.25)');
    outerGlow.addColorStop(0.8, 'rgba(59,130,246,0.35)');
    outerGlow.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR * 1.15 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Ring surface
    const ringGrad = ctx.createRadialGradient(cx - ringR * 0.2, cy - ringR * 0.2, ringR * 0.1, cx, cy, ringR);
    ringGrad.addColorStop(0, '#F8FAFC');
    ringGrad.addColorStop(0.6, '#E2E8F0');
    ringGrad.addColorStop(1, '#CBD5E1');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.fill();

    // Ring border
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#6366F1';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner circle (tawara)
    ctx.strokeStyle = '#A5B4FC55';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -(time / 40) % 12;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center cross
    ctx.strokeStyle = '#C7D2FE33';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - ringR * 0.3, cy);
    ctx.lineTo(cx + ringR * 0.3, cy);
    ctx.moveTo(cx, cy - ringR * 0.3);
    ctx.lineTo(cx, cy + ringR * 0.3);
    ctx.stroke();

    ctx.restore();
  };

  // ---- Draw background ----
  const drawBackground = (ctx, w, h, time) => {
    // Base gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0C4A6E');
    bg.addColorStop(0.3, '#0F172A');
    bg.addColorStop(0.7, '#0F172A');
    bg.addColorStop(1, '#7F1D1D');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Grid overlay
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 0.5;
    const gridSize = 35;
    for (let gx = 0; gx < w; gx += gridSize) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Player zone indicators
    // P1 zone (top)
    const p1Zone = ctx.createLinearGradient(0, 0, 0, h * 0.15);
    p1Zone.addColorStop(0, 'rgba(59,130,246,0.15)');
    p1Zone.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = p1Zone;
    ctx.fillRect(0, 0, w, h * 0.15);

    // P2 zone (bottom)
    const p2Zone = ctx.createLinearGradient(0, h * 0.85, 0, h);
    p2Zone.addColorStop(0, 'rgba(239,68,68,0)');
    p2Zone.addColorStop(1, 'rgba(239,68,68,0.15)');
    ctx.fillStyle = p2Zone;
    ctx.fillRect(0, h * 0.85, w, h * 0.15);

    // Divider line (faint)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // ---- Draw HUD ----
  const drawHUD = (ctx, w, h, gs, time) => {
    ctx.save();

    // P1 tap zone label (top, rotated 180°)
    ctx.save();
    ctx.translate(w / 2, 25);
    ctx.rotate(Math.PI);
    ctx.fillStyle = 'rgba(59,130,246,0.7)';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👆 ¡TOCA AQUÍ! — AZUL', 0, 0);
    // P1 combo indicator (also rotated for player 1)
    if (gs.p1Combo > 1) {
      ctx.fillStyle = '#60A5FA';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`⚡ x${Math.floor(gs.p1Combo)}`, 0, 20);
    }
    ctx.restore();

    // P2 tap zone label (bottom)
    ctx.fillStyle = 'rgba(239,68,68,0.7)';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👆 ¡TOCA AQUÍ! — ROJO', w / 2, h - 12);
    // P2 combo indicator
    if (gs.p2Combo > 1) {
      ctx.fillStyle = '#FCA5A5';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`⚡ x${Math.floor(gs.p2Combo)}`, w / 2, h - 28);
    }

    // Round indicator
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Ronda ${gs.round}/3`, 10, h / 2 - 14);

    // Score pips
    ctx.textAlign = 'right';
    const p1Wins = gs.wins[0];
    const p2Wins = gs.wins[1];
    let pipsText = '';
    for (let i = 0; i < 2; i++) {
      pipsText += i < p1Wins ? '🔵' : '⚪';
    }
    pipsText += ' vs ';
    for (let i = 0; i < 2; i++) {
      pipsText += i < p2Wins ? '🔴' : '⚪';
    }
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pipsText, w / 2, h / 2 + 6);

    // Battle position bar (horizontal bar showing who's winning)
    const barW = w * 0.5;
    const barH = 6;
    const barX = (w - barW) / 2;
    const barY = h / 2 + 16;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 3);
    ctx.fill();
    // Fill based on battlePos
    const normalizedPos = Math.max(-1, Math.min(1, gs.battlePos / 30));
    const fillX = barX + barW / 2;
    const fillW = (barW / 2) * normalizedPos;
    if (fillW > 0) {
      ctx.fillStyle = 'rgba(59,130,246,0.6)';
      ctx.fillRect(fillX, barY, fillW, barH);
    } else {
      ctx.fillStyle = 'rgba(239,68,68,0.6)';
      ctx.fillRect(fillX + fillW, barY, -fillW, barH);
    }
    // Center mark
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(fillX - 1, barY - 1, 2, barH + 2);

    // Tap meters (energy bars on sides)
    const meterH = h * 0.25;
    const meterW = 8;
    const meterY = h / 2 - meterH / 2;

    // P1 meter (left)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(8, meterY, meterW, meterH);
    const p1Fill = Math.min(gs.p1TapIntensity, 1);
    const p1BarH = meterH * p1Fill;
    const p1Grad = ctx.createLinearGradient(0, meterY + meterH - p1BarH, 0, meterY + meterH);
    p1Grad.addColorStop(0, '#60A5FA');
    p1Grad.addColorStop(1, '#3B82F6');
    ctx.fillStyle = p1Grad;
    ctx.fillRect(8, meterY + meterH - p1BarH, meterW, p1BarH);

    // P2 meter (right)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(w - 16, meterY, meterW, meterH);
    const p2Fill = Math.min(gs.p2TapIntensity, 1);
    const p2BarH = meterH * p2Fill;
    const p2Grad = ctx.createLinearGradient(0, meterY + meterH - p2BarH, 0, meterY + meterH);
    p2Grad.addColorStop(0, '#FCA5A5');
    p2Grad.addColorStop(1, '#EF4444');
    ctx.fillStyle = p2Grad;
    ctx.fillRect(w - 16, meterY + meterH - p2BarH, meterW, p2BarH);

    ctx.restore();
  };

  // ---- Initialize round state ----
  const initRoundState = useCallback((w, h, round, wins) => {
    const cx = w / 2;
    const cy = h / 2;
    const ringR = Math.min(w, h) * 0.32;
    const robotR = ringR * 0.22;
    const spacing = robotR * 1.6;

    return {
      w, h, cx, cy,
      ringR,
      robotR,
      round,
      wins: [...wins],
      // Battle position: 0 = center, positive = P1 winning (pushing P2 down), negative = P2 winning
      battlePos: 0,
      battleVel: 0,
      // Per-player tap tracking
      p1TapIntensity: 0, p1TapDecay: 0, p1LastTap: 0, p1Combo: 0,
      p2TapIntensity: 0, p2TapDecay: 0, p2LastTap: 0, p2Combo: 0,
      // Contact sparks
      sparkIntensity: 0,
      // Particles
      particles: [],
      ended: false,
      winner: 0,
    };
  }, []);

  // ---- Start a round ----
  const startRound = useCallback((round, wins) => {
    setCurrentRound(round);
    setRoundWinner(null);
    setCountdown(3);
    setPhase('countdown');

    const { w, h } = getGameDims();
    gameStateRef.current = initRoundState(w, h, round, wins);

    let count = 3;
    playCountdownBeep(false);
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count > 0) {
        playCountdownBeep(false);
      } else {
        playCountdownBeep(true);
        clearInterval(interval);
        setPhase('playing');
      }
    }, 1000);
  }, [getGameDims, initRoundState, playCountdownBeep]);

  // ---- Handle tap ----
  const handleTap = useCallback((player) => {
    const gs = gameStateRef.current;
    if (!gs || gs.ended) return;

    const now = Date.now();
    // Base push strength with random variance (±30%) so equal tapping still creates movement
    const baseForce = 1.8;
    const variance = 0.7 + Math.random() * 0.6; // 0.7 — 1.3

    if (player === 1) {
      // Combo: rapid taps within 250ms build combo for bonus power
      if (now - gs.p1LastTap < 250) {
        gs.p1Combo = Math.min(gs.p1Combo + 1, 8);
      } else {
        gs.p1Combo = Math.max(0, gs.p1Combo - 2);
      }
      gs.p1LastTap = now;
      const comboBonus = 1 + gs.p1Combo * 0.12; // up to 1.96x at max combo
      gs.battleVel += baseForce * variance * comboBonus;
      gs.p1TapIntensity = Math.min(gs.p1TapIntensity + 0.3, 1.5);
      gs.p1TapDecay = 0;
    } else {
      if (now - gs.p2LastTap < 250) {
        gs.p2Combo = Math.min(gs.p2Combo + 1, 8);
      } else {
        gs.p2Combo = Math.max(0, gs.p2Combo - 2);
      }
      gs.p2LastTap = now;
      const comboBonus = 1 + gs.p2Combo * 0.12;
      gs.battleVel -= baseForce * variance * comboBonus;
      gs.p2TapIntensity = Math.min(gs.p2TapIntensity + 0.3, 1.5);
      gs.p2TapDecay = 0;
    }

    playTapSound(player);
  }, [playTapSound]);

  // ---- Touch handler (multi-touch) ----
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.clientY < midY) {
        handleTap(1); // P1 — top
      } else {
        handleTap(2); // P2 — bottom
      }
    }
  }, [handleTap]);

  // ---- Mouse fallback for desktop testing ----
  const handleMouseDown = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    if (relY < rect.height / 2) {
      handleTap(1);
    } else {
      handleTap(2);
    }
  }, [handleTap]);

  // ---- GAME LOOP ----
  const startGameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const gs = gameStateRef.current;
      if (!gs) { frameRef.current = requestAnimationFrame(loop); return; }

      const { w, h, cx, cy, ringR, robotR } = gs;
      const time = Date.now();

      // ---- Physics update ----
      if (!gs.ended) {
        // --- Momentum-based battle position system ---
        // Friction: velocity decays over time (keeps momentum but not forever)
        gs.battleVel *= 0.92;

        // Light spring tension: slight pull toward center so the battle oscillates
        // (weaker when near center, stronger when far out — creates exciting near-edge tension)
        const springForce = -gs.battlePos * 0.008;
        gs.battleVel += springForce;

        // Random micro-wobble when both are tapping (makes it feel alive)
        if (gs.p1TapIntensity > 0.2 && gs.p2TapIntensity > 0.2) {
          gs.battleVel += (Math.random() - 0.5) * 0.3;
        }

        // Apply velocity to position
        gs.battlePos += gs.battleVel * 0.04;

        // Calculate robot positions from battlePos
        // battlePos is normalized: the range of the ring on Y axis
        const maxTravel = ringR - robotR * 0.5;
        const centerOffset = gs.battlePos * 3; // amplify for visible movement
        const spacing = robotR * 1.5;

        const p1y = cy + centerOffset - spacing;
        const p2y = cy + centerOffset + spacing;

        // Keep on center X with wobble based on intensity
        const wobbleAmt = Math.max(gs.p1TapIntensity, gs.p2TapIntensity);
        const wobble = Math.sin(time / 120) * wobbleAmt * 4 + Math.sin(time / 73) * wobbleAmt * 2;
        const p1x = cx + wobble;
        const p2x = cx - wobble * 0.7;

        // Store computed positions for rendering
        gs.p1x = p1x;
        gs.p1y = p1y;
        gs.p2x = p2x;
        gs.p2y = p2y;

        // Screen shake when battle is intense
        gs.shakeX = wobbleAmt > 0.5 ? (Math.random() - 0.5) * wobbleAmt * 3 : 0;
        gs.shakeY = wobbleAmt > 0.5 ? (Math.random() - 0.5) * wobbleAmt * 3 : 0;

        // Tap intensity decay
        gs.p1TapDecay++;
        gs.p2TapDecay++;
        if (gs.p1TapDecay > 4) gs.p1TapIntensity = Math.max(0, gs.p1TapIntensity - 0.035);
        if (gs.p2TapDecay > 4) gs.p2TapIntensity = Math.max(0, gs.p2TapIntensity - 0.035);

        // Combo decay when not tapping
        const now = Date.now();
        if (now - gs.p1LastTap > 400) gs.p1Combo = Math.max(0, gs.p1Combo - 0.05);
        if (now - gs.p2LastTap > 400) gs.p2Combo = Math.max(0, gs.p2Combo - 0.05);

        // Spark intensity based on combined tap
        gs.sparkIntensity = (gs.p1TapIntensity + gs.p2TapIntensity) * 0.5;

        // Hit sound when both tapping hard
        if (gs.sparkIntensity > 0.6 && Math.random() < 0.05) playHitSound();

        // Spawn push particles
        if (gs.p1TapIntensity > 0.3 || gs.p2TapIntensity > 0.3) {
          const contactY = (gs.p1y + gs.p2y) / 2;
          if (Math.random() < 0.3) {
            gs.particles.push({
              x: cx + (Math.random() - 0.5) * robotR * 2,
              y: contactY,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              life: 1,
              color: Math.random() > 0.5 ? '#FDE68A' : '#FBBF24',
              size: 2 + Math.random() * 3,
            });
          }
        }

        // Check win: robot center outside ring
        const p1Dist = Math.sqrt((gs.p1x - cx) ** 2 + (gs.p1y - cy) ** 2);
        const p2Dist = Math.sqrt((gs.p2x - cx) ** 2 + (gs.p2y - cy) ** 2);

        // P1 pushed out (too far UP = P2 won) or P2 pushed out (too far DOWN = P1 won)
        if (p1Dist > ringR - robotR * 0.3) {
          // P1 pushed out → P2 wins
          gs.ended = true;
          gs.winner = 2;
          gs.wins[1]++;
          setRoundWins([...gs.wins]);
          setRoundWinner(2);
          playWinSound();

          if (gs.wins[1] >= 2) {
            setTimeout(() => { setMatchWinner(2); setPhase('match_end'); }, 1500);
          } else {
            setTimeout(() => {
              setPhase('round_end');
              setTimeout(() => startRound(gs.round + 1, gs.wins), 1500);
            }, 1200);
          }
        } else if (p2Dist > ringR - robotR * 0.3) {
          // P2 pushed out → P1 wins
          gs.ended = true;
          gs.winner = 1;
          gs.wins[0]++;
          setRoundWins([...gs.wins]);
          setRoundWinner(1);
          playWinSound();

          if (gs.wins[0] >= 2) {
            setTimeout(() => { setMatchWinner(1); setPhase('match_end'); }, 1500);
          } else {
            setTimeout(() => {
              setPhase('round_end');
              setTimeout(() => startRound(gs.round + 1, gs.wins), 1500);
            }, 1200);
          }
        }
      }

      // ---- Render ----
      ctx.save();
      // Apply screen shake
      if (gs.shakeX || gs.shakeY) {
        ctx.translate(gs.shakeX || 0, gs.shakeY || 0);
      }
      ctx.clearRect(-10, -10, w + 20, h + 20);

      // Background
      drawBackground(ctx, w, h, time);

      // Ring
      drawRing(ctx, cx, cy, ringR, time);

      // Sparks at collision point
      if (!gs.ended) {
        const contactY = (gs.p1y + gs.p2y) / 2;
        drawSparks(ctx, cx, contactY, gs.sparkIntensity, time);
      }

      // Robots
      // P1 (Blue, top, faces down = π/2... actually since it starts above, faces down toward P2)
      drawRobot(ctx, gs.p1x, gs.p1y, robotR, '#2563EB', '#1E40AF', '#60A5FA', Math.PI / 2, gs.p1TapIntensity, time);
      // P2 (Red, bottom, faces up)
      drawRobot(ctx, gs.p2x, gs.p2y, robotR, '#DC2626', '#991B1B', '#FCA5A5', -Math.PI / 2, gs.p2TapIntensity, time);

      // Particles
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) { gs.particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // HUD
      drawHUD(ctx, w, h, gs, time);

      // Round winner flash
      if (gs.ended && gs.winner) {
        ctx.fillStyle = gs.winner === 1 ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.12)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = gs.winner === 1 ? '#3B82F6' : '#EF4444';
        ctx.shadowBlur = 20;
        ctx.fillText(
          gs.winner === 1 ? '🔵 ¡AZUL GANA!' : '🔴 ¡ROJO GANA!',
          w / 2, h / 2
        );
        ctx.shadowBlur = 0;
      }

      // Countdown overlay
      if (countdown > 0 && !gs.ended) {
        // done via React overlay, but we also dim the canvas
      }

      ctx.restore(); // end screen shake transform

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
  }, [playHitSound, playWinSound, startRound]);

  // ---- Setup canvas and start ----
  useEffect(() => {
    // Only setup canvas when in a canvas-rendering phase
    if (phase === 'intro' || phase === 'match_end') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      // Update game state dimensions if needed
      const gs = gameStateRef.current;
      if (gs) {
        gs.w = canvas.width;
        gs.h = canvas.height;
        gs.cx = canvas.width / 2;
        gs.cy = canvas.height / 2;
        gs.ringR = Math.min(canvas.width, canvas.height) * 0.32;
        gs.robotR = gs.ringR * 0.22;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    startGameLoop();

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [startGameLoop, phase]);

  // ---- Start first round when entering from intro ----
  const startMatch = useCallback(() => {
    setRoundWins([0, 0]);
    setMatchWinner(null);
    startRound(1, [0, 0]);
  }, [startRound]);

  const restartMatch = useCallback(() => {
    setRoundWins([0, 0]);
    setMatchWinner(null);
    setPhase('intro');
  }, []);

  // ============ INTRO SCREEN ============
  if (phase === 'intro') {
    return (
      <div className="min-h-full flex flex-col animate-fade-in" style={{ background: 'linear-gradient(180deg, #0C4A6E 0%, #0F172A 40%, #0F172A 60%, #7F1D1D 100%)' }}>
        <div className="px-5 pt-5">
          <button onClick={onBack} className="text-white/60 hover:text-white flex items-center text-sm font-black active:scale-95 transition">
            <ArrowLeft size={18} className="mr-1" /> Volver
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center px-6 gap-6">
          {/* Title */}
          <div className="text-center">
            <div className="text-7xl mb-3" style={{ filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.4))' }}>🤼</div>
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ textShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              SUMOBOT PUSH
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-px w-8 bg-white/20" />
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase">2 Jugadores Local</p>
              <div className="h-px w-8 bg-white/20" />
            </div>
          </div>

          {/* How it works */}
          <div className="w-full max-w-xs rounded-2xl p-5 border border-indigo-500/25" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(30,27,75,0.4))',
            backdropFilter: 'blur(12px)',
          }}>
            <div className="space-y-3 text-sm font-semibold text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg flex-shrink-0">🔵</div>
                <p><b className="text-blue-300">Jugador 1</b> toca la mitad <b className="text-white">superior</b></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-lg flex-shrink-0">🔴</div>
                <p><b className="text-red-300">Jugador 2</b> toca la mitad <b className="text-white">inferior</b></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-lg flex-shrink-0">💥</div>
                <p>¡Toca <b className="text-yellow-200">rápido</b> para empujar al rival fuera del ring!</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">🏆</div>
                <p>Gana <b className="text-white">al mejor de 3</b> rondas</p>
              </div>
            </div>
          </div>

          {/* Diagram */}
          <div className="w-full max-w-xs rounded-2xl overflow-hidden border border-white/10" style={{
            background: 'linear-gradient(180deg, rgba(59,130,246,0.15), rgba(15,23,42,0.6), rgba(239,68,68,0.15))',
          }}>
            <div className="py-4 text-center border-b border-white/5">
              <span className="text-xs font-black text-blue-300 uppercase tracking-wider">↑ Zona de Azul ↑</span>
            </div>
            <div className="py-6 text-center flex items-center justify-center gap-3">
              <span className="text-3xl" style={{ transform: 'rotate(90deg)' }}>🤖</span>
              <span className="text-xl">⚡</span>
              <span className="text-3xl" style={{ transform: 'rotate(-90deg)' }}>🤖</span>
            </div>
            <div className="py-4 text-center border-t border-white/5">
              <span className="text-xs font-black text-red-300 uppercase tracking-wider">↓ Zona de Rojo ↓</span>
            </div>
          </div>

          {/* Start */}
          <button onClick={startMatch}
            className="w-full max-w-xs py-4 rounded-2xl text-lg font-black text-white active:scale-[0.97] transition-transform relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 6px 0 #4338CA, 0 0 30px rgba(99,102,241,0.3)',
            }}>
            ⚔️ ¡COMENZAR BATALLA!
          </button>
        </div>
      </div>
    );
  }

  // ============ MATCH END SCREEN ============
  if (phase === 'match_end') {
    const isP1 = matchWinner === 1;
    return (
      <div className="min-h-full flex flex-col items-center justify-center animate-fade-in px-6" style={{
        background: isP1
          ? 'linear-gradient(180deg, #1E3A8A, #0F172A, #1E3A8A)'
          : 'linear-gradient(180deg, #991B1B, #0F172A, #991B1B)',
      }}>
        <div className="text-center max-w-xs w-full">
          <div className="text-7xl mb-4" style={{ filter: `drop-shadow(0 0 30px ${isP1 ? 'rgba(59,130,246,0.5)' : 'rgba(239,68,68,0.5)'})` }}>
            🏆
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            ¡{isP1 ? 'AZUL' : 'ROJO'} GANA!
          </h1>
          <p className="text-white/60 text-sm font-bold mb-2">
            Resultado: {roundWins[0]} — {roundWins[1]}
          </p>
          <p className="text-lg font-black mb-8" style={{ color: isP1 ? '#60A5FA' : '#FCA5A5' }}>
            🤖 ¡Jugador {matchWinner} es el campeón SumoBot!
          </p>

          <button onClick={restartMatch}
            className="w-full py-4 rounded-2xl text-base font-black text-white active:scale-[0.97] transition-transform mb-3"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: '0 4px 0 #4338CA',
            }}>
            🔄 Revancha
          </button>
          <button onClick={onBack}
            className="w-full py-3 rounded-xl text-sm font-black text-slate-400 active:scale-[0.97] transition-transform"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
            ← Volver al Taller
          </button>
        </div>
      </div>
    );
  }

  // ============ GAME CANVAS SCREEN (countdown, playing, round_end) ============
  return (
    <div ref={containerRef} className="fixed inset-0 animate-fade-in select-none"
      style={{ touchAction: 'none', background: '#0F172A', zIndex: 50 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        onTouchStart={phase === 'playing' ? handleTouchStart : undefined}
        onMouseDown={phase === 'playing' ? handleMouseDown : undefined}
        style={{ touchAction: 'none' }}
      />

      {/* Back button overlay */}
      <button onClick={onBack}
        className="absolute top-3 left-3 z-30 text-white/40 hover:text-white/80 active:scale-90 transition-all"
        style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '6px 10px' }}>
        <ArrowLeft size={18} />
      </button>

      {/* Countdown overlay */}
      {phase === 'countdown' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl font-black text-white animate-bounce" style={{
              textShadow: '0 0 40px rgba(99,102,241,0.6)',
              animation: 'countPulse 1s ease-in-out infinite',
            }}>
              {countdown > 0 ? countdown : '¡GO!'}
            </div>
            <p className="text-white/50 text-sm font-bold mt-4">Ronda {currentRound} de 3</p>
          </div>
        </div>
      )}

      {/* Round end flash */}
      {phase === 'round_end' && roundWinner && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-8 py-6 rounded-3xl" style={{
            background: 'rgba(15,23,42,0.85)',
            border: `2px solid ${roundWinner === 1 ? 'rgba(59,130,246,0.5)' : 'rgba(239,68,68,0.5)'}`,
            boxShadow: `0 0 40px ${roundWinner === 1 ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            <div className="text-4xl mb-2">{roundWinner === 1 ? '🔵' : '🔴'}</div>
            <p className="text-xl font-black text-white">
              ¡{roundWinner === 1 ? 'AZUL' : 'ROJO'} gana la ronda!
            </p>
            <p className="text-white/50 text-sm font-bold mt-1">
              {roundWins[0]} — {roundWins[1]}
            </p>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes countPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
