// ==========================================================
// --- MUNDO 2: LA FÁBRICA DE AUTÓMATAS ---
// 16 módulos de robótica aplicada: sensores avanzados,
// construcción física, automatización y proyecto final.
// ==========================================================

export const WORLD_2_MODULES = [
    // ===== SECCIÓN 1: SENSORES Y PERCEPCIÓN (4 módulos) =====
    {
        id: 'w2_mod1_ultrasonico',
        titulo: "Módulo 1: El Radar del Robot 🦇",
        icon: '🦇',
        descripcion: "Domina el sensor ultrasónico HC-SR04 y dale ojos a tu robot para detectar obstáculos.",
        contenidoTeorico: [
            { titulo: "🦇 ¡Tu Robot Aprende a Ver!", tipo: 'intro_hero', texto: "Bienvenido a La Fábrica de Autómatas. Aquí construirás robots de verdad. El primer paso: darle la capacidad de PERCIBIR el mundo. El sensor ultrasónico funciona como un murciélago: emite sonido y escucha el eco. ¡Vamos!" },
            { titulo: "1. ¿Cómo Funciona el Ultrasonido?", tipo: 'texto', puntos: [
                "**Emisor (Trigger):** Envía una ráfaga de sonido a 40 kHz (inaudible para humanos). 🔊",
                "**Receptor (Echo):** Escucha el sonido cuando rebota en un objeto. 👂",
                "**Cálculo:** Distancia = (Tiempo × Velocidad del sonido) ÷ 2. Se divide entre 2 porque el sonido va y vuelve.",
                "**Rango:** Detecta objetos de 2 cm a 400 cm con precisión de ±3mm. ¡Increíble!"
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Los murciélagos usan ultrasonido para cazar insectos en la oscuridad total. ¡Emiten hasta 200 pulsos de sonido por segundo! Tu sensor HC-SR04 usa el mismo principio pero a menor escala. 🦇🌙" },
            { titulo: "💡 Código: Medir Distancia", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Sensor Ultrasónico HC-SR04\n#define TRIG 9\n#define ECHO 10\n\nvoid setup() {\n  pinMode(TRIG, OUTPUT);\n  pinMode(ECHO, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  // Enviar pulso\n  digitalWrite(TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  \n  // Leer eco\n  long duracion = pulseIn(ECHO, HIGH);\n  float distancia = duracion * 0.034 / 2;\n  \n  Serial.print(\"Distancia: \");\n  Serial.print(distancia);\n  Serial.println(\" cm\");\n  delay(200);\n}", explicacion: "El pin TRIG envía el pulso y ECHO recibe el rebote. pulseIn() mide el tiempo que tarda. Multiplicamos por la velocidad del sonido y dividimos entre 2." },
            { titulo: "✅ Quiz: Ultrasonido", tipo: 'mini_quiz', pregunta: "¿Por qué dividimos el tiempo medido entre 2 al calcular la distancia?", opciones: ["Porque el sensor tiene 2 ojos", "Porque el sonido va hacia el objeto Y regresa", "Porque usamos 2 pines", "Porque el sonido viaja a la mitad de velocidad"], respuestaCorrecta: 1, explicacion: "¡Exacto! El sonido recorre el camino dos veces: ida y vuelta. Si no dividieras entre 2, ¡calcularías el doble de la distancia real! 🔊↔️" },
            { titulo: "🎮 Misión: Alarma de Proximidad", tipo: 'interactive_challenge', instruccion: "**Misión de Campo:** Conecta tu sensor HC-SR04 a Arduino y construye una alarma:\n\n1. Si distancia > 50cm → LED verde encendido ✅\n2. Si distancia entre 20-50cm → LED amarillo ⚠️\n3. Si distancia < 20cm → LED rojo + buzzer 🚨\n\n**Bonus:** Agrega un mensaje en Serial Monitor con la distancia exacta.\n\n¡Pruébalo acercando tu mano al sensor!", recompensa: "🏅 Insignia: Radar Activo" },
            { titulo: "Fórmula: Distancia Ultrasónica", tipo: 'formula', texto: "La fórmula para calcular la distancia:", formula: "Distancia = (Tiempo_μs × 0.034) ÷ 2", explicacion: "0.034 cm/μs es la velocidad del sonido. Se divide entre 2 por el viaje de ida y vuelta." },
            { titulo: "✅ Quiz: Aplicaciones", tipo: 'mini_quiz', pregunta: "¿Cuál de estos NO usa un principio similar al sensor ultrasónico?", opciones: ["Radar de estacionamiento de carro", "Ecografía médica", "Termómetro digital", "Sonar de submarinos"], respuestaCorrecta: 2, explicacion: "¡Correcto! El termómetro mide temperatura con infrarrojos, NO con sonido. Los otros tres usan ondas que rebotan para medir distancias. 🌡️❌🔊" },
            { titulo: "🧩 Conecta Sensor y Proyecto", tipo: 'matching_game', instruccion: 'Relaciona cada aplicación con su tipo de medición', pairs: [{ left: '🚗 Radar de auto', right: 'Distancia por ultrasonido' }, { left: '🏥 Ecografía', right: 'Imagen por ultrasonido' }, { left: '🚢 Sonar marino', right: 'Profundidad por eco' }, { left: '🦇 Murciélago', right: 'Navegación por eco' }] },
            { titulo: "✅❌ ¿Verdadero o Falso?", tipo: 'true_false', statements: [{ text: 'El sensor ultrasónico puede detectar objetos transparentes como vidrio.', correct: true, explain: 'El sonido rebota en superficies sólidas, incluido el vidrio. No importa si es transparente.' }, { text: 'El HC-SR04 puede medir hasta 10 metros de distancia.', correct: false, explain: 'Su rango máximo es de 400 cm (4 metros), no 10 metros.' }, { text: 'Los humanos pueden escuchar el sonido del sensor ultrasónico.', correct: false, explain: 'El sensor emite a 40 kHz. Los humanos solo escuchamos hasta ~20 kHz.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Evita superficies blandas y anguladas.** Las telas absorben el sonido y las superficies en ángulo desvían el eco. Para mejores resultados, apunta a superficies planas y duras. 🎯" },
        ]
    },
    {
        id: 'w2_mod2_infrarrojo',
        titulo: "Módulo 2: Siguiendo el Camino 🛤️",
        icon: '🛤️',
        descripcion: "Aprende a usar sensores infrarrojos para que tu robot siga líneas y detecte bordes.",
        contenidoTeorico: [
            { titulo: "🛤️ ¡Tu Robot Sigue Pistas!", tipo: 'intro_hero', texto: "Los robots siguelíneas son uno de los proyectos más emocionantes. Usan sensores infrarrojos para distinguir entre blanco y negro. ¡Vamos a entender cómo ven las líneas!" },
            { titulo: "1. Sensor Infrarrojo: El Ojo Invisible", tipo: 'texto', puntos: [
                "**IR significa Infrarrojo:** Luz invisible para nuestros ojos pero detectable por sensores. 🔴",
                "**Emisor:** Un LED infrarrojo emite luz hacia el suelo.",
                "**Receptor (Fototransistor):** Detecta cuánta luz rebota. Negro absorbe → poco rebote. Blanco refleja → mucho rebote.",
                "**Salida Digital:** HIGH cuando detecta superficie clara, LOW cuando detecta superficie oscura (línea negra)."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "¡Tu control remoto del TV usa infrarrojo! Cuando presionas un botón, envía un patrón de destellos IR invisibles que el TV interpreta como un comando. ¡Podrías usar Arduino para copiar señales de control remoto! 📺✨" },
            { titulo: "💡 Código: Robot Siguelíneas Básico", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot Siguelíneas con 2 sensores IR\n#define SENSOR_IZQ 2\n#define SENSOR_DER 3\n#define MOTOR_IZQ 5\n#define MOTOR_DER 6\n\nvoid setup() {\n  pinMode(SENSOR_IZQ, INPUT);\n  pinMode(SENSOR_DER, INPUT);\n  pinMode(MOTOR_IZQ, OUTPUT);\n  pinMode(MOTOR_DER, OUTPUT);\n}\n\nvoid loop() {\n  bool izq = digitalRead(SENSOR_IZQ);\n  bool der = digitalRead(SENSOR_DER);\n  \n  if (izq && der) {\n    // Ambos en blanco: avanzar recto\n    avanzar();\n  } else if (!izq && der) {\n    // Izq en negro: corregir a la izquierda\n    girarIzquierda();\n  } else if (izq && !der) {\n    // Der en negro: corregir a la derecha\n    girarDerecha();\n  } else {\n    // Ambos en negro: intersección o fin\n    detener();\n  }\n}", explicacion: "Dos sensores IR leen el suelo. Si ambos ven blanco → recto. Si uno ve negro → corregir dirección. Simple pero efectivo." },
            { titulo: "✅ Quiz: Siguelíneas", tipo: 'mini_quiz', pregunta: "Si el sensor IZQUIERDO detecta línea negra y el DERECHO ve blanco, ¿hacia dónde debe girar el robot?", opciones: ["A la derecha, alejándose de la línea", "A la izquierda, hacia donde está la línea", "Recto, ignorando los sensores", "Debe detenerse"], respuestaCorrecta: 1, explicacion: "¡Correcto! Si la línea está a la izquierda, el robot debe girar a la izquierda para volver a centrarla. Siempre gira HACIA donde detecta la línea. 🛤️⬅️" },
            { titulo: "🎮 Misión: Pista de Carreras", tipo: 'interactive_challenge', instruccion: "**Misión Práctica:** Crea una pista de carreras para tu robot siguelíneas:\n\n1. **Materiales:** Cartulina blanca grande + cinta aislante negra (2cm de ancho)\n2. **Dibuja:** Una pista ovalada con curvas suaves. Empieza simple.\n3. **Nivel 1:** Óvalo básico sin curvas cerradas\n4. **Nivel 2:** Agrega una curva en S\n5. **Nivel 3:** Agrega una intersección en T\n\n**Desafío:** ¿En cuántos segundos completa tu robot una vuelta? ¡Cronometra y mejora!", recompensa: "🏅 Insignia: Piloto de Pista" },
            { titulo: "2. Calibración del Sensor", tipo: 'texto', puntos: [
                "**Potenciómetro:** El módulo IR tiene un tornillo pequeño para ajustar sensibilidad.",
                "**Calibrar:** Coloca sobre blanco → LED indicador debe encender. Sobre negro → debe apagar.",
                "**Distancia al suelo:** Ideal entre 1-3 cm del piso. Muy lejos = no detecta bien.",
                "**Truco:** Usa Serial.println(digitalRead(pin)) para ver en tiempo real qué detecta."
            ]},
            { titulo: "✅ Quiz: Calibración", tipo: 'mini_quiz', pregunta: "¿Qué pasa si el sensor IR está muy lejos del suelo (más de 5 cm)?", opciones: ["Funciona igual de bien", "Detecta mejor las líneas", "Pierde precisión y falla en detectar la línea", "Se quema el sensor"], respuestaCorrecta: 2, explicacion: "¡Correcto! A más de 3-5cm la luz infrarroja se dispersa demasiado y el sensor no puede distinguir negro de blanco. ¡Mantén el sensor cerca del suelo! 📏" },
            { titulo: "✅❌ Infrarrojo: ¿V o F?", tipo: 'true_false', statements: [{ text: 'La luz infrarroja es visible al ojo humano.', correct: false, explain: 'La luz IR está fuera del espectro visible. No la vemos pero las cámaras sí.' }, { text: 'Las superficies negras absorben la luz infrarroja.', correct: true, explain: 'Por eso el sensor detecta "poco rebote" sobre negro: la luz se absorbe.' }, { text: 'Un robot siguelíneas necesita mínimo 1 sensor IR.', correct: true, explain: 'Con 1 sensor funciona de forma básica, pero con 2 o más es mucho mejor.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Usa 3 sensores para más precisión.** Con un tercer sensor en el centro, el robot sabe exactamente dónde está la línea y las correcciones son más suaves. ¡Menos zigzag, más velocidad! 🏎️" },
        ]
    },
    {
        id: 'w2_mod3_temp_hum',
        titulo: "Módulo 3: Clima Robótico 🌡️",
        icon: '🌡️',
        descripcion: "Usa sensores DHT11 para medir temperatura y humedad. ¡Tu robot entiende el clima!",
        contenidoTeorico: [
            { titulo: "🌡️ ¡Tu Robot Siente el Clima!", tipo: 'intro_hero', texto: "¿Y si tu robot pudiera decirte la temperatura y humedad? Con el sensor DHT11 puede hacerlo. Este módulo es tu puerta a la domótica: robots que controlan tu casa. 🏠" },
            { titulo: "1. Sensor DHT11", tipo: 'texto', puntos: [
                "**¿Qué mide?** Temperatura (0°C a 50°C) y Humedad relativa (20% a 80%). Dos en uno. 🌡️💧",
                "**3 Pines:** VCC (5V), GND (tierra) y DATA (señal digital). ¡Súper fácil de conectar!",
                "**Comunicación:** Protocolo serial propio. Un solo cable de datos envía ambas mediciones.",
                "**Precisión:** ±2°C en temperatura y ±5% en humedad. Suficiente para proyectos educativos."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Los invernaderos inteligentes usan sensores como el DHT11 para controlar automáticamente la temperatura y humedad. ¡Un Arduino puede abrir ventanas, activar ventiladores y regar plantas basándose en estos datos! 🌱🤖" },
            { titulo: "💡 Código: Estación Meteorológica", tipo: 'code_example', lenguaje: 'Arduino', codigo: "#include <DHT.h>\n#define DHTPIN 7\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin();\n  Serial.println(\"🌡️ Estación Meteorológica\");\n}\n\nvoid loop() {\n  float temp = dht.readTemperature();\n  float hum = dht.readHumidity();\n  \n  if (isnan(temp) || isnan(hum)) {\n    Serial.println(\"Error leyendo sensor\");\n    return;\n  }\n  \n  Serial.print(\"Temp: \");\n  Serial.print(temp);\n  Serial.print(\"°C | Humedad: \");\n  Serial.print(hum);\n  Serial.println(\"%\");\n  \n  // Alertas inteligentes\n  if (temp > 30) Serial.println(\"⚠️ Hace calor!\");\n  if (hum > 70) Serial.println(\"💧 Humedad alta!\");\n  \n  delay(2000);\n}", explicacion: "La librería DHT simplifica todo. readTemperature() y readHumidity() nos dan los valores. Agregamos alertas con if para que sea inteligente." },
            { titulo: "✅ Quiz: Sensor DHT11", tipo: 'mini_quiz', pregunta: "¿Qué dos cosas mide el sensor DHT11?", opciones: ["Peso y velocidad", "Luz y sonido", "Temperatura y humedad", "Voltaje y corriente"], respuestaCorrecta: 2, explicacion: "¡Correcto! El DHT11 mide temperatura (0-50°C) y humedad relativa (20-80%) con un solo sensor. ¡Dos por uno! 🌡️💧" },
            { titulo: "🎮 Misión: Estación del Tiempo", tipo: 'interactive_challenge', instruccion: "**Misión Científica:** Construye tu propia estación meteorológica que registre datos:\n\n1. Conecta DHT11 a Arduino y lee temperatura/humedad cada 5 segundos\n2. Agrega un LED que encienda si temp > 28°C (alerta de calor)\n3. Agrega un segundo LED si humedad > 70% (alerta de humedad)\n4. **Reto Extra:** Registra las lecturas cada 10 minutos durante un día y haz una gráfica en papel\n\n¿Cuál fue la temperatura más alta y más baja del día?", recompensa: "🏅 Insignia: Meteorólogo Digital" },
            { titulo: "🧩 Empareja Sensor con Medición", tipo: 'matching_game', instruccion: 'Conecta cada sensor con lo que mide', pairs: [{ left: '🌡️ DHT11', right: 'Temperatura + Humedad' }, { left: '🦇 HC-SR04', right: 'Distancia por sonido' }, { left: '👁️ Infrarrojo', right: 'Líneas blanco/negro' }, { left: '💡 LDR', right: 'Nivel de luz' }] },
            { titulo: "✅❌ Clima: ¿V o F?", tipo: 'true_false', statements: [{ text: 'El DHT11 puede medir temperaturas bajo cero.', correct: false, explain: 'El DHT11 solo mide de 0°C a 50°C. Para bajo cero necesitas un DHT22 o DS18B20.' }, { text: 'Humedad relativa del 100% significa que está lloviendo.', correct: false, explain: '100% de humedad relativa significa que el aire está saturado, pero no necesariamente llueve.' }, { text: 'El DHT11 usa un solo cable de datos.', correct: true, explain: 'Solo necesita 3 cables: VCC, GND y DATA. Un solo cable para ambas mediciones.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Espera 2 segundos entre lecturas del DHT11.** Si lees demasiado rápido, el sensor devuelve NaN (error). Es un sensor lento pero fiable. ¡La paciencia es una virtud del ingeniero! ⏱️" },
        ]
    },
    {
        id: 'w2_mod4_luz_color',
        titulo: "Módulo 4: Visión de Colores 🌈",
        icon: '🌈',
        descripcion: "Usa LDR y LED RGB para que tu robot reaccione a la luz y muestre colores.",
        contenidoTeorico: [
            { titulo: "🌈 ¡Tu Robot Ve Colores!", tipo: 'intro_hero', texto: "La luz es información. Con un LDR tu robot detecta si hay luz o oscuridad, y con un LED RGB puede mostrarte colores. ¡Combinemos ambos para crear efectos increíbles!" },
            { titulo: "1. LDR: El Sensor de Luz", tipo: 'texto', puntos: [
                "**LDR (Light Dependent Resistor):** Resistencia que cambia con la luz. Más luz = menos resistencia.",
                "**Conexión:** Con una resistencia de 10KΩ forma un divisor de voltaje en pin analógico (A0).",
                "**Valores:** analogRead devuelve 0 (oscuridad) a 1023 (luz brillante).",
                "**Aplicaciones:** Luces automáticas, robot que sigue la luz, alarma nocturna."
            ]},
            { titulo: "2. LED RGB: Un Arcoíris de Luz", tipo: 'texto', puntos: [
                "**3 en 1:** Un LED RGB tiene 3 LEDs dentro: Rojo, Verde y Azul. 🔴🟢🔵",
                "**Mezcla de colores:** Rojo + Verde = Amarillo. Rojo + Azul = Magenta. Todos = Blanco.",
                "**PWM:** Con analogWrite (0-255) controlas la intensidad de cada color. ¡Millones de combinaciones!",
                "**Cátodo Común:** El pin más largo va a GND. Los otros 3 a pines PWM (~3, ~5, ~6)."
            ]},
            { titulo: "💡 Código: Lámpara Inteligente", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Lámpara que cambia color según luz ambiente\n#define LDR A0\n#define ROJO 3\n#define VERDE 5\n#define AZUL 6\n\nvoid setup() {\n  pinMode(ROJO, OUTPUT);\n  pinMode(VERDE, OUTPUT);\n  pinMode(AZUL, OUTPUT);\n}\n\nvoid setColor(int r, int g, int b) {\n  analogWrite(ROJO, r);\n  analogWrite(VERDE, g);\n  analogWrite(AZUL, b);\n}\n\nvoid loop() {\n  int luz = analogRead(LDR);\n  \n  if (luz > 800) {\n    setColor(0, 0, 0);       // Mucha luz: LED apagado\n  } else if (luz > 500) {\n    setColor(0, 255, 0);     // Luz media: verde\n  } else if (luz > 200) {\n    setColor(255, 165, 0);   // Poca luz: naranja\n  } else {\n    setColor(255, 0, 0);     // Oscuro: rojo intenso\n  }\n  delay(100);\n}", explicacion: "El LDR lee la luz ambiente. Según el valor, el LED RGB cambia de color. Es una lámpara de ambiente que reacciona sola." },
            { titulo: "✅ Quiz: Colores RGB", tipo: 'mini_quiz', pregunta: "Si pones analogWrite en Rojo=255, Verde=255, Azul=0, ¿qué color se produce?", opciones: ["Blanco", "Amarillo", "Naranja", "Rosa"], respuestaCorrecta: 1, explicacion: "¡Correcto! Rojo + Verde a máxima intensidad = Amarillo. Es síntesis aditiva de color, como en tu pantalla de TV o celular. 🟡" },
            { titulo: "🎮 Misión: Semáforo Automático", tipo: 'interactive_challenge', instruccion: "**Misión Creativa:** Crea un semáforo automático con LED RGB que funcione según la hora del día (simulada):\n\n1. Usa el LDR para detectar \"día\" y \"noche\"\n2. De día: ciclo normal (verde 5s → amarillo 2s → rojo 5s)\n3. De noche: solo amarillo parpadeante\n4. **Reto Bonus:** Agrega un botón de peatón que cambie a rojo inmediatamente\n\n¡Tu primer sistema de control automático!", recompensa: "🏅 Insignia: Maestro del Color" },
            { titulo: "✅❌ Luz y Color: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un LDR aumenta su resistencia con más luz.', correct: false, explain: 'Es al revés: más luz = menos resistencia. LDR = Light DEPENDENT Resistor.' }, { text: 'Mezclando rojo + verde + azul a máxima intensidad se obtiene blanco.', correct: true, explain: 'En síntesis aditiva (luz), RGB al máximo = blanco. Es como tu pantalla.' }, { text: 'analogWrite(pin, 0) apaga completamente el LED.', correct: true, explain: 'Valor 0 = sin voltaje = LED apagado. 255 = máximo brillo.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Usa resistencias de 220Ω en cada pata del LED RGB.** Cada color consume corriente diferente. Sin resistencias individual, un color podría dominar y los colores se verían mal. 🎨" },
        ]
    },
    // ===== SECCIÓN 2: CONSTRUCCIÓN Y MOVIMIENTO (4 módulos) =====
    {
        id: 'w2_mod5_chasis',
        titulo: "Módulo 5: Construye el Chasis 🏗️",
        icon: '🏗️',
        descripcion: "Diseña y construye el cuerpo de tu robot con materiales accesibles.",
        contenidoTeorico: [
            { titulo: "🏗️ ¡Hora de Construir!", tipo: 'intro_hero', texto: "Un buen robot empieza con un buen cuerpo. En este módulo diseñarás y construirás el chasis (esqueleto) de tu robot usando materiales que tienes en casa. ¡Manos a la obra!" },
            { titulo: "1. Materiales para el Chasis", tipo: 'texto', puntos: [
                "**📦 Cartón grueso:** Perfecto para prototipos rápidos. Gratis y fácil de cortar con tijeras.",
                "**🥤 Tapas de botella:** Excelentes ruedas improvisadas. Haz un agujero central para el eje.",
                "**📎 Palitos de madera:** Para ejes y refuerzos. Los palitos de helado son perfectos.",
                "**🔩 Kit robótico:** Chasis acrílico con soporte para motores (si tienes presupuesto)."
            ]},
            { titulo: "2. Diseño de Plataforma", tipo: 'texto', puntos: [
                "**Base rectangular:** 15×10 cm es un buen tamaño para un primer robot. Ni muy grande ni muy chico.",
                "**Motores atrás:** Coloca 2 motores DC con ruedas en la parte trasera para tracción.",
                "**Rueda loca adelante:** Una rueda libre (o bolita) al frente para girar fácilmente.",
                "**Arduino arriba:** Monta la placa Arduino encima con cinta doble cara o gomas."
            ]},
            { titulo: "🎮 Misión: Construye desde Cero", tipo: 'interactive_challenge', instruccion: "**Misión de Construcción:** Construye el chasis de tu robot usando solo materiales caseros:\n\n**Materiales necesarios:**\n- 1 caja de cartón pequeña o cartón grueso\n- 2 tapas de botella (ruedas traseras)\n- 1 canica o bolita (rueda libre delantera)\n- Palitos de helado (ejes)\n- Cinta adhesiva fuerte\n- Pegamento caliente (con ayuda de un adulto)\n\n**Pasos:**\n1. Corta la base de 15×10 cm\n2. Perfora para los ejes traseros\n3. Pega las tapas como ruedas\n4. Agrega la rueda libre al frente\n5. ¡Prueba que rueda libre en una superficie plana!\n\n📸 Toma una foto de tu chasis terminado.", recompensa: "🏅 Insignia: Constructor de Robots" },
            { titulo: "✅ Quiz: Diseño de Chasis", tipo: 'mini_quiz', pregunta: "¿Por qué es mejor poner los motores en la parte TRASERA del robot?", opciones: ["Porque se ven mejor atrás", "Para que el robot sea más pesado atrás", "Porque la tracción trasera da más estabilidad y control al girar", "No importa donde van"], respuestaCorrecta: 2, explicacion: "¡Correcto! La tracción trasera con rueda loca al frente permite girar fácilmente y da más control. Es como un carrito de supermercado pero al revés. 🛒" },
            { titulo: "3. Tips de Construcción", tipo: 'texto', puntos: [
                "**Simetría:** Asegura que las ruedas estén a la misma distancia del centro. Robot asimétrico = va chueco.",
                "**Peso balanceado:** Las baterías (lo más pesado) van en el centro-abajo.",
                "**Acceso a cables:** Deja espacio para llegar a las conexiones sin desarmar todo.",
                "**Prueba sin electrónica:** Empuja tu chasis a mano. ¿Rueda recto? ¿No se atora?"
            ]},
            { titulo: "✅❌ Construcción: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un chasis de cartón es inservible para un robot real.', correct: false, explain: 'Muchos prototipos exitosos empiezan en cartón. Es rápido, gratis y funcional.' }, { text: 'Las baterías deben ir en la parte más baja del robot.', correct: true, explain: 'Centro de gravedad bajo = más estabilidad. Las baterías son pesadas → van abajo.' }, { text: 'Un robot necesita exactamente 4 ruedas para funcionar.', correct: false, explain: '2 ruedas motorizadas + 1 rueda libre es la configuración más común y simple.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**El prototipo perfecto NO existe.** Construye rápido, prueba y mejora. Los ingenieros de Boston Dynamics hacen decenas de versiones. Tu primer robot no será perfecto y ¡eso está bien! 🔄" },
        ]
    },
    {
        id: 'w2_mod6_motores_avanzado',
        titulo: "Módulo 6: Motores al Máximo ⚡",
        icon: '⚡',
        descripcion: "Control avanzado de motores: PWM, aceleración suave y giros precisos.",
        contenidoTeorico: [
            { titulo: "⚡ ¡Potencia y Control Total!", tipo: 'intro_hero', texto: "Saber encender un motor es básico. Ahora aprenderás a controlarlo como un profesional: velocidad variable, aceleración suave y giros milimétricamente precisos. ¡Tu robot se moverá como un pro!" },
            { titulo: "1. PWM: El Acelerador del Motor", tipo: 'texto', puntos: [
                "**PWM (Pulse Width Modulation):** Enciende y apaga el motor muy rápido para simular voltaje variable.",
                "**analogWrite(pin, valor):** Valor de 0 (parado) a 255 (máxima velocidad).",
                "**Ejemplo:** analogWrite(ENA, 128) = ~50% de velocidad. Como una perilla de volumen. 🎚️",
                "**Pins PWM en Arduino UNO:** Solo los marcados con ~ (3, 5, 6, 9, 10, 11)."
            ]},
            { titulo: "💡 Código: Aceleración Suave", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Aceleración y frenado suave\nvoid acelerarSuave(int pinENA, int velocidadFinal) {\n  for (int v = 0; v <= velocidadFinal; v += 5) {\n    analogWrite(pinENA, v);\n    delay(30);  // 30ms entre cada incremento\n  }\n}\n\nvoid frenarSuave(int pinENA, int velocidadActual) {\n  for (int v = velocidadActual; v >= 0; v -= 5) {\n    analogWrite(pinENA, v);\n    delay(30);\n  }\n}\n\nvoid loop() {\n  // Adelante → acelera\n  digitalWrite(IN1, HIGH);\n  digitalWrite(IN2, LOW);\n  acelerarSuave(ENA, 200);\n  delay(2000);\n  \n  // Frena suavemente\n  frenarSuave(ENA, 200);\n  delay(1000);\n}", explicacion: "En vez de pasar de 0 a 200 de golpe, subimos de 5 en 5. Las ruedas no patinan y el movimiento es fluido." },
            { titulo: "✅ Quiz: Control PWM", tipo: 'mini_quiz', pregunta: "Si quieres que tu motor vaya exactamente al 75% de velocidad, ¿qué valor usas en analogWrite?", opciones: ["75", "192 (≈ 255 × 0.75)", "200", "175"], respuestaCorrecta: 1, explicacion: "¡Correcto! 75% de 255 = 191.25, redondeado a 192. El rango PWM es 0-255, no 0-100. 🎚️" },
            { titulo: "2. Giros Precisos", tipo: 'texto', puntos: [
                "**Giro sobre eje:** Motor izq adelante + Motor der atrás = giro en el mismo lugar.",
                "**Giro suave:** Motor izq rápido + Motor der lento = curva amplia.",
                "**Giro 90°:** Experimentar el tiempo exacto de delay() para girar exactamente 90 grados.",
                "**Encoders:** Para giros realmente precisos, se usa un encoder que cuenta las vueltas de la rueda."
            ]},
            { titulo: "🎮 Misión: Coreografía de Robot", tipo: 'interactive_challenge', instruccion: "**Misión Divertida:** Programa una coreografía para tu robot con estos pasos:\n\n1. 🏁 Arranca suavemente (aceleración suave) durante 2 segundos\n2. ↩️ Gira 90° a la derecha\n3. 🏃 Avanza 1 segundo\n4. ↪️ Gira 90° a la izquierda\n5. 🏃 Avanza 1 segundo\n6. 🔄 Gira 360° sobre su eje\n7. 🛑 Frena suavemente\n\n**Challenge:** ¿Puede tu robot dibujar un cuadrado perfecto? Programa: avanza → gira 90° → repite 4 veces.", recompensa: "🏅 Insignia: Piloto Experto" },
            { titulo: "✅❌ Motores: ¿V o F?", tipo: 'true_false', statements: [{ text: 'analogWrite(ENA, 0) hace que el motor vaya a máxima velocidad.', correct: false, explain: '0 = motor detenido. 255 = máxima velocidad. 0 significa "apagado".' }, { text: 'PWM simula voltaje variable encendiendo y apagando muy rápido.', correct: true, explain: 'PWM alterna HIGH y LOW tan rápido que el motor "siente" un voltaje promedio.' }, { text: 'Solo 6 pines de Arduino UNO soportan PWM.', correct: true, explain: 'Los pines ~3, ~5, ~6, ~9, ~10 y ~11 soportan analogWrite (PWM).' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Calibra los motores.** Dos motores \"iguales\" nunca giran a la misma velocidad. Si tu robot se desvía a un lado, reduce un poco la velocidad del motor más rápido. 🔧" },
        ]
    },
    {
        id: 'w2_mod7_servo_garra',
        titulo: "Módulo 7: Brazo y Garra Robótica 🦾",
        icon: '🦾',
        descripcion: "Construye un brazo con servos: movimientos precisos, garra y manipulación de objetos.",
        contenidoTeorico: [
            { titulo: "🦾 ¡Tu Robot Ahora Tiene Manos!", tipo: 'intro_hero', texto: "Un robot que se mueve es genial. Un robot que puede AGARRAR cosas es increíble. Con servos y un poco de creatividad, construirás un brazo robótico funcional." },
            { titulo: "1. Servo Motor: Precisión Absoluta", tipo: 'texto', puntos: [
                "**Servo SG90:** Pequeño, barato y preciso. Gira de 0° a 180° en el ángulo exacto que le pidas.",
                "**3 cables:** Naranja/Amarillo = Señal (pin PWM), Rojo = 5V, Marrón = GND.",
                "**Torque:** 1.8 kg·cm. Puede mover objetos pequeños con facilidad.",
                "**Librería Servo.h:** Simplifica el control con miServo.write(ángulo)."
            ]},
            { titulo: "💡 Código: Brazo con 2 Servos", tipo: 'code_example', lenguaje: 'Arduino', codigo: "#include <Servo.h>\nServo servoBase;    // Gira la base\nServo servoGarra;   // Abre/cierra garra\n\nvoid setup() {\n  servoBase.attach(9);\n  servoGarra.attach(10);\n  Serial.begin(9600);\n}\n\nvoid agarrar() {\n  servoGarra.write(30);   // Garra cerrada\n  delay(500);\n}\n\nvoid soltar() {\n  servoGarra.write(120);  // Garra abierta\n  delay(500);\n}\n\nvoid moverBase(int angulo) {\n  servoBase.write(angulo);\n  delay(1000);\n}\n\nvoid loop() {\n  // Secuencia: abrir → girar → cerrar → girar → soltar\n  soltar();              // Abre garra\n  moverBase(0);          // Gira a posición 0°\n  agarrar();             // Cierra garra\n  moverBase(180);        // Gira al otro lado\n  soltar();              // Suelta objeto\n  delay(2000);\n}", explicacion: "Un servo controla la base (rotación) y otro la garra (abrir/cerrar). Funciones dedicadas hacen el código limpio y reutilizable." },
            { titulo: "✅ Quiz: Servos", tipo: 'mini_quiz', pregunta: "¿Para qué usarías servoGarra.write(30) vs servoGarra.write(120)?", opciones: ["30° = garra abierta, 120° = garra cerrada", "30° = garra cerrada, 120° = garra abierta", "Ambos hacen lo mismo", "Los servos no pueden mover garras"], respuestaCorrecta: 1, explicacion: "¡Correcto! Con un ángulo pequeño (30°) la garra se cierra apretando el objeto. Con un ángulo grande (120°) se abre. ¡Los ángulos exactos dependen de tu diseño! 🦾" },
            { titulo: "🎮 Misión: Brazo Clasificador", tipo: 'interactive_challenge', instruccion: "**Misión de Ingeniería:** Construye un brazo robótico con materiales caseros:\n\n**Materiales:**\n- 2 servos SG90\n- Palitos de helado o cartón rígido\n- Pinzas de ropa (como garra improvisada)\n- Pegamento caliente\n\n**Reto:** Tu brazo debe poder:\n1. Girar 180° en su base\n2. Abrir y cerrar la garra\n3. Agarrar una pelotita de papel y moverla 15cm\n\n**Nivel Pro:** Agrega un botón para cada movimiento: botón 1 = girar, botón 2 = abrir/cerrar garra.", recompensa: "🏅 Insignia: Mano Robótica" },
            { titulo: "✅❌ Brazos Robóticos: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un servo SG90 puede girar 360° continuamente.', correct: false, explain: 'El SG90 estándar solo gira de 0° a 180°. Existen servos de rotación continua, pero son diferentes.' }, { text: 'Puedes conectar hasta 12 servos a un Arduino UNO.', correct: true, explain: 'La librería Servo permite controlar hasta 12 servos simultáneamente en un UNO.' }, { text: 'Los brazos robóticos industriales usan servos SG90.', correct: false, explain: 'Los industriales usan motores mucho más potentes con encoders. El SG90 es para educación.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Alimenta los servos con una fuente externa.** Si conectas muchos servos directo al Arduino, este no tiene suficiente corriente y se reinicia. Usa un portapilas de 4xAA (6V) solo para servos. 🔋" },
        ]
    },
    {
        id: 'w2_mod8_evasion',
        titulo: "Módulo 8: Robot Evasor 🏃",
        icon: '🏃',
        descripcion: "Combina sensor ultrasónico + motores para un robot que esquiva obstáculos solo.",
        contenidoTeorico: [
            { titulo: "🏃 ¡Robot Autónomo que Esquiva!", tipo: 'intro_hero', texto: "Llegó el momento de combinar todo: sensor ultrasónico para ver + motores para moverse + lógica para decidir. Vas a crear un robot que navega solo por una habitación sin chocar. ¡Inteligencia artificial básica en acción!" },
            { titulo: "1. La Lógica del Evasor", tipo: 'texto', puntos: [
                "**Medir:** Sensor ultrasónico mide la distancia al frente constantemente.",
                "**Decidir:** Si distancia > 30cm → avanzar. Si distancia < 30cm → detenerse y buscar salida.",
                "**Buscar:** Girar a la derecha, medir. Girar a la izquierda, medir. Ir hacia donde haya más espacio.",
                "**Repetir:** El robot hace este ciclo cientos de veces por segundo. ¡Parece inteligente!"
            ]},
            { titulo: "💡 Código: Robot Evasor Completo", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot Evasor de Obstáculos\n#define TRIG 9\n#define ECHO 10\n\nfloat medirDistancia() {\n  digitalWrite(TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  return pulseIn(ECHO, HIGH) * 0.034 / 2;\n}\n\nvoid loop() {\n  float dist = medirDistancia();\n  \n  if (dist > 30) {\n    avanzar(180);     // Camino libre\n  } else if (dist > 15) {\n    avanzar(100);     // Reducir velocidad\n  } else {\n    detener();\n    delay(200);\n    \n    // Decidir: ¿derecha o izquierda?\n    girarDerecha(150);\n    delay(400);\n    float distDer = medirDistancia();\n    \n    girarIzquierda(150);\n    delay(800);  // Doble porque volvemos + giramos\n    float distIzq = medirDistancia();\n    \n    if (distDer > distIzq) {\n      girarDerecha(150);\n      delay(400);\n    }\n    // Si izq > der, ya estamos mirando a la izq\n  }\n  delay(50);\n}", explicacion: "El robot mira al frente. Si hay obstáculo, gira a derecha e izquierda para medir, y elige el lado con más espacio. ¡Toma decisiones solo!" },
            { titulo: "✅ Quiz: Lógica de Evasión", tipo: 'mini_quiz', pregunta: "¿Por qué el robot gira a AMBOS lados antes de elegir?", opciones: ["Porque se ve más bonito", "Para marear al obstáculo", "Para comparar distancias y elegir el camino con más espacio", "No es necesario, puede girar siempre a la derecha"], respuestaCorrecta: 2, explicacion: "¡Exacto! Mide derecha e izquierda para comparar y elegir la dirección con más espacio libre. ¡Es como un humano moviendo la cabeza para buscar camino! 👀↔️" },
            { titulo: "🎮 Misión: Laberinto Casero", tipo: 'interactive_challenge', instruccion: "**Misión Épica:** Construye un laberinto con cajas de cartón y pon a prueba tu robot evasor:\n\n1. **Arma el laberinto:** Usa cajas de zapatos o libros como paredes (pasillo de ~25cm de ancho)\n2. **Prueba 1:** Pasillo recto con un giro a la derecha\n3. **Prueba 2:** Pasillo con callejón sin salida (el robot debe retroceder)\n4. **Prueba 3:** Laberinto completo con 3+ giros\n\n**Scoring:**\n- Sale del laberinto sin tocar paredes = ⭐⭐⭐\n- Toca 1-2 paredes = ⭐⭐\n- Se atora = necesita más calibración\n\n**Bonus:** Cronometra el tiempo. ¿Puede mejorar su récord?", recompensa: "🏅 Insignia: Navegador Autónomo" },
            { titulo: "2. Mejorar el Evasor", tipo: 'texto', puntos: [
                "**Servo en el sensor:** Monta el ultrasonido en un servo para escanear sin girar todo el robot.",
                "**Sensores laterales:** Agrega sensores IR a los costados para detectar paredes cercanas.",
                "**Memoria:** Guarda en un array los últimos 5 giros para evitar ciclos infinitos.",
                "**Velocidad adaptativa:** Más lejos el obstáculo → más rápido. Más cerca → más lento."
            ]},
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**El sensor ultrasónico tiene un cono de detección de ±15°.** Objetos muy finos (patas de mesa) pueden no detectarse. Agrega sensores laterales IR para cubrir los puntos ciegos. 🔍" },
        ]
    },
    // ===== SECCIÓN 3: COMUNICACIÓN Y AUTOMATIZACIÓN (4 módulos) =====
    {
        id: 'w2_mod9_serial',
        titulo: "Módulo 9: Comunicación Serial 📡",
        icon: '📡',
        descripcion: "Domina Serial para depurar, enviar datos y recibir comandos desde la PC.",
        contenidoTeorico: [
            { titulo: "📡 ¡Tu Robot Habla con la PC!", tipo: 'intro_hero', texto: "La comunicación Serial es el idioma entre tu Arduino y la computadora. Aprenderás a enviar datos, recibir comandos y crear paneles de control desde el Monitor Serial. ¡La puerta a la telemetría!" },
            { titulo: "1. Serial Avanzado", tipo: 'texto', puntos: [
                "**Serial.print() vs Serial.println():** print no salta línea, println sí. Combínalos para formato bonito.",
                "**Serial.available():** Verifica si hay datos esperando ser leídos. Retorna la cantidad de bytes.",
                "**Serial.read():** Lee UN byte (carácter). 'A' = 65, '0' = 48.",
                "**Serial.parseInt():** Lee un número entero completo. ¡Perfecto para recibir velocidades!"
            ]},
            { titulo: "💡 Código: Control por Comandos", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Control de robot por comandos seriales\nvoid setup() {\n  Serial.begin(9600);\n  Serial.println(\"=== Control de Robot ===\");\n  Serial.println(\"Comandos: W=Adelante A=Izq D=Der S=Stop\");\n  Serial.println(\"V+numero = cambiar velocidad (ej: V200)\");\n}\n\nint velocidad = 150;\n\nvoid loop() {\n  if (Serial.available()) {\n    char cmd = Serial.read();\n    \n    switch(cmd) {\n      case 'W': case 'w':\n        adelante(velocidad);\n        Serial.println(\">> Avanzando\");\n        break;\n      case 'S': case 's':\n        detener();\n        Serial.println(\">> Detenido\");\n        break;\n      case 'A': case 'a':\n        girarIzq(velocidad);\n        Serial.println(\">> Girando izq\");\n        break;\n      case 'D': case 'd':\n        girarDer(velocidad);\n        Serial.println(\">> Girando der\");\n        break;\n      case 'V': case 'v':\n        velocidad = Serial.parseInt();\n        Serial.print(\">> Velocidad: \");\n        Serial.println(velocidad);\n        break;\n    }\n  }\n}", explicacion: "Lee comandos del teclado por Serial Monitor. W/A/S/D para movimiento y V+número para cambiar velocidad. ¡Como un videojuego! 🎮" },
            { titulo: "✅ Quiz: Serial", tipo: 'mini_quiz', pregunta: "¿Qué hace Serial.available() en Arduino?", opciones: ["Abre el puerto serial", "Envía datos a la PC", "Verifica si hay datos pendientes de leer", "Configura la velocidad"], respuestaCorrecta: 2, explicacion: "¡Correcto! Serial.available() retorna cuántos bytes están esperando ser leídos. Si retorna 0, no hay datos. Si retorna > 0, ¡hay un comando esperando! 📨" },
            { titulo: "🎮 Misión: Panel de Telemetría", tipo: 'interactive_challenge', instruccion: "**Misión Técnica:** Crea un sistema de telemetría que envíe datos en tiempo real:\n\n1. Lee sensor ultrasónico + LDR cada 500ms\n2. Envía los datos formateados: \"DIST:25cm | LUZ:680 | VEL:180\"\n3. Si distancia < 15cm, envía \"⚠️ ALERTA: Obstáculo cercano!\"\n4. Desde Serial Monitor envía comandos para cambiar comportamiento\n\n**Bonus:** Guarda los datos en un archivo de texto y haz una gráfica.", recompensa: "🏅 Insignia: Operador de Telemetría" },
            { titulo: "✅❌ Serial: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Serial.read() lee una línea completa de texto.', correct: false, explain: 'Serial.read() lee UN solo byte (carácter). Para una línea usa Serial.readStringUntil().' }, { text: '9600 baudios es la velocidad estándar de comunicación serial en Arduino.', correct: true, explain: '9600 es la velocidad por defecto. Se puede cambiar a 115200 para más velocidad.' }, { text: 'Puedes enviar y recibir datos simultáneamente por Serial.', correct: true, explain: 'El puerto serial es bidireccional. Arduino puede leer y escribir al mismo tiempo.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Usa delimitadores en tus mensajes.** Enviar datos separados por comas (CSV) como \"25,680,180\" facilita el procesamiento posterior en Excel o Python. 📊" },
        ]
    },
    {
        id: 'w2_mod10_display',
        titulo: "Módulo 10: Pantalla para Robot 📺",
        icon: '📺',
        descripcion: "Agrega una pantalla OLED o LCD a tu robot para mostrar información.",
        contenidoTeorico: [
            { titulo: "📺 ¡Tu Robot Tiene Cara!", tipo: 'intro_hero', texto: "Un robot con pantalla puede mostrar datos del sensor, emociones, menús y mensajes. Aprenderás a usar pantallas LCD I2C para que tu robot se comunique visualmente. 🖥️" },
            { titulo: "1. Pantalla LCD I2C 16x2", tipo: 'texto', puntos: [
                "**16 columnas × 2 filas:** Puede mostrar hasta 32 caracteres a la vez.",
                "**I2C:** Solo necesita 2 cables de datos (SDA y SCL) + alimentación. Ahorra pines. 🔌",
                "**Dirección I2C:** Usualmente 0x27 o 0x3F. Si no funciona, prueba la otra.",
                "**Librería LiquidCrystal_I2C:** Simplifica todo. lcd.print(\"Hola\") y listo."
            ]},
            { titulo: "💡 Código: Dashboard en LCD", tipo: 'code_example', lenguaje: 'Arduino', codigo: "#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n  lcd.setCursor(0, 0);\n  lcd.print(\"Robot CultivaTec\");\n  lcd.setCursor(0, 1);\n  lcd.print(\"Iniciando...\");\n  delay(2000);\n}\n\nvoid loop() {\n  float dist = medirDistancia();\n  int luz = analogRead(A0);\n  \n  lcd.clear();\n  lcd.setCursor(0, 0);\n  lcd.print(\"Dist: \");\n  lcd.print(dist, 1);\n  lcd.print(\"cm\");\n  \n  lcd.setCursor(0, 1);\n  lcd.print(\"Luz: \");\n  lcd.print(map(luz, 0, 1023, 0, 100));\n  lcd.print(\"%\");\n  \n  delay(500);\n}", explicacion: "La pantalla muestra distancia del sensor y nivel de luz en tiempo real. setCursor(columna, fila) posiciona el texto." },
            { titulo: "✅ Quiz: LCD", tipo: 'mini_quiz', pregunta: "¿Cuántos pines de datos necesita una pantalla LCD I2C?", opciones: ["8 pines", "6 pines", "Solo 2 pines (SDA y SCL)", "4 pines"], respuestaCorrecta: 2, explicacion: "¡Correcto! I2C usa solo 2 cables: SDA (datos) y SCL (reloj). ¡Ahorra pines para más sensores! 🔌✨" },
            { titulo: "🎮 Misión: Carita Robótica", tipo: 'interactive_challenge', instruccion: "**Misión Creativa:** Usa la pantalla LCD para darle personalidad a tu robot:\n\n1. **Ojos normales:** Muestra (^_^) cuando todo está bien\n2. **Sorprendido:** Muestra (O_O) cuando detecta algo a < 20cm\n3. **Feliz:** Muestra (>w<) cuando recibe un comando\n4. **Info:** Alterna entre carita y datos del sensor cada 3 segundos\n\n**Caracteres personalizados:** Investiga lcd.createChar() para hacer tus propios emojis de 5x8 pixeles.\n\n¡Dale personalidad a tu robot!", recompensa: "🏅 Insignia: Diseñador de Interfaz" },
            { titulo: "✅❌ Pantallas: ¿V o F?", tipo: 'true_false', statements: [{ text: 'I2C necesita solo 2 cables para comunicarse.', correct: true, explain: 'SDA (datos) y SCL (reloj). Es un protocolo serial muy eficiente.' }, { text: 'lcd.clear() borra todo lo que hay en la pantalla.', correct: true, explain: 'clear() limpia la pantalla y pone el cursor en la posición 0,0.' }, { text: 'Una LCD 16x2 puede mostrar imágenes detalladas.', correct: false, explain: 'Solo muestra texto y caracteres simples de 5x8 pixeles. Para imágenes necesitas OLED.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**No uses lcd.clear() en cada ciclo del loop.** Causa parpadeo. Mejor usa lcd.setCursor() para sobreescribir solo lo que cambia. Tu pantalla se verá más profesional. ✨" },
        ]
    },
    {
        id: 'w2_mod11_bluetooth',
        titulo: "Módulo 11: Control Bluetooth 📱",
        icon: '📱',
        descripcion: "Controla tu robot desde tu celular usando Bluetooth HC-05/HC-06.",
        contenidoTeorico: [
            { titulo: "📱 ¡Controla tu Robot con el Celular!", tipo: 'intro_hero', texto: "¿Imagina mover tu robot desde tu celular como si fuera un auto a control remoto pero inalámbrico? Con un módulo Bluetooth HC-05 y una app en tu teléfono, ¡es posible y fácil!" },
            { titulo: "1. Módulo Bluetooth HC-05/HC-06", tipo: 'texto', puntos: [
                "**HC-05:** Puede ser maestro o esclavo. Más versátil. Tiene botón para configurar.",
                "**HC-06:** Solo esclavo (recibe conexiones). Más simple de usar para principiantes.",
                "**Conexión:** VCC→5V, GND→GND, TXD→Pin RX de Arduino, RXD→Pin TX de Arduino.",
                "**Velocidad por defecto:** 9600 baudios. ¡Igual que Serial.begin(9600)!"
            ]},
            { titulo: "💡 Código: Robot Bluetooth", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Control de Robot por Bluetooth\n// Usa app: \"Arduino Bluetooth Controller\"\n#include <SoftwareSerial.h>\nSoftwareSerial BT(2, 3); // RX, TX\n\nvoid setup() {\n  BT.begin(9600);\n  Serial.begin(9600);\n  Serial.println(\"Esperando Bluetooth...\");\n}\n\nvoid loop() {\n  if (BT.available()) {\n    char cmd = BT.read();\n    Serial.print(\"Comando: \");\n    Serial.println(cmd);\n    \n    switch(cmd) {\n      case 'F': adelante(200);    break;\n      case 'B': atras(200);       break;\n      case 'L': girarIzq(150);    break;\n      case 'R': girarDer(150);    break;\n      case 'S': detener();        break;\n      case 'H': // Bocina\n        tone(8, 1000, 200);\n        break;\n      case '1': adelante(100);    break; // Lento\n      case '2': adelante(180);    break; // Medio\n      case '3': adelante(255);    break; // Rápido\n    }\n  }\n}", explicacion: "SoftwareSerial crea un puerto serial extra para el Bluetooth. La app envía letras y Arduino ejecuta acciones. ¡F=Forward, B=Back, L=Left, R=Right, S=Stop!" },
            { titulo: "✅ Quiz: Bluetooth", tipo: 'mini_quiz', pregunta: "¿Por qué usamos SoftwareSerial en vez del Serial normal para Bluetooth?", opciones: ["Porque es más rápido", "Para no ocupar los pines 0 y 1 que usa el Serial/USB", "Porque el Bluetooth no funciona con Serial normal", "No hay razón, es lo mismo"], respuestaCorrecta: 1, explicacion: "¡Correcto! Los pines 0 y 1 son usados por el USB para subir código. Si conectaras el Bluetooth ahí, no podrías programar Arduino. SoftwareSerial usa otros pines. 🔌📱" },
            { titulo: "🎮 Misión: Joystick Virtual", tipo: 'interactive_challenge', instruccion: "**Misión Pro:** Convierte tu celular en un control remoto completo:\n\n1. **Instala la app** \"Arduino Bluetooth Controller\" en tu celular (gratis)\n2. **Empareja** el HC-05 con tu celular (clave: 1234 o 0000)\n3. **Configura** los botones de la app con las letras F, B, L, R, S\n4. **Prueba** controlar tu robot por toda la casa\n\n**Retos:**\n- 🏁 Carrera contra reloj: lleva tu robot del cuarto a la cocina\n- 📦 Misión de rescate: empuja una caja pequeña hasta un punto\n- 🏅 Slalom: esquiva 5 obstáculos controlando desde el celular", recompensa: "🏅 Insignia: Piloto Remoto" },
            { titulo: "✅❌ Bluetooth: ¿V o F?", tipo: 'true_false', statements: [{ text: 'La contraseña por defecto del HC-05 es 1234.', correct: true, explain: 'La mayoría de módulos HC-05 vienen con contraseña 1234 o 0000 de fábrica.' }, { text: 'El Bluetooth tiene un alcance de 100 metros.', correct: false, explain: 'El HC-05 tiene alcance de ~10 metros. El Bluetooth 5.0 de celulares puede llegar a más.' }, { text: 'SoftwareSerial puede usar cualquier pin digital de Arduino.', correct: true, explain: 'Puedes elegir los pines que quieras para RX y TX del SoftwareSerial.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Desconecta el módulo Bluetooth antes de subir código.** Si el HC-05 está conectado a los pines 0/1, interfiere con la carga de programas. Usa SoftwareSerial en otros pines para evitar este problema. 📱" },
        ]
    },
    {
        id: 'w2_mod12_sonido',
        titulo: "Módulo 12: Robot Musical 🎵",
        icon: '🎵',
        descripcion: "Haz que tu robot produzca sonidos, melodías y reaccione al ruido ambiente.",
        contenidoTeorico: [
            { titulo: "🎵 ¡Tu Robot Canta!", tipo: 'intro_hero', texto: "¡Los robots también pueden hacer música! Con un simple buzzer y la función tone() de Arduino, tu robot producirá sonidos, alertas y hasta melodías. Y con un micrófono, ¡puede escuchar palmadas!" },
            { titulo: "1. Buzzer: La Voz del Robot", tipo: 'texto', puntos: [
                "**Buzzer pasivo:** Necesita señal PWM. Puede tocar diferentes notas musicales. 🎹",
                "**Buzzer activo:** Solo enciende/apaga. Un solo tono (bip). Más simple pero limitado.",
                "**tone(pin, frecuencia, duración):** Función mágica. 440Hz = nota La. 262Hz = nota Do.",
                "**noTone(pin):** Detiene el sonido. Importante para no volver loco a todos. 😅"
            ]},
            { titulo: "💡 Código: Melodía del Robot", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Melodía de victoria para tu robot\n#define BUZZER 8\n\n// Notas musicales en Hz\n#define DO  262\n#define RE  294\n#define MI  330\n#define FA  349\n#define SOL 392\n#define LA  440\n#define SI  494\n#define DO2 523\n\nvoid tocarVictoria() {\n  int melodia[] = {DO, MI, SOL, DO2, SOL, DO2};\n  int duracion[] = {200, 200, 200, 400, 200, 600};\n  \n  for (int i = 0; i < 6; i++) {\n    tone(BUZZER, melodia[i], duracion[i]);\n    delay(duracion[i] + 50);\n  }\n  noTone(BUZZER);\n}\n\nvoid tocarAlerta() {\n  for (int i = 0; i < 3; i++) {\n    tone(BUZZER, 1000, 100);\n    delay(200);\n  }\n}\n\nvoid loop() {\n  float dist = medirDistancia();\n  if (dist < 15) {\n    tocarAlerta();    // ¡Obstáculo!\n  }\n}", explicacion: "Arrays guarden notas y duraciones de la melodía. Un ciclo for las toca en secuencia. ¡Puedes crear cualquier melodía cambiando los arrays!" },
            { titulo: "✅ Quiz: Sonido", tipo: 'mini_quiz', pregunta: "¿Qué frecuencia produce la nota musical LA?", opciones: ["262 Hz", "440 Hz", "1000 Hz", "100 Hz"], respuestaCorrecta: 1, explicacion: "¡Correcto! La nota LA a 440 Hz es la referencia universal para afinar instrumentos. ¡Tu robot puede producir esa nota con tone(pin, 440)! 🎵" },
            { titulo: "🎮 Misión: Compositor Robot", tipo: 'interactive_challenge', instruccion: "**Misión Musical:** Programa melodías para diferentes situaciones de tu robot:\n\n1. **🏁 Melodía de inicio:** Suena cuando el robot se enciende (5 notas ascendentes)\n2. **⚠️ Alerta de obstáculo:** 3 bips rápidos cuando detecta algo cerca\n3. **✅ Melodía de victoria:** Cuando completa una misión (melodía alegre)\n4. **🔋 Batería baja:** Tono descendente triste\n\n**Reto Bonus:** ¡Intenta programar las primeras notas de tu canción favorita!\n\nNotas: DO=262, RE=294, MI=330, FA=349, SOL=392, LA=440, SI=494", recompensa: "🏅 Insignia: Compositor Digital" },
            { titulo: "2. Sensor de Sonido", tipo: 'texto', puntos: [
                "**Módulo KY-038:** Detecta nivel de ruido ambiente. Tiene salida digital y analógica.",
                "**digitalRead:** Detecta sonidos fuertes (palmadas, golpes). Ideal para encender/apagar.",
                "**analogRead:** Lee nivel de ruido continuo (0-1023). Para visualizar ruido en tiempo real.",
                "**Aplaudir para encender:** Lee palmadas y cuenta. 2 palmadas rápidas = encender/apagar robot."
            ]},
            { titulo: "✅❌ Sonido: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un buzzer pasivo puede tocar diferentes notas musicales.', correct: true, explain: 'El buzzer pasivo necesita señal PWM y puede producir cualquier frecuencia = cualquier nota.' }, { text: 'tone(pin, 440) produce un sonido grave muy bajo.', correct: false, explain: '440 Hz es la nota LA, un tono medio. Los sonidos graves están por debajo de 200 Hz.' }, { text: 'noTone() es necesario para detener el sonido de tone().', correct: true, explain: 'tone() suena indefinidamente si no especificas duración. noTone() lo detiene.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Usa arrays para tus melodías.** Guarda notas en un array y duraciones en otro. Así puedes cambiar canciones fácilmente sin reescribir el código. ¡Como una playlist! 🎶" },
        ]
    },
    // ===== SECCIÓN 4: PROYECTOS INTEGRADOS + PROYECTO FINAL (4 módulos) =====
    {
        id: 'w2_mod13_maquina_estados',
        titulo: "Módulo 13: Robot con Modos 🎛️",
        icon: '🎛️',
        descripcion: "Máquinas de estados: tu robot con múltiples modos de operación.",
        contenidoTeorico: [
            { titulo: "🎛️ ¡Robot Multi-modo!", tipo: 'intro_hero', texto: "Los robots reales no hacen una sola cosa. Un robot aspiradora tiene modo limpieza, modo carga, modo esquivar. Aprenderás a programar MODOS con máquinas de estados finitos. ¡Tu robot será versátil!" },
            { titulo: "1. ¿Qué es una Máquina de Estados?", tipo: 'texto', puntos: [
                "**Estado:** Situación actual del robot. Ejemplo: EXPLORANDO, EVADIENDO, CARGANDO, ESPERANDO.",
                "**Transición:** Condición que cambia de un estado a otro. Ejemplo: obstáculo detectado → cambiar a EVADIENDO.",
                "**Acción:** Lo que el robot hace en cada estado. EXPLORANDO → avanzar, EVADIENDO → girar.",
                "**Enum:** Usamos enum para nombrar los estados: enum Estado { EXPLORAR, EVADIR, ESPERAR };"
            ]},
            { titulo: "💡 Código: Robot con 3 Modos", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot con Máquina de Estados\nenum Estado { EXPLORAR, EVADIR, SEGUIR_LINEA, ESPERAR };\nEstado estado = ESPERAR;\n\nvoid loop() {\n  switch(estado) {\n    case ESPERAR:\n      detener();\n      lcd.print(\"Modo: ESPERAR\");\n      if (Serial.read() == 'G') estado = EXPLORAR;\n      break;\n      \n    case EXPLORAR:\n      avanzar(180);\n      lcd.print(\"Modo: EXPLORAR\");\n      if (medirDistancia() < 20) estado = EVADIR;\n      if (sensorLinea()) estado = SEGUIR_LINEA;\n      break;\n      \n    case EVADIR:\n      girarDerecha(150);\n      lcd.print(\"Modo: EVADIR\");\n      delay(500);\n      if (medirDistancia() > 30) estado = EXPLORAR;\n      break;\n      \n    case SEGUIR_LINEA:\n      seguirLinea();\n      lcd.print(\"Modo: LINEA\");\n      if (!sensorLinea()) estado = EXPLORAR;\n      break;\n  }\n  delay(50);\n}", explicacion: "El switch/case ejecuta código diferente según el estado actual. Las condiciones cambian el estado automáticamente. ¡El robot decide solo qué modo usar!" },
            { titulo: "✅ Quiz: Máquinas de Estados", tipo: 'mini_quiz', pregunta: "¿Qué es una 'transición' en una máquina de estados?", opciones: ["Un tipo de motor eléctrico", "La condición que hace que el robot cambie de un estado a otro", "El nombre del robot", "Un tipo de sensor"], respuestaCorrecta: 1, explicacion: "¡Correcto! La transición es la REGLA que dice cuándo cambiar. Ejemplo: 'si distancia < 20' es la transición de EXPLORAR a EVADIR. ¡Es la lógica que da inteligencia! 🧠" },
            { titulo: "🎮 Misión: Robot Multiusos", tipo: 'interactive_challenge', instruccion: "**Misión Avanzada:** Programa tu robot con 4 modos que se activen automáticamente:\n\n1. **PATRULLA:** Avanza recto con sensor ultrasónico activo\n2. **ALERTA:** Cuando detecta objeto, se detiene y suena alarma (buzzer)\n3. **EVADIR:** Busca camino libre girando\n4. **SEGUIR_LUZ:** Si hay poca luz (LDR < 200), busca la dirección con más luz\n\n**Transiciones:**\n- PATRULLA → ALERTA (si dist < 25cm)\n- ALERTA → EVADIR (después de 2 segundos de alarma)\n- EVADIR → PATRULLA (cuando encuentra espacio libre)\n- Cualquier estado → SEGUIR_LUZ (si LDR < 200)\n\n¡Dibuja el diagrama de estados antes de programar!", recompensa: "🏅 Insignia: Arquitecto de Comportamiento" },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Siempre dibuja el diagrama ANTES de programar.** Dibuja círculos para estados, flechas para transiciones y escribe las condiciones. Si está claro en papel, el código sale fácil. 📝" },
        ]
    },
    {
        id: 'w2_mod14_energia',
        titulo: "Módulo 14: Gestión de Energía 🔋",
        icon: '🔋',
        descripcion: "Aprende a manejar baterías, consumo eléctrico y autonomía del robot.",
        contenidoTeorico: [
            { titulo: "🔋 ¡Energía para tu Robot!", tipo: 'intro_hero', texto: "Un robot sin batería es un pisapapeles caro. La gestión de energía es CRÍTICA. Aprenderás a elegir baterías, calcular consumo y hacer que tu robot dure más. ¡Es como administrar el combustible de un cohete!" },
            { titulo: "1. Tipos de Baterías", tipo: 'texto', puntos: [
                "**4×AA (6V, 2000mAh):** Económicas, fáciles de conseguir. Duran ~2-3 horas con motores. 🔋",
                "**Batería 9V:** Compacta pero baja capacidad (~500mAh). Solo para Arduino sin motores.",
                "**LiPo 7.4V (2S):** Recargable, ligera, potente. La favorita para drones y robots. ⚡",
                "**Power Bank USB:** Para Arduino que no usa motores. ¡Dura horas!"
            ]},
            { titulo: "2. Calcular Autonomía", tipo: 'texto', puntos: [
                "**Consumo:** Arduino ≈ 50mA. Motor DC ≈ 200mA cada uno. Servo ≈ 150mA pico. Sensores ≈ 15mA.",
                "**Total:** 2 motores + Arduino + sensor = 50 + 400 + 15 = ~465mA.",
                "**Autonomía:** Capacidad ÷ Consumo. Con 4×AA (2000mAh): 2000 ÷ 465 ≈ 4.3 horas teóricas.",
                "**Real:** Factores como descarga no lineal reducen ~30%. Espera ~3 horas reales."
            ]},
            { titulo: "Fórmula: Autonomía", tipo: 'formula', texto: "Calcula cuánto dura tu robot:", formula: "Autonomía (horas) = Capacidad_batería (mAh) ÷ Consumo_total (mA)", explicacion: "Ejemplo: batería 2000mAh y consumo 500mA → 2000÷500 = 4 horas teóricas. Real: ~3 horas." },
            { titulo: "✅ Quiz: Energía", tipo: 'mini_quiz', pregunta: "Si tu robot consume 400mA y tu batería es de 2000mAh, ¿cuántas horas teóricas dura?", opciones: ["2 horas", "5 horas", "10 horas", "40 horas"], respuestaCorrecta: 1, explicacion: "¡Correcto! 2000 ÷ 400 = 5 horas teóricas. En la práctica, espera ~3.5 horas por la descarga no lineal. 🔋⏱️" },
            { titulo: "🎮 Misión: Auditoría Energética", tipo: 'interactive_challenge', instruccion: "**Misión Científica:** Calcula la autonomía real de TU robot:\n\n1. **Lista** todos los componentes de tu robot\n2. **Busca** el consumo de cada uno (en mA)\n3. **Suma** el consumo total\n4. **Calcula** la autonomía teórica con tu batería\n5. **Prueba:** Carga las baterías y cronometra cuánto dura tu robot realmente\n\n| Componente | Consumo (mA) |\n|---|---|\n| Arduino | 50 |\n| Motor 1 | ? |\n| Motor 2 | ? |\n| Sensor | ? |\n| TOTAL | ? |\n\n¿Coincide la teoría con la realidad?", recompensa: "🏅 Insignia: Ingeniero de Energía" },
            { titulo: "✅❌ Energía: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Una batería de 9V tiene más capacidad que 4 pilas AA.', correct: false, explain: 'La 9V tiene ~500mAh. Las 4×AA tienen ~2000mAh. Las AA tienen 4× más capacidad.' }, { text: 'Las baterías LiPo pueden explotar si se cargan mal.', correct: true, explain: 'Las LiPo requieren cargadores especiales. Sobrecargarlas es peligroso. ¡Siempre con supervisión!' }, { text: 'El consumo de un motor DC es constante todo el tiempo.', correct: false, explain: 'El consumo varía según la carga. Más peso o fricción = más consumo.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Nunca mezcles baterías nuevas con usadas.** La batería débil crea un cuello de botella y reduce el rendimiento de todas. Cambia siempre el juego completo. 🔋🔄" },
        ]
    },
    {
        id: 'w2_mod15_integracion',
        titulo: "Módulo 15: Integración Total 🔧",
        icon: '🔧',
        descripcion: "Combina todo lo aprendido: sensores + motores + display + sonido en un solo robot.",
        contenidoTeorico: [
            { titulo: "🔧 ¡Uniendo Todo!", tipo: 'intro_hero', texto: "Este es el módulo donde TODAS las piezas se juntan. Vas a integrar sensores, motores, pantalla, sonido y comunicación en un solo robot completo. ¡Es tu obra maestra de ingeniería!" },
            { titulo: "1. Planificación de Pines", tipo: 'texto', puntos: [
                "**Problema:** Arduino UNO tiene pocos pines. ¡Hay que planificar qué va dónde!",
                "**Digital:** Motores (4 pines) + Buzzer (1 pin) + LED (1 pin) + Botón (1 pin) = 7 pines digitales.",
                "**PWM (~):** Velocidad motores (2 pines) + LED RGB (3 pines) = 5 pines PWM.",
                "**Analógico:** LDR (A0) + Sensor sonido (A1) = 2 pines analógicos.",
                "**I2C:** LCD OLED (SDA, SCL) = 2 pines compartidos.",
                "**Especiales:** Ultrasónico Trig (pin 9) + Echo (pin 10) = 2 pines."
            ]},
            { titulo: "2. Diagrama de Conexiones", tipo: 'texto', puntos: [
                "**Paso 1:** Dibuja TODOS los componentes en una hoja grande.",
                "**Paso 2:** Asigna pines evitando conflictos (PWM para motores, Digital para sensores).",
                "**Paso 3:** Usa colores: Rojo = VCC, Negro = GND, Azul = señales.",
                "**Paso 4:** Conecta por grupos: primero motores, luego sensores, después extras."
            ]},
            { titulo: "🎮 Misión: El Mega Robot", tipo: 'interactive_challenge', instruccion: "**Misión Final de Integración:** Construye un robot que integre MÍNIMO 5 de estos sistemas:\n\n✅ Evasión de obstáculos (ultrasónico)\n✅ Seguimiento de línea (IR)\n✅ Pantalla LCD con información\n✅ Sonidos de alerta (buzzer)\n✅ Control por Bluetooth (celular)\n✅ Detección de luz (LDR)\n✅ Indicador LED RGB\n✅ Brazo/garra con servo\n\n**Pasos:**\n1. Planifica los pines en papel\n2. Conecta componentes uno por uno (prueba cada uno por separado)\n3. Integra los modos con máquina de estados\n4. Programa las transiciones\n5. ¡Prueba y celebra!\n\n📸 Documenta tu proceso con fotos.", recompensa: "🏅 Insignia: Integrador de Sistemas" },
            { titulo: "✅ Quiz: Integración", tipo: 'mini_quiz', pregunta: "¿Cuál es el PRIMER paso al integrar múltiples componentes en un robot?", opciones: ["Conectar todo de una vez y ver si funciona", "Planificar los pines y probar cada componente por separado", "Comprar los componentes más caros", "Empezar programando sin conectar nada"], respuestaCorrecta: 1, explicacion: "¡Correcto! Siempre planifica y prueba cada componente individualmente. Si conectas todo junto y algo falla, ¡no sabrás qué componente es el problema! 🧩" },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Prueba por capas.** Primero haz que los motores funcionen solos. Luego agrega sensores. Después la pantalla. Agregar de uno en uno te permite encontrar problemas rápidamente. 🧱" },
        ]
    },
    {
        id: 'w2_mod16_proyecto_final',
        titulo: "🏆 Proyecto Final: Robot Autónomo Casero",
        icon: '🏆',
        descripcion: "¡Construye desde cero un robot que explore, esquive, muestre datos y suene alertas!",
        contenidoTeorico: [
            { titulo: "🏆 ¡EL GRAN PROYECTO FINAL!", tipo: 'intro_hero', texto: "Este es el momento para el que te has preparado durante todo el Mundo 2. Vas a construir un ROBOT AUTÓNOMO COMPLETO desde cero, usando todo lo que aprendiste. Este robot puede ser construido 100% en tu casa. ¡Manos a la obra, ingeniero!" },
            { titulo: "📋 El Proyecto: Robot Explorador Autónomo", tipo: 'texto', puntos: [
                "**Nombre sugerido:** ExploraBot, tu robot explorador personal. 🤖",
                "**Misión del robot:** Explorar una habitación de forma autónoma, esquivando obstáculos, mostrando datos en pantalla y sonando alertas.",
                "**Requisitos mínimos:** Debe moverse solo, evitar choques, y mostrar información.",
                "**Requisitos extra (opcional):** Control Bluetooth, seguimiento de línea, brazo/garra."
            ]},
            { titulo: "📦 Lista de Materiales", tipo: 'texto', puntos: [
                "**🧠 Arduino UNO** + Cable USB",
                "**⚡ Driver L298N** + 2 Motores DC + 2 Ruedas + 1 Rueda loca",
                "**🦇 Sensor Ultrasónico HC-SR04** (para esquivar obstáculos)",
                "**📺 Pantalla LCD I2C 16x2** (para mostrar datos)",
                "**🔊 Buzzer pasivo** (para alertas sonoras)",
                "**💡 LED RGB o LEDs individuales** (indicadores visuales)",
                "**🔋 Portapilas 4×AA** (para motores) + Cable USB/Power Bank (para Arduino)",
                "**📦 Cartón grueso o chasis de acrílico** + Cinta, pegamento, cables"
            ]},
            { titulo: "🔨 Paso 1: Construir el Chasis", tipo: 'texto', puntos: [
                "**Base:** Corta una base rectangular de 18×12 cm en cartón grueso o MDF.",
                "**Motores:** Pega los 2 motores DC con cinta fuerte o pegamento caliente en la parte trasera.",
                "**Rueda loca:** Pega la rueda libre o una bolita en la parte delantera, centrada.",
                "**Arduino:** Monta encima con cinta doble cara. Deja acceso al USB.",
                "**Batería:** Portapilas en la parte inferior (centro de gravedad bajo)."
            ]},
            { titulo: "⚡ Paso 2: Conexiones Eléctricas", tipo: 'texto', puntos: [
                "**L298N → Arduino:** IN1(2), IN2(3), IN3(4), IN4(7), ENA(5), ENB(6)",
                "**HC-SR04 → Arduino:** TRIG(9), ECHO(10), VCC(5V), GND(GND)",
                "**LCD I2C → Arduino:** SDA(A4), SCL(A5), VCC(5V), GND(GND)",
                "**Buzzer → Arduino:** Positivo(8), Negativo(GND)",
                "**Alimentación:** Arduino por USB/PowerBank. Motores por portapilas → L298N 12V input."
            ]},
            { titulo: "💻 Paso 3: El Código Maestro", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// === ROBOT EXPLORADOR AUTÓNOMO ===\n// Proyecto Final - La Fábrica de Autómatas\n\n#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n\n// Pines Motores\n#define IN1 2\n#define IN2 3\n#define IN3 4\n#define IN4 7\n#define ENA 5\n#define ENB 6\n\n// Pines Sensor\n#define TRIG 9\n#define ECHO 10\n#define BUZZER 8\n\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nenum Estado { EXPLORAR, EVADIR, ALERTA };\nEstado estado = EXPLORAR;\nint objEvadidos = 0;\n\nfloat medirDistancia() {\n  digitalWrite(TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  return pulseIn(ECHO, HIGH) * 0.034 / 2;\n}\n\nvoid adelante(int vel) {\n  digitalWrite(IN1,HIGH); digitalWrite(IN2,LOW);\n  digitalWrite(IN3,HIGH); digitalWrite(IN4,LOW);\n  analogWrite(ENA,vel); analogWrite(ENB,vel);\n}\n\nvoid girar(int vel) {\n  digitalWrite(IN1,HIGH); digitalWrite(IN2,LOW);\n  digitalWrite(IN3,LOW); digitalWrite(IN4,HIGH);\n  analogWrite(ENA,vel); analogWrite(ENB,vel);\n}\n\nvoid detener() {\n  analogWrite(ENA,0); analogWrite(ENB,0);\n}\n\nvoid setup() {\n  for(int i=2;i<=10;i++) pinMode(i,OUTPUT);\n  pinMode(ECHO,INPUT);\n  lcd.init(); lcd.backlight();\n  lcd.print(\"ExploraBot v1.0\");\n  delay(2000);\n}\n\nvoid loop() {\n  float d = medirDistancia();\n  lcd.clear();\n  \n  switch(estado) {\n    case EXPLORAR:\n      adelante(180);\n      lcd.print(\"EXPLORANDO\");\n      lcd.setCursor(0,1);\n      lcd.print(\"Dist:\"); lcd.print(d,0);\n      lcd.print(\"cm E:\"); lcd.print(objEvadidos);\n      if (d < 25) estado = ALERTA;\n      break;\n      \n    case ALERTA:\n      detener();\n      tone(BUZZER, 1000, 200);\n      lcd.print(\"!! OBSTACULO !!\");\n      delay(500);\n      estado = EVADIR;\n      break;\n      \n    case EVADIR:\n      girar(150);\n      lcd.print(\"EVADIENDO...\");\n      delay(600);\n      if (medirDistancia() > 35) {\n        objEvadidos++;\n        estado = EXPLORAR;\n      }\n      break;\n  }\n  delay(100);\n}", explicacion: "El robot usa máquina de estados: EXPLORAR (avanzar), ALERTA (obstáculo detectado → alarma), EVADIR (girar hasta encontrar espacio). La LCD muestra el estado y estadísticas. ¡Un robot completo con IA básica!" },
            { titulo: "🧪 Paso 4: Pruebas y Calibración", tipo: 'texto', puntos: [
                "**Prueba 1:** ¿Los motores giran en la dirección correcta? Si no, invierte cables.",
                "**Prueba 2:** ¿El sensor mide distancias correctas? Compara con una regla.",
                "**Prueba 3:** ¿La LCD muestra información clara? Ajusta posiciones.",
                "**Prueba 4:** ¿El robot gira lo suficiente para evadir? Ajusta el delay de giro.",
                "**Prueba 5:** ¡Déjalo libre en una habitación y observa! 🎉"
            ]},
            { titulo: "🎮 Misión Final: Demostración", tipo: 'interactive_challenge', instruccion: "**🏆 MISIÓN FINAL DEL MUNDO 2:**\n\nTu robot ExploraBot debe superar estas 3 pruebas:\n\n**Prueba 1 - Evasión:** Pon 5 obstáculos en una mesa grande o piso. El robot debe moverse 2 minutos SIN chocar con ninguno.\n\n**Prueba 2 - Dashboard:** La pantalla LCD debe mostrar:\n- Estado actual (EXPLORANDO / EVADIENDO)\n- Distancia al objeto más cercano\n- Cantidad de obstáculos evadidos\n\n**Prueba 3 - Alertas:** Cuando detecte un objeto a < 15cm:\n- Buzzer suena alerta ⚠️\n- LED RGB cambia a rojo 🔴\n- LCD muestra \"¡¡OBSTÁCULO!!\"\n\n**📸 Graba un video de 30 segundos mostrando tu robot en acción.**\n\n¡FELICIDADES! ¡Has completado La Fábrica de Autómatas! 🏆🎉", recompensa: "🏅🏆 Insignia DORADA: Maestro Autómata" },
            { titulo: "✅ Quiz Final", tipo: 'mini_quiz', pregunta: "¿Cuál es la ventaja de usar una máquina de estados en tu robot?", opciones: ["Hace que el robot sea más pesado", "Organiza el código en modos claros con transiciones definidas", "No tiene ninguna ventaja", "Solo sirve para robots industriales"], respuestaCorrecta: 1, explicacion: "¡Correcto! La máquina de estados organiza TODO el comportamiento en modos claros. Sabes exactamente qué hace el robot en cada momento y puedes agregar nuevos modos fácilmente. ¡Es como tener un manual de instrucciones! 📋🤖" },
            { titulo: "🎉 ¡Felicidades, Ingeniero!", tipo: 'tip', texto: "**Has completado La Fábrica de Autómatas.** Pasaste de no saber nada de sensores a construir un robot autónomo completo con IA básica. ¡Eso es INCREÍBLE! El siguiente mundo te espera con desafíos aún más emocionantes. ¡Nunca dejes de aprender y crear! 🚀🌟" },
        ]
    },
];

// Secciones del Mundo 2
export const WORLD_2_SECTIONS = [
    { startIdx: 0, title: '👀 Sensores y Percepción', subtitle: '¡Dale ojos y sentidos a tu robot!', color: '#10B981', colorLight: '#D1FAE5', emoji: '🦇' },
    { startIdx: 4, title: '🏗️ Construcción y Movimiento', subtitle: 'Chasis, motores y brazos robóticos', color: '#F59E0B', colorLight: '#FEF3C7', emoji: '⚡' },
    { startIdx: 8, title: '📡 Comunicación y Automatización', subtitle: 'Serial, pantallas, Bluetooth y sonido', color: '#8B5CF6', colorLight: '#EDE9FE', emoji: '📱' },
    { startIdx: 12, title: '🏆 Proyectos Integrados', subtitle: 'Combina todo y construye tu robot final', color: '#EF4444', colorLight: '#FEE2E2', emoji: '🔧' },
];
