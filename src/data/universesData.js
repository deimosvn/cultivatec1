// ==========================================================
// UNIVERSES CONFIGURATION
// ==========================================================
// Los 6 planetas (mundos) actuales se mueven al Universo 2 (Secundaria).
// Cada universo usa un agujero negro animado como portal de entrada,
// con diferente color de estela/glow.

import { MODULOS_DATA, CODE_CHALLENGES_DATA } from './modulesData';
import { WORLD_2_MODULES, WORLD_2_SECTIONS } from './world2Data';
import { WORLD_3_MODULES, WORLD_3_SECTIONS } from './world3Data';
import { WORLD_4_MODULES, WORLD_4_SECTIONS } from './world4Data';
import { WORLD_5_MODULES, WORLD_5_SECTIONS } from './world5Data';
import { WORLD_6_MODULES, WORLD_6_SECTIONS } from './world6Data';

// ---- Configuración de mundos existentes (ahora viven dentro de Universo 2) ----
export const WORLDS_CONFIG = [
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
            { startIdx: 12, title: '🧠 Avanzado', subtitle: 'Control, diseño y más', color: '#60A5FA', colorLight: '#F0DEFF', emoji: '🏆' },
        ],
        bgPattern: '🔧⚡🤖💡🔩',
        challengeIds: ['py_hola_mundo', 'py_variable_basica', 'py_suma_numeros', 'py_texto_formateado', 'ard_setup_loop', 'ard_blink_basico'],
        circuitIds: [1, 2],
        glossaryTermIds: ['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10','g11','g12','g13','g14','g18','g60','g62','g66','g67'],
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
        glossaryTermIds: ['g15','g16','g17','g19','g20','g21','g23','g24','g25','g26','g33','g34','g59','g64','g68','g69','g74'],
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
        glossaryTermIds: ['g22','g27','g28','g29','g35','g36','g37','g38','g39','g40','g41','g42','g61','g70','g71','g80'],
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
        glossaryTermIds: ['g30','g31','g32','g43','g44','g45','g46','g47','g48','g49','g50','g51','g52','g63','g72','g73','g75','g76','g77','g88','g89'],
    },
    {
        id: 'world_5',
        name: 'El Desierto de los Rovers',
        emoji: '🏜️',
        description: 'Robótica autónoma: diseña rovers como los de NASA y SpaceX.',
        bgGradient: 'from-[#92400E] via-[#B45309] to-[#D97706]',
        bgCard: 'from-[#FEF3C7] to-[#FFFBEB]',
        bgClass: 'bg-world-desierto',
        worldImage: '/mundo5.png',
        accentColor: '#D97706',
        accentDark: '#92400E',
        modules: WORLD_5_MODULES,
        sections: WORLD_5_SECTIONS,
        bgPattern: '🏜️🧭👁️🧠🛞📡⚡📻🗺️🤖🛡️🧪🐜🏗️🏁🏆',
        unlockType: 'friends',
        unlockRequirement: 15,
        challengeIds: ['py_clase_rover', 'py_a_star', 'py_clasificador', 'py_fsm_rover', 'py_sensor_fusion', 'py_energy_manager'],
        circuitIds: [9, 10],
        glossaryTermIds: ['g53','g54','g55','g56','g57','g58','g65','g97','g98','g99','g100','g101','g102','g103','g104','g105','g106','g107','g108'],
    },
    {
        id: 'world_6',
        name: 'La Bahía de la Aero-Biosfera',
        emoji: '🌿',
        description: 'Drones agrícolas, invernaderos robóticos, biosensores y robótica ecológica.',
        bgGradient: 'from-[#065F46] via-[#047857] to-[#059669]',
        bgCard: 'from-[#D1FAE5] to-[#ECFDF5]',
        bgClass: 'bg-world-aerobiosfera',
        worldImage: '/mundo6.png',
        accentColor: '#059669',
        accentDark: '#065F46',
        modules: WORLD_6_MODULES,
        sections: WORLD_6_SECTIONS,
        bgPattern: '🌱🚁🌡️💧📡🗺️🌾🐝🏠🏙️🍅📱☀️🌍🏁🏆',
        unlockType: 'friends',
        unlockRequirement: 25,
        challengeIds: ['py_sensor_humedad', 'py_riego_auto', 'py_mapa_cultivo', 'py_alerta_plaga', 'py_drone_vuelo', 'py_invernadero'],
        circuitIds: [11, 12],
        glossaryTermIds: ['g93','g109','g110','g111','g112','g113','g114','g115','g116','g117','g118','g119','g120','g121','g122','g123'],
    },
];

// ==========================================================
// --- UNIVERSES CONFIG ---
// 4 universos, cada uno con su propio portal animado (agujero negro CSS),
// estela y color diferente.
// Los 6 planetas existentes se mueven al Universo 2.
// ==========================================================

export const UNIVERSES = [
    {
        id: 'universe_1',
        name: 'Universo Primaria',
        subtitle: 'El Cosmos de los Pequeños Inventores',
        educationLevel: 'Primaria',
        description: 'Enfoque lúdico y básico. Aprende jugando con circuitos de colores, robots amigables y actividades creativas.',
        // Estela y color para portal
        trailColor: '#58CC02',        // Verde brillante lúdico
        glowColor: 'rgba(88,204,2,0.5)',
        accentColor: '#58CC02',
        accentDark: '#45A300',
        bgGradient: 'from-[#064E3B] via-[#065F46] to-[#059669]',
        // Niveles/planetas dentro de este universo
        worlds: [],  // Se poblarán con contenido futuro de primaria
        uiTheme: 'playful', // Tema: colores vibrantes, emojis, fuentes redondeadas
        icon: '🎮',
        locked: false,
    },
    {
        id: 'universe_2',
        name: 'Universo Secundaria',
        subtitle: 'La Galaxia de la Ingeniería',
        educationLevel: 'Secundaria',
        description: 'Robótica, electrónica y programación con proyectos prácticos. Los 6 mundos clásicos de CultivaTec.',
        trailColor: '#3B82F6',          // Azul clásico
        glowColor: 'rgba(59,130,246,0.5)',
        accentColor: '#3B82F6',
        accentDark: '#1D4ED8',
        bgGradient: 'from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6]',
        // ¡Aquí van los 6 planetas actuales!
        worlds: WORLDS_CONFIG,
        uiTheme: 'standard',  // Tema actual de la app
        icon: '🔧',
        locked: false,
    },
    {
        id: 'universe_3',
        name: 'Universo Preparatoria',
        subtitle: 'El Sector de Pre-Ingeniería',
        educationLevel: 'Preparatoria',
        description: 'Enfoque técnico y pre-ingeniería. Mecatrónica, robótica industrial, control automático y diseño CAD.',
        trailColor: '#A855F7',          // Púrpura técnico
        glowColor: 'rgba(168,85,247,0.5)',
        accentColor: '#A855F7',
        accentDark: '#7C3AED',
        bgGradient: 'from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]',
        worlds: [],  // Contenido de preparatoria futuro
        uiTheme: 'technical',  // Tema: menos emojis, más diagramas técnicos
        icon: '⚙️',
        locked: false,
    },
    {
        id: 'universe_4',
        name: 'Universo Universidad',
        subtitle: 'Terminal de Certificaciones',
        educationLevel: 'Universidad',
        description: 'Interfaz seria tipo IDE/software industrial. Certificaciones profesionales, proyectos de grado y competencias.',
        trailColor: '#EF4444',          // Rojo industrial
        glowColor: 'rgba(239,68,68,0.5)',
        accentColor: '#EF4444',
        accentDark: '#DC2626',
        bgGradient: 'from-[#1F2937] via-[#111827] to-[#0F172A]',
        worlds: [],  // Contenido universitario futuro
        uiTheme: 'industrial',  // Tema: colores oscuros, tipografía monoespaciada, menús técnicos
        icon: '🏭',
        locked: false,
    },
];

// ==========================================================
// --- USER ROLES ---
// Asignados por el examen diagnóstico del onboarding.
// ==========================================================
export const USER_ROLES = {
    PRIMARY: 'primary',       // → Universo 1
    SECONDARY: 'secondary',   // → Universo 2
    PREPARATORY: 'preparatory', // → Universo 3
    UNIVERSITY: 'university',  // → Universo 4
};

// Mapa de rol → índice de universo
export const ROLE_TO_UNIVERSE = {
    [USER_ROLES.PRIMARY]: 0,
    [USER_ROLES.SECONDARY]: 1,
    [USER_ROLES.PREPARATORY]: 2,
    [USER_ROLES.UNIVERSITY]: 3,
};

// ==========================================================
// --- EXAMEN DIAGNÓSTICO ---
// Preguntas que determinan automáticamente el nivel del usuario.
// ==========================================================
export const DIAGNOSTIC_QUESTIONS = [
    {
        id: 'dq_1',
        question: '¿Cuál es tu nivel educativo actual?',
        type: 'single',
        options: [
            { label: 'Primaria (6-12 años)', value: 'primary', points: { primary: 3 } },
            { label: 'Secundaria (12-15 años)', value: 'secondary', points: { secondary: 3 } },
            { label: 'Preparatoria / Bachillerato (15-18 años)', value: 'preparatory', points: { preparatory: 3 } },
            { label: 'Universidad / Profesional', value: 'university', points: { university: 3 } },
        ],
    },
    {
        id: 'dq_2',
        question: '¿Qué tanto sabes de programación?',
        type: 'single',
        options: [
            { label: 'Nada, nunca he programado', value: 'none', points: { primary: 2 } },
            { label: 'Sé usar Scratch o algo similar', value: 'scratch', points: { primary: 1, secondary: 1 } },
            { label: 'Conozco Python o Arduino básico', value: 'basic', points: { secondary: 2 } },
            { label: 'Programo en varios lenguajes', value: 'advanced', points: { preparatory: 1, university: 2 } },
        ],
    },
    {
        id: 'dq_3',
        question: '¿Has armado un circuito electrónico alguna vez?',
        type: 'single',
        options: [
            { label: 'No, nunca', value: 'never', points: { primary: 2 } },
            { label: 'Sí, con un kit básico o protoboard', value: 'basic', points: { secondary: 2 } },
            { label: 'Sí, diseño mis propios PCBs', value: 'pcb', points: { preparatory: 1, university: 2 } },
        ],
    },
    {
        id: 'dq_4',
        question: '¿Qué te interesa más?',
        type: 'single',
        options: [
            { label: 'Jugar y aprender con robots divertidos 🤖', value: 'play', points: { primary: 2 } },
            { label: 'Construir proyectos de robótica paso a paso 🔧', value: 'build', points: { secondary: 2 } },
            { label: 'Diseñar sistemas mecatrónicos y automatización ⚙️', value: 'design', points: { preparatory: 2 } },
            { label: 'Obtener certificaciones profesionales y trabajar en la industria 🏭', value: 'certify', points: { university: 2 } },
        ],
    },
    {
        id: 'dq_5',
        question: '¿Sabes qué es un microcontrolador?',
        type: 'single',
        options: [
            { label: 'No tengo idea', value: 'no', points: { primary: 2 } },
            { label: 'Es como el cerebro de un robot', value: 'basic', points: { secondary: 2 } },
            { label: 'Conozco Arduino, ESP32, PIC, STM32...', value: 'advanced', points: { preparatory: 1, university: 2 } },
        ],
    },
];

/**
 * Calcula el rol del usuario basado en sus respuestas al diagnóstico.
 * @param {Array} answers - Array de { questionId, selectedValue }
 * @returns {{ role: string, scores: object, universeIndex: number }}
 */
export function calculateDiagnosticRole(answers) {
    const scores = { primary: 0, secondary: 0, preparatory: 0, university: 0 };

    answers.forEach(answer => {
        const question = DIAGNOSTIC_QUESTIONS.find(q => q.id === answer.questionId);
        if (!question) return;
        const option = question.options.find(o => o.value === answer.selectedValue);
        if (!option || !option.points) return;
        Object.entries(option.points).forEach(([role, pts]) => {
            scores[role] = (scores[role] || 0) + pts;
        });
    });

    // El rol con mayor puntaje gana
    const role = Object.entries(scores).reduce((best, [key, val]) =>
        val > best.val ? { key, val } : best,
        { key: USER_ROLES.SECONDARY, val: -1 }
    ).key;

    return {
        role,
        scores,
        universeIndex: ROLE_TO_UNIVERSE[role] ?? 1,
    };
}
