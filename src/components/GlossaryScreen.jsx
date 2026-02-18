import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Volume2, VolumeX, Lightbulb, ChevronDown, Star } from 'lucide-react';
import { RobotAvatar } from '../Onboarding';
import { playTab, playExpand, playCollapse, playFavorite, playClick } from '../utils/retroSounds';

// --- BASE DE DATOS DEL GLOSARIO (96 términos educativos) ---
export const GLOSSARY_TERMS = [
  // === ELECTRICIDAD (18 términos) ===
  { id: 'g1', term: 'Electrón', category: 'Electricidad', emoji: '⚡', definition: 'Partícula diminuta con carga negativa que se mueve por los cables y crea la electricidad. ¡Son como mini mensajeros de energía!', example: 'Cuando enciendes una linterna, millones de electrones se mueven por los cables desde la pila hasta el foco.' },
  { id: 'g2', term: 'Voltaje (V)', category: 'Electricidad', emoji: '🔋', definition: 'Es la "fuerza" o empuje que hace que los electrones se muevan. Se mide en Voltios (V). Es como la altura de un tobogán de agua.', example: 'Una pila AA tiene 1.5V, un enchufe de casa tiene 120V o 220V (¡mucho más fuerte y peligroso!).' },
  { id: 'g3', term: 'Corriente (I)', category: 'Electricidad', emoji: '🌊', definition: 'Es la cantidad de electrones que pasan por un cable en un segundo. Se mide en Amperios (A). Es como la cantidad de agua fluyendo por un río.', example: 'Un LED necesita poca corriente (~20mA), pero un motor necesita más corriente para girar.' },
  { id: 'g4', term: 'Resistencia (R)', category: 'Electricidad', emoji: '🛑', definition: 'Es lo que frena el paso de los electrones. Se mide en Ohmios (Ω). Es como poner rocas en el camino del río de electrones.', example: 'Usamos una resistencia de 220Ω para proteger un LED y que no se queme con demasiada corriente.' },
  { id: 'g5', term: 'Ley de Ohm', category: 'Electricidad', emoji: '📐', definition: 'Una regla mágica que relaciona Voltaje, Corriente y Resistencia: V = I × R. Si sabes dos de estas, puedes calcular la tercera.', example: 'Si tienes una pila de 9V y una resistencia de 450Ω, la corriente será: I = 9/450 = 0.02A = 20mA.' },
  { id: 'g6', term: 'Conductor', category: 'Electricidad', emoji: '🛤️', definition: 'Material que permite que la electricidad pase fácilmente. Los metales como el cobre y el aluminio son buenos conductores.', example: 'Los cables eléctricos son de cobre por dentro porque es un excelente conductor de electricidad.' },
  { id: 'g7', term: 'Aislante', category: 'Electricidad', emoji: '🧤', definition: 'Material que NO permite que la electricidad pase. El plástico, la goma y la madera son buenos aislantes.', example: 'La cubierta de plástico de los cables es un aislante: nos protege de tocar el cobre conductor.' },
  { id: 'g8', term: 'Circuito', category: 'Electricidad', emoji: '🔄', definition: 'Un camino cerrado por donde viaja la electricidad, desde la fuente de energía hasta el componente que la usa y de vuelta.', example: 'Pila → Cable → LED → Cable → Pila. Si el camino se rompe (circuito abierto), la corriente se detiene.' },
  { id: 'g9', term: 'Corriente Directa (DC)', category: 'Electricidad', emoji: '➡️', definition: 'Tipo de electricidad que fluye siempre en la misma dirección. Es la que usan las pilas y baterías.', example: 'Tu celular usa corriente directa de su batería. Arduino también funciona con corriente directa de 5V.' },
  { id: 'g10', term: 'Corriente Alterna (AC)', category: 'Electricidad', emoji: '〰️', definition: 'Tipo de electricidad que cambia de dirección muchas veces por segundo. Es la que llega a los enchufes de tu casa.', example: 'En México la corriente alterna cambia de dirección 60 veces por segundo (60 Hz).' },
  { id: 'g11', term: 'Cortocircuito', category: 'Electricidad', emoji: '🔥', definition: 'Cuando la electricidad encuentra un camino sin resistencia y fluye sin control. ¡Es peligroso y puede causar calor o fuego!', example: 'Si conectas directamente los dos polos de una pila con un cable, haces un cortocircuito: el cable se calienta mucho.' },
  { id: 'g12', term: 'Tierra (GND)', category: 'Electricidad', emoji: '🌍', definition: 'El punto de referencia de un circuito con voltaje cero. Todos los circuitos necesitan un camino de regreso a tierra.', example: 'En Arduino, el pin GND es la tierra. Siempre debes conectar tus componentes a GND para cerrar el circuito.' },
  { id: 'g53', term: 'Potencia (W)', category: 'Electricidad', emoji: '💥', definition: 'Es la cantidad de energía que usa un aparato por segundo. Se mide en Watts (W). Potencia = Voltaje × Corriente.', example: 'Un foco de 60W consume más energía que uno de 10W. Por eso los LEDs de bajo consumo ahorran dinero.' },
  { id: 'g54', term: 'Frecuencia (Hz)', category: 'Electricidad', emoji: '📻', definition: 'Cuántas veces se repite algo en un segundo. Se mide en Hertz (Hz). En electricidad, es cuántas veces cambia la corriente alterna.', example: 'La electricidad de tu casa tiene 60Hz: cambia de dirección 60 veces por segundo. El WiFi usa 2.4 GHz (¡miles de millones!).' },
  { id: 'g55', term: 'Semiconductor', category: 'Electricidad', emoji: '🔬', definition: 'Material que no es conductor ni aislante: en ciertas condiciones deja pasar la electricidad. El silicio es el más famoso.', example: 'Los chips de computadora están hechos de silicio, un semiconductor. Por eso Silicon Valley se llama así.' },
  { id: 'g56', term: 'Amperímetro', category: 'Electricidad', emoji: '🔧', definition: 'Instrumento que mide la corriente eléctrica en Amperios. Se conecta en serie (en línea) con el circuito.', example: 'Para saber cuánta corriente consume tu LED, conectas un amperímetro en serie y lees el valor.' },
  { id: 'g57', term: 'Voltímetro', category: 'Electricidad', emoji: '📏', definition: 'Instrumento que mide el voltaje entre dos puntos de un circuito. Se conecta en paralelo.', example: 'Para medir el voltaje de una pila, pones las puntas del voltímetro en los polos + y − de la pila.' },
  { id: 'g58', term: 'Fusible', category: 'Electricidad', emoji: '🧯', definition: 'Componente de seguridad que se "quema" si pasa demasiada corriente, protegiendo el circuito de daños graves.', example: 'Si hay un cortocircuito en tu casa, el fusible se quema y corta la electricidad antes de que algo se dañe.' },

  // === ELECTRÓNICA (16 términos) ===
  { id: 'g13', term: 'LED', category: 'Electrónica', emoji: '💡', definition: 'Diodo Emisor de Luz. Un componente que brilla cuando pasa corriente en la dirección correcta. Tiene una pata larga (+) y una corta (-).', example: 'Los semáforos modernos, las pantallas de TV y las luces de colores usan LEDs.' },
  { id: 'g14', term: 'Resistor', category: 'Electrónica', emoji: '🏷️', definition: 'Componente con bandas de colores que limita la corriente en un circuito. Los colores indican su valor en Ohmios.', example: 'Un resistor con bandas rojo-rojo-marrón tiene 220Ω, perfecto para proteger un LED con una pila de 5V.' },
  { id: 'g15', term: 'Diodo', category: 'Electrónica', emoji: '🚪', definition: 'Componente que solo permite que la corriente fluya en una dirección, como una puerta de una sola vía.', example: 'Los cargadores de celular usan diodos para convertir la corriente alterna de tu casa en corriente directa.' },
  { id: 'g16', term: 'Transistor', category: 'Electrónica', emoji: '🚦', definition: 'Componente que actúa como un interruptor electrónico o amplificador. Puede encender/apagar circuitos usando una señal pequeña.', example: 'Un Arduino usa transistores para manejar motores: una señal pequeña del chip controla mucha corriente del motor.' },
  { id: 'g17', term: 'Capacitor', category: 'Electrónica', emoji: '🫙', definition: 'Componente que almacena energía eléctrica temporalmente, como un vaso que se llena de agua y luego se vacía.', example: 'En un flash de cámara, un capacitor se carga lentamente y luego libera toda la energía de golpe: ¡flash!' },
  { id: 'g18', term: 'Protoboard', category: 'Electrónica', emoji: '🕳️', definition: 'Tablero de pruebas con agujeros conectados internamente. Permite armar circuitos sin soldar, ideal para experimentar.', example: 'En las clases de robótica, usamos la protoboard para conectar LEDs, resistencias y el Arduino sin soldar nada.' },
  { id: 'g19', term: 'Potenciómetro', category: 'Electrónica', emoji: '🎛️', definition: 'Resistencia variable que puedes ajustar girando una perilla. Permite controlar cuánta corriente pasa por un circuito.', example: 'El control de volumen de una bocina es un potenciómetro: al girarlo cambia la resistencia y el volumen.' },
  { id: 'g20', term: 'Buzzer (Zumbador)', category: 'Electrónica', emoji: '🔔', definition: 'Componente que produce sonido cuando le llega electricidad. Puede hacer tonos simples como pitidos y melodías.', example: 'Con Arduino puedes programar un buzzer para que toque melodías: tone(8, 440) suena la nota LA.' },
  { id: 'g21', term: 'Relay (Relevador)', category: 'Electrónica', emoji: '🔀', definition: 'Interruptor controlado eléctricamente. Una señal pequeña puede encender o apagar un circuito de mucha potencia.', example: 'Puedes usar un relay con Arduino para encender y apagar una lámpara de casa con un botón.' },
  { id: 'g22', term: 'Fotorresistencia (LDR)', category: 'Electrónica', emoji: '🌞', definition: 'Resistencia que cambia según la luz. Con mucha luz tiene poca resistencia, en la oscuridad tiene mucha.', example: 'Las lámparas automáticas de jardín usan LDR: detectan cuando oscurece y se encienden solas.' },
  { id: 'g59', term: 'Inductor (Bobina)', category: 'Electrónica', emoji: '🧲', definition: 'Componente hecho de alambre enrollado que almacena energía en un campo magnético. Se usa en filtros y transformadores.', example: 'Los cargadores inalámbricos usan inductores: la bobina del cargador envía energía magnética a la bobina del celular.' },
  { id: 'g60', term: 'LED RGB', category: 'Electrónica', emoji: '🌈', definition: 'LED especial que tiene 3 colores en uno: Rojo, Verde y Azul. Mezclándolos puedes crear cualquier color.', example: 'Con un LED RGB puedes hacer rojo (255,0,0), verde (0,255,0), azul (0,0,255) o blanco (255,255,255).' },
  { id: 'g61', term: 'Display LCD', category: 'Electrónica', emoji: '📺', definition: 'Pantalla de cristal líquido que muestra texto y números. Se conecta a Arduino para mostrar información.', example: 'Puedes conectar un LCD 16x2 a Arduino para mostrar la temperatura: "Temp: 25°C" en la pantalla.' },
  { id: 'g62', term: 'Pulsador (Botón)', category: 'Electrónica', emoji: '🔘', definition: 'Interruptor momentáneo que cierra el circuito solo mientras lo presionas. Ideal para dar comandos al robot.', example: 'Puedes programar un botón para que al presionarlo tu robot cambie de modo: explorar, seguir línea, etc.' },
  { id: 'g63', term: 'Regulador de Voltaje', category: 'Electrónica', emoji: '⚖️', definition: 'Componente que convierte un voltaje alto a uno fijo más bajo. Protege circuitos sensibles.', example: 'El regulador 7805 convierte 9V a exactamente 5V, perfecto para alimentar un Arduino desde una batería de 9V.' },
  { id: 'g64', term: 'PCB (Placa de Circuito)', category: 'Electrónica', emoji: '🟢', definition: 'Placa verde con caminos de cobre impresos donde se sueldan los componentes. Es como una "autopista" para la electricidad.', example: 'La placa verde del Arduino es un PCB: tiene caminos de cobre que conectan el chip, los pines y los componentes.' },

  // === PROGRAMACIÓN (20 términos) ===
  { id: 'g23', term: 'Variable', category: 'Programación', emoji: '📦', definition: 'Un contenedor con nombre donde guardamos información (números, texto, etc.) en un programa. Es como una caja etiquetada.', example: 'int edad = 10; guarda el número 10 en una "caja" llamada edad.' },
  { id: 'g24', term: 'Función', category: 'Programación', emoji: '⚙️', definition: 'Un bloque de código con nombre que realiza una tarea específica. La puedes llamar (usar) muchas veces sin repetir código.', example: 'En Arduino, la función digitalWrite(13, HIGH) enciende un LED. La puedes usar cuantas veces quieras.' },
  { id: 'g25', term: 'Bucle (Loop)', category: 'Programación', emoji: '🔁', definition: 'Instrucción que repite un bloque de código varias veces. Evita escribir lo mismo una y otra vez.', example: 'for(int i=0; i<5; i++) { parpadear(); } hace que un LED parpadee 5 veces sin escribir 5 líneas.' },
  { id: 'g26', term: 'Condicional (if/else)', category: 'Programación', emoji: '🔀', definition: 'Instrucción que hace algo diferente según una condición. Es como un semáforo: si es verde, avanza; si es rojo, detente.', example: 'if(distancia < 20) { retroceder(); } else { avanzar(); } — el robot decide qué hacer según la distancia.' },
  { id: 'g27', term: 'Algoritmo', category: 'Programación', emoji: '📋', definition: 'Una lista ordenada de pasos para resolver un problema. Es como una receta de cocina para la computadora.', example: 'Algoritmo para esquivar: 1) Leer sensor. 2) Si hay obstáculo, girar. 3) Si no, avanzar. 4) Repetir.' },
  { id: 'g28', term: 'Bug (Error)', category: 'Programación', emoji: '🐛', definition: 'Un error en el código que hace que el programa no funcione correctamente. ¡Encontrarlos y arreglarlos es parte de programar!', example: 'Si escribes digitalWrit(13, HIGH) en vez de digitalWrite(13, HIGH), tienes un bug de escritura.' },
  { id: 'g29', term: 'Librería', category: 'Programación', emoji: '📚', definition: 'Colección de código ya escrito que puedes usar en tu programa. Te ahorra trabajo dándote funciones listas para usar.', example: '#include <Servo.h> te da funciones como myServo.write(90) para controlar servomotores fácilmente.' },
  { id: 'g30', term: 'Serial Monitor', category: 'Programación', emoji: '🖥️', definition: 'Herramienta de Arduino que muestra mensajes de tu programa en la computadora. Sirve para saber qué está haciendo tu robot.', example: 'Serial.println(distancia); muestra en tu pantalla cuántos centímetros detecta el sensor ultrasónico.' },
  { id: 'g31', term: 'Depurar (Debug)', category: 'Programación', emoji: '🔍', definition: 'El proceso de encontrar y corregir errores en un programa. Es como ser detective buscando pistas de lo que falla.', example: 'Si tu robot no gira, depuras revisando el código línea por línea hasta encontrar el error.' },
  { id: 'g32', term: 'Compilar', category: 'Programación', emoji: '🏗️', definition: 'Convertir tu código escrito en lenguaje humano a instrucciones que la máquina pueda entender y ejecutar.', example: 'En Arduino IDE, al presionar el botón "Verificar" (✓) se compila tu código y te dice si hay errores.' },
  { id: 'g65', term: 'Array (Arreglo)', category: 'Programación', emoji: '📊', definition: 'Una lista ordenada donde puedes guardar muchos valores del mismo tipo, como una fila de cajas numeradas.', example: 'int notas[] = {90, 85, 100}; guarda 3 calificaciones. notas[0] te da la primera: 90.' },
  { id: 'g66', term: 'String (Cadena)', category: 'Programación', emoji: '🔤', definition: 'Un tipo de dato que guarda texto (letras, palabras, frases). Va entre comillas.', example: 'String nombre = "CultivaTec"; guarda el texto. nombre.length() te dice que tiene 10 letras.' },
  { id: 'g67', term: 'Constante', category: 'Programación', emoji: '🔒', definition: 'Una variable que nunca cambia de valor. Se usa para valores fijos como el número de un pin.', example: 'const int LED_PIN = 13; El pin del LED siempre será 13, no puede cambiar por accidente.' },
  { id: 'g68', term: 'Operador', category: 'Programación', emoji: '➕', definition: 'Símbolo que realiza una operación matemática o lógica: +, -, *, /, ==, !=, <, >, &&, ||.', example: 'if (temp > 30 && humedad > 80) { alerta(); } — usa > (mayor que) y && (y) para verificar dos cosas.' },
  { id: 'g69', term: 'Comentario', category: 'Programación', emoji: '💬', definition: 'Texto en el código que la computadora ignora. Sirve para dejar notas y explicaciones para humanos.', example: '// Esto es un comentario. La computadora lo ignora, pero te ayuda a recordar qué hace cada línea.' },
  { id: 'g70', term: 'Tipo de Dato', category: 'Programación', emoji: '🏷️', definition: 'Define qué clase de información guarda una variable: número entero (int), decimal (float), texto (String), verdadero/falso (bool).', example: 'int edad = 10; float temp = 25.5; String nombre = "Ana"; bool encendido = true;' },
  { id: 'g71', term: 'Recursión', category: 'Programación', emoji: '🪞', definition: 'Cuando una función se llama a sí misma para resolver un problema dividiéndolo en partes más pequeñas.', example: 'Para calcular 5! (factorial): 5 × 4 × 3 × 2 × 1. La función factorial(5) llama a factorial(4), que llama a factorial(3)...' },
  { id: 'g72', term: 'Pseudocódigo', category: 'Programación', emoji: '📝', definition: 'Escribir los pasos de un programa en lenguaje humano antes de escribirlo en código real. Es como un borrador.', example: 'INICIO → Leer sensor → SI distancia < 20 → Girar → SI NO → Avanzar → FIN. Luego lo pasas a C++.' },
  { id: 'g73', term: 'IDE', category: 'Programación', emoji: '🖊️', definition: 'Entorno de Desarrollo Integrado. Programa donde escribes, verificas y subes código. Es tu "taller" de programación.', example: 'Arduino IDE es donde escribes el código, lo compilas y lo subes al Arduino con un clic.' },
  { id: 'g74', term: 'Delay (Espera)', category: 'Programación', emoji: '⏱️', definition: 'Instrucción que pausa el programa por un tiempo determinado en milisegundos. 1000ms = 1 segundo.', example: 'delay(500); pausa el programa medio segundo. Útil para hacer parpadear un LED: encender, esperar, apagar.' },

  // === ROBÓTICA (20 términos) ===
  { id: 'g33', term: 'Arduino', category: 'Robótica', emoji: '🤖', definition: 'Placa electrónica programable de código abierto. Es el "cerebro" de muchos proyectos de robótica que puedes programar desde tu computadora.', example: 'Con Arduino puedes hacer robots que esquivan obstáculos, regar plantas automáticamente o crear luces musicales.' },
  { id: 'g34', term: 'Sensor', category: 'Robótica', emoji: '👁️', definition: 'Componente que detecta información del mundo real (luz, temperatura, distancia, sonido) y la convierte en señales eléctricas para el robot.', example: 'Un sensor ultrasónico mide distancia como un murciélago: envía sonido y mide cuánto tarda en rebotar.' },
  { id: 'g35', term: 'Actuador', category: 'Robótica', emoji: '💪', definition: 'Componente que convierte señales eléctricas en movimiento o acción física. Son los "músculos" del robot.', example: 'Los motores, servomotores y altavoces son actuadores. El motor gira las ruedas, el servo mueve un brazo.' },
  { id: 'g36', term: 'Servo Motor', category: 'Robótica', emoji: '🦾', definition: 'Motor especial que puede girar a un ángulo exacto (0° a 180°). Ideal para mover brazos robóticos o girar sensores.', example: 'myServo.write(90) coloca el servo al centro. myServo.write(0) al inicio. myServo.write(180) al final.' },
  { id: 'g37', term: 'Motor DC', category: 'Robótica', emoji: '🔄', definition: 'Motor que gira continuamente cuando recibe corriente directa. Ideal para las ruedas de un robot.', example: 'Los carros de control remoto usan motores DC. Con un puente H puedes hacerlos girar en ambas direcciones.' },
  { id: 'g38', term: 'Pin Digital', category: 'Robótica', emoji: '🔌', definition: 'Conector en Arduino que solo entiende dos estados: ENCENDIDO (HIGH/1) o APAGADO (LOW/0). Perfecto para LEDs y botones.', example: 'digitalWrite(13, HIGH) enciende el LED conectado al pin 13 del Arduino.' },
  { id: 'g39', term: 'Pin Analógico', category: 'Robótica', emoji: '📊', definition: 'Conector en Arduino que puede leer valores graduales entre 0 y 1023. Ideal para sensores que dan valores variables.', example: 'analogRead(A0) puede dar 200 (oscuro) o 900 (muy brillante) según la luz que reciba el sensor.' },
  { id: 'g40', term: 'PWM', category: 'Robótica', emoji: '📶', definition: 'Modulación por Ancho de Pulso. Técnica para simular voltajes intermedios, prendiendo y apagando muy rápido. Controla brillo de LED o velocidad de motor.', example: 'analogWrite(9, 128) da medio brillo a un LED. analogWrite(9, 255) da brillo máximo.' },
  { id: 'g41', term: 'Robot', category: 'Robótica', emoji: '🤖', definition: 'Máquina programable que puede percibir su entorno (sensores), tomar decisiones (cerebro/Arduino) y actuar (actuadores/motores).', example: 'Un robot seguidor de líneas usa sensores infrarrojos para ver la línea y motores para seguirla.' },
  { id: 'g42', term: 'Sensor Ultrasónico', category: 'Robótica', emoji: '🦇', definition: 'Sensor que mide distancia enviando ondas de sonido y midiendo cuánto tardan en regresar. Funciona como el sonar de los murciélagos.', example: 'El HC-SR04 puede medir objetos de 2cm a 400cm. Ideal para que tu robot detecte paredes y obstáculos.' },
  { id: 'g43', term: 'Sensor Infrarrojo', category: 'Robótica', emoji: '🔴', definition: 'Sensor que detecta luz infrarroja (invisible al ojo humano). Sirve para detectar objetos cercanos o seguir líneas en el suelo.', example: 'Los robots siguelíneas usan sensores IR apuntando al suelo: detectan la diferencia entre negro y blanco.' },
  { id: 'g44', term: 'Puente H', category: 'Robótica', emoji: '🌉', definition: 'Circuito que permite controlar la dirección de giro de un motor DC. Puede hacerlo girar hacia adelante o hacia atrás.', example: 'El módulo L298N es un puente H dual: controla 2 motores, cada uno puede ir adelante o atrás.' },
  { id: 'g45', term: 'Shield (Escudo)', category: 'Robótica', emoji: '🛡️', definition: 'Placa que se conecta encima de Arduino para agregarle funciones extra como WiFi, control de motores o pantalla.', example: 'Un Motor Shield se coloca sobre Arduino y te permite conectar y controlar hasta 4 motores fácilmente.' },
  { id: 'g75', term: 'Microcontrolador', category: 'Robótica', emoji: '🧠', definition: 'Un mini computador en un solo chip. Tiene procesador, memoria y pines de entrada/salida. El ATmega328 está dentro del Arduino.', example: 'El chip cuadrado negro en el Arduino es el microcontrolador ATmega328. Ejecuta tu programa miles de veces por segundo.' },
  { id: 'g76', term: 'Bluetooth', category: 'Robótica', emoji: '📶', definition: 'Tecnología inalámbrica de corto alcance para enviar datos sin cables. Permite controlar robots desde el celular.', example: 'Con un módulo HC-05 Bluetooth puedes enviar comandos desde tu celular: "A" para avanzar, "B" para girar.' },
  { id: 'g77', term: 'WiFi', category: 'Robótica', emoji: '🌐', definition: 'Tecnología inalámbrica para conectarse a Internet. Permite que tu robot envíe datos a la nube o se controle remotamente.', example: 'Un ESP32 con WiFi puede enviar la temperatura de tu cuarto a una página web que puedes ver desde cualquier lugar.' },
  { id: 'g78', term: 'Encoder', category: 'Robótica', emoji: '🔢', definition: 'Sensor que cuenta las vueltas o la posición exacta de un motor. Permite que el robot sepa exactamente cuánto avanzó.', example: 'Con encoders en las ruedas, tu robot puede avanzar exactamente 50cm y girar exactamente 90°.' },
  { id: 'g79', term: 'Batería LiPo', category: 'Robótica', emoji: '🔋', definition: 'Batería recargable de Litio-Polímero, ligera y potente. Popular en robots y drones por su alta energía.', example: 'Los drones usan baterías LiPo de 3.7V. Se pueden cargar y usar cientos de veces.' },
  { id: 'g80', term: 'Sensor de Temperatura', category: 'Robótica', emoji: '🌡️', definition: 'Componente que mide la temperatura del ambiente y la convierte en una señal eléctrica que el Arduino puede leer.', example: 'El DHT11 mide temperatura (0-50°C) y humedad. Perfecto para una estación meteorológica casera.' },
  { id: 'g81', term: 'Grados de Libertad', category: 'Robótica', emoji: '🕹️', definition: 'Número de movimientos independientes que puede hacer un robot. Más grados = más flexible y preciso.', example: 'Tu brazo tiene 7 grados de libertad (hombro 3, codo 1, muñeca 3). Un brazo robótico simple tiene 3-4.' },

  // === MECÁNICA (12 términos) ===
  { id: 'g46', term: 'Engranaje', category: 'Mecánica', emoji: '⚙️', definition: 'Rueda dentada que transmite movimiento rotatorio. Dos engranajes juntos pueden cambiar la velocidad o la fuerza del movimiento.', example: 'En una bicicleta, los engranajes (piñones) permiten pedalear más fácil subiendo una colina.' },
  { id: 'g47', term: 'Palanca', category: 'Mecánica', emoji: '🎚️', definition: 'Barra rígida que gira sobre un punto fijo (fulcro). Permite mover objetos pesados con menos fuerza.', example: 'Un subibaja es una palanca. Poniendo el fulcro más cerca del peso, puedes levantarlo con menos esfuerzo.' },
  { id: 'g48', term: 'Polea', category: 'Mecánica', emoji: '🏗️', definition: 'Rueda con una cuerda que permite levantar objetos pesados cambiando la dirección de la fuerza.', example: 'Las grúas de construcción usan varias poleas juntas para levantar toneladas de material con un motor.' },
  { id: 'g49', term: 'Rueda y Eje', category: 'Mecánica', emoji: '🛞', definition: 'Máquina simple que reduce la fricción y facilita mover objetos. La rueda gira alrededor de un eje central.', example: 'Las ruedas de un robot reducen la fricción con el suelo, permitiendo que un motor pequeño lo mueva fácilmente.' },
  { id: 'g50', term: 'Chasis', category: 'Mecánica', emoji: '🚗', definition: 'La estructura o armazón principal de un robot donde se montan todos los componentes: motores, sensores, Arduino y batería.', example: 'Puedes hacer un chasis con acrílico, madera, o incluso cartón grueso para tu primer robot.' },
  { id: 'g51', term: 'Tornillo', category: 'Mecánica', emoji: '🔩', definition: 'Pieza metálica en espiral que une partes de un robot. Es una máquina simple que convierte giro en fuerza de sujeción.', example: 'Usamos tornillos M3 para fijar los motores al chasis del robot y que no se muevan al avanzar.' },
  { id: 'g52', term: 'Plano Inclinado', category: 'Mecánica', emoji: '📐', definition: 'Superficie plana inclinada que facilita subir objetos pesados a una altura usando menos fuerza, pero más distancia.', example: 'Una rampa para robots es un plano inclinado: el robot sube poco a poco en vez de saltar verticalmente.' },
  { id: 'g82', term: 'Fricción', category: 'Mecánica', emoji: '🤚', definition: 'Fuerza que se opone al movimiento cuando dos superficies se tocan. Puede ser útil (agarre) o problemática (desgaste).', example: 'Las llantas del robot tienen textura para aumentar la fricción y no patinar. Sin fricción, resbalaría.' },
  { id: 'g83', term: 'Par (Torque)', category: 'Mecánica', emoji: '🔧', definition: 'Fuerza de giro de un motor. Más torque = más fuerza para mover cosas pesadas, pero generalmente menos velocidad.', example: 'Un motor con alto torque puede mover un robot pesado en subida. Un motor de alto RPM es rápido pero débil.' },
  { id: 'g84', term: 'RPM', category: 'Mecánica', emoji: '🌀', definition: 'Revoluciones Por Minuto. Cuántas vueltas completas da un motor en un minuto. Más RPM = más velocidad.', example: 'Un motor de 200 RPM da 200 vueltas por minuto. Con un engranaje reductor baja a 50 RPM pero con más fuerza.' },
  { id: 'g85', term: 'Centro de Gravedad', category: 'Mecánica', emoji: '⚖️', definition: 'El punto donde se concentra todo el peso de un objeto. Si está muy alto, el robot se puede voltear.', example: 'Pon la batería (lo más pesado) en la parte baja del robot para que el centro de gravedad sea bajo y no se voltee.' },
  { id: 'g86', term: 'Rueda Loca (Caster)', category: 'Mecánica', emoji: '🔵', definition: 'Rueda pequeña libre que gira en cualquier dirección. Da estabilidad al robot sin afectar la dirección.', example: 'Los robots de 2 ruedas motrices tienen una rueda loca atrás para no arrastrarse y mantener el equilibrio.' },

  // === CIENCIA / STEM (10 términos) ===
  { id: 'g87', term: 'STEM', category: 'Ciencia', emoji: '🔬', definition: 'Ciencia, Tecnología, Ingeniería y Matemáticas (en inglés). Un enfoque de aprendizaje que combina estas 4 áreas.', example: 'CultivaTec es una app STEM: aprendes ciencia (electricidad), tecnología (Arduino), ingeniería (robots) y matemáticas (Ley de Ohm).' },
  { id: 'g88', term: 'Inteligencia Artificial', category: 'Ciencia', emoji: '🧠', definition: 'Capacidad de una máquina para aprender y tomar decisiones parecidas a las de un humano, usando datos y algoritmos.', example: 'Los asistentes como Siri y Alexa usan IA para entender tu voz. Un robot con IA puede aprender a esquivar mejor.' },
  { id: 'g89', term: 'IoT (Internet de las Cosas)', category: 'Ciencia', emoji: '🌐', definition: 'Conectar objetos cotidianos a Internet para que envíen y reciban datos automáticamente.', example: 'Un refrigerador inteligente con IoT puede avisarte en tu celular cuando se acaba la leche.' },
  { id: 'g90', term: 'Código Abierto', category: 'Ciencia', emoji: '🔓', definition: 'Software o hardware cuyo diseño está disponible para que cualquier persona lo use, modifique y comparta gratis.', example: 'Arduino es código abierto: cualquier persona puede ver sus planos, mejorarlo y crear sus propias versiones.' },
  { id: 'g91', term: 'Prototipo', category: 'Ciencia', emoji: '🛠️', definition: 'Primera versión de prueba de un invento. Sirve para probar la idea antes de hacer la versión final.', example: 'Antes de hacer tu robot final, haces un prototipo con cartón y protoboard para probar que todo funcione.' },
  { id: 'g92', term: 'Iteración', category: 'Ciencia', emoji: '🔄', definition: 'Repetir un proceso mejorando cada vez. En ingeniería, cada versión de un diseño es una iteración.', example: 'Robot v1: se choca. Robot v2: esquiva con sensor. Robot v3: esquiva y sigue líneas. ¡Cada uno es mejor!' },
  { id: 'g93', term: 'Energía Renovable', category: 'Ciencia', emoji: '☀️', definition: 'Energía que viene de fuentes que no se agotan: sol, viento, agua. Es limpia y no contamina.', example: 'Puedes alimentar tu robot con un panel solar. Durante el día carga la batería y el robot funciona todo el día.' },
  { id: 'g94', term: 'Circuito Integrado (Chip)', category: 'Ciencia', emoji: '💾', definition: 'Miles o millones de transistores miniaturizados en una pequeña pieza de silicio. Son el cerebro de toda la electrónica moderna.', example: 'El chip del Arduino tiene 32,000 transistores. Un celular moderno tiene ¡miles de millones!' },
  { id: 'g95', term: 'Diagrama de Flujo', category: 'Ciencia', emoji: '🗺️', definition: 'Dibujo con flechas y formas que muestra los pasos de un proceso o algoritmo. Ayuda a planificar antes de programar.', example: 'Antes de programar tu robot, dibuja: INICIO → ¿Obstáculo? → Sí: Girar → No: Avanzar → Repetir.' },
  { id: 'g96', term: 'Impresión 3D', category: 'Ciencia', emoji: '🖨️', definition: 'Fabricar objetos capa por capa con una impresora 3D. Puedes diseñar e imprimir piezas personalizadas para tu robot.', example: 'Puedes diseñar una garra para tu robot en el computador e imprimirla en 3D con plástico PLA.' },

  // === ROVERS AUTÓNOMOS (Mundo 5 – Desierto de los Rovers) (12 términos) ===
  { id: 'g97', term: 'Rover', category: 'Robótica', emoji: '🤖', definition: 'Vehículo robótico diseñado para explorar terrenos difíciles de forma autónoma. Tiene ruedas, sensores, cámaras y un cerebro (computadora) a bordo.', example: 'Curiosity y Perseverance son rovers de la NASA que exploran Marte tomando fotos y analizando rocas.' },
  { id: 'g98', term: 'Navegación Autónoma', category: 'Robótica', emoji: '🧭', definition: 'Capacidad de un robot para moverse y tomar decisiones de ruta sin ayuda humana, usando sensores y algoritmos.', example: 'Un rover autónomo en Marte no puede esperar instrucciones de la Tierra (tarda 20 min). ¡Decide solo cómo esquivar rocas!' },
  { id: 'g99', term: 'Telemetría', category: 'Robótica', emoji: '📡', definition: 'Envío de datos de sensores desde el robot a una base de control remota, en tiempo real o almacenados para enviar después.', example: 'La NASA recibe telemetría de Perseverance: temperatura del motor, nivel de batería, fotos e incluso sonido de Marte.' },
  { id: 'g100', term: 'Odometría', category: 'Robótica', emoji: '📏', definition: 'Método para estimar la posición de un robot contando las vueltas de sus ruedas. Es como un cuentakilómetros para robots.', example: 'Con odometría, el rover sabe que avanzó 50 metros: contó 200 vueltas de su rueda de 25cm de diámetro.' },
  { id: 'g101', term: 'LIDAR', category: 'Robótica', emoji: '🔦', definition: 'Sensor que dispara pulsos de láser y mide el tiempo que tardan en rebotar. Crea un mapa 3D del entorno con precisión milimétrica.', example: 'Los carros autónomos de Waymo usan LIDAR para "ver" el mundo en 3D: peatones, otros autos, señales de tráfico.' },
  { id: 'g102', term: 'Máquina de Estados (FSM)', category: 'Programación', emoji: '🔄', definition: 'Modelo de comportamiento donde el robot puede estar en uno de varios estados (explorando, cargando, transmitiendo) y cambia según las condiciones.', example: 'Un rover tiene estados: DORMIDO → EXPLORANDO → ANALIZANDO → TRANSMITIENDO → DORMIDO. Cada estado define qué hace.' },
  { id: 'g103', term: 'Fusión de Sensores', category: 'Robótica', emoji: '🔗', definition: 'Combinar datos de múltiples sensores para obtener información más precisa y confiable que la de un solo sensor.', example: 'Un rover combina GPS + cámara + LIDAR + odometría para saber su posición exacta. Si un sensor falla, los otros compensan.' },
  { id: 'g104', term: 'Algoritmo A*', category: 'Programación', emoji: '🗺️', definition: 'Algoritmo inteligente que encuentra el camino más corto entre dos puntos considerando obstáculos. Usado en robots y videojuegos.', example: 'En videojuegos, los enemigos usan A* para perseguirte por el laberinto encontrando la ruta más corta.' },
  { id: 'g105', term: 'Panel Solar', category: 'Electricidad', emoji: '☀️', definition: 'Dispositivo que convierte la luz del sol directamente en electricidad usando celdas fotovoltaicas de silicio.', example: 'El rover Spirit funcionó 6 años con paneles solares en Marte. Cuando el polvo los tapó, se quedó sin energía.' },
  { id: 'g106', term: 'Suspensión Rocker-Bogie', category: 'Mecánica', emoji: '🛞', definition: 'Sistema de suspensión especial de los rovers marcianos que permite a las 6 ruedas mantener contacto con terreno irregular sin volcarse.', example: 'Gracias al rocker-bogie, Curiosity puede trepar rocas de hasta 65cm de alto sin problemas.' },
  { id: 'g107', term: 'Latencia', category: 'Programación', emoji: '⏳', definition: 'El tiempo de demora entre enviar una orden y que llegue al destino. En robótica remota, la latencia complica el control.', example: 'Controlar un rover en Marte tiene 20 minutos de latencia. ¡Si le dices "frena", ya habrá chocado! Por eso necesita ser autónomo.' },
  { id: 'g108', term: 'Terrain Mapping', category: 'Robótica', emoji: '🗻', definition: 'Proceso de crear un mapa digital del terreno usando cámaras, LIDAR o radar. El rover lo usa para planificar rutas seguras.', example: 'Perseverance crea mapas 3D del terreno marciano para encontrar caminos planos y evitar arena blanda donde podría atascarse.' },

  // === AERO-BIOSFERA (Mundo 6 – Bahía de la Aero-Biosfera) (15 términos) ===
  { id: 'g109', term: 'Dron Agrícola', category: 'Robótica', emoji: '🚁', definition: 'Vehículo aéreo no tripulado diseñado para tareas agrícolas: mapeo de cultivos, fumigación, siembra y monitoreo de salud de plantas.', example: 'Un dron agrícola puede fumigar 10 hectáreas por hora volando a 5 metros de altura. ¡40 veces más rápido que hacerlo a mano!' },
  { id: 'g110', term: 'Agricultura de Precisión', category: 'Ciencia', emoji: '🌾', definition: 'Usar tecnología (sensores, drones, GPS, IA) para cultivar de forma más eficiente: dar agua, fertilizante y pesticida solo donde se necesita.', example: 'Con agricultura de precisión, un campo usa 30% menos agua y 25% menos fertilizante, pero produce la misma cantidad de alimento.' },
  { id: 'g111', term: 'Biosensor', category: 'Electrónica', emoji: '🧬', definition: 'Sensor especializado que detecta sustancias biológicas: humedad del suelo, pH, nutrientes, presencia de hongos o plagas.', example: 'Un biosensor de suelo mide nitrógeno, fósforo y potasio para saber exactamente qué fertilizante necesita cada zona del campo.' },
  { id: 'g112', term: 'Invernadero Inteligente', category: 'Robótica', emoji: '🏠', definition: 'Invernadero automatizado con sensores y actuadores que controlan temperatura, humedad, riego y luz para condiciones perfectas de crecimiento.', example: 'En Holanda, invernaderos inteligentes producen 10 veces más tomates por hectárea que los campos normales, usando IA.' },
  { id: 'g113', term: 'Sensor de Humedad', category: 'Electrónica', emoji: '💧', definition: 'Componente que mide cuánta agua hay en el suelo o en el aire. Envía valores de 0 (totalmente seco) a 100 (saturado).', example: 'El sensor DHT22 mide humedad del aire (0-100%) y temperatura (-40 a 80°C). Perfecto para automatizar invernaderos.' },
  { id: 'g114', term: 'Riego por Goteo', category: 'Mecánica', emoji: '💦', definition: 'Sistema de riego que lleva agua directamente a la raíz de cada planta mediante tubos con goteros. Ahorra hasta 60% de agua.', example: 'Israel inventó el riego por goteo en 1965. Ahora con sensores, el sistema se activa solo cuando la planta lo necesita.' },
  { id: 'g115', term: 'NDVI', category: 'Ciencia', emoji: '📸', definition: 'Índice de Vegetación por Diferencia Normalizada. Mide la salud de las plantas desde arriba usando cámaras infrarrojas en drones.', example: 'Si el NDVI es alto (verde), la planta está sana. Si es bajo (rojo), está enferma o estresada. ¡Los drones detectan esto desde 100m!' },
  { id: 'g116', term: 'Fotosíntesis', category: 'Ciencia', emoji: '🍃', definition: 'Proceso por el cual las plantas convierten luz solar + CO₂ + agua en oxígeno y glucosa (alimento). Es la "programación" de las plantas.', example: 'Un invernadero inteligente optimiza la luz para maximizar la fotosíntesis: LEDs rojos y azules son los más eficientes para las plantas.' },
  { id: 'g117', term: 'Sensor de pH', category: 'Electrónica', emoji: '🧪', definition: 'Componente que mide la acidez o alcalinidad del suelo o agua en una escala de 0 (ácido) a 14 (alcalino). 7 es neutro.', example: 'Las fresas crecen mejor con pH 5.5-6.5 (ligeramente ácido). El sensor de pH ayuda a mantener las condiciones ideales.' },
  { id: 'g118', term: 'Polinización Robótica', category: 'Robótica', emoji: '🐝', definition: 'Uso de mini-robots o drones para polinizar flores cuando las abejas no son suficientes. Es crucial para producir frutas y verduras.', example: 'En Japón ya se prueban mini-drones cubiertos de gel pegajoso que transportan polen de flor en flor, imitando a las abejas.' },
  { id: 'g119', term: 'Hidroponía', category: 'Ciencia', emoji: '🌱', definition: 'Cultivar plantas sin tierra, usando agua con nutrientes disueltos. Los sensores controlan la solución nutritiva automáticamente.', example: 'La lechuga hidropónica crece 2 veces más rápido que en tierra. La Estación Espacial Internacional cultiva verduras así.' },
  { id: 'g120', term: 'Estación Meteorológica', category: 'Robótica', emoji: '🌤️', definition: 'Conjunto de sensores que miden condiciones del clima: temperatura, humedad, viento, lluvia y presión atmosférica en tiempo real.', example: 'Con una estación meteorológica Arduino puedes predecir lluvias y programar el riego solo cuando no va a llover. ¡Ahorro inteligente!' },
  { id: 'g121', term: 'Actuador de Riego', category: 'Electrónica', emoji: '🚿', definition: 'Válvula o bomba controlada eléctricamente que abre o cierra el paso del agua. Un relay con Arduino puede activarla automáticamente.', example: 'Cuando el sensor de humedad detecta suelo seco, Arduino activa el relay que enciende la bomba de riego. ¡Todo automático!' },
  { id: 'g122', term: 'Huella de Carbono', category: 'Ciencia', emoji: '🌍', definition: 'Cantidad de CO₂ que se emite al producir algo. La agro-robótica reduce la huella de carbono al usar menos combustible y químicos.', example: 'Un dron eléctrico que fumiga emite 90% menos CO₂ que un tractor diésel. ¡La tecnología ayuda al medio ambiente!' },
  { id: 'g123', term: 'Watt-hora (Wh)', category: 'Electricidad', emoji: '🔋', definition: 'Unidad que mide cuánta energía almacena una batería. Más Wh = más tiempo de vuelo para un dron o más autonomía para un robot.', example: 'Una batería de 100 Wh alimenta un dron agrícola 30 minutos. Para misiones largas, se usan varias baterías intercambiables.' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos', emoji: '🌌', color: '#93C5FD', glow: 'rgba(147,197,253,0.3)' },
  { id: 'Electricidad', name: 'Electricidad', emoji: '⚡', color: '#FACC15', glow: 'rgba(250,204,21,0.3)' },
  { id: 'Electrónica', name: 'Electrónica', emoji: '🔌', color: '#22D3EE', glow: 'rgba(34,211,238,0.3)' },
  { id: 'Programación', name: 'Programación', emoji: '💻', color: '#4ADE80', glow: 'rgba(74,222,128,0.3)' },
  { id: 'Robótica', name: 'Robótica', emoji: '🤖', color: '#F87171', glow: 'rgba(248,113,113,0.3)' },
  { id: 'Mecánica', name: 'Mecánica', emoji: '⚙️', color: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  { id: 'Ciencia', name: 'Ciencia', emoji: '🔬', color: '#FB923C', glow: 'rgba(251,146,60,0.3)' },
];

const ROBOT_READING_PHRASES = [
  '¡Escucha bien! Te voy a explicar esto...',
  '¡Oye! Esto es súper interesante...',
  '¿Listo para aprender? ¡Ahí va!',
  '¡Atención! Esto es importante...',
  '¡Déjame contarte sobre esto!',
  '¿Sabías esto? ¡Mira!',
  '¡Ponme atención, que te enseño!',
  '¡Esta es una de mis palabras favoritas!',
];

const ROBOT_IDLE_PHRASES = [
  '¡Toca un término y presiona 🔊 para que te lo lea!',
  '¡Tengo muchas palabras que enseñarte!',
  '¡Busca cualquier palabra y te la explico!',
  '¡Soy tu diccionario robótico parlante!',
];

const generateStars = (count) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,
      twinkleDuration: `${2 + Math.random() * 4}s`,
      twinkleDelay: `${Math.random() * 3}s`,
    });
  }
  return stars;
};

const BACKGROUND_STARS = generateStars(50);

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
  const [robotMood, setRobotMood] = useState('idle');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const speechRef = useRef(null);
  const termsListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('glossary_favorites', JSON.stringify(favoriteTerms));
  }, [favoriteTerms]);

  useEffect(() => {
    return () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      const matchesFavorite = !showFavoritesOnly || favoriteTerms.includes(term.id);
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [searchTerm, selectedCategory, showFavoritesOnly, favoriteTerms]);

  const toggleFavorite = (termId) => {
    playFavorite();
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
    playClick();
    if (!('speechSynthesis' in window)) return;
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
      setRobotPhrase('¡Listo! ¿Quieres que te lea otro término?');
      setTimeout(() => {
        setRobotMood('idle');
        setRobotPhrase(ROBOT_IDLE_PHRASES[Math.floor(Math.random() * ROBOT_IDLE_PHRASES.length)]);
      }, 3000);
    };

    utterance.onerror = () => stopSpeaking();

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const getCategoryData = (catId) => CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];

  return (
    <div className="pb-24 min-h-full bg-gradient-to-b from-[#0B1120] via-[#0E1A30] to-[#0F172A] flex flex-col animate-fade-in relative overflow-hidden">
      {/* ====== GALAXY BACKGROUND ====== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute opacity-30" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(147,197,253,0.2) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)', right: '-5%', top: '3%', animation: 'nebula-drift 22s ease-in-out infinite' }}></div>
        <div className="absolute opacity-25" style={{ width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)', left: '-8%', top: '30%', animation: 'nebula-drift-2 28s ease-in-out infinite' }}></div>
        <div className="absolute opacity-20" style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 60%)', right: '10%', bottom: '20%', animation: 'nebula-drift 18s ease-in-out infinite reverse' }}></div>
        {BACKGROUND_STARS.map((star, i) => (
          <div key={`gs-${i}`} className="galaxy-star" style={{ left: star.left, top: star.top, width: `${star.size}px`, height: `${star.size}px`, '--twinkle-duration': star.twinkleDuration, '--twinkle-delay': star.twinkleDelay }}></div>
        ))}
      </div>

      {/* ====== HEADER CON ROBOT ====== */}
      <div className="relative px-4 pt-6 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(147,197,253,0.12) 0%, transparent 70%)' }}></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Robot Avatar */}
          <div className={`relative transition-transform duration-500 ${robotMood === 'speaking' ? 'scale-110' : robotMood === 'happy' ? 'scale-105' : ''}`}>
            <div className="absolute inset-[-14px] rounded-full border border-[#93C5FD]/15 pointer-events-none" style={{ animation: 'orbit-ring 15s linear infinite' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#93C5FD]/60 rounded-full" style={{ boxShadow: '0 0 6px rgba(147,197,253,0.6)' }}></div>
            </div>
            <div className="absolute inset-[-20px] rounded-full pointer-events-none opacity-60"
              style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.25) 0%, transparent 70%)' }}></div>
            <div className={robotMood === 'speaking' ? 'animate-pulse' : ''}>
              {robotConfig ? (
                <RobotAvatar config={robotConfig} size={90} animate={robotMood === 'speaking'} />
              ) : (
                <div className="w-[90px] h-[90px] flex items-center justify-center">
                  <span className="text-6xl">🤖</span>
                </div>
              )}
            </div>
            {robotMood === 'speaking' && (
              <div className="absolute -right-1 -top-1 flex gap-0.5">
                <div className="w-1.5 h-3 bg-[#93C5FD] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-4 bg-[#93C5FD] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-3 bg-[#93C5FD] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>

          {/* Speech Bubble */}
          <div className="mt-3 bg-[#1E293B]/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 max-w-[280px] relative border border-[#334155]"
            style={{ boxShadow: '0 0 20px rgba(147,197,253,0.08)' }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1E293B]/90 rotate-45 rounded-sm border-l border-t border-[#334155]"></div>
            <p className={`text-[7px] leading-relaxed font-bold text-center relative z-10 ${robotMood === 'speaking' ? 'text-[#93C5FD]' : 'text-[#94A3B8]'}`}>
              {robotMood === 'speaking' && <span className="inline-block mr-1 animate-pulse">🔊</span>}
              {robotPhrase}
            </p>
          </div>

          {/* PIXEL TITLE */}
          <h1 className="mt-4 text-center">
            <span className="text-[11px] sm:text-sm text-transparent bg-clip-text leading-relaxed"
              style={{ backgroundImage: 'linear-gradient(135deg, #93C5FD 0%, #A78BFA 40%, #22D3EE 80%, #4ADE80 100%)' }}>
              GLOSARIO
            </span>
          </h1>
          <h2 className="text-[8px] font-black text-[#93C5FD] mt-2 leading-relaxed">
            Diccionario de {robotName || 'Robi'}
          </h2>
          <p className="text-[#64748B] text-[6px] font-bold mt-1 leading-relaxed">{GLOSSARY_TERMS.length} términos galácticos · ¡Presiona 🔊 para escuchar!</p>
        </div>
      </div>

      {/* ====== BODY ====== */}
      <div className="px-4 relative z-10 flex-1">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Buscar término... (ej: "LED", "sensor")'
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#1E293B]/80 backdrop-blur-sm border-2 border-[#334155] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#93C5FD]/20 outline-none text-[8px] font-bold text-[#E2E8F0] transition placeholder-[#475569]"
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
                onClick={() => { playTab(); setSelectedCategory(cat.id); }}
                className={`flex-shrink-0 px-3 py-2 rounded-2xl font-black text-[7px] transition-all duration-200 active:scale-95 flex items-center gap-1.5 border-2 ${
                  isActive
                    ? 'shadow-lg scale-[1.03]'
                    : 'bg-[#1E293B]/60 text-[#94A3B8] border-[#334155] hover:border-[#475569]'
                }`}
                style={isActive ? {
                  backgroundColor: `${cat.color}20`,
                  borderColor: `${cat.color}60`,
                  color: cat.color,
                  boxShadow: `0 0 15px ${cat.glow}`
                } : {}}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className={`text-[6px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/15' : 'bg-[#0F172A]'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Counter + controls */}
        <div className="flex justify-between items-center mb-2.5">
          <p className="text-[6px] text-[#64748B] font-bold leading-relaxed">{filteredTerms.length} de {GLOSSARY_TERMS.length} términos</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1 text-[6px] font-black px-2.5 py-1 rounded-full active:scale-95 transition border ${
                showFavoritesOnly
                  ? 'bg-[#FFC800]/15 text-[#FFC800] border-[#FFC800]/30'
                  : 'bg-[#1E293B]/60 text-[#64748B] border-[#334155]'
              }`}>
              <Star size={10} fill={showFavoritesOnly ? '#FFC800' : 'none'} /> Favoritos
            </button>
            {isSpeaking && (
              <button onClick={stopSpeaking} className="flex items-center gap-1 text-[6px] font-black text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 active:scale-95 transition">
                <VolumeX size={10} /> Detener
              </button>
            )}
          </div>
        </div>

        {/* ====== TERM LIST ====== */}
        <div className="space-y-2.5 flex-grow" ref={termsListRef}>
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-3">🔭</span>
              <p className="text-[8px] font-black text-[#64748B] leading-relaxed">No se encontraron términos</p>
              <p className="text-[6px] text-[#475569] font-bold mt-2 leading-relaxed">Intenta con otra palabra o categoría</p>
            </div>
          ) : (
            filteredTerms.map(term => {
              const isExpanded = expandedTerm === term.id;
              const isFavorite = favoriteTerms.includes(term.id);
              const isCurrentlySpeaking = speakingTermId === term.id;
              const catData = getCategoryData(term.category);

              return (
                <div
                  key={term.id}
                  className="rounded-2xl border-2 transition-all duration-300 overflow-hidden"
                  style={{
                    background: isCurrentlySpeaking
                      ? 'linear-gradient(135deg, rgba(147,197,253,0.08) 0%, rgba(15,23,42,0.95) 100%)'
                      : isExpanded
                        ? `linear-gradient(135deg, ${catData.color}08 0%, rgba(15,23,42,0.95) 100%)`
                        : 'rgba(30,41,59,0.5)',
                    borderColor: isCurrentlySpeaking ? '#93C5FD' : isExpanded ? `${catData.color}40` : 'rgba(30,41,59,1)',
                    boxShadow: isCurrentlySpeaking ? `0 0 20px ${catData.glow}` : isExpanded ? `0 0 12px ${catData.glow}` : 'none'
                  }}
                >
                  {/* Term header */}
                  <div className="p-3 cursor-pointer flex items-center gap-3" onClick={() => { isExpanded ? playCollapse() : playExpand(); setExpandedTerm(isExpanded ? null : term.id); }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl border"
                      style={{ backgroundColor: `${catData.color}10`, borderColor: `${catData.color}25` }}>
                      {term.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[8px] font-black text-[#E2E8F0] truncate leading-relaxed">{term.term}</h3>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[5px] font-black mt-1 uppercase tracking-wider"
                        style={{ backgroundColor: `${catData.color}15`, color: catData.color, border: `1px solid ${catData.color}30` }}>
                        {term.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); speakTerm(term); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 border ${
                          isCurrentlySpeaking
                            ? 'bg-[#93C5FD] text-white border-[#93C5FD] shadow-md animate-pulse'
                            : 'bg-[#93C5FD]/10 text-[#93C5FD] border-[#93C5FD]/20 hover:bg-[#93C5FD]/20'
                        }`}
                        title={isCurrentlySpeaking ? 'Detener lectura' : `Escuchar: ${term.term}`}
                      >
                        {isCurrentlySpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(term.id); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 border ${
                          isFavorite ? 'bg-[#FFC800]/15 border-[#FFC800]/30' : 'bg-[#1E293B] border-[#334155] hover:bg-[#334155]'
                        }`}
                      >
                        <Star size={14} fill={isFavorite ? '#FFC800' : 'none'} className={isFavorite ? 'text-[#FFC800]' : 'text-[#64748B]'} />
                      </button>

                      <ChevronDown size={16} className={`text-[#64748B] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 animate-slide-up">
                      <div className="flex gap-2.5 mb-2">
                        <div className="flex-shrink-0 mt-1">
                          {robotConfig ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border"
                              style={{ backgroundColor: `${catData.color}10`, borderColor: `${catData.color}25` }}>
                              <RobotAvatar config={robotConfig} size={28} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border text-sm"
                              style={{ backgroundColor: `${catData.color}10`, borderColor: `${catData.color}25` }}>🤖</div>
                          )}
                        </div>
                        <div className="flex-1 bg-[#0F172A]/60 p-3 rounded-2xl rounded-tl-md border" style={{ borderColor: `${catData.color}20` }}>
                          <h4 className="font-black text-[6px] mb-1.5 uppercase tracking-wider flex items-center gap-1 leading-relaxed" style={{ color: catData.color }}>
                            <Lightbulb size={10} /> Definición
                          </h4>
                          <p className="text-[#CBD5E1] text-[6px] leading-[1.8] font-semibold">{term.definition}</p>
                        </div>
                      </div>

                      <div className="ml-10">
                        <div className="bg-[#0F172A]/60 p-3 rounded-2xl border border-[#22C55E]/20">
                          <h4 className="font-black text-[6px] text-[#4ADE80] mb-1.5 uppercase tracking-wider leading-relaxed">💡 Ejemplo</h4>
                          <p className="text-[#94A3B8] text-[6px] italic leading-[1.8] font-semibold">{term.example}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => speakTerm(term)}
                        className={`mt-3 w-full py-2.5 rounded-xl font-black text-[7px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] border ${
                          isCurrentlySpeaking
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : ''
                        }`}
                        style={!isCurrentlySpeaking ? {
                          background: `linear-gradient(135deg, ${catData.color}30 0%, ${catData.color}10 100%)`,
                          borderColor: `${catData.color}30`,
                          color: catData.color
                        } : {}}
                      >
                        {isCurrentlySpeaking ? (
                          <><VolumeX size={14} /> Detener lectura</>
                        ) : (
                          <><Volume2 size={14} /> {robotName || 'Robi'}, ¡léeme esto! 🔊</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Fun facts footer */}
        <div className="mt-6 mb-4 space-y-3">
          <div className="bg-[#1E293B]/60 rounded-2xl p-4 border border-[#334155] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.8) 0%, transparent 70%)' }}></div>
            <div className="flex items-start gap-3 relative z-10">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-[7px] font-black text-[#93C5FD] mb-2 leading-relaxed">¿Sabías que...?</h4>
                <p className="text-[6px] text-[#94A3B8] font-semibold leading-[1.8]">
                  La palabra "robot" viene del checo "robota" que significa "trabajo forzado". Fue usada por primera vez en 1920 por el escritor Karel Čapek.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1E293B]/60 rounded-2xl p-4 border border-[#334155] relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.8) 0%, transparent 70%)' }}></div>
            <div className="flex items-start gap-3 relative z-10">
              <span className="text-2xl">🚀</span>
              <div>
                <h4 className="text-[7px] font-black text-[#A78BFA] mb-2 leading-relaxed">Dato espacial</h4>
                <p className="text-[6px] text-[#94A3B8] font-semibold leading-[1.8]">
                  El rover Perseverance en Marte usa un procesador similar al de tu PlayStation 1. ¡Un robot en otro planeta con tecnología que puedes aprender aquí!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlossaryScreen;
