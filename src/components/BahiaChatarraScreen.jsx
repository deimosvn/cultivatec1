// ================================================================
// BAHÍA DE LA CHATARRA ESTELAR — CultivaTec App
// Robots caseros con instrucciones paso a paso + descarga PDF
// ================================================================

import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, ChevronRight, ChevronLeft, Wrench, Package, Clock, Star, AlertTriangle, CheckCircle2, Sparkles, X } from 'lucide-react';
import { jsPDF } from 'jspdf';

// ============================================
// DATOS DE ROBOTS CASEROS
// ============================================
const ROBOTS_CASEROS = [
  {
    id: 'robot_cepillo',
    nombre: 'RoboCepillo Veloz',
    emoji: '🪥',
    dificultad: 'Fácil',
    dificultadColor: '#22C55E',
    tiempo: '20 min',
    edad: '6+',
    descripcion: 'Un mini robot que se mueve solo usando las vibraciones de un motor. ¡Es como un insecto mecánico!',
    imagen: '🤖',
    materiales: [
      { nombre: 'Cepillo de dientes viejo', emoji: '🪥', nota: 'Solo la cabeza del cepillo (pide a un adulto que lo corte)' },
      { nombre: 'Motor de vibración pequeño', emoji: '⚡', nota: 'Lo puedes sacar de un celular viejo o comprar uno' },
      { nombre: 'Pila de botón (CR2032)', emoji: '🔋', nota: 'Se consiguen en ferreterías o papelerías' },
      { nombre: 'Cinta adhesiva', emoji: '📦', nota: 'Cinta de aislar o masking tape' },
      { nombre: 'Ojos móviles (opcionales)', emoji: '👀', nota: 'Para darle personalidad a tu robot' },
    ],
    pasos: [
      {
        titulo: 'Prepara la cabeza del cepillo',
        instruccion: 'Pide a un adulto que corte la cabeza del cepillo de dientes. Solo necesitas la parte donde están las cerdas (los pelitos). Debe quedar un pedazo plano con las cerdas apuntando hacia abajo.',
        consejo: 'Si las cerdas están muy largas, puedes recortarlas un poquito para que el robot se mueva mejor.',
        emoji: '✂️',
      },
      {
        titulo: 'Conecta el motor a la pila',
        instruccion: 'Toma el motor de vibración. Tiene dos cables: uno rojo y uno negro. Pega el cable rojo a la parte plana (+) de la pila con cinta adhesiva. Aún NO pegues el cable negro.',
        consejo: 'Si pegas ambos cables, el motor empezará a vibrar inmediatamente. ¡Espera al siguiente paso!',
        emoji: '🔌',
      },
      {
        titulo: 'Pega el motor al cepillo',
        instruccion: 'Usa cinta adhesiva para pegar el motor encima de la cabeza del cepillo. Asegúrate de que quede bien firme en el centro, con la parte que vibra hacia arriba.',
        consejo: 'Si el motor queda chueco, el robot girará en círculos en vez de avanzar. ¡Puedes experimentar con diferentes posiciones!',
        emoji: '📎',
      },
      {
        titulo: 'Pega la pila',
        instruccion: 'Pega la pila encima del cepillo también, al lado del motor. Usa un poquito de cinta adhesiva. Asegúrate de que el cable rojo siga pegado a la parte plana (+).',
        consejo: 'La pila es un poco pesada para el cepillo, eso ayuda a que las cerdas hagan contacto con la mesa.',
        emoji: '🔋',
      },
      {
        titulo: '¡Enciéndelo!',
        instruccion: 'Ahora pega el cable negro a la otra cara de la pila (la parte plana de abajo, que es el -). ¡El motor empezará a vibrar y tu robot se moverá por la mesa!',
        consejo: 'Para apagarlo, simplemente despega uno de los cables de la pila.',
        emoji: '🚀',
      },
      {
        titulo: 'Personalízalo',
        instruccion: 'Pega los ojos móviles en el frente del cepillo. Puedes decorarlo con marcadores, stickers o lo que quieras. ¡Dale un nombre a tu robot!',
        consejo: '¡Haz varios y organiza carreras con tus amigos! 🏁',
        emoji: '🎨',
      },
    ],
  },
  {
    id: 'robot_vaso',
    nombre: 'VasoDroid Bailarín',
    emoji: '🥤',
    dificultad: 'Fácil',
    dificultadColor: '#22C55E',
    tiempo: '25 min',
    edad: '7+',
    descripcion: 'Un robot hecho con un vaso de plástico que gira y baila gracias a un motor con una hélice desbalanceada.',
    imagen: '💃',
    materiales: [
      { nombre: 'Vaso de plástico o unicel', emoji: '🥤', nota: 'Cualquier vaso desechable funciona' },
      { nombre: 'Motor DC pequeño (3V-6V)', emoji: '⚡', nota: 'De un juguete viejo o se compra en electrónica' },
      { nombre: '2 pilas AA', emoji: '🔋', nota: 'Con su porta pilas si tienes, si no con cinta' },
      { nombre: 'Clip de papel', emoji: '📎', nota: 'Se dobla y se pega al eje del motor como peso' },
      { nombre: 'Marcadores de colores', emoji: '🖍️', nota: '3 o 4 marcadores de punta gruesa' },
      { nombre: 'Cinta adhesiva y ligas', emoji: '📦', nota: 'Para sujetar todo' },
      { nombre: 'Hoja de papel grande', emoji: '📄', nota: 'Para que el robot dibuje sobre ella' },
    ],
    pasos: [
      {
        titulo: 'Prepara las patas de marcador',
        instruccion: 'Toma 3 o 4 marcadores y péguales al vaso con cinta adhesiva por fuera, con las puntas hacia abajo. Distribúyelos de manera uniforme alrededor del vaso para que quede parejo.',
        consejo: 'Quita las tapas de los marcadores para que pinten. El vaso debe quedar parado sobre las puntas de los marcadores.',
        emoji: '🖍️',
      },
      {
        titulo: 'Prepara el contrapeso del motor',
        instruccion: 'Abre un clip de papel y hazlo una "L". Pega la parte corta de la "L" al eje (la barrita que gira) del motor con un poquito de cinta. Este peso hará que el motor vibre.',
        consejo: 'Si el clip se resbala, puedes usar un poco de pegamento caliente (pide ayuda a un adulto).',
        emoji: '📎',
      },
      {
        titulo: 'Conecta las pilas al motor',
        instruccion: 'Si tienes porta pilas, conecta los cables del motor al porta pilas. Si no, junta las 2 pilas AA en serie (la parte + de una tocando la parte - de la otra) y pega los cables con cinta.',
        consejo: 'El cable rojo va al + y el negro al -. Si no sabes cuál es cuál, prueba los dos lados: el motor gira igual, solo cambia la dirección.',
        emoji: '🔋',
      },
      {
        titulo: 'Monta el motor en el vaso',
        instruccion: 'Voltea el vaso boca abajo. Pega el motor en la parte de arriba (que ahora es el fondo del vaso) con cinta adhesiva. El clip debe poder girar libremente sin tocar el vaso.',
        consejo: 'Puedes pegar el motor un poco fuera del centro para que el robot haga dibujos más interesantes.',
        emoji: '⚙️',
      },
      {
        titulo: 'Agrega las pilas',
        instruccion: 'Pega las pilas (o el porta pilas) en un lado del vaso con cinta o una liga. Asegúrate de que todo esté bien sujeto y no se caiga.',
        consejo: 'Si el vaso se voltea, intenta poner las pilas más cerca del centro para equilibrarlo.',
        emoji: '📦',
      },
      {
        titulo: '¡A dibujar!',
        instruccion: 'Pon una hoja de papel grande en la mesa. Coloca tu VasoDroid encima con los marcadores destapados. Conecta el motor a las pilas y observa cómo el robot se mueve y crea patrones únicos.',
        consejo: '¡Cada VasoDroid hace un dibujo diferente! Cambia los colores de los marcadores para crear arte multicolor. 🎨',
        emoji: '🎉',
      },
    ],
  },
  {
    id: 'robot_pinzas',
    nombre: 'PinzaBot Explorador',
    emoji: '🦀',
    dificultad: 'Media',
    dificultadColor: '#F59E0B',
    tiempo: '35 min',
    edad: '8+',
    descripcion: 'Un robot con pinzas de ropa como patas. Camina de forma divertida gracias a un mecanismo simple de motor y ligas.',
    imagen: '🦿',
    materiales: [
      { nombre: '6 pinzas de ropa de madera', emoji: '📌', nota: 'Las de madera funcionan mejor que las de plástico' },
      { nombre: 'Motor DC pequeño con caja reductora', emoji: '⚙️', nota: 'Se consigue en tiendas de electrónica' },
      { nombre: 'Porta pilas con 2 pilas AA', emoji: '🔋', nota: 'Con interruptor si es posible' },
      { nombre: 'Palitos de madera (abatelenguas)', emoji: '🪵', nota: '2 palitos para el cuerpo' },
      { nombre: 'Liga grande', emoji: '🔗', nota: 'Para conectar el motor a las patas' },
      { nombre: 'Pegamento caliente', emoji: '🔥', nota: '¡Pide ayuda a un adulto! También sirve pegamento fuerte' },
      { nombre: 'Cable delgado (30 cm)', emoji: '🔌', nota: 'Para ejes y conexiones' },
      { nombre: 'Tapas de refresco (2)', emoji: '🫙', nota: 'Para las ruedas del mecanismo' },
    ],
    pasos: [
      {
        titulo: 'Arma el cuerpo base',
        instruccion: 'Pega dos palitos de madera uno junto al otro para hacer una base más ancha y resistente. Déjalos secar un minuto si usas pegamento caliente.',
        consejo: 'Puedes usar 3 palitos si quieres un robot más grande y estable.',
        emoji: '🪵',
      },
      {
        titulo: 'Coloca las patas (pinzas)',
        instruccion: 'Pega 3 pinzas de ropa a cada lado del cuerpo (6 en total). Cada pinza debe quedar perpendicular al cuerpo, apuntando hacia abajo, como si fueran las patas de un ciempiés.',
        consejo: 'Alterna las pinzas: una apuntando un poco al frente y la siguiente un poco atrás. Esto le dará un caminar más divertido.',
        emoji: '📌',
      },
      {
        titulo: 'Prepara el eje con tapas',
        instruccion: 'Pasa el cable delgado por el centro de las dos tapas de refresco (haz un hoyito con un clavo). Las tapas serán las ruedas internas. Enrolla la liga en el eje entre las tapas.',
        consejo: 'El eje debe girar libremente dentro de las tapas. Pon un poco de jabón si está muy apretado.',
        emoji: '⚙️',
      },
      {
        titulo: 'Conecta el motor al eje',
        instruccion: 'Si tu motor tiene caja reductora, conecta la liga del eje al engrane del motor. Si no, enrolla la liga en el eje del motor y en las tapas para hacer una transmisión simple.',
        consejo: 'La liga no debe estar ni muy floja ni muy apretada. Prueba girando el motor con la mano para ver si las tapas giran.',
        emoji: '🔄',
      },
      {
        titulo: 'Monta el motor y las pilas',
        instruccion: 'Pega el motor y el eje con tapas en la parte de arriba del cuerpo de palitos. Pega el porta pilas también. Conecta los cables del motor al porta pilas.',
        consejo: 'Asegúrate de que las tapas girando toquen las pinzas para que el movimiento se transmita a las "patas".',
        emoji: '📦',
      },
      {
        titulo: 'Ajusta y prueba',
        instruccion: 'Coloca el robot en una superficie lisa. Enciende el motor. Las tapas girarán y moverán las pinzas, haciendo que el robot "camine". Ajusta la posición de las pinzas si no se mueve bien.',
        consejo: 'Si una pata se atora, cámbiala de posición. ¡Experimenta hasta que encuentres el mejor acomodo!',
        emoji: '🧪',
      },
      {
        titulo: 'Decora tu PinzaBot',
        instruccion: 'Pinta las pinzas de colores, ponle ojos, antenas con limpiapipas, o lo que imagines. ¡Tu PinzaBot Explorador está listo para aventuras!',
        consejo: 'Puedes pegarle un pedacito de papel en el frente como si fuera su cara. ¡Dale una personalidad única! 🎨',
        emoji: '🎨',
      },
    ],
  },
  {
    id: 'robot_carton',
    nombre: 'CartónTron Rodante',
    emoji: '📦',
    dificultad: 'Media',
    dificultadColor: '#F59E0B',
    tiempo: '40 min',
    edad: '8+',
    descripcion: 'Un robot con cuerpo de caja de cartón que rueda con ruedas de tapas. ¡Puedes decorarlo como un carro, animal o nave espacial!',
    imagen: '🚗',
    materiales: [
      { nombre: 'Caja de cartón pequeña', emoji: '📦', nota: 'Como una caja de cereal individual o de galletas' },
      { nombre: '4 tapas de refresco iguales', emoji: '🫙', nota: 'Serán las ruedas' },
      { nombre: '2 palitos de brocheta', emoji: '🪵', nota: 'Para los ejes de las ruedas' },
      { nombre: 'Motor DC con caja reductora', emoji: '⚙️', nota: 'Con engrane que se pueda conectar al eje' },
      { nombre: 'Porta pilas con 2 pilas AA', emoji: '🔋', nota: 'También funciona una pila de 9V con su broche' },
      { nombre: '2 popotes/pajitas', emoji: '🥤', nota: 'Donde irán los ejes, como guía' },
      { nombre: 'Pegamento caliente y cinta', emoji: '🔥', nota: 'Pide ayuda a un adulto para el pegamento caliente' },
      { nombre: 'Materiales de decoración', emoji: '🎨', nota: 'Pintura, stickers, papel de colores, lo que quieras' },
    ],
    pasos: [
      {
        titulo: 'Prepara la caja',
        instruccion: 'Si tu caja tiene agujeros, ciérralos con cinta. La caja debe ser firme. Haz un hoyo pequeño en la parte de atrás para pasar los cables del motor.',
        consejo: 'Si la caja es muy flexible, pega un cartón extra adentro para reforzarla.',
        emoji: '📦',
      },
      {
        titulo: 'Instala los ejes de las ruedas',
        instruccion: 'Pega los 2 popotes en la parte de abajo de la caja, uno adelante y otro atrás, de lado a lado. Pasa un palito de brocheta por dentro de cada popote. Estos serán los ejes.',
        consejo: 'Los popotes actúan como "guías" para que los palitos giren libremente dentro de ellos.',
        emoji: '🔧',
      },
      {
        titulo: 'Agrega las ruedas',
        instruccion: 'Haz un hoyo en el centro de cada tapa de refresco. Mete los palillos en los hoyos y pega las tapas a las puntas de los palillos con pegamento caliente. ¡Una tapa en cada punta! Total: 4 ruedas.',
        consejo: 'Las tapas deben quedar derechas, no chuecas. Si quedan chuecas, el robot no rodará bien.',
        emoji: '🫙',
      },
      {
        titulo: 'Instala el motor',
        instruccion: 'Pega el motor dentro de la caja, cerca del eje trasero. El engrane del motor debe engancharse con el palito del eje trasero. Puedes usar un pedacito de tubo de plástico o una liga para conectarlos.',
        consejo: 'Si usas liga: enrolla la liga en el eje del motor y en el palito del eje trasero. Así cuando el motor gire, las ruedas traseras girarán.',
        emoji: '⚙️',
      },
      {
        titulo: 'Conecta la energía',
        instruccion: 'Pon el porta pilas dentro de la caja. Conecta los cables del motor al porta pilas: rojo con rojo (+), negro con negro (-). Puedes agregar un interruptor para encender y apagar fácilmente.',
        consejo: 'Un truco simple: deja un cable suelto. Cuando lo conectas a la pila, el motor enciende. Cuando lo desconectas, se apaga.',
        emoji: '🔋',
      },
      {
        titulo: '¡Prueba de rodaje!',
        instruccion: 'Cierra la caja con cinta. Coloca tu CartónTron en el piso. Enciende el motor y observa cómo se mueve. Si se va chueco, ajusta las ruedas.',
        consejo: 'Si las ruedas patinan en piso liso, pégales un pedacito de liga o globo para darles más tracción.',
        emoji: '🏎️',
      },
      {
        titulo: 'Diseño y decoración',
        instruccion: 'Ahora viene la parte más divertida: decora tu CartónTron. Puedes pintarlo como un carro de carreras, un animal, un tanque o lo que imagines. Pégale ojos, ventanas, alas... ¡tú decides!',
        consejo: 'Puedes pegarle LEDs con una pila de botón para que tenga luces. ¡Se verá increíble en la oscuridad! 💡',
        emoji: '🎨',
      },
    ],
  },
  {
    id: 'robot_lata',
    nombre: 'LataDroid Luminoso',
    emoji: '🥫',
    dificultad: 'Difícil',
    dificultadColor: '#EF4444',
    tiempo: '50 min',
    edad: '9+',
    descripcion: 'Un robot con cuerpo de lata de aluminio, LEDs que brillan, motor para moverse y un sensor de luz casero con LDR.',
    imagen: '✨',
    materiales: [
      { nombre: 'Lata de aluminio vacía y limpia', emoji: '🥫', nota: 'De refresco o jugo, bien lavada y seca' },
      { nombre: 'Motor DC con caja reductora', emoji: '⚙️', nota: 'Para dar movimiento' },
      { nombre: 'Porta pilas con 3 pilas AA (4.5V)', emoji: '🔋', nota: 'O una pila de 9V con regulador' },
      { nombre: '2 LEDs de colores', emoji: '💡', nota: 'Serán los ojos del robot' },
      { nombre: '2 resistencias de 220Ω', emoji: '🔗', nota: 'Para proteger los LEDs' },
      { nombre: 'LDR (fotoresistencia)', emoji: '☀️', nota: 'Sensor que detecta luz (cuesta ~$5 pesos)' },
      { nombre: 'Cables dupont y protoboard mini', emoji: '🔌', nota: 'Para conectar el circuito' },
      { nombre: '4 tapas como ruedas + 2 palitos eje', emoji: '🫙', nota: 'Igual que el CartónTron' },
      { nombre: 'Pegamento caliente y cinta', emoji: '🔥', nota: 'Para fijar todo' },
    ],
    pasos: [
      {
        titulo: 'Prepara la lata (¡con cuidado!)',
        instruccion: 'Pide a un adulto que haga dos hoyitos en el frente de la lata para los LEDs (ojos), un hoyo en la parte trasera para los cables, y dos ranuras en la parte de abajo para los ejes.',
        consejo: '⚠️ Los bordes de la lata pueden cortar. Un adulto debe hacer todos los cortes. Puedes poner cinta en los bordes filosos.',
        emoji: '⚠️',
      },
      {
        titulo: 'Instala los ojos LED',
        instruccion: 'Mete cada LED por los hoyos del frente de la lata, con la parte redonda hacia afuera. Conecta una resistencia de 220Ω a la pata larga (+) de cada LED. Las patas cortas (-) se conectan juntas.',
        consejo: 'Los LEDs solo prenden en una dirección. Si no enciende, voltéalo.',
        emoji: '💡',
      },
      {
        titulo: 'Arma el circuito del sensor',
        instruccion: 'En el protoboard mini, conecta la LDR en serie con una resistencia de 220Ω. La unión entre la LDR y la resistencia es tu "sensor". Cuando hay luz, la LDR deja pasar corriente y los LEDs brillan más.',
        consejo: 'Si no tienes protoboard, puedes soldar los cables directamente (con ayuda de un adulto) o usar conectores de clips.',
        emoji: '☀️',
      },
      {
        titulo: 'Agrega las ruedas y el motor',
        instruccion: 'Igual que en el CartónTron: pega popotes debajo de la lata, pasa palitos como ejes, y pon tapas como ruedas. Conecta el motor al eje trasero con una liga.',
        consejo: 'La lata es cilíndrica, así que puedes usar cinta extra o una base de cartón debajo para estabilizar.',
        emoji: '⚙️',
      },
      {
        titulo: 'Conecta toda la electrónica',
        instruccion: 'Conecta los LEDs, el sensor LDR y el motor al porta pilas. Los LEDs y el sensor van en un circuito, y el motor va en otro. Ambos comparten las mismas pilas.',
        consejo: 'Esquema simple: Pila(+) → LED → resistencia → Pila(-). Pila(+) → Motor → Pila(-). El LDR puede ir en serie con los LEDs para que brillen más o menos según la luz.',
        emoji: '🔌',
      },
      {
        titulo: 'Prueba el circuito',
        instruccion: 'Antes de cerrar todo, prueba: ¿Encienden los LEDs? ¿Gira el motor? ¿El sensor reacciona a la luz? Tapa la LDR con tu mano y ve si los LEDs cambian de brillo.',
        consejo: 'Si algo no funciona, revisa las conexiones. El error más común es tener un cable suelto o un LED al revés.',
        emoji: '🧪',
      },
      {
        titulo: 'Ensambla y cierra',
        instruccion: 'Mete toda la electrónica dentro de la lata. Pasa los cables del motor por el hoyo trasero. Asegura todo con cinta o pegamento. Cierra la parte de arriba de la lata con un pedazo de cartón.',
        consejo: 'Deja un acceso fácil a las pilas para cuando necesites cambiarlas.',
        emoji: '📦',
      },
      {
        titulo: 'Decoración estelar',
        instruccion: 'Pinta la lata con marcadores permanentes o pégale papel de colores. Agrega antenas con limpiapipas, brazos con palitos, o lo que quieras. ¡Tu LataDroid Luminoso está listo!',
        consejo: 'Pruébalo en la oscuridad para ver los LEDs brillar. ¡Tapa la LDR y destápala para ver cómo reacciona! 🌙',
        emoji: '🎨',
      },
    ],
  },
  {
    id: 'robot_solar',
    nombre: 'SolarBot Ecológico',
    emoji: '☀️',
    dificultad: 'Difícil',
    dificultadColor: '#EF4444',
    tiempo: '45 min',
    edad: '10+',
    descripcion: 'Un robot que funciona con energía solar. Usa un panel solar pequeño para dar energía a un motor que mueve las patas hechas de alambre.',
    imagen: '🌱',
    materiales: [
      { nombre: 'Mini panel solar (3V-6V)', emoji: '☀️', nota: 'Se compra en tiendas de electrónica (~$30-50 pesos)' },
      { nombre: 'Motor DC pequeño (3V)', emoji: '⚙️', nota: 'Que funcione con el voltaje del panel' },
      { nombre: 'Alambre galvanizado grueso', emoji: '🔗', nota: 'Para las patas (calibre 14-16)' },
      { nombre: 'Corcho de botella o triplay', emoji: '🪵', nota: 'Para el cuerpo del robot' },
      { nombre: 'CD viejo', emoji: '💿', nota: 'Para hacer la leva que mueve las patas' },
      { nombre: 'Pegamento caliente', emoji: '🔥', nota: 'Para fijar las piezas' },
      { nombre: 'Perla o cuenta con hoyo', emoji: '📿', nota: 'Para el contrapeso en el eje' },
      { nombre: 'Pinzas de punta', emoji: '🔧', nota: 'Para doblar el alambre (pide ayuda)' },
    ],
    pasos: [
      {
        titulo: 'Crea el cuerpo base',
        instruccion: 'Corta el corcho por la mitad a lo largo para hacer una base plana. Si usas triplay, corta un rectángulo de 8×4 cm. Esta será la "espalda" de tu robot.',
        consejo: 'El cuerpo debe ser lo más liviano posible para que el panel solar tenga suficiente energía para moverlo.',
        emoji: '🪵',
      },
      {
        titulo: 'Dobla las patas de alambre',
        instruccion: 'Corta 4 pedazos de alambre de 10 cm cada uno. Dóblalos en forma de "L": la parte corta (3 cm) se pega al cuerpo, y la parte larga (7 cm) es la pata que toca el suelo.',
        consejo: 'Usa las pinzas de punta para doblar. ¡El alambre puede pinchar, ten cuidado! Pide ayuda a un adulto.',
        emoji: '🔗',
      },
      {
        titulo: 'Instala las patas',
        instruccion: 'Pega dos patas de cada lado del cuerpo con pegamento caliente. Las patas deben apuntar hacia abajo y un poco hacia afuera para dar estabilidad.',
        consejo: 'Las patas traseras pueden ser un poquito más largas que las delanteras para que el robot vaya hacia adelante.',
        emoji: '🦿',
      },
      {
        titulo: 'Prepara el mecanismo de leva',
        instruccion: 'Pega la perla o cuenta al eje del motor, un poco fuera del centro. Esto hará que cuando el motor gire, el eje "bambolee" y mueva las patas del robot.',
        consejo: 'Si no tienes perla, un pedacito de plastilina o arcilla pegado al eje funciona igual.',
        emoji: '⚙️',
      },
      {
        titulo: 'Monta el motor',
        instruccion: 'Pega el motor en la parte de arriba del cuerpo, justo en el centro. El eje con la perla debe quedar hacia adelante del robot.',
        consejo: 'El motor debe estar bien firme. Si se mueve, el robot no caminará bien.',
        emoji: '🔧',
      },
      {
        titulo: 'Instala el panel solar',
        instruccion: 'Pega el panel solar en la parte de arriba del robot, encima del motor. Conecta los cables del panel al motor: rojo con rojo, negro con negro.',
        consejo: 'El panel solar necesita luz directa del sol. ¡En la sombra no funcionará!',
        emoji: '☀️',
      },
      {
        titulo: '¡Prueba bajo el sol!',
        instruccion: 'Lleva tu SolarBot afuera en un día soleado. Colócalo en una superficie lisa y asegúrate de que el panel solar reciba luz directa. ¡El motor empezará a girar y el robot caminará!',
        consejo: 'Si no camina, ajusta las patas para que sean más flexibles. En días nublados puedes acercar una lámpara muy fuerte.',
        emoji: '🌞',
      },
      {
        titulo: 'Mejoras y diseño',
        instruccion: 'Decora tu SolarBot con pintura, papel o lo que quieras. Puedes agregarle antenas, ojos o alas. ¡Este robot funciona con energía limpia y renovable!',
        consejo: '¡Enséñale a tu familia cómo funciona la energía solar! Es un gran proyecto para ferias de ciencias. 🔬',
        emoji: '🎨',
      },
    ],
  },
];

// ============================================
// GENERADOR DE PDF CON LOGO
// ============================================
const generateRobotPDF = async (robot) => {
  const pdf = new jsPDF('p', 'mm', 'letter');
  const pageWidth = 216;
  const pageHeight = 279;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Load logo
  let logoImg = null;
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = '/logo-v2.png';
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    logoImg = canvas.toDataURL('image/png');
  } catch {
    logoImg = null;
  }

  const addHeader = (pageNum) => {
    // Logo top-left
    if (logoImg) {
      try { pdf.addImage(logoImg, 'PNG', margin, 8, 22, 22); } catch {}
    }
    // CultivaTec brand text
    pdf.setFontSize(10);
    pdf.setTextColor(37, 99, 235);
    pdf.text('CultivaTec - Bahía de la Chatarra Estelar', logoImg ? margin + 25 : margin, 18);
    pdf.setFontSize(7);
    pdf.setTextColor(160, 160, 160);
    pdf.text(`Página ${pageNum}`, pageWidth - margin, 18, { align: 'right' });
    // Divider line
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 28, pageWidth - margin, 28);
    return 33;
  };

  const addFooter = () => {
    pdf.setFontSize(7);
    pdf.setTextColor(180, 180, 180);
    pdf.text('CultivaTec © — Aprendiendo robótica paso a paso', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
  };

  const checkNewPage = (neededSpace) => {
    if (y + neededSpace > pageHeight - 20) {
      addFooter();
      pdf.addPage();
      pageNum++;
      y = addHeader(pageNum);
      return true;
    }
    return false;
  };

  let pageNum = 1;

  // ---- PAGE 1: Cover ----
  y = addHeader(pageNum);

  // Title
  pdf.setFontSize(26);
  pdf.setTextColor(30, 64, 175);
  pdf.text(robot.nombre, pageWidth / 2, y + 10, { align: 'center' });
  y += 18;

  // Robot emoji big
  pdf.setFontSize(50);
  pdf.text(robot.emoji, pageWidth / 2, y + 18, { align: 'center' });
  y += 28;

  // Difficulty / time / age badges
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  const infoLine = `Dificultad: ${robot.dificultad}   |   Tiempo: ${robot.tiempo}   |   Edad: ${robot.edad}`;
  pdf.text(infoLine, pageWidth / 2, y + 5, { align: 'center' });
  y += 12;

  // Description
  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  const descLines = pdf.splitTextToSize(robot.descripcion, contentWidth - 20);
  descLines.forEach(line => {
    pdf.text(line, pageWidth / 2, y + 5, { align: 'center' });
    y += 5;
  });
  y += 8;

  // Materials section
  pdf.setDrawColor(220, 220, 240);
  pdf.setFillColor(240, 245, 255);
  const matBoxHeight = 10 + robot.materiales.length * 12;
  checkNewPage(matBoxHeight + 10);
  pdf.roundedRect(margin, y, contentWidth, matBoxHeight, 3, 3, 'FD');

  pdf.setFontSize(14);
  pdf.setTextColor(30, 64, 175);
  pdf.text('Materiales Necesarios', margin + 5, y + 8);
  y += 14;

  pdf.setFontSize(10);
  robot.materiales.forEach(mat => {
    checkNewPage(14);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`${mat.emoji}  ${mat.nombre}`, margin + 6, y);
    y += 4.5;
    pdf.setFontSize(8);
    pdf.setTextColor(130, 130, 130);
    const notaLines = pdf.splitTextToSize(mat.nota, contentWidth - 16);
    notaLines.forEach(nl => {
      pdf.text(`     ${nl}`, margin + 6, y);
      y += 3.5;
    });
    pdf.setFontSize(10);
    y += 2;
  });

  y += 6;

  // ---- STEPS PAGES ----
  robot.pasos.forEach((paso, idx) => {
    const stepHeight = 45;
    checkNewPage(stepHeight);

    // Step box
    pdf.setDrawColor(200, 210, 240);
    pdf.setFillColor(idx % 2 === 0 ? 248 : 243, idx % 2 === 0 ? 250 : 247, 255);
    pdf.roundedRect(margin, y, contentWidth, 0.1, 2, 2, 'F'); // placeholder, we'll draw content

    // Step number circle
    pdf.setFillColor(37, 99, 235);
    pdf.circle(margin + 8, y + 5, 5, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${idx + 1}`, margin + 8, y + 7, { align: 'center' });

    // Step title
    pdf.setFontSize(13);
    pdf.setTextColor(30, 58, 138);
    pdf.text(`${paso.emoji} ${paso.titulo}`, margin + 16, y + 7);
    y += 13;

    // Instruction
    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 50);
    const instrLines = pdf.splitTextToSize(paso.instruccion, contentWidth - 10);
    instrLines.forEach(line => {
      checkNewPage(6);
      pdf.text(line, margin + 5, y);
      y += 5;
    });
    y += 3;

    // Tip
    if (paso.consejo) {
      checkNewPage(14);
      pdf.setFillColor(255, 251, 235);
      const tipLines = pdf.splitTextToSize(`Consejo: ${paso.consejo}`, contentWidth - 16);
      pdf.roundedRect(margin + 3, y - 3, contentWidth - 6, tipLines.length * 4.5 + 6, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setTextColor(180, 130, 20);
      tipLines.forEach(tl => {
        pdf.text(tl, margin + 8, y + 2);
        y += 4.5;
      });
      y += 5;
    }

    y += 6;
  });

  // Final note
  checkNewPage(30);
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(margin, y, contentWidth, 20, 3, 3, 'F');
  pdf.setFontSize(12);
  pdf.setTextColor(22, 163, 74);
  pdf.text('¡Felicidades! Tu robot está terminado.', pageWidth / 2, y + 9, { align: 'center' });
  pdf.setFontSize(9);
  pdf.setTextColor(80, 120, 80);
  pdf.text('Recuerda: experimenta, ajusta y mejora. ¡Eso hacen los ingenieros!', pageWidth / 2, y + 15, { align: 'center' });

  addFooter();

  // Download
  pdf.save(`CultivaTec_${robot.id}.pdf`);
};

// ============================================
// COMPONENTE DE DETALLE DE ROBOT
// ============================================
const RobotDetailModal = ({ robot, onClose }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = overview, 0+ = steps
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateRobotPDF(robot);
    } catch (e) {
      alert('Error generando PDF: ' + e.message);
    }
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-[#0F172A] w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden border border-indigo-500/20" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-5 py-4 flex items-center justify-between border-b border-indigo-500/30 relative overflow-hidden">
          {/* Stars in header */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white" style={{
                width: `${1 + (i % 2)}px`, height: `${1 + (i % 2)}px`,
                left: `${(i * 13) % 95}%`, top: `${(i * 17 + 10) % 80}%`,
                opacity: 0.3 + (i % 3) * 0.2,
                animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
              }} />
            ))}
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="text-4xl">{robot.emoji}</div>
            <div>
              <h2 className="text-base font-black text-white">{robot.nombre}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black text-white" style={{ background: robot.dificultadColor }}>{robot.dificultad}</span>
                <span className="text-[10px] text-indigo-300 font-bold flex items-center gap-1"><Clock size={10} /> {robot.tiempo}</span>
                <span className="text-[10px] text-indigo-300 font-bold">👶 {robot.edad}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition relative z-10">
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          {currentStep === -1 ? (
            // Overview
            <div className="p-5 space-y-4">
              <p className="text-sm text-indigo-200/80 font-semibold leading-relaxed">{robot.descripcion}</p>

              {/* Materials */}
              <div className="bg-indigo-950/50 rounded-2xl p-4 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-black text-indigo-300">Materiales</h3>
                </div>
                <div className="space-y-2.5">
                  {robot.materiales.map((mat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-lg flex-shrink-0 mt-0.5">{mat.emoji}</span>
                      <div>
                        <p className="text-xs font-black text-white/90">{mat.nombre}</p>
                        <p className="text-[10px] text-indigo-300/60 font-semibold">{mat.nota}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps preview */}
              <div className="bg-indigo-950/50 rounded-2xl p-4 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench size={16} className="text-amber-400" />
                  <h3 className="text-sm font-black text-amber-300">Pasos ({robot.pasos.length})</h3>
                </div>
                <div className="space-y-2">
                  {robot.pasos.map((paso, i) => (
                    <button key={i} onClick={() => setCurrentStep(i)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition active:scale-[0.98] text-left border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-white">{i + 1}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-black text-white/80 truncate">{paso.emoji} {paso.titulo}</p>
                      </div>
                      <ChevronRight size={14} className="text-indigo-400/50 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Step detail
            <div className="p-5 space-y-4">
              {/* Step navigation */}
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setCurrentStep(currentStep - 1 < 0 ? -1 : currentStep - 1)}
                  className="flex items-center gap-1 text-indigo-400 text-xs font-black active:scale-95 transition">
                  <ChevronLeft size={14} /> {currentStep === 0 ? 'Materiales' : `Paso ${currentStep}`}
                </button>
                <span className="text-[10px] font-black text-indigo-400/60">Paso {currentStep + 1} de {robot.pasos.length}</span>
                {currentStep < robot.pasos.length - 1 && (
                  <button onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center gap-1 text-indigo-400 text-xs font-black active:scale-95 transition">
                    Paso {currentStep + 2} <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5">
                {robot.pasos.map((_, i) => (
                  <button key={i} onClick={() => setCurrentStep(i)}
                    className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-6 bg-indigo-400' : i < currentStep ? 'w-1.5 bg-indigo-500' : 'w-1.5 bg-indigo-800'}`} />
                ))}
              </div>

              {/* Step content */}
              {(() => {
                const paso = robot.pasos[currentStep];
                return (
                  <div className="space-y-4">
                    <div className="bg-indigo-950/80 rounded-2xl p-5 border border-indigo-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <span className="text-lg text-white font-black">{currentStep + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-black text-white">{paso.emoji} {paso.titulo}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-indigo-100/80 font-semibold leading-relaxed mb-4">{paso.instruccion}</p>

                      {paso.consejo && (
                        <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                          <div className="flex items-start gap-2">
                            <Star size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-200/80 font-semibold leading-relaxed">
                              <span className="font-black text-amber-300">Consejo: </span>{paso.consejo}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Next step button */}
                    {currentStep < robot.pasos.length - 1 ? (
                      <button onClick={() => setCurrentStep(currentStep + 1)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-sm active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
                        Siguiente Paso <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
                          <span className="text-3xl block mb-2">🎉</span>
                          <p className="text-sm font-black text-emerald-300">¡Has terminado todos los pasos!</p>
                          <p className="text-xs text-emerald-400/60 font-semibold mt-1">Tu {robot.nombre} está listo</p>
                        </div>
                        <button onClick={() => setCurrentStep(-1)}
                          className="w-full py-3 bg-white/10 text-white rounded-xl font-black text-sm active:scale-95 transition border border-white/10">
                          Ver resumen
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Bottom bar with download */}
        <div className="px-5 py-3 bg-indigo-950/80 border-t border-indigo-500/20 flex items-center gap-3">
          <button onClick={() => setCurrentStep(-1)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition active:scale-95 ${currentStep === -1 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-300 border border-indigo-500/20'}`}>
            📋 Resumen
          </button>
          <button onClick={handleDownload} disabled={downloading}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-sm active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50">
            <Download size={14} />
            {downloading ? 'Generando PDF...' : 'Descargar PDF con planos'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PANTALLA PRINCIPAL — BAHÍA DE LA CHATARRA
// ============================================
const BahiaChatarraScreen = ({ onBack }) => {
  const [selectedRobot, setSelectedRobot] = useState(null);

  // Stars for space background
  const stars = React.useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      left: `${(i * 13.7 + 5) % 98}%`,
      top: `${(i * 17.3 + 3) % 95}%`,
      size: 1 + (i % 3),
      twinkleDuration: `${2 + (i % 5) * 0.8}s`,
      twinkleDelay: `${(i * 0.3) % 4}s`,
    }))
  , []);

  return (
    <div className="pb-24 min-h-full bg-gradient-to-b from-[#0B1120] via-[#121B3A] to-[#0F172A] w-full relative overflow-hidden">
      {/* Space background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nebula blobs */}
        <div className="galaxy-nebula" style={{
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.08) 40%, transparent 70%)',
          right: '-5%', top: '5%', '--nebula-duration': '20s',
        }}></div>
        <div className="galaxy-nebula-2" style={{
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)',
          left: '-8%', bottom: '20%', '--nebula-duration': '25s',
        }}></div>

        {/* Stars */}
        {stars.map((star, i) => (
          <div key={`star-${i}`} className="galaxy-star" style={{
            left: star.left, top: star.top,
            width: `${star.size}px`, height: `${star.size}px`,
            '--twinkle-duration': star.twinkleDuration,
            '--twinkle-delay': star.twinkleDelay,
          }}></div>
        ))}

        {/* Floating scrap particles */}
        {['🔩', '⚙️', '🔧', '📎', '🔋', '💡'].map((emoji, i) => (
          <div key={`scrap-${i}`} className="absolute text-lg opacity-20 pointer-events-none" style={{
            left: `${10 + i * 15}%`,
            top: `${5 + (i * 23) % 80}%`,
            animation: `float-planet ${8 + i * 2}s ease-in-out infinite ${i * 1.5}s`,
          }}>{emoji}</div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="bg-gradient-to-b from-amber-900/40 via-amber-900/20 to-transparent px-5 pt-5 pb-8">
          {onBack && (
            <button onClick={onBack} className="text-amber-300/60 hover:text-amber-300 mb-4 flex items-center text-sm font-black active:scale-95 transition">
              <ArrowLeft size={18} className="mr-1" /> Mapa Galáctico
            </button>
          )}

          <div className="text-center">
            {/* Floating bahia icon */}
            <div className="relative inline-block mb-3" style={{ animation: 'float-planet 5s ease-in-out infinite' }}>
              <div className="absolute inset-[-20px] rounded-full pointer-events-none opacity-70"
                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 65%)', filter: 'blur(10px)' }}></div>
              <img src="/bahia.png" alt="Bahía de la Chatarra Estelar"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10"
                style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5)) drop-shadow(0 0 40px rgba(245,158,11,0.2))' }} />
              {/* Orbiting sparkles */}
              <div className="absolute inset-[-12px] rounded-full border border-amber-400/10 pointer-events-none" style={{ animation: 'orbit-ring 15s linear infinite' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-400/60 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.6)]"></div>
              </div>
            </div>

            <h1 className="text-2xl font-black text-amber-300 tracking-tight drop-shadow-lg flex items-center justify-center gap-2">
              <Sparkles size={20} className="text-amber-400" /> Bahía de la Chatarra Estelar
            </h1>
            <p className="text-xs text-amber-200/50 font-bold mt-1.5 max-w-xs mx-auto leading-relaxed">
              ¡Construye robots increíbles con materiales caseros! Instrucciones paso a paso para pequeños ingenieros.
            </p>
          </div>
        </div>
      </div>

      {/* Robot Cards */}
      <div className="px-4 max-w-xl mx-auto space-y-4 relative z-10 -mt-2">
        {/* Info banner */}
        <div className="bg-amber-500/10 rounded-2xl p-3.5 border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-black text-amber-300">Supervisión de un adulto</p>
            <p className="text-[10px] text-amber-200/50 font-semibold">Algunos proyectos usan herramientas cortantes o pegamento caliente. ¡Pide ayuda!</p>
          </div>
        </div>

        {/* Robot grid */}
        {ROBOTS_CASEROS.map((robot, idx) => (
          <button key={robot.id} onClick={() => setSelectedRobot(robot)}
            className="w-full text-left animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/60 rounded-2xl p-4 border border-indigo-500/20 hover:border-indigo-400/40 transition-all active:scale-[0.98] shadow-lg shadow-indigo-900/20 group relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${robot.dificultadColor}15, transparent 70%)` }}></div>

              <div className="flex items-center gap-4 relative z-10">
                {/* Robot icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-800/50 to-purple-800/50 flex items-center justify-center border border-indigo-500/20 flex-shrink-0 group-hover:scale-105 transition-transform"
                  style={{ animation: `float-planet ${6 + idx}s ease-in-out infinite ${idx * 0.5}s` }}>
                  <span className="text-3xl">{robot.emoji}</span>
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-black text-white group-hover:text-indigo-200 transition-colors">{robot.nombre}</h3>
                  <p className="text-[10px] text-indigo-300/50 font-semibold mt-0.5 line-clamp-2">{robot.descripcion}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black text-white" style={{ background: robot.dificultadColor }}>{robot.dificultad}</span>
                    <span className="text-[9px] text-indigo-400/60 font-bold flex items-center gap-0.5"><Clock size={9} /> {robot.tiempo}</span>
                    <span className="text-[9px] text-indigo-400/60 font-bold">👶 {robot.edad}</span>
                    <span className="text-[9px] text-indigo-400/60 font-bold flex items-center gap-0.5"><Package size={9} /> {robot.materiales.length}</span>
                  </div>
                </div>

                <ChevronRight size={18} className="text-indigo-500/40 flex-shrink-0 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          </button>
        ))}

        {/* More coming soon */}
        <div className="flex flex-col items-center py-6 opacity-50">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-2xl border-2 border-dashed border-indigo-400/15"
            style={{ animation: 'float-planet 6s ease-in-out infinite' }}>
            🛸
          </div>
          <span className="text-xs font-black text-indigo-300/40 mt-2">¡Más robots próximamente!</span>
        </div>
      </div>

      {/* Robot Detail Modal */}
      {selectedRobot && (
        <RobotDetailModal robot={selectedRobot} onClose={() => setSelectedRobot(null)} />
      )}
    </div>
  );
};

export default BahiaChatarraScreen;
