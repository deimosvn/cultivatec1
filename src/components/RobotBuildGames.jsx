import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Star, Zap, Check, X } from 'lucide-react';

/* ================================================================
   ROBOT-SPECIFIC BUILD MINI-GAMES
   Each robot type gets 3 unique interactive challenges
   ================================================================ */

// ---- Shared UI Components ----
const GameHeader = ({ title, subtitle, icon, color, onBack, stars, maxStars = 3 }) => (
  <div className={`bg-gradient-to-r ${color} px-5 pt-5 pb-6 border-b-4 border-black/20`}>
    <button onClick={onBack} className="text-white/70 hover:text-white mb-2 flex items-center text-xs font-black active:scale-95 transition">
      <ArrowLeft size={16} className="mr-1" /> Volver
    </button>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10">
        {icon}
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-black text-white leading-tight">{title}</h2>
        <p className="text-xs text-white/70 font-bold">{subtitle}</p>
      </div>
      {stars !== undefined && (
        <div className="flex gap-0.5">
          {Array.from({ length: maxStars }).map((_, i) => (
            <span key={i} className={`text-lg ${i < stars ? 'opacity-100' : 'opacity-30'}`}>⭐</span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const GameComplete = ({ title, score, maxScore, stars, xp, onReplay, onBack, color }) => (
  <div className="min-h-full flex flex-col items-center justify-center p-6 animate-fade-in bg-gradient-to-b from-[#F7F7F7] to-white">
    <div className="text-center max-w-sm">
      <div className="text-6xl mb-4 animate-bounce-in">🏆</div>
      <h1 className="text-2xl font-black text-[#3C3C3C] mb-1">{title}</h1>
      <p className="text-sm text-[#777] font-bold mb-5">¡Mini-juego completado!</p>
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`text-3xl ${i < stars ? 'animate-bounce' : 'opacity-20'}`} style={{ animationDelay: `${i * 150}ms` }}>⭐</span>
        ))}
      </div>
      <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5 mb-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-[#777]">Puntuación</span>
          <span className="text-lg font-black text-[#3C3C3C]">{score}/{maxScore}</span>
        </div>
        <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#58CC02] to-[#46A302]"
            style={{ width: `${(score / maxScore) * 100}%` }} />
        </div>
        <div className="flex items-center justify-center gap-2 bg-[#D7FFB8] text-[#58CC02] px-4 py-2 rounded-xl">
          <Zap size={16} />
          <span className="font-black">+{xp} XP</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onReplay} className="flex-1 py-3.5 bg-white border-2 border-[#E5E5E5] text-[#3C3C3C] rounded-xl font-black text-sm active:scale-95 transition flex items-center justify-center gap-1.5">
          <RotateCcw size={16} /> Repetir
        </button>
        <button onClick={onBack} className={`flex-1 py-3.5 bg-gradient-to-r ${color} text-white rounded-xl font-black text-sm border-b-4 border-black/20 active:scale-95 transition`}>
          ¡Continuar! 🚀
        </button>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ current, total, color = '#58CC02' }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-[#E5E5E5]">
    <div className="flex-grow h-2.5 bg-[#E5E5E5] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(current / total) * 100}%`, backgroundColor: color }} />
    </div>
    <span className="text-[10px] font-black" style={{ color }}>{current}/{total}</span>
  </div>
);

/* ================================================================
   🤼 SUMO ROBOT GAMES
   ================================================================ */

// Game 1: Circuit Wiring Challenge
const SumoWiringGame = ({ onComplete, onBack }) => {
  const CONNECTIONS = [
    { id: 'motor_a_pos', from: 'Motor A (+)', to: 'OUT1', fromColor: '#EF4444', toColor: '#3B82F6', hint: 'El terminal positivo del motor izquierdo va a la salida 1 del driver' },
    { id: 'motor_a_neg', from: 'Motor A (−)', to: 'OUT2', fromColor: '#1F2937', toColor: '#3B82F6', hint: 'El terminal negativo del motor izquierdo va a la salida 2' },
    { id: 'motor_b_pos', from: 'Motor B (+)', to: 'OUT3', fromColor: '#EF4444', toColor: '#8B5CF6', hint: 'El motor derecho va a las salidas 3 y 4 del driver' },
    { id: 'motor_b_neg', from: 'Motor B (−)', to: 'OUT4', fromColor: '#1F2937', toColor: '#8B5CF6', hint: 'Terminal negativo del motor derecho a OUT4' },
    { id: 'ultra_trig', from: 'Trig (Ultra)', to: 'Pin 7', fromColor: '#06B6D4', toColor: '#F59E0B', hint: 'El pin TRIG del ultrasonido envía el pulso' },
    { id: 'ultra_echo', from: 'Echo (Ultra)', to: 'Pin 8', fromColor: '#06B6D4', toColor: '#F59E0B', hint: 'El pin ECHO recibe el eco de vuelta' },
    { id: 'driver_in1', from: 'IN1 (Driver)', to: 'Pin 5', fromColor: '#10B981', toColor: '#F59E0B', hint: 'Las señales de control del driver van a pines PWM del Arduino' },
    { id: 'driver_in2', from: 'IN2 (Driver)', to: 'Pin 6', fromColor: '#10B981', toColor: '#F59E0B', hint: 'IN2 del driver también necesita un pin PWM' },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const shuffledTos = useRef(
    CONNECTIONS.map(c => c.to).sort(() => Math.random() - 0.5)
  ).current;

  const current = CONNECTIONS[currentIdx];

  const handleToClick = (toLabel) => {
    if (!selectedFrom) {
      setSelectedFrom(current.from);
    }
    if (toLabel === current.to) {
      const newCompleted = [...completed, current.id];
      setCompleted(newCompleted);
      setSelectedFrom(null);
      setShowHint(false);
      if (currentIdx + 1 >= CONNECTIONS.length) {
        setGameOver(true);
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        setTimeout(() => onComplete(newCompleted.length, CONNECTIONS.length, stars), 500);
      } else {
        setCurrentIdx(currentIdx + 1);
      }
    } else {
      setMistakes(m => m + 1);
      setWrongFlash(toLabel);
      setTimeout(() => setWrongFlash(null), 600);
    }
  };

  if (gameOver) return null;

  const availableTos = shuffledTos.filter(t => !completed.map(id => CONNECTIONS.find(c => c.id === id)?.to).includes(t));

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Conexión de Circuitos" subtitle="Conecta cada cable al pin correcto" icon="🔌" color="from-red-500 to-orange-600" onBack={onBack} />
      <ProgressBar current={completed.length} total={CONNECTIONS.length} color="#EF4444" />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Current connection instruction */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-lg font-black border-b-2 border-red-700">
              {completed.length + 1}
            </div>
            <div>
              <p className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">Conecta</p>
              <p className="text-base font-black text-[#3C3C3C]">{current.from}</p>
            </div>
            <div className="flex-grow flex justify-center"><span className="text-xl">→</span></div>
            <div className="text-right">
              <p className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">A</p>
              <p className="text-base font-black text-[#60A5FA]">???</p>
            </div>
          </div>

          {showHint && (
            <div className="bg-[#FFC800]/10 border border-[#FFC800]/30 rounded-xl p-3 mt-2 animate-slide-up">
              <p className="text-xs font-semibold text-[#92400E]">💡 <b>Pista:</b> {current.hint}</p>
            </div>
          )}
        </div>

        {/* Arduino board visualization */}
        <div className="bg-[#1a1a2e] rounded-2xl border-2 border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400">ARDUINO UNO R3</span>
            </div>
            <span className="text-[9px] font-bold text-gray-500">ATmega328P</span>
          </div>
          
          {/* Pin targets */}
          <div className="grid grid-cols-2 gap-2">
            {availableTos.map(toLabel => {
              const isWrong = wrongFlash === toLabel;
              return (
                <button key={toLabel} onClick={() => handleToClick(toLabel)}
                  className={`px-3 py-3 rounded-xl text-sm font-black transition-all active:scale-95 border-2 ${
                    isWrong
                      ? 'bg-red-500/20 border-red-500 text-red-400 animate-shake'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-[#F59E0B] hover:text-[#F59E0B] hover:bg-gray-700'
                  }`}>
                  <span className="text-lg block mb-0.5">📌</span>
                  {toLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Completed connections */}
        {completed.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-[#58CC02]/30 p-3 space-y-1.5">
            <p className="text-xs font-black text-[#58CC02] mb-1">✅ Conexiones completadas</p>
            {completed.map(id => {
              const c = CONNECTIONS.find(cn => cn.id === id);
              return (
                <div key={id} className="flex items-center gap-2 text-xs font-semibold text-[#777] bg-[#D7FFB8]/30 px-3 py-1.5 rounded-lg">
                  <span style={{ color: c.fromColor }}>●</span> {c.from} <span className="text-[#AFAFAF]">→</span> {c.to} <Check size={12} className="text-[#58CC02] ml-auto" />
                </div>
              );
            })}
          </div>
        )}

        {/* Hint button */}
        {!showHint && (
          <button onClick={() => setShowHint(true)} className="w-full py-2.5 bg-[#FFC800]/10 border border-[#FFC800]/30 rounded-xl text-xs font-black text-[#92400E] active:scale-95 transition">
            💡 Necesito una pista
          </button>
        )}

        {/* Stats */}
        <div className="flex gap-3 justify-center">
          <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-black">✅ {completed.length} correctas</span>
          <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-black">❌ {mistakes} errores</span>
        </div>
      </div>
    </div>
  );
};

// Game 2: Weight Balance Challenge
const SumoBalanceGame = ({ onComplete, onBack }) => {
  const [frontBack, setFrontBack] = useState(50);
  const [leftRight, setLeftRight] = useState(50);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Ideal is 55 front (slightly front-heavy for pushing) and 50 left-right (centered)
  const idealFB = 58;
  const idealLR = 50;

  const calculateScore = () => {
    const fbErr = Math.abs(frontBack - idealFB);
    const lrErr = Math.abs(leftRight - idealLR);
    const totalErr = fbErr + lrErr;
    return Math.max(0, 100 - totalErr * 2);
  };

  const runTest = () => {
    setTesting(true);
    const score = calculateScore();
    setAttempts(a => a + 1);
    setTimeout(() => {
      setTesting(false);
      setTestResult(score);
      if (score > bestScore) setBestScore(score);
      if (score >= 85) {
        const stars = score >= 95 ? 3 : score >= 90 ? 2 : 1;
        setTimeout(() => onComplete(score, 100, stars), 1500);
      }
    }, 2000);
  };

  const getBalanceEmoji = () => {
    const score = calculateScore();
    if (score >= 90) return '😎';
    if (score >= 70) return '🙂';
    if (score >= 50) return '😐';
    return '😰';
  };

  const getCGPosition = () => ({
    x: leftRight,
    y: 100 - frontBack,
  });

  const cg = getCGPosition();

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Centro de Gravedad" subtitle="Balancea el peso para máxima estabilidad" icon="⚖️" color="from-red-500 to-orange-600" onBack={onBack} />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Balance visualization */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-[#3C3C3C]">Vista Superior del Robot</h3>
            <span className="text-2xl">{getBalanceEmoji()}</span>
          </div>
          <div className="relative w-full bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300" style={{ aspectRatio: '1' }}>
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <line x1="50" y1="0" x2="50" y2="100" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#D1D5DB" strokeWidth="0.5" strokeDasharray="2 2" />
              {/* Target zone */}
              <circle cx={idealLR} cy={100 - idealFB} r="8" fill="none" stroke="#58CC02" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              <circle cx={idealLR} cy={100 - idealFB} r="3" fill="#58CC02" opacity="0.3" />
              {/* Robot outline */}
              <rect x="15" y="15" width="70" height="70" rx="8" fill="none" stroke="#374151" strokeWidth="1.5" />
              {/* Wheels */}
              <rect x="8" y="25" width="8" height="20" rx="3" fill="#374151" />
              <rect x="84" y="25" width="8" height="20" rx="3" fill="#374151" />
              <rect x="8" y="55" width="8" height="20" rx="3" fill="#374151" />
              <rect x="84" y="55" width="8" height="20" rx="3" fill="#374151" />
              {/* CG point */}
              <circle cx={cg.x} cy={cg.y} r="5" fill="#EF4444" stroke="white" strokeWidth="2">
                <animate attributeName="r" values="5;6;5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x={cg.x} y={cg.y + 1} textAnchor="middle" fontSize="4" fill="white" fontWeight="bold">CG</text>
              {/* Labels */}
              <text x="50" y="8" textAnchor="middle" fontSize="4" fill="#9CA3AF" fontWeight="bold">FRENTE</text>
              <text x="50" y="98" textAnchor="middle" fontSize="4" fill="#9CA3AF" fontWeight="bold">ATRÁS</text>
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-black text-[#3C3C3C]">⬆️ Frente / Atrás ⬇️</span>
              <span className="text-xs font-black text-[#EF4444]">{frontBack}%</span>
            </div>
            <input type="range" min="20" max="80" value={frontBack} onChange={e => setFrontBack(+e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
            <div className="flex justify-between text-[9px] text-[#AFAFAF] font-bold mt-1">
              <span>Más atrás</span><span>Equilibrado</span><span>Más al frente</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-black text-[#3C3C3C]">⬅️ Izquierda / Derecha ➡️</span>
              <span className="text-xs font-black text-[#3B82F6]">{leftRight}%</span>
            </div>
            <input type="range" min="20" max="80" value={leftRight} onChange={e => setLeftRight(+e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            <div className="flex justify-between text-[9px] text-[#AFAFAF] font-bold mt-1">
              <span>Izquierda</span><span>Centro</span><span>Derecha</span>
            </div>
          </div>
        </div>

        {/* Hint card */}
        <div className="bg-[#FFC800]/10 border border-[#FFC800]/30 rounded-2xl p-4">
          <p className="text-xs font-bold text-[#92400E]">💡 <b>Consejo de experto:</b> Un robot sumo necesita el centro de gravedad ligeramente al frente para empujar con más fuerza, pero centrado de izquierda a derecha para no volcarse.</p>
        </div>

        {/* Test result */}
        {testResult !== null && (
          <div className={`rounded-2xl p-4 border-2 animate-scale-in ${testResult >= 85 ? 'bg-[#D7FFB8] border-[#58CC02]' : testResult >= 60 ? 'bg-[#FFC800]/10 border-[#FFC800]' : 'bg-red-50 border-red-300'}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{testResult >= 85 ? '🏆' : testResult >= 60 ? '👍' : '🔧'}</span>
              <div>
                <p className="text-sm font-black" style={{ color: testResult >= 85 ? '#58CC02' : testResult >= 60 ? '#92400E' : '#EF4444' }}>
                  {testResult >= 85 ? '¡Excelente equilibrio!' : testResult >= 60 ? 'Casi perfecto...' : 'Necesita más ajuste'}
                </p>
                <p className="text-xs font-bold text-[#777]">Puntuación: {testResult}/100</p>
              </div>
            </div>
          </div>
        )}

        {/* Test button */}
        <button onClick={runTest} disabled={testing}
          className={`w-full py-3.5 rounded-xl text-sm font-black active:scale-95 transition border-b-4 ${
            testing ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-700'
          }`}>
          {testing ? (
            <span className="flex items-center justify-center gap-2"><span className="animate-spin">⚙️</span> Probando equilibrio...</span>
          ) : `🧪 Probar Equilibrio (Intento ${attempts + 1})`}
        </button>
      </div>
    </div>
  );
};

// Game 3: Push Force Challenge
const SumoPushGame = ({ onComplete, onBack }) => {
  const [phase, setPhase] = useState('ready'); // ready | charging | result
  const [power, setPower] = useState(0);
  const [targetPower, setTargetPower] = useState(0);
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState([]);
  const powerRef = useRef(null);
  const dirRef = useRef(1);

  const ROUNDS = 5;
  const TARGETS = [65, 80, 45, 90, 72];

  useEffect(() => {
    setTargetPower(TARGETS[round] || 70);
  }, [round]);

  const startCharge = () => {
    setPhase('charging');
    setPower(0);
    dirRef.current = 1;
    powerRef.current = setInterval(() => {
      setPower(p => {
        let next = p + dirRef.current * 2;
        if (next >= 100) { next = 100; dirRef.current = -1; }
        if (next <= 0) { next = 0; dirRef.current = 1; }
        return next;
      });
    }, 30);
  };

  const release = () => {
    clearInterval(powerRef.current);
    setPhase('result');
    const diff = Math.abs(power - targetPower);
    const roundScore = Math.max(0, 100 - diff * 2);
    const newScores = [...scores, roundScore];
    setScores(newScores);

    if (round + 1 >= ROUNDS) {
      const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / ROUNDS);
      const stars = avg >= 85 ? 3 : avg >= 65 ? 2 : 1;
      setTimeout(() => onComplete(avg, 100, stars), 2000);
    }
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setPhase('ready');
    setPower(0);
  };

  const latestScore = scores[scores.length - 1];
  const getPowerColor = () => {
    const diff = Math.abs(power - targetPower);
    if (diff < 5) return '#58CC02';
    if (diff < 15) return '#FFC800';
    if (diff < 25) return '#FF9600';
    return '#EF4444';
  };

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Prueba de Empuje" subtitle={`Ronda ${round + 1} de ${ROUNDS} — Alcanza la potencia objetivo`} icon="💪" color="from-red-500 to-orange-600" onBack={onBack} />
      <ProgressBar current={round + (phase === 'result' ? 1 : 0)} total={ROUNDS} color="#EF4444" />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Power meter */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-[#3C3C3C]">Medidor de Potencia</h3>
            <div className="bg-[#60A5FA]/10 px-3 py-1 rounded-full">
              <span className="text-xs font-black text-[#60A5FA]">🎯 Objetivo: {targetPower}%</span>
            </div>
          </div>

          {/* Vertical power bar */}
          <div className="relative h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 overflow-hidden mx-auto w-32">
            {/* Target zone highlight */}
            <div className="absolute w-full border-t-2 border-b-2 border-dashed border-[#60A5FA] z-10"
              style={{ bottom: `${targetPower - 5}%`, height: '10%', backgroundColor: 'rgba(206,130,255,0.1)' }} />
            <div className="absolute w-full text-center z-10"
              style={{ bottom: `${targetPower - 2}%` }}>
              <span className="text-[9px] font-black text-[#60A5FA] bg-white px-1.5 py-0.5 rounded">🎯 {targetPower}%</span>
            </div>
            {/* Power fill */}
            <div className="absolute bottom-0 w-full transition-all rounded-b-lg"
              style={{ height: `${power}%`, backgroundColor: getPowerColor(), transition: phase === 'charging' ? 'none' : 'all 0.3s' }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
            {/* Power text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-[#3C3C3C] drop-shadow-lg">{power}%</span>
            </div>
          </div>

          {/* Newton display */}
          <div className="text-center mt-3">
            <span className="text-lg font-black text-[#3C3C3C]">{(power * 0.15).toFixed(1)} N</span>
            <p className="text-[10px] text-[#AFAFAF] font-bold">Fuerza de empuje estimada</p>
          </div>
        </div>

        {/* Action button */}
        <div className="space-y-3">
          {phase === 'ready' && (
            <button onClick={startCharge}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-black text-base border-b-4 border-red-700 active:scale-95 transition animate-pulse-soft">
              👊 ¡Mantén Presionado para Cargar!
            </button>
          )}
          {phase === 'charging' && (
            <button onClick={release} onTouchEnd={release}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-black text-base border-b-4 border-orange-700 active:scale-95 transition animate-pulse">
              ✋ ¡SOLTAR para disparar!
            </button>
          )}
          {phase === 'result' && (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border-2 animate-scale-in ${latestScore >= 80 ? 'bg-[#D7FFB8] border-[#58CC02]' : latestScore >= 50 ? 'bg-[#FFC800]/10 border-[#FFC800]' : 'bg-red-50 border-red-300'}`}>
                <div className="text-center">
                  <span className="text-3xl">{latestScore >= 80 ? '🎯' : latestScore >= 50 ? '👍' : '💨'}</span>
                  <p className="text-sm font-black mt-1" style={{ color: latestScore >= 80 ? '#58CC02' : latestScore >= 50 ? '#92400E' : '#EF4444' }}>
                    {latestScore >= 80 ? '¡Golpe Perfecto!' : latestScore >= 50 ? 'Buen intento' : 'Fuera de rango'}
                  </p>
                  <p className="text-xs font-bold text-[#777]">Precisión: {latestScore}% · Diferencia: {Math.abs(power - targetPower)}%</p>
                </div>
              </div>
              {round + 1 < ROUNDS && (
                <button onClick={nextRound} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-black text-sm border-b-4 border-red-700 active:scale-95 transition">
                  Siguiente Ronda →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Round scores */}
        {scores.length > 0 && (
          <div className="flex gap-2 justify-center flex-wrap">
            {scores.map((s, i) => (
              <div key={i} className={`px-3 py-2 rounded-xl text-xs font-black ${s >= 80 ? 'bg-[#D7FFB8] text-[#58CC02]' : s >= 50 ? 'bg-[#FFC800]/10 text-[#92400E]' : 'bg-red-50 text-red-500'}`}>
                R{i + 1}: {s}%
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================================================
   〰️ LINE FOLLOWER GAMES
   ================================================================ */

// Game 1: IR Sensor Calibration
const LineCalibrationGame = ({ onComplete, onBack }) => {
  const [threshold, setThreshold] = useState(512);
  const [sensorL, setSensorL] = useState(0);
  const [sensorR, setSensorR] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [samples, setSamples] = useState([]);
  const [round, setRound] = useState(0);
  const scanRef = useRef(null);

  const TRACK_PATTERNS = [
    { name: 'Línea Recta', line: 50, width: 4 },
    { name: 'Curva Suave', line: 35, width: 5 },
    { name: 'Curva Cerrada', line: 20, width: 3 },
    { name: 'Línea Ancha', line: 60, width: 8 },
    { name: 'Línea Fina', line: 50, width: 2 },
  ];

  const currentPattern = TRACK_PATTERNS[round];

  const startScan = () => {
    setScanning(true);
    setSamples([]);
    let count = 0;
    let successes = 0;
    const totalSamples = 20;

    scanRef.current = setInterval(() => {
      const lineCenter = currentPattern.line;
      const lineHalf = currentPattern.width / 2;

      // Simulate sensor readings - left sensor at 35%, right at 65%
      const noiseL = (Math.random() - 0.5) * 200;
      const noiseR = (Math.random() - 0.5) * 200;
      const isOnLineL = Math.abs(35 - lineCenter) < lineHalf + 5;
      const isOnLineR = Math.abs(65 - lineCenter) < lineHalf + 5;
      const rawL = isOnLineL ? 800 + noiseL : 200 + noiseL;
      const rawR = isOnLineR ? 800 + noiseR : 200 + noiseR;
      const valL = Math.max(0, Math.min(1023, Math.round(rawL)));
      const valR = Math.max(0, Math.min(1023, Math.round(rawR)));

      setSensorL(valL);
      setSensorR(valR);

      const detectedL = valL > threshold;
      const detectedR = valR > threshold;
      const correctL = isOnLineL === detectedL;
      const correctR = isOnLineR === detectedR;
      if (correctL && correctR) successes++;

      setSamples(prev => [...prev, { l: valL, r: valR, ok: correctL && correctR }]);
      count++;

      if (count >= totalSamples) {
        clearInterval(scanRef.current);
        setScanning(false);
        const accuracy = Math.round((successes / totalSamples) * 100);
        
        if (round + 1 >= TRACK_PATTERNS.length) {
          const stars = accuracy >= 85 ? 3 : accuracy >= 65 ? 2 : 1;
          setTimeout(() => onComplete(accuracy, 100, stars), 1500);
        }
      }
    }, 200);
  };

  useEffect(() => {
    return () => clearInterval(scanRef.current);
  }, []);

  const nextRound = () => {
    setRound(r => r + 1);
    setSamples([]);
    setSensorL(0);
    setSensorR(0);
  };

  const lastAccuracy = samples.length > 0 ? Math.round((samples.filter(s => s.ok).length / samples.length) * 100) : 0;

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Calibración de Sensores IR" subtitle={`Patrón: ${currentPattern.name}`} icon="📊" color="from-blue-500 to-cyan-600" onBack={onBack} />
      <ProgressBar current={round} total={TRACK_PATTERNS.length} color="#3B82F6" />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Track visualization */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <h3 className="text-sm font-black text-[#3C3C3C] mb-2">🛤️ Vista de la Pista</h3>
          <div className="relative h-20 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden">
            {/* Track line */}
            <div className="absolute top-0 bottom-0 bg-[#1F2937] rounded"
              style={{ left: `${currentPattern.line - currentPattern.width / 2}%`, width: `${currentPattern.width}%` }} />
            {/* Left sensor */}
            <div className="absolute top-2 left-[33%] w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center z-10"
              style={{ backgroundColor: sensorL > threshold ? '#3B82F6' : '#F3F4F6' }}>
              <span className="text-[7px] font-black text-white">L</span>
            </div>
            {/* Right sensor */}
            <div className="absolute top-2 left-[63%] w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center z-10"
              style={{ backgroundColor: sensorR > threshold ? '#3B82F6' : '#F3F4F6' }}>
              <span className="text-[7px] font-black text-white">R</span>
            </div>
            {/* Robot body */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[36%] h-14 border-2 border-blue-400 rounded-lg bg-blue-50/50 z-5" />
          </div>
        </div>

        {/* Sensor readings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border-2 border-[#E5E5E5] p-3 text-center">
            <p className="text-[10px] font-black text-[#AFAFAF]">SENSOR IZQ</p>
            <p className={`text-2xl font-black ${sensorL > threshold ? 'text-[#3B82F6]' : 'text-[#AFAFAF]'}`}>{sensorL}</p>
            <p className="text-[9px] font-bold" style={{ color: sensorL > threshold ? '#3B82F6' : '#AFAFAF' }}>
              {sensorL > threshold ? '■ LÍNEA' : '□ PISO'}
            </p>
          </div>
          <div className="bg-white rounded-xl border-2 border-[#E5E5E5] p-3 text-center">
            <p className="text-[10px] font-black text-[#AFAFAF]">SENSOR DER</p>
            <p className={`text-2xl font-black ${sensorR > threshold ? 'text-[#3B82F6]' : 'text-[#AFAFAF]'}`}>{sensorR}</p>
            <p className="text-[9px] font-bold" style={{ color: sensorR > threshold ? '#3B82F6' : '#AFAFAF' }}>
              {sensorR > threshold ? '■ LÍNEA' : '□ PISO'}
            </p>
          </div>
        </div>

        {/* Threshold control */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-black text-[#3C3C3C]">🎚️ Umbral de Detección</span>
            <span className="text-sm font-black text-[#3B82F6]">{threshold}</span>
          </div>
          <input type="range" min="100" max="900" value={threshold} onChange={e => setThreshold(+e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          <div className="flex justify-between text-[9px] text-[#AFAFAF] font-bold mt-1">
            <span>100 (Muy sensible)</span><span>512</span><span>900 (Poco sensible)</span>
          </div>
          <p className="text-[10px] text-[#777] font-semibold mt-2">
            Si el valor leído &gt; {threshold} → Línea detectada. Si no → Piso.
          </p>
        </div>

        {/* Signal visualization */}
        {samples.length > 0 && (
          <div className="bg-[#1a1a2e] rounded-2xl border-2 border-gray-700 p-3">
            <p className="text-[10px] font-black text-gray-400 mb-2">📈 Historial de Lecturas</p>
            <div className="flex items-end gap-[2px] h-16">
              {samples.slice(-30).map((s, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
                  <div className="rounded-t" style={{ height: `${(s.l / 1023) * 100}%`, backgroundColor: s.ok ? '#3B82F6' : '#EF4444', opacity: 0.7 }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-bold text-gray-500">Precisión: {lastAccuracy}%</span>
              <span className="text-[9px] font-bold text-gray-500">{samples.length} muestras</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2">
          <button onClick={startScan} disabled={scanning}
            className={`w-full py-3.5 rounded-xl text-sm font-black active:scale-95 transition border-b-4 ${
              scanning ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-700'
            }`}>
            {scanning ? '📡 Escaneando...' : `📡 Iniciar Escaneo (Patrón ${round + 1}/${TRACK_PATTERNS.length})`}
          </button>
          {!scanning && samples.length > 0 && round + 1 < TRACK_PATTERNS.length && lastAccuracy >= 70 && (
            <button onClick={nextRound} className="w-full py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl text-sm font-black active:scale-95 transition">
              Siguiente Patrón →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Game 2: PID Tuning
const LinePIDGame = ({ onComplete, onBack }) => {
  const [kp, setKp] = useState(1.0);
  const [ki, setKi] = useState(0.0);
  const [kd, setKd] = useState(0.0);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [path, setPath] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const simulate = () => {
    setSimulating(true);
    setPath([]);
    const newPath = [];
    let pos = 50; // Position on track (center = 50)
    let error = 0;
    let lastError = 0;
    let integral = 0;
    const trackLine = 50;
    let totalError = 0;
    let steps = 40;

    for (let i = 0; i < steps; i++) {
      // Add curve after step 15
      const target = i > 15 && i < 25 ? 35 : i >= 25 ? 60 : trackLine;
      error = target - pos;
      integral += error;
      const derivative = error - lastError;
      const correction = kp * error * 0.1 + ki * integral * 0.001 + kd * derivative * 0.5;
      pos += correction + (Math.random() - 0.5) * 2;
      pos = Math.max(10, Math.min(90, pos));
      totalError += Math.abs(target - pos);
      lastError = error;
      newPath.push({ pos, target, step: i });
    }

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx >= newPath.length) {
        clearInterval(interval);
        setSimulating(false);
        const avgError = totalError / steps;
        const score = Math.max(0, Math.round(100 - avgError * 3));
        setSimResult(score);
        setAttempts(a => a + 1);
        if (score >= 75) {
          const stars = score >= 90 ? 3 : score >= 80 ? 2 : 1;
          setTimeout(() => onComplete(score, 100, stars), 1500);
        }
        return;
      }
      setPath(prev => [...prev, newPath[stepIdx]]);
      stepIdx++;
    }, 100);
  };

  const reset = () => {
    setPath([]);
    setSimResult(null);
  };

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Ajuste PID" subtitle="Encuentra los valores perfectos de control" icon="🎛️" color="from-blue-500 to-cyan-600" onBack={onBack} />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Track simulation */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <h3 className="text-sm font-black text-[#3C3C3C] mb-2">🏁 Recorrido de Prueba</h3>
          <div className="relative h-32 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Target line (track) */}
              <polyline
                points={Array.from({ length: 40 }, (_, i) => {
                  const t = i > 15 && i < 25 ? 35 : i >= 25 ? 60 : 50;
                  return `${(i / 39) * 100},${100 - t}`;
                }).join(' ')}
                fill="none" stroke="#1F2937" strokeWidth="3" opacity="0.3"
              />
              {/* Robot path */}
              {path.length > 1 && (
                <polyline
                  points={path.map((p, i) => `${(i / 39) * 100},${100 - p.pos}`).join(' ')}
                  fill="none" stroke="#3B82F6" strokeWidth="1.5"
                />
              )}
              {/* Robot position */}
              {path.length > 0 && (
                <circle
                  cx={(path.length - 1) / 39 * 100}
                  cy={100 - path[path.length - 1].pos}
                  r="3" fill="#3B82F6" stroke="white" strokeWidth="1"
                />
              )}
            </svg>
            {/* Labels */}
            <div className="absolute top-1 left-2 text-[8px] font-bold text-gray-400">Pista (línea oscura) vs Robot (azul)</div>
          </div>
        </div>

        {/* PID Controls */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 space-y-4">
          <h3 className="text-sm font-black text-[#3C3C3C]">⚙️ Parámetros PID</h3>
          
          {[
            { label: 'P (Proporcional)', value: kp, set: setKp, max: 5, step: 0.1, color: '#3B82F6', desc: 'Reacción al error actual — más alto = gira más rápido' },
            { label: 'I (Integral)', value: ki, set: setKi, max: 2, step: 0.1, color: '#10B981', desc: 'Corrige errores acumulados — evita desviarse a largo plazo' },
            { label: 'D (Derivativo)', value: kd, set: setKd, max: 3, step: 0.1, color: '#60A5FA', desc: 'Anticipa cambios — suaviza la respuesta' },
          ].map(param => (
            <div key={param.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-black text-[#3C3C3C]">{param.label}</span>
                <span className="text-sm font-black" style={{ color: param.color }}>{param.value.toFixed(1)}</span>
              </div>
              <input type="range" min="0" max={param.max} step={param.step} value={param.value}
                onChange={e => param.set(+e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: param.color }} />
              <p className="text-[9px] text-[#AFAFAF] font-semibold mt-0.5">{param.desc}</p>
            </div>
          ))}
        </div>

        {/* Result */}
        {simResult !== null && (
          <div className={`p-4 rounded-2xl border-2 animate-scale-in ${simResult >= 75 ? 'bg-[#D7FFB8] border-[#58CC02]' : simResult >= 50 ? 'bg-[#FFC800]/10 border-[#FFC800]' : 'bg-red-50 border-red-300'}`}>
            <div className="text-center">
              <span className="text-3xl">{simResult >= 85 ? '🏆' : simResult >= 65 ? '👍' : '🔧'}</span>
              <p className="text-sm font-black mt-1" style={{ color: simResult >= 75 ? '#58CC02' : simResult >= 50 ? '#92400E' : '#EF4444' }}>
                {simResult >= 85 ? '¡Control Perfecto!' : simResult >= 65 ? '¡Buen seguimiento!' : 'El robot se desvía mucho'}
              </p>
              <p className="text-xs text-[#777] font-bold">Precisión: {simResult}%</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {simResult !== null && (
            <button onClick={reset} className="flex-1 py-3 bg-white border-2 border-[#E5E5E5] text-[#777] rounded-xl text-xs font-black active:scale-95 transition flex items-center justify-center gap-1">
              <RotateCcw size={14} /> Reset
            </button>
          )}
          <button onClick={simulate} disabled={simulating}
            className={`flex-[2] py-3.5 rounded-xl text-sm font-black active:scale-95 transition border-b-4 ${
              simulating ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-700'
            }`}>
            {simulating ? '🏎️ Simulando...' : `▶️ Simular Recorrido (Intento ${attempts + 1})`}
          </button>
        </div>

        {/* Hint */}
        <div className="bg-[#1CB0F6]/10 border border-[#1CB0F6]/30 rounded-2xl p-4">
          <p className="text-xs font-bold text-[#0C4A6E]">💡 <b>Tip:</b> Un buen punto de partida es P=2.0, I=0.3, D=1.0. Si el robot oscila mucho, baja P. Si se desvía lentamente, sube I. Si reacciona muy brusco, sube D.</p>
        </div>
      </div>
    </div>
  );
};

// Game 3: Speed vs Accuracy Optimizer
const LineSpeedGame = ({ onComplete, onBack }) => {
  const [speed, setSpeed] = useState(150);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);
  const [animPos, setAnimPos] = useState(0);
  const animRef = useRef(null);

  const runTest = () => {
    setTesting(true);
    setAnimPos(0);
    
    // Higher speed = more errors, less time
    const baseTime = 10 - (speed / 255) * 6; // seconds
    const accuracy = Math.max(20, 100 - ((speed - 100) / 155) * 70 + (Math.random() - 0.5) * 15);
    const time = baseTime + (Math.random() - 0.5) * 1.5;
    
    let pos = 0;
    animRef.current = setInterval(() => {
      pos += 2;
      setAnimPos(Math.min(pos, 100));
      if (pos >= 100) {
        clearInterval(animRef.current);
        setTesting(false);
        const score = Math.round(accuracy * 0.6 + (1 / time) * 40 * 10);
        const result = { speed, accuracy: Math.round(accuracy), time: time.toFixed(1), score: Math.min(100, score) };
        const newResults = [...results, result];
        setResults(newResults);

        if (newResults.length >= 3) {
          const best = Math.max(...newResults.map(r => r.score));
          const stars = best >= 80 ? 3 : best >= 60 ? 2 : 1;
          setTimeout(() => onComplete(best, 100, stars), 1500);
        }
      }
    }, 40);
  };

  useEffect(() => {
    return () => clearInterval(animRef.current);
  }, []);

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Velocidad vs Precisión" subtitle="Encuentra la velocidad óptima para la pista" icon="🏎️" color="from-blue-500 to-cyan-600" onBack={onBack} />
      <ProgressBar current={results.length} total={3} color="#3B82F6" />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Track animation */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <h3 className="text-sm font-black text-[#3C3C3C] mb-2">🏁 Pista de Prueba</h3>
          <div className="relative h-16 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden">
            {/* Track */}
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-[#1F2937] -translate-y-1/2 rounded" />
            <div className="absolute top-1/2 left-[5%] w-2 h-8 bg-green-500 -translate-y-1/2 rounded" />
            <div className="absolute top-1/2 right-[5%] w-2 h-8 bg-red-500 -translate-y-1/2 rounded" />
            {/* Robot */}
            <div className="absolute top-1/2 -translate-y-1/2 w-8 h-6 bg-blue-500 rounded transition-all"
              style={{ left: `${5 + animPos * 0.85}%` }}>
              <span className="text-[10px] text-white font-black flex items-center justify-center h-full">🤖</span>
            </div>
          </div>
        </div>

        {/* Speed control */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-[#3C3C3C]">⚡ Velocidad del Motor</h3>
            <div className="bg-[#3B82F6]/10 px-3 py-1 rounded-full">
              <span className="text-sm font-black text-[#3B82F6]">{speed} PWM</span>
            </div>
          </div>
          <input type="range" min="80" max="255" value={speed} onChange={e => setSpeed(+e.target.value)}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          <div className="flex justify-between mt-2">
            <div className="text-center">
              <span className="text-lg">🐢</span>
              <p className="text-[9px] text-[#AFAFAF] font-bold">Lento y preciso</p>
            </div>
            <div className="text-center">
              <span className="text-lg">⚡</span>
              <p className="text-[9px] text-[#AFAFAF] font-bold">Equilibrado</p>
            </div>
            <div className="text-center">
              <span className="text-lg">🚀</span>
              <p className="text-[9px] text-[#AFAFAF] font-bold">Rápido pero loco</p>
            </div>
          </div>
          {/* Speedometer */}
          <div className="mt-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full relative">
            <div className="absolute w-3 h-3 bg-white border-2 border-[#3C3C3C] rounded-full top-1/2 -translate-y-1/2"
              style={{ left: `${((speed - 80) / 175) * 100}%` }} />
          </div>
        </div>

        {/* Results table */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden">
            <div className="bg-[#3B82F6] px-4 py-2.5">
              <h3 className="text-xs font-black text-white">📋 Resultados</h3>
            </div>
            <div className="p-3 space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-sm font-black text-[#3C3C3C] w-6">#{i + 1}</span>
                  <div className="flex-grow grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[9px] text-[#AFAFAF] font-bold">Velocidad</p>
                      <p className="text-xs font-black text-[#3C3C3C]">{r.speed}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#AFAFAF] font-bold">Precisión</p>
                      <p className="text-xs font-black" style={{ color: r.accuracy >= 75 ? '#58CC02' : '#FF9600' }}>{r.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#AFAFAF] font-bold">Tiempo</p>
                      <p className="text-xs font-black text-[#3B82F6]">{r.time}s</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg" style={{ backgroundColor: r.score >= 70 ? '#D7FFB8' : '#FFC800/20', color: r.score >= 70 ? '#58CC02' : '#92400E' }}>{r.score}pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <button onClick={runTest} disabled={testing || results.length >= 3}
          className={`w-full py-3.5 rounded-xl text-sm font-black active:scale-95 transition border-b-4 ${
            testing || results.length >= 3 ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-700'
          }`}>
          {testing ? '🏎️ En carrera...' : results.length >= 3 ? '✅ 3 pruebas completadas' : `▶️ Probar Velocidad ${speed} PWM`}
        </button>
      </div>
    </div>
  );
};

/* ================================================================
   🐕 DOG ROBOT GAMES
   ================================================================ */

// Game 1: Servo Calibration
const DogServoGame = ({ onComplete, onBack }) => {
  const LEGS = [
    { id: 'fl', name: 'Pata Frontal Izq', ideal: 90, emoji: '🦿' },
    { id: 'fr', name: 'Pata Frontal Der', ideal: 90, emoji: '🦿' },
    { id: 'bl', name: 'Pata Trasera Izq', ideal: 75, emoji: '🦿' },
    { id: 'br', name: 'Pata Trasera Der', ideal: 75, emoji: '🦿' },
  ];

  const [angles, setAngles] = useState({ fl: 45, fr: 135, bl: 45, br: 135 });
  const [currentLeg, setCurrentLeg] = useState(0);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const setAngle = (legId, val) => {
    setAngles(prev => ({ ...prev, [legId]: val }));
  };

  const getStability = () => {
    let totalErr = 0;
    LEGS.forEach(leg => {
      totalErr += Math.abs(angles[leg.id] - leg.ideal);
    });
    return Math.max(0, 100 - totalErr);
  };

  const runTest = () => {
    setTesting(true);
    setAttempts(a => a + 1);
    setTimeout(() => {
      const stability = getStability();
      setTesting(false);
      setTestResult(stability);
      if (stability >= 80) {
        const stars = stability >= 95 ? 3 : stability >= 88 ? 2 : 1;
        setTimeout(() => onComplete(stability, 100, stars), 1500);
      }
    }, 2500);
  };

  const getDogPose = () => {
    const getH = (angle) => Math.max(10, Math.round(40 - Math.abs(angle - 82.5) * 0.5));
    return {
      fl: getH(angles.fl), fr: getH(angles.fr),
      bl: getH(angles.bl), br: getH(angles.br),
    };
  };

  const pose = getDogPose();
  const bodyTilt = (pose.fl + pose.fr) / 2 - (pose.bl + pose.br) / 2;

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Calibración de Servos" subtitle="Ajusta cada pata para que se pare correctamente" icon="🦿" color="from-amber-500 to-yellow-600" onBack={onBack} />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Dog visualization */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <h3 className="text-sm font-black text-[#3C3C3C] mb-3">🐕 Vista Lateral del Perro</h3>
          <div className="relative h-40 bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl border border-amber-200 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Ground */}
              <line x1="0" y1="90" x2="200" y2="90" stroke="#D4A574" strokeWidth="2" />
              {/* Body */}
              <ellipse cx="100" cy={45 + bodyTilt * 0.3} rx="50" ry="18" fill="#FBBF24" stroke="#D97706" strokeWidth="2"
                transform={`rotate(${bodyTilt * 0.5}, 100, 45)`} />
              {/* Head */}
              <circle cx="155" cy={35 + bodyTilt * 0.2} r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              <circle cx="160" cy={32 + bodyTilt * 0.2} r="3" fill="#1F2937" />
              <ellipse cx="163" cy={38 + bodyTilt * 0.2} rx="4" ry="2.5" fill="#D97706" />
              {/* Tail */}
              <path d={`M 52 ${40 + bodyTilt * 0.3} Q 35 ${20 + bodyTilt * 0.3} 40 ${35 + bodyTilt * 0.3}`} fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
              {/* Legs */}
              {[
                { x: 70, h: pose.fl, id: 'fl', selected: currentLeg === 0 },
                { x: 90, h: pose.fr, id: 'fr', selected: currentLeg === 1 },
                { x: 115, h: pose.bl, id: 'bl', selected: currentLeg === 2 },
                { x: 135, h: pose.br, id: 'br', selected: currentLeg === 3 },
              ].map(leg => (
                <g key={leg.id}>
                  <rect x={leg.x - 3} y={55 + bodyTilt * 0.3} width="6" height={leg.h}
                    rx="2" fill={leg.selected ? '#F59E0B' : '#FBBF24'} stroke={leg.selected ? '#B45309' : '#D97706'} strokeWidth={leg.selected ? 2 : 1} />
                  {/* Paw */}
                  <ellipse cx={leg.x} cy={55 + bodyTilt * 0.3 + leg.h + 2} rx="5" ry="3" fill={leg.selected ? '#B45309' : '#D97706'} />
                  {/* Angle indicator */}
                  <text x={leg.x} y={55 + bodyTilt * 0.3 + leg.h / 2} textAnchor="middle" fontSize="5"
                    fill={leg.selected ? '#B45309' : '#92400E'} fontWeight="bold">{angles[leg.id]}°</text>
                </g>
              ))}
              {/* Stability indicator */}
              <text x="100" y="12" textAnchor="middle" fontSize="6" fill={getStability() > 80 ? '#16A34A' : '#DC2626'} fontWeight="bold">
                Estabilidad: {getStability()}%
              </text>
            </svg>
          </div>
        </div>

        {/* Leg selector */}
        <div className="grid grid-cols-4 gap-2">
          {LEGS.map((leg, i) => (
            <button key={leg.id} onClick={() => setCurrentLeg(i)}
              className={`p-2.5 rounded-xl text-center transition active:scale-95 border-2 ${
                currentLeg === i ? 'bg-amber-100 border-amber-400 shadow-md' : 'bg-white border-[#E5E5E5]'
              }`}>
              <span className="text-lg block">{leg.emoji}</span>
              <span className="text-[9px] font-black text-[#3C3C3C]">{leg.name.split(' ').slice(-2).join(' ')}</span>
              <span className="text-[10px] font-black block mt-0.5" style={{ color: Math.abs(angles[leg.id] - leg.ideal) < 5 ? '#58CC02' : '#FF9600' }}>
                {angles[leg.id]}°
              </span>
            </button>
          ))}
        </div>

        {/* Current leg control */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-black text-[#3C3C3C]">{LEGS[currentLeg].emoji} {LEGS[currentLeg].name}</span>
            <span className="text-lg font-black text-amber-600">{angles[LEGS[currentLeg].id]}°</span>
          </div>
          <input type="range" min="0" max="180" value={angles[LEGS[currentLeg].id]}
            onChange={e => setAngle(LEGS[currentLeg].id, +e.target.value)}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
          <div className="flex justify-between text-[9px] text-[#AFAFAF] font-bold mt-1">
            <span>0° (Recogida)</span><span>90° (Recta)</span><span>180° (Extendida)</span>
          </div>
          {/* Quick presets */}
          <div className="flex gap-2 mt-3">
            {[45, 75, 90, 105, 135].map(preset => (
              <button key={preset} onClick={() => setAngle(LEGS[currentLeg].id, preset)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition active:scale-95 ${
                  angles[LEGS[currentLeg].id] === preset ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                {preset}°
              </button>
            ))}
          </div>
        </div>

        {/* Test result */}
        {testResult !== null && (
          <div className={`p-4 rounded-2xl border-2 animate-scale-in ${testResult >= 80 ? 'bg-[#D7FFB8] border-[#58CC02]' : 'bg-[#FFC800]/10 border-[#FFC800]'}`}>
            <div className="text-center">
              <span className="text-3xl">{testResult >= 90 ? '🐕' : testResult >= 70 ? '🐶' : '🐾'}</span>
              <p className="text-sm font-black mt-1" style={{ color: testResult >= 80 ? '#58CC02' : '#92400E' }}>
                {testResult >= 90 ? '¡El perro se para perfecto!' : testResult >= 70 ? 'Casi equilibrado...' : 'El perro se tambalea'}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <button onClick={runTest} disabled={testing}
          className={`w-full py-3.5 rounded-xl text-sm font-black active:scale-95 transition border-b-4 ${
            testing ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-700'
          }`}>
          {testing ? '🐕 Probando postura...' : `🧪 Probar Postura (Intento ${attempts + 1})`}
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-[#92400E]">💡 <b>Tip:</b> Las patas delanteras deben estar a ~90° para soportar la cabeza. Las traseras a ~75° le dan un ángulo de impulso para caminar.</p>
        </div>
      </div>
    </div>
  );
};

// Game 2: Walk Pattern Designer
const DogWalkGame = ({ onComplete, onBack }) => {
  const PRESETS = {
    walk: { name: 'Caminar', pattern: [['fl','br'], ['fr','bl']], speed: 500 },
    trot: { name: 'Trotar', pattern: [['fl','br'], [], ['fr','bl'], []], speed: 300 },
    gallop: { name: 'Galopar', pattern: [['fl','fr'], ['bl','br']], speed: 250 },
  };

  const [pattern, setPattern] = useState([[], [], [], []]);
  const [playing, setPlaying] = useState(false);
  const [playStep, setPlayStep] = useState(-1);
  const [score, setScore] = useState(null);
  const playRef = useRef(null);

  const LEGS = ['fl', 'fr', 'bl', 'br'];
  const LEG_LABELS = { fl: 'FI', fr: 'FD', bl: 'TI', br: 'TD' };
  const LEG_COLORS = { fl: '#3B82F6', fr: '#10B981', bl: '#F59E0B', br: '#EF4444' };

  const toggleLeg = (stepIdx, legId) => {
    setPattern(prev => {
      const updated = prev.map((step, i) => {
        if (i === stepIdx) {
          return step.includes(legId) ? step.filter(l => l !== legId) : [...step, legId];
        }
        return step;
      });
      return updated;
    });
  };

  const addStep = () => {
    if (pattern.length < 8) {
      setPattern(prev => [...prev, []]);
    }
  };

  const removeStep = (idx) => {
    if (pattern.length > 2) {
      setPattern(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const loadPreset = (key) => {
    const p = PRESETS[key];
    setPattern(p.pattern.length < 2 ? [...p.pattern, ...p.pattern] : p.pattern);
  };

  const play = () => {
    setPlaying(true);
    setPlayStep(0);
    let step = 0;
    const maxCycles = 3;
    let totalSteps = pattern.length * maxCycles;
    let currentStepCount = 0;
    playRef.current = setInterval(() => {
      setPlayStep(step % pattern.length);
      step++;
      currentStepCount++;
      if (currentStepCount >= totalSteps) {
        clearInterval(playRef.current);
        setPlaying(false);
        setPlayStep(-1);
        // Score the pattern
        const hasAlternation = pattern.some((s, i) => {
          const next = pattern[(i + 1) % pattern.length];
          return s.length > 0 && next.length > 0 && !s.some(l => next.includes(l));
        });
        const hasDiagonal = pattern.some(s => (s.includes('fl') && s.includes('br')) || (s.includes('fr') && s.includes('bl')));
        const balanced = pattern.every(s => s.length <= 2);
        let sc = 40;
        if (hasAlternation) sc += 25;
        if (hasDiagonal) sc += 25;
        if (balanced) sc += 10;
        setScore(Math.min(100, sc));
        if (sc >= 65) {
          const stars = sc >= 90 ? 3 : sc >= 75 ? 2 : 1;
          setTimeout(() => onComplete(sc, 100, stars), 1500);
        }
      }
    }, 400);
  };

  useEffect(() => {
    return () => clearInterval(playRef.current);
  }, []);

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Patrón de Marcha" subtitle="Diseña el ciclo de caminata del perro" icon="🐾" color="from-amber-500 to-yellow-600" onBack={onBack} />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Dog leg preview */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <h3 className="text-sm font-black text-[#3C3C3C] mb-2">🐕 Vista Superior</h3>
          <div className="relative w-48 h-32 mx-auto bg-amber-50 rounded-xl border border-amber-200">
            <svg className="w-full h-full" viewBox="0 0 120 80">
              {/* Body */}
              <ellipse cx="60" cy="40" rx="30" ry="16" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="92" cy="35" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
              {/* Head features */}
              <circle cx="95" cy="33" r="2" fill="#1F2937" />
              <ellipse cx="97" cy="37" rx="2.5" ry="1.5" fill="#D97706" />
              {/* Legs */}
              {[
                { id: 'fl', cx: 42, cy: 22 },
                { id: 'fr', cx: 42, cy: 58 },
                { id: 'bl', cx: 78, cy: 22 },
                { id: 'br', cx: 78, cy: 58 },
              ].map(leg => {
                const active = playStep >= 0 && pattern[playStep]?.includes(leg.id);
                return (
                  <g key={leg.id}>
                    <circle cx={leg.cx} cy={leg.cy} r={active ? 7 : 6}
                      fill={active ? LEG_COLORS[leg.id] : '#FBBF24'}
                      stroke={LEG_COLORS[leg.id]} strokeWidth="2"
                      opacity={active ? 1 : 0.4}>
                      {active && <animate attributeName="r" values="6;8;6" dur="0.4s" repeatCount="indefinite" />}
                    </circle>
                    <text x={leg.cx} y={leg.cy + 2} textAnchor="middle" fontSize="5" fill={active ? 'white' : LEG_COLORS[leg.id]} fontWeight="bold">
                      {LEG_LABELS[leg.id]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button key={key} onClick={() => loadPreset(key)}
              className="flex-1 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-black text-amber-700 active:scale-95 transition hover:bg-amber-100">
              {p.name}
            </button>
          ))}
        </div>

        {/* Timeline editor */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-[#3C3C3C]">🎵 Secuencia de Pasos</h3>
            {pattern.length < 8 && (
              <button onClick={addStep} className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 active:scale-95 transition">
                + Paso
              </button>
            )}
          </div>

          {/* Leg labels */}
          <div className="flex gap-1 mb-2 ml-8">
            {LEGS.map(l => (
              <div key={l} className="flex-1 text-center">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: LEG_COLORS[l], backgroundColor: `${LEG_COLORS[l]}15` }}>
                  {LEG_LABELS[l]}
                </span>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-1.5">
            {pattern.map((step, stepIdx) => (
              <div key={stepIdx} className={`flex items-center gap-1 transition rounded-lg p-1 ${
                playStep === stepIdx ? 'bg-amber-100 border border-amber-300' : ''
              }`}>
                <span className="text-[10px] font-black text-[#AFAFAF] w-6 text-right">{stepIdx + 1}</span>
                {LEGS.map(legId => (
                  <button key={legId} onClick={() => toggleLeg(stepIdx, legId)}
                    className={`flex-1 h-10 rounded-lg border-2 transition active:scale-95 flex items-center justify-center text-lg ${
                      step.includes(legId)
                        ? 'border-transparent shadow-md'
                        : 'border-[#E5E5E5] bg-gray-50'
                    }`}
                    style={step.includes(legId) ? { backgroundColor: `${LEG_COLORS[legId]}20`, borderColor: LEG_COLORS[legId] } : {}}>
                    {step.includes(legId) ? '🦶' : ''}
                  </button>
                ))}
                {pattern.length > 2 && (
                  <button onClick={() => removeStep(stepIdx)} className="w-6 h-6 text-[10px] text-red-400 hover:text-red-600 transition">✕</button>
                )}
              </div>
            ))}
          </div>
          <p className="text-[9px] text-[#AFAFAF] font-semibold mt-2 text-center">Toca una celda para levantar/bajar esa pata en ese paso</p>
        </div>

        {/* Score */}
        {score !== null && (
          <div className={`p-4 rounded-2xl border-2 animate-scale-in ${score >= 65 ? 'bg-[#D7FFB8] border-[#58CC02]' : 'bg-[#FFC800]/10 border-[#FFC800]'}`}>
            <div className="text-center">
              <span className="text-3xl">{score >= 85 ? '🐕' : score >= 65 ? '🐶' : '🐾'}</span>
              <p className="text-sm font-black mt-1" style={{ color: score >= 65 ? '#58CC02' : '#92400E' }}>
                {score >= 85 ? '¡Marcha perfecta!' : score >= 65 ? '¡Buena caminata!' : 'El perro se tropieza...'}
              </p>
              <p className="text-xs text-[#777] font-bold">Puntuación: {score}/100</p>
            </div>
          </div>
        )}

        {/* Play */}
        <button onClick={play} disabled={playing || pattern.every(s => s.length === 0)}
          className={`w-full py-3.5 rounded-xl text-sm font-black active:scale-95 transition border-b-4 ${
            playing ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            : pattern.every(s => s.length === 0) ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-700'
          }`}>
          {playing ? '🐾 Caminando...' : '▶️ Probar Caminata'}
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-[#92400E]">💡 <b>Tip:</b> Un patrón diagonal (FI+TD, luego FD+TI) es el más estable. Nunca levantes más de 2 patas a la vez o el perro se cae.</p>
        </div>
      </div>
    </div>
  );
};

// Game 3: Sound Command Training
const DogSoundGame = ({ onComplete, onBack }) => {
  const COMMANDS = [
    { id: 'sit', action: 'Sentarse', icon: '🐕', sound: '2 beeps cortos', freq: '500Hz × 2' },
    { id: 'walk', action: 'Caminar', icon: '🚶', sound: '1 beep largo', freq: '800Hz × 1' },
    { id: 'bark', action: 'Ladrar', icon: '🔊', sound: '3 beeps rápidos', freq: '1000Hz × 3' },
    { id: 'spin', action: 'Girar', icon: '🔄', sound: 'Tono ascendente', freq: '400→1200Hz' },
    { id: 'stop', action: 'Detener', icon: '✋', sound: '1 beep grave', freq: '200Hz × 1' },
    { id: 'dance', action: 'Bailar', icon: '💃', sound: 'Melodía (3 notas)', freq: '600-800-1000Hz' },
  ];

  const [round, setRound] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Shuffle options for current round
    const target = COMMANDS[round];
    const others = COMMANDS.filter(c => c.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [target, ...others].sort(() => Math.random() - 0.5);
    setShuffledOptions(options);
    setSelected(null);
    setShowResult(false);
  }, [round]);

  const handleSelect = (cmd) => {
    if (showResult) return;
    setSelected(cmd.id);
    setShowResult(true);
    const isCorrect = cmd.id === COMMANDS[round].id;
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);

    setTimeout(() => {
      if (round + 1 >= COMMANDS.length) {
        setGameOver(true);
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        const stars = finalCorrect >= 5 ? 3 : finalCorrect >= 4 ? 2 : 1;
        onComplete(finalCorrect, COMMANDS.length, stars);
      } else {
        setRound(r => r + 1);
      }
    }, 1500);
  };

  if (gameOver) return null;

  const currentCommand = COMMANDS[round];

  return (
    <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      <GameHeader title="Entrenamiento de Comandos" subtitle="Asocia cada sonido con la acción correcta" icon="🎵" color="from-amber-500 to-yellow-600" onBack={onBack} />
      <ProgressBar current={round} total={COMMANDS.length} color="#F59E0B" />

      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
        {/* Sound card */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-5 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-3 border-b-4 border-orange-600">
            🔊
          </div>
          <p className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider mb-1">Señal del Buzzer</p>
          <h2 className="text-xl font-black text-[#3C3C3C] mb-1">{currentCommand.sound}</h2>
          <p className="text-sm font-bold text-[#777]">{currentCommand.freq}</p>
          
          {/* Sound wave visualization */}
          <div className="mt-3 flex items-center justify-center gap-[2px] h-8">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = Math.abs(Math.sin(i * 0.5 + Date.now() * 0.001)) * 100;
              return (
                <div key={i} className="w-1 bg-amber-400 rounded-full transition-all animate-pulse"
                  style={{ height: `${20 + h * 0.6}%`, animationDelay: `${i * 50}ms` }} />
              );
            })}
          </div>
        </div>

        <p className="text-center text-sm font-black text-[#3C3C3C]">¿Qué acción corresponde a este sonido?</p>

        {/* Options */}
        <div className="space-y-2">
          {shuffledOptions.map(cmd => {
            let style = 'bg-white border-[#E5E5E5] text-[#3C3C3C] hover:border-amber-400';
            if (showResult) {
              if (cmd.id === currentCommand.id) style = 'bg-[#D7FFB8] border-[#58CC02] text-[#58CC02]';
              else if (cmd.id === selected) style = 'bg-red-50 border-red-300 text-red-500';
              else style = 'bg-gray-50 border-gray-200 text-[#AFAFAF]';
            }
            return (
              <button key={cmd.id} onClick={() => handleSelect(cmd)} disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition active:scale-[0.98] ${style}`}>
                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl">{cmd.icon}</span>
                <div>
                  <p className="text-sm font-black">{cmd.action}</p>
                  <p className="text-[10px] font-semibold text-[#AFAFAF]">{cmd.sound}</p>
                </div>
                {showResult && cmd.id === currentCommand.id && <Check size={20} className="ml-auto text-[#58CC02]" />}
                {showResult && cmd.id === selected && cmd.id !== currentCommand.id && <X size={20} className="ml-auto text-red-400" />}
              </button>
            );
          })}
        </div>

        {/* Score bar */}
        <div className="flex gap-3 justify-center">
          <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-black">✅ {correct}</span>
          <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-black">❌ {wrong}</span>
          <span className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-black">📊 {round + 1}/{COMMANDS.length}</span>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN: Build Mini-Games Hub
   ================================================================ */

const ROBOT_GAMES = {
  sumo: [
    { id: 'sumo_wiring', name: 'Conexión de Circuitos', desc: 'Conecta los cables del motor y sensores a los pines correctos del Arduino', icon: '🔌', difficulty: 'Medio', xp: 50, Component: SumoWiringGame },
    { id: 'sumo_balance', name: 'Centro de Gravedad', desc: 'Ajusta la distribución de peso para máxima estabilidad en el combate', icon: '⚖️', difficulty: 'Fácil', xp: 30, Component: SumoBalanceGame },
    { id: 'sumo_push', name: 'Prueba de Empuje', desc: 'Calibra la potencia de los motores para el golpe perfecto', icon: '💪', difficulty: 'Difícil', xp: 60, Component: SumoPushGame },
  ],
  line: [
    { id: 'line_calibration', name: 'Calibración de Sensores IR', desc: 'Ajusta el umbral de detección para diferentes patrones de pista', icon: '📊', difficulty: 'Medio', xp: 50, Component: LineCalibrationGame },
    { id: 'line_pid', name: 'Ajuste PID', desc: 'Encuentra los valores perfectos para seguir la línea suavemente', icon: '🎛️', difficulty: 'Difícil', xp: 70, Component: LinePIDGame },
    { id: 'line_speed', name: 'Velocidad vs Precisión', desc: 'Encuentra la velocidad óptima sin salirse de la pista', icon: '🏎️', difficulty: 'Fácil', xp: 40, Component: LineSpeedGame },
  ],
  dog: [
    { id: 'dog_servo', name: 'Calibración de Servos', desc: 'Ajusta el ángulo de cada pata para que se pare correctamente', icon: '🦿', difficulty: 'Medio', xp: 50, Component: DogServoGame },
    { id: 'dog_walk', name: 'Patrón de Marcha', desc: 'Diseña la secuencia de movimiento para que camine naturalmente', icon: '🐾', difficulty: 'Difícil', xp: 60, Component: DogWalkGame },
    { id: 'dog_sound', name: 'Entrenamiento de Comandos', desc: 'Asocia señales del buzzer con acciones del robot', icon: '🎵', difficulty: 'Fácil', xp: 35, Component: DogSoundGame },
  ],
};

const DIFFICULTY_COLORS = {
  'Fácil': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Medio': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'Difícil': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

const ROBOT_COLORS = {
  sumo: 'from-red-500 to-orange-600',
  line: 'from-blue-500 to-cyan-600',
  dog: 'from-amber-500 to-yellow-600',
};

export default function RobotBuildGamesHub({ robotType, onBack }) {
  const [activeGame, setActiveGame] = useState(null);
  const [completedGames, setCompletedGames] = useState({});
  const [showComplete, setShowComplete] = useState(null);

  const games = ROBOT_GAMES[robotType] || [];
  const robotColor = ROBOT_COLORS[robotType] || 'from-violet-500 to-purple-600';

  const handleGameComplete = (gameId, score, maxScore, stars) => {
    const xp = games.find(g => g.id === gameId)?.xp || 30;
    const earnedXp = Math.round((score / maxScore) * xp);
    setCompletedGames(prev => ({
      ...prev,
      [gameId]: { score, maxScore, stars, xp: earnedXp },
    }));
    setShowComplete({ gameId, score, maxScore, stars, xp: earnedXp });
    setActiveGame(null);
  };

  if (showComplete) {
    const game = games.find(g => g.id === showComplete.gameId);
    return (
      <GameComplete
        title={game?.name || 'Mini-juego'}
        score={showComplete.score}
        maxScore={showComplete.maxScore}
        stars={showComplete.stars}
        xp={showComplete.xp}
        color={robotColor}
        onReplay={() => { setShowComplete(null); setActiveGame(showComplete.gameId); }}
        onBack={() => setShowComplete(null)}
      />
    );
  }

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    if (game) {
      const GameComponent = game.Component;
      return (
        <GameComponent
          onComplete={(score, maxScore, stars) => handleGameComplete(game.id, score, maxScore, stars)}
          onBack={() => setActiveGame(null)}
        />
      );
    }
  }

  // Hub view
  const totalXP = Object.values(completedGames).reduce((sum, g) => sum + g.xp, 0);
  const totalStars = Object.values(completedGames).reduce((sum, g) => sum + g.stars, 0);

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className={`bg-gradient-to-r ${robotColor} rounded-2xl p-4 border-b-4 border-black/10`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">🎮 Mini-Juegos de Armado</h3>
            <p className="text-xs text-white/70 font-bold mt-0.5">Desafíos personalizados para tu robot</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-center">
              <p className="text-[10px] text-white/60 font-bold">⭐ Estrellas</p>
              <p className="text-sm font-black text-white">{totalStars}/{games.length * 3}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-xl text-center">
              <p className="text-[10px] text-white/60 font-bold">⚡ XP</p>
              <p className="text-sm font-black text-white">{totalXP}</p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(Object.keys(completedGames).length / games.length) * 100}%` }} />
        </div>
        <p className="text-[10px] text-white/50 font-bold mt-1 text-right">{Object.keys(completedGames).length}/{games.length} completados</p>
      </div>

      {/* Game cards */}
      {games.map((game, idx) => {
        const result = completedGames[game.id];
        const diffStyle = DIFFICULTY_COLORS[game.difficulty];
        return (
          <button key={game.id} onClick={() => setActiveGame(game.id)}
            className="w-full bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden text-left transition-all duration-300 hover:border-[#60A5FA] hover:shadow-md active:scale-[0.98]">
            <div className="p-4 flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${robotColor} flex items-center justify-center text-2xl flex-shrink-0 border-b-2 border-black/10 ${result ? 'ring-2 ring-[#58CC02] ring-offset-1' : ''}`}>
                {game.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-black text-[#3C3C3C] truncate">{game.name}</h4>
                  {result && <span className="text-xs">✅</span>}
                </div>
                <p className="text-[11px] text-[#777] font-semibold leading-snug mb-2">{game.desc}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                    {game.difficulty}
                  </span>
                  <span className="text-[9px] font-black text-[#60A5FA] bg-[#DBEAFE] px-2 py-0.5 rounded-full">
                    ⚡ {game.xp} XP
                  </span>
                  {result && (
                    <span className="text-[9px] font-black text-[#58CC02] bg-[#D7FFB8] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      {Array.from({ length: result.stars }).map((_, i) => <span key={i}>⭐</span>)} {result.score}/{result.maxScore}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-[#E5E5E5]">▶</div>
            </div>
          </button>
        );
      })}

      {games.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 text-center">
          <span className="text-4xl block mb-2">🔧</span>
          <p className="text-sm font-black text-[#3C3C3C]">Modo Libre</p>
          <p className="text-xs text-[#777] font-semibold mt-1">Los mini-juegos están disponibles para robots con plantilla predefinida</p>
        </div>
      )}
    </div>
  );
}

export { ROBOT_GAMES };
