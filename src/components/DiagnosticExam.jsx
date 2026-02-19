// ==========================================================
// DIAGNOSTIC EXAM SCREEN
// ==========================================================
// Examen diagnóstico que se muestra después del onboarding para
// determinar automáticamente el rol/universo del usuario.

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle, Target } from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS, calculateDiagnosticRole, UNIVERSES, ROLE_TO_UNIVERSE } from '../data/universesData';
import AnimatedBlackHole from './AnimatedBlackHole';

const DiagnosticExam = ({ onComplete, onSkip }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);

    const question = DIAGNOSTIC_QUESTIONS[currentQ];
    const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
    const progress = ((currentQ + 1) / totalQuestions) * 100;

    const handleSelect = (value) => {
        setSelectedValue(value);
    };

    const handleNext = () => {
        if (!selectedValue) return;

        const newAnswers = [...answers, { questionId: question.id, selectedValue }];
        setAnswers(newAnswers);
        setSelectedValue(null);

        if (currentQ + 1 < totalQuestions) {
            setCurrentQ(prev => prev + 1);
        } else {
            // Calcular resultado
            const diagnosticResult = calculateDiagnosticRole(newAnswers);
            setResult(diagnosticResult);
            setShowResult(true);
        }
    };

    const handleBack = () => {
        if (currentQ > 0) {
            setCurrentQ(prev => prev - 1);
            // Restaurar respuesta anterior
            const prevAnswers = answers.slice(0, -1);
            setAnswers(prevAnswers);
            const prevAnswer = answers[answers.length - 1];
            setSelectedValue(prevAnswer?.selectedValue || null);
        }
    };

    const handleConfirmResult = () => {
        if (result) {
            onComplete(result.role, result.universeIndex);
        }
    };

    // Pantalla de resultado
    if (showResult && result) {
        const universeIdx = result.universeIndex;
        const universe = UNIVERSES[universeIdx];

        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col items-center justify-center p-6">
                {/* Stars */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*3}s`, opacity: 0.3 + Math.random()*0.5 }}/>
                    ))}
                </div>

                <div className="relative z-10 text-center max-w-md animate-scale-in">
                    {/* Portal glow */}
                    <div className="relative mx-auto mb-6 flex items-center justify-center">
                        <AnimatedBlackHole
                            color={universe.trailColor}
                            glowColor={universe.glowColor}
                            size={160}
                        />
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
                        <CheckCircle size={18} className="text-green-400"/>
                        <span className="text-sm font-bold text-green-300">¡Diagnóstico Completo!</span>
                    </div>

                    <h2 className="text-3xl font-black mb-2">
                        <span style={{ color: universe.trailColor }}>{universe.icon}</span> {universe.name}
                    </h2>
                    <p className="text-sm text-gray-400 mb-2 font-bold">{universe.subtitle}</p>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">{universe.description}</p>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                        <p className="text-xs text-gray-400 font-bold mb-2">Tu nivel detectado:</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-3xl">{universe.icon}</span>
                            <div className="text-left">
                                <p className="text-sm font-black" style={{ color: universe.trailColor }}>{universe.educationLevel}</p>
                                <p className="text-[10px] text-gray-500">Puedes cambiar de universo en cualquier momento</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleConfirmResult}
                        className="w-full py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-white"
                        style={{ background: `linear-gradient(135deg, ${universe.accentColor}, ${universe.accentDark})`, boxShadow: `0 8px 25px ${universe.glowColor}` }}>
                        <Sparkles size={22}/> ¡Entrar al {universe.name}!
                    </button>

                    <button onClick={() => onSkip && onSkip()}
                        className="w-full mt-3 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/10 transition-colors">
                        Elegir otro universo manualmente
                    </button>
                </div>
            </div>
        );
    }

    // Pantalla de preguntas
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-col">
            {/* Stars */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*3}s`, opacity: 0.2 + Math.random()*0.5 }}/>
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <div className="max-w-md w-full animate-scale-in">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 mb-3">
                            <Target size={16} className="text-purple-400"/>
                            <span className="text-xs font-black text-purple-300">Examen Diagnóstico</span>
                        </div>
                        <h2 className="text-xl font-black text-white mb-1">¿Cuál es tu nivel?</h2>
                        <p className="text-xs text-gray-500 font-bold">Responde para encontrar tu universo ideal</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-[10px] font-black text-gray-500">{currentQ + 1}/{totalQuestions}</span>
                            <span className="text-[10px] font-black text-gray-500">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}/>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-4">
                        <h3 className="text-lg font-black text-white mb-4 leading-snug">{question.question}</h3>
                        <div className="space-y-2">
                            {question.options.map((opt, i) => (
                                <button key={i}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                                        selectedValue === opt.value
                                            ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                            selectedValue === opt.value
                                                ? 'border-purple-400 bg-purple-500'
                                                : 'border-gray-600'
                                        }`}>
                                            {selectedValue === opt.value && (
                                                <div className="w-2 h-2 bg-white rounded-full"/>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold">{opt.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                        {currentQ > 0 && (
                            <button onClick={handleBack}
                                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 font-bold text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-1">
                                <ChevronLeft size={18}/> Atrás
                            </button>
                        )}
                        <button onClick={handleNext}
                            disabled={!selectedValue}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-1 ${
                                selectedValue
                                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white active:scale-95'
                                    : 'bg-white/10 text-gray-600 cursor-not-allowed'
                            }`}>
                            {currentQ + 1 === totalQuestions ? 'Ver Resultado' : 'Siguiente'}
                            <ChevronRight size={18}/>
                        </button>
                    </div>

                    {/* Skip button */}
                    <button onClick={onSkip}
                        className="w-full mt-4 py-2 text-gray-600 text-xs font-bold hover:text-gray-400 transition-colors">
                        Saltar diagnóstico →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticExam;
