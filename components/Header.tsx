
import React from 'react';
import { CarIcon } from '../constants';

interface HeaderProps {
    status: 'monitoring' | 'warning' | 'alert';
}

const statusConfig = {
    monitoring: { text: "MONITORING", color: "bg-brand-green", pulse: false },
    warning: { text: "HIGH RISK", color: "bg-brand-yellow", pulse: true },
    alert: { text: "ALERT", color: "bg-brand-red", pulse: true },
};

export const Header: React.FC<HeaderProps> = ({ status }) => {
    const { text, color, pulse } = statusConfig[status];

    return (
        <header className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
                <CarIcon />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    REFLEX
                </h1>
            </div>
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`}></div>
                <span className="text-sm font-semibold tracking-widest text-gray-300">{text}</span>
            </div>
        </header>
    );
};
