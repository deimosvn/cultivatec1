import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Home, BookOpen, Settings, Sun, Moon, ArrowLeft, Lightbulb, Play, Target, Code, Terminal, BatteryCharging, Power, RadioTower, Component, Link, Minus, Plus, Bot, Send, Trophy } from 'lucide-react';
import QuizScreen from './components/QuizScreen';
import GlossaryScreen from './components/GlossaryScreen';
import ClassroomScreen from './components/ClassroomScreen';
import { AchievementsScreen, AchievementToast, AchievementUnlockPopup, ACHIEVEMENTS } from './components/AchievementsScreen';
import RobotSimulator from './components/RobotSimulator';
import LicensesScreen from './components/LicensesScreen';
import CircuitBuilder from './CircuitBuilder';
import { MODULOS_DATA, CODE_CHALLENGES_DATA } from './data/modulesData';
import { OnboardingScreen, RobotAvatar, RobotMini, StoryProgress } from './Onboarding';
import AuthScreen from './components/AuthScreen';
import RankingScreen from './components/RankingScreen';
import FriendsScreen from './components/FriendsScreen';
import RobotSkinEditor from './components/RobotSkinEditor';

// --- FIREBASE REAL ---
import { onAuthChange, loginUser, registerUser, logoutUser, getCurrentUser } from './firebase/auth';
import {
  getUserProfile, onUserProfileChange, updateUserProfile, syncUserStats,
  saveModuleScore, onUserScoresChange, createUserProfile, calculateLevel,
  getPendingFriendRequests, onPendingRequestsChange, checkAndUpdateStreak
} from './firebase/firestore';

// Helper: guardar scores en localStorage (fallback local)
const persistUserScores = (scores) => {
    try { localStorage.setItem('cultivatec_userScores', JSON.stringify(scores)); } catch {}
};

// Helper: verificar si un módulo está completado en userScores
const isModuleCompleted = (userScores, moduleId) => {
    const s = userScores[moduleId];
    return s && s.total > 0 && Math.round((s.score / s.total) * 100) >= 100;
};

// Helper: verificar si un módulo está desbloqueado (progression system)
const isModuleUnlocked = (userScores, moduleIndex, allModules) => {
    if (moduleIndex === 0) return true; // El primer módulo siempre está desbloqueado
    // El módulo anterior debe estar completado
    const prevModule = allModules[moduleIndex - 1];
    return prevModule ? isModuleCompleted(userScores, prevModule.id) : false;
};

// 🟢 RUTA DE IMAGEN (Logo de la aplicación)
const CULTIVATEC_LOGO_PATH = "/logo-v2.png"; // Color Indigo más fuerte

// --- ESTRUCTURA DE CONTENIDO (IMPORTADA) ---
const MODULOS_DE_ROBOTICA = MODULOS_DATA;
const MODULO_1_LESSONS = []; // Legacy: Module1View ya no se usa, electricidad usa GenericLessonScreen

const CODE_CHALLENGES = CODE_CHALLENGES_DATA;
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- FUNCIÓN PARA DAR FORMATO AZUL Y NEGRITA ---
const formatDetailBody = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
        return `<span class="font-black text-[#1CB0F6]">${p1}</span>`;
    });
};

// ==========================================================
// --- INTEGRACIÓN GEMINI API (Generación de Código) ---
// ==========================================================

/**
 * Llama a la API de Gemini para generar código Python estructurado (código + explicación).
 * Implementa reintento con retroceso exponencial.
 * @param {string} userPrompt - La solicitud del usuario.
 * @param {function} setOutput - Callback para establecer el objeto de salida { code, explanation }.
 * @param {function} setIsLoading - Callback para controlar el estado de carga.
 */
const callGeminiCodeGenerator = async (userPrompt, setOutput, setIsLoading) => {
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const systemPrompt = `You are an expert Python programming assistant focused on educational robotics for children. Your goal is to generate simple, clean, and commented Python code snippets based on user requests. Always respond in JSON format with two fields: 'code' (the Python code) and 'explanation' (the explanation in Spanish). The code MUST be runnable in a simple environment using only standard print() and basic arithmetic/control flow.`;
    
    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "code": { "type": "STRING", "description": "The generated Python code snippet." },
                    "explanation": { "type": "STRING", "description": "A simple explanation of the code in Spanish." }
                },
                "propertyOrdering": ["code", "explanation"]
            }
        },
    };

    setIsLoading(true);
    let attempts = 0;
    const MAX_ATTEMPTS = 3;
    
    while (attempts < MAX_ATTEMPTS) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            const candidate = result.candidates?.[0];
            if (candidate && candidate.content?.parts?.[0]?.text) {
                const jsonText = candidate.content.parts[0].text;
                // Limpiar posibles fences de markdown
                const cleanedJsonText = jsonText.replace(/```json\n|```/g, '').trim(); 
                const parsedJson = JSON.parse(cleanedJsonText);
                
                setOutput(parsedJson); // { code: "...", explanation: "..." }
                setIsLoading(false);
                return;
            } else {
                throw new Error("Invalid response structure from API.");
            }
        } catch (error) {
            attempts++;
            if (attempts < MAX_ATTEMPTS) {
                const delay = Math.pow(2, attempts) * 1000; // 2s, 4s
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("Gemini API call failed after multiple retries:", error);
                setOutput({ code: '# Error de conexión con el Asistente IA. Revisa tu red o intenta simplificar tu solicitud.', explanation: 'Hubo un problema al contactar al Asistente IA.' });
                setIsLoading(false);
                return;
            }
        }
    }
};

// ==========================================================
// --- NUEVO COMPONENTE: MODAL DE GENERACIÓN DE CÓDIGO ---
// ==========================================================
const CodeGenerationModal = ({ isOpen, onClose, setCode, setAiExplanation }) => {
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState(null); // { code, explanation }
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setPrompt('');
            setOutput(null);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setOutput(null); // Limpiar salida anterior
        
        await callGeminiCodeGenerator(prompt, setOutput, setIsLoading);
    };

    const handleInsertCode = () => {
        if (output && output.code) {
            setCode(output.code);
            setAiExplanation(output.explanation);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-scale-in border-2 border-[#E5E5E5]">
                {/* Header */}
                <div className="bg-[#CE82FF] px-5 py-4 flex justify-between items-center border-b-4 border-[#A855F7]">
                    <h2 className="text-lg font-black text-white flex items-center">
                        <Bot size={22} className="mr-2" />
                        Asistente IA
                    </h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition p-1.5 rounded-lg hover:bg-white/20">
                        <Minus size={20} />
                    </button>
                </div>
                
                <div className="p-5">
                    <p className="text-xs text-[#AFAFAF] font-bold mb-4">Pide al Asistente que genere código Python (ej: "calcula el área de un círculo")</p>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Quiero un código que..."
                            className="flex-grow p-3 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl focus:ring-2 focus:ring-[#CE82FF] focus:border-[#CE82FF] outline-none transition text-sm font-bold text-[#3C3C3C]"
                            disabled={isLoading}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            className={`p-3 rounded-xl text-white font-bold transition flex items-center justify-center 
                                        ${isLoading ? 'bg-[#E5E5E5]' : 'btn-3d btn-3d-purple active:scale-95'}`}
                        >
                            {isLoading ? <Zap size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>

                    {output && (
                        <div className="p-4 bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] space-y-3 animate-slide-up">
                            <div>
                                <h3 className="font-black text-[#CE82FF] mb-1 flex items-center text-sm"><Lightbulb size={14} className="mr-1" /> Explicación:</h3>
                                <p className="text-xs text-[#777] font-semibold">{output.explanation}</p>
                            </div>
                            <div>
                                <h3 className="font-black text-[#2563EB] mb-1 flex items-center text-sm"><Code size={14} className="mr-1" /> Código:</h3>
                                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap font-mono">{output.code}</pre>
                            </div>
                            <button
                                onClick={handleInsertCode}
                                className="w-full py-3 btn-3d btn-3d-green rounded-xl text-sm"
                            >
                                Insertar en el Editor
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// ==========================================================
// --- COMPONENTES ORIGINALES (Actualizados si es necesario) ---
// ==========================================================
// ... (InteractiveLEDGuide, LessonCardComponent, LessonDetailView, Module1View, etc. remain the same)

// Se añade la explicación de la IA debajo de la consola de salida
const WorkshopScreen = ({ goToMenu }) => {
    const [code, setCode] = useState('nombre = "CultivaTec"\nprint("Hola mundo desde", nombre)\n\n# Puedes sumar números!\nprint(5 + 3)');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
    const [aiExplanation, setAiExplanation] = useState(''); // Estado para la explicación del último código insertado por IA

    const executeCode = () => {
        setIsLoading(true);
        setOutput('');
        setAiExplanation(''); // Limpiar explicación al correr código propio
        let capturedOutput = [];

        // 1. Simulación de la función print() de Python en JavaScript
        const __custom_print = (...args) => {
            // Convierte argumentos a string y los une con un espacio
            const outputString = args.map(arg => String(arg)).join(' ');
            capturedOutput.push(outputString);
        };
        
        // 2. Preparar el código para ejecución
        let codeToExecute = code;
        // Reemplazar todas las ocurrencias de 'print(' con '__custom_print('
        codeToExecute = codeToExecute.replace(/print\s*\(/g, '__custom_print(');

        try {
            // 3. Ejecutar el código modificado de forma controlada
            new Function('__custom_print', codeToExecute)(__custom_print);
            
            setOutput(capturedOutput.join('\n'));
        } catch (error) {
            // 4. Capturar y mostrar errores de sintaxis o ejecución
            setOutput(`Error de Código:\n${error.message}`);
        } finally {
            setTimeout(() => setIsLoading(false), 500); 
        }
    };
    
    return (
        <div className="p-4 pt-2 min-h-full bg-white flex flex-col w-full animate-fade-in"> 
            
            <CodeGenerationModal 
                isOpen={isGeminiModalOpen} 
                onClose={() => setIsGeminiModalOpen(false)} 
                setCode={setCode}
                setAiExplanation={setAiExplanation}
            />

            <header className="flex justify-between items-center mb-4 pt-1">
                <button 
                    onClick={() => goToMenu('Taller')} 
                    className="text-[#AFAFAF] hover:text-[#3C3C3C] transition flex items-center bg-white p-2.5 rounded-xl border-2 border-[#E5E5E5] active:scale-95"
                >
                    <ArrowLeft size={20} className="mr-1" />
                    <span className="text-sm font-black">Menú</span>
                </button>
                <div className="flex items-center bg-[#1CB0F6]/10 px-4 py-1.5 rounded-full">
                    <Code size={18} className="mr-1.5 text-[#1CB0F6]" />
                    <span className="text-sm font-black text-[#1CB0F6]">Taller de Código</span>
                </div>
            </header>

            <div className="text-center mb-4">
                <h1 className="text-2xl font-black text-[#3C3C3C]">👨‍💻 ¡A Programar en Python!</h1>
                <p className="text-xs text-[#AFAFAF] font-bold mt-1">Escribe comandos <code className="bg-[#F7F7F7] px-1.5 py-0.5 rounded text-[#1CB0F6] font-black border border-[#E5E5E5]">print()</code> y presiona Correr</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow max-w-6xl mx-auto w-full">
                {/* Editor */}
                <div className="bg-white rounded-2xl overflow-hidden flex flex-col border-2 border-[#E5E5E5]">
                    <div className="bg-[#3C3C3C] px-4 py-2.5 flex items-center">
                        <div className="flex gap-1.5 mr-3">
                            <div className="w-3 h-3 rounded-full bg-[#FF4B4B]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFC800]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                        </div>
                        <span className="text-xs font-black text-white/60">Editor Python</span>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-grow font-mono text-sm resize-none outline-none border-none p-4 min-h-[150px] md:min-h-0 bg-[#F7F7F7] text-[#3C3C3C]"
                        placeholder="Escribe tu código aquí..."
                        spellCheck={false}
                    />
                </div>

                {/* Console */}
                <div className="flex flex-col gap-3">
                    <div className="bg-gray-900 rounded-2xl overflow-hidden flex flex-col flex-grow h-48 md:h-full border-2 border-gray-700">
                        <div className="bg-gray-800 px-4 py-2.5 flex items-center border-b border-gray-700">
                            <Terminal size={14} className="mr-2 text-[#2563EB]" />
                            <span className="text-xs font-black text-gray-400">Consola de Salida</span>
                        </div>
                        <pre className="flex-grow font-mono text-sm p-4 whitespace-pre-wrap text-[#2563EB]">
                            {output || <span className="text-gray-600 italic">La salida aparecerá aquí...</span>}
                        </pre>
                    </div>

                    {aiExplanation && (
                        <div className="p-4 bg-[#CE82FF]/10 rounded-2xl border-2 border-[#CE82FF]/30 animate-slide-up">
                            <h3 className="font-black text-[#CE82FF] mb-1 flex items-center text-sm">
                                <Bot size={16} className="mr-1.5" /> Explicación IA
                            </h3>
                            <p className="text-xs text-[#777] font-semibold leading-relaxed">{aiExplanation}</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 w-full max-w-md mx-auto mt-6 pb-4">
                 <button
                    onClick={() => setIsGeminiModalOpen(true)}
                    className="flex-1 py-3.5 btn-3d btn-3d-purple rounded-xl text-sm flex items-center justify-center"
                >
                    <Zap size={18} className="mr-1.5" />
                    Generar IA ✨
                </button>
                <button
                    onClick={executeCode}
                    disabled={isLoading}
                    className="flex-1 py-3.5 btn-3d btn-3d-green rounded-xl text-sm flex items-center justify-center disabled:opacity-50"
                >
                    {isLoading ? 'Ejecutando...' : <><Play size={18} className="mr-1.5" /> Correr Código</>}
                </button>
            </div>
        </div>
    );
};
const InteractiveLEDGuide = ({ onBack, onModuleComplete, userProfile, onShowLicenses }) => {
    const [step, setStep] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    const steps = [
        { type: 'intro', title: '¡A Construir Nuestro Primer Circuito!', icon: '🛠️' },
        { type: 'components', title: 'Componentes Necesarios', icon: '📦' },
        { type: 'connection', title: 'Paso 1: Preparación del LED y Resistencia', icon: '🔗' },
        { type: 'connection', title: 'Paso 2: Conexión de la Pila (Fuente)', icon: '🔋' },
        { type: 'connection', title: 'Paso 3: Añadir el Botón (Interruptor)', icon: '🔘' },
        { type: 'connection', title: 'Paso 4: ¡Prueba Final!', icon: '✅' },
        { type: 'conclusion', title: '¡Misión Cumplida!', icon: '🌟' }
    ];

    const ComponentData = [
        {
            id: 'led',
            title: '1. El LED (La Bombilla Pequeña) 💡',
            icon: <Lightbulb size={30} className="text-red-500" />,
            image: 'https://placehold.co/100x100/f87171/ffffff?text=LED', // 
            description: 'El LED es una luz. Es especial porque la electricidad solo puede entrar por una ' +
                         'patita (la **larga, el Ánodo, o "Mas")** y salir por la otra (la **corta, el Cátodo, o "Menos")**.'
        },
        {
            id: 'resistor',
            title: '2. La Resistencia (El Freno) 🛑',
            icon: <Component size={30} className="text-yellow-700" />,
            image: 'https://placehold.co/100x100/fde047/000000?text=Resistencia', // [Image of resistor]
            description: 'La Resistencia es como un **freno** en la autopista de electrones. Es vital, ya que si le das demasiada energía ' +
                         'al LED sin frenarla, ¡el LED se quema! (Usaremos una de **220 Ohms**).'
        },
        {
            id: 'battery',
            title: '3. La Pila (La Fuente de Energía) 🔋',
            icon: <BatteryCharging size={30} className="text-green-600" />,
            image: 'https://placehold.co/100x100/4ade80/000000?text=Pila+9V', // 
            description: 'La Pila da el **Voltaje (la fuerza de empuje)**. Tiene un lado **Positivo (+)** y uno **Negativo (-)**, ' +
                         'como si fuera una bomba que empuja el agua.'
        },
        {
            id: 'button',
            title: '4. El Botón (El Interruptor) 🔘',
            icon: <Power size={30} className="text-blue-600" />,
            image: 'https://placehold.co/100x100/60a5fa/ffffff?text=Botón+Pulsador', // 
            description: 'El Botón es un **puente** que puedes abrir o cerrar. Cuando lo aprietas, el circuito se cierra y ' +
                         'la electricidad pasa. Cuando lo sueltas, el circuito se abre y se detiene.'
        },
        {
            id: 'protoboard',
            title: '5. La Protoboard (El Tablero de Conexión) 🕳️',
            icon: <RadioTower size={30} className="text-orange-500" />,
            image: 'https://placehold.co/100x100/fb923c/000000?text=Protoboard', // [Image of breadboard]
            description: 'Es tu **tablero de juego**. Los agujeros están conectados en filas o columnas (depende de dónde mires) ' +
                         'para que puedas armar el circuito sin soldar nada. ¡Ideal para experimentar!'
        },
    ];

    const currentStep = steps[step];

    const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

    const renderStepContent = () => {
        if (currentStep.type === 'intro') {
            return (
                <div className="text-center p-6 space-y-4">
                    <span className="text-7xl">🛠️</span>
                    <h2 className="text-3xl font-black text-[#3C3C3C]">Construye el Circuito 'LED de Prueba'</h2>
                    <p className="text-[#777] text-base font-semibold">
                        Esta guía te enseñará a conectar una pila, una resistencia, un LED y un botón en una protoboard. <span className="font-black text-[#FF4B4B]">¡Recuerda hacerlo bajo supervisión de un adulto!</span>
                    </p>
                    <button onClick={handleNext} className="mt-4 py-3.5 px-8 btn-3d btn-3d-green rounded-2xl text-base">
                        Empezar (Ver Componentes)
                    </button>
                </div>
            );
        }

        if (currentStep.type === 'components') {
            return (
                <div className="p-6 space-y-6">
                    <h2 className="text-2xl font-black text-indigo-700 border-b-2 pb-2 mb-4">Los 5 Super Componentes</h2>
                    {ComponentData.map((comp) => (
                        <div key={comp.id} className="bg-white p-4 rounded-xl shadow-lg flex items-start space-x-4 border-l-8 border-red-500 hover:bg-gray-50 transition">
                            <div className="w-1/4 flex-shrink-0 flex flex-col items-center">
                                <img 
                                    src={comp.image} 
                                    alt={comp.title} 
                                    className="w-full h-auto max-w-[80px] rounded-lg border-2 p-1"
                                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/cccccc/000000?text=IMG'; }} 
                                />
                            </div>
                            <div className="w-3/4">
                                <h3 className="text-xl font-extrabold text-gray-800 flex items-center mb-1">
                                    {comp.icon} <span className="ml-2">{comp.title.split(') ')[1]}</span>
                                </h3>
                                <p className="text-sm text-gray-600 leading-snug">{comp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (currentStep.type === 'connection') {
            let connectionDetails = {};
            let imageUrl = '';
            let stepTitle = currentStep.title.split(': ')[1];

            switch (step) {
                case 2:
                    stepTitle = 'Conecta la Resistencia al LED';
                    imageUrl = 'https://placehold.co/200x150/ffeedd/000000?text=Paso+1'; // 
                    connectionDetails = {
                        instruccion: 'Inserta la **pata larga (+)** del LED y una pata de la **Resistencia** en la misma línea de agujeros de la protoboard. La otra pata de la resistencia debe ir en una línea separada. ¡Así el freno protege al LED!',
                        consejo: 'Asegúrate de que la pata corta (-) del LED quede libre.'
                    };
                    break;
                case 3:
                    stepTitle = 'Conecta la Pila y el GND (-)';
                    imageUrl = 'https://placehold.co/200x150/d4e9ff/000000?text=Paso+2'; // 
                    connectionDetails = {
                        instruccion: 'Conecta el cable **Negativo (-) de la pila** al bus de energía **Azul (-) de la protoboard**. Conecta la **pata corta (-) del LED** a otra línea, y usa un cable de conexión para llevar esa línea al bus **Azul (-)**.',
                        consejo: 'El bus Azul (-) y Rojo (+) recorren toda la protoboard. Son las líneas de alimentación.'
                    };
                    break;
                case 4:
                    stepTitle = 'Añade el Botón y Cierra el Circuito';
                    imageUrl = 'https://placehold.co/200x150/e0ffb0/000000?text=Paso+3'; // 
                    connectionDetails = {
                        instruccion: 'Conecta el cable **Positivo (+) de la pila** al bus **Rojo (+)**. Luego, conecta un cable del bus Rojo a un lado del **Botón**. Finalmente, conecta el otro lado del Botón a la pata libre de la **Resistencia**.',
                        consejo: 'El circuito completo es: Pila(+) → Botón → Resistencia → LED(+) → LED(-) → Pila(-). El botón y la resistencia deben ir en serie (uno detrás del otro).'
                    };
                    break;
                case 5:
                    stepTitle = '¡PRUEBA! Presiona el Botón';
                    imageUrl = 'https://placehold.co/200x150/b0fff2/000000?text=Paso+Final'; // 
                    connectionDetails = {
                        instruccion: 'Revisa todas tus conexiones. ¡Ahora, presiona y mantén presionado el botón! Si el LED se enciende, ¡has cerrado el circuito correctamente! Si no, revisa que la pata larga del LED esté hacia el lado positivo.',
                        consejo: 'Si el LED no enciende, asegúrate de que el cable negativo del LED esté bien conectado al negativo de la pila.'
                    };
                    break;
                default:
                    break;
            }

            return (
                <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-black text-red-700 mb-4 flex items-center">
                        <Link size={28} className="mr-2" /> {currentStep.title}
                    </h2>

                    <div className="bg-white p-5 rounded-3xl shadow-2xl border-l-8 border-red-600">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{stepTitle}</h3>
                        <img 
                            src={imageUrl} 
                            alt={`Diagrama del ${stepTitle}`} 
                            className="w-full h-auto rounded-xl mb-4 shadow-inner border border-gray-200"
                            onError={(e) => { e.target.src = 'https://placehold.co/250x150/cccccc/000000?text=Diagrama'; }} 
                        />
                        <p className="text-gray-700 mb-3 text-base" dangerouslySetInnerHTML={{ __html: connectionDetails.instruccion.replace(/\*\*(.*?)\*\*/g, '<b class="text-red-700">$1</b>') }} />
                        <div className="bg-yellow-100 p-3 text-sm rounded-xl border border-yellow-400 mt-4 shadow-sm">
                            <span className="font-extrabold text-yellow-800">TIP IMPORTANTE:</span> {connectionDetails.consejo}
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep.type === 'conclusion') {
            return (
                <div className="text-center p-6 space-y-4">
                    <span className="text-7xl">🌟</span>
                    <h2 className="text-3xl font-black text-[#2563EB]">¡Felicidades, Súper Ingeniero!</h2>
                    <p className="text-base text-[#777] font-semibold">
                        Acabas de construir tu primer circuito básico. Entendiste cómo la Pila da energía, la Resistencia la protege, el LED la usa para brillar, y el Botón la controla.
                    </p>
                    <div className="mt-6 p-4 bg-[#DBEAFE] rounded-2xl font-black text-[#2563EB] border-2 border-[#2563EB]/30">
                        <p>¡El concepto clave es el Circuito Cerrado!</p>
                    </div>
                    <button onClick={() => {
                        if (!hasCompleted) {
                            setHasCompleted(true);
                            onModuleComplete?.('mod_primer_led', 100);
                        }
                        setShowCelebration(true);
                    }} className="mt-6 w-full py-3.5 px-8 btn-3d btn-3d-green rounded-2xl text-base">
                        ✅ ¡Proyecto Completado!
                    </button>
                </div>
            );
        }
    };

    // Celebration screen after completing the project
    if (showCelebration) {
        return (
            <div className="min-h-full bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="text-center">
                    {userProfile ? (
                        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center animate-bounce-in">
                            <RobotAvatar config={userProfile.robotConfig} size={80} animate />
                        </div>
                    ) : (
                        <div className="text-7xl mb-4 animate-bounce-in">🎉</div>
                    )}
                    <h1 className="text-3xl font-black text-white mb-2">
                        {userProfile ? `¡Increíble, ${userProfile.userName}!` : '¡Proyecto Final Completado!'}
                    </h1>
                    <p className="text-white/80 font-bold text-base mb-6">¡Proyecto Final! 🏆</p>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-xs mx-auto">
                        <div className="flex justify-center gap-1 mb-3">
                            {[1,2,3].map(i => <span key={i} className="text-3xl animate-bounce" style={{animationDelay: `${i*150}ms`}}>⭐</span>)}
                        </div>
                        <div className="text-4xl font-black text-white mb-1">+100 XP</div>
                        <p className="text-white/70 text-sm font-bold">¡Completaste el proyecto final!</p>
                    </div>

                    <div className="space-y-3 max-w-xs mx-auto">
                        <div className="bg-white/20 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-2xl">🛠️</span>
                            <div className="text-left">
                                <p className="text-white font-black text-sm">7/7 pasos</p>
                                <p className="text-white/60 text-xs font-bold">completados</p>
                            </div>
                        </div>
                        <div className="bg-[#FFC800]/30 rounded-xl p-3 flex items-center gap-3 border border-[#FFC800]/50 animate-bounce-in" style={{animationDelay: '600ms'}}>
                            <span className="text-2xl">📜</span>
                            <div className="text-left flex-grow">
                                <p className="text-white font-black text-sm">¡Licencia Obtenida!</p>
                                <p className="text-white/70 text-xs font-bold">Proyecto Final - Primer LED</p>
                            </div>
                            <span className="text-lg">🏅</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6 max-w-xs mx-auto">
                        <button onClick={onShowLicenses} className="flex-1 py-4 bg-white/20 text-white rounded-2xl font-black text-sm border-b-4 border-white/10 active:scale-95 transition flex items-center justify-center gap-1">
                            📜 Mis Licencias
                        </button>
                        <button onClick={onBack} className="flex-1 py-4 bg-white text-[#2563EB] rounded-2xl font-black text-sm border-b-4 border-[#E5E5E5] active:scale-95 transition hover:bg-gray-50">
                            Continuar 🚀
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-white flex flex-col animate-fade-in">
            <div className="px-4 pt-4 mb-3 flex items-center justify-between">
                <button 
                    onClick={onBack} 
                    className="text-[#AFAFAF] hover:text-[#3C3C3C] transition flex items-center bg-white p-2.5 rounded-xl border-2 border-[#E5E5E5] active:scale-95"
                >
                    <ArrowLeft size={18} className="mr-1" />
                    <span className="text-sm font-black">Biblioteca</span>
                </button>
                {userProfile && (
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl">
                        <RobotMini config={userProfile.robotConfig} size={28} />
                        <span className="text-xs font-black text-[#2563EB]">¡Vamos, {userProfile.userName}!</span>
                    </div>
                )}
            </div>

            {/* Step indicator - Duolingo progress bar */}
            <div className="px-4 mb-3">
                <div className="w-full bg-[#E5E5E5] rounded-full h-4 overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500 flex items-center justify-end pr-1" style={{ width: `${((step + 1) / steps.length) * 100}%` }}>
                        <span className="text-[8px] font-black text-white">{step + 1}/{steps.length}</span>
                    </div>
                </div>
                <p className="text-xs text-[#AFAFAF] font-bold mt-1.5 text-center">{currentStep.icon} {currentStep.title}</p>
            </div>
            
            {/* Dynamic Content */}
            <div className="flex-grow px-4 overflow-y-auto">
                <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden">
                    {renderStepContent()}
                </div>
            </div>
            
            {/* Step Navigation */}
            <div className="px-4 py-4 flex gap-3 items-center">
                <button
                    onClick={handlePrev}
                    disabled={step === 0}
                    className="py-3 px-5 btn-3d btn-3d-white rounded-xl text-sm flex items-center disabled:opacity-40"
                >
                    <Minus size={16} className="mr-1" /> Anterior
                </button>
                <div className="flex-grow"></div>
                <button
                    onClick={handleNext}
                    disabled={step === steps.length - 1}
                    className="py-3 px-5 btn-3d btn-3d-green rounded-xl text-sm flex items-center disabled:opacity-40"
                >
                    Siguiente <Plus size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
};
const LessonCardComponent = ({ lesson, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(lesson.id)}
            className={`bg-white rounded-2xl border-2 border-[#E5E5E5] cursor-pointer 
                        transform transition-all duration-300 hover:scale-[1.03] active:scale-[0.96] hover:border-[#2563EB]
                        flex flex-col justify-between h-40 p-4 overflow-hidden relative group`}
        >
            <span className="text-4xl">{lesson.icon}</span>
            <div className="relative z-10">
                <h3 className="text-sm font-black text-[#3C3C3C] leading-tight">{lesson.titulo}</h3>
                <p className="text-[11px] font-bold text-[#AFAFAF] mt-0.5">{lesson.subtitulo}</p>
            </div>
            <div className="absolute bottom-3 right-3 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-b-2 border-[#1D4ED8]">
                <span className="text-white text-xs font-black">▶</span>
            </div>
        </div>
    );
};
const LessonDetailView = ({ lesson, onBack }) => {
    return (
        <div className="min-h-full bg-white flex flex-col animate-fade-in">
            {/* Duolingo-style colored header bar */}
            <div className="bg-[#1CB0F6] px-6 pt-6 pb-8 text-center">
                <button onClick={onBack} className="absolute left-4 top-4 text-white/80 hover:text-white flex items-center text-sm font-black active:scale-95 transition"><ArrowLeft size={18} className="mr-1" /> Módulo 1</button>
                <span className="text-5xl block mb-2">{lesson.icon}</span>
                <h2 className="text-2xl font-black text-white">{lesson.detail.title}</h2>
                <p className="text-sm text-white/80 font-bold mt-1">{lesson.subtitulo}</p>
            </div>

            <div className="flex-grow px-4 -mt-4 space-y-4 pb-6 relative z-10">
                {/* Main content card */}
                <div className="bg-white p-5 rounded-2xl border-2 border-[#E5E5E5] space-y-4">
                    <div>
                        <h3 className="text-lg font-black text-[#1CB0F6] mb-2">Concepto Central</h3>
                        <div className="text-sm text-[#777] leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: formatDetailBody(lesson.detail.body) }} />
                    </div>
                    {lesson.detail.formula && (
                        <div className="bg-[#FFC800]/10 p-4 rounded-xl border-2 border-[#FFC800]/30">
                            <h4 className="font-black text-sm text-[#FF9600] mb-2 flex items-center"><Lightbulb size={16} className="mr-1.5" /> La Regla Mágica</h4>
                            <div className="text-center overflow-x-auto">
                                <span className="text-2xl font-mono font-black text-[#3C3C3C]" dangerouslySetInnerHTML={{ __html: lesson.detail.formula }}></span>
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className="font-black text-sm text-[#1CB0F6] mb-2">Palabras Clave</h4>
                        <div className="flex flex-wrap gap-2">
                            {lesson.detail.keywords.map(kw => (
                                <span key={kw} className="bg-[#1CB0F6]/10 text-[#1CB0F6] text-xs font-black px-3 py-1.5 rounded-full">{kw}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={onBack} className="w-full py-3.5 btn-3d btn-3d-green rounded-xl text-sm">
                    ¡Aprendido! Volver al Módulo
                </button>
            </div>
        </div>
    );
};
const Module1View = ({ module, onBack, startPractice, onModuleComplete }) => {
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const [viewedLessons, setViewedLessons] = useState(new Set());
    const currentLesson = MODULO_1_LESSONS.find(l => l.id === currentLessonId);
    const allLessonsViewed = viewedLessons.size >= MODULO_1_LESSONS.length;

    const openLesson = (lessonId) => {
        setCurrentLessonId(lessonId);
        setViewedLessons(prev => { const n = new Set(prev); n.add(lessonId); return n; });
    };

    if (currentLesson) {
        return <LessonDetailView 
            lesson={currentLesson} 
            onBack={() => setCurrentLessonId(null)} 
        />;
    }

    return (
        <div className="min-h-full bg-white flex flex-col animate-fade-in">
            {/* Header */}
            <div className="bg-[#2563EB] px-6 pt-6 pb-8 text-center">
                <button onClick={onBack} className="absolute left-4 top-4 text-white/80 hover:text-white flex items-center text-sm font-black active:scale-95 transition"><ArrowLeft size={18} className="mr-1" /> Biblioteca</button>
                <span className="text-4xl block mb-1">⚡</span>
                <h1 className="text-2xl font-black text-white">Fundamentos Eléctricos</h1>
                <p className="text-white/80 text-sm font-bold mt-1">6 temas clave para empezar a crear</p>
            </div>

            <div className="px-4 -mt-3 flex-grow overflow-y-auto pb-4 relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger-children">
                    {MODULO_1_LESSONS.map(lesson => (
                        <LessonCardComponent 
                            key={lesson.id} 
                            lesson={lesson} 
                            onSelect={openLesson} 
                        />
                    ))}
                </div>
            </div>

            <div className="px-4 pb-4 space-y-2">
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${Math.round((viewedLessons.size / MODULO_1_LESSONS.length) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-[#2563EB]">{viewedLessons.size}/{MODULO_1_LESSONS.length}</span>
                </div>

                {allLessonsViewed && (
                    <button
                        onClick={() => { onModuleComplete?.(module?.id || 'mod_electr', 60); onBack(); }}
                        className="w-full py-3.5 btn-3d btn-3d-green rounded-xl text-sm flex items-center justify-center gap-2 animate-scale-in"
                    >
                        ✅ ¡Módulo Completado! Volver
                    </button>
                )}

                <button
                    onClick={startPractice}
                    className="w-full py-3.5 btn-3d btn-3d-blue rounded-xl text-sm flex items-center justify-center"
                >
                    <Target size={18} className="mr-1.5" />
                    ¡Poner a Prueba Mi Saber!
                </button>
            </div>
        </div>
    );
};

// --- Interactive sub-components (must be proper components for hooks) ---
const MatchingGameSection = ({ section, setXpEarned, setShowXpPop, setMascotMood }) => {
    const pairs = section.pairs || [];
    const [matchState, setMatchState] = useState({});
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState(new Set());
    const [shuffled] = useState(() => {
        const leftItems = pairs.map((p, i) => ({ id: `left-${i}`, text: p.left, pairIdx: i, side: 'left' }));
        const rightItems = pairs.map((p, i) => ({ id: `right-${i}`, text: p.right, pairIdx: i, side: 'right' }));
        for (let i = rightItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
        }
        return { left: leftItems, right: rightItems };
    });
    const handleMatchTap = (item) => {
        if (matchedPairs.has(item.pairIdx + '-' + item.side)) return;
        if (!selectedMatch) { setSelectedMatch(item); return; }
        if (selectedMatch.side === item.side) { setSelectedMatch(item); return; }
        if (selectedMatch.pairIdx === item.pairIdx) {
            setMatchedPairs(prev => { const n = new Set(prev); n.add(item.pairIdx + '-left'); n.add(item.pairIdx + '-right'); return n; });
            setSelectedMatch(null);
            if (matchedPairs.size + 2 >= pairs.length * 2) {
                setXpEarned(p => p + 20);
                setShowXpPop(true);
                setTimeout(() => setShowXpPop(false), 1000);
                setMascotMood('celebrating');
                setTimeout(() => setMascotMood('happy'), 2000);
            }
        } else {
            setMatchState(prev => ({ ...prev, [selectedMatch.id]: 'wrong', [item.id]: 'wrong' }));
            setTimeout(() => setMatchState(prev => { const n = { ...prev }; delete n[selectedMatch.id]; delete n[item.id]; return n; }), 600);
            setSelectedMatch(null);
        }
    };
    const allMatched = matchedPairs.size >= pairs.length * 2;
    return (
        <div className="bg-white rounded-2xl border-2 border-[#CE82FF]/40 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-[#CE82FF] to-[#9333EA] px-4 py-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">🧩 {section.titulo}</h3>
                <p className="text-[10px] text-white/70 font-bold mt-0.5">{section.instruccion || 'Toca un elemento de cada columna para relacionarlos'}</p>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-[#CE82FF] text-center mb-1">CONCEPTO</p>
                        {shuffled.left.map(item => {
                            const isMatched = matchedPairs.has(item.pairIdx + '-left');
                            const isSelected = selectedMatch?.id === item.id;
                            const isWrong = matchState[item.id] === 'wrong';
                            return (
                                <button key={item.id} onClick={() => handleMatchTap(item)} disabled={isMatched}
                                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                        isMatched ? 'bg-[#58CC02]/20 text-[#58CC02] border-2 border-[#58CC02]/40' :
                                        isWrong ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border-2 border-[#FF4B4B]/40 animate-shake' :
                                        isSelected ? 'bg-[#CE82FF]/20 text-[#CE82FF] border-2 border-[#CE82FF] scale-[1.02]' :
                                        'bg-[#F7F7F7] text-[#3C3C3C] border-2 border-[#E5E5E5] hover:border-[#CE82FF]'
                                    }`}>
                                    {isMatched ? '✅ ' : ''}{item.text}
                                </button>
                            );
                        })}
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-[#9333EA] text-center mb-1">RESPUESTA</p>
                        {shuffled.right.map(item => {
                            const isMatched = matchedPairs.has(item.pairIdx + '-right');
                            const isSelected = selectedMatch?.id === item.id;
                            const isWrong = matchState[item.id] === 'wrong';
                            return (
                                <button key={item.id} onClick={() => handleMatchTap(item)} disabled={isMatched}
                                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                        isMatched ? 'bg-[#58CC02]/20 text-[#58CC02] border-2 border-[#58CC02]/40' :
                                        isWrong ? 'bg-[#FF4B4B]/20 text-[#FF4B4B] border-2 border-[#FF4B4B]/40 animate-shake' :
                                        isSelected ? 'bg-[#9333EA]/20 text-[#9333EA] border-2 border-[#9333EA] scale-[1.02]' :
                                        'bg-[#F7F7F7] text-[#3C3C3C] border-2 border-[#E5E5E5] hover:border-[#9333EA]'
                                    }`}>
                                    {isMatched ? '✅ ' : ''}{item.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {allMatched && (
                    <div className="mt-3 bg-[#58CC02]/10 p-3 rounded-xl text-center animate-bounce-in border-2 border-[#58CC02]/30">
                        <p className="text-sm font-black text-[#58CC02]">🎉 ¡Todas las parejas conectadas! +20 XP</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TrueFalseSection = ({ section, setXpEarned, setShowXpPop, setMascotMood }) => {
    const statements = section.statements || [];
    const [tfAnswers, setTfAnswers] = useState({});
    const handleTF = (idx, answer) => {
        if (tfAnswers[idx] !== undefined) return;
        const isCorrect = answer === statements[idx].correct;
        setTfAnswers(prev => ({ ...prev, [idx]: isCorrect ? 'correct' : 'wrong' }));
        if (isCorrect) {
            setXpEarned(p => p + 10);
            setShowXpPop(true);
            setTimeout(() => setShowXpPop(false), 1000);
            setMascotMood('celebrating');
            setTimeout(() => setMascotMood('happy'), 2000);
        } else {
            setMascotMood('sad');
            setTimeout(() => setMascotMood('thinking'), 1500);
        }
    };
    return (
        <div className="bg-white rounded-2xl border-2 border-[#1CB0F6]/40 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-[#1CB0F6] to-[#0D8ECF] px-4 py-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">✅❌ {section.titulo}</h3>
                <p className="text-[10px] text-white/70 font-bold mt-0.5">¿Verdadero o Falso? ¡Demuestra lo que aprendiste!</p>
            </div>
            <div className="p-4 space-y-3">
                {statements.map((st, sIdx) => (
                    <div key={sIdx} className={`p-3 rounded-xl border-2 transition-all ${
                        tfAnswers[sIdx] === 'correct' ? 'bg-[#58CC02]/10 border-[#58CC02]/30' :
                        tfAnswers[sIdx] === 'wrong' ? 'bg-[#FF4B4B]/10 border-[#FF4B4B]/30' :
                        'bg-[#F7F7F7] border-[#E5E5E5]'
                    }`}>
                        <p className="text-xs font-bold text-[#3C3C3C] mb-2">{st.text}</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleTF(sIdx, true)} disabled={tfAnswers[sIdx] !== undefined}
                                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all active:scale-95 ${
                                    tfAnswers[sIdx] !== undefined && st.correct === true ? 'bg-[#58CC02] text-white' :
                                    tfAnswers[sIdx] === 'wrong' && st.correct !== true ? 'bg-[#FF4B4B]/20 text-[#FF4B4B]' :
                                    'bg-white border-2 border-[#58CC02]/40 text-[#58CC02] hover:bg-[#58CC02]/10'
                                }`}>
                                ✅ Verdadero
                            </button>
                            <button onClick={() => handleTF(sIdx, false)} disabled={tfAnswers[sIdx] !== undefined}
                                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all active:scale-95 ${
                                    tfAnswers[sIdx] !== undefined && st.correct === false ? 'bg-[#58CC02] text-white' :
                                    tfAnswers[sIdx] === 'wrong' && st.correct !== false ? 'bg-[#FF4B4B]/20 text-[#FF4B4B]' :
                                    'bg-white border-2 border-[#FF4B4B]/40 text-[#FF4B4B] hover:bg-[#FF4B4B]/10'
                                }`}>
                                ❌ Falso
                            </button>
                        </div>
                        {tfAnswers[sIdx] && (
                            <p className={`text-[10px] font-bold mt-2 ${tfAnswers[sIdx] === 'correct' ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
                                {tfAnswers[sIdx] === 'correct' ? '🎉 ¡Correcto!' : `💡 Respuesta: ${st.correct ? 'Verdadero' : 'Falso'}`} — {st.explain}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const GenericLessonScreen = ({ currentModule, goToMenu, onModuleComplete, userProfile, onShowLicenses }) => { 
    if (!currentModule || !currentModule.contenidoTeorico) return <PlaceholderScreen title="Contenido No Disponible" color="yellow" />;

    const moduleIndex = MODULOS_DE_ROBOTICA.findIndex(m => m.id === currentModule.id);
    const content = currentModule.contenidoTeorico;
    const totalSteps = content.length;

    // Step-by-step navigation
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [showCelebration, setShowCelebration] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);
    const [showXpPop, setShowXpPop] = useState(false);
    const [mascotMood, setMascotMood] = useState('happy'); // happy, thinking, celebrating, sad, reading

    // Text-to-Speech state
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [ttsSupported] = useState(() => 'speechSynthesis' in window);

    // Extract plain text from a section for TTS
    const getSectionText = (section) => {
        let text = '';
        if (section.titulo) text += section.titulo.replace(/[^\wáéíóúñü\s.,!?¿¡]/gi, '') + '. ';
        if (section.texto) text += section.texto.replace(/\*\*/g, '') + ' ';
        if (section.puntos) text += section.puntos.map(p => p.replace(/\*\*/g, '')).join('. ') + ' ';
        if (section.pregunta) text += 'Pregunta: ' + section.pregunta + '. ';
        if (section.opciones) text += 'Opciones: ' + section.opciones.join(', ') + '. ';
        if (section.instruccion) text += section.instruccion.replace(/\*\*/g, '') + ' ';
        if (section.formula) text += 'Fórmula: ' + section.formula.replace(/<[^>]*>/g, '') + '. ';
        if (section.explicacion && !section.opciones) text += section.explicacion + ' ';
        if (section.caption) text += section.caption.replace(/\*\*/g, '') + ' ';
        if (section.pairs) text += 'Juego de emparejar: ' + section.pairs.map(p => p.left + ' con ' + p.right).join('. ') + '. ';
        if (section.statements) text += 'Verdadero o Falso: ' + section.statements.map(s => s.text).join('. ') + '. ';
        return text.replace(/[#*_~`]/g, '').replace(/\n/g, '. ').trim();
    };

    const speakSection = () => {
        if (!ttsSupported) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setMascotMood('happy');
            return;
        }
        const text = getSectionText(content[currentStep]);
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        // Try to find a Spanish voice
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
        if (esVoice) utterance.voice = esVoice;
        utterance.onstart = () => { setIsSpeaking(true); setMascotMood('reading'); };
        utterance.onend = () => { setIsSpeaking(false); setMascotMood('happy'); };
        utterance.onerror = () => { setIsSpeaking(false); setMascotMood('happy'); };
        window.speechSynthesis.speak(utterance);
    };

    // Stop TTS on step change or unmount
    useEffect(() => {
        return () => { if (ttsSupported) window.speechSynthesis.cancel(); };
    }, []);
    useEffect(() => {
        if (ttsSupported) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
    }, [currentStep]);

    // Mini-Quiz State
    const [quizAnswers, setQuizAnswers] = useState({});
    const handleQuizAnswer = (sectionIdx, optionIdx, correctIdx) => {
        const isCorrect = optionIdx === correctIdx;
        setQuizAnswers(prev => ({ ...prev, [sectionIdx]: isCorrect ? 'correct' : 'wrong' }));
        if (isCorrect) {
            setXpEarned(p => p + 15);
            setShowXpPop(true);
            setTimeout(() => setShowXpPop(false), 1000);
            setMascotMood('celebrating');
            setTimeout(() => setMascotMood('happy'), 2000);
        } else {
            setMascotMood('sad');
            setTimeout(() => setMascotMood('thinking'), 1500);
        }
    };

    const markStepComplete = () => {
        setCompletedSteps(prev => {
            const n = new Set(prev);
            n.add(currentStep);
            return n;
        });
        if (!completedSteps.has(currentStep)) {
            setXpEarned(p => p + 10);
            setShowXpPop(true);
            setTimeout(() => setShowXpPop(false), 1000);
        }
    };

    const goNext = () => {
        markStepComplete();
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            setMascotMood('happy');
        } else {
            setShowCelebration(true);
            setMascotMood('celebrating');
            onModuleComplete?.(currentModule.id, xpEarned + 10);
        }
    };

    const goPrev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const progressPercent = Math.round(((completedSteps.size) / totalSteps) * 100);

    const mascotEmojis = { happy: '😊', thinking: '🤔', celebrating: '🥳', sad: '😅', reading: '📖' };
    const mascotMessages = {
        happy: ['¡Sigue así!', '¡Vas genial!', '¡Tú puedes!', '¡Qué buen estudiante!'],
        thinking: ['Piensa bien...', 'Hmm interesante...', 'Revisa de nuevo...'],
        celebrating: ['¡EXCELENTE!', '¡INCREÍBLE!', '¡WOW!', '¡GENIO!'],
        sad: ['¡Casi! Intenta otra vez', '¡No te rindas!', '¡La próxima será!'],
        reading: ['Escucha con atención...', 'Te lo leo...', '¡Pon atención!', 'Leyendo para ti...'],
    };
    const randomMsg = (mood) => mascotMessages[mood][Math.floor(Math.random() * mascotMessages[mood].length)];

    const boldReplace = (text) => text.replace(/\*\*(.*?)\*\*/g, '<b class="text-[#3C3C3C]">$1</b>');

    const renderSection = (section, index) => {
        if (section.tipo === 'fun_fact') {
            return (
                <div className="bg-gradient-to-br from-[#FFC800]/10 to-[#FF9600]/10 p-5 rounded-2xl border-2 border-[#FFC800]/40 animate-scale-in">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl animate-wiggle">💡</span>
                        <h3 className="text-lg font-black text-[#FF9600]">{section.titulo}</h3>
                    </div>
                    <p className="text-sm text-[#777] font-semibold leading-relaxed" dangerouslySetInnerHTML={{ __html: boldReplace(section.texto) }} />
                    <div className="mt-3 bg-[#FFC800]/20 p-3 rounded-xl">
                        <p className="text-xs font-black text-[#FF9600]">🧠 ¿Lo sabías? ¡Comparte este dato con tus amigos!</p>
                    </div>
                </div>
            );
        }
        if (section.tipo === 'code_example') {
            return (
                <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden animate-scale-in">
                    <div className="bg-[#3C3C3C] px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FF4B4B]"></div><div className="w-3 h-3 rounded-full bg-[#FFC800]"></div><div className="w-3 h-3 rounded-full bg-[#2563EB]"></div></div>
                            <span className="text-xs font-black text-white/70">{section.titulo}</span>
                        </div>
                        <span className="text-[10px] font-black text-[#2563EB] bg-[#2563EB]/20 px-2 py-0.5 rounded-full">{section.lenguaje}</span>
                    </div>
                    <pre className="bg-[#1a1a2e] text-green-400 p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">{section.codigo}</pre>
                    <div className="p-4 bg-gradient-to-r from-[#2563EB]/10 to-[#1CB0F6]/10 border-t-2 border-[#2563EB]/20">
                        <div className="flex items-start gap-2">
                            <span className="text-lg">🤖</span>
                            <div>
                                <p className="text-xs font-black text-[#2563EB] mb-1">¿Qué hace este código?</p>
                                <p className="text-xs text-[#777] font-semibold">{section.explicacion}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (section.tipo === 'mini_quiz') {
            const answered = quizAnswers[index];
            return (
                <div className="bg-white rounded-2xl border-2 border-[#CE82FF]/40 overflow-hidden animate-scale-in">
                    <div className="bg-gradient-to-r from-[#CE82FF] to-[#9333EA] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🎯</span>
                            <h3 className="text-sm font-black text-white">{section.titulo}</h3>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <p className="text-sm font-bold text-[#3C3C3C] whitespace-pre-line bg-[#F7F7F7] p-3 rounded-xl">{section.pregunta}</p>
                        <div className="space-y-2">
                            {section.opciones.map((op, oIdx) => {
                                let btnClass = 'bg-white border-2 border-[#E5E5E5] text-[#3C3C3C] hover:border-[#CE82FF] hover:bg-[#CE82FF]/5';
                                let emoji = '';
                                if (answered) {
                                    if (oIdx === section.respuestaCorrecta) { btnClass = 'bg-[#DBEAFE] border-2 border-[#2563EB] text-[#2563EB]'; emoji = ' ✅'; }
                                    else if (answered === 'wrong' && quizAnswers[`${index}_selected`] === oIdx) { btnClass = 'bg-[#FF4B4B]/10 border-2 border-[#FF4B4B] text-[#FF4B4B]'; emoji = ' ❌'; }
                                    else { btnClass = 'bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#AFAFAF]'; }
                                }
                                return (
                                    <button key={oIdx} disabled={!!answered}
                                        onClick={() => { setQuizAnswers(prev => ({ ...prev, [`${index}_selected`]: oIdx })); handleQuizAnswer(index, oIdx, section.respuestaCorrecta); }}
                                        className={`w-full text-left p-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${btnClass}`}>
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#CE82FF]/10 text-[#CE82FF] text-xs font-black mr-2">{String.fromCharCode(65 + oIdx)}</span>
                                        {op}{emoji}
                                    </button>
                                );
                            })}
                        </div>
                        {answered && (
                            <div className={`p-3.5 rounded-xl text-sm font-semibold animate-bounce-in ${answered === 'correct' ? 'bg-[#DBEAFE] text-[#2563EB]' : 'bg-[#FF4B4B]/10 text-[#FF4B4B]'}`}>
                                <span className="text-lg mr-1">{answered === 'correct' ? '🎉' : '💪'}</span>
                                {section.explicacion}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        if (section.tipo === 'intro_hero') {
            return (
                <div className="bg-gradient-to-br from-[#58CC02]/10 via-[#2563EB]/5 to-[#CE82FF]/10 p-6 rounded-2xl border-2 border-[#58CC02]/40 animate-scale-in relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-5xl opacity-20 rotate-12">🤖</div>
                    <div className="absolute bottom-2 left-2 text-4xl opacity-10 -rotate-12">⚡</div>
                    <h3 className="text-xl font-black text-[#58CC02] mb-3 flex items-center gap-2">
                        {section.titulo}
                    </h3>
                    <p className="text-sm text-[#555] font-semibold leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: boldReplace(section.texto) }} />
                    <div className="mt-4 bg-white/60 p-3 rounded-xl border border-[#58CC02]/20">
                        <p className="text-xs font-black text-[#58CC02]">🌟 ¡Empecemos esta aventura juntos!</p>
                    </div>
                </div>
            );
        }
        if (section.tipo === 'interactive_challenge') {
            return (
                <div className="bg-gradient-to-br from-[#FFC800]/10 via-[#FF9600]/10 to-[#FF4B4B]/10 p-5 rounded-2xl border-2 border-[#FF9600]/40 animate-scale-in relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-4xl opacity-15 rotate-6">🎮</div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl animate-pulse-soft">🎯</span>
                        <h3 className="text-lg font-black text-[#FF9600]">{section.titulo}</h3>
                    </div>
                    <p className="text-sm text-[#555] font-semibold leading-relaxed mb-3 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: boldReplace(section.instruccion) }} />
                    {section.recompensa && (
                        <div className="bg-gradient-to-r from-[#FFC800]/30 to-[#FF9600]/20 p-3.5 rounded-xl border border-[#FFC800]/40 flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <p className="text-xs font-black text-[#FF9600]">Recompensa:</p>
                                <p className="text-sm font-bold text-[#E58600]">{section.recompensa}</p>
                            </div>
                        </div>
                    )}
                    {section.materiales && (
                        <div className="mt-3 bg-white/60 p-3 rounded-xl border border-[#FF9600]/20">
                            <p className="text-xs font-black text-[#FF9600] mb-2">📋 Necesitas:</p>
                            <ul className="text-xs text-[#777] font-semibold space-y-1">
                                {section.materiales.map((m, mIdx) => <li key={mIdx} className="flex items-center gap-2"><span className="w-5 h-5 bg-[#FF9600]/10 rounded-lg flex items-center justify-center text-[10px]">✓</span> {m}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            );
        }
        if (section.tipo === 'activity') {
            return (
                <div className="bg-gradient-to-br from-[#1CB0F6]/10 to-[#0D8ECF]/10 p-5 rounded-2xl border-2 border-[#1CB0F6]/30 animate-scale-in">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl animate-pulse-soft">🔬</span>
                        <h3 className="text-lg font-black text-[#1CB0F6]">{section.titulo}</h3>
                    </div>
                    <p className="text-sm text-[#777] font-semibold leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: boldReplace(section.instruccion) }} />
                    {section.materiales && (
                        <div className="bg-white p-3.5 rounded-xl border-2 border-[#1CB0F6]/20">
                            <p className="text-xs font-black text-[#1CB0F6] mb-2">📋 Necesitas:</p>
                            <ul className="text-xs text-[#777] font-semibold space-y-1">
                                {section.materiales.map((m, mIdx) => <li key={mIdx} className="flex items-center gap-2"><span className="w-5 h-5 bg-[#1CB0F6]/10 rounded-lg flex items-center justify-center text-[10px]">✓</span> {m}</li>)}
                            </ul>
                        </div>
                    )}
                    <div className="mt-3 bg-[#1CB0F6]/20 p-3 rounded-xl">
                        <p className="text-xs font-black text-[#0D8ECF]">🏅 +15 XP por completar esta actividad</p>
                    </div>
                </div>
            );
        }
        if (section.tipo === 'tip') {
            return (
                <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1D4ED8]/10 p-5 rounded-2xl border-2 border-[#2563EB]/30 animate-scale-in">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">💡</span>
                        <h3 className="text-base font-black text-[#2563EB]">{section.titulo}</h3>
                    </div>
                    <p className="text-sm text-[#777] font-semibold leading-relaxed" dangerouslySetInnerHTML={{ __html: boldReplace(section.texto) }} />
                </div>
            );
        }
        // Illustration: SVG inline diagram with labels
        if (section.tipo === 'illustration') {
            return (
                <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden animate-img-reveal">
                    <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#1CB0F6]/10 px-4 py-3 border-b border-[#E5E5E5]">
                        <h3 className="text-base font-black text-[#2563EB] flex items-center gap-2">
                            🖼️ {section.titulo}
                        </h3>
                    </div>
                    <div className="p-4 flex flex-col items-center">
                        <div className="w-full max-w-sm bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] rounded-xl p-4 border-2 border-[#BAE6FD] mb-3" 
                            dangerouslySetInnerHTML={{ __html: section.svg }} />
                        {section.caption && (
                            <p className="text-xs font-bold text-[#777] text-center mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldReplace(section.caption) }} />
                        )}
                        {section.labels && (
                            <div className="grid grid-cols-2 gap-2 mt-3 w-full">
                                {section.labels.map((label, lIdx) => (
                                    <div key={lIdx} className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-2 rounded-xl">
                                        <span className="text-base">{label.icon}</span>
                                        <div>
                                            <p className="text-xs font-black text-[#3C3C3C]">{label.name}</p>
                                            <p className="text-[10px] text-[#AFAFAF] font-semibold">{label.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        // Matching game: tap pairs to match
        if (section.tipo === 'matching_game') {
            return <MatchingGameSection section={section} setXpEarned={setXpEarned} setShowXpPop={setShowXpPop} setMascotMood={setMascotMood} />;
        }
        // True/False quick game
        if (section.tipo === 'true_false') {
            return <TrueFalseSection section={section} setXpEarned={setXpEarned} setShowXpPop={setShowXpPop} setMascotMood={setMascotMood} />;
        }
        // Default: texto / formula
        return (
            <div className="bg-white p-5 rounded-2xl border-2 border-[#E5E5E5] overflow-hidden animate-scale-in">
                <div className="flex items-start gap-3">
                    <div className="w-1.5 h-full min-h-[40px] bg-[#1CB0F6] rounded-full flex-shrink-0"></div>
                    <div className="flex-grow">
                        <h3 className="text-lg font-black text-[#3C3C3C] mb-2">{section.titulo}</h3>
                        {section.tipo === 'texto' && section.puntos && (
                            <ul className="space-y-2 text-[#777] text-sm font-semibold">
                                {section.puntos.map((punto, pIndex) => (
                                    <li key={pIndex} className="flex items-start gap-2"><span className="text-[#1CB0F6] mt-0.5 flex-shrink-0">●</span><span dangerouslySetInnerHTML={{ __html: boldReplace(punto) }} /></li>
                                ))}
                            </ul>
                        )}
                        {section.tipo === 'formula' && (
                            <div className="space-y-3">
                                <p className="text-[#AFAFAF] text-sm italic font-semibold">{section.texto}</p>
                                <div className="bg-gradient-to-br from-[#1CB0F6]/10 to-[#CE82FF]/10 p-4 rounded-xl text-center font-mono text-2xl font-black text-[#3C3C3C] overflow-x-auto border-2 border-[#1CB0F6]/20">
                                    <span dangerouslySetInnerHTML={{ __html: section.formula }}></span>
                                </div>
                                <p className="text-xs text-[#AFAFAF] font-semibold">{section.explicacion}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Celebration screen
    if (showCelebration) {
        return (
            <div className="min-h-full bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="text-center">
                    {userProfile ? (
                        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-3xl flex items-center justify-center animate-bounce-in">
                            <RobotAvatar config={userProfile.robotConfig} size={80} animate />
                        </div>
                    ) : (
                        <div className="text-7xl mb-4 animate-bounce-in">🎉</div>
                    )}
                    <h1 className="text-3xl font-black text-white mb-2">
                        {userProfile ? `¡Genial, ${userProfile.userName}!` : '¡Módulo Completado!'}
                    </h1>
                    <p className="text-white/80 font-bold text-base mb-6">{currentModule.titulo}</p>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-xs mx-auto">
                        <div className="flex justify-center gap-1 mb-3">
                            {[1,2,3].map(i => <span key={i} className="text-3xl animate-bounce" style={{animationDelay: `${i*150}ms`}}>⭐</span>)}
                        </div>
                        <div className="text-4xl font-black text-white mb-1">+{xpEarned} XP</div>
                        <p className="text-white/70 text-sm font-bold">Puntos de experiencia ganados</p>
                    </div>

                    <div className="space-y-3 max-w-xs mx-auto">
                        <div className="bg-white/20 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-2xl">📖</span>
                            <div className="text-left">
                                <p className="text-white font-black text-sm">{completedSteps.size}/{totalSteps} secciones</p>
                                <p className="text-white/60 text-xs font-bold">completadas</p>
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-2xl">🧠</span>
                            <div className="text-left">
                                <p className="text-white font-black text-sm">{Object.values(quizAnswers).filter(v => v === 'correct').length} respuestas</p>
                                <p className="text-white/60 text-xs font-bold">correctas en mini-quizzes</p>
                            </div>
                        </div>
                        {/* License earned badge */}
                        <div className="bg-[#FFC800]/30 rounded-xl p-3 flex items-center gap-3 border border-[#FFC800]/50 animate-bounce-in" style={{animationDelay: '600ms'}}>
                            <span className="text-2xl">📜</span>
                            <div className="text-left flex-grow">
                                <p className="text-white font-black text-sm">¡Licencia Obtenida!</p>
                                <p className="text-white/70 text-xs font-bold">{currentModule.titulo}</p>
                            </div>
                            <span className="text-lg">🏅</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6 max-w-xs mx-auto">
                        <button onClick={onShowLicenses} className="flex-1 py-4 bg-white/20 text-white rounded-2xl font-black text-sm border-b-4 border-white/10 active:scale-95 transition flex items-center justify-center gap-1">
                            📜 Mis Licencias
                        </button>
                        <button onClick={goToMenu} className="flex-1 py-4 bg-white text-[#2563EB] rounded-2xl font-black text-sm border-b-4 border-[#E5E5E5] active:scale-95 transition hover:bg-gray-50">
                            Continuar 🚀
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentSection = content[currentStep];
    const nodeColors = ['#2563EB', '#1CB0F6', '#CE82FF', '#FF9600', '#FF4B4B', '#FFC800'];
    const moduleColor = nodeColors[moduleIndex % nodeColors.length];

    return (
        <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in"> 
            {/* Top bar with progress */}
            <div className="sticky top-0 z-20 bg-white border-b-2 border-[#E5E5E5] px-4 py-3">
                <div className="flex items-center gap-3">
                    <button onClick={goToMenu} className="text-[#AFAFAF] hover:text-[#3C3C3C] transition p-1.5 rounded-xl active:scale-95 border-2 border-[#E5E5E5]">
                        <ArrowLeft size={18} />
                    </button>
                    {/* Progress bar */}
                    <div className="flex-grow">
                        <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%`, backgroundColor: moduleColor }}></div>
                        </div>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}>
                        {currentStep + 1}/{totalSteps}
                    </span>
                </div>
            </div>

            {/* Step indicator dots */}
            <div className="bg-white px-4 py-2 border-b border-[#E5E5E5]/50">
                <div className="flex justify-center gap-1.5 flex-wrap">
                    {content.map((_, i) => (
                        <button key={i} onClick={() => setCurrentStep(i)} 
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                i === currentStep ? 'scale-125' : completedSteps.has(i) ? '' : 'bg-[#E5E5E5]'
                            }`}
                            style={i === currentStep ? { backgroundColor: moduleColor } : completedSteps.has(i) ? { backgroundColor: '#2563EB' } : {}}
                        />
                    ))}
                </div>
            </div>

            {/* Module header */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${moduleColor}15` }}>
                        {currentModule.icon}
                    </div>
                    <div>
                        <h1 className="text-base font-black text-[#3C3C3C] leading-tight">{currentModule.titulo}</h1>
                        <p className="text-[10px] font-bold text-[#AFAFAF]">Módulo {moduleIndex + 1} · Sección {currentStep + 1}</p>
                    </div>
                </div>
            </div>

            {/* XP Pop animation */}
            {showXpPop && (
                <div className="fixed top-20 right-6 z-30 animate-xp-pop">
                    <span className="text-sm font-black text-[#2563EB] bg-[#DBEAFE] px-3 py-1.5 rounded-full shadow-lg">+10 XP ⭐</span>
                </div>
            )}

            {/* Main content area */}
            <div className="flex-grow overflow-y-auto px-4 pb-4">
                <div key={currentStep} className="animate-slide-up">
                    {renderSection(currentSection, currentStep)}
                </div>
            </div>

            {/* Mascot & Navigation */}
            <div className="bg-white border-t-2 border-[#E5E5E5] px-4 py-3">
                {/* Mascot bubble with reading animation */}
                <div className="flex items-center gap-3 mb-3">
                    {userProfile ? (
                        <div className={`w-12 h-12 flex-shrink-0 transition-transform duration-300 ${isSpeaking ? 'animate-robot-read' : mascotMood === 'celebrating' ? 'animate-bounce' : ''}`}>
                            <RobotAvatar config={userProfile.robotConfig} size={48} animate={isSpeaking} />
                        </div>
                    ) : (
                        <div className={`w-10 h-10 bg-[#F7F7F7] rounded-full flex items-center justify-center text-xl border-2 border-[#E5E5E5] ${isSpeaking ? 'animate-robot-read' : 'animate-pulse-soft'}`}>
                            {mascotEmojis[mascotMood]}
                        </div>
                    )}
                    <div className={`px-3 py-2 rounded-xl rounded-bl-none flex-grow ${isSpeaking ? 'bg-gradient-to-r from-[#2563EB]/10 to-[#1CB0F6]/10 border border-[#2563EB]/20' : 'bg-[#F7F7F7]'}`}>
                        <p className={`text-xs font-bold ${isSpeaking ? 'text-[#2563EB]' : 'text-[#777]'}`}>
                            {isSpeaking ? '🔊 ' : ''}{randomMsg(mascotMood)}
                        </p>
                    </div>
                    {/* TTS Button */}
                    {ttsSupported && (
                        <button onClick={speakSection}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0 ${
                                isSpeaking 
                                    ? 'bg-[#FF4B4B] text-white shadow-lg shadow-[#FF4B4B]/30 animate-pulse' 
                                    : 'bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/20'
                            }`}
                            title={isSpeaking ? 'Detener lectura' : 'Leer en voz alta'}>
                            <span className="text-lg">{isSpeaking ? '⏹️' : '🔊'}</span>
                        </button>
                    )}
                    <div className="flex items-center gap-1 bg-[#FFC800]/10 px-2.5 py-1.5 rounded-xl">
                        <span className="text-sm">⭐</span>
                        <span className="text-xs font-black text-[#FF9600]">{xpEarned}</span>
                    </div>
                </div>
                
                {/* Nav buttons */}
                <div className="flex gap-3">
                    <button onClick={goPrev} disabled={currentStep === 0}
                        className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all active:scale-95 border-2
                            ${currentStep === 0 ? 'bg-[#F7F7F7] text-[#CDCDCD] border-[#E5E5E5] cursor-not-allowed' : 'bg-white text-[#3C3C3C] border-[#E5E5E5] hover:border-[#AFAFAF]'}`}>
                        ← Anterior
                    </button>
                    <button onClick={goNext}
                        className="flex-[2] py-3.5 rounded-xl text-sm font-black active:scale-95 transition-all text-white border-b-4"
                        style={{ backgroundColor: moduleColor, borderBottomColor: `${moduleColor}CC` }}>
                        {currentStep === totalSteps - 1 ? '🎉 ¡Completar Módulo!' : 'Siguiente →'}
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- SECTION / UNIT DEFINITIONS ---
const LEARNING_SECTIONS = [
    { startIdx: 0, title: '🤖 Introducción', subtitle: '¡Descubre el increíble mundo de los robots!', color: '#58CC02', colorLight: '#D7FFB8', emoji: '🚀' },
    { startIdx: 3, title: '🔬 Fundamentos', subtitle: 'Electricidad, electrónica y mecánica', color: '#2563EB', colorLight: '#DBEAFE', emoji: '⚡' },
    { startIdx: 6, title: '💻 Programación', subtitle: 'Lógica, código y Arduino', color: '#1CB0F6', colorLight: '#D0ECFB', emoji: '🎮' },
    { startIdx: 9, title: '🛠️ Prácticas', subtitle: 'Proyectos físicos paso a paso', color: '#FF9600', colorLight: '#FFECD0', emoji: '🔧' },
    { startIdx: 12, title: '🧠 Avanzado', subtitle: 'Control, diseño y más', color: '#CE82FF', colorLight: '#F0DEFF', emoji: '🏆' },
];

const ModuleCard = ({ module, onStart, userScores, index, totalModules, sectionColor, allModules }) => {
    const scoreData = userScores[module.id];
    const total = scoreData?.total || 0;
    const score = scoreData?.score || 0;
    const progress = total > 0 ? Math.round((score / total) * 100) : 0;
    const isCompleted = isModuleCompleted(userScores, module.id);
    const isUnlocked = isModuleUnlocked(userScores, index, allModules);
    const isLocked = !isUnlocked && !isCompleted;
    const isActive = isUnlocked && !isCompleted; // Next module to do
    
    const nodeColors = [
        { hex: '#2563EB', hexDark: '#1D4ED8', hexLight: '#DBEAFE' },
        { hex: '#1CB0F6', hexDark: '#1899D6', hexLight: '#D0ECFB' },
        { hex: '#CE82FF', hexDark: '#A855F7', hexLight: '#F0DEFF' },
        { hex: '#FF9600', hexDark: '#E58600', hexLight: '#FFECD0' },
        { hex: '#FF4B4B', hexDark: '#EA2B2B', hexLight: '#FFD4D4' },
        { hex: '#FFC800', hexDark: '#E5B800', hexLight: '#FFF4CC' },
    ];
    const c = nodeColors[(index || 0) % nodeColors.length];

    // Snake path: left → center → right → center → left...
    const positions = ['self-start ml-4', 'self-center', 'self-end mr-4', 'self-center'];
    const posClass = positions[index % 4];

    const shortTitle = module.titulo.split(':')[1]?.trim() || module.titulo;
    const lessonCount = Array.isArray(module.contenidoTeorico) 
        ? module.contenidoTeorico.length 
        : (module.contenidoTeorico === '__MODULO_1_REF__' ? 6 : 0);

    return (
        <div className={`${posClass} w-[85%] max-w-[320px] transition-all duration-500`}>
            <button
                onClick={() => !isLocked && onStart(module.id)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 active:scale-[0.97] group
                    ${isLocked 
                        ? 'bg-[#F7F7F7] border-2 border-[#E5E5E5] cursor-not-allowed opacity-60' 
                        : 'bg-white border-2 border-[#E5E5E5] hover:border-transparent cursor-pointer hover:shadow-xl hover:shadow-black/5'
                    }`}
                style={!isLocked ? { '--hover-border': c.hex } : {}}
                onMouseEnter={(e) => { if(!isLocked) e.currentTarget.style.borderColor = c.hex + '80'; }}
                onMouseLeave={(e) => { if(!isLocked) e.currentTarget.style.borderColor = '#E5E5E5'; }}
            >
                {/* Node circle */}
                <div className="relative flex-shrink-0">
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300
                            ${isLocked ? 'bg-[#E5E5E5]' : 'group-hover:scale-110 shadow-md'}
                        `}
                        style={!isLocked ? { 
                            backgroundColor: c.hex, 
                            borderBottom: `4px solid ${c.hexDark}`,
                        } : {}}
                    >
                        {isLocked ? '🔒' : isCompleted ? '⭐' : module.icon}
                    </div>
                    {/* Module number badge */}
                    <div 
                        className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black
                            ${isLocked ? 'bg-[#AFAFAF] text-white' : 'text-white'}`}
                        style={!isLocked ? { backgroundColor: c.hexDark } : {}}
                    >
                        {index + 1}
                    </div>
                    {/* Play indicator for active (next module to complete) */}
                    {isActive && !isLocked && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 flex items-center justify-center animate-pulse-soft"
                            style={{ borderColor: c.hex }}>
                            <span className="text-[8px] font-black" style={{ color: c.hex }}>▶</span>
                        </div>
                    )}
                    {isCompleted && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFC800] rounded-full border-2 border-[#E5B800] flex items-center justify-center">
                            <span className="text-[8px] font-black text-white">✓</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0 text-left">
                    <h3 className={`text-sm font-black leading-tight truncate ${isLocked ? 'text-[#AFAFAF]' : 'text-[#3C3C3C]'}`}>
                        {shortTitle}
                    </h3>
                    <p className={`text-[11px] font-semibold leading-snug mt-0.5 line-clamp-2 ${isLocked ? 'text-[#CDCDCD]' : 'text-[#AFAFAF]'}`}>
                        {module.descripcion}
                    </p>
                    {/* Progress or info row */}
                    <div className="flex items-center gap-2 mt-1.5">
                        {!isLocked && lessonCount > 0 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md"
                                style={{ backgroundColor: c.hexLight, color: c.hex }}>
                                {lessonCount} {module.specialView ? 'lecciones' : 'secciones'}
                            </span>
                        )}
                        {!isLocked && progress > 0 && (
                            <div className="flex-grow max-w-[80px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, backgroundColor: c.hex }}></div>
                            </div>
                        )}
                        {!isLocked && progress > 0 && (
                            <span className="text-[10px] font-bold" style={{ color: c.hex }}>{progress}%</span>
                        )}
                        {isLocked && (
                            <span className="text-[10px] font-bold text-[#CDCDCD]">🔒 Completa el anterior</span>
                        )}
                    </div>
                </div>

                {/* Arrow */}
                {!isLocked && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ backgroundColor: c.hexLight }}>
                        <ArrowLeft size={14} className="rotate-180" style={{ color: c.hex }} />
                    </div>
                )}
            </button>
        </div>
    );
};

const SectionBanner = ({ section, modulesInSection, userScores, sectionIndex }) => {
    const completedInSection = modulesInSection.filter(m => isModuleCompleted(userScores, m.id)).length;
    const totalInSection = modulesInSection.length;
    const isComplete = completedInSection === totalInSection && totalInSection > 0;
    // A section is locked if first module of section is locked
    const firstModuleGlobalIdx = section.startIdx;
    const isSectionLocked = firstModuleGlobalIdx > 0 && !isModuleUnlocked(userScores, firstModuleGlobalIdx, MODULOS_DE_ROBOTICA);

    // Fun motivational messages per section
    const sectionMotivation = {
        0: '¡Tu aventura robótica comienza aquí! 🚀',
        1: '¡Domina los fundamentos como un pro! 💪',
        2: '¡Es hora de programar robots! 🎮',
        3: '¡Manos a la obra con proyectos reales! 🔧',
        4: '¡Nivel experto desbloqueado! 🏆',
    };

    return (
        <div className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${isSectionLocked ? 'opacity-60' : 'hover:shadow-lg hover:shadow-black/5'}`}
            style={{ borderColor: isSectionLocked ? '#E5E5E5' : section.color + '50' }}>
            <div className="px-5 py-4 flex items-center gap-3 relative overflow-hidden"
                style={{ background: isSectionLocked ? '#F7F7F7' : `linear-gradient(135deg, ${section.color}20, ${section.colorLight})` }}>
                {/* Background decoration */}
                {!isSectionLocked && (
                    <div className="absolute right-0 top-0 text-6xl opacity-10 transform translate-x-4 -translate-y-2"
                        style={{ color: section.color }}>
                        {section.emoji || '⭐'}
                    </div>
                )}
                <div className="flex-grow relative z-10">
                    <h3 className="text-lg font-black flex items-center gap-2" style={{ color: isSectionLocked ? '#AFAFAF' : section.color }}>
                        {isSectionLocked && <span>🔒</span>} {section.title}
                        {isComplete && <span className="animate-bounce-in">✨</span>}
                    </h3>
                    <p className="text-[11px] font-bold text-[#777] mt-0.5">
                        {isSectionLocked 
                            ? '🔒 Completa la sección anterior para desbloquear' 
                            : isComplete 
                                ? '🎉 ¡Sección completada! ¡Eres increíble!' 
                                : sectionMotivation[sectionIndex] || section.subtitle
                        }
                    </p>
                </div>
                <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white transition-transform ${isComplete ? 'animate-pulse-soft scale-110' : ''}`}
                        style={{ 
                            backgroundColor: isSectionLocked ? '#AFAFAF' : isComplete ? '#58CC02' : section.color, 
                            borderBottom: `4px solid ${isSectionLocked ? '#999' : isComplete ? '#4CAF00' : section.color + 'CC'}` 
                        }}>
                        {isComplete ? '⭐' : `${completedInSection}/${totalInSection}`}
                    </div>
                </div>
            </div>
            {/* Mini Progress with animation */}
            <div className="h-1.5 relative" style={{ backgroundColor: section.colorLight }}>
                <div className="h-full transition-all duration-1000 relative" 
                    style={{ width: `${totalInSection > 0 ? (completedInSection / totalInSection) * 100 : 0}%`, backgroundColor: section.color }}>
                    {completedInSection > 0 && completedInSection < totalInSection && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LibraryScreen = ({ startLesson, userId, userScores, onShowAchievements, onShowLicenses, userStats, userProfile, onLogout, firebaseProfile, onEditRobot }) => {
    const totalModules = MODULOS_DE_ROBOTICA.length;
    const completedModulesCount = Object.values(userScores).filter(s => s && s.total > 0 && Math.round((s.score / s.total) * 100) >= 100).length;
    const overallProgress = Math.round((completedModulesCount / totalModules) * 100);

    return (
    <div className="pb-24 min-h-full bg-[#F7F7F7] w-full">
        {/* Duolingo-style Top Stats Bar */}
        <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-100 px-4 py-2.5">
            <div className="flex items-center justify-between max-w-xl mx-auto">
                <div className="flex items-center gap-3">
                    {userProfile && (
                      <button onClick={onEditRobot} className="active:scale-90 transition-transform hover:ring-2 hover:ring-[#2563EB]/40 rounded-full" title="Personalizar robot">
                        <RobotMini config={userProfile.robotConfig} size={34} />
                      </button>
                    )}
                    {firebaseProfile?.username && (
                        <span className="text-[10px] font-black text-[#777] hidden sm:inline">@{firebaseProfile.username}</span>
                    )}
                    <div className="flex items-center gap-1 bg-[#3B82F6]/10 px-2.5 py-1 rounded-xl" title="Racha diaria">
                        <span className="text-lg">🤖</span>
                        <span className="text-sm font-black text-[#3B82F6]">{firebaseProfile?.currentStreak || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFC800]/10 px-2.5 py-1 rounded-xl">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm font-black text-[#FFC800]">{firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0}</span>
                    </div>
                </div>
                <div className="w-9 h-9 bg-white rounded-xl p-0.5 border-2 border-[#E5E5E5]">
                    <img
                        src={CULTIVATEC_LOGO_PATH}
                        alt="Logo CultivaTec"
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => { e.target.src = 'https://placehold.co/40x40/58CC02/ffffff?text=CT'; }} 
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#1CB0F6]/10 px-2.5 py-1 rounded-xl">
                        <span className="text-lg">💎</span>
                        <span className="text-sm font-black text-[#1CB0F6]">50</span>
                    </div>
                    <button 
                        onClick={onShowLicenses}
                        className="flex items-center bg-[#2563EB]/10 p-2 rounded-xl hover:bg-[#2563EB]/20 transition active:scale-95"
                        title="Mis Licencias"
                    >
                        <span className="text-lg">📜</span>
                    </button>
                    <button 
                        onClick={onShowAchievements}
                        className="flex items-center bg-[#FFC800]/10 p-2 rounded-xl hover:bg-[#FFC800]/20 transition active:scale-95"
                    >
                        <span className="text-lg">🏆</span>
                    </button>
                    {onLogout && (
                        <button 
                            onClick={onLogout}
                            className="flex items-center bg-red-50 p-2 rounded-xl hover:bg-red-100 transition active:scale-95"
                            title="Cerrar sesión"
                        >
                            <span className="text-sm">🚪</span>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white via-white to-[#DBEAFE]/30 px-5 pt-5 pb-6 border-b-2 border-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-0 text-8xl opacity-5 transform translate-x-8 -translate-y-4">🤖</div>
            <div className="absolute left-0 bottom-0 text-6xl opacity-5 transform -translate-x-4 translate-y-4">⚡</div>
            <div className="max-w-xl mx-auto relative z-10">
                {userProfile && (
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-black text-[#2563EB]">¡Hola, {userProfile.userName}!</p>
                        <span className="animate-bounce-in inline-block">👋</span>
                    </div>
                )}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-[#3C3C3C] flex items-center gap-2">
                            Ruta de Aprendizaje 
                            <span className="text-lg">🚀</span>
                        </h2>
                        <p className="text-xs text-[#777] font-bold mt-0.5">
                            {completedModulesCount === 0 
                                ? '¡Empieza tu aventura robótica! 🌟' 
                                : completedModulesCount === totalModules 
                                    ? '¡FELICIDADES! ¡Eres un experto! 🏆' 
                                    : `${totalModules - completedModulesCount} módulos por conquistar`
                            }
                        </p>
                    </div>
                    <div className="relative w-16 h-16">
                        {/* Circular progress indicator */}
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E5E5" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" 
                                stroke={overallProgress === 100 ? '#58CC02' : '#2563EB'} 
                                strokeWidth="3" 
                                strokeDasharray={`${overallProgress * 0.942} 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {overallProgress === 100 
                                ? <span className="text-lg animate-pulse-soft">⭐</span>
                                : <span className="text-sm font-black text-[#2563EB]">{overallProgress}%</span>
                            }
                        </div>
                    </div>
                </div>
                {/* Full width progress bar with milestones */}
                <div className="relative">
                    <div className="w-full h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 relative ${overallProgress === 100 ? 'bg-gradient-to-r from-[#58CC02] to-[#4CAF00]' : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]'}`}
                            style={{ width: `${Math.max(overallProgress, 3)}%` }}>
                            {overallProgress > 0 && overallProgress < 100 && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md animate-pulse"></div>
                            )}
                        </div>
                    </div>
                    {/* Milestones */}
                    <div className="flex justify-between mt-2">
                        <div className="flex flex-col items-center">
                            <span className={`text-sm ${overallProgress >= 0 ? 'grayscale-0' : 'grayscale opacity-50'}`}>🌱</span>
                            <span className="text-[9px] font-bold text-[#AFAFAF]">Inicio</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-sm ${overallProgress >= 25 ? 'grayscale-0' : 'grayscale opacity-50'}`}>⚡</span>
                            <span className="text-[9px] font-bold text-[#AFAFAF]">25%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-sm ${overallProgress >= 50 ? 'grayscale-0' : 'grayscale opacity-50'}`}>🔧</span>
                            <span className="text-[9px] font-bold text-[#AFAFAF]">50%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-sm ${overallProgress >= 75 ? 'grayscale-0' : 'grayscale opacity-50'}`}>🚀</span>
                            <span className="text-[9px] font-bold text-[#AFAFAF]">75%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-sm ${overallProgress >= 100 ? 'grayscale-0 animate-bounce-in' : 'grayscale opacity-50'}`}>🏆</span>
                            <span className="text-[9px] font-bold text-[#AFAFAF]">Experto</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Story Progress */}
        {userProfile && (
            <StoryProgress 
                modulesCompleted={userStats?.modulesCompleted || 0}
                robotConfig={userProfile.robotConfig}
                robotName={userProfile.robotName}
                userName={userProfile.userName}
            />
        )}
        
        {/* Path-based Module Layout */}
        <div className="px-4 w-full max-w-xl mx-auto py-5 space-y-4">
            {LEARNING_SECTIONS.map((section, sIdx) => {
                const nextSection = LEARNING_SECTIONS[sIdx + 1];
                const endIdx = nextSection ? nextSection.startIdx : MODULOS_DE_ROBOTICA.length;
                const sectionModules = MODULOS_DE_ROBOTICA.slice(section.startIdx, endIdx);

                return (
                    <div key={sIdx} className="animate-fade-in" style={{ animationDelay: `${sIdx * 100}ms` }}>
                        {/* Section banner */}
                        <SectionBanner section={section} modulesInSection={sectionModules} userScores={userScores} sectionIndex={sIdx} />
                        
                        {/* Module nodes within section */}
                        <div className="flex flex-col gap-3 items-center py-4 relative">
                            {/* Dotted connector line */}
                            {sectionModules.length > 1 && (
                                <div className="absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 z-0"
                                    style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${section.color}30 0, ${section.color}30 6px, transparent 6px, transparent 12px)` }}>
                                </div>
                            )}
                            
                            {sectionModules.map((module, mIdx) => {
                                const globalIdx = section.startIdx + mIdx;
                                return (
                                    <div key={module.id} className="relative z-10 w-full flex justify-center"
                                        style={{ animationDelay: `${(sIdx * 3 + mIdx) * 60}ms` }}>
                                        <ModuleCard 
                                            module={module} 
                                            onStart={startLesson} 
                                            userScores={userScores}
                                            index={globalIdx}
                                            totalModules={totalModules}
                                            sectionColor={section.color}
                                            allModules={MODULOS_DE_ROBOTICA}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Bottom completion badge */}
            <div className="text-center py-6">
                <div className="inline-flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFC800] to-[#FF9600] rounded-full flex items-center justify-center text-3xl shadow-lg border-b-4 border-[#E58600]">
                        🎓
                    </div>
                    <span className="text-xs font-black text-[#AFAFAF]">¡Completa todos los módulos!</span>
                </div>
            </div>
        </div>
    </div>
    );
};
const PlaceholderScreen = ({ title, color, goToMenu }) => (
    <div className="p-6 min-h-full bg-white flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 bg-[#E5E5E5] rounded-full flex items-center justify-center mb-4 border-4 border-[#AFAFAF]">
            <span className="text-4xl">🚧</span>
        </div>
        <h1 className="text-2xl font-black text-[#3C3C3C] mb-2">{title}</h1>
        <p className="text-sm text-[#AFAFAF] mb-6 max-w-xs font-bold">Esta sección está lista para ser implementada.</p>
        {goToMenu && <button onClick={goToMenu} className="py-3 px-8 btn-3d btn-3d-green rounded-2xl text-sm">
            Volver al Menú
        </button>}
    </div>
);
const ChallengeCard = ({ challenge, onStart, isCompleted }) => {
    const difficultyStars = '⭐'.repeat(challenge.difficulty || 1);
    const difficultyLabel = ['', 'Principiante', 'Aprendiz', 'Intermedio', 'Avanzado'][challenge.difficulty || 1];
    const langColors = { 'Python': { bg: '#3776AB', light: '#E8F4FD' }, 'Arduino': { bg: '#00979D', light: '#E0F7F8' }, 'C++': { bg: '#659AD2', light: '#EAF0F9' } };
    const lc = langColors[challenge.name] || { bg: '#FF4B4B', light: '#FFE8E8' };
    
    return (
        <div 
            onClick={() => onStart(challenge.id)} 
            className={`bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.97] animate-scale-in group ${isCompleted ? 'border-[#58CC02]/40' : 'border-[#E5E5E5] hover:border-[' + lc.bg + ']'}`}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md border-b-4 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: lc.bg, borderColor: lc.bg + 'CC' }}>
                        <span className="text-white">{challenge.icon}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                        <h2 className="text-sm font-black text-[#3C3C3C] leading-tight truncate">{challenge.title}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: lc.light, color: lc.bg }}>{challenge.name}</span>
                            <span className="text-[10px] font-bold text-[#AFAFAF]">{difficultyStars}</span>
                        </div>
                    </div>
                    {isCompleted && (
                        <div className="w-7 h-7 bg-[#58CC02] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white font-black">✓</span>
                        </div>
                    )}
                </div>
                <p className="text-[11px] text-[#777] font-semibold leading-snug mb-3 line-clamp-2">{challenge.instructions}</p>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#AFAFAF] bg-[#F7F7F7] px-2 py-1 rounded-lg">{difficultyLabel}</span>
                    <span className="text-[10px] font-bold text-[#AFAFAF] bg-[#F7F7F7] px-2 py-1 rounded-lg">{challenge.solution.length} bloques</span>
                </div>
                <button className="w-full py-2.5 btn-3d btn-3d-green rounded-xl text-sm text-center mt-3">
                    {isCompleted ? '🔄 REPETIR' : '▶️ ¡EMPEZAR!'}
                </button>
            </div>
        </div>
    );
};
const ChallengeListScreen = ({ startChallenge, userScores, userStats }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState(0);
    const [selectedLang, setSelectedLang] = useState('Todos');
    
    const difficulties = [
        { label: '🌟 Todos', value: 0 },
        { label: '🌱 Principiante', value: 1 },
        { label: '⭐ Aprendiz', value: 2 },
        { label: '🚀 Intermedio', value: 3 },
        { label: '🏆 Avanzado', value: 4 },
    ];
    const languages = ['Todos', 'Python', 'Arduino', 'C++'];
    
    const filteredChallenges = CODE_CHALLENGES.filter(c => {
        if (selectedDifficulty > 0 && c.difficulty !== selectedDifficulty) return false;
        if (selectedLang !== 'Todos' && c.name !== selectedLang) return false;
        return true;
    });
    
    const completedIds = Object.keys(userScores || {}).filter(k => k.startsWith('challenge_') && userScores[k]?.completed);
    const totalCompleted = completedIds.length;
    const totalChallenges = CODE_CHALLENGES.length;
    const progressPercent = Math.round((totalCompleted / totalChallenges) * 100);
    
    // Per-language and per-level progress
    const pyTotal = CODE_CHALLENGES.filter(c => c.name === 'Python').length;
    const ardTotal = CODE_CHALLENGES.filter(c => c.name === 'Arduino').length;
    const cppTotal = CODE_CHALLENGES.filter(c => c.name === 'C++').length;
    const pyDone = userStats?.challengesPython || 0;
    const ardDone = userStats?.challengesArduino || 0;
    const cppDone = userStats?.challengesCpp || 0;
    
    // XP from challenges
    const challengeXP = (userStats?.challengesCompleted || 0) * 10;
    
    // Milestone markers
    const milestones = [
        { at: 1, icon: '🧩', label: 'Primer Reto' },
        { at: 5, icon: '🔥', label: 'Racha de 5' },
        { at: 12, icon: '⚡', label: '50% Retos' },
        { at: 24, icon: '🏆', label: '¡Todos!' },
    ];

    return (
        <div className="pb-24 min-h-full bg-[#F7F7F7] w-full animate-fade-in"> 
            {/* Header */}
            <div className="bg-gradient-to-br from-[#FF4B4B] to-[#EA2B2B] px-6 pt-8 pb-10 text-center relative overflow-hidden">
                <div className="absolute top-2 right-4 text-7xl opacity-10 rotate-12">🧩</div>
                <div className="absolute bottom-2 left-4 text-5xl opacity-10 -rotate-12">💻</div>
                <span className="text-5xl mb-2 block animate-float">🧩</span>
                <h1 className="text-3xl font-black text-white">Zona de Retos</h1>
                <p className="text-white/80 text-sm font-bold mt-1">¡Aprende programación ordenando bloques de código!</p>
                <div className="mt-3 flex justify-center gap-3">
                    <div className="bg-white/20 px-3 py-1.5 rounded-xl">
                        <span className="text-white text-xs font-black">{totalChallenges} Retos</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1.5 rounded-xl">
                        <span className="text-white text-xs font-black">{totalCompleted} Completados</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1.5 rounded-xl">
                        <span className="text-white text-xs font-black">4 Niveles</span>
                    </div>
                </div>
            </div>
            
            {/* Progress Section */}
            <div className="px-4 -mt-5 max-w-4xl mx-auto relative z-10">
                <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 mb-4 shadow-sm">
                    {/* Overall progress bar */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📊</span>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-black text-[#3C3C3C]">Tu Progreso</p>
                                <span className="text-xs font-black text-[#58CC02]">{totalCompleted}/{totalChallenges} ({progressPercent}%)</span>
                            </div>
                            <div className="w-full h-4 bg-[#E5E5E5] rounded-full overflow-hidden relative">
                                <div className="h-full bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-full transition-all duration-700 ease-out relative"
                                    style={{ width: `${progressPercent}%` }}>
                                    {progressPercent > 8 && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-white">{progressPercent}%</span>
                                    )}
                                </div>
                                {/* Milestone markers on progress bar */}
                                {milestones.map(m => (
                                    <div key={m.at} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                                        style={{ left: `${(m.at / totalChallenges) * 100}%` }}>
                                        <span className={`text-sm ${totalCompleted >= m.at ? '' : 'grayscale opacity-50'}`}
                                            title={m.label}>{m.icon}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Per-language mini bars */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#3776AB]/5 rounded-xl p-2">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs">🐍</span>
                                <span className="text-[10px] font-black text-[#3776AB]">Python</span>
                                <span className="text-[10px] font-bold text-[#AFAFAF] ml-auto">{pyDone}/{pyTotal}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                                <div className="h-full bg-[#3776AB] rounded-full transition-all duration-500" style={{ width: `${pyTotal > 0 ? (pyDone/pyTotal)*100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-[#00979D]/5 rounded-xl p-2">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs">🔷</span>
                                <span className="text-[10px] font-black text-[#00979D]">Arduino</span>
                                <span className="text-[10px] font-bold text-[#AFAFAF] ml-auto">{ardDone}/{ardTotal}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                                <div className="h-full bg-[#00979D] rounded-full transition-all duration-500" style={{ width: `${ardTotal > 0 ? (ardDone/ardTotal)*100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-[#659AD2]/5 rounded-xl p-2">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs">⚙️</span>
                                <span className="text-[10px] font-black text-[#659AD2]">C++</span>
                                <span className="text-[10px] font-bold text-[#AFAFAF] ml-auto">{cppDone}/{cppTotal}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                                <div className="h-full bg-[#659AD2] rounded-full transition-all duration-500" style={{ width: `${cppTotal > 0 ? (cppDone/cppTotal)*100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement milestones row */}
                    <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                        {milestones.map(m => (
                            <div key={m.at} className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-black whitespace-nowrap transition-all ${
                                totalCompleted >= m.at 
                                    ? 'bg-[#58CC02]/10 border-[#58CC02]/30 text-[#58CC02]' 
                                    : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#CDCDCD]'
                            }`}>
                                <span>{m.icon}</span>
                                <span>{m.label}</span>
                                {totalCompleted >= m.at && <span>✓</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* How it works */}
            <div className="px-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 mb-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <p className="text-sm font-black text-[#3C3C3C]">¿Cómo funcionan los retos?</p>
                            <p className="text-xs text-[#777] font-semibold mt-1 leading-relaxed">
                                Arrastra los bloques de código en el <b className="text-[#1CB0F6]">orden correcto</b> para armar el programa. 
                                Cada bloque tiene una <b className="text-[#FF9600]">explicación</b> de lo que hace. 
                                ¡Gana <b className="text-[#58CC02]">logros</b> al completar retos! 🏆
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Filters */}
            <div className="px-4 max-w-4xl mx-auto mb-4">
                {/* Difficulty filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
                    {difficulties.map(d => (
                        <button key={d.value} onClick={() => setSelectedDifficulty(d.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all active:scale-95
                                ${selectedDifficulty === d.value 
                                    ? 'bg-[#FF4B4B] text-white shadow-md' 
                                    : 'bg-white text-[#777] border-2 border-[#E5E5E5] hover:border-[#FF4B4B]'}`}>
                            {d.label}
                        </button>
                    ))}
                </div>
                {/* Language filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {languages.map(lang => {
                        const langEmoji = { 'Todos': '🌐', 'Python': '🐍', 'Arduino': '🔷', 'C++': '⚙️' }[lang];
                        return (
                            <button key={lang} onClick={() => setSelectedLang(lang)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all active:scale-95
                                    ${selectedLang === lang 
                                        ? 'bg-[#2563EB] text-white shadow-md' 
                                        : 'bg-white text-[#777] border-2 border-[#E5E5E5] hover:border-[#2563EB]'}`}>
                                {langEmoji} {lang}
                            </button>
                        );
                    })}
                </div>
            </div>
        
            <div className="px-4 w-full max-w-4xl mx-auto relative z-10">
                {filteredChallenges.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="text-5xl block mb-3">🔍</span>
                        <p className="text-lg font-black text-[#AFAFAF]">No hay retos con estos filtros</p>
                        <p className="text-sm text-[#CDCDCD] font-bold mt-1">Prueba cambiando los filtros</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                        {filteredChallenges.map(challenge => (
                            <ChallengeCard 
                                key={challenge.id} 
                                challenge={challenge} 
                                onStart={startChallenge}
                                isCompleted={completedIds.includes('challenge_' + challenge.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
const ChallengeBlock = ({ block, onClick, isSolutionBlock, challengeStatus, showExplanation }) => {
    let colorClass = 'bg-white text-[#3C3C3C] border-[#E5E5E5] hover:border-[#1CB0F6] hover:bg-[#1CB0F6]/5';
    let cursor = 'cursor-pointer';
    let isDisabled = challengeStatus !== 'active';
    const isWrong = block.type === 'wrong';

    if (isSolutionBlock) {
        if (challengeStatus === 'correct') {
            colorClass = 'bg-[#58CC02]/10 text-[#3C3C3C] border-[#58CC02]/40';
            cursor = 'cursor-not-allowed';
        } else if (challengeStatus === 'incorrect') {
            colorClass = 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/30';
        } else {
            colorClass = 'bg-[#1CB0F6]/10 text-[#1CB0F6] border-[#1CB0F6]/30 hover:bg-[#1CB0F6]/20';
        }
    } else if (isWrong && challengeStatus !== 'active') {
         colorClass = 'bg-[#FF4B4B]/5 text-[#AFAFAF] border-[#FF4B4B]/20 opacity-60';
         cursor = 'cursor-not-allowed';
         isDisabled = true;
    }

    return (
        <div className="w-full">
            <div 
                key={block.id}
                onClick={!isDisabled ? () => onClick(block.id) : null}
                className={`text-xs font-mono font-bold px-3 py-2.5 rounded-xl border-2 transition duration-150 transform hover:scale-[1.01] 
                            ${colorClass} ${cursor} ${isDisabled && !isSolutionBlock ? 'opacity-60' : ''}`}
                style={{ paddingLeft: block.text.startsWith(' ') && isSolutionBlock ? '40px' : '' }} 
            >
                <div className="flex items-center gap-2">
                    {isSolutionBlock && challengeStatus === 'active' && (
                        <span className="text-[10px] text-[#1CB0F6] flex-shrink-0">✕</span>
                    )}
                    {!isSolutionBlock && !isWrong && challengeStatus === 'active' && (
                        <span className="text-[10px] text-[#58CC02] flex-shrink-0">+</span>
                    )}
                    {isWrong && challengeStatus !== 'active' && (
                        <span className="text-[10px] flex-shrink-0">🚫</span>
                    )}
                    <span className="flex-grow">{block.text.trim()}</span>
                </div>
            </div>
            {/* Show explanation for solution blocks after checking */}
            {showExplanation && isSolutionBlock && challengeStatus === 'correct' && block.explanation && (
                <div className="ml-4 mt-1 mb-1 px-3 py-1.5 bg-[#58CC02]/5 rounded-lg border-l-3 border-[#58CC02]/30 animate-fade-in">
                    <p className="text-[10px] text-[#555] font-semibold leading-relaxed">{block.explanation}</p>
                </div>
            )}
            {/* Show why wrong for incorrect blocks */}
            {showExplanation && isWrong && challengeStatus !== 'active' && block.whyWrong && (
                <div className="ml-4 mt-1 mb-1 px-3 py-1.5 bg-[#FF4B4B]/5 rounded-lg border-l-3 border-[#FF4B4B]/20 animate-fade-in">
                    <p className="text-[10px] text-[#FF4B4B]/80 font-semibold leading-relaxed">🚫 {block.whyWrong}</p>
                </div>
            )}
        </div>
    );
};
const ChallengeView = ({ currentChallengeId, startChallenge, goToMenu, userScores, setUserScores, setUserStats, setUnlockedPopupAchievement }) => {
    const currentChallenge = CODE_CHALLENGES.find(c => c.id === currentChallengeId);
    if (!currentChallenge) return <PlaceholderScreen title="Reto no encontrado" color="yellow" goToMenu={goToMenu} />;

    const [challengeBlocks, setChallengeBlocks] = useState(() => shuffleArray([...currentChallenge.solution, ...currentChallenge.extra_blocks])); 
    const [userSolution, setUserSolution] = useState([]); 
    const [challengeStatus, setChallengeStatus] = useState('active');
    const [showConcept, setShowConcept] = useState(false);
    const [showExplanations, setShowExplanations] = useState(false);
    const [hintIndex, setHintIndex] = useState(-1);

    // Find next/prev challenge
    const currentIdx = CODE_CHALLENGES.findIndex(c => c.id === currentChallengeId);
    const nextChallenge = CODE_CHALLENGES[currentIdx + 1];
    const prevChallenge = CODE_CHALLENGES[currentIdx - 1];

    useEffect(() => {
        setChallengeBlocks(shuffleArray([...currentChallenge.solution, ...currentChallenge.extra_blocks]));
        setUserSolution([]);
        setChallengeStatus('active');
        setShowConcept(false);
        setShowExplanations(false);
        setHintIndex(-1);
    }, [currentChallengeId]);

    const handleBlockMove = (blockId, fromList, fromListSetter, toListSetter) => {
        if (challengeStatus !== 'active') return;
        
        const block = fromList.find(b => b.id === blockId);
        if (!block) return;
        if (!fromListSetter || !toListSetter) return;
        
        if (block.type === 'wrong' && toListSetter === setUserSolution) return;

        fromListSetter(prevList => prevList.filter(b => b.id !== blockId));
        toListSetter(prevList => [...prevList, block]);
    };

    const handleSelectBlock = useCallback((blockId) => {
        handleBlockMove(blockId, challengeBlocks, setChallengeBlocks, setUserSolution);
    }, [challengeBlocks, challengeStatus]);

    const handleUnselectBlock = useCallback((blockId) => {
        handleBlockMove(blockId, userSolution, setUserSolution, setChallengeBlocks);
    }, [userSolution, challengeStatus]);
    
    const checkChallengeSolution = () => {
        const solutionIds = currentChallenge.solution.map(b => b.id);
        const userIds = userSolution.map(b => b.id);
        
        // Check: same length + same order
        if (userIds.length !== solutionIds.length) {
            setChallengeStatus('incorrect');
            return;
        }
        
        const isCorrect = userIds.every((id, index) => id === solutionIds[index]);
        setChallengeStatus(isCorrect ? 'correct' : 'incorrect');
        
        if (isCorrect) {
            setShowExplanations(true);
            // Save completion to userScores
            const scoreKey = 'challenge_' + currentChallengeId;
            const alreadyCompleted = userScores?.[scoreKey]?.completed;
            if (setUserScores) {
                setUserScores(prev => ({
                    ...prev,
                    [scoreKey]: { completed: true, score: 1, total: 1 }
                }));
            }
            // Update userStats and check achievements (only if first time completing)
            if (!alreadyCompleted && setUserStats) {
                const langKey = { 'Python': 'challengesPython', 'Arduino': 'challengesArduino', 'C++': 'challengesCpp' }[currentChallenge.name];
                const levelKey = `challengesLevel${currentChallenge.difficulty}`;
                const xpEarned = (currentChallenge.difficulty || 1) * 10;
                setUserStats(prev => {
                    const newStats = {
                        ...prev,
                        challengesCompleted: (prev.challengesCompleted || 0) + 1,
                        totalPoints: (prev.totalPoints || 0) + xpEarned,
                    };
                    if (langKey) newStats[langKey] = (prev[langKey] || 0) + 1;
                    if (levelKey) newStats[levelKey] = (prev[levelKey] || 0) + 1;
                    // Check for newly unlocked achievements
                    if (ACHIEVEMENTS && ACHIEVEMENTS.length > 0 && setUnlockedPopupAchievement) {
                        const newlyUnlocked = ACHIEVEMENTS.filter(a => {
                            return a.condition(newStats) && !prev._unlockedIds?.includes(a.id) && !newStats._unlockedIds?.includes(a.id);
                        });
                        if (newlyUnlocked.length > 0) {
                            newStats._unlockedIds = [...(prev._unlockedIds || []), ...newlyUnlocked.map(a => a.id)];
                            setTimeout(() => setUnlockedPopupAchievement(newlyUnlocked[0]), 800);
                        }
                    }
                    return newStats;
                });
            }
        }
    };

    const boldReplace = (text) => text.replace(/\*\*(.*?)\*\*/g, '<b class="text-[#3C3C3C]">$1</b>');
    const difficultyStars = '⭐'.repeat(currentChallenge.difficulty || 1);
    const langColors = { 'Python': '#3776AB', 'Arduino': '#00979D', 'C++': '#659AD2' };
    const lc = langColors[currentChallenge.name] || '#FF4B4B';

    return (
        <div className="min-h-full bg-[#F7F7F7] flex flex-col animate-fade-in">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-100 px-4 py-3">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                    <button 
                        onClick={() => goToMenu('Retos')}
                        className="text-[#777] hover:text-[#3C3C3C] transition flex items-center bg-white p-2 rounded-xl border-2 border-[#E5E5E5] active:scale-95"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        <span className="text-xs font-black">Retos</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: lc }}>{currentChallenge.icon} {currentChallenge.name}</span>
                        <span className="text-xs font-bold text-[#AFAFAF]">{difficultyStars}</span>
                    </div>
                    <span className="text-xs font-black text-[#AFAFAF] bg-[#F7F7F7] px-2.5 py-1 rounded-full">{currentIdx + 1}/{CODE_CHALLENGES.length}</span>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pb-32">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Title */}
                    <div className="py-4">
                        <h1 className="text-xl font-black text-[#3C3C3C] mb-1">{currentChallenge.title}</h1>
                        <p className="text-xs text-[#777] font-bold leading-relaxed">{currentChallenge.instructions}</p>
                    </div>
                    
                    {/* Concept toggle */}
                    {currentChallenge.concept && (
                        <button onClick={() => setShowConcept(!showConcept)}
                            className="w-full mb-3 bg-white rounded-2xl border-2 border-[#FFC800]/30 overflow-hidden transition-all active:scale-[0.99]">
                            <div className="px-4 py-3 flex items-center gap-2">
                                <span className="text-lg">💡</span>
                                <span className="text-sm font-black text-[#FF9600] flex-grow text-left">
                                    {showConcept ? 'Ocultar explicación' : '¿Qué aprendo aquí? (Toca para ver)'}
                                </span>
                                <span className={`text-sm transition-transform ${showConcept ? 'rotate-180' : ''}`}>▼</span>
                            </div>
                            {showConcept && (
                                <div className="px-4 pb-4 animate-fade-in">
                                    <div className="bg-[#FFC800]/10 p-3 rounded-xl mb-2">
                                        <p className="text-xs text-[#555] font-semibold leading-relaxed" dangerouslySetInnerHTML={{ __html: boldReplace(currentChallenge.concept) }} />
                                    </div>
                                    {currentChallenge.funFact && (
                                        <div className="bg-[#CE82FF]/10 p-3 rounded-xl">
                                            <p className="text-xs text-[#777] font-semibold leading-relaxed">{currentChallenge.funFact}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </button>
                    )}
                    
                    {/* Hints */}
                    {currentChallenge.hints && currentChallenge.hints.length > 0 && challengeStatus !== 'correct' && (
                        <div className="mb-3">
                            <button onClick={() => setHintIndex(prev => Math.min(prev + 1, currentChallenge.hints.length - 1))}
                                disabled={hintIndex >= currentChallenge.hints.length - 1}
                                className={`w-full px-4 py-3 rounded-2xl border-2 text-left transition active:scale-[0.99] ${
                                    hintIndex >= currentChallenge.hints.length - 1 
                                        ? 'bg-[#F7F7F7] border-[#E5E5E5]' 
                                        : 'bg-white border-[#1CB0F6]/30 hover:border-[#1CB0F6]'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🔍</span>
                                    <span className={`text-sm font-black flex-grow ${hintIndex >= currentChallenge.hints.length - 1 ? 'text-[#AFAFAF]' : 'text-[#1CB0F6]'}`}>
                                        {hintIndex < 0 ? '¿Necesitas una pista? (Toca aquí)' : 
                                         hintIndex < currentChallenge.hints.length - 1 ? `Ver siguiente pista (${hintIndex + 1}/${currentChallenge.hints.length})` :
                                         `Todas las pistas mostradas ✓`}
                                    </span>
                                    {hintIndex < currentChallenge.hints.length - 1 && <span className="text-[#1CB0F6] text-xs font-bold">💡</span>}
                                </div>
                            </button>
                            {hintIndex >= 0 && (
                                <div className="mt-2 space-y-2 animate-fade-in">
                                    {currentChallenge.hints.slice(0, hintIndex + 1).map((hint, i) => (
                                        <div key={i} className="flex items-start gap-2 bg-[#1CB0F6]/5 border border-[#1CB0F6]/20 px-4 py-2.5 rounded-xl">
                                            <span className="text-xs font-black text-[#1CB0F6] shrink-0 mt-0.5">💡{i + 1}.</span>
                                            <p className="text-xs text-[#555] font-semibold leading-relaxed">{hint}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Status message */}
                    {challengeStatus !== 'active' && (
                        <div className={`p-4 rounded-2xl font-black text-sm text-center mb-3 animate-bounce-in border-2 ${
                            challengeStatus === 'correct' 
                                ? 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/30' 
                                : 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/30'
                        }`}>
                            <span className="text-2xl block mb-1">{challengeStatus === 'correct' ? '🎉' : '🤔'}</span>
                            {challengeStatus === 'correct' 
                                ? '¡PERFECTO! ¡Código correcto!' 
                                : '¡Casi! Revisa el orden de los bloques.'
                            }
                            {challengeStatus === 'correct' && (
                                <p className="text-xs font-semibold text-[#777] mt-1">👇 Lee las explicaciones de cada línea abajo</p>
                            )}
                        </div>
                    )}
                    
                    {/* Solution area */}
                    <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5] mb-3 flex flex-col min-h-[160px] overflow-hidden">
                        <h2 className="text-xs font-black text-[#1CB0F6] mb-2 flex items-center gap-1">
                            <Target size={14}/> Tu Solución 
                            <span className="text-[#AFAFAF] font-bold ml-1">({userSolution.length}/{currentChallenge.solution.length} bloques)</span>
                        </h2>
                        <div className="space-y-1.5 overflow-y-auto flex-grow">
                            {userSolution.map(block => (
                                <ChallengeBlock key={block.id} block={block} onClick={handleUnselectBlock} isSolutionBlock={true} challengeStatus={challengeStatus} showExplanation={showExplanations} />
                            ))}
                        </div>
                        {userSolution.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <span className="text-3xl mb-2">👆</span>
                                <p className="text-[#CDCDCD] text-sm font-bold">Toca los bloques de abajo para agregarlos aquí</p>
                                <p className="text-[#E5E5E5] text-xs font-semibold mt-1">¡El orden importa!</p>
                            </div>
                        )}
                    </div>

                    {/* Available blocks */}
                    <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5] mb-3 overflow-y-auto min-h-[100px]">
                        <h2 className="text-xs font-black text-[#777] mb-2 flex items-center gap-1">
                            <Terminal size={14}/> Bloques Disponibles 
                            <span className="text-[#AFAFAF] font-bold ml-1">({challengeBlocks.length})</span>
                            {challengeBlocks.some(b => b.type === 'wrong') && challengeStatus === 'active' && (
                                <span className="text-[10px] text-[#FF9600] bg-[#FF9600]/10 px-2 py-0.5 rounded-full ml-auto">⚠️ ¡Hay bloques trampa!</span>
                            )}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {challengeBlocks.map(block => (
                                <ChallengeBlock key={block.id} block={block} onClick={handleSelectBlock} isSolutionBlock={false} challengeStatus={challengeStatus} showExplanation={showExplanations} />
                            ))}
                        </div>
                    </div>

                    {/* Concept summary after completion */}
                    {challengeStatus === 'correct' && currentChallenge.concept && (
                        <div className="bg-gradient-to-br from-[#58CC02]/10 to-[#2563EB]/10 p-4 rounded-2xl border-2 border-[#58CC02]/20 mb-3 animate-scale-in">
                            <h3 className="text-sm font-black text-[#58CC02] mb-2 flex items-center gap-2">🧠 ¿Qué aprendiste?</h3>
                            <p className="text-xs text-[#555] font-semibold leading-relaxed" dangerouslySetInnerHTML={{ __html: boldReplace(currentChallenge.concept) }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Action buttons - sticky bottom */}
            <div className="sticky bottom-16 bg-white border-t-2 border-gray-100 px-4 py-3">
                <div className="max-w-2xl mx-auto space-y-2">
                    {challengeStatus === 'active' && (
                        <button
                            onClick={checkChallengeSolution}
                            disabled={userSolution.length === 0}
                            className={`w-full py-3.5 rounded-xl text-sm transition
                                        ${userSolution.length > 0 ? 'btn-3d btn-3d-green' : 'bg-[#E5E5E5] text-[#AFAFAF] border-b-4 border-[#CDCDCD] cursor-not-allowed font-extrabold'}`}
                        >
                            {userSolution.length > 0 
                                ? `✅ VERIFICAR CÓDIGO (${userSolution.length}/${currentChallenge.solution.length})` 
                                : '👆 Selecciona bloques primero'}
                        </button>
                    )}
                    {challengeStatus !== 'active' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => startChallenge(currentChallengeId)}
                                className="flex-1 py-3 btn-3d btn-3d-yellow rounded-xl text-sm"
                            >
                                🔄 Reintentar
                            </button>
                            {challengeStatus === 'correct' && nextChallenge && (
                                <button
                                    onClick={() => startChallenge(nextChallenge.id)}
                                    className="flex-1 py-3 btn-3d btn-3d-green rounded-xl text-sm"
                                >
                                    ▶️ Siguiente Reto
                                </button>
                            )}
                            {challengeStatus === 'incorrect' && (
                                <button
                                    onClick={() => {
                                        if (currentChallenge.hints && hintIndex < currentChallenge.hints.length - 1) {
                                            setHintIndex(prev => prev + 1);
                                        } else {
                                            setShowConcept(true);
                                        }
                                    }}
                                    className="flex-1 py-3 bg-[#FFC800] text-white font-extrabold rounded-xl text-sm border-b-4 border-[#E5B800] active:scale-95 transition"
                                >
                                    {currentChallenge.hints && hintIndex < currentChallenge.hints.length - 1 ? '🔍 Ver Pista' : '💡 Ver Ayuda'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
const BottomNavBar = ({ currentTab, onSelectTab, setViewMode }) => {
    const tabs = [
        { id: 'Biblioteca', icon: '🏠', label: 'Aprender' },
        { id: 'Retos', icon: '🧩', label: 'Retos' },
        { id: 'Circuitos', icon: '⚡', label: 'Circuitos' },
        { id: 'Glosario', icon: '📖', label: 'Glosario' },
        { id: 'Simulador', icon: '🤖', label: 'Robot' },
        { id: 'Logros', icon: '🏆', label: 'Logros', isAchievements: true },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-gray-100" style={{ paddingBottom: 'var(--sab, 0px)' }}>
            <div className="max-w-xl mx-auto">
                <div className="flex justify-around items-stretch">
                    {tabs.map(tab => {
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (tab.isAchievements) {
                                        setViewMode('achievements');
                                    } else {
                                        onSelectTab(tab.id);
                                        setViewMode('menu');
                                    }
                                }}
                                className={`flex flex-col items-center justify-center py-2.5 px-2 flex-1 transition-all duration-200 active:scale-90 relative border-t-[3px]
                                    ${isActive 
                                        ? 'border-[#2563EB] text-[#2563EB]' 
                                        : 'border-transparent text-[#AFAFAF] hover:text-[#777]'}`}
                            >
                                <span className={`text-[22px] mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>{tab.icon}</span>
                                <span className={`text-[10px] font-extrabold leading-tight tracking-wide`}>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function App() {
    const [currentTab, setCurrentTab] = useState('Biblioteca'); 
    const [viewMode, setViewMode] = useState('menu'); 
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [currentChallengeId, setCurrentChallengeId] = useState(null); 
    
    // User Profile (from Onboarding)
    const [userProfile, setUserProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('cultivatec_profile');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // ALL hooks MUST be declared before any conditional return
    // === FIREBASE AUTH STATE ===
    const [userId, setUserId] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState('');
    const [firebaseProfile, setFirebaseProfile] = useState(null);
    const [pendingFriendRequests, setPendingFriendRequests] = useState(0);

    const [userScores, setUserScores] = useState({});
    
    // Estados para nuevas funcionalidades
    const [quizModuleId, setQuizModuleId] = useState(null);
    const [userStats, setUserStats] = useState(() => {
        try {
            const saved = localStorage.getItem('cultivatec_userStats');
            if (saved) return JSON.parse(saved);
        } catch {}
        return {
            modulesCompleted: 0,
            modulesVisited: 0,
            quizzesCompleted: 0,
            perfectQuizzes: 0,
            maxStreak: 0,
            fastestCorrectAnswer: 999,
            codesExecuted: 0,
            aiCodesGenerated: 0,
            consecutiveNoErrors: 0,
            challengesCompleted: 0,
            challengesPython: 0,
            challengesArduino: 0,
            challengesCpp: 0,
            challengesLevel1: 0,
            challengesLevel2: 0,
            challengesLevel3: 0,
            challengesLevel4: 0,
            ledGuideCompleted: false,
            classesAttended: 0,
            sectionsVisited: 1,
            totalPoints: 0,
            quizScores: {},
        };
    });
    const [achievementToast, setAchievementToast] = useState(null);
    const [unlockedPopupAchievement, setUnlockedPopupAchievement] = useState(null);
    const [completedModules, setCompletedModules] = useState(new Set());
    const [visitedSections, setVisitedSections] = useState(new Set(['Biblioteca']));
    const [showRobotEditor, setShowRobotEditor] = useState(false);

    // Persist userStats to localStorage
    useEffect(() => {
        try { localStorage.setItem('cultivatec_userStats', JSON.stringify(userStats)); } catch {}
    }, [userStats]);

    // === FIREBASE AUTH LISTENER ===
    useEffect(() => {
        const unsubscribeAuth = onAuthChange((user) => {
            if (user) {
                setUserId(user.uid);
                setAuthLoading(false);
            } else {
                setUserId(null);
                setFirebaseProfile(null);
                setAuthLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // === FIREBASE PROFILE & SCORES SYNC ===
    useEffect(() => {
        if (!userId) return;

        // Verificar y actualizar racha diaria
        checkAndUpdateStreak(userId).catch(console.error);

        // Listen to user profile
        const unsubProfile = onUserProfileChange(userId, (profile) => {
            setFirebaseProfile(profile);
            // Sync Firestore totalPoints back to local userStats to avoid mismatch
            if (profile && profile.totalPoints !== undefined) {
                setUserStats(prev => {
                    if (prev.totalPoints !== profile.totalPoints) {
                        return { ...prev, totalPoints: profile.totalPoints, modulesCompleted: profile.modulesCompleted ?? prev.modulesCompleted };
                    }
                    return prev;
                });
            }
        });

        // Listen to user scores
        const unsubScores = onUserScoresChange(userId, (scores) => {
            setUserScores(scores);
            persistUserScores(scores); // Keep local backup
            // Sync completedModules Set
            const completedIds = Object.entries(scores)
                .filter(([, s]) => s && s.total > 0 && Math.round((s.score / s.total) * 100) >= 100)
                .map(([id]) => id);
            if (completedIds.length > 0) {
                setCompletedModules(new Set(completedIds));
            }
        });

        // Listen to pending friend requests count
        const unsubRequests = onPendingRequestsChange(userId, (requests) => {
            setPendingFriendRequests(requests.length);
        });

        return () => {
            unsubProfile();
            unsubScores();
            unsubRequests();
        };
    }, [userId]);

    // === AUTH HANDLERS ===
    const handleLogin = async (email, password) => {
        setAuthError('');
        setAuthLoading(true);
        try {
            await loginUser(email, password);
        } catch (err) {
            const msg = err.code === 'auth/user-not-found' ? 'Usuario no encontrado. Verifica tu email o nombre de usuario.'
                : err.code === 'auth/wrong-password' ? 'Contraseña incorrecta.'
                : err.code === 'auth/invalid-email' ? 'Email inválido.'
                : err.code === 'auth/invalid-credential' ? 'Credenciales inválidas. Verifica tu email/usuario y contraseña.'
                : err.message || 'Error al iniciar sesión.';
            setAuthError(msg);
            setAuthLoading(false);
        }
    };

    const handleRegister = async (email, password, username, fullName) => {
        setAuthError('');
        setAuthLoading(true);
        try {
            await registerUser(email, password, username, fullName, userProfile?.robotConfig, userProfile?.robotName);
        } catch (err) {
            const msg = err.code === 'auth/email-already-in-use' ? 'Este email ya está registrado.'
                : err.code === 'auth/weak-password' ? 'La contraseña es muy débil.'
                : err.message || 'Error al registrarse.';
            setAuthError(msg);
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUserId(null);
            setFirebaseProfile(null);
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    // Handle module completion
    const handleModuleComplete = useCallback((moduleId, xpEarned = 0) => {
        if (completedModules.has(moduleId)) return;
        
        // Mark module as completed in userScores
        const moduleData = MODULOS_DE_ROBOTICA.find(m => m.id === moduleId);
        const totalSteps = Array.isArray(moduleData?.contenidoTeorico) 
            ? moduleData.contenidoTeorico.length 
            : (moduleData?.contenidoTeorico === '__MODULO_1_REF__' ? 6 : 2);
        const newScoreData = { score: totalSteps, total: totalSteps };

        setUserScores(prev => {
            const newScores = { ...prev, [moduleId]: newScoreData };
            persistUserScores(newScores);
            return newScores;
        });

        // Sync to Firebase
        if (userId) {
            saveModuleScore(userId, moduleId, newScoreData).catch(console.error);
            syncUserStats(userId, {
                addModulesCompleted: 1,
                addPoints: xpEarned,
                newTotalPoints: (userStats.totalPoints || 0) + xpEarned,
            }).catch(console.error);
        }

        setCompletedModules(prev => {
            const n = new Set(prev);
            n.add(moduleId);
            return n;
        });
        setUserStats(prev => {
            const newStats = {
                ...prev,
                modulesCompleted: prev.modulesCompleted + 1,
                totalPoints: prev.totalPoints + xpEarned,
            };
            // Check for newly unlocked achievements
            if (ACHIEVEMENTS && ACHIEVEMENTS.length > 0) {
                const newlyUnlocked = ACHIEVEMENTS.find(a => {
                    if (a.id === 'first_module' && newStats.modulesCompleted >= 1) return true;
                    if (a.id === 'five_modules' && newStats.modulesCompleted >= 5) return true;
                    if (a.id === 'ten_modules' && newStats.modulesCompleted >= 10) return true;
                    if (a.id === 'all_modules' && newStats.modulesCompleted >= 13) return true;
                    return false;
                });
                if (newlyUnlocked && !prev._unlockedIds?.includes(newlyUnlocked.id)) {
                    newStats._unlockedIds = [...(prev._unlockedIds || []), newlyUnlocked.id];
                    setTimeout(() => setUnlockedPopupAchievement(newlyUnlocked), 1500);
                }
            }
            return newStats;
        });
    }, [completedModules]);

    // Rastrear secciones visitadas
    useEffect(() => {
        setVisitedSections(prev => {
            const newSet = new Set(prev);
            newSet.add(currentTab);
            return newSet;
        });
        setUserStats(prev => ({ ...prev, sectionsVisited: visitedSections.size }));
    }, [currentTab]);

    const handleOnboardingComplete = (profile) => {
        setUserProfile(profile);
        localStorage.setItem('cultivatec_profile', JSON.stringify(profile));
        // Sync robot config to Firebase if logged in
        if (userId) {
            try {
                updateUserProfile(userId, {
                    robotConfig: profile.robotConfig,
                    robotName: profile.robotName,
                });
            } catch {}
        }
    };

    const handleRobotSave = (newConfig, newName) => {
        const updatedProfile = {
            ...userProfile,
            robotConfig: newConfig,
            robotName: newName || userProfile?.robotName || 'Sparky',
        };
        setUserProfile(updatedProfile);
        localStorage.setItem('cultivatec_profile', JSON.stringify(updatedProfile));
        // Sync to Firebase
        if (userId) {
            try {
                updateUserProfile(userId, {
                    robotConfig: newConfig,
                    robotName: newName || userProfile?.robotName || 'Sparky',
                });
            } catch {}
        }
    };

    // Show loading screen while Firebase Auth initializes
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#2563EB] text-white font-sans">
                <div className="text-center animate-scale-in">
                    <div className="w-28 h-28 mx-auto mb-6 bg-white rounded-3xl p-4 shadow-xl animate-pulse-soft">
                        <img src={CULTIVATEC_LOGO_PATH} alt="Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; }} />
                    </div>
                    <h1 className="text-4xl font-black mb-1 tracking-tight">CultivaTec</h1>
                    <p className="text-sm text-white/80 font-bold mb-6">¡Aprende Robótica Jugando!</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show auth screen FIRST if not logged in
    if (!userId) {
        return <AuthScreen
            onLogin={handleLogin}
            onRegister={handleRegister}
            isLoading={false}
            error={authError}
        />;
    }

    // Show onboarding (robot customization) AFTER login if no profile yet
    if (!userProfile) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} firebaseProfile={firebaseProfile} />;
    }

    const goToMenu = (tab = currentTab) => {
        setCurrentTab(tab);
        setViewMode('menu'); 
        setCurrentModuleId(null);
        setCurrentChallengeId(null);
    };
    
    const startLesson = (moduleId) => {
        // Check if module is unlocked
        const moduleIdx = MODULOS_DE_ROBOTICA.findIndex(m => m.id === moduleId);
        if (moduleIdx > 0 && !isModuleUnlocked(userScores, moduleIdx, MODULOS_DE_ROBOTICA)) {
            // Show feedback instead of silently blocking
            const prevModule = MODULOS_DE_ROBOTICA[moduleIdx - 1];
            const prevName = prevModule?.titulo || 'el módulo anterior';
            alert(`🔒 Este módulo está bloqueado.\n\nPrimero completa: "${prevName}"`);
            return;
        }
        
        setCurrentModuleId(moduleId);
        const moduleData = MODULOS_DE_ROBOTICA.find(m => m.id === moduleId);
        
        // --- LÓGICA DE VISTAS ESPECIALES ACTUALIZADA ---
        if (moduleData?.specialView === 'Module1View') {
            setViewMode('module1_view');
        } else if (moduleData?.specialView === 'InteractiveLEDGuide') { // Nueva clave para la guía
            setViewMode('led_guide'); 
        } else {
            setViewMode('lesson_generic');
        }
    };
    
    const startChallenge = (challengeId) => {
        setCurrentChallengeId(challengeId);
        setViewMode('challenge'); 
    };
    
    const startPractice = (moduleId = 'mod_electr') => {
        setQuizModuleId(moduleId || currentModuleId || 'mod_electr');
        setViewMode('quiz');
    };

    const handleQuizComplete = (moduleId, correct, total, score) => {
        const percentage = Math.round((correct / total) * 100);
        
        // Update userScores with quiz result
        if (percentage >= 70) {
            const quizScoreData = { score: correct, total: total };
            setUserScores(prev => {
                const newScores = { ...prev, [moduleId]: quizScoreData };
                persistUserScores(newScores);
                return newScores;
            });
            // Sync to Firebase
            if (userId) {
                saveModuleScore(userId, moduleId, quizScoreData).catch(console.error);
            }
            // Also mark as completed if >= 100%
            if (percentage >= 100) {
                handleModuleComplete(moduleId, correct * 10);
            }
        }

        // Sync quiz stats to Firebase
        if (userId) {
            syncUserStats(userId, {
                addQuizzesCompleted: 1,
                addPerfectQuizzes: percentage === 100 ? 1 : 0,
                newTotalPoints: userStats.totalPoints + (percentage >= 70 ? correct * 5 : 0),
                addPoints: percentage >= 70 ? correct * 5 : 0,
            }).catch(console.error);
        }

        setUserStats(prev => ({
            ...prev,
            quizzesCompleted: prev.quizzesCompleted + 1,
            perfectQuizzes: percentage === 100 ? prev.perfectQuizzes + 1 : prev.perfectQuizzes,
            quizScores: { ...prev.quizScores, [moduleId]: percentage },
        }));
    };


    // --- RENDERIZADO PRINCIPAL (Control de Vistas) ---
    const currentModule = MODULOS_DE_ROBOTICA.find(m => m.id === currentModuleId);
    let ScreenContent;
    
    if (viewMode === 'module1_view') {
        ScreenContent = <Module1View 
                            module={currentModule} 
                            onBack={() => goToMenu('Biblioteca')} 
                            startPractice={startPractice}
                            onModuleComplete={handleModuleComplete}
                        />;
    } else if (viewMode === 'led_guide') {
        // Renderiza el nuevo componente de la guía de proyecto
        ScreenContent = <InteractiveLEDGuide 
                            onBack={() => goToMenu('Biblioteca')}
                            onModuleComplete={handleModuleComplete}
                            userProfile={userProfile}
                            onShowLicenses={() => setViewMode('licenses')}
                        />;
    } else if (viewMode === 'lesson_generic') {
        ScreenContent = <GenericLessonScreen 
                            currentModule={currentModule} 
                            goToMenu={() => goToMenu('Biblioteca')}
                            onModuleComplete={handleModuleComplete}
                            userProfile={userProfile}
                            onShowLicenses={() => setViewMode('licenses')}
                        />;
    } else if (viewMode === 'quiz') {
        ScreenContent = <QuizScreen 
                            moduleId={quizModuleId || currentModuleId || 'mod_electr'}
                            moduleName={currentModule?.titulo || 'Electricidad Inicial'}
                            onBack={() => {
                                if (currentModuleId) {
                                    setViewMode('module1_view');
                                } else {
                                    goToMenu('Biblioteca');
                                }
                            }}
                            onComplete={handleQuizComplete}
                        />;
    } else if (viewMode === 'challenge') {
        ScreenContent = <ChallengeView 
                            currentChallengeId={currentChallengeId} 
                            startChallenge={startChallenge}
                            goToMenu={goToMenu}
                            userScores={userScores}
                            setUserScores={setUserScores}
                            setUserStats={setUserStats}
                            setUnlockedPopupAchievement={setUnlockedPopupAchievement}
                        />;
    } else if (viewMode === 'achievements') {
        ScreenContent = <AchievementsScreen 
                            onBack={() => goToMenu('Biblioteca')}
                            userStats={userStats}
                            onShowRanking={() => setViewMode('ranking')}
                            onShowFriends={() => setViewMode('friends')}
                            pendingFriendRequests={pendingFriendRequests}
                        />;
    } else if (viewMode === 'ranking') {
        ScreenContent = <RankingScreen
                            onBack={() => setViewMode('achievements')}
                            currentUserId={userId}
                            currentUserProfile={firebaseProfile}
                        />;
    } else if (viewMode === 'friends') {
        ScreenContent = <FriendsScreen
                            onBack={() => setViewMode('achievements')}
                            currentUserId={userId}
                            currentUserProfile={firebaseProfile}
                        />;
    } else if (viewMode === 'licenses') {
        ScreenContent = <LicensesScreen 
                            onBack={() => goToMenu('Biblioteca')}
                            userScores={userScores}
                            userProfile={userProfile}
                            completedModules={completedModules}
                        />;
    } else { 
         // Modo 'menu'
         switch (currentTab) {
            case 'Biblioteca':
                ScreenContent = <LibraryScreen 
                    startLesson={startLesson} 
                    userId={userId} 
                    userScores={userScores}
                    onShowAchievements={() => setViewMode('achievements')}
                    onShowLicenses={() => setViewMode('licenses')}
                    userStats={userStats}
                    userProfile={userProfile}
                    onLogout={handleLogout}
                    firebaseProfile={firebaseProfile}
                    onEditRobot={() => setShowRobotEditor(true)}
                />;
                break;
            case 'Taller':
                ScreenContent = <WorkshopScreen goToMenu={goToMenu} />; // <-- El taller de código
                break;
            case 'Retos':
                ScreenContent = <ChallengeListScreen startChallenge={startChallenge} userScores={userScores} userStats={userStats} />;
                break;
            case 'Simulador':
                ScreenContent = <RobotSimulator onBack={() => goToMenu('Biblioteca')} />;
                break;
            case 'Circuitos':
                ScreenContent = <CircuitBuilder onBack={() => goToMenu('Biblioteca')} />;
                break;
            case 'Glosario':
                ScreenContent = <GlossaryScreen robotConfig={userProfile?.robotConfig} robotName={userProfile?.robotName} />;
                break;
            case 'Clases':
                ScreenContent = <ClassroomScreen />;
                break;
            default:
                ScreenContent = <LibraryScreen startLesson={startLesson} userId={userId} userScores={userScores} userProfile={userProfile} onShowLicenses={() => setViewMode('licenses')} onLogout={handleLogout} firebaseProfile={firebaseProfile} onEditRobot={() => setShowRobotEditor(true)} />; 
        }
    }


    return (
        <div className="font-sans min-h-screen bg-white w-full">
            <div className="w-full min-h-screen">
                <div className="min-h-screen overflow-y-auto pb-20 animate-fade-in"> 
                    {ScreenContent}
                </div>
                <BottomNavBar 
                    currentTab={viewMode === 'achievements' ? 'Logros' : currentTab} 
                    onSelectTab={setCurrentTab} 
                    setViewMode={setViewMode}
                />
            </div>
            {/* Achievement Unlock Popup */}
            {unlockedPopupAchievement && (
                <AchievementUnlockPopup
                    achievements={[unlockedPopupAchievement]}
                    onDismiss={() => setUnlockedPopupAchievement(null)}
                />
            )}
            {/* Robot Skin Editor Modal */}
            <RobotSkinEditor
                isOpen={showRobotEditor}
                onClose={() => setShowRobotEditor(false)}
                currentConfig={userProfile?.robotConfig}
                currentName={userProfile?.robotName}
                onSave={handleRobotSave}
                userName={userProfile?.userName || firebaseProfile?.username || 'Explorador'}
            />
        </div>
    );
}