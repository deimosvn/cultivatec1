import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Bell, Clock, MapPin, BookOpen, ChevronRight, Plus, CheckCircle, Star } from 'lucide-react';

// --- DATOS DE CLASES DE ROBÃ“TICA ---
const CLASS_SCHEDULE = [
  {
    id: 'c1',
    day: 'Lunes',
    dayShort: 'Lun',
    time: '3:00 PM - 4:30 PM',
    title: 'Electricidad y Circuitos',
    description: 'Fundamentos elÃ©ctricos, Ley de Ohm, circuitos en serie y paralelo',
    level: 'BÃ¡sico',
    icon: 'âš¡',
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-600',
    topics: ['Voltaje y Corriente', 'Resistencias', 'Circuitos BÃ¡sicos', 'Seguridad ElÃ©ctrica'],
    materials: ['Protoboard', 'LEDs', 'Resistencias', 'Pila 9V', 'Cables de conexiÃ³n']
  },
  {
    id: 'c2',
    day: 'Martes',
    dayShort: 'Mar',
    time: '3:00 PM - 4:30 PM',
    title: 'ProgramaciÃ³n con Python',
    description: 'Variables, funciones, bucles y lÃ³gica de programaciÃ³n',
    level: 'BÃ¡sico',
    icon: 'ðŸ',
    color: 'bg-green-500',
    borderColor: 'border-green-600',
    topics: ['Variables y Tipos', 'Condicionales', 'Bucles For/While', 'Funciones'],
    materials: ['Computadora/Tablet', 'CultivaTec App', 'Cuaderno de Notas']
  },
  {
    id: 'c3',
    day: 'MiÃ©rcoles',
    dayShort: 'MiÃ©',
    time: '3:00 PM - 4:30 PM',
    title: 'Arduino: Control y Sensores',
    description: 'ProgramaciÃ³n de Arduino, lectura de sensores y control de actuadores',
    level: 'Intermedio',
    icon: 'ðŸ•¹ï¸',
    color: 'bg-blue-500',
    borderColor: 'border-blue-600',
    topics: ['Setup y Loop', 'Pines Digitales', 'Pines AnalÃ³gicos', 'Sensores BÃ¡sicos'],
    materials: ['Arduino UNO', 'Cable USB', 'Sensor UltrasÃ³nico', 'Servo Motor', 'Computadora']
  },
  {
    id: 'c4',
    day: 'Jueves',
    dayShort: 'Jue',
    time: '3:00 PM - 4:30 PM',
    title: 'MecÃ¡nica y ConstrucciÃ³n',
    description: 'Engranajes, poleas, diseÃ±o de estructuras y ensamblaje de robots',
    level: 'Intermedio',
    icon: 'âš™ï¸',
    color: 'bg-blue-500',
    borderColor: 'border-blue-600',
    topics: ['Engranajes y TransmisiÃ³n', 'Estructuras Resistentes', 'DiseÃ±o de Chasis', 'Ensamblaje'],
    materials: ['Kit de engranajes', 'CartÃ³n/MDF', 'Pegamento', 'Herramientas bÃ¡sicas']
  },
  {
    id: 'c5',
    day: 'Viernes',
    dayShort: 'Vie',
    time: '3:00 PM - 5:00 PM',
    title: 'ðŸ† Proyecto Integrador',
    description: 'Taller prÃ¡ctico: construye y programa tu robot de la semana',
    level: 'Todos',
    icon: 'ðŸ¤–',
    color: 'bg-red-500',
    borderColor: 'border-red-600',
    topics: ['Trabajo en Equipo', 'ResoluciÃ³n de Problemas', 'Pruebas y Ajustes', 'PresentaciÃ³n'],
    materials: ['Todos los componentes de la semana', 'Creatividad', 'Trabajo en equipo']
  },
  {
    id: 'c6',
    day: 'SÃ¡bado',
    dayShort: 'SÃ¡b',
    time: '10:00 AM - 12:00 PM',
    title: 'Club de RobÃ³tica Avanzada',
    description: 'Proyectos especiales, competencias y robÃ³tica avanzada',
    level: 'Avanzado',
    icon: 'ðŸš€',
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-600',
    topics: ['Robots AutÃ³nomos', 'VisiÃ³n por Computadora', 'ComunicaciÃ³n IoT', 'Competencias'],
    materials: ['Kit Avanzado', 'Raspberry Pi', 'CÃ¡mara', 'Sensores Avanzados']
  }
];

const ANNOUNCEMENTS = [
  {
    id: 'a1',
    date: '10 Feb 2026',
    title: 'ðŸ† Torneo de Robots - Marzo 2026',
    message: 'Â¡Inscripciones abiertas para el Torneo Inter-escolar de RobÃ³tica! Fecha: 15 de Marzo. Armen sus equipos de 3 personas.',
    type: 'evento',
    priority: 'alta'
  },
  {
    id: 'a2',
    date: '8 Feb 2026',
    title: 'ðŸ“¦ Nuevos Kits de Arduino',
    message: 'Llegaron los nuevos kits con sensores de temperatura, humedad y mÃ³dulos Bluetooth. Â¡Los usaremos desde la prÃ³xima semana!',
    type: 'novedad',
    priority: 'media'
  },
  {
    id: 'a3',
    date: '5 Feb 2026',
    title: 'â­ Estudiante Destacado de Enero',
    message: 'Â¡Felicitaciones a todos los estudiantes que completaron su primer robot seguidor de lÃ­nea! Excelente trabajo en equipo.',
    type: 'reconocimiento',
    priority: 'baja'
  },
  {
    id: 'a4',
    date: '3 Feb 2026',
    title: 'ðŸ“ Tareas de la Semana',
    message: 'Recuerden practicar los ejercicios de programaciÃ³n en la app CultivaTec. MÃ³dulos 1-3 deben estar completados para el viernes.',
    type: 'tarea',
    priority: 'media'
  }
];

const PROJECTS = [
  {
    id: 'p1',
    title: 'Robot Seguidor de LÃ­nea',
    difficulty: 'â­â­',
    duration: '2 semanas',
    description: 'Construye un robot que siga una lÃ­nea negra en el piso usando sensores infrarrojos.',
    skills: ['Arduino', 'Sensores IR', 'Motores DC', 'ProgramaciÃ³n'],
    status: 'disponible'
  },
  {
    id: 'p2',
    title: 'EstaciÃ³n MeteorolÃ³gica',
    difficulty: 'â­â­',
    duration: '1 semana',
    description: 'Mide temperatura y humedad con sensores y muestra los datos en una pantalla LCD.',
    skills: ['Arduino', 'Sensor DHT11', 'Pantalla LCD', 'Variables'],
    status: 'disponible'
  },
  {
    id: 'p3',
    title: 'Brazo RobÃ³tico',
    difficulty: 'â­â­â­',
    duration: '3 semanas',
    description: 'Construye un brazo con 3 servomotores controlado con joystick o desde la computadora.',
    skills: ['Servomotores', 'Joystick', 'MecÃ¡nica', 'ProgramaciÃ³n Avanzada'],
    status: 'prÃ³ximamente'
  },
  {
    id: 'p4',
    title: 'SemÃ¡foro Inteligente',
    difficulty: 'â­',
    duration: '1 clase',
    description: 'Programa un semÃ¡foro con LEDs que cambie de color automÃ¡ticamente con tiempos reales.',
    skills: ['LEDs', 'digitalWrite', 'delay()', 'Circuitos'],
    status: 'disponible'
  }
];

// --- COMPONENTE PRINCIPAL ---
const ClassroomScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('horario');
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceDate] = useState(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  const tabs = [
    { id: 'horario', label: 'Horario', icon: 'ðŸ“…' },
    { id: 'anuncios', label: 'Anuncios', icon: 'ðŸ“¢' },
    { id: 'proyectos', label: 'Proyectos', icon: 'ðŸ”¨' },
    { id: 'asistencia', label: 'Mi Asistencia', icon: 'âœ…' },
  ];

  const renderSchedule = () => {
    if (selectedClass) {
      const cls = CLASS_SCHEDULE.find(c => c.id === selectedClass);
      return (
        <div className="space-y-3">
          <button onClick={() => setSelectedClass(null)} className="text-[#AFAFAF] hover:text-[#1CB0F6] font-black text-sm flex items-center transition active:scale-95">
            <ArrowLeft size={16} className="mr-1" /> Volver al Horario
          </button>
          
          <div className={`p-5 rounded-2xl ${cls.color} text-white border-b-4 ${cls.borderColor}`}>
            <span className="text-4xl">{cls.icon}</span>
            <h2 className="text-xl font-black mt-2">{cls.title}</h2>
            <p className="text-sm opacity-80 mt-1">{cls.day} | {cls.time}</p>
            <span className="inline-block mt-2 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-black">Nivel: {cls.level}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <h3 className="font-black text-sm text-[#1CB0F6] mb-1">ðŸ“ DescripciÃ³n</h3>
            <p className="text-[#777] text-sm">{cls.description}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <h3 className="font-black text-sm text-[#58CC02] mb-2">ðŸ“š Temas</h3>
            <div className="space-y-1.5">
              {cls.topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#D7FFB8] p-2.5 rounded-xl">
                  <CheckCircle size={14} className="text-[#58CC02] flex-shrink-0" />
                  <span className="font-bold text-[#3C3C3C] text-sm">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <h3 className="font-black text-sm text-[#FFC800] mb-2">ðŸŽ’ Materiales</h3>
            <div className="flex flex-wrap gap-1.5">
              {cls.materials.map((mat, i) => (
                <span key={i} className="bg-[#FFF4D4] text-[#E5B800] px-2.5 py-1 rounded-full text-xs font-black">{mat}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2.5 stagger-children">
        {CLASS_SCHEDULE.map(cls => (
          <div
            key={cls.id}
            onClick={() => setSelectedClass(cls.id)}
            className="bg-white p-3.5 rounded-2xl border-2 border-[#E5E5E5] cursor-pointer hover:border-[#1CB0F6] transition-all active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 ${cls.color} rounded-xl flex items-center justify-center text-xl border-b-2 ${cls.borderColor}`}>{cls.icon}</div>
              <div>
                <h3 className="font-black text-[#3C3C3C] text-sm">{cls.title}</h3>
                <p className="text-[11px] text-[#AFAFAF] flex items-center mt-0.5"><Clock size={12} className="mr-1" /> {cls.day} | {cls.time}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#E5E5E5]" />
          </div>
        ))}
      </div>
    );
  };

  const renderAnnouncements = () => (
    <div className="space-y-2.5 stagger-children">
      {ANNOUNCEMENTS.map(ann => {
        return (
          <div key={ann.id} className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-[#3C3C3C] text-sm leading-tight flex-grow">{ann.title}</h3>
              <span className="text-[10px] text-[#AFAFAF] font-black flex-shrink-0 ml-2">{ann.date}</span>
            </div>
            <p className="text-[#777] mt-1.5 text-xs leading-relaxed">{ann.message}</p>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
              ann.type === 'evento' ? 'bg-[#DDF4FF] text-[#1CB0F6]' :
              ann.type === 'tarea' ? 'bg-[#FFF0D4] text-[#FF9600]' :
              ann.type === 'novedad' ? 'bg-[#DBEAFE] text-[#60A5FA]' :
              'bg-[#D7FFB8] text-[#58CC02]'
            }`}>
              {ann.type.charAt(0).toUpperCase() + ann.type.slice(1)}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-3 stagger-children">
      {PROJECTS.map(proj => (
        <div key={proj.id} className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-[#3C3C3C] text-sm">{proj.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              proj.status === 'disponible' ? 'bg-[#D7FFB8] text-[#58CC02]' : 'bg-[#F7F7F7] text-[#AFAFAF]'
            }`}>
              {proj.status === 'disponible' ? 'âœ… Disponible' : 'ðŸ”’ PrÃ³ximamente'}
            </span>
          </div>
          <p className="text-[#777] mt-1.5 text-xs">{proj.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="text-[#FFC800] font-black">{proj.difficulty}</span>
            <span className="text-[#1CB0F6] font-black flex items-center"><Clock size={12} className="mr-1"/>{proj.duration}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {proj.skills.map((skill, i) => (
              <span key={i} className="bg-[#DDF4FF] text-[#1CB0F6] px-2 py-0.5 rounded-full text-[10px] font-black">{skill}</span>
            ))}
          </div>
          {proj.status === 'disponible' && (
            <button className="w-full mt-3 py-2.5 btn-3d btn-3d-green rounded-xl text-xs">
              ðŸ“‹ Ver Instrucciones
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderAttendance = () => {
    const weekDays = ['Lun', 'Mar', 'MiÃ©', 'Jue', 'Vie', 'SÃ¡b'];
    const [attendance, setAttendance] = useState({
      'Sem1': { 'Lun': true, 'Mar': true, 'MiÃ©': true, 'Jue': false, 'Vie': true, 'SÃ¡b': false },
      'Sem2': { 'Lun': true, 'Mar': true, 'MiÃ©': false, 'Jue': true, 'Vie': true, 'SÃ¡b': true },
      'Sem3': { 'Lun': true, 'Mar': true, 'MiÃ©': true, 'Jue': true, 'Vie': true, 'SÃ¡b': false },
      'Sem4': { 'Lun': false, 'Mar': false, 'MiÃ©': false, 'Jue': false, 'Vie': false, 'SÃ¡b': false },
    });

    const totalClasses = Object.values(attendance).reduce((total, week) => 
      total + Object.values(week).filter(Boolean).length, 0
    );
    const totalPossible = Object.values(attendance).reduce((total, week) => 
      total + Object.values(week).length, 0
    );
    const attendanceRate = Math.round((totalClasses / totalPossible) * 100);

    return (
      <div className="space-y-3">
        {/* Summary */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E5E5]">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-[#D7FFB8] p-2.5 rounded-xl"><p className="text-xl font-black text-[#58CC02]">{totalClasses}</p><p className="text-[10px] font-black text-[#58CC02]">Asistencias</p></div>
            <div className="bg-[#FFE1E1] p-2.5 rounded-xl"><p className="text-xl font-black text-[#FF4B4B]">{totalPossible - totalClasses}</p><p className="text-[10px] font-black text-[#FF4B4B]">Faltas</p></div>
            <div className="bg-[#DDF4FF] p-2.5 rounded-xl"><p className="text-xl font-black text-[#1CB0F6]">{attendanceRate}%</p><p className="text-[10px] font-black text-[#1CB0F6]">Total</p></div>
          </div>
          <div className="mt-3"><div className="w-full bg-[#E5E5E5] rounded-full h-3 overflow-hidden"><div className={`h-3 rounded-full transition-all ${attendanceRate >= 80 ? 'bg-[#58CC02]' : attendanceRate >= 60 ? 'bg-[#FFC800]' : 'bg-[#FF4B4B]'}`} style={{ width: `${attendanceRate}%` }}></div></div></div>
        </div>

        {Object.entries(attendance).map(([week, days]) => (
          <div key={week} className="bg-white p-3.5 rounded-2xl border-2 border-[#E5E5E5]">
            <h4 className="font-black text-[#777] text-xs mb-2">{week.replace('Sem', 'Semana ')}</h4>
            <div className="grid grid-cols-6 gap-2">
              {weekDays.map(day => (
                <div key={day} className="text-center">
                  <p className="text-[10px] font-black text-[#AFAFAF] mb-1">{day}</p>
                  <div className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm font-black ${
                    days[day] ? 'bg-[#58CC02] text-white' : 'bg-[#F7F7F7] text-[#E5E5E5]'
                  }`}>{days[day] ? 'âœ“' : 'âœ—'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pb-24 min-h-full bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-[#1CB0F6] px-6 pt-6 pb-8 text-center border-b-4 border-[#1899D6]">
        <span className="text-4xl mb-1 block">ðŸ«</span>
        <h1 className="text-2xl font-black text-white">Clases de RobÃ³tica</h1>
        <p className="text-white/80 text-sm font-bold mt-1">Tu espacio de aprendizaje presencial</p>
      </div>

      <div className="px-4 -mt-4 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedClass(null); }}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl font-black text-xs transition-all active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-white text-[#1CB0F6] border-2 border-[#1CB0F6]'
                  : 'bg-white text-[#AFAFAF] border-2 border-[#E5E5E5] hover:border-[#1CB0F6]/50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'horario' && renderSchedule()}
          {activeTab === 'anuncios' && renderAnnouncements()}
          {activeTab === 'proyectos' && renderProjects()}
          {activeTab === 'asistencia' && renderAttendance()}
        </div>
      </div>
    </div>
  );
};

export default ClassroomScreen;
