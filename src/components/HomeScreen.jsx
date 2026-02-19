import React, { useMemo, useEffect, useRef } from 'react';
import { Rocket, Wrench, Zap, Star, GraduationCap, Settings, Award, Users } from 'lucide-react';

/* ───────────────────────────────────────────────────
   HomeScreen — Simple launcher with animated stars,
   logo, and two main action buttons.
   ─────────────────────────────────────────────────── */

const PF = '"Press Start 2P", monospace';
const STAR_COUNT = 90;

const HomeScreen = ({
    onGoStation,
    onGoGarage,
    firebaseProfile,
    userProfile,
    userStats,
    onShowSettings,
    onShowLicenses,
    onJoinClass,
    onEditRobot,
    RobotMini,
    isAdminEmail,
    calculateLevel,
}) => {
    const canvasRef = useRef(null);

    /* ── Animated starfield on <canvas> ── */
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        let raf;
        let w, h;

        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.6 + 0.4,
            speed: Math.random() * 0.00018 + 0.00005,
            alpha: Math.random() * 0.6 + 0.4,
            twinkleSpeed: Math.random() * 0.012 + 0.005,
            twinkleOffset: Math.random() * Math.PI * 2,
        }));

        const resize = () => {
            w = cvs.clientWidth;
            h = cvs.clientHeight;
            cvs.width = w * devicePixelRatio;
            cvs.height = h * devicePixelRatio;
            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        };

        const draw = (t) => {
            ctx.clearRect(0, 0, w, h);
            for (const s of stars) {
                s.y -= s.speed;
                if (s.y < -0.01) { s.y = 1.01; s.x = Math.random(); }
                const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
                const a = s.alpha * twinkle;
                ctx.beginPath();
                ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200,220,255,${a.toFixed(2)})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        raf = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    const levelInfo = calculateLevel
        ? calculateLevel(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0)
        : { level: 1, title: 'Novato', progress: 0 };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, #0f2240 0%, #1a3a6a 40%, #1e4a7a 70%, #0f2240 100%)',
            overflow: 'hidden',
            fontFamily: '"Press Start 2P", monospace',
            paddingTop: 'env(safe-area-inset-top, 0px)',
        }}>
            {/* Star canvas */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

            {/* Subtle radial glow */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(59,130,246,0.12) 0%, transparent 70%)',
            }} />

            {/* ═══ TOP HUD BAR ═══ */}
            <div style={{
                position: 'relative', zIndex: 10,
                padding: '6px 8px 5px',
                background: 'linear-gradient(180deg, rgba(15,26,50,0.85) 0%, rgba(10,22,40,0.92) 100%)',
                borderBottom: '2px solid rgba(59,130,246,0.25)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    maxWidth: '480px', margin: '0 auto', gap: '6px',
                }}>
                    {/* Left: Avatar + Name + Level */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                        {userProfile && RobotMini && (
                            <button onClick={onEditRobot} style={{
                                background: 'linear-gradient(180deg, #1e3a5f 0%, #162d4a 100%)',
                                border: '2px solid #3b82f6',
                                borderRadius: 0, padding: '2px', cursor: 'pointer', flexShrink: 0,
                                boxShadow: '0 0 8px rgba(59,130,246,0.2), inset 0 0 0 1px #0a1628',
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{ fontSize: '5px', fontWeight: 900, color: '#22c55e', fontFamily: PF }}>
                                    NV.{levelInfo.level}
                                </span>
                                <div style={{
                                    flex: 1, maxWidth: '60px', height: '4px',
                                    background: '#0a1628', border: '1px solid #1e3a5f', overflow: 'hidden',
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
                    {/* Right: Stats + Settings */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: 'rgba(15,26,50,0.7)', border: '2px solid rgba(59,130,246,0.3)',
                            padding: '2px 5px',
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                        }}>
                            <Zap size={8} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 2px #fbbf2460)' }} />
                            <span style={{ fontSize: '6px', fontWeight: 900, color: '#fbbf24', fontFamily: PF, textShadow: '0 0 4px #fbbf2440' }}>
                                {firebaseProfile?.currentStreak || 0}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '2px',
                            background: 'rgba(15,26,50,0.7)', border: '2px solid rgba(59,130,246,0.3)',
                            padding: '2px 5px',
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                        }}>
                            <Star size={8} style={{ color: '#facc15', filter: 'drop-shadow(0 0 2px #facc1560)' }} />
                            <span style={{ fontSize: '6px', fontWeight: 900, color: '#facc15', fontFamily: PF, textShadow: '0 0 4px #facc1540' }}>
                                {(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0).toLocaleString()}
                            </span>
                        </div>
                        {onShowLicenses && (
                            <button onClick={onShowLicenses} style={{
                                padding: '3px', background: 'rgba(15,26,50,0.7)',
                                border: '2px solid rgba(59,130,246,0.3)', cursor: 'pointer',
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                            }}>
                                <GraduationCap size={10} style={{ color: '#94a3b8' }} />
                            </button>
                        )}
                        {onShowSettings && (
                            <button onClick={onShowSettings} style={{
                                padding: '3px', background: 'rgba(15,26,50,0.7)',
                                border: '2px solid rgba(59,130,246,0.3)', cursor: 'pointer',
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                            }}>
                                <Settings size={9} style={{ color: '#94a3b8' }} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{
                position: 'relative', zIndex: 2,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                flex: 1,
                gap: '6px',
                padding: '0px 24px', width: '100%', maxWidth: '360px',
                margin: '0 auto',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '4px',
                    animation: 'homeLogoFloat 4s ease-in-out infinite',
                    flexShrink: 1,
                    minHeight: 0,
                }}>
                    <img
                        src="/logo.png"
                        alt="CultivaTec"
                        style={{
                            width: 'min(320px, 75vw)', height: 'min(320px, 75vw)',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 32px rgba(59,130,246,0.45))',
                            imageRendering: 'auto',
                            flexShrink: 1,
                        }}
                    />
                    <p style={{
                        fontSize: '7px', color: 'rgba(148,163,184,0.7)',
                        letterSpacing: '0.14em', margin: 0, textAlign: 'center',
                        marginTop: '-10px',
                    }}>
                        PLATAFORMA DE ROBÓTICA EDUCATIVA
                    </p>
                    <p style={{
                        fontSize: '6px', color: 'rgba(148,163,184,0.5)',
                        letterSpacing: '0.12em', margin: 0, textAlign: 'center',
                        marginTop: '1px',
                    }}>
                        CULTIVANDO LA CULTURA STEM
                    </p>
                </div>

                {/* Buttons — pixel HUD style */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    gap: '8px', width: '100%',
                    marginTop: '8px',
                }}>
                    {/* Estación de Control */}
                    <button onClick={onGoStation} className="pixel-nav-btn" style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        width: '100%', padding: '10px 12px',
                        background: 'white',
                        border: '2px solid #CBD5E1',
                        borderRadius: '8px',
                        color: '#334155', fontSize: '8px', fontWeight: 900,
                        fontFamily: '"Press Start 2P", monospace',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 3px 0 0 #94A3B8, 0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.06s step-end',
                        textShadow: '0 1px 0 rgba(0,0,0,0.06)',
                        WebkitTapHighlightColor: 'transparent',
                        imageRendering: 'pixelated',
                    }}
                    onPointerDown={e => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 0px 0 0 #94A3B8, 0 2px 6px rgba(0,0,0,0.2)'; }}
                    onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                        <Rocket size={14} style={{ flexShrink: 0 }} />
                        <span>ESTACIÓN DE CONTROL</span>
                    </button>

                    {/* Garage */}
                    <button onClick={onGoGarage} className="pixel-nav-btn" style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        width: '100%', padding: '10px 12px',
                        background: 'white',
                        border: '2px solid #CBD5E1',
                        borderRadius: '8px',
                        color: '#334155', fontSize: '8px', fontWeight: 900,
                        fontFamily: '"Press Start 2P", monospace',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 3px 0 0 #94A3B8, 0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.06s step-end',
                        textShadow: '0 1px 0 rgba(0,0,0,0.06)',
                        WebkitTapHighlightColor: 'transparent',
                        imageRendering: 'pixelated',
                    }}
                    onPointerDown={e => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 0px 0 0 #94A3B8, 0 2px 6px rgba(0,0,0,0.2)'; }}
                    onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                        <Wrench size={14} style={{ flexShrink: 0 }} />
                        <span>GARAGE</span>
                    </button>

                    {/* Certificaciones */}
                    <button onClick={onShowLicenses} className="pixel-nav-btn" style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        width: '100%', padding: '10px 12px',
                        background: 'white',
                        border: '2px solid #CBD5E1',
                        borderRadius: '8px',
                        color: '#334155', fontSize: '8px', fontWeight: 900,
                        fontFamily: '"Press Start 2P", monospace',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 3px 0 0 #94A3B8, 0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.06s step-end',
                        textShadow: '0 1px 0 rgba(0,0,0,0.06)',
                        WebkitTapHighlightColor: 'transparent',
                        imageRendering: 'pixelated',
                    }}
                    onPointerDown={e => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 0px 0 0 #94A3B8, 0 2px 6px rgba(0,0,0,0.2)'; }}
                    onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                        <Award size={14} style={{ flexShrink: 0 }} />
                        <span>CERTIFICACIONES</span>
                    </button>

                    {/* Unirse a Clase */}
                    <button onClick={onJoinClass} className="pixel-nav-btn" style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        width: '100%', padding: '10px 12px',
                        background: 'white',
                        border: '2px solid #CBD5E1',
                        borderRadius: '8px',
                        color: '#334155', fontSize: '8px', fontWeight: 900,
                        fontFamily: '"Press Start 2P", monospace',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 3px 0 0 #94A3B8, 0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.06s step-end',
                        textShadow: '0 1px 0 rgba(0,0,0,0.06)',
                        WebkitTapHighlightColor: 'transparent',
                        imageRendering: 'pixelated',
                    }}
                    onPointerDown={e => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 0px 0 0 #94A3B8, 0 2px 6px rgba(0,0,0,0.2)'; }}
                    onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                        <Users size={14} style={{ flexShrink: 0 }} />
                        <span>UNIRSE A CLASE</span>
                    </button>
                </div>

                {/* Version tag */}
                <span style={{
                    fontSize: '5px', color: 'rgba(148,163,184,0.35)',
                    letterSpacing: '0.1em', marginTop: '8px',
                }}>
                    v2.0 — CULTIVATEC PLATFORM
                </span>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes homeLogoFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
};

export default HomeScreen;
