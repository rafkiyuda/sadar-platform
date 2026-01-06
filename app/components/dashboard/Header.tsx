import React from 'react';
import { AlertCircle } from 'lucide-react';

interface HeaderProps {
    status: 'SAFE' | 'DROWSY' | 'CRITICAL';
}

export const Header: React.FC<HeaderProps> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'CRITICAL': return 'text-red-500 border-red-500/30 bg-red-500/10';
            case 'DROWSY': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
            default: return 'text-green-500 border-green-500/30 bg-green-500/10';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'CRITICAL': return 'KRITIS';
            case 'DROWSY': return 'MENGANTUK';
            default: return 'AMAN';
        }
    };

    return (
        <div className="h-16 border-b border-gray-800 bg-black/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${getStatusColor()} transition-colors duration-300`}>
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium tracking-wide">Status Risiko: <span className="font-bold">{getStatusText()}</span></span>
            </div>

            <div className="flex gap-4">
                <div className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-400 font-mono">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};
