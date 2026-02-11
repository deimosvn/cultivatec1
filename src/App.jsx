import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Home, BookOpen, Settings, Sun, Moon, ArrowLeft, Lightbulb, Play, Target, Code, Terminal, BatteryCharging, Power, RadioTower, Component, Link, Minus, Plus, Bot, Send, Trophy } from 'lucide-react';
import QuizScreen from './components/QuizScreen';
import GlossaryScreen from './components/GlossaryScreen';
import ClassroomScreen from './components/ClassroomScreen';
import { AchievementsScreen, AchievementToast, AchievementUnlockPopup, ACHIEVEMENTS } from './components/AchievementsScreen';
import RobotSimulator from './components/RobotSimulator';
import CircuitBuilder from './CircuitBuilder';
import { MODULOS_DATA, CODE_CHALLENGES_DATA } from './data/modulesData';
import { OnboardingScreen, RobotAvatar, RobotMini, StoryProgress } from './Onboarding';

// --- CONFIGURACIÓN Y MOCK DATA DE FIREBASE ---
const appId = 'default-app-id'; 
const initialAuthToken = null; 

// Mock de funciones de Firebase para mantener la estructura pero simplificar el código
const mockAuth = { currentUser: { uid: 'MOCK_USER' } };
const mockSignIn = async () => mockAuth.currentUser.uid;
const mockOnSnapshot = (ref, callback) => {
    // Cargar scores del usuario desde localStorage
    try {
        const saved = localStorage.getItem('cultivatec_userScores');
        const savedScores = saved ? JSON.parse(saved) : {};
        callback({ exists: () => true, data: () => savedScores });
    } catch {
        callback({ exists: () => true, data: () => ({}) });
    }
    return () => {}; // Función de desuscripción
};

// Helper: guardar scores en localStorage
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

// --- DATOS DEL MÓDULO 1: DISEÑO PARA NIÑOS (Metáforas y Colores) ---
const MODULO_1_LESSONS = [
    { 
        id: 'l_1_q_es', 
        titulo: "¿Qué es la Electricidad?", 
        subtitulo: "La energía invisible que nos rodea",
        icon: '✨',
        color: 'bg-blue-600', // Color más intenso
        detail: {
            title: "Pequeños Magos Llamados Electrones",
            body: "La electricidad es como una fuerza mágica, pero en realidad es un montón de piezas diminutas, llamadas **electrones**, moviéndose muy rápido. Cuando se mueven, crean **energía** que podemos usar para encender luces o hacer funcionar robots. ¡Es el motor secreto del mundo!",
            keywords: ["Electrón", "Energía", "Movimiento"],
            formula: ""
        }
    },
    { 
        id: 'l_2_de_donde', 
        titulo: "¿De dónde Viene?", 
        subtitulo: "Fuentes: Sol, Viento y Agua",
        icon: '💡',
        color: 'bg-green-600', // Color más intenso
        detail: {
            title: "Fábricas de Energía Amigables",
            body: "La electricidad viene de 'fábricas' o fuentes. Puede ser producida por el **Sol** (paneles solares), el **Viento** (molinos gigantes) o el **Agua** (presas). También la guardamos en pequeñas 'cajas de almuerzo' portátiles llamadas **baterías**, listas para usar en tus juguetes o tu celular.",
            keywords: ["Batería", "Sol", "Viento", "Generador"],
            formula: ""
        }
    },
    { 
        id: 'l_3_como_mueve', 
        titulo: "¿Cómo se Mueve?", 
        subtitulo: "Conductores vs. Aislantes",
        icon: '🚡',
        color: 'bg-yellow-600', // Color más intenso
        detail: {
            title: "Cables: La Super Autopista de Cobre",
            body: "La electricidad viaja por materiales que le permiten pasar, como los **metales** (cables de cobre). A estos los llamamos **conductores**. Los materiales que la detienen, como el plástico o la goma que cubre los cables, se llaman **aislantes**. ¡Así la mantenemos segura en su camino!",
            keywords: ["Conductor", "Aislante", "Cobre", "Cable"],
            formula: ""
        }
    },
    { 
        id: 'l_4_componentes', 
        titulo: "El Circuito Básico", 
        subtitulo: "Las 4 Piezas Clave del Rompecabezas",
        icon: '🧩',
        color: 'bg-indigo-600', // Color más intenso
        detail: {
            title: "El Camino Cerrado de la Electricidad",
            body: "Un circuito es un camino cerrado por donde viaja la energía. Necesitas 4 cosas: 1. La **Fuente** (la pila o batería). 2. Los **Cables** (el camino). 3. El **Consumidor** (la bombilla o motor que usa la energía). 4. El **Interruptor** (el 'puente' que abres o cierras para detenerla o dejarla pasar).",
            keywords: ["Fuente", "Cable", "Interruptor", "Consumidor"],
            formula: ""
        }
    },
    { 
        id: 'l_5_v_i_r', 
        titulo: "El Tráfico de la Electricidad", 
        subtitulo: "Voltaje (V), Corriente (I) y Resistencia (R)",
        icon: '🚗',
        color: 'bg-red-600', // Color más intenso
        detail: {
            title: "La Versión para Niños del $V=I \\cdot R$ (Ley de Ohm)",
            body: "Imagina un tobogán de agua:\n\n1. **Voltaje (V):** Es la **altura del tobogán**. Cuanto más alto, más fuerza tiene el agua para bajar. El Voltaje es la 'fuerza' que empuja a los electrones.\n\n2. **Corriente (I):** Es la **cantidad de agua** que fluye por el tobogán. La Corriente es la cantidad de electrones que pasan por el cable.\n\n3. **Resistencia (R):** Son los **frenos o rocas en el camino** del tobogán. La Resistencia es lo que 'frena' el paso de los electrones. \n\nLa **Ley de Ohm** simplemente nos dice cómo se relacionan: ¡si empujas más (más **V**) o si hay menos frenos (menos **R**), más electrones pasan (**I**)!",
            keywords: ["Voltio (V)", "Amperio (A)", "Ohmio (Ω)", "Ley de Ohm"],
            formula: "$$V=I \\cdot R$$" // Formula actualizada con notación LaTeX
        }
    },
    { 
        id: 'l_6_safety', 
        titulo: "¡Seguridad Eléctrica!", 
        subtitulo: "Las Reglas de Oro para Jugar Seguro",
        icon: '🚨',
        color: 'bg-purple-600', // Color más intenso
        detail: {
            title: "Reglas para Ser un Súper Técnico",
            body: "La electricidad es muy útil, pero debemos respetarla. **Regla 1:** ¡Nunca uses **agua** cerca de enchufes o aparatos eléctricos! **Regla 2:** Nunca metas dedos u objetos en un **enchufe**. **Regla 3:** Si un cable está roto o pelado, avisa a un **adulto**. ¡Seguridad primero!",
            keywords: ["Agua", "Enchufe", "Cables rotos", "Adulto"],
            formula: ""
        }
    },
];

// --- ESTRUCTURA DE CONTENIDO (IMPORTADA) ---
const MODULOS_DE_ROBOTICA = MODULOS_DATA.map(m => 
    m.contenidoTeorico === '__MODULO_1_REF__' 
        ? { ...m, contenidoTeorico: MODULO_1_LESSONS } 
        : m
);

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
const InteractiveLEDGuide = ({ onBack }) => {
    const [step, setStep] = useState(0);

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
                        Acabas de construir tu primer circuito básico. Entendiste cómo la **Pila** da energía, la **Resistencia** la protege, el **LED** la usa para brillar, y el **Botón** la controla.
                    </p>
                    <div className="mt-6 p-4 bg-[#DBEAFE] rounded-2xl font-black text-[#2563EB] border-2 border-[#2563EB]/30">
                        <p>¡El concepto clave es el **Circuito Cerrado**!</p>
                    </div>
                    <button onClick={onBack} className="mt-6 py-3.5 px-8 btn-3d btn-3d-green rounded-2xl text-base">
                        Volver a la Biblioteca
                    </button>
                </div>
            );
        }
    };

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
const GenericLessonScreen = ({ currentModule, goToMenu, onModuleComplete, userProfile }) => { 
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
    const [mascotMood, setMascotMood] = useState('happy'); // happy, thinking, celebrating, sad

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

    const mascotEmojis = { happy: '😊', thinking: '🤔', celebrating: '🥳', sad: '😅' };
    const mascotMessages = {
        happy: ['¡Sigue así!', '¡Vas genial!', '¡Tú puedes!', '¡Qué buen estudiante!'],
        thinking: ['Piensa bien...', 'Hmm interesante...', 'Revisa de nuevo...'],
        celebrating: ['¡EXCELENTE!', '¡INCREÍBLE!', '¡WOW!', '¡GENIO!'],
        sad: ['¡Casi! Intenta otra vez', '¡No te rindas!', '¡La próxima será!'],
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
                    </div>

                    <button onClick={goToMenu} className="mt-6 w-full max-w-xs py-4 bg-white text-[#2563EB] rounded-2xl font-black text-base border-b-4 border-[#E5E5E5] active:scale-95 transition hover:bg-gray-50">
                        ¡Continuar Aprendiendo! 🚀
                    </button>
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
                {/* Mascot bubble */}
                <div className="flex items-center gap-3 mb-3">
                    {userProfile ? (
                        <div className="w-10 h-10 flex-shrink-0">
                            <RobotMini config={userProfile.robotConfig} size={40} />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-[#F7F7F7] rounded-full flex items-center justify-center text-xl animate-pulse-soft border-2 border-[#E5E5E5]">
                            {mascotEmojis[mascotMood]}
                        </div>
                    )}
                    <div className="bg-[#F7F7F7] px-3 py-2 rounded-xl rounded-bl-none flex-grow">
                        <p className="text-xs font-bold text-[#777]">{randomMsg(mascotMood)}</p>
                    </div>
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
    { startIdx: 0, title: '🔬 Fundamentos', subtitle: 'Electricidad, electrónica y mecánica', color: '#2563EB', colorLight: '#DBEAFE' },
    { startIdx: 3, title: '💻 Programación', subtitle: 'Lógica, código y Arduino', color: '#1CB0F6', colorLight: '#D0ECFB' },
    { startIdx: 6, title: '🛠️ Prácticas', subtitle: 'Proyectos físicos paso a paso', color: '#FF9600', colorLight: '#FFECD0' },
    { startIdx: 9, title: '🧠 Avanzado', subtitle: 'Control, diseño y más', color: '#CE82FF', colorLight: '#F0DEFF' },
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
    // A section is locked if first module of section is locked
    const firstModuleGlobalIdx = section.startIdx;
    const isSectionLocked = firstModuleGlobalIdx > 0 && !isModuleUnlocked(userScores, firstModuleGlobalIdx, MODULOS_DE_ROBOTICA);

    return (
        <div className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${isSectionLocked ? 'opacity-60' : ''}`}
            style={{ borderColor: isSectionLocked ? '#E5E5E5' : section.color + '40' }}>
            <div className="px-5 py-4 flex items-center gap-3"
                style={{ background: isSectionLocked ? '#F7F7F7' : `linear-gradient(135deg, ${section.color}15, ${section.colorLight})` }}>
                <div className="flex-grow">
                    <h3 className="text-base font-black flex items-center gap-2" style={{ color: isSectionLocked ? '#AFAFAF' : section.color }}>
                        {isSectionLocked && <span>🔒</span>} {section.title}
                    </h3>
                    <p className="text-[11px] font-bold text-[#AFAFAF] mt-0.5">
                        {isSectionLocked ? 'Completa la sección anterior para desbloquear' : section.subtitle}
                    </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white`}
                        style={{ backgroundColor: isSectionLocked ? '#AFAFAF' : section.color, borderBottom: `3px solid ${isSectionLocked ? '#999' : section.color + 'CC'}` }}>
                        {completedInSection}/{totalInSection}
                    </div>
                </div>
            </div>
            {/* Mini Progress */}
            <div className="h-1" style={{ backgroundColor: section.colorLight }}>
                <div className="h-full transition-all duration-700" 
                    style={{ width: `${totalInSection > 0 ? (completedInSection / totalInSection) * 100 : 0}%`, backgroundColor: section.color }}>
                </div>
            </div>
        </div>
    );
};

const LibraryScreen = ({ startLesson, userId, userScores, onShowAchievements, userStats, userProfile }) => {
    const totalModules = MODULOS_DE_ROBOTICA.length;
    const completedModulesCount = Object.values(userScores).filter(s => s && s.total > 0 && Math.round((s.score / s.total) * 100) >= 100).length;
    const overallProgress = Math.round((completedModulesCount / totalModules) * 100);

    return (
    <div className="pb-24 min-h-full bg-[#F7F7F7] w-full">
        {/* Duolingo-style Top Stats Bar */}
        <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-100 px-4 py-2.5">
            <div className="flex items-center justify-between max-w-xl mx-auto">
                <div className="flex items-center gap-3">
                    {userProfile && <RobotMini config={userProfile.robotConfig} size={34} />}
                    <div className="flex items-center gap-1 bg-[#FF9600]/10 px-2.5 py-1 rounded-xl">
                        <span className="text-lg">🔥</span>
                        <span className="text-sm font-black text-[#FF9600]">{userStats?.modulesVisited || 3}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFC800]/10 px-2.5 py-1 rounded-xl">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm font-black text-[#FFC800]">{userStats?.totalPoints || 120}</span>
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
                        onClick={onShowAchievements}
                        className="flex items-center bg-[#FFC800]/10 p-2 rounded-xl hover:bg-[#FFC800]/20 transition active:scale-95"
                    >
                        <span className="text-lg">🏆</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white px-5 pt-5 pb-6 border-b-2 border-gray-100">
            <div className="max-w-xl mx-auto">
                {userProfile && (
                    <p className="text-sm font-black text-[#2563EB] mb-2">¡Hola, {userProfile.userName}! 👋</p>
                )}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-2xl font-black text-[#3C3C3C]">Ruta de Aprendizaje</h2>
                        <p className="text-xs text-[#AFAFAF] font-bold mt-0.5">{totalModules} módulos · {completedModulesCount} completados</p>
                    </div>
                    <div className="relative w-14 h-14">
                        {/* Circular progress indicator */}
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E5E5" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#2563EB" strokeWidth="3" 
                                strokeDasharray={`${overallProgress * 0.942} 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-black text-[#2563EB]">{overallProgress}%</span>
                        </div>
                    </div>
                </div>
                {/* Full width progress bar */}
                <div className="w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-full transition-all duration-1000 relative" 
                        style={{ width: `${Math.max(overallProgress, 3)}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-bold text-[#AFAFAF]">Principiante</span>
                    <span className="text-[10px] font-bold text-[#AFAFAF]">Avanzado</span>
                    <span className="text-[10px] font-bold text-[#AFAFAF]">Experto 🏆</span>
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
const ChallengeCard = ({ challenge, onStart }) => (
    <div 
        onClick={() => onStart(challenge.id)} 
        className="bg-white rounded-2xl border-2 border-[#E5E5E5] hover:border-[#FF4B4B] transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.97] animate-scale-in"
    >
        <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-[#FF4B4B] rounded-2xl flex items-center justify-center text-2xl shadow-md border-b-4 border-[#EA2B2B]">
                    {challenge.icon}
                </div>
                <div className="flex-grow">
                    <h2 className="text-sm font-black text-[#3C3C3C] leading-tight">{challenge.title}</h2>
                    <span className="text-[11px] font-bold text-[#FF4B4B] mt-0.5 inline-block">{challenge.name}</span>
                </div>
            </div>
            <button className="w-full py-2.5 btn-3d btn-3d-green rounded-xl text-sm text-center">
                ¡EMPEZAR!
            </button>
        </div>
    </div>
);
const ChallengeListScreen = ({ startChallenge }) => (
     <div className="pb-24 min-h-full bg-white w-full animate-fade-in"> 
        {/* Header */}
        <div className="bg-[#FF4B4B] px-6 pt-8 pb-8 text-center">
            <span className="text-5xl mb-2 block animate-float">🧩</span>
            <h1 className="text-3xl font-black text-white">Zona de Retos</h1>
            <p className="text-white/80 text-sm font-bold mt-1">Pon a prueba tu lógica con bloques de código</p>
        </div>
        
        <div className="px-4 -mt-4 w-full max-w-4xl mx-auto relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {CODE_CHALLENGES.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} onStart={startChallenge} />
                ))}
            </div>
        </div>
    </div>
);
const ChallengeBlock = ({ block, onClick, isSolutionBlock, challengeStatus }) => {
    let colorClass = 'bg-white text-[#3C3C3C] border-[#E5E5E5] hover:border-[#1CB0F6]';
    let cursor = 'cursor-pointer';
    let isDisabled = challengeStatus !== 'active';

    if (isSolutionBlock) {
        if (challengeStatus === 'correct') {
            colorClass = 'bg-[#DBEAFE] text-[#2563EB] border-[#2563EB]/30';
            cursor = 'cursor-not-allowed';
        } else if (challengeStatus === 'incorrect') {
            colorClass = 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/30';
        } else {
            colorClass = 'bg-[#1CB0F6]/10 text-[#1CB0F6] border-[#1CB0F6]/30';
        }
    } else if (block.type === 'wrong') {
         colorClass = 'bg-[#F7F7F7] text-[#AFAFAF] border-[#E5E5E5] opacity-50';
         cursor = 'cursor-not-allowed';
         isDisabled = true;
    }

    return (
        <div 
            key={block.id}
            onClick={!isDisabled ? () => onClick(block.id) : null}
            className={`text-xs font-mono font-bold px-3 py-2.5 rounded-xl border-2 transition duration-150 transform hover:scale-[1.01] 
                        ${colorClass} ${cursor} ${isDisabled ? 'opacity-60' : ''}`}
            style={{ paddingLeft: block.text.startsWith(' ') && isSolutionBlock ? '40px' : '' }} 
        >
            {block.text.trim()}
        </div>
    );
};
const ChallengeView = ({ currentChallengeId, startChallenge, goToMenu }) => {
    const currentChallenge = CODE_CHALLENGES.find(c => c.id === currentChallengeId);
    if (!currentChallenge) return <PlaceholderScreen title="Reto no encontrado" color="yellow" goToMenu={goToMenu} />;

    const [challengeBlocks, setChallengeBlocks] = useState(() => shuffleArray([...currentChallenge.solution, ...currentChallenge.extra_blocks])); 
    const [userSolution, setUserSolution] = useState([]); 
    const [challengeStatus, setChallengeStatus] = useState('active'); 

    useEffect(() => {
        setChallengeBlocks(shuffleArray([...currentChallenge.solution, ...currentChallenge.extra_blocks]));
        setUserSolution([]);
        setChallengeStatus('active');
    }, [currentChallengeId]); // Dependencia simplificada para resetear

    const handleBlockMove = (blockId, fromList, fromListSetter, toListSetter) => {
        if (challengeStatus !== 'active') return;
        
        const block = fromList.find(b => b.id === blockId);
        if (!block) return;
        if (!fromListSetter || !toListSetter) return; // Safety check
        
        // Bloques incorrectos solo pueden ir a la lista de bloques disponibles
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
        
        let isCorrect = false;

        // Regla 1: Debe tener la cantidad correcta de bloques
        if (userIds.length !== solutionIds.length) {
            setChallengeStatus('incorrect');
            return;
        }

        if (currentChallenge.id === 'cpp_hello_world') {
            // C++: Orden estricto (1, 2, 3, 4, 5)
            isCorrect = userIds.every((id, index) => id === solutionIds[index]);
        } else if (currentChallenge.id === 'python_hello_world') {
            // Python: Solo el bloque correcto (ID 1)
            const correctBlock = solutionIds[0];
            isCorrect = userIds.length === 1 && userIds[0] === correctBlock;
        }
        
        setChallengeStatus(isCorrect ? 'correct' : 'incorrect');
    };

    let statusMessage = '';
    let statusClass = '';

    if (challengeStatus === 'correct') {
        statusMessage = '¡Felicidades! Código Correcto. 🎉';
        statusClass = 'bg-green-600 border-b-4 border-green-800';
    } else if (challengeStatus === 'incorrect') {
        statusMessage = '¡Error! Revisa el orden o los bloques seleccionados. ❌';
        statusClass = 'bg-red-600 border-b-4 border-red-800';
    }

    // Adaptación del layout para web: usar grid para los bloques disponibles
    return (
        <div className="min-h-full bg-white flex flex-col animate-fade-in">
            {/* Header */}
            <div className="px-4 pt-4 flex justify-between items-center mb-3">
                <button 
                    onClick={() => goToMenu('Retos')}
                    className="text-[#AFAFAF] hover:text-[#3C3C3C] transition flex items-center bg-white p-2.5 rounded-xl border-2 border-[#E5E5E5] active:scale-95"
                >
                    <ArrowLeft size={18} className="mr-1" />
                    <span className="text-sm font-black">Retos</span>
                </button>
                <span className="text-xs font-black text-[#FF4B4B] bg-[#FF4B4B]/10 px-3 py-1.5 rounded-full">{currentChallenge.icon} {currentChallenge.name}</span>
            </div>
            
            <div className="px-4 mb-3">
                <h1 className="text-xl font-black text-[#3C3C3C] mb-1">{currentChallenge.title}</h1>
                <p className="text-xs text-[#AFAFAF] font-bold">{currentChallenge.instructions}</p>
            </div>
            
            {challengeStatus !== 'active' && (
                <div className={`mx-4 text-white p-3 rounded-xl font-black text-sm text-center mb-3 animate-bounce-in border-b-4 ${challengeStatus === 'correct' ? 'bg-[#2563EB] border-[#1D4ED8]' : 'bg-[#FF4B4B] border-[#EA2B2B]'}`}>
                    {statusMessage}
                </div>
            )}
            
            {/* Solution area */}
            <div className="mx-4 bg-white p-4 rounded-2xl border-2 border-[#E5E5E5] mb-3 flex flex-col h-44 md:h-56 overflow-hidden">
                <h2 className="text-xs font-black text-[#1CB0F6] mb-2 flex items-center"><Target size={14} className="mr-1"/> Tu Solución ({userSolution.length})</h2>
                <div className="space-y-2 overflow-y-auto flex-grow">
                    {userSolution.map(block => (
                        <ChallengeBlock key={block.id} block={block} onClick={handleUnselectBlock} isSolutionBlock={true} challengeStatus={challengeStatus} />
                    ))}
                </div>
                {userSolution.length === 0 && <p className="text-center text-[#E5E5E5] text-sm font-bold italic pt-6">Selecciona bloques de código...</p>}
            </div>

            {/* Available blocks */}
            <div className="mx-4 bg-[#F7F7F7] p-4 rounded-2xl border-2 border-[#E5E5E5] mb-3 overflow-y-auto flex-grow min-h-[120px]">
                <h2 className="text-xs font-black text-[#AFAFAF] mb-2 flex items-center"><Terminal size={14} className="mr-1"/> Bloques Disponibles ({challengeBlocks.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {challengeBlocks.map(block => (
                        <ChallengeBlock key={block.id} block={block} onClick={handleSelectBlock} isSolutionBlock={false} challengeStatus={challengeStatus} />
                    ))}
                </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 space-y-2 max-w-md mx-auto w-full">
                {challengeStatus === 'active' && (
                    <button
                        onClick={checkChallengeSolution}
                        disabled={userSolution.length === 0}
                        className={`w-full py-3.5 rounded-xl text-sm transition
                                    ${userSolution.length > 0 ? 'btn-3d btn-3d-green' : 'bg-[#E5E5E5] text-[#AFAFAF] border-b-4 border-[#AFAFAF] cursor-not-allowed font-extrabold'}`}
                    >
                        Verificar Código
                    </button>
                )}
                {challengeStatus !== 'active' && (
                    <button
                        onClick={() => startChallenge(currentChallengeId)}
                        className="w-full py-3.5 btn-3d btn-3d-yellow rounded-xl text-sm"
                    >
                        Reintentar Reto
                    </button>
                )}
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
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-gray-100">
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
    // Estados de "Firebase" (usando mocks)
    const [userId, setUserId] = useState(null);
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

    // Persist userStats to localStorage
    useEffect(() => {
        try { localStorage.setItem('cultivatec_userStats', JSON.stringify(userStats)); } catch {}
    }, [userStats]);

    useEffect(() => {
        // Simulación de autenticación y carga de datos
        const authenticateUser = async () => {
            try {
                const uid = await mockSignIn();
                setUserId(uid); 
            } catch (error) {
                console.error("Error simulando la autenticación:", error);
                setUserId('AUTH_ERROR');
            }
        };
        authenticateUser();

        const unsubscribe = mockOnSnapshot(null, (docSnap) => {
            if (docSnap.exists()) {
                const scores = docSnap.data();
                setUserScores(scores);
                // Sync completedModules Set from saved scores
                const completedIds = Object.entries(scores)
                    .filter(([, s]) => s && s.total > 0 && Math.round((s.score / s.total) * 100) >= 100)
                    .map(([id]) => id);
                if (completedIds.length > 0) {
                    setCompletedModules(new Set(completedIds));
                }
            }
        });
        return () => unsubscribe(); 
    }, []);

    // Handle module completion
    const handleModuleComplete = useCallback((moduleId, xpEarned = 0) => {
        if (completedModules.has(moduleId)) return;
        
        // Mark module as completed in userScores
        setUserScores(prev => {
            const moduleData = MODULOS_DE_ROBOTICA.find(m => m.id === moduleId);
            const totalSteps = Array.isArray(moduleData?.contenidoTeorico) 
                ? moduleData.contenidoTeorico.length 
                : (moduleData?.contenidoTeorico === '__MODULO_1_REF__' ? 6 : 2);
            const newScores = { ...prev, [moduleId]: { score: totalSteps, total: totalSteps } };
            persistUserScores(newScores);
            return newScores;
        });

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
    };

    // Show onboarding if no profile — AFTER all hooks
    if (!userProfile) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
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
            return; // Module is locked, don't open
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
            setUserScores(prev => {
                const newScores = { ...prev, [moduleId]: { score: correct, total: total } };
                persistUserScores(newScores);
                return newScores;
            });
            // Also mark as completed if >= 100%
            if (percentage >= 100) {
                handleModuleComplete(moduleId, correct * 10);
            }
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
        ScreenContent = <InteractiveLEDGuide onBack={() => goToMenu('Biblioteca')} />;
    } else if (viewMode === 'lesson_generic') {
        ScreenContent = <GenericLessonScreen 
                            currentModule={currentModule} 
                            goToMenu={() => goToMenu('Biblioteca')}
                            onModuleComplete={handleModuleComplete}
                            userProfile={userProfile}
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
                        />;
    } else if (viewMode === 'achievements') {
        ScreenContent = <AchievementsScreen 
                            onBack={() => goToMenu('Biblioteca')}
                            userStats={userStats}
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
                    userStats={userStats}
                    userProfile={userProfile}
                />;
                break;
            case 'Taller':
                ScreenContent = <WorkshopScreen goToMenu={goToMenu} />; // <-- El taller de código
                break;
            case 'Retos':
                ScreenContent = <ChallengeListScreen startChallenge={startChallenge} />;
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
                ScreenContent = <LibraryScreen startLesson={startLesson} userId={userId} userScores={userScores} userProfile={userProfile} />; 
        }
    }


    if (!userId) {
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
        </div>
    );
}