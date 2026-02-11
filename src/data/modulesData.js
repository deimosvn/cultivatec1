// ==========================================================
// --- DATOS EXPANDIDOS DE MÓDULOS DE ROBÓTICA ---
// ==========================================================

export const MODULOS_DATA = [
    { 
        id: 'mod_electr', 
        titulo: "Módulo 1: Electricidad Inicial", 
        icon: '⚡', 
        descripcion: "Aprende qué es la electricidad, voltaje, corriente y resistencia con analogías divertidas.", 
        specialView: 'Module1View', 
        contenidoTeorico: '__MODULO_1_REF__', 
    },
    { 
        id: 'mod_electon', 
        titulo: "Módulo 2: Electrónica Inicial", 
        icon: '🔌', 
        descripcion: "Descubre diodos, transistores, capacitores, circuitos serie/paralelo y herramientas electrónicas.", 
        contenidoTeorico: [
            { titulo: "1. ¿Qué es la Electrónica?", tipo: 'texto', puntos: [
                "**Electrónica:** Ciencia que estudia cómo controlar el flujo de electrones usando componentes especiales.",
                "**Diferencia con Electricidad:** La electricidad es la energía; la electrónica la *controla* para hacer cosas inteligentes.",
                "**Señales Digitales:** Solo tienen dos estados: encendido (1) o apagado (0). Así funcionan las computadoras.",
                "**Señales Analógicas:** Tienen valores continuos (ejemplo: la temperatura puede ser 23.5°C, 23.6°C, etc.)."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "¡El primer transistor fue inventado en 1947 y era del tamaño de tu mano! Hoy, un chip de celular tiene **más de 15 MIL MILLONES** de transistores, cada uno más pequeño que un virus. 🦠" },
            { titulo: "2. Componentes Pasivos", tipo: 'texto', puntos: [
                "**Resistencia (R):** Limita el flujo de corriente. Se mide en **Ohmios (Ω)**. Los colores en sus bandas indican su valor.",
                "**Capacitor (C):** Almacena energía temporalmente, como una mini-batería rápida. Se mide en **Faradios (F)**.",
                "**Inductor (L):** Almacena energía en un campo magnético. Se usa en filtros y transformadores.",
                "**Potenciómetro:** Resistencia variable. ¡Giras la perilla y cambia el valor! Se usa para controlar volumen o brillo."
            ]},
            { titulo: "3. Componentes Activos", tipo: 'texto', puntos: [
                "**Diodo:** Permite que la corriente fluya en UNA sola dirección. Como una puerta de un solo sentido.",
                "**LED (Diodo Emisor de Luz):** Un diodo especial que ¡brilla! Tiene pata larga (+) y corta (-).",
                "**Transistor:** El componente más importante. Actúa como **interruptor** electrónico o **amplificador** de señales.",
                "**Circuito Integrado (CI):** Miles de transistores en un chip diminuto. El Arduino usa un **ATmega328**."
            ]},
            { titulo: "💡 Ejemplo: LED con Resistencia", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Encender un LED protegido con resistencia\nvoid setup() {\n  pinMode(9, OUTPUT);  // Pin 9 → Resistencia → LED\n}\n\nvoid loop() {\n  analogWrite(9, 128);  // Brillo al 50%\n  delay(2000);\n  analogWrite(9, 255);  // Brillo al 100%\n  delay(2000);\n}", explicacion: "Usamos analogWrite para controlar el brillo del LED a través de la resistencia. ¡Sin resistencia, el LED se quemaría!" },
            { titulo: "4. Circuitos Serie y Paralelo", tipo: 'texto', puntos: [
                "**Circuito en Serie:** Los componentes van uno detrás del otro. Si uno falla, TODO se apaga.",
                "**Circuito en Paralelo:** Cada componente tiene su propio camino. Si uno falla, los demás siguen.",
                "**Voltaje en Serie:** Se *reparte* entre los componentes. Cada uno recibe una porción.",
                "**Voltaje en Paralelo:** Es *igual* para todos los componentes conectados."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Si conectas 3 LEDs en serie y uno se funde, ¿qué pasa?", opciones: ["Se apagan todos", "Solo ese se apaga", "Los otros brillan más"], respuestaCorrecta: 0, explicacion: "¡Correcto! En serie, si uno falla, se rompe el circuito completo y todos se apagan." },
            { titulo: "5. Herramientas del Electrónico", tipo: 'texto', puntos: [
                "**Multímetro:** Mide voltaje, corriente y resistencia. ¡Tu mejor amigo para diagnosticar circuitos!",
                "**Protoboard:** Tablero con agujeros conectados internamente para armar circuitos sin soldar.",
                "**Cautín (Soldador):** Para unir componentes permanentemente. ¡Solo con supervisión de un adulto!",
                "**Cables Dupont:** Cables con puntas especiales para conectar componentes fácilmente."
            ]},
            { titulo: "🎯 Actividad Práctica", tipo: 'activity', instruccion: "**Reto:** Consigue un multímetro y una pila. Pon el multímetro en modo voltaje (V) DC y mide el voltaje de la pila. ¿Marca exactamente lo que dice la etiqueta?", materiales: ["Multímetro", "Pila AA (1.5V) o 9V", "Cables de prueba"] }
        ] 
    },
    { 
        id: 'mod_prog_gen', 
        titulo: "Módulo 3: Mecánica Inicial", 
        icon: '⚙️', 
        descripcion: "Engranajes, palancas, poleas, fuerzas y torque: las piezas que hacen moverse a los robots.", 
        contenidoTeorico: [
            { titulo: "1. ¿Qué es la Mecánica?", tipo: 'texto', puntos: [
                "**Mecánica:** Rama de la física que estudia el movimiento y las fuerzas que lo causan.",
                "**En Robótica:** La mecánica diseña ruedas, brazos, pinzas y todo lo que se *mueve*.",
                "**Estructura:** El esqueleto del robot. Debe ser fuerte pero ligera para moverse bien.",
                "**Mecanismo:** Conjunto de piezas que transforman un tipo de movimiento en otro."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Las **hormigas** pueden cargar entre 10 y 50 veces su propio peso. Los ingenieros de robótica estudian a los insectos para diseñar robots más eficientes. ¡Se llama **biomimética**! 🐜🤖" },
            { titulo: "2. Máquinas Simples", tipo: 'texto', puntos: [
                "**Palanca:** Barra que gira sobre un punto fijo (fulcro). Multiplica tu fuerza. Ejemplo: un sube y baja.",
                "**Poleas:** Ruedas con cuerda que permiten levantar cosas pesadas con menos esfuerzo.",
                "**Plano Inclinado:** Una rampa. Es más fácil subir una caja por una rampa que levantarla directo.",
                "**Rueda y Eje:** Reduce la fricción y permite mover cosas. ¡Los robots con ruedas la usan!"
            ]},
            { titulo: "3. Engranajes: Los Dientes Mágicos", tipo: 'texto', puntos: [
                "**Engranaje:** Rueda dentada que transmite movimiento rotatorio a otra rueda dentada.",
                "**Relación de Transmisión:** Engranaje grande moviendo uno pequeño = más velocidad, menos fuerza.",
                "**Engranaje Reductor:** Engranaje pequeño moviendo uno grande = más fuerza, menos velocidad.",
                "**Tipos:** Rectos (comunes), cónicos (cambian dirección 90°), cremallera (giro a línea recta)."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Si quieres que tu robot tenga MÁS FUERZA para subir una rampa, ¿qué relación de engranajes usas?", opciones: ["Engranaje pequeño → grande (reductor)", "Engranaje grande → pequeño (multiplicador)", "Sin engranajes"], respuestaCorrecta: 0, explicacion: "¡Exacto! Un engranaje reductor da más torque (fuerza de giro) a costa de menos velocidad." },
            { titulo: "4. Fuerza y Torque", tipo: 'texto', puntos: [
                "**Fuerza:** Empujón o jalón que mueve, detiene o deforma un objeto. Se mide en **Newtons (N)**.",
                "**Torque:** Fuerza de giro. Lo que hace que un motor pueda mover una rueda. Se mide en **N·m**.",
                "**Fricción:** Fuerza que se opone al movimiento. Útil para frenos, molesta para ruedas.",
                "**Centro de Gravedad:** Punto de equilibrio del robot. Si está muy alto, ¡el robot se voltea!"
            ]},
            { titulo: "Fórmula: Relación de Engranajes", tipo: 'formula', texto: "La relación de transmisión se calcula así:", formula: "Relación = Dientes<sub>conducido</sub> ÷ Dientes<sub>conductor</sub>", explicacion: "Si el conductor tiene 10 dientes y el conducido 40, la relación es 4:1 (4x más fuerza, 4x menos velocidad)." },
            { titulo: "🎯 Actividad Práctica", tipo: 'activity', instruccion: "**Reto Lego:** Si tienes piezas Lego Technic, construye un tren de engranajes. Prueba cómo cambia la velocidad al intercambiar el engranaje grande con el pequeño.", materiales: ["Piezas Lego Technic o engranajes", "Cuaderno para dibujar observaciones"] }
        ] 
    },
    { 
        id: 'mod_mecanica', 
        titulo: "Módulo 4: Programación Inicial", 
        icon: '💻', 
        descripcion: "Qué es programar, variables, condiciones, ciclos y funciones explicados de forma sencilla.", 
        contenidoTeorico: [
            { titulo: "1. ¿Qué es Programar?", tipo: 'texto', puntos: [
                "**Programar:** Darle instrucciones a una computadora o robot en un idioma que entienda.",
                "**Algoritmo:** Lista de pasos ordenados para resolver un problema. ¡Como una receta de cocina!",
                "**Lenguaje de Programación:** El idioma que usamos. Los más populares en robótica: **C++**, **Python** y **Arduino**.",
                "**Bug (Error):** Un error en el código. Encontrarlo y arreglarlo se llama **debugging** (depuración)."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "La palabra **Bug** (bicho) se usó por primera vez en 1947 cuando una polilla real se metió dentro de una computadora Harvard Mark II y causó un error. ¡La científica Grace Hopper la pegó en su cuaderno! 🦋" },
            { titulo: "💡 Tu Primer Programa en Python", tipo: 'code_example', lenguaje: 'Python', codigo: "# Mi primer programa\nnombre = \"CultivaTec\"\nedad = 10\n\nprint(\"¡Hola! Soy\", nombre)\nprint(\"Tengo\", edad, \"años\")\nprint(\"En 5 años tendré\", edad + 5, \"años\")", explicacion: "Creamos variables (cajitas) para guardar un nombre y una edad. Luego usamos print() para mostrar mensajes. ¡Python es como hablar en inglés!" },
            { titulo: "2. Variables: Las Cajitas de Memoria", tipo: 'texto', puntos: [
                "**Variable:** Caja con nombre donde guardas un dato. Ejemplo: `edad = 10`.",
                "**Tipos de Datos:** **int** (enteros: 5), **float** (decimales: 3.14), **String** (texto: \"Hola\"), **bool** (verdadero/falso).",
                "**Asignación:** Guardar un valor: `velocidad = 100`. Puedes cambiarlo después.",
                "**Constante:** Variable que NUNCA cambia. Ejemplo: `PI = 3.14159`."
            ]},
            { titulo: "💡 Variables en un Robot", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Variables para controlar un robot\nint velocidad = 150;\nint distancia = 0;\nbool hayObstaculo = false;\n\nvoid loop() {\n  distancia = leerSensor();\n  hayObstaculo = (distancia < 20);\n  \n  if (hayObstaculo) {\n    velocidad = 0;  // ¡Frena!\n  } else {\n    velocidad = 150; // Sigue adelante\n  }\n}", explicacion: "Las variables guardan datos del robot: velocidad y distancia. El robot las actualiza constantemente para tomar decisiones." },
            { titulo: "3. Condiciones: El Robot Decide", tipo: 'texto', puntos: [
                "**if (si):** Si una condición es verdadera, ejecuta un bloque de código.",
                "**else (sino):** Si la condición es falsa, ejecuta otro bloque diferente.",
                "**Ejemplo Robot:** `if (distancia < 20) { frenar(); } else { avanzar(); }`",
                "**Operadores:** Mayor (>), Menor (<), Igual (==), Diferente (!=), Mayor o igual (>=)."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué imprime este código?\n\nedad = 12\nif edad >= 10:\n    print(\"Grande\")\nelse:\n    print(\"Pequeño\")", opciones: ["Grande", "Pequeño", "Error"], respuestaCorrecta: 0, explicacion: "Como edad es 12 y 12 >= 10 es verdadero, se ejecuta el bloque del if y se imprime 'Grande'." },
            { titulo: "4. Ciclos: Repetir sin Cansarse", tipo: 'texto', puntos: [
                "**for:** Repite un número exacto de veces. `for (i = 0; i < 10; i++)` → repite 10 veces.",
                "**while:** Repite MIENTRAS una condición sea verdadera. `while (batería > 0) { explorar(); }`",
                "**Loop infinito:** En Arduino, `loop()` se repite para siempre.  ¡El robot nunca se aburre!",
                "**Break:** Palabra mágica para salir de un ciclo antes de que termine."
            ]},
            { titulo: "💡 Ciclo en Python", tipo: 'code_example', lenguaje: 'Python', codigo: "# Contar estrellas\nestrellas = \"\"\n\nfor i in range(1, 6):\n    estrellas = estrellas + \"⭐\"\n    print(f\"Nivel {i}: {estrellas}\")\n\nprint(\"¡Completaste los 5 niveles!\")", explicacion: "El ciclo for repite 5 veces. Cada vez agrega una estrella y muestra el nivel. ¡Es como subir de nivel en un juego!" },
            { titulo: "5. Funciones: Superpoderes Reutilizables", tipo: 'texto', puntos: [
                "**Función:** Bloque de código con nombre que puedes reusar cuando quieras.",
                "**Crear:** `void girarDerecha() { motor1.adelante(); motor2.atras(); }`",
                "**Parámetros:** Datos que le pasas a la función. `avanzar(velocidad)` → le dices qué tan rápido.",
                "**Return:** Algunas funciones devuelven resultado: `int sumar(a, b) { return a + b; }`"
            ]},
            { titulo: "💡 Tip de Programador", tipo: 'tip', texto: "**Regla de oro:** Si copias y pegas el mismo código más de 2 veces, ¡conviértelo en una función! Así tu código será más corto, más limpio y más fácil de arreglar. 🎯" }
        ] 
    },
    { 
        id: 'mod_arduino', 
        titulo: "Módulo 5: Control con Arduino", 
        icon: '🕹️', 
        descripcion: "La plataforma Arduino: pines digitales, analógicos, setup(), loop() y comunicación serial.", 
        contenidoTeorico: [
            { titulo: "1. ¿Qué es Arduino?", tipo: 'texto', puntos: [
                "**Arduino:** Placa electrónica programable de código abierto. ¡El cerebro favorito de los robots!",
                "**Arduino UNO:** La placa más popular. Tiene 14 pines digitales y 6 analógicos.",
                "**Microcontrolador:** El chip principal (ATmega328) que ejecuta tu programa.",
                "**IDE Arduino:** Programa en tu computadora donde escribes y subes el código a la placa."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Arduino fue creado en Italia en 2005 por un grupo de maestros que querían que sus estudiantes pudieran programar hardware fácilmente. ¡El nombre viene de un bar en Ivrea! 🇮🇹" },
            { titulo: "2. Pines: Las Conexiones", tipo: 'texto', puntos: [
                "**Pines Digitales (0-13):** Solo entienden **HIGH** (5V, encendido) o **LOW** (0V, apagado).",
                "**Pines Analógicos (A0-A5):** Leen valores de 0 a 1023. Para sensores de temperatura, luz, etc.",
                "**Pines PWM (~3,5,6,9,10,11):** Simulan valores analógicos. Controlan velocidad de motores y brillo de LEDs.",
                "**GND y 5V/3.3V:** Pines de alimentación. GND = tierra (negativo), 5V = energía para sensores."
            ]},
            { titulo: "💡 Mi Primer Sketch Arduino", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Parpadear LED + Monitor Serial\nvoid setup() {\n  pinMode(13, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(\"Robot listo!\");\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  Serial.println(\"LED: ON\");\n  delay(1000);\n  \n  digitalWrite(13, LOW);\n  Serial.println(\"LED: OFF\");\n  delay(1000);\n}", explicacion: "setup() configura el LED y el Serial. loop() enciende y apaga el LED cada segundo mientras muestra mensajes en el Monitor Serial." },
            { titulo: "3. Estructura de un Sketch", tipo: 'texto', puntos: [
                "**setup():** Se ejecuta UNA sola vez al inicio. Configuras pines y comunicación serial.",
                "**loop():** Se repite infinitamente después del setup. Aquí va la lógica de tu robot.",
                "**pinMode(pin, modo):** Configura un pin como **INPUT** (sensor) o **OUTPUT** (actuador).",
                "**Ejemplo:** `void setup() { pinMode(13, OUTPUT); Serial.begin(9600); }`"
            ]},
            { titulo: "4. Entrada y Salida", tipo: 'texto', puntos: [
                "**digitalWrite(pin, valor):** Envía HIGH o LOW. `digitalWrite(13, HIGH)` → enciende LED.",
                "**digitalRead(pin):** Lee HIGH o LOW. Útil para botones y sensores digitales.",
                "**analogRead(pin):** Lee valor 0-1023. `int luz = analogRead(A0);`",
                "**delay(ms):** Pausa el programa. `delay(1000)` → espera 1 segundo."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué hace analogRead(A0) en Arduino?", opciones: ["Lee un valor entre 0 y 1023 del pin A0", "Escribe un valor analógico en el pin A0", "Enciende el pin A0"], respuestaCorrecta: 0, explicacion: "analogRead lee un valor analógico (0-1023) del pin. Un valor de 512 sería aproximadamente 2.5V." },
            { titulo: "5. Monitor Serial", tipo: 'texto', puntos: [
                "**Serial.begin(9600):** Inicia comunicación con tu PC a 9600 baudios.",
                "**Serial.println(dato):** Imprime un dato en el Monitor Serial. ¡Perfecto para depurar!",
                "**Abrir:** Ctrl+Shift+M en el IDE o el ícono de lupa.",
                "**Ejemplo:** `Serial.println(analogRead(A0));` → Muestra el valor del sensor en tiempo real."
            ]},
            { titulo: "💡 Tip de Programador", tipo: 'tip', texto: "**Serial.println() es tu mejor amigo para encontrar errores.** Cuando tu robot no hace lo que esperas, agrega Serial.println() para ver qué valores tienen tus variables. 🔍" },
            { titulo: "🎯 Actividad: Semáforo Arduino", tipo: 'activity', instruccion: "**Proyecto Mini:** Conecta 3 LEDs (rojo, amarillo, verde) a los pines 10, 11 y 12. Programa un ciclo de semáforo: Verde 5s → Amarillo 2s → Rojo 5s.", materiales: ["Arduino UNO", "3 LEDs (rojo, amarillo, verde)", "3 Resistencias 220Ω", "Protoboard", "Cables"] }
        ] 
    },
    { 
        id: 'mod_cpp', 
        titulo: "Módulo 6: Lógica Esencial", 
        icon: '🧠', 
        descripcion: "Lógica booleana, tablas de verdad, operadores AND/OR/NOT y diagramas de flujo.", 
        contenidoTeorico: [
            { titulo: "1. ¿Qué es la Lógica?", tipo: 'texto', puntos: [
                "**Lógica:** Ciencia del razonamiento correcto. En programación, tomar decisiones correctas.",
                "**Pensamiento Computacional:** Descomponer problemas grandes en pasos pequeños y lógicos.",
                "**Boolean:** Tipo de dato con dos valores: **true** (verdadero) o **false** (falso).",
                "**En Robots:** Usan lógica para decidir: ¿hay obstáculo? → girar. ¿Línea negra? → seguir."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "**George Boole**, un matemático inglés del siglo XIX, inventó el álgebra booleana. ¡Sin su trabajo, no existirían las computadoras ni los smartphones! 🎩✨" },
            { titulo: "2. Operadores Lógicos", tipo: 'texto', puntos: [
                "**AND (&&):** Verdadero SOLO si AMBAS condiciones son verdaderas.",
                "**OR (||):** Verdadero si AL MENOS UNA es verdadera.",
                "**NOT (!):** Invierte el valor. Si es verdadero → falso y viceversa.",
                "**Combinaciones:** `if ((sensorIzq || sensorDer) && !botonStop)` = avanza si hay línea y no presionaron stop."
            ]},
            { titulo: "💡 Lógica en Robot Seguidor de Línea", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot sigue-líneas con lógica booleana\nbool sensorIzq = digitalRead(2);\nbool sensorDer = digitalRead(3);\nbool botonStop = digitalRead(4);\n\nif (botonStop) {\n  detener();\n} else if (sensorIzq && sensorDer) {\n  avanzar();  // AND: ambos ven línea = recto\n} else if (sensorIzq || sensorDer) {\n  // OR: al menos uno ve línea = curva\n  if (sensorIzq) girarDerecha();\n  else girarIzquierda();\n} else {\n  buscarLinea();\n}", explicacion: "Este robot usa AND (&&), OR (||) y condiciones para seguir una línea negra. ¡La lógica booleana es el cerebro del robot!" },
            { titulo: "3. Tablas de Verdad", tipo: 'texto', puntos: [
                "**Tabla AND:** F∧F=F, F∧V=F, V∧F=F, V∧V=V → solo verdadero si AMBOS lo son.",
                "**Tabla OR:** F∨F=F, F∨V=V, V∨F=V, V∨V=V → falso SOLO si ambos son falsos.",
                "**Tabla NOT:** V→F, F→V → simplemente lo invierte.",
                "**Uso en robots:** SigueLíneas usa AND para intersecciones y OR para detectar curvas."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Si sensorIzq = true y sensorDer = false, ¿qué resultado da (sensorIzq AND sensorDer)?", opciones: ["false", "true", "Error"], respuestaCorrecta: 0, explicacion: "AND requiere que AMBOS sean verdaderos. Como sensorDer es false, el resultado es false." },
            { titulo: "4. Diagramas de Flujo", tipo: 'texto', puntos: [
                "**Diagrama de Flujo:** Dibujo que muestra los pasos de un algoritmo con flechas y formas.",
                "**Óvalo:** Indica Inicio o Fin del programa.",
                "**Rectángulo:** Una acción o instrucción (avanzar, encender motor).",
                "**Diamante:** Una decisión con dos salidas: Sí / No."
            ]},
            { titulo: "🎯 Actividad: Diagrama del Robot", tipo: 'activity', instruccion: "**Reto:** Dibuja un diagrama de flujo para un robot que: 1) Avanza, 2) Lee sensor, 3) Si distancia < 20cm gira, 4) Si distancia >= 20cm sigue recto, 5) Vuelve al paso 1.", materiales: ["Papel", "Lápices de colores", "Regla"] }
        ] 
    },
    { 
        id: 'mod_python', 
        titulo: "Práctica 1: Enciende tu Primer LED", 
        icon: '💡', 
        descripcion: "Arma tu primer circuito con LED, resistencia y pila en una protoboard paso a paso.", 
        contenidoTeorico: [
            { titulo: "1. Materiales Necesarios", tipo: 'texto', puntos: [
                "**LED (cualquier color):** LED estándar de 5mm. Pata larga = positivo (+), pata corta = negativo (-).",
                "**Resistencia de 220Ω:** Protege al LED de quemarse. ¡Sin ella, adiós LED!",
                "**Pila de 9V o porta pilas 2xAA:** Tu fuente de energía.",
                "**Protoboard:** El tablero donde armarás todo sin soldar.",
                "**Cables Dupont o jumpers:** Para conectar los componentes entre sí."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "El LED fue inventado en 1962 y solo era de color rojo. ¡El LED azul tardó 30 años más en inventarse y le dio el Premio Nobel a tres científicos en 2014! 🔴🟢🔵" },
            { titulo: "2. Armado Paso a Paso", tipo: 'texto', puntos: [
                "**Paso 1:** Coloca el LED en la protoboard. Pata larga en una fila, pata corta en la de al lado.",
                "**Paso 2:** Conecta la resistencia entre el cable + de la pila y la pata larga (+) del LED.",
                "**Paso 3:** Conecta un cable desde la pata corta (-) del LED al cable negativo (-) de la pila.",
                "**Paso 4:** ¡Verifica y enciende! Si no funciona, gira el LED (puede estar al revés)."
            ]},
            { titulo: "3. ¿Por qué Funciona?", tipo: 'texto', puntos: [
                "**Circuito Cerrado:** La corriente fluye del + de la pila, por la resistencia, el LED, y regresa al -.",
                "**Resistencia:** Limita la corriente a ~20mA para que el LED no se queme.",
                "**LED:** Convierte energía eléctrica en luz. Solo funciona en una dirección (polarizado).",
                "**Si no enciende:** Revisa orientación del LED y que las conexiones estén firmes."
            ]},
            { titulo: "Fórmula: Calcular Resistencia", tipo: 'formula', texto: "Para saber qué resistencia necesitas:", formula: "R = (V<sub>fuente</sub> - V<sub>LED</sub>) ÷ I<sub>LED</sub>", explicacion: "Con pila de 9V, LED rojo (2V), corriente 20mA: R = (9-2) ÷ 0.02 = 350Ω. Usamos 330Ω o 470Ω." },
            { titulo: "💡 Tip de Seguridad", tipo: 'tip', texto: "**NUNCA conectes un LED directamente a una pila sin resistencia.** El LED se quemará en segundos. Piensa en la resistencia como un cinturón de seguridad. 🔒" }
        ] 
    },
    { 
        id: 'mod_robotica', 
        titulo: "Práctica 2: LED con Arduino", 
        icon: '🔷', 
        descripcion: "Programa tu Arduino para encender, apagar y hacer parpadear un LED con código.", 
        contenidoTeorico: [
            { titulo: "1. Circuito: Arduino + LED", tipo: 'texto', puntos: [
                "**Conexión:** Pin 13 → Resistencia 220Ω → Pata larga LED (+) → Pata corta (-) → GND de Arduino.",
                "**¿Por qué pin 13?** Tiene LED interno. Si conectas mal el externo, el interno aún funciona.",
                "**Alimentación:** Arduino se alimenta por USB. No necesitas pila externa.",
                "**Protoboard:** Usa la protoboard para organizar las conexiones."
            ]},
            { titulo: "💡 Programa Blink Completo", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Blink: El Hola Mundo de Arduino\nvoid setup() {\n  pinMode(13, OUTPUT);\n  Serial.begin(9600);\n  Serial.println(\"¡Blink iniciado!\");\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  Serial.println(\"LED ON\");\n  delay(1000);\n  \n  digitalWrite(13, LOW);\n  Serial.println(\"LED OFF\");\n  delay(1000);\n}", explicacion: "Este programa enciende y apaga el LED cada segundo. pinMode configura el pin, digitalWrite envía energía, y delay pausa el programa." },
            { titulo: "2. Variaciones Divertidas", tipo: 'texto', puntos: [
                "**SOS en Morse:** 3 parpadeos cortos, 3 largos, 3 cortos. ¡Mensaje de emergencia con luz!",
                "**LED Fade (PWM):** Usa `analogWrite(9, brillo);` valores 0-255 para efecto de respiración.",
                "**Semáforo:** 3 LEDs (rojo, amarillo, verde) programados como semáforo real.",
                "**Botón + LED:** Agrega botón para encender/apagar con `digitalRead()`."
            ]},
            { titulo: "💡 LED Fade (Efecto Respiración)", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// LED que respira suavemente\nint brillo = 0;\nint paso = 5;\n\nvoid setup() {\n  pinMode(9, OUTPUT);\n}\n\nvoid loop() {\n  analogWrite(9, brillo);\n  brillo = brillo + paso;\n  \n  if (brillo <= 0 || brillo >= 255) {\n    paso = -paso;  // Invertir\n  }\n  delay(30);\n}", explicacion: "analogWrite envía un valor de 0 (apagado) a 255 (máximo brillo). Al incrementar y decrementar, el LED sube y baja suavemente." },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué función de Arduino usas para controlar el BRILLO del LED (no solo encender/apagar)?", opciones: ["analogWrite()", "digitalWrite()", "analogRead()"], respuestaCorrecta: 0, explicacion: "analogWrite() envía un valor PWM (0-255). digitalWrite solo puede hacer HIGH o LOW (encendido/apagado total)." },
            { titulo: "3. Solución de Problemas", tipo: 'texto', puntos: [
                "**LED no enciende:** Verifica orientación (pata larga al pin, corta a GND).",
                "**Error al compilar:** Revisa punto y coma (;), llaves {} y paréntesis ().",
                "**Arduino no responde:** Verifica placa y puerto en menú Herramientas.",
                "**Usa Serial.println():** Imprime mensajes para saber qué hace tu código."
            ]}
        ] 
    },
    { 
        id: 'mod_componentes', 
        titulo: "Práctica 3: Motor con Arduino", 
        icon: '🔩', 
        descripcion: "Controla motores DC con Arduino y el driver L298N: dirección, velocidad y giros.", 
        contenidoTeorico: [
            { titulo: "1. Tipos de Motores", tipo: 'texto', puntos: [
                "**Motor DC:** Gira al aplicar voltaje. Cambia dirección invirtiendo polaridad.",
                "**Servo Motor:** Gira a ángulo preciso (0° a 180°). Ideal para brazos y pinzas.",
                "**Motor Paso a Paso (Stepper):** Gira en pasos exactos. Para impresoras 3D y CNC.",
                "**¡Importante!** NUNCA conectes un motor directo a Arduino. Necesitas un **driver**."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Los motores del **Mars Rover Perseverance** de la NASA son controlados por código similar al de Arduino. ¡Las mismas funciones que estás aprendiendo, pero a millones de km! 🚀" },
            { titulo: "2. Driver L298N", tipo: 'texto', puntos: [
                "**¿Qué es?** Módulo que amplifica la señal de Arduino para mover motores potentes.",
                "**2 Motores:** Controla 2 motores DC independientemente. ¡Para un carro robot!",
                "**Pines IN1-IN4:** Dirección. IN1+IN2 para Motor A, IN3+IN4 para Motor B.",
                "**Pines ENA/ENB:** Velocidad con PWM (0-255). `analogWrite(ENA, 200);`"
            ]},
            { titulo: "💡 Control de Motor Completo", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Control de carro robot con L298N\n#define IN1 8\n#define IN2 9\n#define ENA 10\n\nvoid adelante(int vel) {\n  digitalWrite(IN1, HIGH);\n  digitalWrite(IN2, LOW);\n  analogWrite(ENA, vel);\n}\n\nvoid atras(int vel) {\n  digitalWrite(IN1, LOW);\n  digitalWrite(IN2, HIGH);\n  analogWrite(ENA, vel);\n}\n\nvoid detener() {\n  digitalWrite(IN1, LOW);\n  digitalWrite(IN2, LOW);\n}\n\nvoid loop() {\n  adelante(200);  delay(2000);\n  detener();      delay(500);\n  atras(150);     delay(1000);\n  detener();      delay(500);\n}", explicacion: "Usamos funciones para organizar las acciones. IN1/IN2 controlan dirección y ENA controla velocidad con PWM." },
            { titulo: "3. Control de Dirección", tipo: 'texto', puntos: [
                "**Adelante:** IN1=HIGH, IN2=LOW → Motor gira en un sentido.",
                "**Atrás:** IN1=LOW, IN2=HIGH → Motor gira en sentido contrario.",
                "**Frenar:** IN1=LOW, IN2=LOW → Motor se detiene.",
                "**Girar:** Un motor adelante y otro atrás = ¡el robot gira sobre su eje!"
            ]},
            { titulo: "🎯 Actividad: Coreografía Robot", tipo: 'activity', instruccion: "**Reto Divertido:** Programa una 'coreografía' para tu robot: adelante, gira derecha, adelante, gira izquierda, retrocede, gira en círculo. ¡Ponle música!", materiales: ["Robot con Arduino + L298N", "2 motores con ruedas", "Pila 9V"] }
        ] 
    },
    { 
        id: 'mod_control', 
        titulo: "Módulo 10: Lógica y Control", 
        icon: '🧠', 
        descripcion: "Sistemas de control, lazo abierto vs cerrado, retroalimentación y una intro al PID.", 
        contenidoTeorico: [
            { titulo: "1. Sistemas de Control", tipo: 'texto', puntos: [
                "**Sistema de Control:** Mecanismo que regula el comportamiento de otro sistema.",
                "**Ejemplo Real:** Termostato de tu casa: mide temperatura y enciende/apaga la calefacción.",
                "**En Robots:** Permite seguir una línea, mantener equilibrio o llegar a un destino.",
                "**Planta:** Lo que quieres controlar (motor, posición, temperatura)."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Los **drones** usan control PID para mantenerse estables en el aire. ¡Hacen cientos de ajustes por segundo para no caerse! 🚁" },
            { titulo: "2. Lazo Abierto vs. Cerrado", tipo: 'texto', puntos: [
                "**Lazo Abierto:** Envías comando SIN medir resultado. Ejemplo: tostador con timer fijo.",
                "**Lazo Cerrado:** Mides resultado y ajustas. Ejemplo: cruise control de un carro.",
                "**Feedback:** Información del resultado que se usa para corregir el siguiente paso.",
                "**¿Cuál es mejor?** Lazo cerrado es casi siempre superior para robots."
            ]},
            { titulo: "💡 Control Proporcional: Siguelíneas", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot siguelíneas con control proporcional\nint setpoint = 512;\n\nvoid loop() {\n  int lectura = analogRead(A0);\n  int error = setpoint - lectura;\n  \n  float Kp = 0.5;\n  int correccion = Kp * error;\n  \n  int velIzq = 150 + correccion;\n  int velDer = 150 - correccion;\n  \n  velIzq = constrain(velIzq, 0, 255);\n  velDer = constrain(velDer, 0, 255);\n  \n  moverMotores(velIzq, velDer);\n  delay(10);\n}", explicacion: "El sensor lee la posición, calcula el error, y aplica corrección proporcional a los motores. ¡El robot se autocorrige!" },
            { titulo: "3. Control PID", tipo: 'texto', puntos: [
                "**P (Proporcional):** Corrección proporcional al error. Error grande = corrección grande.",
                "**I (Integral):** Acumula errores pasados. Corrige errores pequeños persistentes.",
                "**D (Derivativo):** Predice el error futuro. Evita oscilaciones.",
                "**Aplicación:** Robot siguelíneas usa PID para seguir suavemente sin zigzaguear."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Un tostador con temporizador fijo (sin medir si el pan está tostado) es un ejemplo de:", opciones: ["Control de Lazo Abierto", "Control de Lazo Cerrado", "Control PID"], respuestaCorrecta: 0, explicacion: "Es lazo abierto porque no mide el resultado. Un lazo cerrado mediría el color del pan y ajustaría." },
            { titulo: "Fórmula PID", tipo: 'formula', texto: "La ecuación del controlador PID:", formula: "Salida = Kp·e(t) + Ki·∫e(t)dt + Kd·de(t)/dt", explicacion: "e(t) = error (deseado - real). Kp, Ki, Kd son constantes que ajustas." }
        ] 
    },
    { 
        id: 'mod_prog_avanzada', 
        titulo: "Módulo 11: Programación Avanzada", 
        icon: '💡', 
        descripcion: "Arrays, librerías, comunicación inalámbrica, Bluetooth y buenas prácticas de código.", 
        contenidoTeorico: [
            { titulo: "1. Arrays: Listas de Datos", tipo: 'texto', puntos: [
                "**Array:** Lista ordenada de datos. `int sensores[4] = {100, 200, 150, 300};`",
                "**Índice:** Posición desde 0. `sensores[0]` es 100, `sensores[3]` es 300.",
                "**Recorrer:** `for(int i=0; i<4; i++) { Serial.println(sensores[i]); }`",
                "**Uso:** Guardar lecturas de sensores, secuencias de movimiento, notas musicales."
            ]},
            { titulo: "💡 Arrays: Secuencia de Baile", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot bailarín con secuencia en array\nchar movimientos[] = {'A','D','I','A','G','A'};\nint tiempos[] = {1000, 500, 500, 1000, 2000, 1000};\nint numPasos = 6;\n\nvoid loop() {\n  for (int i = 0; i < numPasos; i++) {\n    switch(movimientos[i]) {\n      case 'A': adelante(200); break;\n      case 'D': girarDer(150); break;\n      case 'I': girarIzq(150); break;\n      case 'G': girar360(100); break;\n    }\n    delay(tiempos[i]);\n    detener();\n    delay(200);\n  }\n}", explicacion: "Los arrays guardan la secuencia y tiempos. El ciclo for ejecuta cada paso. ¡Cambia los arrays para nuevas coreografías!" },
            { titulo: "2. Librerías: Superpoderes", tipo: 'texto', puntos: [
                "**Librería:** Código listo para usar. `#include <Libreria.h>`",
                "**Servo.h:** `miServo.write(90);` → mueve servo a 90 grados.",
                "**NewPing.h:** `sonar.ping_cm();` → distancia en centímetros.",
                "**Wire.h:** Comunicación I2C para pantallas LCD y sensores avanzados."
            ]},
            { titulo: "3. Comunicación Inalámbrica", tipo: 'texto', puntos: [
                "**Bluetooth (HC-05):** Módulo para controlar Arduino desde el celular.",
                "**WiFi (ESP32):** Conecta tu robot a internet. Control desde cualquier lugar.",
                "**Protocolo:** Reglas para datos. 'A' = adelante, 'S' = parar.",
                "**Serial.read():** Lee datos de la PC o del Bluetooth."
            ]},
            { titulo: "💡 Control Bluetooth", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Control robot por Bluetooth\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  if (Serial.available()) {\n    char comando = Serial.read();\n    \n    switch(comando) {\n      case 'F': adelante(200);  break;\n      case 'B': atras(200);    break;\n      case 'L': girarIzq(150); break;\n      case 'R': girarDer(150); break;\n      case 'S': detener();     break;\n    }\n  }\n}", explicacion: "El módulo Bluetooth recibe letras y el switch ejecuta la acción. ¡Usa apps como 'Arduino Bluetooth Controller'!" },
            { titulo: "4. Buenas Prácticas", tipo: 'texto', puntos: [
                "**Comentarios:** Usa `//` para explicar código. Tu yo del futuro te lo agradecerá.",
                "**Nombres Claros:** `velocidadMotor` es mejor que `vm` o `x`.",
                "**Modularidad:** Divide en funciones pequeñas. Más fácil encontrar errores.",
                "**Prueba por partes:** Verifica cada componente antes de juntar todo."
            ]},
            { titulo: "💡 Tip de Programador", tipo: 'tip', texto: "**El 90% de programar es leer código, solo el 10% es escribirlo.** Un buen programador escribe código que otros puedan entender fácilmente. ¡Los comentarios valen oro! 📖✨" }
        ] 
    },
    { 
        id: 'mod_diseno', 
        titulo: "Módulo 12: Mecanismos y Diseño", 
        icon: '🔩', 
        descripcion: "CAD, impresión 3D, principios de diseño mecánico y materiales para construir robots.", 
        contenidoTeorico: [
            { titulo: "1. Diseño CAD", tipo: 'texto', puntos: [
                "**CAD:** Software para diseñar piezas en 2D/3D antes de fabricar. ¡Evita errores!",
                "**Tinkercad:** Herramienta online gratuita y fácil para principiantes.",
                "**Fusion 360:** Software profesional gratuito para estudiantes.",
                "**Proceso:** Diseñar → Simular → Corregir → Fabricar."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "La **Estación Espacial Internacional** tiene una impresora 3D. ¡Los astronautas pueden imprimir herramientas en el espacio! 🛸" },
            { titulo: "2. Impresión 3D", tipo: 'texto', puntos: [
                "**FDM:** Deposita plástico derretido capa por capa hasta formar la pieza.",
                "**PLA:** Plástico biodegradable, fácil de imprimir. El más usado en robótica educativa.",
                "**Archivo STL:** Formato para piezas 3D. Exportas del CAD a .STL para imprimir.",
                "**Uso:** Chasis, soportes de sensores, engranajes y ruedas personalizadas."
            ]},
            { titulo: "3. Principios de Diseño", tipo: 'texto', puntos: [
                "**Simetría:** Robot simétrico = más estable y movimientos rectos.",
                "**Centro de Gravedad Bajo:** Peso cerca del suelo = no se voltea.",
                "**Modularidad:** Piezas intercambiables. Si algo se rompe, solo reemplaza esa parte.",
                "**Accesibilidad:** Poder acceder a baterías y cables sin desmontar todo."
            ]},
            { titulo: "4. Materiales", tipo: 'texto', puntos: [
                "**MDF/Madera:** Barato, fácil de cortar con láser. Excelente para prototipos.",
                "**Acrílico:** Transparente y resistente. Se corta con láser.",
                "**Aluminio:** Ligero y fuerte. Para robots de competencia.",
                "**Cartón:** ¡Perfecto para tu primer prototipo rápido!"
            ]},
            { titulo: "🎯 Actividad: Tu Primer Diseño", tipo: 'activity', instruccion: "**Reto:** Entra a Tinkercad.com (gratis) y diseña un soporte para tu Arduino. Debe tener agujeros para los tornillos y espacio para cables.", materiales: ["Computadora con internet", "Cuenta gratuita en Tinkercad.com"] }
        ] 
    },
    { 
        id: 'mod_primer_led', 
        titulo: "Módulo 13: ¡Enciende tu Primer LED!", 
        icon: '🔴', 
        descripcion: "Guía de proyecto físico paso a paso: conecta LED, resistencia, pila y botón.", 
        specialView: 'InteractiveLEDGuide',
        contenidoTeorico: [], 
    },
];


// ==========================================================
// --- RETOS DE CÓDIGO (EXPANDIDOS) ---
// ==========================================================

export const CODE_CHALLENGES_DATA = [
    {
        id: 'cpp_hello_world',
        name: 'C++',
        icon: '⚙️',
        title: 'Reto 1: Hola Mundo en C++',
        instructions: 'Ordena los bloques para construir un programa C++ que imprima "Hola Mundo!".',
        solution: [{ id: 1, text: '#include <iostream>', type: 'setup' }, { id: 2, text: 'int main() {', type: 'setup' }, { id: 3, text: '    std::cout << "Hola Mundo!" << std::endl;', type: 'output' }, { id: 4, text: '    return 0;', type: 'setup' }, { id: 5, text: '}', type: 'setup' }],
        extra_blocks: [{ id: 6, text: 'print("Hola Mundo!")', type: 'wrong' }, { id: 7, text: 'void setup() {', type: 'wrong' }, { id: 8, text: 'if (true) {', type: 'wrong' }]
    },
    {
        id: 'python_hello_world',
        name: 'Python',
        icon: '🐍',
        title: 'Reto 2: Hola Mundo en Python',
        instructions: 'Selecciona solo el bloque de código Python correcto para imprimir "Hola Mundo!".',
        solution: [{ id: 1, text: 'print("Hola Mundo!")', type: 'output' }],
        extra_blocks: [{ id: 2, text: 'std::cout << "Hola Mundo!"', type: 'wrong' }, { id: 3, text: 'console.log("Hola Mundo!")', type: 'wrong' }, { id: 4, text: 'imprimir("Hola Mundo!")', type: 'wrong' }]
    },
    {
        id: 'arduino_blink',
        name: 'Arduino',
        icon: '🔷',
        title: 'Reto 3: Blink LED con Arduino',
        instructions: 'Ordena los bloques para crear un programa Arduino que haga parpadear un LED en el pin 13.',
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup' }, 
            { id: 2, text: '    pinMode(13, OUTPUT);', type: 'setup' }, 
            { id: 3, text: '}', type: 'setup' }, 
            { id: 4, text: 'void loop() {', type: 'setup' }, 
            { id: 5, text: '    digitalWrite(13, HIGH);', type: 'output' }, 
            { id: 6, text: '    delay(1000);', type: 'setup' }, 
            { id: 7, text: '    digitalWrite(13, LOW);', type: 'output' }, 
            { id: 8, text: '    delay(1000);', type: 'setup' }, 
            { id: 9, text: '}', type: 'setup' }
        ],
        extra_blocks: [
            { id: 10, text: 'analogWrite(13, 255);', type: 'wrong' }, 
            { id: 11, text: 'Serial.begin(9600);', type: 'wrong' }, 
            { id: 12, text: 'int main() {', type: 'wrong' }
        ]
    },
    {
        id: 'python_for_loop',
        name: 'Python',
        icon: '🐍',
        title: 'Reto 4: Ciclo For en Python',
        instructions: 'Ordena los bloques para crear un programa Python que imprima los números del 1 al 5.',
        solution: [
            { id: 1, text: 'for i in range(1, 6):', type: 'setup' }, 
            { id: 2, text: '    print(i)', type: 'output' }
        ],
        extra_blocks: [
            { id: 3, text: 'for i in range(5):', type: 'wrong' }, 
            { id: 4, text: 'while i < 5:', type: 'wrong' }, 
            { id: 5, text: '    cout << i;', type: 'wrong' },
            { id: 6, text: 'print(range(5))', type: 'wrong' }
        ]
    },
    {
        id: 'arduino_sensor',
        name: 'Arduino',
        icon: '🔷',
        title: 'Reto 5: Leer Sensor Ultrasónico',
        instructions: 'Ordena los bloques para leer un sensor ultrasónico en Arduino y mostrar la distancia por Serial.',
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup' }, 
            { id: 2, text: '    Serial.begin(9600);', type: 'setup' }, 
            { id: 3, text: '    pinMode(trigPin, OUTPUT);', type: 'setup' },
            { id: 4, text: '    pinMode(echoPin, INPUT);', type: 'setup' },
            { id: 5, text: '}', type: 'setup' }, 
            { id: 6, text: 'void loop() {', type: 'setup' }, 
            { id: 7, text: '    digitalWrite(trigPin, HIGH);', type: 'output' },
            { id: 8, text: '    distancia = pulseIn(echoPin, HIGH) / 58;', type: 'output' },
            { id: 9, text: '    Serial.println(distancia);', type: 'output' },
            { id: 10, text: '}', type: 'setup' }
        ],
        extra_blocks: [
            { id: 11, text: 'analogRead(trigPin);', type: 'wrong' }, 
            { id: 12, text: 'delay(5000);', type: 'wrong' },
            { id: 13, text: 'digitalRead(trigPin);', type: 'wrong' }
        ]
    },
    {
        id: 'cpp_variables',
        name: 'C++',
        icon: '⚙️',
        title: 'Reto 6: Variables y Suma en C++',
        instructions: 'Ordena los bloques para declarar dos variables, sumarlas e imprimir el resultado.',
        solution: [
            { id: 1, text: '#include <iostream>', type: 'setup' },
            { id: 2, text: 'int main() {', type: 'setup' },
            { id: 3, text: '    int a = 10;', type: 'setup' },
            { id: 4, text: '    int b = 20;', type: 'setup' },
            { id: 5, text: '    int suma = a + b;', type: 'output' },
            { id: 6, text: '    std::cout << suma << std::endl;', type: 'output' },
            { id: 7, text: '    return 0;', type: 'setup' },
            { id: 8, text: '}', type: 'setup' }
        ],
        extra_blocks: [
            { id: 9, text: 'var suma = a + b;', type: 'wrong' },
            { id: 10, text: 'print(suma)', type: 'wrong' },
            { id: 11, text: 'string a = "10";', type: 'wrong' }
        ]
    },
    {
        id: 'python_function',
        name: 'Python',
        icon: '🐍',
        title: 'Reto 7: Función Saludar',
        instructions: 'Ordena los bloques para crear una función Python que salude al robot por su nombre.',
        solution: [
            { id: 1, text: 'def saludar(nombre):', type: 'setup' },
            { id: 2, text: '    print(f"¡Hola, {nombre}!")', type: 'output' },
            { id: 3, text: 'saludar("R2-CultivaTec")', type: 'output' }
        ],
        extra_blocks: [
            { id: 4, text: 'function saludar(nombre) {', type: 'wrong' },
            { id: 5, text: 'void saludar(string nombre)', type: 'wrong' },
            { id: 6, text: 'return nombre', type: 'wrong' },
            { id: 7, text: 'saludar nombre', type: 'wrong' }
        ]
    },
    {
        id: 'arduino_motor',
        name: 'Arduino',
        icon: '🔷',
        title: 'Reto 8: Control de Motor',
        instructions: 'Ordena los bloques para hacer que un motor avance 2 segundos y se detenga.',
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup' },
            { id: 2, text: '    pinMode(IN1, OUTPUT);', type: 'setup' },
            { id: 3, text: '    pinMode(IN2, OUTPUT);', type: 'setup' },
            { id: 4, text: '}', type: 'setup' },
            { id: 5, text: 'void loop() {', type: 'setup' },
            { id: 6, text: '    digitalWrite(IN1, HIGH);', type: 'output' },
            { id: 7, text: '    digitalWrite(IN2, LOW);', type: 'output' },
            { id: 8, text: '    delay(2000);', type: 'setup' },
            { id: 9, text: '    digitalWrite(IN1, LOW);', type: 'output' },
            { id: 10, text: '    digitalWrite(IN2, LOW);', type: 'output' },
            { id: 11, text: '}', type: 'setup' }
        ],
        extra_blocks: [
            { id: 12, text: 'analogWrite(IN1, 255);', type: 'wrong' },
            { id: 13, text: 'motor.forward();', type: 'wrong' },
            { id: 14, text: 'servo.write(90);', type: 'wrong' }
        ]
    },
    {
        id: 'python_list',
        name: 'Python',
        icon: '🐍',
        title: 'Reto 9: Detectar Obstáculos',
        instructions: 'Ordena los bloques para crear una lista de sensores y mostrar los que detectan obstáculos (< 20cm).',
        solution: [
            { id: 1, text: 'sensores = [10, 45, 8, 30, 15]', type: 'setup' },
            { id: 2, text: 'for distancia in sensores:', type: 'setup' },
            { id: 3, text: '    if distancia < 20:', type: 'output' },
            { id: 4, text: '        print(f"Obstaculo: {distancia}cm")', type: 'output' }
        ],
        extra_blocks: [
            { id: 5, text: 'for i in range(sensores):', type: 'wrong' },
            { id: 6, text: '    if distancia > 20:', type: 'wrong' },
            { id: 7, text: 'sensores = (10, 45, 8)', type: 'wrong' },
            { id: 8, text: '    print(sensores)', type: 'wrong' }
        ]
    },
    {
        id: 'arduino_servo',
        name: 'Arduino',
        icon: '🔷',
        title: 'Reto 10: Servo Motor 180°',
        instructions: 'Ordena los bloques para mover un servo de 0° a 180° como barrido.',
        solution: [
            { id: 1, text: '#include <Servo.h>', type: 'setup' },
            { id: 2, text: 'Servo miServo;', type: 'setup' },
            { id: 3, text: 'void setup() {', type: 'setup' },
            { id: 4, text: '    miServo.attach(9);', type: 'setup' },
            { id: 5, text: '}', type: 'setup' },
            { id: 6, text: 'void loop() {', type: 'setup' },
            { id: 7, text: '    for(int i=0; i<=180; i++) {', type: 'output' },
            { id: 8, text: '        miServo.write(i);', type: 'output' },
            { id: 9, text: '        delay(15);', type: 'setup' },
            { id: 10, text: '    }', type: 'setup' },
            { id: 11, text: '}', type: 'setup' }
        ],
        extra_blocks: [
            { id: 12, text: '#include <Motor.h>', type: 'wrong' },
            { id: 13, text: 'miServo.read(180);', type: 'wrong' },
            { id: 14, text: 'analogWrite(9, 180);', type: 'wrong' }
        ]
    },
    {
        id: 'python_dict',
        name: 'Python',
        icon: '🐍',
        title: 'Reto 11: Diccionario Robot',
        instructions: 'Ordena los bloques para crear un diccionario con datos de un robot y mostrar su nombre.',
        solution: [
            { id: 1, text: 'robot = {', type: 'setup' },
            { id: 2, text: '    "nombre": "Explorer",', type: 'setup' },
            { id: 3, text: '    "bateria": 85,', type: 'setup' },
            { id: 4, text: '}', type: 'setup' },
            { id: 5, text: 'print(robot["nombre"])', type: 'output' },
            { id: 6, text: 'print(robot["bateria"])', type: 'output' }
        ],
        extra_blocks: [
            { id: 7, text: 'robot = ["Explorer", 85]', type: 'wrong' },
            { id: 8, text: 'print(robot.nombre)', type: 'wrong' },
            { id: 9, text: 'robot{"nombre"} = "Explorer"', type: 'wrong' }
        ]
    },
    {
        id: 'cpp_if_else',
        name: 'C++',
        icon: '⚙️',
        title: 'Reto 12: Decisiones if/else',
        instructions: 'Ordena los bloques para verificar si un sensor detecta un obstáculo (< 20cm).',
        solution: [
            { id: 1, text: '#include <iostream>', type: 'setup' },
            { id: 2, text: 'int main() {', type: 'setup' },
            { id: 3, text: '    int distancia = 15;', type: 'setup' },
            { id: 4, text: '    if (distancia < 20) {', type: 'output' },
            { id: 5, text: '        std::cout << "Obstaculo!" << std::endl;', type: 'output' },
            { id: 6, text: '    } else {', type: 'setup' },
            { id: 7, text: '        std::cout << "Camino libre" << std::endl;', type: 'output' },
            { id: 8, text: '    }', type: 'setup' },
            { id: 9, text: '    return 0;', type: 'setup' },
            { id: 10, text: '}', type: 'setup' }
        ],
        extra_blocks: [
            { id: 11, text: 'if distancia < 20:', type: 'wrong' },
            { id: 12, text: 'elif (distancia > 20)', type: 'wrong' },
            { id: 13, text: 'print("Obstaculo")', type: 'wrong' }
        ]
    }
];
