import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Home, BookOpen, Settings, Sun, Moon, ArrowLeft, Lightbulb, Play, Target, Code, Terminal, BatteryCharging, Power, RadioTower, Component, Link, Minus, Plus, Bot, Send, Trophy, ChevronDown, Map, Calendar, Puzzle, Cpu, Dumbbell, Monitor, GraduationCap, Wrench, Rocket, Star } from 'lucide-react';
import QuizScreen from './components/QuizScreen';
import GlossaryScreen, { GLOSSARY_TERMS as GLOSSARY_TERMS_DATA } from './components/GlossaryScreen';
import ClassroomScreen from './components/ClassroomScreen';
import { AchievementsScreen, AchievementToast, AchievementUnlockPopup, ACHIEVEMENTS } from './components/AchievementsScreen';
import RobotSimulator from './components/RobotSimulator';
import LicensesScreen from './components/LicensesScreen';
import CircuitBuilder from './CircuitBuilder';
import { MODULOS_DATA, CODE_CHALLENGES_DATA } from './data/modulesData';
import { WORLD_2_MODULES, WORLD_2_SECTIONS } from './data/world2Data';
import { WORLD_3_MODULES, WORLD_3_SECTIONS } from './data/world3Data';
import { WORLD_4_MODULES, WORLD_4_SECTIONS } from './data/world4Data';
import { OnboardingScreen, RobotAvatar, RobotMini } from './Onboarding';
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

// --- CONFIGURACIÓN DE MUNDOS ---
const WORLDS_CONFIG = [
    {
        id: 'world_1',
        name: 'El Taller del Inventor',
        emoji: '🔧',
        description: '¡Descubre los fundamentos de la robótica desde cero!',
        bgGradient: 'from-[#1D4ED8] via-[#2563EB] to-[#3B82F6]',
        bgCard: 'from-[#DBEAFE] to-[#EFF6FF]',
        bgClass: 'bg-world-taller',
        worldImage: '/mundo1.png',
        accentColor: '#2563EB',
        accentDark: '#1D4ED8',
        modules: MODULOS_DATA,
        sections: [
            { startIdx: 0, title: '🤖 Introducción', subtitle: '¡Descubre el increíble mundo de los robots!', color: '#58CC02', colorLight: '#D7FFB8', emoji: '🚀' },
            { startIdx: 3, title: '🔬 Fundamentos', subtitle: 'Electricidad, electrónica y mecánica', color: '#2563EB', colorLight: '#DBEAFE', emoji: '⚡' },
            { startIdx: 6, title: '💻 Programación', subtitle: 'Lógica, código y Arduino', color: '#1CB0F6', colorLight: '#D0ECFB', emoji: '🎮' },
            { startIdx: 9, title: '🛠️ Prácticas', subtitle: 'Proyectos físicos paso a paso', color: '#FF9600', colorLight: '#FFECD0', emoji: '🔧' },
            { startIdx: 12, title: '🧠 Avanzado', subtitle: 'Control, diseño y más', color: '#CE82FF', colorLight: '#F0DEFF', emoji: '🏆' },
        ],
        bgPattern: '🔧⚡🤖💡🔩',
        challengeIds: ['py_hola_mundo', 'py_variable_basica', 'py_suma_numeros', 'py_texto_formateado', 'ard_setup_loop', 'ard_blink_basico'],
        circuitIds: [1, 2],
        glossaryTermIds: ['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10','g11','g12','g13','g14','g18'],
    },
    {
        id: 'world_2',
        name: 'La Fábrica de Autómatas',
        emoji: '🏭',
        description: 'Construye robots reales con sensores, motores y IA básica.',
        bgGradient: 'from-[#B45309] via-[#D97706] to-[#F59E0B]',
        bgCard: 'from-[#FEF3C7] to-[#FFFBEB]',
        accentColor: '#D97706',
        accentDark: '#B45309',
        modules: WORLD_2_MODULES,
        sections: WORLD_2_SECTIONS,
        bgClass: 'bg-world-fabrica',
        worldImage: '/mundo2.png',
        bgPattern: '🦇🛤️🌡️🏗️⚡🦾🏃📡📺📱🎵🎛️🔋🔧🏆',
        challengeIds: ['py_blink_arduino', 'py_if_else', 'py_for_contar', 'py_lista_robots', 'ard_serial_monitor', 'py_input_usuario'],
        circuitIds: [3, 4],
        glossaryTermIds: ['g15','g16','g17','g19','g20','g21','g23','g24','g25','g26','g33','g34'],
    },
    {
        id: 'world_3',
        name: 'La Selva Cibernética',
        emoji: '🌿',
        description: 'Biorobótica: donde la naturaleza inspira la tecnología.',
        bgGradient: 'from-[#065F46] via-[#059669] to-[#10B981]',
        bgCard: 'from-[#D1FAE5] to-[#ECFDF5]',
        bgClass: 'bg-world-selva',
        worldImage: '/mundo3.png',
        accentColor: '#059669',
        accentDark: '#065F46',
        modules: WORLD_3_MODULES,
        sections: WORLD_3_SECTIONS,
        bgPattern: '🦎🐾💪👁️🦾🦿⌚🧠🐙🧬🌿🐜🔬🤔🎨🏆',
        challengeIds: ['py_funcion_saludar', 'ard_leer_sensor', 'py_if_elif_else', 'ard_servo_motor', 'py_funcion_retorno', 'py_while_loop'],
        circuitIds: [5, 6],
        glossaryTermIds: ['g22','g27','g28','g29','g35','g36','g37','g38','g39','g40','g41','g42'],
    },
    {
        id: 'world_4',
        name: 'La Estación Orbital',
        emoji: '🛸',
        description: 'Robótica espacial: rovers, satélites, IA y misiones interplanetarias.',
        bgGradient: 'from-[#312E81] via-[#4338CA] to-[#6366F1]',
        bgCard: 'from-[#E0E7FF] to-[#EEF2FF]',
        bgClass: 'bg-world-orbital',
        worldImage: '/mundo4.png',
        accentColor: '#6366F1',
        accentDark: '#4338CA',
        modules: WORLD_4_MODULES,
        sections: WORLD_4_SECTIONS,
        bgPattern: '🛸🌙📡☀️🛰️🏠🗑️🖨️🧠🤖🔭🏗️🌙🔴🏆🚀',
        unlockType: 'friends',
        unlockRequirement: 5,
        challengeIds: ['ard_robot_obstaculo', 'py_diccionario', 'ard_motor_control', 'cpp_hola_mundo', 'cpp_if_else', 'py_try_except'],
        circuitIds: [7, 8],
        glossaryTermIds: ['g30','g31','g32','g43','g44','g45','g46','g47','g48','g49','g50','g51','g52'],
    },
];

// Helper: check if a world is unlocked
const isWorldUnlocked = (userScores, worldIndex, firebaseProfile) => {
    if (worldIndex === 0) return true;
    const world = WORLDS_CONFIG[worldIndex];
    // Special unlock: friend-based
    if (world && world.unlockType === 'friends') {
        const friendsCount = firebaseProfile?.friendsCount || 0;
        return friendsCount >= (world.unlockRequirement || 5);
    }
    // Default: must complete ALL modules of previous world
    const prevWorld = WORLDS_CONFIG[worldIndex - 1];
    if (!prevWorld) return false;
    return prevWorld.modules.every(m => isModuleCompleted(userScores, m.id));
};

// Get all modules across all worlds (for lookup)
const ALL_MODULES = WORLDS_CONFIG.flatMap(w => w.modules);

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

// --- DAILY STORY PROBLEMS (shared date logic) ---
const getDailyIndex = (pool) => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return seed % pool.length;
};

const DAILY_CIRCUIT_STORIES = [
    { id: 'dc_1', title: '🚀 Luces de Emergencia', story: 'La nave CultivaTec-7 atraviesa un campo de asteroides. ¡El sistema de luces de emergencia falló! El capitán necesita que conectes 3 LEDs rojos en paralelo con una resistencia de protección cada uno a una batería de 9V para alertar a la tripulación.', question: '¿Qué pasa si conectas los 3 LEDs en serie en vez de paralelo?', options: ['Brillan igual', 'Brillan menos porque el voltaje se divide entre los 3', 'Brillan más', 'No cambia nada'], correct: 1, explanation: 'En serie el voltaje se divide entre los LEDs, así que cada uno recibe menos voltaje y brilla menos. En paralelo, cada LED recibe el voltaje completo.' },
    { id: 'dc_2', title: '🛸 Sensor de Proximidad', story: 'Un satélite de rescate necesita detectar basura espacial. Su sensor ultrasónico envía una señal y mide el tiempo que tarda en regresar. El circuito necesita: sensor ultrasónico, Arduino, un buzzer que suene cuando detecte algo a menos de 30cm.', question: '¿Por qué necesitamos una resistencia entre el Arduino y el buzzer?', options: ['Para que suene más fuerte', 'Para proteger el pin del Arduino limitando la corriente', 'No se necesita resistencia', 'Para que no suene'], correct: 1, explanation: 'Los pines del Arduino solo soportan ~20mA. Sin resistencia la corriente podría ser mayor y dañar el pin. La resistencia limita la corriente a un nivel seguro.' },
    { id: 'dc_3', title: '🌟 Panel Solar de la Estación', story: 'La estación espacial necesita energía. Tienes 4 paneles solares que generan 3V cada uno. Necesitas alimentar un sistema que requiere 12V. ¿Cómo los conectas?', question: '¿Cómo debes conectar los 4 paneles de 3V para obtener 12V?', options: ['Todos en paralelo', 'Todos en serie', '2 en serie y 2 en paralelo', 'No es posible con solo 4 paneles'], correct: 1, explanation: 'En serie los voltajes se suman: 3V + 3V + 3V + 3V = 12V. En paralelo se mantienen los 3V pero aumenta la corriente disponible.' },
    { id: 'dc_4', title: '🔧 Motor del Brazo Robótico', story: 'El brazo robótico de la nave necesita reparación. El motor DC funciona con 6V pero la batería de la nave es de 12V. Necesitas reducir el voltaje sin desperdiciar energía.', question: '¿Cuál es la mejor forma de reducir 12V a 6V para el motor?', options: ['Conectar una resistencia grande en serie', 'Usar un regulador de voltaje o divisor de voltaje', 'Desconectar cables', 'Usar un LED para absorber voltaje'], correct: 1, explanation: 'Un regulador de voltaje convierte eficientemente 12V a 6V. Un divisor de voltaje con resistencias también funciona pero desperdicia energía en forma de calor.' },
    { id: 'dc_5', title: '💡 Sistema de Iluminación por Zonas', story: 'La nave tiene 3 zonas: cabina (LED blanco), motor (LED rojo), carga (LED azul). Cada zona necesita encenderse independientemente con su propio interruptor.', question: '¿Cómo se deben conectar los 3 LEDs con sus interruptores?', options: ['Todos en serie con un solo interruptor', 'Cada LED en paralelo con su propio interruptor en serie', 'Todos en paralelo con un solo interruptor', 'En serie con 3 interruptores en paralelo'], correct: 1, explanation: 'Cada LED se conecta en paralelo a la fuente, con su interruptor en serie. Así cada interruptor controla solo su zona sin afectar las demás.' },
    { id: 'dc_6', title: '⚡ Carga de Baterías de Respaldo', story: 'La nave necesita cargar 2 baterías de respaldo de 5V/2A cada una. El generador produce 5V/3A máximo. No puedes cargar las dos al mismo tiempo.', question: '¿Por qué no puedes cargar ambas baterías simultáneamente en paralelo?', options: ['Porque explotarían', 'Porque necesitarían 4A y el generador solo da 3A', 'Porque en paralelo no cargan', 'Sí se puede sin problema'], correct: 1, explanation: 'Cada batería necesita 2A. En paralelo pedirían 4A total, pero el generador solo da 3A. Se sobrecargaría. Debes cargarlas una a la vez o conseguir un generador más potente.' },
    { id: 'dc_7', title: '🛰️ Comunicaciones de Radio', story: 'El transmisor de radio de la nave necesita una antena conectada a un circuito amplificador. El amplificador necesita exactamente 5V, pero la fuente da 9V.', question: '¿Qué componente usarías para bajar de 9V a 5V de forma estable?', options: ['Un fusible', 'Un regulador de voltaje 7805', 'Un condensador', 'Un diodo simple'], correct: 1, explanation: 'El regulador 7805 convierte cualquier voltaje entre 7-35V a una salida estable de 5V. Es el componente estándar para esta tarea. Un condensador no regula voltaje y un diodo solo baja ~0.7V.' },
];

const DAILY_PROGRAMMING_STORIES = [
    { id: 'dp_1', title: '🚀 Calculador de Combustible', story: 'La nave CultivaTec-7 necesita calcular si tiene suficiente combustible para llegar al siguiente planeta. El tanque tiene 500 litros y consume 12 litros por hora. El viaje dura 38 horas.', task: 'Calcula si el combustible alcanza y cuántos litros sobran o faltan.', starterCode: 'tanque = 500\nconsumo_hora = 12\nhoras_viaje = 38\n\ntotal_necesario = consumo_hora * horas_viaje\nprint("Combustible necesario:", total_necesario, "litros")\n\nif tanque >= total_necesario:\n    sobra = tanque - total_necesario\n    print("✅ ¡Sí alcanza! Sobran", sobra, "litros")\nelse:\n    falta = total_necesario - tanque\n    print("❌ No alcanza. Faltan", falta, "litros")' },
    { id: 'dp_2', title: '🛸 Código de Acceso', story: 'La puerta del laboratorio espacial necesita un código de 4 dígitos. El sistema valida si el código ingresado es correcto comparándolo con el código secreto 7294.', task: 'Simula la verificación del código de acceso con intentos.', starterCode: 'codigo_secreto = 7294\nintentos = [1234, 5678, 7294]\n\nfor i in range(len(intentos)):\n    codigo = intentos[i]\n    print("Intento", i + 1, "- Código:", codigo)\n    if codigo == codigo_secreto:\n        print("  🔓 ¡Acceso concedido!")\n    else:\n        print("  🔒 Acceso denegado")' },
    { id: 'dp_3', title: '🌟 Temperatura del Reactor', story: 'El reactor de la nave genera datos de temperatura cada segundo. Si supera 90°C hay que activar el enfriamiento. Si baja de 30°C hay que calentar.', task: 'Monitorea las lecturas del sensor de temperatura y toma acción.', starterCode: 'import random\n\nprint("=== Monitor de Temperatura del Reactor ===")\n\nfor segundo in range(8):\n    temp = random.randint(20, 100)\n    print("Segundo", segundo + 1, "- Temp:", temp, "°C", end=" ")\n    if temp > 90:\n        print("🔥 ¡ALERTA! Activando enfriamiento")\n    elif temp < 30:\n        print("❄️ Muy frío. Calentando reactor")\n    else:\n        print("✅ Normal")' },
    { id: 'dp_4', title: '🔧 Inventario de Repuestos', story: 'El mecánico de la nave necesita saber cuántas piezas de repuesto quedan para planificar una parada de reabastecimiento.', task: 'Gestiona el inventario y alerta cuando quedan pocas piezas.', starterCode: 'inventario = {\n    "tornillos": 45,\n    "tuercas": 12,\n    "cables": 8,\n    "fusibles": 3,\n    "motores": 2\n}\n\nprint("🔧 Inventario de la Nave CultivaTec-7")\nprint("=" * 35)\n\nalerta = []\nfor pieza, cantidad in inventario.items():\n    estado = "⚠️ BAJO" if cantidad < 10 else "✅ OK"\n    print(f"  {pieza}: {cantidad} - {estado}")\n    if cantidad < 10:\n        alerta.append(pieza)\n\nif alerta:\n    print(f"\\n🚨 Reabastecer: {alerta}")\nelse:\n    print("\\n✅ Todo en orden")' },
    { id: 'dp_5', title: '💡 Secuencia de Aterrizaje', story: 'La nave debe seguir una secuencia precisa para aterrizar: encender retrocohetes, desplegar tren de aterrizaje, reducir velocidad, y tocar superficie.', task: 'Programa la secuencia de aterrizaje paso a paso.', starterCode: 'pasos = [\n    "Encender retrocohetes 🔥",\n    "Desplegar tren de aterrizaje 🦿",\n    "Reducir velocidad a 50 km/h 🐢",\n    "Activar sensores de superficie 📡",\n    "Toque de superficie 🌍",\n    "Apagar motores principales ⚡"\n]\n\nvelocidad = 300\n\nprint("🚀 Iniciando secuencia de aterrizaje...")\nprint("=" * 40)\n\nfor i in range(len(pasos)):\n    print(f"Paso {i + 1}: {pasos[i]}")\n    velocidad = velocidad - 50\n    if velocidad > 0:\n        print(f"  Velocidad actual: {velocidad} km/h")\n    else:\n        print("  ✅ ¡Nave detenida!")\n\nprint("\\n🎉 ¡Aterrizaje exitoso!")' },
    { id: 'dp_6', title: '⚡ Distribución de Energía', story: 'La nave tiene 1000W de energía total y debe repartirla entre: navegación (300W mín), soporte vital (400W mín), comunicaciones (150W mín), y lo que sobre va a escudos.', task: 'Calcula la distribución de energía y cuánto queda para escudos.', starterCode: 'energia_total = 1000\n\nnavegacion = 300\nsoporte_vital = 400\ncomunicaciones = 150\n\nusado = navegacion + soporte_vital + comunicaciones\nescudos = energia_total - usado\n\nprint("⚡ Distribución de Energía")\nprint("=" * 30)\nprint(f"  Navegación: {navegacion}W")\nprint(f"  Soporte vital: {soporte_vital}W")\nprint(f"  Comunicaciones: {comunicaciones}W")\nprint(f"  Escudos: {escudos}W")\nprint(f"\\nTotal usado: {usado}W de {energia_total}W")\n\nif escudos < 100:\n    print("⚠️ ¡Escudos bajos! Peligro.")\nelse:\n    print("✅ Energía bien distribuida")' },
    { id: 'dp_7', title: '🛰️ Mensaje SOS en Código', story: 'La antena de la nave está dañada y solo puede enviar pulsos cortos (.) y largos (-). Necesitas codificar "SOS" en código Morse: S = "...", O = "---"', task: 'Genera la señal SOS en código Morse y repítela 3 veces.', starterCode: 'morse = {\n    "S": "...",\n    "O": "---"\n}\n\nmensaje = "SOS"\n\nprint("📡 Transmitiendo señal de emergencia...")\nprint("=" * 35)\n\nfor repeticion in range(3):\n    senal = ""\n    for letra in mensaje:\n        senal = senal + morse[letra] + " "\n    print(f"  Transmisión {repeticion + 1}: {senal}")\n\nprint("\\n📡 Señal SOS enviada 3 veces")\nprint("🛸 Esperando respuesta...")' },
];

// Helper to get today's date key
const getTodayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

// --- CIRCUIT LAB SCREEN ---
const CIRCUIT_CONCEPTS = [
    { id: 'cc_1', title: '⚡ Voltaje (V)', emoji: '⚡', description: 'Es la "presión" que empuja a los electrones por el circuito. Se mide en Voltios. Una batería de 9V empuja más fuerte que una de 3V.', example: 'Imagina el agua en una manguera: el voltaje es como la presión del agua. Más presión = más fuerza.' },
    { id: 'cc_2', title: '🌊 Corriente (I)', emoji: '🌊', description: 'Es la cantidad de electrones que fluyen. Se mide en Amperios (A). Más corriente = más electrones pasando.', example: 'Si el voltaje es la presión del agua, la corriente es la cantidad de agua que fluye por la manguera.' },
    { id: 'cc_3', title: '🚧 Resistencia (R)', emoji: '🚧', description: 'Es lo que se opone al flujo de corriente. Se mide en Ohmios (Ω). Las resistencias protegen los componentes.', example: 'Como poner el dedo en la manguera: reduces el flujo de agua. Una resistencia reduce el flujo de corriente.' },
    { id: 'cc_4', title: '📐 Ley de Ohm', emoji: '📐', description: 'V = I × R. El voltaje es igual a la corriente multiplicada por la resistencia. ¡La fórmula más importante!', example: 'Si tienes 9V y una resistencia de 450Ω:\nI = V/R = 9/450 = 0.02A = 20mA\nSuficiente para encender un LED.' },
    { id: 'cc_5', title: '🔗 Serie vs Paralelo', emoji: '🔗', description: 'En SERIE los componentes van uno tras otro (el voltaje se divide). En PARALELO van lado a lado (la corriente se divide).', example: 'Navidad: las luces en serie → si una falla, todas se apagan. En paralelo → cada una es independiente.' },
    { id: 'cc_6', title: '💡 LEDs', emoji: '💡', description: 'Los LEDs (Diodos Emisores de Luz) solo dejan pasar corriente en una dirección. Necesitan una resistencia para no quemarse.', example: 'Un LED rojo necesita ~2V y 20mA. Con batería de 9V: R = (9-2)/0.02 = 350Ω → usa una de 330Ω o 470Ω.' },
];

const CIRCUIT_PROBLEMS = [
    { id: 'cp_1', title: '🔌 Encender un LED', difficulty: 1, emoji: '💡', description: 'Conecta una batería, una resistencia y un LED para que encienda.', question: '¿Qué necesitas como mínimo para encender un LED de forma segura?', options: ['Solo el LED y la batería', 'Batería + Resistencia + LED', 'Solo el LED', 'Batería + 2 LEDs'], correct: 1, explanation: 'Necesitas batería (energía), resistencia (protección) y LED. Sin la resistencia, la corriente sería muy alta y el LED se quemaría.' },
    { id: 'cp_2', title: '⚡ Calculando Resistencia', difficulty: 2, emoji: '🧮', description: 'Con batería de 9V y LED rojo (2V, 20mA), ¿qué resistencia necesitas?', question: 'R = (V_batería - V_LED) / I_LED = (9 - 2) / 0.020 = ?', options: ['150Ω', '350Ω', '470Ω', '1000Ω'], correct: 1, explanation: 'R = (9-2)/0.020 = 350Ω. En la práctica usarías 330Ω (valor comercial más cercano hacia abajo) o 470Ω (más seguro).' },
    { id: 'cp_3', title: '🔗 LEDs en Serie', difficulty: 2, emoji: '🔗', description: 'Tienes 3 LEDs rojos (2V cada uno) y una batería de 9V. ¿Funciona en serie?', question: '¿Cuánto voltaje queda para la resistencia si conectas 3 LEDs en serie?', options: ['9V', '3V (9V - 3×2V)', '0V', '6V'], correct: 1, explanation: 'En serie: V_resistencia = 9V - (3 × 2V) = 3V. Quedan 3V para la resistencia, suficiente para que funcione con R = 3/0.020 = 150Ω.' },
    { id: 'cp_4', title: '🔀 Serie o Paralelo', difficulty: 2, emoji: '🔀', description: 'Un sistema de alarma necesita que funcione aunque falle un componente. ¿Cómo conectas los LEDs?', question: '¿Qué conexión hace que cada LED funcione independientemente?', options: ['En serie', 'En paralelo', 'Da igual', 'Ninguna'], correct: 1, explanation: 'En paralelo cada LED tiene su propio camino de corriente. Si uno falla, los demás siguen funcionando. En serie, si uno falla se corta todo el circuito.' },
    { id: 'cp_5', title: '🛡️ Fusibles de Protección', difficulty: 3, emoji: '🛡️', description: 'El sistema eléctrico de la nave tiene un fusible de 2A. Tienes 3 motores que consumen 0.5A cada uno y un calentador de 0.8A.', question: '¿Puedes encender todo al mismo tiempo sin quemar el fusible?', options: ['Sí, alcanza perfectamente', 'No, se quema el fusible porque la corriente total es 2.3A', 'Sí, los fusibles no importan', 'No se puede calcular'], correct: 1, explanation: 'Corriente total = (3 × 0.5A) + 0.8A = 2.3A > 2A del fusible. ¡Se quemaría! Necesitas un fusible de 3A o encender los motores por turnos.' },
    { id: 'cp_6', title: '🔋 Baterías en Combinación', difficulty: 3, emoji: '🔋', description: 'Tienes 4 baterías de 3V/1A. Necesitas energizar un sistema de 6V/2A.', question: '¿Cómo combinas las baterías para obtener 6V y 2A?', options: ['Todas en serie', 'Todas en paralelo', '2 pares en serie, luego esos pares en paralelo', 'No es posible'], correct: 2, explanation: '2 en serie = 6V/1A. Pones 2 de esos pares en paralelo = 6V/2A. Serie suma voltaje, paralelo suma corriente. ¡Combinación perfecta!' },
];

const DAILY_CIRCUIT_XP = 15;
const DAILY_PROG_XP = 20;
const CIRCUIT_PROBLEM_XP = 10;

const CircuitLabScreen = ({ onBack, onOpenFreeCircuitBuilder, userId, userStats, setUserStats, onAwardXp }) => {
    const [tab, setTab] = useState('learn'); // 'learn' | 'problems' | 'daily' | 'concept_detail'
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [dailySolved, setDailySolved] = useState(() => {
        try { const saved = localStorage.getItem('cultivatec_daily_circuit'); return saved === getTodayKey(); } catch { return false; }
    });
    const [dailyAnswer, setDailyAnswer] = useState(null);
    const [showDailyExplanation, setShowDailyExplanation] = useState(false);
    const [solvedProblems, setSolvedProblems] = useState(new Set());

    const dailyProblem = DAILY_CIRCUIT_STORIES[getDailyIndex(DAILY_CIRCUIT_STORIES)];

    const solveProblem = (answerIdx, problemIdx) => {
        setSelectedAnswer(answerIdx);
        setShowExplanation(true);
        // Award XP first time solving a non-daily problem correctly
        if (answerIdx === CIRCUIT_PROBLEMS[problemIdx]?.correct && !solvedProblems.has(problemIdx) && onAwardXp) {
            setSolvedProblems(prev => new Set(prev).add(problemIdx));
            onAwardXp(CIRCUIT_PROBLEM_XP, 'circuitProblem');
        }
    };

    const solveDailyProblem = (answerIdx) => {
        setDailyAnswer(answerIdx);
        setShowDailyExplanation(true);
        if (answerIdx === dailyProblem.correct) {
            const wasAlreadySolved = dailySolved;
            try { localStorage.setItem('cultivatec_daily_circuit', getTodayKey()); setDailySolved(true); } catch {}
            // Award XP for daily circuit problem (first time today)
            if (!wasAlreadySolved && onAwardXp) {
                onAwardXp(DAILY_CIRCUIT_XP, 'dailyCircuit');
            }
        }
    };

    return (
        <div className="pb-24 min-h-full bg-gradient-to-b from-[#0F172A] to-[#1E293B] w-full relative">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur-xl border-b border-[#334155] px-4 py-3">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <button onClick={onBack} className="flex items-center gap-2 bg-[#334155] p-2.5 rounded-xl hover:bg-[#475569] transition active:scale-95">
                        <ArrowLeft size={16} className="text-white" />
                        <span className="text-xs font-black text-white">Volver</span>
                    </button>
                    <div className="flex items-center gap-2 bg-[#22D3EE]/15 px-4 py-1.5 rounded-full border border-[#22D3EE]/30">
                        <Cpu size={16} className="text-[#22D3EE]" />
                        <span className="text-sm font-black text-[#22D3EE]">Laboratorio de Circuitos</span>
                    </div>
                </div>
            </div>

            {/* Tab selector */}
            {tab !== 'concept_detail' && (
                <div className="px-4 pt-4 pb-2 max-w-xl mx-auto">
                    <div className="flex gap-1.5 bg-[#1E293B] rounded-2xl p-1.5 border border-[#334155]">
                        {[
                            { key: 'daily', label: 'Misión Diaria', icon: <Calendar size={13} className="inline -mt-0.5 mr-1" /> },
                            { key: 'learn', label: 'Aprende', icon: <BookOpen size={13} className="inline -mt-0.5 mr-1" /> },
                            { key: 'problems', label: 'Problemas', icon: <Puzzle size={13} className="inline -mt-0.5 mr-1" /> },
                        ].map(t => (
                            <button key={t.key} onClick={() => { setTab(t.key); setSelectedProblem(null); setSelectedAnswer(null); setShowExplanation(false); }}
                                className={`flex-1 py-2.5 rounded-xl text-[11px] font-black transition-all ${tab === t.key ? 'bg-[#22D3EE] text-[#0F172A] shadow-lg shadow-[#22D3EE]/30' : 'text-[#94A3B8] hover:text-white'}`}>
                                {t.icon}{t.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-4 max-w-xl mx-auto py-4">

                {/* DAILY MISSION TAB */}
                {tab === 'daily' && (
                    <div className="space-y-4">
                        {dailySolved ? (
                            <div className="bg-[#22C55E]/10 border-2 border-[#22C55E]/30 rounded-2xl p-6 text-center space-y-3">
                                <div className="text-5xl">🎉</div>
                                <h2 className="text-xl font-black text-[#22C55E]">¡Misión Completada!</h2>
                                <p className="text-sm text-[#94A3B8] font-bold">Has resuelto el problema de circuitos de hoy.</p>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="px-3 py-1 bg-[#FFC800]/20 text-[#FFC800] text-xs font-black rounded-full border border-[#FFC800]/30">+{DAILY_CIRCUIT_XP} XP ganados</span>
                                </div>
                                <div className="bg-[#1E293B] rounded-xl p-4 border border-[#334155]">
                                    <p className="text-xs text-[#64748B] font-bold">🕐 Vuelve mañana para una nueva misión de la nave.</p>
                                    <p className="text-[10px] text-[#475569] font-semibold mt-1">Cada día hay un nuevo problema de circuitos de la nave CultivaTec-7</p>
                                </div>
                                {/* Still allow re-reading */}
                                <button onClick={() => { setDailyAnswer(null); setShowDailyExplanation(false); setDailySolved(false); }}
                                    className="text-[10px] font-bold text-[#22D3EE] underline mt-2">Volver a ver el problema</button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-2">
                                    <span className="text-[10px] font-black text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full border border-[#22D3EE]/20 flex items-center gap-1 mx-auto w-fit"><Calendar size={11} /> MISIÓN DIARIA DE CIRCUITOS</span>
                                </div>
                                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl border-2 border-[#22D3EE]/20 p-5 space-y-4">
                                    <h2 className="text-lg font-black text-white">{dailyProblem.title}</h2>
                                    <div className="bg-[#0F172A]/60 rounded-xl p-4 border border-[#334155]">
                                        <p className="text-sm text-[#E2E8F0] font-semibold leading-relaxed">📖 {dailyProblem.story}</p>
                                    </div>
                                    <div className="bg-[#22D3EE]/10 rounded-xl p-4 border border-[#22D3EE]/20">
                                        <p className="text-sm font-bold text-[#22D3EE]">❓ {dailyProblem.question}</p>
                                    </div>
                                    <div className="space-y-2">
                                        {dailyProblem.options.map((opt, oi) => (
                                            <button key={oi} onClick={() => !showDailyExplanation && solveDailyProblem(oi)}
                                                disabled={showDailyExplanation}
                                                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm font-bold ${
                                                    showDailyExplanation
                                                        ? oi === dailyProblem.correct ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                                                        : oi === dailyAnswer ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                                                        : 'bg-[#1E293B] border-[#334155] text-[#64748B]'
                                                        : 'bg-[#1E293B] border-[#334155] text-[#E2E8F0] hover:border-[#22D3EE] active:scale-[0.98]'
                                                }`}>
                                                <span className="mr-2">{String.fromCharCode(65 + oi)})</span>{opt}
                                                {showDailyExplanation && oi === dailyProblem.correct && ' ✅'}
                                                {showDailyExplanation && oi === dailyAnswer && oi !== dailyProblem.correct && ' ❌'}
                                            </button>
                                        ))}
                                    </div>
                                    {showDailyExplanation && (
                                        <div className={`rounded-xl p-4 border-2 ${dailyAnswer === dailyProblem.correct ? 'bg-[#22C55E]/10 border-[#22C55E]/30' : 'bg-[#F59E0B]/10 border-[#F59E0B]/30'}`}>
                                            <p className="text-sm font-bold text-white mb-1">{dailyAnswer === dailyProblem.correct ? '🎉 ¡Correcto!' : '💡 No exactamente...'}</p>
                                            <p className="text-xs text-[#94A3B8] font-semibold leading-relaxed">{dailyProblem.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* LEARN TAB - Circuit Concepts */}
                {tab === 'learn' && (
                    <div className="space-y-3">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2"><BookOpen size={20} className="text-[#22D3EE]" /> ¿Cómo Funcionan los Circuitos?</h2>
                            <p className="text-xs text-[#94A3B8] font-bold mt-1">Conceptos fundamentales de electrónica</p>
                        </div>
                        {CIRCUIT_CONCEPTS.map(concept => (
                            <button key={concept.id} onClick={() => { setSelectedConcept(concept); setTab('concept_detail'); }}
                                className="w-full bg-[#1E293B] rounded-2xl border-2 border-[#334155] hover:border-[#22D3EE] p-4 flex items-center gap-4 transition-all active:scale-[0.98] group text-left">
                                <div className="w-12 h-12 bg-[#22D3EE]/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform border border-[#22D3EE]/20">
                                    {concept.emoji}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-black text-white">{concept.title}</h3>
                                    <p className="text-[11px] text-[#94A3B8] font-semibold mt-0.5 line-clamp-2">{concept.description}</p>
                                </div>
                                <ChevronDown size={16} className="text-[#64748B] -rotate-90 flex-shrink-0" />
                            </button>
                        ))}

                        {/* Free mode button */}
                        <div className="mt-6 pt-4 border-t border-[#334155]">
                            <button onClick={onOpenFreeCircuitBuilder}
                                className="w-full py-4 bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] rounded-2xl text-white font-black text-sm flex items-center justify-center gap-3 active:scale-95 transition shadow-lg shadow-[#22D3EE]/20">
                                <Zap size={20} />
                                🔧 Abrir Modo Libre de Circuitos
                            </button>
                            <p className="text-[10px] text-[#64748B] font-bold text-center mt-2">Arma circuitos libremente con componentes reales</p>
                        </div>
                    </div>
                )}

                {/* CONCEPT DETAIL */}
                {tab === 'concept_detail' && selectedConcept && (
                    <div className="space-y-4">
                        <button onClick={() => setTab('learn')} className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition">
                            <ArrowLeft size={16} />
                            <span className="text-xs font-black">Volver a conceptos</span>
                        </button>
                        <div className="bg-[#1E293B] rounded-2xl border-2 border-[#22D3EE]/20 p-6 space-y-4">
                            <div className="text-center">
                                <span className="text-4xl">{selectedConcept.emoji}</span>
                                <h2 className="text-xl font-black text-white mt-2">{selectedConcept.title}</h2>
                            </div>
                            <div className="bg-[#0F172A] rounded-xl p-4 border border-[#334155]">
                                <p className="text-sm text-[#E2E8F0] font-semibold leading-relaxed">{selectedConcept.description}</p>
                            </div>
                            <div className="bg-[#22D3EE]/10 rounded-xl p-4 border border-[#22D3EE]/20">
                                <p className="text-xs font-black text-[#22D3EE] mb-1">💡 Ejemplo:</p>
                                <p className="text-sm text-[#E2E8F0] font-semibold whitespace-pre-line leading-relaxed">{selectedConcept.example}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROBLEMS TAB */}
                {tab === 'problems' && !selectedProblem && (
                    <div className="space-y-3">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2"><Puzzle size={20} className="text-[#F59E0B]" /> Problemas de la Nave</h2>
                            <p className="text-xs text-[#94A3B8] font-bold mt-1">Resuelve problemas de circuitos de la nave espacial</p>
                        </div>
                        {CIRCUIT_PROBLEMS.map(prob => (
                            <button key={prob.id} onClick={() => { setSelectedProblem(prob); setSelectedAnswer(null); setShowExplanation(false); }}
                                className="w-full bg-[#1E293B] rounded-2xl border-2 border-[#334155] hover:border-[#F59E0B] p-4 flex items-center gap-4 transition-all active:scale-[0.98] group text-left">
                                <div className="w-12 h-12 bg-[#F59E0B]/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform border border-[#F59E0B]/20">
                                    {prob.emoji}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-black text-white">{prob.title}</h3>
                                    <p className="text-[11px] text-[#94A3B8] font-semibold mt-0.5">{prob.description}</p>
                                    <span className="text-[10px] font-bold text-[#64748B]">{'⭐'.repeat(prob.difficulty)}</span>
                                </div>
                                <div className="px-3 py-2 rounded-xl bg-[#F59E0B] text-[10px] font-black text-[#0F172A] flex-shrink-0">RESOLVER</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* PROBLEM DETAIL */}
                {tab === 'problems' && selectedProblem && (
                    <div className="space-y-4">
                        <button onClick={() => { setSelectedProblem(null); setSelectedAnswer(null); setShowExplanation(false); }}
                            className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition">
                            <ArrowLeft size={16} />
                            <span className="text-xs font-black">Volver a problemas</span>
                        </button>
                        <div className="bg-[#1E293B] rounded-2xl border-2 border-[#F59E0B]/20 p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selectedProblem.emoji}</span>
                                <div>
                                    <h2 className="text-lg font-black text-white">{selectedProblem.title}</h2>
                                    <p className="text-[11px] text-[#94A3B8] font-semibold">{selectedProblem.description}</p>
                                </div>
                            </div>
                            <div className="bg-[#F59E0B]/10 rounded-xl p-4 border border-[#F59E0B]/20">
                                <p className="text-sm font-bold text-[#F59E0B]">❓ {selectedProblem.question}</p>
                            </div>
                            <div className="space-y-2">
                                {selectedProblem.options.map((opt, oi) => (
                                    <button key={oi} onClick={() => !showExplanation && solveProblem(oi, CIRCUIT_PROBLEMS.indexOf(selectedProblem))}
                                        disabled={showExplanation}
                                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm font-bold ${
                                            showExplanation
                                                ? oi === selectedProblem.correct ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                                                : oi === selectedAnswer ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                                                : 'bg-[#1E293B] border-[#334155] text-[#64748B]'
                                                : 'bg-[#1E293B] border-[#334155] text-[#E2E8F0] hover:border-[#F59E0B] active:scale-[0.98]'
                                        }`}>
                                        <span className="mr-2">{String.fromCharCode(65 + oi)})</span>{opt}
                                        {showExplanation && oi === selectedProblem.correct && ' ✅'}
                                        {showExplanation && oi === selectedAnswer && oi !== selectedProblem.correct && ' ❌'}
                                    </button>
                                ))}
                            </div>
                            {showExplanation && (
                                <div className={`rounded-xl p-4 border-2 ${selectedAnswer === selectedProblem.correct ? 'bg-[#22C55E]/10 border-[#22C55E]/30' : 'bg-[#F59E0B]/10 border-[#F59E0B]/30'}`}>
                                    <p className="text-sm font-bold text-white mb-1">{selectedAnswer === selectedProblem.correct ? '🎉 ¡Correcto!' : '💡 No exactamente...'}</p>
                                    <p className="text-xs text-[#94A3B8] font-semibold leading-relaxed">{selectedProblem.explanation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
const PROGRAMMING_TUTORIALS = [
    {
        id: 'tut_1', title: '🐍 Hola Mundo en Python', difficulty: 1, emoji: '👋',
        description: 'Tu primer programa: mostrar texto en pantalla',
        steps: [
            { instruction: 'Escribe este código para mostrar un saludo:', code: 'print("¡Hola Mundo!")' },
            { instruction: 'Ahora personalízalo con tu nombre:', code: 'nombre = "TuNombre"\nprint("¡Hola,", nombre, "!")' },
            { instruction: '¡Experimenta! Cambia el mensaje y corre el código', code: 'print("Soy un futuro ingeniero de robots 🤖")' },
        ],
    },
    {
        id: 'tut_2', title: '📦 Variables y Tipos', difficulty: 1, emoji: '📦',
        description: 'Aprende a guardar datos en cajas llamadas variables',
        steps: [
            { instruction: 'Crea una variable de texto y una de número:', code: 'robot_nombre = "BotMax"\nrobot_edad = 3\nprint(robot_nombre, "tiene", robot_edad, "años")' },
            { instruction: 'Las variables numéricas se pueden sumar:', code: 'velocidad = 10\nboost = 5\ntotal = velocidad + boost\nprint("Velocidad total:", total)' },
            { instruction: 'También puedes hacer listas:', code: 'sensores = ["ultrasonico", "infrarrojo", "luz"]\nprint("Mi robot tiene:", sensores)' },
        ],
    },
    {
        id: 'tut_3', title: '🔀 Decisiones con IF', difficulty: 2, emoji: '🔀',
        description: 'Haz que tu programa tome decisiones inteligentes',
        steps: [
            { instruction: 'Usa IF para decidir:', code: 'distancia = 15\n\nif distancia < 20:\n    print("⚠️ ¡Obstáculo detectado!")\n    print("Robot retrocediendo...")\nelse:\n    print("✅ Camino libre")\n    print("Robot avanzando...")' },
            { instruction: 'Agrega más condiciones con ELIF:', code: 'temperatura = 35\n\nif temperatura > 40:\n    print("🔥 ¡Demasiado caliente!")\nelif temperatura > 25:\n    print("☀️ Hace calor")\nelse:\n    print("❄️ Hace frío")' },
        ],
    },
    {
        id: 'tut_4', title: '🔁 Bucles y Repeticiones', difficulty: 2, emoji: '🔁',
        description: 'Repite acciones sin escribir código de más',
        steps: [
            { instruction: 'Un bucle FOR cuenta automáticamente:', code: 'for i in range(5):\n    print("Parpadeo número", i + 1, "💡")' },
            { instruction: 'Puedes recorrer listas:', code: 'componentes = ["LED", "Motor", "Sensor", "Arduino"]\n\nfor comp in componentes:\n    print("✅ Revisando:", comp)' },
            { instruction: 'Los bucles WHILE repiten hasta cumplir una condición:', code: 'energia = 100\n\nwhile energia > 0:\n    energia = energia - 25\n    print("⚡ Energía restante:", energia)\n\nprint("🔋 ¡Robot sin batería!")' },
        ],
    },
    {
        id: 'tut_5', title: '⚙️ Funciones', difficulty: 3, emoji: '⚙️',
        description: 'Crea bloques de código reutilizables',
        steps: [
            { instruction: 'Define tu primera función:', code: 'def saludar(nombre):\n    print("🤖 ¡Hola,", nombre, "!")\n    print("Bienvenido al laboratorio")\n\nsaludar("Diego")\nsaludar("Ana")' },
            { instruction: 'Funciones que devuelven valores:', code: 'def calcular_velocidad(distancia, tiempo):\n    return distancia / tiempo\n\nv = calcular_velocidad(100, 5)\nprint("Velocidad:", v, "cm/s")' },
        ],
    },
    {
        id: 'tut_6', title: '🤖 Simulación Arduino', difficulty: 3, emoji: '🤖',
        description: 'Simula código de Arduino con JavaScript',
        steps: [
            { instruction: 'Simulación de blink con Arduino:', code: '# Simulación Arduino Blink\npin_led = 13\nestado = "LOW"\n\nfor ciclo in range(6):\n    if estado == "LOW":\n        estado = "HIGH"\n        print("💡 LED en pin", pin_led, "-> ENCENDIDO")\n    else:\n        estado = "LOW"\n        print("⚫ LED en pin", pin_led, "-> APAGADO")' },
            { instruction: 'Simulación de sensor de distancia:', code: '# Simulación sensor ultrasónico\nimport random\n\nfor lectura in range(5):\n    distancia = random.randint(5, 100)\n    print("📏 Distancia:", distancia, "cm")\n    if distancia < 20:\n        print("  ⚠️ ¡Objeto cerca! Girar.")\n    else:\n        print("  ✅ Camino libre. Avanzar.")' },
        ],
    },
];

const PRACTICE_CHALLENGES = [
    { id: 'pc_1', title: 'Calculadora Simple', emoji: '🧮', difficulty: 1, description: 'Haz un programa que sume, reste, multiplique y divida', starterCode: 'a = 10\nb = 3\n\nprint("Suma:", a + b)\nprint("Resta:", a - b)\n# Completa multiplicación y división\n' },
    { id: 'pc_2', title: 'Tabla de Multiplicar', emoji: '✖️', difficulty: 1, description: 'Genera la tabla de multiplicar de un número', starterCode: 'numero = 7\n\nfor i in range(1, 11):\n    resultado = numero * i\n    print(numero, "x", i, "=", resultado)' },
    { id: 'pc_3', title: 'Detector de Pares', emoji: '🔢', difficulty: 2, description: 'Encuentra los números pares del 1 al 20', starterCode: 'for n in range(1, 21):\n    if n % 2 == 0:\n        print(n, "es PAR ✅")\n    else:\n        print(n, "es IMPAR")' },
    { id: 'pc_4', title: 'Fibonacci Robot', emoji: '🐚', difficulty: 3, description: 'Genera la secuencia Fibonacci hasta 100', starterCode: 'a = 0\nb = 1\n\nprint("Secuencia Fibonacci:")\nwhile a <= 100:\n    print(a)\n    temp = a + b\n    a = b\n    b = temp' },
    { id: 'pc_5', title: 'Piedra, Papel, Tijera', emoji: '✂️', difficulty: 2, description: 'Simula un juego de piedra, papel o tijera', starterCode: 'import random\n\nopciones = ["piedra", "papel", "tijera"]\n\njugador = "piedra"\nrobot = random.choice(opciones)\n\nprint("Tú:", jugador)\nprint("Robot:", robot)\n\nif jugador == robot:\n    print("🤝 ¡Empate!")\nelif (jugador == "piedra" and robot == "tijera") or (jugador == "papel" and robot == "piedra") or (jugador == "tijera" and robot == "papel"):\n    print("🎉 ¡Ganaste!")\nelse:\n    print("🤖 ¡Ganó el robot!")' },
    { id: 'pc_6', title: 'Inventario de Robot', emoji: '📋', difficulty: 3, description: 'Gestiona el inventario de partes de un robot', starterCode: 'inventario = {\n    "motores": 4,\n    "sensores": 3,\n    "LEDs": 10,\n    "cables": 20\n}\n\nprint("=== Inventario del Robot ===")\nfor parte, cantidad in inventario.items():\n    print(f"  {parte}: {cantidad} unidades")\n\ntotal = sum(inventario.values())\nprint(f"\\nTotal de partes: {total}")' },
];

const ProgrammingStationScreen = ({ onBack, startChallenge, userScores, userId, userStats, setUserStats, onAwardXp }) => {
    const [tab, setTab] = useState('daily'); // 'daily' | 'tutorials' | 'practice' | 'free' | 'tutorial_detail'
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dailyProgSolved, setDailyProgSolved] = useState(() => {
        try { const saved = localStorage.getItem('cultivatec_daily_prog'); return saved === getTodayKey(); } catch { return false; }
    });
    const [dailyProgRan, setDailyProgRan] = useState(false);

    const executeCode = (codeToRun) => {
        setIsLoading(true);
        setOutput('');
        let capturedOutput = [];
        const __custom_print = (...args) => {
            capturedOutput.push(args.map(String).join(' '));
        };
        let processed = (codeToRun || code).replace(/import random/g, '').replace(/random\.randint\((\d+),\s*(\d+)\)/g, (_, min, max) => `Math.floor(Math.random()*(${max}-${min}+1)+${min})`).replace(/random\.choice\((\w+)\)/g, '$1[Math.floor(Math.random()*$1.length)]');
        processed = processed.replace(/print\s*\(/g, '__custom_print(');
        processed = processed.replace(/f"([^"]*)"/g, (_, content) => {
            return '`' + content.replace(/\{([^}]+)\}/g, '${$1}') + '`';
        });
        processed = processed.replace(/(\w+)\.items\(\)/g, 'Object.entries($1)');
        processed = processed.replace(/for (\w+), (\w+) in Object\.entries\((\w+)\)/g, 'for (let [$1, $2] of Object.entries($3))');
        processed = processed.replace(/for (\w+) in range\((\d+),\s*(\d+)\):/g, 'for (let $1 = $2; $1 < $3; $1++) {');
        processed = processed.replace(/for (\w+) in range\((\d+)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {');
        processed = processed.replace(/for (\w+) in (\w+):/g, 'for (let $1 of $2) {');
        processed = processed.replace(/while (.+):/g, 'while ($1) {');
        processed = processed.replace(/if (.+):/g, 'if ($1) {');
        processed = processed.replace(/elif (.+):/g, '} else if ($1) {');
        processed = processed.replace(/else:/g, '} else {');
        processed = processed.replace(/def (\w+)\(([^)]*)\):/g, 'function $1($2) {');
        processed = processed.replace(/ and /g, ' && ');
        processed = processed.replace(/ or /g, ' || ');
        processed = processed.replace(/ not /g, ' !');
        processed = processed.replace(/#.*/g, '');
        processed = processed.replace(/sum\((\w+)\.values\(\)\)/g, 'Object.values($1).reduce((a,b)=>a+b,0)');
        processed = processed.replace(/return (.+)/g, 'return $1');
        // Add closing braces for Python indentation blocks
        const lines = processed.split('\n');
        const result = [];
        let indentStack = [];
        for (const line of lines) {
            const trimmed = line.trimStart();
            const indent = line.length - trimmed.length;
            while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1] && trimmed.length > 0) {
                indentStack.pop();
                result.push(' '.repeat(indent) + '}');
            }
            if (trimmed.endsWith('{')) {
                indentStack.push(indent);
            }
            result.push(line);
        }
        while (indentStack.length > 0) {
            indentStack.pop();
            result.push('}');
        }
        processed = result.join('\n');

        try {
            new Function('__custom_print', processed)(__custom_print);
            setOutput(capturedOutput.join('\n'));
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setTimeout(() => setIsLoading(false), 300);
        }
    };

    const openTutorial = (tut) => {
        setSelectedTutorial(tut);
        setCurrentStep(0);
        setCode(tut.steps[0].code);
        setOutput('');
        setTab('tutorial_detail');
    };

    const goToStep = (stepIdx) => {
        setCurrentStep(stepIdx);
        setCode(selectedTutorial.steps[stepIdx].code);
        setOutput('');
    };

    const openPractice = (challenge) => {
        setCode(challenge.starterCode);
        setOutput('');
        setSelectedTutorial(challenge);
        setTab('free');
    };

    const completedChallengeIds = Object.keys(userScores || {}).filter(k => k.startsWith('challenge_') && userScores[k]?.completed);

    const dailyProgProblem = DAILY_PROGRAMMING_STORIES[getDailyIndex(DAILY_PROGRAMMING_STORIES)];

    const openDailyProblem = () => {
        setCode(dailyProgProblem.starterCode);
        setOutput('');
        setDailyProgRan(false);
        setTab('daily_detail');
    };

    const runDailyCode = () => {
        executeCode(code);
        setDailyProgRan(true);
        const wasAlreadySolved = dailyProgSolved;
        try { localStorage.setItem('cultivatec_daily_prog', getTodayKey()); setDailyProgSolved(true); } catch {}
        // Award XP for daily programming problem (first time today)
        if (!wasAlreadySolved && onAwardXp) {
            onAwardXp(DAILY_PROG_XP, 'dailyProg');
        }
    };

    return (
        <div className="pb-24 min-h-full bg-gradient-to-b from-[#0F172A] to-[#1E293B] w-full relative">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur-xl border-b border-[#334155] px-4 py-3">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <button onClick={onBack} className="flex items-center gap-2 bg-[#334155] p-2.5 rounded-xl hover:bg-[#475569] transition active:scale-95">
                        <ArrowLeft size={16} className="text-white" />
                        <span className="text-xs font-black text-white">Volver</span>
                    </button>
                    <div className="flex items-center gap-2 bg-[#22D3EE]/15 px-4 py-1.5 rounded-full border border-[#22D3EE]/30">
                        <Rocket size={16} className="text-[#22D3EE]" />
                        <span className="text-sm font-black text-[#22D3EE]">Estación de Programación</span>
                    </div>
                </div>
            </div>

            {/* Tab selector */}
            {tab !== 'tutorial_detail' && tab !== 'daily_detail' && (
                <div className="px-4 pt-4 pb-2 max-w-xl mx-auto">
                    <div className="flex gap-1.5 bg-[#1E293B] rounded-2xl p-1.5 border border-[#334155]">
                        {[
                            { key: 'daily', label: 'Misión', icon: <Calendar size={13} className="inline -mt-0.5 mr-1" /> },
                            { key: 'tutorials', label: 'Tutoriales', icon: <GraduationCap size={13} className="inline -mt-0.5 mr-1" /> },
                            { key: 'practice', label: 'Práctica', icon: <Dumbbell size={13} className="inline -mt-0.5 mr-1" /> },
                            { key: 'free', label: 'Libre', icon: <Monitor size={13} className="inline -mt-0.5 mr-1" /> },
                        ].map(t => (
                            <button key={t.key} onClick={() => { setTab(t.key); if (t.key === 'free') { setCode('# Escribe tu código Python aquí\nprint("¡Hola desde la Estación!")'); setOutput(''); } }}
                                className={`flex-1 py-2.5 rounded-xl text-[11px] font-black transition-all ${tab === t.key ? 'bg-[#22D3EE] text-[#0F172A] shadow-lg shadow-[#22D3EE]/30' : 'text-[#94A3B8] hover:text-white'}`}>
                                {t.icon}{t.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-4 max-w-xl mx-auto py-4">

                {/* DAILY MISSION TAB */}
                {tab === 'daily' && (
                    <div className="space-y-4">
                        {dailyProgSolved ? (
                            <div className="bg-[#22C55E]/10 border-2 border-[#22C55E]/30 rounded-2xl p-6 text-center space-y-3">
                                <div className="text-5xl">🎉</div>
                                <h2 className="text-xl font-black text-[#22C55E]">¡Misión Completada!</h2>
                                <p className="text-sm text-[#94A3B8] font-bold">Has resuelto el problema de programación de hoy.</p>
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <span className="px-3 py-1 bg-[#FFC800]/20 text-[#FFC800] text-xs font-black rounded-full border border-[#FFC800]/30">+{DAILY_PROG_XP} XP ganados</span>
                                </div>
                                <div className="bg-[#1E293B] rounded-xl p-4 border border-[#334155]">
                                    <p className="text-xs text-[#64748B] font-bold">🕐 Vuelve mañana para consultar si hay más problemas de la nave.</p>
                                    <p className="text-[10px] text-[#475569] font-semibold mt-1">Cada día hay un nuevo desafío de programación de la nave CultivaTec-7</p>
                                </div>
                                <button onClick={() => { setDailyProgSolved(false); openDailyProblem(); }}
                                    className="text-[10px] font-bold text-[#22D3EE] underline mt-2">Volver a practicar el problema</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center mb-2">
                                    <span className="text-[10px] font-black text-[#A78BFA] bg-[#A78BFA]/10 px-3 py-1 rounded-full border border-[#A78BFA]/20 flex items-center gap-1 mx-auto w-fit"><Calendar size={11} /> MISIÓN DIARIA DE PROGRAMACIÓN</span>
                                </div>
                                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl border-2 border-[#A78BFA]/20 p-5 space-y-4">
                                    <h2 className="text-lg font-black text-white">{dailyProgProblem.title}</h2>
                                    <div className="bg-[#0F172A]/60 rounded-xl p-4 border border-[#334155]">
                                        <p className="text-sm text-[#E2E8F0] font-semibold leading-relaxed">📖 {dailyProgProblem.story}</p>
                                    </div>
                                    <div className="bg-[#A78BFA]/10 rounded-xl p-4 border border-[#A78BFA]/20">
                                        <p className="text-sm font-bold text-[#A78BFA]">🎯 {dailyProgProblem.task}</p>
                                    </div>
                                    <button onClick={openDailyProblem}
                                        className="w-full py-3.5 bg-[#A78BFA] text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-[#A78BFA]/20">
                                        <Code size={16} /> Abrir en el Editor
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* DAILY DETAIL - code editor for daily problem */}
                {tab === 'daily_detail' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <button onClick={() => setTab('daily')} className="bg-[#334155] p-2 rounded-xl hover:bg-[#475569] transition active:scale-95">
                                <ArrowLeft size={16} className="text-white" />
                            </button>
                            <div>
                                <h2 className="text-base font-black text-white">{dailyProgProblem.title}</h2>
                                <p className="text-[11px] text-[#A78BFA] font-bold">Misión diaria de programación</p>
                            </div>
                        </div>
                        <div className="bg-[#A78BFA]/10 rounded-xl p-3 border border-[#A78BFA]/20">
                            <p className="text-xs font-bold text-[#A78BFA]">🎯 {dailyProgProblem.task}</p>
                        </div>
                        {/* Code editor */}
                        <div className="bg-[#1E293B] rounded-2xl overflow-hidden border-2 border-[#334155]">
                            <div className="bg-[#0F172A] px-4 py-2.5 flex items-center border-b border-[#334155]">
                                <div className="flex gap-1.5 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                                </div>
                                <span className="text-[10px] font-black text-[#64748B]">mision_diaria.py</span>
                            </div>
                            <textarea value={code} onChange={(e) => setCode(e.target.value)}
                                className="w-full font-mono text-sm resize-none outline-none border-none p-4 min-h-[200px] bg-[#1E293B] text-[#E2E8F0]"
                                spellCheck={false} />
                        </div>
                        {/* Output */}
                        <div className="bg-[#0F172A] rounded-2xl overflow-hidden border-2 border-[#334155]">
                            <div className="bg-[#0F172A] px-4 py-2 flex items-center border-b border-[#334155]">
                                <Terminal size={12} className="mr-2 text-[#A78BFA]" />
                                <span className="text-[10px] font-black text-[#64748B]">Consola</span>
                            </div>
                            <pre className="font-mono text-sm p-4 min-h-[60px] whitespace-pre-wrap text-[#A78BFA]">
                                {output || <span className="text-[#475569] italic">Corre el código para resolver la misión...</span>}
                            </pre>
                        </div>
                        <button onClick={runDailyCode}
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[#A78BFA] text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50 shadow-lg shadow-[#A78BFA]/20">
                            <Play size={16} /> {isLoading ? 'Ejecutando...' : '▶ Correr y Resolver Misión'}
                        </button>
                        {dailyProgRan && output && !output.startsWith('Error') && (
                            <div className="bg-[#22C55E]/10 border-2 border-[#22C55E]/30 rounded-2xl p-4 text-center space-y-2">
                                <p className="text-sm font-black text-[#22C55E]">🎉 ¡Misión completada!</p>
                                <p className="text-xs text-[#94A3B8] font-bold">Todos los problemas resueltos por hoy. ¡Vuelve mañana para consultar si hay más problemas!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TUTORIALS TAB */}
                {tab === 'tutorials' && (
                    <div className="space-y-3">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2"><GraduationCap size={20} className="text-[#22D3EE]" /> Tutoriales Paso a Paso</h2>
                            <p className="text-xs text-[#94A3B8] font-bold mt-1">Aprende conceptos con ejemplos interactivos</p>
                        </div>
                        {PROGRAMMING_TUTORIALS.map(tut => (
                            <button key={tut.id} onClick={() => openTutorial(tut)}
                                className="w-full bg-[#1E293B] rounded-2xl border-2 border-[#334155] hover:border-[#22D3EE] p-4 flex items-center gap-4 transition-all active:scale-[0.98] group text-left">
                                <div className="w-12 h-12 bg-[#22D3EE]/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform border border-[#22D3EE]/20">
                                    {tut.emoji}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-black text-white truncate">{tut.title}</h3>
                                    <p className="text-[11px] text-[#94A3B8] font-semibold mt-0.5">{tut.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#22D3EE]/10 text-[#22D3EE]">{tut.steps.length} pasos</span>
                                        <span className="text-[10px] font-bold text-[#64748B]">{'⭐'.repeat(tut.difficulty)}</span>
                                    </div>
                                </div>
                                <div className="px-3 py-2 rounded-xl bg-[#22D3EE] text-[10px] font-black text-[#0F172A] flex-shrink-0">ABRIR</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* TUTORIAL DETAIL TAB */}
                {tab === 'tutorial_detail' && selectedTutorial && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <button onClick={() => setTab('tutorials')} className="bg-[#334155] p-2 rounded-xl hover:bg-[#475569] transition active:scale-95">
                                <ArrowLeft size={16} className="text-white" />
                            </button>
                            <div>
                                <h2 className="text-lg font-black text-white">{selectedTutorial.emoji} {selectedTutorial.title}</h2>
                                <p className="text-[11px] text-[#94A3B8] font-bold">Paso {currentStep + 1} de {selectedTutorial.steps.length}</p>
                            </div>
                        </div>

                        {/* Step progress */}
                        <div className="flex gap-1.5">
                            {selectedTutorial.steps.map((_, si) => (
                                <button key={si} onClick={() => goToStep(si)}
                                    className={`flex-1 h-2 rounded-full transition-all ${si === currentStep ? 'bg-[#22D3EE]' : si < currentStep ? 'bg-[#22D3EE]/40' : 'bg-[#334155]'}`} />
                            ))}
                        </div>

                        {/* Instruction */}
                        <div className="bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-2xl p-4">
                            <p className="text-sm font-bold text-[#22D3EE]">📝 {selectedTutorial.steps[currentStep].instruction}</p>
                        </div>

                        {/* Code editor */}
                        <div className="bg-[#1E293B] rounded-2xl overflow-hidden border-2 border-[#334155]">
                            <div className="bg-[#0F172A] px-4 py-2.5 flex items-center border-b border-[#334155]">
                                <div className="flex gap-1.5 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                                </div>
                                <span className="text-[10px] font-black text-[#64748B]">editor.py</span>
                            </div>
                            <textarea value={code} onChange={(e) => setCode(e.target.value)}
                                className="w-full font-mono text-sm resize-none outline-none border-none p-4 min-h-[150px] bg-[#1E293B] text-[#E2E8F0]"
                                spellCheck={false} />
                        </div>

                        {/* Output */}
                        <div className="bg-[#0F172A] rounded-2xl overflow-hidden border-2 border-[#334155]">
                            <div className="bg-[#0F172A] px-4 py-2 flex items-center border-b border-[#334155]">
                                <Terminal size={12} className="mr-2 text-[#22D3EE]" />
                                <span className="text-[10px] font-black text-[#64748B]">Consola</span>
                            </div>
                            <pre className="font-mono text-sm p-4 min-h-[60px] whitespace-pre-wrap text-[#22D3EE]">
                                {output || <span className="text-[#475569] italic">Corre el código para ver la salida...</span>}
                            </pre>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={() => executeCode(code)}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-[#22D3EE] text-[#0F172A] rounded-xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50">
                                <Play size={16} /> {isLoading ? 'Ejecutando...' : '▶ Correr'}
                            </button>
                            {currentStep < selectedTutorial.steps.length - 1 && (
                                <button onClick={() => goToStep(currentStep + 1)}
                                    className="flex-1 py-3 bg-[#334155] text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition hover:bg-[#475569]">
                                    Siguiente →
                                </button>
                            )}
                            {currentStep === selectedTutorial.steps.length - 1 && (
                                <button onClick={() => setTab('tutorials')}
                                    className="flex-1 py-3 bg-[#22C55E] text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition">
                                    ✅ ¡Completado!
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* PRACTICE TAB */}
                {tab === 'practice' && (
                    <div className="space-y-3">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2"><Dumbbell size={20} className="text-[#A78BFA]" /> Retos de Práctica</h2>
                            <p className="text-xs text-[#94A3B8] font-bold mt-1">Ejercicios independientes para practicar</p>
                        </div>
                        {PRACTICE_CHALLENGES.map(ch => (
                            <button key={ch.id} onClick={() => openPractice(ch)}
                                className="w-full bg-[#1E293B] rounded-2xl border-2 border-[#334155] hover:border-[#A78BFA] p-4 flex items-center gap-4 transition-all active:scale-[0.98] group text-left">
                                <div className="w-12 h-12 bg-[#A78BFA]/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform border border-[#A78BFA]/20">
                                    {ch.emoji}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-black text-white truncate">{ch.title}</h3>
                                    <p className="text-[11px] text-[#94A3B8] font-semibold mt-0.5">{ch.description}</p>
                                    <span className="text-[10px] font-bold text-[#64748B]">{'⭐'.repeat(ch.difficulty)}</span>
                                </div>
                                <div className="px-3 py-2 rounded-xl bg-[#A78BFA] text-[10px] font-black text-white flex-shrink-0">PRACTICAR</div>
                            </button>
                        ))}

                        {/* Link to module challenges */}
                        <div className="mt-6 border-t border-[#334155] pt-4">
                            <p className="text-xs text-[#64748B] font-bold text-center mb-3">🧩 Retos de Bloques de Código (de los mundos)</p>
                            <div className="grid grid-cols-2 gap-2">
                                {CODE_CHALLENGES.slice(0, 6).map(ch => (
                                    <button key={ch.id} onClick={() => startChallenge(ch.id)}
                                        className="bg-[#1E293B] rounded-xl border border-[#334155] p-3 text-left hover:border-[#FF4B4B] transition active:scale-95">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{ch.icon}</span>
                                            <span className="text-[10px] font-black text-white truncate">{ch.title}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-bold text-[#64748B]">{ch.name}</span>
                                            {completedChallengeIds.includes('challenge_' + ch.id) && <span className="text-[9px]">✅</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* FREE CODING TAB */}
                {tab === 'free' && (
                    <div className="space-y-4">
                        <div className="text-center mb-2">
                            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2"><Monitor size={20} className="text-[#22D3EE]" /> Código Libre</h2>
                            <p className="text-xs text-[#94A3B8] font-bold mt-1">
                                {selectedTutorial?.title ? `Practicando: ${selectedTutorial.title}` : 'Escribe lo que quieras en Python'}
                            </p>
                        </div>

                        {/* Code editor */}
                        <div className="bg-[#1E293B] rounded-2xl overflow-hidden border-2 border-[#334155]">
                            <div className="bg-[#0F172A] px-4 py-2.5 flex items-center border-b border-[#334155]">
                                <div className="flex gap-1.5 mr-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                                </div>
                                <span className="text-[10px] font-black text-[#64748B]">libre.py</span>
                            </div>
                            <textarea value={code} onChange={(e) => setCode(e.target.value)}
                                className="w-full font-mono text-sm resize-none outline-none border-none p-4 min-h-[200px] bg-[#1E293B] text-[#E2E8F0]"
                                spellCheck={false} />
                        </div>

                        {/* Output */}
                        <div className="bg-[#0F172A] rounded-2xl overflow-hidden border-2 border-[#334155]">
                            <div className="bg-[#0F172A] px-4 py-2 flex items-center border-b border-[#334155]">
                                <Terminal size={12} className="mr-2 text-[#22D3EE]" />
                                <span className="text-[10px] font-black text-[#64748B]">Consola</span>
                            </div>
                            <pre className="font-mono text-sm p-4 min-h-[80px] whitespace-pre-wrap text-[#22D3EE]">
                                {output || <span className="text-[#475569] italic">Corre el código para ver la salida...</span>}
                            </pre>
                        </div>

                        <button onClick={() => executeCode(code)}
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[#22D3EE] text-[#0F172A] rounded-xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50">
                            <Play size={16} /> {isLoading ? 'Ejecutando...' : '▶ Correr Código'}
                        </button>

                        {/* Quick templates */}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {[
                                { label: '👋 Hola', code: 'print("¡Hola Mundo! 🤖")' },
                                { label: '🔁 Bucle', code: 'for i in range(5):\n    print("Vuelta", i + 1)' },
                                { label: '🔀 If/Else', code: 'x = 10\nif x > 5:\n    print("Mayor que 5")\nelse:\n    print("Menor o igual")' },
                            ].map((t, i) => (
                                <button key={i} onClick={() => { setCode(t.code); setOutput(''); }}
                                    className="py-2 bg-[#334155] text-white rounded-xl text-[10px] font-black hover:bg-[#475569] transition active:scale-95">
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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
const MatchingGameSection = ({ section, setXpEarned, setShowXpPop, setMascotMood, onComplete }) => {
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
                onComplete?.();
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

const TrueFalseSection = ({ section, setXpEarned, setShowXpPop, setMascotMood, onComplete }) => {
    const statements = section.statements || [];
    const [tfAnswers, setTfAnswers] = useState({});
    const handleTF = (idx, answer) => {
        if (tfAnswers[idx] !== undefined) return;
        const isCorrect = answer === statements[idx].correct;
        const newAnswers = { ...tfAnswers, [idx]: isCorrect ? 'correct' : 'wrong' };
        setTfAnswers(newAnswers);
        if (isCorrect) {
            setXpEarned(p => p + 10);
            setShowXpPop(true);
            setTimeout(() => setShowXpPop(false), 1000);
            setMascotMood('celebrating');
            setTimeout(() => setMascotMood('happy'), 2000);
            // Check if ALL statements are answered correctly
            const allCorrect = statements.every((_, sIdx) => {
                if (sIdx === idx) return isCorrect;
                return newAnswers[sIdx] === 'correct';
            });
            if (allCorrect) onComplete?.();
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

    const moduleIndex = ALL_MODULES.findIndex(m => m.id === currentModule.id);
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

    // Track which interactive steps have been solved
    const [solvedSteps, setSolvedSteps] = useState(new Set());

    // Check if a section type requires interaction to proceed
    const isStepInteractive = (section) => {
        return ['mini_quiz', 'matching_game', 'true_false'].includes(section?.tipo);
    };

    // Check if current step can be advanced past
    const canAdvance = (stepIdx) => {
        const section = content[stepIdx];
        if (!isStepInteractive(section)) return true;
        return solvedSteps.has(stepIdx);
    };

    const markStepSolved = useCallback((stepIdx) => {
        setSolvedSteps(prev => {
            const n = new Set(prev);
            n.add(stepIdx);
            return n;
        });
    }, []);

    // Mini-Quiz State
    const [quizAnswers, setQuizAnswers] = useState({});
    const handleQuizAnswer = (sectionIdx, optionIdx, correctIdx) => {
        const isCorrect = optionIdx === correctIdx;
        setQuizAnswers(prev => ({ ...prev, [sectionIdx]: isCorrect ? 'correct' : 'wrong' }));
        if (isCorrect) {
            markStepSolved(sectionIdx);
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
        if (!canAdvance(currentStep)) return;
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
            return <MatchingGameSection section={section} setXpEarned={setXpEarned} setShowXpPop={setShowXpPop} setMascotMood={setMascotMood} onComplete={() => markStepSolved(index)} />;
        }
        // True/False quick game
        if (section.tipo === 'true_false') {
            return <TrueFalseSection section={section} setXpEarned={setXpEarned} setShowXpPop={setShowXpPop} setMascotMood={setMascotMood} onComplete={() => markStepSolved(index)} />;
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
                    {content.map((_, i) => {
                        // Can only jump to a step if all previous interactive steps are solved
                        const canJump = i <= currentStep || (() => {
                            for (let s = 0; s < i; s++) {
                                if (isStepInteractive(content[s]) && !solvedSteps.has(s)) return false;
                            }
                            return true;
                        })();
                        return (
                            <button key={i} onClick={() => canJump && setCurrentStep(i)} 
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    i === currentStep ? 'scale-125' : completedSteps.has(i) ? '' : !canJump ? 'bg-[#E5E5E5] opacity-40' : 'bg-[#E5E5E5]'
                                } ${!canJump ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                style={i === currentStep ? { backgroundColor: moduleColor } : completedSteps.has(i) ? { backgroundColor: '#2563EB' } : {}}
                            />
                        );
                    })}
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
                        disabled={!canAdvance(currentStep)}
                        className={`flex-[2] py-3.5 rounded-xl text-sm font-black transition-all border-b-4 ${
                            !canAdvance(currentStep) 
                                ? 'bg-[#E5E5E5] text-[#AFAFAF] border-[#CDCDCD] cursor-not-allowed' 
                                : 'text-white active:scale-95'
                        }`}
                        style={canAdvance(currentStep) ? { backgroundColor: moduleColor, borderBottomColor: `${moduleColor}CC` } : {}}>
                        {!canAdvance(currentStep) 
                            ? '🔒 Completa la actividad' 
                            : currentStep === totalSteps - 1 
                                ? '🎉 ¡Completar Módulo!' 
                                : 'Siguiente →'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- SECTION / UNIT DEFINITIONS (Legacy - kept for backward compat) ---
const LEARNING_SECTIONS = WORLDS_CONFIG[0].sections;

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

const SectionBanner = ({ section, modulesInSection, userScores, sectionIndex, allModules }) => {
    const completedInSection = modulesInSection.filter(m => isModuleCompleted(userScores, m.id)).length;
    const totalInSection = modulesInSection.length;
    const isComplete = completedInSection === totalInSection && totalInSection > 0;
    // A section is locked if first module of section is locked
    const firstModuleGlobalIdx = section.startIdx;
    const sectionAllModules = allModules || MODULOS_DE_ROBOTICA;
    const isSectionLocked = firstModuleGlobalIdx > 0 && !isModuleUnlocked(userScores, firstModuleGlobalIdx, sectionAllModules);

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

// --- WORLD MAP SCREEN (Selección de Mundos) ---
const WorldMapScreen = ({ userScores, onSelectWorld, userProfile, firebaseProfile, onShowAchievements, onShowLicenses, onLogout, onEditRobot, userStats, onGoToCircuits, onGoToProgramming }) => {
    // Generate stars deterministically
    const stars = React.useMemo(() => 
        Array.from({ length: 80 }, (_, i) => ({
            left: `${(i * 13.7 + 5) % 98}%`,
            top: `${(i * 17.3 + 3) % 95}%`,
            size: 1 + (i % 3),
            twinkleDuration: `${2 + (i % 5) * 0.8}s`,
            twinkleDelay: `${(i * 0.3) % 4}s`,
        }))
    , []);

    const particles = React.useMemo(() =>
        Array.from({ length: 12 }, (_, i) => ({
            left: `${(i * 8.5 + 2) % 95}%`,
            bottom: '0%',
            duration: `${6 + (i % 4) * 3}s`,
            delay: `${i * 1.2}s`,
        }))
    , []);

    return (
        <div className="pb-24 min-h-full galaxy-bg w-full relative overflow-hidden">
            {/* Galaxy background layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Nebula blobs */}
                <div className="galaxy-nebula" style={{
                    width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.15) 40%, transparent 70%)',
                    left: '-5%', top: '10%',
                    '--nebula-duration': '18s'
                }}></div>
                <div className="galaxy-nebula-2" style={{
                    width: '250px', height: '250px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(37,99,235,0.1) 40%, transparent 70%)',
                    right: '-8%', top: '30%',
                    '--nebula-duration': '22s'
                }}></div>
                <div className="galaxy-nebula" style={{
                    width: '350px', height: '350px',
                    background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(192,132,252,0.1) 40%, transparent 70%)',
                    left: '30%', bottom: '5%',
                    '--nebula-duration': '25s'
                }}></div>
                <div className="galaxy-nebula-2" style={{
                    width: '200px', height: '200px',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(244,114,182,0.08) 40%, transparent 70%)',
                    right: '20%', top: '5%',
                    '--nebula-duration': '16s'
                }}></div>

                {/* Stars */}
                {stars.map((star, i) => (
                    <div key={`star-${i}`} className="galaxy-star" style={{
                        left: star.left,
                        top: star.top,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        '--twinkle-duration': star.twinkleDuration,
                        '--twinkle-delay': star.twinkleDelay,
                    }}></div>
                ))}

                {/* Shooting stars */}
                <div className="galaxy-shooting-star" style={{ left: '10%', top: '15%', '--shoot-duration': '6s', '--shoot-delay': '0s' }}></div>
                <div className="galaxy-shooting-star" style={{ left: '60%', top: '8%', '--shoot-duration': '8s', '--shoot-delay': '3s' }}></div>
                <div className="galaxy-shooting-star" style={{ left: '30%', top: '50%', '--shoot-duration': '7s', '--shoot-delay': '5s' }}></div>

                {/* Floating particles */}
                {particles.map((p, i) => (
                    <div key={`particle-${i}`} className="galaxy-particle" style={{
                        left: p.left,
                        bottom: p.bottom,
                        '--particle-duration': p.duration,
                        '--particle-delay': p.delay,
                    }}></div>
                ))}

                {/* Soft light overlay for "not too dark" effect */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(147,130,220,0.15) 0%, transparent 60%)',
                }}></div>
            </div>

            {/* Top Stats Bar */}
            <div className="sticky top-0 z-20 bg-[#1E1B4B]/60 backdrop-blur-2xl border-b border-purple-500/15 px-4 py-2.5">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-2.5">
                        {userProfile && (
                            <button onClick={onEditRobot} className="active:scale-90 transition-transform hover:ring-2 hover:ring-purple-400/40 rounded-2xl p-0.5 bg-purple-500/10 border border-purple-400/15">
                                <RobotMini config={userProfile.robotConfig} size={36} />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white/90 leading-tight">{firebaseProfile?.username || 'Explorador'}</span>
                            <span className="text-[9px] font-bold text-purple-300/60 leading-tight">
                                {(() => { const lv = calculateLevel(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0); return `${lv.emoji} Nv.${lv.level} · ${lv.title}`; })()}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-purple-400/15 px-2.5 py-1.5 rounded-xl border border-purple-400/15">
                            <Zap size={14} className="text-purple-300" />
                            <span className="text-xs font-black text-purple-200">{firebaseProfile?.currentStreak || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-400/12 px-2.5 py-1.5 rounded-xl border border-yellow-400/15">
                            <Star size={14} className="text-yellow-300" />
                            <span className="text-xs font-black text-yellow-300">{(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0).toLocaleString()}</span>
                        </div>
                        <button onClick={onShowLicenses} className="flex items-center bg-purple-500/15 p-2 rounded-xl hover:bg-purple-500/25 transition active:scale-95 border border-purple-400/15">
                            <GraduationCap size={16} className="text-purple-300" />
                        </button>
                        {onLogout && (
                            <button onClick={onLogout} className="flex items-center bg-red-500/15 p-2 rounded-xl hover:bg-red-500/25 transition active:scale-95 border border-red-400/15">
                                <Settings size={14} className="text-red-300" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="text-center pt-6 pb-3 px-4 relative z-10">
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight drop-shadow-lg flex items-center justify-center gap-2">
                    <Rocket size={22} className="text-purple-300" /> Mapa Galáctico
                </h1>
                <p className="text-xs text-purple-200/60 font-bold">Elige tu destino y conquista los mundos</p>
            </div>

            {/* Station Ships */}
            <div className="px-4 max-w-xl mx-auto relative z-10 mb-8">
                <div className="flex justify-between gap-6 items-start">
                    {/* Left Ship - Circuit Lab */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <button onClick={onGoToCircuits}
                            className="group relative active:scale-90 transition-transform duration-200 focus:outline-none"
                            style={{ animation: 'ship-fly 6s ease-in-out infinite' }}>
                            {/* Outer glow ring */}
                            <div className="absolute inset-[-16px] rounded-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(34,211,238,0.1) 40%, transparent 70%)', filter: 'blur(8px)' }}></div>
                            {/* Ship image */}
                            <img src="/electronica.png" alt="Laboratorio de Circuitos"
                                className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                                style={{ filter: 'drop-shadow(0 0 18px rgba(34,211,238,0.6)) drop-shadow(0 0 40px rgba(34,211,238,0.3))' }} />
                            {/* Thruster glow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-5 rounded-full bg-[#22D3EE]/50 blur-lg z-0" style={{ animation: 'twinkle 1.5s ease-in-out infinite' }}></div>
                            {/* Sparkles around ship */}
                            <div className="absolute top-0 right-0 w-2 h-2 bg-[#22D3EE]/70 rounded-full" style={{ animation: 'twinkle 2s ease-in-out infinite' }}></div>
                            <div className="absolute bottom-4 left-0 w-1.5 h-1.5 bg-white/50 rounded-full" style={{ animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }}></div>
                            <div className="absolute top-6 left-1 w-1 h-1 bg-[#22D3EE]/50 rounded-full" style={{ animation: 'twinkle 3s ease-in-out infinite 1s' }}></div>
                        </button>
                        {/* Info below */}
                        <div className="text-center mt-1">
                            <h3 className="text-xs font-black text-[#22D3EE] leading-tight">Laboratorio</h3>
                            <h3 className="text-xs font-black text-[#22D3EE] leading-tight">de Circuitos</h3>
                            <span className="text-[9px] font-bold text-purple-200/50 mt-0.5 block">Practica libremente</span>
                        </div>
                    </div>

                    {/* Right Ship - Programming Station */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <button onClick={onGoToProgramming}
                            className="group relative active:scale-90 transition-transform duration-200 focus:outline-none"
                            style={{ animation: 'ship-fly 7s ease-in-out infinite 0.8s' }}>
                            {/* Outer glow ring */}
                            <div className="absolute inset-[-16px] rounded-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(167,139,250,0.1) 40%, transparent 70%)', filter: 'blur(8px)' }}></div>
                            {/* Ship image */}
                            <img src="/programacion.png" alt="Estación de Programación"
                                className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                                style={{ filter: 'drop-shadow(0 0 18px rgba(167,139,250,0.6)) drop-shadow(0 0 40px rgba(167,139,250,0.3))' }} />
                            {/* Thruster glow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-5 rounded-full bg-[#A78BFA]/50 blur-lg z-0" style={{ animation: 'twinkle 1.8s ease-in-out infinite 0.3s' }}></div>
                            {/* Sparkles around ship */}
                            <div className="absolute top-0 left-0 w-2 h-2 bg-[#A78BFA]/70 rounded-full" style={{ animation: 'twinkle 2.5s ease-in-out infinite 0.3s' }}></div>
                            <div className="absolute bottom-4 right-0 w-1.5 h-1.5 bg-white/50 rounded-full" style={{ animation: 'twinkle 3s ease-in-out infinite 1s' }}></div>
                            <div className="absolute top-6 right-1 w-1 h-1 bg-[#A78BFA]/50 rounded-full" style={{ animation: 'twinkle 2s ease-in-out infinite 0.7s' }}></div>
                        </button>
                        {/* Info below */}
                        <div className="text-center mt-1">
                            <h3 className="text-xs font-black text-[#A78BFA] leading-tight">Estación de</h3>
                            <h3 className="text-xs font-black text-[#A78BFA] leading-tight">Programación</h3>
                            <span className="text-[9px] font-bold text-purple-200/50 mt-0.5 block">Tutoriales y retos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* World Planets */}
            <div className="px-4 max-w-xl mx-auto space-y-10 pb-8 relative z-10">
                {WORLDS_CONFIG.map((world, idx) => {
                    const unlocked = isWorldUnlocked(userScores, idx, firebaseProfile);
                    const completedCount = world.modules.filter(m => isModuleCompleted(userScores, m.id)).length;
                    const totalCount = world.modules.length;
                    const progress = Math.round((completedCount / totalCount) * 100);
                    const isComplete = completedCount === totalCount;
                    const glowColors = ['rgba(59,130,246,0.5)', 'rgba(245,158,11,0.5)', 'rgba(16,185,129,0.5)', 'rgba(99,102,241,0.5)'];
                    const glowColor = glowColors[idx] || glowColors[0];

                    return (
                        <div key={world.id} className="animate-fade-in flex flex-col items-center" style={{ animationDelay: `${idx * 200}ms` }}>
                            {/* Connector line between planets */}
                            {idx > 0 && (
                                <div className="flex justify-center -mt-6 mb-4">
                                    <div className="w-0.5 h-10 bg-gradient-to-b from-purple-400/50 via-purple-300/20 to-transparent rounded-full shadow-[0_0_8px_rgba(168,85,247,0.3)]"></div>
                                </div>
                            )}

                            {/* Floating Planet Image */}
                            <button
                                onClick={() => unlocked && onSelectWorld(idx)}
                                disabled={!unlocked}
                                className={`relative group focus:outline-none transition-all duration-500 ${
                                    unlocked ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-not-allowed'
                                }`}
                                style={{ animation: unlocked ? `float-planet ${5 + idx * 1.5}s ease-in-out infinite` : 'none' }}
                            >
                                {/* Glow ring behind planet */}
                                {unlocked && (
                                    <div className="absolute inset-[-12px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                                            filter: 'blur(10px)',
                                        }}
                                    ></div>
                                )}

                                {/* Orbit ring */}
                                {unlocked && (
                                    <div className="absolute inset-[-16px] rounded-full border border-white/10 pointer-events-none"
                                        style={{ animation: 'orbit-ring 20s linear infinite' }}>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]"></div>
                                    </div>
                                )}

                                {/* Planet image */}
                                <img
                                    src={world.worldImage}
                                    alt={world.name}
                                    className={`w-44 h-44 sm:w-56 sm:h-56 object-contain relative z-10 drop-shadow-[0_0_25px_${glowColor}] transition-all duration-500 ${
                                        !unlocked ? 'grayscale opacity-40 brightness-50' : 'group-hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]'
                                    }`}
                                    style={unlocked ? { filter: `drop-shadow(0 0 20px ${glowColor})` } : { filter: 'grayscale(1) brightness(0.4)' }}
                                />

                                {/* Lock overlay */}
                                {!unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                                            <span className="text-2xl">🔒</span>
                                        </div>
                                    </div>
                                )}

                                {/* Star badge for completed worlds */}
                                {isComplete && (
                                    <div className="absolute -top-2 -right-2 z-20 animate-bounce-in">
                                        <div className="w-10 h-10 bg-[#FFC800] rounded-full flex items-center justify-center border-2 border-[#E5B800] shadow-[0_0_15px_rgba(255,200,0,0.5)]">
                                            <span className="text-lg">⭐</span>
                                        </div>
                                    </div>
                                )}
                            </button>

                            {/* World Details Below Image */}
                            <div className={`mt-4 text-center max-w-xs transition-all duration-500 ${!unlocked ? 'opacity-50' : ''}`}>
                                <span className="text-[10px] font-black text-purple-300/70 uppercase tracking-widest">Mundo {idx + 1}</span>
                                <h2 className="text-xl font-black text-white mt-0.5 drop-shadow-lg">
                                    {world.name}
                                    {isComplete && <span className="ml-2 text-sm animate-pulse">✨</span>}
                                </h2>
                                <p className="text-xs text-purple-200/70 font-semibold mt-1 leading-relaxed">{world.description}</p>

                                {/* Progress bar */}
                                {unlocked && (
                                    <div className="mt-3 px-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black text-purple-200/80">
                                                {completedCount}/{totalCount} módulos
                                            </span>
                                            <span className="text-[10px] font-black text-purple-200/80">{progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-[#FFC800]' : 'bg-white/80'}`}
                                                style={{ width: `${Math.max(progress, 3)}%` }}>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Lock message */}
                                {!unlocked && (
                                    <div className="mt-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
                                        <p className="text-[10px] text-purple-300/60 font-bold">
                                            {world.unlockType === 'friends'
                                                ? `🔒 Agrega ${world.unlockRequirement} amigos para desbloquear (${firebaseProfile?.friendsCount || 0}/${world.unlockRequirement})`
                                                : `🔒 Completa "${WORLDS_CONFIG[idx - 1]?.name}"`
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Future worlds teaser */}
                <div className="flex flex-col items-center py-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-purple-400/30 to-transparent rounded-full mb-4"></div>
                    <div className="inline-flex flex-col items-center gap-2 opacity-50">
                        <div className="w-16 h-16 bg-purple-500/15 rounded-full flex items-center justify-center text-3xl border-2 border-dashed border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]" style={{animation: 'float-planet 6s ease-in-out infinite'}}>
                            🚀
                        </div>
                        <span className="text-xs font-black text-purple-300/60">¡Más mundos próximamente!</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- TTS helper ---
const speakText = (text, lang = 'es-MX') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es')) || null;
    if (esVoice) utterance.voice = esVoice;
    window.speechSynthesis.speak(utterance);
};

// --- Robot companion phrases by context ---
const ROBOT_COMPANION_PHRASES = {
    start: [
        '¡Vamos a aprender juntos! 🚀',
        '¡Hoy va a ser un gran día de aprendizaje! ✨',
        '¡Estoy listo para explorar contigo! 🤖',
    ],
    progress: [
        '¡Vas muy bien! ¡Sigue así! 💪',
        '¡Cada módulo te hace más fuerte! ⚡',
        '¡Estoy orgulloso de tu progreso! 🌟',
        '¡No te detengas, falta poco! 🔥',
    ],
    challenge: [
        '¡Un reto! ¿Te atreves? Los retos te hacen mejor programador 🧩',
        '¡Hora de poner a prueba lo aprendido! 💻',
        '¡Este reto será pan comido para ti! 😎',
    ],
    circuit: [
        '¡Hora de construir un circuito! ¡Manos a la obra! ⚡',
        '¡Los circuitos son mi parte favorita! 🔌',
    ],
    glossary: [
        '¡Nuevo término! Leerlo te ayudará mucho 📖',
        '¡Aprende este concepto, te será muy útil! 🧠',
        '¡Toca el 🔊 para que te lo lea en voz alta!',
    ],
    locked: [
        '¡Completa el módulo anterior para desbloquear esto! 🔒',
        '¡Paso a paso! Primero termina lo de arriba 📚',
    ],
    complete: [
        '¡INCREÍBLE! ¡Completaste todo! ¡Eres un genio! 🏆',
        '¡WOW! ¡Dominaste esta sección! 🎉',
    ],
};
const getCompanionPhrase = (context, seed = 0) => {
    const phrases = ROBOT_COMPANION_PHRASES[context] || ROBOT_COMPANION_PHRASES.progress;
    return phrases[seed % phrases.length];
};

// --- Robot Companion Bubble ---
const RobotCompanionBubble = ({ robotConfig, phrase, side = 'left' }) => (
    <div className="relative z-10 w-full flex justify-center my-1">
        <div className={`flex items-end gap-2 max-w-[310px] w-full ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0 animate-bounce-in">
                <RobotMini config={robotConfig} size={38} />
            </div>
            <div className={`relative bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] rounded-2xl px-3.5 py-2.5 border border-[#C7D2FE] shadow-sm max-w-[250px] ${side === 'right' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                <p className="text-[11px] font-bold text-[#4338CA] leading-snug">{phrase}</p>
                <div className={`absolute bottom-2 ${side === 'right' ? '-right-1.5' : '-left-1.5'} w-3 h-3 bg-[#E0E7FF] border border-[#C7D2FE] rotate-45`}></div>
            </div>
        </div>
    </div>
);

// --- Inline bonus node components for organic world integration ---
const InlineGlossaryTerm = ({ term, isLocked }) => {
    const [open, setOpen] = React.useState(false);
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    const handleSpeak = (e) => {
        e.stopPropagation();
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        setIsSpeaking(true);
        const fullText = `${term.term}. ${term.definition}. ${term.example ? 'Por ejemplo: ' + term.example : ''}`;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'es-MX';
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.startsWith('es')) || null;
        if (esVoice) utterance.voice = esVoice;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    if (isLocked) {
        return (
            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-[300px] bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] p-3.5 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E5E5E5] rounded-xl flex items-center justify-center text-xl flex-shrink-0">🔒</div>
                        <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-black text-[#AFAFAF] uppercase tracking-wider">📖 Término</span>
                            <h3 className="text-[13px] font-black text-[#AFAFAF] truncate">???</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10 w-full flex justify-center">
            <div onClick={() => setOpen(!open)} 
                className={`w-full max-w-[300px] bg-white rounded-2xl border-2 ${open ? 'border-[#10B981] shadow-md' : 'border-[#10B981]/20'} p-3.5 cursor-pointer transition-all active:scale-[0.98] group`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">{term.emoji}</div>
                    <div className="flex-grow min-w-0">
                        <span className="text-[9px] font-black text-[#10B981] uppercase tracking-wider">📖 Término</span>
                        <h3 className="text-[13px] font-black text-[#3C3C3C] truncate">{term.term}</h3>
                    </div>
                    <button onClick={handleSpeak} className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isSpeaking ? 'bg-[#10B981] text-white scale-110' : 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'}`} title="Escuchar">
                        {isSpeaking ? '🔊' : '🔈'}
                    </button>
                    <ChevronDown size={14} className={`text-[#10B981] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
                </div>
                {open && (
                    <div className="mt-3 pt-3 border-t border-[#10B981]/15 animate-fade-in">
                        <p className="text-[11px] text-[#555] leading-relaxed font-medium">{term.definition}</p>
                        {term.example && <p className="text-[10px] text-[#888] mt-2 italic bg-[#F0FDF4] p-2 rounded-lg">💡 {term.example}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

const InlineChallengeNode = ({ challenge, onStart, isCompleted, isLocked }) => {
    const langColors = { 'Python': '#3776AB', 'Arduino': '#00979D', 'C++': '#659AD2' };
    const bgColor = isCompleted ? '#58CC02' : (langColors[challenge.name] || '#FF4B4B');

    if (isLocked) {
        return (
            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-[300px] bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] p-3.5 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E5E5E5] rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔒</div>
                        <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-black text-[#AFAFAF] uppercase tracking-wider">🧩 Reto de código</span>
                            <h3 className="text-[13px] font-black text-[#AFAFAF] truncate">{challenge.title}</h3>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl text-[10px] font-black text-white bg-[#CDCDCD]">🔒</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10 w-full flex justify-center">
            <div onClick={() => onStart(challenge.id)} 
                className={`w-full max-w-[300px] bg-white rounded-2xl border-2 p-3.5 cursor-pointer transition-all active:scale-[0.97] group ${isCompleted ? 'border-[#58CC02]/40' : 'border-[#FF4B4B]/20 hover:border-[#FF4B4B] hover:shadow-md'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border-b-2 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: bgColor, borderColor: bgColor + 'CC' }}>
                        <span className="text-white text-sm">{isCompleted ? '✓' : challenge.icon}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                        <span className="text-[9px] font-black text-[#FF4B4B] uppercase tracking-wider">🧩 Reto de código</span>
                        <h3 className="text-[13px] font-black text-[#3C3C3C] truncate">{challenge.title}</h3>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black text-white ${isCompleted ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}`}>
                        {isCompleted ? '✓ Hecho' : '¡IR!'}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InlineCircuitNode = ({ circuitId, title, difficulty, onStart, isLocked }) => {
    if (isLocked) {
        return (
            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-[300px] bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] p-3.5 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E5E5E5] rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔒</div>
                        <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-black text-[#AFAFAF] uppercase tracking-wider">⚡ Circuito</span>
                            <h3 className="text-[13px] font-black text-[#AFAFAF] truncate">{title}</h3>
                            <span className="text-[10px] font-bold text-[#CDCDCD]">{difficulty}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl text-[10px] font-black text-white bg-[#CDCDCD]">🔒</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10 w-full flex justify-center">
            <div onClick={() => onStart(circuitId)} 
                className="w-full max-w-[300px] bg-white rounded-2xl border-2 border-[#2563EB]/20 hover:border-[#2563EB] hover:shadow-md p-3.5 cursor-pointer transition-all active:scale-[0.97] group">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center text-lg flex-shrink-0 border-b-2 border-[#1E40AF] group-hover:scale-110 transition-transform">
                        <span className="text-white text-sm">⚡</span>
                    </div>
                    <div className="flex-grow min-w-0">
                        <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-wider">⚡ Circuito</span>
                        <h3 className="text-[13px] font-black text-[#3C3C3C] truncate">{title}</h3>
                        <span className="text-[10px] font-bold text-[#AFAFAF]">{difficulty}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl text-[10px] font-black text-white bg-[#2563EB]">
                        ¡IR!
                    </div>
                </div>
            </div>
        </div>
    );
};

const LibraryScreen = ({ startLesson, userId, userScores, onShowAchievements, onShowLicenses, userStats, userProfile, onLogout, firebaseProfile, onEditRobot, currentWorld, onBackToWorlds, startChallenge, onGoToCircuitChallenge }) => {
    const world = WORLDS_CONFIG[currentWorld] || WORLDS_CONFIG[0];
    const worldModules = world.modules;
    const worldSections = world.sections;
    const totalModules = worldModules.length;
    const completedModulesCount = worldModules.filter(m => isModuleCompleted(userScores, m.id)).length;
    const overallProgress = Math.round((completedModulesCount / totalModules) * 100);

    // Get world-specific challenges
    const worldChallenges = (world.challengeIds || []).map(id => CODE_CHALLENGES.find(c => c.id === id)).filter(Boolean);
    const completedChallengeIds = Object.keys(userScores || {}).filter(k => k.startsWith('challenge_') && userScores[k]?.completed);

    // Circuit challenges info
    const worldCircuitIds = world.circuitIds || [];
    const circuitDifficultyLabels = { 1: 'Fácil', 2: 'Fácil', 3: 'Medio', 4: 'Medio', 5: 'Difícil', 6: 'Difícil', 7: 'Experto', 8: 'Libre' };
    const circuitTitles = { 1: 'Mi Primer Circuito', 2: 'Protege tu LED', 3: 'Control con Interruptor', 4: 'Semáforo Simple', 5: 'Motor en Acción', 6: 'Alarma Sonora', 7: 'Arduino LED', 8: 'Modo Libre' };

    // Glossary terms for this world
    const worldGlossaryTerms = (world.glossaryTermIds || []).map(id => GLOSSARY_TERMS_DATA.find(t => t.id === id)).filter(Boolean);

    // Distribute bonus items evenly across sections for organic integration
    const sectionBonusMap = (() => {
        const numSections = worldSections.length;
        const map = worldSections.map(() => ({ challenges: [], circuits: [], glossaryTerms: [] }));
        worldChallenges.forEach((c, i) => { map[i % numSections].challenges.push(c); });
        worldCircuitIds.forEach((cId, i) => { map[Math.min(1 + Math.floor((i / Math.max(worldCircuitIds.length, 1)) * (numSections - 1)), numSections - 1)].circuits.push(cId); });
        worldGlossaryTerms.forEach((t, i) => { map[i % numSections].glossaryTerms.push(t); });
        return map;
    })();

    return (
    <div className={`pb-24 min-h-full w-full relative ${world.bgClass || 'bg-[#F7F7F7]'}`}>
        {/* Pixel-art themed emoji decorations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {(world.bgPattern || '').split('').filter(c => c.trim()).slice(0, 6).map((emoji, i) => (
                <div key={i} className="absolute" style={{
                    left: `${5 + (i * 18) % 90}%`,
                    top: `${15 + (i * 23) % 70}%`,
                    opacity: 0.05,
                    fontSize: `${28 + (i % 3) * 12}px`,
                    transform: `rotate(${i * 30 - 45}deg)`,
                    imageRendering: 'pixelated'
                }}>{emoji}</div>
            ))}
        </div>
        {/* Modern Top Bar */}
        <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-2xl border-b border-gray-200/60 px-4 py-2.5">
            <div className="flex items-center justify-between max-w-xl mx-auto">
                <div className="flex items-center gap-2.5">
                    <button onClick={onBackToWorlds} className="flex items-center bg-gray-100/80 p-2 rounded-xl hover:bg-gray-200 transition active:scale-95" title="Volver al mapa">
                        <ArrowLeft size={16} className="text-[#3C3C3C]" />
                    </button>
                    {userProfile && (
                      <button onClick={onEditRobot} className="active:scale-90 transition-transform hover:ring-2 hover:ring-[#2563EB]/30 rounded-2xl p-0.5 bg-[#2563EB]/5 border border-[#2563EB]/10" title="Personalizar robot">
                        <RobotMini config={userProfile.robotConfig} size={34} />
                      </button>
                    )}
                    <div className="flex items-center gap-1 bg-[#3B82F6]/8 px-2.5 py-1.5 rounded-xl border border-[#3B82F6]/10" title="Racha diaria">
                        <Zap size={14} className="text-[#3B82F6]" />
                        <span className="text-xs font-black text-[#3B82F6]">{firebaseProfile?.currentStreak || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFC800]/8 px-2.5 py-1.5 rounded-xl border border-[#FFC800]/15">
                        <Star size={14} className="text-[#FFC800]" />
                        <span className="text-xs font-black text-[#D4A500]">{(firebaseProfile?.totalPoints ?? userStats?.totalPoints ?? 0).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onShowLicenses} className="flex items-center bg-[#2563EB]/8 p-2 rounded-xl hover:bg-[#2563EB]/15 transition active:scale-95 border border-[#2563EB]/10" title="Mis Licencias">
                        <GraduationCap size={16} className="text-[#2563EB]" />
                    </button>
                    {onLogout && (
                        <button onClick={onLogout} className="flex items-center bg-red-50 p-2 rounded-xl hover:bg-red-100 transition active:scale-95 border border-red-100" title="Cerrar sesión">
                            <Settings size={14} className="text-red-400" />
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* World-themed Hero Section */}
        <div className={`bg-gradient-to-br ${world.bgGradient} px-5 pt-5 pb-6 border-b-2 border-gray-100 relative overflow-hidden`}>
            {/* Background decoration */}
            <div className="absolute right-0 top-0 text-8xl opacity-10 text-white transform translate-x-8 -translate-y-4">{world.emoji}</div>
            <div className="absolute left-0 bottom-0 text-6xl opacity-10 text-white transform -translate-x-4 translate-y-4">{world.emoji}</div>
            <div className="max-w-xl mx-auto relative z-10">
                {userProfile && (
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-black text-white/90">¡Hola, {userProfile.userName}!</p>
                        <span className="animate-bounce-in inline-block">👋</span>
                    </div>
                )}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">Mundo {currentWorld + 1}</span>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            {world.emoji} {world.name}
                        </h2>
                        <p className="text-xs text-white/70 font-bold mt-0.5">
                            {completedModulesCount === 0 
                                ? '¡Empieza tu aventura! 🌟' 
                                : completedModulesCount === totalModules 
                                    ? '¡FELICIDADES! ¡Mundo completado! 🏆' 
                                    : `${totalModules - completedModulesCount} módulos por conquistar`
                            }
                        </p>
                    </div>
                    <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" 
                                stroke={overallProgress === 100 ? '#FFC800' : 'rgba(255,255,255,0.9)'} 
                                strokeWidth="3" 
                                strokeDasharray={`${overallProgress * 0.942} 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {overallProgress === 100 
                                ? <span className="text-lg animate-pulse-soft">⭐</span>
                                : <span className="text-sm font-black text-white">{overallProgress}%</span>
                            }
                        </div>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="relative">
                    <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 relative ${overallProgress === 100 ? 'bg-[#FFC800]' : 'bg-white/90'}`}
                            style={{ width: `${Math.max(overallProgress, 3)}%` }}>
                            {overallProgress > 0 && overallProgress < 100 && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md animate-pulse"></div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div className="flex flex-col items-center"><span className={`text-sm ${overallProgress >= 0 ? 'grayscale-0' : 'grayscale opacity-50'}`}>🌱</span><span className="text-[9px] font-bold text-white/50">Inicio</span></div>
                        <div className="flex flex-col items-center"><span className={`text-sm ${overallProgress >= 25 ? 'grayscale-0' : 'grayscale opacity-50'}`}>⚡</span><span className="text-[9px] font-bold text-white/50">25%</span></div>
                        <div className="flex flex-col items-center"><span className={`text-sm ${overallProgress >= 50 ? 'grayscale-0' : 'grayscale opacity-50'}`}>🔧</span><span className="text-[9px] font-bold text-white/50">50%</span></div>
                        <div className="flex flex-col items-center"><span className={`text-sm ${overallProgress >= 75 ? 'grayscale-0' : 'grayscale opacity-50'}`}>🚀</span><span className="text-[9px] font-bold text-white/50">75%</span></div>
                        <div className="flex flex-col items-center"><span className={`text-sm ${overallProgress >= 100 ? 'grayscale-0 animate-bounce-in' : 'grayscale opacity-50'}`}>🏆</span><span className="text-[9px] font-bold text-white/50">Experto</span></div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Path-based Module Layout */}
        <div className="px-4 w-full max-w-xl mx-auto py-5 space-y-4">
            {worldSections.map((section, sIdx) => {
                const nextSection = worldSections[sIdx + 1];
                const endIdx = nextSection ? nextSection.startIdx : worldModules.length;
                const sectionModules = worldModules.slice(section.startIdx, endIdx);

                // Get bonus items for this section
                const bonus = sectionBonusMap[sIdx] || { challenges: [], circuits: [], glossaryTerms: [] };
                const bonusItems = [
                    ...bonus.glossaryTerms.map((t, i) => ({ type: 'glossary', data: t, key: `g_${sIdx}_${i}` })),
                    ...bonus.challenges.map((c, i) => ({ type: 'challenge', data: c, key: `ch_${sIdx}_${i}` })),
                    ...bonus.circuits.map((cId, i) => ({ type: 'circuit', data: cId, key: `ci_${sIdx}_${i}` })),
                ];

                // Build interleaved timeline: modules with bonus items woven in
                const timeline = [];
                const step = bonusItems.length > 0 ? Math.max(1, Math.ceil(sectionModules.length / (bonusItems.length + 1))) : sectionModules.length + 1;
                let bIdx = 0;
                sectionModules.forEach((mod, i) => {
                    timeline.push({ type: 'module', data: mod, globalIdx: section.startIdx + i });
                    if (bIdx < bonusItems.length && ((i + 1) % step === 0 || i === sectionModules.length - 1)) {
                        timeline.push(bonusItems[bIdx]);
                        bIdx++;
                        if (i === sectionModules.length - 1) {
                            while (bIdx < bonusItems.length) {
                                timeline.push(bonusItems[bIdx]);
                                bIdx++;
                            }
                        }
                    }
                });

                // Determine the "frontier" — the first module that is unlocked but not completed (robot position)
                const sectionCompletedCount = sectionModules.filter(m => isModuleCompleted(userScores, m.id)).length;
                const allSectionCompleted = sectionCompletedCount === sectionModules.length;

                // Find the robot position: last completed item index in timeline
                let robotTimelineIdx = -1;
                for (let ti = timeline.length - 1; ti >= 0; ti--) {
                    if (timeline[ti].type === 'module' && isModuleCompleted(userScores, timeline[ti].data.id)) {
                        robotTimelineIdx = ti;
                        break;
                    }
                }
                // If no module completed yet in this section, robot is at the very start
                const showRobotAtStart = robotTimelineIdx === -1 && sIdx === 0;

                return (
                    <div key={sIdx} className="animate-fade-in" style={{ animationDelay: `${sIdx * 100}ms` }}>
                        <SectionBanner section={section} modulesInSection={sectionModules} userScores={userScores} sectionIndex={sIdx} allModules={worldModules} />
                        
                        <div className="flex flex-col gap-3 items-center py-4 relative">
                            {timeline.length > 1 && (
                                <div className="absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 z-0"
                                    style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${section.color}30 0, ${section.color}30 6px, transparent 6px, transparent 12px)` }}>
                                </div>
                            )}

                            {/* Robot at the very start of world */}
                            {showRobotAtStart && userProfile?.robotConfig && (
                                <RobotCompanionBubble 
                                    robotConfig={userProfile.robotConfig}
                                    phrase={getCompanionPhrase('start', currentWorld)}
                                    side="left"
                                />
                            )}
                            
                            {timeline.map((item, tIdx) => {
                                // Determine if this bonus item is locked
                                // A bonus item is unlocked if the module before it in the timeline is completed
                                let itemLocked = false;
                                if (item.type !== 'module') {
                                    // Find the nearest preceding module in the timeline
                                    let prevModuleCompleted = false;
                                    for (let pi = tIdx - 1; pi >= 0; pi--) {
                                        if (timeline[pi].type === 'module') {
                                            prevModuleCompleted = isModuleCompleted(userScores, timeline[pi].data.id);
                                            break;
                                        }
                                    }
                                    itemLocked = !prevModuleCompleted;
                                }

                                // Robot companion appears right after the last completed module
                                const showRobotHere = tIdx === robotTimelineIdx && !showRobotAtStart && userProfile?.robotConfig;

                                const contextType = item.type === 'challenge' ? 'challenge' : item.type === 'circuit' ? 'circuit' : item.type === 'glossary' ? 'glossary' : 'progress';
                                const robotPhrase = itemLocked 
                                    ? getCompanionPhrase('locked', tIdx) 
                                    : allSectionCompleted 
                                        ? getCompanionPhrase('complete', sIdx) 
                                        : getCompanionPhrase(contextType, tIdx + sIdx);

                                return (
                                    <React.Fragment key={item.key || item.data?.id || tIdx}>
                                        {item.type === 'module' && (
                                            <div className="relative z-10 w-full flex justify-center"
                                                style={{ animationDelay: `${(sIdx * 3 + tIdx) * 60}ms` }}>
                                                <ModuleCard 
                                                    module={item.data} 
                                                    onStart={startLesson} 
                                                    userScores={userScores}
                                                    index={item.globalIdx}
                                                    totalModules={totalModules}
                                                    sectionColor={section.color}
                                                    allModules={worldModules}
                                                />
                                            </div>
                                        )}
                                        {item.type === 'challenge' && (
                                            <InlineChallengeNode 
                                                challenge={item.data}
                                                onStart={startChallenge}
                                                isCompleted={completedChallengeIds.includes('challenge_' + item.data.id)}
                                                isLocked={itemLocked}
                                            />
                                        )}
                                        {item.type === 'circuit' && (
                                            <InlineCircuitNode 
                                                circuitId={item.data}
                                                title={circuitTitles[item.data] || `Circuito ${item.data}`}
                                                difficulty={circuitDifficultyLabels[item.data] || ''}
                                                onStart={onGoToCircuitChallenge}
                                                isLocked={itemLocked}
                                            />
                                        )}
                                        {item.type === 'glossary' && (
                                            <InlineGlossaryTerm term={item.data} isLocked={itemLocked} />
                                        )}
                                        {/* Robot companion after current position */}
                                        {showRobotHere && (
                                            <RobotCompanionBubble 
                                                robotConfig={userProfile.robotConfig}
                                                phrase={robotPhrase}
                                                side={tIdx % 2 === 0 ? 'left' : 'right'}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {/* Robot at end of fully completed section */}
                            {allSectionCompleted && !showRobotAtStart && userProfile?.robotConfig && (
                                <RobotCompanionBubble 
                                    robotConfig={userProfile.robotConfig}
                                    phrase={getCompanionPhrase('complete', sIdx)}
                                    side="right"
                                />
                            )}
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
const ChallengeView = ({ currentChallengeId, startChallenge, goToMenu, userScores, setUserScores, setUserStats, setUnlockedPopupAchievement, userId, userStats }) => {
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
            const scoreData = { completed: true, score: 1, total: 1 };
            if (setUserScores) {
                setUserScores(prev => {
                    const newScores = { ...prev, [scoreKey]: scoreData };
                    persistUserScores(newScores);
                    return newScores;
                });
            }
            // Save to Firebase
            if (userId) {
                saveModuleScore(userId, scoreKey, scoreData).catch(console.error);
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
                // Sync stats to Firebase
                if (userId) {
                    syncUserStats(userId, {
                        addChallengesCompleted: 1,
                        addPoints: xpEarned,
                        newTotalPoints: (userStats?.totalPoints || 0) + xpEarned,
                    }).catch(console.error);
                }
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
        { id: 'Glosario', icon: BookOpen, label: 'Glosario' },
        { id: 'Simulador', icon: Bot, label: 'Robot' },
        { id: 'Biblioteca', icon: Map, label: 'Explorar', isCenter: true },
        { id: 'Logros', icon: Trophy, label: 'Logros', isAchievements: true },
        { id: 'Ranking', icon: Target, label: 'Ranking', isRanking: true },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-2" style={{ paddingBottom: 'calc(var(--sab, 0px) + 8px)' }}>
            <div className="max-w-md mx-auto">
                <div className="nav-dock flex items-end justify-around rounded-2xl py-1">
                    {tabs.map(tab => {
                        const isActive = tab.isAchievements
                            ? currentTab === 'Logros'
                            : tab.isRanking
                                ? currentTab === 'Ranking'
                                : currentTab === tab.id;
                        const Icon = tab.icon;
                        
                        if (tab.isCenter) {
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { onSelectTab(tab.id); setViewMode('menu'); }}
                                    className="relative -mt-5 group"
                                >
                                    <div className={`w-[56px] h-[56px] rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
                                        ${isActive 
                                            ? 'bg-gradient-to-br from-[#2563EB] to-[#7C3AED] shadow-[#2563EB]/40 scale-105' 
                                            : 'bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-[#3B82F6]/25 group-hover:scale-105 group-active:scale-95'}`}>
                                        <Icon size={26} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-[#2563EB] rounded-full" />
                                    )}
                                    <span className={`block text-[9px] font-extrabold mt-1 text-center transition-colors duration-200 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}>{tab.label}</span>
                                </button>
                            );
                        }

                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (tab.isAchievements) {
                                        setViewMode('achievements');
                                    } else if (tab.isRanking) {
                                        setViewMode('ranking');
                                    } else {
                                        onSelectTab(tab.id);
                                        setViewMode('menu');
                                    }
                                }}
                                className="flex flex-col items-center justify-center py-2 px-1 flex-1 transition-all duration-200 group active:scale-90 relative"
                            >
                                <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#2563EB]/10' : 'group-hover:bg-gray-100'}`}>
                                    <Icon size={22} className={`transition-colors duration-200 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2563EB] rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <span className={`text-[9px] font-extrabold leading-tight mt-0.5 transition-colors duration-200 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}>{tab.label}</span>
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
    const [currentWorldIndex, setCurrentWorldIndex] = useState(null); // null = world map, number = inside that world
    const [circuitInitialId, setCircuitInitialId] = useState(null); // for opening circuit builder on specific challenge
    
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
        const moduleData = ALL_MODULES.find(m => m.id === moduleId) || MODULOS_DE_ROBOTICA.find(m => m.id === moduleId);
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
        // Find module across ALL worlds
        const currentWorldModules = currentWorldIndex !== null ? WORLDS_CONFIG[currentWorldIndex].modules : ALL_MODULES;
        const moduleIdx = currentWorldModules.findIndex(m => m.id === moduleId);
        if (moduleIdx > 0 && !isModuleUnlocked(userScores, moduleIdx, currentWorldModules)) {
            const prevModule = currentWorldModules[moduleIdx - 1];
            const prevName = prevModule?.titulo || 'el módulo anterior';
            alert(`🔒 Este módulo está bloqueado.\n\nPrimero completa: "${prevName}"`);
            return;
        }
        
        setCurrentModuleId(moduleId);
        const moduleData = currentWorldModules.find(m => m.id === moduleId) || ALL_MODULES.find(m => m.id === moduleId);
        
        // --- LÓGICA DE VISTAS ESPECIALES ACTUALIZADA ---
        if (moduleData?.specialView === 'Module1View') {
            setViewMode('module1_view');
        } else if (moduleData?.specialView === 'InteractiveLEDGuide') {
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
    const currentModule = ALL_MODULES.find(m => m.id === currentModuleId) || MODULOS_DE_ROBOTICA.find(m => m.id === currentModuleId);
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
                            userId={userId}
                            userStats={userStats}
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
                            onBack={() => goToMenu('Biblioteca')}
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
                if (currentWorldIndex === null) {
                    // Show World Map
                    ScreenContent = <WorldMapScreen 
                        userScores={userScores}
                        onSelectWorld={(idx) => setCurrentWorldIndex(idx)}
                        userProfile={userProfile}
                        firebaseProfile={firebaseProfile}
                        onShowAchievements={() => setViewMode('achievements')}
                        onShowLicenses={() => setViewMode('licenses')}
                        onLogout={handleLogout}
                        onEditRobot={() => setShowRobotEditor(true)}
                        userStats={userStats}
                        onGoToCircuits={() => setCurrentTab('CircuitLab')}
                        onGoToProgramming={() => setCurrentTab('ProgrammingStation')}
                    />;
                } else {
                    // Show Library for selected world
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
                        currentWorld={currentWorldIndex}
                        onBackToWorlds={() => setCurrentWorldIndex(null)}
                        startChallenge={startChallenge}
                        onGoToCircuitChallenge={(circuitId) => { setCircuitInitialId(circuitId); setCurrentTab('Circuitos'); setViewMode('menu'); }}
                    />;
                }
                break;
            case 'Taller':
                ScreenContent = <WorkshopScreen goToMenu={goToMenu} />; // <-- El taller de código
                break;
            case 'Simulador':
                ScreenContent = <RobotSimulator onBack={() => goToMenu('Biblioteca')} />;
                break;
            case 'Circuitos':
                ScreenContent = <CircuitBuilder onBack={() => { setCircuitInitialId(null); goToMenu('Biblioteca'); }} initialChallengeId={circuitInitialId} />;
                break;
            case 'Glosario':
                ScreenContent = <GlossaryScreen robotConfig={userProfile?.robotConfig} robotName={userProfile?.robotName} />;
                break;
            case 'Clases':
                ScreenContent = <ClassroomScreen />;
                break;
            case 'ProgrammingStation':
                ScreenContent = <ProgrammingStationScreen 
                    onBack={() => { setCurrentTab('Biblioteca'); setCurrentWorldIndex(null); }}
                    startChallenge={startChallenge}
                    userScores={userScores}
                    userId={userId}
                    userStats={userStats}
                    setUserStats={setUserStats}
                    onAwardXp={(xp, source) => {
                        setUserStats(prev => ({ ...prev, totalPoints: (prev.totalPoints || 0) + xp, [`${source}Count`]: (prev[`${source}Count`] || 0) + 1 }));
                        if (userId) syncUserStats(userId, { addPoints: xp, newTotalPoints: (userStats?.totalPoints || 0) + xp }).catch(console.error);
                    }}
                />;
                break;
            case 'CircuitLab':
                ScreenContent = <CircuitLabScreen 
                    onBack={() => { setCurrentTab('Biblioteca'); setCurrentWorldIndex(null); }}
                    onOpenFreeCircuitBuilder={() => { setCircuitInitialId(null); setCurrentTab('Circuitos'); }}
                    userId={userId}
                    userStats={userStats}
                    setUserStats={setUserStats}
                    onAwardXp={(xp, source) => {
                        setUserStats(prev => ({ ...prev, totalPoints: (prev.totalPoints || 0) + xp, [`${source}Count`]: (prev[`${source}Count`] || 0) + 1 }));
                        if (userId) syncUserStats(userId, { addPoints: xp, newTotalPoints: (userStats?.totalPoints || 0) + xp }).catch(console.error);
                    }}
                />;
                break;
            default:
                ScreenContent = <WorldMapScreen 
                    userScores={userScores}
                    onSelectWorld={(idx) => setCurrentWorldIndex(idx)}
                    userProfile={userProfile}
                    firebaseProfile={firebaseProfile}
                    onShowAchievements={() => setViewMode('achievements')}
                    onShowLicenses={() => setViewMode('licenses')}
                    onLogout={handleLogout}
                    onEditRobot={() => setShowRobotEditor(true)}
                    userStats={userStats}
                    onGoToCircuits={() => setCurrentTab('CircuitLab')}
                    onGoToProgramming={() => setCurrentTab('ProgrammingStation')}
                />; 
        }
    }


    return (
        <div className="font-sans min-h-screen bg-[#F8FAFC] w-full">
            <div className="w-full min-h-screen">
                <div className="min-h-screen overflow-y-auto pb-24 animate-fade-in"> 
                    {ScreenContent}
                </div>
                <BottomNavBar 
                    currentTab={viewMode === 'achievements' ? 'Logros' : viewMode === 'ranking' ? 'Ranking' : currentTab} 
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