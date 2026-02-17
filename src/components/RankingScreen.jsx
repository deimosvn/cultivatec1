// ================================================================
// RANKING SCREEN — CultivaTec App
// Ranking global + ranking de amigos + Admin tools
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, Users, Globe, RefreshCw, Star, Zap, Trash2, Gift, X, Award, Palette, Shield, AlertTriangle } from 'lucide-react';
import { getGlobalRanking, onRankingChange, getFriendsList, adminDeleteUser, adminGiftBadge, adminGiftSkin, isAdminEmail } from '../firebase/firestore';
import { calculateLevel, LEVEL_THRESHOLDS } from '../firebase/firestore';
import { RobotMini, RobotAvatar } from '../Onboarding';
import { ROBOT_SKINS } from './RobotSkinEditor';

// ============================================
// INSIGNIAS DISPONIBLES PARA REGALAR (ADMIN)
// ============================================
const AVAILABLE_BADGES = [
  { id: 'badge_star', name: 'Estrella', emoji: '⭐', color: '#FFC800' },
  { id: 'badge_fire', name: 'En Llamas', emoji: '🔥', color: '#FF4B4B' },
  { id: 'badge_diamond', name: 'Diamante', emoji: '💎', color: '#60A5FA' },
  { id: 'badge_crown', name: 'Corona', emoji: '👑', color: '#FFC800' },
  { id: 'badge_rocket', name: 'Cohete', emoji: '🚀', color: '#3B82F6' },
  { id: 'badge_lightning', name: 'Rayo', emoji: '⚡', color: '#F59E0B' },
  { id: 'badge_heart', name: 'Corazón', emoji: '❤️', color: '#FF4B6E' },
  { id: 'badge_trophy', name: 'Trofeo', emoji: '🏆', color: '#FFC800' },
  { id: 'badge_genius', name: 'Genio', emoji: '🧠', color: '#8B5CF6' },
  { id: 'badge_shield', name: 'Escudo', emoji: '🛡️', color: '#10B981' },
  { id: 'badge_music', name: 'Música', emoji: '🎵', color: '#EC4899' },
  { id: 'badge_robot', name: 'Robot Pro', emoji: '🤖', color: '#6366F1' },
  { id: 'badge_earth', name: 'Planeta', emoji: '🌍', color: '#22C55E' },
  { id: 'badge_butterfly', name: 'Mariposa', emoji: '🦋', color: '#A78BFA' },
  { id: 'badge_unicorn', name: 'Unicornio', emoji: '🦄', color: '#F472B6' },
  { id: 'badge_alien', name: 'Alien', emoji: '👽', color: '#34D399' },
];

// Robot avatar for ranking
const RankingAvatar = ({ config, size = 36 }) => {
  if (!config) {
    const fallbackSize = size;
    return (
      <div className="rounded-xl flex items-center justify-center" style={{
        width: fallbackSize, height: fallbackSize,
        background: 'linear-gradient(135deg, #3B82F6, #3B82F688)',
        border: '2px solid #3B82F666',
      }}>
        <span style={{ fontSize: fallbackSize * 0.5 }}>🤖</span>
      </div>
    );
  }
  return (
    <div className="rounded-xl flex items-center justify-center overflow-hidden" style={{
      width: size, height: size,
      background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
      border: '2px solid #C7D2FE',
    }}>
      <RobotAvatar config={config} size={size * 0.85} />
    </div>
  );
};

const RankBadge = ({ rank }) => {
  if (rank === 1) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFC800] to-[#FF9600] flex items-center justify-center shadow-lg"><Crown size={16} className="text-white" /></div>;
  if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] flex items-center justify-center shadow-lg"><Medal size={16} className="text-white" /></div>;
  if (rank === 3) return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center shadow-lg"><Medal size={16} className="text-white" /></div>;
  return <div className="w-8 h-8 rounded-full bg-[#E5E5E5] flex items-center justify-center"><span className="text-xs font-black text-[#777]">{rank}</span></div>;
};

// ============================================
// ADMIN ACTION MODAL
// ============================================
const AdminActionModal = ({ player, onClose, onDelete, onGiftBadge, onGiftSkin }) => {
  const [activeTab, setActiveTab] = useState('actions');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [giftingBadge, setGiftingBadge] = useState(null);
  const [giftingSkin, setGiftingSkin] = useState(null);
  const [actionDone, setActionDone] = useState(null);

  const handleDelete = async () => {
    try {
      await onDelete(player.uid);
      setActionDone('deleted');
      setTimeout(() => onClose(), 1500);
    } catch (e) {
      alert('Error al eliminar: ' + e.message);
    }
  };

  const handleGiftBadge = async (badge) => {
    setGiftingBadge(badge.id);
    try {
      await onGiftBadge(player.uid, badge);
      setActionDone(`badge_${badge.id}`);
      setGiftingBadge(null);
    } catch (e) {
      alert('Error: ' + e.message);
      setGiftingBadge(null);
    }
  };

  const handleGiftSkin = async (skin) => {
    setGiftingSkin(skin.id);
    try {
      await onGiftSkin(player.uid, skin);
      setActionDone(`skin_${skin.id}`);
      setGiftingSkin(null);
    } catch (e) {
      alert('Error: ' + e.message);
      setGiftingSkin(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RankingAvatar config={player.robotConfig} size={40} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-black text-white">{player.username || 'Anónimo'}</p>
                {isAdminEmail(player.email) && (
                  <span className="px-1.5 py-0.5 bg-white/20 text-white text-[7px] font-black rounded-md uppercase">ADMIN</span>
                )}
              </div>
              <p className="text-[10px] font-bold text-white/60">{(player.totalPoints || 0).toLocaleString()} XP</p>
              {player.adminBadges?.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {player.adminBadges.map(b => (
                    <span key={b.id} className="text-sm" title={b.name}>{b.emoji}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition">
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E5E5]">
          {[
            { id: 'actions', icon: <Shield size={14} />, label: 'Acciones' },
            { id: 'badges', icon: <Award size={14} />, label: 'Insignias' },
            { id: 'skins', icon: <Palette size={14} />, label: 'Skins' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black transition-all border-b-2 ${
                activeTab === t.id ? 'text-[#2563EB] border-[#2563EB]' : 'text-[#AFAFAF] border-transparent'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {actionDone === 'deleted' ? (
            <div className="text-center py-10">
              <span className="text-5xl block mb-3">🗑️</span>
              <p className="text-lg font-black text-[#FF4B4B]">Cuenta Eliminada</p>
              <p className="text-xs text-[#AFAFAF] font-bold mt-1">La cuenta ha sido eliminada exitosamente</p>
            </div>
          ) : activeTab === 'actions' ? (
            <div className="space-y-3">
              {/* Delete User */}
              {!isAdminEmail(player.email) && (
                <div className="p-4 bg-[#FEE2E2] rounded-2xl border-2 border-[#FECACA]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-[#DC2626]" />
                    <p className="text-sm font-black text-[#DC2626]">Eliminar Cuenta</p>
                  </div>
                  <p className="text-xs text-[#777] font-semibold mb-3">
                    Esta acción eliminará el perfil, progreso, amigos y rankings del usuario. No se puede deshacer.
                  </p>
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      className="w-full py-2.5 bg-[#DC2626] text-white rounded-xl font-black text-sm active:scale-95 transition flex items-center justify-center gap-2">
                      <Trash2 size={14} /> Eliminar Usuario
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-black text-[#DC2626] text-center">¿Estás seguro? Esta acción es permanente.</p>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmDelete(false)}
                          className="flex-1 py-2.5 bg-[#E5E5E5] text-[#777] rounded-xl font-black text-sm active:scale-95 transition">
                          Cancelar
                        </button>
                        <button onClick={handleDelete}
                          className="flex-1 py-2.5 bg-[#DC2626] text-white rounded-xl font-black text-sm active:scale-95 transition flex items-center justify-center gap-1">
                          <Trash2 size={12} /> Confirmar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Info */}
              <div className="p-4 bg-[#F0F9FF] rounded-2xl border-2 border-[#BAE6FD]">
                <p className="text-sm font-black text-[#1E40AF] mb-2">📋 Información del Usuario</p>
                <div className="space-y-1.5 text-xs font-semibold text-[#555]">
                  <p>👤 Username: <span className="font-black text-[#3C3C3C]">{player.username}</span></p>
                  <p>📧 Email: <span className="font-black text-[#3C3C3C]">{player.email || 'N/A'}</span></p>
                  <p>⭐ XP: <span className="font-black text-[#3C3C3C]">{(player.totalPoints || 0).toLocaleString()}</span></p>
                  <p>📚 Módulos: <span className="font-black text-[#3C3C3C]">{player.modulesCompleted || 0}</span></p>
                  <p>👥 Amigos: <span className="font-black text-[#3C3C3C]">{player.friendsCount || 0}</span></p>
                  <p>🔥 Racha: <span className="font-black text-[#3C3C3C]">{player.currentStreak || 0} días</span></p>
                  {player.adminBadges?.length > 0 && (
                    <p>🏅 Insignias: <span className="font-black text-[#3C3C3C]">{player.adminBadges.map(b => b.emoji).join(' ')}</span></p>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'badges' ? (
            <div>
              <p className="text-xs font-bold text-[#AFAFAF] mb-3">Selecciona una insignia para regalar a <span className="font-black text-[#3C3C3C]">{player.username}</span>:</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_BADGES.map(badge => {
                  const alreadyHas = player.adminBadges?.some(b => b.id === badge.id);
                  const isGifting = giftingBadge === badge.id;
                  const justGifted = actionDone === `badge_${badge.id}`;
                  return (
                    <button key={badge.id} onClick={() => !alreadyHas && !isGifting && handleGiftBadge(badge)}
                      disabled={alreadyHas || isGifting}
                      className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                        justGifted ? 'bg-[#DCFCE7] border-[#22C55E]/50' :
                        alreadyHas ? 'bg-[#F0F0F0] border-[#E5E5E5] opacity-50' :
                        'bg-white border-[#E5E5E5] hover:border-[#3B82F6]/50 hover:bg-[#EFF6FF]'
                      }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{badge.emoji}</span>
                        <div>
                          <p className="text-xs font-black text-[#3C3C3C]">{badge.name}</p>
                          <p className="text-[9px] font-bold" style={{ color: badge.color }}>
                            {justGifted ? '✅ Regalada' : alreadyHas ? 'Ya la tiene' : isGifting ? '⏳ Enviando...' : 'Tap para regalar'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'skins' ? (
            <div>
              <p className="text-xs font-bold text-[#AFAFAF] mb-3">Regala una skin a <span className="font-black text-[#3C3C3C]">{player.username}</span> (se aplicará automáticamente):</p>
              <div className="grid grid-cols-2 gap-2">
                {ROBOT_SKINS.map(skin => {
                  const isGifting = giftingSkin === skin.id;
                  const justGifted = actionDone === `skin_${skin.id}`;
                  const rarityBgs = { common: '#DCFCE7', rare: '#DBEAFE', epic: '#FEE2E2', legendary: '#FEF3C7' };
                  return (
                    <button key={skin.id} onClick={() => !isGifting && handleGiftSkin(skin)}
                      disabled={isGifting}
                      className={`p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                        justGifted ? 'bg-[#DCFCE7] border-[#22C55E]/50' : 'bg-white border-[#E5E5E5] hover:border-[#3B82F6]/50'
                      }`}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: `${rarityBgs[skin.rarity] || '#F0F0F0'}` }}>
                          <RobotAvatar config={skin.config} size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-[#3C3C3C]">{skin.name}</p>
                          <p className="text-[8px] font-black uppercase" style={{ color: skin.rarityColor }}>{skin.rarityLabel}</p>
                          {justGifted && <p className="text-[8px] font-black text-[#22C55E]">✅ Regalada</p>}
                          {isGifting && <p className="text-[8px] font-black text-[#3B82F6]">⏳ Enviando...</p>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ============================================
// RANKING ENTRY
// ============================================
const RankingEntry = ({ player, rank, isCurrentUser, index, isAdmin, onAdminAction }) => {
  const lv = calculateLevel(player.totalPoints || 0);
  const bgClass = isCurrentUser
    ? 'bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/5 border-[#2563EB]/30'
    : rank <= 3
      ? 'bg-gradient-to-r from-[#FFC800]/5 to-transparent border-[#FFC800]/20'
      : 'bg-white border-[#E5E5E5]';

  return (
    <div className="animate-scale-in" style={{ animationDelay: `${index * 40}ms` }}>
      <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${bgClass} ${isCurrentUser ? 'shadow-md' : ''}`}>
        <RankBadge rank={rank} />
        <RankingAvatar config={player.robotConfig} size={40} />
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-sm font-black truncate ${isCurrentUser ? 'text-[#2563EB]' : 'text-[#3C3C3C]'}`}>
              {player.username || 'Anónimo'}
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 bg-[#2563EB] text-white text-[8px] font-black rounded-md uppercase">Tú</span>
            )}
            {isAdminEmail(player.email) && (
              <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#FF4B4B] to-[#FF9600] text-white text-[7px] font-black rounded-md uppercase tracking-wider">ADMIN</span>
            )}
            {/* Admin badges */}
            {player.adminBadges?.map(b => (
              <span key={b.id} title={b.name} className="text-sm">{b.emoji}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-[#AFAFAF]">{lv.emoji} Nv.{lv.level}</span>
            <span className="text-[10px] font-bold text-[#CDCDCD]">·</span>
            <span className="text-[10px] font-bold text-[#AFAFAF] truncate">{lv.title}</span>
          </div>
          {/* XP Progress bar */}
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex-grow h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${lv.progress * 100}%`,
                  background: lv.isMaxLevel
                    ? 'linear-gradient(90deg, #FFC800, #FF9600)'
                    : 'linear-gradient(90deg, #3B82F6, #2563EB)',
                }}
              />
            </div>
            <span className="text-[8px] font-bold text-[#CDCDCD] flex-shrink-0">
              {lv.isMaxLevel ? 'MAX' : `${Math.round(lv.progress * 100)}%`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[#FFC800]" />
              <span className="text-sm font-black text-[#3C3C3C]">{(player.totalPoints || 0).toLocaleString()}</span>
            </div>
            <span className="text-[9px] font-bold text-[#AFAFAF]">XP</span>
          </div>
          {/* Admin action button */}
          {isAdmin && !isCurrentUser && (
            <button onClick={() => onAdminAction(player)}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-md active:scale-90 transition border border-[#4338CA]/50">
              <Shield size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// RANKING SCREEN
// ============================================
const RankingScreen = ({ onBack, currentUserId, currentUserProfile, isAdmin = false }) => {
  const [tab, setTab] = useState('global');
  const [globalRanking, setGlobalRanking] = useState([]);
  const [friendsRanking, setFriendsRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminTarget, setAdminTarget] = useState(null);

  // Cargar ranking global en tiempo real
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onRankingChange(50, (ranking) => {
      setGlobalRanking(ranking);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Cargar ranking de amigos
  const loadFriendsRanking = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const friends = await getFriendsList(currentUserId);
      const allPlayers = [...friends];
      if (currentUserProfile) {
        allPlayers.push({
          uid: currentUserId,
          username: currentUserProfile.username,
          totalPoints: currentUserProfile.totalPoints || 0,
          modulesCompleted: currentUserProfile.modulesCompleted || 0,
          robotConfig: currentUserProfile.robotConfig,
          robotName: currentUserProfile.robotName,
        });
      }
      allPlayers.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setFriendsRanking(allPlayers.map((p, i) => ({ ...p, rank: i + 1 })));
    } catch (err) {
      console.error('Error loading friends ranking:', err);
    }
  }, [currentUserId, currentUserProfile]);

  useEffect(() => {
    if (tab === 'friends') {
      loadFriendsRanking();
    }
  }, [tab, loadFriendsRanking]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (tab === 'friends') {
      await loadFriendsRanking();
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleAdminDelete = async (uid) => {
    await adminDeleteUser(uid);
    setGlobalRanking(prev => prev.filter(p => p.uid !== uid).map((p, i) => ({ ...p, rank: i + 1 })));
    setAdminTarget(null);
  };

  const handleAdminGiftBadge = async (uid, badge) => {
    await adminGiftBadge(uid, badge);
    setGlobalRanking(prev => prev.map(p => {
      if (p.uid === uid) {
        const existing = p.adminBadges || [];
        if (!existing.some(b => b.id === badge.id)) {
          return { ...p, adminBadges: [...existing, { ...badge, giftedAt: new Date().toISOString() }] };
        }
      }
      return p;
    }));
    setAdminTarget(prev => {
      if (prev && prev.uid === uid) {
        const existing = prev.adminBadges || [];
        if (!existing.some(b => b.id === badge.id)) {
          return { ...prev, adminBadges: [...existing, { ...badge, giftedAt: new Date().toISOString() }] };
        }
      }
      return prev;
    });
  };

  const handleAdminGiftSkin = async (uid, skin) => {
    await adminGiftSkin(uid, skin);
    setGlobalRanking(prev => prev.map(p => p.uid === uid ? { ...p, robotConfig: skin.config } : p));
    setAdminTarget(prev => prev && prev.uid === uid ? { ...prev, robotConfig: skin.config } : prev);
  };

  const currentRanking = tab === 'global' ? globalRanking : friendsRanking;
  const currentUserRank = currentRanking.find(p => p.uid === currentUserId);

  return (
    <div className="pb-24 min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] px-6 pt-6 pb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          {onBack && (
            <button onClick={onBack} className="text-white/60 hover:text-white mb-4 flex items-center text-sm font-black active:scale-95 transition relative z-10">
              <ArrowLeft size={18} className="mr-1" /> Volver
            </button>
          )}

          <div className="relative z-10 text-center">
            <div className="text-5xl mb-2">🏆</div>
            <h1 className="text-2xl font-black text-white tracking-tight">Ranking</h1>
            <p className="text-white/60 text-xs font-bold mt-1">
              {isAdmin ? '🛡️ Modo Administrador Activo' : 'Compite con la comunidad'}
            </p>
          </div>
        </div>

        {/* User rank card */}
        {currentUserRank && (() => {
          const myLv = calculateLevel(currentUserProfile?.totalPoints || 0);
          return (
          <div className="px-4 -mt-6 relative z-10">
            <div className="bg-white rounded-2xl p-4 border-2 border-[#2563EB]/20 shadow-lg">
              <div className="flex items-center gap-3">
                <RankBadge rank={currentUserRank.rank} />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black text-[#3C3C3C]">{currentUserProfile?.username || 'Tú'}</p>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#FF4B4B] to-[#FF9600] text-white text-[7px] font-black rounded-md uppercase tracking-wider">ADMIN</span>
                    )}
                    {currentUserProfile?.adminBadges?.map(b => (
                      <span key={b.id} title={b.name} className="text-sm">{b.emoji}</span>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-[#AFAFAF]">Posición #{currentUserRank.rank} de {currentRanking.length}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-[#2563EB]">{myLv.emoji} Nv.{myLv.level}</span>
                    <span className="text-[10px] font-bold text-[#94A3B8]">{myLv.title}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#FFC800]" />
                    <span className="text-lg font-black text-[#2563EB]">{(currentUserProfile?.totalPoints || 0).toLocaleString()}</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#AFAFAF]">XP Totales</span>
                </div>
              </div>
              {/* Level progress bar */}
              <div className="mt-3 pt-3 border-t border-[#E5E5E5]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#777]">Nv.{myLv.level}</span>
                  <span className="text-[10px] font-bold text-[#AFAFAF]">
                    {myLv.isMaxLevel
                      ? '¡Nivel máximo alcanzado!'
                      : `${myLv.xpInLevel.toLocaleString()} / ${myLv.xpNeeded.toLocaleString()} XP`}
                  </span>
                  <span className="text-[10px] font-bold text-[#777]">{myLv.isMaxLevel ? `Nv.${myLv.level}` : `Nv.${myLv.level + 1}`}</span>
                </div>
                <div className="w-full h-2.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${myLv.progress * 100}%`,
                      background: myLv.isMaxLevel
                        ? 'linear-gradient(90deg, #FFC800, #FF9600, #FFC800)'
                        : 'linear-gradient(90deg, #3B82F6, #2563EB, #1E40AF)',
                    }}
                  />
                </div>
                {!myLv.isMaxLevel && (
                  <p className="text-[9px] font-bold text-[#CDCDCD] text-center mt-1">
                    Faltan {(myLv.xpNeeded - myLv.xpInLevel).toLocaleString()} XP para Nv.{myLv.level + 1}
                  </p>
                )}
              </div>
            </div>
          </div>
          );
        })()}
      </div>

      {/* Tabs + Refresh */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <div className="flex gap-2 flex-grow">
          <button
            onClick={() => setTab('global')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 border-2 ${
              tab === 'global'
                ? 'bg-[#2563EB] text-white border-[#1E40AF] shadow-md'
                : 'bg-white text-[#AFAFAF] border-[#E5E5E5]'
            }`}
          >
            <Globe size={14} /> Global
          </button>
          <button
            onClick={() => setTab('friends')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 border-2 ${
              tab === 'friends'
                ? 'bg-[#2563EB] text-white border-[#1E40AF] shadow-md'
                : 'bg-white text-[#AFAFAF] border-[#E5E5E5]'
            }`}
          >
            <Users size={14} /> Amigos
          </button>
        </div>
        <button onClick={handleRefresh} className={`w-10 h-10 rounded-xl bg-white border-2 border-[#E5E5E5] flex items-center justify-center transition-all active:scale-90 ${refreshing ? 'animate-spin' : ''}`}>
          <RefreshCw size={16} className="text-[#AFAFAF]" />
        </button>
      </div>

      {/* Ranking List */}
      <div className="px-4 space-y-2 pb-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-black text-[#AFAFAF]">Cargando ranking...</p>
          </div>
        ) : currentRanking.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">{tab === 'friends' ? '👥' : '🏆'}</span>
            <p className="text-sm font-black text-[#AFAFAF]">
              {tab === 'friends'
                ? 'Agrega amigos para ver su ranking'
                : 'Sé el primero en el ranking'}
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 podium (only global) */}
            {tab === 'global' && currentRanking.length >= 3 && (
              <div className="bg-white rounded-2xl p-4 border-2 border-[#FFC800]/20 mb-3">
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd place */}
                  <div className="text-center">
                    <RankingAvatar config={currentRanking[1]?.robotConfig} size={44} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] flex items-center justify-center mx-auto mt-1 shadow-md">
                      <span className="text-xs font-black text-white">2</span>
                    </div>
                    <p className="text-[10px] font-black text-[#777] mt-1 truncate max-w-[70px]">{currentRanking[1]?.username}</p>
                    <p className="text-[9px] font-bold text-[#AFAFAF]">{currentRanking[1]?.totalPoints} XP</p>
                    {currentRanking[1]?.adminBadges?.length > 0 && (
                      <div className="flex justify-center gap-0.5">{currentRanking[1].adminBadges.map(b => <span key={b.id} className="text-xs">{b.emoji}</span>)}</div>
                    )}
                  </div>
                  {/* 1st place */}
                  <div className="text-center -mb-2">
                    <div className="text-2xl mb-1">👑</div>
                    <RankingAvatar config={currentRanking[0]?.robotConfig} size={56} />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC800] to-[#FF9600] flex items-center justify-center mx-auto mt-1 shadow-lg">
                      <span className="text-sm font-black text-white">1</span>
                    </div>
                    <p className="text-xs font-black text-[#3C3C3C] mt-1 truncate max-w-[80px]">{currentRanking[0]?.username}</p>
                    <p className="text-[10px] font-bold text-[#FFC800]">{currentRanking[0]?.totalPoints} XP</p>
                    {currentRanking[0]?.adminBadges?.length > 0 && (
                      <div className="flex justify-center gap-0.5">{currentRanking[0].adminBadges.map(b => <span key={b.id} className="text-xs">{b.emoji}</span>)}</div>
                    )}
                  </div>
                  {/* 3rd place */}
                  <div className="text-center">
                    <RankingAvatar config={currentRanking[2]?.robotConfig} size={44} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center mx-auto mt-1 shadow-md">
                      <span className="text-xs font-black text-white">3</span>
                    </div>
                    <p className="text-[10px] font-black text-[#777] mt-1 truncate max-w-[70px]">{currentRanking[2]?.username}</p>
                    <p className="text-[9px] font-bold text-[#AFAFAF]">{currentRanking[2]?.totalPoints} XP</p>
                    {currentRanking[2]?.adminBadges?.length > 0 && (
                      <div className="flex justify-center gap-0.5">{currentRanking[2].adminBadges.map(b => <span key={b.id} className="text-xs">{b.emoji}</span>)}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Full list */}
            {currentRanking.map((player, idx) => (
              <RankingEntry
                key={player.uid}
                player={player}
                rank={player.rank || idx + 1}
                isCurrentUser={player.uid === currentUserId}
                index={idx}
                isAdmin={isAdmin}
                onAdminAction={(p) => setAdminTarget(p)}
              />
            ))}
          </>
        )}
      </div>

      {/* Admin Action Modal */}
      {adminTarget && (
        <AdminActionModal
          player={adminTarget}
          onClose={() => setAdminTarget(null)}
          onDelete={handleAdminDelete}
          onGiftBadge={handleAdminGiftBadge}
          onGiftSkin={handleAdminGiftSkin}
        />
      )}
    </div>
  );
};

export default RankingScreen;
