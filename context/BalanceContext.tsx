'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
    showBalance: boolean;
    toggleBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
    const [showBalance, setShowBalance] = useState<boolean>(true);

    useEffect(() => {
        // Load preference from localStorage on mount
        const saved = localStorage.getItem('showBalance');
        if (saved !== null) {
            setShowBalance(JSON.parse(saved));
        }
    }, []);

    const toggleBalance = () => {
        const newValue = !showBalance;
        setShowBalance(newValue);
        localStorage.setItem('showBalance', JSON.stringify(newValue));
    };

    return (
        <BalanceContext.Provider value={{ showBalance, toggleBalance }}>
            {children}
        </BalanceContext.Provider>
    );
}

export function useBalance() {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
}
