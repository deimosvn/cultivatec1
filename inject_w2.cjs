const fs = require('fs');

// Read file and split by lines
let lines = fs.readFileSync('src/data/world2Data.js', 'utf8').split('\n');

const questions = {
  'w2_mod1_ultrasonico': [
    `            { titulo: "✅ Quiz: Ultrasonido Avanzado", tipo: 'mini_quiz', pregunta: "¿Cuál es el rango máximo típico de un sensor ultrasónico HC-SR04?", opciones: ["10 cm", "1 metro", "4 metros", "20 metros"], respuestaCorrecta: 2, explicacion: "El HC-SR04 mide distancias de 2cm a 4 metros. Más allá de eso, el eco es demasiado débil. 📏" },`,
    `            { titulo: "✅ Quiz: Velocidad del Sonido", tipo: 'mini_quiz', pregunta: "¿A qué velocidad viaja el sonido en el aire a temperatura ambiente?", opciones: ["100 m/s", "343 m/s", "1,000 m/s", "3,000 m/s"], respuestaCorrecta: 1, explicacion: "El sonido viaja a ~343 m/s (1,235 km/h) en aire a 20°C. Esta velocidad se usa para calcular la distancia. 🔊" },`,
    `            { titulo: "✅ Quiz: Aplicaciones Sonar", tipo: 'mini_quiz', pregunta: "¿Dónde se usa el sonar además de en robots?", opciones: ["Solo en robots", "En submarinos, barcos pesqueros y medicina (ecografías)", "Solo en hospitales", "En aviones"], respuestaCorrecta: 1, explicacion: "El sonar se usa en navegación submarina, pesca, ecografías médicas y detección de obstáculos. ¡Tecnología versátil! 🚢" },`,
    `            { titulo: "✅ Quiz: Ángulo de Detección", tipo: 'mini_quiz', pregunta: "¿Cuál es el ángulo de detección típico del HC-SR04?", opciones: ["5 grados", "15 grados", "90 grados", "360 grados"], respuestaCorrecta: 1, explicacion: "El HC-SR04 tiene un ángulo de ~15°. Objetos fuera de ese cono no son detectados. Por eso se usan varios sensores. 📐" },`,
  ],
  'w2_mod2_infrarrojo': [
    `            { titulo: "✅ Quiz: IR Reflexivo", tipo: 'mini_quiz', pregunta: "¿Cómo detecta un sensor IR que el robot se acerca al borde de una mesa?", opciones: ["Mide la temperatura del borde", "Detecta que NO hay superficie que refleje la luz infrarroja", "Mide el peso", "Escucha el eco"], respuestaCorrecta: 1, explicacion: "Al llegar al borde, no hay superficie que refleje el IR. El sensor detecta 'vacío' y el robot frena. ⚠️" },`,
    `            { titulo: "✅ Quiz: Digital vs Analógico", tipo: 'mini_quiz', pregunta: "¿Qué diferencia hay entre un sensor IR digital y uno analógico?", opciones: ["No hay diferencia", "El digital da sí/no, el analógico da un valor de distancia proporcional", "El analógico es más barato siempre", "El digital es a color"], respuestaCorrecta: 1, explicacion: "El digital da 0 o 1 (objeto/no objeto). El analógico da un voltaje proporcional a la distancia. Más información = más control. 📊" },`,
    `            { titulo: "✅ Quiz: Seguidor de Línea", tipo: 'mini_quiz', pregunta: "¿Cuántos sensores IR mínimos necesita un robot seguidor de línea avanzado?", opciones: ["1 sensor", "2 sensores", "3-5 sensores para mejor precisión", "10 sensores"], respuestaCorrecta: 2, explicacion: "Con 3-5 sensores, el robot puede detectar la posición relativa de la línea y hacer curvas suaves con control PID. 🛤️" },`,
  ],
  'w2_mod3_temp_hum': [
    `            { titulo: "✅ Quiz: DHT22 vs DHT11", tipo: 'mini_quiz', pregunta: "¿Cuál es la principal ventaja del DHT22 sobre el DHT11?", opciones: ["Es más grande", "Mayor rango y precisión de medición", "Es más barato", "Mide presión"], respuestaCorrecta: 1, explicacion: "El DHT22 mide -40° a 80°C (DHT11 solo 0-50°C) y tiene precisión de ±0.5°C vs ±2°C del DHT11. 🌡️" },`,
    `            { titulo: "✅ Quiz: Humedad Relativa", tipo: 'mini_quiz', pregunta: "¿Qué significa 100% de humedad relativa?", opciones: ["Que está lloviendo", "Que el aire contiene el máximo vapor de agua posible a esa temperatura", "Que hay una inundación", "Que hace calor"], respuestaCorrecta: 1, explicacion: "Al 100% el aire está saturado. Cualquier enfriamiento causa condensación (rocío, niebla). El sensor DHT lo mide. 💧" },`,
    `            { titulo: "✅ Quiz: Aplicaciones", tipo: 'mini_quiz', pregunta: "¿En qué proyecto robótico es esencial medir temperatura y humedad?", opciones: ["Robot de combate", "Invernadero automatizado o estación meteorológica", "Robot bailarín", "Impresora 3D"], respuestaCorrecta: 1, explicacion: "Los invernaderos automatizados usan sensores de temp/humedad para controlar ventilación y riego automáticamente. 🌱" },`,
    `            { titulo: "✅ Quiz: Intervalo de Lectura", tipo: 'mini_quiz', pregunta: "¿Con qué frecuencia máxima se puede leer el sensor DHT22?", opciones: ["1000 veces por segundo", "Una vez cada 2 segundos", "Una vez por minuto", "Solo una vez al día"], respuestaCorrecta: 1, explicacion: "El DHT22 necesita mínimo 2 segundos entre lecturas (el DHT11 necesita 1s). Si lees más rápido, obtienes errores. ⏱️" },`,
  ],
  'w2_mod4_luz_color': [
    `            { titulo: "✅ Quiz: LDR", tipo: 'mini_quiz', pregunta: "¿Cómo varía la resistencia de un LDR (fotorresistencia) con la luz?", opciones: ["Aumenta con más luz", "Disminuye con más luz", "No cambia", "Solo funciona en la oscuridad"], respuestaCorrecta: 1, explicacion: "La resistencia del LDR disminuye al recibir más luz: oscuridad ~1MΩ, luz solar ~1kΩ. Divisor de voltaje para Arduino. 💡" },`,
    `            { titulo: "✅ Quiz: RGB", tipo: 'mini_quiz', pregunta: "¿Qué 3 colores primarios combina un sensor de color RGB?", opciones: ["Amarillo, Cyan, Magenta", "Rojo, Verde y Azul", "Blanco, Negro y Gris", "Naranja, Violeta y Verde"], respuestaCorrecta: 1, explicacion: "RGB = Red, Green, Blue. Combinando intensidades de estos tres colores se puede representar cualquier color. 🌈" },`,
    `            { titulo: "✅ Quiz: Seguidor Solar", tipo: 'mini_quiz', pregunta: "¿Cómo funciona un seguidor solar con 2 LDRs?", opciones: ["Gira aleatoriamente", "Compara la luz en ambos LDRs y gira hacia el que recibe más luz", "Solo funciona de noche", "Usa GPS"], respuestaCorrecta: 1, explicacion: "Si un LDR recibe más luz, un servo mueve el panel hacia ese lado. El panel siempre apunta al sol. ☀️" },`,
  ],
  'w2_mod5_chasis': [
    `            { titulo: "✅ Quiz: Tipos de Chasis", tipo: 'mini_quiz', pregunta: "¿Cuál es la ventaja de un chasis con tracción diferencial (2 motores)?", opciones: ["Es el más rápido", "Puede girar sobre su propio eje controlando cada motor independientemente", "Es el más grande", "Solo va en línea recta"], respuestaCorrecta: 1, explicacion: "Con tracción diferencial, si un motor avanza y el otro retrocede, el robot gira en su lugar. Mayor maniobrabilidad. 🔄" },`,
    `            { titulo: "✅ Quiz: Materiales", tipo: 'mini_quiz', pregunta: "¿Qué material es ideal para prototipos rápidos de chasis robótico?", opciones: ["Acero pesado", "Acrílico o MDF cortado con láser", "Vidrio", "Cemento"], respuestaCorrecta: 1, explicacion: "El acrílico y MDF son ligeros, baratos y fáciles de cortar con láser o CNC. Perfectos para iterar rápido. 🛠️" },`,
    `            { titulo: "✅ Quiz: Centro de Gravedad", tipo: 'mini_quiz', pregunta: "¿Por qué es importante que el centro de gravedad del robot esté bajo?", opciones: ["Para verse mejor", "Para mayor estabilidad y evitar que se vuelque en giros", "Para pesar menos", "No es importante"], respuestaCorrecta: 1, explicacion: "Un centro de gravedad bajo reduce las probabilidades de volcamiento en giros o terreno irregular. 📐" },`,
  ],
  'w2_mod6_motores_avanzado': [
    `            { titulo: "✅ Quiz: Driver L298N", tipo: 'mini_quiz', pregunta: "¿Por qué necesitas un driver como el L298N para controlar motores DC con Arduino?", opciones: ["Para que el motor gire más rápido", "Porque Arduino no puede suministrar suficiente corriente directamente", "Para hacer menos ruido", "No es necesario"], respuestaCorrecta: 1, explicacion: "Un motor DC necesita 500mA-2A. Arduino solo da 40mA por pin. El L298N amplifica la señal para controlar los motores. ⚡" },`,
    `            { titulo: "✅ Quiz: PWM Motores", tipo: 'mini_quiz', pregunta: "¿Cómo se controla la velocidad de un motor DC con PWM?", opciones: ["Cambiando el voltaje de la batería", "Encendiendo y apagando el motor rápidamente con diferentes anchos de pulso", "Agregando resistencias", "Solo tiene una velocidad"], respuestaCorrecta: 1, explicacion: "PWM alterna encendido/apagado miles de veces por segundo. 50% duty cycle = 50% velocidad. El motor promedia. 📊" },`,
    `            { titulo: "✅ Quiz: Motor Paso a Paso", tipo: 'mini_quiz', pregunta: "¿Qué ventaja tiene un motor paso a paso sobre un motor DC?", opciones: ["Es más barato", "Puede girar un ángulo exacto y preciso", "Es más rápido", "No necesita driver"], respuestaCorrecta: 1, explicacion: "Un stepper motor gira en pasos discretos (ej: 1.8° por paso). Perfecto para impresoras 3D y CNC. 🎯" },`,
  ],
  'w2_mod7_servo_garra': [
    `            { titulo: "✅ Quiz: Ángulo del Servo", tipo: 'mini_quiz', pregunta: "¿Cuál es el rango de ángulo típico de un servo estándar?", opciones: ["0° a 90°", "0° a 180°", "0° a 360°", "-90° a 90°"], respuestaCorrecta: 1, explicacion: "La mayoría de servos estándar giran de 0° a 180°. Para rotación continua necesitas un servo de rotación continua. 🔧" },`,
    `            { titulo: "✅ Quiz: Par de Torque", tipo: 'mini_quiz', pregunta: "¿Qué determina cuánto peso puede levantar una garra robótica?", opciones: ["El color del servo", "El torque (par) del servo motor", "El tamaño del Arduino", "La velocidad de rotación"], respuestaCorrecta: 1, explicacion: "El torque se mide en kg·cm. Un servo de 10 kg·cm puede sostener 10kg a 1cm del eje. Más torque = más fuerza. 💪" },`,
    `            { titulo: "✅ Quiz: Grados de Libertad", tipo: 'mini_quiz', pregunta: "¿Qué son los grados de libertad (DOF) en un brazo robótico?", opciones: ["La temperatura máxima", "El número de ejes independientes de movimiento", "La cantidad de motores", "La velocidad máxima"], respuestaCorrecta: 1, explicacion: "Cada articulación que puede moverse independientemente es un DOF. Un brazo humano tiene 7 DOF. Más DOF = más versatilidad. 🦾" },`,
  ],
  'w2_mod8_evasion': [
    `            { titulo: "✅ Quiz: Algoritmo de Evasión", tipo: 'mini_quiz', pregunta: "¿Cuál es la estrategia más simple para que un robot evite obstáculos?", opciones: ["Atravesarlos", "Detectar obstáculo → frenar → girar → avanzar", "Ir en reversa siempre", "No moverse"], respuestaCorrecta: 1, explicacion: "La evasión básica: sensor detecta obstáculo → robot frena → gira un ángulo → retoma el avance. Simple y efectivo. 🔄" },`,
    `            { titulo: "✅ Quiz: Múltiples Sensores", tipo: 'mini_quiz', pregunta: "¿Por qué usar 3 sensores ultrasónicos (izquierda, centro, derecha) en vez de 1?", opciones: ["Es más bonito", "Para detectar de qué lado está el obstáculo y elegir mejor dirección de giro", "Para gastar más energía", "No tiene ventaja"], respuestaCorrecta: 1, explicacion: "Con 3 sensores el robot sabe si el obstáculo está a la izquierda, centro o derecha y gira hacia el lado libre. 📡" },`,
  ],
  'w2_mod9_serial': [
    `            { titulo: "✅ Quiz: Baud Rate", tipo: 'mini_quiz', pregunta: "¿Qué significa un baud rate de 9600 en comunicación serial?", opciones: ["9600 voltios", "9600 bits por segundo de velocidad de transmisión", "9600 bytes", "9600 metros"], respuestaCorrecta: 1, explicacion: "9600 baud = 9600 bits/s. Cada carácter usa ~10 bits, así que transmite ~960 caracteres por segundo. 📡" },`,
    `            { titulo: "✅ Quiz: TX y RX", tipo: 'mini_quiz', pregunta: "¿Qué significan TX y RX en comunicación serial?", opciones: ["Temperatura y Resistencia", "Transmitir (TX) y Recibir (RX)", "Velocidad X e Y", "No significan nada"], respuestaCorrecta: 1, explicacion: "TX = Transmit (enviar datos), RX = Receive (recibir datos). El TX de uno se conecta al RX del otro. 📨" },`,
    `            { titulo: "✅ Quiz: Serial Monitor", tipo: 'mini_quiz', pregunta: "¿Para qué se usa el Serial Monitor de Arduino IDE?", opciones: ["Para programar", "Para ver datos enviados por Arduino y enviarle comandos", "Para compilar código", "Para descargar librerías"], respuestaCorrecta: 1, explicacion: "El Serial Monitor muestra los Serial.println() del Arduino y permite enviarle texto. Esencial para depuración. 🖥️" },`,
  ],
  'w2_mod10_display': [
    `            { titulo: "✅ Quiz: OLED vs LCD", tipo: 'mini_quiz', pregunta: "¿Cuál es la ventaja principal de una pantalla OLED sobre un LCD?", opciones: ["Es más grande", "Mayor contraste porque cada pixel emite su propia luz", "Es más barata siempre", "Consume más energía"], respuestaCorrecta: 1, explicacion: "Los OLED no necesitan retroiluminación. Los pixeles negros APAGAN, dando contraste infinito y ahorrando energía. 📺" },`,
    `            { titulo: "✅ Quiz: I2C Display", tipo: 'mini_quiz', pregunta: "¿Cuántos cables necesita un display OLED con interfaz I2C?", opciones: ["8 cables", "4 cables (VCC, GND, SDA, SCL)", "16 cables", "Solo 1 cable"], respuestaCorrecta: 1, explicacion: "I2C usa solo 2 cables de datos (SDA y SCL) más alimentación. Ideal para ahorrar pines en Arduino. 🔌" },`,
    `            { titulo: "✅ Quiz: Caracteres LCD", tipo: 'mini_quiz', pregunta: "¿Cuántos caracteres puede mostrar un LCD 16×2?", opciones: ["16 caracteres", "32 caracteres (16 por fila × 2 filas)", "100 caracteres", "64 caracteres"], respuestaCorrecta: 1, explicacion: "16 columnas × 2 filas = 32 caracteres máximo. Suficiente para mostrar datos del sensor y estado del robot. 📟" },`,
  ],
  'w2_mod11_bluetooth': [
    `            { titulo: "✅ Quiz: HC-05", tipo: 'mini_quiz', pregunta: "¿Cuál es el alcance típico del módulo Bluetooth HC-05?", opciones: ["1 metro", "10 metros", "100 metros", "1 kilómetro"], respuestaCorrecta: 1, explicacion: "El HC-05 tiene un alcance de ~10 metros en interiores. Suficiente para controlar un robot en una habitación. 📱" },`,
    `            { titulo: "✅ Quiz: Modos HC-05", tipo: 'mini_quiz', pregunta: "¿Cuáles son los dos modos de operación del HC-05?", opciones: ["Rápido y lento", "Maestro y esclavo", "Digital y analógico", "TX y RX"], respuestaCorrecta: 1, explicacion: "El HC-05 puede ser maestro (inicia conexión) o esclavo (espera conexión). El modo se configura con comandos AT. 📡" },`,
    `            { titulo: "✅ Quiz: App Control", tipo: 'mini_quiz', pregunta: "¿Qué necesitas para controlar un robot Arduino por Bluetooth desde un celular?", opciones: ["Solo el celular", "Módulo HC-05 en Arduino + app de control en el celular", "WiFi del router", "Cable USB largo"], respuestaCorrecta: 1, explicacion: "El HC-05 se conecta al Arduino. Una app como Arduino Bluetooth Controller envía comandos. ¡Control inalámbrico! 📲" },`,
  ],
  'w2_mod12_sonido': [
    `            { titulo: "✅ Quiz: Buzzer Activo vs Pasivo", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia entre un buzzer activo y uno pasivo?", opciones: ["No hay diferencia", "El activo suena solo con voltaje; el pasivo necesita señal PWM para diferentes tonos", "El pasivo es más caro", "El activo es más grande"], respuestaCorrecta: 1, explicacion: "El buzzer activo genera su propio tono. El pasivo necesita PWM y puede producir diferentes notas musicales. 🎵" },`,
    `            { titulo: "✅ Quiz: Función tone()", tipo: 'mini_quiz', pregunta: "¿Qué hace la función tone(pin, frecuencia) de Arduino?", opciones: ["Cambia el color del LED", "Genera una onda cuadrada en el pin a la frecuencia indicada", "Lee un sensor de sonido", "Mide el volumen"], respuestaCorrecta: 1, explicacion: "tone() genera PWM a la frecuencia deseada. 440 Hz = nota La. 262 Hz = nota Do. ¡Tu robot puede hacer música! 🎶" },`,
    `            { titulo: "✅ Quiz: Sensor de Sonido", tipo: 'mini_quiz', pregunta: "¿Qué detecta un módulo sensor de sonido con micrófono?", opciones: ["Solo palabras", "El nivel de ruido ambiental (intensidad de sonido)", "La música por género", "Solo frecuencias altas"], respuestaCorrecta: 1, explicacion: "El módulo micrófono detecta nivel de ruido. Puedes programar tu robot para reaccionar a palmadas o sonidos fuertes. 👏" },`,
  ],
  'w2_mod13_maquina_estados': [
    `            { titulo: "✅ Quiz: Transición de Estado", tipo: 'mini_quiz', pregunta: "¿Qué causa una transición de estado en una máquina de estados?", opciones: ["El tiempo siempre", "Un evento o condición que cumple la regla de transición", "Solo el usuario", "Nada, cambia solo"], respuestaCorrecta: 1, explicacion: "Las transiciones ocurren cuando se cumple una condición: sensor detecta obstáculo → cambiar de 'avanzar' a 'evadir'. 🔄" },`,
    `            { titulo: "✅ Quiz: Variables de Estado", tipo: 'mini_quiz', pregunta: "¿Cómo se implementa una máquina de estados simple en Arduino?", opciones: ["Con cables", "Con una variable que guarda el estado actual y un switch/case", "Solo con botones", "Con WiFi"], respuestaCorrecta: 1, explicacion: "Una variable int estado = 0; y un switch(estado) con casos para cada estado. Simple y efectivo. 💻" },`,
  ],
  'w2_mod14_energia': [
    `            { titulo: "✅ Quiz: Regulador de Voltaje", tipo: 'mini_quiz', pregunta: "¿Para qué sirve un regulador de voltaje como el 7805?", opciones: ["Para aumentar el voltaje", "Para convertir un voltaje mayor a exactamente 5V estables", "Para medir voltaje", "Para almacenar energía"], respuestaCorrecta: 1, explicacion: "El 7805 convierte 7-12V de baterías a 5V estables para alimentar Arduino y sensores. Vital para circuitos. ⚡" },`,
    `            { titulo: "✅ Quiz: Capacidad de Batería", tipo: 'mini_quiz', pregunta: "¿Qué significa que una batería sea de 2000mAh?", opciones: ["Que pesa 2000 gramos", "Que puede suministrar 2000mA durante 1 hora (o 200mA por 10 horas)", "Que tiene 2000 voltios", "Que se carga en 2000 minutos"], respuestaCorrecta: 1, explicacion: "mAh = miliamperios × hora. 2000mAh significa 2A por 1h, o 500mA por 4h. Más mAh = más duración. 🔋" },`,
    `            { titulo: "✅ Quiz: LiPo vs Alcalinas", tipo: 'mini_quiz', pregunta: "¿Cuál es la ventaja de baterías LiPo sobre pilas alcalinas para robots?", opciones: ["Son más baratas", "Recargables, más ligeras y mayor densidad energética", "Son más seguras siempre", "Duran siempre lo mismo"], respuestaCorrecta: 1, explicacion: "Las LiPo son recargables, livianas y dan alta corriente. Perfectas para motores de robot. Pero necesitan cuidado. ⚡" },`,
  ],
  'w2_mod15_integracion': [
    `            { titulo: "✅ Quiz: Protoboard vs PCB", tipo: 'mini_quiz', pregunta: "¿Cuándo deberías pasar de protoboard a PCB (placa de circuito impreso)?", opciones: ["Nunca", "Cuando el circuito está probado y quieres un montaje permanente y fiable", "Solo para Arduino", "Solo para vender"], respuestaCorrecta: 1, explicacion: "La protoboard es para prototipar. Para un robot confiable, diseñas una PCB con conexiones soldadas permanentes. 🔌" },`,
    `            { titulo: "✅ Quiz: Debugging", tipo: 'mini_quiz', pregunta: "¿Cuál es la forma más efectiva de depurar (debug) problemas en un robot?", opciones: ["Adivinar al azar", "Serial.println() para ver valores de sensores y estados en tiempo real", "Reconstruir todo", "Ignorar el problema"], respuestaCorrecta: 1, explicacion: "Serial.println() muestra exactamente qué está pasando: valores de sensores, estados, decisiones. Vista de rayos X para tu código. 🔍" },`,
  ],
  'w2_mod16_proyecto_final': [
    `            { titulo: "✅ Quiz: Documentación", tipo: 'mini_quiz', pregunta: "¿Por qué es importante documentar tu proyecto de robot?", opciones: ["Para hacer tarea", "Para que otros (y tú en el futuro) puedan entender y mejorar el diseño", "No es importante", "Solo para competencias"], respuestaCorrecta: 1, explicacion: "La documentación permite replicar, mejorar y compartir tu trabajo. Los mejores proyectos tienen excelente documentación. 📄" },`,
    `            { titulo: "✅ Quiz: Iteración", tipo: 'mini_quiz', pregunta: "¿Qué significa iterar en el desarrollo de un robot?", opciones: ["Repetir el mismo error", "Construir, probar, mejorar y repetir el ciclo hasta que funcione", "Rendirse después del primer intento", "Copiar de Internet"], respuestaCorrecta: 1, explicacion: "La iteración es clave: cada versión mejora la anterior. Los mejores robots pasan por muchas iteraciones. 🔄" },`,
  ],
};

// For each module, find its ID in file, then scan forward for the line ending with },]
// That line is the contenidoTeorico array closing. We'll strip the ] and insert quizzes after.
const modulePositions = [];
for (const moduleId of Object.keys(questions)) {
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`'${moduleId}'`)) {
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].replace(/\r$/, '').endsWith('},]')) {
          modulePositions.push({ moduleId, closingLine: j });
          found = true;
          break;
        }
      }
      break;
    }
  }
  if (!found) console.log('NOT FOUND:', moduleId);
}

console.log('Found', modulePositions.length, 'module closing lines');

// Sort by closingLine DESCENDING so insertions don't shift earlier line numbers
modulePositions.sort((a, b) => b.closingLine - a.closingLine);

let total = 0;
for (const { moduleId, closingLine } of modulePositions) {
  const qLines = questions[moduleId];
  if (!qLines) continue;

  // Remove trailing ] from the closing line (keep the },)
  lines[closingLine] = lines[closingLine].replace(/\r$/, '').replace(/\]\s*$/, '');

  // Insert new quiz lines after the closing line, then close the array with ]
  const newLines = [...qLines, '        ]'];
  lines.splice(closingLine + 1, 0, ...newLines);

  total += qLines.length;
  console.log(`${moduleId}: +${qLines.length} questions at line ${closingLine + 1}`);
}

fs.writeFileSync('src/data/world2Data.js', lines.join('\n'));
console.log(`\nTotal: ${total} questions injected into World 2`);
