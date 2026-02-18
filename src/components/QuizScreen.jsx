import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Star, Zap } from 'lucide-react';
import { playClick, playCorrect, playWrong, playNavigate, playStreak, playBack, playTimerWarning, playVictory } from '../utils/retroSounds';

// --- BANCO DE PREGUNTAS POR MÓDULO ---
const QUIZ_DATA = {
  "mod_intro_robot": {
    "title": "Quiz: ¿Qué es un Robot? 🤖",
    "description": "Pon a prueba lo que aprendiste sobre el mundo de los robots",
    "questions": [
      {
        "id": "ir1",
        "question": "¿Cuáles son las 3 capacidades fundamentales de todo robot?",
        "options": [
          "Correr, Saltar y Volar",
          "Hablar, Cantar y Bailar",
          "Sentir, Pensar y Actuar",
          "Comer, Dormir y Jugar"
        ],
        "correct": 2,
        "explanation": "¡Exacto! Todo robot tiene sensores para SENTIR, un cerebro para PENSAR, y actuadores para ACTUAR. ¡Es la regla de oro de la robótica!"
      },
      {
        "id": "ir2",
        "question": "¿De dónde viene la palabra 'Robot'?",
        "options": [
          "De una marca de juguetes japoneses",
          "Del checo 'robota' que significa 'trabajo forzado'",
          "Del inglés 'to rob' que significa robar",
          "De un científico llamado Dr. Robot"
        ],
        "correct": 1,
        "explanation": "La palabra Robot viene del checo 'robota' (trabajo forzado). Fue inventada por Karel Čapek en 1920 para una obra de teatro."
      },
      {
        "id": "ir3",
        "question": "Un robot aspiradora como Roomba, ¿qué tipo de robot es?",
        "options": [
          "Robot Humanoide",
          "Brazo Robótico",
          "Robot Bio-inspirado",
          "Robot Móvil"
        ],
        "correct": 3,
        "explanation": "¡El Roomba es un robot MÓVIL porque se desplaza con ruedas por el suelo! Los brazos robóticos se quedan fijos en un lugar."
      },
      {
        "id": "ir4",
        "question": "¿Qué tipo de robot imita la forma y movimiento de los animales?",
        "options": [
          "Robot Bio-inspirado",
          "Robot Humanoide",
          "Robot Móvil",
          "Brazo Robótico"
        ],
        "correct": 0,
        "explanation": "¡Los robots bio-inspirados imitan a los animales! Boston Dynamics hace robots-perro que caminan y saltan."
      },
      {
        "id": "ir5",
        "question": "¿Qué es el 'pensamiento computacional' que aprendes con robótica?",
        "options": [
          "Pensar como una computadora sin emociones",
          "Saber muchas fórmulas de matemáticas",
          "Resolver problemas dividiéndolos en pasos ordenados",
          "Hablar un lenguaje de programación fluidamente"
        ],
        "correct": 2,
        "explanation": "El pensamiento computacional es descomponer problemas complejos en pasos pequeños y lógicos. ¡Es una superpotencia para la vida!"
      },
      {
        "id": "ir6",
        "question": "¿Qué parte del robot son los 'sentidos' que detectan el entorno?",
        "options": [
          "Los motores",
          "Los sensores",
          "La batería",
          "El chasis"
        ],
        "correct": 1,
        "explanation": "¡Los sensores son como los ojos, oídos y tacto del robot! Detectan luz, distancia, temperatura y más."
      },
      {
        "id": "ir7",
        "question": "¿Qué robot de la NASA explora el planeta Marte actualmente?",
        "options": [
          "Roomba",
          "Alexa",
          "Sophia",
          "Perseverance Rover"
        ],
        "correct": 3,
        "explanation": "¡El rover Perseverance ha estado explorando Marte desde 2021! Incluso tiene un helicóptero robot llamado Ingenuity."
      },
      {
        "id": "ir8",
        "question": "¿Cuál es la función de los ACTUADORES en un robot?",
        "options": [
          "Permiten que el robot se mueva y haga cosas",
          "Almacenan la energía del robot",
          "Conectan el robot a internet",
          "Son los ojos del robot"
        ],
        "correct": 0,
        "explanation": "¡Los actuadores son los 'músculos' del robot! Motores, LEDs y bocinas que le permiten moverse y actuar."
      }
    ]
  },
  "mod_partes_robot": {
    "title": "Quiz: Partes de un Robot 🧩",
    "description": "Demuestra que conoces cada parte del robot",
    "questions": [
      {
        "id": "pr1",
        "question": "¿Qué placa es la más popular para aprender robótica?",
        "options": [
          "PlayStation 5",
          "Arduino UNO",
          "Tarjeta de crédito",
          "Tarjeta gráfica RTX"
        ],
        "correct": 1,
        "explanation": "¡Arduino UNO es la placa favorita de los principiantes! Es el cerebro más popular para robots educativos."
      },
      {
        "id": "pr2",
        "question": "¿Cuántos centímetros puede medir el sensor ultrasónico HC-SR04?",
        "options": [
          "Solo 1 metro exacto",
          "De 100 a 1000 cm",
          "De 0 a 10 cm",
          "De 2 a 400 cm"
        ],
        "correct": 3,
        "explanation": "El HC-SR04 tiene un rango de 2 a 400 centímetros (4 metros). ¡Usa ondas de sonido como un murciélago!"
      },
      {
        "id": "pr3",
        "question": "¿Qué tipo de motor usarías para una GARRA que necesita abrirse a un ángulo exacto?",
        "options": [
          "Motor DC (giro continuo)",
          "Motor Paso a Paso",
          "Servo Motor (ángulo preciso de 0° a 180°)",
          "Motor de gasolina"
        ],
        "correct": 2,
        "explanation": "¡El servo motor es perfecto para garras! Puedes decirle exactamente a qué ángulo abrirse, al grado exacto."
      },
      {
        "id": "pr4",
        "question": "¿Qué sensor detecta líneas negras en el piso para robots siguelíneas?",
        "options": [
          "Sensor Ultrasónico",
          "Sensor Infrarrojo",
          "Sensor de Temperatura",
          "Sensor de Presión"
        ],
        "correct": 1,
        "explanation": "¡El sensor infrarrojo detecta el contraste entre la línea negra y el piso claro! Es el ojo del robot siguelíneas."
      },
      {
        "id": "pr5",
        "question": "¿Cuál es la mejor opción de chasis para tu PRIMER robot con poco presupuesto?",
        "options": [
          "Impresión 3D en titanio",
          "Aluminio profesional",
          "Cartón reciclado",
          "Fibra de carbono"
        ],
        "correct": 2,
        "explanation": "¡El cartón es perfecto para empezar! Es gratis, fácil de cortar y puedes rediseñar sin gastar."
      },
      {
        "id": "pr6",
        "question": "¿Qué tipo de batería es recargable, potente y usada en drones?",
        "options": [
          "Pilas AAA",
          "Batería de 9V",
          "Cable USB",
          "Batería LiPo"
        ],
        "correct": 3,
        "explanation": "Las baterías LiPo (Litio Polímero) son recargables, potentes y ligeras. ¡Ideales para drones y robots avanzados!"
      },
      {
        "id": "pr7",
        "question": "¿Cuántos pines digitales tiene el Arduino UNO?",
        "options": [
          "14 pines",
          "6 pines",
          "100 pines",
          "2 pines"
        ],
        "correct": 0,
        "explanation": "¡Arduino UNO tiene 14 pines digitales y 6 analógicos! Son las 'patitas' donde conectas sensores y actuadores."
      },
      {
        "id": "pr8",
        "question": "¿Qué sensor usarías para que tu robot detecte una pared antes de chocar?",
        "options": [
          "Sensor de Temperatura",
          "Sensor de Luz",
          "Sensor Ultrasónico",
          "Sensor de peso"
        ],
        "correct": 2,
        "explanation": "¡El ultrasónico envía ondas de sonido y mide cuánto tardan en rebotar! Si la distancia es corta, ¡hay pared!"
      }
    ]
  },
  "mod_primer_proyecto": {
    "title": "Quiz: Diseña tu Robot 🎨",
    "description": "Demuestra tus habilidades de diseño robótico",
    "questions": [
      {
        "id": "dp1",
        "question": "Si tu robot necesita conectarse a internet, ¿qué cerebro elegirías?",
        "options": [
          "Un sensor ultrasónico",
          "Arduino UNO (solo USB)",
          "ESP32 (WiFi y Bluetooth integrados)",
          "Una pila de 9V"
        ],
        "correct": 2,
        "explanation": "¡El ESP32 tiene WiFi y Bluetooth integrados! Perfecto para proyectos IoT sin módulos extra."
      },
      {
        "id": "dp2",
        "question": "¿Dónde deberías colocar las baterías para mayor estabilidad?",
        "options": [
          "En la parte de arriba",
          "En la base (parte de abajo)",
          "A un lado del robot",
          "No importa la ubicación"
        ],
        "correct": 1,
        "explanation": "¡Centro de gravedad bajo = más estabilidad! Al poner lo más pesado abajo, el robot no se voltea."
      },
      {
        "id": "dp3",
        "question": "¿Cuál es el PRIMER paso para construir un robot?",
        "options": [
          "Comprar todos los materiales",
          "Programar el código",
          "Conectar cables al azar",
          "Dibujar el diseño en papel"
        ],
        "correct": 3,
        "explanation": "¡Siempre empieza dibujando! Los ingenieros de NASA y Tesla primero DIBUJAN antes de construir."
      },
      {
        "id": "dp4",
        "question": "¿Qué tamaño es ideal para tu primer robot?",
        "options": [
          "Del tamaño de un auto",
          "15 a 25 centímetros",
          "Más pequeño que un dedo",
          "Del tamaño de una casa"
        ],
        "correct": 1,
        "explanation": "15-25cm es ideal: no muy grande (difícil de mover) ni muy pequeño (difícil de armar)."
      },
      {
        "id": "dp5",
        "question": "¿Qué significa que un robot sea 'modular'?",
        "options": [
          "Que tiene piezas intercambiables",
          "Que es muy grande",
          "Que solo funciona con internet",
          "Que no necesita energía"
        ],
        "correct": 0,
        "explanation": "¡Modular = piezas intercambiables! Si algo falla, solo cambias esa parte sin desarmar todo."
      },
      {
        "id": "dp6",
        "question": "¿Cuál es el orden CORRECTO para construir un robot?",
        "options": [
          "Programar → Comprar → Dibujar → Armar",
          "Comprar todo → Armar sin dibujar → Programar",
          "Conectar cables al azar → Ver si funciona",
          "Dibujar → Lista materiales → Armar → Electrónica → Programar"
        ],
        "correct": 3,
        "explanation": "¡Siempre: dibujar, listar materiales, armar el cuerpo, conectar electrónica y programar! Orden = éxito."
      }
    ]
  },
  "mod_electr": {
    "title": "Quiz: Electricidad Inicial ⚡",
    "description": "Pon a prueba lo que aprendiste sobre electricidad",
    "questions": [
      {
        "id": "q1",
        "question": "¿Qué son los electrones?",
        "options": [
          "Tipos de cables eléctricos",
          "Luces que se ven en el cielo",
          "Partículas diminutas que al moverse crean electricidad",
          "Unidades de medida de voltaje"
        ],
        "correct": 2,
        "explanation": "¡Los electrones son partículas subatómicas con carga negativa! Cuando fluyen de forma ordenada, generan corriente eléctrica."
      },
      {
        "id": "q2",
        "question": "¿Cuál de estos NO es una fuente de electricidad?",
        "options": [
          "El Sol (paneles solares)",
          "El Viento (molinos)",
          "El Agua (presas)",
          "Una piedra común"
        ],
        "correct": 3,
        "explanation": "¡Una piedra común no genera electricidad! Las fuentes reales son: solar, eólica, hidroeléctrica y baterías."
      },
      {
        "id": "q3",
        "question": "¿Qué es un conductor eléctrico?",
        "options": [
          "Un material que detiene la electricidad",
          "Un material que permite pasar la electricidad, como el cobre",
          "Una persona que maneja un autobús",
          "Un tipo de batería especial"
        ],
        "correct": 1,
        "explanation": "¡Los conductores como el cobre permiten que la electricidad fluya! Son la 'autopista' de los electrones."
      },
      {
        "id": "q4",
        "question": "¿Cuáles son las 4 partes de un circuito básico?",
        "options": [
          "LED, Motor, Sensor y Batería",
          "Voltaje, Corriente, Resistencia y Potencia",
          "Fuente, Cables, Consumidor e Interruptor",
          "Arduino, Protoboard, Cables y Computadora"
        ],
        "correct": 2,
        "explanation": "¡Un circuito necesita: la Fuente (pila), los Cables (camino), el Consumidor (bombilla) y el Interruptor (puente)!"
      },
      {
        "id": "q5",
        "question": "En la Ley de Ohm (V = I × R), ¿qué representa la V?",
        "options": [
          "Velocidad de los electrones",
          "Voltaje: la fuerza que empuja los electrones",
          "Volumen del sonido",
          "El nombre de un científico"
        ],
        "correct": 1,
        "explanation": "¡V es el Voltaje! Cuanto más alto, más fuerza tiene para empujar los electrones por el circuito."
      },
      {
        "id": "q6",
        "question": "¿Por qué NUNCA debes tocar un enchufe con las manos mojadas?",
        "options": [
          "Porque el enchufe se oxida",
          "Porque el agua apaga la electricidad",
          "Porque se moja el piso",
          "Porque el agua conduce electricidad y pasaría por tu cuerpo"
        ],
        "correct": 3,
        "explanation": "¡El agua es conductora! Si tocas algo eléctrico con manos mojadas, la electricidad puede pasar por tu cuerpo."
      },
      {
        "id": "q7",
        "question": "¿Qué material es un buen AISLANTE eléctrico?",
        "options": [
          "Un cable de cobre",
          "Una moneda de metal",
          "El plástico que cubre los cables",
          "El agua con sal"
        ],
        "correct": 2,
        "explanation": "¡El plástico es un aislante que nos protege! Por eso los cables están cubiertos de plástico por fuera."
      },
      {
        "id": "q8",
        "question": "Si la Resistencia en un circuito aumenta, ¿qué pasa con la Corriente?",
        "options": [
          "La corriente aumenta mucho",
          "La corriente disminuye (pasan menos electrones)",
          "No pasa nada, todo sigue igual",
          "El circuito se apaga completamente"
        ],
        "correct": 1,
        "explanation": "¡Según V = I × R, más resistencia = menos corriente! Es como poner más rocas en un tobogán de agua."
      }
    ]
  },
  "mod_electon": {
    "title": "Quiz: Electrónica Inicial 🔌",
    "description": "Demuestra lo que sabes sobre componentes electrónicos",
    "questions": [
      {
        "id": "eq1",
        "question": "¿Qué hace un diodo en un circuito?",
        "options": [
          "Amplifica la señal eléctrica",
          "Permite el flujo de corriente en una sola dirección",
          "Almacena energía como una batería",
          "Mide el voltaje del circuito"
        ],
        "correct": 1,
        "explanation": "¡El diodo es como una puerta que solo se abre en un sentido! La corriente solo puede pasar en una dirección."
      },
      {
        "id": "eq2",
        "question": "¿Para qué sirve un transistor?",
        "options": [
          "Solo para decorar el circuito",
          "Para medir la temperatura",
          "Como interruptor o amplificador de señales",
          "Para conectar cables entre sí"
        ],
        "correct": 2,
        "explanation": "¡El transistor puede actuar como interruptor electrónico o amplificar señales débiles! Es de los más importantes."
      },
      {
        "id": "eq3",
        "question": "¿Qué componente emite luz cuando pasa corriente?",
        "options": [
          "Un transistor",
          "Una resistencia",
          "Un LED (Diodo Emisor de Luz)",
          "Un capacitor"
        ],
        "correct": 2,
        "explanation": "LED significa 'Diodo Emisor de Luz'. Cuando la corriente pasa por él en la dirección correcta, ¡brilla!"
      },
      {
        "id": "eq4",
        "question": "¿Qué componente almacena energía temporalmente como una mini-batería rápida?",
        "options": [
          "Capacitor",
          "Resistencia",
          "Inductor",
          "Potenciómetro"
        ],
        "correct": 0,
        "explanation": "¡El capacitor almacena energía eléctrica y puede liberarla rápidamente! Se usa mucho para estabilizar circuitos."
      },
      {
        "id": "eq5",
        "question": "Si conectas 3 LEDs en serie y uno se funde, ¿qué pasa?",
        "options": [
          "Solo ese LED se apaga",
          "Los otros brillan más fuerte",
          "Sale humo de los demás",
          "Se apagan TODOS los LEDs"
        ],
        "correct": 3,
        "explanation": "¡En serie, si uno falla se rompe el circuito completo y todos se apagan! Es como una cadena: si un eslabón se rompe, toda la cadena falla."
      },
      {
        "id": "eq6",
        "question": "¿Cuál es la diferencia entre la pata larga y la pata corta de un LED?",
        "options": [
          "No hay ninguna diferencia",
          "Pata larga = positivo (+), pata corta = negativo (-)",
          "Pata larga = negativo, pata corta = positivo",
          "Ambas son para tierra (GND)"
        ],
        "correct": 1,
        "explanation": "¡La pata larga del LED es el ánodo (+) y la corta es el cátodo (-)! Si lo conectas al revés, no enciende."
      },
      {
        "id": "eq7",
        "question": "¿Qué herramienta mide voltaje, corriente y resistencia?",
        "options": [
          "Multímetro",
          "Protoboard",
          "Cautín (soldador)",
          "Cable Dupont"
        ],
        "correct": 0,
        "explanation": "¡El multímetro es tu mejor amigo para diagnosticar circuitos! Mide voltaje, corriente y resistencia."
      },
      {
        "id": "eq8",
        "question": "Las luces de tu casa están en paralelo. Si se funde un foco de la cocina, ¿qué pasa?",
        "options": [
          "Se apagan TODAS las luces de la casa",
          "Los demás focos brillan más",
          "Salta el interruptor general",
          "Solo se apaga el de la cocina, las demás siguen"
        ],
        "correct": 3,
        "explanation": "¡En paralelo, cada foco tiene su propio camino! Si uno falla, los demás siguen funcionando."
      }
    ]
  },
  "mod_prog_gen": {
    "title": "Quiz: Mecánica Inicial ⚙️",
    "description": "Demuestra tus conocimientos de mecánica para robots",
    "questions": [
      {
        "id": "mg1",
        "question": "Un sube y baja en el parque es un ejemplo de:",
        "options": [
          "Palanca",
          "Polea",
          "Plano inclinado",
          "Engranaje"
        ],
        "correct": 0,
        "explanation": "¡El sube y baja es una palanca clásica! Una barra que gira sobre un punto fijo (fulcro) en el centro."
      },
      {
        "id": "mg2",
        "question": "Si quieres que tu robot tenga MÁS FUERZA para subir una rampa, ¿qué relación de engranajes usas?",
        "options": [
          "Engranaje grande → pequeño (multiplicador)",
          "Sin engranajes",
          "Engranaje pequeño → grande (reductor)",
          "Engranajes del mismo tamaño"
        ],
        "correct": 2,
        "explanation": "¡Un engranaje reductor da más torque (fuerza de giro) a costa de menos velocidad! Perfecto para rampas."
      },
      {
        "id": "mg3",
        "question": "¿Qué es el TORQUE en un motor de robot?",
        "options": [
          "La fuerza de giro que permite mover las ruedas",
          "La velocidad máxima del motor",
          "El peso del motor",
          "El color del motor"
        ],
        "correct": 0,
        "explanation": "¡El torque es la fuerza rotacional! Un motor con mucho torque puede mover cargas pesadas aunque sea lento."
      },
      {
        "id": "mg4",
        "question": "¿Qué rama de la física estudia el movimiento y las fuerzas que lo causan?",
        "options": [
          "Electricidad",
          "Óptica",
          "Termodinámica",
          "Mecánica"
        ],
        "correct": 3,
        "explanation": "¡La mecánica estudia el movimiento y las fuerzas! En robótica, diseña ruedas, brazos, pinzas y todo lo móvil."
      },
      {
        "id": "mg5",
        "question": "¿Qué máquina simple reduce la fricción y permite mover cosas rodando?",
        "options": [
          "Palanca",
          "Rueda y eje",
          "Plano inclinado",
          "Polea"
        ],
        "correct": 1,
        "explanation": "¡La rueda y eje reduce la fricción y permite transportar objetos! Los robots con ruedas la usan constantemente."
      },
      {
        "id": "mg6",
        "question": "¿Qué son los engranajes reductores?",
        "options": [
          "Ruedas que giran más rápido sin fuerza",
          "Engranajes que solo van en una dirección",
          "Engranaje pequeño mueve uno grande = más fuerza, menos velocidad",
          "Engranajes que no se conectan entre sí"
        ],
        "correct": 2,
        "explanation": "¡El reductor sacrifica velocidad para ganar fuerza! Como un tractor: lento pero muy poderoso."
      }
    ]
  },
  "mod_mecanica": {
    "title": "Quiz: Programación Inicial 💻",
    "description": "Pon a prueba tus conocimientos de programación",
    "questions": [
      {
        "id": "mc1",
        "question": "¿Qué es un algoritmo?",
        "options": [
          "Un tipo de robot muy rápido",
          "Un lenguaje de programación",
          "Un error en el código",
          "Lista de pasos ordenados para resolver un problema"
        ],
        "correct": 3,
        "explanation": "¡Un algoritmo es como una receta de cocina! Pasos ordenados y precisos para resolver un problema."
      },
      {
        "id": "mc2",
        "question": "¿Qué tipo de dato usarías para guardar si un sensor detectó obstáculo (sí o no)?",
        "options": [
          "bool (verdadero/falso)",
          "int (número entero)",
          "String (texto)",
          "float (decimal)"
        ],
        "correct": 0,
        "explanation": "¡Un booleano (bool) es perfecto para sí/no, verdadero/falso! Es el tipo de dato favorito de los robots para decidir."
      },
      {
        "id": "mc3",
        "question": "¿Qué imprime este código?\n\nedad = 12\nif edad >= 10:\n    print('Grande')\nelse:\n    print('Pequeño')",
        "options": [
          "Pequeño",
          "Error",
          "Grande",
          "12"
        ],
        "correct": 2,
        "explanation": "Como edad es 12 y 12 >= 10 es verdadero, se ejecuta el bloque del if y se imprime 'Grande'."
      },
      {
        "id": "mc4",
        "question": "¿Qué ciclo usarías si quieres que tu robot explore MIENTRAS tenga batería?",
        "options": [
          "for (repite un número exacto de veces)",
          "while (repite mientras la condición sea verdadera)",
          "if (solo se ejecuta una vez)",
          "break (sale del ciclo)"
        ],
        "correct": 1,
        "explanation": "¡while es perfecto cuando no sabes cuántas veces repetir! Solo que debe seguir mientras haya batería."
      },
      {
        "id": "mc5",
        "question": "¿Qué palabra clave se usa en Python para definir una función?",
        "options": [
          "def",
          "function",
          "void",
          "create"
        ],
        "correct": 0,
        "explanation": "¡En Python usamos 'def' (de 'define') para crear funciones! Es diferente a 'function' (JavaScript) o 'void' (C++)."
      },
      {
        "id": "mc6",
        "question": "¿Qué hace la palabra clave 'return' en una función?",
        "options": [
          "Imprime un mensaje en pantalla",
          "Elimina la función del código",
          "Cierra el programa completamente",
          "Devuelve un valor al código que la llamó"
        ],
        "correct": 3,
        "explanation": "¡return entrega un resultado! Es como pedir una pizza: llamas a la función, ella hace algo, y te DEVUELVE el resultado."
      },
      {
        "id": "mc7",
        "question": "Si copias el mismo código más de 2 veces, ¿qué deberías hacer?",
        "options": [
          "Dejarlo así, funciona igual",
          "Borrarlo todo",
          "Convertirlo en una función reutilizable",
          "Cambiarle el nombre a cada copia"
        ],
        "correct": 2,
        "explanation": "¡Las funciones evitan repetir código! Escribes una vez, la llamas las veces que quieras. Los buenos programadores son eficientes."
      },
      {
        "id": "mc8",
        "question": "¿Qué significa 'Bug' en programación?",
        "options": [
          "Una nueva característica del programa",
          "Un error en el código",
          "Un tipo de variable especial",
          "Un lenguaje de programación"
        ],
        "correct": 1,
        "explanation": "¡Un Bug es un error! La palabra viene de 1947 cuando una polilla real causó un fallo en una computadora Harvard."
      }
    ]
  },
  "mod_arduino": {
    "title": "Quiz: Control con Arduino 🕹️",
    "description": "Pon a prueba tus conocimientos de Arduino",
    "questions": [
      {
        "id": "aq1",
        "question": "¿Qué es Arduino UNO?",
        "options": [
          "Un videojuego de robots",
          "Una placa de desarrollo para crear proyectos electrónicos",
          "Un tipo de cable especial",
          "Una aplicación de celular"
        ],
        "correct": 1,
        "explanation": "¡Arduino UNO es una placa electrónica que puedes programar para controlar LEDs, motores, sensores y más!"
      },
      {
        "id": "aq2",
        "question": "¿Qué función usamos para encender un LED con Arduino?",
        "options": [
          "digitalWrite(pin, HIGH)",
          "turnOnLight()",
          "ledOn()",
          "print('encender')"
        ],
        "correct": 0,
        "explanation": "¡digitalWrite(pin, HIGH) le dice a Arduino que envíe 5V por un pin específico, encendiendo lo que esté conectado!"
      },
      {
        "id": "aq3",
        "question": "¿Qué rango de valores puede leer un pin analógico de Arduino?",
        "options": [
          "Solo HIGH o LOW",
          "0 a 255",
          "0 a 100",
          "0 a 1023"
        ],
        "correct": 3,
        "explanation": "¡Los pines analógicos usan 10 bits de resolución: 2¹⁰ = 1024 valores posibles (0 a 1023)!"
      },
      {
        "id": "aq4",
        "question": "¿Cuál es la diferencia entre setup() y loop() en Arduino?",
        "options": [
          "Ambos se ejecutan una sola vez",
          "setup() se ejecuta una vez, loop() se repite para siempre",
          "loop() va antes que setup()",
          "Son exactamente la misma función"
        ],
        "correct": 1,
        "explanation": "¡setup() prepara todo UNA vez (como vestirte), loop() repite sin parar (como respirar)!"
      },
      {
        "id": "aq5",
        "question": "¿Qué hace delay(1000) en Arduino?",
        "options": [
          "Enciende un LED",
          "Lee un sensor",
          "Envía un mensaje serial",
          "Pausa el programa 1 segundo (1000ms)"
        ],
        "correct": 3,
        "explanation": "¡delay(1000) pausa el programa 1 segundo! Arduino mide el tiempo en milisegundos: 1000ms = 1s."
      },
      {
        "id": "aq6",
        "question": "¿Qué hace analogRead(A0) en Arduino?",
        "options": [
          "Escribe un valor analógico en A0",
          "Enciende el pin A0",
          "Lee un valor entre 0 y 1023 del pin A0",
          "Apaga el sensor conectado"
        ],
        "correct": 2,
        "explanation": "¡analogRead lee un valor analógico (0-1023) del pin! Un valor de 512 sería aproximadamente 2.5V."
      },
      {
        "id": "aq7",
        "question": "¿Para qué sirve Serial.println() en Arduino?",
        "options": [
          "Enviar mensajes a tu computadora para depuración",
          "Encender un LED en serie",
          "Conectar dos Arduinos entre sí",
          "Mover un motor paso a paso"
        ],
        "correct": 0,
        "explanation": "¡Serial.println() es tu mejor amigo para depurar! Envía datos del Arduino a tu PC por el Monitor Serial."
      },
      {
        "id": "aq8",
        "question": "¿Dónde fue creado Arduino y en qué año?",
        "options": [
          "Japón, 2010",
          "Estados Unidos, 2000",
          "Italia, 2005",
          "Alemania, 2015"
        ],
        "correct": 2,
        "explanation": "¡Arduino fue creado en Ivrea, Italia, en 2005! Por un grupo de maestros que querían facilitar la programación de hardware."
      }
    ]
  },
  "mod_cpp": {
    "title": "Quiz: Lógica Esencial 🧠",
    "description": "Demuestra tu dominio de la lógica booleana",
    "questions": [
      {
        "id": "lg1",
        "question": "Un robot debe avanzar SOLO si el camino está libre Y la batería tiene carga. ¿Qué operador usas?",
        "options": [
          "AND (&&) — ambas condiciones deben ser verdaderas",
          "OR (||) — al menos una debe ser verdadera",
          "NOT (!) — invierte el valor",
          "XOR — una u otra pero no ambas"
        ],
        "correct": 0,
        "explanation": "¡AND porque AMBAS condiciones deben cumplirse! Si usaras OR, avanzaría con batería vacía mientras el camino esté libre."
      },
      {
        "id": "lg2",
        "question": "Si A = true y B = false, ¿cuánto vale A AND B?",
        "options": [
          "true",
          "Depende de C",
          "Error",
          "false"
        ],
        "correct": 3,
        "explanation": "¡AND requiere que AMBOS sean verdaderos! Como B es false, el resultado es false sin importar A."
      },
      {
        "id": "lg3",
        "question": "¿Qué forma tiene el símbolo de DECISIÓN en un diagrama de flujo?",
        "options": [
          "Óvalo",
          "Rectángulo",
          "Diamante (rombo)",
          "Flecha"
        ],
        "correct": 2,
        "explanation": "¡El diamante o rombo representa una pregunta con dos salidas: Sí y No! Es el símbolo más importante del diagrama."
      },
      {
        "id": "lg4",
        "question": "¿Qué resultado da NOT true (negar verdadero)?",
        "options": [
          "true",
          "false",
          "Error",
          "null"
        ],
        "correct": 1,
        "explanation": "¡NOT invierte el valor! NOT true = false y NOT false = true. Es como un interruptor que pone todo al revés."
      },
      {
        "id": "lg5",
        "question": "¿Quién inventó el álgebra booleana que usan todas las computadoras?",
        "options": [
          "George Boole",
          "Isaac Newton",
          "Albert Einstein",
          "Nikola Tesla"
        ],
        "correct": 0,
        "explanation": "¡George Boole, un matemático inglés del siglo XIX! Sin su trabajo, no existirían las computadoras ni los smartphones."
      },
      {
        "id": "lg6",
        "question": "En la tabla OR, ¿cuándo el resultado es FALSE?",
        "options": [
          "Cuando al menos uno es true",
          "Solo cuando AMBOS valores son false",
          "Cuando ambos son true",
          "Nunca es false"
        ],
        "correct": 1,
        "explanation": "¡OR es 'generoso': basta con que UNO sea verdadero para dar true! Solo es false cuando AMBOS son false."
      }
    ]
  },
  "mod_python": {
    "title": "Quiz: Práctica LED 💡",
    "description": "Pon a prueba lo que aprendiste sobre circuitos con LED",
    "questions": [
      {
        "id": "pl1",
        "question": "¿Qué pasa si conectas un LED directamente a una pila de 9V SIN resistencia?",
        "options": [
          "Brilla más fuerte y dura más",
          "No pasa nada, funciona igual",
          "El LED se quema por exceso de corriente",
          "La pila se descarga más lento"
        ],
        "correct": 2,
        "explanation": "¡Sin resistencia, pasa demasiada corriente y el LED se quema en segundos! La resistencia es su cinturón de seguridad."
      },
      {
        "id": "pl2",
        "question": "¿Qué identifica la pata LARGA de un LED?",
        "options": [
          "Es el terminal positivo (+) o ánodo",
          "Es el terminal negativo (-)",
          "No hay diferencia entre patas",
          "Es la conexión a tierra"
        ],
        "correct": 0,
        "explanation": "¡La pata larga es el ánodo (+) y la corta es el cátodo (-)! Si lo conectas al revés, simplemente no enciende."
      },
      {
        "id": "pl3",
        "question": "¿Qué fórmula usas para calcular la resistencia necesaria para un LED?",
        "options": [
          "V = I × R",
          "R = (Vfuente - VLED) ÷ ILED",
          "P = V × I",
          "E = mc²"
        ],
        "correct": 1,
        "explanation": "¡Esta fórmula calcula la resistencia exacta que necesitas para proteger tu LED sin que se queme!"
      },
      {
        "id": "pl4",
        "question": "Si el LED no enciende en tu circuito, ¿qué es lo PRIMERO que debes verificar?",
        "options": [
          "Si la mesa está nivelada",
          "El color del cable usado",
          "Si la computadora tiene internet",
          "La orientación del LED (puede estar al revés)"
        ],
        "correct": 3,
        "explanation": "¡Lo más común es que el LED esté invertido! Gíralo 180° y prueba de nuevo. Si sigue sin encender, revisa las conexiones."
      },
      {
        "id": "pl5",
        "question": "¿Para qué sirve la PROTOBOARD?",
        "options": [
          "Para soldar componentes permanentemente",
          "Para medir voltaje y corriente",
          "Para armar circuitos sin soldar, insertando componentes",
          "Para cortar cables eléctricos"
        ],
        "correct": 2,
        "explanation": "¡La protoboard tiene agujeros conectados internamente donde insertas componentes sin necesidad de soldar!"
      },
      {
        "id": "pl6",
        "question": "¿Qué componente PROTEGE al LED de quemarse limitando la corriente?",
        "options": [
          "La resistencia",
          "El cable USB",
          "Otro LED en paralelo",
          "Un interruptor de botón"
        ],
        "correct": 0,
        "explanation": "¡La resistencia limita la corriente que pasa por el LED! Sin ella, el LED recibe demasiada energía y se daña."
      }
    ]
  },
  "mod_robotica": {
    "title": "Quiz: LED con Arduino 🔷",
    "description": "Demuestra tus conocimientos de control de LEDs con Arduino",
    "questions": [
      {
        "id": "ra1",
        "question": "¿Por qué el pin 13 es especial en Arduino UNO?",
        "options": [
          "Es el único pin que funciona",
          "Tiene un LED integrado en la propia placa",
          "Es más potente que los demás pines",
          "Solo funciona con motores"
        ],
        "correct": 1,
        "explanation": "¡El pin 13 tiene un LED integrado en la placa Arduino! Si conectas mal el LED externo, el interno aún funciona."
      },
      {
        "id": "ra2",
        "question": "¿Qué función de Arduino controla el BRILLO del LED (no solo encender/apagar)?",
        "options": [
          "analogWrite()",
          "digitalWrite()",
          "digitalRead()",
          "Serial.println()"
        ],
        "correct": 0,
        "explanation": "¡analogWrite() envía un valor PWM (0-255) que controla el brillo! 0 = apagado, 127 = medio, 255 = máximo."
      },
      {
        "id": "ra3",
        "question": "En código Morse con LED, ¿qué representa un punto (.)?",
        "options": [
          "LED apagado 1 segundo",
          "LED encendido 600ms (largo)",
          "LED apagado 200ms",
          "LED encendido 200ms (corto)"
        ],
        "correct": 3,
        "explanation": "¡Un punto es un destello corto de 200ms! Una raya es más larga (600ms). S.O.S = ••• ——— •••"
      },
      {
        "id": "ra4",
        "question": "¿Qué rango de valores acepta analogWrite() para controlar el brillo?",
        "options": [
          "0 a 255",
          "0 a 1023",
          "Solo HIGH o LOW",
          "0 a 100 (porcentaje)"
        ],
        "correct": 0,
        "explanation": "¡analogWrite usa 8 bits: 0 (apagado) a 255 (máximo brillo)! 127 sería aproximadamente 50%."
      },
      {
        "id": "ra5",
        "question": "Si tu LED no enciende con Arduino, ¿qué debes verificar PRIMERO?",
        "options": [
          "Si hay conexión a internet",
          "Si está lloviendo afuera",
          "La orientación del LED y las conexiones al pin y GND",
          "El color del Arduino"
        ],
        "correct": 2,
        "explanation": "¡Verifica que la pata larga (+) vaya al pin y la corta (-) a GND! También revisa que el pin sea correcto en el código."
      },
      {
        "id": "ra6",
        "question": "¿Qué efecto logra el 'LED Fade' o efecto 'respiración'?",
        "options": [
          "El LED parpadea rápidamente",
          "El LED sube y baja de brillo gradualmente",
          "El LED cambia de color automáticamente",
          "El LED se apaga permanentemente"
        ],
        "correct": 1,
        "explanation": "¡El fade sube y baja el brillo suavemente usando analogWrite! Se ve como si el LED 'respirara'."
      }
    ]
  },
  "mod_componentes": {
    "title": "Quiz: Motor con Arduino ⚡",
    "description": "Pon a prueba tus conocimientos sobre motores y drivers",
    "questions": [
      {
        "id": "cm1",
        "question": "¿Por qué NUNCA debes conectar un motor directamente a un pin de Arduino?",
        "options": [
          "Porque Arduino es muy pesado",
          "Porque el motor es muy lento",
          "Porque Arduino no tiene pines suficientes",
          "Porque Arduino no puede dar suficiente corriente, necesitas un driver"
        ],
        "correct": 3,
        "explanation": "¡Un pin de Arduino da máximo 40mA, pero un motor necesita 200-500mA! El driver L298N amplifica la señal."
      },
      {
        "id": "cm2",
        "question": "¿Qué módulo se usa como driver para controlar motores DC con Arduino?",
        "options": [
          "L298N",
          "HC-SR04",
          "LCD 16x2",
          "DHT11"
        ],
        "correct": 0,
        "explanation": "¡El L298N es un puente H que amplifica la señal de Arduino para mover motores potentes! Controla 2 motores."
      },
      {
        "id": "cm3",
        "question": "Para que un robot gire SOBRE SU EJE (como trompo), ¿qué deben hacer los motores?",
        "options": [
          "Ambos motores adelante a misma velocidad",
          "Ambos motores apagados",
          "Un motor adelante y el otro atrás",
          "Un motor rápido y otro lento en misma dirección"
        ],
        "correct": 2,
        "explanation": "¡Cuando un motor va adelante y el otro atrás, el robot gira sobre su propio eje! Es la maniobra más útil."
      },
      {
        "id": "cm4",
        "question": "Si usas analogWrite(ENA, 127), ¿a qué porcentaje de velocidad va el motor?",
        "options": [
          "100% (máxima velocidad)",
          "Aproximadamente 50%",
          "0% (detenido)",
          "127% (velocidad extra)"
        ],
        "correct": 1,
        "explanation": "¡El rango PWM es 0-255, así que 127 es aprox. la mitad (50%)! Con 255 va al máximo y con 0 está parado."
      },
      {
        "id": "cm5",
        "question": "¿Qué configuración de pines del L298N hace que el motor se DETENGA?",
        "options": [
          "IN1=LOW, IN2=LOW (ambos apagados)",
          "IN1=HIGH, IN2=HIGH",
          "IN1=HIGH, IN2=LOW",
          "Desconectar el Arduino por completo"
        ],
        "correct": 0,
        "explanation": "¡Ambos pines en LOW cortan la energía al motor y se detiene! HIGH+LOW = adelante, LOW+HIGH = atrás."
      },
      {
        "id": "cm6",
        "question": "¿Qué tipo de motor gira a un ángulo EXACTO entre 0° y 180°?",
        "options": [
          "Motor DC de corriente continua",
          "Motor de gasolina",
          "Motor Paso a Paso (stepper)",
          "Servo Motor"
        ],
        "correct": 3,
        "explanation": "¡El servo motor gira al ángulo exacto que le indiques! Ideal para brazos robóticos, garras y cabezas de robot."
      }
    ]
  },
  "mod_control": {
    "title": "Quiz: Lógica y Control 🎛️",
    "description": "Pon a prueba tus conocimientos de sistemas de control",
    "questions": [
      {
        "id": "ct1",
        "question": "El cruise control de un auto mide velocidad real y ajusta el motor. ¿Qué tipo de control es?",
        "options": [
          "Lazo abierto (no mide nada)",
          "Lazo cerrado (mide y ajusta)",
          "Sin control automático",
          "Control manual con volante"
        ],
        "correct": 1,
        "explanation": "¡Es lazo cerrado perfecto! Mide la velocidad REAL, compara con la deseada, y ajusta el motor. ¡Feedback constante!"
      },
      {
        "id": "ct2",
        "question": "Un tostador con timer fijo (sin medir si el pan está tostado) es un ejemplo de:",
        "options": [
          "Control de Lazo Cerrado",
          "Control PID avanzado",
          "Control de Lazo Abierto",
          "Control inteligente con IA"
        ],
        "correct": 2,
        "explanation": "¡Es lazo abierto porque no mide el resultado! Solo ejecuta un tiempo fijo sin importar cómo quede el pan."
      },
      {
        "id": "ct3",
        "question": "¿Qué es el 'feedback' o retroalimentación en un sistema de control?",
        "options": [
          "La fuente de energía del robot",
          "El color del sensor utilizado",
          "Un tipo de motor especial",
          "Información del resultado que se usa para corregir el siguiente paso"
        ],
        "correct": 3,
        "explanation": "¡El feedback es la clave del lazo cerrado! El sistema mide qué pasó y usa esa info para mejorar la siguiente acción."
      },
      {
        "id": "ct4",
        "question": "¿Qué componente del PID corrige proporcionalmente al error actual?",
        "options": [
          "P (Proporcional)",
          "I (Integral)",
          "D (Derivativo)",
          "Ninguno de los tres"
        ],
        "correct": 0,
        "explanation": "¡P multiplica el error por una constante Kp! Error grande = corrección grande, error pequeño = corrección pequeña."
      },
      {
        "id": "ct5",
        "question": "¿Qué aplicaciones comunes usan control PID?",
        "options": [
          "Libros de texto escolares",
          "Drones para mantenerse estables y robots siguelíneas",
          "Juegos de mesa tradicionales",
          "Calculadoras científicas"
        ],
        "correct": 1,
        "explanation": "¡Los drones hacen CIENTOS de ajustes PID por segundo para no caerse! Los robots siguelíneas también lo usan."
      },
      {
        "id": "ct6",
        "question": "Un aire acondicionado que mide la temperatura actual y ajusta la potencia es:",
        "options": [
          "Lazo abierto sin sensores",
          "Sin ningún tipo de control",
          "Lazo cerrado con retroalimentación",
          "Control manual del usuario"
        ],
        "correct": 2,
        "explanation": "¡El A/C mide temperatura (sensor), compara con la deseada, y ajusta! Es un lazo cerrado clásico."
      }
    ]
  },
  "mod_prog_avanzada": {
    "title": "Quiz: Programación Avanzada 🚀",
    "description": "Pon a prueba tus conocimientos avanzados de programación",
    "questions": [
      {
        "id": "pa1",
        "question": "¿Qué es un Array en programación?",
        "options": [
          "Un tipo de motor robótico",
          "Un sensor de Arduino especial",
          "Un error frecuente del código",
          "Una lista ordenada de datos con índices numéricos"
        ],
        "correct": 3,
        "explanation": "¡Un array es una lista donde cada dato tiene una posición (índice)! Empiezan desde 0, no desde 1."
      },
      {
        "id": "pa2",
        "question": "¿Cómo se incluye una librería en Arduino?",
        "options": [
          "#include <NombreLibreria.h>",
          "import NombreLibreria",
          "using NombreLibreria",
          "require('NombreLibreria')"
        ],
        "correct": 0,
        "explanation": "¡En Arduino/C++ usamos #include! Es como decir 'necesito estas herramientas extra para mi proyecto'."
      },
      {
        "id": "pa3",
        "question": "¿Qué módulo Bluetooth se usa comúnmente con Arduino?",
        "options": [
          "ESP32 completo",
          "HC-05",
          "L298N",
          "LM35"
        ],
        "correct": 1,
        "explanation": "¡El HC-05 es el módulo Bluetooth clásico para Arduino! Permite controlar tu robot desde el celular."
      },
      {
        "id": "pa4",
        "question": "¿Qué función lee datos recibidos por Serial/Bluetooth en Arduino?",
        "options": [
          "Serial.println()",
          "digitalWrite()",
          "Serial.read()",
          "analogWrite()"
        ],
        "correct": 2,
        "explanation": "¡Serial.read() lee un byte (carácter) del puerto serial! El módulo Bluetooth envía datos por serial."
      },
      {
        "id": "pa5",
        "question": "¿Cuál es una buena práctica de programación?",
        "options": [
          "Usar nombres de variables como 'x' y 'y'",
          "No escribir comentarios en el código",
          "Copiar y pegar código 10 veces",
          "Usar nombres claros como 'velocidadMotor' y comentar el código"
        ],
        "correct": 3,
        "explanation": "¡Los buenos programadores escriben código que otros puedan entender! Nombres claros y comentarios valen oro."
      },
      {
        "id": "pa6",
        "question": "¿Para qué sirve Serial.available() en Arduino?",
        "options": [
          "Para encender un LED específico",
          "Para verificar si hay datos nuevos esperando ser leídos",
          "Para medir el voltaje de un pin",
          "Para mover un servo motor"
        ],
        "correct": 1,
        "explanation": "¡Serial.available() revisa si llegaron datos nuevos! Si devuelve > 0, hay algo para leer con Serial.read()."
      }
    ]
  },
  "mod_diseno": {
    "title": "Quiz: Mecanismos y Diseño 🔧",
    "description": "Demuestra tus conocimientos de diseño y fabricación",
    "questions": [
      {
        "id": "ds1",
        "question": "¿Qué material de impresión 3D es biodegradable y el más fácil para principiantes?",
        "options": [
          "ABS industrial",
          "Nylon de alta resistencia",
          "PLA (Ácido Poliláctico)",
          "Titanio en polvo"
        ],
        "correct": 2,
        "explanation": "¡El PLA es biodegradable, hecho de maíz, fácil de imprimir y no necesita cama caliente! Ideal para empezar."
      },
      {
        "id": "ds2",
        "question": "¿Por qué es importante que un robot sea MODULAR?",
        "options": [
          "Para poder reemplazar solo la parte que falle sin desarmarlo todo",
          "Para que se vea más bonito y colorido",
          "Para que sea más pesado y resistente",
          "Para que use más energía"
        ],
        "correct": 0,
        "explanation": "¡La modularidad ahorra tiempo y dinero! Si un sensor falla, solo cambias ese sensor sin desarmar todo."
      },
      {
        "id": "ds3",
        "question": "¿Qué herramienta online gratuita sirve para diseñar piezas 3D para principiantes?",
        "options": [
          "Microsoft Word",
          "Instagram",
          "YouTube",
          "Tinkercad"
        ],
        "correct": 3,
        "explanation": "¡Tinkercad es gratuito, funciona en el navegador y es perfecto para empezar a diseñar en 3D!"
      },
      {
        "id": "ds4",
        "question": "¿Qué formato de archivo se exporta del CAD para enviar a la impresora 3D?",
        "options": [
          ".mp3 (audio)",
          ".STL (modelo 3D)",
          ".jpg (imagen)",
          ".pdf (documento)"
        ],
        "correct": 1,
        "explanation": "¡El formato .STL es el estándar para impresión 3D! Exportas tu diseño del CAD a .STL y la impresora lo lee."
      },
      {
        "id": "ds5",
        "question": "¿Qué principio de diseño dice que un robot simétrico es más estable?",
        "options": [
          "Simetría = más estabilidad y movimientos rectos",
          "Colorimetría = más bonito",
          "Maximización = más grande es mejor",
          "Complejidad = más piezas es mejor"
        ],
        "correct": 0,
        "explanation": "¡Un robot simétrico tiene mejor equilibrio y se mueve más recto! La simetría es clave en el diseño robótico."
      },
      {
        "id": "ds6",
        "question": "¿Qué tecnología deposita plástico derretido capa por capa para crear piezas?",
        "options": [
          "Corte con láser industrial",
          "Inyección de plástico en moldes",
          "Impresión 3D FDM (modelado por deposición fundida)",
          "Soldadura de metales"
        ],
        "correct": 2,
        "explanation": "¡FDM (Fused Deposition Modeling) derrite filamento plástico y lo deposita capa por capa! Es la más accesible."
      }
    ]
  },
  "generic": {
    "title": "Quiz Rápido 🧠",
    "description": "Preguntas generales de robótica y tecnología",
    "questions": [
      {
        "id": "gq1",
        "question": "¿Qué es un robot?",
        "options": [
          "Una máquina programable que puede realizar tareas automáticamente",
          "Solo un juguete de plástico para niños",
          "Una computadora de escritorio muy grande",
          "Un animal mecánico de zoológico"
        ],
        "correct": 0,
        "explanation": "¡Un robot es una máquina que podemos programar para que haga diferentes tareas de forma automática o controlada!"
      },
      {
        "id": "gq2",
        "question": "¿Qué hace un sensor en un robot?",
        "options": [
          "Le da energía y potencia al robot",
          "Recibe información del entorno (temperatura, distancia, luz)",
          "Mueve las ruedas del robot",
          "Conecta el robot al internet"
        ],
        "correct": 1,
        "explanation": "¡Los sensores son como los 'sentidos' del robot! Le permiten ver, oír y sentir el mundo que lo rodea."
      },
      {
        "id": "gq3",
        "question": "¿Qué necesita un robot para moverse físicamente?",
        "options": [
          "Solo un sensor ultrasónico",
          "Solo una computadora potente",
          "Una antena de radio larga",
          "Un actuador (motor) y energía eléctrica"
        ],
        "correct": 3,
        "explanation": "¡Los actuadores como motores convierten la energía eléctrica en movimiento! Sin ellos, el robot no puede moverse."
      },
      {
        "id": "gq4",
        "question": "¿Qué es la inteligencia artificial (IA)?",
        "options": [
          "Un juego de video popular",
          "Un tipo de robot físico",
          "Tecnología que permite a las máquinas aprender y tomar decisiones",
          "Una red social de internet"
        ],
        "correct": 2,
        "explanation": "¡La IA permite que las máquinas aprendan de datos y tomen decisiones! Es el 'cerebro inteligente' de los robots modernos."
      },
      {
        "id": "gq5",
        "question": "¿Cuál es el lenguaje de programación base de Arduino?",
        "options": [
          "C++ (basado en C)",
          "Python",
          "Java",
          "HTML y CSS"
        ],
        "correct": 0,
        "explanation": "¡Arduino usa C++ como lenguaje base! Las funciones setup() y loop() son especiales de Arduino, pero la sintaxis es C++."
      },
      {
        "id": "gq6",
        "question": "¿Qué significan las siglas STEM?",
        "options": [
          "Un tipo de motor eléctrico",
          "Ciencia, Tecnología, Ingeniería y Matemáticas",
          "Un sensor especial de temperatura",
          "Una marca de robots educativos"
        ],
        "correct": 1,
        "explanation": "¡STEM = Science, Technology, Engineering, Mathematics! Es el enfoque educativo que combina estas 4 áreas."
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
      playCorrect();
      const timeBonus = Math.max(0, timeLeft);
      const streakBonus = streak >= 2 ? 5 : 0;
      const points = 10 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= 3) playStreak();
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      playWrong();
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
      playVictory();
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
    playClick();
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
              <div className="bg-[#60A5FA]/10 p-3 rounded-xl"><p className="text-2xl font-black text-[#60A5FA]">{avgTime}s</p><p className="text-[11px] text-[#60A5FA] font-bold">Tiempo Prom.</p></div>
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
