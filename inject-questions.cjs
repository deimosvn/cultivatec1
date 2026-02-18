// Script to inject interactive questions into each module to reach exactly 10 per module
const fs = require('fs');

// Extra questions per module for World 1 (modulesData.js)
const W1_EXTRA = {
  'mod_intro_robot': [ // has 5, need 5
    { titulo: "✅ Quiz: Historia de la Robótica", tipo: 'mini_quiz', pregunta: "¿De qué idioma proviene la palabra 'Robot'?", opciones: ["Japonés", "Inglés", "Checo", "Alemán"], respuestaCorrecta: 2, explicacion: "Viene del checo 'robota' que significa trabajo forzado, del escritor Karel Čapek en 1920. 📚" },
    { titulo: "✅ Quiz: Robots en la Vida Real", tipo: 'mini_quiz', pregunta: "¿Qué robot explora la superficie de Marte actualmente?", opciones: ["Roomba", "Perseverance", "Sophia", "Spot"], respuestaCorrecta: 1, explicacion: "¡El rover Perseverance de NASA ha explorado Marte desde 2021 buscando señales de vida! 🚀" },
    { titulo: "✅❌ Robots: ¿Verdadero o Falso?", tipo: 'true_false', statements: [{ text: 'Un robot necesita estar conectado a internet para funcionar.', correct: false, explain: 'Muchos robots funcionan sin internet, solo necesitan su programa y energía.' }, { text: 'Los robots pueden trabajar en lugares peligrosos para los humanos.', correct: true, explain: 'Trabajan en volcanes, el espacio, bajo el mar y zonas radiactivas.' }] },
    { titulo: "✅ Quiz: Componentes Básicos", tipo: 'mini_quiz', pregunta: "¿Qué parte del robot toma las decisiones?", opciones: ["Los motores", "Los sensores", "El procesador/cerebro", "Las baterías"], respuestaCorrecta: 2, explicacion: "El procesador o cerebro (como Arduino) es quien toma decisiones basadas en la información de los sensores. 🧠" },
    { titulo: "🧩 Robots y sus Funciones", tipo: 'matching_game', instruccion: 'Conecta cada robot con su función principal', pairs: [{ left: '🏥 Robot cirujano', right: 'Operaciones precisas' }, { left: '🌋 Robot explorador', right: 'Zonas peligrosas' }, { left: '🏭 Robot industrial', right: 'Ensamblar productos' }, { left: '🏠 Roomba', right: 'Limpiar el hogar' }] },
  ],
  'mod_partes_robot': [ // has 7, need 3
    { titulo: "✅ Quiz: Fuentes de Energía", tipo: 'mini_quiz', pregunta: "¿Qué tipo de batería usan los drones por ser potente y recargable?", opciones: ["Pilas AA", "Batería 9V", "Batería LiPo", "Pila de botón"], respuestaCorrecta: 2, explicacion: "Las baterías LiPo (Litio-Polímero) son recargables, livianas y muy potentes. ¡Ideales para drones! ⚡" },
    { titulo: "✅ Quiz: Pines del Arduino", tipo: 'mini_quiz', pregunta: "¿Cuántos pines digitales tiene el Arduino UNO?", opciones: ["6 pines", "14 pines", "20 pines", "8 pines"], respuestaCorrecta: 1, explicacion: "El Arduino UNO tiene 14 pines digitales (D0-D13) para conexiones de entrada/salida. 🔌" },
    { titulo: "✅❌ Partes del Robot: ¿V o F?", tipo: 'true_false', statements: [{ text: 'El motor DC puede girar a un ángulo exacto como 45°.', correct: false, explain: 'El motor DC gira continuamente. Para ángulos exactos se usa el servo motor.' }, { text: 'El chasis de cartón es una buena opción para el primer robot.', correct: true, explain: 'Es barato, fácil de cortar y perfecto para prototipos iniciales.' }] },
  ],
  'mod_primer_proyecto': [ // has 4, need 6
    { titulo: "✅ Quiz: Planificación", tipo: 'mini_quiz', pregunta: "¿Qué es lo PRIMERO que debe hacer un ingeniero antes de construir un robot?", opciones: ["Comprar materiales caros", "Dibujar y planificar el diseño", "Programar sin saber qué construir", "Conectar cables al azar"], respuestaCorrecta: 1, explicacion: "¡Siempre se empieza con un diseño en papel! Planificar ahorra tiempo y dinero. 📝" },
    { titulo: "✅ Quiz: Misiones del Robot", tipo: 'mini_quiz', pregunta: "Si quieres un robot que participe en torneos y competencias, ¿qué tipo de misión elegirías?", opciones: ["Robot Ayudante", "Robot Explorador", "Robot Competidor", "Robot Mascota"], respuestaCorrecta: 2, explicacion: "¡Los robots competidores están diseñados para torneos de sumo, siguelíneas y más! 🏆" },
    { titulo: "✅❌ Diseño de Robots: ¿V o F?", tipo: 'true_false', statements: [{ text: 'El tamaño ideal para un primer robot es entre 15 y 25 cm.', correct: true, explain: 'Ni muy grande ni muy pequeño, fácil de manejar y armar.' }, { text: 'Las baterías deben ir en la parte de arriba del robot para mejor estabilidad.', correct: false, explain: 'Deben ir en la BASE para mantener el centro de gravedad bajo y evitar que se voltee.' }] },
    { titulo: "🧩 Misión y Sensor Ideal", tipo: 'matching_game', instruccion: 'Conecta cada misión con el sensor más útil', pairs: [{ left: '🌍 Explorar terrenos', right: 'Ultrasónico (distancia)' }, { left: '🏠 Seguir una línea', right: 'Infrarrojo (líneas)' }, { left: '🌡️ Monitorear ambiente', right: 'Sensor temperatura' }, { left: '🔆 Buscar luz solar', right: 'LDR (sensor de luz)' }] },
    { titulo: "✅ Quiz: Materiales del Chasis", tipo: 'mini_quiz', pregunta: "¿Qué material es modular y reutilizable para construir un chasis de robot?", opciones: ["Aluminio soldado", "Lego/bloques de construcción", "Vidrio templado", "Cemento"], respuestaCorrecta: 1, explicacion: "¡Lego y bloques son modulares: puedes armar, desarmar y rediseñar fácilmente! 🧱" },
    { titulo: "✅ Quiz: Prototipado", tipo: 'mini_quiz', pregunta: "¿Qué significa que un diseño sea 'modular'?", opciones: ["Que sea muy grande", "Que las piezas se pueden quitar y poner fácilmente", "Que solo funcione con un módulo", "Que no se puede modificar"], respuestaCorrecta: 1, explicacion: "Modular significa piezas intercambiables. Si algo falla, solo cambias esa parte sin desarmar todo. 🔧" },
  ],
  'mod_electr': [ // has 8, need 2
    { titulo: "✅ Quiz: Ley de Ohm", tipo: 'mini_quiz', pregunta: "Según la Ley de Ohm, si aumentas la resistencia en un circuito manteniendo el voltaje igual, ¿qué pasa con la corriente?", opciones: ["Aumenta", "Disminuye", "Se mantiene igual", "Se apaga"], respuestaCorrecta: 1, explicacion: "V = I × R → Si R sube y V es constante, la corriente I baja. ¡Más resistencia = menos flujo! ⚡" },
    { titulo: "🧩 Conceptos Eléctricos", tipo: 'matching_game', instruccion: 'Conecta cada concepto con su unidad de medida', pairs: [{ left: '⚡ Voltaje', right: 'Voltios (V)' }, { left: '💧 Corriente', right: 'Amperios (A)' }, { left: '🚧 Resistencia', right: 'Ohmios (Ω)' }, { left: '🔋 Potencia', right: 'Watts (W)' }] },
  ],
  'mod_electon': [ // has 6, need 4
    { titulo: "✅ Quiz: Capacitores", tipo: 'mini_quiz', pregunta: "¿Cuál es la función principal de un capacitor en un circuito?", opciones: ["Generar energía", "Almacenar y liberar carga eléctrica", "Medir temperatura", "Amplificar sonido"], respuestaCorrecta: 1, explicacion: "Los capacitores almacenan energía temporalmente y la liberan cuando se necesita. ¡Son como mini-baterías rápidas! ⚡" },
    { titulo: "✅ Quiz: Diodos", tipo: 'mini_quiz', pregunta: "¿Qué hace un diodo en un circuito?", opciones: ["Permite que la corriente fluya en ambas direcciones", "Permite que la corriente fluya en UNA sola dirección", "Aumenta el voltaje", "Mide la resistencia"], respuestaCorrecta: 1, explicacion: "El diodo es como una válvula: deja pasar corriente solo en una dirección. ¡Protege tus circuitos! 🚦" },
    { titulo: "✅❌ Electrónica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un LED es un tipo especial de diodo que emite luz.', correct: true, explain: 'LED = Light Emitting Diode (Diodo Emisor de Luz).' }, { text: 'Un transistor solo puede funcionar como interruptor.', correct: false, explain: 'También puede amplificar señales, como en un amplificador de audio.' }] },
    { titulo: "🧩 Componentes Electrónicos", tipo: 'matching_game', instruccion: 'Conecta cada componente con su función', pairs: [{ left: '💡 LED', right: 'Emitir luz' }, { left: '🔌 Resistencia', right: 'Limitar corriente' }, { left: '⚡ Capacitor', right: 'Almacenar carga' }, { left: '🔀 Transistor', right: 'Amplificar/conmutar' }] },
  ],
  'mod_prog_gen': [ // "Mecánica Inicial" has 3, need 7
    { titulo: "✅ Quiz: Engranajes", tipo: 'mini_quiz', pregunta: "¿Qué sucede cuando un engranaje grande mueve uno pequeño?", opciones: ["El pequeño gira más lento", "El pequeño gira más rápido", "Ambos giran a la misma velocidad", "El grande se detiene"], respuestaCorrecta: 1, explicacion: "Un engranaje grande moviendo uno pequeño aumenta la velocidad de rotación del pequeño. ¡Relación de transmisión! ⚙️" },
    { titulo: "✅ Quiz: Palancas", tipo: 'mini_quiz', pregunta: "¿Qué tipo de palanca es un sube y baja (balancín)?", opciones: ["Palanca de primer grado", "Palanca de segundo grado", "Palanca de tercer grado", "No es una palanca"], respuestaCorrecta: 0, explicacion: "El sube y baja tiene el punto de apoyo (fulcro) en el centro: es una palanca de primer grado. ⚖️" },
    { titulo: "✅ Quiz: Poleas", tipo: 'mini_quiz', pregunta: "¿Para qué sirve una polea en un robot?", opciones: ["Para medir distancia", "Para cambiar la dirección o magnitud de una fuerza", "Para generar electricidad", "Para conectar sensores"], respuestaCorrecta: 1, explicacion: "Las poleas permiten levantar objetos pesados con menos esfuerzo cambiando la dirección de la fuerza. 🏗️" },
    { titulo: "✅❌ Mecánica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Los engranajes pueden aumentar o reducir la velocidad de rotación.', correct: true, explain: 'Dependiendo del tamaño, pueden multiplicar velocidad o fuerza (torque).' }, { text: 'El torque y la velocidad son lo mismo.', correct: false, explain: 'El torque es la fuerza de giro. Más torque = más fuerza pero generalmente menos velocidad.' }] },
    { titulo: "🧩 Mecanismos y Usos", tipo: 'matching_game', instruccion: 'Conecta cada mecanismo con su uso en robótica', pairs: [{ left: '⚙️ Engranajes', right: 'Transmitir movimiento' }, { left: '🏗️ Poleas', right: 'Levantar objetos' }, { left: '⚖️ Palancas', right: 'Multiplicar fuerza' }, { left: '🔩 Tornillo sin fin', right: 'Reducir velocidad' }] },
    { titulo: "✅ Quiz: Torque", tipo: 'mini_quiz', pregunta: "Si necesitas que un robot tenga MUCHA fuerza para subir una pendiente, ¿qué necesitas aumentar?", opciones: ["La velocidad", "El torque", "El número de sensores", "El tamaño del chasis"], respuestaCorrecta: 1, explicacion: "¡El torque! Es la fuerza de giro del motor. Más torque = más capacidad para mover cargas pesadas. 💪" },
    { titulo: "✅ Quiz: Fricción", tipo: 'mini_quiz', pregunta: "¿Es la fricción siempre mala para un robot?", opciones: ["Sí, siempre hay que eliminarla", "No, las ruedas necesitan fricción para moverse", "Solo afecta a robots voladores", "No existe en robótica"], respuestaCorrecta: 1, explicacion: "¡Sin fricción las ruedas patinarían! La fricción es necesaria para tracción, pero hay que minimizarla en ejes y engranajes. 🛞" },
  ],
  'mod_mecanica': [ // "Programación Inicial" has 3, need 7
    { titulo: "✅ Quiz: Variables", tipo: 'mini_quiz', pregunta: "¿Qué es una variable en programación?", opciones: ["Un tipo de cable", "Un espacio de memoria que guarda un dato", "Un sensor especial", "Un motor programable"], respuestaCorrecta: 1, explicacion: "Una variable es como una caja con nombre donde guardas datos: números, texto, etc. 📦" },
    { titulo: "✅ Quiz: Condicionales", tipo: 'mini_quiz', pregunta: "¿Qué instrucción usas para que el programa tome una decisión?", opciones: ["for", "while", "if/else", "print"], respuestaCorrecta: 2, explicacion: "if/else permite al programa decidir: SI algo es verdad, haz esto; SI NO, haz lo otro. 🔀" },
    { titulo: "✅ Quiz: Ciclos", tipo: 'mini_quiz', pregunta: "¿Qué estructura repite un bloque de código varias veces?", opciones: ["if/else", "return", "for/while (ciclos)", "import"], respuestaCorrecta: 2, explicacion: "Los ciclos (for, while) repiten código: for repite un número fijo de veces, while repite mientras una condición sea verdadera. 🔄" },
    { titulo: "✅❌ Programación: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Una función es un bloque de código reutilizable con un nombre.', correct: true, explain: 'Las funciones organizan el código y permiten reutilizarlo llamándolo por su nombre.' }, { text: 'Los comentarios en el código son ejecutados por la computadora.', correct: false, explain: 'Los comentarios son ignorados por la computadora, son notas para los programadores.' }] },
    { titulo: "🧩 Conceptos de Programación", tipo: 'matching_game', instruccion: 'Conecta cada concepto con su descripción', pairs: [{ left: '📦 Variable', right: 'Guarda un dato' }, { left: '🔀 if/else', right: 'Toma decisiones' }, { left: '🔄 for/while', right: 'Repite código' }, { left: '📋 Función', right: 'Código reutilizable' }] },
    { titulo: "✅ Quiz: Errores Comunes", tipo: 'mini_quiz', pregunta: "¿Qué es un 'bug' en programación?", opciones: ["Un virus peligroso", "Un error o fallo en el código", "Un tipo de sensor", "Una marca de Arduino"], respuestaCorrecta: 1, explicacion: "Bug = error. El término viene de 1947 cuando una polilla causó un fallo en una computadora Harvard Mark II. 🐛" },
    { titulo: "✅ Quiz: Algoritmos", tipo: 'mini_quiz', pregunta: "¿Qué es un algoritmo?", opciones: ["Un tipo de robot", "Una serie de pasos ordenados para resolver un problema", "Un lenguaje de programación", "Un componente electrónico"], respuestaCorrecta: 1, explicacion: "Un algoritmo es una receta: pasos claros y ordenados para resolver un problema. ¡Como una receta de cocina para la computadora! 📜" },
  ],
  'mod_arduino': [ // "Control con Arduino" has 2, need 8
    { titulo: "✅ Quiz: setup() y loop()", tipo: 'mini_quiz', pregunta: "¿Cuántas veces se ejecuta la función setup() en Arduino?", opciones: ["Infinitas veces", "Solo una vez al inicio", "Cada segundo", "Nunca"], respuestaCorrecta: 1, explicacion: "setup() se ejecuta UNA sola vez al encender o reiniciar el Arduino. loop() se repite infinitamente. 🔄" },
    { titulo: "✅ Quiz: pinMode", tipo: 'mini_quiz', pregunta: "¿Qué hace la instrucción pinMode(13, OUTPUT)?", opciones: ["Lee el pin 13", "Configura el pin 13 como salida", "Apaga el pin 13", "Mide el voltaje del pin 13"], respuestaCorrecta: 1, explicacion: "pinMode configura un pin como OUTPUT (salida) para enviar señales, o INPUT (entrada) para recibir. 📌" },
    { titulo: "✅ Quiz: digitalWrite", tipo: 'mini_quiz', pregunta: "¿Qué hace digitalWrite(13, HIGH)?", opciones: ["Apaga el pin 13", "Enciende el pin 13 enviando 5V", "Lee el valor del pin 13", "Configura el pin 13 como entrada"], respuestaCorrecta: 1, explicacion: "digitalWrite con HIGH envía 5 voltios al pin, encendiendo lo que esté conectado (LED, motor, etc.). 💡" },
    { titulo: "✅ Quiz: delay()", tipo: 'mini_quiz', pregunta: "¿Qué hace delay(1000) en Arduino?", opciones: ["Espera 1 segundo", "Espera 1000 segundos", "Repite el código 1000 veces", "Enciende 1000 LEDs"], respuestaCorrecta: 0, explicacion: "delay(1000) pausa el programa durante 1000 milisegundos = 1 segundo. 1000ms = 1s ⏱️" },
    { titulo: "✅❌ Arduino: ¿V o F?", tipo: 'true_false', statements: [{ text: 'analogRead() puede leer valores del 0 al 1023.', correct: true, explain: 'El Arduino tiene un ADC de 10 bits: 2^10 = 1024 niveles (0-1023).' }, { text: 'loop() se ejecuta solo una vez como setup().', correct: false, explain: 'loop() se repite infinitamente mientras el Arduino esté encendido.' }] },
    { titulo: "🧩 Funciones Arduino", tipo: 'matching_game', instruccion: 'Conecta cada función con su descripción', pairs: [{ left: 'setup()', right: 'Se ejecuta una vez' }, { left: 'loop()', right: 'Se repite siempre' }, { left: 'digitalWrite()', right: 'Envía HIGH/LOW' }, { left: 'analogRead()', right: 'Lee valores 0-1023' }] },
    { titulo: "✅ Quiz: Pines Analógicos", tipo: 'mini_quiz', pregunta: "¿Cuántos pines analógicos tiene el Arduino UNO?", opciones: ["14", "6", "20", "2"], respuestaCorrecta: 1, explicacion: "El Arduino UNO tiene 6 pines analógicos: A0 a A5, para leer sensores analógicos. 📊" },
    { titulo: "✅ Quiz: Serial Monitor", tipo: 'mini_quiz', pregunta: "¿Para qué sirve Serial.begin(9600) en Arduino?", opciones: ["Encender un LED", "Iniciar la comunicación serial a 9600 baudios", "Configurar un motor", "Leer un sensor ultrasónico"], respuestaCorrecta: 1, explicacion: "Serial.begin(9600) inicia la comunicación serial para enviar datos al computador por el Monitor Serial. 📟" },
  ],
  'mod_cpp': [ // "Lógica Esencial" (booleana AND/OR/NOT) has 3, need 7
    { titulo: "✅ Quiz: Operador AND", tipo: 'mini_quiz', pregunta: "En lógica booleana, ¿cuándo es verdadero A AND B?", opciones: ["Cuando A es verdadero", "Cuando B es verdadero", "Solo cuando AMBOS son verdaderos", "Cuando al menos uno es verdadero"], respuestaCorrecta: 2, explicacion: "AND requiere que AMBAS condiciones sean verdaderas. Si una es falsa, el resultado es falso. ✅ AND ✅ = ✅" },
    { titulo: "✅ Quiz: Operador OR", tipo: 'mini_quiz', pregunta: "En lógica booleana, ¿cuándo es verdadero A OR B?", opciones: ["Solo cuando ambos son verdaderos", "Solo cuando ambos son falsos", "Cuando al menos uno es verdadero", "Nunca"], respuestaCorrecta: 2, explicacion: "OR es verdadero si al menos UNO de los dos es verdadero. Solo es falso cuando ambos son falsos. 🔀" },
    { titulo: "✅ Quiz: Operador NOT", tipo: 'mini_quiz', pregunta: "¿Qué hace el operador NOT?", opciones: ["Suma dos valores", "Invierte el valor: verdadero→falso y falso→verdadero", "Multiplica por cero", "No hace nada"], respuestaCorrecta: 1, explicacion: "NOT invierte: NOT verdadero = falso, NOT falso = verdadero. ¡Es como un espejo lógico! 🪞" },
    { titulo: "✅❌ Lógica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'TRUE AND FALSE resulta en TRUE.', correct: false, explain: 'AND necesita que AMBOS sean TRUE. Si uno es FALSE, el resultado es FALSE.' }, { text: 'TRUE OR FALSE resulta en TRUE.', correct: true, explain: 'OR solo necesita que al menos UNO sea TRUE para dar TRUE.' }] },
    { titulo: "🧩 Operadores Lógicos", tipo: 'matching_game', instruccion: 'Conecta cada operación con su resultado', pairs: [{ left: 'TRUE AND TRUE', right: 'TRUE' }, { left: 'TRUE AND FALSE', right: 'FALSE' }, { left: 'FALSE OR TRUE', right: 'TRUE' }, { left: 'NOT TRUE', right: 'FALSE' }] },
    { titulo: "✅ Quiz: Tablas de Verdad", tipo: 'mini_quiz', pregunta: "¿Cuántas combinaciones posibles hay en una tabla de verdad con 2 variables (A y B)?", opciones: ["2 combinaciones", "4 combinaciones", "8 combinaciones", "16 combinaciones"], respuestaCorrecta: 1, explicacion: "Con 2 variables hay 2² = 4 combinaciones: (F,F), (F,V), (V,F), (V,V). Con 3 variables serían 8. 📊" },
    { titulo: "✅ Quiz: Aplicación en Robots", tipo: 'mini_quiz', pregunta: "Si un robot debe avanzar solo cuando el sensor izquierdo Y el derecho NO detectan obstáculo, ¿qué operador usas?", opciones: ["OR", "NOT", "AND", "XOR"], respuestaCorrecta: 2, explicacion: "Usas AND: ambos sensores deben indicar camino libre para avanzar de forma segura. 🤖" },
  ],
  'mod_python': [ // "Práctica 1: Primer LED" has 1, need 9
    { titulo: "✅ Quiz: Componentes LED", tipo: 'mini_quiz', pregunta: "¿Por qué necesitas una resistencia al conectar un LED?", opciones: ["Para que brille más", "Para limitar la corriente y no quemar el LED", "Para que cambie de color", "No se necesita resistencia"], respuestaCorrecta: 1, explicacion: "Sin resistencia, demasiada corriente pasa por el LED y se quema. La resistencia limita el flujo. ¡Protege tus LEDs! 💡" },
    { titulo: "✅ Quiz: Polaridad del LED", tipo: 'mini_quiz', pregunta: "¿Cómo identificas la pata positiva (ánodo) de un LED?", opciones: ["Es la pata más corta", "Es la pata más larga", "Ambas son iguales", "No tiene polaridad"], respuestaCorrecta: 1, explicacion: "La pata más LARGA es el ánodo (+) y la más corta es el cátodo (-). ¡Si lo conectas al revés no enciende! 💡" },
    { titulo: "✅ Quiz: Resistencias", tipo: 'mini_quiz', pregunta: "¿De cuántos ohmios debería ser la resistencia típica para un LED con Arduino (5V)?", opciones: ["1Ω", "220Ω", "1,000,000Ω", "0Ω (sin resistencia)"], respuestaCorrecta: 1, explicacion: "220Ω es el valor estándar para LEDs con 5V. Limita la corriente a ~15mA, seguro para el LED. 🔧" },
    { titulo: "✅❌ Circuitos LED: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un LED funciona igual sin importar la dirección en que se conecte.', correct: false, explain: 'El LED tiene polaridad: ánodo (+) y cátodo (-). Conectado al revés no enciende.' }, { text: 'Una protoboard/breadboard permite armar circuitos sin soldar.', correct: true, explain: 'Las protoboards tienen conexiones internas que permiten insertar componentes sin soldadura.' }] },
    { titulo: "🧩 Circuito LED", tipo: 'matching_game', instruccion: 'Conecta cada componente con su rol en el circuito LED', pairs: [{ left: '🔋 Batería/Arduino', right: 'Fuente de energía' }, { left: '🔌 Resistencia 220Ω', right: 'Limita la corriente' }, { left: '💡 LED', right: 'Emite luz' }, { left: '🔗 Cables', right: 'Conectan componentes' }] },
    { titulo: "✅ Quiz: Protoboard", tipo: 'mini_quiz', pregunta: "¿Cómo están conectadas internamente las filas de una protoboard?", opciones: ["Todas las filas están conectadas entre sí", "Cada fila de 5 huecos está conectada horizontalmente", "No hay conexión interna", "Solo los bordes están conectados"], respuestaCorrecta: 1, explicacion: "¡Cada fila de 5 huecos está conectada por dentro! Por eso puedes insertar componentes en la misma fila para conectarlos. 🔌" },
    { titulo: "✅ Quiz: Colores LED", tipo: 'mini_quiz', pregunta: "¿Qué determina el color de un LED?", opciones: ["El voltaje de la batería", "El material semiconductor del LED", "La resistencia que uses", "La velocidad de la corriente"], respuestaCorrecta: 1, explicacion: "El color depende del material semiconductor: GaAs = rojo, GaN = azul/verde, InGaN = blanco. 🌈" },
    { titulo: "✅ Quiz: Circuito Serie", tipo: 'mini_quiz', pregunta: "En un circuito en serie con 2 LEDs, si uno se quema, ¿qué pasa con el otro?", opciones: ["Brilla más fuerte", "También se apaga", "No le afecta", "Cambia de color"], respuestaCorrecta: 1, explicacion: "En serie, la corriente pasa por todos. Si uno se corta, se rompe el circuito y todos se apagan. 🔗" },
    { titulo: "✅ Quiz: Plaqueta Arduino", tipo: 'mini_quiz', pregunta: "¿Qué pin del Arduino usarías para alimentar un LED con 5 voltios?", opciones: ["GND", "A0", "5V", "RESET"], respuestaCorrecta: 2, explicacion: "El pin 5V proporciona 5 voltios de salida. GND es tierra (negativo). Necesitas ambos para un circuito completo. ⚡" },
  ],
  'mod_robotica': [ // "Práctica 2: LED con Arduino" has 2, need 8
    { titulo: "✅ Quiz: Blink", tipo: 'mini_quiz', pregunta: "¿Qué hace el programa Blink en Arduino?", opciones: ["Lee un sensor", "Enciende y apaga un LED repetidamente", "Controla un motor", "Se conecta a internet"], respuestaCorrecta: 1, explicacion: "Blink es el 'Hola Mundo' de Arduino: enciende el LED, espera, lo apaga, espera, y repite. 💡" },
    { titulo: "✅ Quiz: LED Integrado", tipo: 'mini_quiz', pregunta: "¿En qué pin está el LED integrado del Arduino UNO?", opciones: ["Pin 1", "Pin 7", "Pin 13", "Pin A0"], respuestaCorrecta: 2, explicacion: "El LED integrado (built-in LED) está conectado al pin 13. ¡Puedes probarlo sin conectar nada externo! 💡" },
    { titulo: "✅ Quiz: Frecuencia de Parpadeo", tipo: 'mini_quiz', pregunta: "Si usas delay(500), ¿cuántas veces parpadea el LED por segundo?", opciones: ["Una vez por segundo", "Dos veces por segundo", "Cinco veces por segundo", "Diez veces por segundo"], respuestaCorrecta: 0, explicacion: "delay(500) = 500ms encendido + 500ms apagado = 1 ciclo por segundo. ¡Cambiando el delay cambias la velocidad! ⏱️" },
    { titulo: "✅❌ LED Arduino: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Para hacer parpadear un LED necesitas usar digitalWrite y delay.', correct: true, explain: 'digitalWrite enciende/apaga el LED, delay controla cuánto tiempo queda en cada estado.' }, { text: 'El Arduino puede encender LEDs de cualquier color sin componentes externos.', correct: false, explain: 'El LED integrado es solo uno. Para otros colores necesitas LEDs externos.' }] },
    { titulo: "🧩 Funciones del Programa Blink", tipo: 'matching_game', instruccion: 'Conecta cada línea de código con lo que hace', pairs: [{ left: 'pinMode(13, OUTPUT)', right: 'Configura pin como salida' }, { left: 'digitalWrite(13, HIGH)', right: 'Enciende el LED' }, { left: 'digitalWrite(13, LOW)', right: 'Apaga el LED' }, { left: 'delay(1000)', right: 'Espera 1 segundo' }] },
    { titulo: "✅ Quiz: PWM", tipo: 'mini_quiz', pregunta: "¿Qué función de Arduino permite controlar el BRILLO de un LED (no solo encender/apagar)?", opciones: ["digitalRead()", "analogWrite()", "Serial.print()", "pinMode()"], respuestaCorrecta: 1, explicacion: "analogWrite() envía señales PWM (0-255) que permiten variar el brillo del LED. 255 = máximo brillo, 0 = apagado. 🌟" },
    { titulo: "✅ Quiz: Múltiples LEDs", tipo: 'mini_quiz', pregunta: "Si quieres controlar 3 LEDs independientemente, ¿cuántos pines digitales necesitas?", opciones: ["1 pin", "2 pines", "3 pines", "6 pines"], respuestaCorrecta: 2, explicacion: "¡Un pin por cada LED! Cada pin controla un LED de forma independiente. 3 LEDs = 3 pines. 🔌" },
    { titulo: "✅ Quiz: Secuencia de LEDs", tipo: 'mini_quiz', pregunta: "Para hacer un efecto de 'luces de navidad' con 5 LEDs que se encienden en secuencia, ¿qué estructura de código usarías?", opciones: ["Solo if/else", "Un ciclo for con delay", "Solo delay", "analogRead"], respuestaCorrecta: 1, explicacion: "Un ciclo for recorre cada LED en orden, encendiéndolo y apagándolo con delay para crear la secuencia. 🎄" },
  ],
  'mod_componentes': [ // "Práctica 3: Motor con Arduino" has 2, need 8
    { titulo: "✅ Quiz: Driver de Motor", tipo: 'mini_quiz', pregunta: "¿Por qué no puedes conectar un motor DC directamente a un pin del Arduino?", opciones: ["El motor es muy pequeño", "El pin no puede dar suficiente corriente para el motor", "El Arduino no tiene pines", "Los motores no usan electricidad"], respuestaCorrecta: 1, explicacion: "Los pines del Arduino dan máximo ~40mA, pero un motor necesita 200-700mA. ¡Necesitas un driver como el L298N! ⚡" },
    { titulo: "✅ Quiz: L298N", tipo: 'mini_quiz', pregunta: "¿Cuántos motores DC puede controlar simultáneamente el driver L298N?", opciones: ["1 motor", "2 motores", "4 motores", "6 motores"], respuestaCorrecta: 1, explicacion: "El L298N tiene 2 canales (puentes H), cada uno controla 1 motor DC. ¡Perfecto para un robot con 2 ruedas! 🤖" },
    { titulo: "✅ Quiz: Dirección del Motor", tipo: 'mini_quiz', pregunta: "¿Cómo cambias la dirección de giro de un motor DC con el L298N?", opciones: ["Cambias la velocidad", "Inviertes las señales IN1 e IN2", "Desconectas el Arduino", "No se puede cambiar"], respuestaCorrecta: 1, explicacion: "Si IN1=HIGH, IN2=LOW gira en un sentido. IN1=LOW, IN2=HIGH gira al contrario. ¡Así tu robot va adelante y atrás! 🔄" },
    { titulo: "✅❌ Motores: ¿V o F?", tipo: 'true_false', statements: [{ text: 'La velocidad de un motor DC se puede controlar con PWM (analogWrite).', correct: true, explain: 'PWM varía el voltaje promedio: 0=parado, 127=medio, 255=máxima velocidad.' }, { text: 'Un motor DC y un servo motor funcionan exactamente igual.', correct: false, explain: 'El motor DC gira continuamente, el servo se mueve a un ángulo específico (0°-180°).' }] },
    { titulo: "🧩 Control de Motores", tipo: 'matching_game', instruccion: 'Conecta cada señal con su efecto', pairs: [{ left: 'IN1=HIGH, IN2=LOW', right: 'Gira en sentido horario' }, { left: 'IN1=LOW, IN2=HIGH', right: 'Gira en sentido antihorario' }, { left: 'IN1=LOW, IN2=LOW', right: 'Motor detenido' }, { left: 'ENA con PWM', right: 'Controla la velocidad' }] },
    { titulo: "✅ Quiz: Alimentación", tipo: 'mini_quiz', pregunta: "¿Por qué el L298N necesita una fuente de alimentación SEPARADA del Arduino?", opciones: ["Por estética", "Los motores necesitan más corriente de la que el USB puede dar", "Para que sea más caro", "No necesita fuente separada"], respuestaCorrecta: 1, explicacion: "Los motores consumen mucha corriente (0.5-2A). El USB solo da 500mA. Una fuente separada (baterías) alimenta los motores sin sobrecargar el Arduino. 🔋" },
    { titulo: "✅ Quiz: Puente H", tipo: 'mini_quiz', pregunta: "¿Qué es un 'Puente H' en el contexto de motores?", opciones: ["Un puente físico sobre un río", "Un circuito que permite invertir la polaridad del motor", "Un tipo de engranaje", "Un sensor de posición"], respuestaCorrecta: 1, explicacion: "El Puente H es un circuito con 4 transistores que permite cambiar la dirección de la corriente al motor, invirtiendo su giro. 🔀" },
    { titulo: "✅ Quiz: Servo vs DC", tipo: 'mini_quiz', pregunta: "¿Qué motor usarías para las RUEDAS de un robot móvil?", opciones: ["Servo Motor (ángulo fijo)", "Motor Paso a Paso (muy lento)", "Motor DC (giro continuo)", "Motor de lavadora"], respuestaCorrecta: 2, explicacion: "¡Motor DC! Gira continuamente a buena velocidad, perfecto para ruedas. El servo es mejor para brazos y garras. 🛞" },
  ],
  'mod_control': [ // "Lógica y Control" has 3, need 7
    { titulo: "✅ Quiz: Lazo Abierto vs Cerrado", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia principal entre un sistema de lazo abierto y uno de lazo cerrado?", opciones: ["El lazo abierto es más caro", "El lazo cerrado usa retroalimentación (sensores) para corregirse", "No hay diferencia", "El lazo abierto es más preciso"], respuestaCorrecta: 1, explicacion: "El lazo cerrado usa sensores para medir el resultado y corregir errores. ¡Como un termostato que mide la temperatura! 🌡️" },
    { titulo: "✅ Quiz: PID", tipo: 'mini_quiz', pregunta: "¿Qué significan las letras P, I, D en un controlador PID?", opciones: ["Potencia, Intensidad, Dirección", "Proporcional, Integral, Derivativo", "Programar, Instalar, Depurar", "Positivo, Inverso, Digital"], respuestaCorrecta: 1, explicacion: "P=Proporcional (error actual), I=Integral (errores pasados acumulados), D=Derivativo (predicción del futuro). 🎯" },
    { titulo: "✅ Quiz: Retroalimentación", tipo: 'mini_quiz', pregunta: "Un robot siguelíneas que usa sensores IR para ajustar su dirección es un ejemplo de:", opciones: ["Sistema de lazo abierto", "Sistema de lazo cerrado", "Sistema sin control", "Sistema manual"], respuestaCorrecta: 1, explicacion: "¡Lazo cerrado! El sensor detecta la línea, el cerebro decide, y los motores corrigen. Hay retroalimentación constante. 🔄" },
    { titulo: "✅❌ Control: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un tostador con temporizador es un ejemplo de control de lazo abierto.', correct: true, explain: 'Solo usa tiempo, no mide si el pan está tostado. No tiene retroalimentación.' }, { text: 'El controlador PID solo se usa en robots industriales grandes.', correct: false, explain: 'Se usa en drones, robots pequeños, impresoras 3D, y muchos proyectos con Arduino.' }] },
    { titulo: "🧩 Tipos de Control", tipo: 'matching_game', instruccion: 'Conecta cada sistema con su tipo de control', pairs: [{ left: '⏲️ Tostador con timer', right: 'Lazo abierto' }, { left: '🌡️ Termostato de casa', right: 'Lazo cerrado' }, { left: '🚗 Cruise control', right: 'Lazo cerrado' }, { left: '💡 Interruptor de luz', right: 'Lazo abierto' }] },
    { titulo: "✅ Quiz: Señal de Error", tipo: 'mini_quiz', pregunta: "En un sistema de control, ¿qué es la 'señal de error'?", opciones: ["Un mensaje de error en el código", "La diferencia entre el valor deseado y el valor actual", "Un sonido de alarma", "Un fallo del sistema"], respuestaCorrecta: 1, explicacion: "Error = Setpoint - Valor actual. Si quieres 25°C y tienes 23°C, el error es 2°C. ¡El controlador intenta reducirlo a 0! 🎯" },
    { titulo: "✅ Quiz: Control en la Vida Real", tipo: 'mini_quiz', pregunta: "¿Cuál de estos es un ejemplo de control de lazo cerrado en tu vida diaria?", opciones: ["Encender una lámpara", "Un aire acondicionado con termostato", "Abrir una llave de agua", "Prender un ventilador"], respuestaCorrecta: 1, explicacion: "¡El aire acondicionado con termostato! Mide la temperatura, la compara con la deseada y ajusta. ¡Es retroalimentación! ❄️" },
  ],
  'mod_prog_avanzada': [ // "Programación Avanzada" has 2, need 8
    { titulo: "✅ Quiz: Arrays", tipo: 'mini_quiz', pregunta: "¿Qué es un array (arreglo) en programación?", opciones: ["Un tipo de motor", "Una colección ordenada de datos del mismo tipo", "Un sensor especial", "Un error de código"], respuestaCorrecta: 1, explicacion: "Un array guarda múltiples valores bajo un solo nombre: int leds[] = {2, 3, 4, 5}. ¡Perfecto para controlar varios pines! 📊" },
    { titulo: "✅ Quiz: Librerías", tipo: 'mini_quiz', pregunta: "¿Qué es una librería en Arduino?", opciones: ["Un lugar con libros", "Código pre-escrito que puedes reutilizar para tareas comunes", "Un tipo de cable", "Un sensor de lectura"], respuestaCorrecta: 1, explicacion: "Las librerías son código listo para usar: Servo.h para servos, NewPing.h para ultrasónico, etc. ¡No reinventes la rueda! 📚" },
    { titulo: "✅ Quiz: Bluetooth", tipo: 'mini_quiz', pregunta: "¿Qué módulo se usa comúnmente para agregar Bluetooth a un Arduino?", opciones: ["WiFi Shield", "HC-05/HC-06", "GPS NEO-6M", "Sensor DHT11"], respuestaCorrecta: 1, explicacion: "El HC-05 y HC-06 son módulos Bluetooth económicos que se comunican por serial con el Arduino. ¡Control desde el celular! 📱" },
    { titulo: "✅❌ Programación Avanzada: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un array puede almacenar múltiples valores bajo un solo nombre.', correct: true, explain: 'Ejemplo: int sensores[3] = {100, 200, 300}. Tres valores en una sola variable.' }, { text: 'Las funciones en Arduino solo pueden retornar números enteros.', correct: false, explain: 'Pueden retornar int, float, bool, String, char, o void (nada).' }] },
    { titulo: "🧩 Comunicación Inalámbrica", tipo: 'matching_game', instruccion: 'Conecta cada módulo con su tecnología', pairs: [{ left: 'HC-05', right: 'Bluetooth' }, { left: 'ESP8266', right: 'WiFi' }, { left: 'nRF24L01', right: 'Radio 2.4GHz' }, { left: 'NEO-6M', right: 'GPS/Satélite' }] },
    { titulo: "✅ Quiz: Funciones Personalizadas", tipo: 'mini_quiz', pregunta: "¿Por qué es buena práctica crear funciones personalizadas en tu código?", opciones: ["Para que el código sea más largo", "Para organizar y reutilizar bloques de código", "Para que sea más difícil de leer", "No es buena práctica"], respuestaCorrecta: 1, explicacion: "Las funciones hacen tu código organizado, legible y reutilizable. Ejemplo: moverAdelante(), girarDerecha(). 📋" },
    { titulo: "✅ Quiz: Comunicación Serial", tipo: 'mini_quiz', pregunta: "¿Qué función usas para enviar datos desde Arduino al computador?", opciones: ["analogWrite()", "digitalRead()", "Serial.println()", "pinMode()"], respuestaCorrecta: 2, explicacion: "Serial.println() envía datos al Monitor Serial del IDE de Arduino. ¡Perfecto para depurar y ver valores de sensores! 📟" },
    { titulo: "✅ Quiz: Índices de Array", tipo: 'mini_quiz', pregunta: "En un array de 5 elementos, ¿cuál es el índice del PRIMER elemento?", opciones: ["1", "0", "5", "-1"], respuestaCorrecta: 1, explicacion: "¡Los arrays empiezan en 0! El primer elemento es [0], el segundo [1], etc. Es uno de los conceptos más importantes en programación. 🔢" },
  ],
  'mod_diseno': [ // "Mecanismos y Diseño" has 2, need 8
    { titulo: "✅ Quiz: CAD", tipo: 'mini_quiz', pregunta: "¿Qué significa CAD en diseño de robots?", opciones: ["Control Automático Digital", "Diseño Asistido por Computadora", "Cable de Alta Definición", "Centro de Análisis de Datos"], respuestaCorrecta: 1, explicacion: "CAD = Computer-Aided Design (Diseño Asistido por Computadora). Programas como TinkerCAD, Fusion 360 y FreeCAD. 🖥️" },
    { titulo: "✅ Quiz: Impresión 3D", tipo: 'mini_quiz', pregunta: "¿Qué material es el más común para impresión 3D en robótica?", opciones: ["Metal líquido", "PLA (ácido poliláctico)", "Vidrio templado", "Cemento"], respuestaCorrecta: 1, explicacion: "¡PLA! Es biodegradable, fácil de imprimir y suficientemente resistente para prototipos de robots. 🖨️" },
    { titulo: "✅ Quiz: Tolerancias", tipo: 'mini_quiz', pregunta: "¿Qué son las 'tolerancias' en diseño mecánico?", opciones: ["La paciencia del diseñador", "El margen de error aceptable en las medidas de una pieza", "El peso máximo del robot", "La velocidad del motor"], respuestaCorrecta: 1, explicacion: "Las tolerancias son los márgenes permitidos en medidas. Un agujero de 5mm ± 0.1mm acepta entre 4.9mm y 5.1mm. ¡Precisión! 📐" },
    { titulo: "✅❌ Diseño: ¿V o F?", tipo: 'true_false', statements: [{ text: 'TinkerCAD es un programa gratuito para diseño 3D.', correct: true, explain: 'TinkerCAD de Autodesk es gratuito, online y perfecto para principiantes.' }, { text: 'La impresión 3D solo puede hacer piezas decorativas, no funcionales.', correct: false, explain: 'Se imprimen engranajes, chasis, soportes de sensores y piezas funcionales para robots.' }] },
    { titulo: "🧩 Herramientas de Diseño", tipo: 'matching_game', instruccion: 'Conecta cada herramienta con su uso', pairs: [{ left: '🖥️ TinkerCAD', right: 'Diseño 3D para principiantes' }, { left: '🖨️ Impresora 3D', right: 'Fabricar piezas físicas' }, { left: '📐 Calibrador/Vernier', right: 'Medir con precisión' }, { left: '✏️ Boceto en papel', right: 'Primera idea de diseño' }] },
    { titulo: "✅ Quiz: Materiales para Robots", tipo: 'mini_quiz', pregunta: "¿Qué material usarías para un robot que necesita ser MUY liviano?", opciones: ["Acero inoxidable", "Aluminio o fibra de carbono", "Plomo", "Concreto"], respuestaCorrecta: 1, explicacion: "El aluminio y la fibra de carbono son muy livianos pero resistentes. ¡Los drones y robots de competencia los usan! 🏎️" },
    { titulo: "✅ Quiz: Diseño Iterativo", tipo: 'mini_quiz', pregunta: "¿Qué significa 'diseño iterativo'?", opciones: ["Diseñar solo una vez y no cambiar", "Diseñar, probar, mejorar y repetir", "Copiar el diseño de otro", "No usar computadora"], respuestaCorrecta: 1, explicacion: "¡Diseñar-probar-mejorar en ciclos! Cada versión (v1, v2, v3...) es mejor. Los ingenieros nunca se conforman con la primera versión. 🔄" },
    { titulo: "✅ Quiz: Ergonomía en Robots", tipo: 'mini_quiz', pregunta: "¿Por qué es importante que el diseño de un robot sea accesible (fácil de abrir y reparar)?", opciones: ["Solo por estética", "Para poder cambiar componentes, pilas y cables fácilmente", "No es importante", "Para que sea más pesado"], respuestaCorrecta: 1, explicacion: "¡Un buen diseño permite mantenimiento fácil! Si no puedes llegar a las pilas o cables, cada reparación es una pesadilla. 🔧" },
  ],
  'mod_primer_led': [ // "¡Proyecto Final!" has 0, need 10
    { titulo: "✅ Quiz: Planificación del Proyecto", tipo: 'mini_quiz', pregunta: "¿Cuál es el primer paso para un proyecto final de robótica?", opciones: ["Comprar todo inmediatamente", "Definir el objetivo y hacer un plan", "Programar sin saber qué construir", "Copiar un proyecto de internet"], respuestaCorrecta: 1, explicacion: "¡Siempre empieza con un plan! Define qué quieres lograr, qué materiales necesitas y los pasos a seguir. 📋" },
    { titulo: "✅ Quiz: Componentes del Proyecto", tipo: 'mini_quiz', pregunta: "Para un robot evasor de obstáculos necesitas Arduino, motor, driver y...", opciones: ["Impresora", "Sensor ultrasónico", "Pantalla OLED", "Cámara profesional"], respuestaCorrecta: 1, explicacion: "¡El sensor ultrasónico detecta obstáculos! HC-SR04 mide la distancia y el robot decide si girar o frenar. 🦇" },
    { titulo: "✅ Quiz: Integración", tipo: 'mini_quiz', pregunta: "¿Qué significa 'integrar' componentes en un proyecto de robótica?", opciones: ["Comprar piezas nuevas", "Conectar y hacer funcionar todos los componentes juntos", "Desmontar el robot", "Pintar el chasis"], respuestaCorrecta: 1, explicacion: "Integrar es hacer que sensores, motores, cerebro y energía trabajen juntos como un sistema completo. 🤖" },
    { titulo: "✅❌ Proyecto Final: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Es normal que un proyecto no funcione a la primera; debuggear es parte del proceso.', correct: true, explain: 'Los ingenieros siempre debuggean. Encontrar y corregir errores es aprender.' }, { text: 'Un buen proyecto de robótica solo necesita hardware, el software no importa.', correct: false, explain: 'Hardware Y software son igualmente importantes. El programa es la inteligencia del robot.' }] },
    { titulo: "🧩 Pasos del Proyecto", tipo: 'matching_game', instruccion: 'Ordena los pasos del proyecto', pairs: [{ left: '1️⃣ Primer paso', right: 'Planificar y diseñar' }, { left: '2️⃣ Segundo paso', right: 'Armar el hardware' }, { left: '3️⃣ Tercer paso', right: 'Programar el código' }, { left: '4️⃣ Cuarto paso', right: 'Probar y depurar' }] },
    { titulo: "✅ Quiz: Debugging", tipo: 'mini_quiz', pregunta: "Si tu robot no se mueve, ¿cuál es el primer paso para encontrar el problema?", opciones: ["Comprar un robot nuevo", "Revisar las conexiones y la alimentación", "Borrar todo el código", "Rendirse"], respuestaCorrecta: 1, explicacion: "¡Revisa conexiones primero! El 80% de los problemas son cables sueltos o mala alimentación. Luego revisa el código. 🔍" },
    { titulo: "✅ Quiz: Documentación", tipo: 'mini_quiz', pregunta: "¿Por qué es importante documentar tu proyecto?", opciones: ["No es importante", "Para poder replicarlo, mejorarlo y compartirlo con otros", "Solo para obtener puntos extra", "Para hacerlo más difícil"], respuestaCorrecta: 1, explicacion: "La documentación permite que tú u otros entiendan cómo funciona, reparen problemas y hagan mejoras. ¡Es profesional! 📝" },
    { titulo: "✅ Quiz: Presentación", tipo: 'mini_quiz', pregunta: "¿Qué debe incluir una buena presentación de proyecto de robótica?", opciones: ["Solo el robot funcional", "Objetivo, materiales, proceso, resultado y mejoras futuras", "Solo el código fuente", "Solo fotos bonitas"], respuestaCorrecta: 1, explicacion: "¡Una presentación completa! Explica el problema, cómo lo resolviste, muestra que funciona y sugiere mejoras. 🎤" },
    { titulo: "✅❌ Habilidades de Ingeniero: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Trabajar en equipo es una habilidad importante en robótica.', correct: true, explain: 'Los proyectos reales involucran mecánicos, programadores y diseñadores trabajando juntos.' }, { text: 'Los buenos ingenieros nunca cometen errores.', correct: false, explain: 'Los mejores ingenieros cometen errores pero aprenden de ellos. ¡Cada error es una lección!' }] },
    { titulo: "✅ Quiz: Mejora Continua", tipo: 'mini_quiz', pregunta: "Terminaste tu proyecto pero el robot es lento. ¿Qué harías?", opciones: ["Dejarlo así, ya funciona", "Analizar por qué es lento e implementar mejoras (v2)", "Empezar un proyecto completamente diferente", "Quitar los sensores"], respuestaCorrecta: 1, explicacion: "¡Mejora continua! Identifica el cuello de botella (motores, código, peso) y haz una versión mejorada. ¡Los ingenieros iteran! 🚀" },
  ],
};

// Function to generate extra questions for worlds 2-6 modules
function generateWorldQuestions(worldNum, modules) {
  const extra = {};
  modules.forEach(mod => {
    const need = 10 - mod.has;
    if (need <= 0) return;
    const qs = [];
    const topic = mod.topic;
    // Generate a mix of mini_quiz, true_false, and matching_game
    // We'll create themed questions based on module topic
    for (let i = 0; i < need; i++) {
      if (i === need - 1 && need >= 3) {
        // Last one: matching_game if we haven't added one yet
        qs.push({ titulo: `🧩 Conecta: ${topic}`, tipo: 'matching_game', instruccion: `Relaciona los conceptos de ${topic}`, pairs: mod.matchPairs || [{ left: 'Concepto A', right: 'Definición A' }, { left: 'Concepto B', right: 'Definición B' }, { left: 'Concepto C', right: 'Definición C' }] });
      } else if (i === need - 2 && need >= 4) {
        // Second to last: true_false
        qs.push({ titulo: `✅❌ ${topic}: ¿V o F?`, tipo: 'true_false', statements: mod.tfStatements || [{ text: 'Afirmación sobre ' + topic, correct: true, explain: 'Explicación.' }] });
      } else {
        // mini_quiz
        if (mod.quizzes && mod.quizzes[i]) {
          qs.push(mod.quizzes[i]);
        }
      }
    }
    extra[mod.id] = qs;
  });
  return extra;
}

// For worlds 2-6, I'll generate the questions differently
// I'll read each file, find each module and inject questions before the last closing bracket

function injectQuestions(filePath, extraQuestions) {
  let src = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const [moduleId, questions] of Object.entries(extraQuestions)) {
    if (questions.length === 0) continue;
    
    // Find the module's contenidoTeorico array ending
    // Strategy: find `id: '${moduleId}'` then find the last item of contenidoTeorico,
    // then insert new questions before the closing of the array
    
    const idPattern = `id: '${moduleId}'`;
    const idIdx = src.indexOf(idPattern);
    if (idIdx === -1) {
      console.log(`WARNING: Module ${moduleId} not found in ${filePath}`);
      continue;
    }
    
    // Find contenidoTeorico after this module id
    const afterId = src.slice(idIdx);
    const ctIdx = afterId.indexOf('contenidoTeorico:');
    if (ctIdx === -1) {
      console.log(`WARNING: contenidoTeorico not found for ${moduleId}`);
      continue;
    }
    
    // Find the opening bracket of contenidoTeorico
    const afterCt = afterId.slice(ctIdx);
    const bracketStart = afterCt.indexOf('[');
    const absStart = idIdx + ctIdx + bracketStart;
    
    // Now find the matching closing bracket
    let depth = 0;
    let closingIdx = -1;
    for (let i = absStart; i < src.length; i++) {
      if (src[i] === '[') depth++;
      else if (src[i] === ']') {
        depth--;
        if (depth === 0) {
          closingIdx = i;
          break;
        }
      }
    }
    
    if (closingIdx === -1) {
      console.log(`WARNING: Closing bracket not found for ${moduleId}`);
      continue;
    }
    
    // Generate the questions text
    const questionsStr = questions.map(q => {
      return '\n            ' + JSON.stringify(q).replace(/"/g, "'").replace(/\\'/g, "\\'") + ',';
    }).join('');
    
    // Insert before the closing bracket
    // Find the last comma or content before ]
    src = src.slice(0, closingIdx) + questionsStr + '\n        ' + src.slice(closingIdx);
    modified = true;
    console.log(`✅ ${moduleId}: +${questions.length} questions injected`);
  }
  
  if (modified) {
    fs.writeFileSync(filePath, src, 'utf-8');
    console.log(`💾 Saved: ${filePath}`);
  }
}

// Better serialization that matches the existing code style
function serializeQuestion(q) {
  if (q.tipo === 'mini_quiz') {
    const opts = q.opciones.map(o => `"${o.replace(/"/g, '\\"')}"`).join(', ');
    return `{ titulo: "${q.titulo}", tipo: 'mini_quiz', pregunta: "${q.pregunta.replace(/"/g, '\\"')}", opciones: [${opts}], respuestaCorrecta: ${q.respuestaCorrecta}, explicacion: "${q.explicacion.replace(/"/g, '\\"')}" }`;
  }
  if (q.tipo === 'true_false') {
    const stmts = q.statements.map(s => `{ text: '${s.text.replace(/'/g, "\\'")}', correct: ${s.correct}, explain: '${s.explain.replace(/'/g, "\\'")}' }`).join(', ');
    return `{ titulo: "${q.titulo}", tipo: 'true_false', statements: [${stmts}] }`;
  }
  if (q.tipo === 'matching_game') {
    const pairs = q.pairs.map(p => `{ left: '${p.left.replace(/'/g, "\\'")}', right: '${p.right.replace(/'/g, "\\'")}' }`).join(', ');
    return `{ titulo: "${q.titulo}", tipo: 'matching_game', instruccion: '${q.instruccion.replace(/'/g, "\\'")}', pairs: [${pairs}] }`;
  }
  return JSON.stringify(q);
}

function injectQuestionsV2(filePath, extraQuestions) {
  let src = fs.readFileSync(filePath, 'utf-8');
  let offset = 0;
  
  for (const [moduleId, questions] of Object.entries(extraQuestions)) {
    if (!questions || questions.length === 0) continue;
    
    const idPattern = `id: '${moduleId}'`;
    const idIdx = src.indexOf(idPattern, offset);
    if (idIdx === -1) {
      console.log(`WARNING: Module ${moduleId} not found in ${filePath}`);
      continue;
    }
    
    // Find contenidoTeorico opening bracket
    const ctSearch = src.indexOf('contenidoTeorico:', idIdx);
    if (ctSearch === -1 || ctSearch - idIdx > 2000) continue;
    
    const bracketStart = src.indexOf('[', ctSearch);
    if (bracketStart === -1) continue;
    
    // Find matching closing bracket
    let depth = 0;
    let closingIdx = -1;
    for (let i = bracketStart; i < src.length; i++) {
      if (src[i] === '[') depth++;
      else if (src[i] === ']') {
        depth--;
        if (depth === 0) { closingIdx = i; break; }
      }
    }
    if (closingIdx === -1) continue;
    
    // Build insertion string
    const insertions = questions.map(q => '\n            ' + serializeQuestion(q) + ',').join('');
    
    src = src.slice(0, closingIdx) + insertions + src.slice(closingIdx);
    offset = closingIdx + insertions.length;
    console.log(`✅ ${moduleId}: +${questions.length} questions`);
  }
  
  fs.writeFileSync(filePath, src, 'utf-8');
  console.log(`💾 Saved: ${filePath}\n`);
}

// Inject World 1 questions
console.log('=== WORLD 1 (modulesData.js) ===');
injectQuestionsV2('src/data/modulesData.js', W1_EXTRA);

console.log('\nDone! World 1 questions injected.');
