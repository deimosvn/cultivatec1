// ==========================================================
// --- DATOS EXPANDIDOS DE MÓDULOS DE ROBÓTICA ---
// ==========================================================

export const MODULOS_DATA = [
    // ===== SECCIÓN 0: INTRODUCCIÓN A LA ROBÓTICA (3 módulos) =====
    { 
        id: 'mod_intro_robot', 
        titulo: "Módulo 1: ¿Qué es un Robot?", 
        icon: '🤖', 
        descripcion: "¡Descubre qué son los robots, dónde están y por qué son tan increíbles!", 
        contenidoTeorico: [
            { titulo: "🎉 ¡Bienvenido al Mundo de los Robots!", tipo: 'intro_hero', texto: "¡Estás a punto de aprender a construir ROBOTS de verdad! 🤖 En esta aventura descubrirás cómo darle vida a máquinas inteligentes usando electricidad, programación y mucha creatividad. ¡Prepárate para convertirte en un ingeniero robótico!" },
            { titulo: "1. ¿Qué es un Robot?", tipo: 'texto', puntos: [
                "**Robot:** Máquina programable que puede sentir, pensar y actuar. ¡Como un superhéroe mecánico! 🦾",
                "**Sentir (Sensores):** Los ojos, oídos y tacto del robot. Detectan luz, distancia, temperatura y más.",
                "**Pensar (Cerebro/Procesador):** El Arduino o computadora que toma decisiones basadas en los sensores.",
                "**Actuar (Actuadores):** Motores, luces y bocinas que le permiten moverse y hacer cosas."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "La palabra **Robot** viene del checo 'robota' que significa 'trabajo forzado'. Fue inventada por el escritor Karel Čapek en 1920 para una obra de teatro. ¡Los robots nacieron en la literatura antes que en la realidad! 📚🤖" },
            { titulo: "2. ¿Dónde Están los Robots?", tipo: 'texto', puntos: [
                "**🏭 En las Fábricas:** Robots soldadores arman millones de autos cada año. ¡Son súper rápidos y precisos!",
                "**🏥 En los Hospitales:** Robots cirujanos ayudan a los doctores a hacer operaciones con precisión milimétrica.",
                "**🚀 En el Espacio:** El rover Perseverance explora Marte buscando vida. ¡Y tiene un helicóptero robot llamado Ingenuity!",
                "**🏠 En tu Casa:** Robots aspiradora (Roomba), asistentes de voz (Alexa), ¡hasta tu lavadora es un tipo de robot!"
            ]},
            { titulo: "🎮 Mini Actividad: Detective de Robots", tipo: 'interactive_challenge', instruccion: "**Misión:** Mira a tu alrededor. ¿Cuántos 'robots' o máquinas automáticas puedes encontrar en tu casa? Pista: electrodomésticos que hacen cosas solos (microondas, lavadora, control remoto del TV). ¡Anota cuántos encontraste!", recompensa: "🏅 Insignia: Detective Robótico" },
            { titulo: "3. Tipos de Robots", tipo: 'texto', puntos: [
                "**🚗 Robots Móviles:** Se mueven con ruedas o patas. Ejemplo: carros autónomos y robots exploradores.",
                "**🦾 Brazos Robóticos:** Se quedan en un lugar pero mueven su brazo. Usados en fábricas para pintar, soldar y empacar.",
                "**🐕 Robots Bio-inspirados:** Imitan animales. Boston Dynamics hace robots-perro que caminan y saltan.",
                "**🤖 Robots Humanoides:** Parecidos a personas. Sophia puede hablar y hacer expresiones faciales."
            ]},
            { titulo: "✅ Quiz: Tipos de Robots", tipo: 'mini_quiz', pregunta: "Un robot aspiradora como Roomba que se mueve por tu casa, ¿qué tipo de robot es?", opciones: ["Brazo Robótico", "Robot Humanoide", "Robot Móvil", "Robot Bio-inspirado"], respuestaCorrecta: 2, explicacion: "¡Correcto! El Roomba es un robot MÓVIL porque se desplaza con ruedas por el suelo. Los brazos robóticos se quedan fijos en un lugar. 🤖🏠" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Cuáles son las 3 cosas que todo robot puede hacer?", opciones: ["Correr, Saltar y Volar", "Sentir, Pensar y Actuar", "Hablar, Cantar y Bailar"], respuestaCorrecta: 1, explicacion: "¡Exacto! Todo robot tiene sensores para SENTIR, un cerebro para PENSAR, y actuadores para ACTUAR. ¡Es la regla de oro de la robótica! 🌟" },
            { titulo: "4. ¿Por Qué Aprender Robótica?", tipo: 'texto', puntos: [
                "**🧠 Desarrollas tu Cerebro:** Aprendes a resolver problemas paso a paso (pensamiento computacional).",
                "**🎨 Eres Creativo:** Diseñas y construyes TUS propias máquinas. ¡No hay límites!",
                "**🚀 El Futuro es Robótico:** Los trabajos del futuro necesitarán personas que entiendan de robots e IA.",
                "**🎮 ¡Es Divertido!** Programar un robot es como jugar un videojuego... ¡pero TÚ creas el juego!"
            ]},
            { titulo: "🎮 Reto: Diseña tu Robot del Futuro", tipo: 'interactive_challenge', instruccion: "**Reto Creativo:** Imagina un robot que NO existe todavía pero que sería súper útil.\n\n1. ¿Qué problema resolvería? (ej: limpiar océanos, ayudar abuelitos)\n2. ¿Cómo se movería? (ruedas, patas, volando, nadando)\n3. ¿Qué sensores necesitaría?\n4. Dale un nombre genial\n\n¡Dibújalo en una hoja de papel!", recompensa: "🏅 Insignia: Inventor del Futuro" },
            { titulo: "✅ Quiz Final: Robótica", tipo: 'mini_quiz', pregunta: "¿Qué es el 'pensamiento computacional' que aprendes con robótica?", opciones: ["Pensar como una computadora sin emociones", "Saber muchas fórmulas de matemáticas", "Hablar un lenguaje de programación fluidamente", "Resolver problemas dividiéndolos en pasos ordenados"], respuestaCorrecta: 3, explicacion: "¡Exacto! El pensamiento computacional es la habilidad de descomponer problemas complejos en pasos pequeños y lógicos. ¡Es una superpotencia para la vida! 🧠✨" },
            { titulo: "Las 3 Partes de un Robot", tipo: 'illustration', svg: '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"><rect x="90" y="30" width="120" height="40" rx="8" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/><text x="150" y="55" text-anchor="middle" fill="white" font-size="13" font-weight="bold">🧠 PENSAR</text><rect x="10" y="100" width="120" height="40" rx="8" fill="#F59E0B" stroke="#D97706" stroke-width="2"/><text x="70" y="125" text-anchor="middle" fill="white" font-size="13" font-weight="bold">👀 SENTIR</text><rect x="170" y="100" width="120" height="40" rx="8" fill="#10B981" stroke="#059669" stroke-width="2"/><text x="230" y="125" text-anchor="middle" fill="white" font-size="13" font-weight="bold">💪 ACTUAR</text><line x1="130" y1="70" x2="70" y2="100" stroke="#6B7280" stroke-width="2" stroke-dasharray="5,3"/><line x1="170" y1="70" x2="230" y2="100" stroke="#6B7280" stroke-width="2" stroke-dasharray="5,3"/><text x="150" y="175" text-anchor="middle" fill="#6B7280" font-size="11">Sensores → Cerebro → Actuadores</text></svg>', caption: 'Todo robot sigue este ciclo: sus **sensores** captan información, su **cerebro** decide qué hacer, y sus **actuadores** ejecutan la acción.', labels: [{ icon: '👀', name: 'Sensores', desc: 'Ojos y oídos del robot' }, { icon: '🧠', name: 'Procesador', desc: 'Toma las decisiones' }, { icon: '⚙️', name: 'Actuadores', desc: 'Motores y luces' }, { icon: '🔋', name: 'Energía', desc: 'Pilas o batería' }] },
            { titulo: "🧩 Conecta Robot con su Tipo", tipo: 'matching_game', instruccion: 'Conecta cada robot con su categoría correcta', pairs: [{ left: '🚗 Tesla Autopilot', right: 'Robot Móvil' }, { left: '🦾 Brazo de fábrica', right: 'Brazo Robótico' }, { left: '🐕 Spot de Boston Dynamics', right: 'Robot Bio-inspirado' }, { left: '🤖 Sophia', right: 'Robot Humanoide' }] },
            { titulo: "✅❌ ¿Verdadero o Falso?", tipo: 'true_false', statements: [{ text: 'La palabra "robot" viene del idioma japonés.', correct: false, explain: 'Viene del checo "robota" (trabajo forzado), inventada por Karel Čapek en 1920.' }, { text: 'Tu lavadora es un tipo de robot porque actúa sola.', correct: true, explain: '¡Sí! Tiene sensores, un programa y actuadores. Es un robot doméstico.' }, { text: 'Los robots solo existen en las fábricas.', correct: false, explain: 'Están en hospitales, el espacio, tu casa y muchos lugares más.' }, { text: 'Todo robot necesita sensores, cerebro y actuadores.', correct: true, explain: 'Esas son las 3 partes fundamentales de cualquier robot.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**No necesitas ser un genio para construir robots.** Solo necesitas curiosidad, paciencia y ganas de experimentar. ¡Los mejores ingenieros aprendieron cometiendo errores! Cada error es un paso más cerca del éxito. 🎯" },
        
            { titulo: "✅ Quiz: Historia de la Robótica", tipo: 'mini_quiz', pregunta: "¿De qué idioma proviene la palabra 'Robot'?", opciones: ["Japonés", "Inglés", "Checo", "Alemán"], respuestaCorrecta: 2, explicacion: "Viene del checo 'robota' que significa trabajo forzado, del escritor Karel Čapek en 1920. 📚" },
            { titulo: "✅ Quiz: Robots en la Vida Real", tipo: 'mini_quiz', pregunta: "¿Qué robot explora la superficie de Marte actualmente?", opciones: ["Roomba", "Perseverance", "Sophia", "Spot"], respuestaCorrecta: 1, explicacion: "¡El rover Perseverance de NASA ha explorado Marte desde 2021 buscando señales de vida! 🚀" },
            { titulo: "✅❌ Robots: ¿Verdadero o Falso?", tipo: 'true_false', statements: [{ text: 'Un robot necesita estar conectado a internet para funcionar.', correct: false, explain: 'Muchos robots funcionan sin internet, solo necesitan su programa y energía.' }, { text: 'Los robots pueden trabajar en lugares peligrosos para los humanos.', correct: true, explain: 'Trabajan en volcanes, el espacio, bajo el mar y zonas radiactivas.' }] },
            { titulo: "✅ Quiz: Componentes Básicos", tipo: 'mini_quiz', pregunta: "¿Qué parte del robot toma las decisiones?", opciones: ["Los motores", "Los sensores", "El procesador/cerebro", "Las baterías"], respuestaCorrecta: 2, explicacion: "El procesador o cerebro (como Arduino) es quien toma decisiones basadas en la información de los sensores. 🧠" },
            { titulo: "🧩 Robots y sus Funciones", tipo: 'matching_game', instruccion: 'Conecta cada robot con su función principal', pairs: [{ left: '🏥 Robot cirujano', right: 'Operaciones precisas' }, { left: '🌋 Robot explorador', right: 'Zonas peligrosas' }, { left: '🏭 Robot industrial', right: 'Ensamblar productos' }, { left: '🏠 Roomba', right: 'Limpiar el hogar' }] },
            { titulo: "✅ Quiz: Historia de la Robótica", tipo: 'mini_quiz', pregunta: "¿Quién acuñó el término 'robot' por primera vez?", opciones: ["Isaac Asimov", "Karel Čapek en su obra R.U.R. (1920)", "Leonardo da Vinci", "Nikola Tesla"], respuestaCorrecta: 1, explicacion: "Karel Čapek usó 'robot' (del checo 'robota' = trabajo forzado) en su obra de teatro R.U.R. de 1920. ¡Tiene más de 100 años! 🎭" },
            { titulo: "✅ Quiz: Leyes de la Robótica", tipo: 'mini_quiz', pregunta: "¿Quién escribió las famosas 3 leyes de la robótica?", opciones: ["Elon Musk", "Isaac Asimov en su ficción científica", "Albert Einstein", "Steve Jobs"], respuestaCorrecta: 1, explicacion: "Isaac Asimov las planteó en 1942. La 1ª ley: un robot no puede dañar a un ser humano. Son ficción pero inspiran la ética robótica real. 📚" },
            { titulo: "✅ Quiz: Robot vs Autómata", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia principal entre un robot y un autómata?", opciones: ["No hay diferencia", "El robot puede reprogramarse y adaptarse; el autómata repite una acción fija", "El autómata es más caro", "El robot es más pequeño"], respuestaCorrecta: 1, explicacion: "Un autómata (como un reloj cucú) hace siempre lo mismo. Un robot puede reprogramarse para nuevas tareas. ¡Flexibilidad! 🤖" },
            { titulo: "✅ Quiz: Tipos de Robots", tipo: 'mini_quiz', pregunta: "¿Qué tipo de robot se usa en líneas de ensamblaje de automóviles?", opciones: ["Robot humanoide", "Robot industrial articulado (brazo robótico)", "Dron", "Robot social"], respuestaCorrecta: 1, explicacion: "Los brazos robóticos industriales sueldan, pintan y ensamblan miles de autos al día con precisión milimétrica. 🏭" },
        ]
    },
    { 
        id: 'mod_partes_robot', 
        titulo: "Módulo 2: Partes de un Robot", 
        icon: '🧩', 
        descripcion: "Conoce el cerebro, los sentidos y los músculos de todo robot.", 
        contenidoTeorico: [
            { titulo: "🧩 Las Piezas del Rompecabezas Robótico", tipo: 'intro_hero', texto: "Un robot es como un cuerpo humano mecánico: tiene cerebro, sentidos, músculos y energía. ¡Vamos a conocer cada parte para que puedas construir el tuyo!" },
            { titulo: "1. El Cerebro: Microcontrolador", tipo: 'texto', puntos: [
                "**Arduino UNO:** La placa más popular para aprender robótica. ¡Es el cerebro de tu robot! 🧠",
                "**¿Qué hace?:** Lee sensores, toma decisiones y controla los motores. Todo con tu programa.",
                "**Pines:** Tiene 'patitas' donde conectas sensores y motores. 14 digitales y 6 analógicas.",
                "**USB:** Lo conectas a tu computadora para enviarle programas. ¡Como enseñarle trucos nuevos!"
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "El chip del Arduino (ATmega328) tiene **32 mil bytes** de memoria. ¡Tu celular tiene aproximadamente **4 mil millones** de veces más! Pero con esos 32KB puedes hacer un robot increíble. A veces menos es más. 📱🤏" },
            { titulo: "2. Los Sentidos: Sensores", tipo: 'texto', puntos: [
                "**👀 Sensor Ultrasónico (HC-SR04):** Mide distancia con sonido. ¡Como un murciélago! Rango: 2-400cm.",
                "**👁️ Sensor Infrarrojo:** Detecta líneas negras en el piso. Clave para robots siguelíneas.",
                "**🌡️ Sensor de Temperatura (LM35):** Mide la temperatura del ambiente. Un termómetro digital.",
                "**💡 Sensor de Luz (LDR):** Detecta si hay luz o oscuridad. ¡Para robots que buscan la luz como girasoles!"
            ]},
            { titulo: "🎮 Empareja el Sensor", tipo: 'interactive_challenge', instruccion: "**Juego Mental:** Relaciona cada sensor con su uso:\n\n🔊 Ultrasónico → ¿Medir distancia o detectar color?\n📏 Infrarrojo → ¿Seguir líneas o medir peso?\n🌡️ LM35 → ¿Temperatura o velocidad?\n💡 LDR → ¿Luz o sonido?\n\n¡Las respuestas están en las descripciones de arriba!", recompensa: "🏅 Insignia: Experto en Sensores" },
            { titulo: "✅ Quiz: Sensores", tipo: 'mini_quiz', pregunta: "¿Cuántos centímetros puede medir el sensor ultrasónico HC-SR04?", opciones: ["De 100 a 1000 cm", "Solo 1 metro exacto", "De 2 a 400 cm", "De 0 a 10 cm"], respuestaCorrecta: 2, explicacion: "¡Correcto! El HC-SR04 tiene un rango de 2 a 400 centímetros (4 metros). ¡Usa ondas de sonido como un murciélago para medir distancia! 🦇📏" },
            { titulo: "🧩 Empareja Sensor y Función", tipo: 'matching_game', instruccion: 'Conecta cada sensor con lo que detecta', pairs: [{ left: '👀 Ultrasónico HC-SR04', right: 'Mide distancia' }, { left: '👁️ Infrarrojo', right: 'Detecta líneas negras' }, { left: '🌡️ LM35', right: 'Mide temperatura' }, { left: '💡 LDR', right: 'Detecta luz/oscuridad' }] },
            { titulo: "Arduino UNO: El Cerebro", tipo: 'illustration', svg: '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="20" width="240" height="140" rx="12" fill="#0D7377" stroke="#0A5C5F" stroke-width="3"/><rect x="50" y="40" width="60" height="35" rx="4" fill="#333" stroke="#555" stroke-width="1.5"/><text x="80" y="62" text-anchor="middle" fill="#0F0" font-size="8" font-weight="bold">ATmega328</text><rect x="110" y="130" width="40" height="20" rx="3" fill="#888" stroke="#666" stroke-width="1"/><text x="130" y="144" text-anchor="middle" fill="white" font-size="7">USB</text><circle cx="60" cy="110" r="6" fill="#FF0" stroke="#CC0" stroke-width="1.5"/><circle cx="80" cy="110" r="6" fill="#0F0" stroke="#0C0" stroke-width="1.5"/><circle cx="100" cy="110" r="6" fill="#F00" stroke="#C00" stroke-width="1.5"/><text x="80" y="128" text-anchor="middle" fill="white" font-size="7">LEDs</text><g><text x="60" y="35" fill="white" font-size="6">D0 D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 D11 D12 D13</text><text x="60" y="168" fill="white" font-size="6">A0  A1  A2  A3  A4  A5  GND  5V  3.3V</text></g><rect x="200" y="45" width="50" height="25" rx="3" fill="#222" stroke="#444" stroke-width="1"/><text x="225" y="62" text-anchor="middle" fill="#CCC" font-size="7">ICSP</text></svg>', caption: 'Arduino UNO tiene un **chip ATmega328** como cerebro, **14 pines digitales** y **6 pines analógicos** para conectar sensores y actuadores.', labels: [{ icon: '🧠', name: 'ATmega328', desc: 'Chip procesador principal' }, { icon: '🔌', name: 'Pines Digitales', desc: '14 entradas/salidas (0-13)' }, { icon: '📊', name: 'Pines Analógicos', desc: '6 entradas (A0-A5)' }, { icon: '🔗', name: 'Puerto USB', desc: 'Conecta a tu computadora' }] },
            { titulo: "3. Los Músculos: Actuadores", tipo: 'texto', puntos: [
                "**⚙️ Motor DC:** Gira continuamente. Para ruedas y hélices. Rápido pero no preciso.",
                "**🎯 Servo Motor:** Gira a un ángulo exacto (0°-180°). Para brazos, garras y cabezas de robot.",
                "**🦶 Motor Paso a Paso:** Se mueve en 'pasos' precisos. Para impresoras 3D y CNC.",
                "**💡 LEDs y Buzzer:** ¡Los robots también se expresan! Luces para indicar estado, buzzer para sonidos."
            ]},
            { titulo: "✅ Quiz: Actuadores", tipo: 'mini_quiz', pregunta: "¿Qué tipo de motor usarías para una GARRA de robot que necesita abrirse a un ángulo exacto?", opciones: ["Motor DC (giro continuo)", "Motor Paso a Paso (para impresoras 3D)", "Servo Motor (ángulo preciso de 0° a 180°)"], respuestaCorrecta: 2, explicacion: "¡Exacto! El servo motor es perfecto para garras porque puedes decirle exactamente a qué ángulo abrirse. ¡Es como un brazo que obedece al grado exacto! 🦾🎯" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué sensor usarías para que tu robot detecte una pared antes de chocar?", opciones: ["Sensor de Luz (detecta brillo)", "Sensor Ultrasónico (mide distancia)", "Sensor de Temperatura"], respuestaCorrecta: 1, explicacion: "¡El ultrasónico es perfecto! Envía ondas de sonido y mide cuánto tardan en rebotar. Si la distancia es corta, ¡hay una pared! 🦇" },
            { titulo: "4. La Energía: Alimentación", tipo: 'texto', puntos: [
                "**🔋 Pilas AA/AAA:** Baratas y fáciles. 4 pilas AA = 6V, suficiente para motores pequeños.",
                "**🔋 Batería 9V:** Compacta. Buena para Arduino pero poca duración para motores.",
                "**⚡ Batería LiPo:** Recargable y potente. ¡Los drones las usan! Requiere cuidado especial.",
                "**🔌 Cable USB:** Desde tu computadora. Perfecto para probar mientras programas."
            ]},
            { titulo: "5. El Esqueleto: Chasis", tipo: 'texto', puntos: [
                "**📦 Cartón:** ¡Perfecto para tu primer robot! Barato, fácil de cortar y reciclas. ♻️",
                "**🧱 Lego/Construcción:** Modular y reutilizable. Cambia el diseño cuando quieras.",
                "**🪵 MDF/Madera:** Más resistente. Se puede cortar con láser para diseños pro.",
                "**🖨️ Impresión 3D:** Diseñas en computadora y lo imprimes. ¡El futuro es ahora!"
            ]},
            { titulo: "🎮 Arma tu Robot Mental", tipo: 'interactive_challenge', instruccion: "**Reto de Diseño:** Elige las partes para tu robot ideal:\n\n🧠 Cerebro: ¿Arduino o ESP32?\n👀 Sensor principal: ¿Ultrasónico, Infrarrojo o LDR?\n💪 Motor: ¿DC (ruedas) o Servo (brazo)?\n🔋 Energía: ¿Pilas AA o batería 9V?\n📦 Chasis: ¿Cartón, Lego o impresión 3D?\n\n¡Escribe tus elecciones y dibuja cómo se vería!", recompensa: "🏅 Insignia: Arquitecto de Robots" },
            { titulo: "✅ Quiz Final: Partes del Robot", tipo: 'mini_quiz', pregunta: "¿Cuál es la mejor opción de chasis para tu PRIMER robot si tienes poco presupuesto?", opciones: ["Aluminio profesional", "Impresión 3D en titanio", "Fibra de carbono", "Cartón reciclado"], respuestaCorrecta: 3, explicacion: "¡Exacto! El cartón es perfecto para empezar: es gratis, fácil de cortar y puedes rediseñar sin gastar. ¡Los mejores inventos empezaron con materiales simples! ♻️📦" },
            { titulo: "✅❌ ¿Verdadero o Falso?", tipo: 'true_false', statements: [{ text: 'El Arduino UNO tiene 6 pines analógicos.', correct: true, explain: 'Tiene 6: A0 a A5, para leer sensores analógicos.' }, { text: 'Un servo motor gira continuamente como una rueda.', correct: false, explain: 'Un servo se mueve a un ángulo exacto (0°-180°). El motor DC es el que gira continuamente.' }, { text: 'Una batería LiPo es recargable.', correct: true, explain: '¡Sí! Las baterías LiPo se recargan y son muy potentes.' }, { text: 'El sensor LDR detecta sonido.', correct: false, explain: 'El LDR detecta LUZ. Para sonido se usa un micrófono.' }] },
            { titulo: "🧩 Motor con su Uso", tipo: 'matching_game', instruccion: 'Conecta cada motor con su uso ideal', pairs: [{ left: '⚙️ Motor DC', right: 'Ruedas que giran siempre' }, { left: '🎯 Servo Motor', right: 'Garra a ángulo exacto' }, { left: '🦶 Motor Paso a Paso', right: 'Impresora 3D precisa' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**Empieza simple.** Tu primer robot puede ser de cartón con un motor y un sensor. No necesitas comprar todo de una vez. ¡Los mejores inventos empezaron en un garaje con materiales simples! 🏠✨" },
        
            { titulo: "✅ Quiz: Fuentes de Energía", tipo: 'mini_quiz', pregunta: "¿Qué tipo de batería usan los drones por ser potente y recargable?", opciones: ["Pilas AA", "Batería 9V", "Batería LiPo", "Pila de botón"], respuestaCorrecta: 2, explicacion: "Las baterías LiPo (Litio-Polímero) son recargables, livianas y muy potentes. ¡Ideales para drones! ⚡" },
            { titulo: "✅ Quiz: Pines del Arduino", tipo: 'mini_quiz', pregunta: "¿Cuántos pines digitales tiene el Arduino UNO?", opciones: ["6 pines", "14 pines", "20 pines", "8 pines"], respuestaCorrecta: 1, explicacion: "El Arduino UNO tiene 14 pines digitales (D0-D13) para conexiones de entrada/salida. 🔌" },
            { titulo: "✅❌ Partes del Robot: ¿V o F?", tipo: 'true_false', statements: [{ text: 'El motor DC puede girar a un ángulo exacto como 45°.', correct: false, explain: 'El motor DC gira continuamente. Para ángulos exactos se usa el servo motor.' }, { text: 'El chasis de cartón es una buena opción para el primer robot.', correct: true, explain: 'Es barato, fácil de cortar y perfecto para prototipos iniciales.' }] },
            { titulo: "✅ Quiz: Actuadores", tipo: 'mini_quiz', pregunta: "¿Qué es un actuador en un robot?", opciones: ["Un sensor", "Un componente que convierte energía en movimiento (motores, servos, pistones)", "Un cable", "Una batería"], respuestaCorrecta: 1, explicacion: "Los actuadores son los 'músculos' del robot. Motores DC, servos, stepper motors y actuadores neumáticos generan movimiento. 💪" },
            { titulo: "✅ Quiz: Procesador del Robot", tipo: 'mini_quiz', pregunta: "¿Cuál es la función del microcontrolador en un robot?", opciones: ["Dar energía", "Procesar información de sensores y enviar comandos a actuadores (el cerebro)", "Solo almacenar datos", "Solo comunicarse"], respuestaCorrecta: 1, explicacion: "El microcontrolador es el cerebro: lee sensores → toma decisiones → controla motores. Arduino, ESP32, Raspberry Pi. 🧠" },
            { titulo: "✅ Quiz: Fuente de Energía", tipo: 'mini_quiz', pregunta: "¿Cuál es el principal desafío de energía en robots móviles?", opciones: ["Son muy ruidosos", "Las baterías tienen duración limitada y añaden peso al robot", "No necesitan energía", "Siempre usan cables"], respuestaCorrecta: 1, explicacion: "Las baterías limitan el tiempo de operación y añaden peso. Equilibrar autonomía vs peso es un desafío constante en robótica móvil. 🔋" },
            { titulo: "✅ Quiz: Sensores Básicos", tipo: 'mini_quiz', pregunta: "¿Qué tipo de sensor usarías para que un robot detecte una pared?", opciones: ["Sensor de temperatura", "Sensor de distancia (ultrasónico o infrarrojo)", "Sensor de luz", "Micrófono"], respuestaCorrecta: 1, explicacion: "Los sensores ultrasónicos (HC-SR04) e infrarrojos miden distancia. Detectan paredes, obstáculos y bordes de mesa. 📡" },
        ]
    },
    { 
        id: 'mod_primer_proyecto', 
        titulo: "Módulo 3: Diseña tu Robot Soñado", 
        icon: '🎨', 
        descripcion: "¡Diseña en papel tu robot ideal! Elige sus partes, poderes y misión.", 
        contenidoTeorico: [
            { titulo: "🎨 ¡Hora de Diseñar tu Robot!", tipo: 'intro_hero', texto: "Todo gran robot empieza como un dibujo en papel. ¡Los ingenieros de NASA, Tesla y Boston Dynamics primero DIBUJAN sus ideas antes de construirlas! Hoy tú harás lo mismo. 🚀" },
            { titulo: "1. Elige la Misión de tu Robot", tipo: 'texto', puntos: [
                "**🏠 Robot Ayudante:** Ayuda en casa: recoge juguetes, lleva cosas, riega plantas.",
                "**🌍 Robot Explorador:** Navega por terrenos difíciles, esquiva obstáculos, mapea zonas.",
                "**🎮 Robot Competidor:** Pelea en torneos de sumo, sigue líneas a toda velocidad.",
                "**🐾 Robot Mascota:** Se comporta como un animal: ladra, mueve la cola, reconoce a su dueño."
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "Leonardo da Vinci diseñó un **caballero mecánico** en 1495. ¡Era un traje de armadura que podía sentarse, mover los brazos y levantar su visor! Es considerado el primer diseño de robot humanoide de la historia. 🎨⚔️" },
            { titulo: "2. Elige las Partes", tipo: 'texto', puntos: [
                "**🧠 Cerebro:** ¿Arduino UNO (principiante) o ESP32 (con WiFi y Bluetooth)?",
                "**👀 Ojos (Sensores):** Ultrasónico para distancia, infrarrojo para líneas, cámara para visión.",
                "**💪 Músculos (Motores):** DC para ruedas, Servos para brazos, Steppers para precisión.",
                "**🔋 Energía:** Pilas AA (simple), batería 9V (compacta), LiPo (potente)."
            ]},
            { titulo: "✅ Quiz: Elige la Parte Correcta", tipo: 'mini_quiz', pregunta: "Si tu robot necesita conectarse a internet para enviar datos, ¿qué cerebro elegirías?", opciones: ["Arduino UNO (solo conexión USB)", "Una pila de 9V", "ESP32 (tiene WiFi y Bluetooth integrados)", "Un sensor ultrasónico"], respuestaCorrecta: 2, explicacion: "¡Correcto! El ESP32 tiene WiFi y Bluetooth integrados, lo que permite que tu robot se conecte a internet sin módulos extra. ¡Es el cerebro perfecto para proyectos IoT! 🌐🧠" },
            { titulo: "📝 Plantilla de Diseño", tipo: 'activity', instruccion: "**¡Dibuja tu Robot!** En una hoja de papel completa esta ficha:\n\n🤖 **Nombre del Robot:** _______________\n🎯 **Misión:** _______________\n🧠 **Cerebro:** Arduino UNO / ESP32\n👀 **Sensores:** _______________\n💪 **Motores:** _______________\n🔋 **Energía:** _______________\n📐 **Material del cuerpo:** _______________\n🎨 **Dibújalo aquí** (vista frontal y lateral)\n\n¡Guarda este dibujo, lo usarás más adelante!", materiales: ["Hoja de papel o cuaderno", "Lápices de colores", "Regla", "Mucha imaginación 🌈"] },
            { titulo: "3. Reglas del Buen Diseño", tipo: 'texto', puntos: [
                "**📏 Tamaño:** No muy grande (difícil de mover) ni muy pequeño (difícil de armar). 15-25cm es ideal.",
                "**⚖️ Peso Bajo:** Centra el peso abajo para que no se voltee. ¡Baterías en la base!",
                "**🔧 Accesible:** Debe ser fácil cambiar pilas y llegar a los cables sin desarmar todo.",
                "**🧩 Modular:** Piezas que se quitan y ponen. Si algo falla, solo cambias esa parte."
            ]},
            { titulo: "✅ Quiz: Diseño Inteligente", tipo: 'mini_quiz', pregunta: "¿Dónde deberías colocar las baterías (lo más pesado) en tu robot para que sea más estable?", opciones: ["En la parte de arriba", "A un lado del robot", "No importa la ubicación", "En la base (parte de abajo)"], respuestaCorrecta: 3, explicacion: "¡Exacto! Centro de gravedad bajo = más estabilidad. Al poner lo más pesado abajo, el robot no se voltea fácilmente. ¡Es física en acción! ⚖️🤖" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué sensor elegirías para un robot que debe esquivar obstáculos?", opciones: ["Sensor de Temperatura (mide calor)", "Sensor Ultrasónico (mide distancia a objetos)", "Sensor de Luz (mide brillo)"], respuestaCorrecta: 1, explicacion: "¡Correcto! El sensor ultrasónico mide la distancia a los objetos. Si detecta algo a menos de 20cm, el robot sabe que debe girar. 🦇✨" },
            { titulo: "4. Del Papel a la Realidad", tipo: 'texto', puntos: [
                "**Paso 1:** Dibujar → Ya lo hiciste. ¡Genial! ✅",
                "**Paso 2:** Lista de materiales → Escribe TODO lo que necesitas comprar.",
                "**Paso 3:** Armar el cuerpo → Primero el chasis, luego motores.",
                "**Paso 4:** Conectar electrónica → Sensores + Arduino + Motores.",
                "**Paso 5:** Programar → ¡Aquí es donde la magia sucede! 🧙‍♂️"
            ]},
            { titulo: "✅ Quiz: Orden de Construcción", tipo: 'mini_quiz', pregunta: "¿Cuál es el orden CORRECTO para construir un robot?", opciones: ["Programar → Comprar materiales → Dibujar → Armar", "Comprar todo → Armar sin dibujar → Programar", "Dibujar → Lista de materiales → Armar chasis → Electrónica → Programar", "Conectar cables al azar → Ver si funciona"], respuestaCorrecta: 2, explicacion: "¡Correcto! Siempre empieza dibujando tu idea, luego haz la lista de materiales, arma el cuerpo, conecta la electrónica y por último programa. ¡Orden = éxito! 📝➡️🤖" },
            { titulo: "🎮 Reto Final: Presenta tu Robot", tipo: 'interactive_challenge', instruccion: "**Reto Creativo:** Imagina que estás en una feria de ciencias. Prepara una presentación de 1 minuto sobre tu robot:\n\n1. ¿Cómo se llama?\n2. ¿Qué problema resuelve?\n3. ¿Qué lo hace especial?\n\n¡Practícalo frente al espejo o con tu familia! Los ingenieros también necesitan saber explicar sus inventos. 🎤", recompensa: "🏅 Insignia: Ingeniero Diseñador" },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**El primer prototipo SIEMPRE se puede mejorar.** Los ingenieros hacen muchas versiones: v1, v2, v3... Cada versión es mejor que la anterior. ¡No busques la perfección, busca el progreso! 🚀" },
        
            { titulo: "✅ Quiz: Planificación", tipo: 'mini_quiz', pregunta: "¿Qué es lo PRIMERO que debe hacer un ingeniero antes de construir un robot?", opciones: ["Comprar materiales caros", "Dibujar y planificar el diseño", "Programar sin saber qué construir", "Conectar cables al azar"], respuestaCorrecta: 1, explicacion: "¡Siempre se empieza con un diseño en papel! Planificar ahorra tiempo y dinero. 📝" },
            { titulo: "✅ Quiz: Misiones del Robot", tipo: 'mini_quiz', pregunta: "Si quieres un robot que participe en torneos y competencias, ¿qué tipo de misión elegirías?", opciones: ["Robot Ayudante", "Robot Explorador", "Robot Competidor", "Robot Mascota"], respuestaCorrecta: 2, explicacion: "¡Los robots competidores están diseñados para torneos de sumo, siguelíneas y más! 🏆" },
            { titulo: "✅❌ Diseño de Robots: ¿V o F?", tipo: 'true_false', statements: [{ text: 'El tamaño ideal para un primer robot es entre 15 y 25 cm.', correct: true, explain: 'Ni muy grande ni muy pequeño, fácil de manejar y armar.' }, { text: 'Las baterías deben ir en la parte de arriba del robot para mejor estabilidad.', correct: false, explain: 'Deben ir en la BASE para mantener el centro de gravedad bajo y evitar que se voltee.' }] },
            { titulo: "🧩 Misión y Sensor Ideal", tipo: 'matching_game', instruccion: 'Conecta cada misión con el sensor más útil', pairs: [{ left: '🌍 Explorar terrenos', right: 'Ultrasónico (distancia)' }, { left: '🏠 Seguir una línea', right: 'Infrarrojo (líneas)' }, { left: '🌡️ Monitorear ambiente', right: 'Sensor temperatura' }, { left: '🔆 Buscar luz solar', right: 'LDR (sensor de luz)' }] },
            { titulo: "✅ Quiz: Materiales del Chasis", tipo: 'mini_quiz', pregunta: "¿Qué material es modular y reutilizable para construir un chasis de robot?", opciones: ["Aluminio soldado", "Lego/bloques de construcción", "Vidrio templado", "Cemento"], respuestaCorrecta: 1, explicacion: "¡Lego y bloques son modulares: puedes armar, desarmar y rediseñar fácilmente! 🧱" },
            { titulo: "✅ Quiz: Prototipado", tipo: 'mini_quiz', pregunta: "¿Qué significa que un diseño sea 'modular'?", opciones: ["Que sea muy grande", "Que las piezas se pueden quitar y poner fácilmente", "Que solo funcione con un módulo", "Que no se puede modificar"], respuestaCorrecta: 1, explicacion: "Modular significa piezas intercambiables. Si algo falla, solo cambias esa parte sin desarmar todo. 🔧" },
            { titulo: "✅ Quiz: Protoboard", tipo: 'mini_quiz', pregunta: "¿Cómo están conectadas las filas de una protoboard internamente?", opciones: ["No están conectadas", "Cada fila horizontal de 5 hoyos está conectada internamente", "Todas las filas están conectadas", "Solo las filas pares"], respuestaCorrecta: 1, explicacion: "En la zona central, cada fila de 5 hoyos comparte la misma línea eléctrica. Las columnas laterales son para alimentación (+/-). 🔌" },
            { titulo: "✅ Quiz: Resistencia LED", tipo: 'mini_quiz', pregunta: "¿Por qué se necesita una resistencia al conectar un LED a Arduino?", opciones: ["Para que brille más", "Para limitar la corriente y evitar que el LED se queme", "Por estética", "No se necesita"], respuestaCorrecta: 1, explicacion: "Sin resistencia, el LED recibe demasiada corriente (>20mA) y se quema. Una resistencia de 220Ω-1KΩ lo protege. ¡Siempre con resistencia! ⚡" },
        ]
    },
    // ===== SECCIÓN 1: FUNDAMENTOS (3 módulos originales, renumerados) =====
    { 
        id: 'mod_electr', 
        titulo: "Módulo 4: Electricidad Inicial", 
        icon: '⚡', 
        descripcion: "Aprende qué es la electricidad, voltaje, corriente y resistencia con analogías divertidas.", 
        contenidoTeorico: [
            { titulo: "⚡ ¡Bienvenido al Mundo de la Electricidad!", tipo: 'intro_hero', texto: "La electricidad es como una fuerza mágica invisible que hace funcionar TODO: tu celular, las luces, los robots y ¡hasta tu cerebro usa señales eléctricas! Hoy descubrirás sus secretos y te convertirás en un maestro de la energía. 🔋✨" },
            { titulo: "1. ¿Qué es la Electricidad?", tipo: 'texto', puntos: [
                "**Electrones:** Partículas diminutas que viven dentro de los átomos. Cuando se mueven, crean electricidad. ¡Son los mensajeros de la energía! ⚛️",
                "**Corriente Eléctrica:** Es el flujo ordenado de millones de electrones moviéndose por un cable. Como un río de energía invisible.",
                "**Energía:** La electricidad se transforma en luz (focos), movimiento (motores), calor (estufas) y sonido (bocinas).",
                "**Circuito:** Camino cerrado por donde viajan los electrones. Si el camino se corta, ¡todo se apaga!"
            ]},
            { titulo: "🤔 ¿Sabías que...?", tipo: 'fun_fact', texto: "¡Los **rayos** son electricidad natural! Un solo rayo tiene suficiente energía para tostar 100,000 rebanadas de pan. Viajan a **300,000 km/s** y alcanzan temperaturas de **30,000°C**, ¡5 veces más caliente que la superficie del Sol! ⚡🌩️" },
            { titulo: "✅ Quiz: Conceptos Básicos", tipo: 'mini_quiz', pregunta: "¿Qué son los electrones?", opciones: ["Tipos de cables eléctricos", "Partículas diminutas que al moverse crean electricidad", "Unidades de medida de la luz", "Piezas de un motor"], respuestaCorrecta: 1, explicacion: "¡Correcto! Los electrones son partículas subatómicas con carga negativa. Cuando fluyen de forma ordenada por un conductor, generan corriente eléctrica. ⚛️⚡" },
            { titulo: "2. ¿De Dónde Viene la Electricidad?", tipo: 'texto', puntos: [
                "**☀️ Energía Solar:** Paneles solares convierten la luz del Sol en electricidad. ¡Energía limpia e infinita!",
                "**💨 Energía Eólica:** Enormes molinos de viento (aerogeneradores) giran y generan electricidad.",
                "**💧 Energía Hidroeléctrica:** El agua cayendo en presas mueve turbinas que generan electricidad.",
                "**🔋 Baterías:** Almacenan energía química y la convierten en eléctrica. Las usas en tu celular, juguetes y robots.",
                "**🔌 Red Eléctrica:** Cables que llevan la electricidad desde las plantas generadoras hasta tu casa."
            ]},
            { titulo: "🎮 Reto: Detective de Energía", tipo: 'interactive_challenge', instruccion: "**Misión Energética:** Investiga de dónde viene la electricidad de TU casa:\n\n1. Pregunta a un adulto: ¿Tienen paneles solares?\n2. Busca en internet: ¿Hay plantas hidroeléctricas cerca?\n3. Haz una lista de TODOS los aparatos que usan electricidad en tu cuarto\n4. ¿Cuáles usan batería y cuáles se enchufan a la pared?\n\n¡Anota cuántos aparatos encontraste!", recompensa: "🏅 Insignia: Detective de Energía" },
            { titulo: "✅ Quiz: Fuentes de Energía", tipo: 'mini_quiz', pregunta: "¿Cuál de estas NO es una fuente de electricidad?", opciones: ["Paneles solares", "Molinos de viento", "Baterías", "Arena de playa"], respuestaCorrecta: 3, explicacion: "¡Exacto! La arena común no genera electricidad. Las fuentes reales son: solar (Sol), eólica (viento), hidroeléctrica (agua) y baterías (química). 🏖️❌⚡" },
            { titulo: "3. ¿Cómo se Mueve? Conductores y Aislantes", tipo: 'texto', puntos: [
                "**Conductores:** Materiales que DEJAN pasar la electricidad. Los metales como **cobre**, **aluminio** y **oro** son excelentes conductores.",
                "**Aislantes:** Materiales que BLOQUEAN la electricidad. **Plástico**, **goma**, **madera** y **vidrio** son aislantes.",
                "**Cables:** Tienen un conductor (cobre por dentro) cubierto por un aislante (plástico por fuera). ¡Así la electricidad va segura!",
                "**Semiconductores:** Materiales especiales (como el silicio) que a veces conducen y a veces no. ¡Con ellos se hacen los chips de computadora!"
            ]},
            { titulo: "🎮 Clasifica los Materiales", tipo: 'interactive_challenge', instruccion: "**Juego Mental:** Clasifica estos materiales como CONDUCTOR o AISLANTE:\n\n🥄 Cuchara de metal → ¿?\n📎 Clip metálico → ¿?\n✏️ Borrador de goma → ¿?\n🪵 Palo de madera → ¿?\n🪙 Moneda → ¿?\n📏 Regla de plástico → ¿?\n\n**Pista:** Si es metal = conductor, si no es metal = probablemente aislante. ¡Verifica con las descripciones de arriba!", recompensa: "🏅 Insignia: Experto en Materiales" },
            { titulo: "✅ Quiz: Conductores y Aislantes", tipo: 'mini_quiz', pregunta: "¿Por qué los cables tienen plástico por fuera y cobre por dentro?", opciones: ["Porque el plástico es más bonito", "El cobre conduce electricidad y el plástico la aísla para seguridad", "Para que el cable sea más pesado", "Porque el cobre es transparente"], respuestaCorrecta: 1, explicacion: "¡Perfecto! El cobre por dentro permite que la electricidad fluya, y el plástico por fuera evita que nos dé un toque eléctrico. ¡Trabajo en equipo! 🔌🛡️" },
            { titulo: "4. El Circuito Básico: 4 Piezas Clave", tipo: 'texto', puntos: [
                "**🔋 Fuente de Energía:** La pila o batería que empuja a los electrones. Es el 'corazón' del circuito.",
                "**🔌 Cables (Conductores):** El camino por donde viajan los electrones. Como las carreteras.",
                "**💡 Consumidor (Carga):** El componente que USA la energía: un LED, motor o bocina.",
                "**🔘 Interruptor:** El 'puente' que abres (apagado) o cierras (encendido). Controla el flujo de electricidad."
            ]},
            { titulo: "💡 Analogía: El Circuito como una Fuente de Agua", tipo: 'fun_fact', texto: "Imagina una **fuente de agua**: la bomba (🔋 batería) empuja el agua, las tuberías (🔌 cables) la transportan, la fuente que lanza el agua (💡 LED) es el consumidor, y la llave de paso (🔘 interruptor) abre o cierra el flujo. ¡Si cortas una tubería, el agua deja de circular, igual que la electricidad! 💧➡️⚡" },
            { titulo: "✅ Quiz: El Circuito Básico", tipo: 'mini_quiz', pregunta: "¿Qué pasa si abres (desconectas) el interruptor en un circuito?", opciones: ["La electricidad fluye más rápido", "El LED brilla más fuerte", "La electricidad deja de fluir y todo se apaga", "La batería se carga"], respuestaCorrecta: 2, explicacion: "¡Correcto! Abrir el interruptor ROMPE el camino cerrado. Sin camino completo, los electrones no pueden circular y todo se apaga. Es como levantar un puente: ¡los carros no pueden pasar! 🔘❌" },
            { titulo: "5. Voltaje, Corriente y Resistencia", tipo: 'texto', puntos: [
                "**⬆️ Voltaje (V):** La FUERZA que empuja a los electrones. Se mide en **Voltios**. Más voltaje = más empuje.",
                "**🌊 Corriente (I):** La CANTIDAD de electrones que fluyen. Se mide en **Amperios**. Más corriente = más electrones.",
                "**🧱 Resistencia (R):** Lo que FRENA a los electrones. Se mide en **Ohmios (Ω)**. Más resistencia = menos flujo.",
                "**Analogía del Tobogán:** Voltaje = altura del tobogán, Corriente = cantidad de agua, Resistencia = rocas en el camino."
            ]},
            { titulo: "Fórmula: Ley de Ohm", tipo: 'formula', texto: "La Ley de Ohm relaciona Voltaje, Corriente y Resistencia:", formula: "V = I × R", explicacion: "Si empujas más (más V) o hay menos frenos (menos R), más electrones pasan (más I). Ejemplo: con 9V y resistencia de 450Ω, la corriente es I = 9÷450 = 0.02A (20mA)." },
            { titulo: "🎮 Calcula con la Ley de Ohm", tipo: 'interactive_challenge', instruccion: "**Reto Matemático:** Usa V = I × R para resolver:\n\n1. Si V = 12V y R = 600Ω, ¿cuánta corriente (I) fluye?\n   Pista: I = V ÷ R = 12 ÷ 600 = ?\n\n2. Si I = 0.05A y R = 100Ω, ¿cuánto voltaje (V) necesitas?\n   Pista: V = I × R = 0.05 × 100 = ?\n\n3. Si V = 5V e I = 0.025A, ¿cuánta resistencia (R) hay?\n   Pista: R = V ÷ I = 5 ÷ 0.025 = ?\n\n¡Respuestas: 0.02A, 5V, 200Ω!", recompensa: "🏅 Insignia: Maestro de Ohm" },
            { titulo: "✅ Quiz: Ley de Ohm", tipo: 'mini_quiz', pregunta: "Si aumentas el voltaje pero la resistencia se mantiene igual, ¿qué pasa con la corriente?", opciones: ["La corriente disminuye", "La corriente se mantiene igual", "La corriente aumenta", "El circuito explota"], respuestaCorrecta: 2, explicacion: "¡Exacto! Según V = I × R, si V sube y R es igual, entonces I sube. Más voltaje = más empuje = más corriente. ¡Como subir la altura del tobogán para que el agua baje más rápido! ⬆️🌊" },
            { titulo: "6. ¡Seguridad Eléctrica!", tipo: 'texto', puntos: [
                "**🚫 Regla 1:** Nunca toques enchufes, cables pelados o aparatos eléctricos con las manos MOJADAS. ¡El agua conduce electricidad!",
                "**🚫 Regla 2:** Nunca metas objetos (dedos, cuchillos, clips) en enchufes o tomas de corriente.",
                "**🚫 Regla 3:** Si ves un cable roto o pelado, NO lo toques. Avisa a un ADULTO inmediatamente.",
                "**✅ Regla 4:** Para tus proyectos de robótica, usa PILAS (bajo voltaje, seguras). Nunca trabajes con electricidad de pared (110V-220V).",
                "**✅ Regla 5:** Siempre desconecta la energía ANTES de hacer cambios en tu circuito."
            ]},
            { titulo: "✅ Quiz Final: Seguridad", tipo: 'mini_quiz', pregunta: "¿Por qué NUNCA debes tocar un enchufe con las manos mojadas?", opciones: ["Porque el enchufe se oxida", "Porque el agua es conductora y la electricidad pasaría por tu cuerpo", "Porque el agua apaga la electricidad", "Porque se moja el piso"], respuestaCorrecta: 1, explicacion: "¡Correcto! El agua es un conductor. Si tocas algo eléctrico con manos mojadas, la electricidad puede pasar por el agua hasta tu cuerpo y causarte un choque eléctrico. ¡SIEMPRE manos secas! 🖐️💧⚡" },
            { titulo: "Circuito Básico", tipo: 'illustration', svg: '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="30" width="50" height="30" rx="5" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/><text x="85" y="50" text-anchor="middle" fill="white" font-size="10" font-weight="bold">🔋 Pila</text><line x1="110" y1="45" x2="200" y2="45" stroke="#F59E0B" stroke-width="3"/><circle cx="230" cy="75" r="20" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/><text x="230" y="80" text-anchor="middle" font-size="14">💡</text><line x1="230" y1="95" x2="230" y2="140" stroke="#F59E0B" stroke-width="3"/><line x1="230" y1="140" x2="85" y2="140" stroke="#F59E0B" stroke-width="3"/><line x1="85" y1="140" x2="85" y2="60" stroke="#F59E0B" stroke-width="3"/><rect x="130" y="125" width="40" height="20" rx="4" fill="#10B981" stroke="#059669" stroke-width="1.5"/><text x="150" y="138" text-anchor="middle" fill="white" font-size="7" font-weight="bold">ON/OFF</text><line x1="200" y1="45" x2="230" y2="55" stroke="#F59E0B" stroke-width="3"/><text x="150" y="20" text-anchor="middle" fill="#6B7280" font-size="10" font-weight="bold">Circuito Básico</text></svg>', caption: 'Un circuito básico tiene 4 piezas: **batería** (energía), **cables** (camino), **LED** (consumidor) e **interruptor** (control).', labels: [{ icon: '🔋', name: 'Fuente', desc: 'Empuja los electrones' }, { icon: '🔌', name: 'Cables', desc: 'Camino de los electrones' }, { icon: '💡', name: 'LED', desc: 'Usa la energía' }, { icon: '🔘', name: 'Interruptor', desc: 'Abre o cierra el circuito' }] },
            { titulo: "🧩 Conecta Concepto y Definición", tipo: 'matching_game', instruccion: 'Relaciona cada concepto eléctrico', pairs: [{ left: '⬆️ Voltaje (V)', right: 'Fuerza que empuja electrones' }, { left: '🌊 Corriente (I)', right: 'Cantidad de electrones que fluyen' }, { left: '🧱 Resistencia (R)', right: 'Frena a los electrones' }, { left: '⚡ Circuito', right: 'Camino cerrado para electrones' }] },
            { titulo: "✅❌ Electricidad: ¿Verdadero o Falso?", tipo: 'true_false', statements: [{ text: 'El plástico es un buen conductor de electricidad.', correct: false, explain: 'El plástico es un AISLANTE. Bloquea la electricidad.' }, { text: 'Los rayos son electricidad natural.', correct: true, explain: 'Los rayos son descargas eléctricas de hasta 30,000°C.' }, { text: 'Si abres un interruptor, la electricidad sigue fluyendo.', correct: false, explain: 'Abrir el interruptor ROMPE el camino y la electricidad se detiene.' }, { text: 'El cobre es un excelente conductor eléctrico.', correct: true, explain: 'El cobre se usa en casi todos los cables eléctricos del mundo.' }] },
            { titulo: "💡 Tip del Ingeniero", tipo: 'tip', texto: "**La electricidad no es peligrosa si la respetas.** Los ingenieros trabajan con ella todos los días de forma segura siguiendo reglas simples. Con pilas y componentes de bajo voltaje (como Arduino a 5V) puedes experimentar tranquilamente. ¡La clave es siempre aprender antes de tocar! 🔒🧠" },
        
            { titulo: "✅ Quiz: Ley de Ohm", tipo: 'mini_quiz', pregunta: "Según la Ley de Ohm, si aumentas la resistencia en un circuito manteniendo el voltaje igual, ¿qué pasa con la corriente?", opciones: ["Aumenta", "Disminuye", "Se mantiene igual", "Se apaga"], respuestaCorrecta: 1, explicacion: "V = I × R → Si R sube y V es constante, la corriente I baja. ¡Más resistencia = menos flujo! ⚡" },
            { titulo: "🧩 Conceptos Eléctricos", tipo: 'matching_game', instruccion: 'Conecta cada concepto con su unidad de medida', pairs: [{ left: '⚡ Voltaje', right: 'Voltios (V)' }, { left: '💧 Corriente', right: 'Amperios (A)' }, { left: '🚧 Resistencia', right: 'Ohmios (Ω)' }, { left: '🔋 Potencia', right: 'Watts (W)' }] },
            { titulo: "✅ Quiz: Ley de Ohm", tipo: 'mini_quiz', pregunta: "¿Qué establece la Ley de Ohm?", opciones: ["V = I × R (voltaje = corriente × resistencia)", "V = I + R", "V = I / R", "V = I - R"], respuestaCorrecta: 0, explicacion: "V = I × R es la ley fundamental de la electricidad. Si conoces dos valores, calculas el tercero. ¡Memorízala! ⚡" },
            { titulo: "✅ Quiz: Serie vs Paralelo", tipo: 'mini_quiz', pregunta: "¿Qué pasa con el voltaje en un circuito en serie?", opciones: ["Se multiplica", "Se divide entre los componentes (cada uno recibe una parte)", "Permanece igual para todos", "Desaparece"], respuestaCorrecta: 1, explicacion: "En serie, el voltaje total se reparte. 3 LEDs en serie con 9V = 3V por LED. En paralelo, todos reciben el mismo voltaje. 🔋" },
            { titulo: "✅ Quiz: Corriente Continua", tipo: 'mini_quiz', pregunta: "¿Qué diferencia hay entre corriente continua (DC) y alterna (AC)?", opciones: ["No hay diferencia", "DC fluye en una sola dirección; AC cambia de dirección periódicamente", "DC es más peligrosa", "AC solo existe en laboratorios"], respuestaCorrecta: 1, explicacion: "DC (baterías, Arduino) fluye en una dirección. AC (enchufes de casa) cambia 50-60 veces por segundo. Los robots usan DC. ⚡" },
        ]
    },
    { 
        id: 'mod_electon', 
        titulo: "Módulo 5: Electrónica Inicial", 
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
            { titulo: "✅ Quiz: Componentes Pasivos", tipo: 'mini_quiz', pregunta: "¿Qué componente almacena energía temporalmente como una 'mini-batería rápida'?", opciones: ["Resistencia", "Inductor", "Capacitor", "Potenciómetro"], respuestaCorrecta: 2, explicacion: "¡Correcto! El capacitor almacena energía eléctrica y puede liberarla rápidamente. Se usa mucho para estabilizar circuitos y como filtros. ⚡📦" },
            { titulo: "3. Componentes Activos", tipo: 'texto', puntos: [
                "**Diodo:** Permite que la corriente fluya en UNA sola dirección. Como una puerta de un solo sentido.",
                "**LED (Diodo Emisor de Luz):** Un diodo especial que ¡brilla! Tiene pata larga (+) y corta (-).",
                "**Transistor:** El componente más importante. Actúa como **interruptor** electrónico o **amplificador** de señales.",
                "**Circuito Integrado (CI):** Miles de transistores en un chip diminuto. El Arduino usa un **ATmega328**."
            ]},
            { titulo: "✅ Quiz: Componentes Activos", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia entre la pata larga y la corta de un LED?", opciones: ["No hay diferencia", "Ambas son para tierra", "Pata larga = negativo, pata corta = positivo", "Pata larga = positivo (+), pata corta = negativo (-)"], respuestaCorrecta: 3, explicacion: "¡Exacto! La pata larga del LED es el ánodo (+) y la corta es el cátodo (-). Si lo conectas al revés, ¡no enciende! Es como una puerta de un solo sentido. 💡🔌" },
            { titulo: "🎮 Reto: Identifica los Componentes", tipo: 'interactive_challenge', instruccion: "**Misión Detective:** Si tienes aparatos viejos en casa (con permiso de un adulto), ábrelos y busca estos componentes:\n\n🔍 ¿Ves resistencias? (cilindros pequeños con bandas de colores)\n🔍 ¿Ves capacitores? (cilindros o discos más grandes)\n🔍 ¿Ves LEDs? (bolitas transparentes o de color)\n🔍 ¿Ves circuitos integrados? (chips negros con muchas patitas)\n\n⚠️ ¡NUNCA desarmes algo que esté enchufado! Solo aparatos desconectados y con permiso.", recompensa: "🏅 Insignia: Arqueólogo Electrónico" },
            { titulo: "💡 Ejemplo: LED con Resistencia", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Encender un LED protegido con resistencia\nvoid setup() {\n  pinMode(9, OUTPUT);  // Pin 9 → Resistencia → LED\n}\n\nvoid loop() {\n  analogWrite(9, 128);  // Brillo al 50%\n  delay(2000);\n  analogWrite(9, 255);  // Brillo al 100%\n  delay(2000);\n}", explicacion: "Usamos analogWrite para controlar el brillo del LED a través de la resistencia. ¡Sin resistencia, el LED se quemaría!" },
            { titulo: "4. Circuitos Serie y Paralelo", tipo: 'texto', puntos: [
                "**Circuito en Serie:** Los componentes van uno detrás del otro. Si uno falla, TODO se apaga.",
                "**Circuito en Paralelo:** Cada componente tiene su propio camino. Si uno falla, los demás siguen.",
                "**Voltaje en Serie:** Se *reparte* entre los componentes. Cada uno recibe una porción.",
                "**Voltaje en Paralelo:** Es *igual* para todos los componentes conectados."
            ]},
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Si conectas 3 LEDs en serie y uno se funde, ¿qué pasa?", opciones: ["Solo ese se apaga", "Se apagan todos", "Los otros brillan más"], respuestaCorrecta: 1, explicacion: "¡Correcto! En serie, si uno falla, se rompe el circuito completo y todos se apagan." },
            { titulo: "✅ Quiz: Serie vs Paralelo", tipo: 'mini_quiz', pregunta: "Las luces de tu casa están conectadas en PARALELO. ¿Qué pasa si se funde un foco de la cocina?", opciones: ["Se apagan TODAS las luces de la casa", "Los demás focos brillan más", "Solo se apaga el de la cocina, las demás luces siguen", "Salta el interruptor general"], respuestaCorrecta: 2, explicacion: "¡Correcto! En paralelo, cada foco tiene su propio camino. Si uno falla, los demás siguen funcionando. ¡Por eso las casas usan circuitos en paralelo! 💡🏠" },
            { titulo: "Serie vs Paralelo", tipo: 'illustration', svg: '<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg"><text x="80" y="18" text-anchor="middle" fill="#3B82F6" font-size="11" font-weight="bold">EN SERIE</text><rect x="10" y="25" width="140" height="70" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/><circle cx="40" cy="60" r="10" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/><circle cx="80" cy="60" r="10" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/><circle cx="120" cy="60" r="10" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/><line x1="50" y1="60" x2="70" y2="60" stroke="#333" stroke-width="2"/><line x1="90" y1="60" x2="110" y2="60" stroke="#333" stroke-width="2"/><text x="80" y="85" text-anchor="middle" fill="#6B7280" font-size="8">Un camino → uno falla = todos fallan</text><text x="230" y="18" text-anchor="middle" fill="#10B981" font-size="11" font-weight="bold">EN PARALELO</text><rect x="160" y="25" width="140" height="70" rx="8" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/><circle cx="210" cy="42" r="10" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/><circle cx="210" cy="60" r="10" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/><circle cx="210" cy="78" r="10" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5"/><line x1="190" y1="42" x2="200" y2="42" stroke="#333" stroke-width="1.5"/><line x1="190" y1="60" x2="200" y2="60" stroke="#333" stroke-width="1.5"/><line x1="190" y1="78" x2="200" y2="78" stroke="#333" stroke-width="1.5"/><line x1="220" y1="42" x2="240" y2="42" stroke="#333" stroke-width="1.5"/><line x1="220" y1="60" x2="240" y2="60" stroke="#333" stroke-width="1.5"/><line x1="220" y1="78" x2="240" y2="78" stroke="#333" stroke-width="1.5"/><line x1="190" y1="42" x2="190" y2="78" stroke="#333" stroke-width="1.5"/><line x1="240" y1="42" x2="240" y2="78" stroke="#333" stroke-width="1.5"/><text x="220" y="102" text-anchor="middle" fill="#6B7280" font-size="8">Cada uno su camino → independientes</text></svg>', caption: 'En **serie** los componentes van uno tras otro (si falla uno, fallan todos). En **paralelo** cada uno tiene su camino (si falla uno, los demás siguen).', labels: [{ icon: '🔗', name: 'Serie', desc: 'Un solo camino' }, { icon: '🔀', name: 'Paralelo', desc: 'Caminos independientes' }] },
            { titulo: "🧩 Componentes Electrónicos", tipo: 'matching_game', instruccion: 'Conecta cada componente con su función', pairs: [{ left: '🔴 Resistencia', right: 'Limita la corriente' }, { left: '⚡ Capacitor', right: 'Almacena energía temporalmente' }, { left: '💡 LED', right: 'Emite luz' }, { left: '🔲 Transistor', right: 'Interruptor electrónico' }] },
            { titulo: "✅❌ Electrónica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un LED tiene pata larga (+) y pata corta (-).', correct: true, explain: 'La pata larga es el ánodo (+) y la corta el cátodo (-).' }, { text: 'En circuito serie, si un LED se funde, los demás siguen prendidos.', correct: false, explain: 'En serie, si uno falla, se rompe el circuito y TODOS se apagan.' }, { text: 'Un potenciómetro es una resistencia que puedes cambiar girando una perilla.', correct: true, explain: '¡Sí! Es una resistencia variable, se usa para controlar volumen o brillo.' }] },
            { titulo: "5. Herramientas del Electrónico", tipo: 'texto', puntos: [
                "**Multímetro:** Mide voltaje, corriente y resistencia. ¡Tu mejor amigo para diagnosticar circuitos!",
                "**Protoboard:** Tablero con agujeros conectados internamente para armar circuitos sin soldar.",
                "**Cautín (Soldador):** Para unir componentes permanentemente. ¡Solo con supervisión de un adulto!",
                "**Cables Dupont:** Cables con puntas especiales para conectar componentes fácilmente."
            ]},
            { titulo: "🎯 Actividad Práctica", tipo: 'activity', instruccion: "**Reto:** Consigue un multímetro y una pila. Pon el multímetro en modo voltaje (V) DC y mide el voltaje de la pila. ¿Marca exactamente lo que dice la etiqueta?", materiales: ["Multímetro", "Pila AA (1.5V) o 9V", "Cables de prueba"] },
            { titulo: "✅ Quiz: Capacitores", tipo: 'mini_quiz', pregunta: "¿Cuál es la función principal de un capacitor en un circuito?", opciones: ["Generar energía", "Almacenar y liberar carga eléctrica", "Medir temperatura", "Amplificar sonido"], respuestaCorrecta: 1, explicacion: "Los capacitores almacenan energía temporalmente y la liberan cuando se necesita. ¡Son como mini-baterías rápidas! ⚡" },
            { titulo: "✅ Quiz: Diodos", tipo: 'mini_quiz', pregunta: "¿Qué hace un diodo en un circuito?", opciones: ["Permite que la corriente fluya en ambas direcciones", "Permite que la corriente fluya en UNA sola dirección", "Aumenta el voltaje", "Mide la resistencia"], respuestaCorrecta: 1, explicacion: "El diodo es como una válvula: deja pasar corriente solo en una dirección. ¡Protege tus circuitos! 🚦" },
            { titulo: "✅❌ Electrónica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un LED es un tipo especial de diodo que emite luz.', correct: true, explain: 'LED = Light Emitting Diode (Diodo Emisor de Luz).' }, { text: 'Un transistor solo puede funcionar como interruptor.', correct: false, explain: 'También puede amplificar señales, como en un amplificador de audio.' }] },
            { titulo: "🧩 Componentes Electrónicos", tipo: 'matching_game', instruccion: 'Conecta cada componente con su función', pairs: [{ left: '💡 LED', right: 'Emitir luz' }, { left: '🔌 Resistencia', right: 'Limitar corriente' }, { left: '⚡ Capacitor', right: 'Almacenar carga' }, { left: '🔀 Transistor', right: 'Amplificar/conmutar' }] },
            { titulo: "✅ Quiz: Diodo LED", tipo: 'mini_quiz', pregunta: "¿Qué significa LED?", opciones: ["Light Energy Device", "Light Emitting Diode (Diodo Emisor de Luz)", "Low Energy Display", "Laser Electronic Device"], respuestaCorrecta: 1, explicacion: "LED = Light Emitting Diode. Es un diodo que emite luz cuando la corriente pasa en una dirección. El largo es + y el corto es -. 💡" },
            { titulo: "✅ Quiz: Transistor", tipo: 'mini_quiz', pregunta: "¿Para qué se usa un transistor en electrónica?", opciones: ["Solo como resistencia", "Como interruptor electrónico o amplificador de señal", "Solo para medir voltaje", "Para almacenar datos"], respuestaCorrecta: 1, explicacion: "El transistor es el componente más importante de la electrónica. Actúa como interruptor (on/off) o amplifica señales débiles. 🔧" },
            { titulo: "✅ Quiz: Capacitor", tipo: 'mini_quiz', pregunta: "¿Cuál es la función principal de un capacitor?", opciones: ["Generar voltaje", "Almacenar y liberar carga eléctrica temporalmente", "Medir corriente", "Solo decorativo"], respuestaCorrecta: 1, explicacion: "Los capacitores almacenan energía brevemente. Se usan para filtrar ruido, estabilizar voltaje y temporizadores. ¡Son como mini baterías rápidas! ⚡" },
            { titulo: "✅ Quiz: Circuito Integrado", tipo: 'mini_quiz', pregunta: "¿Qué es un circuito integrado (IC)?", opciones: ["Un cable largo", "Un chip con miles/millones de transistores miniaturizados", "Una resistencia grande", "Un tipo de batería"], respuestaCorrecta: 1, explicacion: "Un IC (chip) contiene millones de transistores en un espacio diminuto. El ATmega328 de Arduino tiene más de 30,000 transistores. 🔬" },
        ]
    },
    { 
        id: 'mod_prog_gen', 
        titulo: "Módulo 6: Mecánica Inicial", 
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
            { titulo: "✅ Quiz: Máquinas Simples", tipo: 'mini_quiz', pregunta: "Un sube y baja en el parque es un ejemplo de:", opciones: ["Polea", "Plano inclinado", "Palanca", "Engranaje"], respuestaCorrecta: 2, explicacion: "¡Correcto! El sube y baja es una palanca clásica: una barra que gira sobre un punto fijo (fulcro) en el centro. ¡Las palancas multiplican tu fuerza! ⚖️" },
            { titulo: "3. Engranajes: Los Dientes Mágicos", tipo: 'texto', puntos: [
                "**Engranaje:** Rueda dentada que transmite movimiento rotatorio a otra rueda dentada.",
                "**Relación de Transmisión:** Engranaje grande moviendo uno pequeño = más velocidad, menos fuerza.",
                "**Engranaje Reductor:** Engranaje pequeño moviendo uno grande = más fuerza, menos velocidad.",
                "**Tipos:** Rectos (comunes), cónicos (cambian dirección 90°), cremallera (giro a línea recta)."
            ]},
            { titulo: "🎮 Experimenta con Engranajes", tipo: 'interactive_challenge', instruccion: "**Reto Manual:** Consigue una bicicleta y observa sus engranajes:\n\n1. ¿Cuántos dientes tiene el engranaje grande (plato delantero)?\n2. ¿Cuántos dientes tiene el piñón trasero más pequeño?\n3. Calcula la relación: dientes_grande ÷ dientes_pequeño = ?\n4. ¿En qué marcha pedaleas más FÁCIL (subida)? ¿Y más RÁPIDO (bajada)?\n\n¡Los cambios de bicicleta son engranajes reductores en acción!", recompensa: "🏅 Insignia: Ingeniero de Engranajes" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Si quieres que tu robot tenga MÁS FUERZA para subir una rampa, ¿qué relación de engranajes usas?", opciones: ["Sin engranajes", "Engranaje pequeño → grande (reductor)", "Engranaje grande → pequeño (multiplicador)"], respuestaCorrecta: 1, explicacion: "¡Exacto! Un engranaje reductor da más torque (fuerza de giro) a costa de menos velocidad." },
            { titulo: "4. Fuerza y Torque", tipo: 'texto', puntos: [
                "**Fuerza:** Empujón o jalón que mueve, detiene o deforma un objeto. Se mide en **Newtons (N)**.",
                "**Torque:** Fuerza de giro. Lo que hace que un motor pueda mover una rueda. Se mide en **N·m**.",
                "**Fricción:** Fuerza que se opone al movimiento. Útil para frenos, molesta para ruedas.",
                "**Centro de Gravedad:** Punto de equilibrio del robot. Si está muy alto, ¡el robot se voltea!"
            ]},
            { titulo: "✅ Quiz: Fuerza y Torque", tipo: 'mini_quiz', pregunta: "¿Qué es el TORQUE en un motor de robot?", opciones: ["La velocidad máxima del motor", "El peso del motor", "La fuerza de giro que permite mover las ruedas", "El color del motor"], respuestaCorrecta: 2, explicacion: "¡Exacto! El torque es la fuerza rotacional. Un motor con mucho torque puede mover cargas pesadas aunque sea lento. ¡Como un tractor vs un auto de carreras! ⚙️💪" },
            { titulo: "Fórmula: Relación de Engranajes", tipo: 'formula', texto: "La relación de transmisión se calcula así:", formula: "Relación = Dientes<sub>conducido</sub> ÷ Dientes<sub>conductor</sub>", explicacion: "Si el conductor tiene 10 dientes y el conducido 40, la relación es 4:1 (4x más fuerza, 4x menos velocidad)." },
            { titulo: "🎯 Actividad Práctica", tipo: 'activity', instruccion: "**Reto Lego:** Si tienes piezas Lego Technic, construye un tren de engranajes. Prueba cómo cambia la velocidad al intercambiar el engranaje grande con el pequeño.", materiales: ["Piezas Lego Technic o engranajes", "Cuaderno para dibujar observaciones"] }
,
            { titulo: "✅ Quiz: Engranajes", tipo: 'mini_quiz', pregunta: "¿Qué sucede cuando un engranaje grande mueve uno pequeño?", opciones: ["El pequeño gira más lento", "El pequeño gira más rápido", "Ambos giran a la misma velocidad", "El grande se detiene"], respuestaCorrecta: 1, explicacion: "Un engranaje grande moviendo uno pequeño aumenta la velocidad de rotación del pequeño. ¡Relación de transmisión! ⚙️" },
            { titulo: "✅ Quiz: Palancas", tipo: 'mini_quiz', pregunta: "¿Qué tipo de palanca es un sube y baja (balancín)?", opciones: ["Palanca de primer grado", "Palanca de segundo grado", "Palanca de tercer grado", "No es una palanca"], respuestaCorrecta: 0, explicacion: "El sube y baja tiene el punto de apoyo (fulcro) en el centro: es una palanca de primer grado. ⚖️" },
            { titulo: "✅ Quiz: Poleas", tipo: 'mini_quiz', pregunta: "¿Para qué sirve una polea en un robot?", opciones: ["Para medir distancia", "Para cambiar la dirección o magnitud de una fuerza", "Para generar electricidad", "Para conectar sensores"], respuestaCorrecta: 1, explicacion: "Las poleas permiten levantar objetos pesados con menos esfuerzo cambiando la dirección de la fuerza. 🏗️" },
            { titulo: "✅❌ Mecánica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Los engranajes pueden aumentar o reducir la velocidad de rotación.', correct: true, explain: 'Dependiendo del tamaño, pueden multiplicar velocidad o fuerza (torque).' }, { text: 'El torque y la velocidad son lo mismo.', correct: false, explain: 'El torque es la fuerza de giro. Más torque = más fuerza pero generalmente menos velocidad.' }] },
            { titulo: "🧩 Mecanismos y Usos", tipo: 'matching_game', instruccion: 'Conecta cada mecanismo con su uso en robótica', pairs: [{ left: '⚙️ Engranajes', right: 'Transmitir movimiento' }, { left: '🏗️ Poleas', right: 'Levantar objetos' }, { left: '⚖️ Palancas', right: 'Multiplicar fuerza' }, { left: '🔩 Tornillo sin fin', right: 'Reducir velocidad' }] },
            { titulo: "✅ Quiz: Torque", tipo: 'mini_quiz', pregunta: "Si necesitas que un robot tenga MUCHA fuerza para subir una pendiente, ¿qué necesitas aumentar?", opciones: ["La velocidad", "El torque", "El número de sensores", "El tamaño del chasis"], respuestaCorrecta: 1, explicacion: "¡El torque! Es la fuerza de giro del motor. Más torque = más capacidad para mover cargas pesadas. 💪" },
            { titulo: "✅ Quiz: Fricción", tipo: 'mini_quiz', pregunta: "¿Es la fricción siempre mala para un robot?", opciones: ["Sí, siempre hay que eliminarla", "No, las ruedas necesitan fricción para moverse", "Solo afecta a robots voladores", "No existe en robótica"], respuestaCorrecta: 1, explicacion: "¡Sin fricción las ruedas patinarían! La fricción es necesaria para tracción, pero hay que minimizarla en ejes y engranajes. 🛞" },
            { titulo: "✅ Quiz: Variable", tipo: 'mini_quiz', pregunta: "¿Qué es una variable en programación?", opciones: ["Un cable", "Un espacio en memoria con nombre que almacena un valor que puede cambiar", "Un tipo de sensor", "Una función fija"], respuestaCorrecta: 1, explicacion: "Una variable es como una caja con etiqueta: int edad = 15; guarda el número 15 en la caja 'edad'. Puedes cambiarlo después. 📦" },
            { titulo: "✅ Quiz: Bucle", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia entre un bucle for y un while?", opciones: ["No hay diferencia", "For repite un número conocido de veces; while repite mientras una condición sea verdadera", "For es más rápido", "While solo funciona una vez"], respuestaCorrecta: 1, explicacion: "for(i=0; i<10; i++) repite 10 veces. while(distancia<20) repite hasta que distancia sea ≥20. Ambos son esenciales. 🔄" },
        ]
    },
    { 
        id: 'mod_mecanica', 
        titulo: "Módulo 7: Programación Inicial", 
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
            { titulo: "✅ Quiz: Variables", tipo: 'mini_quiz', pregunta: "¿Qué tipo de dato usarías para guardar si un sensor detectó obstáculo (sí o no)?", opciones: ["int (número entero)", "String (texto)", "float (decimal)", "bool (verdadero/falso)"], respuestaCorrecta: 3, explicacion: "¡Correcto! Un booleano (bool) es perfecto para estados de sí/no, verdadero/falso. Es el tipo de dato favorito de los robots para tomar decisiones. 🤖✅❌" },
            { titulo: "💡 Variables en un Robot", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Variables para controlar un robot\nint velocidad = 150;\nint distancia = 0;\nbool hayObstaculo = false;\n\nvoid loop() {\n  distancia = leerSensor();\n  hayObstaculo = (distancia < 20);\n  \n  if (hayObstaculo) {\n    velocidad = 0;  // ¡Frena!\n  } else {\n    velocidad = 150; // Sigue adelante\n  }\n}", explicacion: "Las variables guardan datos del robot: velocidad y distancia. El robot las actualiza constantemente para tomar decisiones." },
            { titulo: "3. Condiciones: El Robot Decide", tipo: 'texto', puntos: [
                "**if (si):** Si una condición es verdadera, ejecuta un bloque de código.",
                "**else (sino):** Si la condición es falsa, ejecuta otro bloque diferente.",
                "**Ejemplo Robot:** `if (distancia < 20) { frenar(); } else { avanzar(); }`",
                "**Operadores:** Mayor (>), Menor (<), Igual (==), Diferente (!=), Mayor o igual (>=)."
            ]},
            { titulo: "🎮 Piensa como un Robot", tipo: 'interactive_challenge', instruccion: "**Reto de Lógica:** Escribe las condiciones (if/else) para estas situaciones:\n\n1. 🌧️ Si llueve → llevar paraguas, si no → usar lentes de sol\n2. 🔋 Si batería < 20% → ir a cargar, si no → seguir explorando\n3. 🌡️ Si temperatura > 30°C → encender ventilador, si no → apagarlo\n4. 🤖 Si hay obstáculo Y es grande → retroceder, si hay obstáculo Y es pequeño → esquivar\n\n¡Escríbelos en pseudocódigo o en Python!", recompensa: "🏅 Insignia: Programador Lógico" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué imprime este código?\n\nedad = 12\nif edad >= 10:\n    print(\"Grande\")\nelse:\n    print(\"Pequeño\")", opciones: ["Pequeño", "Grande", "Error"], respuestaCorrecta: 1, explicacion: "Como edad es 12 y 12 >= 10 es verdadero, se ejecuta el bloque del if y se imprime 'Grande'." },
            { titulo: "4. Ciclos: Repetir sin Cansarse", tipo: 'texto', puntos: [
                "**for:** Repite un número exacto de veces. `for (i = 0; i < 10; i++)` → repite 10 veces.",
                "**while:** Repite MIENTRAS una condición sea verdadera. `while (batería > 0) { explorar(); }`",
                "**Loop infinito:** En Arduino, `loop()` se repite para siempre.  ¡El robot nunca se aburre!",
                "**Break:** Palabra mágica para salir de un ciclo antes de que termine."
            ]},
            { titulo: "✅ Quiz: Ciclos", tipo: 'mini_quiz', pregunta: "¿Qué tipo de ciclo usarías si quieres que tu robot explore MIENTRAS tenga batería?", opciones: ["for (repite un número exacto de veces)", "if (solo se ejecuta una vez)", "while (repite mientras la condición sea verdadera)", "break (sale del ciclo)"], respuestaCorrecta: 2, explicacion: "¡Correcto! while es perfecto porque no sabemos CUÁNTAS veces repetirá, solo que debe seguir mientras haya batería. ¡El for es para cuando sabes cuántas veces! 🔄🔋" },
            { titulo: "💡 Ciclo en Python", tipo: 'code_example', lenguaje: 'Python', codigo: "# Contar estrellas\nestrellas = \"\"\n\nfor i in range(1, 6):\n    estrellas = estrellas + \"⭐\"\n    print(f\"Nivel {i}: {estrellas}\")\n\nprint(\"¡Completaste los 5 niveles!\")", explicacion: "El ciclo for repite 5 veces. Cada vez agrega una estrella y muestra el nivel. ¡Es como subir de nivel en un juego!" },
            { titulo: "5. Funciones: Superpoderes Reutilizables", tipo: 'texto', puntos: [
                "**Función:** Bloque de código con nombre que puedes reusar cuando quieras.",
                "**Crear:** `void girarDerecha() { motor1.adelante(); motor2.atras(); }`",
                "**Parámetros:** Datos que le pasas a la función. `avanzar(velocidad)` → le dices qué tan rápido.",
                "**Return:** Algunas funciones devuelven resultado: `int sumar(a, b) { return a + b; }`"
            ]},
            { titulo: "💡 Tip de Programador", tipo: 'tip', texto: "**Regla de oro:** Si copias y pegas el mismo código más de 2 veces, ¡conviértelo en una función! Así tu código será más corto, más limpio y más fácil de arreglar. 🎯" }
,
            { titulo: "✅ Quiz: Variables", tipo: 'mini_quiz', pregunta: "¿Qué es una variable en programación?", opciones: ["Un tipo de cable", "Un espacio de memoria que guarda un dato", "Un sensor especial", "Un motor programable"], respuestaCorrecta: 1, explicacion: "Una variable es como una caja con nombre donde guardas datos: números, texto, etc. 📦" },
            { titulo: "✅ Quiz: Condicionales", tipo: 'mini_quiz', pregunta: "¿Qué instrucción usas para que el programa tome una decisión?", opciones: ["for", "while", "if/else", "print"], respuestaCorrecta: 2, explicacion: "if/else permite al programa decidir: SI algo es verdad, haz esto; SI NO, haz lo otro. 🔀" },
            { titulo: "✅ Quiz: Ciclos", tipo: 'mini_quiz', pregunta: "¿Qué estructura repite un bloque de código varias veces?", opciones: ["if/else", "return", "for/while (ciclos)", "import"], respuestaCorrecta: 2, explicacion: "Los ciclos (for, while) repiten código: for repite un número fijo de veces, while repite mientras una condición sea verdadera. 🔄" },
            { titulo: "✅❌ Programación: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Una función es un bloque de código reutilizable con un nombre.', correct: true, explain: 'Las funciones organizan el código y permiten reutilizarlo llamándolo por su nombre.' }, { text: 'Los comentarios en el código son ejecutados por la computadora.', correct: false, explain: 'Los comentarios son ignorados por la computadora, son notas para los programadores.' }] },
            { titulo: "🧩 Conceptos de Programación", tipo: 'matching_game', instruccion: 'Conecta cada concepto con su descripción', pairs: [{ left: '📦 Variable', right: 'Guarda un dato' }, { left: '🔀 if/else', right: 'Toma decisiones' }, { left: '🔄 for/while', right: 'Repite código' }, { left: '📋 Función', right: 'Código reutilizable' }] },
            { titulo: "✅ Quiz: Errores Comunes", tipo: 'mini_quiz', pregunta: "¿Qué es un 'bug' en programación?", opciones: ["Un virus peligroso", "Un error o fallo en el código", "Un tipo de sensor", "Una marca de Arduino"], respuestaCorrecta: 1, explicacion: "Bug = error. El término viene de 1947 cuando una polilla causó un fallo en una computadora Harvard Mark II. 🐛" },
            { titulo: "✅ Quiz: Algoritmos", tipo: 'mini_quiz', pregunta: "¿Qué es un algoritmo?", opciones: ["Un tipo de robot", "Una serie de pasos ordenados para resolver un problema", "Un lenguaje de programación", "Un componente electrónico"], respuestaCorrecta: 1, explicacion: "Un algoritmo es una receta: pasos claros y ordenados para resolver un problema. ¡Como una receta de cocina para la computadora! 📜" },
            { titulo: "✅ Quiz: Engranajes", tipo: 'mini_quiz', pregunta: "¿Qué sucede cuando un engranaje grande mueve uno pequeño?", opciones: ["Se detienen", "El pequeño gira más rápido pero con menos fuerza (torque)", "El pequeño gira más lento", "Nada cambia"], respuestaCorrecta: 1, explicacion: "¡Relación de engranajes! Grande→pequeño = más velocidad, menos torque. Pequeño→grande = menos velocidad, más torque. ¡Trade-off! ⚙️" },
            { titulo: "✅ Quiz: Torque vs Velocidad", tipo: 'mini_quiz', pregunta: "¿Qué necesita más un robot que sube una rampa: torque o velocidad?", opciones: ["Velocidad", "Torque (fuerza de giro) para vencer la gravedad", "Ninguno", "Ambos por igual siempre"], respuestaCorrecta: 1, explicacion: "Subir rampa = necesita fuerza. Los engranajes reductores sacrifican velocidad para multiplicar el torque. ¡Más fuerza en las ruedas! 💪" },
        ]
    },
    { 
        id: 'mod_arduino', 
        titulo: "Módulo 8: Control con Arduino", 
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
            { titulo: "✅ Quiz: Pines de Arduino", tipo: 'mini_quiz', pregunta: "¿Qué rango de valores puede leer un pin analógico de Arduino?", opciones: ["Solo HIGH o LOW", "0 a 1023", "0 a 255", "0 a 100"], respuestaCorrecta: 1, explicacion: "¡Correcto! Los pines analógicos (A0-A5) usan 10 bits de resolución, lo que da 2¹⁰ = 1024 valores posibles (0 a 1023). ¡Esto permite detectar cambios muy sutiles en sensores! 📊" },
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
            { titulo: "🎮 Predice la Salida del Código", tipo: 'interactive_challenge', instruccion: "**Reto Mental:** ¿Qué hace este código? Piensa paso a paso:\n\n```\nvoid setup() {\n  pinMode(13, OUTPUT);\n  pinMode(12, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  digitalWrite(12, LOW);\n  delay(500);\n  digitalWrite(13, LOW);\n  digitalWrite(12, HIGH);\n  delay(500);\n}\n```\n\n¿Los LEDs se encienden juntos o se alternan?\n¿Cada cuánto tiempo cambian?\n\n¡Respuesta: Se alternan cada 0.5 segundos, como un semáforo ferroviario! 🚂", recompensa: "🏅 Insignia: Lector de Código" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué hace analogRead(A0) en Arduino?", opciones: ["Escribe un valor analógico en el pin A0", "Enciende el pin A0", "Lee un valor entre 0 y 1023 del pin A0"], respuestaCorrecta: 2, explicacion: "analogRead lee un valor analógico (0-1023) del pin. Un valor de 512 sería aproximadamente 2.5V." },
            { titulo: "5. Monitor Serial", tipo: 'texto', puntos: [
                "**Serial.begin(9600):** Inicia comunicación con tu PC a 9600 baudios.",
                "**Serial.println(dato):** Imprime un dato en el Monitor Serial. ¡Perfecto para depurar!",
                "**Abrir:** Ctrl+Shift+M en el IDE o el ícono de lupa.",
                "**Ejemplo:** `Serial.println(analogRead(A0));` → Muestra el valor del sensor en tiempo real."
            ]},
            { titulo: "💡 Tip de Programador", tipo: 'tip', texto: "**Serial.println() es tu mejor amigo para encontrar errores.** Cuando tu robot no hace lo que esperas, agrega Serial.println() para ver qué valores tienen tus variables. 🔍" },
            { titulo: "🎯 Actividad: Semáforo Arduino", tipo: 'activity', instruccion: "**Proyecto Mini:** Conecta 3 LEDs (rojo, amarillo, verde) a los pines 10, 11 y 12. Programa un ciclo de semáforo: Verde 5s → Amarillo 2s → Rojo 5s.", materiales: ["Arduino UNO", "3 LEDs (rojo, amarillo, verde)", "3 Resistencias 220Ω", "Protoboard", "Cables"] }
,
            { titulo: "✅ Quiz: setup() y loop()", tipo: 'mini_quiz', pregunta: "¿Cuántas veces se ejecuta la función setup() en Arduino?", opciones: ["Infinitas veces", "Solo una vez al inicio", "Cada segundo", "Nunca"], respuestaCorrecta: 1, explicacion: "setup() se ejecuta UNA sola vez al encender o reiniciar el Arduino. loop() se repite infinitamente. 🔄" },
            { titulo: "✅ Quiz: pinMode", tipo: 'mini_quiz', pregunta: "¿Qué hace la instrucción pinMode(13, OUTPUT)?", opciones: ["Lee el pin 13", "Configura el pin 13 como salida", "Apaga el pin 13", "Mide el voltaje del pin 13"], respuestaCorrecta: 1, explicacion: "pinMode configura un pin como OUTPUT (salida) para enviar señales, o INPUT (entrada) para recibir. 📌" },
            { titulo: "✅ Quiz: digitalWrite", tipo: 'mini_quiz', pregunta: "¿Qué hace digitalWrite(13, HIGH)?", opciones: ["Apaga el pin 13", "Enciende el pin 13 enviando 5V", "Lee el valor del pin 13", "Configura el pin 13 como entrada"], respuestaCorrecta: 1, explicacion: "digitalWrite con HIGH envía 5 voltios al pin, encendiendo lo que esté conectado (LED, motor, etc.). 💡" },
            { titulo: "✅ Quiz: delay()", tipo: 'mini_quiz', pregunta: "¿Qué hace delay(1000) en Arduino?", opciones: ["Espera 1 segundo", "Espera 1000 segundos", "Repite el código 1000 veces", "Enciende 1000 LEDs"], respuestaCorrecta: 0, explicacion: "delay(1000) pausa el programa durante 1000 milisegundos = 1 segundo. 1000ms = 1s ⏱️" },
            { titulo: "✅❌ Arduino: ¿V o F?", tipo: 'true_false', statements: [{ text: 'analogRead() puede leer valores del 0 al 1023.', correct: true, explain: 'El Arduino tiene un ADC de 10 bits: 2^10 = 1024 niveles (0-1023).' }, { text: 'loop() se ejecuta solo una vez como setup().', correct: false, explain: 'loop() se repite infinitamente mientras el Arduino esté encendido.' }] },
            { titulo: "🧩 Funciones Arduino", tipo: 'matching_game', instruccion: 'Conecta cada función con su descripción', pairs: [{ left: 'setup()', right: 'Se ejecuta una vez' }, { left: 'loop()', right: 'Se repite siempre' }, { left: 'digitalWrite()', right: 'Envía HIGH/LOW' }, { left: 'analogRead()', right: 'Lee valores 0-1023' }] },
            { titulo: "✅ Quiz: Pines Analógicos", tipo: 'mini_quiz', pregunta: "¿Cuántos pines analógicos tiene el Arduino UNO?", opciones: ["14", "6", "20", "2"], respuestaCorrecta: 1, explicacion: "El Arduino UNO tiene 6 pines analógicos: A0 a A5, para leer sensores analógicos. 📊" },
            { titulo: "✅ Quiz: Serial Monitor", tipo: 'mini_quiz', pregunta: "¿Para qué sirve Serial.begin(9600) en Arduino?", opciones: ["Encender un LED", "Iniciar la comunicación serial a 9600 baudios", "Configurar un motor", "Leer un sensor ultrasónico"], respuestaCorrecta: 1, explicacion: "Serial.begin(9600) inicia la comunicación serial para enviar datos al computador por el Monitor Serial. 📟" },
            { titulo: "✅ Quiz: Pines Arduino", tipo: 'mini_quiz', pregunta: "¿Cuántos pines digitales tiene un Arduino UNO?", opciones: ["6", "14 pines digitales (0-13)", "20", "32"], respuestaCorrecta: 1, explicacion: "Arduino UNO tiene 14 pines digitales (D0-D13) y 6 pines analógicos (A0-A5). Los pines 0 y 1 son para serial (TX/RX). 📟" },
            { titulo: "✅ Quiz: Setup y Loop", tipo: 'mini_quiz', pregunta: "¿Cuántas veces se ejecuta setup() vs loop() en Arduino?", opciones: ["Ambos una vez", "setup() una vez al inicio; loop() se repite infinitamente", "Ambos infinitamente", "setup() infinitamente, loop() una vez"], respuestaCorrecta: 1, explicacion: "setup() configura pines y serial UNA vez al encender. loop() se repite miles de veces por segundo. ¡El ciclo infinito del robot! 🔄" },
        ]
    },
    { 
        id: 'mod_cpp', 
        titulo: "Módulo 9: Lógica Esencial", 
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
            { titulo: "✅ Quiz: AND u OR", tipo: 'mini_quiz', pregunta: "Un robot debe avanzar SOLO si el camino está libre Y la batería tiene carga. ¿Qué operador usas?", opciones: ["OR (||) - al menos una debe ser verdadera", "NOT (!) - invierte el valor", "AND (&&) - ambas condiciones deben ser verdaderas", "XOR - una u otra pero no ambas"], respuestaCorrecta: 2, explicacion: "¡Correcto! Necesitas AND porque AMBAS condiciones deben cumplirse: camino libre Y batería cargada. Si usaras OR, avanzaría con batería vacía mientras el camino esté libre. ¡Peligroso! 🤖&&" },
            { titulo: "💡 Lógica en Robot Seguidor de Línea", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot sigue-líneas con lógica booleana\nbool sensorIzq = digitalRead(2);\nbool sensorDer = digitalRead(3);\nbool botonStop = digitalRead(4);\n\nif (botonStop) {\n  detener();\n} else if (sensorIzq && sensorDer) {\n  avanzar();  // AND: ambos ven línea = recto\n} else if (sensorIzq || sensorDer) {\n  // OR: al menos uno ve línea = curva\n  if (sensorIzq) girarDerecha();\n  else girarIzquierda();\n} else {\n  buscarLinea();\n}", explicacion: "Este robot usa AND (&&), OR (||) y condiciones para seguir una línea negra. ¡La lógica booleana es el cerebro del robot!" },
            { titulo: "3. Tablas de Verdad", tipo: 'texto', puntos: [
                "**Tabla AND:** F∧F=F, F∧V=F, V∧F=F, V∧V=V → solo verdadero si AMBOS lo son.",
                "**Tabla OR:** F∨F=F, F∨V=V, V∨F=V, V∨V=V → falso SOLO si ambos son falsos.",
                "**Tabla NOT:** V→F, F→V → simplemente lo invierte.",
                "**Uso en robots:** SigueLíneas usa AND para intersecciones y OR para detectar curvas."
            ]},
            { titulo: "🎮 Completa la Tabla de Verdad", tipo: 'interactive_challenge', instruccion: "**Reto Lógico:** Completa las tablas en un papel:\n\n**AND (&&):**\nfalse && false = ?\nfalse && true = ?\ntrue && false = ?\ntrue && true = ?\n\n**OR (||):**\nfalse || false = ?\nfalse || true = ?\ntrue || false = ?\ntrue || true = ?\n\n**NOT (!):**\n!true = ?\n!false = ?\n\n¡Tip: AND es estricto (ambos deben ser V), OR es generoso (basta con uno)!", recompensa: "🏅 Insignia: Maestro de Lógica" },
            { titulo: "✅ Quiz: Tablas de Verdad", tipo: 'mini_quiz', pregunta: "Si A = true y B = true, ¿cuánto vale (A AND B) OR (NOT A)?", opciones: ["false", "Error", "true", "Depende de C"], respuestaCorrecta: 2, explicacion: "Paso a paso: A AND B = true AND true = true. NOT A = NOT true = false. Luego: true OR false = true. ¡Cuando hay un true en OR, todo es true! 🧠✅" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Si sensorIzq = true y sensorDer = false, ¿qué resultado da (sensorIzq AND sensorDer)?", opciones: ["true", "Error", "false"], respuestaCorrecta: 2, explicacion: "AND requiere que AMBOS sean verdaderos. Como sensorDer es false, el resultado es false." },
            { titulo: "4. Diagramas de Flujo", tipo: 'texto', puntos: [
                "**Diagrama de Flujo:** Dibujo que muestra los pasos de un algoritmo con flechas y formas.",
                "**Óvalo:** Indica Inicio o Fin del programa.",
                "**Rectángulo:** Una acción o instrucción (avanzar, encender motor).",
                "**Diamante:** Una decisión con dos salidas: Sí / No."
            ]},
            { titulo: "🎯 Actividad: Diagrama del Robot", tipo: 'activity', instruccion: "**Reto:** Dibuja un diagrama de flujo para un robot que: 1) Avanza, 2) Lee sensor, 3) Si distancia < 20cm gira, 4) Si distancia >= 20cm sigue recto, 5) Vuelve al paso 1.", materiales: ["Papel", "Lápices de colores", "Regla"] }
,
            { titulo: "✅ Quiz: Operador AND", tipo: 'mini_quiz', pregunta: "En lógica booleana, ¿cuándo es verdadero A AND B?", opciones: ["Cuando A es verdadero", "Cuando B es verdadero", "Solo cuando AMBOS son verdaderos", "Cuando al menos uno es verdadero"], respuestaCorrecta: 2, explicacion: "AND requiere que AMBAS condiciones sean verdaderas. Si una es falsa, el resultado es falso. ✅ AND ✅ = ✅" },
            { titulo: "✅ Quiz: Operador OR", tipo: 'mini_quiz', pregunta: "En lógica booleana, ¿cuándo es verdadero A OR B?", opciones: ["Solo cuando ambos son verdaderos", "Solo cuando ambos son falsos", "Cuando al menos uno es verdadero", "Nunca"], respuestaCorrecta: 2, explicacion: "OR es verdadero si al menos UNO de los dos es verdadero. Solo es falso cuando ambos son falsos. 🔀" },
            { titulo: "✅ Quiz: Operador NOT", tipo: 'mini_quiz', pregunta: "¿Qué hace el operador NOT?", opciones: ["Suma dos valores", "Invierte el valor: verdadero→falso y falso→verdadero", "Multiplica por cero", "No hace nada"], respuestaCorrecta: 1, explicacion: "NOT invierte: NOT verdadero = falso, NOT falso = verdadero. ¡Es como un espejo lógico! 🪞" },
            { titulo: "✅❌ Lógica: ¿V o F?", tipo: 'true_false', statements: [{ text: 'TRUE AND FALSE resulta en TRUE.', correct: false, explain: 'AND necesita que AMBOS sean TRUE. Si uno es FALSE, el resultado es FALSE.' }, { text: 'TRUE OR FALSE resulta en TRUE.', correct: true, explain: 'OR solo necesita que al menos UNO sea TRUE para dar TRUE.' }] },
            { titulo: "🧩 Operadores Lógicos", tipo: 'matching_game', instruccion: 'Conecta cada operación con su resultado', pairs: [{ left: 'TRUE AND TRUE', right: 'TRUE' }, { left: 'TRUE AND FALSE', right: 'FALSE' }, { left: 'FALSE OR TRUE', right: 'TRUE' }, { left: 'NOT TRUE', right: 'FALSE' }] },
            { titulo: "✅ Quiz: Tablas de Verdad", tipo: 'mini_quiz', pregunta: "¿Cuántas combinaciones posibles hay en una tabla de verdad con 2 variables (A y B)?", opciones: ["2 combinaciones", "4 combinaciones", "8 combinaciones", "16 combinaciones"], respuestaCorrecta: 1, explicacion: "Con 2 variables hay 2² = 4 combinaciones: (F,F), (F,V), (V,F), (V,V). Con 3 variables serían 8. 📊" },
            { titulo: "✅ Quiz: Aplicación en Robots", tipo: 'mini_quiz', pregunta: "Si un robot debe avanzar solo cuando el sensor izquierdo Y el derecho NO detectan obstáculo, ¿qué operador usas?", opciones: ["OR", "NOT", "AND", "XOR"], respuestaCorrecta: 2, explicacion: "Usas AND: ambos sensores deben indicar camino libre para avanzar de forma segura. 🤖" },
            { titulo: "✅ Quiz: Tipos de Datos C++", tipo: 'mini_quiz', pregunta: "¿Qué tipo de dato usarías para almacenar la distancia de un sensor (con decimales)?", opciones: ["int", "float (número con punto decimal)", "bool", "char"], respuestaCorrecta: 1, explicacion: "float almacena decimales: float distancia = 15.7; int solo enteros. Para sensores con precisión decimal, usa float. 📏" },
            { titulo: "✅ Quiz: Funciones C++", tipo: 'mini_quiz', pregunta: "¿Por qué es bueno usar funciones en tu código de robot?", opciones: ["Para que sea más largo", "Para organizar, reutilizar código y hacer debugging más fácil", "No es necesario", "Solo para que compile"], respuestaCorrecta: 1, explicacion: "Las funciones dividen el código en bloques lógicos: moverAdelante(), leerSensor(), girar(). Más organizado, menos bugs. 🧩" },
        ]
    },
    { 
        id: 'mod_python', 
        titulo: "Práctica 1: Enciende tu Primer LED 💡", 
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
            { titulo: "✅ Quiz: ¿Por qué la Resistencia?", tipo: 'mini_quiz', pregunta: "¿Qué pasa si conectas un LED directamente a una pila de 9V SIN resistencia?", opciones: ["El LED brilla más fuerte y dura más", "No pasa nada, funciona igual", "La pila se descarga más lento", "El LED se quema por exceso de corriente"], respuestaCorrecta: 3, explicacion: "¡Correcto! Sin resistencia, pasa demasiada corriente por el LED y se quema en segundos. La resistencia es como un cinturón de seguridad: ¡protege al LED! 🔥❌➡️🛡️✅" },
            { titulo: "🎮 Reto: Calcula tu Resistencia", tipo: 'interactive_challenge', instruccion: "**Reto Matemático:** Usa la fórmula R = (Vfuente - VLED) ÷ ILED para calcular:\n\n1. Pila 9V, LED rojo (2V), corriente 20mA:\n   R = (9 - 2) ÷ 0.02 = ?\n\n2. Arduino 5V, LED azul (3.2V), corriente 20mA:\n   R = (5 - 3.2) ÷ 0.02 = ?\n\n3. Pila 3V (2xAA), LED verde (2.1V), corriente 15mA:\n   R = (3 - 2.1) ÷ 0.015 = ?\n\n¡Respuestas: 350Ω (usa 330Ω), 90Ω (usa 100Ω), 60Ω (usa 68Ω)!", recompensa: "🏅 Insignia: Calculador de Circuitos" },
            { titulo: "Fórmula: Calcular Resistencia", tipo: 'formula', texto: "Para saber qué resistencia necesitas:", formula: "R = (V<sub>fuente</sub> - V<sub>LED</sub>) ÷ I<sub>LED</sub>", explicacion: "Con pila de 9V, LED rojo (2V), corriente 20mA: R = (9-2) ÷ 0.02 = 350Ω. Usamos 330Ω o 470Ω." },
            { titulo: "💡 Tip de Seguridad", tipo: 'tip', texto: "**NUNCA conectes un LED directamente a una pila sin resistencia.** El LED se quemará en segundos. Piensa en la resistencia como un cinturón de seguridad. 🔒" }
,
            { titulo: "✅ Quiz: Componentes LED", tipo: 'mini_quiz', pregunta: "¿Por qué necesitas una resistencia al conectar un LED?", opciones: ["Para que brille más", "Para limitar la corriente y no quemar el LED", "Para que cambie de color", "No se necesita resistencia"], respuestaCorrecta: 1, explicacion: "Sin resistencia, demasiada corriente pasa por el LED y se quema. La resistencia limita el flujo. ¡Protege tus LEDs! 💡" },
            { titulo: "✅ Quiz: Polaridad del LED", tipo: 'mini_quiz', pregunta: "¿Cómo identificas la pata positiva (ánodo) de un LED?", opciones: ["Es la pata más corta", "Es la pata más larga", "Ambas son iguales", "No tiene polaridad"], respuestaCorrecta: 1, explicacion: "La pata más LARGA es el ánodo (+) y la más corta es el cátodo (-). ¡Si lo conectas al revés no enciende! 💡" },
            { titulo: "✅ Quiz: Resistencias", tipo: 'mini_quiz', pregunta: "¿De cuántos ohmios debería ser la resistencia típica para un LED con Arduino (5V)?", opciones: ["1Ω", "220Ω", "1,000,000Ω", "0Ω (sin resistencia)"], respuestaCorrecta: 1, explicacion: "220Ω es el valor estándar para LEDs con 5V. Limita la corriente a ~15mA, seguro para el LED. 🔧" },
            { titulo: "✅❌ Circuitos LED: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un LED funciona igual sin importar la dirección en que se conecte.', correct: false, explain: 'El LED tiene polaridad: ánodo (+) y cátodo (-). Conectado al revés no enciende.' }, { text: 'Una protoboard/breadboard permite armar circuitos sin soldar.', correct: true, explain: 'Las protoboards tienen conexiones internas que permiten insertar componentes sin soldadura.' }] },
            { titulo: "🧩 Circuito LED", tipo: 'matching_game', instruccion: 'Conecta cada componente con su rol en el circuito LED', pairs: [{ left: '🔋 Batería/Arduino', right: 'Fuente de energía' }, { left: '🔌 Resistencia 220Ω', right: 'Limita la corriente' }, { left: '💡 LED', right: 'Emite luz' }, { left: '🔗 Cables', right: 'Conectan componentes' }] },
            { titulo: "✅ Quiz: Protoboard", tipo: 'mini_quiz', pregunta: "¿Cómo están conectadas internamente las filas de una protoboard?", opciones: ["Todas las filas están conectadas entre sí", "Cada fila de 5 huecos está conectada horizontalmente", "No hay conexión interna", "Solo los bordes están conectados"], respuestaCorrecta: 1, explicacion: "¡Cada fila de 5 huecos está conectada por dentro! Por eso puedes insertar componentes en la misma fila para conectarlos. 🔌" },
            { titulo: "✅ Quiz: Colores LED", tipo: 'mini_quiz', pregunta: "¿Qué determina el color de un LED?", opciones: ["El voltaje de la batería", "El material semiconductor del LED", "La resistencia que uses", "La velocidad de la corriente"], respuestaCorrecta: 1, explicacion: "El color depende del material semiconductor: GaAs = rojo, GaN = azul/verde, InGaN = blanco. 🌈" },
            { titulo: "✅ Quiz: Circuito Serie", tipo: 'mini_quiz', pregunta: "En un circuito en serie con 2 LEDs, si uno se quema, ¿qué pasa con el otro?", opciones: ["Brilla más fuerte", "También se apaga", "No le afecta", "Cambia de color"], respuestaCorrecta: 1, explicacion: "En serie, la corriente pasa por todos. Si uno se corta, se rompe el circuito y todos se apagan. 🔗" },
            { titulo: "✅ Quiz: Plaqueta Arduino", tipo: 'mini_quiz', pregunta: "¿Qué pin del Arduino usarías para alimentar un LED con 5 voltios?", opciones: ["GND", "A0", "5V", "RESET"], respuestaCorrecta: 2, explicacion: "El pin 5V proporciona 5 voltios de salida. GND es tierra (negativo). Necesitas ambos para un circuito completo. ⚡" },
            { titulo: "✅ Quiz: Python vs C++", tipo: 'mini_quiz', pregunta: "¿Cuál es la ventaja principal de Python sobre C++ para robótica?", opciones: ["Es más rápido", "Sintaxis más simple y más librerías de IA/visión artificial", "Funciona sin Internet", "No tiene ventajas"], respuestaCorrecta: 1, explicacion: "Python es más fácil de aprender y tiene librerías poderosas: OpenCV (visión), TensorFlow (IA), ROS. Ideal para robots avanzados. 🐍" },
            { titulo: "✅ Quiz: Listas Python", tipo: 'mini_quiz', pregunta: "¿Qué es una lista en Python y para qué sirve en robótica?", opciones: ["Un documento de texto", "Una colección ordenada de datos: sensores = [15, 20, 30]", "Un tipo de motor", "Una función especial"], respuestaCorrecta: 1, explicacion: "Las listas almacenan múltiples datos: lecturas de sensores, rutas, comandos. lecturas = [10, 15, 12] guarda 3 distancias. 📋" },
        ]
    },
    { 
        id: 'mod_robotica', 
        titulo: "Práctica 2: LED con Arduino 🔌", 
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
            { titulo: "🎮 Reto: Código Morse con LED", tipo: 'interactive_challenge', instruccion: "**Reto Creativo:** Programa tu LED para enviar mensajes en código Morse:\n\n• Punto (.) = LED encendido 200ms\n• Raya (-) = LED encendido 600ms\n• Espacio entre letras = 400ms apagado\n• Espacio entre palabras = 800ms apagado\n\n**Letras básicas:**\nS = • • • (punto punto punto)\nO = — — — (raya raya raya)\nS.O.S = • • • — — — • • •\n\n¡Programa S.O.S y muéstraselo a tu familia!", recompensa: "🏅 Insignia: Comunicador Morse" },
            { titulo: "💡 LED Fade (Efecto Respiración)", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// LED que respira suavemente\nint brillo = 0;\nint paso = 5;\n\nvoid setup() {\n  pinMode(9, OUTPUT);\n}\n\nvoid loop() {\n  analogWrite(9, brillo);\n  brillo = brillo + paso;\n  \n  if (brillo <= 0 || brillo >= 255) {\n    paso = -paso;  // Invertir\n  }\n  delay(30);\n}", explicacion: "analogWrite envía un valor de 0 (apagado) a 255 (máximo brillo). Al incrementar y decrementar, el LED sube y baja suavemente." },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "¿Qué función de Arduino usas para controlar el BRILLO del LED (no solo encender/apagar)?", opciones: ["digitalWrite()", "analogWrite()", "analogRead()"], respuestaCorrecta: 1, explicacion: "analogWrite() envía un valor PWM (0-255). digitalWrite solo puede hacer HIGH o LOW (encendido/apagado total)." },
            { titulo: "3. Solución de Problemas", tipo: 'texto', puntos: [
                "**LED no enciende:** Verifica orientación (pata larga al pin, corta a GND).",
                "**Error al compilar:** Revisa punto y coma (;), llaves {} y paréntesis ().",
                "**Arduino no responde:** Verifica placa y puerto en menú Herramientas.",
                "**Usa Serial.println():** Imprime mensajes para saber qué hace tu código."
            ]},
            { titulo: "✅ Quiz: Troubleshooting", tipo: 'mini_quiz', pregunta: "Tu LED no enciende con Arduino. ¿Cuál es lo PRIMERO que debes verificar?", opciones: ["Si la computadora tiene internet", "Si la mesa está nivelada", "La orientación del LED (pata larga al pin, corta a GND)", "El color del cable"], respuestaCorrecta: 2, explicacion: "¡Correcto! Lo más común es que el LED esté invertido. La pata larga (+) va al pin de salida y la corta (-) a GND. ¡Si está al revés, no enciende pero no se daña! 💡🔄" },
        
            { titulo: "✅ Quiz: Blink", tipo: 'mini_quiz', pregunta: "¿Qué hace el programa Blink en Arduino?", opciones: ["Lee un sensor", "Enciende y apaga un LED repetidamente", "Controla un motor", "Se conecta a internet"], respuestaCorrecta: 1, explicacion: "Blink es el 'Hola Mundo' de Arduino: enciende el LED, espera, lo apaga, espera, y repite. 💡" },
            { titulo: "✅ Quiz: LED Integrado", tipo: 'mini_quiz', pregunta: "¿En qué pin está el LED integrado del Arduino UNO?", opciones: ["Pin 1", "Pin 7", "Pin 13", "Pin A0"], respuestaCorrecta: 2, explicacion: "El LED integrado (built-in LED) está conectado al pin 13. ¡Puedes probarlo sin conectar nada externo! 💡" },
            { titulo: "✅ Quiz: Frecuencia de Parpadeo", tipo: 'mini_quiz', pregunta: "Si usas delay(500), ¿cuántas veces parpadea el LED por segundo?", opciones: ["Una vez por segundo", "Dos veces por segundo", "Cinco veces por segundo", "Diez veces por segundo"], respuestaCorrecta: 0, explicacion: "delay(500) = 500ms encendido + 500ms apagado = 1 ciclo por segundo. ¡Cambiando el delay cambias la velocidad! ⏱️" },
            { titulo: "✅❌ LED Arduino: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Para hacer parpadear un LED necesitas usar digitalWrite y delay.', correct: true, explain: 'digitalWrite enciende/apaga el LED, delay controla cuánto tiempo queda en cada estado.' }, { text: 'El Arduino puede encender LEDs de cualquier color sin componentes externos.', correct: false, explain: 'El LED integrado es solo uno. Para otros colores necesitas LEDs externos.' }] },
            { titulo: "🧩 Funciones del Programa Blink", tipo: 'matching_game', instruccion: 'Conecta cada línea de código con lo que hace', pairs: [{ left: 'pinMode(13, OUTPUT)', right: 'Configura pin como salida' }, { left: 'digitalWrite(13, HIGH)', right: 'Enciende el LED' }, { left: 'digitalWrite(13, LOW)', right: 'Apaga el LED' }, { left: 'delay(1000)', right: 'Espera 1 segundo' }] },
            { titulo: "✅ Quiz: PWM", tipo: 'mini_quiz', pregunta: "¿Qué función de Arduino permite controlar el BRILLO de un LED (no solo encender/apagar)?", opciones: ["digitalRead()", "analogWrite()", "Serial.print()", "pinMode()"], respuestaCorrecta: 1, explicacion: "analogWrite() envía señales PWM (0-255) que permiten variar el brillo del LED. 255 = máximo brillo, 0 = apagado. 🌟" },
            { titulo: "✅ Quiz: Múltiples LEDs", tipo: 'mini_quiz', pregunta: "Si quieres controlar 3 LEDs independientemente, ¿cuántos pines digitales necesitas?", opciones: ["1 pin", "2 pines", "3 pines", "6 pines"], respuestaCorrecta: 2, explicacion: "¡Un pin por cada LED! Cada pin controla un LED de forma independiente. 3 LEDs = 3 pines. 🔌" },
            { titulo: "✅ Quiz: Secuencia de LEDs", tipo: 'mini_quiz', pregunta: "Para hacer un efecto de 'luces de navidad' con 5 LEDs que se encienden en secuencia, ¿qué estructura de código usarías?", opciones: ["Solo if/else", "Un ciclo for con delay", "Solo delay", "analogRead"], respuestaCorrecta: 1, explicacion: "Un ciclo for recorre cada LED en orden, encendiéndolo y apagándolo con delay para crear la secuencia. 🎄" },
            { titulo: "✅ Quiz: Lazo de Control", tipo: 'mini_quiz', pregunta: "¿Qué es el lazo de control Sentir-Pensar-Actuar en robótica?", opciones: ["Un tipo de cable", "El ciclo donde el robot lee sensores, procesa datos y ejecuta acciones", "Un lenguaje de programación", "Una marca de robot"], respuestaCorrecta: 1, explicacion: "Sentir (sensores) → Pensar (microcontrolador decide) → Actuar (motores ejecutan). Este ciclo se repite miles de veces por segundo. 🔄" },
            { titulo: "✅ Quiz: Robot Reactivo", tipo: 'mini_quiz', pregunta: "¿Qué es un robot reactivo?", opciones: ["Un robot que se enoja", "Un robot que responde directamente a estímulos del entorno sin planificar", "Un robot que no se mueve", "Un robot que usa IA avanzada"], respuestaCorrecta: 1, explicacion: "Un robot reactivo actúa instantáneamente: 've' obstáculo → gira. No planifica rutas. Simple pero efectivo para evasión básica. 🏎️" },
        ]
    },
    { 
        id: 'mod_componentes', 
        titulo: "Práctica 3: Motor con Arduino ⚡", 
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
            { titulo: "✅ Quiz: Control de Motor", tipo: 'mini_quiz', pregunta: "Para que un robot gire SOBRE SU EJE (como un trompo), ¿qué deben hacer los motores?", opciones: ["Ambos motores adelante", "Ambos motores detenidos", "Un motor rápido y otro lento", "Un motor adelante y el otro atrás"], respuestaCorrecta: 3, explicacion: "¡Correcto! Cuando un motor va hacia adelante y el otro hacia atrás, el robot gira sobre su propio eje. ¡Si ambos van iguales, avanza recto! 🔄🤖" },
            { titulo: "✅ Quiz: Velocidad PWM", tipo: 'mini_quiz', pregunta: "Si pones analogWrite(ENA, 127), ¿a qué porcentaje de velocidad va el motor?", opciones: ["100% (máxima velocidad)", "0% (detenido)", "Aproximadamente 50%", "127% (velocidad extra)"], respuestaCorrecta: 2, explicacion: "¡Correcto! El rango PWM es 0-255. 127 es aproximadamente la mitad (127÷255 ≈ 50%). Con 255 va al máximo y con 0 está detenido. ⚡50%" },
            { titulo: "🎯 Actividad: Coreografía Robot", tipo: 'activity', instruccion: "**Reto Divertido:** Programa una 'coreografía' para tu robot: adelante, gira derecha, adelante, gira izquierda, retrocede, gira en círculo. ¡Ponle música!", materiales: ["Robot con Arduino + L298N", "2 motores con ruedas", "Pila 9V"] }
,
            { titulo: "✅ Quiz: Driver de Motor", tipo: 'mini_quiz', pregunta: "¿Por qué no puedes conectar un motor DC directamente a un pin del Arduino?", opciones: ["El motor es muy pequeño", "El pin no puede dar suficiente corriente para el motor", "El Arduino no tiene pines", "Los motores no usan electricidad"], respuestaCorrecta: 1, explicacion: "Los pines del Arduino dan máximo ~40mA, pero un motor necesita 200-700mA. ¡Necesitas un driver como el L298N! ⚡" },
            { titulo: "✅ Quiz: L298N", tipo: 'mini_quiz', pregunta: "¿Cuántos motores DC puede controlar simultáneamente el driver L298N?", opciones: ["1 motor", "2 motores", "4 motores", "6 motores"], respuestaCorrecta: 1, explicacion: "El L298N tiene 2 canales (puentes H), cada uno controla 1 motor DC. ¡Perfecto para un robot con 2 ruedas! 🤖" },
            { titulo: "✅ Quiz: Dirección del Motor", tipo: 'mini_quiz', pregunta: "¿Cómo cambias la dirección de giro de un motor DC con el L298N?", opciones: ["Cambias la velocidad", "Inviertes las señales IN1 e IN2", "Desconectas el Arduino", "No se puede cambiar"], respuestaCorrecta: 1, explicacion: "Si IN1=HIGH, IN2=LOW gira en un sentido. IN1=LOW, IN2=HIGH gira al contrario. ¡Así tu robot va adelante y atrás! 🔄" },
            { titulo: "✅❌ Motores: ¿V o F?", tipo: 'true_false', statements: [{ text: 'La velocidad de un motor DC se puede controlar con PWM (analogWrite).', correct: true, explain: 'PWM varía el voltaje promedio: 0=parado, 127=medio, 255=máxima velocidad.' }, { text: 'Un motor DC y un servo motor funcionan exactamente igual.', correct: false, explain: 'El motor DC gira continuamente, el servo se mueve a un ángulo específico (0°-180°).' }] },
            { titulo: "🧩 Control de Motores", tipo: 'matching_game', instruccion: 'Conecta cada señal con su efecto', pairs: [{ left: 'IN1=HIGH, IN2=LOW', right: 'Gira en sentido horario' }, { left: 'IN1=LOW, IN2=HIGH', right: 'Gira en sentido antihorario' }, { left: 'IN1=LOW, IN2=LOW', right: 'Motor detenido' }, { left: 'ENA con PWM', right: 'Controla la velocidad' }] },
            { titulo: "✅ Quiz: Alimentación", tipo: 'mini_quiz', pregunta: "¿Por qué el L298N necesita una fuente de alimentación SEPARADA del Arduino?", opciones: ["Por estética", "Los motores necesitan más corriente de la que el USB puede dar", "Para que sea más caro", "No necesita fuente separada"], respuestaCorrecta: 1, explicacion: "Los motores consumen mucha corriente (0.5-2A). El USB solo da 500mA. Una fuente separada (baterías) alimenta los motores sin sobrecargar el Arduino. 🔋" },
            { titulo: "✅ Quiz: Puente H", tipo: 'mini_quiz', pregunta: "¿Qué es un 'Puente H' en el contexto de motores?", opciones: ["Un puente físico sobre un río", "Un circuito que permite invertir la polaridad del motor", "Un tipo de engranaje", "Un sensor de posición"], respuestaCorrecta: 1, explicacion: "El Puente H es un circuito con 4 transistores que permite cambiar la dirección de la corriente al motor, invirtiendo su giro. 🔀" },
            { titulo: "✅ Quiz: Servo vs DC", tipo: 'mini_quiz', pregunta: "¿Qué motor usarías para las RUEDAS de un robot móvil?", opciones: ["Servo Motor (ángulo fijo)", "Motor Paso a Paso (muy lento)", "Motor DC (giro continuo)", "Motor de lavadora"], respuestaCorrecta: 2, explicacion: "¡Motor DC! Gira continuamente a buena velocidad, perfecto para ruedas. El servo es mejor para brazos y garras. 🛞" },
            { titulo: "✅ Quiz: Multímetro", tipo: 'mini_quiz', pregunta: "¿Qué mide un multímetro en modo 'continuidad'?", opciones: ["La temperatura", "Si hay conexión eléctrica entre dos puntos (suena si hay contacto)", "La velocidad", "La presión"], respuestaCorrecta: 1, explicacion: "El modo continuidad verifica si dos puntos están conectados eléctricamente. Suena = hay conexión. Esencial para debug de circuitos. 🔊" },
            { titulo: "✅ Quiz: Componentes SMD", tipo: 'mini_quiz', pregunta: "¿Qué son los componentes SMD?", opciones: ["Componentes muy grandes", "Componentes de Montaje Superficial, más pequeños que los tradicionales", "Cables especiales", "Tipo de sensor"], respuestaCorrecta: 1, explicacion: "SMD = Surface Mount Device. Son componentes miniaturizados que se sueldan directamente a la superficie de la PCB. ¡Más pequeños! 🔬" },
        ]
    },
    { 
        id: 'mod_control', 
        titulo: "Módulo 10: Lógica y Control 🎛️", 
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
            { titulo: "🎮 Identifica el Tipo de Control", tipo: 'interactive_challenge', instruccion: "**Reto de Análisis:** Clasifica cada ejemplo como Lazo ABIERTO o CERRADO:\n\n1. Lavadora con temporizador fijo → ¿?\n2. Aire acondicionado que mide la temperatura → ¿?\n3. Horno con timer de 30 minutos → ¿?\n4. Robot siguelíneas con sensor infrarrojo → ¿?\n5. Riego automático que mide humedad del suelo → ¿?\n\n¡Pista: Si MIDE algo y AJUSTA = cerrado. Si solo ejecuta un tiempo fijo = abierto!\n\nRespuestas: 1-Abierto, 2-Cerrado, 3-Abierto, 4-Cerrado, 5-Cerrado", recompensa: "🏅 Insignia: Analista de Control" },
            { titulo: "✅ Quiz: Lazo Cerrado", tipo: 'mini_quiz', pregunta: "El cruise control de un auto mide la velocidad actual y ajusta el motor. ¿Qué tipo de control es?", opciones: ["Sin control", "Lazo cerrado (mide y ajusta)", "Control manual", "Lazo abierto (no mide nada)"], respuestaCorrecta: 1, explicacion: "¡Correcto! El cruise control es lazo cerrado perfecto: mide la velocidad REAL, compara con la que quieres, y ajusta el motor para mantenerla. ¡Feedback constante! 🚗📊" },
            { titulo: "💡 Control Proporcional: Siguelíneas", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Robot siguelíneas con control proporcional\nint setpoint = 512;\n\nvoid loop() {\n  int lectura = analogRead(A0);\n  int error = setpoint - lectura;\n  \n  float Kp = 0.5;\n  int correccion = Kp * error;\n  \n  int velIzq = 150 + correccion;\n  int velDer = 150 - correccion;\n  \n  velIzq = constrain(velIzq, 0, 255);\n  velDer = constrain(velDer, 0, 255);\n  \n  moverMotores(velIzq, velDer);\n  delay(10);\n}", explicacion: "El sensor lee la posición, calcula el error, y aplica corrección proporcional a los motores. ¡El robot se autocorrige!" },
            { titulo: "3. Control PID", tipo: 'texto', puntos: [
                "**P (Proporcional):** Corrección proporcional al error. Error grande = corrección grande.",
                "**I (Integral):** Acumula errores pasados. Corrige errores pequeños persistentes.",
                "**D (Derivativo):** Predice el error futuro. Evita oscilaciones.",
                "**Aplicación:** Robot siguelíneas usa PID para seguir suavemente sin zigzaguear."
            ]},
            { titulo: "✅ Quiz: PID", tipo: 'mini_quiz', pregunta: "Si tu robot siguelíneas zigzaguea mucho, ¿qué componente del PID ayuda a suavizar el movimiento?", opciones: ["P (Proporcional) - solo corrige el error actual", "I (Integral) - acumula errores pasados", "Ninguno, el zigzag es normal", "D (Derivativo) - predice y suaviza el movimiento"], respuestaCorrecta: 3, explicacion: "¡Correcto! La componente D (derivativa) mide qué tan rápido cambia el error y aplica un 'freno' para evitar que el robot se pase de la línea. ¡Es como anticipar una curva al conducir! 🏎️📐" },
            { titulo: "✅ Mini-Quiz Rápido", tipo: 'mini_quiz', pregunta: "Un tostador con temporizador fijo (sin medir si el pan está tostado) es un ejemplo de:", opciones: ["Control de Lazo Cerrado", "Control de Lazo Abierto", "Control PID"], respuestaCorrecta: 1, explicacion: "Es lazo abierto porque no mide el resultado. Un lazo cerrado mediría el color del pan y ajustaría." },
            { titulo: "Fórmula PID", tipo: 'formula', texto: "La ecuación del controlador PID:", formula: "Salida = Kp·e(t) + Ki·∫e(t)dt + Kd·de(t)/dt", explicacion: "e(t) = error (deseado - real). Kp, Ki, Kd son constantes que ajustas." }
,
            { titulo: "✅ Quiz: Lazo Abierto vs Cerrado", tipo: 'mini_quiz', pregunta: "¿Cuál es la diferencia principal entre un sistema de lazo abierto y uno de lazo cerrado?", opciones: ["El lazo abierto es más caro", "El lazo cerrado usa retroalimentación (sensores) para corregirse", "No hay diferencia", "El lazo abierto es más preciso"], respuestaCorrecta: 1, explicacion: "El lazo cerrado usa sensores para medir el resultado y corregir errores. ¡Como un termostato que mide la temperatura! 🌡️" },
            { titulo: "✅ Quiz: PID", tipo: 'mini_quiz', pregunta: "¿Qué significan las letras P, I, D en un controlador PID?", opciones: ["Potencia, Intensidad, Dirección", "Proporcional, Integral, Derivativo", "Programar, Instalar, Depurar", "Positivo, Inverso, Digital"], respuestaCorrecta: 1, explicacion: "P=Proporcional (error actual), I=Integral (errores pasados acumulados), D=Derivativo (predicción del futuro). 🎯" },
            { titulo: "✅ Quiz: Retroalimentación", tipo: 'mini_quiz', pregunta: "Un robot siguelíneas que usa sensores IR para ajustar su dirección es un ejemplo de:", opciones: ["Sistema de lazo abierto", "Sistema de lazo cerrado", "Sistema sin control", "Sistema manual"], respuestaCorrecta: 1, explicacion: "¡Lazo cerrado! El sensor detecta la línea, el cerebro decide, y los motores corrigen. Hay retroalimentación constante. 🔄" },
            { titulo: "✅❌ Control: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un tostador con temporizador es un ejemplo de control de lazo abierto.', correct: true, explain: 'Solo usa tiempo, no mide si el pan está tostado. No tiene retroalimentación.' }, { text: 'El controlador PID solo se usa en robots industriales grandes.', correct: false, explain: 'Se usa en drones, robots pequeños, impresoras 3D, y muchos proyectos con Arduino.' }] },
            { titulo: "🧩 Tipos de Control", tipo: 'matching_game', instruccion: 'Conecta cada sistema con su tipo de control', pairs: [{ left: '⏲️ Tostador con timer', right: 'Lazo abierto' }, { left: '🌡️ Termostato de casa', right: 'Lazo cerrado' }, { left: '🚗 Cruise control', right: 'Lazo cerrado' }, { left: '💡 Interruptor de luz', right: 'Lazo abierto' }] },
            { titulo: "✅ Quiz: Señal de Error", tipo: 'mini_quiz', pregunta: "En un sistema de control, ¿qué es la 'señal de error'?", opciones: ["Un mensaje de error en el código", "La diferencia entre el valor deseado y el valor actual", "Un sonido de alarma", "Un fallo del sistema"], respuestaCorrecta: 1, explicacion: "Error = Setpoint - Valor actual. Si quieres 25°C y tienes 23°C, el error es 2°C. ¡El controlador intenta reducirlo a 0! 🎯" },
            { titulo: "✅ Quiz: Control en la Vida Real", tipo: 'mini_quiz', pregunta: "¿Cuál de estos es un ejemplo de control de lazo cerrado en tu vida diaria?", opciones: ["Encender una lámpara", "Un aire acondicionado con termostato", "Abrir una llave de agua", "Prender un ventilador"], respuestaCorrecta: 1, explicacion: "¡El aire acondicionado con termostato! Mide la temperatura, la compara con la deseada y ajusta. ¡Es retroalimentación! ❄️" },
            { titulo: "✅ Quiz: Control PID", tipo: 'mini_quiz', pregunta: "¿Qué significan las letras P, I y D en control PID?", opciones: ["Presión, Intensidad, Distancia", "Proporcional, Integral, Derivativo", "Potencia, Impulso, Dirección", "Programa, Inicio, Destino"], respuestaCorrecta: 1, explicacion: "P = error actual, I = acumulación de errores pasados, D = predicción del error futuro. Juntos logran control suave y preciso. 🎯" },
            { titulo: "✅ Quiz: PWM Control", tipo: 'mini_quiz', pregunta: "¿Qué rango de valores acepta analogWrite() en Arduino?", opciones: ["0-1", "0-255 (8 bits de resolución PWM)", "0-1023", "0-100"], respuestaCorrecta: 1, explicacion: "analogWrite(pin, 0-255). 0 = apagado, 127 = 50%, 255 = máximo. Con 8 bits tienes 256 niveles de velocidad de motor. 📊" },
        ]
    },
    { 
        id: 'mod_prog_avanzada', 
        titulo: "Módulo 11: Programación Avanzada 🚀", 
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
            { titulo: "✅ Quiz: Librerías", tipo: 'mini_quiz', pregunta: "Quieres mover un servo motor a exactamente 90 grados. ¿Qué librería y función usas?", opciones: ["Wire.h con Wire.begin(90)", "Servo.h con miServo.write(90)", "NewPing.h con ping(90)", "Serial.h con print(90)"], respuestaCorrecta: 1, explicacion: "¡Correcto! La librería Servo.h te da la función write() que mueve el servo al ángulo exacto. ¡Es un superpoder pre-programado! #include <Servo.h> 🦾" },
            { titulo: "3. Comunicación Inalámbrica", tipo: 'texto', puntos: [
                "**Bluetooth (HC-05):** Módulo para controlar Arduino desde el celular.",
                "**WiFi (ESP32):** Conecta tu robot a internet. Control desde cualquier lugar.",
                "**Protocolo:** Reglas para datos. 'A' = adelante, 'S' = parar.",
                "**Serial.read():** Lee datos de la PC o del Bluetooth."
            ]},
            { titulo: "🎮 Diseña tu Protocolo de Control", tipo: 'interactive_challenge', instruccion: "**Reto Creativo:** Diseña tu propio protocolo de comunicación para controlar un robot por Bluetooth:\n\n1. Elige una letra para cada acción:\n   - Avanzar = ?\n   - Retroceder = ?\n   - Girar izquierda = ?\n   - Girar derecha = ?\n   - Parar = ?\n   - Bocina = ?\n   - Luces ON/OFF = ?\n\n2. Escribe el código switch/case que procesaría cada comando\n3. ¿Qué pasaría si envías un comando que NO has definido? (pista: usa 'default:')\n\n¡Piensa en comandos fáciles de recordar!", recompensa: "🏅 Insignia: Diseñador de Protocolos" },
            { titulo: "✅ Quiz: Bluetooth", tipo: 'mini_quiz', pregunta: "Si envías la letra 'F' por Bluetooth y el Arduino ejecuta adelante(), ¿qué función leyó el dato?", opciones: ["digitalWrite()", "analogRead()", "Serial.read()", "Serial.println()"], respuestaCorrecta: 2, explicacion: "¡Correcto! Serial.read() lee un byte (un carácter) del puerto serial. El módulo Bluetooth (HC-05) envía datos por serial, así que Serial.read() captura el comando. 📡📨" },
            { titulo: "💡 Control Bluetooth", tipo: 'code_example', lenguaje: 'Arduino', codigo: "// Control robot por Bluetooth\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  if (Serial.available()) {\n    char comando = Serial.read();\n    \n    switch(comando) {\n      case 'F': adelante(200);  break;\n      case 'B': atras(200);    break;\n      case 'L': girarIzq(150); break;\n      case 'R': girarDer(150); break;\n      case 'S': detener();     break;\n    }\n  }\n}", explicacion: "El módulo Bluetooth recibe letras y el switch ejecuta la acción. ¡Usa apps como 'Arduino Bluetooth Controller'!" },
            { titulo: "4. Buenas Prácticas", tipo: 'texto', puntos: [
                "**Comentarios:** Usa `//` para explicar código. Tu yo del futuro te lo agradecerá.",
                "**Nombres Claros:** `velocidadMotor` es mejor que `vm` o `x`.",
                "**Modularidad:** Divide en funciones pequeñas. Más fácil encontrar errores.",
                "**Prueba por partes:** Verifica cada componente antes de juntar todo."
            ]},
            { titulo: "💡 Tip de Programador", tipo: 'tip', texto: "**El 90% de programar es leer código, solo el 10% es escribirlo.** Un buen programador escribe código que otros puedan entender fácilmente. ¡Los comentarios valen oro! 📖✨" }
,
            { titulo: "✅ Quiz: Arrays", tipo: 'mini_quiz', pregunta: "¿Qué es un array (arreglo) en programación?", opciones: ["Un tipo de motor", "Una colección ordenada de datos del mismo tipo", "Un sensor especial", "Un error de código"], respuestaCorrecta: 1, explicacion: "Un array guarda múltiples valores bajo un solo nombre: int leds[] = {2, 3, 4, 5}. ¡Perfecto para controlar varios pines! 📊" },
            { titulo: "✅ Quiz: Librerías", tipo: 'mini_quiz', pregunta: "¿Qué es una librería en Arduino?", opciones: ["Un lugar con libros", "Código pre-escrito que puedes reutilizar para tareas comunes", "Un tipo de cable", "Un sensor de lectura"], respuestaCorrecta: 1, explicacion: "Las librerías son código listo para usar: Servo.h para servos, NewPing.h para ultrasónico, etc. ¡No reinventes la rueda! 📚" },
            { titulo: "✅ Quiz: Bluetooth", tipo: 'mini_quiz', pregunta: "¿Qué módulo se usa comúnmente para agregar Bluetooth a un Arduino?", opciones: ["WiFi Shield", "HC-05/HC-06", "GPS NEO-6M", "Sensor DHT11"], respuestaCorrecta: 1, explicacion: "El HC-05 y HC-06 son módulos Bluetooth económicos que se comunican por serial con el Arduino. ¡Control desde el celular! 📱" },
            { titulo: "✅❌ Programación Avanzada: ¿V o F?", tipo: 'true_false', statements: [{ text: 'Un array puede almacenar múltiples valores bajo un solo nombre.', correct: true, explain: 'Ejemplo: int sensores[3] = {100, 200, 300}. Tres valores en una sola variable.' }, { text: 'Las funciones en Arduino solo pueden retornar números enteros.', correct: false, explain: 'Pueden retornar int, float, bool, String, char, o void (nada).' }] },
            { titulo: "🧩 Comunicación Inalámbrica", tipo: 'matching_game', instruccion: 'Conecta cada módulo con su tecnología', pairs: [{ left: 'HC-05', right: 'Bluetooth' }, { left: 'ESP8266', right: 'WiFi' }, { left: 'nRF24L01', right: 'Radio 2.4GHz' }, { left: 'NEO-6M', right: 'GPS/Satélite' }] },
            { titulo: "✅ Quiz: Funciones Personalizadas", tipo: 'mini_quiz', pregunta: "¿Por qué es buena práctica crear funciones personalizadas en tu código?", opciones: ["Para que el código sea más largo", "Para organizar y reutilizar bloques de código", "Para que sea más difícil de leer", "No es buena práctica"], respuestaCorrecta: 1, explicacion: "Las funciones hacen tu código organizado, legible y reutilizable. Ejemplo: moverAdelante(), girarDerecha(). 📋" },
            { titulo: "✅ Quiz: Comunicación Serial", tipo: 'mini_quiz', pregunta: "¿Qué función usas para enviar datos desde Arduino al computador?", opciones: ["analogWrite()", "digitalRead()", "Serial.println()", "pinMode()"], respuestaCorrecta: 2, explicacion: "Serial.println() envía datos al Monitor Serial del IDE de Arduino. ¡Perfecto para depurar y ver valores de sensores! 📟" },
            { titulo: "✅ Quiz: Índices de Array", tipo: 'mini_quiz', pregunta: "En un array de 5 elementos, ¿cuál es el índice del PRIMER elemento?", opciones: ["1", "0", "5", "-1"], respuestaCorrecta: 1, explicacion: "¡Los arrays empiezan en 0! El primer elemento es [0], el segundo [1], etc. Es uno de los conceptos más importantes en programación. 🔢" },
            { titulo: "✅ Quiz: Interrupciones", tipo: 'mini_quiz', pregunta: "¿Qué es una interrupción (interrupt) en Arduino?", opciones: ["Un error del programa", "Una señal que pausa el programa principal para ejecutar código urgente", "Un tipo de delay", "Un comentario en el código"], respuestaCorrecta: 1, explicacion: "Las interrupciones pausan loop() cuando ocurre un evento (botón, sensor). La función ISR se ejecuta inmediatamente. Más rápido que polling. ⚡" },
            { titulo: "✅ Quiz: EEPROM", tipo: 'mini_quiz', pregunta: "¿Para qué sirve la EEPROM del Arduino?", opciones: ["Para conectar WiFi", "Para guardar datos que sobrevivan al apagar el Arduino", "Para aumentar velocidad", "Para conectar más sensores"], respuestaCorrecta: 1, explicacion: "La EEPROM guarda datos permanentemente (1KB en UNO). Ideal para guardar configuraciones, calibraciones o high scores. ¡Memoria persistente! 💾" },
        ]
    },
    { 
        id: 'mod_diseno', 
        titulo: "Módulo 12: Mecanismos y Diseño 🔧", 
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
            { titulo: "✅ Quiz: Impresión 3D", tipo: 'mini_quiz', pregunta: "¿Qué material de impresión 3D es biodegradable y el más fácil de usar para principiantes?", opciones: ["ABS", "Nylon", "Titanio", "PLA"], respuestaCorrecta: 3, explicacion: "¡Correcto! El PLA (Ácido Poliláctico) es biodegradable, hecho de maíz, fácil de imprimir y no necesita cama caliente. ¡El mejor amigo del principiante en 3D! 🌽🖨️" },
            { titulo: "3. Principios de Diseño", tipo: 'texto', puntos: [
                "**Simetría:** Robot simétrico = más estable y movimientos rectos.",
                "**Centro de Gravedad Bajo:** Peso cerca del suelo = no se voltea.",
                "**Modularidad:** Piezas intercambiables. Si algo se rompe, solo reemplaza esa parte.",
                "**Accesibilidad:** Poder acceder a baterías y cables sin desmontar todo."
            ]},
            { titulo: "✅ Quiz: Principios de Diseño", tipo: 'mini_quiz', pregunta: "¿Por qué es importante que un robot sea MODULAR?", opciones: ["Para que se vea más bonito", "Para que sea más pesado", "Para poder reemplazar solo la parte que falle sin desarmar todo", "Para que use más energía"], respuestaCorrecta: 2, explicacion: "¡Exacto! La modularidad permite que si un sensor falla, solo cambies ese sensor sin tener que desarmar todo el robot. ¡Ahorra tiempo y dinero! 🧩🔧" },
            { titulo: "🎮 Reto: Rediseña un Objeto", tipo: 'interactive_challenge', instruccion: "**Reto de Ingeniería:** Toma un objeto cotidiano (estuche, caja, juguete) y piensa cómo lo REDISEÑARÍAS aplicando los principios:\n\n1. 🔲 **Simetría:** ¿Es simétrico? ¿Debería serlo?\n2. ⚖️ **Estabilidad:** ¿Dónde está el peso? ¿Se cae fácil?\n3. 🧩 **Modularidad:** ¿Tiene partes reemplazables?\n4. 🔧 **Accesibilidad:** ¿Es fácil de abrir/limpiar/reparar?\n\n¡Dibuja tu versión mejorada y anota los cambios!", recompensa: "🏅 Insignia: Diseñador Industrial" },
            { titulo: "4. Materiales", tipo: 'texto', puntos: [
                "**MDF/Madera:** Barato, fácil de cortar con láser. Excelente para prototipos.",
                "**Acrílico:** Transparente y resistente. Se corta con láser.",
                "**Aluminio:** Ligero y fuerte. Para robots de competencia.",
                "**Cartón:** ¡Perfecto para tu primer prototipo rápido!"
            ]},
            { titulo: "🎯 Actividad: Tu Primer Diseño", tipo: 'activity', instruccion: "**Reto:** Entra a Tinkercad.com (gratis) y diseña un soporte para tu Arduino. Debe tener agujeros para los tornillos y espacio para cables.", materiales: ["Computadora con internet", "Cuenta gratuita en Tinkercad.com"] }
,
            { titulo: "✅ Quiz: CAD", tipo: 'mini_quiz', pregunta: "¿Qué significa CAD en diseño de robots?", opciones: ["Control Automático Digital", "Diseño Asistido por Computadora", "Cable de Alta Definición", "Centro de Análisis de Datos"], respuestaCorrecta: 1, explicacion: "CAD = Computer-Aided Design (Diseño Asistido por Computadora). Programas como TinkerCAD, Fusion 360 y FreeCAD. 🖥️" },
            { titulo: "✅ Quiz: Impresión 3D", tipo: 'mini_quiz', pregunta: "¿Qué material es el más común para impresión 3D en robótica?", opciones: ["Metal líquido", "PLA (ácido poliláctico)", "Vidrio templado", "Cemento"], respuestaCorrecta: 1, explicacion: "¡PLA! Es biodegradable, fácil de imprimir y suficientemente resistente para prototipos de robots. 🖨️" },
            { titulo: "✅ Quiz: Tolerancias", tipo: 'mini_quiz', pregunta: "¿Qué son las 'tolerancias' en diseño mecánico?", opciones: ["La paciencia del diseñador", "El margen de error aceptable en las medidas de una pieza", "El peso máximo del robot", "La velocidad del motor"], respuestaCorrecta: 1, explicacion: "Las tolerancias son los márgenes permitidos en medidas. Un agujero de 5mm ± 0.1mm acepta entre 4.9mm y 5.1mm. ¡Precisión! 📐" },
            { titulo: "✅❌ Diseño: ¿V o F?", tipo: 'true_false', statements: [{ text: 'TinkerCAD es un programa gratuito para diseño 3D.', correct: true, explain: 'TinkerCAD de Autodesk es gratuito, online y perfecto para principiantes.' }, { text: 'La impresión 3D solo puede hacer piezas decorativas, no funcionales.', correct: false, explain: 'Se imprimen engranajes, chasis, soportes de sensores y piezas funcionales para robots.' }] },
            { titulo: "🧩 Herramientas de Diseño", tipo: 'matching_game', instruccion: 'Conecta cada herramienta con su uso', pairs: [{ left: '🖥️ TinkerCAD', right: 'Diseño 3D para principiantes' }, { left: '🖨️ Impresora 3D', right: 'Fabricar piezas físicas' }, { left: '📐 Calibrador/Vernier', right: 'Medir con precisión' }, { left: '✏️ Boceto en papel', right: 'Primera idea de diseño' }] },
            { titulo: "✅ Quiz: Materiales para Robots", tipo: 'mini_quiz', pregunta: "¿Qué material usarías para un robot que necesita ser MUY liviano?", opciones: ["Acero inoxidable", "Aluminio o fibra de carbono", "Plomo", "Concreto"], respuestaCorrecta: 1, explicacion: "El aluminio y la fibra de carbono son muy livianos pero resistentes. ¡Los drones y robots de competencia los usan! 🏎️" },
            { titulo: "✅ Quiz: Diseño Iterativo", tipo: 'mini_quiz', pregunta: "¿Qué significa 'diseño iterativo'?", opciones: ["Diseñar solo una vez y no cambiar", "Diseñar, probar, mejorar y repetir", "Copiar el diseño de otro", "No usar computadora"], respuestaCorrecta: 1, explicacion: "¡Diseñar-probar-mejorar en ciclos! Cada versión (v1, v2, v3...) es mejor. Los ingenieros nunca se conforman con la primera versión. 🔄" },
            { titulo: "✅ Quiz: Ergonomía en Robots", tipo: 'mini_quiz', pregunta: "¿Por qué es importante que el diseño de un robot sea accesible (fácil de abrir y reparar)?", opciones: ["Solo por estética", "Para poder cambiar componentes, pilas y cables fácilmente", "No es importante", "Para que sea más pesado"], respuestaCorrecta: 1, explicacion: "¡Un buen diseño permite mantenimiento fácil! Si no puedes llegar a las pilas o cables, cada reparación es una pesadilla. 🔧" },
            { titulo: "✅ Quiz: CAD para Robots", tipo: 'mini_quiz', pregunta: "¿Qué software gratuito se puede usar para diseñar piezas 3D de un robot?", opciones: ["Paint", "Tinkercad o FreeCAD para modelado 3D y diseño de piezas", "Excel", "PowerPoint"], respuestaCorrecta: 1, explicacion: "Tinkercad (web, fácil) y FreeCAD (escritorio, avanzado) permiten diseñar piezas que luego puedes imprimir en 3D. ¡Diseño digital! 🖥️" },
            { titulo: "✅ Quiz: Fritzing", tipo: 'mini_quiz', pregunta: "¿Para qué se usa Fritzing en proyectos de robótica?", opciones: ["Para programar", "Para diseñar circuitos electrónicos y crear esquemas de conexión", "Para imprimir 3D", "Para controlar servos"], respuestaCorrecta: 1, explicacion: "Fritzing permite dibujar circuitos con componentes reales (Arduino, sensores). Genera esquemas profesionales y hasta diseños de PCB. 📐" },
        ]
    },
    { 
        id: 'mod_primer_led', 
        titulo: "Módulo 13: ¡Proyecto Final! 🏆", 
        icon: '🔴', 
        descripcion: "Guía de proyecto físico paso a paso: conecta LED, resistencia, pila y botón.", 
        specialView: 'InteractiveLEDGuide',
        contenidoTeorico: [
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
            { titulo: "✅ Quiz: Polaridad LED", tipo: 'mini_quiz', pregunta: "¿Cómo identificas el polo positivo (ánodo) de un LED?", opciones: ["Es la pata más corta", "Es la pata más larga y el lado sin recorte en la base", "Ambas patas son iguales", "Por el color"], respuestaCorrecta: 1, explicacion: "La pata más larga = ánodo (+). La pata más corta con recorte en la base = cátodo (-). Si lo conectas al revés, no enciende. 💡" },
            { titulo: "✅ Quiz: digitalWrite", tipo: 'mini_quiz', pregunta: "¿Qué hace la instrucción digitalWrite(13, HIGH)?", opciones: ["Lee el pin 13", "Envía 5V al pin 13 (lo enciende)", "Apaga todo", "Configura el pin como entrada"], respuestaCorrecta: 1, explicacion: "digitalWrite(pin, HIGH) pone el pin a 5V (enciende). digitalWrite(pin, LOW) lo pone a 0V (apaga). ¡Así controlas LEDs! 🔌" },
            { titulo: "✅ Quiz: Delay", tipo: 'mini_quiz', pregunta: "¿Qué hace delay(1000) en Arduino?", opciones: ["Espera 1 segundo (1000 milisegundos)", "Espera 1000 segundos", "Acelera el programa", "Apaga el Arduino"], respuestaCorrecta: 0, explicacion: "delay(1000) pausa el programa 1000ms = 1 segundo. delay(500) = 0.5s. ¡Útil para hacer parpadear un LED! ⏱️" },
        ],
    },
];


// ==========================================================
// --- RETOS DE CÓDIGO (EXPANDIDOS Y EDUCATIVOS) ---
// ==========================================================

export const CODE_CHALLENGES_DATA = [
    // ===================================================================
    // 🌱 NIVEL 1: PRINCIPIANTE — Conceptos básicos, 1-3 bloques
    // ===================================================================
    {
        id: 'py_hola_mundo',
        name: 'Python',
        icon: '🐍',
        difficulty: 1,
        category: 'output',
        title: 'Reto 1: ¡Hola Mundo!',
        instructions: '¡Tu primer programa! Selecciona el bloque correcto para que Python muestre "¡Hola Mundo!" en la pantalla.',
        concept: '**print()** es la función más básica de Python. Le dice a la computadora: "¡Muestra este mensaje en la pantalla!". Todo lo que pongas entre los paréntesis y comillas se mostrará.',
        funFact: '🤖 "Hola Mundo" es el primer programa que escriben TODOS los programadores del mundo. ¡Es una tradición desde 1978!',
        hints: ['La función para mostrar texto en Python empieza con la letra "p"', 'Busca el bloque que use print() con comillas y paréntesis', 'print("¡Hola Mundo!") — paréntesis por fuera, comillas por dentro'],
        solution: [
            { id: 1, text: 'print("¡Hola Mundo!")', type: 'output', explanation: '🖨️ print() muestra texto en la pantalla. Las comillas dicen que es un mensaje de texto.' }
        ],
        extra_blocks: [
            { id: 2, text: 'mostrar("¡Hola Mundo!")', type: 'wrong', whyWrong: '"mostrar" no existe en Python. La función correcta es print() (en inglés).' },
            { id: 3, text: 'console.log("¡Hola Mundo!")', type: 'wrong', whyWrong: 'console.log() es de JavaScript, no de Python. Cada lenguaje tiene su propia forma.' },
            { id: 4, text: 'echo "¡Hola Mundo!"', type: 'wrong', whyWrong: 'echo es un comando de la terminal/consola, no de Python.' }
        ]
    },
    {
        id: 'py_variable_basica',
        name: 'Python',
        icon: '🐍',
        difficulty: 1,
        category: 'variables',
        title: 'Reto 2: Mi Primera Variable',
        instructions: 'Crea una variable llamada "nombre" con tu nombre y muéstrala en pantalla.',
        concept: '**Una variable es como una cajita con nombre.** Guardas algo dentro (un texto, un número) y luego puedes usarlo cuando quieras. El signo = significa "guarda esto aquí".',
        funFact: '📦 Piensa en las variables como cajas de zapatos: cada una tiene una etiqueta (el nombre) y algo dentro (el valor). ¡Puedes cambiar lo que hay dentro cuando quieras!',
        hints: ['Primero necesitas CREAR la variable, después MOSTRARLA', 'Para guardar un valor se usa el signo = (uno solo, no doble)', 'Para mostrar una variable con print(), NO uses comillas alrededor del nombre'],
        solution: [
            { id: 1, text: 'nombre = "CultivaTec"', type: 'setup', explanation: '📦 Creamos una cajita llamada "nombre" y guardamos el texto "CultivaTec" dentro.' },
            { id: 2, text: 'print(nombre)', type: 'output', explanation: '🖨️ Le decimos a Python: muestra lo que hay dentro de la cajita "nombre". ¡No usamos comillas porque es una variable!' }
        ],
        extra_blocks: [
            { id: 3, text: 'print("nombre")', type: 'wrong', whyWrong: 'Con comillas imprime la PALABRA "nombre", no lo que hay DENTRO de la variable. Sin comillas = variable.' },
            { id: 4, text: 'nombre == "CultivaTec"', type: 'wrong', whyWrong: '== (doble igual) es para COMPARAR, no para guardar. Un solo = es para guardar.' },
            { id: 5, text: 'var nombre = "CultivaTec"', type: 'wrong', whyWrong: 'En Python NO se usa "var". Simplemente escribes el nombre y el valor.' }
        ]
    },
    {
        id: 'py_suma_numeros',
        name: 'Python',
        icon: '🐍',
        difficulty: 1,
        category: 'variables',
        title: 'Reto 3: Sumando Números',
        instructions: 'Crea dos variables con números, súmalas y muestra el resultado.',
        concept: '**Python puede hacer matemáticas.** Cuando guardas números en variables (sin comillas), puedes sumarlos (+), restarlos (-), multiplicarlos (*) y dividirlos (/).',
        funFact: '🧮 Las computadoras pueden hacer MIL MILLONES de sumas por segundo. ¡Tu calculadora es lenta comparada con Python!',
        hints: ['El orden lógico es: crear variables → operar → guardar resultado → mostrar', 'Los números van SIN comillas para que Python pueda hacer matemáticas', 'Necesitas guardar el resultado de a + b en una variable antes de imprimirlo'],
        solution: [
            { id: 1, text: 'a = 10', type: 'setup', explanation: '📦 Guardamos el número 10 en la cajita "a". Sin comillas porque es un número, no texto.' },
            { id: 2, text: 'b = 5', type: 'setup', explanation: '📦 Guardamos el número 5 en la cajita "b".' },
            { id: 3, text: 'resultado = a + b', type: 'output', explanation: '➕ Python suma lo que hay en "a" (10) y "b" (5), y guarda 15 en "resultado".' },
            { id: 4, text: 'print(resultado)', type: 'output', explanation: '🖨️ Muestra el contenido de "resultado" en pantalla: 15.' }
        ],
        extra_blocks: [
            { id: 5, text: 'resultado = "a + b"', type: 'wrong', whyWrong: 'Con comillas, Python piensa que "a + b" es texto, no una operación matemática. ¡Mostraría literalmente "a + b"!' },
            { id: 6, text: 'a + b', type: 'wrong', whyWrong: 'Esto suma pero no guarda el resultado en ningún lado. Necesitas guardar en una variable para usarlo.' },
            { id: 7, text: 'print(a + b = resultado)', type: 'wrong', whyWrong: 'No puedes asignar dentro de print(). Primero guardas, luego imprimes.' }
        ]
    },
    {
        id: 'py_texto_formateado',
        name: 'Python',
        icon: '🐍',
        difficulty: 1,
        category: 'output',
        title: 'Reto 4: Mensaje Personalizado',
        instructions: 'Crea una variable "edad" y muestra un mensaje que diga "Tengo X años".',
        concept: '**f-strings** son textos mágicos que empiezan con la letra f. Dentro de las llaves {} puedes poner variables y Python las reemplaza por su valor. ¡Es como rellenar huecos!',
        funFact: '✍️ La "f" en f-string significa "formatted" (formateado). Es como un Mad Libs: dejas espacios en blanco {} y Python los rellena automáticamente.',
        hints: ['Para mezclar texto y variables necesitas un tipo especial de comillas', 'La letra "f" ANTES de las comillas activa la magia de las f-strings', 'Dentro de las llaves {edad} pon el nombre de la variable sin comillas'],
        solution: [
            { id: 1, text: 'edad = 10', type: 'setup', explanation: '📦 Guardamos el número 10 en la variable "edad".' },
            { id: 2, text: 'print(f"Tengo {edad} años")', type: 'output', explanation: '🪄 La f antes de las comillas activa la magia. {edad} se reemplaza por 10. Resultado: "Tengo 10 años".' }
        ],
        extra_blocks: [
            { id: 3, text: 'print("Tengo {edad} años")', type: 'wrong', whyWrong: '¡Sin la f al inicio, Python NO reemplaza {edad}! Mostraría literalmente "Tengo {edad} años".' },
            { id: 4, text: 'print("Tengo" + edad + "años")', type: 'wrong', whyWrong: 'No puedes sumar texto + número directamente en Python. Necesitas convertir con str() o usar f-strings.' },
            { id: 5, text: 'edad = "10"', type: 'wrong', whyWrong: 'Con comillas, 10 es TEXTO, no número. No podrías hacer matemáticas con él después.' }
        ]
    },
    {
        id: 'ard_setup_loop',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 1,
        category: 'estructura',
        title: 'Reto 5: La Base de Arduino',
        instructions: 'Arma la estructura básica de TODO programa Arduino: setup() y loop().',
        concept: '**Todo programa Arduino tiene 2 partes obligatorias:** setup() se ejecuta UNA vez al encender (como prepararse), y loop() se repite PARA SIEMPRE (como el latido de tu corazón).',
        funFact: '💓 loop() se repite miles de veces por segundo. ¡Es como el corazón de tu robot, nunca deja de latir mientras tenga energía!',
        hints: ['Todo programa Arduino tiene DOS funciones obligatorias', 'setup() va PRIMERO (se ejecuta una vez), loop() va DESPUÉS (se repite)', 'Cada función necesita abrir { y cerrar } sus llaves, con un comentario dentro'],
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup', explanation: '🏁 "void" = no devuelve nada. "setup" = preparación. Las llaves { } contienen las instrucciones.' },
            { id: 2, text: '  // Configuración inicial', type: 'setup', explanation: '💬 Las líneas con // son comentarios. Arduino las ignora. Son notas para que TÚ recuerdes qué hace el código.' },
            { id: 3, text: '}', type: 'setup', explanation: '🔚 Esta llave cierra el bloque setup(). Todo entre { y } es parte de setup.' },
            { id: 4, text: 'void loop() {', type: 'setup', explanation: '🔄 loop = bucle. Todo lo que pongas aquí se repite una y otra y otra vez.' },
            { id: 5, text: '  // Código que se repite', type: 'setup', explanation: '💬 Aquí pondrías las instrucciones que quieres que el robot repita: leer sensores, mover motores, etc.' },
            { id: 6, text: '}', type: 'setup', explanation: '🔚 Cierra el bloque loop(). Cuando llega aquí, ¡vuelve a empezar desde el inicio de loop()!' }
        ],
        extra_blocks: [
            { id: 7, text: 'int main() {', type: 'wrong', whyWrong: 'int main() es de C++, no de Arduino. Arduino usa setup() y loop() en su lugar.' },
            { id: 8, text: 'def setup():', type: 'wrong', whyWrong: '"def" es de Python. Arduino usa "void" para definir funciones.' },
            { id: 9, text: 'while(true) {', type: 'wrong', whyWrong: 'En Arduino no necesitas while(true), ¡loop() ya se repite automáticamente!' }
        ]
    },
    {
        id: 'ard_blink_basico',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 1,
        category: 'output',
        title: 'Reto 6: ¡Enciende un LED!',
        instructions: 'Programa Arduino para encender un LED en el pin 13. Es el "Hola Mundo" de Arduino.',
        concept: '**pinMode()** prepara un pin para usar. **digitalWrite()** envía electricidad (HIGH) o la corta (LOW). Es como un interruptor de luz.',
        funFact: '💡 El pin 13 de Arduino tiene un LED integrado en la placa. ¡Puedes hacer este reto sin conectar nada extra!',
        hints: ['Primero configura el pin como SALIDA en setup(), luego enciende en loop()', 'pinMode() configura UN pin, digitalWrite() envía energía a ese pin', 'OUTPUT = el pin enviará energía, HIGH = encendido (5 voltios)'],
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup', explanation: '🏁 Inicio de la función de preparación.' },
            { id: 2, text: '  pinMode(13, OUTPUT);', type: 'setup', explanation: '🔌 Le decimos a Arduino: "El pin 13 será de SALIDA". OUTPUT = enviar energía hacia afuera (al LED).' },
            { id: 3, text: '}', type: 'setup', explanation: '🔚 Fin de setup. Esto solo se ejecuta una vez.' },
            { id: 4, text: 'void loop() {', type: 'setup', explanation: '🔄 Inicio del código que se repite.' },
            { id: 5, text: '  digitalWrite(13, HIGH);', type: 'output', explanation: '💡 HIGH = encendido. Envía 5 voltios al pin 13. ¡El LED se enciende!' },
            { id: 6, text: '}', type: 'setup', explanation: '🔚 Fin de loop. El LED queda encendido para siempre.' }
        ],
        extra_blocks: [
            { id: 7, text: 'pinMode(13, INPUT);', type: 'wrong', whyWrong: 'INPUT es para LEER datos (sensores). Para enviar energía a un LED necesitas OUTPUT.' },
            { id: 8, text: 'analogWrite(13, HIGH);', type: 'wrong', whyWrong: 'analogWrite usa números 0-255, no HIGH/LOW. Para encender/apagar usamos digitalWrite.' },
            { id: 9, text: 'LED.on();', type: 'wrong', whyWrong: 'Arduino no tiene LED.on(). Usamos digitalWrite(pin, HIGH) para encender.' }
        ]
    },
    // ===================================================================
    // ⭐ NIVEL 2: APRENDIZ — Condiciones, ciclos, Arduino intermedio
    // ===================================================================
    {
        id: 'py_blink_arduino',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 2,
        category: 'timing',
        title: 'Reto 7: LED Parpadeante',
        instructions: 'Haz que el LED parpadee: enciende 1 segundo, apaga 1 segundo, repite.',
        concept: '**delay(ms)** pausa el programa. 1000 milisegundos = 1 segundo. Sin delay, el LED parpadearía TAN rápido que siempre lo verías encendido.',
        funFact: '⏱️ 1000 milisegundos = 1 segundo. Arduino mide el tiempo en milisegundos porque los robots necesitan precisión. ¡Un milisegundo es la milésima parte de un segundo!',
        hints: ['El patrón es: encender → esperar → apagar → esperar', 'delay(1000) pausa el programa 1 segundo. Necesitas DOS delays', 'Después de cada digitalWrite necesitas un delay() para que el cambio se note'],
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup', explanation: '🏁 Preparación: se ejecuta una sola vez.' },
            { id: 2, text: '  pinMode(13, OUTPUT);', type: 'setup', explanation: '🔌 Configuramos el pin 13 como salida para el LED.' },
            { id: 3, text: '}', type: 'setup', explanation: '🔚 Fin de la preparación.' },
            { id: 4, text: 'void loop() {', type: 'setup', explanation: '🔄 Todo lo de aquí se repite sin parar.' },
            { id: 5, text: '  digitalWrite(13, HIGH);', type: 'output', explanation: '💡 ¡LED encendido! Envía 5V al pin 13.' },
            { id: 6, text: '  delay(1000);', type: 'setup', explanation: '⏳ Espera 1000ms (1 segundo) con el LED encendido. Sin esto, ¡no lo verías!' },
            { id: 7, text: '  digitalWrite(13, LOW);', type: 'output', explanation: '🌑 LED apagado. LOW = 0 voltios, sin energía.' },
            { id: 8, text: '  delay(1000);', type: 'setup', explanation: '⏳ Espera otro segundo con el LED apagado. Luego loop() vuelve a empezar.' },
            { id: 9, text: '}', type: 'setup', explanation: '🔚 Vuelve al inicio de loop(): enciende → espera → apaga → espera → repite...' }
        ],
        extra_blocks: [
            { id: 10, text: 'sleep(1000);', type: 'wrong', whyWrong: 'sleep() es de Python. En Arduino usamos delay() para pausar.' },
            { id: 11, text: 'wait(1);', type: 'wrong', whyWrong: 'wait() no existe en Arduino. Usamos delay() con milisegundos.' },
            { id: 12, text: 'analogWrite(13, 0);', type: 'wrong', whyWrong: 'analogWrite controla brillo (0-255). Para simplemente apagar, usamos digitalWrite(LOW).' }
        ]
    },
    {
        id: 'py_if_else',
        name: 'Python',
        icon: '🐍',
        difficulty: 2,
        category: 'condiciones',
        title: 'Reto 8: ¿Mayor o Menor de Edad?',
        instructions: 'Usa if/else para verificar si una persona es mayor de edad (18 años).',
        concept: '**if/else** le permite al programa tomar decisiones. "if" significa "si" y "else" significa "si no". Es como un camino que se divide en dos: si la condición es verdadera, va por un lado; si es falsa, va por el otro.',
        funFact: '🤖 Los robots usan miles de if/else por segundo para decidir qué hacer. "Si hay obstáculo → girar, si no → avanzar". ¡Así de simple es la inteligencia artificial básica!',
        hints: ['El orden es: crear variable → preguntar con if → manejar el "si no" con else', 'Para "mayor o igual" se usa >= (no solo > que excluiría el 18)', 'Las líneas dentro de if y else deben tener 4 espacios de indentación'],
        solution: [
            { id: 1, text: 'edad = 15', type: 'setup', explanation: '📦 Guardamos la edad en una variable. Puedes cambiar este número para probar.' },
            { id: 2, text: 'if edad >= 18:', type: 'setup', explanation: '🤔 "if" pregunta: ¿edad es mayor o igual (>=) a 18? Los dos puntos : son obligatorios.' },
            { id: 3, text: '    print("Mayor de edad")', type: 'output', explanation: '✅ Si la respuesta es SÍ (verdadero), ejecuta esta línea. ¡La indentación (4 espacios) es OBLIGATORIA!' },
            { id: 4, text: 'else:', type: 'setup', explanation: '↩️ "else" = "si no". Se ejecuta cuando la condición del if es FALSA.' },
            { id: 5, text: '    print("Menor de edad")', type: 'output', explanation: '❌ Como 15 < 18, la condición es falsa, así que se ejecuta ESTA línea.' }
        ],
        extra_blocks: [
            { id: 6, text: 'if edad == 18:', type: 'wrong', whyWrong: '== verifica si es EXACTAMENTE 18. Pero "mayor de edad" incluye 18, 19, 20... Necesitas >= (mayor o igual).' },
            { id: 7, text: 'elif:', type: 'wrong', whyWrong: 'elif (else if) necesita una condición. Aquí solo hay dos opciones, así que else es suficiente.' },
            { id: 8, text: '    print "Mayor"', type: 'wrong', whyWrong: 'En Python 3 print SIEMPRE necesita paréntesis: print("texto"). Sin paréntesis da error.' }
        ]
    },
    {
        id: 'py_for_contar',
        name: 'Python',
        icon: '🐍',
        difficulty: 2,
        category: 'ciclos',
        title: 'Reto 9: Contar del 1 al 5',
        instructions: 'Usa un ciclo for para que Python cuente del 1 al 5 automáticamente.',
        concept: '**El ciclo for** repite código un número exacto de veces. **range(1, 6)** genera los números 1, 2, 3, 4, 5 (¡el 6 NO se incluye!). La variable "i" toma cada valor automáticamente.',
        funFact: '🔄 ¿Por qué range(1,6) y no range(1,5)? Porque en programación, los rangos son "exclusivos" al final. Es como decir "del 1 al 6, sin incluir el 6". ¡Es raro pero te acostumbras!',
        hints: ['El ciclo for usa range() para generar una secuencia de números', 'range(1, 6) genera 1, 2, 3, 4, 5 — ¡el último número NO se incluye!', 'Lo que va DENTRO del for debe estar indentado con 4 espacios'],
        solution: [
            { id: 1, text: 'for i in range(1, 6):', type: 'setup', explanation: '🔄 "for i in range(1, 6)" = repite 5 veces. "i" vale 1, luego 2, luego 3, 4 y 5.' },
            { id: 2, text: '    print(i)', type: 'output', explanation: '🖨️ Cada vez que el ciclo se repite, imprime el valor actual de i. Resultado: 1, 2, 3, 4, 5.' }
        ],
        extra_blocks: [
            { id: 3, text: 'for i in range(5):', type: 'wrong', whyWrong: 'range(5) empieza en 0, no en 1. Imprimiría: 0, 1, 2, 3, 4. Necesitas range(1, 6).' },
            { id: 4, text: 'for i in range(1, 5):', type: 'wrong', whyWrong: 'range(1, 5) genera 1, 2, 3, 4. ¡Falta el 5! El último número no se incluye.' },
            { id: 5, text: 'while i < 5:', type: 'wrong', whyWrong: 'while funciona pero necesita más código (inicializar i y sumarle 1). El for es más simple aquí.' },
            { id: 6, text: 'print(range(1, 6))', type: 'wrong', whyWrong: 'Esto imprime "range(1, 6)" como objeto, no los números individuales. Necesitas el ciclo for.' }
        ]
    },
    {
        id: 'py_lista_robots',
        name: 'Python',
        icon: '🐍',
        difficulty: 2,
        category: 'listas',
        title: 'Reto 10: Lista de Robots',
        instructions: 'Crea una lista con nombres de robots y muestra cada uno con un ciclo for.',
        concept: '**Una lista** es una variable que guarda VARIOS valores a la vez, en orden. Se escriben entre corchetes [] separados por comas. ¡Como una fila de cajitas numeradas empezando desde 0!',
        funFact: '📋 Las listas en Python pueden guardar CUALQUIER cosa: números, textos, ¡incluso otras listas dentro de listas! Son como cajones con compartimentos.',
        hints: ['Primero crea la lista con corchetes [], luego recórrela con for', '"for robot in robots:" toma cada elemento de la lista uno por uno', 'Usa f-string con {robot} para incluir cada nombre en el mensaje'],
        solution: [
            { id: 1, text: 'robots = ["R2-D2", "Wall-E", "Baymax"]', type: 'setup', explanation: '📋 Creamos una lista con 3 nombres de robots. Los corchetes [] significan "esto es una lista".' },
            { id: 2, text: 'for robot in robots:', type: 'setup', explanation: '🔄 "for robot in robots" = para cada elemento en la lista. "robot" va tomando cada nombre: primero R2-D2, luego Wall-E, luego Baymax.' },
            { id: 3, text: '    print(f"🤖 {robot}")', type: 'output', explanation: '🖨️ Imprime cada robot con un emoji. Resultado: "🤖 R2-D2", "🤖 Wall-E", "🤖 Baymax".' }
        ],
        extra_blocks: [
            { id: 4, text: 'robots = ("R2-D2", "Wall-E")', type: 'wrong', whyWrong: 'Los paréntesis () crean una "tupla" (lista inmutable). Para listas normales usa corchetes [].' },
            { id: 5, text: 'for i in range(robots):', type: 'wrong', whyWrong: 'range() necesita un número, no una lista. Usa "for robot in robots" directamente.' },
            { id: 6, text: 'print(robots)', type: 'wrong', whyWrong: 'Esto imprime toda la lista de golpe: ["R2-D2", "Wall-E", "Baymax"]. El for imprime uno por uno.' }
        ]
    },
    {
        id: 'ard_serial_monitor',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 2,
        category: 'comunicacion',
        title: 'Reto 11: Monitor Serie',
        instructions: 'Envía mensajes al Monitor Serial de Arduino para ver qué hace tu robot.',
        concept: '**Serial** es el canal de comunicación entre Arduino y tu computadora. **Serial.begin(9600)** abre el canal a velocidad 9600. **Serial.println()** envía mensajes que puedes leer en tu PC.',
        funFact: '📡 "9600" es la velocidad en "baudios" (bits por segundo). Arduino y tu PC deben usar la MISMA velocidad, ¡como hablar el mismo idioma a la misma velocidad!',
        hints: ['En setup() necesitas abrir la comunicación con Serial.begin()', 'Serial.println() envía un mensaje a tu computadora y salta de línea', 'Usa delay() entre mensajes en loop() para no saturar el monitor'],
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup', explanation: '🏁 Preparación inicial.' },
            { id: 2, text: '  Serial.begin(9600);', type: 'setup', explanation: '📡 Abre el canal Serial a velocidad 9600 baudios. Sin esto, no puedes enviar mensajes.' },
            { id: 3, text: '  Serial.println("Robot listo!");', type: 'output', explanation: '💬 println = print line. Envía "Robot listo!" a tu PC y salta de línea.' },
            { id: 4, text: '}', type: 'setup', explanation: '🔚 Fin de setup.' },
            { id: 5, text: 'void loop() {', type: 'setup', explanation: '🔄 Código que se repite.' },
            { id: 6, text: '  Serial.println("Funcionando...");', type: 'output', explanation: '💬 Envía "Funcionando..." a tu PC cada vez que loop se repite.' },
            { id: 7, text: '  delay(2000);', type: 'setup', explanation: '⏳ Espera 2 segundos para no inundar la pantalla con mensajes.' },
            { id: 8, text: '}', type: 'setup', explanation: '🔚 Fin de loop. Resultado: "Funcionando..." aparece cada 2 segundos en tu PC.' }
        ],
        extra_blocks: [
            { id: 9, text: 'print("Robot listo!");', type: 'wrong', whyWrong: 'print() es de Python. En Arduino usamos Serial.println() para enviar mensajes.' },
            { id: 10, text: 'Serial.print("Robot");', type: 'wrong', whyWrong: 'Serial.print() funciona pero NO salta de línea. println() es mejor porque cada mensaje va en su propia línea.' },
            { id: 11, text: 'Serial.begin(115200);', type: 'wrong', whyWrong: 'La velocidad debe coincidir con el Monitor Serial. 9600 es la estándar para principiantes.' }
        ]
    },
    {
        id: 'py_input_usuario',
        name: 'Python',
        icon: '🐍',
        difficulty: 2,
        category: 'input',
        title: 'Reto 12: Pregúntale al Usuario',
        instructions: 'Pide al usuario su nombre y salúdalo con un mensaje personalizado.',
        concept: '**input()** detiene el programa y espera que el usuario escriba algo con el teclado. Lo que escriba se guarda en una variable. ¡Es como que tu programa tenga oídos!',
        funFact: '👂 input() es cómo los programas "escuchan" al usuario. Sin input, los programas solo hablan (print) pero nunca escuchan. ¡Los robots necesitan ambos: sensores (input) y actuadores (output)!',
        hints: ['input() muestra un mensaje y espera que el usuario escriba algo', 'Lo que el usuario escribe se guarda en una variable con el signo =', 'Usa f-string para incluir lo que escribió el usuario en tu saludo'],
        solution: [
            { id: 1, text: 'nombre = input("¿Cómo te llamas? ")', type: 'setup', explanation: '👂 Muestra la pregunta y espera. Lo que el usuario escriba se guarda en "nombre".' },
            { id: 2, text: 'print(f"¡Hola, {nombre}! 🤖")', type: 'output', explanation: '🖨️ Usa f-string para incluir el nombre que escribió el usuario. ¡Mensaje personalizado!.' }
        ],
        extra_blocks: [
            { id: 3, text: 'nombre = read("¿Cómo te llamas?")', type: 'wrong', whyWrong: 'read() no existe en Python. La función para leer del teclado es input().' },
            { id: 4, text: 'nombre = input()', type: 'wrong', whyWrong: 'Funciona pero no muestra mensaje. El usuario no sabe qué escribir. Siempre pon un texto guía.' },
            { id: 5, text: 'scanf("%s", nombre);', type: 'wrong', whyWrong: 'scanf es de C/C++, no de Python. Cada lenguaje tiene su propia forma de leer.' }
        ]
    },
    // ===================================================================
    // 🚀 NIVEL 3: INTERMEDIO — Funciones, Arduino sensores, lógica
    // ===================================================================
    {
        id: 'py_funcion_saludar',
        name: 'Python',
        icon: '🐍',
        difficulty: 3,
        category: 'funciones',
        title: 'Reto 13: Tu Primera Función',
        instructions: 'Crea una función "saludar" que reciba un nombre y lo salude. Luego llámala.',
        concept: '**Una función es un bloque de código reutilizable con nombre.** La creas con "def", le das un nombre, y entre paréntesis los datos que necesita (parámetros). Luego la "llamas" por su nombre cuando quieras usarla.',
        funFact: '♻️ Las funciones evitan repetir código. Si saludas a 100 personas, no escribes print() 100 veces: ¡creas una función y la llamas 100 veces! Los programadores buenos son "perezosos bien". 😎',
        hints: ['En Python las funciones se crean con la palabra "def"', 'Primero DEFINES la función (def), luego la LLAMAS por su nombre', 'La función necesita un parámetro entre paréntesis para recibir el nombre'],
        solution: [
            { id: 1, text: 'def saludar(nombre):', type: 'setup', explanation: '🔧 "def" = definir función. "saludar" = nombre. "nombre" = parámetro (dato que recibirá).' },
            { id: 2, text: '    print(f"¡Hola, {nombre}!")', type: 'output', explanation: '🖨️ Esta línea está DENTRO de la función (indentada). Se ejecuta cuando llamas a saludar().' },
            { id: 3, text: 'saludar("Robot-3000")', type: 'output', explanation: '📢 ¡Llamamos a la función! Le pasamos "Robot-3000" como nombre. Imprimirá: "¡Hola, Robot-3000!".' }
        ],
        extra_blocks: [
            { id: 4, text: 'function saludar(nombre) {', type: 'wrong', whyWrong: '"function" es de JavaScript. En Python usamos "def" (de "define") para crear funciones.' },
            { id: 5, text: 'void saludar(nombre)', type: 'wrong', whyWrong: '"void" es de C++/Arduino. Python usa "def" y no necesita especificar el tipo.' },
            { id: 6, text: 'saludar nombre', type: 'wrong', whyWrong: 'Para llamar una función SIEMPRE necesitas paréntesis: saludar("nombre"), no saludar nombre.' },
            { id: 7, text: 'return nombre', type: 'wrong', whyWrong: 'return devuelve un valor sin mostrarlo. Aquí queremos MOSTRAR el saludo con print().' }
        ]
    },
    {
        id: 'ard_leer_sensor',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 3,
        category: 'sensores',
        title: 'Reto 14: Leer un Sensor',
        instructions: 'Lee un sensor de luz (LDR) conectado al pin A0 y muestra el valor en el Monitor Serial.',
        concept: '**analogRead()** lee un valor de 0 a 1023 de los pines analógicos (A0-A5). Un sensor de luz (LDR) da valores altos con mucha luz y bajos con poca luz. ¡Son los "ojos" del robot!',
        funFact: '👁️ 1023 = máxima luz, 0 = oscuridad total. ¿Por qué 1023? Porque Arduino usa 10 bits para leer (2¹⁰ = 1024 valores posibles, del 0 al 1023).',
        hints: ['Los pines analógicos (A0-A5) no necesitan pinMode, pero sí necesitas Serial', 'analogRead(A0) lee un valor de 0 a 1023 del sensor', 'El orden en loop() es: leer sensor → mostrar con Serial.println → delay'],
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup', explanation: '🏁 Preparación.' },
            { id: 2, text: '  Serial.begin(9600);', type: 'setup', explanation: '📡 Abrimos comunicación con la PC para ver los datos del sensor.' },
            { id: 3, text: '}', type: 'setup', explanation: '🔚 Fin de preparación.' },
            { id: 4, text: 'void loop() {', type: 'setup', explanation: '🔄 Código repetitivo.' },
            { id: 5, text: '  int luz = analogRead(A0);', type: 'output', explanation: '👁️ Lee el sensor en pin A0 y guarda el valor (0-1023) en la variable "luz". int = número entero.' },
            { id: 6, text: '  Serial.println(luz);', type: 'output', explanation: '📊 Envía el valor del sensor a tu PC. Puedes ver cómo cambia al tapar/iluminar el sensor.' },
            { id: 7, text: '  delay(500);', type: 'setup', explanation: '⏳ Espera medio segundo entre lecturas para no saturar el monitor.' },
            { id: 8, text: '}', type: 'setup', explanation: '🔚 Repite: lee → muestra → espera → lee → muestra...' }
        ],
        extra_blocks: [
            { id: 9, text: 'digitalRead(A0);', type: 'wrong', whyWrong: 'digitalRead solo da HIGH o LOW (0 o 1). analogRead da 0-1023, mucho más detallado para sensores.' },
            { id: 10, text: 'int luz = analogWrite(A0);', type: 'wrong', whyWrong: 'analogWrite ENVÍA datos (salida), no los lee. Para leer necesitas analogRead (entrada).' },
            { id: 11, text: 'pinMode(A0, INPUT);', type: 'wrong', whyWrong: 'Los pines analógicos (A0-A5) son INPUT por defecto. No necesitas configurarlos.' }
        ]
    },
    {
        id: 'py_if_elif_else',
        name: 'Python',
        icon: '🐍',
        difficulty: 3,
        category: 'condiciones',
        title: 'Reto 15: Semáforo Inteligente',
        instructions: 'Crea un programa que diga qué hacer según el color del semáforo: verde, amarillo o rojo.',
        concept: '**elif** (else if) permite verificar MÚLTIPLES condiciones, una tras otra. Python verifica en orden: si la primera es falsa, pasa a la siguiente. Es como un árbol de decisiones.',
        funFact: '🚦 Los semáforos inteligentes usan esta misma lógica pero con sensores: "si hay muchos autos → verde más largo, elif hay pocos → verde corto, else → rojo". ¡Programación en la vida real!',
        hints: ['El orden de las condiciones es: if → elif → else (de más específico a general)', 'Cada condición verifica un color diferente usando == para comparar', 'Python usa "elif" (abreviatura de "else if"), no "else if" como otros lenguajes'],
        solution: [
            { id: 1, text: 'color = "verde"', type: 'setup', explanation: '📦 Guardamos el color actual del semáforo.' },
            { id: 2, text: 'if color == "verde":', type: 'setup', explanation: '🤔 == compara si son iguales. ¿El color es "verde"? En este caso sí.' },
            { id: 3, text: '    print("🟢 ¡Avanza!")', type: 'output', explanation: '✅ Como color ES "verde", se ejecuta esta línea.' },
            { id: 4, text: 'elif color == "amarillo":', type: 'setup', explanation: '🤔 "elif" = "si no, ¿entonces esto otro?". Solo se revisa si el if anterior fue falso.' },
            { id: 5, text: '    print("🟡 ¡Precaución!")', type: 'output', explanation: '⚠️ Se ejecutaría si el color fuera "amarillo".' },
            { id: 6, text: 'else:', type: 'setup', explanation: '↩️ Si ninguna condición anterior fue verdadera, se ejecuta else (para rojo o cualquier otro).' },
            { id: 7, text: '    print("🔴 ¡Alto!")', type: 'output', explanation: '🛑 Se ejecuta cuando no es verde ni amarillo. Es la "opción por defecto".' }
        ],
        extra_blocks: [
            { id: 8, text: 'else if color == "amarillo":', type: 'wrong', whyWrong: 'En Python es "elif", no "else if" (que es de JavaScript/C++). Python lo abrevia.' },
            { id: 9, text: 'if color = "verde":', type: 'wrong', whyWrong: 'Un solo = es para ASIGNAR (guardar). Para COMPARAR necesitas == (doble igual).' },
            { id: 10, text: '    print("¡Avanza!")', type: 'wrong', whyWrong: 'Funcionaría pero sin emoji. El bloque correcto incluye el emoji 🟢 para hacerlo más claro.' }
        ]
    },
    {
        id: 'ard_servo_motor',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 3,
        category: 'actuadores',
        title: 'Reto 16: Mover un Servo',
        instructions: 'Programa un servo motor para que gire a 0°, 90° y 180°.',
        concept: '**Un servo motor** gira a un ángulo exacto que tú le dices (0° a 180°). Usa la librería Servo.h para controlarlo. **attach()** conecta el servo a un pin, y **write()** le dice a qué ángulo ir.',
        funFact: '🦾 Los servos se usan en brazos robóticos, robots humanoides y hasta en los aviones (controlan las aletas). ¡Un brazo robot industrial tiene 6 servos trabajando juntos!',
        hints: ['Necesitas incluir la librería con #include y crear un objeto Servo', 'En setup() usa attach() para decirle al servo en qué pin está conectado', 'write(ángulo) mueve el servo: prueba con 0°, 90° y 180° con delays entre cada uno'],
        solution: [
            { id: 1, text: '#include <Servo.h>', type: 'setup', explanation: '📚 #include importa la librería Servo. Es como decir "necesito las herramientas para usar servos".' },
            { id: 2, text: 'Servo miServo;', type: 'setup', explanation: '🔧 Creamos un objeto servo llamado "miServo". Es como darle un nombre a nuestro servo.' },
            { id: 3, text: 'void setup() {', type: 'setup', explanation: '🏁 Inicio de preparación.' },
            { id: 4, text: '  miServo.attach(9);', type: 'setup', explanation: '🔌 Conectamos el servo al pin 9. attach() = "tu servo está conectado aquí".' },
            { id: 5, text: '}', type: 'setup', explanation: '🔚 Fin de preparación.' },
            { id: 6, text: 'void loop() {', type: 'setup', explanation: '🔄 Código repetitivo.' },
            { id: 7, text: '  miServo.write(0);', type: 'output', explanation: '↩️ Mueve el servo a 0 grados (extremo izquierdo).' },
            { id: 8, text: '  delay(1000);', type: 'setup', explanation: '⏳ Espera 1 segundo en esa posición.' },
            { id: 9, text: '  miServo.write(90);', type: 'output', explanation: '⬆️ Mueve a 90° (centro). El servo gira hasta la posición que le dices.' },
            { id: 10, text: '  delay(1000);', type: 'setup', explanation: '⏳ Espera otro segundo.' },
            { id: 11, text: '  miServo.write(180);', type: 'output', explanation: '↪️ Mueve a 180° (extremo derecho). Rango completo: 0° a 180°.' },
            { id: 12, text: '  delay(1000);', type: 'setup', explanation: '⏳ Espera y luego loop() repite todo: 0° → 90° → 180° → 0° → ...' },
            { id: 13, text: '}', type: 'setup', explanation: '🔚 Fin de loop.' }
        ],
        extra_blocks: [
            { id: 14, text: '#include <Motor.h>', type: 'wrong', whyWrong: 'No existe Motor.h. Para servos usamos Servo.h. Cada tipo de motor tiene su librería.' },
            { id: 15, text: 'analogWrite(9, 90);', type: 'wrong', whyWrong: 'analogWrite envía PWM (0-255), no ángulos. Para ángulos precisos necesitas la librería Servo.' },
            { id: 16, text: 'miServo.read(90);', type: 'wrong', whyWrong: 'read() LEE la posición actual del servo, no la cambia. Para mover usamos write().' }
        ]
    },
    {
        id: 'py_funcion_retorno',
        name: 'Python',
        icon: '🐍',
        difficulty: 3,
        category: 'funciones',
        title: 'Reto 17: Función con Return',
        instructions: 'Crea una función que calcule el doble de un número y devuelva el resultado.',
        concept: '**return** devuelve un valor desde la función al código que la llamó. Es como pedir una pizza: llamas a la pizzería (función), ellos la hacen, y te la DEVUELVEN (return). Sin return, la función hace cosas pero no te da nada de vuelta.',
        funFact: '🍕 print() MUESTRA en pantalla. return DEVUELVE un valor para que lo uses después. Son cosas diferentes: print es como gritar un número en voz alta, return es como escribirlo en un papel y pasártelo.',
        hints: ['"def" crea la función, "return" devuelve el resultado al código que la llamó', 'Una función con return entrega un valor que puedes guardar en una variable', 'El orden es: definir función → llamarla guardando el resultado → imprimir'],
        solution: [
            { id: 1, text: 'def doble(numero):', type: 'setup', explanation: '🔧 Creamos función "doble" que recibe un "numero" como parámetro.' },
            { id: 2, text: '    return numero * 2', type: 'output', explanation: '📤 Calcula numero × 2 y DEVUELVE el resultado. La función "entrega" ese valor a quien la llamó.' },
            { id: 3, text: 'resultado = doble(7)', type: 'setup', explanation: '📦 Llamamos doble(7). La función devuelve 14. Ese 14 se guarda en "resultado".' },
            { id: 4, text: 'print(resultado)', type: 'output', explanation: '🖨️ Muestra 14 en pantalla. return no imprime, solo devuelve. Por eso necesitamos print().' }
        ],
        extra_blocks: [
            { id: 5, text: '    print(numero * 2)', type: 'wrong', whyWrong: 'print muestra el resultado pero NO lo devuelve. "resultado" quedaría vacío (None).' },
            { id: 6, text: 'resultado = doble 7', type: 'wrong', whyWrong: 'Para llamar una función necesitas paréntesis: doble(7), no doble 7.' },
            { id: 7, text: '    numero * 2', type: 'wrong', whyWrong: 'Calcula el doble pero no hace nada con él. Sin return, el resultado se pierde.' }
        ]
    },
    // ===================================================================
    // 🏆 NIVEL 4: AVANZADO — Arduino completo, robots, lógica compleja
    // ===================================================================
    {
        id: 'ard_robot_obstaculo',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 4,
        category: 'robot',
        title: 'Reto 18: Robot Esquiva Obstáculos',
        instructions: 'Programa un robot que avance y si detecta un obstáculo a menos de 20cm, se detenga.',
        concept: '**Este es un robot con lazo cerrado:** lee el sensor → decide → actúa. El sensor ultrasónico mide distancia. Si es < 20cm hay obstáculo y el robot frena. Si no, avanza. ¡Es inteligencia artificial básica!',
        funFact: '🚗 Los carros autónomos (Tesla, Waymo) usan esta MISMA lógica pero con muchos más sensores. La base es igual: "si hay obstáculo → frenar, si no → avanzar". ¡Tú estás aprendiendo lo mismo!',
        hints: ['El robot sigue un ciclo continuo: medir distancia → decidir → actuar', 'if distancia < 20 significa "hay obstáculo cerca", else = "camino libre"', 'Si hay obstáculo → detener(), si no → avanzar(velocidad)'],
        solution: [
            { id: 1, text: 'void loop() {', type: 'setup', explanation: '🔄 El robot repite este proceso sin parar: mide → decide → actúa.' },
            { id: 2, text: '  int distancia = medirDistancia();', type: 'setup', explanation: '📏 Llamamos a una función que lee el sensor ultrasónico y nos da la distancia en cm.' },
            { id: 3, text: '  if (distancia < 20) {', type: 'output', explanation: '🤔 ¿Hay algo a menos de 20cm? Si SÍ, hay obstáculo y entramos al bloque.' },
            { id: 4, text: '    detener();', type: 'output', explanation: '🛑 ¡Frena! Apagamos los motores para no chocar.' },
            { id: 5, text: '    Serial.println("¡Obstáculo!");', type: 'output', explanation: '📡 Enviamos aviso a la PC para saber qué pasó (debugging).' },
            { id: 6, text: '  } else {', type: 'setup', explanation: '↩️ Si NO hay obstáculo (distancia >= 20cm)...' },
            { id: 7, text: '    avanzar(200);', type: 'output', explanation: '🏃 ¡Avanza! El parámetro 200 es la velocidad (de 0 a 255).' },
            { id: 8, text: '  }', type: 'setup', explanation: '🔚 Fin del bloque if/else.' },
            { id: 9, text: '  delay(100);', type: 'setup', explanation: '⏳ Pequeña pausa para no saturar el sensor. Lee 10 veces por segundo.' },
            { id: 10, text: '}', type: 'setup', explanation: '🔚 Vuelve a empezar: mide → decide → actúa → mide → ...' }
        ],
        extra_blocks: [
            { id: 11, text: '  if (distancia > 20) {', type: 'wrong', whyWrong: 'Está al revés. > 20 significa "no hay obstáculo". Queremos detectar CUANDO hay obstáculo (< 20).' },
            { id: 12, text: '    avanzar();', type: 'wrong', whyWrong: 'Es posible pero le falta la velocidad. avanzar(200) le dice qué tan rápido ir.' },
            { id: 13, text: '  switch(distancia) {', type: 'wrong', whyWrong: 'switch compara valores exactos (5, 10, 15). Para rangos (< 20) necesitamos if/else.' }
        ]
    },
    {
        id: 'py_diccionario',
        name: 'Python',
        icon: '🐍',
        difficulty: 4,
        category: 'estructuras',
        title: 'Reto 19: Ficha del Robot',
        instructions: 'Crea un diccionario con los datos de tu robot y muestra su nombre y batería.',
        concept: '**Un diccionario** guarda datos con nombres (claves). En vez de posiciones numéricas (lista), usas nombres descriptivos. Es como una ficha técnica con etiquetas: nombre → "Explorer", bateria → 85.',
        funFact: '📇 Los diccionarios son como contactos del celular. No buscas "contacto #47", buscas por NOMBRE. robot["nombre"] es mucho más claro que robot[0]. ¡Los programadores prefieren claridad!',
        hints: ['Los diccionarios usan llaves {} con pares de clave: valor separados por comas', 'Para acceder a un dato usa corchetes con la clave: robot["nombre"]', 'Primero construye todo el diccionario { }, luego accede a sus datos con print()'],
        solution: [
            { id: 1, text: 'robot = {', type: 'setup', explanation: '📖 Las llaves {} crean un diccionario. Dentro van pares clave: valor.' },
            { id: 2, text: '    "nombre": "Explorer",', type: 'setup', explanation: '🏷️ Clave "nombre" → valor "Explorer". Es como una etiqueta pegada a un dato.' },
            { id: 3, text: '    "bateria": 85,', type: 'setup', explanation: '🔋 Clave "bateria" → valor 85 (número, sin comillas). Cada dato tiene su etiqueta.' },
            { id: 4, text: '    "sensores": 3', type: 'setup', explanation: '👁️ Clave "sensores" → valor 3. El último elemento no necesita coma al final.' },
            { id: 5, text: '}', type: 'setup', explanation: '🔚 Cierra el diccionario.' },
            { id: 6, text: 'print(f"Robot: {robot[\'nombre\']}")', type: 'output', explanation: '🖨️ robot["nombre"] busca la clave "nombre" y devuelve "Explorer". ¡Como buscar en una guía!' },
            { id: 7, text: 'print(f"Batería: {robot[\'bateria\']}%")', type: 'output', explanation: '🔋 Accedemos a la clave "bateria" y mostramos su valor: 85%.' }
        ],
        extra_blocks: [
            { id: 8, text: 'robot = ["Explorer", 85]', type: 'wrong', whyWrong: 'Los corchetes [] crean una LISTA, no un diccionario. En lista usarías robot[0], menos claro.' },
            { id: 9, text: 'print(robot.nombre)', type: 'wrong', whyWrong: 'La sintaxis con punto es de otros lenguajes. En Python usamos corchetes: robot["nombre"].' },
            { id: 10, text: 'robot{"nombre"} = "Explorer"', type: 'wrong', whyWrong: 'La sintaxis es incorrecta. Se usa llaves {} al crear, corchetes [] al acceder.' }
        ]
    },
    {
        id: 'ard_motor_control',
        name: 'Arduino',
        icon: '🔷',
        difficulty: 4,
        category: 'actuadores',
        title: 'Reto 20: Control de Motor DC',
        instructions: 'Programa un motor DC con el driver L298N: avanza 2 segundos, para, retrocede 1 segundo.',
        concept: '**El L298N** es un "amplificador de potencia". Arduino no puede mover motores directamente (muy poca fuerza). El L298N amplifica la señal. IN1/IN2 controlan la dirección y ENA la velocidad.',
        funFact: '⚡ Un pin de Arduino da máximo 40mA. Un motor necesita 200-500mA. ¡El L298N es como un traductor que convierte la señal débil de Arduino en una señal potente para el motor!',
        hints: ['Configura los pines de dirección como OUTPUT en setup()', 'La combinación de HIGH y LOW en IN1/IN2 controla la dirección del motor', 'Adelante = IN1:HIGH + IN2:LOW, Parar = ambos LOW, Atrás = IN1:LOW + IN2:HIGH'],
        solution: [
            { id: 1, text: 'void setup() {', type: 'setup', explanation: '🏁 Preparación.' },
            { id: 2, text: '  pinMode(8, OUTPUT);', type: 'setup', explanation: '🔌 Pin 8 = IN1 del L298N. Controla una dirección del motor.' },
            { id: 3, text: '  pinMode(9, OUTPUT);', type: 'setup', explanation: '🔌 Pin 9 = IN2 del L298N. IN1 + IN2 juntos definen si el motor va adelante, atrás o frena.' },
            { id: 4, text: '}', type: 'setup', explanation: '🔚 Fin preparación.' },
            { id: 5, text: 'void loop() {', type: 'setup', explanation: '🔄 Secuencia del motor.' },
            { id: 6, text: '  digitalWrite(8, HIGH);', type: 'output', explanation: '⬆️ IN1=HIGH + IN2=LOW = motor gira hacia ADELANTE. Es como un interruptor de dirección.' },
            { id: 7, text: '  digitalWrite(9, LOW);', type: 'output', explanation: '⬇️ IN2=LOW completa la dirección "adelante". HIGH+LOW = adelante, LOW+HIGH = atrás.' },
            { id: 8, text: '  delay(2000);', type: 'setup', explanation: '⏳ Motor avanza durante 2 segundos.' },
            { id: 9, text: '  digitalWrite(8, LOW);', type: 'output', explanation: '🛑 IN1=LOW + IN2=LOW = motor se DETIENE. Ambos en LOW = freno.' },
            { id: 10, text: '  digitalWrite(9, LOW);', type: 'output', explanation: '🛑 Confirmamos que ambos están en LOW para frenar completamente.' },
            { id: 11, text: '  delay(1000);', type: 'setup', explanation: '⏳ Pausa de 1 segundo.' },
            { id: 12, text: '  digitalWrite(8, LOW);', type: 'output', explanation: '⬇️ IN1=LOW + IN2=HIGH = motor gira en REVERSA.' },
            { id: 13, text: '  digitalWrite(9, HIGH);', type: 'output', explanation: '⬆️ La dirección se invirtió. El motor retrocede.' },
            { id: 14, text: '  delay(1000);', type: 'setup', explanation: '⏳ Retrocede 1 segundo. Luego loop() repite toda la secuencia.' },
            { id: 15, text: '}', type: 'setup', explanation: '🔚 Secuencia: adelante 2s → para 1s → atrás 1s → repite.' }
        ],
        extra_blocks: [
            { id: 16, text: 'motor.forward();', type: 'wrong', whyWrong: 'Parece simple pero Arduino no tiene motor.forward(). Controlas motores con digitalWrite en los pines del L298N.' },
            { id: 17, text: 'analogWrite(8, 200);', type: 'wrong', whyWrong: 'analogWrite controla velocidad (en pin ENA), no dirección. Los pines IN1/IN2 usan digitalWrite.' },
            { id: 18, text: 'servo.write(0);', type: 'wrong', whyWrong: 'Eso es para servo motor (ángulo). Un motor DC se controla con el driver L298N, no con Servo.' }
        ]
    },
    {
        id: 'py_while_loop',
        name: 'Python',
        icon: '🐍',
        difficulty: 3,
        category: 'ciclos',
        title: 'Reto 21: Cuenta Regresiva',
        instructions: 'Usa un ciclo while para hacer una cuenta regresiva del 5 al 1 y luego dí "¡Despegue!".',
        concept: '**while** repite código MIENTRAS una condición sea verdadera. A diferencia de for (repite un número exacto), while repite hasta que algo cambie. ¡Cuidado! Si la condición siempre es verdadera, el ciclo nunca para (bucle infinito).',
        funFact: '🚀 La NASA usa cuentas regresivas desde 1929. El famoso "10, 9, 8..." usa la misma lógica que un while: "mientras el contador sea mayor que 0, resta 1 y anuncia".',
        hints: ['"while" repite código MIENTRAS la condición sea verdadera', '¡MUY IMPORTANTE! Necesitas restar 1 dentro del while para que eventualmente pare', 'El mensaje de "¡Despegue!" va FUERA del while (sin indentación)'],
        solution: [
            { id: 1, text: 'cuenta = 5', type: 'setup', explanation: '📦 Empezamos en 5. Esta variable irá bajando: 5, 4, 3, 2, 1.' },
            { id: 2, text: 'while cuenta > 0:', type: 'setup', explanation: '🔄 "Mientras cuenta sea mayor que 0, repite". Cuando llegue a 0, para.' },
            { id: 3, text: '    print(cuenta)', type: 'output', explanation: '🖨️ Muestra el número actual: 5, luego 4, luego 3...' },
            { id: 4, text: '    cuenta = cuenta - 1', type: 'setup', explanation: '⬇️ ¡MUY IMPORTANTE! Restamos 1 cada vez. Sin esto, cuenta siempre sería 5 y el ciclo nunca pararía.' },
            { id: 5, text: 'print("🚀 ¡Despegue!")', type: 'output', explanation: '🚀 Esta línea está FUERA del while (sin indentación). Se ejecuta cuando cuenta llega a 0.' }
        ],
        extra_blocks: [
            { id: 6, text: 'while cuenta >= 0:', type: 'wrong', whyWrong: '>= 0 incluiría el 0 en la cuenta. Imprimiría: 5, 4, 3, 2, 1, 0. Queremos parar ANTES del 0.' },
            { id: 7, text: '    cuenta + 1', type: 'wrong', whyWrong: '¡Sumar haría que el ciclo nunca termine! Necesitamos RESTAR para que cuenta llegue a 0.' },
            { id: 8, text: 'while True:', type: 'wrong', whyWrong: 'while True es un ciclo INFINITO. Nunca pararía. Necesitamos una condición que se vuelva falsa.' }
        ]
    },
    {
        id: 'cpp_hola_mundo',
        name: 'C++',
        icon: '⚙️',
        difficulty: 4,
        category: 'estructura',
        title: 'Reto 22: Hola Mundo en C++',
        instructions: 'Arma el programa "Hola Mundo" en C++. Es más largo que en Python pero más poderoso.',
        concept: '**C++** es el lenguaje base de Arduino. Necesita más estructura: #include para importar, int main() como punto de inicio, y std::cout para imprimir. Es más estricto que Python pero más rápido.',
        funFact: '⚡ C++ fue creado por Bjarne Stroustrup en 1979. Es TAN rápido que se usa para videojuegos (Unreal Engine), navegadores (Chrome) y sistemas operativos (Windows). ¡Python es 50x más lento!',
        hints: ['C++ necesita #include para importar librerías e int main() como función principal', 'std::cout << es la forma de mostrar texto en pantalla en C++', 'No olvides return 0 al final y cerrar la llave } de main()'],
        solution: [
            { id: 1, text: '#include <iostream>', type: 'setup', explanation: '📚 Importamos la librería iostream (input/output stream). Nos permite usar cout para imprimir.' },
            { id: 2, text: 'int main() {', type: 'setup', explanation: '🏁 main() es el punto de entrada. "int" significa que devolverá un número al terminar.' },
            { id: 3, text: '    std::cout << "Hola Mundo!" << std::endl;', type: 'output', explanation: '🖨️ std::cout << es como print(). << "envía" texto a la pantalla. endl = nueva línea.' },
            { id: 4, text: '    return 0;', type: 'setup', explanation: '📤 return 0 dice al sistema "todo salió bien". Es obligatorio en main().' },
            { id: 5, text: '}', type: 'setup', explanation: '🔚 Cierra main(). En C++ cada { tiene su } correspondiente.' }
        ],
        extra_blocks: [
            { id: 6, text: 'print("Hola Mundo!")', type: 'wrong', whyWrong: 'print() es de Python. En C++ usamos std::cout << "texto" para mostrar en pantalla.' },
            { id: 7, text: 'void setup() {', type: 'wrong', whyWrong: 'void setup() es de Arduino. En C++ estándar usamos int main() como punto de inicio.' },
            { id: 8, text: 'System.out.println("Hola");', type: 'wrong', whyWrong: 'Eso es Java, no C++. Cada lenguaje tiene su propia forma de imprimir.' }
        ]
    },
    {
        id: 'cpp_if_else',
        name: 'C++',
        icon: '⚙️',
        difficulty: 4,
        category: 'condiciones',
        title: 'Reto 23: Detector de Obstáculos C++',
        instructions: 'Escribe un programa C++ que verifique si un sensor detecta un obstáculo (< 20cm).',
        concept: '**if/else en C++** es similar a Python pero usa llaves {} en vez de indentación, y necesita paréntesis () alrededor de la condición. Es la misma lógica, diferente sintaxis.',
        funFact: '🔄 La lógica if/else es IGUAL en casi todos los lenguajes. Si aprendes en uno, entiendes en todos. Solo cambia la forma de escribirlo (sintaxis). ¡El pensamiento lógico es universal!',
        hints: ['En C++ las condiciones van entre paréntesis () y el código entre llaves {}', 'Primero declara la variable con "int", luego usa if/else para decidir', 'std::cout << muestra texto, return 0 termina el programa correctamente'],
        solution: [
            { id: 1, text: '#include <iostream>', type: 'setup', explanation: '📚 Importamos para poder usar cout.' },
            { id: 2, text: 'int main() {', type: 'setup', explanation: '🏁 Punto de entrada del programa.' },
            { id: 3, text: '    int distancia = 15;', type: 'setup', explanation: '📦 Simulamos que el sensor leyó 15cm. "int" = número entero. Termina con punto y coma ;' },
            { id: 4, text: '    if (distancia < 20) {', type: 'output', explanation: '🤔 ¿15 es menor que 20? SÍ. En C++ la condición va entre paréntesis ().' },
            { id: 5, text: '        std::cout << "¡Obstáculo!" << std::endl;', type: 'output', explanation: '🛑 Como 15 < 20 es verdadero, se ejecuta esta línea.' },
            { id: 6, text: '    } else {', type: 'setup', explanation: '↩️ } cierra el if, else { abre el bloque alternativo.' },
            { id: 7, text: '        std::cout << "Camino libre" << std::endl;', type: 'output', explanation: '✅ Si distancia fuera >= 20, se ejecutaría esta línea en su lugar.' },
            { id: 8, text: '    }', type: 'setup', explanation: '🔚 Cierra el bloque else.' },
            { id: 9, text: '    return 0;', type: 'setup', explanation: '📤 Fin del programa, todo bien.' },
            { id: 10, text: '}', type: 'setup', explanation: '🔚 Cierra main().' }
        ],
        extra_blocks: [
            { id: 11, text: 'if distancia < 20:', type: 'wrong', whyWrong: 'Esa es la sintaxis de Python (sin paréntesis, con : al final). C++ necesita paréntesis y llaves.' },
            { id: 12, text: 'elif (distancia > 20)', type: 'wrong', whyWrong: '"elif" es de Python. En C++ se escribe "else if" (dos palabras separadas).' },
            { id: 13, text: 'print("¡Obstáculo!")', type: 'wrong', whyWrong: 'print() es de Python. En C++ usamos std::cout << para mostrar texto.' }
        ]
    },
    {
        id: 'py_try_except',
        name: 'Python',
        icon: '🐍',
        difficulty: 4,
        category: 'errores',
        title: 'Reto 24: Atrapa el Error',
        instructions: 'Usa try/except para manejar errores cuando el usuario ingresa texto en vez de número.',
        concept: '**try/except** es como una red de seguridad. "try" INTENTA ejecutar código que podría fallar. Si falla, en vez de crashear, "except" captura el error y hace algo útil. ¡Tu programa no se rompe!',
        funFact: '🛡️ Los programas profesionales tienen try/except EN TODAS PARTES. Gmail, YouTube, el navegador... todos usan manejo de errores. Sin ellos, cualquier error mínimo los cerraría. ¡El error handling es lo que separa un programa amateur de uno profesional!',
        hints: ['"try:" intenta ejecutar código que PODRÍA fallar', 'int(input()) puede fallar si el usuario escribe texto en vez de número', 'En Python se usa "except", no "catch". Especifica el tipo: except ValueError:'],
        solution: [
            { id: 1, text: 'try:', type: 'setup', explanation: '🧪 "try" = "intenta esto". El código dentro podría fallar, y estamos preparados.' },
            { id: 2, text: '    numero = int(input("Número: "))', type: 'setup', explanation: '🔢 int() convierte texto a número. Si el usuario escribe "hola" en vez de un número, ¡FALLA!' },
            { id: 3, text: '    print(f"El doble es {numero * 2}")', type: 'output', explanation: '✅ Si todo salió bien, muestra el doble. Solo se ejecuta si la línea anterior no falló.' },
            { id: 4, text: 'except ValueError:', type: 'setup', explanation: '🛡️ Si int() falla, Python salta aquí en vez de crashear. ValueError = error de valor incorrecto.' },
            { id: 5, text: '    print("❌ Eso no es un número")', type: 'output', explanation: '⚠️ Mensaje amigable. El programa sigue funcionando. ¡No se rompió!' }
        ],
        extra_blocks: [
            { id: 6, text: 'catch ValueError:', type: 'wrong', whyWrong: '"catch" es de Java/JavaScript. En Python se usa "except".' },
            { id: 7, text: 'except:', type: 'wrong', whyWrong: 'Funciona pero es mala práctica. Siempre especifica QUÉ tipo de error capturas (ValueError, TypeError, etc.).' },
            { id: 8, text: 'if error:', type: 'wrong', whyWrong: 'Los errores no se manejan con if. try/except es el mecanismo correcto para errores inesperados.' }
        ]
    },
    // ===================================================================
    // 🏜️ NIVEL 5: ROVERS AUTÓNOMOS — Clases, algoritmos, máquinas de estado
    // ===================================================================
    {
        id: 'py_clase_rover',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'clases',
        title: 'Reto 25: Clase Rover Marciano',
        instructions: 'Crea una clase "Rover" con atributos nombre, batería y velocidad. Luego crea un rover y muestra su estado.',
        concept: '**Las clases** son planos para crear objetos. Definen qué datos tiene (atributos) y qué puede hacer (métodos). Un Rover tiene nombre, batería y velocidad. ¡Es como el plano de un robot real!',
        funFact: '🚀 El rover Perseverance de la NASA tiene miles de líneas de código en Python y C. Su "clase" interna maneja batería, temperatura, motores y cámaras. ¡Tú estás aprendiendo lo mismo!',
        hints: ['Las clases se definen con "class" y usan __init__ para inicializar atributos', 'self se refiere al propio objeto (el rover que se crea)', 'Primero define la clase, luego crea un objeto con NombreClase()'],
        solution: [
            { id: 1, text: 'class Rover:', type: 'setup', explanation: '📐 "class Rover:" define el plano de nuestro rover. Todo lo indentado pertenece a la clase.' },
            { id: 2, text: '    def __init__(self, nombre):', type: 'setup', explanation: '🔧 __init__ se ejecuta al crear un rover. "self" = este rover, "nombre" = dato que recibe.' },
            { id: 3, text: '        self.nombre = nombre', type: 'setup', explanation: '🏷️ Guardamos el nombre dentro del rover. self.nombre = atributo del objeto.' },
            { id: 4, text: '        self.bateria = 100', type: 'setup', explanation: '🔋 Todo rover nuevo empieza con 100% de batería.' },
            { id: 5, text: '        self.velocidad = 0', type: 'setup', explanation: '🏎️ Velocidad inicial: detenido (0 km/h).' },
            { id: 6, text: 'spirit = Rover("Spirit")', type: 'output', explanation: '🤖 ¡Creamos un rover llamado Spirit! Python llama a __init__ automáticamente.' },
            { id: 7, text: 'print(f"{spirit.nombre}: {spirit.bateria}%")', type: 'output', explanation: '🖨️ Accedemos a los atributos con el punto: spirit.nombre, spirit.bateria.' }
        ],
        extra_blocks: [
            { id: 8, text: 'def Rover(nombre):', type: 'wrong', whyWrong: '"def" crea funciones, no clases. Para clases usamos "class".' },
            { id: 9, text: '    def init(self, nombre):', type: 'wrong', whyWrong: 'El método constructor se llama __init__ (con doble guion bajo), no "init".' },
            { id: 10, text: 'spirit = new Rover("Spirit")', type: 'wrong', whyWrong: 'Python NO usa "new". Simplemente llamas Rover("Spirit") directamente.' }
        ]
    },
    {
        id: 'py_a_star',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'algoritmos',
        title: 'Reto 26: Navegación del Rover',
        instructions: 'Crea una función que calcule la distancia Manhattan entre dos puntos del mapa para que el rover planifique su ruta.',
        concept: '**La distancia Manhattan** es la suma de las diferencias absolutas en X e Y. Los rovers la usan para estimar qué tan lejos está un objetivo moviéndose en cuadrícula (como calles de una ciudad).',
        funFact: '🗺️ Se llama "Manhattan" porque en Manhattan (Nueva York) las calles forman una cuadrícula. No puedes ir en diagonal, solo derecho o girando. ¡Los rovers en terreno rocoso navegan parecido!',
        hints: ['La distancia Manhattan se calcula como |x1-x2| + |y1-y2|', 'abs() devuelve el valor absoluto (siempre positivo) de un número', 'La función recibe 4 parámetros: x1, y1, x2, y2'],
        solution: [
            { id: 1, text: 'def distancia_manhattan(x1, y1, x2, y2):', type: 'setup', explanation: '📐 Función que recibe dos puntos (x1,y1) y (x2,y2) del mapa.' },
            { id: 2, text: '    return abs(x1 - x2) + abs(y1 - y2)', type: 'output', explanation: '📏 abs() = valor absoluto. Sumamos distancia horizontal + vertical. Simple pero efectivo.' },
            { id: 3, text: 'dist = distancia_manhattan(0, 0, 3, 4)', type: 'setup', explanation: '🎯 Calculamos distancia del punto (0,0) al (3,4). Resultado: |0-3| + |0-4| = 3 + 4 = 7.' },
            { id: 4, text: 'print(f"Distancia al objetivo: {dist} casillas")', type: 'output', explanation: '🖨️ Muestra "Distancia al objetivo: 7 casillas". El rover sabe cuánto falta.' }
        ],
        extra_blocks: [
            { id: 5, text: '    return (x1 - x2) + (y1 - y2)', type: 'wrong', whyWrong: 'Sin abs() el resultado puede ser negativo. Las distancias siempre son positivas.' },
            { id: 6, text: '    return sqrt((x1-x2)**2 + (y1-y2)**2)', type: 'wrong', whyWrong: 'Esa es la distancia Euclidiana (línea recta). Manhattan no permite diagonales.' },
            { id: 7, text: 'import math', type: 'wrong', whyWrong: 'No necesitas importar math. abs() es una función integrada de Python.' }
        ]
    },
    {
        id: 'py_clasificador',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'condiciones',
        title: 'Reto 27: Clasificador de Rocas',
        instructions: 'Crea una función que clasifique rocas marcianas según su densidad: liviana, media o densa.',
        concept: '**Los rovers clasifican muestras** usando sensores y lógica condicional. Según los valores medidos, categorizan lo que encuentran. Es la base de la ciencia automatizada en otros planetas.',
        funFact: '🪨 El rover Curiosity tiene un láser que vaporiza rocas y analiza el gas resultante. ¡Puede saber de qué está hecha una roca sin tocarla! Tu función hace algo similar pero con densidad.',
        hints: ['Usa if/elif/else para crear tres categorías según la densidad', 'Piensa en los límites: < 2.5 = liviana, < 4.0 = media, else = densa', 'La función recibe la densidad y devuelve la clasificación como texto'],
        solution: [
            { id: 1, text: 'def clasificar_roca(densidad):', type: 'setup', explanation: '🔬 Función que recibe la densidad de una roca en g/cm³.' },
            { id: 2, text: '    if densidad < 2.5:', type: 'setup', explanation: '🪶 Si la densidad es menor a 2.5 g/cm³, es una roca liviana (como piedra pómez).' },
            { id: 3, text: '        return "Roca liviana"', type: 'output', explanation: '📤 Devuelve la clasificación. El rover registra esta categoría.' },
            { id: 4, text: '    elif densidad < 4.0:', type: 'setup', explanation: '⚖️ Entre 2.5 y 4.0 g/cm³, es densidad media (como basalto).' },
            { id: 5, text: '        return "Roca media"', type: 'output', explanation: '📤 Clasificación intermedia.' },
            { id: 6, text: '    else:', type: 'setup', explanation: '🪨 Si es 4.0 o más, es muy densa (posiblemente con minerales metálicos).' },
            { id: 7, text: '        return "Roca densa"', type: 'output', explanation: '📤 ¡Estas son las más interesantes para los científicos!' },
            { id: 8, text: 'print(clasificar_roca(3.2))', type: 'output', explanation: '🖨️ 3.2 está entre 2.5 y 4.0, así que imprime "Roca media".' }
        ],
        extra_blocks: [
            { id: 9, text: '    if densidad == 2.5:', type: 'wrong', whyWrong: '== verifica un valor exacto. Necesitas < para verificar un rango (menor que).' },
            { id: 10, text: '    elif densidad > 4.0:', type: 'wrong', whyWrong: 'El orden importa: si primero verificas > 4.0, las rocas medias nunca se clasifican correctamente.' },
            { id: 11, text: '    switch(densidad):', type: 'wrong', whyWrong: 'Python no tiene switch (hasta Python 3.10 con match). Usa if/elif/else.' }
        ]
    },
    {
        id: 'py_fsm_rover',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'logica',
        title: 'Reto 28: Máquina de Estados del Rover',
        instructions: 'Implementa una máquina de estados simple para el rover: EXPLORANDO → ANALIZANDO → TRANSMITIENDO.',
        concept: '**Una Máquina de Estados Finitos (FSM)** controla el comportamiento del rover según su estado actual. Cada estado tiene transiciones a otros estados. ¡Es como el cerebro del rover que decide qué hacer!',
        funFact: '🧠 Los rovers de la NASA usan máquinas de estado con docenas de estados: dormido, conduciendo, perforando, fotografiando, transmitiendo... Cada estado tiene reglas estrictas de transición.',
        hints: ['Una FSM simple usa una variable "estado" y un diccionario con las transiciones', 'El diccionario mapea estado_actual → siguiente_estado', 'Un while loop simula el funcionamiento continuo del rover'],
        solution: [
            { id: 1, text: 'estados = {"EXPLORANDO": "ANALIZANDO",', type: 'setup', explanation: '📖 Diccionario de transiciones: de EXPLORANDO pasa a ANALIZANDO.' },
            { id: 2, text: '    "ANALIZANDO": "TRANSMITIENDO",', type: 'setup', explanation: '🔬 De ANALIZANDO pasa a TRANSMITIENDO los datos a la Tierra.' },
            { id: 3, text: '    "TRANSMITIENDO": "EXPLORANDO"}', type: 'setup', explanation: '📡 De TRANSMITIENDO vuelve a EXPLORANDO. ¡El ciclo se repite!' },
            { id: 4, text: 'estado = "EXPLORANDO"', type: 'setup', explanation: '🏁 Estado inicial: el rover empieza explorando el terreno.' },
            { id: 5, text: 'for ciclo in range(6):', type: 'setup', explanation: '🔄 Simulamos 6 transiciones para ver el rover cambiar de estado.' },
            { id: 6, text: '    print(f"Rover: {estado}")', type: 'output', explanation: '🖨️ Muestra el estado actual del rover en cada ciclo.' },
            { id: 7, text: '    estado = estados[estado]', type: 'output', explanation: '➡️ Busca en el diccionario el siguiente estado y transiciona. ¡Simple y poderoso!' }
        ],
        extra_blocks: [
            { id: 8, text: '    if estado == "EXPLORANDO":', type: 'wrong', whyWrong: 'Usar if/elif funciona pero es menos elegante. El diccionario de transiciones es más limpio y escalable.' },
            { id: 9, text: '    estado += 1', type: 'wrong', whyWrong: 'Los estados son textos, no números. No puedes sumarles 1.' },
            { id: 10, text: 'while True:', type: 'wrong', whyWrong: 'while True crearía un bucle infinito. Usamos for con range() para controlar cuántos ciclos simular.' }
        ]
    },
    {
        id: 'py_sensor_fusion',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'sensores',
        title: 'Reto 29: Fusión de Sensores',
        instructions: 'Combina lecturas de 3 sensores del rover (temperatura, presión, radiación) y calcula si el terreno es seguro.',
        concept: '**La fusión de sensores** combina datos de múltiples fuentes para tomar mejores decisiones. Un solo sensor puede fallar, pero si 3 sensores coinciden, la decisión es más confiable.',
        funFact: '🛰️ Los rovers marcianos tienen más de 20 sensores que se combinan: cámaras, espectrómetros, termómetros, anemómetros... La fusión de todos estos datos les permite "entender" Marte.',
        hints: ['Crea variables para cada sensor con valores simulados', 'Define rangos seguros para cada sensor usando booleanos', 'Usa "and" para verificar que TODOS los sensores estén en rango'],
        solution: [
            { id: 1, text: 'temp = -20', type: 'setup', explanation: '🌡️ Temperatura simulada: -20°C (normal en Marte).' },
            { id: 2, text: 'presion = 650', type: 'setup', explanation: '🌬️ Presión atmosférica: 650 Pa (muy baja en Marte).' },
            { id: 3, text: 'radiacion = 0.3', type: 'setup', explanation: '☢️ Nivel de radiación: 0.3 Sv/año (relativamente bajo).' },
            { id: 4, text: 'temp_ok = -60 < temp < 20', type: 'setup', explanation: '✅ ¿Temperatura entre -60°C y 20°C? Python permite comparaciones encadenadas.' },
            { id: 5, text: 'presion_ok = presion > 400', type: 'setup', explanation: '✅ ¿Presión mayor a 400 Pa? Suficiente para que los instrumentos funcionen.' },
            { id: 6, text: 'rad_ok = radiacion < 0.5', type: 'setup', explanation: '✅ ¿Radiación menor a 0.5 Sv/año? Niveles aceptables para operar.' },
            { id: 7, text: 'seguro = temp_ok and presion_ok and rad_ok', type: 'output', explanation: '🔗 "and" requiere que TODOS sean True. Si uno falla, seguro = False.' },
            { id: 8, text: 'print(f"Terreno seguro: {seguro}")', type: 'output', explanation: '🖨️ Muestra True si todos los sensores dan valores dentro del rango seguro.' }
        ],
        extra_blocks: [
            { id: 9, text: 'seguro = temp_ok or presion_ok or rad_ok', type: 'wrong', whyWrong: '"or" solo necesita que UNO sea verdadero. Para seguridad necesitamos que TODOS estén bien (and).' },
            { id: 10, text: 'temp_ok = temp == -20', type: 'wrong', whyWrong: '== verifica un valor exacto. Necesitamos un RANGO de temperaturas seguras, no un valor exacto.' },
            { id: 11, text: 'if temp & presion & radiacion:', type: 'wrong', whyWrong: '& es un operador de bits, no lógico. Para lógica booleana usamos "and".' }
        ]
    },
    {
        id: 'py_energy_manager',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'logica',
        title: 'Reto 30: Gestión de Energía',
        instructions: 'Crea un sistema que ajuste la velocidad del rover según su nivel de batería para optimizar el consumo.',
        concept: '**La gestión de energía** es CRÍTICA en rovers. Si la batería se agota lejos de la base, el rover muere. Por eso ajustan velocidad y actividades según la energía restante.',
        funFact: '🔋 El rover Opportunity de la NASA funcionó 15 AÑOS en Marte (estaba diseñado para 90 días). Su excelente gestión de energía solar fue clave. ¡Murió en una tormenta de polvo que tapó sus paneles!',
        hints: ['Usa if/elif/else con diferentes niveles de batería', 'A mayor batería, mayor velocidad; a menor batería, el rover ahorra energía', 'Incluye un modo de emergencia cuando la batería es crítica'],
        solution: [
            { id: 1, text: 'def modo_energia(bateria):', type: 'setup', explanation: '🔧 Función que recibe el nivel de batería (0-100%) y decide la velocidad.' },
            { id: 2, text: '    if bateria > 70:', type: 'setup', explanation: '🟢 Batería alta (>70%): modo rendimiento máximo.' },
            { id: 3, text: '        return "Máxima velocidad: 5 km/h"', type: 'output', explanation: '🏎️ Con energía de sobra, el rover puede ir a toda velocidad.' },
            { id: 4, text: '    elif bateria > 30:', type: 'setup', explanation: '🟡 Batería media (30-70%): modo ahorro moderado.' },
            { id: 5, text: '        return "Velocidad media: 2 km/h"', type: 'output', explanation: '🐢 Reduce velocidad para conservar batería. Prioriza la misión.' },
            { id: 6, text: '    else:', type: 'setup', explanation: '🔴 Batería crítica (<30%): modo supervivencia.' },
            { id: 7, text: '        return "Modo ahorro: 0.5 km/h"', type: 'output', explanation: '🆘 Casi no se mueve. Solo lo esencial para sobrevivir hasta recargar.' },
            { id: 8, text: 'print(modo_energia(45))', type: 'output', explanation: '🖨️ 45% está entre 30 y 70, así que imprime "Velocidad media: 2 km/h".' }
        ],
        extra_blocks: [
            { id: 9, text: '    if bateria > 30:', type: 'wrong', whyWrong: 'Si verificas > 30 primero, cualquier batería > 30 entra ahí (incluso 95%). El orden importa: de mayor a menor.' },
            { id: 10, text: '        return 5', type: 'wrong', whyWrong: 'Devolver solo un número no es descriptivo. Un mensaje completo ayuda a entender el modo activo.' },
            { id: 11, text: '    elif bateria < 70:', type: 'wrong', whyWrong: 'Con < en vez de >, la lógica se invierte. Verifica siempre con > para ir de mayor a menor batería.' }
        ]
    },
    // ===================================================================
    // 🌿 NIVEL 6: AERO-BIOSFERA — Drones agrícolas, invernaderos, eco-robótica
    // ===================================================================
    {
        id: 'py_sensor_humedad',
        name: 'Python',
        icon: '🐍',
        difficulty: 3,
        category: 'sensores',
        title: 'Reto 31: Sensor de Humedad',
        instructions: 'Lee el sensor de humedad del suelo y determina si la planta necesita riego.',
        concept: '**Los sensores de humedad** miden cuánta agua hay en el suelo. En agricultura de precisión, los drones y robots usan estos sensores para regar solo donde se necesita, ahorrando agua.',
        funFact: '💧 La agricultura de precisión ahorra hasta un 30% de agua usando sensores de humedad. En un mundo donde el agua escasea, ¡la tecnología nos ayuda a cuidar los cultivos sin desperdiciar!',
        hints: ['Crea una variable con el valor del sensor de humedad (0-100%)', 'Usa if/else para decidir si necesita riego (por debajo de cierto umbral)', 'Un umbral de 40% es común: si la humedad es menor, hay que regar'],
        solution: [
            { id: 1, text: 'humedad = 35', type: 'setup', explanation: '💧 Lectura del sensor: 35% de humedad en el suelo (bajo).' },
            { id: 2, text: 'umbral_riego = 40', type: 'setup', explanation: '🎯 Definimos el límite: si baja de 40%, la planta necesita agua.' },
            { id: 3, text: 'if humedad < umbral_riego:', type: 'setup', explanation: '🤔 ¿35 es menor que 40? SÍ, el suelo está seco.' },
            { id: 4, text: '    print("🚿 ¡Activar riego!")', type: 'output', explanation: '✅ El suelo necesita agua. El sistema activa el riego automático.' },
            { id: 5, text: 'else:', type: 'setup', explanation: '↩️ Si la humedad es suficiente (>= 40%)...' },
            { id: 6, text: '    print("✅ Humedad óptima")', type: 'output', explanation: '👌 No hace falta regar. ¡Ahorramos agua!' }
        ],
        extra_blocks: [
            { id: 7, text: 'if humedad > umbral_riego:', type: 'wrong', whyWrong: 'Al revés: > 40 significa que HAY suficiente agua. Queremos detectar cuándo FALTA agua (< 40).' },
            { id: 8, text: 'humedad = "35"', type: 'wrong', whyWrong: 'Con comillas es texto, no número. No podrías comparar con < correctamente.' },
            { id: 9, text: 'if humedad = 40:', type: 'wrong', whyWrong: 'Un solo = asigna, no compara. Necesitas < (menor que) o == (igual a).' }
        ]
    },
    {
        id: 'py_riego_auto',
        name: 'Python',
        icon: '🐍',
        difficulty: 4,
        category: 'automatizacion',
        title: 'Reto 32: Riego Automático',
        instructions: 'Crea una función que calcule cuántos minutos regar según la humedad del suelo y la temperatura ambiente.',
        concept: '**El riego inteligente** ajusta la cantidad de agua según las condiciones. Más calor = más evaporación = más riego. Menos humedad = suelo más seco = más riego. ¡Matemáticas para salvar cultivos!',
        funFact: '🌾 Israel es líder mundial en riego inteligente. Con tecnología de sensores y automatización, logran cultivar en el desierto usando 75% menos agua que los métodos tradicionales. ¡Eso es agro-robótica!',
        hints: ['La función recibe humedad y temperatura como parámetros', 'Calcula minutos base según la humedad, luego ajusta por temperatura', 'Usa max() para asegurar que nunca devuelva un valor negativo'],
        solution: [
            { id: 1, text: 'def calcular_riego(humedad, temp):', type: 'setup', explanation: '🔧 Función que recibe humedad del suelo (%) y temperatura (°C).' },
            { id: 2, text: '    minutos = max(0, (50 - humedad)) // 5', type: 'setup', explanation: '⏱️ Cuanto menor la humedad, más minutos. max(0,...) evita negativos. // es división entera.' },
            { id: 3, text: '    if temp > 30:', type: 'setup', explanation: '🌡️ ¿Hace mucho calor? Más evaporación, necesitamos más agua.' },
            { id: 4, text: '        minutos = minutos + 3', type: 'setup', explanation: '☀️ Agregamos 3 minutos extra de riego si hace más de 30°C.' },
            { id: 5, text: '    return minutos', type: 'output', explanation: '📤 Devuelve los minutos de riego calculados.' },
            { id: 6, text: 'riego = calcular_riego(25, 35)', type: 'setup', explanation: '🧪 Probamos: humedad 25% (baja) y 35°C (caluroso).' },
            { id: 7, text: 'print(f"Regar {riego} minutos")', type: 'output', explanation: '🖨️ (50-25)//5 = 5, +3 por calor = 8 minutos de riego.' }
        ],
        extra_blocks: [
            { id: 8, text: '    minutos = (50 - humedad) / 5', type: 'wrong', whyWrong: 'Sin max(0,...) puede dar negativo si humedad > 50. Y / da decimales, // es más limpio.' },
            { id: 9, text: '    if temp > 30', type: 'wrong', whyWrong: 'Falta el : (dos puntos) al final. En Python, if siempre termina con dos puntos.' },
            { id: 10, text: '    return', type: 'wrong', whyWrong: 'return sin valor devuelve None. Necesitas devolver la variable minutos.' }
        ]
    },
    {
        id: 'py_mapa_cultivo',
        name: 'Python',
        icon: '🐍',
        difficulty: 4,
        category: 'estructuras',
        title: 'Reto 33: Mapa de Cultivos',
        instructions: 'Crea una cuadrícula 3x3 que represente un campo de cultivo y analiza cuántas zonas necesitan atención.',
        concept: '**Los drones agrícolas** toman fotos aéreas y dividen el campo en zonas. Cada zona tiene un estado: saludable (🌱), necesita agua (🟡) o enfermo (🔴). Con una matriz podemos mapear todo el campo.',
        funFact: '🛸 Los drones agrícolas pueden mapear 100 hectáreas en 30 minutos. Detectan problemas que a simple vista tomaría días encontrar. ¡Un agricultor moderno es también un piloto de drones!',
        hints: ['Una lista de listas es una cuadrícula (matriz). Cada sub-lista es una fila', 'Usa dos ciclos for anidados para recorrer filas y columnas', 'Cuenta las zonas que necesitan atención con un contador'],
        solution: [
            { id: 1, text: 'campo = [["🌱","🟡","🌱"],', type: 'setup', explanation: '🗺️ Fila 1 del campo. 🌱=saludable, 🟡=necesita agua.' },
            { id: 2, text: '         ["🔴","🌱","🟡"],', type: 'setup', explanation: '🗺️ Fila 2. 🔴=enfermo, necesita tratamiento urgente.' },
            { id: 3, text: '         ["🌱","🌱","🔴"]]', type: 'setup', explanation: '🗺️ Fila 3. Tenemos un mapa completo 3x3 del campo.' },
            { id: 4, text: 'alertas = 0', type: 'setup', explanation: '📊 Contador de zonas que necesitan atención.' },
            { id: 5, text: 'for fila in campo:', type: 'setup', explanation: '🔄 Recorremos cada fila del campo.' },
            { id: 6, text: '    for zona in fila:', type: 'setup', explanation: '🔄 Dentro de cada fila, revisamos cada zona individual.' },
            { id: 7, text: '        if zona != "🌱":', type: 'setup', explanation: '🤔 Si la zona NO es saludable (🌱), necesita atención.' },
            { id: 8, text: '            alertas += 1', type: 'output', explanation: '📈 Sumamos 1 al contador. alertas += 1 es lo mismo que alertas = alertas + 1.' },
            { id: 9, text: 'print(f"Zonas con alerta: {alertas}")', type: 'output', explanation: '🖨️ Hay 4 zonas no saludables (2🟡 + 2🔴). ¡El drone planifica su ruta de atención!' }
        ],
        extra_blocks: [
            { id: 10, text: 'for zona in campo:', type: 'wrong', whyWrong: '"campo" contiene filas (listas), no zonas directamente. Necesitas un for anidado.' },
            { id: 11, text: '        if zona == "🟡":', type: 'wrong', whyWrong: 'Solo contarías las zonas amarillas. ¿Y las rojas? Mejor verificar != "🌱" (todo lo que NO sea saludable).' },
            { id: 12, text: '    alertas = alertas + fila', type: 'wrong', whyWrong: 'No puedes sumar una lista (fila) a un número (alertas). Necesitas recorrer la fila zona por zona.' }
        ]
    },
    {
        id: 'py_alerta_plaga',
        name: 'Python',
        icon: '🐍',
        difficulty: 4,
        category: 'logica',
        title: 'Reto 34: Detección de Plagas',
        instructions: 'Crea un sistema que analice datos de sensores de un invernadero para detectar y alertar sobre posibles plagas.',
        concept: '**Los biosensores** detectan cambios en temperatura, humedad y CO₂ que indican plagas. Si múltiples indicadores son anormales al mismo tiempo, el sistema genera una alerta. ¡Es como un doctor robot para plantas!',
        funFact: '🐛 Algunas plagas cambian la humedad y temperatura de las hojas antes de ser visibles. Los sensores pueden detectar plagas hasta 2 semanas antes que el ojo humano. ¡Prevención robótica!',
        hints: ['Crea un diccionario con los datos de los sensores del invernadero', 'Cuenta cuántos sensores están fuera de rango normal', 'Si 2 o más indicadores son anormales, genera alerta de plaga'],
        solution: [
            { id: 1, text: 'sensores = {"temp": 32, "humedad": 85,', type: 'setup', explanation: '📊 Datos del invernadero: temperatura alta y humedad muy alta.' },
            { id: 2, text: '    "co2": 600, "ph_suelo": 5.5}', type: 'setup', explanation: '🔬 CO₂ y pH del suelo. Valores que los biosensores miden constantemente.' },
            { id: 3, text: 'anomalias = 0', type: 'setup', explanation: '📈 Contador de indicadores fuera de rango normal.' },
            { id: 4, text: 'if sensores["temp"] > 30: anomalias += 1', type: 'setup', explanation: '🌡️ Temperatura > 30°C es anormal. Las plagas prosperan en calor.' },
            { id: 5, text: 'if sensores["humedad"] > 80: anomalias += 1', type: 'setup', explanation: '💧 Humedad > 80% favorece hongos y plagas.' },
            { id: 6, text: 'if anomalias >= 2:', type: 'output', explanation: '🚨 ¿2 o más indicadores son anormales? ¡Alta probabilidad de plaga!' },
            { id: 7, text: '    print("⚠️ ALERTA: Riesgo de plaga")', type: 'output', explanation: '🔔 El sistema notifica al agricultor. Temp alta + humedad alta = ¡peligro!' },
            { id: 8, text: 'else: print("✅ Invernadero estable")', type: 'output', explanation: '👌 Si hay 0 o 1 anomalías, no hay riesgo significativo.' }
        ],
        extra_blocks: [
            { id: 9, text: 'if sensores["temp"] and sensores["humedad"]:', type: 'wrong', whyWrong: 'Esto verifica que existan, no sus valores. Necesitas comparar: > 30, > 80, etc.' },
            { id: 10, text: 'if anomalias == 2:', type: 'wrong', whyWrong: '== solo detecta exactamente 2. Con >= detectas 2 o más, que es más seguro.' },
            { id: 11, text: 'sensores.temp > 30', type: 'wrong', whyWrong: 'Con diccionarios en Python se usa corchetes: sensores["temp"], no punto.' }
        ]
    },
    {
        id: 'py_drone_vuelo',
        name: 'Python',
        icon: '🐍',
        difficulty: 3,
        category: 'secuencia',
        title: 'Reto 35: Secuencia de Vuelo',
        instructions: 'Programa la secuencia de despegue de un dron agrícola: verificar, encender motores, despegar.',
        concept: '**Los drones siguen secuencias estrictas.** Antes de volar, verifican batería, GPS, viento y sensores. Si algo falla, ¡abortan! Es programación secuencial con validaciones de seguridad.',
        funFact: '🚁 Los drones agrícolas pueden fumigar 10 hectáreas por hora volando a 5 metros de altura. Son 40 veces más rápidos que fumigar a mano. ¡Y usan 30% menos pesticida porque aplican solo donde se necesita!',
        hints: ['Usa una lista con los pasos de la secuencia de despegue', 'Un for loop ejecuta cada paso en orden', 'Cada paso puede ser un print que muestra el progreso'],
        solution: [
            { id: 1, text: 'secuencia = ["Verificar batería",', type: 'setup', explanation: '📋 Lista de pasos del protocolo de despegue. Orden estricto.' },
            { id: 2, text: '    "Calibrar GPS",', type: 'setup', explanation: '📡 Sin GPS calibrado, el dron no sabe dónde está ni a dónde ir.' },
            { id: 3, text: '    "Encender motores",', type: 'setup', explanation: '⚙️ Los motores se encienden gradualmente para verificar que funcionen.' },
            { id: 4, text: '    "Despegar"]', type: 'setup', explanation: '🚁 Último paso: elevación. Solo después de que todo esté verificado.' },
            { id: 5, text: 'for i, paso in enumerate(secuencia, 1):', type: 'setup', explanation: '🔄 enumerate da el número (i) y el texto (paso). Empezamos a contar desde 1.' },
            { id: 6, text: '    print(f"Paso {i}: {paso} ✓")', type: 'output', explanation: '🖨️ Muestra cada paso numerado: "Paso 1: Verificar batería ✓".' },
            { id: 7, text: 'print("🚁 ¡Dron en vuelo!")', type: 'output', explanation: '🎉 ¡Todos los pasos completados! El dron está volando listo para trabajar.' }
        ],
        extra_blocks: [
            { id: 8, text: 'for paso in range(secuencia):', type: 'wrong', whyWrong: 'range() necesita un número, no una lista. Usa "for paso in secuencia" o enumerate().' },
            { id: 9, text: 'secuencia(1) = "Verificar"', type: 'wrong', whyWrong: 'Para listas se usan corchetes [], no paréntesis ().' },
            { id: 10, text: 'print(secuencia)', type: 'wrong', whyWrong: 'Esto imprime toda la lista de golpe. El for imprime paso por paso, que es más claro.' }
        ]
    },
    {
        id: 'py_invernadero',
        name: 'Python',
        icon: '🐍',
        difficulty: 5,
        category: 'automatizacion',
        title: 'Reto 36: Invernadero Inteligente',
        instructions: 'Crea un controlador de invernadero que ajuste ventilación, riego y luz según las condiciones actuales.',
        concept: '**Un invernadero inteligente** es un sistema con múltiples sensores y actuadores trabajando juntos. El código analiza todas las variables y toma decisiones para mantener las condiciones perfectas de crecimiento.',
        funFact: '🏠 Los invernaderos inteligentes en Holanda producen 10 veces más tomates por hectárea que los campos tradicionales. Usan IA, sensores y robótica para controlar cada aspecto del crecimiento. ¡Son fábricas de comida!',
        hints: ['Usa un diccionario para los datos de los sensores y una lista para las acciones', 'Cada condición verifica un sensor y añade una acción a la lista', 'Al final, imprime todas las acciones que el invernadero debe ejecutar'],
        solution: [
            { id: 1, text: 'invernadero = {"temp": 35, "humedad": 30,', type: 'setup', explanation: '📊 Datos actuales: temperatura alta, humedad baja, poca luz.' },
            { id: 2, text: '    "luz": 200, "co2": 450}', type: 'setup', explanation: '🔬 Luz en lux y CO₂ en ppm. Valores que los sensores miden en tiempo real.' },
            { id: 3, text: 'acciones = []', type: 'setup', explanation: '📋 Lista vacía donde guardaremos las acciones necesarias.' },
            { id: 4, text: 'if invernadero["temp"] > 30:', type: 'setup', explanation: '🌡️ ¿Hace demasiado calor? Las plantas sufren estrés térmico arriba de 30°C.' },
            { id: 5, text: '    acciones.append("Abrir ventilación")', type: 'output', explanation: '💨 Agregamos la acción de ventilar. .append() añade al final de la lista.' },
            { id: 6, text: 'if invernadero["humedad"] < 40:', type: 'setup', explanation: '💧 ¿El suelo está seco? Las plantas necesitan agua.' },
            { id: 7, text: '    acciones.append("Activar riego")', type: 'output', explanation: '🚿 Agregamos la acción de riego a la lista.' },
            { id: 8, text: 'for a in acciones: print(f"➡️ {a}")', type: 'output', explanation: '🖨️ Imprime cada acción: "➡️ Abrir ventilación", "➡️ Activar riego".' }
        ],
        extra_blocks: [
            { id: 9, text: '    acciones = "Abrir ventilación"', type: 'wrong', whyWrong: 'Esto reemplaza la lista con un texto. Usa .append() para AGREGAR a la lista existente.' },
            { id: 10, text: 'if invernadero.temp > 30:', type: 'wrong', whyWrong: 'Los diccionarios usan corchetes: invernadero["temp"], no punto.' },
            { id: 11, text: 'acciones.add("Activar riego")', type: 'wrong', whyWrong: '.add() es para conjuntos (set). Las listas usan .append() para agregar elementos.' }
        ]
    },
];
