import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Star, Zap } from 'lucide-react';

// --- BANCO DE PREGUNTAS POR MÃ“DULO ---
const QUIZ_DATA = {
  "mod_intro_robot": {
    "title": "Quiz: Â¿QuÃ© es un Robot? ðŸ¤–",
    "description": "Pon a prueba lo que aprendiste sobre el mundo de los robots",
    "questions": [
      {
        "id": "ir1",
        "question": "Â¿CuÃ¡les son las 3 capacidades fundamentales de todo robot?",
        "options": [
          "Correr, Saltar y Volar",
          "Hablar, Cantar y Bailar",
          "Sentir, Pensar y Actuar",
          "Comer, Dormir y Jugar"
        ],
        "correct": 2,
        "explanation": "Â¡Exacto! Todo robot tiene sensores para SENTIR, un cerebro para PENSAR, y actuadores para ACTUAR. Â¡Es la regla de oro de la robÃ³tica!"
      },
      {
        "id": "ir2",
        "question": "Â¿De dÃ³nde viene la palabra 'Robot'?",
        "options": [
          "De una marca de juguetes japoneses",
          "Del checo 'robota' que significa 'trabajo forzado'",
          "Del inglÃ©s 'to rob' que significa robar",
          "De un cientÃ­fico llamado Dr. Robot"
        ],
        "correct": 1,
        "explanation": "La palabra Robot viene del checo 'robota' (trabajo forzado). Fue inventada por Karel ÄŒapek en 1920 para una obra de teatro."
      },
      {
        "id": "ir3",
        "question": "Un robot aspiradora como Roomba, Â¿quÃ© tipo de robot es?",
        "options": [
          "Robot Humanoide",
          "Brazo RobÃ³tico",
          "Robot Bio-inspirado",
          "Robot MÃ³vil"
        ],
        "correct": 3,
        "explanation": "Â¡El Roomba es un robot MÃ“VIL porque se desplaza con ruedas por el suelo! Los brazos robÃ³ticos se quedan fijos en un lugar."
      },
      {
        "id": "ir4",
        "question": "Â¿QuÃ© tipo de robot imita la forma y movimiento de los animales?",
        "options": [
          "Robot Bio-inspirado",
          "Robot Humanoide",
          "Robot MÃ³vil",
          "Brazo RobÃ³tico"
        ],
        "correct": 0,
        "explanation": "Â¡Los robots bio-inspirados imitan a los animales! Boston Dynamics hace robots-perro que caminan y saltan."
      },
      {
        "id": "ir5",
        "question": "Â¿QuÃ© es el 'pensamiento computacional' que aprendes con robÃ³tica?",
        "options": [
          "Pensar como una computadora sin emociones",
          "Saber muchas fÃ³rmulas de matemÃ¡ticas",
          "Resolver problemas dividiÃ©ndolos en pasos ordenados",
          "Hablar un lenguaje de programaciÃ³n fluidamente"
        ],
        "correct": 2,
        "explanation": "El pensamiento computacional es descomponer problemas complejos en pasos pequeÃ±os y lÃ³gicos. Â¡Es una superpotencia para la vida!"
      },
      {
        "id": "ir6",
        "question": "Â¿QuÃ© parte del robot son los 'sentidos' que detectan el entorno?",
        "options": [
          "Los motores",
          "Los sensores",
          "La baterÃ­a",
          "El chasis"
        ],
        "correct": 1,
        "explanation": "Â¡Los sensores son como los ojos, oÃ­dos y tacto del robot! Detectan luz, distancia, temperatura y mÃ¡s."
      },
      {
        "id": "ir7",
        "question": "Â¿QuÃ© robot de la NASA explora el planeta Marte actualmente?",
        "options": [
          "Roomba",
          "Alexa",
          "Sophia",
          "Perseverance Rover"
        ],
        "correct": 3,
        "explanation": "Â¡El rover Perseverance ha estado explorando Marte desde 2021! Incluso tiene un helicÃ³ptero robot llamado Ingenuity."
      },
      {
        "id": "ir8",
        "question": "Â¿CuÃ¡l es la funciÃ³n de los ACTUADORES en un robot?",
        "options": [
          "Permiten que el robot se mueva y haga cosas",
          "Almacenan la energÃ­a del robot",
          "Conectan el robot a internet",
          "Son los ojos del robot"
        ],
        "correct": 0,
        "explanation": "Â¡Los actuadores son los 'mÃºsculos' del robot! Motores, LEDs y bocinas que le permiten moverse y actuar."
      }
    ]
  },
  "mod_partes_robot": {
    "title": "Quiz: Partes de un Robot ðŸ§©",
    "description": "Demuestra que conoces cada parte del robot",
    "questions": [
      {
        "id": "pr1",
        "question": "Â¿QuÃ© placa es la mÃ¡s popular para aprender robÃ³tica?",
        "options": [
          "PlayStation 5",
          "Arduino UNO",
          "Tarjeta de crÃ©dito",
          "Tarjeta grÃ¡fica RTX"
        ],
        "correct": 1,
        "explanation": "Â¡Arduino UNO es la placa favorita de los principiantes! Es el cerebro mÃ¡s popular para robots educativos."
      },
      {
        "id": "pr2",
        "question": "Â¿CuÃ¡ntos centÃ­metros puede medir el sensor ultrasÃ³nico HC-SR04?",
        "options": [
          "Solo 1 metro exacto",
          "De 100 a 1000 cm",
          "De 0 a 10 cm",
          "De 2 a 400 cm"
        ],
        "correct": 3,
        "explanation": "El HC-SR04 tiene un rango de 2 a 400 centÃ­metros (4 metros). Â¡Usa ondas de sonido como un murciÃ©lago!"
      },
      {
        "id": "pr3",
        "question": "Â¿QuÃ© tipo de motor usarÃ­as para una GARRA que necesita abrirse a un Ã¡ngulo exacto?",
        "options": [
          "Motor DC (giro continuo)",
          "Motor Paso a Paso",
          "Servo Motor (Ã¡ngulo preciso de 0Â° a 180Â°)",
          "Motor de gasolina"
        ],
        "correct": 2,
        "explanation": "Â¡El servo motor es perfecto para garras! Puedes decirle exactamente a quÃ© Ã¡ngulo abrirse, al grado exacto."
      },
      {
        "id": "pr4",
        "question": "Â¿QuÃ© sensor detecta lÃ­neas negras en el piso para robots siguelÃ­neas?",
        "options": [
          "Sensor UltrasÃ³nico",
          "Sensor Infrarrojo",
          "Sensor de Temperatura",
          "Sensor de PresiÃ³n"
        ],
        "correct": 1,
        "explanation": "Â¡El sensor infrarrojo detecta el contraste entre la lÃ­nea negra y el piso claro! Es el ojo del robot siguelÃ­neas."
      },
      {
        "id": "pr5",
        "question": "Â¿CuÃ¡l es la mejor opciÃ³n de chasis para tu PRIMER robot con poco presupuesto?",
        "options": [
          "ImpresiÃ³n 3D en titanio",
          "Aluminio profesional",
          "CartÃ³n reciclado",
          "Fibra de carbono"
        ],
        "correct": 2,
        "explanation": "Â¡El cartÃ³n es perfecto para empezar! Es gratis, fÃ¡cil de cortar y puedes rediseÃ±ar sin gastar."
      },
      {
        "id": "pr6",
        "question": "Â¿QuÃ© tipo de baterÃ­a es recargable, potente y usada en drones?",
        "options": [
          "Pilas AAA",
          "BaterÃ­a de 9V",
          "Cable USB",
          "BaterÃ­a LiPo"
        ],
        "correct": 3,
        "explanation": "Las baterÃ­as LiPo (Litio PolÃ­mero) son recargables, potentes y ligeras. Â¡Ideales para drones y robots avanzados!"
      },
      {
        "id": "pr7",
        "question": "Â¿CuÃ¡ntos pines digitales tiene el Arduino UNO?",
        "options": [
          "14 pines",
          "6 pines",
          "100 pines",
          "2 pines"
        ],
        "correct": 0,
        "explanation": "Â¡Arduino UNO tiene 14 pines digitales y 6 analÃ³gicos! Son las 'patitas' donde conectas sensores y actuadores."
      },
      {
        "id": "pr8",
        "question": "Â¿QuÃ© sensor usarÃ­as para que tu robot detecte una pared antes de chocar?",
        "options": [
          "Sensor de Temperatura",
          "Sensor de Luz",
          "Sensor UltrasÃ³nico",
          "Sensor de peso"
        ],
        "correct": 2,
        "explanation": "Â¡El ultrasÃ³nico envÃ­a ondas de sonido y mide cuÃ¡nto tardan en rebotar! Si la distancia es corta, Â¡hay pared!"
      }
    ]
  },
  "mod_primer_proyecto": {
    "title": "Quiz: DiseÃ±a tu Robot ðŸŽ¨",
    "description": "Demuestra tus habilidades de diseÃ±o robÃ³tico",
    "questions": [
      {
        "id": "dp1",
        "question": "Si tu robot necesita conectarse a internet, Â¿quÃ© cerebro elegirÃ­as?",
        "options": [
          "Un sensor ultrasÃ³nico",
          "Arduino UNO (solo USB)",
          "ESP32 (WiFi y Bluetooth integrados)",
          "Una pila de 9V"
        ],
        "correct": 2,
        "explanation": "Â¡El ESP32 tiene WiFi y Bluetooth integrados! Perfecto para proyectos IoT sin mÃ³dulos extra."
      },
      {
        "id": "dp2",
        "question": "Â¿DÃ³nde deberÃ­as colocar las baterÃ­as para mayor estabilidad?",
        "options": [
          "En la parte de arriba",
          "En la base (parte de abajo)",
          "A un lado del robot",
          "No importa la ubicaciÃ³n"
        ],
        "correct": 1,
        "explanation": "Â¡Centro de gravedad bajo = mÃ¡s estabilidad! Al poner lo mÃ¡s pesado abajo, el robot no se voltea."
      },
      {
        "id": "dp3",
        "question": "Â¿CuÃ¡l es el PRIMER paso para construir un robot?",
        "options": [
          "Comprar todos los materiales",
          "Programar el cÃ³digo",
          "Conectar cables al azar",
          "Dibujar el diseÃ±o en papel"
        ],
        "correct": 3,
        "explanation": "Â¡Siempre empieza dibujando! Los ingenieros de NASA y Tesla primero DIBUJAN antes de construir."
      },
      {
        "id": "dp4",
        "question": "Â¿QuÃ© tamaÃ±o es ideal para tu primer robot?",
        "options": [
          "Del tamaÃ±o de un auto",
          "15 a 25 centÃ­metros",
          "MÃ¡s pequeÃ±o que un dedo",
          "Del tamaÃ±o de una casa"
        ],
        "correct": 1,
        "explanation": "15-25cm es ideal: no muy grande (difÃ­cil de mover) ni muy pequeÃ±o (difÃ­cil de armar)."
      },
      {
        "id": "dp5",
        "question": "Â¿QuÃ© significa que un robot sea 'modular'?",
        "options": [
          "Que tiene piezas intercambiables",
          "Que es muy grande",
          "Que solo funciona con internet",
          "Que no necesita energÃ­a"
        ],
        "correct": 0,
        "explanation": "Â¡Modular = piezas intercambiables! Si algo falla, solo cambias esa parte sin desarmar todo."
      },
      {
        "id": "dp6",
        "question": "Â¿CuÃ¡l es el orden CORRECTO para construir un robot?",
        "options": [
          "Programar â†’ Comprar â†’ Dibujar â†’ Armar",
          "Comprar todo â†’ Armar sin dibujar â†’ Programar",
          "Conectar cables al azar â†’ Ver si funciona",
          "Dibujar â†’ Lista materiales â†’ Armar â†’ ElectrÃ³nica â†’ Programar"
        ],
        "correct": 3,
        "explanation": "Â¡Siempre: dibujar, listar materiales, armar el cuerpo, conectar electrÃ³nica y programar! Orden = Ã©xito."
      }
    ]
  },
  "mod_electr": {
    "title": "Quiz: Electricidad Inicial âš¡",
    "description": "Pon a prueba lo que aprendiste sobre electricidad",
    "questions": [
      {
        "id": "q1",
        "question": "Â¿QuÃ© son los electrones?",
        "options": [
          "Tipos de cables elÃ©ctricos",
          "Luces que se ven en el cielo",
          "PartÃ­culas diminutas que al moverse crean electricidad",
          "Unidades de medida de voltaje"
        ],
        "correct": 2,
        "explanation": "Â¡Los electrones son partÃ­culas subatÃ³micas con carga negativa! Cuando fluyen de forma ordenada, generan corriente elÃ©ctrica."
      },
      {
        "id": "q2",
        "question": "Â¿CuÃ¡l de estos NO es una fuente de electricidad?",
        "options": [
          "El Sol (paneles solares)",
          "El Viento (molinos)",
          "El Agua (presas)",
          "Una piedra comÃºn"
        ],
        "correct": 3,
        "explanation": "Â¡Una piedra comÃºn no genera electricidad! Las fuentes reales son: solar, eÃ³lica, hidroelÃ©ctrica y baterÃ­as."
      },
      {
        "id": "q3",
        "question": "Â¿QuÃ© es un conductor elÃ©ctrico?",
        "options": [
          "Un material que detiene la electricidad",
          "Un material que permite pasar la electricidad, como el cobre",
          "Una persona que maneja un autobÃºs",
          "Un tipo de baterÃ­a especial"
        ],
        "correct": 1,
        "explanation": "Â¡Los conductores como el cobre permiten que la electricidad fluya! Son la 'autopista' de los electrones."
      },
      {
        "id": "q4",
        "question": "Â¿CuÃ¡les son las 4 partes de un circuito bÃ¡sico?",
        "options": [
          "LED, Motor, Sensor y BaterÃ­a",
          "Voltaje, Corriente, Resistencia y Potencia",
          "Fuente, Cables, Consumidor e Interruptor",
          "Arduino, Protoboard, Cables y Computadora"
        ],
        "correct": 2,
        "explanation": "Â¡Un circuito necesita: la Fuente (pila), los Cables (camino), el Consumidor (bombilla) y el Interruptor (puente)!"
      },
      {
        "id": "q5",
        "question": "En la Ley de Ohm (V = I Ã— R), Â¿quÃ© representa la V?",
        "options": [
          "Velocidad de los electrones",
          "Voltaje: la fuerza que empuja los electrones",
          "Volumen del sonido",
          "El nombre de un cientÃ­fico"
        ],
        "correct": 1,
        "explanation": "Â¡V es el Voltaje! Cuanto mÃ¡s alto, mÃ¡s fuerza tiene para empujar los electrones por el circuito."
      },
      {
        "id": "q6",
        "question": "Â¿Por quÃ© NUNCA debes tocar un enchufe con las manos mojadas?",
        "options": [
          "Porque el enchufe se oxida",
          "Porque el agua apaga la electricidad",
          "Porque se moja el piso",
          "Porque el agua conduce electricidad y pasarÃ­a por tu cuerpo"
        ],
        "correct": 3,
        "explanation": "Â¡El agua es conductora! Si tocas algo elÃ©ctrico con manos mojadas, la electricidad puede pasar por tu cuerpo."
      },
      {
        "id": "q7",
        "question": "Â¿QuÃ© material es un buen AISLANTE elÃ©ctrico?",
        "options": [
          "Un cable de cobre",
          "Una moneda de metal",
          "El plÃ¡stico que cubre los cables",
          "El agua con sal"
        ],
        "correct": 2,
        "explanation": "Â¡El plÃ¡stico es un aislante que nos protege! Por eso los cables estÃ¡n cubiertos de plÃ¡stico por fuera."
      },
      {
        "id": "q8",
        "question": "Si la Resistencia en un circuito aumenta, Â¿quÃ© pasa con la Corriente?",
        "options": [
          "La corriente aumenta mucho",
          "La corriente disminuye (pasan menos electrones)",
          "No pasa nada, todo sigue igual",
          "El circuito se apaga completamente"
        ],
        "correct": 1,
        "explanation": "Â¡SegÃºn V = I Ã— R, mÃ¡s resistencia = menos corriente! Es como poner mÃ¡s rocas en un tobogÃ¡n de agua."
      }
    ]
  },
  "mod_electon": {
    "title": "Quiz: ElectrÃ³nica Inicial ðŸ”Œ",
    "description": "Demuestra lo que sabes sobre componentes electrÃ³nicos",
    "questions": [
      {
        "id": "eq1",
        "question": "Â¿QuÃ© hace un diodo en un circuito?",
        "options": [
          "Amplifica la seÃ±al elÃ©ctrica",
          "Permite el flujo de corriente en una sola direcciÃ³n",
          "Almacena energÃ­a como una baterÃ­a",
          "Mide el voltaje del circuito"
        ],
        "correct": 1,
        "explanation": "Â¡El diodo es como una puerta que solo se abre en un sentido! La corriente solo puede pasar en una direcciÃ³n."
      },
      {
        "id": "eq2",
        "question": "Â¿Para quÃ© sirve un transistor?",
        "options": [
          "Solo para decorar el circuito",
          "Para medir la temperatura",
          "Como interruptor o amplificador de seÃ±ales",
          "Para conectar cables entre sÃ­"
        ],
        "correct": 2,
        "explanation": "Â¡El transistor puede actuar como interruptor electrÃ³nico o amplificar seÃ±ales dÃ©biles! Es de los mÃ¡s importantes."
      },
      {
        "id": "eq3",
        "question": "Â¿QuÃ© componente emite luz cuando pasa corriente?",
        "options": [
          "Un transistor",
          "Una resistencia",
          "Un LED (Diodo Emisor de Luz)",
          "Un capacitor"
        ],
        "correct": 2,
        "explanation": "LED significa 'Diodo Emisor de Luz'. Cuando la corriente pasa por Ã©l en la direcciÃ³n correcta, Â¡brilla!"
      },
      {
        "id": "eq4",
        "question": "Â¿QuÃ© componente almacena energÃ­a temporalmente como una mini-baterÃ­a rÃ¡pida?",
        "options": [
          "Capacitor",
          "Resistencia",
          "Inductor",
          "PotenciÃ³metro"
        ],
        "correct": 0,
        "explanation": "Â¡El capacitor almacena energÃ­a elÃ©ctrica y puede liberarla rÃ¡pidamente! Se usa mucho para estabilizar circuitos."
      },
      {
        "id": "eq5",
        "question": "Si conectas 3 LEDs en serie y uno se funde, Â¿quÃ© pasa?",
        "options": [
          "Solo ese LED se apaga",
          "Los otros brillan mÃ¡s fuerte",
          "Sale humo de los demÃ¡s",
          "Se apagan TODOS los LEDs"
        ],
        "correct": 3,
        "explanation": "Â¡En serie, si uno falla se rompe el circuito completo y todos se apagan! Es como una cadena: si un eslabÃ³n se rompe, toda la cadena falla."
      },
      {
        "id": "eq6",
        "question": "Â¿CuÃ¡l es la diferencia entre la pata larga y la pata corta de un LED?",
        "options": [
          "No hay ninguna diferencia",
          "Pata larga = positivo (+), pata corta = negativo (-)",
          "Pata larga = negativo, pata corta = positivo",
          "Ambas son para tierra (GND)"
        ],
        "correct": 1,
        "explanation": "Â¡La pata larga del LED es el Ã¡nodo (+) y la corta es el cÃ¡todo (-)! Si lo conectas al revÃ©s, no enciende."
      },
      {
        "id": "eq7",
        "question": "Â¿QuÃ© herramienta mide voltaje, corriente y resistencia?",
        "options": [
          "MultÃ­metro",
          "Protoboard",
          "CautÃ­n (soldador)",
          "Cable Dupont"
        ],
        "correct": 0,
        "explanation": "Â¡El multÃ­metro es tu mejor amigo para diagnosticar circuitos! Mide voltaje, corriente y resistencia."
      },
      {
        "id": "eq8",
        "question": "Las luces de tu casa estÃ¡n en paralelo. Si se funde un foco de la cocina, Â¿quÃ© pasa?",
        "options": [
          "Se apagan TODAS las luces de la casa",
          "Los demÃ¡s focos brillan mÃ¡s",
          "Salta el interruptor general",
          "Solo se apaga el de la cocina, las demÃ¡s siguen"
        ],
        "correct": 3,
        "explanation": "Â¡En paralelo, cada foco tiene su propio camino! Si uno falla, los demÃ¡s siguen funcionando."
      }
    ]
  },
  "mod_prog_gen": {
    "title": "Quiz: MecÃ¡nica Inicial âš™ï¸",
    "description": "Demuestra tus conocimientos de mecÃ¡nica para robots",
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
        "explanation": "Â¡El sube y baja es una palanca clÃ¡sica! Una barra que gira sobre un punto fijo (fulcro) en el centro."
      },
      {
        "id": "mg2",
        "question": "Si quieres que tu robot tenga MÃS FUERZA para subir una rampa, Â¿quÃ© relaciÃ³n de engranajes usas?",
        "options": [
          "Engranaje grande â†’ pequeÃ±o (multiplicador)",
          "Sin engranajes",
          "Engranaje pequeÃ±o â†’ grande (reductor)",
          "Engranajes del mismo tamaÃ±o"
        ],
        "correct": 2,
        "explanation": "Â¡Un engranaje reductor da mÃ¡s torque (fuerza de giro) a costa de menos velocidad! Perfecto para rampas."
      },
      {
        "id": "mg3",
        "question": "Â¿QuÃ© es el TORQUE en un motor de robot?",
        "options": [
          "La fuerza de giro que permite mover las ruedas",
          "La velocidad mÃ¡xima del motor",
          "El peso del motor",
          "El color del motor"
        ],
        "correct": 0,
        "explanation": "Â¡El torque es la fuerza rotacional! Un motor con mucho torque puede mover cargas pesadas aunque sea lento."
      },
      {
        "id": "mg4",
        "question": "Â¿QuÃ© rama de la fÃ­sica estudia el movimiento y las fuerzas que lo causan?",
        "options": [
          "Electricidad",
          "Ã“ptica",
          "TermodinÃ¡mica",
          "MecÃ¡nica"
        ],
        "correct": 3,
        "explanation": "Â¡La mecÃ¡nica estudia el movimiento y las fuerzas! En robÃ³tica, diseÃ±a ruedas, brazos, pinzas y todo lo mÃ³vil."
      },
      {
        "id": "mg5",
        "question": "Â¿QuÃ© mÃ¡quina simple reduce la fricciÃ³n y permite mover cosas rodando?",
        "options": [
          "Palanca",
          "Rueda y eje",
          "Plano inclinado",
          "Polea"
        ],
        "correct": 1,
        "explanation": "Â¡La rueda y eje reduce la fricciÃ³n y permite transportar objetos! Los robots con ruedas la usan constantemente."
      },
      {
        "id": "mg6",
        "question": "Â¿QuÃ© son los engranajes reductores?",
        "options": [
          "Ruedas que giran mÃ¡s rÃ¡pido sin fuerza",
          "Engranajes que solo van en una direcciÃ³n",
          "Engranaje pequeÃ±o mueve uno grande = mÃ¡s fuerza, menos velocidad",
          "Engranajes que no se conectan entre sÃ­"
        ],
        "correct": 2,
        "explanation": "Â¡El reductor sacrifica velocidad para ganar fuerza! Como un tractor: lento pero muy poderoso."
      }
    ]
  },
  "mod_mecanica": {
    "title": "Quiz: ProgramaciÃ³n Inicial ðŸ’»",
    "description": "Pon a prueba tus conocimientos de programaciÃ³n",
    "questions": [
      {
        "id": "mc1",
        "question": "Â¿QuÃ© es un algoritmo?",
        "options": [
          "Un tipo de robot muy rÃ¡pido",
          "Un lenguaje de programaciÃ³n",
          "Un error en el cÃ³digo",
          "Lista de pasos ordenados para resolver un problema"
        ],
        "correct": 3,
        "explanation": "Â¡Un algoritmo es como una receta de cocina! Pasos ordenados y precisos para resolver un problema."
      },
      {
        "id": "mc2",
        "question": "Â¿QuÃ© tipo de dato usarÃ­as para guardar si un sensor detectÃ³ obstÃ¡culo (sÃ­ o no)?",
        "options": [
          "bool (verdadero/falso)",
          "int (nÃºmero entero)",
          "String (texto)",
          "float (decimal)"
        ],
        "correct": 0,
        "explanation": "Â¡Un booleano (bool) es perfecto para sÃ­/no, verdadero/falso! Es el tipo de dato favorito de los robots para decidir."
      },
      {
        "id": "mc3",
        "question": "Â¿QuÃ© imprime este cÃ³digo?\n\nedad = 12\nif edad >= 10:\n    print('Grande')\nelse:\n    print('PequeÃ±o')",
        "options": [
          "PequeÃ±o",
          "Error",
          "Grande",
          "12"
        ],
        "correct": 2,
        "explanation": "Como edad es 12 y 12 >= 10 es verdadero, se ejecuta el bloque del if y se imprime 'Grande'."
      },
      {
        "id": "mc4",
        "question": "Â¿QuÃ© ciclo usarÃ­as si quieres que tu robot explore MIENTRAS tenga baterÃ­a?",
        "options": [
          "for (repite un nÃºmero exacto de veces)",
          "while (repite mientras la condiciÃ³n sea verdadera)",
          "if (solo se ejecuta una vez)",
          "break (sale del ciclo)"
        ],
        "correct": 1,
        "explanation": "Â¡while es perfecto cuando no sabes cuÃ¡ntas veces repetir! Solo que debe seguir mientras haya baterÃ­a."
      },
      {
        "id": "mc5",
        "question": "Â¿QuÃ© palabra clave se usa en Python para definir una funciÃ³n?",
        "options": [
          "def",
          "function",
          "void",
          "create"
        ],
        "correct": 0,
        "explanation": "Â¡En Python usamos 'def' (de 'define') para crear funciones! Es diferente a 'function' (JavaScript) o 'void' (C++)."
      },
      {
        "id": "mc6",
        "question": "Â¿QuÃ© hace la palabra clave 'return' en una funciÃ³n?",
        "options": [
          "Imprime un mensaje en pantalla",
          "Elimina la funciÃ³n del cÃ³digo",
          "Cierra el programa completamente",
          "Devuelve un valor al cÃ³digo que la llamÃ³"
        ],
        "correct": 3,
        "explanation": "Â¡return entrega un resultado! Es como pedir una pizza: llamas a la funciÃ³n, ella hace algo, y te DEVUELVE el resultado."
      },
      {
        "id": "mc7",
        "question": "Si copias el mismo cÃ³digo mÃ¡s de 2 veces, Â¿quÃ© deberÃ­as hacer?",
        "options": [
          "Dejarlo asÃ­, funciona igual",
          "Borrarlo todo",
          "Convertirlo en una funciÃ³n reutilizable",
          "Cambiarle el nombre a cada copia"
        ],
        "correct": 2,
        "explanation": "Â¡Las funciones evitan repetir cÃ³digo! Escribes una vez, la llamas las veces que quieras. Los buenos programadores son eficientes."
      },
      {
        "id": "mc8",
        "question": "Â¿QuÃ© significa 'Bug' en programaciÃ³n?",
        "options": [
          "Una nueva caracterÃ­stica del programa",
          "Un error en el cÃ³digo",
          "Un tipo de variable especial",
          "Un lenguaje de programaciÃ³n"
        ],
        "correct": 1,
        "explanation": "Â¡Un Bug es un error! La palabra viene de 1947 cuando una polilla real causÃ³ un fallo en una computadora Harvard."
      }
    ]
  },
  "mod_arduino": {
    "title": "Quiz: Control con Arduino ðŸ•¹ï¸",
    "description": "Pon a prueba tus conocimientos de Arduino",
    "questions": [
      {
        "id": "aq1",
        "question": "Â¿QuÃ© es Arduino UNO?",
        "options": [
          "Un videojuego de robots",
          "Una placa de desarrollo para crear proyectos electrÃ³nicos",
          "Un tipo de cable especial",
          "Una aplicaciÃ³n de celular"
        ],
        "correct": 1,
        "explanation": "Â¡Arduino UNO es una placa electrÃ³nica que puedes programar para controlar LEDs, motores, sensores y mÃ¡s!"
      },
      {
        "id": "aq2",
        "question": "Â¿QuÃ© funciÃ³n usamos para encender un LED con Arduino?",
        "options": [
          "digitalWrite(pin, HIGH)",
          "turnOnLight()",
          "ledOn()",
          "print('encender')"
        ],
        "correct": 0,
        "explanation": "Â¡digitalWrite(pin, HIGH) le dice a Arduino que envÃ­e 5V por un pin especÃ­fico, encendiendo lo que estÃ© conectado!"
      },
      {
        "id": "aq3",
        "question": "Â¿QuÃ© rango de valores puede leer un pin analÃ³gico de Arduino?",
        "options": [
          "Solo HIGH o LOW",
          "0 a 255",
          "0 a 100",
          "0 a 1023"
        ],
        "correct": 3,
        "explanation": "Â¡Los pines analÃ³gicos usan 10 bits de resoluciÃ³n: 2Â¹â° = 1024 valores posibles (0 a 1023)!"
      },
      {
        "id": "aq4",
        "question": "Â¿CuÃ¡l es la diferencia entre setup() y loop() en Arduino?",
        "options": [
          "Ambos se ejecutan una sola vez",
          "setup() se ejecuta una vez, loop() se repite para siempre",
          "loop() va antes que setup()",
          "Son exactamente la misma funciÃ³n"
        ],
        "correct": 1,
        "explanation": "Â¡setup() prepara todo UNA vez (como vestirte), loop() repite sin parar (como respirar)!"
      },
      {
        "id": "aq5",
        "question": "Â¿QuÃ© hace delay(1000) en Arduino?",
        "options": [
          "Enciende un LED",
          "Lee un sensor",
          "EnvÃ­a un mensaje serial",
          "Pausa el programa 1 segundo (1000ms)"
        ],
        "correct": 3,
        "explanation": "Â¡delay(1000) pausa el programa 1 segundo! Arduino mide el tiempo en milisegundos: 1000ms = 1s."
      },
      {
        "id": "aq6",
        "question": "Â¿QuÃ© hace analogRead(A0) en Arduino?",
        "options": [
          "Escribe un valor analÃ³gico en A0",
          "Enciende el pin A0",
          "Lee un valor entre 0 y 1023 del pin A0",
          "Apaga el sensor conectado"
        ],
        "correct": 2,
        "explanation": "Â¡analogRead lee un valor analÃ³gico (0-1023) del pin! Un valor de 512 serÃ­a aproximadamente 2.5V."
      },
      {
        "id": "aq7",
        "question": "Â¿Para quÃ© sirve Serial.println() en Arduino?",
        "options": [
          "Enviar mensajes a tu computadora para depuraciÃ³n",
          "Encender un LED en serie",
          "Conectar dos Arduinos entre sÃ­",
          "Mover un motor paso a paso"
        ],
        "correct": 0,
        "explanation": "Â¡Serial.println() es tu mejor amigo para depurar! EnvÃ­a datos del Arduino a tu PC por el Monitor Serial."
      },
      {
        "id": "aq8",
        "question": "Â¿DÃ³nde fue creado Arduino y en quÃ© aÃ±o?",
        "options": [
          "JapÃ³n, 2010",
          "Estados Unidos, 2000",
          "Italia, 2005",
          "Alemania, 2015"
        ],
        "correct": 2,
        "explanation": "Â¡Arduino fue creado en Ivrea, Italia, en 2005! Por un grupo de maestros que querÃ­an facilitar la programaciÃ³n de hardware."
      }
    ]
  },
  "mod_cpp": {
    "title": "Quiz: LÃ³gica Esencial ðŸ§ ",
    "description": "Demuestra tu dominio de la lÃ³gica booleana",
    "questions": [
      {
        "id": "lg1",
        "question": "Un robot debe avanzar SOLO si el camino estÃ¡ libre Y la baterÃ­a tiene carga. Â¿QuÃ© operador usas?",
        "options": [
          "AND (&&) â€” ambas condiciones deben ser verdaderas",
          "OR (||) â€” al menos una debe ser verdadera",
          "NOT (!) â€” invierte el valor",
          "XOR â€” una u otra pero no ambas"
        ],
        "correct": 0,
        "explanation": "Â¡AND porque AMBAS condiciones deben cumplirse! Si usaras OR, avanzarÃ­a con baterÃ­a vacÃ­a mientras el camino estÃ© libre."
      },
      {
        "id": "lg2",
        "question": "Si A = true y B = false, Â¿cuÃ¡nto vale A AND B?",
        "options": [
          "true",
          "Depende de C",
          "Error",
          "false"
        ],
        "correct": 3,
        "explanation": "Â¡AND requiere que AMBOS sean verdaderos! Como B es false, el resultado es false sin importar A."
      },
      {
        "id": "lg3",
        "question": "Â¿QuÃ© forma tiene el sÃ­mbolo de DECISIÃ“N en un diagrama de flujo?",
        "options": [
          "Ã“valo",
          "RectÃ¡ngulo",
          "Diamante (rombo)",
          "Flecha"
        ],
        "correct": 2,
        "explanation": "Â¡El diamante o rombo representa una pregunta con dos salidas: SÃ­ y No! Es el sÃ­mbolo mÃ¡s importante del diagrama."
      },
      {
        "id": "lg4",
        "question": "Â¿QuÃ© resultado da NOT true (negar verdadero)?",
        "options": [
          "true",
          "false",
          "Error",
          "null"
        ],
        "correct": 1,
        "explanation": "Â¡NOT invierte el valor! NOT true = false y NOT false = true. Es como un interruptor que pone todo al revÃ©s."
      },
      {
        "id": "lg5",
        "question": "Â¿QuiÃ©n inventÃ³ el Ã¡lgebra booleana que usan todas las computadoras?",
        "options": [
          "George Boole",
          "Isaac Newton",
          "Albert Einstein",
          "Nikola Tesla"
        ],
        "correct": 0,
        "explanation": "Â¡George Boole, un matemÃ¡tico inglÃ©s del siglo XIX! Sin su trabajo, no existirÃ­an las computadoras ni los smartphones."
      },
      {
        "id": "lg6",
        "question": "En la tabla OR, Â¿cuÃ¡ndo el resultado es FALSE?",
        "options": [
          "Cuando al menos uno es true",
          "Solo cuando AMBOS valores son false",
          "Cuando ambos son true",
          "Nunca es false"
        ],
        "correct": 1,
        "explanation": "Â¡OR es 'generoso': basta con que UNO sea verdadero para dar true! Solo es false cuando AMBOS son false."
      }
    ]
  },
  "mod_python": {
    "title": "Quiz: PrÃ¡ctica LED ðŸ’¡",
    "description": "Pon a prueba lo que aprendiste sobre circuitos con LED",
    "questions": [
      {
        "id": "pl1",
        "question": "Â¿QuÃ© pasa si conectas un LED directamente a una pila de 9V SIN resistencia?",
        "options": [
          "Brilla mÃ¡s fuerte y dura mÃ¡s",
          "No pasa nada, funciona igual",
          "El LED se quema por exceso de corriente",
          "La pila se descarga mÃ¡s lento"
        ],
        "correct": 2,
        "explanation": "Â¡Sin resistencia, pasa demasiada corriente y el LED se quema en segundos! La resistencia es su cinturÃ³n de seguridad."
      },
      {
        "id": "pl2",
        "question": "Â¿QuÃ© identifica la pata LARGA de un LED?",
        "options": [
          "Es el terminal positivo (+) o Ã¡nodo",
          "Es el terminal negativo (-)",
          "No hay diferencia entre patas",
          "Es la conexiÃ³n a tierra"
        ],
        "correct": 0,
        "explanation": "Â¡La pata larga es el Ã¡nodo (+) y la corta es el cÃ¡todo (-)! Si lo conectas al revÃ©s, simplemente no enciende."
      },
      {
        "id": "pl3",
        "question": "Â¿QuÃ© fÃ³rmula usas para calcular la resistencia necesaria para un LED?",
        "options": [
          "V = I Ã— R",
          "R = (Vfuente - VLED) Ã· ILED",
          "P = V Ã— I",
          "E = mcÂ²"
        ],
        "correct": 1,
        "explanation": "Â¡Esta fÃ³rmula calcula la resistencia exacta que necesitas para proteger tu LED sin que se queme!"
      },
      {
        "id": "pl4",
        "question": "Si el LED no enciende en tu circuito, Â¿quÃ© es lo PRIMERO que debes verificar?",
        "options": [
          "Si la mesa estÃ¡ nivelada",
          "El color del cable usado",
          "Si la computadora tiene internet",
          "La orientaciÃ³n del LED (puede estar al revÃ©s)"
        ],
        "correct": 3,
        "explanation": "Â¡Lo mÃ¡s comÃºn es que el LED estÃ© invertido! GÃ­ralo 180Â° y prueba de nuevo. Si sigue sin encender, revisa las conexiones."
      },
      {
        "id": "pl5",
        "question": "Â¿Para quÃ© sirve la PROTOBOARD?",
        "options": [
          "Para soldar componentes permanentemente",
          "Para medir voltaje y corriente",
          "Para armar circuitos sin soldar, insertando componentes",
          "Para cortar cables elÃ©ctricos"
        ],
        "correct": 2,
        "explanation": "Â¡La protoboard tiene agujeros conectados internamente donde insertas componentes sin necesidad de soldar!"
      },
      {
        "id": "pl6",
        "question": "Â¿QuÃ© componente PROTEGE al LED de quemarse limitando la corriente?",
        "options": [
          "La resistencia",
          "El cable USB",
          "Otro LED en paralelo",
          "Un interruptor de botÃ³n"
        ],
        "correct": 0,
        "explanation": "Â¡La resistencia limita la corriente que pasa por el LED! Sin ella, el LED recibe demasiada energÃ­a y se daÃ±a."
      }
    ]
  },
  "mod_robotica": {
    "title": "Quiz: LED con Arduino ðŸ”·",
    "description": "Demuestra tus conocimientos de control de LEDs con Arduino",
    "questions": [
      {
        "id": "ra1",
        "question": "Â¿Por quÃ© el pin 13 es especial en Arduino UNO?",
        "options": [
          "Es el Ãºnico pin que funciona",
          "Tiene un LED integrado en la propia placa",
          "Es mÃ¡s potente que los demÃ¡s pines",
          "Solo funciona con motores"
        ],
        "correct": 1,
        "explanation": "Â¡El pin 13 tiene un LED integrado en la placa Arduino! Si conectas mal el LED externo, el interno aÃºn funciona."
      },
      {
        "id": "ra2",
        "question": "Â¿QuÃ© funciÃ³n de Arduino controla el BRILLO del LED (no solo encender/apagar)?",
        "options": [
          "analogWrite()",
          "digitalWrite()",
          "digitalRead()",
          "Serial.println()"
        ],
        "correct": 0,
        "explanation": "Â¡analogWrite() envÃ­a un valor PWM (0-255) que controla el brillo! 0 = apagado, 127 = medio, 255 = mÃ¡ximo."
      },
      {
        "id": "ra3",
        "question": "En cÃ³digo Morse con LED, Â¿quÃ© representa un punto (.)?",
        "options": [
          "LED apagado 1 segundo",
          "LED encendido 600ms (largo)",
          "LED apagado 200ms",
          "LED encendido 200ms (corto)"
        ],
        "correct": 3,
        "explanation": "Â¡Un punto es un destello corto de 200ms! Una raya es mÃ¡s larga (600ms). S.O.S = â€¢â€¢â€¢ â€”â€”â€” â€¢â€¢â€¢"
      },
      {
        "id": "ra4",
        "question": "Â¿QuÃ© rango de valores acepta analogWrite() para controlar el brillo?",
        "options": [
          "0 a 255",
          "0 a 1023",
          "Solo HIGH o LOW",
          "0 a 100 (porcentaje)"
        ],
        "correct": 0,
        "explanation": "Â¡analogWrite usa 8 bits: 0 (apagado) a 255 (mÃ¡ximo brillo)! 127 serÃ­a aproximadamente 50%."
      },
      {
        "id": "ra5",
        "question": "Si tu LED no enciende con Arduino, Â¿quÃ© debes verificar PRIMERO?",
        "options": [
          "Si hay conexiÃ³n a internet",
          "Si estÃ¡ lloviendo afuera",
          "La orientaciÃ³n del LED y las conexiones al pin y GND",
          "El color del Arduino"
        ],
        "correct": 2,
        "explanation": "Â¡Verifica que la pata larga (+) vaya al pin y la corta (-) a GND! TambiÃ©n revisa que el pin sea correcto en el cÃ³digo."
      },
      {
        "id": "ra6",
        "question": "Â¿QuÃ© efecto logra el 'LED Fade' o efecto 'respiraciÃ³n'?",
        "options": [
          "El LED parpadea rÃ¡pidamente",
          "El LED sube y baja de brillo gradualmente",
          "El LED cambia de color automÃ¡ticamente",
          "El LED se apaga permanentemente"
        ],
        "correct": 1,
        "explanation": "Â¡El fade sube y baja el brillo suavemente usando analogWrite! Se ve como si el LED 'respirara'."
      }
    ]
  },
  "mod_componentes": {
    "title": "Quiz: Motor con Arduino âš¡",
    "description": "Pon a prueba tus conocimientos sobre motores y drivers",
    "questions": [
      {
        "id": "cm1",
        "question": "Â¿Por quÃ© NUNCA debes conectar un motor directamente a un pin de Arduino?",
        "options": [
          "Porque Arduino es muy pesado",
          "Porque el motor es muy lento",
          "Porque Arduino no tiene pines suficientes",
          "Porque Arduino no puede dar suficiente corriente, necesitas un driver"
        ],
        "correct": 3,
        "explanation": "Â¡Un pin de Arduino da mÃ¡ximo 40mA, pero un motor necesita 200-500mA! El driver L298N amplifica la seÃ±al."
      },
      {
        "id": "cm2",
        "question": "Â¿QuÃ© mÃ³dulo se usa como driver para controlar motores DC con Arduino?",
        "options": [
          "L298N",
          "HC-SR04",
          "LCD 16x2",
          "DHT11"
        ],
        "correct": 0,
        "explanation": "Â¡El L298N es un puente H que amplifica la seÃ±al de Arduino para mover motores potentes! Controla 2 motores."
      },
      {
        "id": "cm3",
        "question": "Para que un robot gire SOBRE SU EJE (como trompo), Â¿quÃ© deben hacer los motores?",
        "options": [
          "Ambos motores adelante a misma velocidad",
          "Ambos motores apagados",
          "Un motor adelante y el otro atrÃ¡s",
          "Un motor rÃ¡pido y otro lento en misma direcciÃ³n"
        ],
        "correct": 2,
        "explanation": "Â¡Cuando un motor va adelante y el otro atrÃ¡s, el robot gira sobre su propio eje! Es la maniobra mÃ¡s Ãºtil."
      },
      {
        "id": "cm4",
        "question": "Si usas analogWrite(ENA, 127), Â¿a quÃ© porcentaje de velocidad va el motor?",
        "options": [
          "100% (mÃ¡xima velocidad)",
          "Aproximadamente 50%",
          "0% (detenido)",
          "127% (velocidad extra)"
        ],
        "correct": 1,
        "explanation": "Â¡El rango PWM es 0-255, asÃ­ que 127 es aprox. la mitad (50%)! Con 255 va al mÃ¡ximo y con 0 estÃ¡ parado."
      },
      {
        "id": "cm5",
        "question": "Â¿QuÃ© configuraciÃ³n de pines del L298N hace que el motor se DETENGA?",
        "options": [
          "IN1=LOW, IN2=LOW (ambos apagados)",
          "IN1=HIGH, IN2=HIGH",
          "IN1=HIGH, IN2=LOW",
          "Desconectar el Arduino por completo"
        ],
        "correct": 0,
        "explanation": "Â¡Ambos pines en LOW cortan la energÃ­a al motor y se detiene! HIGH+LOW = adelante, LOW+HIGH = atrÃ¡s."
      },
      {
        "id": "cm6",
        "question": "Â¿QuÃ© tipo de motor gira a un Ã¡ngulo EXACTO entre 0Â° y 180Â°?",
        "options": [
          "Motor DC de corriente continua",
          "Motor de gasolina",
          "Motor Paso a Paso (stepper)",
          "Servo Motor"
        ],
        "correct": 3,
        "explanation": "Â¡El servo motor gira al Ã¡ngulo exacto que le indiques! Ideal para brazos robÃ³ticos, garras y cabezas de robot."
      }
    ]
  },
  "mod_control": {
    "title": "Quiz: LÃ³gica y Control ðŸŽ›ï¸",
    "description": "Pon a prueba tus conocimientos de sistemas de control",
    "questions": [
      {
        "id": "ct1",
        "question": "El cruise control de un auto mide velocidad real y ajusta el motor. Â¿QuÃ© tipo de control es?",
        "options": [
          "Lazo abierto (no mide nada)",
          "Lazo cerrado (mide y ajusta)",
          "Sin control automÃ¡tico",
          "Control manual con volante"
        ],
        "correct": 1,
        "explanation": "Â¡Es lazo cerrado perfecto! Mide la velocidad REAL, compara con la deseada, y ajusta el motor. Â¡Feedback constante!"
      },
      {
        "id": "ct2",
        "question": "Un tostador con timer fijo (sin medir si el pan estÃ¡ tostado) es un ejemplo de:",
        "options": [
          "Control de Lazo Cerrado",
          "Control PID avanzado",
          "Control de Lazo Abierto",
          "Control inteligente con IA"
        ],
        "correct": 2,
        "explanation": "Â¡Es lazo abierto porque no mide el resultado! Solo ejecuta un tiempo fijo sin importar cÃ³mo quede el pan."
      },
      {
        "id": "ct3",
        "question": "Â¿QuÃ© es el 'feedback' o retroalimentaciÃ³n en un sistema de control?",
        "options": [
          "La fuente de energÃ­a del robot",
          "El color del sensor utilizado",
          "Un tipo de motor especial",
          "InformaciÃ³n del resultado que se usa para corregir el siguiente paso"
        ],
        "correct": 3,
        "explanation": "Â¡El feedback es la clave del lazo cerrado! El sistema mide quÃ© pasÃ³ y usa esa info para mejorar la siguiente acciÃ³n."
      },
      {
        "id": "ct4",
        "question": "Â¿QuÃ© componente del PID corrige proporcionalmente al error actual?",
        "options": [
          "P (Proporcional)",
          "I (Integral)",
          "D (Derivativo)",
          "Ninguno de los tres"
        ],
        "correct": 0,
        "explanation": "Â¡P multiplica el error por una constante Kp! Error grande = correcciÃ³n grande, error pequeÃ±o = correcciÃ³n pequeÃ±a."
      },
      {
        "id": "ct5",
        "question": "Â¿QuÃ© aplicaciones comunes usan control PID?",
        "options": [
          "Libros de texto escolares",
          "Drones para mantenerse estables y robots siguelÃ­neas",
          "Juegos de mesa tradicionales",
          "Calculadoras cientÃ­ficas"
        ],
        "correct": 1,
        "explanation": "Â¡Los drones hacen CIENTOS de ajustes PID por segundo para no caerse! Los robots siguelÃ­neas tambiÃ©n lo usan."
      },
      {
        "id": "ct6",
        "question": "Un aire acondicionado que mide la temperatura actual y ajusta la potencia es:",
        "options": [
          "Lazo abierto sin sensores",
          "Sin ningÃºn tipo de control",
          "Lazo cerrado con retroalimentaciÃ³n",
          "Control manual del usuario"
        ],
        "correct": 2,
        "explanation": "Â¡El A/C mide temperatura (sensor), compara con la deseada, y ajusta! Es un lazo cerrado clÃ¡sico."
      }
    ]
  },
  "mod_prog_avanzada": {
    "title": "Quiz: ProgramaciÃ³n Avanzada ðŸš€",
    "description": "Pon a prueba tus conocimientos avanzados de programaciÃ³n",
    "questions": [
      {
        "id": "pa1",
        "question": "Â¿QuÃ© es un Array en programaciÃ³n?",
        "options": [
          "Un tipo de motor robÃ³tico",
          "Un sensor de Arduino especial",
          "Un error frecuente del cÃ³digo",
          "Una lista ordenada de datos con Ã­ndices numÃ©ricos"
        ],
        "correct": 3,
        "explanation": "Â¡Un array es una lista donde cada dato tiene una posiciÃ³n (Ã­ndice)! Empiezan desde 0, no desde 1."
      },
      {
        "id": "pa2",
        "question": "Â¿CÃ³mo se incluye una librerÃ­a en Arduino?",
        "options": [
          "#include <NombreLibreria.h>",
          "import NombreLibreria",
          "using NombreLibreria",
          "require('NombreLibreria')"
        ],
        "correct": 0,
        "explanation": "Â¡En Arduino/C++ usamos #include! Es como decir 'necesito estas herramientas extra para mi proyecto'."
      },
      {
        "id": "pa3",
        "question": "Â¿QuÃ© mÃ³dulo Bluetooth se usa comÃºnmente con Arduino?",
        "options": [
          "ESP32 completo",
          "HC-05",
          "L298N",
          "LM35"
        ],
        "correct": 1,
        "explanation": "Â¡El HC-05 es el mÃ³dulo Bluetooth clÃ¡sico para Arduino! Permite controlar tu robot desde el celular."
      },
      {
        "id": "pa4",
        "question": "Â¿QuÃ© funciÃ³n lee datos recibidos por Serial/Bluetooth en Arduino?",
        "options": [
          "Serial.println()",
          "digitalWrite()",
          "Serial.read()",
          "analogWrite()"
        ],
        "correct": 2,
        "explanation": "Â¡Serial.read() lee un byte (carÃ¡cter) del puerto serial! El mÃ³dulo Bluetooth envÃ­a datos por serial."
      },
      {
        "id": "pa5",
        "question": "Â¿CuÃ¡l es una buena prÃ¡ctica de programaciÃ³n?",
        "options": [
          "Usar nombres de variables como 'x' y 'y'",
          "No escribir comentarios en el cÃ³digo",
          "Copiar y pegar cÃ³digo 10 veces",
          "Usar nombres claros como 'velocidadMotor' y comentar el cÃ³digo"
        ],
        "correct": 3,
        "explanation": "Â¡Los buenos programadores escriben cÃ³digo que otros puedan entender! Nombres claros y comentarios valen oro."
      },
      {
        "id": "pa6",
        "question": "Â¿Para quÃ© sirve Serial.available() en Arduino?",
        "options": [
          "Para encender un LED especÃ­fico",
          "Para verificar si hay datos nuevos esperando ser leÃ­dos",
          "Para medir el voltaje de un pin",
          "Para mover un servo motor"
        ],
        "correct": 1,
        "explanation": "Â¡Serial.available() revisa si llegaron datos nuevos! Si devuelve > 0, hay algo para leer con Serial.read()."
      }
    ]
  },
  "mod_diseno": {
    "title": "Quiz: Mecanismos y DiseÃ±o ðŸ”§",
    "description": "Demuestra tus conocimientos de diseÃ±o y fabricaciÃ³n",
    "questions": [
      {
        "id": "ds1",
        "question": "Â¿QuÃ© material de impresiÃ³n 3D es biodegradable y el mÃ¡s fÃ¡cil para principiantes?",
        "options": [
          "ABS industrial",
          "Nylon de alta resistencia",
          "PLA (Ãcido PolilÃ¡ctico)",
          "Titanio en polvo"
        ],
        "correct": 2,
        "explanation": "Â¡El PLA es biodegradable, hecho de maÃ­z, fÃ¡cil de imprimir y no necesita cama caliente! Ideal para empezar."
      },
      {
        "id": "ds2",
        "question": "Â¿Por quÃ© es importante que un robot sea MODULAR?",
        "options": [
          "Para poder reemplazar solo la parte que falle sin desarmarlo todo",
          "Para que se vea mÃ¡s bonito y colorido",
          "Para que sea mÃ¡s pesado y resistente",
          "Para que use mÃ¡s energÃ­a"
        ],
        "correct": 0,
        "explanation": "Â¡La modularidad ahorra tiempo y dinero! Si un sensor falla, solo cambias ese sensor sin desarmar todo."
      },
      {
        "id": "ds3",
        "question": "Â¿QuÃ© herramienta online gratuita sirve para diseÃ±ar piezas 3D para principiantes?",
        "options": [
          "Microsoft Word",
          "Instagram",
          "YouTube",
          "Tinkercad"
        ],
        "correct": 3,
        "explanation": "Â¡Tinkercad es gratuito, funciona en el navegador y es perfecto para empezar a diseÃ±ar en 3D!"
      },
      {
        "id": "ds4",
        "question": "Â¿QuÃ© formato de archivo se exporta del CAD para enviar a la impresora 3D?",
        "options": [
          ".mp3 (audio)",
          ".STL (modelo 3D)",
          ".jpg (imagen)",
          ".pdf (documento)"
        ],
        "correct": 1,
        "explanation": "Â¡El formato .STL es el estÃ¡ndar para impresiÃ³n 3D! Exportas tu diseÃ±o del CAD a .STL y la impresora lo lee."
      },
      {
        "id": "ds5",
        "question": "Â¿QuÃ© principio de diseÃ±o dice que un robot simÃ©trico es mÃ¡s estable?",
        "options": [
          "SimetrÃ­a = mÃ¡s estabilidad y movimientos rectos",
          "ColorimetrÃ­a = mÃ¡s bonito",
          "MaximizaciÃ³n = mÃ¡s grande es mejor",
          "Complejidad = mÃ¡s piezas es mejor"
        ],
        "correct": 0,
        "explanation": "Â¡Un robot simÃ©trico tiene mejor equilibrio y se mueve mÃ¡s recto! La simetrÃ­a es clave en el diseÃ±o robÃ³tico."
      },
      {
        "id": "ds6",
        "question": "Â¿QuÃ© tecnologÃ­a deposita plÃ¡stico derretido capa por capa para crear piezas?",
        "options": [
          "Corte con lÃ¡ser industrial",
          "InyecciÃ³n de plÃ¡stico en moldes",
          "ImpresiÃ³n 3D FDM (modelado por deposiciÃ³n fundida)",
          "Soldadura de metales"
        ],
        "correct": 2,
        "explanation": "Â¡FDM (Fused Deposition Modeling) derrite filamento plÃ¡stico y lo deposita capa por capa! Es la mÃ¡s accesible."
      }
    ]
  },
  "generic": {
    "title": "Quiz RÃ¡pido ðŸ§ ",
    "description": "Preguntas generales de robÃ³tica y tecnologÃ­a",
    "questions": [
      {
        "id": "gq1",
        "question": "Â¿QuÃ© es un robot?",
        "options": [
          "Una mÃ¡quina programable que puede realizar tareas automÃ¡ticamente",
          "Solo un juguete de plÃ¡stico para niÃ±os",
          "Una computadora de escritorio muy grande",
          "Un animal mecÃ¡nico de zoolÃ³gico"
        ],
        "correct": 0,
        "explanation": "Â¡Un robot es una mÃ¡quina que podemos programar para que haga diferentes tareas de forma automÃ¡tica o controlada!"
      },
      {
        "id": "gq2",
        "question": "Â¿QuÃ© hace un sensor en un robot?",
        "options": [
          "Le da energÃ­a y potencia al robot",
          "Recibe informaciÃ³n del entorno (temperatura, distancia, luz)",
          "Mueve las ruedas del robot",
          "Conecta el robot al internet"
        ],
        "correct": 1,
        "explanation": "Â¡Los sensores son como los 'sentidos' del robot! Le permiten ver, oÃ­r y sentir el mundo que lo rodea."
      },
      {
        "id": "gq3",
        "question": "Â¿QuÃ© necesita un robot para moverse fÃ­sicamente?",
        "options": [
          "Solo un sensor ultrasÃ³nico",
          "Solo una computadora potente",
          "Una antena de radio larga",
          "Un actuador (motor) y energÃ­a elÃ©ctrica"
        ],
        "correct": 3,
        "explanation": "Â¡Los actuadores como motores convierten la energÃ­a elÃ©ctrica en movimiento! Sin ellos, el robot no puede moverse."
      },
      {
        "id": "gq4",
        "question": "Â¿QuÃ© es la inteligencia artificial (IA)?",
        "options": [
          "Un juego de video popular",
          "Un tipo de robot fÃ­sico",
          "TecnologÃ­a que permite a las mÃ¡quinas aprender y tomar decisiones",
          "Una red social de internet"
        ],
        "correct": 2,
        "explanation": "Â¡La IA permite que las mÃ¡quinas aprendan de datos y tomen decisiones! Es el 'cerebro inteligente' de los robots modernos."
      },
      {
        "id": "gq5",
        "question": "Â¿CuÃ¡l es el lenguaje de programaciÃ³n base de Arduino?",
        "options": [
          "C++ (basado en C)",
          "Python",
          "Java",
          "HTML y CSS"
        ],
        "correct": 0,
        "explanation": "Â¡Arduino usa C++ como lenguaje base! Las funciones setup() y loop() son especiales de Arduino, pero la sintaxis es C++."
      },
      {
        "id": "gq6",
        "question": "Â¿QuÃ© significan las siglas STEM?",
        "options": [
          "Un tipo de motor elÃ©ctrico",
          "Ciencia, TecnologÃ­a, IngenierÃ­a y MatemÃ¡ticas",
          "Un sensor especial de temperatura",
          "Una marca de robots educativos"
        ],
        "correct": 1,
        "explanation": "Â¡STEM = Science, Technology, Engineering, Mathematics! Es el enfoque educativo que combina estas 4 Ã¡reas."
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
      resultEmoji = 'ðŸ†';
      resultMessage = 'Â¡Eres un Genio de la RobÃ³tica!';
      resultColor = 'text-yellow-600';
    } else if (percentage >= 60) {
      resultEmoji = 'â­';
      resultMessage = 'Â¡Muy Bien! Sigue Practicando';
      resultColor = 'text-green-600';
    } else if (percentage >= 40) {
      resultEmoji = 'ðŸ’ª';
      resultMessage = 'Â¡Buen Esfuerzo! Repasa el MÃ³dulo';
      resultColor = 'text-blue-600';
    } else {
      resultEmoji = 'ðŸ“š';
      resultMessage = 'Â¡No Te Rindas! Vuelve a Estudiar';
      resultColor = 'text-blue-600';
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
              <div className="bg-[#FFC800]/10 p-3 rounded-xl"><p className="text-2xl font-black text-[#FF9600]">{maxStreak}ðŸ”¥</p><p className="text-[11px] text-[#FF9600] font-bold">Mejor Racha</p></div>
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
            <span className="bg-[#FF4B4B]/10 text-[#FF4B4B] px-2.5 py-1 rounded-full font-black text-xs animate-pulse">ðŸ”¥ {streak}</span>
          )}
        </div>
      </div>

      {/* Duolingo-style progress bar */}
      <div className="px-4 mb-4">
        <div className="flex justify-between text-xs font-black text-[#AFAFAF] mb-1">
          <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
          <span className={`font-black text-base ${timeLeft > 15 ? 'text-[#58CC02]' : timeLeft > 5 ? 'text-[#FFC800]' : 'text-[#FF4B4B] animate-pulse'}`}>â± {timeLeft}s</span>
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
          <p className="font-black text-sm mb-1">{selectedAnswer === question.correct ? 'âœ… Â¡Correcto!' : 'âŒ Respuesta Incorrecta'}</p>
          <p className="text-[#777] text-xs leading-relaxed font-semibold">{question.explanation}</p>
          <button onClick={nextQuestion} className="w-full mt-3 py-3 btn-3d btn-3d-green rounded-xl text-sm">
            {currentQuestion + 1 >= totalQuestions ? 'ðŸ† Ver Resultados' : 'Siguiente Pregunta â†’'}
          </button>
        </div>
      )}
      <div className="h-4"></div>
    </div>
  );
};

export { QuizScreen, QUIZ_DATA };
export default QuizScreen;
