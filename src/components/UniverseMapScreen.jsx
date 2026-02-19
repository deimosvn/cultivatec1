// ==========================================================
// UNIVERSE MAP — Pixel-Art Space Station Cockpit
// ==========================================================
// La estación se recrea completamente en CSS/JSX pixel-art.
// No se usa estacion.png.
//
// Layout (de arriba a abajo):
//   1. Top HUD bar (level, stats, settings)
//   2. System status LED row
//   3a. Instrument panel (ship systems gauges)
//   3b. Full-width monitor (universe carousel)
//   4. Console dashboard + station buttons

import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Settings, Zap, Star, GraduationCap, Cpu, Code2, Wrench, ArrowLeft, HelpCircle } from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { playClick, playTab, playExpand, playCollapse } from '../utils/retroSounds';

/* ─── Pixel font shorthand ─── */
const PF = '"Press Start 2P", monospace';
const MONO = 'monospace';

/* ─── Tiny reusable pixel components ─── */
const PixelBar = ({ value = 5, max = 8, color = '#22c55e', width = 32 }) => {
    const cellW = Math.max(2, Math.floor((width - (max - 1)) / max));
    return (
        <div style={{
            display: 'flex', gap: '1px',
            padding: '1px',
            background: 'linear-gradient(180deg, #060a12 0%, #060a12 30%, #0a0e1a 30%, #0a0e1a 70%, #080c16 70%, #080c16 100%)',
            border: '1px solid #2a3040',
            boxShadow: 'inset 0 1px 0 #050810, 0 0 0 1px #050810',
        }}>
            {Array.from({ length: max }, (_, i) => (
                <div key={i} style={{
                    width: `${cellW}px`, height: '4px',
                    background: i < value ? color : '#1a1e28',
                    boxShadow: i < value ? `0 0 4px ${color}60, inset 0 -1px 0 ${color}40` : 'inset 0 1px 0 #0a0e1a',
                    transition: 'background 0.3s step-end',
                }}/>
            ))}
        </div>
    );
};

const PixelLED = ({ color = '#22c55e', size = 4, blink = false, delay = '0s' }) => (
    <div style={{
        width: `${size}px`, height: `${size}px`,
        background: color, flexShrink: 0,
        boxShadow: `0 0 ${size + 2}px ${color}80, inset 0 0 0 1px ${color}40`,
        border: '1px solid #0a0e1a',
        animation: blink ? `pixel-led-blink 2.5s step-end ${delay} infinite` : 'none',
        imageRendering: 'pixelated',
    }}/>
);

const UniverseMapScreen = ({
    onSelectUniverse,
    onBack,
    userRole,
    onShowSettings,
    firebaseProfile,
    userProfile,
    userStats,
    onEditRobot,
    onShowLicenses,
    RobotMini,
    isAdminEmail,
    calculateLevel,
    onGoToCircuits,
    onGoToProgramming,
    onGoToBahia,
}) => {
    const scrollRef = useRef(null);
    const [showHelp, setShowHelp] = useState(false);
    const [activeIndex, setActiveIndex] = useState(() => {
        if (userRole) {
            const map = { primary: 0, secondary: 1, preparatory: 2, university: 3 };
            return map[userRole] ?? 0;
        }
        return 0;
    });

    const stars = useMemo(() =>
        Array.from({ length: 80 }, (_, i) => ({
            left: `${(i * 7.3 + 2) % 96 + 2}%`,
            top: `${(i * 11.7 + 1) % 92 + 4}%`,
            size: 0.8 + (i % 4) * 0.5,
            twinkleDuration: `${1.5 + (i % 7) * 0.6}s`,
            twinkleDelay: `${(i * 0.25) % 5}s`,
        }))
    , []);

    const scrollToIndex = useCallback((idx) => {
        const container = scrollRef.current;
        if (!container) return;
        const cards = container.children;
        if (cards[idx]) {
            const card = cards[idx];
            const scrollLeft = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
        setActiveIndex(idx);
    }, []);

    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;
        const center = container.scrollLeft + container.offsetWidth / 2;
        const cards = container.children;
        let closest = 0;
        let minDist = Infinity;
        for (let i = 0; i < cards.length; i++) {
            const cardCenter = cards[i].offsetLeft + cards[i].offsetWidth / 2;
            const dist = Math.abs(center - cardCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
        }
        setActiveIndex(closest);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => scrollToIndex(activeIndex), 100);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const recommendedIdx = userRole
        ? ({ primary: 0, secondary: 1, preparatory: 2, university: 3 }[userRole] ?? -1)
        : -1;

    const activeUniverse = UNIVERSES[activeIndex];
    const themeColor = activeUniverse?.trailColor || '#00e5ff';

    const stations = [
        { id: 'circuits', title: 'Circuitos', subtitle: 'TALLER HW', icon: Cpu, img: '/electronica.png',
          color: '#22D3EE', lite: '#67e8f9', mid: '#0e7490', dark: '#064e3b', shadow: '#053a2e', bgTop: '#0d2d35', bgBot: '#081c22', onClick: onGoToCircuits },
        { id: 'programming', title: 'C\u00F3digo', subtitle: 'TERMINAL', icon: Code2, img: '/programacion.png',
          color: '#A78BFA', lite: '#c4b5fd', mid: '#7c3aed', dark: '#4c1d95', shadow: '#2e1065', bgTop: '#1a1035', bgBot: '#100a22', onClick: onGoToProgramming },
        { id: 'bahia', title: 'Bah\u00EDa', subtitle: 'HANGAR', icon: Wrench, img: '/bahia.png',
          color: '#F59E0B', lite: '#fcd34d', mid: '#d97706', dark: '#92400e', shadow: '#6b2f06', bgTop: '#2a1e10', bgBot: '#1a1208', onClick: onGoToBahia },
    ];

    /* ── Level info ── */
    const levelInfo = calculateLevel
        ? calculateLevel(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0)
        : { level: 1, title: 'Novato', progress: 0 };

    return (
        <div className="retro-crt-global" style={{
            paddingBottom: '0px',
            paddingTop: 'env(safe-area-inset-top, 0px)',
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: '#8890a0',
            display: 'flex',
            flexDirection: 'column',
        }}>

            {/* ═══ INLINE STYLES / ANIMATIONS ═══ */}
            <style>{`
                @keyframes cockpit-scan-line {
                    0% { top: -2px; }
                    100% { top: 100%; }
                }
                @keyframes universe-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes universe-glow-pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
                @keyframes universe-card-enter {
                    0% { opacity: 0; transform: translateY(16px) scale(0.96); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes universe-ring-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes universe-estela-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes universe-estela-pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.08); }
                }
                @keyframes universe-particle-orbit {
                    0% { transform: rotate(0deg) translateX(28px) rotate(0deg); opacity: 0.8; }
                    50% { opacity: 0.3; }
                    100% { transform: rotate(360deg) translateX(28px) rotate(-360deg); opacity: 0.8; }
                }
                @keyframes universe-orb-breathe {
                    0%, 100% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.05); filter: brightness(1.12); }
                }
                @keyframes pixel-led-blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0.15; }
                }
                @keyframes cockpit-hud-slide {
                    0% { opacity: 0; transform: translateY(-8px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes cockpit-panel-slide-left {
                    0% { opacity: 0; transform: translateX(-12px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes cockpit-panel-slide-right {
                    0% { opacity: 0; transform: translateX(12px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes cockpit-monitor-glow {
                    0%, 100% { box-shadow: inset 0 0 30px rgba(0,229,255,0.03), 0 0 8px rgba(0,229,255,0.06); }
                    50% { box-shadow: inset 0 0 30px rgba(0,229,255,0.06), 0 0 14px rgba(0,229,255,0.10); }
                }
                @keyframes cockpit-gauge-fill {
                    0% { width: 0%; }
                    100% { width: var(--gauge-pct); }
                }
                .universe-scroll::-webkit-scrollbar { display: none; }
                .universe-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    scroll-snap-type: x mandatory;
                }
                .universe-card-snap {
                    scroll-snap-align: center;
                    scroll-snap-stop: always;
                }
                .cockpit-console-btn {
                    transition: all 0.12s !important;
                }
                .cockpit-console-btn:active {
                    transform: scale(0.93) translateY(1px) !important;
                    filter: brightness(1.3);
                }
                .pixel-arrow-btn {
                    image-rendering: pixelated;
                    transition: all 0.1s;
                }
                .pixel-arrow-btn:hover {
                    filter: brightness(1.4);
                }
                .pixel-arrow-btn:active {
                    transform: translateY(-50%) scale(0.92) !important;
                    filter: brightness(1.6);
                }
                .cockpit-station-btn {
                    transition: transform 0.06s step-end !important;
                    image-rendering: pixelated;
                    -webkit-tap-highlight-color: transparent;
                }
                .cockpit-station-btn:active {
                    transform: translateY(5px) !important;
                }
                .cockpit-station-btn:active .px3d-top {
                    border-bottom-width: 0px !important;
                }
                .cockpit-station-btn:active .px3d-side-l {
                    height: 0px !important;
                }
                .cockpit-station-btn:active .px3d-side-r {
                    height: 0px !important;
                }
                .cockpit-station-btn:active .px3d-bottom {
                    height: 1px !important;
                }
                .cockpit-station-btn:active .px3d-face {
                    filter: brightness(1.15);
                }
                .cockpit-station-btn:active .px3d-led {
                    opacity: 1 !important;
                    transform: scaleX(1.4);
                }
                @keyframes px3d-led-blink {
                    0%, 100% { opacity: 0.55; }
                    50% { opacity: 1; }
                }
                @keyframes px3d-icon-hover {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-1px); }
                }
                @keyframes station-img-float {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); }
                    50% { transform: translate(-50%, -50%) translateY(-6px) scale(1.05); }
                }
            `}</style>

            {/* ═══════════════════════════════════════════
                 BACKGROUND — Space behind the cockpit
                 ═══════════════════════════════════════════ */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'linear-gradient(180deg, #1a2e50 0%, #1a2e50 15%, #243a60 15%, #243a60 35%, #2e4a70 35%, #2e4a70 60%, #243a60 60%, #243a60 82%, #1a2e50 82%, #1a2e50 100%)',
                overflow: 'hidden',
            }}>
                {/* Dynamic nebula follows active universe */}
                <div style={{
                    position: 'absolute',
                    width: '70%', height: '50%',
                    background: `radial-gradient(circle, ${activeUniverse?.glowColor || 'rgba(59,130,246,0.3)'} 0%, transparent 70%)`,
                    left: '50%', top: '40%', transform: 'translate(-50%, -50%)',
                    filter: 'blur(60px)', opacity: 0.2,
                    transition: 'all 1s',
                }}/>
                <div style={{
                    position: 'absolute',
                    width: '25%', height: '35%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                    right: '8%', top: '20%', filter: 'blur(40px)', opacity: 0.12,
                }}/>

                {/* Stars */}
                {stars.map((star, i) => (
                    <div key={`s-${i}`} className="galaxy-star" style={{
                        left: star.left, top: star.top,
                        width: `${star.size}px`, height: `${star.size}px`,
                        '--twinkle-duration': star.twinkleDuration,
                        '--twinkle-delay': star.twinkleDelay,
                    }}/>
                ))}
                <div className="galaxy-shooting-star" style={{ left: '25%', top: '20%', '--shoot-duration': '5s', '--shoot-delay': '1s' }}/>
                <div className="galaxy-shooting-star" style={{ left: '65%', top: '35%', '--shoot-duration': '7s', '--shoot-delay': '4s' }}/>
                <div className="galaxy-shooting-star" style={{ left: '45%', top: '15%', '--shoot-duration': '4s', '--shoot-delay': '6s' }}/>
                {/* Hull plate seam lines — structural panels */}
                <div style={{ position: 'absolute', left: 0, right: 0, top: '18%', height: '2px', background: 'linear-gradient(90deg, transparent 0%, #a0a8b430 8%, #c0c8d022 50%, #a0a8b430 92%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }}/>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '2px', background: 'linear-gradient(90deg, transparent 0%, #a0a8b425 8%, #c0c8d018 50%, #a0a8b425 92%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }}/>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '72%', height: '2px', background: 'linear-gradient(90deg, transparent 0%, #a0a8b420 8%, #c0c8d014 50%, #a0a8b420 92%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }}/>
                {/* Vertical structural beams */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '3%', width: '2px', background: 'linear-gradient(180deg, transparent 0%, #a0a8b418 15%, #c0c8d012 50%, #a0a8b418 85%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }}/>
                <div style={{ position: 'absolute', top: 0, bottom: 0, right: '3%', width: '2px', background: 'linear-gradient(180deg, transparent 0%, #a0a8b418 15%, #c0c8d012 50%, #a0a8b418 85%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }}/>
            </div>

            {/* ═══════════════════════════════════════════
                 1. TOP HUD BAR
                 ═══════════════════════════════════════════ */}
            <div className="retro-hud-bar retro-panel-metal" style={{
                position: 'relative', zIndex: 2,
                padding: '6px 8px 5px',
                background: 'linear-gradient(180deg, #c8ccd4 0%, #c8ccd4 3%, #bcc0ca 3%, #bcc0ca 6%, #b0b8c2 6%, #b0b8c2 12%, #a0a8b4 12%, #a0a8b4 50%, #909aa4 50%, #909aa4 88%, #808a96 88%, #808a96 94%, #707a86 94%, #707a86 100%)',
                borderBottom: '2px solid #d0d4da',
                boxShadow: '0 0 0 1px #606a78, 0 2px 0 #707a86, 0 4px 10px rgba(0,0,0,0.3), inset 0 2px 0 #d8dce460, inset 0 -1px 0 #606a78, inset 2px 0 0 #c0c8d030, inset -2px 0 0 #707a86',
                animation: 'cockpit-hud-slide 0.4s ease-out both',
                overflow: 'hidden',
            }}>
                {/* HUD pixel-scanline */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    opacity: 0.06,
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #909aa4 2px, #909aa4 3px)',
                }}/>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    maxWidth: '480px', margin: '0 auto', gap: '6px',
                    position: 'relative', zIndex: 1,
                }}>
                    {/* Left: Back + Avatar + Name + Level */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                        {/* Back button */}
                        {onBack && (
                            <button onClick={onBack} style={{
                                padding: '3px 4px', background: 'linear-gradient(180deg, #a0a8b4 0%, #808a96 100%)',
                                border: '2px solid #b8c0ca', cursor: 'pointer', flexShrink: 0,
                                boxShadow: 'inset 0 1px 0 #c8d0d830, 0 0 0 1px #606a78',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ArrowLeft size={10} style={{ color: '#e2e8f0' }} />
                            </button>
                        )}
                        {userProfile && RobotMini && (
                            <button onClick={onEditRobot} style={{
                                background: 'linear-gradient(180deg, #a0a8b4 0%, #808a96 100%)',
                                border: '2px solid #c8ccd4',
                                borderRadius: 0, padding: '2px', cursor: 'pointer', flexShrink: 0,
                                boxShadow: '0 0 8px rgba(0,229,255,0.15), inset 0 0 0 1px #404a58, inset 0 1px 0 #909aa430',
                                position: 'relative',
                            }}>
                                <RobotMini config={userProfile.robotConfig} size={24} />
                            </button>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{
                                    fontSize: '7px', fontWeight: 900, color: '#e2e8f0',
                                    fontFamily: PF,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    maxWidth: '90px',
                                    textShadow: '0 1px 3px #000',
                                }}>
                                    {firebaseProfile?.username || 'Explorador'}
                                </span>
                                {isAdminEmail && isAdminEmail(firebaseProfile?.email) && (
                                    <span style={{
                                        padding: '0px 3px',
                                        background: 'linear-gradient(90deg, #ef4444, #f97316)',
                                        color: '#fff', fontSize: '4px', fontWeight: 900,
                                        textTransform: 'uppercase', fontFamily: PF,
                                    }}>ADM</span>
                                )}
                            </div>
                            {/* Level bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{
                                    fontSize: '5px', fontWeight: 900, color: '#22c55e',
                                    fontFamily: PF,
                                }}>NV.{levelInfo.level}</span>
                                <div style={{
                                    flex: 1, maxWidth: '60px', height: '4px',
                                    background: '#1a1e28',
                                    border: '1px solid #606a78',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(levelInfo.progress || 0) * 100}%`,
                                        background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                                        boxShadow: '0 0 4px #22c55e80',
                                        transition: 'width 0.5s',
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        {/* Streak */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 20%, #909aa4 20%, #909aa4 80%, #808a96 80%, #808a96 100%)', border: '2px solid #b8c0ca',
                            padding: '2px 5px',
                            boxShadow: 'inset 0 1px 0 #c8d0d830, inset 0 -1px 0 #606a78, 0 0 0 1px #606a78, inset 0 0 6px rgba(0,0,0,0.15)',
                        }}>
                            <Zap size={8} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 2px #fbbf2460)' }} />
                            <span style={{ fontSize: '6px', fontWeight: 900, color: '#fbbf24', fontFamily: PF, textShadow: '0 0 4px #fbbf2440' }}>
                                {firebaseProfile?.currentStreak || 0}
                            </span>
                        </div>
                        {/* Points */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 20%, #909aa4 20%, #909aa4 80%, #808a96 80%, #808a96 100%)', border: '2px solid #b8c0ca',
                            padding: '2px 5px',
                            boxShadow: 'inset 0 1px 0 #c8d0d830, inset 0 -1px 0 #606a78, 0 0 0 1px #606a78, inset 0 0 6px rgba(0,0,0,0.15)',
                        }}>
                            <Star size={8} style={{ color: '#facc15', filter: 'drop-shadow(0 0 2px #facc1560)' }} />
                            <span style={{ fontSize: '6px', fontWeight: 900, color: '#facc15', fontFamily: PF, textShadow: '0 0 4px #facc1540' }}>
                                {(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0).toLocaleString()}
                            </span>
                        </div>
                        {/* Licenses */}
                        {onShowLicenses && (
                            <button onClick={onShowLicenses} style={{
                                padding: '3px', background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 30%, #909aa4 30%, #909aa4 100%)',
                                border: '2px solid #b8c0ca', cursor: 'pointer',
                                boxShadow: 'inset 0 1px 0 #c8d0d830, 0 0 0 1px #606a78, inset 0 -1px 0 #606a78',
                            }}>
                                <GraduationCap size={10} style={{ color: '#64748b' }} />
                            </button>
                        )}
                        {/* Settings */}
                        {onShowSettings && (
                            <button onClick={onShowSettings} style={{
                                padding: '3px', background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 30%, #909aa4 30%, #909aa4 100%)',
                                border: '2px solid #b8c0ca', cursor: 'pointer',
                                boxShadow: 'inset 0 1px 0 #c8d0d830, 0 0 0 1px #606a78, inset 0 -1px 0 #606a78',
                            }}>
                                <Settings size={9} style={{ color: '#64748b' }} />
                            </button>
                        )}
                        {/* Help */}
                        <button onClick={() => { showHelp ? playCollapse() : playExpand(); setShowHelp(h => !h); }} style={{
                            padding: '3px', background: showHelp
                                ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)'
                                : 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 30%, #909aa4 30%, #909aa4 100%)',
                            border: '2px solid #b8c0ca', cursor: 'pointer',
                            boxShadow: 'inset 0 1px 0 #c8d0d830, 0 0 0 1px #606a78, inset 0 -1px 0 #606a78',
                        }}>
                            <HelpCircle size={9} style={{ color: showHelp ? '#fff' : '#64748b' }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                 HELP OVERLAY — Kid-friendly explanation
                 ═══════════════════════════════════════════ */}
            {showHelp && (
                <div onClick={() => setShowHelp(false)} style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                    animation: 'cockpit-hud-slide 0.2s ease-out',
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1a2e50 100%)',
                        border: '3px solid #3b82f6',
                        borderRadius: '16px',
                        padding: '20px',
                        maxWidth: '340px', width: '100%',
                        boxShadow: '0 0 30px rgba(59,130,246,0.3), 0 8px 32px rgba(0,0,0,0.5)',
                    }}>
                        <h2 style={{
                            fontSize: '11px', fontFamily: PF, color: '#60a5fa',
                            margin: '0 0 14px', textAlign: 'center',
                            textShadow: '0 0 10px rgba(96,165,250,0.4)',
                        }}>
                            🚀 ¿Cómo funciona?
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { emoji: '🌍', title: 'Elige tu Universo', desc: 'Desliza la pantalla para explorar los universos. Cada uno tiene mundos con lecciones sobre robótica.' },
                                { emoji: '🎮', title: 'Estaciones', desc: 'Usa los botones de abajo para ir al Taller de Circuitos, al Terminal de Código o a la Bahía de Chatarra.' },
                                { emoji: '⭐', title: 'Gana Puntos', desc: 'Completa lecciones y retos para ganar puntos y subir de nivel. ¡Tu racha sube cada día que practicas!' },
                                { emoji: '🤖', title: 'Tu Robot', desc: 'Toca tu avatar arriba a la izquierda para personalizar tu robot con skins geniales.' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1.2 }}>{item.emoji}</span>
                                    <div>
                                        <div style={{ fontSize: '8px', fontFamily: PF, color: '#e2e8f0', marginBottom: '3px', fontWeight: 900 }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '10px', fontFamily: 'system-ui, sans-serif', color: '#94a3b8', lineHeight: 1.5 }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowHelp(false)} style={{
                            marginTop: '16px', width: '100%', padding: '10px',
                            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                            border: '2px solid #60a5fa',
                            borderRadius: '8px',
                            color: '#fff', fontSize: '9px', fontFamily: PF, fontWeight: 900,
                            cursor: 'pointer',
                            boxShadow: '0 0 12px rgba(59,130,246,0.3)',
                            letterSpacing: '0.08em',
                        }}>
                            ¡ENTENDIDO! 👍
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════
                 2. SYSTEM STATUS LED ROW
                 ═══════════════════════════════════════════ */}
            <div className="retro-led-row" style={{
                position: 'relative', zIndex: 2,
                padding: '4px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'linear-gradient(180deg, #b8c0ca 0%, #b8c0ca 20%, #a8b0bc 20%, #a8b0bc 50%, #98a2ae 50%, #98a2ae 80%, #8890a0 80%, #8890a0 100%)',
                borderBottom: '2px solid #c8ccd4',
                boxShadow: 'inset 0 1px 0 #d0d4da40, 0 1px 0 #606a78, inset 0 -1px 0 #707a86',
            }}>
                {/* Pixel divider left */}
                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '1px', background: 'linear-gradient(90deg, transparent, #606a78)' }}/>
                </div>

                {/* Left LEDs */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <PixelLED color="#22c55e" size={4} blink />
                    <PixelLED color="#22c55e" size={4} blink delay="0.5s" />
                    <PixelLED color="#fbbf24" size={4} />
                </div>

                {/* Center label with pixel frame */}
                <div style={{
                    padding: '2px 8px',
                    background: 'linear-gradient(180deg, #98a2ae 0%, #889098 50%, #788290 100%)',
                    border: '1px solid #b8c0ca',
                    boxShadow: 'inset 0 0 0 1px #404a58, 0 0 4px rgba(34,211,238,0.06)',
                }}>
                    <span style={{
                        fontSize: '5px', fontFamily: PF, color: '#22d3ee',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        textShadow: '0 0 8px #22d3ee50',
                    }}>
                        SISTEMA EN L\u00CDNEA
                    </span>
                </div>

                {/* Right LEDs */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <PixelLED color="#fbbf24" size={4} />
                    <PixelLED color="#22c55e" size={4} blink delay="1s" />
                    <PixelLED color="#22c55e" size={4} blink delay="1.5s" />
                </div>

                {/* Pixel divider right */}
                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '1px', background: 'linear-gradient(90deg, #606a78, transparent)' }}/>
                </div>
            </div>


            {/* ═══════════════════════════════════════════
                 3-A. INSTRUMENT PANEL — Ship Systems
                 ═══════════════════════════════════════════ */}
            <div className="retro-instrument-bar" style={{
                position: 'relative', zIndex: 2,
                padding: '5px 8px',
                background: 'linear-gradient(180deg, #b8c0ca 0%, #b8c0ca 6%, #a8b0bc 6%, #a8b0bc 15%, #98a2ae 15%, #98a2ae 50%, #8a94a0 50%, #8a94a0 85%, #7c8692 85%, #7c8692 94%, #6e7884 94%, #6e7884 100%)',
                borderBottom: '2px solid #c8ccd4',
                boxShadow: '0 1px 0 #606a78, inset 0 2px 0 #d0d4da30, inset 0 -1px 0 #707a86',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '4px',
            }}>
                {/* Pixel bracket left */}
                <div style={{ flexShrink: 0 }}>
                    <div style={{ width: '6px', height: '2px', background: '#a0a8b4' }}/>
                    <div style={{ width: '2px', height: '4px', background: '#a0a8b4' }}/>
                </div>

                {/* Gauges container */}
                <div style={{
                    display: 'flex', gap: '3px', alignItems: 'center',
                    padding: '4px 6px',
                    background: 'linear-gradient(180deg, #9ca4b0 0%, #9ca4b0 10%, #8c96a2 10%, #8c96a2 50%, #7c8692 50%, #7c8692 90%, #6e7884 90%, #6e7884 100%)',
                    border: '2px solid #b8c0ca',
                    boxShadow: 'inset 0 0 0 1px #707a86, 0 0 0 1px #606a78, inset 0 1px 0 #c0c8d030, inset 0 -1px 0 #606a78',
                    maxWidth: '400px', width: '100%',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {/* Subtle CRT line */}
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
                        background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #0ff 2px, #0ff 3px)',
                    }}/>

                    {/* PWR */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                        <span style={{ fontSize: '5px', fontFamily: PF, color: '#22c55e', textShadow: '0 0 4px #22c55e60' }}>PWR</span>
                        <PixelBar value={6} max={8} color="#22c55e" width={28} />
                    </div>
                    <div style={{ width: '2px', height: '2px', background: '#606a78', flexShrink: 0 }}/>

                    {/* SHD */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                        <span style={{ fontSize: '5px', fontFamily: PF, color: '#fbbf24', textShadow: '0 0 4px #fbbf2460' }}>SHD</span>
                        <PixelBar value={4} max={8} color="#fbbf24" width={28} />
                    </div>
                    <div style={{ width: '2px', height: '2px', background: '#606a78', flexShrink: 0 }}/>

                    {/* SIG */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                        <span style={{ fontSize: '5px', fontFamily: PF, color: '#a78bfa', textShadow: '0 0 4px #a78bfa60' }}>SIG</span>
                        <div style={{ display: 'flex', gap: '1px', alignItems: 'flex-end' }}>
                            {[3, 5, 7, 9, 11].map((h, i) => (
                                <div key={i} style={{
                                    width: '2px', height: `${h}px`,
                                    background: i < 4 ? '#a78bfa' : '#2a3040',
                                }}/>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '2px', height: '2px', background: '#606a78', flexShrink: 0 }}/>

                    {/* TMP */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                        <span style={{ fontSize: '5px', fontFamily: PF, color: '#f59e0b', textShadow: '0 0 4px #f59e0b60' }}>TMP</span>
                        <div style={{ width: '20px', height: '4px', background: '#1a1e28', border: '1px solid #2a3040', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg, #22c55e, #fbbf24)' }}/>
                        </div>
                    </div>
                    <div style={{ width: '2px', height: '2px', background: '#606a78', flexShrink: 0 }}/>

                    {/* MSN */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', zIndex: 1 }}>
                        <span style={{ fontSize: '5px', fontFamily: PF, color: '#64748b' }}>MSN</span>
                        <span style={{
                            fontSize: '8px', fontFamily: PF, fontWeight: 900,
                            color: themeColor, textShadow: `0 0 6px ${themeColor}40`,
                        }}>{activeUniverse?.worlds?.length || 0}</span>
                    </div>
                </div>

                {/* Pixel bracket right */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ width: '6px', height: '2px', background: '#a0a8b4' }}/>
                    <div style={{ width: '2px', height: '4px', background: '#a0a8b4' }}/>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                 3-B. MAIN MONITOR — Full Width
                 ═══════════════════════════════════════════ */}
            <div style={{
                position: 'relative', zIndex: 2,
                flex: 1.4, minHeight: '280px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
            }}>

                {/* ─── CENTRAL MONITOR ─── */}
                <div className="retro-crt-overlay" style={{
                    flex: 1, minWidth: 0,
                    display: 'flex', flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    /* Inner padding so content clears the frame borders */
                    padding: '4% 4% 4% 4%',
                }}>

                    {/* CRT scanlines overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
                        background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,220,255,0.06) 2px, rgba(0,220,255,0.06) 3px)',
                    }}/>
                    {/* Sweeping scanline */}
                    <div style={{
                        position: 'absolute', left: 0, right: 0, height: '2px',
                        zIndex: 16, pointerEvents: 'none',
                        background: `linear-gradient(90deg, transparent, ${themeColor}35, transparent)`,
                        animation: 'cockpit-scan-line 5s linear infinite',
                    }}/>
                    {/* Corner vignette */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 14, pointerEvents: 'none',
                        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
                    }}/>

                    {/* Monitor title bar — pixel-art header */}
                    <div style={{
                        position: 'relative', zIndex: 10, flexShrink: 0,
                        padding: '3px 10px 3px',
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                        {/* Left pixel decoration — traffic lights + line */}
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                            <div style={{ width: '4px', height: '4px', background: '#ef4444', boxShadow: '0 0 3px #ef444460' }}/>
                            <div style={{ width: '4px', height: '4px', background: '#fbbf24', boxShadow: '0 0 3px #fbbf2460' }}/>
                            <div style={{ width: '4px', height: '4px', background: '#22c55e', boxShadow: '0 0 3px #22c55e60' }}/>
                            <div style={{ width: '8px', height: '1px', background: '#808a9640', marginLeft: '2px' }}/>
                        </div>
                        <span style={{
                            fontSize: '6px', fontFamily: PF, fontWeight: 900,
                            color: '#2a3446', letterSpacing: '0.18em',
                            textShadow: `0 0 10px ${themeColor}40, 0 1px 0 #000`,
                        }}>
                            ESTACI\u00D3N CULTIVATEC
                        </span>
                        {/* Right pixel decoration */}
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '1px', background: '#808a9640', marginRight: '2px' }}/>
                            <div style={{ width: '4px', height: '4px', background: '#22c55e', boxShadow: '0 0 3px #22c55e60' }}/>
                            <div style={{ width: '4px', height: '4px', background: '#fbbf24', boxShadow: '0 0 3px #fbbf2460' }}/>
                            <div style={{ width: '4px', height: '4px', background: '#ef4444', boxShadow: '0 0 3px #ef444460' }}/>
                        </div>
                    </div>

                    {/* Sub-header: "ELIGE TU UNIVERSO" */}
                    <div style={{
                        position: 'relative', zIndex: 10, flexShrink: 0,
                        textAlign: 'center', padding: '4px 6px 2px',
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                    }}>
                        <h1 style={{
                            fontSize: '9px', fontWeight: 900, color: '#fff', margin: 0,
                            letterSpacing: '0.15em',
                            fontFamily: PF,
                            textShadow: `0 0 10px ${themeColor}60, 0 0 20px ${themeColor}25, 0 2px 0 #000`,
                        }}>
                            ELIGE TU UNIVERSO
                        </h1>
                        <div style={{
                            fontSize: '4px', color: 'rgba(255,255,255,0.25)',
                            fontFamily: PF, marginTop: '2px', letterSpacing: '0.10em',
                        }}>
                            {'\u25C4 DESLIZAR \u25BA'}
                        </div>
                    </div>

                    {/* ─── Universe Carousel ─── */}
                    <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', zIndex: 10 }}>

                        {/* Arrow buttons */}
                        <button
                            className="pixel-arrow-btn"
                            onClick={() => { playTab(); scrollToIndex(Math.max(0, activeIndex - 1)); }}
                            style={{
                                position: 'absolute', left: '2px', top: '50%', transform: 'translateY(-50%)',
                                zIndex: 30, width: '22px', height: '34px', borderRadius: 0,
                                background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 20%, #909aa4 20%, #909aa4 50%, #808a96 50%, #808a96 80%, #707a86 80%, #707a86 100%)',
                                border: 'none',
                                boxShadow: `inset 0 0 0 2px ${themeColor}55, 0 0 0 1px #505a68, inset 0 1px 0 #c8d0d840`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: activeIndex === 0 ? 0 : 0.85,
                                pointerEvents: activeIndex === 0 ? 'none' : 'auto',
                            }}>
                            <span style={{
                                fontSize: '12px', fontWeight: 900, color: themeColor,
                                fontFamily: MONO, lineHeight: 1,
                                textShadow: `0 0 6px ${themeColor}80`,
                            }}>{'\u25C0'}</span>
                        </button>
                        <button
                            className="pixel-arrow-btn"
                            onClick={() => { playTab(); scrollToIndex(Math.min(UNIVERSES.length - 1, activeIndex + 1)); }}
                            style={{
                                position: 'absolute', right: '2px', top: '50%', transform: 'translateY(-50%)',
                                zIndex: 30, width: '22px', height: '34px', borderRadius: 0,
                                background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 20%, #909aa4 20%, #909aa4 50%, #808a96 50%, #808a96 80%, #707a86 80%, #707a86 100%)',
                                border: 'none',
                                boxShadow: `inset 0 0 0 2px ${themeColor}55, 0 0 0 1px #505a68, inset 0 1px 0 #c8d0d840`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: activeIndex === UNIVERSES.length - 1 ? 0 : 0.85,
                                pointerEvents: activeIndex === UNIVERSES.length - 1 ? 'none' : 'auto',
                            }}>
                            <span style={{
                                fontSize: '12px', fontWeight: 900, color: themeColor,
                                fontFamily: MONO, lineHeight: 1,
                                textShadow: `0 0 6px ${themeColor}80`,
                            }}>{'\u25B6'}</span>
                        </button>

                        {/* Scrollable universe cards */}
                        <div ref={scrollRef} onScroll={handleScroll}
                            className="universe-scroll"
                            style={{
                                display: 'flex', gap: '10px',
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                height: '100%',
                                alignItems: 'center',
                                paddingLeft: 'calc(50% - 70px)',
                                paddingRight: 'calc(50% - 70px)',
                                WebkitOverflowScrolling: 'touch',
                            }}>

                            {UNIVERSES.map((universe, idx) => {
                                const isActive = activeIndex === idx;
                                const isRecommended = recommendedIdx === idx;
                                const hasContent = universe.worlds.length > 0;

                                return (
                                    <div key={universe.id}
                                        className="universe-card-snap"
                                        onClick={() => hasContent && onSelectUniverse(idx)}
                                        style={{
                                            flexShrink: 0, width: '140px',
                                            transition: 'all 0.5s',
                                            transform: isActive ? 'scale(1)' : 'scale(0.7)',
                                            opacity: isActive ? 1 : 0.15,
                                            animation: `universe-card-enter 0.5s ease-out ${idx * 0.08}s both`,
                                            cursor: hasContent ? 'pointer' : 'default',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        }}>

                                        {/* Recommended badge */}
                                        {isRecommended && (
                                            <div style={{
                                                padding: '1px 5px',
                                                fontSize: '4px', fontWeight: 900, color: '#fff',
                                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                                fontFamily: PF,
                                                backgroundColor: universe.accentColor,
                                                boxShadow: `0 2px 6px ${universe.glowColor}`,
                                                marginBottom: '3px',
                                            }}>REC</div>
                                        )}

                                        {/* Universe Portal — Image */}
                                        <div style={{
                                            position: 'relative',
                                            width: '130px', height: '130px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            marginBottom: '2px',
                                            animation: 'universe-float 5s ease-in-out infinite',
                                        }}>
                                            {/* Stellar aura glow behind image */}
                                            <div style={{
                                                position: 'absolute', inset: '-18px',
                                                background: `radial-gradient(circle, ${universe.glowColor} 0%, ${universe.trailColor}30 35%, transparent 68%)`,
                                                filter: 'blur(14px)',
                                                opacity: isActive ? 0.7 : 0.15,
                                                animation: 'universe-estela-pulse 3s ease-in-out infinite',
                                                pointerEvents: 'none',
                                            }}/>

                                            {/* Outer rotating shimmer ring */}
                                            <div style={{
                                                position: 'absolute', inset: '-6px',
                                                background: `conic-gradient(from 0deg, transparent, ${universe.trailColor}30, transparent, ${universe.trailColor}20, transparent)`,
                                                animation: 'universe-ring-rotate 8s linear infinite',
                                                opacity: isActive ? 0.6 : 0.12,
                                                pointerEvents: 'none',
                                            }}/>

                                            {/* Orbiting sparkle particles */}
                                            {[0, 1, 2, 3, 4].map((p) => (
                                                <div key={`p-${p}`} style={{
                                                    position: 'absolute',
                                                    top: '50%', left: '50%',
                                                    width: '2.5px', height: '2.5px', borderRadius: '50%',
                                                    backgroundColor: universe.trailColor,
                                                    boxShadow: `0 0 6px ${universe.trailColor}, 0 0 12px ${universe.trailColor}50`,
                                                    animation: `universe-particle-orbit ${4 + p * 0.8}s linear ${p * 0.5}s infinite`,
                                                    pointerEvents: 'none', opacity: 0.6,
                                                }}/>
                                            ))}

                                            {/* Universe image */}
                                            <img
                                                src={`/universo${idx + 1}.png`}
                                                alt={universe.name}
                                                style={{
                                                    width: '120px', height: '120px',
                                                    objectFit: 'contain',
                                                    position: 'relative', zIndex: 10,
                                                    filter: isActive
                                                        ? `drop-shadow(0 0 10px ${universe.glowColor}) drop-shadow(0 0 22px ${universe.trailColor}60)`
                                                        : `drop-shadow(0 0 4px ${universe.glowColor}) brightness(0.7)`,
                                                    animation: 'universe-orb-breathe 4s ease-in-out infinite',
                                                    cursor: hasContent ? 'pointer' : 'not-allowed',
                                                    userSelect: 'none',
                                                    transition: 'filter 0.5s ease',
                                                }}
                                            />
                                        </div>

                                        {/* Name */}
                                        <h3 style={{
                                            fontSize: '8px', fontWeight: 900, color: '#fff',
                                            textAlign: 'center', margin: '0 0 3px', lineHeight: 1.3,
                                            fontFamily: PF,
                                            textShadow: `0 0 8px ${universe.trailColor}50, 0 1px 0 #000`,
                                        }}>
                                            {universe.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '5px', fontWeight: 600, textAlign: 'center',
                                            color: universe.trailColor + 'bb', margin: '0',
                                            fontFamily: MONO,
                                        }}>
                                            {hasContent ? `${universe.worlds.length} mundos` : 'PR\u00D3XIMAMENTE'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '4px', padding: '3px 0 2px', flexShrink: 0,
                        position: 'relative', zIndex: 10,
                        background: 'transparent',
                    }}>
                        {UNIVERSES.map((universe, idx) => (
                            <button key={idx} onClick={() => { playClick(); scrollToIndex(idx); }} style={{
                                transition: 'all 0.2s step-end',
                                border: activeIndex === idx ? `1px solid ${universe.trailColor}60` : '1px solid transparent',
                                cursor: 'pointer', padding: 0,
                                width: activeIndex === idx ? '16px' : '5px',
                                height: '5px',
                                backgroundColor: activeIndex === idx ? universe.trailColor : '#2a3040',
                                boxShadow: activeIndex === idx ? `0 0 8px ${universe.glowColor}, inset 0 0 3px ${universe.trailColor}40` : 'none',
                            }}/>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                 4. COCKPIT CONSOLE — Mechanical Station Buttons
                 ═══════════════════════════════════════════ */}
            <div className="retro-console-panel retro-panel-metal" style={{
                position: 'relative', zIndex: 2,
                background: 'linear-gradient(180deg, #b0b8c2 0%, #b0b8c2 3%, #a0a8b4 3%, #a0a8b4 8%, #909aa4 8%, #909aa4 20%, #808a96 20%, #808a96 50%, #707a86 50%, #707a86 80%, #606a78 80%, #606a78 92%, #505a68 92%, #505a68 100%)',
                borderTop: '3px solid #c8d0d8',
                border: '2px solid #b0b8c2',
                padding: '10px 10px 14px',
                boxShadow: '0 0 0 1px #505a68, 0 2px 0 0 #606a78, 0 4px 12px rgba(0,0,0,0.4), inset 0 4px 20px rgba(0,0,0,0.15), inset 0 2px 0 #c0c8d030, inset 0 -2px 0 #505a68',
                overflow: 'hidden',
            }}>
                {/* Console pixel grid texture */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.12,
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, #a0a8b4 3px, #a0a8b4 4px), repeating-linear-gradient(90deg, transparent 0px, transparent 3px, #a0a8b4 3px, #a0a8b4 4px)',
                }}/>
                {/* Metallic plate texture top edge */}
                <div style={{
                    position: 'absolute', top: '3px', left: 0, right: 0, height: '3px',
                    background: 'linear-gradient(90deg, transparent 0%, transparent 3%, #d0d8e050 5%, #e0e8f040 15%, #e8f0f835 50%, #e0e8f040 85%, #d0d8e050 95%, transparent 97%, transparent 100%)',
                }}/>

                {/* Console header with rivets and label */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    marginBottom: '10px',
                    position: 'relative', zIndex: 1,
                }}>
                    {/* Left pixel rivet cluster */}
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{
                            width: '6px', height: '6px',
                            background: 'linear-gradient(135deg, #c0c8d0 0%, #c0c8d0 30%, #909aa4 30%, #909aa4 70%, #5a6470 70%, #5a6470 100%)',
                            border: '1px solid #b0b8c2',
                            boxShadow: 'inset 0 1px 0 #d8dce450, 0 1px 2px #000',
                        }}/>
                        <PixelLED color="#22d3ee" size={3} blink delay="0.2s" />
                    </div>

                    {/* Decorative line left */}
                    <div style={{ width: '16px', height: '2px', background: 'linear-gradient(90deg, transparent, #a0a8b480)', flexShrink: 0 }}/>

                    {/* Center label plate — pixel engraved */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 15%, #909aa4 15%, #909aa4 50%, #808a96 50%, #808a96 85%, #707a86 85%, #707a86 100%)',
                        border: '2px solid #b0b8c2',
                        padding: '4px 14px',
                        position: 'relative',
                        boxShadow: 'inset 0 1px 0 #b0b8c225, inset 0 -1px 0 #505a68, 0 0 0 1px #505a68, 0 2px 6px rgba(0,0,0,0.3)',
                    }}>
                        {/* Pixel corner accents */}
                        <div style={{ position: 'absolute', top: -1, left: -1, width: '3px', height: '3px', borderTop: '1px solid #22d3ee30', borderLeft: '1px solid #22d3ee30' }}/>
                        <div style={{ position: 'absolute', top: -1, right: -1, width: '3px', height: '3px', borderTop: '1px solid #22d3ee30', borderRight: '1px solid #22d3ee30' }}/>
                        <div style={{ position: 'absolute', bottom: -1, left: -1, width: '3px', height: '3px', borderBottom: '1px solid #22d3ee30', borderLeft: '1px solid #22d3ee30' }}/>
                        <div style={{ position: 'absolute', bottom: -1, right: -1, width: '3px', height: '3px', borderBottom: '1px solid #22d3ee30', borderRight: '1px solid #22d3ee30' }}/>
                        <span style={{
                            fontSize: '6px', fontFamily: PF, color: '#22d3ee',
                            letterSpacing: '0.2em',
                            textShadow: '0 0 8px #22d3ee25',
                        }}>ESTACIONES DE CONTROL</span>
                    </div>

                    {/* Decorative line right */}
                    <div style={{ width: '16px', height: '2px', background: 'linear-gradient(90deg, #a0a8b480, transparent)', flexShrink: 0 }}/>

                    {/* Right pixel rivet cluster */}
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                        <PixelLED color="#22d3ee" size={3} blink delay="0.7s" />
                        <div style={{
                            width: '6px', height: '6px',
                            background: 'linear-gradient(135deg, #c0c8d0 0%, #c0c8d0 30%, #909aa4 30%, #909aa4 70%, #5a6470 70%, #5a6470 100%)',
                            border: '1px solid #b0b8c2',
                            boxShadow: 'inset 0 1px 0 #d8dce450, 0 1px 2px #000',
                        }}/>
                    </div>
                </div>

                {/* ── 3D PIXEL ARCADE BUTTONS ── */}
                <div style={{
                    display: 'flex', gap: '10px',
                    maxWidth: '420px', margin: '0 auto',
                    padding: '0 2px',
                    marginTop: '18px',
                }}>
                    {stations.map((station, sIdx) => {
                        const StIcon = station.icon;
                        return (
                            <button key={station.id} onClick={station.onClick}
                                className="cockpit-station-btn"
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column',
                                    animation: `universe-card-enter 0.4s ease-out ${0.2 + sIdx * 0.12}s both`,
                                    position: 'relative',
                                    WebkitTapHighlightColor: 'transparent',
                                }}>

                                {/* ┌──────────────────────────────────┐
                                    │  3D PIXEL BUTTON STRUCTURE       │
                                    │                                  │
                                    │  ┌─ top bevel (light) ────────┐  │
                                    │  │  FACE                      │  │
                                    │  │  ┌──────────────────────┐  │  │
                                    │  │  │  ICON + LABEL        │  │  │
                                    │  │  └──────────────────────┘  │  │
                                    │  └────────────────────────────┘  │
                                    │  ├─ side-L │          │ side-R ┤  │
                                    │  └─ bottom extrusion (dark) ──┘  │
                                    └──────────────────────────────────┘ */}

                                {/* Floating PNG icon on top of button */}
                                <img
                                    src={station.img}
                                    alt={station.title}
                                    style={{
                                        position: 'absolute',
                                        top: '8px', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '52px', height: '52px',
                                        objectFit: 'contain',
                                        zIndex: 20,
                                        pointerEvents: 'none',
                                        filter: `drop-shadow(0 0 8px ${station.color}90) drop-shadow(0 0 16px ${station.color}40)`,
                                        animation: `station-img-float 4s ease-in-out ${sIdx * 0.4}s infinite`,
                                    }}
                                />

                                {/* === TOP BEVEL (pixel highlight edge) === */}
                                <div className="px3d-top" style={{
                                    height: '3px',
                                    background: `linear-gradient(180deg, ${station.lite}30 0%, ${station.lite}30 50%, ${station.color}15 50%, ${station.color}15 100%)`,
                                    borderLeft: `3px solid ${station.lite}18`,
                                    borderRight: `3px solid ${station.lite}18`,
                                    borderBottom: 'none',
                                }}/>

                                {/* === MAIN FACE + 3D SIDES WRAPPER === */}
                                <div style={{ position: 'relative' }}>

                                    {/* Left 3D extrusion side */}
                                    <div className="px3d-side-l" style={{
                                        position: 'absolute',
                                        top: 0, bottom: '-5px', left: 0,
                                        width: '3px',
                                        background: `linear-gradient(180deg, ${station.mid}60 0%, ${station.mid}60 30%, ${station.dark}80 30%, ${station.dark}80 65%, ${station.shadow} 65%, ${station.shadow} 100%)`,
                                        transition: 'height 0.06s step-end',
                                        zIndex: 0,
                                    }}/>

                                    {/* Right 3D extrusion side */}
                                    <div className="px3d-side-r" style={{
                                        position: 'absolute',
                                        top: 0, bottom: '-5px', right: 0,
                                        width: '3px',
                                        background: `linear-gradient(180deg, ${station.dark}90 0%, ${station.dark}90 30%, ${station.shadow}cc 30%, ${station.shadow}cc 65%, ${station.shadow} 65%, ${station.shadow} 100%)`,
                                        transition: 'height 0.06s step-end',
                                        zIndex: 0,
                                    }}/>

                                    {/* ═══ BUTTON FACE ═══ */}
                                    <div className="px3d-face" style={{
                                        position: 'relative', zIndex: 1,
                                        background: `linear-gradient(180deg, ${station.lite}18 0%, ${station.lite}18 4%, ${station.color}20 4%, ${station.color}20 10%, ${station.bgTop} 10%, ${station.bgTop} 50%, ${station.bgBot} 50%, ${station.bgBot} 85%, ${station.dark}70 85%, ${station.dark}70 100%)`,
                                        borderLeft: `3px solid ${station.color}35`,
                                        borderRight: `3px solid ${station.dark}60`,
                                        boxShadow: `inset 0 2px 0 ${station.lite}20, inset 0 -2px 0 ${station.shadow}`,
                                        padding: '12px 6px 10px',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: '6px',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Inner bevel top highlight */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${station.color}30, ${station.lite}40, ${station.color}30)`,
                                        }}/>
                                        {/* Inner bevel bottom shadow */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, ${station.dark}40, ${station.shadow}50, ${station.dark}40)`,
                                        }}/>

                                        {/* Subtle scanline texture */}
                                        <div style={{
                                            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
                                            background: `repeating-linear-gradient(0deg, transparent 0px, transparent 2px, ${station.color} 2px, ${station.color} 3px)`,
                                        }}/>

                                        {/* Status LED bar */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px',
                                            marginBottom: '2px',
                                        }}>
                                            <div style={{ width: '6px', height: '1px', background: `${station.color}25` }}/>
                                            <div className="px3d-led" style={{
                                                width: '10px', height: '3px',
                                                background: station.color,
                                                boxShadow: `0 0 8px ${station.color}90, 0 0 16px ${station.color}30`,
                                                animation: `px3d-led-blink 2s ease-in-out ${sIdx * 0.3}s infinite`,
                                                transition: 'all 0.06s',
                                            }}/>
                                            <div style={{ width: '6px', height: '1px', background: `${station.color}25` }}/>
                                        </div>

                                        {/* Icon housing — pixel frame */}
                                        <div style={{
                                            width: '38px', height: '38px',
                                            position: 'relative',
                                            background: '#1a1e28',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            /* Pixel-art double border */
                                            boxShadow: `
                                                inset 0 0 0 2px ${station.color}28,
                                                inset 0 0 0 3px ${station.dark}50,
                                                0 0 0 1px ${station.shadow}70,
                                                inset 0 0 12px ${station.color}10
                                            `,
                                        }}>
                                            {/* Screen glow inside icon box */}
                                            <div style={{
                                                position: 'absolute', inset: '3px',
                                                background: `radial-gradient(circle, ${station.color}15 0%, transparent 75%)`,
                                            }}/>
                                            <div style={{
                                                position: 'relative', zIndex: 1,
                                                animation: 'px3d-icon-hover 3s ease-in-out infinite',
                                                animationDelay: `${sIdx * 0.5}s`,
                                            }}>
                                                <StIcon size={18} style={{
                                                    color: station.color,
                                                    filter: `drop-shadow(0 0 5px ${station.color}70)`,
                                                }} />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <span style={{
                                            fontSize: '7px', fontWeight: 900, color: station.color,
                                            fontFamily: PF, letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            textShadow: `0 0 10px ${station.color}50, 0 1px 0 ${station.shadow}`,
                                        }}>
                                            {station.title}
                                        </span>

                                        {/* Subtitle plate */}
                                        <div style={{
                                            padding: '2px 8px',
                                            background: `${station.color}06`,
                                            border: `1px solid ${station.color}15`,
                                            position: 'relative',
                                        }}>
                                            {/* Tiny corner pixels on the plate */}
                                            {[{top:'-1px',left:'-1px'},{top:'-1px',right:'-1px'},{bottom:'-1px',left:'-1px'},{bottom:'-1px',right:'-1px'}].map((p,i)=>(
                                                <div key={i} style={{
                                                    position:'absolute',...p,
                                                    width:'2px',height:'2px',
                                                    background: station.color+'30',
                                                }}/>
                                            ))}
                                            <span style={{
                                                fontSize: '4px', color: `${station.color}77`,
                                                fontFamily: PF, letterSpacing: '0.12em',
                                            }}>{station.subtitle}</span>
                                        </div>

                                        {/* Bottom pixel-art connector pins */}
                                        <div style={{
                                            display: 'flex', gap: '2px', marginTop: '2px',
                                            alignItems: 'flex-end',
                                        }}>
                                            {[3,5,4,6,4,5,3].map((h, bi) => (
                                                <div key={bi} style={{
                                                    width: '3px', height: `${h}px`,
                                                    background: bi % 2 === 0
                                                        ? `${station.color}30`
                                                        : `${station.mid}40`,
                                                }}/>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* === BOTTOM 3D EXTRUSION (thick pixel depth) === */}
                                <div className="px3d-bottom" style={{
                                    height: '5px',
                                    background: `linear-gradient(180deg, ${station.dark} 0%, ${station.dark} 35%, ${station.shadow} 35%, ${station.shadow} 65%, #050810 65%, #050810 100%)`,
                                    borderLeft: `3px solid ${station.shadow}cc`,
                                    borderRight: `3px solid ${station.shadow}`,
                                    borderBottom: `2px solid #050810`,
                                    transition: 'height 0.06s step-end',
                                }}/>

                                {/* Base shadow on surface */}
                                <div style={{
                                    height: '3px', marginTop: '1px',
                                    background: `radial-gradient(ellipse, ${station.dark}30 0%, transparent 70%)`,
                                    opacity: 0.5,
                                }}/>
                            </button>
                        );
                    })}
                </div>

                {/* Bottom console edge — brushed metal strip */}
                <div style={{
                    marginTop: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                }}>
                    {/* Left screws */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1].map(i => (
                            <div key={`ls-${i}`} style={{
                                width: '6px', height: '6px',
                                background: 'linear-gradient(135deg, #d0d4da 0%, #d0d4da 25%, #a0a8b4 25%, #a0a8b4 50%, #808a96 50%, #808a96 75%, #5a6470 75%, #5a6470 100%)',
                                border: '0.5px solid #b0b8c260',
                                boxShadow: 'inset 0 1px 0 #e0e4ea40, 0 1px 2px #000',
                            }}/>
                        ))}
                    </div>

                    {/* Decorative groove line */}
                    <div style={{
                        flex: 1, maxWidth: '120px', height: '2px',
                        background: 'linear-gradient(90deg, transparent, #808a9660, #a0a8b450, #808a9660, transparent)',
                        borderTop: '1px solid #5a6470',
                    }}/>

                    {/* Center indicator */}
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                        <PixelLED color="#22c55e" size={3} blink />
                        <span style={{ fontSize: '4px', fontFamily: PF, color: '#a0a8b4', letterSpacing: '0.1em' }}>SYS OK</span>
                        <PixelLED color="#22c55e" size={3} blink delay="0.5s" />
                    </div>

                    {/* Decorative groove line */}
                    <div style={{
                        flex: 1, maxWidth: '120px', height: '2px',
                        background: 'linear-gradient(90deg, transparent, #808a9660, #a0a8b450, #808a9660, transparent)',
                        borderTop: '1px solid #5a6470',
                    }}/>

                    {/* Right screws */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1].map(i => (
                            <div key={`rs-${i}`} style={{
                                width: '6px', height: '6px',
                                background: 'linear-gradient(135deg, #d0d4da 0%, #d0d4da 25%, #a0a8b4 25%, #a0a8b4 50%, #808a96 50%, #808a96 75%, #5a6470 75%, #5a6470 100%)',
                                border: '0.5px solid #b0b8c260',
                                boxShadow: 'inset 0 1px 0 #e0e4ea40, 0 1px 2px #000',
                            }}/>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                 5. HULL FLOOR — Cockpit bottom detail
                 ═══════════════════════════════════════════ */}
            <div className="retro-hull-floor" style={{
                position: 'relative', zIndex: 2,
                height: '24px', flexShrink: 0,
                background: 'linear-gradient(180deg, #a0a8b4 0%, #a0a8b4 10%, #909aa4 10%, #909aa4 30%, #808a96 30%, #808a96 55%, #707a86 55%, #707a86 80%, #606a78 80%, #606a78 100%)',
                borderTop: '3px solid #c8d0d8',
                boxShadow: 'inset 0 2px 0 #5a6470',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', overflow: 'hidden',
            }}>
                {/* Structural detail lines */}
                <div style={{
                    position: 'absolute', left: '3%', right: '3%', top: '35%',
                    height: '1px', background: '#808a9640',
                }}/>
                <div style={{
                    position: 'absolute', left: '10%', right: '10%', top: '60%',
                    height: '1px', background: '#808a9630',
                }}/>
                <div style={{
                    position: 'absolute', left: '20%', right: '20%', top: '80%',
                    height: '1px', background: '#808a9620',
                }}/>
                {/* Pixel-art floor rivets */}
                <div style={{ width: '4px', height: '4px', background: 'linear-gradient(135deg, #a0a8b4 0%, #a0a8b4 50%, #707a86 50%, #707a86 100%)', position: 'relative', zIndex: 1 }}/>
                <div style={{ width: '2px', height: '2px', background: '#a0a8b450', position: 'relative', zIndex: 1 }}/>
                <div style={{ width: '6px', height: '6px', background: 'linear-gradient(135deg, #c0c8d0 0%, #c0c8d0 30%, #a0a8b4 30%, #a0a8b4 60%, #5a6470 60%, #5a6470 100%)', border: '1px solid #b0b8c250', position: 'relative', zIndex: 1 }}/>
                <div style={{ width: '2px', height: '2px', background: '#a0a8b450', position: 'relative', zIndex: 1 }}/>
                <div style={{ width: '4px', height: '4px', background: 'linear-gradient(135deg, #a0a8b4 0%, #a0a8b4 50%, #707a86 50%, #707a86 100%)', position: 'relative', zIndex: 1 }}/>
            </div>

            {/* Gray filler — covers space background below hull */}
            <div style={{
                position: 'relative', zIndex: 2,
                flex: 1, minHeight: '80px',
                background: 'linear-gradient(180deg, #606a78 0%, #505a68 100%)',
            }}/>
        </div>
    );
};

export default UniverseMapScreen;
