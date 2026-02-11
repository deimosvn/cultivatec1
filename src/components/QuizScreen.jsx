import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Star, Zap } from 'lucide-react';

// --- BANCO DE PREGUNTAS POR MÓDULO ---
const QUIZ_DATA = {
  mod_electr: {
    title: "Quiz: Electricidad Inicial ⚡",
    description: "Pon a prueba lo que aprendiste sobre electricidad",
    questions: [
      {
        id: 'q1',
        question: "¿Qué son los electrones?",
        options: [
          "Partículas diminutas que se mueven y crean energía",
          "Luces que se ven en el cielo",
          "Tipos de cables eléctricos",
          "Unidades de medida de voltaje"
        ],
        correct: 0,
        explanation: "¡Correcto! Los electrones son partículas diminutas que al moverse crean la electricidad. Son como pequeños magos invisibles."
      },
      {
        id: 'q2',
        question: "¿Cuál de estos NO es una fuente de electricidad?",
        options: [
          "El Sol (paneles solares)",
          "El Viento (molinos)",
          "Una piedra común",
          "El Agua (presas)"
        ],
        correct: 2,
        explanation: "¡Exacto! Una piedra común no genera electricidad. Las fuentes principales son el sol, el viento y el agua."
      },
      {
        id: 'q3',
        question: "¿Qué es un conductor eléctrico?",
        options: [
          "Un material que detiene la electricidad",
          "Un material que permite pasar la electricidad, como el cobre",
          "Una persona que maneja un autobús",
          "Un tipo de batería especial"
        ],
        correct: 1,
        explanation: "¡Bien hecho! Los conductores como el cobre permiten que la electricidad fluya. Son la 'autopista' de los electrones."
      },
      {
        id: 'q4',
        question: "¿Cuáles son las 4 partes de un circuito básico?",
        options: [
          "Fuente, Cables, Consumidor e Interruptor",
          "LED, Motor, Sensor y Batería",
          "Voltaje, Corriente, Resistencia y Potencia",
          "Arduino, Protoboard, Cables y Computadora"
        ],
        correct: 0,
        explanation: "¡Perfecto! Un circuito necesita: la Fuente (pila), los Cables (camino), el Consumidor (bombilla) y el Interruptor (puente)."
      },
      {
        id: 'q5',
        question: "En la Ley de Ohm (V = I × R), ¿qué representa la V?",
        options: [
          "Velocidad de los electrones",
          "Voltaje: la fuerza que empuja los electrones",
          "Volumen del sonido",
          "El nombre de un científico"
        ],
        correct: 1,
        explanation: "¡Correcto! 'V' es el Voltaje, que es como la altura del tobogán: cuanto más alto, más fuerza tiene el agua para bajar."
      },
      {
        id: 'q6',
        question: "¿Cuál es una regla de seguridad eléctrica?",
        options: [
          "Puedes tocar los enchufes con las manos mojadas",
          "Los cables rotos no son peligrosos",
          "Nunca uses agua cerca de enchufes o aparatos eléctricos",
          "Puedes meter objetos en los enchufes"
        ],
        correct: 2,
        explanation: "¡Exacto! La seguridad es lo primero. Nunca uses agua cerca de la electricidad y siempre avisa a un adulto si ves un cable dañado."
      },
      {
        id: 'q7',
        question: "¿Qué material es un buen AISLANTE eléctrico?",
        options: [
          "Un cable de cobre",
          "Una moneda de metal",
          "El plástico que cubre los cables",
          "El agua con sal"
        ],
        correct: 2,
        explanation: "¡Correcto! El plástico es un aislante: detiene la electricidad y nos protege. Por eso los cables están cubiertos de plástico."
      },
      {
        id: 'q8',
        question: "Si la Resistencia (R) en un circuito aumenta, ¿qué pasa con la Corriente (I)?",
        options: [
          "La corriente aumenta mucho",
          "La corriente disminuye (pasan menos electrones)",
          "No pasa nada, todo sigue igual",
          "El circuito se apaga completamente"
        ],
        correct: 1,
        explanation: "¡Bien pensado! Según la Ley de Ohm, si hay más 'frenos' (Resistencia), pasan menos electrones (Corriente). Es como poner más rocas en el tobogán."
      }
    ]
  },
  mod_electon: {
    title: "Quiz: Electrónica Inicial 🔌",
    description: "Demuestra lo que sabes sobre componentes electrónicos",
    questions: [
      {
        id: 'eq1',
        question: "¿Qué hace un diodo en un circuito?",
        options: [
          "Amplifica la señal eléctrica",
          "Permite el flujo de corriente en una sola dirección",
          "Almacena energía como una batería",
          "Mide el voltaje del circuito"
        ],
        correct: 1,
        explanation: "¡Correcto! El diodo es como una puerta que solo se abre en un sentido. La corriente solo puede pasar en una dirección."
      },
      {
        id: 'eq2',
        question: "¿Para qué sirve un transistor?",
        options: [
          "Solo para decorar el circuito",
          "Para medir la temperatura",
          "Como interruptor o amplificador de señales",
          "Para conectar cables entre sí"
        ],
        correct: 2,
        explanation: "¡Exacto! El transistor es uno de los componentes más importantes: puede actuar como interruptor electrónico o amplificar señales débiles."
      },
      {
        id: 'eq3',
        question: "¿Qué componente emite luz cuando pasa corriente?",
        options: [
          "Un transistor",
          "Una resistencia",
          "Un LED (Diodo Emisor de Luz)",
          "Un capacitor"
        ],
        correct: 2,
        explanation: "¡Correcto! LED significa 'Diodo Emisor de Luz'. Cuando la corriente pasa por él en la dirección correcta, ¡brilla!"
      }
    ]
  },
  mod_arduino: {
    title: "Quiz: Control con Arduino 🕹️",
    description: "Pon a prueba tus conocimientos de Arduino",
    questions: [
      {
        id: 'aq1',
        question: "¿Qué es Arduino UNO?",
        options: [
          "Un videojuego de robots",
          "Una placa de desarrollo de código abierto para crear proyectos",
          "Un tipo de cable especial",
          "Una aplicación de celular"
        ],
        correct: 1,
        explanation: "¡Correcto! Arduino UNO es una placa electrónica que puedes programar para controlar LEDs, motores, sensores y más."
      },
      {
        id: 'aq2',
        question: "¿Qué es el IDE de Arduino?",
        options: [
          "Un robot que se mueve solo",
          "El software donde escribimos el código para la placa Arduino",
          "Un sensor de temperatura",
          "Un tipo de cable USB"
        ],
        correct: 1,
        explanation: "¡Exacto! IDE significa 'Entorno de Desarrollo Integrado'. Es el programa en tu computadora donde escribes las instrucciones para Arduino."
      },
      {
        id: 'aq3',
        question: "¿Qué función usamos para encender un LED con Arduino?",
        options: [
          "turnOnLight()",
          "digitalWrite(pin, HIGH)",
          "ledOn()",
          "print('encender')"
        ],
        correct: 1,
        explanation: "¡Muy bien! 'digitalWrite(pin, HIGH)' le dice a Arduino que envíe voltaje por un pin específico, encendiendo lo que esté conectado."
      }
    ]
  },
  // Quiz genérico para módulos sin quiz específico
  generic: {
    title: "Quiz Rápido 🧠",
    description: "Preguntas generales de robótica",
    questions: [
      {
        id: 'gq1',
        question: "¿Qué es un robot?",
        options: [
          "Una máquina programable que puede realizar tareas",
          "Solo un juguete de plástico",
          "Una computadora muy grande",
          "Un animal mecánico"
        ],
        correct: 0,
        explanation: "¡Correcto! Un robot es una máquina que podemos programar para que haga diferentes tareas de forma automática o controlada."
      },
      {
        id: 'gq2',
        question: "¿Qué hace un sensor en un robot?",
        options: [
          "Le da energía al robot",
          "Recibe información del entorno (temperatura, distancia, luz)",
          "Mueve las ruedas del robot",
          "Conecta el robot al internet"
        ],
        correct: 1,
        explanation: "¡Exacto! Los sensores son como los 'sentidos' del robot. Le permiten ver, oír y sentir el mundo que lo rodea."
      },
      {
        id: 'gq3',
        question: "¿Qué necesita un robot para moverse?",
        options: [
          "Solo un sensor",
          "Un actuador (motor) y energía",
          "Solo una computadora",
          "Una antena de radio"
        ],
        correct: 1,
        explanation: "¡Bien! Los actuadores (como motores) convierten la energía eléctrica en movimiento. Sin ellos, el robot no podría moverse."
      }
    ]
  }
};

// --- COMPONENTE PRINCIPAL DEL QUIZ ---
const QuizScreen = ({ moduleId, moduleName, onBack, onComplete }) => {
  const quizData = QUIZ_DATA[moduleId] || QUIZ_DATA.generic;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  const question = quizData.questions[currentQuestion];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  // Timer countdown
  useEffect(() => {
    if (!timerActive || quizCompleted || showExplanation) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // Tiempo agotado
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, quizCompleted, showExplanation]);

  // Reset timer for each question
  useEffect(() => {
    setTimeLeft(30);
    setTimerActive(true);
  }, [currentQuestion]);

  const handleAnswer = useCallback((answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setTimerActive(false);
    setShowExplanation(true);

    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, timeLeft);
      const streakBonus = streak >= 2 ? 5 : 0;
      const points = 10 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setAnswers(prev => [...prev, { 
      questionId: question.id, 
      selected: answerIndex, 
      correct: question.correct, 
      isCorrect,
      timeUsed: 30 - timeLeft
    }]);
  }, [selectedAnswer, question, timeLeft, streak]);

  const nextQuestion = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setQuizCompleted(true);
      const correctCount = answers.length > 0 
        ? answers.filter(a => a.isCorrect).length + (selectedAnswer === question.correct ? 1 : 0)
        : (selectedAnswer === question.correct ? 1 : 0);
      if (onComplete) {
        onComplete(moduleId, correctCount, totalQuestions, score);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(30);
    setTimerActive(true);
  };

  // --- PANTALLA DE RESULTADOS ---
  if (quizCompleted) {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const avgTime = Math.round(answers.reduce((sum, a) => sum + a.timeUsed, 0) / answers.length);
    
    let resultEmoji, resultMessage, resultColor;
    if (percentage >= 80) {
      resultEmoji = '🏆';
      resultMessage = '¡Eres un Genio de la Robótica!';
      resultColor = 'text-yellow-600';
    } else if (percentage >= 60) {
      resultEmoji = '⭐';
      resultMessage = '¡Muy Bien! Sigue Practicando';
      resultColor = 'text-green-600';
    } else if (percentage >= 40) {
      resultEmoji = '💪';
      resultMessage = '¡Buen Esfuerzo! Repasa el Módulo';
      resultColor = 'text-blue-600';
    } else {
      resultEmoji = '📚';
      resultMessage = '¡No Te Rindas! Vuelve a Estudiar';
      resultColor = 'text-purple-600';
    }

    return (
      <div className="min-h-full bg-white flex flex-col animate-fade-in">
        <div className="px-4 pt-4 mb-4">
          <button onClick={onBack} className="text-[#AFAFAF] hover:text-[#3C3C3C] transition flex items-center bg-white p-2.5 rounded-xl border-2 border-[#E5E5E5] active:scale-95">
            <ArrowLeft size={18} className="mr-1" /> <span className="text-sm font-black">Volver</span>
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pb-6 space-y-5 max-w-md mx-auto w-full">
          <span className="text-7xl animate-bounce-in">{resultEmoji}</span>
          <h1 className={`text-2xl font-black ${percentage >= 60 ? 'text-[#58CC02]' : 'text-[#FF9600]'}`}>{resultMessage}</h1>
          
          <div className="w-full bg-white rounded-2xl border-2 border-[#E5E5E5] p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#D7FFB8] p-3 rounded-xl"><p className="text-2xl font-black text-[#58CC02]">{correctAnswers}/{totalQuestions}</p><p className="text-[11px] text-[#58CC02] font-bold">Correctas</p></div>
              <div className="bg-[#1CB0F6]/10 p-3 rounded-xl"><p className="text-2xl font-black text-[#1CB0F6]">{score}</p><p className="text-[11px] text-[#1CB0F6] font-bold">Puntos</p></div>
              <div className="bg-[#FFC800]/10 p-3 rounded-xl"><p className="text-2xl font-black text-[#FF9600]">{maxStreak}🔥</p><p className="text-[11px] text-[#FF9600] font-bold">Mejor Racha</p></div>
              <div className="bg-[#CE82FF]/10 p-3 rounded-xl"><p className="text-2xl font-black text-[#CE82FF]">{avgTime}s</p><p className="text-[11px] text-[#CE82FF] font-bold">Tiempo Prom.</p></div>
            </div>
            <div><div className="w-full bg-[#E5E5E5] rounded-full h-3 overflow-hidden"><div className={`h-3 rounded-full transition-all duration-1000 ${percentage >= 60 ? 'bg-[#58CC02]' : 'bg-[#FFC800]'}`} style={{ width: `${percentage}%` }}></div></div><p className="text-sm font-black text-[#3C3C3C] mt-1.5">{percentage}% de acierto</p></div>
          </div>

          <div className="flex gap-3 w-full">
            <button onClick={restartQuiz} className="flex-1 py-3 btn-3d btn-3d-yellow rounded-xl text-sm flex items-center justify-center"><RotateCcw size={16} className="mr-1.5" /> Reintentar</button>
            <button onClick={onBack} className="flex-1 py-3 btn-3d btn-3d-blue rounded-xl text-sm flex items-center justify-center"><ArrowLeft size={16} className="mr-1.5" /> Volver</button>
          </div>
        </div>
      </div>
    );
  }

  // --- PANTALLA DE PREGUNTA ---
  const timerColor = timeLeft > 15 ? 'text-green-600' : timeLeft > 5 ? 'text-yellow-600' : 'text-red-600 animate-pulse';

  return (
    <div className="min-h-full bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 flex justify-between items-center mb-3">
        <button onClick={onBack} className="text-[#AFAFAF] hover:text-[#3C3C3C] transition flex items-center bg-white p-2.5 rounded-xl border-2 border-[#E5E5E5] active:scale-95">
          <ArrowLeft size={18} className="mr-1" /> <span className="text-sm font-black">Salir</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="bg-[#FFC800]/10 text-[#FF9600] px-3 py-1 rounded-full font-black text-xs flex items-center">
            <Star size={14} className="mr-1" /> {score} pts
          </span>
          {streak >= 2 && (
            <span className="bg-[#FF4B4B]/10 text-[#FF4B4B] px-2.5 py-1 rounded-full font-black text-xs animate-pulse">🔥 {streak}</span>
          )}
        </div>
      </div>

      {/* Duolingo-style progress bar */}
      <div className="px-4 mb-4">
        <div className="flex justify-between text-xs font-black text-[#AFAFAF] mb-1">
          <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
          <span className={`font-black text-base ${timeLeft > 15 ? 'text-[#58CC02]' : timeLeft > 5 ? 'text-[#FFC800]' : 'text-[#FF4B4B] animate-pulse'}`}>⏱ {timeLeft}s</span>
        </div>
        <div className="w-full bg-[#E5E5E5] rounded-full h-3.5 overflow-hidden">
          <div className="h-full bg-[#58CC02] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="mx-4 bg-white p-5 rounded-2xl border-2 border-[#E5E5E5] mb-4">
        <h2 className="text-lg font-black text-[#3C3C3C] leading-snug">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="px-4 space-y-2.5 flex-grow">
        {question.options.map((option, index) => {
          let optionStyle = 'bg-white border-2 border-[#E5E5E5] hover:border-[#1CB0F6] hover:bg-[#1CB0F6]/5';
          let iconElement = <span className="w-7 h-7 rounded-full border-2 border-[#E5E5E5] flex items-center justify-center font-black text-[#AFAFAF] text-xs flex-shrink-0">{String.fromCharCode(65 + index)}</span>;

          if (selectedAnswer !== null) {
            if (index === question.correct) {
              optionStyle = 'bg-[#D7FFB8] border-2 border-[#58CC02]';
              iconElement = <CheckCircle size={22} className="text-[#58CC02] flex-shrink-0" />;
            } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
              optionStyle = 'bg-[#FF4B4B]/10 border-2 border-[#FF4B4B]';
              iconElement = <XCircle size={22} className="text-[#FF4B4B] flex-shrink-0" />;
            } else {
              optionStyle = 'bg-[#F7F7F7] border-2 border-[#E5E5E5] opacity-50';
            }
          }

          return (
            <button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null}
              className={`w-full p-3.5 rounded-xl flex items-center gap-3 transition-all duration-200 active:scale-[0.98] ${optionStyle}`}>
              {iconElement}
              <span className="text-left text-sm font-bold text-[#4B4B4B]">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`mx-4 mt-4 p-4 rounded-2xl border-2 animate-slide-up ${
          selectedAnswer === question.correct ? 'bg-[#D7FFB8] border-[#58CC02]' : 'bg-[#FF4B4B]/10 border-[#FF4B4B]'
        }`}>
          <p className="font-black text-sm mb-1">{selectedAnswer === question.correct ? '✅ ¡Correcto!' : '❌ Respuesta Incorrecta'}</p>
          <p className="text-[#777] text-xs leading-relaxed font-semibold">{question.explanation}</p>
          <button onClick={nextQuestion} className="w-full mt-3 py-3 btn-3d btn-3d-green rounded-xl text-sm">
            {currentQuestion + 1 >= totalQuestions ? '🏆 Ver Resultados' : 'Siguiente Pregunta →'}
          </button>
        </div>
      )}
      <div className="h-4"></div>
    </div>
  );
};

export { QuizScreen, QUIZ_DATA };
export default QuizScreen;
