// ==========================================================
// UNIVERSE MAP — Kid-Friendly Space Adventure
// ==========================================================
// Bright, rounded, fun design for children.
// Features: colorful HUD, big universe cards, friendly buttons

import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Settings, Zap, Star, ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { UNIVERSES } from '../data/universesData';
import { playClick, playTab, playExpand, playCollapse } from '../utils/retroSounds';

const SF = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

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

    const bubbles = useMemo(() =>
        Array.from({ length: 18 }, (_, i) => ({
            left: `${(i * 13.7 + 5) % 90 + 5}%`,
            bottom: `-${20 + (i % 5) * 10}%`,
            size: 8 + (i % 6) * 6,
            duration: `${12 + (i % 8) * 3}s`,
            delay: `${(i * 1.3) % 10}s`,
            opacity: 0.06 + (i % 4) * 0.03,
        }))
    , []);

    const stars = useMemo(() =>
        Array.from({ length: 50 }, (_, i) => ({
            left: `${(i * 7.3 + 2) % 96 + 2}%`,
            top: `${(i * 11.7 + 1) % 92 + 4}%`,
            size: 1 + (i % 3) * 0.8,
            duration: `${1.5 + (i % 5) * 0.5}s`,
            delay: `${(i * 0.3) % 4}s`,
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
    const themeColor = activeUniverse?.trailColor || '#60a5fa';

    const stations = [
        { id: 'circuits', title: 'Lab. de Circuitos', img: '/electronica.png', dailyKey: 'cultivatec_daily_circuit',
          gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', glow: '#06b6d4', color: '#06b6d4',
          helpMsg: '¡Robot averiado!', onClick: onGoToCircuits },
        { id: 'programming', title: 'Est. de Programación', img: '/programacion.png', dailyKey: 'cultivatec_daily_prog',
          gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: '#8b5cf6', color: '#8b5cf6',
          helpMsg: '¡Código roto!', onClick: onGoToProgramming },
        { id: 'bahia', title: 'Bahía de Chatarra', img: '/bahia.png', dailyKey: null,
          gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: '#f59e0b', color: '#f59e0b',
          helpMsg: '', onClick: onGoToBahia },
    ];

    // Check which stations have unsolved daily missions
    const todayKey = (() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    })();
    const hasPendingDaily = (dailyKey) => {
        if (!dailyKey) return false;
        try { return localStorage.getItem(dailyKey) !== todayKey; } catch { return false; }
    };

    const levelInfo = calculateLevel
        ? calculateLevel(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0)
        : { level: 1, title: 'Novato', progress: 0 };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #1e1b4b 85%, #0f172a 100%)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* ═══ ANIMATIONS ═══ */}
            <style>{`
                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes card-enter {
                    0% { opacity: 0; transform: translateY(20px) scale(0.9); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bubble-rise {
                    0% { transform: translateY(0) scale(1); opacity: var(--bubble-opacity); }
                    100% { transform: translateY(-120vh) scale(0.5); opacity: 0; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                @keyframes station-btn-enter {
                    0% { opacity: 0; transform: translateY(16px) scale(0.92); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes station-spark {
                    0% { opacity: 0; transform: translate(0, 0) scale(0); }
                    30% { opacity: 1; transform: translate(var(--sx), var(--sy)) scale(1); }
                    100% { opacity: 0; transform: translate(var(--ex), var(--ey)) scale(0); }
                }
                @keyframes station-smoke {
                    0% { opacity: 0.5; transform: translateY(0) scale(0.6); }
                    100% { opacity: 0; transform: translateY(-22px) scale(1.4); }
                }
                @keyframes station-shake {
                    0%, 100% { transform: rotate(0deg); }
                    20% { transform: rotate(-3deg); }
                    40% { transform: rotate(3deg); }
                    60% { transform: rotate(-2deg); }
                    80% { transform: rotate(2deg); }
                }
                @keyframes help-bubble {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                @keyframes orb-breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.04); }
                }
                @keyframes ring-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes glow-expand {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .uni-scroll::-webkit-scrollbar { display: none; }
                .uni-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    scroll-snap-type: x mandatory;
                }
                .uni-card-snap {
                    scroll-snap-align: center;
                    scroll-snap-stop: always;
                }
                .station-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                    -webkit-tap-highlight-color: transparent;
                }
                .station-card:active {
                    transform: scale(0.95) !important;
                }
            `}</style>

            {/* ═══ BACKGROUND DECORATIONS ═══ */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {/* Stars */}
                {stars.map((star, i) => (
                    <div key={`star-${i}`} style={{
                        position: 'absolute',
                        left: star.left,
                        top: star.top,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        borderRadius: '50%',
                        background: '#fff',
                        animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
                    }} />
                ))}
                {/* Floating bubbles */}
                {bubbles.map((b, i) => (
                    <div key={`bub-${i}`} style={{
                        position: 'absolute',
                        left: b.left,
                        bottom: b.bottom,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${b.opacity + 0.05}), rgba(139,92,246,${b.opacity}))`,
                        animation: `bubble-rise ${b.duration} linear ${b.delay} infinite`,
                        '--bubble-opacity': b.opacity,
                    }} />
                ))}
                {/* Top gradient glow that follows theme */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '120%', height: '40%',
                    background: `radial-gradient(ellipse at 50% 0%, ${themeColor}20 0%, transparent 70%)`,
                    transition: 'all 1s ease',
                }} />
            </div>

            {/* ═══════════════════════════════════════════
                 1. TOP HUD BAR — Friendly & Rounded
                 ═══════════════════════════════════════════ */}
            <div style={{
                position: 'relative', zIndex: 10,
                paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
                paddingLeft: '14px', paddingRight: '14px', paddingBottom: '12px',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.9) 100%)',
                borderBottom: '2px solid rgba(139,92,246,0.3)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    maxWidth: '480px', margin: '0 auto', gap: '10px',
                }}>
                    {/* Left: Back + Avatar + Name + Level */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        {onBack && (
                            <button onClick={onBack} style={{
                                padding: '8px', background: 'rgba(139,92,246,0.2)',
                                border: '2px solid rgba(139,92,246,0.4)',
                                borderRadius: '12px', cursor: 'pointer', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ArrowLeft size={18} style={{ color: '#c4b5fd' }} />
                            </button>
                        )}
                        {userProfile && RobotMini && (
                            <button onClick={onEditRobot} style={{
                                background: 'linear-gradient(135deg, #312e81, #1e1b4b)',
                                border: '2px solid #6366f1',
                                borderRadius: '14px', padding: '4px', cursor: 'pointer', flexShrink: 0,
                                boxShadow: '0 0 12px rgba(99,102,241,0.3)',
                            }}>
                                <RobotMini config={userProfile.robotConfig} size={36} />
                            </button>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                    fontSize: '12px', fontWeight: 800, color: '#e2e8f0',
                                    fontFamily: SF,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    maxWidth: '120px',
                                }}>
                                    {firebaseProfile?.username || 'Explorador'}
                                </span>
                                {isAdminEmail && isAdminEmail(firebaseProfile?.email) && (
                                    <span style={{
                                        padding: '2px 6px',
                                        background: 'linear-gradient(90deg, #ef4444, #f97316)',
                                        color: '#fff', fontSize: '8px', fontWeight: 900,
                                        borderRadius: '6px', fontFamily: SF,
                                    }}>ADM</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                <span style={{
                                    fontSize: '9px', fontWeight: 800, color: '#a78bfa',
                                    fontFamily: SF,
                                    background: 'rgba(139,92,246,0.15)',
                                    padding: '2px 8px',
                                    borderRadius: '8px',
                                }}>
                                    Nv.{levelInfo.level}
                                </span>
                                <div style={{
                                    flex: 1, maxWidth: '80px', height: '7px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(levelInfo.progress || 0) * 100}%`,
                                        background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                                        borderRadius: '10px',
                                        transition: 'width 0.5s ease',
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats + Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.3)',
                            padding: '5px 10px', borderRadius: '12px',
                        }}>
                            <Zap size={14} style={{ color: '#fbbf24' }} />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', fontFamily: SF }}>
                                {firebaseProfile?.currentStreak || 0}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: 'rgba(250,204,21,0.15)', border: '2px solid rgba(250,204,21,0.3)',
                            padding: '5px 10px', borderRadius: '12px',
                        }}>
                            <Star size={14} style={{ color: '#facc15' }} />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#facc15', fontFamily: SF }}>
                                {(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0).toLocaleString()}
                            </span>
                        </div>
                        {onShowSettings && (
                            <button onClick={onShowSettings} style={{
                                padding: '7px', background: 'rgba(139,92,246,0.2)',
                                border: '2px solid rgba(139,92,246,0.3)', cursor: 'pointer',
                                borderRadius: '12px', display: 'flex', alignItems: 'center',
                            }}>
                                <Settings size={16} style={{ color: '#a78bfa' }} />
                            </button>
                        )}
                        <button onClick={() => { showHelp ? playCollapse() : playExpand(); setShowHelp(h => !h); }} style={{
                            padding: '7px',
                            background: showHelp ? 'rgba(99,102,241,0.5)' : 'rgba(139,92,246,0.2)',
                            border: '2px solid rgba(139,92,246,0.3)', cursor: 'pointer',
                            borderRadius: '12px', display: 'flex', alignItems: 'center',
                        }}>
                            <HelpCircle size={16} style={{ color: showHelp ? '#fff' : '#a78bfa' }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ HELP OVERLAY ═══ */}
            {showHelp && (
                <div onClick={() => setShowHelp(false)} style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                    backdropFilter: 'blur(4px)',
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                        border: '3px solid #6366f1',
                        borderRadius: '24px',
                        padding: '24px',
                        maxWidth: '340px', width: '100%',
                        boxShadow: '0 0 40px rgba(99,102,241,0.3)',
                    }}>
                        <h2 style={{
                            fontSize: '16px', fontFamily: SF, color: '#a78bfa',
                            margin: '0 0 16px', textAlign: 'center', fontWeight: 900,
                        }}>
                            🚀 ¿Cómo funciona?
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { emoji: '🌍', title: 'Elige tu Universo', desc: 'Desliza para explorar los universos. Cada uno tiene mundos con lecciones de robótica.' },
                                { emoji: '🎮', title: 'Estaciones', desc: 'Usa los botones de abajo para ir al Taller de Circuitos, Terminal de Código o Bahía.' },
                                { emoji: '⭐', title: 'Gana Puntos', desc: 'Completa lecciones y retos para ganar puntos y subir de nivel.' },
                                { emoji: '🤖', title: 'Tu Robot', desc: 'Toca tu avatar para personalizar tu robot con skins geniales.' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.emoji}</span>
                                    <div>
                                        <div style={{ fontSize: '12px', fontFamily: SF, color: '#e2e8f0', marginBottom: '3px', fontWeight: 800 }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '11px', fontFamily: SF, color: '#94a3b8', lineHeight: 1.5 }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowHelp(false)} style={{
                            marginTop: '18px', width: '100%', padding: '14px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            borderRadius: '16px',
                            color: '#fff', fontSize: '13px', fontFamily: SF, fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                        }}>
                            ¡Entendido! 👍
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════
                 2. UNIVERSE TITLE SECTION
                 ═══════════════════════════════════════════ */}
            <div style={{
                position: 'relative', zIndex: 2,
                textAlign: 'center',
                padding: '16px 16px 4px',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                    <Sparkles size={16} style={{ color: themeColor, transition: 'color 0.5s' }} />
                    <h1 style={{
                        fontSize: '15px', fontWeight: 900, color: '#fff', margin: 0,
                        fontFamily: SF,
                        letterSpacing: '0.03em',
                    }}>
                        Elige tu Universo
                    </h1>
                    <Sparkles size={16} style={{ color: themeColor, transition: 'color 0.5s' }} />
                </div>
                <p style={{
                    fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                    fontFamily: SF, marginTop: '4px',
                    fontWeight: 600,
                }}>
                    ◄ Desliza para explorar ►
                </p>
            </div>

            {/* ═══════════════════════════════════════════
                 3. UNIVERSE CAROUSEL — Big & Beautiful
                 ═══════════════════════════════════════════ */}
            <div style={{
                position: 'relative', zIndex: 2,
                flex: 1,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                minHeight: '300px',
            }}>
                {/* Arrow buttons */}
                <button
                    onClick={() => { playTab(); scrollToIndex(Math.max(0, activeIndex - 1)); }}
                    style={{
                        position: 'absolute', left: '6px', top: '45%', transform: 'translateY(-50%)',
                        zIndex: 30, width: '36px', height: '36px', borderRadius: '50%',
                        background: 'rgba(139,92,246,0.3)',
                        border: '2px solid rgba(139,92,246,0.5)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: activeIndex === 0 ? 0 : 0.9,
                        pointerEvents: activeIndex === 0 ? 'none' : 'auto',
                        transition: 'opacity 0.3s',
                    }}>
                    <span style={{ fontSize: '16px', color: '#c4b5fd', fontWeight: 900 }}>◀</span>
                </button>
                <button
                    onClick={() => { playTab(); scrollToIndex(Math.min(UNIVERSES.length - 1, activeIndex + 1)); }}
                    style={{
                        position: 'absolute', right: '6px', top: '45%', transform: 'translateY(-50%)',
                        zIndex: 30, width: '36px', height: '36px', borderRadius: '50%',
                        background: 'rgba(139,92,246,0.3)',
                        border: '2px solid rgba(139,92,246,0.5)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        opacity: activeIndex === UNIVERSES.length - 1 ? 0 : 0.9,
                        pointerEvents: activeIndex === UNIVERSES.length - 1 ? 'none' : 'auto',
                        transition: 'opacity 0.3s',
                    }}>
                    <span style={{ fontSize: '16px', color: '#c4b5fd', fontWeight: 900 }}>▶</span>
                </button>

                {/* Scrollable universe cards */}
                <div ref={scrollRef} onScroll={handleScroll}
                    className="uni-scroll"
                    style={{
                        display: 'flex', gap: '16px',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        flex: 1,
                        alignItems: 'center',
                        paddingLeft: 'calc(50% - 130px)',
                        paddingRight: 'calc(50% - 130px)',
                        WebkitOverflowScrolling: 'touch',
                    }}>
                    {UNIVERSES.map((universe, idx) => {
                        const isActive = activeIndex === idx;
                        const isRecommended = recommendedIdx === idx;
                        const hasContent = universe.worlds.length > 0;

                        return (
                            <div key={universe.id}
                                className="uni-card-snap"
                                onClick={() => hasContent && onSelectUniverse(idx)}
                                style={{
                                    flexShrink: 0, width: '260px',
                                    transition: 'all 0.4s ease',
                                    transform: isActive ? 'scale(1)' : 'scale(0.75)',
                                    opacity: isActive ? 1 : 0.2,
                                    animation: `card-enter 0.5s ease-out ${idx * 0.08}s both`,
                                    cursor: hasContent ? 'pointer' : 'default',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                }}>

                                {/* Recommended badge */}
                                {isRecommended && (
                                    <div style={{
                                        padding: '3px 12px',
                                        fontSize: '9px', fontWeight: 800, color: '#fff',
                                        fontFamily: SF,
                                        backgroundColor: universe.accentColor,
                                        borderRadius: '20px',
                                        boxShadow: `0 2px 10px ${universe.glowColor}`,
                                        marginBottom: '6px',
                                    }}>⭐ Recomendado</div>
                                )}

                                {/* Universe Portal */}
                                <div style={{
                                    position: 'relative',
                                    width: '220px', height: '220px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '8px',
                                    animation: 'float-gentle 5s ease-in-out infinite',
                                }}>
                                    {/* Glow behind */}
                                    <div style={{
                                        position: 'absolute', inset: '-20px',
                                        background: `radial-gradient(circle, ${universe.glowColor} 0%, ${universe.trailColor}25 35%, transparent 65%)`,
                                        filter: 'blur(16px)',
                                        opacity: isActive ? 0.6 : 0.1,
                                        animation: 'glow-expand 3s ease-in-out infinite',
                                        pointerEvents: 'none',
                                        transition: 'opacity 0.5s',
                                    }} />

                                    {/* Rotating ring */}
                                    <div style={{
                                        position: 'absolute', inset: '-8px',
                                        borderRadius: '50%',
                                        background: `conic-gradient(from 0deg, transparent, ${universe.trailColor}25, transparent, ${universe.trailColor}15, transparent)`,
                                        animation: 'ring-rotate 10s linear infinite',
                                        opacity: isActive ? 0.5 : 0.1,
                                        pointerEvents: 'none',
                                        transition: 'opacity 0.5s',
                                    }} />

                                    {/* Universe image */}
                                    <img
                                        src={`/universo${idx + 1}.png`}
                                        alt={universe.name}
                                        style={{
                                            width: '200px', height: '200px',
                                            objectFit: 'contain',
                                            position: 'relative', zIndex: 10,
                                            filter: isActive
                                                ? `drop-shadow(0 0 16px ${universe.glowColor}) drop-shadow(0 0 32px ${universe.trailColor}50)`
                                                : `drop-shadow(0 0 8px ${universe.glowColor}) brightness(0.6)`,
                                            animation: 'orb-breathe 4s ease-in-out infinite',
                                            cursor: hasContent ? 'pointer' : 'not-allowed',
                                            userSelect: 'none',
                                            transition: 'filter 0.5s ease',
                                        }}
                                    />
                                </div>

                                {/* Name */}
                                <h3 style={{
                                    fontSize: '15px', fontWeight: 900, color: '#fff',
                                    textAlign: 'center', margin: '0 0 4px', lineHeight: 1.3,
                                    fontFamily: SF,
                                    textShadow: `0 0 12px ${universe.trailColor}50`,
                                }}>
                                    {universe.name}
                                </h3>
                                <p style={{
                                    fontSize: '11px', fontWeight: 700, textAlign: 'center',
                                    color: 'rgba(255,255,255,0.5)', margin: '0',
                                    fontFamily: SF,
                                }}>
                                    {hasContent ? `${universe.worlds.length} mundos` : 'Próximamente'}
                                </p>

                                {/* Explore button (only visible on active) */}
                                {isActive && hasContent && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelectUniverse(idx); }}
                                        style={{
                                            marginTop: '12px',
                                            padding: '10px 28px',
                                            background: `linear-gradient(135deg, ${universe.accentColor || universe.trailColor}, ${universe.trailColor})`,
                                            border: 'none',
                                            borderRadius: '20px',
                                            color: '#fff', fontSize: '12px', fontWeight: 800,
                                            fontFamily: SF,
                                            cursor: 'pointer',
                                            boxShadow: `0 4px 16px ${universe.trailColor}60`,
                                            animation: 'card-enter 0.3s ease-out',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        🚀 ¡Explorar!
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Dot indicators */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', padding: '8px 0 4px', flexShrink: 0,
                    position: 'relative', zIndex: 10,
                }}>
                    {UNIVERSES.map((universe, idx) => (
                        <button key={idx} onClick={() => { playClick(); scrollToIndex(idx); }} style={{
                            transition: 'all 0.3s ease',
                            border: 'none',
                            cursor: 'pointer', padding: 0,
                            width: activeIndex === idx ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '10px',
                            backgroundColor: activeIndex === idx ? universe.trailColor : 'rgba(255,255,255,0.2)',
                            boxShadow: activeIndex === idx ? `0 0 10px ${universe.glowColor}` : 'none',
                        }} />
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                 4. STATION BUTTONS — Large Images
                 ═══════════════════════════════════════════ */}
            <div style={{
                position: 'relative', zIndex: 2,
                padding: '8px 14px 18px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.5) 100%)',
            }}>
                {/* Station images row */}
                <div style={{
                    display: 'flex', gap: '12px',
                    justifyContent: 'center', alignItems: 'flex-end',
                    maxWidth: '400px', margin: '0 auto',
                }}>
                    {stations.map((station, sIdx) => {
                        const pending = hasPendingDaily(station.dailyKey);
                        return (
                            <button key={station.id} onClick={station.onClick}
                                className="station-card"
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: '4px',
                                    animation: `station-btn-enter 0.4s ease-out ${0.1 + sIdx * 0.1}s both`,
                                    position: 'relative',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '0',
                                    WebkitTapHighlightColor: 'transparent',
                                }}>
                                {/* Help message bubble (only if pending) */}
                                {pending && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-28px', left: '50%', transform: 'translateX(-50%)',
                                        background: 'rgba(255,255,255,0.95)',
                                        color: '#1e293b',
                                        fontSize: '8px',
                                        fontWeight: 800,
                                        fontFamily: SF,
                                        padding: '3px 8px',
                                        borderRadius: '8px',
                                        whiteSpace: 'nowrap',
                                        boxShadow: `0 2px 8px ${station.glow}40`,
                                        animation: 'help-bubble 2s ease-in-out infinite',
                                        zIndex: 5,
                                        border: `1.5px solid ${station.glow}50`,
                                    }}>
                                        {station.helpMsg}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                                            width: '7px', height: '7px',
                                            background: 'rgba(255,255,255,0.95)',
                                            borderRight: `1.5px solid ${station.glow}50`,
                                            borderBottom: `1.5px solid ${station.glow}50`,
                                        }} />
                                    </div>
                                )}

                                {/* Station image — large, no container */}
                                <div style={{ position: 'relative' }}>
                                    <img src={station.img} alt={station.title} style={{
                                        width: '110px', height: '110px', objectFit: 'contain',
                                        position: 'relative', zIndex: 2,
                                        filter: pending
                                            ? `drop-shadow(0 0 10px ${station.glow}) drop-shadow(0 0 20px ${station.glow}60)`
                                            : `drop-shadow(0 2px 6px rgba(0,0,0,0.4))`,
                                        animation: pending
                                            ? `station-shake 1.5s ease-in-out infinite, float-slow 3s ease-in-out ${sIdx * 0.3}s infinite`
                                            : `float-slow 3.5s ease-in-out ${sIdx * 0.3}s infinite`,
                                        transition: 'filter 0.3s',
                                    }} />

                                    {/* Sparks (only if pending) */}
                                    {pending && Array.from({ length: 8 }).map((_, i) => {
                                        const angle = (i / 8) * 360;
                                        const rad = (angle * Math.PI) / 180;
                                        const dist = 28 + Math.random() * 16;
                                        return (
                                            <div key={i} style={{
                                                position: 'absolute',
                                                width: '3px', height: '3px',
                                                borderRadius: '50%',
                                                background: i % 2 === 0 ? '#FFC800' : station.glow,
                                                top: '50%', left: '50%',
                                                '--sx': `${Math.cos(rad) * 8}px`,
                                                '--sy': `${Math.sin(rad) * 8}px`,
                                                '--ex': `${Math.cos(rad) * dist}px`,
                                                '--ey': `${Math.sin(rad) * dist}px`,
                                                animation: `station-spark ${0.8 + Math.random() * 0.6}s ease-out ${i * 0.15}s infinite`,
                                                zIndex: 1,
                                            }} />
                                        );
                                    })}

                                    {/* Smoke wisps (only if pending) */}
                                    {pending && Array.from({ length: 3 }).map((_, i) => (
                                        <div key={`smoke-${i}`} style={{
                                            position: 'absolute',
                                            top: '0px',
                                            left: `${25 + i * 18}%`,
                                            width: '12px', height: '12px',
                                            borderRadius: '50%',
                                            background: 'rgba(200,200,200,0.4)',
                                            filter: 'blur(3px)',
                                            animation: `station-smoke ${1.5 + i * 0.4}s ease-out ${i * 0.5}s infinite`,
                                            zIndex: 1,
                                            pointerEvents: 'none',
                                        }} />
                                    ))}
                                </div>

                                {/* Name label */}
                                <span style={{
                                    fontSize: '10px', fontWeight: 800,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontFamily: SF,
                                    textAlign: 'center',
                                }}>
                                    {station.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Safe area bottom spacer */}
            <div style={{ height: 'env(safe-area-inset-bottom, 0px)', flexShrink: 0 }} />
        </div>
    );
};

export default UniverseMapScreen;
