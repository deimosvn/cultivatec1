// ==========================================================
// UNIVERSE 4 - Industrial IDE Shell
// ==========================================================
// Interfaz seria tipo software industrial / IDE para el
// Universo Universidad. Menos colores, más menús técnicos,
// tipografía monoespaciada, paleta oscura.

import React, { useState } from 'react';
import { 
    Terminal, Code, FileText, Settings, Database, 
    ChevronRight, ChevronDown, Folder, File, 
    Award, BookOpen, Monitor, Cpu, ArrowLeft,
    Layers, GitBranch, Box, Activity
} from 'lucide-react';

const Universe4Shell = ({ onBack, userProfile, firebaseProfile }) => {
    const [activePanel, setActivePanel] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [terminalOpen, setTerminalOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', icon: Monitor, label: 'Dashboard', shortcut: 'Ctrl+D' },
        { id: 'certifications', icon: Award, label: 'Certificaciones', shortcut: 'Ctrl+C' },
        { id: 'projects', icon: Folder, label: 'Proyectos', shortcut: 'Ctrl+P' },
        { id: 'docs', icon: BookOpen, label: 'Documentación', shortcut: 'Ctrl+K' },
        { id: 'terminal', icon: Terminal, label: 'Terminal', shortcut: 'Ctrl+`' },
        { id: 'settings', icon: Settings, label: 'Configuración', shortcut: 'Ctrl+,' },
    ];

    const certifications = [
        { id: 'cert_1', name: 'Robótica Industrial Nivel 1', status: 'available', progress: 0, modules: 8, difficulty: 'Intermedio' },
        { id: 'cert_2', name: 'Automatización con PLC', status: 'locked', progress: 0, modules: 10, difficulty: 'Avanzado' },
        { id: 'cert_3', name: 'Visión Artificial', status: 'locked', progress: 0, modules: 12, difficulty: 'Avanzado' },
        { id: 'cert_4', name: 'ROS2 - Robot Operating System', status: 'locked', progress: 0, modules: 15, difficulty: 'Experto' },
        { id: 'cert_5', name: 'Control Embebido con STM32', status: 'locked', progress: 0, modules: 10, difficulty: 'Avanzado' },
        { id: 'cert_6', name: 'Machine Learning para Robótica', status: 'locked', progress: 0, modules: 14, difficulty: 'Experto' },
    ];

    const projectFiles = [
        { name: 'src/', type: 'folder', children: [
            { name: 'main.py', type: 'file', lang: 'python' },
            { name: 'robot_controller.py', type: 'file', lang: 'python' },
            { name: 'sensors.py', type: 'file', lang: 'python' },
        ]},
        { name: 'config/', type: 'folder', children: [
            { name: 'robot.yaml', type: 'file', lang: 'yaml' },
            { name: 'pins.json', type: 'file', lang: 'json' },
        ]},
        { name: 'README.md', type: 'file', lang: 'md' },
        { name: 'requirements.txt', type: 'file', lang: 'txt' },
    ];

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-[#D4D4D4] font-mono flex flex-col">
            {/* IDE Title Bar */}
            <div className="bg-[#323233] border-b border-[#3C3C3C] px-3 py-1.5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-[#858585] hover:text-white transition p-1">
                        <ArrowLeft size={14}/>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <Cpu size={14} className="text-[#EF4444]"/>
                        <span className="text-xs font-bold text-[#CCCCCC]">CultivaTec</span>
                        <span className="text-[10px] text-[#858585]">— Universidad</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#858585]">
                        {firebaseProfile?.username || 'engineer'}@cultivatec
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500"/>
                </div>
            </div>

            {/* Menu Bar */}
            <div className="bg-[#2D2D2D] border-b border-[#3C3C3C] px-2 py-0.5 flex items-center gap-0.5 flex-shrink-0">
                {['Archivo', 'Editar', 'Ver', 'Proyecto', 'Terminal', 'Ayuda'].map(item => (
                    <button key={item} className="px-2.5 py-1 text-[11px] text-[#CCCCCC] hover:bg-[#3C3C3C] rounded transition">
                        {item}
                    </button>
                ))}
            </div>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Activity Bar */}
                <div className="w-12 bg-[#252526] border-r border-[#3C3C3C] flex flex-col items-center py-2 gap-1 flex-shrink-0">
                    {menuItems.map(item => (
                        <button key={item.id}
                            onClick={() => setActivePanel(item.id)}
                            className={`w-10 h-10 flex items-center justify-center rounded transition group relative ${
                                activePanel === item.id
                                    ? 'text-white bg-[#37373D] border-l-2 border-[#EF4444]'
                                    : 'text-[#858585] hover:text-white'
                            }`}
                            title={`${item.label} (${item.shortcut})`}>
                            <item.icon size={18}/>
                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] border border-[#3C3C3C] rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                {item.label}
                                <span className="text-[#858585] ml-2">{item.shortcut}</span>
                            </div>
                        </button>
                    ))}
                    <div className="flex-1"/>
                    <button className="w-10 h-10 flex items-center justify-center text-[#858585] hover:text-white transition">
                        <Settings size={18}/>
                    </button>
                </div>

                {/* Sidebar */}
                {sidebarOpen && (
                    <div className="w-56 bg-[#252526] border-r border-[#3C3C3C] flex flex-col flex-shrink-0 overflow-y-auto">
                        <div className="px-3 py-2 text-[10px] font-bold text-[#858585] uppercase tracking-wider border-b border-[#3C3C3C]">
                            {activePanel === 'dashboard' && 'PANEL DE CONTROL'}
                            {activePanel === 'certifications' && 'CERTIFICACIONES'}
                            {activePanel === 'projects' && 'EXPLORADOR DE ARCHIVOS'}
                            {activePanel === 'docs' && 'DOCUMENTACIÓN'}
                            {activePanel === 'terminal' && 'SESIONES'}
                            {activePanel === 'settings' && 'CONFIGURACIÓN'}
                        </div>

                        {/* Sidebar Content based on panel */}
                        {activePanel === 'certifications' && (
                            <div className="p-2 space-y-1">
                                {certifications.map(cert => (
                                    <div key={cert.id}
                                        className={`p-2 rounded text-xs cursor-pointer transition ${
                                            cert.status === 'available'
                                                ? 'bg-[#37373D] hover:bg-[#3C3C3C] text-[#D4D4D4]'
                                                : 'text-[#585858] cursor-not-allowed'
                                        }`}>
                                        <div className="flex items-center gap-2">
                                            <Award size={12} className={cert.status === 'available' ? 'text-[#EF4444]' : 'text-[#585858]'}/>
                                            <span className="truncate font-bold">{cert.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[9px] text-[#858585]">{cert.modules} módulos</span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                                cert.difficulty === 'Experto' ? 'bg-red-500/20 text-red-400' :
                                                cert.difficulty === 'Avanzado' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>{cert.difficulty}</span>
                                        </div>
                                        {cert.status === 'locked' && (
                                            <span className="text-[9px] text-[#585858] mt-1 block">🔒 Bloqueado</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePanel === 'projects' && (
                            <div className="p-2">
                                {projectFiles.map((item, idx) => (
                                    <FileTreeItem key={idx} item={item} depth={0}/>
                                ))}
                            </div>
                        )}

                        {activePanel === 'dashboard' && (
                            <div className="p-2 space-y-2">
                                <div className="bg-[#37373D] rounded p-2">
                                    <div className="text-[9px] text-[#858585] uppercase mb-1">Estado del Sistema</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"/>
                                        <span className="text-[11px] text-green-400">Online</span>
                                    </div>
                                </div>
                                <div className="bg-[#37373D] rounded p-2">
                                    <div className="text-[9px] text-[#858585] uppercase mb-1">Certificaciones</div>
                                    <span className="text-lg font-bold text-[#EF4444]">0</span>
                                    <span className="text-[10px] text-[#858585]"> / {certifications.length}</span>
                                </div>
                                <div className="bg-[#37373D] rounded p-2">
                                    <div className="text-[9px] text-[#858585] uppercase mb-1">Horas de Lab</div>
                                    <span className="text-lg font-bold text-white">0h</span>
                                </div>
                                <div className="bg-[#37373D] rounded p-2">
                                    <div className="text-[9px] text-[#858585] uppercase mb-1">Proyectos</div>
                                    <span className="text-lg font-bold text-white">0</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="bg-[#252526] border-b border-[#3C3C3C] flex items-center overflow-x-auto flex-shrink-0">
                        <div className="flex items-center bg-[#1E1E1E] px-3 py-1.5 border-r border-[#3C3C3C] border-t-2 border-t-[#EF4444]">
                            <Monitor size={12} className="text-[#858585] mr-1.5"/>
                            <span className="text-xs text-white">Dashboard</span>
                        </div>
                        <div className="flex items-center px-3 py-1.5 border-r border-[#3C3C3C] hover:bg-[#2D2D2D] cursor-pointer">
                            <Terminal size={12} className="text-[#858585] mr-1.5"/>
                            <span className="text-xs text-[#858585]">Terminal</span>
                        </div>
                    </div>

                    {/* Editor / Dashboard Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {activePanel === 'dashboard' && (
                            <div className="space-y-4">
                                {/* Welcome Banner */}
                                <div className="bg-[#252526] border border-[#3C3C3C] rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded bg-[#EF4444]/20 flex items-center justify-center">
                                            <Cpu size={20} className="text-[#EF4444]"/>
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-white">Terminal de Certificaciones</h2>
                                            <p className="text-[10px] text-[#858585]">CultivaTec Universidad — Robótica Profesional</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#858585] leading-relaxed">
                                        Bienvenido al entorno profesional. Aquí encontrarás certificaciones industriales,
                                        documentación técnica, entornos de desarrollo y proyectos de grado en robótica avanzada.
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { label: 'Certificaciones', value: '0/6', icon: Award, color: '#EF4444' },
                                        { label: 'Horas Lab', value: '0h', icon: Activity, color: '#3B82F6' },
                                        { label: 'Proyectos', value: '0', icon: Box, color: '#10B981' },
                                        { label: 'Nivel', value: 'Junior', icon: GitBranch, color: '#A855F7' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#252526] border border-[#3C3C3C] rounded p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <stat.icon size={12} style={{ color: stat.color }}/>
                                                <span className="text-[9px] text-[#858585] uppercase">{stat.label}</span>
                                            </div>
                                            <span className="text-lg font-bold text-white">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Available Certifications */}
                                <div className="bg-[#252526] border border-[#3C3C3C] rounded-lg overflow-hidden">
                                    <div className="px-3 py-2 border-b border-[#3C3C3C] flex items-center gap-2">
                                        <Award size={12} className="text-[#EF4444]"/>
                                        <span className="text-xs font-bold text-white">Certificaciones Disponibles</span>
                                    </div>
                                    <div className="divide-y divide-[#3C3C3C]">
                                        {certifications.map(cert => (
                                            <div key={cert.id} className={`px-3 py-2.5 flex items-center gap-3 ${
                                                cert.status === 'available' ? 'hover:bg-[#2A2D2E] cursor-pointer' : 'opacity-40'
                                            }`}>
                                                <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                                    cert.status === 'available' ? 'bg-[#EF4444]/20' : 'bg-[#3C3C3C]'
                                                }`}>
                                                    {cert.status === 'locked' ? '🔒' : <Award size={14} className="text-[#EF4444]"/>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-xs font-bold text-[#D4D4D4] block truncate">{cert.name}</span>
                                                    <span className="text-[9px] text-[#858585]">{cert.modules} módulos — {cert.difficulty}</span>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {cert.status === 'available' ? (
                                                        <span className="text-[9px] px-2 py-1 rounded bg-[#EF4444]/20 text-[#EF4444] font-bold">INICIAR</span>
                                                    ) : (
                                                        <span className="text-[9px] text-[#585858]">Bloqueado</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-[#252526] border border-[#3C3C3C] rounded-lg p-3">
                                    <div className="text-xs font-bold text-white mb-2">Accesos Rápidos</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { label: 'Abrir Terminal', icon: Terminal, color: '#10B981' },
                                            { label: 'Documentación', icon: BookOpen, color: '#3B82F6' },
                                            { label: 'Nuevo Proyecto', icon: Folder, color: '#A855F7' },
                                            { label: 'Laboratorio Virtual', icon: Layers, color: '#EF4444' },
                                        ].map((action, i) => (
                                            <button key={i} className="flex items-center gap-2 p-2 rounded bg-[#37373D] hover:bg-[#3C3C3C] transition text-left">
                                                <action.icon size={14} style={{ color: action.color }}/>
                                                <span className="text-[11px] text-[#D4D4D4]">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Coming soon for other panels */}
                        {activePanel !== 'dashboard' && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-4xl mb-3 opacity-30">🏭</div>
                                    <p className="text-sm text-[#858585] font-bold">Contenido en desarrollo</p>
                                    <p className="text-xs text-[#585858] mt-1">Este módulo estará disponible próximamente</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Terminal Panel */}
                    {terminalOpen && (
                        <div className="h-32 border-t border-[#3C3C3C] bg-[#1E1E1E] flex flex-col flex-shrink-0">
                            <div className="px-3 py-1 bg-[#252526] border-b border-[#3C3C3C] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal size={12} className="text-[#858585]"/>
                                    <span className="text-[10px] text-[#858585]">TERMINAL</span>
                                </div>
                                <button onClick={() => setTerminalOpen(false)} className="text-[#858585] hover:text-white">
                                    <ChevronDown size={14}/>
                                </button>
                            </div>
                            <div className="flex-1 p-2 overflow-y-auto">
                                <div className="text-[11px] text-[#10B981] font-mono">
                                    <span className="text-[#858585]">cultivatec@university:</span>
                                    <span className="text-[#569CD6]">~</span>
                                    <span className="text-white">$ </span>
                                    <span className="text-[#D4D4D4]">python3 robot_init.py</span>
                                </div>
                                <div className="text-[11px] text-[#858585] font-mono mt-1">
                                    [INFO] CultivaTec Robot Framework v4.0
                                </div>
                                <div className="text-[11px] text-[#858585] font-mono">
                                    [INFO] Inicializando entorno de desarrollo...
                                </div>
                                <div className="text-[11px] text-[#10B981] font-mono mt-1 flex items-center gap-1">
                                    <span className="text-[#858585]">cultivatec@university:</span>
                                    <span className="text-[#569CD6]">~</span>
                                    <span className="text-white">$ </span>
                                    <span className="animate-pulse">▊</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Bar */}
                    <div className="bg-[#EF4444] px-3 py-0.5 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white font-bold flex items-center gap-1">
                                <GitBranch size={10}/> main
                            </span>
                            <span className="text-[10px] text-white/80">
                                0 errores, 0 advertencias
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white/80">Python 3.11</span>
                            <span className="text-[10px] text-white/80">UTF-8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// File tree item component
const FileTreeItem = ({ item, depth }) => {
    const [isOpen, setIsOpen] = useState(depth === 0);
    const indent = depth * 12;

    if (item.type === 'folder') {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-1 py-1 px-1 hover:bg-[#37373D] rounded text-xs transition"
                    style={{ paddingLeft: `${indent + 4}px` }}>
                    <ChevronRight size={10} className={`text-[#858585] transition-transform ${isOpen ? 'rotate-90' : ''}`}/>
                    <Folder size={12} className="text-[#C09553]"/>
                    <span className="text-[#D4D4D4]">{item.name}</span>
                </button>
                {isOpen && item.children?.map((child, i) => (
                    <FileTreeItem key={i} item={child} depth={depth + 1}/>
                ))}
            </div>
        );
    }

    const langColors = {
        python: '#3572A5',
        yaml: '#CB171E',
        json: '#F7DF1E',
        md: '#083FA1',
        txt: '#858585',
    };

    return (
        <button
            className="w-full flex items-center gap-1 py-1 px-1 hover:bg-[#37373D] rounded text-xs transition"
            style={{ paddingLeft: `${indent + 16}px` }}>
            <File size={12} style={{ color: langColors[item.lang] || '#858585' }}/>
            <span className="text-[#D4D4D4]">{item.name}</span>
        </button>
    );
};

export default Universe4Shell;
