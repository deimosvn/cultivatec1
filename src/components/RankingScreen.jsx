// ================================================================
// RANKING SCREEN — CultivaTec App
// Ranking global + ranking de amigos + Admin tools
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, Users, Globe, RefreshCw, Star, Zap, Trash2, Gift, X, Award, Palette, Shield, AlertTriangle, Flame, BookOpen, ScrollText, UserPlus, Bell, Check, Clock, UserCheck } from 'lucide-react';
import { getGlobalRanking, onRankingChange, getFriendsList, adminDeleteUser, adminGiftBadge, adminGiftSkin, isAdminEmail, sendFriendRequest, onPendingRequestsChange, acceptFriendRequest, rejectFriendRequest } from '../firebase/firestore';
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
const RankingAvatar = ({ config, size = 36, highlight = false }) => {
  if (!config) {
    const fallbackSize = size;
    return (
      <div className="rounded-xl flex items-center justify-center" style={{
        width: fallbackSize, height: fallbackSize,
        background: 'linear-gradient(135deg, #1E293B, #0F172A)',
        border: '2px solid #334155',
      }}>
        <span style={{ fontSize: fallbackSize * 0.5 }}>🤖</span>
      </div>
    );
  }
  return (
    <div className="rounded-xl flex items-center justify-center overflow-hidden" style={{
      width: size, height: size,
      background: highlight
        ? 'linear-gradient(135deg, #0E7490, #164E63)'
        : 'linear-gradient(135deg, #1E293B, #0F172A)',
      border: highlight ? '2.5px solid #22D3EE' : '2px solid #334155',
      boxShadow: highlight ? '0 0 18px #22D3EE80, 0 0 36px #06B6D440' : 'none',
    }}>
      <RobotAvatar config={config} size={size * 0.85} />
    </div>
  );
};

const RankBadge = ({ rank }) => {
  if (rank === 1) return <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFC800] to-[#FF9600] flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-400/50"><Crown size={16} className="text-white" /></div>;
  if (rank === 2) return <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] flex items-center justify-center shadow-lg shadow-gray-400/20 border border-gray-300/50"><Medal size={16} className="text-white" /></div>;
  if (rank === 3) return <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center shadow-lg shadow-orange-700/20 border border-orange-600/50"><Medal size={16} className="text-white" /></div>;
  return <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center"><span className="text-xs font-black text-[#64748B]">{rank}</span></div>;
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up" style={{ background: 'linear-gradient(180deg, #1E293B, #0F172A)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0E7490, #164E63)' }}>
          <div className="flex items-center gap-3">
            <RankingAvatar config={player.robotConfig} size={44} />
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
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition">
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#334155]">
          {[
            { id: 'actions', icon: <Shield size={14} />, label: 'Acciones' },
            { id: 'badges', icon: <Award size={14} />, label: 'Insignias' },
            { id: 'skins', icon: <Palette size={14} />, label: 'Skins' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-black transition-all border-b-2 ${
                activeTab === t.id ? 'text-[#22D3EE] border-[#22D3EE]' : 'text-[#64748B] border-transparent'
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
              <div className="p-4 rounded-2xl border" style={{ background: '#0F172ACC', borderColor: '#334155' }}>
                <p className="text-sm font-black text-[#22D3EE] mb-2">📋 Información del Usuario</p>
                <div className="space-y-1.5 text-xs font-semibold text-[#94A3B8]">
                  <p>👤 Username: <span className="font-black text-[#E2E8F0]">{player.username}</span></p>
                  <p>📧 Email: <span className="font-black text-[#E2E8F0]">{player.email || 'N/A'}</span></p>
                  <p>⭐ XP: <span className="font-black text-[#E2E8F0]">{(player.totalPoints || 0).toLocaleString()}</span></p>
                  <p>📚 Módulos: <span className="font-black text-[#E2E8F0]">{player.modulesCompleted || 0}</span></p>
                  <p>👥 Amigos: <span className="font-black text-[#E2E8F0]">{player.friendsCount || 0}</span></p>
                  <p>🔥 Racha: <span className="font-black text-[#E2E8F0]">{player.currentStreak || 0} días</span></p>
                  {player.adminBadges?.length > 0 && (
                    <p>🏅 Insignias: <span className="font-black text-[#E2E8F0]">{player.adminBadges.map(b => b.emoji).join(' ')}</span></p>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'badges' ? (
            <div>
              <p className="text-xs font-bold text-[#64748B] mb-3">Selecciona una insignia para regalar a <span className="font-black text-[#E2E8F0]">{player.username}</span>:</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_BADGES.map(badge => {
                  const alreadyHas = player.adminBadges?.some(b => b.id === badge.id);
                  const isGifting = giftingBadge === badge.id;
                  const justGifted = actionDone === `badge_${badge.id}`;
                  return (
                    <button key={badge.id} onClick={() => !alreadyHas && !isGifting && handleGiftBadge(badge)}
                      disabled={alreadyHas || isGifting}
                      className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                        justGifted ? 'border-[#22C55E]/50' :
                        alreadyHas ? 'opacity-40' :
                        'hover:border-[#22D3EE]/50'
                      }`}
                      style={{ background: justGifted ? '#052E1688' : '#0F172A99', borderColor: justGifted ? undefined : '#33415580' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{badge.emoji}</span>
                        <div>
                          <p className="text-xs font-black text-[#E2E8F0]">{badge.name}</p>
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
              <p className="text-xs font-bold text-[#64748B] mb-3">Regala una skin a <span className="font-black text-[#E2E8F0]">{player.username}</span> (se aplicará automáticamente):</p>
              <div className="grid grid-cols-2 gap-2">
                {ROBOT_SKINS.map(skin => {
                  const isGifting = giftingSkin === skin.id;
                  const justGifted = actionDone === `skin_${skin.id}`;
                  return (
                    <button key={skin.id} onClick={() => !isGifting && handleGiftSkin(skin)}
                      disabled={isGifting}
                      className={`p-3 rounded-2xl border transition-all active:scale-95 ${
                        justGifted ? 'border-[#22C55E]/50' : 'hover:border-[#22D3EE]/50'
                      }`}
                      style={{ background: justGifted ? '#052E1688' : '#0F172A99', borderColor: justGifted ? undefined : '#33415580' }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: '#1E293B' }}>
                          <RobotAvatar config={skin.config} size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-[#E2E8F0]">{skin.name}</p>
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
// NOTIFICATIONS PANEL (Friend Requests)
// ============================================
const NotificationsPanel = ({ requests, onAccept, onReject, onClose }) => {
  const [processing, setProcessing] = useState({});

  const handleAccept = async (req) => {
    setProcessing(prev => ({ ...prev, [req.id]: 'accepting' }));
    try { await onAccept(req); } catch (e) { console.error(e); }
    setProcessing(prev => ({ ...prev, [req.id]: 'done' }));
  };

  const handleReject = async (req) => {
    setProcessing(prev => ({ ...prev, [req.id]: 'rejecting' }));
    try { await onReject(req); } catch (e) { console.error(e); }
    setProcessing(prev => ({ ...prev, [req.id]: 'done' }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[75vh] flex flex-col overflow-hidden animate-slide-up" style={{ background: 'linear-gradient(180deg, #1E293B, #0F172A)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#334155]" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Notificaciones</p>
              <p className="text-[10px] font-bold text-white/60">{requests.length} solicitud{requests.length !== 1 ? 'es' : ''} pendiente{requests.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition">
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🔔</div>
              <p className="text-sm font-black text-[#64748B]">Sin notificaciones</p>
              <p className="text-xs font-bold text-[#475569] mt-1">Cuando alguien te envíe una solicitud, aparecerá aquí</p>
            </div>
          ) : (
            requests.map((req, idx) => {
              const status = processing[req.id];
              return (
                <div key={req.id} className="p-4 rounded-2xl border border-[#334155] animate-scale-in" style={{ background: 'linear-gradient(135deg, #1E293BCC, #0F172ACC)', animationDelay: `${idx * 60}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED]/20 to-[#5B21B6]/10 flex items-center justify-center border border-[#7C3AED]/30">
                      <UserPlus size={20} className="text-purple-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-black text-[#E2E8F0] truncate">{req.fromUsername}</p>
                      <p className="text-[10px] font-bold text-[#64748B]">Quiere ser tu amigo</p>
                    </div>
                    {status === 'done' ? (
                      <div className="w-9 h-9 rounded-xl bg-[#059669]/20 flex items-center justify-center">
                        <Check size={18} className="text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleAccept(req)} disabled={!!status}
                          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center active:scale-90 transition shadow-md shadow-green-500/20 disabled:opacity-50">
                          {status === 'accepting' ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check size={16} className="text-white" />
                          )}
                        </button>
                        <button onClick={() => handleReject(req)} disabled={!!status}
                          className="w-9 h-9 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center active:scale-90 transition disabled:opacity-50">
                          {status === 'rejecting' ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X size={16} className="text-[#64748B]" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// USER PROFILE CARD (for non-admin users)
// ============================================
const UserProfileCard = ({ player, onClose, currentUserId, currentUserProfile, friendsUids = [] }) => {
  const lv = calculateLevel(player.totalPoints || 0);
  const skinData = ROBOT_SKINS.find(s => JSON.stringify(s.config) === JSON.stringify(player.robotConfig)) || ROBOT_SKINS[0];
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  const isSelf = player.uid === currentUserId;
  const isFriend = friendsUids.includes(player.uid);

  const WORLD_NAMES = ['Taller del Inventor', 'Fábrica de Autómatas', 'Selva Cibernética', 'Estación Orbital', 'Desierto de los Rovers', 'Aero-Biosfera'];
  const completedMods = player.modulesCompleted || 0;
  const currentWorldIdx = Math.min(Math.floor(completedMods / 16), WORLD_NAMES.length - 1);
  const currentWorldName = completedMods >= 96 ? 'Graduado 🎓' : WORLD_NAMES[currentWorldIdx];

  const handleAddFriend = async () => {
    if (!currentUserId || !currentUserProfile || isSelf || isFriend || requestStatus) return;
    setSendingRequest(true);
    try {
      await sendFriendRequest(currentUserId, currentUserProfile.username, player.uid, player.username);
      setRequestStatus('sent');
    } catch (e) {
      if (e.message?.includes('Ya son amigos')) setRequestStatus('already_friends');
      else if (e.message?.includes('Ya enviaste')) setRequestStatus('already_sent');
      else setRequestStatus('error');
    }
    setSendingRequest(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl animate-scale-in" style={{ background: 'linear-gradient(180deg, #1E293B, #0F172A)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="relative px-5 pt-4 pb-6 text-center rounded-t-3xl" style={{ background: 'linear-gradient(135deg, #0E7490, #164E63, #0B1120)' }}>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition z-10">
            <X size={16} className="text-white" />
          </button>
          <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
            <div className="absolute inset-[-16px] rounded-full animate-pulse" style={{ background: `radial-gradient(circle, ${skinData.rarityColor}35, transparent 70%)` }} />
            <div className="w-full h-full rounded-[28px] border-2 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderColor: `${skinData.rarityColor}50`, boxShadow: `0 0 40px ${skinData.rarityColor}30` }}>
              <RobotAvatar config={player.robotConfig} size={140} />
            </div>
          </div>
          <div className="inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-black text-white" style={{ backgroundColor: skinData.rarityColor }}>
            {skinData.name} · {skinData.rarityLabel}
          </div>
        </div>

        {/* Username */}
        <div className="px-5 pt-4 pb-2 text-center">
          <h3 className="text-xl font-black text-white leading-snug">{player.username || 'Anónimo'}</h3>
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1">
            {isAdminEmail(player.email) && (
              <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#FF4B4B] to-[#FF9600] text-white text-[7px] font-black rounded-md uppercase">ADMIN</span>
            )}
            {player.adminBadges?.map(b => (
              <span key={b.id} title={b.name} className="text-lg">{b.emoji}</span>
            ))}
          </div>
          <p className="text-xs font-bold text-cyan-400 mt-1">{lv.emoji} Nivel {lv.level} · {lv.title}</p>
          <div className="mt-2 flex items-center gap-2 max-w-[200px] mx-auto">
            <div className="flex-grow h-1.5 bg-[#0F172A] rounded-full overflow-hidden border border-[#334155]/50">
              <div className="h-full rounded-full transition-all" style={{ width: `${lv.progress * 100}%`, background: lv.isMaxLevel ? 'linear-gradient(90deg, #FFC800, #FF9600)' : 'linear-gradient(90deg, #22D3EE, #06B6D4)' }} />
            </div>
            <span className="text-[8px] font-bold text-[#475569]">{lv.isMaxLevel ? 'MAX' : `${Math.round(lv.progress * 100)}%`}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1.5 px-5 mb-3">
          <div className="p-2.5 rounded-xl border border-orange-500/20 text-center" style={{ background: 'linear-gradient(135deg, #7C2D1210, #9A341208)' }}>
            <Flame size={16} className="text-orange-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-orange-300">{player.currentStreak || 0}</p>
            <p className="text-[8px] font-bold text-gray-500">Racha</p>
          </div>
          <div className="p-2.5 rounded-xl border border-cyan-500/20 text-center" style={{ background: 'linear-gradient(135deg, #0E749010, #164E6308)' }}>
            <Star size={16} className="text-cyan-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-cyan-300">{((player.totalPoints || 0) / 1000).toFixed(1)}k</p>
            <p className="text-[8px] font-bold text-gray-500">XP</p>
          </div>
          <div className="p-2.5 rounded-xl border border-green-500/20 text-center" style={{ background: 'linear-gradient(135deg, #14532D10, #16653408)' }}>
            <BookOpen size={16} className="text-green-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-green-300">{completedMods}</p>
            <p className="text-[8px] font-bold text-gray-500">Módulos</p>
          </div>
          <div className="p-2.5 rounded-xl border border-purple-500/20 text-center" style={{ background: 'linear-gradient(135deg, #581C8710, #6B21A808)' }}>
            <Users size={16} className="text-purple-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-purple-300">{player.friendsCount || 0}</p>
            <p className="text-[8px] font-bold text-gray-500">Amigos</p>
          </div>
        </div>

        {/* Current world */}
        <div className="p-3 mx-5 rounded-xl border border-[#334155] mb-3" style={{ background: '#0F172ACC' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400">📍 Mundo actual</span>
            <span className="text-xs font-black text-cyan-300">{currentWorldName}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 px-5 pb-6">
          {!isSelf && (
            isFriend || requestStatus === 'already_friends' ? (
              <div className="w-full py-3 rounded-xl bg-[#059669]/15 border border-[#059669]/30 text-center">
                <div className="flex items-center justify-center gap-2">
                  <UserCheck size={16} className="text-emerald-400" />
                  <span className="text-sm font-black text-emerald-400">Ya son amigos</span>
                </div>
              </div>
            ) : requestStatus === 'sent' || requestStatus === 'already_sent' ? (
              <div className="w-full py-3 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock size={16} className="text-cyan-400" />
                  <span className="text-sm font-black text-cyan-400">Solicitud enviada</span>
                </div>
              </div>
            ) : requestStatus === 'error' ? (
              <div className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                <span className="text-sm font-black text-red-400">Error al enviar solicitud</span>
              </div>
            ) : (
              <button onClick={handleAddFriend} disabled={sendingRequest}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#4CAF00] text-white font-black text-sm active:scale-95 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50">
                {sendingRequest ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><UserPlus size={16} /> Agregar Amigo</>
                )}
              </button>
            )
          )}
          <button onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-gray-400 font-black text-sm active:scale-95 transition-all">
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

// ============================================
// RANKING ENTRY
// ============================================
const RankingEntry = ({ player, rank, isCurrentUser, index, isAdmin, onAdminAction, onViewProfile }) => {
  const lv = calculateLevel(player.totalPoints || 0);

  return (
    <div className="animate-scale-in" style={{
      animationDelay: `${index * 40}ms`,
      ...(isCurrentUser ? {
        position: 'relative',
        zIndex: 2,
        transform: 'scale(1.03)',
      } : {}),
    }}>
      {/* Animated glow ring behind current user */}
      {isCurrentUser && (
        <div style={{
          position: 'absolute', inset: -3, borderRadius: 20,
          background: 'linear-gradient(135deg, #22D3EE55, #06B6D433, #22D3EE55)',
          animation: 'pulseGlow 2s ease-in-out infinite',
          zIndex: -1,
        }} />
      )}
      <div
        className="flex items-center gap-3 rounded-2xl border transition-all"
        style={{
          padding: isCurrentUser ? '12px 14px' : '12px',
          background: isCurrentUser
            ? 'linear-gradient(135deg, #164E6320, #0E749018, #06B6D410)'
            : rank <= 3
              ? 'linear-gradient(135deg, #1E293BCC, #0F172ACC)'
              : '#1E293B99',
          borderColor: isCurrentUser
            ? '#22D3EE60'
            : rank <= 3
              ? '#FFC80030'
              : '#33415580',
          boxShadow: isCurrentUser
            ? '0 4px 24px #22D3EE30, inset 0 1px 0 #22D3EE20'
            : rank <= 3
              ? '0 2px 12px #FFC80010'
              : 'none',
        }}
      >
        <RankBadge rank={rank} />
        <div className="cursor-pointer" onClick={() => onViewProfile && onViewProfile(player)}>
          <RankingAvatar config={player.robotConfig} size={isCurrentUser ? 68 : 52} highlight={isCurrentUser} />
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`font-black truncate ${isCurrentUser ? 'text-[15px] text-[#22D3EE]' : 'text-sm text-[#E2E8F0]'}`}>
              {player.username || 'Anónimo'}
            </span>
            {isCurrentUser && (
              <span className="px-2 py-0.5 text-[#0F172A] text-[8px] font-black rounded-md uppercase" style={{
                background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
                boxShadow: '0 2px 10px #22D3EE60',
                animation: 'pulseBadge 2s ease-in-out infinite',
                letterSpacing: '0.5px',
              }}>⭐ Tú</span>
            )}
            {isAdminEmail(player.email) && (
              <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#FF4B4B] to-[#FF9600] text-white text-[7px] font-black rounded-md uppercase tracking-wider">ADMIN</span>
            )}
            {player.adminBadges?.map(b => (
              <span key={b.id} title={b.name} className="text-sm">{b.emoji}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-[#64748B]">{lv.emoji} Nv.{lv.level}</span>
            <span className="text-[10px] font-bold text-[#475569]">·</span>
            <span className="text-[10px] font-bold text-[#64748B] truncate">{lv.title}</span>
          </div>
          {/* XP Progress bar */}
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex-grow h-1.5 bg-[#0F172A] rounded-full overflow-hidden border border-[#334155]/50">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${lv.progress * 100}%`,
                  background: lv.isMaxLevel
                    ? 'linear-gradient(90deg, #FFC800, #FF9600)'
                    : isCurrentUser
                      ? 'linear-gradient(90deg, #22D3EE, #06B6D4)'
                      : 'linear-gradient(90deg, #3B82F6, #2563EB)',
                }}
              />
            </div>
            <span className="text-[8px] font-bold text-[#475569] flex-shrink-0">
              {lv.isMaxLevel ? 'MAX' : `${Math.round(lv.progress * 100)}%`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1">
              <Star size={isCurrentUser ? 14 : 12} className="text-[#FFC800]" />
              <span className={`font-black ${isCurrentUser ? 'text-[15px] text-[#22D3EE]' : 'text-sm text-[#E2E8F0]'}`}>{(player.totalPoints || 0).toLocaleString()}</span>
            </div>
            <span className="text-[9px] font-bold text-[#475569]">XP</span>
          </div>
          {isAdmin && !isCurrentUser && (
            <button onClick={() => onAdminAction(player)}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-md active:scale-90 transition border border-[#818CF8]/30">
              <Shield size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper: wrap podium avatar with click
const PodiumAvatar = ({ player, size, onViewProfile }) => (
  <div className="cursor-pointer" onClick={() => onViewProfile && onViewProfile(player)}>
    <RankingAvatar config={player?.robotConfig} size={size} />
  </div>
);

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
  const [profileTarget, setProfileTarget] = useState(null); // user profile card for non-admin view
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendsUids, setFriendsUids] = useState([]);

  // Cargar ranking global en tiempo real
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onRankingChange(50, (ranking) => {
      setGlobalRanking(ranking);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for pending friend requests in real-time
  useEffect(() => {
    if (!currentUserId) return;
    const unsub = onPendingRequestsChange(currentUserId, (reqs) => {
      setPendingRequests(reqs);
    });
    return () => unsub();
  }, [currentUserId]);

  // Load friends UIDs for profile card
  useEffect(() => {
    if (!currentUserId) return;
    const loadFriendsUids = async () => {
      try {
        const friends = await getFriendsList(currentUserId);
        setFriendsUids(friends.map(f => f.uid));
      } catch (e) { console.warn(e); }
    };
    loadFriendsUids();
  }, [currentUserId]);

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

  // Notification handlers
  const handleNotifAccept = async (req) => {
    try {
      await acceptFriendRequest(req.id, req.fromUid, req.toUid, req.fromUsername, currentUserProfile?.username);
      // Refresh friends list
      const friends = await getFriendsList(currentUserId);
      setFriendsUids(friends.map(f => f.uid));
    } catch (e) { console.error('Error accepting request:', e); }
  };

  const handleNotifReject = async (req) => {
    try {
      await rejectFriendRequest(req.id);
    } catch (e) { console.error('Error rejecting request:', e); }
  };

  const currentRanking = tab === 'global' ? globalRanking : friendsRanking;
  const currentUserRank = currentRanking.find(p => p.uid === currentUserId);

  return (
    <div className="pb-24 min-h-full flex flex-col animate-fade-in" style={{ background: 'linear-gradient(180deg, #0B1120 0%, #0E1A30 50%, #0F172A 100%)' }}>
      {/* Keyframes for current user highlight animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.01); }
        }
        @keyframes pulseBadge {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 10px #22D3EE60; }
          50% { transform: scale(1.1); box-shadow: 0 2px 16px #22D3EE90; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="px-6 pt-6 pb-14" style={{ background: 'linear-gradient(135deg, #0E7490 0%, #164E63 40%, #0B1120 100%)' }}>
          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#22D3EE 1px, transparent 1px), linear-gradient(90deg, #22D3EE 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#22D3EE]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#06B6D4]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          {onBack && (
            <button onClick={onBack} className="text-[#94A3B8] hover:text-white mb-4 flex items-center text-sm font-black active:scale-95 transition relative z-10">
              <ArrowLeft size={18} className="mr-1" /> Volver
            </button>
          )}

          {/* Notification Bell */}
          <button onClick={() => setShowNotifications(true)} className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:scale-90 transition-all hover:bg-white/15">
            <Bell size={20} className="text-white/80" />
            {pendingRequests.length > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50" style={{ animation: 'pulseBadge 2s ease-in-out infinite' }}>
                <span className="text-[9px] font-black text-white px-1">{pendingRequests.length}</span>
              </div>
            )}
          </button>

          <div className="relative z-10 text-center">
            <div className="text-5xl mb-2" style={{ animation: 'float 3s ease-in-out infinite' }}>🏆</div>
            <h1 className="text-2xl font-black text-white tracking-tight">Ranking</h1>
            <p className="text-[#94A3B8] text-xs font-bold mt-1">
              {isAdmin ? '🛡️ Modo Administrador Activo' : 'Compite con la comunidad'}
            </p>
          </div>
        </div>

        {/* User rank card */}
        {currentUserRank && (() => {
          const myLv = calculateLevel(currentUserProfile?.totalPoints || 0);
          return (
          <div className="px-4 -mt-7 relative z-10">
            <div className="rounded-2xl p-4 border shadow-xl" style={{ background: 'linear-gradient(135deg, #1E293BEE, #0F172AEE)', borderColor: '#22D3EE40', boxShadow: '0 8px 32px #0B112080, 0 0 20px #22D3EE15' }}>
              <div className="flex items-center gap-3">
                <RankBadge rank={currentUserRank.rank} />
                <RankingAvatar config={currentUserProfile?.robotConfig} size={48} highlight={true} />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black text-[#E2E8F0]">{currentUserProfile?.username || 'Tú'}</p>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#FF4B4B] to-[#FF9600] text-white text-[7px] font-black rounded-md uppercase tracking-wider">ADMIN</span>
                    )}
                    {currentUserProfile?.adminBadges?.map(b => (
                      <span key={b.id} title={b.name} className="text-sm">{b.emoji}</span>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-[#64748B]">Posición #{currentUserRank.rank} de {currentRanking.length}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-[#22D3EE]">{myLv.emoji} Nv.{myLv.level}</span>
                    <span className="text-[10px] font-bold text-[#64748B]">{myLv.title}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#FFC800]" />
                    <span className="text-lg font-black text-[#22D3EE]">{(currentUserProfile?.totalPoints || 0).toLocaleString()}</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#475569]">XP Totales</span>
                </div>
              </div>
              {/* Level progress bar */}
              <div className="mt-3 pt-3 border-t border-[#334155]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#64748B]">Nv.{myLv.level}</span>
                  <span className="text-[10px] font-bold text-[#475569]">
                    {myLv.isMaxLevel
                      ? '¡Nivel máximo alcanzado!'
                      : `${myLv.xpInLevel.toLocaleString()} / ${myLv.xpNeeded.toLocaleString()} XP`}
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B]">{myLv.isMaxLevel ? `Nv.${myLv.level}` : `Nv.${myLv.level + 1}`}</span>
                </div>
                <div className="w-full h-2.5 bg-[#0F172A] rounded-full overflow-hidden border border-[#334155]/50">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${myLv.progress * 100}%`,
                      background: myLv.isMaxLevel
                        ? 'linear-gradient(90deg, #FFC800, #FF9600, #FFC800)'
                        : 'linear-gradient(90deg, #22D3EE, #06B6D4, #0891B2)',
                    }}
                  />
                </div>
                {!myLv.isMaxLevel && (
                  <p className="text-[9px] font-bold text-[#475569] text-center mt-1">
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
        <div className="flex gap-2 flex-grow bg-[#0F172A]/80 rounded-2xl p-1.5 border border-[#334155]/50">
          <button
            onClick={() => setTab('global')}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              tab === 'global'
                ? 'bg-[#22D3EE] text-[#0F172A] shadow-lg shadow-[#22D3EE]/30'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Globe size={14} /> Global
          </button>
          <button
            onClick={() => setTab('friends')}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
              tab === 'friends'
                ? 'bg-[#22D3EE] text-[#0F172A] shadow-lg shadow-[#22D3EE]/30'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Users size={14} /> Amigos
          </button>
        </div>
        <button onClick={handleRefresh} className={`w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center transition-all active:scale-90 ${refreshing ? 'animate-spin' : ''}`}>
          <RefreshCw size={16} className="text-[#64748B]" />
        </button>
      </div>

      {/* Ranking List */}
      <div className="px-4 space-y-2 pb-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-black text-[#64748B]">Cargando ranking...</p>
          </div>
        ) : currentRanking.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">{tab === 'friends' ? '👥' : '🏆'}</span>
            <p className="text-sm font-black text-[#64748B]">
              {tab === 'friends'
                ? 'Agrega amigos para ver su ranking'
                : 'Sé el primero en el ranking'}
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 podium (only global) */}
            {tab === 'global' && currentRanking.length >= 3 && (
              <div className="rounded-2xl p-4 border mb-3" style={{ background: 'linear-gradient(135deg, #1E293BCC, #0F172ACC)', borderColor: '#FFC80025' }}>
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd place */}
                  <div className="text-center">
                    <PodiumAvatar player={currentRanking[1]} size={60} onViewProfile={(p) => setProfileTarget(p)} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] flex items-center justify-center mx-auto mt-1 shadow-md shadow-gray-500/20">
                      <span className="text-xs font-black text-white">2</span>
                    </div>
                    <p className="text-[10px] font-black text-[#94A3B8] mt-1 truncate max-w-[70px]">{currentRanking[1]?.username}</p>
                    <p className="text-[9px] font-bold text-[#475569]">{currentRanking[1]?.totalPoints} XP</p>
                    {currentRanking[1]?.adminBadges?.length > 0 && (
                      <div className="flex justify-center gap-0.5">{currentRanking[1].adminBadges.map(b => <span key={b.id} className="text-xs">{b.emoji}</span>)}</div>
                    )}
                  </div>
                  {/* 1st place */}
                  <div className="text-center -mb-2">
                    <div className="text-2xl mb-1" style={{ animation: 'float 2s ease-in-out infinite' }}>👑</div>
                    <PodiumAvatar player={currentRanking[0]} size={80} onViewProfile={(p) => setProfileTarget(p)} />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC800] to-[#FF9600] flex items-center justify-center mx-auto mt-1 shadow-lg shadow-amber-500/30">
                      <span className="text-sm font-black text-white">1</span>
                    </div>
                    <p className="text-xs font-black text-[#E2E8F0] mt-1 truncate max-w-[80px]">{currentRanking[0]?.username}</p>
                    <p className="text-[10px] font-bold text-[#FFC800]">{currentRanking[0]?.totalPoints} XP</p>
                    {currentRanking[0]?.adminBadges?.length > 0 && (
                      <div className="flex justify-center gap-0.5">{currentRanking[0].adminBadges.map(b => <span key={b.id} className="text-xs">{b.emoji}</span>)}</div>
                    )}
                  </div>
                  {/* 3rd place */}
                  <div className="text-center">
                    <PodiumAvatar player={currentRanking[2]} size={60} onViewProfile={(p) => setProfileTarget(p)} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center mx-auto mt-1 shadow-md shadow-orange-700/20">
                      <span className="text-xs font-black text-white">3</span>
                    </div>
                    <p className="text-[10px] font-black text-[#94A3B8] mt-1 truncate max-w-[70px]">{currentRanking[2]?.username}</p>
                    <p className="text-[9px] font-bold text-[#475569]">{currentRanking[2]?.totalPoints} XP</p>
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
                onViewProfile={(p) => setProfileTarget(p)}
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

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel
          requests={pendingRequests}
          onAccept={handleNotifAccept}
          onReject={handleNotifReject}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* User Profile Card Modal */}
      {profileTarget && (
        <UserProfileCard
          player={profileTarget}
          onClose={() => setProfileTarget(null)}
          currentUserId={currentUserId}
          currentUserProfile={currentUserProfile}
          friendsUids={friendsUids}
        />
      )}
    </div>
  );
};

export default RankingScreen;
