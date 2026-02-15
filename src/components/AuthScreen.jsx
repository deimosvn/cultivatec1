// ================================================================
// AUTH SCREEN — CultivaTec App
// Pantalla de Login/Registro con estilo Duolingo
// ================================================================

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, Zap, Bot, Sparkles, FileText } from 'lucide-react';

const AuthScreen = ({ onLogin, onRegister, isLoading, error }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateUsername = (u) => /^[a-zA-Z0-9_]{3,20}$/.test(u);

  const handleSubmit = () => {
    setLocalError('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setLocalError('Completa todos los campos.');
        return;
      }
      onLogin(email.trim(), password);
    } else {
      if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setLocalError('Completa todos los campos.');
        return;
      }
      if (!validateUsername(username)) {
        setLocalError('El nombre de usuario debe tener 3-20 caracteres (letras, números, _).');
        return;
      }
      if (!validateEmail(email)) {
        setLocalError('Ingresa un email válido.');
        return;
      }
      if (password.length < 8) {
        setLocalError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Las contraseñas no coinciden.');
        return;
      }
      onRegister(email.trim(), password, username.trim(), fullName.trim());
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 40%, #3B82F6 70%, #60A5FA 100%)',
    }}>
      {/* Decoraciones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse" style={{
            width: 30 + i * 20, height: 30 + i * 20,
            background: `radial-gradient(circle, rgba(255,255,255,${0.08 - i * 0.01}), transparent 70%)`,
            left: `${10 + i * 15}%`, top: `${5 + Math.sin(i * 1.2) * 30}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }} />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-12 pb-6 px-6">
        <div className="inline-block relative mb-0">
          <img src="/icono.png" alt="CultivaTec" className="w-40 h-40 object-contain mb-[-12px]" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} />
          <div className="absolute -right-2 top-2 text-xl animate-spin" style={{ animationDuration: '3s' }}>⚡</div>
        </div>
        <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-tight">CultivaTec</h1>
        <p className="text-white/70 text-sm font-bold mt-1">¡Aprende Robótica Jugando!</p>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-grow flex items-start justify-center px-5 pb-8">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="flex rounded-2xl overflow-hidden mb-5 border-2 border-white/20">
            <button
              onClick={() => { setMode('login'); setLocalError(''); }}
              className={`flex-1 py-3 text-sm font-black transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#2563EB]'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('register'); setLocalError(''); }}
              className={`flex-1 py-3 text-sm font-black transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#2563EB]'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl border-b-4 border-gray-100">
            <h2 className="text-xl font-black text-[#3C3C3C] mb-1 text-center">
              {mode === 'login' ? '¡Bienvenido de vuelta!' : '¡Crea tu cuenta!'}
            </h2>
            <p className="text-xs text-[#AFAFAF] font-bold text-center mb-5">
              {mode === 'login'
                ? 'Ingresa tus datos para continuar'
                : 'Únete a la comunidad de roboticistas'}
            </p>

            <div className="space-y-3">
              {/* Username (solo register) */}
              {mode === 'register' && (
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="Nombre de usuario"
                    maxLength={20}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-[#E5E5E5] rounded-2xl text-sm font-bold text-[#3C3C3C] placeholder-[#CDCDCD] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              )}

              {/* Nombre completo (solo register) */}
              {mode === 'register' && (
                <div>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nombre completo"
                      maxLength={60}
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-[#E5E5E5] rounded-2xl text-sm font-bold text-[#3C3C3C] placeholder-[#CDCDCD] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-[#AFAFAF] font-semibold mt-1 ml-2">📜 Este nombre aparecerá en tu certificado oficial</p>
                </div>
              )}

              {/* Email / Username (login) or Email (register) */}
              <div className="relative">
                {mode === 'login' ? (
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
                ) : (
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
                )}
                <input
                  type={mode === 'register' ? 'email' : 'text'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' ? 'Email o nombre de usuario' : 'Correo electrónico'}
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-[#E5E5E5] rounded-2xl text-sm font-bold text-[#3C3C3C] placeholder-[#CDCDCD] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-10 pr-12 py-3.5 border-2 border-[#E5E5E5] rounded-2xl text-sm font-bold text-[#3C3C3C] placeholder-[#CDCDCD] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF] hover:text-[#777] transition p-0.5"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Confirm Password (solo register) */}
              {mode === 'register' && (
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-[#E5E5E5] rounded-2xl text-sm font-bold text-[#3C3C3C] placeholder-[#CDCDCD] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Error */}
            {displayError && (
              <div className="mt-3 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-xs font-bold text-red-600 text-center">{displayError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full mt-5 py-4 rounded-2xl text-base font-black text-white transition-all active:scale-[0.97] ${
                isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_4px_0_#1E40AF] active:shadow-[0_2px_0_#1E40AF] active:translate-y-[2px]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cargando...
                </span>
              ) : (
                mode === 'login' ? '🚀 Entrar' : '✨ Crear Cuenta'
              )}
            </button>
          </div>

          {/* Footer info */}
          <p className="text-center text-white/40 text-[10px] font-bold mt-5">
            {mode === 'register' 
              ? 'Al registrarte, tu progreso se guardará en la nube y podrás competir en el ranking global.'
              : 'Tu progreso se sincroniza automáticamente.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
