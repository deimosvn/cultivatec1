// ==========================================================
// ANIMATED BLACK HOLE – Pure CSS/SVG space portal
// ==========================================================
// Replaces agujeronegro.png with a fully animated black hole.
// Accepts `color` (trail/accent) and `glowColor` (rgba glow).
// Size controlled via `size` prop (px).

import React from 'react';

const AnimatedBlackHole = ({ 
    color = '#A855F7', 
    glowColor = 'rgba(168,85,247,0.5)', 
    size = 128,
    className = '',
    style = {},
    spinning = true,
}) => {
    const r = size / 2;
    const diskR = r * 0.92;
    const coreR = r * 0.38;
    const ringCount = 4;

    return (
        <div
            className={`relative ${className}`}
            style={{ width: size, height: size, ...style }}
        >
            {/* Outer ambient glow */}
            <div className="absolute inset-[-30%] rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
                    filter: 'blur(18px)',
                    animation: 'bh-pulse 4s ease-in-out infinite',
                }}/>

            {/* Accretion disk rings */}
            {Array.from({ length: ringCount }, (_, i) => {
                const scale = 1 - i * 0.12;
                const opacity = 0.55 - i * 0.1;
                const duration = 6 + i * 3;
                const dir = i % 2 === 0 ? 'normal' : 'reverse';
                return (
                    <div key={`ring-${i}`}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            border: `${1.5 + (ringCount - i) * 0.5}px solid ${color}`,
                            opacity,
                            transform: `scale(${scale}) rotateX(70deg)`,
                            animation: spinning ? `bh-spin ${duration}s linear infinite ${dir}` : 'none',
                            boxShadow: `0 0 ${6 + i * 3}px ${color}, inset 0 0 ${4 + i * 2}px ${color}40`,
                        }}/>
                );
            })}

            {/* Accretion disk elliptical glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${color}00, ${color}55, ${color}00, ${color}33, ${color}00)`,
                    transform: 'rotateX(70deg)',
                    opacity: 0.5,
                    animation: spinning ? 'bh-spin 10s linear infinite' : 'none',
                    filter: 'blur(3px)',
                }}/>

            {/* Event horizon (dark core) */}
            <div className="absolute rounded-full"
                style={{
                    width: coreR * 2,
                    height: coreR * 2,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, #000000 40%, #05001580 70%, transparent 100%)`,
                    boxShadow: `0 0 ${size * 0.15}px ${size * 0.05}px rgba(0,0,0,0.9), 0 0 ${size * 0.3}px ${color}30`,
                    zIndex: 5,
                }}/>

            {/* Photon ring (bright inner edge) */}
            <div className="absolute rounded-full pointer-events-none"
                style={{
                    width: coreR * 2.3,
                    height: coreR * 2.3,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: `1.5px solid ${color}`,
                    boxShadow: `0 0 12px ${color}, 0 0 24px ${color}60, inset 0 0 8px ${color}40`,
                    opacity: 0.8,
                    zIndex: 6,
                    animation: 'bh-pulse 3s ease-in-out infinite 0.5s',
                }}/>

            {/* Gravitational lensing arcs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${size} ${size}`}
                style={{ zIndex: 4, animation: spinning ? 'bh-spin 20s linear infinite reverse' : 'none' }}>
                <defs>
                    <linearGradient id={`lensGrad-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0"/>
                        <stop offset="50%" stopColor={color} stopOpacity="0.35"/>
                        <stop offset="100%" stopColor={color} stopOpacity="0"/>
                    </linearGradient>
                </defs>
                {/* Top arc */}
                <ellipse cx={r} cy={r} rx={diskR * 0.85} ry={diskR * 0.35}
                    fill="none" stroke={`url(#lensGrad-${color.replace('#','')})`} strokeWidth="1.2"
                    opacity="0.5"/>
                {/* Bottom arc (slightly shifted) */}
                <ellipse cx={r} cy={r} rx={diskR * 0.75} ry={diskR * 0.28}
                    fill="none" stroke={`url(#lensGrad-${color.replace('#','')})`} strokeWidth="0.8"
                    opacity="0.3" transform={`rotate(30 ${r} ${r})`}/>
            </svg>

            {/* Sucking-in particles spiraling toward center */}
            {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * 360;
                const dist = 35 + (i % 3) * 10;
                const pxSize = 2 + (i % 3);
                const dur = 2 + (i % 4) * 0.6;
                return (
                    <div key={`p-${i}`}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: pxSize,
                            height: pxSize,
                            background: color,
                            boxShadow: `0 0 4px ${color}`,
                            top: '50%',
                            left: '50%',
                            zIndex: 3,
                            opacity: 0.6,
                            animation: `bh-spiral ${dur}s linear ${i * 0.3}s infinite`,
                            '--bh-start-angle': `${angle}deg`,
                            '--bh-start-dist': `${dist}%`,
                        }}/>
                );
            })}

            {/* Inline keyframes */}
            <style>{`
                @keyframes bh-spin {
                    from { transform: rotateX(70deg) rotate(0deg); }
                    to   { transform: rotateX(70deg) rotate(360deg); }
                }
                @keyframes bh-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50%      { opacity: 1;   transform: scale(1.08); }
                }
                @keyframes bh-spiral {
                    0% {
                        transform: translate(-50%,-50%) rotate(var(--bh-start-angle)) translateX(var(--bh-start-dist));
                        opacity: 0.7;
                    }
                    80% {
                        transform: translate(-50%,-50%) rotate(calc(var(--bh-start-angle) + 540deg)) translateX(5%);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translate(-50%,-50%) rotate(calc(var(--bh-start-angle) + 720deg)) translateX(0%);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default AnimatedBlackHole;
