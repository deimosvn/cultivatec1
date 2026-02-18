import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Star, Lock, CheckCircle, Zap } from 'lucide-react';
import { playClick, playTab, playAchievement } from '../utils/retroSounds';

const ACHIEVEMENTS = [
  { id: 'first_module', title: 'Primer Paso', description: 'Completa tu primer módulo', icon: '👣', category: 'Aprendizaje', points: 10, condition: (s) => s.modulesCompleted >= 1, rarity: 'común' },
  { id: 'electrician', title: 'Electricista Junior', description: 'Aprueba el Quiz de Electricidad >70%', icon: '⚡', category: 'Aprendizaje', points: 25, condition: (s) => s.quizScores?.mod_electr >= 70, rarity: 'raro' },
  { id: 'bookworm', title: 'Ratón de Biblioteca', description: 'Visita 5 módulos diferentes', icon: '📚', category: 'Aprendizaje', points: 15, condition: (s) => s.modulesVisited >= 5, rarity: 'común' },
  { id: 'scholar', title: 'Erudito Digital', description: 'Completa módulos básicos (1-6)', icon: '🎓', category: 'Aprendizaje', points: 50, condition: (s) => s.modulesCompleted >= 6, rarity: 'épico' },
  { id: 'quiz_starter', title: 'Inquisitivo', description: 'Completa tu primer Quiz', icon: '❓', category: 'Quiz', points: 10, condition: (s) => s.quizzesCompleted >= 1, rarity: 'común' },
  { id: 'perfect_score', title: 'Puntuación Perfecta', description: 'Obtén 100% en cualquier Quiz', icon: '💯', category: 'Quiz', points: 50, condition: (s) => s.perfectQuizzes >= 1, rarity: 'legendario' },
  { id: 'quiz_streak', title: 'Racha Imparable', description: '5 preguntas correctas seguidas', icon: '🔥', category: 'Quiz', points: 30, condition: (s) => s.maxStreak >= 5, rarity: 'raro' },
  { id: 'speed_demon', title: 'Rayo Veloz', description: 'Responde correcta en <5 segundos', icon: '⚡', category: 'Quiz', points: 20, condition: (s) => s.fastestCorrectAnswer <= 5, rarity: 'raro' },
  { id: 'first_code', title: 'Programador Novato', description: 'Ejecuta tu primer código', icon: '💻', category: 'Programación', points: 10, condition: (s) => s.codesExecuted >= 1, rarity: 'común' },
  { id: 'ai_coder', title: 'Asistido por IA', description: 'Genera código con el Asistente IA', icon: '🤖', category: 'Programación', points: 15, condition: (s) => s.aiCodesGenerated >= 1, rarity: 'común' },
  { id: 'bug_free', title: 'Libre de Bugs', description: '3 programas sin errores seguidos', icon: '🐛', category: 'Programación', points: 25, condition: (s) => s.consecutiveNoErrors >= 3, rarity: 'raro' },
  { id: 'code_master', title: 'Maestro del Código', description: 'Ejecuta 10 programas', icon: '👨‍💻', category: 'Programación', points: 30, condition: (s) => s.codesExecuted >= 10, rarity: 'épico' },
  { id: 'first_challenge', title: 'Primer Reto', description: 'Completa tu primer reto de código', icon: '🧩', category: 'Retos', points: 10, condition: (s) => s.challengesCompleted >= 1, rarity: 'común' },
  { id: 'five_challenges', title: 'Racha de 5', description: 'Completa 5 retos de programación', icon: '🔥', category: 'Retos', points: 20, condition: (s) => s.challengesCompleted >= 5, rarity: 'raro' },
  { id: 'twelve_challenges', title: 'Media Docena x2', description: 'Completa 12 retos (la mitad)', icon: '⚡', category: 'Retos', points: 35, condition: (s) => s.challengesCompleted >= 12, rarity: 'épico' },
  { id: 'all_challenges', title: 'Maestro de Retos', description: 'Completa los 24 retos', icon: '🏆', category: 'Retos', points: 75, condition: (s) => s.challengesCompleted >= 24, rarity: 'legendario' },
  { id: 'python_master', title: 'Pythonista', description: 'Completa todos los retos de Python', icon: '🐍', category: 'Retos', points: 30, condition: (s) => s.challengesPython >= 14, rarity: 'épico' },
  { id: 'arduino_hero', title: 'Héroe Arduino', description: 'Completa todos los retos de Arduino', icon: '🔷', category: 'Retos', points: 30, condition: (s) => s.challengesArduino >= 8, rarity: 'épico' },
  { id: 'beginner_done', title: 'Base Sólida', description: 'Completa todos los retos de Principiante', icon: '🌱', category: 'Retos', points: 15, condition: (s) => s.challengesLevel1 >= 6, rarity: 'raro' },
  { id: 'advanced_done', title: 'Nivel Experto', description: 'Completa todos los retos Avanzados', icon: '🎖️', category: 'Retos', points: 50, condition: (s) => s.challengesLevel4 >= 6, rarity: 'legendario' },
  { id: 'led_builder', title: 'Constructor de LED', description: 'Completa la guía de LED', icon: '💡', category: 'Práctica', points: 20, condition: (s) => s.ledGuideCompleted === true, rarity: 'raro' },
  { id: 'class_regular', title: 'Alumno Dedicado', description: 'Asiste a 10 clases', icon: '🏫', category: 'Práctica', points: 30, condition: (s) => s.classesAttended >= 10, rarity: 'raro' },
  { id: 'explorer', title: 'Explorador Total', description: 'Usa todas las secciones', icon: '🗺️', category: 'Especial', points: 25, condition: (s) => s.sectionsVisited >= 5, rarity: 'raro' },
  { id: 'points_100', title: 'Centurión', description: 'Acumula 100 puntos', icon: '💎', category: 'Especial', points: 0, condition: (s) => s.totalPoints >= 100, rarity: 'épico' },
];

const RARITY_CONFIG = {
  'común': { gradient: 'from-[#475569] to-[#334155]', bg: '', border: '', badge: 'bg-[#475569]', glow: '', stars: 1, bgStyle: { background: '#1E293B99', borderColor: '#33415580' } },
  'raro': { gradient: 'from-[#0891B2] to-[#0E7490]', bg: '', border: '', badge: 'bg-[#0891B2]', glow: 'shadow-[0_0_15px_rgba(8,145,178,0.15)]', stars: 2, bgStyle: { background: 'linear-gradient(135deg, #1E293BCC, #164E6315)', borderColor: '#0891B240' } },
  'épico': { gradient: 'from-[#7C3AED] to-[#6D28D9]', bg: '', border: '', badge: 'bg-[#7C3AED]', glow: 'shadow-[0_0_20px_rgba(124,58,237,0.15)]', stars: 3, bgStyle: { background: 'linear-gradient(135deg, #1E293BCC, #4C1D9515)', borderColor: '#7C3AED40' } },
  'legendario': { gradient: 'from-[#FFC800] to-[#FF9600]', bg: '', border: '', badge: 'bg-gradient-to-r from-[#FFC800] to-[#FF9600]', glow: 'shadow-[0_0_25px_rgba(255,200,0,0.15)]', stars: 4, bgStyle: { background: 'linear-gradient(135deg, #1E293BCC, #78350F15)', borderColor: '#FFC80040' } },
};
const CATEGORY_ICONS = { 'Aprendizaje': '📚', 'Quiz': '❓', 'Programación': '💻', 'Retos': '🧩', 'Práctica': '🔧', 'Especial': '⭐' };

const ConfettiParticle = ({ index }) => {
  const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#60A5FA', '#FF9600'];
  const style = {
    left: `${(index * 37) % 100}%`,
    animationDelay: `${(index * 0.1) % 0.8}s`,
    animationDuration: `${1.5 + (index * 0.3) % 2}s`,
  };
  const inner = {
    width: `${6 + (index * 3) % 8}px`,
    height: `${6 + (index * 3) % 8}px`,
    backgroundColor: colors[index % colors.length],
    borderRadius: index % 2 === 0 ? '50%' : '2px',
    transform: `rotate(${(index * 45) % 360}deg)`,
  };
  return <div className="absolute top-0 pointer-events-none animate-confetti-fall" style={style}><div style={inner} /></div>;
};

const AchievementCard = ({ achievement, isUnlocked, onCelebrate, animDelay }) => {
  const rarity = RARITY_CONFIG[achievement.rarity];
  return (
    <div className="animate-scale-in" style={{ animationDelay: `${animDelay}ms` }}>
      <button onClick={() => isUnlocked && onCelebrate?.(achievement)}
        className={`w-full text-left transition-all duration-500 rounded-2xl overflow-hidden ${isUnlocked ? `${rarity.glow} hover:scale-[1.02] active:scale-[0.98] cursor-pointer` : 'opacity-50 cursor-default'}`}>
        <div className="p-4 border rounded-2xl transition-all" style={isUnlocked ? rarity.bgStyle : { background: '#0F172A88', borderColor: '#1E293B' }}>
          <div className="flex items-center gap-3">
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${isUnlocked ? `bg-gradient-to-br ${rarity.gradient} shadow-lg` : 'bg-[#1E293B]'}`}>
              {isUnlocked ? (
                <><span className="relative z-10">{achievement.icon}</span>
                <div className="absolute inset-0 rounded-2xl overflow-hidden"><div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer-slide" /></div></>
              ) : <Lock size={20} className="text-[#475569]" />}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                {Array.from({ length: rarity.stars }).map((_, i) => <span key={i} className={`text-[8px] ${isUnlocked ? 'opacity-100' : 'opacity-20'}`}>⭐</span>)}
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={`text-sm font-black truncate ${isUnlocked ? 'text-[#E2E8F0]' : 'text-[#475569]'}`}>{achievement.title}</h3>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-white text-[9px] font-black uppercase tracking-wider ${rarity.badge}`}>{achievement.rarity}</span>
              </div>
              <p className={`text-[11px] font-semibold leading-snug ${isUnlocked ? 'text-[#94A3B8]' : 'text-[#334155]'}`}>{achievement.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {isUnlocked 
                  ? <span className="flex items-center gap-1 bg-[#052E16CC] text-[#22C55E] px-2 py-0.5 rounded-lg text-[10px] font-black border border-[#22C55E30]"><CheckCircle size={10} /> +{achievement.points} XP</span>
                  : <span className="text-[#475569] text-[10px] font-black">🔒 {achievement.points} XP</span>}
                <span className="text-[10px] font-bold text-[#64748B]">{CATEGORY_ICONS[achievement.category]} {achievement.category}</span>
              </div>
            </div>
            {isUnlocked && <div className="flex-shrink-0 w-9 h-9 bg-[#052E16CC] rounded-xl flex items-center justify-center border border-[#22C55E30]"><CheckCircle size={18} className="text-[#22C55E]" /></div>}
          </div>
        </div>
      </button>
    </div>
  );
};

const AchievementsScreen = ({ onBack, userStats, onShowRanking, onShowFriends, pendingFriendRequests = 0 }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [celebratingAchievement, setCelebratingAchievement] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const unlockedIds = ACHIEVEMENTS.filter(a => a.condition(userStats)).map(a => a.id);
  const totalPoints = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).reduce((sum, a) => sum + a.points, 0);
  const categories = ['all', ...new Set(ACHIEVEMENTS.map(a => a.category))];
  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    const mc = selectedCategory === 'all' || a.category === selectedCategory;
    const mf = !showUnlockedOnly || unlockedIds.includes(a.id);
    return mc && mf;
  });
  const rarityOrder = { 'legendario': 0, 'épico': 1, 'raro': 2, 'común': 3 };
  const sorted = [...filteredAchievements].sort((a, b) => {
    const d = (unlockedIds.includes(a.id) ? 0 : 1) - (unlockedIds.includes(b.id) ? 0 : 1);
    return d !== 0 ? d : (rarityOrder[a.rarity] || 99) - (rarityOrder[b.rarity] || 99);
  });
  const progressPercent = Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100);
  const getLevel = (pts) => {
    if (pts >= 200) return { level: 5, title: 'Maestro Robótico', emoji: '🏆', color: '#FFC800', nextAt: null };
    if (pts >= 100) return { level: 4, title: 'Ingeniero Junior', emoji: '🔧', color: '#60A5FA', nextAt: 200 };
    if (pts >= 50) return { level: 3, title: 'Aprendiz Avanzado', emoji: '⭐', color: '#1CB0F6', nextAt: 100 };
    if (pts >= 20) return { level: 2, title: 'Explorador Curioso', emoji: '🌱', color: '#58CC02', nextAt: 50 };
    return { level: 1, title: 'Principiante', emoji: '🐣', color: '#AFAFAF', nextAt: 20 };
  };
  const lv = getLevel(totalPoints);
  const prevT = lv.level === 1 ? 0 : lv.level === 2 ? 20 : lv.level === 3 ? 50 : 100;
  const lvProg = lv.nextAt ? ((totalPoints - prevT) / (lv.nextAt - prevT)) * 100 : 100;
  const handleCelebrate = (a) => { playAchievement(); setCelebratingAchievement(a); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); };

  return (
    <div className="pb-24 min-h-full flex flex-col animate-fade-in" style={{ background: 'linear-gradient(180deg, #0B1120 0%, #0E1A30 50%, #0F172A 100%)' }}>
      {showConfetti && <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">{Array.from({ length: 50 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}</div>}
      <div className="relative overflow-hidden">
        <div className="px-6 pt-6 pb-12" style={{ background: 'linear-gradient(135deg, #78350F 0%, #451A03 30%, #0B1120 100%)' }}>
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#FFC800 1px, transparent 1px), linear-gradient(90deg, #FFC800 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFC800]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF9600]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          {onBack && <button onClick={onBack} className="text-[#94A3B8] hover:text-white mb-4 flex items-center text-sm font-black active:scale-95 transition relative z-10"><ArrowLeft size={18} className="mr-1" /> Volver</button>}
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl border border-[#FFC800]/30 animate-pulse-soft" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)' }}>{lv.emoji}</div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2" style={{ background: '#0F172A', borderColor: lv.color }}><span className="text-xs font-black" style={{ color: lv.color }}>{lv.level}</span></div>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-wider">Nivel {lv.level}</p>
              <h2 className="text-xl font-black text-white">{lv.title}</h2>
              <div className="flex items-center gap-2 mt-1"><Star size={14} className="text-[#FFC800]" /><span className="text-sm font-black text-[#FFC800]">{totalPoints} XP</span></div>
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-[10px] text-[#64748B] font-black mb-1"><span>Nv. {lv.level}</span><span>{lv.nextAt ? `${totalPoints}/${lv.nextAt} XP` : '¡Nivel Máximo!'}</span>{lv.nextAt && <span>Nv. {lv.level + 1}</span>}</div>
            <div className="w-full bg-[#0F172A] rounded-full h-3 overflow-hidden border border-[#334155]/50"><div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${Math.max(lvProg, 5)}%`, backgroundColor: lv.color }}><div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer-slide" /></div></div>
          </div>
        </div>
        <div className="px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl p-3 text-center border shadow-sm" style={{ background: '#1E293BEE', borderColor: '#33415580' }}><span className="text-2xl block mb-0.5">🏅</span><span className="text-lg font-black text-[#E2E8F0]">{unlockedIds.length}</span><span className="text-[9px] font-bold text-[#64748B] block">Logros</span></div>
            <div className="rounded-2xl p-3 text-center border shadow-sm" style={{ background: '#1E293BEE', borderColor: '#33415580' }}><span className="text-2xl block mb-0.5">⭐</span><span className="text-lg font-black text-[#E2E8F0]">{totalPoints}</span><span className="text-[9px] font-bold text-[#64748B] block">Puntos XP</span></div>
            <div className="rounded-2xl p-3 text-center border shadow-sm" style={{ background: '#1E293BEE', borderColor: '#33415580' }}><span className="text-2xl block mb-0.5">📊</span><span className="text-lg font-black text-[#E2E8F0]">{progressPercent}%</span><span className="text-[9px] font-bold text-[#64748B] block">Progreso</span></div>
          </div>
        </div>
      </div>
      {/* Botones de Ranking y Amigos */}
      <div className="px-4 pt-3 pb-1">
        <div className="grid grid-cols-2 gap-2">
          {onShowRanking && (
            <button onClick={onShowRanking} className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-2xl p-3.5 flex items-center gap-2.5 active:scale-[0.97] transition-all shadow-[0_4px_0_#1E40AF] border-b-0">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🏆</div>
              <div className="text-left">
                <p className="text-xs font-black">Ranking Global</p>
                <p className="text-[9px] font-bold text-white/60">Compite con todos</p>
              </div>
            </button>
          )}
          {onShowFriends && (
            <button onClick={onShowFriends} className="bg-gradient-to-r from-[#58CC02] to-[#6BD600] text-white rounded-2xl p-3.5 flex items-center gap-2.5 active:scale-[0.97] transition-all shadow-[0_4px_0_#46A302] border-b-0 relative">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">👥</div>
              <div className="text-left">
                <p className="text-xs font-black">Amigos</p>
                <p className="text-[9px] font-bold text-white/60">Agrega y compite</p>
              </div>
              {pendingFriendRequests > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-[10px] font-black text-white">{pendingFriendRequests}</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="px-4 pt-2 pb-2">
        <div className="rounded-2xl p-4 border" style={{ background: '#1E293BCC', borderColor: '#33415580' }}>
          <div className="flex items-center gap-3 mb-2"><Trophy size={18} className="text-[#FFC800]" /><span className="text-sm font-black text-[#E2E8F0]">Progreso Total</span><span className="ml-auto text-xs font-black text-[#64748B]">{unlockedIds.length}/{ACHIEVEMENTS.length}</span></div>
          <div className="w-full bg-[#0F172A] rounded-full h-4 overflow-hidden border border-[#334155]/50"><div className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full transition-all duration-1000 relative" style={{ width: `${Math.max(progressPercent, 3)}%` }}><div className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px]">🏃</div></div></div>
        </div>
      </div>
      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map(cat => <button key={cat} onClick={() => { playTab(); setSelectedCategory(cat); }} className={`flex-shrink-0 px-3.5 py-2 rounded-2xl font-black text-xs transition-all active:scale-95 border whitespace-nowrap ${selectedCategory === cat ? 'bg-[#22D3EE] text-[#0F172A] border-[#22D3EE] shadow-md shadow-[#22D3EE]/20' : 'text-[#64748B] border-[#334155] bg-[#1E293B]/60'}`}>{cat === 'all' ? '🌟 Todos' : `${CATEGORY_ICONS[cat] || '📋'} ${cat}`}</button>)}
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setShowUnlockedOnly(false)} className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition border ${!showUnlockedOnly ? 'bg-[#22C55E] text-white border-[#16A34A] shadow-md shadow-green-500/20' : 'text-[#64748B] border-[#334155] bg-[#1E293B]/60'}`}>📋 Todos ({filteredAchievements.length})</button>
          <button onClick={() => setShowUnlockedOnly(true)} className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition border ${showUnlockedOnly ? 'bg-[#22C55E] text-white border-[#16A34A] shadow-md shadow-green-500/20' : 'text-[#64748B] border-[#334155] bg-[#1E293B]/60'}`}>✅ Desbloqueados ({filteredAchievements.filter(a => unlockedIds.includes(a.id)).length})</button>
        </div>
      </div>
      <div className="px-4 space-y-3 pb-6">
        {sorted.length === 0 && <div className="text-center py-12"><span className="text-5xl block mb-3">🔍</span><p className="text-sm font-black text-[#64748B]">No hay logros aquí aún</p></div>}
        {sorted.map((a, idx) => <AchievementCard key={a.id} achievement={a} isUnlocked={unlockedIds.includes(a.id)} onCelebrate={handleCelebrate} animDelay={idx * 60} />)}
      </div>
      {celebratingAchievement && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setCelebratingAchievement(null)}>
          <div className="rounded-3xl p-8 max-w-sm w-full text-center border shadow-2xl animate-bounce-in" style={{ background: 'linear-gradient(180deg, #1E293B, #0F172A)', borderColor: '#334155' }} onClick={e => e.stopPropagation()}>
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${RARITY_CONFIG[celebratingAchievement.rarity].gradient} opacity-20 animate-ping`} />
              <div className={`relative w-full h-full rounded-3xl bg-gradient-to-br ${RARITY_CONFIG[celebratingAchievement.rarity].gradient} flex items-center justify-center shadow-xl`}><span className="text-5xl">{celebratingAchievement.icon}</span></div>
            </div>
            <div className="flex justify-center gap-1 mb-2">{Array.from({ length: RARITY_CONFIG[celebratingAchievement.rarity].stars }).map((_, i) => <span key={i} className="text-lg animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>⭐</span>)}</div>
            <h2 className="text-2xl font-black text-[#FFC800] mb-1">¡Logro Desbloqueado!</h2>
            <p className="text-lg font-black text-[#E2E8F0]">{celebratingAchievement.title}</p>
            <p className="text-[#94A3B8] text-sm font-semibold mt-1 mb-3">{celebratingAchievement.description}</p>
            <div className="inline-flex items-center gap-2 bg-[#052E16CC] text-[#22C55E] px-4 py-2 rounded-xl mb-4 border border-[#22C55E30]"><Zap size={16} /><span className="text-lg font-black">+{celebratingAchievement.points} XP</span></div>
            <div><button onClick={() => setCelebratingAchievement(null)} className="w-full py-3.5 btn-3d btn-3d-green rounded-xl text-sm">¡Genial! 🎉</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

const AchievementUnlockPopup = ({ achievements, onDismiss }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!achievements || achievements.length === 0) return;
    const t = setTimeout(() => { if (idx < achievements.length - 1) setIdx(p => p + 1); else onDismiss?.(); }, 4500);
    return () => clearTimeout(t);
  }, [idx, achievements, onDismiss]);
  if (!achievements || achievements.length === 0) return null;
  const a = achievements[idx];
  const r = RARITY_CONFIG[a.rarity];
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">{Array.from({ length: 40 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}</div>
      <div className="relative rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl animate-bounce-in border" style={{ background: 'linear-gradient(180deg, #1E293B, #0F172A)', borderColor: '#334155' }} onClick={e => e.stopPropagation()}>
        <div className="relative mx-auto w-28 h-28 mb-5">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${r.gradient} opacity-20 animate-ping`} />
          <div className={`absolute inset-2 rounded-2xl bg-gradient-to-br ${r.gradient} opacity-30 animate-pulse`} />
          <div className={`relative w-full h-full rounded-3xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-2xl border-b-4 border-black/10`}><span className="text-6xl drop-shadow-lg">{a.icon}</span></div>
        </div>
        <p className="text-xs font-black text-[#64748B] uppercase tracking-widest mb-1">🎊 ¡Nuevo Logro!</p>
        <h2 className="text-2xl font-black text-[#E2E8F0] mb-1">{a.title}</h2>
        <p className="text-sm text-[#94A3B8] font-semibold mb-3">{a.description}</p>
        <div className="flex justify-center gap-1 mb-3">{Array.from({ length: r.stars }).map((_, i) => <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>⭐</span>)}</div>
        <div className="inline-flex items-center gap-2 bg-[#052E16CC] text-[#22C55E] px-5 py-2.5 rounded-2xl mb-5 border border-[#22C55E30]"><Zap size={18} /><span className="text-xl font-black">+{a.points} XP</span></div>
        {achievements.length > 1 && <p className="text-[10px] font-bold text-[#64748B] mb-3">Logro {idx + 1} de {achievements.length}</p>}
        <button onClick={onDismiss} className="w-full py-3.5 btn-3d btn-3d-green rounded-2xl text-sm">{idx < achievements.length - 1 ? '¡Siguiente! →' : '¡Increíble! 🎉'}</button>
      </div>
    </div>
  );
};

const AchievementToast = ({ achievement, onDismiss }) => {
  useEffect(() => { const t = setTimeout(onDismiss, 4000); return () => clearTimeout(t); }, [onDismiss]);
  if (!achievement) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="px-5 py-3 rounded-2xl border flex items-center gap-3 font-black shadow-2xl" style={{ background: 'linear-gradient(135deg, #1E293BEE, #0F172AEE)', borderColor: '#FFC80040', boxShadow: '0 8px 32px #0B112080, 0 0 20px #FFC80015' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #78350F, #451A03)' }}>{achievement.icon}</div>
        <div><p className="text-[9px] text-[#FFC800] uppercase tracking-wider font-black">¡Logro Desbloqueado!</p><p className="font-black text-sm text-[#E2E8F0]">{achievement.title}</p><p className="text-[10px] text-[#64748B] font-bold">+{achievement.points} XP</p></div>
        <span className="text-2xl animate-bounce">🎉</span>
      </div>
    </div>
  );
};

export { AchievementsScreen, AchievementToast, AchievementUnlockPopup, ACHIEVEMENTS };
export default AchievementsScreen;