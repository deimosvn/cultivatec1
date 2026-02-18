const fs = require('fs');

let lines = fs.readFileSync('src/data/modulesData.js', 'utf8').split('\n');

const mainIds = ['mod_intro_robot','mod_partes_robot','mod_primer_proyecto','mod_electr','mod_electon','mod_prog_gen','mod_mecanica','mod_arduino','mod_cpp','mod_python','mod_robotica','mod_componentes','mod_control','mod_prog_avanzada','mod_diseno','mod_primer_led'];

const questions = {
  'mod_intro_robot': [
    `            { titulo: "✅ Quiz: Historia de la Robótica", tipo: 'mini_quiz', pregunta: "¿Quién acuñó el término 'robot' por primera vez?", opciones: ["Isaac Asimov", "Karel Čapek en su obra R.U.R. (1920)", "Leonardo da Vinci", "Nikola Tesla"], respuestaCorrecta: 1, explicacion: "Karel Čapek usó 'robot' (del checo 'robota' = trabajo forzado) en su obra de teatro R.U.R. de 1920. ¡Tiene más de 100 años! 🎭" },`,
    `            { titulo: "✅ Quiz: Leyes de la Robótica", tipo: 'mini_quiz', pregunta: "¿Quién escribió las famosas 3 leyes de la robótica?", opciones: ["Elon Musk", "Isaac Asimov en su ficción científica", "Albert Einstein", "Steve Jobs"], respuestaCorrecta: 1, explicacion: "Isaac Asimov las planteó en 1942. La 1ª ley: un robot no puede dañar a un ser humano. Son ficción pero inspiran la ética robótica real. 📚" },`,
    `            { titulo: "✅ Quiz: Robot vs Autómata", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia principal entre un robot y un autómata?", opciones: ["No hay diferencia", "El robot puede reprogramarse y adaptarse; el autómata repite una acción fija", "El autómata es más caro", "El robot es más pequeño"], respuestaCorrecta: 1, explicacion: "Un autómata (como un reloj cucú) hace siempre lo mismo. Un robot puede reprogramarse para nuevas tareas. ¡Flexibilidad! 🤖" },`,
    `            { titulo: "✅ Quiz: Tipos de Robots", tipo: 'mini_quiz', pregunta: "¿Qué tipo de robot se usa en líneas de ensamblaje de automóviles?", opciones: ["Robot humanoide", "Robot industrial articulado (brazo robótico)", "Dron", "Robot social"], respuestaCorrecta: 1, explicacion: "Los brazos robóticos industriales sueldan, pintan y ensamblan miles de autos al día con precisión milimétrica. 🏭" },`,
  ],
  'mod_partes_robot': [
    `            { titulo: "✅ Quiz: Actuadores", tipo: 'mini_quiz', pregunta: "¿Qué es un actuador en un robot?", opciones: ["Un sensor", "Un componente que convierte energía en movimiento (motores, servos, pistones)", "Un cable", "Una batería"], respuestaCorrecta: 1, explicacion: "Los actuadores son los 'músculos' del robot. Motores DC, servos, stepper motors y actuadores neumáticos generan movimiento. 💪" },`,
    `            { titulo: "✅ Quiz: Procesador del Robot", tipo: 'mini_quiz', pregunta: "¿Cuál es la función del microcontrolador en un robot?", opciones: ["Dar energía", "Procesar información de sensores y enviar comandos a actuadores (el cerebro)", "Solo almacenar datos", "Solo comunicarse"], respuestaCorrecta: 1, explicacion: "El microcontrolador es el cerebro: lee sensores → toma decisiones → controla motores. Arduino, ESP32, Raspberry Pi. 🧠" },`,
    `            { titulo: "✅ Quiz: Fuente de Energía", tipo: 'mini_quiz', pregunta: "¿Cuál es el principal desafío de energía en robots móviles?", opciones: ["Son muy ruidosos", "Las baterías tienen duración limitada y añaden peso al robot", "No necesitan energía", "Siempre usan cables"], respuestaCorrecta: 1, explicacion: "Las baterías limitan el tiempo de operación y añaden peso. Equilibrar autonomía vs peso es un desafío constante en robótica móvil. 🔋" },`,
    `            { titulo: "✅ Quiz: Sensores Básicos", tipo: 'mini_quiz', pregunta: "¿Qué tipo de sensor usarías para que un robot detecte una pared?", opciones: ["Sensor de temperatura", "Sensor de distancia (ultrasónico o infrarrojo)", "Sensor de luz", "Micrófono"], respuestaCorrecta: 1, explicacion: "Los sensores ultrasónicos (HC-SR04) e infrarrojos miden distancia. Detectan paredes, obstáculos y bordes de mesa. 📡" },`,
  ],
  'mod_primer_proyecto': [
    `            { titulo: "✅ Quiz: Protoboard", tipo: 'mini_quiz', pregunta: "¿Cómo están conectadas las filas de una protoboard internamente?", opciones: ["No están conectadas", "Cada fila horizontal de 5 hoyos está conectada internamente", "Todas las filas están conectadas", "Solo las filas pares"], respuestaCorrecta: 1, explicacion: "En la zona central, cada fila de 5 hoyos comparte la misma línea eléctrica. Las columnas laterales son para alimentación (+/-). 🔌" },`,
    `            { titulo: "✅ Quiz: Resistencia LED", tipo: 'mini_quiz', pregunta: "¿Por qué se necesita una resistencia al conectar un LED a Arduino?", opciones: ["Para que brille más", "Para limitar la corriente y evitar que el LED se queme", "Por estética", "No se necesita"], respuestaCorrecta: 1, explicacion: "Sin resistencia, el LED recibe demasiada corriente (>20mA) y se quema. Una resistencia de 220Ω-1KΩ lo protege. ¡Siempre con resistencia! ⚡" },`,
  ],
  'mod_electr': [
    `            { titulo: "✅ Quiz: Ley de Ohm", tipo: 'mini_quiz', pregunta: "¿Qué establece la Ley de Ohm?", opciones: ["V = I × R (voltaje = corriente × resistencia)", "V = I + R", "V = I / R", "V = I - R"], respuestaCorrecta: 0, explicacion: "V = I × R es la ley fundamental de la electricidad. Si conoces dos valores, calculas el tercero. ¡Memorízala! ⚡" },`,
    `            { titulo: "✅ Quiz: Serie vs Paralelo", tipo: 'mini_quiz', pregunta: "¿Qué pasa con el voltaje en un circuito en serie?", opciones: ["Se multiplica", "Se divide entre los componentes (cada uno recibe una parte)", "Permanece igual para todos", "Desaparece"], respuestaCorrecta: 1, explicacion: "En serie, el voltaje total se reparte. 3 LEDs en serie con 9V = 3V por LED. En paralelo, todos reciben el mismo voltaje. 🔋" },`,
    `            { titulo: "✅ Quiz: Corriente Continua", tipo: 'mini_quiz', pregunta: "¿Qué diferencia hay entre corriente continua (DC) y alterna (AC)?", opciones: ["No hay diferencia", "DC fluye en una sola dirección; AC cambia de dirección periódicamente", "DC es más peligrosa", "AC solo existe en laboratorios"], respuestaCorrecta: 1, explicacion: "DC (baterías, Arduino) fluye en una dirección. AC (enchufes de casa) cambia 50-60 veces por segundo. Los robots usan DC. ⚡" },`,
  ],
  'mod_electon': [
    `            { titulo: "✅ Quiz: Diodo LED", tipo: 'mini_quiz', pregunta: "¿Qué significa LED?", opciones: ["Light Energy Device", "Light Emitting Diode (Diodo Emisor de Luz)", "Low Energy Display", "Laser Electronic Device"], respuestaCorrecta: 1, explicacion: "LED = Light Emitting Diode. Es un diodo que emite luz cuando la corriente pasa en una dirección. El largo es + y el corto es -. 💡" },`,
    `            { titulo: "✅ Quiz: Transistor", tipo: 'mini_quiz', pregunta: "¿Para qué se usa un transistor en electrónica?", opciones: ["Solo como resistencia", "Como interruptor electrónico o amplificador de señal", "Solo para medir voltaje", "Para almacenar datos"], respuestaCorrecta: 1, explicacion: "El transistor es el componente más importante de la electrónica. Actúa como interruptor (on/off) o amplifica señales débiles. 🔧" },`,
    `            { titulo: "✅ Quiz: Capacitor", tipo: 'mini_quiz', pregunta: "¿Cuál es la función principal de un capacitor?", opciones: ["Generar voltaje", "Almacenar y liberar carga eléctrica temporalmente", "Medir corriente", "Solo decorativo"], respuestaCorrecta: 1, explicacion: "Los capacitores almacenan energía brevemente. Se usan para filtrar ruido, estabilizar voltaje y temporizadores. ¡Son como mini baterías rápidas! ⚡" },`,
    `            { titulo: "✅ Quiz: Circuito Integrado", tipo: 'mini_quiz', pregunta: "¿Qué es un circuito integrado (IC)?", opciones: ["Un cable largo", "Un chip con miles/millones de transistores miniaturizados", "Una resistencia grande", "Un tipo de batería"], respuestaCorrecta: 1, explicacion: "Un IC (chip) contiene millones de transistores en un espacio diminuto. El ATmega328 de Arduino tiene más de 30,000 transistores. 🔬" },`,
  ],
  'mod_prog_gen': [
    `            { titulo: "✅ Quiz: Variable", tipo: 'mini_quiz', pregunta: "¿Qué es una variable en programación?", opciones: ["Un cable", "Un espacio en memoria con nombre que almacena un valor que puede cambiar", "Un tipo de sensor", "Una función fija"], respuestaCorrecta: 1, explicacion: "Una variable es como una caja con etiqueta: int edad = 15; guarda el número 15 en la caja 'edad'. Puedes cambiarlo después. 📦" },`,
    `            { titulo: "✅ Quiz: Bucle", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia entre un bucle for y un while?", opciones: ["No hay diferencia", "For repite un número conocido de veces; while repite mientras una condición sea verdadera", "For es más rápido", "While solo funciona una vez"], respuestaCorrecta: 1, explicacion: "for(i=0; i<10; i++) repite 10 veces. while(distancia<20) repite hasta que distancia sea ≥20. Ambos son esenciales. 🔄" },`,
  ],
  'mod_mecanica': [
    `            { titulo: "✅ Quiz: Engranajes", tipo: 'mini_quiz', pregunta: "¿Qué sucede cuando un engranaje grande mueve uno pequeño?", opciones: ["Se detienen", "El pequeño gira más rápido pero con menos fuerza (torque)", "El pequeño gira más lento", "Nada cambia"], respuestaCorrecta: 1, explicacion: "¡Relación de engranajes! Grande→pequeño = más velocidad, menos torque. Pequeño→grande = menos velocidad, más torque. ¡Trade-off! ⚙️" },`,
    `            { titulo: "✅ Quiz: Torque vs Velocidad", tipo: 'mini_quiz', pregunta: "¿Qué necesita más un robot que sube una rampa: torque o velocidad?", opciones: ["Velocidad", "Torque (fuerza de giro) para vencer la gravedad", "Ninguno", "Ambos por igual siempre"], respuestaCorrecta: 1, explicacion: "Subir rampa = necesita fuerza. Los engranajes reductores sacrifican velocidad para multiplicar el torque. ¡Más fuerza en las ruedas! 💪" },`,
  ],
  'mod_arduino': [
    `            { titulo: "✅ Quiz: Pines Arduino", tipo: 'mini_quiz', pregunta: "¿Cuántos pines digitales tiene un Arduino UNO?", opciones: ["6", "14 pines digitales (0-13)", "20", "32"], respuestaCorrecta: 1, explicacion: "Arduino UNO tiene 14 pines digitales (D0-D13) y 6 pines analógicos (A0-A5). Los pines 0 y 1 son para serial (TX/RX). 📟" },`,
    `            { titulo: "✅ Quiz: Setup y Loop", tipo: 'mini_quiz', pregunta: "¿Cuántas veces se ejecuta setup() vs loop() en Arduino?", opciones: ["Ambos una vez", "setup() una vez al inicio; loop() se repite infinitamente", "Ambos infinitamente", "setup() infinitamente, loop() una vez"], respuestaCorrecta: 1, explicacion: "setup() configura pines y serial UNA vez al encender. loop() se repite miles de veces por segundo. ¡El ciclo infinito del robot! 🔄" },`,
  ],
  'mod_cpp': [
    `            { titulo: "✅ Quiz: Tipos de Datos C++", tipo: 'mini_quiz', pregunta: "¿Qué tipo de dato usarías para almacenar la distancia de un sensor (con decimales)?", opciones: ["int", "float (número con punto decimal)", "bool", "char"], respuestaCorrecta: 1, explicacion: "float almacena decimales: float distancia = 15.7; int solo enteros. Para sensores con precisión decimal, usa float. 📏" },`,
    `            { titulo: "✅ Quiz: Funciones C++", tipo: 'mini_quiz', pregunta: "¿Por qué es bueno usar funciones en tu código de robot?", opciones: ["Para que sea más largo", "Para organizar, reutilizar código y hacer debugging más fácil", "No es necesario", "Solo para que compile"], respuestaCorrecta: 1, explicacion: "Las funciones dividen el código en bloques lógicos: moverAdelante(), leerSensor(), girar(). Más organizado, menos bugs. 🧩" },`,
  ],
  'mod_python': [
    `            { titulo: "✅ Quiz: Python vs C++", tipo: 'mini_quiz', pregunta: "¿Cuál es la ventaja principal de Python sobre C++ para robótica?", opciones: ["Es más rápido", "Sintaxis más simple y más librerías de IA/visión artificial", "Funciona sin Internet", "No tiene ventajas"], respuestaCorrecta: 1, explicacion: "Python es más fácil de aprender y tiene librerías poderosas: OpenCV (visión), TensorFlow (IA), ROS. Ideal para robots avanzados. 🐍" },`,
    `            { titulo: "✅ Quiz: Listas Python", tipo: 'mini_quiz', pregunta: "¿Qué es una lista en Python y para qué sirve en robótica?", opciones: ["Un documento de texto", "Una colección ordenada de datos: sensores = [15, 20, 30]", "Un tipo de motor", "Una función especial"], respuestaCorrecta: 1, explicacion: "Las listas almacenan múltiples datos: lecturas de sensores, rutas, comandos. lecturas = [10, 15, 12] guarda 3 distancias. 📋" },`,
  ],
  'mod_robotica': [
    `            { titulo: "✅ Quiz: Lazo de Control", tipo: 'mini_quiz', pregunta: "¿Qué es el lazo de control Sentir-Pensar-Actuar en robótica?", opciones: ["Un tipo de cable", "El ciclo donde el robot lee sensores, procesa datos y ejecuta acciones", "Un lenguaje de programación", "Una marca de robot"], respuestaCorrecta: 1, explicacion: "Sentir (sensores) → Pensar (microcontrolador decide) → Actuar (motores ejecutan). Este ciclo se repite miles de veces por segundo. 🔄" },`,
    `            { titulo: "✅ Quiz: Robot Reactivo", tipo: 'mini_quiz', pregunta: "¿Qué es un robot reactivo?", opciones: ["Un robot que se enoja", "Un robot que responde directamente a estímulos del entorno sin planificar", "Un robot que no se mueve", "Un robot que usa IA avanzada"], respuestaCorrecta: 1, explicacion: "Un robot reactivo actúa instantáneamente: 've' obstáculo → gira. No planifica rutas. Simple pero efectivo para evasión básica. 🏎️" },`,
  ],
  'mod_componentes': [
    `            { titulo: "✅ Quiz: Multímetro", tipo: 'mini_quiz', pregunta: "¿Qué mide un multímetro en modo 'continuidad'?", opciones: ["La temperatura", "Si hay conexión eléctrica entre dos puntos (suena si hay contacto)", "La velocidad", "La presión"], respuestaCorrecta: 1, explicacion: "El modo continuidad verifica si dos puntos están conectados eléctricamente. Suena = hay conexión. Esencial para debug de circuitos. 🔊" },`,
    `            { titulo: "✅ Quiz: Componentes SMD", tipo: 'mini_quiz', pregunta: "¿Qué son los componentes SMD?", opciones: ["Componentes muy grandes", "Componentes de Montaje Superficial, más pequeños que los tradicionales", "Cables especiales", "Tipo de sensor"], respuestaCorrecta: 1, explicacion: "SMD = Surface Mount Device. Son componentes miniaturizados que se sueldan directamente a la superficie de la PCB. ¡Más pequeños! 🔬" },`,
  ],
  'mod_control': [
    `            { titulo: "✅ Quiz: Control PID", tipo: 'mini_quiz', pregunta: "¿Qué significan las letras P, I y D en control PID?", opciones: ["Presión, Intensidad, Distancia", "Proporcional, Integral, Derivativo", "Potencia, Impulso, Dirección", "Programa, Inicio, Destino"], respuestaCorrecta: 1, explicacion: "P = error actual, I = acumulación de errores pasados, D = predicción del error futuro. Juntos logran control suave y preciso. 🎯" },`,
    `            { titulo: "✅ Quiz: PWM Control", tipo: 'mini_quiz', pregunta: "¿Qué rango de valores acepta analogWrite() en Arduino?", opciones: ["0-1", "0-255 (8 bits de resolución PWM)", "0-1023", "0-100"], respuestaCorrecta: 1, explicacion: "analogWrite(pin, 0-255). 0 = apagado, 127 = 50%, 255 = máximo. Con 8 bits tienes 256 niveles de velocidad de motor. 📊" },`,
  ],
  'mod_prog_avanzada': [
    `            { titulo: "✅ Quiz: Interrupciones", tipo: 'mini_quiz', pregunta: "¿Qué es una interrupción (interrupt) en Arduino?", opciones: ["Un error del programa", "Una señal que pausa el programa principal para ejecutar código urgente", "Un tipo de delay", "Un comentario en el código"], respuestaCorrecta: 1, explicacion: "Las interrupciones pausan loop() cuando ocurre un evento (botón, sensor). La función ISR se ejecuta inmediatamente. Más rápido que polling. ⚡" },`,
    `            { titulo: "✅ Quiz: EEPROM", tipo: 'mini_quiz', pregunta: "¿Para qué sirve la EEPROM del Arduino?", opciones: ["Para conectar WiFi", "Para guardar datos que sobrevivan al apagar el Arduino", "Para aumentar velocidad", "Para conectar más sensores"], respuestaCorrecta: 1, explicacion: "La EEPROM guarda datos permanentemente (1KB en UNO). Ideal para guardar configuraciones, calibraciones o high scores. ¡Memoria persistente! 💾" },`,
  ],
  'mod_diseno': [
    `            { titulo: "✅ Quiz: CAD para Robots", tipo: 'mini_quiz', pregunta: "¿Qué software gratuito se puede usar para diseñar piezas 3D de un robot?", opciones: ["Paint", "Tinkercad o FreeCAD para modelado 3D y diseño de piezas", "Excel", "PowerPoint"], respuestaCorrecta: 1, explicacion: "Tinkercad (web, fácil) y FreeCAD (escritorio, avanzado) permiten diseñar piezas que luego puedes imprimir en 3D. ¡Diseño digital! 🖥️" },`,
    `            { titulo: "✅ Quiz: Fritzing", tipo: 'mini_quiz', pregunta: "¿Para qué se usa Fritzing en proyectos de robótica?", opciones: ["Para programar", "Para diseñar circuitos electrónicos y crear esquemas de conexión", "Para imprimir 3D", "Para controlar servos"], respuestaCorrecta: 1, explicacion: "Fritzing permite dibujar circuitos con componentes reales (Arduino, sensores). Genera esquemas profesionales y hasta diseños de PCB. 📐" },`,
  ],
  'mod_primer_led': [
    `            { titulo: "✅ Quiz: Polaridad LED", tipo: 'mini_quiz', pregunta: "¿Cómo identificas el polo positivo (ánodo) de un LED?", opciones: ["Es la pata más corta", "Es la pata más larga y el lado sin recorte en la base", "Ambas patas son iguales", "Por el color"], respuestaCorrecta: 1, explicacion: "La pata más larga = ánodo (+). La pata más corta con recorte en la base = cátodo (-). Si lo conectas al revés, no enciende. 💡" },`,
    `            { titulo: "✅ Quiz: digitalWrite", tipo: 'mini_quiz', pregunta: "¿Qué hace la instrucción digitalWrite(13, HIGH)?", opciones: ["Lee el pin 13", "Envía 5V al pin 13 (lo enciende)", "Apaga todo", "Configura el pin como entrada"], respuestaCorrecta: 1, explicacion: "digitalWrite(pin, HIGH) pone el pin a 5V (enciende). digitalWrite(pin, LOW) lo pone a 0V (apaga). ¡Así controlas LEDs! 🔌" },`,
    `            { titulo: "✅ Quiz: Delay", tipo: 'mini_quiz', pregunta: "¿Qué hace delay(1000) en Arduino?", opciones: ["Espera 1 segundo (1000 milisegundos)", "Espera 1000 segundos", "Acelera el programa", "Apaga el Arduino"], respuestaCorrecta: 0, explicacion: "delay(1000) pausa el programa 1000ms = 1 segundo. delay(500) = 0.5s. ¡Útil para hacer parpadear un LED! ⏱️" },`,
  ],
};

// For each main module, find its ID line, then find the module object closing (    },)
// The line before that is the contenidoTeorico end
const modulePositions = [];
for (const moduleId of mainIds) {
  if (!questions[moduleId]) continue;
  let idLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("'" + moduleId + "'")) { idLine = i; break; }
  }
  if (idLine < 0) { console.log('NOT FOUND:', moduleId); continue; }

  // Find module object closing (    },) after the ID
  let closeLine = -1;
  for (let j = idLine + 1; j < lines.length; j++) {
    if (lines[j].replace(/\r$/, '').match(/^\s{4}\},?\s*$/)) {
      closeLine = j;
      break;
    }
  }
  if (closeLine < 0) { console.log('NO CLOSE:', moduleId); continue; }

  // The line before closeLine is the contenidoTeorico end
  let ctEndLine = closeLine - 1;
  while (ctEndLine > idLine && lines[ctEndLine].replace(/\r$/, '').trim() === '') ctEndLine--;

  modulePositions.push({ moduleId, ctEndLine });
}

console.log('Found', modulePositions.length, 'main modules');

// Sort by ctEndLine DESCENDING so insertions don't shift earlier line numbers
modulePositions.sort((a, b) => b.ctEndLine - a.ctEndLine);

let total = 0;
for (const { moduleId, ctEndLine } of modulePositions) {
  const qLines = questions[moduleId];
  if (!qLines) continue;

  // The contenidoTeorico end line has ] as the last bracket char; remove it and reclose after quizzes
  let line = lines[ctEndLine].replace(/\r$/, '');
  const lastBracketIdx = line.lastIndexOf(']');
  const beforeBracket = line.substring(0, lastBracketIdx);
  const afterBracket = line.substring(lastBracketIdx + 1).trim(); // trailing comma or empty

  lines[ctEndLine] = beforeBracket; // remove the closing ]

  // Insert new quiz lines + closing bracket
  const closingLine = '        ]' + (afterBracket ? afterBracket : '');
  lines.splice(ctEndLine + 1, 0, ...qLines, closingLine);

  total += qLines.length;
  console.log(`${moduleId}: +${qLines.length} questions at line ${ctEndLine + 1}`);
}

fs.writeFileSync('src/data/modulesData.js', lines.join('\n'));
console.log(`\nTotal: ${total} questions injected into World 1`);
