import React from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import { useDriverStore } from '@/app/lib/store/useDriverStore';

import { DriverStatus } from '@/app/types';

interface HeaderProps {
    status: DriverStatus;
}

export const Header: React.FC<HeaderProps> = ({ status }) => {
    const { currentAddress, currentCoords } = useDriverStore();
    const getStatusColor = () => {
        switch (status) {
            case 'CRITICAL': return 'text-red-500 border-red-500/30 bg-red-500/10';
            case 'DROWSY': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
            case 'NO_FACE': return 'text-slate-500 border-slate-500/30 bg-slate-500/10';
            case 'ALERT': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
            default: return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'CRITICAL': return 'KRITIS';
            case 'DROWSY': return 'MENGANTUK';
            case 'NO_FACE': return 'SEARCHING...';
            case 'ALERT': return 'AMAN';
            default: return 'AMAN';
        }
    };

    const getDisplayAddress = () => {
        return currentAddress || "Menara Astra, Sudirman, Jakarta Pusat";
    };

    return (
        <div className="h-20 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6 z-10 transition-colors duration-300">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${getStatusColor()} transition-colors duration-300 shadow-sm`}>
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium tracking-wide">Status Risiko: <span className="font-bold">{getStatusText()}</span></span>
            </div>

            <div className="flex gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full text-sm text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {getDisplayAddress()}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full text-sm text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

