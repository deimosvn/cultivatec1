// ================================================================
// RANKING SCREEN — CultivaTec App
// Ranking global + ranking de amigos
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, Users, Globe, RefreshCw, Star, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { getGlobalRanking, onRankingChange, getFriendsList } from '../firebase/firestore';
import { calculateLevel } from '../firebase/firestore';
import { RobotMini, RobotAvatar } from '../Onboarding';

// Robot avatar for ranking — uses the real personalized robot
const RankingAvatar = ({ config, size = 36 }) => {
  if (!config) {
    // Fallback for users without robot config
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

const RankingEntry = ({ player, rank, isCurrentUser, index }) => {
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
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-black truncate ${isCurrentUser ? 'text-[#2563EB]' : 'text-[#3C3C3C]'}`}>
              {player.username || 'Anónimo'}
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 bg-[#2563EB] text-white text-[8px] font-black rounded-md uppercase">Tú</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-[#AFAFAF]">{lv.emoji} Nv.{lv.level}</span>
            <span className="text-[10px] font-bold text-[#CDCDCD]">·</span>
            <span className="text-[10px] font-bold text-[#AFAFAF]">📚 {player.modulesCompleted || 0} módulos</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[#FFC800]" />
            <span className="text-sm font-black text-[#3C3C3C]">{(player.totalPoints || 0).toLocaleString()}</span>
          </div>
          <span className="text-[9px] font-bold text-[#AFAFAF]">XP</span>
        </div>
      </div>
    </div>
  );
};

const RankingScreen = ({ onBack, currentUserId, currentUserProfile }) => {
  const [tab, setTab] = useState('global'); // 'global' | 'friends'
  const [globalRanking, setGlobalRanking] = useState([]);
  const [friendsRanking, setFriendsRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      // Agregar al usuario actual y ordenar
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
            <p className="text-white/60 text-xs font-bold mt-1">Compite con la comunidad</p>
          </div>
        </div>

        {/* User rank card */}
        {currentUserRank && (
          <div className="px-4 -mt-6 relative z-10">
            <div className="bg-white rounded-2xl p-4 border-2 border-[#2563EB]/20 shadow-lg">
              <div className="flex items-center gap-3">
                <RankBadge rank={currentUserRank.rank} />
                <div className="flex-grow">
                  <p className="text-sm font-black text-[#3C3C3C]">{currentUserProfile?.username || 'Tú'}</p>
                  <p className="text-[10px] font-bold text-[#AFAFAF]">Posición #{currentUserRank.rank} de {currentRanking.length}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#FFC800]" />
                    <span className="text-lg font-black text-[#2563EB]">{(currentUserProfile?.totalPoints || 0).toLocaleString()}</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#AFAFAF]">XP Totales</span>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  </div>
                  {/* 3rd place */}
                  <div className="text-center">
                    <RankingAvatar config={currentRanking[2]?.robotConfig} size={44} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#A0522D] flex items-center justify-center mx-auto mt-1 shadow-md">
                      <span className="text-xs font-black text-white">3</span>
                    </div>
                    <p className="text-[10px] font-black text-[#777] mt-1 truncate max-w-[70px]">{currentRanking[2]?.username}</p>
                    <p className="text-[9px] font-bold text-[#AFAFAF]">{currentRanking[2]?.totalPoints} XP</p>
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
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RankingScreen;
