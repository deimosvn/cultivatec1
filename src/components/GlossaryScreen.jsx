import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Volume2, VolumeX, Lightbulb, ChevronDown } from 'lucide-react';
import { RobotAvatar } from '../Onboarding';

// --- BASE DE DATOS DEL GLOSARIO (52 tÃ©rminos educativos) ---
export const GLOSSARY_TERMS = [
  // === ELECTRICIDAD ===
  { id: 'g1', term: 'ElectrÃ³n', category: 'Electricidad', emoji: 'âš¡', definition: 'PartÃ­cula diminuta con carga negativa que se mueve por los cables y crea la electricidad. Â¡Son como mini mensajeros de energÃ­a!', example: 'Cuando enciendes una linterna, millones de electrones se mueven por los cables desde la pila hasta el foco.' },
  { id: 'g2', term: 'Voltaje (V)', category: 'Electricidad', emoji: 'ðŸ”‹', definition: 'Es la "fuerza" o empuje que hace que los electrones se muevan. Se mide en Voltios (V). Es como la altura de un tobogÃ¡n de agua.', example: 'Una pila AA tiene 1.5V, un enchufe de casa tiene 120V o 220V (Â¡mucho mÃ¡s fuerte y peligroso!).' },
  { id: 'g3', term: 'Corriente (I)', category: 'Electricidad', emoji: 'ðŸŒŠ', definition: 'Es la cantidad de electrones que pasan por un cable en un segundo. Se mide en Amperios (A). Es como la cantidad de agua fluyendo por un rÃ­o.', example: 'Un LED necesita poca corriente (~20mA), pero un motor necesita mÃ¡s corriente para girar.' },
  { id: 'g4', term: 'Resistencia (R)', category: 'Electricidad', emoji: 'ðŸ›‘', definition: 'Es lo que frena el paso de los electrones. Se mide en Ohmios (Î©). Es como poner rocas en el camino del rÃ­o de electrones.', example: 'Usamos una resistencia de 220Î© para proteger un LED y que no se queme con demasiada corriente.' },
  { id: 'g5', term: 'Ley de Ohm', category: 'Electricidad', emoji: 'ðŸ“', definition: 'Una regla mÃ¡gica que relaciona Voltaje, Corriente y Resistencia: V = I Ã— R. Si sabes dos de estas, puedes calcular la tercera.', example: 'Si tienes una pila de 9V y una resistencia de 450Î©, la corriente serÃ¡: I = 9/450 = 0.02A = 20mA.' },
  { id: 'g6', term: 'Conductor', category: 'Electricidad', emoji: 'ðŸ›¤ï¸', definition: 'Material que permite que la electricidad pase fÃ¡cilmente. Los metales como el cobre y el aluminio son buenos conductores.', example: 'Los cables elÃ©ctricos son de cobre por dentro porque es un excelente conductor de electricidad.' },
  { id: 'g7', term: 'Aislante', category: 'Electricidad', emoji: 'ðŸ§¤', definition: 'Material que NO permite que la electricidad pase. El plÃ¡stico, la goma y la madera son buenos aislantes.', example: 'La cubierta de plÃ¡stico de los cables es un aislante: nos protege de tocar el cobre conductor.' },
  { id: 'g8', term: 'Circuito', category: 'Electricidad', emoji: 'ðŸ”„', definition: 'Un camino cerrado por donde viaja la electricidad, desde la fuente de energÃ­a hasta el componente que la usa y de vuelta.', example: 'Pila â†’ Cable â†’ LED â†’ Cable â†’ Pila. Si el camino se rompe (circuito abierto), la corriente se detiene.' },
  { id: 'g9', term: 'Corriente Directa (DC)', category: 'Electricidad', emoji: 'âž¡ï¸', definition: 'Tipo de electricidad que fluye siempre en la misma direcciÃ³n. Es la que usan las pilas y baterÃ­as.', example: 'Tu celular usa corriente directa de su baterÃ­a. Arduino tambiÃ©n funciona con corriente directa de 5V.' },
  { id: 'g10', term: 'Corriente Alterna (AC)', category: 'Electricidad', emoji: 'ã€°ï¸', definition: 'Tipo de electricidad que cambia de direcciÃ³n muchas veces por segundo. Es la que llega a los enchufes de tu casa.', example: 'En MÃ©xico la corriente alterna cambia de direcciÃ³n 60 veces por segundo (60 Hz).' },
  { id: 'g11', term: 'Cortocircuito', category: 'Electricidad', emoji: 'ðŸ”¥', definition: 'Cuando la electricidad encuentra un camino sin resistencia y fluye sin control. Â¡Es peligroso y puede causar calor o fuego!', example: 'Si conectas directamente los dos polos de una pila con un cable, haces un cortocircuito: el cable se calienta mucho.' },
  { id: 'g12', term: 'Tierra (GND)', category: 'Electricidad', emoji: 'ðŸŒ', definition: 'El punto de referencia de un circuito con voltaje cero. Todos los circuitos necesitan un camino de regreso a tierra.', example: 'En Arduino, el pin GND es la tierra. Siempre debes conectar tus componentes a GND para cerrar el circuito.' },

  // === ELECTRÃ“NICA ===
  { id: 'g13', term: 'LED', category: 'ElectrÃ³nica', emoji: 'ðŸ’¡', definition: 'Diodo Emisor de Luz. Un componente que brilla cuando pasa corriente en la direcciÃ³n correcta. Tiene una pata larga (+) y una corta (-).', example: 'Los semÃ¡foros modernos, las pantallas de TV y las luces de colores usan LEDs.' },
  { id: 'g14', term: 'Resistor', category: 'ElectrÃ³nica', emoji: 'ðŸ·ï¸', definition: 'Componente con bandas de colores que limita la corriente en un circuito. Los colores indican su valor en Ohmios.', example: 'Un resistor con bandas rojo-rojo-marrÃ³n tiene 220Î©, perfecto para proteger un LED con una pila de 5V.' },
  { id: 'g15', term: 'Diodo', category: 'ElectrÃ³nica', emoji: 'ðŸšª', definition: 'Componente que solo permite que la corriente fluya en una direcciÃ³n, como una puerta de una sola vÃ­a.', example: 'Los cargadores de celular usan diodos para convertir la corriente alterna de tu casa en corriente directa.' },
  { id: 'g16', term: 'Transistor', category: 'ElectrÃ³nica', emoji: 'ðŸš¦', definition: 'Componente que actÃºa como un interruptor electrÃ³nico o amplificador. Puede encender/apagar circuitos usando una seÃ±al pequeÃ±a.', example: 'Un Arduino usa transistores para manejar motores: una seÃ±al pequeÃ±a del chip controla mucha corriente del motor.' },
  { id: 'g17', term: 'Capacitor', category: 'ElectrÃ³nica', emoji: 'ðŸ«™', definition: 'Componente que almacena energÃ­a elÃ©ctrica temporalmente, como un vaso que se llena de agua y luego se vacÃ­a.', example: 'En un flash de cÃ¡mara, un capacitor se carga lentamente y luego libera toda la energÃ­a de golpe: Â¡flash!' },
  { id: 'g18', term: 'Protoboard', category: 'ElectrÃ³nica', emoji: 'ðŸ•³ï¸', definition: 'Tablero de pruebas con agujeros conectados internamente. Permite armar circuitos sin soldar, ideal para experimentar.', example: 'En las clases de robÃ³tica, usamos la protoboard para conectar LEDs, resistencias y el Arduino sin soldar nada.' },
  { id: 'g19', term: 'PotenciÃ³metro', category: 'ElectrÃ³nica', emoji: 'ðŸŽ›ï¸', definition: 'Resistencia variable que puedes ajustar girando una perilla. Permite controlar cuÃ¡nta corriente pasa por un circuito.', example: 'El control de volumen de una bocina es un potenciÃ³metro: al girarlo cambia la resistencia y el volumen.' },
  { id: 'g20', term: 'Buzzer (Zumbador)', category: 'ElectrÃ³nica', emoji: 'ðŸ””', definition: 'Componente que produce sonido cuando le llega electricidad. Puede hacer tonos simples como pitidos y melodÃ­as.', example: 'Con Arduino puedes programar un buzzer para que toque melodÃ­as: tone(8, 440) suena la nota LA.' },
  { id: 'g21', term: 'Relay (Relevador)', category: 'ElectrÃ³nica', emoji: 'ðŸ”€', definition: 'Interruptor controlado elÃ©ctricamente. Una seÃ±al pequeÃ±a puede encender o apagar un circuito de mucha potencia.', example: 'Puedes usar un relay con Arduino para encender y apagar una lÃ¡mpara de casa con un botÃ³n.' },
  { id: 'g22', term: 'Fotorresistencia (LDR)', category: 'ElectrÃ³nica', emoji: 'ðŸŒž', definition: 'Resistencia que cambia segÃºn la luz. Con mucha luz tiene poca resistencia, en la oscuridad tiene mucha.', example: 'Las lÃ¡mparas automÃ¡ticas de jardÃ­n usan LDR: detectan cuando oscurece y se encienden solas.' },
  
  // === PROGRAMACIÃ“N ===
  { id: 'g23', term: 'Variable', category: 'ProgramaciÃ³n', emoji: 'ðŸ“¦', definition: 'Un contenedor con nombre donde guardamos informaciÃ³n (nÃºmeros, texto, etc.) en un programa. Es como una caja etiquetada.', example: 'int edad = 10; guarda el nÃºmero 10 en una "caja" llamada edad.' },
  { id: 'g24', term: 'FunciÃ³n', category: 'ProgramaciÃ³n', emoji: 'âš™ï¸', definition: 'Un bloque de cÃ³digo con nombre que realiza una tarea especÃ­fica. La puedes llamar (usar) muchas veces sin repetir cÃ³digo.', example: 'En Arduino, la funciÃ³n digitalWrite(13, HIGH) enciende un LED. La puedes usar cuantas veces quieras.' },
  { id: 'g25', term: 'Bucle (Loop)', category: 'ProgramaciÃ³n', emoji: 'ðŸ”', definition: 'InstrucciÃ³n que repite un bloque de cÃ³digo varias veces. Evita escribir lo mismo una y otra vez.', example: 'for(int i=0; i<5; i++) { parpadear(); } hace que un LED parpadee 5 veces sin escribir 5 lÃ­neas.' },
  { id: 'g26', term: 'Condicional (if/else)', category: 'ProgramaciÃ³n', emoji: 'ðŸ”€', definition: 'InstrucciÃ³n que hace algo diferente segÃºn una condiciÃ³n. Es como un semÃ¡foro: si es verde, avanza; si es rojo, detente.', example: 'if(distancia < 20) { retroceder(); } else { avanzar(); } â€” el robot decide quÃ© hacer segÃºn la distancia.' },
  { id: 'g27', term: 'Algoritmo', category: 'ProgramaciÃ³n', emoji: 'ðŸ“‹', definition: 'Una lista ordenada de pasos para resolver un problema. Es como una receta de cocina para la computadora.', example: 'Algoritmo para esquivar: 1) Leer sensor. 2) Si hay obstÃ¡culo, girar. 3) Si no, avanzar. 4) Repetir.' },
  { id: 'g28', term: 'Bug (Error)', category: 'ProgramaciÃ³n', emoji: 'ðŸ›', definition: 'Un error en el cÃ³digo que hace que el programa no funcione correctamente. Â¡Encontrarlos y arreglarlos es parte de programar!', example: 'Si escribes digitalWrit(13, HIGH) en vez de digitalWrite(13, HIGH), tienes un bug de escritura.' },
  { id: 'g29', term: 'LibrerÃ­a', category: 'ProgramaciÃ³n', emoji: 'ðŸ“š', definition: 'ColecciÃ³n de cÃ³digo ya escrito que puedes usar en tu programa. Te ahorra trabajo dÃ¡ndote funciones listas para usar.', example: '#include <Servo.h> te da funciones como myServo.write(90) para controlar servomotores fÃ¡cilmente.' },
  { id: 'g30', term: 'Serial Monitor', category: 'ProgramaciÃ³n', emoji: 'ðŸ–¥ï¸', definition: 'Herramienta de Arduino que muestra mensajes de tu programa en la computadora. Sirve para saber quÃ© estÃ¡ haciendo tu robot.', example: 'Serial.println(distancia); muestra en tu pantalla cuÃ¡ntos centÃ­metros detecta el sensor ultrasÃ³nico.' },
  { id: 'g31', term: 'Depurar (Debug)', category: 'ProgramaciÃ³n', emoji: 'ðŸ”', definition: 'El proceso de encontrar y corregir errores en un programa. Es como ser detective buscando pistas de lo que falla.', example: 'Si tu robot no gira, depuras revisando el cÃ³digo lÃ­nea por lÃ­nea hasta encontrar el error.' },
  { id: 'g32', term: 'Compilar', category: 'ProgramaciÃ³n', emoji: 'ðŸ—ï¸', definition: 'Convertir tu cÃ³digo escrito en lenguaje humano a instrucciones que la mÃ¡quina pueda entender y ejecutar.', example: 'En Arduino IDE, al presionar el botÃ³n "Verificar" (âœ“) se compila tu cÃ³digo y te dice si hay errores.' },
  
  // === ARDUINO / ROBÃ“TICA ===
  { id: 'g33', term: 'Arduino', category: 'RobÃ³tica', emoji: 'ðŸ¤–', definition: 'Placa electrÃ³nica programable de cÃ³digo abierto. Es el "cerebro" de muchos proyectos de robÃ³tica que puedes programar desde tu computadora.', example: 'Con Arduino puedes hacer robots que esquivan obstÃ¡culos, regar plantas automÃ¡ticamente o crear luces musicales.' },
  { id: 'g34', term: 'Sensor', category: 'RobÃ³tica', emoji: 'ðŸ‘ï¸', definition: 'Componente que detecta informaciÃ³n del mundo real (luz, temperatura, distancia, sonido) y la convierte en seÃ±ales elÃ©ctricas para el robot.', example: 'Un sensor ultrasÃ³nico mide distancia como un murciÃ©lago: envÃ­a sonido y mide cuÃ¡nto tarda en rebotar.' },
  { id: 'g35', term: 'Actuador', category: 'RobÃ³tica', emoji: 'ðŸ’ª', definition: 'Componente que convierte seÃ±ales elÃ©ctricas en movimiento o acciÃ³n fÃ­sica. Son los "mÃºsculos" del robot.', example: 'Los motores, servomotores y altavoces son actuadores. El motor gira las ruedas, el servo mueve un brazo.' },
  { id: 'g36', term: 'Servo Motor', category: 'RobÃ³tica', emoji: 'ðŸ¦¾', definition: 'Motor especial que puede girar a un Ã¡ngulo exacto (0Â° a 180Â°). Ideal para mover brazos robÃ³ticos o girar sensores.', example: 'myServo.write(90) coloca el servo al centro. myServo.write(0) al inicio. myServo.write(180) al final.' },
  { id: 'g37', term: 'Motor DC', category: 'RobÃ³tica', emoji: 'ðŸ”„', definition: 'Motor que gira continuamente cuando recibe corriente directa. Ideal para las ruedas de un robot.', example: 'Los carros de control remoto usan motores DC. Con un puente H puedes hacerlos girar en ambas direcciones.' },
  { id: 'g38', term: 'Pin Digital', category: 'RobÃ³tica', emoji: 'ðŸ”Œ', definition: 'Conector en Arduino que solo entiende dos estados: ENCENDIDO (HIGH/1) o APAGADO (LOW/0). Perfecto para LEDs y botones.', example: 'digitalWrite(13, HIGH) enciende el LED conectado al pin 13 del Arduino.' },
  { id: 'g39', term: 'Pin AnalÃ³gico', category: 'RobÃ³tica', emoji: 'ðŸ“Š', definition: 'Conector en Arduino que puede leer valores graduales entre 0 y 1023. Ideal para sensores que dan valores variables.', example: 'analogRead(A0) puede dar 200 (oscuro) o 900 (muy brillante) segÃºn la luz que reciba el sensor.' },
  { id: 'g40', term: 'PWM', category: 'RobÃ³tica', emoji: 'ðŸ“¶', definition: 'ModulaciÃ³n por Ancho de Pulso. TÃ©cnica para simular voltajes intermedios, prendiendo y apagando muy rÃ¡pido. Controla brillo de LED o velocidad de motor.', example: 'analogWrite(9, 128) da medio brillo a un LED. analogWrite(9, 255) da brillo mÃ¡ximo.' },
  { id: 'g41', term: 'Robot', category: 'RobÃ³tica', emoji: 'ðŸ¤–', definition: 'MÃ¡quina programable que puede percibir su entorno (sensores), tomar decisiones (cerebro/Arduino) y actuar (actuadores/motores).', example: 'Un robot seguidor de lÃ­neas usa sensores infrarrojos para ver la lÃ­nea y motores para seguirla.' },
  { id: 'g42', term: 'Sensor UltrasÃ³nico', category: 'RobÃ³tica', emoji: 'ðŸ¦‡', definition: 'Sensor que mide distancia enviando ondas de sonido y midiendo cuÃ¡nto tardan en regresar. Funciona como el sonar de los murciÃ©lagos.', example: 'El HC-SR04 puede medir objetos de 2cm a 400cm. Ideal para que tu robot detecte paredes y obstÃ¡culos.' },
  { id: 'g43', term: 'Sensor Infrarrojo', category: 'RobÃ³tica', emoji: 'ðŸ”´', definition: 'Sensor que detecta luz infrarroja (invisible al ojo humano). Sirve para detectar objetos cercanos o seguir lÃ­neas en el suelo.', example: 'Los robots siguelÃ­neas usan sensores IR apuntando al suelo: detectan la diferencia entre negro y blanco.' },
  { id: 'g44', term: 'Puente H', category: 'RobÃ³tica', emoji: 'ðŸŒ‰', definition: 'Circuito que permite controlar la direcciÃ³n de giro de un motor DC. Puede hacerlo girar hacia adelante o hacia atrÃ¡s.', example: 'El mÃ³dulo L298N es un puente H dual: controla 2 motores, cada uno puede ir adelante o atrÃ¡s.' },
  { id: 'g45', term: 'Shield (Escudo)', category: 'RobÃ³tica', emoji: 'ðŸ›¡ï¸', definition: 'Placa que se conecta encima de Arduino para agregarle funciones extra como WiFi, control de motores o pantalla.', example: 'Un Motor Shield se coloca sobre Arduino y te permite conectar y controlar hasta 4 motores fÃ¡cilmente.' },
  
  // === MECÃNICA ===
  { id: 'g46', term: 'Engranaje', category: 'MecÃ¡nica', emoji: 'âš™ï¸', definition: 'Rueda dentada que transmite movimiento rotatorio. Dos engranajes juntos pueden cambiar la velocidad o la fuerza del movimiento.', example: 'En una bicicleta, los engranajes (piÃ±ones) permiten pedalear mÃ¡s fÃ¡cil subiendo una colina.' },
  { id: 'g47', term: 'Palanca', category: 'MecÃ¡nica', emoji: 'ðŸŽšï¸', definition: 'Barra rÃ­gida que gira sobre un punto fijo (fulcro). Permite mover objetos pesados con menos fuerza.', example: 'Un subibaja es una palanca. Poniendo el fulcro mÃ¡s cerca del peso, puedes levantarlo con menos esfuerzo.' },
  { id: 'g48', term: 'Polea', category: 'MecÃ¡nica', emoji: 'ðŸ—ï¸', definition: 'Rueda con una cuerda que permite levantar objetos pesados cambiando la direcciÃ³n de la fuerza.', example: 'Las grÃºas de construcciÃ³n usan varias poleas juntas para levantar toneladas de material con un motor.' },
  { id: 'g49', term: 'Rueda y Eje', category: 'MecÃ¡nica', emoji: 'ðŸ›ž', definition: 'MÃ¡quina simple que reduce la fricciÃ³n y facilita mover objetos. La rueda gira alrededor de un eje central.', example: 'Las ruedas de un robot reducen la fricciÃ³n con el suelo, permitiendo que un motor pequeÃ±o lo mueva fÃ¡cilmente.' },
  { id: 'g50', term: 'Chasis', category: 'MecÃ¡nica', emoji: 'ðŸš—', definition: 'La estructura o armazÃ³n principal de un robot donde se montan todos los componentes: motores, sensores, Arduino y baterÃ­a.', example: 'Puedes hacer un chasis con acrÃ­lico, madera, o incluso cartÃ³n grueso para tu primer robot.' },
  { id: 'g51', term: 'Tornillo', category: 'MecÃ¡nica', emoji: 'ðŸ”©', definition: 'Pieza metÃ¡lica en espiral que une partes de un robot. Es una mÃ¡quina simple que convierte giro en fuerza de sujeciÃ³n.', example: 'Usamos tornillos M3 para fijar los motores al chasis del robot y que no se muevan al avanzar.' },
  { id: 'g52', term: 'Plano Inclinado', category: 'MecÃ¡nica', emoji: 'ðŸ“', definition: 'Superficie plana inclinada que facilita subir objetos pesados a una altura usando menos fuerza, pero mÃ¡s distancia.', example: 'Una rampa para robots es un plano inclinado: el robot sube poco a poco en vez de saltar verticalmente.' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos', emoji: 'ðŸ“š', color: '#2563EB' },
  { id: 'Electricidad', name: 'Electricidad', emoji: 'âš¡', color: '#EAB308' },
  { id: 'ElectrÃ³nica', name: 'ElectrÃ³nica', emoji: 'ðŸ”Œ', color: '#1CB0F6' },
  { id: 'ProgramaciÃ³n', name: 'ProgramaciÃ³n', emoji: 'ðŸ’»', color: '#58CC02' },
  { id: 'RobÃ³tica', name: 'RobÃ³tica', emoji: 'ðŸ¤–', color: '#EF4444' },
  { id: 'MecÃ¡nica', name: 'MecÃ¡nica', emoji: 'âš™ï¸', color: '#3B82F6' },
];

// Frases del robot al leer definiciones
const ROBOT_READING_PHRASES = [
  'Â¡Escucha bien! Te voy a explicar esto...',
  'Â¡Oye! Esto es sÃºper interesante...',
  'Â¿Listo para aprender? Â¡AhÃ­ va!',
  'Â¡AtenciÃ³n! Esto es importante...',
  'Â¡DÃ©jame contarte sobre esto!',
  'Â¿SabÃ­as esto? Â¡Mira!',
  'Â¡Ponme atenciÃ³n, que te enseÃ±o!',
  'Â¡Esta es una de mis palabras favoritas!',
];

const ROBOT_IDLE_PHRASES = [
  'Â¡Toca un tÃ©rmino y presiona ðŸ”Š para que te lo lea!',
  'Â¡Tengo muchas palabras que enseÃ±arte!',
  'Â¡Busca cualquier palabra y te la explico!',
  'Â¡Soy tu diccionario robÃ³tico parlante!',
];

const GlossaryScreen = ({ robotConfig, robotName = 'Robi' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [favoriteTerms, setFavoriteTerms] = useState(() => {
    try { return JSON.parse(localStorage.getItem('glossary_favorites') || '[]'); } catch { return []; }
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingTermId, setSpeakingTermId] = useState(null);
  const [robotPhrase, setRobotPhrase] = useState(() => ROBOT_IDLE_PHRASES[Math.floor(Math.random() * ROBOT_IDLE_PHRASES.length)]);
  const [robotMood, setRobotMood] = useState('idle'); // 'idle' | 'speaking' | 'happy'
  const speechRef = useRef(null);
  const termsListRef = useRef(null);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('glossary_favorites', JSON.stringify(favoriteTerms));
  }, [favoriteTerms]);

  // Cancel speech on unmount
  useEffect(() => {
    return () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
  }, []);

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

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingTermId(null);
    setRobotMood('idle');
    setRobotPhrase(ROBOT_IDLE_PHRASES[Math.floor(Math.random() * ROBOT_IDLE_PHRASES.length)]);
  };

  const speakTerm = (term) => {
    if (!('speechSynthesis' in window)) return;

    // Toggle off if already speaking this one
    if (speakingTermId === term.id) { stopSpeaking(); return; }

    speechSynthesis.cancel();

    const phrase = ROBOT_READING_PHRASES[Math.floor(Math.random() * ROBOT_READING_PHRASES.length)];
    setRobotPhrase(phrase);
    setRobotMood('speaking');
    setIsSpeaking(true);
    setSpeakingTermId(term.id);
    setExpandedTerm(term.id);

    const fullText = `${term.term}. ${term.definition}. Por ejemplo: ${term.example}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-MX';
    utterance.rate = 0.82;
    utterance.pitch = 1.1;

    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingTermId(null);
      setRobotMood('happy');
      setRobotPhrase('Â¡Listo! Â¿Quieres que te lea otro tÃ©rmino?');
      setTimeout(() => {
        setRobotMood('idle');
        setRobotPhrase(ROBOT_IDLE_PHRASES[Math.floor(Math.random() * ROBOT_IDLE_PHRASES.length)]);
      }, 3000);
    };

    utterance.onerror = () => stopSpeaking();

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const getCategoryColor = (catId) => CATEGORIES.find(c => c.id === catId)?.color || '#2563EB';

  return (
    <div className="pb-24 min-h-full bg-gradient-to-b from-blue-50 to-white flex flex-col animate-fade-in">
      {/* ====== HEADER CON ROBOT ====== */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-4 pt-5 pb-6 text-center relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-2 left-4 text-4xl">ðŸ“–</div>
          <div className="absolute top-8 right-6 text-3xl">âš¡</div>
          <div className="absolute bottom-4 left-8 text-2xl">ðŸ”Œ</div>
          <div className="absolute bottom-2 right-4 text-3xl">âš™ï¸</div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Robot Avatar */}
          <div className={`relative transition-transform duration-500 ${robotMood === 'speaking' ? 'scale-110' : robotMood === 'happy' ? 'scale-105' : ''}`}>
            <div className={robotMood === 'speaking' ? 'animate-pulse' : ''}>
              {robotConfig ? (
                <RobotAvatar config={robotConfig} size={90} animate={robotMood === 'speaking'} />
              ) : (
                <div className="w-[90px] h-[90px] flex items-center justify-center">
                  <span className="text-6xl">ðŸ¤–</span>
                </div>
              )}
            </div>
            {/* Sound-wave indicator while speaking */}
            {robotMood === 'speaking' && (
              <div className="absolute -right-1 -top-1 flex gap-0.5">
                <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>

          {/* Speech Bubble */}
          <div className="mt-2 bg-white/95 rounded-2xl px-4 py-2.5 max-w-[280px] relative shadow-lg">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45 rounded-sm"></div>
            <p className={`text-xs font-bold text-center relative z-10 ${robotMood === 'speaking' ? 'text-[#2563EB]' : 'text-[#555]'}`}>
              {robotMood === 'speaking' && <span className="inline-block mr-1 animate-pulse">ðŸ”Š</span>}
              {robotPhrase}
            </p>
          </div>

          <h1 className="text-xl font-black text-white mt-2 flex items-center gap-2">
            ðŸ“– Diccionario de {robotName || 'Robi'}
          </h1>
          <p className="text-white/70 text-xs font-bold mt-0.5">{GLOSSARY_TERMS.length} tÃ©rminos Â· Â¡Presiona ðŸ”Š para escuchar!</p>
        </div>
      </div>

      {/* ====== BODY ====== */}
      <div className="px-4 -mt-3 relative z-10 flex-1">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#AFAFAF]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Buscar tÃ©rmino... (ej: "LED", "sensor")'
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-[#E5E5E5] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none text-sm font-bold text-[#3C3C3C] transition shadow-sm"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            const count = cat.id === 'all' ? GLOSSARY_TERMS.length : GLOSSARY_TERMS.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-2xl font-black text-xs transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white shadow-lg scale-[1.03]'
                    : 'bg-white text-[#777] border-2 border-[#E5E5E5] hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25' : 'bg-gray-100'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Counter + stop button */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] text-[#AFAFAF] font-bold">{filteredTerms.length} de {GLOSSARY_TERMS.length} tÃ©rminos</p>
          {isSpeaking && (
            <button onClick={stopSpeaking} className="flex items-center gap-1 text-[11px] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-full active:scale-95 transition">
              <VolumeX size={12} /> Detener audio
            </button>
          )}
        </div>

        {/* ====== TERM LIST ====== */}
        <div className="space-y-2.5 flex-grow overflow-y-auto" ref={termsListRef}>
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-3">ðŸ”</span>
              <p className="text-base font-black text-[#AFAFAF]">No se encontraron tÃ©rminos</p>
              <p className="text-xs text-[#CFCFCF] font-bold mt-1">Intenta con otra palabra</p>
            </div>
          ) : (
            filteredTerms.map(term => {
              const isExpanded = expandedTerm === term.id;
              const isFavorite = favoriteTerms.includes(term.id);
              const isCurrentlySpeaking = speakingTermId === term.id;
              const catColor = getCategoryColor(term.category);

              return (
                <div
                  key={term.id}
                  className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden shadow-sm ${
                    isCurrentlySpeaking
                      ? 'border-[#2563EB] shadow-[#2563EB]/20 shadow-md ring-2 ring-[#2563EB]/10'
                      : isExpanded ? 'border-blue-200' : 'border-[#E5E5E5]'
                  }`}
                >
                  {/* Term header */}
                  <div className="p-3 cursor-pointer flex items-center gap-3" onClick={() => setExpandedTerm(isExpanded ? null : term.id)}>
                    {/* Emoji badge */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ backgroundColor: catColor + '15' }}>
                      {term.emoji}
                    </div>

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-[#3C3C3C] truncate">{term.term}</h3>
                      <span className="inline-block px-2 py-0.5 rounded-full text-white text-[9px] font-bold mt-0.5"
                        style={{ backgroundColor: catColor }}>{term.category}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* SPEAK */}
                      <button
                        onClick={(e) => { e.stopPropagation(); speakTerm(term); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
                          isCurrentlySpeaking
                            ? 'bg-[#2563EB] text-white shadow-md animate-pulse'
                            : 'bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/20'
                        }`}
                        title={isCurrentlySpeaking ? 'Detener lectura' : `Escuchar: ${term.term}`}
                      >
                        {isCurrentlySpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>

                      {/* FAVORITE */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(term.id); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
                          isFavorite ? 'bg-yellow-100' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-base">{isFavorite ? 'â­' : 'â˜†'}</span>
                      </button>

                      {/* CHEVRON */}
                      <ChevronDown size={16} className={`text-[#AFAFAF] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 animate-slide-up">
                      {/* Definition â€” styled as robot chat bubble */}
                      <div className="flex gap-2.5 mb-2">
                        <div className="flex-shrink-0 mt-1">
                          {robotConfig ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center border border-blue-200">
                              <RobotAvatar config={robotConfig} size={28} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200 text-sm">ðŸ¤–</div>
                          )}
                        </div>
                        <div className="flex-1 bg-[#2563EB]/5 p-3 rounded-2xl rounded-tl-md border border-[#2563EB]/10">
                          <h4 className="font-black text-[10px] text-[#2563EB] mb-1 uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb size={10} /> DefiniciÃ³n
                          </h4>
                          <p className="text-[#555] text-xs leading-relaxed font-semibold">{term.definition}</p>
                        </div>
                      </div>

                      {/* Example */}
                      <div className="ml-10">
                        <div className="bg-green-50 p-3 rounded-2xl border border-green-200/50">
                          <h4 className="font-black text-[10px] text-[#58CC02] mb-1 uppercase tracking-wider">ðŸ’¡ Ejemplo</h4>
                          <p className="text-[#666] text-xs italic leading-relaxed font-semibold">{term.example}</p>
                        </div>
                      </div>

                      {/* Big speak button */}
                      <button
                        onClick={() => speakTerm(term)}
                        className={`mt-3 w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                          isCurrentlySpeaking
                            ? 'bg-red-500 text-white'
                            : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                        }`}
                      >
                        {isCurrentlySpeaking ? (
                          <><VolumeX size={14} /> Detener lectura</>
                        ) : (
                          <><Volume2 size={14} /> {robotName || 'Robi'}, Â¡lÃ©eme esto! ðŸ”Š</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Fun fact footer */}
        <div className="mt-6 mb-4 bg-gradient-to-r from-[#2563EB]/5 to-blue-50 rounded-2xl p-4 border border-[#2563EB]/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ðŸ’¡</span>
            <div>
              <h4 className="text-xs font-black text-[#2563EB] mb-1">Â¿SabÃ­as que...?</h4>
              <p className="text-[11px] text-[#777] font-semibold leading-relaxed">
                La palabra "robot" viene del checo "robota" que significa "trabajo forzado". Fue usada por primera vez en 1920 por el escritor Karel ÄŒapek en una obra de teatro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlossaryScreen;
