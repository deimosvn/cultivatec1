import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, BookOpen, Zap, Cpu, Settings, Code, Lightbulb, Volume2 } from 'lucide-react';

// --- BASE DE DATOS DEL GLOSARIO ---
const GLOSSARY_TERMS = [
  // === ELECTRICIDAD ===
  { id: 'g1', term: 'Electrón', category: 'Electricidad', emoji: '⚡', definition: 'Partícula diminuta con carga negativa que se mueve por los cables y crea la electricidad. ¡Son como mini mensajeros de energía!', example: 'Cuando enciendes una linterna, millones de electrones se mueven por los cables desde la pila hasta el foco.' },
  { id: 'g2', term: 'Voltaje (V)', category: 'Electricidad', emoji: '🔋', definition: 'Es la "fuerza" o empuje que hace que los electrones se muevan. Se mide en Voltios (V). Es como la altura de un tobogán de agua.', example: 'Una pila AA tiene 1.5V, un enchufe de casa tiene 120V o 220V (¡mucho más fuerte y peligroso!).' },
  { id: 'g3', term: 'Corriente (I)', category: 'Electricidad', emoji: '🌊', definition: 'Es la cantidad de electrones que pasan por un cable en un segundo. Se mide en Amperios (A). Es como la cantidad de agua fluyendo por un río.', example: 'Un LED necesita poca corriente (~20mA), pero un motor necesita más corriente para girar.' },
  { id: 'g4', term: 'Resistencia (R)', category: 'Electricidad', emoji: '🛑', definition: 'Es lo que frena el paso de los electrones. Se mide en Ohmios (Ω). Es como poner rocas en el camino del río de electrones.', example: 'Usamos una resistencia de 220Ω para proteger un LED y que no se queme con demasiada corriente.' },
  { id: 'g5', term: 'Ley de Ohm', category: 'Electricidad', emoji: '📐', definition: 'Una regla mágica que relaciona Voltaje, Corriente y Resistencia: V = I × R. Si sabes dos de estas, puedes calcular la tercera.', example: 'Si tienes una pila de 9V y una resistencia de 450Ω, la corriente será: I = 9/450 = 0.02A = 20mA.' },
  { id: 'g6', term: 'Conductor', category: 'Electricidad', emoji: '🛤️', definition: 'Material que permite que la electricidad pase fácilmente. Los metales como el cobre y el aluminio son buenos conductores.', example: 'Los cables eléctricos son de cobre por dentro porque es un excelente conductor de electricidad.' },
  { id: 'g7', term: 'Aislante', category: 'Electricidad', emoji: '🧤', definition: 'Material que NO permite que la electricidad pase. El plástico, la goma y la madera son buenos aislantes.', example: 'La cubierta de plástico de los cables es un aislante: nos protege de tocar el cobre conductor.' },
  { id: 'g8', term: 'Circuito', category: 'Electricidad', emoji: '🔄', definition: 'Un camino cerrado por donde viaja la electricidad, desde la fuente de energía hasta el componente que la usa y de vuelta.', example: 'Pila → Cable → LED → Cable → Pila. Si el camino se rompe (circuito abierto), la corriente se detiene.' },
  
  // === ELECTRÓNICA ===
  { id: 'g9', term: 'LED', category: 'Electrónica', emoji: '💡', definition: 'Diodo Emisor de Luz. Un componente que brilla cuando pasa corriente en la dirección correcta. Tiene una pata larga (+) y una corta (-).', example: 'Los semáforos modernos, las pantallas de TV y las luces de colores usan LEDs.' },
  { id: 'g10', term: 'Resistor', category: 'Electrónica', emoji: '🏷️', definition: 'Componente con bandas de colores que limita la corriente en un circuito. Los colores indican su valor en Ohmios.', example: 'Un resistor con bandas rojo-rojo-marrón tiene 220Ω, perfecto para proteger un LED con una pila de 5V.' },
  { id: 'g11', term: 'Diodo', category: 'Electrónica', emoji: '➡️', definition: 'Componente que solo permite que la corriente fluya en una dirección, como una puerta de una sola vía.', example: 'Los cargadores de celular usan diodos para convertir la corriente alterna de tu casa en corriente directa.' },
  { id: 'g12', term: 'Transistor', category: 'Electrónica', emoji: '🚦', definition: 'Componente que actúa como un interruptor electrónico o amplificador. Puede encender/apagar circuitos usando una señal pequeña.', example: 'Un Arduino usa transistores para manejar motores: una señal pequeña del chip controla mucha corriente del motor.' },
  { id: 'g13', term: 'Capacitor', category: 'Electrónica', emoji: '🫙', definition: 'Componente que almacena energía eléctrica temporalmente, como un vaso que se llena de agua y luego se vacía.', example: 'En un flash de cámara, un capacitor se carga lentamente y luego libera toda la energía de golpe: ¡flash!' },
  { id: 'g14', term: 'Protoboard', category: 'Electrónica', emoji: '🕳️', definition: 'Tablero de pruebas con agujeros conectados internamente. Permite armar circuitos sin soldar, ideal para experimentar.', example: 'En las clases de robótica, usamos la protoboard para conectar LEDs, resistencias y el Arduino sin soldar nada.' },
  
  // === PROGRAMACIÓN ===
  { id: 'g15', term: 'Variable', category: 'Programación', emoji: '📦', definition: 'Un contenedor con nombre donde guardamos información (números, texto, etc.) en un programa. Es como una caja etiquetada.', example: 'En Python: edad = 10 guarda el número 10 en una "caja" llamada edad.' },
  { id: 'g16', term: 'Función', category: 'Programación', emoji: '⚙️', definition: 'Un bloque de código con nombre que realiza una tarea específica. La puedes llamar (usar) muchas veces sin repetir código.', example: 'print("Hola") es una función que muestra texto en pantalla. La puedes usar 100 veces sin reescribirla.' },
  { id: 'g17', term: 'Bucle (Loop)', category: 'Programación', emoji: '🔁', definition: 'Instrucción que repite un bloque de código varias veces. Evita escribir lo mismo una y otra vez.', example: 'for i in range(5): print("Hola") imprime "Hola" 5 veces sin necesidad de escribir 5 líneas.' },
  { id: 'g18', term: 'Condicional (if/else)', category: 'Programación', emoji: '🔀', definition: 'Instrucción que hace algo diferente según una condición. Es como un semáforo: si es verde, avanza; si es rojo, detente.', example: 'if temperatura > 30: print("¡Hace calor!") else: print("Está fresco")' },
  { id: 'g19', term: 'Algoritmo', category: 'Programación', emoji: '📋', definition: 'Una lista ordenada de pasos para resolver un problema. Es como una receta de cocina para la computadora.', example: 'Algoritmo para hacer un sándwich: 1) Toma pan. 2) Pon jamón. 3) Pon queso. 4) Cierra con otra rebanada.' },
  { id: 'g20', term: 'Bug (Error)', category: 'Programación', emoji: '🐛', definition: 'Un error en el código que hace que el programa no funcione correctamente. ¡Encontrarlos y arreglarlos es parte de programar!', example: 'Si escribes primt("Hola") en vez de print("Hola"), tienes un bug de escritura (error de sintaxis).' },
  
  // === ARDUINO / ROBÓTICA ===
  { id: 'g21', term: 'Arduino', category: 'Robótica', emoji: '🤖', definition: 'Placa electrónica programable de código abierto. Es el "cerebro" de muchos proyectos de robótica que puedes programar desde tu computadora.', example: 'Con Arduino puedes hacer robots que esquivan obstáculos, regar plantas automáticamente o crear luces musicales.' },
  { id: 'g22', term: 'Sensor', category: 'Robótica', emoji: '👁️', definition: 'Componente que detecta información del mundo real (luz, temperatura, distancia, sonido) y la convierte en señales eléctricas para el robot.', example: 'Un sensor ultrasónico mide distancia como un murciélago: envía sonido y mide cuánto tarda en rebotar.' },
  { id: 'g23', term: 'Actuador', category: 'Robótica', emoji: '💪', definition: 'Componente que convierte señales eléctricas en movimiento o acción física. Son los "músculos" del robot.', example: 'Los motores, servomotores y altavoces son actuadores. El motor gira las ruedas, el servo mueve un brazo.' },
  { id: 'g24', term: 'Servo Motor', category: 'Robótica', emoji: '🦾', definition: 'Motor especial que puede girar a un ángulo exacto (0° a 180°). Ideal para mover brazos robóticos o girar sensores.', example: 'Puedes usar un servo para mover la cabeza de un robot: myServo.write(90) lo coloca al centro.' },
  { id: 'g25', term: 'Pin Digital', category: 'Robótica', emoji: '🔌', definition: 'Conector en Arduino que solo entiende dos estados: ENCENDIDO (HIGH/1) o APAGADO (LOW/0). Perfecto para LEDs y botones.', example: 'digitalWrite(13, HIGH) enciende el LED que está conectado al pin 13 del Arduino.' },
  { id: 'g26', term: 'Pin Analógico', category: 'Robótica', emoji: '📊', definition: 'Conector en Arduino que puede leer valores graduales entre 0 y 1023. Ideal para sensores que dan valores variables.', example: 'Un sensor de luz conectado al pin A0: analogRead(A0) puede dar 200 (oscuro) o 900 (muy brillante).' },
  { id: 'g27', term: 'Robot', category: 'Robótica', emoji: '🤖', definition: 'Máquina programable que puede percibir su entorno (sensores), tomar decisiones (cerebro/Arduino) y actuar (actuadores/motores).', example: 'Un robot seguidor de líneas usa sensores infrarrojos para ver la línea y motores para seguirla.' },
  
  // === MECÁNICA ===
  { id: 'g28', term: 'Engranaje', category: 'Mecánica', emoji: '⚙️', definition: 'Rueda dentada que transmite movimiento rotatorio. Dos engranajes juntos pueden cambiar la velocidad o la fuerza del movimiento.', example: 'En una bicicleta, los engranajes (piñones) permiten pedalear más fácil subiendo una colina.' },
  { id: 'g29', term: 'Palanca', category: 'Mecánica', emoji: '🎚️', definition: 'Barra rígida que gira sobre un punto fijo (fulcro). Permite mover objetos pesados con menos fuerza.', example: 'Un subibaja es una palanca. Poniendo el fulcro más cerca del peso, puedes levantarlo con menos esfuerzo.' },
  { id: 'g30', term: 'Polea', category: 'Mecánica', emoji: '🏗️', definition: 'Rueda con una cuerda que permite levantar objetos pesados cambiando la dirección de la fuerza.', example: 'Las grúas de construcción usan varias poleas juntas para levantar toneladas de material con un motor.' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos', emoji: '📚', color: 'bg-[#58CC02]' },
  { id: 'Electricidad', name: 'Electricidad', emoji: '⚡', color: 'bg-[#FFC800]' },
  { id: 'Electrónica', name: 'Electrónica', emoji: '🔌', color: 'bg-[#1CB0F6]' },
  { id: 'Programación', name: 'Programación', emoji: '💻', color: 'bg-[#58CC02]' },
  { id: 'Robótica', name: 'Robótica', emoji: '🤖', color: 'bg-[#FF4B4B]' },
  { id: 'Mecánica', name: 'Mecánica', emoji: '⚙️', color: 'bg-[#CE82FF]' },
];

const GlossaryScreen = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [favoriteTerms, setFavoriteTerms] = useState([]);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFavorite = (termId) => {
    setFavoriteTerms(prev => 
      prev.includes(termId) ? prev.filter(id => id !== termId) : [...prev, termId]
    );
  };

  const speakTerm = (term) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${term.term}. ${term.definition}`);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="pb-24 min-h-full bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-[#CE82FF] px-6 pt-6 pb-8 text-center border-b-4 border-[#A855F7]">
        <span className="text-4xl mb-1 block">📖</span>
        <h1 className="text-2xl font-black text-white">Diccionario Robótico</h1>
        <p className="text-white/80 text-sm font-bold mt-1">{GLOSSARY_TERMS.length} términos para aprender</p>
      </div>

      <div className="px-4 -mt-4 relative z-10">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#AFAFAF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar término..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-[#E5E5E5] focus:border-[#CE82FF] focus:ring-2 focus:ring-[#CE82FF]/20 outline-none text-sm font-bold text-[#3C3C3C] transition"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full font-black text-xs transition-all active:scale-95 ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white shadow-md scale-105`
                  : 'bg-white text-[#777] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7]'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-[#AFAFAF] font-bold mb-3">{filteredTerms.length} de {GLOSSARY_TERMS.length} términos</p>

        {/* Term list */}
        <div className="space-y-2.5 flex-grow overflow-y-auto stagger-children">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-5xl">🔍</span>
              <p className="text-base font-black text-[#AFAFAF] mt-3">No se encontraron términos</p>
            </div>
          ) : (
            filteredTerms.map(term => {
              const isExpanded = expandedTerm === term.id;
              const isFavorite = favoriteTerms.includes(term.id);
              const catColor = CATEGORIES.find(c => c.id === term.category)?.color || 'bg-gray-600';

              return (
                <div
                  key={term.id}
                  className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'border-[#CE82FF]' : 'border-[#E5E5E5]'
                  }`}
                >
                  <div
                    className="p-3.5 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedTerm(isExpanded ? null : term.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{term.emoji}</span>
                      <div>
                        <h3 className="text-sm font-black text-[#3C3C3C]">{term.term}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${catColor} mt-0.5`}>
                          {term.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); speakTerm(term); }}
                        className="p-1.5 rounded-lg bg-[#1CB0F6]/10 hover:bg-[#1CB0F6]/20 transition active:scale-90"
                      >
                        <Volume2 size={14} className="text-[#1CB0F6]" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(term.id); }}
                        className="p-1.5 rounded-lg bg-[#FFC800]/10 hover:bg-[#FFC800]/20 transition active:scale-90"
                      >
                        <span className="text-sm">{isFavorite ? '⭐' : '☆'}</span>
                      </button>
                      <span className={`text-xs text-[#AFAFAF] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 animate-slide-up">
                      <div className="bg-[#1CB0F6]/10 p-3 rounded-xl mb-2 border border-[#1CB0F6]/20">
                        <h4 className="font-black text-xs text-[#1CB0F6] mb-1 flex items-center"><Lightbulb size={12} className="mr-1" /> Definición</h4>
                        <p className="text-[#777] text-xs leading-relaxed font-semibold">{term.definition}</p>
                      </div>
                      <div className="bg-[#D7FFB8] p-3 rounded-xl border border-[#58CC02]/20">
                        <h4 className="font-black text-xs text-[#58CC02] mb-1">💡 Ejemplo</h4>
                        <p className="text-[#777] text-xs italic leading-relaxed font-semibold">{term.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export { GlossaryScreen, GLOSSARY_TERMS };
export default GlossaryScreen;
