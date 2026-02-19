import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Users, BookOpen, Trophy, Lightbulb, ClipboardList, ChevronRight, CheckCircle, Lock, Star, Clock, Target, Zap } from 'lucide-react';
import { playClick, playBack, playTab } from '../utils/retroSounds';
import { joinClassroom, leaveClassroom, onClassroomMembers } from '../firebase/firestore';

/* ───────────────────────────────────────────────────
   JoinClassScreen — Enter a class code to join.
   Once joined, shows class content: quizzes, topics,
   challenges, and more.
   ─────────────────────────────────────────────────── */

const PF = '"Press Start 2P", monospace';

// Mock class data that would normally come from Firebase
const MOCK_CLASSES = {
  'ROBO2026': {
    name: 'Robótica Educativa — Grupo A',
    teacher: 'Prof. Diego Martínez — Academia CultivaTec',
    students: 24,
    color: '#1CB0F6',
    topics: [
      { id: 't1', title: 'Introducción a la Robótica', description: 'Conceptos fundamentales, historia y aplicaciones de la robótica educativa.', completed: true },
      { id: 't2', title: 'Electricidad y Circuitos Básicos', description: 'Voltaje, corriente, resistencia, Ley de Ohm y circuitos en serie/paralelo.', completed: true },
      { id: 't3', title: 'Programación con Arduino', description: 'Estructura de un programa, variables, funciones setup() y loop().', completed: false },
      { id: 't4', title: 'Sensores y Actuadores', description: 'Lectura de sensores digitales y analógicos, control de motores y servos.', completed: false },
      { id: 't5', title: 'Diseño Mecánico', description: 'Engranajes, poleas, transmisión de movimiento y construcción de chasis.', completed: false },
      { id: 't6', title: 'Robot Seguidor de Línea', description: 'Proyecto integrador: construir un robot que siga una trayectoria.', completed: false },
    ],
    quizzes: [
      { id: 'q1', title: 'Quiz: Fundamentos Eléctricos', questions: 10, timeLimit: '15 min', points: 100, completed: true, score: 85 },
      { id: 'q2', title: 'Quiz: Componentes Electrónicos', questions: 8, timeLimit: '12 min', points: 80, completed: true, score: 92 },
      { id: 'q3', title: 'Quiz: Arduino Básico', questions: 12, timeLimit: '20 min', points: 120, completed: false, score: null },
      { id: 'q4', title: 'Quiz: Sensores', questions: 10, timeLimit: '15 min', points: 100, completed: false, score: null },
      { id: 'q5', title: 'Examen Parcial', questions: 25, timeLimit: '40 min', points: 250, completed: false, score: null },
    ],
    challenges: [
      { id: 'r1', title: 'Enciende un LED con Arduino', difficulty: 'Fácil', points: 50, completed: true, description: 'Programa tu Arduino para encender y apagar un LED cada segundo.' },
      { id: 'r2', title: 'Semáforo con 3 LEDs', difficulty: 'Fácil', points: 75, completed: true, description: 'Simula un semáforo real con tiempos de verde, amarillo y rojo.' },
      { id: 'r3', title: 'Sensor de distancia', difficulty: 'Medio', points: 100, completed: false, description: 'Usa un sensor ultrasónico para medir distancias y mostrarlas en Serial.' },
      { id: 'r4', title: 'Control de servo con potenciómetro', difficulty: 'Medio', points: 100, completed: false, description: 'Controla la posición de un servo motor con un potenciómetro.' },
      { id: 'r5', title: 'Robot evasor de obstáculos', difficulty: 'Difícil', points: 200, completed: false, description: 'Construye un robot que detecte y evite obstáculos automáticamente.' },
    ],
    announcements: [
      { id: 'a1', date: '15 Feb 2026', text: 'Recuerden traer su Arduino y protoboard para la clase del miércoles.' },
      { id: 'a2', date: '12 Feb 2026', text: 'El Quiz de Arduino Básico se habilitará el lunes 17 de febrero.' },
      { id: 'a3', date: '10 Feb 2026', text: '¡Felicidades al equipo ganador del reto de la semana!' },
    ],
  },
  'STEM2026': {
    name: 'Cultura STEM — Sección B',
    teacher: 'Prof. Abraham Doñates — Academia CultivaTec',
    students: 18,
    color: '#58CC02',
    topics: [
      { id: 't1', title: 'Pensamiento Computacional', description: 'Descomposición, reconocimiento de patrones, abstracción y algoritmos.', completed: true },
      { id: 't2', title: 'Ciencia de Datos Básica', description: 'Recolección, análisis y visualización de datos del mundo real.', completed: false },
      { id: 't3', title: 'Energías Renovables', description: 'Tipos de energía limpia, paneles solares y proyectos sustentables.', completed: false },
      { id: 't4', title: 'Impresión 3D', description: 'Diseño asistido por computadora y creación de prototipos.', completed: false },
    ],
    quizzes: [
      { id: 'q1', title: 'Quiz: Pensamiento Computacional', questions: 8, timeLimit: '10 min', points: 80, completed: true, score: 78 },
      { id: 'q2', title: 'Quiz: Datos y Gráficas', questions: 10, timeLimit: '15 min', points: 100, completed: false, score: null },
    ],
    challenges: [
      { id: 'r1', title: 'Algoritmo de ordenamiento', difficulty: 'Fácil', points: 50, completed: true, description: 'Diseña un algoritmo para ordenar una lista de números.' },
      { id: 'r2', title: 'Gráfica de temperaturas', difficulty: 'Medio', points: 100, completed: false, description: 'Recolecta datos de temperatura de una semana y crea una gráfica.' },
    ],
    announcements: [
      { id: 'a1', date: '14 Feb 2026', text: 'Proyecto final: presentación de prototipos el viernes 28 de febrero.' },
    ],
  },
};

const JoinClassScreen = ({ onBack, userId }) => {
  const [classCode, setClassCode] = useState('');
  const [joinedClass, setJoinedClass] = useState(null); // null = show join form, object = show class
  const [activeTab, setActiveTab] = useState('temas');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const inputRef = useRef(null);

  // Real-time listener for member count
  useEffect(() => {
    if (!joinedClass?.code) return;
    const unsub = onClassroomMembers(joinedClass.code, (count) => {
      setMemberCount(count);
    });
    return () => unsub();
  }, [joinedClass?.code]);

  useEffect(() => {
    // Check if there's a saved class
    try {
      const saved = localStorage.getItem('cultivatec_joinedClass');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (MOCK_CLASSES[parsed.code]) {
          setJoinedClass({ code: parsed.code, ...MOCK_CLASSES[parsed.code] });
        }
      }
    } catch {}
  }, []);

  const handleJoin = () => {
    const code = classCode.trim().toUpperCase();
    if (!code) { setError('Ingresa un código de clase'); return; }
    
    setLoading(true);
    setError('');
    
    // Simulate network delay
    setTimeout(async () => {
      const classData = MOCK_CLASSES[code];
      if (classData) {
        const joined = { code, ...classData };
        setJoinedClass(joined);
        try { localStorage.setItem('cultivatec_joinedClass', JSON.stringify({ code })); } catch {}
        // Register in Firebase
        if (userId) {
          try { await joinClassroom(code, userId); } catch (e) { console.error('joinClassroom error', e); }
        }
        playClick();
      } else {
        setError('Código no encontrado. Verifica e intenta de nuevo.');
      }
      setLoading(false);
    }, 800);
  };

  const handleLeave = async () => {
    const code = joinedClass?.code;
    playBack();
    setJoinedClass(null);
    setClassCode('');
    setMemberCount(0);
    try { localStorage.removeItem('cultivatec_joinedClass'); } catch {}
    if (userId && code) {
      try { await leaveClassroom(code, userId); } catch (e) { console.error('leaveClassroom error', e); }
    }
  };

  // ─── JOIN FORM ───
  if (!joinedClass) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <button onClick={() => { playBack(); onBack(); }} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px',
            padding: '8px', cursor: 'pointer', display: 'flex',
          }}>
            <ArrowLeft size={20} color="#94A3B8" />
          </button>
          <span style={{ color: '#94A3B8', fontSize: '9px', fontFamily: PF, letterSpacing: '0.08em' }}>
            UNIRSE A CLASE
          </span>
        </div>

        {/* Center content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '0 24px', marginTop: '-40px',
        }}>
          {/* Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '20px',
            background: 'linear-gradient(135deg, #1CB0F6, #0891B2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(28,176,246,0.3)',
            marginBottom: 24,
          }}>
            <Users size={36} color="white" />
          </div>

          <h1 style={{
            color: 'white', fontFamily: PF, fontSize: '11px',
            textAlign: 'center', marginBottom: 8,
          }}>
            UNIRSE A UNA CLASE
          </h1>
          <p style={{
            color: '#94A3B8', fontSize: '13px', textAlign: 'center',
            maxWidth: 280, lineHeight: 1.5, marginBottom: 32,
          }}>
            Ingresa el código que te dio tu profesor para acceder a cuestionarios, temas, retos y más.
          </p>

          {/* Code input */}
          <div style={{ width: '100%', maxWidth: 320 }}>
            <input
              ref={inputRef}
              type="text"
              value={classCode}
              onChange={e => { setClassCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="EJ: ROBO2026"
              maxLength={12}
              style={{
                width: '100%', padding: '16px 20px',
                background: 'rgba(255,255,255,0.08)',
                border: error ? '2px solid #EF4444' : '2px solid rgba(255,255,255,0.15)',
                borderRadius: '14px', color: 'white',
                fontSize: '16px', fontFamily: PF,
                textAlign: 'center', letterSpacing: '0.2em',
                outline: 'none', transition: 'border 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { if (!error) e.target.style.border = '2px solid #1CB0F6'; }}
              onBlur={e => { if (!error) e.target.style.border = '2px solid rgba(255,255,255,0.15)'; }}
            />
            {error && (
              <p style={{ color: '#EF4444', fontSize: '11px', textAlign: 'center', marginTop: 8 }}>{error}</p>
            )}
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{
              width: '100%', maxWidth: 320, marginTop: 16,
              padding: '14px', borderRadius: '14px',
              background: loading ? '#475569' : 'linear-gradient(135deg, #1CB0F6, #0891B2)',
              border: 'none', color: 'white',
              fontFamily: PF, fontSize: '10px',
              fontWeight: 900, letterSpacing: '0.08em',
              cursor: loading ? 'default' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(28,176,246,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'BUSCANDO...' : 'UNIRSE'}
          </button>

          {/* Hint */}
          <p style={{
            color: 'rgba(148,163,184,0.5)', fontSize: '10px',
            textAlign: 'center', marginTop: 24, maxWidth: 260, lineHeight: 1.5,
          }}>
            Prueba con: ROBO2026 o STEM2026
          </p>
        </div>
      </div>
    );
  }

  // ─── CLASS VIEW (after joining) ───
  const tabs = [
    { id: 'temas', label: 'Temas', icon: <BookOpen size={14} /> },
    { id: 'quizzes', label: 'Quizzes', icon: <ClipboardList size={14} /> },
    { id: 'retos', label: 'Retos', icon: <Trophy size={14} /> },
    { id: 'info', label: 'Info', icon: <Lightbulb size={14} /> },
  ];

  const totalQuizPoints = joinedClass.quizzes.reduce((s, q) => s + (q.completed ? q.score : 0), 0);
  const totalChallengePoints = joinedClass.challenges.reduce((s, c) => s + (c.completed ? c.points : 0), 0);
  const totalPoints = totalQuizPoints + totalChallengePoints;

  const completedTopics = joinedClass.topics.filter(t => t.completed).length;
  const completedQuizzes = joinedClass.quizzes.filter(q => q.completed).length;
  const completedChallenges = joinedClass.challenges.filter(c => c.completed).length;

  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFC',
      display: 'flex', flexDirection: 'column', paddingBottom: 80,
    }}>
      {/* Colored header */}
      <div style={{
        background: `linear-gradient(135deg, ${joinedClass.color}, ${joinedClass.color}CC)`,
        padding: '16px 20px 60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => { playBack(); onBack(); }} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px',
            padding: '8px', cursor: 'pointer', display: 'flex',
          }}>
            <ArrowLeft size={20} color="white" />
          </button>
          <button onClick={handleLeave} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px',
            padding: '6px 12px', cursor: 'pointer', color: 'white',
            fontSize: '9px', fontFamily: PF, letterSpacing: '0.05em',
          }}>
            SALIR
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <h1 style={{
            color: 'white', fontFamily: PF, fontSize: '10px',
            lineHeight: 1.4, marginBottom: 6,
          }}>
            {joinedClass.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
            {joinedClass.teacher} — {memberCount} estudiante{memberCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Points badge */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: '10px',
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Star size={14} color="#FFC800" fill="#FFC800" />
            <span style={{ color: 'white', fontFamily: PF, fontSize: '9px' }}>{totalPoints} PTS</span>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: '10px',
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Target size={14} color="white" />
            <span style={{ color: 'white', fontFamily: PF, fontSize: '9px' }}>
              {completedTopics}/{joinedClass.topics.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 16px',
        marginTop: -24, position: 'relative', zIndex: 2, overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { playTab(); setActiveTab(tab.id); }}
            style={{
              flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 5, padding: '10px 14px', borderRadius: '12px',
              background: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.8)',
              border: activeTab === tab.id ? `2px solid ${joinedClass.color}` : '2px solid #E2E8F0',
              color: activeTab === tab.id ? joinedClass.color : '#94A3B8',
              fontFamily: PF, fontSize: '7px', fontWeight: 900,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px', flex: 1 }}>

        {/* ─── TEMAS ─── */}
        {activeTab === 'temas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: 4 }}>
              Progreso: {completedTopics} de {joinedClass.topics.length} temas completados
            </p>
            {joinedClass.topics.map((topic, i) => (
              <div key={topic.id} style={{
                background: 'white', borderRadius: '14px', padding: '14px 16px',
                border: '2px solid ' + (topic.completed ? '#86EFAC' : '#E2E8F0'),
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
                  background: topic.completed ? '#DCFCE7' : '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {topic.completed
                    ? <CheckCircle size={16} color="#22C55E" />
                    : <span style={{ fontFamily: PF, fontSize: '9px', color: '#94A3B8' }}>{i + 1}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: PF, fontSize: '8px', color: topic.completed ? '#22C55E' : '#334155',
                    marginBottom: 4,
                  }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4 }}>
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── QUIZZES ─── */}
        {activeTab === 'quizzes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: 4 }}>
              {completedQuizzes} de {joinedClass.quizzes.length} completados — {totalQuizPoints} pts obtenidos
            </p>
            {joinedClass.quizzes.map(quiz => (
              <div key={quiz.id} style={{
                background: 'white', borderRadius: '14px', padding: '14px 16px',
                border: '2px solid ' + (quiz.completed ? '#86EFAC' : '#E2E8F0'),
                cursor: 'pointer',
              }} onClick={() => playClick()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{
                    fontFamily: PF, fontSize: '8px',
                    color: quiz.completed ? '#22C55E' : '#334155',
                  }}>
                    {quiz.title}
                  </h3>
                  {quiz.completed
                    ? <CheckCircle size={16} color="#22C55E" />
                    : <ChevronRight size={16} color="#CBD5E1" />
                  }
                </div>

                <div style={{
                  display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap',
                }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '10px', color: '#94A3B8',
                  }}>
                    <ClipboardList size={12} /> {quiz.questions} preguntas
                  </span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '10px', color: '#94A3B8',
                  }}>
                    <Clock size={12} /> {quiz.timeLimit}
                  </span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: '10px', color: '#FFC800',
                  }}>
                    <Star size={12} /> {quiz.points} pts
                  </span>
                </div>

                {quiz.completed && (
                  <div style={{
                    marginTop: 8, background: '#DCFCE7', borderRadius: '8px',
                    padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ fontFamily: PF, fontSize: '8px', color: '#22C55E' }}>
                      Puntuación: {quiz.score}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── RETOS ─── */}
        {activeTab === 'retos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ color: '#64748B', fontSize: '12px', marginBottom: 4 }}>
              {completedChallenges} de {joinedClass.challenges.length} retos completados — {totalChallengePoints} pts
            </p>
            {joinedClass.challenges.map(ch => {
              const diffColor = ch.difficulty === 'Fácil' ? '#22C55E'
                : ch.difficulty === 'Medio' ? '#F59E0B' : '#EF4444';
              return (
                <div key={ch.id} style={{
                  background: 'white', borderRadius: '14px', padding: '14px 16px',
                  border: '2px solid ' + (ch.completed ? '#86EFAC' : '#E2E8F0'),
                  cursor: 'pointer', opacity: ch.completed ? 0.85 : 1,
                }} onClick={() => playClick()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontFamily: PF, fontSize: '8px', color: ch.completed ? '#22C55E' : '#334155' }}>
                      {ch.title}
                    </h3>
                    {ch.completed
                      ? <CheckCircle size={16} color="#22C55E" />
                      : <Zap size={16} color={diffColor} />
                    }
                  </div>
                  <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: 6, lineHeight: 1.4 }}>
                    {ch.description}
                  </p>
                  <div style={{
                    display: 'flex', gap: 10, marginTop: 8, alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '9px', fontFamily: PF, color: diffColor,
                      background: diffColor + '18', padding: '3px 8px',
                      borderRadius: '6px',
                    }}>
                      {ch.difficulty.toUpperCase()}
                    </span>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: '10px', color: '#FFC800',
                    }}>
                      <Star size={12} /> {ch.points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── INFO ─── */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Class info card */}
            <div style={{
              background: 'white', borderRadius: '14px', padding: '16px',
              border: '2px solid #E2E8F0',
            }}>
              <h3 style={{ fontFamily: PF, fontSize: '8px', color: '#334155', marginBottom: 10 }}>
                INFORMACIÓN DE LA CLASE
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Clase', joinedClass.name],
                  ['Profesor', joinedClass.teacher],
                  ['Estudiantes', `${memberCount} inscritos`],
                  ['Código', joinedClass.code],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid #F1F5F9',
                  }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: '11px', color: '#334155', fontWeight: 700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div style={{
              background: 'white', borderRadius: '14px', padding: '16px',
              border: '2px solid #E2E8F0',
            }}>
              <h3 style={{ fontFamily: PF, fontSize: '8px', color: '#334155', marginBottom: 10 }}>
                ANUNCIOS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {joinedClass.announcements.map(ann => (
                  <div key={ann.id} style={{
                    background: '#F8FAFC', borderRadius: '10px', padding: '12px',
                    borderLeft: `3px solid ${joinedClass.color}`,
                  }}>
                    <p style={{ fontSize: '11px', color: '#334155', lineHeight: 1.5 }}>{ann.text}</p>
                    <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: 4 }}>{ann.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave class button */}
            <button onClick={handleLeave} style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              background: '#FEE2E2', border: '2px solid #FECACA',
              fontFamily: PF, fontSize: '8px', color: '#EF4444',
              cursor: 'pointer', marginTop: 8,
            }}>
              SALIR DE LA CLASE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinClassScreen;
