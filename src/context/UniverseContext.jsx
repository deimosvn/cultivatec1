// ==========================================================
// UNIVERSE CONTEXT - State Management
// ==========================================================
// Gestiona el universo actual, rol del usuario y navegación
// entre universos.
//
// Estados rastreados:
//   - currentUniverse: índice del universo activo (0-3)
//   - userRole: 'primary' | 'secondary' | 'preparatory' | 'university'
//   - showUniverseMap: si mostrar el mapa de universos (portales)
//   - diagnosticCompleted: si el usuario ya hizo el examen diagnóstico

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UNIVERSES, USER_ROLES, ROLE_TO_UNIVERSE } from '../data/universesData';

const UniverseContext = createContext(null);

export function UniverseProvider({ children }) {
    // Intentar cargar estado persistido
    const [currentUniverse, setCurrentUniverse] = useState(() => {
        try {
            const saved = localStorage.getItem('cultivatec_currentUniverse');
            return saved !== null ? parseInt(saved, 10) : null; // null = no seleccionado, mostrar mapa
        } catch { return null; }
    });

    const [userRole, setUserRole] = useState(() => {
        try {
            return localStorage.getItem('cultivatec_userRole') || null;
        } catch { return null; }
    });

    const [diagnosticCompleted, setDiagnosticCompleted] = useState(() => {
        try {
            return localStorage.getItem('cultivatec_diagnosticCompleted') === 'true';
        } catch { return false; }
    });

    const [showUniverseMap, setShowUniverseMap] = useState(() => {
        // Mostrar mapa si no hay universo seleccionado
        return currentUniverse === null;
    });

    // Persistir cambios
    useEffect(() => {
        try {
            if (currentUniverse !== null) {
                localStorage.setItem('cultivatec_currentUniverse', currentUniverse.toString());
            } else {
                localStorage.removeItem('cultivatec_currentUniverse');
            }
        } catch {}
    }, [currentUniverse]);

    useEffect(() => {
        try {
            if (userRole) localStorage.setItem('cultivatec_userRole', userRole);
        } catch {}
    }, [userRole]);

    useEffect(() => {
        try {
            localStorage.setItem('cultivatec_diagnosticCompleted', diagnosticCompleted.toString());
        } catch {}
    }, [diagnosticCompleted]);

    // Seleccionar un universo (entrar por portal)
    const enterUniverse = useCallback((universeIndex) => {
        if (universeIndex >= 0 && universeIndex < UNIVERSES.length) {
            setCurrentUniverse(universeIndex);
            setShowUniverseMap(false);
        }
    }, []);

    // Volver al mapa de universos
    const exitToUniverseMap = useCallback(() => {
        setCurrentUniverse(null);
        setShowUniverseMap(true);
    }, []);

    // Asignar rol tras diagnóstico
    const assignRole = useCallback((role, autoNavigate = true) => {
        setUserRole(role);
        setDiagnosticCompleted(true);
        if (autoNavigate) {
            const targetUniverse = ROLE_TO_UNIVERSE[role] ?? 1;
            enterUniverse(targetUniverse);
        }
    }, [enterUniverse]);

    // Resetear diagnóstico (para testing o cambio de rol)
    const resetDiagnostic = useCallback(() => {
        setUserRole(null);
        setDiagnosticCompleted(false);
        setCurrentUniverse(null);
        setShowUniverseMap(true);
        try {
            localStorage.removeItem('cultivatec_userRole');
            localStorage.removeItem('cultivatec_diagnosticCompleted');
            localStorage.removeItem('cultivatec_currentUniverse');
        } catch {}
    }, []);

    // Obtener configuración del universo actual
    const currentUniverseConfig = currentUniverse !== null ? UNIVERSES[currentUniverse] : null;

    // Determinar si la UI debe ser "industrial" (Universo 4)
    const isIndustrialUI = currentUniverseConfig?.uiTheme === 'industrial';

    const value = {
        // Estado
        currentUniverse,
        userRole,
        diagnosticCompleted,
        showUniverseMap,
        currentUniverseConfig,
        isIndustrialUI,
        universes: UNIVERSES,

        // Acciones
        enterUniverse,
        exitToUniverseMap,
        assignRole,
        resetDiagnostic,
        setShowUniverseMap,
    };

    return (
        <UniverseContext.Provider value={value}>
            {children}
        </UniverseContext.Provider>
    );
}

export function useUniverse() {
    const context = useContext(UniverseContext);
    if (!context) {
        throw new Error('useUniverse must be used within a UniverseProvider');
    }
    return context;
}

export default UniverseContext;
