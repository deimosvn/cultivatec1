// ================================================================
// FRIENDS SCREEN — CultivaTec App
// Sistema de amigos: buscar, agregar, solicitudes, lista
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Search, UserPlus, UserCheck, UserX, Users, Clock,
  Star, Check, X, MessageCircle, ChevronRight, Bell, Trash2, RefreshCw
} from 'lucide-react';
import {
  searchUserByUsername, sendFriendRequest, getPendingFriendRequests,
  acceptFriendRequest, rejectFriendRequest, getFriendsList, removeFriend,
  onPendingRequestsChange, onFriendsChange, calculateLevel,
} from '../firebase/firestore';
import { RobotAvatar } from '../Onboarding';

const FriendAvatar = ({ config, size = 44 }) => {
  if (!config) {
    return (
      <div className="rounded-2xl flex items-center justify-center" style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #3B82F6, #3B82F688)',
        border: '2px solid #3B82F655',
      }}>
        <span style={{ fontSize: size * 0.45 }}>🤖</span>
      </div>
    );
  }
  return (
    <div className="rounded-2xl flex items-center justify-center overflow-hidden" style={{
      width: size, height: size,
      background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
      border: '2px solid #C7D2FE',
    }}>
      <RobotAvatar config={config} size={size * 0.85} />
    </div>
  );
};

const FriendCard = ({ friend, onRemove }) => {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const lv = calculateLevel(friend.totalPoints || 0);

  return (
    <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden transition-all animate-scale-in">
      <div className="p-4 flex items-center gap-3">
        <FriendAvatar config={friend.robotConfig} />
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-[#3C3C3C] truncate">{friend.username}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-[#AFAFAF]">{lv.emoji} Nv.{lv.level} — {lv.title}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] font-bold text-[#CDCDCD] flex items-center gap-0.5">
              <Star size={10} className="text-[#FFC800]" /> {(friend.totalPoints || 0).toLocaleString()} XP
            </span>
            <span className="text-[10px] font-bold text-[#CDCDCD]">
              📚 {friend.modulesCompleted || 0} módulos
            </span>
            <span className="text-[10px] font-bold text-[#CDCDCD]">
              🧩 {friend.challengesCompleted || 0} retos
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowConfirmRemove(!showConfirmRemove)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#CDCDCD] hover:text-red-400 hover:bg-red-50 transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {showConfirmRemove && (
        <div className="px-4 pb-3 flex gap-2 animate-fade-in">
          <button
            onClick={() => { onRemove(friend.uid); setShowConfirmRemove(false); }}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-black border-2 border-red-200 active:scale-95 transition"
          >
            Eliminar amigo
          </button>
          <button
            onClick={() => setShowConfirmRemove(false)}
            className="flex-1 py-2 rounded-xl bg-[#F7F7F7] text-[#AFAFAF] text-xs font-black border-2 border-[#E5E5E5] active:scale-95 transition"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

const RequestCard = ({ request, onAccept, onReject, index }) => {
  const [processing, setProcessing] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-[#1CB0F6]/20 p-4 animate-scale-in" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1CB0F6] to-[#0D8ECF] flex items-center justify-center">
          <UserPlus size={18} className="text-white" />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-black text-[#3C3C3C] truncate">{request.fromUsername}</p>
          <p className="text-[10px] font-bold text-[#AFAFAF]">Quiere ser tu amigo</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={async () => {
              setProcessing(true);
              await onAccept(request);
              setProcessing(false);
            }}
            disabled={processing}
            className="w-9 h-9 rounded-xl bg-[#58CC02] flex items-center justify-center active:scale-90 transition shadow-[0_3px_0_#46A302] disabled:opacity-50"
          >
            <Check size={16} className="text-white" />
          </button>
          <button
            onClick={async () => {
              setProcessing(true);
              await onReject(request);
              setProcessing(false);
            }}
            disabled={processing}
            className="w-9 h-9 rounded-xl bg-[#E5E5E5] flex items-center justify-center active:scale-90 transition disabled:opacity-50"
          >
            <X size={16} className="text-[#777]" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FriendsScreen = ({ onBack, currentUserId, currentUserProfile }) => {
  const [tab, setTab] = useState('friends'); // 'friends' | 'requests' | 'search'
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null); // null | 'not_found' | user object
  const [searching, setSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar amigos y solicitudes en tiempo real
  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);
    const unsubFriends = onFriendsChange(currentUserId, (friendsList) => {
      setFriends(friendsList);
      setLoading(false);
    });

    const unsubRequests = onPendingRequestsChange(currentUserId, (requests) => {
      setPendingRequests(requests);
    });

    return () => {
      unsubFriends();
      unsubRequests();
    };
  }, [currentUserId]);

  // Buscar usuario
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setError('');
    setSearching(true);
    setSearchResult(null);
    setRequestSent(false);

    try {
      const user = await searchUserByUsername(searchQuery.trim());
      if (!user) {
        setSearchResult('not_found');
      } else if (user.uid === currentUserId) {
        setError('¡No puedes agregarte a ti mismo!');
      } else {
        setSearchResult(user);
      }
    } catch (err) {
      setError('Error al buscar usuario.');
      console.error(err);
    }
    setSearching(false);
  };

  // Enviar solicitud
  const handleSendRequest = async (toUser) => {
    if (!currentUserId || !currentUserProfile) return;
    setSendingRequest(true);
    setError('');
    try {
      await sendFriendRequest(
        currentUserId,
        currentUserProfile.username,
        toUser.uid,
        toUser.username
      );
      setRequestSent(true);
    } catch (err) {
      setError(err.message || 'Error al enviar solicitud.');
    }
    setSendingRequest(false);
  };

  // Aceptar solicitud
  const handleAccept = async (request) => {
    try {
      await acceptFriendRequest(
        request.id,
        request.fromUid,
        request.toUid,
        request.fromUsername,
        request.toUsername || currentUserProfile?.username
      );
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  };

  // Rechazar solicitud
  const handleReject = async (request) => {
    try {
      await rejectFriendRequest(request.id);
    } catch (err) {
      console.error('Error rejecting friend request:', err);
    }
  };

  // Eliminar amigo
  const handleRemoveFriend = async (friendUid) => {
    try {
      await removeFriend(currentUserId, friendUid);
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  return (
    <div className="pb-24 min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-[#58CC02] via-[#6BD600] to-[#89E219] px-6 pt-6 pb-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          {onBack && (
            <button onClick={onBack} className="text-[#3C3C3C]/50 hover:text-[#3C3C3C] mb-4 flex items-center text-sm font-black active:scale-95 transition relative z-10">
              <ArrowLeft size={18} className="mr-1" /> Volver
            </button>
          )}
          <div className="relative z-10 text-center">
            <div className="text-5xl mb-2">👥</div>
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow">Amigos</h1>
            <p className="text-white/70 text-xs font-bold mt-1">Conecta y compite con tus amigos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 -mt-5 relative z-10">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-2xl p-3 text-center border-2 border-[#E5E5E5] shadow-sm">
              <span className="text-2xl block mb-0.5">🤝</span>
              <span className="text-lg font-black text-[#3C3C3C]">{friends.length}</span>
              <span className="text-[9px] font-bold text-[#AFAFAF] block">Amigos</span>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center border-2 border-[#E5E5E5] shadow-sm relative">
              <span className="text-2xl block mb-0.5">📩</span>
              <span className="text-lg font-black text-[#3C3C3C]">{pendingRequests.length}</span>
              <span className="text-[9px] font-bold text-[#AFAFAF] block">Solicitudes</span>
              {pendingRequests.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[9px] font-black text-white">{pendingRequests.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'friends', icon: <Users size={14} />, label: 'Mis Amigos' },
          { id: 'requests', icon: <Bell size={14} />, label: `Solicitudes${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}` },
          { id: 'search', icon: <Search size={14} />, label: 'Buscar' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 border-2 whitespace-nowrap ${
              tab === t.id
                ? 'bg-[#58CC02] text-white border-[#46A302] shadow-md'
                : 'bg-white text-[#AFAFAF] border-[#E5E5E5]'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-6 mt-2">
        {/* FRIENDS TAB */}
        {tab === 'friends' && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-black text-[#AFAFAF]">Cargando amigos...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">🔍</span>
                <p className="text-sm font-black text-[#AFAFAF] mb-2">Aún no tienes amigos</p>
                <p className="text-xs text-[#CDCDCD] font-bold mb-4">Busca usuarios por su nombre y envía solicitudes</p>
                <button
                  onClick={() => setTab('search')}
                  className="px-6 py-3 bg-[#58CC02] text-white rounded-2xl text-sm font-black shadow-[0_4px_0_#46A302] active:scale-95 active:shadow-[0_2px_0_#46A302] active:translate-y-[2px] transition-all"
                >
                  <Search size={14} className="inline mr-1" /> Buscar Amigos
                </button>
              </div>
            ) : (
              friends.map(friend => (
                <FriendCard
                  key={friend.uid}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                />
              ))
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {tab === 'requests' && (
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">📭</span>
                <p className="text-sm font-black text-[#AFAFAF]">No tienes solicitudes pendientes</p>
              </div>
            ) : (
              pendingRequests.map((req, idx) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  index={idx}
                />
              ))
            )}
          </div>
        )}

        {/* SEARCH TAB */}
        {tab === 'search' && (
          <div className="space-y-4">
            {/* Search input */}
            <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4">
              <p className="text-xs font-bold text-[#AFAFAF] mb-3">Busca a un usuario por su nombre exacto</p>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CDCDCD]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Nombre de usuario..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#E5E5E5] rounded-xl text-sm font-bold text-[#3C3C3C] placeholder-[#CDCDCD] focus:outline-none focus:border-[#58CC02] transition"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-5 py-3 bg-[#58CC02] text-white rounded-xl text-sm font-black shadow-[0_3px_0_#46A302] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searching ? '...' : 'Buscar'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-xs font-bold text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Search Result */}
            {searchResult === 'not_found' && (
              <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 text-center">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-sm font-black text-[#AFAFAF]">Usuario no encontrado</p>
                <p className="text-xs text-[#CDCDCD] font-bold mt-1">Verifica que el nombre sea exacto</p>
              </div>
            )}

            {searchResult && searchResult !== 'not_found' && (
              <div className="bg-white rounded-2xl border-2 border-[#58CC02]/30 p-4 animate-scale-in">
                <div className="flex items-center gap-3">
                  <FriendAvatar config={searchResult.robotConfig} size={48} />
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-black text-[#3C3C3C] truncate">{searchResult.username}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-[#AFAFAF]">
                        {calculateLevel(searchResult.totalPoints || 0).emoji} Nv.{calculateLevel(searchResult.totalPoints || 0).level}
                      </span>
                      <span className="text-[10px] font-bold text-[#CDCDCD]">·</span>
                      <span className="text-[10px] font-bold text-[#AFAFAF]">
                        <Star size={9} className="inline text-[#FFC800]" /> {searchResult.totalPoints || 0} XP
                      </span>
                    </div>
                  </div>
                  {requestSent ? (
                    <div className="flex items-center gap-1 px-3 py-2 bg-[#D7FFB8] rounded-xl">
                      <Check size={14} className="text-[#58CC02]" />
                      <span className="text-xs font-black text-[#58CC02]">Enviada</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(searchResult)}
                      disabled={sendingRequest}
                      className="flex items-center gap-1 px-4 py-2.5 bg-[#58CC02] text-white rounded-xl text-xs font-black shadow-[0_3px_0_#46A302] active:scale-95 transition disabled:opacity-50"
                    >
                      {sendingRequest ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><UserPlus size={14} /> Agregar</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsScreen;
