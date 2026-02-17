import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, FileText, LogOut, Info, ChevronRight, Save, X, Shield, Smartphone } from 'lucide-react';

const APP_VERSION = '2.5.0';

const SettingsScreen = ({ onBack, firebaseProfile, userId, onUpdateProfile, onLogout }) => {
  const [editingField, setEditingField] = useState(null); // 'fullName' | 'username' | null
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(() => {
    try { return parseFloat(localStorage.getItem('cultivatec_ttsSpeed') || '1'); } catch { return 1; }
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem('cultivatec_sound') !== 'false'; } catch { return true; }
  });

  const fullName = firebaseProfile?.fullName || firebaseProfile?.username || 'Estudiante';
  const username = firebaseProfile?.username || '';
  const email = firebaseProfile?.email || '';

  const startEditing = (field) => {
    setEditingField(field);
    setEditValue(field === 'fullName' ? fullName : username);
    setSaveSuccess(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSave = async () => {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      if (editingField === 'fullName') {
        await onUpdateProfile({ fullName: editValue.trim() });
      }
      setSaveSuccess(editingField);
      setEditingField(null);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving:', err);
    }
    setSaving(false);
  };

  const handleTtsSpeed = (speed) => {
    setTtsSpeed(speed);
    localStorage.setItem('cultivatec_ttsSpeed', String(speed));
  };

  const handleSoundToggle = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    localStorage.setItem('cultivatec_sound', String(newVal));
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <div className="pb-24 min-h-full bg-[#F7F7F7] w-full animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] px-6 pt-8 pb-10 text-center relative overflow-hidden">
        <div className="absolute top-4 right-6 text-7xl opacity-5 rotate-12">⚙️</div>
        <button onClick={onBack}
          className="absolute top-4 left-4 text-white/80 hover:text-white transition flex items-center bg-white/10 p-2 rounded-xl active:scale-95">
          <ArrowLeft size={18} />
        </button>
        <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/10">
          <User size={32} className="text-purple-200" />
        </div>
        <h1 className="text-2xl font-black text-white">Ajustes</h1>
        <p className="text-white/60 text-sm font-bold mt-1">Personaliza tu experiencia</p>
      </div>

      <div className="px-4 -mt-5 max-w-lg mx-auto relative z-10 space-y-4">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E5E5]">
            <h2 className="text-sm font-black text-[#3C3C3C] flex items-center gap-2">
              <User size={14} className="text-[#2563EB]" /> Perfil
            </h2>
          </div>

          {/* Full Name (Certificate Name) */}
          <div className="px-4 py-3 border-b border-[#F0F0F0]">
            <div className="flex items-center justify-between">
              <div className="flex-grow min-w-0">
                <p className="text-xs font-bold text-[#AFAFAF] mb-0.5">Nombre para certificados</p>
                {editingField === 'fullName' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-grow px-3 py-2 border-2 border-[#2563EB] rounded-xl text-sm font-bold text-[#3C3C3C] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                      autoFocus
                      maxLength={60}
                      onKeyDown={e => e.key === 'Enter' && handleSave()}
                    />
                    <button onClick={handleSave} disabled={saving || !editValue.trim()}
                      className="p-2 bg-[#2563EB] text-white rounded-xl active:scale-95 transition disabled:opacity-50">
                      <Save size={16} />
                    </button>
                    <button onClick={cancelEditing}
                      className="p-2 bg-[#F0F0F0] text-[#777] rounded-xl active:scale-95 transition">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-[#3C3C3C] truncate">{fullName}</p>
                    <button onClick={() => startEditing('fullName')}
                      className="text-xs font-black text-[#2563EB] bg-[#2563EB]/10 px-3 py-1.5 rounded-lg active:scale-95 transition hover:bg-[#2563EB]/20 flex-shrink-0 ml-2">
                      Editar
                    </button>
                  </div>
                )}
                {saveSuccess === 'fullName' && (
                  <p className="text-[10px] text-[#58CC02] font-black mt-1 animate-fade-in">✅ Nombre actualizado correctamente</p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-[#CDCDCD] font-semibold mt-1">Este nombre aparecerá en tus certificados y licencias</p>
          </div>

          {/* Username (read-only) */}
          <div className="px-4 py-3 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold text-[#AFAFAF] mb-0.5">Nombre de usuario</p>
            <p className="text-sm font-black text-[#3C3C3C]">@{username}</p>
            <p className="text-[10px] text-[#CDCDCD] font-semibold mt-0.5">No se puede cambiar</p>
          </div>

          {/* Email (read-only) */}
          <div className="px-4 py-3">
            <p className="text-xs font-bold text-[#AFAFAF] mb-0.5">Correo electrónico</p>
            <p className="text-sm font-black text-[#3C3C3C]">{email}</p>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E5E5]">
            <h2 className="text-sm font-black text-[#3C3C3C] flex items-center gap-2">
              <Smartphone size={14} className="text-[#2563EB]" /> Preferencias
            </h2>
          </div>

          {/* TTS Speed */}
          <div className="px-4 py-3 border-b border-[#F0F0F0]">
            <p className="text-xs font-bold text-[#AFAFAF] mb-2">Velocidad de lectura en voz alta</p>
            <div className="flex items-center gap-2">
              {[
                { value: 0.7, label: 'Lenta' },
                { value: 1, label: 'Normal' },
                { value: 1.3, label: 'Rápida' },
                { value: 1.6, label: 'Muy rápida' },
              ].map(opt => (
                <button key={opt.value} onClick={() => handleTtsSpeed(opt.value)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-black transition active:scale-95 border-2 ${
                    ttsSpeed === opt.value 
                      ? 'bg-[#2563EB] text-white border-[#1D4ED8]' 
                      : 'bg-[#F7F7F7] text-[#777] border-[#E5E5E5] hover:border-[#2563EB]/30'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound effects */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#AFAFAF]">Efectos de sonido</p>
                <p className="text-[10px] text-[#CDCDCD] font-semibold mt-0.5">Sonidos en quizzes y logros</p>
              </div>
              <button onClick={handleSoundToggle}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-[#58CC02]' : 'bg-[#E5E5E5]'
                }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Certificates Info */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E5E5]">
            <h2 className="text-sm font-black text-[#3C3C3C] flex items-center gap-2">
              <FileText size={14} className="text-[#2563EB]" /> Certificados
            </h2>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-[#777] font-semibold leading-relaxed">
              Los certificados se generan con el nombre configurado arriba. Si necesitas cambiar el nombre, 
              edítalo antes de descargar tus certificados desde la sección de <b className="text-[#2563EB]">Licencias</b>.
            </p>
            <div className="mt-2 bg-[#FFF8E1] rounded-xl p-2.5 border border-[#FFE082]">
              <p className="text-[11px] text-[#F59E0B] font-black">💡 Consejo</p>
              <p className="text-[10px] text-[#777] font-semibold mt-0.5">
                Usa tu nombre completo real para que tus certificados tengan validez oficial.
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E5E5E5]">
            <h2 className="text-sm font-black text-[#3C3C3C] flex items-center gap-2">
              <Shield size={14} className="text-[#2563EB]" /> Cuenta
            </h2>
          </div>
          <button onClick={() => setShowLogoutConfirm(true)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-red-50 transition active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                <LogOut size={16} className="text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-red-500">Cerrar sesión</p>
                <p className="text-[10px] text-[#CDCDCD] font-semibold">Tu progreso se guarda en la nube</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-[#CDCDCD]" />
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Info size={12} className="text-[#CDCDCD]" />
            <p className="text-[11px] text-[#CDCDCD] font-bold">CultivaTec v{APP_VERSION}</p>
          </div>
          <p className="text-[10px] text-[#E5E5E5] font-semibold">Programa Educativo de Robótica</p>
          <p className="text-[10px] text-[#E5E5E5] font-semibold mt-0.5">© 2025 CultivaTec. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 animate-scale-in shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-3">
                <LogOut size={28} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black text-[#3C3C3C] mb-1">¿Cerrar sesión?</h2>
              <p className="text-sm text-[#777] font-semibold">No te preocupes, tu progreso está guardado en la nube y podrás continuar donde lo dejaste.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-[#F7F7F7] text-[#777] font-black rounded-xl border-2 border-[#E5E5E5] active:scale-95 transition text-sm">
                Cancelar
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-3 bg-red-500 text-white font-black rounded-xl border-b-4 border-red-700 active:scale-95 transition text-sm">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
