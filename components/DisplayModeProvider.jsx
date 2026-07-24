"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const DisplayModeContext = createContext(null);

export function useDisplayMode() {
    const context = useContext(DisplayModeContext);
    if (!context) {
        throw new Error('useDisplayMode must be used inside DisplayModeProvider');
    }
    return context;
}

export default function DisplayModeProvider({ locale, children }) {
    const searchParams = useSearchParams();
    const hasExplicitMode = searchParams.get('view') === 'both';
    const [mode, setMode] = useState(hasExplicitMode ? 'both' : locale);

    useEffect(() => {
        const saved = window.localStorage.getItem('kristal-display-mode');
        if (!hasExplicitMode && (saved === 'en' || saved === 'zh' || saved === 'both')) {
            setMode(saved);
        }
    }, [hasExplicitMode]);

    useEffect(() => {
        document.documentElement.dataset.displayMode = mode;
    }, [mode]);

    const value = useMemo(() => ({
        mode,
        setMode: (nextMode) => {
            setMode(nextMode);
            window.localStorage.setItem('kristal-display-mode', nextMode);
        },
    }), [mode]);

    return (
        <DisplayModeContext.Provider value={value}>
            <div data-display-mode={mode}>{children}</div>
        </DisplayModeContext.Provider>
    );
}
